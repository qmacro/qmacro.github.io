---
title: "Boosting tutorial UX with dev containers part 2 - embedding prerequisite details"
date: 2022-01-28
tags:
  - sap-community-post
  - containers
---

In this three-part series I outline and demonstrate an approach to help
newcomers get started more quickly with our tutorials, by describing and
providing an environment with all the prerequisite tools installed ready
to go. This is part two, where I add the tutorial prerequisite detail to
the Dockerfile I created in part one, and also introduce the
devcontainer.json file.

You may want the previous or next post in this three-part series:

- [Boosting tutorial UX with dev containers part 1 - challenge and
  base
  solution](/blog/posts/2022/01/27/boosting-tutorial-ux-with-dev-containers-part-1-challenge-and-base-solution/)
- [Boosting tutorial UX with dev containers part 3 - containers into
  action](/blog/posts/2022/02/01/boosting-tutorial-ux-with-dev-containers-part-3-containers-into-action/)

At the end of part 1 we had a base solution consisting of a simple
Dockerfile definition for an image based on Node.js v16 and Debian
buster. This image would be what we'll create containers from, for our
development environment, and with [VS Code's support for development in
remote
containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers),
we'd connect to such a container to work within.

We left off at the end of part 1 having instantiated a container based
on the image in our Dockerfile definition, and got ourselves a shell
environment, like this:

```shell
# /tmp
; docker run --rm -it mcr.microsoft.com/vscode/devcontainers/javascript-node:16-buster bash
root ➜ / $
```

