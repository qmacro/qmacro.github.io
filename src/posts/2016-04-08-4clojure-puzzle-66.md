---
layout: post
title: 4Clojure Puzzle 66
tags:
  - language-ramblings
---
In my quest to teach myself more Clojure, I'm solving puzzles. Puzzles from websites such as [Project Euler](http://projecteuler.net) and [Advent of Code](http://www.adventofcode.com). More recently I've been plugging away at puzzles on [4Clojure](https://www.4clojure.com).

One of the nice things about 4Clojure is that you can "follow" other users, the practical upshot of which is that when you provide a correct solution for a given puzzle, you can look at the solutions from your followers too. I'm following five users, and often their solutions are delightfully different to mine - sometimes simpler, sometimes more elegant, sometimes using an approach I'd never thought of, and sometimes all of the above.

**Learning by Doing**

I gave a talk last month at the [Manchester Lambda Lounge](http://www.lambdalounge.org.uk). It was titled "[Learning by Doing - Beginning Clojure by Solving Puzzles](https://docs.google.com/presentation/d/176SJNJEjkri4u18pxMg5hT72xFQturmMG4CoNoKBxb0/edit#slide=id.p)". I talked through my approaches to solving a few puzzles, sharing my thought processes with the other members of the group. It was fun, and educational - certainly for me!

The theme running through the talk turned out to be "everything is a list". There's a lot to say on this, but I'll limit it here to suggest that in building solutions, it's possible to think in terms of lists, of sequences, and functions that operate thereon. Intertwined with this was my attempt to not mutate any state, and not to approach problems mechanically ... avoiding the *how*, and focusing on the *what*.

**4Clojure 66**

So here's my approach to solving the 4Clojure problem number 66 "[Greatest Common Divisor](https://www.4clojure.com/problem/66)". Please bear in mind it's not the most efficient or elegant. I just wanted to share my thinking. It's the sort of thing I'd like to read if I was exploring a new language, to see different possible ways of thinking computationally.

You can read the [puzzle statement](https://www.4clojure.com/problem/66) over on the 4Clojure site. One of the test cases looks like this:

```clojure
(= (__ 1023 858) 33)
```
We'll use this as a basis for our direction. In this test case, as in all of them, we need to define a function that will sit where the `__` placeholder is, so that the whole expression, or form, is true. So we need a function that takes two arguments (1023 and 858) and returns 33 as the greatest common divisor.

**Where we'll get to**

Here's the complete solution which we'll be working our way towards:


```clojure
(fn [& args]
  (letfn [(common-div [i] (zero? (reduce + (map #(mod % i) args))))]
    (->> (range (apply min args) 0 -1)
         (filter common-div)
         first)))
```


**A helper function**

Breaking the problem down, it would be good to have a function that told me whether a given number was a divisor of some other numbers. So in a `letfn` binding I defined a function `common-div` which did exactly that. The function was defined to close over the `args` to the main (outer) function, i.e. in this particular test case, 1023 and 858.

This `common-div` function works out whether the number supplied, `i`, divides evenly into the numbers in `args`. It does this by mapping an anonymous function `#(mod % i)` over the `args`. This anonymous function returns the modulo, or remainder, of dividing the number(s) by `i`. If the numbers are all evenly divisible, then this should produce a list of zeros, like this:

```
scratchpad.core=> (def args [1023 858])
#'scratchpad.core/args
scratchpad.core=> (def i 3)
#'scratchpad.core/i
scratchpad.core=> (map #(mod % i) args)
(0 0)
```

And folding over this list of remainders, using `reduce`, with the addition function, should produce zero, if `i` is a common divisor:

```
scratchpad.core=> (reduce + (map #(mod % i) args))
0
```

**Finding the answer**

Now we have such a helper function, we can rattle through the puzzle. Inside our `letfn` binding we start with a threading macro (`->>`) which simply allows us to write a sequence of functions in a way that's arguably more readable. What we want to 'thread' is a list of numbers, ranging from the lower of the two `args` down to 1 inclusive. So in this case we want a range from 858 to 1.

```
scratchpad.core=> (range (apply min args) 0 -1)
(858 857 856 ... 1)
```

The `apply` here is doing a similar thing to what it does in JavaScript. If we called `min` with the `args` directly, we'd get this:

```
scratchpad.core=> (min args)
[1023 858]
```

because min treats `args` as a single entity (the list of two numbers ... actually a vector in this case). The function `apply` applies the given function to the content of the list, breaking them out of that list:

```
scratchpad.core=> (apply min args)
858
```

This list produced by `range` is passed into the `filter` function which is using our `common-div` function we defined earlier, which should result in a much shorter list of those numbers that divide evenly into the two `args`, i.e. `(33 11 3 1)`.

And because we're working backwards down to 1, the first number in this filtered list we come across is the one we want: 33. Bingo!

**Final thoughts**

As I mentioned at the outset, this is not necessarily the most efficient solution. But it shows that you can think in terms of lists, with logic that doesn't require any mutation of state. It becomes simply an expression that evaluates to an answer. It's a different way of thinking, but I like it very much.
