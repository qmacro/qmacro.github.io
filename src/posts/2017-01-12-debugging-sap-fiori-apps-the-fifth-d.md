---
layout: post
title: Debugging SAP Fiori apps - the fifth "D"
date: 2017-01-12
tags:
  - bluefinsolutions
---

It's all very well designing and building a delightful Fiori app. But what about the long tail - supporting that app through its lifetime, with fixes and changes that come along? There's a fifth "D" to the SAP Fiori development mantra, and that "D" is for "Debugging".

## The mantra 

In the SAP Fiori world, there's a mantra which generally goes like this: 

Discover -> Design -> Develop -> Deploy 

These four "D" words represent the progressive stages of bringing new functionality into the world, starting with Design Thinking principles, iterating on prototypes early on, building a stable first version and moving it to production. You can read more about this mantra, relating to SAP's User Experience as a Service, in [Digital devolution in local authorities - Putting people first](/blog/posts/2015/11/25/digital-devolution-in-local-authorities-putting-people-first/). 

However, there's a fifth "D" word that is crucial. That word is "Debugging", representing activities that kick in around "Develop" and live well beyond "Deploy".

## Debugging is positive 

Don't get put off by the knee-jerk negative connotations that the word "debugging" might conjure up. Sure, it represents the act of diagnosing and fixing problems with code, with apps, especially those already in production. But it also represents the more positive aspects of being able to thoroughly understand an app from the inside, behind the scenes.

![](/images/2017/01/bug.jpg)

Not only to be able to support it and to address issues, but also to have the wherewithal to properly extend and enhance it, introducing new features in a sane and safe way, sympathetic to the existing design, architecture and codebase. 

## Complex vs complicated 

SAP Fiori apps can be complex beasts. This complexity comes at different levels. While the Fiori design language demands simplicity of user experience, realising that minimal user interface is far from simple; it's not magic that causes a swan to glide effortlessly and smoothly across the water, it's a combination of muscle coordination, fluid dynamics and, well, pretty furious paddling under the surface.  

Another level of complexity is in the implementation itself. UI5, the industrial strength HTML5 toolkit with which Fiori apps are built, is commonly referred to as being "enterprise grade". What that means is that it has a set of features and facilities that are key to creating business apps that can go global: Support for the Model-View-Controller development approach, data binding, internationalisation, control hierarchies and asynchronous network requests to satisfy business data consumption are just some of the ingredients that make Fiori apps what they are today. Moreover, these ingredients make for complex scenarios under the hood.  

There's a difference between complex and complicated. By the nature of what is being achieved by building rich business apps that run in the browser and reach back into SAP systems to transact, lots of things have to be properly orchestrated. But that's different to complicated. Any fool can build something complicated - to paraphrase a famous quote that's often attributed to Mark Twain:

> "I didn't have time to build a simple app, so I built a complicated one".

Building something complicated is not the same as building something that is inherently complex.

## Debugging tools

With traditional ABAP-based apps that run in SAPGUI, it became second nature long ago to enter "/h" in the OK-code field and jump into debug mode. The ABAP debugger tools have improved considerably over the decades and we've come to expect not only facilities to help us wade through and find what we're looking for, but also (and perhaps more importantly) for folks in development and support teams to understand what they're looking at and to be able to find their way around behind the curtain.

So it is also with HTML5-based SAP Fiori and UI5 apps today. What facilities do we have at our disposal to help us navigate the complexities of a modern business app?  

Well, for a start we have the excellent UI5 Software Development Kit (SDK). Even from early versions it has been rich in documentation, samples and more. All debugging endeavours should start with a reference guide, the "sine qua non" that acts as a backstop, definitive documentation and final arbiter of how things work, or should be working.

Then we have built-in tools. Chrome is an incredible feat of engineering, providing near unrivalled development and debugging facilities for the creation and support of HTML5-based apps. It also has a pretty fine browser built in\*! Time taken to teach oneself about features of the Chrome Developer Tools is time well spent.  

Furthermore, the UI5 runtime itself has some rather good facilities for debugging, notably the UI5 Inspector tool, which can be summoned easily in any running Fiori app.  

## The knowledge

What binds the reference material with what the tools can tell you is something else, though. A knowledge and general understanding of how UI5 and Fiori apps tick. How they are loaded, form themselves into functionality in the browser, and bring data and UI to life on the screen.  

A painter doesn't pick up a brush and wield it like an axe against the canvas (well perhaps some do, but that's another story). They hone their skills and perfect their understanding of how their movements influence the brush, how the brush touches the canvas, and how the colours glide and combine.

## Debugging is a conversation 

[![Debugging book cover](/images/2017/01/debugging-book-cover.jpg)](https://www.sap-press.com/sap-fiori-and-sapui5_4305/)

I find that debugging a Fiori app is like having a conversation. A conversation with the control flow, a conversation with the mechanics of the runtime and often a(n imaginary) conversation with whoever was responsible for building the app. Understanding how to have that conversation is key.

So I was delighted when SAP Press gave me an opportunity to write a short guide to help us orientate ourselves with what we find under the surface of a Fiori app. That orientation is designed to show us how to use the tools available and have good debugging conversations with the runtime. It's in the form of an E-Bite, and is available now from their website: 

[SAP Fiori and SAPUI5: Debugging The User Interface](https://www.sap-press.com/sap-fiori-and-sapui5_4305/)

## Start now 

If you can see a Fiori app in your browser (I'm going to assume it's Chrome - if you're at all concerned with standards, security and reliability, why would you be running anything else?) then you're ready to start your debugging conversation.

Open up a separate window with the UI5 SDK, invoke the Chrome Developer Tools, and bring up the UI5 Inspector. And maybe even grab a copy of the E-Bite :-) Then you're ready to begin your debugging conversation. Start with "hello" and have a look around. You won't regret it. 

 
\* _Yes, for those geeks amongst you, this is an oblique reference to the traditional description of the Emacs editor: "A fully featured operating system, lacking only a decent editor"._

---

[Originally published on the Bluefin Solutions website](http://web.archive.org/web/20180509233210/http://www.bluefinsolutions.com/insights/dj-adams/january-2017/debugging-sap-fiori-apps-the-fifth-d)
