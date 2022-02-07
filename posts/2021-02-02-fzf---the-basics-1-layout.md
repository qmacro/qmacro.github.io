---
layout: post
title: fzf - the basics part 1 - layout
tags:
  - autodidactics
  - fzf
  - tools
---

_Here's what I learned from reading the first part of the fzf README and paying attention. Now I have a better setup and understanding of the basics, and in particular how to control the appearance._

In the context of [doing less and doing it better](https://qmacro.org/2021/02/01/do-less-and-do-it-better/) I decided to start learning more about [`fzf`](https://github.com/junegunn/fzf), the "command line fuzzy finder". Learning more wasn't difficult, because despite using it for quite a while, I've never really read any of the documentation, and have thus only scratched its surface.

So I started with the first part of the main [README](https://github.com/junegunn/fzf/blob/master/README.md), and here's what I found.

The examples I give in this post are taken from a directory and file structure reflecting the [SAP TechEd 2020 Developer Keynote repository](https://github.com/SAP-samples/teched2020-developer-keynote), which has multiple directories and subdirectories, lots of files with different extensions, hidden files and directories (and I'm not just talking about the `.git/` directory) and also stuff that we often want excluded, such as any `node_modules/` directories. Fairly representative and useful for illustration.

**An awareness of new and changed features**

I was using an older version of `fzf` because I hadn't upgraded it; a quick `brew update; brew upgrade fzf` later and I was using the [latest release](https://github.com/junegunn/fzf/releases/tag/0.25.0). Not absolutely essential for me, but doing this makes me more aware of the fact that fixes and features do come along, and also exposes me to options that I might not have known about. So an indirect but useful advantage already.

I'd [already installed the keybindings](https://github.com/qmacro/dotfiles/commit/68f3c40a76ddd2d8c5c08463855a59ed0e6d7c74#diff-53370cdb3bc79473f0579d40685f8516cc93a2c60b4382e60cb94c09d0c2bfc2R1) keybindings (to get `fzf` to react on Ctrl-T and Ctrl-C) so that was still OK.

**Basic navigation**

I'd been using the arrow keys to move up and down in the list that `fzf` presents. The shame of it! Now I've learned that I can use Vim style key bindings to move up (Ctrl-J) and down (Ctrl-K) I feel less unclean. There's even support for the mousewheel, but the less said about that the better.

Anyway, it's time to get to the main topic of this post - how to affect `fzf`'s appearance, or layout.

**Layout**

Out of the box, `fzf` will use the entire height of your current terminal to display the choices, and this is more or less how I've mostly used `fzf` thus far:

<script id="asciicast-388791" src="https://asciinema.org/a/388791.js" async></script>

But it doesn't have to be this way; in the Layout category of options there's `--height` with which you can tell `fzf` only to use a certain percentage of the terminal's height.

<script id="asciicast-388792" src="https://asciinema.org/a/388792.js" async></script>

Moreover, the jump from the line I was on when `fzf` was invoked, down to the bottom of the screen where I was to make my choice, was a little jarring for me.

I'd vaguely (but mistakenly) thought that the `--layout=reverse` option, also in the Layout category, was something to do with the sort order of the choices presented. Turns out that the order can be reversed with the `--tac` option (taken from the name of `tac`, a command independent of `fzf`, whose name is the opposite of `cat`, see?) and that the `--layout=reverse` relates to the general presentation of the choices.

So with `--layout=reverse` I can reduce that jarring by having the place where I make my choice at the top of the list rather than at the bottom, like this:

<script id="asciicast-388795" src="https://asciinema.org/a/388795.js" async></script>

There's a couple of other options that I found that made the appearance even better for me, but these are more subjective.

First, I can get a border around everything with the Layout option `--border`. In fact there are multiple values that can be specified for this option; the default is to make a rounded border around all four sides.

Then I can save a bit of space by specifying the value `inline` for the `--info` option, also in the Layout category, to get the stats displayed on the same line as my input.

Here's both of those options in action:

<script id="asciicast-388802" src="https://asciinema.org/a/388802.js" async></script>

> In this and the next asciicast, the right hand edge of the border is not properly displayed or reproduced in asciinema for some reason; just imagine that the options are nicely boxed all the way around.

Before we leave the Layout category, there's a couple of other options that can give a nice effect, especially for making [`dmenu`](https://tools.suckless.org/dmenu/) or [`rofi`](https://github.com/davatorium/rofi) style popup menus. These are `--margin` and `--padding`. I've found that to get a popup menu effect, it's worth leaving off the height option (`--height`) to get full screen:

<script id="asciicast-388803" src="https://asciinema.org/a/388803.js" async></script>

**Next time**

That's about it for what I've learned about controlling the appearance. There's actually plenty more on this in the [wiki](https://github.com/junegunn/fzf/wiki).

Note right now that there are 17688 entries in the list of choices presented to me. That's a lot, and far more than I'd ever actually want to select from. [Next time](https://qmacro.org/autodidactics/2021/02/07/fzf-the-basics-2-search-results/) I'll take a look at a couple of `fzf` environment variables, one of which controls what command `fzf` uses, and how that can be changed to affect what gets displayed (or not displayed) in the choice list, so I can address that large number of entries issue.

Update: part 2 of this series is now available: [fzf - the basics part 2 - search results](https://qmacro.org/autodidactics/2021/02/07/fzf-the-basics-2-search-results/).
