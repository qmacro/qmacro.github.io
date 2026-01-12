---
title: Modules, modularity & reuse in CDS models - part 4 - from passive to active with @capire/common
date: 2026-01-21
tags:
  - cds
  - cap
  - reuse
  - npm
  - modularity
description: Starting with a simple use of the published @qmacro/common reuse module, I then turn to @capire/common for a first look at what I call an "active" reuse module.
---
(Get to all the parts in this series via the [series post](/blog/posts/2026/01/01/modules-modularity-and-reuse-in-cds-models/).)

In the [previous part](/blog/posts/2026/01/14/modules-modularity-and-reuse-in-cds-models-part-3-publishing-the-simple-reuse-package/) we published `@qmacro/common`. Let's start out here by creating a new simple CAP Node.js project and bringing in that `@qmacro/common` package; not only will this show that we really do have a publicly available & shareable reuse package, but observing what happens will also underline its simple and [passive](/blog/posts/2026/01/01/modules-modularity-and-reuse-in-cds-models-part-1-an-introduction/#active-vs-passive) nature.

## Creating a simple host project

Instead of turning back to the "host" CAP Node.js project that [we created in part 1](/blog/posts/2026/01/07/modules-modularity-and-reuse-in-cds-models-part-2-creating-a-simple-reuse-package/#creating-a-simple-cap-node-js-project) with the `packages/@qmacro/common` workspace, let's create a fresh host project to have a clean context into which to bring each reuse module. First, let's set up[<sup>1</sup>](#footnotes) `part4a` for [qmacro/common](https://github.com/qmacro/common):

```bash
cds init \
  --add tiny-sample \
  part4a \
  && cd $_ \
  && npm install
```

The CDS model artifacts in the "tiny-sample" facet are still simple enough,
which is what we want. Starting the server now (with `cds watch`) will allow us
to see what happens (and, perhaps a little more telling, what does not happen)
in subsequent steps:

```log
[cds] - loaded model from 3 file(s):

  srv/cat-service.cds
  node_modules/@sap/cds/srv/outbox.cds
  db/schema.cds

[cds] - connect to db > sqlite { url: ':memory:' }
  > init from db/data/my.bookshop-Books.csv
/> successfully deployed to in-memory database.
```

Noteworthy here are the files which are being loaded for the CDS model, and the
initial data load from a CSV file that was found.

## @qmacro/common

It's now time to start exploring what it's like to actually use a reuse
package. We'll start here with `@qmacro/common` and then later take a first
look at `@capire/common`, so that we can compare what happens.

### Adding @qmacro/common

In a second terminal session (so we can monitor the `cds watch` output in the
first) let's install[<sup>2</sup>](#footnotes) the `@qmacro/common` reuse
module:

```bash
npm add @qmacro/common
```

This emits something like this:

```log
added 1 package, and audited 115 packages in 858ms

found 0 vulnerabilities
```

More importantly, it causes the CAP server to restart. But so far, there are no new log lines of interest - the same 3 files as before are loaded for the CDS model, and the same single CSV file.

### Using @qmacro/common

Let's now make use of this simple passive reuse package by importing[<sup>3</sup>](#footnotes), as a first step:

```cds
using qmacro from '@qmacro/common'; // <--

namespace my.bookshop;

entity Books {
  key ID    : Integer;
      title : String;
      stock : Integer;
}
```

As soon as the file is saved with this new `using` directive, the CAP server restarts, and a new CDS file appears in the list of sources used to create the CDS model:

```log
[cds] - loaded model from 4 file(s):

  srv/cat-service.cds
  node_modules/@sap/cds/srv/outbox.cds
  db/schema.cds
  node_modules/@qmacro/common/index.cds
```

It's the [index.cds](https://github.com/qmacro/common/blob/a6e2daea6f9805e1b44fa71deccbe5ac9a6a0333/index.cds) file that [we created in part 2](/blog/posts/2026/01/07/modules-modularity-and-reuse-in-cds-models-part-2-creating-a-simple-reuse-package/#creating-the-index-entry-point), nice!

We haven't made use of the `qmacro.common.T` type yet, but the compiler still loads the reuse package contents (whatever `index.cds` contains and / or refers to).

But the important thing to observe with this "passive" reuse package is that _it's only once we explicitly refer to it in our model definitions that anything happens_.

To complete the test of this simple reuse package, we can of course add a further element to the `Books` entity definition like this, defined with this imported type:

```cds
using qmacro from '@qmacro/common';

namespace my.bookshop;

entity Books {
  key ID    : Integer;
      title : String;
      stock : Integer;
      newel : qmacro.common.T; // <--
}
```

but this has no further effect on how the package is used or behaves.

So far, so good! Let's now compare that with a first look at using `@capire/common`.

## Creating a second host project

To keep things clean and separate, let's now create a second host project just like [the first](#creating-a-simple-host-project), this time called `part4b`, and start up the CAP server straight after:

```bash
cds init \
  --add tiny-sample \
  part4b \
  && cd $_ \
  && npm install \
  && cds watch
```

> If you're playing along at home, make sure you create this parallel to `part4a`, not _within it_, of course.

From the `cds watch` output, we see the same output as previously, at the same stage, with `part4a`, most notably that the CDS model is composed of 3 files:

```log
[cds] - loaded model from 3 file(s):

  srv/cat-service.cds
  node_modules/@sap/cds/srv/outbox.cds
  db/schema.cds
```

## @capire/common

In the same way as with `@qmacro/common`, let's this time add `@capire/common` to the project.

### Associating the scope with the registry

Just like how we associated `@qmacro` with the GitHub Packages NPM registry [in the previous part](/blog/posts/2026/01/14/modules-modularity-and-reuse-in-cds-models-part-3-publishing-the-simple-reuse-package/#associating-the-scope-with-the-registry), we'll need to do the same for `@capire`, by adding another line to our `~/.npmrc` file[<sup>4</sup>](#footnotes):

```ini
@capire:registry=https://npm.pkg.github.com
```

### Adding @capire/common

Now we can add it:

```bash
npm add @capire/common
```

We get similar output to this as before, but significantly, when the CAP server restarts, we see this:

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

Waitwhat?

### Active vs passive

What's going on? Where did they come from? Why are they appearing, even when we haven't imported anything into the `part4b` model yet?

This is our first glimpse of a side effect coming from the fact that -- unlike `@qmacro/common`, which is _passive_ -- `@capire/common` is _active_[<sup>5</sup>](#footnotes). In other words, the reuse package will do things, explicitly and sometimes immediately, as soon as we've added it.

How does that work? We'll find out in the next part!

## Footnotes

1. While things would be fine without an `npm install` at this setup stage (using the globally installed `@sap/cds` package rather than a project-local one), we'll use `npm install` here mostly for cosmetics - references in the log output will be to project-local resources rather than global ones which have far longer paths; also, we'll be running a package install shortly anyway, so the main part of the install work might as well be done now.
1. Remember that you'll have to have the appropriate settings in an [npmrc](https://docs.npmjs.com/cli/v11/configuring-npm/npmrc) file; see the [Preparing to publish the package](/blog/posts/2026/01/14/modules-modularity-and-reuse-in-cds-models-part-3-publishing-the-simple-reuse-package/#preparing-to-publish-the-package) section of the previous part for a reminder about this. Basically, you'll need something like this, say, in `~/.npmrc`:

    ```ini
    @qmacro:registry=https://npm.pkg.github.com
    //npm.pkg.github.com/:_authToken=A-CLASSIC-TOKEN-WITH-AT-LEAST-READ-PACKAGES-SCOPE
    ```

1. The use of the top level name only (i.e. just `qmacro`) in the `using` directive is deliberate here, just to show a different way of referencing the scope and subsequent use in definition positions. See the [Namespaces](https://cap.cloud.sap/docs/cds/cdl#namespaces) section of Capire's CDL topic for further details.
1. There's an entire blog post on [Using @capire modules from GitHub Packages](blog/posts/2025/10/12/using-capire-modules-from-github-packages/), in case you're interested.
1. The terms "active" and "passive" aren't official CAP terms, they're just what I have come up wih to distinguish reuse package types.
