---
layout: post
title: Revisiting the XML Model
tags:
- openui5
- xmlmodel
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 29 by [DJ Adams](//qmacro.org/about/)**

![]( {{ "/img/2018/02/Screen-Shot-2015-08-01-at-11.56.50.png" | url }})

It’s been more than a couple of years since I first had a look at XML data in the context of UI5. In my “[Re-presenting my site with SAPUI5](https://www.youtube.com/watch?v=wZUXz5f1CHI)” video [I used an XML Model to load the XML feed](https://github.com/qmacro/sapui5bin/blob/master/blogui/resources/blogarchive.controller.js#L9-L10) of my weblog into a UI5 app (gosh, [JavaScript views](https://github.com/qmacro/sapui5bin/tree/master/blogui/resources)!).

The XML Model mechanism proved very useful this week on a project, and I thought I’d re-examine some of its features. Everyone knows about the JSON and OData Model mechanisms; at least in my UI5 conversations, I don’t hear folks talk about the XML Model much. So I thought I’d give it some love here.

The [API reference documentation for the XML Model](https://openui5.hana.ondemand.com/#docs/api/symbols/sap.ui.model.xml.XMLModel.html) is a little dry. As Frank Zappa once said, “*The computer can’t tell you the emotional story. It can give you the exact mathematical design, but what’s missing is the eyebrows*“. We need to look elsewhere for the emotional story, for the eyebrows; and I think a nice place might be the [QUnit tests for the XML Model](https://openui5.hana.ondemand.com/test-resources/sap/ui/core/qunit/XMLModel.qunit.html).

**Learning from the QUnit sources**

Let’s have a look at the source, and see what we can learn. There are actually a couple of QUnit test files; we’ll have a look at just one of them – [XMLModel.qunit.html](https://github.com/SAP/openui5/blob/48324c5fd9ed365620bc49b32c4046aa76269bc7/src/sap.ui.core/test/sap/ui/core/qunit/XMLModel.qunit.html). We’ll just examine the setup and a couple of tests to see what we can find – what we can expect to be able to do with an XML Model. You can explore the rest of the QUnit test files on your own.

At the start of XMLModel.qunit.html, [a couple of XML Models are instantiated with some test data](https://github.com/SAP/openui5/blob/48324c5fd9ed365620bc49b32c4046aa76269bc7/src/sap.ui.core/test/sap/ui/core/qunit/XMLModel.qunit.html#L31-L46) as follows:

```javascript
var testdata = "<teamMembers>" +
  "<member firstName=\"Andreas\" lastName=\"Klark\"></member>" +
  "<member firstName=\"Peter\" lastName=\"Miller\"></member>" +
  "<member firstName=\"Gina\" lastName=\"Rush\"></member>" +
  "<member firstName=\"Steave\" lastName=\"Ander\"></member>" +
  "<member firstName=\"Michael\" lastName=\"Spring\"></member>" +
  "<member firstName=\"Marc\" lastName=\"Green\"></member>" +
  "<member firstName=\"Frank\" lastName=\"Wallace\"></member>" +
  "</teamMembers>";

var testdataChild = "<pets>" +
  "<pet type=\"ape\" age=\"1\"></pet>" +
  "<pet type=\"bird\" age=\"2\"></pet>" +
  "<pet type=\"cat\" age=\"3\"></pet>" +
  "<pet type=\"fish\" age=\"4\"></pet>" +
  "<pet type=\"dog\" age=\"5\"></pet>" +
  "</pets>";
```

**setXML and setData**

The [XML data is added to the XML Models](https://github.com/SAP/openui5/blob/48324c5fd9ed365620bc49b32c4046aa76269bc7/src/sap.ui.core/test/sap/ui/core/qunit/XMLModel.qunit.html#L48-L53) with the setXML function:

```javascript
	var oModel = new sap.ui.model.xml.XMLModel();
	oModel.setXML(testdata);
	sap.ui.getCore().setModel(oModel);

	var oModelChild = new sap.ui.model.xml.XMLModel();
	oModelChild.setXML(testdataChild);
```

This is different to the setData function, which is also present on the JSON Model, with an equivalent semantic. Here in the XML Model, the [setData](https://openui5.hana.ondemand.com/#docs/api/symbols/sap.ui.model.xml.XMLModel.html#setData) function would be expecting an **XML encoded data object**, not a literal string containing XML.

As an example, if we have a variable containing some XML string like this:

```javascript
xmlstring = "<root><name>DJ</name></root>"
```

then we could either set it on an XML Model with setXML, like this:

```
m = new sap.ui.model.xml.XMLModel()
=> sap.ui.d…e.C.e…d.constructor {mEventRegistry: Object, mMessages: Object, id: "id-1438428838337-6", oData: Object, bDestroyed: false…}

m.setXML(xmlstring)
=> undefined

m.getProperty("/name")
=> "DJ"
```

or with setData, creating an XML encoded data object, like this:

```
m = new sap.ui.model.xml.XMLModel()
=> sap.ui.d…e.C.e…d.constructor {mEventRegistry: Object, mMessages: Object, id: "id-1438428927599-7", oData: Object, bDestroyed: false…}

m.setData(new DOMParser().parseFromString(xmlstring, "text/xml"))
=> undefined

m.getProperty("/name")
=> "DJ"
```

**A couple of tests**

Then we’re off on the tests. There are [a couple of tests to check getProperty](https://github.com/SAP/openui5/blob/48324c5fd9ed365620bc49b32c4046aa76269bc7/src/sap.ui.core/test/sap/ui/core/qunit/XMLModel.qunit.html#L61-L71), the first using a relative context binding:

```javascript
	test("test model getProperty with context", function(){
		var oContext = oModel.createBindingContext("/member/6");
		var value = oModel.getProperty("@lastName", oContext); // relative path when using context
		equal(value, "Wallace", "model value");
	});


	test("test model getProperty", function(){
		var value = oModel.getProperty("/member/6/@lastName");
		equal(value, "Wallace", "model value");
	});
```

What we can see here already is that we can access XML attribute values (“lastName” in this case) with the XPath @ accessor. As an aside, the use of the optional second oContext parameter in the getProperty call is something one doesn’t see very much, but is extremely useful.

**Element content retrieval**

The rest of the file contain a load of other tests, all useful reading material, from the rare-to-see [use of the unbindProperty](https://github.com/SAP/openui5/blob/48324c5fd9ed365620bc49b32c4046aa76269bc7/src/sap.ui.core/test/sap/ui/core/qunit/XMLModel.qunit.html#L83) function to [aggregation bindings that are comfortable to use](https://github.com/SAP/openui5/blob/48324c5fd9ed365620bc49b32c4046aa76269bc7/src/sap.ui.core/test/sap/ui/core/qunit/XMLModel.qunit.html#L174-L195).

One thing that we have to wait until [test 15](https://github.com/SAP/openui5/blob/48324c5fd9ed365620bc49b32c4046aa76269bc7/src/sap.ui.core/test/sap/ui/core/qunit/XMLModel.qunit.html#L197-L211) to see is the use of element content:

```javascript
test("test XMLModel XML constructor", function(){

  var testModel = new sap.ui.model.xml.XMLModel(

  );
  testModel.setXML("<root>" +
    "<foo>The quick brown fox jumps over the lazy dog.</foo>" +
    "<bar>ABCDEFG</bar>" +
    "<baz>52</baz>" +
    "</root>");
  equal(testModel.getProperty("/foo"), "The quick brown fox jumps over the lazy dog.");
  equal(testModel.getProperty("/bar"), "ABCDEFG");
  equal(testModel.getProperty("/baz"), 52);

});
```

Until now we’ve only seen examples of XML where the data is stored in attributes. What about the more classic case of text nodes, like this example XML here?

Well, as we can see, a simple call to getProperty will do what we want. If we’re XPath inclined, we could even add the text() specification like this:

```
testModel.getProperty("/bar/text()")
=> "ABCDEFG"
```

and still get what we expect.

**Ending where we started**

And of course, to round things off, we can always get back to an **XML encoded data object** with getObject, like this:

```
testModel.getObject("/bar")
=> <bar>ABCDEFG</bar>
```

(that result is indeed an object), in a similar way to how we retrieve the whole object from the model:

```
testModel.getData()
=> #document
   <root>
    <foo>The quick brown fox jumps over the lazy dog.</foo>
    <bar>ABCDEFG</bar>
    <baz>52</baz>
  </root>
```

The XML Model is a powerful ally, and the QUnit tests are a rich source of information about it. Spend a coffee break looking through the sources, you won’t be disappointed!


