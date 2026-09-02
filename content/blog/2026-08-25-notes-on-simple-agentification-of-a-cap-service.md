---
title: Notes on simple agentification of a CAP service
date: 2026-08-25
description: A short note-to-self on what I did when trying out the new agents plugin for CAP.
tags:
  - cap
  - ai
  - cds
  - javascript
  - a2a
  - agents
---

## Baseline

The [plugin for building agents based on the A2A
protocol](https://www.npmjs.com/package/@cap-js/agents) is here.

I start with the simple [bookshop](https://github.com/capire/bookshop) project
and add the plugin:

```shell
gh repo clone capire/bookshop \
  && cd bookshop \
  && npm add @cap-js/agents
```

## Agentification

I apply the `@agent` annotation to the `CatalogService` in `srv/cat-agent.cds`:

```cds
using { CatalogService } from './cat-service';

annotate CatalogService with @agent;
```

## Startup and development mode

I start up a CAP server and ask for debug level output for the agents component:

```shell
DEBUG=agents cds watch
```

and observe the log output:

```log
[agents] - Adapter initialized { service: 'CatalogService' }
[cds] - serving CatalogService {
  at: [ '/odata/v4/browse', '/rest/browse', '/hcql/browse', '/a2a/browse' ],
  decl: 'srv/cat-service.cds:3',
  impl: 'srv/cat-service.js'
}
```

- <http://localhost:4004/a2a/browse> is an A2A JSON-RPC endpoint that is
  expecting POST requests
- <http://localhost:4004/a2a/browse/.well-known/agent-card.json> is the [agent
  card](https://agent2agent.info/docs/concepts/agentcard/)
- <http://localhost:4004/a2a/browse/preview/> is a helper preview page that
  provides a chat UI

In this default (development) mode, the plugin will mock an LLM, sending a
response like this to a chat message:

> [Mock LLM] This is a mocked response from @cap-js/agents development mode. No real LLM was invoked.
>
> Tool result: count: 5
> data[3]{createdAt,modifiedAt,ID,author,title,genre,stock,price,currency}:
> "2026-08-25T12:44:18.880Z","2026-08-25T12:44:18.880Z",201,Emily Brontë,Wuthering Heights,Drama,12,"11.11",£
> "2026-08-25T12:44:18.880Z","2026-08-25T12:44:18.880Z",207,Charlotte Brontë,Jane Eyre,Drama,11,"12.34",£
> "2026-08-25T12:44:18.880Z","2026-08-25T12:44:18.880Z",251,Edgar Allan Poe,The Raven -- 11% discount!,Mystery,333,"13.13",$
>
## Connecting to a real LLM

Connecting to an actual LLM is described on the plugin's
[Connectivity](https://github.com/cap-js/agents/blob/HEAD/.docs/connectivity.md)
page.

I have access to an AI Core instance by means of a service key in a file
called `aicore.json` in the project's parent directory. I also know that the
orchestration facilities that are needed are not in the default resource group,
for that instance, but in a resource group called "codejam-genai".

### Set the AICORE_SERVICE_KEY env var

Assigning the service key JSON data to the environment variable
`AICORE_SERVICE_KEY` will allow the plugin to make the connection.

I use `jq`'s `--compact-output` (`-c`) to remove whitespace and have the entire
JSON value as one string:

```shell
export AICORE_SERVICE_KEY="$(jq -c . ../aicore.json)"
```

### Specify the LLM type and resource group

I need to specify the resource group "codejam-genai", and for that I can use
some plugin configuration, specifically `cds.requires.llm.resourceGroup`. As
I'm going to be specifying a child of the `llm` node here, I should be
sure to explicitly specify the value for the `kind` too (based on the way
configuration merging takes place). This makes sense anyway as resource groups
are somewhat AI Core specific.

There's already a `.cdsrc.yaml` file in the project with a `cds.requires.auth`
node, so I add the configuration to the end, so it looks like this:

```yaml
cds:
  requires:
    "[production]":
      auth: mocked # as a sample app run with mocked auth also in production
    llm:
      kind: 'aicore'
      resourceGroup: 'codejam-genai'
```

## Restart

After restarting the CAP server (the "watch" mode ignores YAML file changes right now)
the response to the chat message is from a real LLM, and looks like this:

> Hello! How can I help you today? I can assist you with browsing books,
> checking availability, or placing orders through the CatalogService. Feel
> free to ask anything! 😊

Here's what is emitted in the CAP server log, too:

```log
[agents] - request {
  conversation: '-',
  service: 'CatalogService',
  method: 'message/send',
  text: 'hi'
}
[agents] - Initializing LLM { model: 'anthropic--claude-4.6-sonnet', deepAgent: false }
[agents] - completed {
  conversation: '407e65ad',
  service: 'CatalogService',
  duration: '3.9s'
}
```

## Summary

This is just the basics, scratching the surface. The plugin also has support
for defining an agent's identity, behaviour and skills in Markdown, plus a
human-in-the-loop feature. There's plenty of more advanced facilities too.

But for now, so far so good!
