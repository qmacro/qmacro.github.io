---
layout: post
title: "(Jabber-)Browsing the Panopticon data"
---


Ok, further to my initial [Panopticon/Jabber](/2002/05/15/the-panopticon/) experiments, I’ve extended the [panpush.pl](http://www.pipetree.com.wstub.archive.org/%7Edj/panpush.pl) script to respond to jabber:iq:browse requests. As the script starts, and receives the initial gush of data from the Panopticon port, and as it receives further pushes, it stores the data on the avatar icons, and makes this data available as results to the jabber:iq:browse requests.

To get a list of avatars in the Panopticon, you can send a query like this:

```xml
<iq type='get' to='bot@gnu.mine.nu/panopticon' id='b1'>
	<query xmlns='jabber:iq:browse'/>
</iq>
```

The response will look something like this:

```xml
<iq type='result' from='bot@gnu.mine.nu/panopticon' to='dj@gnu.mine.nu/home' id='b1'>
	<panopticon xmlns='jabber:iq:browse' jid='bot@gnu.mine.nu/panopticon' name='The Panopticon'>
		<icon jid='bot@gnu.mine.nu/panopticon/2b8bf6a9e9a173f95f27ae1a8d6fb2f4'>
			<name>Blammo the Clown</name>
		</icon>
		<icon jid='bot@gnu.mine.nu/panopticon/3ab6c14732e8937cf26db26755c4aae7'>
			<name>Rael Dornfest</name>
		</icon>
		<icon jid='bot@gnu.mine.nu/panopticon/47e48c975621bf43fc81622265d47a31'>
			<name>Dan Gillmor</name>
		</icon>
		...
		<icon jid='bot@gnu.mine.nu/panopticon/deedbeef'>
			<name>#etcon bot</name>
		</icon>
	</panopticon>
</iq>
```

(I’d originally just returned each icon without the <name/> tag, but figured that that would probably be less than useful.)

You can ‘drill down’ with a further query (sent to the JID of the icon you’re interested in – remember, Jabber browsing is most effective when you can navigate a hierarchy of information via their nodes’ JIDs) like this:

```xml
<iq type='get' id='b2' to='bot@gnu.mine.nu/panopticon/2b8bf6a9e9a173f95f27ae1a8d6fb2f4'>
	<query xmlns='jabber:iq:browse'/>
</iq>
```

Which should hopefully elicit a response like this:

```xml
<iq type='result' to='dj@gnu.mine.nu/home' id='b2' from='bot@gnu.mine.nu/panopticon/2b8bf6a9e9a173f95f27ae1a8d6fb2f4'>
	<icon xmlns='jabber:iq:browse' jid='bot@gnu.mine.nu/panopticon/2b8bf6a9e9a173f95f27ae1a8d6fb2f4' id='2b8bf6a9e9a173f95f27ae1a8d6fb2f4'>
		<url>http://progressquest.com/expo.php?name=Blammo the Clown</url>
		<text>Mmm... Beer Elementals</text>
		<x>805</x>
		<y>494</y>
		<name>Blammo the Clown</name>
	</icon>
</iq>
```

This should reflect the latest information to be had on that avatar.


