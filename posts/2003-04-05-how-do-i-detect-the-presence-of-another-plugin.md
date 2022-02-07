---
layout: post
title: How do I detect the presence of another plugin?
tags:
- blosxom
- howto
- plugin
---


All installed plug-ins:

keys %blosxom::plugins

All “on” plug-ins:

grep {$blosxom::plugins{$_} > 0} keys %blosxom::plugins

And if you’re interested in the order:

print join ', ', @blosxom::plugins


