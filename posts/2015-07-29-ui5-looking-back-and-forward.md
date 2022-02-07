---
layout: post
title: UI5 - looking back and forward
tags:
- http
- odata
- open
- openui5
- rest
- soap
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 26 by [DJ Adams](//qmacro.org/about/)**

![]( {{ "/img/2018/02/Screen-Shot-2015-07-29-at-07.33.30-624x255.png" | url }})

It was in the spring of 2012 when I wrote this piece about the new kid on the block, SAPUI5:

[SAPUI5 – The Future direction of SAP UI Development?](http://www.bluefinsolutions.com/insights/blog/sap_ui_5_the_future_direction_of_sap_ui_development/)

The fledgling toolkit had been released at version 1.2 earlier that year, and while it had clearly been in gestation for a while inside SAP, it was still new and raw enough to make folks wonder what it was all about. More than the newness or the rawness was how it was different, how it changed the rules. And what made it even more interesting was the fact that while SAP had changed a lot of rules since the 80s, this time, it was SAP embracing common practices and growing standards outside its own development ecosphere. And that was a good thing.

So SAPUI5 was not just a toolkit, it was more than that. It was arguably the poster child for how SAP was changing, changing to embrace, adopt and build upon open standards and protocols.

Of course, that had been happening for a while, most notably, [at least in my opinion](https://vimeo.com/36828893), by the introduction of the Internet Communication Manager (and corresponding user-space Internet Communication Framework) to the R/3 architecture, allowing SAP systems to speak HTTP *natively*. And there was OData, which SAP adopted as a REST-informed protocol and format for the next generation of business integration. It had been a long time coming; the journey from service-orientation to resource-orientation starting from the mid 2000’s — with posts like this: “[Forget SOAP – Build Real Web Services with the ICF](http://scn.sap.com/people/dj.adams/blog/2004/06/24/forget-soap--build-real-web-services-with-the-icf)” :-) — was long and arduous.

So it was met by some with trepidation, wonder, cynicism even. But the rise and rise of UI5’s success has been undeniable. Success not only in becoming the engine powering the first SAP Fiori UX revolution, but also in the move towards a more open and outward facing development approaches.

The UI5 teams of designers and developers themselves, in Walldorf and around the world, have open software and standards in their DNA. UI5 itself has been open sourced. The development standards and processes are, out of necessity, different. And we can see that first hand. Just look at the home of UI5 on the web – at [https://github.com/SAP/openui5](https://github.com/SAP/openui5). Github!

![]( {{ "/img/2018/02/Screen-Shot-2015-07-29-at-07.18.18.png" | url }})

The development process is there for us to see, warts and all. The smallest changes are being done, in public. Look at the one authored 11 hours ago in this screenshot. It’s a [simple improvement for variable declaration](https://github.com/SAP/openui5/commit/78d6ed4df73ef497241a36e30a67145596df2b35) in the code for the Message Popover control in the sap.m library. It doesn’t matter what it is, what matters is that it’s open. For us all to see, scrutinise, and most importantly, learn from.

UI5 powers SAP Fiori, the services of their cloud offerings (for example in the form of the Web IDE, written in UI5) and of course the S/4HANA business suite. It’s destined to become a part of [the future normal](http://www.bluefinsolutions.com/insights/dj-adams/august-2015/building-blocks-for-the-future-normal). It’s a toolkit with a strong pedigree, a toolkit that is not perfect (I can’t think of any software that is) but a toolkit with passionate folks behind it. It’s gaining some adoption outside of the SAP ecosphere too, and in some cases is almost becoming part of the furniture – not the focus of energy, but the enabler of solutions. It Just Works(tm) and gets out of the way. That for me is a sign of growing maturity.


