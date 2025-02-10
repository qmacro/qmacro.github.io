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

Talking of staleness and "glue code" (technical non-domain code), another key philosophy driving CAP's design and realisation here is the idea that application developers should ... develop the application, and not the technical aspects of bringing that application to bear. In other words, tenant isolation, database management, security, protocol-level service integration and so on. In fact, the entire idea of CAP's [Calesi Pattern][8] (CAP-level service integration) fits squarely into the space that this philosophical approach is carving out for us - the provision of CAP client libraries for BTP platform services that are designed to drastically reduce boilerplate and purely technical code.

Another aspect of why [keeping the code inside the framework][9] is important is eloquently expressed by Daniel: as builders of enterprise applications, we not only have to ensure our code scales, but also our teams and the output from those teams. Taking care of the important non-domain-specific aspects of building such enterprise applications not only removes the tedium but also the chance for error and the possibilities for varying and ultimately chaotically different approaches across different teams (think about how SAP-delivered UI5 based Fiori apps have standard layouts, and why Fiori elements came about).

## Revisiting some of CAP's solid science foundations

At around [25:17][10] Daniel shared some slides that he'd compiled for a recent meeting at the [Hasso Plattner Institute][11] on CAP.

> I couldn't help notice Daniel's pedigree; I mean, many of us already know Smalltalk runs through his veins, and perhaps knew, or at least suspected, that he has had enough experience (read: battle scars) with Java and JEE to ensure that CAP exudes good practices and eschews bad ones ... in the right way ;-)
>
> And I was delighted to learn that he also has been touched by NeXTSTEP - an object-oriented OS that also happened to sport a graphical desktop manager that is one of my favourites (and which lives on in the form of Window Maker. Of course, I'm assuming you realise that NeXTSTEP was created for the machines upon which the Web was invented - it was on a NeXTcube that Tim Berners-Lee wrote the first versions of client and server software.
> ![A NeXTcube][12]
>
> _([Photo courtesy of Wikimedia Commons][13])_

Daniel jumps from Smalltalk to Lisp (the latter influenced the former) which is the "hero language" of functional programming, one of the key science pillars of CAP. It's hard to sum up decades of computing and computer science here, but I can sleep easy knowing that the good parts are in CAP and those parts that were ultimately discovered to be not so good ... are not. In the abstract-all-the-things mania of the 90's we had CASE and UML (and the corresponding code generation machinery that went with that) and by and large this has now been shown, over and over again, to be a noble but ultimate wrong direction.

Ironically, or at least in stark contrast, we have functional programming and the simplicity of treating data as data (passive), which in turn allows us to think about immutability. And things that cannot move ... cannot break. Not only that, but we can process large quantities of data with simple pipelines, such as [MapReduce][14], which is a scalable and relatively efficient way of analysing data in a chain of steps that are each horizontally scalable (and yes, the name comes from two classic functions `map` and `reduce`[<sup>1</sup>](#footnote-1) that are building blocks in many functional programming approaches.

Core functional programming tenets such as immutability and also the related concept of pure functions (those that are side-effect free, a quality that allows mechanisms such as function chains (such as ones used in MapReduce) are consequently found in CAP too:

* [Services][16] are stateless
* [Data][17] is passive and in varying shapes

On the topic of passive data, Daniel relates the story of an esteemed colleague extolling the virtues of _non-anemic_ objects, while Daniel himself takes the opposite approach. While the [anemic][18] term is an established one, it comes from a pejorative view, held not least by luminaries such as Martin Fowler [<sup>2</sup>](#footnote-2), and I suggest we use a different, more positive term for what we're striving for here. "Pure objects", anyone?

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

The `boo` "method" is also available on `foo`:

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

Finally, to underline how fundamental the prototype mechanic is here, Daniel creates another "instance" of `Foo`, but not how you'd expect:

```text
> car = { __proto__: foo }
Foo {}
> car.bar
11
> car.boo()
Hu?
```

Boom!

 
// GOT TO 38:40





---

<a name="footnotes"></a>
## Footnotes

<a name="footnote-1"></a>
1. For more on `reduce` and how it is such a fundamental building block, see [reduce - the ur-function][15].

<a name="footnote-2"></a>
2. Martin's post [Anemic Domain Model][19] is from 2003 and rather cutting but definitely worth a read, as is the [Wikipedia article on the same topic][20].


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
