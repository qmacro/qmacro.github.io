---
layout: post
title: The RDF in RSS
tags:
- rdf
- rss-tag
---
Ironically, it’s only been the recent and ongoing hubbub about the direction of RSS that’s got me wondering what the real truth is about the RDF in RSS. In a still handwavy sort of way, I understand that RDF is important for the (semantic\|data) web that is to form as a layer above the current writhing disconnected mass of URIs. But I realised I hadn’t really thought much about what the RDF bits of RSS (1.0) were, and much less what they were for. I get the feeling that for most mortals, including me, including RDF in their RSS feeds seemed like building a racing car to do the shopping, and never even taking it out on a track after the shopping was finished. Actually, perhaps some people didn’t even see the racing car as a whole. So I did a little reading and thinking.

The point of RDF is to be able to describe resources. Resource Description Framework. So far so good. But what are resources? They’re things that we can point to on the web – things with URIs (REST axioms, anyone?). With RDF, we can make assertions, state facts, about things. These assertions are always in the form of

> 'this thing' has 'this property' with 'this value'.

These assertions are often expressed as having the form ‘subject-predicate-object’ and are referred to as ‘triples’. RDF exists independently of XML, but what I (and lots of other people) recognise RDF as is its XML incarnation. Here’s a simple example:

```xml
<rdf:Description rdf:about='//qmacro.org/about'>
	<dc:title>DJ's Weblog</dc:title>
</rdf:Description>
```

This makes the assertion that

> the resource at [//qmacro.org/about](../../../qmacro "DJ's Weblog") has a title (as defined in the [Dublin Core](http://purl.org/dc/elements/1.0/ "Dublin Core elements")) with the value “DJ’s Weblog“.

What’s obvious is that *subjects* are URIs. It’s also easy to realise that *objects* can be URIs too – instead of having a Literal (“DJ’s Weblog”) as in the example above, you can have another resource (a URI), for example:

```xml
<foaf:Person rdf:ID="qmacro">
	<foaf:depiction rdf:resource="http://qmacro.org/~dj/dj.png"/>
</foaf:Person>
```

Here, the object, the value of the foaf:depiction property, is a URI ([http://qmacro.org/~dj/dj.png](/~dj/dj.png "DJ's ugly mug")) pointed to directly with the rdf:resource attribute.

But what’s really mindblowingly meta is that the predicate parts of assertion triples, the *properties*, are resources, addressable by URIs, too. Yikes! this means that RDF can be used to describe … RDF. In case you’re wondering, the properties (*dc:title*, *foaf:depiction*) don’t look like URIs, but they are URIs in disguise – the URI for each property is made up from the namespace qualifying the XML element name, and the element name fragment on the end of that. So for example, the *dc* namespace http://purl.org/dc/elements/1.1/, plus the element name *title*, gives:

> [http://purl.org/dc/elements/1.1/title](http://purl.org/dc/elements/1.1/title)

Anyway, the point of RDF here is to be able to make connections between things on the web. To define, or describe, relations between things; to add richness to the data out there – to declare data about the data. If we, or our machines, can understand things about the data we’re throwing around, the world will be a better place for it. And to all those meta-data agnostics out there, ask yourself this – where would the database world be without data dictionaries?

So, what about these triples that exist in RSS 1.0? They’re just to add a layer of richness, a seam to be mined by RDF-aware tools. Let’s have a look at a simple RSS 1.0 file. I’ve highlighted the RDF bits (slightly cut to fit):

```xml
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/">
	<channel rdf:about="//qmacro.org/about/xml">
		<title>DJ's Weblog</title>
		<link>//qmacro.org/about</link>
		<description>Reserving the right to be wrong</description>
		<items>
			<rdf:Seq>
				<rdf:li rdf:resource="http://www...#tech/moz-tab-bookmark"/>
				<rdf:li rdf:resource="http://www...#tech/google-idempotent" />
			</rdf:Seq>
		</items>
	</channel>

		<item rdf:about="http://www...#tech/moz-tab-bookmark">
		<title>Mozilla "Bookmark This Group of Tabs"</title>
		<link>http://www...#tech/moz-tab-bookmark</link>
		<description> I was just reading some background stuff ...
		</description>
		</item>
		...
</rdf:RDF>
```

Here’s what we have, RDF-wise:

- We have the **rdf** namespace (http://www.w3.org/1999/02/22-rdf-syntax-ns#), which qualifies the rdf elements in the file. The root element is **RDF**, which is standard for an RDF document.
- An RDF document is made up of a list of descriptions of resources. The resources here are identified, via their URIs of course, via the **rdf:about** attributes on the <channel/> and <item/> elements. (Notice that the channel and item elements are on the same level, XML-wise.)
- Then we have the **<items/>** element inside the <channel/> element, containing an RDF structure called a sequence (**rdf:Seq**), which is basically an ordered container for things.

And what do these RDF things do? First, each resource – the RSS channel, or the Weblog it represents, and the actual items – are identified as *subjects* of assertions, using the **rdf:about** attributes. You could say that they’re the “subjects of *Descriptions* of them”. Each has a unique URI. Then, an assertion of the following nature is made about the channel:

> The channel *//qmacro.org/about/xml* contains an *ordered sequence* of things, namely *http://www…#tech/moz-tab-bookmark and http://www…#tech/google-idempotent*.

If the RSS file were to have an image, it would occur as in other RSS versions (i.e. as an element peer of the <channel/> element), and the <image/> element itself would have an **rdf:about** attribute pointing to that image resource’s URI. Then, *inside the channel element*, there’d be a simple:

```xml
<image rdf:resource="..." />
```

element pointing to the same URI as the <image/> element’s **rdf:about** attribute pointed to. This would say:

> The channel *//qmacro.org/about/xml* has an *image *, namely *(the image’s URI)*.

And so on.

In other words, the RDF in RSS is there to **identify** resources (the nodes) and to **describe** properties of or relationships between them (the arcs). The RDF content of RSS is not large. I think some people might intermingle RDF and namespace content and think “ooh, there’s a lot of RDF in RSS”. Sure, namespaces are fundamental to RDF, but exist (both here in RSS and elsewhere) independent of it (although if you *use* namespaces such as the Dublin Core in RDF-enhanced RSS, then you’re effectively, and at no extra cost, adding to the data web with the triples that come into being because of how RDF, namespaces, and XML wonderfully work together).

So, there you have it. Just a bit of a brain dump of what I’ve been learning over the past couple of days. Now that I understand what’s going on, I for one would be very disappointed to see RDF go away from RSS. Although there are signs that this may not be the case after all. But that’s another story.


