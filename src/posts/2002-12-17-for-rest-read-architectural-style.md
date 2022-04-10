---
layout: post
title: For REST, read 'Architectural Style'
---


In the swirling mass of memes surrounding web services (whatever they are) it’s sometimes easy to forget that [REST](http://internet.conveyor.com/RESTwiki/moin.cgi/FrontPage "The REST Wiki's front page") is an architectural style, an approach, rather than something that you install or debug. If nothing else, it’s become useful as a framework in which I can think more clearly about web-based projects and their interfaces. Thinking in terms of a limited number of verbs (methods) with well-defined and widely understood semantics, combined with a set of ‘objects’ (represented by URIs) certainly helped me come up with a clear idea of what I should code, and how it should appear to the outside world, in a couple of recent projects.

What’s really interesting is that a pattern is emerging. The interface description table in my ‘working notes’ (aka final documentation :-) that I’ve written to describe the details of the latest project bear a remarkable resemblance to the table in the [RESTful RT experiment](/space/RtRest) and also the one in [Joe](http://www.bitworking.org/)‘s [RESTlog interface](http://wellformedweb.org/RESTLog.cgi/5). For each interaction, they each roughly show:

- the HTTP verb
- the URI
- what the payload to be sent is (and its content-type) if any
- what the expected response is (HTTP status and pertinent headers)
- what the payload to be expected back is (and its content-type) if any
- what possible error responses there might be

Incidentally, [Piers](http://www.piersharding.com/) (my partner in code crime) has just written about the [client-end](http://www.piersharding.com/article.xml?mhttp) of one of the RESTful projects at work.

I discovered a nice RESTful bonus when doing the documentation too – I could link directly to the URLs of some of the services from within my (HTML/Wiki-based) documentation, to show examples. That’s turning out to be very useful.


