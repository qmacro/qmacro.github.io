---
layout: post
title: "Monday morning thoughts: containers and silence"
date: 2018-05-07
tags:
  - sapcommunity
  - mondaymorningthoughts
---

*In this post I think about the silence of workstations and what that
represents to me, and the new ability to look at maintaining software
and services in a completely different way - via containers.*

Another Monday morning is upon us, and it's a public holiday here in
England. But I wanted to publish a new set of thoughts, related to what
I've written about previously. Not least because I know that there's
[at least one
person](https://twitter.com/JuliePlummer20/status/991215288925507584)
going to read them (thanks julie.plummer).

In a previous post ([Monday morning thoughts: upload/download in a cloud
native
world](/blog/posts/2018/04/16/monday-morning-thoughts:-upload-download-in-a-cloud-native-world/))
I described the sort of devices upon which I started my mainframe-based
career in computing. A common factor was that those devices I used to
interact with were dumb. But there's another common factor, that
extends further back in time - to my first personal computer, an [Acorn
Atom](/blog/posts/2005/11/26/acorn-atom-and-my-start-in-computing/).

![](/images/2005/11/atom.png)

## Silence is golden

This common factor was the lack of any discernible noise from the
devices themselves. OK, the paper printer terminal made noise when it
printed, but that's understandable. Silence resounded loudly at my desk
in my bedroom at home, and in the office at work. There weren't enough
electronics under duress in the dumb terminals to warrant any active
cooling with fans, and while the 8-bit 6502 processor inside the Atom
might have got a little warm sometimes, again, it was silent as there
were no fans.

And so I was reminded again of these times as I spun up a new virtual
machine (VM) running a [Container-Optimised
OS](https://cloud.google.com/container-optimized-os/docs/) on the Google
Cloud Platform (GCP). My work-based workstation runs macOS, but really
all I run is Chrome and a number of terminal emulation windows. So
there's really no real stress on the MacBook at all, and no reason for
a fan to kick in.

Yes I do run Outlook and its brethren, but only under duress and shut
them down again as soon as I can. The real work (i.e. [not
email](/blog/posts/2017/08/30/things-i-do-to-make-my-work-life-better/))
happens elsewhere - in this case while connected, via Secure Shell (SSH)
to that new VM. Just characters on an emulated terminal screen, and the
only idea I could have of how much stress that machine is under is by
actively looking at the output of a command such as
[top](http://man7.org/linux/man-pages/man1/top.1.html).

For the most part, then, the only sound I can hear while working is the
clicking of the keyboard. Almost like the idea that [the only sound you
can hear while driving a Rolls-Royce is the electric
clock](http://swiped.co/file/rolls-royce-ad-by-david-ogilvy/).

## Container shaped spectacles

When I'm connected to my remote virtual machines, what am I doing?
Well, let me answer that by talking about a project upon which I've
embarked, to kill two birds with one stone - move my core presence on
the web (my [homepage](https://qmacro.org), my [main personal
blog](https://qmacro.org/blog/), and various processes that run
in the background) to a container-based setup, and learn more about
containers.

My presence on the web is where it has been, at least virtually, for as
long as I can remember - at pipetree.com. My old friend and
colleague Piers Harding and I pooled our resources way back when and
built & brought a server of our own round nearly 20 years ago to a
colocation facility in Fulham, London.

![](/images/2018/05/Screen-Shot-2018-05-07-at-06.50.07.png)

It ran GNU Linux (hence the sticker on the machine, to help identify it
amongst the hundreds of others in the facility). I guess the concept of
colocation is now outmoded, but I like to think of it in the
"as-a-service" stack like this:

          Software-as-a-Service
                   |
          Platform-as-a-Service
                   |
           Backend-as-a-Service
                   |
    Infrastructure-as-a-Service
                   |
        Colocation-as-a-Service   <---

Since then we've moved out of the facility, I took over pipetree.com as
a domain (Piers now has his own presence) and the server is now virtual,
running at [Linode](https://www.linode.com/). But the software has
remained largely the same. A proper OS (i.e. Linux), various
distributions, and various re-installs to try to maintain a clean
environment.

And there's the thing. It's been a given that the install processes
for software over the years, and my amateur hand in maintaining that
installed software, makes for an untidy setup. Especially when it comes
to experimenting with new services, with their myriad requirements and
dependencies, not to mention their install tools (which have their own
requirements and dependencies - it is indeed [turtles all the way
down](https://en.wikiquote.org/wiki/Turtles_all_the_way_down)).

So the heap of software installed on the pipetree.com VM is not clean
and tidy; rather, it's a bit of a mess. It's effectively a production
server, but I don't really run it as if it were, certainly not in terms
of knowing what's going on. I've installed stuff, and then decided
that what I'd installed was not what I'd wanted. I'd set something up
but then realised I could have set it up differently, and have used
various tools (sometimes through simple ignorance, sometimes through
necessity) that have left a sticky, glistening snail trail of bits that
make me slightly uncomfortable.

With the advent of the concept of containers, and particularly with
[Docker](https://www.docker.com/), that can all change. Instead of
interleaving various software services on my VM (MySQL databases, a
NodeJS-based blogging system, the Apache HTTP daemon, a
[Planet](https://en.wikipedia.org/wiki/Planet_(software)) system, and so
on), I can now look at these installations and services through a new,
modern pair of spectacles that are not
[rose-tinted](https://idioms.thefreedictionary.com/rose-tinted+spectacles),
but [container](https://www.docker.com/what-container)-shaped.

I can run each service in its own container, and have an immediate and
effective isolation, not only of runtime, but also of dependency.
What's more, I can run multiple instances of these services, and, from
a web presence perspective, expose them through yet another service
that's [nginx](https://www.nginx.com/)-based, in a reverse-proxy
formation. It makes total sense, and allows me to feel calmer about what
I'm installing on my host, because the install itself is not like a
real install - it's merely the instantiation of an image where the
install process has already been completed, with the complexities of
dependencies already resolved and everything set up as it should be. All
I'm doing is bringing to life a container - an image - where the inner
structure and workings are isolated and not leaking across to other
parts of the host.

What I'm doing with Docker and these containers is installing small,
single-purpose VMs on my general purpose VM.

But the best thing? It's the cheap and fast nature of everything
that's going on here. While setting up, I can instantiate a Docker
container from an image that has to be fetched\* from the
[hub](https://hub.docker.com/) in a matter of seconds. On realising that
I have set the container up incorrectly, or messed up the contents that
would normally take a significant effort to fix, I can simply stop and
destroy that container and do it again, in the safe and happy knowledge
that I'm not leaving a snail trail behind me.

\*I think I might use the term "fetch" instead of "download", as
suggesting a sort of horizontal action, rather than a vertical one, it
makes much more sense in the cloud native world.

The [ephemeral
aspect](/blog/posts/2018/04/09/monday-morning-thoughts:-a-cloud-native-smell/#the-cloud-native-smell) of
cloud native artifacts, such as containers, means that it is natural to
create and destroy resources with almost reckless abandon. Well, perhaps
not quite reckless. But it lets us see software and services, that
we're increasingly maintaining and running in the cloud, through our
silent character terminals (or web-based UIs, if you're that way
inclined) as a different unit of measure, a different way to slice and
manage what we're building and deploying. We can stop caring as much
about the load on our workstation, as there should be very little.
Likewise, we can stop worrying as much about the installation process
and the ramifications of getting the services on our VM where we want
them to be. All we do is type characters on a modern green screen, and
let the invisible, distant machines do the heavy lifting.

And that, to me, is a good thing. What do you think?

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-containers-and-silence/ba-p/13359185)
