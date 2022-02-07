---
layout: post
title: How do I get plugin Y to run before plugin X?
tags:
- blosxom
- howto
- plugin
---


It might be the case that you want plugin Y to run before plugin X, because of what X does with what Y is supposed to have already done. Blosxom loads plugins in filename order, so make sure the alphanumerical order of your plugin filenames reflects the order you want your plugins to run.

A common way to do this is to prefix the plugin filenames with digits, like this:

00pluginY 01pluginX

and so on.


