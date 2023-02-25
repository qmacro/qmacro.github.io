---
layout: post
title: Project Gateway. A call to arms. Or at least to data.
date: 2011-02-01
tags:
  - bluefinsolutions
---

Here I'll plot a brief history of SAP integration tools and technologies, and look forward to what Project Gateway promises: Uniform, resource orientated access to your enterprise functions and information. It's time to take back control of your data.

"Integrated Software. Worldwide." - that used to be the strapline for SAP's enterprise software system R/3. Before that, the mainframe predecessor R/2 was so menacingly monolithic that there was no strapline needed to underline the deep integration and the message that "everything your enterprise needs is inside this large, smooth-sided black object, with a precise ratio of 1:4:9". No light emanated from it, and no light could penetrate it, save for specialised forms of lasers running at a frequency of APPC/LU6.2 (look it up).

## Integration turned inside out

Of course, that was then, and this is now. SAP has slowly but surely turned the integration pattern inside out, and it is not uncommon for an enterprise's ERP landscape to have more SAP systems than you can shake a stick at. Or a laser gun. Want CRM? There's an SAP system for that. Want APO? There's an SAP system for that. Want Process Integration? There's an SAP system for that (to paraphrase a modern Apple saying). And all this time, enterprise data and functions -- your information and processes -- have been stored, cocooned, imprisoned inside that constellation of ABAP and Java runtime environments.

Ok, "imprisoned" is a little harsh. There have been, and remain, a myriad ways to invoke processes, pull data, exchange this, expose that. Remember the RFC software development kit (SDK)? Remember registering programs with the gateway process, programs that were written in C and looked almost exactly like the example code that came with that very SDK, with just a bit of custom stuff added by you to make it do what you wanted? How about the Internet Transaction Server, with its 'wgate' process that spoke Common Gateway Interface (CGI), and the so-crazy-it-deserves-respect dynpro-scraping 'agate' process, the only known program apart from SAPGUI itself to attempt to speak the mysterious DIAG protocol? WebRFC templates? What about the venerable SAP Business Connector, a rather handy toolbox of pipes, workflows and dynamic page generations which is still going strong in some corners even today?

No? Well how about Business Server Pages (BSPs)? Mix ABAP and markup in the style of ASP, JSP, DSP or whatever other \*SP flavour you can think of, throw in a little extra complexity, and you have a pretty powerful and outward facing toolset. Still using BSPs? Of course, it's a trick question. You want to answer "yes", but you're supposed to answer "ah no, we've embraced the MVC philosophy and have gone all WebDynpro now". You might answer "what's that got to do with SAPGUI?". And I wouldn't hold it against you.

## Proprietary protocols, inside-out approaches

Whatever your poison (and I won't even attempt to cover the SOAP, SOA and Enterprise Service offerings because I, and more importantly you, dear reader, would be here all afternoon), over the years, there's a single truth that emerges when you consider all the tools and technologies past and present that have been made available to you to expose your business information and functions to a wider sphere of users and systems. You can do it, but you do it, inevitably, on SAP's terms. Proprietary protocols. Proprietary (and frankly bonkers) approaches, in some cases. The approaches are predominantly "inside-out". A lot of heavy lifting inside of the SAP system walls, then more stuff outside.

And that's just the server-orientated view. What about the clients? SAPGUI, anyone? How much has that actually changed, deep down, since the days of Windows 3.11? You can't fit SAPGUI in your pocket, either.

So. Here you are. With your most valuable business information and processes inside SAP. Not locked up, by any means. But you're prevented from grabbing and running with that information, those processes, in an agile way, because of the inertia caused by the sheer weight of SAP-specific technology between where your servers end and where your users start.

## The promise of SAP's Project Gateway

But it's 2011 and time for a change. A time for a call to arms. Or at least a call to data. SAP's announcement of Project Gateway at 2010's TechEd changes the landscape. In a big way. SAP's slow, inexorable, inevitable move towards open data protocols and standards is to be celebrated. And capitalised upon. What SAP is trying to do with Project Gateway is arguably a game changer in the sport of opening up enterprise data and functions. They have embraced and adopted such standards, protocols and approaches such as Atom, the Atom Publishing Protocol (APP), resource orientation (yes, related to Representational State Transfer!) and the Open Data Protocol (OData). From this perspective, if it works for Google and Google's customers, it can work too for SAP and SAP's customers!

Think about it: What Project Gateway intends to deliver is a smooth-edge platform for controlled access to resources in SAP. Yes, I used the word 'resources' deliberately there. And the intended delivery is via access from an outside-in perspective, too! Data and functionality exposed and ordered in terms of URLs. Payloads orientated along public and openly adopted MIME types such as Atom feeds and elements, and JSON. A uniform interface to that seething, writhing mass of enterprise engine parts.

## Gateway's new direction is a big deal

What's the significance of all this? All of a sudden, the playing field is level for you to use the right tools, and the right teams, for the job. For example: Want to build a mobile app that exposes certain timesheet functions from HR? Use JQTouch, jQuery and PhoneGap, identify the right ways in through the Gateway, get your Javascript-savvy developers (what, you have none? Get some!) and away you go, build a web-native app and launch in weeks not months. Heck - change your mind, go wild and build a native iPhone app with Objective-C (you'll regret it! but that's another story) … and use the same Gateway resources and the same underlying application protocol - HTTP! Stop building, worrying about and being paralysed by custom and brittle chains of integration tech and start delivering apps -- small or large, single-use or long-lived -- to your users.

Project Gateway is almost upon us. What it is and how it will eventually work is important. But what's vastly more important is what it means, what it represents, and what direction SAP is taking.

## A final message

And with Gateway's arrival, marshal your developers, because the data's already marshalled for you. Ask not what you can do for your data; ask what your data can do for you! Take back control of your data, your processes, your developments, your custom front ends & extensions and your loosely coupled integration.

As I started with references to 2001: A Space Odyssey, I'd like to end with a bad paraphrasing of Bowman's last message to Earth:

ALL THESE WORLDS<br/>
OF DATA AND FUNCTIONALITY<br/>
ARE YOURS EVEN<br/>
THAT BIT IN CO-PS THAT NOBODY USES<br/>
USE THEM TOGETHER<br/>
USE THEM IN PEACE

---


[Originally published on the Bluefin Solutions website](https://web.archive.org/web/20180227042502/http://www.bluefinsolutions.com/insights/dj-adams/february-2011/project-gateway-a-call-to-arms-or-at-least-to-da) (where they disowned me because of this article ... that championed the introduction of what now drives and supports everything related to SAP's cloud activities from the ABAP platform).
