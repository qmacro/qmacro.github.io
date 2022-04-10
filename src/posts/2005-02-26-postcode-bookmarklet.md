---
layout: post
title: Postcode bookmarklet
tags:
- bookmarklet
- javascript
---


We’ve been spending time recently looking at [property](http://del.icio.us/qmacro/property) in the North West. I found myself often cutting and pasting a property’s postcode from the property particulars page into [Multimap](http://www.multimap.com/) to see exactly where it was.

I’d been meaning to get around to making that easier when I saw [Erik Benson](http://erikbenson.com/) point at [FlickReplacr](http://www.kokogiak.com/gedankengang/2005/02/flickr-toy.html), a cool bookmarklet toy. I had a look at the Javascript inside, and on seeing this bit,

> var g=window.getSelection();

I realised that it was exactly what I could use to make my postcode lookups smoother.

So herewith a little bookmarklet: [Postcode](javascript:location.href='http://uk.multimap.com/map/browse.cgi?pc='+encodeURIComponent(window.getSelection())). As with other bookmarklets, just drag this link to your toolbar; then whenever you see a postcode on a page, select it with the mouse, and click the bookmarklet.


