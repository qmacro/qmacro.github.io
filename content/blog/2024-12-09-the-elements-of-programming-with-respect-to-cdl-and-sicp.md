---
title: The elements of programming with respect to CDL and SICP
date: 2024-12-09
tags:
  - sicp
  - cds
  - cap
  - cdl
---
CAP's language for expressing the domain model, the entities, their relationships, services, and more, is CDS's [Conceptual Definition Language (CDL)][1]. It's a language that I've been dwelling on a lot recently, the simplicity and power of which impresses me more every time I consider its design.

I came across a section of the classic SICP ([Structure and Interpretation of Computer Programs][2]) this evening, in Chapter 1 "Building Abstractions with Procedures". Specifically in section 1.1 "The Elements of Programming", it is stated:

> A powerful programming language is more than just a means for instructing a computer to perform tasks. The language also serves as a framework within which we organize our ideas about processes. Thus, when we describe a language, we should pay particular attention to the means that the language provides for combining simple ideas to form more complex ideas.

While this is written to sow the seeds for an introduction to the Lisp dialect Scheme (which is used as the language to illustrate and convey the ideas in SICP) I think it is also a very apt description for CDL.

CDL allows for the straightforward definition of entities, relationships, services and more. What it also allows for, however, is the ability to separate and organise those definitions (say, with model imports and the use of namespaces), breaking down large structures into simpler concerns (reconstituted when it matters with the compiler's ability to load, process and merge definitions from a controlled and flexible set of locations), managing complexity in modular form, and injecting characteristics in succinct ways (with the power of aspects, for example).

In the light of the current [Art and Science of CAP][3] series, I thought that was worth sharing.

[1]: https://cap.cloud.sap/docs/cds/cdl
[2]: https://en.wikipedia.org/wiki/Structure_and_Interpretation_of_Computer_Programs
[3]: /blog/posts/2024/12/06/the-art-and-science-of-cap/
