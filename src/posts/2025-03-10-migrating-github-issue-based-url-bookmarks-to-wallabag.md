---
layout: post
title: Migrating GitHub issue based URL bookmarks to wallabag
date: 2025-03-10
tags:
  - github
  - wallabag
  - self-hosting
  - curl
  - jq
  - oauth
  - apis
  - docker
  - tailscale
  - tsdproxy
  - gh
  - shell
---
_In this post I outline how I migrated my collection of reading list bookmarks, stored as issues in a GitHub repo, to wallabag which I'm now self-hosting._

<a name="background"></a>
## Background

I use [Miniflux](https://miniflux.app/) for managing and reading posts from blogs to which I've subscribed, and it works very well. For the ad hoc articles and posts that I come across more generally and that I've wanted to bookmark for later reading, I've been using a GitHub repo [url-notes](https://github.com/qmacro-org/url-notes), with a bookmarklet that I used to save an article as an issue:

```javascript
javascript:(function () { window.open( 'https://github.com/qmacro-org/url-notes/issues/new?body=%27+encodeURIComponent(location.href)+%27&title=%27+encodeURIComponent(document.title) );})()
```

This sets the issue title to the article's title, and sets the article's URL as the (only) content in the body of the issue.

In this solution there's also an [automated mechanism](https://github.com/qmacro-org/url-notes/blob/main/.github/workflows/toot-url-note.yml) for tooting any notes I make on a post once I've read it and closed the issue. Here's [an example toot](https://hachyderm.io/deck/@qmacro/113867500376198345) for the URL bookmark and notes in [issue 552](https://github.com/qmacro-org/url-notes/issues/552). This was a bonus feature that I wasn't going to try to reproduce in the new wallabag based solution.

<a name="self-hosting"></a>
## Self hosting

I am trying to reduce my reliance on third party services and also improve my actual consumption of bookmarked articles, and after a brief search for a self-hosted bookmarking service I came across the "read it later" app [wallabag](https://doc.wallabag.org/) which seemed ideal, especially as I could host it [as a Docker container](https://doc.wallabag.org/admin/installation/installation/#installation-with-docker).

I went for the SQLite option to keep things simple, using a Docker volume for persistency. Here's my compose file:

```yaml
services:
  wallabag:
    container_name: wallabag
    labels:
      tsdproxy.enable: "true"
    image: wallabag/wallabag
    restart: unless-stopped
    environment:
      - SYMFONY__ENV__DOMAIN_NAME=https://wallabag.secret.ts.net
      - SYMFONY__ENV__FOSUSER_REGISTRATION=true
      - SYMFONY__ENV__FOSUSER_CONFIRMATION=false
      - SYMFONY__ENV__SERVER_NAME="wallabag"
    ports:
      - "8060:80"
    volumes:
      - data:/var/www/wallabag/data
      - images:/var/www/wallabag/web/assets/images
    healthcheck:
      test: ["CMD", "wget" ,"--no-verbose", "--tries=1", "--spider", "http://localhost/api/info"]
      interval: 1m
      timeout: 3s
volumes:
  data:
  images:
```

> I'm using Tailscale (it's one of two key services I install automatically on every device I set up, the other being Docker) and use the excellent [TSDProxy](https://almeidapaulopt.github.io/tsdproxy/) to have my containers available on my tailnet and served via TLS certificates (i.e. via HTTPS).

Some notes on the compose file:

* To have this container appear via HTTPS on my tailnet, I am uing the label `tsdproxy.enable`
* While I'm mapping wallabag's natural port 80 to 8060, TSDProxy will automatically make that 443 (i.e. the default for HTTPS) so that I don't need to specify a port in the URL when using it in the browser
* The `DOMAIN_NAME` env var value needs to be the "base" URL for what you're going to use as it is used to construct URLs for CSS and other assets (see [my comments on this issue](https://github.com/wallabag/wallabag/issues/7953#issuecomment-2708991178) for more info)
* There's a default user `wallabag` with a default password but I wanted to use my own username; the option in the UI to register a new user is not shown by default, hence the `FOSUSER_REGISTRATION` env var here set to to `true` explicitly (I also changed the password of the default user for security reasons, via the UI, once I'd logged in)
* To avoid any messing about with email server configuration, I turned off the email based new user confirmation flow with `FOSUSER_CONFIGURATION` set to `false`
* The `secret` part of my tailnet domain name masks the real value for security reasons

After adding a few test articles, this is what my wallabag UI looked like:

![screenshot of my wallabag UI](/images/2025/03/wallabag-screenshot.png)

<a name="normal-operation"></a>
## Normal operation

Before I get to the migration notes, just a quick note on what I intend to do in in normal circumstances as I come across articles and posts I want to bookmark.

I installed the [wallabagger Chrome extension](https://chromewebstore.google.com/detail/wallabagger/gbmgphmejlcoihgedabhgjdkcahacjlj?hl=en) and the Android app [wallabag](https://play.google.com/store/apps/details?id=fr.gaulupeau.apps.InThePoche), aka "In The Poche". Both seem to work very well and allow me to easily save URLs to wallabag.

For both the Chrome extension and the Android app I had to create OAuth credentials as they're effectively API clients. wallabag has a very well thought out [API](https://app.wallabag.it/api/doc/), which is [protected via OAuth](https://doc.wallabag.org/developer/api/oauth/).

Here they are listed in the API clients management section of the configuration part of the UI (you can also see a third client "Command line" which I created for the migration work which is described next):

![the API clients management section of the config part of the UI](/images/2025/03/wallabag-api-ui.png)

<a name="migrating-existing-bookmarks"></a>
## Migrating existing bookmarks

In fact, it was the API that made it easy for me to bring across all the URLs I'd bookmarked in my existing "url-notes" repo based solution, specifically using the `POST` method on the `/api/entries` [API endpoint](https://app.wallabag.it/api/doc/#post--api-entries.%7b_format%7d).

This endpoint offers a number of parameters, the main one being `url` to specify the article's URL, but I used another two to store some context (that the entry was originally in this "url-notes" system):

* `origin_url` - where I specified the "url-notes" repo issue URL (which contains the issue number which is what I wanted)
* `tags` - where I specified the tag `url-notes` to indicate where the bookmark came from

> I didn't want hundreds of unique issue number tags, hence the split between these two parameters.

You can actually see the `url-notes` tag on the first three of the items in the wallabag UI screenshot earlier, from some initial manual API call testing.

As this was going to be a one-off exercise, I didn't bother to write a permanent script, opting instead to just perform the steps on the command line using the power of the shell, trying to channel the style of the great Brian Kernighan in the awesome [AT&T Archives: The UNIX Operating System](https://youtu.be/tc4ROCJYbm0?si=Y9qWLKN8UqXORAIm&t=260) video, with my legs resting on the desk and the keyboard on my lap:

![The great Brian Kernighan](/images/2025/03/brian-kernighan-keyboard-on-lap.png)

<a name="retrieving-the-url-notes-issue-based-bookmarks"></a>
### Retrieving the "url-notes" issue based bookmarks

I used the excellent GitHub CLI tool [gh](https://github.com/cli/cli) to retrieve the details of the open issues, saved them and peeked at the first few to check everything was in order:

```shell
gh issue list --json body,url --limit 1000 \
  | tee issues.json \
  | jq '.[:3]'
```

This created `issues.json` with all entries, and also emitted:

```json
[
  {
    "body": "https://secondphase.com.au/seven-reasons-sap-tech-failing/",
    "url": "https://github.com/qmacro-org/url-notes/issues/564"
  },
  {
    "body": "https://github.blog/open-source/git/working-with-submodules/",
    "url": "https://github.com/qmacro-org/url-notes/issues/563"
  },
  {
    "body": "https://piannaf.com/blog/self-hosted-twitter-archive-with-github-pages-subdomain/",
    "url": "https://github.com/qmacro-org/url-notes/issues/562"
  }
]
```

At this point I had everything I needed from a source data perspective.

<a name="generating-an-access-token-for-the-api-calls"></a>
### Generating an access token for the API calls

As mentioned earlier, the API [is protected via OAuth](https://doc.wallabag.org/developer/api/oauth/) and so I created a new client definition using the API clients management section of the UI, and called it "Command line" (you can see the entry in the screenshot earlier).

The creation gave me a client ID and client secret with which I requested an access token:

```shell
curl \
  --url 'https://wallabag.secret.ts.net/oauth/v2/token' \
  --data grant_type=password \
  --data client_id=3_5r9nw8bucwcos... \
  --data client_secret=nrn7junh0pw4sgo... \
  --data username=dj \
  --data-urlencode password='supersekrit'
```

This returned something like this:

```json
{
  "access_token": "N2RkM2FjZmRkM...",
  "expires_in": 3600,
  "token_type": "bearer",
  "scope": null,
  "refresh_token": "ODg4NjA2YTMyN2..."
}
```

The one hour validity (3600 seconds) was plenty of time but it was nice to get a refresh token too in case I needed it.

<a name="feeding-in-the-bookmarks"></a>
### Feeding in the bookmarks

At this point I had everything ready, and it was just a case of looping through the bookmarks in `issues.json` and making an API call for each one, to load into wallabag:

```shell
jq -r '.[]|[.body,.url]|@tsv' issues.json \
| while read -r url origin_url
do
  curl \
    --url 'https://wallabag.tail92f5b.ts.net/api/entries.json' \
    --header 'Authorization: Bearer N2RkM2FjZmRk...' \
    --data url="$url" \
    --data origin_url="$origin_url" \
    --data tags='url-notes'
  sleep 0.5
done
```

A short while later, they were all loaded, all 400+ of them:

![441 unread entries](/images/2025/03/wallabag-unread-entries.png)

<a name="tidying-up"></a>
### Tidying up

I wanted to close all the issues I migrated, which I did like this:

```shell
jq -r '.[].url' issues.json \
| while read -r issue
do
  gh issue close $issue
  sleep 1
done
```

The `gh issue close` command accepts an issue number or URL, which is great. The output is also nice and clean, which is pleasing to look at too:

```log
✓ Closed issue #564 (The Seven Reasons Your SAP Tech Initiatives Are Failing — Second Phase Solutions)
✓ Closed issue #563 (Working with submodules - The GitHub Blog)
✓ Closed issue #562 (Self Hosting Twitter Archive on Github Pages | Justin Mancinelli)
...
```

> I could have done this in the same loop as when [feeding in the bookmarks](#feeding-in-the-bookmarks), dependent on the outcome of the API calls, but in the end I did it separately.

## Wrapping up

So far I've been very impressed with wallabag - its functionality, the support for running in a Docker container, the documentation and the API too. Now all I have to do is actually get round to reading those bookmarked articles!
