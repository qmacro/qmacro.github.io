---
layout: post
title: Scratching an itch - UI5 Icon Finder
tags:
- icons
- singlefileapps
- ui5
---


There are a huge number of icons as standard in the UI5 library, both in the SAPUI5 and OpenUI5 flavours. Here’s the [Icon Explorer](https://openui5.hana.ondemand.com/test-resources/sap/m/demokit/icon-explorer/index.html) from the SDK.

![image]({{ "/img/2014/09/Screenshot-2014-09-14-at-20.35.07.png" | url }})One of the problems I have is that when I’m looking for an icon, the search term I have in my head is not necessarily going to match up with the name of the icon in the library.

For example, I might be looking for a “cog”, with the icon on the left in mind, but I’m not going to be able find it unless i use the term “action-settings”.

And in the light of the session I gave this weekend at [SAP Inside Track Sheffield](http://scn.sap.com/community/events/inside-track/blog/2014/05/02/sap-inside-track-sheffield--uk) on “Quick & Easy Apps with UI5″, where I focused on single-file apps, albeit with full MVC, I decided to hack together a little smartphone-focused app where I could search for icons, and add my own “aliases” so that next time I searched, the search would look at my aliases too.

It’s a very simple affair, and in this first version, is designed to use the [localStorage](http://diveintohtml5.info/storage.html) mechanism in modern browsers so that you build up your own set of aliases. Perhaps a future version might share aliases across different users, so that we can crowdsource and end up with the most useful custom search terms.

Anyway, it’s available currently at [http://pipetree.com/ui5/projects/iconfinder/](http://pipetree.com/ui5/projects/iconfinder/) and you can grab the sources from the [Github repo](https://github.com/qmacro/iconfinder) (remembering that the whole point of this is it’s a single-file app!).

![image]({{ "/img/2014/09/Screenshot-2014-09-14-at-20.48.52.png" | url }})

Here’s a short screencast of a version of it in action:

<iframe allowfullscreen="" frameborder="0" height="315" src="//www.youtube.com/embed/laNprcrApKc" width="560"></iframe>

Let me know what you think – is it useful? In any case, s<span style="line-height: 1.714285714; font-size: 1rem;">hare & enjoy!</span>

 


