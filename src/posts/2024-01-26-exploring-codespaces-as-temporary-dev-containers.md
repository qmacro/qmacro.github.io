---
layout: post
title: Exploring codespaces as temporary dev containers
date: 2024-01-26
tags:
  - devcontainer
  - codespaces
  - containers
  - gh
  - github
  - cli
---
Codespaces seem to be at the intersection of a number of things I'm interested in, including containers in general, dev containers in particular, ephemeral environments, the command line, thin clients and remote servers, SSH, the GitHub CLI, and more.

I had a task to complete this morning that involved managing some changes to a large repo on GitHub, and my Internet connection where I am right now was not conducive for cloning the repo, given its size. So I thought I'd try out doing it in a GitHub codespace, which would have much better connectivity to the rest of the Internet and to which I'd only need a thin connection for my actual remote terminal session.

While most folks will likely manage, access and use codespaces directly on the Web, or remotely via VS Code and the [GitHub Codespaces extension](https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces), they're also available directly from the command line, i.e. you can attach to the container via SSH. And that's what I wanted to do.

I thought I'd document my exploratory journey here, mostly for my future self. The basis for the exploration was this resource: [Using GitHub Codespaces with GitHub CLI](https://docs.github.com/en/codespaces/developing-in-a-codespace/using-github-codespaces-with-github-cli), which describes using the GitHub CLI (`gh`), with the new command `codespace`, which has various subcommands:

```shell
; gh codespace
Connect to and manage codespaces

USAGE
  gh codespace [flags]

AVAILABLE COMMANDS
  code:        Open a codespace in Visual Studio Code
  cp:          Copy files between local and remote file systems
  create:      Create a codespace
  delete:      Delete codespaces
  edit:        Edit a codespace
  jupyter:     Open a codespace in JupyterLab
  list:        List codespaces
  logs:        Access codespace logs
  ports:       List ports in a codespace
  rebuild:     Rebuild a codespace
  ssh:         SSH into a codespace
  stop:        Stop a running codespace
  view:        View details about a codespace

INHERITED FLAGS
  --help   Show help for command

LEARN MORE
  Use `gh <command> <subcommand> --help` for more information about a command.
  Read the manual at https://cli.github.com/manual
```

> I'm a big fan of the GitHub CLI. It has some great interactive features, so you can invoke a command, supplying little to no parameter information, and it will prompt you interactively as required. But here I wanted to be able to invoke each command completely, with values for all appropriate parameters.

## Creating a repo

Codespaces seem to be primarily repo specific (although it looks like they can be org-wide too), so in order to be able to create a new codespace in this experiment I first created a new repo, adding a README as I think I saw somewhere that you can't create a codespace based on a completely empty repo (which sort of makes sense):

```shell
; gh repo create --add-readme --public codespacetest
✓ Created repository qmacro/codespacetest on GitHub
```

## Creating a codespace

Now I can think about creating a codespace. In addition to the repo with which the codespace should be associated, I need to specify the machine type. I could of course fall back to the comfortable UI in the CLI:

```shell
; gh codespace create --repo qmacro/codespacetest
  ✓ Codespaces usage for this repository is paid for by qmacro
? Choose Machine Type:  [Use arrows to move, type to filter]
> 2 cores, 8 GB RAM, 32 GB storage
  4 cores, 16 GB RAM, 32 GB storage
  8 cores, 32 GB RAM, 64 GB storage
  16 cores, 64 GB RAM, 128 GB storage
```

but I wanted to be able to use the `--machine` parameter directly. But for that I needed to know what value to specify for that parameter.

