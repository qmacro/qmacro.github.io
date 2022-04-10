---
layout: post
title: A new journal experiment - Thinking Aloud
tags:
  - tools
  - meta
  - thoughts
---

_I'm trying out a new way of sharing thoughts in a GitHub issues based journal style blog called [Thinking Aloud](https://github.com/qmacro/thinking-aloud)._

TL;DR - My [Thinking Aloud repo](https://github.com/qmacro/thinking-aloud) is where I am experimenting with journalling via GitHub issues. Check out the [issues themselves](https://github.com/qmacro/thinking-aloud/issues?q=is%3Aissue+is%3Aopen+label%3Aentry), the [rendered versions of recent entries](https://github.com/qmacro/thinking-aloud/blob/main/recent.md), the [Atom feed](https://raw.githubusercontent.com/qmacro/thinking-aloud/main/feed.xml) or the [GitHub Actions workflows](https://github.com/qmacro/thinking-aloud/tree/main/.github/workflows) with which I automate some of the process.

I've been blogging for over 20 years, since 2000. I started with a Blogspot hosted blog over at <https://qmacro.blogspot.com> which amazingly is still around.

**This blog**

I quickly moved over to a self-hosted blogging system, initially powered by the beautifully simple [Bloxsom](https://en.wikipedia.org/wiki/Blosxom).

Over the years I tried out various blogging software, including Ghost and Movable Type, but at the core I've had my main blog (now at <https://qmacro.org> - where you're reading this) since 2002. I'm currently using GitHub Pages to host and manage things and I'm quite happy with it. I see this blog as my main personal blog and a place for "long form" posts on various subjects (as you can see from the [index](https://qmacro.org)).

**My posts on the SAP Community blog**

Of course, I also publish on the [SAP Community](https://community.sap.com) blog, which is a collective set of posts by many, many members of the SAP ecosphere. I have posts under the [dj.adams](https://people.sap.com/dj.adams) identifier and also (since I joined SAP) under the [dj.adams.sap](https://people.sap.com/dj.adams.sap) identifier, and as you might expect, the subject matter is very definitely SAP related. That said, you may be surprised at the breadth of topics - posts on subjects as diverse as [terminal tips](https://blogs.sap.com/tag/terminaltip/) and [fun runs](https://blogs.sap.com/2020/12/01/utfrw-unofficial-teched-fun-run-walk/) are all there.

**My autodidactics blog**

In the middle of last year I started a new, secondary blog [autodidactics](https://qmacro.org/autodidactics/) to share things I'd learned (I endeavour to be a life long learner). I was inspired to create such a blog having seen [Simon Willison's TIL (Today I Learned)](https://til.simonwillison.net/) site.

Moreover, I did very definitely feel I needed a place to share smaller nuggets of information that I'd learned; this in turn was triggered by reading some of [rwxrob](https://rwxrob.live/)'s repository of [dotfiles and scripts](https://github.com/rwxrob/dotfiles/).

Ever since I read through the entire source code base of the original Jabber (XMPP) server `jabberd` to understand how everything worked, in researching for my O'Reilly book [Programming Jabber](https://qmacro.org/about/#writing-and-talks), I've been a strong proponent of reading other people's code. There's so much richness out there, a variety of styles and approaches, and oh so much to learn.

**Twitter**

And of course, when it comes to sharing thoughts, there's always [Twitter](https://twitter.com/qmacro), which has been referred to as a "microblogging" platform, in the same way that [identi.ca](https://wiki.p2pfoundation.net/Identica) was. The key difference between Twitter and identi.ca was that the former is centralised, and the latter (sadly no longer in operation) was distributed. With identi.ca I felt in more control of my microblogging efforts. Don't get me wrong, Twitter is a great platform for conversation and ideas, but it's still centralised.

**Journalling**

And so to [Thinking Aloud](https://github.com/qmacro/thinking-aloud). If I lay out the different outlets for my thoughts in decreasing order of magnitude, I end up with something that looks like this:

```
+---------------------------------------------------------------+
|    Major      |    Minor      |     Mini      |     Micro     |
|---------------|---------------|---------------|---------------|
|  qmacro.org   | autodidactics |  (something   |    Twitter    |
| SAP Community |               |   missing)    |               |
+---------------------------------------------------------------+
```

What do these categories mean to me?

**Major**: If I want to write something in the major category, that's a relatively significant investment in time to create and publish posts (and for the consumer it can be significant too). That's fine, and those posts definitely will always have their place.

**Minor**: If I want to share something specific that I learned, such as on the subject of the shell's `declare` builtin (in [Understanding declare](https://qmacro.org/autodidactics/2020/10/08/understanding-declare/)), I have my [autodidactics](https://qmacro.org/autodidactics) blog. The posts are usually shorter -- although some may be more densely packed -- and about something quite small and specific.

**Micro**: If I just want to share a fleeting idea (or rant), I have [Twitter](https://twitter.com/qmacro).

So I feel there's a gap, for the **Mini** category. I have been inspired by [rwxrob](https://rwxrob.live)'s journalling, where he writes in relatively short form, but in a structured fashion. It seems a way of getting things written down, freeing up mental space for new ideas, and also a semi-cathartic approach to expressing thoughts, regardless of how fully formed (or not) they are.

One of the aspects that I like about the journalling that I've seen is that it's about the body of the journal entry first, and the title is not important. In fact, rwxrob's journal titles are timestamps, which seems a great way to avoid wasting brain cycles trying to think of a title, either before writing the entry (when you don't exactly know what you're going to write), or after (when you may have covered various topics in one entry).

So I've decided to try to feel my way into this **Mini** gap, and do some journalling of my own. The idea is that the amount of pre-thought, the level of friction & inhibition to create a new journal entry should reflect where this is in the "scale" expressed in the table above. I don't think much before tweeting (maybe I should, but that's a different story) and journalling is more towards that end of the scale than the other.

**Using GitHub features**

As part of the experiment, I decided to learn more about GitHub features while doing this, by making them a fundamental basis for the journalling mechanism.

I have a new GitHub repository [thinking-aloud](https://github.com/qmacro/thinking-aloud), and each journal entry is an [issue](https://github.com/qmacro/thinking-aloud/issues) in there. The beauty of GitHub issues is that Markdown is supported, plenty rich enough to express my ideas.

Moreover, there are other metadata aspects such as labels that I might want to take advantage of at some stage (think ["categories" in Atom feed entries](https://github.com/qmacro/thinking-aloud/blob/08bf3f98064237c35b3bf7ae4fb16b5ecb9608b6/feed#L44)).

Not least is the chance for folks to engage with the journal entries, via reactions and comments. I'm not sure how this is going to pan out, but I want to at least give this aspect a chance. I may get no engagement, I may get a load of spam. Let's see.

Most interestingly (to me) is the way I create new journal entries, and how I build the Atom feed so folks can subscribe.

I create a new entry via a shell function `j`, at the heart of which is this invocation:

```shell
gh issue create --title "$(date '+%Y-%m-%d %H:%M:%S')"
```

My editor (Vim) is then launched and I write Markdown, which is then sent to be the body of a new issue when I finish. Simple!

Each time a new journal entry (issue) is created, I rebuild the Atom feed. This is done via the power of GitHub Actions. Have a look at the [generate-feed workflow](https://github.com/qmacro/thinking-aloud/blob/main/.github/workflows/generate-feed.yml) to get an idea of how that works; in one of the steps there, I'm using `gh` to call the GitHub API to get the list of issues, and piping that (JSON) into a simple Node.js script [feed](https://github.com/qmacro/thinking-aloud/blob/main/feed) that uses the freakishly easy-to-use NPM module [feed](https://www.npmjs.com/package/feed) (thanks [jpmonette](https://github.com/jpmonette)!) to generate the Atom feed.

Additionally, I have implemented some [simple rendering](https://github.com/qmacro/thinking-aloud/pull/5/files) to make the entries easier to consume - the [most recent entries are rendered into a Markdown file](https://github.com/qmacro/thinking-aloud/blob/main/recent.md) in the main repository, and GitHub's Markdown rendering is more than good enough to make things easy and pleasant to read.

**Summary**

And that's it, so far. As usual, I'm making this up as I go along, and things may change along the way. I've written a couple of journal entries already, [check them out](https://github.com/qmacro/thinking-aloud/blob/main/recent.md) and let me know what you think.
