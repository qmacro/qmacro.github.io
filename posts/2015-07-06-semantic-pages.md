---
layout: post
title: Semantic Pages
tags:
- abstraction
- openui5
- scaffolding
- semanticpage
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/)  &mdash; Day 3 by [DJ Adams](//qmacro.org/about/)**

![image]({{ "/img/2018/01/download1-1.jpeg)](http://www.bloomsbury.com/au/primer-of-greek-grammar-9780715612583/" | url }})

(This book was a close companion in an earlier life.)

My degree in Latin and Greek is not entirely without foundation or reason, and it provides me with at least a small sense of origin when it comes to words. The 3rd declension noun [σῆμα](https://en.wiktionary.org/wiki/%CF%83%E1%BF%86%CE%BC%CE%B1) conveys the idea of a mark, a sign, a token. It refers to “meaning”, essentially, and the use in modern languages of the word semantic often implies an abstraction, a layer that confers or allows meaning to be defined or carried.

What has that got to do with UI5 reaching release 1.30? Well, take a look at the fledgling [Semantic Page](https://openui5beta.hana.ondemand.com/explored.html#/entity/sap.m.semantic.SemanticPage/samples). It’s the root of a series of new controls that are perhaps set to encourage standardisation of Fiori UIs. The [SAP Fiori Design Guidelines](http://experience.sap.com/fiori-design/) describe a rich set of controls, but more importantly they describe how those controls should be typically employed.

Floorplans such as the [Split Screen Layout](http://experience.sap.com/fiori-design/floorplans/split-screen/) and the [Full Screen](http://experience.sap.com/fiori-design/floorplans/full-screen/) are all fairly familiar to us. But consistency comes from attention to a more granular level of detail, and the UI designers are encouraged to place certain controls in standard places. A couple of examples: Action buttons belong in the bottom right (in the footer) of a page, while the new [Message Popover](https://openui5.hana.ondemand.com/explored.html#/entity/sap.m.MessagePopover/samples) from 1.28 belongs in the bottom left.

When SAP created Fiori application developer teams across the world to build out [the Fiori apps that we see available today](fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/), it was almost inevitable that the different styles and approaches across teams and members would have resulted in a variety of structures, making it difficult to get the UX right, the UI consistent, and causing maintenance headaches. So SAP created scaffolding (sap.ca.scfld), a set of mechanisms that abstracted away a lot of the common boilerplate stuff allowing the developers to focus on the application logic (and preventing them from reinventing the boilerplate, slightly differently, every time). But this scaffolding was a little bit too monolithic, and I think the plan has been to phase it out.

![Semantic Page Master-Detail]( {{ "/img/2018/01/Screen-Shot-2015-07-05-at-20.49.53-300x231.png" | url }})

I’m also thinking that the alternative could involve this set of semantic controls. Take a look at the way the [Semantic Page Master-Detail sample](https://openui5beta.hana.ondemand.com/explored.html#/sample/sap.m.sample.SemanticPage/preview) puts things in the appropriate place – at a semantically meaningful level of abstraction above the individual mechanics of a Page control’s aggregations, for example.

It’s similar in the [Semantic Page Full Screen sample](https://openui5beta.hana.ondemand.com/explored.html#/sample/sap.m.sample.SemanticPageFullScreen/preview) too. To get a feel for this level of abstraction, [take a look](https://openui5beta.hana.ondemand.com/explored.html#/sample/sap.m.sample.SemanticPageFullScreen/code) at how the aggregations are filled – nowhere in this XML view definition does it say *where* the semantic controls should go:

![]( {{ "/img/2018/01/Screen-Shot-2015-07-05-at-20.57.35.png" | url }})

What we seem to have so far is a small hierarchy of Page based controls, that looks like this:

```
     SemanticPage 
          | 
    +----------------------+
    |                      | 
MasterPage          ShareMenuPage
                           |
                   +---------------+
                   |               |
               DetailPage    FullscreenPage
```

And there are [plenty of semantic controls too](https://openui5beta.hana.ondemand.com/index.html#docs/api/symbols/sap.m.semantic.html). It doesn’t replace the breadth of functionality that the scaffolding offered, but it’s a start, and it feels more modular. A namespace to watch!


