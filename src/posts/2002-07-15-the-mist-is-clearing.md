---
layout: post
title: The mist is clearing ...
---


… but I’m not sure yet whether what’s being revealed is a bright sun, a dense forest, or more mist. In any case, it’s an interesting journey, and on the whole, enlightening.

I’m trying to understand more about [REST](http://internet.conveyor.com/RESTwiki/moin.cgi/FrontPage "The REST Wiki's front page"). To that end, I’ve just written a little *RESTful* interface to [RT](http://www.fsck.com/projects/rt/ "RT: Request Tracker") (Request Tracker), in the form of an Apache mod_perl handler, so that I can create new and correspond on existing tickets via a simple interface that I can call from my other apps.

Creating a ticket:

```
POST /ticket
(queue, subject, email, and initial ticket query supplied in body)

...

201 Created
Location: /ticket/42
```

Corresponding on a ticket:

```
PUT /ticket/42
(correspondence supplied in body, will be appended to the ticket history)

...

200 OK
```

(Hmm, perhaps that should that be PUT to `/ticket/42/history`, returning a 201 with a unique URI for that particular piece of correspondence, e.g. `/ticket/42/history/20020715115442`).

Getting info on a ticket:

```
GET /ticket/42
or
GET /ticket/42/basics
or
GET /ticket/42/history

...

200 OK
(ticket info)
```

I’m glad I had my copy of the excellent [Writing Apache Modules with Perl and C](http://www.oreilly.com/catalog/wrapmod/ "Book's home on O'Reilly") close to hand, to remind me of things like `$r->custom_response()` and `Apache::Constants->export(qw(HTTP_CREATED))`.


