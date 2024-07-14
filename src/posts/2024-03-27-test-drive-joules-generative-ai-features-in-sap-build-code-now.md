---
layout: post
title: Test drive Joule's generative AI features in SAP Build Code now!
date: 2024-03-27
tags:
  - sapcommunity
  - business-application-studio
---
TL;DR - SAP Build Code is GA, and for a limited time (1 month, starting now) you can test drive the generative AI features of Joule in SAP Build Code.

## Introduction

This week, SAP Build Code is GA: Generally Available. That's pretty exciting, given that one of the key features is the set of generative AI capabilities available through Joule. But guess what - you can try these capabilities out in SAP Build Code starting now. There's a test drive tutorial that's ready and waiting for you, and a period of four weeks, until Fri 26 Apr, where you can kick the tyres and put Joule through its paces. We'll round out this period with a special live stream episode too (see later in this post for details).

## Building CAP services with the help of generative AI

If you saw the [Developer Keynote, part of SAP TechEd 2023](https://www.youtube.com/watch?v=kLbF0ooStZs), you will have seen [a glimpse of Joule in action here](https://www.youtube.com/watch?v=kLbF0ooStZs&t=707s), where we built an SAP Cloud Application Programming Model (CAP) service with Joule starting from simple text prompts.

![developer keynote screenshot](/images/2024/03/keynote-screenshot.png)

Here's a quick overview of the four main areas where generative AI comes into play, in the form of Joule, when putting together a CAP service.

### Creating the data model and service

Normally the first thing you'll want to do is define the entities and the relationships between them. You'll also want to describe how these entities are then exposed. In CAP terms, these are the entities and relationships at the persistence layer (which by convention we like to define in the "db/" directory), and the exposure thereof at the service layer (which by convention we like to define in the "srv/" directory).

With the "Data Model and Service Creation" section of the guide, which is part of Joule, you can do this by supplying a text prompt:

![data model and service creation](/images/2024/03/data-model-and-service-creation.png)

### Generating and managing sample data

CAP already makes it super easy to supply test data for your entities, for use at design time. Joule goes one step further in not only generating that test data for you, but giving you a facility to enhance it, by supplying constraints to which the test data must comply, again in the form of a text prompt.

### Applying custom logic for the service

While it still blows my mind that CAP provides complete support, out of the box, for all operations of an OData service (known as "CRUD+Q", in other words "Create, Read, Update, Delete and Query"), wait until you see what the generative AI facilities can offer you so that you can make that service your own.

The Joule developer facilities in SAP Build Code allow you to have Node.js (JavaScript) code generated for all the standard phases of the four main events. In other words, for the "Before", "On" and "After" phases of the "Create", "Read", "Update" and "Delete" events ("Query" is handled with "Read").

Here's what that looks like:

![service logic configuration](/images/2024/03/service-logic-configuration.png)

These facilities are available in the "Application Logic" section of the guide.

As [I remarked in my section of the Developer Keynote where I showed off this facility](https://www.youtube.com/live/kLbF0ooStZs?feature=shared&t=1260), the generated code is more than fine, it's often exemplary - of a standard to which I can aspire. Pretty amazing.

### Help with unit testing

I'll be the first to admit that I am not great at creating unit tests. It's a chore, and I'm not very good at it. So I'm happy that the fourth section of the guide, "Unit Testing", offers me help in this area. Here again, using Joule, I can generate and subsequently manage unit tests for my service. Now that is something that I will definitely be digging into more, because - remember kids - the three virtues of any great programmer are [Laziness, Impatience and Hubris](https://wiki.c2.com/?LazinessImpatienceHubris).

## Test drive tutorial available now

Talking of digging in, you can too. For a limited period, every developer can get access to these facilities. To mark the occasion of the GA event, the team has put together a "test drive", available in our [Tutorial Navigator](https://developers.sap.com/tutorial-navigator.html). It's a mission called [SAP Build Code Test Drive](https://developers.sap.com/mission.sap-build-code-test-drive.html) and it consists of two tutorials, where you can first get everything you need set up, before diving in to try things out:

![mission on the Tutorial Navigator](/images/2024/03/test-drive-mission.png)

In addition, you get enough "prompt credit" to be able to run through the test drive. The best thing? All you need is a trial account on the SAP Business Technology Platform. And everyone who completes the mission gets a badge too.

## Support during the test drive period

This test drive is available until Fri 26 Apr. So get started right now!

During this test drive period, there are some awesome folks from the SAP Build Code and Joule team here at SAP ready to help with your questions. Where? In the [SAP Build Code topic area](https://pages.community.sap.com/topics/build-code) of the SAP Community platform. In particular, you can use the menu item shown here to ask a question:

![create a question](/images/2024/03/create-a-question.png)

If you want to jump straight to the question form, with the "SAP Build Code" managed tag already assigned (which is basically where this menu item will take you), you can use [this URL](https://community.sap.com/t5/forums/postpage/choose-node/true/product-id/73555000100800004372/board-id/technology-questions).

![new question](/images/2024/03/new-question.png)

## Wait, there's more!

At the end of the test drive period, we in the Developer Advocates team will be looking forward to kicking the tyres with you too, and we plan to do that live, on a special [live stream episode](https://www.youtube.com/watch?v=EpuVqWDT2hw) of the [Hands-on SAP Dev](https://www.youtube.com/playlist?list=PL6RpkC85SLQABOpzhd7WI-hMpy99PxUo0) show on Fri 26 Apr. That will definitely be a fun and enlightening episode for all of us, I'm sure.

[![Let's test drive Joule's generative AI features in SAP Build Code together! - thumbnail](/images/2024/03/digging-into-sap-build-code-thumbnail.png)](https://www.youtube.com/watch?v=EpuVqWDT2hw)

Just in case you missed it, there was a great blog post from Bhagat Nainani just published too: [SAP Build Code is now generally available to speed up your development with generative AI](https://community.sap.com/t5/technology-blogs-by-sap/announcing-general-availability-of-sap-build-code-speed-up-development-with/ba-p/13646073).

And for a high level overview, check out [SAP Build Code is now on SAP BTP Trial: Elevate Your Development Experience](https://community.sap.com/t5/technology-blogs-by-sap/sap-build-code-is-now-on-sap-btp-trial/ba-p/13642626).

So what are you waiting for?

👉 Head over to the Tutorial Navigator right now and dive in, the [test drive](https://developers.sap.com/mission.sap-build-code-test-drive.html) is waiting for you. Don't forget, this test drive period will end in a month from now!

---

[Originally published on SAP Community](https://community.sap.com/t5/application-development-blog-posts/test-drive-joule-s-generative-ai-features-in-sap-build-code-now/bc-p/13650951)
