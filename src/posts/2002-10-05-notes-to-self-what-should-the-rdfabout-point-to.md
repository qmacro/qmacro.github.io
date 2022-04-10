---
layout: post
title: 'Notes to self: What should the rdf:about point to?'
tags:
- rdf
- rss-tag
---


If nothing else, RSS 1.0 is a great source of contemplation and wondering. This morning, I’ve been considering the thoughts surrounding the **rdf:about** attribute in the channel element:

<channel rdf:about="..."> ... </channel>

What should the value of the **rdf:about** be? The URI of the RSS file itself or the URI of the document that the RSS is describing? This is not a new question – it’s been debated already, and I’m not trying to dredge up the issues in any particular way now; I just want to get my (seemingly random) thoughts down here (weblogging for me is a great framework in which to marshall my thinking, which I’m trying to make the most of in this period of infrequent connectivity).

There are some arguments for the value of **rdf:about** to be the URI of HTML document (I’m using HTML examples in this post for simplicity’s sake), and others for it to be the URI of the RSS document itself. Here’s what I’ve been thinking:

*Thoughts against the value being the RSS URI:*

- In every case that I’ve seen, the URI for the RSS data and the URI for the HTML are different. There are two separate documents. If the value of **rdf:about** is the RSS URI, what is going to describe the HTML URI?
- There have been arguments put forward that the RSS and the HTML that it described are really just two representations of the same thing. But I thought it was Not Good Practice to identify a single resource (the thing) with two (or more) different URIs? [On the other hand, if RSS was retrieved via content negotiation, we *could* use a single URI and just state in the HTTP request that we wanted (to **Accept**) the data or the metadata.]
- If RSS ‘is just another representation’ of the HTML, and RSS is RDF, does it follow that all RDF descriptions of single URIs are to be considered as just other representations of said URIs? (This is clearly extreme and provocative)

*Thoughts in favour of the value being the RSS URI:*

- Some RSS documents exist without any equivalent ‘describee’. For example, RSS feeds of aggregated items related by category are automatically constructed for further consumption. There are no equivalent HTML documents that these RSS documents are describing. So having to specify a URI of the HTML in the **rdf:about** attribute in these cases doesn’t make sense.
- Often HTML pages have content above and beyond the news (or whatever) items being described in the RSS. As the RSS is not describing this other content, stating that the description is about the HTML URI is not entirely accurate, or at least not entirely representative.

One interesting thing to note concerning the ‘representation’ question, and in relation to the HTML <link rel=”…” … /> construction to

1. [point to the RSS feed from a weblog](../../2002/Jun/03#newlinks) (in collaborative weblog activities earlier this year)
2. [point to RDF from HTML in general](http://www.w3.org/TR/1999/REC-rdf-syntax-19990222/) (in the RDF M&S)

is that different possible values for the <link>’s **type** attribute show both alternatives: for example the value “alt” suggests an *alternative representation*, whereas the value “home” suggests a *separate resource altogether*

.

Regarding the content negotiation comments, and the HTTP headers that are employed, I am reminded of other thoughts about RDF and resources in general. A question I had (well, still have) is “*Where are the statements about the statements?*” Yes, I guess I’m talking about reification, but not in the specific technical sense. I’m more interested in this: given a resource, how do I know where the (RDF) statements are that describe it? [Appendix B “Transporting RDF](http://www.w3.org/TR/1999/REC-rdf-syntax-19990222/#transport) in the RDF Model and Syntax (M&S) Specification describes four ways of associating descriptions with the resource they describe – “embedded”, “along-with”, “service bureau”, and “wrapped”. I’ve been thinking of the pros and cons of supplying an HTTP header when the resource is retrieved, like this:

X-RDF: (URI-of-RDF-file)

Now this isn’t a statement about a statement in the RDF sense, but it sure tells you where the statements about a resource are to be found. Hmmm…

Anyway, back to what the value of **rdf:about** should be. I think the difficulties and questions arise because of the special relationship between RDF and RSS that I [mentioned last time](../../2002/Oct/02#tech/rss/significance). Perhaps because other (non-RDF) RSS formats exist, the RDF and RSS are seen as separate things, so the RSS is a valid candidate for description (by RDF). This becomes meta meta data – a description of the description. Hmmm. One perverse extrapolation of this (taking the fact that [RSS](http://www.purl.org/rss/1.0/ "RSS (RDF Site Summary)")*is* RDF, and considering **rdf:about**=”URI-of-RSS”) is that all RDF files would be written to describe themselves, and not the actual original resource. Perhaps what I’m trying to say is that this crazy scenario is an argument against having the RSS URI in the **rdf:about**.

So, what’s the answer?

I don’t think there is a definitive one, apart from “whatever makes more sense for your particular instance”. I don’t know if this is right or not, but it sure is stimulating.

One last question to bring this rambling to an end. What’s the semantic difference between specifying the RSS URI for **rdf:about** in an RSS file, and specifying blank (i.e. **rdf:about=””**)? About the same difference as there is between “self reference” and “self reflection”? ;-)


