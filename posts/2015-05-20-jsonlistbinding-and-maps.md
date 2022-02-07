---
layout: post
title: JSON List Binding and maps
tags:
- aggregation
- binding
- json
- ui5
---


This morning, on a long train journey up from near Reading to Barnsley, I was hacking on a UI5 app. I had a custom module to munge some JSON data into the shape I needed, and was binding the items aggregation of a List control to part of the resulting data structure.

In the developer console, I was examining the data structure in the JSON Model that was set on the List, and did a double-take. I’d mistakenly generated a map rather than an array, as the value of the property to which I wanted to bind the items aggregation. Naturally, I thought, it needed to be an array, but I had spotted that it was a map – the output of a nice little reduce function I was nicely proud of, with my functional JavaScript hat on (but that’s another story).

So I looked across to the app itself, expecting the List to be empty. But it wasn’t! It was showing exactly what I had expected to see, had the value of the property been an array. What was going on?!

After some digging, I found out. Introduced on 10 Dec 2014, within the 1.28.0 release, was a modest feature:

<address>**[[FEATURE] sap.ui.model.json.JSONListBinding: iterate over maps](https://github.com/SAP/openui5/commit/38ab764601c061d5fbf256f8bb4703cd4ec89022)**  
 Enhance JSONListBinding to iterate over maps (by key), not just over  
 arrays (by index).</address>Interesting! A small modification to the JSON List Binding to treat the indices of a map as if they were of an array. After all, in JavaScript, arrays and maps are perhaps more closely related than one might think.

I set about confirming what I’d found with a small test on Plunkr, “[Aggregation Binding Test](http://plnkr.co/edit/QQU4bPNb5Kg65vZ8vnad?p=preview)“:

![image]({{ "/img/2015/05/Screen-Shot-2015-05-20-at-19.11.18.png" | url }})

But don’t take my word for it – the author has also added a test to the [JSON List Binding QUnit tests](https://openui5.hana.ondemand.com/test-resources/sap/ui/core/qunit/JSONListBinding.qunit.html):

![image]({{ "/img/2015/05/Screen-Shot-2015-05-20-at-19.14.05.png" | url }})

It makes sense to blur the distinction between maps and arrays when it comes to aggregation bindings; already I have a use for it, and I didn’t even know the feature had been implemented!


