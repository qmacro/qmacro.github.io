---
layout: post
title: CAP is important because it's not important
date: 2019-11-06
tags:
  - cap
  - sap
  - sapcommunity
---
In this post, I consider what CAP really is, what it gives us, and why we should consider it a fundamental piece of the puzzle in the cloud context and beyond.

Update (08 Nov): This blog post is available in audio format as [an episode](https://anchor.fm/tech-aloud/episodes/CAP-is-important-because-its-not-important---6-Nov-2019---DJ-Adams-e8rg7s) on the [Tech Aloud podcast](https://qmacro.org/2019/09/17/new-podcast-tech-aloud/). Also, I recorded a CodeTalk episode on this subject with [Ian Thain](https://people.sap.com/ian.thain) – watch it here: <https://www.youtube.com/watch?v=5ffTjFdjs8M>.

If you read one technical article today\*, make it the [About CAP](https://cap.cloud.sap/docs/about/) page in the online documentation, which starts with the following overview:

> The "SAP Cloud Application Programming Model" is an open and opinionated, framework of languages, libraries, and tools for building enterprise-grade services and applications. It guides developers through proven best practices and a great wealth of out-of-the-box solutions to recurring tasks.

Key for me here is that the design principles that are at CAP's core (open and opinionated, zero lock-in, non-intrusive and platform agnostic) and that have influenced what CAP is and what it can do for us, explain why it is fundamental.

\*(If you don't have time to read it, it's also available as a podcast episode in the [Tech Aloud podcast](https://qmacro.org/2019/09/17/new-podcast-tech-aloud/) here: [SAP Cloud Application Programming Model (About CAP) – SAP – September 2019](https://anchor.fm/tech-aloud/episodes/SAP-Cloud-Application-Programming-Model-About-CAP---SAP---September-2019-e5f76p).

## What CAP is for me

CAP provides the **substrate** within or upon which actual services and applications can be designed and built, cloud-ready.

It is the fresh, fertile and well-watered **soil** in which we can grow our flowers and food.

It is the **backbone** which is the stable base that connects everything together, the **trunk** from which all branches can flourish.

To bring these metaphors a little closer to the subject at hand, CAP is like the combination of mores and spoken languages upon which society is built … or, in a narrower computing context, it's the programming language that we use to express our solutions.

What this suggests to me is that if we see CAP in this way, we should master enough of it to express ourselves, to start building services, to plant seeds and nurture them into blossom, to build upon and build with.

Just like we learn a language with which to express ourselves, whether that language is English, international sign language, or APL, we should make a point of learning what CAP is, how it works, what it can do for us, and how to embrace and wield the power that it gives us as developers.

## A means to an end

CAP is not an end in itself, it is a means to other ends. And my goodness, in my experience, what a means it is!

It's hard now to remember the times when the effort to create a functioning read-write OData service was so great that proof-of-concept projects didn't even get off the ground. Now, literally with less than ten lines of declarative code you can spin up a fully formed CRUD+Q OData service, and what's more, adding custom handlers to augment the standard handlers is also only a few lines of code away.

Similarly, I had never really seriously attempted mocking a business service from the SAP API Business Hub before, as the effort was too great. Now with CAP it's a [matter of minutes](https://developers.sap.com/tutorials/cap-cloudsdk-1-mock-service.html).

It's hard to remember what it was like to explore how annotations actually drive Fiori elements, because of the complexity involved in establishing where to store and how to serve up annotations along with an existing OData service. With CAP you just add them to a file, using Notepad or similar, and you're done. The time between tweaking annotations and refreshing your Fiori elements app to see what those tweaks do is now measured in seconds (and yes, I do that, I'm just like you :-)).

I can't actually remember a time when I didn't have to think about specific persistence layers and machinery when prototyping a service, until CAP came along.

And the mental heavy lifting previously needed to consider how I might go about building a solution that involved persistence, built-in extensibility, enterprise messaging and more … well, as a regular developer with limited brain power, I'm now in a much better position to create solutions like that.

## Start smart

With the building blocks such as the family of [Domain Specific Languages](https://blogs.sap.com/2019/09/18/tech-aloud-podcast-an-introduction/#dsls)\*, with the convention-over-configuration approach, with the first class support for [today's most popular language](https://qmacro.org/2019/04/18/brief-thoughts-on-the-2019-stack-overflow-developer-survey-results/#languages), CAP helps you start smart, start your development project at a level far higher up, far nearer the business domain, than you could have started previously.

You could say that this higher level starting point puts you closer to the cloud before you've even begun!

\*(See the [CDS language reference documentation](https://cap.cloud.sap/docs/cds/) to learn more about the CAP DSLs.)

So, my advice is – learn CAP, understand how to make use of the superpowers it gives you, and be mindful of its key role as a development substrate letting you focus on the business domain at hand.

And, in the nicest possible way, just as for me my knowledge of the English language and and my understanding of social rules and customs fades into unimportance when interacting with my fellow human beings, consider CAP as unimportant in the same way. Fundamental, something you should learn and be able to make full use of, but a means to an end.

---

[Originally published on SAP Community](https://blogs.sap.com/2019/11/06/cap-is-important-because-its-not-important/)
