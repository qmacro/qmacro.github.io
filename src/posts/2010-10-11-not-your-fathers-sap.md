---
layout: post
title: Not your father's SAP
tags:
- abap
- appengine
- bpm
- innowe10
- javascript
- sap
- webhooks
---


I had the good fortune to be invited to SAP’s [Innovation Weekend 2010](http://wiki.sdn.sap.com/wiki/display/events/Innovation+Weekend) in Berlin, a pre-cursory hackfest and idea exchange in the two days prior to the main [SAP TechEd](http://www.sapteched.com/emea/) event at Messe Berlin. Walking around talking to people thinking, discussing, designing and building innovative prototypes covering a huge range of topics, I [came across](http://twitpic.com/2wnjre) Phil Kisloff ([@kisloff](http://twitter.com/kisloff)) and Fred Verheul ([@fredverheul](http://twitter.com/fredverheul)) who were building something using Composite Designer (part of the [Composite Application Framework](http://www.sap.com/platform/netweaver/cafindex.epx)). “That doesn’t look much like SE38!” I thought.

Sure, SAP have been developing non-core software, services and processes for years now. But it hasn’t been until today that the realisation has truly hit home for me. The only team I’ve found that’s building anything in ABAP here is … ours. Ok, [Gregor Wolf](http://twitter.com/wolf_gregor) told me about some very interesting work on [Webhooks](/tag/webhooks/) last night which involved some ABAP coding, but that was probably more out of necessity rather than anything else. BPM is on everyone’s lips. Moreover, to speak of SAP’s Java server offering is already passé and almost uninteresting.

And then there’s River.

River is a project that has been collaboratively built by the SAP Labs teams in Israel and Palo Alto. I talked to Lior Schejter who told me more about it. It’s a platform-as-a-service offering that’s remotely related to Google’s App Engine (although with more UI) and that allows the development, customisation, hosting and running of “small” applications. It’s hosted on Amazon EC2 and uses Tomcat to serve. Applications are built in the flow-logic style of BPM, and consist of user interfaces (what I saw was Flash-based) with business logic controlling the processes in the back end. There’s a UI builder, and the business logic can be built and modified either diagramatically or with Javascript, which runs on the server.

Even though River is arguably in beta right now, what I saw was very impressive. It’s also fair to say that there are a number of milestones that the team are working towards. Online editing and development is essentially a <textarea/> element right now. There’s no source code repository integration or version control. Yes, I know what you’re saying, and I agree: River could learn and take from the fascinating and fabulous [Bespin](https://bespin.mozillalabs.com/) (now ‘[SkyWriter](https://mozillalabs.com/skywriter/)‘) project. In fact, there’s a loose connection already: at last year’s SAP TechEd in Vienna I got Bespin connected to, and checking in and out from, [SAP’s Code Exchange](http://wiki.sdn.sap.com/wiki/display/CodeExchange/Code+Exchange+Platform) platform. Furthermore, offering the ability to debug Javascript than runs on the server is not a simple task (even [Google Apps Script](http://code.google.com/googleapps/appsscript/) doesn’t have that yet, and developing and debugging for apps destined for Google’s App Engine is done locally using the [SDK](http://code.google.com/appengine/downloads.html)). Lior told me of a very interesting and so far successful approach to solving this problem: run and debug the Javascript locally and use a proxy for the River-specific API calls.

There is of course plenty more to say about River, as you can imagine. The project is very interesting and they’re attempting to address hard problems and built a very current offering. But what struck me the most about River is the technologies they’re using, and the audiences and customers that SAP are addressing. These are expanding all the time. Lior even related to me that it had been difficult for his team to find a person who knew ABAP, to help with some of the (minor!) experimental BAPI backend integration!

A far cry from the days of old. [This is not your father’s SAP](http://twitter.com/qmacro/status/27016657285).


