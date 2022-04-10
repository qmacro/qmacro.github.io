---
layout: post
title: fzf - the basics part 2 - search results
tags:
  - autodidactics
  - fzf
  - tools
---

_Here’s more of what I learned from reading the first part of the fzf README and paying attention. Now I have a better setup and understanding of the basics and how to control the appearance, it's time to turn my attention to setting some defaults to control what I get in my search results._

In [fzf - the basics part 1 - layout](https://qmacro.org/autodidactics/2021/02/02/fzf-the-basics-1-layout/) I shared what I learned about controlling `fzf`'s layout. In the examples I showed, based on directories and files in the [SAP TechEd 2020 Developer Keynote repository](https://github.com/SAP-samples/teched2020-developer-keynote) (which I'll use again in this post), `fzf` presented a total of over 17000 items from which to make my choice.

That's a lot, and far more than I want to consider wading through.

In a pipeline context, `fzf` will present choices given to it in that pipeline, i.e. via STDIN, like this:

```shell
; printf "one\ntwo\nthree" | fzf --layout=reverse --height=40%
>
  3/3
> one
  two
  three
```

> Interestingly, to copy/paste this example from my terminal, I had to (discover and) use the `--no-mouse` option from the Interface category so that the mouse was free to use and not locked to `fzf` during that moment.

But I want to think about using `fzf` in a pipeline at another time; right now I'm just digging into options where `fzf` is used without receiving anything on STDIN.

<a name="default-command"></a>
**Default command**

So what does `fzf` do if it's not fed anything to display via STDIN? Well, the README states that unless otherwise directed, `fzf` uses the `find` command to build the list of items. The actual sentence in the [Usage](https://github.com/junegunn/fzf#usage) section reads as follows:

_"Without STDIN pipe, fzf will use find command to fetch the list of files excluding hidden ones."_

At first, I stopped reading after "fzf will use find command to fetch the list of files", and missed the "excluding hidden ones".

<a name="basic-uses-of-find"></a>
**Basic uses of `find`**

That careless omission did cause me a pleasant coffee length digression into the nuances of basic uses of the `find` command. I created a set of test files and directories like this, some hidden, some not, as you can see:

```shell
.
├── Fruit
│   ├── apple
│   ├── banana
│   ├── cherry
│   └── .damson
├── .Trees
│   ├── ash
│   └── birch
├── aardvark
├── badger
└── .cow
```

If pressed, I'd say that I'd naturally use the following incantation as a basic way to find files and directories: `find . -type f`. The results are interesting.

> In all the following examples, I'm in the directory denoted by `.` at the top of the tree as shown above. The `;` is my simple prompt (inspired by [Kate](https://twitter.com/thingskatedid)), with my directory location shown in a line above that (`# /tmp/testdir`).

```shell
# /tmp/testdir
; find . -type f
./Fruit/apple
./Fruit/cherry
./Fruit/.damson
./Fruit/banana
./.cow
./aardvark
./.Trees/birch
./.Trees/ash
./badger
# /tmp/testdir
;
```

(9 entries)

I'd always considered that the "default" behaviour, but on reflection, it's arguably not default, as I'm using something specific (`.`) as the first argument to `find`, whereas I could just as easily have used `*`, thus:

```shell
# /tmp/testdir
; find * -type f
Fruit/apple
Fruit/cherry
Fruit/.damson
Fruit/banana
aardvark
badger
# /tmp/testdir
;
```

(6 entries)

That's quite a difference! The Stack Overflow entry [Difference between find . and find * in unix](https://stackoverflow.com/questions/46578534/difference-between-find-and-find-in-unix) confirms that difference.

- passing `.` results in everything in `.` being found, including the hidden file `.cow` and the hidden directory (and its contents) `.Trees/`
- passing `*` results in only the "visible" content in `.` being returned; note that this visibility difference only applies to the starting directory in question - as `Fruit/.damson` was reported even though `.cow` and `.Trees/` weren't

So I wonder if either of these two incantations are what `fzf` uses by default. Let's see what `fzf` gives, in this same starting directory:

```shell
# /tmp/testdir
; fzf --height=40% --reverse
>
  5/5
> Fruit/apple
  Fruit/cherry
  Fruit/banana
  aardvark
  badger
```

(5 entries)

Nope!

Of course, there's that "excluding hidden ones" phrase from the README to which I must now pay attention. What I need is to tell `find` explicitly to exclude hidden files and directories. This will do the trick:

```shell
# /tmp/testdir
; find . -type f -not -path '*/\.*'
./Fruit/apple
./Fruit/cherry
./Fruit/banana
./aardvark
./badger
# /tmp/testdir
;
```

(5 entries)

That's more like it! In fact, because we're explicitly excluding content based on a pattern, the same results are forthcoming whether we use a `.` or `*` as the first argument to `find`. Here's what we get with a `*`:

```shell
# /tmp/testdir
; find * -type f -not -path '*/\.*'
Fruit/apple
Fruit/cherry
Fruit/banana
aardvark
badger
# /tmp/testdir
;
```

(5 entries)

OK, there is a subtle difference, in that in this latter case, the `./` prefix is not included in the output of each entry. This is closest to what we see with `fzf` too.

<a name="FZF_DEFAULT_COMMAND"></a>
**FZF_DEFAULT_COMMAND**

So if I wanted `fzf` to actually show me hidden files, how would I do that? Well of course one way would be to run the appropriate `find` command and then pipe the output into `fzf`, like this:

```shell
# /tmp/testdir
; find . -type f  | fzf --height=40% --reverse
>
  9/9
> ./Fruit/apple
  ./Fruit/cherry
  ./Fruit/.damson
  ./Fruit/banana
  ./.cow
  ./aardvark
  ./.Trees/birch
  ./.Trees/ash
  ./badger
```

But I want to leave the pipeline approach until another time. Can I influence `fzf`'s search behaviour when, as the README puts it, "input is [the] tty"?

The answer is yes and is in the form of the environment variable `FZF_DEFAULT_COMMAND`. If set, `fzf` will use its value as the command to execute to find the files to display. So instead of using the pipeline above, I could do this:

```shell
# /tmp/testdir
; export FZF_DEFAULT_COMMAND='find . -type f'
# /tmp/testdir
; fzf --height=40% --reverse
>
  9/9
> ./Fruit/apple
  ./Fruit/cherry
  ./Fruit/.damson
  ./Fruit/banana
  ./.cow
  ./aardvark
  ./.Trees/birch
  ./.Trees/ash
  ./badger
```

Nice - now `fzf` shows me hidden files.

<a name="alternative-commands"></a>
**Alternative commands**

If we can modify what `fzf` uses to find files, we can go further, as the README suggests, and use another utility entirely, as described in the README's [Tips](https://github.com/junegunn/fzf#tips) section (and hinted at also in the [Environment variables](https://github.com/junegunn/fzf#environment-variables) section).

I've installed the search utility [ripgrep](https://github.com/BurntSushi/ripgrep), known as `rg`, as it works for me in a more natural [DWIM](https://en.wikipedia.org/wiki/DWIM) (Do What I Mean) mode.

Let's see what `rg` will do for us with the same content. It is as much like `grep` than `find` and so we need to tell it to search at the file level, with `--files`, for the purposes of this exploration:

```shell
# /tmp/testdir
; rg --files
badger
aardvark
Fruit/banana
Fruit/cherry
Fruit/apple
# /tmp/testdir
;
```

(5 entries)

`rg` won't consider hidden files and directories unless told to explicitly with `--hidden`:

```
# /tmp/testdir
; rg --files --hidden
badger
.Trees/ash
.Trees/birch
aardvark
.cow
Fruit/banana
Fruit/.damson
Fruit/cherry
Fruit/apple
# /tmp/testdir
;
```

(9 entries)

At this level, `rg` delivers results similar to what we already get with `find`.

<a name="respecting-.gitignore"></a>
**Respecting .gitignore**

Where `rg` comes into its own, DWIM-like, is when the search in question is within a git repository. In that case, it will respect what you have in your [`.gitignore`](https://git-scm.com/docs/gitignore) file.

I was curious to see this in action in the context of the simple set of files above. I added a `.gitignore` file in `/tmp/testdir` containing a single entry (`Fruit`) and then ran both `find . -type f -not -path '*/\.*'` and `rg --files`:

```shell
# /tmp/testdir
; cat .gitignore
Fruit
# /tmp/testdir
; find . -type f -not -path '*/\.*'
./Fruit/apple
./Fruit/cherry
./Fruit/banana
./aardvark
./badger
# /tmp/testdir
; rg --files
badger
aardvark
Fruit/banana
Fruit/cherry
Fruit/apple
# /tmp/testdir
;
```

Hmm, so what's going on here? They both produce the same list of files, despite the presence of the `.gitignore` file and its contents.

Turns out that it will only respect `.gitignore` in the context of an actual git repository, which makes sense. So a quick `git init` in the directory later, and we now see a different result for `rg --files`:

```shell
# /tmp/testdir
; git init
Initialized empty Git repository in /private/tmp/testdir/.git/
# /tmp/testdir (master #%)
; rg --files
badger
aardvark
# /tmp/testdir (master #%)
;
```

That's more like it - the `Fruit/` directory and its contents are ignored.

<a name="using-rg-for-real"></a>
**Using rg for real**

Moving back to the [repository](https://github.com/SAP-samples/teched2020-developer-keynote) content that I have been using to explore `fzf` in more depth (especially in [fzf - the basics part 1 - layout](https://qmacro.org/autodidactics/2021/02/02/fzf-the-basics-1-layout/)), let's see what effect `rg`'s respect for `.gitignore` has on the results in this more realistic scenario.

First, what does the incantation of `find` that most closely resembles `fzf`'s default behaviour give us from the top level of that repository?

```shell
# /tmp/teched2020-developer-keynote (main *=)
; find . -type f -not -path '*/\.*'  | wc -l
   17688
# /tmp/teched2020-developer-keynote (main *=)
;
```

OK, so that's what we got in the [previous post](https://qmacro.org/autodidactics/2021/02/02/fzf-the-basics-1-layout/). The repository has a `.gitignore` file:

```shell
# /tmp/teched2020-developer-keynote (main *=)
; cat .gitignore
node_modules/
*.swp
sk*.json
default-env.json
.DS_Store
dashboard.zip
mta_archives/
ui/resources
*.db-journal
*.token
kubeconfig.*
# /tmp/teched2020-developer-keynote (main *=)
;
```

So let's see what `rg` gives us:

```shell
# /tmp/teched2020-developer-keynote (main *=)
; rg --files | wc -l
     163
# /tmp/teched2020-developer-keynote (main *=)
;
```

That is certainly a huge difference, mostly a result of ignoring a load of stuff - not least in the various `node_modules/` directories within the repository.

<a name="showing-hidden-files"></a>
**Showing hidden files**

Now that the list of choices is more manageable, I can now start to think about what it actually contains, and what it doesn't contain. There are hidden files in the repository that I actually want to be able to select. `fzf`'s default behaviour is preventing that from happening, but it's only now that my head is clear enough to address this (looking through a list of 17000+ files fogged my thinking).

So I remember I can use the `--hidden` option with `rg`; let's try that:

```shell
# /tmp/teched2020-developer-keynote (main *=)
; rg --files --hidden | wc -l
     209
# /tmp/teched2020-developer-keynote (main *=)
;
```

OK, so a few more than the 163 that `rg --files` returned. Good stuff. But what are those extra hidden files? Let's take a look, using a regular expression to reduce the output to entries where there's a `.` either at the start of the line or following a `/`:

```shell
# /tmp/teched2020-developer-keynote (main *=)
; rg --files --hidden | grep -E '(^|\/)\.' | sort
.abapgit.xml
.git/HEAD
.git/config
.git/description
.git/hooks/applypatch-msg.sample
.git/hooks/commit-msg.sample
.git/hooks/fsmonitor-watchman.sample
.git/hooks/post-update.sample
.git/hooks/pre-applypatch.sample
.git/hooks/pre-commit.sample
.git/hooks/pre-merge-commit.sample
.git/hooks/pre-push.sample
.git/hooks/pre-rebase.sample
.git/hooks/pre-receive.sample
.git/hooks/prepare-commit-msg.sample
.git/hooks/update.sample
.git/index
.git/info/exclude
.git/logs/HEAD
.git/logs/refs/heads/main
.git/logs/refs/remotes/origin/HEAD
.git/objects/pack/pack-8933b87ef40a05f8e4974179d6b7288c4cbb0a39.idx
.git/objects/pack/pack-8933b87ef40a05f8e4974179d6b7288c4cbb0a39.pack
.git/packed-refs
.git/refs/heads/main
.git/refs/remotes/origin/HEAD
.github/workflows/image-build-and-publish.yml
.github/workflows/out-of-office.yml
.gitignore
.reuse/dep5
cap/brain/.cdsrc.json
cap/brain/.dockerignore
cap/brain/.eslintrc
cap/brain/.gitignore
cap/brain/.prettierignore
cap/brain/.prettierrc.json
cap/brain/.vscode/extensions.json
cap/brain/.vscode/launch.json
cap/brain/.vscode/settings.json
cap/brain/.vscode/tasks.json
converter/.dockerignore
rapreceiver/.gitignore
s4hana/sandbox/.gitignore
s4hana/sandbox/router/.dockerignore
s4hana/sandbox/router/.prettierignore
s4hana/sandbox/router/.prettierrc.json
# /tmp/teched2020-developer-keynote (main *=)
;
```

That's nice - I can see important hidden files such as `.abapgit.xml`, `cap/brain/.dockerignore` and `github/workflows/image-build-and-publish.yml` now.

However, the presence of all those files in the `.git/` directory are clouding that overview. Let's get rid of those with `rg`'s `--glob` option, with which one can include, or (using a `!` to negate things) exclude results:

```shell
# /tmp/teched2020-developer-keynote (main *=)
; rg --files --hidden --glob '!.git/' | wc -l
     184
# /tmp/teched2020-developer-keynote (main *=)
;
```

Let's see what makes up the list of hidden files now:

```shell
# /tmp/teched2020-developer-keynote (main *=)
; rg --files --hidden --glob '!.git/' | grep -E '(^|\/)\.' | sort
.abapgit.xml
.github/workflows/image-build-and-publish.yml
.github/workflows/out-of-office.yml
.gitignore
.reuse/dep5
cap/brain/.cdsrc.json
cap/brain/.dockerignore
cap/brain/.eslintrc
cap/brain/.gitignore
cap/brain/.prettierignore
cap/brain/.prettierrc.json
cap/brain/.vscode/extensions.json
cap/brain/.vscode/launch.json
cap/brain/.vscode/settings.json
cap/brain/.vscode/tasks.json
converter/.dockerignore
rapreceiver/.gitignore
s4hana/sandbox/.gitignore
s4hana/sandbox/router/.dockerignore
s4hana/sandbox/router/.prettierignore
s4hana/sandbox/router/.prettierrc.json
# /tmp/teched2020-developer-keynote (main *=)
;
```

Now we're talking! That looks like the level of results that will work for me generally. So I can now [add that glob exclusion](https://github.com/qmacro/dotfiles/commit/29368542f9249de85ada759591cf87b52c2b3c0e?branch=29368542f9249de85ada759591cf87b52c2b3c0e&diff=unified) to the value for `FZF_DEFAULT_COMMAND` like this:

```shell
# /tmp/teched2020-developer-keynote (main *=)
; export FZF_DEFAULT_COMMAND='rg --files --hidden --glob '"'"'!.git/'"'"
# /tmp/teched2020-developer-keynote (main *=)
;
```

> The `"'"` sequences are to supply single quotes in an otherwise single-quoted string.

This can be seen in [my Bash configuration script for `fzf`](https://github.com/qmacro/dotfiles/blob/master/bashrc.d/82-fzf.sh).

<a name="the-final-result"></a>
**The final result**

Now I've customised exactly which type of entries I want to be included (and excluded) in the search results that `fzf` presents to me in a tty context, I'm happy:

```shell
# /tmp/teched2020-developer-keynote (main *=)
; fzf --height=40% --reverse
>
  184/184
> enabling-workflows.md
  message-bus-settings.sh
  .gitignore
  README.md
  quickstart.md
  .reuse/dep5
  images/whiteboard.jpg
  images/enable-kyma.png
  images/enabling-workflows.png
  images/split-terminals.png
  kymaruntime/README.md
  mock-converter/index.js
  storyboard.md
  .abapgit.xml
  mock-converter/package.json
  abap/README.md
```

Far easier to deal with (than the 17000+ files previously) but nothing important omitted.

Turns out that `FZF_DEFAULT_COMMAND` is useful, and it's also not the only environment variable that `fzf` sports. I'll look into others in the next post.
