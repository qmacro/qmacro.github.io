---
layout: post
title: 'Sidebars, Mozilla, RSS: old and new'
tags:
- mozilla
- rdf
- rss-tag
- xul
---


Back in the spring of 2000, I wrote [MySidebar](/~dj/cgi-bin/mysidebar.pl "re-animated non-working bit of reminiscence"), a concoction of Mozilla sidebars, [XUL](http://www.xulplanet.com/) and RSS. It allowed you to specify an RSS URL and would generate XUL from it and install it in Mozilla’s sidebar. (XUL involves RDF. The interconnectedness of all things, eh?)

Fozbaca recently [pointed](http://fozbaca.org/archives/2002_08_17.shtml#002612) to something [similar](http://www.theonering.net/staff/corvar/software/mozilla.html), which reminded me about the whole thing. I’ve just downloaded Mozilla 1.1, and decided to revisit the area. Things have changed – you can now plonk straight HTML into the sidebar, rather than have to use XUL. Mmmm.

So, I’ve had a bit of fun glueing ideas I read about from [Mark](http://diveintomark.org/) and [Jon](http://udell.roninhouse.com/). What I’ve ended up with is a Mozilla toolbar button that you can click while viewing a weblog that [points to its own RSS feed](/2002/May/31#htmllink). The button’s link is to Javascript, adapted from Mark’s [auto-subscribe bookmarklet](http://diveintomark.org/archives/2002/05/31.html#more_on_rss_autodiscovery). On discovering an RSS feed (and the title of the blog page), it then constructs an XSLT pipeline URL that Jon [demonstrated last month](http://weblog.infoworld.com/udell/2002/07/17.html#a341). The URL looks like this (split up for easy reading):

```
http://www.pipetree.com/service/xslt
?
xmlfile=*http://url/of/rss.feed*
&
xslfile=http://www.pipetree.com/~dj/rss.xsl
```

The /service/xslt on pipetree is something very similar to the [W3C XSLT Service](http://www.w3.org/2001/05/xslt) that Jon used. I [wrote my own](/~dj/XSLT.pm) for various reasons. It’s a lot simpler, and probably a lot dafter. The XSLT stylesheet specified is a [very simple one](/~dj/rss.xsl) which points to some [even simpler CSS](/~dj/rss.css) to make the RSS-rendered-into-HTML … small enough to fit in Mozilla’s sidebar, into which it goes with the call to sidebar.addPanel() at the end of the [Javascript](/~dj/addtosidebar.js) where all this pipelining started out.

It’s not that efficient, probably not that useful in the long run, but is certainly fun and allows me to turn my Mozilla into a sort of RSS newsreader. If you want to have a go, you can drag the Javascript link from [here](/~dj/sidebar.html). Feel free to improve things!


