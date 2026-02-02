---
title: "Monday morning thoughts: the cloud is the computer"
date: 2018-08-13
tags:
  - sapcommunity
  - mondaymorningthoughts
description: I think about what the future of programming in an enterprise environment might look like, and realise that it makes sense to consider that the cloud itself is the new computer.
---

Sun Microsystems, an incredibly venerable hardware and software company
from back in the day, is the creator, directly or indirectly, of some of
the technologies & ideas we still use today. These technologies include
the Network File System (NFS), Java, XML and even the ultimate editor,
vi, originally written by one of Sun's co-founders Bill Joy. Sun's
Solaris was one of the many Unix flavours upon which R/3 was made
available.

Sun's motto was "The Network Is The Computer" which resonated and
inspired at the time. I guess this motto has been at the back of my mind
the whole time, but I'd posit that perhaps the phrase "the cloud is
the computer" is becoming more appropriate today.

## The future of programming

This weekend I watched a very interesting talk by Chris Granger called
"[What does programming look like in 10
years?](https://www.youtube.com/watch?v=zQo4jUVWI_I)". Chris is someone
who has written some very interesting experimental software, notably
(for me) [Light Table](http://lighttable.com/), a "next generation"
code editor with many features including inline evaluation of code, as
you type. This idea is more common today than it was back then - I use
it in often in the form of the excellent
[Quokka](https://quokkajs.com/) editor plugin, it's also a core feature
of the [Ramda REPL](https://ramdajs.com/repl/) where you can explore
seriously good functional programming in JavaScript, and in fact the
latest version of Chrome, version 68, has [eager
evaluation](https://developers.google.com/web/updates/2018/05/devtools#eagerevaluation)
built into the console.

![Image result for lighttable](/images/2018/08/watches.png)

*A screenshot of [Light Table
0.5.0](http://www.chris-granger.com/2013/08/22/light-table-050/) showing
the results of inline evaluation, the feature also known as "instarepl"*

Light Table was one of many programming environments that Chris has
explored over the years, and this talk is a great way to see some of the
radical and wonderful ideas that he has built out into prototypes.

Anyway, the talk caused me to think about what the future of programming
in the enterprise space, particularly in the SAP ecosphere, might look
like in 10 years time, and I was minded to think about the shape that is
becoming the surface upon which, the target against which, we will be
writing code.

## Where we came from, where we are now

Mindful of where some of us started, with R/2, there was a single
monolith, [full of stars](http://wiki.c2.com/?MyGodItsFullOfStars).
Everything we programmed got executed inside that monolith. Moving to
the SAP R/3 architecture we did indeed see a shift to a more
client-server architecture, although essentially there were still
mini-monoliths in the form of ABAP stacks - after all, this was the
pre-HANA era when it was anathema to treat the database as anything
other than a data store - certainly not an execution environment (I
think this was perhaps as much to do with portability as well as the
mechanics of complex table definitions inherited from the R/2 era -
think clusters and pools).

![](/images/2018/08/Screen-Shot-2018-08-13-at-08.15.17.png)

*Programming R/2, courtesy of 2001 A Space Odyssey*

Today we have an array of environments, both on-prem and in the cloud.
Think about software-as-a-service (SaaS) environments like
SuccessFactors and S/4HANA Cloud, about R/3 architecture systems still
running in company specific or managed data centres, and the undulating
surface of virtual runtime platforms: entire virtual machines (VMs),
downscaled VMs in the form of containers, and - perhaps most radically -
the concept of serverless computing.

To many of us serverless means functions-as-a-service (FaaS). This is
not incorrect, but it's more than that. Functions bristle with
potential, but ultimately are useless without a context, without an
environment, without a raison d'être. There is of course a beauty to be
had in the idea of a function with a single purpose, that does one
thing, does it well, that wakes up to perform and then sleeps again
until it's needed again. It allows us to dream that little bit closer
to one academic ideal of the Lambda Calculus, which relates to defining
functions that contain only a single expression\*.

By the way, for more thoughts on serverless, functions-as-a-service and
the event fabric, see another post in this [Monday morning thoughts
series](https://blogs.sap.com/tag/mondaymorningthoughts/) -
"[Functions, what
functions?](/blog/posts/2018/05/14/monday-morning-thoughts:-functions-what-functions/)".

\*I had a very interesting conversation yesterday with my fellow
Language Rambling writer Chris Whealy yesterday
about this academic ideal, in relation to his activities around [writing
succinct and functional
JavaScript](https://twitter.com/LogaRhythm/status/1027867611902689280) in
preparation for SAP TechEd.

## A rich diversity

So where we are now is at a place that is as varied as it is virtual, as
diverse as it is ephemeral. The axiom "thou shalt not modify standard
SAP code" is stronger than ever the closer we get to the SaaS model.
Taking that first, what does that mean for building custom and focused
solutions to business problems? Well, on the one hand it means building
extensions and net new apps that reach into the SaaS world via
well-defined APIs (this is where the [SAP API Business
Hub](https://api.sap.com/) comes in). That much is certain.

Moreover, it also means writing exits and custom code at well-known
extension points, in an "in-app" style, with development work where
it's hard to say whether what you're doing is programming or
configuring. This reminds me of something that came up briefly in my
conversation with Jakob Kjaer and Simon Kemp in the [inaugural SAP Coffee
Corner
episode](https://anchor.fm/sap-community-podcast/episodes/Episode-1---Interview-with-DJ-Adams-e1ac40)
earlier this year.

But this is not where it ends. Not only do we need to customise the user
interface, or enhance functionality inside standard solutions, or create
apps that business users need to interact with and reach into their core
processes enshrined therein, we also need a way to orchestrate and
participate in the general bloodflow of data and processes. How do we do
this? In the form of events, messaging and functions.

The idea of the publish/subscribe (pubsub) message pattern is certainly
not new - I even remember building pubsub mechanisms in Jabber (XMPP)
back in the early 2000's, as well as experimenting with
[coffeeshop](https://www.youtube.com/watch?v=1E_1B8TD6Kw&list=PLfctWmgNyOIcbRYRdPrbjN_ZM56Kc5YTL).
And of course since then there's been [PubSubHubbub, now
WebHub](https://en.wikipedia.org/wiki/WebSub), and many other
incarnations of the pubsub idea, but in the new world of today and
tomorrow's business computing environments, pubsub has a lot more
relevance.

What are the aspects of pubsub that are important here? Well, aspects
that are similar to those in the serverless world. In fact, one might
consider that pubsub and serverless share the same genes. And what
exactly is this increased relevance for us as programmers? Think of the
events that happen in business systems, and how we can connect with
them. What are the different types of events, what shape do they come
in? How do we react to them? How do we orchestrate and control what
happens, and when? How can we manage the events, the messages, that are
emitted and received by various participants in a constellation of
systems, services & platforms that make up a complete business solution?
The answers to these questions and more are to be found in the
serverless context, and I think it's fair to say that we'll be seeing
the results of hard work in this area from SAP in the very near future.

## The cloud is the computer

Considering all of this, in the context of wondering what the future of
programming will be like in building tomorrow's enterprise solutions,
causes me to think about what exactly my target programming environment
actually is. The answer is "all of the above". Backend services,
frontend consumption apps, discrete functions that alternately fire and
sleep, events that are emitted, queued and controlled, exposed layers of
configuration that can be tweaked and customised, exits that can be
activated and code supplied thereto, routines in the data layer that can
be triggered.

![File:Stormclouds.jpg](/images/2018/08/800px-Stormclouds.jpg)

*Stormclouds, courtesy of [Wikimedia
Commons](https://commons.wikimedia.org/wiki/File:Stormclouds.jpg)*

When I think about all of this, when I think about what I am programming
\*on\*, it's the cloud. Even if some of the system constellation
elements are actually on-prem, they're still satellites to and
connected with the breathing, living, amorphous being that is the cloud.
And so I must conclude that when I think about the future of
programming, I am compelled to conclude that in a virtual sense, and
perhaps a real sense, the cloud is the computer.

---

This post was brought to you on an early rainy Monday morning in
Manchester by [Pact Coffee's Ubumwe
Kigoma](https://www.pactcoffee.com/coffees/ubumwe-kigoma) and new
desktop background pictures courtesy of [70s Sci-Fi
Art](https://twitter.com/70sscifiart).

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-the-cloud-is-the-computer/ba-p/13383893)
