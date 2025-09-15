---
date: 2015-03-02
title: 'Can I build a Fiori app? Yes you can!'
tags:
  - bluefinsolutions
---

This started out as an essay as preparation for my keynote at Mastering SAP Technologies in Johannesburg, Feb 2015. I've split it out into two parts, the second of which will give you 10 tips to get you started on your Fiori development journey

In Feb 2015 [The Eventful Group](https://www.theeventfulgroup.com/) ran a great conference in Johannesburg - [Mastering SAP Technologies](http://www.masteringsap.co.za/tech). I was honoured to have been invited as a speaker, and I gave a keynote on the first day; the keynote was [one of three items](/blog/posts/2015/02/16/speaking-at-mastering-sap-technologies/) I was contributing to the agenda.

## The philosophy of Fiori

The title of this piece is in two parts. If we're not careful it could be a very short piece, because I've already given you the answer in the second part - "Yes!". What else do you need to know?

Well, let's start with some assumptions. I'm going to assume that, at least to a greater or lesser extent, you're possibly a developer, or at least are of a technical nature ... otherwise, you may want to stop reading now ;-). And that you're wondering about Fiori. What it is, how it works, what the component parts are, and how you put a Fiori app together.

You might be faced with the exciting yet terrifying prospect of building one from scratch; you might be more in the game of modifying and extending existing standard SAP Fiori apps. And you'd be in a good place; Fiori is a huge part, some might argue the single most important part, of SAP's frontend future.

### Some definitions

In order to work out why the answer to the question is "yes", let's back up a bit and start with a few definitions. Let's have a look at what Fiori means, what it represents.

#### Philosophy

![VA01, with the kitchen sink. Not Fiori](/images/2015/03/Can-I-build-a-Fiori-app-1.jpg)

It's a philosophy. It's a novel approach to work where the focus is not on a thousand features, the focus is on a particular undertaking that a business person, wearing a particular hat, needs to complete. It's about moving from a transaction oriented view of work to a role and task oriented view. Perhaps you've seen the 1-1-3 concept in early Fiori documentation - one user, one use case, three screens.

#### User experience

It's user experience. UX, as the hip designer kids say these days. This is pretty closely related to the 1-1-3 concept. Three screens. What do those screens look like? It's not about the colours, but it *is* about what a user sees, and perhaps just importantly what a user doesn't see. It's also about how a user navigates through the task at hand, and also how they become familiar with visual paradigms so that when they move from one task, say, approving a purchase order, to another, such as managing a product, things are familiar, and they know what to expect.


![PO approval, Fiori reference app](/images/2015/03/Can-I-build-a-Fiori-app-2.jpg)

![Manage product, Fiori reference app](/images/2015/03/Can-I-build-a-Fiori-app-3.jpg)

#### Cross platform

It's cross platform. And that means written for the One True Platform, i.e. the web. Web native. So it runs on different devices, with varying screen sizes. Desktops, tablets, smartphones. Even Windows phones! If that's not cross platform, then I don't know what is.

So I've got this far and our conclusion must be that Fiori is actually a state of mind.

![Fiori is a state of mind](/images/2015/03/Can-I-build-a-Fiori-app-4.jpg)

There are these vague but well-meaning notions that describe pretty well the "how" and the "why" but what we haven't really covered is the "what".


### The distinction between UX and UI

But that's partly the point. I used the phrase UX, and specifically UX. Not UI. There's a distinct difference between the general notions of user experience, and how that user experience is realised. At some stage, in every computing context, you're going to have to come down to bare metal.

And in our case, that bare metal is at the UI layer. There's also the data layer, don't worry, I haven't forgotten about that. But let's just concentrate on the frontend for now.

Have you noticed the subtle distinctions that SAP are making with regards to Fiori UX and UI? I outlined that distinction in a blog post around this time last year: The essentials: SAPUI5, OpenUI5 and Fiori. Now SAP are underlining that distinction by creating a brand new community in the SAP Community Network, specifically for Fiori. There's already a community for UI5, but now there's a separate community for Fiori. And that's sort of the the point I'm trying to make.

Before we get down to UI5, let's just consider this abstraction we know and already have started to love, called Fiori. It could be realised with all sorts of different technologies. If you think about it, that abstraction, that distinction between philosophy and practicality, is the one way SAP can continue to forge ahead with some sort of (eventually) unifying user experience strategy while at the same time dealing with the reality of products from differing sources, with differing frontends - Concur, Ariba, Lumira, and more.

Don't hold your breath, they haven't even managed to get login working properly and cleanly on their service portal even after more than a decade ;-) But the thought and the focus and the intention is very much there.

## Getting down to it

So Fiori is technology agnostic, and deliberately so. But at some point you're going to want to actually build something, so let's start to descend through the clouds down to reality.

We know the runtime platform for Fiori is the Web. That means HTML5.

![The HTML5 logo](/images/2015/03/Can-I-build-a-Fiori-app-5.jpg)

