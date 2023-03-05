---
layout: post
title: The advent of UI5 1.30 and what it means for us
date: 2015-09-09
tags:
  - bluefinsolutions
---

SAP's UI5 toolkit, the main technical foundation for SAP's User Experience (UX) revolution, has reached a milestone release. While 1.30 is just another step up from the previous public release of 1.28, for me it represents a transition towards a maturity that is built upon a solid foundation. In this post, I pick out five innovations that show why.

UI5 started out inside SAP back in late 2008, and it has been available to us as customers and partners since around 2012 ([I wrote about an early 1.2 beta version back then](/blog/posts/2012/05/07/sapui5-the-future-direction-of-sap-ui-development/)). By now most, if not all of us, should be aware of SAP Fiori UX and what it represents. The growth of the Fiori application design patterns and implementations has been nothing short of stellar. And its technical success is all down to the UI5 toolkit that is lovingly nurtured and tended by an awesome group of modest heroes in SAP.

## 30 Days of UI5

To celebrate the advent of UI5 1.30, I set a goal of building a series of 30 daily blog posts on UI5.

With the help of of friends and colleagues here at Bluefin and also at SAP, this goal was reached, and exists in the form of a blog post series called [30 Days of UI5](/blog/posts/2015/07/04/welcome-to-30-days-of-ui5!/), or "30UI5" for short. I've written more about this in my post [Building blocks for the future normal](/blog/posts/2015/08/06/building-blocks-for-the-future-normal/), where you can read more about UI5 in the context of S/4HANA. Otherwise, just head on over to the series and take your pick from the titles. Some are technical, others less so. The final post in the series is by Sam Yen, SAP's Chief Design Officer. Titled [The origin of becoming a fundamental enabler for Fiori](/blog/posts/2015/08/02/the-origin-of-becoming-a-fundamental-enabler-for-fiori/), it gives some great insight into the origins of UI5 and Fiori.

## What 1.30 means for us

To explain what the advent of 1.30 means for us, for you, and for SAP's continued UX revolution, we'll have a brief look at some of the recent innovations. Here's my top 5 list of innovations and why they're important. You can find links to these and more from the [What's New page for the 1.30 release](http://web.archive.org/web/20180318121556/https://openui5.hana.ondemand.com/#docs/guide/99ac68a5b1c3416ab5c84c99fefa250d.html).

### Open Development

Perhaps this innovation is the least obvious. Let's take a look at the context of the 1.30 stable release announcement. It appeared yesterday on the OpenUI5 blog: [New stable Release: OpenUI5 1.30](http://web.archive.org/web/20180318121556/http://openui5.tumblr.com/post/128558808832/new-stable-release-openui5-130). SAP open-sourced the UI5 toolkit back in 2013. But this act was no empty gesture; the UI5 codebase that powers our enterprise [future normal](/blog/posts/2015/08/06/building-blocks-for-the-future-normal/) continues to be developed in full view, and in cooperation with customers, partners and developers. And 1.30 was available first in the open source flavour. What does that mean for us? Innovation and scrutiny of the highest degree, bringing a quality and thoroughness that can only be achieved by such an open process.

### Asynchronous Resource Loading

This is a general innovation that sees the UI5 toolkit move towards an "asynchronous-first" loading approach for resources such as views and controllers. Performance is a key foundational aspect of the UX revolution, and alongside the existing network traffic improvement techniques such as JavaScript minification and the "preload" mechanism (compression of all application resources into a single file), asynchronous loading will sharpen up the performance of Fiori apps, resulting in happier users. For more info, see the 30UI5 post [An introduction to sap.ui.define](/blog/posts/2015/07/27/an-introduction-to-sap.ui.define/).

### OData Meta Model

One aspect of OData that differentiates it from other data sources is that it's server-side based, rather than client-side based. But another aspect is that the data represented comes complete with metadata and annotations. An OData service bristles with knowledge about itself and details about the entities that it exposes. So much so that it is possible to take advantage of this in applications, where developers can use UI5 features such as the [OData Meta Model mechanism](http://web.archive.org/web/20180318121556/https://openui5.hana.ondemand.com/#docs/guide/341823349ed04df1813197f2a0d71db2.html), and the [Annotation Helper](http://web.archive.org/web/20180318121556/https://openui5.hana.ondemand.com/#docs/guide/dbec058964f545e4bb3b7e9fbaa0602d.html) to use metadata expressions to enhance aspects of data binding. The result is that building helper and formatting functions in Fiori apps becomes simpler and more declarative, with fewer moving parts and fewer places for things to go wrong.

### The Semantic Page control

The standard SAP Fiori apps are built upon a scaffolding layer that provides consistency of architecture, function and design. This scaffolding layer is, however, internal-only, (deliberately) undocumented and not recommended for customer use. This doesn't mean we can't build SAP Fiori apps ourselves, [far from it](/blog/posts/2015/03/02/can-i-build-a-fiori-app-yes-you-can!/). But it does mean that it's pending deprecation might leave us bereft of good technical support for building apps with that consistent design. This Semantic Page control and its relations are the first steps to providing a proper replacement for the monolithic scaffolding mechanisms, resulting in the possibility of a more standardised approach to realising Fiori designs in customer scenarios. For more info, see the 30UI5 post [Semantic Pages](/blog/posts/2015/07/06/semantic-pages/).

### Great tutorials

Version 1.30 sees a family of great [tutorials](http://web.archive.org/web/20180318121556/https://openui5.hana.ondemand.com/#docs/guide/8b49fc198bf04b2d9800fc37fecbb218.html) available within the Software Development Kit (SDK) itself. Beyond the obligatory Hello World! tutorial, there is a [35-step Walkthrough](http://web.archive.org/web/20180318121556/https://openui5.hana.ondemand.com/#docs/guide/3da5f4be63264db99f2e5b04c5e853db.html) that takes the reader through many of the key aspects of developing with UI5, a new 17-step tutorial on [Navigation and Routing](http://web.archive.org/web/20180318121556/https://openui5.hana.ondemand.com/#docs/guide/1b6dcd39a6a74f528b27ddb22f15af0d.html) which has long been anticipated, and a 15-step [Data Binding](http://web.archive.org/web/20180318121556/https://openui5.hana.ondemand.com/#docs/guide/e5310932a71f42daa41f3a6143efca9c.html) tutorial. While in the past developers had to make the most of the scattered examples throughout the SDK to learn, or infer, best practices, there is now no excuse for not knowing how to do things, and how to do them right. With these tutorials, your Fiori developers are now equipped with the right knowledge to build robust applications and custom extensions in your organisation.

UI5 1.30 is here now, already available in the form of OpenUI5 [through the CDN](http://web.archive.org/web/20180318121556/http://openui5.tumblr.com/post/125924070522/use-a-specific-version-of-openui5-from-our-cdn), and coming to a frontend server near you in the form of SAPUI5 soon. You can track availability of SAPUI5 through the [Maintenance Status page](http://web.archive.org/web/20180318121556/https://sapui5.hana.ondemand.com/versionoverview.html). Get ready to embrace the innovations and make them work for your organisation!

---

[Originally published on the Bluefin Solutions website](http://web.archive.org/web/20180318121556/http://www.bluefinsolutions.com/insights/dj-adams/september-2015/the-advent-of-ui5-1-30-and-what-it-means-for-us)
