---
layout: post
title: TASC Notes - Part 5
date: 2024-12-13
tags:
  - tasc
  - cap
  - cds
  - handsonsapdev
---
These are the notes summarising what was covered in [The Art and Science of CAP part 5][2], one episode in a mini series with Daniel Hutzel to explore the philosophy, the background, the technology history and layers that support and inform the SAP Cloud Application Programming Model.

For all resources related to this series, see the post [The Art and Science of CAP][1].

This episode started with a review of the previous episode (part 4), based on the [notes for that episode][3].

<a name="new-cds-repl-options"></a>
## New cds REPL options

At around [17:30][101] Daniel introduces some of his very recent development work, adding features to the cds REPL, which we'll hopefully see in the next CAP release (update: we do indeed - see the [`cds repl` enhancements][47] of the [December 2024 release notes][48]!):

```text
-r | --run <project>
  Runs a cds server from a given CAP project folder, or module name.
  You can then access the entities and services of the running server.
  It's the same as using the repl's builtin .run command.

-u | --use <cds feature>
  Loads the given cds feature into the repl's global context. For example,
  if you specify ql it makes the cds.ql module's methods available.
  It's the same as doing {ref,val,xpr,...} = cds.ql within the repl.
```

As the description for `--run` says, it's a shortcut for starting the REPL and then issuing `.run <project>`. 

The `--use` feature is a little more intriguing, in that it will import, into the REPL's global environment, the values exported by the specified feature. Daniel shows an example for `cds.ql` which -- at least in his bleeding edge developer version -- includes new, simple utility functions `ref`, `val`, `xpr` and `expand` that make it easier to manually construct CQN representations of queries (which can otherwise be quite tricky with all the bracket notation) when working in the REPL.

Here are some examples:

```javascript
ref`foo.bar` // -> { ref: [ 'foo', 'bar' ] }
```

```javascript
val`foo.bar` // -> { val: 'foo.bar' }
```

```javascript
expand`foo.bar` // -> { ref: [ 'foo', 'bar' ], expand: [ '*' ] }
```

and even:

```javascript
expand (`foo.bar`, where`x<11`, orderBy `car`, [ ref`a`, ref`b`, xpr`a+b`])
```

which emits:

```javascript
{
    ref: [ 'foo.bar' ],
    where: [ { ref: [ 'x' ] }, '<', { val: 11 } ],
    orderBy: [ { ref: [ 'car' ] } ],
    expand: [
        { ref: [ 'a' ] },
        { ref: [ 'b' ] },
        {
            xpr: [ { ref: [ 'a' ] }, '+', { ref: [ 'b' ] } ]
        }
    ]
}
```

<a name="infix-filters"></a>
## Infix filters

While building up this example, Daniel remarks that:

> "CAP CDL has infix filters and so has CQN".

I wanted to take a moment to think about this, and dig into [Capire][45], for two reasons: 

* it was important to understood the meaning and implication of the term "infix filter" and recognise them at the drop of a hat
* these two DSLs (CDL and CQN) are, at least in my mind, orthogonal to one another in a couple of dimensions:

|CDS DSLs|Human|Machine| 
|-|-|-|
|Schema|[CDL][4]|[CSN][5]|
|Queries|[CQL][6]|[CQN][7]|

... and I was curious to understand how an infix filter would be meaninfgul across the two differing pairs of DSLs.

