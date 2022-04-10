---
layout: post
title: Dashboard, a compelling articulation for realtime contextual information
tags:
- dashboard-tag
- jabber
- keynote
- oscon
---


[Miguel de Icaza](http://primates.ximian.com/%7Emiguel/) and [Nat Friedman](http://nat.org/) were keynoting at [OSCON](http://conferences.oreillynet.com/oscon2003) this morning. It was a great talk about the Mono project and a cool demo of [Dashboard](http://nat.org/dashboard). I managed to [convey](http://mmcc.cx/DashboardOnStage "log of #dashboard IRC channel during talk") some of the presentation to the [#dashboard](irc://irc.gimp.net/dashboard) folks who couldn’t be present. It was also really refreshing to see source code, system exceptions and actual open source on the big keynote display.

I discovered dashboard this week thanks to [Edd](http://usefulinc.com/edd/blog), who has been doing some [neato hacking](http://usefulinc.com/edd/blog/2003/7/8#02:09) with some dashboard front and backends already. Dashboard shows itself as a little GUI window on which information sensitive to what you’re currently doing (receiving an IM message, sending an email, looking at a webpage, for example) is shown.

The heart of dashboard is a matching and sorting engine that receives information (in the form of “cluepackets” – how evocative is that?) from frontend applications (like your IM and email clients) and asks the plugged-in backends to find stuff relevant to that information, which is then displayed in the sidebar-style window, designed to be glanced at rather than pored over. It’s a lovely open architecture in that you can (build and) plug in whatever frontend or backend lumps of code you think of.

I’ve been musing about an [SAP](http://www.sap-ag.de/) backend – wouldn’t it be interesting if the engine could get a match from R/3 on a purchase order number, for example? Of course, there’s nothing out of the box on the R/3 side that could be used, but as [our talk at OSCON](http://conferences.oreillynet.com/cs/os2003/view/e_sess/3759 "Integrating SAP R/3 with Open Source and Open Software") (hopefully) showed, there are plenty of opportunities for the wily hacker.

And what about [Jabber](http://www.jabber.org/)? While glueing Jabber stuff onto the front end is one thing, building a pubsub style Jabber backend could get really interesting; coordinated matching, CRM style features … Ooo, the world definitely could get very lobster-like.

And I know it annoys Nat, but I just had to point out that the GraphViz output for matching clues looks very arc-and-nodey … and we all know what *that*[leads to](http://www.w3.org/RDF/ "RDF") :-)


