---
title: "Monday morning thoughts: what not how"
date: 2018-07-23
tags:
  - sapcommunity
  - mondaymorningthoughts
---

*In this post, I think about how we program, about the way we describe
what it is that we want the computer to do for us, and look at what has
become for me the canonical example of the difference between 'what'
and 'how'.*

Over the past week, three worlds have collided, in a most pleasing way.
First, I've been digging a little bit more into the powerful [data
model definition abstraction of Core Data
Services](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/c94d921f740e4c66a15924fb53933eef.html) (CDS),
following on from last week's post in this [Monday morning thoughts
series](/tags/mondaymorningthoughts/), on
[abstraction](/blog/posts/2018/07/16/monday-morning-thoughts:-abstraction/).

Then, in browsing the content of my bookshelves, I came across a copy of
a wonderful course on SAP assembler macro programming, called IT400 and
written by Peter Skov.

![](/images/2018/07/it-400.png)

(I'd lost my original copy; this new copy was courtesy of Chris Whealy,
a good friend and fellow curious companion - he was one half of our
old shared blog "Language Ramblings").

Finally, at the end of last week, I was honoured to be able to present a
remote session at [UI5con Bangalore](https://openui5.org/ui5conblr/),
and I chose to speak about an introduction to functional programming
techniques in JavaScript, given that is the native language of the UI5
toolkit.

## Level of communication

These three things have something in common. Each relates to the way we
communicate. Communicate to machines primarily, but actually to our
fellow workers too. Although one might say that was the other way
around - I read somewhere recently that only 10% of a programmer's time
is spent writing code. The other 90% is spent reading it. Trying to
understand the logic, the intent and the general complexities of other
people's code. In some cases, of their own code, weeks or months
later!

There's a digression about code comments, how quickly they can go
stale, and how unit testing is perhaps a better alternative for
describing what code does, because the unit tests and the code cannot
diverge in meaning or intent, like comments and code can do - this was a
point made in the recent SAP Coffee Corner Radio podcast episode 4:
"[ABAP - The Special
Snowflake](https://anchor.fm/sap-community-podcast/episodes/Episode-4-ABAP---The-Special-Snowflake-with-Nigel--Graham-e1qds0/a-a1ptlh)
with nigel.james and graham.robinson". But I'll leave that for another
time.

With CDS, the purity of abstraction is very evident with how data models
are described. With the three-entity bookshop example in the [Getting
Started
tutorial](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/5ec8c983a0bf43b4a13186fcf59015fc.html),
even non-CDS initiates can understand the intent, even the detail, of
what's written. Moreover, how the definitions and relationships are
implemented - in a database-specific way - are not important at this
level. The beauty of this is that it allows the extension of definitions
to other models in a high-level and natural way. (If you're interested
in learning more about this, see Oliver Welzel's post "[ITelO -- A
Sample Business Application for the new Application Programming Model
for SAP Cloud
Platform](https://blogs.sap.com/2018/06/27/itelo-a-sample-business-application-for-the-new-application-programming-model-for-sap-cloud-platform)".)

In contrast, one cannot help but feel close to the machine when writing
assembler. The first assembler I learnt was 6502, alongside Atom Basic -
you could [intertwine the two
languages](http://www.acornatom.nl/atom_handleidingen/atap/atap02.html)
in a single program, for the Acorn Atom, which was one of the many
features that made the Atom both quirky and much loved. With 6502
assembler or the mainframe [370 assembly
language](https://en.wikipedia.org/wiki/IBM_Basic_assembly_language_and_successors) upon
which the R/2 systems that I worked with was based (and the subject of
the IT400 course), while you felt close to the machine, you were very
far away from your fellow programmers and an abstract layer of intent.

You had to spell out exactly how you want the machine to go about some
task, detailing the smallest and most mundane aspects - register storage
and management, byte or word level processing, and so on. While of
course a fellow programmer could read your code and understand it, it
would take a while. Then again, with paper based forms being the
equivalent of the activities we perform today with the Correction and
Transport System (CTS) or any sort of Continuous Integration (CI) setup,
everything moved slower anyway.

And so we come to the subject of Friday's session at UI5con Bangalore.
It's a session I've given before in a number of different forms

- at SAP TechEd in 2016 (DEV219 "Building More Stable Business Apps with Functional Techniques in JavaScript")
- at UI5con in 2016 ("An Introduction to Functional Techniques in JavaScript for UI5") 
- at UI5con@SAP in 2017 and 2018 in the form of a longer hands-on workshop ("Functional programming for your UI5 apps")

It was for the hands-on format that I created a 20 page worksheet which is available for all online:

![](/images/2018/07/worksheet.png)

[Functional Programming for your UI5 Apps - Hands-On
Worksheet](https://docs.google.com/document/d/1Nx2PFqObMtir0rSzjU804PAAVkC3j4lZTtfRRoLSocQ/)

## The difference between how and what

In Part 1 of this worksheet I show the contrast between a low level,
mechanical way to do something in JavaScript, and a higher level more
abstract way. Moving from a "how you want the machine to do something"
to a "what you want" is for me an underlying theme of functional
programming, or at least a favourable by-product. Let's dive into the
example that I use.

We have a complex data structure of entities and samples for those
entities (relating to the [UI5 Explored
app](https://sapui5.hana.ondemand.com/explored.html), in case you're
curious) and want to count the number of samples for the entities in a
particular namespace. Here's the traditional way of doing it:

```javascript
var total = 0;
for (var i = 0; i < aEntities.length; i++) {
    var mEntity = aEntities[i];
    if (mEntity.namespace === "sap.ui.core") {
        total = total + mEntity.sampleCount;
    }
}
```

This for loop construction is not particular to JavaScript. The ideas
expressed here, in the way we explain to the machine how to do
something, can be found in very similar forms in [many other
languages](https://en.wikipedia.org/wiki/For_loop#Timeline_of_the_for-loop_syntax_in_various_programming_languages).
Beyond the fact that we're mutating state (worse: mutating state
outside the computation block, but let's not go there), the key issue
here is that even in this very simple form, there's a lot going on, and
it's all rather mechanical.

We're telling the machine *how* to go about checking each item in the
aEntities array, giving it a lot of help with the use of the "i"
variable to act as an incrementing array index. Doesn't that strike you
as rather low-level? There are similar constructs in the C language, and
one could argue that C is as close to assembler as you can get without
being assembler.

Surely there's a way to do this without telling the machine how to
process an array of items, without thinking at the level of language
implementation?

Well, there is. Consider this equivalent:

```javascript
aEntities
  .filter(x => x.namespace === "sap.ui.core")
  .reduce((a, x) => a + x.sampleCount, 0)
```

We can "say" this out loud as follows:

-   take the array of entities
-   filter them down to those whose namespace is "sap.ui.core"
-   fold* the filtered entities together, accumulating the
    "sampleCount" property values

*I'm deliberately using the word "fold" here because that is what
reduce is called in other functional languages. But that too is a
digression for another time.

At this level of abstraction, we're thinking not in terms of mechanics,
not in terms of instructing the machine how to go about working through
a list of things one explicitly indexed item at a time. In the previous
example we're creating multiple variables that stay around after we've
finished (and therefore things that we may have to now keep track of in
our head when spending that 90% reading code). We're doing that because
we're having to instruct the machine *how* to go about getting to the
result.

In this second example, we have none of that. No variables (save for
those in the transient and anonymous helper functions that we pass to
filter and reduce respectively), and certainly no plodding instructions
about how to process a list of items.

Instead, we are expressing *what* we want, in a higher level language.
We don't care how the array gets processed, we leave that to the
language implementation*. List machinery is built in and comes for free
with this more functional approach. In fact, if you're interested in
implicit list machinery like this, you might want to have a read of my
post [The beauty of recursion and list
machinery](/blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/).

*if you're wondering about performance, it's not to say that the
implementation of this intent is not done in a way that parallels the
for-loop, internally.

I think there are powerful reasons for abstractions like those we find
in functional programming and those we find in CDS, and one of those
reasons relates to how we should perhaps constantly look to make things
easier for ourselves, using the power of machinery to do the grunt work
for us. Striving for the ability to express ourselves better, to talk in
terms of what we want, rather than how to go about getting it, is surely
a way we progress.

This post was brought to you by [Pact Coffee's Villa
Rubiela](https://www.pactcoffee.com/coffees/villa-rubiela-espresso) and
the peace and quiet of a very early (and damp) Monday morning in
Manchester.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

**Update 03 Aug**: There's now a [recording of my remote
session](https://www.youtube.com/watch?v=R8Z25evYw0o&list=PLHUs_FUbq4dWi0NJg0o6-ztQ2lFgbfS5z&t=0s&index=6)
"Functional programming for you UI5 apps" available, a cut-down
version of the worksheet in the form of a [presentation](https://docs.google.com/presentation/d/1tSQkrIUneHENJqqAogFkcyw2Hztxk-SL497w1RH6emg/). The recording is
one in a whole series of recordings from the UI5con Bangalore event.

![](/images/2018/07/ui5conflyer.png)

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-what-not-how/ba-p/13361296)
