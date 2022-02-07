---
layout: post
title:  "curl and multipart/form-data"
tags:
  - autodidactics
  - curl
---
_In [reading through](/autodidactics/2020/10/03/using-exec-to-jump.html) [Mr Rob](https://rwx.gg/)'s [`ix`](https://gitlab.com/rwxrob/dotfiles/-/blob/master/scripts/ix) script, I discovered something about `curl` that I hadn't known about._

The script's key line is this:

```shell
url=$(curl -s -F 'f:1=<-' http://ix.io)
```

My gaze was immediately drawn to this bit: `-F 'f:1=<-'`. Part of this initially cryptic incantation is actually down to the instructions from the [ix.io](http://ix.io) website itself, in the TL;DR section.

Checking the [`curl` documentation](https://curl.haxx.se/docs/manpage.html) for the `-F` option, I discover that this venerable command line HTTP client can send multipart/form-data payloads, with files or file contents. So, breaking this incantation down, we have:

|Part|Meaning|
|-|-|
|`-F`|send a POST with multipart/form-data content|
|`f:1`|the name of the form field that the website is expecting|
|`<`|send as file contents (rather than an actual file)|
|`-`|read the contents from STDIN|

And in the context of where this is being executed, STDIN is the `ix` script's STDIN, in other words, whatever is piped into `ix` when it's invoked.

In response to the form being POSTed, the [ix.io](http://ix.io) website returns the newly minted unique pastebin URL that was created, and this is saved into the `url` variable in the script, to be shared in various ways.

Lovely!
