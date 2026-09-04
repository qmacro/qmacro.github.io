---
title: "Boosting tutorial UX with dev containers part 3 - containers into action"
date: 2022-02-01
description: Putting everything together by connecting VS Code to the dev container and running through the first steps of the CAP tutorial.
tags:
  - sap-community-post
  - containers
  - docker
  - cap
  - cds
  - developer-experience
  - tutorial
---

In this three-part series I outline and demonstrate an approach to help
newcomers get started more quickly with our tutorials, by describing and
providing an environment with all the prerequisite tools installed ready
to go. This is part three, where I put the image definition and
container configuration into action.

🚨We'll be covering this topic in a #HandsOnSAPDev live stream
"[Let's explore dev containers with VS Code and Tutorial Navigator
content](https://youtu.be/AQ-6qxtAbxk)" on Fri 04 Feb at 0800 UK - pop
by and say hi, everyone is always welcome:

[![](/images/2022/02/screenshot-2022-02-01-at-13.26.10.png)](https://youtu.be/AQ-6qxtAbxk)

See also the previous posts in this three-part series:

- [Boosting tutorial UX with dev containers part 1 - challenge and
  base
  solution](/blog/posts/2022/01/27/boosting-tutorial-ux-with-dev-containers-part-1-challenge-and-base-solution/)
- [Boosting tutorial UX with dev containers part 2 - embedding
  prerequisite
  details](/blog/posts/2022/01/28/boosting-tutorial-ux-with-dev-containers-part-2-embedding-prerequisite-details/)

## Reviewing what we have created

At the end of part 2 we had completed the definition of the image, in
the form of the **Dockerfile** contents, which are as follows:

```dockerfile
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:${VARIANT}

RUN wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | apt-key add - ;
echo "deb https://packages.cloudfoundry.org/debian stable main" | tee /etc/apt/sources.list.d/cloudfoundry-cli.list

RUN apt-get update
&& apt-get -y install --no-install-recommends cf7-cli sqlite

RUN su node -c "npm install -g @ui5/cli @sap/cds-dk yo"
```

### Finalising the configuration

We also had a basic **devcontainer.json** based configuration, to help
VS Code know what to do - where to get the container from and what
extensions to install.

Before we continue, there are a couple more properties that we might
want to add to this configuration.

What we'll be building initially, in the actual tutorials (specifically
in the [Create a CAP Application and SAP Fiori
UI](https://developers.sap.com/group.btp-app-cap-create.html) group) is
a CAP application, in the first tutorial in this group: [Create a
CAP-Based
Application](https://developers.sap.com/tutorials/btp-app-create-cap-application.html).

Those of you who have read ahead and browsed the tutorial, or who have
built applications and services with CAP before will know that port 4004
is the default port that is used to listen for and respond to HTTP
requests.

One of the things we have to think about when using containers is that
they're independent with respect to the host environment and have their
own environment, in a very similar way to how virtual machines are
independent of the host too.

This means that if a service or application listens on a port inside a
container, which will be the case here because our development will take
place inside the container that we'll get VS Code to connect to, then
by default only clients inside that container will be able to connect to
that port. So there's a concept of port "publishing" or
"forwarding", meaning that a port in a container can be accessed from
outside the container.

The upshot of this is that you'll be able to continue to use the
browser on your local machine to connect with and send requests to the
app or service that's running inside your container - in this case, via
<http://localhost:4004> for example.

Docker refers to this concept as [port
publishing](https://docs.docker.com/config/containers/container-networking/#published-ports)
while in the context of VS Code and dev containers, this is called [port
forwarding](https://code.visualstudio.com/docs/remote/containers#_always-forwarding-a-port)
(a term that's common in other networking areas too).

With the **forwardPorts** property in the devcontainer.json
configuration file, we can specify which ports should be automatically
forwarded, or published, from the container to the host. So we will use
this to specify that port 4004 should be made available.

Also if, like me, running commands as the "root" user makes you
nervous, there's the **remoteUser** property with which you can specify
a different user to be in the container. Traditionally this is either
"user", or (in this sort of Node.js container environment) "node".

Adding these two properties to the configuration, we end up with this as
the final content for our devcontainer.json file:

```json
{
  "name": "Tutorial dev container",
  "build": {
    "dockerfile": "Dockerfile",
  },
  "extensions": [
    "sapse.vscode-cds",
    "sapse.sap-ux-fiori-tools-extension-pack"
  ],
  "forwardPorts": [ 4004 ],
  "remoteUser": "node"
}
```

## Putting everything into action

We're just about ready to try things out!

### Creating a project working directory

First, there's a tiny bit more general setup required, described in the
last tutorial of the [Prepare Your Development Environment for
CAP](https://developers.sap.com/group.btp-app-cap-prepare.html) group,
which is to [create a directory for
development](https://developers.sap.com/tutorials/btp-app-create-directory.html).

This is not tools related, or related to the container directly, it's
just about creating a directory to have somewhere to store the app that
you're going to create, and to have a copy of a set of templates that
will help you along the way.

Basically all we need to do here is create a directory, and then (if we
want to follow along closely with the tutorials) a subdirectory within
that called "cpapp/". Let's do that now. Note that this is on your
local machine, not in the container.

I'll create the two directories inside a local "\~/work/" directory
that I already have - you can put yours where you want. I'll use the
name "cap-tut/" for the higher level directory, and have "cpapp/"
within that:

```shell
# ~/work
; mkdir -p cap-tut/cpapp
# ~/work
; tree cap-tut/
cap-tut/
└── cpapp

1 directory, 0 files
```

The "cpapp/" directory will be the focus of our development, and it's
the directory we'll open up shortly in VS Code.

The [Create a Directory for
Development](https://developers.sap.com/tutorials/btp-app-create-directory.html)
tutorial also mentions cloning a
[repository](https://github.com/SAP-samples/cloud-cap-risk-management)
to get some app templates that you can copy.

Let's do that too:

```shell
# ~/work
; cd cap-tut/
# ~/work/cap-tut
; git clone https://github.com/SAP-samples/cloud-cap-risk-management tutorial
Cloning into 'tutorial'...
remote: Enumerating objects: 3286, done.
remote: Counting objects: 100% (3286/3286), done.
remote: Compressing objects: 100% (1050/1050), done.
remote: Total 3286 (delta 1870), reused 3235 (delta 1824), pack-reused 0
Receiving objects: 100% (3286/3286), 11.16 MiB | 8.31 MiB/s, done.
Resolving deltas: 100% (1870/1870), done.
# ~/work/cap-tut
; ls
./ ../ cpapp/ tutorial/
```

It also mentions creating a new repository of your own on GitHub. We
don't need that to test things out here, so we can leave that for now.

### Bringing in Dockerfile and devcontainer.json

What we will need to do, however, is bring in the Dockerfile and
devcontainer.json file. We want to put them in a specially named
directory within our "cpapp/" directory that we'll open up in VS
Code, so that VS Code recognises that there's some remote container
setup to do.

The directory that we want to put our Dockerfile and devcontainer.json
files in is ".devcontainer/" - this is what VS Code will recognise -
and should be at the root of our app directory ("cpapp/"). Let's
create that now too:

```shell
# ~/work
; cd cap-tut/cpapp/
# ~/work/cap-tut/cpapp
; mkdir .devcontainer
```

Finally, the Dockerfile and devcontainer.json file should go into that
new ".devcontainer/" directory.

Here's what it looks like when it's all ready:

```shell
# ~/work/cap-tut/cpapp
; tree -a
.
└── .devcontainer
    ├── Dockerfile
    └── devcontainer.json

1 directory, 2 files
```

### Starting up VS Code

Taking our cue from the first part of the first tutorial in the [Create
a CAP Application and SAP Fiori
UI](https://developers.sap.com/group.btp-app-cap-create.html) group,
i.e. the [Create a CAP
Application](https://developers.sap.com/tutorials/btp-app-create-cap-application.html)
tutorial, it's now time to open up the "cpapp/" directory in VS Code
and get started.

As I'm still in the "cpapp/" directory from just before, I can use
the following command (which is also shown in the tutorial):

```shell
; code .
```

This will start VS Code and the "." is of course a reference to the
current directory, i.e. "cpapp/".

Note that the tutorial mentions carrying out "cds init" - we don't
need to do that here, and shouldn't, we'll be doing that within the
container! The whole point is of course that if you've followed along,
and haven't already installed the
@sap/cds-dk
package globally, you wouldn't even be able to run "cds init" on your
local machine anyway 🙂

Let's see what happens. First, we get a nice shiny VS Code screen:

![](/images/2022/01/screenshot-2022-01-27-at-16.02.44.png)

But hey, what's that message in the bottom right corner? Let's take a
closer look:

![](/images/2022/01/screenshot-2022-01-27-at-16.02.53.png)

Oooh!

This has happened because VS Code has indeed recognised the
".devcontainer/" directory. Of course, the only sensible option for
curious people like us is to press the **Reopen in Container button**,
right?

Doing that causes VS Code to reopen, but in doing so, VS Code has acted
upon the contents of the **devcontainer.json** file which has caused a
container to be created based on the image described by our Dockerfile
that's referenced. It's also caused our specified extensions to be
installed.

During this process, you may have seen this message appear briefly in
the bottom right corner:

![](/images/2022/01/screenshot-2022-01-27-at-16.04.52.png)

If you'd have selected the link, you'd have been taken to the details
of what was going on, details that look like this:

![](/images/2022/01/screenshot-2022-01-27-at-16.05.28.png)

If you missed it, you can always get to the log via the Command Palette
with the command **Remote-Containers: Show Container log** as well:

![](/images/2022/01/screenshot-2022-01-27-at-16.09.58.png)

The eagle-eyed amongst you may be wondering about that (1) next to the
"PORTS" heading in the screenshot of the dev container log.

You will probably not be surprised that this is because there's an
entry in the list of ports that are exposed, just like we requested with
the forwardPorts property:

![](/images/2022/01/screenshot-2022-01-27-at-16.17.25.png)

So at this stage we're all set.

## Starting the tutorial

At this stage, you are running VS Code on your local machine, the
extensions specified are installed, and all the tools needed are in the
container which VS Code has instantiated for you.

### Opening a terminal

What's more, opening up a terminal now in VS Code will open up a shell
inside the container, with access to those tools.

Let's do that now, selecting "bash" from this menu:

![](/images/2022/01/screenshot-2022-01-27-at-16.15.04.png)

This gives us a lovely command line environment within which to work,
and to carry out the commands specified in the
[tutorial](https://developers.sap.com/tutorials/btp-app-create-cap-application.html):

![](/images/2022/01/screenshot-2022-01-27-at-16.19.48.png)

The prompt here looks a little different to what we've seen in the
previous tutorials in this series:

```shell
root ➜ / $
```

But actually it's the same pattern:

```shell
[username] ➜ [current directory] $
```

Remember that we specified that we wanted the user "node" (instead of
"root") in our container, and that we're now in our app directory
"cpapp/".

### Running cds and npm commands

Following the tutorial instructions, we're guided to initialise the CAP
project with "cds init" and then install the Node.js packages that are
listed in the package.json file that (amongst other files) the "cds
init" process creates.

Are you ready?

Running "cds init" creates various files and directories (you'll see
them appear in the Explorer on the left hand side), all of which should
be familiar to you if you've developed CAP apps or services before:

![](/images/2022/01/screenshot-2022-01-27-at-16.25.10.png)

Let's pause here for the briefest of moments, to reflect on something:
We're running VS Code locally, on our host machine, and it's showing
the sudden appearance of files and directories \... but those files and
directories are not actually local, they're inside the dev container
that VS Code has instantiated and connected to. In fact, everything now
happens inside the container.

OK, let's continue. We're now instructed to run "npm install", which
does does what you expect.

### Starting up the skeleton CAP service

The final part of the tutorial we're going to do in testing out our
container is to run "cds watch".

Bear in mind at this point we have nothing in the app, neither schema
definitions nor service definitions. This is therefore what we get:

```shell
node ➜ /workspaces/cpapp $ cds watch

cds serve all --with-mocks --in-memory?
watching: cds,csn,csv,ts,mjs,cjs,js,json,properties,edmx,xml,env,css,gif,html,jpg,png,svg...
live reload enabled for browsers
_______________________


No models found in db/,srv/,app/,schema,services.
Waiting for some to arrive...
```

Fair enough!

### Adding a schema and connecting to the service

At this stage the tutorial suggests copying [a schema
definition](https://github.com/SAP-samples/cloud-cap-risk-management/blob/5565059dc57b6d593492384e5187c7b517cc411b/templates/create-cap-application/db/schema.cds)
from the templates directory of the repository
([SAP-samples/cloud-cap-risk-management](https://github.com/SAP-samples/cloud-cap-risk-management))
that we cloned into the "tutorial/" directory.

So let's do that, by creating a new file in the "db/" directory
called **schema.cds** and pasting the following contents in there - you
can copy/paste this content here as it's exactly that schema definition
in the repository:

```cds
    namespace sap.ui.riskmanagement;
    using { managed } from '@sap/cds/common';

    entity Risks : managed {
      key ID : UUID @(Core.Computed : true);
      title : String(100);
      prio : String(5);
      descr : String; 
      miti : Association to Mitigations;
      impact : Integer;
      criticality : Integer;
    }

    entity Mitigations : managed {
      key ID : UUID @(Core.Computed : true);
      description : String;
      owner : String;
      timeline : String;
      risks : Association to many Risks on risks.miti = $self;
    }
```

Once you've pasted it in, unless you've disabled automatic save, VS
Code will save the contents of your new schema.cds file (do it manually
if it doesn't).

By the way, notice at this point that the CDS content saved in
schema.cds is automatically colour-coded, and that's thanks to the [SAP
CDS Language
Support](https://marketplace.visualstudio.com/items?itemName=SAPSE.vscode-cds)
extension that has been installed according to our devcontainer.json
configuration.

Then, through the magic of the still-running "cds watch" process, our
fledgling service comes to life!

![](/images/2022/01/screenshot-2022-01-27-at-16.43.10.png)

What's more, VS Code helpfully points out that we now have a service
listening on port 4004:

![](/images/2022/01/screenshot-2022-01-27-at-16.47.17.png)

So what are we going to do here? **Open in Browser** of course!

As you do that, remember that this is a link from VS Code running
locally, to your browser also running locally on your machine, but it's
connecting to the CAP based service running inside the container. This
would be a good time to stop again and think about what this means for a
second.

Once you've finished pondering [life, the universe and
everything](https://en.wikipedia.org/wiki/Life,_the_Universe_and_Everything)
related to development containers and
[turtles](https://en.wikipedia.org/wiki/Turtles_all_the_way_down), you
can turn to what your browser is displaying, which will look something
like this:

![](/images/2022/01/screenshot-2022-01-27-at-16.50.25.png)

Yes, that URL is indeed a "localhost" URL, but there's nothing
listening to 4004 on your local machine - the connection is being
forwarded to the container.

And yes, that's the CAP service inside your container sending that
response. It's not a very exciting response right now as there's
hardly any data or service definition to work with. But it's there,
it's alive, and it's ready for the next part of your tutorial based
learning!

## Wrapping up

I'll leave it to you to continue with the tutorial and the group -
it's a great set of learning resources!

What I hope you take away from this series is that with the power of
containers, we can improve the developer experience in many contexts -
this tutorial prerequisites based learning contexts is just the start.
But it's a start that's simple enough for us to build on and give us
further ideas, right?

There are of course many questions I've deliberately left unanswered
for now. How do we make this accessible to more than just me? How best
can we distribute images, or image definitions, and dev container
configuration? What if I don't want to use VS Code? (That's an easy
one - I use dev containers for many things, and I don't use VS Code).

Perhaps more fundamentally, however, is this question, and I'd love to
hear from you in the comments below: Does this resonate with you? Can
you see yourself using dev containers to make your life easier? Would
you enjoy tutorial prerequisite specific container configuration?

Please share your thoughts, and if you've got this far in the series,
thank you for reading!

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/boosting-tutorial-ux-with-dev-containers-part-3-containers-into-action/ba-p/13541051)
