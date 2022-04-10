---
layout: post
title: Columnar layout with AWK
tags:
  - tools
---

_Here's a breakdown of a simple AWK script I wrote to format values into neatly aligned columns_

(Jump to the end for a couple of updates, thanks gioele and oh5nxo!)

I'm organising my GitHub repositories locally by creating a directory structure representing the different GitHub servers that I use and the orgs and users that I have access to, with symbolic links at the ends of these structures pointing to where I've cloned the actual repositories.

Here's an example of what I started out with:

```
; find ~/gh -type l
/Users/dja/gh/github.tools.sap/developer-relations/advocates-team-general
/Users/dja/gh/github.com/SAP-samples/teched2020-developer-keynote
/Users/dja/gh/github.com/qmacro-org/auto-tweeter
```

and what I wanted to end up with (you can see the invocation of the script here too):

```
; find ~/gh -type l | awk -F/ -vCOLS=5,6,7 -f ~/.dotfiles/scripts/cols.awk
github.tools.sap developer-relations advocates-team-general
github.com       SAP-samples         teched2020-developer-keynote
github.com       qmacro-org          auto-tweeter
```

In other words, I wanted to select columns from the output and have them printed neatly and aligned. Don't ask me why, I guess it's just some form of OCD.

<a name="homage"></a>**Homage**

