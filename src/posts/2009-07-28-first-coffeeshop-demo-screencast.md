---
layout: post
title: First coffeeshop demo screencast
tags:
- appengine
- coffeeshop
- http
- pubsub
- rest
- screencast
---


To demonstrate some of the basic [coffeeshop](http://wiki.github.com/qmacro/coffeeshop) features, I put together a screencast, and after getting over the shock of hearing my own voice in the recorded voiceover ([last time](https://www.sdn.sap.com/irj/scn/weblogs?blog=/pub/wlg/1669) I chickened out and just typed what I wanted to say), I put it up on YouTube:

<iframe width="560" height="315" src="https://www.youtube.com/embed/1E_1B8TD6Kw?si=6qumn4Rmc5HJ5--i" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[http://www.youtube.com/watch?v=1E_1B8TD6Kw](http://www.youtube.com/watch?v=1E_1B8TD6Kw)

The screencast shows the creation of a channel, the addition of a couple of subscribers to that channel, the publishing of a message to that channel, and the subsequent delivery of that message to the subscribers. I draw attention to the use of the browser-based part of the implementation, and to the asynchronous nature of the message distribution (I had to do this anyway, as on the App Engine SDK development server, tasks are not executed automatically — you have to start them manually in the admin console).
