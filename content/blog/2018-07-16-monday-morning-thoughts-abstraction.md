---
title: "Monday morning thoughts: abstraction"
date: 2018-07-16
tags:
  - sapcommunity
  - mondaymorningthoughts
---

*In this post, I think about abstraction, the power and facility it
affords, and consider CDS as one example of a modern abstraction
language.*

Last week I was chatting to some old friends. One of them had just
remarked that Google was now considered the world's fourth largest
hardware manufacturer. Some feat, considering hardware manufacture was
really only a by-product. I added to the conversation by offering my
memories of IBM being regarded, back in the mid to late 80's, as the
world's largest publisher. Again, some feat, considering publishing
documentation was a by-product of producing hardware and software.

## The early days

The happy memories from the early days of my career, memories of being
alone with the wonderfully detailed technical information in the
documentation room at work, with reference manuals as thick as your fist
hanging vertically from racks, like giant paper bats in a cathedral,
made me think of the early days of my work hacking on SAP R/2
implementations on the IBM mainframes running MVS/XA and IMS DB/DC.

One of a few aspects that I remember the most about R/2 was the fact the
assembler-based core of R/2 was, as far as I could see, a thing of
beauty (it's where I took my online nickname "qmacro" from, by the
way). In addition, there were subsystems and layers in R/2 that looked
like facilities on MVS and in IMS, but were different. The spooling
subsystem. The database layer. The job scheduling system. All facilities
that were available natively on the IBM platform. But abstracted. It
finally clicked when I got the chance to work on an R/2 system in
Germany that was based on Siemens hardware, running not MVS, but
[BS/2000](https://en.wikipedia.org/wiki/BS2000) - an operating system
from that hardware manufacturer. Everything seemed familiar, and the
facilities for spooling, job scheduling and accessing the database were
the same (and I had no idea how they worked natively on BS/2000).

Another aspect from early on in my SAP career was the young ABAP
language, built for writing reports. A key statement was "GET", which
took a segment identifier (the equivalent of a database structure at a
certain level - for example "GET MARA" relates to the retrieval of the
top level material master data). It took some time for me to realise
that the "GET" wasn't imperative; rather, it was the event-based hook
to declare some activity if and when MARA segments were made available,
by the underlying database read program. (If you want to read a little
more about how these GET statements were reactive rather than proactive,
have a look at this blog post from 2003: "[Food for thought: LDBs and
ABAP
Objects](/blog/posts/2003/11/13/food-for-thought-ldbs-and-abap-objects/)".)
Here too I experienced a level of abstraction, not having to worry about
how or where the data segments came from.

![](/images/2018/07/Screen-Shot-2018-07-16-at-09.31.47.png)

*Piet Mondrian's "Abstraction", from the collection of Kimbell Art
Museum, [via Google Arts &
Culture](https://artsandculture.google.com/asset/abstraction/agEBp4wD28aSfg)*

## A fundamental lesson

The common thread here is of course that the surface of interaction for
me and my colleagues was not tied to individual \-- and different \--
layers underneath. Once logged on, I could access data, write reports,
send report output to a printer, without knowing or caring about the
operating system or hardware underneath. The lesson I learned was that
abstraction is a powerful and empowering concept.

Since then I've been aware of abstraction layers, more consciously than
subconsciously. Everywhere I look, there are abstractions. Not just in
computing, but in life generally. I'm half tempted to talk about the
reasons why Unix became so popular, because of the portability afforded
to it by the C language, but I'll leave that for another time, perhaps.
Instead, I'll mention something that occurred to me on [my run this
morning](/tweets/qmacro/status/1018729969470582785/) instead.
The spoken word is also an abstraction. That seems obvious when you say
it out loud, as it were. But the concept of a common "high level"
language like English closely parallels programming languages. The
hardware, or wetware, upon which the language is eventually processed,
varies wildly (are intangible concepts are processed and understood the
same way in each of us, without us even being aware of the differences
between us?). Above this wild variation, however, the common level of
communication, of abstraction, is the language in which we speak\* to
each other.

\*I'm wondering if this language abstraction layer will change when we
eventually get direct access to each others brains, in a similar way to
how the soldiers in the [Old Man's
War](https://en.wikipedia.org/wiki/Old_Man%27s_War) science fiction
novel series communicate via their Brain Pals.

The thing that made me smile was the realisation that just as we have
dialects of English, so we also have dialects of programming languages.
Look at the myriad dialects of BASIC, or LISP, for example. A question
for us to ponder: languages that compile to other languages, like the
family of language like ClojureScript, TypeScript, Dart and Elm - are
they extreme dialects of JavaScript or something more?

Anyway, I digress.

## Core Data Services (CDS)

It's that subject again, isn't it? I was perusing the [CDS language
reference](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/855e00bd559742a3b8276fbed4af1008.html)
yesterday with an early morning coffee, and what struck me was the rich
expressiveness.

I'd already started to get acquainted with the various target
compilation flavours from early experimentation, such as compiling CDS
entity definitions from the [canonical Books, Authors and Orders entity
definitions](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/8e6468092318414391ac3f53e62a5c68.html) into
SQL statements to create a persistence layer in a traditional RDBMS
system:

```shell
i347491@C02W52RKHV2Q:~/local/projects/bookshop 
=> cds compile db/data-model.cds -2 sql
CREATE TABLE my_bookshop_Orders (
   ID nvarchar(36),
   book_ID integer,
   buyer nvarchar(111),
   date datetime,
   amount integer,
   PRIMARY KEY (ID)
); 

CREATE TABLE my_bookshop_Authors (
   ID integer,
   name nvarchar(111),
   PRIMARY KEY (ID)
); 

CREATE TABLE my_bookshop_Books (
   ID integer,
   title nvarchar(111),
   author_ID integer,
   stock integer,
   PRIMARY KEY (ID)
); 
i347491@C02W52RKHV2Q:~/local/projects/bookshop 
=> 
```

or even compiling the [corresponding service
definition](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/8e6468092318414391ac3f53e62a5c68.html) to
the Swagger OpenAPI format (I found a reference to "swgr" being an
output target by looking through the CDS compiler's source code):

```shell
i347491@C02W52RKHV2Q:~/local/projects/bookshop 

=> cds compile srv/cat-service.cds -2 swgr
CatalogService: 
  openapi: 3.0.0
  info: {version: "", title: CatalogService}
  paths: {}
  components: 
    schemas: 
      Books: 
        properties: 
          ID: {type: integer, format: int32}
          title: {type: string}
          author: {'$ref': "#/components/schemas/Authors"}
          stock: {type: integer, format: int32}
      Error: 
        required: [code, message]
        properties: {code: {type: integer, format: int32}, message: {type: string}}
      Authors: 
        properties: 
          ID: {type: integer, format: int32}
          name: {type: string}
          books: {type: array, items: {'$ref': "#/components/schemas/Books"}}
      Orders: 
        properties: 
          ID: {type: string, format: uuid}
          book: {'$ref': "#/components/schemas/Books"}
          buyer: {type: string}
          date: {type: string, format: date-time}
          amount: {type: integer, format: int32}
i347491@C02W52RKHV2Q:~/local/projects/bookshop 
=> 
```

Already we're seeing the power of abstraction at work here. CDS is a
language independent of the backend persistence layer (a service
provided by anything from HANA to SQLite) but also independent of the
service layer - given that OData is a key open protocols of choice, we
have EDMX as well as Swagger.

## An abstraction layer language for the cloud

But there's more. Like the English language with its various dialects,
CDS offers a rich and powerful expressiveness, with its
[annotations](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/4fab1e2be122466d83fd7b84676945de.html) and
[aspects](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/40582e7bbeca4311b0b165c8b9745094.html)
as two examples I would like to dig into and understand better.

It seems to me that as we move to the SAP Cloud Platform, as we embrace
the myriad tools, platforms, runtimes, procotols and techniques that
make themselves available to us, a rich seam of abstraction that allows
us to talk about, discuss, collaborate on and build (or generate)
components across the layers is very much something of value. And CDS
has all the makings of that abstraction.

It's been working well for us thus far (in the ABAP stack and beyond,
as se38 and many others have been saying for a while) and it can
continue to help us as we grow from our roots below ground, with stems
and blossoms reaching up to the clouds.

This post was brought to you today by a peaceful run through an east
Manchester dawn, and [Pact Coffee's Villa Rubiela
Espresso](https://www.pactcoffee.com/coffees/villa-rubiela-espresso).

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-abstraction/ba-p/13356245)
