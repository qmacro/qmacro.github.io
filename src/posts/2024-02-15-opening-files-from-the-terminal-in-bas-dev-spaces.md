---
layout: post
title: Opening files from the terminal in BAS dev spaces
date: 2024-02-15
tags:
  - sap
  - business-application-studio
  - vscode
---
In the comments to [episode 4 of our back to basics series of live stream episodes on CAP, on the Hands-on SAP Dev show](https://www.youtube.com/watch?v=1ywiOaGVA5w), there was a question on my use of `code` in VS Code, which, when invoked in the terminal (e.g. `code services.cds`) opens the file directly in a VS Code editor window, like this:

![opening a file from the terminal in VS Code](/images/2024/02/vscode-open-file.gif)

The question was about `code` being recognised in SAP Business Application Studio (BAS) dev spaces.

Basically, while `code` is not a command that's available in dev spaces, there's a BAS-specific command `basctl` which has a couple of options, one of which is `--open`. Here are some examples, taken from the usage text:

```text
Examples
  $ basctl --open http://sap.com
  $ basctl --open http://localhost:8082/tmp
  $ basctl --open file:///home/user/projects/proj1/myfile.txt
  $ basctl --open /myfile.txt
  $ basctl --open ./myfolder/myfile.txt
```

So while there isn't a `code` command, you can use `basctl --open` to get something similar. I say similar, because for some reason I cannot yet fathom (my small brain, again) it opens the file in a new column. Anyway, here's what it looks like in action:

![opening a file from the terminal in a BAS dev space](/images/2024/02/basctl-open-file.gif)

(I've asked internally about this behaviour, and will update this blog post with anything I find out.)

The nice thing about what `basctl` offers perhaps is the ability to invoke framework commands, via an additional `--command` option, like this: `basctl --command workbench.action.openSettings`.

The question also asked about my use of `tree`, and noted its lack of availability in BAS dev spaces. This is simple to address, if not entirely straightforward. I got `tree` working in my dev space, as you can see:

![tree running in my BAS dev space](/images/2024/02/tree-in-bas-dev-space.png)

I did this by copying in a `tree` binary (and ensuring the execution bit was set). Where did I get that `tree` binary from? Well, first, I looked what the architecture of the dev spaces was, via `uname` (I've added whitespace for readability):

```shell
user: user $ uname -a
Linux workspaces-ws-nvzxc-deployment-9f9b9b656-sfdh5
5.15.135-gardenlinux-cloud-amd64 
SMP Debian 5.15.135-0gardenlinux1 (2023-10-12)
x86_64 GNU/Linux
```

I also checked what distribution the environment was based on:

```shell
user: user $ cat /etc/issue
Debian GNU/Linux 12 \n \l
```
Basically, it's Debian 12 on x86_64 architecture. Classic. So then I created a quick container from a Debian 12 based container image, via a [codespace](/blog/posts/2024/01/26/exploring-codespaces-as-temporary-dev-containers/) that I spun up for the purpose, and copied the `tree` binary out of there to my local filesystem, like this:

```shell
gh codespace cp 'remote:/usr/bin/tree' .
```

I then copied that binary to the dev space by dragging it into the Explorer window, and then set the execution bit with `chmod +x $HOME/tree`.

Job done!

