---
title: "Monday morning thoughts: rethinking like the web"
date: 2018-11-19
tags:
  - sapcommunity
  - mondaymorningthoughts
---
*In this post, I revisit some principles that help us "think like the
web" and think about them in the context of today's SAP technology
landscape and community.*

Last week I watched someone I was with [apply for a job on
LinkedIn](https://www.linkedin.com/help/linkedin/answer/75815/applying-for-jobs-on-linkedin?lang=en),
using the Easy Apply feature, and it left me feeling a little
depressed.

![](/images/2018/11/Screenshot-2018-11-19-at-06.31.21.png)

I think the ability to apply to jobs via sites like this is a good
feature, it's just the mechanism we see at the top of this screenshot
that's the problem.

The problem is this part:

*Browse files to upload \-- Microsoft Word or PDF only (5MB)*

Don't worry, this isn't some point about productivity suite tools.
It's about the process assumed and implied. It's the assumption that
one will \*upload\* a document to LinkedIn's servers. The implication
is that one is being asked to party like it's 1999 (with apologies to
the artist formerly known as Prince), almost the equivalent of giving
someone a floppy disk with some out of date files on it.

In the age of the web, why are we still thinking and acting this way?
Uniform Resource Locators (URLs) aren't just some way of getting to
resources on the web, they are a fundamental part of the hypermedia
world that we are embracing when we use the web. As soon as we upload a
file to a server, as a way of sharing information, we're taking the
bread out of the packet and triggering a countdown to its "use-by"
date, asking for it - the data and the bread - to start going stale
immediately.

