---
title: GitHub affordances as human-agent conveyances
date: 2026-11-11
tags:
  - github
  - ai
  - agents
description: Thinking about how GitHub PRs and issues are becoming the primary surface for collaboration between humans and agents.
---

I've been noticing the growing use of GitHub, or rather core GitHub building
blocks, as the natural choice for work management between humans and agents.
Specifically issues and pull requests. One example close to me and my
colleagues is how my friend and boss [Tom
Jung](https://developers.sap.com/developer-advocates/thomas-jung/) manages the
identification, parcelling and specification of tasks for his agents to work
on, as issues in the [repo for our tutorial
system](https://github.com/sap-tutorials/tutorials-ims).

Another example is how that work is then managed in the form of pull requests
(PRs), which I guess is a natural consequence of the first observation.
Incidentally, this makes me think that this also changes the issue
mechanism as a conveyance for work items rather than mere problem statements. A
net positive, perhaps.

Anyway, it's on the topic of PRs that I came across two blog posts from folks I
have admired for a long time.

- In [Hide your slop PR descriptions behind
&lt;details&gt;&lt;summary&gt;](https://simonwillison.net/2026/Nov/9/details-summary/),
Simon Willison uses HTML's [details disclosure
element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)
to avoid the TL;DR reaction "I'm not reading all of that" to super-detailed
agent-written descriptions which, while not incorrect, are too
deep for the purposes of overview by a human.

- In [“Doctor, it hurts when agents create unreviewable PRs.” “Don’t do
that.”](https://blog.jonudell.net/2026/06/28/doctor-it-hurts-when-agents-create-unreviewable-prs-dont-do-that/),
Jon Udell describes the problem of agents raising PRs with thousands of lines
that that are nigh on impossible to properly understand. He maintains (and I
agree) that the PR should be a shared context between humans and agents, and -
while some would say that using agents to review such monsters would be one
solution to that[<sup>1</sup>](#footnotes) - smaller chunks of work are the
answer.

Both approaches allow the PR to remain the unit of work for tracking and
review, and make room for the human to still be the active arbiter in the
decision process. In traditional terms, the PR can stay primarily a letter,
rather than a ledger.

With many others, both Simon and Jon are exploring the paths ahead with
existing tools and mechanisms, coming up with approaches that are pragmatic
workarounds which eventually become norms. Something that the online community
has been doing for decades.

## Footnotes

1. This reminds me of the situation where we have folks using AI to craft
   emails, which then are too verbose for their human recipients to consume,
   and so those recipients use AI to read and summarise said emails. What a
   ridiculous and nonsensical state of affairs that is.
