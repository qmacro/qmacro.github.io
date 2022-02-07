---
layout: post
title: Using functions more
tags:
  - autodidactics
  - shell
---

_Using functions more in my shell seems to bring benefits. Here's an example._

Bash functions seem to sit in a sweet spot between aliases and full blown scripts. I've defined a number of functions in my dotfiles which are all useful. Unlike aliases, they can take parameters and have greater scope for doing things; unlike scripts, they run in the context of the current shell which means, for example, that I can set a value in a variable during the course of a function's execution and it's available directly afterwards, in the same shell session.

Anyway, in the context of thinking about functions more, I decided to write a "wrapper" around one of the CLI tools I'm using a lot at the moment, the btp CLI, i.e. the command line tool for administration of resources and services on the SAP Business Technology Platform (BTP). If you want to learn more about the btp CLI and, indirectly, about BTP, have a look at the corresponding SAP Tech Bytes series of blog posts, starting with [SAP Tech Bytes: btp CLI - installation](https://blogs.sap.com/2021/09/01/sap-tech-bytes-btp-cli-installation/), and [the associated branch in the SAP Tech Bytes repo on GitHub](https://github.com/SAP-samples/sap-tech-bytes/tree/2021-09-01-btp-cli).

The btp CLI, like other tools that manage cloud-based resources, is quite verbose in its output; partly because it needs to impart a lot of information, and partly because cloud resources, being "cattle, not pets", have identities that are more likely to be long GUIDs than short human-friendly names. For more on this, see this post in my [Monday morning thoughts](https://blogs.sap.com/tag/mondaymorningthoughts/) series: [A cloud-native smell](https://blogs.sap.com/2018/04/09/monday-morning-thoughts-a-cloud-native-smell/).

So when invoking the btp CLI with an action to look at the hierarchy of directories and subaccounts in a global account, the output tends to wrap around, like this:

![hierarchy information, wrapped]({{ "/img/2021/09/hierarchy-wrapped.png" | url}})

But with a simple wrapper function, I can have this a lot cleaner; granted, if there's something at the end of the long lines that I'm interested in, then I won't be able to use this, but it's usually information at the start of the lines that's important to me.

Here's a wrapper function for the btp CLI that I've just started to use:

```bash
btp ()
{
    if [[ $1 =~ ^(get|list)$ ]]; then
        "$HOME/bin/btp" "$@" | trunc
    else
        "$HOME/bin/btp" "$@"
    fi
}
```

When I use `btp` to display information, with the `get` or `list` actions, this will run the real btp CLI, passing it whatever arguments I passed to the function (i.e. in `$@`), piping the output to the `cut` command where I use the `-c` option to tell it to only output characters from column 1, up to however many columns the current terminal has (which can be determined with `tput cols`).

> For those of you who are #HandsOnSAPDev pioneers, you may recognise this, as we encapsulated `cut -c 1-$(tput cols)` as `trunc`.

Now, running that same command, the output looks like this:

![hierarchy information, clean]({{ "/img/2021/09/hierarchy-clean.png" | url}})

It's early days, but I quite like the way I can use the power of functions like this.
