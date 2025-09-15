---
title: "My learning list for 2020"
date: 2020-01-12
tags:
  - sapcommunity
  - learning
---
*Turning the page into a new year is often useful to reflect on the
previous period and look forward to the next one. I usually don't set
hard and fast "new year resolutions" but like some of you out there I
have a general idea of what I'd like to dig deeper into over the next
12 months. Here's some of what's on that list.*

My colleagues Marius Obert and Witalij Rudnicki have already shared
their learning bucket lists for this year, and I thought I'd do the
same. I find it fascinating to see what other people are interested in,
both in how they differ and how they overlap.

## Looking back

Learning is what I do, and 2019 was no exception. While live streaming
still reminds me of the art of plate spinning, I've become more
comfortable with the tech. Along the way of course I've also become
more proficient in some of the subjects we've covered, such as the SAP
Cloud Application Programming Model, OData V4, Business Rules (and other
business services) on SAP Cloud Platform Cloud Foundry, functional
programming and more besides.

That said, I still feel as though [I've no idea what I'm
doing](/blog/posts/2018/10/01/monday-morning-thoughts:-impostor-syndrome/).
But I've learned to accept that - it's part of who I am, and that's
fine.

## Looking forward

<!--https://www.youtube.com/watch?v=hpMiXp8WLvo -->
As James Governor and I talked briefly about in the last part of our
interview at SAP TechEd 2019 Barcelona, I feel quite
strongly that the cloud is forming into what I'm going to call "the
new mainframe", with characteristics such as boundless computing
resources, different forms of compute unit (from serverless through to
VMs, from black box APIs through to software-as-as-service offerings)
and consumption-based billing that I remember from the mid 1980s when we
ran IBM big iron; in this context the billing was internal, but still
measured in a similar way to what we see today.

![](/images/2020/01/Screenshot-2020-01-12-at-18.54.13.png)

