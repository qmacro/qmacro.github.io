---
layout: post
title: "Set up VS Code on Chrome OS for local Application Programming Model development"
date: 2018-10-16
tags:
  - sapcommunity
---

*In this post I walk through the process I used to set up a development
environment for CAP on my Chromebook.*

(See the [Updates](#updates) section end of this post for a couple of
notes on things that have changed since this content was published.)

I'm a big fan of Chrome OS, it's my primary choice for computing for
many reasons including high security, consistency, efficiency and
practicality. I have a lot of devices running it - a Google Pixelbook as
well as an older Samsung Chromebook, an ASUS Chromebit and a shiny new
ASUS Chromebox - the N005U. I even have a version of Chrome OS running
on my old iMac 24", via Neverware's
[CloudReady](https://www.neverware.com/) system.

The advent of beta support for Linux on Chrome OS is very interesting
and an opportunity for me to try out running Visual Studio Code (VSCode)
locally. I wasn't disappointed.

I'm also very interested in the Application Programming Model for SAP
Cloud Platform, and its agnostic approach to development environments
and deployment targets & runtimes. I installed the cds tool and the
extension for VSCode to get a feel for local development with the model
on Chrome OS. This post is a brief account of the steps I took, in case
you want to do that also.

## Turning on Linux support

Initially only in the Chrome OS beta channel, the support for Linux, at
least on my Pixelbook and Chromebox is now also available on the stable
channel. That said, I use the beta channel on both of these devices, in
case you're wondering.

Turning it on is simply a matter of a single click in the settings,
whereupon a Linux container will be downloaded and started up:

![](/images/2018/10/Screenshot-2018-10-16-at-15.22.18.png)

A short while later, a lovely calming terminal appears, the sign for me
of a real operating system. This signals the successful completion of
the process:

![](/images/2018/10/Screenshot-2018-10-16-at-17.23.16.png)

## Installing VS Code and CDS Language Support

(See the end of this post for an update on this.)

VS Code is available for different platforms from the "[Download Visual
Studio Code](https://code.visualstudio.com/download)" page. As the
image is Debian GNU/Linux 9 (you can see this in the /etc/issue file), I
chose the 64 bit .deb file. At the time of writing, this
is code_1.28.1-1539281690_amd64.deb reflecting VS Code version 1.28.

While I was in download mode, I went to the [SAP Development Tools for
Cloud](https://tools.hana.ondemand.com/#cloud) download page and
downloaded the official CDS Language Support feature for VS Code:

![](/images/2018/10/Screenshot-2018-10-16-at-17.34.56.png)

Note that as the Linux support is via a container, you have to transfer
downloaded files to it. The File Manager makes this easy. I just dragged
the two downloaded files into the "Linux files" folder that represents
the home directory of "qmacro" (my Google ID) in the terminal above:

![](/images/2018/10/Screenshot-2018-10-16-at-15.51.41.png)

You can install Linux packages like the .deb file very easily, by using
the file's context menu item "Install with Linux (Beta)". I did this
for the VS Code package:

![](/images/2018/10/Screenshot-2018-10-16-at-15.52.15.png)

and in a short time received a notification that the install had
completed:

![](/images/2018/10/Screenshot-2018-10-16-at-15.53.45.png)

I then had a new icon in the tray:

![](/images/2018/10/Screenshot-2018-10-16-at-15.54.01.png)

I started VS Code up and used the instructions on the SAP Development
Tools for Cloud download page (see above screenshot - basically
following "step 3") to install the CDS Language Support extension
directly from the VSIX file.

So far so good!

## Install other extensions

I installed a couple of other VSCode extensions, but these aren't
essential. I'm a big vim user, so I use the Vim extension for VSCode,
and I also installed the SQLite extension for comfortable in-IDE
browsing of SQLite databases.

![](/images/2018/10/Screenshot-2018-10-16-at-19.49.32.png)

## Installing Node.js

Next I needed to install Node.js. There are many ways to do this, but I
find the [Node Version Manager](https://github.com/creationix/nvm) (nvm)
to be very useful, and it has a nice side effect of preventing you from
getting into a tangle with root privilege requirements - everything you
do in Node.js installations via nvm should *not* require the use of
root (sudo) so you can't shoot yourself in the foot.

In the Linux terminal, I used the curl-based installation approach
described on the nvm GitHub repository homepage:

```shell
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

and after a few seconds I was ready to use nvm to install version 8 of
Node.js, which I did like this:

```shell
nvm install 8
```

Simple! That gave me node version 8.12.0 and npm version 6.4.1.

## Installing the cds tool

(See the end of this post for an update on this.)

CDS is at the heart of the Application Programming Model and there's
command line support in the form of a tool called 'cds' in the
'@sap' npm namespace, available from the SAP NPM registry. Read more
about this registry in this post by sven.kohlhaas "[SAP NPM Registry
launched: Making the lives of Node.js developers
easier](https://blogs.sap.com/2017/05/16/sap-npm-registry-launched-making-the-lives-of-node.js-developers-easier/)".

To make use of the '@sap' namespaced modules, it's necessary to tell
npm about this registry:

```shell
npm config set @sap:registry https://npm.sap.com
```

Now we can install the cds tool. I did it globally, rather than for a
specific Node.js project. Note that because of the nice side effect of
nvm mentioned earlier, globally still means within my user space:

```shell
npm i -g @sap/cds
```

That's the cds tool installed.

If you're following the SAP TechEd related set of exercises that I
mentioned in "[Application Programming Model for SAP Cloud Platform --
start
here](https://blogs.sap.com/2018/10/10/application-programming-model-start-here/)",
then you probably also want to explicitly install the cds generator
too:

```shell
npm i -g @sap/generator-cds
```

## All set!

At this point, I'm all set, and if you've been following along, you
are too!

We've got a lovely local development environment for the Application
Programming Model, on a proper operating system, with great tools and a
competent IDE with rich support for the CDS work we'll be doing.

![](/images/2018/10/DpppwFfW0AAq-MU.jpg)

If you're wondering what to do next, you might want to try the
exercises in the GitHub repository
"[SAP/cloud-sample-spaceflight-node](https://github.com/SAP/cloud-sample-spaceflight-node)" -
happy hacking!

<a name="updates"></a>
## Updates

2020-09-28 Since the publication of this post, a couple of things have
changed. First, you can get the VS Code Extension for CAP directly from
the Visual Studio Marketplace, see the [July 2020 CAP Release
Notes](https://cap.cloud.sap/docs/releases/july20) for details. Also,
the Node.js packages for CAP are now in the public NPM registry, and the
main wrapper package for development is
[\@sap/cds-dk](https://www.npmjs.com/search?q=sap%2Fcds-dk). This means
that to install CAP for Node.js globally, all you need to do is:
`run npm i -g @sap/cds-dk`.

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/set-up-vs-code-on-chrome-os-for-local-application-programming-model/ba-p/13377868)
