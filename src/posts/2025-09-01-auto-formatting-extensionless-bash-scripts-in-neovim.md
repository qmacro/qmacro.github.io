---
title: Auto formatting extensionless Bash scripts in Neovim
description: Here's what I did to make the combination of the Bash language server and shfmt work with Editorconfig settings for Bash script files that don't have extensions.
date: 2025-09-01
tags:
  - bash
  - editorconfig
  - neovim
  - lsp
  - shfmt
---
_Here's what I did to make the combination of the Bash language server and shfmt work with Editorconfig settings for Bash script files that don't have extensions._

## TL;DR

The Bash language server is easy to install and has support for `shfmt` which in turn has support for Editorconfig settings.

For shell scripts without extensions, Editorconfig is no good, except if you use `shfmt`'s special support in the form of `[[shell]]` or `[[bash]]` section globs.

But that's non-standard, and when invoked via the Bash language server, doesn't work. But you can get it to work by using a wrapper script that strips off options in the call to `shfmt` with the result that these special Editorconfig sections are recognised.

## Background

In my continuing quest to [build out a cleaner and leaner Neovim configuration](/blog/posts/2025/06/10/a-modern-and-clean-neovim-setup-for-cap-node.js-configuration-and-diagnostics/) I turned my attention recently to improving my Bash script editing experience. For Bash there are plenty of facilities that fit into my Personal Development Environment, including `shellcheck` and `shfmt`, both of which I have been using for quite a while (see [Improving my shell scripting](/blog/posts/2020/10/05/improving-my-shell-scripting/)).

