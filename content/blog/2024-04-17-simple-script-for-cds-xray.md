---
title: Simple script for previewing CDS models in CSN - cdsray
date: 2024-04-17
tags:
  - cap
  - cds
  - csn
  - bash
---
The [March 2024 release of CAP](https://cap.cloud.sap/docs/releases/mar24#cds-previews-from-editor-title-bars) brought many great new features including one for VS Code users - [CDS Previews From Editor Title Bars](https://cap.cloud.sap/docs/releases/mar24#cds-previews-from-editor-title-bars). It allows you to look, in realtime, at how your CDS model translates into various other representations, including YAML and JSON formats of Core Schema Notation (CSN)[<sup>1</sup>](#footnotes), EDMX (for the OData protocol) and various flavours of Data Definition Language (DDL). Here's a screenshot of it in action, courtesy of [Capire](https://cap.cloud.sap/docs/):

![preview in editor screenshot from Capire](https://cap.cloud.sap/docs/assets/preview-in-editor-title.Ja_PTMdH.png)

This feature really helps me visualise what I'm building, in that it gives me a live insight into how my model will be represented.

One aspect of this new feature that I find fascinating is that the default representation is the YAML flavour of CSN, rather than what most of us would expect when thinking about CSN, i.e. the JSON flavour. The reason is quite clear as soon as you start comparing the two: readability. YAML uses whitespace significantly, while JSON uses punctuation, to express structure. The result is that for any given structure, formatted YAML is more compact than its formatted JSON equivalent (unless you format JSON to the extreme with no or very little whitespace, which then makes it very difficult to read).

While I use VS Code, I'm more at home in my [PDE](/blog/posts/2023/11/10/til-two-tmux-plugin-manager-features/) and I also enjoy embracing the Unix philosophy of using "small tools loosely joined".

To that end, I built a simple script [cdsray](https://github.com/qmacro/dotfiles/blob/main/scripts/cdsray) (for "CDS X-ray") that gives me a similar experience. Inspired by the default choice of YAML flavoured CSN, I also opted to display YAML. 

```shell
#!/usr/bin/env bash

declare modelfile="${1:?Specify CDS model file to compile}"

declare scriptname="${0##*/}"
declare old="./.${scriptname}.old"
declare new="./.${scriptname}.new"

cds compile --to yaml "$modelfile" > "$new"

bat -p -l yaml "$new"
if [[ -f "$old" ]]; then
    echo
    diff --color "$old" "$new"
fi
cp "$new" "$old"
```

Not only does it display the YAML flavour of the CSN that the model compiles to, as the equivalent VS Code feature does, but it will also endeavour to show you the _differences_ compared to the previous version. This helps me enormously when I'm trying to understand the effect - in CSN - of a change or addition I make in my CDS model.

The script creates and uses two hidden files in the current directory, where the names are based on the script name (`./.cdsray.old` and `./.cdsray.new`). These files contain the previous (old) and current (new) versions of the YAML flavoured CSN for the model.

It relies on:

* `cds` to compile the model
* `bat` to display the YAML in a nice colour-coded way
* `diff` to show a colour-coded difference between the previous and current versions

In order to get the live effect, I use the script with `entr` to listen for changes on CDS files and automatically rerun the script, like this, for example:

```shell
ls *.cds | entr -c cdsray services.cds 
```

Here's a quick demo of it in action:

![Demo of cdsray](/images/2024/04/cdsray.gif)

---
<a href="footnotes"></a>
## Footnotes

1) For more on CSN and how it relates to CDS and CDL, see [CAP, CDS, CDL, CSN and jq - finding associations](/blog/posts/2024/04/05/cap-cds-cdl-csn-and-jq-finding-associations/).
