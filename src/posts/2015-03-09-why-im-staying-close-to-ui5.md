---
layout: post
title: Why I'm Staying Close to UI5
tags:
- angularjs
- fiori
- frontend
- jqtouch
- jqueryui
- ui5
---


I recently came across an article by Greg Donaldson – “[Why We Are Staying Clear of SAPUI5](http://createsend.com/t/r-1D458A2147210E112540EF23F30FEDED)“. Everyone is entitled to their opinions, and I do like challenges to assumptions and the status quo, so I enjoyed the article. I thought it would be worth responding with a similar piece, albeit with a slightly different title :-)

It would be an odd situation indeed for a unified consensus on any software, let alone software in this particular context – HTML5 development toolkits and frameworks, where, if you don’t have an opinion, you’re looked upon as an outsider. So I wanted to state before I start that there is no single correct answer, or even a single toolkit to rule them all, and Greg makes some important points.

I thought I’d look at the individual points that Greg made.

**“Proprietary framework, no thanks.”**

As a lot of folks already know, UI5 is far from proprietary. It is written and maintained by web developers that work for an enterprise software behemoth, but the key difference is that UI5 has been open sourced, as well as using many open source libraries itself. In the article there’s the contrast made between “proprietary” and “industry standard” as though they’re opposites. This is not the case. So I’m not sure whether the criticism being levelled at UI5 is about its proprietary nature (which is not the case) or about (not) being an industry standard. This latter point is debatable: A toolkit powering frontend software across the entire ERP landscape for SAP customers feels like a de facto industry standard to me. Yes, not every company has adopted Fiori, but for one that drives its business on SAP products, UI5 is a likely software component.

I’m curious about the “SAP quirks” phrase which is also mentioned in this point. I’m not sure which quirks are being referred to, but if industrial strength design, MVC, internationalisation, automatic support for RTL languages, client and server side model support and an accomplished data binding system are SAP quirks, then yes please!

Further, AngularJS is mentioned as a framework with a huge community behind it. From what I can see, that community is fracturing, due to the major upheaval in (re)design between the 1.x and 2.x versions. That’s not to say that this couldn’t happen to UI5, but it’s actually happening right now with that framework.

**“SAP Backend Upgrade?”**

To do UI5-based apps “properly”, or “the SAP way”, then this is true; if you don’t already have a Gateway system in your ABAP stack landscape, then you’ll need one and also the UI2 add-in with which the UI5 runtime is supplied.

In my experience, however, it’s increasingly less common for an enterprise to not have a Gateway system somewhere; and with NetWeaver 7.40 you get the components built in as standard anyway. Further, installing Gateway components is often a coffee time activity.

But not wanting to over-trivialise this important original point, I wanted to point out the alternative; an alternative that is the most likely scenario anyway for a non-UI5 deployment such as AngularJS: a separate web server. You can just as easily host and serve your UI5 based applications, along with the UI5 runtime, from a web server of your choice. Then accessing the backend becomes the same task as if you’d chosen a different (non-UI5) framework.

And on the subject of accessing the backend, the point that was made about “remote enabled functions” does intrigue me. One of the advantages of UI5 is that it supports OData, an open standard, by the way, and one of the advantages of OData in turn is that it is a server-side model.

Calling remote function modules in this day and age is certainly possible and sometimes the only choice, but you’re not going to take advantage of server-side heavy lifting when it comes to data integration with your frontend. I’ve built Web-based apps with SAP remote function calls since the 90s, so I have the scars :-) Not only that, but the data abstraction model presented by the RFC approach is somewhat orthogonal to modern web based app data mechanisms.

**“Browser Support”**

This is of course always an interesting issue, but as an individual developer, and as a member of a development team, I prefer a solid statement about a well defined set of modern browsers which are supported by the toolkit I use, rather than have to do that job myself and deal with the vagaries that present themselves on a daily basis. Of course, rolling your own gives more flexibility, but it’s often more work.

And at least for the clients that I work at, the fact that (a) the browser choice is usually somewhat controlled anyway, and (b) the fact that in the BYOD context people even choose (choose!) to bring Windows phones, which are supported by UI5, underlines that choice for me.

**“Frontend Developers Don’t Care”**

At the risk of appearing obtuse, I’m going to absolutely disagree with this statement :-) Frontend developers *do* care; they care about the quality of the software they work with, about how and whether the toolkit they use [does the job without getting in the way](http://www.bluefinsolutions.com/Blogs/DJ-Adams/March-2015/Can-I-build-a-Fiori-app-Yes-you-can!/). Of course, this caring, this obsessive compulsion to be using the right framework and doing the right thing may mean that for some developers the choice is something other than UI5.

And that would be fine. There is no one piece of software that fits all requirements or circumstances, in any context. In the past I have used jQueryUI, JQTouch, AngularJS and other frameworks. And I would never rule them out for future projects. But right now, I’m investing time and effort in UI5, because it’s open source, it’s enterprise ready, it’s been designed & built and is maintained by committed, passionate designers and developers just like you and me (well, a lot more competent than me) and it is also fully in tune with SAP’s technology directions.

Skills in UI5 are going to be useful not only for building out the current and next generation of proper outside-in apps, but also for supporting the deployments, customisations and extensions for Fiori. A nice side effect at which one should not sniff.

 


