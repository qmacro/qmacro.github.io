---
layout: post
title: TASC Notes - Part 3
date: 2024-11-29
tags:
  - tasc
  - cap
  - cds
  - handsonsapdev
---
These are the raw, unedited notes I took to summarise [The Art and Science of CAP part 3][1], one episode in a mini series with Daniel Hutzel to explore the philosophy, the background, the technology history and layers that support and inform the SAP Cloud Application Programming Model. 

For all resources related to this series, see the post [The Art and Science of CAP][99].

---

Talked about the [Nullish Coalescing Assignment][2] (`??=`) in JavaScript which was used in Daniel's most recent addition to the REPL code, and moved on to mentioning what the cache technique has been called in the past, from the (wonderful) Perl community: the "[Orcish Manoevre][3]" (Orcish ~= Or-Cache), coined by one of the authors of Effective Perl Programming, [Joseph Hall][27] (the other author was [Randal L. Schwartz][21]).

Looked at how AOP are also used in the core code too, with the specific example from `cds/lib/req/validate.js` and the core type system definitions (`class struct extends $any` ... `class Composition extends entity` ...) - base classes didn't have the behaviour, it's just added via aspects.

Took an overview over the upcoming Capire additions and changes, especially the Best Practices section. _These are all now available, by the way, in the [November 2024 release][4]!_[<sup>1</sup>](#footnotes)

In the context of the "Jumpstart & Grow As You Go" section, where we talked about the importance of "train-based development", Daniel mentioned Alastair Cockburn's [Hexagonal Architecture][5] design, a philosophy and approach which has informed CAP, plus, in passing, the [C2 Wiki][6], one of (if not the) first Wikis, created and invented by Ward Cunningham ("C2" stands for "Cunningham & Cunningham", btw) (see <https://wiki.c2.com/?DjAdams> too :-)). Ward was interviewed about his approach "Do the simplest thing that could possibly work", which I read out and recorded as [an episode on my Tech Aloud podcast][7].

Daniel then talked about the importance of knowing what CAP brings to the table, esp. in the Calesi context, allowing you to Focus On The Domain™️ rather than fight with the minutiae and administrivia of making your app or service work in the cloud, in a multitenancy context, and more, for each and every project you create.

In the Introduction - What is CAP? section, Daniel dwelled on the [Single Points To Fix][8] section, which is echoed also in reason 1 "The code is in the framework, not outside of it" of the blog post [Five reasons to use CAP][9]. Incidentally, looking at the "to be written" sections in Capire was a good reminder of the CAP team's wonderful "work in the open" approach.

Talking about AI (✅) Daniel drew the distinction between different generative AI coding facility behaviours, comparing the ad hoc code-assist features of e.g. Copilot, with the code generator feature which comes with a set of challenges down the line. Somewhere in the middle is the (long standing) idea of a stub generator, which is now also available in CAP with the November 2024 release in the form of [cds add handler][10]. Final point made in this AI context is that the clean and unsullied nature of CDS for declaring models, relationships and services is great for gen AI.

One of the subtle differences between ABAP CDS and CAP CDS is that the former is "view oriented", while the latter is "entity oriented".

Daniel explored the [cloud-cap-samples][11] repo on GitHub which is a great example of how to structure a set of multiple related services together

![samples][19]

In the context of the new and growing [Bad Practices][12] section of Capire, specifically in the context of "microservices mania" Daniel highlights the difference, the distinction, between small and focused CAP services, which are logical units of modular domain design, and microservices, which are units of deployment. The two might align, depending on your requirements, but don't have to, and are not connected.

Moving onto the [Best Practices][13] section, the "models fuel runtimes" diagram serves to illustrate, amongst other things, the abstract and agnostic approach that informs CAP's design:

![fuelling services][20]

(what Daniel describes here is related to the [DWIM][14] ("Do What I Mean") approach, the name for which was first coined by Warren Teitelman in [BBN Lisp][26], but popularised more recently in the Perl language and community.)

Daniel also quoted [Brad J Cox][15] (inventor of Objective C), specifically his description of inheritance, as "the art of describing something unknown in how it defers from something known" -> "a zebra is a horse with stripes".

There's a new section in Capire that describes the relationship between CDS and the domain languages (DSLs) such as CDL, CDN, CQL, CQN etc (which caused me to mention the [Sapir-Whorf Hypothesis][16] which describes how language constrains how folks think).

Data is important (which is why DAOs are bad), especially for extensibility, and why we should think of and treat our data as being (and remaining) _passive_. On this topic, a great talk by Clojure's creator Rich Hickey is [The Value Of Values][17], definitely recommended ... as is [Are We There Yet?][18].

Daniel started to address Marian's question on nested projections (like a sub-select in the select clause - not in the where clause), but we were running out of time, so thought we might dig in a little more in the next part, using the REPL of course, which Daniel used right at the end to illustrate some of CAP's DSLs, but also to underline the fact that CAP borrows from the functional programming philosophy, where functions are first class citizens (yes, and this is true in JavaScript by the way!), and here in CAP, _queries_ are first class citizens, in that they can be assigned to variables, passed around, etc.

(For an intro to FP and its beauty, you might want to check out [Function Programming Introduction: What, Why, How?][23], also [[SOT118] Functional programming - from LISP to JavaScript via Haskell][24], and, especially if you're a UI5 developer, [Functional Programming for your UI5 Apps][25]).

<a name="footnotes"></a>
## Footnotes

* In the sample code for the [New Plugin for RFC][22] section, did we miss an opportunity to combine history with the beloved [Schnapszahlen][28] - we could have used SAP system ID C11 instead of SYS, as C11 was the classic system ID example in early R/3 documentation.

[1]: https://www.youtube.com/watch?v=oujZD2xEUBM&list=PL6RpkC85SLQAe45xlhIfhTYB9G0mdRVjI&index=3
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment
[3]: https://www.nntp.perl.org/group/perl.beginners/2001/05/msg1250.html
[4]: https://cap.cloud.sap/docs/releases/nov24
[5]: https://alistair.cockburn.us/hexagonal-architecture/
[6]: https://wiki.c2.com/
[7]: https://creators.spotify.com/pod/show/tech-aloud/episodes/The-Simplest-Thing-that-Could-Possibly-Work--A-conversation-with-Ward-Cunningham--Part-V---Bill-Venners-e5dpts
[8]: https://cap.cloud.sap/docs/about/#single-points-to-fix
[9]: /blog/posts/2024/11/07/five-reasons-to-use-cap/
[10]: https://cap.cloud.sap/docs/releases/nov24#cds-add-handler
[11]: https://github.com/sap-samples/cloud-cap-samples
[12]: https://cap.cloud.sap/docs/about/bad-practices
[13]: https://cap.cloud.sap/docs/about/best-practices
[14]: https://en.wikipedia.org/wiki/DWIM
[15]: https://en.wikipedia.org/wiki/Brad_Cox
[16]: https://plato.stanford.edu/entries/linguistics/whorfianism.html
[17]: https://www.youtube.com/watch?v=-6BsiVyC1kM
[18]: https://www.youtube.com/watch?v=ScEPu1cs4l0
[19]: https://raw.githubusercontent.com/SAP-samples/cloud-cap-samples/main/etc/samples.drawio.svg
[20]: https://cap.cloud.sap/docs/assets/fueling-services.drawio.BtUmmaAI.svg
[21]: /blog/posts/2003/07/12/thanks-randal/
[22]: https://cap.cloud.sap/docs/releases/nov24#new-plugin-for-rfc
[23]: https://docs.google.com/presentation/d/1VWGEutu0o541a81GPCHG-pQ6IhX8TXC9WwM90JPtIwc
[24]: https://docs.google.com/presentation/d/1xgOHBFNOjg6dFz1qHkSpB9VVjKxgjkugoxo13wAZYU0
[25]: https://docs.google.com/document/d/1Nx2PFqObMtir0rSzjU804PAAVkC3j4lZTtfRRoLSocQ
[26]: https://en.wikipedia.org/wiki/BBN_LISP
[27]: https://en.wikipedia.org/wiki/Joseph_N._Hall
[28]: https://de.wikipedia.org/wiki/Schnapszahl
[99]: /blog/posts/2024/12/06/the-art-and-science-of-cap/
