---
layout: post
title:  "MID$ and shell parameter expansion"
tags:
  - autodidactics
  - shell
---
_While perhaps misunderstood and potentially confusing due to the different options, the ability to access and manipulate values in variables in Bash is rich and varied._

I've just set up [Exercism](https://exercism.io) on this machine so I could download challenges in the [Bash track](https://exercism.io/tracks/bash) and try to improve my Bash scripting fu. I spent a pleasant hour getting to know [bats](https://github.com/sstephenson/bats) - the Bash Automated Testing System, which Exercism uses for the Bash track, and looking at one of the easy challenges on Hamming in relation to DNA sequences. My solution, in case you're interested, is [here](https://exercism.io/my/solutions/50ef4a487c3641eda1b1af823ca7d9b2).

In implementing the solution, I had to compare DNA sequences and determine how many differences between them there were - a count of where letters differed in the same positions. For example, while there are no differences in the pair of sequences GATTACA and GATTACA, there are two differences in the pair GATTACA and GCTTAGA. As much by luck as anything else, I stumbled upon this construct:

```bash
${parameter:offset:length}
```

I'd seen this construct before and it rang a bell, I remember thinking it was like the [`MID$` function in many implementations of the BASIC language](http://www.bbcbasic.co.uk/bbcbasic/manual/bbckey3.html) I'd used in my early days. Basically it's a way of reaching into a string and pulling out a section of it.

So for example, if we have `str="Hello, World!"` then we can use this construct like this (note that all these variations are possible):

```bash
> echo ${str}
Hello, World!
> echo ${str:4}
o, World!
> echo ${str:4:5}
o, Wo
```

**Shell parameter expansion**

There's plenty more information on this in the [Bash man page](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html); perhaps most importantly we learn there what this is called - in what category this contruct lives. It's in the [**parameter expansion**](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html) family.

We've seen parameter expansion before in this blog, specifically in [Shell parameter expansion with :+ is useful](https://qmacro.org/autodidactics/2020/09/27/shell-parameter-expansion-with-+/), which looks at the `:-` and `:+` variants. But even if we combine this post with that one, we're only scratching the surface of what's possible; I'm looking forward to grabbing a cup of tea and reading through the entire section of the Bash man page on this topic soon.

**Using `expr`**

What's potentially confusing here is that there's more than one way to extract a portion of a string. Not only do we have this shell parameter expansion construct, but we have the executable `expr`, which evaluates expressions. There are many expressions that can be evaluated (see the man page), one of which is `substr`. This explains why, in the [Manipulating Strings](https://tldp.org/LDP/abs/html/string-manipulation.html) section of the Linux Documentation project, both approaches are documented.

So using `expr`, the equivalent of the above example where the value "o, Wo" is pulled out of "Hello, World!" is this:

```bash
> expr substr "$str" 5 5
o, Wo
```

There are two things to note here with this `expr` evaluation of `substr`, given that the man page describes it as `substr STRING POS LEN`:

- the first number is not the _offset_ but the _position_, which is why here we need the first value to be 5 (position in the string) whereas with the parameter expansion we needed the value 4 (offset from the start).

- both numbers (POS and LEN) are required; if your extraction needs to be "from here to the end of the line" you'll either have to work out the length yourself, or use another expression with `expr`, for example `match`.

**In context**

Right now I'm wondering about the history of both approaches, and what we should be using, but that question is for another day. In the meantime, in case you want to see the use of this parameter expansion approach in my solution, here's the relevant section (noting that the first and second DNA sequence strings are in `$1` and `$2` respectively):

```bash
# Count the differences
declare diffcount=0
for i in $(seq 0 $(( ${\#1} -1 ))); do
  [[ ! "${1:$i:1}" = "${2:$i:1}" ]] && (( diffcount++ ))
done
echo "$diffcount"
```

There's plenty to learn in this area, but right now it's time for me to make that cuppa.
