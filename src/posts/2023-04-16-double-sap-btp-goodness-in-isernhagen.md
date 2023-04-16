---
layout: post
title: Double SAP BTP goodness in Isernhagen
date: 2023-04-16
tags:
  - codejam
  - isernhagen
  - btp
  - btpcon
---
I'm on my way home from a great double event that took place this week at [Inwerken AG](https://www.inwerken.de/) in Isernhagen, just outside of Hannover. The overarching theme was the SAP Business Technology Platform.

On Thu 13 Apr we had an all-day SAP CodeJam [Hands-on with the btp CLI and APIs](https://groups.community.sap.com/t5/sap-codejam/hands-on-with-the-btp-cli-and-apis-isernhagen-de/ev-p/224169), and on Fri 14 Apr, at the same location, there was the first ever public conference all about SAP BTP: [BTPcon 2023](https://www.btpcon.org/). It made a lot of sense to run the two events next to each other; we got a lot of crossover conversation and attendance of both events from many folks.

## Hands-on with the btp CLI and APIs (CodeJam)

Having arrived in Hannover on Wednesday evening, I made my way on the tram (A3 to Altwarmbuechen) to Isernhagen and Inwerken's offices. Inwerken were the kind hosts (spearheaded by SAP Community member Sascha Seegbarth) and provided us with a warm welcome:

![A sign welcoming us to the CodeJam location](/images/2023/04/codejam-welcome-sign.jpg)

They also had set up a great space to network and get down to business working through the CodeJam content, and this soon filled up with CodeJam attendees eager to get started:

![CodeJam attendees in the main room](/images/2023/04/codejam-room-and-attendees.jpg)

One of the folks that came along, Matthias, was sporting his stickers (made by another SAP Community member, the great Ronnie Sletta) from our [Hands-on SAP Dev](https://www.youtube.com/playlist?list=PL6RpkC85SLQABOpzhd7WI-hMpy99PxUo0) live stream show. Go Matthias!

![Matthias and the stickers on his laptop](/images/2023/04/matthias-and-stickers.jpg)

I was accompanied by fellow Developer Advocate Nico Schoenteich who joined up with me to run the CodeJam and help folks out, which was a welcome additional pair of safe hands, not to mention a great chance to work alongside one of my team mates. Thanks Nico!

The CodeJam proceeded and everyone successfully worked through all of the exercises. Again, one of the highlights, at least for me, were the discussions we had at the end of each exercise, before starting the next. There were some great questions and even more valuable opinions and thoughts shared all around. If you're interested in learning more about this particular CodeJam, head over to the [main README](https://github.com/SAP-samples/cloud-btp-cli-api-codejam/blob/main/README.md) where there's a general overview and also a list of the exercises.

## BTPcon 2023

On the following day there was [BTPcon](https://www.btpcon.org). Organised by Sascha and some great folks behind the scenes, this was a superb event. There were two types of sessions: hands-on sessions (150 minutes long) and talks (45 minutes long) and there was so much on offer that there were two tracks throughout the day:

![BTPcon sessions](/images/2023/04/btpcon-sessions.jpg)

You can get a feel for the depth and quality of content by taking a look at the [programme on the BTPcon website](https://www.btpcon.org/). I enjoyed all of the sessions I attended, and the atmosphere was great. It's how conferences should be - a mixture of great technical content, interesting Q&A, and spontaneous corridor conversations where experiences and ideas were exchanged.

I was very grateful to get a speaking slot, for which I thank Sascha and the BTPcon organisers. I spoke about the [Swiss Army Chainsaw](http://www.catb.org/jargon/html/S/Swiss-Army-chainsaw.html) of the JSON world, [jq](https://stedolan.github.io/jq/), the "lightweight and flexible command-line JSON processor" which just happens to be a very capable, Turing complete functional language.

In today's world of the cloud, which everyone knows is just Linux boxes glued together with JSON and shell scripts, having the power to handle JSON like a boss is super important. Even if you're not fully in the cloud, JSON abounds too - in representations of resources pulled and pushed with APIs, events and more.

![giving my talk at BTPcon](/images/2023/04/dj-jq-talk.jpg)
_Image courtesy of Enno Wulff_

My talk consisted of me waving my arms about a lot, rambling, and working through example JSON scenarios and slicing through the JSON precisely with `jq`.

I wrote the talk in the form of a document which more or less reflects what I said, and along with that document I've made the samples JSON files available, plus a Docker container description that you can use to build a container image which containing those files, with `jq` and `ijq` with which you can use to try out all the examples and follow along at home. Head over to the [qmacro/level-up-your-json-fu-with-jq](https://github.com/qmacro/level-up-your-json-fu-with-jq) repo for everything I talked about and showed.

My talk also consisted of me wearing flip-flops which seemed to amuse some folks :-) I'd left my outdoor shoes (and socks) outside while the conference proceeded, but during my talk it started to rain heavily, soaking everything! Luckily, SAP Community member Enno (who was also one of BTPcon's co-organisers) was giving out SAP Inside Track Hannover swag, which included socks, which I gratefully accepted!

![putting on dry socks](/images/2023/04/dj-socks.jpg)
_Image courtesy of Enno Wulff_

## Wrapping up

It was a great two days, thanks not in a small part to Sascha and his colleagues at Inwerken, and of course to the CodeJam attendees and the conference attendees & speakers.

I hope that we can see a repeat of BTPcon next year!

And if you want to request a CodeJam, head over to Tom Jung's post [So, You Want to Host a CodeJam! Everything you need to know](https://groups.community.sap.com/t5/sap-codejam-blog-posts/so-you-want-to-host-a-codejam-everything-you-need-to-know/ba-p/221415).

