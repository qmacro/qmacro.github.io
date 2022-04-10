---
layout: post
title: Moving from description to content:encoded in my RSS 1.0 feed
---


After spotting a [comment](http://rdfig.xmlhack.com/2002/09/18/2002-09-18.html#1032346014.649371 "blogged comment on ") on [#rdfig](irc://irc.openprojects.net/rdfig) regarding the contents of my RSS 1.0 feed’s `<description>`, I decided to take the plunge and use the *draft* part of RSS 1.0’s [mod_content module](http://web.resource.org/rss/1.0/modules/content/ "RSS 1.0 mod_content module"), namely the **content:encoded** property, to hold the entity-encoded weblog item content. (The description element itself in core 1.0 is optional, and although I’m omitting it for now, I’m still uneasy about it – ideally I’ll have a text-only abstract and be a good RSS citizen).

This is something that [Jon](http://weblog.infoworld.com/udell/2002/09/09.html#a405 "Jon Udell"), [Sam](http://www.intertwingly.net/blog/2002/Sep/17#x828 "Sam Ruby") and others have done already. While [Timothy Appnel](http://tima.mplode.com/ "Timothy Appnel") asks a [good question](http://www.intertwingly.net/blog/828.html "Tim's question on Sam's site"), I’ll address it here at a later stage as [Blosxom](http://www.raelity.org/apps/blosxom) entity-encodes my HTML for me (i.e. there’s not much point trying to XSL-Transform it back).

So I have modified the [RSS 1.0 feed](../../../%7Edj/qmacro.rss10) for this site to use **content:encoded** with a [stylesheet slightly modified](/~dj/rss091-to-10.xsl) from [last time](../../2002/Sep/12#tech/rss/rss10).


