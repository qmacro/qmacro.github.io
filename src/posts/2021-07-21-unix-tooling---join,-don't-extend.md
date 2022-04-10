---
layout: post
title: Unix tooling - join, don't extend
tags:
  - tools
  - shell
---

_Reading a paper from 1984 has helped crystallise an important axiom in Unix tool design, so much so that I found myself referring to it today when scripting._

Rob Pike and Brian Kernighan authored a paper in 1984 titled "[Program design in the UNIX environment](https://nymity.ch/sybilhunting/pdf/Pike1983a.pdf)". In it, they explore the difference between adding features to existing programs, and achieving the same effect through connecting programs together.

It's not unusual to read about the UNIX philosophy of "small programs, loosely joined", about the power of small, single-responsibility programs doing one thing and doing it well, used together to form something greater than merely the sum of its parts.

What really jumped out at me was the thinly veiled scorn poured onto some design decisions relating to the Berkeley distribution version of the humble `ls` command, design decisions ultimately based on a form of narrow thinking, rather than consideration of the UNIX environment - particularly the shell and the user space programs - as being the most important "meta tool".

I won't try to summarise what that paper says about those extensions to `ls`, I would rather encourage you to go and read the paper yourself - it's only 7 pages. Instead, I'll relate a small example from today of how the paper has helped me remember the difference between focusing on a single tool to the detriment of the rest of the tools in the environment, and thinking about the entire environment as a single entity.

I have a small script, [`skv`](https://github.com/qmacro/dotfiles/blob/master/scripts/skv) which is short for "service key value", which returns a value from a property within a JSON dataset representing a (Cloud Foundry) service key. In retrospect, calling it `skv` was a little short-sighted, because it would work on any JSON dataset, not just service keys. I guess that's another example of (not) thinking about the environment as the real "meta tool". But I digress.

Today I've been using `skv` to grab OAuth-related values (client ID, client secret, and so on) from a JSON dataset and use them to construct URLs to follow an OAuth authorisation code flow. Some of those values are put into the query string of the URLs I'm constructing, and so I need to be careful to URL encode them.

My first reaction was to go into the source code of the `skv` script to add a switch, say, `-u`, along with the corresponding logic, so that I could ask, when invoking `skv`, that the value be returned URL encoded.

I'm happy to say that a second after having this reaction, I felt almost horrified that I was about to do exactly what those Berkeley authors did, and add an unnecessary switch to a single program. I already have `urlencode` available to me in my environment, so to get a URL encoded value from the JSON dataset, I'd just have to do something like this:

```
skv uaa.clientid | urlencode
```

This is only a trivial example, and there's a difference because here I'm just stringing together commands in Bash scripts, but I think the principle still holds here. I feel that this approach is embracing the UNIX approach described in the paper.

What's more, there was nothing stopping me encapsulating the pipeline-based use of these two simple tools (`skv` and `urlencode`) in a little script `skvu`, that I could use to save some keystrokes:

```
urlencode "$(skv "$*")"
```

In fact here I've re-jigged how these two commands work together, as the version of `urlencode` I settled on works on a value passed as an argument, rather than passed via STDIN. But the beauty of the shell means that this just means I have to express my intention in a way that echoes that approach.

Anyway, that's all I wanted to share here - it's not a crazily interesting and little-understood corner of the UNIX church that I'm discovering here, merely the delight in something resonating with me to the extent that the strong reverberations carried through to something that I was actually doing, without consciously thinking of what I'd read.

I hope you enjoy the paper as much as I did!
