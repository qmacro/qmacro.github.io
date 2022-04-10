---
layout: post
title: Creating the "Entry index"
---


Often I’d be discussing something and remember that I’d written something about it on this weblog. Manually searching through the files that contain the weblog entry texts was more painful than I wanted. I decided to make an [Entry index](../../?flav=titles&num_entries=100) available – a simple list of weblog item titles in reverse date order, that I could search through.

With the power of [Blosxom](http://www.raelity.org/apps/blosxom), I managed to do it in 10 minutes. Using the ‘[flavour](http://www.raelity.org/apps/blosxom/flavour.shtml)‘ templating mechanism, I created a new flavour “titles” which I can then specify ([//qmacro.org/about/?flav=titles&num_entries=100](../../?flav=titles&num_entries=100)) when calling Blosxom to run over my file store. Wonderfully simple. And while I could put together a little mechanism to statically build such a list every 10 minutes or something (to save the CPU hit), I don’t want to, and don’t have to now that I’m not trying to render everything on the main weblog page.

The ‘titles’ flavour files are [here](/~dj/2003/01/titles/).

There was a bit of jiggery-pokery I had to perform to make it work how I wanted. First, Blosxom makes a decision on whether to insert the day/date subtitles in a weblog display based upon what content-type the flavour is. Because it decides to insert such subtitles when it sees ‘text/html’, and I don’t want Blosxom to insert the subtitles in the entry index, I set the [content-type for the titles flavour](/~dj/2003/01/titles/content_type.titles) to be ‘text/html;’.

Second, the number of entries that Blosxom displays is governed by a parameter in the code. But I wanted a different number of entries in the index than in the main weblog display. So I added a line:

param('num_entries') and $num_entries = param('num_entries');

near the start to allow me to pass the value in the URI.

Hey, it works, ok?

The ‘titles’ flavour files are [here](/~dj/2003/01/titles/).


