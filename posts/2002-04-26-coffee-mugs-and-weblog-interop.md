---
layout: post
title: Coffee Mugs and weblog interop
---


In the same vein as the [experiment](http://www.pipetree.com:8080//?id=1018344359.94.16) with Peerkat, I’ve now exposed the feeds data for [Blagg](http://www.oreillynet.com/%7Erael/lang/perl/blagg) (which is the RSS aggregator mechanism I’m using with [Blosxom](http://www.oreillynet.com/%7Erael/lang/perl/blosxom)) as a list on the right hand side of the weblog here.

It’s very simple; [Blagg](http://www.oreillynet.com/%7Erael/lang/perl/blagg) uses a text file, rss.dat, to keep a list of RSS feeds that I want to subscribe to. I wrote a [simple script](http://www.pipetree.com/~dj/rss.pl) to read that information and to create a list file that I can then pull into the weblog template like the other lists here. Very simple. I’ll probably cron the script to run every so often, to keep the list up to date.

Now all I need to do is resurrect the [5335](file:///testwiki/5335) script so that I can other feed info inserted into (appended onto, probably) Blagg’s rss.dat file when I click one of those coffee mug icons.


