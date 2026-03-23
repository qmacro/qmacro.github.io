---
title: CDS expressions in CAP - notes on Part 4
date: 2026-03-30
tags:
  - cds
  - cap
  - cql
  - cxl
  - handsonsapdev
description: Notes to accompany Part 4 of the mini-series on the core expression language in CDS.
---

See the [series
post](/blog/posts/2025/12/09/a-new-hands-on-sap-dev-mini-series-on-the-core-expression-language-in-cds/)
for an overview of all the episodes.

<iframe width="560" height="315"
src="https://www.youtube.com/embed/XD71N7YYuGA?si=FpZVKtDS5xel3kPv"
title="YouTube video player" frameborder="0" allow="accelerometer; autoplay;
clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Introduction

[00:00](https://www.youtube.com/watch?v=XD71N7YYuGA&t=0s) Introduction and
recap from last time.

[07:00](https://www.youtube.com/watch?v=XD71N7YYuGA&t=420s) Patrice revisits
the syntax diagram and starts to explain the insignificant-looking but very
significant (in terms of power and utility) "ref" box in that diagram, which is
the start of our journey to understand path expressions.

In fact, the box label "ref" at the time this episode was being broadcast has
now been replaced with "path expression" in [the latest incarnation of the
syntax diagram in Capire](https://cap.cloud.sap/docs/cds/cxl#expressions-expr):

![The syntax diagram as it now exists in
Capire](/images/2026/03/syntax-diagram.png)

Selecting this box leads to the [Path Expressions
(ref)](https://cap.cloud.sap/docs/cds/cxl#ref) section of the CXL topic.


