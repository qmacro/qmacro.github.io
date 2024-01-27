---
layout: post
title: XML Views and Resource Bundle Declarations
date: 2014-01-28
tags:
  - sapcommunity
---
Just a quick post on the train on the way down to London this morning.

The other day, Andreas Kunz pointed to [an overview of the MVC options](https://sapui5.hana.ondemand.com/sdk/#docs/guide/MVC.html) which contains very detailed information - an interesting and recommended read. One of the things that piqued my interest was the ability, in XML views, to specify a resource bundle (for internationalisation) declaratively, using a couple of attributes of the root View element. This I thought was rather neat.

So further to my recent explorations and posts on XML views …

* [Mobile Dev Course W3U3 Rewrite - XML Views - An Intro](/blog/posts/2013/11/19/mobile-dev-course-w3u3-rewrite-xml-views-an-intro/)
* [Mobile Dev Course W3U3 Rewrite - XML Views - An Analysis](/blog/posts/2013/12/02/mobile-dev-course-w3u3-rewrite-xml-views-an-analysis/)
* [UI5 XML Views - Another Example](/blog/posts/2014/01/13/ui5-xml-views-another-example/)

… I thought I'd put together a little runnable app and make it available on [sapui5bin](https://github.com/qmacro/sapui5bin), to demonstrate it. The result is [XMLResourceBundleDeclaration](https://github.com/qmacro/sapui5bin/tree/master/XMLResourceBundleDeclaration), which is an index file, instantiating an XML view that has the resourceBundle declaration in it; this points to the resourceBundle.properties file in the i18n folder where you might expect to find it in other apps too.

The runnable is here: <https://github.com/qmacro/sapui5bin/tree/master/XMLResourceBundleDeclaration>

![](/images/2014/01/xmlresourcebundledeclaration.png)

Share and enjoy!

[Originally published on SAP Community](https://blogs.sap.com/2014/01/28/xml-views-and-resource-bundle-declarations/)
