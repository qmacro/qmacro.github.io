---
title: Learning from community solutions on Exercism - part 3
date: 2023-04-09
tags:
  - jq
  - exercism
---
In this post I continue to dwell on small details in the jq solutions to Exercism exercises. It follows on roughly from parts [1](/blog/posts/2023/03/29/learning-from-community-solutions-on-exercism-part-1/) and [2](/blog/posts/2023/04/02/learning-from-community-solutions-on-exercism-part-2/). 

<a name="remote-control-car"></a>
## Remote Control Car exercise

I was just checking through my solution to this simple exercise, to compare it with the [community solutions](https://exercism.org/tracks/jq/exercises/remote-control-car/solutions). There was nothing earth shattering but a couple of things jumped out at me that I thought might be worthwhile mentioning. I solved tasks 1 and 2 in this exercise like this:

```jq
def new_remote_control_car:
  {
    battery_percentage: 100,
    distance_driven_in_meters: 0,
    nickname: null
  }
;

def new_remote_control_car(nickname):
  new_remote_control_car | .nickname = nickname
;
```

### Multiple function definitions

First, this is a pair of definitions of a function named `new_remote_control_car`. One that takes no arguments, and one that takes a single argument. One would refer to them as `new_remote_control_car/0` and `new_remote_control_car/1` respectively. 

The jq wiki has a lot of interesting things to say here, and in the [Lexical Symbol Bindings: Function Definitions and Data Symbol Bindings](https://github.com/stedolan/jq/wiki/jq-Language-Description#Lexical-Symbol-Bindings-Function-Definitions-and-Data-Symbol-Bindings) section of the [jq Language Description page](https://github.com/stedolan/jq/wiki/jq-Language-Description), we see that:

> Note well that foo, foo(expr), foo(expr0; expr1), and so on, are all different functions. The number of arguments passed determines which foo is applied. We can and do refer to the first as foo/0, the next as foo/1, and so on.

_I can't help notice the "Note well", which is a direct English equivalent of the Latin-based initialism "N.B." i.e. "Nota bene". I wonder if it was deliberate. Anyway, I digress._

This is why the above approach works so well, and feels so clean. The call to `new_remote_control_car` in the second function definition will invoke the version from the first function definition as there are no arguments being passed. I was initially thinking this feature might be a way to variadic function definition, but on reflection, this is something that feels different, as there's only a single function definition in the latter case, as can be demonstrated in this JavaScript example of a variadic function, that uses the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax):

```javascript
myfun = (...xs) => xs.reduce((a, x) => a + x, '')
myfun(1,2,3)
// => '123'
```

I had a fascinating conversation with my son Joseph about this (who is infinitely more knowledgeable than me in the area of programming, language paradigms, semantics and implementations) and he suggested that this multiple function definition approach could even be compared to how recursion is defined in Haskell, as illustrated in this classic factorial function definition:

```haskell
factorial :: Integer -> Integer
factorial 1 = 1
factorial n = n * factorial (n - 1)
```

In a way the `factorial` function is being defined multiple times (well, twice here), but one thinks about this in terms of a way to define a recursive based solution.

### Modifying or extending an object

In the defintion of `new_remote_control_car/1` above, we have this:

```jq
new_remote_control_car | .nickname = nickname
```

The output from a call to `new_remote_control_car` goes through the pipe where `.nickname = nickname` is then executed. This felt quite natural to me, defining (adding or replacing, or "upserting", to use that database oriented word) a value for a property. 

There was an alternative approach to adding or replacing a property in an object, used in solutions from users glennj and bewuethr:

```jq
def new_remote_control_car($nickname):
  new_remote_control_car + {$nickname}
;
```

This also works, because the [addition operator](https://stedolan.github.io/jq/manual/#Addition:+) `+` can add objects:

> Objects are added by merging, that is, inserting all the key-value pairs from both objects into a single combined object. If both objects contain a value for the same key, the object on the right of the + wins.

What makes this particular variation pleasing is the compact nature of the expression on the right of the `+`, i.e. simply `{$nickname}`. 

This compactness comes about from:

- the use of a variable reference for the key expression, which of course resolves to the value of the variable
- the ability to omit the double quotes for the key if the expression is "identifier-like"
- the shortcut syntax that allows `{x: .x}` to be written as `{x}`:

The "full fat" version of the expression would have been:

```jq
new_remote_control_car + { "nickname": $nickname }
```

(There's also the difference between `def new_remote_control_car(nickname)` and `def new_remote_control_car($nickname)` but I'll leave that for another time.)

## Grade Stats exercise

Another simple exercise, and this time I wanted to draw attention to the argument supplied as the "initial value" parameter of the `reduce` function. 

With reduce functions in general, I suppose I've gone through some sort of "journey of enlightenment" with respect to what's supplied as this "initial value":

- Stage 1: a literal scalar (for when you're doing something like adding a list of numbers)
- Stage 2: a literal form of some sort of more complex value such as an array or object (for when you're doing something like implementing a map function)
- Stage 3: something generated (for all sorts of things)

Again, this is very obvious, but still worth calling out. Especially as I think that reduce is such a powerful and fundamental mechanism (if you're interested in reading more on reduce, see the [Further reading](#further-reading) section below).

Anyway, many of the community solutions used jq's [reduce](https://stedolan.github.io/jq/manual/#Reduce), which looks like this (in pseudocode):

```jq
reduce stream-of-values as $x (
  initial-value; 
  generation of accumulated value using . and $x
)
```

Nearly all of them had a literal object as the initial value, representing "Stage 2", like this from user kruschk:

```jq
def count_letter_grades:
    reduce .[] as $grade ({A: 0, B: 0, C: 0, D: 0, F: 0};
                          .[$grade | letter_grade] += 1)
;
```

This is already great, because it elevates the lowly "initial value" parameter to something more important than "just a simple starting value". The fact that it takes up quite a bit of space in the actual call (i.e. `{A: 0, B: 0, C: 0, D: 0, F: 0}`) draws one's attention to it. 

Instead of writing this starting object out literally, I wanted to generate it, so opted for "Stage 3". This is in no way "better" than the community solutions\*, but in a similar way I think it helps to elevate the "initial value" parameter to something more important than it might be, merely by passing an expression. Here's what I used:

```jq
def count_letter_grades:
  reduce .[] as $grade (
    "ABCDEF"|split("")|with_entries({key:.value,value:0});
    .[($grade|letter_grade)] += 1
  )
;
```

\*_in fact it's worse in at least one way, in that I missed the fact that there's no "E" grade in the entire exercise!_

With the expression `"ABCDEF"|split("")|with_entries({key:.value,value:0})` I wanted to construct that literal object, and also use it as an opportunity to practise using `with_entries` which is one of a set of three lovely functions. If you're interested, I wrote a post on this: [Reshaping data values using jq's with_entries](/blog/posts/2022/05/30/reshaping-data-values-using-jq's-with_entries/). 

I'll admit that this solution is perhaps not as clear as the literal object construction; nevertheless, I like it because it makes me think more about the importance of that first parameter to `reduce`. 

<a name="further-reading"></a>
## Further reading

If you are still unfamiliar with reduce as a concept, I'd heartily recommend taking some time to become familiar with it. Here are a few posts from me on the topic, and the "F3C" ones have links to corresponding "Fun Fun Function" videos on the topic, from the awesome [mpjme](https://twitter.com/mpjme):

- [F3C Part 3 - Reduce basics](/blog/posts/2016/10/02/f3c-part-3-reduce-basics/)
- [F3C Part 4 - Reduce advanced](blog/posts/2016/10/02/f3c-part-4-reduce-advanced/)
- [ES6, reduce and pipe](/blog/posts/2019/04/08/es6-reduce-and-pipe/)
- [Understanding jq's reduce function](/blog/posts/2022/03/25/understanding-jq's-reduce-function/)

Until next time, happy solving!