I decided to give the [Bash language server](https://github.com/bash-lsp/bash-language-server) a try. It's a super easy setup [for Neovim 0.11+](https://github.com/bash-lsp/bash-language-server?tab=readme-ov-file#neovim) and the [integration with shfmt](https://github.com/bash-lsp/bash-language-server?tab=readme-ov-file#shfmt-integration) was a feature that caught my eye in particular. See [Appendix C](#appendix-c-neovim-lsp-configuration-for-the-bash-language-server) for the setup configuration details.

Add to this a desire to also more consciously embrace [Editorconfig](https://editorconfig.org/), especially given [shfmt's support for that](https://github.com/mvdan/sh/blob/master/cmd/shfmt/shfmt.1.scd#description), and I was set for a great experience.

## The perfect storm

I am of the opinion that the names of shell scripts that are written to be executed on the command line should not have extensions. This follows a [specific guideline](https://google.github.io/styleguide/shellguide.html#s2.1-file-extensions) in the [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html). Interpretation of shell script file\[type\]s is based on the [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)).

This approach, combined with the Bash language server, its support for `shfmt`, and a custom part of `shfmt`'s support for Editorconfig, turned out to be a small but perfect storm:

- Editorconfig's approach and configuration ([specification](https://spec.editorconfig.org/)) is based on file extensions only and there is no generic provision for specifying editor settings for files without extensions
- As the extensionless shell script is such a common phenomenon, support for Editorconfig within `shfmt` has been extended to allow for special [section names](https://spec.editorconfig.org/#glob-expressions) in Editorconfig configuration files so that such shell scripts can be matched more generically; this support is described in the [Examples](https://github.com/mvdan/sh/blob/master/cmd/shfmt/shfmt.1.scd#examples) section in `shfmt`'s documentation thus:
  > "EditorConfig sections may also use `[[shell]]` or `[[bash]]` to match any shell or bash scripts, which is particularly useful when scripts use a shebang but no extension. Note that this feature is outside of the EditorConfig spec and may be changed in the future."
- While it's great to have [support for shfmt](https://github.com/bash-lsp/bash-language-server?tab=readme-ov-file#shfmt-integration) in the Bash language server, this support does not include this non-standard (but insanely useful) `[[bash]]` style facility for Editorconfig configuration.

Consequently, when editing shell scripts with extensionless filenames using Neovim with the Bash language server configured and `shfmt` installed[<sup>1</sup>](#footnotes)
I got a very odd and confusing experience.

<a name="example-of-the-issue"></a>
## Example of the issue

Here's an example, based on three test files called `a`, `b` and `fixup`, and these (reduced) Editorconfig settings in my `.editorconfig` file:

```toml
root = true

[*]
indent_style = tab

[[bash]]
indent_size = 2
indent_style = space
switch_case_indent = true
binary_next_line = true
space_redirects = true
```

*On the command line*, running `shfmt`[<sup>2</sup>](#footnotes) on each of these three files produced the expected results, in that all were formatted according to the `shfmt`-specific settings in that `[[bash]]` section plus of course indented with 2 spaces.

*Within Neovim*, via the Bash language server[<sup>3</sup>](#footnotes), with shell script files `a` and `b` everything seemed to work fine and my Bash scripts were indented appropriately with 2 spaces. When I then started to work on real shell scripts such as the one called `fixup`, things didn't work the same, and the indentation was done with tabs, not spaces (the horror!).

Yes, you guessed it, this was because in standard Editorconfig procedure, the `[bash]` part of the `[[bash]]` section heading is considered a sequence of characters `b`, `a`, `s` and `h`, matching files of those single-character names; and as `fixup` was not matched with that sequence, that section (containing `indent_style = space`) didn't apply, and so `indent_style = tab` prevailed.

This is unfortunate, but is not really anyone's fault.

## Bash language server, shfmt and Editorconfig

I dug in to see what was happening in the Bash language server.

In preparing to call `shfmt`, properties appropriate for the file in question are determined from the Editorconfig configuration. The [editorconfig](https://www.npmjs.com/package/editorconfig) NPM package is used for this determination, and the custom `shfmt` extension to allow for `[[bash]]` and `[[shell]]` does not exist in that package.

There are generic configuration properties such as `indent_style`, and `shfmt`-specific ones such as `switch_case_indent`. If there are any `shfmt`-specific ones then the Editorconfig configuration is used. Otherwise, the language server configuration is used. This reflects the approach taken by `shfmt` itself in using either Editorconfig or its own command line flags, but not both (as we'll see in the next section).

The configuration is then turned into a series of explicit `shfmt` command line options, in particular (but not exclusively) from the [Printer flags](https://github.com/mvdan/sh/blob/master/cmd/shfmt/shfmt.1.scd#printer-flags) group. For example, on surfacing a `binary_next_line = true` setting in `.editorconfig` it will generate an equivalent `-bn` flag to pass in the call to `shfmt`.

Then the Bash language server invokes `shfmt` passing these generated options, plus the `--filename` option to specify the full pathname of the file being formatted.

### Example for script called 'fixup'

Here's an example of that for the script called `fixup` for which the `editorconfig` package does _not_ match the `[[bash]]` section. This is what's invoked:

```shell
shfmt --filename=/home/dj/test/fixup -i0 -ln=auto -
```

- the `-i0` comes from a default driven by the basic details sent in the request from Neovim's LSP client, which includes `insertSpaces = false`
- the `-ln=auto` comes from [a default in the Bash language server itself](https://github.com/bash-lsp/bash-language-server/blob/main/server/src/config.ts) for `languageDialect` (see also [Appendix A](#appendix-a-mason-info-for-the-bash-language-server))

### Example for script called 'a'

Here's another example of what the Bash language server ultimately invokes for the script called `a` which (by chance) _was_ matched by the `[[bash]]` section:

```shell
shfmt --filename=/home/dj/test/a -i=2 -bn -ci -sr
```

- these options come from the `indent_size`, `binary_next_line`, `switch_case_indent` and `space_redirects` Editorconfig properties in the `[[bash]]` section

## Between a rock and a hard place

As mentioned in the previous section, the Bash language server's approach takes its cue from the [equivalent approach](https://github.com/mvdan/sh/blob/master/cmd/shfmt/shfmt.1.scd#description) of `shfmt` itself:

> "If any EditorConfig files are found, they will be used to apply formatting options. If any parser or printer flags are given to the tool, no EditorConfig formatting options will be used. A default like -i=0 can be used for this purpose."

In other words, _either_ Editorconfig (only), or no Editorconfig.

But to effect this, Bash language server invokes `shfmt` with explicit options for _both_ cases (where there's a match, and where there isn't). This can be seen directly in the two example invocations above.

I want to manage my formatting in my `.editorconfig` file(s), but if I want the Editorconfig settings to be honoured when formatting my shell scripts, I need to give them names that I can match with the Editorconfig section name globs, for example by giving them extensions. I don't want to do that.

I want the Bash language server to invoke `shfmt` without any [parser](https://github.com/mvdan/sh/blob/master/cmd/shfmt/shfmt.1.scd#parser-flags) or [printer](https://github.com/mvdan/sh/blob/master/cmd/shfmt/shfmt.1.scd#printer-flags) options so that `shfmt` itself, with its special `[[bash]]` processing ability (rather than the Bash language server with the standard `editorconfig` package) parses the Editorconfig settings. This would effectively bypass any Bash language server logic for `shfmt` and just let `shfmt` do its thing, with (or without) an `.editorconfig` file present.

## Forcing the effect

To begin with, I debugged what was going on (see the [Useful debugging approaches](#useful-debugging-approaches) section) and found that the options for `shfmt` were being determined and marshalled in [server/src/shfmt/index.ts](https://github.com/bash-lsp/bash-language-server/blob/6e419dad6fb07bcf269101c8ffe0d47fd11b14db/server/src/shfmt/index.ts) (yay for open source!):

```typescript
private async runShfmt(
  document: TextDocument,
  formatOptions?: LSP.FormattingOptions | null,
  shfmtConfig?: Record<string, string | boolean> | null,
): Promise<string> {
  const args = await this.getShfmtArguments(document.uri, formatOptions, shfmtConfig)
  ...
  const proc = new Promise((resolve, reject) => {
    const proc = spawn(this.executablePath, [...args, '-'], { cwd: this.cwd })
    ...
```

Using brute force[<sup>4</sup>](#footnotes) I simply truncated `args` to `[]`, removing the call to `this.getShfmtArguments`, and everything worked as planned - `shfmt` was called without any options at all, with the result that `shfmt` did the right thing, finding and using the appropriate Editorconfig settings, for all Bash files.

I didn't want to have to make this modification each time I installed the Bash language server, nor do I think it appropriate to suggest as a modification upstream. So I decided to wrap the call to `shfmt`.

### Wrapping shfmt to strip off the options

The Bash language server [configuration](https://github.com/bash-lsp/bash-language-server/blob/main/server/src/config.ts) includes a section specifically for `shfmt` (see [Appendix B](#appendix-b-configuration-for-the-bash-language-server)). I can use the `shfmt.path` configuration option to specify an alternate path for the executable, pointing to a simple shell script that removes all the options passed, except for a couple of generic ones.

Here's the script, called `shfmt-wrapper`, placed in `~/.local/bin/` which is listed first in my `PATH` environment variable:

```bash
#!/usr/bin/env bash

declare -a shfmtargs
for i in "$@"; do
  if [[ $i == --filename=* ]] || [[ $i == "-" ]]; then
    shfmtargs=("${shfmtargs[@]}" "$i")
  fi
done
shfmt "${shfmtargs[@]}"
```

All it does is take the options passed to it, removes all but the `--filename=...` and `-` ones, and then calls the actual `shfmt` with what's left.

And with the `shfmt.path` option (see [Appendix C](#appendix-c-neovim-lsp-configuration-for-the-bash-language-server)) I then told the Bash language server to use this wrapper when invoking `shfmt`.

Therefore, because no parser or printer flags are ever present in the `shfmt` option list, `shfmt` will use the Editorconfig configuration, interpreting it using the custom support for `[[bash]]` or `[[shell]]` sections.

The result is that this section of my `.editorconfig` file is interpreted as I intend:

```toml
[[bash]]
indent_size = 2
indent_style = space
switch_case_indent = true
binary_next_line = true
space_redirects = true
```

and my extensionless Bash script files are formatted appropriately. Not with tabs, and no `shfmt`-specific configuration, but as I have described in configuration.

Great!

This is of course a bit hacky, but I think it is within the boundaries of "small pieces, loosely joined" and doesn't require any modification to any non-user-serviceable parts.

<a name="useful-debugging-approaches"></a>
## Useful debugging approaches

In working out what was going on, I used various tools and settings to help me. Here's a quick list of those, mostly to remind my future self.

### The editorconfig CLI

The [editorconfig](https://www.npmjs.com/package/editorconfig) package, which I installed globally for these investigations with `npm i -g editorconfig`, also sports a CLI which can be used to show the "effective configuration", given a filename. Taking the `.editorconfig` file contents in the [example of the issue](#example-of-the-issue) shown earlier, here's what is output ...

for the shell script file named `a`:

```shell
$ editorconfig a
indent_style=space
indent_size=2
switch_case_indent=true
binary_next_line=true
space_redirects=true
tab_width=2
```

and for the shell script file named `fixup`:

```shell
$ editorconfig fixup
indent_style=tab
indent_size=tab
```

Thus I can see first hand what the Bash language server would receive from the `editorconfig` module, given a filename and some Editorconfig configuration.

### Language server logging

Logs are emitted at various points in the Bash language server's operation, as I could see from browsing the [server source code](https://github.com/bash-lsp/bash-language-server/tree/main/server/src).

For example, the [shfmt support](https://github.com/bash-lsp/bash-language-server/blob/main/server/src/shfmt/index.ts) has many logging lines, including this one:

```typescript
logger.debug(
  `Shfmt: found .editorconfig properties: ${JSON.stringify(
    editorconfigProperties,
  )}`,
)
```

In the [configuration section](https://github.com/bash-lsp/bash-language-server/blob/main/server/src/config.ts) I could see that it was probably possible to set my desired logging level with the environment variable `BASH_IDE_LOG_LEVEL`.

But it turns out that the idea is that settings can be specified in the LSP configuration, and the setting property "path" is what's actually shown in the [Mason info](#appendix-a-mason-info-for-the-bash-language-server), starting with `bashIde` as the first path section. I didn't find that in the Bash language server README or configuration section, perhaps I should have known that implicitly, or known to look elsewhere for it.

Anyway, once I figured that out, I could set my desired level like this (also shown in [Appendix C](#appendix-c-neovim-lsp-configuration-for-the-bash-language-server)):

```lua
return {
  cmd = { 'bash-language-server', 'start' },
  filetypes = { 'bash', 'sh' },
  settings = {
    bashIde = {
      logLevel = 'debug',
      shfmt = {
        path = '/home/dj/.local/bin/shfmt-wrapper'
      }
    },
  },
}
```

Where does this log output from the Bash language server show up? Well, now I figured it out, it's obvious - it's all collected in Neovim's general LSP log file at `~/.local/state/nvim/lsp.log`.

However, any debug level log output from the Bash language server will only show up there if the general Neovim language server logging level is high enough. Even after adding the `logLevel = 'debug'` configuration above, nothing showed up ... until I realised I had this in my `~/.config/nvim/init.lua`:

```lua
-- LSP logging
vim.lsp.set_log_level("WARN")
```

Setting this to `DEBUG`, either by changing the value in the `init.lua` file itself, or simply on the fly with:

```shell
:lua vim.lsp.set_log_level("DEBUG")
```
does the trick, and output like this appears in the `lsp.log` file:

```log
DEBUG Shfmt: found .editorconfig properties: {"indent_style":"tab","indent_size":"tab"}'
DEBUG Shfmt: no shfmt properties found in .editorconfig - using language server shfmt config"
DEBUG Shfmt: running "/home/dj/.local/bin/shfmt-wrapper --filename=/tmp/formatting/fixup -i=0 -ln=auto"'
```

<a name="appendix-a-mason-info-for-the-bash-language-server"></a>
## Appendix A - Mason info for the Bash language server

```text
Language Filter: press <C-f> to apply filter

Installed (1)
  ◍ bash-language-server
    A language server for Bash.

    installed version 5.6.0
    installed purl    pkg:npm/bash-language-server@5.6.0
    homepage          https://github.com/bash-lsp/bash-language-server
    languages         Bash, Csh, Ksh, Sh, Zsh
    categories        LSP
    executables       bash-language-server

    ↓ LSP server configuration schema (press enter to collapse)
      This is a read-only overview of the settings this server accepts.
      Note that some settings might not apply to neovim.

      → bashIde.backgroundAnalysisMaxFiles    default: 500
      → bashIde.enableSourceErrorDiagnostics  default: false
      → bashIde.explainshellEndpoint          default: ""
      → bashIde.globPattern                   default: "**/*@(.sh|.inc|.bash|.command)"
      → bashIde.includeAllWorkspaceSymbols    default: false
      → bashIde.logLevel                      default: "info"
      → bashIde.shellcheckArguments           default: ""
      → bashIde.shellcheckPath                default: "shellcheck"
      → bashIde.shfmt.binaryNextLine          default: false
      → bashIde.shfmt.caseIndent              default: false
      → bashIde.shfmt.funcNextLine            default: false
      → bashIde.shfmt.ignoreEditorconfig      default: false
      → bashIde.shfmt.keepPadding             default: false
      → bashIde.shfmt.languageDialect         default: "auto"
      → bashIde.shfmt.path                    default: "shfmt"
      → bashIde.shfmt.simplifyCode            default: false
      → bashIde.shfmt.spaceRedirects          default: false
```

<a name="appendix-b-configuation-for-the-bash-language-server"></a>
## Appendix B - Configuration for the Bash language server

```javascript
const rawConfig = {
  backgroundAnalysisMaxFiles: toNumber(process.env.BACKGROUND_ANALYSIS_MAX_FILES),
  enableSourceErrorDiagnostics: toBoolean(process.env.ENABLE_SOURCE_ERROR_DIAGNOSTICS),
  explainshellEndpoint: process.env.EXPLAINSHELL_ENDPOINT,
  globPattern: process.env.GLOB_PATTERN,
  includeAllWorkspaceSymbols: toBoolean(process.env.INCLUDE_ALL_WORKSPACE_SYMBOLS),
  logLevel: process.env[LOG_LEVEL_ENV_VAR],
  shellcheckArguments: process.env.SHELLCHECK_ARGUMENTS,
  shellcheckPath: process.env.SHELLCHECK_PATH,
  shfmt: {
    path: process.env.SHFMT_PATH,
    ignoreEditorconfig: toBoolean(process.env.SHFMT_IGNORE_EDITORCONFIG),
    languageDialect: process.env.SHFMT_LANGUAGE_DIALECT,
    binaryNextLine: toBoolean(process.env.SHFMT_BINARY_NEXT_LINE),
    caseIndent: toBoolean(process.env.SHFMT_CASE_INDENT),
    funcNextLine: toBoolean(process.env.SHFMT_FUNC_NEXT_LINE),
    keepPadding: toBoolean(process.env.SHFMT_KEEP_PADDING),
    simplifyCode: toBoolean(process.env.SHFMT_SIMPLIFY_CODE),
    spaceRedirects: toBoolean(process.env.SHFMT_SPACE_REDIRECTS),
  },
}
```

<a name="appendix-c-neovim-lsp-configuration-for-the-bash-language-server"></a>
## Appendix C - Neovim LSP configuration for the Bash language server

To add the Bash language server to [my Neovim 0.11+ setup](/blog/posts/2025/06/10/a-modern-and-clean-neovim-setup-for-cap-node.js-configuration-and-diagnostics/) and configure it, all I needed was to create a new configuration file `~/.config/nvim/lsp/bash.lua`:

```lua
return {
  cmd = { 'bash-language-server', 'start' },
  filetypes = { 'bash', 'sh' },
  settings = {
    bashIde = {
      logLevel = 'debug',
      shfmt = {
        path = '/home/dj/.local/bin/shfmt-wrapper'
      }
    },
  },
}
```

(The settings will be explained in the course of this post.)

Then it was just a matter of enabling the server in the list in my main `~/config/nvim/init.lua` file:

```lua
vim.lsp.enable({
  'javascript',
  'cds',
  'markdown',
  'dockerfile',
  'lua',
  'bash', -- here
})
```

<a name="footnotes"></a>
## Footnotes

1. as well as `shellcheck` which [is also supported](https://github.com/bash-lsp/bash-language-server?tab=readme-ov-file#dependencies)
1. version [3.8.0](https://github.com/mvdan/sh/releases/tag/v3.8.0) or higher, as that is when support for Editorconfig sections such as `[[shell]]` [was introduced](https://github.com/mvdan/sh/issues/664)
1. [configured](https://github.com/qmacro/dotfiles/blob/57c7f38e64ef1f59b9c41f6155b0fa350eb030b7/config/nvim/init.lua#L14-L23) through a `BufWritePre` event based call to `vim.lsp.buf.format`
1. it was actually in the [Mason](https://github.com/mason-org/mason.nvim) installed and managed location at `~/.local/share/nvim/mason/packages/bash-language-server/node_modules/bash-language-server/out/shfmt/index.js`, i.e. the transpiled JavaScript equivalent file
