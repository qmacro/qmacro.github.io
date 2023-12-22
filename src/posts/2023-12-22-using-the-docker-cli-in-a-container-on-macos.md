---
layout: post
title: Using the docker CLI in a container on macOS
date: 2023-12-22
tags:
  - macos
  - docker
  - containers
---
In this post I explain what I've done to be able to use the Docker client CLI from within a container on my macOS device.

## Dev containers

I use dev containers everywhere. I hardly ever work outside of a container on, say, my work laptop (a 2022 Apple MacBook Air M2). Instead, I do everything, or as much as I can, in dev containers.

I'm a command line kind of person, happiest and most productive in a terminal session running the Bash shell, but despite that, I haven't installed any CLI tools locally, not even Homebrew. Heck, I haven't even taken the time to fix the issue with macOS shipping with the zsh as default these days. For me, the host OS is secondary. 

## Running the docker CLI

I've found that the only commands I issue in the shell on my laptop's OS have been `docker` commands, to build, start, stop and generally manage my images and containers. I've done this outside my normal dev container based working environments partly because sometimes I have to recreate those working environments, and partly because access to the Docker engine itself (via Docker Desktop) is, at least on a macOS device, a little difficult.

That's because of how Docker is provided on macOS (and Windows) machines generally, which is in a Linux virtual machine. While it's possible to, say, create a bind mount, connecting the Docker engine socket exposed from that VM on the macOS host OS at `/var/run/docker.sock` to a container, it's fraught with difficulties and I've really only had success when the user inside the container is `root`. It's all to do with permissions combined with the extra layer of indirection brought about by the fact that the Docker engine is actually running in a Linux VM rather than natively on the macOS host.

From a productivity perspective the "last mile" for me is to be able to do more with Docker from within my dev containers. In other words, run the `docker` client command, which of course needs to be connected to the Docker engine, and I think I've found a solution that feels clean to me, and doesn't involve bind mounting `/var/run/docker.sock` nor trying to hammer permissions into shape with a big mallet.

## The solution

While it may not be the most compact approach, it works for me, and is also teaching me more about topics I want to dig deeper into anyway, including Docker networking and container-to-container communication.

The solution is based on some great tips from Ákos Takács in one of a myriad discussions on the interwebs about the very problem I've described: [Permission for -v /var/run/docker.sock](https://forums.docker.com/t/permission-for-v-var-run-docker-sock/132976/4).

