---
title: CDS expressions in CAP - notes on Part 1
date: 2026-03-02
tags:
  - cds
  - cap
  - cql
  - cxl
  - handsonsapdev
description: Notes to accompany Part 1 of the mini-series on the core expression language in CDS.
---

See the [series
post](/blog/posts/2025/12/09/a-new-hands-on-sap-dev-mini-series-on-the-core-expression-language-in-cds/)
for an overview of all the episodes.

[00:00](https://www.youtube.com/live/aiE20i5BP70?t=0s) Introductions.

[05:00](https://www.youtube.com/live/aiE20i5BP70?t=300s) A first look at
expressions in the context of [the new Declarative Constraints
feature](https://pages.github.tools.sap/cap/docs/releases/2025/dec25#declarative-constraints).

[06:00](https://www.youtube.com/live/aiE20i5BP70?t=360s) An overview of CDS and
the languages within the [CDS](https://cap.cloud.sap/docs/cds/) family (CDL &
CSN, CQL & CQN and CXL & CXN).

[07:05](https://www.youtube.com/live/aiE20i5BP70?t=425s) A first look at the
"cxl-bookshop" project, specifically the entities and service definition.
Patrice compiled (with `cds compile db/schema.cds`) the schema level
definitions to show the relationship between CDL (human) and the corresponding
CSN (machine).

[11:38](https://www.youtube.com/live/aiE20i5BP70?t=698s) Next in the CDS
language family overview is CQL (CDS Query Language). An example was given in
the context of a cds REPL session (started with `cds repl --run .`). The
example uses a postfix projection to specify the desired column (element),
instead of the more SQL-like `SELECT title from Books` (the resulting query is
the same):

```javascript
> q = cds.ql` SELECT from Books { title }`
cds.ql {
  SELECT: {
    from: { ref: [ 'Books' ] },
    columns: [ { ref: [ 'title' ] } ]
  }
}
```

This shows the CQL and the corresponding CQN.
