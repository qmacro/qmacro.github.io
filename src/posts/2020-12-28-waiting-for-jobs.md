---
layout: post
title:  "Waiting for jobs, and the concept of the shell"
tags:
  - autodidactics
  - shell
---
_Bash's 'wait' builtin helps me understand Bash scripting as a language_

I was browsing the source code of the main script in the [bash-http-monitoring](https://github.com/RaymiiOrg/bash-http-monitoring) project that had been shared on a social news site recently. The general idea was that it fired off a number of background web requests to run in parallel and eventually produce a report on the availability of various websites. Nice, neat and simple.

In the main part of the project's `srvmon` script, I saw this:

```bash
# Do the checks parallel
for key in "${!urls[@]}"
do
  value=${urls[$key]}
  if [[ "$(jobs | wc -l)" -ge ${maxConcurrentCurls} ]] ; then # run 12 curl commands at max parallel
      wait -n
  fi
  doRequest "$key" "$value" &
done
wait
```

I noticed the use of `wait` in those two places and was intrigued; although I could guess what it did, I wanted to learn more. On digging in a little, and reflecting on it, it struck me that `wait` helps me understand better the origins of shell scripting and why it seems to be often misunderstood.

**The `wait` builtin in action**

First, what is `wait`? Well, it's (usually a) builtin, i.e. a command that is built in to the shell executable itself, rather than existing as a separate program. The headline description is that `wait` "waits for job completion and returns the exit status". The [Wikipedia entry](https://en.wikipedia.org/wiki/Wait_(command)) for it notes that it's a builtin because it "_needs to be aware of the job table of the current shell execution environment_", which makes sense, given its purpose.

While the above snippet of code gives a couple of examples, I thought I'd spend a coffee writing a little exploratory script called `jobwait` to feel how `wait` can work. Here it is:

```bash
#!/usr/bin/env bash

log() {
  echo "$(date +%H:%M:%S) $*"
}

createjob() {
  local time=$1
  local message=$2
  (sleep "$time" && log "$message") &
  log "created job '$message' (${time}s) PID=$!"
}

main() {
  createjob 10 medium
  createjob 15 long
  createjob 5 short
  log "jobs created"
  wait -n && log "a job has finished"
  wait && log "all jobs have finished"
}

main "$@"
```

Running this script produced the following output - note the times on each of the log records, which shows when each log record was issued:

```
; ./jobwait
09:03:11 created job 'medium' (10s) PID=72679
09:03:11 created job 'long' (15s) PID=72682
09:03:11 created job 'short' (5s) PID=72685
09:03:11 jobs created
09:03:16 short
09:03:16 a job has finished
09:03:21 medium
09:03:26 long
09:03:26 all jobs have finished
;
```

Now there's nothing unexpected about this; nevertheless, it was quite satisfying seeing things happen in the order that they did. Note that `wait` returns the job exit status too, and with the use of `&&` I'm ignoring that here at my peril, but it's only a test script.

The `-n` option makes `wait` wait for the next job to terminate, whatever that job is. So here we see that the "a job has finished" log entry is issued as soon as one of the jobs terminates - the 'short' one, in this case.

**The shell as a command environment**

Now we know what `wait` can do, I'd like to think a little bit about what it represents, too.

Recently my learning radar has been picking up various conversations where it seemed to me that people were [misunderstanding what shell scripting is](https://twitter.com/qmacro/status/1332303180240216066). It also came up this month in a Lobster thread, where the user "pm" really [helped me put my finger on](https://lobste.rs/s/yeloyn/minimal_safe_bash_script_template#c_q4gyqw) what is frustrating about the "Bash vs a real programming language" discussion.

The shell is like a [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) to your operating system, an interactive environment where you can have a conversation with it - manage resources, execute programs and so on. In that sense, the language of that conversation needs to be simple and have minimal noise. You want to just type something in and have it happen.

Moreover, you want to specify values with as little fuss as possible. Run a program that operates on a word, or a list of words, or a file or list of files - you don't want to be messing around with having to quote those things in the basic case. And the facilities that the REPL provides to enable you to take full advantage of the resources and programs you're working with, are super important. I'm thinking of the Unix pipeline, and IO redirection as two great examples of that.

That reference to Unix reminds me of a wonderful paper written in 1976 by one of Unix's fathers, Ken Thompson. It's [THE UNIX COMMAND LANGUAGE](https://archive.org/details/theunixcommandlanguage) which is available via the Internet Archive but has also been made more consumable in different formats in [this lovely repository](https://susam.github.io/tucl/) too. This paper is purportedly the first ever written about the Unix shell, and is a great read. It has a beautifully simple introduction to subshells, pipelines and IO redirection too.

Perhaps more subtly, what we know as the source for shell scripting today is referred to in the paper's title as a "command language", and that's what it is. There is much in the paper that is quoteworthy, but I'll pick just one here that helps me think about what the shell (and, by implication, its language) is:

"_The Shell, and the commands it executes, form an expression language ... [which is] easily extensible_"

So this REPL, our interface to the operating system and its resources, is a command environment and our direct interaction with it is via a command language that has been designed to express our intentions in a straighforward and as consistent a way as possible.

Here's another quote, from the section "THE SHELL AS A COMMAND":

"_The Shell is just another command and by redirecting its standard input, it is possible to execute commands from files._"

**A natural progression to scripting**

So it's at this point in this thinking journey that we start to transition from a REPL, where the interaction is direct ... to a collection of commands that can be saved in a file and passed to the shell, which I guess one could see as indirect interaction.

This of course is a move to scripting, as intentional collections of command language elements. And this is where `wait` makes a lot of sense; perhaps it would be used interactively, but it seems more useful to me as a way of getting things to pause while other things complete, when in indirect mode ... in unattended command language execution mode. Scripting.

The transition from using the command language directly (including the syntax that allows us to join programs together in pipelines and manage input and output) to scripting, is in this way very subtle, and feels to me like a natural conclusion. And the features that make the command environment and its language so useful in the context of direct interaction in the REPL, are exactly those features that are available for scripting too.

To me, this is the essence of shell scripting, and explains why it is how it is. While it makes sense to write individual programs in whatever language one finds suitable -- while of course making sure those programs behave in predictable and useful ways in the context of the command environment, especially in relation to STDIN, STDOUT and STDERR -- it makes absolute no sense to me whatsoever to suggest that shell scripting itself should be replaced by "a modern language" (whatever that means).

To echo a (deliberately preposterous) concept mentioned in the Lobsters thread earlier, try replacing your shell with a "modern language" REPL such as Node.js's or Python's, and see how your productivity plummets. Try harnessing operating system resources, executing programs and filtering their output, or submitting background jobs (and `wait`ing for them to complete before proceeding further) - and you'll soon come unstuck.

The shell is how it is for a reason. I'm happy with that.
