---
layout: post
title: TASC Notes - Part 8
date: 2025-02-08
tags:
  - tasc
  - cap
  - cds
  - handsonsapdev
---

These are the notes summarising what was covered in [The Art and Science of CAP part 8][1], one episode in a mini series with Daniel Hutzel to explore the philosophy, the background, the technology history and layers that support and inform the SAP Cloud Application Programming Model.

For all resources related to this series, see the post [The Art and Science of CAP][2].

This episode started with me rambling slightly more than usual as I attempted to locate Daniel, but [suddenly, as if by magic, the shopkeeper appeared][4].

![still image from the classic start scene in Mr Benn][6]

(This is the usual start scene from [Mr Benn][5], one of my favourite TV programmes as a young child in the early 1970's, and the phrase above has stuck in my mind ever since).

We took slightly longer to review and discuss [the notes on the previous episode (part 7)][3], as there were some super eye openers that were worth revisiting, not least the beautiful reveal of the parallel between functional programming and aspect oriented techniques, and the proper way to extend entities.

## The relational model

At [23:50][7] Daniel dives back into where we left off in the previous episode, to dwell a little on some important theory in the form of the [Relational Model][8].

At first glance, this seems like hard, somewhat dry theory, but it's critically important for the foundations of CAP, and while it may not help us in our day to day application development work, it will help us build a solid basis of understanding. It's equally if not more important for Daniel and the CAP team building out the framework to ensure that - in and of itself - CAP follows sensible principles that have come before, that have arisen from the hard graft of our computing predecessors.

In particular, Daniel wanted to confirm that the extensions to SQL making CQL a superset, in particular nested projections and path expressions, still conformed to the Relational Model approach to data modelling, storage and retrieval.

### What is a relvar?

I struggled initially to properly grok the meaning and significance of the term "relvar". Building on the context ably set by Daniel in this episode, I found my curiosity getting the better of me (as it always does) and embarked upon a voyage of discovery, starting at that [Relational Model][8] Wikipedia page.

What moved me closer to understanding "relvar" was to realise that the terms I've always used for artifacts and concepts in relational database systems and operations ... are not entirely formal. A relvar, short for relation variable, is from the strictly formal terminology set where:

- tables (or views) are called _relations_
- a table's columns (fields) are called _attributes_
- records (or rows) are called _tuples_

Consequently, a name referring to a table (a relation), such as "Customers", or "Foo" is called a _relation variable_. This is clarified in the Wikipedia page [with reference to Date][9], thus:

> At any given time, all information in the database is represented solely by values within **tuples**, corresponding to **attributes**, in **relations** identified by relvars

(emphasis mine).

Moreover, the term "relational variable" [was introduced][10] in a work by Date and Darwen: [Databases, Types, and The Relational Model: The Third Manifesto][11]. This work is available online thanks to the wonderful Internet Archive's online lending library, and in Chapter 2 "A Survey of the Relational Model" we see a definition of a sample relation (table) `S` to hold supplier information:

```text
VAR S REAL RELATION
  { S# S#, SNAME NAME, STATUS INTEGER, CITY CHAR }
    KEY { S# };
```

This definition helps cement the concept of a relvar through the `VAR` "assignment" or "association" of a relation definition (`{ ... }`) to a name `S`. So we can think of a relvar as a symbol that can reference different values at different times, where the values are actually what we'd normally refer to as "tables" or "views", formally called relations, and the data that they contain, and that we can query.

### Exploring in SQLite

Digging in a little more, Daniel, ever local first, opens the SQLite prompt, which is quite like a REPL itself. He defines a table (relation), and then a view (also a relation), and then uses SQL to add data (a tuple) to the table:

```text
sqlite> create table foo ( a,b,c );
sqlite> create view bar as select * from foo;
sqlite> insert into foo values ( 1,2,3 );
```

While a view is a projection, it is still in essence a table, a relation, in that it contains data.

Next, Daniel summons the god of meta, with:

```text
sqlite> select * from sqlite_schema;
table|foo|foo|2|CREATE TABLE foo ( a,b,c )
view|bar|bar|0|CREATE VIEW bar as select * from foo
```

This is a little easier to comprehend if we look at the [SQLite schema table reference][12]:

```sql
CREATE TABLE sqlite_schema(
  type text,
  name text,
  tbl_name text,
  rootpage integer,
  sql text
);
```

In fact, we can use the SQLite REPL command `.headers on`[<sup>1</sup>](#footnote-1) so that output like this is simpler to understand:

```text
sqlite> .headers on
sqlite> select * from sqlite_schema;
type|name|tbl_name|rootpage|sql
table|foo|foo|2|CREATE TABLE foo ( a,b,c )
view|bar|bar|0|CREATE VIEW bar as select * from foo
```

Having examined the definitions of the fields in `sqlite_schema`, we can interpret these two records (or tuples, to use formal parlance) as:

* `foo --> table(CREATE TABLE foo ( a,b,c )`
* `bar --> view(CREATE VIEW bar as select * from foo`

where the `-->` arrows indicate reference, associating the relvars with the relations.

## Local development, monorepos and workspaces

...

<a name="footnotes"></a>
## Footnotes

<a name="footnote-1"></a>
1. Notice how these REPL commands have a similar structure (they begin with a `.`) to the Node.js / cds REPL.



---

[1]: https://www.youtube.com/watch?v=FF1NzLwsmos
[2]: /blog/posts/2024/12/06/the-art-and-science-of-cap/
[3]: /blog/posts/2025/02/07/tasc-notes-part-7/
[4]: https://youtu.be/AyS5cHO6JN0
[5]: https://en.wikipedia.org/wiki/Mr_Benn
[6]: /images/2025/02/the-shopkeeper-appeared.png
[7]: https://www.youtube.com/live/FF1NzLwsmos?t=1430
[8]: https://en.wikipedia.org/wiki/Relational_model
[9]: https://www.oreilly.com/library/view/relational-theory-for/9781449365431/
[10]: https://en.wikipedia.org/wiki/Relvar
[11]: https://archive.org/embed/databasestypesre0003date
[12]: https://www.sqlite.org/schematab.html
