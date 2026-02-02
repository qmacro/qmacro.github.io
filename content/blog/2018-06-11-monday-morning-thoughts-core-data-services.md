---
title: "Monday morning thoughts: Core Data Services"
date: 2018-06-11
tags:
  - sapcommunity
  - mondaymorningthoughts
description: What Core Data Services (CDS) is, what it does, and why we should make it a priority to learn more about.
---

Earlier this morning, while following a tutorial, I came across this
message in the console log of my SAP Web IDE:

```text
This is CDS 2.3.1, Compiler 1.0.27, Home: node_modules/@sap/cds
```

On the surface, it looks like many of the messages we see in process
output - informational, and part of a series of lines that describe
what's going on in the background.

What struck me was the implied significance. What this message tells me
is that CDS -- a layer that has hitherto been largely understated --
has an identity, a version, all of its own. Even the CDS compiler has
its own version. Rather than thinking about CDS as an amorphous blob of
language that sits implicitly somewhere between the database and UI5
(especially Fiori Elements, with the annotations that CDS offers), CDS
is very much something that we should sit up and pay attention to as an
explicit part of SAP's development technology stack.

## The origins of CDS

CDS was born in the early HANA era, which heralded paradigm changes in
application programming. Instead of bringing data to code, as we did in
the classic R/3 + RDBMS approach, the power of HANA suggested that the
approach should be to bring code to data.

![](/images/2018/06/Screen-Shot-2018-06-11-at-08.04.37.png)

Some of us older hackers might suggest that this is nothing new, talking
wistfully about [stored
procedures](https://en.wikipedia.org/wiki/Stored_procedure), and how
everything old eventually becomes new again. But we'll leave that for
another time.

One thing that SAP has done consistently well over the decades is to
understand the importance of abstraction. With the advent of HANA and
the switch to a data centric approach to development, an abstraction
layer providing language for data definition, access and queries was
born.

Initially this layer, named Core Data Services, was used to bridge the
semantic gap between low level SQL (as a kind of "database assembly
language") and the actual data expressions needed to solve business
problems, bringing declarations at conceptual and implementation levels
closer together.

## From strength to strength

Initially available in the HANA space, CDS was then made available to
the ABAP world, and with the advent of Fiori Elements, many of us became
conscious of CDS as more than just a database abstraction layer.

The power of CDS annotations and the possibilities of layering
consumption views upon interface views, with the added facility of
adding metadata for use in generated user interface (UI) scenarios is a
heady combination. Add to that the possibilities that metadata
extensions allow and CDS becomes one powerful layer indeed.

## A key ingredient

I'm seeing CDS as a key ingredient that pervades much of what we as
developers in the SAP ecosphere do now and will be doing tomorrow too.
It's the glue, the backbone, that binds together multiple layers and
moving parts.

In the past, we've talked about "full stack developers", meaning (in
our world) folks who can build end-to-end Fiori apps with frontend
components powered by UI5 and backend components powered by OData on the
ABAP stack. Perhaps we need to broaden that view and think about the
reality which might be better described as "multi stack". As we've
now established that ABAP as a backend platform and UI5 as a frontend
platform works well, we can and should consider alternatives at both
ends.

The idea of "bring your own language" (BYOL) on the SAP Cloud Platform
actually extends outwards in all directions to "bring your own
\[database\|frontend\|backend\]" and dilutes the meaning of "full
stack developer" because few, if any, developers will be skilled in all
the possible combinations.

That said, CDS is a front runner for being a constant in this multi
stack world and something we should all know about. I've mentioned
already that CDS binds multiple layers and moving parts together.
Perhaps more significantly it binds people together, being a language
that's used and understood by technicians up and down the stack(s) and
that has meaning and significance to all of them.

## The new canonical example

In last week's [Monday morning
thoughts](/tags/mondaymorningthoughts/), on the
[learning
continuum](/blog/posts/2018/06/04/monday-morning-thoughts:-the-learning-continuum/),
I mentioned the new [Application Programming Model for the SAP Cloud
Platform](https://blogs.sap.com/2018/06/05/introducing-the-new-application-programming-model-for-sap-cloud-platform/),
which appeared to me in the form of a wonderful early ["Getting
Started"
tutorial](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/5ec8c983a0bf43b4a13186fcf59015fc.html) that
hints of a tantalising richness and depth that only multiple repeated
journeys will start to extract.

The tutorial is about building a full stack application on the SAP Cloud
Platform (significantly as a Cloud Foundry app) using a variety of
technology components: Fiori Elements and UI5 on the frontend, HANA as
the persistency layer, and Java as the application service layer.

A key point is that these are just examples of technology components.
For example, the application service layer is, in this tutorial
instance, Java, mainly because it's the runtime supported right now.
But perhaps for the next incarnation of the Application Programming
Model, there'll be support a NodeJS stack for an alternative
application service layer. It's early days and I for one am glad that
[rough consensus and running
code](https://courses.cs.duke.edu/common/compsci092/papers/govern/consensus.pdf) has meant
that we're seeing a first glimpse of the entire model with a single
runtime example, earlier than we might have done if multiple runtimes
had been supported from day one.

Most significantly, however, there's a notion that becomes clear as
soon as you've run through the tutorial even just once. That notion is
the extreme importance of CDS. CDS is used as a business level data
definition source, and to generate the artifacts at the (HANA)
persistence layer. It's used to define visual aspects relating to the
data, with those definitions (annotations) making their way to the
frontend to influence what the app looks like and how it behaves. Last
but not least, it's used to generate the application service layer.
There's even a top-level item in the project contextual menu for builds
based on CDS.

![](/images/2018/06/Screen-Shot-2018-06-11-at-08.47.57.png)

## Next steps

CDS has become a powerful set of languages: Data Definition Language
(DDL), Query Language (QL) and Data Control Language (DCL). The
[annotations are many and
complex](https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/7.5.9/en-US/630ce9b386b84e80bfade96779fbaeec.html)
(my CDS journey has introduced me to some, but there are others that
I've yet to come across and understand). But in my view it's a
technology, a layer, that we'd be foolish to ignore. Last month I even
went so far as to suggest that CDS is one of [today's
milestones](/blog/posts/2018/05/21/monday-morning-thoughts:-milestones/#todays-milestones).

If you do only one thing this week to advance along your learning
continuum, may I suggest it's to look into CDS. Start by looking into
the [Getting Started
Tutorial](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/5ec8c983a0bf43b4a13186fcf59015fc.html)
for the Application Programming Model. If you're only fleetingly
familiar with CDS, let the tutorial wash over you, there will be parts
that either don't make sense, or seem like magic. That doesn't matter
at this stage. Just get to the stage where you've experienced CDS first
hand, felt it under your fingertips, and grokked where and how it fits
in as a lingua franca across the different territories of a single,
multi stack application. Then you can branch out and sideways to other
CDS tutorials on database facilities, annotations and metadata
extensions.

You won't regret it.

---

This post was brought to you from a damp but warm early morning in
Manchester, [Pact Coffee's Nyarusiza
Peaberry](https://www.pactcoffee.com/coffees/nyarusiza-peaberry) coffee
and the lingering tiredness of transatlantic jet-lag.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-core-data-services/ba-p/13358970)
