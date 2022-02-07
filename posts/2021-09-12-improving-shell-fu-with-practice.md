---
layout: post
title: Improving shell fu with practice
tags:
  - autodidactics
  - kitty
  - shell
---

_Practising in the shell helps me improve and exposes me to new knowledge. Here's an example._

At the end of the working day I'm tired, but there's often just enough energy left in my brain to explore new options for some Unix commands, and practise my shell fu. Here's a few trivial things that I just learned, by writing a pipeline to choose and display a new theme for my current terminal of choice, [kitty](https://sw.kovidgoyal.net/kitty/).

There's [a nice selection of themes for kitty](https://github.com/dexpota/kitty-themes); I've installed the contents of the repo in the right place and can select a theme by [adding an include at the bottom of my `kitty.conf` file](https://github.com/qmacro/dotfiles/blob/ba940b5b70b069010e18d22d8d88da01acaf9048/config/kitty/kitty.conf#L1287):

```
include ./theme.conf
```

and then creating `theme.conf` as a symbolic link pointing to the actual theme configuration file (from the repo) that I want to use:

```
lrwxr-xr-x   1 i347491  staff     72 13 Sep 18:07 theme.conf -> kitty-themes/themes/SpaceGray.conf
```

This was achieved with the following:

```bash
cd $DOTFILES/config/kitty/ \
  && find kitty-themes/themes -name '*.conf' \
    | shuf -n 1 \
    | xargs -J % ln -fsv % theme.conf \
    | grep -P -o '\w+(?=\.conf$)'
```

This uses `find` to look for `conf` files in the `kitty-themes/themes/` directory within my dotfiles configuration for `kitty`. The output of such a `find` command looks like this:

```
kitty-themes/themes/SpaceGray_Eighties_Dull.conf
kitty-themes/themes/Monokai.conf
kitty-themes/themes/Floraverse.conf
...
```

I pass this list to `shuf` (short for "shuffle"), which "generates random permutations" and ask it via `-n 1` to only give me one back.

Then of course it would be nice to use `xargs` to pass that single, random theme file name, for example `kitty-themes/themes/SpaceGray.conf`, to the `ln` command to create a symbolic link. The thing is, `xargs` puts what it's given at the end of the list; in other words, if we did this:

```bash
echo kitty-themes/themes/SpaceGray.conf | xargs ln -fsv theme.conf
```

then the `ln` command invoked would be the wrong way round, i.e.:

```bash
ln -fsv theme.conf kitty-themes/themes/SpaceGray.conf
```

instead of

```bash
ln -fsv kitty-themes/themes/SpaceGray.conf theme.conf
```

Luckily `xargs` has the `-J` option which allows us to specify a pattern, and then refer to that pattern to insert the value appropriately, which is what is happening here - the `%` is the pattern and shows where in the `ln` command the value should be put:


```bash
xargs -J % ln -fsv % theme.conf
```

What of the `ln` command itself? Well there's the `-s` option which is the main deal, i.e. we want to create a symbolic link. The `-f` option tells `ln` to not worry about any existing file (i.e. if there's already a `theme.conf`) and to just overwrite it. And the `-v` is a verbose option which outputs what is being done.

This last `-v` option is used so that I can get the name of the randomly selected theme. Without the last part of the pipeline, into `grep`, we'd see something like this, output because of this `-v` option to `ln`:

```
theme.conf -> kitty-themes/themes/SpaceGray.conf
```

So we can then pipe this into `grep` to grab the `SpaceGray` part, invoking the powerful Perl Compatible Regular Expression (PCRE) class of regular expressions (for which I have to use the `-P` option) to be able to use a positive lookahead assertion `(?=\.conf$)` to say _what we're trying to match, `\w+` (a sequence of at least one word character), must be directly followed by `.conf` up against the end of the line (`$`)_.

Such an assertion is not part of the actual match, which means we can then simply use the `-o` option to tell `grep` to output just the match itself, i.e.:

```
SpaceGray
```

I use this technique in [getbtpcli](https://github.com/SAP-samples/sap-tech-bytes/blob/8cbc01e51a8adcc6051fe9c6800c91a4093f1af9/getbtpcli) (see [line 61](https://github.com/SAP-samples/sap-tech-bytes/blob/8cbc01e51a8adcc6051fe9c6800c91a4093f1af9/getbtpcli#L61)) - if you're interested in reading more about this, have a look at the blog post [SAP Tech Bytes: btp CLI - installation](https://blogs.sap.com/2021/09/01/sap-tech-bytes-btp-cli-installation/), and the comments too.

And that's pretty much it. Nothing earth shattering, but certainly a couple of things that I found out (in particular `ln`'s `-v` option and `xargs`'s `-J` option.

Happy learning!
