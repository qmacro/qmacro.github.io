---
layout: post
title: TASC Notes - Part 7
date: 2025-02-07
tags:
  - tasc
  - cap
  - cds
  - handsonsapdev
---

These are the notes summarising what was covered in [The Art and Science of CAP part 7][1], one episode in a mini series with Daniel Hutzel to explore the philosophy, the background, the technology history and layers that support and inform the SAP Cloud Application Programming Model.

For all resources related to this series, see the post [The Art and Science of CAP][2].

This episode started with a review of the previous episode (part 6), based on the [notes for that episode][3]. We continued to look back more generally over the previous episodes to pick out the main themes around which we wove a (hopefully) coherent story:

* Domain-driven design
* The importance of modelling
* Aspect-oriented programming
* Artistic & scientific principles

During this review, at around [18:25][4], it was almost inevitable that we revisited the Class vs Prototype conversation, dwelling on the differences, and the importance of prototypical inheritance (the power of which is also reflected in the concept of [mixins][5]). But before we got to diving into that, we took a quick detour to revisit the theme of code generation.

## A quick review of some bad practices and what CAP brings

We talked about code generation, and how and why appears in the [Bad Practices][6] topic in Capire. This time Daniel reminded us of today's popular context of serverless and functions-as-a-service where codebase size and startup times are critical. Moreover, an approach that CAP also takes here is what one could only describe as at the opposite end of code generation and the [staleness][7] that inevitably accompanies that - dynamic interpretation of the models at run time.

Talking of staleness and "glue code" (technical non-domain code), another key philosophy driving CAP's design and realisation here is the idea that application developers should concentrate on developing the application. They should not be working on technical aspects of bringing that application to bear - tenant isolation, database management, security, protocol-level service integration and so on.

In fact, the entire idea of CAP's [Calesi Pattern][8] (CAP-level service integration) fits squarely into the space that this philosophical approach is carving out for us - the provision of CAP client libraries for BTP platform services that are designed to drastically reduce boilerplate and purely technical code.

Another aspect of why [keeping the code inside the framework][9] is important is eloquently expressed by Daniel: as builders of enterprise applications, we not only have to ensure our code scales, but also our teams and the output from those teams. Taking care of the important non-domain-specific aspects of building such enterprise applications not only removes the tedium but also the chance for error and the possibilities for varying and ultimately chaotically different approaches across different teams (think about how SAP-delivered UI5 based Fiori apps have standard layouts, and why Fiori elements came into being).

## Revisiting some of CAP's solid science foundations

At around [25:17][10] Daniel shared some slides that he'd compiled for a recent presentation on CAP at the [Hasso Plattner Institute][11].

