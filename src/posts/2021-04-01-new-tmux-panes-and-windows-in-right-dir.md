---
layout: post
title: New tmux panes and windows in the right directory
tags:
  - autodidactics
  - tmux
---

_I finally got round to looking into how to be in the "right" directory when I create a new window or pane in `tmux`. Here's what I did._

I've been starting multiple `tmux` sessions, one for each project I'm working on, and ensuring that I'm in the "right" base directory for each of those projects before actually creating the corresponding `tmux` session. That way, each new window or pane I open places me in that project's base directory. Which isn't too bad.

But I'm trying to move to a simpler workflow, and use fewer `tmux` sessions. This meant I hit on that possibly age-old issue of being in the "wrong" directory when I create a new window or pane, and having to `cd` to where I want to be. Which is usually *where I just was* before invoking the new window or pane command!

I did a bit of digging and found the answer, which was quite simple in the end - and I would have known about it with a better level of knowledge about `tmux`. I had written a short essay on that subject: [Deeper connections to everyday tools](https://qmacro.org/2021/03/31/deeper-connections-to-everyday-tools/), and in that essay, I'd made a reference to this new discovery.

[Christian Drumm asked](https://twitter.com/ceedee666/status/1377501505226477569) me today about this very thing, so I thought I'd write this short entry that I could refer to for Christian and also for others.

Basically it involves using the `-c` option when creating a new window or pane, and passing the value of the built-in variable `pane_current_path` (see the [manual](https://man7.org/linux/man-pages/man1/tmux.1.html) for info).

I initially got this info from a [gist](https://gist.github.com/william8th/faf23d311fc842be698a1d80737d9631) by [William Heng](https://gist.github.com/william8th) but [this Stack Exchange answer](https://unix.stackexchange.com/a/12091/87597) by Chris Johnsen has some great background which is worth reading too.

The change I made to my `tmux` configuration is in this commit:

<https://github.com/qmacro/dotfiles/pull/2/commits/2664669d5922e640b232f185e2045e412852f47c>

and looks like this:

```
bind c new-window -c "#{pane_current_path}"
bind '-' split-window -c "#{pane_current_path}"
bind '\' split-window -h -c "#{pane_current_path}"
bind C new-window
bind '_' split-window
bind '|' split-window -h
```

Basically I'm now set up to enjoy the new behaviour (opening new windows and panes in the current working directory) when I use the keys I normally use:

* `c` - new window
* `-` - new vertically split pane
* `\` - new horizontally split pane

But I've added three extra bindings in case I want the old behaviour, bindings to the "shifted" version of those keys:

* `C` - new window
* `_` - new vertically split pane
* `|` - new horizontally split pane

I've not found myself using these extra bindings for the old behaviour yet, and I'll probably end up removing them.

Anyway, there you have it. Thank you William and Chris for the help!
