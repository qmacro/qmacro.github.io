---
layout: post
title: New Blosxom plugin 'submission'
tags:
- blosxom
- plugin
---


I’ve just written a plugin ‘[submission](/~dj/2003/03/submission)‘ which provides [Blosxom](http://www.raelity.org/apps/blosxom) with a mechanism for accepting content POSTed to it. I wrote it initially as a mechanism for people to submit plugin information to the [plugin registry](http://www.raelity.org/apps/blosxom/plugins), but made it a bit more generic.

The idea is that you can have Blosxom accept submitted entries and treat them as ‘pending’, using a ‘.txt-‘ file extension, so they’re not immediately viewable in the weblog output. You can then review the entries and publish them by changing the extension to ‘.txt’ (or not, as the case may be).

The mechanism will kick in in one of two modes:

<dl><dt>*Accepting POSTed HTML form content*</dt><dd>Form data is received, formatted by a chosen ‘formatter’ (specify via the ‘-format’ parameter in the form, or allow to fall back to to the default formatter built into the plugin itself), and written as a pending entry in Blosxom’s datadir path. A display of the currently pending entries is then displayed.</dd><dt>*Listing pending entries*</dt><dd>You can also get to the list of currently pending entries by suffixing the query string ‘?pending’ onto the end of the weblog’s URL.</dd></dl>The plugin uses a special ‘pending’ flavour so you can have the pending entries displayed differently to the regular entries.

There’s also a separate directory where you can add your own formatters; this is the ‘formatlib’ that should be created in the plugin directory itself. I’ve written a simple formatter that lives in this directory, called ‘[plugin](/~dj/2003/03/plugin)‘ that accepts a plugin submission (name, category, URL, description, author) and formats it into an entry (body) style similar to those shown in the registry at the moment.

It’s a basic bit of code, works for me. I’ve already got a few mods in mind, such as, perhaps, accepting payloads in other formats such as an <acronym title="Rich Site Summary">RSS</acronym> item (it could then be parsed and appropriately formatted by an RSS-item-aware formatter). That’s for later, though.


