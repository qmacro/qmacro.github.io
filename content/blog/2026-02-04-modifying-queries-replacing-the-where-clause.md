---
title: Modifying queries, replacing the WHERE clause
date: 2026-02-04
tags:
  - cap
  - cql
  - cqn
description: Here's a quick post to explain how to modify existing query objects in CAP, specifically using the CAP Node.js cds.ql API.
---

The result of modifying existing queries can be a little unexpected at first. For example, you might have a query object where you want to replace the WHERE clause before you execute it. Here's how not to do it, and then how to do it.

## Setup

To illustrate, we can use my [cdsnano](https://github.com/qmacro/dotfiles/blob/main/scripts/cdsnano) script to set up a tiny project with a [services.cds](https://github.com/qmacro/dotfiles/blob/main/scripts/cdsnano-template/services.cds) file containing:

```cds
context qmacro {
  entity Books {
    key ID    : Integer;
        title : String;
  }
}

service Bookshop {
  entity Books as projection on qmacro.Books;
}
```

Let's add a couple of sample books in `test/data/qmacro-Books.csv`:

```csv
ID,title
1,Book 1
2,Book 2
```

Now we can start up the cds REPL and ask for a CAP server to be started for this project:

```bash
cds repl --run .
```

## Creating the query

Let's create a query object with a WHERE condition:

```javascript
> q1 = cds.ql `
  SELECT from ${Bookshop.entities.Books} where title = 'Book 1'
`
cds.ql {
  SELECT: {
    from: { ref: [ 'Bookshop.Books' ] },
    where: [ { ref: [ 'title' ] }, '=', { val: 'Book 1' } ]
  }
}
```

This works as expected:

```javascript
> await db.run(q1)
[ { ID: 1, title: 'Book 1' } ]
```

## Modifying the query (wrong)

Let's say we want to change the WHERE condition, to retrieve any book with a title starting with "Book".

What happens when we do this:

```javascript
> q1.where(`title like 'Book%'`)
cds.ql {
  SELECT: {
    from: { ref: [ 'Bookshop.Books' ] },
    where: [
      { ref: [ 'title' ] },
      '=',
      { val: 'Book 1' },
      'and',
      { ref: [ 'title' ] },
      'like',
      { val: 'Book%' }
    ]
  }
}
```

The `.where(...)` does not replace, but append - notice that both predicates:

- `title = 'Book 1'`
- `title like 'Book%'`

are present, and joined with a logical `and`.

The result of this query is not what we want:

```javascript
> await db.run(q1)
[ { ID: 1, title: 'Book 1' } ]
```

## Modifying the query (right)

We can replace the WHERE clause completely, supplying a new predicate, like this:

```javascript
> q1.SELECT.where = cds.ql.predicate `title like 'Book%'`
[ { ref: [ 'title' ] }, 'like', { val: 'Book%' } ]
```

And indeed, this is what the entire query object looks like now:

```javascript
> q1
cds.ql {
  SELECT: {
    from: { ref: [ 'Bookshop.Books' ] },
    where: [ { ref: [ 'title' ] }, 'like', { val: 'Book%' } ]
  }
}
```

This does what we want:

```javascript
> await db.run(q1)
[
  { ID: 1, title: 'Book 1' },
  { ID: 2, title: 'Book 2' }
]
```

Nice!

For more info, check out the [Querying in JavaScript](https://cap.cloud.sap/docs/node.js/cds-ql) topic in Capire, which, in the upcoming January 2026 release (that should be out in the next few days) will be expanded and fully constructed.