It involves running [socat](https://linux.die.net/man/1/socat). The man page describes it as _"a command line based utility that establishes two bidirectional byte streams and transfers data between them. Because the streams can be constructed from a large set of different types of data sinks and sources (see address types), and because lots of address options may be applied to the streams, socat can be used for many different purposes"_. In other words, a "multipurpose relay" or "so[cket] cat".

In this case, `socat` is used to relay `/var/run/docker.sock`, which is the UNIX socket on which the Docker engine is listening, making it available via TCP.

That TCP availability, in the form of a `<hostname>:<port>` socket, is to be provided by a container running that `socat` process, in the context of a Docker bridge network, to which the dev container is also connected. 

And through the magic of Docker networking, that TCP socket is then made available to the dev container, and being a TCP socket rather than a file-based UNIX one, we've moved away from any permissions issues. Moreover, that exposure is solely within that specific bridge network.

Here's what this solution looks like.

```text
+-------------------------------------------------host--+
|                                                       |
|       /var/run/docker.sock                            |
|              ^                                        |
|              |                                        |
|          bind mount                                   |
|              |                                        |
|     +--------|--------------------------devnet--+     |
|     |        |                                  |     |
|     |        v                                  |     |
|     |     +-----socat-+       +-------dev-+     |     |
|     |     |      3275 |<------|           |     |     |
|     |     |           |       |           |     |     |
|     |     |   socat   |       | tmux/bash |     |     |
|     |     |           |       |           |     |     |
|     |     | user:root |       | user:user |     |     |
|     |     +-----------+       +-----------+     |     |
|     |                                           |     |
|     +-------------------------------------------+     |
|                                                       |
+-------------------------------------------------------+
```

Setting this up manually and step by step can help illustrate each component part.

### Creating the network "devnet"

Containers running in the same network can communicate with one another. Containers with names that have been specified explicitly can be reached via that name within the network that they share. This is a great combination of features that I can make use of.

I create a new network called "devnet" like this, being explicit about the type of network (which is default, but it doesn't harm to be explicit):


```shell
$ docker network create --driver bridge devnet
969a73295ceeedaf63848c5f7aa4993895a0893e3607e067af347eb3b2d83dc2
```

Now I can see it in the list of all networks:

```shell
$ docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
d8d6d3ae3737   bridge    bridge    local
969a73295cee   devnet    bridge    local
ee4841fdb953   host      host      local
b6ce4554097e   none      null      local
```

So far so good.

### Creating the socket cat service "socat"

Now for the container that will provide the `socat`-powered relay between the UNIX socket at `/var/run/docker.sock` on the host, and a TCP socket that will be available in the "devnet" network. There's [an Alpine based container](https://github.com/alpine-docker/multi-arch-libs/tree/master/socat) that is perfect for this.

The key aspects of this container are that it should:

- run in the "devnet" network
- use the default (i.e. root) user
- have a bind mount to the UNIX socket
- relay that socket to TCP port 2375

I'll give this container the name "socat", and conjure it up like this:

```shell
$ docker run \
  --name socat \
  --network devnet \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --detach \
  alpine/socat tcp-listen:2375,fork,reuseaddr unix-connect:/var/run/docker.sock
5c3f153671e7b292e156bd5a5de9c5539aad544c2eea6466303a1623584d4a66
```

Great. At this point, I have the socket relay mechanism running, and within the "devnet" bridge network, that relay's TCP endpoint is available at `socat:2375`. Note that it's not generally available at the host level, which is a good thing of course; running `netstat -atn | grep 2375` gives no output.

### Creating the dev container "dev"

Now all I need to do is to start up an instance of my dev container image (which I've [recently been revamping](https://github.com/qmacro/exploring-neovim/blob/main/Dockerfile), and the image name is currently "newdev"). There are a few things to note about my dev container:

- I run with user "user", rather than root
- There's some work data on the file system that I bind mount
- I expose a couple of ports, so I can connect to services running there from my browser running on the host (4004 for [CAP](https://cap.cloud.sap) and 8000 for the local instance of [this Eleventy-based blogging system](https://github.com/qmacro/qmacro.github.io))

Now I have the `docker` client CLI in my dev container, I want to use it to connect to the Docker engine.

But rather than try to connect to it via a bind mount to the `/var/run/docker.sock` directly, with all the difficulties that entails, I can now connect to it via a TCP socket, specifically the one that my "socat" container is now making available to other containers in the "devnet" bridge network.

The simplest way to make this default in the dev container is to set the `DOCKER_HOST` environment variable to that socket address (`socat:2375`) when I instantiate the container.

Here goes:

```shell
$ docker run \
  --name dev \
  --network devnet \
  --volume "$HOME/work:/home/user/work" \
  --platform linux/amd64 \
  --publish "4004:4004" \
  --publish "8000:8000" \
  --env DOCKER_HOST=socat:2375 \
  --tty \
  --interactive \
  --detach \
  newdev
3c39a1084871a5f26988d5ef0008dc3134c6313759600b45ef09f683bd251f57
```

A couple of notes on two of the options used:

- I don't normally use the `--detach` option when starting my dev container, as I want to jump right into it, but I thought I'd use it here for consistency and also to help with the step by step approach
- I'm currently building my dev container images with Rosetta, for reasons I'll go into another time, hence the use of `--platform linux/amd64`

## Using docker from within the dev container

Now that I have everything set up, I can jump into my dev container and use the `docker` CLI as I would normally have had to do in the raw macOS host level context.

First, if I attach to the container, like this: `docker attach dev` I get my working environment, my PDE ([Personalised Development Environment](https://www.youtube.com/watch?v=QMVIJhC9Veg)) of choice. My dev container, my home on this (and all other) hosts. It's basically `tmux`, and I use `bash` as my shell. Obviously.

![Dev Container](/images/2023/12/devcontainer.png)

The dev container has all my tools installed, one of which is (now that I can more reliably and properly connect) `docker`. First, I can see that the environment variable `DOCKER_HOST` is set for me (thanks to the use of that `--env` option in the container setup):

```shell
; env | grep DOCKER
DOCKER_BUILDKIT=1
DOCKER_HOST=socat:2375
DOCKER_CONFIG=/home/user/.config/docker
```

The `DOCKER_HOST` environment variable is related to the Docker context, which I could set with [docker context use](https://docs.docker.com/engine/reference/commandline/context_use/) but I don't have to now that there's a value set for the variable.

So all my `docker` invocations will use the context `socat:2375` for where to connect.

And it works!

```shell
; docker container ls
CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS          PORTS                                            NAMES
3c39a1084871   newdev                "tmux -u"                11 minutes ago   Up 11 minutes   0.0.0.0:4004->4004/tcp, 0.0.0.0:8000->8000/tcp   dev
5c3f153671e7   alpine/socat          "socat tcp-listen:23…"   50 minutes ago   Up 50 minutes                                                    socat
```

And I can see that those two containers are indeed in the "devnet" network:

```shell
; docker network inspect devnet | jq 'first | .Containers'
{
  "34e1703d91894701f9de1211256e7157ef755f35d3884057163827d515b837be": {
    "Name": "dev",
    "EndpointID": "a12669474c0bd39767a3dabadea0da8f0247f597f8d4dfa5458a344f933dcc47",
    "MacAddress": "02:42:ac:1b:00:03",
    "IPv4Address": "172.27.0.3/16",
    "IPv6Address": ""
  },
  "5c3f153671e7b292e156bd5a5de9c5539aad544c2eea6466303a1623584d4a66": {
    "Name": "socat",
    "EndpointID": "a83290a0970b04ea2a3257c2c4187413cc9b035589b2a0cc9927137be704325d",
    "MacAddress": "02:42:ac:1b:00:02",
    "IPv4Address": "172.27.0.2/16",
    "IPv6Address": ""
  }
}
```

I did for a second want to check that my access wasn't read-only or something, but no - I can pull images and create new containers, of course, too:

```shell
; docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
478afc919002: Pull complete
Digest: sha256:ac69084025c660510933cca701f615283cdbb3aa0963188770b54c31c8962493
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working ...
```

Not only that, but this `hello-world` experiment also lets me confirm one more thing - that containers created don't automatically somehow run in the "devnet" network, and indeed they don't (it wouldn't make sense if they did, but it's always nice to check):

```shell
{% raw %}
; docker container ls \
  --all \
  --format '{{.Names}} ({{.Image}}) {{.Status}}'
dev (newdev) Up 20 minutes
socat (alpine/socat) Up 20 minutes
priceless_cori (hello-world) Exited (0) 3 minutes ago
; docker inspect dev socat priceless_cori \
  | jq 'map({(.Config.Image):.NetworkSettings.Networks|keys})|add'
{
  "alpine/socat": [
    "devnet"
  ],
  "newdev": [
    "devnet"
  ],
  "hello-world": [
    "bridge"
  ]
}
{% endraw %}
```

## Compose all the things

Setting the network and containers up like this manually is great for a blog post like this, but I'd prefer something a little more automated and declarative. So here's a Docker compose file that sets up the same combination:

```yaml
services:
  socat:
    image: alpine/socat
    container_name: socat
    networks:
      -  devnet
    command: 'tcp-listen:2375,fork,reuseaddr unix-connect:/var/run/docker.sock'
    user: root
    volumes:
      - type: bind
        source: /var/run/docker.sock
        target: /var/run/docker.sock
  dev:
    depends_on:
      - socat
    image: newdev
    container_name: dev
    networks:
      -  devnet
    platform: linux/amd64
    stdin_open: true
    tty: true
    volumes:
      - '$HOME/work:/home/user/work'
    ports:
      - '4004:4004'
      - '8000:8000'
    environment:
      DOCKER_HOST: 'socat:2375'
networks:
  devnet:
    name: devnet
    driver: bridge
```

Now with a simple `docker compose up --detach` invocation, I can have everything up and running as before:

```shell
; docker compose up --detach
[+] Running 3/3
 ✔ Network devnet   Created                                 0.0s
 ✔ Container socat  Started                                 0.0s
 ✔ Container dev    Started                                 0.0s
 ```

 And now I can attach to my dev container as before with `docker attach dev`.

 Nice!