With the [Codespace Machines](https://docs.github.com/en/rest/codespaces/machines?apiVersion=2022-11-28) section of the GitHub API, I can find this out.

Making this call (note the API path includes the repo specification, underlining that relationship I mentioned earlier):

```shell
; gh api /repos/qmacro/codespacetest/codespaces/machines
```

returns this JSON dataset:

```json
{
  "machines": [
    {
      "name": "basicLinux32gb",
      "display_name": "2 cores, 8 GB RAM, 32 GB storage",
      "operating_system": "linux",
      "storage_in_bytes": 34359738368,
      "memory_in_bytes": 8589934592,
      "cpus": 2,
      "prebuild_availability": null
    },
    {
      "name": "standardLinux32gb",
      "display_name": "4 cores, 16 GB RAM, 32 GB storage",
      "operating_system": "linux",
      "storage_in_bytes": 34359738368,
      "memory_in_bytes": 17179869184,
      "cpus": 4,
      "prebuild_availability": null
    },
    {
      "name": "premiumLinux",
      "display_name": "8 cores, 32 GB RAM, 64 GB storage",
      "operating_system": "linux",
      "storage_in_bytes": 68719476736,
      "memory_in_bytes": 34359738368,
      "cpus": 8,
      "prebuild_availability": null
    },
    {
      "name": "largePremiumLinux",
      "display_name": "16 cores, 64 GB RAM, 128 GB storage",
      "operating_system": "linux",
      "storage_in_bytes": 137438953472,
      "memory_in_bytes": 68719476736,
      "cpus": 16,
      "prebuild_availability": null
    }
  ],
  "total_count": 4
}
```

I decided on a minimal footprint codespace with `basicLinux32gb` and also specified that it should be deleted soon (1h) after being shut down, and it was created in a matter of seconds:

```shell
; gh codespace create \
  --repo qmacro/codespacetest \
  --machine basicLinux32gb \
  --retention-period 1h
  ✓ Codespaces usage for this repository is paid for by qmacro
potential-space-pancake-g4x4j75vg2vr42
```

And there it is:

```shell
; gh codespace list
NAME             DISPLAY NAME  REPOSITORY    BRANCH  STATE      CREATED AT
potential-sp...  potential...  qmacro/co...  main    Available  about 4 m...
```

### A note on default container image definitions

A codespace is essentially a dev container, and there's a default image from which such dev containers are instantiated when a codespace is summoned into being. It's possible to specify a different definition via a custom `devcontainer.json` definition to which you can point via the `--devcontainer-path` option for the `gh codespace create` invocation, but I didn't do that here.

One of the reasons I didn't do that is I wanted to take the happy and simple path. Another reason though was what I read in the [SSH into a codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/using-github-codespaces-with-github-cli#ssh-into-a-codespace) section of the aforementioned document (bold emphasis mine):

> Note: The codespace you connect to must be running an SSH server. **The default dev container image includes an SSH server, which is started automatically**. If your codespaces are not created from the default image, you can install and start an SSH server by adding the following to the `features` object in your `devcontainer.json` file:
>
>   ```json
>   "features": {
>       // ...
>       "ghcr.io/devcontainers/features/sshd:1": {
>           "version": "latest"
>       },
>       // ...
>   }
>   ```

## Connecting to the codespace

OK, now to connect, using the `ssh` subcommand of `gh`'s `codespace` command.

First, what's the full name of the codespace?

```shell
; gh codespace list --json name
[
  {
    "name": "potential-space-pancake-g4x4j75vg2vr42"
  }
]
```

OK, let me save that for future reference in this shell session ...

```shell
; export CODESPACE=$(gh codespace list --json name --jq first.name)
```

... and now connect:

```shell
; gh codespace ssh --codespace $CODESPACE
Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 6.2.0-1018-azure x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

@qmacro ➜ /workspaces/codespacetest (main) $
```

Well that was easy!

## Exploring the codespace

I feel immediately at home, for a number of reasons. First, the basics:

```shell
@qmacro ➜ /workspaces/codespacetest (main) $ echo $SHELL; uname -a; cat /etc/lsb-release
/bin/bash
Linux codespaces-30d4d8 6.2.0-1018-azure #18~22.04.1-Ubuntu SMP Tue Nov 21 19:25:02 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=20.04
DISTRIB_CODENAME=focal
DISTRIB_DESCRIPTION="Ubuntu 20.04.6 LTS"
@qmacro ➜ /workspaces/codespacetest (main) $
```

Second, the repo is available in a familiar place, in a `/workspaces/` directory, following the pattern we see in VS Code when opening a container, for example.

Third, there are familiar and useful tools that I use every day:

```shell
@qmacro ➜ /workspaces/codespacetest (main) $ type vi gh jq git curl
vi is /usr/bin/vi
gh is /usr/bin/gh
jq is /usr/bin/jq
git is /usr/local/bin/git
curl is /usr/bin/curl
```

So the container (err, codespace) has `gh`? I wonder if ...

```shell
@qmacro ➜ /workspaces/codespacetest (main) $ echo $GITHUB_TOKEN
ghu_gVPiEjCkhwDgr[...]
```

Yes!

Nice - looks like it's time to explore! I can issue a `gh codespace stop` (and `gh codespace delete` if I don't want to wait that 1h I specified earlier) when I'm done.

## Further reading

You may also be interested in [Developing CAP in containers - three ways](blog/posts/2024/01/15/developing-cap-in-containers-three-ways/) and also the general [containers tag](/tags/containers). And of course, you should visit [containers.dev](https://containers.dev) for much more on this area.

---

A note on capitalisation of "codespace". While the product name is "GitHub Codespaces" where the word is plural and capitalised, GitHub documentation refers to codespaces themselves with a lowercase "c", so I have tried to do that too here.
