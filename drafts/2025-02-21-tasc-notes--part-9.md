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

Talking of JOINs, we must note that, being a path expression, `author.name` benefits from the concept of a "forward declared join" (`author` represents the association). We can see a brief mention of this concept in Capire for [associations in CDL][7]:

> "Associations capture relationships between entities. They are like forward-declared joins added to a table definition in SQL."

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

## From to-one to to-many associations

```text
+---------+                 +---------+
|  Books  | N <---------> 1 | Authors |
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

This is the basis of how Daniel shows that CQL is a valid extension to SQL in terms of the relational model, remembering also the enhancement to allow non-scalar values in a result set, which we covered at the end of the previous part - see [The universe of discourse and correlated subqueries][16].

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

As a bonus side effect of all this hard work (abstraction, extension and dedicated conformance to the constraints of the relational model) CAP's support for relational and non-relational (object) persistence mechanisms is impressive.

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

But it's _also a relvar_, because as we learned in the previous part, [queries declare relations!][28].

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

I don't know about you, but this is another beautiful moment, to see the depth to which CAP follows and is informed by the relational model. Reflecting on [what the original wiki has to say about the Relational Model][29][<sup>6</sup>](#footnote-6):

> _It has been the foundation of most database software and theoretical database research ever since._

CAP's intentions and achievements here are worthy of deep reflection.

### A note on fully qualified names and reflected variables

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
