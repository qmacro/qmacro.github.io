---
layout: post
title: CAP Node.js plugins - part 2 - using the REPL
date: 2025-01-10
tags:
  - cap
  - cds
  - plugins
  - repl
  - introspection
---
This blog post accompanies part 2 of a three part series where we explore the CDS Plugin mechanism in CAP Node.js to find out how it works. In part 1 we looked at the plugin mechanism itself and how it worked. In this part we use the cds REPL to start our CAP service running and to explore it - to _introspect_ it.

For information on the series and links to all resources, see the [CAP Node.js Plugins][1] series post.

> The examples in this post are based on CAP Node.js at release 8.6 ([December 2024][2]).

<a name="picking-up-from-where-we-left-off-last-time"></a>
## Picking up from where we left off last time

Now we have a sleketon plugin package set up and wired in (which we did in part 1), we can turn our attention to how they can be used to enhance the standard CAP service processing.

Let's have our plugin bring about some behaviour for a custom annotation we'll add to one of the elements in one of the entities in our [service][5].

<a name="adding-a-custom-annotation"></a>
## Adding a custom annotation

If we annotate an element, for example the `genre` element of the `Books` entity, with `@loud`, that signifies that the value of that element should be returned in UPPER CASE.

Let's annotate `Books.genre` with `@loud` in the CDL definition so it looks like this:

```cds
service Bookshop {
    entity Books {
        key ID          : Integer;
            title       : String;
            @loud genre : String;
            stock       : Integer;
    }
    entity Things {
        key ID : Integer;
    }
}
```

The idea is that the contents of the `genre` element should be converted to all capitals before being returned, so that the responses look like this (notice how "SCIENCE FICTION" is presented in all capitals, i.e. in a "loud" shouty fashion).

```json
{
  "@odata.context": "$metadata#Books",
  "value": [
    {
      "ID": 1,
      "title": "The Hitchhiker's Guide To The Galaxy",
      "genre": "SCIENCE FICTION",
      "stock": 42
    }
  ]
}
```

This custom annotation won't have any adverse effect on the standard service provision, but it's available to us when we introspect the service and its makeup.

To see how this completely new and random annotation is handled in general, let's see what the CDS compiler makes of it. Let's ask for the YAML representation of the Core Schema Notation (CSN) for our CDS model:

```shell
cds compile . --to yaml
```

This is what we get:

```yaml
definitions: 
  Bookshop: {kind: service}
  Bookshop.Books: 
    kind: entity
    elements: 
      ID: {key: true, type: cds.Integer}
      title: {type: cds.String}
      genre: {'@loud': true, type: cds.String}
      stock: {type: cds.Integer}
  Bookshop.Things: {kind: entity, elements: {ID: {key: true, type: cds.Integer}}}
meta: {creator: CDS Compiler v5.6.0, flavor: inferred}
$version: 2.0
```

Note how our new annotation is captured and stored simply as a new property for the element, a property which has the annotation itself as the key and a boolean `true` as the value:

```yaml
genre: {'@loud': true, type: cds.String}
```

Using the annotation as the property key means that it won't clash with anything standard. This is so simple that it's easy to gloss over this detail and miss the beauty of the design here.

<a name="starting-up-the-cds-repl-and-a-server-instance"></a>
## Starting up the cds REPL and a server instance

We can use the cds REPL to manually and interactively explore the service and everything it contains. The cds REPL has had some [recent enhancements in the December 2024][3] release, so we'll explore some of those throughout this session.

For now, though, there's a [cds.test](https://cap.cloud.sap/docs/node.js/cds-test) library for writing tests for CAP Node.js services, and we can also [use that library directly in the REPL](https://cap.cloud.sap/docs/node.js/cds-test#using-cds-test-in-repl) to great effect.

