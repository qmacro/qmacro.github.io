---
title: SAPUI5 says "Hello OData" to NetWeaver Gateway
date: 2012-02-13
tags:
  - sapcommunity
---
So following a very interesting podcast from Rui Nogueira with SAP's Michael Falk and Tim Back on the HTML5-based UI Toolkit for SAP NetWeaver Gateway (aka "SAPUI5") earlier this month, a beta version of SAPUI5 was released to the world on SDN, specifically in the "Developer Center for UI Development Toolkit for HTML5" (linked content lost in SAP community migration) section. I downloaded it and unpacked the contents into a directory to have a look at the docu and guidelines, and have an initial poke around.

Wow, those folks have certainly put together some nice documentation already! Try it for yourself - once downloaded, open the demokit directory and you should be presented with a nice (SAPUI5-powered) overview, developer guide, controls and API reference:

![SAPUI5 overview](/images/2012/02/sapui5overview.png)

The framework is based upon JQuery / UI and contains  a huge number of controls. It also supports data bindings, and one thing that had [intrigued me](/tweets/qmacro/status/167191292919545856/) from the podcast was that data bindings were possible to arbitrary JSON and XML … and OData resources.

"Gosh", I hear you say, "that reminds me of something!" Of course, SAP NetWeaver Gateway's REST-informed data-centric consumption model is based upon OData. So of course I immediately was curious to learn about SAPUI5 with an OData flavour. How could I try out one of the controls to surface information in OData resources exposed by NetWeaver Gateway?

What I ended up with is SAPUI5's DataTable control filled with travel agency information from my copy of the trial NetWeaver Gateway system, via an OData service all ready to use. You can see what I mean in this short [screencast](http://youtu.be/yHVuWHNWK3I).

Here's what I did to get the pieces together. I'm assuming you've got the trial Gateway system installed and set up (you know, fully qualified hostname, ICM configured nicely, and so on), and that you're semi-familiar with the SFLIGHT dataset.

## Step 1. The OData Service

Check with transaction /iwfnd/reg_service, for the LOCAL system alias, that the service RMTSAMPLEFLIGHT is available, as shown here.

![Transaction /iwfnd/reg_service](/images/2012/02/iwfnd_reg_service1.png)

Check you can see the service document by clicking the Call Browser button (you may need to provide a user and password for HTTP basic authentication). You can also check the data by manually navigating to the TravelagencyCollection by following the relative href attribute of the app:collection element as shown here:

![Travelagency connection](/images/2012/02/travelagencycollection.png)

In other words, navigate from something like this:

```url
http://gateway.server:port/sap/opu/sdata/IWFND/RMTSAMPLEFLIGHT/?$format=xml
```

to this:

```url
http://gateway.server:port/sap/opu/sdata/IWFND/RMTSAMPLEFLIGHT/TravelagencyCollection?$format=xml
```

(The `$format=xml` is to force the service to return a less exotic Content-Type of application/xml rather than an Atom-flavoured one, so that the browser is more likely to render the data in human-readable form.)

Following this href should show you some actual travel agency data in the form of entries in an Atom feed (yes, "everything is a collection/feed!"):

![Atom entry](/images/2012/02/atomentry1.png)

## Step 2. The SAPUI5 Framework

Make your SAPUI5 framework accessible. To avoid Same Origin Policy based issues in your browser, get your Gateway's ICM to serve the files for you. Create a 'sapui5' directory in your Gateway's filesystem:

```text
/usr/sap/NPL/DVEBMGS42/sapui5/
```

unpack the SAPUI5 framework into here, and add an instance profile configuration parameter to tell the ICM to serve files from this location:

```text
icm/HTTP/file_access_5 = PREFIX=/sapui5/, DOCROOT=$(DIR_INSTANCE)/sapui5/, BROWSEDIR=2
```

(here I have 5 previous `file_access_xx` parameters, hence the '5' suffix in this example)

and when you restart the ICM it should start serving the framework to you:

![SAPUI5 dir](/images/2012/02/sapui5dir.png)

## Step 3. The HTML / Javascript Application Skeleton

Actually, calling it an application is far too grand. But you know what I mean. Now we have the SAPUI5 framework being served, and the OData service available, it's time to put the two together.

Here's the general skeleton of the application - we pull in SAPUI5, and have an element in the body where the control will be placed:

```html
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>SAP OData in SAPUI5 Data Table Control</title>
    <!-- Load SAPUI5, select theme and control libraries -->
    <script id="sap-ui-bootstrap"
      type="text/javascript"
      src="http://gateway.server:port/sapui5/sapui5-static/resources/sap-ui-core.js"
      data-sap-ui-theme="sap_platinum"
      data-sap-ui-libs="sap.ui.commons,sap.ui.table">
    </script>

  <script>
    ...
  </script>

</head>
<body>
  <h1>SAP OData in SAPUI5 Data Table Control</h1>
  <div id="dataTable"></div>
</body>
</html>
```

In the final step we'll have a look at what goes in the "…" bit.

## Step 4. Using the SAPUI5 Framework in the Application

So now it's time to flex our Javascript fingers, stand on the shoulders of giants, and write a few lines of code to invoke the SAPUI5 power and glory.

What we need to do is:

* create a DataTable control
* add columns to it to represent the fields in the OData entries
* create an OData data model
* link the DataTable to this data model
* bind the rows to the TravelagencyCollection
* place the control on the page

Simples!

Creating the DataTable control goes like this (but you must remember to add the control library to the `data-sap-ui-libs` attribute when loading SAPUI5 - see Step 3):

```javascript
var oTable = new sap.ui.table.DataTable();
```

Each column is added and described like this:

```javascript
oTable.addColumn(new sap.ui.table.Column({
  label: new sap.ui.commons.Label({text: "Agency Name"}),
  template: new sap.ui.commons.TextView().bindProperty("text", "NAME"),
  sortProperty: "NAME"
}));
```

There are three different templates in use, for different fields - the basic TextView, the TextField and the Link.

The OData data model is created like this, where the URL parameter points to the service document:

```javascript
var oModel = new sap.ui.model.odata.ODataModel("http://gateway.server:port/sap/opu/sdata/iwfnd/RMTSAMPLEFLIGHT");
```

It's then linked to the control like this:

```javascript
oTable.setModel(oModel);
```

The specific OData resource TravelagencyCollection is bound to the control's rows like this:

```javascript
oTable.bindRows("TravelagencyCollection");
```

And then the control is placed on the page like this:

```javascript
oTable.placeAt("dataTable");
```

I've put the complete code in a [Github Gist](https://gist.github.com/qmacro/1820544) for you to have a look at.

## Result
What you end up with is live data from your SAP Gateway system that is presented to you like this:

![Result](/images/2012/02/result.png)

Share and enjoy!

[Originally published on SAP Community](https://blogs.sap.com/2012/02/13/sapui5-says-hello-odata-to-netweaver-gateway/)
