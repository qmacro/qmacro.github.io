---
layout: post
title: RSS aggregators and user-agent information for Blagg
tags:
- aggregators
- blosxom
- etag
- rss-tag
- wget
---


Prompted by a [post](http://writetheweb.com/Members/edd/Articles/2003-02-rss) on the re-awakened [WriteTheWeb](http://www.writetheweb.com/), I made a small mod to [Blagg](http://www.oreillynet.com/%7Erael/lang/perl/blagg) so that more detailed information is sent in the [User-Agent header](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.43) – announcing that the RSS aggregator ‘blagg’ is the agent requesting the RSS feed.

Following it’s sibling [Blosxom](http://www.raelity.org/apps/blosxom)‘s philosophy of simplicity and reuse of existing tools, Blagg uses ‘wget’ (or ‘curl’) to make the HTTP call. Adding the appropriate option to the string in $get_prog, e.g. by changing from this:

my $get_prog = 'wget --quiet -O -';

to this:

my $get_prog = 'wget -U 'blagg/0+4i (wget)' --quiet -O -';

was all that it took.

(In fact, personally I’m using my [ETag-aware version of wget](/2002/05/24/etag-enabled-wget/) so I made the change in that small script, [wget.pl](/~dj/wget.pl) rather than in Blagg itself.)


