---
layout: post
title: '"fiux2" Week 7 - Build Your Own SAP Fiori App'
---


(See first post in this series — [“fiux2″ – The openSAP Fiori Course – 2016 Edition](/2016/03/04/fiux2-the-opensap-fiori-course-2016-edition/) — for links to the other posts).

We’re into week 7, the final week of this openSAP course “Build Your Own SAP Fiori App in the Cloud – 2016 Edition”. As we’re in the midst of building our app for the Develop Challenge, this final week is deliberately short, with only two units.

**Unit 1 “End-to-End Development Scenario”.** If you’ve seen a demo of the SAP Web IDE before, in particular for generating and subsequently editing an app from a template, you’ll be already familiar with a lot of the content of this unit. I’m all for repeating information and demos for learning and for strengthening the neurons, but I honestly didn’t find anything significantly new here. I think perhaps the intention is to show a final end-to-end scenario, where each course participant should now be comfortable with the details and nuances for each part along the way.

There was one part which touched on some of the features of the git functionality in the Web IDE, along with a brief view of how that then is exposed in the SAP HANA Cloud Platform, but I’d like to have seen this in the context of a non-master branch.

**Unit 2 “End-to-End Administration Scenario”.** In many ways, this is the other side of the coin to the development of UI5-powered apps for Fiori scenarios. While Unit 1 covers this development, this unit briefly covers what’s possible in the context of the setting for these apps – the SAP Fiori Launchpad. Specifically, this is for the cloud-based Launchpad, as provided by the SAP HANA Cloud Portal services of the HANA Cloud Platform .

It’s a shame that the content of this unit is out of date, at least visually.

![image]({{ "/img/2016/04/Screen-Shot-2016-04-10-at-13.28.42.png" | url }})

The SAP Fiori configuration cockpit changed a while ago, and looks nothing like what’s shown in this unit. There was a brief disclaimer message during the video, but that doesn’t really help that much. That said, the actual functionality has not changed much, and with the availability of the cloud-based Launchpad in the HCP trial accounts, it’s quite easy for you to explore it yourself.

In fact, because there are some complex relationships possible between the building blocks such as tiles, groups, catalogues and role, it’s better anyway to have a play around and try to get something working that makes sense to you. This is a great example of where theory is not everything – getting the mechanisms under your fingernails and the ideas embedded into your understanding is key here.

One feature that was highlighted was the “dynamic” tile type. This is close to my heart, especially in the light of our upcoming lunchtime webinar on 26 Apr:

[The SAP Fiori Launchpad as a Human-Centric Dashboard](http://www.bluefinsolutions.com/events/the-sap-fiori-launchpad-as-a-human-centric-dashboa)

where we explore the possibilities that are presented to us by the SAP Fiori Launchpad and its features such as the different tile types.

Finally, there was a nice touch after the instructor added the details for the dynamic tile – specifically the Number Unit value “Notebooks”:

![image]({{ "/img/2016/04/Screen-Shot-2016-04-10-at-14.23.34.png" | url }})

“Wait!” I hear you say. “That’s static text – what about consuming this in different languages?”.

And the openSAP course folks must have pre-empted that thought. Directly following this was a short section on the Translations service within the configuration cockpit. In a similar way to how you handle internationalisation (i18n) resources for a Fiori app using the UI5 detection and resourcing mechanisms, so you also can manage property files of name/value pairs for text elements.

Here’s a screenshot of what this looks like, slightly beyond where this unit’s video ended:

![image]({{ "/img/2016/04/Screen-Shot-2016-04-10-at-14.25.15.png" | url }})

Here, I’ve added and activated a German locale for my Launchpad, which means I’d see the translated texts when consuming the Launchpad site in German, say, by adding the sap-language=de parameter in the URL.

Anyway, as I mentioned earlier – the best way for you to learn more is to get going on your trial account and play around. Have fun!

<div class="entry-content"> 

</div> 


