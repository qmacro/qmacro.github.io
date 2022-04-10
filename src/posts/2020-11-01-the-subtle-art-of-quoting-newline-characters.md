---
layout: post
title: The subtle art of quoting newline characters
---

_Putting a backslash at the end of a line in the shell (or in a shell script) means "continued on the next line!", right? Well yes, but it's more subtle, more simple and more beautifully shell-like than I thought._

I was staring absentmindedly at a helper script that I'd written on last Friday's #HandsOnSAPDev live stream (replay here: [Generating Enterprise Messaging artifact graphs with shell scripting and Graphviz - Part 1](https://www.youtube.com/watch?v=E9Ha0tnXGS4)) which looks like this:

```shell
#!/usr/bin/env bash

declare fontname="Victor Mono"
declare fontsize="16"

dot \
  -Tpng \
  -Nfontname="$fontname" \
  -Nfontsize="$fontsize" \
  test.dot > test.png
```

(yes, I know we need to talk about the hashbang, but let's leave that for another time).

I like to make my scripts readable, so I often split commands over separate lines, as I've done here in the invocation of the `dot` command, with its various switches and arguments.

I had always vaguely thought that "OK, well if I want to continue on the next line, I have to put a backslash (`\`) at the end of the preceding line", like I've done here. So in that sense, I was considering the backslash as a sort of continuation character.

Bzzt. Wrong. Or at least not entirely accurate.

Yesterday the YouTube algorithm, which knows I'm currently geeking out on all things shell, suggested a short series of videos by [Brian Will](https://www.youtube.com/channel/UCseUQK4kC3x2x543nHtGpzw): [Unix Terminals and Shells](https://www.youtube.com/playlist?list=PLFAC320731F539902). In the second video in this playlist, he listed the characters in Bash that had special meaning:

```
# ' " \ $ ` * ~ ? < > ( ) ! | & ; space newline
```

Some may be more obvious or familiar than others. Note the last two in the list - `space` and `newline`. In particular, `newline` normally denotes the end of a command (of course, there are other special characters that denote this too - notably `;` and `&`). See [Section 3.2.3 Lists of Commands](https://www.gnu.org/software/bash/manual/bash.html#Lists) in the Bash manual for details.

Brian goes on to explain the function of the backslash character in a quoting or escape capacity - to remove the special meaning of the immediately following character, so that it's treated as-is. So for example if you actually wanted a dollar sign, which normally has a special meaning if you use it, you'd use `\$`.

Likewise, then for the newline character. If you want the meaning of newline to be cancelled, i.e. "please do _not_ treat this point as the end of the command", then you need to use the backslash to quote it:

```
\newline
```

(of course, I'm representing an actual newline with `newline` here).

I don't know about you, but I've always used "escape" as a verb here, rather than "quote", i.e. "to remove the special meaning of character x, you have to escape it with a `\`". I think a more accurate way of saying it is "... you have to quote it with a `\`". The cause is probably the fact that `\` is known as the "escape character". The escape character is documented in Section [3.1.2.1 Escape Character](https://www.gnu.org/software/bash/manual/bash.html#Escape-Character) of the Bash manual, which is quite short, and worth quoting, thus:

"_A non-quoted backslash ‘\’ is the Bash escape character. It preserves the literal value of the next character that follows, with the exception of newline. If a \newline pair appears, and the backslash itself is not quoted, the \newline is treated as a line continuation (that is, it is removed from the input stream and effectively ignored)_".

This rounds out this post neatly for me, in that in fact, yes, the special meaning of `newline` is removed if you quote it with a backslash, so you can continue on the next line; what's more, it's actually removed from the input stream. I mean, it's just whitespace anyway, but that's a curious and interesting detail.

Anyway, I'm now enlightened - I thought the backslash was doing something "special" here in the context of the script above (and many others like it), but no, in fact, it's just doing its normal job of removing the special meaning of the immediately following character, which to us is invisible.








