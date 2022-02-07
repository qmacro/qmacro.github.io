---
layout: post
title: Tiki parser for MoinMoin
tags:
- blosxom
- moinmoin
- tiki
- wiki
---


[Tim Appnel](http://www.mplode.com/tima/) recently created [TikiText](http://www.mplode.com/tima/archives/000215.html), a Wiki-like markup language for which [Rael](http://www.oreillynet.com/%7Erael/) recently created a [Blosxom plugin](http://www.raelity.org/archives/computers/internet/weblogs/blosxom/plugins/tiki.html). While theoretically interesting, I wasn’t sure how I’d get to know and be able to practise the new markup, as support for it exists currently only in an experimental [Perl module](http://www.mplode.com/tima/projects/tiki/tiki.tar.gz) to parse and format text that you supply to it.

I’m a keen user of the Python-based [MoinMoin](http://moin.sourceforge.net/) wiki (especially at work, where we manage our internal documentation and work collaboration with it), and the ‘natural environment’ for a wiki-like markup language is … in a Wiki. So I decided to mix up a bit of glue; I stuck Tim’s Perl Text::Tiki module into the Python MoinMoin wiki mechanism by writing a very quick and dirty parser, [tiki.py](/~dj/2003/02/tiki.py). Now I can practice the TikiText markup in my favourite Wiki environment; all I need to do is use a

#format tiki

declaration at the top of a Wiki page to have the glue kick in.

You can see it in action in the demowiki, specifically the [TikiTest](/demowiki/TikiTest) page. Have a look at the source (with the EditText link) to see the TikiText format.

Fun!


