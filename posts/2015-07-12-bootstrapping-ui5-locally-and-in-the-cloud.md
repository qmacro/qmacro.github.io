---
layout: post
title: Bootstrapping UI5 Locally and in the Cloud
tags:
- bootstrap
- hcp
- openui5
- saphcp
- sapwebide
- webide
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 9 by [DJ Adams](//qmacro.org/about/)**

![Screenshot of files in a UI5 app directory]( {{ "/img/2018/02/Screen-Shot-2015-07-11-at-16.05.52.png" | url }})

Like many developers who find themselves building a lot with UI5, I find my working environment is mostly a local one, supplemented by activities in the cloud.

**Local Environment**

More precisely, while I often use the excellent [SAP Web IDE](http://scn.sap.com/docs/DOC-55465) – for training, generating starter projects and custom Fiori work, my main development workflow is based upon tools that are local to my workstation. In my particular case, that’s most often my MacBook Pro running OSX, but sometimes a Debian-based environment running in a chroot on my Chromebook, courtesy of the awesome [crouton](https://github.com/dnschneid/crouton) project. I use tools that work for me, that don’t get in the way of my flow, and at the bare essentials level, that means a decent editor (Vim or Atom), a local webserver (based on NodeJS), and a runtime platform that doubles as debugging, tracing and development (Chrome).

**Cloud Environment**

When I’m working in the cloud, specifically with the SAP Web IDE, the toolset is totally different. Not only that, but the bootstrapping of UI5 works slightly differently. In this short post, I wanted to explain what I do to flatten any speedbumps when transitioning between the two environments. The worst thing for me would be to have to alter my codebase slightly to take account of different runtime environments.

**Different UI5 Versions**

Locally, I maintain a variety of different UI5 versions, that I’ve picked up over the months and years. You never know when you’ll need to go back to a previous version, or even look through the complete history, to see how something has changed. This is what the contents my local ~/ui5/ folder look like:

![Screenshot of my ui5 directory]( {{ "/img/2018/02/Screen-Shot-2015-07-11-at-16.37.15-624x545.png" | url }})

I use the NodeJS-based static_server.js  script to serve files from this folder, as well as another folder which contains my UI5 projects. From here, I can access different UI5 versions by changing the location that the UI5 bootstrap looks. (Note that while I can and do often access older versions, I pretty much always develop against the latest version, unless there’s a good reason not to … access to older versions is almost always for reference purposes.)

Usually I specify “latest” in the URL, which refers to the symbolic link in the folder above, which (via the use of the small “setlatest” script) in turn points to whatever folder represents the latest unpacked zip:

![Screenshot showing relation of local URL and UI5 version]( {{ "/img/2018/02/Screen-Shot-2015-07-11-at-16.10.56-624x75.png" | url }})

If I want to refer to an older version, I do so like this:

![Screenshot of another relation between local URL and UI5 version]( {{ "/img/2018/02/Screen-Shot-2015-07-11-at-16.11.11-624x75.png" | url }})

The same approach with the URL path applies to the contents of the “src” attribute in the UI5 bootstrap:

![UI5 bootstrap with latest UI5 version]( {{ "/img/2018/02/Screen-Shot-2015-07-12-at-08.50.35.png" | url }})

**Harmonising Local and Cloud Bootrapping**

However, this doesn’t play well with the SAP Web IDE, at least not directly. So I’ve come up with an approach that minimises the fuss and disruption when taking a UI5 app repo that I’ve developed locally, and cloning it for use in the SAP Web IDE on the HANA Cloud Platform (HCP) environment, or vice versa.

Let’s look at an almost empty UI5 project folder that I’ve created locally:

![app directory structure showing symbolic link for resources]( {{ "/img/2018/02/Screen-Shot-2015-07-11-at-16.22.18-624x191.png" | url }})

In it, we have the index.html which contains a UI5 bootstrap that looks like this:

![UI5 bootstrap with relative reference to resources]( {{ "/img/2018/02/Screen-Shot-2015-07-12-at-08.50.49.png" | url }})

The “src” attribute refers to a resources folder in the same location as the containing index.html. The value of this attribute (“resources/sap-ui-core.js”) is pretty much the de facto standard for “the location of the UI5 runtime”, so it’s sensible to change this only if you have a very good reason, if not only because you’re starting a battle that you might not want to see through.

If you look at the folder listing above, you’ll see that this resources folder is actually a symbolic link to the resources folder in the “latest” UI5 version, as described earlier (yes, so we have a symbolic link following a symbolic link). So we’re bootstrapping whatever the latest version of UI5 is.

We’re not interested in having this in our UI5 application repo (it would be of no use in most other contexts) so in our .gitignore file, we exclude it:

![contents of .gitignore]( {{ "/img/2018/02/Screen-Shot-2015-07-11-at-16.23.26.png" | url }})

When we want to run the application in the HCP context, via SAP Web IDE, we use a mapping file that translates our bootstrap “src” attribute URL into a resource that is available globally on HCP. This mapping file is neo-app.json, and here, it contains this:

![contents of neo-app.json]( {{ "/img/2018/02/Screen-Shot-2015-07-11-at-16.25.20.png" | url }})

The path “resources” is mapped to the target “sapui5″ service at “/resources”. This means that the script element in our index.html can successfully resolve and bootstrap UI5 from the right place, with zero changes between my local environment and HCP.

With my “resources” symbolic link in place, along with the neo-app.json mapping, I can enjoy a smooth transition between local and cloud based development when I’m working on UI5 development with the latest version. It’s a simple technique; get it in place, and you could be looking at some happy productivity gains, without loss of any reference to older UI5 versions locally.


