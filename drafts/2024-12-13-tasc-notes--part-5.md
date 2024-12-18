---
layout: post
title: TASC Notes - Part 5
date: 2024-12-13
tags:
  - tasc
  - cap
  - cds
  - handsonsapdev
---
These are the notes summarising what was covered in [The Art and Science of CAP part 5][2], one episode in a mini series with Daniel Hutzel to explore the philosophy, the background, the technology history and layers that support and inform the SAP Cloud Application Programming Model.

For all resources related to this series, see the post [The Art and Science of CAP][1].

This episode started with a review of the previous episode, based on the [notes for that episode][3].

## New cds REPL options

At around [17:30][101] Daniel introduces some of his very recent development work, adding features to the cds REPL, which we'll hopefully see in the next CAP release:

```text
-r | --run <project>
  Runs a cds server from a given CAP project folder, or module name.
  You can then access the entities and services of the running server.
  It's the same as using the repl's builtin .run command.

-u | --use <cds feature>
  Loads the given cds feature into the repl's global context. For example,
  if you specify ql it makes the cds.ql module's methods available.
  It's the same as doing {ref,val,xpr,...} = cds.ql within the repl.
```

As the description for `--run` says, it's a shortcut for starting the REPL and then issuing `.run <project>`. 

The `--use` feature is a little more intriguing, in that it will import, into the REPL's global environment, the values exported by the specified feature. Daniel shows an example for `cds.ql` which -- in his bleeding edge developer version :-) -- includes new, simple utility functions `ref`, `val`, `xpr` and `expand` that make it easier to manually construct CQN representations of queries (which can be quite tricky with all the bracket notation) when working in the REPL.

Here are some examples:

```javascript
ref`foo.bar` // -> { ref: [ 'foo', 'bar' ] }
```

```javascript
val`foo.bar` // -> { val: 'foo.bar' }
```

```javascript
expand`foo.bar` // -> { ref: [ 'foo', 'bar' ], expand: [ '*' ] }
```

and even:

```javascript
expand (`foo.bar`, where`x<11`, orderBy `car`, [ ref`a`, ref`b`, xpr`a+b`])
```

which emits:

```javascript
{
    ref: [ 'foo.bar' ],
    where: [ { ref: [ 'x' ] }, '<', { val: 11 } ],
    orderBy: [ { ref: [ 'car' ] } ],
    expand: [
        { ref: [ 'a' ] },
        { ref: [ 'b' ] },
        {
            xpr: [ { ref: [ 'a' ] }, '+', { ref: [ 'b' ] } ]
        }
    ]
}
```

## Infix filters

While building up this example, Daniel remarks that:

> "CAP CDL has infix filters and so has CQN".

I wanted to take a moment to think about this, and dig into Capire, for two reasons: 

* it was important to understood the meaning and implication of the term "infix filter" and recognise them at the drop of a hat
* these two DSLs (CDL and CQN) are, at least in my mind, orthogonal to one another in a couple of dimensions:

|CDS DSLs|Human|Machine| 
|-|-|-|
|Schema|[CDL][4]|[CSN][5]|
|Queries|[CQL][6]|[CQN][7]|

... and I was curious to understand how an infix filter would be meaninfgul across the two differing pairs of DSLs.

