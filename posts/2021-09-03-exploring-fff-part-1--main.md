---
layout: post
title: Exploring fff part 1 - main
tags:
  - autodidactics
  - fff
  - shell
---

_Here's what I learned from starting to read the source code to fff - in particular, the main function._

[`fff`](https://github.com/dylanaraps/fff) is "a simple file manager written in Bash". As I'm always on the lookout to learn more about Bash, that description got my attention immediately. It's a small but perfectly formed offering, complete with man page and even a `Makefile` for installation. And the file manager executable\* itself is a single Bash script.

\*I use this term deliberately, and it does make me stop and think every time I see scripts in a `bin` directory (where "bin" stands for binary). But that's a conversation for another time.

The author, [Dylan Araps](https://github.com/dylanaraps) has produced other interesting pieces of software (such as [neofetch](https://github.com/dylanaraps/neofetch)) as well some great documents such as the [pure bash bible](https://github.com/dylanaraps/pure-bash-bible) as well as the [pure sh bible](https://github.com/dylanaraps/pure-sh-bible). He's also the creator of [Kiss Linux](https://kisslinux.org/). He has a reputation for writing great Bash code, so this seems like an opportunity too good to miss to learn from better programmers.

It seems that recently Dylan has [disappeared off the radar](https://www.reddit.com/r/kisslinux/comments/lsbz8n/an_update_on_dylan/), I don't know what the situation is but I wish him well.

Anyway, I wanted to take a first look at `fff` to see what I could discern. I'm reviewing the code as it stands at the latest to-date [commit](https://github.com/dylanaraps/fff/commit/5b90a8599cce3333672947438bb1718e1298e068), i.e. [here](https://github.com/dylanaraps/fff/tree/5b90a8599cce3333672947438bb1718e1298e068).

Where I can, I link to reference material so you can dig in further to Bash details that take your fancy. This reference material includes the following sites (and there are more of course):

* [Bash Reference Manual](https://www.gnu.org/software/bash/manual/html_node/index.html)
* [Unix & Linux Stack Exchange](https://unix.stackexchange.com/) (esp. the [`bash` tag](https://unix.stackexchange.com/questions/tagged/bash))
* [Bash Hackers Wiki](https://wiki.bash-hackers.org/start)
* the [Bash FAQ on Greg's Wiki](https://mywiki.wooledge.org/BashFAQ)
* the [Shellcheck Wiki](https://github.com/koalaman/shellcheck/wiki)

# Structure and use of main function

As I mentioned recently in [Learning by rewriting - bash, jq and fzf details](https://qmacro.org/2021/08/26/learning-by-rewriting/), I like to structure Bash scripts into functions, with a `main` function towards the end, followed by a simple call to that function, passing in everything that was specified on the command line via the `$@` [special parameter](https://www.gnu.org/software/bash/manual/html_node/Special-Parameters.html) which "expands to the positional parameters, starting from one" (positional parameter zero is the name of the script itself).

This is a practice I picked up, I think, from Google's [Shell Style Guide](https://google.github.io/styleguide/shellguide.html) - see [this section](https://google.github.io/styleguide/shellguide.html#s7.8-main) for details. I wrote about this guide last year in [Improving my shell scripting](https://qmacro.org/2020/10/05/improving-my-shell-scripting/).

Dylan structures `fff` in the same way, and [uses the `main` pattern too](https://github.com/dylanaraps/fff/blob/5b90a8599cce3333672947438bb1718e1298e068/fff#L1145). For me, that's a good affirmation of this approach.

The `main` function itself [begins with](https://github.com/dylanaraps/fff/blob/5b90a8599cce3333672947438bb1718e1298e068/fff#L1074-L1078) a series of comments indented to the same level as the rest of the function body.

```bash
main() {
    # Handle a directory as the first argument.
    # 'cd' is a cheap way of finding the full path to a directory.
    # It updates the '$PWD' variable on successful execution.
    # It handles relative paths as well as '../../../'.
```

I used to oscillate between putting comments that described a function _before_ the function definition, and _within_ the function definition. On balance I prefer the comments to be within, so the entire function content is encapsulated within the `{...}` brace-bound block.

The comment here is interesting too; it shows that a knowledge of side effects (the setting of a value in `$PWD`) can be useful, and also a willingness to use `cd` itself; to quote Ward Cunningham, "the simplest thing that could possibly work" (this came up in a great interview with Ward, which I've transcoded to audio format in my "Tech Aloud" podcast - see [The Simplest Thing that Could Possibly Work, A conversation with Ward Cunningham](https://anchor.fm/tech-aloud/episodes/The-Simplest-Thing-that-Could-Possibly-Work--A-conversation-with-Ward-Cunningham--Part-V---Bill-Venners-e5dpts)).

## First line - changing directory

The [first actual executable line](https://github.com/dylanaraps/fff/blob/5b90a8599cce3333672947438bb1718e1298e068/fff#L1081) is now ready for our gaze, and it's a beauty.

```bash
cd "${2:-$1}" &>/dev/null ||:
```

What can we unpack from that?

<a name="parameter-expansion"/>

### Parameter expansion "${2:-$1}"

Let's start with the [parameter expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html) used here: `"${2:-$1}"`. The `${parameter:-word}` form lets you specify a default value, basically; if the value of 'parameter' is unset or null, then the expansion of 'word' is substituted.

First of all, the idea is that if a value is specified when `fff` is invoked, it's used as the directory to start in. Now that's established, let's dig in a little more.

The first question that comes to mind is why is `$2` (the second parameter) specified first, falling back to `$1` here? Well my take is that it's again a simple but effective way of handling optional parameters when the script is invoked.

There has been an awful lot written about how best (and how not) to parse script parameters in Bash, from roll-your-own solutions, the use of the `switch` statement, and of course the `getopts` builtin. Each approach has its merits and downsides, and there doesn't seem to be a single, universal ideal.

If we read a little further ahead in the `main` function, we notice checks for various options in `$1`:

|Check for|Check with|
|-|-|
|Version information|`[[ $1 == -v ]] && { ... }`|
|Help|`[[ $1 == -h ]] && { ... }`|
|Some custom file picker processing|`[[ $1 == -p ]] && { ... }`|

So we know from this that there are at least three option parameters that `fff` understands, and that they are expected before anything else (the starting directory, if any) is passed on invocation (I guess we can assume that Dylan doesn't expect more than one of them to be specified in any single invocation too).

Knowing this, the `"${2:-$1}"` incantation is easier to understand: it tries for the value of the second parameter to be the directory to start in, assuming that one of the option parameters might have been specified first. But if a option parameter _wasn't_ specified, then any starting directory would not be in `$2`, but in `$1`, which the parameter expansion deals with perfectly here.

I think this potentially saves some unnecessary conditional logic that would otherwise make this section of `main` more verbose. I like it!

<a name="output-redirection"/>

### Output redirection

What if no starting directory was specified at all? What if a value was specified but that value wasn't a directory, wasn't something that was going to make sense being passed to `cd`?

Giving an inappropriate value to `cd` results in an error, for example:

```bash
$ cd foo  # foo doesn't exist
-bash: cd: foo: No such file or directory
```

or even just:

```bash
$ cd testfile # this is a file not a directory
-bash: cd: testfile: Not a directory
```

The behaviour actually appropriate in these cases is just to allow the `cd` invocation to fail, and for `fff` to start in whatever directory we happen to be in. We don't want to see any error messages, so they're redirected to `/dev/null`. This redirection construct used is quite interesting in itself, though.

What we see here is `&>` and according to [3.6.4 Redirecting Standard Output and Standard Error](https://www.gnu.org/software/bash/manual/html_node/Redirections.html#Redirecting-Standard-Output-and-Standard-Error) in the Bash manual, it's the preferred short form for redirecting both standard output (STDOUT) and standard error (STDERR) to the same place. Indeed, we see that

```
&>/dev/null
```

is equivalent to

```
>/dev/null 2>&1
```

Moreover, you may be happy to find out that this in turn is a short form of

```
1>/dev/null 2>&1
```

because the standard three file descriptors that are opened are:

|Descriptor|Representation|
|-|-|
|0|standard input (STDIN)|
|1|standard output (STDOUT)|
|2|standard error (STDERR)|

This is just my guess, but because redirecting standard output to a file is very common, the simple short form `>` (for `1>`) is very useful and more logical to allow than a short form for redirecting standard error (`2>`).

Note that when using redirection, the [order of redirection](https://wiki.bash-hackers.org/howto/redirection_tutorial#order_of_redirection_ie_file_2_1_vs_2_1_file) is important:

```
>/dev/null 2>&1
```

is not the same as

```
2>&1 >/dev/null
```

So we have to be careful. One could therefore argue then that the use of this short form of `&>` here in the `main` function is helpful because there's only one part to the construct, so you can't get it "the wrong way round".

I recommend the wonderfully illustrated [Redirection Tutorial in the Bash Hackers Wiki](https://wiki.bash-hackers.org/howto/redirection_tutorial) for lots more goodness on this subject.

<a name="no-operation"/>

### The no operation command : (colon)

The comment above the `cd` invocation sort of explains the last bit:

```bash
# '||:': Do nothing if 'cd' fails. We don't care.
cd "${2:-$1}" &>/dev/null ||:
```

It's not unusual to see the logical operator for OR, i.e. `||`. What's interesting is that this operator is explained in the Bash manual in the context of [lists](https://www.gnu.org/software/bash/manual/html_node/Lists.html#Lists) - as separators within such lists.

So this invocation in the `main` function is called an "OR list", i.e. `command1 || command2` where `command2` is executed if and only if `command1` fails. What does "fail" mean? Well, return a non-zero exit status, basically.

So if the `cd` command fails, what gets executed as command2? Well that's the even more interesting part. It's `:`.

Yes, the colon is a [shell builtin inherited from the Bourne shell (sh)](https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html) and is the "no operation" command (a bit like, say, `pass` in Python). In some ways it has a similar effect to what `true` does (i.e. nothing, successfully) but it's also different, in that it will expand arguments and perform redirections. For example, you can specify stuff after the colon to manipulate files if needed.

Read more on this no operation or "null command" in [What is the Bash null command?](https://www.shell-tips.com/bash/null-command/), and also take a look at [this example](https://github.com/dylanaraps/pash/blob/c61a24b981345be9e09af5e1d870a01fba6d8eac/pash#L176), from `pash`, [a  password manager written in POSIX `sh`](https://github.com/dylanaraps/pash) (from the same author), where `:` appears with "side effects", using the `:=` parameter expansion to assign default values to a couple of variables:

```bash
: "${PASH_DIR:=${XDG_DATA_HOME:=$HOME/.local/share}/pash}"
```

We'll examine the use of `:=` later in this post when we come across it.

So now that we've looked through the interesting parts of this line, we can translate it to: "_try to change directory to what was given in the second parameter when invoked, and failing that, the first parameter; don't show any errors or anything at all on the terminal, and if that fails generally, don't do anything_". Simple and minimal. A great start!

## Next lines - handling option parameters

Following this first line we have those tests we saw briefly earlier, the ones that check for and act upon specific option parameters. Interestingly the availability of these option parameters is not documented, at least as far as I can see - either in the [man page](https://github.com/dylanaraps/fff/blob/5b90a8599cce3333672947438bb1718e1298e068/fff.1) or in the GitHub repo in general.

Anyway, I like the way these action-on-condition lines are written, they're short, concise and are also reminiscent of the sorts of expressions one sees in Perl scripts too (or is it the other way around - after all, Perl was created as an amalgam (and more) of various shell scripting substrates).

Looking at the first instance, we see this:

```bash
[[ $1 == -v ]] && {
    printf '%s\n' "fff 2.2"
    exit
}
```

Beyond the actual concise way this has been written, avoiding the wordy "if ... then ... fi" construct, there are a couple of things that are worth looking at.

<a name="conditional-expression"/>

### Conditional expression

Following the `if` of the standard construct, we have a command list, the exit code of which is checked to determine how to proceed. How this command list is expressed has changed over the years, as we've moved from `sh` to `bash` and had POSIX to think about too.

More traditionally the condition `$1 == -v` might have been introduced with `test`, or expressed within single square brackets, i.e. `[ $1 == -v ]`. The opening single square bracket is interesting in its own right, being a synonym for `test`. In fact, while `[` is built in to many shells (including `bash`), it's also an external command, as is `test`. In case you want to find out more, you may find this post interesting: [The open square bracket \[ is an executable](https://qmacro.org/autodidactics/2020/08/21/open-square-bracket/).

These days one often sees the more modern version of double square brackets, as we see here. This is a construct also built into `bash` and allows for a richer set of expressions within. For example, the operator `=~`, which allows the use of a regular expression for matching, is not available within the `[ ... ]` construct but is available within `[[ ... ]]`. Moreover, there are different quoting rules; for example, in some cases, you can omit double quotes within some `[[ ... ]]`-enclosed conditions.

Here are a couple of helpful answers with more information, on the Unix and Linux Stack Exchange:

* [When is double-quoting necessary](https://unix.stackexchange.com/questions/68694/when-is-double-quoting-necessary/68748#68748)
* [Why does parameter expansion with spaces without quotes work inside double brackets \[\[ but not inside single brackets \[?](https://unix.stackexchange.com/questions/32210/why-does-parameter-expansion-with-spaces-without-quotes-work-inside-double-brack/32227#32227)

<a name="printf"/>

### Use of printf

Why is `printf` used here, and not the arguably simpler `echo`? The main differences between the two are:

* by default, `echo` adds a newline character, `printf` does not
* `printf` allows for and centres around a format string

There's some amazing background information on [echo(1) and printf(1)](https://www.in-ulm.de/~mascheck/various/echo+printf/), but for me the bottom line is that `printf` gives you more control over the output. Perhaps for those versed in programming languages where there's a similar format string focused `printf` function, using it feels more natural.

Throughout the entire `fff` script there's no use of `echo`, only `printf`; my guess is simply that `printf` is used here for consistency throughout. I also am guessing that the separation of the format string from any variable values allows for a consistency in expression - none of the uses of `printf` in `fff` have the format string in anything other than single quotes, meaning there's less to worry about in terms of variable expansions.

Before we leave this section, I think it's worth pointing out something minor but nonetheless interesting. I often have a `usage` function that emits instructions to standard out, and would be called in the situation where help was requested. I do like the way that the Unix philosophy is used even here; there's [man page content](https://github.com/dylanaraps/fff/blob/5b90a8599cce3333672947438bb1718e1298e068/fff.1) as we saw earlier, so why not use that instead? This also emphasises the extremely short distance between script and interactive command line, with shell languages:

```bash
[[ $1 == -h ]] && {
    man fff
    exit
}
```

### Link to fff.vim

Finally, let's take a quick look at the third option parameter here, `-p`:

```bash
# Store file name in a file on open instead of using 'FFF_OPENER'.
# Used in 'fff.vim'.
[[ $1 == -p ]] && {
    file_picker=1
}
```

It looks like this is the one that caused the introduction of the `"${2:-$1}"` parameter expansion we examined earlier, when it was introduced with this commit: [general: Added -p to store opened files in a file for use in fff.vim](https://github.com/dylanaraps/fff/commit/7c2144abaaa012b1f61601dbcb326da482ec36e9). In addition to the comment here, the title of the commit sort of gives it away ... `-p` is for use from within the Vim plugin [fff.vim](https://github.com/dylanaraps/fff.vim) which allows `fff` to be used as a file picker within the editor.

### No explicit variable declarations

One last thing that catches my eye here; this is the first time we see a variable assignment. The odd thing (to me) is that nowhere in the script is the `file_picker` variable declared.

There is some usage of `declare` elsewhere in the script, so we'll leave that examination until then, except to notice that this undeclaredness is not something that `shellcheck` complains about. If you ask `shellcheck` to check the source to `fff`, and get it to explicitly exclude specific errors as it does in the [CI configuration](https://github.com/dylanaraps/fff/blob/c7e9b75648900d77e016ffc6a9ef2b7e807e49cc/.travis.yml#L8) (none of them related to variable declaration):

```bash
shellcheck fff -e 2254 -e 2244 -e 1090 -e 1091
```

then `shellcheck` ends calmly and quietly with no errors. Maybe my fervent desire to use `declare` and `local` liberally throughout my scripts is misguided?

## Setup section

The section that follows the processing of options is about handling certain contexts.

### Bash version check

The [first of which](https://github.com/dylanaraps/fff/blob/5b90a8599cce3333672947438bb1718e1298e068/fff#L1106-L1107) is for where we're running a relatively modern version of Bash:

```bash
((BASH_VERSINFO[0] > 3)) &&
    read_flags=(-t 0.05)
```

There's so much to unpack from this; let's start with the `BASH_VERSINFO` environment variable. What Bash environment variables are available, generally? Well, there's quite a few - getting the completion working for us with the Tab key, we see this:

```bash
$ echo $BASH<tab>
$BASH                      $BASH_ARGC                 $BASH_COMMAND              $BASH_SOURCE
$BASHOPTS                  $BASH_ARGV                 $BASH_COMPLETION_VERSINFO  $BASH_SUBSHELL
$BASHPID                   $BASH_ARGV0                $BASH_LINENO               $BASH_VERSINFO
$BASH_ALIASES              $BASH_CMDS                 $BASH_REMATCH              $BASH_VERSION
```

There's `BASH_VERSION` which is a string like this:

```
5.1.4(1)-release
```

But there's also `BASH_VERSINFO` which is an array containing the various pieces of that version string, plus a bit more too:

```bash
$ for val in "${BASH_VERSINFO[@]}"; do echo "$val"; done
5
1
4
1
release
x86_64-pc-linux-gnu
```

I hadn't known of the existence of `BASH_VERSINFO` until now. Using an element of this array is a better approach than parsing out the value from the `BASH_VERSION` string.

Something else to unpack is the construct within which we find the reference to `BASH_VERSINFO` too. That's the `(( ... ))` construct, an [arithmetic evaluation](https://wiki.bash-hackers.org/syntax/ccmd/arithmetic_eval) containing an [arithmetic expression](https://www.gnu.org/software/bash/manual/html_node/Shell-Arithmetic.html). I tend to think of these expressions as being in one of two categories:

* variable assignment, e.g. `(( answer = 40 + 2 ))`
* condition, e.g. `(( answer < 50 ))`

There's a related construct called an [arithmetic expansion](https://www.gnu.org/software/bash/manual/html_node/Arithmetic-Expansion.html) which follows the usual Bash meaning of "expansion", whereby the evaluation of the arithmetic expression it contains is substituted as the result; the construct looks like this: `$(( expression ))`.

Anyway, here we have an arithmetic evaluation acting as a condition in a short form of the `if` construct. And what is executed if the condition is true, i.e. if the version of Bash is indeed greater than 3? Now **that** has had me scratching my head for a while. Not about _what_ it is, but _why_ Dylan used it.

This is what I'm talking about:

```bash
read_flags=(-t 0.05)
```

The `read_flags` variable is used later in this `main` function, in a call to `read`, like this:

```bash
read "${read_flags[@]}" -srn 1 && key "$REPLY"
```

I thought it was quite unusual, or at least very deliberate, to have used an array `(-t 0.05)` instead of just a string `"-t 0.05"` here. Dylan [used this directly in a single commit introducing the read_flags feature](https://github.com/dylanaraps/fff/commit/f0023f93fde103a0d69eea26b4c3f589bf68e824), as if it was obvious that this use of an array was the right thing to do from the outset. From a pragmatic point of view, it was clearly the right thing to do, as using a string like this:

```bash
read_flags="-t 0.05" read "$read_flags" -srn 1
```

would have resulted in `read` complaining about the timeout (`-t`) value, like this:

```
read:  0.05: invalid timeout specification
```

I had struggled a little with this, knowing it was related to the whitespace before the 0.05 timeout value, but couldn't quite figure it out myself. I [asked on the Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/667139/bashs-read-builtin-errors-on-a-string-based-timeout-option-specification-but-no) and got some wonderful answers and insights, thank you folks. I'd encourage you to read the question and the answers supplied for enlightenment, if you're interested.

A side effect of the enlightenment that came my way from this was the fact that in preparing the error message above, I realised that a simple string _could_ have been used here, as long as it was _not_ quoted in the invocation:

```bash
read_flags="-t 0.05" read $read_flags -srn 1
```

This works fine and `read` doesn't complain, because the shell is [word splitting](https://mywiki.wooledge.org/WordSplitting) on whitespace and thus the rogue space between `-t` and `0.05` which was being passed to `read` is now consumed in the word splitting action. I'm so used to quoting variables because, since [introducing `shellcheck` into my scripting flow](https://qmacro.org/2020/10/05/improving-my-shell-scripting) I'm constantly reminded to so by [SC2086](https://github.com/koalaman/shellcheck/wiki/SC2086). I guess there are (rare) cases where you _don't_ want to avoid word splitting on the value of a variable.

### FFF settings check

The next two checks are related to `fff` options, based on the values of the environment variables `FFF_LS_COLORS` and `FFF_HIDDEN`. Both exhibit nice examples of a particular type of [parameter expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html), one that we briefly noticed earlier in this post in the `pash` script.

This is what those checks look like:

```bash
((${FFF_LS_COLORS:=1} == 1)) &&
    get_ls_colors

((${FFF_HIDDEN:=0} == 1)) &&
    shopt -s dotglob
```

The `:=` form of shell parameter expansion lets us assign a parameter a value if it doesn't have one. To quote the documentation for this `${parameter:=word}` form:

> If _parameter_ is unset or null, the expansion of _word_ is assigned to _parameter_. The value of _parameter_ is then substituted. Positional parameters and special parameters may not be assigned to in this way.

So this is basically a default assignment, before the actual comparison with `==`. Taking the first example, we can think of it as: "If the `FFF_LS_COLORS` variable is unset or null, assign it the value of `1`. Now, is the value of `FFF_LS_COLORS` equal to `1`?"

The second example is similar, except that the default value to assign to `FFF_HIDDEN`, before the actual comparison, is `0` not `1`.

This is a very succinct way of assigning default values, with an expression. In some ways the shape and action of `:=` reminds me of Perl's `||=`. Or is it the other way round?

While the `get_ls_colors` function is elsewhere in the `fff` script and we'll get to that another time, it's worth taking a quick look at what's executed if `FFF_HIDDEN` is `1`. The [relevant section of the man page](https://github.com/dylanaraps/fff/blob/5b90a8599cce3333672947438bb1718e1298e068/fff.1#L80-L82) explains what this variable controls - whether hidden files are shown in the file manager or not. In fact, the explanation in the man page reflects the `:=0` part of the parameter expansion (i.e. the default value is `0`, as shown in the man page):

```
# Show/Hide hidden files on open.
# (On by default)
export FFF_HIDDEN=0
```

How is this showing or hiding of hidden files controlled? Through the use of the "shopt" (shell option) builtin. While asking for help on this with `shopt --help` will give you basic information -- such as how to set (with `-s`) or unset (with `-u`) the options -- it doesn't enumerate what the options are. For that I had to look at [the shopt builtin](https://www.gnu.org/software/bash/manual/html_node/The-Shopt-Builtin.html) of the Bash reference manual. The `dotglob` option is described thus:

> If set, Bash includes filenames beginning with a '.' in the results of filename expansion. The filenames '.' and '..' must always be matched explicitly, even if dotglob is set.

Pretty self explanatory and not unexpected; still, it was nice to be able to see a shell option in action.

In fact, there are other shell options in use a little bit further down in this `main` function, and they're explained in comments, too:

```bash
# 'nocaseglob': Glob case insensitively (Used for case insensitive search).
# 'nullglob':   Don't expand non-matching globs to themselves.
shopt -s nocaseglob nullglob
```

These are sensible options for a file manager, at least, they make sense to me. Incidentally, there are more glob-related shell options: `extglob`, `failglob`, `globasciiranges` and `globstar`.

## Almost ready to start

At this point the options have been dealt with (and the trash and cache directories have been created); it's now time to set a few hooks to handle various signals, and then call various functions.

<a name="signals"/>

### Trapping and handling signals

This is done with the `trap` builtin, and there are [two instances of this](https://github.com/dylanaraps/fff/blob/5b90a8599cce3333672947438bb1718e1298e068/fff#L1123-L1127):

```bash
# Trap the exit signal (we need to reset the terminal to a useable state.)
trap 'reset_terminal' EXIT

# Trap the window resize signal (handle window resize events).
trap 'get_term_size; redraw' WINCH
```

Looking at the [Bash Beginners Guide section on traps](https://tldp.org/LDP/Bash-Beginners-Guide/html/sect_12_02.html) we can see that the `trap` pattern is:

```
trap [COMMANDS] [SIGNALS]
```

Looking at the first instance, while it's common for specific and individual SIGNALS to begin "SIG", there's also a general "EXIT" value that can be used; this triggers both when the shell script terminates of its own accord, or is terminated by the user with CTRL-C.

Running this simple script `terminator` and allowing it to exit, and then running it and CTRL-C'ing it after a second, demonstrates this:

```bash
trap 'echo EXITING...' EXIT
echo Press CTRL-C or wait 5 seconds to exit
sleep 5
```

Here's what happens:

```bash
$ bash terminator
Press CTRL-C or wait 5 seconds to exit
EXITING...
$ bash terminator
Press CTRL-C or wait 5 seconds to exit
^CEXITING...
```

It took me a bit longer than I thought to find definitive documentation on the signal in the second instance - `SIGWINCH` (or `WINCH`). Rather than being Bash specific, this is of course related to the interaction between processes and terminals in a Unix context. The [Signal (IPC) Wikipedia page](https://en.wikipedia.org/wiki/Signal_(IPC)) has a wealth of information, including a reference to `SIGWINCH` in the list of POSIX signals. To quote:

> The SIGWINCH signal is sent to a process when its controlling terminal changes its size (a window change).

The footnote reference associated with this leads to a [recent (2017) proposal](https://www.austingroupbugs.net/view.php?id=1151) which suggests why this signal is less widespread in coverage and use. While I'm aware of some of the more common signals (such as `SIGCHLD`, `SIGINT`, `SIGKILL` and so on) I'd never heard of `SIGWINCH` until now.

The two functions that are called when this signal is trapped, `get_term_size` and `redraw`, make sense in the context of what this "window change" signal represents.

## Main loop

The final part of the `main` script, after calling some functions to set things up, is what Dylan refers to as a "Vintage infinite loop". It's [quite the eyecatcher](https://github.com/dylanaraps/fff/blob/5b90a8599cce3333672947438bb1718e1298e068/fff#L1136-L1142):

```bash
# Vintage infinite loop.
for ((;;)); {
    read "${read_flags[@]}" -srn 1 && key "$REPLY"

    # Exit if there is no longer a terminal attached.
    [[ -t 1 ]] || exit 1
}
```


Why not simply `while true; do ...; done`? I can only summise this is something playful, an enjoyment of the relationship that Bash has (or doesn't have, mostly) to the C programming language, where this so-called [three-expression for loop](https://www.cyberciti.biz/faq/bash-for-loop/#C_style_for_loop) is widely used, with an initialiser, a loop continuation condition and a modifier that are separated by `;` characters. Common in C and related languages, but not so much in Bash, I would have thought.

What has got me thinking, however, is why and how does `((;;))` even work?

It's definitely a lesser used construct for loops in Bash; again, I had to search a little deeper to find official references to it. In [Advanced Bash-Scripting Guide: Chapter 11. Loops and Branches](https://tldp.org/LDP/abs/html/loops1.html), we see "Example 11-13. A C-style for loop":

```bash
LIMIT=10

for ((a=1; a <= LIMIT ; a++))  # Double parentheses, and naked "LIMIT"
do
  echo -n "$a "
done                           # A construct borrowed from ksh93.
```

I'm not sure if the reference to the Korn shell (ksh93)\* in the comment relates to the entire construct, or particularly to the triple semicolon-separated expression within the arithmetic evaluation `(( ... ))`. In any case, while it's clear what this is and how it works, it remains to me somewhat of a mystery as to why the particular instance used in the `main` function here works, where all three expressions are null `((;;))`.

\*Since listening to a very enjoyable [Committing to Cloud Native podcast](https://podcast.curiefense.io/) episode 22 recently: [Thoughts on Bash Becoming Interplanetary and More with Brian J. Fox](https://podcast.curiefense.io/22) I've become more aware of the relationship between Brian Fox (Bash's creator) and David Korn (ksh's creator), and the features and style of their respective shells, that they were striving to finalise in 1989 as replacements for Stephen Bourne's `sh`.

I am guessing first that the `for` knows to look for truthiness in the second expression (the one in between the two semicolons). That's a bit vague, I know. I'm also guessing that an empty value here is going to be "truthy", in that, according to the [Bash Hackers Wiki section on truth](https://wiki.bash-hackers.org/syntax/arith_expr#truth), anything that's not 0 is true. That seems more likely, but I'd love to find out more about this.

In any case, it's not always going to be an infinite loop; there's a [conditional expression](https://www.gnu.org/software/bash/manual/html_node/Bash-Conditional-Expressions.html) within the loop to test whether a terminal is (still) attached. This is the `[[ -t 1 ]]` part. Here's how the `-t` test is described:

> True if file descriptor fd is open and refers to a terminal.

In a happy circular twist of fate, we're back almost to where we started on this journey through the `main` function. File descriptor 1 refers to STDOUT, i.e. standard output. If `fff` (still) has its STDOUT connected to a terminal, then the loop continues. If not, it's terminated (`|| exit`).

Is this all that the loop does? Well, the key part (if you forgive the pun) is the call to `key` here:

```bash
read "${read_flags[@]}" -srn 1 && key "$reply"
```

The `key` function handles keypresses, and acts accordingly. The core action part of `fff`, effectively. And it's only called if `read` successfully receives a keypress on that occasion. Nice!

So that's it for the `main` function. Directory startup, option parameter handling, setup and initial calls, and the main loop. Such a lot to learn in so few lines.

---

If you're still reading, thank you for indulging me, and I hope you've enjoyed the journey as much as I have. There's plenty more to learn from this script; let me know if you found it useful and whether I should venture further.

**Update: You may like to know that there's now a second part: [Exploring fff part 2 - get_ls_colors](https://qmacro.org/autodidactics/2021/11/07/exploring-fff-part-2-get-ls-colors/).**
