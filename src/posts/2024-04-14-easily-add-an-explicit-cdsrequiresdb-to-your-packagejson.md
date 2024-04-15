---
layout: post
title: Easily add an explicit cds.requires.db to your CAP project's package.json
date: 2024-04-14
tags:
  - cap
  - good-to-know
  - jq
---
In an experimental CAP project serving data in an in-memory SQLite persistence mechanism, seeded from CSV files (as per the classic starting point in CAP's [Grow As You Go](https://cap.cloud.sap/docs/get-started/grow-as-you-go) approach), I wanted to have the persistence layer requirements stated explicitly in the project's `package.json` file, rather than just be implicit.

Remember, a newly initialised CAP project's `package.json` file looks something like this:

```json
{
  "name": "proj",
  "version": "1.0.0",
  "description": "A simple CAP project.",
  "repository": "<Add your repository here>",
  "license": "UNLICENSED",
  "private": true,
  "dependencies": {
    "@sap/cds": "^7",
    "express": "^4"
  },
  "devDependencies": {
    "@cap-js/sqlite": "^1"
  },
  "scripts": {
    "start": "cds-serve"
  }
}
```

So to add the section explicitly, I'd normally have to remember the correct `cds.requires` JSON stanza structure and manually add it to the file, something like this:

```json
{
  "name": "proj",
  "version": "1.0.0",
  "description": "A simple CAP project.",
  "repository": "<Add your repository here>",
  "license": "UNLICENSED",
  "private": true,
  "dependencies": {
    "@sap/cds": "^7",
    "express": "^4"
  },
  "devDependencies": {
    "@cap-js/sqlite": "^1"
  },
  "scripts": {
    "start": "cds-serve"
  },
  "cds": {
    "requires": {
      "db": {
        "kind": "sqlite",
        "credentials": { "url": ":memory:" }
      }
    }
  }
}
```

## Finding out what the value should be

With `cds env` we can find out what this is already:

```shell
; cds env requires.db
{
  impl: '@cap-js/sqlite',
  credentials: { url: ':memory:' },
  kind: 'sqlite'
}
```

> The June 2023 release brought an [improved cds env](https://cap.cloud.sap/docs/releases/archive/2023/jun23#improved-cds-env) which is why I'm not using the `get` subcommand (i.e. `cds env get requires.db`) any more here.

## Adding it to package.json

And as the contents of `package.json` is just JSON, we have the power of [jq](https://jqlang.github.io/jq/) at our disposal, of course. We can process the file, and bring in the JSON value of `requires.db` above with jq's `--argjson` option.

Before we do that, however, we need to have that JSON value in a more compact format, not spanning multiple lines. And we can do that with the `--raw` option (short: `-r`) to `cds env` like this:

```shell
; cds env --raw requires.db
{"impl":"@cap-js/sqlite","credentials":{"url":":memory:"},"kind":"sqlite"}
```

Now all we need is something like this:

```shell
; jq \
    --argjson db $(cds env -r requires.db) \
    '. + {cds:{requires:{db:$db}}}' \
    package.json
```

which will produce what we want:

```json
{
  "name": "proj",
  "version": "1.0.0",
  "description": "A simple CAP project.",
  "repository": "<Add your repository here>",
  "license": "UNLICENSED",
  "private": true,
  "dependencies": {
    "@sap/cds": "^7",
    "express": "^4"
  },
  "devDependencies": {
    "@cap-js/sqlite": "^1"
  },
  "scripts": {
    "start": "cds-serve"
  },
  "cds": {
    "requires": {
      "db": {
        "impl": "@cap-js/sqlite",
        "credentials": {
          "url": ":memory:"
        },
        "kind": "sqlite"
      }
    }
  }
}
```

> We get the extra `"impl": "@cap-js/sqlite"` but that's fine!

In order to replace the contents of `package.json` in one go you'll need to do something like this:

```shell
; cat package.json \
  | jq \
    --argjson db $(cds env -r requires.db) \
    '. + {cds:{requires:{db:$db}}}' \
    > package.json
```

## Use with cds deploy

I may find myself using this approach more often, especially as the [`cds deploy --to sqlite` no longer modifies `package.json`](https://cap.cloud.sap/docs/releases/archive/2023/jun23#important-changes-3), which was also a change made in the same CAP release.

Good to know!

---

You may want to read [Using @cap-js/sqlite in CF for your CAP services](/blog/posts/2024/04/15/using-@cap-jssqlite-in-cf-for-your-cap-services/) which is closely related to this, too, as well as [Running non-production CAP services in CF](/blog/posts/2024/04/15/running-non-production-cap-services-in-cf/).
