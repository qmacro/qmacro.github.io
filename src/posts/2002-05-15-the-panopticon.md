---
layout: post
title: The Panopticon
---


Everything that goes around, comes around. What thing links my old University ([UCL](http://www.ucl.ac.uk/GrandLat/)), [Jeremy Bentham](http://www.ucl.ac.uk/Bentham-Project/), (whose [preserved figure](http://www.ucl.ac.uk/Bentham-Project/images/auto_il.gif) sits in UCL’s South Cloisters), and this year’s [Emerging Technology Conference](http://conferences.oreillynet.com/etcon2002/)?

Why, the [Panopticon](http://www.dnai.com/%7Emackey/thesis/panopticon.html), of course. An architectural figure, envisioned by Bentham, which allows one to see but not be seen. “The Panopticon” is also the name given to a [wonderful experiment](http://www.actuallyworks.com/panopticon) in “blogger stalking” (a phrase from [BoingBoing](http://boingboing.net/2002_05_01_archive.html#85087344)) with avatars and a floormap of the conference area.

This Panopticon’s creator, [Danny O’Brien](http://www.oblomovka.com/) (of [NTK](http://www.ntk.net/) fame), put out some [instructions](http://www.actuallyworks.com/panopticon/explanation) as to how the thing worked, and mentioned that he would be streaming the metadata out of a port on his server. He asked if anyone could regurgitate the data to a Jabber room so other clients could grab it from there rather than hammer his server, so I took up the challenge :-) This is, in essence, poor man’s pubsub (again) in the spirit of load dissipation: with a ratio of, say, 1:50 (Panopticon port connections – to – Jabber conference room listeners) we can relieve the strain and have a bit of fun.

Ok, well it was a very quick hack. The data coming out of the server port is a stream of XML. Hmmm. Sounds familiar ;-) I quickly hacked together a library, [Panopticon.pm](/~dj/Panopticon.pm), based loosely upon [Jabber::Connection](/jabber/jabberconnection/), a Perl library for building Jabber entities (XML streams flow over Jabber connections, too, y’know). With this quick and dirty library in hand, I wrote an equally quick and dirty script, [panpush.pl](/~dj/panpush.pl), which uses [Panopticon.pm](/~dj/Panopticon.pm) and [Jabber::Connection](/jabber/jabberconnection/) to do this:

- connect to a Jabber server and authenticate
- join a conference room
- open up the panopticon server port
- fire the data that comes out of the port into the conference room for all to see and read, on a continuous basis

The Panopticon data is XML. Jabber is XML. So I decided the nice thing to do would be to avoid just blurting XML into the conference room – that would be like shouting gobbledygook in a room full of people. Instead, I wrote something sensible to the room each time some data fell out of the end of the Panopticon socket (the name of the blogger’s avatar), and *attached* the actual Panopticon XML as an extension to the groupchat message. Here’s an example:

Panopticon produces this:

```xml
<icon id='4ee9da17f5839275ad0ca5d58c2bacaa'>
	<x>456</x>
i	<y>255</y>
</icon>
```

`panpush.pl` sends this to the room:

```xml
<message to='panopticon@conf.gnu.mine.nu' type='groupchat'>
	DJ Adams
	<x xmlns='panopticon:icon'>
		<icon id='4ee9da17f5839275ad0ca5d58c2bacaa'>
			<x>456</x>
			<y>255</y>
		</icon>
	</x>
</message>
```

The scary thing is that it seems to work! Grab your nearest Jabber client and enter room

**panopticon@conf.gnu.mine.nu**

(remember, you don’t have to have a Jabber user account on gnu.mine.nu to join a conference room there – just use your normal Jabber account, say, at jabber.org). If it’s still working, you should see ‘panopticon’ in that room – that’s the panpush.pl script. When some avatar metadata changes and pops out of the Panopticon server’s port, it will appear in the room – currently represented as the avatar’s name.

Want more? Want to actually do something with the data in the room?

Well, I’ve just written an example antithesis to panpush.pl – [panclient.pl](/~dj/panclient.pl). This connects to the conference room, and listens out for packets containing the panopticon XML extensions. It just prints them out, but of course you can do with the data as you please. It’s just an example.

Oh, one more thing. As [panpush.pl](/~dj/panpush.pl) catches the panopticon XML and squirts it into the room, it also caches the actual avatar data, keyed by each icon’s id attribute. I plan to allow queries to be sent to the ‘panopticon’ room occupant, probably in the form of **jabber:iq:browse** IQ queries, so that clients can find out about what avatars are currently around, and what properties they have (name, url, xy coordinates, and so on).


