---
layout: post
title: JavaScript Do's and Don'ts for UI5
tags:
- javascript
- openui5
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/)  &mdash; Day 7 by [DJ Adams](//qmacro.org/about/)**

![Screenshot of coding issues menu item]( {{ "/img/2018/02/Screen-Shot-2015-07-04-at-10.00.14.png" | url }})

In recent versions of the SDK you’ll find a new section called “[Coding Issues to Avoid](https://openui5.hana.ondemand.com/#docs/guide/030fcd14963048218488048f407f8f34.html)“. It’s great to see this take shape and start to become formalised. Some of them are obvious, at least to some folk, but it’s always helpful to have a reference.

Let’s have a look at a couple of the Do’s and Don’ts here.

The top item on my list is “Don’t use private and protected methods or properties of UI5″. Far too often, I see code that refers to internal properties of UI5 controls, especially to the arrays and maps that are managed internally (for the aggregations, for example). I think it’s fair to say that 98% of the time, the use here is totally wrong, and there’s a public API to give you what you want. There have been a couple of instances in the past where I’ve seen something for which there appeared no equivalent ‘legal’ alternative, but that could be down to API maturity, or lack of documentation.

Related to this item is almost the antithesis, which is to use (create) properties that inadvertently clobber properties of the same name in an existing context. A great example of this is within a controller definition. There’s a nice pattern, which can be seen in many places including the reference apps in the SAP Web IDE, where in any given controller you would create controller properties to refer to the related view, and often the domain or view properties model, in the init event, like this:

```javascript
sap.ui.controller("local.controller", {

  _oView : null,
 
  onInit : function() {
    this._oView = this.getView();
  },
 
  onSomeEvent : function(oEvent) {
    ...
    this._oView.someFunction(...);
    ...
  }
});
```

But sometimes the developer, averse to underscores, will write it like this:

```javascript
sap.ui.controller("local.controller", {

  oView : null,
 
  onInit : function() {
    this.oView = this.getView();
  },
 
  onSomeEvent : function(oEvent) {
    ...
    this.oView.someFunction(...);
    ...
  }
});
```

What actually happens is that the call to

```javascript
this.oView = this.getView();
```

is clobbering the internal property oView of ‘this’ (the controller), which is pointing at the view it’s related to. Luckily what it’s being clobbered with in this small (underscore-less) antipattern is another reference to the view itself, so not much immediate harm done, but it’s not entirely safe or future proof.

Another interesting best practice described in this section of the SDK relates to internationalisation (i18n). What one should do is to use placeholders (such as {0}) in more complete sentences in translateable resources. What one often finds is that application texts are fragmented into short phrases and built up with concatenation, along with variables.

The problem is that sentence structure varies across languages – as described in the “Don’t” example in this section, a typical example is where the verb goes. It’s better to avoid programmatic text construction, and leave it to the translation experts. Go long, and go home.

Anyway, have a look at the rest of this [JavaScript Code Issues](https://openui5.hana.ondemand.com/#docs/guide/030fcd14963048218488048f407f8f34.html) section in the SDK, plus there’s a [CSS Styling Issues](https://openui5.hana.ondemand.com/#docs/guide/9d87f925dfbb4e99b9e2963693aa00ef.html) section too!


