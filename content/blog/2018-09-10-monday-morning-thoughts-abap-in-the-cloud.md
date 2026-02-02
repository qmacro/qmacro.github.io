---
title: "Monday morning thoughts: ABAP in the cloud"
date: 2018-09-10
tags:
  - sapcommunity
  - mondaymorningthoughts
description: I think about the new SAP Cloud Platform ABAP Environment, what it is, what it isn't, and why I think it's a great move.
---

A day or two ago [this
tweet](https://twitter.com/FishInWaterProd/status/1037879269471469568/photo/1)
appeared in my timeline, and it made me smile:

![](/images/2018/09/Screen-Shot-2018-09-10-at-07.45.15.png)

Last week, Harald Kuck [announced the availability of the SAP Cloud
Platform ABAP
Environment](https://blogs.sap.com/2018/09/04/sap-cloud-platform-abap-environment/),
and it was followed up a day later by a second post from Karl Kessler:
"[SAP Cloud Platform ABAP Environment is
live](https://blogs.sap.com/2018/09/05/sap-cloud-platform-abap-environment-is-live/)".
While it was rather a big event, it wasn't that it came as a surprise -
this is something that many of us have been looking forward to for a
long time now. Nevertheless, it certainly provides me with lots to
wonder about, which is a good thing.

I'd encourage you to read both Harald's and Karl's posts as they
provide lots of information about the environment in general, and if
you're on Twitter, [Jens Weiler](https://twitter.com/ABAP4H) is posting
a series of tweets with the hashtag
[#ABAPPaaS](https://twitter.com/hashtag/abapPaaS), which are definitely
worth keeping an eye on.

## What ABAP has been

ABAP has been with us for a long time. When I think about what that
exactly means, it turns out that it's hard for me to be precise. On the
one hand, ABAP is a language, a language that's evolved over the years
since its inception in the late 1980s (I remember writing early ABAP
report constructs inside SYSIN DD statements in Job Control Language on
a mainframe within an SAP R/2 installation back then).

But ABAP has meant more than that - at least perhaps subtly or
implicitly. Arguably, to be an ABAP programmer has meant to build
transactions and reports, from both a backend & frontend perspective, in
an environment that is both design time & runtime. It has meant using
editor tools & software logistics facilities that themselves are written
in ABAP and also run within that same environment. Perhaps more
significantly, when thinking about the new SAP Cloud Platform ABAP
Environment, it has also largely implied SAP-specific user access
mechanisms - SAPGUI of course, but also, latterly, the browser, with Web
Dynpro ABAP constructions (although even here the main "mass" of UI
execution remained within the ABAP stack itself).

![Image result for yin
yang](/images/2018/09/yinyang.png)

## The yin and yang of backend and frontend

The advent of SAP Fiori and the
[outside-in](/blog/posts/2012/05/07/sapui5-the-future-direction-of-sap-ui-development/#from-inside-out-to-outside-in)
programming approach where we now build our user interfaces not only
with open standards but also to run outside the traditional ABAP
environment - in the browser directly using toolkits like UI5 - heralded
a new era.

Not only that, it introduced us, out of necessity, to new ways of
working, to distributed source code control systems, to new editors, to
the concept of deployment pipelines, and more besides. In parallel, we
were seeing the rise in popularity of a new kind of editor environment
for writing ABAP itself - the ABAP Development Tools (ADT) within the
Eclipse editor framework\*.

\*a part of me still looks back with fondness at the
[Roscoe](http://www.texteditors.org/cgi-bin/wiki.pl?Roscoe)-style ABAP
editor available via R/2 transaction TM38; but that's perhaps a story
for another time.

The pragmatic approach to building Fiori apps is to use the UI5 toolkit
to build the frontend components, which in turn consume backend
components written on the ABAP stack (or natively in HANA) and exposed
through a wire protocol, where the wire is HTTP shaped and the protocol
is often (though not always) OData flavoured.

So for the past few years, there's been a lovely yin/yang balance
between backend and frontend, both equally important and each
complementary to the other.

## The cloud, and extending SaaS solutions

[Enter, stage left](https://en.wikipedia.org/wiki/Exit...Stage_Left),
software solutions such as SuccessFactors, S/4HANA Cloud, and more. What
stage? Well, [SAP Cloud Platform](https://cloudplatform.sap.com), of
course. And what do businesses need in this new age of cloud solutions?
The ability to extend, to bend and shape these cloud solutions to their
own needs - while, crucially, not getting themselves into a situation
where software upgrades cannot happen. So we come to in-app extensions
which are purely within the confines of the SaaS solutions themselves,
but also \-- and more significantly \-- to side-by-side extensions where
new frontends and even new backends are required, melding standard
functionality with custom features to provide business-specific
solutions.

For these side-by-side extensions, we're going to need a backend
runtime and persistence layer. Somewhere to write our application logic,
or our custom OData service, some place to run code that connects into
the SaaS solutions via the [connectivity
fabric](https://cloudplatform.sap.com/capabilities/product-info.SAP-Cloud-Platform-Connectivity.43bdae3a-bec5-4c47-83ed-44197926b024.html)
of SAP Cloud Platform using [well-defined APIs](https://api.sap.com/). A
place to call home, in other words.

Of course, in the SAP Cloud Platform context, we already have places to
call home - look, for example, at the excellent [Application Programming
Model for SAP Cloud
Platform](https://blogs.sap.com/tag/applicationprogrammingmodel/) that
provides us with language and persistence layer agnostic support for
building the core data and services that are needed. That's for the
Cloud Foundry environment.

## ABAP in the cloud

But one thing that I've learnt about cloud in general, and SAP Cloud
Platform in particular, is that it's about choice. Yes, there are
opinionated approaches to building stuff, but choice plays a big part,
and for good reason. The combination of problem domains, existing
software solution contexts, team availability, technology trajectory,
skillset availability and a number of other factors means that there's
never a one-size-fits-all solution.

This leads me to think about the fact that there are different
environments on SAP Cloud Platform, all with solid purposes. The two
main environments that come to mind of course are Neo and Cloud Foundry.
But last week's announcement means now that we have another environment
to add to the choice - ABAP.

In the context of backend and frontend, in the context of extending
existing SaaS solutions, and building net new apps, the SAP Cloud
Platform ABAP Environment is one which is appealing to organisations as
well as individuals who have a significant skills investment in ABAP,
and to whom it makes sense especially to build their future, which may
still be hybrid (keeping some on-prem ABAP stack systems to look after
core processes), using a homogenised language skills layer.

![icon of
product](/images/2018/09/abap-cloud-logo.svg)

But as the saying goes, it's not your grandfather's ABAP. That much is
clear, and for good reason. It's a chance to modernise the language by
removing defunct constructs. It's a move away from that blurred
combination of design time tools, language and, frankly, proprietary UI
technologies. It's focused on building backend solutions, from complex
custom application logic that's either standalone or working in
conjunction with services available via SaaS Software Development Kits
(SDKs) such as the [S/4HANA Cloud
SDK](https://www.sap.com/uk/developer/topics/s4hana-cloud-sdk.html), to
simple OData services that can be consumed elsewhere.

I'm not just talking about OData, of course. As I mentioned in a
previous [Monday morning
thoughts](/tags/mondaymorningthoughts/) post on
[milestones](/blog/posts/2018/05/21/monday-morning-thoughts:-milestones/),
the Internet Communication Manager, and its user-space layer in the form
of the Internet Communication Framework (ICF), is a thing of beauty, and
allows us, as masters of the ABAP stack (on-prem as well as in this new
cloud-based environment), to build all sorts of HTTP-based services.

What's more, these days we have Core Data Services (CDS) on the ABAP
stack to allow us to declaratively build data models and annotate them
for consumption (think metadata extensions and use thereof by Fiori
elements mechanisms) and the whole RESTful ABAP programming model to
support us here too.

So with the new ABAP in the cloud, don't think in the traditional
mindset about ABAP List Viewer (ALV) based reports, or even any sort of
dynpro based solution. Don't think about your users connecting to your
cloud-based ABAP systems with SAPGUI. You won't even be connecting
yourself with SAPGUI - you'll be using the ADT with Eclipse, and, gosh,
eschewing the venerable SE11 for declarative, code-based data
definitions! Moreover, you'll be using modern tools (think
[abapGit](https://github.com/larshp/abapGit) and more) for your all your
software logistics needs. Think backend services, think extending cloud
solutions, think future.

## Wrapping up

These thoughts here are based on wonder, and there's still lots to
wonder about (so don't fret, Mr Waits). It's early days for the SAP
Cloud Platform ABAP environment, and the journey ahead is one that we
should travel together. There are still areas that need ironing out, for
sure, but I for one am looking forward to taking my first steps.

---

This post was brought to you by [Pact Coffee's
Planalto](https://www.pactcoffee.com/coffees/planalto), and the
stiffness of joints that are a result of a classic fall on my run
yesterday.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-abap-in-the-cloud/ba-p/13372577)
