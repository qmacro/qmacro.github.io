---
layout: post
title: SAPUI5 - the future direction of SAP UI development?
date: 2012-05-07
tags:
  - bluefinsolutions
---

_Update Jan 2014: Things in the SAPUI5 world have certainly moved on since I wrote this introductory article over 18 months ago, and all for the better. SAPUI5 is here to stay. It powers the SAP Fiori application sets, has been a tremendous success for such a new UI framework (and paradigm at SAP). What’s more - this month SAPUI5 has been open sourced, after much pressure and desire from developers internal and external alike._

_So to find out more about this framework that's been maturing for those 18 months, have a look at the [DemoKit](https://openui5.hana.ondemand.com/topic/Documentation), the [post announcing that SAPUI5 was going open source (OpenUI5)](https://web.archive.org/web/20171111195537/http://scn.sap.com/community/developer-center/front-end/blog/2013/12/11/what-is-openui5-sapui5), and the [OpenUI5 home page](https://web.archive.org/web/20171111195537/http://sap.github.io/openui5/). The developers amongst you ought to visit [SAPUI5’s home on the SAP Community Network](https://web.archive.org/web/20171111195537/http://scn.sap.com/community/developer-center/front-end), where you'll find lots of content such as a series of posts from me covering an in-depth analysis and re-write of an SAPUI5 application: [Mobile Dev Course W3U3 Rewrite](https://web.archive.org/web/20171111195537/http://scn.sap.com/community/developer-center/front-end/blog/2013/10/16/mobile-dev-course-w3u3-rewrite--intro)._

_But don’t go there just yet – have a read of this post, which will put SAPUI5 into context for you._

Heard of SAP's "User Interface Development Toolkit for HTML5"? No? Thought not. How about "SAPUI5"? Ah, that's more like it.

SAP's User Interface Development Toolkit for HTML5 - aka SAPUI5 - is a very recent offering from SAP that, despite being an absolute mouthful when you use its official product name, is something that I suspect we will be hearing a lot more about in the next 12 months.

## The SAP UI experience

When you think of the SAP user interface experience, what comes to mind? The venerable SAPGUI? The edgy NetWeaver Business Client? Some browser-based but ultimately and unmistakeably SAP flavoured HTML experience? For many of us, it's "all of the above". When you consider all of these approaches, and the technologies that power them, there's a single theme that emerges: the theme of "Inside-Out". Classic dynpros, WebDynpro for Java, WebDynpro for ABAP, Business Server Pages and (gasp) home-brew solutions based on a custom set of templates are all technologies where the user experience is designed, built and pushed out from the inside of an SAP system, and exposed to the outside in the last-mile of user connectivity. That's served us well, but there's a sea-change ahead.

## From inside-out to outside-in

_"SAPUI5 supports application developers in creating fast and easy User Interface Applications based on HTML5 and JavaScript."_

That's from the SAPUI5 homepage on SAP's Developer Centre. I'll translate, and add an observation that may go otherwise unnoticed: SAPUI5 is a framework and a series of libraries that front-end developers can use to build compelling, non-clunky (but still SAP-focused) genuine HTML5-based applications. It's a framework that embraces (well, includes, actually) the ever popular jQuery, and has more UI controls than you can shake a stick at. It has a core UI layout called the "Shell" which is an implementation of what we might traditionally call a dynpro frame, a sort of meta-component which is as good-looking as it is flexible and adaptable.

So what might go unnoticed? The fact that this is SAP's first major UI venture which adopts - by design - an "Outside-In" approach.

## What does that mean, and why is it significant?

Outside-In? What does that mean? It means that rather than have your UI construction weighed down and otherwise restricted by unnecessary, irrelevant and somewhat proprietary tech in the SAP system, you can approach your new applications with a fresh, unfettered and ultimately independent flexibility. Build your applications in the context of today's UI runtimes (i.e. build in HTML5 for the browser), and support your applications with data and functionality in your backend SAP systems as and when required. Build from the outside, and connect into SAP when appropriate.

What else does that mean? It means for SAP the ability to reach out to the otherwise non-SAP developers out there, the myriad mobile & desktop app-shop developer teams that are experts in constructing solid and user-focused applications. If SAP are to get anywhere near attaining the goal of reaching one billion users, then this is an approach that becomes absolutely necessary.

Last year I attended SAP TechEd in Madrid, and this year I had the privilege of giving a session at SAP's internal Developer Kick-Off Meeting (DKOM) in Karlsruhe, Germany. What I observed at both events was that in the majority of presentations and sessions that I attended, SAPUI5 was being used for the presentation layer. It seems already to have become the "goto UI framework" for SAP development. And why not? It's exactly the right approach, allowing front-end and back-end developers to shine. And if you're both, then that's ok too - as the SAPUI5 framework is relatively easy to get to grips with, especially if you have already had exposure to modern client-side JavaScript programming.

Finally, the significance is exponentially enhanced by the fact that out of the box, SAPUI5 supports data bindings for raw XML, JSON ... and OData. And we all know what that means, right? As the maturing lingua franca of SAP's API landscape, SAP NetWeaver Gateway's support of OData as the data-centric consumption protocol becomes a powerful ally of a UI framework built with the right focus from the get-go. The blog post

[SAPUI5 says 'Hello OData' to NetWeaver Gateway](https://blogs.sap.com/2012/02/13/sapui5-says-hello-odata-to-netweaver-gateway/) on the SAP Community Network shows how easy consumption of Gateway-exposed OData can be from SAPUI5.

## So what's the catch?

SAPUI5 is in early beta. It was released (Beta runtime 1.2.0) on the SAP Developer Network on 8th Feb this year as a standalone package for trial. As betas go, this release is extremely impressive. Tons of documentation, interactive examples, and a very complete set of components. So complete in fact that the biggest criticism so far seems to be that the framework is rather large. That's partly because none of the code has been minified (automatically re-written to be a lot more compact - something very typical in the browser-based JavaScript world where network latency and bandwidth are significant factors).

The next release is scheduled to be bundled as part of SAP's Platform-as-a-Service (PaaS) offering codenamed "Neo". There will be a standalone product, but the focus is on Neo first. They are still working on a mobile version, and there's no date for that yet.

So if you're looking at SAPUI5 for your future user interface requirements, you're on the right track, but are going to be an early adopter.

## Final thoughts

SAPUI5 is here already, and among the early adopters in the wider SAP geek community, it is receiving significant (and deserved) attention. What's more, the product team behind it is approaching the framework's growth in exactly the right way - by actively engaging the developers. It's early days, but I totally applaud SAP's direction and efforts thus far. If you're interested in rapid deployment of prototype, ad-hoc and full blown productive apps powered by your timeless SAP infrastructure, keep an eye on SAPUI5.

---


[Originally published on the Bluefin Solutions website](https://web.archive.org/web/20171111195537/http://www.bluefinsolutions.com/insights/dj-adams/january-2014/sapui5-the-future-direction-of-sap-ui-developmen)
