---
title: Modules, modularity & reuse in CDS models - part 3 - publishing the simple reuse package
date: 2026-01-14
tags:
  - cds
  - cap
  - npm
  - reuse
  - gh
  - modularityandreuse-series
description: Taking the simple passive reuse package created in part 2, I now publish it to the NPM registry which is part of GitHub Packages.
---
(Get to all the parts in this series via the [series
post](/blog/posts/2026/01/01/modules-modularity-and-reuse-in-cds-models/).)

What we have from [part
2](/blog/posts/2026/01/07/modules-modularity-and-reuse-in-cds-models-part-2-creating-a-simple-reuse-package/)
is a simple project `myproj/` which relies upon a simple reuse package
`@qmacro/common`. That reuse package currently exists only within a workspace
within the `myproj/` project. In order to be able to use it elsewhere and share
the reuse package with others, we need to publish it to a public NPM registry.

One possibility would be the standard NPM registry at <https://www.npmjs.org>.
Another is the NPM registry which is part of [GitHub
Packages](https://docs.github.com/en/packages)[<sup>1</sup>](#footnotes).
That's what I'll use here. It makes sense also to share the source too, which I
can do in parallel via a public repo in my [user
space](https://github.com/qmacro/) on GitHub, and I'll link the NPM package to
that repo as well.

What we want to end up with is a setup that follows the
[capire/common](https://github.com/capire/common) repo and package:

![The capire/common repo](/images/2026/01/capire-common.png)

## Sharing the reuse package source

First, let's share the source of `@qmacro/common`. Clearly the content is not
earth-shattering, but serves to illustrate the pattern as a
passive[<sup>2</sup>](#footnotes) reuse package.

As a reminder, here's what the entire project and workspace-enclosed reuse
package looks like (minus the `node_modules/` directory, to keep things brief):

```log
.
├── package-lock.json
├── package.json
├── packages
│   └── @qmacro
│       └── common
│           ├── index.cds
│           └── package.json
└── services.cds
```

It's the content of `packages/@qmacro/common/` that we want to share, and we
can do that in the normal way, by introducing git-based source code control,
then creating a repo on GitHub based on that git-controlled source.

While we can also add the main `myproj/` project source to git-based source
code control, we won't do that now. Whenever we do it, we also want to remember
to exclude the content in `packages/` as we want to share and manage the
packages source lifecycle separately.

### Moving to the appropriate place

So first of all, starting from within the main project's root, i.e. `myproj/`,
let's move into the reuse package's directory:

```bash
cd packages/@qmacro/common/
```

### Adding a README

Every public repo on GitHub should have a README, even one as simple as this.
Let's just add one now:

```bash
cat <<EOF >README.md
# @qmacro/common

See the series post
[Modules, modularity & reuse in CDS models](https://qmacro.org/blog/posts/2026/01/01/modules-modularity-and-reuse-in-cds-models/)
for the background to this simple passive CDS model reuse package example.
EOF
```

### Setting up the repo

Now, within `packages/@qmacro/common/`, let's set up the git-based source code
control:

```bash
git init \
  && git add . \
  && git commit -m 'initial commit'
```

This emits:

```log
Initialized empty Git repository in myproj/packages/@qmacro/common/.git/
[main (root-commit) 37f0091] initial commit
 3 files changed, 21 insertions(+)
 create mode 100644 README.md
 create mode 100644 index.cds
 create mode 100644 package.json
```

### Pushing the repo to GitHub

Now let's share this with others by pushing it to GitHub, specifically as [a
new repo in my user space](https://github.com/qmacro?tab=repositories). I'm a
[happy user](/tags/gh/) of the excellent GitHub CLI
[gh](https://cli.github.com/), so let's use that
here[<sup>3</sup>](#footnotes):

```bash
gh repo create common \
  --description "Simple passive CDS model reuse package example" \
  --source . \
  --public \
  --push
```

This emits:

```log
✓ Created repository qmacro/common on GitHub
✓ Added remote https://github.com/qmacro/common.git
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (4/4), done.
Writing objects: 100% (5/5), 686 bytes | 686.00 KiB/s, done.
Total 5 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/qmacro/common.git
 * [new branch]      HEAD -> main
branch 'main' set up to track 'origin/main'.
✓ Pushed commits to https://github.com/qmacro/common.git
```

Et voila, the repo on GitHub is there.

![the qmacro/common repo on
GitHub](/images/2026/01/qmacro-common-no-package.png)

But there's no package ... yet.

## Preparing to publish the package

Let's do that now. First, there's some setup required for working with the NPM
registry in GitHub Packages.

### Generating a token for authentication

As the GitHub documentation article [Working with the npm
registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
states:

> "You need an access token to publish, install, and delete private, internal,
> and public packages."

Heading over to the [Tokens (classic)](https://github.com/settings/tokens) area
of the GitHub Developer Settings, we should create a new classic token with the
following scopes:

![token scopes](/images/2026/01/token-scopes.png)

and will end up with something like this:

![classic token](/images/2026/01/classic-token-full-registry-access.png)

### Associating the token with the registry

The value of the token can now be associated, in the
[npmrc](https://docs.npmjs.com/cli/v11/configuring-npm/npmrc)-based
configuration, with the NPM registry in GitHub Packages, which has the address
`npm.pkg.github.com`.

In an existing or new `.npmrc` file in your home directory, we need to add
this:

```ini
//npm.pkg.github.com/:_authToken=THE-TOKEN-JUST-GENERATED
```

> For more on this, see the [Associate the token with the
> registry](blog/posts/2025/10/12/using-capire-modules-from-github-packages/#associate-the-token-with-the-registry)
> section of the blog post [Using @capire modules from GitHub
> Packages](/blog/posts/2025/10/12/using-capire-modules-from-github-packages/).

### Associating the scope with the registry

Additionally we'll need to tell the `npm` command line tool about how it should
use the GitHub Packages NPM registry, rather than the (default) NPM registry at
<https://www.npmjs.com>, for `@qmacro`-scoped packages.

Details about this are also covered in the aforementioned blog post in the
section [Namespace registry mapping
required](/blog/posts/2025/10/12/using-capire-modules-from-github-packages/#namespace-registry-mapping-required).

In that same `~/.npmrc` file, we need to add this too:

```ini
@qmacro:registry=https://npm.pkg.github.com
```

## Associate the repo with the package

While one can register packages in the NPM registry on GitHub Packages that are
independent of any source repo on GitHub, it makes a lot of sense to have both
and have them linked. That way, one can go from the repo source to the package,
and from the package back to the repo source.

All that's needed to make this association is a `repository` property in the
`package.json` file. So let's add that, and commit & push the change to GitHub.
Here's the entire contents of the `package.json` file with that new
`repository` property[<sup>4</sup>](#footnotes) added:

```json
{
  "name": "@qmacro/common",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/qmacro/common.git"
  },
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

After committing this change and pushing it to the remote on GitHub:

```bash
git add package.json \
  && git commit -m 'add repository property' \
  && git push
```

we're ready to actually publish the package!

## Publishing the package

After all that preparation, our `~/.npmrc` contents in place:

```ini
@qmacro:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_...
```

we're all set, and the process is simple:

```bash
npm publish
```

This emits output similar to the following:

```log
npm notice
npm notice 📦  @qmacro/common@1.0.0
npm notice Tarball Contents
npm notice 243B README.md
npm notice 44B index.cds
npm notice 349B package.json
npm notice Tarball Details
npm notice name: @qmacro/common
npm notice version: 1.0.0
npm notice filename: qmacro-common-1.0.0.tgz
npm notice package size: 528 B
npm notice unpacked size: 636 B
npm notice shasum: d6b369d2e3db3878df8f9d9745b393f68a18b18b
npm notice integrity: sha512-Anr74Mjy9kRvb[...]RkUg3wgpto8UA==
npm notice total files: 3
npm notice
npm notice Publishing to https://npm.pkg.github.com with tag latest and default access
+ @qmacro/common@1.0.0
```

which denotes success.

## Examining the results

Indeed, we can now see a package associated with the `qmacro/common` repo:

![qmacro/common package
associated](/images/2026/01/qmacro-common-package-associated.png)

and following that package link to the [package
page](https://github.com/qmacro/common/pkgs/npm/common), we see:

![qmacro/common package info](/images/2026/01/qmacro-common-package-info.png)

which indeed also has a link (via the README) back to the
[repo](https://github.com/qmacro/common).

## Making the package public

As described in the [Publishing a
package](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#publishing-a-package)
section of [Working with the npm
registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry):

> "When you first publish a package, the default visibility is private."

So in order for you to try this out, let's take one final step in this post,
and change the visibility to public.

This is also simple and can be done via the package settings:

![changing package visibility to
public](/images/2026/01/changing-package-visibility-to-public.png)

And that's it!

## Wrapping up

All that's left for this post is for you to try the package out, by `npm
add`ing it to a CAP Node.js project. Let me know in the comments if it works
for you.

Now that we understand the basics of a CDS model reuse package, in the next
post we'll start to take a closer look at
[capire/common](https://github.com/capire/common).

## Footnotes

1. There are multiple registries in GitHub Packages - for Docker, Apache Maven,
   RubyGems and more, as well as for Node.js packages.
1. There's that
   [passive](/blog/posts/2026/01/01/modules-modularity-and-reuse-in-cds-models-part-1-an-introduction/#active-vs-passive)
   word again. I'll get to explaining what I mean by it at some point in this
   series, honest!
1. If you're not yet familiar with the command line tool options, you can
   invoke just `gh repo create` and follow the interactive prompts instead,
   which start like this:

    ```log
    ? What would you like to do?  [Use arrows to move, type to filter]
    > Create a new repository on GitHub from scratch
      Push an existing local repository to GitHub
    ```

1. While a simpler string value like this:

    ```json
    { "repository": "https://github.com/qmacro/common" }
    ```

   will work (similar to [how it's defined for
   capire/common](https://github.com/capire/common/blob/6fe89fb51a6b06cf65d18f6d66ef880545a9054f/package.json#L4)),
   `npm publish` will emit a warning like this:

    ```log
    npm warn publish npm auto-corrected some errors in your package.json when publishing.  Please run "npm pkg fix" to address these errors.
    npm warn publish errors corrected:
    npm warn publish "repository" was changed from a string to an object
    npm warn publish "repository.url" was normalized to "git+https://github.com/qmacro/common.git"
   ```
