---
title: The MCP adapter for CAP services
draft: true
date: 2026-10-31
tags:
  - mcp
  - cap
  - dyk
description: A blog post version of the script I wrote for the 2026 "Did You Know?" item on the MCP adapter.
---

There's an MCP adapter plugin for CAP services, and after adding it to
your project, you can conjure up MCP servers for the services in your
CDS model. Let me show you how, using a classic Northwind style
project called Northbreeze, with food products and categories.

## Setting up

Before we start, I'll ask for extra output for MCP operations:

```shell
export DEBUG=mcp
```

Now I'll start up the CAP server as normal:

```shell
cds watch
```

Everything completely as we'd expect here, with our `Main` service
defined like this:

```cds
using northbreeze from '../db/schema';

@rest
service Main {

  entity Products   as projection on northbreeze.Products;
  entity Suppliers  as projection on northbreeze.Suppliers;
  entity Categories as projection on northbreeze.Categories;

}
```

It's served via the `@rest` HTTP protocol:

```log
[cds] - serving Main {
  at: [ '/rest/main' ],
  decl: 'srv/main.cds:4'
```

I'll add the MCP adapter plugin to the project:

```shell
npm install @cap-js/mcp
```

Now I have the `@mcp` annotation at my disposal. It acts as "just
another protocol" declaration ... so I'll add it to the service
definition:

```cds
using northbreeze from '../db/schema';

@mcp
@rest
service Main {

  ...

}
```

The CAP server restarts, and the log output shows us that we now also
have an MCP server endpoint for the Northbreeze service:

```log
[cds] - serving Main {
  at: [ '/rest/main', '/mcp/main' ],
  decl: 'srv/main.cds:5'
}
[mcp] - registering MCP services: [ 'Main' ]
```

## Using it

Let's use Joule Work Desktop, where I have configured this MCP server
as a connector:

![Joule Work Desktop connector
detail](/images/2026/10/jwd-connector.png)

Note that there are two tools available for this simple service -
`describe` and `query`.

Let's try it out, by asking "What dairy products are there?". In
the resulting log output:

```log
[mcp] - describe { service: 'Main', entities: [
  'Products', 'Categories'
] }
[mcp] - query {
  service: 'Main',
  cql: "SELECT from Products {
    ProductID, ProductName, QuantityPerUnit,
    UnitPrice, UnitsInStock, Discontinued
  } WHERE Category.CategoryName = 'Dairy Products'"
}
```

we can see that:

- the `describe` tool has been used first to understand what the
  service offers - the data model and entity details, for example
- then the `query` tool was used to send some CQL to handle the
  question

The result is as we'd want - taken from the MCP server, and presented
to us:

![the dairy products
detail](/images/2026/10/jwd-dairy-products-detail.png)

Nice! [More cheese,
Gromit?](https://www.youtube.com/shorts/2oucItDIY3w)
