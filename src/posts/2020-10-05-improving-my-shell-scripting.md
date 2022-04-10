---
layout: post
title: Improving my shell scripting
---

_I'm using a style guide along with the `shellcheck` and `shfmt` tools to help me improve the quality and consistency of my shell scripts._

I'm doubling down on shell scripting, in particular Bash shell scripting. This is for many reasons, not least because I think that in the age of cloud and containers, shell environments are more important than ever. And what better shell than the Unix style shell; the design dates back decades but is still in my eyes one of the most wondrous things in tech even today, with its beautiful simplicity and its [simple beauty](https://en.wikipedia.org/wiki/Unix_philosophy#:~:text=The%20Unix%20philosophy%20is%20documented,%2C%20as%20yet%20unknown%2C%20program.).

**Style Guide**

While watching a live stream replay by [Mr Rob](https://rwx.gg), specifically [Google Shell Scripting Guide, Yes, Yes, 1000 Times Yes!](https://www.youtube.com/watch?v=UGCw6wXv1Ao), I came across the [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html) and it's succinct enough to digest in a single sitting, and well written enough to comprehend in that time, too.

I've decided to use this style guide as a general reference for my scripts and plan to implement changes to some of my existing scripts over time.

**Shellcheck**

I discovered the [`shellcheck`](https://github.com/koalaman/shellcheck) shell script analysis tool recently and my goodness me has it made a significant impact on not only the quality of what I write, but also on my understanding of Bash shell syntax! It's available as an online tool, but far more importantly as a command line tool that will highlight issues with your shell code. A linter, basically.

Moreover, it has a rich set of reference material in the [wiki](https://github.com/koalaman/shellcheck/wiki), including definitive pages for each of the errors it will emit. Here's an example: SC1019 is the error code for "Expected this to be an argument to the unary condition" and there's a reference page for it here: [SC1019](https://github.com/koalaman/shellcheck/wiki/SC1019).

I use Vim as my primary editing environment and use the [Asynchronous Linting Engine](https://github.com/dense-analysis/ale) (ALE) as a key plugin. This means, that without me lifting a finger, `shellcheck` will be used asynchronously, live while I'm editing, to show me issues.

If you're writing shell scripts, get `shellcheck` installed and wired up to your editor now.

**shfmt**

My son Joseph used to write a lot of Go, and I was fascinated by the philosophy of what the [`gofmt`](https://golang.org/cmd/gofmt/) formatting tool represented. Go programmers all expected code to be formatted the same way via this tool, and it's natural for them to have their code (re)formatted when they save it in the editor. I know that this is anathema to some programmers, which is why it caught my eye.

There are formatters for other languages that work this way now (and I'm sure there were before, too) such as `rustfmt` (used by Mr Rob, which is what gave me the idea) and there's a version for shell scripts called [`shfmt`](https://github.com/mvdan/sh), described as "a shell parser, formatter and interpreter".

Having experimented with the `shfmt` options, I ended up choosing a few that would help me stay close to the style guide:

|-|-|
|`-i 2`|indent with two spaces|
|`-bn`|binary ops like && and \| may start a line|
|`-ci`|switch cases will be indented|
|`-sr`|redirect operators will be followed by a space|

I [added some new configuration](https://github.com/qmacro/dotfiles/commit/1581496cdc2a51b0bcdda525a7f06dc11129abb1) to tell Vim to use this `shfmt` tool with these options, to automatically format any shell source on save.  This means that I can get my script content automatically formatted without thinking about it, in the same way Go programmers enjoy.

This is what that configuration addition looks like right now:

```vim
fun! s:FormatBashScripts()
  if getline(1) =~# '^#!.*bash' && executable('shfmt')
    %!shfmt -i 2 -bn -ci -sr -
  endif
endfun
autocmd BufWritePre * call s:FormatBashScripts()
```

The reference to `getline` is to check that the [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)) denotes a Bash shell script and the reference to `executable` prevents errors occurring if I'm on a machine where `shfmt` is not available. The key part is this: `%!shfmt ...` which passes the entire buffer contents through the invocation of `shfmt` as if it were a filter, replacing the contents with whatever `shfmt` outputs.

I guess it almost goes without saying that the significance of how this works -- using `shfmt` as a filter to pass the content through, via STDIN and STDOUT, following one of the key Unix shell philosophies -- is not lost on me.

And remember folks, [#TheFutureIsTerminal!](https://twitter.com/search?q=%23TheFutureIsTerminal&src=typed_query)
