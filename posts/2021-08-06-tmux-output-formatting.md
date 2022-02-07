---
layout: post
title: tmux output formatting
tags:
  - autodidactics
  - tmux
---

_Here's what I learned today about FORMATS in tmux output._

This week I came across [Waylon Walker](https://twitter.com/_WaylonWalker) who is doing some lovely learning-and-sharing on the topic of `tmux`, the terminal multiplexer. He has a [YouTube channel](https://www.youtube.com/user/quadmx08) and a [blog](https://waylonwalker.com), and there are plenty of `tmux` nuggets that are explained in short video and blog post formats.

I read Waylon's post [tmux fzf session jumper](https://waylonwalker.com/tmux-fzf-session-jump/) that he published yesterday, and, having been curious to learn more about his `tmux` setup and usage, I stared a bit at the commands he'd shared. Here's what he was using, in his `tmux` popup based session selector (I was so happy to learn about `tmux` popups from Waylon, more on that topic another time, perhaps):

```bash
tmux bind C-j \
  display-popup \
  -E \
  "tmux list-sessions \
   | sed -E 's/:.*$//' \
   | grep -v \"^$(tmux display-message -p '#S')\$\" \
   | fzf --reverse \
   | xargs tmux switch-client -t"
```

That's quite a bit to unpack and learn from! I've taken the liberty of inserting lots of newlines so we can stare at it more easily.

Before we start to unpack it, you can see what it does in this screenshot - on invocation, it brings up a session chooser in a popup for me to be able to switch to a different session. Nice!

![session chooser in popup]({{ "/img/2021/08/session-chooser.png" | url}})

## Unpacking the invocation

The invocation itself is creating a new key binding (`prefix` `ctrl-j`) with the `bind` (short for `bind-key`) command. The command that is invoked when this key combination is used is a relatively new one: `display-popup`. It seems that the popup feature appeared only about a year ago with `tmux` version 3.2 - see the [associated change notes and discussion for 3.2](https://github.com/tmux/tmux/issues/2645) for more context.

The `-E` switch goes with the `display-popup` command and causes the popup to close automatically when the shell command that's executed within it completes.

The shell command to execute within the popup follows, and is basically the rest of the line - everything inside the outermost double-quote pair (`"tmux list-sessions ... -t"`). This is a pipeline that starts with the output of whatever `tmux list-sessions` produces - here's an example of that output, from the sessions I'm running right now:

```
another session: 1 windows (created Fri Aug  6 11:24:34 2021) (attached)
tmux experiments: 2 windows (created Thu Aug  5 21:04:16 2021)
writing: 2 windows (created Fri Aug  6 11:02:10 2021)
```

I added a third session, "another session", to have more than just a couple for the example, and it's in that third session that I invoked the `tmux list-sessions` command just now - which is why that is the one marked as `(attached)` in the output.

### Removing unwanted information

That output is passed to `sed -E 's/:.*$//'` which uses an extended (that's what the `-E` denotes) regular expression to replace everything on the line\* starting with a colon and going all the way to the end of the line, with nothing. This would change the output above to this:

```
another session
tmux experiments
writing
```

\* `sed` is a stream editor and processes each line in turn

### Filtering out the name of the current session

This reduced output is then piped into `grep`, the search utility. The `-v` switch used inverts the match, effectively printing what is _not_ matched by the regular expression that is given.

And what is that, exactly? It's this: `\"^$(tmux display-message -p '#S')\$\"`. First, because we're already in the context of the pair of outermost double-quotes, the double-quotes used here to enclose the entire pattern need to be escaped, with the backslashes. And within those escaped double-quotes we have `^` that anchors the match to the start of the line, and `$` (escaped again, because it has special meaning within double-quotes) which anchors to the end of the line. And what should actually be matched? If we stare hard enough, we see that what should be matched is the output of running the following command in a subshell (`$(...)`):

```bash
tmux display-message -p '#S'
```

The `display-message` command normally writes a message to the `tmux` session's status line, but the `-p` switch directs the command to write the message to STDOUT instead. What is the message to be written? Well, it's the value of `#S`, which is a variable (identified by the `#`), and specifically, `S` is an alias for `session_name`. So this command prints the name of the current session to STDOUT. In the same context as before (i.e. attached to the "another session" session), running this command would produce this:

```
another session
```

So the ultimate result of piping the list of session names into this inverted matching `grep` invocation is that it would filter out the current session's name, resulting in:

```
tmux experiments
writing
```

Why do this? Well, it makes sense that if I'm going to pick another session to jump to, I probably won't want to jump to my current session.

### Presenting the list for selection

This reduced list is then piped into `fzf`, about which I've written a couple of posts on this autodidactics blog before:

* [fzf - the basics part 1 - layout](https://qmacro.org/autodidactics/2021/02/02/fzf-the-basics-1-layout/)
* [fzf - the basics part 2 - search results](https://qmacro.org/autodidactics/2021/02/07/fzf-the-basics-2-search-results/)

Using `fzf` here is perfect, it's my tool of choice for mini-UIs in the terminal where a choice has to be made, where an item (or items) must be selected. And because it fits with the Unix philosophy too, the output is simply the value of the item(s) selected. And in case you're wondering, the `--reverse` switch is a synonym for `--layout=reverse` which causes `fzf` to display the selection from the top.

### Jumping to the selected session

In the last part of the pipeline, this value (the name of the session that was selected) is passed to `xargs`, the powerful but oft-misunderstood utility that helps you build and execute commands from STDIN. Here, with the invocation `xargs tmux switch-client -t`, we're using it to pass that selected value (e.g. "writing") as a parameter, adding it to the end of the entire set of arguments passed to `xarg`, resulting in an invocation like this:

```bash
tmux switch-client -t writing
```

This of course is the denoument to which we've been building up, and our `tmux` client is switched to the session we selected. Success!

## Formats and an alternative approach

The reference to the `#S` variable got me thinking, and I remembered seeing an awful lot of potential, particularly in the "FORMATS" section of the [`tmux` man page](https://man7.org/linux/man-pages/man1/tmux.1.html). So I thought I'd use this opportunity, having been inspired by what Waylon showed, to see if I could come up with a different way of doing it.

First, could I use something from "FORMATS" to avoid the need to invoke `sed` in the pipeline (i.e. to not do this bit: `sed -E 's/:.*$//'`)? Turns out that the answer is yes; a format string can be used with the `list-sessions` command, with the `-F` option. So this would be an alternative, using the same variable as we saw earlier. Here's the invocation:

```bash
tmux list-sessions -F '#{session_name}'
```

which produces:

```
another session
tmux experiments
writing
```

That is, none of the extraneous information is there, so we don't need to remove it.

We can go a bit further, too, with a conditional expression. Here it is, in action:

```bash
tmux list-sessions -F '#{?session_attached,,#{session_name}}'
```

The value of the `session_attached` variable is `1` if the session currently being listed is attached (i.e. is the one we're in) and `0` if not. So this conditional expression `#{?COND,A,B}` outputs A if condition COND is true, otherwise B. What a lovely ternary style operator just waiting to be used within `tmux` formatting!

So this version produces:

```

tmux experiments
writing
```

The empty line comes from the fact that for the A value in the conditional expression above, we specified nothing (there was nothing between the two commas `,,`) when the session to which we're currently attached is listed.

That means we still have something to filter out, with `grep`, but it becomes simpler, with the briefest of patterns needed for `grep`, to match and filter out (with `-v`) empty lines: `^$` - i.e. "the start of the line followed immediately by the end of the line". Like this:

```bash
tmux list-sessions -F '#{?session_attached,,#{session_name}}' | grep -v '^$'
```

This produces:

```
tmux experiments
writing
```

which then can be passed as before into `fzf` for selection.

## Wrapping up

This is in no way an attempt to "better" Waylon's post - far from it. It's a different way of approaching things, but most importantly, it's a classic example of folks learning together and from each other. Thanks Waylon, I'm looking forward to learning more from what you share.
