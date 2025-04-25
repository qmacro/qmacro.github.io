---
layout: post
title: "Monday morning thoughts: local http servers and containerisation"
date: 2018-07-30
tags:
  - sapcommunity
  - mondaymorningthoughts
  - containers
---
*In this post, I look back on an idea surfaced by a hero of mine, and
think about how that idea laid the path for today's containerisation
initiatives.*

One of the periodicals I eagerly anticipated and regularly devoured
every month, starting in the 1980's, was Byte magazine. From the
fanciful and inventive artwork on the covers (many pieces by [Robert
Tinney](https://en.wikipedia.org/wiki/Robert_Tinney)), through the
regular columns to the special subjects that were covered from time to
time, I enjoyed the pioneering spirit and wonderful ideas that poured
out of the pages.

![](/images/2018/07/Screen-Shot-2018-07-30-at-05.46.58.png)

One of my all time tech heroes [Jon Udell](http://jonudell.net/) wrote
regularly for Byte, and I had the honour of meeting him at O'Reilly's
Open Source Convention (OSCON) back in the early 2000's.

## Client and server

The idea in one of the articles Jon wrote (and there were many - see his
list of [1999-2002 BYTE.com columns](http://jonudell.net/bytecols/) for
example) has stayed with me since I read it. You have to remember that
it was at a time when the web was young, and there was a clear
distinction between client and server. On our workstations we ran
clients - web browsers such as Netscape Navigator, and even [earlier
examples](https://arstechnica.com/information-technology/2011/10/before-netscape-forgotten-web-browsers-of-the-early-1990s/)
such as Mosaic and Cello.

It was a given that web servers (very often in the form of
[httpd](https://en.wikipedia.org/wiki/Apache_HTTP_Server) - Apache's
web server software) ran on, well, servers, and that was that. Our
traditional mindset was very much oriented around the concepts of client
and server, not least since SAP released R/3 in 1992, a firmly
client-server architecture in contrast to what we'd been used to before
that with R/2.

## Local web servers

So when Jon wrote about the idea of a service running directly on one's
local workstation, based around a local web server, it was something
pretty new. The concept of pointing our local web browsers at a web
server running *on the same host* - that was a light bulb moment for
sure. Typing "localhost" into the URL address bar invoked a small
degree of excitement, as if we were doing something ever so slightly
futuristic. Sure, we'd used the file scheme (file:///) to load local
static resources before, but to be able to interact with a service,
especially a [Common Gateway
Interface](https://en.wikipedia.org/wiki/Common_Gateway_Interface)
(CGI)\* based service that we could control and alter, that was
something almost magical.

\*I'm reminded of the venerable Internet Transaction Server (ITS) which
has been the subject of fond reminiscences recently on Twitter. The ITS
was essentially two components, the "agate" and the "wgate". The
"wgate" (web gateway) came in various flavours, according to the web
server APIs of the day. One was the generic CGI flavour, which was my
favourite as I'd been building web based interfaces to SAP systems for
quite a while before the ITS, using CGI and the
[RFCSDK](https://help.sap.com/saphelp_nw73/helpdata/en/48/a88c805134307de10000000a42189b/frameset.htm).
But I digress.

## Discrete and portable services

What that concept of a local web server did was democratise HTTP. Of
course, the web itself was already pretty democratic - anyone with a
plain text editor could create content with HTML, and learn how to
create that content by looking at the source of existing content. But
the ability, and more so the idea that anyone could run web servers
locally, to serve up small services, single-purpose user interfaces, was
rather enlightening.

The idea of running a web server locally broke down the traditionally
strict separation of client and server, broke down the conceptual
barriers between what you ran on your workstation and what ran on
servers that you couldn't see. Suddenly we were considering services
that ran locally. Services that we spoke to over HTTP, that nearly
always had a web-based interface, could now run locally. Once you'd
seen the word "localhost" in that URL bar, you couldn't unsee it.

And so began, at least for me, the idea that there was really little
distinction between client and server. Services that you or others built
could run locally or remotely. What mattered was that you talked to
them, in some cases administered them, via your web browser. The only
difference was that the hostname in the URL was different.

What's more, running services locally like this became easier as more
and more software producers and hobbyists offered bundles that were easy
to install - whether because the target OS made it easy, or that the
bundle itself was portable. Love or loathe the Java language itself,
it's hard to deny the early portability of code provided by the real
triumph of Java - the Java Virtual Machine (JVM). Download a Java
archive, run it, and connect to the service you've just instantiated by
specifying "localhost" and some port number\* in your browser.

\*the port number was usually above 1024, as getting a service to listen
on port numbers lower than that [requires root
privileges](https://www.w3.org/Daemon/User/Installation/PrivilegedPorts.html).

## From portable services to containers

I was reminded this weekend of the concept of the near ubiquity of
portable services fronted by web-based interfaces in a video I was
watching on [Kafka and PCF
Dev](https://www.youtube.com/watch?v=zcC7iwbbEdc). PCF Dev is a local
Cloud Foundry installation for development purposes - I'll leave the
musing on how this idea adds to the concepts of this post's subject as
an exercise for the reader.

![](/images/2018/07/Screen-Shot-2018-07-30-at-06.41.31.png)

The Kafka service had a web interface that displayed stats on schemas,
topics, connections and more. The fact that I couldn't work out whether
the address in the URL bar (which you can see in the video) was
something directly local or in a container (it was at least a [private
address](https://www.youtube.com/watch?v=zcC7iwbbEdc)) drove home the
idea that discrete services and containers were in this context one and
the same thing.

Today we take for granted the concept of containers, whether those
containers are explicit and managed by a local (or remote) Docker
system, or whether they're ephemeral and practically conceptual in the
context of the Cloud Foundry environment on the SAP Cloud Platform. But
I think that the journey we're taking towards the realisation of an
enterprise compute fabric has been influenced by fundamental ideas that
appeared decades ago.

Moreover, the very existence of tools like PCF Dev underlines the idea
that there really is no distinction between client and server. Or
rather, that workstations and cloud resources alike can be platforms to
run these discrete, modular services. And as we expand the idea of what
compute means, bringing in concepts such as serverless, that reduce to a
minimum the idea of a unit of computation, we realise that perhaps the
journey that started back in the days of Byte is far from over.

## The new pioneering spirit

I for one am genuinely intrigued and excited by the prospect and reality
of cloud native computing, and what we are doing in the SAP world in
that area - take a look at Bjoern Goerke's post "[SAP Cloud Platform:
An open enterprise platform with a cloud-native
core](https://blogs.sap.com/2018/07/24/sap-cloud-platform-an-open-enterprise-platform-with-a-cloud-native-core/)"
for examples of what open source and partnership initiatives are taking
place in this area right now. I have a feeling that there's a
pioneering spirit still very fresh in this age, and am looking forward
to seeing where it takes us.

---

This post was brought to you by [Pact Coffee's Ubumwe
Kigoma](https://www.pactcoffee.com/coffees/ubumwe-kigoma) and the odd
feeling of not going out on a Monday dawn due to an enforced rest from
running to give my tired legs a chance to recover.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-local-http-servers-and-containerisation/ba-p/13368372)
