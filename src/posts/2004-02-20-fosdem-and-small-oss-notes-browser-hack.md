---
layout: post
title: FOSDEM, and small OSS Notes Browser Hack
date: 2004-02-20
tags:
  - sapcommunity
---
Tomorrow morning I’m off to Brussels for [FOSDEM](https://www.fosdem.org) – the Free and Open Source Software Developers’ Meeting. Some people might wonder what this has to do with SAP, but don’t forget that lots of people (including yours truly) combine open source technologies with SAP regularly. And don’t forget that SAP have flown the flag for making ERP application source code available (in R/2 and R/3) for years now. I’m not sure whether that excellent situation is going to continue into the age of J2EE – I note, sadly, that SAP don’t supply the Java source in the PARs they make available on [iViewStudio](https://web.archive.org/web/20040324133803/http://www.iviewstudio.com/SAPPortal/home.asp) – but I’m not giving up yet.

![Programming Jabber](/images/2004/02/progjab.jpg)

I’ll be wearing my [Programming Jabber](http://shop.oreilly.com/product/9780596002022.do) tshirt at FOSDEM tomorrow – so if you’re there too and spot it, come by and say hello.

On another note, I’ve used the power of Galeon‘s ‘Smart Bookmarks’ to build myself a nice little interface to OSS notes. (Galeon is my Gnome browser of choice, based on Mozilla‘s rendering engine.)

![OSS note in Galeon web browser](/images/2004/02/small_galeonossnote_38832.png)

As you can see from the screenshot, I can get directly to an OSS note by entering the number into a box on my toolbar. Behind this is a URL (split for readability):

```text
http://service.sap.com/~form/handler
  ?_APP=01100107900000000342
  &_EVENT=REDIR
  &_NNUM=
```

to which the entered OSS number is appended. This URL is the one used in the Javascript displayNote() function behind the OSS note quick access form on the main notes page at SAP.

Simple but effective! You might consider building something like this into your browser too.

[Originally published on SAP Community](https://blogs.sap.com/2004/02/20/fosdem-and-small-oss-notes-browser-hack/)
