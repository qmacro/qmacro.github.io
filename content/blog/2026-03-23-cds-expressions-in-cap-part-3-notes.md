---
title: CDS expressions in CAP - notes on Part 3
date: 2026-03-23
tags:
  - cds
  - cap
  - cql
  - cxl
  - handsonsapdev
description: Notes to accompany Part 3 of the mini-series on the core expression language in CDS.
---

See the [series
post](/blog/posts/2025/12/09/a-new-hands-on-sap-dev-mini-series-on-the-core-expression-language-in-cds/)
for an overview of all the episodes.

<iframe width="560" height="315"
src="https://www.youtube.com/embed/FVEbvHMxOIY?si=QEIVl56gayLYkbg0"
title="YouTube video player" frameborder="0" allow="accelerometer; autoplay;
clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Introduction

[00:00](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=0s) Introduction.

[03:12](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=192s) Patrice confirms
that the constraints that we looked at in the previous part are checked in an
"after" phase handler.

## Revisiting core CXL building blocks

[05:55](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=355s) Patrice jumps into
the cds REPL to revisit some of the CXL building blocks, such as literals:

```javascript
> cds.parse.expr` 1 `
{ val: 1 }
> cds.parse.expr` true `
{ val: true }
```

unary operators:

```javascript
> cds.parse.expr` +1 `
{ xpr: [ '+', { val: 1 } ] }
```

binary operators, including some that are common in programming languages, such
as `!=` which is translated to `IS NOT` in SQL:

```javascript
> cds.ql`SELECT title from ${Books} where stock != null`.toSQL()
{
  sql: 'SELECT title AS "title" FROM (
    SELECT "$B".title
    FROM sap_capire_bookshop_Books as "$B"
    WHERE "$B".stock is not NULL
  )',
  values: []
}
```

