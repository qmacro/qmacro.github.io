---
layout: post
title: "Monday morning thoughts: cloud native"
date: 2018-03-26
tags:
  - sapcommunity
  - mondaymorningthoughts
---

This weekend I discovered that one of my favourite online REPLs\* -
[repl.it](https://repl.it) - has a new feature where you can build and
publish a website on a repl.it subdomain:

![](/images/2018/03/Screen-Shot-2018-03-26-at-08.15.17.png)

\*REPL: [Read Evaluate Print
Loop](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) -
an interactive language shell

I've used repl.it to explore language such as Clojure and Haskell, for
various purposes, including the basis for a talk I gave at
[Manchester's Lambda Lounge](http://www.lambdalounge.org.uk/) last
year: "[Discovering the beauty of recursion and pattern
matching](https://docs.google.com/presentation/d/1zpN8150gIiYEC-o_Nc35T3xshXJIorEBEcjaarSw9z8/edit#slide=id.p)":

![](/images/2018/03/Screen-Shot-2018-03-26-at-08.20.02-1.png)

## A brief history

The new repl.it feature allows us to create a set of site artifacts,
structured into directories, and have them hosted and served by
repl.it's infrastructure. I immediately thought of the options to host
UI5 based demo apps. One page apps that are built with MVC,
internationalisation and other features are necessarily complex in
structure, in that there's a lot of moving parts.

Quite a few years ago now I realised I could include XML view
definitions and JavaScript controller scripts inside a single HTML file,
using custom `<script>` tags. That extended to the use of JSBin, which
has supported OpenUI5 for a while now (see "[Small steps: OpenUI5
toolkit now in
jsbin.com](/blog/posts/2014/03/04/small-steps-openui5-toolkit-now-in-jsbin.com/)"),
like in this layout
example: <http://jsbin.com/gatan/edit?html,js,output>.

But the ability to create and serve UI5 apps, resplendent in their
multi-artifact construction, still remained a desire, which was
fulfilled with the advent of Plunkr, similar to JSBin. See this post
from denise.nepraunig.sap for more details on UI5 with Plunkr:
"[Quickly tinker around with SAPUI5
examples](https://blogs.sap.com/2015/01/04/quickly-tinker-around-online-with-sapui5-explored-examples/)".

## The online experience

But I digress. The new repl.it experience isn't a revolution, more an
evolution. It is, nevertheless, a very nice experience:

![](/images/2018/03/Screen-Shot-2018-03-26-at-08.47.34.png)

(Yes, this is a little UI5 app that was inspired by meredith.hassett 's
recent #APIFriday post "[Building your Developer Profile -- GitHub 
UI5](https://blogs.sap.com/2018/03/22/building-your-developer-profile-github-ui5/)").

I'm mindful of the tools I use with kids [at the local Primary
School](https://twitter.com/qmacro/status/976761337874350081) and at
[Manchester CoderDojo](http://mcrcoderdojo.org.uk/). All the teaching I
do, from Google Apps Script, to JavaScript, Scratch and even UI5, is
done online. All the kids need is a laptop with enough battery, a
connection to the wifi, and a browser.

This is a theme I've followed myself for a good few years, moving a
long time ago "to the cloud" with Google productivity tools and
latterly with ad hoc tools such as repl.it and of course the excellent
[SAP Web IDE](https://cloudplatform.sap.com/dmp/capabilities/us/product/SAP-Web-IDE/9e5c9d90-e8e0-4e82-aed2-09087a10c973).
Some of you who interact with me on Twitter will know that I recently
spent a whole two months using Chrome OS almost exclusively.

So the repl.it offering fits right into the online experience funnel
I'm used to. In all that time with Chrome OS I never needed to reach to
another laptop to do anything other than connect my running watch with
the TomTom app that updated it with new "quick GPS" data (since then
I've discovered that the new version of the app on my phone can do that
now too). Of course, that doesn't mean I've eschewed the command
line - far from it. I've a [Google Cloud
Shell](https://cloud.google.com/shell/docs/) (free) which gives me a
persistent and comfortable working shell environment, with all the
amenities one would expect - tmux, vim, the Google Cloud SDK, the Google
Cloud Functions emulator, ngrok and even the [SAP Cloud Platform Neo
environment SDK / console
client](https://tools.hana.ondemand.com/#cloud) (the latter two I
installed separately, and I have my own configurations for tmux and vim
of course).

![](/images/2018/03/Screen-Shot-2018-03-26-at-08.46.27.png)

## Cloud native

So anyway, all this got me thinking, on my run this morning. We're
moving to cloud native architectures with the Cloud Platform offerings.
Interaction is undeniably moving further and further online. That
interaction extends to the architecture and development topics, the
latter exemplified with the experience I've had thus far.

So I'm wondering: how do we define cloud native? What is the
experience, and is it obvious when we see it? It's clear to me, when I
spend pretty much my entire day (modulo Outlook) online, in browser
windows, where I find myself developing and deploying code, creating
content, and configuring interconnectivity and routing with my [Cloud
Platform Technican](https://web.archive.org/web/20171125202429/http://events.sap.com/teched/en/session/36915)'s
hat on.

Heck, I conceived, built and deployed the artifacts for, and wrote the
content for the 10-part series on the SAP Cloud Platform Workflow
service ("[Discovering SCP
Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/)")
all online.

With the advent and growth of SAP S/4HANA Cloud, and the PaaS and SaaS
tools and facilities that are growing around it to support
implementations, customisations and extensions, the cloud native
experience is only going to grow. Yes, there are also processes and
activities that require local installations of software, most notably
for me is the ABAP Developer Tools in Eclipse and of course the
venerable SAPGUI itself. But these appear as exceptions in my eyes,
rather than the future normal.

What does cloud native mean to you? What defines it for development, for
architecture, for our present and future enterprise solutions? I'd love
to hear your thoughts via the comments section below.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-cloud-native/ba-p/13355894)
