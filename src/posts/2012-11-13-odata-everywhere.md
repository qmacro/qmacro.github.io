---
layout: post
title: OData Everywhere
date: 2012-11-13
tags:
  - sapcommunity
---
We're well into Day 1 at SAP TechEd 2012 in Madrid, and while SAP NetWeaver Gateway has already been mentioned in this morning's keynote (even though the keynote was more Sapphire-focused than TechEd-focused), and is noted as an enabler in various conversations public and private, there's a particular part of Gateway that is shining through as today's story for me: OData.

Just now, I attended the [SAPUI5](/blog/posts/2012/05/07/sapui5-the-future-direction-of-sap-ui-development/) Q&A session with Tim Back and Oliver Graeff, where they presented a great overview of the libraries, tools and features of what is becoming an ever more popular platform for outside-in UI development. After all, it's almost policy at SAP to use SAPUI5 for development projects, where appropriate. ("Where appropriate" means in many circumstances except probably heavy power user application UI paradigms).  One of the key features of SAPUI5, and in particular the DataTable controls, is the ridiculously easy consumption of data. In particular, data made available by Gateway, in the form of OData. Sure, [as I've noted before](/2012/02/13/sapui5-says-hello-odata-to-netweaver-gateway/), SAPUI5 can consume arbitrary XML and JSON too, but the data exposed in the related, resource-oriented fashion by Gateway, OData in other words, is where the magic happens.

Start with controlled definition of resources, and the relationship between them, done in your systems of record using the IW_BEP backend Gateway component building Model and Data providers, either manually or using the Service Builder. Then expose those resources and relations to your UI developers using the core Gateway components (GW_CORE and IW_FND). Then, you're off. Within no time you can start to see an application form around that data, with the right layer performing the right function with minimum friction. And that speed comes from the investment SAP has made in OData, an investment to make it all pervasive and all consumable.

So we know about Gateway being a key mechanism to expose OData for ABAP stack systems. Is there anything else? You bet. SAP HANA, full of data, can expose that data in an OData context. Use the magic of xsodata, create a definition marking a HANA table or view in a schema as an Entity,  and *boom* you have a consumable OData service. And it doesn't stop there. There are facilities in the NetWeaver Cloud to produce OData too.

What does all this mean? Well, to me it means two things. The first thing is that it means that Gateway has already been a great success. It Just Works(tm). I recently completed a customer project which went live earlier this year, and Gateway was a key component in the integration architecture. And after setting Gateway up and defining our entities and the relations between them, we moved up a layer in the stack and never really had to work hard on Gateway at all. It did exactly what it said on the tin. We started to use, and reuse, entities that we'd defined, in building out the features in the consuming application.

The second thing is how important your investment in Gateway is. [Embrace Gateway](/blog/posts/2011/02/01/project-gateway.-a-call-to-arms.-or-at-least-to-data./) and by definition you're embracing OData. Before you know it you and your fellow developers are conversant in Entities, Entity Sets, Associations and Navigations (the relationships) - the building blocks of information in OData. And while this is a super end in itself, you're also setting yourself up to move out into the cloud, and across onto HANA. Have a look at the speed with which you can put together an app that consumes data supplied to it from Gateway. And then consider you're investing in that speed, and that speed across platforms.

[Originally published on SAP Community](https://blogs.sap.com/2012/11/13/odata-everywhere/)
