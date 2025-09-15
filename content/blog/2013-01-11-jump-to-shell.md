---
title: Jump to Shell Workset Item from URL
date: 2013-01-11
tags:
  - sapcommunity
---
During SAP TechEd 2012 I attended CD163 "SAP HANA - Application Services Basics" which really helped firm up my knowledge of XS, thanks to the great presentation and exercises. What was interesting was that not only was SAPUI5 used for the UI components of the demos and exercises, but even the code snippets that the attendees would have to type in were made available to copy-n-paste, via a simple SAPUI5 Shell interface.

On reviewing the exercise text today, I noticed this bit:

![](/images/2013/01/urlsub2_173826.png)

The URL that pointed to the SAPUI5 Shell that contained the code to copy-n-paste had a query string in it, and that sub=3.1 caused the browser to go straight to a subitem in the Shell's workset item collection:

![](/images/2013/01/sub3_2_173827.png)

(please ignore the 256-colour quality of that shot)

I thought that was a nice touch, and dug around to see what they'd done. I was pretty certain I hadn't seen that as a feature described in the official and comprehensive SAPUI5 docu, so was curious.

What they'd done is added a small function to parse out the value of the "sub" parameter in the query string, and set the selected workset item accordingly. Here's that small function, `getURLParameter`:

```javascript
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}
```

(In case you're wondering, the `||[,null]` bit towards the end just makes sure there's no exception when the requested parameter isn't found by the regex).

The workset items were defined in the Shell object like this:

```javascript
oController.oShell = new sap.ui.ux3.Shell("myShell", {
  appIcon : "./images/sap_18.png",
  appIconTooltip : "SAP",
  appTitle : "CD163 Exercise Templates",
  showInspectorTool : false,
  showFeederTool : false,
  showSearchTool : false,
  content: html21,
  worksetItems: [new sap.ui.ux3.NavigationItem("NI_2″,{key:"ni_2″,text:"Exercise 2", subItems:[
    new sap.ui.ux3.NavigationItem("NI_2_1″,{key:"ni_2_1″,text:"2.1 Hello World"})]}),
    new sap.ui.ux3.NavigationItem("NI_3″,{key:"ni_3″,text:"Exercise 3", subItems:[
      new sap.ui.ux3.NavigationItem("NI_3_1″,{key:"ni_3_1″,text:"3.1 Simple OData"}),
      […]
```

and the requested workset item was set as selected, with the corresponding content, in a large switch statement like this:

```javascript
  switch (getURLParameter("sub")){
    case "2.1":
      oController.oShell.setSelectedWorksetItem("NI_2_1");
      oController.oShell.setContent(html21);
      break;
    case "3.1":
      oController.oShell.setSelectedWorksetItem("NI_3_1");
      oController.oShell.setContent(html31);
      break;
    case "3.2":
      oController.oShell.setSelectedWorksetItem("NI_3_2");
      oController.oShell.setContent(html32);
      break;
    […]
```

Nice effect.

I wanted to confirm this for myself, and try to use fewer lines of code than SAP had done, as it looked a little bit verbose. So I wrote a little standalone snippet, available in my Github repo '[sapui5bin](https://github.com/qmacro/sapui5bin)'. The snippet is [https://github.com/qmacro/sapui5bin/blob/master/SinglePageExamples/shell_wsi_nav.html](https://github.com/qmacro/sapui5bin/blob/master/SinglePageExamples/shell_wsi_nav.html) and defines a Shell with a few items / subitems like this:

```javascript
  var oShell = new sap.ui.ux3.Shell({    
      appTitle: "Shell WorksetItem Navigation",
      worksetItems:[
        new sap.ui.ux3.NavigationItem("id_wsiA", {key:"wsiA",text:"A",subItems:[ ]}),
        new sap.ui.ux3.NavigationItem("id_wsiB", {key:"wsiB",text:"B",subItems:[
          new sap.ui.ux3.NavigationItem("id_wsiB.1″, {key:"wsiB.1″, text:"B.1"}),
          new sap.ui.ux3.NavigationItem("id_wsiB.2″, {key:"wsiB.2″, text:"B.2"}),
        ]}),
      ]
    });
```

Note that my convention is to name the IDs the same as the keys, but with a prefix of `id_`.

I used the same `getUrlParameter()` function, but then used a simpler method to dynamically set the selected workitem and content based on the value of the `sub` query parameter, like this:

```javascript
  var subId = "id_wsi" + getUrlParameter("sub");
    var wsi = sap.ui.getCore().byId(subId) ? subId : 'id_wsiA';
    oShell.setSelectedWorksetItem(wsi);
    oShell.setContent(getContent(wsi));
```

In the second of these 4 lines, I'm just making sure I handle the case where the user hacks the URL query string to specify a sub item that doesn't exist: I make sure that I can find an element with the ID specified (knowing that if it begins `id_wsi` then it's a workset item) and defaulting to the first workset item if I can't.

![](/images/2013/01/b2_173831.png)

And that's it. Not a huge deal, but I was intrigued, and thought you might be too. For more info, see the complete snippet [shell_wsi_nav.html](https://github.com/qmacro/sapui5bin/blob/master/SinglePageExamples/shell_wsi_nav.html).

Share and enjoy!

[Originally published on SAP Community](https://blogs.sap.com/2013/01/11/jump-to-shell/)
