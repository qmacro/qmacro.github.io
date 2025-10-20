---
title: Quiet cds test output - two ways
date: 2025-10-20
tags:
  - cds
  - test
  - cap
  - node
description: Reducing CAP server log output during tests, in two different ways, via a profile encapsulated set of log level configurations, or via the new cds test command.
---

## Background

I watched Mauricio Lauffer's Devtoberfest session [Testing SAP CAP Node.js apps with cds.test](https://www.youtube.com/watch?v=6kfixPTQH4U) yesterday, it was great. Thanks Mauricio! It's a nice accompaniment to the [Testing with cds.test](https://cap.cloud.sap/docs/node.js/cds-test) topic in Capire.

## Setting up a test project

I set up a small project to try things out myself (using CAP Node.js, with my `@sap/cds-dk` at 9.4.1):

```bash
cds init --add tiny-sample,test proj && cd $_ && npm i
```

This produced:

```log
creating new CAP project in ./proj

adding nodejs
adding tiny-sample
adding test
> writing test/CatalogService.test.js

successfully created project – continue with cd proj

find samples on https://github.com/capire/samples
learn about next steps at https://cap.cloud.sap

added 134 packages, and audited 135 packages in 5s

25 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

I was now in the position to experiment.

## The basic testing artifacts

By default, adding the `test` facet created `test/CatalogService.test.js`:

```log
.
├── README.md
├── app
├── db
│   ├── data
│   │   └── my.bookshop-Books.csv
│   └── schema.cds
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── srv
│   └── cat-service.cds
└── test
    └── CatalogService.test.js
```

Additionally, in `package.json`:

- `@cap-js/cds-test` was added as a dev dependency
- a new script `test` was added which invokes `node --test`

The `test/CatalogService.test.js` file contains a fixture to test the `CatalogService` endpoint, specifically the `Books` entityset, where I modified the expected book subset to be one of the items in the initial data, i.e. `{"ID": 2, "title": "Jane Eyre"}`.

So far so good.

## The first test run

When I invoke the test cycle, with `npm test` (causing `node --test` to run), I see this:

```log
> proj@1.0.0 test
> node --test

[cds] - loaded model from 3 file(s):

  srv/cat-service.cds
  node_modules/@sap/cds/srv/outbox.cds
  db/schema.cds

[cds] - connect to db > sqlite { url: ':memory:' }
  > init from db/data/my.bookshop-Books.csv
/> successfully deployed to in-memory database.

[cds] - using auth strategy {
  kind: 'mocked',
  impl: 'node_modules/@sap/cds/lib/srv/middlewares/auth/basic-auth.js'
}
[cds] - serving CatalogService {
  at: [ '/odata/v4/catalog' ],
  decl: 'srv/cat-service.cds:3',
  impl: 'node_modules/@sap/cds/srv/app-service.js'
}
[cds] - server listening on { url: 'http://localhost:34593' }
[cds] - server v9.4.3 launched in 185 ms
✔ <next> (105.447291ms)
[odata] - GET /odata/v4/catalog/CatalogService.Books { '$select': 'ID,title' }
▶ OData APIs
  ✔ serves CatalogService.Books (18.874042ms)
✔ OData APIs (19.020667ms)
ℹ tests 1
ℹ suites 2
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 220.950041

```

That's quite a lot of output, and it's not as easy as it could be to discern what happened.

## Using cds.log.levels

One way to address this, [as Mauricio did](https://github.com/mauriciolauffer/devtoberfest2025/blob/main/package.json), is to reduce the output of certain modules to nothing, using `silent` for various `cds.log.levels` components, in `package.json`:

```json
{
  "cds": {
    "log": {
      "levels": {
        "cds": "silent",
        "cds.serve": "silent",
        "odata": "silent",
        "deploy": "silent"
      }
    }
  }
}
```

This makes the test output less noisy, for sure:

```log
> proj@1.0.0 test
> node --test

✔ <next> (100.910208ms)
▶ OData APIs
  ✔ serves CatalogService.Books (19.222666ms)
✔ OData APIs (19.378125ms)
ℹ tests 1
ℹ suites 2
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 212.527334
```

But it also makes regular CAP server log output a little mute - when running `cds watch`, this is all that is emitted:

```log
cds serve all --with-mocks --in-memory?
( live reload enabled for browsers )

        ___________________________

[cds] - connect using bindings from: { registry: '~/.cds-services.json' }
```

A little too quiet.

## Wrapping log level settings in a profile

As the Capire documentation explains, [configuration profiles](https://cap.cloud.sap/docs/node.js/cds-env#profiles) are easy to use and can be employed in various ways.

I can contextualise these reductions in log output to a configuration profile, I'll call it "quiet":

```json
{
  "cds": {
    "[quiet]": {
      "log": {
        "levels": {
          "cds": "silent",
          "cds.serve": "silent",
          "odata": "silent",
          "deploy": "silent"
        }
      }
    }
  }
}
```

Then I can run `cds watch` as normal and get the output I expect:

```log
cds serve all --with-mocks --in-memory?
( live reload enabled for browsers )

        ___________________________

[cds] - loaded model from 3 file(s):

  srv/cat-service.cds
  node_modules/@sap/cds/srv/outbox.cds
  db/schema.cds

[cds] - connect using bindings from: { registry: '~/.cds-services.json' }
[cds] - connect to db > sqlite { url: ':memory:' }
  > init from db/data/my.bookshop-Books.csv
/> successfully deployed to in-memory database.

[cds] - using auth strategy {
  kind: 'mocked',
  impl: 'node_modules/@sap/cds/lib/srv/middlewares/auth/basic-auth.js'
}
[cds] - serving CatalogService {
  at: [ '/odata/v4/catalog' ],
  decl: 'srv/cat-service.cds:3',
  impl: 'node_modules/@sap/cds/srv/app-service.js'
}
[cds] - server listening on { url: 'http://localhost:4004' }
[cds] - server v9.4.3 launched in 245 ms
[cds] - [ terminate with ^C ]
```

But I can add the profile specification to the `test` NPM script via `CDS_ENV` or `NODE_ENV` like this:

```json
{
  "scripts": {
    "start": "cds-serve",
    "test": "CDS_ENV=quiet node --test"
  }
}
```

This keeps the test run output quiet and manageable:

```log
> proj@1.0.0 test
> CDS_ENV=quiet node --test

✔ <next> (115.602208ms)
▶ OData APIs
  ✔ serves CatalogService.Books (21.739417ms)
✔ OData APIs (21.917125ms)
ℹ tests 1
ℹ suites 2
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 231.362166
```

## Using cds test

In another great Devtoberfest session, [CAP Tools - What's New and Hot](https://www.youtube.com/watch?v=HLlX_e-kXJw), Christian Georgi took us through some really cool new tools for development and testing.

One of these was the new `cds test` command.

But very briefly, instead of using `node --test`, with (or without) the `CDS_ENV=quiet` setting, I can use the `cds test` command, which runs the tests and has a lovely succinct output:

```log
  OData APIs
    ✔ serves CatalogService.Books

 1 passed
 0.259s
```

How neat is that?!

## Wrapping up

To find out more, you should watch the replay of Christian's session, after watching the replay of Mauricio's session too, of course.

Happy testing!



