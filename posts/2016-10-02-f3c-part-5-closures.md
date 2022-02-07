---
layout: post
title: F3C Part 5 - Closures
tags:
  - language-ramblings
---
FunFunFunction Video: [Closures - Part 5 of Functional Programming in JavaScript](https://www.youtube.com/watch?v=CQqwU2Ixu-U&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=5)

(This post is part of the [F3C](/f3c/) series)

Functions have a signature (the parameters) and the body. The body is defined in a block, traditionally in curly braces[^n]. This block defines a scope, directly relating to the body of the function. In other words, it's function scope. 

JavaScript has support for closures. This is a powerful feature, which gives function bodies dynamic access to data in the surrounding scope. Or scopes. I had been wondering about whether this access extended to the next outer level only, but in fact, it's access all the way down (or up?). Consider this:

```javascript
var a = "Something"
function deep() {
  var b = "The Universe"
  function deeper() {
    var c = "Everything"
    function deepest() {
      console.log(a + ", " + b + " and " + c)
    }
    deepest()
  }
  deeper()
}
a = "Life"
deep()
// => Life, The Universe and Everything
```

The `deepest` function has access to not only `c`, but `b` and `a` also.

Using closures is such a natural part of JavaScript, if you're not too familiar, you just have to practice and get them under your skin. In languages that don't support closures, you can end up with a lot of explicit signatures and passing of data to callbacks, which can get messy and over-busy. So closures are also good for reducing the footprint of your code, which we know already means fewer chances for bugs. 


[^n]: Although with single-expression bodies introduced with the ES6 fat arrow, we don't need the curly braces.
 


