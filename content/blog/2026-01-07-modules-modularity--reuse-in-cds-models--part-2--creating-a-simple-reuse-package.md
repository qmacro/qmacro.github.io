---
title: Modules, modularity & reuse in CDS models - part 2 - creating a simple reuse package
date: 2026-01-07
tags:
  - cds
  - cap
  - npm
  - reuse
  - modularity
description: Following on from part 1 in this series, I take a step back and look at the fundamentals of creating and working with a module, locally in this part, using the NPM workspace concept.
---
In [wrapping up the end of part
1](/blog/posts/2026/01/01/modules-modularity-and-reuse-in-cds-models-part-1-an-introduction/#wrapping-up)
we looked forward to creating the simplest kind of reuse module, not only as an
important fundamental building block but as a base for further understanding
and exploration (especially when we start looking closer at
[capire/common](https://github.com/capire/common)).

What we'll do in this post is:

- create a simple CAP Node.js project with a basic CDS model
- extend it by defining a custom type in a separate file, and using that type
- make that custom type definition reusable by creating an NPM package and putting it there instead

Following best practice [BES002 Think
local-first](https://github.com/qmacro/capref/blob/main/bestpractices/BES002.md)
we'll create and build out that NPM package locally, for the ultimate in
development iteration and [fast inner
loops](https://cap.cloud.sap/docs/about/#fast-inner-loops).

## Creating a simple CAP Node.js project

For simplicity's sake, and to highlight the even more basic alternative
approach (to using `cds init`) to create a new CAP Node.js project, we'll use
the NPM command line tool `npm` as demonstrated by Daniel Schlachter in our [Expert
Session: Getting started with CAP Node.js - 2025/2026
edition!](https://youtu.be/fUYNjuQbLzQ?si=7GyAUdnrAsUaTmlF&t=354). After all,
this post is ultimately all about Node.js packages.

[![Daniel uses npm init -y to start a new CAP Node.js project from
scratch](/images/2026/01/daniel-schlachter-from-scratch.png)](https://youtu.be/fUYNjuQbLzQ?si=7GyAUdnrAsUaTmlF&t=354)

Here goes:

```bash
mkdir myproj \
  && cd $_ \
  && npm init -y \
  && npm add @sap/cds express \
  && npm add --save-dev @cap-js/sqlite
```

This creates everything we need for starting to develop a CAP Node.js project.
Firing things up with `cds watch` gives us:

```log
cds serve all --with-mocks --in-memory?
( live reload enabled for browsers )
        ___________________________

    No models found in db/,srv/,app/,app/*,schema,services.
    Waiting for some to arrive...

```

> All subsequent command line invocations in this post are from the same
> location as this, i.e. at the project root, in `myproj/`.

## Adding a simple CDS model

To keep things as simple as possible and not distract us from the goal, let's
define the CDS model in `services.cds` as something minimal:

```cds
context schema {
  entity E {
    key ID : Integer;
        e  : String;
  }
}

service S {
  entity E as projection on schema.E;
}
```

For those wondering about the starkness, here are a few notes:

- In minimal scenarios like this, I like to have everything in one file, and my
  choice of `services.cds` is explained in [Why I use services.cds in simple
  CDS model
  examples](/blog/posts/2026/01/02/why-i-use-services-cds-in-simple-cds-model-examples/)
- Because everything is in one file, I can either define an entity directly
  within a service, "in-flight" as it were, like this:

    ```cds
    service Bookshop {
      entity Books {
        key ID    : Integer;
            title : String;
            stock : Integer;
      }
    }
    ```

  (this is from my `cdsnano`
  [template](https://github.com/qmacro/dotfiles/blob/main/scripts/cdsnano-template/services.cds))

  but I have come to
  [prefer](https://github.com/qmacro/dotfiles/blob/main/scripts/cdspico) using
  the [context](https://cap.cloud.sap/docs/cds/cdl#context) directive; that
  way, I can make use of
  [projections](https://cap.cloud.sap/docs/cds/cdl#views-projections) as the
  projection target is in a separate namespace (scope).
- Even simpler than the Bookshop or Northwind theme, I am using single letters,
  while still following the [naming convention
  rules](https://cap.cloud.sap/docs/guides/domain-modeling#naming-conventions)
  on capitalisation:
  - entity `E`
  - element `e`
  - service `S`

  I chose `schema` as the namespace, mostly because it reminds me of the name
  of the first file I usually create in a `db/` directory when modelling:
  `schema.cds`[<sup>1</sup>](#footnotes)

With the definitions in `services.cds`, we're up and running with a full
service (some log lines omitted for brevity):

```log
[cds] - loaded model from 2 file(s):

  services.cds
  node_modules/@sap/cds/srv/outbox.cds

[cds] - serving S {
  at: [ '/odata/v4/s' ],
  decl: 'services.cds:8',
  impl: 'node_modules/@sap/cds/srv/app-service.js'
}
[cds] - server listening on { url: 'http://localhost:4004' }
```

Now let's start to extend that model a little.

## Extending with a separate file in the project

For the sake of illustration, let's say we have a custom type that we want to
use in this model. We can take the smallest first step in the direction of a
couple of best practices:

- [BES005 Factor out separate
concerns](https://github.com/qmacro/capref/blob/main/bestpractices/BES005.md)
- [BES006 Compose with reuse in
mind](https://github.com/qmacro/capref/blob/main/bestpractices/BES006.md)

by factoring that type out into a separate file, and then importing it into our
main model file `services.cds` with the `using` directive.

### A simple type T

In a new file `base.cds`, also at the project root alongside `services.cds`,
let's define the type:

```cds
type T : Boolean;
```

And in `services.cds` let's use that to redefine the element `e`:

```cds
using T from './base';

context schema {
  entity E {
    key ID : Integer;
        e  : T;
  }
}

service S {
  entity E as projection on schema.E;
}
```

So far so good.

### Namespaces are a good idea

But that simple name `T` makes me a little nervous in that it's unscoped, i.e.
at the equivalent of the global level, and this sort of practice is asking for
trouble down the line with name clashes. So let's put this definition for `T`
into a scope with the `namespace` directive; that way, we can more readily
reuse and share it.

In `base.cds`:

```cds
namespace qmacro.common;

type T : Boolean;
```

In `services.cds`:

```cds
using qmacro.common.T from './base';

context schema {
  entity E {
    key ID : Integer;
        e  : T;
  }
}

service S {
  entity E as projection on schema.E;
}
```

That's better!

Everything works well, and I can add to the `base.cds` file and use the
definitions therein as I build out the rest of the CDS model for the current
project.

But one thing I cannot do is easily reuse those definitions in other projects.

## Extending via an NPM package

To remedy this, I can transfer what I have in `base.cds` to a new NPM package,
and use that. That way, I not only get to reuse the definitions in the current
project but I can also:

- maintain it independently, in its own lifecycle
- use it in other projects I'm working on
- make it available for others to use in their projects

Just like [capire/common](https://github.com/capire/common), in fact! But much,
much simpler[<sup>2</sup>](#footnotes).

### Creating the package locally

Best practice [BES002 Think
local-first](https://github.com/qmacro/capref/blob/main/bestpractices/BES002.md)
exhorts us to take a local-first approach to development. That goes not only
for CAP components, but in general. And with NPM's
[workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces) concept, we
can follow this best practice in building out our reuse package too.

> See the [Local development, submodules and
> workspaces](https://qmacro.org/blog/posts/2025/02/14/tasc-notes-part-8/#local-development-submodules-and-workspaces)
> section of the notes accompanying part 8 of [The Art and Science of
> CAP](https://qmacro.org/blog/posts/2024/12/06/the-art-and-science-of-cap/)
> for more on this.

#### Deciding on a scope and a name

Like the namespace we added to the definition in `base.cds`
[earlier](#namespaces-are-a-good-idea), it's also a good idea to think about a
scope for the package (in the same way that
[@sap](https://www.npmjs.com/search?q=%40sap),
[@cap-js](https://www.npmjs.com/search?q=%40cap-js) and
[@capire](https://github.com/orgs/capire/packages) exist). It would make sense
to eventually publish it, and GitHub Packages' NPM registry seems a good
bet.

So let's go for `qmacro` as the scope, and `common` as the package name[<sup>3</sup>](#footnotes).

#### Setting up and examining the workspace constructs

Previously, in the [CAP Node.js
Plugins](https://qmacro.org/blog/posts/2024/12/30/cap-node-js-plugins/) mini
series, we set up a workspace in the [Creating our own plugin
package](https://qmacro.org/blog/posts/2024/10/05/cap-node-js-plugins-part-1-how-things-work/#creating-our-own-plugin-package)
section of part 1. We'll take a similar approach now, taking care to specify
our chosen scope this time:

```bash
npm init \
  --yes \
  --workspace packages/@qmacro/common \
  --scope @qmacro
```

Running this command does quite a few things. Let's look at (a cut down version
of) the project's structure as a result of this:

```log
./
├── node_modules/
│   ├── @cap-js/
│   │   └── ...
│   ├── @qmacro/
│   │   └── common -> ../../packages/@qmacro/common/ --+
│   ├── @sap/                                          |
│   │       └── ...                                    |
├── package-lock.json                                  |
├── package.json                                       |
├── packages/      <-----------------------------------+
│   └── @qmacro/
│       └── common/
│           └── package.json
├── base.cds
└── services.cds
```

What can we see? Well:

- There's a new `packages/` directory in the project root; the name that we
  chose (via the value for the `--workspace` option) makes sense, given it's a
  container for the NPM package we're going to create
- That NPM package is represented locally within this new `packages/`
  directory, and currently contains just a simple `package.json` file with
  defaults (as we used `--yes` to skip the package initialisation
  questionnaire):

    ```json
    {
      "name": "@qmacro/common",
      "version": "1.0.0",
      "main": "index.js",
      "devDependencies": {},
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "description": ""
    }
    ```

- Because of the `--scoped @qmacro` option, this is a scoped package

Additionally:

- Within the standard NPM package location for the project, i.e. the
  `node_modules/` directory, there's a new path `@qmacro/common` that has been
  created as a symbolic link to the NPM package within `packages/`, as
  illustrated by the arrow; this means that we can work on developing the
  package locally within `packages/@qmacro/common/` and use it immediately in
  the context of our project.

And if we look inside the project's `package.json` file, we'll see:

- there's a new top level `workspaces` property which has a reference to this
  local NPM package directory:

    ```json
    {
      "name": "myproj",
      "...": "...",
      "workspaces": [
        "packages/@qmacro/common"
      ]
    }
    ```

    This is a key component in the mechanism that allows a simplified use of
    locally existing NPM packages within a project, [without all that tedious
    mucking about
    with](https://www.clivebanks.co.uk/THHGTTG/THHGTTGradio2.htm#:~:text=The%20Infinite%20Improbability%20Drive%20is%20a%20wonderful%20new%20method%20of%20crossing%20interstellar%20distances%20in%20a%20few%20seconds%2C%20without%20all%20that%20tedious%20mucking%20about%20in%20hyperspace)
    `npm link`.

#### Adding the package as a project dependency

There's one more thing we should do now, but let's [defer it to the end of
this post](#adding-the-package-as-a-dependency), which will allow me to
illustrate some local behaviours.

### Transferring the type definition

Now that we have the NPM package, let's move the contents of `base.cds` to it,
and also make a corresponding modification to the reference to it.

#### Moving the definition

The simplest first step is to move `base.cds` from where it is in the project
root to the root of the `@qmacro/common` package, i.e. to
`packages/@qmacro/common/`:

```bash
mv base.cds packages/@qmacro/common/
```

At this point, the structure for our project and our new local package looks
like this (the `node_modules/` directory content has been omitted here for
brevity):

```log
./
├── package-lock.json
├── package.json
├── packages/
│   └── @qmacro/
│       └── common/
│           ├── base.cds
│           └── package.json
└── services.cds
```

#### Changing the using directive

Next up we should modify the reference in `services.cds`. Instead of loading
`qmacro.common.T` from `./base`, i.e. the `base.cds` file that was in the
project root, we'll want to load it from the `@qmacro/common` package. This is
what we need to change `services.cds` to (just the `using` line has changed
here):

```cds
using qmacro.common.T from '@qmacro/common';

context schema {
  entity E {
    key ID : Integer;
        e  : T;
  }
}

service S {
  entity E as projection on schema.E;
}
```

#### Understanding model resolution

At this point, if you're using a decent editor with LSP support connected to an
instance of the CDS language server[<sup>4</sup>](#footnotes), you'll likely
see a diagnostics error:

```log
Can't find package module '@qmacro/common' [file-unknown-package]
```

You can also elicit this error report by simply attempting to compile the
contents of `services.cds` to CSN, like this, for example:

```bash
cds compile services.cds
```

This error occurs _not_ because the local setup of the NPM package is somehow
not right. It's because of the way [model
resolution](https://cap.cloud.sap/docs/cds/cdl#model-resolution) works:

> _Resolving module references: Names starting with neither `.` nor `/` such as
> `@sap/cds/common` are fetched for in `node_modules` folders:_
>
> - _Files having `.cds`, `.csn`, or `.json` as suffixes, appended in order_
> - _Folders, from either the file set in `cds.main` in the folder's
>   `package.json` or `index.<cds|csn|json>` file._

In other words, we either need to use an "index" file, or add configuration to
the NPM package's `package.json` file to point to the actual file in there,
i.e. `base.cds`; that `cds.main` configuration in `package.json` would look
like this:

```json
{
  "name": "@qmacro/common",
  "version": "1.0.0",
  "main": "index.js",
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "cds": {
    "main": "base"
  }
}
```

With this in place, the reference in

```cds
using qmacro.common.T from '@qmacro/common';
```

works fine and the error goes away.

However, while it works, adding explicit configuration like this goes against
axiom [AX003 Convention over
configuration](https://github.com/qmacro/capref/blob/main/axioms/AXI003.md). So
let's not do that.

Moreover, it's actually good practice to use an "index" file (in the form of
`index.cds`) as the entry point for reuse packages such as this one that we're
creating - see [BES007 Provide public entry points to reuse
packages](https://github.com/qmacro/capref/blob/main/bestpractices/BES007.md).

#### Creating the index entry point

So let's avoid any explicit `cds.main` configuration, and create an `index.cds`
file in the package root. The simplest thing would be to rename `base.cds`, so
that's what we'll do:

```bash
mv packages/@qmacro/common/base.cds packages/@qmacro/common/index.cds
```

Nice!

### Adding the package as a dependency

There's one more thing we need to do, [something which we deliberately deferred
until now](#adding-the-package-as-a-project-dependency), which is to add the
`@qmacro/common` reuse package as a project dependency.

Yes, everything works as we expect right now, but that's down to the NPM
workspace concept. We have our project, and the workspace-hosted reuse package,
which is accessible from the project. But what happens when we deploy that
project elsewhere? The workspace-based development is just that - for
development. So we need to ensure that our reuse package is brought in when
setting up the project elsewhere.

Invoking:

```bash
npm add @qmacro/common
```

is all we need to do.

This adds a reference to the package in the project's `dependencies` property:

```json
{
  "name": "myproj",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@qmacro/common": "^1.0.0",
    "@sap/cds": "^9.6.1",
    "express": "^4.22.1"
  },
  "devDependencies": {
    "@cap-js/sqlite": "^2.1.2"
  },
  "workspaces": [
    "packages/@qmacro/common"
  ]
}
```

## Wrapping up

At this point, we're all set, and we can continue to build out our project, and our reuse package, locally.

In the next part we'll move beyond local development for the reuse package, and make it available publicly in the NPM registry within GitHub Packages.

Thanks for reading!

## Footnotes

1. `schema.cds` is also [one of the CDS roots](/blog/posts/2026/01/02/why-i-use-services-cds-in-simple-cds-model-examples/)

1. And [passive, rather than active](/blog/posts/2026/01/01/modules-modularity-and-reuse-in-cds-models-part-1-an-introduction/#active-vs-passive) - more on that another time.

1. In fact, for a package to be hosted in the NPM registry within GitHub Packages, the scope inevitably is required and comes from the corresponding user or org name on GitHub. My user name on GitHub is `qmacro`. See [Working with the npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) for more details on this relationship.

1. If you're using the SAP Business Application Studio, or VS Code with the [SAP CDS Language Support](https://marketplace.visualstudio.com/items?itemName=SAPSE.vscode-cds) extension, you'll have this already; if you want to set up Neovim to use the language server, see [A modern and clean Neovim setup for CAP Node.js - configuration and diagnostics](/blog/posts/2025/06/10/a-modern-and-clean-neovim-setup-for-cap-node-js-configuration-and-diagnostics/).
