---
title: CDS source formatting and readability
date: 2025-09-16
tags:
  - cds
  - cap
description: Embracing a modern approach to source code formatting for human-centric modelling in CAP
---

## Background

I still remember my son Joseph showing me, years ago now, the power of [gofmt](https://pkg.go.dev/cmd/gofmt), a tool that automatically formats Go source code. The blog post [go fmt your code](https://go.dev/blog/gofmt) introduces the tool, and more importantly the philosophy of embracing such a tool, with these points that I will reproduce here. Code automatically formatted is:

- _easier to read_: when all code looks the same you need not mentally convert others' formatting style into something you can understand
- _easier to write_: never worry about minor formatting concerns while hacking away
- _easier to maintain_: mechanical changes to the source don't cause unrelated changes to the file's formatting; diffs show only the real changes

It's also makes for a less controversial experience generally as you're not going to be arguing over how to use whitespace or other syntactic symbols.

## The importance of domain modelling and the language used

In [Five reasons to use CAP](/blog/posts/2024/11/07/five-reasons-to-use-cap/) I talk about [domain modelling being a first class citizen](https://qmacro.org/blog/posts/2024/11/07/five-reasons-to-use-cap/#2-domain-modelling-is-a-first-class-citizen); it's a critical part of the design and of the process, and the CDS model, described in the declarative and high level [Conceptual Definition Language](https://cap.cloud.sap/docs/cds/cdl) (CDL)[<sup>1</sup>](#footnotes) is central to that, being a language that both domain expert and programmer alike use to meet and describe models and behaviours.

Reading and writing CDS models is therefore an important skill for us all to cultivate. Having a consistent format, a sort of "forma franca", can only help with that.

## CAP tools for formatting CDS model sources

The [CDS Editors and IDEs](https://cap.cloud.sap/docs/tools/cds-editors) topic in Capire gives us a nice overview of the key tools available for CAP developers.

These tools include facilities for formatting CDS sources, which you may have already come across when using the [CDS Language Support](https://marketplace.visualstudio.com/items?itemName=SAPSE.vscode-cds) extension for VS Code:

![animated demonstration of formatting CDS sources in VS Code](/images/2025/09/vs-code-cds-format.gif)

The CAP team did a superb job of making such facilities available, in the form of language server, so I can also [use it](https://github.com/qmacro/dotfiles/blob/2620e2d0995c8b3529d2dc4768e4d4cac0db94b2/config/nvim/lsp/cds.lua) in my editor of choice, Neovim (automatically [formatting on save](https://github.com/qmacro/dotfiles/blob/2620e2d0995c8b3529d2dc4768e4d4cac0db94b2/config/nvim/init.lua#L14-L23)):

![animated demonstration of formatting CDS sources in Neovim](/images/2025/09/neovim-cds-format.gif)

There's also a standalone CLI tool `format-cds` which is described in the [CDS Source Formatter](https://cap.cloud.sap/docs/tools/cds-editors#cds-formatter) section of Capire's CDS Editors and IDEs topic, where you can find out what the different formatting options are and how to set them. Here's a demonstration of `format-cds` in action, on the same `srv/cat-service.cds` sample source file:

![animated demonstration of formatting CDS sources with the format-cds command](/images/2025/09/format-cds-example.gif)

While there are plenty of options to express your formatting preferences, I like the idea of the "standard format", as championed by the official CDS formatter's defaults.

## Formatting of sample CDS sources

With the advent of CAP's [August 2025 release](https://cap.cloud.sap/docs/releases/aug25) (at 9.3.0+ for the Node.js runtime) I'm very happy to see the alignment of the CDS model sources in both the `sample` and `tiny-sample` facets with this standard format.

The examples above used one of these source files, specifically `srv/cat-service.cds` from the `sample` facet, and each of the animations shows the before (pre August 2025 release) and after (August 2025 release and onwards) format - and as you we can see, the formatting of those sources today are aligned with the standard format.

This means that when starting from the samples, we are:

- being exposed to the "standard format"
- starting in a good place from where we can continue
- seeing more clearly the structure of CDS and the language's artifacts

I for one welcome the change[<sup>2</sup>](#footnotes) and hope that this can trigger a deeper interest in and love for the CDS language in general, and a focus on how best to express it in particular. If nothing else, it will get us talking!

## Footnotes

1. While technically "CDL" is more accurate when referring to the language of domain modelling, I will use "CDS" here, as a form of (reverse) [synechdoche](https://en.wikipedia.org/wiki/Synecdoche).
1. OK, I admit, it was me that requested this, and the team very kindly agreed, thanks folks!
