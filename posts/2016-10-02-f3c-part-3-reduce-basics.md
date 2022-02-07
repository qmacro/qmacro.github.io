---
layout: post
title: F3C Part 3 - Reduce basics
tags:
  - language-ramblings
---
FunFunFunction Video: [Reduce basics - Part 4 of Functional Programming in JavaScript](https://www.youtube.com/watch?v=Wl98eZpkp-c&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=3)

(This post is part of the [F3C](/f3c/) series)

Higher-order functions `map`, `filter` and `reject` perform list transformations, where each time, the end result is still a list. `find` is a related function which is designed to return just a single element. 

`reduce` is a related higher order function, but the shape of the end result is whatever you want it to be. It's like the swiss army chainsaw of list transformations. Unlike the functions above, `reduce` takes *two* parameters. As well as the callback function, it takes a starting value, which - after the accumulation that takes place when processing each of the list's elements - becomes the end result. 

The starting value can be any "shape" - a scalar, an array, or an object. 

This means that if `map`, `filter`, `reject` or similar functions don't do what you need, you can write your own using `reduce`. A common fun exercise is implementing those functions with `reduce`, too. 

Let's reimplement `reject`, this time using `reduce`:

```javascript
Array.prototype.reject = function(pred) {
  return this.reduce((l, x) => {
    if (! pred(x)) l.push(x);
    return l;
  }, []);
}
```

The function implementation transforms the given array (in `this`) with `reduce`. Here the starting value is `[]`, an empty array, and we use similar logic with the passed-in predicate function to determine whether each element should be accumulated into the starting value or not.

