---
title: CAP September 2026 release
date: 2026-09-24
tags:
  - cap
  - developernews
description: An overview of what the September 2026 release of CAP brings.
---

The [September 2026 release of
CAP](https://cap.cloud.sap/docs/releases/2026/sep26) is out. This is the first
minor release following the major release upgrade in June of this year, and
brings CAP Node.js to 10.1 and CAP Java to 5.1.

It's "only" a minor release, but goodness me there's a lot of great stuff. Let
me take you through some of the highlights, which are split into different
categories.

## CAP Native AI

First there's the CAP Native AI category, which has come about mostly because
there's been so much work in this area. After all, CAP is the foundation for
much of our AI business solutions and central to our [AI North Star
architecture](https://architecture.learning.sap.com/docs/ai-native-north-star-architecture/platform-layer):

![The "Platform Layer" section of the AI North Star Architecture document showing
that the AI Golden Path is built upon CAP](/images/2026/09/ai-north-star-architecture-platform-layer-cap.png)

### A new guide

It's been almost a full-time job keeping track of all the progress, and keeping
our corresponding research and learning in line with what's being developed.
Luckily there's an early incarnation of a new top-level guide called [Native
AI](https://cap.cloud.sap/docs/guides/ai/), which covers all the important
topics:

- Vector embeddings: natively supported by HANA, an essential mechanism for
  AI-powered searching, matching and recommendations (particularly useful in
  UIs).

- MCP: a fundamental building block of today's agentic era, enabling agents to
  embellish their context and actually effect things in the wider world. The
  MCP adapter plugin is now GA, by the way!

- A2A: like MCP, agent support in CAP is a mere annotation away, plus optional
  Markdown based skills and guardrails in this case. What's more, in addition
  to the [mocking](/blog/posts/2026/05/11/local-first-dev-with-cap-node-js/)
  we're familiar with, we get a mocked LLM with the [agents
  plugin](https://github.com/cap-js/agents) plus a super useful UI for
  interaction. All out of the box, following CAP's classic developer-first
  approach. The agents plugin is in Gamma status right now.

> You may wish to check out our current Hands-on SAP Dev live stream series on
> [CAP in the age of AI](https://www.youtube.com/playlist?list=PLTKB1hyt4LXs)
> which covers these topics and more.

There's even a section of this new guide that's all about [integration with
Joule](https://cap.cloud.sap/docs/guides/ai/joule-integration); in the spirit
of the [release early, release
often](https://en.wikipedia.org/wiki/Release_early,_release_often) philosophy
popularised by the one and only Eric S. Raymond in his essay [The Cathedral and
the Bazaar](https://en.wikipedia.org/wiki/The_Cathedral_and_the_Bazaar), it's a
very early and raw release, just hinting at the structure and content to come.

### A scenario to try out all the AI concepts

Going back to talk of agents, it's sometimes hard to conjure up a
realistic-enough scenario to kick the tyres with, but CAP has you covered too
with the [XTravels Sample for
AI](https://cap.cloud.sap/docs/guides/ai/xtravels-sample); it's not too simple
as to be underwhelming, but not overly dry and boring either. It allows us to
explore lots of different concepts and protocols, such as subagency,
delegation, A2A and MCP, as well as the more classic ideas of reuse, data APIs
and more.

![CAP/AI gif](/images/2026/09/cap-ai.gif)

### Much love for vector embeddings

While some features might come to CAP Node.js first, and then to CAP Java, or
vice versa, things are generally eventually consistent. CAP-native support for
vector embeddings is one such feature, already supported for CAP Java but now
also for CAP Node.js.

The [Vector Embeddings](https://cap.cloud.sap/docs/guides/ai/embeddings) guide
has also had an overhaul, which is where we can find the details of how to get
embeddings working locally with SQLite which doesn't have native support for
them. In a classic "[magic made
simple](https://qmacro.org/blog/posts/2026/07/24/timeless-principles-agnostic-design-and-the-power-of-caps-abstractions/#:~:text=one%20of%20CAP%27s%20%22-,magic%20made%20simple,-%22%20moments%2C%20and%20is)"
way, the CAP team have done a serious amount of heavy lifting and configuration
for us to emulate what's required. Kudos to the team.

### Keeping our AI overlords happy

In my not so humble opinion, the CAP documentation, affectionately and
unofficially known as "Capire", stands out as a great example of what we should
all be striving for with respect to sharing knowledge, know-how and best
practices.

The audience for this knowledge is not just limited to us humans, far from it.
One way that we make great strides forward in agentic computing is to make sure
our agents know what to do, and how to do it ... in the best possible way.

Agent skills are useful, for sure, but in the same way that we have stop-gap
measures to cover the last mile between the scope of any given language model
pre-training and the reality today, skills cover the delta between what we
consider now as best practice, and what was the previous status quo in that
regard.

To that end, it's more important than ever that documentation remains
accurate and concise, and tells us - humans and LLMs alike - what to do and how
to do it best, and in a way that is readable (and token-friendly too).

And so [the team has made machine-friendly _representations_ of the _resource_
that is
Capire](https://cap.cloud.sap/docs/releases/2026/sep26#capire-4-ai-evolution),
with the content and a sitemap in what is the lingua franca between humans and
their [AI overlords](https://www.youtube.com/watch?v=8lcUHQYhPTE) - Markdown.

![Still image from the classic "I for one welcome our insect overlords" scene
from The Simpsons](/images/2026/09/insect-overlords.png)

> For more on resources & representations, see ['Conneg' and the duality of
> weblogs](/blog/posts/2003/02/28/conneg-and-the-duality-of-weblogs/) and also
> [Coffeeshop screencast: HTTP conneg, resource representations and
> JSON](/blog/posts/2009/08/20/coffeeshop-screencast-http-conneg-resource-representations-and-json/).

## The CDS language family

The next category within which we find updates in the September 2026 release is the CDS language family. Briefly:

- Boolean expressions are now wrapped in a `CASE WHEN` construct for HANA SQL,
  as bare predicates aren't permitted in the list of elements for selection.

- It's now possible to extend views that already have a conditional clause; the
  new condition is combined with `AND`.

- When using nested inline projections, we can now use the `key` keyword;
  typically this is needed when the key elements need to be extended to inside
  the projection to provide the uniqueness required.

These are minor but really nice improvements to the life of a domain expert
or modeller, allowing us more flexibility and power as we continue to
[shift left](/blog/posts/2026/02/09/shift-left-with-cap/), avoid bloat and
moving parts, and - above all - fight the lazy agentic pattern of verbose and
unnecessary generation of almost-immediate technical debt.

## CAP Runtimes

Following the same category pattern as in the release notes, we now come to the
runtimes category, for Node.js and Java.

In fact, before we [bifurcate](https://en.wiktionary.org/wiki/bifurcate),
there's a feature in this minor release that applies to both runtimes, relating
to fuzzy search, a fault-tolerant search feature of SAP HANA Cloud. Results are
now sorted by match score, unless that order is overridden by an `$orderby`
parameter in the query.

### Node.js

Beyond the pretty amazing new feature that provides support for vector embeddings with SQLite in a Node.js context, there's also a further move towards an ever more lighter weight of dependencies. This is especially relevant in today's world of software supply chain attacks, and an ever smaller surface area is always desirable.

> For more on this, see [Daniel Hutzel's keynote at reCAP this
> year](https://www.youtube.com/watch?v=mRs3oQPOcgM).
>
> ![A still image from the keynote recording, showing the giant desert
> sandworms from Frank Herbert's Dune universe, known as Shai Hulud, which is
> also the name given to a recent and notorious software supply chain malware
> worm](/images/2026/09/shai-hulud.png)

To this end, and powered by the Node-native Fetch API that was embraced in the
CAP Node.js runtime earlier this year, and which has allowed the team to shed a
whole load of dependencies already, the reliance on the SAP Cloud SDK is also
further reduced, down to a subset of destination types.

Basically, there are some authentication types such as `OnPremise` that are not
supported yet - but for all the others, the Fetch-API plus CAP Node.js is all
we need.

### Java

There are quite a few updates for the Java runtime, including:

- Support for the OData v4.01 JSON batch request format; v4.01 is the latest
  version in the OData family of standards and the move from `multipart/mixed`
  is welcome, as far as I'm concerned :-)

    > To learn more about OData, you might want to take a look at the [OData
    > Deep Dive](https://developers.sap.com/tutorials/mission-odata-deep-dive)
    > mission.

- When building a query, we can use the `excluding()` method to avoid having to
  specify a long list of the elements wanted, instead specifying a short list
  of the elements that are _not_ wanted.

- When building for hierarchy views (such as in Fiori Tree Tables) the
  `@cds.default.order` annotation can be used to specify the desired sort order
  of siblings.

- The CDS Maven plugin used for CDS-related build steps has undergone some
  optimisations, for faster builds, a fast mode for the `watch` goal, and
  static implementation generation for faster reflection-free access.


## Tools

Did someone say tools and the CLI? I'm here for that. First, shell completion,
which has been around for a while, but has had a complete overhaul in this
September 2026 release. The upshot is that it's much faster, more responsive
and puts less stress on your shell as it works. Pretty awesome. Shell
completion is available for Bash, Zsh, fish ... and even PowerShell!

Completions are available for the commands, options and then (where relevant)
files and directories - completion for these is via standard shell mechanisms,
which is great.

And it's nice to see IntelliJ getting lots of love - version 3 of the CDS
plugin for that IDE now supports CDS 10, and has some nice new formatting
options too.

## Plugins

We're almost done, but we can't forget all the work that goes into the CAP
plugins, can we? While they're not part of the core (the clue's in the name,
right?) they can be essential components in our projects, and many of them are
maintained by the CAP team themselves.

Here's a [list of plugins that have had updates in this
release](https://cap.cloud.sap/docs/releases/2026/sep26#cap-plugins):

- The ORD plugin - which is now also open source 🎉 - now supports generating
  Open Resource Discovery definitions for lots of protocols, including OData
  and MCP.

- The Attachments plugin now supports single attachments, instead of the
  standard list construct. There are also some major release properties that
  you need to pay attention to, in both runtimes.

- The Notifications plugin for the Node.js runtime has been overhauled, and for
  Java there's an initial Alpha release too.

- Last but not least, there's a new n8n[<sup>1</sup>](#footnotes) plugin, also
  in Alpha, for both runtimes. This plugin lets us trigger n8n workflows
  directly from CAP.

## Wrapping up

For a minor release, that's pretty spectacular, I'd say. You can check out all
the [release notes](https://cap.cloud.sap/docs/releases/2026/sep26), which
themselves have links to further reading, in the usual place, and it's also
worth keeping an eye on the [2026
Changelog](https://cap.cloud.sap/docs/releases/2026/changelog) too.

Happy learning!

## Footnotes

1. The name "n8n" is a meta-contraction of "node\[auto\]mation".




