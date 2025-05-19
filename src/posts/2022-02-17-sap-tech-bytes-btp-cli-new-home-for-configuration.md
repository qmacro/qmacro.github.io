---
layout: post
title: "SAP Tech Bytes: btp CLI - new home for configuration"
date: 2022-02-17
tags:
  - sapcommunity
  - btp
  - cli
---
*Be informed about updates to where the btp CLI configuration is stored
by default.*

This post relates directly to the [SAP Tech Bytes: btp CLI -- managing
configuration](/blog/posts/2021/09/14/sap-tech-bytes:-btp-cli-managing-configuration/)
post, and provides a brief update to the information in there.

## Latest version

Since that post, the btp CLI has gone through a number of updates. One
of these updates has been to where configuration is stored (and looked
for) by default. This is independent of your runtime environment; while
the previous post showed an example in the SAP Business Application
Studio (App Studio), this update applies to all contexts where you run
the latest version of the btp CLI.

At the time of writing, according to the information in the [canonical
home for the btp CLI](https://tools.hana.ondemand.com/#cloud), the
latest version of the btp CLI is 2.14.0:

![](/images/2022/02/screenshot-2022-02-17-at-11.38.37.png)

This is also what the `getbtpcli` script reports (see [SAP Tech Bytes:
btp CLI -
installation](/blog/posts/2021/09/01/sap-tech-bytes:-btp-cli-installation/)
for more on this utility):

```shell
; getbtpcli --test
Version is 2.14.0
```

## New location

The main btp CLI configuration is stored in a file called `config.json`.
There are sometimes other files that contain configuration too, and
these, along with `config.json`, are stored by default in a directory
called `.btp/`.

In the past, the default location for this `.btp/` directory was in a
`.cache/` directory in your home directory. So for me, while working in
my local dev container, would have been, *previously*:

```text
# /home/user
; tree .cache/.btp
.cache/.btp
|-- autocomplete
|   `-- scripts
|       `-- sapbtpcli-autocomplete.plugin.sh
`-- config.json
```

(here you can see examples of other files alongside `config.json`).

There is now a new default location.

Instead of `.cache/`, the default location for `.btp/` is now 
`.config/`. So now it looks like this:

```text
# /home/user
; tree .config/.btp
.config/.btp
|-- autocomplete
|   `-- scripts
|       `-- sapbtpcli-autocomplete.plugin.sh
`-- config.json
```

This is a great move because it aligns with the [XDG Base Directory
Specification](https://specifications.freedesktop.org/basedir-spec.latest.html)
which I mentioned in the [previous
post](https://blogs.sap.com/2021/09/14/sap-tech-bytes-btp-cli-managing-configuration/).

## New environment variable

Not only has the default location changed from `.cache/` to `.config/`,
but also the environment variable that you can set to tell the btp CLI
where your configuration is, has changed too.

Previous it was `SAPCP_CLIENTCONFIG`. This reflected the name of the btp
CLI at the time (`sapcp`).

It is now `BTP_CLIENTCONFIG`, which reflects the current name of the btp
CLI of course.

## My configuration location

As I mentioned in the [SAP Tech Bytes: btp CLI - managing
configuration](/blog/posts/2021/09/14/sap-tech-bytes:-btp-cli-managing-configuration/)
post, I like to organise my configuration directories within my
`XDG_CONFIG_HOME` location (i.e. `$HOME/.config/`) according to the name
of the tool or utility, but as normal directories, rather than hidden
ones (the period at the start of the `.btp/` directory name means that
it is to be treated as a hidden directory).

This is what the contents of my `$HOME/.config/` directory looks like:

```shell
; ls .config
./ btp/ g/ htop/ procps/ tmuxinator/
../ configstore/ gcloud/ kitty/ ranger/ vim/
asciinema/ docker/ gh/ lf/ so/ weechat/
autocomplete/ exercism/ gitui/ newsboat/ stack/ yamllint/
```

Note that my btp CLI configuration directory is not hidden, i.e. it's
`btp/` rather than `.btp/`. That's my personal choice, and I use the
`BTP_CLIENTCONFIG` environment variable to tell the btp CLI that this is
where I have my configuration:

## Moving over

If you're still using `SAPCP_CLIENTCONFIG`, don't worry - there's a
grace period; the btp CLI will still honour the use of this environment
variable, to give you time to change over to `BTP_CLIENTCONFIG`. But
I'd encourage you to do that soon!

---

![](/images/2021/02/screenshot-2021-02-22-at-11.00.25.png)

SAP Tech Bytes is an initiative to bring you bite-sized information on
all manner of topics, in
[video](https://www.youtube.com/playlist?list=PL6RpkC85SLQC3HBShmlMaPu_nL--4f20z)
and [written](https://community.sap.com/t5/tag/sap-tech-bytes/tg-p) format. Enjoy!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/sap-tech-bytes-btp-cli-new-home-for-configuration/ba-p/13533660)
