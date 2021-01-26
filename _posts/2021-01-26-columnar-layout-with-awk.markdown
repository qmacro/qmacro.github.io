---
layout: post
title: Columnar layout with AWK
date: '2021-01-26 08:30:00'
---

_Here's a breakdown of a simple AWK script I wrote to format values into neatly aligned columns_

I'm organising my GitHub repositories locally by creating a directory structure representing the different GitHub servers that I use and the orgs and users that I have access to, with symbolic links at the ends of these structures pointing to where I've cloned the actual repositories.

Here's an example of what I started out with:

```shell
; find ~/gh -type l
/Users/dja/gh/github.tools.sap/developer-relations/advocates-team-general
/Users/dja/gh/github.com/SAP-samples/teched2020-developer-keynote
/Users/dja/gh/github.com/qmacro-org/auto-tweeter
```

and what I wanted to end up with (you can see the invocation of the script here too):

```shell
; find ~/gh -type l | awk -F/ -vCOLS=5,6,7 -f ~/.dotfiles/scripts/cols.awk
github.tools.sap developer-relations advocates-team-general
github.com       SAP-samples         teched2020-developer-keynote
github.com       qmacro-org          auto-tweeter
```

In other words, I wanted to select columns from the output and have them printed neatly and aligned. Don't ask me why, I guess it's just some form of OCD.

Anyway, I decided to write this in AWK, partly because I don't know AWK that well, but mostly as a meditation on the early days of Unix and a homage to [Brian Kernighan](https://en.wikipedia.org/wiki/Brian_Kernighan). Talking of homages, I've also decided to share this script by describing it line by line, in homage to [Randal L Schwartz](https://en.wikipedia.org/wiki/Randal_L._Schwartz), that maverick hero that I learned a great deal from in the Perl world.

Randal [wrote columns for magazines](http://www.stonehenge.com/merlyn/columns.html), each time listing and describing a Perl script he'd written, line by line. I learned so much from Randal and enjoyed the format, so I thought I'd reproduce it here.

Let's start with the script, in full, courtesy of GitHub's embeddable Gist mechanism, which, incidentally, I created from the command line using [GitHub's CLI `gh`](https://github.com/cli/cli), like this:

```shell
; gh gist create --public scripts/cols.awk
```

OK, so here's the entire script.

<script src="https://gist.github.com/qmacro/c84f5a17dc4740dc2defa6a913cd3c2c.js"></script>

Remember that an AWK scripts are generally data driven, in that you describe patterns and then what to do when those patterns are matched. This is described nicely in the [Getting Started with `awk`](https://www.gnu.org/software/gawk/manual/html_node/Getting-Started.html#Getting-Started) section of the GNU AWK manual. The approach is \<pattern\> \<action\>, where the actions are within a `{...}` block. In this script, there are two special (and common) patterns used: `BEGIN` and `END`, i.e. before and after all lines have been processed. The main block in the middle has no pattern, which means it's called for each and every line in the input.

**The invocation**

Note the invocation earlier looks like this:

```shell
awk -F/ -vCOLS=5,6,7 -f ~/.dotfiles/scripts/cols.awk
```
Here are what the options do:

- `-F/` says that the input field separator is the `/` character
- `-vCOLS=5,6,7` sets the value `5,6,7` for the variable `COLS`
- `-f <script>` tells AWK where to find the script

OK, let's start digging in.

**The BEGIN pattern**

Lines 7-9 just make sure that the optional `GAP` variable, if not explicitly set (using a `-v` option in the invocation) is set to 1. That's how many spaces we want between each column. If we had wanted a value other than the default here, an extra option like this would be required, for example `-vGAP=2`.

**The default pattern**

Lines 14-35 represent the <action> for the default pattern, i.e. this is executed for each line in the input.

The script has to work out what the longest word in each column is, and for that it needs to read through the entire input. I think perhaps there may be better ways of doing this, but here's what I did.

In line 18 the condition as to whether to execute the block in lines 19-25 is based upon the value of `NR`, which is a special AWK variable that represents the record number, i.e. the value is `1` for the first record, `2` for the second, and so on. Note that there's also `FNR` (file record number) which comes in handy when you're processing multiple input files. So lines 19-25 are only executed once, when processing the first record in the input. I could have used a pattern like this:

```awk
NR == 1 { ... }
```

but it would have meant I would have to repeat lines 31-34 in that block too, as I still need to process that first record, as well as do something special.

Lines 19-25 deal with the value for the `COLS` variable. If it's been set (as in our invocation: `-vCOLS=5,6,7`) it splits out the column numbers (5,6 and 7 here) into an array `fieldlist`. If it's not been set, then the default should be all columns, which are put into the `fieldlist` array using the loop in lines 22-24 (note that `NF` is another special variable, the value of which tells us the number of fields in the current record).

Lines 31-34 represent the 'main' action for each record. Because this script needs two passes over the input, we store the current record in an array called `records` in line 31. Worthy of note here is that each field in a record is represented by its positional variable i.e. `$1`, `$2`, and so on, and `$0` represents the entire record. In line 33 we build up an array `fieldlengths` of the longest field by position. Arguably we only really need to remember the longest lengths of the fields in `fieldlist`, but hey.

**The END pattern**

Lines 39-48 represent the action for the special `END` pattern, i.e. once the records have been processed (once). At this stage we have the longest lengths for each of the fields (columns), and now we just need to go through the input again, which we have in the `records` array.

In line 41 we use the `split` function to split out the record we're processing into an array called `fields`:

```awk
split(records[record], fields, FS)
```

The third argument supplied to this call is `FS`, which is another special variable representing the field separator for this execution. Remember the `-F/` option in the invocation, shown earlier? In this case, the value of `FS` is also therefore `/`. If the field separator is different (the default is whitespace) then the value of `FS` will be different too.

Then in lines 42-45 we start printing out each chosen field (remember, the chosen columns are in `fieldlist`). The `printf` call in line 44 is special, let's break that down here:

```awk
printf "%*-s", fieldlengths[f] + GAP, fields[f]
```

Like other flavours of `printf`, this one also takes a pattern and one or more variables to substitute into that pattern. The pattern here is for a single variable, and is `%*-s`. This means that the variable to print is a string (basic form is `%s`), which should be padded out, left justified (`-`) by a value also to be supplied as a variable (`*`).

So we need to supply two variables, the width to which the variable value should be padded, and the variable itself. And that's what is supplied. First, we have `fieldlengths[f] + GAP`, which works out to be the longest length for that field (column), plus zero or more spaces as defined in `GAP`. Then we have the variable that we want printed, i.e. `fields[f]`.

Noting that `printf` won't print a newline unless it's explicitly given (as `\n`), this works well because then the consecutive fields are printed on the same line. Line 46 takes care of printing a newline when all the fields are output for that record.

And that's it. As the tagline for this blog says, I reserve the right to be wrong. I'm not a proficient AWK scripter, but this works for me.

Happy scripting!

_Update, later the same day: Over on Lobsters, the user [gioele](https://gioele.io/) contributed a pipeline version, which also helps me in a different area (small pieces loosely joined) of the same Unix meditation: `find ~/gh -type | cut -d/ -f5,6,7 | column -s/ -t`. Thanks gioele!_
