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
These are somewhat more detailed notes than normal that summarise [The Art and Science of CAP part 4][98], one episode in a mini series with Daniel Hutzel to explore the philosophy, the background, the technology history and layers that support and inform the SAP Cloud Application Programming Model.

For all resources related to this series, see the post [The Art and Science of CAP][99].

This episode started with a [review of the previous episode][1] (where we collectively decided to make my episode notes into published blog posts like this one).

## Functional programming concepts

At around [13:18][101] Daniel brought up a slide deck from one of my talks on Functional Programming, [Functional programming introduction: What, why, how?][2] and the person in the photo on slide four is of course [John McCarthy][3] (well done VJ), father of Lisp. In this context we also touched on [currying][4] (which incidentally is named after [Haskell Curry][6], after whom the pure FP language [Haskell][7] is also named) and [partial application][5], and then on the concept of a [closure][8] - a beautiful technique for implementing lexically scoped name bindings in a language that has support for first class functions (such as JavaScript!).

<a name="everything-is-a-service"></a>
## Everything is a service

At around [17:40][102] Daniel then turned to the [Getting Started][9] area of Capire, and in particular the [Services][11] section of the [Best Practices][10] topic, where he turns around "When all you have is a hammer, every (thing) is a nail" into "Everything (in CAP) is a service".

In contrast to the "hammer and nail" adage, this axiom is something positive here, something which follows the pattern of uniformity and the elevation of abstraction, in that via CAP's adoption of [Hexagonal Architecture][12] the heavy lifting done by the adapters is hidden and of little importance to the application or service developer ... except that (as we see later) that developer can interact with and extend the database connection mechanism as easily and as readily as with their own domain services.

In digging into this, and thinking about lower level facilities abstracted upwards as services, and binding in the related idea ([captured in Part 2][12]) that "everything is an event", Daniel made this statement:

> "The sum of all your event handlers registered with the service ... is your implementation."

That goes for both local and remote events as well as local and remote services, plus built-in services ... such as a database service, as illustrated in the [Extensible Framework][13] section:

```javascript
cds.db .before ('*', req => {
  console.log (req.event, req.target.name)
})
```

and also the [Calesi][14] services. And this approach allows us as developers ... to "not care". In the best possible way.

This thinking, this approach, is inspired by Smalltalk's concept of "messaging", in that objects send and receive messages, and of course the receipt of a message is ... an event (upon which event-handling code - which we can think of as an indirect method - is executed).

Daniel goes on to explain Smalltalk's [#doesNotUnderstand][15] mechanism which can be effectively turned into a proxy for other services. This idiom is also present in other languages, for example Ruby, in the form of the [method_missing][16] method[<sup>1</sup>](#footnote-1).

## The REPL

At around [27:00][103] Daniel opens the REPL, and explains how the set of built-in REPL commands (that begin with a period):

```log
Type ".help" for more information.
> .help
.break    Sometimes you get stuck, this gets you out
.clear    Alias for .break
.editor   Enter editor mode
.exit     Exit the REPL
.help     Print this help message
.load     Load JS from a file into the REPL session
.save     Save all evaluated commands in this REPL session to a file
```

can be extended, with the REPL started with `cds repl` we also have `.inspect` and `.run`:

```log
Welcome to cds repl v 8.5.1
> .help
.break     Sometimes you get stuck, this gets you out
.clear     Alias for .break
.editor    Enter editor mode
.exit      Exit the REPL
.help      Print this help message
.inspect   Sets options for util.inspect, e.g. `.inspect .depth=1`.
.load      Load JS from a file into the REPL session
.run       Runs a cds server from a given CAP project folder, or module name like @capire/bookshop.
.save      Save all evaluated commands in this REPL session to a file
```

We'll come back to `.inspect` and `.run` [later](#more-on-the-repl).

## Lazy loading of the cds facade's many features

In highlighting that the `cds` object is also available, Daniel takes the opportunity to show how the `cds` object, as a front-door facade to everything in the runtime that you might need, is implemented, in `@sap/cds/lib/index.js`. Not only are [super] getters involved, but also the general "lazy loading" effect of said getters is used to great effect - a more rapid startup of the server.

Here's a [simple example][25] of that lazy loading, based on a simple object definition that looks like this:

```javascript
const thing = {
    name: "Life",
    get number() { console.log("in getter"); return 42; }
} 
```

Look at the results of each of the REPL's eager evaluations:

* the object itself is shown as `{ name: 'Life', number: [Getter]}`
* the value of the `name` property is immediately available (`Life`)
* the value of `number` is not yet available (we are just shown `[Getter]`)
* `number`'s value is only resolved when explicitly requested - only then does it cause the function to be executed

As the [MDN docu for `get` states][26]: "The get syntax binds an object property to a function _that will be called when that property is looked up_. It can also be used in classes" (emphasis mine):

![lazy loading with getter][24]

