---
title: "Monday morning thoughts: Workflow Forms and the definition of a developer"
date: 2018-09-17
tags:
  - sapcommunity
  - mondaymorningthoughts
description: I think briefly about the definition of a developer, and in that context look at the advent of Workflow Forms, a major new addition to the functionality of the Workflow service on SAP Cloud Platform.
---

## How do you define a developer?

Last week, a question came up about developers. Specifically, do you
define a developer as one who writes code, or is the definition broader
than that? It's an interesting question. On the one hand, I class
myself as a developer, I write code (or what passes for code), and I've
traditionally considered these two things as being related. Of course
they're related - "developer" is the name of someone who develops, or
creates, software. And software is code that is executed on a machine.

But thinking about it a little more, perhaps the definition is broader
than that. The first developers wrote in machine code, then assembly
language, and the growth of development as a practice and the number of
developers increased as the language abstraction layers grew, as we got
further and further away from the machine. This of course is a good
thing. Most languages today bear little resemblance to the microcode
that is only one step away from the hardware that actually processes
what was written and translated.

*![](/images/2018/09/Screen-Shot-2018-09-17-at-07.35.58.png)*

*In Byte magazine in the 1980s I remember adverts for 4GLs \-- "fourth
generation languages" \-- that were designed to appeal to and be used
by the "non-programmer" (*[image courtesy of
archive.org](https://archive.org/details/byte-magazine-1981-04)*)*

Moreover, when thinking of this progression, there is perhaps an
implicit connection between the concept of imperative constructions and
programming, with little thought to anything that wasn't procedural,
anything that wasn't "fluid". If you aren't telling the computer
what to do, are you still "developing" code? Immediately my thoughts
turn to languages that are deliberately non-imperative, non-procedural.

Think of the logic oriented nature of PROLOG, which is more declarative
than imperative. Think of the array oriented nature of APL, which is
nearer to maths than to procedural programming. Think of the functional
programming paradigm and languages in that space. One thing that
permeates function orientation is the idea of "what not how" - you say
*what* you want, rather than *how* you want it computed.

So it stands to reason that when we define things declaratively, whether
that's describing what a UI looks like using XML in the UI5 space, or
specifying what a business entity looks like when using CDS with the
Application Programming Model for SAP Cloud Platform, or on an ABAP
stack, when we declare behaviour using annotations, are we still
developing?

I'd say yes, we are. Perhaps it's not too far fetched to say that to
develop is to create something that executes on a machine. How you
define how that something works is an implementation detail, as they
say.

## The SAP Cloud Platform Workflow service

Why am I talking about this? Well, there are a number of services on SAP
Cloud Platform that allow folks to build solutions to things, to create
data visualisations, to connect systems together, to generally solve
business problems, without much (or any) actual *programming* at all.
One of these services is the SAP Cloud Platform Workflow service.

I've written and talked about about the Workflow service before, so if
you're not familiar with the service, you might want to take a look at
some of these resources:

-   A 10-part series on various aspects of the Workflow service:
    [Discovering SCP
    Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/)
-   A replay and link summary from my ASUG webinar session:
    [Introduction to SAP Cloud Platform Workflow -
    Summary](/blog/posts/2018/04/05/introduction-to-sap-cloud-platform-workflow-summary/)
-   A brief CodeTalk episode: [SAP CodeTalk - SAP Cloud Platform
    Workflow Service](https://www.youtube.com/watch?v=t5V0WRle1xc) (this video has unfortunately been made private, I'm trying to rescue it)
-   An interview on [Episode
    1](https://anchor.fm/sap-community-podcast/episodes/Episode-1---Interview-with-DJ-Adams-e1ac40)
    of the Coffee Corner Radio podcast series
-   An interview on [Episode
    015](http://integrationpodcast.com/2018/05/09/015-workflow-in-sap-cloud-platform-with-dj-adams/)
    of The Integration Podcast


And of course there are plenty of very readable docs at the main
Workflow landing page
here: <https://help.sap.com/viewer/product/WORKFLOW_SERVICE/Cloud/en-US>.

## The challenge

Designing and building a workflow definition and deploying it for use on
SAP Cloud Platform is something that's pretty straightforward.
Naturally, the more complex the workflow you're designing, the more
steps you have to include. But on the whole, it's quite a pleasant
experience. What's more, it's declarative, in the form of a workflow
editor where you connect boxes together and define properties for them,
and the overall diagram that you create represents the flow definition.

However, for [User
Task](https://blogs.sap.com/2018/01/20/discovering-scp-workflow-user-tasks/)
steps, you need a User Interface (UI) with which a workflow task
recipient can interact, view and add data to the workflow instance
context, and make decisions. There's a well-defined API for the
standard My Inbox Fiori app and you build the UI as a component that is
instantiated on a task by task basis inside the My Inbox app. That
component is a UI5 component (see the [Component
Startup](https://blogs.sap.com/2018/01/22/discovering-scp-workflow-component-startup/)
and [Recommendation
UI](https://blogs.sap.com/2018/01/24/discovering-scp-workflow-recommendation-ui/)
posts in the [Discovering SCP
Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/)
series for more details).

That's all well and good if you're a developer in the traditional
sense, and a developer in the UI5 sense specifically, but the
tantalising truth is that - with the exception of these User Tasks, you
actually don't need to write any code to design and implement Workflow
definitions.

But programming skills in [UI5](https://ui5.sap.com) have been needed to
complete that "last mile" of definition.

Until now.

## The solution

Last week, a major new feature was made generally available - Workflow
Forms. With this feature, you can define user task UIs in a declarative
fashion, using the form editor in the SAP Web IDE.

![](/images/2018/09/FormEditor-5.png)

*The form editor in the SAP Web IDE,
via <https://blogs.sap.com/2018/09/14/new-feature-in-sap-cloud-platform-workflow-forms/>*

The way it works is that you define the layout of the UI, and link up
data in the workflow context with the fields in the UI definition. You
also define actions. At runtime, there's a forms "player" that
interprets your form definition to produce the appropriate user task
interface. It's UI5 underneath, of course, but as a workflow definition
creator, you don't have to know any UI5 any more.

The Workflow Forms feature was announced last week by joachim.meyer in
this post: "[New feature in SAP Cloud Platform Workflow --
Forms](https://blogs.sap.com/2018/09/14/new-feature-in-sap-cloud-platform-workflow-forms/)",
and I for one am very pleased to see this announcement. I was lucky to
get a sneak preview of the feature a while back, and it works very
nicely indeed.

## Developing workflows

So if we're to take the wider definition of a "developer" as someone
who builds solutions to run on a machines, using appropriate tools, then
this Workflow Forms feature allows traditional non-programmers to do
just that - to develop and deploy entire workflow definitions.

If someone builds something using definitions and declarations alone,
are they a developer? Following the thoughts earlier on in this post,
one might say that they are. Of course, your opinion may be different,
and that's fine. Heck, I might change my thinking when the words
"programming" and "developing" re-merge in my head. To be honest, I
guess it doesn't matter too much about how we define developers,
although it's an interesting exercise to think about their nature.

What does matter in this case is that the ability to create solutions
that involve workflow definitions is now, with the advent of the forms
feature, in reach of the non-programmer.

As you might know, I'm a fan of the Workflow service, and the new
feature is excellent. It doesn't preclude the use or definition of
custom user task UIs with UI5 components - far from it. That approach is
still possible, of course. But even as a UI5 programmer, I can see
myself using the forms feature, and not worrying one iota whether people
think less of me as a developer or not.

Give the new Workflow Forms feature a try. There's documentation
available for you in the Help Portal - see the new "[Creating a
Workflow
Form](https://help.sap.com/viewer/f85276c5069a429fa37d1cd352785c25/Cloud/en-US/bc57d645aee44e11afc8992fd27e544c.html)"
section. And there's even a revised tutorial in the tutorial group
"[Get Started with SAP Cloud Platform
Workflows](https://www.sap.com/developer/groups/cp-workflow-service.html)",
specifically the "[Building a simple approval UI for your workflow with
Workflow
Forms](https://www.sap.com/developer/tutorials/cp-workflow-build-approval-ui.html)"
tutorial, to help you get a head start.

Here's to programming, developing, and building solutions!

---

This post was brought to you on a rainy Monday morning and [Pact
Coffee's El Silencio](https://www.pactcoffee.com/coffees/el-silencio).

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-workflow-forms-and-the-definition-of-a-developer/ba-p/13379225)
