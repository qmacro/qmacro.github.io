---
layout: post
title: F3C Part 4 - Reduce advanced
tags:
  - language-ramblings
---
FunFunFunction Video: [Reduce advanced - Part 4 of Functional Programming in JavaScript](https://www.youtube.com/watch?v=1DMolJ2FrNY&index=4&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)

(This post is part of the [F3C](/f3c/) series)

Reduce is powerful, much more than its siblings. You can use it not only to sum values (the classic "hello world" example for `reduce`), but also to build up a complex end result that may look nothing like what you started with, i.e. the list you are calling `reduce` upon. It's a mistake to think of `reduce` in terms of what that word means in English; you're not necessarily making something smaller than what you started with, you can make pretty much anything, of any size[^n].

As well as function composition (slotting functions into each other), another common style in functional programming is function chaining. The binding together of small functions that operate on data one after the other[^n].

The example that MPJ uses in this video is a good illustration of chaining. Aside from the call to `console.log`, the entire program is a single statement - an assignment of a value to the `output` variable:

```javascript
var output = fs.readFileSync('data.txt', 'utf8')
  .trim()
  .split('\n')
  .map(line => line.split('\t'))
  .reduce((customers, line) => {
    ...
  }, {})
```

What MPJ doesn't say explicitly, but is one of the reasons why this approach is so powerful and simple, is that each of these functions take input, and produce *new* output. There's no mutation of state. This means that there is less to go wrong. Further, apart from `trim`, all functions produce or operate on lists:

`split` operates on a string and produces a list
`map` operates on a list and produces another list
`reduce` operates on a list and produces ... well, whatever you want

Notice that this part: `map(line => line.split('\t'))` actually produces a list ... of lists. 

[^n]: It may help to think of reduce by its other common name, in other languages: "fold", a name which signifies the action of executing the callback function on each element in turn.

[^n]: This reminds me of the Unix philosophy of small programs doing one thing well, connected and passing data via a series of pipes.

