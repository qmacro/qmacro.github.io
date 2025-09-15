---
date: 2009-08-19
title: 2nd coffeeshop REST/HTTP screencast
tags:
- appengine
- coffeeshop
- http
- perl
- postbin
- pubsub
- rest
---


To follow on from the [first coffeeshop demo screencast](/blog/posts/2009/07/28/first-coffeeshop-demo-screencast/), I thought I’d make another. This time it’s to highlight the fact that [coffeeshop](http://wiki.github.com/qmacro/coffeeshop) is fundamentally a REST-orientated, HTTP-based pubsub application at the core, and not just a web-based application. Hopefully this comes across through the use of command-line HTTP tools to manipulate Channel, Subscriber and Message resources.

This time, the [coffeeshop](http://wiki.github.com/qmacro/coffeeshop) instance I’m using is one running on Google’s [App Engine](http://code.google.com/appengine/) cloud infrastructure — on [appspot.com](http://appgallery.appspot.com/).

<iframe width="560" height="315" src="https://www.youtube.com/embed/TI48cdpWOBg?si=RpV5djGPjMqJI8zb" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[http://www.youtube.com/watch?v=TI48cdpWOBg](http://www.youtube.com/watch?v=TI48cdpWOBg)

In the screencast, I also make use of [Jeff Lindsay](http://progrium.com/)‘s great [Postbin](http://www.postbin.org/) tool for creating the recipient resources for the Subscribers. It was originally created to help debug [Webhooks](http://blog.webhooks.org/), but of course, a Subscriber is a sort of Webhook as well. (Postbin runs on App Engine too!).
