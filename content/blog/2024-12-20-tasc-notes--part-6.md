---
title: TASC Notes - Part 6
date: 2024-12-20
tags:
  - tasc
  - cap
  - cds
  - handsonsapdev
--- 

These are the notes summarising what was covered in [The Art and Science of CAP part 6][2], one episode in a mini series with Daniel Hutzel to explore the philosophy, the background, the technology history and layers that support and inform the SAP Cloud Application Programming Model.

For all resources related to this series, see the post [The Art and Science of CAP][1].

This episode started with a review of the previous episode (part 5), based on the [notes for that episode][3].

<a name="improved-display-of-service-handlers"></a>
## Improved display of service handlers

Daniel starts at around [21:53][101] in the cds REPL showing an improved display for the handlers of a service.

One of the many things I love about this series is that we see where Daniel is, a few steps ahead, with his CAP Node.js version which is always slightly in the near future for us, but what we glimpse in that future comes along and is available to us in the next release:

* the new cds REPL features `--run` and `--use` that we saw in the previous episode (see the [New cds REPL options][4] in [the notes to part 5][3]) and which he uses here to start things up _are now available to us too_
* during last week's episode Daniel's cds REPL was announcing itself as version 8.6, whereas we all had access to version 8.5 at that time; this week, where we now have access to version 8.6 (see the [December 2024 release notes][4]), Daniel's cds REPL is now announcing itself as version 8.7, always a step ahead but never anything hidden :-)

This time, the improved handlers display is already now available. Before, with `@sap/cds` 8.5, this is what the handlers looked like, in the REPL (and note that they were in a "private" property `_handlers`):

```log
> CatalogService._handlers
{
  _initial: [
    EventHandler {
      before: '*',
      handler: [Function: handler] { _initial: true }
    },
    EventHandler {
      before: '*',
      handler: [Function: handler] { _initial: true }
    },

    ... lots more ...

    EventHandler {
      before: 'NEW',
      handler: [Function: fn] { _initial: true }
    }
  ],
  before: [
    EventHandler {
      before: 'PATCH',
      handler: [AsyncFunction: addContentType]
    },
    EventHandler {
      before: 'UPDATE',
      handler: [AsyncFunction: addContentType]
    }
  ],
  on: [
    EventHandler {
      on: 'submitOrder',
      handler: [AsyncFunction (anonymous)]
    },
    EventHandler { on: 'NEW', handler: [Function: fn] },
    EventHandler { on: 'EDIT', handler: [Function: fn] },
    EventHandler { on: 'CANCEL', handler: [Function: fn] },
    EventHandler { on: 'draftPrepare', handler: [Function: fn] },
    EventHandler { on: 'CREATE', handler: [AsyncFunction (anonymous)] },
    EventHandler { on: 'READ', handler: [AsyncFunction (anonymous)] },
    EventHandler { on: 'UPDATE', handler: [AsyncFunction (anonymous)] },
    EventHandler { on: 'DELETE', handler: [AsyncFunction (anonymous)] },
    EventHandler { on: 'UPSERT', handler: [AsyncFunction (anonymous)] }
  ],
  after: [
    EventHandler {
      after: 'READ',
      path: 'CatalogService.ListOfBooks',
      handler: [Function: handler]
    },
    EventHandler {
      after: 'submitOrder',
      handler: [AsyncFunction (anonymous)]
    },
    EventHandler {
      after: 'READ',
      handler: [AsyncFunction (anonymous)]
    }
  ],
  _error: []
}
```

This was quite hard to understand, but with 8.6, available to us [already][5], it's cleaner and easier to read (and not in a "private" property any more):

```log
> CatalogService.handlers
EventHandlers {
  _initial: [
    { before: '*', handler: [Function: handler] },
    { before: '*', handler: [Function: handler] },
    { before: '*', handler: [Function: handler] },
    { before: '*', handler: [Function: handler] },
    { before: '*', handler: [Function: noah_handler] },
    { before: '*', handler: [AsyncFunction: check_roles] },
    { before: 'READ', handler: [Function: handler] },
    { before: 'CREATE', handler: [AsyncFunction: commonGenericInput] },
    { before: 'UPDATE', handler: [AsyncFunction: commonGenericInput] },
    {
      before: 'submitOrder',
      handler: [Function: _actionFunctionHandler]
    },
    { before: 'UPDATE', handler: [Function: commonGenericPut] },
    { before: '*', handler: [Function: commonGenericTemporal] },
    { before: 'READ', handler: [Function: commonGenericPaging] },
    { before: 'READ', handler: [Function: commonGenericSorting] },
    { before: 'NEW', handler: [Function: fn] }
  ],
  before: [
    { before: 'PATCH', handler: [AsyncFunction: addContentType] },
    { before: 'UPDATE', handler: [AsyncFunction: addContentType] }
  ],
  on: [
    { on: 'submitOrder', handler: [AsyncFunction (anonymous)] },
    { on: 'NEW', handler: [Function: fn] },
    { on: 'EDIT', handler: [Function: fn] },
    { on: 'CANCEL', handler: [Function: fn] },
    { on: 'draftPrepare', handler: [Function: fn] },
    { on: 'CREATE', handler: [AsyncFunction (anonymous)] },
    { on: 'READ', handler: [AsyncFunction (anonymous)] },
    { on: 'UPDATE', handler: [AsyncFunction (anonymous)] },
    { on: 'DELETE', handler: [AsyncFunction (anonymous)] },
    { on: 'UPSERT', handler: [AsyncFunction (anonymous)] }
  ],
  after: [
    {
      after: 'READ',
      path: 'CatalogService.ListOfBooks',
      handler: [Function: handler]
    },
    { after: 'submitOrder', handler: [AsyncFunction (anonymous)] },
    { after: 'READ', handler: [AsyncFunction (anonymous)] }
  ],
  _error: []
}
```

