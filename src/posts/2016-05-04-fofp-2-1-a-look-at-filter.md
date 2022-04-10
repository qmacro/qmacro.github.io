---
layout: post
title: FOFP 2.1 A look at filter
tags:
  - language-ramblings
---
Part of the [Fundamentals of Functional Programming](/2016/05/03/fofp) document.

Prev: [FOFP 1.5 Creating functions](/2016/05/03/fofp-1-5-creating-functions)

We've already seen our first higher-order function, `map`, in action. A close sibling is `filter`.

`filter` has the same pattern as `map`, in that it works on an Array, and applies the supplied function to each element of that Array in turn. In this case though, the function acts as a predicate, and only those elements for which the predicate evaluates to true are kept. The others are discarded, leaving you with a shorter collection.

## Taking the odd ones

Let's explore with a simple example based on our short list of numbers:

```javascript
var nums = [1, 2, 3, 4, 5];
```

If we were only interested in the odd numbers, we could do this:

```javascript
nums.filter(function(x) { return x % 2 !== 0; })
// [1, 3, 5]
```

Pretty simple. Like we did with `map`, we could use a pre-defined (i.e. named) function instead:

```javascript
function is_odd(x) { return x % 2 !== 0; }

nums.filter(is_odd)
// [1, 3, 5]
```

## Declarative style

Notice that the program is starting to become easier to read, the more we move away from the mechanical nature of the imperative style of programming towards a more declarative style.

And it doesn't end there. If we wanted to take the numbers we'd filtered our list down to (1, 3 and 5) and transform them, all we'd need to do is chain calls together ... remember that `map` and `filter` both consume and produce lists. Remembering our `times` function from [FOFP 1.5](/2016/05/03/fofp-1-5-creating-functions/), we could form a chain like this:

```javascript
nums.filter(is_odd)
    .map(times(4))
// [4, 12, 20]
```

Now that we've seen `map` and `filter`, it's time to have a look at their somewhat more powerful sibling, `fold`.

