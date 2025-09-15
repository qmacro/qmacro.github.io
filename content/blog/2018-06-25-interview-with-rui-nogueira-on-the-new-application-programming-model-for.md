---
title: "Interview with Rui Nogueira on the new Application Programming Model for SAP Cloud Platform"
date: 2018-06-25
tags:
  - sapcommunity
---

*In this post you'll find a transcript of an interview between me and
Rui Nogueira on the new Application Programming Model for SAP Cloud
Platform. There's also a link to the audio version, available via
Coffee Corner Radio.*

Last week I was in Walldorf, and I managed to catch up with an old
friend Rui Nogueira where we chatted about the new Application
Programming Model for SAP Cloud Platform (gosh, we're going to have to
find a short way of saying that at some stage soon!). This new
Application Programming model was
[introduced](https://blogs.sap.com/2018/06/05/introducing-the-new-application-programming-model-for-sap-cloud-platform)
by Daniel Hutzel and there's also a decent amount of information about
it in the online SAP Help here: [SAP Cloud Platform - Business
Applications](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/00823f91779d4d42aa29a498e0535cdf.html).

I turned the chat into an interview that we could share with you. I
transcribed it, and the transcription is below. I've also made the
audio available, in the form of an episode on the [Coffee Corner Radio
podcast](https://twitter.com/SapCoffeeCorner) - the episode is here:

[Pod bite 5 - DJ Adams - interview with Rui
Nogueira](https://anchor.fm/sap-community-podcast/episodes/Pod-bite-5---DJ-Adams---interview-with-Rui-Nogueira-e1n1mu)

I've done my best to find a balance between the "off the cuff" chat
style, and a flow that is easy to read in transcribed form. Share &
enjoy!

By the way, if you're interested in reading more about the concept of
programming models, and how this model fits in, you might want to read
this Monday morning thoughts post: [Monday morning thoughts:
programming
models](/blog/posts/2018/06/25/monday-morning-thoughts:-programming-models/).

## Transcription of interview

Date: 21 June 2018
<br>
Location: WDF03, SAP Walldorf
<br>
With: Rui Nogueira

DJ: So I'm here today with Rui, hello Rui!

Rui: Hello DJ!

DJ: And what we're going to do is just talk a little bit about
something that I chatted with Rui about at Sapphire, just to find out a
little bit more about it. We're just going to do it off the cuff
\...

Rui: Yes, we're just coming out of the coffee corner 

DJ: We're just coming out of the coffee corner

Rui: at the mothership!

DJ: We \*are\* at the mothership! In building 03, I've just had a
delicious lunch downstairs, including a very interesting asparagus &
herb soup, as well \[random conversation about the soup redacted\]

DJ: OK, so what Rui and I chatted about in Sapphire, was the new
programming model in town.

Rui: It's not just in town, it's even generally available

DJ: GA!

Rui: Yes! But I thought we'd just \... say it

DJ: Yes, it's generally available. And if I remember rightly, it's
called the "Application Programming model for SAP Cloud Platform". Is
that right, and what it is?

Rui: It is right indeed, and it's not a product, it's rather, as the
name also proposes, also that strange long name, application programming
\*for\* SAP Cloud Platform, to emphasise that this is not just a single
product, right, it's actually leveraging some open source technologies
as well as some SAP proprietary technologies. Mainly CDS, right, to help
you create, quickly, enterprise grade applications with enterprise grade
qualities on the cloud platform. So that's the main goal of this
programming model. 

DJ: OK, cool, so CDS - Core Data Services, right?

Rui: Exactly

DJ: So a lot of the listeners are going to be at least familiar with
that is in general, but what does CDS bring to this programming model,
how is it used?

Rui: So first of all, what we wanted to achieve with the programming
model is to not start from scratch with something new, but thinking: how
can we actually leverage the knowledge which is out there already around
HANA, around ABAP, and bring that to the cloud platform. And initially,
CDS built to define data models, right, for databases

DJ: \*annotated\* data models!

Rui: annotated, yes, so that you can derive out of that hdbcds files for
HANA, so that the schema is created and so on and so forth, and what we
have added to that, additional annotations for creating the
corresponding services, to also create UIs on top

DJ: So I know there's a tutorial, I saw the blog post from Daniel

Rui: Daniel Hutzel

DJ: Yes, exactly, and he pointed to the documentation in help.sap.com
and there's a really nice tutorial which I've been through quite a few
times  

Rui: The Bookstore example

DJ: Yes, the Bookstore example, and talking of the Bookstore example,
one of the things that struck me was the way that the entities were
defined - the Book entity, the Author entity, and so on. They reminded
me - I'm not sure if it's coincidence - of River, RDE.

Rui: Oh, yes, long time ago! 

DJ: Yes, I mean, even the way that they were whitespaced out, and
formatted and so on, I thought this reminds me of something, and I
couldn't figure out what it was. So yeah, it's nice to see that some
really cool ideas from way back when - I thought they were pretty cool -
have sort of found their way into something that's new, right?

Rui: Yes, and in addition, the other aspect, we also look into the
application programming model that you can easily also add and combine
other services, like business services, with it, so, again, via the
model itself, right, to be able to, on the one hand side, create
reusable business services, but also embed them into your application. 

DJ: Yes, I mean I get \... cos that seems pretty critical, with the
programming model itself, to be able to create net new applications (to
use that phrase "net new") - that's great, but I think a lot of
people, including me, will want to be able to build side-by-side
extensions for S/4HANA, for example, that's what you're talking about,
right?

Rui: Yes, exactly, and specifically for S/4HANA, there is also a
connection to the S/4HANA SDK which works also pretty well, so both
teams are working closely together to ensure that they can leverage each
other, and in addition, what we have done, is also using the programming
model to build here at SAP also applications. And also reusable
services, so, really taking that technology before it was generally
available, to test whether this really works to efficiently and
effectively create enterprise grade apps or not and we found gaps last
year, right, and we closed them, and I think we're now in a state where
I feel pretty confident that the application programming model really
helps you to create such applications. Is it perfect? Is maybe stuff
missing? Most probably yes, but what is definitely also true is that we
have been using this programming model now already last year, here with
SAP, to create services, specifically around security and data privacy,
and that worked out pretty well. 

DJ: So you're basically drinking your own champagne before you
actually give it to the public.

Rui: Yes, so, improving the champagne, right? 

DJ: No wonder your eyes look like they do!

Rui: This is just sparkling water!

DJ: OK. This is audio only. Because this morning I was told I have "a
face for radio".

Rui: Makes sense, kind of! 

DJ: So, one thing that is on my mind and I think on other people's
minds as well is that there do seem to be a lot of phrases, a lot of
places where I'm seeing the phrase "programming model". There seem to
be a number of programming models out there. Where does this fit in \...
for example, there's the programming model for Fiori, and there's the
RESTful ABAP programming model and so on, so where does this fit in?

Rui: I think what has been developed before is still there, right, and
if people called it "programming model" it's definitely true.
Specifically for the application programming model, as I said before, we
are trying to create a combination between open source topics and SAP
proprietary technology and the way that the programming model is built
is that yes for sure we currently start with for example on the
persistence side with HANA, on the server side with OData, on the UI
side with SAPUI5 and Fiori, but the whole model allows us to go beyond
that and also maybe create other assets, right - on the persistence side
to maybe create assets for other databases \...

DJ: So create definitions for other targets?

Rui: Exactly. So of course we start with these technologies now with SAP
products, but the model itself open 

DJ: Sort of an abstraction layer, really, isn't it?

Rui: Yes

DJ: I know that from reading the documentation as well, for example,
the target, the stuff that gets generated from an application
programming perspective is, in the first incarnation, Java, but, you
know, I can equally imagine \...

Rui: NodeJS

DJ: NodeJS, for example - and may be, I'm fishing here, maybe you
know, when ABAP on the Cloud Platform goes GA, maybe generating some
ABAP stuff as well? Is that in our vision?

Rui: To be sure, I don't know.

DJ: I think that would be quite cool.

Rui: Yeah, in essence the underlying technologies are the same, right,
the model is very similar

DJ: It's a pattern, isn't it

Rui: Yeah, so most probably yes, but I'm not sure if it's on the
roadmap.

DJ: No, OK, that's cool. So, you were talking about the general way
things work, and it seems to me as well, correct me if I'm wrong, this
is probably the nearest we are so far to, what am I going to call it, a
cloud native programming model. Because, if I understand it correctly, I
was looking at what the Web IDE was doing for me, which seemed to be a
lot, while following this tutorial, the assets that are created and
deployed are deployed to Cloud Foundry on the SAP Cloud Platform, is
that right?

Rui: Yes, it is. 

DJ: Because that seems to be to be exactly the direction we should be
looking at going, right?

Rui: Yeah, so it's open, right, and you can in theory create any, or
leverage any other programming language, right \... as you said, we are
now starting with Java, NodeJS, and in general what we always look at is
what are the programming languages that our customers demand most, and
we certainly need to focus, right? To get things right, to start with
Java first, because still, although we have all the other cool
programming languages out there, I think there is still a huge community
around Java. NodeJS \...

DJ: That's growing \...

RuiL: It's growing a lot, but it's better to have at least one
programming language kind of complete, right, instead of having stuff
just half baked on two programming languages. 

DJ: I agree. Much as I would like, if not prefer, personally, to see
NodeJS, I'm not the world's biggest fan of Java per se, but I value
the whole idea of getting something first, and then expand.

Rui: Who knows what happens in the next months, you never know!

DJ: Woo, sounds exciting!

Rui: Stuff coming kind of, soon \...

DJ: No, that sounds good, that sounds quite exciting. Actually,
talking about soon, or next, I think it's fair to say that this is, for
people like me, you know, like regular on-the-street developers, who
have been doing stuff in the SAP ecosphere, it's quite a bit step,
right, quite a big step to this new world. What would you recommend
developers like me do to move closer to, and take the next step in this
direction?

Rui: I think initially really looking into CDS in general, to make
yourself familiar, what CDS is, what it does, and I think, the best
thing that you can do is take, for example, such an example in the
help.sap.com web page, the bookstore example: Going through the
tutorial, and then trying it out to make it work, and then actually
modifying it, as long as you break it, and then getting to the next
stage and saying OK, now I think I know how it works \... let me try to
not do the straightforward way, right, let me say OK, now this stuff is
generated for me, I would like to have some modifications in terms of:
If I'm updating the table, or if I'm adding new rows to that table,
before, I would like to execute my own code, right, and then finding out
how these extension points work in the programming model. And then going
to the next step, right, making it work, and then you modify, or you
improve it until you break it, and then getting to the next stage

DJ: That reminds me, one of the parodies of the O'Reilly books,
called O'Rly, that you see sometimes on Twitter, and my favourite one
is: "Developing: Changing things and seeing what happens". And I think
that's basically what you were saying, in a roundabout way.

Rui: I would say, still \... I have a young boy from school here with
me, seventeen years old, and I think still it's important to have some
basics, right? So that you know the technologies, you know how certain
things work, and really \... yes, there's a craft\[man\]ship that you
have to go through, but if you have that stage to really, now, find out
how SAP technologies work, that's how I normally work, so I hope I have
the foundation, and then I say OK, instead of reading books, how it
should work, I just try it out. Then I just try crazy stuff, and then I
find out oh - maybe I completely misunderstood the whole concept, and
that's I think where you get to the next level, to really understand
where this difference is coming from.   

DJ: In fact you've mentioned something that we'll pick up another
time, because we've run out of time now, but - extension points \...
that reminds me a little of the actions, determinations and validations
in the BOPF world, on the ABAP programming model side, but \...

Rui: Let me tell you a secret

DJ: Go on, tell me a secret

Rui: I can't do any ABAP

DJ: What?!

Rui: But keep that secret, don't tell anybody!

DJ: And on that bombshell \...  Rui - I'm going to press STOP now,
thank you very much!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/interview-with-rui-nogueira-on-the-new-application-programming-model-for/ba-p/13372313)
