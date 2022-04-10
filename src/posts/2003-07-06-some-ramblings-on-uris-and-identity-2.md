---
layout: post
title: Some ramblings on URIs and identity
tags:
- foaf
- identity
- rdf
- uri
---


Coming back from a short break from the tech world recently, I started to reacquaint myself with [FOAF](http://xmlns.com/foaf/0.1/ "FOAF: Friend Of A Friend Vocab") and [RDF](http://www.w3.org/RDF/ "RDF (Resource Description Framework)"), amongst other things. Looking at the FOAF data for various people, I was reminded of the model of indirection that is used to identify a person.

<foaf:Person> <foaf:mbox>dj.adams@pobox.com</foaf:mbox> ... </foaf:Person>

Actually, while I think on, why not:

<foaf:Person> <foaf:mbox rdf:resource="mailto:dj.adams@pobox.com" /> ... </foaf:Person>

Anyway. The idea is that rather than refer to a person directly, we refer to them indirectly: “*The person with the email address dj.adams@pobox.com*“. Why do this? Well, for one thing, an email address is a fairly unambiguous property — there’s usually the same person consistently to be found behind an email address. The FOAF [spec](http://xmlns.com/foaf/0.1/index.html) uses [DAML](http://www.daml.org/ "DAML: DARPA Agent Markup Language") to annotate the mbox property as being unambiguous (you can see this in the [RDF version of the spec](http://xmlns.com/foaf/0.1/index.rdf)).

In the arcs and nodes world of RDF, it would look something like this:

 +----------+ +---| | | +----------+ mbox | | V +---------------------------+ | mailto:dj.adams@pobox.com | +---------------------------+

The box at the top represents the person, and is a blank node, in that it doesn’t have a (direct) identifier. The uniqueness is *indirect*

.

Then I came across [Mark Baker’s FOAF file](http://www.markbaker.ca/foaf.rdf), which starts:

<foaf:Person rdf:about="http://www.markbaker.ca/"> <foaf:name>Mark Baker</foaf:name> ...

What’s this? Does this mean that the HTTP URI [http://www.markbaker.ca](http://www.markbaker.ca/) represents Mark? (What does “represents Mark” mean anyway?) We know about [REST](http://internet.conveyor.com/RESTwiki/moin.cgi/FrontPage "The REST Wiki's front page"), and *representations* of *resources* that can be retrieved via HTTP URIs. If I specify a MIME type of ‘text/html’ when asking for a representation of the resource at that URI, I am sent some HTML (Mark’s home page). I wonder what MIME type I’d have to specify to get Mark himself disassembled into IP packets and reassembled next to my laptop? Of course, before you say anything, this is one of the differences between URIs and URLs, and I won’t expect to see Mark any time soon :-) Plus, there’s the concept of identity which must stand alone from the concept of resources and representations … if Mark comes down the wire, am I getting a representation of Mark, or Mark in person? At least I might get a picture of him if I specify ‘image/*’.

In any case, Mark does assert that the URI does identify him, the person. Very interesting. Mark pointed me to an [item](http://norman.walsh.name/2003/06/06/karma "assigning URIs to people") on Norman Walsh’s weblog which touches on this subject.

So, what does, or could, an HTTP URI represent? Leigh Dodds recently expressed a desire to detail aspects of [his life in RDF](http://www.ldodds.com/blog/archives/000050.html) (and I like the idea of the Semantic Web’s “year zero” that he mentions). Films he’s seen, books he’s reading, and so on. Great!, I thought, and immediately perused [Erik Benson](http://erikbenson.com/)‘s [allconsuming.net](http://allconsuming.net/) API documentation (there’s a [RESTful way of getting the book data](http://allconsuming.net/news/000042.html) too, now) – I could pull out the data from there and construct some RDF statements about the CurrentlyReading book information.

But before I started, I went all philosophical and thought about representations and abstractions for a bit; at least, as much as my limited knowledge would allow. I’d been thinking that the currently reading information might come out like this:

<foaf:Person> <foaf:mbox rdf:resource='mailto:dj.adams@pobox.com' /> <books:currentlyReading rdf:resource='http://allconsuming.net/item.cgi?isbn=0596002025' /> ...

But surely that says that I’m currently reading *the allconsuming.net page for that book*, not that book itself? It’s not a question of unique identity, as the ISBN in the URI disambiguates. It’s a question of what the URI represents. How do you refer to the book itself — the abstraction (funny how ‘abstract’ actually means ‘real’ here)? Perhaps here, as in FOAF, a level of indirection could be used:

<foaf:Person> <foaf:mbox rdf:resource='mailto:dj.adams@pobox.com' /> <books:currentlyReading> <books:Book> <books:describedAt rdf:resource='http://allconsuming.net/item.cgi?isbn=0596002025' /> ... </books:Book> ...

In other words, I’m currently reading *the book that’s described at that allconsuming.net page*. Seems fair. And this is what it looks like:

 +----- Person | ------ +-------+ +-----| |----+ | +-------+ | mbox | | | | V | currentlyReading +---------------------------+ | | mailto:dj.adams@pobox.com | | +---------------------------+ | +----- Book V | ---- +-------+ +----| | | +-------+ describedAt | | V +--------------------------------------------------+ | http://allconsuming.net/item.cgi?isbn=0596002025 | +--------------------------------------------------+

On the subject of identification and HTTP URIs, Tim Berners-Lee wrote a paper [“What do HTTP URIs Identify?”](http://www.w3.org/DesignIssues/HTTP-URI.html) where he discusses various angles on the difficulty regarding resources, identification and the real world. The paper refers to, and stems from, discussion on this in the [httpRange-14](http://www.w3.org/2001/tag/ilist#httpRange-14) issue in the [TAG issues list](http://www.w3.org/2001/tag/ilist).

In the book diagram above, I’ve included little class annotations for each of the two blank nodes (Person and Book). I wonder if, at least in RDF, classes can be used effectively to draw a distinction between Mark Baker and his home page? In other words, the snippet of Mark’s FOAF data:

<foaf:Person rdf:about="http://www.markbaker.ca/"> <foaf:name>Mark Baker</foaf:name> ...

which is really shorthand for:

<rdf:Description rdf:about="http://www.markbaker.ca/"> <rdf:type rdf:resource="http://xmlns.com/foaf/0.1/Person" /> <foaf:name>Mark Baker</foaf:name> ...

says that the resource at http://www.markbaker.ca is a Person.

By the way, Mark is not alone in identifying himself, a person, with an HTTP URI. The [RDF Primer](http://www.w3.org/TR/2002/WD-rdf-primer-20020319/) does the same thing in an example (this time in N-Triple format):

<http://www.example.org/index.html> <http://purl.org/dc/elements/1.1/creator> <http://www.example.org/staffid/85740> .

This says that the document at http://www.example.org/staffid/87540 created the document at http://www.example.org/index.html.

Or does it?


