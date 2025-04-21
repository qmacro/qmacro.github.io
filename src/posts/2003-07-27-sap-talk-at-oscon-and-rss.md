---
layout: post
title: SAP talk at OSCON, and RSS
date: 2003-07-27
tags:
  - sapcommunity
  - oscon
  - opensource
  - rss
---
We got a pretty good attendance at our [talk on SAP R/3 at OSCON](https://web.archive.org/web/20031211145311/http://conferences.oreillynet.com/cs/os2003/view/e_sess/3759) this year. We had people who were using R/3 in a corporate environment already, and people who were just curious about the famous ERP behemoth and what relation it had to Open Source. Well, plenty, these days, as we showed in the talk.

One of the sections in the talk was on producing [RSS](http://www.purl.org/rss/1.0/) from R/3. RSS? Isn’t that for weblogs? Sure, but it’s a general syndication and metadata format that lends itself to many purposes. In the company where I work, we’ve been producing RSS from R/3 for years – SD business data (sales orders, product proposals, material info).

When you look at RSS from 10000 feet, it’s pretty obvious why it lends itself so well to SAP data; the core document model is the same as the core document model in R/2 and R/3, namely a header and a number of positions, each of which can be embellished with domain-specific and compartmentalised data. And more recently, other people have been catching on to using RSS for business data. When you think about it, it’s a no-brainer. The most interesting news – just this week, is that Amazon is now offering RSS feeds for all sorts of business data. The penny is dropping, finally.

Here are a couple of recent articles on RSS and extensibility:

* [Extending RSS](https://www.xml.com/pub/a/2003/07/23/extendingrss.html)
* [Why Choose RSS 1.0?](https://www.xml.com/pub/a/2003/07/23/rssone.html)

---

[Originally published on SAP Community](https://blogs.sap.com/2003/07/27/sap-talk-at-oscon-and-rss/)
