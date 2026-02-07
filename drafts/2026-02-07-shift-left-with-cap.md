---
title: Shift left with CAP
date: 2026-02-07
tags:
  - llms
  - fp
  - cap
  - cds
  - cql
  - odata
  - clojure
  - bestpractices
description: In this post I posit that "shifting left" in our CAP based solutions is something that we should be striving to do.
---

The "shift left" strategy in software is about how we move testing, security
considerations and quality assurance to an earlier stage in the architecture
and development process. This strategy is a useful one, and which can be adapted
to what we code, and _where_ we code.

Something that's always been the case -- but which is gaining increasing
focus and attention thanks to AI -- is how more lines of code is worse, not
better.

## Less code, more solid-state

Why worse? Well, more code means a larger surface area for bugs to
manifest, higher efforts in maintenance and comprehension and an increased
possibility of the build up of technical debt.

Moreover, in traditional languages (such as JavaScript, Java, et al.) the code
written often contains moving parts, writhing and mutating ... requiring effort
to contain, control and reason about.

Today, there's another problem with more code, and that's the lack of concision
when it comes to being the subject of training, in LLM situations. We want our
AI models to be trained on, and producing, reliable and concise code.

Whether it's us, or future LLMs that will be maintaining and
extending that generated code, we owe it to ourselves (and our future AI
overlords) to make it as precise and with a small a footprint as possible.

I sometimes use the term "solid-state" in my talks when describing what
functional programming brings, such as in [Learning by Doing - Beginning
Clojure by Solving
Puzzles](/images/2025/03/learning-by-doing-beginning-clojure-by-solving-puzzles.pdf).
The term, for me, captures the idea of code that doesn't move, and therefore is
far less prone to changing or breaking.

Alongside functional programming languages in which this state (pun intended)
can be found, there's also the class of declarative languages. Guess what? CAP
has a wealth of declarative languages right there for us to embrace, in [the CDS
language family](https://cap.cloud.sap/docs/cds/): CDL, CQL and CXL.

One way of working towards this goal of using less code, and the code that needs to
exist being in solid-state form, is by _shifting our development left_.
