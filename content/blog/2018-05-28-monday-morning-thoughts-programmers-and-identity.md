---
title: "Monday morning thoughts: programmers and identity"
date: 2018-05-28
tags:
  - sapcommunity
  - mondaymorningthoughts
description: On how some programmers identify strongly with a particular language, consider the meanings of 'programmer', 'coder' and 'developer', and what it means for us as the SAP enterprise programming landscape changes.
---

I watched [a couple of talks by Kevlin
Henney](https://www.youtube.com/results?search_query=kevlin+henney) last
week while travelling to and from SAP CodeJam Guetersloh. One of the
(many interesting) things he suggested was that some programmers
strongly identify with a particular language. This immediately reminded
me of the situation within our SAP developer ecosphere, where it appears
that there are some programmers that strongly identify with the ABAP
language. One could even go so far as to say that this strong
identification is an exclusive one. "I'm an ABAP programmer" is a
phrase that I've heard many times before and has carried the
implication "\... and I wouldn't consider taking on any other
language, just give me ABAP programming tasks to complete, please".

## Single-language programmers

The recognition of this type of single-language programmer is not new,
nor is it particular to the SAP or enterprise world. "I'm a \<insert
name of popular language\> programmer" is something one hears in many
situations. And "I'm an ABAP programmer" is definitely relevant in
our shared journey right now, as the world beneath our feet changes and
moves to the cloud.

Naturally, there are advantages to specialism. Experts in any area are
sought after, and their deep knowledge and close connection to the
subject is very valuable. But this expertise shouldn't come at any
cost, and the cost here is a restriction on what can be achieved.

This isn't even about the idea that one should be passionate about
one's subject area \-- in this case, ABAP \-- nor is it about whether
someone should "take their work home with them" and spend some of
their valuable free time reading up and around the subject of the ABAP
language. (Finding something you're interested in beyond the day job
makes work seem less like work, but that's a digression we should pick
up another time).

## Coder, programmer, developer

Where does this concept of a single-language programmer come from? I
think that it has a lot to do with architectures and software practices
from earlier times.

First, earlier architectures and computing infrastructure was simpler,
and entire solutions were built on a specific OS using a single
language. So having a look back at our own world, this has predominantly
been ABAP, with the transaction-oriented, dynpro-based facilities where
everything from integration mechanisms, backend business logic and
frontend flow was written in ABAP and developed & executed on a
monolith.

![](/images/2018/05/Screenshot-2018-05-28-at-07.47.35.png)

*SAP R/2 dynpro, image from SAP Design Guild*

We see something similar in the Java world, and going back even further
we come to COBOL. The story is the same each time. And while we're back
in those times, let's consider the software practices of the day. The
waterfall approach to building a solution dominated the industry. The
role of an ABAP programmer was very defined, and you could point to the
part in the flow where ABAP development kicked in. Turning
specifications into modulpools for transactions, into function modules &
function groups (function pools, ahh, fond memories), and into reports.

In the days when the phrase WRICEF, standing for "workflows, reports,
interfaces, conversions, enhancements, forms", was used almost as a
currency (it still is today in some areas, depressingly), the role of an
ABAP programmer was someone who turned specifications into executable
code.

This role view meant that the act of programming was considered non
value adding, and perhaps the meaning is carried today with the word
"coder". After all the hard and creative work is done, talking to the
users and designing a set of specifications, the subsequent step just
turns that creativity into something that will execute and display the
ideas on the screen. Right? Not quite. This idea is as wrong as it has
been damaging. But let's leave this subject for another post.

If "programmer" is what we're considering as the term for someone
proficient in and focused on a particular language, and "coder" is the
wrong extreme end of that concept, then perhaps we can think of
"developer" as the correct other extreme end and a contrast to
everything the word "coder" represents.

Development is a creative task, and creators, artists, use more than a
single tube of red pigment on the canvas. Except for, perhaps, someone
like Mark Rothko.

![Mark Rothko Untitled
1959](https://www.tate.org.uk/sites/default/files/styles/width-600/public/images/mark%20rothko%20untitled%201959%202.jpg)

*Untitled 1959 (from the Seagram Murals), by Mark Rothko (from the [Tate
Modern](http://www.tate.org.uk/whats-on/tate-modern/exhibition/rothko/rothko-room-guide/room-3-seagram-murals))*

Like those artists, the developer's toolset is not restricted to one
colour, or a single paintbrush. Moreover, the canvas that we find
ourselves looking at has changed so dramatically that the idea of using
a single dimension to express the ideas, to realise the design, to
produce the solution, doesn't compute.

## Today's development canvas

In previous posts in this [Monday morning thoughts
series](/tags/mondaymorningthoughts/), I've mused
on the landscape of today: cloud first, and composed of many moving
parts. The developer must grow and thrive to continue to be able to
provide creative and effective solutions to business problems in
today's multi-platform, multi-system and multi-layer world. Just look
at the array of languages and toolkits that many folks wield on a daily
basis. Let's pick just one scenario that should at least be familiar to
many of us - developing apps in the Fiori world: ABAP, Core Data
Services (CDS) definitions and metadata extensions, UI5, XML,
JavaScript, Cascading Style Sheets (CSS), HTTP. There's a similar
pattern beautifully illustrated in the new [Business Application
programming
model](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/00823f91779d4d42aa29a498e0535cdf.html)
documentation where the Getting Started tutorial, aimed at today's
developers, takes the reader through a data definition language
reminiscent of River Data Services (RDS), the OData protocol, and more
in the first few minutes, without even the twitch of an eye.

Beyond specific languages and syntax, the cloud native environment and
runtimes on the SAP Cloud Platform ask for a breadth of competence that
is beyond any single language. Even the platform itself is explicitly
and proudly multi-lingual; sure, choose your own language, but be
prepared to have conversations with your fellow developers and with
other teams that might not speak the same language or see things through
the same lenses.

ABAP is coming to the cloud, that much we know. But remember what that
is, and what that represents. It's not a lift-and-shift operation that
brings with it the kitchen sink; it's a subset of language features
that makes sense in a cloud runtime context, with a whitelist-based set
of limitations. I see cloud flavoured ABAP as much a glue language as
anything else, that allows us to bind together programmers and
programming layers for new solutions. And any glue language is just
that. Not the ABAP that we grew up with, but, shoulder to shoulder with
other languages and protocols, just one part of the overall solution.

The value of a developer in today's world is based not only on depth of
knowledge, but on that depth multiplied by the breadth across the
platform spectrum.

## Final observations

On a personal level I've always been fascinated by languages (spoken
and programmed) and I've found that knowing about one language helps me
understand another. Over my working life I've learnt enough languages
to make myself dangerous, but also develop an appreciation of a wide
range of subjects and techniques, thereby preventing myself from
becoming totally irrelevant. And as the saying goes - if I can do it,
anyone can.

If you identify as an "ABAP programmer" and fit into the
single-language category I've described, you have an exciting journey
ahead of you. What's more, if we really dig into what we think about
when we say "ABAP", you're already on the journey; ABAP isn't really
a single language anyway - there's SQL, dynpro logic and even the
declarative language one uses implicitly in the data dictionary.

Rather than identify with a single language, it might help to identify
as a developer of solutions, where the canvas, tools and colour palette
is fluid, but what remains constant is your ability to be creative, and
to express yourself, combining multiple moving parts into a single piece
of art that is worthy of a long gaze and also gets the job done. Beyond
that, it will re-educate those that consider you merely a machine that
turns coffee and specifications into executable code.

So what are you waiting for? Pick something that seems interesting, and
dive in. If you were to ask me for a suggestion, I'd say CDS. It's
close to where you feel comfortable already, almost the next ring out
from your centre of gravity, and it's a critical piece of today and
tomorrow's solution set in the SAP world. But if there's something
else entirely that you've been wondering about, grab it and go. These
days, in the increasingly open world of SAP enterprise software
development, it's more likely that you'll be able to directly use what
you learned in your day job as a developer.

---

This post was brought to you by [Pact Coffee's Umurage
Mbazi](https://www.pactcoffee.com/coffees/umurage-mbazi) (I still have
some beans left from last Monday), the gentle warmth and brightness of a
promising Bank Holiday Monday here in England and a pleasant browse
through my battered copy of The Thames and Hudson [Dictionary of Art and
Artists](https://books.google.co.uk/books/about/The_Thames_and_Hudson_Dictionary_of_Art.html?id=xHxUAAAAMAAJ).

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-programmers-and-identity/ba-p/13380743)
