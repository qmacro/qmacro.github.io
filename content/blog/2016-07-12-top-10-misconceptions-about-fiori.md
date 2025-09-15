---
title: Top 10 misconceptions about Fiori
date: 2016-07-12
tags:
  - bluefinsolutions
---

As SAP Fiori matures as a concept, as a series of apps and as SAP's approach to UX across all its products, so grow the number of misconceptions about what it is, and what it isn't. In this post, I address the top ten misconceptions and misunderstandings about what has been called [a state of mind](/blog/posts/2015/03/02/can-i-build-a-fiori-app-yes-you-can!/).

## 1. Fiori apps are from SAP, everything else is not-quite-Fiori 

[In the early days](https://blogs.sap.com/2014/03/04/building-sap-fiori-like-uis-with-sapui5-in-10-exercises/), the idea existed that there were SAP Fiori apps, and Fiori-like apps. Both these phrases were used, to distinguish those built by SAP and those not built by SAP. It's clear that this distinction was actually irrelevant, in the light of what defines a Fiori app. You can say many things about Fiori apps, but certainly not "they must be built by developers at SAP". 

With the [SAP Fiori Design Guidelines](https://experience.sap.com/fiori-design/) and [a nice hot cup of tea](https://www.bbc.co.uk/cult/hitchhikers/guide/tea.shtml), you have everything you need to design and build your own Fiori apps.

![Wyse terminal](/images/2016/07/wyse-terminal.png)

## 2. Fiori is a set of technologies

This is not quite correct. The Fiori concept lives at the User Experience (UX) level, and in theory you can create a Fiori app, that is constrained and informed by the Design Guidelines, with any technology. 

Once you descend to the User Interface (UI) level - where the rubber meets the road, so to speak - you can choose to develop your Fiori apps in any editor, with any workflow, using any toolkit or framework (and yes, sometimes I develop Fiori apps using vim on my antique Wyse serial terminal). But the end result must conform to the design language that is Fiori.

## 3. Fiori requires the SAPUI5 toolkit

While all Fiori apps so far from SAP have been built with this awesome toolkit, of which I am a huge fan, it's not at all true to say that SAPUI5 is a prerequisite for an app to be classed as Fiori. 

Look at the [recent partnership announcement between SAP and Apple](http://web.archive.org/web/20170617185038/http://www.bluefinsolutions.com/insights/nathan-adams/may-2016/what-will-sap-apple-s-partnership-bring-to-the-ent), to develop OS-native Fiori apps for Apple devices. While this is not much of a departure for the Design Guidelines (there are new iOS specific design language elements that incorporate Apple's iOS Human Interface Guidelines), the technology stack for the frontend development is rather different.

## 4. Without SAP Gateway, it's not Fiori

One could think about this in terms of OData, but we'll come to that in a second. SAP Gateway is the product name for the OData server implementation for the ABAP stack. And yes, of course there are plenty of Fiori apps that consume OData services that reside on ABAP stack systems. But there are even more Fiori apps that consume OData services that are not served by Gateway - they're served by the Extended Services part of the HANA platform, because those OData services reside directly on the HANA platform. So Gateway is not involved there.

If an app interacts with a backend using another type of protocol (i.e. other than OData), is it Fiori? Well yes. Fiori is about the beautiful swan on the water surface, not about the paddling underneath. There are guidelines internally at SAP that relate to the use of OData, but these are more of a technical nature.

## 5. You can't build a Fiori app without Design Thinking first

Design Thinking is a very useful step in the Discover phase of any development, Fiori or otherwise. It's cost effective too - any changes at this stage are a lot less expensive to implement than when in the Develop or Deploy phase. 

Moreover, while the Fiori Design Guidelines structure themselves around the concepts of personas, roles and tasks, Design Thinking is only one way of determining the input that will influence the outcome of the Design phase. So you don't need Design Thinking on your way to building a Fiori app, but it helps an awful lot.

## 6. All Fiori apps are mobile by design

One of the key design principles described in the Fiori Design Guidelines was "Responsive" (the others are Role-Based, Coherent, Simple and - my favourite - Delightful). This changed recently to "Adaptive". 

The subtle difference expresses the point that while many Fiori apps are designed to work across all devices, some, from a practical perspective, are really not suited. Look at some of the SAP S/4HANA Fiori apps, especially those that present a complex grid view of information, and you'll understand why. So yes, while many Fiori apps are mobile-ready, not all of them are designed to be. 

## 7. Without the Launchpad, it's not Fiori

The SAP Fiori Launchpad is an important component in the complete Fiori experience. It's the starting point for users in many cases, is available on-premise and in the cloud, and is much more than simply a menu of options. But the idea of Fiori exists above any one component, and the very fact that you can set up Fiori apps to be launched in "standalone mode", i.e. without the need to access it from the Launchpad, shows us that the Launchpad is not essential. 

Take this one step further - wrapping a Fiori app with Kapsel for a hybrid experience on a mobile device - and again, you have a Fiori app, but no Launchpad.

## 8. You need developers with super web development skills

Let's look at this from a practical point of view, and how Fiori apps are most commonly built today. Of course, more skill and experience is almost always welcome, but when building Fiori apps, what's essential? Yes, knowledge of HTML5 (HTML, CSS and JavaScript) is very important, but the importance of those "raw" skills pales into insignificance compared to the importance of knowing the toolkit that SAP use to build their Fiori apps, and that we do too - SAPUI5. 

SAPUI5 is an abstraction level above HTML5, and while it would be foolish to try and wield SAPUI5 without knowing about HTML5, the key skills you should be looking for in a potential frontend developer are those pertaining to SAPUI5.

## 9. I can manage my Fiori developers just like I do my ABAP developers

This is a misunderstanding that can be costly. Developing in ABAP means working inside the confines of the ABAP stack, the R/3 architecture that is the basis for your ECC, CRM and SRM systems to name a few. Within these walls, the complete developer workflow is defined and encoded in concrete. Code completion, syntax checking, unit testing, version control and software logistics - everything is handled for you (some would say "done *to* you"!) on the ABAP stack. 

This will continue for the ABAP-based OData services you might want to build. But in the non-proprietary world outside, the choice of tools and developer workflows can be bewildering. You have all the advantages and all the disadvantages that total freedom brings. Make sure you have all bases covered.

## 10. ABAP developers aren't the right fit for becoming Fiori developers

Just to qualify this statement somewhat - of course, in an ABAP stack environment, it's likely that there will be ABAP development for the backend part of a Fiori app. But here I'm talking about the assumption that ABAP developers can't make good frontend Fiori developers - can't transition to the skillsets and technologies required to build [outside-in apps](/blog/posts/2012/05/07/sapui5-the-future-direction-of-sap-ui-development/) that run in browsers. 

That's nonsense. For me, there's no such thing as "an ABAP developer". Yes, there are developers that write ABAP, but restricting oneself to a single language is limiting in all sorts of ways. A good developer learns new languages and techniques to stay sharp. The skills, discipline and business knowledge that a good ABAP developer has are more than translatable to the newer world of Fiori development. 

Not everyone will want to transition, and a "full-stack" developer is neither better nor worse than developers separately focused on backend and frontend. 

But, heck - I started my SAP career writing SAP applications in mainframe assembler, then ABAP, and now JavaScript & SAPUI5. If I can do it, what's stopping you?

---

[Originally published on the Bluefin Solutions website](http://web.archive.org/web/20180119183817/http://www.bluefinsolutions.com/insights/dj-adams/july-2016/top-10-misconceptions-about-fiori)
