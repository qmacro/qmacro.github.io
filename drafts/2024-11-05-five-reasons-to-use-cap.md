---
layout: post
title: Five reasons to use CAP
date: 2024-11-04
tags:
  - cap
  - talk
---
The SAP Cloud Application Programming Model (CAP) is an incredible feat of design and engineering. Not only that, but with respect to the core philosophy for SAP's ERP systems -- how they are to remain maintainable and upgradeable ("keep the core clean"), and how customers, partners and individual developers can add value by extending the business application functionality delivered as standard -- CAP is the goto, key strategic framework, along with its sibling the RESTful Application Programming Model (RAP), that has emerged triumphant, celebrated and dare I say "blessed" by SAP as what we should be using to work with and enhance what is delivered with SAP S/4HANA and more.

Moreover, CAP is not "just for us mere mortals" (otherwise known as "externals") - it's becoming the goto framework for product teams inside SAP too. And who doesn't want to grow skills in a framework with which future standard functionality is being delivered?

Before I start, I want to address the classic question so we can get it out of the way: RAP or CAP? The answer, in my book, is perhaps so simple that it appears flippant, trivial. But it really is as fundamental as this: For ABAP-heavy development teams, whether that weight is the weight of investment or runtime platforms, or sheer number of developer skills -- i.e. where ABAP is the centre of gravity with respect to language knowledge -- then RAP makes a lot of sense. For the rest of the landscape of teams, skills and endeavours, it's CAP, with support for two (arguably three[<sup>1</sup>](#footnotes), but that's a story for another time) languages.

But we don't even have to take SAP's word for it, or even faithfully follow SAP internal developers' lead. Digging into the details of CAP reveals myriad reasons why we should embrace it, adopt it, employ it. Here are five of them.

## 1 The code is in the framework, not outside of it

I wanted to start out with a reason that might appear at first sight as controversial, but really it's not. Right now, in the tech press, the blogosphere, social media, everywhere is awash with all things AI. In particular, right now, generative AI, and in regards to developers, what generative AI can do for them.

### Code generation with AI

When one thinks of generative AI and programming, one thinks of Joule (in SAP Build Code), of GitHub Copilot (in Microsoft VS Code), and of similar tools. What do these tools do? They help developers write code. Of course, it's more involved and detailed than that, but essentially, and as illustrated by the classic examples we've seen of Copilot suggesting chunks of code as you write, and of Joule generating whole files of both CDS and JavaScript, based on a text prompt, this is a core feature of such facilities.

But is this really the nirvana we're after? Generative AI and tools like these can bring incredible leaps forward in productivity, but the currency with which that productivity is ultimately measured ... is lines of code. Code that still needs to be checked for appropriateness, reviewed for efficiency, and tested for correctness.

Now, there are many circumstances where this sort of code generation makes sense. But we've already learned our lesson from the bad old days (decades before) where, in some quarters, developer productivity was measured in "klocs" - thousands of lines of code. And you know what? As many have pointed out in the past, [including Jeff Atwood][1]: the best code is no code at all.

The more code you have, the more you have to test and maintain. Somewhat alarmingly, the more code you have, the greater the surface area there is for bugs to hide and the more cracks there are for edge cases to fall through.

### Kernel space and user space

In operating systems there's the concept of [kernel space and user space][2]. The kernel space is for running a privileged operating system kernel, software that has direct access to, and control over, the hardware. It's essential that this software is robust and reliable, and thoroughly tested and maintained. In contrast, user space is where the application programs and tools live. Of course, this software needs to have the same qualities as the kernel, but perhaps not to the same extreme degree. Just imagine if every tool, every application, every piece of user-facing software had to access and manipulate the hardware resources itself? It would be chaos, and software development would not only be incredibly difficult but be so unstable as to be almost unviable. 

In the world of hardware and infrastructure there's been a philosophy over the past decade or two that has followed this line of (sensible) reasoning - why run hardware yourself, when you can have it provided for you? The cloud is the kernel space, leaving us to concentrate on the user space of building and running applications. All the hard work of power provision, cooling, scaling and more is handled by the hyperscalers.

Why am I following this line of thought? Well, because I consider CAP, the framework, to be an accomplished example of "kernel space", providing the software infrastructure for enterprise application development and extension ... that _we don't have to write ourselves_.

