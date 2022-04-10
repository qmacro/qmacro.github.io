---
layout: post
title: Merging lists with UI5
tags:
- customdata
- jquery
- openui5
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 22 by [Chris Choy](https://uk.linkedin.com/pub/christopher-choy/53/21/b71)**

Whilst recently developing a custom UI5 app with an SAP PI backend, I came across some useful mechanisms. My aim was to merge 2 sets of data from 2 service calls into an Object List Item.  Having already bound one set of data my XML View my initial thought was to perhaps use a formatter and pass in 2 arrays of objects and manipulate the data within the Formatter.js file. As you probably guessed, this simply didn’t work, I should mention that both service calls return data in a JSON format rather than standard OData. My next approach was to manipulate the 2 arrays in the View’s controller and merge them both into a new sorted array assigning it to the Component’s Model. One of the benefits of doing this is that you can define your own attribute names and data which is then globally accessible within the app.

Using the code below you can specify a path to set your new data:

```javascript
this.oModel.setProperty("/newPath", mergedArray);
```

One other related issue was the searching of specific object attributes within an array of objects. The context of this search was to allow a user to select an item from an Object List Item and load additional data in a new View. Having already passed the relevant parameters within my Router it was jQuery to the rescue. The jQuery.grep function allows you to perform wildcard search on an array of attributes without the need to manually loop through each element. By passing an array as an argument a test against a defined index is performed returning all the entries that satisfy the function as a new array.

```javascript
var aResult = $.grep(dataArray, function (e) { 
  return e.attributeName.indexOf(("searchAttribute",) == 0; 
});
```

One last interesting mechanism used was the storing of hidden Custom Data objects within an XML View. Using the following:

```
xmlns:app="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1" 

<ObjectListItem 
  title=”List” 
  app:key="{hiddenKey}" />
```
you can access the Custom Data object using the data() method within the Controller of your View.

For additional information checkout the following links [jQuery.grep](http://api.jquery.com/jquery.grep/) and [CustomData objects](http://help.sap.com/saphelp_uiaddon10/helpdata/en/91/f0c3ee6f4d1014b6dd926db0e91070/content.htm).

 


