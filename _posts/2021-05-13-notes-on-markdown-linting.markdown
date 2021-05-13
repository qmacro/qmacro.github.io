---
layout: post
title: Notes on Markdown linting
date: '2021-05-13 13:04:21'
---

_Here's what I found out about linting Markdown content._

Related to some work activity with a colleague, I found myself having to get my brain around Markdown linting. Of course, not what it is, but what the current possibilities are and how they might apply to my situation. I thought I'd write some notes on what I found (mostly for my future self).

## Which linter?

The Node.js-based [DavidAnson/markdownlint](https://github.com/DavidAnson/markdownlint) is the linter of choice. I'll refer to it as `markdownlint` in this post.

There's a related project [markdownlint/markdownlint](https://github.com/markdownlint/markdownlint) which seems to be another, very similar linter written in Ruby. I'll refer to this as `mdl` as that's what the executable is called.

They both seem to share the same [rule](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md) [definitions](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md) which is good; although `mdl` seems to have rules that have been deprecated in `markdownlint`.

I went for `markdownlint` for a number of reasons:

* it had more watchers, stargazers and forks on GitHub
* I could install it on my macOS daily driver with `brew` (see later)
* installing `mdl` involved RubyGems which I've never got on with
* there was explicit information about using `markdownlint` in various editors (including in Vim)
* my colleague had wanted to use a specific custom linting rule, something that `markdownlint` supports

## Installing markdownlint

Markdownlint can be installed via `npm install` or via `brew`. The `brew` option is actually via a connected project [igorshubovych/markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli). I ran the `brew install markdownlint-cli` command and was up and running pretty much immediately:

```shell
; markdownlint
Usage: markdownlint [options] <files|directories|globs>

MarkdownLint Command Line Interface

Options:
 -V, --version                               output the version number
 -c, --config [configFile]                   configuration file (JSON, JSONC, JS, or YAML)
 -d, --dot                                   include files/folders with a dot (for example `.github`)
 -f, --fix                                   fix basic errors (does not work with STDIN)
 -i, --ignore [file|directory|glob]          file(s) to ignore/exclude (default: [])
 -o, --output [outputFile]                   write issues to file (no console)
 -p, --ignore-path [file]                    path to file with ignore pattern(s)
 -r, --rules  [file|directory|glob|package]  custom rule files (default: [])
 -s, --stdin                                 read from STDIN (does not work with files)
 -h, --help                                  display help for command
;
```

From the options we can see that it works in the way we'd expect - point it at one or more files, optionally give it some configuration, and go.

But we can also see that it allows the use of custom rules, and my colleague who had pointed me in this general direction had wanted to use a custom rule for checking title case (and I still went ahead, despite the fact that I *abhor* title case). The custom rules can be supplied in different forms as we can see from what can be specified with the `--rules` option; this particular one was of the exotic variety, i.e. an NPM package: [markdownlint-rule-titlecase](https://www.npmjs.com/package/markdownlint-rule-titlecase). In fact, there's a grouping of NPM packages that are custom rules for `markdownlint`, organised via the [markdownlint-rule keyword](https://www.npmjs.com/search?q=keywords:markdownlint-rule).

## Using markdownlint with Vim

As I mentioned earlier, there is a [list of references](https://github.com/DavidAnson/markdownlint#related) to mechanisms where you can use `markdownlint` from the comfort of your editor. This list pointed to [fannheyward/coc-markdownlint](https://github.com/fannheyward/coc-markdownlint) for Vim.

I don't use [Conqueror of Completion (coc)](https://github.com/neoclide/coc.nvim) - but I do use the [Asynchronous Linting Engine (ALE)](https://github.com/dense-analysis/ale), which has [built-in support](https://github.com/dense-analysis/ale/blob/master/ale_linters/markdown/markdownlint.vim) for `markdownlint`. Within 5 minutes and a [few tweaks to my ALE related Vim configuration](https://github.com/qmacro/dotfiles/commit/1281d8f908d51e43d280619668ac1d32bc3811a9) I was up and running. I have to tweak the rule configuration to my liking, as right now, even as I write this post, I'm being given grief by `markdownlint` about [overly long lines](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md#md013).

![long lines warnings](/content/images/2021/05/long-lines-warnings.png)

## Configuring markdownlint

Configuration for `markdownlint` can be supplied with the `--config` option, or by configuration files in the right place - either in the current directory or (effectively) in one's home directory.

I added the following to `~/.markdownlintrc`, and the grief about line length went away:

```json
{
  "line-length": false
}
```
