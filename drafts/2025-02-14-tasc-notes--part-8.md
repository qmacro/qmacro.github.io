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

At first glance, this seems like hard, somewhat dry theory, but it's important for the foundations of CAP, and while it may not help us in our day to day application development work, it will help us build a solid basis of understanding. It's equally if not more important for Daniel and the CAP team building out the framework to ensure that - in and of itself - CAP follows sensible principles that have come before, that have arisen from the hard graft of our computing predecessors.

In particular, Daniel wanted to confirm that the extensions to SQL making CQL a superset, in particular nested projections and path expressions, still conformed to the Relational Model approach to data modelling, storage and retrieval.

<a name="what-is-a-relvar"></a>
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

<a name="exploring-in-sqlite"></a>
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

## Local development, submodules and workspaces

While we've [talked briefly about monorepos][13] previously in this series, it's worth revisiting for a second here too, where at around [29:30][14] Daniel outlines his local development setup which is based on an "umbrella" Node.js project using submodules and workspaces.  

![local development][15]

The huge advantage to this approach is that you have everything at hand, locally. You can read more on the approaches used:

* [Working with submodules][16]
* [NPM workspaces][17] (also covered in the recent series on CAP Node.js Plugins - see [Creating our own plugin package][18] in the notes to part 1 of that series)

Daniel highlights a particular advantage of embracing workspaces: not having to connect to the cloud when building a constellation of interdependent microservices; rather, everything can be developed locally. "Like having your own private NPM registry", too.

And in explaining how he works with application projects in the context of his development "environment" (directory and file structure), I learned today how Node.js searches for modules: not just in the project's `node_modules/` directory, but "upwards" through the directory hierarchy too. This is explained nicely in [Loading from node_modules folders][19], and we can see how that works in Daniel's context here:

![Daniel's directory and file structure][20]

> Daniel pointed out that `cdr/` was the very first implementation of CAP from 2016, where he was working along on it; and it stands for "CDS Done Right" :-)

Here, for the example application repository "nexus" cloned into the `verse/` directory, Node.js will search for modules in a `node_modules/` directory:

1. in the `nexus/` directory itself (not found)
1. in the containing `verse/` directory (also not found)
1. in the directory that contains `verse/` (which is `cap/`)

At this point, because of the symbolic link (identified in the screenshot as `node_modules@`) that points to the `node_modules/` directory inside of the `dev/` directory, the CAP modules are found and loaded, from exactly where Daniel wants them loaded, from his local copy of whatever version of CAP he's working on or managing at that time.

```text
$HOME/
|
+- cap/
   |
   +- dev/
   |  |
   |  +-- node_modules/ <-+
   |                      |
   +- node_modules@ ------+
   |
   +- verse/
      |
      +- nexus/
```

Node.js, [unlike dogs ... according to Big Al][21], _can_ look up.

To underline the utility and convenience of this structure and approach, Daniel starts the cds REPL with the `--run` option (shortened to `-r`) specifying ... the _package_ (module) name, not the directory name:

```shell
[cap/cakes] cds r -r @capire/bookshop
Welcome to cds repl v 8.8.0
[cds] - loaded model from 5 file(s):

  ../dev/cap/samples/bookshop/srv/user-service.cds
  ../dev/cap/samples/bookshop/srv/cat-service.cds
  ../dev/cap/samples/bookshop/srv/admin-service.cds
  ../dev/cap/samples/bookshop/db/schema.cds
  ../dev/cds/common.cds

```

Note the locations of each of these five loaded files!

## Queries declare relations!

Daniel started the cds REPL at around [36:45][22] with the "bookshop" service to have something concrete with which to illustrate the close proximity of CAP (and CDS and CQL in particular) to the formal relational model.

Consider this:

```javascript
await cds.ql `SELECT ID,name from Authors`
```

Here, `Authors` is the name of an entity, in CDS model terms. It also happens to be a table (at the [persistence layer level](#exploring-in-sqlite)).

But critically, this is a _relvar_.

What's returned ... is a set of _tuples_ (four, in this case):

```json
[
  { ID: 101, name: 'Emily Brontë' },
  { ID: 107, name: 'Charlotte Brontë' },
  { ID: 150, name: 'Edgar Allen Poe' },
  { ID: 170, name: 'Richard Carpenter' }
]
```

each containing attributes (`ID` and `name`).

Now consider this:

```javascript
await cds.ql `SELECT ID,name,books.title from Authors`
```

Spot the `books.title` path expression?

This is what's returned:

```json
[
  { ID: 101, name: 'Emily Brontë', books_title: 'Wuthering Heights' },
  { ID: 107, name: 'Charlotte Brontë', books_title: 'Jane Eyre' },
  { ID: 150, name: 'Edgar Allen Poe', books_title: 'Eleonora' },
  { ID: 150, name: 'Edgar Allen Poe', books_title: 'The Raven' },
  { ID: 170, name: 'Richard Carpenter', books_title: 'Catweazle' }
]
```

The result is another set of tuples, where the path expression has been materialised into just another attribute `books_title` (despite any JOIN shenanigans going on under the surface to make this happen). This result set is ... a _relation_.

But it's not a relation pre-declared like `S` (see [What is a relvar?](#what-is-a-relvar) earlier); it's a relation declared ad hoc _with the query_.

In SQL (and consequently CQL): queries describe (declare) relations.












---

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
[13]: /blog/posts/2024/12/10/tasc-notes-part-4/#the-run-command
[14]: https://www.youtube.com/live/FF1NzLwsmos?t=1770
[15]: /images/2025/02/local-development.png
[16]: https://github.blog/open-source/git/working-with-submodules/
[17]: https://docs.npmjs.com/cli/v8/using-npm/workspaces
[18]: /blog/posts/2024/10/05/cap-node.js-plugins-part-1-how-things-work/#creating-our-own-plugin-package
[19]: https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders
[20]: /images/2025/02/node-module-search-ascent.png
[21]: https://www.youtube.com/watch?v=c3MzYIo0Wxc
[22]: https://www.youtube.com/live/FF1NzLwsmos?t=2146
