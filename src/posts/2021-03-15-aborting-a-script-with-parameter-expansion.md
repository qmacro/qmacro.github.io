---
layout: post
title: Aborting a script with parameter expansion
tags:
  - autodidactics
  - shell
---

_Use the :? form of shell parameter expansion to abort a script if a required parameter value is not set._

I'm attracted to the somewhat arcane details of [Bash shell expansions][shell-expansions] and it was while looking up something completely different (more on that another time) that I decided to re-read the [parameter expansion][parameter-expansion] section of the GNU Bash manual.

In many of my scripts, like a good shell scripting citizen I check to ensure that there's a value for a parameter I want to use, and if there isn't, I abort with a message. In this case, abort implies returning a non-zero code, indicating failure.

The most recent example is in a little script that I've started to use to retrieve the image related to a YouTube live stream episode; this requires the YouTube video ID. The relevant part of this [`getepisodeimage`][getepisodeimage] script currently looks like this:

```bash
# Requires YouTube video ID
readonly id=$1

if [ -z "$id" ]; then
  echo "Usage: $scriptname <YOUTUBE VIDEO ID>"
  exit 1
fi
```

(And yes, before you say it, I could have saved myself the execution of a binary by replacing the `[ ... ]` with `[[ ... ]]`. If you're curious, see [The open square bracket \[ is an executable][open-square-bracket-post].)

Anyway, rather than test for the emptiness of the value of the `id` parameter (with `-z`), in a standalone `if ... fi` section, I could have used the following shell parameter expansion pattern:

```bash
${parameter:?word}
```

The description for this is as follows:

> If parameter is null or unset, the expansion of word (or a message to that effect if word is not present) is written to the standard error and the shell, if it is not interactive, exits. Otherwise, the value of parameter is substituted.

I've written about another shell parameter expansion pattern before (see [Shell parameter expansion with :+ is useful][shell-parameter-post]) but I'd forgotten about this one.

Using this pattern, I can replace the code above with this:

```bash
readonly id=${1:?Usage: $scriptname <YOUTUBE VIDEO ID>}
```

Much more succinct - I like it!


[shell-expansions]: https://www.gnu.org/software/bash/manual/html_node/Shell-Expansions.html
[parameter-expansion]: https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html
[getepisodeimage]: https://github.com/qmacro/dotfiles/blob/master/scripts/getepisodeimage
[open-square-bracket-post]: https://qmacro.org/autodidactics/2020/08/21/open-square-bracket/
[shell-parameter-post]: https://qmacro.org/autodidactics/2020/09/27/shell-parameter-expansion-with-+/
