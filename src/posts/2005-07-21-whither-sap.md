---
layout: post
title: Whither SAP?
tags:
- sap
---


I’ve been thinking a lot recently about where SAP is going and what SAP is doing today, especially in the light of where it went and what it did in the past. To be honest, the thinking has been triggered by frustration at the nuts and bolts of SAP technical matters, particularly in the area of service support and basis work.

SAP found success with R/2 and R/3 for many reasons, one of which was abstraction. Because they wanted to offer a set of uniform facilities across a range of vastly different platforms, they built abstractions for basic services such as jobs (background processing), spooling, process and session management, database access, and so on. These abstractions, these inventions of layers on top of OS-level services contributed a great deal to the success of SAP implementations.

However, this culture of abstraction, combined with decades of being *the* original and best wall-to-wall ERP software solution, is causing problems since SAP started the long process of shaking off its monolith mantle and starting to compete and coexist more with the rest of the software world, and the internet (most particularly the web). SAP are used to designing, building and delivering things on their own terms, according to their own culture, and based on their view of the rest of the world. The problem is, the tech world in which SAP deliver software and services today is vastly different to what it was ten or twenty years ago, and SAP’s size is making it difficult for them to adapt quickly enough.

Let’s take the web as an example (which clearly didn’t exist then, but has for a good while now). And within the web example, let’s take a bread and butter service – [OSS Notes](http://service.sap.com/notes), within the larger context of the service portal. Essentially, an OSS note is a document that describes a particular issue, typically with Symptom, Cause, Solution and other sections (including links to software corrections). Pretty straightforward. An OSS note has versions, a status, belongs to an application area, and has other data associated with it, but can be essentially represented as a web page.

The power of the web is vast, but how that power is presented is subtle. Hyperlinks, addressing (URLs), reliable navigation, and so on. And at the user end, we have the UI (the browser) that contains basic but important tools such as bookmarking, browsing history, and simple features like showing what the address of a hyperlink is when you hover over it.

But what SAP has done in implementing OSS notes on the web (they were previously only available on an SAP system that you had to connect to with SAPGUI) shows all the signs of the abstraction (re-invention) culture, and the struggle SAP still has in embracing the rest of the world.

First of all, the OSS notes are available from within the service portal, which is beset with all manner of navigation difficulties and breaks many of the cardinal rules of web design ([frames](http://www.flickr.com/photos/qmacro/23720154/), popups and new windows, impossibly long URLs, overuse of Javascript, [pages that don’t fit in your browser](http://www.flickr.com/photos/qmacro/27319450/) even at 1024×768, but I digress … ) – in fact the most telling symptom of the portal’s problems is the fact that SAP never refer to specific URLs for things in the portal, you always receive instructions such as  
 “*Go to this base URL, then click here, then here, then here, then here to get what you’re looking for*” and of course invariably the texts and hyperlinks that you click through one month have been changed by the next month and this sort of navigation description breaks down entirely (ever tried to find a specific version of, say, SAPINST?)

But the main problem is that the OSS notes are only on the web in the letter of the law. In the spirit of the law, they’re not. The frameset-induced misery means that you can’t use basic browser tools to bookmark and otherwise organise OSS notes the way *you* want to. But it’s even more interesting than that – on the top frame of each OSS note page, there are Javascript powered ‘favourites’ and ‘subscribe’ links. Why can’t I just use the power of the web – URLs, to manage my own favourites, either in my browser, or using [external tools](http://del.icio.us)?

Furthermore, even if you overlook the problems caused by overengineering — this abstraction layer of web upon web — you can’t escape the fact that the machine-translation of OSS note content into HTML is beset with problems. Formatting issues mean that you soon lose your way in a long OSS note when it has nested bullet points. Also, none of the things referred to, which are available somewhere in the SAP portal, are hyperlinked (in fact, *nothing* is hyperlinked).

Finally, there is actually a unique URL for each OSS note but each one is extremely long, bears no relation to the OSS note number, and isn’t easy to exchange in, say, an IM/IRC or email-based chat.

You might think I’m particularly picking on OSS notes. I’m not; it’s just that it’s a tangible (and in-your-face) example of how things can go wrong when the culture of abstraction and the oil tanker-like momentum cause SAP programmers to over-engineer a solution. (And it’s been [on my mind](/archives/2005/07/hacking_the_sap.html) recently too). There are plenty of other examples where SAP is unnecessarily re-inventing stuff – take SAPtutor for example – there are plenty of platform-independent ways of presenting slides, video and audio on the web. Why, then, invent yet another format that needs a special player, that’s only available on a single platform? But I digress (again) …

So, to the title of this post, then. Where is SAP going? They’ve made good progress in opening up to the world (albeit with a number of wrong turns, in the past and more recently), but there’s a lot to do. I know there’s a lot to do, as I’ve seen it first hand while performing some Basis activities recently, and having to use the service portal to get to where we need to be.

Can SAP adapt? Can they start to embrace, rather than resist, the environments in which they find themselves today? Can they tune their complex culture (of complexity) to deliver a better service and better software?

I have faith in them. But sometimes, when you’re making a living as a SAP-hacking footsoldier, it’s hard.

Update:

Shortly after posting this, Piers wrote an [interesting followup](http://www.piersharding.com/blog/archives/2005/07/sap_a_closed_cu.html) on how the closed culture may end in doom. Also, I spotted a well-written post by Ryan Tomayko called [Motherhood and Apple Pie](http://lesscode.org/2005/07/21/motherhood-and-apple-pie/) today which spookily touches on the core point of this post – that SAP are resisting the very tools and technologies and design axioms that make the most scalable and widely distributed meta-application tick.


