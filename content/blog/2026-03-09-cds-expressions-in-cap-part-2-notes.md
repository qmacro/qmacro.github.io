---
title: CDS expressions in CAP - notes on Part 2
date: 2026-03-09
tags:
  - cds
  - cap
  - cql
  - cxl
  - aspects
  - handsonsapdev
description: Notes to accompany Part 2 of the mini-series on the core expression language in CDS.
---

See the [series
post](/blog/posts/2025/12/09/a-new-hands-on-sap-dev-mini-series-on-the-core-expression-language-in-cds/)
for an overview of all the episodes.

<iframe width="560" height="315" src="https://www.youtube.com/embed/s4IZR1LBRrA?si=dOie8WsVetGT24hZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Introduction

[00:00](https://www.youtube.com/watch?v=aiE20i5BP70&t=0s) A rather lengthy introduction and recap (sorry Patrice!).

## The case-when-then-end expression

[09:30](https://www.youtube.com/watch?v=s4IZR1LBRrA&t=570s) Patrice reviews and re-explains the `case ... when ... then ... else` expression in the `@assert` annotation, noting that if neither of the conditions match then the expression evaluates to null:

```cds
annotate AdminService.Books:stock with @assert: (
  case
    when stock < 0 then 'stock must not be negative'
    when stock > 1000 then 'stock exceeds maximum limit of 1000'
  end
);
```

[13:15](https://www.youtube.com/watch?v=s4IZR1LBRrA&t=795s) Starting the cds REPL with `DEBUG=sql` to see what happens under the hood:

```bash
DEBUG=sql cds r --run .
```

Immediately we see many SQL statements being executed due to the automatic deployment to the in-memory SQLite database that's used:

- `DROP VIEW IF EXISTS ...`
- `DROP TABLE IF EXISTS ...`
- `CREATE TABLE ...`
- `INSERT INTO ...`

[15:15](https://www.youtube.com/watch?v=s4IZR1LBRrA&t=915s) Patrice explains [what we missed in the previous part](/blog/posts/2026/03/05/cds-expressions-in-cap-notes-on-part-1/#invoking-run) - the `db` service does not have the hook for the assertion, it's the `AdminService` that does, and that's because it lives not in the DB service but in the [Application Service](https://cap.cloud.sap/docs/node.js/app-services#class-cds-applicationservice).

[22:00](https://www.youtube.com/watch?v=s4IZR1LBRrA&t=1320s) At this point Patrice explains what actually happened, by following the detail emitted in the SQL debug output. There's also a dedicated blog post on this detail: [Constraints, expressions and axioms in action](/blog/posts/2026/01/27/constraints-expressions-and-axioms-in-action/).

The key SQL statement that we focused on was this one:

```sql
SELECT
  Books.ID,
  case
      when Books.stock < ? then ?
      when Books.stock > ? then >
  end as "@assert:stock"
FROM AdminService_Books as Books
WHERE (Books.ID) in ((?), (?))
```

This is executed within the transaction, straight after the record insertion, and, in the `@assert:stock` alias, surfaces either nothing or an error string (from the expression in the `@assert` annotation above); the selection is restricted to the two records specifically just inserted. If something (i.e. an error string) is surfaced from this, then the entire transaction is aborted and rolled back.

[31:20](https://www.youtube.com/watch?v=s4IZR1LBRrA&t=1880s) While some checks are done implicitly in the "before" phase, such as in the built-in `validate_input` here:

```javascript
> AdminService.handlers
EventHandlers {
  _initial: [
    {
      before: '*',
      handler: [Function: check_service_level_restrictions]
    },
    { before: '*', handler: [Function: check_auth_privileges] },
    { before: '*', handler: [Function: check_readonly] },
    { before: '*', handler: [Function: check_insertonly] },
    { before: '*', handler: [Function: check_odata_constraints] },
    { before: '*', handler: [Function: check_autoexposed] },
    { before: '*', handler: [AsyncFunction: enforce_auth] },
    { before: 'READ', handler: [Function: restrict_expand] },
    { before: 'CREATE', handler: [AsyncFunction: validate_input] },
    { before: 'UPDATE', handler: [AsyncFunction: validate_input] },
    { before: 'NEW', handler: [AsyncFunction: validate_input] },
    { before: 'READ', handler: [Function: handle_paging] },
    { before: 'READ', handler: [Function: handle_sorting] }
  ],
  ...
}
```

... such declarative constraints are checked in an "after" phase handler - see the [notes to part 3 of this series](/blog/posts/2026/03/20/cds-expressions-in-cap-notes-on-part-3/) for a clarification.

## A question on reusable expressions

[31:30](https://www.youtube.com/watch?v=s4IZR1LBRrA&t=1890s) At this point we start to look at one of the two questions that were asked at the very end of [part 1](/blog/posts/2026/03/05/cds-expressions-in-cap-notes-on-part-1/) by Ben: "_Would it be possible to build an expression and then re-use it for different assertions?_".

Patrice's answer was based on CAP's embrace of [aspect orientation](/tags/aspects/), specifically at the "db" level, in `db/schema.cds`. First, an aspect defined thus:

```cds
aspect ConstrainedTitle {
  @assert: (
    case
      when length(title) < 2 then 'title must be at least 2 characters long'
    end
  )
  title : String @mandatory;
}
```

and employed like this (where the basic `Books` entity definition does not now have its own `title` element):

```cds
entity Books : managed, ConstrainedTitle {
  key ID    : Integer;
  descr     : localized String(1111);
  ...
}
```

Looking at the CSN, we see that this constraint is included in the `AdminService` as we'd expect:

```bash
; echo 'AdminService.entities.Books.elements.title' | cds r -r .
...
String {
  '@assert': {
    '=': "case when length(title) < 2 then 'title must be at least 2 characters long' end",
    xpr: [
      'case',
      'when',
      {
        func: 'length',
        args: [ { ref: [ 'title' ] } ]
      },
      '<',
      { val: 2 },
      'then',
      { val: 'title must be at least 2 characters long' },
      'end'
    ]
  },
  '@mandatory': true,
  type: 'cds.String',
  '@Common.FieldControl': { '#': 'Mandatory' }
}
```

[36:56](https://www.youtube.com/watch?v=s4IZR1LBRrA&t=2216s) This constraint annotation is propagated up to the "service" level where there's a projection on the `Books` entity. Patrice also points out here something that we might not expect, but happens anyway thanks to the compiler ... even if we change the name of the element, say from `title` to `mytitle` in the projection, the expression is modified accordingly!

To see this in action, here's a temporary modification to the `Books` projection in the `AdminService`, renaming the `title` element to `mytitle`:

```cds
using {sap.capire.bookshop as my} from '../db/schema';

service AdminService {
  entity Books   as
    projection on my.Books {
      *,
      title as mytitle
    }
    excluding { title }

  ...
}
```

The change is effected not only at the `element` level, but within the expression too:

```bash
; echo 'AdminService.entities.Books.elements.mytitle' | cds r -r .
String {
  '@assert': {
    '=': true,
    xpr: [
      'case',
      'when',
      {
        func: 'length',
        args: [ { ref: [ 'mytitle' ] } ]
      },                     ^
      '<',                   |
      { val: 2 },            +--- modified within the expression
      'then',
      { val: 'title must be at least 2 characters long' },
      'end'
    ]
  },
  '@mandatory': true,
  type: 'cds.String',
  '@Common.FieldControl': { '#': 'Mandatory' }
}
```

This constraint works as expected, as we can see from this cds REPL session:

```javascript
> { Books } = AdminService.entities
[object Function]
> insert = INSERT.into(Books).entries({ID:567,author_ID:180,title:"X",stock:1})
cds.ql {
  INSERT: {
    into: { ref: [ 'AdminService.Books' ] },
    entries: [ { ID: 567, author_ID: 180, title: 'X', stock: 1 } ]
  }
}
> await AdminService.run(insert)
Uncaught:
{
  status: 400,
  code: 'ASSERT',
  target: 'title',
  message: 'title must be at least 2 characters long'
}
```

## Connection and deployment to HANA

[39:52](https://www.youtube.com/watch?v=s4IZR1LBRrA&t=2392s) To show that this entire approach is portable across, and abstract from the underlying database systms supported by CAP, Patrice proceeds at this point to show the same thing but with HANA.

First, adding database support for HANA via the facet:

```bash
; cds add hana

Adding facet: hana

Successfully added features to your project
```

Amongst other things (such as creating `db/undeploy.json`), this adds `@cap-js/hana` as a dependency:

```diff
--- a/package.json
+++ b/package.json
@@ -3,6 +3,7 @@
   "version": "1.0.0",
   "description": "A simple CAP project.",
   "dependencies": {
+    "@cap-js/hana": "^2",
     "@sap/cds": "^9",
     "express": "^4"
   },
```

Which, when installed (with `npm install`), adds HANA specific DB parameters to the production profile, which we can see with:

```bash
; cds env requires.db --profile production
{
  impl: '@cap-js/hana',
  data: [ 'db/data', 'db/csv' ],
  pool: {
    min: 0,
    max: 10,
    acquireTimeoutMillis: 1000,
    idleTimeoutMillis: 60000,
    evictionRunIntervalMillis: 100000,
    numTestsPerEvictionRun: 10,
    testOnBorrow: true,
    fifo: false
  },
  kind: 'hana'
}
```

[42:49](https://www.youtube.com/watch?v=s4IZR1LBRrA&t=2569s) Now everything is ready for a deployment to HANA, which Patrice does at this point:

```bash
; cds deploy --to hana
building project with {
  versions: { cds: '9.8.0', compiler: '6.8.0', dk: '9.7.2' },
  target: 'gen',
  tasks: [
    { for: 'hana', src: 'db', options: { model: [ 'db', 'srv', '@sap/cds/srv/outbox' ] } }
  ]
}
done > wrote output to:
   gen/db/package.json
   gen/db/src/gen/.hdiconfig
   gen/db/src/gen/.hdinamespace
   gen/db/src/gen/AdminService.Authors.hdbview
   gen/db/src/gen/AdminService.Books.hdbview
   ...

build completed in 332 ms

using container cxl-bookshop-db
creating service cxl-bookshop-db - please be patient...
creating service key cxl-bookshop-db-key - please be patient...
starting deployment to SAP HANA ...
deploying to HANA from /work/gh/github.com/patricebender/cxl-bookshop/gen/db/
HDI deployer path: /home/dj/.npm-packages/lib/node_modules/@sap/cds-dk/node_modules/@sap/hdi-deploy/library.js
HDI deployer version: 5.6.1
VCAP_SERVICES:

{
  "hana": [
    {
      "name": "cxl-bookshop-db",
      "label": "hana",
      "credentials": {
        "schema": "4DCBA6B626C745E29947D848D3CCEE38",
        "database_id": "442316b0-3ec9-469c-b3ab-2d333c2ecf8f",
        "user": "4DCBA6B626C745E29947D848D3CCEE38_BROA7XLTTVAJ193W0CETRKJF2_RT",
        "hdi_user": "4DCBA6B626C745E29947D848D3CCEE38_BROA7XLTTVAJ193W0CETRKJF2_DT"
      },
      "tags": [
        "hana"
      ]
    }
  ]
}

...

Deployment started ...

   ... (lots of log output deleted)

   Processing work list... ok (2s 70ms)
   Finalizing... ok (0s 126ms)
   Make succeeded (0 warnings): 51 files deployed (effective 58), 0 files undeployed (effective 0), 0 dependent files redeployed
  Making... ok (4s 497ms)
  Enabling table replication for the container schema "4DCBA6B626C745E29947D848D3CCEE38"...
  Enabling table replication for the container schema "4DCBA6B626C745E29947D848D3CCEE38"... ok (0s 17ms)
 Starting make in the container "4DCBA6B626C745E29947D848D3CCEE38" with 51 files to deploy, 0 files to undeploy... ok (4s 586ms)

Deploying to the container "4DCBA6B626C745E29947D848D3CCEE38"... ok (10s 853ms)
...
Deployment ended ...
...
retrieving data from Cloud Foundry...
binding db to Cloud Foundry managed service cxl-bookshop-db:cxl-bookshop-db-key with kind hana
saving bindings to .cdsrc-private.json in profile hybrid
successfully finished deployment
```

## Going hybrid

Right at the end we can see the bindings saved in a project-local `.cdsrc-private.json` file, under the "hybrid" profile name (see the [Hybrid Testing](https://cap.cloud.sap/docs/tools/cds-bind) topic in Capire); the binding information looks similar to this:

```json
{
  "requires": {
    "[hybrid]": {
      "db": {
        "binding": {
          "type": "cf",
          "apiEndpoint": "https://api.cf.us10-001.hana.ondemand.com",
          "org": "38b4ec42trial",
          "space": "dev",
          "instance": "cxl-bookshop-db",
          "key": "cxl-bookshop-db-key"
        },
        "kind": "hana",
        "vcap": {
          "name": "db"
        }
      }
    }
  }
}
```

This binding information is then used to start a cds REPL session ... but in the context of the remote HANA database system[<sup>1</sup>](#footnotes):

```bash
; cds bind --exec --profile hybrid -- cds repl --run .
resolving cloud service bindings...
bound db to cf managed service cxl-bookshop-db:cxl-bookshop-db-key
Welcome to cds repl v 9.8.0
[cds] - using bindings from: { registry: '~/.cds-services.json' }
[cds] - loaded model from 4 file(s):

  srv/cat-service.cds
  srv/admin-service.cds
  db/schema.cds
  node_modules/@sap/cds/common.cds

[cds] - connect to db > hana {
  database_id: '442316b0-3ec9-469c-b3ab-2d333c2ecf8f',
  host: '442316b0-3ec9-469c-b3ab-2d333c2ecf8f.hna1.prod-us10.hanacloud.ondemand.com',
  port: '443',
  driver: 'com.sap.db.jdbc.Driver',
  url: 'jdbc:sap://442316b0-3ec9-469c-b3ab-2d333c2ecf8f.hna1.prod-us10.hanacloud.ondemand.com:443?encrypt=true&validateCertificate=true&currentschema=4DCBA6B626C745E29947D848D3CCEE38',
  schema: '4DCBA6B626C745E29947D848D3CCEE38',
  certificate: '...',
  hdi_user: '4DCBA6B626C745E29947D848D3CCEE38_BROA7XLTTVAJ193W0CETRKJF2_DT',
  hdi_password: '...',
  user: '4DCBA6B626C745E29947D848D3CCEE38_BROA7XLTTVAJ193W0CETRKJF2_RT',
  password: '...'
}
[cds] - using auth strategy { kind: 'mocked' }
[cds] - serving AdminService {
  at: [ '/odata/v4/admin' ],
  decl: 'srv/admin-service.cds:3'
}
[cds] - serving CatalogService {
  at: [ '/odata/v4/catalog' ],
  decl: 'srv/cat-service.cds:3'
}
[cds] - server listening on { url: 'http://localhost:45699' }
[cds] - server v9.8.0 launched in 555 ms
[cds] - [ terminate with ^C ]


------------------------------------------------------------------------
Following variables are made available in your repl's global context:

from cds.entities: {
  Books,
  Authors,
  Addresses,
  Cities,
  Genres,
  Orders,
  OrderItems,
}

from cds.services: {
  db,
  AdminService,
  CatalogService,
}

Simply type e.g. CatalogService in the prompt to use the respective objects.
```

This setup is now complete and we can see that the constraint works here on HANA just the same, too:

```javascript
> { Books } = AdminService.entities
[object Function]
> await AdminService.run(INSERT.into(Books).entries({ ID:567, author_ID:180, title:"X", stock:1 }))
Uncaught:
{
  status: 400,
  code: 'ASSERT',
  target: 'title',
  message: 'title must be at least 2 characters long'
}
```

## A question on iteration and aggregation in expressions

[46:27](https://www.youtube.com/watch?v=s4IZR1LBRrA&t=2787s) Next, Patrice turns to the second of the two questions asked in the previous episode, this time one from Stubbs: "_Can we iterate over composition items with expressions? Example calculate order total amount using line item amounts?_". I've written about the answer to this question in great detail in the post [Path expressions, nested projections, aggregations and expressions in queries with CQL and CXL in CAP](/blog/posts/2026/02/04/path-expressions-nested-projections-aggregations-and-expressions-in-queries-with-cql-and-cxl-in-cap/), so won't dwell any more on it in these notes here.

## Exploring with cds.parse.expr

[54:32](https://www.youtube.com/watch?v=s4IZR1LBRrA&t=3272s) Rounding off this episode, Patrice explores some of the brand new documentation in Capire for [CXL](https://cap.cloud.sap/docs/cds/cxl), and emphasises how easy it is to try things out in the cds REPL.

Starting out as simple as possible with just a literal:

```javascript
> cds.parse.expr` 42 `
{ val: 42 }
```

Then with one of the unary operators `not`:

```javascript
> cds.parse.expr` not foo `
{
  xpr: [ 'not', { ref: [ 'foo' ] } ]
}
```

And with the binary operator `+`, producing an expression made up of a literal (`{ val: 1 }`) followed by the binary operator `'+'` followed by another literal (`{ val: 1}`):

```javascript
> cds.parse.expr` 1 + 1 `
{ xpr: [ { val: 1 }, '+', { val: 1 } ] }
```

With growing confidence we can now construct larger expressions, this time a predicate (based on the `>` binary operator):

```javascript
> cds.parse.expr` (1 + 1) > (1 + 2) `
{
  xpr: [
    { xpr: [ { val: 1 }, '+', { val: 1 } ] },
    '>',
    { xpr: [ { val: 1 }, '+', { val: 2 } ] }
  ]
}
```

Definitely worth trying a few out yourself!

## Further info

- Patrice also has [some great notes for this
  part](https://github.com/patricebender/cxl-bookshop/blob/main/notes/notes-session2.md)

## Footnotes

1. The "hybrid" profile is used as default by `cds bind` so we can omit the `--profile hybrid` here:

    ```bash
    cds bind --exec -- cds repl --run .
    ```
