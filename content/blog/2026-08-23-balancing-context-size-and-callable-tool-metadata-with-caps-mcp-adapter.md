---
title: Balancing context size and callable tool metadata with CAP's MCP adapter
date: 2026-08-23
tags:
  - cap
  - mcp
  - jq
  - inspector
  - bookshop
description: Some notes on both sides of the per_action_tool setting of CAP's MCP adapter plugin.
---

CAP [supports the Model Context
Protocol](https://cap.cloud.sap/docs/guides/protocols/mcp), and treats it
beautifully as "just another protocol". The support comes in the form of the
[@cap-js/mcp](https://github.com/cap-js/mcp) plugin, which has these [feature
flags](https://github.com/cap-js/mcp#feature-flags):

```json
{
  "cds": {
    "mcp": {
      "per_action_tool": false,
      "prefix": false,
      "format": "cql"
    }
  }
}
```

In this post I want to explore the `per_action_tool` setting.

## Sample service

To illustrate, let's use the classic
[capire/bookshop](https://github.com/capire/bookshop) sample project which,
amongst other resources, has a service defined in `srv/cat-service.cds` like
this:

```cds
using { sap.capire.bookshop as my } from '../db/schema';

service CatalogService @(path:'browse') {

  /** For displaying lists of Books */
  @readonly entity ListOfBooks as projection on Books {
    *, currency.symbol as currency,
  }
  excluding { descr };

  /** For display in details pages */
  @readonly entity Books as projection on my.Books {
    *, // all fields with the following denormalizations:
    author.name as author,
    genre.name as genre,
  } excluding { createdBy, modifiedBy };

  @requires: 'authenticated-user'
  action submitOrder ( book: Books:ID, quantity: Integer );
}

// Serve via OData, HCQL and REST
annotate CatalogService with @odata @hcql @rest;
```

The service has:

- entities `ListOfBooks` and `Books`
- an unbound action `submitOrder` (for which authentication is needed)

We'll begin by adding the MCP adapter plugin to the project like this:

```shell
npm add @cap-js/mcp
```

### Extending the service definition

Extending the definition slightly will help us dig in and understand the different
approaches that we can control with `per_action_tool`.

To keep things simple, let's just add content to the existing `srv/cat-service.cds`.

First, let's add a [doc
comment](https://cap.cloud.sap/docs/guides/protocols/mcp#adding-context-information)
to the `submitOrder` action, so it looks like this:

```cds
  @requires: 'authenticated-user'
  /** Place an order for a given book, specifying quantity required */
  action submitOrder ( book: Books:ID, quantity: Integer );
```

Now let's define another action in the service, by adding this at the end of
the file:

```cds
extend service CatalogService with {
  /** Return the total value of all stock */
  action stockValue ();
}
```

Finally, let's actually add the `@mcp` annotation, on a further line at the
end of the file:

```cds
annotate CatalogService with @mcp;
```

### A running CAP server

We'll be running a CAP server, started with `DEBUG=mcp cds watch`, throughout
the explorations here; the log output that we need to know about looks like
this:

```log
[mcp] - Adapter initialized { service: 'CatalogService' }
[cds] - serving CatalogService {
  at: [
    '/odata/v4/browse',
    '/rest/browse',
    '/hcql/browse',
    '/mcp/browse'
  ],
  decl: 'srv/cat-service.cds:3',
  impl: 'srv/cat-service.js'
}
[mcp] - registering MCP services: [ 'CatalogService' ]
[cds] - server listening on { url: 'http://localhost:4004' }
```

This tells us that the MCP adapter is accessible at `http://localhost:4004/mcp/browse`.

## Inspector

To assist exploration, let's use the [MCP
inspector](https://github.com/modelcontextprotocol/inspector) tool, which can
be operated in GUI, TUI or CLI mode. We'll use the CLI mode here to keep things
simple.

The basic inspector CLI call to connect to and interact with the MCP server provided
by the MCP adapter looks like this:

```shell
npx @modelcontextprotocol/inspector \
  --cli
  --header 'Authorization: Basic YWxpY2U6Cg==' \
  --transport http \
  --server-url http://localhost:4004/mcp/browse
```

plus some actual method, with the `--method` option.

> We're sending an auth header - the encoded value is `alice:` (there's no
password) as `alice` is one of the users available by default in the mocked
authentication strategy which is in effect by default when running in
development mode - see [Local-first dev with CAP Node.js - mocking
auth](/blog/posts/2026/05/12/local-first-dev-with-cap-node-js-mocking-auth/).
This is to address the `authenticated-user` pseudo-role requirement for the
`submitOrder` action later.

## Tools list

By default, the MCP adapter offers up to three tools per service annotated with
`@mcp`, in response to the
[tools/list](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#listing-tools)
request.

We can see this with the inspector, using the basic CLI call plus `--method tools/list`:

```shell
npx @modelcontextprotocol/inspector \
  --cli
  --header 'Authorization: Basic YWxpY2U6Cg==' \
  --transport http \
  --server-url http://localhost:4004/mcp/browse \
  --method tools/list \
  > tools.json
```

This returns quite a bit of output, in JSON, so we're redirecting that to a
`tools.json` file, where we can use `jq` to explore it separately.

Let's first reduce the JSON response to simply see what the tool names are and
how they're described:

```shell
jq '[.tools[]|{(.name):.description}]|add' tools.json
```

> Echoing Perl's [TMTOWTDI](https://en.wiktionary.org/wiki/TMTOWTDI) tradition,
one could also achieve the same result with the jq expression
`.tools|map({(.name):.description})|add`.

This produces:

```json
{
  "describe": "Describe the data model of CatalogService service. Returns an overview of all entities and actions with descriptions. Specify 'entity' to get element details, or 'action' to get parameter details.",
  "query": "Query any entity in CatalogService service.Ensure to first use the `describe` tool to discover an entity's available fields.",
  "call": "Call an unbound action or function in CatalogService service. Use describe to discover available actions and their parameters."
}
```

The `describe` and `query` tools are fairly standard and nearly always supplied
(except when the caller has no access). The `call` tool, returned when there
are actions or functions available, is the focus of this post and of the
`per_action_tool` setting.

## The generic call tool

Let's dig in to the details supplied with the `call` tool. With:

```shell
jq '.tools[]|select(.name=="call")' tools.json
```

we see this output:

```json
{
  "name": "call",
  "description": "Call an unbound action or function in CatalogService service. Use describe to discover available actions and their parameters.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "action": {
        "type": "string",
        "enum": [
          "submitOrder",
          "stockValue"
        ],
        "description": "The action or function to call"
      },
      "parameters": {
        "description": "Parameters for the action. Use describe to see available parameters.",
        "type": "object",
        "properties": {},
        "additionalProperties": {}
      }
    },
    "required": [
      "action"
    ],
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  },
  "annotations": {
    "readOnlyHint": false,
    "destructiveHint": true,
    "idempotentHint": false,
    "openWorldHint": false
  }
}
```

If we [stare
at](/blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/#initial-recognition)
this for a moment, we see that it's rather generic.

Moreover, the description includes instructions that require the use of the
`describe` tool first, before working out which (if any) call can be made. The
info we have in our doc comments ("Place an order for a given book,
specifying quantity required" and "Return the total value of all stock") aren't
even surfaced here.

All we have is a simple enumerated list of action names in `inputSchema.properties.enum`.

## Per-action tools

Let's now contrast that _"describe" + "query" + single "call" tool_ set, with what we get
if we set the MCP adapter plugin's `per_action_tool` feature flag to `true`. We can do
that in many ways; let's keep things simple and add a `mcp.per_action_tool` property
to the `.cdsrc.yaml` file that already exists in the project, like this:

```yaml
cds:
  mcp:
    per_action_tool: true
  requires:
    "[production]":
      auth: mocked # as a sample app run with mocked auth also in production
```

When we restart the CAP server, and make a `tools/list` request again,
we get the same response detail for the `describe` and `query`
tools, but the detail for the actions available looks completely different.

Let's examine the JSON output again. First, with
`.tools|map({(.name):.description})|add` we can see the tools and their
descriptions:

```json
{
  "describe": "Describe the data model of CatalogService service. Returns an overview of all entities and actions with descriptions. Specify 'entity' to get element details, or 'action' to get parameter details.",
  "query": "Query any entity in CatalogService service.Ensure to first use the `describe` tool to discover an entity's available fields.",
  "submitOrder": "Call action submitOrder in CatalogService",
  "stockValue": "Return the total value of all stock"
}
```

This time, instead of the generic `call` tool, we get individual tools,
complete with unique descriptions (from the doc comments).

Also, note that the simple `call` tool info earlier didn't have any parameter
detail for either of the actual actions; instead, there was an instruction to
"use describe to see available parameters".

But now, for each callable action, all the parameter details are available. Let's
look at the details for the `submitOrder` action, with `.tools[2]`:

```json
{
  "name": "submitOrder",
  "description": "Call action submitOrder in CatalogService",
  "inputSchema": {
    "type": "object",
    "properties": {
      "book": {
        "type": "integer",
        "minimum": -9007199254740991,
        "maximum": 9007199254740991
      },
      "quantity": {
        "type": "integer",
        "minimum": -9007199254740991,
        "maximum": 9007199254740991
      }
    },
    "$schema": "https://json-schema.org/draft/2020-12/schema"
  },
  "annotations": {
    "readOnlyHint": false,
    "destructiveHint": true,
    "idempotentHint": false,
    "openWorldHint": false
  }
}
```

The included `inputSchema` describes the two properties required (`book` and `quantity`).

So in this case, no pre-action-call discovery step is needed, no extra describe
step need be executed just to find out what these actions are, whether they
might be useful and how to call them.

## Comparing the options

Which option is better? `per_action_tool: true` or `per_action_tool: false`?
Well, that depends of course. There's a balance to be had.

Returning a single generic `call` tool, merely flagging that there's a facility
to make calls to specific actions and functions, with a simple list of them,
makes for quite a concise response. This in turn means that the size of the
context where this is stored remains relatively small. But the downside is that
there are going to be extra roundtrips required to accomplish anything
meaningful, as a `describe` call is necessary to find out more.

Describing separate `call`-type tools means that the context is potentially
going to get much larger, if there are many actions and functions available.
However the upside is that they're likely immediately comprehensible and
usable.

The MCP adapter plugin team has taken the decision to default to "safe" and
simple, to avoid exploding the context size unexpectedly, which makes sense. In
other words, the default is `per_action_tool: false`.

Only you can make the decision to change the value for that feature flag, based
on your service definitions, and other circumstances. Certainly if you only
have a small number of actions, then it's worth considering turning on the
`per_action_tool` flag. But if you have many, you may wish not to.

But now at least you know what the flag does, why, and how it affects things.

## Further info

This topic is also covered in [Part 3 of CAP in the age of
AI](https://www.youtube.com/watch?v=Nu_bEVFM7DM).
