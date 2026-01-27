---
date: 2002-05-09
title: 'Blaggplug: jabberconf'
description: Aggregation and publish/subscribe.
tags:
 - blogging
 - blagg
 - bloxsom
 - pubsub
 - meerkat
---

Q: What do you get when you cross [really simple
aggregation](http://www.oreillynet.com/%7Erael/lang/perl/blagg) with
[‘messaging to
spaces’](https://web.archive.org/web/20020320123910/http://radio.weblogs.com/0100887/2002/03/15.html)
and ideas of “poor man’s” pubsub?

A: The
‘[jabberconf](https://web.archive.org/web/20031213113655/www.pipetree.com/~dj/jabberconf.pl)‘
[Blaggplug](http://www.oreillynet.com/%7Erael/lang/perl/blagg/#blaggplugs) – a
plugin for [Blagg](http://www.oreillynet.com/%7Erael/lang/perl/blagg) that
pushes RSS item info to a Jabber conference room (akin to an IRC channel) as
they’re pulled in the aggregation process.

This idea goes back a long way, to my pre-Jabber days (!) when I was
experimenting with getting my business applications to write messages to IRC
channels and writing various IRC bots to listen out for and act upon specific
messages (carrying out simple processes, relaying messages to further channels,
and so on).

Just as HTTP-GET function call based apps — such as the ‘open wire service’
[Meerkat](https://web.archive.org/web/20000815061017/http://www.oreillynet.com/meerkat/),
and other RESTian applications (‘RESTful’ may twang too many antennae ;-) — are
both human and machine friendly, so is simple publish/subscribe via spaces.
Just as people (with browsers & URL lines), and applications (with HTTP
libraries) can get at HTTP-GET based information, so people (with Jabber
groupchat clients), and applications (with Jabber libraries), can get at
published data in open spaces such as Jabber rooms.

The
[plugin](https://web.archive.org/web/20031213113655/www.pipetree.com/~dj/jabberconf.pl)
is very raw, as I’ve just written it tonight and done some minimal testing
using my current feedlist.

Have fun!
