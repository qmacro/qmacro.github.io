---
title: Constraints, expressions and axioms in action
date: 2026-01-27
tags:
  - cds
  - cap
  - sql
  - database
  - repl
  - assert
  - constraints
description: In this blog post I meditate on how declarative constraints are realised in CAP, using the power of the underlying database.
---

In [part 2](https://www.youtube.com/watch?v=s4IZR1LBRrA) of the current
Hands-on SAP Dev live stream mini-series [on CXL, the core expression language
in
CDS](/blog/posts/2025/12/09/a-new-hands-on-sap-dev-mini-series-on-the-core-expression-language-in-cds/),
Patrice demonstrated how declarative constraints are actually realised, and it
made me sit back and wonder. I thought I'd write a quick blog post summarising
what he showed, as I think it's worth stopping and taking a bit of time to
think about.

## Containers and containees

During the session, Patrice had painted a lovely picture of CAP's CDS language
family, and highlighted that expressions, in
[CXL](https://cap.cloud.sap/docs/cds/cxl) (and its corresponding
machine-readable equivalent [CXN](https://cap.cloud.sap/docs/cds/cxn)) were to
be found in various places, specifically in the context of:

- the definition language [CDL](https://cap.cloud.sap/docs/cds/cdl) (and
  corresponding [CSN](https://cap.cloud.sap/docs/cds/csn))
- the query language [CQL](https://cap.cloud.sap/docs/cds/cql) (and
  corresponding [CQN](https://cap.cloud.sap/docs/cds/cqn))

In other words, from a human perspective, if CXL is a containee, both CDL and
CQL are containers. Expressions are found in model and service definitions and
also in queries.

## Declarative constraints

In the context of service definitions, data for entities and their elements can
be subject to [input
validation](https://cap.cloud.sap/docs/guides/services/constraints#input-validation),
typically provided via annotations. Annotations such as `@mandatory`,
`@readonly`, and `@assert.format`, `@assert.range` & `@assert.target` have been
available for a while and can be used for formal but limited (pre-defined)
types of input validation.

Declarative constraints are relatively new ([reaching "gamma" status in the
December 2025
release](https://cap.cloud.sap/docs/releases/dec25#declarative-constraints))
and extend the possibilities for input validation by allowing us to define our
own conditions, using the CXL expression language, and presenting those
definitions within an `@assert` annotation.

## What not how, less is more

There are a couple of axioms that inform the design and the fundamental
philosophy of the CAP framework:

- [AXI001 What not
  how](https://github.com/qmacro/capref/blob/main/axioms/AXI001.md)
- [AXI002 Less is
  more](https://github.com/qmacro/capref/blob/main/axioms/AXI002.md)

A practical aim, and effect, of these two axioms is to drive custom code
upwards and downwards ... and _out_ of a project:

```text
              +---------------+   -+
              | Definitions   |    |
              | of services   |    |
              |               |    |
              +---------------+    |
                                   +- CDS
              +---------------+    |
              | Domain model  |    |
              | definition    |    |
         ^    |               |    |
    push |    +---------------+   -+
      up |
         |    +---------------+   -+
         +----| Custom        |    |
              | logic         |    +- JavaScript, Java
         +----|               |    |
    push |    +---------------+   -+
    down |
         |    +---------------+   -+
         v    |               |    |
              | Database      |    +- SQL
              |               |    |
              +---------------+   -+
```

The definition of the declarative constraint that Patrice demonstrated,
combined with how it was made real, is a perfect reflection of both the upwards
and downwards push of custom code out of the project.

Let me demonstrate what I mean, with a simplified version.

## Basic model and service definition

Using my hyper-simple
[cdsnano](https://github.com/qmacro/dotfiles/blob/main/scripts/cdsnano) CAP
Node.js tiny project starter, with its
[services.cds](https://github.com/qmacro/dotfiles/blob/main/scripts/cdsnano-template/services.cds),
I get this:

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

## Adding a constraint declaratively

Now let me add a declarative constraint, using `@assert` and a CXL expression.
To keep things simple, I'll put this in the same file:

```cds
annotate Bookshop.Books with {
  title @assert: (case
                    when length(title) < 2
                         then 'Book title is too short!'
                  end)
}
```

The part in brackets (`case when ... then ... end`) is the expression, which is
evaluated; that is, it resolves to a value. Here, this will either be null, if
there's no matched condition[<sup>1</sup>](#footnotes), or the string `'Book
title is too short!'`, which is consequently returned in a 400 status error
back to the client.

### Pushing up

Already we see a prime example of the "push up" part of the diagram. There's no
custom code that we've needed to write and maintain in a handler - we've
elevated the business requirement to the CDS modelling level. There is a small
amount of "code", in the form of the expression, but this is far simpler, which
is one of the key benefits:

- there is zero ceremony: no determining the appropriate event context, no
  setting up of the callback, no marshalling of the arguments, no parsing of
  the request data and no manual returning of the error message
- there is also no free-form language approach to realising the constraint,
  which means a far smaller scope for error
- constraints are accessible to, shared with and driven by the domain expert,
  at the CDS model level

## Trying out the constraint

Can things really be this simple? Let's see.

Starting the CAP server up in one shell session, with `cds watch` as usual, we
can request an OData create operation in a second shell session thus:

```shell
curl \
  --include \
  --header 'Content-Type: application/json' \
  --data '{"ID":1,"title":"a"}' \
  --url localhost:4004/odata/v4/bookshop/Books
```

This returns:

```text
HTTP/1.1 400 Bad Request
OData-Version: 4.0
Content-Type: application/json; charset=utf-8
Content-Length: 109

{
  "error": {
    "message": "Book title is too short!",
    "code": "ASSERT",
    "target": "title",
    "@Common.numericSeverity": 4
  }
}
```

(Some response headers have been left out, and the response payload has been pretty printed for easier reading.)

## Digging in

Patrice used the `DEBUG` environment variable to cause the CAP server to emit
detailed log messages. Let's do that now, and do it in the context of the cds
REPL, which Patrice also used, as it's always a good idea to practise using
that powerful developer tool[<sup>2</sup>](#footnotes).

Starting the cds REPL up, and asking for a CAP server to be started for the
project in the current directory, like this:

```shell
DEBUG=sql cds repl --run .
```

gives us plenty of output at the outset. But what we're interested in is what
happens when we again try to insert the same values.

As we're in the cds REPL, we can construct a query (instead of making an OData
call from "outside"):

```javascript
q = INSERT.into(Bookshop.entities.Books).entries({ID:1,title:'a'})
```

which shows us:

```javascript
cds.ql {
  INSERT: {
    into: { ref: [ 'Bookshop.Books' ] },
    entries: [ { ID: 1, title: 'a' } ]
  }
}
```

Now we can send that to the `Bookshop` service:

```javascript
await Bookshop.run(q)
```

and at this point we see some debug SQL output:

```log
[sql] - BEGIN
[sql] - INSERT INTO qmacro_Books (ID,title) SELECT value->>'$."ID"',value->>'$."title"' FROM json_each(?) [
  [ [ { ID: 1, title: 'a' } ] ]
]
[sql] - SELECT json_insert('{}','$."ID"',ID,'$."@assert:title"',"@assert:title") as _json_ FROM (SELECT "$B".ID,case when length("$B".title) < ? then ? end as "@assert:title" FROM Bookshop_Books as "$B" WHERE ("$B".ID) in ((?))) [ 2, 'Book title is too short!', 1 ]
[sql] - ROLLBACK
```

We also see the result of this (which would be sent back to the client, in the
case of an actual request):

```log
Uncaught:
{
  status: 400,
  code: 'ASSERT',
  target: 'title',
  numericSeverity: 4,
  '@Common.numericSeverity': 4,
  message: 'Book title is too short!'
}
```

## Examining the SQL

What happened here? There are four statements, in sequence:

```sql
BEGIN     -- start a new transaction
INSERT    -- add the record
SELECT    -- check it's valid
ROLLBACK  -- it wasn't, so roll back the transaction
```

### Pushing down

So, a new transaction was started with `BEGIN`, and the record was added with
`INSERT`.

Next, we can see that the constraint, which we expressed declaratively, is
realised by pushing it down to the database, and having it executed there, in
the context of the `SELECT` statement.

Finally, because the data was determined not to be valid, the transaction was
rolled back and the data addition was undone.

Let's reformat the debug SQL output for the `INSERT` and `SELECT` statements
and examine them in detail.

### The INSERT statement

While the focus of this post is on the declarative constraint based data
validation, it's worth looking at not only that (in the `SELECT`
statement) but also the `INSERT` statement, as it also uses some [JSON
functions and constructs](https://sqlite.org/json1.html) and gets our brains in
gear on that front.

```sql
INSERT INTO
  qmacro_Books (ID, title)
SELECT
  value ->> '$."ID"',
  value ->> '$."title"'
FROM
  json_each(?) [ [ [ { ID: 1, title: 'a' } ] ] ]
```

First, the target table is of course the one created for the `Books` entity in
the `qmacro` namespace, and its creation at CAP server startup was logged via
the `DEBUG=sql` switch too:

```sql
CREATE TABLE qmacro_Books (
  ID INTEGER NOT NULL,
  title NVARCHAR(255),
  PRIMARY KEY(ID)
);
```

The `json_each` function returns a row of data for each array item, with `key`,
`value` and other columns[<sup>3</sup>](#footnotes). The `value` column is
`SELECT`ed a couple of times, with the `->>` operator being used to extract
property values (for `ID` and `title`) from the current array item presented in
the value.

So the book data row is inserted.

## The SELECT statement

With the `SELECT` statement, the validity of the data according to the
constraint expression is checked, using SQL, thus mandating the (possibly)
temporary insertion of the data to be validated, within a transaction.

```sql
SELECT
    json_insert(
        '{}',
        '$."ID"',
        ID,
        '$."@assert:title"',
        "@assert:title"
    ) as _json_
FROM
    (
        SELECT
            "$B".ID,
            case
                when length("$B".title) < ? then ?
            end as "@assert:title"
        FROM
            Bookshop_Books as "$B"
        WHERE
            ("$B".ID) in ((?))
    ) [ 2, 'Book title is too short!', 1 ]
```

The `SELECT` itself uses `json_insert` to construct an object that looks like
this:

```json
{
  "ID": <the book ID>,
  "@assert:title": <constraint error message, or null>
}
```

The values in this object come from the nested `SELECT` statement inside the
`FROM`.

Inserting the values into the `?` placeholders for this statement gives
us:

```sql
SELECT
    "$B".ID,
    case
        when length("$B".title) < 2 then 'Book title is too short!'
    end as "@assert:title"
FROM
    Bookshop_Books as "$B"
WHERE
    ("$B".ID) in ((1))
```

Looks familiar, right? The SQL `case` expression here mirrors the source
constraint expression, which has been transliterated and pushed down to the
database layer for execution.

### Possible outcomes

There are two values determined in the inner `SELECT`, one for the book's ID,
and the other for the possible error message. Here's an example of failure and
success:

```text
Inserted   -->   Generated

ID, title        ID, @assert:title
---------        ------------------------------
1,  'a'          1,  'Book title is too short!'
1,  'aa'         1,  null
```

At this point, the validation part of the framework checks the generated values
that are returned, taking appropriate action depending on the value of
`@assert:title`:

- non-null: a `ROLLBACK` is executed, undoing the data insertion, and the error
  is bubbled back up to the client
- null: a `COMMIT` is executed, and the insertion of the data, now determined
  to be valid, remains intact

## Wrapping up

Constraints, as expressions, are powerful. What's more powerful is that these
constraints, to validate input data, are pushed up out of the custom logic
layer, to the declarative layer, and the execution thereof is pushed down to
the database layer. This works for all databases supported by CAP, by the way.

In today's era of assisted programming, and the ever increasing mountain of
generated code, this is a welcome relief, and [exactly the orientation our
internal compass should be set
to](https://qmacro.org/blog/posts/2024/11/07/five-reasons-to-use-cap/#1-the-code-is-in-the-framework-not-outside-of-it).

## Footnotes

1. As it's essentially the same as the SQL equivalent, the `case` expression
   also has an optional final `else` clause which is useful for defining a
   fallback value.
1. It's also because the detailed log message that's emitted in the context of
   `cds watch` is also slighly less forthcoming, due to the way JavaScript
   tends to convey deep structures in an opaque way, i.e. as `[ Object ]`.
1. See the `json_tree` table definition in section [4.23. Table valued
   functions for parsing JSON: json_each(), jsonb_each(), json_tree(), and
   jsonb_tree()
   ](https://sqlite.org/json1.html#table_valued_functions_for_parsing_json_json_each_jsonb_each_json_tree_and_jsonb_tree_)
   of the SQLite documentation on JSON Functions and Operators.
