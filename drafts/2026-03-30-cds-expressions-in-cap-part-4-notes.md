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

## Some syntactic sugar for the case-when-then-else-end expression

[10:08](https://www.youtube.com/watch?v=XD71N7YYuGA&t=608s) Patrice revisits
the `CASE ... WHEN ... THEN ... ELSE ... END` expression, which [we looked at
first in part
2](/blog/posts/2026/03/09/cds-expressions-in-cap-notes-on-part-2/#the-case-when-then-else-end-expression)
but for which there's some nice syntactic sugar.

He starts with passing a simple CXL example to the context-free parser
(`cds.parse.expr`), which emits the corresponding CXN:

```javascript
> cds.parse.expr`
  case when stock > 10 then 'non-seller' else 'sells quickly' end
  `
{
  xpr: [
    'case',
    'when',
    { ref: [ 'stock' ] },
    '>',
    { val: 10 },
    'then',
    { val: 'non-seller' },
    'else',
    { val: 'sells quickly' },
    'end'
  ]
}
```

Using the syntactic sugar, Patrice then shows us that we can write the same
expression using a construct familiar in JavaScript and other languages:

```javascript
> cds.parse.expr`
  stock > 10 ? 'non seller' : 'sells quickly'
  `
{
  xpr: [
    'case',
    'when',
    { ref: [ 'stock' ] },
    '>',
    { val: 10 },
    'then',
    { val: 'non seller' },
    'else',
    { val: 'sells quickly' },
    'end'
  ]
}
```

This version of the CXL expression is actually exactly the same in the internal
(CXN) machine-readable form. Not only that, but this `? :` is nestable too:

```javascript
> cds.parse.expr`
  stock > 10
  ? (price > 50 ? 'expensive non seller' : 'cheap non seller')
  : 'sells quickly'
  `
{
  xpr: [
    'case',
    'when',
    { ref: [ 'stock' ] },
    '>',
    { val: 10 },
    'then',
    {
      xpr: [
        'case',
        'when',
        { ref: [ 'price' ] },
        '>',
        { val: 50 },
        'then',
        { val: 'expensive non seller' },
        'else',
        { val: 'cheap non seller' },
        'end'
      ]
    },
    'else',
    { val: 'sells quickly' },
    'end'
  ]
}
```

## A closer look at the predicate expressions

[15:15](https://www.youtube.com/watch?v=XD71N7YYuGA&t=915s) The last thing that
Patrice talks about before jumping into path expressions is the collection of
predicates, which [we very briefly noted in the previous
episode](blog/posts/2026/03/23/cds-expressions-in-cap-notes-on-part-3/#functions-cast-and-predicates).

First, we look at the `BETWEEN` predicate, by first considering an compound
expression that describes a closed interval, to check for stock between 10 and
30:

```javascript
> cds.parse.expr`
  stock >= 10 and stock <= 30
  `
{
  xpr: [
    { ref: [ 'stock' ] },
    '>=',
    { val: 10 },
    'and',
    { ref: [ 'stock' ] },
    '<=',
    { val: 30 }
  ]
}
```

Here we have two binary operator based expressions (with the comparison
operators `>=` and `<=`) that are joined with (and become the operands for)
another binary operator, the logical operator `and`.

In contrast, there's the range checking operator `between`, which we can use
instead:

```javascript
> cds.parse.expr`
  stock between 12 and 34
  `
{
  xpr: [ { ref: [ 'stock' ] }, 'between', { val: 12 }, 'and', { val: 34 } ]
}
```

Not only is this a single expression, it is also much neater and (arguably)
easier to read as well as write.

Here's that expression in action, in a query:

```javascript
> await cds.ql`
  select from Books { title, stock } where stock between 12 and 34
  `
[
  { title: 'Mistborn: The Final Empire', stock: 12 },
  { title: 'The Two Towers', stock: 14 }
]
```

There's also the `not` variant which is also available.

[20:30](https://www.youtube.com/watch?v=XD71N7YYuGA&t=1230s) Next up is `IN`,
which Patrice first demonstrates in an abstract way with:

```javascript
> cds.parse.expr` (1, 2, 3) in (select ID from Books)`
{
  xpr: [
    { list: [ { val: 1 }, { val: 2 }, { val: 3 } ] },
    'in',
    {
      SELECT: {
        from: { ref: [ 'Books' ] },
        columns: [ { ref: [ 'ID' ] } ]
      }
    }
  ]
}
```

but then goes on to show the operator employed in a more practical example:

```javascript
> q = cds.ql`
  select from ${Books} { title, stock }
  where (author.ID) in
    (select ID from ${Authors} where dateOfDeath is null)
  `
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Books' ] },
    columns: [ { ref: [ 'title' ] }, { ref: [ 'stock' ] } ],
    where: [
      { ref: [ 'author', 'ID' ] },
      'in',
      {
        SELECT: {
          from: { ref: [ 'sap.capire.bookshop.Authors' ] },
          columns: [ { ref: [ 'ID' ] } ],
          where: [ { ref: [ 'dateOfDeath' ] }, 'is', 'null' ]
        }
      }
    ]
  }
}
```

Here, the `ID` of the `author` association (via `author_ID`, effectively) is
matched to the set of values from the `(select ID from ...)` subquery:

```javascript
> await q
[
  { title: 'Mistborn: The Final Empire', stock: 12 },
  { title: 'The Well of Ascension', stock: 8 },
  { title: 'The Hero of Ages', stock: 5 },
  { title: 'The Alloy of Law', stock: 67 },
  { title: 'Shadows of Self', stock: 89 },
  { title: 'The Bands of Mourning', stock: 134 },
  { title: 'The Lost Metal', stock: 156 },
  { title: 'Mistborn: Secret History', stock: 98 },
  { title: 'The Way of Kings', stock: 7 },
  { title: 'Words of Radiance', stock: 4 },
  { title: 'Edgedancer', stock: 125 },
  { title: 'Oathbringer', stock: 3 },
  { title: 'Dawnshard', stock: 142 },
  { title: 'Rhythm of War', stock: 6 },
  { title: 'Wind and Truth', stock: 2 }
]
```

Moreover, the expression `(author.ID)` could have been written as `author.ID`
i.e. as a path expression, rather than a path expression within a list context,
which Patrice explains at
[24:45](https://www.youtube.com/watch?v=XD71N7YYuGA&t=1485s), and also
clarifies at [27:59](https://www.youtube.com/watch?v=XD71N7YYuGA&t=1679s) that
the subquery is indeed an expression (it is, according to the syntax diagram) -
a "query expression".

## A first look at path expressions

There's also the `EXISTS` predicate which we will want to take a look at, but
because this is most often found in use with path expressions, Patrice takes us
on our first excursion to explore their power and utility, starting at
[29:30](https://www.youtube.com/watch?v=XD71N7YYuGA&t=1770s), with a simple
example (some results omitted for brevity here):

```javascript
> q = cds.ql`SELECT from ${Authors} {name as author, books.title }`
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Authors' ] },
    columns: [
      { ref: [ 'name' ], as: 'author' },
      { ref: [ 'books', 'title' ] }
    ]
  }
}
> await q
[
  { author: 'Emily Brontë', books_title: 'Wuthering Heights' },
  { author: 'Charlotte Brontë', books_title: 'Jane Eyre' },
  { author: 'Edgar Allen Poe', books_title: 'Eleonora' },
  { author: 'Edgar Allen Poe', books_title: 'The Raven' },
  { author: 'Richard Carpenter', books_title: 'Catweazle' },
  { author: 'Brandon Sanderson', books_title: 'Dawnshard' },
  { author: 'Brandon Sanderson', books_title: '...' },
  { author: 'Brandon Sanderson', books_title: 'Words of Radiance' },
  { author: 'J. R. R. Tolkien', books_title: 'Beren and Lúthien' },
  { author: 'J. R. R. Tolkien', books_title: '...' },
  { author: 'J. R. R. Tolkien', books_title: 'Unfinished Tales' }
]
```

This is a "flat" list, i.e. all of the authors + book combinations.

To help our understanding, Patrice then highlights the diagram specifically for
[path expressions](https://cap.cloud.sap/docs/cds/cxl#path-expressions-ref),
which looks like this:

![path expression syntax diagram](/images/2026/03/path-expression-syntax-diagram.png)

## A brief digression on the term "forward declared join"

At this point ([32:30](https://www.youtube.com/watch?v=XD71N7YYuGA&t=1950s))
I'm unable to resist surfacing a phrase that is also used in this context, and
that is "forward declared join", which Daniel Hutzel and I touched upon [in
part 9 of The Art and Science of
CAP](/blog/posts/2025/02/21/tasc-notes-part-9/#whats-in-a-name). Patrice nicely
explains what this term is, and how the concept it represents, is present in
the model that we're using, for example in the definition of the `Authors`
entity (some elements omitted here for brevity):

```cds
entity Authors : managed {
  key ID            : Integer;
      name          : String(111) @mandatory;
      books         : Association to many Books
                        on books.author = $self;
}
```

The "on condition" for the `books` element definition is a sign that some
correlation is going to be involved (as Patrice rightly points out, correlation
is at the heart of any RDBMS); what's more, that correlation connecting
`Authors` to `Books` is defined ahead of time, before any actual manifestation
of the `JOIN` mechanism that will be required to realise the correlation.

## Digging deeper into path expressions

Turning back to the path expression we had in `SELECT from ${Authors} {name as
author, books.title }`,
Patrice had pointed out that this query is not directly possible (in its current,
simple form) in SQL, as `books.title` traverses a path from one entity to
another.

Indeed, at [36:07](https://www.youtube.com/watch?v=XD71N7YYuGA&t=2167s) we see
what this query is going to become by using the `forSQL()` method on the query
object, where we see a `LEFT JOIN` is planned in the `SELECT` specification, in
this SQL-style CQN version of the query:

```javascript
> q.forSQL()
cds.ql {
  SELECT: {
    from: {
      join: 'left',
      args: [
        { ref: [ 'sap.capire.bookshop.Authors' ], as: 'Authors' },
        { ref: [ 'sap.capire.bookshop.Books' ], as: 'books' }
      ],
      on: [
        { ref: [ 'books', 'author_ID' ] },
        '=',
        { ref: [ 'Authors' , 'ID' ] }
      ]
    },
    columns: [
      { ref: [ 'Authors' , 'name' ], as: 'author' },
      { ref: [ 'books', 'title' ], as: 'books_title' }
    ]
  }
}
```

Note that the name of the association element `books` becomes the alias for the
target of the traversal.

So here we're seeing the time element of a forward declared join i.e. a path
expression, in that the join is manifested "just in time". By the way, with
`toSQL()` we can see that the actual database engine specific SQL (SQLite in
this case) looks like this (with the `json_insert` removed):

```sql
SELECT
  Authors.name as author,
  books.title as books_title
FROM
  sap_capire_bookshop_Authors as Authors
  left JOIN sap_capire_bookshop_Books as books
    ON books.author_ID = Authors.ID
```

## Association-like calculated element

[40:16](https://www.youtube.com/watch?v=XD71N7YYuGA&t=2416s) Building on this
knowledge and what we learned last week, Patrice now adds a further element to
the `Authors` entity definition:

GOT TO 42:00
