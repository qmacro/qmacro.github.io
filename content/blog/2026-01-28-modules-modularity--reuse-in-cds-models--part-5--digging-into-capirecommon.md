---
title: Modules, modularity & reuse in CDS models - part 5 - digging into @capire/common
date: 2026-01-28
tags:
  - cds
  - cap
  - reuse
  - npm
  - plugins
  - modularity
description: In this post I look at various mechanisms that @capire/common has that makes it "active" as a reuse package.
---

(Get to all the parts in this series via the [series
post](/blog/posts/2026/01/01/modules-modularity-and-reuse-in-cds-models/).)

At the end of the previous part in this series we [added
@capire/common](/blog/posts/2026/01/21/modules-modularity-and-reuse-in-cds-models-part-4-from-passive-to-active-with-capire-common/#adding-capire-common)
to the host project `use-capire`, and without doing anything else -- no
referencing of this reuse package's contents anywhere in our own CDS model -- we
saw the explosion of sources in the CDS model when the CAP server automatically
restarted.

## The model sources

This is what was emitted by the CAP server:

```log
[cds] - loaded model from 7 file(s):

  srv/cat-service.cds
  node_modules/@sap/cds/srv/outbox.cds
  node_modules/@capire/common/index.cds
  node_modules/@capire/common/regions.cds
  node_modules/@capire/common/currencies.cds
  db/schema.cds
  node_modules/@sap/cds/common.cds
```

Taking these 7 files, we have the sources specific to the `use-capire` project:

```text
srv/cat-service.cds
db/schema.cds
```

as well as the source for the built-in [task
queues](https://cap.cloud.sap/docs/guides/messaging/task-queues) mechanism:

```text
node_modules/@sap/cds/srv/outbox.cds
```

plus three sources from `@capire/common`:

```text
node_modules/@capire/common/index.cds
node_modules/@capire/common/regions.cds
node_modules/@capire/common/currencies.cds
```

and the well-known `@sap/cds/common` source:

```text
node_modules/@sap/cds/common.cds
```

While it's fairly clear why we have the built-in task queues based source and the
`use-capire`-specific sources, the immediate presence of the other sources are
a little more puzzling.

Let's dig in.

## Contents of @capire/common

We're now familiar with the extreme basics of a reuse package, in the form of the
[now-published](/blog/posts/2026/01/14/modules-modularity-and-reuse-in-cds-models-part-3-publishing-the-simple-reuse-package/)
`@qmacro/common`:

```text
.
├── README.md
├── index.cds
└── package.json
```

However, the contents of `@capire/common`, which we [took an initial look at in part 1
of this
series](/blog/posts/2026/01/01/modules-modularity-and-reuse-in-cds-models-part-1-an-introduction/#module-capire-common),
are a little more involved:

```text
.
├── LICENSE
├── cds-plugin.js
├── currencies.cds
├── data/
│   ├── sap.common-Countries.csv
│   ├── sap.common-Countries_texts.csv
│   ├── sap.common-Currencies.csv
│   ├── sap.common-Currencies_texts.csv
│   ├── sap.common-Languages.csv
│   └── sap.common-Languages_texts.csv
├── index.cds
├── package.json
├── readme.md
└── regions.cds
```

### The essential files

Ignoring the two general repo files `LICENSE` and `readme.md` and the CSV files
in `data/`, we are left with:

```text
.
├── cds-plugin.js
├── currencies.cds
├── index.cds
├── package.json
└── regions.cds
```

There are the two familiar files `index.cds` and `package.json` which are
also present in `@qmacro/common`, but there's `cds-plugin.js` as well.

Let's take each of these three files, one at a time.

### cds-plugin.js

If you've read the [CAP Node.js
Plugins](/blog/posts/2024/12/30/cap-node-js-plugins/) series, especially [part
1 - how things
work](/blog/posts/2024/10/05/cap-node-js-plugins-part-1-how-things-work/),
you'll know that `cds-plugin.js` is a specially named file for which the
built-in plugin loading mechanism searches on startup.

It just so happens that this `@capire/common` reuse package has no need of any
custom code in `cds-plugin.js`, but the fact that the file exists causes the
plugin to be loaded[<sup>1</sup>](#footnotes).

We can see this if we turn on debug output for the plugins mechanism:

```bash
DEBUG=plugins cds watch
```

whereupon the following will be emitted as part of the server log output:

```log
[cds.plugins] - fetched plugins in: 1.315ms
[cds.plugins] - loading @sap/cds-fiori: { impl: 'node_modules/@sap/cds-fiori/cds-plugin.js' }
[cds.plugins] - loading @capire/common: { impl: 'node_modules/@capire/common/cds-plugin.js' }
[cds.plugins] - loading @cap-js/sqlite: { impl: 'node_modules/@cap-js/sqlite/cds-plugin.js' }
[cds.plugins] - loaded plugins in: 7.149ms
```

There's our `@capire/common` being loaded.

What effect does this have? Well, "loading" a plugin does not concern itself
solely with the contents of `cds-plugin.js`. The [CDS Plugin
Packages](https://cap.cloud.sap/docs/node.js/cds-plugins#cds-plugin-packages)
topic in Capire tells us:

> "The `cds-plugin` technique allows to provide extension packages with
> auto-configuration."

and indeed the
[Auto-Configuration](https://cap.cloud.sap/docs/node.js/cds-plugins#auto-configuration)
section of the same topic tells us:

> "Plugins can also add new configuration settings, thereby providing auto
> configuration. Simply add a `cds` section to your `package.json` file, as you
> would do in a project's `package.json`."

So now that the reuse package is being loaded as a plugin, let's next turn our
attention to `@capire/common`'s `package.json` file.

### package.json

Here's the content:

```json
{
  "name": "@capire/common",
  "description": "A plugin extending @sap/cds/common, and providing reuse content.",
  "repository": "https://github.com/capire/common",
  "version": "2.0.2",
  "dependencies": {
    "@sap/cds": "*"
  },
  "cds": {
    "requires": {
      "@capire/common/data": {
        "model": "@capire/common"
      }
    }
  }
}
```

The `name`, `repository` and other properties are all
self-explanatory. But look at that `cds` property!

#### The effective environment

The value of the `cds` property _becomes part of the effective environment_,
part of the the CAP server's specific DNA.

We can examine this from within our `use-capire` project root by running:

```bash
cds env requires
```

which emits:

```text
{
  middlewares: true,
  queue: {
    model: '@sap/cds/srv/outbox',
    ...
    kind: 'persistent-queue'
  },
  auth: {
    restrict_all_services: false,
    kind: 'mocked',
    users: {
      alice: { tenant: 't1', roles: [ 'admin' ] },
      ...
      yves: { roles: [ 'internal-user' ] },
      '*': true
    },
    tenants: { t1: { features: [ 'isbn' ] }, t2: { features: '*' } }
  },
  '@capire/common/data': { model: '@capire/common' },     <---
  db: {
    impl: '@cap-js/sqlite',
    ...
    kind: 'sqlite'
  }
}
```

The arrow shows the value of `@capire/common/package.json#cds.requires`, which
is now part of the overall set of "requires" for the project server.

While the property's key (name) is largely irrelevant, the value:

```json
{
  "model": "@capire/common"
}
```

is critical.

It means that `@capire/common` should become part of the project's
overall CDS model.

> How this happens technically is explained in [Appendix A - Including
> neighbourhood models](#appendix-a-including-neighbourhood-models).

And understanding what that means takes us back to earlier points in this
series, specifically:

- [Imports and model
  resolution](blog/posts/2026/01/01/modules-modularity-and-reuse-in-cds-models-part-1-an-introduction/#imports-and-model-resolution)
  in part 1
- [Transferring the type
  definition](/blog/posts/2026/01/07/modules-modularity-and-reuse-in-cds-models-part-2-creating-a-simple-reuse-package/#transferring-the-type-definition)
  in part 2

In the model's structure, any reference to a directory will cause the compiler
to look for an "index" file therein. And as the `@capire/common` reuse package
is, at the end of the day, a directory (within `node_modules/`), that's what
will happen here.

## index.cds

So it makes perfect sense to have an `index.cds` file as the entrypoint for
`@capire/common`. And as we learned when [first examining module
@capire/common](/blog/posts/2026/01/01/modules-modularity-and-reuse-in-cds-models-part-1-an-introduction/#module-capire-common),
that `index.cds` file points to the other two files in [the essential
files](#the-essential-files) list:

```text
          index.cds
              |
        +-----+-----+
        |           |
currencies.cds   regions.cds
```

This is done with a couple of simple `using` directives:

```cds
using from './currencies';
using from './regions';
```

So. That covers the loading of:

```text
node_modules/@capire/common/index.cds
node_modules/@capire/common/regions.cds
node_modules/@capire/common/currencies.cds
```

and as we can probably guess (and confirm by looking within `regions.cds` and
`currencies.cds`), there's also:

```text
node_modules/@sap/cds/common.cds
```

that's being loaded because it's brought in via `using` directives in each of
those `.cds` files.

## Wrapping up

This nicely brings us back to where we started with [the model
sources](#the-model-sources). But now we understand:

- what they are
- where they come from
- why they're loaded

Essentially:

- the fact that `@capire/common` reuse package was constructed as a plugin
- combined with its `package.json#cds` configuration determining the
  requirement for its model to be included
- and the presence of an "index" entrypoint file

makes the package "active" ... and definitely educational!

There is elegance in the simplicity of axioms such as [AXI003 Convention
over
configuration](https://github.com/qmacro/capref/blob/main/axioms/AXI003.md),
that inform this approach. There is a beauty in how such axioms are
realised in the CAP framework.

Moreover, the power of small mechanisms like this, with their broad
reach, can bring about "nuclear weapons effects" - not my words, but the words
of CAP's BDFL, Daniel Hutzel.

## Footnotes

1. In fact the only thing that `cds-plugin.js` contains is a comment to this
   effect:

    ```javascript
    // dummy to auto-load the plugin
    ```

## Appendix A - Including neighbourhood models

There's a function in the CAP Node.js runtime resolver that does the work here.
Its brevity belies the powerful effect that it truly has.

### Inside lib/compile/resolve.js

The function is called `_required` and is in `@sap/cds/lib/compile/resolve.js`.

Here's what the function looks like, alongside its big sister function
`_resolve_all`, which calls it (this is at CAP Node.js version 9.6.3):

```javascript
const _required = (cds,env=cds.env) => Object.values(env.requires) .map (r => r.model) .filter(x=>x)
const _resolve = require('module')._resolveFilename

function _resolve_all (o,cds) {
  const {roots} = o.env || cds.env; if (o.dry || o === false)  return [ ...roots, ...new Set(_required(cds).flat()) ]
  const cache = o.cache || exports.cache
  const cached = cache['*']; if (cached) return cached
  cache['*'] = [] // important to avoid endless recursion on '*'
  const sources = cds.resolve (roots,o) || []
  if (!(sources.length === 1 && sources[0].endsWith('csn.json'))) // REVISIT: why is that? -> pre-compiled gen/csn.json?
    sources.push (...cds.resolve (_required(cds,o.env),o)||[])
  return cache['*'] = _resolved (sources)
}
```

Remember that with regards to the inclusion of any neighbourhood models, the
required model specified in `@capire/common`'s `package.json#cds` configuration
is the target:

```json
{
  "cds": {
    "requires": {
      "@capire/common/data": {
        "model": "@capire/common"
      }
    }
  }
}
```

In other words, the required model is stated as being `@capire/common`.

Within the `_resolve_all` function, the relevant processing starts towards the
end of the function.

### Gathering model sources

Given the line:

```javascript
sources.push (...cds.resolve (_required(cds,o.env),o)||[])
```

we need to understand that `sources` is an array that contains the "primary"
sources for the model, and, before this line is executed, for our `use-capire`
project, contains the two usual suspect files:

```javascript
[
  '/tmp/use-capire/db/schema.cds',
  '/tmp/use-capire/srv/cat-service.cds'
]
```

What does the `sources` array contain after this line is executed? This:

```javascript
[
  '/tmp/use-capire/db/schema.cds',
  '/tmp/use-capire/srv/cat-service.cds',
  '/tmp/use-capire/node_modules/@sap/cds/srv/outbox.cds',
  '/tmp/use-capire/node_modules/@capire/common/index.cds'
]
```

So - what does `_required` do to cause these two references:

```text
/tmp/use-capire/node_modules/@sap/cds/srv/outbox.cds
/tmp/use-capire/node_modules/@capire/common/index.cds
```

to be added to the `sources` array, i.e. to the sources for the overall model?

### Looking at _required

To answer, that, let's take a moment to [stare
at](/blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/#initial-recognition)
that `_required` function, which looks like this when we add some whitespace to
it:

```javascript
(cds,env=cds.env) =>
  Object.values(env.requires)
    .map(r => r.model)
    .filter(x=>x)
```

Briefly, this function:

- expects an environment definition, defaulting to the main one (in `cds.env`)
- produces a list of the values of the `requires` properties in that
  environment definition
- pares down each of those values to just the value's `model` specification (if
  there is one)
- removes any empty values (i.e. if there wasn't a `model` property)

Remembering the values of the `requires` property of [the effective
environment](#the-effective-environment) from earlier:

```text
{
  middlewares: true,
  queue: {
    model: '@sap/cds/srv/outbox',
    ...
    kind: 'persistent-queue'
  },
  auth: {
    restrict_all_services: false,
    kind: 'mocked',
    users: {
      alice: { tenant: 't1', roles: [ 'admin' ] },
      ...
      yves: { roles: [ 'internal-user' ] },
      '*': true
    },
    tenants: { t1: { features: [ 'isbn' ] }, t2: { features: '*' } }
  },
  '@capire/common/data': { model: '@capire/common' },
  db: {
    impl: '@cap-js/sqlite',
    ...
    kind: 'sqlite'
  }
}
```

we can see that there are only two that contain a `model` property:

- `queue` with model `@sap/cds/srv/outbox` - for the task queue mechanism
- `@capire/common/data` with model `@capire/common` - our reuse package

Bingo! These both get pushed onto the `sources` array (as filesystem
references, via `cds.resolve`) and consequently included as part of the overall
CDS model for the runtime.

### Further reading

If you want an even deeper dive into this mechanism, you might be interested in
reading the blog post [FP, function chains and CAP model
loading](/blog/posts/2025/05/01/fp-function-chains-and-cap-model-loading/).
