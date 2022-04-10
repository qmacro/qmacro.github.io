---
layout: post
title: Accessibility and Blosxom
---


Catching up with things today, I read what [Mark](http://diveintomark.org/)‘s been doing on the accessibility front. A great job it is too. I thought I might contribute a tiny bit of the jigsaw for the [Blosxom](http://www.oreillynet.com/%7Erael/lang/perl/blosxom) users, specifically regarding the [meaningful page titles](http://diveintomark.org/archives/2002/06/19.html#day_8_constructing_meaningful_page_titles) and [additional navigation aids](http://diveintomark.org/archives/2002/06/20.html#day_9_providing_additional_navigation_aids).

I’ve updated my weblog in these two areas; each specific page – be it a year, or a year/month, or a year/month/day specification, now includes the appropriate date in the page title. I’ve added a `<link rel=”home” … >` link too, which I’d thought fleetingly about when I was [looking at other attributes of the <link/> tag](../../2002/Jun/3#newlinks) but had forgotten until being reminded by Mark.

To achieve this sort of thing, you can just add the extra bits in the **head.html** template. I’ve taken Blosxom’s default/builtin head template (which is inside Blosxom itself) and amended it appropriately – you can have see what it looks like [here](/~dj/head.txt) – to use it, just place the file in same directory that you keep your .txt files.

In actual fact, I use Blosxom more of an engine that generates the blog postings for me, which I then include, via SSI, in a template that holds together lots of elements, such as the calendar, and the various lists. So I don’t use the **head.html** template file. Instead, I wrote a tiny script, [blostitle](/~dj/blostitle), which outputs the appropriate date string for appending to the title. I include the ```<link rel=”home” … >``` link manually in the SSI. Altogether, the ```<head/>``` part looks like this:

```
 ...
<title> DJ's Weblog - <!--#include virtual="/~dj/cgi-bin/blostitle" --> </title>
<!--#include file="style.incl" -->
<link rel="home" title="Home" href="/qmacro" />
...
```


