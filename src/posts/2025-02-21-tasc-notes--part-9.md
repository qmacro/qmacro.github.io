---
mayout: post
title: TASC Notes - Part 9
date: 2025-02-21
tags:
  - tasc
  - cap
  - cds
  - handsonsapdev
---

These are the notes summarising what was covered in [The Art and Science of CAP part 9][1], one episode in a mini series with Daniel Hutzel to explore the philosophy, the background, the technology history and layers that support and inform the SAP Cloud Application Programming Model.

For all resources related to this series, see the post [The Art and Science of CAP][2].

I take a little longer than usual to go through the [notes to the previous part 8][3] as there was so much that Daniel covered and it was worth spending time making sure we're all on the same page.

<a name="whats-in-a-name"></a>
## What's in a name?

At [26:46][4] I finally give Daniel a chance to continue, picking up more or less where we left off last time, and that was with some query action.

Starting with another variation on the queries from last time, Daniel goes for this:

```javascript
await cds.ql `SELECT ID, title, author.name as author from Books`
```

which produces:

```json
[
  { ID: 201, title: 'Wuthering Heights', author: 'Emily Brontë' },
  { ID: 207, title: 'Jane Eyre', author: 'Charlotte Brontë' },
  { ID: 251, title: 'The Raven', author: 'Edgar Allen Poe' },
  { ID: 252, title: 'Eleonora', author: 'Edgar Allen Poe' },
  { ID: 271, title: 'Catweazle', author: 'Richard Carpenter' }
]
```

While Mr Big might have said "[names is for tombstones baby][6]" (a phrase which Daniel recalls, from a colleague, in [part 7][8]), names do a lot of lifting and abstracting. Let's dig in, with `author.name` in this prefix projection clause here. 

We've thought about this already in terms of one of the two main ways that CQL extends SQL, i.e. as a _path expression_. Another term to use which Daniel introduces us to now is a "flattening" which makes a lot of sense, in that we can think of and treat the items in this projection (alternatively the _attributes_ in this _tuple_ shape construction) as flat, as along the same(attribute/tuple) plane. This is of course despite whatever SQL is required to actually realise this query expression - in particular a JOIN (the `.` in the name gives us a clue to this respect).

Talking of JOINs, we must note that, being a path expression, `author.name` benefits from the concept of a "forward declared join" (`author` represents the association). There's a brief mention of this concept in Capire for [associations in CDL][7]:

> "Associations capture relationships between entities. They are like forward-declared joins added to a table definition in SQL."

There's also a longer explanation in the dropdown box within the [Associations][49] section of the Best Practices topic in Capire.

