---
layout: post
title: The myriad meanings of pwd in Unix systems
---

_Last week I ran a poll on Twitter to see what people considered with respect to the meaning of 'pwd' in Unix and Linux systems. The results were varied, for perhaps good reason._

At the end of Oct 2020 I ran a [brief poll on Twitter](/tweets/qmacro/status/1322567992551624705/), on which 82 people voted. Here's that poll, and the results. They're quite mixed, which at first might seem surprising. But there are reasons for that, as we'll find out.

![Poll on Twitter: "Fun Saturday afternoon shell poll. In Unix (and Linux), what do you think the P in $PWD (or pwd) stand for?"]( {{ "/images/2020/11/twitter-poll-pwd.png" | url }})

**Print working directory**

The most popular option was "print working directory". At first sight it seems logical: "print out the current working directory, i.e. where I am right now". Moreover, the description in various versions of the manual for `pwd` help to drive home that notion. Typically we see sentences like "[print name of current/working directory](https://linux.die.net/man/1/pwd)" or "[print the current directory](https://www.mankier.com/1/pwd)".

But there are lots of commands that print stuff, and are described in that way too. Take the `id` command. Here's what one man page says: "[print real and effective user and group IDs](https://man7.org/linux/man-pages/man1/id.1.html)". There's "print" again. But the command isn't `pid`, it's `id`. When you think about it, many, many commands in Unix send information to STDOUT, i.e. to the terminal. That's sort of the point of many of them.

This time arguably only superficially definitive, it would seem, the Wikipedia entry states, on the [page for `pwd`](https://en.wikipedia.org/wiki/Pwd): "the pwd command (print working directory) writes the full pathname of the current working directory to the standard output". As if to underline the hopeful authority of this statement, there are five (!) footnotes that supposedly link to resources that back this up.

Unfortunately, the first footnote points to a Wayback Machine copy of the [UNIX PROGRAMMERS MANUAL - Seventh Edition, Volume 1 - January, 1979](https://web.archive.org/web/20050520231659/http://cm.bell-labs.com/7thEdMan/v7vol1.pdf), wherein there are actually zero references to `pwd` being short for "print working directory":

![excerpt from UNIX PROGRAMMERS MANUAL on pwd]( {{ "/images/2020/11/programmers-manual-pwd.png" | url }})

I don't know about you, but this historic document carries more weight for me than other sources I've come across, and it only serves here to undermine the credibility of the Wikipedia entry.

The rest of the footnote links seem dubious at best, except for the one pointing to the [GNU Coreutils manual on pwd](https://www.gnu.org/software/coreutils/manual/coreutils.html#pwd-invocation) which has it as "print working directory". But everything else I've seen so far makes me think that this is a misunderstanding that has spread for obvious and innocent reasons. In addition, the one footnote in the Wikipedia page that is not used to back this claim up is a pointer to [The Open Group Base Specifications Issue 7, 2018 edition's information on pwd](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/pwd.html), which almost seems like it's actually avoiding using the word "print" at all: "return working directory name" ... "The pwd utility shall write to standard output an absolute pathname of the current working directory, which does not contain the filenames dot or dot-dot.". Very specific, very not-print.

So I'm thinking that "print working directory" isn't what `pwd` stands for. In fact, "print working directory" may be common to some man pages, but on this macOS machine, with its [BSD](https://en.wikipedia.org/wiki/Berkeley_Software_Distribution) heritage, we have, instead: "pwd -- return working directory name". Moreover, it goes on to say "The pwd utility writes the absolute pathname of the current working directory to the standard output".

**Pathname of working directory**

So perhaps it really is "pathname of working directory". That would, at least to me, make more sense. Not only does it eschew the redundancy of "print", it also is more specific about the output - if I'm in `/home/dja/` for example, then invoking pwd will tell me that, i.e. where I am, including the whole path, and not just `dja`:

```shell
$ pwd
/home/dja
```

**Process working directory**

As for the other options, I do favour "process working directory", mostly because it makes a lot of sense to me; every process in Unix has the concept of a current working directory, and that's exactly what I'm asking for when I'm in my shell process and enter `pwd` - there's a part in the video [Unix terminals and shells](https://youtu.be/hgFBRZmwpSM?t=165) that explains this very well.

I'd love to be able to point to some old Unix sources that definitively explain the answer, but unfortunately that search has come up with very little - the `pwd` source in both the [5th](https://minnie.tuhs.org/cgi-bin/utree.pl?file=V5/usr/source/s2/pwd.c) and [6th](https://github.com/yisooan/unix-v6/blob/master/source/s2/pwd.c) Editions of Unix shed no light on this whatsoever.

**Present working directory**

What about "present working directory"? Well, that option seems to have legs, in the form of the Korn shell. While [one source](https://northstar-www.dartmouth.edu/doc/solaris-forte/ipe-help/dbx/dbx88cc.html) implies that the answer might well be "pathname of current working directory", in that `pwd` just emits the value of the `$PWD` environment variable (and a variable called "print working directory" makes no sense at all) ... it would seem that in ksh-land, at least, "present working directory" is what `pwd` represents. Take, for example, the [ksh man page](https://osr507doc.xinuos.com/en/man/html.C/ksh.C.html) which states "PWD - The present working directory set by the cd command".

There's a ton of discussion, both direct and indirect, on this very question. Take for example these two entries in the Unix & Linux Stack Exchange forum: [Etymology of $PWD](https://unix.stackexchange.com/questions/399026/etymology-of-pwd) and [What is $PWD? (vs current working directory)](https://unix.stackexchange.com/questions/174990/what-is-pwd-vs-current-working-directory). Of course, perhaps the definitive answer will never be found, as computing history is nothing if not varied and prone to forking.

**Multics and print_wdir**

Talking of history, we could go further back to pre-Unix roots, in the form of Multics, which indirectly gave rise to Unix (originally "Unics"). In the [list of Multics Commands](https://multicians.org/multics-commands.html), we see, nestled amongst other similarly named commands, something that jumps out at us:

```
print_mail (pm)	display mail in a mailbox
print_messages (pm)	display interactive messages in a mailbox
print_motd (pmotd)	display message of the day (source)
print_proc_auth (ppa)	display process's sensitivity level and compartments
print_request_types (prt)	display list of I/O daemon request types
print_search_paths (psp)	display search paths
print_search_rules (psr)	display ready messages
print_wdir (pwd)	display working directory
```

There's `pwd`, and in fact, just like its sibling `pmotd`, for example, which is short for `print_motd`, it's short for `print_wdir`. Now, given the context of the original poll being set to Unix and Linux, perhaps we must discount this information. But as someone who is fascinated with Unix history in general - how can I?

I guess there are few things to conclude. The history is rich and diverse, and maybe we'll never know for sure. Perhaps, in fact, the answer will depend on whom we ask. In the grand scheme of things, it doesn't really matter ... but to those who delight in minutiae, it's a fun topic worth exploring.
