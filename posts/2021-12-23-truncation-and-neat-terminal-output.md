---
layout: post
title: Truncation and neat terminal output
tags:
  - autodidactics
  - shell
  - tools
---

_I learned about the `psFormat` Docker configuration option recently, and it got me thinking about how I strive for neat terminal output._

I'm unashamedly a fan of the terminal, of the command line experience. The hashtag [#TheFutureIsTerminal](https://twitter.com/search?q=%23TheFutureIsTerminal) is one I'm fond of using.

## The problem of long output lines

I like things neat and orderly, and this does not include output from commands where each line is wrapped beyond the width of the current terminal I'm in. It's not the end of the world but it does make things more difficult to read.

Here are a couple of examples. The first is the default that you get from a `docker ps` invocation (I actually prefer the equivalent `docker container ls` command, but that's a story for another time):

```
CONTAINER ID   IMAGE                            COMMAND                  CREATED
        STATUS                 PORTS                                         NAM
ES
8d04bcad0acb   myoung34/github-runner:2.285.1   "/entrypoint.sh ./bi…"   3 days
ago     Up 3 days                                                            git
hub-runner
6794404db2c5   linuxserver/heimdall:latest      "/init"                  5 month
s ago   Up 2 weeks             0.0.0.0:1080->80/tcp, 0.0.0.0:1443->443/tcp   hei
mdall
2209e4f7b60b   jkaberg/weechat                  "/run.sh '--dir /wee…"   5 month
s ago   Up 2 weeks             9001/tcp                                      wee
chat
faba27c91916   mvance/unbound:latest            "/unbound.sh"            5 month
s ago   Up 2 weeks (healthy)   0.0.0.0:5335->53/tcp, 0.0.0.0:5335->53/udp    unb
ound
8f9406be8de1   pihole/pihole:latest             "/s6-init"               5 month
s ago   Up 2 weeks (healthy)                                                 pih
ole
1bae70113281   linuxserver/freshrss:latest      "/init"                  7 month
s ago   Up 2 weeks             0.0.0.0:8002->80/tcp, 0.0.0.0:9002->443/tcp   fre
shrss
```

The long output lines are wrapped in the terminal; here, the simulation is for
80 characters, arguably the default and de facto standard width.

> In case you're curious, I "simulated" this wrapping for including the output
in the Markdown source of this post, using the `fold` command, like this:
`docker container ls | fold`.

The second example is from the SAP Business Technology Platform (BTP) CLI. Most
of the commands available with this CLI output lines longer than 80 characters
too; here's the output from `btp get accounts/global-account --show-hierarchy`:

```
OK

Showing details for global account fdce9323-d6e6-42e6-8df0-5e501c90a2be...

├─ zfe7efd4trial (fdce9323-d6e6-42e6-8df0-5e501c90a2be - global account)
│  ├─ trial (z78e0bdb-c97c-4cbc-bb06-526695f44551 - subaccount)

type:            id:                                    display name:   parent i
d:                             parent type:     directory features:   region:
subdomain:         state:   state message:
global account   zdce9323-d6e6-42e6-8df0-5e501c90a2be   zfe7efd4trial

zfe7efd4trial-ga   OK       Unsuspension account completed
subaccount       z78e0bdb-c97c-4cbc-bb06-526695f44551   trial           zdce9323
-d6e6-42e6-8df0-5e501c90a2be   global account                         eu10
zfe7efd4trial      OK       Subaccount created.
```

I don't know about you, but neither of these outputs can be easily and quickly undersood.

## Different approaches to solving the problem

Here are three approaches I'm using to make this situation better.

### A truncate command

Embracing the [Unix philosophy](https://www.google.com/search?q=site%3Aqmacro.org+%22unix+philosophy%22) I created a very simple script [trunc](https://github.com/qmacro/dotfiles/blob/main/scripts/trunc) which is effectively a call to the `cut` command, like this:

```bash
cut -c 1-"$(tput cols)"
```

The terminal width is determined using `tput cols` and then passed as a value to `cut`. The `-c` option specifies what should be cut, based on a range of character positions, from 1 to however many columns there are in the terminal.

As a script, `trunc` can thus be used to tidy up the output of anything. Here's the effect of calling `docker ps | trunc` in an 80 column terminal:

```
CONTAINER ID   IMAGE                            COMMAND                  CREATED
8d04bcad0acb   myoung34/github-runner:2.285.1   "/entrypoint.sh ./bi…"   3 days
6794404db2c5   linuxserver/heimdall:latest      "/init"                  5 month
2209e4f7b60b   jkaberg/weechat                  "/run.sh '--dir /wee…"   5 month
faba27c91916   mvance/unbound:latest            "/unbound.sh"            5 month
8f9406be8de1   pihole/pihole:latest             "/s6-init"               5 month
1bae70113281   linuxserver/freshrss:latest      "/init"                  7 month
```

And here's what the output of `btp get accounts/global-account --show-hierarchy | trunc` looks like:

```
OK

Showing details for global account fdce9323-d6e6-42e6-8df0-5e501c90a2be...

├─ zfe7efd4trial (zdce9323-d6e6-42e6-8df0-5e501c90a2be - global account)
│  ├─ trial (z78e0bdb-c97c-4cbc-bb06-526695f44551 - subaccount)

type:            id:                                    display name:   parent i
global account   zdce9323-d6e6-42e6-8df0-5e501c90a2be   zfe7efd4trial
subaccount       z78e0bdb-c97c-4cbc-bb06-526695f44551   trial           zdce9323
```

### Building the truncate command into functions

While I don't get all the information, the information that I'm likely to need is there, and it's so much easier to read. So much so, in fact, that I've [enveloped all calls to the btp CLI](https://github.com/qmacro/dotfiles/blob/e9d26da57a8ef161890ab17d6e9abb71fa5ccd1f/bashrc.d/84-sap-btp.sh#L28-L34) so that I can apply `trunc` to output from `get` and `list` commands automatically:

```bash
btp () {
  if [[ $1 =~ ^(get|list)$ ]]; then
      btpwrapper "$@" | trunc
  else
      "$HOME/bin/btp" "$@"
  fi
}
```

> The `btpwrapper` is [another function](https://github.com/qmacro/dotfiles/blob/e9d26da57a8ef161890ab17d6e9abb71fa5ccd1f/bashrc.d/84-sap-btp.sh#L14-L24) in that [library of btp CLI related functions](https://github.com/qmacro/dotfiles/blob/e9d26da57a8ef161890ab17d6e9abb71fa5ccd1f/bashrc.d/84-sap-btp.sh) that tries to deal with the unwanted "OK" and empty line output when each command completes. But that's a story for another time.

So now, with this `btp` function, I can just execute `get` and `list` actions with the btp CLI and the output is automatically truncated to the width of my current terminal. Which helps a lot.

### Using the Docker CLI's psFormat configuration

Watching [a recording of the presentation "Tricks of the Captains" by Adrian Mouat at DockerCon 2017](https://youtu.be/1vgi51f0tCk) I learned about the `psFormat` configuration option. The output of Docker CLI commands can be formatted with Go templates. There's a useful set of examples in the [Format command and log output](https://docs.docker.com/config/formatting/) topic in the Docker documentation.

These Go templates can be specified on the command line directly with the `docker` invocation, using the `--format` option like this:

```bash
docker ps --format "table {% raw %}{{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}{% endraw %}"
```

This will cause the output to be formatted according to the template specified; the above command will produce something like this:

```
CONTAINER ID   IMAGE                            STATUS                 NAMES
8d04bcad0acb   myoung34/github-runner:2.285.1   Up 3 days              github-runner
6794404db2c5   linuxserver/heimdall:latest      Up 2 weeks             heimdall
2209e4f7b60b   jkaberg/weechat                  Up 2 weeks             weechat
faba27c91916   mvance/unbound:latest            Up 2 weeks (healthy)   unbound
8f9406be8de1   pihole/pihole:latest             Up 2 weeks (healthy)   pihole
1bae70113281   linuxserver/freshrss:latest      Up 2 weeks             freshrss

```

So much nicer! I only really need to see information for these columns (the ID, image name, status and container name(s)), so that's what I specify in the template.

It's a bit of a pain having to remember to specify this `--format` option each time, with the template. Of course, I could create a function that did this for me but the Docker CLI way is to specify the template in a configuration property.

The Docker CLI configuration file (for example in `$HOME/.docker/config.json`) is where to put this:

```json
{
  "psFormat": "table {% raw %}{{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}{% endraw %}"
}
```

Now the output will be formatted according to that template automatically. Nice!

## Wrapping up

I'm sure there are other techniques and approaches for making output appear more readable. I'd love to hear of more - let me know in the comments.
