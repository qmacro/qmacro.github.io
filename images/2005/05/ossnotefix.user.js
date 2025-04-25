var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

// OssNoteFix
// version 0.2 BETA!
// Copyright (c) 2005,2006 DJ Adams
//
// Changes
// 2006-02-05 0.2 dja Access form via XPCNativeWrapper stuff, for more
//                    info see http://www.oreillynet.com/lpt/a/6257 #3
// 2005-05-18 0.1 dja First version

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
var linkurl = "<a href='https://web.archive.org/web/20060313005908/http://service.sap.com/~form/handler?_APP=01100107900000000342&_EVENT=REDIR&_NNUM=$1'>$1</a>";

// Right now, an OSS note number is 5 or 6 consecutive digits,
// between two word boundaries. Should be good enough for now.
var ossmatch = /\b(\d{5,6})\b/g;

// Act upon the 'main' framed document which has a form 'FNOTE'
// and the title 'SAP Note'.
if ((fnote = document.forms.namedItem("FNOTE")) && document.title.match('SAP Note')) {

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
  document.title = fnote.elements.namedItem("_NNUM").value + " - " + heading;

  // Make the plain text references to OSS notes into a href links
  // pointing to their home in http://service.sap.com
  textnodes = document.evaluate(
    "//web.archive.org/web/20060313005908/http://text()",
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




}
/*
     FILE ARCHIVED ON 00:59:08 Mar 13, 2006 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 13:10:04 Apr 25, 2025.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 0.78
  exclusion.robots: 0.033
  exclusion.robots.policy: 0.019
  esindex: 0.011
  cdx.remote: 18.611
  LoadShardBlock: 167.76 (3)
  PetaboxLoader3.datanode: 128.518 (4)
  PetaboxLoader3.resolve: 145.815 (2)
  load_resource: 118.573
*/