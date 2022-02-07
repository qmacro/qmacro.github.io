---
layout: post
title: This Week in Fiori (2014-38)
tags:
- codejam
- development
- insidetrack
- liverpool
- sheffield
- ui5
---


Hello again, I’m back again after a week off TWIF, a week where I managed to participate in two great events in the north of England. First, on Sat 13 Sep there was [SAP Inside Track Sheffield](http://scn.sap.com/community/events/inside-track/blog/2014/05/02/sap-inside-track-sheffield--uk), (organised by Tim Guest, Steve Lofthouse and others) where I presented a session on UI5.

![Screenshot 2014-09-21 at 21.19.54]( {{ "/img/2014/09/Screenshot-2014-09-21-at-21.19.54-300x149.png" | url }})

Then yesterday (Sat 20 Sep) there was [SAP CodeJam Liverpool](http://scn.sap.com/community/events/codejam/blog/2014/08/15/sap-codejam-liverpool--openui5), organised by Gareth Ryan. It was a UI5-themed day where I was totally honoured to work with Frederic Berg (one of the many UI5 heroes from Walldorf) taking the participants on an all-day introduction to building apps with UI5. We took a Fiori design led approach with the exercises and I would say that by the end of the day all the attendees had gained a good appreciation for UI5 and a decent understanding of the development approach. It was a lot of fun and very rewarding; not least because a couple of the participants were from the non-SAP developer ecosphere. Developer outreach, albeit small, in action!

Perhaps it’s worth pointing out again that SAP Fiori is powered by UI5. To properly understand SAP Fiori from a developer perspective, UI5 is an essential skill to have.

Anyway, on to this week’s picks.

**[How to launch “Web Dynpro ABAP” and “SAP GUI for HTML” Application Types from the SAP Fiori Launchpad](http://www.sdn.sap.com/irj/scn/go/portal/prtroot/docs/library/uuid/40611a2f-ba23-3210-60b5-d26402db0f2e?QuickLink=index&overridelayout=true&59575491383848) by Jennifer Cha**
 I’ve talked about the SAP Launchpad becoming the new portal a number of times in this TWIF series, but if you need more convincing, take a look at this step by step guide. SAP Fiori Launchpad started out live (in its previous “Launch Page” incarnation) as an initial access point to the Wave 1 ESS/MSS Fiori apps.

A lot has changed since then, not least the HTML5 architecture that powers it. But more importantly, the ability to make more available through this initial access point is increasing. SAP Fiori, part of SAP’s “New, Renew, Enable” strategy[^n], specifically the “Renew” part, is not going to cover the entire functional breadth of, say, your ECC system. So having the ability to expose more traditional transactions in the same context as the next generation approach makes some sense, even if it does, in my mind, dilute the purity of design :-)

[^n]:actually this strategy now has a fourth strand “Design Services”. More on that another time, perhaps.

**[SAP Fiori and Google Analytics](https://www.youtube.com/watch?v=M_12F3JNKWA) by Craig Gutjahr**
The integration of Google Analytics and web apps is nothing new of course. But this short screencast is a nice reminder of what’s possible. The ability to track activity on a user basis, even on a page basis, is extremely valuable. Combine the detail that Google Analytics gives you, with the ability to explicitly send details on page views from your Fiori app (on a certain event in UI5, such as a navigation) and use that information for the next iteration of your app, focusing on roles and task-based activities, and you can build yourself a nice UX feedback loop.

By the way, there’s a nice example of sending explicit events to Google Analytics on Joseph Adams’s post “[Optimizing page timings for Google Analytics](http://jcla1.com/blog/optimizing-google-analytics/)“.

**[The Power of Design Thinking in Fiori Application Development](http://scn.sap.com/community/mobile/blog/2014/09/19/the-power-of-design-thinking-in-fiori-application-development) by Sarah Lottman**
This is a good short piece on, well, basically, talking to the user to work out what they need. I’m still not sure what design thinking is, over and above putting yourself in the users shoes and working out what they want, before developing stuff. Of course, this is very glib of me and I may have missed the mark, and the design process that Sarah describes is neither easy nor obvious. I myself am guilty of building software and then imposing that upon others, without having talked to them.

So perhaps the key takeaway is actually that one way to get design right is to use the building blocks that Sarah describes – persona creation, process and task flow mapping, and wireframing. Actually it’s often fun to skip wireframing and jump straight to throwing UI5 control declarations into an XML view structure and throwing it at the screen. Or is that just me?

**Jobs, Jobs, Jobs by Various**
It was going to happen sooner or later. Actually it already started a while ago, but these days I’m noticing more and more job postings. Postings mentioning Fiori specifically, and postings mentioning UI5 specifically, in the title. Thing is, with Fiori and UI5 being relative new skills on the scene, there’s room for even more confusion than normal in this area.

![Screenshot 2014-09-21 at 21.01.18]( {{ "/img/2014/09/Screenshot-2014-09-21-at-21.01.18.png" | url }})]

Take a recent post on Twitter, advertising a position thus: “Architect – Mobile Web & Fiori Job” at SAP in Bangalore (according to the link destination).

But reading the copy, the only mention of the word “Fiori” in the whole detail was in the title. Nowhere in the actual description. And the only mention of UI5 at all was as the last item in a list, almost an afterthought: “(JQM, Sencha, SAP UI5, etc)”.

I don’t understand what’s going on here. So I guess we have to just keep an eye on the details of what is actually being offered. And on that subject, keep an eye on the details on the other side of the fence too. In a previous episode (TWIF 2014-29) I noted seeing a claim of “five years plus of SAP Fiori focused delivery”. Remember, Fiori has existed for less than two years, UI5 for a bit more than that. Caveat, well, everyone.

That’s it for this week, thanks for reading, see you soon!


