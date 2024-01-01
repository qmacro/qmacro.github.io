---
layout: post
title: SAP and Google Wave - Conversation Augmentation
tags:
- sapcommunity
- appengine
- dashboard-tag
- http
- python
- rest
- sap
- wave
---
It's been pretty much six years to the day since [I last wrote here about Dashboard](/tags/dashboard/), Nat Friedman's project and implementation of a realtime contextual information system. So I thought it fitting to make a short demo showing integration between Google Wave and SAP, inspired by the cluepacket-driven style shown so nicely with Dashboard.

I got my Wave Sandbox account a week or so ago, and have had a bit of time to have a look at how robots and gadgets work — the two main Wave extension mechanisms. To get my feet wet, I built a robot, which is hosted in the cloud using Google App Engine, another [area of interest to me](/tags/appengine/), and the subject of this weblog entry. I used Python, but there's also a Java client library available too. You can get more info in the [API Overview](http://code.google.com/apis/wave/guide.html).

What this robot does is listen to conversations in a Wave, automatically recognising SAP entities and augmenting the conversation by inserting extra contextual information directly into the flow. In this example, the robot can recognise transport requests, and will insert the request's description into the conversation, lending a bit more information to what's being discussed.

The robot recognises transport requests by looking for a pattern:

```python
trkorr_match = re.search(' (SAPKw{6}|[A-Z0-9]{3}Kd{6}) ', text)
```

In other words, it's looking for something starting SAPK followed by six further characters, or something starting with 3 characters, followed by a K and six digits (the more traditional customer-orientated request format). In either case, there must be a space before and a space following, to be more sure of it being a 'word'.

How does it retrieve the description for a recognised transport request? Via a simple REST-orientated interface, of course :-) I use the excellent Internet Communication Framework (ICF) to build and host HTTP handlers so I can [expose SAP functionality and data as resources in a uniform and controlled way](/blog/posts/2004/06/24/forget-soap-build-real-web-services-with-the-icf/). Each piece of data worth talking about is a [first class citizen on the web](/blog/posts/2009/06/29/information-vs-behaviour/); that is, each piece of data is a resource, and has a URL.

So the robot simply fetches the default representation of the recognised request's 'description' resource. If the request was NSPK900115, the description resource’s URL would be something like:

```url
http://hostname:port/transport/request/NSPK900115/description
```

Once fetched, the description is inserted into the conversation flow.

![Screenshot of YouTube video](/images/2009/09/wave-video-screenshot.png)

[http://www.youtube.com/watch?v=G7W2M6H3OQo](http://www.youtube.com/watch?v=G7W2M6H3OQo)

[Originally published on SAP Community](https://blogs.sap.com/2009/09/07/sap-and-google-wave-conversation-augmentation/)


