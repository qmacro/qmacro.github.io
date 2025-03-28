---
layout: post
title: Level up your CAP skills by learning how to use the cds REPL
date: 2025-03-21
tags:
  - talk
  - cap
  - cds
  - repl
---
_These are notes I wrote for my talk at SAP Inside Track Madrid on 20 March 2025. I wrote them partly to think about what I wanted to say, and partly to share the info in written form too. Note that the idea is to introduce the concepts and show some basic examples for cds REPL "initiates". Nothing too exotic._

Here's the talk abstract: "The cds repl (REPL stands for Read Evaluate Print Loop) is an extremely powerful and versatile tool for every CAP Node.js developer. In this session, you'll become acquainted with it, get a feel for what it's like, how to wield its powers, and more. No experience required, this will be a live session with no slides."

After some introductory material, there are four main parts to this post:

* [Part 1 - starting up](#part-1-starting-up)
* [Part 2 - inspecting](#part-2-inspecting)
* [Part 3 - querying](#part-3-querying)
* [Part 4 - digging deper](#part-4-digging-deeper)

<a name="what-a-repl-is"></a>
## What a REPL is

While in Capire the REPL is written as the "cds repl" I prefer to write REPL in upper case as it's an acronym, standing for [Read Evaluate Print Loop](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop), which describes exactly what it does:

* reads your input
* evaluates it
* prints the result
* loops back to the start

The history of REPLs goes back to the early Lisp days. A REPL is also very similar in nature to a command line shell which is why I like Bash so much, because the language which I use in the shell - and therefore how I think when constructing expressions - is exactly the same language that I use to write scripts.

A REPL is the perfect environment for interactive explorations and experimentation, which is why it's so great to have a REPL in CAP - specifically right now for CAP Node.js.

<a name="follow-along"></a>
## Follow along

You can follow along with all the examples here in a container, so you don't have to install anything locally or clean up afterwards. The [qmacro/cap-con-img](https://github.com/qmacro/cap-con-img) repo contains definitions for a base image and CAP Node.js version specific images. Assuming you have Docker Desktop (or equivalent runtime) installed, along with `git` and a standard shell (`bash`), and can run the `docker` client CLI, you can do what I did to set things up for this talk and set of notes, which is:

* `git clone https://github.com/qmacro/cap-con-img && cd cap-con-img`
* `./buildbase && ./buildver 8.8.1`
* `docker run -it --name cds-repl-talk cap-8.8.1 bash`

and then within the container (where you should have a prompt like this `node ➜ ~`) you can clone the CAP samples repo:

* `git clone https://github.com/SAP-samples/cloud-cap-samples samples`
* `cd samples && npm ci`

> `ci` is a "clean" version of install, see [this SO answer](https://stackoverflow.com/a/53325242/384366) for more details.

then you're ready to start up the cds REPL within the container:

* `cds repl`

(If you want a further example of trying things out in a container context, see the [appendix on setting up a test environment](https://qmacro.org/blog/posts/2024/12/10/tasc-notes-part-4/#appendix1) in the notes to The Art and Science of CAP part 4.)

Unless otherwise stated, all the following cds REPL session examples (identified by the `>` prompt, as opposed to the `$` shell prompt) are based on this scenario setup.

<a name="an introduction"></a>
## An introduction

The CAP Node.js REPL is essentially an extension of the [standard Node.js REPL](https://nodejs.org/api/repl.html).

Compare:

```shell
$ node
Welcome to Node.js v22.12.0.
Type ".help" for more information.
> .help
.break   Sometimes you get stuck, this gets you out
.clear   Alias for .break
.exit    Exit the REPL
.help    Print this help message
.load    Load JS from a file into the REPL session
.save    Save all evaluated commands in this REPL session to a file
```

with:

```shell
$ cds repl
Welcome to cds repl v 8.8.1
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
```

In addition to the [standard Node.js REPL commands](https://nodejs.org/docs/latest/api/repl.html#commands-and-special-keys)[<sup>1</sup>](#footnote-1), the cds REPL adds these two:

* `.inspect`: comfortably view structured objects at varying depths
* `.run`: start a CAP server based on the definitions given in the location specified

In fact, the facility provided by the `.run` command is also available at invocation time via the `--run` option, as we can see from the help:

```shell
$ cds repl --help
SYNOPSIS

    cds repl [ <options> ]

    Launches into a read-eval-print-loop, an interactive playground to
    experiment with cds' JavaScript APIs. See documentation of Node.js'
    REPL for details at http://nodejs.org/api/repl.html

OPTIONS

    -r | --run <project>

      Runs a cds server from a given CAP project folder, or module name.
      You can then access the entities and services of the running server.
      It's the same as using the repl's builtin .run command.

    -u | --use <cds feature>

      Loads the given cds feature into the repl's global context. For example,
      if you specify xl it makes the cds.xl module's methods available.
      It's the same as doing {ref,val,xpr,...} = cds.xl within the repl.

EXAMPLES

    cds repl --run bookshop
    cds repl --run .
    cds repl --use cds.ql

SEE ALSO

    cds eval  to evaluate and execute JavaScript.
```

> Due to lack of time, we won't be looking at the `--use` option in this talk. Maybe next time!

<a name="part-1-starting-up"></a>
## Part 1 - starting up

The biggest benefit of a cds REPL is being able to explore the entire API as well as start up & interact with a live, running CAP server. And remember that being a Node.js REPL at heart, you can use any and every JavaScript expression and construct, as well as some special CAP specific features.

<a name="using-cds-test"></a>
### Using cds.test()

Before the advent of the `--run` option, we could use the [cds.test()](https://cap.cloud.sap/docs/node.js/cds-test#cds-test) method:

```shell
> cds.test('bookshop')
<ref *1> Test { test: [Circular *1] }
> [cds] - loaded model from 5 file(s):

  bookshop/srv/user-service.cds
  bookshop/srv/cat-service.cds
  bookshop/srv/admin-service.cds
  bookshop/db/schema.cds
  node_modules/@sap/cds/common.cds

[cds] - connect to db > sqlite { url: ':memory:' }
  > init from bookshop/db/init.js
  > init from bookshop/db/data/sap.capire.bookshop-Genres.csv
  > init from bookshop/db/data/sap.capire.bookshop-Books.texts.csv
  > init from bookshop/db/data/sap.capire.bookshop-Books.csv
  > init from bookshop/db/data/sap.capire.bookshop-Authors.csv
/> successfully deployed to in-memory database.

[cds] - using auth strategy {
  kind: 'mocked',
  impl: 'node_modules/@sap/cds/lib/srv/middlewares/auth/basic-auth'
}

[cds] - using new OData adapter
[cds] - serving AdminService { impl: 'bookshop/srv/admin-service.js', path: '/admin' }
[cds] - serving CatalogService { impl: 'bookshop/srv/cat-service.js', path: '/browse' }
[cds] - serving UserService { impl: 'bookshop/srv/user-service.js', path: '/user' }

[cds] - server listening on { url: 'http://localhost:34851' }
[cds] - server launched in: 2.778s
[cds] - [ terminate with ^C ]
```

As you can see, this starts a CAP server based on the definitions in the `bookshop` directory. Note that the port is not 4004 as one might normally expect; this is partly because we're in "test" mode and want to avoid clashing with any regular CAP server already running on the same host. This is true for CAP servers started up in the cds REPL in general.

<a name="using-the-run-command"></a>
### Using the .run command

It was in the lifetime and growth of the CAP Node.js 8 release that the two extra cds REPL commands `.inspect` & `.run` and the command line options `--run` & `--use` [were introduced](/blog/posts/2024/12/13/tasc-notes-part-5/#new-cds-repl-options), proudly during the course of the [The Art and Science of CAP](/blog/posts/2024/12/06/the-art-and-science-of-cap/) series.

In particular, the equivalent of `cds.test('bookshop')` became:

```shell
> .run bookshop
```

which not only was less cryptic but did the same thing as far as start up a CAP server (with output as shown already) but also made various variables available in the cds REPL that are useful to us in that context; here's the extra output from `.run bookshop`:

```log
------------------------------------------------------------------------
Following variables are made available in your repl's global context:

from cds.entities: {
  Books,
  Authors,
  Genres,
}

from cds.services: {
  db,
  AdminService,
  CatalogService,
  UserService,
}

Simply type e.g. UserService in the prompt to use the respective objects.
```

The entities and services defined in the specified directory are identified and exposed to us. Note that along with `AdminService`, `CatalogService` and `UserService`, all defined [as services in the bookshop project](https://github.com/SAP-samples/cloud-cap-samples/tree/main/bookshop/srv), there's also `db`. Yes, that's a service too, and one we can examine, modify and influence as readily as our own services, should we so desire. In CAP, [everything is a service](/blog/posts/2024/12/10/tasc-notes-part-4/#everything-is-a-service). (The `db` service is a `SQLiteService` as we'll see [later](#entities-and-services).

<a name="using-the-run-option"></a>
### Using the --run option

As the help text for `cds repl` already has shown us, there's also:

```shell
$ cds repl --run bookshop
```

which does the same thing as using `.run bookshop` at the cds REPL prompt.

The `.run` command and the `--run` option use `cds.test()` behind the scenes, and both are [cap-monorepo-aware](/blog/posts/2024/12/10/tasc-notes-part-4/#the-run-command).

<a name="part-2-inspecting"></a>
## Part 2 - inspecting

At this point, as well as the automatically exposed entity and service variables, we also have access to certain key objects, such as `cds`, known as the main [façade object](https://cap.cloud.sap/docs/node.js/cds-facade) and which provides access to all CAP Node.js APIs. Just what we need!

<a name="the-cds-facade-object"></a>
### The cds façade object

The `cds` object is mostly [lazily loaded](/blog/posts/2024/12/10/tasc-notes-part-4/#lazy-loading-of-the-cds-facades-many-features). You can see this by immediately looking at it once you've started the cds REPL (without any `--run` option), like this:

```shell
$ cds repl
Welcome to cds repl v 8.8.1
> cds
cds {
  _events: {},
  _eventsCount: 0,
  _maxListeners: undefined,
  model: undefined,
  db: undefined,
  cli: { command: 'repl', argv: [], options: {} },
  root: '/home/node/samples',
  services: {},
  extend: [Function (anonymous)],
  version: '8.8.1',
  [Symbol(shapeMode)]: false,
  [Symbol(kCapture)]: false
}
```

As you can see, the `cds` object is always automatically available in the cds REPL. But owing to the lazy loading technique, it starts out small and lean, and only grows when required and appropriate.

For example, the runtime environment represented by `cds.env` has not yet appeared. But we can ask to see it by entering `cds.env` at the cds REPL prompt, causing it to be reified there and then, showing a gigantic sub-object from which only this last bit is shown here:

```text
{
  ...,
  sql: { names: 'plain', dialect: 'sqlite' },
  hana: { 'deploy-format': 'hdbtable', journal: { 'change-mode': 'alter' } },
  build: { target: 'gen' },
  mtx: {
    api: { model: true, provisioning: true, metadata: true, diagnose: true },
    domain: '__default__'
  },
  cdsc: { moduleLookupDirectories: [ 'node_modules/' ] },
  query: { limit: { max: 1000 } },
  plugins: {
    '@sap/cds-fiori': {
      impl: '/home/node/samples/node_modules/@sap/cds-fiori/cds-plugin.js',
      packageJson: '/home/node/samples/node_modules/@sap/cds-fiori/package.json'
    },
    '@cap-js/sqlite': {
      impl: '/home/node/samples/node_modules/@cap-js/sqlite/cds-plugin.js',
      packageJson: '/home/node/samples/node_modules/@cap-js/sqlite/package.json'
    }
  },
  config: { log: { format: 'plain' } }
}
```

That's a lot of information. Far more than we can comfortably and conveniently deal with directly. And not only is `cds.env` large, but that has now made the façade object large too.

We can of course use standard JavaScript techniques to examine things further, for example:

```shell
> Object.keys(cds.env)
[
  '_context',       '_home',
  '_sources',       '_profiles',
  '_better_sqlite', 'production',
  'requires',       'server',
  'protocols',      'features',
  'fiori',          'ql',
  'log',            'folders',
  'i18n',           'odata',
  'sql',            'hana',
  'build',          'mtx',
  'cdsc',           'query',
  'plugins',        'config'
]
```

Further, we can access different elements of the individual areas by the dotted notation simply like this:

```shell
> cds.env.plugins
{
  '@sap/cds-fiori': {
    impl: '/home/node/samples/node_modules/@sap/cds-fiori/cds-plugin.js',
    packageJson: '/home/node/samples/node_modules/@sap/cds-fiori/package.json'
  },
  '@cap-js/sqlite': {
    impl: '/home/node/samples/node_modules/@cap-js/sqlite/cds-plugin.js',
    packageJson: '/home/node/samples/node_modules/@cap-js/sqlite/package.json'
  }
}
```

> If you're interested to know why these two entries exist, you might want to take a look at [CAP Node.js Plugins](/blog/posts/2024/12/30/cap-node.js-plugins/).

That said, we also have the other cds REPL specific command `.inspect`. Using this command directly will show us everything, as above. But we can add the `.depth` option like this to reduce the volume of output:


```shell
> .inspect cds.env .depth=0

cds.env: Config {
  _context: 'cds',
  _home: '/home/node/samples',
  _sources: [Array],
  _profiles: [Set],
  _better_sqlite: [Getter],
  production: false,
  requires: [Object],
  server: [Object],
  protocols: [Object],
  features: [Object],
  fiori: [Object],
  ql: {},
  log: [Object],
  folders: [Object],
  i18n: [Object],
  odata: [Object],
  sql: [Object],
  hana: [Object],
  build: [Object],
  mtx: [Object],
  cdsc: [Object],
  query: [Object],
  plugins: [Object],
  config: [Object]
}
```

> `0` represents the lowest amount of information, whereas `11` represents the highest, and is the default. I'd like to think that this was a nod to [Spinal Tap](https://www.youtube.com/watch?v=4xgx4k83zzc) but I suspect it's just another [Schnapszahl](https://www.google.com/search?q=site%3Aqmacro.org+%23tasc+schnapszahlen).

<a name="entities-and-services"></a>
### Entities and services

But what about those entities and services? Well, let's have a look. As we can discern from the output of `.inspect cds.env .depth=0` above, there's no top-level `cds.entities`:

```shell
> cds.entities
>
```

That's because we haven't yet started the CAP server, at least in this current cds REPL session. So let's do that now:

```shell
> .run bookshop
[cds] - loaded model from 5 file(s):

...

from cds.entities: {
  Books,
  Authors,
  Genres,
}

from cds.services: {
  db,
  AdminService,
  CatalogService,
  UserService,
}

...
```

And the [cds façade object](#the-cds-facade-object) has now grown, sporting new top level keys:

```shell
> Object.keys(cds)
[
  '_events',            '_eventsCount', '_maxListeners',
  'model',              'db',           'cli',
  'root',               'services',     'extend',
  'version',            'parse',        'home',
  'env',                'server',       'ql',
  'test',               'utils',        'exec',
  'options',            'requires',     'log',
  'debug',              'plugins',      'app',
  'load',               'resolve',      'get',
  'compile',            'edmxs',        'minify',
  'builtin',            'type',         'linked',
  'entity',             'connect',      'service',
  'Event',              'Request',      'error',
  'Service',            'compiler',     'deploy',
  '_context',           'infer',        'serve',
  'ApplicationService', 'i18n',         'EventContext',
  'User',               'middlewares',  'shutdown'
]
```

This list includes both `entities`:

```shell
> .inspect cds.entities .depth=0

cds.entities: [Function: children] LinkedDefinitions {
  Books: [entity],
  Authors: [entity],
  Genres: [entity],
  'Books.texts': [entity],
  'Genres.texts': [entity]
}
```

and `services`:

```shell
> .inspect cds.services .depth=0

cds.services: {
  db: [SQLiteService],
  AdminService: [AdminService],
  CatalogService: [CatalogService],
  UserService: [UserService]
}
```

Notice how these lists tie up directly with what is emitted in the output from `.run` earlier.

Instead of having to specify a depth each time we use `.inspect`, we can set it for subsequent invocations in this cds REPL session, like this:

```shell
> .inspect .depth=0

 updated node:util.inspect.defaultOptions with: { depth: 0 }
 ```

Exploring `cds.entities` is a good example of where `.inspect` gives us a nicer experience than plain JavaScript techniques.

We can get hold of an entity, say, `Books`, either directly if we know what it is[<sup>2</sup>](#footnote-2) (as `cds.entities.Books`) or by more generally working with `cds.entities` which is a [LinkedDefinitions](https://cap.cloud.sap/docs/node.js/cds-reflect#iterable) class.

This is an [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol), which means that simply asking for everything will produce something a little underwhelming:

```shell
> cds.entities
[object Function]
```

Contrast this with:

```shell
> .inspect cds.entities .depth=0

cds.entities: [Function: children] LinkedDefinitions {
  Books: [entity],
  Authors: [entity],
  Genres: [entity],
  'Books.texts': [entity],
  'Genres.texts': [entity]
}
```

But even with plain JavaScript access is possible in different ways. There's destructuring:

* `{ Books } = cds.entities`
* `{ Books: mybooks } = cds.entities` (with new variable name assignment)

There's also the pair of statements that can be used to operate on iterables:

`for ... in` iterates through the keys:

```shell
> for (e in cds.entities) { console.log(e) }
Books
Authors
Genres
Books.texts
Genres.texts
```

whereas `for ... of` gives access to the values:

```shell
for (e of cds.entities) { console.log(e) }
entity {
  kind: 'entity',
  includes: [Array],
  elements: [LinkedDefinitions],
  '$localized': true
}
entity {
  kind: 'entity',
  includes: [Array],
  elements: [LinkedDefinitions]
}
entity {
  kind: 'entity',
  '@cds.autoexpose': true,
  '@cds.persistence.skip': 'if-unused',
  '@UI.Identification': [Array],
  '@cds.odata.valuelist': true,
  includes: [Array],
  elements: [LinkedDefinitions],
  '$localized': true
}
...
```

But often it's just easiest to use the convenience variables exposed by the "run" affordance, such as `Books`:

```shell
> Books
entity {
  kind: 'entity',
  includes: [ 'managed' ],
  elements: LinkedDefinitions {
    createdAt: Timestamp {
      '@cds.on.insert': { '=': '$now' },
      '@UI.HiddenFilter': true,
      '@UI.ExcludeFromNavigationContext': true,
      '@Core.Immutable': true,
      '@title': '{i18n>CreatedAt}',
      '@readonly': true,
      type: 'cds.Timestamp',
      '@Core.Computed': true,
      '@Common.Label': '{i18n>CreatedAt}'
    },
    createdBy: String {
      '@cds.on.insert': { '=': '$user' },
      '@UI.HiddenFilter': true,
      '@UI.ExcludeFromNavigationContext': true,
      '@Core.Immutable': true,
      '@title': '{i18n>CreatedBy}',
      '@readonly': true,
      '@description': '{i18n>UserID.Description}',
      type: 'cds.String',
      length: 255,
      '@Core.Computed': true,
      '@Common.Label': '{i18n>CreatedBy}',
      '@Core.Description': '{i18n>UserID.Description}'
    },
    ...
}
```

And what of the services - what can we see there? Well, for a start, how about:

```shell
> .inspect CatalogService

CatalogService: CatalogService {
  name: 'CatalogService',
  options: [Object],
  model: [LinkedCSN],
  handlers: [EventHandlers],
  definition: [service],
  namespace: 'CatalogService',
  actions: [LinkedDefinitions],
  submitOrder: [Function: CatalogService.submitOrder],
  entities: [LinkedDefinitions],
  _source: '/home/node/samples/bookshop/srv/cat-service.js',
  endpoints: [Array],
  _adapters: [Object],
  path: '/browse',
  '$linkProviders': [Array]
}
```

We can dig into those properties too. The `handlers` are of particular interest, and thanks to [a recent improvement on the display of those handlers](/blog/posts/2024/12/20/tasc-notes-part-6/#improved-display-of-service-handlers) we have a convenient way of neatly visualising what's set up:

```shell
> .inspect CatalogService.handlers .depth=2

CatalogService.handlers: EventHandlers {
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

There's plenty to explore; here are just a couple of observations:

* there's an entry in the `on` phase for `submitOrder`, [defined as an event](https://github.com/SAP-samples/cloud-cap-samples/blob/main/bookshop/srv/cat-service.js) for an OData action
* there are built-in handlers for all the standard OData operations such as CREATE, READ, UPDATE, DELETE and so on

<a name="part-3-querying"></a>
## Part 3 - querying

These basic artifacts are interesting on their own but can already be combined in useful ways.

For example, we can use the [CRUD-style API](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api) with the services available to us directly, referring to the entities that are also available to us:

```shell
> CatalogService.read(Books)
cds.ql { SELECT: [Object] }
```

OK, so what's emitted here is not that exciting. Partly because our inspection depth is currently set to `0`, and partly because API operations like this are asynchronous (promises) and we need to `await` them to see the results.

Let's deal with these one at a time, mostly because even seeing the pre-executed query in more detail is worthwhile:

```shell
> .inspect .depth=3

 updated node:util.inspect.defaultOptions with: { depth: 3 }

> CatalogService.read(Books)
cds.ql {
  SELECT: { from: { ref: [ 'sap.capire.bookshop.Books' ] } }
}
```

At this point we're probably keen to move from the metadata to the data, so let's just dive in for a bit of relief:

```shell
> await CatalogService.read(Books)
[
  {
    createdAt: '2025-03-18T05:38:55.530Z',
    createdBy: 'anonymous',
    modifiedAt: '2025-03-18T05:38:55.530Z',
    modifiedBy: 'anonymous',
    ID: 201,
    title: 'Wuthering Heights',
    descr: `Wuthering Heights, Emily Brontë's only novel, was published ...`,
    author_ID: 101,
    genre_ID: 11,
    stock: 12,
    price: 11.11,
    currency_code: 'GBP'
  },
  {
    createdAt: '2025-03-18T05:38:55.530Z',
    createdBy: 'anonymous',
    modifiedAt: '2025-03-18T05:38:55.530Z',
    modifiedBy: 'anonymous',
    ID: 207,
    title: 'Jane Eyre',
    descr: `Jane Eyre /ɛər/ (originally published as Jane Eyre: An Autobiography) is ...`,
    author_ID: 107,
    genre_ID: 11,
    stock: 11,
    price: 12.34,
    currency_code: 'GBP'
  },
  ...
}
```

We can of course qualify that query, this time using the fluent API style that `cds.ql` makes available for us, for a change. First, let's check who the authors are and how to identify them, supplying a [CQL](https://cap.cloud.sap/docs/cds/cql) expression in a template string:

```shell
> await cds.ql `SELECT ID, name from Authors`
[
  { ID: 101, name: 'Emily Brontë' },
  { ID: 107, name: 'Charlotte Brontë' },
  { ID: 150, name: 'Edgar Allen Poe' },
  { ID: 170, name: 'Richard Carpenter' }
]
```

Now we know that Mr Poe's ID is 150, we can start to build a query; but first, let's increment the inspection depth as the query that we'll be constructing (or, more precisely, having the API construct for us) will be a little deeper:

```shell
> .inspect .depth=4

 updated node:util.inspect.defaultOptions with: { depth: 4 }
```

OK, here goes. Let's define a basic "book titles" query, treating it as what it is - a first class citizen, assignable to a variable (and able to be passed around to and from functions as well):

```shell
> booktitles = CatalogService.read('title').from(Books)
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Books' ] },
    columns: [ { ref: [ 'title' ] } ]
  }
}
```

No trip to the persistence layer has been made yet, we have just defined a query object and stored it in the variable `booktitles`. Now that we have it in a variable, we can use and even extend it:

```shell
> await booktitles.where({author_ID:150})
[ { title: 'The Raven' }, { title: 'Eleonora' } ]
```

We could of course have also even crystallised that into another query object:

```shell
> booksFromPoe = booktitles.where({author_ID:150})
cds.ql {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Books' ] },
    columns: [ { ref: [ 'title' ] } ],
    where: [
      { ref: [ 'author_ID' ] },
      '=',
      { val: 150 },
      'and',
      { ref: [ 'author_ID' ] },
      '=',
      { val: 150 }
    ]
  }
}
```

which we can then use whenever we need to:

```shell
> await booksFromPoe
[ { title: 'The Raven' }, { title: 'Eleonora' } ]
```

And of course, based on the philosophy that anything expressed in a query language is a "query", we can perform non-read-only operations which would be OK to show in this section of the blog post :-)

```shell
> await CatalogService.update(Books).set({price:100}).where({title:'Eleonora'})
{ price: 100 }
> await cds.ql `SELECT title, price from Books`
[
  { title: 'Wuthering Heights', price: 11.11 },
  { title: 'Jane Eyre', price: 12.34 },
  { title: 'The Raven', price: 13.13 },
  { title: 'Eleonora', price: 100 },
  { title: 'Catweazle', price: 150 }
]
```

<a name="part-4-digging-deeper"></a>
## Part 4 - digging deeper

Really, the cds REPL gives us a golden key to the "staff entrance" of the CAP machine, and we can effectively explore, extend and create however we wish.

Here are a couple of examples that give some indication of what's possible in the cds REPL, where, as we are starting to find out, we have all the building blocks at our disposal, and that [there is no magic](/blog/posts/2024/12/10/tasc-notes-part-4/#the-magic-is-that-there-is-no-magic).

<a name="dynamic-service-creation-and-use"></a>
### Dynamic service creation and use

Here we create a new service on the fly, define a handler for an `on` phase event, and then send a request that will trigger that:

```shell
> (srv = new cds.Service).on('hola-madrid', function() { console.log(arguments) })
ServiceProvider {
  name: 'ServiceProvider',
  options: {},
  handlers: EventHandlers {
    _initial: [],
    before: [],
    on: [ { on: 'hola-madrid', handler: [Function (anonymous)] } ],
    after: [],
    _error: []
  },
  definition: undefined
}
> await srv.send('hola-madrid', { hashtag: '#TheFutureIsTerminal' })
[Arguments] {
  '0': Request {
    method: 'hola-madrid',
    data: { hashtag: '#TheFutureIsTerminal' }
  },
  '1': [AsyncFunction: next]
}
```

### Remote service connection

As another example of what else is possible (pretty much anything), let's construct a connection definition to connect to a remote service and have queries sent to it too.

The service we'll connect to is a cut down version of the classic Northwind service, called (appropriately enough) [Northbreeze](https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze), with mainly product, category and supplier data[<sup>3</sup>](#footnote-3).

Before we embark upon this, we need to do two things.

First, we need to add the Cloud SDK as remote connectivity in CAP Node.js delegates the heavy lifting of remote connection management and use to that library.

```shell
node ➜ ~/samples (main)
$ npm add --no-fund @sap-cloud-sdk/http-client

added 53 packages, and audited 332 packages in 13s

found 0 vulnerabilities
```

Next, we also need to make a temporary quick fix to the Winston logger that's used by the CAP Node.js runtime, as currently it can issue a rather extreme 'uncaughtException' which is allowed to filter up and cause problems[<sup>4</sup>](#footnote-4).

With a light tap with a very precise stick, we can neutralise this issue by commenting out the offending line:

```shell
sed \
  --regexp-extended \
  --in-place \
  "s/(process.on\('uncaughtException'.+$)/\/\/ \1 TEMP/" \
  node_modules/winston/lib/winston/exception-handler.js
```

Now we can launch the cds REPL:

```shell
node ➜ ~/samples (main)
$ cds repl
Welcome to cds repl v 8.8.1
>
```

With the [cds.connect.to](https://cap.cloud.sap/docs/node.js/cds-connect#cds-connect-to) method we can connect to required services (remember the yin and yang of "provided" and "required" services), normally those that are defined in `package.json#cds.requires`.

But ... while we do have a required service defined, it's implicit to the design-time context we're in: the `db` service, using SQLite for persistence:

```shell
> .inspect cds.env.requires .depth=1

cds.env.requires: {
  middlewares: true,
  auth: {
    restrict_all_services: false,
    kind: 'mocked',
    users: [Object],
    tenants: [Object]
  },
  db: { impl: '@cap-js/sqlite', credentials: [Object], kind: 'sqlite' },
  depth: 2
}
```

Because of how `cds.connect.to` has been defined, we can define a service on the fly, [programmatically](/blog/posts/2024/12/20/tasc-notes-part-6/#providing-configuration-programmatically), supplying the requisite details.

Let's do that now:

```shell
> northbreeze = await cds.connect.to('northbreeze', {kind:'odata',credentials:{url:'https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze'}})
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
  _source: '/home/node/samples/node_modules/@sap/cds/libx/_runtime/remote/Service.js',
  datasource: undefined,
  destinationOptions: { useCache: true },
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

In the `credentials` part of the options we just need to specify the URL, the service is open and doesn't require authentication.

OK, now we're ready to send a query to that remote service. Let's first define and store a simple it using the [SELECT](https://cap.cloud.sap/docs/node.js/cds-ql#select) class:

```shell
> categories = SELECT `CategoryName` .from `Categories`
cds.ql {
  SELECT: {
    from: { ref: [ 'Categories' ] },
    columns: [ { ref: [ 'CategoryName' ] } ]
  }
}
```

How about executing that query, like we did before?

```shell
> await categories
Uncaught Error: Can't execute query as no primary database is connected.
    at get then (/home/node/samples/node_modules/@sap/cds/lib/ql/cds.ql-Query.js:66:50)
    at REPL40:1:39
```

Of course! This is not some query we can (or even want to) send to a local service; there isn't even a database connected[<sup>5</sup>](#footnote-5)!

We want to send it to the remote `northbreeze` service. So let's do that:

```shell
> await northbreeze.run(categories)
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

Excellent!

<a name="wrapping-up"></a>
## Wrapping up

I hope you got a useful impression of both how easy it is to get started with the cds REPL and also how powerful it is. We've only just scratched the surface of its utility and power. Let me know in the comments if you'd like to learn more.

Until next time - happy exploring!

---

<a name="footnotes"></a>
## Footnotes

<a name="footnote-1"></a>
1. The standard Node.js REPL also has the `.editor` command which is not shown in the `.help` output here for some reason.

<a name="footnote-2"></a>
2. Which we can of course discover like this, for example:

```shell
> Object.keys(cds.entities)
[ 'Books', 'Authors', 'Genres', 'Books.texts', 'Genres.texts' ]
```

But doing that gets a little tiresome after a while.

<a name="footnote-3"></a>
3. This service was created originally for the [Developer Challenge on APIs](https://community.sap.com/t5/technology-blogs-by-sap/sap-developer-challenge-apis/ba-p/13573168) in August 2023 and [is still running](https://developer-challenge.cfapps.eu10.hana.ondemand.com/).

<a name="footnote-4"></a>
4. This is known by Daniel and the team and they are working on the best way to address this. Before that's done, we can use this hack for the purposes we have in the cds REPL here.

<a name="footnote-5"></a>
5. If you're like me, you'll be asking at this point "what would this error look like if we had started a CAP server for the `bookshop` service like before (instead of just launching an "empty" cds REPL), with `.run bookshop`?"

Well, if we did have a running CAP server from the `bookshop` service, we'd see a different error:

```shell
> await categories
Uncaught SqliteError: no such table: Categories in:
SELECT CategoryName FROM Categories
    at Database.prepare (/home/node/samples/node_modules/better-sqlite3/lib/methods/wrappers.js:5:21)
    at SQLiteService.prepare (/home/node/samples/node_modules/@cap-js/sqlite/lib/SQLiteService.js:72:29)
    at SQLiteService.onSELECT (/home/node/samples/node_modules/@cap-js/db-service/lib/SQLService.js:135:25)
    at next (/home/node/samples/node_modules/@sap/cds/lib/srv/srv-dispatch.js:64:36)
    at SQLiteService.handle (/home/node/samples/node_modules/@sap/cds/lib/srv/srv-dispatch.js:68:6)
    at SQLiteService.dispatch (/home/node/samples/node_modules/@sap/cds/lib/srv/srv-dispatch.js:30:15)
    at SQLiteService._begin [as dispatch] (/home/node/samples/node_modules/@sap/cds/lib/srv/srv-tx.js:204:15)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async REPL3:1:33 {
  code: 'SQLITE_ERROR',
  query: 'SELECT CategoryName FROM Categories'
}
```

Makes sense, right?
