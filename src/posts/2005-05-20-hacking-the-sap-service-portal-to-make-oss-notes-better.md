---
layout: post
title: Hacking the SAP service portal to make OSS notes better
date: 2005-05-20
tags:
  - sapcommunity
---
Ahh, OSS notes – a topic close to my heart (see [Improving the OSS note experience](/blog/posts/2003/07/30/improving-the-oss-note-experience/) and [FOSDEM, and small OSS Notes Browser Hack](/blog/posts/2004/02/20/fosdem-and-small-oss-notes-browser-hack/)).

## The OSS Notes Experience

The other day I decided to stop going on about how painful using OSS notes on the web was, and do something about it. So I hacked up a [Greasemonkey](http://greasemonkey.mozdev.org/) script, `OssNoteFix`, that addresses the three main issues I have:

* Not having the OSS note number in the title of the page makes it hard to manage more than a couple of notes at once
* Not being able to click on a reference to a further OSS note to go straight to it
* Having my basic browsing experience messed up by the use of frames

## Enter Greasemonkey

Greasemonkey, to quote [Mark Pilgrim](https://web.archive.org/web/20060314091206/http://www.diveintomark.org/) in his very useful "[Dive Into Greasemonkey](https://web.archive.org/web/20060315035242/http://diveintogreasemonkey.org/)" online book, "is a Firefox extension that allows you to write scripts that alter the web pages you visit. You can use it to make a web site more readable or more usable. You can fix rendering bugs that the site owner can’t be bothered to fix themselves". The extension doesn’t do anything to web pages by itself, it’s the scripts that manipulate the pages once they’re loaded into the browser. (And yes, it’s for Firefox, a modern, standards-compliant browser. If you’re still using Internet Explorer, shame on you.)

## Laying The Groundwork

But before we get to the script, let’s lay a bit of groundwork that will help smooth things along. Visit Dagfinn’s weblog post [Easily access SAP notes from Firefox](https://web.archive.org/web/20210616075331/https://blogs.sap.com/2004/12/30/easily-access-sap-notes-from-firefox/) and follow his instructions to set up SSO access to service.sap.com, and to create a bookmark with a custom keyword so you can access OSS notes very simply. The SSO access avoids all those tiresome HTTP authentication popups your browser throws at you each time the front-end machine serving your request changes due to load balancing. The custom keyword bookmark allows you to request OSS notes directly by typing something like this into your address bar:

```text
note 19466
```

## Installing Greasemonkey and the OssNoteFix Script

Once you’ve got these set up, it’s time to install Greasemonkey. Visit the Greasemonkey homepage and follow the link to install it (you might have to add the Greasemonkey site to the list of sites allowed to install software). You’ll have to restart Firefox to have this extension take effect.

Now it’s time to install the Greasemonkey script that I wrote, `OssNoteFix`. Go to `http://www.pipetree.com/~dj/2005/05/OssNoteFix/ossnotefix.user.js` (no longer available, see below instead). Because of the ending (.user.js), Greasemonkey recognises it and gives you the option of installing it: Tools-\>Install User Script.

Once you’ve got it installed, visit an OSS note page:

```text
note 19466
```

and notice that, once it’s loaded:

* the OSS note number is in the title
* the numbers of the further notes referenced are clickable
* there are no frames

Hurrah!

## Watch the Screencast

I put together [a screencast](/images/2005/05/ossnotefix.gif) which demonstrates the creation of the OSS note bookmark, a visit to an OSS note page before OssNoteFix, the installation of the OssNoteFix user script, and the visit to an OSS note page after the installation. I’d already set up the SSO before I started recording, as that would have taken too long (and would be too boring to watch!) (Top tip: the screencast is at 800×600, so hit F11 to get fullscreen mode in your browser. Also, it’s a 3 Meg file, so please be patient while it comes down the pipe!).

## Caveat Emptor

Of course, the usual caveats apply – it’s a beta, SAP’s service portal pages are horribly complex and any change may break the script, and your own mileage may vary, blah blah blah. Also, the script sometimes matches 5 or 6 digit numbers that aren’t OSS notes. But it works for me. It was especially useful this week as I was installing a CRM 4.0 system.

This script is free and open source software, use it as you see fit, and if you’re not happy, you can get your money back 🙂

## OssNoteFix script

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

[Originally published on SAP Community](https://blogs.sap.com/2005/05/20/hacking-the-sap-service-portal-to-make-oss-notes-better/)
