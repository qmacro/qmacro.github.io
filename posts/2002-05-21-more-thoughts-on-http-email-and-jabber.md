---
layout: post
title: More thoughts on HTTP, Email, and Jabber
---


Since writing the previous entry, some more thoughts have drawn themselves to my attention. There are advantages that HTTP does have over email. Built-in authentication for one thing. I’ve only used basic authentication, but what about digest? Moreover, [Jabber](http://www.jabber.org/) goes one better and has a framework for identity.

Actually, talking about HTTP headers with basic and digest authentication, here’s something else I’ve been wondering. [Simon Fell rightly suggests](http://www.pocketsoap.com/weblog/2002/05/19.html#a528) using a more polite and sensitive way to grab RSS sources, by use of the Etag and If-Not-Match headers. Very sensible. But what about the [If-Modified-Since](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.25) header?

Here’s one advantage that email has over HTTP. A built-in queueing system. Ok, the actual queueing system is made most visible by use of email clients, where you see mails in a queue, ready to read or process. But this is just a mask over the flat stack of emails that you can pop with, er, the POP protocol.

“Yesbut”, as a friend used to say in meetings and discussions. Here’s something I’ve been pondering too. Last week I downloaded and installed the fabulous [RT](http://www.fsck.com/projects/rt), (“Request Tracker”) – a ticketing system written in Perl. It’s *very* flexible and extensible. RT allows tickets to be managed in queues. It also allows tickets to be created (or corresponded upon) through different interfaces – via a web interface, via email, or via the command line. Any incoming transaction is inserted into a queue (if it’s a new ticket) or appended to an existing queue entry (if it’s correspondence on an existing ticket). I wonder if I can build a small front end to accept HTTP-based business calls and stick them in an RT queue? Of course, I also wonder whether that would be useful, but if nothing else, it would be stimulating.


