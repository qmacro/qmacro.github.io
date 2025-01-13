---
layout: post
title: New source for LXD images on Crostini
date: 2024-08-24
tags:
  - crostini
  - chromeos
  - lxc
  - lxd
  - termina
  - canonical
  - homeops
  - shell
---
I recently wanted to create a second Debian-based container in the Linux context of one of my ChromeOS devices. But I found I couldn't, as the image wasn't available any more. This post is a short note-to-self to remind myself what happened and what I did.

## Background

The Linux environment in ChromeOS, is the sum of various parts under the umbrella name "Crostini". One of these parts is `termina`, a VM from which a default container is launched, with the name "penguin". It's an LXD container, and there's the `lxc` command in `termina` for managing images and containers.

Most folks who are happy with the Linux terminal environment as-is won't ever need to know this stuff that's underneath, it works very nicely and is integrated well into the rest of the ChromeOS experience. But as [you'll find out](https://chromium.googlesource.com/chromiumos/docs/+/master/containers_and_vms.md), there's a lot going on, and it's a great area for tinkering and learning.

## Getting to the management level

As mentioned just now, managing this stuff is done at the `termina` VM level, with `lxc`. To get to run `lxc` you need to jump into `termina` from `crosh`, the ChromeOS developer shell (reached with `Ctrl-Alt-T`), with `vmc start termina`.

Once in `termina` you can use `lxc`, like this:

```shell
(termina) chronos@localhost ~ $ lxc list
+---------+---------+----------------------------+------+-----------+-----------+
|  NAME   |  STATE  |            IPV4            | IPV6 |   TYPE    | SNAPSHOTS |
+---------+---------+----------------------------+------+-----------+-----------+
| penguin | RUNNING | 172.17.0.1 (docker0)       |      | CONTAINER | 0         |
|         |         | 100.98.28.100 (tailscale0) |      |           |           |
|         |         | 100.115.92.206 (eth0)      |      |           |           |
+---------+---------+----------------------------+------+-----------+-----------+
```

> I'm running both Docker and Tailscale in my default "penguin" container, hence the extra IPV4 addresses.

## Image sources

Images are available via "remotes", which can be listed like this:

```shell
(termina) chronos@localhost ~ $ lxc remote list
+-----------------+------------------------------------------+---------------+-------------+--------+--------+--------+
|      NAME       |                   URL                    |   PROTOCOL    |  AUTH TYPE  | PUBLIC | STATIC | GLOBAL |
+-----------------+------------------------------------------+---------------+-------------+--------+--------+--------+
| images          | https://images.linuxcontainers.org       | simplestreams | none        | YES    | NO     | NO     |
+-----------------+------------------------------------------+---------------+-------------+--------+--------+--------+
| local (current) | unix://                                  | lxd           | file access | NO     | YES    | NO     |
+-----------------+------------------------------------------+---------------+-------------+--------+--------+--------+
| ubuntu          | https://cloud-images.ubuntu.com/releases | simplestreams | none        | YES    | YES    | NO     |
+-----------------+------------------------------------------+---------------+-------------+--------+--------+--------+
| ubuntu-daily    | https://cloud-images.ubuntu.com/daily    | simplestreams | none        | YES    | YES    | NO     |
+-----------------+------------------------------------------+---------------+-------------+--------+--------+--------+
```

The `images` remote is where one normally retrieves non-Ubuntu LXD images, such as those from Debian, Alpine and so on. And to create and start a new container, based on a Debian image, this is the command:

```shell
lxc launch images:debian/12 mycontainer
```

The last time I invoked such a command, which was probably late last year, everything worked as expected.

However, today, this happens (text wrapped for readability):

```shell
(termina) chronos@localhost ~ $ lxc launch images:debian/12 mycontainer
Creating mycontainer
Error: Failed instance creation: Failed getting remote image info:
Failed getting image: The requested image couldn't be found
```

Indeed, querying for images available at the `images` remote resulted in a list ... of zero:

```shell
(termina) chronos@localhost ~ $ lxc image list images:
+-------+-------------+--------+-------------+--------------+------+------+-------------+
| ALIAS | FINGERPRINT | PUBLIC | DESCRIPTION | ARCHITECTURE | TYPE | SIZE | UPLOAD DATE |
+-------+-------------+--------+-------------+--------------+------+------+-------------+
```

## Project stewardship change

This is because of some recent activity which has seen [Canonical take over LXD from the Linux Containers project](https://linuxcontainers.org/lxd/) and even, in a rather surprising and unfortunate move, [switch the licence](https://discuss.linuxcontainers.org/t/lxd-has-been-re-licensed-and-is-now-under-a-cla/18454) from Apache2 to AGPLv3. This is being dubbed as rather anti-community, and has caused many headaches for the hard working Linux Containers team, who have ultimately had to [relinquish control of](https://discuss.linuxcontainers.org/t/lxd-is-no-longer-part-of-the-linux-containers-project/17593), and [end support for](https://discuss.linuxcontainers.org/t/important-notice-for-lxd-users-image-server/18479), LXD containers.

While the URL <https://images.linuxcontainers.org> still responds, and indeed returns a list of images, they are for Incus (a forked LXD project) and LXC, not LXD. The [timeline](https://discuss.linuxcontainers.org/t/important-notice-for-lxd-users-image-server/18479#timeline-3) of the phasing out of support culminated in all LXD users losing access to images on that server at the beginning of May this year.

This is why `lxc image list images:` returns an empty list.

## New source for LXD images

In the period since this change, it seems that Canonical has at least stepped up to provide a new [remote image server](https://documentation.ubuntu.com/lxd/en/latest/reference/remote_image_servers/) which is at <https://images.lxd.canonical.com/>.

It can be used a new remote in the context of what I want to do in Crostini, so I swapped out the URL for the `images` remote like this:

```shell
lxc remote set-url images https://images.lxd.canonical.com/
```

and checked to see if there were images available at that remote. Lo and behold, there were!

```shell
(termina) chronos@localhost ~ $ lxc image list images: | head
+------------------------------------------+--------------+--------+-------------------------------------------+--------------+-----------------+-----------+-------------------------------+
|                  ALIAS                   | FINGERPRINT  | PUBLIC |                DESCRIPTION                | ARCHITECTURE |      TYPE       |   SIZE    |          UPLOAD DATE          |
+------------------------------------------+--------------+--------+-------------------------------------------+--------------+-----------------+-----------+-------------------------------+
| almalinux/8 (3 more)                     | 69fdb178b29d | yes    | AlmaLinux 8 amd64 (20240830_0012)         | x86_64       | CONTAINER       | 128.99MB  | Aug 30, 2024 at 12:00am (UTC) |
+------------------------------------------+--------------+--------+-------------------------------------------+--------------+-----------------+-----------+-------------------------------+
| almalinux/8 (3 more)                     | ffa80f7786e3 | yes    | AlmaLinux 8 amd64 (20240830_0012)         | x86_64       | VIRTUAL-MACHINE | 850.72MB  | Aug 30, 2024 at 12:00am (UTC) |
+------------------------------------------+--------------+--------+-------------------------------------------+--------------+-----------------+-----------+-------------------------------+
| almalinux/8/arm64 (1 more)               | 73fb65f3527d | yes    | AlmaLinux 8 arm64 (20240826_0027)         | aarch64      | CONTAINER       | 125.23MB  | Aug 26, 2024 at 12:00am (UTC) |
+------------------------------------------+--------------+--------+-------------------------------------------+--------------+-----------------+-----------+-------------------------------+
...
```

Quite a few, in fact:

```shell
(termina) chronos@localhost ~ $ lxc image list images: --format csv | wc -l
384
```

## Launching a new container

So I was then able to launch a Debian based container as before:

```shell
(termina) chronos@localhost ~ $ lxc launch images:debian/12 mycontainer
Creating mycontainer
Starting mycontainer
```

and jump right into it:

```shell
(termina) chronos@localhost ~ $ lxc exec mycontainer bash
root@mycontainer:~#
```

## Wrapping up

So all is well again. At least for me in my own little container world. Not so much for the Linux Containers folks. Thanks to them for everything they've done and continue to do, especially now with their next generation system container and virtual machine manager [Incus](https://linuxcontainers.org/incus/).
