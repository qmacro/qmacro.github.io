---
title: 10 tips to get you started on your Fiori development journey 
date: 2015-03-02
tags:
  - bluefinsolutions
---

A developer's journey to a new set of technologies is a very personal one, but there are definitely a few pointers that I can give you based upon my own experience.

Following on from my previous post [Can I build a Fiori app? Yes you can!](/blog/posts/2015/03/02/can-i-build-a-fiori-app-yes-you-can!/) here's a top ten list of tips for the next steps on your journey to become a Fiori developer.

<br/>
1. [Study the SAP Fiori design guidelines](#study-the-sap-fiori-design-guidelines)
1. [Get to know the sap.m library in UI5](#get-to-know-the-sapm-library-in-ui5)
1. [Understand components and routing](#understand-components-and-routing)
1. [Embrace MVC and declarative views](#embrace-mvc-and-declarative-views)
1. [Start using the WebIDE](#start-using-the-webide)
1. [Set up your local development environment now](#set-up-your-local-development-environment-now)
1. [Make Northwind your new friend](#make-northwind-your-new-friend)
1. [Learn how to wield Chrome Developer Tools & the UI5 Support Tool](#learn-how-to-wield-chrome-developer-tools---the-ui5-support-tool)
1. [Master data binding](#master-data-binding)
1. [Study existing Fiori apps](#study-existing-fiori-apps)

## Study the SAP Fiori design guidelines

Read the content of [SAP Fiori Design Guidelines](https://experience.sap.com/fiori-design/) website. And then read it again. Fiori apps are successful at a UX level because of the consistent design that abounds.

The design didn't just happen by accident - Fiori apps don't look the way they do for a random reason. They're not immediately recognisable by pure chance. Everything, from the pixel-perfect precision of the design and the space between the design, is deliberate. Get that under your skin. Understand what the different application types are; know what a master/detail pattern is and what it's used for; get to grips with patterns and controls. Appreciate the use of filters, the placement of action buttons, and the subtleties of responsive design. And remember: often, less is more.

## Get to know the sap.m library in UI5

First, a factoid. The first real customers of the [UI5 toolkit](https://sapui5.hana.ondemand.com/sdk/), and specifically the [sap.m library](https://sapui5.hana.ondemand.com/sdk/#docs/api/symbols/sap.m.html) and the controls therein (sap.m is one of the many libraries within the UI5 toolkit), were the internal teams of Fiori developers at SAP. They'd been tasked with building the first few waves of Fiori apps, and needed controls to satisfy the app designs. They needed visual building blocks with which to construct clean and consistent apps.

The superstars on the UI5 team in Walldorf and elsewhere - the designers and developers - built out the controls inside the sap.m library, specifically with those Fiori developer teams in mind. Fiori is built with controls in the sap.m library.

Yes, of course, there are other controls that are also utilised, such as those in the sap.ui.layout library. And those are super important too (for an example, see the Grid control in this post: [UI5 features for building responsive Fiori apps](/blog/posts/2015/02/23/ui5-features-for-building-responsive-apps/)).

But the visible building blocks that are used to construct a Fiori app come from the sap.m library. These days the "m" stands for "main"; originally it stood for "mobile", as a reference to the responsive nature of these controls.

How do you go about getting to know sap.m library controls? Start with the [Explored app in the UI5 SDK](https://sapui5.hana.ondemand.com/sdk/explored.html); it's a super resource that gives you real examples of how the controls can and should be used, and you can say "show me the code" too.

## Understand components and routing

These two concepts from the UI5 toolkit are essential for building non-trivial apps properly. Arguably, you can build Fiori apps without these two concepts, but you won't be able to include them in the Fiori Launchpad, and you won't be able to navigate to them from other Fiori apps.

The Component concept is fairly straightfoward, but the implications are subtle and wide-ranging. The essential mantra is "think local, not global". A proper Fiori app should be self-contained, not refer to global mechanism such as the UI5 runtime core and the central event bus. Each component has its own event bus, as well as its own router and routing definitions.

If you examine the details of the app that accompanies the UI5 Application Best Practices guide in the SDK, you'll find examples of how to build using Components and routing.

## Embrace MVC and declarative views

We've already come across MVC so I don't need to say too much there. So what do you need to do? Learn how the structure of an app is built, using screen-sized and invisible controls, and how the views within that structure are related to each other and to their controllers.

And love it or loathe it, XML is in your future. All standard SAP Fiori apps have their views defined declaratively in XML. And you'll quickly find out why - it's the most concise, efficient and clean way to do it. Not a fan of XML? Get over it.

## Start using the WebIDE

Everyone will have their favourite editor, their favourite development environment in which they're most productive and where they can comfortably build Fiori apps. Sublime Text, vim, WebStorm, Atom, even (for the masochists) Eclipse!

SAP's WebIDE might not be that favourite environment. But it's got a lot of things going for it, and you don't have to make it your *main* environment.

Use the WebIDE to kick start your Fiori development journey. Extract and examine the reference apps, which have been placed there by the folks in the Fiori Implementation Experience (FIX) team.

Begin developing a new Fiori app from one of the starter templates, or even starting from one of the reference apps. A Fiori app has a lot of moving parts; if you're just starting out, getting help getting those moving parts going and working well together is worth a lot.

## Set up your local development environment now

If you've developed in the past within the soft padded walls of an ABAP stack, you've had everything done for you. Or done to you, depending on your perspective. You didn't have to think about your editor, about version control, about syntax highlighting and linting, or even about serving your app up for testing.
study-existing-fiori-apps
That was (and remains) the old world. Developing apps for the web is new. This is not some inside-out based development where you create your UIs inside of an ABAP stack and then push them out to be rendered in the target browser. This is grown-up outside-in development where you're developing directly for the new runtime - the browser.

There are plenty of guides showing how you can set your own development environment up and get your development workflow going. Find one that suits you and get going with it as soon as you can.

## Make Northwind your new friend

Northwind is the well-known reference OData service that's out there and available. This tip is not necessarily about the [Northwind OData service](http://services.odata.org/) per se; it's more about making yourself (a) familiar with OData and how it works, and (b) doing that in a way that's independent of any backend SAP system. In light of this, getting to know the Mock Data Server mechanism, which is also part of the UI5 toolkit, is also essential.

Yes of course you're going to want to build Fiori apps that consume data from an SAP backend, and that also means OData. But that can sometimes be quite an expensive goal in the early days; it might be that the OData service isn't ready, or you haven't got access to it, or you're just on a train trying to get something done in your local development environment and can't get connected to that backend OData service. You can accelerate your journey along the Fiori development learning curve by being independent of any specific backend system. By being self-contained.

## Learn how to wield Chrome Developer Tools & the UI5 Support Tool

Building ABAP based solutions, you'll know that the debugger is a powerful ally. The [Chrome Developer Tools](https://developer.chrome.com/docs/devtools/), along with the UI5 Support Tool are the equivalent, and more, in this new world.

You're using Chrome, right? That pretty much goes without saying; it's just as if not more important than your editor; in fact, it is *becoming* the editor.

![The UI5 support tool](/images/2015/03/ui5-support-tool.jpg)

Get to know how to wield the superb development, debugging and tracing features of the Chrome Developer Tools; understand what the UI5 Support Tool can offer you. If you do nothing else today, hit Ctrl-Alt-Shift-S on a running Fiori app and have a look at the Control Tree panel.

## Master data binding

Data binding is where the frontend meets the backend. Master it. Understand the nuances of object, property and aggregation bindings; learn the subtleties and features of complex embedded binding syntax, how to specify sorting, filtering, grouping, formatting and factory functions.

A lot of what you might think is achieved through imperative code in controllers is in fact achieved through declarative binding. Don't be scared of it, it wants to be your friend. One thing I'll say here, which is only partly true but something that will help you as you bear it in mind: If you find yourself making explicit OData calls exclusively, it is possibly a bad code smell. Not all the time, but there's a chance.

## Study existing Fiori apps

This tip of course is possibly the most important, and the most generic. If you want to learn, improve your skills in, or eventually master something, the one thing you cannot afford to avoid is reading. Looking at existing examples of what you're trying to learn to build. Understand how to get at the non-minified sources of standard SAP Fiori apps. Look at the templates and the reference apps in the WebIDE.

Make your breaks work for you by poring over other people's code while you pour the hot water over your ground coffee. And yes, not everything you read will be great examples of the Fiori app art. Remember that the folks who wrote the Fiori apps are just like you and me; they've just had a bit of a head start, that's all. It won't all be gold standard code. But even the bad code is useful to read; find patterns and anti-patterns and learn from those.

## Conclusion

Of course, if you ask others how you go about learning to build Fiori apps, it's likely that they'll have other tips too. But I'm pretty sure that these will be the common denominators. And they're all things that have helped me on my journey. Happy travels!

---

[Originally published on the Bluefin Solutions website](http://web.archive.org/web/20180322124721/http://www.bluefinsolutions.com/insights/dj-adams/march-2015/10-tips-to-get-you-started-on-your-fiori-developme)
