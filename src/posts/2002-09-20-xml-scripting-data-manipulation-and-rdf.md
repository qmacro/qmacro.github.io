---
layout: post
title: XML Scripting, data manipulation, and RDF
tags:
- rdf
- rest
- xml
---


I’ve just read [Jon’s latest post on XML Scripting](http://weblog.infoworld.com/udell/2002/09/20.html), which mentions Adam Bosworth’s thoughts about an XML scripting language that could natively support XML.

While the advent of XML scripting sounds fascinating, I’ve also been wondering about [RDF](http://www.w3.org/RDF/ "RDF (Resource Description Framework)") enabling us to “gracefully integrate with the world of objects” and enhance the “self-describing nature of XML”. Yes, it’s my current area of interest (read: I’m vacuuming as much information as I can about it right now), and this by itself is likely to taint my vision somewhat. But reading what was quoted from Adam immediately made me think of some of RDF’s features (or should I say ‘nature’, I guess I’m not trying to sell it):

- in its XML incarnation, RDF can describe the XML data it ornaments
- it’s core nature (and through association the nature of the XML described by it) is object-orientated: things in RDF are either (instances of) classes, properties, or values of properties
- the concept and use of namespaces is a key strength of RDF and one on which it relies. Shared semantics, and the classes and properties by which such semantics are conveyed, are surely important when attempting to “convert from one XML format to another” and “synthesize complex XML documents for [from?] multiple sources”

Now it’s clear that XML is not RDF. There’s the bootstrapping issue with RDF applications of which we’re all aware. There’s no magic wand, but there are ways (such as transformations to wring out RDF essence from ‘flat’ XML) to get going. And in the context where [REST](http://internet.conveyor.com/RESTwiki/moin.cgi/FrontPage "The REST Wiki's front page"), web services, business data, and the focus on *resources* (URIs) intersect, RDF – as a technology for describing, sharing and linking business data – seems too significant to ignore.

Going back to Adam’s quote that sparked this post, I am curious about the ‘native support’ of XML as a data type; my limited imagination cannot see how that might happen without some sort of serialization/deserialisation (will a term like ‘serdes’ be this decade’s equivalent of ‘modem’?). I am ready and willing to be enlightened :-) The great thing about RDF is that there is already a bounty of software (storage mechanisms, model and query tools, serializers and deserialisers) that can work with RDF in many existing programming languages.

Anyway, plenty to ponder. Life is good.


