---
layout: post
title: This Week in Fiori (2014-33)
tags:
- bestpractices
- fiori
- infrastructure
- launchpad
- sapui5
- twif
---


![Screen Shot 2014-08-17 at 11.03.23]( {{ "/img/2014/08/Screen-Shot-2014-08-17-at-11.03.23.png" | url }})

Hello again. Another week has passed, and the writing of this week’s TWIF should have found me in the Lake District, but alas due to circumstances too tedious to go into now, finds me about 90 miles south, back at home. Anyway, it’s the end of the week and therefore time for some Fiori links and commentary. Let’s get to them!

**[SAP Fiori Launchpad for Developers](http://scn.sap.com/docs/DOC-57363) by Steffen Huester and Olivier Keimel**
 In previous TWIF episodes I’ve mentioned the SAP Fiori Launchpad and its importance to the Fiori app ecosphere. It’s slowly becoming the new lightweight portal and rightly so. The SAP Fiori Launchpad has been designed to be cross platform (ABAP, HANA and Cloud stacks) and in true SAP style this design shows through in the form of abstraction layers — service adapters, the shell renderer and the application container. In fact, it’s the application container that might pique your interest, as we see that it can not only host UI5 apps (via the Component concept) but also Web Dynpro ABAP and SAP GUI for HTML apps.

This document, which applies to the User Interface Add-On 1.0 SPS 05 (am I the only one to still refer to this product as “UI2″?) is a great resource which explains the Launchpad architecture and includes some details, and do’s & don’ts, on the [Component based approach](https://sapui5.hana.ondemand.com/sdk/#docs/guide/170638b7a2b4424e8580fb473af6a3cd.html) to building and embedding apps. Yes, embedding – the Launchpad is a single HTML page (a resource with a URL typically ending “FioriLaunchpad.html”) into which UI5 apps, in the form of Components, are loaded.

One thing in this document that made me smile was a couple of references to the [UI5 Application Best Practices guide](http://help.sap.com/saphelp_hanaplatform/helpdata/en/5c/a68e6e62e6464a8103297fbc19cd9c/content.htm?frameset=/en/d0/1cd0b7be7f441cb6c56ad4577b428c/frameset.htm&current_toc=/en/d0/1cd0b7be7f441cb6c56ad4577b428c/plain.htm&node_id=64) (also [available in the SDK docu](https://sapui5.hana.ondemand.com/sdk/#docs/guide/5ca68e6e62e6464a8103297fbc19cd9c.html)) which is the work of my own hand :-)

**[Build me an app that looks just like Fiori](www.insidesap.com.au/in_depth/build-me-an-app-that-looks-just-like-fiori-developing-mobile-apps-with-sapui5) by John Patterson
**This article only recently came to my attention. It was published a few days ago in Inside SAP but looking at some of the content towards the end (specifically about open sourcing), I think it was written a while ago. Nevertheless it’s a good read and worthy of attention now. (Also, randomly, it reminds me of the title of the film “[Bring Me the Head of Alfredo Garcia](http://en.wikipedia.org/wiki/Bring_Me_the_Head_of_Alfredo_Garcia)“.)

Even now I come across folks who are still looking for a good explanation of Fiori, UI5 and the relationship between them, and also what UI5 offers. Sometimes I point them at my post “[The essentials: SAPUI5, OpenUI5 and Fiori](http://www.bluefinsolutions.com/Blogs/DJ-Adams/February-2014/The-essentials-SAP-UI5-OpenUI5-and-Fiori/)” but also this article by John addresses that need nicely too.

<span style="line-height: 1.714285714; font-size: 1rem;">(Warning, you need to complete a free signup to get to the content. Come on [Inside SAP](http://www.insidesap.com.au/), you can do better than that!)</span>

**SAP Fiori Course Offerings by SAP
**In [TWIF 2014-31](/2014/08/01/this-week-in-fiori-2014-31/) I mentioned that the OpenSAP MOOC is offering a free course “Introduction to SAP Fiori UX” starting in September this year. I thought I’d take a look at what SAP offers in the way of more traditional courses, relating to Fiori. This is what I found on the [SAP Fiori curriculum page](https://training.sap.com/gb/en/curriculum/fiori_uk-sap-fiori-uk/):

![image]({{ "/img/2014/08/Screen-Shot-2014-08-17-at-10.52.03.png" | url }})

<span style="line-height: 1.714285714; font-size: 1rem;">It’s still early days, I think, but it’s a fair representation of the skills required for Fiori:</span>

- Design thinking (THINK1)
- HTML5 & SAPUI5 (SAPX04 and SAPX05)
- Gateway (OData) (GW100)
- Fiori Implementation & Configuration (SAPX03)

Note that the GW100 course covers OData from a Gateway perspective, i.e. the OData server product mechanism from SAP for the ABAP stack. There doesn’t seem to be coverage for the roughly equivalent OData server mechanism XSODATA on the HANA stack. With many of the SAP Fiori apps, specifically the analytical and factsheet ones*, requiring HANA as a backend, this seems to be a gap that should be filled sooner rather than later.

*See the [SAP Fiori App Analysis tool](https://code.bluefinsolutions.com/~dadams/FioriWebinar/AppAnalysis.html) for more details

**[What’s New in SAP Fiori (Delivery July 2014)](http://help.sap.com/fiori_bs2013/helpdata/en/a6/49c453110bcd46e10000000a44538d/content.htm?frameset=/en/9c/106a53e744e047e10000000a441470/frameset.htm&current_toc=/en/9c/106a53e744e047e10000000a441470/plain.htm&node_id=3) by SAP**
 A nice coffee time read is this series of What’s New documents from SAP on the main SAP Fiori documentation site. The documents don’t go into too much detail but do have pointers to where more information is available; they nicely summarise some of the new features and changes that are delivered in the ever increasing number of waves.

This time, like last time (for the Delivery May 2014 edition), the What’s New covers Products, Infrastructure and Documentation. There again we have the significance and prominence of Fiori infrastructure, which of course includes the Launchpad, but also the set of layers between any given Fiori app and your backend SAP system. Worth keeping an eye on for sure.

Well that just about wraps it up for this week. Until next time, share & enjoy!


