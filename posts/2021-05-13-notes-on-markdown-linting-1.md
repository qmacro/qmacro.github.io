---
layout: post
title: Notes on Markdown linting - part 1
tags:
  - markdown
  - linting
---

_Here's what I found out when I started to look into linting Markdown content._

Thanks to some great direction and enlightenment from my colleague [Tobias](https://github.com/shegox), I found myself getting my brain around Markdown linting. Of course, not what it is, but what the current possibilities are and how they might apply to my situation. I thought I'd write some notes on what I found (mostly for my future self).

(See also [Notes on Markdown linting - part 2](https://qmacro.org/2021/05/14/notes-on-markdown-linting-part-2/) where I learn how to get Markdown linting working in GitHub Actions).

## Which linter?

The Node.js-based [DavidAnson/markdownlint](https://github.com/DavidAnson/markdownlint) is the linter of choice. I'll refer to it as `markdownlint` in this post.

There's a related project [markdownlint/markdownlint](https://github.com/markdownlint/markdownlint) which seems to be another, very similar linter written in Ruby. I'll refer to this as `mdl` as that's what the executable is called.

They both seem to share the same [rule](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md) [definitions](https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md) which is good; although `mdl` seems to have rules that have been deprecated in `markdownlint`.

I went for `markdownlint` for a number of reasons:

* it had more watchers, stargazers and forks on GitHub
* I could install it on my macOS daily driver with `brew` (see later)
* installing `mdl` involved RubyGems which I've never got on with
* there was explicit information about using `markdownlint` in various editors (including in Vim)
* Tobias had wanted to use a specific custom linting rule, something that `markdownlint` supports

## Installing markdownlint

Markdownlint can be installed via `npm install` or via `brew`. The `brew` option is actually via a connected project [igorshubovych/markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli). I ran the `brew install markdownlint-cli` command and was up and running pretty much immediately:

```shell
# ~/Projects/gh/github.com/qmacro/qmacro.github.io (markdownlint-post *=)
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

```

From the options we can see that it works in the way we'd expect - point it at one or more files, optionally give it some configuration, and go.

But we can also see that it allows the use of custom rules. The custom rule that Tobias wanted to use was one that checks for title case (and I still went ahead, despite the fact that I dislike title case intensely :-)). The custom rules can be supplied in different forms as we can see from what can be specified with the `--rules` option; this particular one was of the exotic variety, i.e. an NPM package: [markdownlint-rule-titlecase](https://www.npmjs.com/package/markdownlint-rule-titlecase). In fact, there's a grouping of NPM packages that are custom rules for `markdownlint`, organised via the [markdownlint-rule keyword](https://www.npmjs.com/search?q=keywords:markdownlint-rule).

## Using markdownlint with Vim

As I mentioned earlier, there is a [list of references](https://github.com/DavidAnson/markdownlint#related) to mechanisms where you can use `markdownlint` from the comfort of your editor. This list pointed to [fannheyward/coc-markdownlint](https://github.com/fannheyward/coc-markdownlint) for Vim.

I don't use [Conqueror of Completion (coc)](https://github.com/neoclide/coc.nvim) - but I do use the [Asynchronous Linting Engine (ALE)](https://github.com/dense-analysis/ale), which has [built-in support](https://github.com/dense-analysis/ale/blob/master/ale_linters/markdown/markdownlint.vim) for `markdownlint`. Within 5 minutes and a [few tweaks to my ALE related Vim configuration](https://github.com/qmacro/dotfiles/commit/1281d8f908d51e43d280619668ac1d32bc3811a9) I was up and running. I have to tweak the rule configuration to my liking, as right now, even as I write this post, I'm being given grief by `markdownlint` about [overly long lines](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md#md013).

![long lines warnings]({{ "/img/2021/05/long-lines-warnings.png" | url }})

## Configuring markdownlint

Configuration for `markdownlint` can be supplied with the `--config` option, or by configuration files in the right place - either in the current directory or in one's home directory.

I added the following to `~/.markdownlintrc`, and the grief about line length went away:

```json
{
  "line-length": false
}
```

## Trying a custom rule

I then wanted to see if I could get the custom linting rule working, at least in a basic way. On the [NPM page for markdownlint-rule-titlecase](https://www.npmjs.com/package/markdownlint-rule-titlecase) it says:

_Once installed using npm install markdownlint-rule-titlecase, run markdownlint with --rules "markdownlint-rule-titlecase"._

Sounds fair, although a little worrying for me as I'm not going to be working with Markdown content in the context of a Node.js project any time soon. However, it turns out that I can still install the package and use it, even in a non-Node.js project directory:

```shell
# ~/Projects/gh/github.com/qmacro/qmacro.github.io (markdownlint-post *=)
; npm i --no-package-lock markdownlint-rule-titlecase
npm WARN saveError ENOENT: no such file or directory, open '/Users/dj/Projects/gh/github.com/qmacro/qmacro.github.io/package.json'
npm WARN enoent ENOENT: no such file or directory, open '/Users/dj/Projects/gh/github.com/qmacro/qmacro.github.io/package.json'
npm WARN qmacro.github.io No description
npm WARN qmacro.github.io No repository field.
npm WARN qmacro.github.io No README data
npm WARN qmacro.github.io No license field.

+ markdownlint-rule-titlecase@0.1.0
added 4 packages from 4 contributors and audited 4 packages in 0.838s
found 0 vulnerabilities
```

The warnings are fair - there isn't a `package.json` file of course, why would there be?

I do now have a smallish `node_modules/` directory, though - containing the custom rule package:

```
# ~/Projects/gh/github.com/qmacro/qmacro.github.io (markdownlint-post *%=)
; tree -d node_modules/
node_modules/
├── markdownlint-rule-helpers
├── markdownlint-rule-titlecase
├── title-case
│   ├── dist
│   └── dist.es2015
└── tslib
    └── modules

7 directories
```

Oh well, I guess I could delete it when I'm done. In the meantime, can I take this new custom rule for a spin?

```
# ~/Projects/gh/github.com/qmacro/qmacro.github.io (markdownlint-post *%=)
; markdownlint --rules markdownlint-rule-titlecase _posts/2021-05-13-notes-on-markdown-linting.markdown
_posts/2021-05-13-notes-on-markdown-linting.markdown:11:1 titlecase-rule Titlecase rule [Title Case: 'Expected ## Which Linter?, found ## Which linter?']
_posts/2021-05-13-notes-on-markdown-linting.markdown:27:1 titlecase-rule Titlecase rule [Title Case: 'Expected ## Installing Markdownlint, found ## Installing markdownlint']
_posts/2021-05-13-notes-on-markdown-linting.markdown:55:1 titlecase-rule Titlecase rule [Title Case: 'Expected ## Using Markdownlint with Vim, found ## Using markdownlint with Vim']
_posts/2021-05-13-notes-on-markdown-linting.markdown:63:1 titlecase-rule Titlecase rule [Title Case: 'Expected ## Configuring Markdownlint, found ## Configuring markdownlint']
_posts/2021-05-13-notes-on-markdown-linting.markdown:75:1 titlecase-rule Titlecase rule [Title Case: 'Expected ## Trying a Custom Rule, found ## Trying a custom rule']
```

Yes! Works nicely. Although like I say, I'm not sure why anyone would *want* to use such a rule ... I may write one that complains if you _do_ use title case. But I digress.

I think I'd like to be able to run these custom rules in Vim too, but I'll leave that for another time. I'm satisfied at least at this stage to be able to lint my Markdown files at all. And the next thing is actually to be able to use `markdownlint` in a GitHub Actions workflow.

Update: [I've written that up in part 2](https://qmacro.org/2021/05/14/notes-on-markdown-linting-part-2/).
