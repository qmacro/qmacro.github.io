---
layout: post
title: "Monday morning thoughts: milestones"
date: 2018-05-21
tags:
  - sapcommunity
---

*In this post, I look back at changes and developments that I consider
milestones in SAP's technology history, and muse on some of the
developments today that we'll consider milestones in the future.*

![Image result for manchester
milestone](https://upload.wikimedia.org/wikipedia/commons/a/a5/Milestone_rixton_greater_manchester.jpg)

*A milestone on the A57, just outside of Manchester ([Wikimedia
commons](https://commons.wikimedia.org/wiki/File:Milestone_rixton_greater_manchester.jpg)).*

I've been fortunate enough to have lived and worked through more than
three decades of SAP technology.

## Seismic changes

In that time, I've seen seismic changes. Here are three of those that
immediately come to mind:

-   the move from the use of hierarchical databases to relational
    databases - I remember the move from the database management
    component of IBM's Information Management System (IMS DB) to an
    early version of DB/2
-   the transition from mainframe to Unix based systems - specifically
    with the move from R/2 to R/3, from monolith to client-server
-   the introduction of the in-memory columnar store called HANA


All three of these events are well-known SAP history and already deserve
to be remembered as major changes in the timeline.

What did they bring about? Well, initially the move from hierarchical to
relational database management systems arguably didn't bring about
anything immediately obvious (except for a wave of horror and unease as
we wrestled with the new concepts) - but it was a move without which SAP
could not have progressed as hierarchical systems were fixed firmly in
the proprietary world of IBM.

The transition from mainframe to Unix based system and the move to R/3
and the new architecture (which I still call "disp+work") brought
about an an agility previously unknown. This architecture still
underpins the vast majority of SAP application servers even today. The
move to Unix, and initially the proprietary flavours from hardware
vendors (AIX, HP-UX, Solaris, and so on) led to the eventual
availability of R/3 on Linux, which I'll come to shortly.

The introduction of HANA needs little explanation \... not only did it
allow a rethinking of underlying data storage and performance, and
collapse the previously dual concepts of transactional and analytical
processing into a singularity, but it also brought about a return to
monolith, in a way - the database as application server.

Beyond these particular seismic changes, there are smaller but still
hugely significant events that I consider major milestones.

## Major milestones

Various additions to the general SAP technology set have had huge
impacts and effects that are seriously long-term. What makes it perhaps
more interesting is that in some cases the significance wasn't
immediately clear, or at least the implications weren't equally
distributed. Over time, however, people came to understand.

There are clearly more major milestones than I could fit into a
reasonably sized blog post, so I've picked out a handful that are
meaningful to me.

### Introduction of the ABAP language

I started working on SAP R/2 version 4.1D. There was no concept of
ABAP - everything was written in mainframe assembly language; in my case
that meant S/370 assembler. Code lived in modules and handled everything
from the online transaction processing to the batch processing that was
a significant portion of what happened in an R/2 installation.

A year or two into my career we saw a release of R/2 that introduced a
report writing language called ABAP - it stood for Allgemeiner Berichts
Aufbereitungs Prozessor (English: General Report Preparation Processor)
and it started life as a limited set of language elements that you added
to your Job Control Language (JCL) to produce classic reports, with
headers, subtotals and the like.

ABAP matured as we all know, and is set to be reborn in cloud form, a
glue language that binds people and data as we move towards a cloud
native thinking powered by a whitelisted set of constructs that allow us
to use the power of standard data and metadata definitions and integrate
the classic with the new.

### R/3 on Linux

One could see Linux as just another Unix flavour, alongside the
proprietary flavours, some of which I've mentioned earlier. But the
porting of R/3 to Linux was more significant than that. It was one of
the first major investments that SAP made in the open source world. SAP
created a "Linux Lab" and its members contributed improvements to
memory management in the Linux kernel so that R/3 would run, and run
well.

Moreover, it opened up the possibilities of mere mortals like us running
an SAP system on their own hardware, under their control. Mainframes
were beyond reach, but not only that - vendor and hardware specific Unix
systems were prohibitively expensive. Downloadable installation packages
for R/3, to run on your own home-brew kit? Amazing.

![](/images/2018/05/Screen-Shot-2018-05-21-at-08.20.09.png)

The ubiquity of Linux in general is well known, and the fact that one
can see Linux as the standard delivery platform for SAP software
(including HANA) is just wonderful.

### The Internet Communication Manager

This one is my personal favourite. Early R/3 systems communicated
predominantly in a proprietary fashion, with Remote Function Calls
(RFCs) being the most common method for realtime system interaction. It
was possible to make HTTP calls - but only in a roundabout and limited
way, via a small utility program that lived on the operating system
level, the invocation of which was managed with the same transaction
(SM59) that was used to manage RFC destinations.

Then there was the Internet Transaction Server, groundbreaking
technology from a team that included Björn Goerke
and Thomas Grassl that was as useful as it was
inventive - a combination of Common Gateway Interface (CGI) backends for
the web servers du jour with a mechanism that connected to the R/3
backend and fused with the DIAG protocol stream (yes, this was the
dynamic combination of wgate and agate, for the SAP tech historians out
there). The result was that transactions that were suddenly available
\... in your web browser! Not only that but it was possible to call
remote function modules via HTTP.

But the arrival of the Internet Communication Manager (ICM) -
essentially a complete and modular HTTP server\*, grafted on to R/3's
dispatcher and communicating via memory pipes - was, in my opinion, an
event horizon (and I've said so in various talks on the subject in the
past, too).

![](/images/2018/05/Screen-Shot-2018-05-21-at-08.21.41.png)

It opened up the SAP world to the open source world in more ways than
anything else, and was one of the ingredients that helped turn SAP
"inside out" and allowed the embrace of the outside world. It allowed
SAP systems to speak HTTP - as client or server - naturally.

What we have today in the form of the REpresentational State Transfer
(REST) informed OData protocol, the amazing utility of HTTP as the
lingua franca - nay, the communication dialtone - in our everyday
architectural constructions and modern developments in the SAP world,
are down to the arrival of the ICM and the developer-level Internet
Communication Framework (ICF). I was so taken with this that I even
created and ran a [two-day course on the ICM and the ICF at
Manchester's MadLab](https://vimeo.com/36828893) a few years back.

\*via plugins, the ICM also spoke other protocols such as SMTP

### Neo and Cloud Platform

This milestone is almost still too new to think about in terms of being
a major one, but I suggest it is exactly that and more. The significance
of cloud in SAP's technology directions is impossible to ignore, and
the Neo project, SAP's first major foray into the cloud space, has been
tremendously important.

The SAP Cloud Platform that we think of today grew out of what (and
still is) Neo. Yes, of course, there are major new initiatives such as
the Cloud Foundry infrastructure and the extensions into Kubernetes, but
essentially Neo was what brought us - developers and architects
everywhere - to understand what a hybrid and cloud native future could
look like in the SAP world.

Amongst other things, Neo provided us with the core infrastructure that
we almost take for granted, some of which is essential, and upon which
many of the services that we know and love today are built. Neo's
Connectivity service is just one example, so significant and important
that we might consider it the sine qua non for the hybrid- and
inter-cloud platform age.

Without Neo and the advent of the SAP Cloud Platform, we wouldn't be
looking towards the brave new world of cloud native, nor would we have
S/4HANA Cloud.

### UI5

Of course, this list wouldn't be complete without including one of the
key factors in the success of the new SAP and our ability to consider
SAP now being a major player in the enterprise User Experience (UX)
arena.

User interface (UI) technologies at SAP have come and gone (some have
stayed), and have variously hit or missed the mark, in terms of
usability, adaptability and acceptance. A relative newcomer, landing
only six years ago, UI5 was, and is, the right technology, the right
architecture, and the right UI at the right time. I remember discovering
UI5 and writing about it back in 2012 (the article's date is incorrect,
and reflects when I updated it rather than when I first wrote
it): [SAPUI5 - The Future direction of SAP UI
Development?](/blog/posts/2012/05/07/sapui5-the-future-direction-of-sap-ui-development/) and
the significance is still valid and fresh today.

![](/images/2018/05/Screen-Shot-2018-05-21-at-08.24.20.png)

UI5 and the Fiori design language have not only been key to offering a
revolutionarily better UX, but they also play an almost unstated and
fundamental role in everything that's currently happening in SAP's
move to S/4 and the cloud. I'd argue that they've been an essential
enabler for this move, and the combination is still the killer choice,
not because it's the only choice, but for most cases it's the right
choice.

## Today's milestones?

What technologies and advancements today might we come to consider as
major milestones? That's hard to say, but I think there are already
some good candidates. I'll limit it to three for this post:

Core Data Services (CDS): Notable almost by its subtle lack of fanfare
and attention, CDS is the quiet engine that is and will continue to
power the new programming models for ABAP and cloud native. Perhaps
it's fair to say that we're only at the thin end of the wedge when it
comes to significance and ubiquity - CDS, the rich metadata annotations
that it allows, and its supporting cast of technologies and layers will
potentially become the technical and mental glue that binds backend and
frontend, producer and consumer, operational and analytical.

ABAP in the cloud: I've mentioned ABAP in the cloud already; the
"third age of ABAP" has the potential to be a stepping stone, not for
us architecturally, but for us as a community of developers. A safe and
happy landing place that smells and sounds somewhat familiar, albeit
being significantly different in some ways, might be the catalyst
needed.

Cloud native: this is a concept representing many ideas and
technologies, too many to consider individually in this post (although
I've dwelled on some of them in previous posts in this [Monday morning
thoughts series](/tags/mondaymorningthoughts/)).
From the new layers in the as-a-service stack, through messaging,
event-driven programming, [12-factor app](https://12factor.net/) design
and container based deployments and service management, this is as far
from R/2 as you can get. By the way, did you notice that in this brief
list of cloud native concepts that SAP is embracing and building out,
that none of them are SAP specific or proprietary?

These are candidates that I'd suggest could become viewed as major
milestones in the future. It's hard to say (and interesting that it's
difficult to recognise truly major milestones while we're in close
proximity to them).

But what I can say is that you, dear reader, will have other candidates
in mind. What are they, and why? I'd love to hear what you think - what
were major milestones we've encountered on our journey already, and
what have we to look forward to?

This post was brought to you by [Pact Coffee's Umurage
Mbazi](https://www.pactcoffee.com/coffees/umurage-mbazi), the quiet of a
peaceful early morning, and the lovely prospect of spending a day off
today with my son Joseph.

---

**Update 23 May 2018**

This blog post is also available via audio thanks to the awesome initiative from Former Member and uxkjaer in the
form of Coffee Corner Radio "[Pod Bite
1](https://anchor.fm/sap-community-podcast/episodes/Pod-Bite-1---Monday-morning-thoughts-milestones-by-DJ-Adams-e1gt26)" -
see "[With every coffee you need a biscuit
?](https://blogs.sap.com/2018/05/23/with-every-coffee-you-need-a-biscuit-%F0%9F%8D%AA/)"
for more details.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-milestones/ba-p/13371725)
