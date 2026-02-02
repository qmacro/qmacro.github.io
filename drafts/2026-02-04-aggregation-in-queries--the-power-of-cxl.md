---
title: Aggregation in queries - the power of CXL
date: 2026-02-04
tags:
  - cap
  - cds
  - cxl
  - cql
  - aggregation
  - composition
description: CAP's expression language CXL has some powerful features, one of which is aggregation. In this post, I recount one example from a recent live stream episode.
---

In [Part 2](https://www.youtube.com/watch?v=s4IZR1LBRrA) of our current
Hands-on SAP Dev live stream [series on CXL with Patrice
Bender](/blog/posts/2025/12/09/a-new-hands-on-sap-dev-mini-series-on-the-core-expression-language-in-cds/),
Patrice took some time to give us a glimpse of the extent of the power that CXL
can give us. It was in the context of answering a question from one of the live
stream viewers (thanks Stubbs!) in the previous part, and the answer revealed
an inspiring landscape of possibilities.

In this post I want to revisit the question - whether it is possible to iterate
over composition items with expressions. In doing so, I also want to provide
a(n even) simpler scenario and then think about the component parts of the
answer.

## The scenario

In October last year I published the post [Modelling contained-in relationships
with compositions in
CDS](/blog/posts/2025/10/14/modelling-contained-in-relationships-with-compositions-in-cds/),
so I thought it would be nice to use the sample in that post for this
simplified setup.

All we need is a a `services.cds` file in a simple CAP Node.js project, the
usual `package.json`, and some sample data[<sup>1</sup>](#footnotes) in a
`test/data/` directory.

Here's the entire CDS model in `services.cds`, which follows the use of
anonymous aspects as the target of the composition, as explained in the
[Implicit
modelling](/blog/posts/2025/10/14/modelling-contained-in-relationships-with-compositions-in-cds/#implicit-modelling)
section of the blog post.

```cds
service S {
  entity Orders {
    key ID    : Integer;
        Items : Composition of many {
                  key pos : Integer;
                      qty : Integer;
                }
  }
}
```

## Some test data

Then, with `cds add data --out test/data/`, we can create the empty CSV files
that already have the column headers for the `Orders` and `Items`, thus (the
header lines are shown after the # symbols for convenience):

```text
test
└── data
    ├── S.Orders.csv        # ID
    └── S.Orders.Items.csv  # up__ID,pos,qty
```

> Remember that `up__ID` is the result of the concatenation of the [generated
> element name for the parent
> pointer](/blog/posts/2025/10/14/modelling-contained-in-relationships-with-compositions-in-cds/#implicit-modelling:~:text=entity%0A%20%20%20%20elements%3A-,up_%3A,-key%3A%20true)
> (`up_`) with the key element name of the parent (`ID`), using an underscore
> (`_`) to join them together.

And let's have a couple of "orders", one with items representing the first few
values of the Fibonacci sequence[<sup>2</sup>](#footnotes), and another with a
simple integer sequence (1, 2, 3):

The `S.Orders.csv` file just contains:

```csv
ID
1
2
```

and the `S.Orders.Items.csv` contains:

```csv
up__ID,pos,qty
1,10,0
1,20,1
1,30,1
1,40,2
1,50,3
1,60,5
1,70,8
1,80,13
1,90,21
1,100,34
2,10,1
2,20,2
2,30,3
```

## Exploring in the cds REPL

Using the cds REPL[<sup>3</sup>](#footnotes) gives developers a superpower, and
this is amply demonstrated throughout the series by Patrice. So let's follow
Patrice's lead and explore what we have using the cds REPL.

```bash
cds repl --run .
```

The cds REPL starts and a CAP server is started automatically (thanks to the
`--run .`) for the current project, with automatic reflections:

```text
from cds.entities: {
}

from cds.services: {
  db,
  S,
}
```

### Starting simple

Due to the way the `Orders` entity appears [in the CDS model](#the-scenario),
directly within the service definition, we don't see it in the `cds.entities`
list, but we can get to it all the same via the service `S` which is in the
`cds.services` list, for example like this:

```javascript
> S.entities.Orders
entity {
  kind: 'entity',
  elements: LinkedDefinitions {
    ID: Integer { key: true, type: 'cds.Integer' },
    Items: Composition {
      type: 'cds.Composition',
      cardinality: { max: '*' },
      targetAspect: {
        elements: {
          pos: { key: true, type: 'cds.Integer' },
          qty: { type: 'cds.Integer' }
        }
      },
      target: 'S.Orders.Items',
      on: [ { ref: [ 'Items', 'up_' ] }, '=', { ref: [ '$self' ] } ]
    }
  }
}
```

We can also of course simply refer to it by its fully qualified name which
includes the service name as prefix. Let's try that with a first query:

```javascript
> await cds.ql `SELECT from S.Orders`
[ { ID: 1 }, { ID: 2 } ]
```

So far, so good.

### A first look at the items

Let's now expand (I chose that word deliberately) into the items. How about
starting with a bit of denormalisation, asking for a flat list of order IDs and
item positions:

```javascript
> await cds.ql `SELECT from S.Orders { ID, Items.pos }`
[
  { ID: 1, Items_pos: 10 },
  { ID: 1, Items_pos: 20 },
  { ID: 1, Items_pos: 30 },
  { ID: 1, Items_pos: 40 },
  { ID: 1, Items_pos: 50 },
  { ID: 1, Items_pos: 60 },
  { ID: 1, Items_pos: 70 },
  { ID: 1, Items_pos: 80 },
  { ID: 1, Items_pos: 90 },
  { ID: 1, Items_pos: 100 },
  { ID: 2, Items_pos: 10 },
  { ID: 2, Items_pos: 20 },
  { ID: 2, Items_pos: 30 }
]
```


## Footnotes

1. Just for a change, and to remind myself that there's a difference between
   initial data and sample data, I've gone for the latter option. For further
   details on the distinction, see the section [Understand the difference
   between initial and sample
   data](https://github.com/SAP-samples/cap-local-development-workshop/tree/main/exercises/01#understand-the-difference-between-initial-and-sample-data)
   in exercise 01 of the CAP local development workshop from reCAP 2025.
1. Such a beautiful and simple sequence, one I've explored in my journey
   towards functional programming nirvana - see [Learning by Doing - Beginning
   Clojure by Solving
   Puzzles](/images/2025/03/learning-by-doing-beginning-clojure-by-solving-puzzles.pdf)
   and [Building blocks of language, structure and
   thought](https://qmacro.org/blog/posts/2016/01/31/building-blocks-of-language-structure-and-thought/)
1. For an intro to the cds REPL, see [A reCAP intro to the cds
   REPL](/blog/posts/2025/07/21/a-recap-intro-to-the-cds-repl/)
