---
layout: post
title: "'Conneg' and the duality of weblogs."
tags:
- blosxom
- conneg
- http
- rss-tag
- weblogs
---


Q: *When is a blog not a blog?*

A: *When it’s an <acronym title="Rich Site Summary">RSS</acronym> feed.*

I’ve [pondered the relationship between weblog and RSS before](/2002/10/05/notes-to-self-what-should-the-rdfabout-point-to/), and in an [Old Speckled Hen](http://www.oldspeckledhen.co.uk/introduction.htm)-induced philosophical state of mind, have decided for experimental purposes that for all URI intents and purposes they are one and the same.

With that in mind, my thoughts turned (naturally) to connection negotiation, or ‘conneg’. My weblog, whether HTML or RSS, is my weblog. Same thing, different representation. So perhaps both representations should actually have the same URI, [/](/). Clients could use conneg to specify which representation they wanted, for example:

<acronym title="Rich Site Summary">RSS</acronym> 0.91:

```
[dj@cicero dj]$ GET -H"Accept: application/rss+xml" -Use /
GET //qmacro.org/about 
Accept: application/rss+xml 
200 OK 
Content-Type: application/rss+xml 
<?xml version="1.0"?>
<!-- name="generator" content="bloxsom" --> 
<rss version="0.91"> 
<channel> <title>DJ's Weblog</title> ...
[dj@cicero dj]$ 
```
Or <acronym title="Rich Site Summary">RSS</acronym> 1.0:

```
[dj@cicero dj]$ curl -H"Accept:application/rdf+xml" /
<?xml version="1.0"?> 
<rdf:RDF xmlns="http://purl.org/rss/1.0/" ... > 
<channel rdf:about="//qmacro.org/about"> 
<title>DJ's Weblog</title> ...
[dj@cicero dj]$ 
```

Or even simply HTML:

```
[dj@cicero dj]$ GET -Use / 
200 OK 
Content-Type: text/html; charset=ISO-8859-1   
<title>DJ's Weblog</title> ...
[dj@cicero dj]$ 
```

In other words, specify what representation you want in the [Accept](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.1) header. Here’s a quick summary of how (90% of) the Accept: header is used:

> As an HTTP client, you say what media types (which roughly translates to ‘representations’ here) you’re willing to accept for a given resource (URI). You can specify multiple media types, and with the aid of a sort of ranking mechanism, you can say which media types you prefer over others, if given the choice. You do this by assigning values, so that “*application/rdf+xml, application/rss+xml;q=0.5, */*;q=0.1*” means “I’d love application/rdf+xml, but if you haven’t got that, then send me application/rss+xml; failing that, anything will do. The values used are between 0 and 1 (in ascending preference), any media type without a value is assumed to have a value of 1.

So, as a first offering to the [Blosxom plugin love-in](http://www.raelity.org/apps/blosxom/plugin.shtml#registry), I wrote [conneg](/~dj/2003/02/conneg), a plugin with which you can determine the flavour required according to the HTTP Accept header. Here’s how it works:

1. You define the flavours you want to have ‘available’ via connection negotiation in a configurable variable
2. In a new plugin event, ‘flavour’, control is given to the [conneg](/~dj/2003/02/conneg) plugin to determine the flavour according to the connection negotiation
3. The content types are determined for each flavour specified, and ‘scored’ according to the client’s Accept preferences
4. They are then ranked, and the flavour is overridden with the ‘winner’

As you can see from the code, the plugin takes into account what content-types you’ve specified in the ‘content_type.*flavour*‘ files in your blog hierarchy.

Note I said ‘new plugin event’. There are a number of [standard plugin hooks](http://www.raelity.org/apps/blosxom/plugin.shtml) in Blosxom (2.0 beta3). For this ‘flavour’ plugin to work, I’ve added another hook thus:

```
[dj@cicero blosxom_2_0_beta]$ diff blosxom_2_0_b3.cgi blosxom_2_0_b3.cgi.dj 
208a209,211 
> # Plugins: Flavour 
> map { $_->can('flavour') and $_->flavour() } @plugins; 
>
[dj@cicero dj]$ 
```
This is in the ‘Dynamic’ section of the code.

I’ll run this new plugin hook past Rael shortly. It’s a sort of chicken and egg situation – I can’t explain the reason for the patch until I’ve done it and written about it. Rather like conneg and weblogs, perhaps. <acronym title="Rich Site Summary">RSS</acronym> [aggregators](http://www.oreillynet.com/%7Erael/lang/perl/blagg) might not start doing conneg until weblog RSS content is available by that method, and there’s little incentive if no-one’s asking for it. So I thought I’d make a move. Experimental, mind you.