Like the concept of a "relvar", this is something I initially struggled to grok. But having previously asked around internally and got some great help from lovely colleagues (thanks Patrice, Sebastian and Adrian)[<sup>1</sup>](#footnote-1), I think of forward declared joins as a sort of more abstract "preamble" description of a relationship, that might likely be realised by a JOIN at the SQL level. Think of it as an expression of join opportunities with additional info on relationship qualification, i.e. ON conditions, which here are pulled from the managed associations used in the CDS model.

So here `author.name` becomes a JOIN and we are implicitly using the name `author` as a table alias, referring to the `Authors` table that has been joined; Daniel then switches to compile-to-SQL mode and "emits":

```sql
SELECT
  ID,
  title,
  author.name as author
FROM Books
JOIN Authors as author ON author.ID = Books.author_ID
```

<a name="from-to-one-to-to-many-associations"></a>
## From to-one to to-many associations

```text
+---------+                 +---------+
|  Books  | N [---------] 1 | Authors |
+---------+                 +---------+
```

The association from `Books` to `Authors` is a to-one association, and the bi-directional partner is the to-many association from `Authors` to `Books` (head back to [Relations, attributes and values][10] in the notes to part 8 for a reminder):

```javascript
await cds.ql `SELECT ID, name, books.title as book from Authors`
```

At this point (around [31:10][13]) Daniel explains that the path expressions we've seen, simply expressed based on associations as forward declared joins, played an important role in weaning folks off [Object Relational Mapping][11], getting them to embrace query languages (SQL / CQL), by making it easy to express relationships like this ... without having to wrangle JOINs directly[<sup>2</sup>](#footnote-2).

This new query which also has a path expression, this time based on the to-many association (forward declared join) going from `Authors` to `Books`, produces:

```json
[
  { ID: 101, name: 'Emily Brontë', book: 'Wuhering Heights' },
  { ID: 107, name: 'Charlotte Brontë, book: 'Jane Eyre' },
  { ID: 150, name: 'Edgar Allen Poe', book: 'Eleonora' },
  { ID: 150, name: 'Edgar Allen Poe', book: 'The Raven' },
  { ID: 170, name: 'Richard Carpenter', book: 'Catweazle' }
]
```

Observe how this [ad hoc relation][14] is [denormalised][15] - there is redundancy in the tuples owing to the 2 (many) "to-many"[<sup>3</sup>](#footnote-3) association between Edgar Allen Poe and two of his books in the bookshop.

This is the basis of how Daniel shows that CQL is a valid extension to SQL in terms of the Relational Model, remembering also the enhancement to allow non-scalar values in a result set, which we covered at the end of the previous part - see [The universe of discourse and correlated subqueries][16].

<a name="nesting-not-flattening"></a>
### Nesting not flattening

In the previous part we also learned about the [postfix projection][17] approach for queries, enabling us to express the desired tuple shape in a `{ ... }` block that arguably better represents the concept we're aiming for. Here, that would be (in pseudocode[<sup>4</sup>](#footnote-4)):

```text
Authors -> { ID, name, books.title as book }
```

But now it's also much easier to think in terms of nesting, "un-flattening" `books.title` thus:

```javascript
await cds.ql `SELECT from Authors { ID, name, books { title as book } }`
```

What's returned is the same, from a nominal data perspective. But from a shape perspective what's returned is what we might refer to as "deep" and - as far it can refer to object structures - normalised (observe how there's now only one entry for Edgar Allen Poe, but with both books contained):

```json
[
  {
    ID: 101,
    name: 'Emily Brontë',
    books: [ { book: 'Wuthering Heights' } ]
  },
  {
    ID: 107,
    name: 'Charlotte Brontë',
    books: [ { book: 'Jane Eyre' } ]
  },
  {
    ID: 150,
    name: 'Edgar Allen Poe',
    books: [ { book: 'The Raven' }, { book: 'Eleonora' } ]
  },
  {
    ID: 170,
    name: 'Richard Carpenter',
    books: [ { book: 'Catweazle' } ]
  }
]
```

As a bonus side effect of all this hard work (abstraction, extension and dedicated conformance to the constraints of the Relational Model) CAP's support for relational and non-relational (object) persistence mechanisms is impressive.

<a name="its-lookup-tables-all-the-way-down"></a>
## It's lookup tables all the way down

At around [35:12][18] Daniel take the opportunity to both double down on concepts and insights we've covered before, and to drive them home. While still in the cds REPL, he [changes tack][19] slightly and takes another look at the SQLite schema table, the same one that we looked at last week - see [Exploring in SQLite][20].

This time, to add colour, he remains in the cds REPL (rather than switches to the SQLite REPL) and just uses CQL, because "why not?". He also uses a slightly different form of [query construction][21] - the fluent API style:

```javascript
await SELECT.from('sqlite.schema') (fluent API style)
```

rather than the tagged template literal approach:

```javascript
await cds.ql `SELECT from sqlite.schema`
```

_(Accessing the SQLite schema table here feels like finding a secret door to the private rooms in a posh hotel, a door that's been hiding in plain sight but I've just not noticed it.)_

Being in the context of the cds REPL previously started with `cds r -r @capire/bookshop`, with the CDS model compiled and deployed to the persistence layer (a SQLite in-memory database in this case), we see considerably more output than [our previous look][20]. Thirty five entries in the schema, in the lookup table:

```javascript
await cds.ql `SELECT from sqlite.schema` .then(x => x.length) // -> 35
```

One of these that Daniel highlights at random is:

```json
{
  type: 'view',
  name: 'localized_CatalogService_Currencies',
  tbl_name: 'localized_CatalogService_Currencies',
  rootpage: 0,
  sql: 'CREATE VIEW localized_CatalogService_Currencies AS SELECT\n' +
    '  Currencies_0.name,\n' +
    '  Currencies_0.descr,\n' +
    '  Currencies_0.code,\n' +
    '  Currencies_0.symbol,\n' +
    '  Currencies_0.minorUnit\n' +
    'FROM localized_sap_common_Currencies AS Currencies_0'
}
```

The point is that in the "universe of discourse" here, this entry in the lookup table is exactly what we've been talking about - a relvar (`localized_CatalogService_Currencies`, from the `name` property) pointing to, being related to, a relation definition in the `sql` property (`CREATE VIEW ...`) to contain data.

In other words, this database schema is a lookup table of relvars pointing to definitions, and queries relating to those definitions (of relations) have data returned as the "extent".

<a name="universes-and-variables"></a>
## Universes and variables

In the universe of discourse that encapsulates queries, `Authors` is a relvar (as it refer to a relation).

But in another universe of discourse, that of CAP's [LinkedDefinitions][22], `Authors` is a variable but not a relvar; rather than refer to a relation (that can be queried), it refers to the definition at the CDS model level.

Let's have a look, with the help of a [destructuring assignment][23] (to a different variable name `Authors` than the original property name `sap.capire.bookshop.Authors`):


```javascript
{ 'sap.capire.bookshop.Authors': Authors } = cds.model.definitions
```

Here, `Authors` is now a variable, but not a relvar (as there's no relation, no queryable data, on the right hand side of the imaginary arrow):

```shell
> Authors
entity {
  kind: 'entity',
  includes: [ 'managed' ],
  elements: LinkedDefinitions {
    createdAt: Timestamp {
      '@cds.on.insert': { '=': '$now' },
      '@UI.HiddenFilter': true,
      '@UI.ExcludeFromNavigationContext': true,
      '@Core.Immutable': true,
      '@title': '{i18n>CreatedAt}',
      '@readonly': true,
      type: 'cds.Timestamp',
      '@Core.Computed': true,
      '@Common.Label': '{i18n>CreatedAt}'
    },
    createdBy: String {
      '@cds.on.insert': { '=': '$user' },
      '@UI.HiddenFilter': true,
      '@UI.ExcludeFromNavigationContext': true,
      '@Core.Immutable': true,
      '@title': '{i18n>CreatedBy}',
      '@readonly': true,
      '@description': '{i18n>UserID.Description}',
      type: 'cds.String',
      length: 255,
      '@Core.Computed': true,
      '@Common.Label': '{i18n>CreatedBy}',
      '@Core.Description': '{i18n>UserID.Description}'
    },
    modifiedAt: Timestamp {
      '@cds.on.insert': { '=': '$now' },
      '@cds.on.update': { '=': '$now' },
      '@UI.HiddenFilter': true,
      '@UI.ExcludeFromNavigationContext': true,
      '@title': '{i18n>ChangedAt}',
      '@readonly': true,
      type: 'cds.Timestamp',
      '@Core.Computed': true,
      '@Common.Label': '{i18n>ChangedAt}'
    },
    modifiedBy: String {
      '@cds.on.insert': { '=': '$user' },
      '@cds.on.update': { '=': '$user' },
      '@UI.HiddenFilter': true,
      '@UI.ExcludeFromNavigationContext': true,
      '@title': '{i18n>ChangedBy}',
      '@readonly': true,
      '@description': '{i18n>UserID.Description}',
      type: 'cds.String',
      length: 255,
      '@Core.Computed': true,
      '@Common.Label': '{i18n>ChangedBy}',
      '@Core.Description': '{i18n>UserID.Description}'
    },
    ID: Integer { key: true, type: 'cds.Integer' },
    name: String {
      '@mandatory': true,
      type: 'cds.String',
      length: 111,
      '@Common.FieldControl': { '#': 'Mandatory' }
    },
    dateOfBirth: Date { type: 'cds.Date' },
    dateOfDeath: Date { type: 'cds.Date' },
    placeOfBirth: String { type: 'cds.String' },
    placeOfDeath: String { type: 'cds.String' },
    books: Association {
      type: 'cds.Association',
      cardinality: { max: '*' },
      target: 'sap.capire.bookshop.Books',
      on: [ { ref: [ 'books', 'author' ] }, '=', { ref: [ '$self' ] } ]
    }
  }
}
```

<a name="relvars-and-queries-that-declare-relations-revisited"></a>
## Relvars and queries that declare relations (revisited)

![Two Spiderman characters looking at each other, with the word "Authors" below them][25]

_Screenshot from [Double Identity][26] (1967)_

Just as we're reeling with wonder, Daniel introduces the denouement (at around [37:58][24]), subtly at first, by capturing a query in (assigning a query to) a variable (remember, [queries are first class citizens in CAP][27]):

```javascript
authors = cds.ql `SELECT from sap.capire.bookshop.Authors { ID, name, books { title as book } }`
```

What is `authors` here? Well, it's a query, yes:

```text
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Authors' ] },
    columns: [
      { ref: [ 'ID' ] },
      { ref: [ 'name' ] },
      {
        ref: [ 'books' ],
        expand: [ { ref: [ 'title' ], as: 'book' } ]
      }
    ]
  }
}
```

But it's _also a relvar_, because as we learned in the previous part, [queries declare relations][28] (even - or perhaps especially - those with `WHERE` clauses; see the next section for an example of this).

And because `authors` is a relvar, we should be able to use it to make a query.

Can we?

```javascript
await SELECT.from(authors)
```

Of course we can!

```json
[
  {
    ID: 101,
    name: 'Emily Brontë'
    books: [ { book: 'Wuthering Heights' } ]
  },
  {
    ID: 107,
    name: 'Charlotte Brontë',
    books: [ { book: 'Jane Eyre' } ]
  },
  {
    ID: 150,
    name: 'Edgar Allen Poe',
    books: [ { book: 'The Raven' }, { book: 'Eleonora' } ]
  },
  {
    ID: 170,
    name: 'Richard Carpenter',
    books: [ { book: 'Catweazle' } ]
  }
]
```

Boom!

I don't know about you, but this is another beautiful moment, to see the depth to which CAP follows and is informed by the Relational Model. Reflecting on [what the original wiki has to say about the Relational Model][29][<sup>6</sup>](#footnote-6) we see why this is important:

"_It has been the foundation of most database software and theoretical database research ever since._"

> See [Appendix - A note on fully qualified names and reflected variables](#appendix-fully-qualified-names-and-reflected-variables) for further information on this, including the reason this didn't work for Daniel during the live stream.

<a name="defining-a-relvar-as-a-query-with-a-where-clause"></a>
## Defining a relvar as a query with a WHERE clause

Arounbd [39:40][31], answering my question on what we might call such relvars based on queries with `WHERE` clauses, which are then used in queries with `WHERE` clauses themselves, Daniel explains that these relvars are like views. And with their nest-able, or "reflexive" nature, we can have "views upon views upon views upon views ...".

![a photo of a stack of turtles][32]

_Turtles (or views) all the way down - [image courtesy of Pelf and Wikipedia][33]._

Here's an example of that. If we define a relvar `worksOfPoe` (also directly "testing" it) thus:

```shell
> worksOfPoe = cds.ql `SELECT FROM ${Books} { ID, title } WHERE author.name like '%Poe'`
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Books' ] },
    columns: [ { ref: [ 'ID' ] }, { ref: [ 'title' ] } ],
    where: [ { ref: [ 'author', 'name' ] }, 'like', { val: '%Poe' } ]
  }
}
> await worksOfPoe
[ { ID: 251, title: 'The Raven' }, { ID: 252, title: 'Eleonora' } ]
```

then we can think of this as a view, and use it like this:

```shell
> await SELECT.from(worksOfPoe).where(`title like 'The %'`)
[ { ID: 251, title: 'The Raven' } ]
```

<a name="lazy-evaluation-and-late-materialisation"></a>
## Lazy evaluation and late materialisation

Let's go back briefly to a key source of inspiration for CAP, functional programming. There's a particular aspect of functional programming that we haven't mentioned much in this series, and that is [lazy evaluation][34], introduced in the contexts of lambda calculus and programming languages in the 1970's. Lazy (or "delayed") evaluation is where an expression is not evaluated as soon as it's defined and bound to a variable; the evaluation is delayed until a value is actually required.

As Daniel mentions, this is a valuable approach for views in this context too, especially if we have a view defined on a view defined on a view (ad nauseam, if not ad infinitum[<sup>7</sup>](#footnote-7)). The individual materialisation of just one of those views, especially towards the bottom of the stack, might be hundreds of columns (ahem, attributes) but the amalgamated construct of all the views might be just a couple.

Because of late materialisation, the Relational Model equivalent of lazy evaluation, this makes it possible for the engine to perform more efficiently, and ultimately only have to reify tuples consisting of just those two attributes.

<a name="projections-selections-and-infix-notation"></a>
## Projections, selections and infix notation

Continuing at [42:34][35], Daniel enters this into his cds REPL to lay the foundation for explaining infix filters:

```javascript
await cds.ql `
  SELECT 
    FROM Authors {
      ID, name, books { 
        ID, title 
      }
    }
    WHERE ID >= 150
`
```

> For longer examples like this that use the backtick construct (`` `...` ``), I'm experimenting with conveying them across multiple lines; let me know if this makes it easier. By the way, I try to ensure that they're still executable as-is if you copy and paste them (thanks to the [support of multi-line strings in template literals][38]). I'm also thinking of capitalising the CQL keywords as I've done here. Let me know what you think about this too, and what your preference is.

But first, why don't we take the opportunity to stare at this CQL statement and practise getting the terminology right? I find that knowing and using the right terms for technical concepts[<sup>8</sup>](#footnote-8) really helps form solid synaptic connections and is the basis for better understanding and communication.

First, `{ ID, name, books { ID, title } }` is a **projection** and `where ID >= 150` is a **selection** of the `Authors` **relation** (or perhaps even more precisely of the **relation** referred to with the `Authors` **relvar**).

Projections and selections are the two major operations in the Relational Model.

Next, `{ ID, title }` is also a **projection**, of the **relation** referred to via the `books` **relvar**. What Daniel also refers to as an "inner relation". Note that even though it only has a single component, `books` here is also a **path expression** (see [From to-one to to-many associations](#from-to-one-to-to-many-associations) earlier). Note that the **projection** `{ ID, title }` qualifying that relation is a **_postfix_ projection**.

Now, with that out of the way, let's dig in to what this section is really about, and that is the concept of **infix filters**, a syntactic solution, in a way, to finding the right balance between clarity and understanding at the CQL expression level and how much work the compiler has to do (and how much chance there is for an error to occur) to turn the CQL into something the persistence layer can execute. We touched on [infix filters in the notes to part 5 of this series][37] and Daniel gives us an example of an infix filter here.

First, let's look at what the query above returns, which is:

```json
[
  {
    ID: 150,
    name: 'Edgar Allen Poe',
    books: [ { ID: 251, title: 'The Raven' }, { ID: 252, title: 'Eleonora' } ]
  },
  {
    ID: 170,
    name: 'Richard Carpenter',
    books: [ { ID: 271, title: 'Catweazle' } ]
  }
]
```

If we wanted to restrict the output to only show the books that had `ID` values greater than 251 (effectively excluding "The Raven" here) then we might think that this would be the approach, with a selection - a `where` clause (`where ID > 251`) - directly following the nested projection:

```javascript
await cds.ql `
  SELECT 
    FROM Authors {
      ID, name, books { 
        ID, title 
      }
      WHERE ID > 251
    }
    WHERE ID >= 150
` // this is incorrect!
```

Because this would present problems (and possible ambiguities) for the compiler, this is not the way.

_This_ is the way:

```javascript
await cds.ql `
  SELECT 
    FROM Authors {
      ID, name, books[ID > 251] { 
        ID, title 
      }
    }
    WHERE ID >= 150
`
```

which produces:

```json
[
  {
    ID: 150,
    name: 'Edgar Allen Poe',
    books: [ { ID: 252, title: 'Eleonora' } ]
  },
  {
    ID: 170,
    name: 'Richard Carpenter',
    books: [ { ID: 271, title: 'Catweazle' } ]
  }
]
```

There's actually an optional `where` keyword that can be used here for clarity, if you wish, i.e. `books [where ID > 251]`:

In fact, the infix construct `[ ... ]` allows for not only filters, but other query result mechanisms, such as ordering (note here that to get back both books for Poe being returned, the filter was changed from `ID > 251` to `ID > 250`):

```javascript
await cds.ql `
  SELECT 
    FROM Authors {
      ID, name, books[where ID > 251 order by title desc] { 
        ID, title 
      }
    }
    WHERE ID >= 150 order by name desc
`
```

(This doesn't currently work as expected, due to some issues. Watch this space!)

<a name="closures-and-the-universes-of-discourse"></a>
### Closures and the universes of discourse

At [45:27][39], in the context of these CQL statements we've just been playing around with, Daniel declares something that is obvious when we think about it for a second, but is still necessary to say out loud:

* `Authors` and `books` are path expressions
* The "path" part of a path expression always has to start somewhere
* That "somewhere" is a universe of discourse, or scope
* For `books` it is `Authors`
* For `Authors` it is ... _the schema_

and yes:

* These enclosing relationships and references are indeed [similar to closures][40].

<a name="its-all-just-a-path-game"></a>
### "It's all just a path game"

Moving back to the infix notation briefly, Daniel illustrates that "it's all just a path game", and in fact the outermost `WHERE` clause (the selection) on `Authors` could be expressed using infix notation too:

```javascript
await cds.ql `
  SELECT 
    FROM Authors[ID >= 150] {
      ID, name, books[ID > 251] { 
        ID, title 
      }
    }
`
```

Perhaps we should revisit our "definition" of [CQL > SQL][41] to add a third enhancement:

* associations and path expressions
* nested projections

and

* infix filters

What fills me with wonder and amazement at this point is that what we think therefore might be possible, extrapolating from what we've learned thus far in this context ... **is** actually possible.

This does remind me of one adage that is a tagline of Perl, which is that it "_makes easy things easy and hard things possible_". This is of course from the great [Larry Wall][43][<sup>9</sup>](#footnote-9), and possibly originally from the equally great [Alan Kay][44].

[To wit][42]: being "all just a path game", we can stretch these path expressions to hop between associations as we see fit(this is a slightly simplified version based on what Daniel used):

```javascript
await cds.ql `
  SELECT 
    FROM Authors[ID >= 150] {
      name, books.authors.books {
        title 
      }
    }
`
```

This produces a sort of hybrid of [nesting and flattening](#nesting-not-flattening), with the nesting coming from the postfx projection (`books { title }`) and the flattening from the rest of the extended path expression (`books.authors.books`):

```json
[
  {
    name: 'Edgar Allen Poe',
    books_author_books: [ { title: 'The Raven' }, { title: 'Eleonora' } ]
  },
  {
    name: 'Edgar Allen Poe',
    books_author_books: [ { title: 'The Raven' }, { title: 'Eleonora' } ]
  },
  {
    name: 'Richard Carpenter',
    books_author_books: [ { title: 'Catweazle' } ]
  }
]
```

Let's refresh our memories on this CDS model:

```cds
entity Books : {
  key ID : Integer;
  title  : String;
  author : Association to Authors;
}

entity Authors : {
  key ID : Integer;
  name  : String;
  books : Association to many Books on books.author = $self;
}
```

If we look at Mr Poe and his two works, we can clearly see the effect of both. With the nesting, the two books are returned within the one author: `[ { title: 'The Raven' }, { title: 'Eleonora' } ]`.

With the flattening, the author has been denormalised due to the to-many association (`books.`) section within the extended path expression:

```json
[
  {
    name: 'Edgar Allen Poe',
    books_author_books: [ { title: 'The Raven' }, { title: 'Eleonora' } ]
  },
  {
    name: 'Edgar Allen Poe',
    books_author_books: [ { title: 'The Raven' }, { title: 'Eleonora' } ]
  }
]
```

If we go crazy and do this, in the interests of science:

```javascript
await cds.ql `
  SELECT 
    FROM Authors[ID >= 150] {
      name, books.author.books.author.books {
        title 
      }
    }
`
```

we get double the number of records for Mr Poe, as we've followed the to-many association twice through (in the path expression, i.e. not including the postfix projection):

```json
[
  {
    name: 'Edgar Allen Poe',
    books_author_books_author_books: [ { title: 'The Raven' }, { title: 'Eleonora' } ]
  },
  {
    name: 'Edgar Allen Poe',
    books_author_books_author_books: [ { title: 'The Raven' }, { title: 'Eleonora' } ]
  },
  {
    name: 'Edgar Allen Poe',
    books_author_books_author_books: [ { title: 'The Raven' }, { title: 'Eleonora' } ]
  },
  {
    name: 'Edgar Allen Poe',
    books_author_books_author_books: [ { title: 'The Raven' }, { title: 'Eleonora' } ]
  },
  {
    name: 'Richard Carpenter',
    books_author_books_author_books: [ { title: 'Catweazle' } ]
  }
]
```

> Did you notice the subtle but ultimately vast convenience of the [as yet unwritten][45] convention of naming elements in the singular or plural according to the cardinality of the association? In constructing or reading the extended path expression `books.author...` we instinctively know that `books.` represents a to-many association but `author.` represents a to-one association.

<a name="youre-supposed-to-vote-for-my-preference"></a>
### "You're supposed to vote for _my_ preference!"

One way to bring the data back cleanly is to include the `DISTINCT` keyword; and here we get an insight into the inner workings of the CAP team; what seems on the surface like trivial minutiae - where to allow the placement of such a keyword - is, like everything else, an important discussion that will have ramifications long after the discussion is done.

Currently there are two options being debated:

* Daniel prefers the `DISTINCT` to follow the `SELECT` statement directly, as in `SELECT DISTINCT FROM Authors ...`
* The compiler team prefer it after the relvar and projection, as in `SELECT FROM Authors { ... } DISTINCT ...`

Right now, the compiler team have the edge, thus:

```javascript
await cds.ql `
  SELECT 
    FROM Authors[ID >= 150] DISTINCT {
      name, books.author.books.author.books {
        title 
      }
    }
`
```

which produces:

```json
[
  {
    name: 'Edgar Allen Poe',
    books_author_books_author_books: [ { title: 'The Raven' }, { title: 'Eleonora' } ]
  },
  {
    name: 'Richard Carpenter',
    books_author_books_author_books: [ { title: 'Catweazle' } ]
  }
]
```

On playfully expressing a preference for this, I am reprimanded by Daniel. And rightly so ;-)

<a name="expressing-paths-in-the-from-clause"></a>
### Expressing paths in the FROM clause

Not only are path expressions possible in projections, but also even in `FROM` clauses, as Daniel illustrates next (at around [53:14][46]):

```javascript
await cds.ql `
  SELECT 
    FROM sap.capire.bookshop.Authors:books {
      ID, title
    }
`
```

which produces:

```json
[
  { ID: 201, title: 'Wuthering Heights' },
  { ID: 207, title: 'Jane Eyre' },
  { ID: 251, title: 'The Raven' },
  { ID: 252, title: 'Eleonora' },
  { ID: 271, title: 'Catweazle' }
]
```

So far we have seen the use of the period `.` to join parts of a path expression together. But in the context of a `FROM` clause, where we are normally specifying entity names, which can be fully qualified and therefore contain periods (e.g. with a namespace prefix, like here: `sap.capire.bookshop.Authors`), we must use a different character - the colon `:`.

Note that the example above was just to illustrate this contrast between the use of `.` and `:`; you can of course also just say:

```javascript
await cds.ql `
  SELECT 
    FROM Authors:books {
      ID, title
    }
`
```

See the [Path Expressions][47] section of the CQL topic in Capire for further information on this.

<a name="understanding-path-intent-and-realisation"></a>
### Understanding path intent and realisation

At [54:51][48], building on this newfound ability to express paths in the `FROM` clause, Daniel reminds us that with great power comes great responsibility. While it's easy to create CQL queries that get you what you (ostensibly) want, you should always be aware of the implicit intent of the expression, and how it's realised underneath.

Here's an example. At this point in time, the query we just executed (written in-line again so we can compare it more easily with the next one):

```javascript
await cds.ql `SELECT FROM Authors:books { ID, title }`
```

produces this:

```json
[
  { ID: 201, title: 'Wuthering Heights' },
  { ID: 207, title: 'Jane Eyre' },
  { ID: 251, title: 'The Raven' },
  { ID: 252, title: 'Eleonora' },
  { ID: 271, title: 'Catweazle' }
]
```

By way of comparison, this query:

```javascript
await cds.ql `SELECT FROM Books { ID, title }`
```

also produces the same.

The difference becomes evident when we add a new book:

```shell
> await INSERT.into(Books, { title: 'Robin of Sherwood' })
InsertResult { results: [ { changes: 1, lastInsertRowid: 272 } ] }
```

While the `SELECT FROM Books { ID, title }` includes this new book in the result set:

```json
[
  { ID: 201, title: 'Wuthering Heights' },
  { ID: 207, title: 'Jane Eyre' },
  { ID: 251, title: 'The Raven' },
  { ID: 252, title: 'Eleonora' },
  { ID: 271, title: 'Catweazle' },
  { ID: 272, title: 'Robin of Sherwood' }
]
```

the one with the path expression in the `FROM` clause (`SELECT FROM Authors.books { ID, title }`) does not!

Why? Well, consider what we inserted, and what we didn't, plus what the root of the path expression `Authors.books` is:

* the root of the path expression is `Authors`
* the insertion target was `Books`
* the relation between a book and its author is via the `author_ID` foreign key on `Books`
* but we didn't include any value for `author_ID` (spot the `null` value)

```shell
> await cds.ql `SELECT FROM Books { ID, title, author_ID }`
[
  { ID: 201, title: 'Wuthering Heights', author_ID: 101 },
  { ID: 207, title: 'Jane Eyre', author_ID: 107 },
  { ID: 251, title: 'The Raven', author_ID: 150 },
  { ID: 252, title: 'Eleonora', author_ID: 150 },
  { ID: 271, title: 'Catweazle', author_ID: 170 },
  { ID: 272, title: 'Robin of Sherwood', author_ID: null }
]
```

So following the path from `Authors` along the `books` association will not reach any tuple corresponding to this new insertion! But that's the point - the _intent_ implicit in each of these paths is very different:

* all the books in the `Books` relation

vs

* all the books that are reached from entries in the `Authors` relation

Of course, we can "fix" the missing link like this:

```shell
> await UPDATE(Books).set({ author_ID:170 }).where({ ID:272 })
1
```

With the result that we can now find the book if we start from the authors:

```shell
> await cds.ql `SELECT FROM Authors:books { ID, title }`
[
  { ID: 201, title: 'Wuthering Heights' },
  { ID: 207, title: 'Jane Eyre' },
  { ID: 251, title: 'The Raven' },
  { ID: 252, title: 'Eleonora' },
  { ID: 271, title: 'Catweazle' },
  { ID: 272, title: 'Robin of Sherwood' }
]
```

Nice!

By the way, as you have probably guessed by now, the constructs we've seen can be combined pretty much arbitrarily, and Daniel shows this with a final example along this route:

```shell
> await cds.ql `SELECT FROM Authors[name like '%Poe']:books { ID, title }`
[ { ID: 251, title: 'The Raven' }, { ID: 252, title: 'Eleonora' } ]
```

What's combined is:

* a path expression
* an infix filter
a postfix projection

and it all Just Works™️.

Daniel then riffed on extending the path expression as we saw earlier (see ["It's all just a path game"](#its-all-just-a-path-game)), showing how we can force the traversal round and round the associations, but to round this off here's something slightly different - adding a path expression to the postfix projection to "go around" in that way:

```javascript
await cds.ql `
  SELECT 
    FROM Authors[where name like '%Poe']:books {
      ID, title, author.name
    }
`
```

This produces:

```json
[
  { ID: 251, title: 'The Raven', author_name: 'Edgar Allen Poe' },
  { ID: 252, title: 'Eleonora', author_name: 'Edgar Allen Poe' }
]
```

From `Authors` _down_ the `books` to-many association and _back up_ the `author` to-one association for the author's name.

And as a reminder, what would happen if we went the other way?

```javascript
await cds.ql `
  SELECT
    FROM Books:author[name like '%Poe'] {
      ID, name, books.title
    }
`
```

We get:

```json
[
  { ID: 150, name: 'Edgar Allen Poe', books_title: 'Eleonora' },
  { ID: 150, name: 'Edgar Allen Poe', books_title: 'The Raven' }
]
```

Makes sense, right? (And check out that infix filter _on the association_!)

But note that the author name is denormalised. Flattened. Let's finish this off by reminding ourselves of how we avoid that, with a _nested_ projection:

```javascript
await cds.ql `
  SELECT
    FROM Authors[where name like '%Poe'] {
      ID, name, books { 
        ID, title
      }
    }
`

which returns:

```json
[
  {
    ID: 150,
    name: 'Edgar Allen Poe',
    books: [ { ID: 251, title: 'The Raven' }, { ID: 252, title: 'Eleonora' } ]
  }
]
```

<a name="back-to-the-roots"></a>
## Back to the root(s)

We are almost at the end of the episode, but Daniel has a reward for those of us who made it all the way.

What is that reward? Well, the move back along the axis from Science to Art, in a way, revisiting the notional top level `Schema` entity presented at the end of part 7 - see [Wrapping up with relational algebra][50].

> I did debate with myself whether it was from Science to Art, or from Art to Science, but it's a reward for us nonetheless.

Earlier in these notes we dwelled briefly on the fact that "above" every domain entity there's the `Schema`; see the earlier sections:

* [It's lookup tables all the way down](#its-lookup-tables-all-the-way-down)
* [Closures and the universes of discourse](#closures-and-the-universes-of-discourse)

This has largely been notional, but the reward is to see Daniel make it real. How? With a deft CDL flavoured flick of the wrist, as hinted at at the end of part 7, but now as something we have a much better chance of understanding:

```cds
@singleton
entity Schema {
  Authors : Association to many Authors where 1=1;
}
```

Here, we now have a _singleton_ ("[Es kann nur einen geben!][51]") `Schema`, representing the entire context in which our domain entities are resolved.

In fact, the relationship here from `Schema` to `Authors` as an association is as if we've bumped up the entity-ness one level higher (to `Schema`) and proved that the `Authors` entity can actually act as an association in this top level universe of discourse.

```javascript
await cds.ql `SELECT FROM Schema:Authors` // just like <deity> ultimately intended
```

By the way, the `1=1` is a bit like saying "true in all cases" for the predicate.

The CDS model, and CQL as its language, is really based on decades of theory and practice, and we all benefit.

---

That's the end of the notes for this episode. If you made it all the way here, please put a comment below to tell me, and thank you for reading!

---

<a name="appendix-fully-qualified-names-and-reflected-variables"></a>
## Appendix - fully qualified names and reflected variables

In Daniel's demo the unqualified `Authors` entity name was used, which is why it didn't work[<sup>5</sup>](#footnote-5) at the time. The fully qualified name `sap.capire.bookshop.Authors` is needed.

If this is too cumbersome, remember that you have the automatically reflected entities in the cds REPL:

```text
Following variables are made available in your repl's global context:

from cds.entities: {
  Books,
  Authors,
  Genres,
}
``` 

So

```javascript
authors = cds.ql `SELECT from ${Authors} { ID, name, books { title as book } }`
```

would work nicely too (noting here that [we redefined the value for `Authors` earlier](#universes-and-variables), but to the same value :-)).

---

<a name="footnotes"></a>
## Footnotes

<a name="footnote-1"></a>
1. You might also be interested to know that forward declared joins are a core part of [patent US10599650B2 "Enhancements for forward joins expressing relationships"][9], on which Daniel is named as a co-inventor.

<a name="footnote-2"></a>
2. The thought of moving away from query languages towards ORMs and the complexities that come with them "merely" because of the struggle with JOIN syntax reminds me of the classic [Jamie Zawinski][12] quote: _Some people, when confronted with a problem, think "I know, I'll use regular expressions". Now they have two problems_.

<a name="footnote-3"></a>
3. Sorry, I couldn't resist that juxtaposition.

<a name="footnote-4"></a>
4. Pseudocode yes but also deliberately expressed to remind ourselves of what a relvar (`Authors` in this case) is, i.e. something that points (`->`) to a relation (here represented by an ad hoc set of attributes).

<a name="footnote-5"></a>
5. Not because of any breakage in the "infer" code.

<a name="footnote-6"></a>
6. Yes, I couldn't resist referencing the Cunningham & Cunningham wiki, the home of the creator of the wiki Ward Cunningham and indeed [already mentioned in the notes to part 3 of this series][30] too.

<a name="footnote-7"></a>
7. Once a Classics (Latin & Greek) scholar, always a Classics scholar, natch.

<a name="footnote-8"></a>
8. [Beyond the basics, with which folks still seem to be struggling][36].

<a name="footnote-9"></a>
9. Whom I've met a couple of times in my erstwhile role as speaker at the fantastic Foo Camp, Perl Conferences and Open Source Convention (OSCON) conferences, and as member of the Perl community.

---

[1]: https://www.youtube.com/watch?v=Tz7TTM1pOIk
[2]: /blog/posts/2024/12/06/the-art-and-science-of-cap/
[3]: /blog/posts/2025/02/14/tasc-notes-part-8/
[4]: https://www.youtube.com/live/Tz7TTM1pOIk?t=1606
[5]: /blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/#initial-recognition
[6]: https://youtu.be/7pMWa33uVVE
[7]: https://cap.cloud.sap/docs/cds/cdl#associations
[8]: /blog/posts/2025/02/07/tasc-notes-part-7/
[9]: https://patents.google.com/patent/US10599650B2/en
[10]: /blog/posts/2025/02/14/tasc-notes-part-8/#relations-attributes-and-values
[11]: https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping
[12]: https://en.wikipedia.org/wiki/Jamie_Zawinski
[13]: https://www.youtube.com/live/Tz7TTM1pOIk?t=1870
[14]: /blog/posts/2025/02/14/tasc-notes-part-8/#ad-hoc-relation
[15]: https://en.wikipedia.org/wiki/Denormalization
[16]: /blog/posts/2025/02/14/tasc-notes-part-8/#the-universe-of-discourse-and-correlated-subqueries
[17]: /blog/posts/2025/02/14/tasc-notes-part-8/#postfix-projections-and-set-theory
[18]: https://www.youtube.com/live/Tz7TTM1pOIk?t=2112
[19]: https://en.wiktionary.org/wiki/change_tack
[20]: /blog/posts/2025/02/14/tasc-notes-part-8/#exploring-in-sqlite
[21]: https://cap.cloud.sap/docs/node.js/cds-ql#constructing-queries
[22]: https://cap.cloud.sap/docs/node.js/cds-reflect#iterable
[23]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[24]: https://www.youtube.com/live/Tz7TTM1pOIk?t=2275
[25]: /images/2025/02/spiderman-authors.png
[26]: https://www.imdb.com/title/tt0824188/
[27]: /blog/posts/2024/12/16/functions-as-first-class-citizens-in-sicp-lecture-1a/
[28]: /blog/posts/2025/02/14/tasc-notes-part-8/#queries-declare-relations
[29]: https://wiki.c2.com/?RelationalModel
[30]: /blog/posts/2024/11/29/tasc-notes-part-3/
[31]: https://www.youtube.com/live/Tz7TTM1pOIk?t=2380
[32]: /images/2025/02/stack-of-turtles.jpg
[33]: https://en.wikipedia.org/wiki/File:River_terrapin.jpg
[34]: https://en.wikipedia.org/wiki/Lazy_evaluation
[35]: https://www.youtube.com/live/Tz7TTM1pOIk?t=2554
[36]: /blog/posts/2024/01/22/accuracy-and-precision-in-language/
[37]: /blog/posts/2024/12/13/tasc-notes-part-5/#infix-filters
[38]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#multi-line_strings
[39]: https://www.youtube.com/live/Tz7TTM1pOIk?t=2727
[40]: /blog/posts/2025/02/14/tasc-notes-part-8/#a-closure-easter-egg
[41]: /blog/posts/2024/12/13/tasc-notes-part-5/#cql-sql
[42]: https://www.collinsdictionary.com/dictionary/english/to-wit
[43]: https://en.wikipedia.org/wiki/Larry_Wall
[44]: https://en.wikipedia.org/wiki/Alan_Kay
[45]: https://cap.cloud.sap/docs/guides/domain-modeling#naming-conventions
[46]: https://www.youtube.com/live/Tz7TTM1pOIk?t=3194
[47]: https://cap.cloud.sap/docs/cds/cql#path-expressions
[48]: https://www.youtube.com/live/Tz7TTM1pOIk?t=3291
[49]: https://cap.cloud.sap/docs/about/best-practices#associations
[50]: /blog/posts/2025/02/07/tasc-notes-part-7/#wrapping-up-with-relational-algebra
[51]: https://www.youtube.com/watch?v=HEQt_2EBV8A