Let's start the REPL with `cds repl` and enter `const test = await cds.test()`. The output is what we see from a standard server startup, including the announcement from our fledgling plugin (see [Appendix A - Turning down the logging](#appendix-a-turning-down-the-logging) on suppressing this by default). Here's a sample session output (the `>` symbol is the REPL prompt character):

```shell
$ cds repl
Welcome to cds repl v 8.6.0 
> const test = await cds.test()
[LOUD] - Starting up ...
[cds] - loaded model from 1 file(s):

  services.cds

[cds] - connect to db > sqlite { url: ':memory:' }
  > init from data/Bookshop.Books.csv 
/> successfully deployed to in-memory database. 

[cds] - using auth strategy {
  kind: 'mocked',
  impl: 'node_modules/@sap/cds/lib/srv/middlewares/auth/basic-auth'
} 

[cds] - using new OData adapter
[cds] - serving Bookshop { path: '/odata/v4/bookshop' }

[cds] - server listening on { url: 'http://localhost:33821' }
[cds] - launched at 1/10/2025, 1:02:01 PM, version: 8.6.0, in: 568.775ms
[cds] - [ terminate with ^C ]
>
```

> The CAP server is started bound to a random port, rather than the default one. This is so it doesn't clash with a CAP server that you might already have running.

> We're not actually interested in what's stored in the `test` constant, the assignment is made just to avoid the output of `cds.test()` being otherwise emitted in the REPL display and overwhelming us.

