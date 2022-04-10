---
layout: post
title: RSS's underlying structure, and meta-RSS.
---


I’ve been pondering the nature of RSS, the lightweight syndication and feed format which is a heavy contender for the most talked-about XML format these days (uh, I suppose this post goes some way to help the cause too :-).

So what about RSS? What makes it so appealing? Well, a big reason is of course its position as a foundation of stability (despite its own temporary [instability](http://rss.benhammersley.com/archives/000051.html#000051), format-wise), in the burgeoning, nay, *blossom*ing, world of weblogs, syndication, and knowledge sharing. But I’ve been wondering if it’s more than that. It’s a simple format. But a powerful one. The RSS skeleton reflects an information model that can be found everywhere: header and body. You could say header and items. *Items*. *Positions*. What’s the fundamental structure of pretty much every piece of (business) transactional data in [SAP](http://www.sap-ag.de/) (and other ERM) systems? A document. A document, which has a header, and items, or ‘positions’. Sales orders, invoices, purchase requisitions… the list goes on. Hmmm. Could it be that the RSS skeleton is so popular and flexible because it’s one of the netspace’s protean formats, and easy to grok?

[RSS 1.0](http://purl.org/rss/1.0/) celebrates that flexibility with it’s [modular](http://purl.org/rss/1.0/modules/) approach.

*I’m* celebrating that with a ‘meta’ RSS feed, available from the [[meta]](../../../%7Edj/rss.rss) link in the **My Feeds** list on the right hand side of this page. It’s a list of all the feeds I’m subscribed to right now, in an RSS 1.0 format. Currently, I’m just using core tags, but it might be a better idea to create a simple module to enable an explicit statement of what the data is. (I know there’s [OCS](http://internetalchemy.org/ocs/) too, but hey, it’s Friday).


