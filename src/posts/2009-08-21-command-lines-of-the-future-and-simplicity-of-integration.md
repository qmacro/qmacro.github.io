---
layout: post
title: Command lines of the future, and simplicity of integration
tags:
- chatbot
- http
- irc
- jabber
- pubsubhubbub
- purl
- rest
- roa
- sap
- soa
- wave
- webhooks
- xmpp
---


This is a bit of a hand-wavy post, but I wanted to get my thoughts down. Recently there’s been a spate of interest around interaction with devices, applications and systems ... via a chat-style interface. This is nothing new, of course. Bots have existed on the IRC networks for a long time. The venerable [Purl](http://www.foo.be/docs/tpj/issues/vol3_2/tpj0302-0002.html), an [infobot](http://en.wikipedia.org/wiki/Infobot), was a particular favourite of mine. When instant messaging (IM) came along, we had a new chat interface – which took the form of one-on-one or conference (‘group’) chat. With [Jabber](http://www.jabber.org/) (XMPP), ‘Chatbot’ was a favourite in the various conference rooms. Back in late 2002, I even wrote about Chatbot in a 2-part series “The Command Line of the Future” (“[Is Jabber’s Chatbot the Command Line of the Future?](http://web.archive.org/web/20040203121753/http://www.openp2p.com/pub/a/p2p/2002/01/11/jabber_bots.html)” and The “[Command Line of the Future Part 2: Expanding Chatbot’s Repertoire](http://web.archive.org/web/20031203031620/http://www.openp2p.com/pub/a/p2p/2002/02/08/chatbot_two.html)“):

> Consider for a moment what this command line of the future might look like. More and more people are online. More and more people are permanently connected, whether it be through DSL, cable, or 802.11 technology. And more and more of these people are communicating. Talking. Having conversations. In addition to email and Internet Relay Chat, or IRC, the (relatively) new kid on the block, Instant messaging (IM), is playing a huge part in facilitating these conversations. And in the same way that it’s common for us to have a command prompt or three sitting on our graphical desktop, it’s also becoming common to have chat windows more or less permanently open on the desktop too.

> But when thinking of IM, why stop at conversations with people? The person-to-application (P2A) world isn’t the exclusive domain of the Web. Bots, applications or utilities that have their interface as a projection of a persona into the online chat world, are a great and fun way to bring people and applications together in a conversational way.
>
> Interacting with a bot is the same as interacting with a person: type something to it and it replies. And what’s more, because of the similarities between a classic command-line prompt and that of a chat window, where you’re talking with a bot — both scenarios are text-based — interaction with a bot is scriptable.

Forward to the present.

Just the other day, [@davemee](http://twitter.com/davemee) and [@technicalfault](http://twitter.com/technicalfault) alerted me to [@manairport](http://twitter.com/manairport), Manchester Airport’s online persona on Twitter, obviously yet another chat-style interface. You can interact with it via direct messages (DMs). You follow it, it will follow you back, and you’re away.

> me: d manairport be7217
>
> manairport: Received request for information: be7217 manairport: Status of 17:40 flight BE7217 to Dusseldorf departing T3: Scheduled 17:40

Nice and [useful](http://www.dopplr.com/trip/qmacro/825806)!

And then just this morning, I read a weblog post on [SDN](http://www.sdn.sap.com) entitled “[SAP Enterprise Service and Google Wave](https://www.sdn.sap.com/irj/scn/weblogs?blog=/pub/wlg/15521)“. In it, the author talks about connecting Google Wave (you guessed it, yet another chat-style interface, amongst other things) with SAP, in particular enterprise ‘services’. In the short demo, order information from an SAP system is retrieved in a conversational way. The concept is great. The obvious issue with what’s shown in the demo (and I know it’s only a proof of concept) is that the bot responds with a data structure dump of information. What we’re looking for is something more, well, consumable by humans. Smaller, more distinct and addressable pieces of information that can be returned and be useful.

But what was more telling, at least to me, were the difficulties he described in connecting to the complex Enterprise Service backend in SAP:

> “… find the webservice … create a proxy … I did have some problems with calling the ES … On Appengine there are some limitations on what you can call of Java classes … From an architectural point I’m not real proved of the solution…”

Hmm. Why does architecture have to be complex? Using Enterprise Services, using SOA, is more complex than it needs to be. There’s a reason why the web works. There’s a reason why Google designed App Engine’s backend infrastructure (including [asynchronous task queues](http://googleappengine.blogspot.com/2009/06/new-task-queue-api-on-google-app-engine.html)) in a simple HTTP-orientated way. There’s a reason why the Wave robot protocol is based on simple HTTP mechanisms. There’s a reason why mechanisms like [PubSubHubBub](http://code.google.com/p/pubsubhubbub/) and [Webhooks](http://webhooks.pbworks.com/) are based on HTTP as an application protocol. Because simple works, and it works well.

Let’s come back to the “smaller, more distinct and addressable” issue. If we let ourselves be guided by a Resource Orientated Architecture (ROA) approach, rather than a Service Orientated Architecture (SOA) approach, we end up with simpler application protocols, flexible, reliable and transparent integration, and pieces of information that are addressable — and [usable](https://www.sdn.sap.com/irj/scn/weblogs?blog=/pub/wlg/584) — first class citizens on the web. This is Twitter’s [killer feature](/2009/05/18/twitters-success/).

Enterprises suffer enough with complexity paralysis. We should endeavour to embrace the design of HTTP as an application protocol (which is what I’m doing with [Coffeeshop](http://wiki.github.com/qmacro/coffeeshop)), rather than fight against it.


