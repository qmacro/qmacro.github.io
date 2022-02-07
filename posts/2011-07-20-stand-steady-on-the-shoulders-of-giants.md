---
layout: post
title: Stand steady on the shoulders of giants
tags:
- course
- http
- icf
- madlab
- omniversity
- sap
---


**Or: *Why you should attend my 2-day [Omniversity](http://omniversity.madlab.org.uk) course “[Web Programming with the SAP Internet Communication Framework](http://s.madlab.org.uk/sap1)“***

Last week I had the opportunity to attend an SAP Mentor Webinar on [SAP Netweaver Gateway](http://www.sdn.sap.com/irj/sdn/gateway), entitled “Gateway Consumption”. Gateway is something I have a good deal of interest in, and have [written about it in the past](http://www.bluefinsolutions.com/insights/guest_blog/project_gateway_a_call_to_arms_or_at_least_to_data/). The webinar was a fascinating hour filled with information about how consumption of data and services in your backend SAP systems will be facilitated with SAP’s new Gateway product; the webinar included discussion of code generation for [Xcode](http://developer.apple.com/technologies/tools/), libraries for BlackBerry apps, and of course Android. Not to mention web-native apps. And don’t forget – [SAP Gateway is not just for mobile!](http://twitter.com/#!/qmacro/status/91174743809593344) :-)

The whole Gateway consumption experience is fronted at the sharp (HTTP) end with well-known standards [Atom & the Atom Publishing Protocol (APP)](http://en.wikipedia.org/wiki/Atom_(standard)), and the [Open Data Protocol (oData)](http://www.odata.org/). Whether they’re also well-loved I’ll leave for you to decide. Payloads are in XML or JSON (although again, some would say it’s the ugliest and un-JSON-like JSON they’ve ever seen, but that’s another story). The Gateway system itself is an ABAP-stack SAP system, running the Internet Communication Manager, wrapped of course with our beloved [Internet Communication Framework](http://help.sap.com/saphelp_nw70ehp1/Helpdata/EN/36/020d3a0154b909e10000000a114084/frameset.htm).

And there’s the thing.

While slowly but surely the promise of* lightweight over heavyweight*, *simplicity over complexity*, and *open over proprietary protocols* continues to be delivered, you’ve got to admit that’s a heck of a lot of layers of stuff that’s already building up! Your application, on top of generated libraries, on top of oData, on top of APP, on top of HTTP, on top of ICF, in an SAP system. Gosh!

So what does the desperate enterprise hacker have to do? Walk strong! Learn to walk properly and steadily, before you can run. Stand firm upon this stack of technologies, and understand the fundamentals of the ICF, the core HTTP mechanisms that underpins everything.

Not only that, but sometimes, oData is too much! Sometimes, you just want a controlled but ad-hoc exposure of SAP functionality through a simple HTTP interface that you can connect to and interact with using [curl](http://curl.haxx.se/)! In a Unix style command pipeline! Is that heresy? I don’t care, I do it often! With text/plain! Yes! Sometimes you want to use the power of the ABAP development and debugging environment, the data dictionary and abstracted storage layer, and just whip up a data collection service in a coffee break, instead of trying to shoehorn records into a silly Access database using a batch script.

So.

If you want to understand the solid platform that Gateway and many other technologies are built upon, if you want to use that platform to build your own ‘native’ HTTP based applications, if you want to differentiate yourself from the rest of the SAP developers who are rushing headlong into Gateway and HTTP, or if you just want to be able to **stand steady on the shoulders of giants** and confidently debug the core layers when things don’t go to plan, then get to know the ICF. More specifically, get to know it on [my course](http://s.madlab.org.uk/sap1)! It’ll be fun, too!

**GET /course/info HTTP/1.1 Accept: text/plain Host: omniversity.madlab.org.uk**

**200 OK Content-Type: text/plain Title: [Web Programming with the SAP Internet Communication Framework ](http://s.madlab.org.uk/sap1)When: Mon 5th and Tue 6th September Cost: £300 Where: [Madlab, 34-40 Edge St, Manchester M4 1HN ](http://maps.google.co.uk/maps?f=q&source=s_q&hl=en&geocode=&q=36-40+Edge+St,+Manchester,+M4+1HN&sll=53.484215,-2.236311&sspn=0.000833,0.001617&g=m4+1hn&ie=UTF8&hq=&hnear=36-38+Edge+St,+Manchester,+Lancashire+M4+1HN,+United+Kingdom&ll=53.484118,-2.236311&spn=0.001666,0.003235&z=18)**


