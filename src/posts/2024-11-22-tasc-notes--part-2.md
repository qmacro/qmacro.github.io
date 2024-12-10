---
layout: post
title: TASC Notes - Part 2
date: 2024-11-22
tags:
  - tasc
  - cap
  - cds
  - handsonsapdev
---
These are the raw, unedited notes I took to summarise [The Art and Science of CAP part 2][1], one episode in a mini series with Daniel Hutzel to explore the philosophy, the background, the technology history and layers that support and inform the SAP Cloud Application Programming Model. 

For all resources related to this series, see the post [The Art and Science of CAP][99].

---

<a name="schnapszahl"></a>
Capire docu overhaul, with a reworked "Getting Started" section, with times for completion in the classic capire [Schnapszahl][3] style (1-11 mins, 4-44 mins, etc).

Also a new CDS section [Aspect-oriented Modelling][4].

Plus a reworking of the "About CAP" guide (as it was too much like "promotional material") -> into a new Best Practices (and Bad Practices, or "Anti Patterns") guide, sort of like a "primer".

CAP takes inspiration and influence from many venerable places, incl. JavaScript, with AOP and functional programming, and even the core type system of CDS is taken from JavaScript too (prototype approach even better than class-baed approach).

Looked at one of the Bad Practices entries - Code Generator Tooling; discussed the pros but mostly cons of code generation, with the lesson that it's better to have code inside the framework, not in your own code base. Plus we saw how succinct CDS is, and how powerful in combination with the core services provided out of the box. Later Daniel says (referring to code written for you, in the framework) "each line of code not written ... is free of errors".

New concepts & design principles map for 10,000 metre view:

![key concepts diagram][2]

and for a way into the key concepts Domain Models, Services, Events, Querying, and Agnostic-By-Design ... and, added live, Data (business services are data centric in nature). 

Services-as-interfaces, services-are-interfaces. Even e.g. the database layers are services (we say "service" not "driver"). Everything is a service. And everything that happens is an event.

Events, .on(...), sync (request / response) and async (events) are effectively the same.

The "C" in CDL ... stands for Conceptual!

[1]: https://www.youtube.com/watch?v=gXsqOFArqCw&list=PL6RpkC85SLQAe45xlhIfhTYB9G0mdRVjI&index=3
[2]: https://cap.cloud.sap/docs/assets/key-concepts.drawio.FB4Z2Ypd.svg
[3]: https://de.wikipedia.org/wiki/Schnapszahl
[4]: https://pages.github.tools.sap/cap/docs/cds/aspects
[99]: /blog/posts/2024/12/06/the-art-and-science-of-cap/
