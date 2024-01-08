---
layout: post
title: Mobile Dev Course W3U3 Rewrite - ProductList, ProductDetail and SupplierDetail
date: 2013-10-18
tags:
  - sapcommunity
---
I [rewrote the mobile dev course sample app from W3U3](/blog/posts/2013/10/16/mobile-dev-course-w3u3-rewrite-intro/). This post explains what I changed in the ProductList, ProductDetail and SupplierDetail views / controllers. See the links at the bottom of the [opening post](/blog/posts/2013/10/16/mobile-dev-course-w3u3-rewrite-intro/) to get to explanations for the other areas.

## ProductList

If you remember back to the Login controller (described in the previous post in this series) we arrive at the ProductList view after successfully logging in, creating the OData model for the business available at the OData service, and performing a move from the Login page to this ProductList page with oApp.to("ProductList"), the navigation mechanism that is available in the App control, inherited from NavContainer.

### ProductList.view.js

Here's what the ProductList view looks like.

```javascript
sap.ui.jsview("com.opensap.ProductList", {

    getControllerName: function() {
        return "com.opensap.ProductList";
    },

    createContent: function(oController) {

        return new sap.m.Page("ProductPage", {
            title: "Products",
            content: [
                new sap.m.List({
                    headerText: "Product Overview",
                    items: {
                        path: "/ProductCollection",
                        template: new sap.m.StandardListItem({
                            title: "{Name}",
                            description: "{Description}",
                            type: sap.m.ListType.Navigation,
                            press: [oController.handleProductListItemPress, oController]
                        })
                    }
                })
            ]
        });
    }

});
```

Like the previous views, this isn't actually much different from the original version. I've left out stuff that wasn't needed, and in particular the icon property of each StandardListItem was pointing at the wrong model property name, resulting in no icon being shown in the list. I've removed the icon* properties as well as a couple of list properties (inset and type).

What I have done, though, mostly for fun, is to write the createContent function as a single statement. This in contrast to the multiple statements in the original, but perhaps more interestingly, the whole thing looks more declarative than imperative. This will come into play when we eventually look at declarative views in XML, which are actually my prefererence, and arguably the neatest and least amount of typing … which might surprise you. Anyway, more on that another time.

### ProductList.controller.js

The ProductList controller is very simple; all it has to do is handle the press of the StandardListItem (see the press event specification in the view above).

```javascript
sap.ui.controller("com.opensap.ProductList", {
    handleProductListItemPress: function(oEvent) {
        this.getView().getParent().to("ProductDetail", {
            context: oEvent.getSource().getBindingContext()
        });
    }
});
```

Again, I've left out the empty boilerplate code from the original, and am just doing what's required, nothing more: getting the binding context of the source of the event (the particular StandardListItem that was pressed), and passing that in the navigation to the ProductDetail page.

> Note that I've been sort of interchanging the word page and view here and earlier. This is in relation to the App control, which has a 'pages' aggregation from the NavContainer control. As the documentation states, you don't have to put Page controls into this pages aggregation, you can put other controls that have a fullscreen semantic, and one of those possible controls is a View.

## ProductDetail

So we've navigated from the ProductList to the ProductDetail by selecting an item in the List control, and having that item's binding context (related to the OData model) passed to us. Here's what the view looks like.

```javascript
sap.ui.jsview("com.opensap.ProductDetail", {
    getControllerName: function() {
        return "com.opensap.ProductDetail";
    },
    onBeforeShow: function(oEvent) {
        if (oEvent.data.context) {
            this.setBindingContext(oEvent.data.context);
        }
    },
```

So in the ProductDetail view, where we want to simply show more detail about that particular Product entity, we first make sure that the passed context is bound (to the view).

