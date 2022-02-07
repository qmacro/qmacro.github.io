---
layout: post
title: Building blocks of language, structure and thought
tags:
  - language-ramblings
---
As I travel on my path to perhaps what I deem as some sort of enlightenment, back in time via Clojure to one of the great ancestors of language, structure and computational thought (Lisp), I continue to come across a simple theme.

**Building Blocks**

That theme is the concept of basic building blocks with which vast cathedrals can be constructed. Those building blocks are, in Lisp terms at least, `car`, `cdr` and `cons`.

One of my companions on this path is Daniel Higginbotham's [Clojure for the Brave and True](http://www.amazon.co.uk/Clojure-Brave-True-Ultimate-Programmer/dp/1593275919/). In Part II, covering Language Fundamentals, Clojure's abstractions, or interfaces, are discussed. One of the Clojure philosophies is that the abstraction idea allows a simplified collection of functions that work across a range of different data structures. Abstracting action patterns from concrete implementations allows this to happen. This is nicely illustrated with a look the `first`, `rest` and `cons` functions from the sequence (or 'seq') abstraction.

There's a close parallel between `first`, `rest` & `cons` in Clojure and `car`, `cdr` & `cons` in other Lisps such as Scheme. And there's an inherent and implicit beauty in a collection of constructs so simple yet collectively so powerful. You can read about the origins of the terms [`car` and `cdr` on the Wikipedia page](https://en.wikipedia.org/wiki/CAR_and_CDR), which have a depth and a degree of venerability of their own. Essentially both sets of functions implement a linked list, which can be simply illustrated, as shown in the book and elsewhere, as a sequence of connected nodes, like this:

```
node1              node2              node3
+--------------+   +--------------+   +--------------+
| value | next |-->| value | next |-->| value | next |
+--------------+   +--------------+   +--------------+
    |                  |                  |
    V                  V                  V
  "one"              "two"              "three"
```

**Implementing a linked list**

Daniel goes on to show how such a linked list of nodes like this, along with the three functions, can be simply implemented in, say, JavaScript. Given that these nodes could be represented like this in JavaScript:

```javascript
node3 = { value: "three", next: null }
node2 = { value: "two", next: node3 }
node1 = { value: "one", next: node2 }
```

then the `first`, `rest` and `cons` functions could be implemented as follows:

```javascript
function first(n) { return n.value; }
function rest(n) { return n.next; }
function cons(newval, n) { return { value: newval, next: n }; }
```

With those basic building blocks implemented, you can even build the next level, for example, he shows that map might be implemented thus:

```javascript
function map(s, f) {
  if (s === null) {
    return null;
  } else {
    return cons(f(first(s)), map(rest(s), f));
  }
}
```

To me, there's a beauty there that is twofold. It's implemented using the three core functions we've already seen, the core atoms, if you will. Moreover, there's a beauty in the recursion and the "first and rest pattern" I touched upon earlier in "[A meditation on reduction](https://langramblog.wordpress.com/2015/10/19/a-meditation-on-reduction/)".

**Using the building blocks**

Let's look at another example of how those simple building blocks are put together to form something greater. This time, we'll take inspiration from a presentation by Marc Feeley: "[The 90 minute Scheme to C compiler](http://churchturing.org/y/90-min-scc.pdf)". In a slide on tail calls and garbage collection, the sample code, in Scheme (a dialect of Lisp), is shown with a tail call recursion approach thus:

```scheme
(define f
  (lambda (n x) 
    (if (= n 0) 
        (car x) 
        (f (- n 1) 
           (cons (cdr x) 
                 (+ (car x) 
                    (cdr x)))))))
```

If you stare long enough at this you'll realise two things: It really only uses the core functions `car` (`first`), `cdr` (`rest`) and `cons`. And it's a little generator for finding the Nth term of the Fibonacci sequence:

```scheme
(f 20 (cons 1 1)) ; => 10946
```

I love that even the example call uses `cons` to construct the second parameter.

I read today, in "[Farewell, Marvin Minsky (1927–2016)](https://medium.com/backchannel/farewell-marvin-minsky-1927-2016-54d4bce913d8)" by Stephen Wolfram, how Marvin said that "programming languages are the only ones that people are expected to learn to write before they can read". This is a great observation, and one that I'd like to think about a bit more. But before I do, I'd at least like to consider that studying the building blocks of language helps in reading, as well as writing.

