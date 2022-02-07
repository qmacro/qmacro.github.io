---
layout: post
title: The App Descriptor
tags:
- appdescriptor
- metadata
- openui5
- 30ui5
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/)  &mdash; Day 6 by [Thilo Seidel](https://twitter.com/ThiloDev)**

Writing your component based applications in UI5 you might be familiar with a long list of settings in your metadata section making you scroll down for hours before reaching the point where the first violin plays. This is not only annoying but in fact bad design as it means to mix static configuration in large amounts with actual code.

One way to solve this is the usage of a manifest file – one central asset that holds your entire application configuration. The UI5 creators have drawn inspiration from the W3C manifest for a web application concept that is currently under investigation and create an UI5 flavored version of it. The app descriptor in UI5 is basically a JSON file named manifest.json that is expected in the same folder your component lives in. All you need to do to get started is to add an attribute manifest with the value “json” to your component metadata.

Introduced in 1.28 in a basic version, with upcoming 1.30 it is even smarter. Beyond static configuration for packaging and deployment it even helps to save you some code, especially when it comes to model instantiation. The manifest itself is structured in namespaces of which we want to briefly look into sap.app and sap.ui5 for this case. More details and examples can be found in the [1.30 documentation preview.](https://openui5beta.hana.ondemand.com/#docs/guide/be0cf40f61184b358b5faedaec98b2da.html)

**sap.app:**

Mostly app specific attributes can be found here. You can also get set for your data model and resource bundle here. One property called ‘dataSources’ expects an object that holds the URL to your service, the service type and some additional settings if needed. A full blown service configuration would look like this:

![Screenshot of an sap.app stanza]( {{ "/img/2018/01/Screen-Shot-2015-07-07-at-19.51.14.png" | url }})

If you have more than one service you can simply add another object to this attribute. These can later be referenced by the given name. In addition we added the relative path to the i18n file here and will make use of this later as well.

**sap.ui5:**

This namespace is used for any configuration that can be used by the UI5 runtime directly. This counts for the routing configuration, but also for UI5 library dependencies and of course our case with the model instantiation.

For i18n it is pretty straightforward and a named i18n resource model (named “i18n”) will be created by the UI5 runtime. For the actual data model(s) you can also specify a name or keep it blank for an unnamed data model like this. Just set the datasource specified earlier and UI5 will handle the rest. The created models will be at your command as early as in the init function of your component.

![Screenshot of an sap.ui5 stanza]( {{ "/img/2018/01/Screen-Shot-2015-07-07-at-19.54.22.png" | url }})

To conclude this is only a snapshot of one little feature that is built into the new UI5 manifest, but showcases pretty well how this new file will ease your development routines, help to clean up your components and limit repetitive lines of code.


