---
title: CAP Node.js plugins - part 1 - how things work
date: 2024-10-05
tags:
  - cap
  - cds
  - plugins
description: In this first of a three part series of blog posts accompanying a corresponding video series, we explore the CDS plugin mechanism in CAP. This post is about understanding how the plugin mechanism works.
---

For information on the series and links to all resources, see the [CAP Node.js
Plugins](/blog/posts/2024/12/30/cap-node-js-plugins/) series post.

> The examples in this post are based on CAP Node.js at release 8.3.0
> ([September 2024](https://cap.cloud.sap/docs/releases/sep24)).

## Setting the scene

To set the scene, imagine a simple service scenario, where we've got two
entities:

- `Books`, where we'll be focusing our attention for the plugin
- `Things`, just there as a "control" to show how we can properly implement a
  plugin that's generic and doesn't have to be aware of specific entity names

This is the entire service definition, in `services.cds`, including the
entities:

```cds
service Bookshop {
    entity Books {
        key ID          : Integer;
            title       : String;
            genre       : String;
            stock       : Integer;
    }
    entity Things {
        key ID : Integer;
    }
}
```

Starting the CAP server with `cds watch` gives us what we expect, there's some
data deployed to the in-memory persistence layer and we have an OData V4
service being served.

```log
...
[cds] - loaded model from 1 file(s):

  services.cds

[cds] - connect using bindings from: { registry: '~/.cds-services.json' } [cds]
- connect to db > sqlite { url: ':memory:' }
  > init from data/Bookshop.Books.csv
/> successfully deployed to in-memory database.
...
[cds] - using new OData
adapter [cds] - serving Bookshop { path: '/odata/v4/bookshop' }

[cds] - server listening on { url: 'http://localhost:4004' }
```

## Debug and digging in

Often when I'm trying to deconstruct and understand something, I turn to the
`DEBUG` environment variable. It give me a ton of info to start staring at.

Running `DEBUG=all cds watch` emits far too much output to even show here in
this post. But that's sort of the point. More is better, but right now let's
limit it to the plugins module, by using `DEBUG=plugins cds watch`. In addition
to the log output we've already seen (above), this now also emits:

```log
[cds] - loading plugin @sap/cds-fiori: {
  impl: '../../usr/local/share/npm-global/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds-fiori/cds-plugin.js'
}
[cds] - loading plugin @cap-js/sqlite: {
  impl: '../../usr/local/share/npm-global/lib/node_modules/@sap/cds-dk/node_modules/@cap-js/sqlite/cds-plugin.js'
}
[plugins] - [cds] - loaded plugins in: 2.464ms
```

This is interesting! What is this telling us? Well ...

- There are already plugins being loaded! The [CAP framework uses the plugin
  concept itself](https://cap.cloud.sap/docs/plugins/), here we can see that
  `@sap/cds-fiori` and `@cap-js/sqlite` are plugins. But where are they
  defined, why are these specific ones being loaded? We'll come to that
  shortly.
- The _filename_ in each of these plugins is `cds-plugin.js`, and we can recall
  this from [the plugin
  documentation](https://cap.cloud.sap/docs/node.js/cds-plugins#add-a-cds-plugin-js).
  That's what we'll need to start with too for our own plugin.
- Right now, the implementation (in `cds-plugin.js`) for each of these plugins
  is found in the global `@sap/cds-dk` location (`../../usr/local/share/ ...
  /node_modules/@sap/cds-dk/...`). Rather than dig around trying to look at the
  detail there, it would be easier to be able to look in a project-local
  `node_modules/` directory hierarchy here.

## Local install and identifying the plugin mechanism

So let's install the project dependencies now, with `npm install`, which emits
something like this:

```log
added 112 packages, and audited 113 packages in 13s

22 packages are looking for funding
  run `npm fund` for details

4 low severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```

Now we can look locally for that "loading plugin" message from the debug
output, using `grep -R 'loading plugin' *`. This shows us:

```log
node_modules/@sap/cds/bin/serve.js:  // Ensure loading plugins before calling cds.env!
node_modules/@sap/cds/lib/plugins.js:    DEBUG?.(`loading plugin ${plugin}:`, { impl: local(conf.impl) })
node_modules/.bin/cds-serve:  // Ensure loading plugins before calling cds.env!
```

Cool. There's a comment in `node_modules/@sap/cds/bin/serve.js` (and that
`cds-serve` is just a symlink to that same file) ... but that DEBUG output
statement in `plugins.js` seems like the right place. Let's have a look ... at
the CAP server source code - let's dive in!

## Diving into the CAP server source code

Taking a look inside `node_modules/@sapcds/lib/plugins.js` we can see all sorts
of stuff, but I'm drawn to this `fetch` function:

```javascript
/**
 * Fetch cds-plugins from project's package dependencies.
 * Used in and made available through cds.env.plugins.
 */
exports.fetch = function (DEV = process.env.NODE_ENV !== 'production') {
  const plugins = {}
  fetch_plugins_in (cds.home, false)
  fetch_plugins_in (cds.root, DEV)
  function fetch_plugins_in (root, dev) {
    let pkg; try { pkg = exports.require(root + '/package.json') } catch { return }
    let deps = { ...pkg.dependencies, ...dev && pkg.devDependencies }
    for (let each in deps) try {
      let impl = exports.require.resolve(each + '/cds-plugin', { paths: [root] })
      const packageJson = exports.require.resolve(each + '/package.json', { paths: [root] })
      plugins[each] = { impl, packageJson }
    } catch { /* no cds-plugin.js */ }
  }
  return plugins
}
```

There are two calls to `fetch_plugins_in`, with different sources:

- `cds.home`
- `cds.root`

This code may appear initially a little dense, but if we stare at it for a bit
we see that the `fetch_plugins_in` function tries to `require` a `package.json`
file in the source given, and then tries to `resolve` a `cds-plugin.js` file in
each of the `dependencies` (and `devDependencies` if development mode is
indicated) in the `package.json` files that it manages to find.

Here's what that looks like in glorious ASCII art:

```text

            fetch_plugins_in
            +--------------------------------------+
[source] -> | [source]/package.json                |
            |            |                         |
            |            +-- dependencies          |
            |            |     |                   |
            |            |     +-- cds-plugin.js ? |
            |            |     +-- ...             |
            |            |                         |
            |            +-- devDependencies       |
            |                  |                   |
            |                  +-- cds-plugin.js ? |
            |                  +-- ...             |
            +--------------------------------------+
```

OK, so we're definitely onto something.

But what are these sources `cds.home` and `cds.root`?

## Embracing the REPL

Well, to find out, I'm going to use one of the perhaps lesser known and more
mysterious superpowers - the
[REPL](https://cap.cloud.sap/docs/tools/cds-cli#cds-repl).

> The concept of a REPL, which stands for [Read Evaluate Print
> Loop](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) is
> an old one, dating back to the 1960's, especially (but not only) in the world
> of Lisp. This is yet another example of where the [Art & Science of
> CAP](/blog/posts/2024/12/06/the-art-and-science-of-cap/) has venerable
> ancestry.

Wanting to know more about `cds.home` and `cds.root` is a perfect opportunity
to try out the REPL, in a nice and gentle way. And we'll be making heavy use of
the REPL in part 2 of this series, so it's worth becoming acquainted with it
now.

Starting the repl with `cds repl`, we can examine the values of `cds.home` and
`cds.root` like this:

```log
Welcome to cds repl v 8.3.0
> cds.home
/workspaces/project/node_modules/@sap/cds
> cds.root
/workspaces/project
>
```

So we can see that `cds.home` is `/workspaces/project/node_modules/@sap/cds`,
i.e. the root part of the libraries, installed as project-local packages, that
make up the CAP framework, and that `cds.root` is `/workspaces/project` which
is the root part of our CAP project directory structure.

## Examining the surface area for plugin discovery

So we now know that it's looking for plugin implementations in the collection
of packages made up of the `dependencies` and `devDependencies` of this
project's `package.json` and also of `@sap/cds`'s `package.json`.

I can use the power of `jq` and get a look at that entire list, like this:

```shell
jq '.name, .dependencies + .devDependencies' \
  node_modules/@sap/cds/package.json \
  package.json
```

This emits:

```json
"@sap/cds"
{
  "@sap/cds-compiler": ">=5.1",
  "@sap/cds-fiori": "^1",
  "@sap/cds-foss": "^5.0.0"
}
"plugins-deconstructed-starter"
{
  "@sap/cds": "^8",
  "express": "^4",
  "@cap-js/sqlite": "^1"
}
```

Manually checking for `cds-plugin.js` files, with `find . -name cds-plugin.js`
shows that the only occurrences of `cds-plugin.js` files are these two:

```log
node_modules/@sap/cds-fiori/cds-plugin.js
node_modules/@cap-js/sqlite/cds-plugin.js
```

And this also shows us that:

- `@sap/cds-fiori` (referenced in `node_modules/@sap/cds/package.json`)
- and `@cap-js/sqlite` (referenced in `package.json`)

are indeed implemented ... as plugins!

And guess what? These are _exactly_ those two listed when we ran `DEBUG=plugins
cds watch`. Of course now that we've installed `@sap/cds` locally in the
project, the implementation files are taken from there, within our
project-local `node_modules/` directory, rather than from `@sap/cds-dk` in the
global NPM modules directory:

```log
[cds] - loading plugin @sap/cds-fiori: { impl: 'node_modules/@sap/cds-fiori/cds-plugin.js' }
[cds] - loading plugin @cap-js/sqlite: { impl: 'node_modules/@cap-js/sqlite/cds-plugin.js' }
[cds] - loaded plugins in: 35.172ms
```

## Creating our own plugin package

Now we know what we need -- a package with a `cds-plugin.js` file -- let's
create one.

For convenience, we can use the [workspaces concept in
NPM](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to create the plugin
package locally but still "require" it via the normal `dependencies` route.

This is achieved as follows: `npm init -y --workspace loud`, which outputs
something like this:

```log
Wrote to /workspaces/project/loud/package.json:

{
  "name": "loud",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

added 1 package in 191ms
```

And now that our plugin package exists in that workspace context, we can just
add it as a dependency as normal, with:

```bash
npm add loud
```

whereupon we see that this is now listed as normal in the `dependencies`
section. Here's what the project's `package.json` content looks like now, with
the addition of the `workspaces` section and the inclusion of the `loud`
package reference in the `dependencies` section:

```json
{
  "name": "plugins-deconstructed-starter",
  "version": "0.0.1",
  "description": "A minimal CAP starter project with a single services.cds file",
  "dependencies": {
    "@sap/cds": "^8",
    "express": "^4",
    "loud": "^1.0.0"
  },
  "devDependencies": {
    "@cap-js/sqlite": "^1"
  },
  "scripts": {
    "start": "cds-serve"
  },
  "workspaces": [
    "loud"
  ]
}
```

## Getting the plugin to announce itself

OK, before bringing this first part to an end, we could at least get the plugin
to announce itself. Right now the new plugin package exists and is wired up,
but there's still no sign of it in the output when we run `DEBUG=plugins cds
watch`:

```log
[cds] - loading plugin @sap/cds-fiori: { impl: 'node_modules/@sap/cds-fiori/cds-plugin.js' }
[cds] - loading plugin @cap-js/sqlite: { impl: 'node_modules/@cap-js/sqlite/cds-plugin.js' }
[cds] - loaded plugins in: 26.998ms
```

But having deconstructed the mechanism, we sort of know why this is now. It's
because the "fetch" mechanism we saw earlier hasn't yet found a `cds-plugin.js`
file. If we add one now with `touch loud/cds-plugin.js` while the CAP server is
still running, we see this new log record in the output that tells us it's now
getting loaded:

```log
[cds] - loading plugin loud: { impl: 'loud/cds-plugin.js' }
```

But there's no implementation at all yet. For now, we'll just add "[the
simplest thing that could possibly
work](https://podcasters.spotify.com/pod/show/tech-aloud/episodes/The-Simplest-Thing-that-Could-Possibly-Work--A-conversation-with-Ward-Cunningham--Part-V---Bill-Venners-e5dpts)"
and add the usual CDS facade constant plus some log output, in
`loud/cds-plugin.js`:

```javascript
const cds = require('@sap/cds')
const log = cds.log('LOUD')
log('Starting up ...')
```

Now our plugin exists, is connected up, and announces itself!

```log
[cds] - loading plugin @sap/cds-fiori: { impl: 'node_modules/@sap/cds-fiori/cds-plugin.js' }
[cds] - loading plugin loud: { impl: 'loud/cds-plugin.js' }
[LOUD] - Starting up ...
[cds] - loading plugin @cap-js/sqlite: { impl: 'node_modules/@cap-js/sqlite/cds-plugin.js' }
[plugins] - [cds] - loaded plugins in: 10.173ms
```

That's it for part 1 of this series. In the next part, we'll head back to the
REPL and explore the service, and what it contains (entities, with their
elements), dynamically, while the server is running, using introspection. That
way we can work out what we will need for our plugin code.
