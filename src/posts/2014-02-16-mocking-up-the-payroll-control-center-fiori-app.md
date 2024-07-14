---
layout: post
title: Mocking up the Payroll Control Center Fiori App
date: 2014-02-16
tags:
  - sapcommunity
---
Following on from a great debate about Fiori and Freeori that stemmed from a [post by John Appleby](https://web.archive.org/web/20240118020008/http://diginomica.com/2014/02/05/sap-fiori-freeori/) there were some comments about HCM app renewals. Latterly John Moy [pointed out](https://web.archive.org/web/20240118020008/http://diginomica.com/2014/02/05/sap-fiori-freeori/?hubRefSrc=permalink#lf_comment=138216341) a post [Improve payroll data validation with SAP Payroll control center add-on](https://web.archive.org/web/20240118020008/https://blogs.sap.com/?p=101981) where some very Fiori-like UIs were being shown.

## Coffee Time

I thought it would be a nice little coffee-time exercise to try and reproduce one of the Fiori app pages shown in the screenshots in that post:

![](/images/2014/02/pic_1_386999.png)

So I did, and as I did it I recorded it to share. I thought I'd write a few notes here on what was covered, and there's a link to the video and the code at the end.

### Developer tools

* I'm using the excellent editor Sublime Text.
* With that editor I'm using the [SublimeUI5](https://github.com/qmacro/SublimeUI5) package which gives me UI5 flavoured snippets and templates.
* Specifically I started out with the [indexmspmvc](https://github.com/qmacro/SublimeUI5/blob/master/Snippets/indexmspmvc.html.sublime-snippet) snippet (Index Mobile Single-Page MVC) which gives me everything I need to build MVC-based examples with XML views, controllers, and more … all in a single page, a single file. Not recommended for productive use, but extremely useful for testing and demos.

### In-line XML views

The XML views in this single-page MVC are defined in a special script tag

```xml
<script id="view1" type="sapui5/xmlview">
    <mvc:View
        controllerName="local.controller"
        xmlns:mvc="sap.ui.core.mvc"
        xmlns="sap.m">
        ${6:<!-- Add your XML-based controls here -->}
    </mvc:View>
</script>
```

and then picked up in the view instantiation with like this:

```javascript
var oView = sap.ui.xmlview({
    viewContent: jQuery('#view1').html()
})
```

### Controls Used

This is a Fiori UI, so the controls used are from the sap.m library.

* I'm using a [Page](https://sapui5.hana.ondemand.com/sdk/#/api/sap.m.Page) within an [App](https://sapui5.hana.ondemand.com/sdk/#/api/sap.m.App).
* That Page's content is a single control, an [IconTabBar](https://sapui5.hana.ondemand.com/sdk/#/api/sap.m.IconTabBar).
* There are three [IconTabFilters](https://sapui5.hana.ondemand.com/sdk/#/api/sap.m.IconTabFilter) in the IconTabBar's items aggregation, each with the [Horizontal design](https://sapui5.hana.ondemand.com/sdk/#/api/sap.m.IconTabFilterDesign%23.Horizontal).
* I've put the [StandardTile](https://sapui5.hana.ondemand.com/sdk/#/api/sap.m.StandardTile) controls inside a [FlexBox](https://sapui5.hana.ondemand.com/sdk/#/api/sap.m.FlexBox) (using Basic Alignment); the FlexBox's items aggregation is bound to the "items" collection in my JSON data model.
* For the info and infoState properties of the StandardTile I'm using a couple of custom formatters.


### Video

[![Video thumbnail](/images/2014/02/videothumbnail.png)](https://www.youtube.com/watch?v=RJ8Kg14vhdE)

<https://www.youtube.com/watch?v=RJ8Kg14vhdE>

### Code

I have of course made the [code available](https://github.com/qmacro/sapui5bin/blob/master/SinglePageExamples/PayrollControlCenterMockup.html) in the [sapui5bin](https://github.com/qmacro/sapui5bin) repo on Github.

Share and enjoy!

[Originally published on SAP Community](https://blogs.sap.com/2014/02/16/mocking-up-the-payroll-control-center-fiori-app/)
