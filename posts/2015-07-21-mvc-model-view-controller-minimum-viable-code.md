---
layout: post
title: MVC - Model View Controller, Minimum Viable Code
tags:
- atom
- controller
- fragment
- mvc
- snippets
- startup
- sublime
- ultisnip
- view
- vim
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 18 by [DJ Adams](//qmacro.org/about/)**

![View and controller screenshot]( {{ "/img/2018/02/Screen-Shot-2015-07-19-at-18.58.14-1.png" | url }})

The solid Model View Controller implementation in UI5 forces the separation of concerns. The logical place for models, views and controllers are files, in (usually) separate folders. Views, with specific file extensions, in a folder that’s usually called “views”, and controllers, with specific file extensions, in a folder called “controllers”. And models elsewhere too.

This means that if you’re wanting to try something out quickly, and it’s a little bit more than a Hello World construction, then you’re off creating files and folders from the start before you can properly start thinking about the actual app idea you want to explore.

That is, unless you use a “Minimum Viable Code” technique. I like to think that it’s due to a combination of the three great virtues of a programmer ([laziness, impatience and hubris](http://c2.com/cgi/wiki?LazinessImpatienceHubris)) that led to this approach :-).

Creating a folder structure and getting the right files in place does not go well with the “quickly” part of “try something out quickly”. Trying something out, for me, means ideally using just a single file. It’s fast, you can see everything in one place, and you’re not creating unnecessary clutter. But when I want to try something out also, I also want to ensure that the code I write is clean and separated. Which for me implies declarative views and fragments in XML.

Luckily, for nearly all of the cases where I’ve wanted to try something out, I’ve found that this single file technique works well. I can have one or more views, and fragments, all declared in XML, and one or more controllers too. And within that space I can declare models too.

Here’s how it works:

- I start out with a skeletal index.html with a UI5 bootstrap already there, and the HTML body element defined properly
- I add a simple triple (or [tripel](http://www.beeradvocate.com/beer/style/58/))  of : view, corresponding controller, and what I call ‘startup code’
- I can then add controls to the view, functions to the controller, and off I go
- I use jQuery to identify the XML views and fragments, and construct the view instances in UI5 that way

And here’s an example:

![MVC code]( {{ "/img/2018/02/Screen-Shot-2015-07-19-at-18.09.27-725x1024.png" | url }})

Here’s a brief rundown of what you see:

**9-16**: This is the UI5 bootstrap, nothing unusual here

**18-28**: Here we have a script element that is of a made-up type “ui5/xmlview”. This could be pretty much anything, as long as the browser doesn’t try to process it. It’s a technique used in templating systems. This contains some XML, which as you can see is a small but perfectly formed view definition (which incidentally conforms to the [UI5 Coding Standards explained in a previous post](/2015/07/19/ui5-and-coding-standards/) in this series.

**31-36**: This is the local controller definition, which is referenced in the View’s controllerName attribute (in line 20). It has the onPress handler for the Button’s press event.

**38-40**: This is the startup code. It instantiates the XML View, getting the value for the viewContent property via jQuery from the script element we saw earlier, and then simply places that View in the body, via the “content” ID, as usual.

And that’s pretty much it. You can add as many views as you want using the script element technique; I also use this technique for fragments too, and specify a made-up type of “ui5/xmlfragment” instead.

It’s a great way to write simple one-file applications, especially for prototyping. I have written snippets to help me with this. I have been somewhat fickle when it comes to editors, so have left a trail of semi-finished snippet libraries for Sublime ([SublimeUI5](https://github.com/qmacro/SublimeUI5)) and Atom ([ui5-snippets](https://github.com/qmacro/ui5-snippets)), but have finally come full circle to my first love, vim. [Here’s a quick screencast](https://www.youtube.com/watch?v=nN1PYHa-YXQ) of using my snippets in vim (powered by [UltiSnips](https://github.com/SirVer/ultisnips)) to create a Minimum Viable Code MVC style app:

<iframe allowfullscreen="allowfullscreen" frameborder="0" height="315" src="https://www.youtube.com/embed/nN1PYHa-YXQ" width="560"></iframe>


