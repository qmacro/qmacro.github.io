---
title: Mobile Dev Course W3U3 Rewrite - XML Views - An Analysis
date: 2013-12-02
tags:
  - sapcommunity
---
I [rewrote the mobile dev course sample app from W3U3](/blog/posts/2013/10/16/mobile-dev-course-w3u3-rewrite-intro/). Then I created a [new branch 'xmlviews' in the repo on Github](https://github.com/qmacro/w3u3_redonebasic/tree/xmlviews) and rebuilt the views in XML. I then took a first look at XML views in general. Now this post looks at the specific XML views that I built in the W3U3 rewrite. See the links at the bottom of the [opening post](/blog/posts/2013/11/19/mobile-dev-course-w3u3-rewrite-xml-views-an-intro/) of this series to get to explanations for the other areas.

We know, from the other posts in this series, that there are a number of views. Let's just take them one by one. If you want an introduction to XML views, please refer to the previous post [Mobile Dev Course W3U3 Rewrite - XML Views - An Intro](/blog/posts/2013/11/19/mobile-dev-course-w3u3-rewrite-xml-views-an-intro/). I won't cover the basics here.

## App View

The App view contains an App control (sap.m.App) which contains, in the pages aggregation, the rest of the views - the ones that are visible. This is what the App view looks like in XML.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<core:View controllerName="com.opensap.App" xmlns:core="sap.ui.core"
    xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc">
    <App id="app">
        <mvc:XMLView viewName="com.opensap.Login" id="Login" />
        <mvc:XMLView viewName="com.opensap.ProductList" id="ProductList" />
        <mvc:XMLView viewName="com.opensap.ProductDetail" id="ProductDetail" />
        <mvc:XMLView viewName="com.opensap.SupplierDetail" id="SupplierDetail" />
    </App>
</core:View>
```

We're aggregating four views in the App control (introduced by the \<App> tag). Because the pages aggregation is the default, we don't have to wrap the child views in a \<pages> … \</pages> element. Views and the MVC concept belong in the sap.ui.core library, hence the xmlns:core namespace prefix usage.

## Login View

The Login view contains, within a Page control, a user and password field, and a login button in the bar at the bottom. This is what the XML view looks like.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<core:View controllerName="com.opensap.Login" xmlns:core="sap.ui.core"
    xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc">
    <Page
        title="Login"
        showNavButton="false">
        <footer>
            <Bar>
                <contentMiddle>
                    <Button
                        text="Login"
                        press="loginPress" />
                </contentMiddle>
            </Bar>
        </footer>
        <List>
            <InputListItem label="Username">
                <Input value="{app>/Username}" />
            </InputListItem>
            <InputListItem label="Password">
                <Input value="{app>/Password}" type="Password" />
            </InputListItem>
        </List>
    </Page>
</core:View>
```

You can see that the Page control is the 'root' control here, and there are a couple of properties set (title and showNavButton) along with the footer aggregation and the main content. Note that as this is not JavaScript, values that you think might appear "bare" are still specified as strings - showNavButton="false" is a good example of this.

The Page's footer aggregation expects a Bar control, and that's what we have here. In turn, the Bar control has three aggregations that have different horizontal positions, currently left, middle and right. We're using the contentMiddle aggregation to contain the Button control. Note that the Button control's press handler "loginPress" is specified simply; by default the controller object is passed as the context for "this". You don't need to try and engineer something that you might have seen in JavaScript, like this:

```javascript
new sap.m.Button({
     text: "Login",
     press: [oController.loginPress, oController]
}),
```

… it's done automatically for you.

Note also that we can use data binding syntax in the XML element attributes just like we'd expect to be able to, for example value="{app>/Username}".

## ProductList View

In the ProductList view, the products in the ProductCollection are displayed. There's a couple of things that are worth highlighting in this view. First, let's have a look at the whole thing.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<core:View controllerName="com.opensap.ProductList" xmlns:core="sap.ui.core"
    xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc">
    <Page
        title="Products">
        <List
            headerText="Product Overview"
            items="{
                path: '/ProductCollection'
            }">
            <StandardListItem
                title="{Name}"
                description="{Description}"
                type="Navigation"
                press="handleProductListItemPress" />
        </List>
    </Page>
