---
layout: post
title: FOFP 1.5 Creating functions
tags:
  - language-ramblings
---
Part of the [Fundamentals of Functional Programming](/2016/05/03/fofp) document.

Prev: [FOFP 1.4 A different approach with map](/2016/05/03/fofp-1-4-a-different-approach-with-map)

In our previous example, we defined a helper function `square` and used it like this:

```javascript
function square(x) {
  return x * x;
}

nums.map(square)
// [1, 4, 9, 16, 25]
```

## Helper functions

Let's go one step further and write something that will produce helper functions for us. We'll move away from squaring numbers, but stay on the simple theme of increasing integers.

Consider this:

```javascript
function times(n) {
  return function(x) {
    return x * n;
  }
}
```

What's going on? We have a function, which is returning a function. Yes, it's that higher-order nature again. Here we're defining a function that takes a multiple `n`. The scope defined by that function's block (the outermost `{...}`) closes over the value passed for `n`, creating a so-called "closure", with the value forged into the inner function that's returned.

The inner function also expects a value `x` that will be multiplied by that value of `n`.

Let's have a look at how we might use that:

```javascript
var double = times(2);
var triple = times(3);
```

So take `triple`. What is it that we have, as a result of calling `times(3)`? Well, we have a function expecting an argument:

```javascript
triple(6)
// 18
```

So really, with `times`, we have a function, that takes a value, and produces a function, that takes a value, that produces a value. If you're familiar with type signatures at all, for example from Haskell, you'd represent this like so:

```
f :: a -> (a -> a)
```

or simply:

```
f :: a -> a -> a
```

## Partial application

You could even use `times` like this:

```javascript
times(3)(4)
// 12
```

In some ways, our simple `times` function embodies some of the essence of partial application [4.12.1.4]. Calling `times` with a single argument:

```javascript
times(3)
```

is a partial application, and results in a function which is waiting for the second argument:

```
<function-produced-by-times(3)>(4)
```

## Using helpers

Now we have everything we need to use `map` to process our list, with a helper function:


```javascript
nums.map(times(2))
// [2, 4, 8, 8, 10]
```

Neat!

Next: [FOFP 2.1 A look at filter](/2016/05/04/fofp-2-1-a-look-at-filter)
