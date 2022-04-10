---
layout: post
title: Reflecting weblogs.com 'ping's with SOAP, Jabber, and Pubsub
---


Last month, [Simon](http://www.pocketsoap.com/weblog/index.html "Simon Fell's weblog") answered a [cry for help](http://www.pocketsoap.com/weblog/2002/06/13.html#a604) from someone in the weblog community by creating [blogToaster](http://www.pocketsoap.com/weblog/2002/06/15.html#a608), a neat little IM-based app that alerts people about updates (coordinated through [www.weblogs.com](http://www.weblogs.com/)) to weblogs that they’re interested in.

But the most intriguing thing was his [Subscriber Interface for weblogs.com](http://www.pocketsoap.com/weblog/stories/2002/02/12/subscriberInterfaceForWeblogscom.html), the mechanism on which the blogToaster is based. It’s a SOAP-based frontend to the weblogs.com ‘Recently Changed Weblogs’ information. You tell the interface what weblog URLs you’re interested in and it gives you SOAPy pings at the URL you specified whenever they’re updated, taking care of the nasty polling business for you (and for everyone else, which is the whole point).

Inspired by this generous infrastructural act, I put together an experimental bit of code which reflects this mechanism out into Jabber plasma. It’s a pubsub concentrator that sits in front of Simon’s Subscriber Interface and allows any app that can send and receive simple Jabber packets to request and receive weblogs.com-based update pings via this subscriber interface, without all the tedious mucking about in HTTP and SOAP protocols [1] (with apologies to Douglas Adams).

The idea is that in the same way that the [Jabber extensions for Danny O’Brien’s Panopticon](../../2002/May/15#panopticon) gave the Panopticon server some breathing space by effectively diffusing the data to Jabber entities via a conference room, so this new mechanism abstracts the Subscriber Interface out and allows many subscribers to share one subscription connection. Publish/Subscribe. One publisher, many subscribers. The publisher, in this case the Subscriber Interface, only has to send out one SOAPy ping per updated weblog URL to reach potentially many notification recipients (subscribers).

So rather than reproduce a blogToaster-like mechanism, I thought I’d have a go at putting together a mini-infrastructure on top of which lots of different blogToaster-like mechanisms could be built.

The mechanism is running at JID ‘**weblogs.gnu.mine.nu**‘, and the packets are based on the [Jabber PubSub JEP](http://www.jabber.org/jeps/jep-0024.html). It’s still alpha, and likely to fall over if you look at it the wrong way.

Here’s an example of how it works. You send a ‘subscribe’ packet, saying you want to be notified when [DJ’s Weblog]() is updated:

SEND:

```
<iq type='set' to='weblogs.gnu.mine.nu'>
	<query xmlns='pipetree:iq:pubsub'>
		<subscribe to='//qmacro.org/about'/>
	</query>
</iq>
```

Then, whenever the weblog specified is updated, you get a packet pushed to you like this:

RECV:

```
<iq type='set' from='weblogs.gnu.mine.nu' to='user@host/resource'>
	<query xmlns='pipetree:iq:pubsub'>
		<publish from='//qmacro.org/about'>
			<url>//qmacro.org/about</url>
			<name>DJ's Weblog</name>
			<timestamp>2002-07-03T21:35:51Z</timestamp>
		</publish>
	</query>
</iq>
```

The information in the *name*, *url* and *timestamp* tags (in the publish IQ) is taken directly from the *weblog* tag in the SOAP-enveloped callback message described at the bottom of the [Subscriber Interface description](http://www.pocketsoap.com/weblog/stories/2002/02/12/subscriberInterfaceForWeblogscom.html) page.

For now, as a bonus (or an immoral twisting of the Jabber pubsub packet philosophy, depending on how you look at it ;-) I’ve set up the mechanism to send you not only a publish IQ as shown above, but also a simple *message* packet with the same information, so that you can use your regular Jabber client to ‘process’ (read: see) the pings. So if you’re feeling brave, break out your Jabber debug app and send a few pubsub packets to **weblogs.gnu.mine.nu**. If you’re not feeling so brave, you can wait until tomorrow – I’ve got a a few helper example apps that will hopefully make things clearer. In either case, remember this: if it works, it works because of the coolness of what [Dave W](http://www.scripting.com/) [built](http://www.weblogs.com/), the coolness of what [Simon](http://www.pocketsoap.com/weblog/index.html "Simon Fell's weblog") [built](http://www.pocketsoap.com/weblog/stories/2002/02/12/subscriberInterfaceForWeblogscom.html), and the coolness that is ‘net based collaboration and open standards. Time for bed now.

[1] Ooh, talking of HTTP and SOAP protocols, I just read an interesting [XML-SIG post](http://mail.python.org/pipermail/xml-sig/2002-February/007183.html) by [Paul Prescod](http://www.prescod.net/) which made some valid (but also nicely philosophical, IMHO) points towards the end of the mail regarding whether SOAP is actually a protocol (as opposed to, say, an encoding), and how much, despite its ‘independence’ of transport, it depends upon its binding to HTTP, as much as any protocol depends on its binding to a lower-level transport. But I digress..


