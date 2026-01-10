---
title: Some ramblings on simple CDS modelling with CDL
date: 2025-11-12
tags:
  - cds
  - cdl
  - cap
  - mixins
description: A brief note-to-self after digging in to some simple constructs in CDS modelling.
---
I'm taking some time to peruse the [Conceptual Definition Language (CDL)](https://cap.cloud.sap/docs/cds/cdl) topic of the CAP documentation, and stopped at the first example in the [Keywords & Identifiers](https://cap.cloud.sap/docs/cds/cdl#keywords-identifiers) section, which piqued my interest. Let's put this in a file called `db/keywords-and-identifiers.cds`:

```cds
namespace capire.bookshop;
using { managed, cuid } from '@sap/cds/common';
aspect primary : managed, cuid {}

entity Books : primary {
  title  : String;
  author : Association to Authors;
}

entity Authors : primary {
  name   : String;
}
```

> I have [been involved in tweaking](https://github.com/capire/docs/commit/2c42b724a9d6c1efadecfe400c478bbe739365d2) this section, just so you know.

## Two-level mixin

The two-level mixin here made me pause for [a stare](/blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/#initial-recognition), and also made me think what this definition looks like once compiled into [Core Schema Notation (CSN)](https://cap.cloud.sap/docs/cds/csn). Let me simplify the above example as much as possible, to reduce any unnecessary noise:

```cds
using cuid from '@sap/cds/common';
aspect primary : cuid {}

entity Authors : primary {
  name   : String;
}
```

What do we have here?

- the import of `cuid` on its own (removing the need for the `{ ... }` brace construct, by the way); `cuid` is an aspect, defined (in `@sap/cds/common`) like this: `aspect cuid { key ID : UUID; }`
- the definition of another (empty) aspect `primary`, which, via the `:` [shortcut syntax](https://cap.cloud.sap/docs/cds/cdl#includes), is extended with the `cuid` aspect
- the definition of an entity with a single non-key element (`name`); this entity is extended with the `primary` aspect

## Surfacing the common aspect

In order to reduce the noise further (especially when we start to look at what this CDS model compiles to), let's surface the `cuid` aspect from `@sap/cds/common` so we won't be inundated with the rest of `@sap/cds/common` in what the compiler produces:

```cds
aspect cuid {
  key ID : UUID;
}

aspect primary : cuid {}

entity Authors : primary {
  name   : String;
}
```

Through the "two generation mixin ancestry":

```text
cuid
  |
  V
primary
  |
  V
Authors
```

the `Authors` entity has a primary key `ID` as well as the `name` element.

## Examining the CSN

What does this look like when compiled to CSN? We'll take the YAML representation as that is a little less verbose and (arguably) easier to read than the JSON equivalent. Using:

```bash
cds compile --to yaml db/keywords-and-identifiers.cds
```

we get:

```yaml
definitions:
  cuid: {kind: aspect, elements: {ID: {key: true, type: cds.UUID}}}
  primary: {kind: aspect, includes: [cuid], elements: {ID: {key: true, type: cds.UUID}}}
  Authors:
    kind: entity
    includes: [primary]
    elements: {ID: {key: true, type: cds.UUID}, name: {type: cds.String}}
meta: {creator: CDS Compiler v6.4.6, flavor: inferred}
$version: 2.0
```

## Imperative vs declarative

CDS modelling is predominantly achieved in a declarative fashion, with one of the Domain Specific Languages (DSLs) [available to us](https://cap.cloud.sap/docs/cds/): CDL. But within CDL there are a small number of keywords that are, philosophically, more imperative than declarative - `extend` being one of them (`annotate`[<sup>1</sup>](#footnotes) and `define` are imperative too).

Adding the `ID` key field to the `Authors` entity via these aspects has been done declaratively, using the [shortcut syntax](https://cap.cloud.sap/docs/cds/cdl#includes) we examined earlier, i.e. with the `:` symbol:

```cds
aspect primary : cuid {}
entity Authors : primary { ... }
```

But in fact we can achieve the same outcome using this more imperative form of extension syntax, with the `extend` keyword:

```cds
aspect primary {}

entity Authors {
  name : String;
}

extend aspect primary with cuid;
extend entity Authors with primary;
```

This results in the same logical `Authors` entity; I say "logical" as the compiler produces the definition with the elements in the order directly reflected in the top-to-bottom flow of the CDL, in other words, `name` followed by `ID`:

```yaml
Authors:
  kind: entity
  includes: [primary]
  elements: {name: {type: cds.String}, ID: {key: true, type: cds.UUID}}
```

## Aspects and types

So far in this simple model there are aspects and an entity. The aspects we've seen here are [named](https://cap.cloud.sap/docs/cds/cdl#named-aspects), which allows us to think of them as first class citizens in our model, define them ahead of time, and use them to extend multiple targets. This section is in that context of "named aspects", rather than anonymous ones, which is perhaps a topic for another time.

Both aspects and entities represent structures (of elements), but entities differ from aspects in that they are normally manifested at the persistence layer, whereas aspects are not.

There is another construct available to us in CDL, and that is the [type definition](https://cap.cloud.sap/docs/cds/cdl#type-definitions). While aspects are possibly less familiar to developers who have not been enlightened by [Aspect-oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming), types are what you expect them to be: custom, sometimes composite, definitions of element/type pairs.

The example in Capire's [Type Definitions](https://cap.cloud.sap/docs/cds/cdl#type-definitions) section has some nice examples:

```cds
define type User : String(111);
define type Amount {
  value : Decimal(10,3);
  currency : Currency;
}
define type Currency : Association to Currencies;
```

Given that types can be structures, just like aspects, can they be used to extend? The answer is a qualified "yes".

Let's say we wanted to add some origin info to our authors. How about the use of a new `origin` aspect:

```cds
aspect cuid {
  key ID : UUID
};

aspect origin {
  countryOfBirth : String;
}

aspect primary : cuid, origin {}

entity Authors : primary {
  name : String;
}
```

This conveys the new `countryOfBirth` element to the `Authors` entity, via the two-level mixin, as expected:

```yaml
definitions:
  cuid: {kind: aspect, elements: {ID: {key: true, type: cds.UUID}}}
  origin: {kind: aspect, elements: {countryOfBirth: {type: cds.String}}}
  primary:
    kind: aspect
    includes: [cuid, origin]
    elements: {ID: {key: true, type: cds.UUID}, countryOfBirth: {type: cds.String}}
  Authors:
    kind: entity
    includes: [primary]
    elements: {ID: {key: true, type: cds.UUID}, countryOfBirth: {type: cds.String}, name: {type: cds.String}}
meta: {creator: CDS Compiler v6.4.6, flavor: inferred}
$version: 2.0
```

What if we were to re-specify `origin` as a type?

```cds
aspect cuid {
  key ID : UUID
};

type origin {
  countryOfBirth : String;
}

aspect primary : cuid, origin {}

entity Authors : primary {
  name : String;
}
```

While the intermediate definitions do reflect the `origin`'s "kind", the end result in the entity is the same:

```yaml
definitions:
  cuid: {kind: aspect, elements: {ID: {key: true, type: cds.UUID}}}
  origin: {kind: type, elements: {countryOfBirth: {type: cds.String}}}
  primary:
    kind: aspect
    includes: [cuid, origin]
    elements: {ID: {key: true, type: cds.UUID}, countryOfBirth: {type: cds.String}}
  Authors:
    kind: entity
    includes: [primary]
    elements: {ID: {key: true, type: cds.UUID}, countryOfBirth: {type: cds.String}, name: {type: cds.String}}
meta: {creator: CDS Compiler v6.4.6, flavor: inferred}
$version: 2.0
```

This surprised me at first, but after all, CDL is an eminently flexible language with beauty in its simplicity and flexibility.

## No keys in types

One interesting difference between types and aspects in this regard is the conveyance of key elements. If we were to decide (for the sake of illustration) that `countryOfBirth` were to be a key element, in the aspect variation:

```cds
aspect origin {
  key countryOfBirth : String;
}
```

that would be fine and all would be well.

If we tried this in the type variation:

```cds
type origin {
  key countryOfBirth : String;
}
```

then we'd get a compiler warning[<sup>2</sup>](#footnotes):

```log
[WARNING] db/keywords-and-identifiers.cds:10:3-6:
  ‘key’ is only supported for elements in an entity or an aspect
  (in type:“humanID”/element:“employeeNr”)
```

This warning message ID is `def-unsupported-key`; you may wish to peruse the [Compiler Messages](https://cap.cloud.sap/docs/cds/compiler/messages) topic of Capire for more fascinating insights (this particular warning is not yet listed).

This is only a warning, and the compiler will still (currently) honour the key element in the entity, but it doesn't feel right to use a type like this, hence the "qualified yes".

Stopping to think about this a little, I am minded to reflect that the flexibility and simplicity of CDL is augmented by the intent conveyed by the semantics of the keywords themselves. I could imagine a version of CDL where both the `aspect` and `type` keywords were absent, replaced with a single `struct` keyword[<sup>3</sup>](#footnotes).
But that would, for me at least, make the language less approachable, less rich in expressiveness and the ability to show intent.

And while one ultimate target of CDL is the machine readable equivalent (CSN), another ultimate target ... is us humans, in our endeavour to model business domains together.

## Footnotes

1. It may interest you to know that `annotate` [is a shortcut for](https://cap.cloud.sap/docs/cds/cdl#the-annotate-directive) `extend`.
1. I also get a warning in my editor thanks to CAP's language server for CDS.
1. On that note, it may interest you to read the [Structured Types](https://cap.cloud.sap/docs/cds/csn#structured-types) section of Capire's CSN topic, where it says that "_structured types are signified by the presence of an `elements` property_". Did you notice that each definition in the final YAML representation of the compiled model -- whether entity, aspect or type -- has an `elements` property?
