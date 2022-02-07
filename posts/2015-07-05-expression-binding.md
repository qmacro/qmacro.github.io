---
layout: post
title: Expression Binding
tags:
- binding
- embeddedbinding
- expressionbinding
- formatter
- openui5
- ui5
- 30ui5
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/)  &mdash; Day 2 by [DJ Adams](//qmacro.org/about/)**

![Expression Binding samples]( {{ "/img/2018/01/Screen-Shot-2015-07-05-at-13.34.07.png" | url }})

The expression binding feature was [introduced with version 1.28](https://openui5.hana.ondemand.com/#docs/guide/99ac68a5b1c3416ab5c84c99fefa250d.html), and allows logic to be included directly in an embedded binding. It’s a very useful feature, but a double edged sword that should be wielded with care.

Before expression bindings, any embedded binding that required a condition to be checked, or a calculation to be made, or a reformatting to happen, needed a reference to a formatter function that would either be in a dedicated formatter module (common), or in the controller (less common). When using XML views, for example, the Model-View-Controller philosophy remained strong, in that any imperative computation remained separate from the pure declarative UI definitions.

But in practice you find yourself creating a *lot* of formatter functions. Yes, some of them could be probably be refactored, and if you had time, you could probably find that library of common formatter functions that you’d been half building in your copious free time. Regardless, you end up with a lot of helper functions, small and large, that sometimes become a maintenance burden.

Enter expression bindings. If you’re prepared to add sugar and milk to your coffee, if you’re prepared to sacrifice the absolute purity of MVC for the sake of brevity, then expression bindings can be your friend.

Here’s an [example](http://jsbin.com/wivuku/18/edit):

<a class="jsbin-embed" href="http://jsbin.com/wivuku/18/embed?html,js,output">JS Bin on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?4.1.2"></script>

The greeting is created in three different ways. First, we use a function inside a formatter. Then, we use the same function but in the controller that is linked to the view (note the dot prefix in the value of the formatter property, specifying that the function is to be found in the controller). Finally, we have the same example in an expression binding, directly in the view.

Those who have had their coffee already today (milk and sugar optional) may have noticed something unusual in the expression binding example. Instead of having the literal “Good” outside of the embedded binding curly brackets, like this:

```html
<Input
  enabled="false" 
  description="Expression" 
  value="Good {= ${/now}.getHours() > 11 ? 'afternoon' : 'morning'}" />
```

… it’s like this, instead:

```html
<Input enabled="false"
  description="Expression"
  value="{= 'Good ' + (${/now}.getHours() > 11 ? 'afternoon' : 'morning')}" />
```
(Note the extra parentheses in this version).

This is because, currently, any literal string outside of the curly braces is rejected by the runtime.

Anyway, expression bindings are here, and they may be the sort of thing that you’re looking for. Possibly exactly what you’re looking for, if you’re considering [XML Templating](https://openui5.hana.ondemand.com/#docs/guide/5ee619fc1370463ea674ee04b65ed83b.html). But that’s a post for another time.


