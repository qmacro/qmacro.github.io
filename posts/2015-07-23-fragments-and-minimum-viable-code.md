---
layout: post
title: Fragments and Minimum Viable Code
tags:
- fragment
- mvc
- openui5
- xmlfragments
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 20 by [DJ Adams](//qmacro.org/about/)**

In an earlier post in this series, [MVC – Model View Controller, Minimum Viable Code](/2015/07/21/mvc-model-view-controller-minimum-viable-code/), I showed how you could write a single-file UI5 app but still embrace and use the concepts of Model View Controller, having separate controller definitions and declarative XML Views. I also mentioned you could use XML Fragments in this way too, and [Robin van het Hof asked](https://twitter.com/Qualiture/status/623467858652200960) if I could explain how. So here we go, thanks Robin!

If we take the code from the previous post and run it, we end up with a UI that looks like this:

![]( {{ "/img/2018/02/Screen-Shot-2015-07-21-at-17.33.38-624x420.png" | url }})

Let’s add some behaviour to the Button so that it instantiates and opens a Dialog control. We’ll define this Dialog control in an XML Fragment.

In the same way that we defined the XML View, we’ll define the XML Fragment inside a script element, this time with a “ui5/xmlfragment” type, like this:

![]( {{ "/img/2018/02/Screen-Shot-2015-07-21-at-17.43.19-624x277.png" | url }})

It’s a standard XML Fragment definition, and even though it only contains a single root control –the Dialog — I’m using the Fragment Definition wrapper explicitly anyway (as I think it’s good practice).

When we press the Button, we want this Dialog to appear, like this:

![]( {{ "/img/2018/02/Screen-Shot-2015-07-21-at-17.39.49-624x422.png" | url }})

So let’s rewrite the handler “onPress” which is attached to the Button’s press event, so it now looks like this:

![]( {{ "/img/2018/02/Screen-Shot-2015-07-21-at-17.42.59-624x488.png" | url }})

This is a common pattern for fragments, so let’s examine the code line by line:

**48**: We’re going to be storing a reference to the Dialog fragment’s instance in a controller variable “_oDialogFragment” so we declare it explicitly, mostly to give those reading our code a clue as to our intentions.

**51-56**: Ensuring we only instantiate the Dialog once, we use the sap.ui.xmlfragment call, with the fragmentContent property, passing the content of the fragment script with jQuery’s help (remember, the name of the fragment script is “dialog”). Once instantiated we [add it as a dependent](http://stackoverflow.com/a/24640317/384366) to the current XML View.

**57**: At this stage we know we have a Dialog ready, so we just open it up.

**60-62**: The onClose function handles the press event of the “Close” Button in the Dialog’s buttons aggregation.

And that’s pretty much it. Use script elements to embed XML Views and Fragments, and use sap.ui.xmlview and sap.ui.xmlfragment to instantiate them, with jQuery to grab the actual content.


