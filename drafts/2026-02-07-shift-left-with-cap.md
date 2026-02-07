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
description: In this post I posit that "shifting left" in our CAP based solutions is something that we should be striving to do.
---

The "shift left" strategy in software is about how we move testing, security
considerations and quality assurance to an earlier stage in the architecture
and development process. This strategy is a useful one which can be adapted
to what we code, and _where_ we code.

Something that's always been the case -- but which is gaining increasing
focus and attention thanks to AI -- is how more lines of code is worse, not
better.

## Less code, more solid-state

Why worse? Well, more code means a larger surface area for bugs to
manifest, higher efforts in maintenance and comprehension and an increased
possibility of the build up of technical debt.

Moreover, in traditional languages (such as JavaScript, Java, et al.) the code
written often contains moving parts, writhing and mutating ... requiring effort
to contain, control and reason about.

Today, there's another problem with more code, and that's the lack of concision
when it comes to being the subject of training, in LLM situations. We want our
AI models to be trained on, and producing, reliable and concise code.

Whether it's us, or future LLMs that will be maintaining and
extending that generated code, we owe it to ourselves (and our future AI
overlords) to make it as precise and with a small a footprint as possible.

I sometimes use the term "solid-state" in my talks when describing what
functional programming brings, such as in [Learning by Doing - Beginning
Clojure by Solving
Puzzles](/images/2025/03/learning-by-doing-beginning-clojure-by-solving-puzzles.pdf).
The term, for me, captures the idea of code that doesn't move, and therefore is
far less prone to changing or breaking.

