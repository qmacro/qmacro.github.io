---
title: "Monday morning thoughts: a cloud native smell"
date: 2018-04-09
tags:
  - sapcommunity
  - mondaymorningthoughts
---

Continuing on from my earlier [random
thoughts](/blog/posts/2018/03/26/monday-morning-thoughts:-cloud-native/)
about what cloud native means to me, I was musing this morning on the
nature of the web, and specifically URIs - or rather their
specialisation that we see most commonly - URLs.

## The importance of stable URLs

There's a well-known article by Tim Berners-Lee (TBL) entitled "[Cool
URIs don't change](https://www.w3.org/Provider/Style/URI)" which I'd
encourage you to go and read at some stage over a cup of coffee. It's
from the World Wide Web Consortium (W3C). There are many implications of
what he says in this article, which I'll leave you to ponder. There's
also one particular observation that's worth sharing now - the URL of
the article hasn't changed since its publication 20 years ago. Now
that's what I call setting a good example!

In thinking about the content of this article, I'm reminded of the
excellent set of productivity tools from Google - known these days as G
Suite. I say "known these days", as they've been referred to
previously as "Google Apps", and - perhaps colloquially - as "Google
Docs". But while the suite's name might have changed, the fundamental
design that underpins this awesome set of tools has not.

Because Google get the web, they build their tools "**of** the web",
rather than merely "**on** the web". That means, for example, that the
URL of a Google spreadsheet, for example, or a Google document, or a
Google Form, or whatever - is unique and permanent. It doesn't change.
Even if you change the name of that "document" (we should really say
"of that resource"), the URL remains the same. And that brings a
superset of web-based by-products that we take for granted.

For example,
I can jump to a document I've been working on recently in literally a
handful of keystrokes, without having to think of where I stored it or
what the URL might be, or what the navigation path might be that I have
to take once if I have to first find some sort of "root" resource.
This is all I have to do:

👉 Cmd-T to get a new browser tab and have my cursor placed in the omnibar

👉 Then three or four characters to identify the working title of the document

👉 Finally a down-arrow or two and Enter to request that resource

Bam. In and editing.

More than can be said for, ahem, certain other online productivity /
collaboration suites - merely change the title of the document you're
writing and the URL changes! Ouch! What use is that if I want to share
the working draft resource with you?

Anyway, let me tear myself away from this becoming another post
entirely, and look at a typical G Suite URL to help me get to my next
point. Here's an example, for a spreadsheet (I've changed the URL
slightly for security reasons). First, the base:

`https://docs.google.com/spreadsheets/d/`

Then, an opaque identifier:

`1nT4GB85goF34MaxiEZAMJp-aCk0QguyZ6WmlWjMUA42`

The structure of the URL is quite simple, and most of it is the unique
code (`1nT4...42`) that identifies the individual online spreadsheet
resource.

## The Opacity Axiom

So that brings me to a parallel thought relating to cloud native, and
something that (to me) is a "smell" (as in something that just gives
me a subtle hint about something - not necessarily negative).

When I first started out exploring the SAP Cloud Platform (SCP), I
noticed that a lot of the URLs had similar opaque identifiers in them.
For example, if I created a temporary trial account, or a temporary
member within a trial account. If I added a subaccount or was given
access to a new global account, whether in the Neo or (now the) Cloud
Foundry context \... each time, I saw unique, opaque identifiers.

Here's another couple of (modified) examples:

```text
https://account.us2.hana.ondemand.com/cockpit#/acc/dd2758442/services
```

```text
https://account.hanatrial.ondemand.com/cockpit#/region/cf-eu10/globalaccount/42461e78-9618-44d8-9c8e-629dc5319b61/subaccount/420c85ab-ecbc-4760-84e6-c1d45dd593b4/details
```

Even services within the SCP had parts of their URLs that I couldn't
control (or initially understand) - provider account identifiers, for
example. And they looked a little bit ugly to me, initially.

But then I remembered another W3C article, from even earlier in the
web's history (1996) - [Universal Resource Identifiers - Axioms of Web
Architecture](https://www.w3.org/DesignIssues/Axioms.html). This is also
a great article and worth a read. Of particular interest to us here in
that article is the section on "[The Opacity
Axiom](https://www.w3.org/DesignIssues/Axioms.html#opaque)", which
states:

*"The only thing you can use an identifier for is to refer to an
object. When you are not dereferencing, you should not look at the
contents of the URI string to gain other information."*

This axiom somewhat goes against the grain of what I like to think, but
is actually crucial. First from the point of view of the side-effect of
trying to infer structure from a URL, but more importantly from the
perspective of where we are today, in the cloud native context of
resources being spun up, created, instantiated, conjured up \... and
then after their utility has been spent, being deleted, destroyed,
disappeared\*.

(\*yes I know I'm using this verb transitively, but there you go.
Talking of unusual words and unusual usages, did you notice TBL using
the word "disillusion" in the "Cool URIs Don't Change" article -
also as a transitive verb? That use has been [waning since the early
C20](https://books.google.com/ngrams/graph?year_start=1800&year_end=2008&corpus=15&smoothing=7&case_insensitive=on&content=disillusion&direct_url=t4%3B%2Cdisillusion%3B%2Cc0%3B%2Cs0%3B%3Bdisillusion%3B%2Cc0%3B%3BDisillusion%3B%2Cc0),
but still wonderful.)

Resources, such as those that are spun up on cloud platforms such as
SAP's and Google's, that are ultimately ephemeral need to be born and
then die, and in that intervening period, have an identifier that is as
equally anonymous as it is unique.

<a name="the-cloud-native-smell"></a>
## The cloud native smell

And it's the very presence of these superficially ugly but essentially
throwaway identifiers in URLs (after all,
[URLs](https://en.wikipedia.org/wiki/URL) \*are\*
[URIs](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier),
aren't they) that to me form a subtle hint, a signpost, a smell, that
what we're dealing with is something that is cloud native. Resources,
services, VMs, clusters, subaccounts - they're created and destroyed
all the time, not just in a web environment but in on-premise contexts
and sometimes within proprietary architectures.

The fact that resources \-- and I'm using the word "resource" while
thinking about how that word is used in [Representational State
Transfer](https://en.wikipedia.org/wiki/Representational_state_transfer)
(REST) \-- need identifiers in the context of the web (and yes,
"cloud" doesn't mean "just web (HTTP)"), but our interface to the
cloud is predominantly via that protocol) means that the increasing
occurrence of URLs with long strings of opaque characters often triggers
a thought in my head that we're moving further towards the age of cloud
native.

What are your thoughts?

---

This post was brought to you by [Finca Buenos
Aires](https://www.pactcoffee.com/coffees/finca-buenos-aires) coffee and
some happy memories from the early days of the web.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-a-cloud-native-smell/ba-p/13372514)
