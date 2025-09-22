---
title: A reCAP intro to the cds REPL
description: Here's a summary of my talk on the cds REPL at this year's reCAP event.
date: 2025-07-21
tags:
  - talk
  - cap
  - cds
  - repl
  - recap
  - codeconnect
---
At [reCAP], part of [Code Connect 2025], I gave a talk on the cds REPL: "Gain a superpower by learning how to harness the cds REPL". You can watch the recording on the [replay site]; this post is a sort of summary and accompaniment, and an extension to [my previous post on the topic]. Read this post while watching the replay.

![A selfie with the audience](/images/2025/07/audimax-shot.png)

## Setting up

Using my [cap-con-img] repo I built an image with the (at the time) latest CAP Node.js release which was 9.1.0 and launched a throwaway (`--rm`) container from it (I actually used `./buildver latest` which will also work but today will give you a newer version of course):

```bash
; gh repo clone https://github.com/qmacro/cap-con-img \
  && cd cap-con-img \
  && ./buildbase \
  && ./buildver 9.1.0 \
  && docker run --rm -it cap-9.1.0 bash
node ➜ ~
$
```

> For orientation, my local shell prompt is `;`, the shell prompt inside the container is `$` and the cds REPL prompt will be `>`.

Once at the container shell prompt I initialised a new CAP project based on the `tiny-sample` facet, installing `@sap-cloud-sdk/http-client` too, as I'll need that towards the end of the talk:

```bash
$ cds init --add tiny-sample tiny-sample \
  && cd tiny-sample \
  && npm add @sap-cloud-sdk/http-client
```

Here's what the entire project structure (minus the `node_modules/` content) looks like:

```bash
$ tree -AI node*
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
└── srv
    └── cat-service.cds
```

Then I started the cds REPL:

```shell
$ cds repl
Welcome to cds repl v 9.1.0
>
```

It's also worth looking at the entire CDS model in source form, as it will provide the background for what I explore.

At the "db" layer there is `db/schema.cds`:

```cds
namespace my.bookshop;

entity Books {
  key ID : Integer;
  title  : String;
  stock  : Integer;
}
```

At the "service" layer there is `srv/cat-service.cds`:

```cds
using my.bookshop as my from '../db/schema';

service CatalogService {
    @readonly entity Books as projection on my.Books;
}
```

## Getting help

The cds REPL is based on the Node.js REPL and asking for help shows the regular Node.js REPL commands plus `.run` and `.inspect` which are specific to the cds REPL:

```shell
> .help
.break     Sometimes you get stuck, this gets you out
.clear     Alias for .break
.editor    Enter editor mode
.exit      Exit the REPL
.help      Print this help message
.inspect   Sets options for util.inspect, e.g. `.inspect .depth=1`.
.load      Load JS from a file into the REPL session
.run       Runs a cds server from a given CAP project folder, or module name like @capire/bookshop.
.save      Save all evaluated commands in this REPL session to a file

Press Ctrl+C to abort current expression, Ctrl+D to exit the REPL
```

## Exploring the cds facade with .inspect

The [cds facade] is a good place to start exploring. It contains a lot of detail, so I used the `.inspect` feature to keep things to a minimum:

```bash
> .inspect .depth=0 cds

cds: cds_facade {
  _events: [Object: null prototype],
  _eventsCount: 2,
  _maxListeners: undefined,
  model: undefined,
  db: undefined,
  cli: [Object],
  root: '/home/node/tiny-sample',
  services: {},
  extend: [Function (anonymous)],
  version: '9.1.0',
  builtin: [Object],
  service: [Function],
  log: [Function],
  parse: [Function],
  home: '/home/node/tiny-sample/node_modules/@sap/cds',
  env: [Config],
  requires: {},
  [Symbol(shapeMode)]: false,
  [Symbol(kCapture)]: false
}
```

Running `.inspect .depth=N` on its own will fix the detail level for subsequent inspections to N.

```bash
> .inspect .depth=0

updated node:util.inspect.defaultOptions with: { depth: 0 }
```

At this point there are no values for `db`, `services` or `model` in the facade, because I've not yet started any CAP server.

## Starting a server with .run

With `.run` I started a CAP server based on the project in the current (`.`) directory:

