---
layout: post
title: The essentials - SAPUI5, OpenUI5 and Fiori
date: 2014-02-14
tags:
  - bluefinsolutions
---

The SAP User Interface (UI) and User Experience (UX) revolution is truly underway. There are some tactical solutions out there, but the chief strategic solution that SAP is basing its UI/UX future on is UI5.

UI5. Otherwise known as SAPUI5. But what about OpenUI5? Plus, because no doubt you've heard the word "Fiori" in the same sentence as UI5, where does SAP Fiori fit in? Read on to find out this, and more.

Note that throughout this post, I'm also deliberately using the term UI5, and have been doing in forums on the SAP Community Network, in answers on [Stack Overflow](https://stackoverflow.com/questions/tagged/sapui5+or+sapui5+or+sapui5?tab=Newest) and elsewhere for a while now. It's a useful (and short!) umbrella term that encompasses a number of things, all related.

## SAPUI5

SAPUI5 is the name of the toolkit that SAP has been building for the past three or so years. You'd be forgiven surprise at the length of time it's existed, because it's only really started to gain attention for the last year or so. I [wrote about SAPUI5 in May 2012](/blog/posts/2012/05/07/sapui5-the-future-direction-of-sap-ui-development/), describing it as "the future direction of SAP UI development", and I stand by my prediction. And the official name? In the same way that the characters in Iain M Banks' masterful science fiction series about The Culture have very long names, and practical short ones too, the official name for SAPUI5 is the "UI Development Toolkit for HTML5" ... which is why most people do refer to it as SAPUI5.

SAPUI5 is a series of core and functionally focused libraries and a runtime environment. The core provides essential services such as module loading and management, eventing, navigation, data management and various application development concepts (such as Model-View-Controller). The libraries provide collections of controls that are used as UI building blocks in apps – tables, lists, date-pickers, input fields and forms, buttons, and so on. Some controls are simple (like the Button), others are more complex (like the Shell, or the Table), but all work together to provide the interactive components from which applications can be built.

The applications that are built with SAPUI5 are applications that run in the browser. They are HTML5, JavaScript and CSS based. When you invoke an app, the application itself is dowloaded to the browser, along with the SAPUI5 runtime.

There's a theming concept for the controls within SAPUI5 which is why you might have seen different designs in screenshots. The dominant theme so far for desktop-focused controls was "Gold Reflection", where the dominant theme for mobile and responsive controls is "Blue Crystal". You will see a convergence on Blue Crystal for desktop-focused controls – in fact, if you examine the latest [SAPUI5 Software Development Kit (SDK) documentation](https://sapui5.hana.ondemand.com/), you'll notice that this has already happened; the desktop-focused SAPUI5 controls (with which the SDK itself is built) are now themed with Blue Crystal.

## OpenUI5

OpenUI5 is SAPUI5's sibling. While the use of SAPUI5 is subject to an SAP licence, OpenUI5 is Open Source. This is a big deal, and very important for many reasons, best left for another post. Suffice it to say that in December 2013 SAP surprised us all by open sourcing UI5. The fact that they actually open sourced it wasn't so much of a surprise, [many of us outside and inside of SAP were lobbying for it to happen](https://blogs.sap.com/2013/11/20/reasons-why-sap-should-open-source-sapui5/). What surprised us was how quickly they turned it around (well done SAP!).

[OpenUI5 has its own SDK](https://openui5.hana.ondemand.com), and its [own presence on the web on GitHub](https://sap.github.io/openui5), which is currently the most important place for Open Source projects such as this. SAP has a way to go yet in fully embracing all of the Open Source concepts, but it's getting there, and the all important first step has already been taken. SAP and developers like me can start to more properly engage with Open Source developers outside the SAP ecosphere, developers with skills and expertise in UI/UX and many other areas. One of the ways SAP will continue to be relevant is by reaching out in this direction.

There are a number of differences between OpenUI5 and SAPUI5, mostly related to libraries that are currently missing from the Open Source version. But the essentials (sap.ui, sap.m) are there. If you've written a UI5 powered app, as long as it doesn't use charting, for example, there's a good chance that you can just switch the toolkits and it will still work. Of course, there's more to the detail, but that gives you a rough idea.

## Fiori

Aaahh, Fiori. Let a thousand meanings bloom! What Fiori is and isn't, is again the subject for a long post of its own. But it's important to include Fiori here in this rundown, because of its close relation to UI5.

SAP Fiori is a series of app suites, being introduced in waves. The apps in these waves are written by SAP app developers. But Fiori is also a development approach, a design approach, which has a number of soft constraints. And when an app is built to conform to those constraints, it exhibits Fiori-like features: simple and recognisable design, easy to use, a role-based approach, and following one of a core set of UI patterns.

And crucially, Fiori apps are built with UI5. More specifically, they use specific libraries from the UI5 toolkit, the most significant one by far being "sap.m". The "m" in "sap.m" stands for "mobile", but as we know, [responsive is the new mobile](/blog/posts/2014/02/09/m-is-for-'responsive'/), and this is essential in ensuring that Fiori apps run on all devices – smartphones, tablets and desktops, as the sap.m UI5 controls are designed from the ground up to work responsively.

So putting these two observations together – that Fiori is a design and development approach and set of constraints, and Fiori apps are built with UI5, it stands to reason that you too, as an SAP customer, can build your own Fiori apps. With some expert help and guidance, you can join in the UI/UX renewal yourself and if SAP don't offer an app that suits your requirements, you can build one yourself. Not only that, but if you build it right, it will happily live and run inside the Fiori Launchpad alongside the SAP-delivered apps.

So there you have it. Hopefully if you've read this far, you'll have a better understanding of the terms, and how what the terms represent relate to each other. You may like to know that there's a [public SAP Mentor Monday session on UI5](https://blogs.sap.com/2014/02/13/public-sap-mentor-monday-on-ui5-with-andreas-kunz/) that I'm arranging and hosting on Mon 24 Mar 2014. I'll be joined by special guest Andreas Kunz, from the UI5 development team in Walldorf. All are welcome.

And if you'd like to hear more about SAP's open sourcing of UI5, or Fiori development, leave me a comment below!

---


[Originally published on the Bluefin Solutions website](https://web.archive.org/web/20180119173657/http://www.bluefinsolutions.com/insights/dj-adams/february-2014/the-essentials-sap-ui5-openui5-and-fiori)
