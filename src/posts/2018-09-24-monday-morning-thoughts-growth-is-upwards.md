---
layout: post
title: "Monday morning thoughts: growth is upwards"
date: 2018-09-24
tags:
  - sapcommunity
  - mondaymorningthoughts
  - cap
  - javascript
  - literature
  - running
---
*In this post, I think about how we grow, how we improve ourselves by
adding to our knowledge and experience, and consider that our growth is
sometimes uphill but almost always rewarding.*

I live to the east of the centre Manchester, in beautiful countryside
that's rich and green from all the rain. It's a great place to run,
and over the years [since I started
running](/tweets/qmacro/status/1043793450603180032) I can
see my fitness has improved, not least because of the hills I have at my
disposal. While I do of course enjoy running fairly flat routes, the
sense of achievement is heightened, literally, if I take in a hill or
two.

## Running up hills

The journey to the summit, whether it's to the top of Hartshead Pike,
or just up from Ashton to Oldham, is sometimes hard going, but when I
get there, I know I've benefitted from the effort, and the view is
pretty good too.

![](/images/2018/09/Screen-Shot-2018-09-24-at-08.18.22.png)
*The view from [Hartshead Pike](https://goo.gl/maps/SCzNCHkNdoF2),
looking south west*

## Reading unfamiliar dialects

So it is also with literature sometimes, too. One of my favourite books,
certainly one of the most memorable, is the post-apocalyptic novel
"[Riddley Walker](https://en.wikipedia.org/wiki/Riddley_Walker)", by
Russell Hoban. It's set many years in the future, after a nuclear war
has destroyed civilisation, and the world has regressed to a level last
seen in the Iron Age.

![](/images/2018/09/Screen-Shot-2018-09-24-at-08.37.58.png)
*Riddley Walker, by Russell Hoban*

Not only has technology broken down, but language too, and the book is
written in an imaginary and strange, devolved dialect of English, which
is initially unfamiliar to the reader \...there's no soft on-ramp, the
dialect hits you from the very first paragraph.

![](/images/2018/09/Screen-Shot-2018-09-24-at-10.59.56.png)

Initially reading the book is a struggle, everything seems strange, but
gradually you get to know the language and your fluency grows. I think
the idea of using a strange dialect such as this is partly to reflect
the arduous nature of survival in the regressed world in which the
eponymous hero lives. As you travel through the language you travel with
Riddley Walker and the other characters and your experience of their
lives is that much more visceral.

Like running in hilly areas, exploring this novel is also sometimes
tough, but it's also ultimately rewarding. At first there's an almost
automatic rejection of the text, because it appears so different. But
after some thought and perseverance, the novel starts to flow, and the
sense of reward and achievement is indeed great\*. Looking back at these
pages today, I read the text as a native of that period, with no
hesitation or effort.

*\*Beyond the language in this novel, there is almost always a richness
of allegory and a classic erudition that permeates most of what Russell
Hoban writes - this sometimes adds to the depth one must sometimes wade
through.*

## Expanding one's knowledge

As with running up hills, and reading strange, imaginary dialects of
English, there is also a great sense of achievement to be had when
expanding one's technical knowledge - whether you decide to go wider or
deeper in the subjects that interest you.

Yesterday I was trying to satisfy my desire to learn more about the
[Application Programming Model for SAP Cloud
Platform](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/00823f91779d4d42aa29a498e0535cdf.html)
and I came across some code that looked initially a little strange but
closer inspection turned out to make sense.

Considering this closer inspection reminds me of a phrase that the
inimitable [Erik
Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)) seems
to use\* a lot: *"If you stare at it long enough \..."*, which he uses
in reference to new programming language constructs he's introducing.
If you've not seen his C9 Lecture series "[Programming in
Haskell](https://www.youtube.com/watch?v=UIUlFQH4Cvo&list=PLoJC20gNfC2gpI7Dl6fg8uj1a-wfnWTH8)",
I can highly recommend it - it's wonderful, and about so much more than
Haskell itself.

*\*Originally, I think, in reference to autostereograms.*

Anyway, I digress.

Here's the code I came across, more or less:

```javascript
/**
* Custom logic for booking-service defined in ./booking-service.cds
* Check to restrict number of passenger traveling on a space craft to 5
*/
module.exports = function ({ flight_trip_Bookings }) {
  this.before ('CREATE', flight_trip_Bookings, (cds) => {
    cds.run(()=>{
       SELECT.from ('flight_trip_Bookings')
        .where ({DateOfTravel: cds.data.DateOfTravel, and : {Itinerary_ID: cds.data.Itinerary_ID} })
    }).then(( [bookings] ) => {
        let totalPassengers = 0
        for (let booking of bookings) {
          totalPassengers = totalPassengers + booking.NumberOfPassengers
          if (totalPassengers + cds.data.NumberOfPassengers >= 5)
            cds.error (409, "Spacecraft Tickets Sold out for your Date and Destination, sorry")
        }
    })
 })
```

Is this a strange incantation which I see before me?

Well, no, not quite. I'd like to spend the rest of this post taking a
gentle look at it, and thinking about what it represents.

First, what does this look like? Well, for many of us, it sort of looks
like JavaScript but seems a little unfamiliar, a little odd. There are
certain aspects that are missing, aspects might give us a more confident
feeling that it's JavaScript. There are also other aspects that are
present, that don't "feel" as though they're JavaScript. So at the
outset we're having a bit of a Riddley Walker moment, so let's stare
at it for a bit and see if we can't get closer to it, mentally.

Of course, context is everything, so consider that this bit of code is
the contents of a JavaScript file that is designed to be dropped into a
Node.js based service in the context of the Application Programming
Model for SAP Cloud Platform, specifically a bit of custom logic to be
invoked on certain request operations.

OK, so what we see at a high level, say, inside 10 seconds of staring,
is that we have:

-   no semicolons
-   some strange statements like `let` and `for ... of`
-   some odd looking punctuation reminiscent of what would be called
    "[line noise](https://perl.plover.com/obfuscated/)" in Perl
-   a significant amount of indentation


In fact, looking at the indentation, there's only a single outermost
statement in the whole file - and that's the
`module.exports` assignment in the first line.

But actually there's not much to worry about at all here. Semicolons in
JavaScript are optional, and many, including Mattias Petter Johansson,
who has a [YouTube channel called
FunFunFunction](https://www.youtube.com/channel/UCO1cgjhGzsSYb1rsB4bFe4Q) full
of new JavaScript ideas and more, prefer to omit them. I think it's a
"modern" choice.

We'll look at the strange statements shortly, as well as the
punctuation. But let's continue from where we started.

```javascript
module.exports
```

The reference to `module.exports` gives us confidence that what we're
indeed looking at is something that is a
[module](https://nodejs.org/api/modules.html) in a Node.js context. So
far so good, we can use that as an anchor for the rest of our
interpretation. What's assigned to `module.exports` is an anonymous
function, but that should be a fairly familiar idea to us, already.

```javascript
({ flight_trip_Bookings })
```

But further along the first line, we have something that looks
unfamiliar. What are those curly braces doing inside of the brackets
where we're expecting to see the function parameters? Well, that's a
new feature of ECMAScript\* 6 (EC6) which other languages such as
Clojure already have -
[destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).
Here, the function expects a map (or "object") as input, and the value
of the specific property `flight_trip_Bookings` in that map is what the
function needs.

*\*ECMAScript is the actual language, JavaScript is a dialect of that
language.*

```javascript
this.before
```

What about the body of this anonymous function? Well, we see a function
`before` being called, with an operation ("CREATE"), the value of the
`flight_trip_Bookings` that we received in the call (remember, we're
now inside the anonymous function), and another anonymous function, this
time defined in the new ES6 style using [fat
arrows](https://www.sitepoint.com/es6-arrow-functions-new-fat-concise-syntax-javascript/).
This anonymous function, passed as the third argument to the call to
`before`, expects a single value, in this case `cds`. Note that one of
the beautiful things about JavaScript is the support for higher order
functions - functions can be passed in, and received from, other
functions.

The effect of this call is that this inner anonymous function expecting
the `cds` parameter will be registered as a callback to any CREATE
operations on the "Bookings" table within the "flight_trip"
namespace. What does this callback function do? Well, it uses the
`cds` value passed in, which will represent the CDS runtime object (CDS
is a core part of the Application Programming Model runtime, as well as
being the language with which we declare data models and service
definitions).

```javascript
cds.run(()=>{
```

Let's stare at the parts inside this inner anonymous ES6 function now
for a bit. We seem to have something like this:

```javascript
cds.run(A).then(B)
```

In both cases, A and B are anonymous functions\*.

*\*Surprised? You shouldn't be - Scheme, a dialect of LISP, a
functional language, was in JavaScript creator Brendan Eich's mind when
he created JavaScript while working at Netscape.*

The first anonymous function expects no arguments, so is introduced in
ES6 fat arrow style like this: `() => { ... }`. The second is expecting
an argument. What is that argument? Well, notice the square brackets
here: `( [bookings] ) => { ... }`. In a similar way to what we saw in
the outermost function definition, here we also have destucturing at
work. In this case, however, rather than expecting a map, this anonymous
function is expecting an array, and only wants the first element in that
array to work with, which it will assign to `bookings`.

```javascript
SELECT.from
```

What is this chain of functions doing? Well, in anonymous function A, we
can see evidence of CDS's query language (CQL) which is based on
standard SQL, with various enhancements. Without going too much into CQL
here, we can see how the representation of CQL at the JavaScript syntax
level has been constructed so we can read it more or less like English.
This seems to be a common approach amongst domain specific languages and
especially those standard languages favouring a more flexible approach
to typing as well as embracing functional aspects.

Knowing that with ES6 style function definitions, the results of the
body's evaluation are automatically returned (i.e. there's no need for
an explicit `return` statement), we can surmise that any results of the
SELECT, from the "Bookings" table, will be returned from A.

```javascript
}).then(( [bookings] ) => {
```

With `then` we have effectively a promise style continuation, where the
anonymous function B receives the array of possible results, including
any "Bookings" entries in the first position of that array. Inside B
we have more mundane JavaScript, made slightly more interesting by its
use of more ES6 constructs - specifically the `let` and
`for ... of` statements.

The `let` statement is just used to declare a block scope local variable
(a "proper" `var`, if you will) and the `for ... of` allows the
processing of each of the items in the bookings that were passed in (so
we can presume also that `bookings`, the first value in the array passed
in, is itself an array).

If the total number of passengers exceeds a certain number, then the
error function of the CDS runtime object is used to return an exception
which will bubble up the stack and be returned in the response, in this
case with a rather handsome [HTTP 409](https://httpstatuses.com/409)
status code.

In summary then, this module is a bit of custom logic that will cause
the automatic handling of OData requests to react, specifically in the
case of CREATE operations on the Bookings entity, if the number of
passengers would mean that the total for the given Intinerary exceeded
capacity. The context of this custom logic is the complete OData service
that the Application Programming Model provides \-- in this case in a
Node.js context \-- given a service definition written in CDS.

## Reflection

That for me was a pleasant reflection, and I hope that, like me, you
went from looking at that piece of code with some wonder, to looking at
it with more confidence. I've deliberately left out some details about
the operation of the CDS runtime itself - perhaps I can come back to
that another time.

Instead, I wanted to show that it's straightforward and interesting to
peel back the perhaps initially unfamiliar surface, even at the language
syntax level, to reveal something that will educate us, enrich our
understanding, and even make us smile.

As I stare at the code, the blurriness give way to focus, the language
and dialect becomes more familiar, and the summit starts to appear.
It's clear to me that to be a good developer, I need to keep learning,
and this growth and effort is something I enjoy, especially when I can
do it by learning from folks who are bringing new techniques, frameworks
and models to us. Not quite standing on the shoulders of giants, perhaps
\... maybe just reading over their shoulder as they write.

As we move further into the cloud, and embrace more new techniques,
models and frameworks, we'll need to keep growing. And that, I think,
is a good thing.

## Bonus

If you've got this far, thanks for persevering! There's a couple of
bonus thoughts in this post. First, there's a semi-hidden literary
quote. Can you find it and point to the original? Second, the code in
the anonymous function B is one way of computing the total number of
passengers. It's in a "how to do it" procedural style, rather than a
"what I want" functional style. Can you come up with an alternative in
the latter style? I'd love to hear from you in the comments below.

---

This post was brought to you by a frosty morning, warmed up first by
Pact Coffee's Planalto and the later the welcome appearance of some
sunshine.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-growth-is-upwards/ba-p/13385530)