```shell
> .run .
... (usual CAP server output)
Following variables are made available in your repl's global context:

from cds.entities: {
  Books,
}

from cds.services: {
  db,
  CatalogService,
}

Simply type e.g. CatalogService in the prompt to use the respective objects.
```

> This can be done on launching the REPL too like this: `cds repl --run .`, or `cds r -r .` if you like short invocations.

Everything is a service, including the database facility (`db`) as well as the `CatalogService` defined in `srv/cat-service.cds`.

And there's also the `Books` entity from `db/schema.cds` (at this point I've increased the `.inspect` depth from 0 to 4):

```javascript
> Books
entity {
  kind: 'entity',
  elements: LinkedDefinitions {
    ID: Integer { key: true, type: 'cds.Integer' },
    title: String { type: 'cds.String' },
    stock: Integer { type: 'cds.Integer' }
  }
}
```

I then took a peek at some of the detail in the `CatalogService`, specifically the `handlers`, to show [the built-in mechanisms] - all those features one can read about in [Capire] such as auth checks, autoexposure, input validation, paging, sorting, and so on, plus the complete support for CRUD operations, is there:

```javascript
> CatalogService.handlers
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
  before: [],
  on: [
    { on: 'CREATE', handler: [AsyncFunction: handle_crud_requests] },
    { on: 'READ', handler: [AsyncFunction: handle_crud_requests] },
    { on: 'UPDATE', handler: [AsyncFunction: handle_crud_requests] },
    { on: 'DELETE', handler: [AsyncFunction: handle_crud_requests] },
    { on: 'UPSERT', handler: [AsyncFunction: handle_crud_requests] }
  ],
  after: [],
  _error: []
}
```

## Understanding entities at different levels

