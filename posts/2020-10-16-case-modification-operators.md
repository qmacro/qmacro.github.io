---
layout: post
title:  "Case modification operators in parameter substitution"
tags:
  - autodidactics
  - shell
---
_Today I learned that in addition to the usual ways of uppercasing strings, Bash 4 brought the addition of case modification operators to the parameter substitution family._

Spending a pleasant coffee on my day off today I looked at tackling another challenge in [Exercism's bash track](https://exercism.io/tracks/bash) - [Acronym](https://exercism.io/tracks/bash/exercises/acronym/solutions/e70a7282d2fb4856bbeb1c2ae745d3c4). The requirement included ensuring that any generated acronym (I guess these might actually be initialisms, but that's a discussion for another time) was completely in uppercase, regardless of the source.

In my solution, I resorted to the usual use of `tr`, like this:

```bash
tr '[:lower:]' '[:upper:]'
```

All good. I like to peruse others' solutions, to learn from how they might have tackled the same challenge, and I came across something that looked rather odd at first, as I'd never seen it before. It was a solution by TopKech and looks like this:

```bash
OUTPUT=$(echo "$1" | sed -e 's/$/ /' -e 's/\([^ \-]\)[^ \-]*[ \-]/\1/g' -e 's/^ *//')
echo ${OUTPUT^^}
```

What's that `^^` in the second line?

Turns out that it's a case modification operator, within a parameter substitution context. What's more, it is "relatively" new, in that it was introduced with [version 4 of Bash](https://tldp.org/LDP/abs/html/bashver4.html). I say "relatively", as version 4 was introduced way back in 2009; but having been a macOS user for a while, I'd been stuck with version 3 due to Apple's issues with the GPL v3 licence (prompting them not to ship any version beyond 3, and even go so far as to make `zsh` the default shell on newer versions of the OS).

Version 4 of Bash came with lots of wonderful stuff, including 4 separate case modification operators, that are illustrated in the [Advanced Bash Scripting Guide - Chapter 37. Bash, versions 2, 3, and 4](https://tldp.org/LDP/abs/html/bashver4.html) and can be summarised thus:

|-|-|
|`${var^}`|Make first char of `var` value uppercase|
|`${var^^}`|Make all chars of `var` value uppercase|
|`${var,}`|Make first char of `var` value lowercase|
|`${var,,}`|Make all chars of `var` value lowercase|

I didn't know that, but [I do now!](https://twitter.com/qmacro/status/1317046383950659584)
