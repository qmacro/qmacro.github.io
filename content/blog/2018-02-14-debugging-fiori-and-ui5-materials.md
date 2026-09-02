---
title: "Debugging Fiori and UI5 - Materials"
date: 2018-02-14
description: A collection of pointers to material related to debugging UI5.
tags:
  - fiori
  - openui5
  - debugging
  - learning
  - sap-community
---

There's a new openSAP course starting today: [Understanding SAP Fiori
Launchpad](https://open.sap.com/courses/fiops1). I'm looking forward to
participating, as it has the ingredients to make a very interesting set of
units. Reading the overview page we can see that some debugging is involved,
and specific mention of the excellent [Chrome Developer
Tools](https://developer.chrome.com/devtools) ("devtools" for short) is made.

## Debugging as a pastime

I find debugging an enjoyable activity, especially when looking at UI5 powered
apps and infrastructure with those very devtools. Over the last few years I've
created material in this area, and thought it would be worthwhile gathering a
reference to it here to welcome the openSAP course and serve as a starting
point for those wanting to learn more about debugging UI5. I've created blog
posts, recorded videos and produced worksheets to accompany presentations and
workshops I've given. I like debugging UI5 so much I even went so far as to
write a book on the subject.

![](/images/2018/02/Screenshot-2018-02-14-at-14.19.41-1.png)

Writing about debugging is hard, there's always a lot to describe. It's often
better to just show debugging, which is why there are more videos than any
other material type. I've gathered them together in a YouTube playlist: [Fiori
& UI5
Debugging](https://www.youtube.com/playlist?list=PLfctWmgNyOIejkOl5LmprKNQ337fGvU0i);
the individual videos are described here.

If you like the videos, [please head on over to my
channel](https://www.youtube.com/user/qmacro99/videos) and hit the red
Subscribe button!

## Materials

Here are the materials, organised by the year in which they were created.

### 2017

**Worksheet**: At UI5con@SAP I gave a hands-on workshop "Functional Programming
for your UI5 Apps", where I took the participants through some functional
techniques in JavaScript, using UI5 apps as sources of inspiration. By
necessity the hands-on exercises made use of the Chrome devtools, where we
modified running UI5 apps on the fly. There's a detailed worksheet that
accompanied the workshop here: <http://bit.ly/qmacro-ui5con-funcprog>.

**Video**: In [Using jq to parse out SCP destination
information](https://www.youtube.com/watch?v=yI5IQooQzW4&list=PLfctWmgNyOIejkOl5LmprKNQ337fGvU0i&index=1)
I make use of the HTTP archive (HAR) format to save information on the
resources loaded when looking at the destinations in the SCP cockpit.

**Post**: While at Bluefin I wrote [Debugging SAP Fiori apps - the fifth
"D"](/blog/posts/2017/01/12/debugging-sap-fiori-apps-the-fifth-d/) which
looks at how debugging is a core part of development and is in fact a
conversation.

**Video**: [Setup for E-Bite "SAP Fiori and UI5: Debugging the User
Interface"](https://www.youtube.com/watch?v=RJt4v-7dI9Y&index=2&list=PLfctWmgNyOIejkOl5LmprKNQ337fGvU0i) refers
to the SAP Press book described later in this post and shows you how to set up
the app that accompanies it, which we debug throughout the book.

### 2016

![](/images/2018/02/9781493214808_267_2d.png)

**Book**: At the end of 2016 I wrote an E-Bite book for SAP Press: [SAP Fiori
and SAPUI5: Debugging the User
Interface](https://www.sap-press.com/sap-fiori-and-sapui5-debugging-the-user-interface_4305/)
which is all about, well, debugging Fiori and UI5 apps using the Chrome
devtools and more.

**Video**: [openSAP UI5 Course W4
Bonus](https://www.youtube.com/watch?v=7dNSpum7IWI&index=3list=PLfctWmgNyOIejkOl5LmprKNQ337fGvU0i) - in a nice
circular reference (to another openSAP course) this is a recording
of my work on the bonus exercise from week 4 of the excellent course
"[Developing Web Apps with SAPUI5](https://open.sap.com/courses/ui51/)".

### 2015

**Post**: [A Short UI5 Debugging
Journey](/blog/posts/2015/07/22/a-short-ui5-debugging-journey/) -
as part of the [30 Days of
UI5](/blog/posts/2015/07/04/welcome-to-30-days-of-ui5/) series of
posts, I wrote this post which takes a look at the [UI5 Support
Tool](/blog/posts/2015/07/18/the-ui5-support-tool-help-yourself/) and
the devtools to debug a feature in the UI5 Explored app.

**Video**: [Fixing up a nicer HCP Destinations
table](https://www.youtube.com/watch?v=d8P2bV6clXI&index=4&list=PLfctWmgNyOIejkOl5LmprKNQ337fGvU0i) - from when SCP was called HCP.
One of the sessions I gave at SAP Inside Track
Sheffield (SITsheff) in 2015 was "Learning to Drive Fiori Apps from Underneath -
Fixing up a nicer HCP Destinations table". It's described on the SITsheff
page, and there's a link to an accompanying document. I thought it might be
useful to record a screencast of what I did during that session.

**Video**: [Fiori Apps Reference Data into a
Spreadsheet](https://www.youtube.com/watch?v=B9FGqJFZbzQ&index=5&list=PLfctWmgNyOIejkOl5LmprKNQ337fGvU0i).
In the early days of the [SAP Fiori Apps Reference
Library](https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/) I
looked into where the data was coming from, and used the devtools to find out
and get the apps info into a spreadsheet. I wrote a post on this here: [Fiori
App Data into a Spreadsheet? Challenge
Accepted!](/blog/posts/2015/01/09/fiori-app-data-into-a-spreadsheet-challenge-accepted/).

### 2014

**Video**: In [SAP Fiori & UI5 Chat, Fri 17 Oct
2014](https://www.youtube.com/watch?v=Hz3ZWWF0BFM&index=7&list=PLfctWmgNyOIejkOl5LmprKNQ337fGvU0i),
my friend and erstwhile Bluefin colleague brenton.ocallaghan chat about Fiori
and UI5 topics, and naturally we can't resist breaking out the devtools, this
time to explore the Fiori Apps Reference Library app.

**Video**: [Creation & Reload of UI5 UIs in the Chrome Developer
Console](https://www.youtube.com/watch?v=JPy7TxLpILg&list=PLfctWmgNyOIejkOl5LmprKNQ337fGvU0i&index=6) - at SYD
airport returning from the SAP Architect and Developer Summit, I
recorded a quick screencast to show the creation of a quick UI, using the
manual Chrome Developer Console techniques we learned there.

**Worksheet**: At the SAP Architect & Developer Summit I gave a workshop on
driving Fiori apps from underneath, i.e. from the Chrome devtools. I wrote a
comprehensive worksheet to accompany that workshop: [Learn to Drive Fiori
Applications from Underneath and Level Up!](http://bit.ly/ldfaulu)

**Video**: In a precursor to other longer "manipulation-with-devtools" pieces,
the video "[Manipulating UI5 Controls from the Chrome Dev
Console](https://www.youtube.com/watch?v=nRtocPEPLYI&index=8&list=PLfctWmgNyOIejkOl5LmprKNQ337fGvU0i)"
is a short demonstration of how easy it can be to find, grab, manipulate and
create controls in a UI5 app from the devtools.

**Video**: One of the webinars in which I participated at Bluefin was
"Understanding SAP Fiori". brenton.ocallaghan and I followed up on this with a
video [Understanding SAP Fiori Webinar
Followup](https://www.youtube.com/watch?v=MlPmRO4SH-o&index=9&list=PLfctWmgNyOIejkOl5LmprKNQ337fGvU0i),
wherein we dive into a transactional app to see how it's put together.

## Next steps

This is just material from more or less a single individual; there's plenty
more out there on the web. So what are you waiting for? Grab an unsuspecting
Fiori app, open the Chrome devtools, and off you go!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-members/debugging-fiori-and-ui5-materials/ba-p/13351597)
