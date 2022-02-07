---
layout: post
title: Atom, Snippets, Tabs and CSON parsing
tags:
- atom
- cson
- cson-safe
- openui5
- sapui5
- snippets
- tabs
- ui5
---


This morning on the train down from Manchester to Bristol I fired up the Atom editor and noticed that when trying to load a snippets file from my [ui5-snippets](https://github.com/qmacro/ui5-snippets) package, I got an error:

![image]({{ "/img/2015/01/Screen-Shot-2015-01-19-at-08.18.19.png" | url }})

Between Stafford and Wolverhampton I hacked around with the source, particularly the html.cson file that contained a number of UI5 snippets for HTML files. From where was this error message emanating, and why now?

Well, it seems that a few days ago, in [release 0.171.0](https://github.com/atom/atom/releases/tag/v0.171.0), Atom had moved from parsing CoffeeScript Object Notation (CSON) with [cson](https://github.com/bevry/cson), to parsing with [cson-safe](https://github.com/groupon/cson-safe). CSON is the format in which snippets can be written. Moving to cson-safe meant that the parser was rather stricter and was the source of the “*Syntax error on line 4, column 11: Unexpected token*” error.

By the time we’d got to Birmingham, I’d figured out what it was: tabs. In wanting to move in the direction of the [UI5 coding standards](https://github.com/SAP/openui5/blob/master/CONTRIBUTING.md#contribute-code), I’d started moved to tabs for indentation within the UI5 snippets, as you can see in [this openui5 starter snippet](https://github.com/qmacro/ui5-snippets/commit/d661a4b3132f50c99262972c85f48f69ad79e44a). While the original cson parser used by Atom was fine with real tabs in the snippet source file, cson-safe didn’t like them.

[Switching the tabs to literal “\t” tab representations](https://github.com/qmacro/ui5-snippets/commit/260441b096b2f280fb81f91715182df153f65200) (i.e. backslash then ‘t’) solved the issue.


## 

 

 