With the [CDS model](#cds-model) in mind, I stopped for a moment to look at the difference between what the injected variable `Books` represents (shown just above), and what the expanded "service-equivalent" looks like, in `CatalogService.entities`, which I first extracted using a destructuring assignment:

```javascript
> { Books: mybooks } = CatalogService.entities
[object Function]
```

and then inspected:

```javascript
> mybooks
entity {
  kind: 'entity',
  '@readonly': true,
  projection: { from: { ref: [ 'my.bookshop.Books' ] } },
  elements: LinkedDefinitions {
    ID: Integer { key: true, type: 'cds.Integer' },
    title: String { type: 'cds.String' },
    stock: Integer { type: 'cds.Integer' }
  },
  '@Capabilities.DeleteRestrictions.Deletable': false,
  '@Capabilities.InsertRestrictions.Insertable': false,
  '@Capabilities.UpdateRestrictions.Updatable': false
}
```

What's different is that this "version" is a projection on the `Books` entity (in the `my.bookshop` namespace), defined by a query object construct, there's a `@readonly` annotation defined upon it, which in turn [expand into] the `@Capabilities` based restrictions seen here.

## Building and executing query objects

In CAP query objects are first class citizens and essential to our understanding of the fundamentals. They're constructed at a core level with [cds.ql] but there are also higher level APIs such as the [CRUD-style API] which I used here, assigning the object directly to a variable:

```javascript
> thebooks = CatalogService.read(mybooks)
cds.ql {
  SELECT: { from: { ref: [ 'CatalogService.Books' ] } }
}
```

To [execute the query] I used `await`, which by default passes the query to `cds.db.run()`:

```javascript
> await thebooks
[
  { ID: 1, title: 'Wuthering Heights', stock: 100 },
  { ID: 2, title: 'Jane Eyre', stock: 500 }
]
```

In other words, this is the same as:

```javascript
> await db.run(thebooks)
```

because I still have the `db` variable that was automatically made available in the REPL session's global context.

Queries can be extended, which I did at this point:

```javascript
> await thebooks.where({'stock': {'>': 100}})
[ { ID: 2, title: 'Jane Eyre', stock: 500 } ]
```

> Beware, this will modify the query object:
>
> ```javascript
> > thebooks
> cds.ql {
>   SELECT: {
>     from: { ref: [ 'CatalogService.Books' ] },
>     where: [ { ref: [ 'stock' ] }, '>', { val: 100 } ]
>   }
> }
> ```

## Creating a service from scratch

As well as defining a service (such as `CatalogService`) in the CDS model, it's possible to create a service from the ground up, which I illustrated next:

```javascript
> srv = new cds.Service
Service {
  name: 'Service',
  options: {},
  handlers: EventHandlers {
    _initial: [],
    before: [],
    on: [],
    after: [],
    _error: []
  },
  definition: undefined
}
```

This is like an "empty" version of the service I looked at before - for example, there are no handlers defined.

That doesn't prevent the sending of messages; it's just that nothing will happen, as I then demonstrated:

```javascript
> await srv.send('recap', { is: "awesome" })
>
```

At this point I defined a super simple handler for the `recap` event (remember, a handler definition is essentially a function, so `console.log` will do just fine here):

```javascript
> srv.on('recap', console.log)
```

This time, because of the definition of the `on` phase handler for this event named `recap`, the data is passed to the handler function, which outputs it:

```javascript
> await srv.send('recap', { is: "awesome" })
Request { method: 'recap', data: { is: 'awesome' } } [AsyncFunction: next]
```

This is what was shown in the output:

- what is being passed is an object of type `Request`
- the content of the `Request`, an object containing the request `method`, and the payload (in `data`)
- a `next` function that can be called by the handler

In other words, this is effectively a request/response concept, close to the synchronous ideas in HTTP, for example.

Then, to contrast this with an event message concept, close to the asynchronous ideas with event emitters and receivers, I swapped out the `srv.send` and used `srv.emit` instead:

```javascript
> await srv.emit('recap', { is: "awesome" })
EventMessage { event: 'recap', data: { is: 'awesome' } } [Function: _dummy]
```

This time the `console.log` handler showed that:

- what is being passed is an object of type `EventMessage` (as opposed to `Request`)
- the `recap` name is the same, but is now treated as an `event` rather than a `method`
- there is no `next` function (just a `_dummy`)

This `next` vs `_dummy` function is at the heart of one of the key differences between events and requests in CAP. In both contexts one can define multiple handlers that are called in sequence for a given message.

The handling of *requests* is done in the context of a classic [interceptor stack], where any given handler break the chain and effectively declare that the message has been handled (by not calling `next` to pass the processing to the next handler in the stack). But there is no interceptor stack in the handling of *events* - every registered handler is called, regardless (and therefore there's no need for the `next` function).

## Sending queries to a remote service

Constructing and sending queries to services is fundamental in CAP. Earlier I constructed a query and sent it to the `db` service. In this last part of the talk I showed how one can construct a query and send it to a remote service (my [Northbreeze OData service]), without having to think too much at all about the fact that it is even remote.

In CAP services are either "required" or "provided". A remote service is one that is "required", commonly with the details in `package.json#cds.requires`, and [cds.connect] is used to make a connection to such a remote service.

I don't have anything in `package.json#cds.requires` so this is what I got when I tried something simple like this:

```javascript
> cds.connect.to('northbreeze')
Promise {
  <rejected> Error: Didn't find a configuration for 'cds.requires.northbreeze' in /home/node/tiny-sample
```

There's a second parameter to `cds.connect.to` which expects an options object, wherein one can provide a service binding (essentially a destination object) in a `credentials` property:

```javascript
> nb = await cds.connect.to('northbreeze', {kind: 'odata', credentials: { url: 'https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze' }})
RemoteService {
  name: 'northbreeze',
  options: {
    kind: 'odata',
    impl: '@sap/cds/libx/_runtime/remote/Service.js',
    external: true,
    credentials: {
      url: 'https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze'
    }
  },
  kind: 'odata',
  handlers: EventHandlers {
    _initial: [ { before: 'UPDATE', handler: [Function: clearKeysFromData] } ],
    before: [],
    on: [ { on: '*', handler: [AsyncFunction: on_handler] } ],
    after: [],
    _error: []
  },
  definition: undefined,
  _source: '/home/node/tiny-sample/node_modules/@sap/cds/libx/_runtime/remote/Service.js',
  datasource: undefined,
  destinationOptions: undefined,
  destination: {
    name: undefined,
    url: 'https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze'
  },
  path: undefined,
  requestTimeout: 60000,
  csrf: undefined,
  csrfInBatch: undefined,
  middlewares: { timeout: [Function (anonymous)], csrf: undefined },
  entities: [],
  actions: []
}
```

Doing this, and assigning the result to a variable, gives a `RemoteService` object, which is on a similar level to the `db` and `CatalogService` objects I had after starting the CAP server:

```javascript
> [db, CatalogService, nb].forEach(x => console.log(`${x.name}: ${x.constructor.name} (${x.kind})`))
db: SQLiteService (sqlite)
CatalogService: ApplicationService (app-service)
northbreeze: RemoteService (odata)
```

At this point I constructed a new query object, enjoying how the approach (which uses tagged templates) allows me to express my query in almost-English:

```javascript
> cats = SELECT `CategoryName` .from `Categories`
cds.ql {
  SELECT: {
    from: { ref: [ 'Categories' ] },
    columns: [ { ref: [ 'CategoryName' ] } ]
  }
}
```

The context here in the post has diverged slightly from the context of the talk, because (as I'd exited the cds REPL back to the shell to show the output of `npm ls`) the cds REPL session at this point was a fresh one in the talk, one where I hadn't re-invoked the CAP server (with `.run .`), and therefore there was no `db` variable injected into the global REPL context like before.

So when I ran this during the talk, this happened, which nicely illustrated the default use of `db.run` when `await`-ing a query:

```javascript
> await cats
Uncaught Error: Can't execute query as no primary database is connected.
```

But here, while we *do* have a primary database in the form of `db`, we get a different and equally illustrative error:

```javascript
> await cats
Uncaught SqliteError: no such table: Categories in:
SELECT CategoryName FROM Categories
```

Of course, I wanted to have this query sent to the remote service, which I achieved with the same method but called on the `RemoteService` object (in `nb`), rather than the `SQLiteService` object (in `db`):

```javascript
> await nb.run(cats)
[
  { CategoryName: 'Beverages', CategoryID: 1 },
  { CategoryName: 'Condiments', CategoryID: 2 },
  { CategoryName: 'Confections', CategoryID: 3 },
  { CategoryName: 'Dairy Products', CategoryID: 4 },
  { CategoryName: 'Grains/Cereals', CategoryID: 5 },
  { CategoryName: 'Meat/Poultry', CategoryID: 6 },
  { CategoryName: 'Produce', CategoryID: 7 },
  { CategoryName: 'Seafood', CategoryID: 8 }
]
```

The query object is serialised and sent to the remote service, and the results returned, without me having to do anything! If you're curious, information on the built-in implementation that facilitates this is also available:

```javascript
> nb.options
{
  kind: 'odata',
  impl: '@sap/cds/libx/_runtime/remote/Service.js',
  external: true,
  credentials: {
    url: 'https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze'
  }
}
```

Excellent!

## Wrapping up

With that, I wrapped up the talk (it was only a 20 minute slot) and so I'll wrap up this post too.

Let me know in the comments how you get on with the cds REPL, and share what you discover!

[reCAP]: https://recap-conf.dev/
[Code Connect 2025]: https://code-connect.dev/
[replay site]: https://broadcast.sap.com/replay/250709_recap#
[my previous post on the topic]: /blog/posts/2025/03/21/level-up-your-cap-skills-by-learning-how-to-use-the-cds-repl/
[cap-con-img]: https://github.com/qmacro/cap-con-img/
[the built-in mechanisms]: /blog/posts/2024/11/07/five-reasons-to-use-cap/#1-the-code-is-in-the-framework-not-outside-of-it
[cds facade]: https://cap.cloud.sap/docs/node.js/cds-facade
[Capire]: https://cap.cloud.sap/docs/
[expand into]: https://cap.cloud.sap/docs/guides/security/authorization#restricting-events
[cds.ql]: https://cap.cloud.sap/docs/node.js/cds-ql
[CRUD-style API]: https://cap.cloud.sap/docs/node.js/core-services#crud-style-api
[execute the query]: https://cap.cloud.sap/docs/node.js/cds-ql#executing-queries
[interceptor stack]: https://cap.cloud.sap/docs/node.js/core-services#interceptor-stack-with-next
[cds.connect]: https://cap.cloud.sap/docs/node.js/cds-connect
[Northbreeze OData service]: https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze
