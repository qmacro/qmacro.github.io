---
layout: post
title: FOFP 1.4 A different approach with map
tags:
  - language-ramblings
---
Part of the [Fundamentals of Functional Programming](/2016/05/03/fofp) document.

Prev: [FOFP 1.3 Some basic list processing](/2016/05/03/fofp-1-3-some-basic-list-processing)

In our second attempt at basic list processing, we used the Array object's `push` function. There are other functions that operate on Array objects like our `nums` list. JavaScript has a set of functions that are often talked about together, and which take us into the realms of functional programming.

## Higher-order functions

These functions are `map`, `filter` and `reduce`.

They're known as "higher-order functions", because they take functions as arguments - elevating functions to being first-class, as we discussed earlier.

Let's start with `map`, and see how we might improve upon our earlier attempts. The `map` function operates on an Array, and takes a function. It iterates over the elements of the Array, and for each of those elements, it calls the supplied function, passing the element. It builds a new Array, with the results of these calls, leaving the original Array unchanged.

Think of it as "mapping" the function over the elements of the list.

## Using map
Here's an example:

```javascript
squares = nums.map(function(x) {
  return x * x;
});
// [1, 4, 9, 16, 25]
```

That's rather neat! Much less mechanical, and no helper variables in sight. And we can re-run this as many times as we like, with no fear of `nums` being mutated, or data "growing" inside `squares`.

Let's have a look at the argument passed to `map`, inside this bit:

```javascript
nums.map(...);
```

It's a function. An anonymous function, created in-line within that call:

```javascript
function(x) {
  return x * x;
}
```

This is a common pattern. You could also define a named function, and then use that named function, like this:

```javascript
function square(x) {
  return x * x;
}

nums.map(square)
// [1, 4, 9, 16, 25]
```

So we have `map`, a higher-order function, treating functions like our anonymous one (and its equivalent named function `square`) as first-class objects[^1].

## Function chaining

You may be familiar with the Unix approach of small programs each focusing on doing one task, and being joined together in a data processing pipeline. If you are, you might see the beginnings of a similar possibility here.

Notice that `map` just produces a new Array, for you to look at, catch and store in a variable, or even allow to fall to the floor and disappear. So we could just as easily feed the output of that `map` into the input of another function that worked on Arrays - perhaps one of `map`'s siblings `filter` or `reduce`. We'll take a look at that later.

Next: [FOFP 1.5 Creating functions](/2016/05/03/fofp-1-5-creating-functions)



[^1]: This is "objects" with no object-oriented nuances. Simply "things".