```javascript
  createContent: function(oController) {

        return new sap.m.Page({
            title: "{Name}",
            showNavButton: true,
            navButtonPress: [oController.handleNavButtonPress, oController],
            content: [
                new sap.m.List({
                    items: [
                        new sap.m.DisplayListItem({
                            label: "Name",
                            value: "{Name}"
                        }),
                        new sap.m.DisplayListItem({
                            label: "Description",
                            value: "{Description}"
                        }),
                        new sap.m.DisplayListItem({
                            label: "Price",
                            value: "{Price} {CurrencyCode}"
                        }),
                        new sap.m.StandardListItem({
                            title: "Supplier",
                            description: "{SupplierName}",
                            type: sap.m.ListType.Navigation,
                            press: [oController.handleSupplierPress, oController]
                        })
                    ]
                }),
                new sap.m.VBox({
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Image({
                            src: "{app>/ES1Root}{ProductPicUrl}",
                            decorative: true,
                            densityAware: false
                        })
                    ]
                })
            ]
        });
    }
});
```

Once that's done, all we have to do is fill out the createContent function, which again is very similar to the original. Note that here I'm using two model properties together for the value of the "Price" item to show a currency value and code.

In the original version, there was some custom data attached to the Supplier item - specifically the SupplierId property from the Product. This was used, in the controller, to manually (and somewhat "bluntly") construct an OData Entity URL for subsequent (manual) retrieval. Of couse, you might have guessed by now what I'm going to say. Not necessary at all. More on this shortly. But it's worth pointing out that the attaching of the custom data is quite a useful and widely available facility in general. It's widely available because it's part of the Element class, from which, ultimately, all controls inherit. So you can attach custom data in name/value pairs to any control you wish, more or less.

Finally, let's have a quick look at that VBox control containing the product image. I took a lead from the original app and decided to prefix the relative URL (which is what is contained in the ProductPicUrl property) with the generic (non-SMP-proxied) 'sapes1' URL base. And to achieve this prefixing I just concatenated a couple of model properties - one from the named "app" model (the ES1Root) and the other being the actual image relative URL.

Ok, let's have a look at the rewritten controller. 

### ProductDetail.controller.js

```javascript
sap.ui.controller("com.opensap.ProductDetail", {
    handleNavButtonPress: function(oEvent) {
        this.getView().getParent().back();
    },

    handleSupplierPress: function(oEvent) {
        this.getView().getParent().to("SupplierDetail", {
            context: oEvent.getSource().getBindingContext()
        });
    }

});
```

As well as the back navigation, we have the handling of the press of the Supplier item in the ProductDetail view. This should take us to the SupplierDetail view to show us more information about the supplier.

So before we think about how we make this work, let's pause for a second and consider the business data that we're consuming through the OData service.

## OData Model and Service

We have, in the OData service originating at <https://sapes1.sapdevcenter.com/sap/opu/odata/sap/ZGWSAMPLE_SRV/>, a number of EntitySets, or 'collections', including the [BusinessPartnerCollection](https://sapes1.sapdevcenter.com/sap/opu/odata/sap/ZGWSAMPLE_SRV/BusinessPartnerCollection?sap-ds-debug=true) and the [ProductCollection](https://sapes1.sapdevcenter.com/sap/opu/odata/sap/ZGWSAMPLE_SRV/ProductCollection?sap-ds-debug=true) - both of which have entities that we're interested in for our app. We start out with the ProductCollection, display a list, pick a specific product for more detail, and then go to the supplier for that product. If you look at the OData metadata for this service, you'll see that in the definition of the Product entity, there's a navigation property that will take us directly from the product entity to the related business partner entity. How useful is that? Yes, very! So let's use it.

![](/images/2013/10/navprop.jpg)

Before we look at how we use it, let's review how the original app was doing things here to go from the selected product detail to the supplier. In the supplierTap function of the original ProductDetail controller, the OData.read function was called explicitly (ouch), on a manually constructed OData URL (ouch), which abruptly jumped straight to the BusinessPartnerCollection, ignoring this navigation feature (double-ouch). The supplier's ID (which had been squirrelled away in the custom data as mentioned earlier) was specified directly, as a key predicate, and a JSON representation was requested:

```javascript
OData.read("https://sapes1.devcenter.com/sap/opu/odata/sap/ZGWSAMPLE_SRV/BusinessPartnerCollection('" + supplierId + "')?$format=json", …)
```

