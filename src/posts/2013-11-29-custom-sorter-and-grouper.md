---
layout: post
title: Custom Sorting and Grouping
date: 2013-11-29
tags:
  - sapcommunity
---
*Learn how to control the order of groups in a sorted list. You don't do it directly with the grouper function, you do it with the sorter function.*

One of the features of the app that the participants build in the CD168 sessions at SAP TechEd Amsterdam is a list of sales orders that can be grouped according to status or price (the screenshot shows the orders grouped by price).

![Screenshot of an example of grouping by price](/images/2013/11/groupbyprice.png)

This is achieved by specifying a value for the vGroup parameter on the Sorter, as documented in the [sap.ui.model.Sorter API reference](https://sapui5.hana.ondemand.com/sdk/#docs/api/symbols/sap.ui.model.Sorter.html):

_Configure grouping of the content, can either be true to enable grouping based on the raw model property value, or a function which calculates the group value out of the context (e.g. oContext.getProperty("date").getYear() for year grouping). The control needs to implement the grouping behaviour for the aggregation which you want to group._

So what this means is that you either specify a boolean true value, or the name of a function.

* use a boolean true to have the entries grouped "naturally" by their value: useful and useable where you have texts that will be the same for some entries
* specify the name of a function that will do some custom grouping: useful where you have numeric values that you might want to group into sizes or ranges

Here in the example in the screenshot on the left, we're using a custom grouper function to arrange the sales orders into value groups (less than EUR 5000, less than EUR 10,000 and more than EUR 10,000).

## Group Order Challenge

But what if you wanted to influence not only the sort but also the order of the groups themselves? Specifically in this screenshot example, what if we wanted to have the "< 5000 EUR" group appear first, then the "> 10,000 EUR" group and finally the "< 10,000 EUR" group? (This is a somewhat contrived example but you get the idea). This very question is one I was asking myself while preparing for the CD168 session, and also one I was asked by an attendee.

To understand how to do it, you have to understand that the relationship between the sorter and the grouper can be seen as a "master / slave" relationship. This is in fact reflected in how you specify the grouper - as a subordinate of the master.

**The sorter drives everything, and the grouper just gets a chance to come along for the ride.**

So to answer the question, and to illustrate it in code step by step, I've put together an example. It takes a simple list of numbers 1 to 30 and displays them in a list, and groups them into three size categories. You can specify in which order the groups appear, but the key mechanism to achieve this, as you'll see, is actually in the sorter.

## Simple and Complex Sorting

To understand further, you have to remember that there's a simple sorter specification and a more complex one. Using a simple sorter is often the case, and you'd specify it like this:

```javascript
new sap.m.List("list", {
    items: {
        path: '/records',
        template: new sap.m.StandardListItem({
            title: '{amount}'
        }),
        sorter: new sap.ui.model.Sorter("amount") // <---
    }
})
```

This is nice and simple and sorts based on the value of the amount property, default ascending.

The complex sorter is where you can specify your own custom sorting logic, and you do that by creating an instance of a Sorter and then specifying your custom logic for the fnCompare function.

We'll be using the sorter with its own custom sorting logic.

## Step By Step

So here's the example, described step by step. It's also available as a Gist on Github: [Custom Sorter and Grouper in SAPUI5](https://gist.github.com/qmacro/7702371) and exposed in a runtime context using the bl.ocks.org facility: <http://bl.ocks.org/qmacro/7702371>.

As the source code is available in the Gist, I won't bother showing you the HTML and SAPUI5 bootstrap, I'll just explain the main code base.

```javascript
var sSM = 10;  // < 10  Small
var sML = 15;  // < 15  Medium
               //   15+ Large
```

Here we just specify the boundary values for chunking our items up into groups. Anything less than 10 is "Small", less than 15 is "Medium", otherwise it's "Large". I've deliberately chosen groupings that are not of equal size (the range is 1-30) just for a better visual example effect.

```javascript
// Generate the list of numbers and assign to a model
var aValues = [];
for (var i = 0; i < 30; i++) aValues.push(i);
sap.ui.getCore().setModel(
    new sap.ui.model.json.JSONModel({
        records: aValues.map(function(v) { return { value: v }; })
    })
);
```

So we generate a list of numbers (I was really missing Python's xrange here, apropo of nothing!) and add it as a model to the core.

```javascript
// Sort order and title texts of the S/M/L groups
var mGroupInfo = {
    S: { order: 2, text: "Small"},
    M: { order: 1, text: "Medium"},
    L: { order: 3, text: "Large"}
}
```

Here I've created a map object that specifies the order in which the Small, Medium and Large groups should appear in the list (Medium first, then Small, then Large). The texts are what should be displayed in the group subheader/dividers in the list display.

```javascript
// Returns to what group (S/M/L) a value belongs
var fGroup = function(v) {
    return v < sSM ? "S" : v < sML ? "M" : "L";
}
```

This is just a helper function to return which size category (S, M or L) a given value belongs to.

```javascript
// Grouper function to be supplied as 3rd parm to Sorter
// Note that it uses the mGroupInfo, as does the Sorter
var fGrouper = function(oContext) {
    var v = oContext.getProperty("value");
    var group = fGroup(v);
    return { key: group, text: mGroupInfo[group].text };
}
```

Here's our custom Grouper function that will be supplied as the third parameter to the Sorter. It pulls the value of the property from the context object it receives, uses the fGroup function (above) to determine the size category, and then returns what a group function should return - an object with key and text properties that are then used in the display of the bound items.

```javascript
// The Sorter, with a custom compare function, and the Grouper
var oSorter = new sap.ui.model.Sorter("value", null, fGrouper);
oSorter.fnCompare = function(a, b) {
    // Determine the group and group order
    var agroup = mGroupInfo[fGroup(a)].order;
    var bgroup = mGroupInfo[fGroup(b)].order;
    // Return sort result, by group ...
    if (agroup < bgroup) return -1;
    if (agroup > bgroup) return  1;
     // ... and then within group (when relevant)
    if (a < b) return -1;
    if (a == b) return 0;
    if (a > b) return  1;
}
```
Here's our custom Sorter. We create one as normal, specifying the fact that we want the "value" property to be the basis of our sorting. The 'null' is specified in the ascending/descending position (default is ascending), and then we specify our Grouper function. Remember, the grouper just hitches a ride on the sorter.

Because we want to influence the sort order of the groups as well as the order of the items within each group, we have to determine to what group each of the two values to be compared belong. If the groups are different, we just return the sort result (-1 or 1) at the group level. But if the two values are in the same group then we have to make sure that the sort result is returned for the items themselves.

```javascript
// Simple List in a Page
new sap.m.App({
    pages: [
        new sap.m.Page({
            title: "Sorted Groupings",
            content: [
                new sap.m.List("list", {
                    items: {
                        path: '/records',
                        template: new sap.m.StandardListItem({
                            title: '{value}'
                        }),
                        sorter: oSorter
                    }
                })
            ]
        })
    ]
}).placeAt("content");
```

And that's pretty much it. Once we've done the hard work of writing our custom sorting logic, and shared the group determination between the Sorter and the Grouper (DRY!) we can just specify the custom Sorter in our binding of the items.

And presto! We have what we want - a sorted list of items, grouped, and those groups also in an order that we specify.

![Sorted groupings example screenshot](/images/2013/11/sortedgroupings.png)

## Post Script

There was a comment on this post which was very interesting and described a situation where you want to sort, and group, based on different properties. This is also possible. To achieve sorting on one property and grouping based on another, you have to recall that you can pass either a single Sorter object or an array of them, in the binding.

So let's say you have an array of records in your data model, and these records have a "beerName" and a "beerType" property. You want to group by beerType, and within beerType you want the actual beerNames sorted.

In this case, you could have two Sorters: One for the beerType, with a Grouper function, and another for the beerName. Like this:

```javascript
var fGrouper = function(oContext) {
    var sType = oContext.getProperty("beerType") || "Undefined";
    return { key: sType, value: sType }
}
new sap.m.App({
    pages: [
        new sap.m.Page({
            title: "Craft Beer",
            content: [
                new sap.m.List("list", {
                    items: {
                        path: '/',
                        template: new sap.m.StandardListItem({
                            title: "{beerName}",
                            description: "{beerType}"
                        }),
                        sorter: [
                            new sap.ui.model.Sorter("beerType", null, fGrouper),
                            new sap.ui.model.Sorter("beerName", null, null)
                        ]
                    }
                })
            ]
        })
    ]
}).placeAt("content");
```

I've put [a complete example](https://github.com/qmacro/sapui5bin/blob/master/SortingAndGrouping/TwoProperties.html) together for this, and it's in the [sapui5bin Github repo](https://blogs.sap.com/?p=79248).

And while we're on the subject of code examples, there's a [complete example for the main theme of this post](https://github.com/qmacro/sapui5bin/blob/master/SortingAndGrouping/SingleProperty.html) too.

Share & enjoy!

---

[Originally published on SAP Community](https://blogs.sap.com/2013/11/29/custom-sorter-and-grouper/)