Alongside functional programming languages in which this state (pun intended)
can be found, there's also the class of declarative languages. Guess what? CAP
has a wealth of declarative languages right there for us to embrace, in [the CDS
language family](https://cap.cloud.sap/docs/cds/): CDL, CQL and CXL.

One way of working towards this goal of using less code, and the code that needs to
exist being in solid-state form, is by _shifting our development left_.

## An example

To illustrate what I mean by shifting left from a code perspective in CAP, I
want to work through a deliberately simple example. Consider a typical CAP
scenario, where we have an entity model, one or two services on top of
that[<sup>1</sup>](#footnotes), services that are made available via the OData
protocol, and that are consumed in some frontend app.

```text
+---------+     +---------+     +---------+
| Entity  |     | Service |     |  OData  |
| Model   +-----+ Defn    +-----+  Proto  +----- frontend
|         |     |         |     |         |
+---------+     +----+----+     +---------+
                     |
                +----+----+
                | Service |
                | Impl    |
                |         |
                +---------+
```

### The setup

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
> [Northbreath](TODO) is an extremely cut down version. Geddit? Ok, [I'll get
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

And there are just a few initial data records in `test/data/northbreath-Products.csv`:

```csv
ID,name,price,stock
1,Chai,18.00,39
2,Chang,19.00,17
3,Aniseed Syrup,10.00,13
```

That's all we need for this scenario. See [Appendix A - Initial data
request](#appendix-a-initial-data-request) to see what this looks like in the
form of a entityset of products from an OData query operation. We'll mostly
request a single entities in examples henceforth, mostly to keep things brief.

Unless otherwise stated, assume that we're now running a CAP server for this
project, with `cds watch`.

### The requirement

Albeit simple, this scenario comprises a fully formed model and a service
provided via OData. Properties available for each entity, such as the entity at
`localhost:4004/odata/v4/main/Products/1`, are what the frontend is built
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

Let's say the frontend now also needs to calculate the in-stock value for each
of the products (again, deliberately simple, but this idea holds for more
complex requirements too). In other words, the value is the price multiplied by
the number of units in stock. For this `Chai` product, that would be `18 * 39`
i.e. `702`.

How should the developer go about this? There are many approaches, which I'll
enumerate in right to left order, with respect to the diagram earlier.

### Computation at the frontend

Naturally one might be tempted to make the calculation in the frontend, on the
far right, once the entity data is available.

That would work, but why put extra effort where it's least wanted, transferring
extra business logic (in the form of JavaScript, typically for a Web-based
application) and requiring a small amount of extra compute nearest to the user?
More complexity at the rightmost end of the spectrum where moving parts and
calculations are least appropriate.

### Computation via the URL in the OData operation

Moving ever so slightly further left, this requirement could be satisfied using
OData facilities, specifically with the [system query option
$compute](https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html#_Toc31361047).

> If you want to learn more about OData, and influence the new series of
> tutorials I'm writing, see [OData Deep Dive rewrite in the
> open](/blog/posts/2026/02/02/odata-deep-dive-rewrite-in-the-open/). See also
> the [Serving OData APIs](https://cap.cloud.sap/docs/guides/protocols/odata)
> topic in Capire for what facilities like this are available.

The in-stock value calculation can be effectively shifted left slightly by using
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

The value `702` is now provided by the backend, and thus available without any
extra custom code in the frontend. However, we've only slightly deferred the
work burning execution cycles in the browser's JavaScript engine to a need to
to customise the OData URLs. We can do better.

### Using a custom event handler

Shifting further left, while still in "imperative" mode, given all that
JavaScript that's in our heads from thinking all things frontend, we have the
chance to jump into the built-in request/response handling cycle that the CAP
server provides, and modify the payload of a response before it's sent back to
the requester.

We can do this in an [event
handler](https://cap.cloud.sap/docs/guides/services/custom-code#hooks-on-before-after),
specifically in the "after" phase. Such "after" phase handlers run after the
"on" handlers, and get the result set as input. What might that look like? Well, in its simplest form, like this, in our `srv/main.js`:

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

In the `init` we've now defined an anonymous function for the "after" phase, a function that adds a new property `instockvalue_after` to the entity objects.

This means that the computation of `price * stock` is now pushed back further left, and we can now remove the `$compute` system query option from the URL in the OData request:

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

### Calculated element at the service layer

From the diagram's perspective, we're not shifting much further left with this
next option, as service definition and implementation go together.

```text
                     <--------------------- shifting left

             +---------------+
+---------+  |  +---------+  |  +---------+
| Entity  |  |  | Service |  |  |  OData  |
| Model   +--|--+ Defn    +--|--+  Proto  +----- frontend
|         |  |  |         |  |  |         |
+---------+  |  +----+----+  |  +---------+
             |       |       |
             |  +----+----+  |
             |  | Service |  |
             |  | Impl    |  |
             |  |         |  |
             |  +---------+  |
             +---------------+
```

However, I'd argue that a shift from the custom code, ceremony and imperative
nature of a custom handler in the _implementation_ of a service, to a calm,
declarative and solid-state addition in the _definition_ of a service is what
we should strive for.

One of my five main reasons to use CAP is that [the code is in the framework,
not outside of
it](/blog/posts/2024/11/07/five-reasons-to-use-cap/#1-the-code-is-in-the-framework-not-outside-of-it).
That gives us a massive step up as developers, allows us to focus on the
important stuff (such as domain modelling), but also gives us a subtle clue
that we should try to keep it that way.

So instead of a custom handler, we can remove the `srv/main.js` service
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

TODO

## Footnotes

1. Remember, [services are cheap (AXI004)](https://github.com/qmacro/capref/blob/main/axioms/AXI004.md).

## Appendix A - Initial data request

After starting the CAP server with `cds watch`, an initial query:

```bash
curl \
  --silent \
  --url 'localhost:4004/odata/v4/main/Products' \
  | jq .
```

produces this:

```json
{
  "@odata.context": "$metadata#Products",
  "value": [
    {
      "ID": 1,
      "name": "Chai",
      "price": 18,
      "stock": 39
    },
    {
      "ID": 2,
      "name": "Chang",
      "price": 19,
      "stock": 17
    },
    {
      "ID": 3,
      "name": "Aniseed Syrup",
      "price": 10,
      "stock": 13
    }
  ]
}
```
