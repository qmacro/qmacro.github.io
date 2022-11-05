---
layout: post
title: BSP: Mangled URL Decoder
date: 2003-10-17
tags:
  - sapcommunity
---
The BSP mangles URLs. Deep down. In [BSP In-Depth: URL Mangling](https://blogs.sap.com/2003/09/30/bsp-in-depth-url-mangling/), Brian McKellar did a splendid job of both feeding hunger for information and increasing one’s appetite. He mentioned the BSP application `decode_url` which shows you what the gunk in the rewritten (mangled) URL actually is. Unfortunately, my free trial WAS system is at release 6.10 and doesn’t contain `decode_url`.

“Shame”, I thought, first of all. Then: “Great!”. A perfect excuse to have a rummage around in the BSP’s guts. I was curious as to how this particular thing worked, and spent a pleasant hour or so in my favourite tool, the trusty ABAP debugger (kudos to the debugger team at SAP time and time again!). My aim was to write my own version of `decode_url`.

I found a clue in `CL_BSP_RUNTIME` – I knew it had to be somewhere in the BSP classes, and noticed that `ON_CHECK_REWRITE` called the suspiciously named `CL_HTTP_UTILITY=>FIELDS_TO_STRING`. Following the trail, I eventually landed on `CL_HTTP_UTILITY=>STRING_TO_FIELDS` (well, it *had* to exist, hadn’t it ;-).

After that it was all downhill.

I created a very simple BSP page `decode_url.htm` which does the job. Not as pretty as the BSP team’s original `decode_url` I’m sure, but hey, it’s only for me.

This is what it looks like in action:

![screenshot of decode_url in a browser](/images/2003/10/decode_url.png)

Thanks to Brian, I took a small stroll through some of the BSP’s guts, and learnt stuff on the way. I’ve always said the best way to broaden your R/3 and Basis skills is to spend an hour debugging an area that interests you, and this time was no exception. So get out your tools and off you go!

[Originally published on SAP Community](https://blogs.sap.com/2003/10/17/bsp-mangled-url-decoder/)
