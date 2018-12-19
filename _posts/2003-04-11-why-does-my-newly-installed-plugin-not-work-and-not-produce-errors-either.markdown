---
layout: post
title: Why does my newly installed plugin not work, and not produce errors either?
date: '2003-04-11 10:40:11'
tags:
- blosxom
- howto
- plugin
---


It could be that the name of the plugin (from unpacking it) contains dashes or things like that. Blosxom only loads plugins whose names contain alphanumeric or underscore characters (i.e. A-Z, 0-9, and _).

Check the filename and remove any offending characters.


