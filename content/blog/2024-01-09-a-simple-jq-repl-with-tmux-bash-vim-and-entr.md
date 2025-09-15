---
title: A simple jq REPL with tmux, bash, vim and entr
date: 2024-01-09
tags:
  - jq
  - shell
  - cli
  - terminal
  - bash
  - tmux
  - entr
  - vim
---
In this quick post I show a simple JSON dataset explorer that gives me a multi-line filter editor.

When it comes to exploring and processing JSON data, jq is my goto language. And for exploring, I will either just want to browse the entire JSON dataset, or filter with simple jq expressions. 

## Browsing

For browsing, I have a simple script [jl](https://github.com/qmacro/dotfiles/blob/main/scripts/jl) (short for "jq | less") which just uses the appropriate options to send a colourised pretty printed version of the JSON through `less`:

```shell
#!/usr/bin/env bash

# JSON less
# This is a script so that I can use it in lf
jq -C . < "$1" | less -R
```

## Filtering and exploring

For exploring, I often reach for [interactive jq](https://sr.ht/~gpanders/ijq/), which I love. There are similar Web-based tools, and both `ijq` and these Web-based tools follow the same three-window pattern:

* input: the source JSON
* filter: my jq expression
* output: the resulting JSON

Most of these tools only give you a single filter line to enter your expression. For 80% of the time, that's perfectly fine, and I find myself enjoying the ease of exploration that `ijq` offers (see [these posts on ijq](/tags/ijq)).

### jqte

Sometimes though I find myself wanting a bit more space in the "filter" window, so I can use it more as a REPL, or at least as a multi-line filter editor, which, as a bonus, then gives me great syntax highlighting thanks to [this TreeSitter plugin for jq](https://github.com/flurie/tree-sitter-jq) and linting thanks to [this jq LSP server](https://github.com/wader/jq-lsp).

My "IDE" is my terminal, and I run `bash` shells inside `tmux` (inside a dev container) and make use of the command line and all that the UNIX pipeline and large set of small tools has to offer. To that end, I have cobbled together a quick "jq tmux based explorer" [jqte](https://github.com/qmacro/dotfiles/blob/main/scripts/jqte) which I can use to explore a JSON dataset.

Here's a short demo of it in action. The context in which I invoke `jqte products.json` is my IDE, i.e. I'm within my main `tmux` session:

![screencast](/images/2024/01/jqte.gif)

It opens up a new `tmux` window with three panes (1, 2 and 3), as also described in the script itself:

```text
+---------------------+----------------------+
| output              | original JSON data   |
|                     |                      |
|                     |                      |
|                     |                      |
|          1          |          2           |
|                     |                      |
|                     |                      |
|                     +----------------------|
|                     | filter               |
|                     |                      |
|                     |          3           |
|                     |                      |
+---------------------+----------------------+
```

I'm placed directly into the "filter" pane which is a `neovim` session editing a temporary file that represents my jq filter, where the identity function `.` is specified as a starting point.

Every time I modify the filter the entire jq filter is applied to the source JSON and the result is displayed, in the "output" pane. This is achieved by the combination of a vim `autocmd` and the super useful [entr](https://github.com/eradman/entr).

When I'm done, I can close the entire `jqte` session using `tmux`'s normal "kill-window" facility which I invoke with `<prefix>&`.
