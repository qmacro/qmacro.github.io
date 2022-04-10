---
layout: post
title:  "Understanding declare"
tags:
  - autodidactics
  - shell
---
_I've been looking into declare, and also how it compares to typeset and local. It turns out that there's a lot to know._

After working my way through the small `ix` script in [Mr Rob](https://rwx.gg)'s [dotfiles](https://gitlab.com/rwxrob/dotfiles/-/tree/master), writing three posts [Using exec to jump](/autodidactics/2020/10/03/using-exec-to-jump/), [curl and multipart/form-data](/autodidactics/2020/10/04/curl-and-multipart-form-data/) and [Checking a command is available before use](/autodidactics/2020/10/04/check-command-available/) along the way, I've now turned my attention to the [`twitch`](https://gitlab.com/rwxrob/dotfiles/-/blob/master/scripts/twitch) script which he uses during his [live streams](twitch.tv/rwxrob). I haven't gone very far when I light upon this section:

```shell
declare gold=$'\033[38;2;184;138;0m'
declare red=$'\033[38;2;255;0;0m'
...
```

So `declare` is a keyword that I've seen before but never fully understood or embraced. Seems like this is a good time to fix that.

**Declare is a builtin**

To start off, `declare` is a [builtin](https://tldp.org/LDP/abs/html/internal.html#BUILTINREF), which means that rather than an external executable (such as `echo`, or even `[`), it's part of the Bash runtime itself, as we can see thus:

```shell
> strings $(which bash) | grep declare
declare -%s %s=%s
declare
declare [-aAfFgilnrtux] [-p] [name[=value] ...]
    When used in a function, `declare' makes NAMEs local, as with the `local'
    A synonym for `declare'.  See `help declare'.
    be any option accepted by `declare'.
declare -%s
```

(If you're curious about `[` being an external executable, you might be interested in another post: [The open square bracket \[ is an executable](https://qmacro.org/autodidactics/2020/08/21/open-square-bracket/).)

**The `typeset` synonym**

First off, let's deal with the `declare` vs `typeset` question. Basically, `typeset` does in the Korn shell (ksh) pretty much what `declare` does in the Bash shell. And `typeset` has been added to Bash as a synonym for `declare`, to make it easier for developers to switch between the flavours. There are other synonyms relating to `declare`, but we'll come to those in a bit.

**Basics of `declare`**

Next, let's deal with the question: "But why is declare used here at all?". Well, in [this particular case](https://gitlab.com/rwxrob/dotfiles/-/blob/master/scripts/twitch#L29-36) it's not absolutely necessary. Strings and array variables don't actually need to be declared, so this would be fine, too:

```shell
gold=$'\033[38;2;184;138;0m'
red=$'\033[38;2;255;0;0m'
...
```

This would be a couple of simple assignments of values to (otherwise) previously undeclared variables. On the other hand, with the `declare` variant, subtly different, we're declaring a couple of variables and also making assignments at the same time, which `declare` permits us to do.

**The `local` synonym**

Of course, the main point of `declare` is to declare variables and state certain attributes that they are to have. We haven't seen an example of that yet, but before we do, there's another subtle difference between `declare var=value` and simply `var=value`. This is briefly covered in a paragraph of the help information (run `help declare` in a Bash shell):

_When used in a function, `declare` makes NAMEs local, as with the `local` command.  The `-g` option suppresses this behavior._

So `local` is our next synonym for `declare`, in the context a function definition. An example script `foo` will help:

```bash
func1() {
  local var1
  var1="Apple"
  echo "func1: $var1"
}

func2() {
  declare var1
  var1="Banana"
  echo "func2: $var1"
}

func3() {
  var1="Carrot"
  echo "func3: $var1"
}

var1="Main"
echo "var1 is $var1"
func1
echo "var1 is $var1"
func2
echo "var1 is $var1"
func3
echo "var1 is $var1"
```

Let's look at what we get when this script is executed:

```
> bash ./foo
var1 is Main
func1: Apple
var1 is Main
func2: Banana
var1 is Main
func3: Carrot
var1 is Carrot
```

The thing to spot here is that because neither `local` nor `declare` were used for `var1` in the definition of the `func3` function, the assignment of the value `Carrot` was not restricted to the scope of that function, and when back in the main part of the script, the value of `var1` has the value that it was assigned within `func3`, i.e. `Carrot`, not `Main` any more.

**Options for `declare`**

Of course, given the main purpose of `declare`, it's worth briefly looking at more specific uses. There are various options, adequately covered by various sources including [Advanced Bash-Scripting Guide - Chapter 9: Another Look at Variables](https://tldp.org/LDP/abs/html/declareref.html), and so only summarised here:

|-|-|
|`-r`|Read-only|
|`-i`|Integer|
|`-a`|Array|
|`-A`|Associative array (i.e. a dictionary, or object)|
|`-f`|Function|
|`-x`|Exported|
|`-g`|Global|

There are other options, but these are the most common, at least as far as I've found in my research. Others are covered in the `help declare` output.

**The `readonly` synonym**

The `-r` option for `declare` has a sort of synonym too, which is `readonly`. However, there's a difference relating to scope; while `declare -r` will use function-local scope (similar to how it was used in `func1` and `func2` earlier), `readonly` will not respect that and simply use the global scope, even inside functions.

In other words, if you were to add another function definition to the above `foo` script example, like this:

```bash
func4() {
  readonly var1
  var1="Damson"
  echo "func4: $var1"
}
```

... then when `func4` had been executed, the value of `var1` in the main section of the script would then also be `Damson`.

Using `declare -r` here instead is the safer approach, in that the local function scope is respected. Note however that if we add `-g` (denoting the "global" attribute) to this, i.e. use `declare -r -g` or `declare -rg`, then the effect would be the same as using `readonly`.

**The `export` synonym and what `-x` implies**

There's one final synonym I found in this journey of discovery, and that's `export`, which is the equivalent of `declare -x`. It took me a few minutes to properly think about what this "available for export" attribute actually implies.

Like me, you've most probably used `export` in your `.bashrc` file, to set "global" variables when your shell session starts, to be available to you in that session and in executables that you invoke there. Usually these variable names will be in upper case by convention, denoting variables that are "environment" wide. In your shell, you can use `env` to see what these are. Note that the list that `env` produces includes variables automatically available to you in the shell too, such as `HOME` and `PATH`.

So what does `declare -x` imply, in the context of a script that you might write and then invoke? It does not mean that once the script finishes, that variable will be available to you in the shell. As an example, consider this script `bar`:

```
declare -x var2="Raining"
echo "var2 is $var2"
```

When we run this, look at what we get:

```shell
> echo "$var2" # nothing up my sleeve

> ./bar
var2 is Raining
> echo "$var2"

>
```

But what if we also had another script `baz`:

```
echo "In baz: var2 is $var2"
```

and we invoked it from within the `bar` script:

```
declare -x var2="Raining"
echo "var2 is $var2"
./baz
```

You can guess what the output will be:

```shell
> ./bar
var2 is Raining
In baz: var2 is Raining
```

And on returning to the shell prompt, we can double check that `var2` doesn't have a value:

```shell
> echo "$var2"

>
```

The way I think about this in my mind is like a tree structure:

```
shell
 |
 +-- bar        <- var2 declared with -x as 'exported'
      |
      +-- baz   <- var2 available here too
```

Exporting descends, rather than ascends, so there's no way `var2` could ever be made available like this in the `shell`.

That's about it, I think. I hope this is useful; I have found it helpful to try and explain these concepts to you, as it helps me learn. In researching, I came across some content in Stack Overflow and Stack Exchange - so thanks to those folks who took the time to explain things there. You may want to reference them too:

- [In bash scripting, what's the different between declare and a normal variable?](https://unix.stackexchange.com/questions/254367/in-bash-scripting-whats-the-different-between-declare-and-a-normal-variable)
- [Differences between declare, typeset and local variable in Bash](https://stackoverflow.com/questions/4419704/differences-between-declare-typeset-and-local-variable-in-bash)
- [what is difference in `declare -r` and `readonly` in bash?](https://stackoverflow.com/questions/30362831/what-is-difference-in-declare-r-and-readonly-in-bash)
