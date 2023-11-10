---
layout: post
title: TIL - Two Tmux Plugin Manager features
date: 2023-11-10
tags:
  - tmux
  - til
---
I'm revisiting my working environment setup and configuration, which comprises, at its core, Bash, (Neo)vim and Tmux. This is essentially my IDE, or, to use a term I learned from [TJ DeVries](https://github.com/tjdevries), my [Personalised Development Environment](https://www.youtube.com/watch?v=QMVIJhC9Veg) (PDE).

Anyway, while I've used Tmux for a long time, I've never really used a plugin manager, so this week I took a look at [Tmux Plugin Manager](https://github.com/tmux-plugins/tpm). It worked really nicely out of the box, but there were a couple of things I wanted to sort out for my particular setup.

The short video [Tmux has forever changed the way I write code](https://www.youtube.com/watch?v=DzNmUNvnB04) has a nice overview of Tmux configuration, including the use of plugins with TPM, which I'll use here as an example. The relevant configuration in `tmux.conf` looks like this, defining three plugins (well, two plus TPM itself):

```text
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'christoomey/vim-tmux-navigator'

run '~/.config/tmux/plugins/tpm/tpm'
```

The TPM command to install the plugins defined in your configuration is `<prefix> I`, where `<prefix>` is of course the Tmux prefix key, which in my case is `Ctrl-space`. Invoking this causes the plugins listed in the configuration to be installed, followed by status output that looks like this:

```text
Already installed "tpm"
Installing "tmux-sensible"
  "tmux-sensible" download success
Installing "vim-tmux-navigator"
  "vim-tmux-navigator" download success

TMUX environment reloaded.

Done, press ESCAPE to continue.
```

## Pre-installing the plugins

I don't do much at the native OS level of my laptop (which runs macOS); instead, I work in a Linux-based [dev container](https://github.com/qmacro/dotfiles/tree/main/devcontainer). My PDE is essentially a Docker image, from which I create my working environment, usually just a single container, which, when it starts up, runs `tmux`. 

So when I build my image, I'd like to have the Tmux plugins pre-installed, rather than have to go through a manual setup i.e. have to use `<prefix> I` when I jump into the container for the first time.

After a bit of digging, I found that I can do this by running the `bin/install_plugins` script which is part of TPM.

So here's a simplified extract of my dev container's Dockerfile definition (ignore the use of the root user here, this is from a testing image setup):

```dockerfile
ARG SETUPDIR=/tmp/setup
ARG CONFDIR=/root/.config

# Basic setup
RUN mkdir $CONFDIR 
RUN mkdir $SETUPDIR

# Tmux
ARG TMUXVER=3.3a
RUN cd $SETUPDIR \
    && curl -fsSL "https://github.com/tmux/tmux/releases/download/$TMUXVER/tmux-$TMUXVER.tar.gz" \
    | tar -xzf - \
    && cd "tmux-$TMUXVER" && ./configure && make && make install

# Tmux config, including plugins
RUN mkdir $CONFDIR/tmux \
    && git clone https://github.com/tmux-plugins/tpm ~/.config/tmux/plugins/tpm
COPY tmux.conf $CONFDIR/tmux/
RUN $CONFDIR/tmux/plugins/tpm/bin/install_plugins

# Off we go
CMD ["tmux"]
```

My basic Tmux config is copied to the configuration directory (`COPY tmux.conf $CONFDIR/tmux/`) and then the TPM `bin/install_plugins` script is executed.

When I enter the container, and find myself in a new Tmux session (thanks to `CMD ["tmux"]`), all the plugins are already installed. Nice!

## Invoking plugin management functions

TPM has a small number of [key bindings for plugin management](https://github.com/tmux-plugins/tpm#key-bindings). The default key binding for uninstalling plugins that you've removed from the list in your configuration is `<prefix> + alt + u`. 

My daily driver is an Apple MacBook Air. One of the (many) "interesting" features of MacBook keyboards, at least with some sort of English layout, is that you can't easily type a `#` character. Which is especially frustrating as a developer. To get a `#` character you have to use `Option-3` which is frankly ridiculous, but I've got used to it over the years. 

Anyway, the Option key is the Alt (or Meta) key which means that in order to use `<prefix> + alt + u` on this keyboard, I would have to change the terminal settings for the Option key, for it to act as a proper Alt key. But then I wouldn't be able to type `#` characters. 

Instead, again after a bit of digging, I found that you can change these default key bindings. They're actually defined in a [variables.sh](https://github.com/tmux-plugins/tpm/blob/master/scripts/variables.sh) file:

```shell
install_key_option="@tpm-install"
default_install_key="I"

update_key_option="@tpm-update"
default_update_key="U"

clean_key_option="@tpm-clean"
default_clean_key="M-u"

SUPPORTED_TMUX_VERSION="1.9"

DEFAULT_TPM_ENV_VAR_NAME="TMUX_PLUGIN_MANAGER_PATH"
DEFAULT_TPM_PATH="$HOME/.tmux/plugins/"
```

This allows me to add a line to my `tmux.conf` file to change the binding for the "clean" option (to uninstall plugins) to something different. I chose `K` for "(K)lean" (as hitting "C" after the Tmux prefix key is a common action to create a new window):

```text
set -g @tpm-clean 'K'
```

Now I can uninstall plugins that I've removed from my configuration with `<prefix> K`. Here's an example of the uninstall status output, after I removed the line specifying the `christoomey/vim-tmux-navigator` plugin from my `tmux.conf` file and then hit `<prefix> K`:

```text
Removing "vim-tmux-navigator"
  "vim-tmux-navigator" clean success

TMUX environment reloaded.

Done, press ESCAPE to continue.
```

That's neat. I'll be embracing TPM from now on.
