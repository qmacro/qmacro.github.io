---
layout: post
title: "Monday morning thoughts: upload / download in a cloud native world"
date: 2018-04-16
tags:
  - sapcommunity
  - mondaymorningthoughts
---

This weekend I was exploring some Cloud Foundry features on the SAP
Cloud Platform (SCP) and came across a pattern that is pretty much
everywhere - not only within the SAP space but far beyond too. It got me
thinking of whether this pattern will remain, or be replaced (or at
least augmented) by something more - in my mind - cloud native.

## The upload / download pattern

This pattern is the upload / download pattern for transferring artifacts
"up to" the cloud or "down from" the cloud. An example (the one I
can across this weekend) is shown in the screenshot here:

![](/images/2018/04/Screen-Shot-2018-04-16-at-06.15.41.png)

It's clear that this pattern is pervasive, I see it in all sorts of
situations. And I'm wondering if I'm thinking in too extreme a manner
when I say that the assumed presence of a workstation-local filesystem
(from which artifacts can be uploaded to the cloud, or to which they can
be downloaded from the cloud) is something from which we'll be able to
free ourselves.

But first, do we want to free ourselves from that?

## Mainframe dinosaur

It's not a secret that I'm an old mainframe dinosaur, cutting my work
computing teeth on IBM big iron at the first company I worked for after
finishing my degree. Moreover, during my degree I used various
minicomputers, such as Vaxen\*, while moonlighting in the computer lab
and earning money programming for insurance companies in my spare time.
Even before that, my first exposure to computing was [at school where we
had a PDP-11 with paper terminals](/blog/posts/2020/11/03/computer-unit-1979/#superterm).

\*yes, that's the colloquial plural for Vax machines.

So my view on what a computer is has been strongly shaped by my
experiences sitting at workstations that looked like this:

![](/images/2018/04/DEC-VT320-0a.jpg)

or this:

![](/images/2018/04/Screen-Shot-2018-04-16-at-06.24.24.png)

or this:

![](/images/2018/04/Screen-Shot-2018-04-16-at-06.32.29.png)

(I've spent many years in front of each of these).

One obvious common factor was that these terminals were known as
"dumb", in that they had no real local processing power of their own.
Which also implies no local filesystem.

## The new mainframe

More recently I've been adopting the excellent Chrome OS, on various
devices including the Chrome Pixelbook, as my go-to platform, as it's
the nearest I've got to the nature of the mainframe which is my ideal
scenario, even tweeting about my experiences and thoughts with the
[#webterminals](https://twitter.com/search?q=%23webterminal%20OR%20%23webterminals&src=typd)
hashtag.

While I use my work laptop (running macOS) during the week, at the
weekend I switch to what I consider the future of computing, which is my
Chrome OS device, and which, for consistency, I'm going to refer to as
my "web terminal" for the rest of this post. Yes, this particular web
terminal has some local computing power, of course (it's Linux
underneath) but to me, storage of anything other than ephemeral files
such as screenshots seems like a warning "smell" to me.

So when I came across the UI at the top of this post, on my web
terminal, I paused. I'd been developing my app, that I'd wanted to
deploy, not locally on the web terminal, but on a virtual server,
provided to me (for free) in the form of the Google Cloud Shell:

![](/images/2018/04/Screen-Shot-2018-04-16-at-06.43.05.png)

So when it came to deploying this app to the cloud, there was a
mismatch - my app's artifacts were also in the cloud, on a "virtual
local" machine, rather than on the web terminal itself. There was no
"down" to browse to, nor upload from. Well, of course, there is with
this Chrome OS based web terminal - generally, the facility to upload
local files via a web browser to a server is indeed a marvellous one,
but in this case, I deliberately had no local files.

## A pragmatic but short-term solution

So this got me thinking. At least, from a practical, short-term
perspective, I was able to download files from the Google Cloud Shell to
the storage area on my web terminal, and then browse to that storage
area and upload them:

![](/images/2018/04/Screen-Shot-2018-04-16-at-06.47.56.png)

Quite a round-about journey for the artifacts themselves.

But over a cup of coffee, it got me thinking. Will there be alternative
solutions for true cloud native computing? That's my interpretation of
"cloud native", by the way - where we progress (i.e. return
positively, rather than regress) to the original mainframe era.\*

\*That's extreme thinking, I know, and deliberately so, but there you
have it.

Will there be facilities to say "go and find this file on this virtual
machine", exposed perhaps via a short-lived HTTP connection that's
spun up for that very purpose and then destroyed again?

Of course, we have this facility already in slightly different
circumstances, in the form of git-based deployments. Look at how, for
example, we can move artifacts from design time in the SAP Web IDE to
runtime on the SCP, via git.

Perhaps that's the answer longer term too - provide two alternatives
for deployment sources - a file upload facility as we saw in the first
screenshot at the top of this post, but also a source code control
endpoint - perhaps a special "one time use" endpoint with an opaque
GUID. This is not something that exists today of course - we have to
have the itch to scratch, to see it built.

## Further thoughts

I'm not sure what the answer is. I'm not even sure this is a
significant and widespread problem today. It just appears to me that any
sort of upload / download from a workstation-local filesystem doesn't
feel right to me long term.

I know folks like their local computing power, and who am I to deny them
that? What are your thoughts? I'd love to hear them.

---

This post was brought to you by birdsong in the early dawn, and a nice
cup of tea.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-upload-download-in-a-cloud-native-world/ba-p/13378369)
