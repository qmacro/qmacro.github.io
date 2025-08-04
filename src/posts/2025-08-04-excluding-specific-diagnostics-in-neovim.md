---
layout: post
title: Excluding specific diagnostics in Neovim
date: 2025-08-04
tags:
  - neovim
  - lsp
  - lua
---
_Here's what I did to be able to exclude certain diagnostic messages in Neovim._

Note: I'm still learning (a) Lua, (b) the API surface of Neovim and (c) how the different core components interact and work together, so this may not be the best solution, but it works for me and I've learned a lot digging in and putting it together.

I recently revisited my Neovim config, with a view to updating and simplifying it with the advent of release 0.11. I covered some of this in my last Neovim related post [A modern and clean Neovim setup for CAP Node.js - configuration and diagnostics]. In that context, when editing Node.js (JavaScript) files, everything worked nicely with regards to the Language Server and how the diagnostics were surfaced.

## A desire to filter out a specific diagnostic

That is, everything worked nicely ... with one annoyance - the hint level diagnostic "File is a CommonJS module" shown here on line 1:

```text
H   1 const cds = require('@sap/cds')     ■ File is a CommonJS module; it may be converted to an ES module.
    2 module.exports = cds.service.impl(function() {
    3   this.after('each', 'Books', book => {
    4     console.log(book
E   5   })     ■ ',' expected.
    6 })
```

> For this sample display I'd temporarily changed my preferred config so that all diagnostics are shown, as virtual text, rather than virtual lines, like this:
> ```text
> :lua vim.diagnostic.config({virtual_lines = false, virtual_text = true})
> ```

So I wanted the language server to still publish diagnostics, but for me to be able to filter them.

## Digging into the Neovim docu

In order to achieve this, I spent a pleasant morning today looking through the documentation and getting a better understanding of the API with respect to these features of Neovim (the links are to the documentation sections that are important here):

* [Diagnostic framework]
* [LSP client / framework]
* [Lua engine] (including the `vim` table-related functions)

## The general idea

Neovim has mechanisms for firing up language servers, connecting to them and making their features and functionality available in buffers. It also has facilities for managing diagnostics and surfacing them in different ways.

With regards to diagnostics, a simplified flow between Neovim and a language server looks generally like this:

- Neovim attaches to a language server, sending the contents of the buffer to it for analysis
- The language server publishes hint, information, warning and error level diagnostics (via [textDocument/publishDiagnostics])
- These diagnostics are stored in Neovim via a call to `vim.diagnostic.set`
- Depending on the configuration, the diagnostics are displayed appropriately in the buffer

While I first went down the path of trying to add a filter in the last part (diagnostic display), I found that this was ultimately the wrong way to go about it, not least because I would have found myself having to override all the various diagnostic display affordances such as signs, virtual text, and so on.

The key was to interrupt the _setting_ of the diagnostics so that I could filter some out before they were actually stored, which meant overriding `vim.diagnostic.set`.

## Examining the anatomy of a diagnostic

Understanding what a diagnostic looked like helped me enormously. In the JavaScript sample above, these two diagnostics are displayed:

- (H)INT 80001: File is a CommonJS module; it may be converted to an ES module.
- (E)RROR 1005: ',' expected

We can look at what these are via `vim.diagnostic.get`. Invoking this:

```text
:lua print(vim.diagnostic.get())
```

will just emit a table reference, something like this:

```text
table: 0x68251cb7dca8
```

But we can use the `vim.print` function instead:

```text
:lua vim.print(vim.diagnostic.get())
```

or even simply the `=` mechanism:

```text
:lua =vim.diagnostic.get()
```

and this will cause a formatted display of the table contents:

```lua
{ {
    bufnr = 1,
    code = 1005,
    col = 2,
    end_col = 3,
    end_lnum = 4,
    lnum = 4,
    message = "',' expected.",
    namespace = 7,
    severity = 1,
    source = "typescript",
    user_data = {
      lsp = {
        code = 1005,
        message = "',' expected.",
        range = {
          ["end"] = {
            character = 3,
            line = 4
          },
          start = {
            character = 2,
            line = 4
          }
        },
        severity = 1,
        source = "typescript",
        tags = {}
      }
    }
  }, {
    bufnr = 1,
    code = 80001,
    col = 12,
    end_col = 31,
    end_lnum = 0,
    lnum = 0,
    message = "File is a CommonJS module; it may be converted to an ES module.",
    namespace = 7,
    severity = 4,
    source = "typescript",
    user_data = {
      lsp = {
        code = 80001,
        message = "File is a CommonJS module; it may be converted to an ES module.",
        range = {
          ["end"] = {
            character = 31,
            line = 0
          },
          start = {
            character = 12,
            line = 0
          }
        },
        severity = 4,
        source = "typescript",
        tags = {}
      }
    }
  } }
```

I decided that I would want to filter on `code` and `source`; the `source` for both diagnostics here is `typescript`, and the `code` values are actually shown in the virtual text display already (`80001` and `1005`).

## How diagnostics are set

Diagnostics find their way from the language server back into Neovim via `vim.diagnostic.set` which [has this signature]:

