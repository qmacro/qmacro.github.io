---
layout: post
title: HTML LINK to RSS source
---


I’m doing my bit for the weblog community domino effect. [Mark](http://diveintomark.org/), and others, have [added <link/> tags to their weblog HTML](http://diveintomark.org/archives/2002/05/30.html#rss_autodiscovery), to point to the RSS feeds for the respective weblogs. I think this is a good idea, so have done it too in this, my [Blosxom](http://www.oreillynet.com/%7Erael/lang/perl/blosxom)-powered weblog.

I do remember sitting in on an RSS BOF at last year’s [OSCON](http://conferences.oreillynet.com/os2002/) where we discussed the idea of having an index.rss at the website’s root, rather like the robots.txt file. This <link/> based pointing is a nicer approach, as there’s an explicit relationship between the RSS XML and what it describes.

What’s more, Mark has a [nifty bit of Javascript](http://diveintomark.org/archives/2002/05/31.html#more_on_rss_autodiscovery) that grabs any RSS URL that it finds in this new <link/> home, and bungs it at [Radio Userland](http://radio.userland.com/)‘s localhost-based webserver invoking a subscribe on that RSS feed. Very nice. I don’t run RU, nor use IE much, but nevertheless this would work, even with Blosxom, because I’m running [bladder](../../2002/Apr/27#5335-redir) :-)


