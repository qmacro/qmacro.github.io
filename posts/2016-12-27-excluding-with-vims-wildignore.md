---
layout: post
title: Excluding with vim's wildignore
tags:
  - language-ramblings
---
I found it more difficult than usual to get the `wildignore` setting working properly in vim, so I thought I'd document it here.

The `wildignore` setting is used in conjunction with the `path` and other settings such as `wildmenu`, and supposedly can be used to specify filename patterns that should be ignored when searching for files, for example using the `find` command.

I'm running a fairly modern version of vim (7.4) compiled with the `+wildignore` option:

```shell
dj@pipetree ~ $ vim --version | grep wildignore
+cscope          +lispindent      +python3         +wildignore
dj@pipetree ~ $
```

but specifying a pattern such as this:

```vim
set wildignore=node_modules/**
```

or variations thereof, such as

```vim
set wildignore=**/node_modules/**
```

or even

```vim
set wildignore=**node_modules**
```

didn't have the desired effect. I'm wanting to exclude content from that folder (and the subfolders contained there) as they don't form part of the codebase I'm working on in my JavaScript projects.

What works for me is

```vim
set wildignore=/home/dj/**/node_modules/**
```

In other words, an absolute path (I've tried using the tilde too, to no avail).

This is good enough for me, but it does irk me that something that should be so simple ... isn't.
