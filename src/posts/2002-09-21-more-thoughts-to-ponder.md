---
layout: post
title: More thoughts to ponder
tags:
- rdf
- rss-tag
---


Here are two or three, er, thoughtbites, that I’ve come across over the past few days and that have stayed with me. I just thought I’d share them here as it’s the weekend and often a good time to think about things.

**Open thinking about deep-linking**

Tim Bray’s [strawman defence](http://www.w3.org/2001/tag/ilist#deepLinking-25) of the principle that ‘deep linking’ on the web isn’t illegal. It’s a wonderfully calm and simple aspirin for the anger and frustration that builds up inside when one reads about silly legal action about ‘deep-linking’.

**RDF, define thyself**

In Sean B. Palmer’s document [The Semantic Web: An Introduction](http://infomesh.net/2001/swintro/) (highly recommended!), RDF Schema is [introduced](http://infomesh.net/2001/swintro/#simpleData), using (amongst other things) this snippet of RDF (read “rdf:type” as “is a”):

```
rdfs:Resource rdf:type rdfs:Class . rdfs:Class rdf:type rdfs:Class . rdf:Property rdf:type rdfs:Class . rdf:type rdf:type rdf:Property .
```

I don’t know about you, but I had to go and have a sit down to consider the implications after reading that.

**Using namespaces in code**

Last week on [#rss-dev](irc://irc.openprojects.net/rss-dev), Ken MacLeod pointed to a [post](http://lists.w3.org/Archives/Public/xml-names-editor/2002May/0009.html "A Plea For Sanity") by Dan Connolly regarding namespaces. Ken [said](http://www.peerfear.org/chump/rss-dev/2002/09/12/2002-09-12.xml):

> A very key point (I think) drawn out in this article is that namespaces are used only to derive a (URI+localname) pair — namespaces should never be considered seperate from the element name they specify. … A namespace and localname make a single item of data, distinct from any other combination of namespace and localname.

> Libraries and applications (tools) should not try to store a namespace as one “object” and try to link all of the names as “children” of those objects. So, if you’re working in a language that’s string-happy, like Tcl or Perl, the first thing you should do is take the namespace and element name and put them together and use them like that from then on, “{URI}LocalName” works well in Perl, for example.

Sounds obvious when you grok it, but (for me at least) it was a refreshing way to look at the whole issue of namespaces and how they’re represented in XML and used in deserialised data structures.

