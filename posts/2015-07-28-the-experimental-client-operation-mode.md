---
layout: post
title: The experimental Client operation mode
tags:
- northwind
- odata
- odatamodel
- openui5
- operationmode
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 25 by [DJ Adams](//qmacro.org/about/)**

![]( {{ "/img/2018/02/Screen-Shot-2015-07-28-at-12.53.45-300x191.png" | url }})

A few months ago a preview release of 1.28 was made available. In [the blog post that accompanied it](http://openui5.tumblr.com/post/113243652527/new-openui5-preview-release-1-28), a number of the new features were introduced. Without much fanfare, certainly without any cool looking screenshots, the experimental “Client” operation mode was announced for the OData Model mechanism.

**OData Model – Server-side**

The OData Model is special, in that it is [classified](https://openui5.hana.ondemand.com/#docs/guide/e1b625940c104b558e52f47afe5ddb4f.html) as a server-side model, unlike its client-side siblings such as the JSON Model or the XML Model (or the Resource Model, for that matter). This means that the data “home” is seen as the server, rather than the client (the browser). Consequently, any operations on that data, even read-only operations such as sorting and filtering, take place on the server. That means extra network calls. [There are truly marvellous advantages also, which the margin [of this post] is too narrow to contain. ](https://en.wikipedia.org/wiki/Fermat%27s_Last_Theorem#Fermat.27s_conjecture)

There are circumstances, even when dealing with entity sets in OData services, where sorting and filtering could and should take place on the client, rather than on the server. To this end, 1.28 brought an initial experimental feature to the OData Model mechanism – the [OData Operation Mode](https://openui5.hana.ondemand.com/#docs/api/symbols/sap.ui.model.odata.OperationMode.html).

**Operation Mode**

The Operation Mode joins a small but important set of modes relating to the OData Model mechanism. By default, the Operation Mode is “Server”. But it can be set to “Client”, which causes all data to be loaded from the server and for subsequent sorting and filtering operations to be performed in the client, without further network calls. As the blog post mentions, this only really makes sense as long as there isn’t a ton of data.

Note that the Operation Mode is related to the OData Model mechanism instantiation in that it is the *default* for that model instance. You actually specify the mode for a binding, as shown in the code snippet in the blog post:

```javascript
oTable.bindRows({
   path: "/Product_Sales_for_1997",
   parameters: {
      operationMode: sap.ui.model.odata.OperationMode.Client
   }
});
```

**Experiment!**

This experimental feature was crying out for … well, experimentation. So I threw together an MVC ([model view controller, minimum viable code](/2015/07/21/mvc-model-view-controller-minimum-viable-code/)) based app to test it out. Here’s the result:

![client operation mode]( {{ "/img/2018/02/clientoperationmode.gif" | url }})

Here we have a test app with a List, where the items aggregation is bound to the Categories entity set in the public Northwind OData service at [http://services.odata.org/V2/Northwind/Northwind.svc/](http://services.odata.org/V2/Northwind/Northwind.svc/).

Note that the Operation Mode is only available on [the v2 version of the OData Model mechanism](https://openui5.hana.ondemand.com/#docs/api/symbols/sap.ui.model.odata.v2.ODataModel.html#constructor), so that’s what I’m using here.

Initially the binding to the List’s items aggregation is with the (default) value of “Server” for the Operation Mode. You can see the network calls that are made to ask the OData service to return the entities in a specific order (with the $orderby OData parameter) each time I hit the sort button, which is toggling between ascending and descending sorting of the category names.

But then, in the console, I grab the List, and re-bind the items aggregation, to the same path (“/Categories”) but in “Client” Operation Mode. The result is that a new call is made to fetch the entities to satisfy that (new) binding, but further sorts are done entirely on the client – there are no more network calls made.

I’d call that experiment a success, and I’m looking forward to developments in this area. Nice work, UI5 team!


