---
layout: post
title: Avoid design time CAP server restarts when maintaining local data files
date: 2024-04-10
tags:
  - cap
  - node-watch
  - good-to-know
---
Starting the CAP server with `cds watch` is great for tight development loops at design time, especially with the built-in in-memory SQLite persistence layer, seeded by data in CSV files. When the server notices files have changed, it automatically restarts, which is great.

But sometimes you want to maintain files and _not_ have the server restart, perhaps because you have made modifications or additions to the data set that's being served, and don't want to lose that by such a restart.

Here's a quick hack to achieve that.

## Behind the scenes

If you set the [DEBUG environment variable](https://cap.cloud.sap/docs/node.js/cds-log#debug-env-variable) appropriately when running `cds watch`, like this:

```shell
DEBUG=cli cds watch
```

then you see a little bit more of what's going on behind the scenes:

```text
[cds] - @sap/cds 7.6.3 loaded: /usr/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds
[cds] - Command resolved: /usr/lib/node_modules/@sap/cds-dk/bin/watch.js
[cli] - live reload available at http://127.0.0.1:35729/livereload.js?snipver=1

cds serve all --with-mocks --in-memory?
9734 watching: cds,csn,csv,ts,mjs,cjs,js,json,properties,edmx,xml,env ...
ignoring: (node_modules|_out|@types|@cds-models)\/|app(\/.+)?\/((webapp|dist|target)\/|tsconfig\.json$|.*\.tsbuildinfo$)
live reload enabled for browsers
[cli] - livereload ignored: .vscode

...

[cds] - @sap/cds 7.6.3 loaded: /usr/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds
[cds] - Command resolved: /usr/lib/node_modules/@sap/cds-dk/bin/serve.js
[cds] - loaded model from 2 file(s):

  srv/cat-service.cds
  db/data-model.cds

[cds] - connect using bindings from: { registry: '~/.cds-services.json' }
[cds] - connect to db > sqlite { database: ':memory:' }
  > init from db/data/my.bookshop-Books.csv
/> successfully deployed to in-memory database.

[cds] - using auth strategy {
  kind: 'mocked',
  impl: '../../usr/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds/lib/auth/basic-auth'
}

[cds] - serving CatalogService { path: '/odata/v4/catalog' }

[cds] - server listening on { url: 'http://localhost:4004' }
[cds] - launched at 4/10/2024, 8:55:34 AM, version: 7.6.3, in: 736.516ms
[cds] - [ terminate with ^C ]

[cli] - live reload for . 0 ws clients
```

> It's the "ignored" lines that we're interested in, rather than any containing "livereload", which is related, but [separate](https://cap.cloud.sap/docs/releases/archive/2021/mar21#live-reload-with-cds-watch).

It's these two log lines that are interesting here:

```text
9734 watching: cds,csn,csv,ts,mjs,cjs,js,json,properties,edmx,xml,env ...
ignoring: (node_modules|_out|@types|@cds-models)\/|app(\/.+)?\/((webapp|dist|target)\/|tsconfig\.json$|.*\.tsbuildinfo$)
```

The CAP server uses [node-watch](https://github.com/yuanchuan/node-watch) behind the scenes providing the watch-and-restart mechanism. And it has a default regular expression, which we can see here, to describe file and directory name patterns that this mechanism should ignore.

## Normal behaviour

Sometimes when marshalling data for an OData CREATE operation, for example, I'll use a file to store the JSON payload for such an operation. If I were to create or maintain the contents of a file called `data.json` in the project root, for example, like this:

```shell
touch data.json
```

then the CAP server would be restarted:

```text
[cli] - Restart { events: [ { type: 'update', name: '/tmp/watchme/data.json' } ] }
[cli] - ⚡️ SIGTERM 15 received by cds serve
[cli] - ⚡️ cds serve - cds.shutdown
[cli] - ⚡️ cds serve - server.close(d)
[cli] - ⚡️ cds serve - process.beforeExit
[cli] - ⚡️ cds serve - process.exit
[cli] - ⚡️ cds watch - child exited 9745

        ___________________________

[cds] - @sap/cds 7.6.3 loaded: /usr/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds
[cds] - Command resolved: /usr/lib/node_modules/@sap/cds-dk/bin/serve.js

...

[cds] - serving CatalogService { path: '/odata/v4/catalog' }

[cds] - server listening on { url: 'http://localhost:4004' }
[cli] - live reload for /tmp/watchme/data.json. 0 ws clients
[cds] - launched at 4/10/2024, 8:58:31 AM, version: 7.6.3, in: 732.947ms
[cds] - [ terminate with ^C ]
```

This would mean that the state of the in-memory data set served by my services would be lost and reset to the original CSV data file based state through the normal restart process.

## Avoiding normal behaviour

If I wanted to avoid that happening, I could create a directory whose name was matched by the "ignore" regular expression. For example, If I could create a directory called `_out/` in the project root:

```shell
mkdir _out/
```

And then any creation or maintenance of files in that directory:

```shell
touch _out/data.json
```

would _not_ result in the server being restarted:

```text
[cli] - ignored: _out
[cli] - livereload ignored: _out
[cli] - ignored: _out
[cli] - ignored: _out/data.json
```

Good to know!
