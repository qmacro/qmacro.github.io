---
title: Mobile Dev Course W3U3 Rewrite - Intro
date: 2013-10-16
tags:
  - sapcommunity
---
[tl;dr](http://en.wikipedia.org/wiki/Wikipedia:Too_long;_didn't_read) - the Github repo "[w3u3_redonebasic](https://github.com/qmacro/w3u3_redonebasic)" is a simple re-write of one of the open.sap.com mobile course sample SAPUI5 apps to fix some fundamental issues.

In the current open.sap.com course [Introduction to Mobile Solution Development](https://open.sap.com/course/mobile1) there are a number of SAPUI5 based example apps that are used to illustrate various concepts and provide learning and exercise materials. Unfortunately, these apps don't particularly show good techniques; in fact I'd go so far as to say that some of the approaches used are simply not appropriate:

* they ignore fundamental SAPUI5 mechanisms such as automatic module loading
* libraries are included that aren't necessary and may cause issues
* OData and JSON models are confused and abused

I would class these as "must-change". There is an urgency of scale at work here as much as anything else; there are over 28,000 registered participants on this course, and it would make me happy to think that there's a way to get them back on the right path, SAPUI5-wise.

There are of course other aspects that are less "incorrect" with the app but neverthless perhaps better done a different way. I would class these as "nice-to-have". Examples are:

* views are built in JavaScript instead of declaratively in XML\*
* general app organisation could be improved; there is an [Application.js-based 'best practice' approach](https://sapui5.hana.ondemand.com/sdk/#docs/guide/BestPractice.html) in the publically available documentation but this has not been followed (there is also a Component-based approach\*)

\* both these things will become more important over time, starting very soon!

So I've picked a first app - the "MyFirstEnterpriseReadyWebApp" in [Week 3 Unit 3](https://open.sap.com/courses/3/wiki/week-3-downloads?module_item_id=236) (W3U3) - and re-written it. I have addressed the "must-change" aspects, but left (for now) the "nice-to-have" aspects.

I stuck to the following principles:

* not to deviate from the general architectural approach too much (i.e. remain with MVC and have the same views and progression through them)
* not to introduce any new functionality or styling (save for moving from sap_mvi to sap_bluecrystal)
* to keep the app code and structure feel as close to the original as possible

These principles are so that any course participant who has already looked at the original app will feel at home and be able to more easily recognise the improvements.

I've [pushed my new "Redone, Basic" version of the W3U3 app to Github](https://github.com/qmacro/w3u3_redonebasic) so the code is available for everyone to study and try out, but also over the course of the next few posts I'll highlight some of the changes and describe the differences and the fixes, and the reasons why. Until then, have a look at the repo "[w3u3_redonebasic](https://github.com/qmacro/w3u3_redonebasic)" and see what you think.

Here are the follow on posts (links inserted here as I write them) dealing with the detail of the rewrite:

* [Mobile Dev Course W3U3 Rewrite - Index and Structure](/blog/posts/2013/10/17/mobile-dev-course-w3u3-rewrite-index-and-structure/)
* [Mobile Dev Course W3U3 Rewrite - App and Login](/blog/posts/2013/10/18/mobile-dev-course-w3u3-rewrite-app-and-login/)
* [Mobile Dev Course W3U3 Rewrite - ProductList, ProductDetail and SupplierDetail](/blog/posts/2013/10/18/mobile-dev-course-w3u3-rewrite-productlist-productdetail-and-supplierdetail/)
* [Mobile Dev Course W3U3 Rewrite - XML Views - An Intro](/blog/posts/2013/11/19/mobile-dev-course-w3u3-rewrite-xml-views-an-intro/)
* [Mobile Dev Course W3U3 Rewrite - XML Views - An Analysis](/blog/posts/2013/12/02/mobile-dev-course-w3u3-rewrite-xml-views-an-analysis/)

Share & enjoy

[Originally published on SAP Community](https://blogs.sap.com/2013/10/16/mobile-dev-course-w3u3-rewrite-intro/)
