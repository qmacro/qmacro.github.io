---
layout: post
title: This Week in Fiori (2015-13)
tags:
- fiori
- json
- odata
- opensap
- rest
- soap
- twif
---


Well, another week has gone by, which means it must be time for This Week in Fiori! The Fiori juggernaut continues to rumble on, and this week was no exception. Let’s get to it!

**[Build Your Own SAP Fiori App in the Cloud](https://open.sap.com/courses/fiux1) by openSAP**
This week saw the start of the new free course at openSAP, which, according to the description, is all about “building your own SAP Fiori app that’s just as delightful and user-friendly as any of the hundreds SAP has built directly”.

This is great news, especially for those of us who had signed up to the earlier course “Introduction to SAP Fiori UX” but had been rather disappointed that it had had nothing much to do with Fiori UX, and more to do with deployment and setup. I wrote about this in [TWIF episode 2014-40](/2014/10/07/this-week-in-fiori-2014-40/). A number of us did have a dialogue with the openSAP folks at the time, and I’m delighted to see our comments were taken on board – this new course looks to be what we have been waiting for.

So we’re into Week 1 of this new nine week course, and already in the last unit of Week 1 — Unit 5, Introduction to SAPUI5 and OData — we’re seeing JSON and XML on the slides, HTTP headers, and even a small glimpse at the superb UI5 toolkit, including a tiny controller and an XML View definition. This is more like it! Technical details on the slides.

Don’t get too excited, however. I spotted some errors in this unit that aren’t trivial. I’ve built courses before and I know how hard it is to get things consistent, but one thing you must do is be accurate. Here are some of the things I spotted:

*“OData … is using SOAP and REST to communicate between systems”*

OK, so first, REST isn’t a protocol, it’s an architectural style, so it is difficult to use a style to communicate between systems. But that is sort of forgivable, in that perhaps more accurately one could say that the OData protocol has RESTful tendencies. But SOAP? No. OData has nothing to do with SOAP, in fact, one could say that the OData protocol is orthogonal to SOAP.

*“One of the most important libraries we have today is sap.ui.m”*

I’m guessing that’s just a typo that found its way up through the layers to the actual presentation script. Because while there are libraries with the sap.ui prefix, there is no sap.ui.m. What the instructor is referring to is [sap.m](https://openui5.hana.ondemand.com/#docs/api/symbols/sap.m.html). The m originally stood for “mobile”, but now stands for “main”. The sap.m library is one of the main collections of responsive controls which are used to build Fiori apps. For more info, you might want to read “[M is for ‘responsive’](http://www.bluefinsolutions.com/Blogs/DJ-Adams/February-2014/M-is-for-responsive/)“.

*“We have a library [sap.ui.table] for table, and that provides me with the ability to create a table that is very rich in data but also responsive”*

For responsive tables, you probably want to look at the [sap.m.Table](https://openui5.hana.ondemand.com/explored.html#/entity/sap.m.Table/samples) control, rather than the sap.ui.table library, as the former is designed from the ground up to be responsive, whereas the latter is more for desktop apps.

*MVC – View <-> Model data binding*

In slide 13, there’s a classic MVC style diagram, but the data binding relationship between the view and the model seems to be shown as one way only:

![Screenshot 2015-03-28 at 14.12.27]( {{ "/img/2015/03/Screenshot-2015-03-28-at-14.12.27-300x47.png" | url }})

One of the many features of the powerful model mechanism and the data binding therein is that you can have two way binding. So I’d have drawn that arrow pointing both ways.

*XML View definition*

Being a stickler for accuracy (perhaps to the point of pedantry, of which I’m proud, not apologetic :-), this XML View definition on slide 14 is not quite accurate:

![Screenshot 2015-03-28 at 14.15.27]( {{ "/img/2015/03/Screenshot-2015-03-28-at-14.15.27.png" | url }})

The View is within the sap.ui.core.mvc namespace, not the sap.ui.core namespace, so the root element here should reflect that, like this:

```
<mvc:View xmlns:mvc=”sap.ui.core.mvc”
```

*Router? Bueller?*

So if I’m going all out, I might as well mention that one thing that I think slide 16 could have benefitted from is mention of the Router in the architecture overview diagram. I do appreciate that these slides may have come from a time before the Router concept was properly established, but the Router is an incredibly important part of any Fiori app, so it would have really helped to see it here.

![Screenshot 2015-03-28 at 14.21.38]( {{ "/img/2015/03/Screenshot-2015-03-28-at-14.21.38.png" | url }})

That said, now you know, you can go and find out more about it! :-)

Don’t get me wrong, I’m very excited about this course, and these issues can be ironed out now they’ve been surfaced. I’m looking forward very much to Week 2.

**[Fiori Breakfast Event](http://www.bluefinsolutions.com/About-us/News-and-Media/Events/Fiori-breakfast-event/) by [Brenton O’Callaghan](https://twitter.com/callaghan001), [Lindsay Stanger](http://www.bluefinsolutions.com/Blogs/Lindsay-Stanger/) and me**
On Tuesdsay morning this week in London, Brenton, Lindsay and I, along with other great Bluefin folks, ran a breakfast event all about Fiori. It was a really successful gathering, with business and technical attendees from SAP customer companies who were already, or were about to, or were just interested in embarking upon their Fiori journey. We had a special guest from one of our clients too, and to be honest, she stole the show :-)

It was clear from the event that people are realising that Fiori is not only here, it’s here to stay, and it’s a journey that is not just about new apps, but about a new SAP. If you’re reading this TWIF column, you already know that. It’s a genuinely exciting time for us as customers, partners and consultants, not only because of the UX aspect, but also because the present and future that is Fiori is based upon open technology standards that are right. SAP has grasped the nettle of user experience, and embraced the right tools and technologies. Good work!

Well that was rather a longer post than usual, so in the interests of keeping this to something you can read in a coffee break, I’ll leave it here, and wish you well. Until next time!


