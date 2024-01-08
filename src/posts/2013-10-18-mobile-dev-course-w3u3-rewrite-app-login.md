---
layout: post
title: Mobile Dev Course W3U3 Rewrite - App and Login
date: 2013-10-18
tags:
  - sapcommunity
---
I [rewrote the mobile dev course sample app from W3U3](/blog/posts/2013/10/16/mobile-dev-course-w3u3-rewrite-intro/). This post explains what I changed in the App and Login views / controllers. See the links at the bottom of the [opening post](/blog/posts/2013/10/16/mobile-dev-course-w3u3-rewrite-intro/) to get to explanations for the other areas.

## App

In the index.html, we instantiated the App view, which is a JavaScript view. The view has a corresponding controller and they look like this.

### App.view.js

```javascript
sap.ui.jsview("com.opensap.App", {
    getControllerName: function() {
        return "com.opensap.App";
    },
    createContent: function(oController) {
        var oApp = new sap.m.App("idApp", {
            pages: [
                sap.ui.jsview("Login", "com.opensap.Login"),
                sap.ui.jsview("ProductList", "com.opensap.ProductList"),
                sap.ui.jsview("ProductDetail", "com.opensap.ProductDetail"),
                sap.ui.jsview("SupplierDetail", "com.opensap.SupplierDetail")
            ]
        });
        return oApp;
    }
});
```

This is actually not too far from the original version. However, it is much shorter, as it takes advantage of the pages aggregation property of the App control, and sticks the views straight in there. This is much quicker and neater than the slightly pedestrian way it is done in the original version. Also, there is no need to navigate explicitly to Login (this.app.to("Login")) as the first control in the aggregation will be the default anyway.

### App.controller.js

```javascript
sap.ui.controller("com.opensap.App", {

    onInit: function() {
        sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel("model/app.json"), "app");
    }
});
```

The App controller is even smaller, and uses the onInit event to create the JSON model that will hold the data about the application connection (this was mentioned in the [Index & Structure post](/blog/posts/2013/10/17/mobile-dev-course-w3u3-rewrite-index-and-structure/)).

Note that rather than having one single model in the app that holds all sorts of unrelated data, as it is done in the original version (there's a single JSON model for everything, and that's it), I am using setModel's optional second parameter, to specify a name ("app") for the model. This way it becomes a "named model" and is not the default (where no name is specified). You'll see later that references to properties in named models are prefixed with the name and a ">" symbol, like this: "{app>/ES1Root}".

