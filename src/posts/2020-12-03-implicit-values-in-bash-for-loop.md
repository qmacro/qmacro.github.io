---
layout: post
title:  "Implicit values in Bash for loop construct"
tags:
  - autodidactics
  - shell
---
_Bash's 'for loop' construct can use implicit values - who knew? Not me ..._

I was browsing a [Superuser question and answer](https://superuser.com/questions/318067/how-to-iterate-over-all-pair-combinations-in-a-list-in-bash/732740) this morning and the code in the [accepted answer](https://superuser.com/a/318073/620229) looked like this:

```bash
set -- value1 value2 "value with spaces"
for a; do
    shift
    for b; do
        printf "%s - %s\n" "$a" "$b"
    done
done
```

I was somewhat confused by the rather short `for` loop constructions here, and ended up looking it up in the [looping constructs section of the Bash manual](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#Looping-Constructs).

What looked odd to me was that there is no `in <values>` part to either of the `for` loops. I am used to seeing (and writing) `for var in x y z` or similar. So what were these loop constructions iterating over? Well, the Bash manual section says this (emphasis mine):

_`for name [ [in [words …] ] ; ] do commands; done`_

_Expand words (see Shell Expansions), and execute commands once for each member in the resultant list, with name bound to the current member. **If ‘in words’ is not present, the for command executes the commands once for each positional parameter that is set, as if ‘in "$@"’ had been specified** (see Special Parameters)._

So these `for` loops are processing the positional parameters in `$1`, `$2` and `$3` which were set by the `set` command on the first line, i.e. the values `value1`, `value2`, and `value with spaces` respectively.

So there you go - it's sort of obvious now I think about it - what else would the loop constructs be processing? Anyway - onwards and upwards!
