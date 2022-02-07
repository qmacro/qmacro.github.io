---
layout: post
title: Today's TIL trio
tags:
  - autodidactics
  - tools
---

_Here are three mini TILs from today, on minimum JSON, using `tee`, and `netstat` options._

I enjoy finding time to catch up on reading blog posts and watching videos in my queue, but the time is often tinged with a slight uneasy feeling that I'm seeing things in passing which are not part of what the main content is about, and I'm not acknowledging or capturing that knowledge.

Here are three very small things I learned (or was reminded of) in passing today, and I thought I'd share them.

## A simple double-quoted string is valid JSON

Often when using [`jq`](https://stedolan.github.io/jq/), the command line JSON processor, what I'm looking for is a scalar string, when I just want to extract the value of a property.

```shell
$ echo '{"foo":"bar"}' | jq .foo
"bar"
```

I always vaguely thought that this was `jq` just doing what I wanted and giving me the value, which was nice. But it was actually doing more than that. The [Invoking jq](https://stedolan.github.io/jq/manual/#Invokingjq) section of `jq`'s manual has this (emphasis mine):

> jq filters run on a stream of JSON data. The input to jq is parsed as a sequence of whitespace-separated JSON values which are passed through the provided filter one at a time. **The output(s) of the filter are written to standard out, again as a sequence of whitespace-separated JSON data.**

What `jq` aims to do is not only read JSON, but _write JSON to STDOUT_, unless otherwise directed.

In the above invocation (`jq .foo`) I didn't direct `jq` to do anything special, so it wrote `"bar"` on STDOUT.

And that's appropriate, because `"bar"` is completely valid JSON.

I'd vaguely thought that JSON data was only valid in the context of a structure (a map or array) but had never looked into it properly. But my explorations of what `jq` can do led me down the familiar path of wonder, whereupon I realised that, according to the most up to date specification of JSON, [RFC 7159](http://www.ietf.org/rfc/rfc7159.txt), a JSON text (this is as good a word as any to use as a name for a lump of JSON) "is a serialised value". This [Stack Overflow answer](https://stackoverflow.com/questions/7487869/is-this-simple-string-considered-valid-json/7487892#7487892) is a good summary of the situation.

So when `jq` gives you just a simple double-quoted string as the output for your incantation, it's giving you JSON. Which is what it is designed to do.

I realised this when watching [David Hand - "Non-trivial jq"](https://www.youtube.com/watch?v=MvI6Z85EgVo).

## I should use tee more

It's easy to overlook this perhaps unloved and semi-forgotten Unix command. According to the (very brief!) man page, `tee` is a "pipe fitting", which:

> copies STDIN to STDOUT, making a copy in zero or more files.

The `tee` command crops up in more places than you think; it appears regularly in installation commands. Take this example\* from the [installation instructions for Docker on Debian Linux](https://docs.docker.com/engine/install/debian/):

```shell
$ echo "deb [arch=amd64 ...] https://.../linux/debian buster stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

\*I've modified the actual command that appears in the [Set up the repository](https://docs.docker.com/engine/install/debian/#set-up-the-repository) section for readability.

Here's another example that appeared in the same video I mentioned earlier:

```shell
$ curl http://some.json/api | tee example1.json
```

In both cases, `tee` is used to show the operator what text is flowing into the file. The text (that string starting "deb" in the first example, and the JSON resource retrieved with `curl` in the second example) is shown on STDOUT ... and also written to the file specified (those being `/etc/apt/sources.list.d/docker.list` and `example1.json` respectively in these two examples).

I bring in `tee` for specific use cases; for example, [in this `cache` script](https://github.com/qmacro/dotfiles/commit/2ce53780daf31f8f07681d74fa00b0a6e71602db#diff-65c9282a9859d16acdc87f650a575e909d6200072927fb266b769c4d0241f215R31-R38), to generate the output, show it, and cache it:

```bash
# If there's no cache file or it's older than N mins then
# run the command for real, cacheing the output (again).
if [ ! -f "$cachefile" ] \
  || test "$(find "$cachefile" -mmin +"$mins")"; then
  "$@" | tee "$cachefile"
else
  cat "$cachefile"
fi
```

But I want to use `tee` more regularly in my daily scripting activities. With [process substitution](https://tldp.org/LDP/abs/html/process-sub.html), it can be a powerful ally.

## Use netstat's --listening option

When I want to see what sockets are being listened to on a machine, my muscle memory types out:

```shell
$ netstat -atn | grep LISTEN
```

This is fine, and gives me what I want - the lines showing what ports are bound with listening processes. Here's an example:

```shell
$ netstat -atn | grep LISTEN
tcp4       0      0  127.0.0.1.53           *.*                    LISTEN
tcp4       0      0  127.0.0.1.28196        *.*                    LISTEN
tcp6       0      0  fe80::aede:48ff:.49158 *.*                    LISTEN
tcp6       0      0  fe80::aede:48ff:.49157 *.*                    LISTEN
tcp6       0      0  fe80::aede:48ff:.49156 *.*                    LISTEN
tcp6       0      0  fe80::aede:48ff:.49155 *.*                    LISTEN
tcp6       0      0  fe80::aede:48ff:.49154 *.*                    LISTEN
tcp6       0      0  fe80::aede:48ff:.49153 *.*                    LISTEN
tcp4       0      0  *.22                   *.*                    LISTEN
tcp6       0      0  *.22                   *.*                    LISTEN
$
```

But I learned something as a side effect from reading a great post (which I [auto-tweeted](https://twitter.com/qmacro/status/1429463349239197701) from my [https://github.com/qmacro-org/url-notes](URL Notes) repo today): [Bringing the Unix Philosophy to the 21st Century - Brazil's Blog](https://twitter.com/qmacro/status/1429463349239197701).

The author gave this example of using their `jc` utility (which looks fascinating) to be able to more easily parse this sort of `netstat` output:

```shell
$ netstat -tln | jc --netstat | jq '.[].local_port_num'
```

The `-l` flag used here for `netstat` is the short form of `--listening`, and combined with `-t` (`--tcp`) and `-n` (`--numeric`) shows only TCP sockets that are being listened on. Here's an example:

```shell
$ netstat -tln
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:2222            0.0.0.0:*               LISTEN
tcp6       0      0 :::2222                 :::*                    LISTEN
```

Of course, because we're not using `grep`, we still get the heading output from `netstat` here. But the `--listening` does the job nicely!

Unfortunately, it won't be any time soon that I can switch to this option, because the macOS version of `netstat` doesn't support `-l`. In fact, it does have a `-l` option but it's for something completely different (printing full IPv6 addresses).

That said, this is yet another small step towards me moving further away from macOS-local activities, and more fully to Linux based dev containers running on my Synology NAS. But that's a post for another time.
