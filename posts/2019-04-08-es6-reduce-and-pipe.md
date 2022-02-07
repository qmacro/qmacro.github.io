---
layout: post
title: ES6, reduce and pipe
tags:
  - language-ramblings
---
In learning about functional programming, one thing that's worked for me is to take my time, and not rush over fundamental concepts. In fact, like a good beer or whisky, a fundamental concept is something to savour, to enjoy at a leisurely pace.

This weekend I turned to a post that was highlighted originally by [Fred Verheul](https://twitter.com/fredverheul): [Transducers: Efficient Data Processing Pipelines in JavaScript](https://medium.com/javascript-scene/transducers-efficient-data-processing-pipelines-in-javascript-7985330fe73d) by [Eric Elliott](https://twitter.com/_ericelliott). It turns out that this post is part of a series on "Composing Software", so I turned to the first post - [Composing Software: An Introduction](https://medium.com/javascript-scene/composing-software-an-introduction-27b72500d6ea) as I didn't want to miss anything.

Reading at my leisurely pace, mindful of what [Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)) seems to say a lot, which is "... if you stare at this long enough", I didn't get very far into the post before I found something of wonder, and thought I'd share it.

**pipe**

In talking about the basics of composition, specifically of functions, Eric Elliott talks about utilities that make function composition easier. He mentions `pipe` which is [available](https://ramdajs.com/docs/#pipe) in my favourite functional programming library for JavaScript - [Ramda](https://ramdajs.com).

He also provides a simple implementation, that looks like this:

```javascript
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
```

Let's use the rest of the time on this post to stare at this for a few minutes, as there's some goodness to unpack. First though, let's see how `pipe` is used.

Here's a simple example, where we use a predefined function `dbl` that doubles a number, and a lambda (anonymous) function that adds 42 to a number. We use these two functions inside of `pipe`, which transforms the input (5) in a sort of "pipeline process":

```javascript
const dbl = x => x * 2
console.log(
  pipe(
    dbl,
    x => x + 42
  )(5)
)

//=> 52
```

In a recent talk I gave at [SAP Inside Track Frankfurt](https://wiki.scn.sap.com/wiki/display/events/SAP+Inside+Track+Frankfurt+2019%2C+March+30th%2C+%23sitFRA) - "[ES6 JavaScript in the wild](http://sitfra2019.cbasis.com/#3)" - I took the audience through a number of language features introduced with ES6, a version of ECMAScript (JavaScript) introduced in 2015.

![DJ Adams presenting at SAP Inside Track Frankfurt]({{ "/img/2019/03/sitfra-talk.jpg" | url}})
_(Photo [courtesy of Wim Snoep](https://twitter.com/wsnoep/status/1111921184088772608))_

In the definition of `pipe` here we can see a few of them in action. Also, in a couple of the episodes of our "[Hands-on SAP dev with qmacro](https://bit.ly/handsonsapdev)" series, we've seen that the `reduce` function is a fundamental building block, sort of like the hydrogen of the functional universe. For example `map` and `filter` can be built with `reduce`.

So let's have a closer look at the definition, and see what we can see:

```javascript
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
```

**const**

First, we have the [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) declaration, which introduces a constant. My early journey towards functional programming involved starting to think of things that didn't mutate, and declaring values as constants helped me remember that by forcing me to write using values that don't change. In this case it's a function definition, but I use `const` equally to define other types of values.

**rest parameters**

Next, we see the use of the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) syntax (`...`), which is a great way of saying, either in a [destructuring](https://hacks.mozilla.org/2015/05/es6-in-depth-destructuring/) context or in the context of function parameter declarations, "whatever values haven't been assigned to parameters already, capture them all (the rest, essentially) in an array". So in this case, all the function definitions specified as arguments to a call to `pipe` (in this case `dbl` and `x => x + 42`) are captured into the `fns` array.

**fat arrows**

Then we see our friend the [fat arrow](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) (`=>`), used to concisely define functions. The conciseness is underlined here in particular, because here, `pipe` is being declared as a function that takes some parameters (`(...fns)`) **and produces a function** that takes a single parameter (`x`) which produces whatever the `fn.reduce` expression evaluates to (we'll look at that next).

Stare at this definition for a minute, perhaps with a sip of nice coffee, and marvel not only at the concise nature, but also at the power that JavaScript puts in your hands as a programmer, in giving you the ability to treat functions as first class citizens: to _receive_ functions as arguments in function calls, and to _produce_ functions as results of function calls.

Functions that receive and / or produce other functions are called [higher order functions](https://eloquentjavascript.net/05_higher_order.html). This concept is not specific to ES6 nor to JavaScript, but the prevalence of the use of higher order functions has increased in JavaScript with ES6 because the language improvements have made the concept very easy to express.

**reduce**

Let's finish by looking now at the `fns.reduce` expression, noting in passing that another small thing of beauty is the fact that this function that is being produced by the `pipe` function has, as its body, a single expression.

The `reduce` function is called on the array of functions provided in the call to `pipe` (`dbl` and `x => x + 42` in the example shown). The `reduce` function itself takes two parameters - a "reducer" function that is executed for each of the items in the array being reduced over (i.e. for each of the functions), and a starting value.

Here are those two parameters:

```javascript
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
//                                       --------------  -
//                                              ^        ^
//                                              |        |
//                    reducer function ---------+        |
//                      starting value ------------------+
```

The reducer function itself is defined with two parameters: the "accumulator", i.e. the value that has been built up (starting out as the starting value) so far with each reduce iteration, and the "next" item being reduced over (the functions in `fns` in this case) one by one.

The body of the reducer function here is again, a single expression, which calls the function in question (as they are iterated through) on the current value of the accumulator.

Focusing only at the reducer function, here are those two parameters and the single expression:

```javascript
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
//                                        -  -     ----
//                                        ^  ^      ^
//                                        |  |      |
//                   accumulator ---------+  |      |
//                     next item ------------+      |
//         reducer function body -------------------+
```

So with all this in mind, can we imagine how the whole thing works, with the invocation example we saw earlier?

```javascript
const dbl = x => x * 2
console.log(
  pipe(
    dbl,
    x => x + 42
  )(5)
)
```

Let's try.

The call to `pipe` is made specifying two function definitions `dbl` and `x => x + 42`. This produces a function that has captured (closed over - forming a closure) those two function definitions, and is expecting a single value to be received in `x`. Once that value is received (the value is 5 in this case), the function `x => fns.reduce((y, f) => f(y), x)` can be evaluated, which we can visualise like this:

```
Function invocation (y, f) => f(y)        Value

(starting value)                          5
(5, dbl) => dbl(5)                        10
(10, x => x + 42) => (x => x + 42)(10)    52
```

Given that `reduce` sensibly returns the final value (i.e. the result of the final expression in the iteration loop) which is 52, we're good.

I do find it's useful to take one's time staring at stuff until the mist clears. I hope this post helps you when staring at things like this. Happy functional adventuring!
