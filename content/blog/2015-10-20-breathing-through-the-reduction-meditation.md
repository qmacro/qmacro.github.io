---
title: Breathing through the reduction meditation
date: 2015-10-20
tags:
  - language-ramblings
  - clojure
  - firstrest
  - headtail
  - looprecur
  - reduce
description: In this post I look even more closely at a simple Clojure implementation of a reduce function.
---
The subject of the earlier post [A meditation on
reduction](/blog/posts/2015/10/19/a-meditation-on-reduction/) was the simple
Clojure implementation of a reduce function.

Here it is again:

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

If you’re not familiar with what reduce is used for, and how, you may want to
take a quick look at the
[documentation](https://clojuredocs.org/clojure.core/reduce) before continuing.

OK, let’s examine it line by line.

1: the `my-reduce` function definition starts with the `defn` macro, which
allows for a shorthand way to write `(def my-reduce (fn (...)))`. The name
`my-reduce` is used to distinguish it from the actual reduce function.

2: So begins the first arity definition, ending on line 7. This definition is
for the 3-arity case – where the `my-reduce` function is called with three
arguments – the function, a starting value, and the collection. The arguments
are captured into `f`, `initial` and `coll`. Note that these are immutable from
the get go.

3-4:
[loop/recur](http://clojure.org/special_forms#Special%20Forms--(recur%20exprs*))
is a tail position pattern where the `loop` part has bindings which we can see
here on lines 3 and 4. These are like [let
bindings](https://clojuredocs.org/clojure.core/let), to local vars (remember,
vars are not variables!). Here the vars are `result` and `remaining,` bound
initially (i.e. before the first recur) to `initial` and `coll`.

5-7: The test to be evaluated is whether the remaining collection (in
`remaining`) is empty; if it is, then the current value of `result` becomes the
return value of the call to `my-reduce` and execution ends. If it’s not, then
the `recur` goes back to the target indicated by `loop` in line 3, specifying
the values to be used for the result and remaining bindings this time around.

For `result`, the value is the result of applying the function bound to `f` to
the `result` and the first element of the `remaining` collection. So for
example, if we were using this to sum a series of numbers, this would be the
point (and in fact the only point) at which the actual add function would be
invoked.

For `remaining`, we take all but the first element of the `remaining`
collection.

This is a nice example of the “head and tail” pattern that I mentioned in an
earlier post [My Journey to
Clojure](/blog/posts/2015/10/19/my-journey-to-clojure/).

8-9: And here we find the second arity definition. It’s simplicity is what
makes it lovely, and again, this is a common pattern in Clojure. For the case
where an argument to a function isn’t supplied, then often you’ll a second
definition, expecting that reduced set of arguments and then calling itself
with the “right” number of arguments.

In this particular case, this second arity definition is for the 2-argument
case `[f [head & tail]]` as opposed to the 3-argument case `[f initial coll]`
in line 2.

In case you’re wondering about `[f [head & tail]]`, f is the first argument,
and `[head & tail]` is the second. This second argument is an example of
sequential destructuring, where the first value is captured and then any
remaining values beyond the named position (head) are gathered into a sequence.

## Visualisation

Scribbling down values in my notebook for sample executions helped me meditate
on this. I thought I’d share a couple here.

![notebook scribbles](/images/2015/10/notebook-scribbles.png)

## Summing up

All in all, for such a small piece of code, such a compact meditation, there
are some choice patterns and best (or at least common) practices that one can
reflect upon and enjoy.
