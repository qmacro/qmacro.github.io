---
layout: post
title: Exercism and jq
tags:
  - jq
  - learning
  - bats
  - shell
---
I wanted to see how a jq track might work in Exercism. Here's what I tried out this morning.
<!--excerpt-->

[Exercism](exercism.org) is a great resource for learning and practising languages. I've dabbled in a couple of tracks and it's a fun and compelling way to iterate and meditate on constructs in the languages you're interested in. One of the very appealing things to me is that as well as a very capable online editor environment, there's a command line interface (CLI) for [working locally](https://exercism.org/docs/using/solving-exercises/working-locally).

## Digging into jq

I've [recently been digging](https://qmacro.org/tags/jq/) into [jq](https://stedolan.github.io/jq/) and wanting to build my knowledge out beyond the classic one-liners one might normally express in a JSON processing pipeline situation. `jq` is a complete language, with a functional flavour and there's support for modules, function definitions and more. The [manual](https://stedolan.github.io/jq/manual/) felt pretty terse at first, but after a while my brain got used to it.

I thought it might be an interesting exercise to see how a `jq` track might work with Exercism; initially I just want to perhaps use some of the existing tests to code against, where I provide `jq` scripts to compute the right answers.

## Using the bash track for jq

As `jq` is "just another Unix tool" that works well on the command line, it seemed logical to try and start with something similar, which I did - the `bash` track. Here's what I did to feel my way into this journey. It's early days, and this blog post is more of a reminder to my future self what I did.

### Downloading a bash track exercise as a base

Having set myself up for [working locally](https://exercism.org/docs/using/solving-exercises/working-locally) I downloaded a simple exercise from the [Bash track](https://exercism.org/tracks/bash) - [Reverse String](https://exercism.org/tracks/bash/exercises/reverse-string), and moved it to a new, local `jq` track directory:

```
# /home/user
; cd work/Exercism/
# /home/user/work/Exercism
; ls
./  ../  bash/
# /home/user/work/Exercism
; mkdir jq
# /home/user/work/Exercism
; exercism download --exercise=reverse-string --track=bash

Downloaded to
/home/user/work/Exercism/bash/reverse-string
# /home/user/work/Exercism
; mv bash/reverse-string jq/
# /home/user/work/Exercism
; cd jq/reverse-string/
# /home/user/work/Exercism/jq/reverse-string/
; ls
./  ../  .exercism/  HELP.md  README.md  bats-extra.bash  reverse_string.bats  reverse_string.sh
# /home/user/work/Exercism/jq/reverse-string
;
```

### Modifying the bats file

The `bash` track uses the [Bash Automated Testing System](https://github.com/bats-core/bats-core), known as `bats`, for unit testing. The tests are in the `reverse_string.bats` file and look like this (just the first two tests are shown here):

```bash
#!/usr/bin/env bats
load bats-extra

# local version: 1.2.0.1

@test "an empty string" {
  #[[ $BATS_RUN_SKIPPED == "true" ]] || skip
  run bash reverse_string.sh ""

  assert_success
  assert_output ""
}

@test "a word" {
  [[ $BATS_RUN_SKIPPED == "true" ]] || skip
  run bash reverse_string.sh "robot"

  assert_success
  assert_output "tobor"
}
```

I modified each test line (`run bash <sometest>.sh <test input>`) to reflect a more `jq` oriented invocation, which looks like this:

```
run jq -rR -f <sometest>.jq <<< <test input>
```

This:

* invokes `jq` instead of `bash`
* uses the `-r` flag to tell `jq` to output raw strings, rather than JSON texts (this means that the value `banana` would be output as is, rather than `"banana"` with double quotes; a double-quoted string is valid JSON and `jq` strives to output valid JSON by default)
* uses the `-R` flag to tell `jq` to expect raw strings, rather than JSON input
* uses the `-f` flag to point to a file containing the actual `jq` script (called a "filter")
* provides the input via a [here string](https://qmacro.org/2021/11/07/exploring-fff-part-2-get-ls-colors/#inputoutput-redirection-here-documents-and-here-strings) as `jq` expects the input via STDIN (so far, the `<test input>` values have been scalar values)

This is what the above excerpted unit test file now looks like:

```bash
#!/usr/bin/env bats
load bats-extra

# local version: 1.2.0.1

@test "an empty string" {
  #[[ $BATS_RUN_SKIPPED == "true" ]] || skip
  run jq -rR -f reverse_string.jq <<< ""

  assert_success
  assert_output ""
}

@test "a word" {
  [[ $BATS_RUN_SKIPPED == "true" ]] || skip
  run jq -rR -f reverse_string.jq <<< "robot"

  assert_success
  assert_output "tobor"
}
```

### Writing the solution file

The solution file supplied by default here is `reverse_string.sh` and contains some hints as to how to structure the contents. Basically, the file has to be written in such a way that when it's invoked, with the input supplied, it outputs the expected answer.

So here, I created `reverse_string.jq` to be used instead of the default `reverse_string.sh`. Having deliberately chosen a simple exercise, here's what my solution looks like in this file:

```jq
#!/usr/bin/env jq

split("") | reverse | join("")
```

### Running the unit tests

I'm a big fan of [entr](https://eradman.com/entrproject/) and used it here to rerun the unit tests every time I changed either them or my solution file `reverse_string.jq`, like this:

```bash
# /home/user/work/Exercism/jq/reverse-string
; ls *.bats *.jq | entr -c bats reverse_string.bats
```

This provided me with a lovely unit test result that would automatically update if I modified the solution or even the unit test file itself:

```
 ✓ an empty string
 - a word (skipped)
 - a capitalised word (skipped)
 - a sentence with punctuation (skipped)
 - a palindrome (skipped)
 - an even-sized word (skipped)
 - avoid globbing (skipped)

7 tests, 0 failures, 6 skipped
```

### Activating the further tests

As you can see from the unit test results, only one test ("an empty string") was executed. The others are skipped. This is by design - see the [Skipped tests](https://github.com/exercism/bash/blob/main/exercises/shared/.docs/tests.md#skipped-tests) section of the test documentation.

Activating the further tests is just a matter of commenting out the `[[ $BATS_RUN_SKIPPED == "true" ]] || skip` line  - note that the first test in the file has this line commented out by default so just that first test is run initially.

Alternatively, as you can see from that line, the `BATS_RUN_SKIPPED` environment variable can be set to `true` instead, and all of the tests will be run, like this:

```
# /home/user/work/Exercism/jq/reverse-string
; BATS_RUN_SKIPPED=true bats reverse_string.bats
 ✓ an empty string
 ✓ a word
 ✓ a capitalised word
 ✓ a sentence with punctuation
 ✓ a palindrome
 ✓ an even-sized word
 ✓ avoid globbing

7 tests, 0 failures
```

Looks like that `jq` filter passes all the tests 🎉

---

Anyway, that's as far as I got - I think there could be some mileage in pursuing this approach further. Now it's time for me to use this technique to help me dig into writing a `jq` filter to solve the [Scrabble Score](https://exercism.org/tracks/bash/exercises/scrabble-score) exercise!
