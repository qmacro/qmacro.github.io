---
title: SAP TechEd first day - notes from Munich
date: 2004-10-12
description: Well, after a nightmare getting here (V-Bird, the airline I was booked with, went bust) I’m now in Munich at a decidedly disconnected TechEd 04 (more on the disconnected misery later).
tags:
  - sap
  - conference
  - community
  - teched
---

After registration, we went along to Shai Agassi’s keynote presentation. It was fairly interesting, but overall, there was a single key point that stayed with me: “unification” is the new “integration”.

## Unified, not integrated

Shai talked about cycles in the IT industry. He used the airline check-in process as an example to talk about how processes are invented, integrated, and eventually commoditised. He pointed out the fact in the past, check-in used to be handled by people. Big queues, long delays. Now we have self-service check-in stations, where you just stick in your credit or frequent flyer card and are checked in in an instant. Big attraction. The next big thing will be airlines offering you a check-in process … performed by a real human being! A circle completed.

Last week I read a [blog entry](http://www.mnot.net/blog/2004/05/05/boo) talking about XML and the transport of binary data. Someone mentioned to me that XML was fairly inappropriate, inefficient even, to transport data that is more suited to a binary representation, and perhaps binary protocols are the future. Now if that isn’t a complete circle being formed I don’t know what is 🙂

And this is where we come to ‘unified, not integrated’ (my phrase). Recently I [pondered the potential irony of SAP’s technology directions](/blog/posts/2004/09/29/the-integration-irony-of-saps-technology-directions/), with particular reference to data integration. Basically it seems to me that SAP is moving away from integration as a focus (I used the word “de-integration” to describe what I meant), with all the different parts of the NetWeaver family performing different functions, and data living in and travelling between different systems. (This is in stark contrast to the opposite effect on the client side, where all data and functions seem to be converging into one homogenised front-end).

Anyway, this morning during the keynote, with the irony of integration still in my thoughts, I settled on an explanation of what might be happening. And the key to what is happening is the word “unified“. Unification of data and processes is close to integration of data and processes, but it’s not the same thing. And (unless I got the wrong end of the stick) it seems that platform and data unification is what SAP is driving at right now. So I’m now trying to change the design of the puzzle — where I try to figure out what direction SAP is going with technology — from an ‘integration’-based one to a ‘unified’-based one.

And cycles? Well, I’m just wondering how long it will be that we complete the circle and data and function integration and consolidation is all the rage. Again.

## Other stuff

Of course, there was a lot of other stuff that went on at the keynote too. Here are a couple of pointers:

### Composite and xApps

Shai gave a lot of time to telling us about how composite and xApps will help us in being more flexible in business. I’m not doubting this, but I personally am still struggling to understand what they are (technically) and how they tick. I went to the xApps booth at TechEd last year in Basel, and quizzed the patient folk there trying to understand what we are dealing with. But I failed to ‘get it’. I suspect, based on what other people have said to me on this subject, that I’m not alone. So that’s perhaps why Shai gave the subject so much airtime this year. We’ll see, I’m definitely going to re-visit the xApps booth this year and have another go 🙂

### Java Virtual Machine Management

Shai invited Harald Kuck up on stage to give a fantastic demonstration of how SAP hackers in Walldorf have enveloped the Java VM with the same virtual machine / process management goo that we’ve grown to know and love in the ABAP world (it works so well there that we don’t even notice it working). This is what SAP excels at – having the inspiration and guts to go for really hard problems … and solve them. Hats off to those people (just a shame the language in question is Java 😉

## Disconnected and powerless

I am lucky enough to attend a number of technical conferences each year. SAP TechEd is certainly the most well-attended, orientated around the biggest software entity in the world, and I don’t need to tell you how important the ‘net is to ERP business these days.

So you’d think that providing some sort of Internet access would be as natural and obvious as providing food and water. Wouldn’t you? Well, wrong. I’m having deja-vu all over again, as the saying goes. In Basel, no ‘net access, and the sessions are so full you’re refused entry. Pretty disappointing. I decided to give TechEd another chance this year. Perhaps it’s too early to say for sure, but I think that it was possibly a bad move. No ‘net access (apart from access that you can buy on an hourly basis from the convention centre itself … at extortionate prices) at all, apart from in the speaker room (and it’s not proper ‘net access – just access to the Web via a proxy, so I can’t reach my email on my box, via ssh, for example). And the sessions we’ve wanted to attend so far … yep, have been too full to get into. So a bit like Basel. But with even less power (for laptops). ‘Disappointing’ is the word that comes to mind. I attend the grass-roots event [FOSDEM](https://www.fosdem.org) (the Free and Open-Source Developers’ Meeting) in Brussels, and even they can organise free wifi access. And the attendance fee is … zero! What’s going on, SAP?

![Craig and Mark](/images/2004/10/MarkAndCraig.jpg)

(Indeed, as you can see here, Craig Cmehil is so desperate he’s had to resort to paper and pencil to write his blog post!)

I’d like to end this ramble on a positive note, though. Our great leader Mark Finnern is running around organising a few of these extortionate access cards for the SDN clubhouse (which is also wireless-less and powerless) plus some power outlets for us. Nice one Mark, and thanks! We’ll see how it goes.

_Update: Mark has organised power for the SDN clubhouse – thanks Mark!_

---

[Originally published on SAP Community](https://blogs.sap.com/2004/10/12/sap-teched-first-day-notes-from-munich/)
