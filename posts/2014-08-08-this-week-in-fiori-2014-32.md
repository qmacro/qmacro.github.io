---
layout: post
title: This Week in Fiori (2014-32)
tags:
- explored
- fiori
- icontabbar
- openui5
- sap
- sapui5
---


![image]({{ "/img/2014/08/Screen-Shot-2014-08-08-at-18.53.49-300x168.png" | url }})

Here we are, another week into the new Fiori flavoured world, and as always, there are things to talk about and posts to mention. While it’s been a relatively quiet week there have still been various “announcements” that company X or company Y is now supporting SAP Fiori, or have a Fiori related offering which involves design, prototyping or deployment.

While the glass-half-empty folks might point out that this is a lot of marketing and bandwaggoning, I like to think of it as a good sign that as well as already being everything from a design philosophy (“Fiori”) to a product (“SAP Fiori”), it’s also gaining traction and mindshare in the wider ecosystem and becoming a definite context for engagement.

Ok, let’s get to the pointers for this week.

**[Build SAP Fiori-like UIs with SAPUI5](http://scn.sap.com/docs/DOC-51167) by Bertram Ganz**
 While working as a member of the core UI5 team at SAP in Walldorf in 2013/2014, I was privileged to take part in the creation and presentation of SAP TechEd session CD168 “Building SAP Fiori-like UIs with SAPUI5″ with a number of UI5 heroes like Thomas Marz, Frederic Berg, Bertram Ganz and Oliver Graeff. [I wrote about the CD168 session](http://scn.sap.com/community/developer-center/front-end/blog/2013/10/06/building-sap-fiori-like-uis-with-sapui5) in a post on the SAP Community Network and since the delivery of the session at the SAP TechEd events 2013, the slides, detailed exercise document and exercise solutions have been made available via Bertram’s post.

Even though it was posted back in January this year, it’s still an important post for a couple of reasons. First, the material is very comprehensive and takes you from a very basic and raw application all the way through to a rather accomplished Fiori application, introducing many features of UI5 that are key to Fiori applications along the way. But also, it shows us that designing and building Fiori applications is not just in SAP’s hands – it can be in *your* hands too. Fiori is a concept big enough to share.

If you haven’t already, take a look at this content to get a feel for what it’s like to build Fiori apps. It’s a pretty decent set of materials, and I’m very proud to be a co-author.

**[Why Pie Charts are not in SAP Fiori Chart Library](http://experience.sap.com/topic/why-pie-charts-are-not-in-sap-fiori-charting-library/) by Vincent Monnier**
 Like the reference to [The Fiori Design Principles](http://scn.sap.com/people/kai.richter/blog/2014/06/30/the-fiori-design-principles) in the first post in this series back in week 27 ([TWIF 2014-27](/2014/07/02/this-week-in-fiori-2014-27/)), this post by a designer at SAP highlights that as well as development and the thought processes behind building software, there’s also *design* and the thought processes behind building a great experience … both of these things go into Fiori.

This is a relatively short post that highlights out some of the general downsides to pie charts and points to some further reading. But it’s the fact that the design process has been gone through and also shared with the wider community that is interesting. In fact, if nothing else, use this as a pointer to the whole [SAP User Experience Community](https://experience.sap.com/) site. And if you want to know more about charts in SAP Fiori, see [the chart section in the SAP Fiori Guidelines](http://experience.sap.com/fiori-guidelines/FioriPatterns/21_Fiori_Patterns-Charts.html).

**[The UI5 Explored App](https://sapui5.hana.ondemand.com/sdk/explored.html) by the UI5 Team**
 The toolkit on which Fiori apps are built is UI5 (UI5 is the generic term I use for both the SAP licenced version SAPUI5 and the open source licenced version OpenUI5 … see [The Essentials – SAPUI5, OpenUI5 and Fiori](http://www.bluefinsolutions.com/Blogs/DJ-Adams/February-2014/The-essentials-SAP-UI5-OpenUI5-and-Fiori/) for more info). The UI5 [Software Development Kit](https://sapui5.hana.ondemand.com/sdk/) (SDK) includes a large amount of documentation and example code, and part of that is known as the Explored App. It started out life specifically to showcase and provide example best practice approaches for controls in the responsive “sap.m” library, but has graduated to being a top level menu section within the SDK and covers controls beyond “sap.m” now too.

(As with the CD168 tutorial materials, I am also proud to have had a hand in building the Explored App too ;-)

With the [Explored App](https://sapui5.hana.ondemand.com/sdk/explored.html) you can, well, explore many features and functions within UI5, a good number of which are used to build Fiori applications, and you’ll start to recognise component parts, building blocks that are used and reused to provide features such as search, lists, buttons, dialogs, and so on. Let’s pick one – the [IconTabBar](http://localhost:8888/sapui5/latest/explored.html#/entity/sap.m.IconTabBar/samples). In context, it typically looks like the lower half of this screenshot:

![image]({{ "/img/2014/08/Screen-Shot-2014-08-08-at-18.40.32.png" | url }})

<span style="line-height: 1.714285714; font-size: 1rem;">The IconTabBar is used to contain a number of tabbed sections, with the selection for each of the sections typically being round icons. The design changed slightly between SAP Fiori Wave 4 and 5, now there’s more info shown in place of the icons.</span>

Have a look around and see what Fiori building blocks you can recognise!

Well, the train is almost at Manchester Piccadilly now so this brings this week’s roundup to a close. As always, thanks for reading, and remember you can access the whole series with this TWIF category link: [/category/twif/](/category/twif/).

Share and enjoy!
