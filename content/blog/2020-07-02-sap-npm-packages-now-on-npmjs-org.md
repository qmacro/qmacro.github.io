---
title: "SAP NPM packages now on npmjs.org"
date: 2020-07-02
tags:
  - sapcommunity
  - npm
---
*This post tells you what you need to know - and do - about the recent
migration of SAP Node.js packages to the default registry at
npmjs.org.*

🚨See the [Updates](#updates) section for an important announcement.

## TL;DR

Since 2017 SAP has made Node.js packages available at an SAP-specific
registry <https://npm.sap.com>. Over the past few weeks the team has
been busy migrating these packages to the default public registry
<https://npmjs.org>.

Moreover, updates to SAP packages will in future only be available from
the default public registry, and the SAP-specific registry will be
phased out.

So now is the time to remove any NPM configuration you may have set to
point to the SAP-specific registry for SAP packages.

Do it like this:

```shell
npm config delete @sap:registry
```


(If you're on Windows, you may need to put the `@sap:registry`
part in double quotes).

And you're done!

## Background

The default package manager for Node.js is the Node Package Manager
(NPM). Node.js packages (also referred to as NPM packages) can be made
available publicly in registries. The main, default registry is at
<https://npmjs.org>.

For organisational purposes, a package can belong to a
[scope](https://docs.npmjs.com/using-npm/scope.html) (think of it as
similar to a namespace). The scope starts with an @ sign and is joined
to the package name with a slash. For example, the package

```text
@sap/cds-dk
```

is in the `@sap` scope.

Combine this scope idea with the fact that there can be more than one
registry (that's why <https://npmjs.org> is called the "default"
registry) and it means that it's possible to, for example, have
packages belonging to a certain scope published to and available at a
different registry.

## The (now retired) SAP NPM registry

This is the basis of what SAP did three years ago with the launching of
the SAP NPM registry - see the
[post](https://blogs.sap.com/2017/05/16/sap-npm-registry-launched-making-the-lives-of-node.js-developers-easier/)
from Sven Kohlhaas back in 2017.

On your system, NPM will exist mainly as the command `npm`, and when you
ask it to install a package for you it will download the package from
the registry associated with the specified scope.

Here's an example (note that this is how it's worked up until now, for
illustration purposes):

```shell
npm install @sap/cds-dk
```

If there's no specific association between the `@sap`
scope and the SAP NPM registry where the package was available,
`npm` would assume and use the default registry at <https://npmjs.org>.

So we'd set configuration for `npm` to tell it to use a specific
registry for `@sap` scoped packages, like this:

```shell
npm config set @sap:registry=https://npm.sap.com
```

Now, with the recent migration of SAP packages to the main, default NPM
registry at <https://npmjs.org>, while the `@sap`
scoping of the packages remain, the configuration setting associating
the `@sap` scope to the SAP-specific registry (<https://npm.sap.com>) is no longer
required.

Not only that, but it's no longer recommended either, as updates to SAP
packages will only be made available on the default NPM registry and the
SAP-specific registry will eventually disappear (see the
[Updates](#updates) section).

## Understanding and making the change

You can examine your NPM configuration with `npm config`. Here's an
example from my machine right now:

```shell
▶ npm config list
; cli configs
metrics-registry = "https://registry.npmjs.org/"
scope = ""
user-agent = "npm/6.14.4 node/v12.18.0 darwin x64"

; userconfig /Users/i347491/.npmrc
@qmacro:registry = "https://npm.pkg.github.com"
@sap:registry = "https://npm.sap.com"
depth = 0

; node bin location = /Users/i347491/.nvm/versions/node/v12.18.0/bin/node
; cwd = /Users/i347491
; HOME = /Users/i347491
; "npm config ls -l" to show all defaults.
```

The semicolon prefixed lines are comments, and the chunk of
configuration in the middle is my user specific configuration (i.e.
settings that I have made) which have been stored in an `.npmrc` file in
my home directory.

You can see two scope/registry settings. The first one is for my own
`@qmacro`
scoped packages which are on GitHub (see the [GitHub packages
feature](https://github.com/features/packages) for more information on
this).

The second one is the current (and now unwanted) scope/registry
association for SAP packages, there as a result of me running the
`npm config set` command at some stage in the past. It's this
association that needs to be removed (so that `npm` will use the default
NPM registry for any `@sap` scoped packages).

So let's do this together now:

```shell
npm config delete @sap:registry
```

This will do exactly what we want, i.e. remove the configuration entry
associating the `@sap` scope with the old (retired) SAP-specific registry.

## Checking that the change took effect

Now, all `npm` operations referring to `@sap`
scoped packages will use the default <https://npmjs.org> registry.

How do you check this? Of course, you can first just re-run the
`npm config list` command and check that the `@sap:registry`
configuration line has gone.

You can also check this in a more interesting way by asking for
information on `@sap` scoped package, and checking that the information comes from the default
NPM registry implicitly.

Here's an example that you can try: `npm info @sap/cds-dk`

This is what the output looks like on my machine right now:

```shell
▶ npm info @sap/cds-dk

@sap/cds-dk@1.8.5 | See LICENSE file | deps: 10 | versions: 17
Command line client and development toolkit for the SAP Cloud Application Programming Model
https://cap.cloud.sap/

keywords: cap, cds, cli

bin: cds

dist
.tarball: https://registry.npmjs.org/@sap/cds-dk/-/cds-dk-1.8.5.tgz
.shasum: 37673e772df6670b4a021943ef904919385c1b76
.integrity: sha512-mqNy5hDg8M8YeFhF0gjfDVGxrUhrojcbRqUV6rWMocRm8ZKbifFBd6syG56R49NUaiei9lZfsdTX6acOP3DzNg==
.unpackedSize: 1.0 MB

dependencies:
@sap/cds-foss: ^1.2.0           @sap/edm-converters: ^1.0.30    nodemon: ^2.0.2                 xml-js: ^1.6.11
@sap/cds-sidecar-client: ^1.1.3 express: ^4.17.1                passport: ^0.4.1
@sap/cds: 3.34.x                mustache: ^4.0.1                sqlite3: 4.1.1

maintainers:
- sap_extncrepos <extncrepos@sap.com>
- sapnaas <Holger.Brox@sap.com>
- sapnaasuser <extncrepos@sap.com>

dist-tags:
latest: 1.8.5

published 2 weeks ago by sap_extncrepos <extncrepos@sap.com>
```

The details when you do this may look different as the versions,
maintainers and dependencies change over time, but what you want to look
for is the fully qualified domain name (FQDN) in the `tarball` URL:

```url
https://registry.npmjs.org/@sap/cds-dk/-/cds-dk-1.8.5.tgz
```

This confirms that it's the default registry that's in play here.

## For the curious

That's about it for this post, but here's a bit more information for
the curious.

In case you're wondering, the structure of the `npm` command set is
quite flexible, designed to fit how you think.

For example, with the `npm config set` command earlier, the config word
could have been omitted (i.e. `npm set` works too).

Some of you sharp-eyed readers will have noticed this comment in my
configuration output:

```text
; "npm config ls -l" to show all defaults.
```

In other words, instead of `npm config list` you can use
`npm config ls`. Likewise, I could have used `npm config rm` instead of
`npm config delete`.

And what about this configuration setting (which has nothing to do with
package scopes or registries)?

```text
depth = 0
```

It just tells `npm` that when it's showing me information on packages
and their dependencies, don't display any levels of package hierarchy
in the output, as I usually just want to see the top level package
information.

For example, I can easily see which packages I've installed globally,
like this:

```shell
▶ npm list --global
/Users/i347491/.nvm/versions/node/v12.18.0/lib
├── @sap/cds-dk@1.8.5
├── katacoda-cli@0.0.20
├── mbt@1.0.14
└── npm@6.14.4
```


Without this depth setting in my configuration, the output would be a
complex hierarchy that is detailed but not what I'm usually looking
for:

```shell
▶ npm list --global
/Users/i347491/.nvm/versions/node/v12.18.0/lib
├─┬ @sap/cds-dk@1.8.5
│ ├─┬ @sap/cds@3.34.2
│ │ ├─┬ @sap/cds-compiler@1.26.2
│ │ │ ├── antlr4@4.7.1
│ │ │ ├─┬ resolve@1.8.1
│ │ │ │ └── path-parse@1.0.6
│ │ │ └── sax@1.2.4 deduped
│ │ ├── @sap/cds-foss@1.2.0 deduped
│ │ ├── @sap/cds-reflect@2.11.0
│ │ └─┬ @sap/cds-runtime@1.2.2
│ │   ├─┬ @sap-cloud-sdk/core@1.18.1
│ │   │ ├─┬ @sap-cloud-sdk/analytics@1.19.0
│ │   │ │ ├── @sap-cloud-sdk/util@1.19.0 deduped
│ │   │ │ └── axios@0.19.2 deduped
│ │   │ ├─┬ @sap-cloud-sdk/util@1.19.0
│ │   │ │ ├── chalk@3.0.0 deduped
│ │   │ │ ├── rambda@5.1.1

[... and another 2600+ lines! ...]
```

(It's rather pleasing to notice the use of the
[Rambda](https://www.npmjs.com/package/rambda) package here in the SAP
Cloud SDK - but that's a story for another time :-))

[Share & enjoy!](https://hitchhikers.fandom.com/wiki/Share_and_Enjoy)

## Updates

21 Oct 2021 The official retirement date for `npm.sap.com` is 28 Feb 2022.
See [Note 3109201](https://launchpad.support.sap.com/#/notes/3109201)
for details.

---

[Originally published on SAP Community](https://community.sap.com/t5/application-development-blog-posts/sap-npm-packages-now-on-npmjs-org/ba-p/13463459)
