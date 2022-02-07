---
layout: post
title: UI5 and Coding Standards
tags:
- coding
- contribution
- guidelines
- openui5
- standards
- xmlviews
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 16 by [DJ Adams](//qmacro.org/about/)**

![Y-U-NO meme]( {{ "/img/2018/02/Screen-Shot-2015-07-19-at-07.09.23.png" | url }})

At one end of the spectrum, coding standards can be regarded as [essential](https://jaxenter.com/power-ten-nasas-coding-commandments-114124.html). At the other, they’re the subject of many a passionate debate, second perhaps only to the Vim vs Emacs [editor wars](https://en.wikipedia.org/wiki/Editor_war).

I’ll provide some caution by starting with one of my favourite quotes from Andrew Tanenbaum: 

*“The nice thing about standards is that there are so many of them to choose from”.*

**Use of standards**

As software projects scale up, coding standards make more and more sense. On a [recent run](https://www.endomondo.com/users/1074038/workouts/555294655), I listened to the JavaScript Jabber podcast “[JSJ ESLint with Jamund Ferguson](http://devchat.tv/js-jabber/162-jsj-eslint-with-jamund-ferguson)“. There was a great discussion about ESLint, and it was interesting to see the different perspectives on imposed coding standards, from “it restricts my freedom of expression” to “it makes teams more efficient as they work more as one”. I think those two perspectives slot roughly onto the scale spectrum. If it’s just you developing, then by all means use whatever style you feel like using. But if you’re part of a larger team whose members have to work with each other’s code, imposed coding standards do make a lot of sense.

The OpenUI5 project has some coding [contribution guidelines](https://github.com/SAP/openui5/blob/master/CONTRIBUTING.md#contribute-code) as well as [ESLint rules](https://github.com/SAP/openui5/blob/master/.eslintrc), well worth checking out, and pretty important if you want to contribute to UI5. It’s also worth considering them for your own UI5 applications. One advantage of adopting the OpenUI5 project’s guidelines and rules is that when you cross the path from your codebase into the underlying UI5 toolkit, the transition won’t be as jarring.

**Example XML View**

The ESLint rules, and ESLint in general would cause this post to be a lot longer than I want, so instead I’ll look at some non-JavaScript conventions that I like to try and impose, at least upon myself. In particular I’ll look at the style for XML View definitions. Here’s part a sample XML View, which I’ll use to illustrate the style for which I strive. Note that the “»” character represents a tab (I have the list mode turned on in my editor to [show invisibles](http://vimcasts.org/episodes/show-invisibles/)).

![sample code]( {{ "/img/2018/02/Screen-Shot-2015-07-19-at-09.40.55.png" | url }})

In the following, each prefix represents the line number(s) to which I’m referring.

**1**: The correct namespace for a [View](https://openui5.hana.ondemand.com/#docs/api/symbols/sap.ui.core.mvc.View.html) is “sap.ui.core.mvc”, not “sap.ui.core” as you might have seen in older documentation and code examples.

**2**: The controllerName attribute should be the first attribute for the View element. If there is no controller then obviously this attribute won’t be present. It just makes it slightly quicker to look for the controller reference if it’s going to be consistently in the same place.

**3-5**: All the namespace declarations should be in a contiguous chunk. There are other attributes that might appear for a View element, that’s fine, as long as they’re not interspersed amongst the namespace declarations. Ensure any other attributes appear before the namespace declarations. Also, don’t specify a namespace declaration unless you’re going to use it. (In this example, I’m using all of them; you just can’t see the use of the “core” here as it’s on line 60, not in the screenshot).

**5**: The default XML namespace for any given XML View should be the one that is dominant in the file, or “sap.m”. If you’re building responsive UI5 apps, you’re going to need a good reason for “sap.m” *not* to be the dominant library. Also, it should be the last attribute in the View element, with a closing angle bracket directly following. (Unlike the use of other angle-bracket powered markup (such as HTML) in UI5, this is a rule that can be applied consistently. With the UI5 bootstrap in HTML, I like to have the closing angle bracket on a separate line, in the ‘prefix-comma’ style from ABAP and other code, so I can add further data attributes without causing diff confusion.)

**1-5, 6-7, 11-13 etc**: All attributes should appear on lines of their own, indented appropriately.

**13**: When closing an element directly (like this: <element /> rather than this: <element>…</element>), a space should be used before the closing “/>”.

**8, 17, 22, 29, etc**: All aggregation elements should be used explicitly. Don’t omit implicit default aggregations for controls; instead, specify them. In this example, I’m using a sap.m.Page control, with the “subHeader” and “content” aggregations. While the “subHeader” aggregation must be specified explicitly anyway, the “content” aggregation is default and doesn’t need to be, but I do anyway. The same goes for the sap.m.List control’s “items” aggregation.

**18**: Contrary to the rule about attributes being on their own separate lines, there’s an exception to this which is for the id attribute. If it exists, put it on the same line as the opening part of the control’s element.

**25**: Unless there’s a good reason not to, create the names for your event handler functions using an “on” prefix (like here: “onSelect”). This way they’re consistent with the builtin view lifecycle event functions such as “onInit”.

**31-34**: When writing complex embedded binding syntax, put each property of the map on a separate line, in the same way you’d write a map in JavaScript. Use spaces before and after the colons.

**1-34**: Use double quotes throughout; the only place you’ll then use single quotes is within embedded binding syntax. Also … I know this is the subject of much debate, but the OpenUI5’s project standard specifies tabs for indentation. It came as a shock to me at first, but I have now embraced it :-)

**Conclusion**

I have no doubt caused some outrage to some of you, but hopefully just as much agreement with others. For me, this sample XML View is easy to read, a lot easier than some of the Fiori views that are generated from templates, for example. What are your standards?


