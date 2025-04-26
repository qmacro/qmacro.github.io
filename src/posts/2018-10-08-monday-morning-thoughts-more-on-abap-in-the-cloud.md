---
layout: post
title: "Monday morning thoughts: more on ABAP in the cloud"
date: 2018-10-08
tags:
  - sapcommunity
  - mondaymorningthoughts
  - abap
---

*In this post, following my [previous post on the
subject](https://blogs.sap.com/2018/09/10/monday-morning-thoughts-abap-in-the-cloud/),
I think a bit more about the SAP Cloud Platform ABAP Environment,
inspired by the conversations around the subject at SAP TechEd in Las
Vegas last week.*

Last month, Harald Kuck published a post "[SAP Cloud Platform ABAP
Environment](https://blogs.sap.com/2018/09/04/sap-cloud-platform-abap-environment/)"
which many of us had been eagerly anticipating. The post has already had
around 24K views and over 60 likes, which says something for the
popularity of the subject matter. I followed up with a Monday morning
thoughts post "[ABAP in the
cloud](/blog/posts/2018/09/10/monday-morning-thoughts:-abap-in-the-cloud/)"
a few days later.

Last week at SAP TechEd, Bernd Leukert included references to this new
ABAP environment in his keynote, which was wonderful to hear. (There
were a lot of other great things in the keynote, such as SAP Cloud
Platform Functions, but that's a subject for another time). And so the
conversations that started last month were reinvigorated, which is
always a good thing. There's a lot of different opinions out there, so
I thought in this posts I'd share some of my own thinking on the
subject.

To set the scene, though, I first wanted to share a couple of tweets
from our [Developer
Garage](https://events.sap.com/teched-2018-usa/en/developer_garage) at
SAP TechEd last week\*. One of the areas offered workstations and a
number of tutorial missions for attendees to come and work through (and
win prizes, hurray!).

\*The Developer Garage will of course also be at SAP TechEd in Barcelona
later this month!

This year there are four
[missions](https://developers.sap.com/app-space.html):

-   SAP Cloud Platform (Application Programming Model)
-   SAP Cloud Platform ABAP Environment
-   S/4HANA
-   SAP Cloud Platform Portal

Throughout most of the week, not surprisingly, the SAP Cloud Platform
ABAP Environment mission was leading the pack, in terms of number of
tutorials completed. There is huge interest in the offering! In a fun
bit of technology rivalry, however, at one stage the SAP Cloud Platform
(Application Programming Model) took the lead, as you can see from this
[tweet](/tweets/qmacro/status/1047882500528209921):

![](/tweets/qmacro/tweets_media/1047882500528209921-DorTk2xVsAAFotg.jpg)

But in the end, the sheer weight of enthusiasm and desire to get a first
hands-on experience meant that the SAP Cloud Platform ABAP Environment
mission ended up on top, as you can see from this
[tweet](https://twitter.com/anfisc/status/1048009973320404992)
from Andre Fischer (the total number of tutorials completed finished a
little bit over 2000 by the time SAP TechEd finished last week):

![](/images/2018/10/Screen-Shot-2018-10-08-at-11.01.25.png)

Although I'm a huge fan of the new [Application Programming
Model](https://blogs.sap.com/tag/applicationprogrammingmodel/) (which
also drew great interest last week), I have to say that the new SAP
Cloud Platform ABAP Environment was a worthy winner in this case.

## ABAP PaaS

I'm going to refer to the SAP Cloud Platform ABAP Environment in the
rest of this post unofficially as "ABAP PaaS", as that's what others
are calling it too. In fact, that's already sparked some interesting
conversation, as some folks are not convinced that the moniker is
appropriate.

I remember the first release of Google's [App
Engine](https://cloud.google.com/appengine/), quite a few years ago now.
What that offered at the outset was a cloud based runtime for Python
based apps. There was a particular deployment process, and you had to
think in a certain way if you wanted to take advantage of the features
offered, especially when it came to using facilities such as the
persistence layer or message queues. This was fine, and sort of part of
the point of the "platform" part of PaaS - the platform offered
certain features and required you to think in certain ways and employ
certain approaches.

To me, ABAP PaaS is similar, in that it allows me to write in a language
with which I'm familiar, take advantage of certain platform level
features \-- such as a HANA-backed persistence layer \-- and also causes
me to think in a particular way (more on this shortly). Like App Engine,
I don't have to worry about the maintenance, operation or upkeep of the
ABAP platform - it just happens. New features are rolled out and
available to me as they appear. I don't have to concern myself with
differing releases of differing target runtimes - unlike in the on-prem
world.

## The ABAP language

ABAP appeared on the scene in the late 1980's, and I have fond memories
of trying early versions of this new "report writing" language, as an
alternative to the 370 assembly language in which R/2 was written by the
SAP developers themselves, but which was also used by customers who
needed extensions and custom reports.

The language has grown over the decades, taking on significant new
features along the way (such as support for SQL and object orientation)
and today enjoying rather [modern
features](https://blogs.sap.com/2016/11/04/abap-news-for-release-7.51/),
not only as part of the language itself but also within the layers of
the greater ABAP environment as a whole - I'm thinking of Core Data
Services (CDS), for example. The article "[ABAP and the
Cloud](https://sapinsider.wispubs.com/Assets/Articles/2017/November/SPI-ABAP-and-the-Cloud)"
by Karl Kessler gives a good overview of what today's ABAP looks like.

And this is something that I think about a lot, in the context of the
modernisation of ABAP as we move to the cloud. Some language features
are being deprecated, perhaps those that should have been deprecated a
long time ago if it hadn't been for the requirement for backward
compatibility - again, on-prem legacy challenges which disappear in the
ABAP PaaS context.

## The ABAP environment

But ABAP in general, and ABAP in the cloud in particular, is more than
just a language. It's a whole set of building blocks that together
present a rich set of features for building business apps - whether
they're new apps or extensions to existing functionality. Some of the
building blocks are themselves written in ABAP (rather than at kernel
level). One notable example that comes to mind immediately is the layer
supporting the development of HTTP based services in general, and
supporting the development of OData services in particular. That layer
itself is written in ABAP.

So I find it more useful to think about the "ABAP environment" rather
than the "ABAP language". It's greater than the sum of its parts. And
with the advent of excellent initiatives from the community
([abapGit](https://github.com/larshp/abapGit) from Lars Hvam immediately
comes to mind) it's becoming even greater.

When we think of the ABAP language itself, there is sometimes the
objection that it's proprietary. But for me, that's not the point.
Open sourcing the language would be one thing, but is it really what we
should be focusing on right now? As I've already mentioned, ABAP is
more than a language. Moreover, there are other environments with their
own language. An example that immediately comes to mind is
[Apex](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_intro_what_is_apex.htm),
a language specific to Salesforce for developing flow and transaction
control in conjunction with calls to various APIs. And that's OK too.

## ABAP PaaS's focus

That mention of APIs brings me to the primary focus for ABAP PaaS. There
are many reasons why I think ABAP PaaS is important.

One is that we have a rich intellectual ocean of knowledge and
experience in ABAP, amongst customers, partners and of course developers
inside SAP too. To ignore that would be to effectively discard a vast
skill base as we move to a cloud-first solutions paradigm.

I do think that developers should master more than one language, but not
everyone agrees with me, and that's OK. Moreover, considering that ABAP
is more than just a language, as I've mentioned, there's plenty of
scope for individuals to focus on an ABAP flavoured career and do very
well. With ABAP PaaS, these individuals get to extend their career and
their skills, and customers benefit from that. ABAP PaaS presents modern
possibilities for these individuals, and for others who are deliberately
and consciously versed in other languages, ABAP PaaS represents choice.

That said, I think an even more important focus for ABAP PaaS is the use
case which is one that is general to the cloud environment and a major
raison d'être for the initiative. That is the ability to stop
customising the core and *build out extensions and new apps in a
separate environment*.

Business solutions these days span entire cloud and on-prem landscapes.
We're moving away from monolithic runtimes for business applications,
due to the distributed nature of apps and services in a cloud-first
context. Implicit in that nature is the concept one level up from PaaS,
which is SaaS (Software-as-a-Service) - business solution software that
to all intents and purposes only has a consumption surface layer, rather
than any depth into which we can dig.

That surface layer consists of two types of interface - a user interface
(UI) that is usually web-based, and a machine interface that is API
(application programming interface) based. We can't see inside these
systems, and it's not possible to extend or customise them directly.
The massive advantage of this is that we don't have to worry about
their operation, much less their maintenance or upkeep. But we need to
differentiate ourselves somehow - to extend the solutions to meet our
own business needs, to give us that competitive advantage or to solve an
organisation-specific challenge.

That's where ABAP PaaS comes in, as one of a set of environments
perfectly suited for building these extensions (another is of course the
Application Programming Model and the Cloud Foundry environment).

But it's not just extensions to SaaS solutions (like SuccessFactors or
S/4HANA Cloud), it's extensions for existing on-prem solutions, whether
that's S/4HANA, Business Suite or something else R/3 based. Yes, there
are plenty of these on-prem systems that have been customised, but
that's not a reason to continue doing so. We need to think about making
the journey to separate these concerns out - standard software and
extensions to that standard software. And when I look at how ABAP PaaS
has been designed, with the focus on CDS based and API focused service
solutions, it starts to make a lot of sense to me.

![](/images/2018/09/sap-cloud-platform-abap-environment.png)
*From "[SAP Cloud Platform ABAP
Environment](https://blogs.sap.com/2018/09/04/sap-cloud-platform-abap-environment/)"
by Harald Kuck*

There's no concept of UI as we understand it from the traditional
on-prem R/3-based world. No dynpros, no transactions, no reports, no
SAPGUI. Thinking back to the reference to Google's App Engine earlier,
it's very similar - that PaaS offering doesn't have a UI either. The
focus of a PaaS is to provide facilities for "headless" solutions that
both present and consume APIs that partake in landscape-wide solutions.
The UI is separate - whether that UI follows the Fiori design language
and is built with UI5, or whether it's with another Web UI framework
altogether. There may not even be a UI in the traditional sense - one
thing today's computing fabric is bringing us is a wider choice of how
one interacts with solutions - think custom Internet of Things (IoT)
devices and conversational UI such as bots in Slack and speech
recognition in the form of the Google Assistant platform or Alexa (and
of course there's SAP CoPilot too).

What we miss from from the "legacy" ABAP platform is replaced by a
sharp focus on openness - using [git](https://en.wikipedia.org/wiki/Git)
for software versioning and logistics, a RESTful programming model as
the de facto approach to building solutions, and the use of HTTP in
general to consume services from (and offer services to) other parts of
the landscape.

## The near future

There's so much more to think about on this subject, but this post is
already long enough. I think it's a rather exciting time for SAP's
cloud-first initiatives in general, and for the ABAP community in
particular. Many of us have already been learning about the programming
model that is key to building solutions on ABAP PaaS, and that is
the ABAP RESTful Programming Model. If you haven't yet had chance to
dig in, I'd recommend this SAP TechEd session, which is available
online already: "[CNA215 - See the Big Picture of the ABAP RESTful
Programming Model, 2018 Las
Vegas](https://events.sap.com/teched/en/session/41240)" by Marcel
Hermanns. If you're coming to SAP TechEd in Barcelona later this month,
drop in to the Developer Garage to work through the SAP Cloud Platform
ABAP Environment tutorials (access to an ABAP PaaS system will be
provided).

It's early days for ABAP PaaS. The team is taking a "[release early,
release
often](https://en.wikipedia.org/wiki/Release_early,_release_often)"
approach to delivery, so I'm seeing today's ABAP PaaS offering as a
minimum viable product. Over time I expect to see the environment grow -
in terms of whitelisting, in terms of comprehension and of course in
terms of developer access.

For me, ABAP PaaS is full of potential and I for one welcome the
prospect of building extensions and net new apps using this modern
environment. I'd love to hear from you too. Let me know what you think
in the comments section below.

---

This post was brought to you by [Pact Coffee's El
Silencio](https://www.pactcoffee.com/coffees/el-silencio-espresso) which
is helping me battle the jet lag after returning home from Las Vegas, by
the hashtag [#ABAPsNotDead](https://twitter.com/hashtag/abapsnotdead),
and by the clackety-clack of the Cherry MX Blue switches in the
mechanical keyboard I'm trying out, as I embark upon a new
~~[obsession](https://www.reddit.com/r/MechanicalKeyboards)~~
hobby.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-more-on-abap-in-the-cloud/ba-p/13365539)
