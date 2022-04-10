---
layout: post
title: Finding a wonderland number
tags:
  - language-ramblings
---
I came across a simple puzzle this evening, on [Wonderland Clojure Katas](https://github.com/gigasquid/wonderland-clojure-katas). My brain is half dead from starting work extra early and slogging through the day, but I wanted to include a tiny bit of Clojure recreation this evening, before the day was out.

Pretty much at random, I picked the [wonderland-number](https://github.com/gigasquid/wonderland-clojure-katas/tree/master/wonderland-number) puzzle where you have to find number with particular properties. In a way, the puzzle is similar to the ones you can find on [Project Euler](https://projecteuler.net/).

The problem statement is simple. It's about finding a [Cyclic number](https://en.wikipedia.org/wiki/Cyclic_number), thus:

- it has six digits
- if you multiply it by 2,3,4,5, or 6, the resulting number has all the same digits in at as the original number. The only difference is the position that they are in

As I'm tired, it was quite nice to be able to apply the philosophy of building up from small blocks to reach the solution. So, here goes.

**Step 1 - Getting the digits of a number**

We're going to be comparing digits of a number, so let's have a function that will return a sequence of digits for a given number:

```clojure
(defn digits [n] (map #(- (int %) (int \0)) (str n)))
```

The `str` function calls `.toString` on its argument, here turning a number into a string, and therefore, more importantly, a sequence that we can `map` over.

The anonymous function we're using in the map simply converts the char value of each of the string characters to their numeric equivalents. (I do find converting a string representing a digit to its numeric value equivalent a little clunky in Clojure, having a background in scripting languages that make that more seamless. Perhaps I'm missing something. But I digress.)

Let's try it out:

```clojure
scratchpad.core=> (digits 12401)
(1 2 4 0 1)
```

**Step 2 - A unique set of digits**

We actually want a unique set of digits, so we can better compare them:

```clojure
(def digit-set (comp set digits))
```

Simply [composing](https://clojuredocs.org/clojure.core/comp) the function `set` with our new `digits` function does the trick.

Let's try it out:

```clojure
scratchpad.core=> (digit-set 12401)
#{0 1 2 4}
```

**Step 3 - Multiple results**

So now we want to generate the list of results of multiplying the number under test with 2, 3, 4, 5 and 6. We want those results as digit sets. Here goes:

```clojure
(defn mult-result [n] (map #(digit-set (* n %)) (range 2 7)))
```

All we're doing is folding (with `map`) an anonymous function over the `range` of "multiplier" numbers 2 through 6 inclusive. And this anonymous function multiplies the number under test with the particular multiplier being folded over, and produces a digit set from the result.

Let's try it out:

```clojure
scratchpad.core=> (mult-result 123456)
(#{1 2 4 6 9} #{0 3 6 7 8} #{2 3 4 8 9} #{0 1 2 6 7 8} #{0 3 4 6 7})
```

**Step 4 - Checking the digits are the same**

The last thing we have to do is check whether the digits are the same in each of the multiplier cases.

```clojure
(defn same-digits? [n] (apply = (mult-result n)))
```

Using `apply` with a function allows that function to be used with the contents of the sequence supplied, rather than with the sequence itself. So the `=` function operates on the multiple arguments that are the elements of the sequence produced by `(mult-result n)`. The function name ends with a question mark in the tradition for Clojure predicate functions that return true or false.

Let's try it out:

```clojure
scratchpad.core=> (same-digits? 123456)
false
```

**Step 5 - Profit**

Now we have all we need, and can use the `same-digits?` function as a predicate in calling `filter` on the six digit numbers:

```clojure
scratchpad.core=> (first (filter same-digits? (range 100000 1000000)))
142857
```

Result!

So there are undoubtedly better ways of approaching this puzzle, but I wanted to illustrate the bottom-up approach of computing that Clojure, and functional programming in general lends itself rather well to. And on the occasions when you're tired and can only think in small chunks, it's ideal :-)
