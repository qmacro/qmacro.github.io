---
layout: post
title: Weblogs and Wikis - Blurring the Boundaries
tags:
- weblogs
- wiki
---


Early this morning [Rael](http://www.oreillynet.com/%7Erael/)‘s [Blosxom](http://www.raelity.org/apps/blosxom) plugin ‘[wikiwordish](http://www.raelity.org/apps/blosxom/plugins/text/wikiwordish.html)‘ found its way to the [plugin registry](http://www.raelity.org/apps/blosxom/plugins). And a very nice plugin it is too. It allows you to use ‘wikiwordish’ notation like [[this]] to point to other weblog entries; the plugin intercepts them and creates a suitable hyperlink to the right place. For example, I can refer to an older entry about the Tiki parser for MoinMoin by just typing the name of the entry (‘tikiparser’) inside double square brackets; in other words, [[tikiparser]] in my weblog item source gets turned into this: [[tikiparser]].

I decided to expand on this lovely idea, by adding some more functionality to the plugin. With my [expanded version of ‘wikiwordish’](/~dj/2003/03/wikiwordish) ([diff here](/~dj/2003/03/wikiwordish.diff)) it is now possible to have [InterWiki](http://twistedmatrix.com/users/jh.twistd/moin/moin.cgi/InterWiki) style links automatically recognised and expanded too. (I also made a modification to the regex in *story()*, as it wasn’t behaving quite right). So I can refer to the, say, StartingPoints page of the [MeatBall Wiki](http://www.usemod.com/cgi-bin/mb.pl?) by using a link in my weblog entry like this: [[MeatBall:StartingPoints]], which would be turned into a link like this: [[MeatBall:StartingPoints]].

The way it works is simple: you tell the plugin where to find an InterWiki ‘intermap’ file, which contains a list of InterWiki names and URLs. You can probably find this somewhere in your wiki installation. You can also add your own name/URL combinations in the configuration in case you’re not allowed to edit the intermap file; in my setup I’ve added the name ‘PipeSpace’ to refer to my MoinMoin-powered [space](../../../space) Wiki (see the ‘Configurable Variables section’ in the [code](../../../%7Edj/2003/03/wikiwordish)), so I can now create a link such as this: [[PipeSpace:AllConsumingRestIdeas]] which is turned into this: [[PipeSpace:AllConsumingRestIdeas]]. If you don’t want an icon to appear next to the link, you can turn that off in the configuration.

What’s more, some standard [InterWiki](http://twistedmatrix.com/users/jh.twistd/moin/moin.cgi/InterWiki) links are not to wikis, but to other popular sites; for example [[IMDB:0088846 Brazil]] gives [[IMDB:0088846 Brazil]], and [[Dictionary:alliteration]] gives [[Dictionary:alliteration]].

Fun! Here’s to more weblog/wiki fusion.


