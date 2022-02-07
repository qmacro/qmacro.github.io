---
layout: post
title: Remote access to Docker on my Synology NAS
tags:
  - docker
  - nas
---

_Here's what I did to enable remote access to the Docker install on my Synology NAS._

This post describes the steps I took to set up remote access to Docker running on my NAS, in the simplest and "smallest footprint" possible way I could find. There are other approaches, but this is what I did. It was a little less obvious than one might have expected, because of the way the Docker service is hosted on the NAS's operating system, and I ended up having to read around (see the reading list at the end).

## Introduction

Having followed the container revolution for a while, I've become more and more enamoured with the idea of disposable workspaces, services and apps that can be instantly reified and leave no trace when they're gone. This was one of the reasons I opted for a Synology NAS, my first NAS device (see [Adding a drive to my Synology NAS](https://qmacro.org/2021/05/22/adding-a-drive-to-my-synology-nas/)), because it is to act not only as a storage device, but as a container server.

The Docker experience out of the box with the NAS's operating system, DiskStation Manager (DSM), is very pleasant, via a graphical user interface. I've been very happy with the way it works, especially in the initial discovery phase.

![A screenshot of the Docker app installed on the Synology NAS, showing two running containers]({{ "/img/2021/06/docker-gui.png" | url }})

But for this old mainframe and Unix dinosaur, a command line interface with access to a myriad remote servers is a much more appealing prospect, and the separation of client and server executables in Docker plays to the strengths of such a setup. So I wanted to use my Docker command line interface (CLI) `docker` to interact with the resources on the Synology NAS's Docker service. Not only for the sheer convenience, but also to be able to spin up CLIs and TUIs, as remote containers, and have seamless access to them from the comfort of my local machine's command line.

## Setup steps

Here's what I did, starting from the Docker package already installed and running on the NAS.

![A screenshot of the Docker package installed on the NAS]({{ "/img/2021/06/docker-package.png" | url }})

From a command line perspective, this out of the box installation also gave me access to be able to run the `docker` client CLI while remotely logged into the NAS, but only as root, i.e. directly, or via `sudo` as shown in this example:

```
; ssh ds1621plus
administrator@ds1621plus:~$ sudo docker -v
Password:
Docker version 20.10.3, build b35e731
administrator@ds1621plus:~$ sudo docker image ls
REPOSITORY                     TAG       IMAGE ID       CREATED       SIZE
homeassistant/home-assistant   latest    832ca33fe14a   4 weeks ago   1.1GB
linuxserver/freshrss           latest    09ffc08f14fe   4 weeks ago   120MB
administrator@ds1621plus:~$
```

### Allow access as non-root user

The first thing I wanted to do is to allow myself to run the `docker` CLI as a non-root user; in my case (as in many basic Synology NAS contexts) this is the as the `administrator` user.

In the standard Docker [Post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/), there's a specific section for this: [Manage Docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user). However, due to the way that users and groups are managed in DSM, this specific approach didn't work; there was no `docker` group that had been created, to which the `administrator` user could be added, and manually adding the group wasn't the right approach either, not least because DSM doesn't sport a `groupadd` command.

In fact, there are DSM specific commands for managing local users, groups, network settings and more. They all begin `syno` and are described in the [CLI Administrator Guide for Synology NAS](https://global.download.synology.com/download/Document/Software/DeveloperGuide/Firmware/DSM/All/enu/Synology_DiskStation_Administration_CLI_Guide.pdf).

So here's what I did. I'm a check-before-and-after kind of person, so some of these steps aren't essential, but they helped me to go carefully.

#### Check docker group doesn't already exist

First, I wanted to check that I wasn't about to clobber any existing `docker` group:

```
administrator@ds1621plus:~$ grep -i docker /etc/group
administrator@ds1621plus:~$
```

Nope, no existing `docker` group, at least in the regular place.

#### Add the docker group, with the administrator user as a member

Time to create the group then, using the DSM specific command; I specified the `administrator` user to be added directly, as I did it:

```
administrator@ds1621plus:~$ sudo synogroup --add docker administrator
Group Name: [docker]
Group Type: [AUTH_LOCAL]
Group ID:   [65538]
Group Members:
0:[administrator]
```

Checking to see if the group was now listed in `/etc/group` confirmed that these DSM specific commands weren't doing anything out of the ordinary:

```
administrator@ds1621plus:~$ grep -i docker /etc/group
docker:x:65538:administrator
```

Great, the `docker` group now exists, with `administrator` as a member.

#### Change the group owner of the Docker socket

The [Manage Docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user) steps mentioned earlier showed that this is pretty much all one needs to do on a standard Docker-on-Linux install. However, there was an extra step needed on DSM, to actually assign to this new `docker` group access to the Unix socket that Docker uses.

Before I did this, I wanted to see what the standard situation was:

```
administrator@ds1621plus:~$ ls -l /var/run/ | grep docker
drwx------ 8 root         root             200 Jun 10 17:40 docker
-rw-r--r-- 1 root         root               5 Jun 10 17:40 docker.pid
srw-rw---- 1 root         root               0 Jun 10 17:40 docker.sock
```

The socket (`docker.sock`) in `/var/run/` was owned by `root` as user and `root` as group. This meant that no amount of membership of the `docker` group was going to get the `administrator` user any closer to being able to interact with Docker.

So I changed the group ownership to `docker`:

```
administrator@ds1621plus:~$ sudo chown root:docker /var/run/docker.sock
administrator@ds1621plus:~$ ls -l /var/run/ | grep docker
drwx------ 8 root         root             200 Jun 10 17:40 docker
-rw-r--r-- 1 root         root               5 Jun 10 17:40 docker.pid
srw-rw---- 1 root         docker             0 Jun 10 17:40 docker.sock
```

#### Test non-root user access

Now for the big moment. I logged out and back in again (for the new group membership to take effect) and tried a `docker` command:

```
administrator@ds1621plus:~$ logout
Connection to ds1621plus closed.
# ~
; ssh ds1621plus
administrator@ds1621plus:~$ docker image ls
REPOSITORY                     TAG       IMAGE ID       CREATED       SIZE
homeassistant/home-assistant   latest    832ca33fe14a   3 weeks ago   1.1GB
linuxserver/freshrss           latest    09ffc08f14fe   4 weeks ago   120MB
```

Success!

### Setting up SSH access and a Docker context

Now that I was able to safely interact with Docker on the NAS, I turned my attention to doing that remotely.

Elsewhere in the Docker documentation, there's [Protect the Docker daemon socket](https://docs.docker.com/engine/security/protect-access/) which has tips on using either SSH or TLS to do so. I'd already established public key based SSH access from my local machine to the NAS, and maintain SSH configuration for various hosts (which you can see in my [dotfiles](https://github.com/qmacro/dotfiles/blob/master/ssh/config)). So the SSH route was appealing to me.

The idea of this SSH access is to connect to the remote Docker service via `ssh` and run `docker` like that, remotely.

However, trying a basic connection failed at first; running a simple `ssh`-based invocation of `docker` on the remote machine (`ssh ds1621plus docker -v`) resulted in an error that ended like this:

"_Exit status 127, please make sure the URL is valid, and Docker 18.09 or later is installed on the remote host: stderr=sh: docker: command not found_"

In desperation I even tried explicit values (`ssh -l administrator -p 2222 ds1621plus docker -v`) but got the same message.

It turns out that on SSH access, the environment variables are not set the same as when you connect via `ssh` for an actual login session. Crucially, the value of the `PATH` environment variable was rather limited. Here's the entirety of the environment on an `ssh` based invocation of `env`:

```
; ssh ds1621plus env
SHELL=/bin/sh
SSH_CLIENT=192.168.86.50 54644 2222
USER=administrator
MAIL=/var/mail/administrator
PATH=/usr/bin:/bin:/usr/sbin:/sbin
PWD=/volume1/homes/administrator
SHLVL=1
HOME=/var/services/homes/administrator
LOGNAME=administrator
SSH_CONNECTION=192.168.86.50 54644 192.168.86.155 2222
_=/usr/bin/env
```

We can see that there are only four directories in the `PATH`: `/usr/bin`, `/bin`, `/usr/sbin` and `/sbin`.

On the NAS, the `docker` client executable was in `/usr/local/bin`, not in the `PATH`; this was the cause of the error above - via a simple `ssh` invocation, the `docker` command wasn't found.

So I had to address this, and I did via SSH's "user environment" feature.

#### Turn on user environment support in sshd

SSH and its implementation, on client and server, is extremely accomplished, which is code for "there's so much about SSH I don't yet know". One thing I learned about in this mini adventure is that the SSH daemon has support for "user environments", via the `.ssh/environment` file, which is described in the [FILES section of the sshd documentation](http://man.openbsd.org/sshd.8#FILES).

Basically, setting the `PATH` to include `/usr/local/bin`, via this support for user environments, was exactly what I needed. What's more, I was not having to "hack" anything on the NAS (such as copying or symbolic-linking `docker` to another place so that it would be accessible) that I might regret later.

First, though, I needed to turn on user environment support on the SSH daemon service on the NAS. For this, I uncommented `PermitUserEnvironment` in `/etc/ssh/sshd_config` and set the value to `yes`, with this result:

```
administrator@ds1621plus:~$ sudo grep PermitUserEnvironment /etc/ssh/sshd_config
PermitUserEnvironment yes
```

I then restarted the NAS; I could have messed around finding a neater way just to restart the SSH daemon, but I'd read about some other gotchas doing this, and I was the only one using the NAS at the time, so I went for it.

#### Add the location of the docker executable in the PATH variable via .ssh/environment

Now I could use the `.ssh/environment` file in the `administrator` user's home directory to set the value of the `PATH` environment variable to what I needed.

To do this, I just started a remote login session on the NAS via `ssh`, and asked `env` to tell me what this was and also write it to the `.ssh/environment` file directly:

```
; ssh ds1621plus
administrator@ds1621plus:~$ env | grep PATH | tee .ssh/environment
PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/syno/sbin:/usr/syno/bin:/usr/local/sbin:/usr/local/bin
administrator@ds1621plus:~$
```

And that was it; when running commands remotely via `ssh`, this `PATH` value was now applicable. So the remote invocation of `docker` now worked:

```
; ssh ds1621plus docker -v
Docker version 20.10.3, build b35e731
```

#### Create a Docker context

This final step was just for convenience, but worth it. With a context, I can avoid having to use `ssh` explicitly to interact with Docker on the NAS remotely.

It's described in [Use SSH to protect the Docker daemon socket](https://docs.docker.com/engine/security/protect-access/) mentioned earlier, so I'll just show here what I did.

Create the context:

```
; docker context create \
  --docker host=ssh://administrator@ds1621plus \
  --description="Synology NAS" \
  synology
```

List the contexts, and select the new `synology` context for use:

```
; docker context list
NAME                TYPE                DESCRIPTION                               DOCKER ENDPOINT                  KUBERNETES ENDPOINT                                                     ORCHESTRATOR
default *           moby                Current DOCKER_HOST based configuration   unix:///var/run/docker.sock      https://api.c-681fdc3.kyma.shoot.live.k8s-hana.ondemand.com (default)   swarm
synology            moby                Synology NAS                              ssh://administrator@ds1621plus
# ~
; docker context use synology
synology
# ~
; docker image ls
REPOSITORY                     TAG       IMAGE ID       CREATED       SIZE
homeassistant/home-assistant   latest    832ca33fe14a   4 weeks ago   1.1GB
linuxserver/freshrss           latest    09ffc08f14fe   4 weeks ago   120MB
```

Note that last command `docker image ls`; I invoked that on my client machine, but because of the context set, and the SSH based connection set up, the target was the Docker engine running on the Synology NAS. Success!

## References

Here's what I read to find my way through this. Documents referenced in this post are also included here.

- [Protect the Docker daemon socket](https://docs.docker.com/engine/security/protect-access/)
- [Feature request: add driver for Synology](https://github.com/docker/machine/issues/1200)
- [Remote Docker version not detected correctly](https://github.com/microsoft/vscode-remote-release/issues/3748)
- [Permission for User to run Docker?](https://www.synoforum.com/threads/permissions-for-user-to-run-docker.3536/)
- [CLI Administrator Guide for Synology NAS](https://global.download.synology.com/download/Document/Software/DeveloperGuide/Firmware/DSM/All/enu/Synology_DiskStation_Administration_CLI_Guide.pdf)
- [OpenBSD manual page server for sshd](http://man.openbsd.org/sshd.8)
