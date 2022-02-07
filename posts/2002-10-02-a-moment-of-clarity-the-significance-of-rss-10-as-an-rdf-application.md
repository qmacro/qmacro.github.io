---
layout: post
title: 'A moment of clarity: The significance of RSS 1.0 as an RDF application'
tags:
- rdf
- rss-tag
- xml
---


Walking on the beach this morning (yes we’re on holidays) I suddenly had a moment of clarity. It may be obvious to you, but I’ve been struggling to see what the theme was that lay beyond the clutter of the investigations into RDF and RSS, the [contemplation of namespaces](/2002/09/21/more-thoughts-to-ponder/) and the various recent discussions on namespaces in comments to posts on [Ben’s](http://rss.benhammersley.com/), [Shelley’s](http://weblog.burningbird.net/), [Sam’s](http://www.intertwingly.net/blog), and doubtless others’ weblogs (all too much to keep track of).

I’d been contemplating what a namespace-aware XML parser for [RSS 1.0](http://www.purl.org/rss/1.0/ "RSS (RDF Site Summary)") would look like, and how it would work in relation to the [RSS modules](http://web.resource.org/rss/1.0/modules/). (Of course for Perl programmers, for example, there’s the [XML::RSS](http://search.cpan.org/author/EISEN/XML-RSS-0.96/RSS.pm) parser on CPAN, which is namespace aware but relies on the RSS 1.0 namespace being the *default* namespace — in other words, if you specify a prefix for the RSS 1.0 namespace, say, “rss10″, rather than have it as the default namespace in the document, and prefix the RSS 1.0 elements with this prefix (“rss10:channel”, “rss10:item”, etc) then XML::RSS isn’t going to like it. But I digress…)

While namespace-aware XML parsing is indeed important, and namespaces are fundamental to RDF, the importance of handling namespaces correctly when parsing had clouded a question that I knew existed but hadn’t all the right words in the sentence, until now.

“What is the significance of RDF in RSS?” Actually, that’s not quite right.

While I’ve been looking at [the RDF in RSS](/2002/09/08/the-rdf-in-rss/), I’ve been concentrating on the bits that ‘look like’ RDF — the stuff that I highlighted in bold in the [example RSS](../../2002/Sep/08#tech/rdf/rssrdf) (rdf:about, rdf:Seq, and so on). But it’s not as if there are some ‘bits’ of RDF in a format that’s RSS … the format RSS 1.0 *is* an RDF application. In other words, *all* of RSS 1.0 is RDF. The fact that it’s very similar to non-RDF RSS formats like 0.91 is of course an intended advantage. And the fact that the ‘transportable form’ that RDF takes is XML (RDF can be expressed in node/arc diagrams, or other forms such as [Notation 3](http://www.w3.org/2000/10/swap/Primer.html), or ‘N3′) also makes it nicely ‘compatible’.

“So what?”, I hear you ask.

Well, I’ve been wondering how complicated an XML parser (yes, a namespace aware one, but that’s not significant here) would have to get to support the plethora of RSS 1.0 modules available now and in the future. To be more specific, let’s take an example. Consider the **creator** property (element) from the [Dublin Core (dc)](http://purl.org/rss/1.0/modules/dc/) module. The property is normally used by specifying a literal (a string) as its value, thus:

```
<dc:creator>DJ Adams</dc:creator>
```

But what about [rich content model](http://web.resource.org/rss/1.0/modules/#s3.2) usage of properties? Consider the use of this property in the [discussions](http://rss.benhammersley.com/archives/001391.html#001391) of how to splice [FOAF](http://xmlns.com/foaf/0.1/) with RSS. Dealing with a new element from a defined namespace, where the usage is of the *open tag – literal value – close tag* variety, is not that difficult when parsing based on XML events. But what about this, which is based on one of the suggestions from Dan Brickley in the discussion and further discussed [on the rdfweb-dev list](http://groups.yahoo.com/group/rdfweb-dev/message/293):

```
<dc:creator> <foaf:Person> <foaf:Name>DJ Adams</foaf:Name> <foaf:seeAlso rdf:resource='...' /> ... </foaf:Person> </dc:creator>
```
Suddenly having to parsing this, as opposed to the simple ‘literal value’ example, is a whole new ballgame in state management (“where the hell am I *now* in this XML document and what do I do with these tags?”), and at least for this author, writing an XML parser to cope with all such data eventualities would be rather difficult in the context of XML-event based parsing.

But that’s just it. Considering an *XML* parser is missing the point. An *RDF* parser is more appropriate here. Looking at the structure of RSS 1.0 and the modules available for it from an RDF point of view suddenly made things clear for me. With RDF, the [striped](http://www.w3.org/2001/10/stripes/) nature of the information encoded in XML is neatly parsed, regardless of difficult-to-predict hierarchical complexity, and translated into a flat set of triples (subject, predicate, object) that you can then interrogate. What you do with that information is then up to you.

There are many RDF tools, including parsers, listed on [Dave Beckett’s](http://www.purl.org/net/dajobe/) [RDF resource site](http://www.ilrt.bristol.ac.uk/discovery/rdf/resources/). One of them is [Redland](http://www.redland.opensource.ac.uk/), his own RDF toolset. Just before I bring this post to a conclusion, let’s have a look at what the RDF parser in Redland produces for the two **creator** examples earlier.

Simple literal value example gives:

```
{[//qmacro.org/about], [http://purl.org/dc/1.1/elements/creator], "DJ Adams"}
```

In other words:

```
    /--------  creator   +----------+     | qmacro |----------->| DJ Adams |     --------/            +----------+
```

Complex FOAF element structure example gives:

```
{[//qmacro.org/about], [http://dublincore.com/creator], (genid1)} {(genid1), [http://www.w3.org/1999/02/22-rdf-syntax-ns#type], [http://foaf.com/Person]} {(genid1), [http://foaf.com/name], "DJ Adams"} {(genid1), [http://www.w3.org/2000/01/rdf-schema#seeAlso], [http://www.pipetree.com/~dj/foaf.rdf]}
```

In other words:

```
                                     type      /--------                                +-------------->| Person |                                |               --------/                                |     /--------  creator   /----------    name      +----------+     | qmacro |----------->|  genid1  |------------->| DJ Adams |     --------/            ----------/              +----------+                                |                                |               /----------                                +-------------->| foaf.rdf |                                     seeAlso    ----------/
```
(Whee! ASCII art RDF diagrams :-)

So what conclusion is there to draw from this bit of rambling? For me, it’s the emphasis on *RDF*, rather than *XML*, of RSS (and in fact the subtle relationships between those three things) that is significant in itself, especially when one considers the journey to data richness that seems to demand complex (and tricky-to-parse) XML structures. And what’s more, it’s not specifically RSS that wins here. It’s *any* RDF application.


