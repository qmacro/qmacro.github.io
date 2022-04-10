---
layout: post
title: Tinkering with RSS and NNTP
---


RSS via NNTP is certainly not a new concept – I first read about the idea on [Matt Webb](http://interconnected.org/home)‘s site almost [three years ago](http://interconnected.org/notes/syndication.html). More recently there’s been mention over at Jon’s ([Crossing the bridge of weak ties](http://weblog.infoworld.com/udell/2003/01/10.html)), and Ben’s ([RSS to NNTP](http://www.benhammersley.com/archives/003441.html#003441) and [HEP Messaging Server](http://www.benhammersley.com/archives/003081.html#003081)).

This week, Ben had [mentioned](http://www.benhammersley.com/archives/003935.html#003935) the [Panopticon](http://actuallyworks.com/panopticon/) in reference to the forthcoming [ETCON](http://conferences.oreilly.com/etcon). During last year’s, I had [hacked](/2002/05/15/the-panopticon/) [around](/2002/05/15/jabber-browsing-the-panopticon-data/) with the Panopticon, creating a sort of [Jabber](http://www.jabber.org/)-based information diffusion service to lighten the load on the Panopticon mechanism’s single source socket.

With all the talk of lightening the load from RSS consumers, my thoughts turned from these Panopticon experiments to NNTP, as of course it’s a technology that is designed for information diffusion, and bearing and sharing load. I couldn’t resist a bit of tinkering with NNTP, partly to follow up a little bit myself on RSS to/via NNTP, but mostly in fact to re-acquaint myself with the wonderfully arcane configuration of the majestic beast that is [inn](http://www.isc.org/products/INN/). In addition, there’s been talk recently of aggregators moving out of the realms of satellite applications and into the browser itself. The [Blagg](http://www.oreillynet.com/%7Erael/lang/perl/blagg) and [Blosxom](http://www.raelity.org/apps/blosxom) powered [Morning Reading](/cgi-bin/blosxom/djnews) page – my personal (but open) news aggregator – is already web-based, so I thought I’d have a look in the other direction.

Aided partly by Jon’s [Practical Internet Groupware book](http://allconsuming.net/item.cgi?isbn=1565925378) and partly by the man pages, I put together a simple [configuration](/space/InnConfig) for a server that I could locally post weblog posts to as articles.

As I saw it, there are two approaches to newsgroup article creation in this context, and each has its pros and cons.

<dl><dt>*Send items from all weblogs to the same newsgroup*</dt><dd>This approach means that the’aggregation effect’ (stories from different weblogs) is explicit, as the posts in a single newsgroup are sourced from different RSS feeds, and you read them sequentially. [You can see this effect in the screenshot, in the highlighted public.test newsgroup (shortened to "p.test")]. It also means, however, that such a ‘collective’ newsgroup is going to be less useful for diffusion and load sharing as it’s specific to one (or a few) person’s [feed](/~dj/rss.rss) tastes.</dd><dt>Send items from each weblog to a separate newsgroup</dt><dd>While the ‘aggregation effect’ is still available (by using the newsreader’s “read next unread” function, which will normally jump from one newsgroup to the next), it’s not as in-your-face. However, with a single newsgroup for each RSS feed, there are tremendous possibilities for NNTP peer exchange of (RSS weblog item) articles and consequently load sharing in the consumption of RSS – because picking and choosing feeds remains possible at the right (newsgroup) granular level. That said, this approach doesn’t exclude the possibility of composite newsgroups which consisted of, say, finance news feeds, or feeds in similar categories, which would be interesting to more than one person.</dd></dl>After deliberation of such matters, I then wrote a very simple plugin for [Blagg](http://www.oreillynet.com/%7Erael/lang/perl/blagg), which would post each weblog item to one or more newsgroups. For my purposes, I solved the question of what to call each newsgroup by using the ‘nickname’, required for each feed, in Blagg’s **rss.dat** file which controls the aggregation activity.

![Screenshot of Mozilla newsreader reading aggregated RSS items](/~dj/2003/01/nntp.png "viewing aggregated RSS-sourced news in the HTML-capable Mozilla newsreader")

The plugin is called [nntp](/~dj/2003/01/nntp.pl). I modified Blagg slightly so it would pass the nickname to the plugin. My version of Blagg 0+4i is [here](/~dj/2003/01/blagg.0+4i) (it has a number of other modifications too). Feel free to take the plugin and modify it to suit your purpose. It was only a bit of twiddling, but it seems to work.

There are plenty of possibilities for experimentation: combining the various [weblog trackbacking mechanisms](http://www.benhammersley.com/archives/003862.html#003862) with NNTP article IDs to link articles together in a thread; replying (to the newsgroup) to an article might send a comment to the post at the source weblog. Hmmmm…


