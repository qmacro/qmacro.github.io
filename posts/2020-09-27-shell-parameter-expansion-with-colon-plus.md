---
layout: post
title: Shell parameter expansion with :+ is useful
tags:
  - autodidactics
  - shell
---

_Use the shell parameter expansion form `:+` for expanding optional values_

I've been increasing my Bash scripting activities recently, not least in relation to some [live stream episodes relating to Enterprise Messaging](https://github.com/SAP-samples/cloud-messaging-handsonsapdev) and have used some of the shell parameter expansion facilities described in [section 3.5.3 Shell Parameter Expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html) of the GNU Bash manual. In particular, I've been using what I call the "default value" (`:-`) form:

```
${parameter:-word}
```

This form has this description: "If _parameter_ is unset or null, the expansion of _word_ is substituted. Otherwise, the value of _parameter_ is substituted" and is very useful for setting default value for parameters that are expected at invocation time, for example.

On a walk yesterday I was listening to an episode of a series of podcasts I'd discovered that very day, on [Hacker Public Radio](http://hackerpublicradio.org/). It's an [in-depth series on Bash scripting](http://hackerpublicradio.org/series.php?id=42), and has quite a few episodes, some very recent, and the early ones dating back to 2010. The episode I listened to was [hpr1648 :: Bash parameter manipulation](http://hackerpublicradio.org/eps.php?id=1648) by [Dave Morriss](http://hackerpublicradio.org/correspondents.php?hostid=225), and I enjoyed it very much.

One of the things Dave mentioned was this form of expansion (`:+`), related to the one above, but sort of the opposite:

```
${parameter:+word}
```

The form has this description: "If _parameter_ is null or unset, nothing is substituted, otherwise the expansion of _word_ is substituted." Dave found this slightly odd, and commented that he couldn't quite think of a use case for this form. I couldn't, either.

Later that same day, I came across a live streamer on Twitch - Rob, aka [rwxrob](https://www.twitch.tv/rwxrob) - who has some excellent content, also on [YouTube](https://www.youtube.com/c/rwxrob). Watching the beginning of one of his live stream recordings, [Google Shell Scripting Guide, Yes, Yes, 1000 Times Yes!](https://www.youtube.com/watch?v=UGCw6wXv1Ao), he introduces a Bash shell scripting resource from Google - the [Shell Style Guide](https://google.github.io/styleguide/shellguide.html), which he goes through in detail in the live stream.

Noting how great that style guide looked, I start to read through it immediately. And what do I see, in the [section on Quoting](https://google.github.io/styleguide/shellguide.html#quoting)? An example of the `:+` shell expansion form (in an illustration of something else entirely), which made complete sense and explained its real purpose! I couldn't believe it - discovering multiple complementary sources of information on Bash shell scripting on the same day? Goodness me.

Here's the example of that `:+` shell expansion form taken directly from [that section](https://google.github.io/styleguide/shellguide.html#quoting) in the style guide:

```bash
git send-email --to "${reviewers}" ${ccs:+"--cc" "${ccs}"}
```

Look at that beautiful thing!

```bash
${ccs:+"--cc" "${ccs}"}
```

If there is a value in the `ccs` variable, use it, but in the expanded context of it being a value to the `--cc` switch used with the `git` command. The value (most likely one or more email addresses) would be of no use on its own, but put with `--cc` it makes complete sense. And the icing on the cake is that the `:+` form substitutes nothing if the variable is null or unset, meaning there's no carbon-copying requested if there are no emails listed in the `ccs` variable.

Now that made my day. I was originally with Dave on not being able to think of a reason for the `:+` form, and then whammo, there's a perfect example right there. Thanks Dave, thanks Rob, and thanks to the Googlers who wrote the style guide!
