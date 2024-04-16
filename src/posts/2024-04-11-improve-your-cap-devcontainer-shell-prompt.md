---
layout: post
title: Improve your CAP dev container shell prompt
date: 2024-04-11
tags:
  - cap
  - good-to-know
  - terminal
  - bash
---
In the current [back to basics series on CAP Node.js](https://www.youtube.com/playlist?list=PL6RpkC85SLQBHPdfHQ0Ry2TMdsT-muECx) we're using VS Code with a dev container, based on the [definition](https://github.com/qmacro/capb2b/tree/main/.devcontainer) in the [repo for the series](https://github.com/qmacro/capb2b). The container image is based on this one:

```dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}
```

## The long prompt

It includes a non-root user `node` which has a nice default Bash shell prompt that looks like this:

```text
node ➜ /workspaces/capb2b (compositions) $ _
```

> I'm using the underscore (`_`) to mark the position of the cursor in the examples in this post.

I use VS Code's split terminals a lot, so often during an episode I'll be working in multiple split terminals, where width is at a premium. So nice as this shell prompt looks, I like to start typing my commands on a clean and empty line, while still having the information that's shown.

## Finding the prompt definition

Rather than dig into the definition of the container image and find out where and how to change the default prompt (it's actually defined in the `.bashrc` file in a rather complex function called `__bash_prompt`) it was a lot easier and lighter-footed to just modify it on the fly.

The main Bash shell prompt is stored in an environment variable called `PS1`. Looking at this in the shell, we see quite a lot (but then again, it's a rich display of information that we see in the prompt):

```shell
node ➜ /workspaces/capb2b (compositions) $ echo $PS1
\[\]`export XIT=$? \ && [ ! -z "${GITHUB_USER}" ] && echo -n "\[\033[0;3
2m\]@${GITHUB_USER} " || echo -n "\[\033[0;32m\]\u " \ && [ "$XIT" -ne "
0" ] && echo -n "\[\033[1;31m\]➜" || echo -n "\[\033[0m\]➜"` \[\033[
1;34m\]\w `\ if [ "$(git config --get devcontainers-theme.hide-status 2>
/dev/null)" != 1 ] && [ "$(git config --get codespaces-theme.hide-status
 2>/dev/null)" != 1 ]; then \ export BRANCH=$(git --no-optional-locks sy
mbolic-ref --short HEAD 2>/dev/null || git --no-optional-locks rev-parse
 --short HEAD 2>/dev/null); \ if [ "${BRANCH}" != "" ]; then \ echo -n "
\[\033[0;36m\](\[\033[1;31m\]${BRANCH}" \ && if [ "$(git config --get de
vcontainers-theme.show-dirty 2>/dev/null)" = 1 ] && \ git --no-optional-
locks ls-files --error-unmatch -m --directory --no-empty-directory -o --
exclude-standard ":/*" > /dev/null 2>&1; then \ echo -n " \[\033[1;33m\]
✗"; \ fi \ && echo -n "\[\033[0;36m\]) "; \ fi; \ fi`\[\033[0m\]$ \[\]
```
> I've deliberately folded the output across multiple lines to make it display nicely in this post. Also, some of the control characters in this `PS1` variable are not shown.

That `$ ` near the end of the last line here is the final part of the prompt, i.e. this:

```text
                                         |
                                         |
                                         V                   
node ➜ /workspaces/capb2b (compositions) $ _
```

## Modifying the prompt definition

So all we have to do is modify the value to add a newline (`\n`) before it. And that's pretty straightforward with Bash's [shell parameter expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html), in particular with this form:

```shell
${parameter/pattern/string}
```

Trying it out in the current shell, like this, where we replace the current value of `PS1` with one where we're effectively inserting a newline character (`\n`) before it:

```shell
export PS1=${PS1/\$ /\\n$ }
```

the prompt then suddenly looks like this, with the cursor on the second line ready to type:

```text
node ➜ /workspaces/capb2b (compositions) 
$ _
```

> Both the `$` and `\` symbols have special meanings so need to be escaped (by prefixing them with `\`) in this pattern substitution so that their raw values are used.

## Persisting the modification

All we have to do now is make sure this tweak is made each time we start a shell in that dev container. To do that, let's just add it to the end of the `.bashrc` file in the user's directory, i.e. to `/home/node/.bashrc`. After this addition, the last few lines of the file look like this:

```shell
export PROMPT_DIRTRIM=4
export EDITOR=vi
set -o vi
bind -x '"\C-l": clear'
export PS1=${PS1/\$ /\\n$ }
```

Now each new shell has the nice new prompt. This change has been [added to the container image definition in the series' repo](https://github.com/qmacro/capb2b/commit/0654e1afbf76f9256e6ff565c94c920189e72136).

Update 16 Apr: Thanks to tech-wombat for pointing out in the [comments to the video](https://studio.youtube.com/video/BwL_2qAPYsc/comments) that this last update to the container image definition broke the build. It was down to the fact that the default Dockerfile [shell](https://docs.docker.com/reference/dockerfile/#shell) (`/bin/sh`) was choking on the Bash flavoured substitutions in this line. I decided to [separate it out and also make sure to escape the escape char too](https://github.com/qmacro/capb2b/commit/b20125199d787f25961ae6f54138bbfc82799931)!

Good to know!
