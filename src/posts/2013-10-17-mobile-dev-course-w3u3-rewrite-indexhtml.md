---
layout: post
title: Mobile Dev Course W3U3 Rewrite - Index and Structure
date: 2013-10-17
tags:
  - sapcommunity
---
I [rewrote the mobile dev course sample app from W3U3](/blog/posts/2013/10/16/mobile-dev-course-w3u3-rewrite-intro/). This post explains what I changed in the index.html file, and why. It also takes a look at the general app structure of directories and files.

First, I'll take the lines of the new version of index.html chunk-by-chunk, with comments.

## index.html

```html
<!DOCTYPE HTML>
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
    <title>W3U3 Redone Basic</title>
```

There's an important meta tag that I added, the X-UA-Compatible one. This is to give IE the best chance of running SAPUI5 properly. Without this there could be rendering issues in IE. (Of course, the alternative is to stop using IE altogether, but that's a different debate!)

```html
    <script src="https://sapui5.hana.ondemand.com/sdk/resources/sap-ui-core.js"
        type="text/javascript"
        id="sap-ui-bootstrap"
        data-sap-ui-libs="sap.m"
        data-sap-ui-xx-bindingSyntax="complex"
        data-sap-ui-theme="sap_bluecrystal">
    </script>
```

Here in the bootstrap tag I'm specifying the complex binding syntax, which I'll be using later on (in the ProductDetail view, to fix a problem with the product image URL). I'm also specifying the Blue Crystal theme (sap_bluecrystal), rather than the Mobile Visual Identity theme (sap_mvi).

```html
    <script>
        jQuery.sap.log.setLevel(jQuery.sap.log.LogLevel.INFO);
        jQuery.sap.registerModulePath("com.opensap", "./myapp/");
        sap.ui.jsview("idAppView", "com.opensap.App").placeAt("root");
    </script>
```

This is where you'll see the biggest change in this file. The open.sap.com course version has a ton of \<script\> tags (12, to be precise) to load every single file in the app, including some that aren't even necessary. This is simply ignoring the automatic module loading mechanism that is built into SAPUI5. The mechanism not only allows you to avoid a sea of \<script\> tags, it also allows you to organise your app's resources in a clean and efficient way, refer to them semantically rather than physically, and have load-on-demand features too.

Here, we're saying "modules that begin with 'com.opensap' can be found in the 'myapp' directory below where we are". And then we use that module loading system directly by asking for the instantiation of the "com.opensap.App" view (giving it an id of "idAppView") before having it rendered in the main \<div\> tag (see below).

Also note the use of the jQuery.sap.log.* functions for console logging. This abstracts the logging mechanism so you don't have to think about whether console.log works in a particular browser properly (yes IE, I'm looking at you again).

```html
  </head>
  <body class="sapUiBody">
    <div id="root"></div>
  </body>
</html>
```

Instantiating the view, which has an associated controller with an onInit function, is also a better way, or at least a more SAPUI5-way, to kick off processing, rather than have a function referred to in the onload attribute of the \<body\> tag, as the open.sap.com course version of the app does. So this is how we're doing it here. The sap.ui.jsview call causes that view's controller's onInit function to run, rather than having an onload="initializeModel()" in the \<body\> tag.

## Files and app organisation

This post is also probably the best place to cover the app's organization and files, so I'll do that here as well. First, I'll show you what the original open.sap.com version looks like, then I'll show you what this new version looks like.

![Original version](/images/2013/10/originalstructure.png)

Here we see first of all that the views and controllers are split into separate directories. This isn't wrong, it just feels a little odd. So in the new version I've put the view/controller pairs together in a "myapp" directory.

More disconcerting is the model/modeljs file. The fact that the file is in a directory called "model" suggests that it has something to do with data. But when we look into the file there is some data-relevant stuff (creating a JSON model and setting it on the core) but there's also some view instantiation and placement for rendering. This is not ideal. It's not a problem that the model file is a script (when you're building JSON-based model data manually it's often useful to be able to construct properties and values dynamically), but I do have a problem with the mix of concerns.

There's often a js directory when the app requires 3rd party libraries that have functionality that SAPUI5 does not provide. These three files (Base64.js, datajs-1.1.1.js and SMPCloudHTTPClient.js) do not fall into this category, and don't belong here. In fact, this whole directory and its contents is not required:

Base64.js is used in the original version to encode a Basic Authentication username / password combination. As you'll see, this is very manual and not necessary.
The datajs-1.1.1.js library is a specific version of the OData library. SAPUI5 speaks OData natively and does not need an extra library; indeed, the inclusion of a specific version like this may clash with the one that SAPUI5 supplies and uses internally.
The SMPCloudHTTPClient.js here is used to create a new client object that includes the Application Connection ID (APPCID) header on requests to the SMP server. As you'll see in an upcoming post that looks more closely at the use and abuse of the OData modelling in the app, you'll see that this is also not necessary.

![Rewritten version](/images/2013/10/newstructure.png)

As you can see, the rewritten version is smaller, doesn't have extraneous and unnecessary libraries and has the view and controller pairs in one directory ("myapp", referred to in the module loading mechanism in the index.html file earlier).

It also has a 'real' model file that just has data in it - [app.json](https://github.com/qmacro/w3u3_redonebasic/blob/master/model/app.json). This data is just information about the relationship with the app backend on the SMP server and is very similar to the intention of the original version.

So, that's it for the index and app organisation. Have a look for yourself at the original and new versions of the index.html and model files, and compare them alongside this description here.

See the end of the initial post "[Mobile Dev Course W3U3 Rewrite - Intro](/blog/posts/2013/10/16/mobile-dev-course-w3u3-rewrite-intro/)" for links to all the parts in this series.

Until next time, share & enjoy!

[Originally published on SAP Community](https://blogs.sap.com/2013/10/17/mobile-dev-course-w3u3-rewrite-indexhtml/)
