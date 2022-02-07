---
layout: post
title: This Week in Fiori (2014-34)
tags:
- documentation
- enhancements
- extensibility
- fiori
- prototyping
- tools
- ui5
- workflow
---


![Screenshot 2014-08-23 at 14.37.51]( {{ "/img/2014/08/Screenshot-2014-08-23-at-14.37.51.png" | url }})

Another week gone! I’m sitting in my “second living room”, [North Tea Power](http://northteapower.co.uk), drinking a fab coffee and sifting through the Fiori related articles that came to my attention this week. And just this morning there was a very interesting conversation on Twitter that I also want to bring to your attention; not only because it relates to Fiori, but also because it involves some of the key thinkers and doers in this space, folks that I respect greatly. So, let’s get to it.

**[Extensibility information for SAP Fiori](http://help.sap.com/fiori_bs2013/helpdata/en/c1/804352b4e61b13e10000000a44176d/frameset.htm) by SAP**
 In my 27 years hacking on SAP, I’ve seen the constant struggle between quality and quantity of SAP documentation. I cut my enterprise tech teeth on IBM mainframes – proprietary tech to the core, but my goodness did they have superb documentation, the quality and preciseness of which I’ve never seen since, to be honest. I’m sure I’m not the only one who’s had a love-hate relationship with SAP documentation, but having recently been on the other side of the fence (involved in [producing some documentation](http://help.sap.com/saphelp_uiaddon10/helpdata/en/5c/a68e6e62e6464a8103297fbc19cd9c/content.htm?frameset=/en/91/f0ed206f4d1014b6dd926db0e91070/frameset.htm) recently) I do know it’s no easy task.

SAP Fiori is here to stay, as are the underlying tech layers; and we need to be prepared to embrace a new SAP software logistics world that is very different from the old but comfortable ABAP stack based one with which we’re familiar. Software logistics? Code management, version control, deployments, and extensions & enhancements … not least those modification free ones that allow us to survive service pack updates and the like.

So it is with this in mind that I reviewed what extensibility documentation exists in the SAP Fiori space. While it touches many of the bases, it is still relatively sparse on detail, and still lacking in examples. Still, it is a start, and I encourage you to read it, if nothing else, to discover the areas that you need to know more about … and persuade SAP to write more on.

**[Fiori, Personas and beyond: selecting the best UI for SAP processes](http://scn.sap.com/community/ui-technology/blog/2014/08/13/fiori-personas-and-beyond-selecting-the-best-ui-for-sap-processes) by Chris Scott**
 This is a nicely considered post on the SAP Community Network that takes a step back from Fiori and encourages the reader to consider all the options for improving the overall user experience (UX). It highlights that there are options other than SAP Fiori of course, but more importantly it suggests, rightly, that the whole approach should be requirements driven, with a focus on improving process. Sure, this sounds obvious, but sometimes it’s easy to lose sight of the bigger picture when the tech is so compelling. It also goes some way to underline the basis of SAP Fiori UX strategy – task / function focused, according to role, rather than the more traditional feature-smorgasbord that we’re used to in the UI that we drive by entering transaction codes.

**[SAP Fiori Prototyping Kit](http://experience.sap.com/fiori-guidelines/FioriDesign/52_Fiori_Design-Prototyping-Kit.html) by SAP**
 In [TWIF 2014-28](/2014/07/09/this-week-in-fiori-2014-28/), I highlighted the [SAP Fiori Design Guidelines](http://experience.sap.com/wp-content/fiori-guidelines/). Bundled with these guidelines was a simple prototyping kit. The very fact that a prototyping kit exists suggests how important the user interface (UI) design process is if you want to produce good UX, and while there are different philosophies related to prototyping, a lowest-common-denominator approach is to mock stuff up with building blocks that represent UI component parts. The prototyping kit has these component parts, and has recently (this month) been updated. Definitely worth a download.

A useful side effect of tools like this is that we stand a better chance of producing appropriate and consistent, compatible “Fiori-like” UIs that don’t jar when switching from one app to the next.

**[On UI5 and Fiori deployment and extensions](https://twitter.com/grahamrobbo/status/503123365671219200) by The Usual Suspects on Twitter**
 A very interesting conversation came about on Twitter this morning, with UI5 and Fiori luminaries such as [Graham Robinson](http://twitter.com/grahamrobbo), [John Patterson](http://twitter.com/jasper_07) and [Jason Scott](http://twitter.com/js1972). It was about non-standard (i.e. not SAP standard) development workflows, and included thoughts on Fiori development and extensibility.

As with many Twitter conversations, a lot of what was not said — due to the 140-char nature of the microblogging platform — was just as important (bringing a modern nuance to “reading between the lines”). My take on the conversation, and the thoughts in the minds of the participants, was that we need to keep a close eye on where SAP is going with tooling, and where we as individual developers want to go, how the paths are similar and how they’re different. Not everyone wants to use Eclipse, or even RDE, to develop and maintain Fiori applications. RDE – the River Development Environment – is of course a fabulous piece of engineering but it should never be a one-size-fits-all solution.

One of the wonderful side effects of SAP embracing open standards and open source is the freedom we have to choose the tools, and build the the tool chains and workflows with those tools, workflows that best suit the particular environment and circumstances of the client and the design / developer teams. I want to make sure we don’t lose sight of that side effect as time goes on.

Well that’s it for this week, until next time, share & enjoy!


