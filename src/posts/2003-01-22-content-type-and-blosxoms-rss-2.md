---
layout: post
title: Content-Type and Blosxom's RSS
---


Agreeing with [Sam](http://www.intertwingly.net/) on [what content-type should be used for the weblog’s feed](http://www.intertwingly.net/blog/1142.html) (basically it should be whatever you specify in your [link tag for that feed](http://diveintomark.org/archives/2002/05/30/rss_autodiscovery.html)), last night I changed the appropriate [Blosxom](http://www.raelity.org/apps/blosxom) template file, *content_type.rss*, so that “application/rss+xml” would be sent out with the Content-Type header accompanying the <acronym title="Rich Site Summary">RSS</acronym> XML.

Unfortunately it broke the feed, in that none of the content was being entity-escaped (escaping of entities in <acronym title="Rich Site Summary">RSS</acronym> is of course a whole different story which I’ll leave for now). [Blosxom](http://www.raelity.org/apps/blosxom) decides whether to do entity-escaping if the content-type is “text/xml”. So I made a quick fix to the check, so that the content of any [flavour](http://www.raelity.org/apps/blosxom/flavour.shtml) whose content-type was anything ending in “Wxml” would be entity-escaped.

Funnily enough, I was only recently talking about *link rel=’…’* tags in [Presentations, Wikis, and Site Navigation](/undefined/) last night.

So apologies for those people whose readers may have choked on unescaped content for the past few hours from this site.


