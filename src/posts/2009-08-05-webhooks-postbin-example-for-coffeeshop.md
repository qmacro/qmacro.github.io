---
layout: post
title: Webhooks postbin example for Coffeeshop
tags:
- coffeeshop
- http
- postbin
- pubsub
- rest
- watercoolr
- webhooks
---


There’s an interesting article “[HTTP PubSub: Webhooks and PubSubHubBub](http://www.igvita.com/2009/06/29/http-pubsub-webhooks-pubsubhubbub/)” that covers working with webhooks and points to a great HTTP / webhook developer utility “[PostBin](http://www.postbin.org)“, which:

> “lets you debug web lets you debug web hooks by capturing and logging the asynchronous requests made when events happen. Make a PostBin and register the URL with a web hook provider. All POST requests to the URL are logged for you to see when you browse to that URL.”

The article also shows a very simple pubsub “Hello, World” script, *postbin.rb*, that nicely demonstrates the basic features of [Watercoolr](http://watercoolr.nuklei.com/) — another HTTP-based pubsub mechanism.

So I thought I’d write the equivalent to *postbin.rb*, this time demonstrating the same features in [Coffeeshop](http://wiki.github.com/qmacro/coffeeshop). This way, we can see how things compare. It’s in Python, but that’s neither here nor there.

import httplib, urllib, sys

hubconn = httplib.HTTPConnection('localhost:8888')

hubconn.request("POST", "/channel/") channel = hubconn.getresponse().getheader('Location') print "Created channel %s" % channel

hubconn.request("POST", channel + "subscriber/",  urllib.urlencode({'resource': sys.argv[1]})) subscriber = hubconn.getresponse().getheader('Location') print "Added subscriber %s" % subscriber

while True:   print "Post message:"   msg = sys.stdin.readline()   hubconn.request("POST", channel, msg)   message = hubconn.getresponse().getheader('Location')   print "Message published: %s" % message

I’ve added some print statements to show what’s going on, and to highlight the HTTP resources created and utilised.

Here’s a sample execution:

> **python postbin.py [http://www.postbin.org/1a5m8w0](http://www.postbin.org/1a5m8w0)** Created channel /channel/1/ Added subscriber /channel/1/subscriber/2/ Post message: **Hello, Webhooks World!** Message published: /channel/1/message/ahFxbWFjcm8tY[...]RgDDA Post message:

This message [appears in the PostBin bucket](http://www.postbin.org/1a5m8w0) as expected. Nice!

As well as showing how useful PostBin is, I hope this demonstrates how the basic features of [Coffeeshop](http://wiki.github.com/qmacro/coffeeshop) work, and perhaps more importantly, shows you that the REST-orientated approach is straightforward and works well.


