---
title: Using @capire modules from GitHub Packages
date: 2025-10-12
tags:
  - github
  - npm
  - cap
  - cds
  - packages
  - modules
description: Here's how to access and use the @capire namespaced modules that reside in the NPM registry which is part of GitHub Packages.
---
## Background

[Recently](https://cap.cloud.sap/docs/releases/aug25) the home for Capire documentation and sample repositories moved into the [capire](https://github.com/capire) organisation on GitHub. This content includes classic modules such as [bookshop](https://github.com/capire/bookshop) which are now maintained as individual repositories, are subject to release schedules and deployments, and are made available as [packages](https://github.com/orgs/capire/packages) in the NPM registry which is part of [GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages).

Retrieving (e.g. via `npm install` or `npm add`) a package such as `@sap/cds-dk` is straightforward as such packages [are available](https://www.npmjs.com/package/@sap/cds-dk) in the default NPM registry at <https://registry.npmjs.org> (with a human centric UI at <https://npmjs.com>).

## Namespace registry mapping required

Retrieving packages from any other registry (such as package `@capire/bookshop` in the NPM registry that is part of GitHub Packages) requires a mapping, typically by package namespace.

This is done by configuration in an `.npmrc` file in your home directory. The mapping here (for the `@capire` namespaced packages) needs to look like this in that file:

```text
@capire:registry=https://npm.pkg.github.com`
```

Without this mapping, here's what happens:

```log
; npm add @capire/bookshop@2.0.4
npm error code E404
npm error 404 Not Found - GET https://registry.npmjs.org/@capire%2fbookshop - Not found
npm error 404
npm error 404  '@capire/bookshop@2.0.4' is not in this registry.
npm error 404
npm error 404 Note that you can also install from a
npm error 404 tarball, folder, http url, or git url.
```

With the mapping above in the `.npmrc` file, here's what happens:

```log
; npm add @capire/bookshop@2.0.4
npm error code E401
npm error 401 Unauthorized
  - GET https://npm.pkg.github.com/@capire%2fbookshop
  - authentication token not provided
```

## Authentication information required

In order to [work with GitHub Packages' NPM registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) ...

> "... you need an access token to publish, install, and delete private, internal, and public packages."

Yes, even for read operations such as `install` and `add`.

The [Authenticating with a personal access token](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token) describes the procedure, which basically has two steps.

### Generate a token

In the [Tokens (classic) section of your GitHub developer settings](https://github.com/settings/tokens), generate a new "Personal Access Token (classic)" like this, selecting the `read:packages` scope:

![generating a personal access token (classic) with read:packages scope](/images/2025/10/personal-access-token-classic-read-packages.png)

### Associate the token with the registry

This token now needs to be associated with the registry, by adding another line to the `.npmrc` file that looks like this:

```text
//npm.pkg.github.com/:_authToken=THE-TOKEN-JUST-GENERATED
```

## Installing a package

Once this is done, `npm install` or `npm add` will complete successfully:

```shell
; npm add @capire/bookshop@2.0.4

added 115 packages, and audited 116 packages in 6s

23 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

The package appears in the appropriate dependencies section of `package.json` as usual:

```json
{
  "name": "test",
  "dependencies": {
    "@capire/bookshop": "^2.0.4",
    "@sap/cds": "^9",
    "express": "^4"
  },
  "devDependencies": {
    "@cap-js/sqlite": "^2"
  },
  "scripts": {
    "start": "cds-serve"
  }
}
```

Success!
