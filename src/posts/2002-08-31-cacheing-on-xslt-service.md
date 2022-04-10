---
layout: post
title: Cacheing on XSLT service
---


To speed things up on the experimental [RSS-in-Mozilla-sidebar thingy](/2002/Aug/29#tech/sidebar "yesterday's musings on RSS, Mozilla, and Sidebars"), I’ve [added in some cacheing](/~dj/XSLTc.pm) (using a little MySQL db) to the [simple XSL-Transform service](../../../service/xslt) that’s used to transform RSS to HTML on the fly, for inclusion into the sidebar. It makes it a lot faster, obviously, and takes a bit of strain off our poor old Celeron. I’ve exposed the gubbins a bit, in that it’s possible to specify a ‘cachelife’ parameter on the call. So if you want to customise the URL passed in the sidebar.addPanel() call, you can send this now:

```
http://www.pipetree.com/service/xslt
?
xmlfile=*http://url/of/rss.feed*
&
xslfile=http://www.pipetree.com/~dj/rss.xsl
&
cachelife=30
```

The ‘cachelife’ parameter says “give me the cached version as long as it’s no more than N (30, here) minutes old … otherwise pull the RSS and transform it for me afresh, baby”. (It’s all explained briefly on a little homepage, which you [get](../../../service/xslt) if you don’t specify an xslfile or xmlfile parameter.)

The [existing sidebar button](/~dj/sidebar.html) will continue to work fine, in that a default of 60 (minutes) is assumed if no ‘cachelife’ parameter is specified.


