---
layout: post
title: An introduction to sap.ui.define
tags:
- controller
- define
- modules
- openui5
- sap-ui-define
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 24 by [DJ Adams](//qmacro.org/about/)**

![]( {{ "/img/2018/02/Screen-Shot-2015-07-27-at-11.04.02.png" | url }})


If you’ve followed [this series](/2015/07/04/30-days-of-ui5/) you’ll have come across the [OpenUI5 Walkthrough](/2015/07/07/openui5-walkthrough/), a “a great multi-step walkthrough of many of the features and practices of UI5 development”.

In Step 5 of the walkthrough, on “Controllers”, we’re introduced to something that looks unfamiliar. Especially to those who have written large numbers of controllers thus far, for example. The way the XML View’s Controller is defined is … different. Step 5 doesn’t say much specifically about how this works, but Step 6, on “Modules”, does.

This is what the Controller source code looks like:

![]( {{ "/img/2018/02/Screen-Shot-2015-07-27-at-10.13.53-624x433.png" | url }})

So what’s happening here?

Well, what’s happening is that we’re seeing the beginning of a migration to an Asynchronous Module Definition (AMD) style mechanism. And the principle vehicle for this is a new function sap.ui.define, which was introduced to the world in 1.28 (1.27 internally).

There’s already some API documentation for this experimental new way to define modules that you can read in the API reference guide for sap.ui.define itself. There you’ll see how there’s a transition planned away from synchronous, and towards asynchronous loading. You’ll see for example that the optional fourth parameter “bExport” of sap.ui.define is there to support that transition.

While there’s plenty to read there, let’s just take a quick look at what it means for those like us at the UI5 coalface. We’ll take the code in the screenshot above as an example:

Instead of calling something like this …

```javascript
sap.ui.core.mvc.Controller.extend("your.name.here", {  
  // your controller logic here 
});
```

… we can use the new more generic sap.ui.define to first of all declare dependencies and then define the factory function that becomes the controller, in this case. Let’s take a look at the code and examine it line by line:

![]( {{ "/img/2018/02/Screen-Shot-2015-07-27-at-10.42.52-624x278.png" | url }})

**1-14**: The call to sap.ui.define extends across all the lines here; and we can see that out of the four total possible parameters described in the API reference, only two are used: the optional list of dependencies (represented here by the array) and the factory function that has a single statement returning an extended controller.

**2-3**: These are the dependencies. We’re defining a Controller, so we’ll want to extend UI5’s core controller (in the same way that we often do, such as in the example earlier). For that, we have a dependency on sap.ui.core.mvc.Controller. We’re also using the Message Toast’s “show” function, so we declare a dependency on sap.m.MessageToast. Note that the dependencies are expressed as resource paths (with the .js suffix omitted of course).

**4**: The second parameter passed in the call to sap.ui.define is the factory, and we can see the function definition start here. Note that each dependency reference is given to this factory function, in the same order that they’re declared in the dependency list. By convention, the most significant part of the resource path name is used for the parameter name (for example “Controller” for sap.ui.more.mvc.Controller).

**5**: The call to “use strict” is not specifically a feature of the new module definition syntax, but it is significant in that there is growing focus on JavaScript syntax correctness and linting. For more on this, see another post in this series: “[UI5 and Coding Standards](/2015/07/19/ui5-and-coding-standards/)“.

**7-12**: The rest of the source code looks fairly familiar. There’s one exception though, and it’s a result of the dependency mechanism described earlier. The function has “Controller” and “MessageToast” available to it, and so we can and should use these to refer to the sap.ui.core.mvc.Controller and sap.m.MessageToast resources throughout. This is nice, and makes for slightly neater code too.

It’s early days for the new define mechanism, and there’s clearly a journey ahead for those in the core UI5 team looking after fundamental module and dependency loading and management mechanisms. But even at this early stage, it’s worth paying attention to the direction UI5 is going in this regard, and start to experiment. I know I will be!


