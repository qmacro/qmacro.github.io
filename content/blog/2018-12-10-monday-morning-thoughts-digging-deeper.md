---
title: "Monday morning thoughts: digging deeper"
date: 2018-12-10
tags:
  - sapcommunity
  - mondaymorningthoughts
description: I think about the tools we use in our day-to-day activities, the feeling I have that I'm just scratching the surface with regards to their capabilities, and what I plan to do about it in 2019.
---

Last week I found myself installing a Vim plugin in order to use a key
feature, in an attempt to streamline my editing workflow. I ended up
being slightly underwhelmed with the improvements, but on reflection,
that was down to the fact that I didn't take the time to read the
documentation and learn properly how to use the plugin. So I ended up
slightly worse off from a workflow perspective, with extra mental and
software logistics baggage (I now had another plugin to think about and
keep up to date) on top. This only added to the feeling that [I've no
idea what I'm
doing](/blog/posts/2018/07/09/monday-morning-thoughts:-curiosity-and-understanding/#another-win-for-curiosity).

I [tweeted](/tweets/qmacro/status/1070232169996414977/) my
thoughts at the time, and they seemed to resonate with folks:

![](/images/2018/12/Screenshot-2018-12-10-at-08.29.26.png)

## Editor usage

While Vim itself is not new to me, many plugins are, so even within the
context of something that is familiar, I have the feeling that my use of
tools is superficial at most. Moreover, I remain a "moderately advanced
beginner" even at Vim itself. That's partly because most people anyway
only tend to use 10% of Vim's power\*, and partly because I oscillate,
or perhaps vacillate, between different editors and IDEs anyway -
sometimes because of context (for example I'll use SAP Web IDE for the
super features it offers with respect to UI5 development) and sometimes
simply because I'm fickle and attracted to shiny things.

This latter reason is why I also use Visual Studio Code, which has
turned out to be a very accomplished and pleasant environment indeed,
and of course for which there is an excellent extension for SAP's Cloud
Application Programming Model. See "[Set up VS Code on Chrome OS for
local Application Programming Model
development](/blog/posts/2018/10/16/set-up-vs-code-on-chrome-os-for-local-application-programming-model-development/)"
for more details on this.

\* I didn't make that statistic up, but I suspect that the person who
wrote that (which is where I got it from) might have done.

## Cloud related tools

The feeling that I'm only just scratching the surface of tools extends
beyond editors. For example, I have used a variety of HTTP client tools
over the years. I started my HTTP journey when I was a big Perl user,
and the GET and POST command-line tools that came as part of the
venerable [libwww-Perl](https://metacpan.org/release/libwww-perl) (LWP)
package (they were just symbolic links to the lwp-request script) were
my go-to tools for making HTTP calls.

![](/images/2018/12/Screenshot-2018-12-10-at-08.46.37.png)

Of course since then I've discovered the perhaps now equally venerable
[cURL](https://curl.haxx.se/), but I also use GNU's
[wget](https://www.gnu.org/software/wget/) (which I extended in script
space at one stage - see this post "[ETag-enabled
wget](/blog/posts/2002/05/24/etag-enabled-wget/)"
from 2002). So in the same way that I flit between editors, I switch
also between HTTP client tools, and invariably have to look up even
basic parameters and switches because they differ from tool to tool.

More recently I've been embracing Cloud Foundry on SAP Cloud Platform,
creating & managing service instances and deploying applications as one
does. I've been doing this mostly through the SAP Cloud Platform
Cockpit (the performance of which has improved nicely recently) which is
very comfortable, but a month or two back I dusted off the command line
tool 'cf' which I'd
[downloaded](https://github.com/cloudfoundry/cli) and tried out briefly
earlier this year.

I knew in theory that everything I was doing in the Cockpit I could do
with the command line tool, so I started to perform basic activities
from the shell. But even today I know that my use of 'cf' is limited,
and so is my knowledge.

Related to the 'cf' command and the artefacts one manages with it,
I'm also acutely aware that while I can get by with a high level
understanding of
[VCAP_SERVICES](https://docs.run.pivotal.io/devguide/deploy-apps/environment-variable.html),
I really don't know that much about how environmental variables are
really managed in this environment, and I should (or want to) have a
much better understanding.

## Programming

And what about actual programming? Well, there are languages and
frameworks that immediately come to mind. Yesterday I was helping out at
[Manchester CoderDojo](https://mcrcoderdojo.org.uk/) [teaching some
JavaScript](/tweets/qmacro/status/1071886022353584128/) to
some youngsters (and enjoying the delight on their faces when they
solved some simple cryptography puzzles programmatically). We managed to
solve the puzzles using some basic procedural approaches, and even
managed to talk about functional approaches, contrasting what we'd
written with how else the problem (or solution) might be expressed.

We finished the session with me showing them a short, single expression
solution to another puzzle. I got them to take it home and research how
it works, knowing that they'd uncover depths of wonder that we didn't
have time for during the day yesterday:

```javascript
input
  .split(/\n/)
  .map(Number)
  .reduce((a, x) => a + x)
```

(Those following this year's excellent [Advent of
Code](http://adventofcode.com) series may recognise this as a solution
to the first puzzle on Day 1).

I'd love to be able to do this with Python too - I know Python and can
certainly survive, and at one stage was able to enjoy speaking various
dialects and styles, but not any more. This feeling extends to other
languages that I've used in the past, too.

I have similar experiences with frameworks such as the Cloud Application
Programming Model. While I understand quite a lot of the basics, there
are depths I have not yet had time to explore, so I feel I am just
scratching the surface of possibilities, especially when it comes to the
rich & expressive [Core Data & Services (CDS)
Language](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/855e00bd559742a3b8276fbed4af1008.html).

## Intention

It's not as if there isn't information out there on the subjects I've
mentioned in this post. Far from it - there's almost too much. But
that's a nice problem to have. So in terms of the core ingredients that
are needed to improve one's knowledge in a given area, that's one
covered already. Another key ingredient is time. Time to think about
what to improve on, time to choose the areas of focus. Time to sift
through the mountains of content out there, working out what's relevant
and what's not, what's contemporary and what's out of date, and what
works best for consumption (documentation, blog posts, videos, and so
on). And time to actually start consuming that information and putting
what one's learned into practice.

I've already started. For example, I've been watching YouTube videos
on Vim and my chosen plugins already, and can feel the bewilderment and
panic start to subside, ever so slightly, as I learn more about what
I'm trying to use on a daily basis. I'm not yet happy with the amount
of time I'm dedicating to practising, but my plan is to overlay a path
on top of the rest of my activities in 2019, focusing in week long
chunks on certain topics. Over the next two weeks I will sketch out that
path, so I won't be constantly making and changing decisions along the
way.

I'm not sure how I'll fare, but that's my intention, at least. One
underlying philosophy that I've just realised is permeating this
intention (it took me over a thousands words in this blog post to
actually realise it) is that I want to avoid, as far as possible,
learning new subjects, and instead concentrate on improving my knowledge
in existing subjects. I've found that in my years in the SAP ecosphere
there are peaks and troughs, of broad then deep periods. I've gone as
broad as I should this year, so next year I want to at least be
consciously influencing a return to depth.

Wish me luck!

---

This post was brought to you by the happy feeling of a good run this
morning, by a nice cup of [Pact Coffee's La
Concepcion](https://www.pactcoffee.com/coffees/la-concepcion) and the
calming purple tones of my [Dracula themed
desktop](/tweets/qmacro/status/1071079866265669635/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-digging-deeper/ba-p/13394293)