Much neater!

In browsing through the new display, Daniel makes an important observation in the context of the `on` phase handlers, which is that for your actions (and functions, an important distinction from an OData protocol perspective, at least) you'll _always_ have to define your own `on` phase handlers.

I've said this elsewhere and I'll repeat it here: OData is a formalised RESTful protocol ... for the most part. OData's actions and functions are a departure from the REST principles, one could say that they are orthogonal to the main philosophy and design of the principles of REST.

By definition, any actions and functions are non-standard with respect to the core OData operations, and by association, to any HTTP-oriented application protocol that celebrates the methods (GET, PUT, POST, DELETE, etc) as verbs and the resources (via the URLs) as nouns. The CAP framework cannot possibly predict and handle what you have in store for such non-standard operations, and so you must handle those entirely yourself.

Hence Daniel's remark, and the two `on` phase handlers that he highlights (and that are listed above) are perfect examples of activities other than the CRUD+Q family:

* `submitOrder`
* `draftPrepare`

The clue is in the names - any action or function (which will form part of the URL when being invoked) whose name _contains a verb_ (here: "submit" and "prepare") is pretty much by definition non-RESTful.

<a name="awaitable-queries-and-thenables"></a>
## Awaitable queries and thenables

At [22:49][102] Daniel doubles down on part of the detail in the command he used to start the cds REPL, which was:

```shell
cds r -u ql --run cap/samples/bookshop/
```

The `-u` (short for `--use`) option, along with the `--run` option, was introduced in the previous part (see the [New cds REPL options][5] section of the notes from that episode) and using `-u ql` here loaded the `cds.ql` feature into the REPL's global context, which means that both `cds.ql` itself is available, as well as the features exposed from it (such as `ref`, `val`, `xpr` and so on).

Moreover, `cds.ql` is now (in 8.6) a function and can be used to create query objects. Daniel likens it to a "cast" function, in that whatever form of query construct you pass to it will be converted to a query object (a CQN object). Here's the example he gave:

```log
> cds.ql `SELECT from Authors { ID, name, books { ID, title, genre.name as genre } }`
cds.ql {
  SELECT: {
    from: { ref: [ 'Authors' ] },
    columns: [
      { ref: [ 'ID' ] },
      { ref: [ 'name' ] },
      {
        ref: [ 'books' ],
        expand: [
          { ref: [ 'ID' ] },
          { ref: [ 'title' ] },
          { ref: [ 'genre', 'name' ], as: 'genre' }
        ]
      }
    ]
  }
}
```

