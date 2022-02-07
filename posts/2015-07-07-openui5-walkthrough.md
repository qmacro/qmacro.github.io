---
layout: post
title: OpenUI5 Walkthrough
tags:
- explored
- openui5
- walkthrough
- 30ui5
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/)  &mdash; Day 5 by [DJ Adams](//qmacro.org/about/)**

![A tile with a link to sap.m.Explored]( {{ "/img/2018/01/Screen-Shot-2015-07-04-at-11.03.14.png" | url }})
Explored, before its promotion.

OpenUI5, like its twin sibling SAPUI5, has a great [SDK](https://openui5.hana.ondemand.com/).

The SDK contains plenty of example code snippets, especially in the Explored app. Up until version 1.20 the Explored app was “just another” app in the Demo Apps section, but after that it was (rightly) promoted to prominence at the top level of the SDK menu structure.

The latest addition to Explored is a set of [code examples](https://openui5beta.hana.ondemand.com/explored.html#/entity/sap.m.tutorial.walkthrough/samples) that accompany a great multi-step [walkthrough](https://openui5beta.hana.ondemand.com/#docs/guide/3da5f4be63264db99f2e5b04c5e853db.html) of many of the features and practices of UI5 development. A number of things are changing in release 1.30, including the introduction of the application descriptor, and a new way of defining modules. This walkthrough covers these topics and many others too. It’s well worth a look.

One thing that immediately caught my eye was when I selected the appropriate Explored sample that corresponded to Step 30 of the walkthrough, describing the [Debugging Tools](https://openui5beta.hana.ondemand.com/#docs/guide/1ff250c2038849f5991209f7e6c36f1f.html) : the excellent UI5 Diagnostics Tool popped up out of nowhere!

![UI5 Diagnostics Tool screenshot]( {{ "/img/2018/01/Screen-Shot-2015-07-04-at-11.11.43-300x112.png" | url }})

(I’m a big fan of this tool; there’s so much information it offers, as a UI5 developer you can’t afford to ignore its help.)

I was curious as to how this automatic opening of the tool had been achieved, and a quick look at the appropriate webapp/Component.js asset in the [sample’s code section](https://openui5beta.hana.ondemand.com/explored.html#/sample/sap.m.tutorial.walkthrough.30/code) gave me the answer:

```javascript
jQuery.sap.require("sap.ui.core.support.Support"); 
var oSupport = sap.ui.core.support.Support.getStub("APPLICATION"); oSupport.openSupportTool();
```

Nice!


