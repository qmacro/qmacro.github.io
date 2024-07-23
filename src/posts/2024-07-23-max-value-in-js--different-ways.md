---
layout: post
title: Max value in JS - different ways
date: 2024-07-23
tags:
  - javascript
  - developerchallenge
---
This month I'm running the Developer Challenge, which is on [Reverse APIs](https://community.sap.com/t5/application-development-blog-posts/july-developer-challenge-quot-reverse-apis-quot/ba-p/13749653). One of the 12 tasks is [Task 6 - API endpoint with payload required](https://community.sap.com/t5/application-development-discussions/task-6-api-endpoint-with-payload-required-july-developer-challenge-quot/m-p/13765529) where the participants must create a "REST" style API endpoint.

This is in the context of an unbound action (in CAP, based on OData concepts) which means data is to be passed in the payload of an HTTP POST request, and arguably this was the more important part of the task. What the endpoint had to return was secondary and was not to divert effort away from the main part.

But I wanted to make it somewhat interesting, so I came up with the simple requirement of the data needing to be an array of numbers, and the return value to be the highest number in that array.

## Determining the highest value in an array of numbers

There are many ways of approaching the implementation for this, here are a few. Let's assume we have a constant `nums` to which we've assigned an array of numbers, thus:

```javascript
const nums = [1, -6, 82, 14, 100, -91]
```

### By sorting

First, we can sort the array and return the last one. Fairly straightforward, right? Well no, there are two gotchas.

The first is that the standard (and possibly more well-known) [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) **mutates** the array upon which it operates. While JavaScript is a multi-paradigm language, it's arguable that the primary paradigm is functional. And in functional programming, mutating values is a no-no.

Consider:

```javascript
nums.sort()
```

This emits:

```javascript
[ -6, -91, 1, 100, 14, 82 ]
```

It's not sorted as we'd expect - it's sorted the numbers _alphanumerically_. But that's the second gotcha and we'll come to that shortly.

The first gotcha is that it's now also mutated the contents of the original array. Ugh! The array values are now in the order we see here.

Luckily, we now also have [Array.prototype.toSorted](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted) which is a fairly recent addition to the language (first available with Node.js version 20, for example). This is a much more well-behaved function and does not mutate the array.

Unfortunately, it still exhibits the second gotcha, which is that numeric values are sorted in the same unexpected way as its badly behaved sibling, i.e. alphanumerically.

But, with both `sort()` and `toSorted()` you can pass a compare function, which it will use to compare values. This is the solution then to the sort-based approach of obtaining the highest number, as we can pass a function that will emit values to `sort()` or `toSorted()` that will bring about a numeric comparison based sort result:

```javascript
nums.toSorted((a, b) => a - b)
```

This produces what we expect:

```javascript
[ -91, -6, 1, 14, 82, 100 ]
```

and then we can take the last one.

But then even that's a bit cumbersome, as we can't index with `[-1]` to get the last one, as we can in other languages. We can get the positive index of the last element of an array `a` by offsetting the length by one, but we need to reify the array to do that, i.e. create an intermediate value (here, in `sorted`):

```javascript
const sorted = nums.toSorted((a, b) => a - b)
sorted[sorted.length - 1] // -> 100
```

To avoid that, we could simply reverse the array's values and take the first one instead, which is easier and doesn't require knowing the array's length, and therefore doesn't require creating an intermediate array (`sorted`, in the previous example):

```javascript
nums.toSorted((a, b) => a - b).reverse()[0] // -> 100
```

But it's still looking a bit "busy".

### Using reduce

It's no secret that [one of my favourite functions is reduce](https://www.google.com/search?q=site%3Aqmacro.org+reduce). It's such a powerful and fundamental function and has a beauty all of its own. And there's [a reduce function available on the Array prototype in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).

The function operates on an array, and it's simple to address the requirement with it. Here's how:

```javascript
nums.reduce((a, x) => x > a ? x : a, 0) // -> 100
```

To read this, notice that `reduce` itself has two parameters:

* a reducer function (`(a, x) => x > a ? x : a`)
* a starting value (`0`)

As you can see, the reducer function itself takes two parameters - an "accumulator" and a current value. When you call `reduce` on an array, it iterates over each value in the array, calling the reducer function for each one, supplying the accumulator (`a`) and the current value (`x`), executes the function body, and whatever value is produced becomes the accumulator for the next call. And the starting value (`0`) is what's used as the accumulator value for the very first call.

For those curious about the actual function body here, it's just the [ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator) that will emit the higher of `a` and `x`.

And of course, it goes without saying that `reduce` is also well behaved, i.e. it does not mutate the array upon which it operates.

### Using Math.max

There's also the static method `Math.max` which will do what we want. Well, almost. It doesn't operate on an array, it expects the numbers to be passed via separate parameters. Let's see - if we try to pass our `nums` array, we get `NaN`:

```javascript
Math.max(nums) // -> NaN
```

Why? Because this is what it returns "if any of the parameters is or is converted into NaN". And an array, when converted to a number, becomes `NaN`:

```javascript
Number(nums) // -> NaN
```

So we would have to pass the values in the array separately, like this:

```javascript
Math.max(1, -6, 82, 14, 100, -91) // -> 100
```

Oh dear.

Luckily we have the [rest parameters syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) which is primarily to allow the representation of variadic functions. But it's super useful generally for "exploding" an array into individual values that can then be passed to a function that expects discrete parameters.

We can see the rest parameter syntax, which is `...`, here:

```javascript
console.log(nums) // -> [ 1, -6, 82, 14, 100, -91 ]
```

```javascript
console.log(...nums) // -> 1 -6 82 14 100 -91
```

Spot the difference? In the second example where the rest parameters syntax is used, `console.log` emits multiple individual values (as that's what it received).

So we can use this syntax to pass the `nums` array to `Math.max` thus:

```javascript
Math.max(...nums) // -> 100
```

This is arguably the nicest solution, but I personally still prefer the `reduce` based approach.

What's yours? 









