---
layout: post
title: The case of the missing rdf:Description
tags:
- rdf
---


RDF is a framework for describing resources. We know that. We also know (from various sources, such as the [RDF Model and Syntax Specification](http://www.w3.org/TR/REC-rdf-syntax "W3C Spec"), or Pierre-Antoine Champin’s [RDF Tutorial](http://www710.univ-lyon1.fr/%7Echampin/rdf-tutorial/node23.html) (recommended!)) that an RDF document consists of a number of descriptions, and these descriptions look like this:

```
<rdf:RDF ... > <rdf:Description ... > ... </rdf:Description> <rdf:Description ... > ... </rdf:Description> ... </rdf:RDF>
```

How come then, that instances of two of the more well-known RDF applications, [RSS](http://www.purl.org/rss/1.0/ "RSS (RDF Site Summary)") and [FOAF](http://xmlns.com/foaf/0.1/ "FOAF: Friend Of A Friend Vocab"), don’t seem to reflect this format? Following the root rdf:RDF node and the declarations of the namespaces, we have, respectively:

```
<channel rdf:about="//qmacro.org/about"> <title>DJ's Weblog</title> ... </channel>
```

and

```
<foaf:Person rdf:ID="qmacro"> <foaf:mbox rdf:resource="mailto:dj.adams@pobox.com"/> ... </foaf:Person>
```

What, no rdf:Description? Let’s have a look at what’s happening here. In the RSS example, we have *channel* – or in its fully qualified form *http://purl.org/rss/1.0/channel* – a class, of which *//qmacro.org/about* is declared as an instance with the *rdf:about* attribute.

The RDF [subject-predicate-object triple](../../2002/Sep/08#tech/rdf/rssrdf) looks like this:

```
//qmacro.org/about rdf:type http://purl.org/rss/1.0/channel
```

or in other words “the URI (which is about to be described) is a channel”.

Because RDF is about is declaring and describing resources, it becomes clear that this sort of statement (technically the *rdf:type* triple, above) is very common. And what we saw in the RSS snippet above was the special RDF/XML construction that may be used to express such statements. If we didn’t have this special construction, we’d have to write:

```
<rdf:Description rdf:about="//qmacro.org/about"> <rdf:type rdf:resource="http://purl.org/rss/1.0/channel" /> <title>DJ's Weblog</title> ... </rdf:Description>
```

which is a tad long winded. Similarly, the long winded equivalent for the FOAF example would look like this:

```
<rdf:Description rdf:ID="qmacro"> <rdf:type rdf:resource="http://xmlns.com/foaf/0.1/Person" /> <foaf:mbox rdf:resource="mailto:dj.adams@pobox.com"/> ... </rdf:Description>
```

So there you have it. The rdf:Description isn’t there because a special construction is being used in both examples. Many thanks to Jon Hanna for [turning the light bulb on in the first place](http://groups.yahoo.com/group/rss-dev/message/3880 "rss-dev mailing list post").


