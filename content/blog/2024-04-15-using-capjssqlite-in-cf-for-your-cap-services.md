---
title: Using @cap-js/sqlite in CF for your CAP services
date: 2024-04-15
tags:
  - good-to-know
  - sqlite
  - cap
  - cf
---
I published a couple of short posts recently:

* [Running non-production CAP services in CF](/blog/posts/2024/04/15/running-non-production-cap-services-in-cf/)
* [Easily add an explicit cds.requires.db to your CAP project's package.json](/blog/posts/2024/04/14/easily-add-an-explicit-cds.requires.db-to-your-cap-project's-package.json/)

Both of them are related to going from zero to cloud, while still in design time, as quickly as possible. Partly to learn about the differences and similarities, but also simply because you can, and it elicits very interesting insights into how things work.

If you're going to take this approach of pushing a newly initialised CAP project to CF, and want to continue enjoying the default CAP server approach of using SQLite in-memory for the data layer, then you probably want to read those two blog posts, but also this one, because there's a fascinating combination of circumstances which means that unless you take steps to avoid it, you'll encounter an error when performing OData operations.

## The error

While the CAP service in CF will start, and will serve you the landing page, the OData service document and even the OData metadata document, when it comes to serving actual entities (such as in response to a OData QUERY operation on a `Books` entity set, for example), you'll get this:

```xml
<error xmlns="http://docs.oasis-open.org/odata/ns/metadata">
    <code>500</code>
    <message>No database connection</message>
    <annotation term="Common.numericSeverity" type="Edm.Decimal">4</annotation>
</error>
```

Oops! Let's see why this happens, and what we can do to prevent it happening. We'll do that with a simple example very similar to the ones in the two posts mentioned earlier.

## Setup

