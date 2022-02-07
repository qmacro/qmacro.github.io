---
layout: post
title: "'Coffeeshop' - lightweight HTTP-based pubsub"
tags:
- appengine
- coffeeshop
- http
- icf
- pubsub
- rest
- sap
---


‘*[Coffeeshop](http://wiki.github.com/qmacro/coffeeshop)*‘ is a lightweight, REST-orientated HTTP-based publish/subscribe implementation that I’ve been working on for the last few days. It is a culmination of:

- an [early](http://www.pipetree.com/jabber/jep-0024.html) and long-standing interest in pubsub
- a fascination with using HTTP properly, i.e. as an application protocol, not a transport protocol
- an excuse to experiment in the area of [webhooks  
](http://blog.webhooks.org/)
- a desire to learn more about Google’s [App Engine](http://code.google.com/appengine/) as a cloud platform, and more specifically as an HTTP runtime platform, much like SAP’s Internet Communication Framework (ICF)

There seems to be a growing interest in pubsub and webhooks; one recent article in particular – “[The Pushbutton Web: Realtime Becomes Real](http://dashes.com/anil/2009/07/the-pushbutton-web-realtime-becomes-real.html)” conveys a lot of the ideas behind these concepts.

With [*coffeeshop*](http://wiki.github.com/qmacro/coffeeshop), entities — Channels, Subscribers and Messages — are resources, with URLs. You interact with entities using the appropriate HTTP methods. The implementation, being HTTP, is both browser-based (human-facing), and agent-based (program-facing). You can navigate the resources with your web-browser. You can interact with the resources with [cURL](http://curl.haxx.se/), [POST](http://search.cpan.org/~gaas/libwww-perl-5.830/bin/lwp-request), or your favourite HTTP library.

Here’s a simple example:

> # Create Channel: > **echo "Test Channel" | POST -Se http://giant:8888/channel/** POST http://giant:8888/channel/ --> 201 Created Location: /channel/5/ > # Add to Channel a new Subscriber with > # a callback resource of http://atom:8081/subscriber/alpha > **echo "name=alpha&resource=http://giant:8081/subscriber/alpha" ** > **| POST -Se http://giant:8888/channel/1/subscriber/** POST http://giant:8888/channel/1/subscriber/ --> 201 Created Location: /channel/1/subscriber/2/ > # Publish a Message to the Channel > **echo "hello, world" | POST -Se http://giant:8888/channel/1/** POST http://giant:8888/channel/1/ --> 302 Moved Temporarily Location: http://giant:8888/channel/1/message/ahFxbWFjcm8tY29mZmVlc[...]RgIDA

As you can see from this example, POSTing to the Channel container resource

/channel/

creates a new Channel, POSTing to the Channel 1 subscriber container resource

/channel/1/subscriber/

creates a new Subscriber, and POSTing to the Channel 1 channel resource

/channel/1/

creates a new Message, which is delivered to the Channel’s Subscribers. The resource returned to a Message POST is that Message’s unique address

/channel/1/message/ahFxbWFjcm8tY29mZmVlc[...]RgIDA

where the details of that Message, including the Delivery status(es), can be seen.

For more information on the resources and methods, have a look at the [ResourcePlan](http://wiki.github.com/qmacro/coffeeshop/resourceplan) page.

I’m using Google App Engine’s [Task Queue API](http://googleappengine.blogspot.com/2009/06/new-task-queue-api-on-google-app-engine.html) to have the Messages delivered to their (webhook-alike) endpoints **asynchronously**.

The code is early and rough, and [available on github](http://wiki.github.com/qmacro/coffeeshop). You can download it and try it out for yourself locally or create an app on App Engine cloud domain appspot.com. I’ll probably publish a public-facing instance of this implementation in the next few days. All comments and feedback appreciated.

One last thing: I know of at least a couple of HTTP-based pubsub implementations: [pubsubhubbub](http://code.google.com/p/pubsubhubbub/), and [Watercoolr](http://watercoolr.nuklei.com/). Both are great, but for me, the former is a little complex (and ATOM-orientated), whereas the latter I thought could be more RESTian in its approach (hence [*coffeeshop*](http://wiki.github.com/qmacro/coffeeshop)).


