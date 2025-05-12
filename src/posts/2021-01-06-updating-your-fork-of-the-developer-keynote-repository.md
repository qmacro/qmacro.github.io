---
layout: post
title: "Updating your fork of the Developer Keynote repository"
date: 2021-01-06
tags:
  - sapcommunity
  - teched
---
*If you've forked the SAP TechEd Developer Keynote repository on GitHub
recently, there have been some additions and improvements. This post
shows you how you can update your fork so that it contains all the new
material.*

If you didn't see the Developer Keynote at SAP TechEd last month, go
over to [SAP TechEd Developer Keynote DK100 -- The
Story](/blog/posts/2020/11/19/sap-teched-developer-keynote-dk100-the-story/)
and watch it. Hopefully you'll find it fun, interesting and inspiring.
All the code and configuration for everything you saw in that keynote is
in a repository on GitHub:

<https://github.com/SAP-samples/teched2020-developer-keynote>

We'll be digging into this repository on the upcoming [Hands-on SAP Dev
live stream episode](https://www.youtube.com/watch?v=9Q-84fxe0Jg) which
is now next week **Fri 15 Jan at 0800 GMT** - set a reminder and join
us!

## Background

We've been
[encouraging](/tweets/qmacro/status/1337488442159222785) you
to fork this repository, i.e. create your own copy of it.

Why have we been doing that? Well, there's a lot of material in that
repository, and we want to help you get the most out of it, with your
own copy.

But if you'd just cloned it to a local environment, you wouldn't be
able to enjoy the GitHub Actions-based workflow that is part of the
repository; this workflow builds and publishes Docker images (for some
of the components) to a registry associated with your own GitHub
repository \... and these images can then be pulled into the Kyma
runtime.

For this to work, you need to run the workflow in your own repository on
GitHub, not in the SAP-samples one.

In this blog post, we'll be using me as an example - I forked the repo
last month too, to [my "qmacro" GitHub
account](https://github.com/qmacro). So where you see "qmacro",
substitute your own GitHub user.

## Forking and cloning

For those of you who are unfamiliar with the terms "fork" and
"clone" in this context, here's a very brief explanation:

"fork" - take a complete copy of a repository; this makes most sense
in a GitHub context, where you may want to start working on something in
your own account, based on something in another account. You may even
plan to make changes and offer those changes to the owner of the
original repository that you forked (via a "pull request").

"clone" - this is also taking a copy of a repository's contents, but
is a more a git thing (the tool / protocol) than a GitHub thing (the
developer collaboration website). It's usually for bringing a copy of a
repository to a development environment that's local to you, so you can
work on it.

There are relationships between repositories; these are referred to
using the term "remote". Conventionally, the relation between a forked
repository, and where it was forked from, is expressed with a remote
called "upstream" (the forked repository points to its source via this
remote). Similarly, the relation that a cloned repository has with where
it was cloned from is expressed with a remote called "origin".

Here's what those relationships look like, in the context of:

-   our **SAP-samples** based Developer Keynote repository
-   a fork of that repository to my **qmacro** account
-   a clone of that forked repository to a development environment

![](/images/2021/01/fork-clone-1.gif)


## A quick check before we update

Before we proceed, let's take a quick look at the current situation.

I forked the repository last month, to my "qmacro" GitHub account.
This is what my forked repository looks like right now:

![](/images/2021/01/Screen-Shot-2021-01-06-at-16.07.31.png)


Notice the last update showing here was 29 days ago (basically, from
just before I made the fork).

But if we look at the source of the fork, i.e. the original Developer
Keynote repository at
<https://github.com/SAP-samples/teched2020-developer-keynote>, this is
what it's showing right now:

![](/images/2021/01/Screen-Shot-2021-01-06-at-16.08.52.png)

Notice that the last update here was only a few minutes ago (yes, it was
me, updating the original repository - that's not confusing, right?
🤪); also notice that the content is different - there's a new
".github/workflows/" directory, for example.

## Updating the fork

Now that we're clear on forks, clones and the relationship between
them, and know that there is indeed content that we're missing in our
"qmacro" fork, it's time to use those "remote" relationships, with
a few git command invocations, to bring the fork up to date.

Here's what we're going to do: Clone the "qmacro" repository to a
local environment, then add the "upstream" remote relationship
pointing to the original source. Next, pull the "main" branch from
that "upstream" remote into the clone to bring down all the updates,
and finally push the now-merged updates in the clone to the "origin"
of the clone (i.e. the repository in the "qmacro" GitHub account).

Here goes!

*Clone the "qmacro" repository to a local environment:*

```shell
; git clone https://github.com/qmacro/teched2020-developer-keynote.git
Cloning into 'teched2020-developer-keynote'...
remote: Enumerating objects: 2123, done.
remote: Counting objects: 100% (2123/2123), done.
remote: Compressing objects: 100% (975/975), done.
remote: Total 2123 (delta 983), reused 2123 (delta 983), pack-reused 0
Receiving objects: 100% (2123/2123), 18.79 MiB | 4.14 MiB/s, done.
Resolving deltas: 100% (983/983), done.
```

*Add the "upstream" remote relationship pointing to the original
source (moving into the new directory first, and then double-checking
all the remotes, because we're curious):*

```shell
; cd teched2020-developer-keynote/ 
; git remote add upstream https://github.com/SAP-samples/teched2020-developer-keynote.git
; git remote -v
origin https://github.com/qmacro/teched2020-developer-keynote.git (fetch)
origin https://github.com/qmacro/teched2020-developer-keynote.git (push)
upstream https://github.com/SAP-samples/teched2020-developer-keynote.git (fetch)
upstream https://github.com/SAP-samples/teched2020-developer-keynote.git (push)
```

*Pull the "main" branch from that "upstream" remote into the clone,
to bring down all the updates (lots of lines redacted for brevity):*

```shell
; git pull upstream main
remote: Enumerating objects: 195, done.
remote: Counting objects: 100% (195/195), done.
remote: Compressing objects: 100% (14/14), done.
remote: Total 768 (delta 184), reused 186 (delta 181), pack-reused 573
Receiving objects: 100% (768/768), 4.34 MiB | 1.55 MiB/s, done.
Resolving deltas: 100% (418/418), completed with 21 local objects.
From https://github.com/SAP-samples/teched2020-developer-keynote
 * branch            main       -> FETCH_HEAD
 * [new branch]      main       -> upstream/main
Updating fc07e54..bc0aa2f
Fast-forward
 .github/workflows/image-build-and-publish.yml          |  34 ++++++++
 usingappstudio/README.md                               | 149 +++++++++++++++++++++++++++++++++++
 usingappstudio/appstudiosetup                          |  54 +++++++++++++
 create mode 100644 kymaruntime/images/run-workflow.png
 create mode 100644 kymaruntime/images/s4mock-package.png
 create mode 100644 kymaruntime/images/workflow.png
 rename s4hana/event/settings => message-bus-settings.sh (53%)
 create mode 100644 usingappstudio/images/open-workspace.png
 ```

*Finally, push the now-merged updates in the clone to the "origin" of
the clone (i.e. the repository in the "qmacro" GitHub account):*

```shell
; git push origin main
Enumerating objects: 791, done.
Counting objects: 100% (791/791), done.
Delta compression using up to 16 threads
Compressing objects: 100% (325/325), done.
Writing objects: 100% (768/768), 4.33 MiB | 905.00 KiB/s, done.
Total 768 (delta 423), reused 751 (delta 406)
remote: Resolving deltas: 100% (423/423), completed with 20 local objects.
To https://github.com/qmacro/teched2020-developer-keynote.git
   fc07e54..bc0aa2f  main -> main
```

That's it! We've effectively pulled down updates from the original
repository (top left in the diagram), to our clone in the development
environment (bottom middle in the diagram), and then pushed those merged
updates up to the origin of our clone, i.e. the repository on GitHub
that we'd created as a fork (top right in the diagram).

Now, in GitHub, the repository in the "qmacro" account looks like
this:

![](/images/2021/01/Screen-Shot-2021-01-06-at-16.52.31.png)

All nice and up to date!

## Wrapping up

Of course, there's another brute force way of "updating" your fork -
and that is to simply delete it and re-do the fork. But that approach is
far too blunt, would cause any changes you'd made to your fork be lost,
and doesn't teach us anything 🙂

I've put together a script containing the commands used here, and have
pushed that to the Developer Keynote repository too - it's
[2-clone-and-update](https://github.com/SAP-samples/teched2020-developer-keynote/blob/main/forkupdateutils/2-clone-and-update).
Have a look and feel free to play around. If you're there, have a look
at
[1-setup](https://github.com/SAP-samples/teched2020-developer-keynote/blob/main/forkupdateutils/1-setup) -
can you tell what I wrote it for? 🙂

We'll be covering some of this on [next week's Hands-on SAP Dev live
stream episode](https://www.youtube.com/watch?v=9Q-84fxe0Jg) - I hope to
see you there!

![](/images/2021/01/Screen-Shot-2021-01-07-at-13.40.53-1.png)

---

[Originally published on SAP Community](https://community.sap.com/t5/sap-teched-blog-posts/updating-your-fork-of-the-developer-keynote-repository/ba-p/13461277)
