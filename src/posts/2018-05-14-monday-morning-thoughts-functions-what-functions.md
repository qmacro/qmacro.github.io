---
layout: post
title: "Monday morning thoughts: functions - what functions?"
date: 2018-05-14
tags:
  - sapcommunity
  - mondaymorningthoughts
---

*In this post, I think about the concept of functions-as-a-service, what
it means, and what it's good for.*

Serverless, cloud functions, functions-as-a-service. Three terms that
we're hearing more and more about these days, particularly in the
context of cloud native. One could almost think that they're a product
of the cloud: the concept would probably not have come about without the
cloud as an enabling platform.

While cloud functions and functions-as-a-service are pretty much
interchangeable as terms (and I'll use functions-as-a-service, or FaaS,
from now on), some folks like to maintain a subtle distinction between
serverless and FaaS. That's fine, and they have valid reasons. With
serverless, it's not that there aren't any servers - of course there
are - it's that we don't have to care about them. It's similar to the
concepts lower down the stack; with infrastructure-as-a-service, we
don't have to care about the physical hardware upon which our virtual
machines (VMs) run.

## Cloud layer granularities

The difference with FaaS is that the granularity is finer. As you move
up the stack, from infrastructure, to platform, to software, to backend,
and ultimately to functions, any idea of servers at all, physically or
logically, disappears. We move up from VMs that we remain responsible
for (infrastructure-as-a-service), through runtimes that we have to be
mindful of (platform-as-a-service), through a necessarily complex and
stateful platform the intricacies of which we must understand
(software-as-a-service) to what is perhaps the ultimate - the platform
that we thus far have had to think about has faded away, almost in a
Matrix kind of way: "[there is no
platform](https://www.youtube.com/watch?v=uAXtO5dMqEI)".

![](/images/2018/05/spoon-161122_960_720.png)

What we must think about at the FaaS level are the things that matter:
what the function interface looks like, what the function does, and that
the function itself is stateless. How the function is provisioned, how
it runs, how it's removed, how it's scaled - well, we don't care
about that.

And the most interesting part? When the functions we write aren't being
invoked, it's like they don't exist. From a financial perspective,
this is the underlying truth for the idea of serverless - it's a term
that relates to the business model. If a function doesn't exist, what
possibly could you be paying for?

Therein lies the beauty of FaaS. At least to me, it's the ultimate in
compute agility. I write a relatively short function [in a simple
editor](/blog/posts/2018/03/26/monday-morning-thoughts:-cloud-native/),
test and deploy it, wire it into the event fabric, and then sit back. My
account won't be charged until the function is actually invoked. I
don't have to have anything running to form sockets for incoming
connections, or to keep the runtime environment warm. All I must do is
think in terms of functions.

## The event fabric

What is this event fabric? Well, either by fate or by accident, or, as I
like to think, by the sheer success of the protocol that powers the
world's biggest and most scalable web service (the web itself), HTTP
has become the universal coupling. The model of HTTP's request/response
mechanism is well understood, has a beautiful and [common
simplicity](https://web.archive.org/web/20180818053638/https://progrium.com/blog/2012/11/19/from-webhooks-to-the-evented-web/)
when you need simplicity, and a depth to handle complex scenarios when
that's required too.

So one of the yarn types\* in the event fabric is HTTP. One can think of
this type having two function invocation styles. A direct invocation
style, where one piece of software calls another directly. There's also
an indirect invocation style, where one piece of software registers an
HTTP endpoint, a callback, to be invoked at a later stage, on an event
or the successful (or unsuccessful) completion of some computation. This
style has a name which you may have come across - webhooks. It's a
concept that was [popularised by Jeff
Lindsay](https://web.archive.org/web/20180818053638/https://progrium.com/blog/2012/11/19/from-webhooks-to-the-evented-web/),
from whom I've learned a lot.

![](/images/2018/05/maple.jpg)

Maple Mill, Oldham

\*Yes, I'm mindful of the fact that this weaving metaphor is in my DNA,
growing up surrounded by a legacy of [cotton
mills](https://en.wikipedia.org/wiki/Cotton_mill) in the heart of the
industrial revolution here in the north west of England, a revolution
that bootstrapped world industry.

There are other types of event in the fabric beyond the straightfoward
webhook. These might be platform or provider specific; an oft-quoted
example is from the Lambda offering from Amazon Web Services, where a
cloud function can be triggered from an activity relating to an S3
storage bucket (in the example, the function creates and stores a
thumbnail image of a picture that's just arrived in a bucket). Of
course, you can imagine other cloud providers having their own technical
or business events. Think of all the business events that exist, and
that we could hook into, that take place inside an SAP S/4HANA system.

Of course, there are also the more mundane but equally important event
types based on timers. [Cron](https://en.wikipedia.org/wiki/Cron) and
other scheduling systems are alive and well. Even in Google's App
Script environment you can find a timer event based scheduling system to
invoke your code at certain intervals.

Beware: with timer-based events, there will come a pivot point where the
cost consideration for having functions run at very frequent intervals
means that perhaps you want to move back down the stack to a larger
granularity of, say, a more permanent container or even small VM.

## Distributed and asynchronous

So we have a runtime that we only pay for when in use, a set of
functions that - for all practical purposes - don't exist except when
they need to be invoked - and well-known standards that describe the
contract against which we must design our computing logic. That's a
pretty nice state of affairs. But what's it good for?

Well, consider the nature of our business computing today. We're
operating in a hybrid world, with systems on-premise and in the cloud.
Business processes exist across system boundaries, and across those
different granular layers we considered earlier:

-   at the IaaS level, we have traditional ABAP stack runtime VMs (lower
    than that if they're on premise on actual physical hosts, of
    course)
-   at the PaaS level, we have services on the SAP Cloud Platform
    (Workflow, Predictive, Business Rules, etc)
-   at the SaaS level we have Concur, SuccessFactors, Ariba and many
    other cloud software offerings


To be able to define discrete pieces of execution, that then lie dormant
until they're required, is a facility that we'll find increasingly
useful in this world, where processes are distributed, and naturally
asynchronous. The concept of publish-subscribe, or "pubsub" for short,
has been around for a good while. Even I got in on the act, co-authoring
a [Jabber Enhancement Proposal for pubsub in Jabber (XMPP)](https://xmpp.org/extensions/xep-0024.html), and building
an HTTP implementation of pubsub called
"[Coffeeshop](https://www.youtube.com/watch?v=1E_1B8TD6Kw&list=PLfctWmgNyOIcbRYRdPrbjN_ZM56Kc5YTL)"
(which in a round about way caused me to write the [Alternative
Dispatcher
Layer](/blog/posts/2009/09/21/a-new-rest-handler-dispatcher-for-the-icf/) -
that's a story for another time).

![](/images/2018/05/Screen-Shot-2018-05-14-at-14.07.10.png)

The ability to have relatively small pieces of code that do one thing
and do it well takes from a
[philosophy](https://en.wikipedia.org/wiki/Unix_philosophy#Do_One_Thing_and_Do_It_Well)
that has been proven to be solid and pretty much ubiquitous - most of
the Internet runs on Linux, a flavour of Unix, these days.

I have already found uses for cloud functions, in a FaaS context, in
various projects over the past year. Instead of setting up some sort of
Common Gateway Interface (CGI) contraption on the back of an existing
web server somewhere, I just write the code that does what I need it to
do and inject it into the cloud. I don't have to own a VM, have access
to a web server, and - best of all - don't have to worry about having
to add configuration to that existing web server [without breaking
anything](/blog/posts/2018/05/07/monday-morning-thoughts:-containers-and-silence/),
just to get a callback to be, well, callable. Moreover, I used FaaS in
the form of Google Cloud Functions in my [Discovering SCP
Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/)
series, writing a [service
proxy](https://blogs.sap.com/2018/01/17/discovering-scp-workflow-service-proxy/)
as a cloud function.

With the natural environment for computing in our SAP ecosystem becoming
more distributed and event-driven (or message-driven, gosh, that's yet
another subject for another time), it makes sense that we have the right
tools to control or just hook in to the flow, add enhancements and
extensions, and even just write "glue code", perhaps in a microservice
sense, to provide the end-to-end solution.

If nothing else, the combination of a well-defined interface that's
required for writing functions for an FaaS runtime, with the natural
stateless nature of that runtime, will focus our minds and hopefully
help us improve how we write and deliver stable and reliable software.

One function at a time.

---

This post was brought to you by [Pact Coffee's La
Secreta](https://www.pactcoffee.com/coffees/la-secreta), and the
birdsong of an early and peaceful Monday morning.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-functions-what-functions/ba-p/13365087)
