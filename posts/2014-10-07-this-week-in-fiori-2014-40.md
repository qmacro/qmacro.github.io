---
layout: post
title: This Week in Fiori (2014-40)
---


![Screen Shot 2014-10-07 at 07.33.51]( {{ "/img/2014/10/Screen-Shot-2014-10-07-at-07.33.51-300x165.png" | url }})

Another week, another set of Fiori links. Let’s get to it!

**[Fiori App Reference Library app](https://boma0d717969.hana.ondemand.com/sap/fix/externalViewer/), via Luis Felipe Lanz**
Well it was bound to happen, and I’m celebrating that. Luis tweeted a link to a lovely Fiori app, the [Fiori App Reference Library](https://boma0d717969.hana.ondemand.com/sap/fix/externalViewer/), which contains details on the 300+ Fiori apps so far. Of course, the original meta Fiori app, the [SAP Fiori App Analysis application](https://code.bluefinsolutions.com/~dadams/FioriWebinar/AppAnalysis.html) (which I mentioned in [TWIF 2014-31](/2014/08/01/this-week-in-fiori-2014-31/)) is still going strong – find out more about this in this 5 min video “[The SAP Fiori App Analysis application](https://www.youtube.com/watch?v=aVeQ4adHgaY)“.

But what about this new app from SAP (rather than from me)? Well, there are a couple of parts of the URL ([https://boma0d717969.hana.ondemand.com/sap/fix/externalViewer/](https://boma0d717969.hana.ondemand.com/sap/fix/externalViewer/)) that suggest to me that it’s possibly temporary, or still in development (there are some active [debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) statements in there too), but apart from that, it’s a fine example of a classic Fiori app and uses a 1.24 runtime of UI5. I’m tempted to dig in right now and start exploring how it’s put together, but I’ll leave that for another time. I’ll just point out that the data it uses is from a [proper OData service](https://boma0d717969.hana.ondemand.com/sap/fix/externalViewer/services/data.xsodata/) which is in itself more useful than you might think – an official machine-readable detailed list of Fiori apps from SAP. Let a thousand consumer apps bloom!

**[SAP CodeJam on RDE at Ciber NL](http://www.eventbrite.com/e/sap-codejam-eindhoven-river-rde-registration-12714089183) organised by Wim Snoep**
SAP River RDE, or to give it its new name SAP Web IDE (hopefully it won’t change again :-) is an important topic to understand in the world of Fiori. It’s what many developers (although not all) will be using to manage Fiori apps from a creation and extension point of view. RDE has been a long time in gestation but today’s incarnation is very accomplished and those looking to understand what SAP’s approach to software management in the Fiori age is, need to spend some time investigating this.

One of the “Dutch SAP Mafia” members Wim organised an [SAP CodeJam on RDE](http://www.eventbrite.com/e/sap-codejam-eindhoven-river-rde-registration-12714089183) which looked to be a great success. The developer ecosystem is not just about the languages (say, JavaScript) and frameworks[^n] (UI5) but also about the tools and environments within which one works. So this CodeJam was ideally suited to learning more about SAP’s environment. The day saw developers build Fiori applications in RDE, and I was happy to see that our TechEd hands-on session content [CD168 Building SAP Fiori-like UIs with SAPUI5](http://scn.sap.com/community/developer-center/front-end/blog/2013/10/06/building-sap-fiori-like-uis-with-sapui5) — which was created for last year’s SAP TechEd events but has seen action ever since — was put to good use for this event too.

[^n]:actually one should refer to UI5 as a toolkit rather than a framework, for reasons too long and detailed to go into here :-)

**[Introduction to SAP Fiori UX](http://open.sap.com/courses/fiori1) by SAP**
I’ve written about this course from Open SAP before, most recently in the previous TWIF episode [TWIF 2014-39](/2014/09/28/this-week-in-fiori-2014-39/). Well, I thought I’d give a quick update on my perspective … to say that I’ve abandoned the course. Fiori is a huge topic, and one can’t expect a single course to cover everything. But I did expect some UX content, as it’s an incredibly important aspect of the Fiori experience. Unfortunately I didn’t find any, and I noted that I [wasn’t alone](https://twitter.com/ByteDoc/status/518806002314264577) in this regard either.

With the combination of this issue and the as yet unresolved issues from Week 2, I decided that give up on the course and I’d devote the time I’d allocated for study to other more UX/UI related matters, in particular by studying further the [SAP Fiori Design Guidelines](http://experience.sap.com/fiori-guidelines/index.html) that I wrote about in [TWIF 2014-28](/2014/07/09/this-week-in-fiori-2014-28/) along with details of the [latest responsive controls in the UI5 toolkit](https://openui5.hana.ondemand.com/explored.html). Whether you’re following the Open SAP course or not, I’d encourage you to do the same, too.

I must say that I’ve not given up on Open SAP as a whole – in fact I’m eagerly awaiting the next Fiori related course … now that Fiori installation and configuration is out of the way with this first course, it could be full steam ahead for the UX part!

**Update 20 Oct 2014**: Since this post, there has been some discussion internally, on various email threads and also publically here and [on Twitter](https://twitter.com/qmacro/status/523472656457531392). And today SAP posted “[Help Shape the Next SAP Fiori Course](http://scn.sap.com/community/opensap/blog/2014/10/20/help-shape-the-next-sap-fiori-ux-course)” which acknowledges the issues with the lack of UX content and solicits input to determine the content for the next course. Well done Open SAP! This is a conversation in action. I’d encourage you to go over to the [survey](https://www.sapsurvey.com/cgi-bin/qwebcorporate.dll?idx=8SCKQZ) and add your thoughts.

Until next time, share & enjoy!


