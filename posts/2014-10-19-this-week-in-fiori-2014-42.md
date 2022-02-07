---
layout: post
title: This Week in Fiori (2014-42)
tags:
- fiori
- launchpad
- ui2
- ui5
- video
- webinar
---


![Screen Shot 2014-10-19 at 21.27.11]( {{ "/img/2014/10/Screen-Shot-2014-10-19-at-21.27.11-300x216.png" | url }})

Well hello again, I’m back. I couldn’t miss [the most significant week number](http://en.wikipedia.org/wiki/42_(number)), now, could I? :-) And next week I have something special for you — the TWIF episode will be written by a guest author. Really excited about that! If you’re interested in becoming a guest writer for this series, get in touch! Ok, let’s get to it.

**[SAP Portal and SAP Fiori – Common Architecture](http://scn.sap.com/community/enterprise-portal/blog/2014/10/19/new-white-paper-sap-portal-and-sap-fiori--common-architecture) by Aviad Rivlin**
 Aviad has been at it again producing great content and bringing more clarity to this important subject. Although only a short post, it’s worth mentioning here, because it helps crystallise SAP’s intentions in this space (readers of this TWIF series have seen many mentions of this subject in the past) and also because it points to a whitepaper “[SAP Enterprise Portal and SAP Fiori – Common Architecture Recommendations](https://scn.sap.com/docs/DOC-58843)” which is worth a read.

**[What’s New in SAP Fiori Launchpad](http://help.sap.com/saphelp_uiaddon10/helpdata/en/5d/bad3ee1b78427c98eb9fe68999b9a4/frameset.htm) by SAP**
 For the UI Add-On for NetWeaver, otherwise known as UI2, version 1.0 SPS 10 is now available. This is a layer of software that provides a lot of the Fiori services and infrastructure (yes, [there’s more to Fiori than just UX](https://twitter.com/qmacro/status/523472656457531392), you know ;-) including the UI5 runtime, the personalisation services and the Launchpad. While the individual Fiori apps are of course the main event, without this layer, without the Launchpad, the experience would be lacking something.

This What’s New document, in the UI2 section of help.sap.com, gives us a good overview on what have been the important areas of focus for SAP in the recent period. Notably, these areas are for Portal integration (the headerless mode) and performance. With performance, there have been various improvements, from moving the storage of personalisation information from an XML document to database tables (who thought using XML documents for storage of large amounts of data was a good idea?) to cacheing of target mappings in the browser. Nice!

**[SAP Fiori, Demo Cloud Edition](https://demo-fioritrial.dispatcher.hana.ondemand.com/sap/hana/uis/clients/ushell-app/shells/fiori/FioriLaunchpad.html?sap-client=001) by SAP**
 Well, it was a long time coming, and it’s still not ideal, but it’s THERE! An online, available, demo version of SAP Fiori. For folks to get a better feel for the Launchpad, for some of the apps, and to experience the UX first hand. Not only will this be great for all of that, but for those implementing their own Fiori apps, it will also serve as useful and hopefully always-available reference designs, alongside the SAP Fiori Design Guidelines I wrote about in [TWIF episode 2014-28](/2014/07/09/this-week-in-fiori-2014-28/).

Why not ideal? Well, it only contains a very small number of apps from the 300+ available, and the sample data is a little flat. Here are the apps available:

- ERP HCM - Approve Timesheets
- Approve Leave Requests
- My Benefits
- My Leave Requests
- My Paystubs
- My Timesheet
- ERP SD (Logistics) - Change Sales Orders
- Check Price and Availability
- Change Sales Orders
- Track Sales Orders
- ERP Accounting - My Spend
- Customer Invoices
- ERP Logistics (MM) - Approve Purchase Contracts
- Approve Purchase Orders
- Approve Requisitions
- Order From Requisitions

It’s early days for this demo, and I’m hoping to see a lot wider variety of apps available, along with more meaningful sample business data, in the next iteration. But until then, so far so good!

**[SAP Fiori & UI5 Chat, Fri 17 Oct 2014](https://www.youtube.com/watch?v=Hz3ZWWF0BFM) by Brenton O’Callaghan and me**
 Earlier this year, Brenton and I ran a webinar “[Understanding SAP Fiori Webinar](http://www.bluefinsolutions.com/About-us/News-and-Media/Events/Webinar-Understanding-SAP-Fiori/)” which was well received. I wrote it up in a post on SCN “[The Director’s Cut](http://scn.sap.com/community/developer-center/front-end/blog/2014/06/20/understanding-sap-fiori-webinar--the-directors-cut)” and also on Bluefin’s website “[Webinar & More: Understanding SAP Fiori](http://www.bluefinsolutions.com/Blogs/DJ-Adams/July-2014/Webinar-more-Understanding-SAP-Fiori/)“, and in fact we’ll be running another SAP Fiori related webinar in December, watch this space!

Last Friday Brenton and I decided to sit down and shoot the breeze again on the subject of Fiori, this time looking at an SAP Fiori app that allows you to explore what Fiori apps are available. We looked at it from above, and from below, and had a great time doing so. It’s 30 mins long, so grab a cup of tea and a digestive biscuit and have a look: “[SAP Fiori & UI5 Chat, Fri 17 Oct 2014](https://www.youtube.com/watch?v=Hz3ZWWF0BFM)”

<iframe allowfullscreen="allowfullscreen" frameborder="0" height="315" src="//www.youtube.com/embed/Hz3ZWWF0BFM" width="560"></iframe>

Until next time, share & enjoy!


