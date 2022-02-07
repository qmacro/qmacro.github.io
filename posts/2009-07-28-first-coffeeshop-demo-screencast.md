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

<object data="http://www.youtube.com/v/1E_1B8TD6Kw&hl=en&fs=1&rel=0" height="340" type="application/x-shockwave-flash" width="560"><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><param name="src" value="http://www.youtube.com/v/1E_1B8TD6Kw&hl=en&fs=1&rel=0"></param><param name="allowfullscreen" value="true"></param></object>

[http://www.youtube.com/watch?v=1E_1B8TD6Kw](http://www.youtube.com/watch?v=1E_1B8TD6Kw)

The screencast shows the creation of a channel, the addition of a couple of subscribers to that channel, the publishing of a message to that channel, and the subsequent delivery of that message to the subscribers. I draw attention to the use of the browser-based part of the implementation, and to the asynchronous nature of the message distribution (I had to do this anyway, as on the App Engine SDK development server, tasks are not executed automatically — you have to start them manually in the admin console).


