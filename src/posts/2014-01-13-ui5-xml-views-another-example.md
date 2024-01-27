---
layout: post
title: UI5 XML Views - Another Example
date: 2014-01-13
tags:
  - sapcommunity
---
I've been diving into UI5 XML views and sharing the love recently - see [Mobile Dev Course W3U3 Rewrite - XML Views - An Intro](/blog/posts/2013/11/19/mobile-dev-course-w3u3-rewrite-xml-views-an-intro/) (as part of [Mobile Dev Course W3U3 Rewrite - Intro](/blog/posts/2013/10/16/mobile-dev-course-w3u3-rewrite-intro/)), and the XML view based templates and snippets in my [SublimeUI5](https://github.com/qmacro/SublimeUI5) Package for the "developer's choice" Sublime Text editor.

Recently John Patterson supplied a JSBin example of an OData sourced table with a filter on dates, in answer to [Using Table filter when a formatter function is used](https://web.archive.org/web/20240119051837/http://scn.sap.com/message/14432063#14432063).

This was a very nice example but I thought it would be an interesting exercise to convert it to XML, for a number of reasons:

* XML views are important (in the context of learning about and extending Fiori apps)
* it would be a good test of my latest #SublimeUI5 snippet [index - Mobile - Single Page - MVC](https://github.com/qmacro/SublimeUI5/blob/master/Snippets/indexmspmvc.html.sublime-snippet) (indexmspmvc) (Note 1)
* all of the XML view work I've done so far has involved controls predominantly from the sap.m library (as they're also what the Fiori apps are built with) so I wantd to try using non-sap.m controls (Note 2)

So I did, and have made it available in the [sapui5bin repo on Github](https://github.com/qmacro/sapui5bin) here:

[sapui5bin/SinglePageExamples/ODataDateTableFilter.html at master · qmacro/sapui5bin · GitHub](https://github.com/qmacro/sapui5bin/blob/master/SinglePageExamples/ODataDateTableFilter.html)

Open up this link in a separate window to view it and read the rest of the post.

I'll cover the "single page MVC" concept in another post; for now, here are a few notes to help you navigate:

* the XML view is defined in a script tag with the id "view1" and brought to life with `sap.ui.xmlview({ viewContent: jQuery('#view1').html() })`
* I've specified the XML namespace declarations (xmlns) for the relevant libraries, having the most common controls' namespace (sap.ui.table) as the default
* I've used the extended binding syntax for the Table's "rows" aggregation, to include the OData select parameters
* I've declared the date formatting 'dateShort' (for the third column) in a namespace (util.formatting) with jQuery.sap.declare
* We have a local controller (which doesn't actually have anything to do)
The one thing I'm not entirely convinced about is having to set the filterType property on the BirthDate column "procedurally" (in JavaScript); perhaps I'll get round to looking into how to do this particular bit a different way at some stage.

Anyway, I thought this might be more useful insight into XML views and single page MVC examples.

Share & enjoy!

Note 1: This "single page MVC" idea is something I've wanted to put together and share for a while; it's easy to write a single page demo UI5 app but not so easy to do that and involve the MVC concept as well - in a single file … until now.

Note 2: The SAP Fiori Wave 1 apps have views that are written declaratively in HTML; the SAP Fiori Wave 2 and 3 apps have views written in XML, using the sap.m controls, with a smattering of sap.ui.layout controls too

[Originally published on SAP Community](https://blogs.sap.com/2014/01/13/ui5-xml-views-another-example/)
