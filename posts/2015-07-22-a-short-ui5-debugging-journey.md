---
layout: post
title: A Short UI5 Debugging Journey
tags:
- debugging
- openui5
- supporttool
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 19 by [DJ Adams](//qmacro.org/about/)**

In an earlier post in this [series](/2015/07/04/30-days-of-ui5/), entitled “[The UI5 Support Tool – Help Yourself!](/2015/07/18/the-ui5-support-tool-help-yourself/)“, we looked at the Support Tool, examining the information available in the Control Tree. In particular we looked at the Properties and Binding Infos tabs. While exploring the new UI5 1.30 features with the Explored app, I re-noticed a small addition to the Explored UI – a Button that allowed me to switch to full screen mode to view control samples.

![Fullscreen toggle example]( {{ "/img/2018/02/fullscreentoggle-624x349.gif" | url }})

I thought it would be fun to use the Support Tool and other debugging techniques to see what was exactly happening in the Explored app when we toggled that control.

**Identifying the Button**

First, we need to identify the Button control – by its ID. We can use a context menu feature of Chrome which will open up the Developer Tools: Right-click on the Button and select Inspect Element. This will show us the ID in the highlighted sections in the screenshot:

![]( {{ "/img/2018/02/Screen-Shot-2015-07-20-at-09.13.22-624x329.png" | url }})

Here, the full ID highlighted is “__xmlview2–toggleFullScreenBtn-img”, as we right clicked on the image part of the Button. Go up a couple of levels in the HTML element hierarchy and you’ll see the button tag with an ID without the “-img” suffix. That’s what we want.

**Stopping at the Press Event**

We could at this stage [play an instant](http://mtg.wikia.com/wiki/Instant) and use sap.ui.getCore().byId to get a handle on the control with this ID. But instead let’s look at the Support Tool and how it can expose event breakpoints.

Opening the Support Tool, and the Control Tree section within, we can search for the ID “__xmlview2–toggleFullScreenBtn”. When we find it, we can switch to the Breakpoints tab and set a breakpoint for the firePress function (as that is what will be happening when we press the Button – a “press” event will be fired):

![]( {{ "/img/2018/02/Screen-Shot-2015-07-20-at-09.18.35-624x220.png" | url }})

Now when we press the Button, we land inside Breakpoint.js:

![]( {{ "/img/2018/02/Screen-Shot-2015-07-20-at-09.22.29-624x329.png" | url }})

**Finding the Event Handler**

Now that we’re here, there’s plenty to explore, but let’s cut to the chase and look at the Button instance. In particular, we’ll look at an internal property “mEventRegistry” which is a map that holds the functions to be called when specific events are fired. Remember that this is an internal property, which we can’t use, or rely upon, when *building* apps (for more details on this, see the post “[JavaScript Do’s and Don’ts in UI5](/2015/07/04/javascript-dos-and-donts-for-ui5/)” in this series). But we’re not building, we’re debugging, so all bets are off.

The ‘this’ here is the Button control instance, and so we can see that the “this.mEventRegistry” map has an entry for “press”:

```javascript
this.mEventRegistry
-> Object {press: Array[1]}
```

Looking at this single entry in the array for the “press” event, we can see that the function handler is in a controller (surprise surprise):

```javascript
this.mEventRegistry["press"][0].fFunction
-> sap.ui.controller.onToggleFullScreen(oEvt)
```

Unless you’re using an older version of Chrome, you should be able to click on the function name to bring you to the “onToggleFullScreen” function definition:

![]( {{ "/img/2018/02/Screen-Shot-2015-07-20-at-09.29.55-624x222.png" | url }})

Nice!

**Examining What Happens**

We can now put a breakpoint on line 163 (which I had done already before taking the screenshot above) and hit continue, to be able to then step into what this function calls (the updateMode function) when the stack gets here. This is what the updateMode function looks like:

![]( {{ "/img/2018/02/Screen-Shot-2015-07-20-at-09.34.58-624x237.png" | url }})

It sets the Split App’s [mode](https://openui5.hana.ondemand.com/#docs/api/symbols/sap.m.SplitAppMode.html) to the appropriate value (the default of “ShowHideMode”, or “HideMode” for the full screen effect). It also modifies the containing [Shell](https://openui5.hana.ondemand.com/#docs/api/symbols/sap.m.Shell.html#getAppWidthLimited) control’s appWidthLimited property so that a real full screen effect can be properly achieved.

So that’s it! If you can become comfortable helping yourself with these tools, you’ll be a better UI5 developer.

 

 


