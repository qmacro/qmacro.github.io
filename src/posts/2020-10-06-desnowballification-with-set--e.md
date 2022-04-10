---
layout: post
title:  "Desnowballification with set -o errexit"
tags:
  - autodidactics
  - shell
---
_I've started to use `set -o errexit` at the start of my scripts to make them more robust._

There comes a time when you move from just hacking lines of shell script together into a file, to recognising that the file is now a script and that you want that script to run well, so you give it a little bit of help.

In a similar way to the `-w` flag for Perl scripts, or even perhaps the [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) turned on in JavaScript files with `'use strict'`, there are flags that you can use for Bash scripts. A few weeks ago I read [Writing Robust Bash Shell Scripts](https://www.davidpashley.com/articles/writing-robust-shell-scripts/) by David Pashley, and it taught me about a couple of flags:

|-|-|-|
|`set -e`|`set -o errexit`|exit when a command fails|
|`set -u`|`set -o nounset`|exit when an undeclared variable is used|

There are short and long forms of these flags, as you can see. I would use the short forms on the command line, but prefer the long forms in scripts, because they're more readable (although the language nerd in me sees 'noun set' before 'no unset' in the latter). The [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html), to which I referred in [Improving my shell scripting](https://qmacro.org/2020/10/05/improving-my-shell-scripting/) recently, also has something useful on using flags, in the [Which Shell to Use](https://google.github.io/styleguide/shellguide.html#which-shell-to-use) section. It says that flags on the [hashbang](https://en.wikipedia.org/wiki/Shebang_(Unix)) line (`#!/bin/bash`) should be used sparingly - in other words, they should be set with `set` on their own lines. The reason it gives, which makes sense, is that the script can then be run in the same way like this: `bash scriptname` (the hashbang is redundant in this case, along with any flags set on that line).

I honed in on `set -o errexit` as it seems to be a recommended standard and makes a lot of sense (although interestingly the Google Shell Style Guide makes no mention of it). This flag causes the script to be terminated if any statement returns a non-true value. As David put in his article, this "prevents errors snowballing into serious issues when they could have been caught earlier".

As I was looking for further information on `set -o errexit` I came across another useful article [Best Practices for Writing Bash Scripts](https://kvz.io/bash-best-practices.html) by Kev van Zonneveld - definitely worth a read, especially for other flags that are available (`xtrace` and `pipefail`).

So, I'm putting `set -o errexit` as one of the first lines in my Bash shell scripts. I notice that [Mr Rob](https://rwx.gg) does the same (see his [`twitch` script](https://gitlab.com/rwxrob/dotfiles/-/blob/master/scripts/twitch#L3) as an example). You should, too.
