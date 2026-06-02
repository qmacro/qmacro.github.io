---
title: CDS expressions in CAP - notes on Part 5
date: 2026-04-07
tags:
  - cds
  - cap
  - cql
  - cxl
  - exists
  - pathexpressions
  - nestedexpands
  - handsonsapdev
  - jsonfunctions
description: Notes to accompany Part 5 of the mini-series on the core expression language in CDS.
---

See the [series
post](/blog/posts/2025/12/09/a-new-hands-on-sap-dev-mini-series-on-the-core-expression-language-in-cds/)
for an overview of all the episodes.

<iframe width="560" height="315"
src="https://www.youtube.com/embed/I2Y3uC10Cs8?si=PFd_bxCvZE7uzd3f"
title="YouTube video player" frameborder="0" allow="accelerometer; autoplay;
clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Introduction

[00:00](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=0s) Introduction and
recap from last time.

[06:55](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=415s) Patrice jumps back
in and visits the [CXL documentation in
Capire](https://cap.cloud.sap/docs/cds/cxl), which already by this point has
even been updated and improved. He also briefly runs over some of the expressions
and concepts we've covered thus far, including the `CASE` statement, predicates,
association-like calculated elements (derived from existing associations) and more.

## Combining CASE and concatenation operators

[11:33](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=693s) Revisiting my
question [last time about element
references](/blog/posts/2026/03/27/cds-expressions-in-cap-notes-on-part-4/#element-reference-expressions),
Patrice expands the `fullName` example to combine some of the concepts with
which we're now familiar:

- the ternary operator (syntactic sugar for the `CASE` construct)
- string concatenation (`||`)

```cds
fullName = academicTitle is not null
  ? academicTitle || ' ' || name
  : name;
```

This allows us to take Tolkien's "Professor" title into account 👍.

To show the result of this expression, Patrice runs a
query[<sup>1</sup>](#footnotes) in the cds REPL:

```javascript
> await SELECT
    .from(Authors)
    .columns('name', 'academicTitle', 'fullName')
[
  ...,
  {
    name: 'Brandon Sanderson',
    academicTitle: null,
    fullName: 'Brandon Sanderson'
  },
  {
    name: 'J. R. R. Tolkien',
    academicTitle: 'Prof.',
    fullName: 'Prof. J. R. R. Tolkien'
  }
]
```

> If you want to copy this to try it out yourself, you can use the cds REPL's
> `.editor` feature to enter the multi-line construct (shown like this for
> better readability here).

## Explicit and default types for calculated elements

[14:01](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=841s) I ask a question
relating to the type declarations (or lack thereof) for the calculated elements.
I came up with a very fanciful theory, only to be told that types are declared
when the type is not `String`. In other words, if a type is not declared, then
`String` is the default (for `fullName` here):

```cds
entity Authors : managed {
  key ID            : Integer;
      name          : String(111) @mandatory;
      address       : Association to Addresses;
      academicTitle : String(111);
      ...

      fullName = academicTitle is not null
        ? academicTitle || ' ' || name
        : name;

      isAlive       : Boolean = dateOfDeath is null ? true : false;
      age           : Integer = years_between(
        dateOfBirth, coalesce(dateOfDeath, current_date)
      );
}
```

## Keep services simple

[16:25](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=985s) Then comes a great
question from Neil, on hints, tips and best practices for complex models in the
context of large data volumes.

In response, Patrice talks about how caution is needed when constructing
definitions with large numbers of associations, especially when querying
views that result from such definitions, where the queries are only to retrieve
a small subset of data. To satisfy any query, a complex and possibly costly
`FROM` clause needs to be processed by the underlying database, which when
compared to the small query surface area, is then costly in comparison.

It's much better to keep service definitions simple and granular; think of
services as reflectors of single domain problems, rather than representing the
entire domain.

> See also [AXI004 Services are
> cheap](https://github.com/qmacro/capref/blob/main/axioms/AXI004.md).

This is also why it's always important to not only know about the power
that we are able to wield, but also to know what happens behind the scenes.
Two key reasons for this series!

Additionally, another member of the CAP team in the chat, Johannes Vogt,
suggests employing `DEBUG=sql` as another way to see what's going on. At around
[21:33](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=1293s) Patrice
demonstrates this (with `DEBUG=sql cds repl --run .`).

## Always consider EXISTS for checks across to-many relationships

[24:10](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=1450s) Patrice concludes
his wrap up by emphasising the importance of the `EXISTS` predicate. Not using
this predicate results in likely unwanted duplicate records in the result set
due to the `LEFT JOIN` that is used:

```javascript
> await cds.ql`
  SELECT from Authors { fullName }
  where books.title like '%Mistborn%'
  `
[
  { fullName: 'Brandon Sanderson' },
  { fullName: 'Brandon Sanderson' }
]
```

Reformulating the above to use `EXISTS` plus an infix filter solves that, as a
subquery (a "subselect") is used instead:

```javascript
> await cds.ql`
  SELECT from Authors { fullName }
  where exists books[title like '%Mistborn%']
  `
[
  { fullName: 'Brandon Sanderson' }
]
```

See the section [A look at the EXISTS
predicate](/blog/posts/2026/03/27/cds-expressions-in-cap-notes-on-part-4/#a-look-at-the-exists-predicate)
in the notes to the previous episode for more detail.

## Simplicity from shifting left

[27:00](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=1620s) Revisiting the
[association-like calculated
element](/blog/posts/2026/03/27/cds-expressions-in-cap-notes-on-part-4/#association-like-calculated-element)
from last time, we get to meditate a bit more[<sup>2</sup>](#footnotes) on how
[shifting left](/blog/posts/2026/02/09/shift-left-with-cap/) brings about simplicity.

It would not be out of the ordinary to construct and execute a query like this:

```javascript
> await cds.ql`
  SELECT from Authors { fullName }
  where exists books[stock > 170]
  `
[
  { fullName: 'Richard Carpenter' },
  { fullName: 'Prof. J. R. R. Tolkien' }
]
```

This is already an "accomplished" query, using the very constructions we looked
at just earlier. However, if we shift this condition left, moving it from the query
to our CDS model:

```cds
entity Authors : managed {
  key ID            : Integer;
      name          : String(111) @mandatory;
      ...

      books         : Association to many Books
                        on books.author = $self;

      nonSeller = books[ stock > 170 ];
      ...
}
```

then we define it once, can identify and test it once, and consumers have a
convenient semantic shortcut to what the domain modelling process has defined.

Moreover, let's just take a second to boggle at the simplicity of the expression
that is then available to us in query construction:

```javascript
> await cds.ql`
  SELECT from Authors { fullName }
  where exists nonSeller
  `
[
  { fullName: 'Richard Carpenter' },
  { fullName: 'Prof. J. R. R. Tolkien' }
]
```

## Digging into the condition

Here it is: `where exists nonSeller`. Now that is simple. How exactly are we
checking for existence here? And what exactly are we checking anyway? An
association? Well, yes, but this is where the term "association-like calculated
element" fits much better.

At [28:31](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=1711s) Patrice takes
a moment to look under the hood at this, so we can understand better what is
going on.

First, the CQN shows us that the the target of the `EXISTS` is an expression
`{ ref: [ 'nonSeller' ] }`:

```javascript
> q = cds.ql`
  SELECT from ${Authors} { fullName }
  where exists nonSeller
  `
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Authors' ] },
    columns: [ { ref: [ 'fullName' ] } ],
    where: [ 'exists', { ref: [ 'nonSeller' ] } ]
  }
}
```

Moving to the normalised "CAP-style SQL", with
`forSQL()`[<sup>3</sup>](#footnotes), we see somewhat of an explosion:

```javascript
> q.forSQL()
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Authors' ], as: 'Authors' },
    columns: [
      {
        xpr: [
          'case',
          'when',
          { ref: [ 'Authors', 'academicTitle' ] },
          'is',
          'not',
          'null',
          'then',
          { ref: [ 'Authors', 'academicTitle' ] },
          '||',
          { val: ' ' },
          '||',
          { ref: [ 'Authors', 'name' ] },
          'else',
          { ref: [ 'Authors', 'name' ] },
          'end'
        ],
        as: 'fullName'
      }
    ],
    where: [
      'exists',
      {
        SELECT: {
          from: { ref: [ 'sap.capire.bookshop.Books' ], as: 'nonSeller' },
          columns: [ { val: 1 } ],
          where: [
            {
              xpr: [
                { ref: [ 'nonSeller', 'author_ID' ] },
                '=',
                { ref: [ 'Authors', 'ID' ] }
              ]
            },
            'and',
            { xpr: [ { ref: [ 'nonSeller', 'stock' ] }, '>', { val: 170 } ] }
          ]
        }
      }
    ]
  }
}
```

For the sake of this discussion, we can ignore the first part, specifically the
value of `columns`, as that is for the `fullName` element. It's the `WHERE`
clause that is of interest, and where the answers to the questions earlier
start to appear.

You may wish to refer to the section [A look at the EXISTS
predicate](/blog/posts/2026/03/27/cds-expressions-in-cap-notes-on-part-4/#a-look-at-the-exists-predicate)
from the notes to the previous episode for a detailed analysis, but revisiting
this allows us to stare at the construct a little more, and see how it fits
together - the subquery includes both conditions:

- one from the `nonSeller` definition
- one from the "donor" `books` definition

and either returns something (`1`)[<sup>4</sup>](#footnotes) or nothing, which
is why we can treat it almost like a Boolean.

[31:30](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=1890s) Patrice makes a
point about the SQL that is ultimately produced here, in that it's perfectly
possible to construct that SQL yourself, manually. But who would want to do
that, also taking into account the nuances of different database SQL dialects?

Moreover, one could consider taking one step back and writing the CAP-style SQL
manually instead, using `cds.ql` facilities[<sup>5</sup>](#footnotes). But for
everyday development, this is extra effort that is not required, when compared
to the power & expressiveness of CQL combined with CXL.

## Using a path expression in the column list

At [32:36](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=1956s) Patrice
continues the exploration of the `nonSeller` association-like calculated
element, adding a couple of path expressions (`nonSeller.stock` and
`nonSeller.title`) to the column list of the query:

```javascript
> q = cds.ql`
  SELECT from ${Authors}
  { fullName, nonSeller.stock, nonSeller.title }
  where exists nonSeller
  `
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Authors' ] },
    columns: [
      { ref: [ 'fullName' ] },
      { ref: [ 'nonSeller', 'stock' ] },
      { ref: [ 'nonSeller', 'title' ] }
    ],
    where: [ 'exists', { ref: [ 'nonSeller' ] } ]
  }
}
```

The challenge here is that the introduction of the path expression into this
query causes a flat list to be produced, with multiple entries for the authors
involved:

```javascript
> await q
[
  {
    fullName: 'Richard Carpenter',
    nonSeller_stock: 187,
    nonSeller_title: 'Catweazle'
  },
  {
    fullName: 'Prof. J. R. R. Tolkien',
    nonSeller_stock: 178,
    nonSeller_title: 'Beren and Lúthien'
  },
  {
    fullName: 'Prof. J. R. R. Tolkien',
    nonSeller_stock: 203,
    nonSeller_title: 'The Children of Húrin'
  },
  {
    fullName: 'Prof. J. R. R. Tolkien',
    nonSeller_stock: 195,
    nonSeller_title: 'The Fall of Gondolin'
  },
  {
    fullName: 'Prof. J. R. R. Tolkien',
    nonSeller_stock: 189,
    nonSeller_title: 'Unfinished Tales'
  }
]
```

Now we know about `forSQL()` and `toSQL()`, we can comfortably look behind the scenes, as Patrice does
at [34:17](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=2057s), to understand why:

```javascript
> q.forSQL()
cds.ql {
  SELECT: {
    from: {
      join: 'left',
      args: [
        { ref: [ 'sap.capire.bookshop.Authors' ], as: 'Authors' },
        { ref: [ 'sap.capire.bookshop.Books' ], as: 'nonSeller' }
      ],
      on: [
        {
          xpr: [
            { ref: [ 'nonSeller', 'author_ID' ] },
            '=',
            { ref: [ 'Authors', 'ID' ] }
          ]
        },
        'and',
        {
          xpr: [ { ref: [ 'nonSeller', 'stock' ] }, '>', { val: 170 } ]
        }
      ]
    },
    columns: [
      {
        xpr: [
          'case',
          'when',
          { ref: [ 'Authors', 'academicTitle' ] },
          'is',
          'not',
          'null',
          'then',
          { ref: [ 'Authors', 'academicTitle' ] },
          '||',
          { val: ' ' },
          '||',
          { ref: [ 'Authors', 'name' ] },
          'else',
          { ref: [ 'Authors', 'name' ] },
          'end'
        ],
        as: 'fullName'
      },
      { ref: [ 'nonSeller', 'stock' ], as: 'nonSeller_stock' },
      { ref: [ 'nonSeller', 'title' ], as: 'nonSeller_title' }
    ],
    where: [
      'exists',
      {
        SELECT: {
          from: { ref: [ 'sap.capire.bookshop.Books' ], as: 'nonSeller2' },
          columns: [ { val: 1 } ],
          where: [
            {
              xpr: [
                { ref: [ 'nonSeller2', 'author_ID' ] },
                '=',
                { ref: [ 'Authors', 'ID' ] }
              ]
            },
            'and',
            { xpr: [ { ref: [ 'nonSeller2', 'stock' ] }, '>', { val: 170 } ] }
          ]
        }
      }
    ],
    expand: 'root'
  }
}
```

Patrice points out the alias `nonSeller2` - the term `nonSeller` has already
been used for the alias for `Books` in the `LEFT JOIN` constructed due to the
path expressions we added to the column list.

[37:35](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=2255s) In answering a
question I asked about this, Patrice explains the query plan here, which is to:

1. Filter the entire set of authors down to those satisfying the non-seller
   predicate condition
1. For that subset of authors, a `LEFT JOIN` is made to the books

The duplicate author names in the result set are because of this `LEFT JOIN`
which brings about a flattening, essentially a consequence of the implicit
requirement for a `LEFT JOIN` contradicting or invalidating the point of the
subquery.

One could have just as well constructed the query like this, which Patrice
shows at [38:33](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=2313s):

```javascript
> q = cds.ql`
  SELECT from ${Authors}
  { fullName, nonSeller.stock, nonSeller.title }
  where nonSeller.title is not null
  `
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Authors' ] },
    columns: [
      { ref: [ 'fullName' ] },
      { ref: [ 'nonSeller', 'stock' ] },
      { ref: [ 'nonSeller', 'title' ] }
    ],
    where: [ { ref: [ 'nonSeller', 'title' ] }, 'is', 'not', 'null' ]
  }
}
```

The result set is the same as before.

## Nested expands

[39:50](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=2390s) However, there's
more to life than flattened lists! Returning to the original query with the
`EXISTS` predicate, we can avoid the flattening and repetition (which we now
know is caused by the `LEFT JOIN`, due in turn to the path expression traversal
requirements).

How? By using the power of [nested
expands](https://cap.cloud.sap/docs/cds/cql#nested-expands):

```javascript
> q = cds.ql`
  SELECT from ${Authors}
  { fullName, nonSeller { title, stock } }
  where exists nonSeller
  `
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Authors' ] },
    columns: [
      { ref: [ 'fullName' ] },
      {
        ref: [ 'nonSeller' ],
        expand: [ { ref: [ 'title' ] }, { ref: [ 'stock' ] } ]
      }
    ],
    where: [ 'exists', { ref: [ 'nonSeller' ] } ]
  }
}
```

This brings back a result set that is definitely _not_ flattened:

```javascript
> await q
[
  {
    fullName: 'Richard Carpenter',
    nonSeller: [ { title: 'Catweazle', stock: 187 } ]
  },
  {
    fullName: 'Prof. J. R. R. Tolkien',
    nonSeller: [
      { title: 'Unfinished Tales', stock: 189 },
      { title: 'The Children of Húrin', stock: 203 },
      { title: 'Beren and Lúthien', stock: 178 },
      { title: 'The Fall of Gondolin', stock: 195 }
    ]
  }
]
```

... it's _structured_!

This seems a little extraordinary, given the nature of SQL generally, and the
native inability to store an entire set of data into a single column in
particular. This extraordinariness is made possible due to the modern database
adapters, re-written and introduced in CAP major version 8.

[42:50](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=2570s) Patrice explains
how this was achieved before those new database adapters: such queries were
realised by a combination of SQL and also runtime logic, perhaps a bit like we
approached similar query tasks in ABAP by using internal tables and custom
logic controlled execution of various `SELECT` statements, back in the day.

Looking back at the [Release Notes for Jun
2024](https://cap.cloud.sap/docs/releases/2024/jun24), introducing CAP 8, we
can see exactly what this is about in the [New Database Services
(GA)](https://cap.cloud.sap/docs/releases/2024/jun24#new-database-services-ga)
section, in particular:

> - _Various optimizations like using database-native JSON functions for deep
>   queries in single roundtrips, user-defined functions and more, to push
>   data-processing tasks down to the database (→ improves utilization)._

What do these "database-native JSON functions" look like? Well, we've seen them
in passing before, but we can work our way towards them by following the
now-familiar path, going from the CQN, to the CAP-style SQL, and ultimately to
the native SQL.

First, the CAP-style SQL (with the expression for the `fullName` construction
and the subquery for the `exists nonSeller` both elided for brevity):

```javascript
> q.forSQL()
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Authors' ], as: 'Authors' },
    columns: [
      {
        xpr: [
          ...
        ],
        as: 'fullName'
      },
      {
        SELECT: {
          from: { ref: [ 'sap.capire.bookshop.Books' ], as: 'nonSeller2' },
          columns: [
            { ref: [ 'nonSeller2', 'stock' ] },
            { ref: [ 'nonSeller2', 'title' ] }
          ],
          expand: true,
          one: false,
          where: [
            {
              xpr: [
                { ref: [ 'Authors', 'ID' ] },
                '=',
                { ref: [ 'nonSeller2', 'author_ID' ] }
              ]
            },
            'and',
            { xpr: [ { ref: [ 'nonSeller2', 'stock' ] }, '>', { val: 170 } ] }
          ]
        },
        as: 'nonSeller'
      }
    ],
    where: [
      'exists',
      {
        ...
      }
    ]
  }
}
```

Note that there's no `LEFT JOIN` that we've seen employed previously (before we
introduced the nested expand). Instead, alongside the `fullName` column,
there's now a second column in the outermost (main) query, which is a subquery,
specifically a `SELECT` on `Books`.

The `WHERE` clause in this subquery should look familiar, and serves to
correlate the IDs of the `Authors` from the main query as well as restricting
the result set according to the stock values.

[48:16](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=2896s) In answer to my
question at this point, Patrice tells us that these expands are similar to
[postfix projections](https://cap.cloud.sap/docs/cds/cql#postfix-projections)
and the concepts are shared.

Here follows an example, which shows:

- the [smart * selector](https://cap.cloud.sap/docs/cds/cql#smart-selector)
- a couple of [alias](https://cap.cloud.sap/docs/cds/cql#alias) declarations
  (one for the actual association, and one for one of the structure elements)
- omission of elements via an [excluding
  clause](https://cap.cloud.sap/docs/cds/cql#excluding-clause)

```javascript
> await cds.ql`
  SELECT from ${Authors}
  {
    fullName,
    nonSeller as booksNotSellingWell
      { *, title as bookName }
      excluding { createdBy, modifiedBy, ID, descr }
  }
  where exists nonSeller
  `
[
  {
    fullName: 'Richard Carpenter',
    nonSeller: [
      {
        createdAt: '2026-04-04T10:29:20.859Z',
        modifiedAt: '2026-04-04T10:29:20.859Z',
        title: 'Catweazle',
        author_ID: 170,
        genre_ID: 13,
        stock: 187,
        price: 150,
        currency_code: 'JPY',
        bookName: 'Catweazle'
      }
    ]
  },
  {
    fullName: 'Prof. J. R. R. Tolkien',
    nonSeller: [
      {
        createdAt: '2026-04-04T10:29:20.859Z',
        modifiedAt: '2026-04-04T10:29:20.859Z',
        title: 'Unfinished Tales',
        author_ID: 201,
        genre_ID: 13,
        stock: 189,
        price: 13.99,
        currency_code: 'GBP',
        bookName: 'Unfinished Tales'
      },
      {
        createdAt: '2026-04-04T10:29:20.859Z',
        modifiedAt: '2026-04-04T10:29:20.859Z',
        title: 'The Children of Húrin',
        author_ID: 201,
        genre_ID: 13,
        stock: 203,
        price: 13.99,
        currency_code: 'GBP',
        bookName: 'The Children of Húrin'
      },
      ...
    ]
  }
]
```

At [50:12](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=3012s) I make an
observation about nesting depth, to which Patrice responds by extending the
example to add genre information, which I will do here to this example:

```javascript
> await cds.ql`
  SELECT from ${Authors}
  {
    fullName,
    nonSeller as booksNotSellingWell
      { *, title as bookName, genre { * } }
      excluding { createdBy, modifiedBy, ID, descr }
  }
  where exists nonSeller
  `
```

The result set is suitably extended, here's what a typical book structure looks
like now:

```json
{
  createdAt: '2026-04-04T10:29:20.859Z',
  modifiedAt: '2026-04-04T10:29:20.859Z',
  title: 'The Fall of Gondolin',
  author_ID: 201,
  genre_ID: 13,
  stock: 195,
  price: 13.99,
  currency_code: 'GBP',
  bookName: 'The Fall of Gondolin',
  genre: {
    name: 'Fantasy',
    descr: null,
    ID: 13,
    parent_ID: 10
  }
}
```

Note also, as Patrice points out, that before CAP 8, this would have been realised
by multiple (three, in fact) separate calls to the database layer, coordinated
by logic in the runtime, and then the results stitched together before being
returned as a contiguous set. These three calls can be seen as three nested
`SELECT` statements in the query's intermediate format[<sup>6</sup>](#footnotes).

With the new database adapters, there's only a single call to the database
layer, and no coordination or combination logic required at runtime.

## JSON functions in SQL

[53:18](https://www.youtube.com/watch?v=I2Y3uC10Cs8&t=3198s) Based on this query
that Patrice was working with:

```javascript
> q = cds.ql`
  SELECT from ${Authors}
  {
    fullName,
    nonSeller
    {
      title as book,
      stock,
      genre
      {
        *
      }
    }
  }
  where exists nonSeller
  `
```

here's what the
actual database native (SQLite in this particular example) SQL looks
like[<sup>7</sup>](#footnotes):

```sql
SELECT
  case
    when Authors.academicTitle is not null
    then Authors.academicTitle || ? || Authors.name
    else Authors.name
  end as fullName,
  (
    SELECT
      jsonb_group_array (
        jsonb_insert (
          '{}',
          '$."book"',
          book,
          '$."stock"',
          stock,
          '$."genre"',
          genre - > '$'
        )
      ) as _json_
    FROM
      (
        SELECT
          nonSeller2.title as book,
          nonSeller2.stock,
          (
            SELECT
              json_insert (
                '{}',
                '$."name"',
                name,
                '$."descr"',
                descr,
                '$."ID"',
                ID,
                '$."parent_ID"',
                parent_ID
              ) as _json_
            FROM
              (
                SELECT
                  genre.name,
                  genre.descr,
                  genre.ID,
                  genre.parent_ID
                FROM
                  sap_capire_bookshop_Genres as genre
                WHERE
                  "nonSeller2".genre_ID = genre.ID
                LIMIT
                  ?
              )
          ) as genre
        FROM
          sap_capire_bookshop_Books as "nonSeller2"
        WHERE
          (Authors.ID = "nonSeller2".author_ID)
          and ("nonSeller2".stock > ?)
      )
  ) as nonSeller
FROM
  sap_capire_bookshop_Authors as Authors
WHERE
  exists (
    SELECT
      1 as "1"
    FROM
      sap_capire_bookshop_Books as nonSeller
    WHERE
      (nonSeller.author_ID = Authors.ID)
      and (nonSeller.stock > ?)
  )
```

Here are some initial notes on this (single!) SQL statement:

- the outermost `SELECT` is on the `Authors`
- it is constrained by the `WHERE` clause that represents the non-seller
  subquery with which we are familiar
- the construction of the `fullName` in SQL here is extremely similar to the
  CXL `CASE` expression

Then come the nested subqueries. But wait, that's a lot more `SELECT`s that we
expected! That's because of the interleaving of JSON functions, from which
comes the power and ability to push down such complex queries directly and
solely to the database layer.

Essentially, we see the use here of:

- the aggregate function
  [jsonb_group_array](https://sqlite.org/json1.html#jgrouparrayb)
- the function
  [json_insert](https://sqlite.org/json1.html#the_json_insert_json_replace_and_json_set_functions)
  to construct JSON objects (to be aggregated)

The juxtaposition (pairing, almost) of the JSON functions and the corresponding
subquery `SELECT` statements is not accidental. They have been generated
exactly like this to be able to build the deeply nested structure required,
otherwise impossible in SQL without such JSON facilities ... combined with the
ability to _stringify_ complex JSON structures into scalar values (large
strings!).

## Further info

- Patrice also has [some great notes for this
  part](https://github.com/patricebender/cxl-bookshop/blob/main/notes/notes-session5.md).

## Footnotes

1. The query is constructed using the fluent API style, rather than what we've
   mostly employed, which has been by writing queries in tagged template
   literals. See the [Constructing
   Queries](https://cap.cloud.sap/docs/node.js/cds-ql#constructing-queries)
   section of the Querying in JavaScript topic in Capire for more information.
   Additionally, I used the
   [columns()](https://cap.cloud.sap/docs/node.js/cds-ql#columns) method to
   restrict the data set returned.

1. We considered this briefly in part 3 of this series - see [Adding a
   calculated
   element](/blog/posts/2026/03/23/cds-expressions-in-cap-notes-on-part-3/#adding-a-calculated-element)
   in the notes.

1. It's for the benefit of this method that we're using `${Authors}` rather
   than `Authors` in the query template string, so that the transformation
   function will work properly.

1. Note that this value of `1` is not the [SQLite Boolean value for
   true](https://www.sqlite.org/datatype3.html#boolean_datatype). This is the
   normalised neutral SQL (from `forSQL()`) rather than the database specific
   SQL. If we were to ask for the database specific SQL when connected to HANA
   (instead of SQLite here):

   ```bash
   echo 'cds.ql`select from ${Authors} { fullName } where exists nonSeller`.toSQL().sql'
   | cds bind --exec --profile hybrid -- cds repl --run .
   ```

   we'd see this `1` value too:

   ```sql
   SELECT
     case
       when Authors.academicTitle is not null
       then Authors.academicTitle || ? || Authors.name
       else Authors.name
     end as "fullName"
   FROM
     sap_capire_bookshop_Authors as Authors
   WHERE
     exists (
       SELECT
         1 as "1"
       FROM
         sap_capire_bookshop_Books as nonSeller
       WHERE
         (nonSeller.author_ID = Authors.ID)
         and (nonSeller.stock > ?)
     )
   ```

1. [cds.ql](https://cap.cloud.sap/docs/node.js/cds-ql#cds-ql) contains a whole
   host of facilities for this:

   ```javascript
   > Object.keys(cds.ql)
   [
     'Query',   'SELECT', 'INSERT',
     'UPSERT',  'UPDATE', 'DELETE',
     'CREATE',  'DROP',   'predicate',
     'columns', 'ref',    'val',
     'xpr',     'expr',   'list',
     'func',    'nested', 'expand',
     'inline',  'where',  'orderBy',
     'orders',  'limit',  'clone'
   ]
   ```

1. Here's the intermediate format for this query, showing the `SELECT`
   statements nested as columns:

   ```javascript
   cds.ql {
     SELECT: {
       from: { ref: [ 'sap.capire.bookshop.Authors' ], as: 'Authors' },
       columns: [
         {
           xpr: [
             ...
           ],
           as: 'fullName'
         },
         {
           SELECT: {
             excluding: [ 'createdBy', 'modifiedBy', 'ID', 'descr' ],
             from: { ref: [ 'sap.capire.bookshop.Books' ], as: 'nonSeller2' },
             columns: [
               { ref: [ 'nonSeller2', 'createdAt' ] },
               { ref: [ 'nonSeller2', 'modifiedAt' ] },
               { ref: [ 'nonSeller2', 'title' ] },
               { ref: [ 'nonSeller2', 'author_ID' ] },
               { ref: [ 'nonSeller2', 'genre_ID' ] },
               { ref: [ 'nonSeller2', 'stock' ] },
               { ref: [ 'nonSeller2', 'price' ] },
               { ref: [ 'nonSeller2', 'currency_code' ] },
               { ref: [ 'nonSeller2', 'title' ], as: 'bookName' },
               {
                 SELECT: {
                   from: { ref: [ 'sap.capire.bookshop.Genres' ], as: 'genre' },
                   columns: [
                     { ref: [ 'genre', 'name' ] },
                     { ref: [ 'genre', 'descr' ] },
                     { ref: [ 'genre', 'ID' ] },
                     { ref: [ 'genre', 'parent_ID' ] }
                   ],
                   expand: true,
                   one: true,
                   where: [
                     { ref: [ 'nonSeller2', 'genre_ID' ] },
                     '=',
                     { ref: [ 'genre', 'ID' ] }
                   ]
                 },
                 as: 'genre'
               }
             ],
             expand: true,
             one: false,
             where: [
               {
                 xpr: [
                   { ref: [ 'Authors', 'ID' ] },
                   '=',
                   { ref: [ 'nonSeller2', 'author_ID' ] }
                 ]
               },
               'and',
               { xpr: [ { ref: [ 'nonSeller2', 'stock' ] }, '>', { val: 170 } ] }
             ]
           },
           as: 'nonSeller'
         }
       ],
       where: [
         'exists',
         {
           SELECT: {
             from: { ref: [ 'sap.capire.bookshop.Books' ], as: 'nonSeller' },
             columns: [ { val: 1 } ],
             where: [
               {
                 xpr: [
                   { ref: [ 'nonSeller', 'author_ID' ] },
                   '=',
                   { ref: [ 'Authors', 'ID' ] }
                 ]
               },
               'and',
               { xpr: [ { ref: [ 'nonSeller', 'stock' ] }, '>', { val: 170 } ] }
             ]
           }
         }
       ]
     }
   }
   ```

1. The outermost JSON function has been omitted here, as it is less important
   to stare at right now.