The original App controller had empty onInit, onBeforeShow and navButtonTap events, which I have of course left out here (I'm guessing they might have come from a controller template and left in there).

## Login

So the App view is used as a container, that has navigation capabilities (it actually inherits from NavContainer); it doesn't have any direct visible elements of its own. Instead, the "pages" aggregation is what holds the content entities, and the first one in there is the one that's shown by default. In this case it's Login.

The Login view and its corresponding controller are somewhat more involved, so let's take a look at the rewritten version step by step.

### Login.view.js

The view itself is fairly self explanatory and doesn't differ too much from the original. There are however a couple of things I want to point out before moving on to the controller.

```javascript
sap.ui.jsview("com.opensap.Login", {

    getControllerName: function() {
        return "com.opensap.Login";
    },

    createContent: function(oController) {

        return new sap.m.Page({
            title: "Login",
            showNavButton: false,
            footer: new sap.m.Bar({
                contentMiddle: [
                    new sap.m.Button({
                        text: "Login",
                        press: [oController.loginPress, oController]
                    }),
                ]
            }),
            content: [
                new sap.m.List({
                    items: [
                        new sap.m.InputListItem({
                            label: "Username",
                            content: new sap.m.Input({ value: "{app>/Username}" })
                        }),
                        new sap.m.InputListItem({
                            label: "Password",
                            content: new sap.m.Input({ value: "{app>/Password}", type: sap.m.InputType.Password })
                        })
                    ]
                })
            ]
        });
    }

});
```

First is the use of the press event on the Button control. The tap event (used in the original version of the app) [is deprecated](https://sapui5.hana.ondemand.com/sdk/#docs/api/symbols/sap.m.Button.html#event:tap). You will see that throughout the app I've replaced the use of 'tap' with 'press'.

Also, note how the handler is specified for the press event in the construction of the Button: [fnListenerFunction, oListenerObject] (and it's the same in the original). This form allows you to specify, as the second oListenerObject parameter, the context which 'this' will have in the fnListenerFunction handler. In other words, doing it this way will mean that when you refer to 'this' in your handler, it will do what you probably expect and refer to the controller.

Then we have the construction of the values for the Input controls. Because I loaded the data about the application connection into a named model (to keep that separate from the main business data) I have to prefix the model properties with "app>" as mentioned above.

### Login.controller.js

So now we'll have a look at the Login controller, and if you compare this new version with the original, you'll see that there are a number of differences.

```javascript
sap.ui.controller("com.opensap.Login", {

    oSMPModel: null,
```

As described in the course, this app needs to create a connection with the SMP server. The API with which to do that is OData-based - an OData service at the address

```url
https://smp-<your-id>trial.hanatrial.ondemand.com/odata/applications/latest/<your-app-name>/
```

and as you saw in this unit (W3U3) we need to perform an OData "create" operation on the Connections collection to create a new Connection entity. So to do this, I'm using a model to represent the OData service, and I'm storing it singularly in the controller - we don't need to set the model anywhere on the control tree, the create operation is just to make the connection and get the application connection ID (APPCID).

```javascript
    loginPress: function(oEvent) {

        var oAppData = sap.ui.getCore().getModel("app").getData();

        if (!this.oSMPModel) {
            this.oSMPModel = new sap.ui.model.odata.ODataModel(
                oAppData.BaseURL + "/odata/applications/latest/" + oAppData.AppName
            );
        }
```

When the login button is pressed we use the application data (from model/app.json, stored in the named "app" model) to construct the URL of the SMP connections OData service and create an OData model based on that.

```javascript
        this.oSMPModel.create('/Connections', { DeviceType: "Android" }, null,
            jQuery.proxy(function(mResult) {
                localStorage['APPCID'] = mResult.ApplicationConnectionId;
                this.showProducts(mResult.ApplicationConnectionId);
            }, this),
            jQuery.proxy(function(oError) {
                jQuery.sap.log.error("Connection creation failed");
                // Bypass if we already have an id
                if (/an application connection with the same id already exists/.test(oError.response.body)) {
                    jQuery.sap.log.info("Bypassing failure: already have a connection");
                    this.showProducts(localStorage['APPCID']);
                }
            }, this)
        );

    },
```

Now we have this SMP model, performing the OData create operation (an HTTP POST request), sending the appropriate entity payload, is as simple as

```javascript
this.oSMPModel.create('/Connections', { DeviceType: 'Android'}, …)
```

That's it. We just catch the APPCID from the result object and here we're storing it in localStorage on the browser. This is a small workaround to the problem with the original app where you had to delete the connection from the SMP Admin console each time. The failure case being handled here is where we are told that an application connection already exists … if that's the case then we just grab what we have in localStorage and use that.

Unlike the original app version, we're not interested in actually storing any results so there's no need to add it to the model. By the way, if you look at how the APPCID is added to the model in the original app version, there's a pattern used which goes generally like this:

1. `var oData = sap.ui.getCore().getModel().getData();`
2. `oData.someNewProperty = "value";`
3. `sap.ui.getCore().getModel().setData(oData);`

If you find yourself doing this, take a look at the [optional second bMerge parameter of setData](https://sapui5.hana.ondemand.com/sdk/#docs/api/symbols/sap.ui.model.json.JSONModel.html#setData). It uses jQuery.extend() and it might be what you're looking for - it will allow you to simply do this:

1. `sap.ui.getCore().getModel().setData({someNewProperty: "value"}, true);`

Anyway, we get the APPCID back from the SMP's OData service and then call showProducts (below) to actually start bringing in the business data and showing it.

```javascript
    showProducts: function(sAPPCID) {
        var oAppData = sap.ui.getCore().getModel("app").getData();
        var oModel = new sap.ui.model.odata.ODataModel(
            oAppData.BaseURL + "/" + oAppData.AppName,
            { 'X-SUP-APPCID': sAPPCID }
        );
        sap.ui.getCore().setModel(oModel);

        var oApp = this.getView().getParent();
        oApp.to("ProductList");

    }
});
```

The showProducts function creates a new model. Yes, another one. This time, it's a model for the business data, available at the [OData service](https://sapes1.sapdevcenter.com/sap/opu/odata/sap/ZGWSAMPLE_SRV) that was described in the course and is proxied behind the SMP service. So first we use the application data in the "app" model to construct the proxy URL, which will be something like this:

```url
https://smp-<your-id>trial.hanatrial.ondemand.com/<your-app-name>/
```

But then notice that we don't do anything manually, unlike the original app. We don't specify the HTTP method (GET) and we don't make any explicit calls (like OData.read). We just create a new OData model, specifying the service URL, and an additional object containing custom headers that we want sent on every call. The header we want is of course the X-SUP-APPCID so that's what we specify. From them on we just let the model do the work for us.

What we certainly don't do here, which was done in the original app, is call OData.read (which, incidentally, [doesn't store the returned data in the model](https://sapui5.hana.ondemand.com/sdk/#docs/api/symbols/sap.ui.model.odata.ODataModel.html#read)), and then manually shovel the raw JSON (the OData comes back as a JSON representation) into a single, central JSON model. There's no need, and this is really mixing up different mechanisms: OData and its corresponding model, JSON and its corresponding model, and their respective ways of working.

So you'll see, there are no explicit calls (HTTP requests) made for the business data. And you'll see that this hold true throughout the app (e.g. also later when we navigate from the ProductDetail view to the SupplierDetail view, following a navigation property). And remember, as described in the [Index & Structure](/blog/posts/2013/10/17/mobile-dev-course-w3u3-rewrite-index-and-structure/) post in this series, there is no explicit external OData library (the original app had brought in datajs-1.1.1.js as a 3rd party library) - the SAPUI5 framework takes care of this for you.

Ok, well that's it for this post.

See the end of the initial post "[Mobile Dev Course W3U3 Rewrite - Intro](/blog/posts/2013/10/16/mobile-dev-course-w3u3-rewrite-intro/)" for links to all the parts in this series.

Share & enjoy!

[Originally published on SAP Community](https://blogs.sap.com/2013/10/18/mobile-dev-course-w3u3-rewrite-app-login/)
