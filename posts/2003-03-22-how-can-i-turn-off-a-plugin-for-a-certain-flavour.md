---
layout: post
title: How can I turn off a plugin for a certain flavour?
tags:
- blosxom
- howto
- plugin
---


Use the config plugin and create a config.flavour (for the flavour you’d like it off) containing:

$blosxom::plugins{'smartypants'} = 0;


