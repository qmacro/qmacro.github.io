---
layout: post
title: CAP plugins deconstructed - part 2 - service introspection in the REPL
date: 2024-10-09
tags:
  - cap
  - cds
  - plugins
  - teched
  - keynote
  - introspection
---
In this second of a three part series of blog posts, we look at how to explore service information in a running CAP server, digging into the entities, elements and annotations using introspection.

## Background

This series of blog posts accompanies [my session](https://www.sap.com/events/teched/virtual/flow/sap/te24/catalog/page/catalog/session/1723584532995001g7Xm) in the Developer Keynote at [SAP TechEd Virtual](https://www.sap.com/events/teched/virtual/flow/sap/te24/catalog/page/catalog) this year. This is the second part that logically follows what I showed during the live session; now that we understand how the CDS plugin concept works, and have a skeleton plugin package, we need to work out what to do to inject behaviour into the service.
* [Part 1 - understanding how the mechanism works](/blog/posts/2024/10/05/cap-plugins-deconstructed-part-1-understanding-how-the-mechanism-works/)
* Part 2 - service introspection in the REPL (this post)
* Part 3 - writing our own plugin

> The examples in this series are based on CAP Node.js at release 8.3.0 ([September 2024](https://cap.cloud.sap/docs/releases/sep24)).

## Where things are

