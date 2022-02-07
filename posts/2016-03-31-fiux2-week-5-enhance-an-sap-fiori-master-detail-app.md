---
layout: post
title: '"fiux2" Week 5 - Enhance an SAP Fiori Master Detail App'
---


(See first post in this series — [“fiux2″ – The openSAP Fiori Course – 2016 Edition](/2016/03/04/fiux2-the-opensap-fiori-course-2016-edition/) — for links to the other posts).

So week 5 came and went rather quickly – perhaps it was the Bank Holiday weekend! This week sees the introduction of the Develop Challenge, as well as the main content of this week – looking at more advanced features of the SAP Web IDE. Let’s review the units.

**Unit 1 “Enhancing Your SAP Fiori App with the Layout Editor”.** This was a good introduction to the Layout Editor – an alternative way to edit Fiori app views. The Layout Editor is an accomplished piece of software, especially when you consider it’s running in the browser. I wouldn’t say it is my first choice for editing view definitions, but for the occasional user, it might be just the right thing. (There’s an argument that says occasional users shouldn’t be messing around with the innards of Fiori apps, but I’ll leave that for another day).

It’s interesting to remember that one of the reasons why such a thing as the Layout Editor is possible (and indeed the view part of the extension concept). Views in UI5 can be defined imperatively, in JavaScript, or they can be defined declaratively in JSON, HTML or XML. All three of these declarative formats are much easier to parse and manipulate programmatically – which is what the Layout Editor is doing.

