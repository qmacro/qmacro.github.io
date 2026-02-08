---
title: Shift left with CAP
date: 2026-02-07
tags:
  - llms
  - fp
  - cap
  - cds
  - cql
  - odata
  - clojure
  - bestpractices
description: In this post I posit that shifting left in our CAP based solutions is something that we should be striving to do.
---

The traditional "shift left" strategy in software is about how we move testing,
security considerations and quality assurance to an earlier stage in the
architecture and development process. This strategy is a useful one which can
be adapted to what we code, and _where_ we code.

Something that's always been the case -- but which is gaining increasing
focus and attention thanks to AI -- is how more lines of code is worse, not
better.

## Less code, more solid-state

Why worse? Well, more code means a larger surface area for bugs to
manifest, higher efforts in comprehension & maintenance and a greater
likelihood of technical debt[<sup>1</sup>](#footnotes).

Moreover, in traditional languages (such as JavaScript, Java, et al.) the code
written often contains moving parts, writhing and mutating ... requiring effort
to contain, control and reason about.

Today, there's another problem with more code, and that's the lack of concision
when it comes to being the subject of training, in LLM situations. We want our
AI models to be trained on, and producing, reliable and concise code.

Whether it's us, or future LLMs that will be maintaining and extending that
generated code, we owe it to ourselves (and our future [AI
overlords](https://www.youtube.com/watch?v=8lcUHQYhPTE)) to make it as precise
and with a small a footprint as possible.

I sometimes use the term "solid-state" in my talks when describing what
functional programming brings, such as in [Learning by Doing - Beginning
Clojure by Solving
Puzzles](/images/2025/03/learning-by-doing-beginning-clojure-by-solving-puzzles.pdf).
The term, for me, captures the idea of code that doesn't move, and therefore is
far less prone to changing or breaking[<sup>2</sup>](#footnotes).

Alongside functional programming languages in which this state (pun intended)
can be found, there's also the class of declarative languages. Guess what? CAP
has a wealth of declarative languages right there for us to embrace, in [the CDS
language family](https://cap.cloud.sap/docs/cds/): CDL, CQL and CXL.

One way of working towards this goal of writing less code, and having as much
of that code in solid-state form, is by _shifting our development left_.

## An example

To illustrate what I mean by shifting left from a code perspective in CAP, I
want to work through a deliberately simple example. Consider a typical CAP
scenario, where we have an entity model, a service on top of
that[<sup>3</sup>](#footnotes) which is made available via some protocol,
consumed in some frontend app.

```text
+---------+     +---------+     +---------+     +---------+
| Entity  |     | Service |     |  OData  |     |         |
| Model   +-----+ Defn    +-----+  Proto  +-----|Frontend |
|         |     |         |     |         |     |         |
+---------+     +----+----+     +---------+     +---------+
                     |
                +----+----+
                | Service |
                | Impl    |
                |         |
                +---------+
```

## The setup

Our starting position is a basic CDS model with a single entity, `Products`,
and a single service making that entire entity available.

In `db/schema.cds` we have:

```cds
namespace northbreath;

entity Products {
  key ID    : Integer;
      name  : String;
      price : Decimal;
      stock : Integer;
}
```

and in `srv/main.cds` we have:

```cds
using northbreath from '../db/schema';

service Main {
  entity Products as projection on northbreath.Products;
}
```

> If
> [Northbreeze](/blog/posts/2025/07/21/a-recap-intro-to-the-cds-repl/#sending-queries-to-a-remote-service)
> is a cut down version of the original
> [Northwind](https://services.odata.org/v4/Northwind/Northwind.svc/), then
> [Northbreath](TODO) is an _extremely_ cut down version. Geddit? Ok, [I'll get
> me coat](https://en.wiktionary.org/wiki/I%27ll_get_my_coat).

For completion and illustration's sake, we also have a skeleton implementation
for this `Main` service in `srv/main.js`, which does nothing at the moment:

```javascript
const cds = require('@sap/cds')

module.exports = class Main extends cds.ApplicationService {
  init() {
    return super.init()
  }
}
```

There are just a few initial data records in `test/data/northbreath-Products.csv`:

```csv
ID,name,price,stock
1,Chai,18.00,39
2,Chang,19.00,17
3,Aniseed Syrup,10.00,13
```

That's all we need for this scenario. Unless otherwise stated, assume that
we're now running a CAP server for this project, with `cds watch`. We'll
request a single entities in examples henceforth, mostly to keep things brief.

Albeit simple, this scenario comprises a fully formed model and a service
provided via OData. Properties available for each entity (e.g. at
`localhost:4004/odata/v4/main/Products/1`) are what the frontend is built
around:

```json
{
  "@odata.context": "$metadata#Products/$entity",
  "ID": 1,
  "name": "Chai",
  "price": 18,
  "stock": 39
}
```

## The requirement

Let's say the frontend now also needs to calculate the in-stock value for each
of the products (again, deliberately simple, but this idea holds for more
complex requirements too).

In other words, the value is the price multiplied by
the number of units in stock. For this `Chai` product, that would be `18 * 39`
i.e. `702`.

## Addressing the requirement

How should the developer go about this? There are many approaches, which I'll
enumerate in right to left order, with respect to the diagram earlier, i.e.
shifting further and further left and towards declarative solutions each time.

### Computation at the frontend

```text
+---------+  +---------+  +---------+  ///////////
| Entity  |  | Service |  |  OData  |  /         /
| Model   +--+ Defn    +--+  Proto  +--/Frontend /
|         |  |         |  |         |  /         /
+---------+  +----+----+  +---------+  ///////////
                  |
             +----+----+
             | Service |
             | Impl    |
             |         |
             +---------+
```

Naturally one might be tempted to make the calculation in the frontend, on the
far right, once the entity data is available.

That would work, but why put extra effort where it's least wanted, transferring
extra business logic (in the form of JavaScript, typically for a Web-based
application) and requiring a small amount of extra compute nearest to the user?
This pushes more complexity at the rightmost end of the spectrum where moving
parts and calculations are least appropriate.

### Computation via the URL in the OData operation

```text
                                SHIFT LEFT
                               <==================

+---------+  +---------+  ///////////  +---------+
| Entity  |  | Service |  /  OData  /  |         |
| Model   +--+ Defn    +--/  Proto  /--|Frontend |
|         |  |         |  /         /  |         |
+---------+  +----+----+  ///////////  +---------+
                  |
             +----+----+
             | Service |
             | Impl    |
             |         |
             +---------+
```

Moving slightly further left, this requirement could be satisfied using OData
facilities[<sup>4</sup>](#footnotes), specifically with the [system query option
$compute](https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html#_Toc31361047).

The in-stock value calculation can be effectively shifted left by using
`$compute` to return the value as a computed property:

```bash
curl \
  --silent \
  --url 'localhost:4004/odata/v4/main/Products/1?$compute=price%20mul%20stock%20as%20instockvalue_odata' `
  | jq .
```

Written out in decoded form, the query string of the URL looks like this:

```text
$compute=price mul stock as instockvalue_odata
```

The entity returned looks like this:

```json
{
  "@odata.context": "$metadata#Products/$entity",
  "ID": 1,
  "name": "Chai",
  "price": 18,
  "stock": 39,
  "instockvalue_odata": 702
}
```

The calculation is specified in the frontend but provided by the backend and
thus available without any extra custom code on the right hand side.

However, we've only slightly deferred the work burning execution cycles in the
browser's JavaScript engine, changing it into a requirement to customise the
OData URLs. We can do better.

### Using a custom event handler

```text
                   SHIFT LEFT
                  <===============================

+---------+  +---------+  +---------+  +---------+
| Entity  |  | Service |  |  OData  |  |         |
| Model   +--+ Defn    +--+  Proto  +--|Frontend |
|         |  |         |  |         |  |         |
+---------+  +----+----+  +---------+  +---------+
                  |
             ///////////
             / Service /
             / Impl    /
             /         /
             ///////////
```

Shifting further left, while still in "imperative" mode, given all that
JavaScript that's in our heads from thinking all things frontend, we have the
chance to jump into the built-in request/response handling cycle that the CAP
server provides, and modify the payload of a response before it's sent back.

We can do this in an [event
handler](https://cap.cloud.sap/docs/guides/services/custom-code#hooks-on-before-after),
specifically in the "after" phase. Such "after" phase handlers run after the
"on" handlers, and get the result set as input. What might that look like?
Well, in its simplest form, like this, in our `srv/main.js`:

```javascript
const cds = require('@sap/cds')

module.exports = class Main extends cds.ApplicationService {
  init() {
    this.after('each', 'Products', p => {
      p.instockvalue_after = p.price * p.stock
    })
    return super.init()
  }
}
```

In the `init` we've now defined an anonymous function for the "after" phase, a
function that adds a new property `instockvalue_after` to the entity objects.

This means that the computation of `price * stock` is now pushed back further
left, and we can now remove the `$compute` system query option from the URL in
the OData request:

```bash
curl \
  --silent \
  --url 'localhost:4004/odata/v4/main/Products/1`
  | jq .
```

but still get what we need:

```json
{
  "@odata.context": "$metadata#Products/$entity",
  "ID": 1,
  "name": "Chai",
  "price": 18,
  "stock": 39,
  "instockval_after": 702
}
```

### Calculated element in the service definition

From the diagram's perspective, we're not shifting much further left with this
next option, as service definition and implementation go together.

```text
                   SHIFT LEFT
                  <===============================

+---------+  ///////////  +---------+  +---------+
| Entity  |  / Service /  |  OData  |  |         |
| Model   +--/ Defn    /--+  Proto  +--|Frontend |
|         |  /         /  |         |  |         |
+---------+  ///////////  +---------+  +---------+
                  |
             +----+----+
             | Service |
             | Impl    |
             |         |
             +---------+
```

However, I'd argue that a shift from the custom code, a move away from the
ceremony and imperative nature of a custom handler in the _implementation_ of a
service, to a calm, declarative and solid-state addition in the _definition_ of
a service is what we should strive for.

This is effectively a "push up", as described in the [What now how, less is
more](/blog/posts/2026/01/27/constraints-expressions-and-axioms-in-action/#what-not-how-less-is-more)
section of the [Constraints, expressions and axioms in
action](/blog/posts/2026/01/27/constraints-expressions-and-axioms-in-action/)
post.

One of my five main reasons to use CAP is that [the code is in the framework,
not outside of
it](/blog/posts/2024/11/07/five-reasons-to-use-cap/#1-the-code-is-in-the-framework-not-outside-of-it).
That gives us a massive step up as developers and allows us to focus on the
important stuff, such as domain modelling. The phrase "the code is in the
framework" is also a subtle clue that we should try to keep it that way, too.

So instead of a custom handler, let's remove the `srv/main.js` service
implementation file entirely, and use the power of
[CDL](https://cap.cloud.sap/docs/cds/cdl) and
[CXL](https://cap.cloud.sap/docs/cds/cl) to declare a [calculated
element](https://cap.cloud.sap/docs/cds/cdl#calculated-elements) in the
`Products` projection definition in our `Main` service, like this:

```cds
using northbreath from '../db/schema';

service Main {
  entity Products as
    projection on northbreath.Products {
      *,
      price * stock as instockval_service
    }
}
```

Now we can request the "bare" entity URL again:

```bash
curl \
  --silent \
  --url 'localhost:4004/odata/v4/main/Products/1`
  | jq .
```

and get what we need, with no moving parts, and no custom code at all to
maintain:

```json
{
  "@odata.context": "$metadata#Products/$entity",
  "ID": 1,
  "name": "Chai",
  "price": 18,
  "stock": 39,
  "instockval_service": 702
}
```

### Calculated element at the schema layer

```text
      SHIFT LEFT
     <============================================

///////////  +---------+  +---------+  +---------+
/ Entity  /  | Service |  |  OData  |  |         |
/ Model   /--+ Defn    +--+  Proto  +--|Frontend |
/         /  |         |  |         |  |         |
///////////  +----+----+  +---------+  +---------+
                  |
             +----+----+
             | Service |
             | Impl    |
             |         |
             +---------+
```

It is not by chance that there is a distinct separation of CDS model and
service layers. The [Services as
Facades](https://cap.cloud.sap/docs/guides/services/providing-services#services-as-facades)
section of the [Define Provided
Services](https://cap.cloud.sap/docs/guides/services/providing-services) tells
us that rather than having a single service to serve all consumers, they should
be plentiful, facades encapsulating different views on domain data
constellations, exposing different aspects tailored to the use cases as
required.

So while it can make a lot of sense to place a [calculated element at the
service definition layer](#calculated-element-in-the-service-definition), it
can sometimes make sense to place it at the schema layer, directly in the CDS
model. You and your domain experts & business owners are best placed to
decide this.

Defining a calculated element at this level is just as simple. Instead of
making any changes to the projection definition in `srv/main.cds`, we can add
an element to `Products` directly in `db/schema.cds`:

```cds
namespace northbreath;

entity Products {
  key ID                  : Integer;
      name                : String;
      price               : Decimal;
      stock               : Integer;
      instockvalue_schema : Decimal = price * stock;
}
```

With the definition at this level, all `Products` projections at the service
layer will benefit from this extra element, without you having to do anything
special.

> If there was a particular service where you didn't want this element in a
> projection on `Products`, you could use an `excluding` clause, of course like
> this:
>
> ```cds
> using northbreath from '../db/schema';
>
> service Secondary {
>   entity Products as
>     projection on northbreath.Products
>     excluding {
>       instockvalue_schema
>     }
> }
> ```

## Wrapping up

Shifting left in CAP results in less code. It also means that the smaller
amount of code that we do end up writing is also more solid-state.

Shifting left also surfaces solutions to business requirements at the level
that the domain expert can more easily collaborate on; the construction of
solutions become part of the design document set, rather than being a
write-once and write-only part of the solution at the imperative and brittle
code level.

CAP supports us with the built-in philosophies and the languages we can use to
do the right thing, and I'm reminded of how it also strongly lives up to one of
Perl's taglines, to which I alluded in [the notes to The Art and Science of CAP
Part
9](https://qmacro.org/blog/posts/2025/02/21/tasc-notes-part-9/#its-all-just-a-path-game),
especially the first part:

> _Makes easy things easy and hard things possible._

CAP makes it easy for us to do the easy things, the right things. Let's do that.

## Further info

For a great deal of amazing insight into expressions, in CXL, within CDL and
also CQL, don't miss the current Hands-on SAP Dev live stream series "CDS
expressions in CAP - under the hood" with me and expert Patrice Bender. You can
find all the info, including links to replays and upcoming episodes, in the
post [A new Hands-on SAP Dev mini-series on the core expression language in
CDS](/blog/posts/2025/12/09/a-new-hands-on-sap-dev-mini-series-on-the-core-expression-language-in-cds/).

Birgit Selbach's post [Declarative Programming in CAP: Less Code, More
Value](https://community.sap.com/t5/technology-blog-posts-by-sap/declarative-programming-in-cap-less-code-more-value/ba-p/14321990)
has also some great thoughts in this area.

## Footnotes

1. See [AXI002 Less is more](https://github.com/qmacro/capref/blob/main/axioms/AXI002.md).
1. This is strongly linked with the [functional programming](/tags/fp) idea
   that we should avoid mutating data, making things difficult to track, and instead
   use higher level mechanisms that provide us with chainable functions at the
   [what, not how](https://github.com/qmacro/capref/blob/main/axioms/AXI001.md)
   level.
1. See [AXI004 Services are cheap](https://github.com/qmacro/capref/blob/main/axioms/AXI004.md).
1. If you want to learn more about OData, and influence the new series of
   tutorials I'm writing, see [OData Deep Dive rewrite in the
   open](/blog/posts/2026/02/02/odata-deep-dive-rewrite-in-the-open/). See also
   the [Serving OData APIs](https://cap.cloud.sap/docs/guides/protocols/odata)
   topic in Capire for what facilities like this are available.
