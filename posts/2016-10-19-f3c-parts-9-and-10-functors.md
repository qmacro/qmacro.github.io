---
layout: post
title: F3C Parts 9 and 10 - Functors
tags:
  - language-ramblings
---
FunFunFunction Videos: [Functors - FunFunFunction #10](https://www.youtube.com/watch?v=YLIH8TKbAh4&index=9&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84) and [Functors: I was WRONG! - FunFunFunction #11](https://www.youtube.com/watch?v=DisD9ftUyCk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=10) (yes, the sequence numbers are a bit mixed up, don't worry though)

(This post is part of the [F3C](/f3c/) series)

There are two videos in the series. In the first, MPJ explores what functors are, and based on material in the blogosphere, makes some statements that aren't quite accurate. So he follows up with a second video correcting those statements, which I think was an excellent way to fix things. There's a lot to be said for learning by watching other people learn.

There's quite a bit to take in from these two videos on functors, so here's my summary of functor essentials:

- a functor is a type -- for us, an object or container -- that has a `map` method[^n] 

- this container can contain elements of any type

- the `map` method tranforms the elements, by applying the supplied function to each of them[^n]

- while the elements are transformed, the structure of the container remains intact

- the result is a new functor

As MPJ points out, the most common functor in our context is JavaScript's `Array`. Here it is in action[^n]:

```javascript
["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"]
  .map(x => x.length)
  .map(x => x % 2 === 0)
// [false, false, false, false, false, true, false, true, false]
```

The point of the second `map` in the example is to show that what is returned by the first `map` is indeed a functor -- another `Array`, in fact -- over which we can call `map` again.

While `Array` is the most obvious functor, MPJ points out that some implementations of Promises are functors, as are Streams (the latter is the subject of the next episode in this series). There's a Promise example, but it's not quite right - there are a couple of bracket-related typos. Here's what I think it should look like instead:

```javascript
import Promise from 'bluebird'

const whenDragonLoaded = new Promise((resolve, reject) => {
  setTimeout(() => resolve([
      { name: ‘Fluffykins’, health: 70  }
  ]), 2000)
})
const names = 
    whenDragonLoaded
        .map(dragon => dragon.name)
        .then(name => console.log(name))
```

One thing I was slightly unsure of in correcting the brackets was replacing the curly braces (the ones that wrapped the object literal in the `resolve` call) with square brackets. At one level it is fine - the curly braces were simply not syntactically correct. But I felt as though adding the "container" syntax I was "helping" the Promise be a functor. Moreover, in one of the articles on JavaScript Promises that I read, I picked up the sentiment that doing exactly this was deemed bad practice. Anyway, I'm sure things will become clearer here as I explore further. 

[^n]: (although it doesn't have to be called that, I guess - the method name could be different, but have the same effect)
[^n]: "lifting" the function into the container
[^n]: I'm deliberately using small, generic variable names, as that's what functional programming suggests to me - making things simple and generic means I don't want to inadvertently attach "contextual baggage" with variable names that mean something only in one context

