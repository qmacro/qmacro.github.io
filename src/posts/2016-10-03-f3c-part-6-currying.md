---
layout: post
title: F3C Part 6 - Currying
tags:
  - language-ramblings
---
FunFunFunction Video: [Currying - Part 6 of Functional Programming in JavaScript](https://www.youtube.com/watch?v=iZLP4qOwY8I&index=6&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)

(This post is part of the [F3C](/f3c/) series)

The "what" part of currying is quite straightforward. The "why" takes a little more time to understand, but once you do, it's a big "aha" moment.

Currying is the process of taking a function that expects multiple arguments, and turning that into a sequence of functions, each of which takes only a single argument and produces a function that is expecting the next argument. This sequence ends with a function that takes the final argument and produces the value that the original function was designed to emit.

It's not immediately apparent why you'd want to do this. This particular aspect of functional programming has probably remained more of a mystery in the JavaScript world mostly because the facility is simply not available in the core language implementation, and therefore folks aren't as readily versed in its usage.

But if you've started to embrace functional programming in JavaScript and have already enjoyed creating "helper" functions that you can then use (in a composition sense) in other higher-order functions, the reason why currying is useful is clearer.

Useful is a plain word. In MPJ's example, using the `curry` facility provided by the [Lodash](https://lodash.com/) library to enhance the way `filter` is employed, is actually quite beautiful. His exclamation "wow" (I heard it in lower case) should perhaps have been more "WOW".

Here's the relevant section of the example code:

```javascript
let hasElement =
  _.curry((element, obj) => obj.element === element)

let lightningDragons =
  dragons.filter(hasElement('lightning'))
```

`hasElement` is the helper function that is used to dynamically filter the data we're looking for. It has a common pattern ("does a particular property have a particular value?"). But the original (pre-currying) invocation was a little cumbersome:

```javascript
dragons.filter(x => hasElement('lightning', x))
```

With the new ES6 syntax we're already reducing the amount of code using the fat arrow syntax. But with currying, we can reduce it even further, not with syntax, but by embracing currying and [partial application](https://en.wikipedia.org/wiki/Partial_application). Moreover, we get even closer to saying what we want, rather than how to get it.

One thing that occurred to me, that MPJ didn't mention explicitly (perhaps it was too obvious), is the order of the parameters in the `hasElement` function. They're deliberately set that way round, so that currying will work well for us. If you stare long enough at the example code, you'll realise that this is because of what's going on:

- calling `hasElement('lightning')`, with only a value for the `element` parameter, returns a function
- this intermediate function expects a further single argument - an object, for the `obj` parameter
- what serendipity! the `filter` function is going to do exactly this - call the intermediate function, passing each object in the `dragons` array

For more on the order of parameters, and a generally very entertaining talk, I recommend Brian Lonsdorf's "[Hey Underscore, You're Doing It Wrong!](https://www.youtube.com/watch?v=m3svKOdZijA)".
