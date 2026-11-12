---
title: GraphQL and Conway's Law
date: 2026-11-12
tags:
  - graphql
  - conways-law
  - architecture
description: GraphQL as a technical solution to an organisational problem, and protocol adoption friction.
---

I came across [this Bluesky
post](https://bsky.app/profile/janl.bsky.narrativ.es/post/3mzvp6xck6k2q) from
Jan Lehnardt:

> Fun fact, I once sat down with the inventor of GraphQL and after 30 minutes
> of him trying to explain the technical merits he finally came out with it:
> “GraphQL exists so Facebook frontend devs don’t have to talk to Facebook
> backend devs”.

I've written about GraphQL before, such as in my [Monday morning
thoughts](/tags/monday-morning-thoughts/) post [Considering
GraphQL](/blog/posts/2018/09/03/monday-morning-thoughts-considering-graphql/),
and my general dislike of it is not a secret (I noticed [this ascerbic
remark](/blog/posts/2021/04/28/unpacking-bash-shell-tips-from-a-github-actions-workflow/#:~:text=partly%20because%20it%27s%20a%20GraphQL%20call%20and%20extremely%20ugly)
just now while looking for what I've written in the past).

So it was with some enjoyment that I read Jan's post and the comments. It's not
the first time that some technical solution has come about to address a
non-technical challenge. There is of course [Conway's
Law](https://en.wikipedia.org/wiki/Conway%27s_law) that almost legitimises the
approach. But not quite. For me, the double-punch of complexity (of the query
language) and the protocol abuse (of HTTP) is equally matched by the friction
it creates for humans in hand-crafted exploration and adoption.

One example from today of this latter issue is the Model Context Protocol,
which, while generally straightforward, also has its own modicum of friction in
that [JSON-RPC for message
encoding](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports),
via POST in HTTP. I am approaching this as someone from the older generation of
technicians who used to TELNET to ports on servers to speak protocols directly
(such as HTTP, XMPP[<sup>1</sup>](#footnotes), even SMTP) by hand. Sending a
GET request to an MCP server HTTP endpoint and [getting an
error](https://developers.sap.com/tutorials/cap-add-mcp-capabilities#step-4) is
somewhat disappointing.

Anyway, I digress. I'm not a fan of GraphQL from a design or protocol
perspective, and its friction for humans doesn't ameliorate that one bit. I'm
sort of relieved to learn that an organisational problem was likely the real
driver for its genesis.

## Footnotes

1. Yes, XMPP carries a long-lived XML document over the connection, I know.