HTML, CSS, JavaScript. But cross platform at this level only tells us half the story. Where's the data coming from? An SAP backend system. You could say it's "cross backend" too. ABAP and HANA stacks are the source for the business data and functions that power Fiori apps, made available via a unifying layer, which we'll look at shortly.

So, let's get to to it.

Right now, practically speaking, to build a Fiori app, you need three things: UI5, OData, and Nothing Else. (with sincere apologies to the late, great, Douglas Adams).

### UI5

Let's start with UI5. UI5 is a toolkit for building client-side apps that run in the browser. There are of course other libraries, toolkits and frameworks out there that are in the same space, but this one is special. This one is from SAP, so it's industrial strength, enterprise ready, full of features, and a large part of it has been designed and built from the ground up for Fiori. What sort of features is it full of?

![The UI5 logo](/images/2015/03/Can-I-build-a-Fiori-app-6.jpg)

#### UI5 features

Well, full support for Model-View-Controller, for a start. Fiori apps can be complex beasts, and adopting an MVC approach to your code design is almost a must, if you want to survive with your hair intact.

And then there's a very accomplished data model mechanism for client and server side models, with a rather powerful binding system.

Need to write apps that work in different languages, some of them right-to-left? Got that covered. Need to make your apps extensible? Yep, got that covered. Need to build your views declaratively? Yep. Want to construct your complex designs in a componentised way, with routing in between? Yep. You get the picture.

And have I mentioned JavaScript? Well of course not, it almost goes without saying. JavaScript is the water that flows through the channels in the browser; for many, it's the new assembler, the new ultimate compilation target. And UI5 is a JavaScript toolkit.

#### JavaScript

There's a lot of navel gazing out there right now about web toolkits and frameworks not being "native" enough, not being JavaScript-y enough. Frankly, I don't understand that. The whole point of a framework, of a toolkit, is to make you more productive. And to do that by providing abstractions and mechanisms that allow you to get things done, to build responsive user interfaces and interact with data in backend systems, while not tripping you up or getting in your way.

So to build with UI5 is to build using JavaScript, but it's not the full story. It's understanding and properly wielding MVC. It's understanding how to build applications where your application logic is separated from your view definitions. And it's understanding where the joins are. It's also understanding how to build an application that allows a user to get on with the task in hand. They have a role, they have a task to perform, and they want to carry it out with as little fuss as possible.

But it's also understanding where the data comes from, and where the frontend meets the backend.

### OData

And that's where OData comes in. OData is a protocol and a format. Folks like to say that OData came from Microsoft, but the truth is actually a lot more interesting. It came from RSS, or rather, from the broken community that was borne out of a specific person trying to own the space (and failing).

#### History

The Atom syndication format was a potential replacement for what we knew and loved as RSS. It was designed to represent things. Blog post things, initially. Collections of things, feeds of entries, sets of entities. And then came a RESTful protocol to go hand in hand with that syndication format - the Atom Publishing Protocol. This protocol, APP for short, gave us the ability to manipulate those things, those entries, those entities. Create them, read them, update them, delete them, and query for them. Sounds familiar? Yes, of course, I'm describing the OData CRUD+Q operations.

#### WS-Deathstar

SAP adopted OData as a standard a few years ago, when they finally saw the light, and started looking for something to counter the onset of the WS-Deathstar syndrome, that was being brought on by the sheer weight of complexity that enterprise web services was imposing on the stack.

![WS-Deathstar](/images/2015/03/Can-I-build-a-Fiori-app-7.jpg)

It's as near to a REST framework as they could manage; although, in fact, there's no such thing as a REST framework. Like Fiori, REST is an approach, an architectural style, a philosophy, as much as anything else.

## Your journey

So where does that leave us? At a high level, we need to know about UI5 and OData. But there's more to it than that. Not to mention the question of whether you want to become a "full stack" Fiori developer, or just a frontend developer, or even just a backend developer. And if a backend developer, a full stack backend developer, or someone who focuses on "just" the business logic, or "just" the OData parts. There isn't enough time to cover all of that, but I'm sure you can extrapolate downwards into the data roots.

But for your journey to become a Fiori app developer, knowing you need UI5 skills is not enough. UI5 is a large and multi-faceted thing. How do you wield it? How do you work out what bits you need to master? And the same goes for OData.

If you're wanting to take your first steps on that journey, then I encourage you to read 10 tips to get you started on your Fiori development journey.

## Conclusion

Fiori is a great initiative, and it's supported right now at the bare metal level with a superb toolkit, UI5. That toolkit has had years and years of passion, love, experience (and blood sweat and tears) baked into it by people far more talented than I am. So I do the only sensible thing, and embrace all that hard work and put it to work for me. You can too.

---


[Originally published on the Bluefin Solutions website](https://web.archive.org/web/20180227042609/http://www.bluefinsolutions.com/insights/dj-adams/march-2015/can-i-build-a-fiori-app-yes-you-can!)
