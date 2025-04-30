---
layout: post
title: "Revisiting UI5 on CodeTalk"
date: 2019-05-15
tags:
  - sapcommunity
---
*A few days ago Marius Obert and I took part in an SAP CodeTalk session
with host Ian Thain, where we revisited the subject of UI5 - [SAP
CodeTalk - SAPUI5 Update](https://www.youtube.com/watch?v=iin9oKSyaso).
We decided it might be useful to write the session up in the form of a
blog post, so here it is. Share & enjoy!*

Co-authors: DJ Adams & Marius Obert.

The video is here: <https://www.youtube.com/watch?v=iin9oKSyaso> and we
wrote up the conversation in this blog post too.

![](/images/2019/05/Screen-Shot-2019-05-15-at-16.07.03.png)

## What is SAPUI5 and what does it let developers do?

SAPUI5 is an enterprise-ready UI development framework for building web
apps. Nice looking web apps too, in our opinion. Enterprise ready? For
us that means it has features such as: 

-   accessibility & internationalisation (including support for
    right-to-left languages)
-   support for data-driven UIs (for a consistent user experience)
-   a comprehensive suite of tools for testing, performance analysis and
    debugging (to mitigate bugs and deal with them efficiently when they
    do occur)
-   separation of data, UI and behaviour (via the native support for the
    Model-View-Controller (MVC) approach to app design)


\... and much more. All baked in.

The framework comes complete with a large collection of controls - UI
elements - and other building blocks such as model mechanisms for
interacting with different data sources. How many controls? Last time we
counted there were over 500. 

The UI elements are many and varied - from simple buttons and switches,
to table views, Gantt charts, graphical displays for analytics, and
everything in between. It also takes care of the rendering of the HTML
elements in a responsive way. 

## How is SAPUI5 related to SAP Fiori, and how do they differ?

That's a good question, especially as we just released Fiori 3.0 a few
days ago. Fiori is many things: a set of user experience (UX) design
principles, a design language, a suite of apps that look and work in a
consistent fashion \... some even have said that Fiori is a state of
mind. 

SAP Fiori is realised in nearly all cases with SAPUI5, the development
framework. The libraries of UI controls in SAPUI5 are designed to follow
the Fiori design principles, so it's easy to build smart looking custom
apps that fit right alongside what SAP deliver. 

One way to think about it is that SAP Fiori is UX, while SAPUI5 is UI.
Another way is to think about SAP Fiori being the UX concept, and SAPUI5
is the actual implementation as a web UI framework.

## What's the difference between SAPUI5 and OpenUI5?

OpenUI5 is a subset of SAPUI5 and it's Open Source, SAPUI5 contains some
smart controls like charts and plot, which are not available in OpenUI5.
The great thing about OpenUI5 is, that you don't need an SAP license to
get started. So, once you started to love UI5, you can even use it for
your spare time projects as well. 

Both SAPUI5 and OpenUI5 are developed on a single code line. SAPUI5 and
OpenUI5 are so closely related that they're often referred to with the
short form, just "UI5". 

## What sort of apps can you build with UI5?

What sort of apps *can't* you build with UI5? Of course, many folks see
and use UI5 as the workhorse for their responsive enterprise application
needs. SAP does too - UI5 powers the SAP Fiori revolution that started
with the Business Suite, and continues to do so as we move to S/4HANA.
So just as SAP developers produce apps with UI5, so can you. But that's
not where it stops. While you can build apps using the UI controls
delivered with the framework, you can create your own controls,
customise the styling and generally create anything you want. 

We've seen Pacman implemented in UI5 - in fact we showed it off at
OSCON in 2014:

![](/images/2019/05/image002.png)

*Pacman written in UI5*

If you want to check out something just as crazy written with UI5 have a
look at the [Flush! game](https://sap.github.io/ui5-flush-game/), with
the source code [available on
GitHub](https://github.com/SAP/ui5-flush-game).

Beyond the regular app situations, there are entire solutions built with
UI5 - check out [SAP Sports
One](https://www.sap.com/products/sports-one.html) and [SAP Digital
Boardroom](https://www.sap.com/products/board-room.html) for just a
couple of examples!

## What are the main takeaways for people new to UI5?

Well, there are many, but keeping it short:

-   it's a key framework to learn more about
-   with UI5 simple apps are simple, and complex apps are possible
    (repurposing a quote from [Alan
    Kay](https://en.wikiquote.org/wiki/Alan_Kay#/media/File:Alan_Kay_and_the_prototype_of_Dynabook,_pt._5_(3010032738).jpg))
-   UI5 has many rich controls that allow even inexperienced UI
    developers to build usable frontend apps

If you want to get started, have a look at our new beginner tutorial
[Develop Your First SAPUI5 Web App on Cloud
Foundry](https://developers.sap.com/mission.sapui5-cf-first.html).
There's also a new UI5 course that started recently on openSAP:
[Evolved Web Apps with SAPUI5](https://open.sap.com/courses/ui52) which
we highly recommend; if you've not followed the original openSAP course
we recommend that too: [Developing Web Apps with
SAPUI5](https://open.sap.com/courses/ui51). Also visit the OpenUI5 home
at [openui5.org](https://openui5.org) and the main UI5 home at
[ui5.sap.com](https://ui5.sap.com/). 

You can even start with some window shopping and see controls in action
in the the [demo kit](https://ui5.sap.com/#/controls) - and you can look
behind the scenes at the code behind each sample that you can study and
even download to run locally.

## What can a seasoned SAP developer do with UI5?

Beyond what we've described already, UI5 supports [routing &
navigation](https://ui5.sap.com/#/topic/3d18f20bd2294228acb6910d8e8a5fb5),
which means complex apps can be built to be easy for the user to move
around in, and to allow deep links to specific business objects or
states. UI5 supports modularisation of code which also helps with more
involved developments and makes for better code management in the
software lifecycle context.

UI5 also now offers [web
components](https://github.com/SAP/ui5-webcomponents) that provide a set
of reusable UI elements to you which can be used for your static web
sites or for web application using any web framework of your choice. It
also sports a clean extension framework making it possible to build upon
and modify existing apps (both your own and those from SAP), and also
provides the ability to extend more general Fiori infrastructure such as
the launchpad itself.

While it's very easy to consume OData services in UI5, that's not the
whole story. You can build integration scenarios and bring in other REST
based services too. And if you do have OData services you can use
annotations to drive automated UIs, which is the ultimate in a
declarative based approach to apps. This is supported by [SAP Fiori
elements](https://help.sap.com/viewer/468a97775123488ab3345a0c48cadd8f/7.51.4/en-US/03265b0408e2432c9571d6b3feb6b1fd.html)
which provide designs for UI patterns and predefined templates for
commonly used application patterns. These application patterns are not
only transactional but analytical - there are graphical apps that you
can put together too, such as the rather good looking (in our opinion)
Overview Page (OVP):

![](/images/2019/05/2015_11_ovp_procurement_demo_831136.png)

*An example of the SAP Fiori elements OVP, responsive across different
devices*

## What's new in SAPUI5 that developers need to know about?

UI5 development doesn't stand still. We recommend you check out the UI5
home's [What's New
section](https://ui5.sap.com/#/topic/99ac68a5b1c3416ab5c84c99fefa250d)
which also will lead you to short update videos on YouTube in the [SAP
Technology
channel](https://www.youtube.com/channel/UC8cXSTGDhiZK5229zi-KTXA).

And here's the killer last question from Ian:

## Why should I invest in a web app framework that is already over eight years old?

Well, come to think of it, React and Angular aren't much younger. And in
the web world, newer is not always better. The framework has thousands
of person-days of effort invested and it shows. Not only that but that
investment is continuing. 

One huge benefit of investing in UI5 is that compatibility is retained
all the time, and bug & security fixes will reliably be provided for
years to come. You could think of this being another aspect of being
enterprise ready. It's a framework you can bet on, when you don't want
to switch to a different "modern" framework every couple of years. And
even though you can rely on it for years, it's not a framework that's
standing still - it is continuously evolving and embracing new
concepts.

The way we build solutions based on UI5 is evolving too. While at first
we used a plugin with Eclipse, many today develop UI5 in their favourite
editors and IDEs, assisted by tooling of all kind. Of course, it would
be remiss of us to mention SAP Web IDE, the de facto standard
cloud-based development environment which was built from the ground up
to create and maintain Fiori apps with UI5, for deployment to both
on-prem and cloud targets. And if you're wondering \... yes, SAP Web
IDE is itself built with UI5. 

With initiatives like default asynchronous loading, web components and
[UI5
Evolution](https://blogs.sap.com/2018/12/06/ui5ers-buzz-39-ui5-evolution-a-quantum-leap-ahead/)
well underway, the future is definitely looking bright for UI5. 

Get your best steel toecap boots on and kick the tyres, or enrol
yourself in [the new openSAP course](https://open.sap.com/courses/ui52)
to improve your existing UI5 skills. 

You won't be disappointed.

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/revisiting-ui5-on-codetalk/ba-p/13407237)
