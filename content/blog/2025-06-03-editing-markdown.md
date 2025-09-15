---
title: Editing Markdown in a Neovim environment
description: Here are some notes I made when digging into my tools for editing Markdown source.
date: 2025-06-03
tags:
  - markdown
  - marksman
  - markdownlint
  - treesitter
  - lsp
  - linting
  - editorconfig
  - neovim
---

🚧 DRAFT POST 🚧

I am now feeling more comfortable having made the transition from Vim to Neovim and started reconfiguring in Lua. While I had a Neovim setup that worked fine for me for editing in general, which included Markdown sources, I knew I didn't quite understand how things worked, which tools were doing what, and what features I hadn't either discovered or properly got to grips with.

This post is simply an attempt to document what I've set up specifically for Markdown, my understanding of it and the components that it comprises. I'm sure I have many gaps in that understanding and in my ability to wield the tools correctly; if you have any suggestions for changes or improvements, or can fix or enhance my understanding, please let me know in the comments!

## Caveat lector

In addition to the gaps in my understanding, one can think of Neovim as an equal if not more extreme companion to Perl in the [TMTOWTDI] department. The setup I describe in this post is just one way of doing things; one particular combination of tools, one way I have decided to use them, and one way of setting them up.

There are other options, so don't take what you read here as definitive.

For example, I know that the Markdownlint tool can [automatically fix certain issues], such as [MD004 - Unordered list style], but (a) my approach is to get the tool to nag me so I learn to get things right by having to correct issues myself, and (b) I'm not sure yet how I can use the `--fix` option in the context of Neovim as [it doesn't work in the context of STDIN].

Another example relates to [Prettier], an opinionated code formatter that supports Markdown. I know that folks use Prettier in conjunction with Neovim (often via the [conform plugin]) but I will get to that in the next iteration of this Markdown editing setup.

## Configuration

My general Neovim configuration is based on some of the early videos in the excellent [Advent of Neovim] series from TJ DeVries, and I'm also using the [NVIM_APPNAME] feature to split up my config and have different experimental instances, which I switch between with a function that [looks like] this:

```bash
nvc() {

  local configdir=nvim-configs

  local config
  config="$(
    find "$HOME/.config/$configdir" \
    -mindepth 1 \
    -maxdepth 1 \
    -printf "%f\n" \
    | fzf
  )"

  export NVIM_APPNAME="$configdir/${config:-nvim}"
  sed -i -E 's#(NVIM_APPNAME)=.*$#\1='"$NVIM_APPNAME"'#' $HOME/dotfiles/bashrc.d/54-globals-nvim.sh

  nvim "$@"

}
```

and track which "flavour" I have set [in my shell prompt].

## The tools

Beyond Neovim itself, I'm using a number of tools which provide different features and facilities for my Markdown editing needs.

### EditorConfig

[EditorConfig] is a file format specification that describes the content of configuration files, the use of which helps to maintain consistent coding styles for multiple developers working on the same files across various editors and IDEs.

Neovim has [native support for EditorConfig] and all that's needed is a configuration file with the required coding style aspects. I think of the EditorConfig tool as one that is built in to Neovim and controlled by configuration.

### Marksman

[Marksman] is a [language server] for Markdown that provides various language server protocol (LSP) features for Markdown content, such as completion, goto definition, diagnostics and more.

Neovim has [native LSP support] in that it can act as a client to various language servers, and exposes a Lua framework (via `vim.lsp`) that makes the facililities offered by language servers available.

I think of the Marksman tool as a facility that is separate from Neovim but not anything I would (or can) use directly; rather, something I use "remotely" from within Neovim. Like most language servers, Marksman has features that allow me to navigate and manipulate my Markdown sources, and also can surface issues (in the form of warnings and errors, for example) that can be then displayed in Neovim as [diagnostics].

### Markdownlint

[Markdownlint] is a linting tool to check Markdown content for stylistic and other issues; there are many [rules] that it will base the checking on, rules that can be customised or turned off entirely, depending on what you want. As an example, I normally turn off the [MD013 - Line length] rule as I like to write long lines in my Markdown sources.

Differing again to EditorConfig and Marksman, Markdownlint is an external tool that I can (and sometimes do) run on the command line directly, pointing it at Markdown files ... but something that I can harness from within Neovim too and capture (and display) the output as [diagnostics]. I use the [mfussenegger/nvim-lint] asynchronous linter plugin for this harness as it (to quote the README) "spawns linters, parses their output, and reports the results via the `vim.diagnostic` module".

### Treesitter

