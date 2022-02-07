---
layout: post
title: Morning Fiori Fix
tags:
- fiori
- fix
- ui5
---


John Moy [tweeted](https://twitter.com/jhmoy/status/564656599361261570) today about the Fiori App Reference Library showing duplicate entries recently. It’s something I’d noticed too, after checking the app following the publication of information on SCN about new Fiori apps on the post “[New Fiori Apps for HCM](http://scn.sap.com/community/erp/hcm/blog/2015/02/04/new-fiori-apps-for-hcm)” last week.

I’m not 100%, so earlier this morning I needed a bit more time than usual to get my brain in gear. So with a coffee I decided to spend a few mins hacking the list display. It’s not a permanent solution of course, but at least demonstrates that there are [properties in the Apps entity](https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/services/exparam.xsodata/Apps?$skip=0&$top=100&$orderby=appName%20asc&$filter=substringof(%27leave%27,tolower(appName))&$inlinecount=allpages&$format=json&$select=appName,PVFrontend) that can be used to distinguish the “duplicate” entries. Should be a quick fix (yes, pun intended!) for the Fiori Implementation eXperience folks to carry out.

Here’s a quick screencast as an animated GIF (why not?)

![image]({{ "/img/2015/02/fixappfix.gif" | url }})

Right, on with the morning.


