---
title: "Boosting tutorial UX with dev containers part 1 - challenge and base solution"
date: 2022-01-27
tags:
  - sap-community-post
  - containers
---

In this three-part series I outline and demonstrate an approach to help
newcomers get started more quickly with our tutorials, by describing and
providing an environment with all the prerequisite tools installed ready
to go. This is part one, where I describe the challenge and the base
solution I'm going to go with.

See also the next posts in this three-part series:

- [Boosting tutorial UX with dev containers part 2 - embedding
  prerequisite
  details](/blog/posts/2022/01/28/boosting-tutorial-ux-with-dev-containers-part-2-embedding-prerequisite-details/)
- [Boosting tutorial UX with dev containers part 3 - containers into
  action](/blog/posts/2022/02/01/boosting-tutorial-ux-with-dev-containers-part-3-containers-into-action/)

I'm a big fan of learning-by-doing, in fact it's in my regular
reminder tweets about upcoming Hands-on SAP Dev live stream episodes,
like [this one](/tweets/qmacro/status/1486032367877828608):

![](/images/2022/01/screenshot-2022-01-26-at-07.32.42.png)

So I'm the first to rejoice in the detail of any tutorial, and what's
more, in the detail of any tutorial prerequisites. Each and every
activity, whether that's setting things up to learn, or the the
intended learning content itself, teaches me something.

## The challenge and a possible solution

But sometimes I want to fast forward through the prerequisites, and
quickly get to the topic at hand, the actual subject matter of the
tutorial I want to follow.

I've been experimenting over the past year with containers (as
popularised by the Docker initiative). Containers are small, portable
self-contained environments, similar to but much smaller and far more
efficient (with far fewer resource requirements) than, say, a virtual
machine. For a great intro to containers, you should check out
sygyzmundovych 's series on Understanding Containers, see the Further
Reading section at the end of this post.