So I took the DSL pair for queries first, and found the [With Infix Filters][8] section (in the [CQL][6] chapter, which makes sense as it's essentially a syntactical construct for humans, not machines), which has this example:

```sql
SELECT books[genre='Mystery'].title from Authors
 WHERE name='Agatha Christie'
```

Given that the term "infix" implies "between" (as in [infix notation][9]), the `[genre='Mystery']` part is the infix filter in this example[<sup>1</sup>](#footnote-1).

But what about infix filters in CDL? Well, you can add a filter to an association, as shown in the [Association-like calculated elements][10] section of the [CDL][4] chapter with this example:

```cds
entity Employees {
  addresses : Association to many Addresses;
  homeAddress = addresses [1: kind='home'];
}
```

And still in a CDL context, but moving from defining to publishing, there's another example in the [Publish Associations with Filter][11] section:

```cds
entity P_Authors as projection on Authors {
  *,
  books[stock > 0] as availableBooks
};
```

## Diving into query objects

To tie this back to what Daniel was showing in the REPL, we can resolve the CQL example above (looking for an author's books in the "Mystery" genre) into its canonical object representation in CQN, in the REPL, using an explicit call to `cds.parse.cql` like this:

```log
> cds.parse.cql(`
... SELECT books[genre='Mystery'].title
... from Authors
... where name='Agatha Christie'
... `)
{
  SELECT: {
    from: { ref: [ 'Authors' ] },
    columns: [
      {
        ref: [
          {
            id: 'books',
            where: [ { ref: [ 'genre' ] }, '=', { val: 'Mystery' } ]
          },
          'title'
        ]
      }
    ],
    where: [ { ref: [ 'name' ] }, '=', { val: 'Agatha Christie' } ]
  }
}
```

Alternatively, and steering us back on track, we can use the literate-style "query building" functions similar to what Daniel did in the subsequent `SELECT` call (around [21:43][102]), like this:

```log
> SELECT `books[genre='Mystery'].title` .from `Authors` .where `name='Agatha Christie'`
Query {
  SELECT: {
    from: { ref: [ 'Authors' ] },
    columns: [
      {
        ref: [
          {
            id: 'books',
            where: [ { ref: [ 'genre' ] }, '=', { val: 'Mystery' } ]
          },
          'title'
        ]
      }
    ],
    where: [ { ref: [ 'name' ] }, '=', { val: 'Agatha Christie' } ]
  }
}
```

### Trying out an infix filter

To complete the circle and also experience for myself how it feels to instantiate queries and run them in the REPL, I took this same CQL infix example:

```sql
SELECT books[genre='Mystery'].title from Authors
 WHERE name='Agatha Christie'
```

... and constructed an equivalent query on the Northbreeze dataset[<sup>2</sup>](#footnote-2). Doing that helped me think about what is going on in this query, which is the traversal of a relationship (`Authors -> books`) with a restriction on the destination entity (via an infix filter) as well as on the source entity.

Here's that equivalent query:

```sql
SELECT Products[Discontinued=false].ProductName from northbreeze.Suppliers
 WHERE CompanyName='Tokyo Traders'
```

And here it is being constructed:

```log
> q1 = cds.parse.cql(`
... SELECT Products[Discontinued=false].ProductName
... from northbreeze.Suppliers
... WHERE CompanyName='Tokyo Traders'
... `)
{
  SELECT: {
    from: { ref: [ 'northbreeze.Suppliers' ] },
    columns: [
      {
        ref: [
          {
            id: 'Products',
            where: [ { ref: [ 'Discontinued' ] }, '=', { val: false } ]
          },
          'ProductName'
        ]
      }
    ],
    where: [ { ref: [ 'CompanyName' ] }, '=', { val: 'Tokyo Traders' } ]
  }
}
```

### Executing Queries

Note that what's produced here is a query object (in CQN) but not something that is immediately `await`-able (see [the notes from part 4][18]).

This is in contrast to the query object that is produced from the literate query building approach which looks like this, with an assignment to `q2`[<sup>3</sup>](#footnote-3):

```log
q2 = SELECT
 .columns(`Products[Discontinued=false].ProductName`)
 .from `northbreeze.Suppliers`
 .where `CompanyName='Tokyo Traders'`
```

This produces the same CQN object ... but wrapped within a `Query` object:

```log
Query {
  SELECT: {
    columns: [
      {
        ref: [
          {
            id: 'Products',
            where: [ { ref: [ 'Discontinued' ] }, '=', { val: false } ]
          },
          'ProductName'
        ]
      }
    ],
    from: { ref: [ 'northbreeze.Suppliers' ] },
    where: [ { ref: [ 'CompanyName' ] }, '=', { val: 'Tokyo Traders' } ]
  }
}
```

To execute the first query object, we must pass it to `cds.run`:

```log
> await cds.run(q1)
[
  { Products_ProductName: 'Ikura' },
  { Products_ProductName: 'Longlife Tofu' }
]
```

but the `Query`-wrapped CQN object is directly `await`-able:

```log
> await q2
[
  { Products_ProductName: 'Ikura' },
  { Products_ProductName: 'Longlife Tofu' }
]
```

### The OData V4 equivalent

If you're curious to understand how this query might be represented in OData, and see the data for yourself, [here's the corresponding query operation][19], shown here[<sup>4</sup>](#footnote-4) with extra whitespace to make it easier to read:

```url
https://developer-challenge.cfapps.eu10.hana.ondemand.com
  /odata/v4/northbreeze
  /Suppliers
  ?$expand=Products(
    $select=ProductName;
    $filter=Discontinued eq false
  )
  &$filter=CompanyName eq 'Tokyo Traders'
```

This query produces this entityset result:

```json
{
  "@odata.context": "$metadata#Suppliers(Products(ProductName,ProductID))",
  "value": [
    {
      "SupplierID": 4,
      "CompanyName": "Tokyo Traders",
      "ContactName": "Yoshi Nagase",
      "ContactTitle": "Marketing Manager",
      "Address": "9-8 Sekimai Musashino-shi",
      "City": "Tokyo",
      "Region": "NULL",
      "PostalCode": "100",
      "Country": "Japan",
      "Phone": "(03) 3555-5011",
      "Fax": "NULL",
      "HomePage": "NULL",
      "Products": [
        {
          "ProductID": 10,
          "ProductName": "Ikura"
        },
        {
          "ProductID": 74,
          "ProductName": "Longlife Tofu"
        }
      ]
    }
  ]
}
```

### CQL > SQL

Wrapping up this section, Daniel highlights a couple of the major enhancements to SQL that are in CQL:

* associations and path expressions
* nested projections

And this caused me to [stare][22] a little bit more at the examples, such as this one:

```sql
SELECT.from`foo.bar[where x<11 order by car]{ a, b, a + b}`
```

also underlines the _abstract_ nature of CQL: have you noticed that we have been constructing CQN objects -- query objects -- with no relation (no pun intended) to real metadata? The query objects produced make little sense in that there _is no_ `foo.bar`, there _is no_ `x` or `car`[<sup>5</sup>](#footnote-5), and so on.

But that is irrelevant when working at the abstract level of the CQL/CQN DSL pairing, because it's only when the query object is sent to a database service that it gets translated into something "real". And that is something quite beautiful.

## Composite services and mashups

At around [24:15][103] Daniel picks up a thread from a previous episode in this series, and explains more about how mixins, from Aspect Oriented Programming, can be used to [flatten hierarchies][24] and bring independent services together to form a composite application.

How? By mashing up the services using the aspect-based power of CDL.

In the [cloud-cap-samples][25] repo, there are various CAP services in separate directories, such as `bookshop` and `reviews`. There's also `bookstore` which is a composite of those two services. To have these services know about each other, the NPM [workspace][25] concept is used, in that the root `package.json` file includes:

```json
```


<a name="footnotes"></a>
## Footnotes

<a name="footnote-1"></a>
1. I know this seems obvious, but sometimes it's helpful to stare at the obvious for a while, in a "kata" style of memory reinforcement.

<a name="footnote-2"></a>
2. Which is Suppliers, Products and Categories, with relationships between them (if you want to peruse such a service, there's one available at <https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze>).

<a name="footnote-3"></a>
3. You can paste multiple lines into the REPL, or edit multiple lines yourself, using the `.editor` REPL command (see the [Commands and special keys][16] section of the Node.js REPL documentation). You can also use [template literals][17] (`` `...` ``) for multiline strings.

<a name="footnote-4"></a>
4. See the [Improved $expand][20] section of my talk on [OData V4 and SAP Cloud Application Programming Model][21] for more on the complex `$expand` value.

<a name="footnote-5"></a>
5. I know that `car` is just a subsequent value derived from `bar`, but I like to think that it's a respectful reference to a core building block of the language that provided so much fundamental thinking for functional programming, which in turn has informed CAP. I'm talking of course about the [primitive operation `car` in Lisp][23].


<a name="appendix"></a>
## Appendix - test environment with Northbreeze

In working through some of the examples Daniel illustrated, I used the container-based CAP Node.js 8.5.1 environment I described in the [Appendix - setting up a test environment][12] in the [notes from part 4][3], with the [Northbreeze][13] service (a sort of cut-down version of the classic Northwind service).

When instantiating the container, I avoided making it immediately ephemeral (by not using [the `--rm` option][14], and giving it a name with `--name`); I also added an option to publish port 4004 from the container, so the invocation that I used was:

```shell
docker run -it --name part5 -p 4004:4004 cap-8.5.1 bash
```

At the Bash prompt within the container, I then cloned the [Northbreeze][13] repository, and started a cds REPL in there:

```shell
node ➜ ~
$ git clone https://github.com/qmacro/northbreeze && cd northbreeze
Cloning into 'northbreeze'...
remote: Enumerating objects: 35, done.
remote: Counting objects: 100% (35/35), done.
remote: Compressing objects: 100% (25/25), done.
remote: Total 35 (delta 8), reused 33 (delta 6), pack-reused 0 (from 0)
Receiving objects: 100% (35/35), 20.85 KiB | 577.00 KiB/s, done.
Resolving deltas: 100% (8/8), done.
node ➜ ~/northbreeze (main)
$
```

I then started a cds REPL session and within that session I [started up the CAP server on port 4004][15]:

```shell
node ➜ ~/northbreeze (main)
$ cds r
Welcome to cds repl v 8.5.1
> cds.test('.','--port',4004)
<ref *1> Test { test: [Circular *1] }
> [cds] - loaded model from 2 file(s):

  srv/main.cds
  db/schema.cds

[cds] - connect to db > sqlite { url: ':memory:' }
  > init from db/data/northwind-Suppliers.csv
  > init from db/data/northwind-Products.csv
  > init from db/data/northwind-Categories.csv
/> successfully deployed to in-memory database.

[cds] - using auth strategy {
  kind: 'mocked',
  impl: '../../../usr/local/share/npm-global/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds/lib/srv/middlewares/auth/basic-auth'
}

[cds] - using new OData adapter
[cds] - serving northbreeze { path: '/northbreeze' }

[cds] - server listening on { url: 'http://localhost:4004' }
[cds] - launched at 12/18/2024, 12:05:58 PM, version: 8.5.1, in: 609.947ms
[cds] - [ terminate with ^C ]

>
```


[1]: /blog/posts/2024/12/06/the-art-and-science-of-cap/
[2]: https://www.youtube.com/live/BpTDnYxoNXI
[3]: /blog/posts/2024/12/10/tasc-notes-part-4/

[4]: https://cap.cloud.sap/docs/cds/cdl
[5]: https://cap.cloud.sap/docs/cds/csn
[6]: https://cap.cloud.sap/docs/cds/cql
[7]: https://cap.cloud.sap/docs/cds/cqn

[8]: https://cap.cloud.sap/docs/cds/cql#with-infix-filters
[9]: https://en.wikipedia.org/wiki/Infix_notation
[10]: https://cap.cloud.sap/docs/cds/cdl#association-like-calculated-elements
[11]: https://cap.cloud.sap/docs/cds/cdl#publish-associations-with-filter
[12]: /blog/posts/2024/12/10/tasc-notes-part-4/#appendix1
[13]: https://github.com/qmacro/northbreeze
[14]: https://docs.docker.com/reference/cli/docker/container/run/#rm
[15]: https://hachyderm.io/deck/@qmacro/113673469026384747
[16]: https://nodejs.org/api/repl.html#commands-and-special-keys
[17]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
[18]: /blog/posts/2024/12/10/tasc-notes-part-4/#await
[19]: https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze/Suppliers?$expand=Products($select=ProductName;$filter=Discontinued%20eq%20false)&$filter=CompanyName%20eq%20%27Tokyo%20Traders%27
[20]: https://github.com/qmacro/odata-v4-and-cap/blob/main/slides.md#improved-expand
[21]: https://github.com/qmacro/odata-v4-and-cap
[22]: /blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/#initialrecognition
[23]: https://en.wikipedia.org/wiki/CAR_and_CDR
[24]: /blog/posts/2024/11/08/flattening-the-hierarchy-with-mixins/
[26]: https://docs.npmjs.com/cli/v8/using-npm/workspaces

[101]: https://www.youtube.com/live/BpTDnYxoNXI?t=1050
[102]: https://www.youtube.com/live/BpTDnYxoNXI?t=1302
[103]: https://www.youtube.com/live/BpTDnYxoNXI?t=1455
