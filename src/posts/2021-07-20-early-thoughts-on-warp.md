---
layout: post
title: Early thoughts on Warp
tags:
  - shell
---

_Here are some very early thoughts on Warp, the "pro terminal designed for everyday use"._

Today I was [pointed](https://twitter.com/Fidschenheimer/status/1417416096131518469) in Warp's direction on Twitter by [Christian Pfisterer](https://twitter.com/Fidschenheimer) and [Christian Drumm](https://twitter.com/ceedee666).

To quote [Warp's website](https://www.warp.dev/):

> Warp is a blazingly fast, Rust-based terminal that makes you and your team more productive at coding and DevOps.

It's a fascinating venture, for many reasons. While the team is not looking to reinvent the entire terminal, a lot of what they describe feels "foreign" to me, as a long time terminal user (who [started out](https://qmacro.org/2020/11/03/computer-unit-1979/) on a paper-based Superterm Data Communications Terminal hooked up to a PDP-11). I've read the [How it works](https://blog.warp.dev/how-warp-works/) post, which is great. Here are some random thoughts on that, and also on the [Warp beta welcome](https://youtu.be/X0LzWAVlOC0) video.

## Speed

Warp is designed from the outset to be fast; written in Rust (a language designed in part with a major focus on performance) and using the GPU for rendering (which, to be fair, other terminal programs also do, such as my current terminal program of choice, [kitty](https://sw.kovidgoyal.net/kitty/)).

What struck me is how far away my brain is from the sort of speed that this team is talking about; while I guess I still about terminal speed in terms of baud, and based on characters, the measurement for Warp is in frames per second; not only that, it's in the early gaming ballpark of 60fps. It feels a little odd thinking about a terminal in those terms.

## Input affordances

The [input editor](https://docs.warp.dev/features/the-input-editor) is effectively reinvented. I'm in two minds about this; moreover, one of those minds is awash with ignorance and uncertainty. First and most importantly, the editing capabilities on command lines today, at least in popular shells such as Bash and ZSH, are very advanced already. I'm not talking about what perhaps most people use - the default Emacs based editing facilities, which I think the demo is comparing Warp to - but the Vi based ones.

While I do like the idea of being able to more comfortably edit multiple lines, the other features feel rather redundant. With a [simple](https://github.com/qmacro/dotfiles/blob/master/bashrc.d/00-shell.sh#L1) `set -o vi` I am in total control of how I edit, fix, rearrange and generally prepare my input. Very powerful.

The other mind is wondering about how this translates to remote sessions. The beauty of standard tools and shell facilities means that I can have exactly the same experience whether I'm local, or remote, via an ssh-based connection, to a machine elsewhere on the network, or to a container in a Kubernetes cluster.

Will the input editor allow this to happen in these remote contexts too? The [SSH](https://docs.warp.dev/features/ssh) section does seem to say that this is possible, but I'm also wondering about whether that is also valid for ssh sessions within [tmux](https://github.com/tmux/tmux/wiki) panes?

## Blocks of commands

Another feature of the Warp terminal, very nicely demonstrated in the video, is the concept of [blocks](https://docs.warp.dev/features/blocks). This makes a lot of sense to me, and I can imagine already how it will help me visually move up and down examining and working with previous commands and their output.

What worries me slightly is that it looks, at least from the demo, that I'll have to use the mouse if I want to scroll further up, via the "snackbar" (I'm not sure why it's called that, chalk another item down to my ignorance). I wonder if I'll be able to use the terminal as a terminal (yes, that's deliberately provocative) and keep my hands where they belong - on the keyboard?

## The future is terminal

Whatever the answers to these questions turn out to be (and please note that I've not seen or tried out Warp for myself yet - I've added myself to the list requesting beta access when it's available), there's one thing that I'm very happy to see.

And that's fresh thinking and energy going into what I think is one of the most misunderstood superpowers of today's computing space. So whatever this team comes up with, it's an automatic thumbs up for me. I may come to enjoy all Warp's features, or I may only like some of them. But I love the focus and [brain power](https://www.warp.dev/about-us) that's going into Warp.

Here's a picture of Warp, from the very interesting [How Warp works](https://blog.warp.dev/how-warp-works/) article I mentioned earlier.

![A picture of Warp](https://blog.warp.dev/content/images/2021/07/pasted-image-0-2.png }})

Make it so!
