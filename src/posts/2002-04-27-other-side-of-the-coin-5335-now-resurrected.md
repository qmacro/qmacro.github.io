---
layout: post
title: 'Other side of the coin: 5335 now resurrected'
---


To complement the [script](/~dj/rss.pl) that allows me to share my feed list with others, including [Radio Userland](http://radio.userland.com/) users (with the coffee mug link), I’ve now written a simple pair of scripts which do the equivalent of the [5335](../../../testwiki/5335) script mentioned earlier.

The point of the 5335 link is that the target is 127.0.0.1, that is, localhost. This time, I didn’t want to run a script of any significant size on my localhost; rather, I thought that if I could just run a simple *redirector*, which I could configure and get to redirect calls to 127.0.0.1:5335 to a location of my choosing, I’d be able to concentrate running the ‘complicated’ (relative term) part of adding a feed to [Blagg](http://www.oreillynet.com/%7Erael/lang/perl/blagg)‘s rss.dat, on the host that serves my weblog.

So [5335-redir.pl](/~dj/5335-redir.pl) is a simple, configurable redirector, which I run on my localhost, and [bladder](/~dj/bladder) is the script that receives a feed URL (via the redirector) and adds it to rss.dat.

Very simple. In the spirit of [Blosxom](http://www.oreillynet.com/%7Erael/lang/perl/blosxom) and [Blagg](http://www.oreillynet.com/%7Erael/lang/perl/blagg), I hope.

Here’s a step-by-step list of what happens:

1. I click on a coffee mug link next to a feed reference that I want to add to my aggregator.
2. The link points to http://127.0.0.1:5335/…. and 5335-redir.pl catches the request.
3. The request is redirected by 5335-redir.pl to bladder, running on my weblog host.
4. Bladder simply adds the feed reference (sent in the redirected link) to Blagg’s rss.dat file.
5. The rss.pl script comes along on it’s regular cron way and rebuilds the My Feeds list and the newly added feed appears there.


