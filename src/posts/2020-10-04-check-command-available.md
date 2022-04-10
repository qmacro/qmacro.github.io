---
layout: post
title:  "Checking a command is available before use"
tags:
  - autodidactics
  - shell
---
_There's one final nugget in [Mr Rob](https://rwx.gg/)'s [`ix`](https://gitlab.com/rwxrob/dotfiles/-/blob/master/scripts/ix) script that I wanted to pick out. It's not earth shattering but still useful to have seen._

At the end of the script, the URL generated from the newly created [ix.io](http://ix.io) pastebin is put into the X buffer (so that it can be pasted into other X applications). This is done via the [`xclip`](https://linux.die.net/man/1/xclip) command, but `xclip` is not installed everywhere, so the `ix` script checks that it is available before trying to use it:

```shell
which xclip >/dev/null || exit 0
echo "$url" | xclip
```

This is a common pattern.

Because the use of `xclip` here is right at the end of the script (by design, most likely) it's possible to abort (`|| exit 0`) if `xclip` isn't there. I guess an alternative, if it was necessary to run it mid-script, would be something like this:

```shell
which xclip >/dev/null && echo "$url" | xclip
```

Anyway, worth knowing and having seen it, right?