I mentioned in passing this was like a [thunk][27], which is similar, in that it is a mechanism "primarily used to delay a calculation until its result is needed", the concept of which goes back to ALGOL 60.

<a name="more-on-the-repl"></a>
## More on the REPL

Daniel demonstrated the getter-powered lazy loading effect with the `cds` object, by requesting the `env` property, which is lazily defined in `@sap/cds/lib/index.js`[<sup>2</sup>](#footnote-2) like this:

```javascript
get env() { return super.env = require('./env/cds-env').for('cds',this.root) }
```

This caused the inspected `cds` object to "grow" with the just-evaluated `env` property.

### The .inspect command

And at [31:32][104] this is where the `cds repl`'s `.inspect` command comes in, as it allows you to limit the depth to which nested objects will be displayed. Incidentally, if you take a look at the source code for the `.inspect` command, you'll see a strong FP influence with the use of [head and tail][28], the yin-yang pair of building blocks of [recursion and list machinery][29]. And while you're looking at that source code (in `@sap/cds-dk/bin/repl.js`), note that the default inspect depth ... is also a [Schnapszahl][30]:

```javascript
inspect.defaultOptions.depth = 11
```

### The .run command

A minute later at [32:32][105] Daniel then moved on to demonstrate the other additional command, `.run`, which uses `cds.test()` behind the scenes. It is "cap-monorepo-aware" in that one can reference services in subdirectories, like this:

```log
.run cap/samples/bookshop
```

and this will start a CAP server up pretty much in the same way as we're used to with `cds watch` for example.

> If you want to follow along with this exploration, see the [Appendix - setting up a test environment](#appendix1).

<a name="repl-global-values"></a>
What's more, though, is that it will also automatically expose REPL-global values representing important aspects of your service and the services upon which it relies:

```log
from cds.entities: {
    Books,
    Authors,
    Genres,
}
from cds.services: {
    db,
    AdminService,
    CatalogService,
    UserService,
}

Simply type e.g. Books or db in the prompt to use the respective objects.
```

These values can be combined, as Daniel showed, like this:

```log
> CatalogService.read(Books)
Query {
  SELECT: { from: { ref: [ 'sap.capire.bookshop.Books' ] } }
}
```

This example produces a query, which is a first class citizen (taking direction again from FP, just in this case we're dealing with queries, not functions) that can be stored:

```log
> q = CatalogService.read(Books)
Query {
  SELECT: { from: { ref: [ 'sap.capire.bookshop.Books' ] } }
}
```

modified:

```log
> q.where({ID:201})
Query {
  SELECT: {
    from: { ref: [ 'sap.capire.bookshop.Books' ] },
    where: [ { ref: [ 'ID' ] }, '=', { val: 201 } ]
  }
}
```

and (eventually) executed, via `await`, which executes `cds.run`:

```log
> await q
[
  {
    createdAt: '2024-12-10T17:26:39.236Z',
    createdBy: 'anonymous',
    modifiedAt: '2024-12-10T17:26:39.236Z',
    modifiedBy: 'anonymous',
    ID: 201,
    title: 'Wuthering Heights',
    descr: `Wuthering Heights, Emily Brontë's only novel, was published in 1847 under the pseudonym "Ellis Bell". It was written between October 1845 and June 1846. Wuthering Heights and Anne Brontë's Agnes Grey were accepted by publisher Thomas Newby before the success of their sister Charlotte's novel Jane Eyre. After Emily's death, Charlotte edited the manuscript of Wuthering Heights and arranged for the edited version to be published as a posthumous second edition in 1850.`,
    author_ID: 101,
    genre_ID: 11,
    stock: 12,
    price: 11.11,
    currency_code: 'GBP'
  }
]
```

But - `await q` - how did that even work?! Perhaps a topic for another post? Let me know.

### Interacting with the database service

At around [37:27][106], going back to the "everything is a service" axiom, Daniel demonstrated that the database connection is indeed a service, and can be extended and manipulated just like any other service, as discussed before. How? By injecting a handler, like this:

```javascript
cds.db.before('*', console.log)
```

This is very similar to the example in the [earlier part of this post](#everything-is-a-service); what's interesting here is the use of the raw reference to `console.log`. Why does that work, and why is it interesting?

It's interesting because it is another neat example of how JavaScript elevates functions to the same level as other values, values that can be stored and even passed as arguments into, or received as output from, other functions. It works because what's expected in this parameter position to a `before` call is indeed a function; the previous example looks like this:

```javascript
cds.db .before ('*', req => {
  console.log (req.event, req.target.name)
})
```

and the actual call to `console.log` was inside the body of a lambda[<sup>1</sup>](#footnote-1), an anonymous function definition, defined here using the ES6 fat arrow syntax[<sup>3</sup>](#footnote-3): `req => { console.log (req.event, req.target.name) }`. Same type of value - a function.

As a brief aside, note that the first example here was `cds.db.before()`, typed manually and in a hurry into the REPL, which differs from `cds.db .before()` [in the example from the documentation shown earlier](#everything-is-a-service) only in syntatic (or is that perhaps "literate"?) whitespace that Daniel likes to sprinkle on his code to make it read more like a human language. Different again is this: `db.before()`, possible because of the [REPL-global](#repl-global-values) names set up by the `.run` command we saw earlier.

_Got up to 38:38_.


---

<a name="footnotes"></a>
## Footnotes

<a name="footnote-1"></a>
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

<a name="footnote-2"></a>
2. This is with `@sap/cds` version 8.5.1 at the time of writing.

<a name="footnote-3"></a>
3. Properly called [Arrow function expressions][32].

---

<a name="appendix1"></a>
## Appendix - setting up a test environment

If you want to set up a test environment exactly like the one used for this post, specifically the REPL illustrations, then you can. I do most things in containers, and I have different container images representing CAP Node.js at different versions. For the illustration in this blog post I am using CDS 8.5.1 with Node.js major version 22.

First, download the CAP image builder, build the base image and an 8.5.1 specific version:

```shell
git clone https://github.com/qmacro/cap-con-img && cd cap-con-img
./buildbase && ./buildver 8.5.1
```

Now start up a temporary container based on that image:

```shell
docker run --rm -it cap-8.5.1 bash
```

This will give you a Bash shell prompt:

```shell
node ➜ ~
$
```

Now, in that shell, you can clone the [cloud-cap-samples][31] repo to enjoy the structured set of services:

```shell
git clone https://github.com/SAP-samples/cloud-cap-samples \
  && cd cloud-cap-samples
```

After installing the dependencies:

```shell
npm install
```

you can start the REPL:

```shell
cds repl
```

which will give you the prompt you're looking for:

```log
Welcome to cds repl v 8.5.1
>
```

where you can start to experiment with:

```shell
.run bookshop
```

which will produce something like this:

```log
[cds] - loaded model from 5 file(s):

  bookshop/srv/user-service.cds
  bookshop/srv/cat-service.cds
  bookshop/srv/admin-service.cds
  bookshop/db/schema.cds
  node_modules/@sap/cds/common.cds

[cds] - connect to db > sqlite { url: ':memory:' }
  > init from bookshop/db/init.js
  > init from bookshop/db/data/sap.capire.bookshop-Genres.csv
  > init from bookshop/db/data/sap.capire.bookshop-Books.texts.csv
  > init from bookshop/db/data/sap.capire.bookshop-Books.csv
  > init from bookshop/db/data/sap.capire.bookshop-Authors.csv
/> successfully deployed to in-memory database.

[cds] - using auth strategy {
  kind: 'mocked',
  impl: 'node_modules/@sap/cds/lib/srv/middlewares/auth/basic-auth'
}

[cds] - using new OData adapter
[cds] - serving AdminService { impl: 'bookshop/srv/admin-service.js', path: '/admin' }
[cds] - serving CatalogService { impl: 'bookshop/srv/cat-service.js', path: '/browse' }
[cds] - serving UserService { impl: 'bookshop/srv/user-service.js', path: '/user' }

[cds] - server listening on { url: 'http://localhost:46025' }
[cds] - launched at 12/10/2024, 5:26:38 PM, version: 8.5.0, in: 887.147ms
[cds] - [ terminate with ^C ]

------------------------------------------------------------
Following are made available as repl globals:

from cds.entities: {
  Books,
  Authors,
  Genres,
}
from cds.services: {
  db,
  AdminService,
  CatalogService,
  UserService,
}

Simply type e.g. Books or db in the prompt to use the respective objects.

>
```

whereupon you're ready to explore as we do in this post.




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
[25]: https://asciinema.org/a/694256
[26]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
[27]: https://en.wikipedia.org/wiki/Thunk
[28]: https://qmacro.org/blog/posts/2015/10/19/my-journey-to-clojure/
[29]: https://qmacro.org/blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/
[30]: /blog/posts/2024/11/22/tasc-notes-part-2/
[31]: /blog/posts/2024/11/29/tasc-notes-part-3/#cloudcapsamples
[32]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

[98]: https://www.youtube.com/watch?v=kwxvyiC-6FI
[99]: /blog/posts/2024/12/06/the-art-and-science-of-cap/

[101]: https://www.youtube.com/live/kwxvyiC-6FI?t=780
[102]: https://www.youtube.com/live/kwxvyiC-6FI?t=1060
[103]: https://www.youtube.com/live/kwxvyiC-6FI?t=1620
[104]: https://www.youtube.com/live/kwxvyiC-6FI?t=1892
[105]: https://www.youtube.com/live/kwxvyiC-6FI?t=1952
[106]: https://www.youtube.com/live/kwxvyiC-6FI?t=2246