We should be thinking and acting like web citizens, not some
[sneakernet](https://en.wikipedia.org/wiki/Sneakernet)-like generation.
In other words, why isn't there an option to supply a \*link\* to the
canonical source of one's CV (résumé)?

(As an aside, I've had challenges with some conference organisers in
this respect too. Not only do they expect slides to be prepared weeks in
advance but some reactions to "here is a \*link\* to my slides" have
been less than encouraging).

## Seven ways to think like the web

Dramatically & metaphorically I rolled my eyes at this anachronistic
mechanism, and as they rotated in their sockets they caught sight of a
memory of a set of principles enumerated by [Jon
Udell](http://jonudell.net/) - principles to help us "think like the
web". Readers of some of my previous [Monday morning
thoughts](/tags/mondaymorningthoughts/) posts may
remember that I'm a long-time fan of Jon and his thoughts. LinkedIn's
upload-a-copy-of-your-CV-in-the-form-of-a-file process jarred so much in
my brain that it caused me to remember the first two principles, which
the process broke.

So I thought it worth pointing to these principles, which Jon outlines
in his blog post "[Seven ways to think like the
web](https://blog.jonudell.net/2011/01/24/seven-ways-to-think-like-the-web/)", and
consider them in a context that resonates with us - in our community. I
also thought it would be an interesting exercise to see how they might
also apply as we build solutions on the web with SAP Cloud Platform.

### 1. Be the authoritative source for your own data

In relation to this principle, Jon writes about the power of public
identity and how it is formed and maintained. For us in the SAP
Community, this means associating our identity with the content we
produce. For some of us, that means maintaining a blog of our own. If
you don't have that, or want the overhead of maintaining your own
domain, server, blog system and so on, then the SAP Community blog
system is the next best thing - it associates your identity with what
you write. What one loses from this principle in this context is offset
by the tremendous value we get from sharing ideas on the same
conversational platform.

In the context of solutions that we build on SAP Cloud Platform there
are multiple aspects to consider. One that immediately comes to mind is
the concept of multitenant application provision & subscription
(see Hariprasauth R's post "[Developing Multitenant Applications on
SAP Cloud Platform, Cloud Foundry
environment](https://blogs.sap.com/2018/09/17/developing-multitenant-applications-on-sap-cloud-platform-cloud-foundry-environment/)"
for an overview of this). When we subscribe to and use such an app on
SAP Cloud Platform we're reminded of the authority and identity of the
app's functionality by the very fact that the URL pattern includes the
app name as well as our own (subscriber) identity \... I'm thinking in
particular of the tenant host pattern.

By the way, this is the first of the two principles broken by the Easy
Apply system - as soon as the file containing a copy of the CV content
was uploaded, all identity and source connection was lost.

### 2. Pass by reference not by value

This is strongly connected with the first principle, and is the second
of the two principles broken by the Easy Apply system. As soon as you
pass by value, you lose control, and the recipient also loses accuracy
over time - any copy of data is stale by definition. Moreover, if you
need to update the data you've shared, it's a lot harder for you to do
so if you've made copies and scattered them to the wind.

In the context of SAP Cloud Platform, the concept of an API-first
approach to development comes to mind. Rather than base solutions upon
the requirement to replicate data between apps or services, think about
exposing an API to that data, so it remains the single source of truth
in a single place (see the first principle).

### 3. Know the difference between structured and unstructured data

The example Jon gives again relates to blogging, and is the difference
between data for human consumption and data for machine consumption.
Remember that Internet citizens are not all human\* so different
representations are required.

\*a fun corollary to that is the cartoon from the New Yorker, with the
caption "On the Internet, nobody knows you're a dog".

![](/images/2018/11/Internet_dog.jpg)

*From the New Yorker, a cartoon by Peter Steiner, 1993.*

In fact, resources and representations are core building blocks of HTTP
and the web, and I'd recommend looking into how these two concepts
relate. Briefly, resources are individually addressable bits of content
on the web (a resource has a URL). Representations are different actual
realities of those resources. In blogging terms, one representation of a
blog resource is HTML, for human consumption. Another representation of
the same resource is Rich Site Summary (RSS).

The representation requested and delivered is negotiated in the HTTP
request and response via "Accept" and "Content-Type" headers and is
called "content negotiation" or "conneg" for short. There are some
links in these following two posts that you may find useful for further
reading: "[Conneg and the duality of
weblogs](/blog/posts/2003/02/28/'conneg'-and-the-duality-of-weblogs/)"
and "[Coffeeshop screencast: HTTP conneg, resource representations and
JSON](/blog/posts/2009/08/20/coffeeshop-screencast:-http-conneg-resource-representations-and-json/)".

The concept of resources, representations and content negotiation
applies equally well beyond blogging; a flexible HTTP-based, API-driven
architecture on SAP Cloud Platform is one that embraces content
negotiation as a matter of course.

### 4. Create and adopt disciplined naming conventions

A great example of where this principle is very effective is in the user
tag space within the SAP Community. Two examples come immediately to
mind - I decided to tag each of the Monday morning thoughts posts with
the user tag
"[mondaymorningthoughts](/tags/mondaymorningthoughts/)"
and immediately I have a quick and efficient way to refer to the entire
collection of posts.

Likewise, I took it upon myself to tag my posts about the Application
Programming Model with the user tag
"[applicationprogrammingmodel](https://blogs.sap.com/tag/applicationprogrammingmodel/)",
with a similar effect. I managed to encourage other authors to do the
same, so we now have a collective and minimum-effort mechanism for
organising and sharing information about the topic.

When it comes to SAP Cloud Platform, perhaps the principle is harder to
apply. While there are ideas at work in the app URL space that we
referred to earlier, I think how we scale apps and services generally
means that there's less relevance. Have a read of "[Monday morning
thoughts: a cloud native
smell](/blog/posts/2018/04/09/monday-morning-thoughts:-a-cloud-native-smell/)"
for some thoughts on URLs for the cloud native era to see what I mean.

### 5. Push your data to the widest appropriate scope

