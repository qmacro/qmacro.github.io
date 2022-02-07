---
layout: post
title: Mainframes, SDSF and GitHub Actions
tags:
  - github-actions
  - mainframes
---

_GitHub Actions workflows, mainframes and SDSF. I can't get the combination out of my head._

I started my computing adventure at the age of 11 on a minicomputer (see [Computer Unit 1979](https://qmacro.org/2020/11/03/computer-unit-1979/)) and then IBM mainframes featured heavily in the early and formational part of my career. Job definitions, job & step interdependencies, batch job execution and output management are in my blood.

The reliability, predictability, and perhaps even the ceremony of defining a job, submitting it to the right execution class, have it run, at some time, and then poring over the output after execution was finished, is something that still appeals to me. Even in today's world of always-on, I'd like to think that realtime, the ultimate opposite to batch, is in some senses overrated, or at least misunderstood.

All of my career, more or less, has revolved around SAP systems. The R in SAP R/2, which I worked with between 1987 and around 1995, stood for Realtime (and this was the name of the consulting company I joined to launch my career as a consultant / contractor, but that's a story for another time).

**Realtime vs batch**

What did realtime mean here? Well, it meant that human facing processes were exposed via screens, interaction with data was live, it happened there and then. Transactions could be executed directly. What SAP R/2 replaced was a completely batch oriented system where everything ran asynchronously and the idea of screens allowing access to and interaction with business processes was very new. Moreover, these business processes were integrated.

Of course, any SAP Basis person will tell you that while yes there are dynamic programs (dynpros) that allow immediate and interactive access in realtime, the batch concept is still alive and well in SAP systems. It was then in R/2 (with an overnight schedule of tens if not hundreds of interdependent jobs), and it even is today with SAP S/4HANA Cloud, and every other SAP system that is based upon the R/3 architecture. Yes, I'm talking about the batch processes, and even the update processes, that are part of the DISP+WORK design from the early 1990s.

So batch is still alive and well, in fact it never went away.

Moreover, while for very large organisations the mainframe lives on, especially in financial circles, the concept of the mainframe lives on too. [The Eternal Mainframe](http://www.winestockwebdesign.com/Essays/Eternal_Mainframe.html) is a great essay that muses on that and more.

**Realtime vs resilient**

And in today's era, the obsession with realtime seems to be spilling over into the API world, where folks are wanting to interconnect their systems in a loosely coupled way with realtime interfaces. While [loose coupling](https://en.wikipedia.org/wiki/Loose_coupling) is usually the right approach, realtime interfaces are a different beast. In some cases of course, synchronous communication, with blocking, is required. But in many cases it's not.

_What the R should really stand for here is not Realtime, but Resilient._

(I'd like to take credit for this quotable nugget, but I have to attribute it to the person from whom I heard it first - my friend and SAP colleague [Craig Stasila](https://people.sap.com/c.stasila).)

And what does that mean, exactly? Well to me it means not synchronous, but asynchronous. Message (i.e. event) based integration. Message events that are fired by a system, with a payload, managed by a message bus, and received & processed by other systems. We've looked into this a lot on our [Hands-on SAP Dev](https://blogs.sap.com/2020/11/09/an-overview-of-sap-developers-video-content/#shows) show, in particular the [Diving into SAP Enterprise Messaging](https://www.youtube.com/playlist?list=PL6RpkC85SLQCf--P9o7DtfjEcucimapUf) series (SAP's Enterprise Messaging service is now called Event Mesh, by the way).

Embracing & understanding the importance of this asynchronous nature might help folks to think about the nature of batch, too. Not everything needs to be immediate. Not everything must happen as soon as something else happens. If that was the case, then why are we seeing such a massive interest and use of [GitHub Actions](https://github.com/features/actions), which brings the whole idea, and appeal, of batch processing to the masses.

**GitHub Actions and batch processing**

While writing this I've realised that there's another layer to GitHub Actions that adds to the appeal for me. When I first encountered batch processing, at Esso Petroleum at the start of my career, I spent many a happy hour writing Job Control Language (JCL), monitoring jobs, and obsessing over the detail of their output messages. One thing that was almost unspoken in this is that sitting at my silent terminal, I had no idea at the time where the machines were that processed my jobs, what they looked like, sounded like, nor did I have to care. They were looked after by the system operators.

And so it is with GitHub Actions. Unless I'm using self-hosted runners, I have no idea about the machines upon which the jobs defined in my workflows are run. I don't know where they are, whether they're real or virtual, nothing. And as long as I remain within my execution quota, I don't have to care, either. Again, that's someone else's task.

**SDSF for GitHub Actions**

Anyway, I'm not really sure where I'm going with this post. I'd started out with the intention of explaining a little bit as to why, to GitHub Actions product manager [Chris Patterson](https://twitter.com/chrisrpatterson)'s question "If you had one wish for GitHub Actions what would it be?", my answer was:

["SDSF for workflow/job execution and output. Please :-)"](https://twitter.com/qmacro/status/1372578449743826949)

IBM's System Display and Search Facility ([SDSF](https://en.wikipedia.org/wiki/SDSF)) was how I navigated the output from batch jobs that had executed. How I searched, sorted, viewed, printed and purged output. How I found patterns in what was happening in the area for which I was responsible. Using a powerful and classic terminal user interface (TUI) design which fit well with the Interactive System Productivity Facility (ISPF) world where we spent our working hours.

I think I'll leave the explanation for why I think it would suit the GitHub Actions ecosystem, for next time. Until then, I'll leave you with a screenshot (courtesy of [Trent Balta and the IBM Community](https://community.ibm.com/community/user/ibmz-and-linuxone/blogs/trent-balta1/2021/01/28/exploring-zos-through-zowe-zoau-ide-tools)) of SDSF in action.

![SDSF in action]({{ "/img/2021/04/sdsf.png" | url }})
