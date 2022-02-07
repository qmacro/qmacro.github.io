---
layout: post
title: Twitter's success
tags:
- bots
- enterprise
- http
- identica
- jabber
- json
- laconica
- messaging
- perl
- pipeline
- rest
- rss-tag
- soa
- twitter
- urlspace
- web
- xmpp
---


Yes yes, I know I’m late to the game, and everyone and his dog has given their angle on why Twitter is so successful, but I’d like to weigh in with a few thoughts too. The thoughts are those that came together when I was [chatting](http://twitter.com/qmacro/status/1782050968) to Ian Forrester ([@cubicgarden](http://twitter.com/cubicgarden)), at a [GeekUp event](http://geekup.org/events/130) in Manchester last week.

### Messaging Systems

Back in the day, I talked about, wrote about and indeed built interconnected messaging systems based around the idea of a *message bus*, that has human, system and bot participation. The fundamental idea was based around one or more channels, rooms or groupings of messages; messages which could be originated from any participant, and likewise filtered, consumed and acted upon by any other. I wrote a [couple](http://www.openp2p.com/pub/a/p2p/2002/01/11/jabber_bots.html) of [articles](http://www.openp2p.com/pub/a/p2p/2002/02/08/chatbot_two.html) positing that bots might be the command line of the future.

Using my [favourite messaging protocol](http://www.xmpp.org), I built such a messaging system for an enterprise client. This system was based around a series of rooms, and had a number of small-but-perfectly-formed agents that threw information onto the message bus, information such as messages resulting from monitoring systems across the network (“disk space threshold reached”, “System X is not responding”, “File received from external source”, etc) and messages from SAP systems (“Sales Order nnn received”, “[Transport xxx released](https://www.sdn.sap.com/irj/scn/go/portal/prtroot/docs/library/uuid/7ce5c590-0201-0010-388e-cc28510abb89)“, “Purchase Order yyy above value z created”, etc). It also had a complement of agents that listened to that [RSS/ATOM-sourced](http://www.oreillynet.com/xml/blog/2003/01/rss_the_web_service_we_already.html) stream of enterprise consciousness and acted upon messages they were designed to filter — sending an SMS message here, emailing there, re-messaging onto a different bus or system elsewhere.

So what does this have to do with Twitter? Well, Twitter is a messaging system too. And Twitter’s ‘timeline’ concept is similar to the above message groupings. People, systems and bots can and do (I hesitate to say ‘publish’ and ‘subscribe to’ here) create, share and consume messages very easily.

### Killer Feature

But the killer feature is that Twitter espouses the guiding design principle:

[**Everything has a URL**](http://www.google.co.uk/search?q="everything+has+a+url")

and everything is available via the lingua franca of today’s interconnected systems — HTTP. Timelines (message groupings) have URLs. Message producers and consumers have URLs. Crucially, *individual messages have URLs* (this is why I could refer to a particular tweet at the start of this post). All the moving parts of this microblogging mechanism are [first class citizens on the web](/2002/09/02/rest-google-and-idempotency/). Twitter exposes message data as feeds, too.

Even Twitter’s API, while not *entirely* RESTful, is certainly facing in the right direction, exposing information and functionality via simple URLs and readily consumable formats (XML, JSON). The [simplest thing that could possibly work](http://c2.com/xp/DoTheSimplestThingThatCouldPossiblyWork.html) usually does, enabling the “[small pieces, loosely joined](http://www.smallpieces.com/)” approach that lets you [pipeline the web](http://radio.weblogs.com/0100887/2002/03/27.html), like this:

dj@giant:~$ <span style="color: #008000;">GET http://twitter.com/users/show/qmacro.json |  perl -MJSON -e "print from_json(<>)->{'location'},qq/n/"</span> Manchester, England dj@giant:~$

None of this opaque, heavy and expensive SOA stuff here, thank you very much.

### Other Microblogging Systems and Decentralisation

And does this feature set apply only to Twitter? Of course not. Other microblogging systems, notably [laconi.ca](http://laconi.ca/trac/) — most well known for the public instance [identi.ca](http://identi.ca/) — follow these guiding design principles too.

What’s fascinating about laconi.ca is that just as a company that wants to keep message traffic within the enterprise can run their own mail server (SMTP) and instant messaging & presence server (Jabber/XMPP), so also can laconi.ca be used within a company for instant and flexible enterprise social messaging, especially when combined with [enterprise RSS](http://www.oreillynet.com//cs/user/view/cs_msg/12476). But that’s a story for another post :-)


