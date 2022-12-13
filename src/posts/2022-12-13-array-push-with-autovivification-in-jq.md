---
layout: post
title: Array push with autovivification in jq
date: 2022-12-13
tags:
  - jq
  - perl
---
I wanted to make a note to self about this. I'm using Advent of Code for an opportunity to practise and learn more about `jq`, and in [Day 7: No Space Left On Device](https://adventofcode.com/2022/day/7) I think I need a way of appending values to arrays, which are themselves values of properties that I create on the fly. This may not turn out to be useful in the end, but I wanted to explore it (I was thinking I could store the list of files in a given directory like this).

The structure I had in mind is this (in pseudo-JSON):

```text
{
  "dirs": {
    "a": [file1, file2, ...],
    "b": [file3, ...]
    ...
  },
  ...
}
```

Thing is, I need to create the contents of the object at `directories` as I go along, i.e. at first, `a` and `b` don't exist. 

The first time I need to create a new entry like this, it needs to be an array, with the entry as the first and only value:

```text
{
  "dirs": {
    "a": [file1]
  },
  ...
}
```

But subsequently I need to just append entries (such as `file2` here) to the existing array:

```text
{
  "dirs": {
    "a": [file1, file2]
  },
  ...
}
```

The concept of autovivification came to mind; I first learned about this word and concept in my Perl days, and it's never left me (in fact a lot of of how I think in terms of complex data structures I learned back then).

Effectively I want to be able to push a new item, but make sure that the array exists first and create it if it doesn't. Investigating this led me to the family of path related functions `path(path_expression)`, `del(path_expression)`, `getpath(PATHS)`, `setpath(PATHS; VALUE)` and `delpaths(PATHS)`. 

Here's what I came up with, as a sort of "autovivification-push" (where the semantics of push are more from JavaScript's [array.prototype.push()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push):

```jq
def apush($pexp;$item):
  setpath($pexp;(getpath($pexp) // []) + [$item])
;
```

Given that, then the following:

```jq
{
  dirs: {
    a: ["file1"]
  }
}
| apush(path(.dirs.a);"file2")
| apush(path(.dirs.b);"file3")
| apush(path(.dirs.b);"file4")
```

produces this:

```json
{
  "dirs": {
    "a": [
      "file1",
      "file2"
    ],
    "b": [
      "file3",
      "file4"
    ]
  }
}
```

The `b` array is effectively autovivified when the first item (`another-file`) needs to be appended.

Like I say, I may go off in another direction for this puzzle, but wanted to make a note of this `apush` idea.
