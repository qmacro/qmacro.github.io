---
layout: post
title:  "Using exec to jump"
tags:
  - autodidactics
  - shell
---
_In [Mr Rob](https://rwx.gg)'s [dotfiles repo](https://gitlab.com/rwxrob/dotfiles/) (see [A new learning source for shell scripting](https://qmacro.org/2020/10/03/a-new-learning-source-for-shell-scripting/)) there's a treasure trove of content that is very pleasant to peruse._

In one of his streams I saw him use [`ix`](https://gitlab.com/rwxrob/dotfiles/-/blob/master/scripts/ix) and thereby discovered [ix.io](http://ix.io) - a simple pastebin. He uses his `ix` script to share code and other content, either from the command line or from within Vim directly. It's only 14 lines including comments, but I've learned stuff from it already.

If `ix` is invoked with an argument, it's treated as the unique identifier for a specific pastebin, and that pastebin is retrieved, such as [2pgP](http://ix.io/2pgP) (which is another of his scripts with lots to learn from - `twitch`).

The part of `ix` that handles this is simply:

```shell
if [ -n "$1" ]; then
  exec curl -s "ix.io/$1"
fi
```

Basically in this mode, there's no point in processing the rest of the script (beyond the small section you see here), so the handling of the input should finish when the pastebin is retrieved.

Until now, I would have written it like this:

```shell
if [ -n "$1" ]; then
  curl -s "ix.io/$1"
  exit
fi
```

But that's simply unnecessary, and in fact arguably less efficient too. The Bash man page mentions, for `exec`, this fact: "_If command is specified, it replaces the shell. No new process is created._". In other words, in this `if ... fi`, the `curl` command replaces the script's execution, rather than being executed as a sub process.

Sometimes there's a beauty in the smallest things.
