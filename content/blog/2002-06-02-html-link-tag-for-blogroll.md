---
date: 2002-06-02
title: HTML link tag for Blogroll
description: Social network scripting and blog rolls.
---
[Mark](http://diveintomark.org/) is doing some very interesting [social network scripting](http://diveintomark.org/archives/2002/06/02.html#social_networks) with a script that recursively follows and compiles bloggers’ blogrolls. It occurred to me, in the context of the RSS autodiscovery flurry earlier this week, to give such scripts a leg-up. Why not use a(nother) HTML `<link/>` tag to point to a blogroll?

So, alongside the `<link/>` tag I [mentioned](../../2002/May/31#htmllink) yesterday, I’ve added a further `<link/>` tag thus:

```xml
<link rel="feeds" type="text/xml"
  title="XML" href="http://www.pipetree.com/~dj/rss.rss" />
```

It points to the RSS file of RSS feeds I talked about yesterday, and point to with the "meta" link in the **My Feeds** list on the right.

This sort of thing should make scripts like Mark’s [blogrollfinder.py](http://diveintomark.org/projects/misc/blogrollfinder.py.txt) a lot simpler, if we can somehow standardise this too.
