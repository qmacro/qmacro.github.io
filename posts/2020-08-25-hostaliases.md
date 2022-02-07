---
layout: post
title: You can mask sensitive hostnames with wildcards and host aliases
tags:
  - autodidactics
  - ssh
---

_The HOSTALIASES feature works well when combined with wildcard host definitions in SSH config_

I run my own DNS locally via Pi-hole, but I also like to have SSH configuration to specify various options depending on the hosts I'm remotely connecting to. Usually it's the username to use, sometimes it's whether I want to do X11 forwarding, and so on.

# Problem

My work machines have very odd and hard to remember hostnames. I could use the SSH configuration feature (via the `.ssh/config` file) to get around this, like this:

```
Host easy
    HostName hard-to-remember
    User username-to-use
```

Then I could just remotely connect to that `hard-to-remember` host machine like this:

```
ssh easy
```

(As a bonus, having securely shared public key credentials with `ssh-copy-id` beforehand makes this process even smoother.)

But I don't want to expose those `hard-to-remember` work machine hostnames in the configuration.

# Hello HOSTALIASES

I learned today about the `HOSTALIASES` environment variable which is supported by `glibc`'s resolver function `gethostbyname()`. Pointing `HOSTALIASES` to a file of "aliasname realname" pairs of hostnames means that commands that use `gethostbyname()` to resolve hostnames can be given alias hostnames instead of real hostnames. The `ssh` command uses that function.

# Solution

This is what I did:

First, I created a file `host.aliases` (making sure not to check this file into a git repo, by adding the file name to `.gitignore`) with content like this:

```
oldmbp realsecrethostname1
newmbp anothersecretworkhostname
```

Then, in my `.bashrc`, I set the `HOSTALIASES` environment variable to point to this file:

```
export HOSTALIASES="$HOME/.dotfiles/host.aliases"
```

Finally, I modified the contents of my `.ssh/config` file to use wildcards matching the aliases:

```
Host *mbp
    User username-to-use
```

That way I can use easy and memorable hostnames when connecting to my work machines (e.g. `ssh oldmbp`) without exposing the hostnames in any public configuration.