Anyway, I decided to write this in AWK, partly because I don't know AWK that well, but mostly as a meditation on the early days of Unix and a homage to [Brian Kernighan](https://en.wikipedia.org/wiki/Brian_Kernighan). Talking of homages, I've also decided to share this script by describing it line by line, in homage to [Randal L Schwartz](https://en.wikipedia.org/wiki/Randal_L._Schwartz), that maverick hero that I learned a great deal from in the Perl world.

Randal [wrote columns for magazines](http://www.stonehenge.com/merlyn/columns.html), each time listing and describing a Perl script he'd written, line by line. I learned so much from Randal and enjoyed the format, so I thought I'd reproduce it here.

Let's start with the script, in full, courtesy of GitHub's embeddable Gist mechanism, which, incidentally, I created from the command line using [GitHub's CLI `gh`](https://github.com/cli/cli), like this:

```
; gh gist create --public scripts/cols.awk
```

I subsequently edited it too (there are now [multiple revisions](https://gist.github.com/qmacro/c84f5a17dc4740dc2defa6a913cd3c2c/revisions)) with:

```
; gh gist edit c84f5a17dc4740dc2defa6a913cd3c2c
```

OK, so here's the entire script.

<script src="https://gist.github.com/qmacro/c84f5a17dc4740dc2defa6a913cd3c2c.js"></script>

Remember that an AWK scripts are generally data driven, in that you describe patterns and then what to do when those patterns are matched. This is described nicely in the [Getting Started with `awk`](https://www.gnu.org/software/gawk/manual/html_node/Getting-Started.html#Getting-Started) section of the GNU AWK manual. The approach is \<pattern\> \<action\>, where the actions are within a `{...}` block. In this script, there are two special (and common) patterns used: `BEGIN` and `END`, i.e. before and after all lines have been processed. There's an \<action\> block in the middle which has no pattern; that means it's called for each and every line in the input. There's also an \<action\> block with a specific pattern, which we'll look at shortly.

**The invocation**

Note the invocation earlier looks like this:

```
awk -F/ -vCOLS=5,6,7 -f ~/.dotfiles/scripts/cols.awk
```
Here are what the options do:

- `-F/` says that the input field separator is the `/` character
- `-vCOLS=5,6,7` sets the value `5,6,7` for the variable `COLS`
- `-f <script>` tells AWK where to find the script

OK, let's start digging in.

**The `BEGIN` pattern**

Lines 7-9 just make sure that the optional `GAP` variable, if not explicitly set (using a `-v` option in the invocation) is set to 1. That's how many spaces we want between each column. If we had wanted a value other than the default here, an extra option like this would be required, for example `-vGAP=2`.

**The `NR == 1` pattern**

The action in this block is executed only on one occasion - when the value of `NR` is `1`.

`NR` is a special AWK variable that represents the record number, i.e. the value is `1` for the first record, `2` for the second, and so on. Note that there's also `FNR` (file record number) which comes in handy when you're processing multiple input files. So the \<action\> block related to this `NR == 1` pattern is only executed once, when processing the first record in the input.

This \<action\> block, specifically lines 18-24, deal with the value for the `COLS` variable. If it's been set (as in our invocation: `-vCOLS=5,6,7`) it splits out the column numbers (5,6 and 7 here) into an array `fieldlist`. If it's not been set, then the default should be all columns, which are put into the `fieldlist` array using the loop in lines 21-23. Note that `NF` is another special variable, the value of which tells us the number of fields in the current record.

**The default pattern**

Lines 31-36 represent the action for the default pattern, i.e. this is executed for each line in the input. That includes even the first record, although we've done some processing for the first record in the \<action\> block for the `NR == 1` pattern already. That's because *all* patterns are tested, in sequence, unless an action invokes an explicit `next` to skip to the next input record (see update #2 at the end of this post for the attribution for this info).

The script has to work out what the longest word in each column is, and for that it needs to read through the entire input. I think perhaps there may be better ways of doing this, but here's what I did.

Because this script needs two passes over the input, we store the current record in an array called `records` in line 32. Worthy of note here is that each field in a record is represented by its positional variable i.e. `$1`, `$2`, and so on, and `$0` represents the entire record. In lines 33-35 we build up an array `fieldlengths` of the longest field by position. Arguably we only really need to remember the longest lengths of the fields in `fieldlist`, but hey.

**The `END` pattern**

Lines 40-49 represent the action for the special `END` pattern, i.e. once the records have been processed (once). At this stage we have the longest lengths for each of the fields (columns), and now we just need to go through the input again, which we have in the `records` array.

In line 42 we use the `split` function to split out the record we're processing into an array called `fields`:

```
split(records[record], fields, FS)
```

The third argument supplied to this call is `FS`, which is another special variable representing the field separator for this execution. Remember the `-F/` option in the invocation, shown earlier? In this case, the value of `FS` is also therefore `/`. If the field separator is different (the default is whitespace) then the value of `FS` will be different too.

Then in lines 43-46 we start printing out each chosen field (remember, the chosen ones are in `fieldlist`). The `printf` call in line 45 is special, let's break that down here:

```
printf "%*-s", fieldlengths[f] + GAP, fields[f]
```

Like other flavours of `printf`, this one also takes a pattern and one or more variables to substitute into that pattern. The pattern here is for a single variable, and is `%*-s`. This means that the variable to print is a string (basic form is `%s`), which should be padded out, left justified (`-`) by a value also to be supplied as a variable (`*`).

So we need to supply two variables, the width to which the variable value should be padded, and the variable itself. And that's what is supplied. First, we have `fieldlengths[f] + GAP`, which works out to be the longest length for that field (column), plus zero or more spaces as defined in `GAP`. Then we have the variable that we want printed, i.e. `fields[f]`.

Noting that `printf` won't print a newline unless it's explicitly given (as `\n`), this works well because then the consecutive fields are printed on the same line. Line 47 takes care of printing a newline when all the fields are output for that record.

And that's it. As the tagline for this blog says, I reserve the right to be wrong. I'm not a proficient AWK scripter, but this works for me.

Happy scripting!

_Update #1, later the same day: Over on Lobsters, the user [gioele](https://gioele.io/) [contributed a pipeline version](https://lobste.rs/s/r5ezxh/columnar_layout_with_awk#c_8cunpb), which also helps me in a different area (small pieces loosely joined) of the same Unix meditation: `find ~/gh -type | cut -d/ -f5,6,7 | column -s/ -t`. Thanks gioele!_

_Update #2, even later the same day: Over on Reddit, the user [oh5nxo](https://www.reddit.com/user/oh5nxo/) puts me right; in an earlier version of this script (and this blog post) I'd put the lines of code that are now in the `NR == 1` \<action\> block inside the main (default) \<action\> block, as I'd mistakenly thought that I'd have to otherwise repeat some code. That wasn't the case. Thanks for [sharing your knowledge](https://www.reddit.com/r/commandline/comments/l5ivt7/columnar_layout_with_awk/gkuxhx0/?utm_source=reddit&utm_medium=web2x&context=3), oh5nxo! I've updated the script and this post to reflect that._
