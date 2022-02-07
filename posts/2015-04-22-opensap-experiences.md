---
layout: post
title: openSAP Experiences
tags:
- opensap
---


(Please [see the update](#opensapupdate) from later the same day as I posted this, at the bottom.)

Don’t get me wrong, the openSAP initiative is excellent, free learning materials of high quality? Yes please and thank you! This instills a passion in me (and I’m sure many others) for (a) learning more and (b) trying to attain the highest achievement. In the case of openSAP, this means trying to attain high marks in the assignments.

Unfortunately, the question and answer sections of the weekly assignments sometimes get in the way of that, in that the questions and / or answers are ambiguous. The current openSAP course “[Build Your Own SAP Fiori App in the Cloud](https://open.sap.com/courses/fiux1/)“, has great content but the questions are dubious. Here are a couple of examples, that we’re [discussing on Twitter right now](https://twitter.com/qmacro/status/590774440969031680):

In the assignment for Week 2, there is the following question, with the 4 possible answers thus:

*Within the context of SAP HANA Cloud Platform, where do applications run?*  
*(a) In the HANA Database*  
*(b) Inside the cockpit*  
*(c) In an SAP HANA Cloud Platform account*  
*(d) On the SCN community page of SAP HANA Cloud Platform*

The officially correct answer has been marked as (c). But an account is not somewhere where code can be ***run***. It’s not an execution environment. It’s an accounting, configuration, billing artifact. It’s the credentials, the units of computing allocated and allowed, it’s the sets of permissions for access to features and subscriptions and so on. It’s not an execution environment. So there’s no way that anything can ***run***in the SAP HCP ***account.*** The nearest correct answer as far as I could see is (a). But that’s not entirely accurate. However, the ambiguity of this question and the possible answers force me to choose “the nearest that makes sense” which is (a), as (c) can certainly *not* be correct.

Another example is in the assignment for Week 3, where there’s the following question and 4 possible answers:

*Which end-to-end application development phases are currently supported by SAP Web IDE?*  
*(a) Prototyping, developing, testing, deploying, and extending*  
*(b) Requirements management, prototyping, developing, testing, deploying, and extending*  
*(c) Prototyping, developing, functionality testing, A\B testing, deploying, and extending*  
*(d) Developing, testing, deploying, and extending *

The officially correct answer has been marked as (d).

The official download materials for this week contain, as usual, a complete transcript of all the units, the slides, and the videos. This is great in itself. Unfortunately, the official transcript records exactly what the instructor said, which is (starting at 00:02:22, bold emphasis mine):

*And we do so by **covering the end-to-end application development lifecycle with one tool. And when we refer to the end-to-end application lifecycle development, we start from the prototyping of the application**, then the development, the testing on the different devices of course, the packaging and the deployment into different application landscape and then later on after we released the application, also the extension of the application in order to customize it and make it suitable for the different scenarios and**customers. *

The slide related to this section looks like this:

![image]({{ "/img/2015/04/Screenshot-2015-04-22-at-08.35.41.png" | url }})

See that tiny couple of words in a footnote in the bottom left? They say “*future innovation”. The instructor didn’t mention this, so if you didn’t see the slide or were watching on your smartphone (which I was) where it was too small to see, but were nevertheless intensely listening to her, and then reading the transcript to double check the facts, you would not have noticed this.

Now call me old fashioned, but if the transcript says that prototyping is supported, then I take it that prototyping is supported. But I don’t just take the transcript’s word for it … **I do prototyping** in the SAP Web IDE. I don’t use the Powerpoint-based kit, I build simple views in XML either by hand in the coding editor, or sometimes with the layout editor. So practically speaking, the SAP Web IDE does support prototyping, regardless of what is or is not said.

The challenge is not the course itself, the content, as I said, is great. The challenge is setting clear questions with unambiguous answers. Here are two occasions (and there have been others, on other openSAP courses in the past) where this is not the case.

I’m passionate about learning and sharing knowledge, and being the best I can be. Something like this where incorrect answers are given as the officially correct answers, does make me somewhat sad.

But one thing’s for certain: If you’re reading this and not participating in the course, head on over there right now and catch up with these great learning opportunities!

[]()**Update 21:30 on the same day:**

Now this is worth shouting about. Around 3 hours after I took part in the discussions on Twitter this morning and published this post, the regular weekly “Welcome to Week N” email arrived in my inbox as usual. But what was special was this section:

<span style="text-decoration: underline;">*Weekly Assignments: Problematic Questions in Weeks 2 and 3*</span>*Week 2: Within the context of SAP HANA Cloud Platform, where do applications run?**Week 3: Which end-to-end application development phases are currently supported by SAP Web IDE?**In both these cases, we realized that the questions were slightly misleading. You can **find more information on the discussion forums for weeks 2 and 3. To ensure fairness toall our learners, we will assign full points for these questions to all learners who took the weekly assignments. Your scores will be adjusted at the end of the course.*

This is the openSAP team directly and pretty much immediately addressing our concerns and worries, *within a few hours*. I cannot commend the openSAP team enough for this. Not primarily for addressing the issue (issues arise in all manner of contexts, that’s normal), but for being ultra responsive and in touch with the participants of the course *directly*.

Other MOOCs, heck, other educational institutions in general, please take note. **The openSAP team shows how it’s done**.


