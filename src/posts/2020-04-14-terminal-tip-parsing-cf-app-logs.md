---
layout: post
title: "Terminal Tip: parsing CF app logs"
date: 2020-04-14
tags:
  - sapcommunity
  - terminal
  - terminaltip
---
Further to my last [Terminal Tip on truncating CF
output](/blog/posts/2020/04/07/terminal-tip:-truncating-cf-output/)
I have another terminal tip for you that might help in the context of
reading log output from Cloud Foundry (CF) apps.

[Application logging on
CF](https://docs.cloudfoundry.org/devguide/deploy-apps/streaming-logs.html)
can be quite involved, and there's all sorts of useful information for
diagnostics and monitoring purposes. If you're just starting out using
the CF environment on SAP Cloud Platform, you might however be
overwhelmed, rather than overjoyed, at the amount of information and how
it's presented.

You can monitor the logs of an app on CF with the following command:

```shell
cf logs <appname>
```

Here's a screenshot of the sort of thing you might see from this
command, at the startup of an app:

![](/images/2020/04/Screenshot-2020-04-14-at-07.05.31.png)

I cut my commercial programming teeth working at Esso Petroleum in
London on IBM big iron - mainframes running MVS/ESA, upon which we ran
SAP R/2 systems with IMS DB/DC. While that was a rather proprietary OS
environment, it did leave many lasting positive impressions, one of
which was: logging is important and should be consistent, [easily
referenced](/blog/posts/2009/11/05/tech-skills-chat-with-jonerp-a-follow-on-story/#documentation),
and readable.

Just focusing on the last quality - readability - this log output may be
readable by machines, but if you ask me, it should be readable by humans
first, and machines second.

If you stare for a few seconds at the log output in the screenshot
above, you may discern that it's in the form of JSON (!), and produced
for the "APP/PROC/WEB" context. I've found myself interested in
knowing what's going on in this context, so I turned to my terminal,
and some venerable commands, to make this readable for humans too.

Like in the previous [Terminal
Tip](/blog/posts/2020/04/07/terminal-tip:-truncating-cf-output/),
I found myself creating a shell function "lintlogs" that I could pipe
the output of the cf logs command into, to parse and format it nicely.

Because, effectively, all I'm interested in here is a timestamp for
each log record, and the text details of what happened. Taking the last
log record from the above screenshot as an example, all I want is
something like this:

```log
2020-04-14T07:15:22.102Z Application router is listening on port: 8080
```

So, here's what was involved. First, let's take a look at the
definition of the "lintlogs" function (printed here over separate
lines for readability):

```shell
lintlogs () { 
  grep --line-buffered 'OUT {' 
  | stdbuf -oL cut -d ' ' -f 7- 
  | jq -r '.written_at + " " + .msg';
}
```

First, remember that you define a shell function like this:

```shell
functionname () { ... ; }
```

Once it's defined, you can treat it like any other command in the
shell, in particular in pipeline processing, i.e. you can pass data to
it via STDIO as normal. That means you can pipe the output of one
command and have it be the input to this function. That's exactly
what's going on here (in the screenshot):

```shell
cf logs desttest | lintlogs
```

Now that's clear, let's take the function definition, one command at a
time.

```shell
grep --line-buffered 'OUT {'
```

Here, we're using the standard
[grep](https://en.wikipedia.org/wiki/Grep) command to search for string
patterns in the input, in this case, we're looking for this highlighted
section of the log lines:

![](/images/2020/04/Screenshot-2020-04-14-at-08.15.54.png)

This is a crude but good-enough way to identify this type of log output.

The \--line-buffered option for grep turns on line buffering on output,
and is essential here so that the streaming output from cf logs makes
its way all the way through the pipeline to the end (data would normally
be buffered more for performance reasons, but we don't want that here,
we want each line to be sent as it arrives).

Now we pipe (\|) the lines found by the grep command into the
following:

```shell
stdbuf -oL cut -d ' ' -f 7-
```

This is actually two commands. The first is
[stdbuf](https://linux.die.net/man/1/stdbuf), which gives us the ability
to control STDIO stream buffering for other commands, in this case for
the command that follows it, i.e.
[cut](https://en.wikipedia.org/wiki/Cut_(Unix)). The option -oL sets the
standard output stream (STDOUT) buffering to line level buffering, the
same as what \--line-buffered did for grep.

We've seen the use of [cut](https://en.wikipedia.org/wiki/Cut_(Unix))
in the previous Terminal Tip; here, we're saying, with the -d ' '
option, that the delimiter (separator) upon which cut should base its
slicing, is a space character. And then, given that we're separating on
spaces, with the -f 7- option, we're saying that we want the seventh
and subsequent fields, all the way to the end. The effect of this is
that we'll just get the JSON output. If you're wondering about why the
value 7 is required, look at the raw log output and how untidy it is:

```log
2020-04-14T08:15:21.60+0100 [APP/PROC/WEB/0] OUT {"written_at":[...]
```

There are actually three spaces at the start of the log line, meaning
that this part:

```log
{"written_at":[...]
```

will be the seventh field, when separated by spaces.

Now we have the JSON only, we can pass it into our friend
[jq](https://stedolan.github.io/jq/), the command line JSON processor:

```shell
jq -r '.written_at + " " + .msg'
```

Here we request just the value of the 'written_at' and 'msg'
properties, separated by a space. The -r option gets jq to give us raw
(i.e. unformatted) output.

Putting this altogether into the 'lintlogs' function, I can now
monitor apps in CF more comfortably. Here's what the same log lines
look like now when we pipe the output of cf logs desttest into the
lintlogs function:

![](/images/2020/04/Screenshot-2020-04-14-at-08.01.21.png)

Much better, no?

You can see the definition and use of this function, and its inaugural
naming, in the [#HandsOnSAPDev live
stream episode 63](https://bit.ly/handsonsapdev#ep63) "Tracing the
OAuth 2.0 Authorisation Code grant type with approuter and CF".

Share & enjoy, and
remember, [#TheFutureIsTerminal](https://twitter.com/search?q=%23TheFutureIsTerminal&src=typed_query)!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/terminal-tip-parsing-cf-app-logs/ba-p/13436028)
