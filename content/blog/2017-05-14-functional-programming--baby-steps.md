---
title: Functional programming - baby steps
date: 2017-05-14
tags:
  - fp
  - functionalprogramming
---
_There's a lot of talk about functional programming these days. Some of the language seems impenetrable at first - immutability, first class functions, functions as values, and so on. If you're a programmer versed in more mainstream approaches, how do you start on the functional programming journey? Here's how I started, perhaps it will work for you too._

## Programming Paradigms

There are a number of paradigms in programming. Imperative, procedural, object oriented, logic, declarative, and more. Self taught in the 1970s and early 1980s, I naturally found myself on the imperative and procedural side, with object orientation the panacea we all strived to reach. These days I've seen the light, and am heading in that direction. I started with a little toe in the water, and managed to take in a number of core functional programming concepts along the way:

* what, not how: describing what you want, rather than how to do it
* immutability: not changing data (and potentially causing unwanted side-effects)
* functions as values: treating functions as first class, along with other value types
* higher-order functions: functions that take and / or produce other functions

## Starting in JavaScript

I've heard it said, somewhat deliberately provocatively, that JavaScript is the most widespread functional programming language. While folks could argue in either direction on that (and the fact that this statement was countered with "no, spreadsheets are!") there is enough functional spice in the language to start exploring, and as it's likely that you may be already familiar with the language, it's a great place to start. I'm using [some ES2015 language features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_2015_support_in_Mozilla), given that it's already 2017 ;-)

Let's say we have a list of numbers and we want to double them.

```javascript
let aNums = [1, 2, 3, 4, 5];
```

Here's how we might do that in an imperative, procedural fashion:

```javascript
for (let i = 0; i < aNums.length; i++) {
  aNums[i] = aNums[i] * 2;
}
//=> 10
```

Nothing wrong with that per se, but if we're thinking about functional programming, what are the pain points we see? Well:

* it's clunky and describes in detail how to go about iterating through the list, even having to have a stop condition
* it mutates the values in place, possibly causing issues for any other parts of the program that were relying on the previous state

(Confused about the value of 10 that was produced? That's the return value from the last computation, i.e. 5 * 2. Yeah. Ugh.)

Using the higher-order function map, we can address the pain points:

```javascript
const aNums = [1, 2, 3, 4, 5];
```

Now we can declare our list to be a constant, which, amongst other effects, stataes our intention. Then it's simply:

```javascript
aNums.map(x => x * 2);
//=> [2, 4, 6, 8, 10]
```

Said out loud: "map the following function over each of the values in aNums - a function that multiplies by two whatever value you give it". Much neater:

* it's succinct and just says what we want, not how to do it; there's no notion of explicitly describing an iteration or a counter
* it doesn't mutate the input; rather, it produces a new list as output

Mindful of the concepts we looked at earlier, this approach uses map, a higher-order function that takes a function as an argument. Ironically, the native implementation of map in JavaScript appears in an object oriented context - as a method you call on an instance of an object. How about that for an unlikely marriage? As you explore functional progamming further, you'll discover the delights of point-free programming where the use of map (and similar higher order functions) in this way doesn't quite work, and you'll have to resort to a more purely functional approach with helper libraries such as [Ramda](http://ramdajs.com/), where map is implemented as a curried function with the parameters in the "right" order. If you're intrigued, watch: [Hey Underscore, You're Doing It Wrong!](https://www.youtube.com/watch?v=m3svKOdZijA). And then watch it again :-)

There are functions related to map, such as filter, find and reduce. They're all available for you to explore in JavaScript, too. Let's finish these baby steps by looking at reduce. Some say reduce is the ultimate higher order function in this family, as the other functions can be (and often are) implemented using it.

Reduce is also a higher-order function that operates on a list, but the function it takes has two parameters - an accumulator, and the value each time around. Also, reduce itself takes a second parameter - the starting value for the accumulator.

Let's use reduce to compute the total of all the values in our list:

```javascript
aNums.reduce((a, x) => a + x, 0)
//=> 15
```

(Notice that as we have two parameters for our function, we have to wrap them in parentheses.)

Reduce can produce a differently shaped output. It doesn't have to "reduce" a list down to something smaller (like a scalar value, 15, in this case). Let's produce a list of records instead:

```javascript
aNums.reduce(
  (a, x) => { a.push({ val : x}); return a; },
  []
)
//=> [ { val : 1 }, { val : 2 }, { val : 3 }, { val : 4 }, { val : 5 } ]
```

Take a moment to think about the power of reduce. You'll also come across a function called [fold](https://en.wikipedia.org/wiki/Fold_(higher-order_function)) in the functional programming world. Fold and reduce are pretty much the same thing (fold is arguably a better name).

So that's it for now. When you find yourself starting to type "for ( …" in JavaScript, stop and reflect whether you could hazard a higher-order function. Embrace the simplicity, and get ready to take the next steps.

---

[Originally published on mud.bluefinsolutions.com](https://web.archive.org/web/*/https://mud.bluefinsolutions.com/2017/05/14/func-prog-baby-steps/).