### Let CAP do the legwork

While CAP can do so much more than merely facilitate the provision of OData services, I want to focus on that for now because (a) it's still a fundamental and critically important building block of extension, integration and data provision in the context of enterprise software and (b) it encapsulates everything that's right about this line of reasoning - writing less code (in user space), and having the framework do it instead (in kernel space).

You may recall the effort required to create and fully provision a complete OData service on the ABAP stack; defining the artifacts, the shape, in the SEGW transaction, and then hand crafting all the data provider classes to bring about everything needed to have your service respond to all OData operations - Create, Read, Update, Delete and Query (CRUD+Q) - even in their most basic form. That was a lot of user space code that you had to write and test and subsequently debug and maintain, even before you got to any custom logic. And this was needed for each and every OData service!

Stepping outside of the ABAP stack for a second, and you had the Olingo library in the Java world with which you could do something similar. But the work there to get even a basic CRUD+Q OData service up and running was as much if not more work. 

With CAP, none of that is necessary. In the time it takes to boil some water for [a nice hot cup of tea][3], you have a fully fledged OData service running and responding to all CRUD+Q operations ... _without you having to have written a single line of code!_

This is because the important code for this is in the framework, not outside of it.

You don't have to write it. Or re-write it, for every new OData service you want to create. Which means you don't have to test it, maintain it, debug it, or anything. And the surface area for bugs to breed remains relatively constant, but more importantly, taking care of that is [somebody else's problem][4] (and they, the CAP team, do that very well).

That in turn means you can focus your efforts on the important stuff - defining your data model and implementing custom code for the business case in focus.

## 2 Domain modelling is a first class citizen

Talking of data models and how they're defined - well this is where CAP shines, and is a major reason to use CAP. It shines not only from a technical perspective, but perhaps more subtly and more importantly from a philosophical perspective.

### Project roles

When I started out in my computing career, there were operators (who looked after the mainframes at data centres which I guess were the "private clouds" for organisations), key users, systems analysts and programmers (that last role was also subdivided into systems programmers and application programmers[<sup>2</sup>](#footnotes), but again, that's a story for a different time).

I think over the years we've in part lost our way a little in terms of those roles and the interplay between them.

### Domain driven design and CDS

CAP reinvigorates those roles and celebrates the combination of people with different skills that are all important to building the right thing, and building it right. I'm talking of course about [Domain Driven Design][7] (DDD) and how CAP supports and [promotes][8] it.

The initialism CDS, and the acronym CAP, are sometimes interchangeable. That speaks volumes about how important domain modelling is, and the role of the domain expert. Why? Well, perhaps it's worth taking a moment to unpack these terms, for a bit of insight.

* CAP is the short form for the actual framework itself, of course.
* CDS, which stands for Core Data Services, is in fact a collection of what I like to consider domain specific languages (DSLs), little languages that serve a single, focused purpose. CDS is also used to refer to the overall domain model, and is the extension for the files where the model is defined.
* Within the context of CDS modelling, there's a human centric and a machine centric version of the modelling language itself. CDL is the human readable and writeable Definition Language which is both rich in expressiveness, and frugal in mechanics and complexity, providing the perfect common language for domain experts to collaborate with developers on the domain model. Accompanying CDL is CSN[<sup>3</sup>](#footnotes) which is the Schema Notation, the machine-readable version of the domain model.
* Further languages include CQL and CQN, a similar pairing but focused on defining and representing data queries (a Query Language and the Query Notation respectively).

While CAP promotes DDD, it does so in a way that doesn't overly burden the domain expert with technical concepts. Quite the opposite, in fact. A key superpower available to the team of domain expert and developer, when iterating on exploring, defining and building out the domain model of the problem or task at hand, is that simplicity is baked in, and at different levels.

### An aspect oriented approach

One such level is the [adoption of concepts from Aspect-Oriented Programming][9]. Indeed, the concept of an [aspect][10] in CDL provides the right amount of modelling mechanics to separate out concerns without getting overburdened with the complexities of, say, formal inheritance.

The combination of named aspects with the shortcut syntax of `:`, with its exquisite beauty & succinctness in decorating entity definitions, provides enough inheritance to allow for multiple extensions, with [none of the ceremony][11].

### Separation of concerns

And what about this idea of "separation of concerns"? The classic enemy of simplicity and progress in modelling - having to think of everything at once - is vanquished by the use of aspects, to hide, to put out of sight, unimportant or secondary detail. Of course, that detail is important to someone, at some point, so it's essential that the detail is just stashed elsewhere, not lost, to leave the primary subject of the domain model itself unpolluted.

What are those "unimportant", or "secondary" items? I'm referring to details such as:

* UI metadata
* authorisation
* data privacy
* analytics

Many of these details are realised via (defined as) annotations, but the point is that whatever their nature, these details, these concerns, [can be separated out][12], hidden from primary view by the use of aspects, which are essentially flat, mixin-style extensibility features.

## 3 Everything is abstracted

I have been lucky enough to see the various ages of SAP software, starting with SAP R/2 (mainframe, assembler based) in the mid-to-late 1980's at the start of my computing career. Throughout the decades there have been trends that have come (and sometimes gone), platforms that came to prominence for runtime adoption (mainframe -> Unix -> *aaS), and languages, frameworks and protocols that have found favour with developers[<sup>4</sup>](#footnotes).

What's remained almost constant through these ages in the SAP software universe is the theme of abstraction. From how the spool subsystem (to take a simple example) or the [TP monitor][13] (to take a larger component[<sup>5</sup>](#footnotes)) was abstracted in the R/2 era, and how the dispatching and handling of tasks over single or even multiple physical machines was abstracted in the R/3 era, SAP software, and ultimately developers, have benefitted from abstraction.

### Abstraction in CAP

And as I consider CAP today, I can see that this abstraction continues to blossom and make things easier for developers at this level, at the level of a programming model. How? Well, how about the abstraction of:

* SQL details & dialects to a higher level modelling language, so that we can develop, test and deploy to various persistence layer platforms (SQLite, PostgreSQL, SAP HANA) and even no-SQL systems, independent of the actual CDS model we've defined
* protocols (service layer interface mechanics), so that the same service definition can be made available via e.g. OData, plain HTTP ("REST") and even GraphQL
* messaging and event protocols (HTTP, MQTT, AMQP) and brokers (SAP Event Mesh, MQ, Kafka, etc)
* authentication, authorisation and platform-specific identity providers
* runtimes (local, Cloud Foundry, Kubernetes)

The benefits are clear; CAP's deliberately agnostic design approach mean that we don't tie ourselves in to specific technologies or platforms; nor do we suffer from having platform or protocol specific details infiltrating our domain logic.

As the [Agnostic Design][14] section of Capire puts it: our development investments are safeguarded by abstractions.

## 4 By developers for developers

The design time aspects of CAP are a developer's dream. Earlier I described how CAP's philosophy is reified in the form of first class facilities for domain modelling and the domain expert. It is also reified in the form of affordances, design choices, tools and conventions to optimise the developer experience. From the moment you start using CAP as a developer, you can feel that it's been conceived based on vast foundational layers of good practice tempered by a realism that is refreshing, and has been brought to life by real developers. By developers for developers. 

### Design time tools

CAP's design time tools range from [editor and IDE facilities][15], including extensions for popular environments such as VS Code and WebStorm, through a wealth of facilities in the form of commands within the CAP command line interface (CLI) tool, taking in all the best parts of [convention over configuration][16] to the wisdom and pragmatism of [YAGNI][17] (You Ain't Gonna Need It).

It's hard to overemphasise how useful the [CDS language server][18] is for domain modelling, analysis and refactoring. When collaboratively iterating on a domain model, both domain expert and developer have facilities at their fingertips to skate across the CDL surface area of what they're constructing with ease, descending to detail and then re-ascending when required. Being able to comfortably navigate the construction being formed or to easily refactor at the drop of a hat (say, to separate out concerns and put out of sight detail that is getting in the way of the domain focused discussion) is the perfect complement to the relaxed nature of the domain modelling language itself.

### Test data

What about data? While it's all very well having facilities to easily and rapidly build the right model, the right set of services and have those services made available via, say, OData, immediately, it's another thing to also conjure up sample data and have that served as part of the given OData service. It couldn't be simpler: the CAP server pick up CSV or JSON data files and prime the service with data therein, at startup.

Through the constant delight of convention over configuration, you don't even have to specify where those files are - there are standard locations (for sample data and for initial data) and if you create files in the expected place, the magic happens automatically. What's more, if you're unable or unwilling to generate your own test data, you can get the CLI to do that for you, and it will not only follow the same rules but generate data that complies with the types and constraints in the model, and that is aware of the relationships (and necessary foreign key identifiers) so that Things Just Work(tm).

### Server auto restarts

What of the CAP server itself? In design time mode, in a similar way to how the classic [nodemon][19] facility works, the CAP server will monitor changes and automatically restart when required; not only that, but it will cause a refresh of the browser in case you're also wanting to see changes in the service or the UI that consumes the service.

### The power of the REPL

Perhaps one of the lesser known superpowers that are granted by the design time tools to developers is the REPL. But its relative obscurity is more than matched by its power and utility. Anyone who has used a REPL in another language or development environment (they're especially prominent in LISPs, such as [Clojure][21], but also available and very useful in more mainstream languages such as Python) will understand the godlike power granted to whoever is able to wield it. And with CAP's REPL (which is based on the Node.js REPL[<sup>6</sup>](#footnotes) plus a layer of CAP server goodness) we see that in action. 

### Adding custom logic

This next feature fits very squarely into the convention over configuration theme, and is where and how custom logic is plugged in to the fully-formed CRUD+Q serving infrastructure that is already a key part of your set of core services. And that, in a similar way to how initial data files are found and deployed, is by creating the logic in files that follow certain naming and location standards. Briefly, if for example you have part of your overall CDS model definition in a file called `myservice.cds`, then creating a companion file `myservice.js`[<sup>7</sup>](#footnotes) is all you need to do to have your custom handlers take effect. Talking of custom handlers, one useful mantra to remember when thinking about implementing systems with CAP is "everything is an event".

This uniform view of the universe is liberating, especially when combined with how the framework allows you to define handlers for events regardless of what the nature of those events are - be they standard OData operations, OData action or function calls, plain incoming HTTP requests, or asynchronous events from a message queue somewhere.

I'm merely scratching the surface of this theme with the features and facilities I'm describing here, but hopefully I've conveyed a sense of freedom, flexibility and an intense focus on the developer experience that CAP has to offer. In addition, with the focus on domain modelling, the abstracted layers of infrastructure and detail plus the convention over configuration approach at the developer coalface ... the [grow as you go][22] approach, close to the YAGNI philosophy, allows for a fast and tight development loop. Exactly what a developer needs.

## 5 Activity and community

How could I not include one of the most appealing -- but non-technical -- aspects of CAP? The sense of community plays an important part in many software projects, especially frameworks such as CAP, which are used by a broad and diverse set of developers. And there is the activity within the CAP team itself, with a regular cadence of releases. 

Let me talk about the CAP team activity first. CAP is a very actively developed framework, as you can see from the [release schedule][23], which includes a new major version every year, and other releases every month. Each one is lovingly detailed in release notes that form part of the excellent CAP documentation, affectionately known as [Capire][30].

Talking of yearly, there's the annual CAP conference, [re>≡CAP][24], which takes place in the summer, and has so far been held in St Leon Rot, Germany. This is a one-day conference where developers can hear from, meet with and chat to fellow developers, including those of the CAP team internally at SAP too. By the way, all the talks are recorded for viewing on demand.

There are regular [SAP CodeJams][24] throughout the year, a good number of which are on the topic of CAP. And if you can't get to one of the events, you can at least still enjoy the content, which is [available on GitHub][26].

Extending the community content a little, there are active channels on the [SAP Mentors & Friends][27] Slack workspace, and there's a regular posse that hangs out on Fridays during the [Hands-on SAP Dev][28] live stream show.

And on GitHub, the [cap-js][29] organisation is the collaborative melting pot of projects, documentation and extensions & plugins that sit between the internal and external CAP development groups.

More than enough to get started and to get help to keep on going!

## Wrapping up

I'm already over 3.5K words in this essay, and am not nearly done. There's so much more to share.

For example, I haven't even had chance to mention [Calesi][31], the CAP-level Service Integration layer for SAP BTP. This is an amazing annotation-driven way to cleanly integrate your CAP-based apps with services on SAP BTP; after all, it's one thing building your CAP services and frontend UIs, but it's highly likely that you're going to want to use platform services, for persistence, logging, telemetry, change tracking and more.

And CAP itself is extensible - in more ways than one. Design time, build time, run time, you name the time, and you can extend the framework in a structured and simple way. For a very brief taste, you might enjoy this SAP TechEd Virtual 2024 Developer Keynote session [DEV100B][31] on building design time and run time plugins.

But I've run out of time and space, so I'll stop here. I hope this has resonated with you and perhaps encourages you to check CAP out, and give it a go. If you're a beginner and looking to get started, the [Hello World!][33] section of Capire's Getting Started is there for you.

<a name="footnotes"></a>
## Footnotes

1. Alongside Java, I am of course thinking of the distinction (or lack thereof) between JavaScript and TypeScript, both of which CAP also supports.
2. While we all used terminals in the IBM 3270 family, the systems programmers got to use the [3279][6] which was the colour model, whereas we application programmers had the [3278][5] green screen model.
3. There are at least two different representations of CSN: JSON and YAML.
4. There's plenty that has fallen _out_ of favour too, including, deservedly, CORBA, SOAP, WS-Deathstar, and the like. In this context I'm looking at GraphQL to see where that ends up too.
5. Supporting both IMS DC and CICS for SAP R/2 on System/370 architecture mainframes.
6. This of course implies that the REPL is only available for CAP Node.js, not CAP Java.
7. Or `myservice.ts`. Plus there's a similar convention-based mechanism for CAP Java too.

[1]: https://blog.codinghorror.com/the-best-code-is-no-code-at-all/
[2]: https://en.wikipedia.org/wiki/User_space_and_kernel_space
[3]: https://www.bbc.co.uk/cult/hitchhikers/guide/tea.shtml
[4]: https://en.wikipedia.org/wiki/Somebody_else%27s_problem#Douglas_Adams'_SEP_field
[5]: https://en.wikipedia.org/wiki/IBM_3270#3278
[6]: https://en.wikipedia.org/wiki/IBM_3270#3279
[7]: https://en.wikipedia.org/wiki/Domain-driven_design
[8]: https://cap.cloud.sap/docs/about/#domain-driven-design
[9]: https://cap.cloud.sap/docs/about/#aop
[10]: https://cap.cloud.sap/docs/cds/cdl#aspect
[11]: https://cap.cloud.sap/docs/cds/cdl#includes
[12]: /blog/posts/2024/11/03/separating-concerns-and-focusing-on-the-important-stuff/
[13]: https://en.wikipedia.org/wiki/Teleprocessing_monitor
[14]: https://cap.cloud.sap/docs/about/#agnostic-approach
[15]: https://cap.cloud.sap/docs/tools/cds-editors
[16]: /blog/posts/2019/11/06/cap-is-important-because-it's-not-important/#:~:text=convention%2Dover%2Dconfiguration
[17]: https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it
[18]: https://cap.cloud.sap/docs/tools/cds-editors#cds-editor
[19]: https://github.com/remy/nodemon
[20]: https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop
[21]: https://clojure.org/guides/repl/introduction
[22]: https://cap.cloud.sap/docs/get-started/grow-as-you-go
[23]: https://cap.cloud.sap/docs/releases/schedule
[24]: https://recap-conf.dev/
[25]: https://community.sap.com/t5/sap-codejam/gh-p/code-jam
[26]: https://github.com/topics/sap-codejam
[27]: https://sapmentors-slack-invite.cfapps.eu10.hana.ondemand.com/
[28]: https://www.youtube.com/playlist?list=PL6RpkC85SLQABOpzhd7WI-hMpy99PxUo0
[29]: https://github.com/cap-js
[30]: https://cap.cloud.sap/docs
[31]: https://community.sap.com/t5/technology-blogs-by-sap/what-s-new-in-sap-cloud-application-programming-model-sap-teched-2023/ba-p/13576447
[32]: https://www.sap.com/events/teched/virtual/flow/sap/te24/catalog/page/catalog/session/1723584532995001g7Xm
[33]: https://cap.cloud.sap/docs/get-started/hello-world
