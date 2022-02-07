---
layout: post
title: Creation & Reload of UI5 UIs in the Chrome Developer Console
tags:
- chromedevelopertools
- supporttool
- xmlviews
---


At the inaugural [SAP Architect & Developer Summit](http://bit.ly/anzsummit) last week, [one of the things that I did](/2014/10/19/speaking-at-the-sap-architect-developer-summit/) was prepare and deliver a 2 hour hands-on workshop: “[Learn To Drive Fiori Applications From Underneath And Level Up!](http://lanyrd.com/2014/sap-architect-and-developer-summit/sdfyrf/)“. This was a fun and successful workshop which focused on working within, and using the tools of, the powerful Chrome Developer Console. It triggered great conversations afterwards with some folks, including fellow SAP Mentor Matt Harding, who also [tweeted](https://twitter.com/mattharding/status/535968961221754880):

![image]({{ "/img/2014/11/Screen-Shot-2014-11-24-at-14.58.39.png" | url }})

One of the strands of the conversation with Matt, Nigel James & others was regarding the potential transient nature of the definition of views, or other smaller UI elements, created while working within the console. In the console you can quite easily build views in JavaScript (as the console is a JavaScript console!). Building machine readable, declarative views such as those based on XML or JSON is a little bit more cumbersome.

However, with a great feature of the UI5 Support Tool – Export to XML – we can indeed have our UI declared for us in XML, which is rather useful! Not only that, but we can then iterate by loading that generated XML back into Chrome.

While at SYD airport just now, waiting for my flight back home, I recorded a quick screencast to illustrate this. It shows the creation of a quick UI, using the manual console techniques we learned in my workshop. Then, the UI is exported as XML, which the Support Tool duly does for us, inside an XML View container. That exported XML View is then reloaded, and we can see of course that it is faithful to what was originally created.

<iframe allowfullscreen="" frameborder="0" height="469" src="http://www.youtube.com/embed/JPy7TxLpILg?feature=oembed" width="625"></iframe>

Share & enjoy!