I love how I can [get up and running](https://cap.cloud.sap/docs/get-started/jumpstart#jumpstart-cap-projects) with a basic but fully operational OData service with CAP in about 10 seconds. I'll do that now[<sup>1</sup>](#footnotes), and immediately also ask (with `tree`) for a quick overview of the files and directories created:

```shell
cds init --add tiny-sample qmacro-test \
  && cd $_ \
  && tree
```

The output looks something like this:

```text
Creating new CAP project in ./qmacro-test

Adding feature 'nodejs'...
Adding feature 'tiny-sample'...

Successfully created project. Continue with 'cd qmacro-test'.
Find samples on https://github.com/SAP-samples/cloud-cap-samples
Learn about next steps at https://cap.cloud.sap
.
|-- README.md
|-- app
|-- db
|   |-- data
|   |   `-- my.bookshop-Books.csv
|   `-- data-model.cds
|-- package.json
`-- srv
    `-- cat-service.cds

5 directories, 5 files
```

Lovely. Key for us here is what's in `package.json`:

```json
{
  "name": "qmacro-test",
  "version": "1.0.0",
  "description": "A simple CAP project.",
  "repository": "<Add your repository here>",
  "license": "UNLICENSED",
  "private": true,
  "dependencies": {
    "@sap/cds": "^7",
    "express": "^4"
  },
  "devDependencies": {
    "@cap-js/sqlite": "^1"
  },
  "scripts": {
    "start": "cds-serve"
  }
}
```

## Dependencies vs devDependencies

Note the `dependencies` and `devDependencies` sections, to define package requirements in general, and package requirements for when we're in development, or "design time". In that latter section we have the SQLite package in the form of `@cap-js/sqlite`. This is the right place for it, as it's very unlikely (apart from in the context of these experimental and throwaway services) that we'll want to use SQLite outside of the design time cycle.

We can already see this difference in the way that we can run the CAP server.

### Design time with cds watch

Running it with `cds watch`, a design time command, allows us to successfully request the books. Here's some of the log output from `cds watch`:

```text
[cds] - connect using bindings from: { registry: '~/.cds-services.json' }
[cds] - connect to db > sqlite { database: ':memory:' }
  > init from db/data/my.bookshop-Books.csv
/> successfully deployed to in-memory database.

[cds] - serving CatalogService { path: '/odata/v4/catalog' }

[cds] - server listening on { url: 'http://localhost:4004' }
```

And when a request is made for the Books entity set we can see that the request is served successfully:

```shell
; curl -s localhost:4004/odata/v4/catalog/Books | jq .
{
  "@odata.context": "$metadata#Books",
  "value": [
    {
      "ID": 1,
      "title": "Wuthering Heights",
      "stock": 100
    },
    {
      "ID": 2,
      "title": "Jane Eyre",
      "stock": 500
    }
  ]
}
```

### Runtime with cds serve

In contrast, `cds serve`, a runtime (not design time) command, will not successfully respond to such a request. Here's the equivalent log output from `cds serve`:

```text
[cds] - loaded model from 2 file(s):

  srv/cat-service.cds
  db/data-model.cds

[cds] - serving CatalogService { path: '/odata/v4/catalog' }

[cds] - server listening on { url: 'http://localhost:4004' }
```

These following log lines, that we saw when we ran `cds watch`, are conspicuous by their absence:

```text
[cds] - connect to db > sqlite { database: ':memory:' }
  > init from db/data/my.bookshop-Books.csv
/> successfully deployed to in-memory database.
```

Moreover, a similar OData QUERY made on the Books entity set results in an error:

```shell
; curl -s localhost:4004/odata/v4/catalog/Books | jq .
{
  "error": {
    "code": "500",
    "message": "No database connection",
    "@Common.numericSeverity": 4
  }
}
```

> The difference between the JSON output here, and the XML output shown earlier, is that the XML output earlier was from a web browser, which sends different values in the content negotiation part of the HTTP request made, compared to what is sent by curl[<sup>2</sup>](#footnotes).

As well as the error being surfaced to the requester, we also have this output in the CAP server log:

```text
[odata] - GET /odata/v4/catalog/Books
[cds] - Error: No database connection
    at ApplicationService.<anonymous> (/usr/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds/libx/_runtime/common/generic/crud.js:31:22)
    at next (/usr/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds/lib/srv/srv-dispatch.js:68:36)
    at ApplicationService.handle (/usr/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds/lib/srv/srv-dispatch.js:72:6)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async _readCollection (/usr/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds/libx/_runtime/cds-services/adapter/odata-v4/handlers/read.js:246:19)
    at async /usr/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds/libx/_runtime/cds-services/adapter/odata-v4/handlers/read.js:538:16 {
  numericSeverity: 4,
  id: '1041709',
  level: 'ERROR',
  timestamp: 1713181867229
}
```

That's fine, I hear you say. Not unexpected! That's right. But it's also a clue as to the difference between design time and runtime.

## Addressing the behaviour - locally

Under normal circumstances, this is correct behaviour, and doesn't need "fixing". But I find it fascinating to understand why things happen like this, and how they relate to other related areas. 

So let's try to hack thing so they work in this runtime context.

Actually, all one needs to do is to get `npm` to install the `@cap-js/sqlite` package so that it appears in the runtime (`dependencies`) section, rather than the design time (`devDependencies`) section. 

So, in the project's root, running:

```shell
npm install --save-prod @cap-js/sqlite
```

> Use of the [--save-prod](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file#adding-dependencies-to-a-packagejson-file-from-the-command-line) option is crucial here.

will result in something very interesting - the `@cap-js/sqlite` entry we saw earlier (in `package.json`) moves from the `devDependencies` section into the `dependencies` section. What's more, the (now empty) `devDependencies` section disappears!

```json
{
  "name": "qmacro-test",
  "version": "1.0.0",
  "description": "A simple CAP project.",
  "repository": "<Add your repository here>",
  "license": "UNLICENSED",
  "private": true,
  "dependencies": {
    "@cap-js/sqlite": "^1.6.0",
    "@sap/cds": "^7",
    "express": "^4"
  },
  "scripts": {
    "start": "cds-serve"
  }
}
```

Now even `cds serve` will use SQLite, emitting this in the log output on startup:

```text
[cds] - connect to db > sqlite { database: ':memory:' }
  > init from db/data/my.bookshop-Books.csv
/> successfully deployed to in-memory database.
```

and will response successfully to OData QUERY operations.

## The behaviour - in CF

It turns out that exactly the same thing would happen if we push our CAP service, in its raw design time form, to the cloud. And it's for the same reason - the invocation of the CAP server in a deployment scenario like this is `cds-serve`, as we can see from the `package.json#scripts.start` property.

So performing the `npm install --save-prod` before pushing to CF will in fact bring about the same effect.

Note that when pushing, you'll still need to set the `NODE_ENV` to something other than production, using the approach described in [Running non-production CAP services in CF](/blog/posts/2024/04/15/running-non-production-cap-services-in-cf/), in other words: 

```shell
cf push qmacro-test --no-start \
  && cf set-env qmacro-test NODE_ENV testing \
  && cf restage qmacro-test
```

which will bring about this in the log output:

```text
Restaging app qmacro-test in org ...
   ...
   -----> Creating runtime environment
   NODE_ENV=testing
   NODE_HOME=/tmp/contents2269148642/deps/0/node
   NODE_MODULES_CACHE=true
   NODE_VERBOSE=false
   NPM_CONFIG_LOGLEVEL=error
   NPM_CONFIG_PRODUCTION=true
   npm scripts will see NODE_ENV=production (not 'testing')
   https://docs.npmjs.com/misc/config#production
   ...

Restarting app qmacro-test in org ...
...
     state     since                  cpu    memory     disk       logging        details
#0   running   2024-04-15T12:33:54Z   0.0%   0B of 0B   0B of 0B   0B/s of 0B/s
```

## Using NPM_CONFIG_PRODUCTION in CF

That's all well and good, but perhaps as hacks go, a little blunt. However, there's another way. As a result of digging into this in a slightly wider context, my focus was eventually directed to this part of the log output:

```text
NODE_ENV=testing
NODE_HOME=/tmp/contents2269148642/deps/0/node
NODE_MODULES_CACHE=true
NODE_VERBOSE=false
NPM_CONFIG_LOGLEVEL=error
NPM_CONFIG_PRODUCTION=true
npm scripts will see NODE_ENV=production (not 'testing')
https://docs.npmjs.com/misc/config#production
```

First, `NODE_ENV` is set as we want it, to `testing` (i.e. something other than `production`). This means that we can have our basic -- effectively still design time flavoured -- CAP server run fine in CF, without requiring production grade facilities.

But notice these two lines:

```text
NPM_CONFIG_PRODUCTION=true
npm scripts will see NODE_ENV=production (not 'testing')
```

What's that?!

It [turns out](https://medium.com/@pere.solaclaver/set-up-staging-environment-in-heroku-374376cd40c) that there's a difference between `NODE_ENV` and everything that implies (and consequently everything that behaves according to the value that is set for it), and how the Node.js package installer tool `npm` sees the world in CF.

The value of `NPM_CONFIG_PRODUCTION` affects how `npm` behaves. Which in turn affects how the CAP project is set up once pushed to CF (because Node.js packages are installed in situ in CF, rather than transferred with the "push" operation, of course).

And if `NPM_CONFIG_PRODUCTION` is set to `true`, which it is by default here, then any packages listed in the `package.json#devDependencies` are NOT installed. 

So, for example, if I start from scratch, with:

```shell
cds init --add tiny-sample qmacro-test \
  && cd $_ \
```

and therefore have this in the project's `package.json` again:

```json
{

  "dependencies": {
    "@sap/cds": "^7",
    "express": "^4"
  },
  "devDependencies": {
    "@cap-js/sqlite": "^1"
  }

}
```

Then I can achieve a successful push to, and execution within, CF, of my still "design time" CAP service, by also modifying the value for `NPM_CONFIG_PRODUCTION` while I'm there modifying `NODE_ENV` already.

Beginning with the push [with the `--no-start` option](/blog/posts/2024/04/15/running-non-production-cap-services-in-cf/#--no-start):

```shell
cf push qmacro-test --no-start
```

Then modifying the values of the two environment variables:

```shell
cf set-env qmacro-test NODE_ENV testing
cf set-env qmacro-test NPM_CONFIG_PRODUCTION false
```

While we're here, let's enable remote access to the app, like this (so we can [verify](#trust-but-verify) things shortly):

```shell
cf enable-ssh qmacro-test
```

And finally the restage to start things up:

```shell
cf restage qmacro-test
```

And in the log output for the restage, we see lines like this:

```text
Restaging app qmacro-test in org
   ...
   NODE_ENV=testing
   NPM_CONFIG_PRODUCTION=false
   NODE_HOME=/tmp/contents28472526/deps/0/node
   NODE_MODULES_CACHE=true
   NODE_VERBOSE=false
   NPM_CONFIG_LOGLEVEL=error
   -----> Building dependencies
   Installing node modules (package.json)
   added 114 packages, and audited 115 packages in 4s
   ...

Restarting app qmacro-test in org 
...

     state     since                  cpu    memory     disk       logging        details
#0   running   2024-04-15T13:41:30Z   0.0%   0B of 0B   0B of 0B   0B/s of 0B/s
```

And the best thing? Everything works as if it were still in design time. OData operations to retrieve data work as expected. And there's been absolutely nothing modified from the pure, just-initialised CAP project.

<a name="trust-but-verify"></a>
## Trust but verify

Embracing that old adage [trust, but verify](/blog/posts/2021/06/14/the-apc-smt750ic-ups-works-with-the-synology-nas-ds1621+/#trust-but-verify), let's take a look. Just before starting the service up in CF, we enabled SSH access. So now we can use that to peek at what's there. First, let's satisfy ourselves that the contents of `package.json` are as they were, i.e. unchanged from the project initialisation:

```shell
cf ssh qmacro-test -c "cat app/package.json" \
  | jq '{ dependencies, devDependencies }'
```

This emits what we expect to see, with `@cap-js/sqlite` still in the `devDependencies` section:

```json
{
  "dependencies": {
    "@sap/cds": "^7",
    "express": "^4"
  },
  "devDependencies": {
    "@cap-js/sqlite": "^1"
  }
}
```

Plus, we can see what's been installed, for example like this:

```shell
cf ssh qmacro-test --command 'ls app/node_modules/@*'
```

This will emit:

```text
app/node_modules/@cap-js:
cds-types
db-service
sqlite

app/node_modules/@sap:
cds
cds-compiler
cds-fiori
cds-foss
```

And there we can see that even in this CF environment, we have the `@cap-js/sqlite` package installed. All because of the value of `false` that we set for `NPM_CONFIG_PRODUCTION`.

Good to know!

---

<a name="footnotes"></a>
## Footnotes

1) The cds version I'm running right now is 7.8, as you can see from the output from `cds v`:

```text
@cap-js/cds-types: 0.2.0
@sap/cds: 7.8.0
@sap/cds-compiler: 4.8.0
@sap/cds-dk (global): 7.8.1
@sap/cds-fiori: 1.2.3
@sap/cds-foss: 5.0.0
@sap/cds-mtxs: 1.17.0
@sap/eslint-plugin-cds: 2.6.7
Node.js: v20.11.1
home: /usr/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds
```

2) A key [content negotiation](/tags/conneg/) header in HTTP requests is `Accept`, describing to the server what representation is desirable or acceptable for the resource being returned. Chrome sends this value (as one string, but split over lines here for readability):

```text
text/html,
application/xhtml+xml,
application/xml;q=0.9,
image/avif,
image/webp,
image/apng,
*/*;q=0.8,
application/signed-exchange;v=b3;q=0.7
```

and curl sends this value: 

```text
*/*
```

by default. So the server (the CAP server, in this case) endeavours to comply to the more specific request from Chrome by supplying the OData entity set resource in XML, while it will be able to "relax" a little bit and just sent the default representation (JSON) in response to the request from curl.