But I think the most significant part of all of this is that, for the
most part, the almost infinite power is at our fingertips in two very
simple forms: web browser (i.e. native\*) based GUIs and character
terminals. In other words, the present and future of computing, in my
eyes, is very much mainframe based in that we require very limited
compute complexity on our desktops. This is partly why Chrome OS as a
workstation operating system makes so much sense to me (beyond it also
being more reliable, stable, and secure than anything else I've used).

\**Yes, native. Web is the true native GUI, everything else is merely
OS-specific.*

This is the thinking behind my hashtag-based mantra
[#TheFutureIsTerminal](https://twitter.com/search?q=%23TheFutureIsTerminal&src=typed_query) -
heck, I even have a tshirt that helps me make the point.

![](/images/2020/01/Screenshot-2020-01-12-at-16.12.38.png)

For me the terminal is the ultimate UI. Simple, reliable and pretty much
ubiquitous. And it's built on solid technology that has been around for
as long as I have, so it's stable and well understood. And much of the
headless cloud computing power we have runs natively on Linux where
remote terminal access is the obvious choice.

Add to this the scriptable nature of command line interfaces (CLIs) and
application programming interfaces (APIs), combine it with some shell
magic (such as bash or zsh) and you have a wonderful environment in
which to work, and that is accessible from pretty much anywhere and from
any device, [even Windows-based
devices!](https://blogs.sap.com/2020/01/03/spice-up-your-windows-terminal/)
😉 Joking aside, you may also be interested to listen to a reading aloud
of [Scott Hanselman](https://www.hanselman.com/)'s post on consoles,
terminals & shells: [What's the difference between a console, a
terminal, and a
shell?](https://anchor.fm/tech-aloud/episodes/Whats-the-difference-between-a-console--a-terminal--and-a-shell----Scott-Hanselman---20-Sep-2019-e5qbdu)

![](/images/2020/01/2310259-1568661278810-bf47ea92c8b6-1.jpg)

So some of the items that I'd like to dig deeper into and learn more
about this year are a result of this way of looking at computing, both
in business and as a hobby.

## Part 1 - Understanding core things better

And so to the list, where I begin with a category that contains
important generic topics that I know something about already, but not
enough.

Too often I hack around with core services and utilities on the command
line, and find myself googling how to do simple things, instead of
reading the manual (the man pages that are automatically available right
there in the terminal environment) and building up a more solid and long
lasting understanding.

An example this weekend was the [Secure
Shell](https://en.wikipedia.org/wiki/Secure_Shell) (SSH), which I was
using without knowing as much as I feel as though I should do. I [hacked
around with
configuration](/tweets/qmacro/status/1216384864800387078)
(`ssh_config` and `sshd_config`, if you're interested) until I got things
working. But I knew that I was really just doing the equivalent of
thrashing around until things stopped being broken.

Another related example is the vast [X Windows
System](https://en.wikipedia.org/wiki/X_Window_System), which, while
pretty old, still works well and reliably, and compliments the terminal
environment nicely. I have a fondness for X which is a little arcane,
but hits that sweet spot for me in being both interesting as an old set
of technologies to dig into as a hobbyist (or perhaps a computing
archaeologist) and useful as tech that still works today. X is perhaps
as relevant now in the new mainframe era as it ever was. I have an old
book that I've taken from my shelves that I'd like to dig into for
this.

![](/images/2020/01/IMG_20200112_151618.jpg)

So SSH and the X Windows System are just two technologies that I'd like
to understand better. But that's only the tip of the iceberg. In the
same vein, I'd like to grow my understanding of Cloud Foundry and have
the [CF CLI](https://docs.cloudfoundry.org/cf-cli/) be second nature to
me. Similarly with [Ansible](https://www.ansible.com/), which I used
recently for the first time to manage the Raspberry Pi cluster I set up
with my son Joseph to eventually run a local Kubernetes cluster.

## Part 2 - New technologies

And so we come to the second part of the list, of technologies that are
mostly new to me, but ones that I see will play an important part in the
new mainframe era future.

With that, [Kubernetes](https://kubernetes.io/) is in first place (this
is why I built the cluster over the holiday period), as a specific
example of a more general topic that represents containerisation.

![](/images/2020/01/IMG_20200103_132947-1.jpg)

This covers virtualisation in the form of virtual machines (VMs), but
more specifically [LXC](https://en.wikipedia.org/wiki/LXC) powered
containers and related technologies such as
[Docker](https://www.docker.com/) (if you want to learn more about
Docker, Witalij Rudnicki has a nice series "[Understanding
Containers](https://community.sap.com/t5/tag/UnderstandContainers/tg-p)" here on
the SAP Community).

I guess there's an irony in the title of this part of the list ("New
technologies"), in that none of them are really new - the mainframe
operating systems that I used in the 1980s ran on virtual machines way
back then, specifically I remember that the MVS/XA and MVS/ESA operating
system environments were actually hosted on
[VM/CMS](https://en.wikipedia.org/wiki/VM_(operating_system)) which
dates back to the 1970s.

One thing that is relatively new, in terms of being available, is
[GitHub Actions](https://github.com/actions) which is one of the
building blocks that has been released on the platform since Microsoft
took over, and is one of the things that has helped cement my thoughts
about the cloud being the new mainframe. I've dabbled already with
GitHub Actions, having built [an action to auto-assign a new issue to a
specific
project](https://github.com/qmacro/action-add-issue-to-project-column)
(and I use this action every day), in an attempt to get my head around
the concepts, but I'd like to extend my knowledge here too.

## Part 3 - Language and expression

It's no secret that I am a big fan of the functional programming style.
This is something I want to dig into more this year, and move closer
towards a more natural, second-nature understanding of some of the
concepts that this style embraces and enables. I'd like to dig even
more into [Ramda](https://ramdajs.com), the functional programming
library for JavaScript, and its companion library [Ramda
Adjunct](https://char0n.github.io/ramda-adjunct/2.23.0/).

Along the same lines as others such as mariusobert and helmut.tammen2
I'd like to look more into
[TypeScript](https://www.typescriptlang.org/) too, pretty much for
similar reasons. I've long been a user of dynamically typed scripting
languages but my journey into functional programming has taught me the
benefits of strong typing and type systems generally. And it's just
JavaScript underneath, which helps a lot.

## Part 4 - SAP technologies

There's no particular reason why this part is at the end; as you might
have guessed, everything on my list so far is to help my working life in
the SAP world. As SAP has moved more and more towards embracing open
standards and technologies, it's natural that the overlap between SAP
and non-SAP topics is getting larger and larger all the time.

I'm particularly looking forward to diving deeper into the [Cloud
SDK](https://developers.sap.com/topics/cloud-sdk.html), and how to use
that, along with services on SAP Cloud Platform generally, to build upon
existing "brownfield" installations. This of course means using lots
of different technologies together, combining the [API
Hub](https://api.sap.com/) as a directory for available services, Cloud
Foundry as the deployment target platform, using the [Extension
Factory](https://blogs.sap.com/2019/05/07/now-available-the-sap-cp-extension-factory/)
(and, by association, [Kyma](https://kyma-project.io/)).

Not to mention keeping my brain sharp on all things
[CAP](https://cap.cloud.sap/). Because we shouldn't forget, that [CAP
is important, because it's not
important](/blog/posts/2019/11/06/cap-is-important-because-it's-not-important/).

## Wrapping up

So there you have it. If nothing drastic changes, this is the learning
trajectory that I hope to keep myself following. One thing is for
certain, and that's I'm looking forward to learning and sharing,
whatever the topic.

See you [online](https://bit.ly/handsonsapdev)!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/my-learning-list-for-2020/ba-p/13453862)
