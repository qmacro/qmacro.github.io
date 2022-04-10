---
layout: post
title: Small Blagg mod to enable custom formatting of 'blaggregated' items
---


Well, further to the little [formatting blaggplug](/2002/06/02/slamwedge) I wrote yesterday to reformat the blaggregated items for my [Morning Reading](../../../cgi-bin/blosxom/djnews), I decided to go a step further and add a tiny template mechanism to Blagg so that this sort of formatting change could be done in-the-style-of [Blosxom](http://www.oreillynet.com/%7Erael/lang/perl/blosxom), that is, by allowing [Blagg](http://www.oreillynet.com/%7Erael/lang/perl/blagg) to format the items as before, or overriding that format using an HTML file in my [Blosxom](http://www.oreillynet.com/%7Erael/lang/perl/blosxom) blog directory.

So in the same way that Blosxom users can tune the format of the stories by maintaining a *story.html* file in their blog directory, now I can tune the format of items that Blagg spits out, by maintaining a *blaggitem.html* file in the same directory.

Of course, this is an unofficial mod to Blagg, but if you’re interested, it’s [here](/~dj/blagg.0+4i.templatemod), and for those with a ‘diff’ bent, the differences to the original 0+4i version are highlighted [here](/~dj/blagg.0+4i.templatemod.diff) (the diff also highlights the passing of the extra $i_fn parm in the call to blaggplug::post(), as well as config variable changes peculiar to me).


