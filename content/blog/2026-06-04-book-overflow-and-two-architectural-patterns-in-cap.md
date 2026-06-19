---
title: Book Overflow and two architectural patterns in CAP
date: 2026-06-04
tags:
  - bookoverflow
  - domaindrivendesign
  - outbox
  - hexagonalarchitecture
  - cap
description: In this short post I note a couple of software architecture patterns that were mentioned in a recent Book Overflow episode, patterns that are clear and present in CAP.
---

[Book Overflow](https://bookoverflow.io/) is "a long-form discussion podcast
for software engineers" and one of the shows to which I'm subscribed.

The recent episode 118 is one in [the series where Carter and Nathan
discuss](https://bookoverflow.io/episodes/ep_at1583mmii2kreerjovku7ed) the book
[Learning Domain-Driven Design: Aligning Software Architecture and Business
Strategy](https://www.oreilly.com/library/view/learning-domain-driven-design/9781098100124/)
by Vlad Khononov.

I listened to this episode today and found that, as usual, the two go into great
depth and draw on their thoughtfulness and experience to tease out details and
connect the dots for us listeners.

Covered in their discussions were a couple of patterns that resonated with me:

- Ports And Adapters
- Transactional Outbox

Both these patterns live and breathe strongly within CAP, from a philosophical
standpoint but also from a place that drives the fundamental design of the
framework and how it manifests for us developers. So I thought it would be
worth both highlighting this episode, series, and podcast, while also
connecting the patterns and where they are in CAP.

## Ports and adapters

The Ports And Adapters pattern is another name for [Hexagonal
Architecture](https://alistair.cockburn.us/hexagonal-architecture/), brought
into this world and popularised by Alistair Cockburn. It's the ultimate
approach to making agnosticism and abstraction first class players in system
design.

![Alastair's Hexagonal Architecture diagram from his original
article](/images/2026/06/hexagonal-architecture-diagram.png)

(Nathan playfully observed that the hexagon isn't really used to the max, with
only four sides used in the illustration. I may be misremembering, but I think
Alistair might have picked the hexagon as it was different from other boxy
shapes available in a classic software diagramming template he had to hand,
plus the "extra" sides lend themselves to further expansion by folks using the
diagram to express their own usage of the pattern.)

Of course, we know that Hexagonal Architecture is [a core concept in
CAP](https://cap.cloud.sap/docs/get-started/concepts#hexagonal-architecture),
one that supports CAP's agnostic-by-design approach to pretty much everything.
It also is a fundamental enabler of the CAP developer experience - [grow as
you
go](https://cap.cloud.sap/docs/get-started/features#jumpstart-grow-as-you-go)
for rapid prototyping with
[mocks](https://qmacro.org/blog/posts/2026/05/11/local-first-dev-with-cap-node-js/)
followed by a seamless transition to production grade services when
appropriate.

## Transactional outbox

The Transactional Outbox pattern is one that we see reminders of while
developing, with the built-in `outbox` table. This pattern allows the
coordination of a typical enterprise scenario where data needs to be updated
and an event needs to be sent to a remote system.

The requirement to have both (synchronous and asynchronous) parts as a
transactional unit presents challenges, but by deferring the actual delivery of
the event to a separate service, the two parts can coalesce and indeed be
treated as a unit that collectively either works or doesn't.

Facilitating this is an "outbox" for events, which is at the heart of this
pattern, and which [CAP has had for a few years
now](https://cap.cloud.sap/docs/guides/events/event-queues).

## Further reading

The [Microservices Architecture](https://microservices.io/index.html) website
is a great resource and has a page on the [Transactional
Outbox](https://microservices.io/patterns/data/transactional-outbox.html)
pattern. For an overview of Ports And Adapters, Alistair's [original
article](https://alistair.cockburn.us/hexagonal-architecture) is still well
worth the read.

For more on CAP design and philosophy, see the blog posts (and videos) in [The
Art and Science of
CAP](/blog/posts/2024/12/06/the-art-and-science-of-cap/) series with Daniel
Hutzel himself.
