---
layout: post
title: 'YARM: Yet Another Referers Mechanism'
---


I’ve been reading what some people have been thinking and doing about referers and backlinking:

- [http://www.disenchanted.com/dis/linkback.html](http://www.disenchanted.com/dis/linkback.html)
- [http://www.oreillynet.com/pub/a/webservices/2002/05/03/udell.html](http://www.oreillynet.com/pub/a/webservices/2002/05/03/udell.html)
- [http://diveintomark.org/archives/2002/04/20.html#automatic_linkbacks](http://diveintomark.org/archives/2002/04/20.html#automatic_linkbacks)
- [http://radio.weblogs.com/0101221/2002/05/06.html#a197](http://radio.weblogs.com/0101221/2002/05/06.html#a197)

([Leslie](http://www.decafbad.com/) has been doing stuff too, but his main site is suffering an outage at the moment and I can’t get to the right link – get well soon, 0xDECAFBAD!). While reading, I’ve been playing around a bit too, and have a little [script](http://www.pipetree.com.wstub.archive.org/%7Edj/lpwc) which is fed a ‘tail’ed access_log and looks for referers, grabbing the titles of their pages if possible (using an [Orcish maneuver](http://perl.plover.com/yak/hw1/Hardware-notes.html#_Orcish_Maneuver_)-like mechanism to cache page titles and be a good HTTP citizen).

I run this script in the background:

nohup tail -f access_log | perl [lpwc](/~dj/lpwc) >refer.list 2>refer.log &

and then periodically pull the last ten unique referers and create a nice list that I can then SSInclude in this weblog:

uniq refer.list | tail | perl referers.pl > referers.incl

If nothing else, it reminds me of how powerful *nix command line tools and the humble pipe can be.


