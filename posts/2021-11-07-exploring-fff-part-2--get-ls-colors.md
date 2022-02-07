---
layout: post
title: Exploring fff part 2 - get_ls_colors
tags:
  - autodidactics
  - fff
  - shell
---

_Continuing to read and learn from the source code to fff - this time, the get_ls_colors function._

In [part 1][part-1] I took a first look at [`fff`](https://github.com/dylanaraps/fff), "a simple file manager written in Bash", focusing on the `main` function, and learned a lot. In this part I take a look at the first function called from `main`, and that is `get_ls_colors`. I'm continuing to use the same commit reference as last time, i.e. the state of `fff` [here](https://github.com/dylanaraps/fff/tree/5b90a8599cce3333672947438bb1718e1298e068).

<a name="ls_colors"></a>
## LS_COLORS and where get_ls_colors comes in

[Here's](https://github.com/dylanaraps/fff/blob/5b90a8599cce3333672947438bb1718e1298e068/fff#L1109-L1110) the context of the call to `get_ls_colors` from `main`:

```bash
((${FFF_LS_COLORS:=1} == 1)) &&
    get_ls_colors
```

Now it's fairly obvious that this has something to do with how the `fff` display is coloured, and we get some extra clue about this [from the man page content](https://github.com/dylanaraps/fff/blob/5b90a8599cce3333672947438bb1718e1298e068/fff.1#L75-L78), in the customisation section:

```bash
# Use LS_COLORS to color fff.
# (On by default if available)
# (Ignores FFF_COL1)
export FFF_LS_COLORS=1
```

First, what is `LS_COLORS`? Well it's an environment variable that controls colourisation for the output of `ls` - so different types of files can be shown in different colours. And it looks like `fff` can use the configuration in `LS_COLORS`.

So far so good, but there's also some fallback colour mechanism that we can see in the [Customisation section of the main README](https://github.com/dylanaraps/fff/tree/5b90a8599cce3333672947438bb1718e1298e068#customization) too. I didn't quite grok the comment "On by default if available" but it came clear once I'd looked into `LS_COLORS` and remembered the assignment type of [parameter expansion][shell-parameter-expansion] that we see above. In other words, `${FFF_LS_COLORS:=1}` above takes care of the "On by default" part.

What about the "if available" part though?

<a name="differentflavours"></a>
### Different flavours of ls colourisation

My operating system preference is Linux, but I've not had the chance to use it for work for a long time; my current work machine OS is macOS. While that goes quite far in giving me the \*nix environment I feel most at home in, its heritage is the BSD flavour, which I'm not as used to.

One of the differences which is very relevant here is how the colours for `ls` output are controlled. I'd been looking for the existence of `LS_COLORS` in my shell prompt on my main macOS machine, but hadn't found it. What I *had* found was an environment variable `CLICOLOR` which was set to `true`, and there was a `-G` option for `ls` to turn on colours, instead of the `--color=auto` that I've seen before. And confusingly, I'd seen reference to `LSCOLORS` (not `LS_COLORS`).

I hadn't really paid much attention until now because the output of `ls` in my macOS terminal is coloured already; this is because having the `CLICOLOR` environment variable set has the same effect as the `-G` option, i.e. to turn on colours.

Moreover, the colours in this context can be customised using values in another environment variable `LSCOLORS`.

That's all well and good, but since I've [started using dev containers](https://github.com/qmacro/dotfiles/tree/main/devcontainer) in earnest, I have remote, portable, consistent and reconnectable access to my ideal working environment (I run most of my containers on [my Synology NAS](https://www.google.com/search?q=site%3Aqmacro.org+synology)). So I'm back to a Linux flavoured \*nix environment, which is wonderful.

But this means that I'm now using a non-BSD `ls`, which means that `CLICOLOR` isn't applicable, nor is `LSCOLORS`. There's been a whole host of articles, posts and Stack Overflow Q&A entries written on this, so I won't add to it. Suffice it to say that `fff` respects the GNU `ls`, which means `LS_COLORS` is relevant ... and not `LSCOLORS`. While both these environment variables are used to customise the colours, the format of how the colour selections are specified are wildly different. Shortly, we'll see the `LS_COLORS` format, and how it's processed in `get_ls_colors`.

Regarding the `LS_COLORS` environment variable, I read a few posts online to learn more about this. One that I found helpful is [Configuring LS_COLORS](http://www.bigsoft.co.uk/blog/2008/04/11/configuring-ls_colors). This one also introduced me to the related `dircolors` command. And looking at the example value for `LS_COLORS`, it's clear that it's quite a complex combination of specifications.

Anyway, let's get back to the script.

<a name="diggingintothecode"></a>
## Digging into the code

Rather than look directly on the Web at what the `LS_COLORS` specifications are, let's first see if we can get a general feeling for them from reading the code here. Actually we get our first clue from the [comment that describes the function as a whole](https://github.com/dylanaraps/fff/blob/5b90a8599cce3333672947438bb1718e1298e068/fff#L104-L107):

```bash
get_ls_colors() {
    # Parse the LS_COLORS variable and declare each file type
    # as a separate variable.
    # Format: ':.ext=0;0:*.jpg=0;0;0:*png=0;0;0;0:'
```

The value looks like a series of `:` separated pairs of file patterns and colour specifications.

The first bit of code is there so `get_ls_colors` can be aborted if there's nothing to parse:

```bash
[[ -z $LS_COLORS ]] && {
    FFF_LS_COLORS=0
    return
}
```

Here we have the classic [conditional expression that we saw in part 1][conditional-expression]; here, the `-z` unary expression evaluates to true if the length of the given string -- in this case the value of the `LS_COLORS` variable -- is zero. If it is, there's no point in trying to parse anything, and the variable that keeps track of whether colours should be shown (`FFF_LS_COLORS`) is set to `0` before the function is ended early.

In my journey through Bash scripting so far, seeing the `return` statement like this is still quite unusual, but it makes a lot of sense here. [It can take](https://tldp.org/LDP/abs/html/complexfunct.html#RETURNREF) an optional integer argument which is returned to the caller as the exit status.

<a name="splittingpairs"></a>
### Splitting the pairs into an array

Next comes a lovely line, with a comment:

```bash
# Turn $LS_COLORS into an array.
IFS=: read -ra ls_cols <<< "$LS_COLORS"
```

> Don't confuse `=:` with any sort of assignment operator you might have seen elsewhere (such as `:=` in Go or Mathematica) - it's just the assignment (`=`) of a colon (`:`) to `IFS`.

We saw one use of `read` in [part 1][part-1] but that was more about how the read flags were constructed and used. Here we have another use of `read`, arguably a very common one, i.e. in combination with a temporary setting of a value for the `IFS` environment variable. By temporary, I mean that the assignment holds just for the rest of that same line only.

Let's break it down: we have the explicit setting of `IFS`, a `read` statement, which is being given the value of the `LS_COLORS` variable as its input, via the rather splendid looking `<<<`.

<a name="IFS"></a>
### The IFS environment variable

So first, what's `IFS`? Well, it stands for "input field separator", or "internal field separator". The best overview I've found is [on the Bash Wiki](https://mywiki.wooledge.org/IFS) where it describes `IFS` as "a string of special characters which are to be treated as delimiters between words/fields when splitting a line of input". The default value for `IFS` consists of three different whitespace characters:

* space
* tab
* newline

And if `IFS` is unset (i.e. "has no value", which is different from "has a value that is empty") then the effect is as if it were to contain these three characters.

What's the splitting that's going on here, then? Well that's in the context of the `read` command.

<a name="readcommand"></a>
### The read command

The `read` command is a builtin, the description of which is "Read a line from the standard input and split it into fields". We'll get to what's being read shortly, but at least we now understand the context of the splitting. Moreover, the read invocation here is with a couple of options:

* `-r` do not allow backslashes to escape any characters
* `-a array` assign the words read to sequential indices of the array variable, starting at zero

The first option is very commonly seen with `read` and in fact if you don't specify it in your script, [shellcheck](https://github.com/koalaman/shellcheck) will point it out with message [2162 read without -r will mangle backslashes](https://github.com/koalaman/shellcheck/wiki/SC2162). It's rare that you're going to want to have backslashes in your input to be treated as escape characters, but that's what `read` will do, unless you supply the `-r` option.

The second option means that the fields that result from splitting will be placed in an array. Without an array, you might do something like this:

```bash
; read -r first second <<< "hello world"
; echo $first
hello
; echo $second
world
```

Using an array is sometimes more helpful, from a dynamic perspective:

```bash
; read -ra words <<< "hello world"
; echo ${words[0]}
hello
; echo ${words[1]}
world
```

<a name="ioredirection"></a>
### Input/output redirection, here documents and here strings

In [part 1][part-1] I took [a brief look at output redirection](https://github.com/qmacro/autodidactics/blob/fff-1/_posts/2021-08-30-exploring-fff-part-1---main.markdown#output-redirection). Now it's the time to look at input redirection.

I see the use of the input redirection symbol (`<`), and how it "grows" (to `<<` and even `<<<`) as the input "shrinks", in the same way as I see the first part of vehicle licence plates in Germany.

When I was over there, my car had the licence plate `KR DJ 400`. The first part of a licence plate, before the space, reflects the place the vehicle was registered. For large cities and towns, there's a single letter, for example D represents Düsseldorf. For medium sized places there are two letters, for example KR for Krefeld. And for small places there are three letters, for example WOB for Wolfsburg.

What do I mean about the input shrinking? Well to me, a file is "large", some in-line data is "smaller", and a string is "smaller still". Let's have a look at each one in turn. The syntax, examples are taken verbatim from the GNU Bash Reference Manual's [redirections](https://www.gnu.org/software/bash/manual/html_node/Redirections.html) section and contain extra syntax (such as the `[n]` below) but you can ignore that for now.

<a name="standardredirection"></a>
#### Standard redirection (`<`)

```
[n]<word
```

From the GNU Bash Reference Manual: "_The file whose name results from the expansion of_ word _to be opened for reading on file descriptor n, or the standard input (file descriptor 0) if n is not specified._". In other words, input is taken from the file `word`.

<a name="heredocument"></a>
#### Here document (`<<`)

```
[n]<<[-]word
  here-document
delimiter
```

A slightly strange name, this is a "here document". I think of this as "the input is right here!", rather than in a file. So, arguably "smaller" than a file (to follow the German licence place parallel). To quote the GNU Bash Reference Manual, "_input from the current source [is taken] until a line containing only_ word _(with no trailing blanks) is seen._". In other words, `word` here is not a filename, but a delimiter. The delimiter `EOF` is often seen.

I do find that this example from the reference manual is a little confusing as `word` is not the same as `delimiter` (which it would be in reality), and the indentation you see relates to the `<<-` version which you can read up on in that section.

<a name="herestring"></a>
#### Here string (`<<<`)

```
[n]<<< word
```

Smaller still is the "here string", the younger sibling of the "here document". This time, `word` is not a filename, nor is it a delimiter. It's actually the input.

To quote the GNU Bash Reference Manual again, "_the word undergoes tilde expansion, parameter and variable expansion, command substitution, arithmetic expansion, and quote removal. Filename expansion and word splitting are not performed. The result is supplied as a single string, with a newline appended, to the command on its standard input (or file descriptor n if n is specified)_".

Sensibly, in the case of here documents, none of the expansions happen, of course. Now hopefully the "hello world" example earlier makes sense.

Anyway, where in the `fff` script were we? Ah yes, at this line:

```bash
# Turn $LS_COLORS into an array.
IFS=: read -ra ls_cols <<< "$LS_COLORS"
```

So we now know that via a here string construction, the value of the `LS_COLORS` variable is the input that is read (into the `ls_cols` array).

Now we understand that, the final thing to think about is how the `IFS` value of `:` comes into play here. In the "hello world" example earlier, the default whitespace value(s) in `IFS` meant that "hello world" was split into "hello" and "world". To understand why `IFS` is being set to `:`, we need to know what a typical value for `LS_COLORS` looks like.

The comment we came across earlier gives us a nice small example:

```
# Format: ':.ext=0;0:*.jpg=0;0;0:*png=0;0;0;0:'
```

Let's manually set the value of `LS_COLORS` to the example value here, execute the line with the `read` command, and then look at what we get in `ls_cols`:

```bash
; LS_COLORS=':.ext=0;0:*.jpg=0;0;0:*png=0;0;0;0:'
; IFS=: read -ra ls_cols <<< "$LS_COLORS"
; echo "${ls_cols[@]}"
 .ext=0;0 *.jpg=0;0;0 *png=0;0;0;0
```

OK, sort of as expected. But what's that space character right at the start of the line, just before the `.ext=0;0`? We can see it more clearly by asking for the values to be printed on separate lines, like this:

```bash
; printf "%s\n" "${ls_cols[@]}"

.ext=0;0
*.jpg=0;0;0
*png=0;0;0;0
```

Because the value of `LS_COLORS` _starts with_ a colon, there's an empty value that gets put into the first slot of the array.

But this empty value doesn't seem to matter, as the rest of the `get_ls_colors` function is looking for specific patterns anyway. So let's start looking at that next.

<a name="processingitems"></a>
### Processing the individual LS_COLORS items

[Next up](https://github.com/dylanaraps/fff/blob/5b90a8599cce3333672947438bb1718e1298e068/fff#L116-L127) we have something similar to what we saw in [part 1][part-1] - a C-style for loop. This time it's not infinite:

```bash
for ((i=0;i<${%raw%}{#ls_cols[@]}{%endraw%};i++)); {
    # Separate patterns from file types.
    [[ ${ls_cols[i]} =~ ^\*[^\.] ]] &&
        ls_patterns+="${ls_cols[i]/=*}|"

    # Prepend 'ls_' to all LS_COLORS items
    # if they aren't types of files (symbolic links, block files etc.)
    [[ ${ls_cols[i]} =~ ^(\*|\.) ]] && {
        ls_cols[i]=${ls_cols[i]#\*}
        ls_cols[i]=ls_${ls_cols[i]#.}
    }
}
```

The loop control is based on iterating through the indices of the `ls_cols` array. Within the loop there are two actions that can be carried out, each dependent on a particular condition. Let's look at them one at a time, helped by what we see in the comments.

<a name="collectingpatterns"></a>
#### Collecting patterns

Not having looked too hard at the `LS_COLORS` specification, I wasn't exactly sure what this first condition/action was, what a "pattern" was, specifically. I had a rough idea of course, but things became clearer by looking at the detail of the condition:

```bash
[[ ${ls_cols[i]} =~ ^\*[^\.] ]]
```

This is another [conditional expression][conditional-expression], this time using the binary operator `=~` which allows for the use of a POSIX extended regular expression for matching (more information is available on the [Conditional Constructs][conditional-constructs] page of the GNU Bash Reference Manual).

Each of the items in `ls_cols` (via the `i` iterator) is tested according to the regular expression `^\*[^\.]` which breaks down like this:

|Pattern|Matches|
|-|-|
|`^`|Anchors to the start of the string|
|`\*`|An actual asterisk character|
|`[^\.]`|Any character except an actual period (`.`)|

Out of the values we see in the example `LS_COLORS` above, only this one matches:

```
*png=0;0;0;0
```

It looks like these "patterns" are different from "file types" in that it's not about the file extension (which would be introduced by a period). I'm still not sure what this distinction holds, but anyway, I'm going to keep going.

If this conditional expression is true, then what happens? Well, this line gets executed, and it's another beauty:

```bash
ls_patterns+="${ls_cols[i]/=*}|"
```

Let's start with `ls_patterns`. This is the first time this variable name appears. No previous declarations, no nothing. Is that a good thing? I'm not sure, but I do defer to Dylan's superior skill, style and experience here. It does turn out that, according to the [Advanced Bash Scripting Guide][absg], specifically section [4.3. Bash Variables Are Untyped](https://tldp.org/LDP/abs/html/untyped.html), "_Bash variables are character strings_". That is, unless they're explicitly [declared](https://tldp.org/LDP/abs/html/declareref.html) to be something else such as integers or arrays. So here `ls_patterns` is a string, and it starts out having no value.

That brief excursion helps us contextualise the `+=` assignment operator which is covered in the [Shell Parameters](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameters.html) section of the GNU Bash Reference Manual. Unless the variable is an integer or an array, this assignment operator does what we expect it to do, i.e. appends the value on the right hand side to any existing value already in the left hand side. Seeing the `|` at the end of the string on the right hand side, here:

```bash
"${ls_cols[i]/=*}|"
```

gives us a hint that it's going to be a pipe (`|`) separated string of those patterns that were matched.

But not exactly those patterns. Notice the `/=*` just after the `ls_cols[i]`. This is actually a short version of this string replacement form of [shell parameter expansion][shell-parameter-expansion]:

```
${parameter/pattern/string}
```

Specifically, what we're seeing is this rule in play: "_If string is null, matches of_ pattern _are deleted and the / following_ pattern _may be omitted._".

So `/=*` will cause anything starting with (and including) an equals sign to be removed from the value. Looking again at the `LS_COLORS` item matched above:

```
*png=0;0;0;0
```

this would remove the `=0;0;0;0` part, leaving just `*png` to be appended to `ls_patterns`, plus the `|` as the separator, i.e. `*png|`.

> This is not a mutating replacement; the value of the current item remains what it was.

So that's the "collecting patterns" part of this loop. What else is there?

<a name="itemtypes"></a>
#### Digging into LS_COLORS item types

The other part within the loop is similar; it is also introduced by a conditional expression using the `=~` operator, and the entire thing also takes the form `[[ condition ]] && action` as we've seen in multiple places already:

```bash
# Prepend 'ls_' to all LS_COLORS items
# if they aren't types of files (symbolic links, block files etc.)
[[ ${ls_cols[i]} =~ ^(\*|\.) ]] && {
    ls_cols[i]=${ls_cols[i]#\*}
    ls_cols[i]=ls_${ls_cols[i]#.}
}
```

Again, each `ls_cols` item is being tested, but what's the pattern this time? Well, there a clue in the comment. Digging into the regular expression `^(\*|\.)` we have this:

|Pattern|Matches|
|-|-|
|`^`|Anchors to the start of the string|
|`( | )`|Matching either of two values|
|`\*`|An actual asterisk|
|`\.`|An actual period|

So it seems as though this regular expression would actually match some of the items that the previous one would - anything beginning with an asterisk, basically. Perhaps now would be a good time to look at a larger examples of a `LS_COLORS` value in the wild. I'll use the `dircolors` command to produce one, as described in the [Configuring LS_COLORS](http://www.bigsoft.co.uk/blog/2008/04/11/configuring-ls_colors) article I mentioned earlier (I've artificially wrapped the `LS_COLORS` line to fit better into this blog post format):

```bash
; dircolors
LS_COLORS='rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01
:cd=40;33;01:or=40;31;01:mi=00:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=34;42:st
=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arc=01;31:*.arj=01;31:*.taz=01;31:*.
lha=01;31:*.lz4=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.tzo=0
1;31:*.t7z=01;31:*.zip=01;31:*.z=01;31:*.dz=01;31:*.gz=01;31:*.lrz=01;31:*.lz=
01;31:*.lzo=01;31:*.xz=01;31:*.zst=01;31:*.tzst=01;31:*.bz2=01;31:*.bz=01;31:*
.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=0
1;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.alz=01;31:*.ace=01;31:*.zoo=01;31:*
.cpio=01;31:*.7z=01;31:*.rz=01;31:*.cab=01;31:*.wim=01;31:*.swm=01;31:*.dwm=01
;31:*.esd=01;31:*.jpg=01;35:*.jpeg=01;35:*.mjpg=01;35:*.mjpeg=01;35:*.gif=01;3
5:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xp
m=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01
;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*
.webm=01;35:*.webp=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vo
b=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35
:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=0
1;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.ogv=01;35:*.ogx=01;35:*
.aac=00;36:*.au=00;36:*.flac=00;36:*.m4a=00;36:*.mid=00;36:*.midi=00;36:*.mka=
00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.oga=00;36:*
.opus=00;36:*.spx=00;36:*.xspf=00;36:';
export LS_COLORS
```

> This is another pattern in the \*nix world - some commands (like `dircolors` here) output further commands that can be executed using `eval`; in other words, if you run `eval $(dircolors)` you'll end up with your `LS_COLORS` variable set to the value you see, and also exported. Nice!

In the items in `LS_COLORS` above, there are two different types of values before the equals signs. It's easier to see if we display the items on separate lines. There are many ways to do this, one might be to use `tr` to translate each separating colon (`:`) to a newline, like this:

```bash
; echo $LS_COLORS | tr ':' '\n'
rs=0
di=01;34
ln=01;36
mh=00
pi=40;33
so=01;35
...
```

Not bad. But there's a more Bash specific way, and that is to make use of the parameter expansion mechanism we've already seen, to perform a string replacement like this:

```bash
; echo -e ${LS_COLORS//:/\\n}
rs=0
di=01;34
ln=01;36
mh=00
pi=40;33
so=01;35
...
```

This is another form of:

```
${parameter/pattern/string}
```

But in this case, because the actual pattern starts with a forward slash (i.e. the second one in `LS_COLORS//`), the replacement is "global" rather than singular, i.e. every occurrence of `pattern` is replaced with `string`. The `string` in this case is `\\n` which is a newline, where the first backslash is an escape, so that the second backslash (which goes with the `n` to make the newline character `\n`) is interpreted as an actual backslash.

Moreover, by default, `echo` suppresses any interpretation of backslashes in the way that we want, so the `-e` option is needed here to enable that interpretation (so that `\n` is actually interpreted as a newline).

Anyway, this larger example value for `LS_COLORS` shows that not only are there items starting with an asterisk, but also other two-character items - these represent file types. Examples are `ln` for symbolic links, `di` for directories, `so` for sockets, and so on.

Now the second regular expression `^(\*|\.)` that also matches items beginning with asterisks makes more sense, in that beyond what's matched here as well, there are other item types, and fits with the "_if they aren't types of files..._" comment.

But anyway, back down to business. What is to be done with `LS_COLORS` items that match this second regular expression - items that are _not_ file types? Let's take a closer look, bearing in mind what's in the comment that hints at prefixing "ls_" to these items:

```bash
ls_cols[i]=${ls_cols[i]#\*}
ls_cols[i]=ls_${ls_cols[i]#.}
```

This is effectively a two-pass change of the item value, by means of a [parameter expansion][shell-parameter-expansion] mechanism, specifically the `${parameter#word}` variety. Working through these two passes, based on the example value of `*.ogg=0;36`, this is what happens:

1. any leading asterisk (`*`) is removed, resulting in `.ogg=0;36`
1. any (now) leading period (`.`) is removed, and the string `ls_` is prepended, resulting in `ls_ogg=0;36`

I'm honestly not sure what the significance of this prefix is, but I guess we'll find out later.

> I had a hard time remembering the difference between the meanings of the `${parameter#word}` and `${parameter%word}` varieties (and their double versions, i.e. `${parameter##word}` and `${parameter%%word}`) until I decided to think about `#` being the character to introduce a comment at the _start of_ a line, and `%` being the percent character that one puts after (_at the end of_) a number.

<a name="processingallatonce"></a>
### Processing all the LS_COLORS items at once

Once this loop is complete, we may have some value in `ls_patterns` (if there were some items that started with an asterisk but without an immediately following period), and we definitely have all the item values in the `ls_cols` array, some of which will have been modified.

There's now a further modification, as the comment explains, to remove characters that wouldn't be allowed in a variable name. We'll see why this is important shortly. The modification here is not within an explicit loop, but in one single go - it's quite spectacular:

```bash
# Strip non-ascii characters from the string as they're
# used as a key to color the dir items and variable
# names in bash must be '[a-zA-z0-9_]'.
ls_cols=("${ls_cols[@]//[^a-zA-Z0-9=\\;]/_}")
```

The comment is great, not only because it tells us what's happening, but also why it's being done. I often wish more comments in the code that I have to read reflected the "why" as well as the "what". But that's a story for another time.

If we stare at the actual executable line for a bit, it's not that scary. It's the assignment of an array to `ls_cols` (which is what it is already, but the point here is that we want to modify values within it). This is the array assignment bit:

```bash
ls_cols=(...)
```

In the [Storing Values](https://wiki.bash-hackers.org/syntax/arrays#storing_values) section of the [Bash Hackers Wiki][bash-hackers-wiki] this is called a "compound assignment". But what is being assigned? Well, it's this:

```bash
"${ls_cols[@]//[^a-zA-Z0-9=\\;]/_}"
```

And by now we should recognise that immediately, albeit in a slightly different guise. It's our old friend the `${parameter/pattern/string}` parameter expansion, but this time, applied not to a scalar variable but to an array. The [Shell Parameter Expansion][shell-parameter-expansion] section for this variation has this to say: "_If parameter is an array variable subscripted with ‘@’ or ‘*’, the substitution operation is applied to each member of the array in turn, and the expansion is the resultant list._".

That's what we could probably guess would happen, but it's nice to have the behaviour described explicitly.

So what's happening in this parameter expansion? Well, the pattern is `[^a-zA-Z0-9=\\;]`, matching anything that _isn't_ alphanumeric or an equals sign, an actual backslash or a semicolon, and replacing all occurrences (all because the second forward slash signifies "global") with underscores. And this global replacement is performed on each member of the `ls_cols` array.

A short visualisation might help here. Let's say we have five items in the `ls_cols` array; we can set that up like this:

```bash
; ls_cols=(ab-c D%EF gh\\i =jkl x123)
```

Applying this parameter expansion and printing the results, one item on each line, looks like this

```bash
; printf "%s\n" "${ls_cols[@]//[^a-zA-Z0-9=\\;]/_}"
```

And the output is as follows:

```
ab_c
D_EF
gh\i
=jkl
x123
```

<a name="regex"></a>
### Setting up a regex for the patterns

There's a bit more processing before we're done with this function. Again, the comments are great. Let's take a look:

```bash
# Store the patterns in a '|' separated string
# for use in a REGEX match later.
ls_patterns=${ls_patterns//\*}
ls_patterns=${ls_patterns%?}
```

This is another two-pass process, modifying the contents of `ls_patterns`, which, if it contains anything\*, has pipe-separated pattern content.

\*the `dircolors`-generated value for `LS_COLORS` didn't have any such "patterns" at all

In the first pass here, any and all asterisks are removed. Then in the second pass any trailing question mark is removed. This makes sense, as asterisks and question marks have special meaning in regular expressions and if they were left in, they'd take on those meanings, which is very unlikely to be what's wanted.

<a name="ls_cols"></a>
### Making the ls_cols variables available

The contents of the `ls_cols` array are string items from the `LS_COLORS` variable, parsed and modified. Some of them -- the ones that are not file types like `di`, `so` and so on -- will have been prefixed with `ls_` too.

The last thing this `get_ls_colors` function does is to make these available as variable names. Here's the line, with the comments that go with it:

```bash
# Define the ls_ variables.
# 'declare' can't be used here as variables are scoped
# locally. 'declare -g' is not available in 'bash 3'.
# 'export' is a viable alternative.
export "${ls_cols[@]}" &> /dev/null
```

I was a bit confused at first as to what the comments signified, but a little digging down, via the `git blame` feature, allowed me to peel back the [palimpsest](https://en.wikipedia.org/wiki/Palimpsest) to reveal earlier versions of this part of the function.

The earliest occurrence of this form [appeared in Feb 2019](https://github.com/dylanaraps/fff/commit/3bc14f4ef9fd2e5155b6769c714913d66e7d8585#diff-f284bdc3c1c9e24a494e285cb387c69510f28de51c15bb93179d9c7f28705398L110), and replaced a previous use of `source` with the following:

```bash
# Declare all LS_COLORS variables.
declare -g "${ls_cols[@]}"
```

> The actual use of `source` that this replaced is amazing in its own right, and I know I can learn from it (and the linked source/eval meme image), but I'll leave that for another time: `source /dev/stdin <<< "${ls_exts/#;}" >/dev/null 2>&1`

So the first version of this was using `declare`, with the `-g` option, to declare those values as variables. If you're interested in learning more about declare, you may enjoy the post [Understanding declare][understanding-declare]. It includes a quote from the help page that talks specifically about using the `-g` ("global") option when `declare` is used within a function (as it is here) to ensure the variables are not just local to that function.

Later the same day, [this was changed](https://github.com/dylanaraps/fff/commit/b76ca4c13a13d21f723a1099fff92fb3e7fffdae) to almost what we have now:

```bash
# Define the ls_ variables.
export "${ls_cols[@]}"
```

Additionally, this [was expanded to](https://github.com/dylanaraps/fff/commit/d11a6a6adadf57adc4f72128f3afbc39d8a11733)

```bash
# Define the ls_ variables.
export "${ls_cols[@]}" &>/dev/null
```

to deal silently with anything that might go wrong with the export, and just a few days after that, in a [cleanup commit](https://github.com/dylanaraps/fff/commit/7bebeb28c7181bf9480e676e0660e5cab3eaa5ed), the comments that we see now were added.

Now that we have glimpsed a little of the history, and (via [Understanding declare][understanding-declare]) know that `-g` must be used with `declare` within a function to declare variables that have an existence beyond the function's scope, the comments make more sense.

I guess we'll find out _how_ these variables are used elsewhere in the script, but for now, this brings this post, on `get_ls_colors`, to an end.

<a name="wrappingup"></a>
### Wrapping up

I have again learned a lot by poring over the details of this, and I'm always happy to hear from you too. Has this helped? Did I miss something, or get something wrong? Whatever it is, please feel free to let me know in the comments mechanism below. Thanks for reading this far, and thanks especially to my son Joseph for a great eye and some very helpful observations!

<a name="splittingpairs"></a>
### Splitting the pairs into an array

Next comes a lovely line, with a comment:

```bash
# Turn $LS_COLORS into an array.
IFS=: read -ra ls_cols <<< "$LS_COLORS"
```

> Don't confuse `=:` with any sort of assignment operator you might have seen elsewhere (such as `:=` in Go or Mathematica) - it's just the assignment (`=`) of a colon (`:`) to `IFS`.

We saw one use of `read` in [part 1][part-1] but that was more about how the read flags were constructed and used. Here we have another use of `read`, arguably a very common one, i.e. in combination with a temporary setting of a value for the `IFS` environment variable. By temporary, I mean that the assignment holds just for the rest of that same line only.

Let's break it down: we have the explicit setting of `IFS`, a `read` statement, which is being given the value of the `LS_COLORS` variable as its input, via the rather splendid looking `<<<`.

---

I managed to get this post finished while stuck on the ICE 1011 from Düsseldorf to Frankfurt which has been stationary for over two and a half hours already (and we're still stationary) due to a serious incident further down the line.

[part-1]: https://qmacro.org/autodidactics/2021/09/03/exploring-fff-part-1-main/
[shell-parameter-expansion]: https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html
[conditional-expression]: https://qmacro.org/autodidactics/2021/09/03/exploring-fff-part-1-main/#conditional-expression
[absg]: https://tldp.org/LDP/abs/html/index.html
[bash-hackers-wiki]: https://wiki.bash-hackers.org/syntax/arrays
[understanding-declare]: https://qmacro.org/autodidactics/2020/10/08/understanding-declare/
[conditional-constructs]: https://www.gnu.org/s/bash/manual/html_node/Conditional-Constructs.html
