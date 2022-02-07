---
layout: post
title: '"fiux2" Week 6 - Extend SAP Fiori Apps'
---


(See first post in this series — [“fiux2″ – The openSAP Fiori Course – 2016 Edition](/2016/03/04/fiux2-the-opensap-fiori-course-2016-edition/) — for links to the other posts).

Well we’re on to the penultimate week of learnings, in the midst of the Design Challenge Peer Review due in at the end of this week, and at the start of the Develop Challenge. Phew! Let’s take a look at the units this week.

**Unit 1 “Introduction to SAP Fiori Extensibility with SAPUI5″.** This was quite a good overview of the different extension capabilities with SAP Fiori. It’s an introduction, so I didn’t expect to get a deep dive, but in fact the presentation of the extension concept, within the time and slide contents constraints, was a good one. It explained the way that an extension project starts out lean, a “delta” with the parent (or “original”) application, and then builds, as extensions are added. The slideware was good too – a clear and meaningful build up of the Component.js file.

While the [extension concept of the SAPUI5 toolkit](https://sapui5.hana.ondemand.com/#docs/guide/a264a9abf98d4caabbf9b027bc1005d8.html) supports the core extension capabilities at the developer level, it was also interesting to see the [Runtime Adaptation](https://sapui5.hana.ondemand.com/test-resources/sap/ui/rta/RuntimeAdaptationDemoApp.html?sap-rta-mock-lrep=true) classed, along with general user-level customising possibilities, within the general extension umbrella. And rightly so. The Runtime Adaptation is quite an achievement; while still a relatively young concept and section of the SAPUI5 toolkit, it’s definitely worth having a look. You could almost see it as “Personas for Fiori”. Now how does *that* mess with your current pigeon-holing of tactical and strategic UX technologies? :-)

There were a couple of things that I wanted to draw your attention to with the extension concept, lest misunderstanding were to take hold:

- You can extend views with replacements (if there were no appropriate extension points for you to use), extensions (using the available extension points) and modifications. In this latter category, the slides say you can “modify certain properties like visibility”. Actually, right now, [you can modify *only* the visible property](https://sapui5.hana.ondemand.com/#docs/guide/aa93e1c6953a41b48cd912a7331eadee.html), no others.
- You can also extend controllers, where the slide says that you can “override standard controller functions such as lifecycle methods”. There’s an important distinction between the word “override” (replace) and “merge” – a word that the instructor actually used but wasn’t on the slide. With the lifecycle methods, your custom “replacement” method doesn’t actually override the equivalent lifecycle method, it is merged, and either runs before or runs after, depending on the method. This is actually what you want, but it’s not “override”.

Caveat developer!

**Unit 2 “Extensibility with SAP Web IDE – SAP Fiori Cloud Example”.** This unit is definitely worthwhile and a very quick walkthrough of what you can do yourself too. Last year at SAP TechEd EMEA, I was lucky enough to co-present a number of SAP Fiori related workshops (see “[Speaking at SAP TechEd EMEA 2015](/2015/11/03/speaking-at-sap-teched-emea-2015/)“). One of them was to have the participants walk through extending an app in the Fiori Cloud Edition, just like the instructor did in this unit. You can do it yourself too now – just visit the [SAP Fiori Demo Cloud Edition](https://www.sapfioritrial.com/) home and follow your nose. There’s also an exercise following this unit which will take you through something similar.

With extensions, we have many questions to answer. Why, how, what and where, for starters. The “why” is simple – because you want to have the app meet your specific business needs and nuances. The “how” is what this unit covers at a high level: the extension concept in general, along with the great support in the SAP Web IDE.

But it’s the “what” and “where” that will most likely cause the new SAP Fiori developer to scratch their head. What can I extend, and where do I find it? Well this is partially answered in the details section of each SAP Fiori app in the [Fiori Apps Library](https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/). But knowing how an app is generally structured, and knowing specifically how your particular app is structured, is a level of detail and understanding much deeper than that.

And what, I hear you say, is the meaning of the S2, S3 and S4 view names? These are artifacts of the original SAP Fiori development approach within SAP, with S2 being the master view of a Master-Detail application, S3 being the detail, and so on. Getting inside the mind and the development context of the developer(s) that wrote the code you’re trying to modify (whether that’s SAP Fiori or something completely different) is something you should try to do as it will make a big difference.

![image]({{ "/img/2016/04/Screen-Shot-2016-04-04-at-07.57.57.png)Oh yes, one more thing – the instructor added an event for the camera button he added to the S4 view. The event he chose from the list was “tap”, which was right next to “press” in the list. Unfortunately [the Button control’s “tap” event has been deprecated](https://sapui5.hana.ondemand.com/#docs/api/symbols/sap.m.Button.html#event:tap) since 1.20 (in favour of the “press” event), but as (a) the SAP Web IDE didn’t highlight this (yet!) and (b) the clock on the instructor’s screen showed just after 5 o’clock in the morning, we can overlook this ;-" | url }})

**Unit 3 “Introduction to Enabling SAP Fiori for Mobile”.** There’s a ton of stuff that SAP (and Sybase) have developed in the area of mobile app creation, deployment and management. I’m sure I’m not the only one somewhat dazzled by the oncoming headlights of so much traffic in this area. So if for no other reason than to summarise where SAP stands today with respect to their direction and strategy in this area, this unit serves us well.

In a conversation last month, I was rather surprised to hear that there were some people who had not heard of the term “hybrid” in the context of mobile apps. This unit clears that up for folks, and explains what hybrid means. This word for me will forever have one of its original meanings from its Greek roots (ὕβρις) – where it was used to describe the mythical [Chimaera](https://en.wikipedia.org/wiki/Chimera_(mythology)), made up of three different species of animal – and was an insult (think “hubris”) to each one. I wonder if SAP considered this in the Hybris context?

Anyway, the unit actually covers a lot of ground, at a high level, contextualising SAP Mobile Services (SAPms), Apache Cordova (nee PhoneGap), Kapsel, the SAP Fiori Client and much more besides. This is the sort of unit where you’ll want to review the slides again later to make sure you’ve built the right set of pigeonholes in your brain to store the flood of information that you know is going to come your way.

One concept that was mentioned but never really expanded upon was the offline OData feature. That alone perhaps could have taken up a whole unit, a whole week, or (in depth) a whole course, but it would have been good for the participants to learn, even at a high level, what was possible.

**Unit 4 “Extending an SAP Fiori App for Mobile – Use Case”.** Enough theory, how about some practical demonstration? And this unit delivers that. It continues the app from Unit 2 earlier in the week, and adds code to the event handler created then. It’s sometimes difficult to keep up with dry material, so to see something in action is a nice diversion. It also shows that not everything is always perfect – even the happy path that the demonstration was following was marred slightly by some network issues (it looked like the mobile device momentarily dropped off the wifi network).

It would have been nice to dig a little deeper into the background behind the Hybrid Application Toolkit (HAT) settings, especially the connection between the workstation-local resources and the configuration in these settings (see screenshot).

![image]({{ "/img/2016/04/Screen-Shot-2016-04-05-at-07.09.29.png" | url }})

I’m thinking, however, that this is covered in the companion course “Developing Mobile Apps with SAP HANA Cloud Platform”.

**Unit 5 “Cloud Extensions with SAP SuccessFactors”.** If there ever was a unit that was full to bursting with a demo that makes you want to know more about absolutely everything, this unit comes close. Even at the longer length of 25 mins, this unit’s video only managed to scratch the surface of extending SAP SuccessFactors with an embedded UI5 app.

Looking past the clear signs of multiple SAP teams working on different parts of SAP’s cloud strategy as a whole, I can’t help but marvel at where they’ve got to. Yes, a pedant like me can spot some inconsistencies and things that don’t look right to the eye. There are also many questions relating to how things really connect and are authenticated, but on the whole, it was a good illustration of some of the core building blocks of the PaaS that HCP is.

I’m really glad that the example the instructor chose was consuming an OData service, via the Destinations facility of HCP. The backend exposing this OData service was marked as “odata_gen” – just like you’d mark any non-SAP (AS ABAP stack) OData service like Northwind.

![image]({{ "/img/2016/04/Screen-Shot-2016-04-05-at-17.36.12.png" | url }})

I did wonder somewhat about the use of the URL in the Widget specification – it was supposed to be the URL of the app on HCP, but instead was another one with “demo2″ in the first part. Ah well, let’s put that down to slightly disjointed end-to-end demos.

Of course, like before, this packed unit was really just a taster for a full blown openSAP course. This time it’s “[Extending SAP Products with SAP HANA Cloud Platform](https://open.sap.com/courses/hanacloud3-1/)“.

Finally, did you notice the use of [OpenSocial](https://en.wikipedia.org/wiki/OpenSocial)? Here’s another example of SAP adopting open protocols and standards, like HTTP and OData. OpenSocial defines a component hosting environment and a set of APIs, and SAP use it to enable the mashup of different components (such as extensions) to run within the same document object model (web page). This continues to give me confidence and encourages me to invest time and effort learning about the technologies and uses thereof in this space, as I know I’m less likely to be going down a path that leads nowhere.

Well, that’s the last main unit of this week. There was, as usual, the video blog update for this week, which I enjoyed. What struck me was the necessity to lead the course participants through architectural structures such as the one described in this diagram:

![image]({{ "/img/2016/04/Screen-Shot-2016-04-05-at-17.58.27.png" | url }})

The cloud, with SaaS, PaaS and more, does mean that the on-premise landscape is simplified, but doesn’t mean that the architectures in general are simplified. Far from it. With tenants, accounts, trial and production platforms in the cloud, and connections to on-premise systems and even other cloud systems, it’s only going to get more complex.

And the final word goes to Bob, in the video update: “*make sure you continue using Google Chrome*“. What a refreshing change to SAP’s requirement from the bad old days, when it explicitly required you to use that disaster of a “web browser”, Internet Explorer. Onwards and upwards!

 