So I took the DSL pair for queries first, and found the [With Infix Filters][8] section (in the [CQL][6] chapter, which makes sense as it's essentially a syntactical construct for humans, not machines), which has this example:

```sql
SELECT books[genre='Mystery'].title from Authors
 WHERE name='Agatha Christie'
```

Given that the term "infix" implies "between" (as in [infix notation][9]), the `[genre='Mystery']` part is the infix filter in this example[<sup>1</sup>](#footnote-1).

But what about infix filters in CDL? Well, you can add a filter to an association, as shown in the [Association-like calculated elements][10] section of the [CDL][4] chapter with this example:

```cds
entity Employees {
  addresses : Association to many Addresses;
  homeAddress = addresses [1: kind='home'];
}
```

And still in a CDL context, but moving from defining to publishing, there's another example in the [Publish Associations with Filter][11] section:

```cds
entity P_Authors as projection on Authors {
  *,
  books[stock > 0] as availableBooks
};
```

<a name="diving-into-query-objects"></a>
## Diving into query objects

To tie this back to what Daniel was showing in the REPL, we can resolve the CQL example above (looking for an author's books in the "Mystery" genre) into its canonical object representation in CQN, in the REPL, using an explicit call to `cds.parse.cql` like this:

```log
> cds.parse.cql(`
... SELECT books[genre='Mystery'].title
... from Authors
... where name='Agatha Christie'
... `)
{
  SELECT: {
    from: { ref: [ 'Authors' ] },
    columns: [
      {
        ref: [
          {
            id: 'books',
            where: [ { ref: [ 'genre' ] }, '=', { val: 'Mystery' } ]
          },
          'title'
        ]
      }
    ],
    where: [ { ref: [ 'name' ] }, '=', { val: 'Agatha Christie' } ]
  }
}
```

Alternatively, and steering us back on track, we can use the literate-style "query building" functions similar to what Daniel did in the subsequent `SELECT` call (around [21:43][102]), like this:

```log
> SELECT `books[genre='Mystery'].title` .from `Authors` .where `name='Agatha Christie'`
Query {
  SELECT: {
    from: { ref: [ 'Authors' ] },
    columns: [
      {
        ref: [
          {
            id: 'books',
            where: [ { ref: [ 'genre' ] }, '=', { val: 'Mystery' } ]
          },
          'title'
        ]
      }
    ],
    where: [ { ref: [ 'name' ] }, '=', { val: 'Agatha Christie' } ]
  }
}
```

<a name="trying-out-an-infix-filter"></a>
### Trying out an infix filter

To complete the circle and also experience for myself how it feels to instantiate queries and run them in the REPL, I took this same CQL infix example:

```sql
SELECT books[genre='Mystery'].title from Authors
 WHERE name='Agatha Christie'
```

... and constructed an equivalent query on the Northbreeze dataset[<sup>2</sup>](#footnote-2). Doing that helped me think about what is going on in this query, which is the traversal of a relationship (`Authors -> books`) with a restriction on the destination entity (via an infix filter) as well as on the source entity.

Here's that equivalent query:

```sql
SELECT Products[Discontinued=false].ProductName from northbreeze.Suppliers
 WHERE CompanyName='Tokyo Traders'
```

And here it is being constructed:

```log
> q1 = cds.parse.cql(`
... SELECT Products[Discontinued=false].ProductName
... from northbreeze.Suppliers
... WHERE CompanyName='Tokyo Traders'
... `)
{
  SELECT: {
    from: { ref: [ 'northbreeze.Suppliers' ] },
    columns: [
      {
        ref: [
          {
            id: 'Products',
            where: [ { ref: [ 'Discontinued' ] }, '=', { val: false } ]
          },
          'ProductName'
        ]
      }
    ],
    where: [ { ref: [ 'CompanyName' ] }, '=', { val: 'Tokyo Traders' } ]
  }
}
```

<a name="executing-queries"></a>
### Executing Queries

Note that what's produced here is a query object (in CQN) but not something that is immediately `await`-able (see [the notes from part 4][18]).

This is in contrast to the query object that is produced from the literate query building approach which looks like this, with an assignment to `q2`[<sup>3</sup>](#footnote-3):

```log
q2 = SELECT
 .columns(`Products[Discontinued=false].ProductName`)
 .from `northbreeze.Suppliers`
 .where `CompanyName='Tokyo Traders'`
```

This produces the same CQN object ... but wrapped within a `Query` object:

```log
Query {
  SELECT: {
    columns: [
      {
        ref: [
          {
            id: 'Products',
            where: [ { ref: [ 'Discontinued' ] }, '=', { val: false } ]
          },
          'ProductName'
        ]
      }
    ],
    from: { ref: [ 'northbreeze.Suppliers' ] },
    where: [ { ref: [ 'CompanyName' ] }, '=', { val: 'Tokyo Traders' } ]
  }
}
```

To execute the first query object, we must pass it to `cds.run`:

```log
> await cds.run(q1)
[
  { Products_ProductName: 'Ikura' },
  { Products_ProductName: 'Longlife Tofu' }
]
```

but the `Query`-wrapped CQN object is directly `await`-able:

```log
> await q2
[
  { Products_ProductName: 'Ikura' },
  { Products_ProductName: 'Longlife Tofu' }
]
```

<a name="the-odata-v4-equivalent"></a>
### The OData V4 equivalent

If you're curious to understand how this query might be represented in OData, and see the data for yourself, [here's the corresponding query operation][19], shown here[<sup>4</sup>](#footnote-4) with extra whitespace to make it easier to read:

```url
https://developer-challenge.cfapps.eu10.hana.ondemand.com
  /odata/v4/northbreeze
  /Suppliers
  ?$expand=Products(
    $select=ProductName;
    $filter=Discontinued eq false
  )
  &$filter=CompanyName eq 'Tokyo Traders'
```

This query produces this entityset result:

```json
{
  "@odata.context": "$metadata#Suppliers(Products(ProductName,ProductID))",
  "value": [
    {
      "SupplierID": 4,
      "CompanyName": "Tokyo Traders",
      "ContactName": "Yoshi Nagase",
      "ContactTitle": "Marketing Manager",
      "Address": "9-8 Sekimai Musashino-shi",
      "City": "Tokyo",
      "Region": "NULL",
      "PostalCode": "100",
      "Country": "Japan",
      "Phone": "(03) 3555-5011",
      "Fax": "NULL",
      "HomePage": "NULL",
      "Products": [
        {
          "ProductID": 10,
          "ProductName": "Ikura"
        },
        {
          "ProductID": 74,
          "ProductName": "Longlife Tofu"
        }
      ]
    }
  ]
}
```

<a name="cql-sql"></a>
### CQL > SQL

Wrapping up this section, Daniel highlights a couple of the major enhancements to SQL that are in CQL:

* associations and path expressions
* nested projections

And this caused me to [stare][22] a little bit more at the examples, such as this one:

```sql
SELECT.from`foo.bar[where x<11 order by car]{ a, b, a + b}`
```

This underlines the _abstract_ nature of CQL: have you noticed that we have been constructing CQN objects -- query objects -- with no relation (no pun intended) to real metadata? The query objects produced make little sense in that there _is no_ `foo.bar`, there _is no_ `x` or `car`[<sup>5</sup>](#footnote-5), and so on.

But that is irrelevant when working at the abstract level of the CQL/CQN DSL pairing, because it's only when the query object is sent to a database service that it gets translated into something "real". And that is something quite beautiful.

<a name="composite-services-and-mashups"></a>
## Composite services and mashups

At around [24:15][103] Daniel picks up a thread from a previous episode in this series, and explains more about how mixins, from Aspect Oriented Programming, can be used to flatten hierarchies and bring independent services together to form a composite application.

How? By mashing up the services using the aspect-based power of CDL.

In the [cloud-cap-samples][25] repo, there are various CAP services in separate directories, such as `bookshop` and `reviews`.

There's also `bookstore` which is a composite of those two services. To have these services know about each other, the NPM [workspace][25] concept is used, in that the root `package.json` file includes:

```json
"workspaces": [
    "./bookshop",
    "./bookstore",
    "./common",
    "./data-viewer",
    "./fiori",
    "./hello",
    "./media",
    "./orders",
    "./loggers",
    "./reviews"
]
```

Note that `@capire/bookshop` and `@capire/reviews`, both available via this workspace concept in their respective directories, are declared as dependencies in `bookstore`'s [package.json][29] file:

```json
{
  "name": "@capire/bookstore",
  "version": "1.0.0",
  "dependencies": {
    "@capire/bookshop": "*",
    "@capire/reviews": "*",
    "...": "*"
  },
  "...": "..."
}
```

With that established, and via `bookstore`'s [index.cds][27] file:

```cds
namespace sap.capire.bookshop; //> important for reflection
using from './srv/mashup';
```

we get to [srv/mashup.cds][28] which is enlightening. Here's one section of it:

```cds
using { sap.capire.bookshop.Books } from '@capire/bookshop';
using { ReviewsService.Reviews } from '@capire/reviews';
extend Books with {
  reviews : Composition of many Reviews on reviews.subject = $self.ID;
  rating  : type of Reviews:rating; // average rating
  numberOfReviews : Integer @title : '{i18n>NumberOfReviews}';
}
```

This is the heart of the mashup, and very similar to the one illustrated in [Flattening the hierarchy with mixins][24], where the `Books` entity from `@capire/bookshop`, is mashed up with the `Reviews` entity from `@capire/reviews`. Note that both these services are independent, neither of them know about each other, and neither is "owned" by `bookstore`.

But in the _mashup context_ that doesn't matter, and the aspect oriented modelling is what makes this both possible, and indeed simple. After a formal introduction (`using`...) they are wired together in a single line of code declaring the `Composition`.

Like a dating service for domain entities.

<a name="local-and-remote-services"></a>
## Local and remote services

At around [28:21][104], given this mashup, Daniel walks us through how these services interact with each other specifically at _design time_ with `cds watch`[<sup>6</sup>](#footnote-6).

This is a great reminder of what we covered in the previous part, which you can find summarised in the [Tight loops, design time affordances and service integration][30] section of the previous episode's notes. Here, `ReviewsService` and `OrdersService` are mocked at first because that CAP server is the only one running (locally, on 4004):

![mocking][31]

but when these two services are started locally too, in separate CAP servers on 4005 and 4006 respectively, a local connection to both is possible, and made:

![connecting][32]

<a name="messaging-and-grow-as-you-go"></a>
## Messaging and "grow as you go"

Once the services in this "bookstore" constellation were all up and running, and Daniel had resolved the authorisation issue with a small but precise golden hammer, specificially and temporarily commenting out this `reject`, in `restrict.js` within the `libx/_runtime/common/generic/auth/` section of `@sap/cds` (don't do this at home, kids!):

```javascript
  const restrictedCount = await _getRestrictedCount(req, this.model, resolvedApplicables)
  if (restrictedCount < unrestrictedCount) {
    reject(req, getRejectReason(req, '@restrict', definition, restrictedCount, unrestrictedCount))
  }
```

... it was time to become familiar with inter-service messaging. Which just works, out of the box, with zero configuration, in CAP's classic [grow as you go][33] approach to making the lives of developers, especially in design time, as easy as possible. 

When Daniel entered a review on the [Vue.js][34] based frontend served by the CAP server serving `ReviewsService` on 4005, we saw in the logs of that CAP server something like this:

```log
< emitting: reviewed { subject: '201', count: 2, rating: 4.5 }
```

and in the logs of the CAP server on 4004, we saw a corresponding message something like this:

```log
> received: reviewed { subject: '201', count: 2, rating: 4.5 }
```

This is such a great example of "[the simplest thing that could possibly work][35]", and indeed it works _very_ well! At design time, you get messaging out of the box powered by a file-based mechanism, as we can see from the logs:

```log
[cds] - connect to messaging > file-based-messaging
```

and that file (that Daniel and I were trying to remember the name of) is `.cds-msg-box`. Like `.cds-services.json`, it is a design time only artifact:

* hidden (starts with a `.`)
* in the developer user's home directory (`~/`)

When emitting and receiving is working as planned, this file is normally empty. To look what gets written to it, you have to stop the receiver (so that the messages are not consumed) and take a look. Stopping the "bookstore" CAP server on 4004, and then creating another review, causes, as expected, another record to be written to the log of the `ReviewsService` CAP server on 4005, like this:

```log
< emitting: reviewed { subject: '207', count: 2, rating: 2 }
```

Inside the `~/.cds-msg-box` is an event record that looks like this:

```log
ReviewsService.reviewed {"data":{"subject":"207","count":2,"rating":2},"headers":{"x-correlation-id":"9ad1c255-cde7-45f3-9943-7ff702691de4"}}
```

And it almost goes without saying that as soon as the CAP server on 4004 is restarted (in `watch` mode of course) that record sitting in `~/.cds-msg-box` is consumed:

```log
> received: reviewed { subject: '207', count: 2, rating: 2 }
```

<a name="exploring-agnostic-event-processing-in-the-repl"></a>
## Exploring agnostic event processing in the REPL

At around [42:04][106] Daniel doubles down on what we've just experienced in this inter-service event coordination by diving once again into the cds REPL to (ultimately) show how similar _requests_ and _events_ are in CAP.

This is reflected in the [srv.send(request)][36] and [srv.emit(event)][37] methods, but also in how Daniel described his choice of parameter names[<sup>7</sup>](#footnote-7) in handlers in this area, which I see like this:

```text
eve         The eventing "superclass" parent
 |
 +-- req    a request (synchronous request/response context)
 |
 +-- msg    a message (asynchronous event message context)
```

At the REPL prompt, he creates a couple of `cds.Service` instances, which are "just event dispatchers", and adorns each with a handler. Concisely, first here is `b`:

```log
> (b = new cds.Service).before('*', eve => console.log(eve.event, eve.data))
Service {
  _handlers: {
    _initial: [],
    before: [ EventHandler { before: '*', handler: [Function (anonymous)] } ],
    on: [],
    after: [],
    _error: []
  },
  name: 'Service',
  options: {}
}
```

The handler's function signature uses `eve` as the parameter name, to underline the point above, in that it doesn't matter whether a request (`req`) or a message (`msg`) is (sent and) received, what matters is that it's "just an event (with a small 'e') handler".

Next, `a`[<sup>8</sup>](#footnote-8):
 
```log
> (a = new cds.Service).on('some event', msg => b.send('hey see', msg))
Service {
  _handlers: {
    _initial: [],
    before: [],
    on: [
      EventHandler {
        on: 'some event',
        handler: [Function (anonymous)]
      }
    ],
    after: [],
    _error: []
  },
  name: 'Service',
  options: {}
}
```

And now for the events themselves. First, a synchronous request with `send`:

```log
> await a.send('some event', {foo:11})
hey see Request { method: 'some event', data: { foo: 11 } }
```

Now for an asynchronous message with `emit`:

```log
> await a.emit('some event', {foo:11})
hey see EventMessage { event: 'some event', data: { foo: 11 } }
```

Different! But handled in the same way.

<a name="interceptor-pattern-and-request-vs-eventmessage-handling"></a>
## Interceptor pattern and Request vs EventMessage handling

Well. Almost the same. Directly following this demonstration, at around [47:25][107], Daniel highlights a subtle but key difference, in the context of the `on` handlers, which -- for Request objects -- follow the [interceptor stack][39] pattern:

> "When processing requests, `.on(request)` handlers are _executed in sequence_ on a first-come-first-serve basis: Starting with the first registered one, each in the chain can decide to call subsequent handlers via _next()_ or not, hence breaking the chain."

The existing service `b` (in the current REPL session) currently has a single handler, specifically for the `before` phase:

```log
> .inspect b
b: Service {
  _handlers: {
    _initial: [],
    before: [ EventHandler { before: '*', handler: [Function (anonymous)] } ],
    on: [],
    after: [],
    _error: []
  },
  name: 'Service',
  options: {}
}
```

Remember that the handler itself, represented in this `.inspect` output with `[Function (anonymous)]`, is defined to be invoked on any event (`*`) and looks like this: `eve => console.log(eve.event, eve.data)`.

At this point a second handler was added, but for the `on` phase, like this (I've taken the liberty to add an extra value `"(on)"` in the `console.log` call here so we can understand things a bit better when we see the output):

```log
> b.on('xxxxx', eve => console.log(eve.event, eve.data, "(on)"))
```

Then an event was sent to `b`, with `send` (again, to make things a bit clearer -- i.e. avoid any `undefined` values being shown -- I am including a payload of `{bar:11}` here):

```log
> await b.send('xxxxx',{bar:11})
xxxxx { bar: 11 }
xxxxx { bar: 11 } (on)
```

The first log record is from the handler registered for the `before` phase (i.e. the first handler we created for `b`), and the second is the one we just registered for the `on` phase.

So far so good.

But.

After adding a _second_ on handler in a similar way, so that `b` has one `before` phase handler and two `on` phase handlers, like this:

```log
> b.on('xxxxx', eve => console.log("gotcha"))
Service {
  _handlers: {
    _initial: [],
    before: [ EventHandler { before: '*', handler: [Function (anonymous)] } ],
    on: [
      EventHandler { on: 'xxxxx', handler: [Function (anonymous)] },
      EventHandler { on: 'xxxxx', handler: [Function (anonymous)] }
    ],
    after: [],
    _error: []
  },
  name: 'Service',
  options: {}
}
```

... we _do not_ see that handler's output when transmitting another event (a request) to `b` with `send`:

```log
> await b.send('xxxxx',{car:11})
xxxxx { car: 11 }
xxxxx { car: 11 } (on)
```

However.

We _do_ see that handler's output when transmitting an event (a message) to `b` with `emit`:

```log
> await b.emit('xxxxx',{cdr:11})
xxxxx { cdr: 11 }
xxxxx { cdr: 11 } (on)
gotcha
```

What's going on, as Daniel explains, is that for synchronous requests, the interceptor pattern is honoured. In other words, for handlers in the `on` phase, if the first handler [breaks the chain][39] by _not_ calling `next()`, any subsequent handlers registered for that `on` phase are not called - the processing is deemed to be complete. And there was no `next()` call in the `on` phase handler we just defined:

```log
> b.on('xxxxx', eve => console.log(eve.event, eve.data, "(on)"))
```

Note that this rule, this interceptor stack processing, is for requests. Not messages. So when processing an event message, initiated with `emit` (rather than `send`), _every handler registered for the `on` phase gets called_. And this is why we see "gotcha", which is what the _second_ handler registered for the `on` phase outputs.

> This was a conscious decision by the CAP developers, in that it makes more sense when handling asynchronous messages to have all handlers have a chance to fire. Especially because the asynchronous context also implies there's nothing to _return_, nothing to send back, anyway (unlike when handling an incoming request, for which a response is expected, synchronously).

Let's prove this to ourselves now, by creating a third service `c`, and defining the same handlers -- one for the `before` phase and two for the `on` phase -- except this time we'll ensure that the chain is not broken by the first `on` phase handler, by receiving and using the `next` function reference passed to it (we'll practise using the REPL's multiline editor facility):

```log
> .editor
// Entering editor mode (Ctrl+D to finish, Ctrl+C to cancel)
(c = new cds.Service)
.before('*', eve => console.log(eve.event, eve.data))
.on('xxxxx', (eve, next) => { console.log(eve.event, eve.data, "(on)"); next() })
.on('xxxxx', eve => console.log("gotcha"))

Service {
  _handlers: {
    _initial: [],
    before: [ EventHandler { before: '*', handler: [Function (anonymous)] } ],
    on: [
      EventHandler { on: 'xxxxx', handler: [Function (anonymous)] },
      EventHandler { on: 'xxxxx', handler: [Function (anonymous)] }
    ],
    after: [],
    _error: []
  },
  name: 'Service',
  options: {}
}
```

Now for the moment of truth[<sup>9</sup>](#footnote-9):

```log
> await c.send('xxxxx',{mac:11})
xxxxx { mac: 11 }
xxxxx { mac: 11 } (on)
gotcha
```

Because the first `on` phase handler didn't break the chain, the second one (that outputs "gotcha") got a chance to run too.

Nice!

> Remember also that while `on` phase handlers are executed in sequence, all `before` phase handlers are executed in parallel, as are all `after` phase handlers.

<a name="cds-event-and-cds-request"></a>
## cds.Event and cds.Request

Finishing off this exploration, at around [49:56][108], Daniel talks a bit more about the difference between a (synchronous) request and an (asynchronous) message. In passing, he reveals how simple it also is to instantiate such things in the REPL.

First, a request:

```log
> req = new cds.Request({event:'foo',data:{foo:11}})
Request { event: 'foo', data: { foo: 11 } }
```

Now, a message (event):

```log
> msg = new cds.Event({event:'foo',data:{foo:11}})
EventMessage { event: 'foo', data: { foo: 11 } }
```

Observe how similar the creation and content of each of these objects is.

In fact, the illustration of how similar they are, or rather how _related_ they are, can be found in the [cds.Events][41] section of Capire. Specifically:

* the [cds.Event][42] section explains that the `cds.Event` class "serves as the base class for `cds.Request`"
* the [cds.Request][43] section shows that the `cds.Request` class extends the `cds.Event` class, notably with methods that include _sending back a response_, such as `req.reply()`

Incidentally, if you're interested to learn more about how Daniel got his instance of VS Code to attach to the Node.js REPL process, see [Node.js debugging in VS Code][40].

<a name="remote-services-proxies-and-abstraction"></a>
## Remote services, proxies, and abstraction

Coming almost to the end of this part, at around [53:50][109], Daniel explains briefly in the very limited time left about remote services.

To quote Daniel:

> "A remote service is a service that we create locally but which happens to be a proxy to whatever remote thing there is"

As we're learning, CAP services are "just" agnostic event machines that can receive and forward messages. Especially when we use the `'*'` "any" event when registering handlers, we are reminded of Smalltalk's `#doesNotUnderstand` mechanism [that we touched upon in part 4][44].

What supports this power and flexibility is another core feature of CAP's design and philosophy: abstraction. An essential example of this is [CQL][6] (and the machine-readable version [CQN][7]), which allows CAP to dispatch events, and their payloads, to various services, including database services and protocol handlers, where the payload is crystallised in CQN, a superset of all database layer languages and protocol mechanics. See also the earlier [CQL > SQL](#cql-sql) section.

This seems an ideal potential starting point for the next part - as we ran out of time at this point.

Until next time - and I hope these notes are useful - let me know in the comments!

---

<a name="footnotes"></a>
## Footnotes

<a name="footnote-1"></a>
1. I know this seems obvious, but sometimes it's helpful to stare at the obvious for a while, in a "kata" style of memory reinforcement.

<a name="footnote-2"></a>
2. Which is Suppliers, Products and Categories, with relationships between them (if you want to peruse such a service, there's one available [here][46]).

<a name="footnote-3"></a>
3. You can paste multiple lines into the REPL, or edit multiple lines yourself, using the `.editor` REPL command (see the [Commands and special keys][16] section of the Node.js REPL documentation). You can also use [template literals][17] (`` `...` ``) for multiline strings.

<a name="footnote-4"></a>
4. See the [Improved $expand][20] section of my talk on [OData V4 and SAP Cloud Application Programming Model][21] for more on the complex `$expand` value.

<a name="footnote-5"></a>
5. I know that `car` is just a subsequent value derived from `bar`, but I like to think that it's a respectful reference to a core building block of the language that provided so much fundamental thinking for functional programming, which in turn has informed CAP. I'm talking of course about the [primitive operation `car` in Lisp][23].

<a name="footnote-6"></a>
6. That this is a `cds watch` based affordance is further underlined when Daniel starts up the `bookstore` service in the cds REPL with `cds r --run cap/samples/bookstore/` at around [28:31][105] and receives the error _No credentials configured for "ReviewsService"_, because the "check `~/.cds-services.json` and mock if nothing found" design time feature is only invoked with `cds watch`.

<a name="footnote-7"></a>
7. At this point in the live stream I remark on Daniel's choice of three characters for his parameter names reflecting some lovely historical Unix trivia, in that the system usernames of Unix and C gods such as Thompson, Richie, Kernaghan, Weinberger et al. were always three characters, as we can see in the first column in [this historical `/etc/passwd` file][38]:

```log
dmr:gfVwhuAMF0Trw:42:10:Dennis Ritchie:/usr/staff/dmr:
ken:ZghOT0eRm4U9s:52:10:& Thompson:/usr/staff/ken:
sif:IIVxQSvq1V9R2:53:10:Stuart Feldman:/usr/staff/sif:
scj:IL2bmGECQJgbk:60:10:Steve Johnson:/usr/staff/scj:
pjw:N33.MCNcTh5Qw:61:10:Peter J. Weinberger,2015827214:/usr/staff/pjw:/bin/csh
bwk:ymVglQZjbWYDE:62:10:Brian W. Kernighan,2015826021:/usr/staff/bwk:
uucp:P0CHBwE/mB51k:66:10:UNIX-to-UNIX Copy:/usr/spool/uucp:/usr/lib/uucp/uucico
srb:c8UdIntIZCUIA:68:10:Steve Bourne,2015825829:/usr/staff/srb:
```

(and yes, my favourite shell `bash` is named after a successor to the shell that Steve Bourne created which was called the Bourne shell (`sh`), in that "bash" stands for the play on words "Bourne (born) again shell".)

<a name="footnote-8"></a>
8. It still slightly disturbs me (in a fun way) that the event identifier here (`some event`) contains whitespace :-)

<a name="footnote-9"></a>
9. Yes, the choice of the property name `mac` here was deliberate; three characters, but a reference to a band that wrote a song which I've referenced in the explanation for this example and forms a core part of what we've learned here. Can you guess what the band is and why? :-)

<a name="appendix"></a>
## Appendix - test environment with Northbreeze

In working through some of the examples Daniel illustrated, I used the container-based CAP Node.js 8.5.1 environment I described in the [Appendix - setting up a test environment][12] in the [notes from part 4][3], with the [Northbreeze][13] service (a sort of cut-down version of the classic Northwind service).

When instantiating the container, I avoided making it immediately ephemeral (by not using [the `--rm` option][14], and giving it a name with `--name`); I also added an option to publish port 4004 from the container, so the invocation that I used was:

```shell
docker run -it --name part5 -p 4004:4004 cap-8.5.1 bash
```

At the Bash prompt within the container, I then cloned the [Northbreeze][13] repository, and started a cds REPL in there:

```shell
node ➜ ~
$ git clone https://github.com/qmacro/northbreeze && cd northbreeze
Cloning into 'northbreeze'...
remote: Enumerating objects: 35, done.
remote: Counting objects: 100% (35/35), done.
remote: Compressing objects: 100% (25/25), done.
remote: Total 35 (delta 8), reused 33 (delta 6), pack-reused 0 (from 0)
Receiving objects: 100% (35/35), 20.85 KiB | 577.00 KiB/s, done.
Resolving deltas: 100% (8/8), done.
node ➜ ~/northbreeze (main)
$
```

I then started a cds REPL session and within that session I [started up the CAP server on port 4004][15]:

```shell
node ➜ ~/northbreeze (main)
$ cds r
Welcome to cds repl v 8.5.1
> cds.test('.','--port',4004)
<ref *1> Test { test: [Circular *1] }
> [cds] - loaded model from 2 file(s):

  srv/main.cds
  db/schema.cds

[cds] - connect to db > sqlite { url: ':memory:' }
  > init from db/data/northwind-Suppliers.csv
  > init from db/data/northwind-Products.csv
  > init from db/data/northwind-Categories.csv
/> successfully deployed to in-memory database.

[cds] - using auth strategy {
  kind: 'mocked',
  impl: '../../../usr/local/share/npm-global/lib/node_modules/@sap/cds-dk/node_modules/@sap/cds/lib/srv/middlewares/auth/basic-auth'
}

[cds] - using new OData adapter
[cds] - serving northbreeze { path: '/northbreeze' }

[cds] - server listening on { url: 'http://localhost:4004' }
[cds] - launched at 12/18/2024, 12:05:58 PM, version: 8.5.1, in: 609.947ms
[cds] - [ terminate with ^C ]

>
```


[1]: /blog/posts/2024/12/06/the-art-and-science-of-cap/
[2]: https://www.youtube.com/live/BpTDnYxoNXI
[3]: /blog/posts/2024/12/10/tasc-notes-part-4/

[4]: https://cap.cloud.sap/docs/cds/cdl
[5]: https://cap.cloud.sap/docs/cds/csn
[6]: https://cap.cloud.sap/docs/cds/cql
[7]: https://cap.cloud.sap/docs/cds/cqn

[8]: https://cap.cloud.sap/docs/cds/cql#with-infix-filters
[9]: https://en.wikipedia.org/wiki/Infix_notation
[10]: https://cap.cloud.sap/docs/cds/cdl#association-like-calculated-elements
[11]: https://cap.cloud.sap/docs/cds/cdl#publish-associations-with-filter
[12]: /blog/posts/2024/12/10/tasc-notes-part-4/#appendix1
[13]: https://github.com/qmacro/northbreeze
[14]: https://docs.docker.com/reference/cli/docker/container/run/#rm
[15]: https://hachyderm.io/deck/@qmacro/113673469026384747
[16]: https://nodejs.org/api/repl.html#commands-and-special-keys
[17]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
[18]: /blog/posts/2024/12/10/tasc-notes-part-4/#await
[19]: https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze/Suppliers?$expand=Products($select=ProductName;$filter=Discontinued%20eq%20false)&$filter=CompanyName%20eq%20%27Tokyo%20Traders%27
[20]: https://github.com/qmacro/odata-v4-and-cap/blob/main/slides.md#improved-expand
[21]: https://github.com/qmacro/odata-v4-and-cap
[22]: /blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/#initialrecognition
[23]: https://en.wikipedia.org/wiki/CAR_and_CDR
[24]: /blog/posts/2024/11/08/flattening-the-hierarchy-with-mixins/
[25]: https://github.com/SAP-samples/cloud-cap-samples
[26]: https://docs.npmjs.com/cli/v8/using-npm/workspaces
[27]: https://github.com/SAP-samples/cloud-cap-samples/blob/main/bookstore/index.cds
[28]: https://github.com/SAP-samples/cloud-cap-samples/blob/main/bookstore/srv/mashup.cds
[29]: https://github.com/SAP-samples/cloud-cap-samples/blob/main/bookstore/package.json
[30]: /blog/posts/2024/12/10/tasc-notes-part-4#tight-loops-design-time-affordances-and-service-integration
[31]: /images/2024/12/mocking.png
[32]: /images/2024/12/connect.png
[33]: https://cap.cloud.sap/docs/about/#jumpstart-grow-as-you-go
[34]: https://vuejs.org/
[35]: https://creators.spotify.com/pod/show/tech-aloud/episodes/The-Simplest-Thing-that-Could-Possibly-Work--A-conversation-with-Ward-Cunningham--Part-V---Bill-Venners-e5dpts
[36]: https://cap.cloud.sap/docs/node.js/core-services#srv-send-request
[37]: https://cap.cloud.sap/docs/node.js/core-services#srv-emit-event
[38]: https://github.com/dspinellis/unix-history-repo/blob/BSD-3-Snapshot-Development/etc/passwd
[39]: https://cap.cloud.sap/docs/node.js/core-services#interceptor-stack-with-next
[40]: https://code.visualstudio.com/docs/nodejs/nodejs-debugging
[41]: https://cap.cloud.sap/docs/node.js/events
[42]: https://cap.cloud.sap/docs/node.js/events#cds-event
[43]: https://cap.cloud.sap/docs/node.js/events#cds-request
[44]: /blog/posts/2024/12/10/tasc-notes-part-4/#everything-is-a-service
[45]: https://cap.cloud.sap/docs/
[46]: https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze
[47]: https://cap.cloud.sap/docs/releases/dec24#cds-repl-enhancements
[48]: https://cap.cloud.sap/docs/releases/dec24

[101]: https://www.youtube.com/live/BpTDnYxoNXI?t=1050
[102]: https://www.youtube.com/live/BpTDnYxoNXI?t=1302
[103]: https://www.youtube.com/live/BpTDnYxoNXI?t=1455
[104]: https://www.youtube.com/live/BpTDnYxoNXI?t=1701
[105]: https://www.youtube.com/live/BpTDnYxoNXI?t=1711
[106]: https://www.youtube.com/live/BpTDnYxoNXI?t=2524
[107]: https://www.youtube.com/live/BpTDnYxoNXI?t=2845
[108]: https://www.youtube.com/live/BpTDnYxoNXI?t=2996
[109]: https://www.youtube.com/live/BpTDnYxoNXI?t=3230
