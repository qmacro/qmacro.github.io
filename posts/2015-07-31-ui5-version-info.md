---
layout: post
title: UI5 Version Info
tags:
- openui5
- sapui5
- versioninfo
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 28 by [DJ Adams](//qmacro.org/about/)**

![]( {{ "/img/2018/02/Screen-Shot-2015-07-31-at-13.04.22-624x312.png" | url }})

Yesterday Peter Müßig from the UI5 team at SAP in Walldorf [announced](https://twitter.com/pmuessig/status/626649315235229696) the multi-version capability for SAPUI5.

He also documented the details in a post on the SAP Community Network here: “[Multi-Version availability of SAPUI5](http://scn.sap.com/community/developer-center/front-end/blog/2015/07/30/multi-version-availability-of-sapui5)“. Shortly after, the [announcement](https://twitter.com/OpenUI5/status/626658243071315968) was also made that this would also be available for OpenUI5.

This is great news, and something that we’ve been waiting for now for a while. It makes perfect sense, and the ability to select a particular runtime version via a part of the bootstrap URL’s path info is very nice. It’s something I do locally on my workstation anyway, and I also have a ‘latest’ symbolic link that I ensure points to the latest copy of the runtime or SDK that I have locally.

Along with the announcement came a link to a simple [SAPUI5 Version Overview](https://sapui5.hana.ondemand.com/versionoverview.html) page, built in UI5. It looks like this:

![]( {{ "/img/2018/02/Screen-Shot-2015-07-31-at-13.11.42-624x330.png" | url }})

And if you look under the covers, you’ll see a single-file app, with a lot of custom CSS, some JavaScript view stuff going on, and the retrieval of a couple of JSON resources containing the [version overview info](https://sapui5.hana.ondemand.com/versionoverview.json) and the data from the [neo-app.json](https://sapui5.hana.ondemand.com/neo-app.json) file that is present in the HCP platform and which describes routes to destinations, which include the SAPUI5 runtime services, now available at different paths for different versions.

You’ll also see some [complex manipulation and merging of those two datasets](https://github.com/qmacro/ui5versioninfo/blob/master/versionoverview.html#L207-L263), and [the mix of UI5 controls with raw HTML header elements](https://github.com/qmacro/ui5versioninfo/blob/master/versionoverview.html#L298-L308).

![]( {{ "/img/2018/02/Screen-Shot-2015-07-31-at-13.22.44-169x300.png" | url }})

The result is an app that looks OK on the desktop but doesn’t look that well on a smartphone, as you can see above.

So I spent some time on the train down from Manchester to London early this morning to see what I could do.

I wanted to address a couple of things:

- have the smartphone as the target device, rebuilding the UI with an App control
- improve the binding, to a single data collection

The UI part was straightforward. I used my MVC technique (see [MVC – Model View Controller, Minimum Viable Code](/2015/07/21/mvc-model-view-controller-minimum-viable-code/) from earlier in this series) to define a new View, declaratively in XML. I used an App control with a couple of Pages, and a simple controller for the view which handled all the view lifecycle and user-generated events, as well as being the container for the formatter functions.

I also used some of my favourite JavaScript functions to bind together the disparate data into a nice cohesive single array of maps. I left the original data manipulation as it was, and then grabbed what it produced to make my array. I could then bind the List in UI to this single array, and then confer the right binding context to the second Page for a selected item from the array.

I’ve created a small Github repo [ui5versioninfo](https://github.com/qmacro/ui5versioninfo) with the files. It contains a local snapshot of the two source JSON files ([neo-app.json](https://github.com/qmacro/ui5versioninfo/blob/master/neo-app.json) and [versionoverview.json](https://github.com/qmacro/ui5versioninfo/blob/master/versionoverview.json)), the original [versionoverview.html](https://github.com/qmacro/ui5versioninfo/blob/master/versionoverview.html) that produces the UI we saw earlier, and a new file, called [new.html](https://github.com/qmacro/ui5versioninfo/blob/master/new.html?ts=2), which is my quick attempt addressing those things above.

Here’s what the result looks like:

![versioninfo]( {{ "/img/2018/02/versioninfo.gif" | url }})

I’ve tried to use some UI5 design and control best practices, while [defining the UI in XML](https://github.com/qmacro/ui5versioninfo/blob/master/new.html?ts=2#L15-L92). I’ve added some [functional programming style data merging](https://github.com/qmacro/ui5versioninfo/blob/master/new.html?ts=2#L191-L209) to take place after the original manipulation, and a [small controller](https://github.com/qmacro/ui5versioninfo/blob/master/new.html?ts=2#L211-L259) with the requisite functions for event handling and formatting.

I took the screencast of the “finished” attempt on the tube from London Euston to Chiswick this morning, so it really was a rush job. But I think that it’s worth thinking about how we can improve this useful resource. How would you improve it?

 


