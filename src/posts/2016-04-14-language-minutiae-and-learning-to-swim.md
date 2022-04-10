---
layout: post
title: Language minutiae and learning to SWIM
tags:
  - language-ramblings
---
Further to [Enlightenment in action](http://langram.org/2016/04/12/enlightenment-in-action/), here's a tiny bit more light that I discovered on my journey up to Newcastle this morning.

I solved 4Clojure puzzle 100 ([Least Common Multiple](https://www.4clojure.com/problem/100)) with this code:

```clojure
(fn [& args]
  (let [[x & xs] (reverse (sort args))
        are-divisors? (fn [n] (zero? (reduce #(+ %1 (mod n %2)) 0 xs)))]
    (->> (iterate (partial + x) x)
         (filter are-divisors?)
         first)))
```

I'm not a mathematician, so forgive me, but my approach to the solution was to take the largest of the numbers supplied, and build a lazy sequence of its multiples, (e.g. starting with 7 it would be 7, 14, 21, 28 etc). The first number in that sequence that had the rest of the numbers as factors was the answer.

Expressing that in Clojure, I first marshalled the input and prepared a function that I could use in the main part of the resolution. In the `let` binding, I split the input numbers into a single scalar - the greatest of them - and a sequence of the rest of them. Then I defined a function on the fly to close over that "rest" sequence (represented by the `xs` var) and determined whether those numbers were divisors of a given number `n`.

Looking in detail at this function, here's what I was expressing:

- fold over the list of numbers: `(reduce ... 0 xs)`
- in each case, calculate the modulo of `n` divided by that number
- by wrapping this in a `reduce`, add up the total of the modulo results: `#(+ %1 (mod n %2))`
- look to see if the total was zero, which would represent the fact that all the numbers were indeed divisors: `(zero? ...)`

Neat enough, I thought.

But the nature of this is *slightly* mechanical ... I wanted to know whether every number was a divisor, and did that with maths (deriving a modulo total and checking for zero). So while I was doing well, I didn't entirely Say What I Mean (SWIM).

Looking at someone else's solution, I discovered the predicate function `every?` that was perfect, and would allow me to SWIM better.

Here's my definition:

```clojure
(fn [n] (zero? (reduce #(+ %1 (mod n %2)) 0 xs)))
```

and here's a version using `every?`:

```clojure
(fn [n] (every? #(zero? (mod n %)) xs))
```

Yes, it's shorter, which is nice, but the difference is striking. With this version, I'm now saying: "_is every modulo of `n`, and the numbers under test, zero?_"

One small step closer to a more natural ability to Say What I Mean.