```text
set({namespace}, {bufnr}, {diagnostics}, {opts})
```

> I was curious as to what the namespace was; the value is shown as `7` for both diagnostic records above; looking at the namespaces with `:lua =vim.api.nvim_get_namespaces()` shows this:
>
> ```lua
> {
>   lazy = 2,
>   ["nvim.hlyank"] = 5,
>   ["nvim.lsp.references"] = 3,
>   ["nvim.lsp.semantic_tokens"] = 8,
>   ["nvim.lsp.semantic_tokens:1"] = 9,
>   ["nvim.lsp.signature_help"] = 6,
>   ["nvim.terminal.prompt"] = 1,
>   ["nvim.treesitter.highlighter"] = 4,
>   ["nvim.vim.lsp.javascript.1.diagnostic.signs"] = 11,
>   ["nvim.vim.lsp.javascript.1.diagnostic.underline"] = 12,
>   ["nvim.vim.lsp.javascript.1.diagnostic.virtual_lines"] = 10,
>   ["vim.lsp.javascript.1"] = 7
> }
> ```
>
> which confirms that they're coming from the language server for TypeScript/JavaScript.

### Injecting a filter into vim.diagnostic.set

Once I understood this, I was able to create a simple module (it's my first real foray into custom modules, so I may be doing this suboptimally), in `~/.config/nvim/lua/qmacro/diagnostic.lua`:

```lua
local M = {}

local original_vim_diagnostic_set = vim.diagnostic.set

local filterbuilder = function(filters)
  return function(diagnostic)
    for _, e in pairs(filters) do
      if e.code == diagnostic.code and e.source == diagnostic.source then
        -- if e.reason then
        --   print('Filtering out', diagnostic.source, '/', diagnostic.code, 'diagnostic -', e.reason)
        -- end
        return false
      end
    end
    return true
  end
end

M.exclude = function(filters)
  vim.diagnostic.set = function(ns, bufnr, diagnostics, opts)
    local filtered_diagnostics = vim.tbl_filter(filterbuilder(filters), diagnostics)
    original_vim_diagnostic_set(ns, bufnr, filtered_diagnostics, opts)
  end
end

return M
```

### Using the module

Before walking through this, I thought it would help to show how I want to call this, from within my `~/.config/nvim/init.lua`:

```lua
require('qmacro.diagnostic').exclude({
  { code = 80001, source = 'typescript', reason = 'yes I know already!' }
})
```

In calling the `exclude` function in this module, I can pass a table of exclude filters, each of which has a `code` and `source` field, and an optional `reason` field.

### A walkthrough of the module

Now here's a brief breakdown of the module:

- I save the original `vim.diagnostic.set` function in `original_vim_diagnostic_set` so I can call it later
- The `filterbuilder` function takes a table of filters and produces a function (yes, I like higher order functions), specifically a predicate function, that can be then used with [vim.tbl_filter]
- The predicate function produced also has some commented-out logging (that uses the optional `reason` field from the filter entry) that I'll make good once I figure out the best way to log stuff cleanly and in accordance with standard levels

With all that preparation, all that I then have to do is:

- Override the standard `vim.diagnostic.set` function with one that injects a call to `vim.tbl_filter` to remove any diagnostics that are caught by the exclude filters, before passing through the modified table and the rest of the original arguments to the original `vim.diagnostic.set`

And that's pretty much it.

## Wrapping up

This works for me so far, and getting to this stage has also taught me some more about Neovim's Lua API and various components.

I added this setup to my Neovim configuration with [this commit to my dotfiles].

Along with the Neovim documentation itself, the following resources helped clarify things in my mind:

- [Understanding Diagnostics in Neovim] by Guillaume Humbert
- [Filtering Neovim Diagnostics] by Chakib Benziane
- [Advent of Neovim] by TJ DeVries

Thanks!

[A modern and clean Neovim setup for CAP Node.js - configuration and diagnostics]:/blog/posts/2025/06/10/a-modern-and-clean-neovim-setup-for-cap-node.js-configuration-and-diagnostics/
[diagnostic framework]: https://neovim.io/doc/user/diagnostic.html
[LSP client / framework]: https://neovim.io/doc/user/lsp.html
[Lua engine]: https://neovim.io/doc/user/lua.html
[textDocument/publishDiagnostics]: https://code.visualstudio.com/api/language-extensions/programmatic-language-features#provide-diagnostics
[has this signature]: https://neovim.io/doc/user/diagnostic.html#vim.diagnostic.set()
[Understanding Diagnostics in Neovim]: https://influentcoder.com/posts/nvim-diagnostics/
[Filtering Neovim Diagnostics]: https://blob42.xyz/blog/neovim-diagnostic-filtering/
[Advent of Neovim]: https://www.youtube.com/playlist?list=PLep05UYkc6wTyBe7kPjQFWVXTlhKeQejM
[this commit to my dotfiles]: https://github.com/qmacro/dotfiles/commit/fb3272c121a5acd7610dc21aceb3a7bb53190257
[vim.tbl_filter]: https://neovim.io/doc/user/lua.html#vim.tbl_filter()
