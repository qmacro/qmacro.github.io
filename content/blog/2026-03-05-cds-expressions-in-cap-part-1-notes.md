---
title: CDS expressions in CAP - notes on Part 1
date: 2026-03-05
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

<iframe width="560" height="315" src="https://www.youtube.com/embed/aiE20i5BP70?si=xSpl4uDc8j0Y1jll" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Introduction

[00:00](https://www.youtube.com/watch?v=aiE20i5BP70&t=0s) Introductions.

[05:00](https://www.youtube.com/watch?v=aiE20i5BP70&t=300s) A first look at
expressions in the context of [the new Declarative Constraints
feature](https://pages.github.tools.sap/cap/docs/releases/2025/dec25#declarative-constraints).

## The family of CDS languages

[06:00](https://www.youtube.com/watch?v=aiE20i5BP70&t=360s) An overview of CDS and
the languages within the [CDS](https://cap.cloud.sap/docs/cds/) family (CDL &
CSN, CQL & CQN and CXL & CXN).

[07:05](https://www.youtube.com/watch?v=aiE20i5BP70&t=425s) A first look at the
"cxl-bookshop" project, specifically the entities and service definition.
Patrice compiled (with `cds compile db/schema.cds`) the schema level
definitions to show the relationship between the human-first
[CDL](https://cap.cloud.sap/docs/cds/cdl) (Conceptual Definition Language) and
the corresponding machine-first [CSN](https://cap.cloud.sap/docs/cds/csn) (Core
Schema Notation).

[11:38](https://www.youtube.com/watch?v=aiE20i5BP70&t=698s) Next in the CDS
language family overview is the human-first
[CQL](https://cap.cloud.sap/docs/cds/cql) (CDS Query Language) and
corresponding machine-first equivalent
[CQN](https://cap.cloud.sap/docs/cds/cqn) (CDS Query Notation). An example was
given in the context of a cds REPL session (started with `cds repl --run .`).
The example uses a postfix projection to specify the desired column (element),
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

[19:58](https://www.youtube.com/watch?v=aiE20i5BP70&t=1198s) The final language
pair, the human-first [CXL](https://cap.cloud.sap/docs/cds/cxl) (CDS Expression
Language) and the corresponding machine-first
[CXN](https://cap.cloud.sap/docs/cds/cxn) (CDS Expression Notation) (at this
point the CXL documentation in Capire was still under construction, but exists
now).

## A first look at expressions

[27:23](https://www.youtube.com/watch?v=aiE20i5BP70&t=1643s) Looking at very
simple expressions, trying out the (context-free) expression parser
`cds.parse.expr` to parse a CXL expression to the internal CXN
representation:

```javascript
> cds.parse.expr` 1 `
{ val: 1 }
```

Here's one with a binary operator (`+`), taking two operands:

```javascript
> cds.parse.expr` 1 + 1 `
{ xpr: [ { val: 1 }, '+', { val: 1 } ] }
```

<a name="annotation"></a>
[29:01](https://www.youtube.com/watch?v=aiE20i5BP70&t=1741s) An example in the
context of declarative constraints, where validation is added to a service
entity (which makes sense as they act as functional facets to the underlying
persistence layer), in particular, to the `stock` element of the `Books`
entity:

```cds
using {sap.capire.bookshop as my} from '../db/schema';

service AdminService {
  entity Books   as projection on my.Books;
  entity Authors as projection on my.Authors;
}

annotate AdminService.Books:stock with @assert: (
  case
    when stock < 0 then 'stock must not be negative'
    when stock > 1000 then 'stock exceeds maximum limit of 1000'
  end
);
```

Note that here we have:

- the `annotate` directive (CDL)
- the `@assert` annotation (also CDL)
- the `case ... when ... then ... end` expression (CXL)

There was a brief discussion on how [expressions in
annotations](https://cap.cloud.sap/docs/cds/cdl#expressions-as-annotation-values)
should be enclosed in parentheses (as used in this annotation example), which
also allows full compiler support and also code completion.

## Exercising the constraint in the cds REPL

[34:58](https://www.youtube.com/watch?v=aiE20i5BP70&t=2098s) First, an overview
of the entities:

```javascript
> Object.keys(AdminService.entities)
[
  'Books',
  'Authors',
  'Genres',
  'Genres.texts',
  'Currencies',
  'Currencies.texts',
  'Books.texts'
]
```

and then some destructuring to get the `Books` entity from the `AdminService`:

```javascript
{ Books } = AdminService.entities
[object Function]
```

Next, the construction of an INSERT query via the [fluent
API](https://cap.cloud.sap/docs/node.js/cds-ql#insert) (the statement is split
across multiple lines for readability; use the REPL's `.editor` command to
paste in these multiple lines if you're playing along):

```javascript
> insert = INSERT
.into(Books)
.entries(
  { ID:567, author_ID: 180, title: 'Foo', stock: -1 },
  { ID: 568, author_ID: 180, title: 'Foo 2', stock: 1001 }
)
```

which gives:

```javascript
cds.ql {
  INSERT: {
    into: { ref: [ 'AdminService.Books' ] },
    entries: [
      { ID: 567, author_ID: 180, title: 'Foo', stock: -1 },
      { ID: 568, author_ID: 180, title: 'Foo 2', stock: 1001 }
    ]
  }
}
```

<a name="invoking-run"></a>
> At this point, this query was `await`ed, with an unexpected result. That's
> because using `await` on a query object will by default invoke `db.run()`,
> sending that query object as an argument (i.e. `db.run(insert)` here).
> However, this `db` service is the "wrong" one - it's the persistence-layer
> database service, rather than the `AdminService` at which level we have our
> declarative constraint. This is why the insertion of the two new book records
> was successful (at
> [39:50](https://www.youtube.com/watch?v=aiE20i5BP70&t=2390s)).

Sending this to the `AdminService` to be executed:

```javascript
> AdminService.run(insert)
```

shows us the result of the constraint:

```javascript
> Uncaught [Error: MULTIPLE_ERRORS] {
  details: [
    {
      status: 400,
      code: 'ASSERT',
      target: 'stock',
      numericSeverity: 4,
      '@Common.numericSeverity': 4,
      message: 'stock must not be negative'
    },
    {
      status: 400,
      code: 'ASSERT',
      target: 'stock',
      numericSeverity: 4,
      '@Common.numericSeverity': 4,
      message: 'stock exceeds maximum limit of 1000'
    }
  ]
}
```

## Comparing entity definitions at different layers

[46:25](https://www.youtube.com/watch?v=aiE20i5BP70&t=2785s) A brief comparison
between the `Books` definition at the persistence ("db") level from
`cds.entities` and the `Books` definition in the `AdminService` at the service
("srv") level. This is effectively the difference between A and B where:

```cds
using {sap.capire.bookshop as my} from '../db/schema';

service AdminService {
  entity Books as projection on my.Books;
           ^                       ^
           |                       |
           B                       A
```

- A `my.Books` is from `sap.capire.bookshop` in `db/schema`
- B `Books` is the entity defined in `AdminService` as a projection on
  `my.Books` in A

Comparing the artifacts and their CSN shows differences that all make sense
(each of these comparisons shows A first, then B):

- the artifacts' `name` properties (`Books.name`) are different:
  `sap.capire.bookshop.Books` vs `AdminService.Books`
- reflecting this, the scope name prefixes are different in each reference,
  with A being `sap.capire.bookshop` and B being `AdminService`, for example:

  ```javascript
  author: Association {
    ...
    target: 'sap.capire.bookshop.Authors'
  }
  ```

  vs

  ```javascript
  author: Association {
    ...
    target: 'AdminService.Authors'
  }
  ```

- each association in the service level CSN has an additional annotation
  `@Common.ValueList.viaAssociation`, for example (although we didn't dwell on
  this at all):

  ```javascript
    genre: Association {
      type: 'cds.Association',
      target: 'AdminService.Genres',
      keys: [ { ref: [ 'ID' ], '$generatedFieldName': 'genre_ID' } ],
      '@Common.ValueList.viaAssociation': { '=': 'genre' }
    }
  ```

- as pointed out in the conversation, the service level CSN has an extra
  `projection` property, which makes sense given how this is defined:

  ```javascript
  projection: { from: { ref: [ 'sap.capire.bookshop.Books' ] } }
  ```

And perhaps most significantly:

- while the `stock` element at the persistence level is defined like this:

  ```javascript
  stock: Integer { type: 'cds.Integer' }
  ```

  the projected version, thanks to the [annotation](#annotation) applied
  specifically to `AdminService.Books:stock`, is defined like this (where can
  see the expression in CXN form):

  ```javascript
  stock: Integer {
    '@assert': {
      '=': "case when stock < 0 then 'stock must not be negative' when stock > 1000 then 'stock exceeds maximum limit of 1000' end",
      xpr: [
        'case',
        'when',
        { ref: [ 'stock' ] },
        '<',
        { val: 0 },
        'then',
        { val: 'stock must not be negative' },
        'when',
        { ref: [ 'stock' ] },
        '>',
        { val: 1000 },
        'then',
        { val: 'stock exceeds maximum limit of 1000' },
        'end'
      ]
    },
    type: 'cds.Integer'
  }
  ```

[57:44](https://www.youtube.com/watch?v=aiE20i5BP70&t=3464s) Patrice describes the
relationship between CXL, CQL and CDL in terms of "passenger" and "vehicle", in
that CXL expressions are "passengers" carried in the "vehicles" of CQL queries
and / or CDL definitions (such as annotations and element definitions); Patrice
illustrates this further by showing what a simple expression in CXL is parsed
to:

```javascript
> cds.parse.expr` author.books.genre.name `
{ ref: [ 'author', 'books', 'genre', 'name' ] }
```

and also notes that the value of the `ref` is interpreted depending on the
"vehicle" in which it is being carried.

## Further info

- Patrice also has [some great notes for this
  part](https://github.com/patricebender/cxl-bookshop/blob/main/notes/notes-session1.md).
