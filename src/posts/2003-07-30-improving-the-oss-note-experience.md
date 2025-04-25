---
layout: post
title: "Improving the OSS note experience"
date: 2003-07-30
tags:
  - sapcommunity
---
I remember the time when OSS was a fledgling service, and it ran on an
R/2 system in Walldorf. You accessed it via the R/2 SAPGUI just as any
other R/2 system. It was great, and the volume of notes being generated
then (I remember particularly at the time I was working at Deutsche
Telekom in the early 90s)  was small enough that I could read each and
every note that was written on certain subjects that interested me. I
used to come in early in the morning, grab a coffee, and then browse the
new OSS notes. The systems were bigger, the note numbers had less
digits, and I had more hair.

Those were the days.

Anyway, many years later, we still have OSS notes. Higher note numbers
to be sure. But has the general OSS notes experience improved? Not that
much. While we now also have a web interface (via
[service.sap.com](http://service.sap.com)) in addition to the R/3 system
based access to OSS, that web interface could do with some love.

Wouldn't it be nice to be able to refer to an OSS note, and the note's
sub-sections, via first class URLs? So I could say, in some HTML (in a
Wiki, or in a weblog entry, or wherever) "refer to this note" and put
an HTTP link *direct to the note*, rather than tell the user how to go
through the rigmarole of searching for it and navigating the forest of
JavaScript, new windows, and frames, to get to what they're looking
for? How about something like:

```url
http://service.sap.com/oss/notes/12345
```

That would be great for starters! For authorisation, how about simple
but effective basic HTTP authentication? If you're going to use the web
(HTTP), embrace it, don't program around it.

And while we're at it - how about offering
[RSS](http://purl.org/rss/1.0) feeds of notes by component? That way, it
would be straightforward for people to keep up with OSS info using tried
and tested technology, and open tools that are out there right now.

For many SAP hackers like me, OSS is still a very important source of
info. Small improvements like this would make our lives a lot more
pleasant.

_The concept of a "first class URL" is of course from the *REST*ian (REpresentational State Transfer) view of the web. For more info, see the [REST Wiki](http://internet.conveyor.com/RESTwiki/moin.cgi/FrontPage)._

---

[Originally published on SAP Community](https://community.sap.com/t5/additional-blogs-by-members/improving-the-oss-note-experience/ba-p/12858080)
