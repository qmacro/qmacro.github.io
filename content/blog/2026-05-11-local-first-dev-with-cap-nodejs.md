---
title: Local-first dev with CAP Node.js
date: 2026-05-11
tags:
  - cap
  - mocking
  - local
  - auth
  - remoteservices
  - messaging
  - data
  - seriespost
description: Here's an overview of a set of related posts on mocking, in the context of local-first development with CAP Node.js.
---

<a name="talk"></a>
This series post is related to a talk I'm putting together:

> **Local-first development with CAP Node.js - mock all the things!**
>
> As developers we need to be free of distractions plus a tight and speedy
> development loop. But definitely not at the expense of ignoring or postponing
> important design decisions. CAP's mocking facilities abstracts us from much
> tedium and ceremony, allowing us to iterate fast on data, auth, messaging and
> remote services while we develop. This session shows you what, and how.

There's a repo for the themes and demos in this talk at
<https://github.com/qmacro/cap-nodejs-local-first-development/>.

You can read more about the context of this talk in the section below.

## The posts

- [Mocking auth](/blog/posts/2026/05/11/local-first-dev-with-cap-node-js-mocking-auth/) (11 May)
- [Mocking remote services](/blog/posts/2026/05/13/local-first-dev-with-cap-node-js-mocking-remote-services/) (13 May)
- Mocking data (coming soon)
- Mocking messaging (coming soon)

## More context

There are a couple of aspects of development that come together for the perfect
(positive) storm of focused rapid iteration that results in a solid and
complete foundation for a production offering, from the outset. They are:

- a tight feedback loop within which we can iterate rapidly on design and
  implementation
- local-first facilities for everything we need to get going, with minimum
  setup and configuration

As part of this second aspect, being able to easily fold in key design
requirements and real world facilities from the very start means that we don't
avoid them, or put them off until it's too late. Instead, we can embrace and
address them right from the start of the iteration cycles, and avoid the
build-up of design debt. The CAP development kit includes tools and affordances
that make this easy for us to do, in the form of mocking.
