---
layout: post
title: Sourcing vs executing in Bash
tags:
  - autodidactics
  - shell
---

_Checking the value of $0 allows me to source rather than execute an entire script._

Today I wrote a script `checksubmissions` to check submitted pull requests in the [SAP-samples/devtoberfest-2021](https://github.com/SAP-samples/devtoberfest-2021) repo related to Devtoberfest from SAP this year, specifically the [Best Practices](https://github.com/SAP-samples/devtoberfest-2021/tree/main/topics/Week2_Best_Practices) week.

[In its current form, at the time of writing](https://github.com/SAP-samples/devtoberfest-2021/blob/730e998d350282ae368d80abbfbf3a322823981c/topics/Week2_Best_Practices/challenge/checksubmissions), the script follows a pattern that I've used for a while now

* some general settings and possibly global variables
* then some function definitions, including a `main` function definition
* then finally, the invocation of that `main` function, passing on to it any parameters that were supplied when the script is invoked

For the sake of illustration, here's a super simplified script called `myscript` that follows that pattern:

```bash
#!/usr/bin/env bash

set -o errexit

func1() {
  echo "Inside func1"
}

main() {
  echo "Running main with $*"
  func1
}

main "$@"
```

Sometimes, especially when building out scripts like this, I like to test the functions individually, from the command line if possible. In the example from today, I check every pull request each time, initiated from `main` like this:

```bash
main() {

  getprs | while read -r number title; do

    check "$number" "$title"
    sleep 1

  done

}

main "$@"
```

([Source](https://github.com/SAP-samples/devtoberfest-2021/blob/730e998d350282ae368d80abbfbf3a322823981c/topics/Week2_Best_Practices/challenge/checksubmissions#L104-L113))

But while developing, I wanted to test out the `check` function ([source](https://github.com/SAP-samples/devtoberfest-2021/blob/730e998d350282ae368d80abbfbf3a322823981c/topics/Week2_Best_Practices/challenge/checksubmissions#L62-L100)) manually on a single pull request. Of course, editing the script to do that wasn't much of an effort, but I wondered if there was another way.

What if, from the shell prompt, I could [source](https://tldp.org/HOWTO/Bash-Prompt-HOWTO/x237.html) the script, to bring the function definitions into my current environment, and then manually invoke the `check` function on a single pull request?

Sourcing the script as it is would have the unwanted effect of running checks on all the pull requests, because the last line in the script actually invokes `main`, as it's supposed to.

It turns out that it is possible to determine whether a script is being [sourced](https://tldp.org/HOWTO/Bash-Prompt-HOWTO/x237.html) just by close examination of the `$0` variable.

> There's also the `BASH_SOURCE` environment variable, which I want to look into as well (e.g. by reading this StackOverflow post: [Choosing between $0 and BASH_SOURCE](https://stackoverflow.com/questions/35006457/choosing-between-0-and-bash-source)) but that's for another time.

First, I can replace the simple invocation:

```bash
main "$@"
```

with this:

```bash
if [[ $0 =~ ^-bash ]]; then
  return 0
else
  main "$@"
fi
```

When the script is executed, the value of `$0` is the name of the script. But when it's *sourced*, it's `-bash`.

Now, if I implement this change in the super simplified `myscript` above, then this is what happens, at a Bash shell prompt.

First, to show there's nothing up my sleeve, an attempt to invoke `func1` fails:

```bash
; func1
-bash: func1: command not found
```

Now I execute the script, and it behaves as expected:

```bash
; ./myscript hello world
running main with hello world
Inside func1
```

Of course, we still don't have the `func1` function available to us:

```bash
; func1
-bash: func1: command not found
```

But what if I *source* the script rather than execute it? I can do that with `source myscript` or simply `. myscript`:

```bash
; source myscript
```

Nothing seems to happen. Which is good -- we don't get the "running main with hello world" or "Inside func1" output.

But now the definition of `func1` is available, and we can run it:

```bash
; func1
Inside func1
```

That seems rather appealing!

This is early days, I may have missed a fundamental gotcha, but for now, I've found a way (which vaguely reminds me of Python's `if __name__ == "__main__"` pattern) to be able to reduce that (already small) gap even further between the interactive shell and script content.
