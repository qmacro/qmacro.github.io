---
layout: post
title: Multi language support out of the box - UI5's pedigree
tags:
- language
- locale
- messagepage
- multilingual
- openui5
- pedigree
- rtl
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 13 by [DJ Adams](//qmacro.org/about/)**

![Message Page control]( {{ "/img/2018/02/Screen-Shot-2015-07-14-at-18.10.05-624x415.png" | url }})

I was browsing through the controls that were new with 1.28, using the OpenUI5 SDK’s Explored app’s filter-by-release feature, and came across the [Message Page](https://openui5.hana.ondemand.com/explored.html#/entity/sap.m.MessagePage/samples) control.

What caught my eye was the text on the control. When you think about it, there aren’t that many controls that have default text on them.

Looking into how this would work in other locales (this control as you see it would only make immediate sense in English-speaking countries), and how the text was specified, led me down a path that ended up at a place that reminded me of OpenUI5’s pedigree. Born inside of SAP, the enterprise scale thinking permeates throughout the toolkit, and is very visible in this context.

In [the init function of MessagePage.js](https://github.com/SAP/openui5/blob/831caa234d1f4813e201ddf91722835e7760ec95/src/sap.m/src/sap/m/MessagePage.js#L105-L116) you can see that the control’s text property is being set to the value of the MESSAGE_PAGE_TEXT property in the message resource bundle:

![init function source code]( {{ "/img/2018/02/Screen-Shot-2015-07-14-at-18.29.21-624x175.png" | url }})

This [MESSAGE_PAGE_TEXT property in the base resource file messagebundle.properties](https://github.com/SAP/openui5/blob/2b3e49d661b285449f08d26d6a35440c59f7c8f4/src/sap.m/src/sap/m/messagebundle.properties#L552) has the value “No matching items found.”:

![looking for MESSAGE_PAGE_TEXT]( {{ "/img/2018/02/Screen-Shot-2015-07-14-at-18.38.56-624x64.png" | url }})

Even if you know only a little about how resource models work, you may realise that there’s more to it than this. There are actually 39 different translated versions of this base resource representing many languages (more specifically locales) into which this control (and other controls) have been translated:
![looking at languages]( {{ "/img/2018/02/Screen-Shot-2015-07-14-at-19.09.19-624x127.png" | url }})

Let’s have a look at a few (with the second grep I’m omitting those that have Unicode encodings, because they’re hard to read):

![looking at languages, reduced]( {{ "/img/2018/02/Screen-Shot-2015-07-14-at-19.13.36-624x109.png" | url }})

And of course, not only does UI5’s pedigree extend to just translations, right-to-left (RTL) is also supported, out of the box.

Let’s bring this post to a close with a couple of examples. Don’t forget you can explicitly specify the language or locale with a special query parameter “sap-language” in the URL.

Here’s [Hebrew](https://openui5.hana.ondemand.com/explored.html?sap-language=iw#/sample/sap.m.sample.MessagePage/preview) (“iw”), with RTL kicking in automatically:

![RTL in Hebrew]( {{ "/img/2018/02/iw3-624x358.png" | url }})

And to finish, how about [another language](https://openui5.hana.ondemand.com/explored.html?sap-language=fi#/sample/sap.m.sample.MessagePage/preview):

![Message page in Finnish]( {{ "/img/2018/02/Screen-Shot-2015-07-14-at-19.32.50-300x192.png" | url }})

(See what I did there? :-)

 