As with EditorConfig, Neovim also has built-in support for [Treesitter], and (beyond the parser for Markdown itself) there's not really anything specific to editing Markdown. That said, I have added configuration for [Neovim's built-in support for Treesitter] listing the languages for which I want Treesitter parsers automatically installed. This is so I can get [syntax highlighting in fenced code blocks](#syntax-highlighting-of-code-within-code-blocks).

## The combined effect

The combination of each of these tools comes together for a comfortable overall effect, making my Markdown editing life easier.

In no particular order, here is a run down of the features I'm taking advantage of, which tool supplies them, and how I use them. Note that beyond those features listed here, the tools offer more.

### Automatic trimming of trailing whitespace

I use EditorConfig on other projects so it was a natural fit here for my Markdown sources. With `trim_trailing_whitespace` set to `true` I know that NeoVim will do exactly that for me when I save. Here's the entire content of the `.editorconfig` file in this blog repository:

```toml
[*.md]
trim_trailing_whitespace = true
insert_final_newline = true
```

### Syntax highlighting of code within code blocks

Often in my Markdown sources I'll use [fenced code blocks] to include code samples. If I specify the language of the fenced code block, and have the requisite Treesitter parser installed, I'll get language-aware syntax highlighting for the content within the block, which is really lovely. This is what the relevant section of the Treesitter configuration looks like (in `lua/plugins/treesitter.lua`):

```lua
return {
  {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    config = function()
      require 'nvim-treesitter.configs'.setup {
        ensure_installed = { "c", "lua", "vim", "vimdoc", "query", "markdown", "markdown_inline", "bash", "javascript", "toml" },
        auto_install = false,
        -- ...
      }
    end,
  }
}
```

So when for example I add a fenced code block containing Bash, JavaScript or Lua for example, the block contents will be nicely highlighted (I added the `"toml"` entry just now so I could get syntax highlighting for the TOML block I just added earlier to this post).

### An overview of section headings

TODO: add basic use of `gO` too!

The Marksman language server presents [Markdown headings] as [document symbols]. This means I can get a quick overview of the current document's sections, and also jump to them. With the [vim.lsp.buf.document_symbol()] function (invoked in command mode with `lua vim.lsp.buf.document_symbol()`) I can have them displayed in Neovim's location list:

![screenshot of location list containing three document symbols, each of which is a heading in the document](/images/2025/06/document-symbols-in-location-list.png)

I'm also starting to use [Telescope], the "highly extendable fuzzy finder over lists". Telescope has a built-in [picker] for such document symbols too, so I can also invoke `Telescope lsp_document_symbols` in command mode for a similar result, from the same Marksman language server source:

![screenshot of a Telescope picker containing three document symbols, each of which is a heading in the document](/images/2025/06/document-symbols-in-telescope.png)

Navigating through these and selecting one will then take me to that selected heading in the document.

### Diagnostics in general


### Diagnostic details

![TODO](/images/2025/06/diagnostic-link-to-non-existent-document.png)

---

[Advent of Neovim]: https://www.youtube.com/playlist?list=PLep05UYkc6wTyBe7kPjQFWVXTlhKeQejM
[NVIM_APPNAME]: https://neovim.io/doc/user/starting.html#%24NVIM_APPNAME
[in my shell prompt]: https://github.com/qmacro/dotfiles/commit/c40e76516ef162b01ad0aee1d7fba45449329888
[looks like]: https://github.com/qmacro/dotfiles/blob/73e27bb3e76067e9bf21be873ad7c131a0ddf40b/bashrc.d/70-functions.sh#L95-L114
[Marksman]: https://github.com/artempyanykh/marksman
[EditorConfig]: https://editorconfig.org/
[native support for EditorConfig]: https://neovim.io/doc/user/editorconfig.html
[language server]: https://en.wikipedia.org/wiki/Language_Server_Protocol
[native LSP support]: https://neovim.io/doc/user/lsp.html
[Markdownlint]: https://github.com/markdownlint/markdownlint
[rules]: https://github.com/markdownlint/markdownlint/blob/main/docs/RULES.md
[MD013 - Line length]: https://github.com/markdownlint/markdownlint/blob/main/docs/RULES.md#md013---line-length
[MD004 - Unordered list style]: https://github.com/markdownlint/markdownlint/blob/main/docs/RULES.md#md004---unordered-list-style
[diagnostics]: https://neovim.io/doc/user/diagnostic.html
[mfussenegger/nvim-lint]: https://github.com/mfussenegger/nvim-lint
[TMTOWTDI]: https://en.wikipedia.org/wiki/Perl#Philosophy
[automatically fix certain issues]: https://github.com/DavidAnson/markdownlint?tab=readme-ov-file#fixing
[it doesn't work in the context of STDIN]: /blog/posts/2021/05/13/notes-on-markdown-linting-part-1/#:~:text=fix%20basic%20errors%20(does%20not%20work%20with%20STDIN)
[Prettier]: https://prettier.io/docs/
[conform plugin]: https://github.com/stevearc/conform.nvim
[Neovim's built-in support for Treesitter]: https://neovim.io/doc/user/treesitter.html
[fenced code blocks]: https://www.markdownguide.org/extended-syntax/#fenced-code-blocks
[document symbols]: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_documentSymbol
[Markdown headings]: https://www.markdownguide.org/basic-syntax/#headings
[vim.lsp.buf.document_symbol()]: https://neovim.io/doc/user/lsp.html#vim.lsp.buf.document_symbol()
[Telescope]: https://github.com/nvim-telescope/telescope.nvim
[picker]: https://github.com/nvim-telescope/telescope.nvim?tab=readme-ov-file#pickers