The idea that stands out the most in Jon's explanation of this
principle is the concept of "directed or serendipitous discovery and
ad-hoc collaboration". When you write something and share it on the
web, you don't know how it will be received, much less how it will be
used, be recombined with other material to form new ideas or to inspire
thoughts in a related direction.

It's this principle that allows me to be a little more relaxed that I
otherwise would be about the first principle and that some folks are
blogging on a platform they don't control. The value of serendipitous
discovery of ideas and solutions simply as a side-effect of belonging to
and participating in the SAP Community is great.

### 6. Participate in pub/sub networks as both a publisher and a subscriber

In a previous post "[Monday morning thoughts: the cloud is the
computer](/blog/posts/2018/08/13/monday-morning-thoughts:-the-cloud-is-the-computer/)" I
talked a little bit about publish / subscribe (pub/sub for short). There's an
obvious connection for us in the SAP Community, where we publish blog
posts and Q&A content using tags, and subscribe to those we're
interested in.

But I think there's a much more interesting connection with solutions
that are possible today on SAP Cloud Platform, particularly in the area
of decoupled extensions to S/4HANA software. I've just started
following the new openSAP course "[Create and Deliver Cloud-Native SAP
S/4HANA Extensions](https://open.sap.com/courses/s4h13/)" and there's
this slide in Week 1 Unit 2 (SAP S/4HANA and Extensibility):

![](/images/2018/11/Screenshot-2018-11-19-at-08.57.16.png)

Bjoern Goerke's exhortation "[keep the core
clean](https://blogs.sap.com/2018/11/08/keep-the-core-clean-clarifying-points-from-bjorn-goerkes-keynote/)"
means, amongst other things, extending rather than modifying, and
building side-by-side extensions on SAP Cloud Platform allows us to do
that.

Interaction with the digital core can be multi-faceted, but the
"Business Events" part of the slide reminds me of what we saw at SAP
TechEd in Las Vegas and Barcelona - loose coupling in the form of
events, which are published and subscribed to by relevant software
parties. You can read more about this in last Monday's post on
[longevity and loose
coupling](/blog/posts/2018/11/12/monday-morning-thoughts:-longevity-and-loose-coupling/).

### 7. Reuse components and services

As the first and second principles are strongly linked, I think this
principle has a strong connection to the previous one too. In his
comments on this principle, Jon reminds us of the "small pieces loosely
joined" architecture that in part echoes a major principle of the Unix
design and philosophy\*.

\*As an aside, this reminds me of a wonderful post by [Sinclair
Target](https://sinclairtarget.com/) on his Two Bit History blog: "[The
Source History of Cat](https://twobithistory.org/2018/11/12/cat.html)".
If you haven't read his posts, you really have something to look
forward to and enjoy.

In another section of the first week's content on the openSAP course
referenced above, the concept of cloud native is described in terms of
four key pillars: DevOps, Microservices, Containers and Continous
Delivery. I think microservices embodies this principle very well -
solutions are broken down into small components, which can be built
using different technologies, composed into bigger solutions, be more
easily deployed and relatively simply replaced.

When we build solutions on SAP Cloud Platform, following this principle
will not only bring benefits from software lifecycle & resilience
perspectives, but will also mean that what is built is not orthogonal to
the underlying platform upon which everything (well, nearly everything)
is built - the web.

Jon's blog post is relatively old (it's from January 2011), but I
think that the principles he outlines & comments upon are still totally
relevant today; moreso, perhaps, as there's still a lot we are aspiring
to, rather than doing. And as we continue to aspire, we can allow those
aspirations to flow beyond the original ideas of us humans participating
on the web, to how we think about and design solutions in the new cloud
native world.

---

This post was brought to you by a wintry morning back home after a few
days in Gran Canaria and by [Pact Coffee's La
Concepcion](https://www.pactcoffee.com/coffees/la-concepcion) in my SAP
[Coffee Corner Radio](https://anchor.fm/sap-community-podcast) podcast
mug.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-rethinking-like-the-web/ba-p/13371656)
