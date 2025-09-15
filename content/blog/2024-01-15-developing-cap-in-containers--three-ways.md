---
title: Developing CAP in containers - three ways
date: 2024-01-15
tags:
  - containers
  - devcontainer
  - cap
  - vscode
  - linux
  - github
  - bas
---
On Friday last week we had the first [Hands-on SAP Dev](https://blogs.sap.com/2020/11/09/an-overview-of-sap-developers-video-content/#shows) live stream of 2024, and it was the first episode in a new "back to basics" series on the SAP Cloud Application Programming Model (or CAP, to us humans), specifically with Node.js.

[![Back to basics with SAP CAP live stream episode 1 thumbnail](/images/2024/01/capb2b-1-thumbnail.png)](https://www.youtube.com/watch?v=gu5r1EWSDSU)

<https://www.youtube.com/watch?v=gu5r1EWSDSU>

## Background

In it we went through what's required for local development, following the guide in the [Jumpstart Development section of Capire][2] ("Capire" is the friendly name given to the CAP documentation).

Over the years I've gone through many laptop and desktop machines, with different operating systems, and installed plenty of tools. Up until recently I've also fairly regularly wiped the operating system completely on those machines and reinstalled everything, or at least reinstalled the tools that I still needed. This was because over time my machines got full of cruft and slowed me down, because I didn't always have the right version of, say, Python, or I needed to run multiple different versions of Node.js\*, or something that I'd previously installed was preventing the install of something new that I needed.

\* Yes I know about tools like [nvm](https://github.com/nvm-sh/nvm), and similar ones for managing multiple versions of other languages and tools, and I've used many of them. But they have always felt like a sticking plaster, rather than a solution. While I'm on this aside, I came across [asdf](https://github.com/asdf-vm/asdf) recently which goes one step further in an attempt to be "one version manager to rule them all". But I'm still only half convinced.

Bottom line is that as I move from project to project, from one tool requirement to another, from one language or language version to another, there's inevitably a wake of install froth, a trail of untidy and unwanted software on my machine. There has to be a better way.

That better way is dev containers.

Working inside a dev container gives me everything I need in a concise package, that I can turn on and off, start up and shut down, mess up and recreate, and share with others so that they have exactly the same environment (and versions of tools and runtimes) as me. What's more, while in most folks' ideal scenario, those dev containers run on their local machine, they're independent, and also I often run dev containers on remote machines and connect to them from my local machine.

Put simply, developing in a dev container is a great way to:

* get started with a ready-made set of tools exactly for the job
* avoid getting distracted by the often challenging requirements of installing tools
* use a focused environment without disturbing anything on your local (host) machine
* experiment and risk breaking everything, because you can start again in seconds
* share your development context with team members, for collaborative or debugging purposes

## Developing with CAP Node.js in a container

The list of install requirements in the [Jumpstart Development][2] section looked like an ideal situation for a dev container.

Especially given the context of folks joining the live stream episodes and wanting to play along, often on laptops that they don't have admin access to to install stuff, or on machines they simply don't want to install anything else on.

I see this often in the [SAP CodeJams that we run](https://groups.community.sap.com/t5/sap-codejam/eb-p/codejam-events); attendees' corporate laptops are often locked down, and it can be that a significant amount of time is spent at the start of the day just trying to get stuff installed, fighting with policies, or with the operating system, access rights, or even simply badly behaved install mechanisms. All that before getting to the real content of the day is distracting, tedious and not what anyone wants especially at the start of a new learning journey.

In this post I describe three ways to develop with CAP Node.js in a container context.

<a name="adevcontainerdefinition"></a>
## A dev container definition

Two of those ways involve a dev container definition. So let's look at that first.

Given the [install requirements][2], I created a [small repo][1] containing essentially of a `.devcontainer/` directory, following the [containers.dev](https://containers.dev/) approach, which, while it started as a mechanism in VS Code specifically is now an open standard\*.

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

This describes what VS Code should do with regards to opening the contents of the directory, which is, briefly:

* create a container from the image described in the `Dockerfile`
* if that image needs to be built, then supply a build argument setting `VARIANT` to `20`
* add some extensions inside the container once it's been created and VS Code has attached to it
* expose port 4004 from the container to the host machine (so that we can connect to a service running there, from the browser on our host (i.e. `http://localhost:4004`)
* run the container as the user `node`\*

\* This is rather than the user `root`, which is less desirable, for security reasons. Note that the base image for the container needs to have this `node` user already created (and in the case of the base image here, it is, as can be seen from [its definition](https://github.com/devcontainers/images/blob/main/src/javascript-node/.devcontainer/Dockerfile)). 

The dev container image itself is described in `Dockerfile` thus:

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

The base image from which this one is made is a [Node.js Development Container Image](https://hub.docker.com/_/microsoft-devcontainers-javascript-node), specifically (via the default value for the `VARIANT` arg):

```text
mcr.microsoft.com/devcontainers/javascript-node:20
```

The 20 refers to the Node.js major version. This `VARIANT` is the same build argument referenced in the `devcontainer.json` file.

So going back to the install list in the [Jumpstart Development][2] section, that's Node.js taken care of. 

On top of that base some core tools are installed:

* `git`, for source code control (also listed)
* `sqlite3`, because at some stage we'll probably want to look inside the files that are used as the default SQLite-based persistence store in development
* `curl`, of course ("because curl")

Finally the CAP development kit, in the form of the NPM package [@sap/cds-dk](https://www.npmjs.com/package/@sap/cds-dk), is installed (globally, with the `-g` option, but remember that's just globally within a given container image). This gives us access to the `cds` command, which is a multi-faceted tool essential for CAP development.

The only other item on the list is "Java and Maven" but of course that's not relevant here for Node.js flavoured CAP.

So that's everything needed.

## The three approaches

As I mentioned before, two approaches involve this dev container definition. One is local, the other one is remote. I'll describe the local approach first.

<a name="vscodeanddockerdesktop"></a>
### With VS Code and Docker Desktop

VS Code is available for pretty much all platforms. As is Docker Desktop. And, in the continued context of avoiding installation of tools locally, I would say that these two are exceptions. I mean, my main editor is of course (Neo)vim, inside my [terminal-based IDE](https://qmacro.org/blog/posts/2024/01/09/a-seeimple-jq-repl-with-tmux-bash-vim-and-entr/) but if I were to use a more graphical IDE I'd want it running locally and directly on the host OS (as I like my terminal emulator to run locally). And I see Docker Desktop in a similar way to how I see a VM manager like VirtualBox or VMWare Fusion, for example. An extension of the host OS.

Anyway, I digress, and not for the first time. Talking of digressions, I'm not going to go into Docker Desktop, licencing, and alternatives (such as Podman Desktop) here. That's a topic for another time.

So, here's how it works. With the contents of the [repo][1] locally, I start VS Code locally on my macOS host, and open that directory. And this is what happens:

![Opening directory in VS Code](/images/2024/01/vscode-open-folder.gif)

You can see that:

* VS Code recognises the `.devcontainer/` directory within the directory just opened, and consequently offers the "Reopen in Container" option
* a container based on the image described in that `.devcontainer/` directory is created and VS Code connects to it
* VS Code indicates this remote connection in the bottom left (first displaying "Opening remote" and then "Dev Container: Back to basics - SAP CAP"\*)

\* Yes, this description is from the `name` property in the `devcontainer.json` file.

After opening a terminal in VS Code, we can see the shell prompt which indicates that:

* the shell in the terminal is Bash
* the operating system is Linux
* we are running as user `node`
* the `git`, `curl` and `cds` commands are available

By inspecting various Docker resources, we can see what's happened behind the scenes.

First, there's a new image `vsc-capb2b-main-72ec...`:

```shell
; docker image ls
REPOSITORY                 TAG       IMAGE ID    
newdev                     latest    117d08c98a2b
vsc-capb2b-main-72ec00...  latest    dd71ceb116fb
codejam                    latest    7fb76bf1a160
```

This image is indeed the one built according to the instructions in `.devcontainer/` as we can see from the image's metadata:

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

From this image a container has been created, and to which VS Code has connected:

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

We can see we have a bind mount of the directory we opened in VS Code, i.e. the `capb2b-main/` directory, which makes sense, as we want to access resources in there from within the container.

```text
+---------------------------------- host (macOS) -------+
| /Users/                                               |
|   |                                                   |
|   +- I347491/                                         |
|       |                                               |
|       +- work/                                        |
|           |                                           |
|           +- scratch/                                 |
|               |                                       |
|    +--------  +- capb2b-main/                         |
|    |              |                                   |
|    |              +- .devcontainer/                   |
|    |              +- README.md                        |
|    |                                                  |
|  bind mount                                           |
|    |                                                  |
|    |                                                  |
|    |          +------------- container (Linux) --+    |
|    |          | /workspaces/                     |    |
|    |          |   |                              |    |
|    +------------> +- capb2b-main/                |    |
|               |                                  |    |
|               +----------------------------------+    |
|                                                       |
+-------------------------------------------------------+
```

Moreover, it wouldn't make sense to store our CAP app resources inside the container as they'd be lost if the container was removed. Notice that the value of the `Target` property in this bind mount, `/workspaces/capb2b-main`, matches the directory we're in, shown in the shell prompt in the terminal in VS Code:

```text
node ➜ /workspaces/capb2b-main $
```

There's another mount, this time a volume mount. This has caused a volume to be created, which we can see thus:

```shell
; docker volume ls
DRIVER    VOLUME NAME
local     vscode
```

But what's in it? Well, we can see where this volume is mounted (in the `Target` property), so, in the terminal still running in VS Code, let's have a brief look:

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

We can see this as follows. If we initiate a new CAP project in the container, in the terminal inside VS Code, then we end up with a new directory containing the core files and directories for a Node.js CAP project (`app`, `srv` and `db` directories, plus a `package.json` file):

```shell
node ➜ /workspaces/capb2b-main $ cds init bookshop
Creating new CAP project in ./bookshop

Adding feature 'nodejs'...

Successfully created project. Continue with 'cd bookshop'.
Find samples on https://github.com/SAP-samples/cloud-cap-samples
Learn about next steps at https://cap.cloud.sap
node ➜ /workspaces/capb2b-main $ cd bookshop/
node ➜ /workspaces/capb2b-main/bookshop $ ls -l
total 8
drwxr-xr-x 2 node node  64 Jan 15 09:46 app
drwxr-xr-x 2 node node  64 Jan 15 09:46 db
-rw-r--r-- 1 node node 348 Jan 15 09:46 package.json
-rw-r--r-- 1 node node 675 Jan 15 09:46 README.md
drwxr-xr-x 2 node node  64 Jan 15 09:46 srv
```

And outside of the container, in the host macOS environment, we can also see these files locally:

```shell
~ % cd ~/work/scratch/capb2b-main
capb2b-main % ls -l bookshop
total 16
-rw-r--r--@ 1 I347491  staff  675 15 Jan 09:46 README.md
drwxr-xr-x  2 I347491  staff   64 15 Jan 09:46 app
drwxr-xr-x  2 I347491  staff   64 15 Jan 09:46 db
-rw-r--r--  1 I347491  staff  348 15 Jan 09:46 package.json
drwxr-xr-x  2 I347491  staff   64 15 Jan 09:46 srv
```

Great!

<a name="githubcodespaces"></a>
### With GitHub Codespaces

So now we've seen the local approach with this dev container definition, it's time to turn to the remote approach. This approach doesn't need VS Code, nor does it need Docker Desktop. All you need is a browser (tho you may be pleasantly surprised to learn that you can actually combine these two approaches - read on until the end to find out how).

The magic of this approach lies in [GitHub Codespaces](https://github.com/features/codespaces).

In the good old days, given a repository on GitHub, all the options to work with it involved downloading the repository content somehow (via `git` or a simple ZIP file download).

These days, all those options are now collected within a tab labelled "Local", and there's also now another tab labelled "Codespaces" which offers the ability to create a working environment specificially for, and containing the content of, the repo.

Here is what happens:

![Opening repo in a GitHub Codespace](/images/2024/01/codespace-open-repo.gif)

Beyond not needing anything more than a browser, the crazy thing is that this is pretty much exactly the same as what we see with the VS Code and Docker Desktop approach, except that everything is remote:

* a container is created from the image, again, according to the instructions in `.devcontainer/`
* an instance of VS Code is made available in the browser
* this instance of VS Code then makes a "remote connection" to the container

The upshot is that we have pretty much the same environment as we have in our local approach!

<a name="sapbusinessapplicationstudio"></a>
### With SAP Business Application Studio

Talking of simple contexts where all we need is a browser brings me onto the third approach. This is also very similar to the GitHub Codespaces approach, in that it's all remote and all you need is a browser.

The [SAP Business Application Studio](https://www.sap.com/uk/products/technology-platform/business-application-studio.html) (BAS) is an IDE in the cloud. With BAS, you can manage your projects in one or more so-called Dev Spaces, similar to Codespaces, and there are different Dev Space setup flavours available depending on your development project requirements.

Here's an example of the creation of a Dev Space (choosing the "Full Stack Cloud Application" flavour in the setup means that all the tools we need for CAP development will be available) and the cloning of the repo ready to start CAP development:

![Starting a new Dev Space for CAP development](/images/2024/01/bas-clone-repo.gif)

Interestingly, [since autumn last year](https://blogs.sap.com/2022/11/15/sap-business-application-studio-now-powered-by-code-oss/), the underlying tech for Dev Spaces in BAS has been [Code - OSS](https://github.com/microsoft/vscode), the open source flavour of VS Code. This is why the three approaches (VS Code locally, GitHub Codespaces remotely, and now here with a BAS Dev Space) all look the same. That's because effectively they are the same, underneath, from an IDE perspective.

So here again is another way to develop CAP apps in what is effectively a container. The actual underlying mechanism may be slightly different, but the effect is the same, in that you don't have to install anything locally on your host machine.

## Bonus: VS Code and Codespaces

In the [section on GitHub Codespaces](#githubcodespaces) earlier, I mentioned in passing that it is actually possible to combine the local and remote approaches. Before I finish this post, I'll show that in action here.

Given a GitHub Codespace, it's not only possible to open that in the browser, as we saw earlier, but it's also possible to connect to it ... from VS Code running locally on your host. This is both obvious when you think about the underlying technology in use here, but at the same time it's sort of mind blowing that this is a thing. At least to me. Anyway, here it is in action:

![Opening a GitHub Codespace in VS Code](/images/2024/01/open-codespace-in-vscode.gif)

What's happening here is that there's a [GitHub Codespaces extension](https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces) that I also now have installed in my local VS Code. This works in a similar way to the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension. In order for this to work the first time I tried it, I had to go through an authentication step which securely connected my VS Code to GitHub, via the [GitHub for VS Code](https://vscode.github.com/) connected application (you don't see this step in the video above).

Visually it's almost the same too, except for the fact that the after the remote indicator (in the bottom left of VS Code) shows "Opening remote", the final status is slightly different:

* VS Code and Docker Desktop: "Dev Containers: Back to basics: SAP CAP"
* VS Code and GitHub Codespaces: "Codespaces: redesigned potato\*"

\* The generated name of the Codespace is "redesigned potato".

Of course, you can also start the connection from within VS Code, i.e. reach out to the remote container (Codespace) using the extension. Here's a quick demo of that in action:

![Initiating a connection to a GitHub Codespace from VS Code](/images/2024/01/vscode-connect-to-codespace.gif)

## Wrapping up

All in all, the possibilities of container based development are, in my humble opinion, pretty excellent. I am also keeping a close eye on the [containers.dev initiative](https://containers.dev/) plus various related projects, such as [DevPod](https://devpod.sh/), which I learned about in the [Open Source Dev Containers with DevPod](https://www.youtube.com/watch?v=rvu2b0PiTR4) live stream episode on Bret Fisher's YouTube channel.

If you want to get started developing CAP apps and services, I would strongly recommend you look into using a container based setup, and take any one of the approaches outlined here.

Happy developing!

[1]: https://github.com/qmacro/capb2b
[2]: https://cap.cloud.sap/docs/get-started/jumpstart