</core:View>
```

The List control is aggregating the items in the ProductCollection in the data model. Note how the aggregation is specified in the items attribute - it's pretty much the same syntax as you'd have in JavaScript, here with the 'path' parameter. The only difference is that it's specified as an object inside a string, rather than an object directly:

```text
items="{
    path: '/ProductCollection'
}"
```

So remember get your quoting (single, double) right.

And then we have the template, the "stamp" which we use to produce a nice visible instantiation of each of the entries in the ProductCollection. This is specifiied in the default aggregation 'items', which, as it's default, I've omitted here.

## ProductDetail View

By now I'm sure you're starting to see the pattern, and also the benefit of writing views in XML. It just makes a lot of sense, at least to me. It's cleaner, it makes you focus purely on the controls, and also by inference causes you to properly separate your view and controller concerns. You don't even have the option, let alone the temptation, to write event handling code in here.

So here's the ProductDetail view.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<core:View controllerName="com.opensap.ProductDetail" xmlns:core="sap.ui.core"
    xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc">
    <Page
        title="{Name}"
        showNavButton="true"
        navButtonPress="handleNavButtonPress">
        <List>
            <DisplayListItem label="Name" value="{Name}" />
            <DisplayListItem label="Description" value="{Description}" />
            <DisplayListItem label="Price" value="{Price} {CurrencyCode}" />
            <DisplayListItem
                label="Supplier"
                value="{SupplierName}"
                type="Navigation"
                press="handleSupplierPress" />
        </List>
        <VBox alignItems="Center">
            <Image
                src="{app>/ES1Root}{ProductPicUrl}"
                decorative="true"
                densityAware="false" />
        </VBox>
    </Page>
</core:View>
```

We're not aggregating any array of data from the model here, we're just presenting four DisplayListItem controls one after the other in the List. Below that we have a centrally aligned image that shows the product picture.

## SupplierDetail View

And finally we have the SupplierDetail view.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<core:View controllerName="com.opensap.SupplierDetail" xmlns:core="sap.ui.core"
    xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc">
    <Page
        id="Supplier"
        title="{CompanyName}"
        showNavButton="true"
        navButtonPress="handleNavButtonPress">
        <List>
            <DisplayListItem label="Company Name" value="{CompanyName}" />
            <DisplayListItem label="Web Address" value="{WebAddress}" />
            <DisplayListItem label="Phone Number" value="{PhoneNumber}" />
        </List>
    </Page>
</core:View>
```

Again, nothing really special, or specially complicated, here. Just like the other views (apart from the "root" App view), this has a Page as its outermost control. Here again we have just simple, clean declarations of what should appear, control-wise.

## Conclusion

So there you have it. For me, starting to write views in XML was a revelation. The structure and the definitions seem to more easily flow, so much so, in fact, that in a last-minute addition to the DemoJam lineup at the annual SAP UK & Ireland User Group Conference in Birmingham last week, I took part, and [for my DemoJam session I stood up and build an SAP Fiori-like UI live on stage](/blog/posts/2013/11/27/sap-uk-and-ireland-user-group-conference-demo-jam!/). Using XML views.

This brings to an end the series that started out as an itch I wanted to scratch: To improve the quality of the SAPUI5 application code that was presented in the OpenSAP course "Introduction To Mobile Solution Development". There are now 6 posts in the series, including this one:

* [Mobile Dev Course W3U3 Rewrite - Index and Structure](/blog/posts/2013/10/17/mobile-dev-course-w3u3-rewrite-index-and-structure/)
* [Mobile Dev Course W3U3 Rewrite - App and Login](/blog/posts/2013/10/18/mobile-dev-course-w3u3-rewrite-app-and-login/)
* [Mobile Dev Course W3U3 Rewrite - ProductList, ProductDetail and SupplierDetail](/blog/posts/2013/10/18/mobile-dev-course-w3u3-rewrite-productlist-productdetail-and-supplierdetail/)
* [Mobile Dev Course W3U3 Rewrite - XML Views - An Intro](/blog/posts/2013/11/19/mobile-dev-course-w3u3-rewrite-xml-views-an-intro/)
* [Mobile Dev Course W3U3 Rewrite - XML Views - An Analysis](/blog/posts/2013/12/02/mobile-dev-course-w3u3-rewrite-xml-views-an-analysis/)

I hope you found it useful and interesting, and as always,

[Share and enjoy!](http://hhgproject.org/entries/shareandenjoy.html)

[Originally published on SAP Community](https://blogs.sap.com/2013/12/02/mobile-dev-course-w3u3-rewrite-xml-views-an-analysis/)
