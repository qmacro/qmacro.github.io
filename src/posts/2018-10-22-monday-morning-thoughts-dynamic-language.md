---
layout: post
title: "Monday morning thoughts: dynamic language"
date: 2018-10-22
tags:
  - sapcommunity
  - mondaymorningthoughts
---
*In this post, I think about a particular function definition in
JavaScript, and how it represents beauty and practicality in equal
measure.*

On Friday evening, I
[tweeted](/tweets/qmacro/status/1053322908813148165):

> Heading to the woodstore with a beer and cigar. I was reminded of this
> little gem just now. Lovely.
>
> ```javascript
> const push = (xs, x) =>
>   (_ => xs)(xs.push(x))
> ```

It was something I'd come across while idly perusing some source code,
and I thought it was quite beautiful. I had a few responses to the
tweet. In one of them, someone asked for an explanation, and
then Julie Plummer [suggested](https://twitter.com/JuliePlummer20/status/1053526571745755137) I
do it in the form of a post in this [Monday morning thoughts
series](/tags/mondaymorningthoughts/). This was a
great idea, as I was already on my way to the woodstore.

![](/images/2018/10/woodstore.jpg)
*The woodstore, where I read and think about things (and enjoy a beer or
two).*

## The context

The source code in question is a utility program,
[reuseTableData.js](https://github.com/SAP/cloud-sample-spaceflight/blob/master/db/reuseTableData.js),
part of the base repository
[SAP/cloud-sample-spaceflight](https://github.com/SAP/cloud-sample-spaceflight)
which contains the base Core Data & Services data model for the
Application Programming Model sessions at SAP TechEd this year (see
"[Application Programming Model for SAP Cloud Platform - start
here](/blog/posts/2018/10/10/sap-cloud-application-programming-model-(cap)-start-here/)")
and written by Christian Georgi & my Language
Ramblings partner in crime Chris Whealy.

Why was I reading this? Well, out of curiosity, and a desire to learn
more, of course. I have heard that programmers spend only around 10% of
their time writing code, and 90% reading it. That sounds extreme, but I
can imagine it being true in some circumstances. I'm guessing this
covers not only reading code to work out what it does before extending
or modifying it, but also reading code for pleasure, to learn how other
people write.

![Programming
Jabber](/images/books/programmingjabber_large.jpg)

I remember researching for my first book "[Programming
Jabber](http://shop.oreilly.com/product/9780596002022.do)" in the early
2000's. I spent many hours in the local coffee shop reading through the
source code of the reference implementation of the Jabber (now
[XMPP](https://xmpp.org/)) protocol - the jabberd source code, written
in C by [Jeremie Miller](https://en.wikipedia.org/wiki/Jeremie_Miller)
and others. I learned a lot from it, and I enjoy reading other people's
code now and then - not least to see how each author's character gently
but inevitably leaks through into the code.

So back to the program in question. To add a little context, here's the
[line of
code](https://github.com/SAP/cloud-sample-spaceflight/blob/c3c152e192b1d3dcfea23242681f3521d32b22f2/db/reuseTableData.js#L36-L37)
again, with the comment that accompanies it:

```javascript
// A useful version of Array push that returns the modified array 
// rather than the index of the newly added item...
const push = (arr, newEl) =>
  (_ => arr)(arr.push(newEl))
```

In JavaScript, Array is a global object used to represent lists, and has
a number of built-in functions, or methods, that operate on Array object
instances.

For example, you can create an array and then use the Array object's
`join()` function like this:

```shell
> const colours = ['red', 'green', 'blue']
undefined
> colours.join(' and ')
'red and green and blue'
```


(Code samples here are from Chrome console sessions, using
[ES6](https://bytearcher.com/articles/es6-vs-es2015-name/)).

Another built-in function for the Array object is `push()`, one of a group
of four functions I mentally think about together as a family, as they
do very similar things:

```text
  shift() <---+           +---> pop()
              |           |
              |           |
             [1, 2, 3, 4, 5]
              ^           ^
              |           |
unshift() ----+           +---- push()
```

The functions `shift()` and `unshift()` operate on the front of an array,
removing or adding elements respectively. The functions `pop()` and `push()`
operate on the end of an array, removing or adding elements
respectively.

There are also other functions for manipulating elements in other places
in an array, functions such as `splice()` and `slice()`, but what we want to
concentrate on right now is `push()` and its cousin `unshift()`. Both add
elements to the array. And in both cases, what's returned
is the length of the new array. For example:

```shell
> const colours = ['red', 'green', 'blue']
undefined
> colours.push('yellow')
4
```

This is not unreasonable, but it's also less useful than you might
think.

## Practicality

In many situations, you'll want to create something - an array, a map,
another higher level object, and manipulate it. One approach to this
which feels to many quite natural is to use method chaining, which is
effectively like saying: "do this, then that, then the other".

This is common in UI5, where for example standard controls, such as the
Button control in the `sap.m` library has methods, many of which return
the Button instance upon which they're operating, explicitly to allow
method chaining (see for example
[attachPress](https://ui5.sap.com/#/api/sap.m.Button/methods/attachPress)).
So we can end up with something like this, where four methods are
"chained" together:

![](/images/2018/10/Screenshot-2018-10-22-at-08.36.39.png)

In a similar way, you might want to create a list of elements, rearrange
it by some means, add something to the end of it, and then map over each
of the final collection of elements to end up with what you really need.
Like this, for example:

```javascript
['red', 'white', 'blue']
    .push('orange')
    .sort()
    .map(x => x.toUpperCase())
```

You'd hope to get this:

```javascript
["BLUE", "ORANGE", "RED", "WHITE"] 
```

However, you'd end up with this:

```log
Uncaught TypeError: ["red","white","blue"].push(...).sort is not a function
at <anonymous>:3:3
```

This is because the `push()` function returns the new length of the array
(4) rather than the array itself. Not ideal.

What's perhaps worse is that it makes it cumbersome to employ higher
level functions like `reduce()`, in combination with the shorter ES6 based
[arrow
function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
style of function definition. With arrow functions, the function
definition itself is much shorter and (without curly braces) there's an
implicit return of whatever is evaluated as a result of that function's
execution.

If you're not familiar with using `reduce()` and taking advantage of the
new ES6 arrow function style, here's a contrived example:

```shell
> [1,2,3,4,5].reduce((a, x) => a * x, 1)
120
```

Here, we multiply a list of numbers, and take advantage of the fact that
the function definition being passed to reduce:

```javascript
(a, x) => a * x
```

*implicitly returns* the result of the expression `a * x`, to be fed into
the next element iteration until the list of elements is exhausted.

In other words, if you want to use Array's `push()` function as the
function definition passed in a `reduce()` scenario, you can't, or at
least, what it evaluates to (the new length of the array) is almost
certainly not what you want fed into the next iteration - you want the
new (modified) array\*.

\*the keen readers amongst you will guess that I'm currently slightly
uncomfortable at completely ignoring the fact that `push()` is mutating
the array, which is generally a Bad Thing(tm) - but I'm ignoring it
deliberately, as that's a whole other subject for another time.

If you read further on in the
[reuseTableData.js](https://github.com/SAP/cloud-sample-spaceflight/blob/master/db/reuseTableData.js) program,
you'll see that there's a `reduce()` in [line
73](https://github.com/SAP/cloud-sample-spaceflight/blob/c3c152e192b1d3dcfea23242681f3521d32b22f2/db/reuseTableData.js#L73)
function being employed to gather table names together:

```javascript
var tableNames = _getTableDataSync(path.join('db/src/csv')).
    reduce(
    (accOuter, filePath) =>
      JSON.
        parse(fs.readFileSync(filePath)).
        imports.
        reduce((accInner, entry) => push(accInner, entry.target_table), accOuter)
      , [])
```

This use of

```javascript
push(accInner, entry.target_table)
```

is not the standard `push()` function from the Array object. Rather, it's
our `push()` function defined earlier, the subject of this post:

```javascript
const push = (arr, newEl) =>
  (_ => arr)(arr.push(newEl))
```

Now we understand the context of where it's used, and why the standard
`push()` function is no good, let's dig in to this definition to see how
it works, and why it can be used.

## Beauty

So first off, we can see it's a function definition using the fat arrow
(`=>`) syntax from ES6. We're now already somewhat familiar with that,
but it still looks a little odd, with that strange looking underscore,
and what initially looks like a slightly uncomfortable number of
brackets.

Remember that contrived example using a `reduce()` function above? You can
see that the function passed to `reduce()` is one with two parameters -
the accumulator `a`, and `x` to represent the elements that are
passed in, one iteration at a time. So also here we have a function
definition with two parameters, again, an accumulator `arr` (array)
and `newEl` representing the elements passed to the function as
`reduce`'s list mechanics iterate over the array, one element at a time.

So what's the actual function definition here? Well, it's this bit:

```javascript
(_ => arr)(arr.push(newEl))
```

The first part, `(_ => arr)` is yet another function definition. What
the heck does it do?

Well, it takes one parameter, and promptly ignores it, simply returning
the value of `arr`. The use of the underscore for this ignored
parameter is convention - it tells the reader "we're expecting a
parameter to be passed to this function, but we're not actually
interested in it". (It's often used where there's more than one
parameter in a function definition signature, and the intention is to
ignore one or more of them.)

The body of this function is simply `arr` which returns whatever value
`arr` has. Which is what?

To answer that, we need to look at the other part of the definition.
This is the `arr.push(newEl)` bit, but we can't and shouldn't ignore
all those brackets. Breaking those brackets down, we have a first pair
surrounding `_ => arr`, a second pair surrounding
`arr.push(newEl)` and the pair around `newEl`.

We can be happy enough with this last pair, it's just a standard
invocation of the `push()` function, where the value of `newEl` is the
new element being pushed onto the end of `arr`.

So what about the other two pairs of brackets? Well, in JavaScript, you
can define an anonymous function on the fly, and call it immediately.
When you do this, you wrap the anonymous function definition in
brackets:

```javascript
(_ => arr)
```


and then call it, passing any arguments in brackets, as normal. In this
case, there's one argument to pass (to match up with the single `_`
parameter the function is expecting). This argument is the result of the
evaluation of this:

```javascript
arr.push(newEl)
```

which, as we know, will be the new length of the `arr` array. But by
the time this is evaluated, the `arr` array will already have had
`newEl` added as a new last element, and so we don't have to worry
about the value returned from this (the new length), as we're going to
capture it in the `_` parameter of `(_ => arr)` and ignore it
anyway. The sole purpose of the `(_ => arr)` function is to return
the value of `arr` - which now has the value of `newEl` on the
end.

The upshot of this definition of a custom `push` function is that we can
use it to push an element onto the end of an array, and have it return
the infinitely more useful modified array, rather than the almost
useless new length of the array. We can then employ it in higher order
function invocations such as those with `reduce()`.

Beyond the ability to define anonymous functions (to use in higher order
functions) and generally program in this dynamic way, the mechanic that
allows this whole idea to work is called a
[closure](https://en.wikipedia.org/wiki/Closure_(computer_programming)).

```javascript
const push = (arr, newEl) =>
  (_ => arr)(arr.push(newEl))
```

The value of `arr`, initially passed to the outer function definition
as the accumulator, by `reduce`'s list mechanics, is available on the
right hand side of the main fat arrow, both in the inner function
definition as well as the on-the-fly call to push that is passed as the
argument to that inner function.

Dynamic programming in general, and this style of extension in
particular, is a wonderful thing, and I consider this particular
definition of push to be quite beautiful.

There are alternatives, of course - my friend [Martin
Rue](https://twitter.com/martinrue) [suggested](https://twitter.com/martinrue/status/1053332526285144064)
this:

```javascript
const push = (xs, x) => xs.push(x) && xs
```

which achieves the same effect by relying on the fact that the last
value evaluated in the execution of a function (again, without curly
braces) is the value that is returned. In this case, that is simply
`xs`\*. Also very elegant.

\* I note that Martin used `xs` to represent a list of `x` elements,
which is a rather nice meme, or at least an idea, that I picked up from
various functional programming treatises and used, for example, by [Erik
Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)) in
his wonderful series on Haskell and F#. Perhaps more on that another
time.

So, here's a hat tip to Chris Whealy who I'm guessing had some
influence on the distinctive style of this `reuseTableData.js` code. I
know Chris and have started to recognise his 'signature' in code. And
I'll leave you with a recommendation to study other people's code
every now and then. It can be a lot of fun, and educational to boot.
Happy reading!

---

This post was brought to you by a cold Monday morning, before setting
off to the airport for Barcelona and the European instance of SAP
TechEd. If you're there, stop by the Developer Garage for a chat about
this or anything else!

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-dynamic-language/ba-p/13383046)
