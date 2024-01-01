---
layout: post
title: OssNoteFix script updated for Greasemonkey 0.6.4 and Firefox 1.5
date: 2006-02-07
tags:
  - sapcommunity
---
Last year, I got so frustrated at the pain of using the SAP Service Marketplace, and particularly OSS notes, that I got up and did something about it – I wrote ‘OssNoteFix’, a Greasemonkey script that:

put the OSS number and note title in the page’s title (and therefore the browser window/tab too)
made OSS note numbers in the text of the OSS note into clickable links
removed the dreadful frames so you can, e.g. bookmark the notes

You can read more about it in [Hacking the SAP service portal to make OSS notes better](/blog/posts/2005/05/20/hacking-the-sap-service-portal-to-make-oss-notes-better/) or just watch the [screencast](/images/2005/05/ossnotefix.gif) of how it works.

Since then, new versions of Firefox (1.5) and Greasemonkey (0.6.4, for Firefox 1.5) have been released. Greasemonkey’s security model has changed, and OssNoteFix stopped working. Well, this weekend I finally found a couple of tuits and got round to updating the script, which is now focused on running with these releases of Greasemonkey and Firefox (if you haven’t upgraded, do so now!).

So without further ado, OssNoteFix 0.2 is available for installation (see below).

For those of you who are interested, and / or want to be confused, [here’s some background info](https://web.archive.org/web/20060103223311/http://www.oreillynet.com/lpt/a/6257). Of course, you can look at the code to see how it works and what changes were made, and even modify it to suit your own purposes, because it’s Open Source.

Share and enjoy!

```javascript
// OssNoteFix
// version 0.1 BETA!
// 2005-05-18
// Copyright (c) 2005, DJ Adams

// OssNoteFix
//
// ==UserScript==
// @name          OssNoteFix
// @namespace     http://www.pipetree.com/qmacro
// @description   Make OSS note pages more useable
// @include       https://*.sap-ag.de/*
// ==/UserScript==
//
// --------------------------------------------------------------------
//

var textnodes, node, s, newNode, fnote;

// This is the URL to invoke an OSS note. Ugly, eh?
var linkurl = "<a href='https://service.sap.com/~form/handler?_APP=01100107900000000342&_EVENT=REDIR&_NNUM=$1'>$1</a>";

// Right now, an OSS note number is 5 or 6 consecutive digits,
// between two word boundaries. Should be good enough for now.
var ossmatch = /\b(\d{5,6})\b/g;

// Act upon the 'main' framed document which has a form 'FNOTE'
// and the title 'SAP Note'.
if ((fnote = document.FNOTE) && document.title.match('SAP Note')) {

  // Get stuffed, evil frames!
  if (top.document.location != document.location) {
    top.document.location = document.location;
  }

  // Make a useful document title from the OSS note number,
  // found in the FNOTE form's _NNUM input field, and the
  // OSS note title (which is in the first H1 element.
  var h1 = document.getElementsByTagName('h1')[0];
  var heading = h1.firstChild.data;
  heading = heading.replace(/^\s*(.+?)\s*$/, "$1");
  document.title = fnote._NNUM.value + " - " + heading;

  // Make the plain text references to OSS notes into a href links
  // pointing to their home in http://service.sap.com
  textnodes = document.evaluate(
    "//http://text()",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

  for (var i = 0; i < textnodes.snapshotLength; i++) {
    node = textnodes.snapshotItem(i);
    s = node.data;

    // Got a match? Make it into a link
    if (s.match(ossmatch)) {
      newNode = document.createElement('div');
      newNode.innerHTML = s.replace(ossmatch, linkurl);
      node.parentNode.replaceChild(newNode, node)
    }

  }

}
```
[Originally published on SAP Community](https://blogs.sap.com/2006/02/07/ossnotefix-script-updated-for-greasemonkey-064-and-firefox-15/)
