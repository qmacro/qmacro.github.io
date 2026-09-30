---
title: Running Joule Studio pro-code flow in a container, using an LLM proxy running on the host OS
draft: true
date: 2026-09-30
description: A note-to-self on setting up Claude Code and the Joule Studio CLI in a container, connecting and authenticating them, and configuring & using an LLM proxy which is at the host OS level.
---

## Assumptions

- Container manager is Docker
- Container is Linux (Debian) based with appropriate tools
- A [LiteLLM AI Gateway](https://docs.litellm.ai/docs/simple_proxy) style LLM
  proxy
- Access to an SAP-managed Joule Studio service e.g. at
  `https://021....eu12.sapdas.cloud.sap/`
- Ability to ssh to the host OS level (macOS) (turn on in Settings > General >
  Sharing > Remote Login)

The LLM proxy in this case, for me, is SAP's Hyperspace LLM Proxy which I have
installed at the host OS level am running it (via the proxy's CLI tool `hai`)
there.

<!-- Hyperspace LLM Proxy is at
https://ai-docs.portal.hyperspace.tools.sap/llm-proxy/ -->

See the [Joule Studio CLI
reference](https://help.sap.com/docs/joule-studio/joule-studio/cli-reference?locale=en-US)
for more information on what the `jl` CLI tool does and how it fits into this
flow.

## Claude Code setup with the proxy

This section describes how to set up Claude Code and use the LLM proxy with it.

<!-- Based on the "Claude Code CLI" recipe at
https://ai-docs.portal.hyperspace.tools.sap/llm-proxy/recipes/claude/ -->

### Install Claude Code

📍 In the container

```shell
curl -fsSL https://claude.ai/install.sh | bash
```

Output looks something like this:

```log
Setting up Claude Code...
✔ Claude Code successfully installed!
  Version: 2.1.273
  Location: ~/.local/bin/claude
  Next: Run claude --help to get started
✅ Installation complete!
```

### Configure Claude Code to use the proxy

📍 At the host OS level

Note that I happen to have Claude Code installed at the host OS level too, but
in theory this is not required for this step; all the following command is
doing is creating a couple of files. This command is run at the host OS level as
it's the only place that the LLM proxy is installed.

```shell
hai configure claude-code
```

Output looks something like this:

```log
✅ Successfully configured Claude Code CLI for HAI proxy

Configuration summary:
 - Settings file:    /Users/I347491/.claude/settings.json
 - Onboarding file:  /Users/I347491/.claude.json
 - Proxy URL:        http://localhost:6655/anthropic/
 - API Key:          ...

...
```

There are no further files created, beyond the settings and onboarding files
mentioned above, as we can see:

```shell
ls -l .claude*
-rw-r--r--@ 1 I347491  staff  36 16 Sep 12:12 .claude.json

.claude:
total 8
-rw-r--r--@ 1 I347491  staff  762 16 Sep 12:12 settings.json
```

### Transfer configuration to the container

📍 At the host OS level

The `.claude*` configuration files just created in the previous step at the
host OS level need to be available in the container where I'll actually be
using Claude Code.

```shell
cd ~/ \
  && tar --disable-copyfile --no-xattr -czf claude.tgz .claude* \
  && docker cp claude.tgz pde:/tmp/ \
  && rm claude.tgz
```

The options used with `tar` are to prevent the usual macOS filesystem cruft
getting picked up in the tarball.

### Unpack the configuration in the container

📍 In the container

```shell
cd ~/ \
  && tar xzf /tmp/claude.tgz \
  && rm /tmp/claude.tgz
```

This will create or overwrite these two files in the user's home directory
`.claude.json` and `.claude/settings.json`.

### Allow access to the proxy from the container

📍 In the container

In the `~/.claude/settings.json` file there's this configuration, with values
injected from the proxy initiated setup:

```json
{
  "alwaysThinkingEnabled": false,
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "...",
    "ANTHROPIC_BASE_URL": "http://localhost:6655/anthropic/",
    "...": "...",
    "ENABLE_TOOL_SEARCH": "auto"
  },
  "gitAttribution": false,
  "includeCoAuthoredBy": false
}
```

This makes sense at the host OS level, in that if I was running Claude Code
there, then `localhost` would point to the right place. But `localhost` as a
hostname here is the container, not the host OS. So accessing the host OS
from within a container via `localhost` is not going to work.

What we need is the Docker context equivalent, which is `host.docker.internal`,
i.e. "the Docker host".

So make the substitution:

```shell
sed -i 's/localhost/host.docker.internal/' .claude/settings.json
```

### Test the setup

📍 In the container

Start Claude Code and try out a request, e.g. "What is 2+2?" and check that log
output appears in the LLM proxy.

### Checkpoint

At this point, Claude Code in the container is using LLM resources
successfully via the LLM proxy running on the host OS.

## Install the Joule Studio CLI

This section describes how to install the Joule Studio CLI `jl`, and use it
with Claude Code.

<!-- The setup approach is based on "Joule Studio Dev Tools - Pro-Code Flow" at
https://pages.github.tools.sap/btp-ai/ibd/getting-started/pro-code -->

### Install the CLI package

📍 In the container

The "Pro-Code Flow" guide recommends the installation of the pre-release
version of the package. A connection to the corporate VPN is required for this
step, as the registry from which the pre-release version is retrieved is only
available internally (remember to stop any other VPNs at this point).

```shell
npm install -g \
  @sap/joule-work-dev-cli-early-adopters@prerelease \
  --registry https://int.repositories.cloud.sap/artifactory/api/npm/build-milestones-npm/
```

At the time of writing, the `@prerelease` version initially resolved to
`0.1.20-2609-patch1`, but then after a re-install, the version went to
`0.1.20-alpha.25`.

The VPN can now be terminated at this point if required.

### Authenticate the CLI with Joule Studio

📍 In the container

The CLI now needs to be connected to and authenticated with the Joule Studio services.
This is initiated with a `jl login <url>`, which kicks off an OAuth 2.0 PKCE login flow.

> This flow, which happens between the container and the host OS, needs a bit of
> nurturing, and it's all explained in detail in the blog post [Making OAuth 2.0
> auth code flows work between containers and their host
> OS](/blog/posts/2026/09/22/making-oauth-2-0-auth-code-flows-work-between-containers-and-their-host-os/).
> Check that out, and then return here to continue.

## Initialise a new project

At this point you're all set to start a new Joule Studio project using the pro-code flow, initiating a
new project directory with `jl init claude`, which will show something like this:

```log
Fetching system skills...
  ✓ agent (+33 resources)
  ✓ cap-app (+11 resources)
  ✓ deploy-solution
  ✓ domain-model-extension (+4 resources)
  ✓ intent-analysis
  ✓ joule-studio-cli
  ✓ mcp-mock-config (+4 resources)
  ✓ mcp-translation-file
  ✓ n8n-workflow (+12 resources)
  ✓ product-requirements-document (+2 resources)
  ✓ setup-solution (+2 resources)
  ✓ specification (+1 resource)
✓ 12 skills initialized in .claude/skills.

Creating configuration files:
  ✓ .mcp.json — created
  ✓ .claude/settings.local.json — created

Claude Code MCP config initialized: /tmp/testproj
```
