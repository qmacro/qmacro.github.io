---
layout: post
title: Your wishlist in 'consumable' XML
---


While [experimenting](/2003/01/25/transferring-my-amazon-wishlist-to-allconsumingnet-2/) with wishlist data, it occurred to me that it might be desirable to have one’s wishlist exposable directly from a URL, and in a consumable format. This would lend itself quite nicely to [URL](http://udell.roninhouse.com/bytecols/2002-03-27.html) [pipelining](/2002/08/29/sidebars-mozilla-rss-old-and-new/).

I hacked up a very simple module, [WWW::Amazon::Wishlist::XML](/~dj/2003/01/WWW_Amazon_Wishlist_XML.pm) (keeping to the original namespace in CPAN) which acts as an Apache [handler](/~dj/2003/01/wishlist.conf) so you can plug your wishlist ID (mine’s [3G7VX6N7NMGWM](http://www.amazon.co.uk/exec/obidos/wishlist/3G7VX6N7NMGWM/026-9291044-8526042)) in and get some basic XML out, in a simple HTTP GET request.

Here’s an example:

[http://www.pipetree.com/service/wishlist/uk/3G7VX6N7NMGWM](../../../service/wishlist/uk/3G7VX6N7NMGWM)

Note the ‘uk’ part in the path. It signifies that the wishlist is held at [amazon.co.uk](http://www.amazon.co.uk/). If held at [amazon.com](http://www.amazon.com/), specify ‘com’, like this:

[http://www.pipetree.com/service/wishlist/com/11SZLJ2XQH8UE](../../../service/wishlist/com/11SZLJ2XQH8UE)

It uses the [patched](../../../%7Edj/2003/01/Wishlist.pm.diff.txt) version of [WWW::Amazon::Wishlist](http://search.cpan.org/author/SIMONW/WWW-Amazon-Wishlist-0.85/) so should be ok for now with .com-based wishlists too. Of course, it’s experimental anyway (as are most of the things I post here) and is likely to explode without warning.


