---
layout: post
title: F3C Part 1 - Higher-order functions
tags:
  - language-ramblings
---
FunFunFunction Video: [Higher Order Functions - Part 1 of Functional Programming in JavaScript](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=1)

(This post is part of the [F3C](/f3c/) series)

Functional programming makes you a better programmer because you're going to be writing less code. Less code because you're able to reuse more, and also because you're not having to write 'mechanics'. You're writing more *what* you want, rather than *how* to get it. There are fewer bugs too, not only simply because there's less code, but that code is easier to reason about.

Functions are values. They can be passed around in variables and "slotted into each other". Functions that take functions as arguments are called higher-order functions. Functions that produce other functions as results are also higher-order functions. Composability is an aspect of functional programming, in that small, simple functions can be combined. A small enough function with no cognitive or contextual baggage is more likely to be reusable, too.

The filter function (`Array.prototype.filter`) is shown as an example of a higher order function. Its use, to filter an array of animals, is compared to the imperative approach to do the same thing. This latter approach is more difficult to reason about, because there's more code, and more going on. What's not said explicitly is that in the imperative version, there are more variables whose values change. This mutable state in general brings about risks of bugs, and makes code harder to reason about and also to debug.

MPJ mentions the function `reject` which he mistakenly attributes as a standard function on `Array`s. There isn't one (you can employ a functional programming library such as lodash or underscore to get it), but I thought I'd have a go at writing one.

Given the `animals` array in the video, here's how one might go about adding a `reject` function, and using it:

```javascript
Array.prototype.reject = function(pred) {
  return this.filter(function(x) {
    return ! pred(x)
  })
}
```

`reject` is a (higher-order) function that take a function as its argument. I'm using the parameter `pred` here for this; the word "predicate" is often used to describe this sort of function (one that returns a boolean, often used in this sort of context). The array upon which `reject` is made to operate (represented by `this`) is filtered, and the predicate function is used to determine whether each array element remains or not. Note the negation (`!`) as here we want to throw away, rather than keep elements that pass the predicate test.
