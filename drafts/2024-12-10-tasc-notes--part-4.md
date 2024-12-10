---
layout: post
title: TASC Notes - Part 4
date: 2024-12-10
tags:
  - tasc
  - cap
  - cds
  - handsonsapdev
---
These are the raw, unedited notes I took summarising [The Art and Science of CAP part 4][98], one episode in a mini series with Daniel Hutzel to explore the philosophy, the background, the technology history and layers that support and inform the SAP Cloud Application Programming Model.

For all resources related to this series, see the post [The Art and Science of CAP][99].

Started this episode with a [review of the previous episode][1] (where we collectively decided to make my episode notes into published blog posts like this one).

Daniel brought up a slide deck from one of my talks on Functional Programming, [Functional programming introduction: What, why, how?][2] and the person in the photo on slide four is of course [John McCarthy][3] (well done VJ), father of Lisp. In this context we also touched on [currying][4] (which incidentally is named after [Haskell Curry][6], after whom the pure FP language [Haskell][7] is also named) and [partial application][5], and then on the concept of a [closure][8] - a beautiful technique for implementing lexically scoped name bindings in a language that has support for first class functions (such as JavaScript!).

Daniel then turned to the [Getting Started][9] area of Capire, and in particular the [Services][11] section of the [Best Practices][10] topic, where he turns around "When all you have is a hammer, every (thing) is a nail" into "Everything (in CAP) is a service".

In contrast to the "hammer and nail" adage, this axiom is something positive here, something which follows the pattern of uniformity and the elevation of abstraction, in that via CAP's adoption of [Hexagonal Architecture][12] the heavy lifting done by the adapters is hidden and of little importance to the application or service developer ... except that (as we see later) that developer can interact with and extend the database connection mechanism as easily and as readily as with their own domain services.

In digging into this, and thinking about lower level facilities abstracted upwards as services, and binding in the related idea ([captured in Part 2][12]) that "everything is an event", Daniel made this statement:

> The sum of all your event handlers registered with the service ... is your implementation.

That goes for both local and remote events as well as local and remote services, plus built-in services ... such as a database service, as illustrated in the [Extensible Framework][13] section:

```javascript
cds.db .before ('*', req => {
  console.log (req.event, req.target.name)
})
```

and also the [Calesi][14] services. And this approach allows us as developers ... to "not care". In the best possible way.

This thinking, this approach, is inspired by Smalltalk's concept of "messaging", in that objects send and receive messages, and of course the receipt of a message is ... an event (upon which event-handling code - which we can think of as an indirect method - is executed).

Daniel goes on to explain Smalltalk's [#doesNotUnderstand][15] mechanism which can be effectively turned into a proxy for other services. This idiom is also present in other languages, for example Ruby, in the form of the [method_missing][16] method[<sup>1</sup>](#footnotes).

At around 27 mins in, Daniel opens the REPL, and explains how the set of built-in REPL commands (that begin with a period, such as `.help`), can be extended, and that's what we have in the REPL (started with `cds repl`):

* `.inspect`
* `.run`

In highlighting that the `cds` object is also available, Daniel takes the opportunity to show how the `cds` object, as a front-door facade to everything in the runtime that you might need, is implemented, in `cds/lib/index.js`. Not only are [super] getters involved, but also the general "lazy loading" effect of said getters is used to great effect - a more rapid startup of the server.

Here's a simple example of that lazy loading:

![lazy loading with getter][24]


<a name="footnotes"></a>
## Footnotes

1. This Ruby idiom is a form of metaprogramming, which was popularised with Lisp ... which brings us back to McCarthy. Moreover, as Sinclair Target mentioned in his great article [How Lisp Became God's Own Programming Language][17] (which is also [available in audio format as an episode on my Tech Aloud podcast][18]), "Ruby is also a Lisp", expounded upon by Eric Kidd in his post [Why Ruby is an acceptable LISP][19].

Eric's post incidentally also shows how functions can be first class citizens, and even goes on to give a great example of a closure - the accumulator function, which in turn is from the appendix of Paul Graham's [Revenge of the Nerds][20] post. Here's the original accumulator function definition (named `foo` here) in Lisp:

```lisp
(defun foo (n) (lambda (i) (incf n i)))
```

and here is how we might express it in JavaScript:

```javascript
foo = n => i => n += i
```

Both implementations illustrate the concept of functions as first class citizens (the anonymous function `i => n += i` is returned as a value from a call to the named function `foo`) as well as the concept of a closure (`n` is "closed over", and therefore "captured", in the construct, and lives on inside that anonymous function). Here's a Node.js REPL session showing an example of use:

```log
Welcome to Node.js v22.6.0.
Type ".help" for more information.
> foo = n => i => n += i
[Function: foo]
> mysum = foo(10)
[Function (anonymous)]
> mysum(2)
12
> mysum(3)
15
>
```

Note also that the word "lambda", used here specifically and syntactically in Lisp as the symbol for an anonymous function, has become the de facto term for anonymous functions in general - for example, Python [uses the term][21], and AWS has a Functions-as-a-Service (FaaS) offering called [Lambda][22].


[1]: /blog/posts/2024/11/29/tasc-notes-part-3/
[2]: https://docs.google.com/presentation/d/1VWGEutu0o541a81GPCHG-pQ6IhX8TXC9WwM90JPtIwc/edit
[3]: https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)
[4]: /blog/posts/2016/10/03/f3c-part-6-currying/
[5]: https://en.wikipedia.org/wiki/Partial_application
[6]: https://en.wikipedia.org/wiki/Haskell_Curry
[7]: https://www.haskell.org/
[8]: https://en.wikipedia.org/wiki/Closure_(computer_programming)
[9]: https://cap.cloud.sap/docs/get-started/
[10]: https://cap.cloud.sap/docs/about/best-practices
[11]: https://cap.cloud.sap/docs/about/best-practices#services
[12]: /blog/posts/2024/11/22/tasc-notes-part-2/
[13]: https://cap.cloud.sap/docs/about/best-practices#extensible-framework
[14]: https://cap.cloud.sap/docs/about/best-practices#the-calesi-pattern
[15]: https://wiki.c2.com/?DoesNotUnderstand
[16]: https://www.leighhalliday.com/ruby-metaprogramming-method-missing
[17]: https://twobithistory.org/2018/10/14/lisp.html
[18]: https://creators.spotify.com/pod/show/tech-aloud/episodes/How-Lisp-Became-Gods-Own-Programming-Language---Sinclair-Target---14-Oct-2018-e2rip0q
[19]: https://www.randomhacks.net/2005/12/03/why-ruby-is-an-acceptable-lisp/
[20]: https://www.paulgraham.com/icad.html
[21]: https://discuss.python.org/t/what-is-the-purpose-of-lambda-expressions/12415
[22]: https://aws.amazon.com/lambda/
[23]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
[24]: /images/2024/12/lazy-loading-with-getter.gif
[98]: https://www.youtube.com/watch?v=kwxvyiC-6FI
[99]: /blog/posts/2024/12/06/the-art-and-science-of-cap/


