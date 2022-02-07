---
layout: post
title: 'Coffeeshop screencast: HTTP conneg, resource representations and JSON'
tags:
- appengine
- coffeeshop
- conneg
- http
- json
- perl
- pipeline
- pubsub
- rest
---


After [yesterday’s screencast](/2009/08/19/2nd-coffeeshop-resthttp-screencast/) showing the use of [coffeeshop](http://wiki.github.com/qmacro/coffeeshop) from the command line, here’s one that expands upon the direction I’m taking the implementation, following the [REST](http://en.wikipedia.org/wiki/Representational_State_Transfer)/HTTP philosophy. It shows, I hope, that embracing REST-orientated HTTP features, such as [content negotiation](http://en.wikipedia.org/wiki/Content_negotiation) (“conneg”), and the concepts of [resources and representations](http://bitworking.org/news/How_to_create_a_REST_Protocol), gives you a fantastically flexible and straightforward application protocol to work with and be guided by. (I’m [not](http://twitter.com/qmacro/status/3306694041) doing full-blown conneg, that will come later. But what I am doing works well for me).

<object data="http://www.youtube.com/v/NhAWH2-Quuk&hl=en&fs=1&" height="340" type="application/x-shockwave-flash" width="560"><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><param name="src" value="http://www.youtube.com/v/NhAWH2-Quuk&hl=en&fs=1&"></param><param name="allowfullscreen" value="true"></param></object>

[http://www.youtube.com/watch?v=NhAWH2-Quuk](http://www.youtube.com/watch?v=NhAWH2-Quuk)

In this shorter screencast, I continue on from where I left off — viewing the message detail resource in the web browser. I use conneg to request that same resource in [JSON](http://www.json.org/) instead of HTML, and show how the JSON representation can be easily parsed, and the data reused, further along the [pipeline](/2009/05/18/twitters-success/).


