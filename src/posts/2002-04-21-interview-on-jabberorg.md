---
layout: post
title: Interview on jabber.org
---


My interview on [jabber.org](http://www.jabber.org/) has been [posted](https://web.archive.org/web/20020804053617/http://www.jabber.org/people/interviews/dj.html). Yikes!

It's reproduced below.

---

# Jabber Interviews: DJ Adams (qmacro)
## JSF > People > Interviews > DJ Adams

**Everyone in the Jabber world seems to have a nickname -- how did you get yours?**

Well, it comes from the world of SAP. Prehistoric SAP, that is, from when I was working with R/2 in the late eighties. In those days, it was nearly all in (S/370) assembler - none of this newfangled ABAP language thank you very much :-) A Q-macro is an assembler representation of a logical file structure, defined in the SAP system's data dictionary. The names were 5 characters in length, for example QKONP, which was the name of the macro that represented the field of the contract document item structure. I picked the name 'qmacro' as it reminded me of happy times, and it was unlikely that it would clash with anyone else's.

**Where do you live now, and what interesting places have you lived in the past?**
Well, I split my time between England and Germany. I work in Brentford, West London, and live in Hailsham, in East Sussex, near the south coast. I also spend time in Krefeld, Germany. Actually, when I think about it, I spend most of my time somewhere between the two. I grew up in Manchester, but moved to London when I went to university there.

I was lucky enough to have a job (hacking SAP) that took me to lots of places; I've lived and / or worked in plenty of places in my time - Hamburg, Düsseldorf, Bonn, Heidelberg (Germany), Paris, Strasbourg (France), Brussels (Belgium), Copenhagen (Denmark), Rotterdam (Holland), NY state (USA), and plenty of places in the UK. To paraphrase some song lyrics, "wherever I lay my laptop, that's my home".

**When and how did you first get involved in Jabber?**
I remember it well. It was the autumn of 2000. I was working in London, in a small, cramped, and hot office. I was getting hot under the collar trying to install this new open XML-based messaging system called 'Jabber'. I'd been hacking around with IRC, and wanted to see what this new system was like. As I've mentioned elsewhere, my head was full of XML-RPC stuff, IRC bots, and system-to-system messaging. Although at the time Jabber was being touted as an IM system, I was intrigued.

I almost gave up at the start, in that it took me over a day to get it installed and working, with all the individual library dependencies that were required at the time - I think it was the 1.0 version of the jabber.org server - and the initially cryptic configuration file. But I persevered, and I'm glad I did. (The fact that I found the configuration file initially cryptic is one of the reasons why I focus so much on helping the reader of "Programming Jabber" to understand how the configuration works - that's why Chapter 4 is so, well, long :-)

I was very much a Perl enthusiast at the time (and still am!) and I got stuck into the Net::Jabber modules almost immediately.

**Which Jabber clients do you use or like the most?**
It has to be Jarl. It's great - does what it says on the label, appeals to my graphical good taste, and I can hack bits onto it in Perl. I've used Gabber too - that's a nice client, but overall I prefer Jarl. I've read enough of Ryan's code in the Net::Jabber modules to understand his coding style, so I feel at home inside Jarl.

When I'm on the move, and have only got an ssh window available, then of course I use sjabber to join meetings and conferences.

**You're well-known in the Jabber community for having written a book about Jabber -- how did that come about and what did you learn in the process?**
You mean I'm not well known for my good looks and charm? ;-) Ok, well, you can't win 'em all. Seriously, though, about the book. It was early 2001, I'd just had a couple of Fun With Jabber articles published on the O'Reilly Network, and had a few other articles and bits of documentation relating to Jabber out there too. A chap from O'Reilly called Chuck Toporek, who later was to be my editor, called me. To cut a long story short, after I had bored him half to death with the sort of things someone could write about Jabber, he asked me if _I_ wanted to write it. I almost fell off my chair.

If there's one thing I learned, it's that if a publisher asks you if you would like to write a book, you say "YES!". It was the opportunity of a lifetime for me. I had to grab it with both hands. I had to submit a detailed proposal, which outlined the book's content, and so on. This was actually a lot harder than I thought it was going to be, as I had to essentially write the book in my head up front, so to speak, so I could work out what was going to be where. It really paid off, though, as the outline was my road map while writing. I'd have been totally lost without it.

I quit my job to write it; I wanted to enjoy the experience as much as I could. The word 'enjoy' is relative, though. Although ultimately rewarding, writing the book was very hard work. I got to know the jabber.org server codebase quite well, as I used to pore over it while drinking in a coffee shop just up the road.

**What do you consider some of your most important contributions to Jabber?**
Gosh, I dunno. I've written quite a bit of documentation, and have tried to help out on the mailing lists wherever and whenever I could. I enjoy 'promoting' Jabber, writing articles and giving talks to anyone who will listen :-) I also have a few Jabber modules on CPAN under my belt - Jabber::Connection being the most important, I guess.

