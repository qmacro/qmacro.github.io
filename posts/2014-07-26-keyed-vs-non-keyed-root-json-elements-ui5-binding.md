---
layout: post
title: Keyed vs Non-Keyed Root JSON Elements & UI5 Binding
tags:
- databinding
- multicombobox
- openui5
- sapui5
- ui5
---


In a screencast this week ([OpenUI5 MultiComboBox First Look](https://www.youtube.com/watch?v=0UIyKoiZ-gE)) I explicitly used the model mechanism’s requestCompleted event to get to the model data and manipulate it, adding a key to the root array. Initially the data looked like this:

![image]({{ "/img/2014/07/Screen-Shot-2014-07-26-at-14.20.21.png" | url }})

and I added a key to this root array so it looked like this:

![image]({{ "/img/2014/07/Screen-Shot-2014-07-26-at-14.23.44.png" | url }})

I did this programmatically in the requestCompleted event of the model mechanism, as you can see in the [Gist for the MultiComboBox.html file, specifically starting at line 38](https://gist.github.com/qmacro/973aea751b00654b399a#file-multicombobox-html-L38):

```javascript
oModel.attachEventOnce('requestCompleted', function(oEvent) {
	var oModel = oEvent.getSource();
	oModel.setData({
		"ProductCategories" : oModel.getData()
	});
});
```

</div>However, while fun and interesting, I want to point out that this is not absolutely necessary. The model will still support an unkeyed root element such as this array, as shown in the first screenshot above. You can see how this is done in the [Gist for the MultiComboBox-without-Keyed-Root.html file](https://gist.github.com/qmacro/973aea751b00654b399a#file-multicombobox-without-keyed-root-html) – the difference is we don’t need to manipulate the data in the requestCompleted event and the binding for the MultiComboBox items aggregation looks like this:

```
{/}
```

rather than this:

```
{/ProductCategories}
```

Of course, having an unkeyed root element means that you can’t have anything else in that JSON source, which may cause you issues further down the line. But it’s not critical for this example.


