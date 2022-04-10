---
layout: post
title: Old feed URLs fixed with a bit of mod_rewrite voodoo
tags:
- apache
- feeds
- modrewrite
- web
---


As [feeds are the new blogs](http://identi.ca/notice/2941485) (quoting myself, oh dear!) I thought it important to make sure that the feed bots that have been continuously polling my weblog’s feed and getting 404s (since 2005, I guess) are sent to the right place. My Apache access.log file was showing that 404s were being returned for /index.rdf and /index.xml, and /qmacro/xml for that matter … all old locations for the weblog feed.

The power of HTTP, and the voodoo of [mod_rewrite](http://httpd.apache.org/docs/2.0/mod/mod_rewrite.html), allow me to fix things. Inserting these lines into the relevant .htaccess files does the trick:

RewriteRule ^index.(xml|rdf)$ /feed/atom/ [R=301,L]

RewriteRule ^xml$ /feed/atom/ [R=301,L]

Now the bots are redirected to this weblog’s [shiny new feed](/feed/atom/). And I’ll [try not to change the URL again](http://www.w3.org/Provider/Style/URI) :-)