At this point we can start [querying](https://cap.cloud.sap/docs/node.js/cds-ql):

```shell
> await SELECT `title, genre` .from `Bookshop.Books`
[
  {
    title: "The Hitchhiker's Guide To The Galaxy",
    genre: 'Science Fiction'
  }
]
```

But instead of querying the data, what we really want to do in this session is explore the service structure, bearing in mind that, usually, a service contains one or more entities, and those entities contain one or more elements (fields).

> Instead of using `cds.test()` there are features introduced to the cds REPL in the December 2024 release which makes this more comfortable; use either of these approaches:
> * `cds repl --run .` in the project directory (`cds r -r .` is the short version) 
> * `.run .` at the REPL prompt

<a name="exploring-the-cds-facade"></a>
## Exploring the cds facade

Just like we used the `cds` facade to discover the values of `cds.root` and `cds.home` [in part 1][3], we can use it to look at the services.

Entering `cds.` and then hitting `<Tab>`  a couple of times will cause the autocomplete facility to show what's on offer:

```shell
> cds.
cds.__proto__             cds.hasOwnProperty        cds.isPrototypeOf         cds.propertyIsEnumerable
cds.toLocaleString        cds.toString              cds.valueOf

cds.addListener           cds.eventNames            cds.getMaxListeners       cds.listenerCount
cds.listeners             cds.off                   cds.on                    cds.once
cds.prependListener       cds.prependOnceListener   cds.rawListeners          cds.removeAllListeners
cds.removeListener        cds.setMaxListeners

cds.Association           cds.Composition           cds.DatabaseService       cds.EventContext
cds.MessagingService      cds.RemoteService         cds.array                 cds.auth
cds.build                 cds.clone                 cds.constructor           cds.create
cds.delete                cds.disconnect            cds.emit                  cds.entities
cds.event                 cds.exit                  cds.foreach               cds.import
cds.in                    cds.insert                cds.lazified              cds.lazify
cds.localize              cds.odata                 cds.outboxed              cds.read
cds.reflect               cds.run                   cds.schema                cds.spawn
cds.stream                cds.struct                cds.transaction           cds.tx
cds.txs                   cds.unboxed               cds.update                cds.upsert

cds.ApplicationService    cds.Event                 cds.Request               cds.Service
cds.User                  cds.__esModule            cds._context              cds._edmProviders
cds._events               cds._eventsCount          cds._local                cds._log
cds._maxListeners         cds.app                   cds.assert                cds.builtin
cds.cli                   cds.compile               cds.compiler              cds.connect
cds.context               cds.db                    cds.debug                 cds.default
cds.deploy                cds.edmxs                 cds.entity                cds.env
cds.error                 cds.exec                  cds.extend                cds.get
cds.home                  cds.infer                 cds.linked                cds.load
cds.log                   cds.middlewares           cds.minify                cds.model
cds.options               cds.parse                 cds.plugins               cds.ql
cds.repl                  cds.requires              cds.resolve               cds.root
cds.serve                 cds.server                cds.service               cds.services
cds.shutdown              cds.test                  cds.type                  cds.utils
cds.version
```

Some of these properties are from the standard JavaScript object mechanism, but some are CAP specific and made available as part of the facade.

That's one way to start to explore. Another is to use one of the [cds REPL features][6]: `.inspect`, which has a `.depth` setting (the default value is 11, i.e. "very deep!", but can be changed) that can specified explicitly on the fly too.

Let's use this to examine the facade:

```log
> .inspect cds .depth=0
cds: cds {
  _events: [Object: null prototype],
  _eventsCount: 6,
  _maxListeners: undefined,
  model: [LinkedCSN],
  db: [SQLiteService],
  cli: [Object],
  root: '/workspaces/project',
  services: [Object],
  extend: [Function (anonymous)],
  version: '8.6.0',

  ...

  User: [Function],
  middlewares: [Object],
  shutdown: [AsyncFunction: _shutdown],
  [Symbol(shapeMode)]: false,
  [Symbol(kCapture)]: false
}
```

<a name="a-first-look-at-the-services"></a>
## A first look at the service(s)

If we enter `cds.services` at the REPL prompt, we'll see an avalanche of information, ending like this:

```text
          ...

          Layer {
            handle: [Function (anonymous)],
            name: '<anonymous>',
            params: undefined,
            path: undefined,
            keys: [],
            regexp: /^\/?(?=\/|$)/i { fast_star: false, fast_slash: true },
            route: undefined
          }
        ],
        path: '/odata/v4/bookshop'
      }
    },
    path: '/odata/v4/bookshop',
    '$linkProviders': [ [Function (anonymous)] ]
  }
}
```

Good, but too much.

We can see from the closing brace that we can probably treat it as an object. Evaluating `typeof(cds.services)` confirms this:

```shell
> typeof(cds.services)
object
```

We can use standard JavaScript affordances to look at the keys. Let's try:

```shell
> Object.keys(cds.services)
[ 'db', 'Bookshop' ]
```

You'd be right to guess that the first key represents the database service. And the second key points to the value that represents our `Bookshop` service.

We can confirm this as follows:

```shell
> Object.values(cds.services).map(x => [x.name, x.kind])
[ [ 'db', 'sqlite' ], [ 'Bookshop', 'app-service' ] ]
```

> We could also achieve this by reifying `cds.services` as an array, like this: `[...cds.services].map(x => [x.name, x.kind])`. See later for more on the rest parameter syntax (`...`).

In fact, this "basic info" of name and kind is going to be useful again shortly, so let's create a helper function thus:

```javascript
const basicInfo = x => [x.name, x.kind]
```

We can use it like this: `[...cds.services].map(basicInfo)`.

Anyway, let's keep going. In CAP, [everything is a service][6], which explains why we see the SQLite database mechanism appearing here too. But we're interested in our `Bookshop` service, which incidentally has the `kind` value of `app-service`.

<a name="digging-deeper-into-the-bookshop-service"></a>
## Digging deeper into the Bookshop service

To make it more convenient for us to work with, let's get a handle on that service object using a [destructuring assignment][11] like this: `{ Bookshop } = cds.services`.

Let's have a look at what's available in this service object, with `Object.keys(Bookshop)`:

```shell
> Object.keys(Bookshop)
[
  '_handlers', 'name',
  'options',   'kind',
  'model',     'definition',
  'namespace', 'operations',
  'entities',  '_datasource',
  'endpoints', '_adapters',
  'path',      '$linkProviders'
]
```

That's a good start, but we can also use the `.inspect` feature with the depth set to the "shallowest" value (0) to look at more or less the same information, but with more hints as to the nature of each of the properties, in a less generic JavaScript context and a more specific CAP context:

```log
> .inspect Bookshop .depth=0

Bookshop: ApplicationService {
  name: 'Bookshop',
  options: [Object],
  kind: 'app-service',
  model: [LinkedCSN],
  handlers: [EventHandlers],
  definition: [service],
  namespace: 'Bookshop',
  actions: [Function: children] LinkedDefinitions,
  entities: [LinkedDefinitions],
  endpoints: [Array],
  _adapters: [Object],
  path: '/odata/v4/bookshop',
  '$linkProviders': [Array]
}
```

We want to dig down through the entities to the elements, so let's now examine the `entities` property.

If we start typing `Bookshop.entities` at the prompt we should see the REPL already start eagerly returning a value which represents a function that returns a [LinkedDefinitions](https://cap.cloud.sap/docs/node.js/cds-reflect#iterable) object:

```shell
> Bookshop.entities
{ [Function: children] LinkedDefinitions Books: entity { kind: 'entity', elements: [LinkedDefinitions] } }
```

> We already got a clue about this from the output above - the `entities` property was shown as being an array of `LinkedDefinitions`.

So while we can't have that expression emit the entities directly (basically because it's an _iterable_), we can resolve them into an array with `...`, which is the [rest parameter syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).

> Since the August 2024 release of CAP Node.js (8.2.1) this conversion to array is now required because of some [important changes made to LinkedDefinitions](https://cap.cloud.sap/docs/releases/aug24#changes-in-node-js).

Let's do that now with `entities = [...Bookshop.entities]` which will also emit a summary of the value of the new `entities` variable created:

```shell
> entities = [...Bookshop.entities]
[
  entity {
    kind: 'entity',
    elements: LinkedDefinitions {
      ID: Integer { key: true, type: 'cds.Integer' },
      title: String { type: 'cds.String' },
      genre: String { '@loud': true, type: 'cds.String' },
      stock: Integer { type: 'cds.Integer' }
    }
  },
  entity {
    kind: 'entity',
    elements: LinkedDefinitions {
      ID: Integer { key: true, type: 'cds.Integer' }
    }
  }
]
```

> We can also use JavaScript's [`for ... in`][8] statement, or the [`for ... of`][9] statement, both of which can work with [iterables][10], as can the [rest parameter syntax][12] here too.

There are two entities in the `services.cds` file, and they are `Books` and `Things`. Therefore there are two elements in the `entities` array.

We can confirm that with `entities.length`:

```shell
> entities.length
2
```

<a name="looking-at-individual-entities-and-their-elements"></a>
## Looking at individual entities and their elements

Let's look at some of the aspects of the entities using our useful basic info function:

```shell
> entities.map(basicInfo)
[ [ 'Bookshop.Books', 'entity' ], [ 'Bookshop.Things', 'entity' ] ]
```

We can also examine the elements of the first entity (`Bookshop.Books`) like this:

```shell
> entities[0].elements
LinkedDefinitions {
  ID: Integer { key: true, type: 'cds.Integer' },
  title: String { type: 'cds.String' },
  genre: String { '@loud': true, type: 'cds.String' },
  stock: Integer { type: 'cds.Integer' }
}
>
```

Notice that the `entities[0].elements` property is shown as being of a [LinkedDefinitions](https://cap.cloud.sap/docs/node.js/cds-reflect#iterable) type, which is, as we have found out already, not an array per se, but an iterable.

So let's explore, like this:

```shell
> for (let el of entities[0].elements) console.log(el.name, Object.keys(el))
ID [ 'key', 'type' ]
title [ 'type' ]
genre [ '@loud', 'type' ]
stock [ 'type' ]
```

These are the elements (fields) of our `Book` entity. And look - there's our custom `@loud` annotation on the `genre` element!

<a name="identifying-the-elements-annotated-with-loud"></a>
## Identifying the elements annotated with @loud

Let's define a function `loudElements` that we can use when mapping over the entities to return a list of entities and any corresponding elements that have been annotated with `@loud`:

```javascript
loudElements = en => ({
    name: en.name,
    entity: en,
    elements: [...en.elements].filter(el => el['@loud']).map(el => el.name)
})
```

This takes an entity `en`, and returns an object with three properties:

* the entity's name
* the entire entity object
* a list of zero or more element names that have the `@loud` annotation

This was both possible and easy because of the wonderfully beautiful and simple way annotations are processed and stored.

Now, we can map this function over the list of entities, which should return something like this (pay particular attention to the value of the `elements` property in each of the array items):

```shell
> entities.map(loudElements)
[
  {
    name: 'Bookshop.Books',
    entity: entity {
      kind: 'entity',
      elements: LinkedDefinitions {
        ID: Integer { key: true, type: 'cds.Integer' },
        title: String { type: 'cds.String' },
        genre: String { '@loud': true, type: 'cds.String' },
        stock: Integer { type: 'cds.Integer' }
      }
    },
    elements: [ 'genre' ]
  },
  {
    name: 'Bookshop.Things',
    entity: entity {
      kind: 'entity',
      elements: LinkedDefinitions {
        ID: Integer { key: true, type: 'cds.Integer' }
      }
    },
    elements: []
  }
]
```

We only annotated the `genre` element of the `Books` entity, so this makes sense.

This way we can identify those entities upon which we need to focus.

<a name="wrapping-up"></a>
## Wrapping up

This post just scratches the surface of the power that the cds REPL gives us as developers, to explore, understand, manipulate and write code against the services and other artifacts presented in what we're building, both in _our_ user space, but also in the CAP framework's "kernel" space (see the [Kernel space and user space][13] section of [Five reasons to use CAP][14]).

In [the third and final part][15] to this series we can use the knowledge we've gained from this cds REPL session to write our actual plugin!

---

<a name="appendix-a-turning-down-the-logging"></a>
## Appending A - Turning down the logging

The reason this line appears each and every time we start up the service, even in the REPL:

```log
[LOUD] - Starting up ...
```

is because by default, the `log('Starting up ...')` call here in our plugin file `loud/cap-plugin.js`:

```javascript
const cds = require('@sap/cds')
const log = cds.log('LOUD')
log('Starting up ...')
```

emits at a level that finds its way to the server output by default.

Switching this to an explicit call to `log.debug('Starting up ...')`, which is at lower more detailed level that is not output by default, means that we don't see this line any more, except if we explicitly ask to see debug output, using the `DEBUG` environment variable, for example like this:

```shell
DEBUG=LOUD cds watch
```

or even (turning everything up to 11):

```shell
DEBUG=all cds watch
```


[1]: /blog/posts/2024/12/30/cap-node.js-plugins/
[2]: https://cap.cloud.sap/docs/releases/dec24
[3]: https://cap.cloud.sap/docs/releases/dec24#cds-repl-enhancements
[4]: /blog/posts/2024/10/05/cap-node.js-plugins-part-1-how-things-work/#diving-into-the-cap-server-source-code
[5]: /blog/posts/2024/10/05/cap-node.js-plugins-part-1-how-things-work/#setting-the-scene
[6]: https://cap.cloud.sap/docs/tools/cds-cli#cds-repl
[7]: /blog/posts/2024/12/10/tasc-notes-part-4/#everything-is-a-service
[8]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
[9]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
[10]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
[11]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[12]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
[13]: /blog/posts/2024/11/07/five-reasons-to-use-cap/#kernel-space-and-user-space
[14]: /blog/posts/2024/11/07/five-reasons-to-use-cap/
[15]: https://www.youtube.com/watch?v=hi7NXlMl3iU
