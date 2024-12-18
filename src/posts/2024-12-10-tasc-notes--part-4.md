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

At around [13:18][101] Daniel brought up a slide deck from one of my talks on Functional Programming, [Functional programming introduction: What, why, how?][2] and the person in the photo on slide four is of course [John McCarthy][3] (well done VJ), father of Lisp.

In this context we also touched on [currying][4] (which incidentally is named after [Haskell Curry][6], after whom the pure FP language [Haskell][7] is also named) and [partial application][5], and then on the concept of a [closure][8] - a beautiful technique for implementing lexically scoped name bindings in a language that has support for first class functions (such as JavaScript!).

<a name="everything-is-a-service"></a>
## Everything is a service

At around [17:40][102] Daniel then turned to the [Getting Started][9] area of Capire, and in particular the [Services][11] section of the [Best Practices][10] topic, where he turns around "When all you have is a hammer, every (thing) is a nail" into "Everything (in CAP) is a service".

In contrast to the "hammer and nail" adage, this axiom is something positive here, something which follows the pattern of uniformity and the elevation of abstraction, in that via CAP's adoption of [Hexagonal Architecture][12] the heavy lifting done by the adapters is hidden and of little importance to the application or service developer ... except that (as we see [later](#interacting-with-the-database-service)) that developer can interact with and extend the database connection mechanism as easily and as readily as with their own domain services.

In digging into this, and thinking about lower level facilities abstracted upwards as services, and binding in the related idea ([captured in Part 2][12]) that "everything is an event", Daniel made this statement:

> "The sum of all your event handlers registered with the service ... is your implementation."

That goes for both local and remote events as well as local and remote services, plus built-in services ... such as a database service, as illustrated in Capire's [Extensible Framework][13] section:

```javascript
cds.db .before ('*', req => {
  console.log (req.event, req.target.name)
})
```

and also the [Calesi][14] services. And this approach allows us as developers ... to "not care". In the best possible way.

This thinking, this approach, is inspired by Smalltalk's concept of "messaging", in that objects send and receive messages, and of course the receipt of a message is ... an event (upon which event-handling code - which we can think of as an indirect method - is executed).

Daniel goes on to explain Smalltalk's [#doesNotUnderstand][15] mechanism which can be effectively turned into a proxy for other services. This idiom is also present in other languages, for example Ruby, in the form of the [method_missing][16] construct[<sup>1</sup>](#footnote-1).

<a name="the-repl"></a>
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

can be extended.

With the REPL started via `cds repl` we also have CAP specific commands `.inspect` and `.run`:

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

<a name="lazy-loading-of-the-cds-facades-many-features"></a>
## Lazy loading of the cds facade's many features

In highlighting that the `cds` object is also available in the REPL, Daniel takes the opportunity to show how the `cds` object -- as a front-door facade to everything in the runtime that you might need -- is implemented (in `@sap/cds/lib/index.js`). Not only are [super][23] getters involved, but also the general "lazy loading" effect of those getters is used to great effect - a more rapid startup of the server.

Here's a [basic example][25] of that lazy loading, based on a simple object definition that looks like this:

```javascript
const thing = {
    name: "Life",
    get number() { console.log("in getter"); return 42; }
} 
```

In the illustration below, look at the results of each of the REPL's eager evaluations (the values that the REPL shows even before you press Enter):

* the object itself is shown as `{ name: 'Life', number: [Getter]}`
* the value of the `name` property is immediately available (`Life`)
* the value of `number` is not yet available (we are just shown `[Getter]`)
* `number`'s value is only resolved when explicitly requested - only then does it cause the function to be executed

![lazy loading with getter][24]

As the [MDN docu for `get` states][26]: "The get syntax binds an object property to a function _that will be called when that property is looked up_. It can also be used in classes" (emphasis mine).

I mentioned in passing this was like a [thunk][27], which is similar, in that it is a mechanism "primarily used to delay a calculation until its result is needed", the concept of which goes back to ALGOL 60.

<a name="more-on-the-repl"></a>
## More on the REPL

