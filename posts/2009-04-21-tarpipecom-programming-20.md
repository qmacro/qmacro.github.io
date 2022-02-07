---
layout: post
title: tarpipe.com - Programming 2.0?
tags:
- beer
- flickr
- joseph
- programming
- tarpipe
---


Is [tarpipe.com](http://tarpipe.com) an early example of a “Programming 2.0″ concept?

I first read about Tarpipe from Curt Cagle’s "Analysis 2009". In turn, Curt points to [Jeff Barr’s post](http://jeff-barr.com/2008/12/31/tarpipe-rocks-a-quick-review/) which describes the concept and the implementation very well. It’s a fascinating concoction of Web 2.0 services and visual programming (in the style of [Yahoo! Pipes](https://en.wikipedia.org/wiki/Yahoo!_Pipes/)), and in its beta infancy has that great “wow, imagine the full potential!” feel to it.

Here’s an example of what I’ve been playing around with. With my phone — and with the Google G1 phone it’s so easy — I can snap a picture of the beer I’m drinking, and email that picture to a Tarpipe workflow, along with the name of the beer in the subject line and a list of tags rating the beer in the body.

The workflow uses the existing Tarpipe connectors to:

- post the picture on [Flickr](http://www.flickr.com/photos/qmacro/) with the beer name as the title and the rating words as tags, including a statically added ‘[beerrating](http://www.flickr.com/photos/qmacro/tags/beerrating/)‘
- have a short URL constructed via [TinyURL](http://tinyurl.com) for the new Flickr picture page (ok this is pre Kellan’s [rev=”canonical”](http://revcanonical.appspot.com/), and while Flickr already has such links the URLs are not exposed by Tarpipe’s Flickr connector)
- [dent the rating](http://identi.ca/qmacro), with the short picture URL, on identi.ca (which in turn, re-dents to [Twitter](http://twitter.com/qmacro) too)
- reply to the original email confirming that the beer was successfully rated

All in the space of a few clicks and drags! Here’s a shot of that workflow (with a couple of connectors partially obscured — it’s a [known bug in Tarpipe](http://getsatisfaction.com/tarpipe/topics/connector_moved_to_high_and_now_unable_to_delete_edit_it)):

![tarpipebeerrater]( {{ "/img/2009/04/tarpipebeerrater.png" | url }})

But what’s more fabulous: Tarpipe has been ideal for my son [Joseph](http://jcla1.com) to start up with programming, with me. And he finds it really interesting. Visual, direct feedback, using and connecting things and services he understands. Gone are the days of

```
10 PRINT "HELLO WORLD"
20 GOTO 10
```

on black and white low-res displays.

After explaining a few concepts, Joseph was totally up and away, building [his first workflow](http://www.flickr.com/photos/8583308@N05/3392375982/) which is pretty impressive! (I’m a biased, [proud dad](http://www.flickr.com/photos/qmacro/3397440933/) of course :-) And now we’re off looking at [Yahoo! Pipes](https://en.wikipedia.org/wiki/Yahoo!_Pipes) too, and he’s asking how we can link the two services together.

Hello, new programming world.


