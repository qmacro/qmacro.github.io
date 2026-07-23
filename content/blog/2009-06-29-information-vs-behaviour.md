---
date: 2009-06-29
title: Information vs Behaviour
tags:
- architecture
- rest
- roa
- soa
description: Architectures, axioms and ROA vs SOA.
---

I read a couple of chapters of two different books recently:

- Ch.5 of O’Reilly’s “[Beautiful
  Architecture](http://oreilly.com/catalog/9780596517984/)“: *Resource-Oriented
  Architectures: Being ‘In The Web’* by Brian Sletten
- Ch.1 of Manning’s “[SOA Patterns](http://www.manning.com/rotem/)“: *Solving
  SOA Pains With Patterns* by Arnon Rotem-Gal-Oz, Eric Bruno, and Udi Dahan
  (from a free online Early Access Program)

In these chapters, there were points made that stood out for me and underlined
the fact that the two approaches of Resource Oriented Architecture (ROA) and
Service Oriented Architecture (SOA) are mostly diametrically opposed, along the
axes of **information** and **behaviour**. I’ve been saying for a while, and
indeed [recently](/tweets/qmacro/status/2332492780), that the data in an
enterprise is a key asset of any corporation, and should be treated as such.
Information should be secure, available, and above all *addressable*. As Brian
says:

> “We like giving names to things because we are fundamentally name-oriented
> beings”

Information elements should be first class citizens on the web, not relegated
to anonymous lumps of data only accessible indirectly through opaque service
endpoints. Those IT departments that enable uniform, transparent, controlled
and consistent access to a corporation’s data, especially across a complex
system landscape, are the ones that are in line to give their business the
greatest benefit.So it was with great delight (and fervent agreement) that I
read, in “Beautiful Architecture”, Brian’s eloquent description of how the IT
industry uses:

> “... the wrong abstractions internally, overemphasising our software and
> services and underemphasising our data”

and proceeds to describe how an information centric approach is more
appropriate.Then, only a day later, I read, in “SOA Patterns”, about the
challenges of SOA — in particular:

> “how do you solve the BI / SOA impedance mismatch of getting a centralised
> view of the data in an architectural style that encourages encapsulation and
> privacy?”

Impedance mismatch! Yes, my point entirely!The *behaviour-focused* approach of
SOA, diametrically opposed to the *information-focused* approach of ROA, is a
natural barrier to leveraging an enterprise’s key asset — information, and in
this case *Business Intelligence*.
