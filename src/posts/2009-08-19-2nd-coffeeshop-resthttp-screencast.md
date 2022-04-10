---
layout: post
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


To follow on from the [first coffeeshop demo screencast](/2009/07/28/first-coffeeshop-demo-screencast/), I thought I’d make another. This time it’s to highlight the fact that [coffeeshop](http://wiki.github.com/qmacro/coffeeshop) is fundamentally a REST-orientated, HTTP-based pubsub application at the core, and not just a web-based application. Hopefully this comes across through the use of command-line HTTP tools to manipulate Channel, Subscriber and Message resources.

This time, the [coffeeshop](http://wiki.github.com/qmacro/coffeeshop) instance I’m using is one running on Google’s [App Engine](http://code.google.com/appengine/) cloud infrastructure — on [appspot.com](http://appgallery.appspot.com/).

<object data="http://www.youtube.com/v/TI48cdpWOBg&hl=en&fs=1&" height="340" type="application/x-shockwave-flash" width="560"><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><param name="src" value="http://www.youtube.com/v/TI48cdpWOBg&hl=en&fs=1&"></param><param name="allowfullscreen" value="true"></param></object>

[http://www.youtube.com/watch?v=TI48cdpWOBg](http://www.youtube.com/watch?v=TI48cdpWOBg)

In the screencast, I also make use of [Jeff Lindsay](http://progrium.com/)‘s great [Postbin](http://www.postbin.org/) tool for creating the recipient resources for the Subscribers. It was originally created to help debug [Webhooks](http://blog.webhooks.org/), but of course, a Subscriber is a sort of Webhook as well. (Postbin runs on App Engine too!).


