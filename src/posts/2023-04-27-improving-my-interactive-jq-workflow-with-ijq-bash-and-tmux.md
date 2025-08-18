---
layout: post
title: Improving my interactive jq workflow with ijq, bash and tmux
date: 2023-04-27
tags:
  - jq
  - ijq
  - bash
  - tmux
  - shell
---
I'm a big fan of ijq and how it allows me to explore JSON data interactively with jq expressions. With a small script I have improved my workflow by being able to capture the jq expression from ijq and use it easily on the command line.

## The challenge

I noticed that I had developed a workflow where I would:

- load my JSON data into [ijq](https://sr.ht/~gpanders/ijq/) and explore it
- get to a stage where I was happy with the jq expression I'd constructed
- exit ijq back to the command line, to then use jq
- try to remember and manually type in the jq expression

Yes, I could just use ijq to run the expression for real and get the results, but the command line is both part of my IDE, my scratchpad, my recent memory and much more, so it's important that I have the jq invocation and expression in my command history, and it's also then ready for further processing with more commands in a pipeline that I can add (super easily through the power of [vi mode](https://opensource.com/article/17/3/fun-vi-mode-your-shell)).

Anyway, I finally recognised that this was suboptimal and decided to do something about it.

## The context

90% of the time I'm working in a dev container. Whether that's running on my SAP-supplied MacBook Pro, or on one of my own Chrome OS devices, or even remotely, via Tailscale, on my Raspberry Pi at home.

The definition of my dev container is [in my dotfiles repo](https://github.com/qmacro/dotfiles/tree/main/devcontainer), and if you examine it, or watch some of the episode replays of our [Hands-on SAP Dev](https://github.com/qmacro/dotfiles/tree/main/devcontainer) show on our [SAP Developers YouTube channel](https://www.youtube.com/user/sapdevs), you'll see that I use [tmux](https://github.com/tmux/tmux/wiki), an awesome terminal multiplexer. Beyond the obvious and visual superpowers it offers, tmux also surfaces session, window, pane and buffer management to the command line level, which gives me access to them and enables me to make use of them too.

The last part of the context is that the underlying OS in my dev containers is Linux, which means I have a native UNIX based environment in which to work, regardless of the actual physical machine I'm using.


## The solution

Because of the context, mainly tmux and a Linux environment, but also the nice way ijq works, the solution was straightforward.

The way ijq works, as I've mentioned also in the comments in the script, is that it uses STDOUT and STDERR to split what it emits. On exiting, it will emit the results of the jq expression to STDOUT (i.e. the data you've grabbed or manipulated with the jq expression) and it will emit the jq expression itself to STDERR. If anything was amiss with the jq expression, it will also add the error detail to STDERR as well as ending on a high return code.

Anyway, to take advantage of tmux and how ijq works, I created a short Bash shell script, currently called [zijq](https://github.com/qmacro/dotfiles/blob/98d3a68a960a42299d186c310252efb6df98b512/scripts/zijq) (the ABAP developers amongst you will know why). It currently looks like this:

```shell
#!/usr/bin/env bash

# Wrapper around ijq to capture the actual jq expression that was used,
# unless it ended in an error. The capture of the expression is into a
# TMUX paste buffer, so this will only be valid in a TMUX session.

# Just exec ijq directly if we're not in a TMUX context
[[ -z $TMUX ]] && exec ijq "$@"

# This is a temporary file to capture the jq expression in
declare tempfile
tempfile="$(mktemp)"

# When ijq ends, the output of the expression is emitted to STDOUT,
# and the expression itself is output to STDERR.

# Run ijq and capture STDERR and the actual RC
declare ijqrc
ijq "$@" 2>"$tempfile"
ijqrc="$?"

# Emit contents of temporary file to STDERR as ijq would
cat "$tempfile" >&2

# If things were OK, set the TMUX paste buffer.
[[ "$ijqrc" -eq 0 ]] && tmux set-buffer "$(cat "$tempfile")"

# Exit with whatever RC ijq ended with
exit "$ijqrc"
```

I've tried to explain the main parts in the comments, but here are a few extra notes.

When tmux is running, the environment variable `TMUX` is set with some internal information, and it's not set when tmux is not running. So I'm using that to check whether the script is in fact running in a tmux context, and if not, I use Bash's `exec` builtin to replace the current process (the script) with the execution of the normal ijq instead (there's no point keeping the context of the script around, hence `exec`).

The separate lines `declare tempfile` and `tempfile="$(mktemp)"` are a result of the wonderful [shellcheck](https://github.com/koalaman/shellcheck) which keeps me straight on Bash style, accuracy and nuances (see the post [Improving my shell scripting](/blog/posts/2020/10/05/improving-my-shell-scripting/) for more on this). If you're interested in the specific trap here, see [SC2155 Declare and assign separately to avoid masking return values](https://www.shellcheck.net/wiki/SC2155).

On executing ijq, I capture both the STDERR output into a file, and the return code into a variable. A return code of zero means success, anything else is failure. I'm only capturing the return code because I want this script to emit it when finishing, as if it were ijq itself (in case I have something downstream that examines that).

To stay true to ijq's behaviour at this point, I also emit to STDERR (`>&2`) whatever was captured there from the actual ijq invocation.

Most importantly, if the jq expression in my ijq session was OK (return code 0), then whatever was in the temporary file will be the expression, so that's when I use tmux's set-buffer command to put it into the buffer (in fact, there are multiple buffers, and lots you can do with them in tmux, check the [man page](https://man7.org/linux/man-pages/man1/tmux.1.html) for all the details). I can then just use the standard tmux key binding `<prefix>[` to emit the contents wherever I am (which will be back on the command line).

## Usage

Now I have this script, I can use ijq as normal (calling it as zijq, which I do often, and [indirectly, via lf](https://github.com/qmacro/dotfiles/commit/2a81134cdaf3f86a48826e7ba7483073c63a6db3)) and when I'm happy with the jq expression I've come up with, I have it in my buffer, as if I'd captured it from, say, copy-mode, and I can emit it wherever I want, such as on the command line, by hitting `<prefix>[`.

You can see it in action here, as I exit to the command line, and paste in the jq expression into the `jq -r '...'` invocation.

![animated gif of zijq and paste buffer in action](/images/2023/04/zijq.gif)
