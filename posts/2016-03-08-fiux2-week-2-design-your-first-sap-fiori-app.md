---
layout: post
title: '"fiux2" Week 2 – Design Your First SAP Fiori App'
---

(See first post in this series — [“fiux2″ – The openSAP Fiori Course – 2016 Edition](/2016/03/04/fiux2-the-opensap-fiori-course-2016-edition/) — for links to the other posts).

Well, the weeks certainly come around fast in these [openSAP](http://open.sap.com) courses, and so we find ourselves on Week 2 of the [Build Your Own SAP Fiori App in the Cloud – 2016 Edition](http://open.sap.com/courses/fiux2). Here’s a quick run down of what was covered, with some thoughts from me.

**Unit 1** **“SAP Fiori 2.0 Overview”.** This first unit gave a nice overview and introduction to the SAP Fiori 2.0 concepts. Yes, Fiori 2.0 is still conceptual in parts, but we’re already seeing practical output, in the form of the very real [Overview Page](https://sapui5.netweaver.ondemand.com/#docs/guide/c64ef8c6c65d4effbfd512e9c9aa5044.html) mechanism, for example. There are plenty of new concepts for Fiori in the 2.0 design, such as the Viewport, the Control Space and the Copilot.

Some of these concepts are not new, but they don’t have to be; in fact one of the key tenets of Design Thinking, introduced in Unit 2, is “Build on the ideas of others”. I rather think that some of the ideas have been taken from the Dashboard concept that Nat Friedman built a good while ago – I [wrote a few posts on Dashboard](/?s=dashboard) back in 2003 and then later that decade.

**Unit 2** **“Introduction to Design Thinking”**. This content isn’t new, in fact the openSAP folks stated that it’s the same content as last year’s course. Nevertheless it was worth a brief re-introduction to set the scene for the design principles that are to come in Unit 3. The thing with Design Thinking, at least for me, is that it’s all pretty obvious in theory, but putting it into practice requires effort.

I think the concepts around the pre-build phases of app delivery still need to be successfully and firmly landed in some organisations. Further, there’s a fine balance to be had between not letting technology (and developers) drive solutions, and designing something that would require a great deal of effort to implement. We have the tools (and the design principles) and know how to use them, so we should use that knowledge to inform the process.

**Unit 3 “The SAP Fiori Design Guidelines”**. Anyone who’s looked into SAP Fiori UX is likely to be at least lightly acquainted with these, either at 30000 feet – with the 5 principles (Role-Based, Responsive, Simple, Coherent and Delightful) – or at ground level with the practical [implementation advice in the online documentation](https://experience.sap.com/fiori-design/). But as this course is soon to introduce the first hands-on element (designing an app), it’s valid to re-introduce them at this stage, if not to set a level knowledge playing field for all participants.

I did like the explicit calling out of the concept of “Fiori-like” towards the end of this unit. Design is not black and white, and there’s been a long-standing question over whether non-SAP folks could call their apps “Fiori”, or whether they had to say “Fiori-like”. I’ve maintained the position that if the design guidelines were followed, then they were “Fiori”, not just “Fiori-like”. That said, with the title of the course we put together gave in the early days (three years ago!) – “[Building SAP Fiori-like UIs with SAPUI5](http://scn.sap.com/community/developer-center/front-end/blog/2013/10/06/building-sap-fiori-like-uis-with-sapui5)“, things weren’t so clear-cut :-)

**Unit 4 “SAP Fiori Decomposition and Recomposition”**. You might be forgiven for thinking that this process is a somewhat over-formalisation of what appears to be straightforward: The extraction of functionality from the “kitchen-sink” transaction-based approach of the traditional SAP experience into smaller role and task focused applications, sometimes combining functionality from previously separate transactions. Sure, that’s what it is.

But it’s more than that, I think, when seen as a complete process. The functionality being extracted is predominantly being extracted from a proprietary context, and reconstituted into a neutral, platform-independent and responsive context. We’ve been stuck too long in the world of proprietary, tethered too much to the desktop with SAP because of the Microsoft disease that has set hold in enterprises in the last couple of decades or more. So SAP targets that market and the only real experience for many has been SAPGUI for Windows, an experience that is so far from being portable it became one of the catalysts for Fiori. Recomposing functionality into the context of the one true native platform – the Web, is a great move for SAP.

**Unit 5 “The Importance of Prototyping”.** Like Design Thinking but perhaps less so, prototyping phases are sometimes difficult to bring about and get the most out of, especially when deadlines and budgets are tight. Organisations need to work out the value for themselves for the Discover and Design phases, rather than just focus on the Develop and Deploy phases … especially those that involve the business.

![image]({{ "/img/2016/03/Screen-Shot-2016-03-07-at-07.48.08.png" | url }})

There’s a leap of faith that’s required, and we’re all responsible for helping make that happen.

On mockups and protoyping, especially in the early stages, I’m a fan of the simplest thing that could possibly work, which is pencil and paper. Low cost, discardable, and folks aren’t distracted by debating what colour a button should be.

Moving into the benefits of the later stages of prototyping, I’m reminded of one of the founding beliefs of the Internet Engineering Task Force (IETF) – one of the bodies that maintain standards that mean that we can all simply take the Internet and all its children (such as the Web) for granted. This belief is “general consensus and running code” ([from the Tao of IETF](https://www.ietf.org/tao.html#rfc.section.2)). Showing a working model of something you’re trying to convey is very valuable indeed.

(I did take issue with the stated “correct” answer to one of the self-test questions on this unit: Q “How can app implementation be inexpensive?”  A: “If enough iteration, prototyping and validation is done beforehand”. That might mean the UX is right, but it doesn’t imply that making that UX happen is easy!)

**Unit 6 “Prototyping 101 Using SAP Splash and Build”**. Following on from my comments earlier about adoption and landing of the Discover and Design phases, this unit contained an overview of the two tools that help to support those stages – Splash and Build respectively. It’s a longer than usual unit with 25 mins of video, but worth watching if you haven’t already seen or played with these tools.

The tools themselves are already very accomplished, but I do wonder how much the studies have actually been employed thus far. It’s partially a circular situation – the tools won’t be used unless Discover and Design are more strongly adopted, and the adoption has a better chance of taking hold if tools like this deliver on their promise.

One of the things that caught me eye (that hadn’t been available in the early-access I’d had to Splash a while ago) is the [Gallery](https://www.experiencesplash.com/splashapp/gallery) of existing designs. I’m looking forward to browsing through, and seeing how they complement the Fiori Design Guidelines.

**Unit 7 “Design Challenge”**. The last unit of this week sees the start of the first of the two practical portions of this course. This is the design challenge, where we must put into practice what we’ve learned this week – covering the Discovery and Design phases of the end to end process, including use of Splash and Build. Giving and receiving feedback from course peers is also involved, which is a nice way to scale this, and also an opportunity for me to see feedback stats in these tools that has come from someone other than me!

This design challenge lasts two weeks, which means that although there’s an assignment to complete this week, there isn’t one next week – so that we have time to complete the first part of the challenge (submitting the design mockups) without needing to spend more time than budgeted for this course. A nice move.

—

There’s one more aspect of this course that I wanted to mention last time but didn’t get round to it. At the end of each week, there’s a “just in time” video blog entry which gives the course creators and instructors a chance to impart last minute information and changes. I like this aspect, and the relaxed nature of how it’s presented. Indeed, with the contents of this course being based on software-as-a-service products in the cloud, and with the changes that happen on a monthly basis, it’s a good idea.

And on this note of constant change, I’ll leave you with one thought from Martin Fowler. I was reminded of this wisdom via [Sascha Wenninger’s tweet this morning](https://twitter.com/sufw/status/707105718403371008): “If it hurts, do it more often” :-)

(For links to commentary for further weeks, see the first post in this series: [“fiux2″ – The openSAP Fiori Course – 2016 Edition](/2016/03/04/fiux2-the-opensap-fiori-course-2016-edition/).)


