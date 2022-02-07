---
layout: post
title: The open square bracket [ is an executable
tags:
  - autodidactics
  - unix
---

_In a shell script, the `[` symbol is not syntax, it's an executable_

In my [live stream episode](https://www.youtube.com/watch?v=Ct-uiu3RRZs) this morning I added to a function so that it looked like this:

```shell
getservicekey () {
  local instance=${1}
  local servicekey=${2}
  local file
  file="${instance}-${servicekey}.json"
  if [ -r "${file}" ]; then
    cat "${file}"
  else
    cf service-key "${instance}" "${servicekey}" | sed '1,2d'
  fi
}
```

Looking at that condition `if [ -r "${file}" ]` one would think that the `[ ... ]` part is just some shell syntax to glue things together (to contain the expression under evaluation), part of the family of symbols including double quotes, semicolons and others.

But no. In a wonderfully quirky way, `[` is actually a command, an executable. I remember seeing an odd character in my `/bin/` directory a while back:

```
▶ ls /bin
[               dash            expr            ln              pwd             sync
bash            date            hostname        ls              rm              tcsh
cat             dd              kill            mkdir           rmdir           test
chmod           df              ksh             mv              sh              unlink
cp              echo            launchctl       pax             sleep           wait4path
csh             ed              link            ps              stty            zsh
```

Check out that `[` entry!

Turns out that `[` is a synonym for `test`. You can ask for the manual page for `[` and you get something that covers `[` and `test`:

```shell
▶ man [

NAME
     test, [ -- condition evaluation utility

SYNOPSIS
     test expression
     [ expression ]

DESCRIPTION
     The test utility evaluates the expression and, if it evaluates to true, returns a zero
     (true) exit status; otherwise it returns 1 (false).  If there is no expression, test also
     returns 1 (false).

     ...
```

Indeed, if you compare the two files `/bin/[` and `/bin/test`, they're the same.

The `if` statement above can be rewritten with the `test` synonym like this: `if test -r "${file}"`, but now I know that `[` is an actual executable, I'll take great delight in using it more.

Post Script: As well as being an executable, `[` is also built in to many shells these days, so incurs no performance penalty on use that an external command would otherwise do.
