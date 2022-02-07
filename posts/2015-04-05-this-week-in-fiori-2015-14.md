---
layout: post
title: This Week in Fiori (2015-14)
tags:
- abap
- cobol
- fiori
- odata
- ui5
---


Well hello again, this episode is brought to you from my woodstore at the bottom of the garden, where it’s actually warm enough to sit outside for the first time. The birdsong is prominent, I guess their user experience is improving with the ground softening and the worms and grubs becoming more accessible. Let’s go!

**[FIORI Notes 1 : One UX to Rule them All](http://scn.sap.com/community/abap/blog/2015/04/01/fiori-notes-1-one-ux-to-rule-them-all) by Wilbert Sison**
This week saw a simple post by Wilbert summarising a few of the key places to visit on one’s journey to Fiori enlightenment: The [Fiori Cloud Edition Trial](http://demo-fioritrial.dispatcher.hana.ondemand.com/), the [Fiori Apps Library](http://www.sap.com/fiori-apps-library) and the UI5 [Explored](https://sapui5.netweaver.ondemand.com/sdk/explored.html) app within the SAPUI5 SDK (the more I ponder the name and the purpose and what it’s becoming, perhaps we should rename it from Explored to *Explorer*). What caught my eye with this post is that it was published in the [ABAP Development](http://scn.sap.com/community/abap/blog) section of the SAP Community Network, and it also gave rise to a short discussion on UI access to HANA.

First, the place the post was published. Fiori, and by direct inference UI5, is a cornerstone technology for SAP’s product landscape. What this means in practical terms is that we as SAP technicians need to embrace UI5 as much as we embraced dynpro technologies in the past. It’s that big. Having given a 3 day course on Fiori, UI5 and Gateway/OData last week, with my co-presenter [Lindsay Stanger](www.bluefinsolutions.com/Blogs/Lindsay-Stanger/), to a collection of Web and ABAP developers (their own self-descriptions), it’s worth re-iterating the reality for many of us out there; many of us so-called ABAP developers. For me, the concept of an “ABAP developer” is somewhere between “meaningless” and “unneccessarily restricting”. Yes, there are developers out there that call themselves “<language> developers” or “<platform> developers”, and that is their perogative, but it’s an artificial constraint that is not helpful, and reminds me of “COBOL developer”. There will always be (in the forseeable future) demand for some COBOL skills, but is that the entirety of your outlook? If a mainframe dinosaur and ABAP developer like me can embrace UI5, so can you.

Then, there’s the question of UI, that came up in the comments to Wilbert’s post. It reminded me of a [great Twitter thread initiated by John Moy](https://twitter.com/jhmoy/status/583069583495446528) where the frontend future for S/4 was discussed. I’ll leave it to you to enjoy reading that thread, but the takeaway for me was that people do understand that while wall-to-wall Fiori might be the vision, the reality will be different, particularly in the transition period while the Fiori app suites are constructed and made available. And for those of you pondering the earlier point about ABAP, and this one where SAPGUI and therefore dynpro is not going to disappear any time soon, think of COBOL again ;-)

**April New App Distribution via SAP Fiori Apps Library**
 The SAP Fiori Apps Library is lots of things rolled into one. It’s a nice talking point and focus for the Fiori pundits, an example of a publically accessible Fiori App (where, being Web native, the frontend source code is available for perusing and learning from), and a good source of information on current Fiori apps. And I don’t mean just human readable information, but machine readable data too. I’d exhorted SAP back in August last year (in [TWIF episode 2014-35](/2014/08/31/this-week-in-fiori-2014-35/)) to make the data available, to supply “a machine readable dataset”. And that they have done, as of course the backend data source to the [SAP Fiori Apps Library](http://www.sap.com/fiori-apps-library) tool.

This of course is an OData source, from a HANA backend, and rich in information. Not only is it useful for powering the Fiori Apps Library app itself, but also for our own data-based analysis. You might have seen my post from earlier this year, where I showed you how to pull data from this very OData source into a spreadsheet:

[Fiori App Data into a Spreadsheet? Challenge Accepted!](/2015/01/09/fiori-app-data-into-a-spreadsheet-challenge-accepted/)

Thing is, while this data is valuable in and of itself, if you add a further dimension, time, it becomes perhaps even more valuable. What are the apps that are appearing over time, over the different waves? Are there any that are disappearing? Current total app count as of today is 541. Last month (an unscientifically and deliberately vague point in time, for now) it was 495. So that’s 46 new apps that have appeared (none disappeared, I also checked).

![image]({{ "/img/2015/04/Screenshot-2015-04-05-at-13.46.17.png" | url }})

I think it might be a worthwhile exercise to pull this app data on a regular basis, for comparisons over time. So as a starter, I have an experimental spreadsheet, [Fiori Apps Data](https://docs.google.com/spreadsheets/d/1ob-0M9Qn6duMVxC05A2w1ekxR8H3Nc-etb_Fz6Y_4z0/edit?usp=sharing), with two snapshots, March and early April. I’ve added a few analysis tabs and one of the products is this breakdown of new apps by area, that I’ve titled “New Apps Distribution”.

Do you think this is useful? What other information can we work out with this new time dimension? How often do you think we should or could take a snapshot? Weekly? Daily? Could this be a community curated data set?

Answers on a postcard (or in the comments) please!


