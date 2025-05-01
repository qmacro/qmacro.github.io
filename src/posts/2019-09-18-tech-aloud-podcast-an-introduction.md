---
layout: post
title: "Tech Aloud podcast - an introduction"
date: 2019-09-18
tags:
  - sapcommunity
  - cap
  - dsls
  - martinfowler
  - wardcunningham
  - repl
  - podcast
---
*I started a new podcast called Tech Aloud, where I read aloud blog
posts and articles so you can consume them on the go. There's no
specific theme to the episodes I've published so far \... or is
there?*

[Tech Aloud](https://anchor.fm/tech-aloud) is a humble and simple new
podcast that I've created to satisfy an itch - I wanted to use travel
time to consume (in an audio format) articles and blog posts that I
probably wouldn't otherwise get time to sit down read. There simply
isn't enough time to keep up with all the interesting stuff that's
published.

There wasn't a podcast that did that, so I created one, as I'm sure
there are folks amongst you that are like me and also want to consume
more, on the go.

![](/images/2019/09/2310259-1568661278464-ed94fe70b513e.jpeg)

Anyway, you can read more about it here in this other post on my home
blog: [New podcast - Tech
Aloud](/blog/posts/2019/09/17/new-podcast-tech-aloud/) which
should tell you all you need to know, like how to subscribe (there's a
growing list of podcast services there where it's already available),
and a little bit more about the general idea.

Including the short introductory episode, [Welcome to Tech
Aloud](https://anchor.fm/tech-aloud/episodes/Welcome-to-Tech-Aloud-e5ddsh),
I've recorded and published 6 episodes so far. I've dipped into my
article & blog post bookmarks and just recorded the first ones that
jumped out at me. So there's definitely some randomness to what I've
picked so far, from a practical perspective, but I've noticed a theme,
or at least a relationship, amongst the episodes so far (this theme will
change, I'm sure, over the subsequent episodes!) and thought I'd
highlight it.

Here are the titles of the first podcast episodes thus far, along with
the original article or blog post sources:

-   [It's Steampunk now - Harald Kuck - 20 Aug
    2019](https://anchor.fm/tech-aloud/episodes/Its-Steampunk-now---Harald-Kuck---20-Aug-2019-e5de5m)
    (source <https://blogs.sap.com/2019/08/20/its-steampunk-now/>)
-   [The Standard of Code Review - Google's Engineering Practices
    documentation](https://anchor.fm/tech-aloud/episodes/The-Standard-of-Code-Review---Googles-Engineering-Practices-documentation-e5deiv)
    (source <https://google.github.io/eng-practices/review/reviewer/standard.html>)
-   [Domain-Specific Languages Guide - Martin Fowler - 28 Aug
    2019](https://anchor.fm/tech-aloud/episodes/Domain-Specific-Languages-Guide---Martin-Fowler---28-Aug-2019-e5do0b)
    (source <https://www.martinfowler.com/dsl.html>)
-   [DSL Q & A - Martin Fowler - 9 Sep
    2008](https://anchor.fm/tech-aloud/episodes/DSL-Q--A---Martin-Fowler---9-Sep-2008-e5do2c)
    (source <https://www.martinfowler.com/bliki/DslQandA.html>)
-   [The Simplest Thing that Could Possibly Work, A conversation with
    Ward Cunningham, Part V - Bill
    Venners](https://anchor.fm/tech-aloud/episodes/The-Simplest-Thing-that-Could-Possibly-Work--A-conversation-with-Ward-Cunningham--Part-V---Bill-Venners-e5dpts)
    (source <https://www.artima.com/intv/simplest.html>)

I included Harald Kuck's specific post on Steampunk because it was
something that I'd wanted to read soon but hadn't yet got round to.
Nice work Harald and team!

But the other articles are more general, and some are what I'd call
classics.

The Domain Specific Language Q&A from Martin Fowler is already over a
decade old but still super relevant - perhaps even more relevant -
today. I am mindful of internal DSLs almost every day, when I use the
SAP Cloud Application Programming Model (CAP), specifically in the
Node.js flavour. If you look at the source code of some of the core
libraries, you'll find stylised JavaScript that can be considered, at
least to some extent, an internal DSL.

You don't even have to look behind the curtain of CAP Node.js to see an
internal DSL standing proud - look at how the CDS Query Language (CQL)
is made available almost as a "little language" within the JavaScript
that you write inside of [custom
handlers](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/94c7b69cc4584a1a9dfd9cb2da295d5e.html).
There's a simple example of this in Step 10 of the
[developers.sap.com](https://developers.sap.com) tutorial [Create a
Business Service with Node.js using Visual Studio
Code](https://developers.sap.com/tutorials/cp-apm-nodejs-create-service.html)
(look at the UPDATE mechanism):

```javascript
module.exports = (srv) => {

  const {Books} = cds.entities ('my.bookshop')

  // Reduce stock of ordered books
  srv.before ('CREATE', 'Orders', async (req) => {
    const order = req.data
    if (!order.amount || order.amount <= 0)  return req.error (400, 'Order at least 1 book')
    const tx = cds.transaction(req)
    const affectedRows = await tx.run (
      UPDATE (Books)
        .set   ({ stock: {'-=': order.amount}})
        .where ({ stock: {'>=': order.amount},/*and*/ ID: order.book_ID})
    )
    if (affectedRows === 0)  req.error (409, "Sold out, sorry")
  })

  // Add some discount for overstocked books
  srv.after ('READ', 'Books', each => {
    if (each.stock > 111)  each.title += ' -- 11% discount!'
  })

}
```

Moreover, for those forward thinking enough to embrace the CDS REPL (see
my post [Monday morning thoughts: cloud
native](/blog/posts/2018/03/26/monday-morning-thoughts:-cloud-native/)
for more on REPLs), there's a rich seam of CDS API just ready to be
mined - look at this tiny example from Getting Started - Define
Services:

```javascript
cds.load('srv/cat-service') .then (cds.compile.to.edmx)
```

While not a complete internal DSL it sure feels like a language
specifically designed to **flow**, especially in the way that it
positively embraces and even celebrates whitespace.

Talking of flow, the SAP Cloud SDK comes to mind. It has a wonderfully
[fluent interface](https://en.wikipedia.org/wiki/Fluent_interface) which
you can see in this simple example (taken from a tutorial that will
feature in one of this year's SAP TechEd App Space missions, so don't
forget to come by the Developer Garage next week in Las Vegas!):

```javascript
BusinessPartnerAddress
        .requestBuilder()
        .getAll()
        .select(
                BusinessPartnerAddress.BUSINESS_PARTNER,
                BusinessPartnerAddress.ADDRESS_ID,
                BusinessPartnerAddress.CITY_NAME,
        )
        .execute({url:'http://localhost:3000/v2'})
        .then(xs => xs.map(x => x.cityName))
        .then(console.log)
```

Look at the way that chain of calls "flows" from one part to the
next - some parts being provided by custom functions, others by language
features such as 'then'.

In a nice reference that completes the circuit loop, it may delight you
to know that "fluent interface" was in fact co-coined by the author of
the two items on DSLs that feature in the Tech Aloud episodes so far -
[Martin Fowler](https://martinfowler.com/).

Martin Fowler is one seriously big thinker. Another is Ward Cunningham
(as one of my all-time heroes, I'd made it my mission to meet him at
OSCON, which I did in 2003), inventor of the Wiki, and pioneer of design
patterns and extreme programming (XP).

There's a multi-part interview that [Bill
Venners](https://twitter.com/bvenners) did with Ward, and the
conversation and thinking is wonderful. If you want to read more from
that interview, find the other parts (I - IV) here:
<https://www.artima.com/intv/simplest.html>.

And moving on from thinking about writing "the simplest thing that
could possible work", how about reviewing it? This is where the Google
Code Review standards come in. Google released to the public their Code
Review guidelines very recently, and I was keen to take a look. So I've
decided to read through each of the parts in [How to do a code
review](https://google.github.io/eng-practices/review/reviewer/), as
wisdom that we might all be able to learn from (in fact as we speak
I've got the second part of that series waiting to publish on the
podcast right now).

Anyway, that's about it for now. Please consider subscribing to the
[Tech Aloud podcast](https://anchor.fm/tech-aloud) - it's already
available for example on [Player
FM](https://player.fm/series/tech-aloud), [Pocket
Casts](https://pca.st/kyepz7uy),
[Spotify](https://open.spotify.com/show/5l4AR3Q3HKZEpE7x9j0tdJ),
[TuneIn](https://tunein.com/podcasts/Technology-Podcasts/Tech-Aloud-p1251488/),
and (soon, fingers crossed!) Apple iTunes Podcasts. Of course, you can
simply take the podcast RSS feed URL and plug it into your own favourite
podcast player:

<https://anchor.fm/s/e5dc36c/podcast/rss>

Thanks!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/tech-aloud-podcast-an-introduction/ba-p/13403583)
