---
layout: post
title: Array.prototype.reduce and the optional initial value
date: 2025-04-29
tags:
  - javascript
  - fp
  - reduce
  - til
---
*Today I learned about the subtlety of the _optional_ `initialValue` parameter for the `Array` prototype's `reduce` method in JavaScript.*

This is almost too trivial to write about, but I was surprised to discover the behaviour, so perhaps others will be too.

I've recently been [exploring functional programming](https://www.youtube.com/playlist?list=PL6RpkC85SLQB-0sK7KSRwCc2gdtlZDIkL) on our Hands-on SAP Dev show and had highlighted `reduce` both in native Node.js JavaScript and in the [Ramda](https://ramdajs.com) flavour. There are generally three parameters to a `reduce` call:

* the iterator function ("callbackFn")
* an initial value for the accumulator ("initialValue")
* the list of values upon which to iterate ("list")

The way that the [standard JavaScript reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) works, being a method available on the `Array` prototype, is that the "list" is provided not as an argument explicitly, but as the instance of the `Array` on which the `reduce` method is being called; then quite often the "callbackFn" is passed as the first argument, and that's it - no "initialValue":

```javascript
list.reduce(callbackFn)
```

The [Ramda flavour of reduce](https://ramdajs.com/docs/#reduce) is a regular function that expects three parameters, and (even when employing [partial application](https://en.wikipedia.org/wiki/Partial_application)) it's not really possible to omit the "initialValue" here:


```javascript
R.reduce(callbackFn, initialValue, list)
```

With `Array.prototype.reduce`, [the "initialValue" is optional](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#syntax). And all this time I hadn't thought much about what that implied; I think I might have (mistakenly) assumed it will (waves hands in air) choose the appropriate starting value - but investing any amount of thinking effort here reveals that expectation to be nonsensical.

The mechanics of `reduce` are such that each item of the "list" is passed, in turn, to the "callbackFn", along with an accumulator, which starts out being set to the "initialValue". This can be illustrated with the following example:

```javascript
const nums = [1,2,3]
const myadd = (x, y) => { 
  console.log(`${x} + ${y}`)
  return x + y
}
```

Calling `nums.reduce(myadd, 0)`, i.e. supplying an "initialValue", we [see this](https://ramdajs.com/repl/?v=0.30.1#?const%20nums%20%3D%20%5B1%2C2%2C3%5D%0Aconst%20myadd%20%3D%20%28x%2C%20y%29%20%3D%3E%20%7B%20%0A%20%20console.log%28%60%24%7Bx%7D%20%2B%20%24%7By%7D%60%29%0A%20%20return%20x%20%2B%20y%0A%7D%0A%0Anums.reduce%28myadd%2C%200%29):

```log
0 + 1
1 + 2
3 + 3

6
```

So far so good.

But calling `nums.reduce(myadd)` without an "initialValue", we [see this](https://ramdajs.com/repl/?v=0.30.1#?const%20nums%20%3D%20%5B1%2C2%2C3%5D%0Aconst%20myadd%20%3D%20%28x%2C%20y%29%20%3D%3E%20%7B%20%0A%20%20console.log%28%60%24%7Bx%7D%20%2B%20%24%7By%7D%60%29%0A%20%20return%20x%20%2B%20y%0A%7D%0A%0Anums.reduce%28myadd%29):

```log
1 + 2
3 + 3

6
```

One iteration fewer.

In other words, and as [the MDN documentation states](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#initialvalue), relating to the `accumulator` and `currentValue` parameters of the `callbackFn`:

> If `initialValue` is **not** specified, `accumulator` **is initialized to the first value in the array**, and `callbackFn` starts executing with the **second** value in the array as `currentValue`.

(emphasis mine). This makes total sense, and is the most practical approach if `initialValue` is to be optional.

Of course, it goes without saying that this behaviour is only related to the optional nature for `initialValue` in `Array.prototype.reduce`; Ramda's `reduce` cannot exhibit this behaviour as the `initialValue` parameter is not optional, and we can [see that](https://ramdajs.com/repl/?v=0.30.1#?const%20nums%20%3D%20%5B1%2C2%2C3%5D%0Aconst%20myadd%20%3D%20%28x%2C%20y%29%20%3D%3E%20%7B%20%0A%20%20console.log%28%60%24%7Bx%7D%20%2B%20%24%7By%7D%60%29%0A%20%20return%20x%20%2B%20y%0A%7D%0Areduce%28myadd%2C%200%2C%20nums%29):

```javascript
reduce(myadd, 0, nums)
```

emits this:

```log
0 + 1
1 + 2
3 + 3

6
```

That's it! Thanks again to the authors of the excellent MDN documentation.
