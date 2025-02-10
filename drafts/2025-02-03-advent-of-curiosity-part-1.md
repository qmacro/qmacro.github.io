---
layout: post
title: Advent of curiosity - learning more about NeoVim from TJ - part 1
date: 2025-02-03
tags:
  - advent-of-neovim
  - tjdevries
  - neovim
  - vim
---
_In this post I start to dig in to the miscellaneous, ad hoc and secondary gems that jumped out at me from TJ's keyboard, things I picked up by asking myself "wait, how did he do that?" or "what did he just do there?" as he took us on this advent journey._
 
At the end of last year TJ DeVries shared a series of videos called [Advent of NeoVim][1] which explained a ton of stuff for newcomers to this modern fork of the classic editor, and gave a super introduction to the de facto standard language included for customising and extending it, namely Lua.

TJ takes great pains to explain each and every explicit step, but there were also so many implicit things:

* little actions that he performed sometimes without even thinking about it
* core features used in what he was constructing or demonstrating

These things opened up even more avenues for me to explore and learn, mini rabbit holes I want to dive into here.

I'm writing these notes primarily for myself, for the usual reasons:

* marshalling my thoughts into words helps my understanding and causes me to dig deeper
* future me can refer to them when I inevitably forget things

> Any errors or misunderstandings here are down to me, not TJ. While I've been using `vi`, `vim`, and more recently `neovim` for a while, I'm still in the first phase of discovering how much I don't know.

I'll begin with the gems in the third video in the series: [Everthing you need to start writing Lua][2].

## Everything you need to start writing Lua

[📺][2] In this video TJ takes us through an introduction to Lua, covering stuff we should know to be able to read and write Lua-based configuration in NeoVim, and ends with a gentle ease in to the first bits of that configuration journey.

### Sourcing a file

At around [22:47][3] TJ uses `:source %` to load the Lua he'd just written in that buffer. That's `:`, `source` and `%`; let's take each part separately.

#### Command line mode and the ex editor

When in normal mode you can use `:` to switch to command line mode, or "Ex" mode. Vi was originally a "visual" mode for the command line `ex` editor (from Bill Joy, released in 1976) which itself was a successor, via George Coulouris's `em`, to `ed` (from Ken Thompson, released in 1973).

We can still invoke `ex` from the command line, which presents us with:

```text
Entering Ex mode. Type "visual" to go to Normal mode."
:
```

The history and ancestry of command mode goes deep!

By the way, on this Debian Linux distribution that I'm using, `ex` is implemented as part of a basic `vim` implementation:

```shell
$ namei `which ex`
f: /usr/bin/ex
 d /
 d usr
 d bin
 l ex -> /etc/alternatives/ex
   d /
   d etc
   d alternatives
   l ex -> /usr/bin/vim.basic
     d /
     d usr
     d bin
     - vim.basic
```

The command line mode commands and features that we use every day are indeed `ex` commands. For example, `w[rite]`, `q[uit]`, `e[dit] <file>`, plus the `!` variant (typically but not exclusively to suppress warnings about unsaved modifications), and indeed the "from:to" range specification such as `1,$` as prefixes to limit a command's context.

As we know, `$` is a reference to the last line in the buffer. Talking of abbreviations, `%` is also an abbreviation in `ex` for `1,$`, which denotes the entire buffer. This is subtly different to what we associate with `%` today in `vim` and `neovim` as we'll see shortly.

So for example, in `vim`, while there are likely only a few use cases, one can combine a range specification with `w[rite]` to create a new file containing a specific range of lines:




More:

* [vi editor history](https://github.com/mhinz/vi-editor-history)
* [Ex Reference Manual](https://docs-archive.freebsd.org/44doc/usd/10.exref/paper.pdf)[<sup>1</sup>](#footnote-1)




[1]: https://www.youtube.com/playlist?list=PLep05UYkc6wTyBe7kPjQFWVXTlhKeQejM
[2]: https://www.youtube.com/watch?v=CuWfgiwI73Q&list=PLep05UYkc6wTyBe7kPjQFWVXTlhKeQejM&index=3
[3]: https://www.youtube.com/watch?v=CuWfgiwI73Q&list=PLep05UYkc6wTyBe7kPjQFWVXTlhKeQejM&index=3&t=1367s


<a name="footnotes"></a>
## Footnotes

<a name="footnote-1"></a>
1: This is a PDF, but I'm allowing myself the luxury of including a link to it ... and you'll understand when you see the manual's authors!
