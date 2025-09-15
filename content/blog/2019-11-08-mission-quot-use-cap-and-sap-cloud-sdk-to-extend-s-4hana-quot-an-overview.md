---
title: "Mission 'Use CAP and SAP Cloud SDK to Extend S/4HANA' - an overview"
date: 2019-11-08
tags:
  - sapcommunity
  - cap
  - sapcloudsdk
  - teched
---
*This post serves to outline what you can build in the "Use CAP and SAP
Cloud SDK to Extend S/4HANA" mission created for SAP TechEd 2019.*

**Update Feb 2021: This mission has now been retired as the details
relating to the products and topics at hand have moved on; features have
changed and improved over the last year and a half.**

There are [four missions](https://developers.sap.com/app-space.html)
that have been put together specifically for SAP TechEd 2019, covering
Cloud Platform Portal, Cloud Platform ABAP Environment, HANA Advanced
Analytics, and (my favourite) S/4HANA Extensions with CAP.

## Overview

The S/4HANA Extensions with CAP mission consists of six tutorials, with
some checkpoints in between.

![](/images/2019/11/Screenshot-2019-11-08-at-10.44.18.png)

These six tutorials take you on a journey, covering API Business Hub
APIs, the Cloud SDK, CAP (the Cloud Application Programming Model), some
application logic in JavaScript, and Fiori elements powered by
annotations.

Even after TechEd, the mission is available to you, and you can jump in
right now here:

Mission: [Use CAP and SAP Cloud SDK to Extend
S/4HANA](https://developers.sap.com/mission.cap-s4hana-cloud-extension.html)

## Detail

To give you a bit of a heads-up, here are the titles of those
tutorials:

1.  [Set Up a Basic Mock S/4HANA
    Service](https://developers.sap.com/tutorials/cap-cloudsdk-1-mock-service.html)
2.  [Install an OData V2
    Adapter](https://developers.sap.com/tutorials/cap-cloudsdk-2-v2-adapter.html)
3.  [Create a Basic CAP-Based
    Service](https://developers.sap.com/tutorials/cap-cloudsdk-3-basic-service.html)
4.  [Enhance CAP-Based Service to Refer to Remote
    Addresses](https://developers.sap.com/tutorials/cap-cloudsdk-4-enhance-consume.html)
5.  [Add Service Logic to Consume Remote Address
    Data](https://developers.sap.com/tutorials/cap-cloudsdk-5-srv-logic.html)
6.  [Create a Frontend with SAP Fiori Elements and
    Annotations](https://developers.sap.com/tutorials/cap-cloudsdk-6-fiori-frontend.html)


In essence, you use CAP to mock an S/4HANA API, which produces a nice
OData v4 service, stick an OData v2 adapter proxy in front of it, try it
out manually with the SAP Cloud SDK in the Node.js REPL, then go and
build another OData service with CAP that has its own entities but also
reaches out to consume the first service (the mocked S/4HANA API) too,
using the SAP Cloud SDK in some custom service implementation logic.
Finally you add some annotations to drive a simple Fiori elements based
app.

To provide you with a map of sorts, for your journey, here's a diagram
showing the essential parts of what you'll be building, and how they
relate to each other.

![](/images/2019/11/Screenshot-2019-11-08-at-10.46.17.png)

**Tutorials 1 and 2** concern themselves with the green components (in
the middle), **tutorials 3, 4 and 5** concern themselves with the blue
components (on the left hand side), and **tutorial 6** is where you
drive the Fiori elements app shown at the bottom.

If you are attending SAP TechEd in Bangalore next week, come on down to
the Developer Garage where you can follow this journey yourself on
workstations set up for you all to complete the missions.

If you can't make it to SAP TechEd this year, no problem - you can
complete this mission at home too!

Good luck, and don't forget to pack a flask of decent coffee before you
set off on your journey!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/mission-quot-use-cap-and-sap-cloud-sdk-to-extend-s-4hana-quot-an-overview/ba-p/13435998)
