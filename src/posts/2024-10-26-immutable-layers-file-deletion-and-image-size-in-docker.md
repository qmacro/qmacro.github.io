---
layout: post
title: Immutable layers, file deletion and image size in Docker
date: 2024-10-26
tags:
  - docker
---
While I've been vaguely aware of the idea of immutable layers in Docker images, a recent presentation on Docker images caused me to dig a little deeper into how the immutability of these layers means you have to think a bit about what you're doing when creating and deleting content in the course of building an image. Here's what I found out.

When describing the construction of an image, in a `Dockerfile`, most of the commands, such as RUN, COPY and ADD, cause layers to be created (see [Understanding Image Layering Concept with Dockerfile](https://dockerlabs.collabnix.com/beginners/dockerfile/Layering-Dockerfile.html)). These layers are immutable, which means that to remove content later in the construction process, special [whiteout](https://docs.docker.com/engine/storage/drivers/overlayfs-driver/#deleting-files-and-directories) files are created to mask that content's existence; the content itself remains in the image at the layer it was created.

```text
Result :   file1       file2                   file4

Layer 4:                           .wh.file3
Layer 3:   file1
Layer 2:                                       file4
Layer 1:   file1       file2       file3
```

In this layer example, the resulting image's file system makes 3 files available:

- `file1` in the version from Layer 3
- `file2` in the version from Layer 1
- `file4` in the version from Layer 2

In constructing Layer 4, `file3` was removed; this removal was effected by the creation of the whiteout file `.wh.file3`.

This has various implications, not least security, but also image size. I put together a simple example to help me understand.

Here's a `Dockerfile` to build an image, in the contruction of which there's some work that uses tools in the `build-essential` package (which contains various compilers and other tools). The contents of the `build-essential` package are not required in the final image, so are removed after the work is done:

```dockerfile
FROM debian:12
RUN apt-get update
RUN apt-get install -y build-essential
RUN echo "do something with build-essential"
RUN apt-get autoremove --purge -y build-essential
```

> This is a contrived example; this sort of image construction would be far better realised using a multi-stage build approach, for example. But that's a topic for another time.

Assuming we use this `Dockerfile` to build an image like this:

```shell
docker build -t sizetest:before .
```

we can then check the image with:

```shell
docker image ls sizetest
```

which reveals an image size of over 500MB:

```log
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
sizetest     before    eed34853c568   35 seconds ago   534MB
```

We can also look at the resulting image's layers with:

```shell
docker image history sizetest:before
```

which shows us something like this, with each line representing a layer:

```log
IMAGE          CREATED              CREATED BY                                      SIZE      COMMENT
eed34853c568   About a minute ago   RUN /bin/sh -c apt-get autoremove --purge -y…   1.91MB    buildkit.dockerfile.v0
<missing>      About a minute ago   RUN /bin/sh -c echo "do something with build…   0B        buildkit.dockerfile.v0
<missing>      About a minute ago   RUN /bin/sh -c apt-get install -y build-esse…   397MB     buildkit.dockerfile.v0
<missing>      About a minute ago   RUN /bin/sh -c apt-get update # buildkit        19.5MB    buildkit.dockerfile.v0
<missing>      9 days ago           /bin/sh -c #(nop)  CMD ["bash"]                 0B        
<missing>      9 days ago           /bin/sh -c #(nop) ADD file:b4987bca8c4c4c640…   117MB
```

> The two older layers ("9 days ago") are from the base image `debian:12` referred to with `FROM` in the `Dockerfile`.

Note that the layer representing the installation of the `build-essential` package added 397MB ... and the layer representing the removal of that package _added_ an extra 1.91MB - the result of those "whiteout" files being added to mask the `build-essential` package's content.

The key observation here is that each and every `RUN` command in the `Dockerfile` causes a new immutable layer to be created.

Consider this alternative `Dockerfile`:

```dockerfile
FROM debian:12
RUN apt-get update
RUN apt-get install -y build-essential \
  && echo "do something with build-essential" \
  && apt-get autoremove --purge -y build-essential
```

The difference is that the installation, use and subsequent removal of the `build-essential` package happens in the same `RUN` command, i.e. _within the same layer_.

Building an image based on this version of the `Dockerfile`, thus:

```shell
docker build -t sizetest:after .
```

we can then compare the image sizes:

```shell
docker image ls sizetest
```

which reveals a drastically smaller image:

```log
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
sizetest     before    eed34853c568   35 seconds ago   534MB
sizetest     after     db43075f1e65   10 minutes ago   139MB
```

Checking out the layers of this image (with `docker image history sizetest:after`) shows a contrast in layer make-up:

```log
IMAGE          CREATED          CREATED BY                                      SIZE      COMMENT
db43075f1e65   10 minutes ago   RUN /bin/sh -c apt-get install -y build-esse…   3.31MB    buildkit.dockerfile.v0
<missing>      19 hours ago     RUN /bin/sh -c apt-get update # buildkit        19.5MB    buildkit.dockerfile.v0
<missing>      9 days ago       /bin/sh -c #(nop)  CMD ["bash"]                 0B        
<missing>      9 days ago       /bin/sh -c #(nop) ADD file:b4987bca8c4c4c640…   117MB
```

So there you have it. That's what I learned - the immutability of layers is important to know about and to consider when constructing `Dockerfile` instructions.
