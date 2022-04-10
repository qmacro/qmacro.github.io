---
layout: post
title: Standing on the shoulders ... Exploring Weblog Neighbourhoods with Blogdex
---


Inspired by [Mark](http://diveintomark.org/), and [Dave](http://www.scripting.com/), I’ve been doing a bit of neighbourhood exploration hacking of my own.

Last week, I was alerted to [Blogdex](http://blogdex.media.mit.edu/) by [Ben](http://www.benhammersley.com/) (through the funny little [Metalinker](http://www.thinkblank.com/metalinker/) Javascript-induced ‘[b]‘ links on his [RSS weblog](http://rss.benhammersley.com/) pages). It’s an interesting project that trawls weblogs and compiles link information (I don’t know how wide it trawls, so your URL might not be in there. YMMV).

I though I’d write a script to use Blogdex’s information and perhaps complement [Mark](http://diveintomark.org/)‘s [blogrollfinder.py](http://diveintomark.org/projects/misc/blogrollfinder.py.txt) script and [Dave](http://www.scripting.com/)‘s [weblogNeighborhood](http://radio.userland.com/weblogNeighborhood) tool. My script, [bdexp](/~dj/bdexp), compiles a ‘neighbourhood’ view of a weblog URL by following the ‘links to’ information for that URL in Blogdex. (This is the ‘browseSource’ Blogdex URL). You give it a weblog URL, and an optional depth (how far to descend, default 2 levels, maximum 4), and it goes away, pulls and analyses the information, and gives you a rank list of results. I’ve weighted the scores – the further ‘down’ a URL appears, the fewer points it gets.

I’ve “CGI’d” (ugh) my script so you can have a go too. Call it like this: [http://www.pipetree.com/~dj/cgi-bin/bdexp?url=//qmacro.org/about/](/~dj/cgi-bin/bdexp?url=//qmacro.org/about/) and have patience while the script descends Blogdex information and does its stuff. I’ve deliberately slowed the script down so it doesn’t hammer Blogdex’s servers. In fact, results are cached too, for added politeness :->

But wait – there’s more! So that the information made available through this script might be used to correlate, augment, and otherwise confuse neighbourhood information determined from other sources and methods like Mark’s and Dave’s, you can get XML output, rather than HTML. Just add *&xml=1* to the URL like this: [http://www.pipetree.com/~dj/cgi-bin/bdexp?url=//qmacro.org/about/&xml=1](/~dj/cgi-bin/bdexp?url=//qmacro.org/about/&xml=1) and you’ll get a very simple XML format containing the same data. This makes it dead easy to just pull in this Blogdex-powered neighbourhood information into your own tool. Well, that’s the theory anyway :-) (You can specify the depth with *&depth=N* too).

I’ve implemented a little lock mechanism so that only N users can use the script at once; I’m not sure how my server (it’s only a poor old Celeron), or Blogdex, will take to massive parallelism. Ok, this is wishful thinking, of course … hardly anyone reads this anyway… ;-)

Thank you Cameron at Blogdex for compiling this linking info.

Usual disclaimer applies – my code is just hacked together.


