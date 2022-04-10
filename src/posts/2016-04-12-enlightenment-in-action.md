---
layout: post
title: Enlightenment in action
tags:
  - language-ramblings
---
One of the ideas that Clojure embraces is this [Perlism](http://www.cs.yale.edu/homes/perlis-alan/quotes.html):

> It is better to have 100 functions operate on one data structure than 10 functions on 10 data structure

This makes a lot of sense. But it also is clear that the language, as a set of functions and features, is large. Of course, at a low level, the language is very small; but the layers that have been built to operate on data structures have a depth that I haven't yet mastered. 

It's not a case of the layers or functions being too complicated ... rather, I just haven't discovered everything that's possible yet. And when I haven't, I am resorting to mechanical solutions. I suppose this is simply a part of the journey, and while building a mechanical solution to a problem is irksome, it's educational, especially when you are shown something so much more succinct.

**An example**

Here's one example, a solution to 4Clojure problem 63 "[Group a Sequence](https://www.4clojure.com/problem/63)". A fairly straightforward challenge, but one that I couldn't see an obviously neat way of solving. (Note that the rules prevented the use of the `group-by` function, with which it would have been a cinch to solve, of course!).

_A clean but mechanical approach_

Here's what I ended up with:

```clojure
(fn p63 [f xs]
  (loop [elements xs
         result {}]
    (if (empty? elements)
      result
      (let [element (first elements)
            value (f element)
            values (or (result value) [])]
        (recur (rest elements)
               (assoc result value (conj values element)))))))
```

In one way, I'm happy, because it's using the `loop/recur` construction (tail recursion idiom), with the "[first/rest](http://langram.org/tag/firstrest/)" pattern, and it's not mutating any state. And I typed this in directly and it solved the puzzle first time :-)

But there's a mechanical nature to it. Here's what it does, generally:

* starts a `loop` with the elements given, and an empty result map
* if there are no elements, it just returns whatever's in the result map at that time
* otherwise it takes the first element, calculates the result of applying the function to that element, and retrieves the current values for that result key (defaulting to an empty vector if there aren't any yet)
* then in the body of the `let` binding it simply `recur`s with the `rest` of the elements (all but the `first`), setting the value for the `result` var to be that plus the addition of the calculated value in the right place in the map

_A neater approach_

Here's the solution from another 4Clojure user that I'm following (and I am learning a great deal from them, whoever they are!):

```clojure
(fn [f s]
  (apply merge-with concat (map #(hash-map (f %1) [%1]) s)))
```

Wow. The power of this solution, and the secret of its brevity, is the `merge-with` function, which is documented thus:

_Returns a map that consists of the rest of the maps conj-ed onto the first.  If a key occurs in more than one map, the mapping(s) from the latter (left-to-right) will be combined with the mapping in the result by calling (f val-in-result val-in-latter)._

This was exactly the right thing. The `(map #(hash-map (f %1) [%1]) s)` form simply returned a flat list of hash-maps with the keys being the result of applying the given function to the element, and the values being the elements themselves. Beautifully simple, in the philosophy of focusing on performing just one task. 

And then the myriad hash-maps were gathered together with `merge-with` using the `concat` function to resolve same-key clashes (in other words, "just group them together"). 

Taking the first of the puzzle's unit tests as an example, here's what stage one (pre `merge-with`) looks like. This:

```clojure
((fn [f s] (map #(hash-map (f %1) [%1]) s)) #(> % 5) [1 3 6 8])
```

produces this:

```clojure
({false [1]} {false [3]} {true [6]} {true [8]})
```

Then applying the `merge-with concat` we get the result:

```clojure
{false (1 3) true (6 8)}
```

Lovely. I'm still on my journey to enlightenment, and am enjoying learning about functions such as `merge-with` on the way.
