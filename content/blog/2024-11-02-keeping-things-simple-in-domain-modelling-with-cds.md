---
title: Keeping things simple in domain modelling with CDS
date: 2024-11-02
tags:
  - cds
  - cap
  - tasc
  - gems
---
When embracing domain modelling with CAP, keep things simple. One of the greatest benefits of domain modelling done properly is having a domain expert on the team. Don't forget that domain expert, that key user, when building out the domain model.

What does that mean in practice? Here are two examples that Daniel gave in [the inaugural episode of The Art & Science of CAP][1]. 


## Use structured types with care

At around 28 mins in, Daniel gave this example about avoiding the temptation to introduce structured types.

Let's say we start with this entity definition after the first domain modelling iteration:

```cds
entity Books : managed {
  ...
  stock    : Integer;
  price    : Decimal;
  currency : Currency;
  ...
}
```

If on the next iteration further monetary elements were to be added, say `totalprice` and `netprice`, then the modelling expert would be tempted to abstract that combination of value and currency into a structured type, something like this:

```cds
type Money {
  amount   : Decimal;
  currency : Currency;
}
```

and then use it to describe each of the monetary elements like this:

```cds
entity Books : managed {
  ...
  stock      : Integer;
  price      : Money;
  totalprice : Money;
  netprice   : Money;
  ...
}
```

While that seems appealing, it's only appealing to the modelling expert, certainly not the domain expert.

Moreover, and perhaps more subtly too, the introduction and use of this structured type brings about extra work: now, one must explicitly ensure that the value of each of the currency elements `price.currency`, `totalprice.currency` and `netprice.currency` is the same!

Embracing the [KISS principle][2] and simply having a single `currency` element at the same level swings the pendulum back in the right direction -- towards the domain expert -- and also removes the currency matching burden that was introduced by the use of the structured type:

```cds
entity Books : managed {
  ...
  stock      : Integer;
  price      : Decimal;
  totalprice : Decimal;
  netprice   : Decimal;
  currency   : Currency;
  ...
}
```

Of course, [CAP does support the definition and use of structured types in your CDS model][3], but just because facilities are there, it doesn't mean you have to use them all the time. There are other principles that are more important. And in domain modelling, KISS is one of them.

## Avoid the 'foo:Foo' practice

While a certain [famous Manchester drag queen & nightclub owner][4] (RIP) might have something different to say here, defining a type for each of your elements is not considered good practice in CAP. In other words, don't automatically define a `Foo` type to describe your `foo` element. Or, to take the example Daniel gave, don't do this:

```cds
type Stock : Integer;
type Price : Decimal;

entity Books : managed {
  ...
  stock    : Stock;
  price    : Price;
  currency : Currency;
  ...
}
```

Doing this moves away from the KISS principle, because we now have to jump from:

```cds
stock : Stock;
```

to this:

```cds
type Stock : Integer;
```

to see what the `stock` element really is underneath. More complicated than it needs to be.

> An important principle in domain modelling in CAP is keeping "non-important" details out of sight (CDS's [aspects][5] concept plays an important role here). So one might be tempted to argue that the fact that the `stock` element is an `Integer` is not important. But there's a level beyond which we shouldn't really descend, and I think that CAP's [built-in types][6] feels right as the common currency (no pun intended) between modeller and domain expert and a comfortable shared level.

As Daniel said: "_Keep your world ... as flat as the Earth_" :-)

Of course, there are times when reuse types bring benefits. Here, where the reuse ratio is 1, it is unnecessary and over-complicated. Where the reuse ratio is a lot higher, then it starts to make sense.

Talking of "reuse of types", there's another way that is possible in CDS, without even defining a type explicitly, but by thinking of `:` to mean "inherits from", and considering that everything in CDS is just a definition. But that detail is for another post.


[1]: https://www.youtube.com/watch?v=XMchiFnDJ6E
[2]: https://en.wikipedia.org/wiki/KISS_principle
[3]: https://cap.cloud.sap/docs/cds/cdl#structured-types
[4]: https://en.wikipedia.org/wiki/Foo_Foo_Lammar
[5]: https://cap.cloud.sap/docs/cds/cdl#aspects
[6]: https://cap.cloud.sap/docs/cds/types
