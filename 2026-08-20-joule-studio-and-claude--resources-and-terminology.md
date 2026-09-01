---
title: 'Joule Studio and Claude - resources and terminology'
date: 2026-08-20
tags:
  - joule
  - claude
description: Mostly a note-to-self on what is created when one initialises a new agentic-first project using the Joule Studio CLI with Claude Code.
---

> This is an "open draft", a work in progress.

This assumes that Claude Code is installed, along with the Joule Studio CLI,
also known as `jl`. It also assumes the creation of a new (as yet completely
empty) project directory called `proj/`, and that we're in that directory.

## Project initialisation

The first thing to do is to use `jl init` to initialise the directory with
Joule Studio resources, specifying an agent. The help text for this command
looks like this:

```text
Usage: jl init [options] [agent] [path]

Initialise a directory for an AI coding agent

Arguments:
  agent        agent to initialise (choices: "claude", "opencode")
  path         target directory (defaults to current directory)

Options:
  -f, --force  overwrite existing config values and skills
  -h, --help   display help for command
```

Running `jl init claude` produces this output:

```log
Fetching system skills...
  ✓ cap-development (+5 resources)
  ✓ create-agent-extension (+2 resources)
  ✓ create-domain-model-extension
  ✓ deploy-solution
  ✓ intent-analysis
  ✓ joule-studio-cli
  ✓ mcp-mock-config (+4 resources)
  ✓ mcp-translation-file
  ✓ n8n-sap-agent
  ✓ n8n-sap-ai-core
  ✓ n8n-sap-mcp-client
  ✓ n8n-sap-task-center
  ✓ n8n-workflow (+2 resources)
  ✓ product-requirements-document (+2 resources)
  ✓ sap-aeval-framework (+3 resources)
  ✓ sap-agent-bootstrap (+20 resources)
  ✓ sap-agent-instrumentation (+1 resource)
  ✓ setup-solution (+10 resources)
  ✓ specification (+7 resources)
✓ 19 skills initialized in .claude/skills.

Creating configuration files:
  ✓ .mcp.json — created
  ✓ .claude/settings.local.json — created

Claude Code MCP config initialized: /home/user/work/proj/
```

## MCP connectivity

The project local `.mcp.json` file contains:

```json
{
  "mcpServers": {
    "joule-studio": {
      "type": "stdio",
      "command": "jl",
      "args": [
        "mcp",
        "start"
      ]
    }
  }
}
```

This defines a "Project"-scoped MCP server (i.e. one that is only for the
context of this project, i.e. when in this `proj/` directory). The MCP server
itself is a STDIO affair (rather than HTTP-based) and is actually part of `jl`,
as it's invoked with `jl mcp start`.

There's a corresponding configuration file `.claude/settings.local.json` which
enable this MCP server, and allows all tools that are offered by it:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "mcp__joule-studio__*"
    ]
  },
  "enabledMcpjsonServers": [
    "joule-studio"
  ],
  "enableAllProjectMcpServers": true
}
```

Note the use of the double underscore `__` to join the three parts of the names in the
`allow` list together:

- `mcp` - an MCP server
- `joule-studio` - the Joule Studio MCP server specifically
- `*` - all of the tools that the Joule Studio MCP server offers

What MCP server facilities does `jl` offer? We can check with `jl mcp list`, which
shows:

```log
n8n-mcp — /mcp-proxy/n8n-mcp
ibd-mcp-server — /mcp-proxy/ibd-mcp-server
cap-mcp — MCP for CAP projects
ui5-wcr — MCP for UI5 Web Components projects
```

So the MCP server that is to be started with `jl mcp start` is actually a proxy for multiple MCP servers, listed here. The MCP inspector shows that when sent the `tools/list` request, the MCP server return


