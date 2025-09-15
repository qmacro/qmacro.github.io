---
title: What is a Jabber client?
description: |
  "A rose is a rose, by any other name." But is the same true for a Jabber client? I don't think so.
date: 2001-01-31
tags:
  - jabber
  - archive
---

To answer this question, we first have to decide what a Jabber client is. To many, it is a program with which to chat with friends, and join in group discussions. On one level, of course it is. The current cluster of available Jabber clients are focused pretty much on the initial competency (there's a reason why I'm not using the phrase 'core competency') of Jabber: Instant Messaging (IM).

## Jabber's Initial Competency

Not to put too fine a point on it, it's likely that Jabber wouldn't exist today if it were not for the itch that Jeremie Miller, Jabber's founder, was determined to scratch - namely to find a solution to the soup of incompatible IM systems which meant he had to run a whole host of different programs just to talk with his friends. And because that's where Jabber has grown from - IM - it makes sense that Jabber's initial competency is in the IM space. And this competency is a very easy one to get to grips with - everyone wants to talk, to converse, to communicate. So it follows that the Jabber clients that are available 'off the shelf' (from JabberCentral, for example) all provide human-orientated conversation features and are targeted to this initial competency.

But surely for Jabber, IM clients with UIs (user interfaces) are the tip of the iceberg? IM as we know it today (a human-to-human substrate of the more general P2P gloop - and I'm deliberately leaving you to decide what the 'P's stand for on either side of the '2') is something tangible in the more general space that Jabber occupies - "communication" - that we can perhaps use to bootstrap more intangible, undiscovered applications and ideas to which Jabber lends itself exceedingly well.

## Message Plasma

What do I mean by this? Well, Jabber is an architecture, a way of thinking, a set of protocols, just as much as it is an actual implementation in the form of a server and clients. And this architecture lends itself to much more than the exchange of gossip between friends, or the hosting of WAMs (Wide Area Meetings ;-) in group chat. It can be injected easily into the virtual routes between systems and users, acting as "message plasma" to bind those entities taking part in conversations as equal partners, and to provide them with a space and time structure in which to engage in those conversations.

## Generations

It can be argued that the Web is in its third (going on fourth) generation; the first being static information served to browsers, the second being dynamic content, and the third being the advent of CGI (Common Gateway Interface) based interactivity to the extent that whole applications are finding their way onto the Web. And running parallel to these developments we have the concepts of "infoware" (e.g. interactive Web sites - usually commercial - that are seen as application entities in their own right, such as Google or Amazon) which is a human-orientated concept, and remotely callable procedures (RPC) - not a new concept at heart, but new in the sense that companies are offering their Web-based services at a programmatic level as well as at a traditional customer-eye level. I'm talking of course about XML-RPC and SOAP.

While these two concepts - infoware and RPC - are effecting the Web's transition to the next generation, there's one piece of the jigsaw missing: the component parts of the next generation are still insular, and the traffic between them is somewhat stilted. We've yet to realise an all-pervasive messaging infrastructure which can link these willing and able components together. (Of course, there's a distinction between Web and non-Web components here - but I think the distinction, which to me is still based around the question "does it speak HTTP?", is less important - for example consider the current array of (RSS-based) headline message viewer clients: they retrieve information via HTTP but would you use the word "Web" in any sort of description of their functionality?)

## Fitting the bill

As the boundaries between the building blocks of the 'net become more blurred, and messaging as a foundational element gets bumped higher and higher up companies' agendas, we look at Jabber's architecure and protocols, and thereby its heart as an XML router, and realise that in a great number of cases it can fit the bill. And the bill in these cases has less to do with IM chat, and more to do with conversations, messages, communication between entities in a wired world. Not that it ignores the possible human element in the loop - far from it - Jabber is endpoint-agnostic and will treat all manner of peers alike. ("In the messaging world, no-one knows you're a bot" :-)

## A Jabber Client

So with this in mind, what might be a better definition of a Jabber client? Simply, something that uses Jabber's ideas and protocols to get the job done. At one level, this might be as simple as a client that uses a very specific subset of the IM idea and nothing else. For an example in the IM space, sjabber is a no-frills groupchat-only client for conversing in group discussions, and knows nothing of rosters, alerts, or one-on-one chats. For an example in the non-IM space, consider Net::Jabber::XMLRPC - an experimental extension to the Net::Jabber libraries (used for Jabber programming with Perl) to carry XML-RPC encoded messages via Jabber rather than via HTTP. What came out of this experiment was a pair of stubs - to provide the Jabber glue for the two well-defined XML-RPC roles of client and server. For another example outside the IM space, I wrote, just for fun, a script which used Lego Mindstorms to monitor our coffee machine, so we could all know whether there was any coffee - this was done by getting that script to transmit meaningful 'coffee presence' information, which effectively made the coffee machine a peer on the Jabber network, and thereby defining the script and Lego device as a client.

## Bootstrap

Ironically - and happily - some of the current Jabber IM clients, such as WinJab and Jarl, have a feature with which you can construct and send XML by hand, and view XML received. Therein lies a small but perfectly formed catalyst for experimentation and the begetting of new ideas for Jabber deployment - to be able to see and fiddle with the plasma traffic that you're constructing is as conducive to thinking outside the IM box as it is fun. So in a way, non-IM implementations of Jabber will have been born in an IM environment.

## Jabber's Core Competency

I think it's clear by now that I think that Jabber's core competency is in binding together entities in conversation, in enabling communication between humans and systems, in allowing us to construct a TCP/IP for the component layer.

What I want to avoid is people getting stuck with the "a Jabber client is a GUI program with a buddy-list and popup chat windows" mentality - Jabber is an extremely capable IM system, but that's only one realisation of its many talents.

And while the IM experience is the currently prevailing embodiment of conversation for us when we think of Jabber, I don't think it will remain that way.

---

[Originally published on jabbercentral.org](https://web.archive.org/web/20010602053841/http://jabbercentral.org/features/view.php?feature_id=980877025)
