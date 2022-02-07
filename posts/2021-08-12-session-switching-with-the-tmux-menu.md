---
layout: post
title: Session switching with the tmux menu
tags:
  - autodidactics
  - tmux
---

_Here's a way to get a simple session switcher in `tmux` using a popup menu._

I was looking at Waylon Walker's [tmux fzf session jumper](https://waylonwalker.com/tmux-fzf-session-jump/) recently, and really liked it, so much so that I dug into the incantations that he shared, resulting in a new post on this autodidactics blog: [tmux output formatting](https://qmacro.org/autodidactics/2021/08/06/tmux-output-formatting/).

Anyway, I was still thinking about session switching yesterday, and randomly came across this Reddit post: [how to bring up context menu without a mouse](https://www.reddit.com/r/tmux/comments/ot77fx/how_to_bring_up_context_menu_without_mouse/). I'd seen the context menu before, by accidentally triggering it with the right mouse button, and it looks something like this:

![context menu]({{ "/img/2021/08/context-menu.png" | url}})

It was [the comment by user Coffee_24_7](https://www.reddit.com/r/tmux/comments/ot77fx/how_to_bring_up_context_menu_without_mouse/h6tfadp/?utm_source=reddit&utm_medium=web2x&context=3) that really got me thinking - turns out that this type of menu can be called up with one of the myriad `tmux` commands, one which I hadn't yet come across: `display-menu`.

## Building a context menu

I thought that using a context menu like this to present a list of sessions to switch to would be fun and teach me more about the `display-menu` command. Basically I just wanted to have the menu display the sessions I had, and when I'd selected one, switch me to it. So, this is what I did.

The first part of the `tmux` man page for the `display-menu` command looks like this:

>display-menu [-O] [-c target-client] [-t target-pane] [-T title] [-x position] [-y position] name key command

>Display a menu on target-client.  target-pane gives the target for any commands run from the menu.

>A menu is passed as a series of arguments: first the menu item name, second the key shortcut (or empty for none) and third the command to run when the menu item is chosen.  The name and command are formats, see the FORMATS and STYLES sections.  If the name begins with a hyphen (-), then the item is disabled (shown dim) and may not be chosen.  The name may be empty for a separator line, in which case both the key and command should be omitted.

>-T is a format for the menu title (see FORMATS).

So it looked like I would need something like this to have three sessions listed, with shortcut keys 1-3, and commands to switch to the selected one:

```shell
tmux display-menu \
  writing  1 'switch-client -t writing' \
  dotfiles 2 'switch-client -t dotfiles' \
  focus    3 'switch-client -t focus'
```

(The session names in this example are actually the permanent sessions I use right now.)

### Listing the sessions

From the [tmux output formatting](https://qmacro.org/autodidactics/2021/08/06/tmux-output-formatting/) post we already know how to do this. The basic `tmux list-sessions` command produces something like this:

```
dotfiles: 2 windows (created Thu Aug 12 10:06:53 2021)
focus: 1 windows (created Wed Aug 11 10:44:18 2021)
writing: 1 windows (created Wed Aug 11 10:46:21 2021) (attached)
```

To get just the session names, I can supply a format with the `-F` option, like this (specifying `#S` for "session name"):

```shell
tmux list-sessions -F '#S'
```

This produces:

```
dotfiles
focus
writing
```

### Creating the input

For each of the menu entries, three values are needed - the session name, an incrementing identifier (which becomes the single key to press for selection), and the `switch-client` command to switch to the selected session. There are many ways to turn this list of sessions into something like this; I'm going to use `awk` here, for these reasons:

- I like `awk` and its history
- it has a nice `NR` built-in variable that holds the record number being processed, and I can use it for the incrementing identifier
- I can set `ORS`, the Output Record Separator (which is usually a newline), to a space, to avoid having to use something like `tr` or `paste` to bring everything onto one line afterwards

The invocation now becomes:

```shell
tmux list-sessions -F '#S' \
| awk 'BEGIN {ORS=" "} {print $1, NR, "\"switch-client -t", $1 "\""}'
```

This produces:

```
dotfiles 1 "switch-client -t dotfiles" focus 2 "switch-client -t focus" writing 3 "switch-client -t writing"
```

### Using the input for the menu

Now I can just pass that entire output, via the venerable `xargs`, to `tmux`'s `display-menu` command. While I'm at it, I'll use the `-T` option to supply a title for the top of the menu display.

This is what the invocation finally becomes:

```shell
tmux list-sessions -F '#S' \
| awk 'BEGIN {ORS=" "} {print $1, NR, "\"switch-client -t", $1 "\""}' \
| xargs tmux display-menu -T "Switch session"
```

It's worth putting this in a script, so I have done: [`session-menu`](https://github.com/qmacro/dotfiles/commit/68ba9c0934b8c77af44ae9581171577225298814).

### Bind the menu to a key

The final touch in this learning experiment is to bind this invocation to a key in `tmux`, so that I can quickly invoke it. I'll choose "prefix Ctrl-s", which means the line I need to [add to my config](https://github.com/qmacro/dotfiles/commit/a8b70a3e247590275eef8de23aa7ceb9da043d46) looks like this:

```
bind-key C-s run-shell session-menu
```

And with this in place, I can invoke the session switch menu popup very comfortably - this is what it looks like:

![session switch menu]({{ "/img/2021/08/session-switch-menu.png" | url}})

If I decide I don't want to switch sessions after all, I can just dismiss the menu with the standard key `q` (this is also in the `display-menu` part of the `tmux` man page).

---

So there you have it. I do love `fzf` and all the things it can do, but it's worth spending some time on this native `tmux` feature. There's more to it, as well - for example, you can add separators and disabled items (like the ones in the first screenshot in this post) - but this will do me nicely for now. Happy multiplexing!
