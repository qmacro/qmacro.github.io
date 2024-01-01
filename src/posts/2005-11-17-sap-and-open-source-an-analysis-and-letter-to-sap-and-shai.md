---
layout: post
title: SAP and Open Source - an analysis and letter to SAP and Shai
date: 2005-11-17
tags:
  - sapcommunity
---
Well this has certainly been an interesting few days in the intersecting worlds of SAP and Open Source. There’s been a lot of comment and discussion already, but having listened to the whole Churchill Club interview and conversation audio (both available at [ZDNet](https://web.archive.org/web/20060624181250/http://blogs.zdnet.com/BTL/?p=2140)) on an early morning drive down to London yesterday, I would like to make some observations.

Rather than focus on some of the worrying remarks that others have already commented upon (intellectual property socialism, innovation, and so on), I’d like to take one part that deals with source code, as that’s been my bread and butter for the last 18 years of working with SAP software.

Shai is understandably keen to see that his comments are not misrepresented – see [I LOVE Open Source—Really!](https://web.archive.org/web/20220625165945/https://blogs.sap.com/2005/11/11/i-love-open-source-really/), so I took the time to transcribe exactly what he said in the interview. What follows is from between 35:40 and 37:00 of the interview’s [MP3 file](https://web.archive.org/web/20061209010350/http://i.i.com.com/cnwk.1d/i/z/e/200511/110905_CHC_EVENT.mp3), when he responds to a rather general question about Open Source. The response deserves some analysis.

> So we analyse Open Source a lot, in the, you know. Most people don’t know it about SAP but we are one of the first Open Source and one of the worst hit Open Source company [sic] in the world.

Worst hit? What does that mean? It’s difficult to tell, because it doesn’t really make sense, so I can only assume it’s either general FUD (equating Open Source to an undefined but undesirable situation) or a taste of what’s to come later on in his response. I suspect the latter.

That said, let’s give SAP its dues; I’ve long carried the flag for SAP for making (most of) the source code to R/2 and R/3 available – see my comment to [Visiting SAP NetWeaver Development Nerve Center](https://blogs.sap.com/2003/12/09/visiting-sap-netweaver-development-nerve-center/) for example. But don’t get out the champagne yet …

> We shipped all of our applications to all of our customers ‘source open’. So the processes that you get from SAP, you get the source of the processes.

To a large extent, that’s true. Of course, it depends how you define ‘application’. Source code for the business applications, in the form of ABAP (and assembler in R/2 as well) is available. But source code to to the kernel, and certain parts of the Basis, err sorry ‘Web Application Server’, system is not.

> And you’re allowed to modify them, which causes the worst disaster in our ecosystem because every single one of our customers decided that “that’s a great idea, let’s go modify the source”. And when they get the next version, they go “well, what do I do with all my modifications?”.

Err, excuse me? So this is perhaps what the ‘worse hit’ FUD earlier was about. Disaster? Far from it, Shai, far from it. In my not so humble opinion, a major part of SAP’s success was precisely *because* of the Open Source nature of the application code it delivered to the customer. Shai distinguishes two levels of ‘open source’ – a ‘read-only’ level for debugging, and a ‘read-write’ level for modifications. So let’s go with that and address each level in turn:

‘Read-only’ – one of the reasons SAP’s support departments didn’t get as swamped as they might with customer questions (stemming from, for example, incomplete documentation) is because the customer was able to look at the code, debug what was going on, and work out for himself what was supposed to be happening. And rather than having to contact SAP to ask for custom modifications, in many cases they could simply copy the code into their own namespace and make the modifications they needed.

‘Read/write’ – far more important than ‘read-only’, this allowed customers to not only modify the code to do what they wanted, but also to fix code from SAP that was broken. Not only that, but they could then send the fixes back to SAP to be incorporated into the next put level / hot package / service release. SAP benefitted (and continues to do so) enormously from this angle.

I remember even back to the late 1980s making a major change (well, rewrite) to an asset management batch program in R/2, for which we had of course the source – in this case, 370 assembler. The problem had been one of performance, and we had the author of the program visiting us from Walldorf. After my changes, the program ran orders of magnitude faster, and the chap (rightly) took the code changes back with him to SAP. This is just a single example. I’ve lost track of the countless fixes I and my colleagues have supplied SAP with over the last 18 years. I don’t begrudge SAP these fixes at all; after all, they’re programmers too (although SAP support these days leaves me somewhat cold, but that’s another story).

So the benefit — to SAP and to customers — of having read/write access to the source code is HUGE. As someone who has wrestled with SAP software for this length of time, I can’t stress that enough.

> And so there’s a, in our industry there’s a very interesting balance that you need to keep; there’s certain things that you need — it’s almost the difference between what happens in the CPU and what happens outside the CPU for Intel. You don’t touch the transistors inside the CPU because, you know, you want to make sure your divisions always work correctly.

Ok, nothing really to comment on here, except to say that the parallel between source code and electronics, while on the surface seemingly reasonable (both ‘high-tech’ and ‘computing’ related), is in fact fairly inappropriate.

> We’re going back into a model where we’re going to take some of that code that was open in the past and put it more into a closed box and put web services, well defined, documented service interfaces to that, and then say above that, you get open. Above that you get open models, you get open source, you get everything you want in order to modify.

WHOA.

Hold on there a second. Out of everything that Shai said in his answer about Open Source, this is (to me) the most worrying. Let me repeat what he just said: “… take some of that code that was open in the past and put it more into a closed box“. Let’s just make sure we understand what he said. It’s fairly clear cut, especially as the sentence that follows pretty much closes the deal: “Above that you get open models, open source“. Above the closed boxes. **SAP is going to take some of the source that’s been open, and close it. Remove the open access to it.**

I don’t want to appear alarmist, but this is alarming in the extreme. Software that SAP has delivered ‘source open’ in the past, will be delivered ‘source closed’ in the future? Well, that’s what he said. And we’re seeing that already today. Let’s step out of the assembler and ABAP world for a second, and into SAP’s J2EE world. Hands up those of you already frustrated with SAP only delivering software in compiled classes, without the Java source? Right. This is already happening.

This, then, is a potential watershed in the SAP world. Whether you agree with Locke, Searls, et al., business is a conversation. SAP’s business has been delivering applications, in the form of software, to its customers. And those customers have taken part, to their and SAP’s great benefit, in a conversation at the software level.

So SAP, and Shai, if I have one plea, it is this: do not deny a major reason for SAP’s success in the past and present, and do not close the doors on your customers in the future. Thank you.

[Originally published on SAP Community](https://blogs.sap.com/2005/11/17/sap-and-open-source-an-analysis-and-letter-to-sap-and-shai/)
