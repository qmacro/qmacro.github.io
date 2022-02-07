---
layout: post
title: This Week in Fiori (2014-35)
tags:
- catalog
- dcode
- fiori
- teched
- tool
---


![]( {{ "/img/2014/08/f-300x273.jpg" | url }})

Hello and welcome to another episode in This Week in Fiori (TWIF) – for week 35, the last week in August already. This week it’s an all-SAP affair. Without further ado, let’s get to it.

**[Catalog of SAP Fiori Apps](http://help.sap.com/fiori_bs2013/helpdata/en/99/e464520e2a725fe10000000a441470/content.htm) by SAP**
This has recently started to appear on people’s radar, and is a nice resource for summarising all the apps available so far. There are a lot of apps listed, and according to a rough calculation it looks like 370 apps are now listed.

I guess one issue with this catalog page is that it doesn’t really scale, from a human readable perspective, and you don’t get a feel for where the majority of the apps lie. For that, I’d of course recommend my [SAP Fiori App Analysis Tool](https://code.bluefinsolutions.com/~dadams/FioriWebinar/AppAnalysis.html) that I mentioned in a previous TWIF episode ([TWIF 2014-31](/2014/08/01/this-week-in-fiori-2014-31/)). This tool lists the apps that were available at the time the tool was built (313 of them), and I need to get round to add the new apps to the database. Of course, perhaps if I found a few of the right shaped tuits I might attempt to parse the source of this Catalog page. Ideally, SAP would supply a machine readable dataset. Please?

Here’s my rough calculation, by the way :-)

![cat]( {{ "/img/2014/08/cat-300x213.jpg" | url }})

**[SAP Fiori Subtrack at SAP TechEd & d-code](http://sessioncatalog.sapevents.com/go/agendabuilder.sessions/?l=85&locale=en_US&selectedFilters=tag_0:0,tag_202:13848&kw=) by SAP**
 The SAP TechEd conference season is starting soon and the excitement is building already. This year there’s a User Experience & User Interface Development track[^n]. Within this track there’s an [SAP Fiori subtrack](http://sessioncatalog.sapevents.com/go/agendabuilder.sessions/?l=85&locale=en_US&selectedFilters=tag_0:0,tag_202:13848&kw=), which is great to see (although not unexpected!). Here’s a quick glance of the sessions in this subtrack in Berlin:

![image]({{ "/img/2014/08/fiorisubtrack.jpg" | url }})

Mini CodeJams, Code Reviews, Lectures and Hands-on Workshops. There are not as many as I’d like, but it’s a good start. Perhaps I’ll see you there?

[^n]:Ironically the SAP TechEd && d-code site makes it very difficult for me as a user to use – following links within the Agenda Builder break fundamental browsing contracts and expectations, such as being unable to go back having selected a track or subtrack, for example. Bad UX at its best.

**[Use Cases for Extending the UI of SAP Fiori Apps](http://scn.sap.com/docs/DOC-52555) by Clement Selvaraj
**One of the better (read: more comprehensive) PDF based documents to come out over the past few months, that has only just come to my attention, is this PDF-based detailed document on extending SAP Fiori apps. It takes a specific functional scenario ([Report Quality Issue](http://help.sap.com/fiori_bs2013/helpdata/en/20/c74c522565d330e10000000a44538d/frameset.htm)) and walks the reader through a series of extension use cases. These use cases cover the extension concepts (extension points and controller hooks), and as a nice by-product, give the reader insight into a little bit of how a real SAP Fiori app is put together under the covers. For example, it highlights the Sn views (S2.view.xml, S3.view.xml, and so on) which my colleague Brenton and I covered in our [Understanding SAP Fiori Webinar](http://www.bluefinsolutions.com/Blogs/DJ-Adams/July-2014/Webinar-more-Understanding-SAP-Fiori/) a couple of months ago. See the accompanying video screencast “[Understanding SAP Fiori](https://www.youtube.com/watch?v=nM0ffI-GxGk)” for more details.

Well that’s it for now, thanks for reading. I hope you’re enjoying this TWIF series … do please let me know if there’s any way I can make things better, I’d love to hear from you. Until next time, share & enjoy!


