---
title: FP, function chains and CAP model loading
description: Understanding functional programming approaches, no matter how trivial, can help in other areas. Here I explain how being comfortable with function chains helped in working out why a required (but unused) service was being loaded into the overall CDS model in a CAP project.
date: 2025-05-01
tags:
  - fp
  - cap
  - filter
  - map
  - debugging
  - abstraction
---

## Introduction

I'm currently running a mini series on the Hands-on SAP Dev show, called [Let's explore functional programming](https://www.youtube.com/playlist?list=PL6RpkC85SLQB-0sK7KSRwCc2gdtlZDIkL). Nothing too heavy; so far we've looked at functions as first class citizens, the concept of higher order functions, closures, dug into reduce, glimpsed the beauty of currying and partial application and set the scene for further investigations in upcoming episodes.

In tomorrow's episode I hope to find time to start looking at function chaining with the typical JavaScript candidates `filter`, `map` and `reduce`, where we can chain such higher order functions together to process data (I cover this in various blog posts and other resources elsewhere, see [posts tagged with 'fp'](/tags/fp) for more details). Being comfortable with a technique like this, which in turn includes a healthy grasp of lambda (anonymous) functions, often in the form of [arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) and of course the whole premise of higher order functions, allows us to [stare at](/blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/#initialrecognition:~:text=%22If%20you%20stare%20long%20enough%20at%20it%20...%22.) code and understand what's going on.

Here's a case in point, where I had always been curious as to why a certain CSN source was being loaded into the overall CDS model, and found out by looking at the CAP Node.js server source code, following the logic, and seeing the light. I'd guessed there must be a reason, but my curiosity was always brought out at points where I didn't have the luxury of time to investigate ... while I was standing up in front of a workshop full of people, walking them through hands-on exercise material. This afternoon I decided to remedy that.

## Setting the scene and the challenge

In the [Service integration with SAP Cloud Application Programming Model](https://github.com/SAP-samples/cap-service-integration-codejam) CodeJam, we [import an external API definition](https://github.com/SAP-samples/cap-service-integration-codejam/tree/main/exercises/03-import-odata-api#import-the-api-specification) for the "Business Partner (A2X)" OData V2 service in Exercise 03, like this:

```shell
cds import API_BUSINESS_PARTNER.edmx
```

In the subsequent exercise, without any further changes or additions, we [start the CAP server](https://github.com/SAP-samples/cap-service-integration-codejam/tree/main/exercises/04-understand-service-mocking#start-the-cap-server) like this:

```shell
cds run
```

and see log output that starts off like this:

```log
[cds] - loaded model from 5 file(s):

  srv/external/API_BUSINESS_PARTNER.csn
  app/fiori.cds
  srv/incidents-service.cds
  db/schema.cds
  node_modules/@sap/cds/common.cds
```

Given what I knew about how resources are loaded to make up the overall CDS model, I was always a little bit curious as to why this file:

```log
srv/external/API_BUSINESS_PARTNER.csn
```

was included. According to the default set of "roots", it shouldn't be.

So the challenge is set: Can I find out _why_ it's being loaded?

## Some background on CDS roots

Briefly, `cds run` is syntactic sugar for `cds serve all`, whereupon all the resources in a set of defined roots are loaded.

What are these roots? Well, we can ask to see them with:

```shell
cds env get roots
```

which returns:

```json
[ 'db/', 'srv/', 'app/', 'schema', 'services' ]
```

In other words, unless directed otherwise, the compiler will look for files in the `db/`, `srv/` and `app/` directories (the holy model trinity) plus any files specifically named `schema` or `services`[<sup>1</sup>](#footnotes) (with `cds` or `csn` extensions).

It doesn't _descend_ within those three directories, so why does that file, in a directory _within_ `srv/`, get loaded at all?

## Use the source Luke

Taking heed of a [great piece of advice](https://wiki.c2.com/?UseTheSourceLuke) in the original Wiki[<sup>2</sup>](#footnotes) - to look at the source code, ideally while it's running, in a debugger - I dug in to the CAP Node.js server source. Here's what I discovered.

### @sap/cds/server.js

This file is loaded when a server is started, and after doing some preparations relating to the [Express](https://expressjs.com/) framework upon which it rides, it loads and prepares the models:

```javascript
// load and prepare models
const csn = await cds.load(o.from||'*',o) .then (cds.minify)
```

### @sap/cds/lib/compile/load.js

The `load` function is exported from `compile/load.js` and looks like this:

```javascript
module.exports = exports = function load (files, options) {
  const any = cds.resolve(files,options)
  if (!any) return Promise.reject (new cds.error ({
    message: `Couldn't find a CDS model for '${files}' in ${cds.root}`,
    code: 'MODEL_NOT_FOUND', files,
  }))
  return this.get (any,options,'inferred')
}
```

At this point, the value passed to the function's `files` parameter is `'*'`, effectively corresponding to the `all` in `cds serve all`, and via some nifty [lazy loading via getters](/blog/posts/2024/12/10/tasc-notes-part-4/#lazy-loading-of-the-cds-facades-many-features), in `@sap/cds/lib/index.js`:

```javascript
get resolve()  { return super.resolve = require('./compile/resolve') }
```

we end up in `@sap/cds/lib/compile/resolve.js`.

### @sap/cds/lib/compile/resolve.js

We end up specifically in the `_resolve_all` function, which looks like this:

```javascript
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

After working through the roots we looked at earlier, this function ends up (in the case of the [CAP project in the CodeJam](https://github.com/SAP-samples/cap-service-integration-codejam/tree/main/incidents)) with the following value in `sources` (the initial part of each path deliberately elided to keep things short), just before the `if` statement:

```json
[
  "/.../incidents/db/schema.cds",
  "/.../incidents/srv/incidents-service.cds",
  "/.../incidents/app/fiori.cds"
]
```

This makes sense given what we know about the roots.

Just before returning, there's a final line which pushes extra values onto this list; the condition guarding this logic is not met (there are three source items, not just one, for a start) and so this line is executed:

```javascript
sources.push (...cds.resolve (_required(cds,o.env),o)||[])
```

What is this `_required` function? Well, it's defined just above the `_resolve_all` function, like this:

```javascript
const _required = (cds,env=cds.env) => Object.values(env.requires) .map (r => r.model) .filter(x=>x)
```

#### Digging in to the function chain

That's quite a definition! Let's break it down by adding some whitespace:

```javascript
const _required =
  (cds,env=cds.env) =>
  Object.values(env.requires)
   .map(r => r.model)
   .filter(x => x)
```

There's a lot of fat arrows and dots, but staring at it for a moment reveals its actual simplicity - it's a function chain, transforming a list of values through a chain of functions (two in this case) first a call to `map`, then a call to `filter`.

The value of the `env` parameter (the second one in the `_required` signature) is an object representing the "effective" environment of the running server, and includes a `requires` property. It's the value of this property that is passed first to `Object.values`.

The value of this `requires` property looks like this (I've removed some of the entries in `auth.users` for brevity):

```json
{
  "middlewares": true,
  "auth": {
    "restrict_all_services": false,
    "kind": "mocked",
    "users": {
      "alice": {
        "tenant": "t1",
        "roles": [
          "cds.Subscriber",
          "admin"
        ]
      },
      "bob": {
        "tenant": "t1",
        "roles": [
          "cds.ExtensionDeveloper",
          "cds.UIFlexDeveloper"
        ]
      }
    },
    "tenants": {
      "t1": {
        "features": [
          "isbn"
        ]
      },
      "t2": {
        "features": "*"
      }
    }
  },
  "db": {
    "impl": "@cap-js/sqlite",
    "credentials": {
      "url": ":memory:"
    },
    "kind": "sqlite"
  },
  "API_BUSINESS_PARTNER": {
    "impl": "@sap/cds/libx/_runtime/remote/Service.js",
    "external": true,
    "kind": "odata-v2",
    "model": "srv/external/API_BUSINESS_PARTNER"
  }
}
```

Some of these "requirements" come from the defined default behaviour of a CAP Node.js server in this context. But look at that last entry:

```json
{
  "API_BUSINESS_PARTNER": {
    "impl": "@sap/cds/libx/_runtime/remote/Service.js",
    "external": true,
    "kind": "odata-v2",
    "model": "srv/external/API_BUSINESS_PARTNER"
  }
}
```

That is directly from the `cds.requires` section of the project's `package.json` file (which can be neatly expressed as `package.json#cds.requires`) ... which was added by the actions initiated with the invocation of `cds import API_BUSINESS_PARTNER.edmx`:

```json
{
  "cds": {
    "requires": {
      "API_BUSINESS_PARTNER": {
        "kind": "odata-v2",
        "model": "srv/external/API_BUSINESS_PARTNER"
      }
    }
  }
}
```

OK, so now we know what's in `env.requires` - an object with entries representing different requirements, in different shaped JSON stanzas.

Now let's look at the function chain.

First, we have a call to `map`, where the callback function is simply:

```javascript
r => r.model
```

All this does is return the value of the `model` property for each object passed in. Looking back at the entire `env.requires` value earlier, we can see that this is going to produce something that looks a little odd:

```json
[
  undefined,
  undefined,
  undefined,
  "srv/external/API_BUSINESS_PARTNER"
]
```

Only the `API_BUSINESS_PARTNER` object has a `model` property.

This is fine, and also indicative of the simplicity with which function chains can be conceived, constructed and understood.

All that is wanted here is a reference to any and all CDS model files, and if there are any other items required that aren't directly related to the overall CDS model, then that's OK, they won't have a `model` property, meaning `undefined` is returned for those (`middlewares`, `auth` and `db`).

This simple callback function for `map` produces a simple structure (`map` always reads a list and produces a list that is the same length).

And now this is passed in, to the next (and last) function in this chain, namely to `filter`, which is another higher order function that takes a predicate function[<sup>3</sup>](#footnotes), which is even simpler than the previous callback function:

```javascript
x => x
```

What the heck is going on here? Well, JavaScript's [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) function takes a list (like `map` does), and returns a list, but (unlike `map`) that list may be shorter. Filter removes any elements for which the predicate function, when called with that element, returns something that is false ... or [falsey](https://developer.mozilla.org/en-US/docs/Glossary/Falsy).

And with `x => x`, what is returned is effectively the value of the element passed in. Given that `undefined` is falsey, all that is emitted from this second and last function in the chain is:

```json
[
  "srv/external/API_BUSINESS_PARTNER"
]
```

And that's exactly what is needed - a list of CDS model file references to be pushed onto the end of the `sources` list that already exists, giving:

```json
[
  "/.../incidents/db/schema.cds",
  "/.../incidents/srv/incidents-service.cds",
  "/.../incidents/app/fiori.cds",
  "/.../incidents/srv/external/API_BUSINESS_PARTNER"
]
```

## Conclusion

So now it's clear why the `srv/external/API_BUSINESS_PARTNER.csn` model file is loaded:

```log
[cds] - loaded model from 5 file(s):

  srv/external/API_BUSINESS_PARTNER.csn
  app/fiori.cds
  srv/incidents-service.cds
  db/schema.cds
  node_modules/@sap/cds/common.cds
```

(In case you're wondering, the `node_modules/@sap/cds/common.cds` model file is loaded because it's "imported" from within `db/schema.cds` with `using { cuid, managed, sap.common.CodeList } from '@sap/cds/common';`).

But the bigger conclusion here is that reading code is extremely useful. And, going [from the comparative to the superlative](https://dictionary.cambridge.org/grammar/british-grammar/comparison-adjectives-bigger-biggest-more-interesting) here, the biggest conclusion is perhaps the yin-yang of learning. Some basic knowledge of functional programming approaches has allowed us to dig into the source and understand what's going on. And conversely, reading that code has increased our understanding and appreciation for such approaches, especially with the simplicity of the callback functions in the function chain here.

If you're keen to learn more, perhaps I'll see you live in the chat on our [series exploring functional programming](https://www.youtube.com/playlist?list=PL6RpkC85SLQB-0sK7KSRwCc2gdtlZDIkL) sometime soon. Until then, happy learning!

## Notes

There's so much other stuff to unpick from what we've seen in the code we've been digging into. Here are a couple of items.

### Default parameter definition references

Did you notice the signature for `_required`:

```javascript
const _required = (cds,env=cds.env) => Object.values(env.requires) .map (r => r.model) .filter(x=>x)
```

What on earth is going on with `(cds,env=cds.env)`?

Well, functions can have default parameters. That's not surprising. The [MDN reference page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) gives this simple example:

```javascript
function multiply(a, b = 1) {
  return a * b;
}
```

That's straightforward, in that if no value is supplied for `b`, the default value of `1` is used.

But what about `env=cds.env`? The default value here ... is referring to a property in the `cds` object, which itself is the first parameter! Said out loud:

"_If there's no value[<sup>4</sup>](#footnotes) for the `env` parameter, take the value of the `env` property of the (object) value passed to the first parameter named `cds`_".

I did a double-take when I first saw that, and thought it worth highlighting.

### Callback function parameter names

There's an innate beauty in abstraction when it comes to functions, and one thing I discovered when digging into Haskell was the consistent and sensible use of the symbols [`x` and `xs`](/blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/#introduction-via-haskell). When expressing a function as simple as either of the callback functions we encountered here:

```javascript
r => r.model
```

and

```javascript
x => x
```

there's a natural tendency to think of such expressions, such operations, in an abstract way.

In this context, I enjoyed the code author's choice of `x` here, but also understood the choice of `r` to perhaps represent "the required thing". Personally I would have used `x` here too (i.e. `x => x.model`), but all the same, I'm glad they're both just single letter symbols. Long symbol names would detract from the readability here as well as the abstract nature. But that's a longer story for another time, perhaps.

<a name="footnotes"></a>
## Footnotes

1. That's why my micro starter script [cdsnano](https://github.com/qmacro/dotfiles/blob/main/scripts/cdsnano) copies a single CDS file called `services.cds` from the [nano template directory](https://github.com/qmacro/dotfiles/tree/main/scripts/cdsnano-template) because it will be automatically picked up based on the default roots, and has everything in it - the [simplest thing that could possibly work](https://creators.spotify.com/pod/profile/tech-aloud/episodes/The-Simplest-Thing-that-Could-Possibly-Work--A-conversation-with-Ward-Cunningham--Part-V---Bill-Venners-e5dpts).

2. This is of course Ward Cunningham's own Wiki "C2".

3. A "predicate function" is a function that returns a boolean value, i.e. `true` or `false`, and can therefore be used as callbacks in higher order functions such as `filter`.

4. Or `undefined`.