> In the "about me" slide that Daniel shared, I couldn't help notice Daniel's pedigree; I mean, many of us already know Smalltalk runs through his veins, and perhaps knew, or at least suspected, that he has had enough experience[<sup>1</sup>](#footnote-1) with Java and JEE to ensure that CAP exudes good practices and eschews bad ones ... in the right way ;-)
>
> And I was delighted to learn that he also has been touched by NeXTSTEP - an object-oriented OS that also happened to sport a graphical desktop manager that is one of my favourites (and which lives on in the form of [Window Maker][27]). I'm already assuming that you realise that NeXTSTEP was created for the machines upon which the Web was invented - it was on a NeXTcube that Tim Berners-Lee wrote the first versions of the client and server software.
> ![A NeXTcube][12]
>
> _([Photo courtesy of Wikimedia Commons][13])_

Daniel jumps from Smalltalk to Lisp (the latter influenced the former) which is the "hero language" of functional programming, one of the key science pillars of CAP. It's hard to sum up decades of computing and computer science here, but I can sleep easy knowing that the good parts are in CAP; and those parts that were ultimately discovered to be not so good ... are not.

In the abstract-all-the-things mania of the 90's we had CASE and UML (and the corresponding code generation machinery that went with that) and by and large this has now been shown, over and over again, to be a noble but essentially wrong direction.

Ironically, or at least in stark contrast, we have functional programming and the simplicity of treating data as data (passive), which in turn allows us to think about immutability. And things that cannot move ... cannot break.

Not only that, but we can process large quantities of data with simple pipelines, such as [MapReduce][14], which is a scalable and relatively efficient way of analysing data in a chain of steps that are each horizontally scalable (and yes, the name comes from two classic functions `map` and `reduce`[<sup>2</sup>](#footnote-1) that are building blocks in many functional programming approaches.

Core functional programming tenets such as immutability and the related concept of pure functions, i.e. those that are side-effect free, a quality that allows mechanisms such as function chains (such as ones used in MapReduce) are consequently found in CAP too:

* [Services][16] are stateless
* [Data][17] is passive

On the topic of passive data, Daniel relates the story of an esteemed colleague extolling the virtues of _non-anemic_ objects, while Daniel himself takes the opposite approach. While the adjective [anemic][18] is an established one, it is a pejorative description based on a viewpoint held not least by luminaries such as Martin Fowler [<sup>3</sup>](#footnote-2), and I suggest we use a different, more positive term for what we're striving for here. "Pure objects", anyone?

Anemic, or pure objects, are almost a prerequisite for late binding and aspect oriented techniques.

## Prototype based system examples

Riffing on that last point, championing the prototype based inheritance model over the class based one, Daniel opens up one of our (now) favourite developer tools - the cds REPL - to give an example, which I'll try to summarise here.

First, a "class" `Foo` is defined, and an "instance" created:

```text
> Foo = class { bar = 11; boo(){ return "Hu?" } }
class { bar = 11; boo(){ return "Hu?" } }
> foo = new Foo
Foo { bar: 11 }
```

The `boo` "method" is available on `foo`:

```text
> foo.boo()
Hu?
```

Note that so far I've used double quotes around "class", "instance" and "method" here.

Next we can create `Bar` as an child "class" of `Foo`:

```text
> Bar = class extends Foo {}
class extends Foo {}
```

At this point "instances" of `Bar` have both the `bar` property and the `boo` "method" available:

```text
> bar = new Bar
Bar { bar: 11 }
> bar.boo()
Hu?
```

And here's what's really going to wake you up: THERE IS NO CLASS. Moreover, `bar` is not an in  stance either (in the sense that we might understand or expect from the Java world, for example).

It's _prototypes_ all the way down.

The best thing is that we can employ aspect oriented approaches here, in that even if we're not the owner of `Foo`, we can _add an aspect_, a new behaviour to it, in a totally "late" way:

```text
> Foo.prototype.moo = function(){ return "Not a cow" }
function(){ return "Not a cow" }
```

And through the syntactic sugar and class machinery here, we see that `bar` even now has access to this new behaviour:

```text
> bar.moo()
Not a cow
```

Finally, to underline how fundamental the prototype mechanic is here, Daniel creates another "instance" of `Foo` (`car`), but not how you'd expect:

```text
> car = { __proto__: foo }
Foo {}
> car.bar
11
> car.boo()
Hu?
```

Boom!

 
## Reflection in the cds REPL

Directly after this, at around [38:40][21], Daniel jumps into the cds REPL to demonstrate how much of this is also reflected in CDS model construction. He almost immediately reaches for the relatively new `.inspect` cds REPL command (which we saw both in a [previous episode of this series][22] and also in [part 2 of the mini-series on CAP Node.js plugins][23]), which in turn reveals a whole series of `LinkedDefinitions`.

These `LinkedDefinitions` are iterables, and if you want to know more about how to embrace them, for example using destructuring assignments or the `for ... of` and `for ... in` statements see the [Digging deeper into the Bookshop service][24] section of the notes to part 2 of this series.

## Reflection in CDS modelling

Launching from the fundamental prototype approach which we've explored now, Daniel connects the dots for us by revisiting some common[<sup>4</supp>](#footnote-3) aspects (`managed` and `cuid`) to show how the prototype approach brings the ultimate in aspect-based flexibility.

In particular, he relates a situation where the `managed` aspect wasn't quite enough for what was required - the project design required the ability to store a comment on what was changed, in addition to actually tracking that it was changed. 

And guess what? In _exactly the same way_ as `moo` was added to `Foo` as a late injected aspect earlier, despite the lack of actual "ownership" of `Foo`:

```javascript
Foo.prototype.moo = function(){ return "Not a cow" }
```

... the new element `boo` was added to the `managed` aspect, again, despite the lack of actual "ownership" of that aspect or its wider context (`@sap/cds/common`):

```cds
extend managed with {
  boo : String;
}
```

This is art and science coming full circle in a beautiful parallel, and was well worth revisiting since Daniel talked about it earlier in the series, and which I subsequently blogged about in [Flattening the hierarachy with mixins][26].

This time around though, we are better informed to grok how CDS modelling reflects the fundamental building blocks of the computer science upon which it is built, and the obvious relationship bursts forth from the editor.

## Extensible means extensible

Following this completed circle, Daniel then expands on the extension by showing that effectively anything is possible, by specifying that the element in the extension should actually be a relationship to a complex object. On the way, we are taught how to think in flexible rather than rigid terms, using CDL features that we actually already know.

The starting scenario is that the "bookshop" service has a couple of entities `Books` and `Authors`, each of which are extended via the `managed` aspect:

```cds
entity Books : managed {
  descr  : localized String(1111);
  author : Association to Authors @mandatory;
  ...
}

entity Authors : managed {
  key ID : Integer;
  name   : String(111) @mandatory;
  ...
}
```

With this addition of an element via the extension to the `managed` aspect:

```cds
extend managed with {
  boo : String;
}
```

each of `Books` and `Authors` would have this `boo` element too.

### The wrong way

But what happens when that element should be something more complex, like a change list:

```cds
entity ChangeList : {
  key ID    : UUID;
  timestamp : Timestamp;
  user      : String;
  comment   : String;
}
```

That looks reasonable, so let's modify the additional element to relate to this. Something like:

```cds
extend managed with {
  changes : Composition of many ChangeList on changes.book = $self;
}
```

The problem with this is it's both brittle and inflexible as we now also need to add an element in the `ChangeList` entity to be a back pointer:

```cds
entity ChangeList : {
  Book      : Association to Books;
  key ID    : UUID;
  timestamp : Timestamp;
  user      : String;
  comment   : String;
}
```

Oops - and also one for `Authors`:

```cds
entity ChangeList : {
  Book      : Association to Books;
  Authors   : Association to Authors;
  key ID    : UUID;
  timestamp : Timestamp;
  user      : String;
  comment   : String;
}
```

Where will this end? Well, not only is it brittle and inflexible ... it's also wrong, because this aspect extension is now inextricably tied up with references to random entities to which the aspect itself has been applied.

And how could that ever work, when you factor [time][33] into the equation? Who knows what future entities you might have and want to extend with the `managed` aspect? And let's not even think about trying to address this with [polymorphic associations][28]. And not even coming up with a generic `parent : <sometype>` is going to work either.

As my sister Katie is fond of saying: _How about "no"?_.

And not only that, but you'll still have the ugliness of what I feel are the CDS model relationship equivalents of impure functions, that have "side effects", relationships pointing to somewhere outside their scope. I am minded to think about the myriad patch cables that connect different modules on a modular synth, much like the one shown in this classic photo by [Jim Gardner][29], courtesy of Jim and [Wikipedia][30]:

![Steve Porcaro of Toto with a modular synthesizer in 1982][31].

_(Yes, that's Steve Porcaro of Toto, keyboard playing brother of Jeff Porcaro, creator of possibly the coolest drum pattern ever, the [Rosanna shuffle][32])_.

### The right way

Staying in the early 80's for a second (Rosanna was from Toto's 1982 album "Toto IV"), we can be mindful of the exhortation taken from the title of Talking Heads' classic studio album from 1980, and "[Remain in Light][34]", i.e. adhere to the concept of aspects, rather than tie ourselves up with what is nearer to classes (objects) and relationships. 

Reframing the complex object requirement in aspect terms:

```cds
aspect ChangeList : {
  key ID    : UUID;
  timestamp : Timestamp;
  user      : String;
  comment   : String;
}
```

means that we just need a simpler managed relationship:

```cds
extend managed with {
  changes : Composition of many ChangeList;
```

and, in Daniel's words (at around [49:33][35]) - "we're done".

Behind the scenes there's still an entity, in the shape of the aspect defined here, but that entity is added by the compiler, as Daniel shows when he pulls back the curtain (via the [Preview CDS sources][36] feature in the VS Code extension) to reveal an entity (a "definition") named:

```text
sap.capire.bookshop.Books.changes
```

made up from:

* the namespace `sap.capire.bookshop`
* the entity name `Books`
* the element `changes`

The eagle-eyed amongst you will also have of course spotted the `Authors` equivalent in that definition list too, as `Authors` was also adorned with the `managed` aspect:

![definitions][37]

In generating this entity, the compiler also adds an element to point back, and because this work is at compile time, and individually specific to each primary entity (`Books` and `Authors` here) it can be specific and precise. This is what the YAML representation of the CSN based on the model looks like, for the `changes` element relating to the `Books` entity:

```yaml
sap.capire.bookshop.Books.changes:
  kind: entity
  elements:
    up_:
      key: true
      type: cds.Association
      cardinality: {min: 1, max: 1}
      target: sap.capire.bookshop.Books
      keys: [{ref: [ID]}]
      notNull: true
    ID: {key: true, type: cds.UUID}
    timestamp: {type: cds.Timestamp}
    user: {type: cds.String}
    comment: {type: cds.String}
```

This is a lovely example of the truth, the reality, underpinning the general idea that with aspect oriented programming: "you can extend everything that you can get access to, whether it i
s your definition or somebody else's definition or even your framework's definition". And that extension will be applied to the appropriate usages of that definition.

Daniel goes further to emphasise that while this (deliberately simple) example was in the same `schema.cds` file, the definitions and extensions can be stored in separate files, used in CDS plugins, and so on. In fact, this is exactly how the [Change Tracking Plugin][38] works.

Note that this was a named aspect (the name is `ChangeList`) but the same modelling outcome could have been effected using an anonymous aspect, like this:

```cds
extend managed with {
    changes : Composition of many {
    key ID    : UUID;
    timestamp : Timestamp;
    user      : String;
    comment   : String;
  };
}
```




---

<a name="footnotes"></a>
## Footnotes

<a name="footnote-1"></a>
1. Battle scars.

<a name="footnote-2"></a>
2. For more on `reduce` and how it is such a fundamental building block, see [reduce - the ur-function][15].

<a name="footnote-3"></a>
3. Martin's post [Anemic Domain Model][19] is from 2003 and rather cutting but definitely worth a read, as is the [Wikipedia article on the same topic][20].

<a name="footnote-4"></a>
4. Literally (as many of us use them in our own projects) and technically (as they're supplied in `@sap/cds/common`) - see [Common Types and Aspects][25] in Capire.


[1]: https://www.youtube.com/watch?v=r_mxsBZSgEo
[2]: /blog/posts/2024/12/06/the-art-and-science-of-cap/
[3]: /blog/posts/2024/12/20/tasc-notes-part-6/
[4]: https://www.youtube.com/watch?v=r_mxsBZSgEo?t=1105
[5]: /blog/posts/2024/11/08/flattening-the-hierarchy-with-mixins/
[6]: https://cap.cloud.sap/docs/about/bad-practices
[7]: https://cap.cloud.sap/docs/about/bad-practices#tons-of-glue-code
[8]: https://cap.cloud.sap/docs/about/best-practices#the-calesi-pattern
[9]: /blog/posts/2024/11/07/five-reasons-to-use-cap/#1-the-code-is-in-the-framework-not-outside-of-it
[10]: https://www.youtube.com/watch?v=r_mxsBZSgEo?t=1617
[11]: https://hpi.de/en/
[12]: /images/2025/02/NeXTcube.jpg
[13]: https://commons.wikimedia.org/wiki/File:NEXT_Cube-IMG_7154.jpg
[14]: https://en.wikipedia.org/wiki/MapReduce
[15]: /blog/posts/2024/07/23/reduce-the-ur-function/
[16]: https://cap.cloud.sap/docs/about/best-practices#services
[17]: https://cap.cloud.sap/docs/about/best-practices#data
[18]: https://deviq.com/domain-driven-design/anemic-model
[19]: https://martinfowler.com/bliki/AnemicDomainModel.html
[20]: https://en.wikipedia.org/wiki/Anemic_domain_model
[21]: https://www.youtube.com/watch?v=r_mxsBZSgEo?t=2320
[22]: /blog/posts/2024/12/10/tasc-notes-part-4/#the-repl
[23]: /blog/posts/2025/01/10/cap-node.js-plugins-part-2-using-the-repl/#exploring-the-cds-facade
[24]: /blog/posts/2025/01/10/cap-node.js-plugins-part-2-using-the-repl/#digging-deeper-into-the-bookshop-service
[25]: https://cap.cloud.sap/docs/cds/common
[26]: /blog/posts/2024/11/08/flattening-the-hierarchy-with-mixins/
[27]: https://www.windowmaker.org/
[28]: https://en.wikipedia.org/wiki/Polymorphic_association
[29]: https://www.flickr.com/photos/jamesthephotographer/120916737/
[30]: https://commons.wikimedia.org/w/index.php?curid=1737148
[31]: /images/2025/02/modular-synth.jpg
[32]: https://en.wikipedia.org/wiki/Rosanna_shuffle
[33]: https://www.youtube.com/watch?v=ScEPu1cs4l0
[34]: https://en.wikipedia.org/wiki/Remain_in_Light
[35]: https://www.youtube.com/watch?v=r_mxsBZSgEo?t=2973
[36]: https://cap.cloud.sap/docs/tools/cds-editors#preview-cds-sources
[37]: /images/2025/02/definitions.png
[38]: https://github.com/cap-js/change-tracking
