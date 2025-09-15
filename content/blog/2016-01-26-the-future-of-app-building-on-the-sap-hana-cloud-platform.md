---
title: The future of app building on the SAP HANA Cloud Platform
date: 2016-01-26
tags:
  - bluefinsolutions
---

The SAP HANA Cloud Platform, or HCP for short, is multi-faceted, and you need to realise that now. Here's my take on one particular facet. Read on to find out what that is, and for a link to an episode of The HANA Effect podcast where I discuss this and more.

As it might be too obvious to compare it with the multi-faceted nature of a diamond, I'm going to compare HCP instead with the trusty 20-sided die that played a big part in my youth, as the random number generator for role playing games such as Dungeons & Dragons.

![20 sided die](/images/2016/01/20-sided-die.png)

So in the context of SAP and the cloud, I roll the die, and land a 20. Let's look up what that translates to. Ah yes, the Java runtime on HCP. As the documentation says:

_"You can develop applications for SAP HANA Cloud Platform just like for any application server. SAP HANA Cloud Platform applications can be based on the Java EE Web application model. You can use programming logic that is well-known to you, and benefit from the advantages of Java EE, which defines the application frontend. Inside, you can embed the usage of the services provided by the platform."_

This already counts for a lot on your scorecard - let's look at why.

## Expanding the SAP application ecosphere

The nature of the [UI5 toolkit](/blog/posts/2012/05/07/sapui5-the-future-direction-of-sap-ui-development/) and the architecture behind how Fiori apps are built already open up the SAP application ecosphere to the wider world of application developers, due to the adoption of open standards plus a language and programming model (HTML5) that is well-known to large groups of non-SAP developers.

In the same way, this Java Enterprise Edition (EE) Web application model that is supported by HCP opens up the platform to many a talented group of developers who may not know much about, say, ABAP and traditional R/3 architecture, but can certainly build apps that can now, in the context of your cloud or hybrid SAP landscape, add value and turn innovative business ideas into reality.

SAP embraced Java a long time ago, and now that relationship has matured, we see a couple of things: SAP's investment in the Java Virtual Machine (JVM), and in the Java development and runtime ecosphere. Let's examine the first of these two.

## The JVM

Like the mythical centaur, the HCP has two hearts, one of which is the JVM - the target runtime platform for those Java applications that we're contemplating right now.

Java is a language that compiles to bytecode, an instruction set for the Java virtual machine (VM) which is the equivalent of machine code for an actual machine. And I would posit that it is not only the adoption of Java as a language specification amongst enterprises the world over, but also the ubiquity of Java's runtime environment, the JVM, where Java applications can run, that is behind the real success of this language and community. (There's a parallel here with web browsers being a hugely distributed platform for executing JavaScript, but that's a story for another time).

In fact, I would suggest that rather than just Java per se, it's actually the JVM as a target runtime that makes SAP's HCP shine as a platform for business applications. And here's why.

## Beyond Java

The ubiquity of the JVM has not unsurprisingly attracted language developers to view it as a runtime platform for their particular languages. Today it's not just applications written in Java that can run on the JVM. There are many languages, some of them rather important, that compile to Java bytecode, and therefore - as far as the JVM is concerned, are equal execution candidates. You can peruse these [JVM languages on Wikipedia](https://en.wikipedia.org/wiki/List_of_JVM_languages), but here are a few that come to mind:

Clojure - a dialect of Lisp which champions functional programming and immutability.

Scala - an object oriented language with functional programming aspects.

JRuby & JPython - JVM versions of the well-known Ruby and Python languages.

Functional programming is a particular focus of mine right now, for many reasons (one being the ability to build solid code where whole classes of errors just don't exist), and so I have already been experimenting with Clojure apps on the HCP platform. But more generally, if your enterprise has different teams of developers -- it's not atypical to see "SAP developer teams" and "others" -- the SAP HANA Cloud Platform may be the shared runtime catalyst for closer collaboration and mindshare for your next generation of enterprise applications.

## Final word

At SAP TechEd EMEA 2015 in Barcelona, I had the honour of talking to SAP's Jeff Word, as a guest on his show [The HANA Effect](http://web.archive.org/web/20180302075837/http://hana.sap.com/customers/hana-effect-podcast.html). We discussed HCP, these JVM related considerations, functional programming, and more. If you're interested in hearing the show and finding out more about the future of HCP-powered development, head on over to our podcast episode 38 "Proudly hacking since 1987" and have a listen. The future of SAP enterprise applications is a good place!

---

[Originally published on the Bluefin Solutions website](http://web.archive.org/web/20180302075837/http://www.bluefinsolutions.com/insights/dj-adams/january-2016/the-future-of-app-building-on-the-sap-hana-cloud-p)