And similar to how (in [Executing queries][6] in the notes on last week's episode) we can immediately execute (via `await`) a query object that is wrapped as `Query { ... }`, `cds.ql` also emits a similarly `await`-able object (just wrapped as `cds.ql { ... }`):

```log
> await cds.ql `SELECT from Authors { ID, name, books { ID, title, genre.name as genre } }`
[
  {
    ID: 101,
    name: 'Emily Brontë',
    books: [ { ID: 201, title: 'Wuthering Heights', genre: 'Drama' } ]
  },
  {
    ID: 107,
    name: 'Charlotte Brontë',
    books: [ { ID: 207, title: 'Jane Eyre', genre: 'Drama' } ]
  },
  {
    ID: 150,
    name: 'Edgar Allen Poe',
    books: [
      { ID: 251, title: 'The Raven', genre: 'Mystery' },
      { ID: 252, title: 'Eleonora', genre: 'Romance' }
    ]
  },
  {
    ID: 170,
    name: 'Richard Carpenter',
    books: [ { ID: 271, title: 'Catweazle', genre: 'Fantasy' } ]
  }
]
```

In contrast, Daniel then invokes something else we touched on in the previous episode, which is `cds.parse.cql`, and showed that it produces a CQN object too (i.e. it parses the query into one) but one that is not immediately executable, just an object in its purest form.

To show this, at around [24:06][103], Daniel tries to `await` the object, but as we found out last time, we sort of get the same effect as an identity function, i.e. we just get the object returned to us.

This is how the concept of a "thenable" was introduced, mostly because it's at the heart of the `await`-able nature of that which we've just seen.

In a nutshell, a [thenable][8] is something that has a `then` method[<sup>1</sup>](#footnote-1). All promises are thenables ... but not all thenables are promises. This is a super interesting subject which crosses over with asynchronous features in JavaScript and how the both idea and implementation of promises have evolved over the years, but perhaps I should leave that as a topic for another blog post.

In effect, adding a `then` method to the CQN object (stored in the variable `q`) to pass the object in a call to `cds.run`, like this:

```javascript
q.then = function(r, e) { return cds.run(this).then(r, e) }
```

allowed Daniel to immediately invoke that CQN object as if it were an `await`-able like the `cds.ql` and `Query` object types:

```log
> await q
[
  {
    ID: 101,
    name: 'Emily Brontë',
    books: [ { ID: 201, title: 'Wuthering Heights', genre: 'Drama' } ]
  },
  ...
```

> If you're curious as to why Daniel changed the `then` implementation from
>
> `q.then = (r,e) => ...`
>
> to
>
> `q.then = function(r,e) { ... }`
>
> it's because the [arrow function expression][10] syntax has some semantic differences to the traditional `function() { ... }` expression, notably a lack of contextual binding, in particular to `this`, which makes available a reference to the object upon which the called function (or "method", to use more suitable parlance here) is made.

Daniel wraps up this section showing the source of `@sap/cds`'s `lib/ql/cds.ql-Query.js` which has pretty much exactly this pattern (and where the inspiration for this demo came from). It includes the `then` getter, defined thus:

```javascript
/** Turns all queries into Thenables which execute with primary db by default */
get then() {
  const srv = this._srv || cds.db || cds.error `Can't execute query as no primary database is connected.`
  const q = new AsyncResource('await cds.query')
  return (r,e) => q.runInAsyncScope (srv.run, srv, this).then (r,e)
}
```

It's worth dwelling on yet another [DWIM][11] feature in CAP - that this thenable executes the query, by default, on the primary database connection (or on a service to which it has been bound). _"Do what I mean!"_

<a name="connecting to remote services from within the-repl"></a>
## Connecting to remote services from within the REPL

Next, around [26:45][104], Daniel revisits a theme we touched upon in the previous episode - [local and remote services][13], specifically attempting a connection to the `bookshop` service's `CatalogService` endpoint ... from within a cds REPL session. And, as usual, there's plenty to unpack and dwell upon.

First, in a second terminal window, the `bookshop` service is started in a watch session, similar to this:

```shell
$ cds w bookshop
cd bookshop

cds serve all --with-mocks --in-memory?
live reload enabled for browsers
...
[cds] - connect using bindings from: { registry: '~/.cds-services.json' }
[cds] - connect to db > sqlite { url: ':memory:' }
...
[cds] - serving AdminService { impl: 'bookshop/srv/admin-service.js', path: '/admin' }
[cds] - serving CatalogService { impl: 'bookshop/srv/cat-service.js', path: '/browse' }
[cds] - serving UserService { impl: 'bookshop/srv/user-service.js', path: '/user' }

[cds] - server listening on { url: 'http://localhost:4004' }
...
```

At this point the `CatalogService` endpoint is available at `http://localhost:4004/browse`.

Then, in the cds REPL, back in the original terminal window, Daniel makes a first and deliberately naïve attempt to connect to it:

```log
> cats = await cds.connect.to('CatalogService')
Uncaught:
Error: Didn't find a configuration for 'cds.requires.CatalogService' in /home/node/cloud-cap-samples
    at options4 (/home/node/cloud-cap-samples/node_modules/@sap/cds/lib/srv/cds-connect.js:66:50)
    at /home/node/cloud-cap-samples/node_modules/@sap/cds/lib/srv/cds-connect.js:37:36
    at connect.to (/home/node/cloud-cap-samples/node_modules/@sap/cds/lib/srv/cds-connect.js:56:5)
    at REPL1:1:58
```

<a name="providing-configuration-programmatically"></a>
### Providing configuration programmatically

There's no configuration for this endpoint, configuration that's often found in the CAP project's `package.json` file. This is a great opportunity to highlight that in fact you can "help the machinery" by providing configuration programmatically, and (as Daniel mentions) is indeed explained in Capire, specifically for the [Method: cds.connect.to()][12] section of the "cds.connect()" topic, where the "signature" is defined like this:

```typescript
async function cds.connect.to (
  name : string,  // reference to an entry in `cds.requires` config
  options : {
    kind : string // reference to a preset in `cds.requires.kinds` config
    impl : string // module name of the implementation
  }
)
```

along with this explanation:

> "Argument `options` allows to pass options programmatically, and thus create services without configurations"

Given the comment to the `kind` option in the signature above ("reference to a preset in cds.requires.kinds config"), I was curious to see what values were actually defined:

```log
> Object.keys(cds.requires.kinds).join(' ')
basic-auth mocked-auth jwt-auth ias-auth xsuaa-auth dummy-auth sql sqlite better-sqlite
legacy-sqlite hana hana-cloud legacy-hana sql-mt hana-mt app-service rest odata
odata-v2 odata-v4 graphql outbox in-memory-outbox persistent-outbox local-messaging
file-based-messaging default-messaging enterprise-messaging enterprise-messaging-shared
enterprise-messaging-http enterprise-messaging-amqp message-queuing kafka
composite-messaging mtx-messaging redis-messaging ucl destinations connectivity
```

There are a lot, as it turns out!

Given this opportunity, Daniel used the `options` to provide enough information for the remote connection to be made[<sup>2</sup>](#footnote-2):

```javascript
{
  kind: 'odata',
  credentials: {
    url: 'http://localhost:4004/browse'
  }
}
```

In case you're wondering, `odata` is a synonym for `odata-v4`.

Of course, hard-coding service binding information like this is very useful, but only for design time and when iterating on the build of your service constellation. Information like this, especially credentials (beyond merely a URL) should be stored securely and separate to the code context. This is what `VCAP_SERVICES` in Cloud Foundry is for, as an example, and more generally what the SAP BTP's [Destination Service][16] offers.

**A note on the word "remote" 👉** Calling this a "remote connection" is a little bit misleading, in that it's "just a connection", and the agnostic nature of CAP, specifically here embodied in this `cds.connect.to` method, means that the fact that it's remote is only because the `options.credentials.url` value points to a remote address, and at this stage, that's just for us humans to consider; the machinery doesn't really care (although it will need to use extra libraries to make the connection). See also [There is no remote](#there-is-no-remote) later in these notes for part 6.

OK, back to Daniel's REPL session:

```log
> cats = await cds.connect.to('CatalogService',{kind:'odata',credentials:{url:'http://localhost:4004/browse'}})
Uncaught:
[TypeError [ERR_INVALID_REPL_INPUT]: Listeners for `uncaughtException` cannot be used in the REPL] {
  code: 'ERR_INVALID_REPL_INPUT'
}
```

This error was something that really only surfaced because of our explorations here in the cds REPL. This Art and Science of CAP series just keeps on giving! Daniel was keen to not only work out what was going on here, but to share it with us.

<a name="debug-all-the-things"></a>
### Debug all the things

So at around [28:53][105] he restarts the cds REPL but with the value `y` for the `DEBUG` environment variable:

```shell
$ DEBUG=y cds r
```

> This is the same as `DEBUG=all` which you may have seen elsewhere.

The wonderful thing about turning the log level to 11 and [digging in][17] is that we learn so much from what's emitted. If you want to know more, we have a quick YouTube Short on the topic - [Controlling CAP server log levels][19]:

[![YouTube Short screenshot][18]][19]

With that log level turned right up, here's what's emitted:

```log
[cds] - @sap/cds 8.6.0 loaded: /home/node/cloud-cap-samples/node_modules/@sap/cds
[cds] - Command resolved: /usr/local/share/npm-global/lib/node_modules/@sap/cds-dk/bin/repl.js
Welcome to cds repl v 8.6.0
> cats = await cds.connect.to('CatalogService',{kind:'odata',credentials:{url:'http://localhost:4004/browse'}})
[cds.env] - checking {
  file: '/home/node/cloud-cap-samples/node_modules/@sap/cds-fiori/.cdsrc.yaml'
}
[cds.env] - checking {
  file: '/home/node/cloud-cap-samples/node_modules/@sap/cds-fiori/.cdsrc.json'
}
[cds.env] - checking {
  file: '/home/node/cloud-cap-samples/node_modules/@sap/cds-fiori/.cdsrc.js'
}
[cds.env] - checking {
  file: '/home/node/cloud-cap-samples/node_modules/@sap/cds-fiori/package.json'
}
[cds.env] - importing /home/node/cloud-cap-samples/node_modules/@sap/cds-fiori/package.json
[cds.env] - checking {
  file: '/home/node/cloud-cap-samples/node_modules/@cap-js/sqlite/.cdsrc.yaml'
}
[cds.env] - checking {
  file: '/home/node/cloud-cap-samples/node_modules/@cap-js/sqlite/.cdsrc.json'
}
[cds.env] - checking {
  file: '/home/node/cloud-cap-samples/node_modules/@cap-js/sqlite/.cdsrc.js'
}
[cds.env] - checking {
  file: '/home/node/cloud-cap-samples/node_modules/@cap-js/sqlite/package.json'
}
[cds.env] - importing /home/node/cloud-cap-samples/node_modules/@cap-js/sqlite/package.json
[cds.env] - checking { file: '/home/node/.cdsrc.json' }
[cds.env] - checking { file: '/home/node/.cdsrc.js' }
[cds.env] - checking { file: '/home/node/cloud-cap-samples/.cdsrc.yaml' }
[cds.env] - checking { file: '/home/node/cloud-cap-samples/.cdsrc.json' }
[cds.env] - checking { file: '/home/node/cloud-cap-samples/.cdsrc.js' }
[cds.env] - checking { file: '/home/node/cloud-cap-samples/package.json' }
[cds.env] - checking { file: '/home/node/cloud-cap-samples/.cdsrc-private.json' }
[cds.env] - checking { file: '/home/node/cloud-cap-samples/default-env.json' }
[cds.env] - checking { file: '/home/node/cloud-cap-samples/.env' }
[cds.service.factory] - {
  'cds.root': '/home/node/cloud-cap-samples',
  paths: [
    '/home/node/cloud-cap-samples',
    '/home/node/cloud-cap-samples/node_modules/@sap/cds/lib/srv/node_modules',
    '/home/node/cloud-cap-samples/node_modules/@sap/cds/lib/node_modules',
    '/home/node/cloud-cap-samples/node_modules/@sap/cds/node_modules',
    '/home/node/cloud-cap-samples/node_modules/@sap/node_modules',
    '/home/node/cloud-cap-samples/node_modules',
    '/home/node/node_modules',
    '/home/node_modules',
    '/node_modules',
    '/home/node/.node_modules',
    '/home/node/.node_libraries',
    '/usr/local/lib/node'
  ]
}
[cds.service.factory] - {
  name: 'CatalogService',
  definition: {},
  options: {
    kind: 'odata',
    impl: '@sap/cds/libx/_runtime/remote/Service.js',
    external: true,
    credentials: { url: 'http://localhost:4004/browse' }
  }
}
[cds.service.factory] - requires {
  service: undefined,
  source: '.',
  impl: '@sap/cds/libx/_runtime/remote/Service.js'
}
[cds.service.factory] - {
  resolved: '/home/node/cloud-cap-samples/node_modules/@sap/cds/libx/_runtime/remote/Service.js'
}
[trace] - require cds.compiler  : 29.746ms
```

That's quite some output!

Briefly, what we can discern from it is that there are log records from the `cds`, `cds.env`, `cds.service.factory` and `trace` modules, and:

* the `cds.env` output shows how the effective configuration is gathered from multiple but well-known files (`.cdsrc.yaml`, `.cdsrc.json`, `.cdsrc.js`, `package.json`, `.cdsrc-private.json`, `default-env.json` and `.env`) in various locations[<sup>3</sup>](#footnote-3)
* the `cds.service.factory` output shows that the CAP server has determined the nature of the `CatalogService` connection and embellished the options with `external: true` and details of the module that implements the remote service connection

It's always worth taking a few seconds to stare at output like this. Even when it doesn't directly help the diagnosis, it will almost always add value, context and understanding.

<a name="the-uncaughtexception-culprit"></a>
### The 'uncaughtException' culprit 

Through some brute-force searching through the codebase, Daniel eventually finds the problem - the [Winston logger][21], which [emits an uncaught exception][22]. The Winston logger is used by the [SAP Cloud SDK][23], which we know (if you don't, see [footnote 2](#footnote-2)) is used by the CAP server for remote connections.

By means of "a light tap with a heavy stick" (essentially commenting out the offending lines) Daniel manages to prevent this uncaught exception failure in the REPL, and the remote connection is successfully set up! 

```log
> cats = await cds.connect.to('CatalogService',{kind:'odata',credentials:{url:'http://localhost:4004/browse'}})
RemoteService {
  name: 'CatalogService',
  options: {
    kind: 'odata',
    impl: '@sap/cds/libx/_runtime/remote/Service.js',
    external: true,
    credentials: { url: 'http://localhost:4004/browse' }
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
  _source: '@sap/cds/libx/_runtime/remote/Service.js',
  datasource: undefined,
  destinationOptions: { useCache: true },
  destination: { name: undefined, url: 'http://localhost:4004/browse' },
  path: undefined,
  requestTimeout: 60000,
  csrf: undefined,
  csrfInBatch: undefined,
  middlewares: { timeout: [Function (anonymous)], csrf: undefined },
  entities: [],
  actions: []
}
```

> I deliberately used the phrase "successfully set up" and not "successfully established" because at this point no actual connection has been made to the remote service.
>
> Nor would that make much sense anyway, in that the protocols supported are all "connection-less" (in that, for example, HTTP is a connection-less protocol). This point can be driven home by stopping the remote service at this point, then restarting it, and it makes no difference to this existing `RemoteService` object and whether it can still reach the remote endpoints (it can).

<a name="caps-open-source-philosophy"></a>
### CAP's open source philosophy

In wrapping up this section, Daniel explains at [30:26][106] his philosophy on the use of open source software, warranties, and minimising the risk surface area for libraries employed. There are only three major open source libraries used in CAP Node.js, and those are:

* [Node.js][24]
* [SQLite][25]
* [Express][26]

## Sending queries to the remote service

And to demonstrate the remote service connection, Daniel performed a query.

But before I show that, I wanted to pause and dwell on what Capire has to say here that is relevant for our understanding.

In the [cds.connect.to (name, options?) -> service][27] section of the [cds.connect()][28] topic, we see that what's returned from this `cds.connect.to` call is "_a Promise resolving to a corresponding Service instance_".

Moreover, "_[s]ervice instances are cached in `cds.services` ... [and a]s services constructed by `cds.serve` are registered with `cds.services` as well, a connect finds and returns them **as local service connections**_" (emphasis mine).

This underlines the [hexagonal architecture][29] approach, as well as helping join the dots, the first of which is that this `RemoteService` object now shows up in `cds.services`:

```log
> cds.services
{
  CatalogService: RemoteService {
    name: 'CatalogService',
    options: {
      kind: 'odata',
      impl: '@sap/cds/libx/_runtime/remote/Service.js',
      external: true,
      credentials: { url: 'http://localhost:4004/browse' }
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
    _source: '@sap/cds/libx/_runtime/remote/Service.js',
    datasource: undefined,
    destinationOptions: { useCache: true },
    destination: { name: undefined, url: 'http://localhost:4004/browse' },
    path: undefined,
    requestTimeout: 60000,
    csrf: undefined,
    csrfInBatch: undefined,
    middlewares: { timeout: [Function (anonymous)], csrf: undefined },
    entities: [],
    actions: []
  }
}
```

> Daniel also expands on this a little later - see [There is no remote](#there-is-no-remote) a little further on in these notes.

Additionally, using tab completion in the REPL on `cats` (the reference to this `RemoteService` object) shows what's possible:

```log
> cats.
cats.events                cats.model                 cats.namespace             cats.operations            cats.reflect
cats.types

cats._handlers             cats._implicit_next        cats._is_service_instance  cats.after                 cats.before
cats.dispatch              cats.isExtensible          cats.on                    cats.onFailed              cats.onSucceeded
cats.prepend               cats.reject                cats.transaction           cats.tx

cats.create                cats.decorate              cats.delete                cats.disconnect            cats.emit
cats.exists                cats.foreach               cats.get                   cats.insert                cats.patch
cats.post                  cats.put                   cats.read                  cats.run                   cats.send
cats.update                cats.upsert

cats._requires_resolving   cats.endpoints

cats.constructor           cats.handle                cats.init                  cats.isExternal

cats._source               cats.actions               cats.csrf                  cats.csrfInBatch           cats.datasource
cats.definition            cats.destination           cats.destinationOptions    cats.entities              cats.handlers
cats.kind                  cats.middlewares           cats.name                  cats.options               cats.path
cats.requestTimeout
```

<a name="properties-of-a-remote-service"></a>
### Properties of a remote service

But what is a `RemoteService`, essentially?

Well, Capire's [Remote Services][30] topic tells us that the `cds.RemoteService` class extends `cds.Service`. Knowing what we know about the Art and Science of CAP so far, and thinking logically, this makes a lot of sense.

And Capire tells us a lot about the [Class: cds.Service][31] which will help us dig into what Daniel invokes, at this point:

```log
> cats.get`Books`
cds.ql {
  SELECT: { from: { ref: [ 'Books' ] } }
}
```

Right now, we can determine that:

* we have an instance of `cds.RemoteService` in `cats`
* this in turn is based on `cds.Service`
* which has all those properties and methods that we see above
* one of which is `get`

plus:

* the generic name in Capire for the service instance examples here in this large section on the [cds.Service class][31] is `srv`

<a name="api-styles-for-service-consumption"></a>
### API styles for service consumption

With this in mind, and thinking about what Daniel invoked:

```log
> cats.get`Books`
```

we can then examine the [REST-style API][32] section in this Capire topic which tells us that

`srv.get(path, ...)`

is a REST-style convenience method that is the equivalent of (syntactic sugar for)

`srv.send('GET', path, ...)`

In essence, `cats.send('GET', 'Books')`, ``cats.get`Books` `` and even ``cats.get(`Books`)``[<sup>4</sup>](#footnote-4) each result in a promise that needs to be `await`-ed, thus (note the debug output from the `remote` module here too):

```log
> await cats.get`Books`
[remote] - GET http://localhost:4004/browse/Books { headers: { accept: 'application/json,text/plain' } }
[
  {
    createdAt: '2024-12-31T15:09:44.103Z',
    modifiedAt: '2024-12-31T15:09:44.103Z',
    ID: 201,
    title: 'Wuthering Heights',
    descr: `Wuthering Heights, Emily Brontë's only novel, was published ...`,
    author: 'Emily Brontë',
    genre_ID: 11,
    stock: 12,
    price: 11.11,
    currency_code: 'GBP',
    'image@odata.mediaContentType': null
  },
  ...
]
```

Interestingly, directly following the [REST-style API][32] section in Capire, the [CRUD-style API][34] alternative is described, which sports convenience methods along the lines of the Create / Read / Update / Delete (CRUD) model. And Daniel shows a nice example of that style next, with:

```log
> await cats.read `ID,title,genre.name as genre` .from `Books`
[remote] - GET http://localhost:4004/browse/Books?$select=ID,title,genre%2Fname { headers: { accept: 'application/json,text/plain' } }
[
  { ID: 201, title: 'Wuthering Heights', genre_name: 'Drama' },
  { ID: 207, title: 'Jane Eyre', genre_name: 'Drama' },
  { ID: 251, title: 'The Raven', genre_name: 'Mystery' },
  { ID: 252, title: 'Eleonora', genre_name: 'Romance' },
  { ID: 271, title: 'Catweazle', genre_name: 'Fantasy' }
]
```

<a name="other-ways-to-provide-configuration"></a>
### Other ways to provide configuration

Earlier we saw Daniel demonstrated how to [provide configuration programmatically](#providing-configuration-programmatically). At this point, following a brief discussion about security and managing credentials, Daniel demonstrated one of the many other ways to provide configuration. There's lots to discover in the [cds.env][35] Capire topic, and the [On the Command Line][36] section in particular describes what is demonstrated next:

```log
$ cds_requires_CatalogService_kind=odata \
  cds_requires_CatalogService_credentials_url=http://localhost:4004/browse \
  cds r
Welcome to cds repl v 8.6.0
> await cds.connect.to('CatalogService')
RemoteService {
  name: 'CatalogService',
  options: {
    kind: 'odata',
    impl: '@sap/cds/libx/_runtime/remote/Service.js',
    external: true,
    credentials: { url: 'http://localhost:4004/browse' }
  },
  kind: 'odata',
  ...
}
```

Using this environment variable laden invocation of the cds REPL, and to embed some small concepts we've learned over this series so far, how about:

```log
> await (await cds.connect.to('CatalogService')) .read `title` .from `Books`
[
  { title: 'Wuthering Heights', ID: 201 },
  { title: 'Jane Eyre', ID: 207 },
  { title: 'The Raven', ID: 251 },
  { title: 'Eleonora', ID: 252 },
  { title: 'Catweazle', ID: 271 }
]
```

or even:

```log
> await cds.connect.to('CatalogService') .then( x => x .read `title` .from `Books`)
[
  { title: 'Wuthering Heights', ID: 201 },
  { title: 'Jane Eyre', ID: 207 },
  { title: 'The Raven', ID: 251 },
  { title: 'Eleonora', ID: 252 },
  { title: 'Catweazle', ID: 271 }
]
```

<a name="there-is-no-remote"></a>
### There is no remote

Next, around [36:11][107], Daniel returns to one of the enduring developer-focused ideas in CAP, which is making it possible for developers to not worry or even care about underlying protocols or low level implementation details. A service is a service is a service, whether remote or local.

While there might be [different styles of APIs](#api-styles-for-service-consumption) to suit different tastes or semantic preferences, there is no difference between a local and a remote service when it comes to talking to it.

![there is no remote][37]

Daniel illustrates this effect with a diagram, which I'll try to reproduce here in ASCII art (because ASCII art).

First, a local service A talking to a local service B:

```text
+-----+      +-----+
|     |      |     |
|  A  |-CQN->|  B  |
|     |      |     |
+-----+      +-----+
```

So far so good.

Now, if B were remote (illustrated by being positioned further over to the right here)

```text
+-----+                              +-----+
|     |                              |     |
|  A  |-CQN->?                       |  B  |
|     |                              |     |
+-----+                              +-----+
```

then actually what is provided is a proxy for B, local to A, and an adapter over at B:

```text
+-----+                              +-----+
|     |                              |     |
|  A  |                              |  B  |
|     |                              |     |
+-----+                              +-----+
   |                                    ^
  CQN  +-----+                +-----+   |
   |   |     |                |     |   |
   +-->|  B' |                |  B' |---+
       |     |                |     |
       +-----+                +-----+
        proxy                 adapter
```

And the distance between the B' proxy and the B' adapter is covered by a wire protocol, such as OData or GraphQL.

```text
+-----+                              +-----+
|     |                              |     |
|  A  |                              |  B  |
|     |                              |     |
+-----+                              +-----+
   |                                    ^
  CQN  +-----+                +-----+   |
   |   |     |                |     |   |
   +-->|  B' |-----ODATA----->|  B' |---+
       |     |                |     |
       +-----+                +-----+
        proxy                 adapter
```

As Daniel shows with help from the [comparison table][38], CQL is a superset of any of these protocols (and of SQL) and thus to avoid lossiness in serialising CQN at one end and deserialising it at the other, we now have CQL-over-HTTP, or HCQL.

There is currently very little mention of this in Capire but we see from the [January 2024 release notes][39] that it's been around at least for a year in the Java flavour. Hopefully we can dig into HCQL in a future episode of this series!

```text
+-----+                              +-----+
|     |                              |     |
|  A  |                              |  B  |
|     |                              |     |
+-----+                              +-----+
   |                                    ^
  CQN  +-----+                +-----+   |
   |   |     |                |     |   |
   +-->|  B' |-----HCQL------>|  B' |---+
       |     |                |     |
       +-----+                +-----+
        proxy                 adapter
```

This interchangeability of "transport layer" is, at least in my mind, further emphasised by how one uses an annotation ([`@protocol`][40]) to determine the protocol via which a service is available. The nature of an annotation - being separate to what it is annotating, and also easily modified - conveys an ultimate decoupling of the protocol from the service itself.

By the way, we touched on this in the previous episode too - see the [Remote services, proxies and abstraction][41] section of the notes to Part 5 for more details.

Oh, and don't forget, folks: REST is not a protocol, it's an architectural style (and yes, I really did name my narrowboat home "FULLY RESTFUL").

![Narrowboat FULLY RESTFUL][42]

That's why Daniel was saying that while CQN could be transported over REST, you'd have to construct an actual language, a protocol, to do so (and if you did it thoroughly, you might end up with something like ... OData).

<a name="best-practices-revisited"></a>
## Best practices revisited

At [45:30][108] Daniel returns to Capire's [Best Practices][43] topic; here's a brief summary of his commentary:

* **Domain Models**: Capture domain knowledge, focus on what not how, keep it simple stupid (KISS), and make it understandable for the domain experts (see also [Keeping things simple in domain modelling with CDS][44]).
* **Services**: Services are interfaces, provide facades from the inside out and protect your inner mechanisms from the outside.
* **Events**: A key, critical component of the design of CAP, driven by both art and science concepts (in particular: [message passing][45], pretty much the opposite of what one might call "RPC" or remote function invocation).
* **Data**: keep data as passive as possible, to get the most benefit from querying and the best chance at extensibility.
* **Querying**: Raise up queries to the level of importance they deserve, treat them as first class citizens (they are) and always be wary of falling into the trap of trying to reproduce the effects of [object-relational mapping][46]. Additionally, the combination of how we should regard data and queries means that we can take complex validations and _push them down to the database_ with that set of validations translated into a query ... instead of reading a big lump of data to perform the validations on manually and "in the wrong place".
* **Agnostic by Design**: This is such a fundamental driving theme for CAP, and is inspired by the idea of [hexagonal architecture][47]; in fact [CAP is an implementation of it][48], notably in how it shields us from the "real world" of cloud services, reflecting the key intent of hexagonal architecture which is to provide _isolation_ from real world peripheral hardware and software objects.
* **Intrinsic Extensibility**: As CAP's "everything" mantra goes ("[everything is a service][50]", "[everything is an event][51]") - everything is extensible. Models (through the power of aspects - see [Separating concerns and focusing on the important stuff][49]), logic, and of course the framework itself - see the [Interacting with the database service][52] section of the notes to Part 4 of this series. Of course, the CAP framework is extensible in other ways - such as [with the plugin concept][53] (for which we have a short series too - see the link in the "Wrapping up" section below).

<a name="wrapping-up"></a>
## Wrapping up

That just about wraps it up for this episode; the series is now paused while we make space for other topics (such as the [CAP Node.js Plugins][54] mini-series in January 2025) but we hope to be back live again with you soon! Thanks for reading these notes, I'd love to hear from you in the comments section below.

---

<a name="footnotes"></a>
## Footnotes

<a name="footnote-1"></a>
1. This reminds me of [my musings into functors][9], wherein a functor is something that has a `map` method.

<a name="footnote-2"></a>
2. In reproducing the examples, I'm using the latest publicly available CAP Node.js version which is 8.6.1, and when I first made this connection invocation I got an error:

`Uncaught Error: Cannot find module '@sap-cloud-sdk/resilience'`

which is related to the requirement for the SAP Cloud SDK which CAP uses to handle the detail and complexity of remote connections, especially in the context of destination definitions (think of the [Destination Service][16] on SAP BTP).

I cover this in great detail in the [Service Integration with SAP Cloud Application Programming Model][14] CodeJam, specifically in [Exercise 08 - Introduce the SAP Cloud SDK][15], so will just say here that to overcome this error, I just installed the NPM package `@sap-cloud-sdk/http-client`.

<a name="footnote-3"></a>
3. Did you notice _what_ locations? They're the project-local location plus the locations ... of the automatically-loaded plugins! This relationship is explained further in [CAP Node.js plugins - part 1 - how things work][20].

<a name="footnote-4"></a>
4. If you're curious about ``cats.get`Books` `` vs ``cats.get(`Books`)``, you might find the MDN documentation on [Tagged templates][33] useful.


[1]: /blog/posts/2024/12/06/the-art-and-science-of-cap/
[2]: https://www.youtube.com/watch?v=cZCOQpxC118
[3]: /blog/posts/2024/12/13/tasc-notes-part-5/
[4]: https://cap.cloud.sap/docs/releases/dec24
[5]: https://www.npmjs.com/package/@sap/cds/v/8.6.0
[6]: /blog/posts/2024/12/13/tasc-notes-part-5/#new-cds-repl-options
[7]: /blog/posts/2024/12/13/tasc-notes-part-5/#executing-queries
[8]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#thenables
[9]: https://qmacro.org/blog/posts/2016/10/19/f3c-parts-9-and-10-functors/
[10]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
[11]: /blog/posts/2024/11/29/tasc-notes-part-3/#DWIM
[12]: https://cap.cloud.sap/docs/node.js/cds-connect#cds-connect-to-1
[13]: /blog/posts/2024/12/13/tasc-notes-part-5/#local-and-remote-services
[14]: https://github.com/SAP-samples/cap-service-integration-codejam/
[15]: https://github.com/SAP-samples/cap-service-integration-codejam/tree/main/exercises/08-introduce-sap-cloud-sdk#try-it-out
[16]: https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/consuming-destination-service
[17]: /blog/posts/2024/10/05/cap-node.js-plugins-part-1-how-things-work/#debug-and-digging-in
[18]: /images/2024/12/debug-short.jpg
[19]: https://www.youtube.com/shorts/C_0Za3wTcEM
[20]: /blog/posts/2024/10/05/cap-node.js-plugins-part-1-how-things-work
[21]: https://github.com/winstonjs/winston
[22]: https://github.com/winstonjs/winston/blob/8769d47a8b23dbda0069e285fbf1cda9e3e9f265/lib/winston/exception-handler.js#L49-L52
[23]: https://sap.github.io/cloud-sdk/
[24]: https://nodejs.org/en
[25]: https://www.npmjs.com/package/sqlite3
[26]: https://expressjs.com/
[27]: https://cap.cloud.sap/docs/node.js/cds-connect#cds-connect-to-name-options-8594-service
[28]: https://cap.cloud.sap/docs/node.js/cds-connect
[29]: https://cap.cloud.sap/docs/about/best-practices#hexagonal-architecture
[30]: https://cap.cloud.sap/docs/node.js/remote-services
[31]: https://cap.cloud.sap/docs/node.js/core-services#cds-service
[32]: https://cap.cloud.sap/docs/node.js/core-services#rest-style-api
[33]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
[34]: https://cap.cloud.sap/docs/node.js/core-services#crud-style-api
[35]: https://cap.cloud.sap/docs/node.js/cds-env
[36]: https://cap.cloud.sap/docs/node.js/cds-env#on-the-command-line
[37]: /images/2024/12/there-is-no-remote.jpg
[38]: https://cap.cloud.sap/docs/about/best-practices#query-language-cql
[39]: https://cap.cloud.sap/docs/releases/changelog/#jan-24-added
[40]: https://cap.cloud.sap/docs/node.js/cds-serve#protocol
[41]: /blog/posts/2024/12/13/tasc-notes-part-5/#remote-services-proxies-and-abstraction
[42]: /images/2024/12/narrowboat-fully-restful.jpg
[43]: https://cap.cloud.sap/docs/about/best-practices
[44]: /blog/posts/2024/11/02/keeping-things-simple-in-domain-modelling-with-cds/
[45]: https://en.wikipedia.org/wiki/Message_passing
[46]: https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping
[47]: https://alistair.cockburn.us/hexagonal-architecture/
[48]: https://cap.cloud.sap/docs/about/best-practices#cap-as-an-implementation-of-hexagonal-architecture
[49]: https://qmacro.org/blog/posts/2024/11/04/separating-concerns-and-focusing-on-the-important-stuff/
[50]: /blog/posts/2024/12/10/tasc-notes-part-4/#everything-is-a-service
[51]: /blog/posts/2024/11/07/five-reasons-to-use-cap/#adding-custom-logic
[52]: /blog/posts/2024/12/10/tasc-notes-part-4/#interacting-with-the-database-service
[53]: https://cap.cloud.sap/docs/plugins/
[54]: /blog/posts/2024/12/30/cap-node.js-plugins/

[101]: https://www.youtube.com/live/cZCOQpxC118?t=1313
[102]: https://www.youtube.com/live/cZCOQpxC118?t=1369
[103]: https://www.youtube.com/live/cZCOQpxC118?t=1446
[104]: https://www.youtube.com/live/cZCOQpxC118?t=1605
[105]: https://www.youtube.com/live/cZCOQpxC118?t=1733
[106]: https://www.youtube.com/live/cZCOQpxC118?t=1826
[107]: https://www.youtube.com/live/cZCOQpxC118?t=2171
[108]: https://www.youtube.com/live/cZCOQpxC118?t=2730
