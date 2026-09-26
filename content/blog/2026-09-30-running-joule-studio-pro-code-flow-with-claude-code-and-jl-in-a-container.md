---
title: Running Joule Studio pro-code flow in a container, using an LLM proxy running on the host OS
draft: true
date: 2026-09-30
description: A note-to-self on setting up Claude Code and the Joule Studio CLI in a container, connecting and authenticating them, and configuring & using an LLM proxy which is at the host OS level.
---

## Assumptions

- Container manager is Docker
- Container is Linux (Debian) based with appropriate tools
- A [LiteLLM AI Gateway](https://docs.litellm.ai/docs/simple_proxy) style LLM proxy
- Access to an SAP-managed Joule Studio service e.g. at `https://021....eu12.sapdas.cloud.sap/`
- Ability to ssh to the host OS level (macOS) (turn on in Settings > General > Sharing > Remote Login)

The LLM proxy in this case, for me, is SAP's [Hyperspace LLM
Proxy](https://ai-docs.portal.hyperspace.tools.sap/llm-proxy/) which I have
installed at the host OS level and so its CLI tool (`hai`) is runnable there.

See the [Joule Studio CLI
reference](https://help.sap.com/docs/joule-studio/joule-studio/cli-reference?locale=en-US)
for more information on what the `jl` CLI tool does and how it fits into this flow.

> Some links in this document are to protected resources, but the general idea
> and flow here remains valid regardless.

## Claude Code setup with the proxy

This section describes how to set up Claude Code and use the LLM proxy with it
and is based on [Recipe: Claude Code
CLI](https://ai-docs.portal.hyperspace.tools.sap/llm-proxy/recipes/claude/).

### Install Claude Code

> In the container

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

> At the host OS level

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

Next steps:
 - 1. Start the HAI proxy: hai proxy start
 - 2. Test Claude Code CLI: claude chat 'Hello, Claude!'
 - 3. Or use Claude Code in your IDE with the configured settings

⚠️  IMPORTANT: Do not login with any account. Do not create an account.
Claude Code CLI should use the proxy authentication configured in settings.json.

If Claude Code CLI prompts you to login or create an account:
 - Exit the CLI
 - Verify that ~/.claude.json exists and contains "hasCompletedOnboarding": true
 - Restart the CLI - it should now use the proxy without requiring any account
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

> At the host OS level

The `.claude*` configuration files just created in the previous step at the
host OS level need to be available in the container where I'll be running
Claude Code.

```shell
cd ~/ \
  && tar --disable-copyfile --no-xattr -czf claude.tgz .claude* \
  && docker cp claude.tgz pde:/tmp/ \
  && rm claude.tgz
```

The options used with `tar` are to prevent the usual macOS filesystem nonsense
getting picked up in the tarball.

### Unpack the configuration in the container

> In the container

```shell
cd ~/ \
  && tar xzf /tmp/claude.tgz \
  && rm /tmp/claude.tgz
```

This will create or overwrite these two files in the user's home directory
`.claude.json` and `.claude/settings.json`.

### Allow access to the proxy from the container

> In the container

In the `~/.claude/settings.json` file there's this configuration:

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
there, then `localhost` would make sense. But `localhost` as a hostname is
inaccessible from within a container.

The Docker context equivalent is `host.docker.internal`, i.e. "the Docker host".

So make the substitution:

```shell
sed -i 's/localhost/host.docker.internal/' .claude/settings.json
```

### Test the setup

> In the container

Start Claude Code and try out a request, e.g. "What is 2+2?" and check that log
output appears in the LLM proxy.

### Checkpoint

At this point, Claude Code in the container is using LLM resources
successfully via the LLM proxy running on the host OS.

## Install the Joule Studio CLI

This section describes how to install the Joule Studio CLI `jl`, and use it
with Claude Code. The setup approach is based on [Joule Studio Dev Tools -
Pro-Code
Flow](https://pages.github.tools.sap/btp-ai/ibd/getting-started/pro-code).

### Install the CLI package

> In the container

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

> In the container

The CLI now needs to be connected to and authenticated with the Joule Studio services.
This is initiated with a `jl login <url>`, which kicks off an OAuth 2.0 PKCE login flow.

Get the `<url>` from the Joule Studio "Develop > Authorizations" settings:

![The Develop > Authorization settings in Joule
Studio](/images/2026/09/joule-studio-develop-authorizations.png)

What's going to happen in this OAuth 2.0 PKCE login flow is that the command will emit
a temporary URL for the flow, which we need to visit. The URL includes a `redirect_uri`
parameter which indicates the URL the user should be redirected to once authentication
has happened.

The issue here is that this is in this form:

```url
http://localhost:<randomport>/callback
```

plus the special characters are also URL encoded, so the `redirect_uri` parameter looks
something more like this:

```url
redirect_uri=http%3A%2F%2F127.0.0.1%3A45861%2Fcallback
```

We can see that the `<randomport>` value in this example is thus `45861`.

The idea is that the `jl login` process causes a temporary HTTP server to
be created and start listening on that specific socket (`localhost` plus random
port, `45861` in this example), which would then receive and handle the browser
redirect ... which also includes authentication information that is thus received
and can then be stored.

But the temporary HTTP server is running only in the container (where
`jl login` was called), and the random port is not published to the Docker host.

And the browser operation is in the context of the host OS (macOS), meaning the
redirection will fail.

So we need to create a temporary tunnel from the host OS into the container, and
can use SSH's remote port forwarding. The port we need to specify on setting up
the tunnel is the random port that was assigned in the creation of the temporary
HTTP server (`45861` in this example).

But that's quite hard to make out from that long URL.

So add some magic on to the end of the `jl login <url>` command - this will use
`tee` to capture the output to a file, but then use [process
substitution](https://www.gnu.org/software/bash/manual/bashref.html#Process-Substitution)
to process what contents would normally be written to that file, using more
shell commands, like this:

```shell
jl login <url> \
  | tee >(grep -Po '(?<=%3A)\d{5}')
```

The `grep` command option `-P` specifies we want to use Perl Compatible Regular
Expressions (PCRE) and `-o` says that we just want the match, nothing else. The
`(?<=...)` construct is a lookbehind assertion, the `\d` is a "digits"
character class, and the `{5}` is a specific count of how many of that class
we're trying to match.

In other words, "look for a string of 5 digits that are immediately preceded by
`%3A` (the URL encoded version of the colon (`:`)) and emit just those 5 digits".

For example:

```shell
jl login "https://api.eu12.studio.joule.cloud.sap/cli/v1?appTid=..." \
  | tee >(grep -Po '(?<=%3A)\d{5}')
```

emits not only the regular output, like this (long URL has been split
over multiple lines for readability):

```log
Opening browser to log in to https://agyx....accounts400.ondemand.com ...
If the browser does not open, copy the URL below and open it manually.

  https://agyx....accounts400.ondemand.com/oauth2/authorize
  ?response_type=code
  &client_id=...
  &redirect_uri=http%3A%2F%2F127.0.0.1%3A45861%2Fcallback
  &code_challenge=...
  &code_challenge_method=S256
  &state=...
  &scope=openid+offline_access
  &app_tid=...
```

but also, thanks to the `| tee >( ... )`, also emits this:

```text
45861
```

At this point, open up a new shell session in the container (e.g. a new pane in `tmux`) and run:

```shell
ssh -R 45861:localhost:45861 <username>@host.docker.internal
```

where `<username>` is your host OS (macOS) user.

Once you've successfully SSH'd to the host OS, and have the host OS prompt, you can
then click the URL and the authentication flow will work correctly, with the redirect
working via the tunnel back to the `jl login` initiated temporary HTTP server, and
the authentication information will be stored:

```log
✓ Logged in to https://api.eu12.studio.joule.cloud.sap/cli/v1. (session expires 9/17/2026, 1:18:14 AM)
```

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