Yes, you can guess the next bit 🙂 The JSON data was passed directly to the next view, bypassing any semblance of OData model usage. Ouch. I guess this also bypasses the SMP URL rewriting security and should have really been the SMP-based URL. And ouch.

So how did we do it here? Well, just by passing the context of the selected product, as usual. Just like we did when we went from the ProductList view to the ProductDetail view. And then following on from that in the SupplierDetail view with a reference to the relative 'Supplier' entity.

## SupplierDetail

### SupplierDetail.view.js

Ok, so here's the view.

```javascript
sap.ui.jsview("com.opensap.SupplierDetail", {
    getControllerName: function() {
        return "com.opensap.SupplierDetail";
    },
    onBeforeShow: function(oEvent) {
        if (oEvent.data.context) {
            this.setBindingContext(oEvent.data.context);
        }
    },
    createContent: function(oController) {
        var oPage = new sap.m.Page({
            title: "{CompanyName}",
            showNavButton: true,
            navButtonPress: [oController.handleNavButtonPress, oController],
            content: [
                new sap.m.List({
                    items: [
                        new sap.m.DisplayListItem({
                            label: "Company Name",
                            value: "{CompanyName}"
                        }),
                        new sap.m.DisplayListItem({
                            label: "Web Address",
                            value: "{WebAddress}"
                        }),
                        new sap.m.DisplayListItem({
                            label: "Phone Number",
                            value: "{PhoneNumber}"
                        })
                    ]
                })
            ]
        });
        oPage.bindElement("Supplier");
        return oPage;
    }
});
```

This view looks pretty normal and doesn't differ much from the original. We have the onBeforeShow and the createContent. But the key line is this:

```javascript
oPage.bindElement("Supplier")
```

At the point that this is invoked, there's already the binding context that refers to the specific product previously chosen, say, like this:

```url
https://sapes1.sapdevcenter.com/sap/opu/odata/sap/ZGWSAMPLE_SRV/ProductCollection('HT-1007')
```

(I'm using the 'sapes1' link rather than the SMP-rewritten one here so you can navigate them from here and have a look manually if you want.)

Following the navigation property mentioned earlier, to the supplier (the entity in the BusinessPartnerCollection) is simply a matter, OData-wise, of extending the path to navigate to the supplier, like this:

```url
https://sapes1.sapdevcenter.com/sap/opu/odata/sap/ZGWSAMPLE_SRV/ProductCollection('HT-1007')/Supplier
```

So in OData terms, we're navigating. And in path terms, we're going to a relative "Supplier", which is exactly what we're doing with the oPage.bindElement("Supplier"). The bindElement mechanism, when called on an entity in an OData model, triggers an automatic OData "read" operation, i.e. an HTTP GET request, and updates the model.  Bingo!

Looking at the Network tab of Chrome Developer Tools, this is what we see happens:

![](/images/2013/10/calls.jpg)

The first call (ProductCollection?$skip…) was for the initial binding to "/ProductCollection" in the ProductList view. Then a product HT-1007 was selected, the App navigated to the ProductDetail view, and then the supplier item was pressed. And when the bindElement in the SupplierDetail view was called, this triggered the last call in the screenshot - to "Supplier", relative to ProductCollection('HT-1007').

All automatic and comfortable!

### SupplierDetail.controller.js

```javascript
sap.ui.controller("com.opensap.SupplierDetail", {
    handleNavButtonPress: function(oEvent) {
        this.getView().getParent().back();
    }
})
```

Let's finish off with a quick look at the corresponding controller for this view. It doesn't have much work to do - just navigate back when the nav button is pressed. And it's very similar to the original.

So there we have it. Embrace SAPUI5 and its myriad features (automatic module loading, well thought out controls, OData models, and more) and have fun building apps.

That's draws this series to an end. Thanks for reading. The link to the Github repo where the rewritten app can be found is in the [original post in this series](/blog/posts/2013/10/16/mobile-dev-course-w3u3-rewrite-intro/), and also here: <https://github.com/qmacro/w3u3_redonebasic>.

Share & enjoy!

[Originally published on SAP Community](https://blogs.sap.com/2013/10/18/mobile-dev-course-w3u3-rewrite-productlist-productdetail/)
