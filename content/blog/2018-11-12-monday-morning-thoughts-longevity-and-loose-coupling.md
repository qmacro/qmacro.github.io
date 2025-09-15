---
title: "Monday morning thoughts: longevity and loose coupling"
date: 2018-11-12
tags:
  - sapcommunity
  - mondaymorningthoughts
---

*In this post, I think about the importance of core technologies, and
how the arrival of functions-as-a-service might be merely the next
incarnation of an idea that's existed for a while.*

This weekend I picked up on a conversation about RSS (alternatively
standing for RDF Site Summary, Really Simple Syndication and Rich Site
Summary) and how authors should include the whole blog post contents in
the RSS feed. There was some wonder within the conversation thread that
RSS was still being used; despite the disappearance a few years ago of
arguably the pre-eminent RSS reader, [Google
Reader](https://en.wikipedia.org/wiki/Google_Reader), RSS is alive and well and
powering syndication & sharing on the web even today. (If you want to
know more about RSS, its history and its relation to OData, you might
want to read "[Monday morning thoughts:
OData](/blog/posts/2018/08/20/monday-morning-thoughts:-odata/)".)

That got me thinking of the protocol upon which RSS relies - the
venerable HyperText Transfer Protocol (HTTP). HTTP has been around for a
long time, and in the same way that email has become a sort of universal
mechanism for asynchronous communication, HTTP is a universal mechanism
for all sorts of things. Why is that? Well, I think one reason is its
beautiful simplicity. When HTTP first arrived on the scene, I remember
being delighted by it and indeed by the similarities with email.

## The beautiful simplicity of email and HTTP

The official [request for
comments](https://en.wikipedia.org/wiki/Request_for_Comments) (RFC)
document number [822](https://www.ietf.org/rfc/rfc0822.txt), from the
Internet Engineering Task Force (IETF) describes, amongst other things,
what an email looks like. There are headers, and a body - the email
message, effectively. Headers are name:value pairs, and the headers are
separated from the body by an empty line. Here's a simplified example:

    Message-ID: <23944892.154212220.SomeMail.root@2ea9232e1>
    From: Sender <sender@example.com>
    To: recipient@example.com
    Subject: The email subject line
    Date: Sat, 10 Nov 2018 14:25:13 +0000 (UTC)
    Content-Type: text/plain; charset=UTF-8

    Greetings, earthling!

In HTTP, described in RFC [2616](https://www.ietf.org/rfc/rfc2616.txt),
messages are either requests or responses, and in both cases, the
structure is the same: headers in the form of name:value pairs, an empty
line, then the payload of the request or the response. Here's a
simplified example of an HTTP request (this one doesn't have a payload)
and the corresponding HTTP response:

Request:

    GET /qmacro/blog/ HTTP/1.1
    User-Agent: Mozilla/5.0 (X11; CrOS x86_64 11151.17.0)
    Host: pipetree.com
    Accept-Language: en-gb
    Accept-Encoding: gzip, deflate
    Connection: Keep-Alive

Response:

    HTTP/1.1 200 OK
    Date: Mon, 12 Nov 2018 06:43:07 GMT
    Server: Apache/2.4.18 (Ubuntu)
    Content-Type: text/html; charset=utf-8
    Content-Length: 10557

    <!DOCTYPE HTML>
    <html>
    <head>
    <title>DJ's Weblog</title>

There's a beauty in the simplicity and similarity across all these
different examples - they follow the same pattern, even sharing some
headers (such as Date and Content-Type), and above all they are
human-readable\*.

\*the advent of HTML email has made that a little more challenging, and
brought about the death of many excellent text-only email clients such
as (my favourite email client of all time)
[mutt](https://en.wikipedia.org/wiki/Mutt_(email_client)), but that's a
story for another time.

There have been attempts at improving upon today's HTTP, and you can
see those attempts in the form of [SPDY](https://www.chromium.org/spdy)
and HTTP/2.0. And of course we have web sockets and the WS protocol
prefix being utilised between server and client (browser) \... but
ultimately the core of HTTP remains strong and ubiquitous. Indeed, in
the Las Vegas and Barcelona editions of one of my SAP TechEd sessions
this year - LT106 "[Understanding the Available Paths for Developers
Throughout
SAP](https://sessioncatalog.sapevents.com/go/agendabuilder.sessions/?l=192&sid=62863&locale=en_US)",
I have exhorted the attendees to learn core technologies regardless of
the path they take. One of these core technologies that I think everyone
should learn is HTTP.

## Probot and Webhooks 

Something else I looked into this weekend was a result of my attendance
last week at [DevRelCon 2018 London](https://web.archive.org/web/20190112064724/https://london-2018.devrel.net/),
where, amongst other things, I learned about all sorts of tools that
[GitHub](https://github.com/) has to offer above and beyond what I
consider core (social coding via repository & project management based
around the distributed source code control system "git"). One of these
tools is [Probot](https://probot.github.io/), which allows you to use
apps to extend processes managed within GitHub.

![Probot logo](/images/2018/11/probot-logo.png)
*The Probot character*

The apps can be pre-built, or you can create your own. Essentially
Probot is a layer built on top of a couple of fundamental mechanisms -
[webhooks and the GitHub event
API](https://developer.github.com/webhooks/), making it easier for these
apps to be constructed.

Let's look at webhooks for a minute. What are they? Think of webhooks
as an architectural pattern based usage of HTTP. The concept of webhooks
has been around for more than a decade - first invented and popularised
by Jeff Lindsay - see his post "[Web hooks to revolutionize the
web](https://web.archive.org/web/20180928201955/http://progrium.com/blog/2007/05/03/web-hooks-to-revolutionize-the-web/)"
from 2007. He describes them as "user defined callbacks made with HTTP
POST"\*, and a core use case for webhooks at the time was to address
the challenges of polling - the repeated requests one piece of software
makes to another, asking, over and over again: "anything new?", "have
you finished it yet?", "do you have anything for me?" and similar
requests. The polling pattern is often the simplest to think about and
implement, but it's rather wasteful and inefficient.

\*Interestingly, Jeff likens webhooks to *pingbacks*, which I wrote
about in last week's post: "[Monday morning thoughts: on starting
blogging](/blog/posts/2018/11/05/monday-morning-thoughts:-on-starting-blogging/)".

Back in 2007 when Jeff described this architectural pattern, we
immediately saw the possibilities of a web of event-driven services,
loosely connected via HTTP. At that time, HTTP was the lingua franca of
inter-application communication.

Today, it still is. Look at the other half of what Probot is built
upon - GitHub's event API. Want to have some checks automatically
carried out when source code is updated? Want to trigger a process in
your organisation when a pull request is made to a specific repository?
Register a callback, to be executed when these events happen. The form
of that execution is simply some code, somewhere, that responds to an
HTTP request, a request that is made by the system that is raising the
event (GitHub in this case), and making that HTTP POST to the callback
endpoint you registered. Again, this is where knowing about the HTTP
protocol in general, and understanding the nature of how HTTP server
frameworks function, is an essential skill, in my opinion\*.

\*one of the ideas that drove me originally to create the Alternative
Dispatcher Layer (ADL) for the ABAP stack was the lovely similarity
between HTTP server frameworks large and small, across different
languages and environments. See "[A new REST handler / dispatcher for
the
ICF](/blog/posts/2009/09/21/a-new-rest-handler-dispatcher-for-the-icf/)"
and Nigel James's presentation "[Alternative Dispatcher Layer
Overview](https://www.slideshare.net/squarecloud/alternative-dispatcher-layer-overview-12170192)"
for a little bit of background reading.

## Functions-as-a-Service (FaaS)

Today's serverless paradigm is a utility computing model where cloud
vendors (such as SAP) provide compute resources, dynamically managing
the allocation according to load, and charging based directly (and only)
on resources consumed, rather than on pre-allocated units. This is a
perfect example of cloud native computing, and amongst other things, it
allows, even encourages us to think in terms of small computational
executions, and to construct solutions out of loosely coupled building
blocks.

I've written about FaaS in a previous post: "[Monday morning thoughts:
functions - what
functions?](/blog/posts/2018/05/14/monday-morning-thoughts:-functions-what-functions/)"
but I thought it was worth continuing the "loosely coupled" idea in
this direction. The appeal of SAP's FaaS offering is especially
interesting to us as folks who build enterprise business solutions
because the serverless fabric extends into the business processes
themselves, as we saw for example in the SAP TechEd 2018 Las Vegas
keynote demo from Jana Richter and Ian Kimbell (see "[Speed with
Serverless Apps: SAP Cloud Platform Functions at SAP TechEd
2018](https://www.youtube.com/watch?v=JDVDY1jMsuQ)").

Essentially we can see that there are commonalities between various FaaS
solutions, not only with SAP but with the hyperscale providers too, on
how code is invoked:

-   Triggers: you can invoke a function directly with an HTTP call
-   Events: functions can be invoked as and when appropriate, based on
    the occurrence of various events, whether those events are [business
    related](https://help.sap.com/viewer/788fa4c7585e415187e347e904010cee/1808.500/en-US/82e97d5329044732af1efd996bfdc2ab.html) or
    service related (for example - [Google Cloud Functions offer
    events](https://cloud.google.com/functions/docs/concepts/events-triggers)
    based upon Cloud Storage and Cloud Pub/Sub)
-   Timers: in a wonderful acknowledgement of the enduring nature of
    various Unix designs, you can use the language
    of [cron](https://en.wikipedia.org/wiki/Cron) to [schedule
    time-based
    invocations](https://help.sap.com/viewer/94fafb5bcf8f4c5cbdd0cdd8e358183c/Cloud/en-US/e5d2c92959b94b7e98612ca577cbba2e.html)
    of functions on SAP Cloud Platform


Moreover, the commonality doesn't stop at the invocation level. At the
end of the day, what are being invoked are functions, and the API is
HTTP flavoured. Discrete functions with a well-defined, (well-loved,
perhaps?) interface: The function receives the call and its context, in
the form of an object representing the HTTP request, with the method,
the URL path of the resource, the headers and any payload that is sent.
It also receives an empty object representing the HTTP response, and it
can and should populate that object appropriately, before "letting go"
and allowing the server infrastructure take care of what happens after
that.

Note that the primary purpose of these loosely coupled HTTP-invoked
functions is not always to return a rich response, but to perhaps
perform some computation, store some data, change some state, as an
appropriate reaction to the original event. These are not pure
functions - many will have side effects (so it's appropriate for the
method to be POST). But now I'm (semi-deliberately) mixing in
functional programming concepts, which is a valid thing to think about
here too, but perhaps I'll leave that for another time.

## Loose coupling and management

I'd like to end this post by encouraging you to think about the nature
of this idea of loose coupling of functions, and event-based invocation.
There's a huge amount of potential, and of flexibility, especially in
the context of trying to keep the core clean (see "[Keep the Core
Clean: Clarifying Points from Björn Goerke's
Keynote](https://blogs.sap.com/2018/11/08/keep-the-core-clean-clarifying-points-from-bjorn-goerkes-keynote/)"
by Jerry Janda) by extending computation for business services in the
cloud.

One challenge is the management of the events and the functions written
to be invoked at the events' occurrences. In a similar way to how we
have to think about managing a large software project, with modules and
libraries, we have to think about how we will go about managing this new
style of resources.

How will we retain an overview of what we have, and what is invoked
when? Our tools should help us there to some extent. How do we manage
the intersection of business process requirements and the triggering of
actions and reactions? Perhaps that's more of a human-led activity that
is only assisted by tools. I don't know yet. It's something
that dahowlett and I touched upon at SAP TechEd 2018 Barcelona (see the
audio content "[Towards a more open
SAP?](https://www.youtube.com/watch?v=cFN5OQ2D9R8)" that Den and I
recorded at the event), and a topic that we should explore more
together.

If you learn about one thing this week, I hope I can make an argument
for it to be about HTTP, and how you write HTTP services in the
framework relating to your favourite language. As well as being a
meditation on a now-venerable protocol, it will help you step into this
new era of cloud computing.

---

This post was brought to you by the prospect of a relaxing week off, by
the distraction of the falling leaves outside, and by [Pact Coffee's
Asomuprisma](https://www.pactcoffee.com/coffees/asomuprisma).

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

*Update 20 Nov 2018: See James Governor's post "[GitHub Universe 2018:
Low Key
Revolutionary](https://redmonk.com/jgovernor/2018/11/07/github-universe-2018-low-key-revolutionary/)"
on the recent GitHub conference and more on serverless in relation to
the recently released [GitHub
Actions](https://github.com/features/actions).*

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-longevity-and-loose-coupling/ba-p/13365146)
