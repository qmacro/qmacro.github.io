---
layout: post
title: '"fiux2" Week 3 - Get Ready to Create Your First App'
---


(See first post in this series — [“fiux2″ – The openSAP Fiori Course – 2016 Edition](/2016/03/04/fiux2-the-opensap-fiori-course-2016-edition/) — for links to the other posts).

It’s around this time of the week that the changeover between each week’s worth of content happens. Week 3 of the [Build Your Own SAP Fiori App in the Cloud – 2016 Edition](http://open.sap.com/courses/fiux2) course has just come to a close, so it’s time for me to write down my thoughts.

This week’s content was shorter than usual. Deliberately so, to give the attendees a better chance at completing the Design Challenge, which started in Unit 7 of Week 2 (see my comments for that unit in [the previous post in this series](/2016/03/08/fiux2-week-2-design-your-first-sap-fiori-app/)). There were only three units, so let’s have a look at those first, and then finish with a few observations on the Design Challenge.

**Unit 1 “Anatomy of SAP Fiori Apps”.** I enjoyed this unit very much, as it really started to explain well how the rubber hits the road. At some stage, UX needs to turn into UI and become real. Using a combination of the excellent [SAP Fiori Design Guidelines](https://experience.sap.com/fiori-design/) and the actual controls in the UI5 toolkit itself (see [the Explored app](https://sapui5.hana.ondemand.com/explored.html) for a great showcase of many of them) – advice and building blocks in harmony – is a great way to get started on your Fiori app development journey.

Understanding the anatomy of a Fiori app – from small controls such as Buttons to larger concepts such as the floorplans, and everything in between, can make the difference between creating a Fiori app, and a Fiori-like app. Here, I refer to Fiori-like as using the building blocks, but not in the right way.

**Unit 2 “Introduction to SAPUI5 and OData”. **At less than 10 mins long, this unit was very short indeed, only providing a very high level introduction to two of the most important topics in Fiori – UI5 and OData. One of the aspects of the openSAP courses I’ve become used to was the way the instructors often squeezed as much out of each slide’s content as possible. In this unit, I felt a lot of the detail was skipped.

That said, if it hadn’t have been skipped, I could imagine the unit being four times as long or more. There is more on OData coming later in this course, so let’s hope that they dig in a little more. OData is a fascinating topic, not least because it’s REST-informed, based on an architectural style that I [worked](http://www.sdn.sap.com/irj/scn/go/portal/prtroot/docs/library/uuid/ea8db790-0201-0010-af98-de15b6c1ee1a?overridelayout=true) [hard](https://scn.sap.com/people/dj.adams/blog/2004/06/24/forget-soap--build-real-web-services-with-the-icf) in the past trying to convince SAP of its merits :-)

![image]({{ "/img/2016/03/Screen-Shot-2016-03-16-at-23.00.42.png)](http://www.sdn.sap.com/irj/scn/go/portal/prtroot/docs/library/uuid/ea8db790-0201-0010-af98-de15b6c1ee1a?overridelayout=true" | url }})

*An old post on SCN from 2004 – “[Real Web Services with REST and ICF](http://www.sdn.sap.com/irj/scn/go/portal/prtroot/docs/library/uuid/ea8db790-0201-0010-af98-de15b6c1ee1a?overridelayout=true)” – where I expounded on the virtues of the REpresentational State Transfer (REST) based approach to data services … and was slightly disowned by SAP ;-)*

**Unit 3 “Introduction to Annotations and Smart Templates”. **This was a very interesting unit, not least because of the implications and the reasoning behind augmenting the metadata with extra semantics. I’ve written about semantic information before (see [Semantic Pages](/2015/07/06/semantic-pages/), a post in the [30 Days of UI5](/2015/07/04/30-days-of-ui5/) series). This time it’s about adding extra information to the OData metadata to enable a more rapid construction – in some cases automatic – of UI5 based application components. A control, or set of controls, that can understand the data that is bound to it, is capable of more than acting passively.

There’s a lot driving the concept of annotations and their use in smart controls and templates, not least SAP’s need to produce yet more SAP Fiori apps, more quickly and more reliably. Finding a way for apps, or parts of apps, to write themselves, is going to help that process.

One thing that made me smile was the lovely conflict between Unit 2’s statement “*OData model is based on … JSON*” and Unit 3’s statement “*OData is based on XML*“.

Of course, we all know that it’s based on both. JSON and XML just happen to be used to provide the format for the payload – there are different formats that the OData standard describes. But OData is also a protocol. Don’t let this confusion confuse you – OData is about more than representing data, it’s about describing operations upon that data too. The XML representation originates from the Atom Syndication Format ([RFC4287](http://www.rfc-base.org/rfc-4287.html)) – this informs the “format” part of OData. The operations originate from the Atom Publishing Protocol ([RFC5023](http://www.rfc-base.org/rfc-5023.html)) – this informs the “protocol” part of OData.

**Design Challenge**

And what of the Design Challenge? First, the deadline has just been extended by a week due to some system problems that were encountered. I think that’s a pretty generous extension, well done again openSAP folks for reacting in the right way. I’m on holiday this week and got some earache from M for working some late night and early morning hours to get the submission in before today. Oh well :-)

As the deadline has been extended, I have to be careful not to give anything away here. But I can certainly make a few observations of my own. I’d say, all told, with putting together each of the deliverables for the challenge, doing the screen mockups and then using the online tools to create a prototype and then a study, it took a good few hours, not counting the idle time mulling over what problem I wanted to solve and persona for whom I wanted to address the needs.

I think it was because I’m not actually that used to the formal process, so things weren’t as smooth as they might be next time. This is part of the point, I guess – getting us used to the Design Thinking methodology and learning about the process by being persuaded to address each step in turn. Although I think it was a valuable exercise, there is something in me that is ready to admit that I already had the design of the app in my head, and extrapolated backwards a little bit into the discover and design. But who said it was a linear flow? :-)

 