> This is [simplified SQL without
> JSON](https://cap.cloud.sap/docs/releases/2024/jun24#new-option-cds-features-sql-simple-queries),
> in a cds REPL session invoked thus:
>
> ```bash
> CDS_FEATURES_SQL__SIMPLE__QUERIES=2 cds r -r .
> ```

## Functions, CAST and predicates

[09:58](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=598s) Next up is a look
at the function syntax, which Patrice shows with an example in the cds REPL,
emphasising that the arguments are just expressions:

```javascript
> cds.parse.expr` someFunction( (1+1), true ) `
{
  func: 'someFunction',
  args: [ { xpr: [ { val: 1 }, '+', { val: 1 } ] }, { val: true } ]
}
```

[17:25](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=1045s) We take a brief
look at `CAST`, a special function:

```javascript
> cds.parse.expr` cast( 1 as String ) `
{ val: 1, cast: { type: 'String' } }
```

[19:06](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=1146s) And then we
look at the family of predicates available, such as `[NOT] LIKE`, `IS [NOT]
NULL`, `[NOT] BETWEEN ... AND ...`, `[NOT] IN ( ... )` and `[NOT] EXISTS ...`.

## Adding a calculated element

[21:50](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=1310s) Patrice shows an
example at the "db" level in the `db/schema.cds` file, by adding a calculated
element (the sort that we might alternatively find in queries, i.e. in CQL) to
the CDL definition of the `Authors` entity which currently looks like this:

```cds
entity Authors : managed {
  key ID            : Integer;
      name          : String(111) @mandatory;
      address       : Association to Addresses;
      academicTitle : String(111);
      dateOfBirth   : Date;
      dateOfDeath   : Date;
      placeOfBirth  : String;
      placeOfDeath  : String;
      books         : Association to many Books
                        on books.author = $self;
}
```

Adding a Boolean element `isAlive` can be done via an expression, in various
ways, such as:

```cds
isAlive : Boolean = case
  when dateOfDeath is null then true
  else false
end;
```

Or with the concise ternary expression beloved of JavaScript (and other)
programmers:

```cds
isAlive : Boolean = dateOfDeath is null ? true : false
```

> Of course, this was purely to illustrate the `? :` syntax; an even less verbose version would be:
>
> ```cds
> isAlive : Boolean = dateOfDeath is null;
> ```

[24:00](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=1440s) This calculated
element is virtual, i.e. not manifested in the underlying table definition,
which Patrice shows with:

```bash
cds compile -2 sql db/schema.cds
```

which emits this DDL, with no sign of the `isAlive` field:

```sql
CREATE TABLE sap_capire_bookshop_Authors (
  createdAt TIMESTAMP_TEXT,
  createdBy NVARCHAR(255),
  modifiedAt TIMESTAMP_TEXT,
  modifiedBy NVARCHAR(255),
  ID INTEGER NOT NULL,
  name NVARCHAR(111),
  address_ID INTEGER,
  academicTitle NVARCHAR(111),
  dateOfBirth DATE_TEXT,
  dateOfDeath DATE_TEXT,
  placeOfBirth NVARCHAR(255),
  placeOfDeath NVARCHAR(255),
  PRIMARY KEY(ID)
);
```

The calculated element only plays a role in queries, and in the context of
views or projections. And we have one of those, in the form of the
`AdminService` which looks like this:

```cds
using {sap.capire.bookshop as my} from '../db/schema';

service AdminService {
  entity Books   as projection on my.Books;
  entity Authors as projection on my.Authors;
}

// ...
```

Compiling `srv/admin-service.cds`:

```bash
cds compile -2 sql srv/admin-service.cds
```

shows us where this manifests, in the DDL for this `Authors` projection:

```sql
CREATE VIEW AdminService_Authors AS SELECT
  Authors_0.createdAt,
  Authors_0.createdBy,
  Authors_0.modifiedAt,
  Authors_0.modifiedBy,
  Authors_0.ID,
  Authors_0.name,
  Authors_0.address_ID,
  Authors_0.academicTitle,
  Authors_0.dateOfBirth,
  Authors_0.dateOfDeath,
  Authors_0.placeOfBirth,
  Authors_0.placeOfDeath,
  CASE WHEN Authors_0.dateOfDeath IS NULL THEN TRUE ELSE FALSE END AS isAlive
FROM sap_capire_bookshop_Authors AS Authors_0;
```

> This, incidentally, is a great example of both shifting left and down, where
> the convenience mechanism that results in an `isAlive` Boolean value is not
> calculated by any requester (based on the `dateOfDeath` value that _is_
> available, once the dataset has been retrieved), or added to any transient
> dynamic queries, or even added as adornments to one or more service
> definitions that have projections on the authors data.
>
> Instead, it is defined once, quietly and gently, at the "db" level, and
> reified where appropriate, and available automatically. As Patrice puts it a
> bit later on, this is "centralising our common expressions into one place -
> our domain model".
>
> See the [Further info](#further-info) section for links to more reading on this.

[26:40](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=1600s) In the context of
a question asked by VishalK, Patrice notes that there are two forms of
[calculated elements](https://cap.cloud.sap/docs/cds/cdl#calculated-elements),
on-read (as here) and also on-write.

[28:20](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=1700s) Patrice
illustrates the expression that has been constructed (in CXN) for this
`isAlive` calculated element by looking directly at it in the cds REPL:

```javascript
> Authors.elements['isAlive']
Boolean {
  '@Core.Computed': true,
  type: 'cds.Boolean',
  value: {
    xpr: [
      'case',
      'when',
      { ref: [ 'dateOfDeath' ] },
      'is',
      'null',
      'then',
      { val: true },
      'else',
      { val: false },
      'end'
    ]
  }
}
```

## Using the calculated element in queries

[29:26](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=1766s) Having looked at
how the calculated element at the "db" level is manifested in the DDL for the
`AdminService`'s projection, Patrice now shows how it comes into play in a
query, in the cds REPL:

```javascript
> await cds.ql`
  SELECT from ${Books} { title, author.name }
  where author.isAlive = true
  `
[
  { title: 'Mistborn: The Final Empire', author_name: 'Brandon Sanderson' },
  { title: 'The Well of Ascension', author_name: 'Brandon Sanderson' },
  ...
  { title: 'Wind and Truth', author_name: 'Brandon Sanderson' }
]
```

> The condition could be written more simply as `where author.isAlive` here
> too.

An illustration of the opposite might look like this (again, using terser
condition syntax, instead of, say, `where isAlive = false`):

```javascript
> await cds.ql`
  SELECT from ${Authors} { name, books.title }
  where isAlive = false
  `
[
  { name: 'Emily Brontë', books_title: 'Wuthering Heights' },
  { name: 'Charlotte Brontë', books_title: 'Jane Eyre' },
  { name: 'Edgar Allen Poe', books_title: 'Eleonora' },
  { name: 'Edgar Allen Poe', books_title: 'The Raven' },
  { name: 'Richard Carpenter', books_title: 'Catweazle' },
  { name: 'J. R. R. Tolkien', books_title: 'Beren and Lúthien' },
  { name: 'J. R. R. Tolkien', books_title: 'The Children of Húrin' },
  ...
  { name: 'J. R. R. Tolkien', books_title: 'Unfinished Tales' }
]
```

> Here also the condition could be written more simply as `where not isAlive`.

## Target references

[33:11](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=1991s) There was a brief
discussion about the "Books" reference in the previous query, which looked like
this:

```sql
SELECT from ${Books}
```

This is the more precise approach to specifying the target of the query - the
entity represented by (contained in) the `Books` variable injected into the cds
REPL session, which resolves thus:

```javascript
> Books.name
sap.capire.bookshop.Books
```

When we use a literal value instead, like this:

```sql
SELECT from Books
```

then CAP can often resolve the reference, but caution must be used here in case
there are other entities, in different scopes, but with the same name; in this
case using the template string interpolation (`${ ... }`) will allow us to be
specific.

## Query details and the phased translation to native SQL

[35:05](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=2105s) At this point
Patrice digs in a little deeper to the query. First, from the CQL (which was
then modified at [36:25](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=2185s),
so that the `from` reference is to `sap.capire.bookshop.Books` rather than just
`Books`), we see the CQN representation which includes an expression notation
for the `isAlive` check:

```javascript
> q = cds.ql`
  SELECT from ${Books} { title, author.name }
  where author.isAlive = false
  `
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Books' ] },
    columns: [ { ref: [ 'title' ] }, { ref: [ 'author', 'name' ] } ],
    where: [ { ref: [ 'author', 'isAlive' ] }, '=', { val: false } ]
  }
}
```

Using the `toSQL()` method on the query object, we see the
SQL[<sup>1</sup>](#footnotes) and the injectable values:

```javascript
> q.toSQL()
{
  sql: `SELECT json_insert('{}','$."title"',title,'$."author_name"',author_name) as _json_ FROM (SELECT "$B".title,author.name as author_name FROM sap_capire_bookshop_Books as "$B" left JOIN sap_capire_bookshop_Authors as author ON author.ID = "$B".author_ID WHERE (case when author.dateOfDeath is null then ? else ? end) = ?)`,
  values: [ 1, 0, 0 ]
}
```

And the SQL, when formatted nicely, looks like this:

```sql
SELECT
  json_insert(
    '{}', '$."title"', title, '$."author_name"', author_name
  ) as _json_
FROM
  (
    SELECT
      Books.title,
      author.name as author_name
    FROM sap_capire_bookshop_Books as Books
      left JOIN sap_capire_bookshop_Authors as author
      ON author.ID = Books.author_ID
    WHERE
      (
        case
          when author.dateOfDeath is null then ?
          else ?
        end
      ) = ?
  )
```

[38:30](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=2310s) We've jumped from
CQL almost directly to the (SQLite dialect[<sup>2</sup>](#footnotes) of) SQL
here, but Patrice now explains the multi-step process here.

Between the CQL (and CXL), and its machine-readable CQN (and CXN) equivalents,
and the ultimate persistence-layer-specific SQL, there's an intermediate
"normalised" format. This is often referred to as "CAP-style SQL", or the "SQL
variant of CQL". Using the `forSQL()` method on the query object (as opposed to
the `toSQL()` we used just now), we can get this intermediate format:

```javascript
> q.forSQL()
cds.ql {
  SELECT: {
    from: {
      join: 'left',
      args: [
        { ref: [ 'sap.capire.bookshop.Books' ], as: '$B' },
        { ref: [ 'sap.capire.bookshop.Authors' ], as: 'author' }
      ],
      on: [
        { ref: [ 'author', 'ID' ] },
        '=',
        { ref: [ '$B', 'author_ID' ] }
      ]
    },
    columns: [
      { ref: [ '$B', 'title' ] },
      { ref: [ 'author', 'name' ], as: 'author_name' }
    ],
    where: [
      {
        xpr: [
          'case',
          'when',
          { ref: [ 'author', 'dateOfDeath' ] },
          'is',
          'null',
          'then',
          { val: true },
          'else',
          { val: false },
          'end'
        ]
      },
      '=',
      { val: false }
    ]
  }
}
```

As we can see, we can recognise both CXL (CXN) style expressions, as well as
SQL-style constructions such as JOINs. At this point this is is still in a form
that is not SQL database system specific (i.e. not SQLite, Postgres or HANA
specific SQL).

And as opposed to this neutral "normalised" format from `forSQL()`, we get the
database-specific dialect with `toSQL()`.

## A question on WITH ASSOCIATIONS and the previous db adapters

[41:20](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=2480s) At this point
ArtlessSoul asks a question to which Patrice responds by explaining the
difference between how path expressions were handled (translated to SQL) in the
now-legacy database services which were in play before the current major CAP
version.

It had not been possible at the time to transform all path expressions to the
required JOINs that would be needed to represent them at a SQL level. One way
to address this at the time, specifically for HANA, had been to push down such
associations to the database, which supported them with a `WITH ASSOCIATIONS`
native feature (see the [Native
Associations](https://cap.cloud.sap/docs/guides/databases/hana#native-associations)
section of the SAP HANA topic in Capire).

While HANA would be the typical target database runtime for production, it had
thus not been previously possible to test associations in development, i.e.
outside the HANA context.

But thanks to the new database adapters with the current major release, all
associations are possible for all supported databases due to improvements in
how they're managed and translated by the CAP runtime, and therefore a much
higher development and testing confidence can be achieved.

## Exploring function expressions

[45:01](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=2701s) Patrice starts to round
off this episode with a nice example to illustrate function expressions. The example
is another calculated element on the `Authors` entity, for the author's age:

```cds
age : Integer = years_between(dateOfBirth, coalesce(dateOfDeath, current_date));
```

[46:38](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=2798s) But before
continuing, he connects and deploys to the HANA Cloud service he has already
set up in his account, following the same [connection and deployment to
HANA](/blog/posts/2026/03/09/cds-expressions-in-cap-notes-on-part-2/#connection-and-deployment-to-hana)
procedure from part 2, and then at
[48:20](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=2900s) he starts the cds
REPL using the hybrid profile, also following the same procedure from part 2
(see the [Going
hybrid](/blog/posts/2026/03/09/cds-expressions-in-cap-notes-on-part-2/#going-hybrid)
section of part 2's notes for details).

[49:10](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=2950s) At this point we take a look at what happens under the hood -- in HANA -- for this new `age` element, step by step.

First, step 1, from CQL to CQN and the query object:

```javascript
> q = cds.ql`SELECT from ${Authors} { name, age }`
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Authors' ] },
    columns: [ { ref: [ 'name' ] }, { ref: [ 'age' ] } ]
  }
}
```

Next, step 2, taking a look at the intermediate "normalised" version of the query, using `forSQL()`:

```javascript
> q.forSQL()
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Authors' ], as: '$A' },
    columns: [
      { ref: [ '$A', 'name' ] },
      {
        args: [
          { ref: [ '$A', 'dateOfBirth' ] },
          {
            func: 'coalesce',
            args: [
              { ref: [ '$A', 'dateOfDeath' ] },
              { func: 'current_date' }
            ]
          }
        ],
        func: 'years_between',
        as: 'age'
      }
    ]
  }
}
```

From a column perspective, there are two:

- a reference to the `name` element in `sap.capire.bookshop.Authors`
- the evaluation of a function `years_between`, the arguments to which are
  - a reference to the `dateOfBirth` element
  - the evaluation of another function `coalesce`, the arguments to which are
    - a reference to the `dateOfDeath` element
    - the evaluation of yet another function `current_date`

Running this query gives us what we expect:

```javascript
> await q
[
  { age: 30, name: 'Emily Brontë' },
  { age: 36, name: 'Charlotte Brontë' },
  { age: 40, name: 'Edgar Allen Poe' },
  { age: 82, name: 'Richard Carpenter' },
  { age: 50, name: 'Brandon Sanderson' },
  { age: 81, name: 'J. R. R. Tolkien' }
]
```

[51:05](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=3065s) After adding the `isAlive` element back into the query, Patrice now takes a look at the actual SQL resolved for this query ... in the context of the hybrid profile, which means in the context of a HANA database:

```javascript
> cds.ql`SELECT from ${Authors} {name, age, isAlive }`.toSQL().sql
```

This results in SQL that, when formatted, looks like this:

```sql
SELECT
  Authors.name as "name",
  years_between (
    Authors.dateOfBirth,
    coalesce(Authors.dateOfDeath, current_utcdate)
  ) as "age",
  case
    when Authors.dateOfDeath is null then true
    else false
  end as "isAlive"
FROM
  sap_capire_bookshop_Authors as Authors
```

There's pretty much a 1-to-1 correlation between the CDL we have used to define our `Authors` entity, and the HANA-flavoured SQL here.

## Portable functions

And that's because HANA implements the `years_between` function natively.
Unlike SQLite, for which more heavy lifting is done by the compiler team, to
essentially provide us with "a set of portable functions (and also operators)
which are automatically translated for us to the best-possible
database-specific native SQL equivalents". That quote is from Capire's
[CAP-Level Database
Support](https://cap.cloud.sap/docs/guides/databases/cap-level-dbs) topic which
is well worth a read.

[52:47](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=3167s) To illustrate this, Patrice starts a new cds REPL session in the context of the default (development) profile which implies SQLite:

```bash
cds repl --run .
```

This time, the same query (`SELECT from ${Authors} { name, age }`) results in the same CQN of course, as well as the same normalised CAP-style SQL (via `forSQL()`) as before, but the resulting database-specific SQL(via `toSQL().sql`) is quite different[<sup>3</sup>](#footnotes):

```sql
SELECT
  json_insert ('{}', '$."name"', name, '$."age"', age) as _json_
FROM
  (
    SELECT
      "$A".name,
      floor(
        (
          (
            (
              cast(
                strftime ('%Y', coalesce("$A".dateOfDeath, current_date)) as Integer
              ) - cast(strftime ('%Y', "$A".dateOfBirth) as Integer)
            ) * 12
          ) + (
            cast(
              strftime ('%m', coalesce("$A".dateOfDeath, current_date)) as Integer
            ) - cast(strftime ('%m', "$A".dateOfBirth) as Integer)
          ) + (
            (
              case
                when (
                  cast(
                    strftime ('%Y%m', coalesce("$A".dateOfDeath, current_date)) as Integer
                  ) < cast(strftime ('%Y%m', "$A".dateOfBirth) as Integer)
                ) then (
                  cast(
                    strftime (
                      '%d%H%M%S%f0000',
                      coalesce("$A".dateOfDeath, current_date)
                    ) as Integer
                  ) > cast(
                    strftime ('%d%H%M%S%f0000', "$A".dateOfBirth) as Integer
                  )
                )
                else (
                  cast(
                    strftime (
                      '%d%H%M%S%f0000',
                      coalesce("$A".dateOfDeath, current_date)
                    ) as Integer
                  ) < cast(
                    strftime ('%d%H%M%S%f0000', "$A".dateOfBirth) as Integer
                  )
                ) * -1
              end
            )
          )
        ) / 12
      ) as age
    FROM
      sap_capire_bookshop_Authors as "$A"
  )
```

As Patrice reminds us, this is another example of [AXI001 What not how](https://github.com/qmacro/capref/blob/main/axioms/AXI001.md) in action.

[56:45](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=3405s) To wrap this section up, Patrice adds back in the `isAlive` element to the query before executing it, to show that this works too, albeit resulting in a different[<sup>4</sup>](#footnotes) representation of true and false, as SQLite has no Boolean data type:

```javascript
> await cds.ql`SELECT from ${Authors} {name, age, isAlive }`
[
  { name: 'Emily Brontë', age: 30, isAlive: 0 },
  { name: 'Charlotte Brontë', age: 36, isAlive: 0 },
  { name: 'Edgar Allen Poe', age: 40, isAlive: 0 },
  { name: 'Richard Carpenter', age: 82, isAlive: 0 },
  { name: 'Brandon Sanderson', age: 50, isAlive: 1 },
  { name: 'J. R. R. Tolkien', age: 81, isAlive: 0 }
]
```

## Support in CDL as well as CQL

[58:25](https://www.youtube.com/watch?v=FVEbvHMxOIY&t=3505s) Wrapping up, Patrice makes the very good point that this portability afforded by CAP to support different database runtimes is not only at the "runtime" level, i.e. in queries (as we've seen in these examples), but also at the persistence, or data definition level (in particular for views). To illustrate this, Patrice shows us that the view DDL is constructed appropriately, first in the production profile context, i.e. for HANA:

```bash
; cds build --production
building project with {
  versions: { cds: '9.8.0', compiler: '6.8.0', dk: '9.4.3' },
  target: 'gen',
  tasks: [
    { src: 'db', for: 'hana', options: { model: [ 'db', 'srv', '@sap/cds/srv/outbox' ] } },
    { src: 'srv', for: 'nodejs', options: { model: [ 'db', 'srv', '@sap/cds/srv/outbox' ] } }
  ]
}
done > wrote output to:
   gen/db/package.json
   gen/db/src/.hdiconfig
   gen/db/src/gen/.hdiconfig
   gen/db/src/gen/.hdinamespace
   gen/db/src/gen/AdminService.Authors.hdbview
   gen/db/src/gen/AdminService.Books.hdbview
   ... more. Run with DEBUG=build to show all files.

build completed in 2438 ms
```

The DDL for the `Authors` projection in the `AdminService` (in `gen/db/src/gen/AdminService.Authors.hdbview`) looks like this, where the HANA native `years_between` function is available:

```sql
VIEW AdminService_Authors AS SELECT
  Authors_0.createdAt,
  Authors_0.createdBy,
  Authors_0.modifiedAt,
  Authors_0.modifiedBy,
  Authors_0.ID,
  Authors_0.name,
  Authors_0.address_ID,
  Authors_0.academicTitle,
  Authors_0.dateOfBirth,
  Authors_0.dateOfDeath,
  Authors_0.placeOfBirth,
  Authors_0.placeOfDeath,
  CASE WHEN Authors_0.dateOfDeath IS NULL THEN TRUE ELSE FALSE END AS isAlive,
  years_between(Authors_0.dateOfBirth, coalesce(Authors_0.dateOfDeath, current_date)) AS age
FROM sap_capire_bookshop_Authors AS Authors_0
```

In contrast, when, [like earlier](#adding-a-calculated-element), we compile the `AdminService` definitions in the default development profile context i.e. for SQLite:

```bash
cds compile -2 sql srv/admin-service.cds
```

we get this for the `Authors` projection:

```sql
CREATE VIEW AdminService_Authors AS
SELECT
  Authors_0.createdAt,
  Authors_0.createdBy,
  Authors_0.modifiedAt,
  Authors_0.modifiedBy,
  Authors_0.ID,
  Authors_0.name,
  Authors_0.address_ID,
  Authors_0.academicTitle,
  Authors_0.dateOfBirth,
  Authors_0.dateOfDeath,
  Authors_0.placeOfBirth,
  Authors_0.placeOfDeath,
  CASE
    WHEN Authors_0.dateOfDeath IS NULL THEN TRUE
    ELSE FALSE
  END AS isAlive,
  floor(
    (
      (
        (
          (
            CAST(
              strftime (
                '%Y',
                coalesce(Authors_0.dateOfDeath, current_date)
              ) AS Integer
            ) - CAST(strftime ('%Y', Authors_0.dateOfBirth) AS Integer)
          ) * 12
        ) + (
          CAST(
            strftime (
              '%m',
              coalesce(Authors_0.dateOfDeath, current_date)
            ) AS Integer
          ) - CAST(strftime ('%m', Authors_0.dateOfBirth) AS Integer)
        ) + (
          CASE /* For backward intervals: if the composite (day + time) of y is greater than x, add 1. */
            WHEN CAST(
              strftime (
                '%Y%m',
                coalesce(Authors_0.dateOfDeath, current_date)
              ) AS Integer
            ) < CAST(
              strftime ('%Y%m', Authors_0.dateOfBirth) AS Integer
            ) THEN (
              CAST(
                strftime (
                  '%d%H%M%S%f0000',
                  coalesce(Authors_0.dateOfDeath, current_date)
                ) AS Integer
              ) > CAST(
                strftime ('%d%H%M%S%f0000', Authors_0.dateOfBirth) AS Integer
              )
            ) /* For forward intervals: if the composite of y is less than x, subtract 1. */
            ELSE (
              CAST(
                strftime (
                  '%d%H%M%S%f0000',
                  coalesce(Authors_0.dateOfDeath, current_date)
                ) AS Integer
              ) < CAST(
                strftime ('%d%H%M%S%f0000', Authors_0.dateOfBirth) AS Integer
              )
            ) * -1
          END
        )
      )
    ) / 12
  ) AS age
FROM
  sap_capire_bookshop_Authors AS Authors_0;
```

Phew!

## Further info

- [Constraints, expressions and axioms in action](/blog/posts/2026/01/27/constraints-expressions-and-axioms-in-action/)
- [Shift left with CAP](/blog/posts/2026/02/09/shift-left-with-cap/)

## Footnotes

1. This is what was show on Patrice's screen; what you will likely get instead is SQL that is almost the same, except that a technical alias name is used for the `FROM` target, i.e. you will likely see `"$B"` instead of `Books`, like this:

    ```sql
    SELECT
      json_insert(
        '{}', '$."title"', title, '$."author_name"', author_name
      ) as _json_
    FROM
      (
        SELECT
          "$B".title,
          author.name as author_name
        FROM sap_capire_bookshop_Books as "$B"
          left JOIN sap_capire_bookshop_Authors as author
          ON author.ID = "$B".author_ID
        WHERE
          (
            case
              when author.dateOfDeath is null then ?
              else ?
            end
          ) = ?
      )
    ```

    Technical aliases are discussed in a later episode in this series.

1. The SQL that we see here is the SQLite dialect as we're running in development mode by default.

1. Notice that the `coalesce` function is available natively not only in HANA but also in SQLite.

1. When using the hybrid profile and connected to HANA, this is how the query runs:

    ```javascript
    > await cds.ql`SELECT from ${Authors} {name, age, isAlive }`
    [
      { age: 30, isAlive: false, name: 'Emily Brontë' },
      { age: 36, isAlive: false, name: 'Charlotte Brontë' },
      { age: 40, isAlive: false, name: 'Edgar Allen Poe' },
      { age: 82, isAlive: false, name: 'Richard Carpenter' },
      { age: 50, isAlive: true, name: 'Brandon Sanderson' },
      { age: 81, isAlive: false, name: 'J. R. R. Tolkien' }
    ]
    ```
