---
layout: post
title: Developing CAP in containers - three ways
date: 2024-01-12
tags:
  - containers
  - devcontainer
  - cap
  - vscode
  - linux
  - github
  - bas
---
This morning we had the first Hands-on SAP Dev live stream of 2024, and it was the first episode in a new "back to basics" series on the SAP Cloud Application Programming Model (or CAP, to us humans), specifically with Node.js.

[![Back to basics with SAP CAP live stream episode 1 thumbnail](/images/2024/01/capb2b-1-thumbnail.png)](https://www.youtube.com/watch?v=gu5r1EWSDSU)

<https://www.youtube.com/watch?v=gu5r1EWSDSU>

## Background

In it I described what's required for local development, following the guide in the [Jumpstart Development section of Capire](https://cap.cloud.sap/docs/get-started/jumpstart) ("Capire" is the friendly name given to the CAP documentation). Over the years I've gone through many laptop and desktop machines, with different operating systems, and installed plenty of tools. Up until recently I've also fairly regularly wiped the operating system completely on those machines and reinstalled everything, or at least reinstalled the tools that I still needed. This was because over time my machines got full of cruft and slowed me down, because I didn't always have the right version of, say, Python, or I needed to run multiple different versions of Node.js\*, or something that I'd previously installed was preventing the install of something new that I needed.

\* Yes I know about tools like [nvm](https://github.com/nvm-sh/nvm), and similar ones for managing multiple versions of other languages and tools, and I've used many of them. But they have always felt like a sticking plaster, rather than a solution. While I'm on this aside, I came across [asdf](https://github.com/asdf-vm/asdf) recently which goes one step further in an attempt to be "one version manager to rule them all". But I'm still only half convinced.

Bottom line is that as I move from project to project, from one tool requirement to another, from one language or language version to another, there's inevitably a wake of install froth, a trail of untidy and unwanted software on my machine. There has to be a better way.

That better way is dev containers.

Working inside a dev container gives me everything I need in a concise package, that I can turn on and off, start up and shut down, mess up and recreate, and share with others so that they have exactly the same environment (and versions of tools and runtimes) as me. What's more, while in most folks' ideal scenario, those dev containers run on their local machine, they're independent of the local machine, and also I often run dev containers on remote machines and connect to them from my local machine.

Put simply, developing in a dev container is a great way to:

* get started with a ready-made set of tools exactly for the job
* avoid getting distracted by the often challenging requirements of tool installing
* use a focused environment without disturbing anything on your local (host) machine
* experiment and risk breaking everything, because you can start again in seconds
* share your development context with team members, for collaborative or debugging purposes

## Developing with CAP Node.js in a container

The list of install requirements in the [Jumpstart Development](https://cap.cloud.sap/docs/get-started/jumpstart) section looked like an ideal situation for a dev container.

Especially given the context of folks joining the live stream episodes and wanting to play along, often on laptops that they don't have admin access to to install stuff, or on machines they simply don't want to install anything else on. I see this often in the [SAP CodeJams that we run](https://groups.community.sap.com/t5/sap-codejam/eb-p/codejam-events); attendees' corporate laptops are often locked down, and it can be that a significant amount of time is spent at the start of the day just trying to get stuff installed, fighting with policies, or with the operating system, access rights, or even simply badly behaved install mechanisms. All that before getting to the real content of the day is distracting, tedious and not what anyone wants especially at the start of a new learning journey.

There are three ways to develop with CAP Node.js in a container context.

## A dev container definition

Two of those ways explicitly involve a dev container definition. So let's look at that first.

Given the install requirements, I [created a small repo][1] containing essentially of a `.devcontainer/` directory, following the [containers.dev](https://containers.dev/) approach, which, while it started as a mechanism in VS Code specifically is now an open standard\*.

\* Another example of something great, and open, that many of us use in our own editor environments, but started life originally in VS Code, is the [Language Server Protocol](https://en.wikipedia.org/wiki/Language_Server_Protocol), which I use in my Neovim-based editor setup. More on that another time, perhaps.

The entire content of the repo looks like this:

```text
../capb2b
|-- .devcontainer
|   |-- Dockerfile
|   `-- devcontainer.json
`-- README.md
```

The contents of `devcontainer.json` are as follows:

```json
{
  "name": "Back to basics - SAP CAP - dev container",
  "build": {
    "dockerfile": "Dockerfile",
    "args": { "VARIANT": "20" }
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "sapse.vscode-cds",
        "dbaeumer.vscode-eslint",
        "humao.rest-client",
        "qwtel.sqlite-viewer",
        "mechatroner.rainbow-csv"
      ]
    }
  },
  "forwardPorts": [ 4004 ],
  "remoteUser": "node"
}
```

This describes what VS Code should do with regards to opening the contents of the entire repo, which is, briefly:

* create a container from the image described in the `Dockerfile`
* if that image needs to be built, then supply a build argument setting `VARIANT` to `20`
* add some extensions inside the container, once it's been created and VS Code has attached to it
* expose port 4004 from the container to the host machine (so that we can connect to a service running there, from the browser on our host (i.e. `http://localhost:4004`)
* run the container as the user `node`\*

\* This is rather than the user `root`, which is less desirable, for security reasons. Note that the base image for the container needs to have this `node` user already created (and in the case of the base image here - see below - it is).

The image itself is described in `Dockerfile` thus:

```dockerfile
# syntax=docker/dockerfile:1

ARG VARIANT="20"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# Install some generally useful tools
RUN apt-get update && apt-get -y install --no-install-recommends curl git sqlite3

# Install SAP CAP SDK globally
USER node
RUN npm install -g @sap/cds-dk
WORKDIR /home/node
```

The base image from which this one is made is a [Node.js Development Container Image](https://hub.docker.com/_/microsoft-devcontainers-javascript-node), specifically (via the default value for the `VARIANT` arg) `mcr.microsoft.com/devcontainers/javascript-node:20` (for Node.js major version 20). This is the same build argument referenced in the `devcontainer.json` file.

So going back to the install list in the [Jumpstart Development](https://cap.cloud.sap/docs/get-started/jumpstart) section, that's Node.js taken care of. 

On top of that base some core tools are installed:

* `git`, for source code control (also listed)
* `sqlite3`, because at some stage we'll probably want to look inside the files that are used as the default SQLite-based persistence store in development
* `curl`, of course ("because curl")

Finally the CAP development kit, in the form of the NPM package [@sap/cds-dk](https://www.npmjs.com/package/@sap/cds-dk), is installed (globally, with the `-g` option, but remember that's just globally within a given container image).

The only other item on the list is "Java and Maven" but of course that's not relevant here for Node.js flavoured CAP.

So that's it.

## The three approaches

As I mentioned before, two approaches involve this dev container definition. One is local, the other one is remote.

### VS Code and Docker Desktop

VS Code is available for all platforms. As is Docker Desktop. And, in the continued context of avoiding installation of tools locally, I would say that these two are exceptions. I mean, my main editor is of course (Neo)vim, inside my [terminal-based IDE](https://qmacro.org/blog/posts/2024/01/09/a-seeimple-jq-repl-with-tmux-bash-vim-and-entr/) but if I were to use a more graphical IDE I'd want it running locally (as I like my terminal emulator to run locally). And I see Docker Desktop in a similar way to how I see a VM manager like VirtualBox or VMWare Fusion, for example. An extension of the host OS.

Anyway, I digress (not for the first time). Talking of digressions, I'm not going to go into Docker Desktop, licencing, and alternatives (such as Podman Desktop). That's a topic for another time.

So if I were to have the contents of the [repo][1] locally, I could start VS Code, and open that directory. And this is what happens:

![Opening directory in VS Code](/images/2024/01/vscode-open-folder.gif)

You can see:

* VS Code recognises the `.devcontainer/` directory and offers the "Reopen in Container" option
* a container based on the image described in that `.devcontainer/` directory is created and VS Code connects to it
* VS Code indicates this remote connection in the bottom left ("Opening remote" and then "Dev Container: Back to basics - SAP CAP"\*

\* Yes, this description is from the `name` property in the `devcontainer.json` file.

After opening a terminal, we can see the shell prompt which indicates that:

* the shell in the terminal is Bash
* we are running as user `node`
* the `cds` command is available (as are `curl` and `git`)

By inspecting various Docker resources, we can see what's happened behind the scenes.

First, there's a new image `vsc-capb2b-main-72ec...`:

```shell
; docker image ls
REPOSITORY                 TAG       IMAGE ID    
newdev                     latest    117d08c98a2b
vsc-capb2b-main-72ec00...  latest    dd71ceb116fb
codejam                    latest    7fb76bf1a160
```

This image is indeed the one built according to the instructions in `.devcontainer/` as we can see from the metadata:

```shell
; docker image inspect dd71 \
  | jq 'first.Config.Labels["devcontainer.metadata"] | fromjson'
[
  {
    "...": "...",
  },
  {
    "customizations": {
      "vscode": {
        "extensions": [
          "sapse.vscode-cds",
          "dbaeumer.vscode-eslint",
          "humao.rest-client",
          "qwtel.sqlite-viewer",
          "mechatroner.rainbow-csv"
        ]
      }
    },
    "remoteUser": "node",
    "forwardPorts": [
      4004
    ]
  }
]
```

From this image we have the container created, to which VS Code has connected:

```shell
; docker container ls
CONTAINER ID   IMAGE                      COMMAND                  CREATED        
16c6e1a6b28f   vsc-capb2b-main-72ec00...  "/bin/sh -c 'echo Co…"   5 minutes ago
0b286ef3c7cf   newdev                     "tmux -u"                2 days ago    
f29a13b910be   alpine/socat               "socat tcp-listen:23…"   2 days ago     
```

There's plenty of interesting detail to see when we inspect this container, but for now let's just limit it to having a look for mounts:

```shell
; docker container inspect 16c6 | jq 'first.HostConfig.Mounts'
[
  {
    "Type": "bind",
    "Source": "/Users/I347491/work/scratch/capb2b-main",
    "Target": "/workspaces/capb2b-main",
    "Consistency": "cached"
  },
  {
    "Type": "volume",
    "Source": "vscode",
    "Target": "/vscode"
  }
]
```

We can see we have a bind mount of the directory we opened in VS Code, i.e. the `capb2b-main/` directory, which makes sense, as we want to access resources in there from within the container. Moreover, it wouldn't make sense to store resources inside the container as they'd be lost if the container was removed. Notice that the value of the `Target` property in this bind mount, `/workspaces/capb2b-main`, matches the directory we're in, shown in the shell prompt in the terminal in VS Code:

```text
node ➜ /workspaces/capb2b-main $
```

There's another mount, this time a volume mount. This has caused a volume to be created, which we can see thus:

```shell
; docker volume ls
DRIVER    VOLUME NAME
local     vscode
```

But what's in it? Well, we can see where this volume is mounted, so, in the terminal still running in VS Code, let's have a brief look:

```shell
node ➜ /workspaces/capb2b-main $ tree -L 3 /vscode
/vscode
└── vscode-server
    ├── bin
    │   └── linux-arm64
    └── extensionsCache
        ├── dbaeumer.vscode-eslint-2.4.2
        ├── humao.rest-client-0.25.1
        ├── mechatroner.rainbow-csv-3.11.0
        ├── qwtel.sqlite-viewer-0.3.13
        └── sapse.vscode-cds-7.5.0

4 directories, 5 files
```

That makes sense - it looks like VS Code uses this volume to store VS Code specific resources, such as the VS Code server components, and a cache for the extensions. Nice!

So at this point we can happily develop CAP apps and services, on our local machine, without having to have installed any CAP specific or peripheral tools locally on the host. We're inside a container, but the files we create in building our app are safe on the host-local file system.



[1]: https://github.com/qmacro/capb2b