The format of choice for Fiori apps is XML – I wrote an introduction to XML views, contrasting them to their (then-more-popular) JavaScript equivalents, in a post as part of a series ([Mobile Dev Course W3U3 Rewrite](http://scn.sap.com/community/developer-center/front-end/blog/2013/10/16/mobile-dev-course-w3u3-rewrite--intro)) on the SAP Community Network back in 2013: [Mobile Dev Course W3U3 Rewrite – XML Views – An Intro](http://scn.sap.com/docs/DOC-49095). If you’re still trying to decide what format to use, XML should be where you start – simple as that.

Anyway, take a look at this unit to find out more about the Layout Editor. Moreover, if you haven’t used it yourself, there’s a related exercise which goes into great detail – including data binding. The 34-page exercise document is called “Enhance Your SAP Fiori App with the Layout Editor” and it sits between this unit and the next.

**Unit 2 “Develop Challenge: Build Your Own App with Peer Review”.** Can you say “meta-course”? This unit merely covered the details of the Design Challenge. That said, “merely” doesn’t really do justice to this unit, or the information imparted.

There’s a lot packed into this course, including two major hands-on activities – the Design Challenge and the Develop Challenge, with their respective peer review activities to boot. I’m struggling a little to keep up with what’s required, especially as I’m dipping in and out of the course material when I have time.

So while this unit helps, I’m still a bit confused – particularly about when the peer review for the Design Challenge is to start. That confusion was increased by the deadline extension given for this challenge ([that I mentioned last week](/undefined/)). But perhaps I’m just getting old. I checked my Study submitted via Build / Splash, but have had no peer feedback yet. Nor have I had any prompting to start the peer review (we all get 5 submissions to review).

Update – I did some digging around, and you can now get to the peer review section within the Design Challenge section, as shown here:

![image]({{ "/img/2016/03/Screen-Shot-2016-03-31-at-08.43.06.png" | url }})

So don’t wait for any prompts or emails – just go there and start!

**Unit 3 “Other Considerations in Building an SAP Fiori App”.** Well this was certainly a challenging unit! Challenging for the audience (it was a sudden slip off the relaxing poolside into the deep water), for the presenter (squeezing that much content into a 15 minute video was clearly a struggle) and challenging for the course as a whole, because while extremely important, it didn’t really fit into the flow of where this course has come from.

As a small example, one of the slides showed a snippet of a key artifact in any Fiori app – the Component.js file (unfortunately written on the slide as Component**s**.js). To understand the context, the audience would have to have some non-trivial knowledge of UI5 development. This is coming (in a course starting in April, hurray!) but we’re not there yet.

It was like a whirlwind tour of lots of small performance and security related topics, which if done properly, could be expanded into a 3 or 4 day course :-) So in that sense, it was useful to impart. But I wonder how much of that information was really understood?

This unit talked about OData Choreography – a phrase I like – but it also had a couple of questionable pieces of advice, at least in my view. If you want only three properties of an entity rather than the three hundred it normally sports, you were advised to create another OData service. That’s not what I’d do – rather, I’d use the power of the OData protocol and use the query string option “[$select](http://www.odata.org/documentation/odata-version-2-0/uri-conventions/)” to return just the properties I needed.

I also do baulk somewhat at the recommendation to use [$batch](http://www.odata.org/documentation/odata-version-2-0/batch-processing/). In a TLS (ie HTTPS) context, URI security is fine, and while increasing performance (by batching up multiple requests), batching makes the application mechanics more opaque and difficult to support and debug. The approach also flies in the face of the architectural style that has informed the OData protocol as a whole – REpresentational State Transfer (REST). Don’t mask resource identifiers (URIs) and hide them where they don’t belong!

Finally, it would have been nice to hear a more compelling explanation of the reasonings behind the “one app / one service” rule. But perhaps that’s coming later.

All in all this unit was a useful, if slightly inconguent, poke in the ribs for the attendees to let them know it’s not just point-and-click in the Web IDE Layout Editor. I guess my comment about occasional users earlier in this post is relevant here too :-)

**Unit 4 “Creating an SAP Fiori App with a Smart Template”.** The combination of OData, annotations, and Smart Templates is a powerful one. We had a brief introduction to Smart Templates in [week 3](/2016/03/17/fiux2-week-3-get-ready-to-create-your-first-app/) so I need not dwell on them too much again here.

Suffice it to say that this unit showed a pretty impressive demo – a happy path demo, but a good one nevertheless. One of the things that stood out from the slide notes, and brought up by the presenter, was that with Smart Templates, there are “NO modifications”. I’ve yet to find out what that really implies; read-only code sometimes goes hand-in hand with auto-generation, but I’m pretty certain that what we’re going to end up with is something workable. The UI5 toolkit itself does a lot of the heavy lifting here, so it’s not as if there’s a ton of code that’s being emitted.

It’s definitely an extremely interesting area, and one to watch and learn more about.

**Unit 5 “Introduction to SAP Fiori Overview Page”.** Pretty much a continuation of the previous unit, here we move on to another concrete artifact from the “smart” stable – the Overview Page, or OVP.

![image]({{ "/img/2016/03/Screen-Shot-2016-03-30-at-18.02.54.png" | url }})

You can’t help but be impressed by and attracted to this lovely combination of practical and visually appealing functionality. It’s a cross between the Fiori Launchpad and functions and features of Fiori apps, all on a single page.

But perhaps what’s most impressive is the way that the OVP plugin works and embeds itself seamlessly into the Web IDE. The generation of the core OVP example was impressive, but what really took my fancy was the addition, in the demo, of actual cards, via further wizards. When you consider the different teams that have been involved, it’s a great example of the tip of a complex iceberg, both technically and organisationally at SAP. Nice work, teams!

By the way – if this sort of UI presentation appeals to you, you may be interested in a free 1-hour webinar I’m involved in on 26 Apr. For more information, see the event’s homepage:

[The SAP Fiori Launchpad as a Human-Centric Dashboard](http://www.bluefinsolutions.com/events/the-sap-fiori-launchpad-as-a-human-centric-dashboa)

and maybe I’ll see you there!

**Unit 6 “Deploying Your App”.** This was the last main unit of this week’s course content, and covered, at a high level, what you do next after building your Fiori app. Basically there are a couple of main options – a deployment to a Fiori Launchpad site on the HCP cloud portal, or a deployment to an ABAP stack backend SAP system. There was another option shown in the slide and in the demo, to “clone *to* a git repository”. I can only think there was a little bit of confusion here – git clone goes the other way – creating (pulling) a copy of an existing repository, not instantiating (pushing) a new repository.

But we’ll gloss over that for now, especially as the key git parts of the workflow – when deploying to HCP – were actually shown. There are some gotchas with the git workflow when it comes to using different branches (which you should be doing during development). You may be interesting in this screencast I recorded showing you the challenge, and the solution: “[SAP HCP, git, and Feature Branches](https://www.youtube.com/watch?v=OtCt8lQAttA)“.

It was good to see the relationship between the app itself, the portal FLP site, HCP along with the roles, even though it was a very quick high level overview. Almost directly after the video was recorded (mid Dec 2015) some improvements have been made to this area, notably, with SAP Web IDE release 1.19, the ability to specify *which* FLP site you want to deploy the app to. You can have multiple FLP sites in your HCP portal account, and the ability to specify the right target site is key. See “[Registering Applications to SAP Fiori Launchpad](https://help.hana.ondemand.com/webide/frameset.htm?b075d767e91f422b8b4be4e8c6fd5ab7.html)” documentation for more details.

One thing that struck me as a little odd was the tile definition demo. After the Tile Configuration part of the wizard was complete, we looked at the tile in the FLP, but it had different text (title and subtitle) to what had been defined. I can only think that this might have been the product of a video splice … and serves as a reminder of how hard it is to create even one tutorial video, let alone multiple series! (I speak from first hand here). So my hat goes off to the teams that turn out such great content for all these openSAP courses.

For some of the audience, it might have been worth just spending a bit of time explaining the BSP Application connection, when the deployment to an ABAP repository was shown. Of course, there isn’t a connection – you’re not travelling back in time to the Business Server Pages technology arena; rather, it’s just that the storage container for a BSP Application was deemed “good enough” to contain all the artifacts of a Fiori app – it being a web app after all.

On the subject of deployment, this time to the FLP, it would have also been nice to mention the difference between the “webapp” folder and the “dist” folder created in such circumstances. But perhaps that will come up in another course.

Despite these gaps, it was a good overview unit that completed the picture.

Post Script: one of the self-test questions for this unit rather unfortunately suffered from perhaps being set by someone other than the person who wrote or presented the unit video content; there isn’t a single “correct process for deploying an SAP Fiori app to the cloud Launchpad”, and the officially correct answer doesn’t reflect the procedure that was shown in the video. Ah well, it’s only a self-test :-)

That’s about it for this week – see you next time!

 


