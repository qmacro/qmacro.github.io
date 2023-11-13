---
layout: post
title: Tmux plugin development with a local repo
date: 2023-11-13
tags:
  - tmux
  - git
---
This weekend I wrote a simple Tmux plugin, [tmux-focus-status](https://github.com/qmacro/tmux-focus-status), mostly to learn how to do it, but also to modularise my Tmux configuration (perhaps organising chunks of configuration into plugins is a little extreme, ah well).

The way you add a plugin to your Tmux configuration requires you to specify a remote git repository, such as on GitHub or BitBucket. This would mean I'd have to push my fledgling plugin to GitHub to test it out in the context of Tmux itself, but I wanted to keep everything local while I developed it. So I used a bare repository on the local filesystem. Here's how.

The plugins are managed by [Tmux Plugin Manager](https://github.com/tmux-plugins/tpm) (TPM) and there's a great document on how to create a plugin here: [How to create Tmux plugins](https://github.com/tmux-plugins/tpm/blob/master/docs/how_to_create_plugin.md).

While the plugin itself is essentially a script that uses `tmux` commands, including the plugin into your configuration and testing the installation and use in a real session means that you have to have the plugin code in a remote repository. The examples [in the main TPM README imply this](https://github.com/tmux-plugins/tpm#installation):

```text
set -g @plugin 'github_username/plugin_name'
set -g @plugin 'github_username/plugin_name#branch'
set -g @plugin 'git@github.com:user/plugin'
set -g @plugin 'git@bitbucket.com:user/plugin'
```

Nothing wrong with that at all, but I wanted to get the plugin right before pushing it anywhere like GitHub. So I remembered that you can initialise a repository with the `--bare` option (see the ["Bare Repositories" section in this document](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-init)), and this will effectively create a shared repository that can be used as a remote.

I was developing the plugin in a directory called:

```text
~/work/scratch/tmux-focus-status/
```

and had run `git init` in there, and committed my work.

I then created a bare repository with the `--bare` option, like this:

```shell
cd ~/work/remotes/
git init --bare tmux-focus-status.git
```

> The convention is to add the `.git` ending to repositories initialised like this.

Then I set up this location as a remote in my plugin directory:

```shell
cd ~/work/scratch/tmux-focus-status/
git remote add local ~/work/remotes/tmux-focus-status.git
```

> Calling the remote `local` might seem a little counter-intuitive, but it works for my brain.

Having pushed the work to that remote:

```shell
cd ~/work/scratch/tmux-focus-status/
git push local main
```

I could then reference that local filesystem remote in my Tmux configuration, alongside my other plugin lines, like this:

```text
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'christoomey/vim-tmux-navigator'
set -g @plugin '/root/work/remotes/tmux-focus-status.git'
```

> I was doing this in a temporary dev container hence the `/root` home directory.

And on invoking the TPM "install" function (with `<prefix> I`, see the [keybindings](https://github.com/tmux-plugins/tpm#key-bindings) info), the plugin was successfully installed:

```text
Already installed "tpm"
Already installed "tmux-sensible"
Already installed "vim-tmux-navigator"
Installing "tmux-focus-status"
  "tmux-focus-status" download success

TMUX environment reloaded.

Done, press ESCAPE to continue.
```

Excellent!

This is also nicely summarised in [How to use local filesystem remotes with git](https://thehorrors.org.uk/snippets/git-local-filesystem-remotes/) which I found helpful.
