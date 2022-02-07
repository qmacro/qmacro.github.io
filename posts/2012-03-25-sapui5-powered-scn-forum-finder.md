---
layout: post
title: SAPUI5 Powered SCN Forum Finder
tags:
- sap
- sapui5
- scn
- sdn
---


With the advent of the new [SAP Community Network](http://www.sdn.sap.com/irj/scn) platform, people have been wondering where the old SDN forums have gone. To this end, there’s a very useful “[Forum Finder for the New SCN](http://scn.sap.com/docs/DOC-18971)” which details the forum names, along with links to their new URL homes.

I thought it would be a nice exercise to take one of the [SAPUI5](http://www.sdn.sap.com/irj/sdn/index?rid=/webcontent/uuid/20a34ae7-762d-2f10-c994-db2e898d5f70) controls for a spin, namely the [SearchField](http://www.pipetree.com/~dj/sapui5/demokit/#docs/api/symbols/sap.ui.commons.SearchField.html). It has a great many options, and wraps some jQuery functions to provide a comfortable way to expose ‘intellisense’ style results as you type. It’s over there on the right, in the sidebar.

<div class="wp-caption alignnone" id="attachment_1378" style="width: 374px">![image]({{ "/img/2012/03/forumsearch1.png" | url }})SDN Forum Search

</div>From the Javascript, here’s the instantiation:

var oSdnSearch = new sap.ui.commons.SearchField("sdnSearch", { startSuggestion: 2, search: function (oEvent) { var topic = oEvent.getParameter("query"); window.open(oSdnAreaMap[topic], '_blank'); }, suggest: doSuggest });

Simple as that. I’ve pulled the SDN Forum names and URLs into an object oSdnAreaMap, and have a doSuggest() function that handles the suggest event by deriving matches and filling the search results.

This was a short hack started on the hotel room balcony and finished off in the airport. One thing I haven’t got to the bottom of yet is controlling the number of displayed matches. Hope to get that nailed down soon.

**Update 30 Mar 2012**

After some collaboration with [Ethan Jewett](http://twitter.com/esjewett) I’ve put the [code on github](https://github.com/qmacro/sdnforumsearch), and it now also matches anywhere in the string, rather than the match being anchored at the start. Share and enjoy!

**  
**


