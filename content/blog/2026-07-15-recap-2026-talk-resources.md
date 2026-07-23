---
title: reCAP 2026 talk resources
date: 2026-07-15
tags:
  - cap
  - recap
  - talk
  - cxl
  - mocking
  - auth
  - messaging
  - pathexpressions
description: Resources related to our talk at reCAP 2026.
---

At [reCAP](https://recap-conf.dev/) this year, I was honoured to share a talk
slot with [Patrice
Bender](https://www.linkedin.com/in/patrice-bender-64a816118/), a good friend
and adjacent colleague from the CAP Compiler team, and cohost / copresenter on
the [Hands-on SAP Dev mini-series on the core expression language in
CDS](/blog/posts/2025/12/09/a-new-hands-on-sap-dev-mini-series-on-the-core-expression-language-in-cds/).

The [talk](https://recap-conf.dev/program.html) was titled **Expressions
and Abstractions - Two Developer Superpowers in CAP**, with the following
overview:

_Today we need to be more efficient and concise than ever, stop writing
code we don't need to, and avoid tasks that slow down our development
loops, letting the framework do the heavy lifting for us. In this
session we'll demonstrate two different affordances that enable that.
First, we'll show the power of expressions, what they are, how and
where they can be used, and why you should know about them. Then we'll
show how mocking abstracts us from the tedium and ceremony, allowing us
to iterate fast on data, auth, messaging and remote services during
development._

> Whether you watched the talk at reCAP in person, or remotely, please consider
> filling in the short [feedback
> form](https://docs.google.com/forms/d/e/1FAIpQLSc88GKiyicSBTOmM8Hgl5wPoVC8Tvc9WbiaHfa3sg9itPRiFg/viewform?pli=1).
> Thanks!

Here are some resources relating to the two parts.

## Expressions

The demo resources used in this part of the talk are available in the repo
[cxl-bookshop](https://github.com/patricebender/cxl-bookshop) that is an
extended bookshop you can clone, open in `cds repl`, and use to try everything
shown live.

The talk is based on the 7-part Hands-on SAP Dev mini-series [Under the hood:
CDS Expressions in
CAP](https://youtube.com/playlist?list=PL6RpkC85SLQCEU8XcyqnA5wYEZGxMPm6B),
with our written notes accompanying it, starting with [Part
1](https://qmacro.org/blog/posts/2026/03/05/cds-expressions-in-cap-notes-on-part-1/).
For the reference, including syntax diagrams that show what an expression can
contain, see [the CXL topic in
Capire](https://cap.cloud.sap/docs/cds/cxl#expressions-expr).

## Abstractions

The demo resources used in this part of the talk are available in the repo
[cap-nodejs-local-first-development](https://github.com/qmacro/cap-nodejs-local-first-development).

The [Local-first dev with CAP
Node.js](/blog/posts/2026/05/11/local-first-dev-with-cap-node-js/) series
of blog posts covers mocking of
[data](/blog/posts/2026/05/11/local-first-dev-with-cap-node-js-mocking-data/),
[auth](/blog/posts/2026/05/12/local-first-dev-with-cap-node-js-mocking-auth/),
[remote
services](/blog/posts/2026/05/13/local-first-dev-with-cap-node-js-mocking-remote-services/)
and
[messaging](/blog/posts/2026/05/15/local-first-dev-with-cap-node-js-mocking-messaging/).

In the content for the CodeJam [A hands-on tour of
CAP](https://github.com/SAP-samples/cap-tour-hands-on) there are deep and
detailed dive exercises on [mocking
auth](https://github.com/SAP-samples/cap-tour-hands-on/blob/main/exercises/01/README.md)
and [mocking
messaging](https://github.com/SAP-samples/cap-tour-hands-on/blob/main/exercises/02/README.md).
At the end of each of these exercises are plenty of links to further
information including resources in [Capire](https://cap.cloud.sap/docs/).
