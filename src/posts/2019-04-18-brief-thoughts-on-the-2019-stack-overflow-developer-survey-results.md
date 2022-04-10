---
layout: post
title: First thoughts on the 2019 Stack Overflow Developer Survey results
---

I've just finished perusing [this year's Stack Overflow Developer Survey results](https://insights.stackoverflow.com/survey/2019) and have some initial observations. Nothing earth shattering, and of course you will likely have other observations. Moreover, with anything like this, my thoughts are probably not neutral, as I'm looking for patterns to back up how I see the world.

These survey results are of particular interest to me in my developer outreach & advocacy role within the [SAP Developer Relations](https://developers.sap.com) team, especially now that I've had just over a year to settle in and find my feet. Another document I'm looking forward to reading is hoopy.io's [State of Developer Relations 2019](https://stateofdevrel.hoopy.io/) report, which I hope to get to next week.

Ok, so here goes. I'm picking out particular results as and when they pique my interest, in particular from the [Developer Profile](https://insights.stackoverflow.com/survey/2019#developer-profile) and [Technology](https://insights.stackoverflow.com/survey/2019#technology) sections. By the way - kudos to the producers of this report in making every section and subsection linkable and referenceable - this is a well put together hypertext document!

**[Developer Type](https://insights.stackoverflow.com/survey/2019#developer-profile-_-developer-type)**

I didn't see the survey itself (otherwise I would have probably completed it as well) but I'm curious about how they asked the question that differentiated developer types listed here. I'm guessing it wasn't just a "pick one", partly from the accompanying text for this section, and partly because what jumps out is that "enterprise developer" is separate from other types such as full-stack, back-end, front-end and so on.

I'm an enterprise developer *and* a back-end developer (and sometimes a front-end developer of course too). I don't see how this distinction adds value, unless it's to show "of the respondents, X% identified as working in the enterprise software context,  *as well as expressing their actual developer type*".

**[Years Coding Professionally](https://insights.stackoverflow.com/survey/2019#developer-profile-_-years-coding-professionally)**

What struck me here was the comment in the accompanying text: "Developers who work with languages such as VBA, F# and Clojure" have the most years of professional coding experience".

This came as quite a surprise - I would have expected to see perhaps Java in this list (some say Java is the new COBOL). I can understand seeing VBA there but certainly not the two functional languages F# and Clojure, which no-one is going to claim are mainstream. That said, they are both wonderful ... I've been exploring them both over the last couple of years - see my other blog [Language Ramblings](https://langram.org) for some posts on that subject.

Note that later on we see also that Clojure and F# are number one and number two in the list of [Top Paying Technologies](https://insights.stackoverflow.com/survey/2019#top-paying-technologies)!

**[Undergraduate Major](https://insights.stackoverflow.com/survey/2019#developer-profile-_-undergraduate-major)**

I'm not surprised at what these results tell us here, but I am a little disappointed. Being a Classics (Ancient Greek, Latin, Sanskrit, Philology) graduate I guess I must put myself into the "humanities discipline" category which makes up a mere 2.1% of the respondents.

I know I'm in the minority with my degree, but didn't expect the minority to be that small!

**[Other Types of Education](https://insights.stackoverflow.com/survey/2019#developer-profile-_-other-types-of-education)**

The text that accompanies the results in this section starts with "Developers are lifelong learners". That resonates very much with me; when people ask what I do, I often say "I learn". See the section [Trying to keep up](https://blogs.sap.com/2018/10/01/monday-morning-thoughts-impostor-syndrome/#tryingtokeepup) in my [Monday Morning Thoughts](https://blogs.sap.com/tag/mondaymorningthoughts/) post on [impostor syndrome](https://blogs.sap.com/2018/10/01/monday-morning-thoughts-impostor-syndrome/) for more background on this.

If I were feeling bold, perhaps I'd go so far as to say that if you're not learning, you're not a developer.

**[Social Media Use](https://insights.stackoverflow.com/survey/2019#developer-profile-_-social-media-use)**

The accompanying text here suggests that in the non-developer world, Reddit doesn't even appear in the top ten list. In this list, it's at number one. Why? I'd say because it's the new [Usenet](https://en.wikipedia.org/wiki/Usenet) which is where a lot of developers discussed low level detail and esoterica about development topics with like-minded individuals. Usenet (and NNTP) isn't really a thing these days, and Reddit has taken over where it left off.

As a developer, [I use Reddit](https://www.reddit.com/user/qmacro) to follow nerdy discussions for some of my areas of interest including Mechanical Keyboards, Twitch, Vim, i3wm, ChromeOS and Crostini.

<a name="languages"></a>**[Programming, Scripting, and Markup Languages](https://insights.stackoverflow.com/survey/2019#technology-_-programming-scripting-and-markup-languages)**

(That ugly second comma in the section title is from the original results page, not me!)

It's not a secret that I am a fan of JavaScript as a language, for many reasons - it's available for use in both front-end and back-end development contexts, it's a flexible multi-paradigm language that is evolving nicely, it is accessible and easy to get started with, and (warning, controversial!) the lack of a type system helps rather than hinders. Not in every context, but in many.

So I'm happy (but not surprised) to see JavaScript in first place in the "most popular / most commonly used" list here. It's also held this top spot for seven years in a row.

This gives me confidence to continue on my trajectories (with live streaming, blogging, CodeJams and so on) with JavaScript as a backbone language.

Further results in this section show that JavaScript is also the second most wanted language, just behind Python.

Talking of JavaScript on the back-end, it's also not surprising to see Node.js (backend JavaScript, essentially) at the number one spot on the list of most popular [other frameworks, libraries and tools](https://insights.stackoverflow.com/survey/2019#technology-_-other-frameworks-libraries-and-tools). Not only that, but Node.js is  it's certainlalso top of the list of most wanted other frameworks, libraries and tools.

Go JavaScript!

**[Most Loved, Dreaded, and Wanted Platforms](https://insights.stackoverflow.com/survey/2019#technology-_-most-loved-dreaded-and-wanted-platforms)**

Talking of most loved and wanted, it tickles me to see that Windows doesn't even make the top ten list of most loved platforms. But it's certainly up there (along with WordPress, Watson, Heroku and Arduino) in the top five most dreaded. I wonder why that is?

**[Most Popular Development Environments](https://insights.stackoverflow.com/survey/2019#technology-_-most-popular-development-environments)**

Top of the list here, from all respondents, is Microsoft's [Visual Studio Code](https://code.visualstudio.com/). And for good reason, it's a great piece of software that works really well for me and many developers.

I think it's fair to say that over the years, some editors have come in and either stayed or gone out of fashion. Restricting myself to "local" editors and IDEs, ones that come to mind in this context are TextMate, Sublime Text and Atom. Of course, many developers still use those, but the IDE du jour, without a doubt, is Visual Studio Code.

I'm happy to say that SAP have an extension for it, to help developers build apps with the [SAP Cloud Application Programming Model](https://blogs.sap.com/2018/10/10/application-programming-model-start-here/). Go to the [SAP Development Tools - Cloud](https://tools.hana.ondemand.com/#cloud) page and look for the CDS Language Support for Visual Studio Code extension.

Some of you may know that my long-term love is for Vim, that masterpiece of philosophy, design and implementation that has been around for a very long time. And it's heartening to see Vim at fifth place in this particular list, above Sublime Text, Atom, TextMate, Eclipse and of course above Emacs :-)

One notable entry in the list, even though it's in last place (but it's *on the list*) is [Light Table](http://lighttable.com/), a fabulous reimagining of an editor by Chris Grainger, which I learned about in my Clojure adventures. You can see Light Table in action in some of the videos from [Misophistful](https://www.youtube.com/user/Misophistful) from whom I learnt stuff about Clojure.

---

That's it for now - perhaps I'll write down some more thoughts about the results in the other sections of the survey. But for now, it's time for a beer (and another look at my Clojure books). Cheerio!



