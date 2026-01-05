---
title: A meditation on reduction
date: 2015-10-19
tags:
  - language-ramblings
  - clojure
  - reduce
  - firstrest
description: 'Looking at a version of the reduce function written in Clojure, from Do Things: a Clojure Crash Course.'
---
One of the people you should follow if you’re learning Clojure, and enjoy prose
with a twist, is [Daniel Higginbotham](https://twitter.com/nonrecursive). He’s
recently published [Clojure for the Brave and
True](https://www.nostarch.com/clojure) (aka “The Crazed Dwarf Riding a Warpig
book”) and has a home at [Brave Clojure](http://www.braveclojure.com/).

In his post [Do Things: a Clojure Crash
Course](http://www.braveclojure.com/do-things/), Daniel takes us on a journey
through syntax, data structures, functions and more. In the section entitled
[Shorter Symmetrizer with
Reduce](http://www.braveclojure.com/do-things/#4_6__Shorter_Symmetrizer_with_Reduce),
he offers a version of the reduce function written in Clojure.

![Programming in a more functional style in JavaScript - Tech Workshop
Notes](/images/2015/10/programming-in-a-more-functional-style-cover.png)

For those of you who are unfamiliar with what reduce is and represents, here’s
a quick precis. Along with map and filter, which are often implemented together
in many languages (even imperative ones), and discussed frequently together,
reduce is a higher order function that operates on immutable sequences to
produce a new value, which can be scalar or a more complex structure such as a
map or a list.

You can play about with map, filter and reduce right now to learn more, as
they’re natively implemented in JavaScript. One option would be to open up a
Chrome Developer Tools console, and follow this guide: Programming in a more
functional style in JavaScript – Tech Workshop Notes.

So, back to Daniel's implementation of reduce in Clojure. This is it, in its
entirety:

```clojure
(defn my-reduce
  ([f initial coll]
   (loop [result initial
          remaining coll]
     (if (empty? remaining)
       result
       (recur (f result (first remaining)) (rest remaining)))))
  ([f [head & tail]]
   (my-reduce f head tail)))
```

Perhaps not empirically, but to me, it is a thing of beauty. Beyond the calm
structure, there are so many nuggets to consume, enjoy and learn from, that if
I covered them all in this post, it would be far too long to read in a coffee
break (which is roughly what I have in mind when writing posts).

So I’ll leave you, dear reader, to meditate on this set of forms, and in the
next post I’ll point out the nuggets that are reflecting the most golden light
(to me): The use of the [first-and-rest
pattern](/blog/posts/2015/10/19/my-journey-to-clojure/), multi-arity function
definition (and the typical pattern of calling itself with default arguments
set) plus variadic function use, and the use of loop/recur. In an earlier
version of this implementation, there was the use of destructuring too, which
in itself was interesting, although it was a little overkill.
