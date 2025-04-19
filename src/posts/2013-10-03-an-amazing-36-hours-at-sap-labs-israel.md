---
layout: post
title: An Amazing 36 Hours at SAP Labs Israel
date: 2013-10-03
tags:
  - sapcommunity
---
I'm sitting in TLV airport waiting for my flight back to MAN via FRA. I've just spent a whirlwind 36 hours, more or less, in an amazing developer engine also known as SAP Labs Israel. Before I start though, I want to extend my gratitude and thanks to all those who made me so welcome (which is basically *everyone*) and especially to Rafi Bryl, Amir Blich, Gabi Koifman and Keren Golan.

![Me and Aviad](/images/2013/10/saplabsil_meandaviad.png)

Of course as you may know Aviad, who organised the whole event, was announced as one of the new SAP Mentors today. Congratulations! I did have the "insider knowledge" yesterday, hence the double meaning of my [flying the @SAPMentors flag](/tweets/qmacro/status/385428895131906048/) tweet yesterday evening on the roof terrace of the SAP Labs building 🙂

![Customer corner poster](/images/2013/10/customercorner.png)

It was a mind stretchingly great time, in the form of a Customer Corner Event which saw attendees from Danone, Coca Cola and Bluefin (me). Aviad had prepared a full agenda for Day 1, which included HANA related customer stories, roundtable discussions on various deeper-dive topic such as UI Integration Services, Portal-esque features for a solid integrated UI/app strategy, HANA XS, River, OData and more. There was also a panel discussion that covered topics such as cloud, HANA adoption, performance tuning, and "Kindergarten code" (yes, that phrase will stick!).

The second (half-day) gave me a chance to get a deeper dive look at some of the things we'd covered in Day 1. Specifically I'm thinking of SAP HANA Integration Services and River. There's too little time before my flight to cover these topics decently, so I'll keep it short for now and encourage you to take a look yourself, either in the existing docs or look to TechEd and beyond for the amazing River features. Not long to wait!

## SAP HANA UI Integration Services

You've built a few SAPUI5-based apps. You're also looking at SAP Fiori. But have you thought about your overarching UI strategy? Moving [from inside-out to outside-in based development](/blog/posts/2012/05/07/sapui5-the-future-direction-of-sap-ui-development/) isn't just about building great apps for multiple runtimes. It's about a consistent experience, role-based access to apps, common services (e.g. persistence), tools for non-developer/user roles such as designers and administrators, and the ability to give your users a unified entrypoint to all this.

So you should be looking at a "frontend server" that might consolidate Gateway foundation/core, customisation and the repository for SAPUI5 runtime artifacts. The SAP HANA UI Integration Services provides the API layer as the foundation for this "unified shell", and is a very viable option (running on HANA) for such a "frontend server". Plus you get the toe-in-the-water benefits of a HANA system ready for trialling and experimentation. Stick this in the cloud and you're onto a winner.

Oh, and want portal-style ability to define multiple apps in the same 'site', communicating with each other via publish/subscribe, using an open standard? Add OpenSocial to the mix and you've got it. And they have. Define a simple SAPUI5 component with an OData model connection to a live backend service, have the data presented to you in that widget in familiar "Excel" format (rows and columns), and then pipe that data into another graph widget via pubsub. Excellent.

## River Language (aka RDL)

River as a concept and in various concept/demo forms has been around for a while, dating back at least to 2010 when I got to see a demo at the Innovation Weekend before the SAP TechEd 2010 event in Berlin. [Jacob Klein wrote more recently about River](https://web.archive.org/web/20200804233302/https://blogs.saphana.com/2012/11/15/introducing-rdl-the-river-definition-language/), and was at the deep dive today at SAP Labs.

What I saw today bowled me over. Imagine a JavaScript-like, part-declarative, part imperative language where in Eclipse, in one breath, if you want to, you can:

define your data (entities, properties, relationships, etc)
write procedural code in the form of functions to provide custom logic (when a simple entity read/write, for example, is not enough)
declare authorisations and roles
and then, seconds later, use a table/column style UI still within Eclipse to create random / test data for the entities you've just defined, navigate those entities and jump between them via the relationships you also defined, and oh by the way have all the runtime artifacts generated automatically for you in the HANA backend. Further, the whole thing is exposed as an OData service with the appropriate entities, entitysets, associations, enumerations and function imports (I think you can guess which of these related to your data definitions in River).

Within the procedural code you can access any HANA-based data, or via adapters, reach out remotely to your (say) ABAP stack-based systems too. And yes, (I asked, and they showed me live) you can debug and single-step through this too. Debugging directly in Eclipse or triggering it via setting a header in the HTTP request from outside.

Rather impressive stuff.

So unfortunately I have to go and catch my flight (and find somewhere to sleep!). It was a pretty awesome (and packed) time and I was totally privileged to have been able to take part. Thank you all for having me!

[Originally published on SAP Community](https://blogs.sap.com/2013/10/03/an-amazing-36-hours-at-sap-labs-israel/)
