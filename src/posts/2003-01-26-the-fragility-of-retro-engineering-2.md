---
layout: post
title: The fragility of retro-engineering
---


I just discovered that while the [CPAN](http://www.cpan.org/) module [WWW::Amazon::Wishlist](http://search.cpan.org/author/SIMONW/WWW-Amazon-Wishlist-0.85/) pulled ASINs out of [amazon.co.uk](http://www.amazon.co.uk/)-based wishlists, it seems not to be able to find ASINs in [amazon.com](http://www.amazon.com/)-based ones. I guess that the HTML layout that the module is scraping has changed. Or at least the hrefs that the module is pulling the ASINs from.

While lamenting the fact that retro-fitting like this is like trying to put a wave into a box, I’ve made a second [patch to the module](/~dj/2003/01/Wishlist.pm.diff.txt) (the $url regex) so it can successfully find ASINs in U.S. wishlists too.

I wonder when/if we will see consumable wishlist data available directly from Amazon, a la [AllConsuming’s XML directory](http://allconsuming.net/xml) [? ]()


