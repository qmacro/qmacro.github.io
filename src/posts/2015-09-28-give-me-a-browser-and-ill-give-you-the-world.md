---
layout: post
title: Give me a browser, and I'll give you the world
date: 2015-09-28
tags:
  - bluefinsolutions
---

With the cloud, not only are apps and systems going virtual, but also developer workflows. It might seem obvious in hindsight, but a Web-only developer workflow is possible right now, and it works. Read on to find out what this means for you.

## The past and the future

Way back in the mists of time, at an SAP TechEd conference in the early 2000s, I saw the future. It was in the shape of a small box, with a credit card sized slot, and it was then billed as the [JavaStation](https://en.wikipedia.org/wiki/JavaStation). It was a small network computer from Sun.

The idea of a network computer wasn't exactly new, and wasn't that different to the [X terminal](https://en.wikipedia.org/wiki/X_terminal) concept. What completely bowled me over was the seemingly magic session managment, that was based around a physical credit card sized identity module. You could "hot-remove" it from the JavaStation you were at, walk over to another, insert it, and see your session recreated instantly on that new network computer.

It must have made a lasting impression on me, because I can still remember the experience as if it was yesterday. As I [cut my young computing teeth](http://radar.oreilly.com/2005/11/burn-in-7-dj-adams.html) on terminal-based computing, and indeed built my own X terminals for kicks, I was no stranger to the power and utility of the computing architecture of the day - minicomputers and mainframe computers housed in some remote facility, to which you were connected via a generic interface (a [VT100](https://en.wikipedia.org/wiki/VT100) or [3270](https://en.wikipedia.org/wiki/IBM_3270) type terminal, or an X terminal) that itself had little relevant computing horsepower - just enough to achieve connectivity and display.

## The present and the future

Fast forward to today, with the [SAP HANA Cloud Platform](http://web.archive.org/web/20180227044007/http://hcp.sap.com/index.html) (HCP) rapidly becoming the goto platform for new apps, and extensions to existing apps, and the meeting point for on-premise and other cloud systems.

One of the subscriptions available within this Platform-as-a-Service (PaaS) offering is the [SAP Web IDE](http://web.archive.org/web/20180227044007/http://hcp.sap.com/developers/TutorialCatalog/wide100_01_getting_sap_web_ide.html) - a still relatively young but already very accomplished Interactive Development Environment (IDE). While not everyone's current primary environment for experimentation and development, it is already far beyond just being a serviceable tool for building apps. If you step back and look at the bigger picture that SAP has for its cloud platform offering as a whole, the SAP Web IDE is an incredibly important artifact on the roadmap that SAP envisions (briefly: on premise standard, custom extensions and new apps in the cloud).

And when you couple the SAP Web IDE with some of the other facilities that come as standard with SAP HCP - such as a git repository server for source code management, automatic deployment mechanisms, and the [Destinations](http://web.archive.org/web/20180227044007/https://help.hana.ondemand.com/help/frameset.htm?e4f1d97cbb571014a247d10f9f9a685d.html) facility within the wider connectivity services, you have everything you need to build non-trivial apps that reach out to SAP and non-SAP systems. Furthermore, significant facilities within the SAP Web IDE are being added on a regular basis.

## SAP Inside Track Sheffield 2015

And so the story turns to an event earlier this month - [SAP Inside Track Sheffield](http://web.archive.org/web/20180227044007/http://bit.ly/sitsheff). On Day 2 of this event, I led an all day workshop on Fiori and UI5 development (if you're interested, I've made the exercise document available here: [Fiori Products App Development Workshop - Exercise Document](https://docs.google.com/document/d/1NiCQoyv05IwIZxsV21Vw6ZM_2R5Wd_n0uxjK2h3a7UE/)).

The facilities at Sheffield Hallam University, our awesome hosts for the event (thanks to Steve Lofthouse), were great, and even extended to proper classrooms for the breakout sessions and workshop. On the day of the workshop, I arrived to set up. We had been given optional access to the PCs in the classroom - student PCs and an instructor PC at the front. These PCs were run of the mill, nothing wrong with them per se, although they were less than ideal as usable workstations, in that they were running Microsoft Windows, in lieu of a proper operating system. But what they all did have was a modern web browser - Chrome.

SAP HCP administration, and access to all HCP's facilities, is via a cockpit that is web based (and built on UI5, of course). The SAP Web IDE is also browser based (and also built with UI5, along with [Orion](http://web.archive.org/web/20180227044007/https://wiki.eclipse.org/Orion)).

I'd never used this particular instructor PC before, nor had the workshop attendees ever used the student PCs in front of them. But all they needed was to fire up Chrome and connect to their HCP trial accounts, from where they could manage their app software, define destinations, access reference source code on Github, and use the SAP Web IDE to develop, test and then deploy their solutions to the workshop exercises. And inevitably (and intentionally) debug those apps, in flight, too (using the super powerful [Chrome Developer Tools](http://web.archive.org/web/20180307085258/https://developers.google.com/web/tools/chrome-devtools/)).

## Developer workflow and productivity

While we weren't working on JavaStations, we were enjoying the equivalent power and approach that those early network computers championed. Our whole development workflow, even my own workshop design, preparation and documentation, was all done from a single facility - a web browser. Granted, that web browser instance was mostly on my laptop, but that's just because that's the workstation to which I have closest physical access.

But I've tweaked and extended the workshop on various machines over the workshop's history, and used different machines to deliver it too. The link between my work, my environment and the physical machine I happen to be using is very loose; I can switch between web browsers on different machines as easily (perhaps not as magically) as was demonstrated with the JavaStation session management facilities.

With the advent of the cloud, combined with the web, developer workflow is changing, and developer productivity for many of your SAP projects, in the context of HCP and SAP's strategic direction for itself and its customers (you and me), is moving towards this idea of a modern take on the network computer. I'd argue that for many SAP Fiori extension projects, to take a relevant example of the work that goes on today, all one needs is a browser.

Embrace what HCP has to offer, understand what SAP's direction is in this regard, and ready yourself for the cloud, the new mainframe, with the simpler workstation software requirements that go hand in hand with that. Developer workflows that exist entirely in the cloud are here today.


---

[Originally published on the Bluefin Solutions website](http://web.archive.org/web/20180227044007/http://www.bluefinsolutions.com/insights/dj-adams/september-2015/give-me-a-browser,-and-i-ll-give-you-the-world)
