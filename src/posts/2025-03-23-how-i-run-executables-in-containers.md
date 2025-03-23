---
layout: post
title: How I run executables in containers
date: 2025-03-23
tags:
  - containers
  - sitmad
  - docker
---
_Here's a quick post explaining how I might typically containerise an executable. This is in the context of my aim to not "pollute" my base OS (at the bare metal level) with any installs, as far as I can, as well as to remain platform independent and abstract._

## Background

Last Friday saw the second [SAP Inside Track Madrid](https://sitmadrid.com/) event, which was excellent. My good friend and colleague [Antonio](https://ajmaradiaga.com/), one of the core event organisers, kicked things off, and then I [started with my talk](https://www.youtube.com/live/TXy-s1Kk3c0?si=ddzIYWYfQvRl4Qwg&t=621), "Level up your CAP skills by learning how to use the cds REPL".

I'd written my talk also [in blog post form](/blog/posts/2025/03/21/level-up-your-cap-skills-by-learning-how-to-use-the-cds-repl/), for folks who might also be interested but couldn't attend the event in person, but also for the folks in the room, especially as I wanted to make clear that everything I was about to demonstrate (I conducted my talk as a live REPL session in the terminal) was easily repeatable, and they could follow the examples at home afterwards by reading the post.

## Generating and displaying a QR code in the terminal

So I decided to be ready to share a link to the [blog post](/blog/posts/2025/03/21/level-up-your-cap-skills-by-learning-how-to-use-the-cds-repl/) right at the start of the talk, and thought I'd have a bit of fun trying to generate a QR code in the terminal, large enough for the attendees to scan on their phones from where they were sat in the audience. For this, I found a great tool called [QRCode Terminal](https://github.com/mdp/qrterminal), in the form of a binary called `qrterminal`.

Here's a very grainy screen grab from [a small picture-in-picture window of me presenting](https://www.youtube.com/live/TXy-s1Kk3c0?si=Gkvcd77F408usOFN&t=670):

![QR code on screen](/images/2025/03/qr-code-on-screen.png)

## Abstracting all the things

I am trying to avoid installing anything on this macOS laptop other than the basics, i.e. Docker. In previous times I would have typically had [Homebrew](https://brew.sh/) installed and then used that to install various software packages, but I'm actively avoiding that, choosing instead to run everything in containers, either locally (i.e. on the container engine running on my laptop) or remotely (on my "homeops" server or on my [Synology NAS](/blog/posts/2021/06/12/remote-access-to-docker-on-my-synology-nas/)).

I didn't have QRCode Terminal  installed in my [PDE](https://www.youtube.com/watch?v=QMVIJhC9Veg) (Personal Development Environment) which is also a container (based on Debian and running `tmux`, `neovim`, `bash` and so on), so I could have just `apt install`ed it and executed it there, but I wanted to take the opportunity to improve my Dockerfile fu (one [kata](http://codekata.com/) at a time).

## The Dockerfile

So I created a simple Dockerfile, trying to use some best practices with respect to multi-stage builds and minimising image size. Here it is:

```dockerfile
FROM alpine:3.21 AS base

ARG ARCH=arm64
ARG QRTERMINALVER=3.2.1

RUN wget \
  -O - \
  -q \ 
  https://github.com/mdp/qrterminal/releases/download/v${QRTERMINALVER}/qrterminal_Linux_${ARCH}.tar.gz \
  | tar xzf - -C / qrterminal

FROM scratch
COPY --from=base /qrterminal /
ENTRYPOINT ["/qrterminal"]
```

Here are some notes:

* It's a two stage build
* The first stage is based on the small Linux distro Alpine, which has `wget` and `tar` - all I need to download and extract the executable
* The second stage is based on the "minimal image" [scratch](https://hub.docker.com/_/scratch) which seems ideal for this sort of containerised executable
* The `qrterminal` executable, extracted in the first stage, is copied to the second stage (see the `--from=base` option to the `COPY` instruction)
* I used the `ENTRYPOINT` instruction to set the default executable for the container image (see [Docker Best Practices: Choosing Between RUN, CMD, and ENTRYPOINT](https://www.docker.com/blog/docker-best-practices-choosing-between-run-cmd-and-entrypoint/) for more info on this) - this means that I can then execute single shot containers, passing whatever QRCode Terminal options I need
* My macOS laptop is Apple Silicon based which means a different native architecture (`arm64`) to my "homeops" server (`amd64`), and even though I can cross-build thanks to QEMU/Rosetta, building for native is always preferable, but I'd like to have the option of building for `amd64` too

> On this last point, I'd like to dig in more to see how I might improve this, especially with respect to those circumstances (like here) where I'm downloading a particular tool's binary release which has been built for a specific architecture which is also in the tarball URL name.

Here's the (cached) build output:

```shell
$ docker build --build-arg QRTERMINALVER=3.2.1 -t qmacro/qrt .
[+] Building 1.9s (7/7) FINISHED                                     docker:default
 => [internal] load build definition from Dockerfile                           0.0s
 => => transferring dockerfile: 448B                                           0.0s
 => [internal] load metadata for docker.io/library/alpine:3.21                 1.9s
 => [internal] load .dockerignore                                              0.0s
 => => transferring context: 2B                                                0.0s
 => [base 1/2] FROM docker.io/library/alpine:3.21@sha256:a8560b36e8b8210634f7  0.0s
 => CACHED [base 2/2] RUN wget   -O -   -q   https://github.com/mdp/qrtermina  0.0s
 => CACHED [stage-1 1/1] COPY --from=base /qrterminal /                        0.0s
 => exporting to image                                                         0.0s
 => => exporting layers                                                        0.0s
 => => writing image sha256:7731e4687c0a4272f2a06002c2bc933fdb5fe3e7c6f0b6f53  0.0s
 => => naming to docker.io/qmacro/qrt                                          0.0s
```

I was happy with the result, shown here via `docker image ls`:

```text
IMAGE ID       REPOSITORY  TAG      SIZE
7731e4687c0a   qmacro/qrt  latest   1.64MB
```

And the best part was - it worked!

```shell
$ docker run --rm qmacro/qrt https://qmacro.org/blog/posts/2025/03/21/level-up-your-cap-skills-by-learning-how-to-use-the-cds-repl/
```

![QR code screenshot](/images/2025/03/qr-code-screenshot.png)
