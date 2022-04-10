---
layout: post
title: F3C Part 8 - Promises
tags:
  - language-ramblings
---
FunFunFunction Video: [Promises - Part 8 of Functional Programming in JavaScript](https://www.youtube.com/watch?v=2d7s3spWAzo&index=8&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)

(This post is part of the [F3C](/f3c/) series)

This video episode was recorded over a year ago. Since that time, a native implementation of Promises is available in my scratchpad of choice, (the developer tools console of) Google Chrome. So there's no requirement for us to use `babelify/polyfill` or other similar techniques, we can just go ahead and say:

```javascript
new Promise((resolve, reject) => {  })
```

and get

```javascript
Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}
```

Because of this, it would seem that many of the implementation related [pitfalls detailed in the Promise Cookbook](https://github.com/mattdesl/promise-cookbook#pitfalls), to which MPJ refers in his video description, are no longer relevant. Which is a good thing.

Like recursion, asynchronous programming in general and promises in particular make me stop and think. There's an uphill element to thinking about asynchronous tasks, and chaining them together. So I reflected a little longer than normal on what I'd learned from this video. Moreover, I'd been intrigued by what MPJ had mentioned in the video, multiple times, about **composability**.

I have a general understanding about function composition from my relationship with Clojure. But following the video, I explored some other material, including a talk from Full Stack Toronto: [Reduce Complexity with Functional JS by @frontvu](https://www.youtube.com/watch?v=v6oFo_Uajwk). This talk gives a very brief introduction to some of the key concepts of functional programming, and includes this implementation of a `compose` function:

```javascript
var compose = function () {
  var funcList = arguments;
  return function () {
    var args = arguments;
      for (var i = funcList.length; i-- > 0;) {
        args = [funcList[i].apply(this, args)];
      }
      return args[0];
  };
};
```

This allows us then to do something like this:

```javascript
compose(n => n * n, n => ++n)(5)
// 36
```

In other words, we're composing a couple of functions (the anonymous increment and square functions here) to form a new function. 

This is similar to [Clojure's native composition function](https://clojuredocs.org/clojure.core/comp) `comp`. There are many examples of how `comp` can be used, but my favourite one, beautifully simple, is this:

```clojure
(filter (comp not zero?) [0 1 0 2 0 3 0 4])
;;=> (1 2 3 4)
```

Anyway, back to promises in JavaScript. In the light of this reflection on `comp` and `compose`, the point that MPJ was making about promises being composable makes sense. We can think of function composition as chaining functions together, in a similar way to the Unix pipeline idea - the output of one function gets fed into the input of the next. It's almost so simple as to be too hard to understand. 

I had found myself on a journey to the centre of the earth just to understand function composition, whereas it had been sitting there innocently in front of me all this time. The ability to string promises together, passing promises and values through the `then` chain, is pretty damn powerful. Add to that the ability to treat a list of functions the way that `Promises.all` gives us, and there's a compelling argument for getting to know more about promises right there.

