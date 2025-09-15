---
title: Webinar and more - Understanding SAP Fiori
date: 2014-07-02
tags:
  - bluefinsolutions
---

On Thursday 19 June, [Brenton O'Callaghan](https://web.archive.org/web/20171006213802/http://www.bluefinsolutions.com/Blogs/Brenton-O-Callaghan/) and I hosted a free, hour-long webinar entitled "Understanding SAP Fiori". We followed it up with a "Director's Cut" deep dive video into some of the topics that we didn't have time for. This blog post summarises what we covered.

## SAP Fiori "now included"

As you may well have heard, SAP announced earlier last month at Sapphire that, along with SAP Personas, SAP Fiori is ["now included" within the underlying licences for SAP software](https://web.archive.org/web/20170915090856/http://www.news-sap.com/sapphire-now-sap-fiori-user-experience/).

This is a significant milestone in both SAP's openness to customer & partner concerns and also in its drive to renew, nay overhaul, the user experience (UX) for its business software. The significance did not go underappreciated, especially as our very own [John Appleby](https://web.archive.org/web/20170915090856/http://www.bluefinsolutions.com/Blogs/John-Appleby/), was a [key participant in the conversations to free SAP Fiori](https://diginomica.com/sap-fiori-freeori).

## Understanding SAP Fiori

Our webinar "Understanding SAP Fiori" covered, in equal parts:

<br/>

* an overview of the current application offerings
* a live demonstration based on the latest ERP on HANA trial
* coverage of the overall architecture of SAP Fiori plus a dive down to application level
* a Q&A session

## Application availability & distribution

SAP Fiori was released around this time last year, with 25 Employee Self Service / Manager Self Service (ESS/MSS) applications in Wave 1. Since then a number of Waves have been delivered along with improvements to the general UI infrastructure that supports them, most significantly the move to the SAP Launchpad (which is also [converging with SAP Enterprise Portal technology](https://blogs.sap.com/2014/06/23/sap-enterprise-portal-74-sp7-sap-fiori-design-in-the-sap-enterprise-portal/)).

There are now over 310 applications covering the three core SAP Fiori application archetypes - Transactional, Analytical and Factsheet.

![Distribution of apps across the three SAP Fiori archetypes](/images/2014/07/Webinar-More-Understanding-SAP-Fiori-1.jpg)

Note that only Transactional applications can be powered by non-HANA database platforms; the Analytical and Factsheet applications require SAP HANA.

There's a growing coverage of applications for various sectors of the SAP business application spectrum. To take the Enterprise Resource Planning (ERP) sector as an example, there are applications for Financials, Travel Management, Retail, Production Planning & Control, Project System, Materials Management, Sales & Distribution, Logistics Execution, Quality Management, Plant Maintenance, Global Trade Management, Human Capital Management, Insurance and a number of new SAP Smart Business applications.

To explore this information and more, you might be interested to try out the SAP Fiori App Analysis application, something simple that I built to help prepare for the webinar. It is an SAP Fiori style app itself which allows you to explore the SAP Fiori application offerings; a relationship which will perhaps bring a smile to the faces of those fans of Douglas Hoftstadter and his writings about "[meta](https://en.wikipedia.org/wiki/Meta)".

![The SAP Fiori App Analysis app](/images/2014/07/Webinar-More-Understanding-SAP-Fiori-2.jpg)

## Application architecture

The architecture for SAP Fiori is nothing brand new, at least not in significant areas. SAP Fiori is, at its barest essentials, the combination of [SAPUI5](/blog/posts/2012/05/07/sapui5-the-future-direction-of-sap-ui-development/) and [OData](https://blogs.sap.com/2012/11/13/odata-everywhere/) (via [Gateway](/blog/posts/2011/02/01/project-gateway.-a-call-to-arms.-or-at-least-to-data./)). But because SAP Fiori and everything that it embodies -- from [design patterns](https://experience.sap.com/fiori-design/), to development principles, the use of HTML5 for client side execution and a unified API for backend (read-write) consumption -- is essentially a significant part of SAP's future application development direction, and arguably much greater than the sum of its parts, it's essential that we as customers and partners understand how Fiori ticks.

Note that I said "Fiori" and not "SAP Fiori", because we can and should develop Fiori applications too. We can already extended and enhance existing SAP Fiori applications; the next logical step (one that some of us have taken already) is to build our own. Fiori is not just a pretty sticking plaster over SAP's core, it is a model of how applications could and should be developed in the future. Our ABAP-based skills are not side-lined, indeed quite the contrary: Aside from the more obvious point that OData services powered by Gateway are written in ABAP, the software logistics, standards, processes and procedures that have been refined over the years apply equally to the application lifecycles in the new Fiori context.

Deep dive into SAP Fiori application architecture
An hour isn't long enough to cover everything we wanted to say in this initial SAP Fiori webinar. So Brenton and I sat down the next day, in the Smallest Office In The World (reminiscent of the office that Sam Lowry is given in the classic film Brazil) and recorded a "Director's Cut" extension to the webinar itself (which we didn't record).

This was a deep dive into SAP Fiori application architecture, and covers lots of low level detail on how an SAP Fiori application ticks. We look into the general architecture of applications and focus specifically on one, the Approve Purchase Contracts transactional application. Grab a coffee and a biscuit and let us guide you through the new world; even if you're predominantly functionally focused, you will still get an understanding of the patterns and approaches that the SAP developer teams have taken for our application future.

If you attended the webinar (it was well attended!), I hope you enjoyed it and found it useful. If you didn't, I hope at least that this post gave you some insight, and I'd encourage you to watch the deep dive video and explore the SAP Fiori application offerings with the SAP Fiori App Analysis application.

Until then, share and enjoy!

---


[Originally published on the Bluefin Solutions website](https://web.archive.org/web/20170915090856/http://www.bluefinsolutions.com/insights/dj-adams/july-2014/webinar-more-understanding-sap-fiori)
