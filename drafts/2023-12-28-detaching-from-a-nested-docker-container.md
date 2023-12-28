---
layout: post
title: Detaching from a nested Docker container
date: 2023-12-28
tags:
  - docker
  - containers
  - til
---
Today I learned about the `--detach-keys` option when running a Docker container, and how that helps when I want to detach from a container that I've started and jumped into ... from within my regular dev container.

## A prompt prelude

Different shells have different default prompts, and I also like to customise mine in my dev container context. This blog post will take us on a journey through three layers, and so that it's easier to see which layer is current at any given time, it's worth knowing which prompt symbol is shown at which layer (there may also be an indication of the current working directory, but we can ignore that for now):

|Layer|Description|Shell|Prompt|
|-|-|-|-|
|1|Logged in as me on my macOS host|`zsh`|`%`|
|2|As user `user` in my dev container|`bash`|`;`|
|3|As user `root` in a temporary Alpine container|`sh`|`#`|

> While I strongly prefer `bash` to `zsh`, I am trying not to customise anything in my host macOS context at all, hence the use of the default `zsh` shell.

## The situation

I'd been following along with Nigel Poulton's [Docker Deep Dive course on Pluralsight](https://www.pluralsight.com/courses/docker-deep-dive-2023) and had started up and jumped into an Alpine-based container in the "Containers: Hands-on Deep Dive" section of the course:

```shell
; docker run -it alpine sh
/ #
```

As you can see from the prompt symbol, I was executing these `docker` commands from within my dev container (see [Using the docker CLI in a container on macOS](https://qmacro.org/blog/posts/2023/12/22/using-the-docker-cli-in-a-container-on-macos/)), which is where I normally am.

And the result of `docker run -it alpine sh` is a simple prompt (`/ #`) from the `sh` shell process. This signified that I was indeed in the `sh` shell, attached to (inside) the Alpine based container. Given the historic pattern from the Bourne Shell, the fact that the prompt symbol is `#`, rather than `$`, also tells us that we're currently the `root` user.

> If you're unfamiliar with the `-it` option string here, it's shorthand for `-i -t` which are short forms of `--interactive` (keep STDIN open - so we can type input and have it sent to the container) and `--tty` (allocate a pseudo TTY - a terminal).

When I was done and wanted to exit that Alpine container context, my muscle memory entered `CTRL-p CTRL-q` which is the [default key-sequence to detach from containers](https://docs.docker.com/engine/reference/commandline/cli/#default-key-sequence-to-detach-from-containers).

```shell
; docker run -it alpine sh
/ # (CTRL-p CTRL-q entered at this point) read escape sequence
~ %
```

But I was temporarily surprised to see myself not back at my shell prompt (`;`) in my dev container, but back at the shell prompt on my macOS host (`%`).

## Understanding what happened

It sort of makes sense that this is what happened. The STDIN passage of my `CTRL-p CTRL-q` key sequence was sent to the dev container, which appropriately interpreted them, detaching from it while leaving it running.

Within the dev container, there was still a session connected between the `bash` shell I was in, and the STDIN of the Alpine based container still attached to that level.

In fact, re-attaching from the macOS `zsh` layer to the dev container (named `dev`) like this:

```shell
~ % docker attach dev
```

placed me back exactly where I was just before I sent `CTRL-p CTRL-q`:

```shell
; docker run -it alpine sh
/ #
```

## Allowing for nested container detachment

It turns out that when you start a container, you can specify a custom key sequence. You can do this when using `docker run` with the `--detach-keys` option. 

To try this out, I terminated the Alpine based container 
