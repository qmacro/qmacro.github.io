---
title: From Twitter to Mastodon
date: 2023-12-20
tags:
  - twitter
  - mastodon
  - microblogging
  - fediverse
---
I'm moving off X (Twitter) at the end of this year. I've been thinking about doing it for some time, and while it's fairly arbitrary, I decided that the end of 2023 would be the end of my activities on that platform. 

There are a few reasons why, and some folks may be wondering. So here are those reasons, briefly.

## Centralised vs federated

I have been around a long time, taking my first nervous but excited steps onto the Internet back in the days of dial-up, via Compulink Internet Exchange (aka [CIX](https://en.wikipedia.org/wiki/CIX_(website)), a very early Internet Service Provider in the UK). I enjoyed access to email, newsgroups (on Usenet) and various resources made available via Gopher and Wais. Those were the days (late 1980s / early 1990s) before the Web, and so I've also seen the Web from its infancy, in all its various guises as it's transitioned to where we are now, which consists of -- for many folks -- a small number of central services owned by very large organisations.

Back in the day, we ran our own websites, maintained and posted on own weblogs, grew ad hoc federation via simple webrings, [linkback](https://en.wikipedia.org/wiki/Linkback) mechanisms, RSS (and latterly Atom) feeds and more. They were happier, simpler times, bursting with potential, and times where we had more ownership, control & responsibility for our own content and how it connected to other content.

To that point, while I've been blogging for decades (on [my own blog](https://qmacro.org/blog/)), I was also "microblogging" on another platform before I hopped onto Twitter in early 2007. That platform was [Identica](https://wiki.p2pfoundation.net/Identica). And it was open and federated. 

The attraction of the federated nature of Identica is here again, and much stronger, with the [Fediverse](https://en.wikipedia.org/wiki/Fediverse), "_an ensemble of social networks which can communicate with each other, while remaining independent platforms_". There's a standard, an open decentralised social networking protocol, called [ActivityPub](https://en.wikipedia.org/wiki/ActivityPub), which powers this open interconnectivity, and Mastodon is a microblogging platform that supports ActivityPub and plays nicely in this (relatively) new exciting world.

> Incidentally, a co-author of ActivityPub, Evan Prodromou, was a key actor in the creation of Identica and the technology behind it.

## The developer angle

For me, Twitter's API story has been complex and beset with change. At heart I'm a tinkerer, a builder, a hacker (in the proper sense of the word), a developer. So an API to a platform I use is an important aspect that makes that platform more attractive to me. Perhaps worse than a platform that has no API to begin with is a platform that had a great API ... which then eventually is made unavailable for most folks.

That's what's happened with Twitter. That not only kills off any cool integrations and hacks, but it also suppresses any thoughts or interest in building more stuff too. As a developer, I feel that my content and interaction on the platform is no longer wanted. I'm fine with that, it's not my platform. But it also means I don't have to stay.

> One example of a very simple integration that I use already on Mastodon is a mechanism that toots notes on, and the URLs for, articles I read and find interesting. Here are a couple of examples, [on a post about an e-reader setup](https://hachyderm.io/@qmacro/111222914866332574) and [on tools and how we maintain them](https://hachyderm.io/@qmacro/111573647402350578).
>
> I used to have that running on Twitter, but because of the suppression of innovation and the removal of access to the API, that doesn't work any more on that platform. If you're interested in seeing this simple mechanism, see [the GitHub Actions workflows in my URL notes repository](https://github.com/qmacro-org/url-notes/tree/main/.github/workflows).

Not only does Mastodon have an open API, but the potential with ActivityPub is enormous, too.

## Control and usability

I was a big user of Tweetdeck, which gave me a great way to organise my consumption of, and interaction with, content on Twitter. With the recent changes, that access to Tweetdeck has gone. Moreover, my timeline is blurred with adverts, and content that is "suggested" to me, in an order that is sometimes confusing too.

With Mastodon, things are simpler, more straightforward, and not polluted with stuff for which I didn't ask.

A side effect of what's happened to timeline content on Twitter, and how it compares with the equivalent on Mastodon, is that the contrast between the two platforms, and how personal and friendly they are, has been accentuated for me. Yes, that is partly due to the smaller numbers of folks on Mastodon, and the fact that those that are there -- the early adopters -- are perhaps more concerned with growing the platform organically and in a fashion that conveys and encourages friendship and kindness.

## Politics and world topics

While I haven't personally been exposed to much of the less savoury content on Twitter, it is by all accounts not only very much there, but growing and becoming ever more vitriolic in some corners. 

Perhaps that's an unavoidable side effect of Twitter being a single, gigantic, central, ungoverned (or ungovernable?) platform. Ultimately the hate comes from humans that are on it, not the platform itself. But that is only half the story, and I don't have the direct experience, or the authority, to talk more about this. Suffice it to say that while it's not been the _main_ factor influencing my decision, it has been a factor.

## Summary

So there you have it. I wasn't sure what I was going to write in this post; I just opened up my editor and started typing. And it seems that on the whole, the reasons for moving are largely positive rather than negative. I think that's a good basis for the decision.

By the way, if you're interested in getting started with Mastodon, I can recommend [Fedi.Tips](https://fedi.tips/), "_an unofficial guide to Mastodon and the Fediverse_".