**What projects or code are you working on nowadays?**
Well, at the moment, I'm working with the Radio Userland community to bring Jabber in to the loop to solve various issues relating to the addressing of endpoints that are behind firewall/NAT mechanisms. We're got a 'bridge' that sits in between Radio Userland desktops and the so-called Radio Community Server mechanism; this bridge translates between XML-RPC and Jabber traffic to carry weblog update notification requests and pings. We're using packets based on the pubsub JEP 0024 to achieve this. It's working really well.

I'm also experimenting with Peerkat, a personal weblog mechanism, and have added some Jabber pubsub juice to that too. There's a lot of really interesting stuff out there that is just crying out for integration with Jabber.

Other than that, I'm keeping an eye on the 1.5 development work, so I'll be in a position to explain bits and pieces to anyone who expresses an interest.

**What are your favorite programming languages?**
Well, it's got to be Perl, of course. What a silly question :-) Actually, Python has been growing on me too, ever since I hacked on bits of jabberpy early last year. Any language that's not too difficult for me to (a) understand and (b) do anything useful without jumping through hoops is fine by me. I've still got a soft spot for Atom Basic, a very odd dialect of Basic on the Acorn Atom. You could inline 6502 assember in your code, too!

**What's your favorite music to code by?**
Oh, I've rather an eclectic taste, I'm afraid. Naming any one artist would be misrepresentative of my favourites, so here's a random list of stuff I've been listening to at the keyboard recently: Electric Light Orchestra, Talvin Singh, The Smiths, Violent Femmes, Natalie Merchant, Bentley Rhythm Ace, Daft Punk, James Taylor Quartet, Led Zeppelin, Grateful Dead, Motorhead, Manu Dibango. I also like listening to BBC Radio 4.

**What hobbies do you pursue when you're not working on Jabber?**
Most of my hobbies are orientated towards our son, so right now you'll find me kite flying, bicycle riding, and building stuff with Lego. I do like cooking, it's a great way to relax and switch the rest of the world off. Joseph and I especially enjoy making our own pasta, cakes, and pies. Anything that involves a lot of mess, basically.

**Do you have a website or weblog where people can learn more about you?**
Well, not really. I've never been that good at maintaining that sort of thing. I do have a Jabber-related site, which is at http://www.pipetree.com/jabber/. My experiments with Peerkat, in the form of a weblog, can be found at http://www.pipetree.com:8080. I did have a Geocites website for my family, but it's disappeared. Our son Joseph had a website up within 60 hours of being born :-)

**What do you think are the most important strengths of Jabber?**
The fact that the protocol is open, and flexible. It doesn't try to do too much - it just gives you the building blocks to construct your own solutions. Indeed, look at the activity in the standards-jig mailing list, where people are coming up with extensions to the protocol left right and centre. Furthermore, because the basics are straightforward, it's easy to wrap your head around it and get going with solutions without much ado.

I think the fact that the Jabber development community is a friendly place to be, despite any clashes that might occur, is a very important aspect too. Life's too short already not to enjoy what you're doing.

**What are some of the weaknesses you think need to be addressed?**
Weakness? Bah, that word isn't in my vocabulary :-) But if I had to pick one, it would be Jabber's name, and what people think it stands for. Jabber is not just IM, as we all know. The situation is improving, in that people are beginning to 'get it' and think of Jabber in more general XML-based messaging terms, but it's been a long hard slog to get here.

**What cool applications would you like to see built using Jabber?**
Well, there's a ton of potential in the business world (where I come in from). Getting Jabber into commerce related projects is what I'm interested in. There's so much data to manage and move around in the business world, and an XML-aware transport like Jabber seems to be an ideal fit. I've already built some demo scenarios, bolting Jabber (and other Open Source tools) onto SAP R/3, and it looks very promising.

**What other computing projects do you most admire, and why?**
Hmmm. A difficult one. I'm not really sure. I'm not that much of a follower of computing projects per se; I'm more a user of their products :-) Rather than projects, there are many people that I admire. Take the Perl community, for example. As well as the gods who make Perl tick, there are people closer to userspace (and therefore closer to me) that are doing fantastic things to further Perl. Matt (XML), Brian (Inline) and Damian (mind stretching) to name but a few.

**What can the Jabber community do to improve?**
There's been a lot of effort to get process built into the community and the Foundation; JIGs, JEPs, and the council, for example. We need to make sure that the time and effort invested in setting these things up is not wasted; we need to see that the processes put in place are processes that work. We need to communicate more (who doesn't?) and we have to constantly work on the relations(hips) with other parties.

**Where would you like Jabber to be two years from now?**
Everywhere.

:-)
