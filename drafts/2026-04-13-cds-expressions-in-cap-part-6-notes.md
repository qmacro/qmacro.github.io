---
title: CDS expressions in CAP - notes on Part 6
date: 2026-04-13
tags:
  - cds
  - cap
  - cql
  - cxl
  - handsonsapdev
description: Notes to accompany Part 6 of the mini-series on the core expression language in CDS.
---

See the [series
post](/blog/posts/2025/12/09/a-new-hands-on-sap-dev-mini-series-on-the-core-expression-language-in-cds/)
for an overview of all the episodes.

<iframe width="560" height="315"
src="https://www.youtube.com/embed/OPOH3agULQ0?si=OGKgMWDVcOp8fRQO"
title="YouTube video player" frameborder="0" allow="accelerometer; autoplay;
clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Introduction

[00:00](https://www.youtube.com/watch?v=OPOH3agULQ0&t=0s) Introduction and
recap.

[05:47](https://www.youtube.com/watch?v=OPOH3agULQ0&t=347s) Patrice takes over
and looks at the [syntax diagram in the CXL topic of
Capire](https://cap.cloud.sap/docs/cds/cxl#expressions-expr) and the specific
[path expression
diagram](https://cap.cloud.sap/docs/cds/cxl#path-expressions-ref). He remarks
that one of the cool things about path expressions is that you can chain
navigations together, as is shown in one of the examples that follow the
diagram:

```text assoc[filter].struct.assoc.element ```

Such navigation paths are materialised at some point (on use) into constructs
such as:

- an `EXISTS` subquery
- a `LEFT JOIN`
- a correlated subquery (for the expands)

These path expressions in particular (as well as CXL in general) can be used
everywhere; Patrice gives examples:

- in CDL models (when defining the schema or service projections)
- in annotation expressions (when referring to a path or element)
- in queries (written in CQL)

[10:26](https://www.youtube.com/watch?v=OPOH3agULQ0&t=626s) As good things come
in threes, or so they say, here's a final three-bullet point list (making a
total of three lists, too), where Patrice enumerates the different contexts in
which we used the `nonSeller` association-like calculated element (`nonSeller =
books[ stock > 170 ]`), in the previous episode:

- with [the `EXISTS`
  predicate](/blog/posts/2026/04/07/cds-expressions-in-cap-notes-on-part-5/#digging-into-the-condition)
- in [path expressions in the column
  list](/blog/posts/2026/04/07/cds-expressions-in-cap-notes-on-part-5/#using-a-path-expression-in-the-column-list)
- in a [nested
  expand](/blog/posts/2026/04/07/cds-expressions-in-cap-notes-on-part-5/#nested-expands)
  construct

[12:29](https://www.youtube.com/watch?v=OPOH3agULQ0&t=749s) We get a glimpse
behind the scenes at the `@cap-js/db-service` mechanisms, where Patrice shows
the function that is used to generate aliases, in the context of the new (to us
in this series) style of aliases shown in the normalised, intermediate
CAP-style SQL:

```javascript
> cds.ql`
  SELECT from ${Authors}
  {name}
  where exists nonSeller
  `.forSQL()
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Authors' ], as: '$A' },
    columns: [ { ref: [ '$A', 'name' ] } ],
    where: [
      'exists',
      {
        SELECT: {
          from: { ref: [ 'sap.capire.bookshop.Books' ], as: '$n' },
          columns: [ { val: 1 } ],
          where: [
            {
              xpr: [
                { ref: [ '$n', 'author_ID' ] },
                '=',
                { ref: [ '$A', 'ID' ] }
              ]
            },
            'and',
            { xpr: [ { ref: [ '$n', 'stock' ] }, '>', { val: 170 } ] }
          ]
        }
      }
    ]
  }
}
```

These `$`-prefixed short alias names are "technical" aliases. There's a
function that Patrice dives into, specifically `getImplicitAlias` in
`@cap-js/db-service/lib/utils.js`, that has a `useTechnicalAlias` parameter
which defaults to `true`.

> At this point we'll make the transition to having these technical aliases
> shown in our CAP-style SQL, as shown in this example, instead of the
> human-centric ones we've had so far.

## Looking at the genres entity definition

[16:02](https://www.youtube.com/watch?v=OPOH3agULQ0&t=962s) Patrice takes some
time to explain the reason for the technical aliases, using the recursively
structured `Genres` entity definition as an example:

```cds
entity Genres : sap.common.CodeList {
  key ID       : Integer;
      parent   : Association to Genres;
      children : Composition of many Genres
                   on children.parent = $self;
}
```

Querying the genre information in Patrice's sample project we see the general idea:

```javascript
> await cds.ql`
  SELECT from ${Genres}
  { name, parent { * } }
  `
[
  { name: 'Fiction', parent: null },
  { name: 'Drama', parent: { name: 'Fiction', descr: null, ID: 10, parent_ID: null } },
  { name: 'Poetry', parent: { name: 'Fiction', descr: null, ID: 10, parent_ID: null } },
  { name: 'Fantasy', parent: { name: 'Fiction', descr: null, ID: 10, parent_ID: null } },
  { name: 'Science Fiction', parent: { name: 'Fiction', descr: null, ID: 10, parent_ID: null } },
  { name: 'Romance', parent: { name: 'Fiction', descr: null, ID: 10, parent_ID: null } },
  { name: 'Mystery', parent: { name: 'Fiction', descr: null, ID: 10, parent_ID: null } },
  { name: 'Thriller', parent: { name: 'Fiction', descr: null, ID: 10, parent_ID: null } },
  { name: 'Dystopia', parent: { name: 'Fiction', descr: null, ID: 10, parent_ID: null } },
  { name: 'Fairy Tale', parent: { name: 'Fiction', descr: null, ID: 10, parent_ID: null } },
  { name: 'Non-Fiction', parent: null },
  { name: 'Biography', parent: { name: 'Non-Fiction', descr: null, ID: 20, parent_ID: null } },
  { name: 'Autobiography', parent: { name: 'Biography', descr: null, ID: 21, parent_ID: 20 } },
  { name: 'Essay', parent: { name: 'Non-Fiction', descr: null, ID: 20, parent_ID: null } },
  { name: 'Speech', parent: { name: 'Non-Fiction', descr: null, ID: 20, parent_ID: null } }
]

```

To help visualise the genre hierarchy, here it is [represented in a tree
structure](/blog/posts/2026/03/03/genres-cuids-and-a-bit-of-awk/):

```text
/tmp/genres/
├── Fiction
│   ├── Drama
│   ├── Dystopia
│   ├── Fairy Tale
│   ├── Fantasy
│   ├── Mystery
│   ├── Poetry
│   ├── Romance
│   ├── Science Fiction
│   └── Thriller
└── Non-Fiction
    ├── Biography
    │   └── Autobiography
    ├── Essay
    └── Speech
```

## An introduction to scoped queries

[16:44](https://www.youtube.com/watch?v=OPOH3agULQ0&t=1004s) At this point
Patrice introduces us to "scoped queries", where we can traverse the `FROM`
with a path expression like construct:

```javascript
> await cds.ql`
  SELECT from ${Genres}:parent
  { name }
  `
[
  { name: 'Fiction' },
  { name: 'Non-Fiction' },
  { name: 'Biography' }
]
```

Here's another "wait, what's this and what's going on?!" moment in this series
:-)

Let's have a look at the CQN:

```javascript
> q = cds.ql`
  SELECT from ${Genres}:parent
  { name }
  `
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Genres', 'parent' ] },
    columns: [ { ref: [ 'name' ] } ]
  }
}
```

The value for `from` looks very much like a path expression - a `ref` with a
value that is an array of multiple elements `[ 'sap.capire.bookshop.Books',
'parent' ]`.

Next, let's have a look at the CAP-style SQL:

```javascript
> q.forSQL()
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Genres' ], as: '$p' },
    columns: [ { ref: [ '$p', 'name' ] } ],
    where: [
      'exists',
      {
        SELECT: {
          from: { ref: [ 'sap.capire.bookshop.Genres' ], as: '$G' },
          columns: [ { val: 1 } ],
          where: [
            { ref: [ '$G', 'parent_ID' ] },
            '=',
            { ref: [ '$p', 'ID' ] }
          ]
        }
      }
    ]
  }
}
```

Taking a moment to [staring at
this](/blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/#initial-recognition)
the mist starts to clear. Looking at this intermediate form, we see:

- there's an `EXISTS` clause that's been reified
- the "lead" and "related" entities involved are the same, here (`Genres`)
- the main query retrieves the genre name
- the subquery returns something based on a condition that correlates a
  relationship within this single entity
- that condition is that the ID of the genre whose name we're retrieving in the
  main query ... matches a parent ID value, at least once

In other words, retrieve the genres that are parents (i.e. that have children).

This can be stretched out to another path level, to retrieve genres that are
"grandparents" (i.e. that are parents of parents):

```javascript
> q = cds.ql`
  SELECT from ${Genres}:parent.parent
  { name }
  `
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Genres', 'parent', 'parent' ] },
    columns: [ { ref: [ 'name' ] } ]
  }
}
```

Another path expression in the `from`. This returns just a single result in the set:

```javascript
> await q
[
  { name: 'Non-Fiction' }
]
```

This makes sense, as we can see in the tree structure earlier, `Non-Fiction` is
the only genre that is a parent of a parent:

```text
/tmp/genres/
...
└── Non-Fiction
    ├── Biography
    │   └── Autobiography
    ├── Essay
    └── Speech
```

### Further examples of scoped queries

I initially struggled with this example as, illustrative as it was (especially
with the `parent.parent` part), it was one that was a little self-referential.
So I used the power and utility of the cds REPL to explore more, and things
started to make sense. For example, this query gives us the genres for books
written by authors 40 years old or younger (Carpenter and the two Brontë
sisters):

```javascript
> q = cds.ql`
  SELECT from Authors[age <= 40]:books.genre
  { name }
  `
cds.ql {
  SELECT: {
    from: {
      ref: [
        {
          id: 'Authors',
          where: [ { ref: [ 'age' ] }, '<=', { val: 40 } ]
        },
        'books',
        'genre'
      ]
    },
    columns: [ { ref: [ 'name' ] } ]
  }
}
> await q
[
  { name: 'Drama' },
  { name: 'Romance' },
  { name: 'Mystery' }
]
```

Again we have a path expression traversal happening in the `from` part of the
query, this time with an infix filter on the first part of the path. I used an
infix filter here to make the example a little more interesting.

I then wondered to myself what it would look and feel like to use an infix
filter on a different part of the path, and came up with this:

```javascript
> q = cds.ql`
  SELECT from ${Authors}:books[title like 'The %'].genre
  { name }
  `
cds.ql {
  SELECT: {
    from: {
      ref: [
        'sap.capire.bookshop.Authors',
        {
          id: 'books',
          where: [ { ref: [ 'title' ] }, 'like', { val: 'The %' } ]
        },
        'genre'
      ]
    },
    columns: [ { ref: [ 'name' ] } ]
  }
}
```

This produces the names of the genres of books that begin with the definite article ("The ..."):

```javascript
> q = cds.ql`
  SELECT from ${Authors}:books[title like 'The %'].genre
  { name }
  `
cds.ql {
  SELECT: {
    from: {
      ref: [
        'sap.capire.bookshop.Authors',
        {
          id: 'books',
          where: [ { ref: [ 'title' ] }, 'like', { val: 'The %' } ]
        },
        'genre'
      ]
    },
    columns: [ { ref: [ 'name' ] } ]
  }
}
> await q
[
  { name: 'Fantasy' },
  { name: 'Mystery' }
]
```

Of course, the first part of the path in this query is now redundant, and
we'd be better removing it entirely:

```javascript
> q = cds.ql`
  SELECT from ${Books}[title like 'The %'].genre
  { name }
  `
cds.ql {
  SELECT: {
    from: {
      ref: [
        {
          id: 'sap.capire.bookshop.Books',
          where: [ { ref: [ 'title' ] }, 'like', { val: 'The %' } ]
        },
        'genre'
      ]
    },
    columns: [ { ref: [ 'name' ] } ]
  }
}
> await q
[
  { name: 'Fantasy' },
  { name: 'Mystery' }
]
```

Why? Because each subsequent segment in the path brings about a further
nested `EXISTS` subquery. Looking at this with `forSQL()` and `toSQL()` is
left as an exercise for you, dear reader.

GOT TO [18:40](https://www.youtube.com/watch?v=OPOH3agULQ0&t=1120s), continuation, still
in the context of explaining the use of technical aliases (!)






## Further info

- [Genres, cuids and a bit of AWK](/blog/posts/2026/03/03/genres-cuids-and-a-bit-of-awk/)
