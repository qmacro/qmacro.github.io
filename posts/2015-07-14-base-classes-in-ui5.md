---
layout: post
title: Base Classes in UI5
tags:
- baseclass
- control
- element
- eventprovider
- managedobject
- metadata
- openui5
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 12 by [Thilo Seidel](https://twitter.com/ThiloDev)**

Learning your way around UI5 can be hard sometimes. With the new tutorials and improved structure in the developer guide, help on the journey to UI5 mastery has got better over the last few months.

But if you really want understand the UI5 magic in all its depth you might want to dig a little deeper. For my part I can truly recommend going back to the roots to have a look into the UI5 base classes. They are properly lined up like a string of pearls building upon each other and forming the high level architectural blueprint of the toolkit as a whole.

![baseclasses]( {{ "/img/2018/01/baseclasses.png" | url }})

All UI5 base classes come with a set of metadata, basically simple json that may hold additional information describing the instance. In addition this metadata has an underlying metadata implementation that provides helper functions, validation logic and some more convenience.

**sap.ui.base.Object**

This “instance plus metadata” concept is introduced already with sap.ui.base.Object, the first in line and mostly everything you want to instantiate in UI5 will be inheriting from it. Its children are mostly workers like classes taking care of parsing, or basic data carrying objects like the event implementation.

**sap.ui.base.EventProvider**

While Object is only setting the stage, sap.ui.base.EventProvider is the first to actually have capabilities to share. And you might have guessed it from the name already: the Event Provider introduces eventing in UI5. With functions to attach, detach and fire events, its toolkit is only small compared to what is still to come. Nevertheless, it is the starting point for most of the key features in UI5. Model, Binding, Router, at the heart they are all “just” Event Providers.

**sap.ui.base.ManagedObject**

Next in line is a heavyweight champion when you compare it with its predecessor: the sap.ui.base.ManagedObject. It is the herald for all instances that later will be rendered as it introduces properties, aggregations and associations in the metadata. It will never be rendered, but it sets the stage and extends the metadata implementation adding getters and setters for the fields that are introduced. Moreover it allows for data binding and might even have its own model. The most prominent example is the Component.

**sap.ui.core.Element**

The first base class that might have a place in the DOM is the sap.ui.core.Element. It has to be said that the Element itself has normally no renderer on its own and therefore is not to be placed standalone into the DOM. But it is the class you want to use in aggregations of your own controls with the list item as one of its best known subclasses. It is the one that completes the metadata implementation for base classes.

**sap.ui.core.Control**

Last up for this journey through UI5 architecture is the sap.ui.core.Control with children that are full blown UI elements. The last few thing that are still missing are introduced now. Besides direct DOM placement and the renderer it is basically picking up the last pieces with the busy-state and ability to handle browser events. And of course, every real UI-control has learned from Control.

**sap.ui.core.Core**

This post gives just the briefest of UI5 architecture overviews, covering only the bare essentials. There is much more to discover in that respect and I highly recommend you check out the entire package from GitHub and go exploring. There are definitely some gems hidden deep in the UI5 repository. Just one more for now, the sap.ui.core.Core, her majesty itself. And you might have guessed it, humble as she is, she downgraded herself recently and finally is nothing more than a (Base) Object.


