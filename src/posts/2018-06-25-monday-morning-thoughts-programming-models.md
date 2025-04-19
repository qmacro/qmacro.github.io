---
layout: post
title: "Monday morning thoughts: programming models"
date: 2018-06-25
tags:
  - sapcommunity
  - mondaymorningthoughts
---

*In this post, I think about the idea of the programming model and
consider the occurrence of such over the recent years in the SAP
development ecosphere.*

**Update (same day)**: I interviewed Rui Nogueira on the new Application
Programming Model for the SAP Cloud Platform. You can get the interview
transcript and a link to the audio recording on this blog post:
"[Interview with Rui Nogueira on the new Application Programming Model
for SAP Cloud
Platform](/blog/posts/2018/06/25/interview-with-rui-nogueira-on-the-new-application-programming-model-for-sap-cloud-platform/)".

I was lucky enough to be able to attend and speak at
[UI5con@SAP](https://openui5.org/ui5con/) this year - the event took
place last Friday in SAP building ROT03 in St Leon-Rot. In the keynote,
we learned about UI5 evolution, and one of the phrases that stood out to
me, not specifically related to UI5, was "programming model":

>
> Learning about the new
> [#UI5](https://twitter.com/hashtag/UI5?src=hash&ref_src=twsrc%5Etfw)
> programming model, moving beyond (but not abandoning) "UI5 classic"
> to a web component based approach.
> [#UI5con](https://twitter.com/hashtag/UI5con?src=hash&ref_src=twsrc%5Etfw)
> [#angular](https://twitter.com/hashtag/angular?src=hash&ref_src=twsrc%5Etfw)
>
> --- DJ Adams (@qmacro) [June 22,
> 2018](/tweets/qmacro/status/1010070652294922240/)

## Programming model

Hearing "programming model" in a UI5 setting was not unexpected, but
it certainly reminded me of a long-running background job in my mind
which was occupied with noticing and collating various uses of this
phrase.

The idea of a programming model is not new; looking at the [Wikipedia
entry for the phrase](https://en.wikipedia.org/wiki/Programming_model),
and reading other articles that centre around the idea of a programming
model reveals only that it's a general term that is useful for
collecting together technologies and techniques that work well together
in a certain context or for a certain purpose.

So it stands to reason that the phrase has cropped up over time within
SAP programming contexts.

## Spotting models in their natural habitats

I first started noticing the phrase back in 2016, in this form: "The
ABAP Programming Model in S/4HANA". This particular instance was the
title of a session
([DEV109](https://www.sap.com/documents/2017/03/867e02d4-ac7c-0010-82c7-eda71af511fa.html))
at SAP TechEd 2016. Earlier that year, carine.tchoutouodjomo published
an excellent blog post whose title also included the phrase, albeit in a
slightly different guise: "[Getting Started with ABAP Programming Model
for SAP Fiori Apps in SAP
S/4HANA](https://blogs.sap.com/2016/04/04/getting-started-abap-programming-model/)".

In 2017 Andre Fischer posted "[How to develop a transactional app using
the new ABAP Programming Model for SAP
Fiori](https://blogs.sap.com/2017/09/14/how-to-develop-a-transactional-app-using-the-new-abap-programming-model-for-sap-fiori/)"
(Andre and Carine are colleagues from the same team, and I was very
happy to be able to connect with them both while I was at the mothership
last week). Later that year Karl Kessler published an article in
SAPinsider called "[ABAP and the
Cloud](https://sapinsider.wispubs.com/Assets/Articles/2017/November/SPI-ABAP-and-the-Cloud)"
and talked about the "RESTful ABAP programming model", a phrase I'd
also seen before and even shortened to "RAP". Furthermore I've seen
references to the "[ABAP programming model for SAP
Fiori](https://help.sap.com/doc/8f6fdeca4a26454185a19c96bfdd4e4e/1610%20000/en-US/frameset.htm)".

So we have different terms that are used in variations of the same theme
-- terms such as ABAP, HANA, S/4HANA, Fiori, RESTful, and so on.

Fast forward to today. A couple of weeks ago at SAPPHIRENOW [we
saw](/tweets/qmacro/status/1004687032411672576/) the advent
of the "Application Programming Model for SAP Cloud Platform", which
Daniel Hutzel introduced in a blog post "[Introducing the new
Application Programming Model for SAP Cloud
Platform](https://blogs.sap.com/2018/06/05/introducing-the-new-application-programming-model-for-sap-cloud-platform/)"
and which I touched on in a couple of previous [Monday morning
thoughts](/tags/mondaymorningthoughts/) posts
("[the learning
continuum](/blog/posts/2018/06/04/monday-morning-thoughts:-the-learning-continuum/)"
and "[Core Data
Services](/blog/posts/2018/06/11/monday-morning-thoughts:-core-data-services/)").

## Twisty little passages

I'm suddenly mindful of the famous phrase "a maze of twisty little
passages, all alike" from the 1970's text adventure game "Colossal
Cave Adventure":

![Photo of Colossal Cave being played on a VT100 terminal](/images/2018/06/Colossal_Cave_Adventure_on_VT100_terminal.jpg)

*Playing the Colossal Cave Adventure on a VT100 terminal, courtesy of
[Wikimedia
Commons](https://commons.wikimedia.org/wiki/File:Colossal_Cave_Adventure_on_VT100_terminal.jpg)*

(Serendipity: In reading the Wikipedia article on Colossal Cave
Adventure, I noticed that a
[footnote](https://en.wikipedia.org/wiki/Colossal_Cave_Adventure#cite_note-22)
mentioned [SHRDLU](https://en.wikipedia.org/wiki/SHRDLU), which was an
early natural language understanding program developed by Terry Winograd
in the late 1960's. Back in the day, I took shrdlu's name for one of
my machines, which co-incidentally features in [yesterday's "on this
day"
tweet](/tweets/qmacro/status/1010932700230889473/):

![](/tweets/qmacro/tweets_media/1010932700230889473-DgeN7KyW4AAHnj6.jpg)

which in turn points
to a post of mine from 2004 "[Forget SOAP -- build real web services
with the
ICF](https://blogs.sap.com/2004/06/24/forget-soap-build-real-web-services-with-the-icf/)".)

Anyway, on first sight, it would seem that these are different,
competing programming models. It doesn't take long to realise that that
this isn't actually the case. The biggest difference (and it's not a
big difference) is between all the previous programming models and the
Application Programming Model for SAP Cloud Platform - and that
difference is that the target runtime for the latter is the cloud
generally, and the Cloud Foundry environment in particular. A model that
moves us closer to cloud native development for sure.

## A general pattern

Digging in a little deeper, a general pattern emerges. There are many
ways to express this pattern, but let's frame our thoughts using a
couple of diagrams.

The first diagram is from the aforementioned DEV109 session, and is
titled "ABAP programming model for SAP Fiori and SAP S/4HANA". Yes,
this is yet another variation, but it all amounts to the same thing -
the technologies and techniques for building standardised, cloud-ready
apps for S/4HANA:

![](/images/2018/06/Screen-Shot-2018-06-25-at-08.08.13.png)

Elsewhere in the session, one learns why this model has emerged: what's
needed for today's cloud-first world is a stateless, scalable,
extensible context where we can build and deploy apps that are pleasant
to use, that are able to support continuous and team-based work (via the
concepts of draft, device switching and explicit collaboration), that
allow us to plug into standard SAP-delivered application layers and
extend them, and that have the right frameworks to support consistent
development and support.

The result is a separation of concerns, with Fiori and UI5 providing the
infrastructure that faces the user, HANA providing the database
management system with a rich set of features that augment the
application layer, and a family of frameworks in the middle that allow
the use of standard, open protocols (such as the REST-informed
[OData](http://www.odata.org/)) and provide a consistent approach, via a
common language, to modelling and implementing data and application
logic.

That language is Core Data Services, of course. But you knew that
already, didn't you? Along with the Service Adaptation Definition
Language (SADL), for dispatching requests and dealing with model-based
data retrieval and processing, and with the Business Object Processing
Framework (BOPF) which helps us handle persistency and locking as well
as providing us with mechanisms and patterns for extending standard
processing (with actions, determinations and validations), this middle
layer is really the heart of the programming model.

Not surprisingly, if you look at the new Application Programming Model
for SAP Cloud Platform, the same patterns emerge. The abilities to drive
the application design and development by concentrating on the data
model, the way the user experience (UX) and user interface (UI) are
separate from this, but not so separate as to require you to start from
scratch (yes, I'm alluding to annotations and metadata extensions that
can be used to inform, or influence, what the UI looks like at runtime)
and the extension possibilities \... they're the same. It's just that
right now, the target runtime for the middle layer is different. And
that's pretty much the point - a good programming model might have
variations, but it's the qualities of abstraction that are key.

Let's have a look at another diagram, this time from an [update for SAP
developers](https://www.slideshare.net/thomasgr/whats-new-for-sap-developers)
from thomas.grassl following SAP TechEd last year:

![](/images/2018/06/Screen-Shot-2018-06-25-at-08.25.51.png)

"Ooh, gosh" I hear you cry. The magic combination of the words
"ABAP" and "SAP Cloud Platform" invokes in all of us some sort of
feeling (dread, excitement, or a combination thereof). Yes. But once we
get past the initial reaction and think about the context of what we're
looking at, the wonder of the pattern emerges once again.

The general programming model, that encompasses the minor variations
that we've seen, extends to this brave new world\* in which a clean
and pure version of our favourite backend programming language could
become available to us to implement the backend application logic part
of our model directly in the cloud, dovetailing with CDS and the related
frameworks that we have seen.

(\* Incidentally, one of the characters in Aldous Huxley's [1930's novel](https://en.wikipedia.org/wiki/Brave_New_World)
is [Bernard
Marx](https://en.wikipedia.org/wiki/Brave_New_World#Characters) who is a
sleep-learning specialist; I've often wondered
whether [hypnopædia](https://en.wikipedia.org/wiki/Sleep-learning) would
help a lot with my [learning
continuum](/blog/posts/2018/06/04/monday-morning-thoughts:-the-learning-continuum/).)

## Wrapping up

The more I think about it, the clearer the picture becomes. What started
out as a slightly bewildering array of variations of names has become
clearer as I meditate on the core meaning and purpose of each. And
rather than confuse matters, the SAP Cloud Platform flavour actually
stabilises the idea of the programming model for me.

I hope that this morning's post gives you some food for thought.
Perhaps, like me, you've also been wondering about the array of
programming models, and perhaps, if you've made it through my
meanderings thus far, you will see the overarching patterns too. In any
case, let me know your thoughts below.

---

This post was brought to you by the clear sky of dawn over Manchester,
and a friendly [house
sparrow](https://www.rspb.org.uk/birds-and-wildlife/wildlife-guides/bird-a-z/house-sparrow)
that sat nearby as I tried to gather my thoughts into some sort of
order.

---

Read more posts in this series here: [Monday morning
thoughts](https://blogs.sap.com/tag/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-programming-models/ba-p/13372944)