Daniel demonstrated the getter-powered lazy loading effect with the `cds` object, by requesting the `env` property, which is lazily defined in `@sap/cds/lib/index.js`[<sup>2</sup>](#footnote-2) like this:

```javascript
get env() { return super.env = require('./env/cds-env').for('cds',this.root) }
```

This caused the inspected `cds` object to "grow" with the just-evaluated `env` property.

<a name="the-inspect-command"></a>
### The .inspect command

And at [31:32][104] this is where the `cds repl`'s `.inspect` command comes in, as it allows you to limit the depth to which nested objects will be displayed. Incidentally, if you take a look at the source code for the `.inspect` command, you'll see a strong FP influence with the use of [head and tail][28], the yin-yang pair of building blocks of [recursion and list machinery][29]. And while you're looking at that source code (in `@sap/cds-dk/bin/repl.js`), note that the default inspect depth ... is also a [Schnapszahl][30]:

```javascript
inspect.defaultOptions.depth = 11
```

<a name="the-run-command"></a>
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

<a name="await"></a>
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

<a name="interacting-with-the-database-service"></a>
### Interacting with the database service

At around [37:10][106], going back to the "everything is a service" axiom, Daniel demonstrated that the database connection is indeed a service, and can be extended and manipulated just like any other service, as discussed before. How? Well, for example, by injecting a handler, like this:

```javascript
cds.db.before('*', console.log)
```

This is very similar to the example in the [earlier part of this post](#everything-is-a-service); what's interesting here is the use of the raw reference to `console.log`. Why does that work, and why is it interesting?

Well, it's interesting because it is another neat example of how JavaScript elevates functions to the same level as other values, values that can be stored and even passed as arguments into, or received as output from, other functions. It works because what's expected in this parameter position to a `before` call is indeed a function; the previous example looks like this:

```javascript
cds.db .before ('*', req => {
  console.log (req.event, req.target.name)
})
```

and the actual call to `console.log` was inside the body of a lambda[<sup>1</sup>](#footnote-1), an anonymous function definition, defined here using the ES6 fat arrow syntax[<sup>3</sup>](#footnote-3): 

```javascript
req => { console.log (req.event, req.target.name) }
```

Same type of value - a function.

As a brief aside, note that the first example here was `cds.db.before()`, typed manually and in a hurry into the REPL, which differs from `cds.db .before()` [in the example from the documentation shown earlier](#everything-is-a-service) only in syntatic (or is that perhaps "literate"?) whitespace that Daniel likes to sprinkle on his code to make it read more like a human language. Different again is this: `db.before()`, possible because of the [REPL-global](#repl-global-values) names set up by the `.run` command we saw earlier.

<a name="the-core-of-the-cap-framework"></a>
## The core of the CAP framework

At around [38:38][107] Daniel use `.inspect` to look at the handlers - the _event_ handlers - for the `db` service: 

![db event handlers][33]

which show the logging function just registered, plus framework handlers for standard persistence layer operations.

This then led to the uncovering of the effective core of the framework, in `@sap/cds/lib/srv.Service.js` (which I'm sure some of you may recognise, having debugged through this when working with our own handlers and when & how they're called):

![framework core][34]

<a name="back-to-the-future"></a>
## Back to the future

Shortly after this, around [44:15][108], Daniel switches to Capire's [What is CAP?][35] section and points out the anonymous quote:

> "CAP is like ABAP for the non-ABAP world"

which causes both Daniel and me to reminisce and indulge in a bit of (well deserved) heavy praise for ABAP and the supporting cast of components and infrastructure, which of course includes:

* the [logical databases and corresponding database read programs][44] that formed the framework and support for the early versions of ABAP as a report writing language (`GET KNA1` anyone?) in R/2
* the architecture of R/3's disp+work process tree with the different work process role types[<sup>4</sup>](#footnote-4) (including the "Verbucher", or "Update Task"), and also how things were structured inside each work process (with the TSKH task handler, DYNP dynpro processor and ABAP language processor)

More philosophising brought us on to the topic of low-code computing, where Daniel mentioned that he'd heard someone claim that the best end-user development tool ... was Excel (which, incidentally, I would posit as a predominantly _event oriented_ programming platform too). Talking of Excel, if you are a fan of the annual December programming competition [Advent of Code][36], then you might want to check out some of the solutions ... [written in Excel][37]!

<a name="the-magic-is-that-there-is-no-magic"></a>
## The magic is that there is no magic

At around [47:50][109] Daniel demonstrates another example of how the REPL allows us to explore CAP as close to the inside of the framework as we can, and improve our understanding of how it really ticks. And, as Daniel said, "fasten your seatbelts!". Here's what happened[<sup>2</sup>](#footnote-2).

First, Daniel created a service[<sup>5</sup>](#footnote-5), following the [simplest thing that could possibly work][38] approach, i.e. what was produced was "just an event handler registry":

```log
> (srv = new cds.Service)
Service {
  _handlers: { _initial: [], before: [], on: [], after: [], _error: [] },
  name: 'Service',
  options: {}
}
```

Then, he sent a simple request initially synchronously, receiving a Promise:

```log
> srv.send('foo',{bar:11})
Promise {
  <pending>,
  [Symbol(async_id_symbol)]: 53,
  [Symbol(trigger_async_id_symbol)]: 6
}
```

To have such a Promise resolved, Daniel then of course did the same thing but in the context of an `await`, and got ... nothing (well, technically, just no output):

```log
> await srv.send('foo',{bar:11})
>
```

Why? Because the server doesn't have a handler for the `foo` event that is being sent.

So he defines one:

```log
> srv.on('foo', console.log)
Service {
  _handlers: {
    _initial: [],
    before: [],
    on: [ EventHandler { on: 'foo', handler: [Function: log] } ],
    after: [],
    _error: []
  },
  name: 'Service',
  options: {}
}
```

Looking at what is emitted as output from this call to `srv.on` here, note how this event handler is indeed registered (this is the "event registry" after all) in the `on` property. Note also that the same simple technique as earlier is being used here for simplicity: a reference to the function `console.log` as the argument to the handler parameter.

Making the call again now causes that registered handler to be invoked:

```log
> await srv.send('foo',{bar:11})
Request { method: 'foo', data: { bar: 11 } } [AsyncFunction: next]
>
```

This `Request` is essentially -- and actually -- an _event message_!

But perhaps the biggest takeaway from this REPL demo is that what Daniel, Capire and the team is saying about CAP being all about events and services, uniform and abstract, is not only true, but also free of any real complexity underneath. The basic mechanism of the framework is simple and straightforward. There's no magic, it's just events, registries and handlers [all the way down][39].

<a name="tight-loops-design-time-affordances-and-service-integration"></a>
## Tight loops, design time affordances and service integration

Some of CAP's driving principles -- with developers in focus -- are described in Capire's [Jumpstart & Grow As You Go...][40] section. The nirvana of a fast inner development loop is achieved through various design time affordances, one of which Daniel demonstrated at around [49:15][110]: the automatic mocking of external services when required.

Using the [cloud-cap-samples][31] repo again, Daniel started the "Bookstore" (with `cds w bookstore`) and the CAP server output included these lines:

```log
[cds] - connect using bindings from: { registry: '~/.cds-services.json }
[cds] - connect to db > sqlite { url: ':memory:' }
[cds] - connect to messaging > file-based-messaging
[cds] - using new OData adapter
[cds] - mocking ReviewsService { impl: 'reviews/srv/reviews-service.js', path: '/reviews' }
[cds] - mocking OrdersService { impl: 'orders/srv/orders-service.js', path: '/odata/v4/orders' }
[cds] - serving CatalogService { impl: 'bookshop/srv/cat-service.js', path: '/browse' }
[cds] - serving AdminService { impl: 'bookshop/srv/admin-service.js', path: '/admin' }
[cds] - serving UserService { impl: 'bookshop/srv/user-service.js', path: '/user' }
[cds] - serving DataService { impl: 'data-viewer/srv/data-service.js', path: '/odata/v4/-data' }
```

The "Bookstore" app uses the "Reviews" Service as shown in the diagram:

![samples][42]

and as defined in [`cloud-cap-samples/bookstore/srv/mashup.cds`][41]:

```cds
using { ReviewsService.Reviews } from '@capire/reviews';
```

And because at this point the "Reviews" service isn't running, and (more importantly) there isn't a service binding for any such remote service, the CAP server will automatically mock it.

What gives us a glimpse under the hood of this mechanism is when Daniel actually _starts_ the "Reviews" service too, in a separate window, with `cds w reviews`, whereupon we see these lines in that second CAP server's output:

```log
[cds] - serving ReviewsService { impl: 'reviews/srv/reviews-service.js', path: '/reviews' }
[cds] - server listening on { url: 'http://localhost:4005' }
```

But more importantly, we can see that when the "Bookstore" is restarted, the "Reviews" service is no longer mocked, because now a service binding for it was found, in the context of Daniel's development environment.

The result is that instead of this line appearing in the "Bookstore" CAP server log output:

```log
[cds] - mocking ReviewsService { impl: 'reviews/srv/reviews-service.js', path: '/reviews' }
```

what we get now is this:

```log
[cds] - connect to ReviewsService > odata { url: 'http://localhost:4005/reviews' }
```

How does this design time binding machinery management work? Well, it's based on a developer-local configuration file that the CAP server(s) share. And if we look carefully at the original log output from the "Bookstore" CAP server, we see this line, which tells us what that file is called and where it is:

```log
[cds] - connect using bindings from: { registry: '~/.cds-services.json }
```

When a CAP server starts up, in design time mode (e.g. via `cds watch`), it writes binding information for services that it _provides_, into this `~/.cds-services.json` file. And when a CAP server starts up and knows it needs a connection to a remote service, via a service binding, and is also in design time mode, it will look in this same file to see what is being provided already, and use that information if it exists.

Such a simple concept, beautifully executed.

If you're curious, this is the sort of information that is stored, for running CAP services in design time mode, in the `~/.cds-services.json` file:

```json
{
  "cds": {
    "provides": {
      "ReviewsService": {
        "kind": "odata",
        "credentials": {
          "url": "http://localhost:4005/reviews"
        }
      }
    }
  }
}
```

This section was written to `~/.cds-services.json` by the second CAP server where the "Reviews" services was started up. Note the `provides` property pointing to the CAP server URL[<sup>6</sup>](#footnote-6). And it's read by the first CAP server looking for (design time) service binding information for that service.

### Service integration CodeJam

If you are looking to learn "more than you ever wanted to know" about service integration, including more details on this wonderful mechanism, you might want to organise or attend the [Service Integration with CAP][43] CodeJam, or if you can't make an in-person event, you can still look through the entire CodeJam content, which is all available online.

That wraps it up for the notes on this part 4, I hope you enjoyed them, and see you online!

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

For an indication of how fundamental the concept of first class functions is (along with the closely related "higher order" function style), see [Functions as first class citizens in SICP Lecture 1A][45].

<a name="footnote-2"></a>
2. Examples in this post are based on CAP Node.js version 8.5.1 (Nov 2024) rather than the 8.6.0 version that Daniel had, which is currently not available externally at the time of writing.

<a name="footnote-3"></a>
3. Properly called [Arrow function expressions][32].

<a name="footnote-4"></a>
4. `DVEBMGS00` anyone? (The `V` here is for "Verbucher" of course) :-)

<a name="footnote-5"></a>
5. I suspect that the only reason `srv = new cds.Service` was wrapped in parentheses here was because Daniel had originally intended to immediately send something to the newly created server (but still capture a reference to that server), i.e. like this: `(srv = new cds.Service).send('foo',{bar:11})` but had then decided to break it down into individual steps.

<a name="footnote-6"></a>
6. No further credential information exists here, as it's a design time only service running locally.

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
[33]: /images/2024/12/db-handlers.png
[34]: /images/2024/12/framework-core.png
[35]: https://cap.cloud.sap/docs/about/#what-is-cap
[36]: https://adventofcode.com
[37]: https://www.youtube.com/playlist?list=PLsLuABDrJ7ME3vJEOCwGZ97__ZlHFgHvp
[38]: https://creators.spotify.com/pod/show/tech-aloud/episodes/The-Simplest-Thing-that-Could-Possibly-Work--A-conversation-with-Ward-Cunningham--Part-V---Bill-Venners-e5dpts
[39]: https://en.wikipedia.org/wiki/Turtles_all_the_way_down
[40]: https://cap.cloud.sap/docs/about/#jumpstart-grow-as-you-go
[41]: https://github.com/SAP-samples/cloud-cap-samples/blob/1ea4b15d77229b238f622f9e38c8b31244d5fa04/bookstore/srv/mashup.cds#L12
[42]: https://raw.githubusercontent.com/SAP-samples/cloud-cap-samples/main/etc/samples.drawio.svg
[43]: https://github.com/SAP-samples/cap-service-integration-codejam/
[44]: /blog/posts/2003/11/13/food-for-thought-ldbs-and-abap-objects/
[45]: /blog/posts/2024/12/16/functions-as-first-class-citizens-in-sicp-lecture-1a/

[98]: https://www.youtube.com/watch?v=kwxvyiC-6FI
[99]: /blog/posts/2024/12/06/the-art-and-science-of-cap/

[101]: https://www.youtube.com/live/kwxvyiC-6FI?t=780
[102]: https://www.youtube.com/live/kwxvyiC-6FI?t=1060
[103]: https://www.youtube.com/live/kwxvyiC-6FI?t=1620
[104]: https://www.youtube.com/live/kwxvyiC-6FI?t=1892
[105]: https://www.youtube.com/live/kwxvyiC-6FI?t=1952
[106]: https://www.youtube.com/live/kwxvyiC-6FI?t=2230
[107]: https://www.youtube.com/live/kwxvyiC-6FI?t=2318
[108]: https://www.youtube.com/live/kwxvyiC-6FI?t=2655
[109]: https://www.youtube.com/live/kwxvyiC-6FI?t=2865
[110]: https://www.youtube.com/live/kwxvyiC-6FI?t=2955