Most of the time, including the time I spend with you in the [Hands-on
SAP Dev live
streams](https://www.youtube.com/playlist?list=PL6RpkC85SLQABOpzhd7WI-hMpy99PxUo0),
I live and work in the terminal. Not just any terminal, mind you - a
terminal inside a container. It's a container that I create from an
image that I've defined over the months, that's based on Debian and
contains all the tools I need to work comfortably and efficiently.

![](/images/2022/01/screenshot-2022-01-26-at-12.30.50.png)

It gives me independence from the underlying operating system of my
local machine (sometimes I even run it on a [remote Docker
engine](https://qmacro.org/2021/06/12/remote-access-to-docker-on-my-synology-nas/)),
allows me to throw the environment away and start again nice and clean,
and stops me from polluting my host operating systems with layers of
software that are hard to remove.

So it occurred to me that, especially with the advent of VS Code's
support for [remote development in
containers](https://code.visualstudio.com/docs/remote/containers-tutorial),
it would be an interesting experiment to see if the two worlds could
complement each other.

In other words - could I use containers to help those, who want to get
directly to the actual learning content of a tutorial, get there
quicker?

## Testing the solution out on a tutorial

I'm a fan of CAP development, and the tutorials on this in our
[Tutorial Navigator](https://developers.sap.com/tutorial-navigator.html)
are great. For this experiment, I decided to focus on one particular
tutorial: [Set Up Local Development Using VS
Code](https://developers.sap.com/tutorials/btp-app-set-up-local-development.html).

For orientation, this tutorial sits within a group, which itself sits
within a mission, as illustrated here:

![](/images/2022/01/screenshot-2022-01-26-at-08.00.14.png)

The screenshot shows 11 steps in the "Set Up Local Development Using VS
Code" tutorial on the right hand side that help you get set up and
ready to be able to work through the learning content in the actual
mission (building an application end-to-end).

Software development today, especially of full stack applications with
multiple systems and services, in the cloud, involves lots of different
tools and skills, and this is reflected in the prerequisites.

I would encourage anyone and everyone to work their own way through the
steps in this this setup tutorial; it's a rich source of information
and helps you understand what's required. It also helps you think about
your own development environment, what you need, and what you might
want.

But I also want to encourage you to think about how to streamline such
an environment, and what the next level of developer workflow and
productivity might look like.

So in this short series of posts, I'll work through defining and
building a development container that has all the prerequisites for this
mission set up for you. Not only that, this container will be relevant
for you regardless of your actual local machine, whether that's a PC or
a laptop, whether that's running macOS, some distribution of Linux,
Chrome OS, or even Windows. All that's needed is a Docker engine, such
as Docker Desktop or [something similar such as
Podman](https://blog.logrocket.com/top-docker-alternatives-2022/) and VS
Code itself.

## A brief note on terminology

A container is what you work with, what you connect to or even jump into
to use the tools within it and carry out your development work. A
container is created from an image; you could say that it's an
"instance" of an image. To talk of defining a container is really to
talk about defining an image.

## Defining the image

The goal here is to define an image that:

- can be connected to and utilised from VS Code
- contains all the tools needed for a particular project or tutorial

Let's work through the tutorial steps and see what we need to do. Note
that this flow is based on the version of the tutorial today, which is
at [commit
ea9e51a](https://github.com/sap-tutorials/Tutorials/blob/ea9e51a1adccf18bdc9328406e7fa939f8d3616b/tutorials/btp-app-set-up-local-development/btp-app-set-up-local-development.md)
in the source repository.

### Base image

Before we start, we should decide on a base image upon which to build
our definition. As we'll be connecting to it with VS Code it makes
sense to start with one in that context; in fact, as we can see from the
tutorial, it's a Node.js CAP application that we'll be building.

There's a set of base Dockerfile definitions available in the
[vscode-dev-containers](https://github.com/microsoft/vscode-dev-containers)
repository, and after a little reading we see that [this base.Dockerfile
definition](https://github.com/microsoft/vscode-dev-containers/blob/v0.187.0/containers/javascript-node/.devcontainer/base.Dockerfile)
suits our needs. It contains Node.js, but also a complete environment
that is based on the Debian Linux distribution.

Looking at the [reference
page](https://github.com/microsoft/vscode-dev-containers/tree/main/containers/javascript-node),
we see that the published image name is
`mcr.microsoft.com/vscode/devcontainers/javascript-node` and there are
various image variants available:

![](/images/2022/01/screenshot-2022-01-26-at-11.07.38.png)

We'll go for the **16-buster** variant - [Node.js
v16](https://nodejs.org/en/about/releases/), which is the active Long
Term Support  (LTS) version, based on one of my favourite recent stable
Debian releases, [buster](https://www.debian.org/releases/buster/).

Before continuing, we can actually test this base image quite easily,
and it will give us a feel for what we are using.

Let's pull the image first:

```shell
; docker pull mcr.microsoft.com/vscode/devcontainers/javascript-node:16-buster
16-buster: Pulling from vscode/devcontainers/javascript-node
9b99af5931b3: Pull complete
b6013b3e77fe: Pull complete
bbced17b6899: Pull complete
8b609dabefa8: Pull complete
50544bfef33d: Pull complete
fea3f8b8e075: Pull complete
9e4e229021ee: Pull complete
971c8efc250b: Pull complete
3e9d4bc41c27: Pull complete
28732f89a0aa: Pull complete
186abc813d19: Pull complete
Digest: sha256:75f31402fe36ac2b24f4838a7609afd75371378c6261b84eda0c1ece32e165f1
Status: Downloaded newer image for mcr.microsoft.com/vscode/devcontainers/javascript-node:16-buster
mcr.microsoft.com/vscode/devcontainers/javascript-node:16-buster
```

Now what happens when we run it without passing any parameters?

```shell
# /tmp
; docker run --rm -it mcr.microsoft.com/vscode/devcontainers/javascript-node:16-buster
Welcome to Node.js v16.13.2.
Type ".help" for more information.
>
```

Nice! We get a Node.js prompt.

But we can also dig in a little further, and ask for a shell:

```shell
# /tmp
; docker run --rm -it mcr.microsoft.com/vscode/devcontainers/javascript-node:16-buster bash
root ➜ / $
```

Even nicer! Access to a Bash shell (The One True Shell™️) is super
useful, and there's even [zsh
available](https://github.com/microsoft/vscode-dev-containers/blob/v0.187.0/containers/javascript-node/.devcontainer/base.Dockerfile#L6)
if you're that way inclined.

So that's the base upon which we are to build. A good start. We have
Node.js and a command line environment. These are the two essential
ingredients for this tutorial. A Node.js runtime for our app, and a
command line environment [within which to
work](https://blogs.sap.com/tag/thefutureisterminal/) and where we can
install and use other tools and utilities, both SAP-specific and more
general too.

While we can use this image reference
`mcr.microsoft.com/vscode/devcontainers/javascript-node` directly, we
should really start our own definition file, our own Dockerfile - which
is the recipe, the definition, for the image we want to build.

So let's start with a very simple Dockerfile that uses this image
reference as a base (note that the standard name is just "Dockerfile"
with no extension - beware any Windows tools that insist on being
"helpful" by adding one):

```dockerfile
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:${VARIANT}
```

Here we've split off the variant part of the image reference to be the
value of an ARG, so we can more easily modify it in future. Implicitly
this also teaches us a couple of things about the Dockerfile syntax:

- with [ARG](https://docs.docker.com/engine/reference/builder/#arg)
  you can define a variable, with a default value which can be
  overridden at build time with a new value passed on the command line
- the ${...} syntax is how you reference values of variables
  elsewhere

So unless we specify something explicitly on the command line when we
run the build for this Dockerfile (with --build-arg
VARIANT=something-else), the image that will be used as the base will be
`mcr.microsoft.com/vscode/devcontainers/javascript-node:16-buster`.

## Next steps

OK. What else do we need? Well, to answer that, let's take a look
through the steps of the [prerequisite
tutorial](https://developers.sap.com/tutorials/btp-app-set-up-local-development.html)
itself. But we'll do that in part 2:

[Boosting tutorial UX with dev containers part 2 - embedding
prerequisite
details](/blog/posts/2022/01/28/boosting-tutorial-ux-with-dev-containers-part-2-embedding-prerequisite-details/)

See you there!

## Further Reading

- [Understanding Containers](https://blogs.sap.com/tag/understandcontainers/)
  (from Witalij Rudnicki)
- [Develop SAP CAP apps inside a VS Code Docker
  Container](https://blogs.sap.com/2020/02/20/develop-sap-cap-apps-inside-a-vs-code-docker-container/)
  (from Helmut Tammen)

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/boosting-tutorial-ux-with-dev-containers-part-1-challenge-and-base-solution/ba-p/13540202)