Now it's time to work through the steps in the prerequisite tutorial
[Set Up Local Development Using VS
Code](https://developers.sap.com/tutorials/btp-app-set-up-local-development.html)
that we looked at briefly in part 1. We'll take the steps one at a
time, and decide what we need to do to fulfil what the step describes,
but in the context of our image and future containers.

## Step 1: Editors

There's not much we need to do here as we're going for VS Code
implicitly. We will want to create a [devcontainer configuration
file](https://code.visualstudio.com/docs/remote/devcontainerjson-reference)
that effectively tells VS Code about the dev container and how to use
it, but we'll do that towards the end.

## Step 2: Command line interpreters

This step tells us that we'll be needing to enter commands on a command
line, as part of the tutorial, and therefore a command line interpreter
(environment) is required. Here's what the step says:

> "This tutorial contains a number of command line snippets that need to
be pasted into a command line window. All snippets listed for macOS/Linux or
without platform information can be executed in the bash or zsh, which are the
default shells for these platforms. The Windows snippets are for the Windows
Command Line and not for the PowerShell. Windows users are suggested to use the
Git BASH instead, which is part of the Git for Windows installation and
contains the basic UNIX command line tools. In the Git BASH, use the
macOS/Linux snippets of the tutorial. VS Code supports the use of the Git BASH
for the integrated command line window (called Terminal in VS Code) as well."

Interestingly, even though all three main OS platforms are mentioned, it
didn't escape my notice that Bash was the most prominent shell
mentioned - as illustrated by this gratuitous pipeline that analyses the
text of that paragraph:

```shell
; cat paragraph-text
| tr '[:upper:]' '[:lower:]'
| sed -E 's/[^a-z]/ /g; s/ +/\n/g'
| sort
| uniq -c
| sort -nr
| head
14 the
6 for
5 line
5 command
4 windows
4 snippets
4 of
4 git
4 bash
3 use
# /tmp
;
```

There's **bash** in the top ten list, no sign of anything else (now
where's that troll emoji when I need it?)

Anyway, there's nothing for us to do in this step either, as our base
image has a shell environment as standard.

## Step 3: Install Git

Nothing to do here either, as git is already available to us in the base
image, which we can check in our Bash shell inside the running container
like this:

```shell
root ➜ / $ git --version
git version 2.30.2
```

Nice!

## Step 4: Install Node.js

As you can guess, nothing to do here either - the whole point of
choosing the base image that we did was to have a Node.js environment.
So we don't need to install Node.js explicitly at this point. Note that
the step advises us to run the latest LTS version, which we are doing in
this image.

## Step 5: Install the SAPUI5 command line interface

Here's where we get something to do. The ui5 CLI is not going to be in
the base Docker image, but it's easily installed as a global Node.js
module, via the Node Package Manager (NPM). The instructions in this
tutorial step show us how to do that.

We can try it now in our currently running container:

```shell
root ➜ / $ npm install --global @ui5/cli

added 520 packages, and audited 521 packages in 16s

found 0 vulnerabilities
root ➜
```

We can then invoke it directly, like this:

```shell
root ➜ / $ ui5 --version
2.14.4 (from /usr/local/share/npm-global/lib/node_modules/@ui5/cli/bin/ui5.js)
root ➜ / $
```

Great. Of course, this only gets us the ui5 CLI in the current
container, the currently running instance of the Docker image. So we
need to add this to our Docker image definition.

There's a [base image
reference](https://github.com/microsoft/vscode-dev-containers/blob/e7ee99058efcecb977145640a7f0f09097836403/containers/javascript-node/.devcontainer/Dockerfile)
that shows us how we should do this, so following that example we end up
with this in our Dockerfile:

```dockerfile
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:${VARIANT}

RUN su node -c "npm install -g @ui5/cli"
```

## Step 6: Install the Cloud Foundry command line interface

If we look closely at this step, there are different instructions
depending on what host operating system you're running. The
container-based approach alleviates this by providing a common and
consistent environment. So we only need to consider instructions for
installing the cf CLI once.

The image's base is Debian, a Linux distribution, so of course we need
to follow the Linux based installation instructions, and [we're
directed to the Cloud Foundry
website](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html#pkg-linux)
to follow them. Let's follow them in our test container that we have
running, and for future container instantiation, we'll then add further
content to our Dockerfile so that images built from that will have the
cf CLI.

There are two different ways to install the cf CLI on Linux - using the
distribution's package manager, or just downloading and unpacking the
binary file. While they're both good approaches, we'll just make a
decision and go for the former. Talking of decisions, there are
different major versions of the cf CLI available \... to discuss the
differences between them is a topic for another time, we'll just go for
v7 here as it seems to be gaining usage over v6 and is still not as
"bleeding edge" as v8.

So the first thing we need to do in the
[instructions](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html#pkg-linux)
is to add the Cloud Foundry Foundation public key and package repository
details so we can use the Debian package manager to install it:

```shell
root ➜ / $ wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | apt-key add -
Warning: apt-key is deprecated. Manage keyring files in trusted.gpg.d instead (see apt-key(8)).
OK
root ➜ / $
```

If you're curious like me, you'll want to know what's happening here.
Using wget, the key is downloaded (avoiding normal output, with the -q
"quiet" option) and written to standard output STDOUT with the -O -
option and value. This key is piped into the standard input STDIN of
apt-key to add it to the package manager's key store.

Then a new file in the package manager's list of sources is created,
pointing to a Cloud Foundry resource for Debian packages:

```shell
root ➜ / $ echo "deb https://packages.cloudfoundry.org/debian stable main" | tee /etc/apt/sources.list.d/cloudfoundry-cli.list
root ➜ / $
```

Note that in neither of these two activities do we need to use the
"sudo" command which was shown in the instructions. This is because in
this container, we're the administrative "root" user already.

Next we can get the package lists updated like this:

```shell
root ➜ / $ apt-get update
Hit:1 http://security.debian.org/debian-security buster-security InRelease
Hit:2 http://deb.debian.org/debian buster InRelease
Get:3 http://deb.debian.org/debian buster-updates InRelease [39.4 kB]
Hit:5 https://dl.yarnpkg.com/debian stable InRelease
Hit:4 https://cf-cli-debian-repo.s3.amazonaws.com stable InRelease
Fetched 39.4 kB in 1s (33.9 kB/s)
Reading package lists... Done
root ➜ / $
```

And now we can request the install:

```shell
root ➜ / $ apt-get install cf7-cli
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
cf7-cli
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 5853 kB of archives.
After this operation, 22.6 MB of additional disk space will be used.
Get:1 https://packages.cloudfoundry.org/debian stable/main amd64 cf7-cli amd64 7.4.0 [5853 kB]
Fetched 5853 kB in 3s (2022 kB/s)
Selecting previously unselected package cf7-cli.
(Reading database ... 26901 files and directories currently installed.)
Preparing to unpack .../cf7-cli_7.4.0_amd64.deb ...
Unpacking cf7-cli (7.4.0) ...
Setting up cf7-cli (7.4.0) ...
root ➜ / $
```

This is all we need to get the cf CLI installed, which it now is, as we
can see:

```shell
root ➜ / $ cf --version
cf version 7.4.0+e55633fed.2021-11-15
root ➜ / $
```

Happy with success, we can now make this a standard activity when
building the image, with new content in the Dockerfile, so it now looks
like this:

```dockerfile
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:${VARIANT}

RUN wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | apt-key add - ;
  echo "deb https://packages.cloudfoundry.org/debian stable main" | tee /etc/apt/sources.list.d/cloudfoundry-cli.list

RUN apt-get update
  && apt-get -y install --no-install-recommends cf7-cli

RUN su node -c "npm install -g @ui5/cli"
```

This pretty much reflects what we've just done in the container, with
the addition of the following options for apt-get:

- the -y option sets an automatic "yes" to any prompts that may come
  up, which is good for unattended execution such as image builds
- the --no-install-recommends option prevents apt-get installing
  anything other than the actual package requested and with its
  dependencies

## Step 7: Add CAP tooling

We've installed the ui5 CLI, and now it's time to install the SAP
Cloud Application Programming (CAP) model software development kit. This
is also in the form of a Node.js module, and we should install that also
globally in a similar way to how we installed the ui5 CLI. Let's do it
now directly in our running container first:

```shell
root ➜ / $ npm install --global @sap/cds-dk
[...]

added 415 packages, and audited 416 packages in 21s
root ➜ / $
```

Let's check to see if we have the main CLI executable at our fingertips
now (in our PATH):

```shell
root ➜ / $ cds --version
@sap/cds: 5.7.3
@sap/cds-compiler: 2.11.2
@sap/cds-dk: 4.7.3
@sap/cds-foss: 3.0.0
@sap/eslint-plugin-cds: 2.3.0
Node.js: v16.13.2
home: /usr/local/share/npm-global/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds
root ➜ / $
```

Yep, lovely!

The simplest thing we can do to encode this installation step into our
Dockerfile is to just add it to the existing npm install command already
in there. So now our Dockerfile looks like this:

```dockerfile
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:${VARIANT}

RUN wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | apt-key add - ;
  echo "deb https://packages.cloudfoundry.org/debian stable main" | tee /etc/apt/sources.list.d/cloudfoundry-cli.list

RUN apt-get update
  && apt-get -y install --no-install-recommends cf7-cli

RUN su node -c "npm install -g @ui5/cli @sap/cds-dk"
```

## Step 8: Install VS Code

So here's a step that we don't encode in the image of course - the two
core tools you'll need on your local machine are Docker Desktop or
equivalent, as already stated, and VS Code, because the whole idea is
that you use VS Code and connect to a container for everything else.

That said, once we have everything set up, there's a context where
neither Docker Desktop nor VS Code is required, but you still have all
the tools in a container and you can still run through the entire
tutorial mission. Can you guess what that context is? Answer below in
the comments.

## Step 9: Install VS Code extensions

This step, along with the subsequent step, describes a couple of VS Code
extensions that are required for the tutorial; they make development in
this space a lot easier and more pleasant. This first extension is the
[SAP CDS Language Support
extension](https://marketplace.visualstudio.com/items?itemName=SAPSE.vscode-cds).

This is a wonderful extension that introduced me to the Language Server
Protocol (LSP) which I've covered in some detail in a couple of past
episodes of the Hands-on SAP Dev
[show](https://blogs.sap.com/2020/11/09/an-overview-of-sap-developers-video-content/#shows):

[Ep.7 -- Digging into the language server protocol, cds-lsp and
Vim](https://www.youtube.com/watch?v=WLkFAtgEWs8)

[Ep.26 -- Vim CDS plugin with new \@sap/cds-lsp
package](https://www.youtube.com/watch?v=S7PaeN4r7vQ)

![](/images/2022/01/screenshot-2022-01-27-at-08.02.02.png)

Now, one might think that this extension is to be installed into your
local VS Code installation. But with VS Code's support for development
containers, there's an alternative approach, described in the [Managing
Extensions](https://code.visualstudio.com/docs/remote/containers#_managing-extensions)
section of the [Developing inside a
Container](https://code.visualstudio.com/docs/remote/containers)
article.

This alternative approach makes sense, in that it distinguishes between
extensions that affect VS Code's direct user interface (UI) such as
colour and theme extensions, and extensions that provide additional
functionality. It also recognises that extensions are often project
specific, and it's a good idea to limit the extensions installed to the
ones needed for the particular task at hand.

So with the support for developing inside a container, non-UI extensions
can be installed when a container is created in the context of VS Code
connecting to and using it for remote development. The [Developing
inside a
Container](https://code.visualstudio.com/docs/remote/containers) article
describes a configuration file called **devcontainer.json** which holds
all the configuration for using containers like this.

So with what we have at this point, and according to the configuration
file specifications, here's the simplest version that we'd need so
far:

```json
{
  "name": "Tutorial dev container",
  "build": {
    "dockerfile": "Dockerfile",
  }
}
```

This is the simplest configuration that could possibly work, and
there's more we'll add later but for now, let's just stare at this
for a second. What it does is simply point to the Dockerfile, the
definition file for the image from which containers are to be created.

So where is that Dockerfile located, and where do we put this
devcontainer.json file? By default, VS Code will look for a directory
named **.devcontainer/** and this is where we'll put both files:

```text
.devcontainer/
├── Dockerfile
└── devcontainer.json
```

This directory can live in the root of your project.

So now we have our devcontainer.json configuration file, we can turn our
attention back to the task at hand, which is to think about what this
prerequisite step is asking us to do, which is to install the SAP CDS
Language Support extension. This is not an extension that is designed to
directly affect VS Code's UI, and it's quite project-specific (i.e.
you'll need it for CAP projects, but not for non-CAP projects). So
it's a perfect candidate for associating with the container.

And it's within our new devcontainer.json file that we can specify that
this extension should be installed. This is what our devcontainer.json
file looks like with this in place:

```json
{
  "name": "Tutorial dev container",
  "build": {
    "dockerfile": "Dockerfile",
  },
  "extensions": [
    "sapse.vscode-cds"
  ]
}
```

In case you're wondering where we get the technical name for the
extension from ("sapse.vscode-cds"), it's in the URL of the extension
on the Visual Studio Marketplace:
<https://marketplace.visualstudio.com/items?itemName=sapse.vscode-cds>.

## Step 10: Install SAP Fiori tools Extension Pack

Here's another extension to install. In fact, it's an extension pack,
which is a collection of multiple extensions: [SAP Fiori Tools -
Extension
Pack](https://marketplace.visualstudio.com/items?itemName=sapse.sap-ux-fiori-tools-extension-pack).
I'll leave you to peruse the extensions that are included; our task at
hand is to ensure that this extension pack also gets installed when VS
Code attaches to a container.

To do that, we just add the extension pack identifier (again, taking it
from the
[URL](https://marketplace.visualstudio.com/items?itemName=SAPSE.sap-ux-fiori-tools-extension-pack))
to the array in our devcontainer.json configuration. Here's what it
looks like now:

```json
{
  "name": "Tutorial dev container",
  "build": {
    "dockerfile": "Dockerfile",
  },
  "extensions": [
    "sapse.vscode-cds",
    "sapse.sap-ux-fiori-tools-extension-pack"
  ]
}
```

## Step 11: Install Yeoman

The final step in this prerequisites tutorial is to install Yeoman, a
tool for scaffolding web apps. This is a Node.js based tool and can be
installed like the other tools we've already installed - the ui5 CLI
and the CAP tools, i.e. via npm install.

For completeness, let's manually install it inside our current
container, just to get a feel for it, and then add the package name
"yo" to the list in the RUN line in our Dockerfile.

First, here's installing it in our running test container:

```shell
root ➜ / $ npm install --global yo
[...]

added 728 packages, and audited 729 packages in 55s

root ➜ / $
```

And adding the package to the list in our Dockerfile means that it now
looks like this:

```dockerfile
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:${VARIANT}

RUN wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | apt-key add - ;
  echo "deb https://packages.cloudfoundry.org/debian stable main" | tee /etc/apt/sources.list.d/cloudfoundry-cli.list

RUN apt-get update
  && apt-get -y install --no-install-recommends cf7-cli

RUN su node -c "npm install -g @ui5/cli @sap/cds-dk yo"
```

## Considering the meta prerequisites

In a delicious turn of events, this prerequisite tutorial has its own
set of prerequisites, which are detailed right at the start:

![](/images/2022/01/screenshot-2022-01-27-at-09.24.55.png)

The image upon which our containers are going to be created are Linux
based, so we don't need to pay attention to any of the macOS specific
prerequisites in this list.

Neither should we need to pay attention to the Windows specific
prerequisite (installing sqlite) as on macOS and any normal (i.e. full
sized) distribution of Linux, sqlite is installed by default.

But we're running on a cut-down distribution, so we'll need to install
sqlite with the Debian package manager. That's easy - all we need to do
is add the sqlite package to the apt-get install command in the
Dockerfile.

Now our Dockerfile finally looks like this:

```dockerfile
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:${VARIANT}

RUN wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | apt-key add - ;
echo "deb https://packages.cloudfoundry.org/debian stable main" | tee /etc/apt/sources.list.d/cloudfoundry-cli.list

RUN apt-get update
&& apt-get -y install --no-install-recommends cf7-cli sqlite

RUN su node -c "npm install -g @ui5/cli @sap/cds-dk yo"
```

## Giving the image a spin

We got to the end of the tutorial prerequisite steps and have accounted
for all of them that need attention either in the Dockerfile, in the
devcontainer.json file. Rather than end this part 2 here, let's have a
bit of fun and put our fledgling Dockerfile to the test, manually here,
to make sure it holds together.

We'll build an image from it, and start a container based on that
image, jumping into a shell environment like we did before. Before we do
that, let's exit the existing container (either by entering "exit" or
using Ctrl-D at the command line) and it should be automatically removed
because of the \--rm option we specified when creating it.

Now, back on our host, let's build the image, and give it the
imaginative name "tut-image-test":

```shell
; docker build -t tut-image-test .
[+] Building 0.1s (8/8) FINISHED
=> [internal] load build definition from Dockerfile 0.0s
=> => transferring dockerfile: 37B 0.0s
=> [internal] load .dockerignore 0.0s
=> => transferring context: 2B 0.0s
=> [internal] load metadata for mcr.microsoft.com/vscode/devcontainers/javascript-node:16-buster 0.0s
=> [1/4] FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:16-buster 0.0s
=> CACHED [2/4] RUN wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key 0.0s
=> CACHED [3/4] RUN apt-get update && apt-get -y install --no-install-recommends cf7-cli sqlite 0.0s
=> CACHED [4/4] RUN su node -c "npm install -g @ui5/cli @sap/cds-dk yo" 0.0s
=> exporting to image 0.0s
=> => exporting layers 0.0s
=> => writing image sha256:57c19dcfd263997e737b723febbf4481bf8f06d7eec3044000b9830716478ac1 0.0s
=> => naming to docker.io/library/tut-image-test 0.0s
```

Now let's take it for a spin. Creating a container from it (again, with
the \--rm option), asking for the Bash shell, shows us this, where we
move from the command line prompt on the host (mine here is a simple
";") to the command line prompt inside the container ("root ➜ /
\$"):

```shell
; docker run --rm -it tut-image-test bash
root ➜ / $
```

The moment of truth arrives - does it have everything we need inside it?
Let's see:

```shell
root ➜ / $ cf --version
cf version 7.4.0+e55633fed.2021-11-15
root ➜ / $ sqlite -version
2.8.17
root ➜ / $ ui5 --version
2.14.4 (from /usr/local/share/npm-global/lib/node_modules/@ui5/cli/bin/ui5.js)
root ➜ / $ cds --version
@sap/cds: 5.7.3
@sap/cds-compiler: 2.11.2
@sap/cds-dk: 4.7.3
@sap/cds-foss: 3.0.0
@sap/eslint-plugin-cds: 2.3.0
Node.js: v16.13.2
home: /usr/local/share/npm-global/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds
root ➜ / $ yo --version
4.3.0
root ➜ / $
```

🎉 Excellent!

We have a Docker image that we can create containers from, and the image
has all the tools we need according to the prerequisites. We also have a
devcontainer.json file that tells VS Code about the container it is to
create and connect to, and the extensions to install in that context.

In the third and final part of this series, we'll connect everything
together in the context of VS Code, and see where that brings us:

[Boosting tutorial UX with dev containers part 3 - containers into
action](/blog/posts/2022/02/01/boosting-tutorial-ux-with-dev-containers-part-3-containers-into-action/)

See you there!

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/boosting-tutorial-ux-with-dev-containers-part-2-embedding-prerequisite/ba-p/13540611)
