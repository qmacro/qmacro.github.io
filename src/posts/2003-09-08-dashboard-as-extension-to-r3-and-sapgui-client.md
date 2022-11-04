---
layout: post
title: Dashboard as extension to R/3 and SAPGUI client
date: 2003-09-08
tags:
  - sapcommunity
---
How do your users work with SAP data? Exclusively through SAPGUI or with other desktop apps too? If it’s the latter, read on. Dashboard is an intriguing project headed up by [Nat Friedman](https://nat.org/). The concept is of a sidebar style window pane that is automatically populated on an ongoing basis with information related to whatever you’re doing, giving you extra context information that you can glance at while at work. Neat.

![An screenshot of an early version of Dashboard](/images/2003/09/dashboard.png)

I wrote about it after seeing Nat and Miguel (de Icaza) demonstrate it at their keynote at OSCON this year, in this post: [Dashboard, a compelling articulation for realtime contextual information](/blog/posts/2003/07/11/dashboard-a-compelling-articulation-for-realtime-contextual-information/).

I even hacked together a Dashboard backend that populated the dashboard with thumbnail pictures of books (from Amazon) when ISBNs were mentioned in conversations. It was my first C# project too – fun 🙂

**Update 08 Sep 2018**: This post came up on my “on this day” radar today, and it’s interesting to reflect how this has progressed. Dashboard itself is no more, but the ideas were solid, and in the SAP ecosphere we now have [SAP CoPilot](https://help.sap.com/docs/SAP_COPILOT), which takes many of the ideas of Dashboard and combines them with conversational UI and more.

![An image of SAP CoPilot, courtesy of experience.sap.com](/images/2018/09/copilot.png)

[Originally published on SAP Community](https://blogs.sap.com/2003/09/08/dashboard-as-extension-to-r3-and-sapgui-client/)
