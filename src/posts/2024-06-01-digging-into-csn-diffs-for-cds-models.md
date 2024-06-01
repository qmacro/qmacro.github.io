---
layout: post
title: Digging into CSN diffs for CDS models
date: 2024-06-01
tags:
  - cap
  - cds
  - csn
  - cql
  - jd
  - json
---
I wanted to increase my understanding of CSN a little by noting changes in it as I built up my CDS model, and ended up with a script `csndiff` to help me with that.

To grok something complex, I try to get into the habit of looking at that something sideways and only through the corner of my eye, a piece at a time. Each piece that I look at is less overwhelming and more likely to stay in my brain for longer.

I was also curious as to how "robust" and "canonical" Core Schema Notation (CSN) was, or rather how "stable" it was regarding differences in expression, in the CDS model[<sup>1</sup>](#footnotes), of what amounts to the same thing, definition-wise. 

CSN has a couple of regular representations - JSON and YAML[<sup>2</sup>](#footnotes). For this experiment I used the JSON representation, mostly because at the outset I wasn't sure how I might process the CSN and thought I might use `jq`, but in fact I ended up discovering and using the excellent [JSON diff and patch tool](https://github.com/josephburnett/jd) called `jd`.

I wrote a small script [`csndiff`](https://github.com/qmacro/dotfiles/blob/main/scripts/csndiff) that:

- expects, via STDIN, a CDN definition (in JSON)
- compares it to any previous version of that CSN definition that it has\*
- emits that comparison as a JSON diff thanks to `jd`
- saves this latest CSN definition as the previous version for the next comparison

\*at the very start, this simply defaults to the empty object `{}`

Used in a `tmux` split window, it's great for observing how your CDS model changes and additions are actually "reified" in CSN. Here's an example session, where I'm editing a file `services.cds` in the left pane, and in the right pane I'm running `csndiff` as soon as this file changes, using `entr` of course, like this:

```shell
ls services.cds \
  | entr -c bash -c 'cds compile services.cds | csndiff'
```

Here's what the session looks like:

![demo](/images/2024/06/csndiff.mp4)

I'd love to hear about any investigations you've done into CSN too!

<a name="footnotes"></a>
## Footnotes

1) I'm tempted to write "CDL" for "CDS model" because that's the human-oriented language that the CDS model is actually written in - Core Definition Language. What we call "CDS" is actually "CDL". But that's a discussion for another time.

2) For more on the YAML representation of CSN, see [Simple script for previewing CDS models in CSN - cdsray](https://qmacro.org/blog/posts/2024/04/17/simple-script-for-previewing-cds-models-in-csn-cdsray/)
