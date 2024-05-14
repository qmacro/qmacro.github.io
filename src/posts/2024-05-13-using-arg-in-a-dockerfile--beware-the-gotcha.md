---
layout: post
title: Using ARG in a Dockerfile - beware the gotcha
date: 2024-05-13
tags:
  - docker
  - dockerfile
  - til
---
Today I learned about the subtleties of [build arguments](https://docs.docker.com/build/guide/build-args/) in Dockerfile definitions, specifically how the `ARG` instruction relates to - and is affected by - the `FROM` instruction. It's not entirely like a constant or a variable, in the way that I had thought.

## The problem with empty ARG values

I spent more than a coffee's worth of time trying to understand why my custom builds of a CAP Node.js container image weren't of the CAP version I was specifying, either implicitly with the default value I'd declared in the `ARG` instruction in the Dockerfile, or even explicitly with the `--build-arg` option on the command line.

To illustrate the problem, here's a vastly simplified version of the Dockerfile I was building with:

```dockerfile
# syntax=docker/dockerfile:1

ARG DEBVER="10"
ARG CAPVER="7.8"
FROM debian:${DEBVER}

RUN printf "DEB=${DEBVER}\nCAP=${CAPVER}\n" > /tmp/log
```

The first variable declared with `ARG` here is `DEBVER` and represents a fairly common use case of allowing for different versions of a base image, illustrated here in being able to start from different versions of the Debian distribution, where the default version is to be 10.

The second variable `CAPVER` was something similar that I was using later in the build instructions (i.e. further on in the Dockerfile), to specify the particular version of CAP that I wanted to install. The actual instruction in my Dockerfile looked like this: `RUN npm install -g @sap/cds-dk@{CAPVER}`.

After building the image based on this simplified Dockerfile, without specifying any values explicitly with `--build-arg`, like this:

```shell
; docker build -t argtest .
```

I could successfully confirm that the version of Debian in containers created from this image was 10:

```shell
; docker run --rm argtest grep VERSION_ID /etc/os-release
VERSION_ID="10"
```

But what of the content of `/tmp/log`?

```shell
; docker run --rm argtest cat /tmp/log
DEB=
CAP=
```

Hmm.

How about when I use `--build-arg` options? 

```shell
; docker build \
  --build-arg="DEBVER=11" \
  --build-arg="CAPVER=7.9" \
  -t argtest .
```

The build completes successfully, and I can see that containers now are Debian 11 based:

```shell
; docker run --rm argtest grep VERSION_ID /etc/os-release
VERSION_ID="11"
```

but the problem with the empty values for `DEBVER` and `CAPVER` in `/tmp/log` remains.

Not only is the value for `CAPVER` empty when we reference it in the `RUN` instruction, but also, and this is the most mysterious thing thus far, while `DEBVER` was certainly recognised and set to 11 for the Debian distribution in the `FROM` instruction, it's empty when we reference it later in the `RUN` instruction.

## The subtleties of how ARG relates to FROM 

The cause is the rather subtle relationship between `ARG` and `FROM`, the explanation for which is brief and a little hidden in the main [Dockerfile reference](https://docs.docker.com/reference/dockerfile/). I certainly missed it when I went straight to the [reference for `ARG`](https://docs.docker.com/reference/dockerfile/#arg), as it's not mentioned, and only explained at the end of the [reference for `FROM`](https://docs.docker.com/reference/dockerfile/#from) which is earlier on the page.

The key section is here: [Understand how ARG and FROM react](https://docs.docker.com/reference/dockerfile/#understand-how-arg-and-from-interact), and includes this line:

> "_An `ARG` declared before a `FROM` is outside of a build stage, so it can't be used in any instruction after a `FROM`._"

In other words, variables declared with `ARG` look like variables in, say, a shell script, variables which are also often declared at the start, and then used throughout the script.

But they're not.

## The solution

What must be done to the Dockerfile above is to modify it so it looks like this:

```dockerfile
# syntax=docker/dockerfile:1

ARG DEBVER="10"
FROM debian:${DEBVER}
ARG DEBVER
ARG CAPVER="7.8"

RUN printf "DEB=${DEBVER}\nCAP=${CAPVER}\n" > /tmp/log
```

Moving the `ARG` instruction for `CAPVER` so that it comes after the `FROM` instruction gives it life and validity.

And the `ARG` instruction for `DEBVER` must stay where it is (as it's referenced in the `FROM` instruction details of course) but if it needs to be referred to after the `FROM` instruction it must be referenced again - hence the `ARG DEBVER` line.

From a container image built using this new version of the Dockerfile, with no `--build-arg` options specified, we can see that the values for `DEBVER` and `CAPVER` are available after the `FROM` instruction:

```shell
; docker run --rm argtest cat /tmp/log
DEB=10
CAP=7.8
```

And this works of course if we set values for build arguments on the command line too, testing a container built using the same `docker build --build-arg ...` invocation as before:

```shell
; docker run --rm argtest cat /tmp/log
DEB=11
CAP=7.9
```

and

```shell
; docker run --rm argtest grep VERSION_ID /etc/os-release
VERSION_ID="11"
```

## Wrapping up

Perhaps I should have read the entire reference document for all the Dockerfile instructions first. Then I would have at least read about this relationship, and I may also have remembered it too. But for those of you like me who jump directly to consult the reference documentation on the thing they're trying to use, perhaps this will help.

Happy building!
