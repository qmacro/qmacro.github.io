---
layout: post
title: FOSDEM interview
date: 2002-01-03
tags:
  - jabber
  - fosdem
  - archive
---
(Transcript of an interview by Raphaël Bauduin for FOSDEM)

Read how DJ Adams talks about Jabber ...

It's Thursday, so it's interview time ! Today we receive someone who's name is now definitely related to 'instant messaging', even if his 'product' is more than that !

## Raphaël Bauduin - Please present yourself

DJ Adams - I'm a bit of a nomad, travelling back and forth between England and Germany. I work in London building extensions to my employer's R/3 systems, using open source tools and technologies such as Perl and Apache. We're looking to use Jabber as the foundation for the data messaging part of a current project. I'm married and have one son who will be 5 years old in April. I spend some of my time collecting and restoring old dumb terminals. That's one of the reasons I wrote sjabber... :-)

## RB - How did you discover Jabber?

DJA - I can't remember how I exactly discovered Jabber; I think it was after reading an article on Instant Messaging technologies. I wasn't that familiar with Instant Messaging (IM) at the time and had never used any of the proprietary systems such as AIM or ICQ. So I came to Jabber with no preconceptions of what it, and IM, was about. It was in September or October last year. I remember vividly as I fought with the install process and almost gave up; since then installing the server has become a breeze. I'm glad I persevered.

## RB - Why did you get involved?

DJA - I was intrigued by the protocol; my entry point into the Jabber world was from the bottom up, so to speak. From day 1, I was looking at the XML flowing between client and server. It looked like it was simple enough for me to understand. I like technologies that I can understand :-) But it was more than that. I had been a user of IRC, mostly internally, to hold meetings with colleagues who, like me, work remotely. I seem to remember wanting to try out replacing our IRC server with a Jabber server to see how it worked, how it ticked.

And there's another angle. At the time, my head was full of XML, messaging, and Internet-wide communication. Jabber seemed to encapsulate all these things in one neat little box of potential. A box I could fit in my head all at once, too. I'd also been captivated by the XML-based RPC ideas introduced to me by Dave Winer's MailToTheFuture service and wanted to play more and to explore different avenues of possibilities.

The more I learned about Jabber the more mesmerised I became. And the reason why I remained involved was not just this fascination with Jabber; it was also because of the community. It's a very friendly place.

## RB - Is Jabber more than Instant Messaging?

DJA - Yes. Next question? :-) Well, this is the classic question, isn't it. Yes, Jabber is more than IM. I suppose I was lucky enough to have been ignorant of the IM world when I discovered Jabber, but I've always seen Jabber, first and foremost, as a messaging technology and an architecture, a system, for building systems that take part in messaging. Jabber isn't just a protocol, of course. It's also not just an open source server. If you look at how the server is built, it's very modular, and very easy to add on components to do whatever you want...not just to translate between Jabber's open protocol and the protocols of other IM systems.

## RB - Are there a lot of developers involved in Jabber?

DJA - Well, I'm not sure what 'a lot' is, but there's certainly a lot of activity in the Jabber world, looking at what discussions are going on in the various mailing lists and forums. People are using Jabber for all sorts of things, it seems. Which is great. There was a fantastic turnout at JabberCon (http://www.jabbercon.com) this year in Denver, loads of people and companies with even more ideas and ways of using Jabber.

## RB - Is Jabber in use somewhere, in a professional environment?

DJA - Well, looking at the recent business news on Jabber Inc's website, for example, it's pretty clear that the answer is 'yes'. BellSouth Internet Services have just licenced Jabber for various projects, and Orange UK are integrating Jabber into their systems. You can get more information on these and other projects here:
http://www.jabber.com/news/releases.shtml

## RB - What is a component? What can it be used for?

DJA - A component is like a module, an independent piece of server-side code that's connected to the backbone of a Jabber server. A component is usually designed to perform a single task, such as providing a bridge to another IM system (these types of components are known as 'transports') or a service such as conferencing, or user directory information storage and retrieval.

Components can exist in different forms, the most flexible of which is as a separate process, either on the same host as the main Jabber server to which it's connected, or on a different one; the component and the Jabber server talk via TCP sockets, and exchange streams of XML XML in a very similar way to how a Jabber client talks to a server.

A Jabber server is nothing, naked, without components. Everything that you do with Jabber is done by a component of some sort, pretty much. What we recognise as the IM-style services of Jabber--presence, rosters, and so on--is provided by a component called the Jabber Session Manager, or JSM for short.

## RB - What are the possibilities of Jabber?

DJA - What a question! What are the possibilities of an XML-based messaging system that allows you to exchange all sorts of information between people and applications, build event-based mechanisms, and support a rich IM system as well?

One really attractive feature of Jabber is the low cost of entry. By this I mean that Jabber's protocol is simple. If you can read and construct XML, and use TCP sockets, you can turn Jabber to your advantage. The open source Jabber server is written in C, and the codebase is fairly small, which means that it's not an impossible task to get a grip on what's going on from end to end. Moreover, there are libraries that make Jabber programming easier in many popular languages: C++, Java, Python, and Perl, to name a few. I've even seen some Jabber stuff in REBOL!

So if you can do a little bit of programming, then you can do what you want with Jabber. For fun, I've done a few things recently with Jabber: used it to allow me to browse an LDAP hierarchy, given our coffee machine 'presence' so that we know whether there's coffee or not, written various meeting and chat-room assistants, and extended SAP R/3's business workflow using IM style alerts and CGI-based functions.

## RB - Is interoperability with other IM systems easy to maintain?

DJA - Well, if the protocol is stable, and the 'foreign' IM system is playing nicely, it's fairly straightforward. But as you know, some of the more prominent players have been making a (bad) name for themselves by IP-blocking the IM transports on jabber.org's site. There's not much you can do in those circumstances apart from move the transports to different hosts. But there are only so many moves you can make.

Transports to other IM systems is not really my cup of tea, so I'm probably not the best person to ask here.

---

[Originally published on fosdem.org](https://web.archive.org/web/20020810194334/http://www.fosdem.org/interviews/1574.html)
