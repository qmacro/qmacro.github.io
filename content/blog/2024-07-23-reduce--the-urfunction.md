---
title: reduce - the ur-function
date: 2024-07-23
tags:
  - javascript
  - jq
---
I often think of `reduce` as the "[ur-](https://en.wiktionary.org/wiki/ur-)function", as it's so primitive (in building block terms, not in power or utility terms) and ubiquitous (I'm often disappointed when a new language I come across doesn't have it or an equivalent). I've [written quite a lot about reduce over the years](https://www.google.com/search?q=site%3Aqmacro.org+reduce) too.

I was listening to Bart and Allison discuss various aspects of jq on the very enjoyable [PBS 167 of X — jq: Recursion, Syntactic Sugar, Some old Friends and a Few Honourable Mentions](https://pbs.bartificer.net/pbs167.html) podcast episode and it was in this episode that Allison made some remarks about `reduce`:

> "... I really like just this whole concept of map, map_values and reduce, I sort of wish it existed in other languages you know it's a really slick feature ...".

This prompted me to write this short post. Thanks Allison!

When I say I think about `reduce` as a primitive, it's easy to see it being used as a building block for other functions such as `map` and `filter`.

JavaScript already has a [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function as a prototype on `Array`, but we can easily imagine how this might be constructed, using `reduce`. Here's a simple hand-built `map` function (called `_map`, to avoid a name collision) on `Array`:

```javascript
Array.prototype._map = function(fn) {
    return this.reduce((a, x) => { a.push(fn(x)); return a; }, [])
}
```

Now, given this definition, we can use it like `map` and it does the same. For example:

```javascript
const nums = [ 1, 2, 3 ]
nums._map(x => x * x) // -> [ 1, 4, 9 ]
```

or:

```javascript
["hello", "there"]._map(x => x.toUpperCase()) // -> [ "HELLO", "THERE" ]
```

And how about in jq? We can also (re)create the `map` function using `reduce` here too. How about this:

```jq
def _map(fn):
    reduce .[] as $x ([]; .+ [$x | fn])
;
```

This works as we'd expect:

```jq
[ 1, 2, 3 ] | _map(. + 100) # -> [ 101, 102, 103 ]
```

The super interesting angle here is that in jq, the `map` function is defined not using `reduce`, but in a much simpler (and much more idiomatic) way. We can even see the definition, as it's [a builtin written in jq itself](https://github.com/jqlang/jq/blob/1f1e619f4e1478598aca56115948eb14d484b9fe/src/builtin.jq#L3):

```jq
def map(f): [.[] | f];
```

Now if that's not something beautiful to trump what I already thought was beautiful, I don't know what is.

By the way, Bart often refers to the [array / object value iterator](https://jqlang.github.io/jq/manual/#array-object-value-iterator) `.[]` as "explode", and to the construction we see here - the enclosing `[]` [array construction](https://jqlang.github.io/jq/manual/#array-construction) - as "containing" the "explosion". Lovely!

If you've not tried the [Programming By Stealth](https://www.podfeet.com/blog/pbs-index/) podcasts, give them a go, they're definitely worth a listen.
