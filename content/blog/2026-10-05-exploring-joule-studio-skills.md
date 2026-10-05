---
title: Exploring Joule Studio skills
date: 2026-10-05
tags:
  - joule-studio
  - skills
  - shell
description: Exploring the Joule Studio skills with a quick shell script.
---

The new [Joule Studio
CLI](https://help.sap.com/docs/joule-studio/joule-studio/joule-studio-for-cli-pro-code-development-in-joule-studio)
recently landed, in the form of `jl`. This is what we use on the command line
to initialise a new Joule Studio project. What does that mean? Well, amongst
other things, it means:

- you work on your project using a coding agent harness such as Claude Code or
  OpenCode
- such agent harnesses know about, and how to make use of
  [skills](https://agentskills.io/specification)
- for Joule Studio powered development, there is a curated set of skills
  specifically designed for building enterprise agents and more

Initialising a new project not only creates some harness-specific
configuration[<sup>1</sup>](#footnotes) but also retrieves this set of skills.

## Skills retrieved

Here's what that looks like:

```shell
# /tmp
; jl init opencode myproj && cd myproj

Fetching system skills...
  ✓ agent (+37 resources)
  ✓ agent-evaluation (+8 resources)
  ✓ agent-extension (+9 resources)
  ✓ data-product (+11 resources)
  ✓ deploy-solution
  ✓ intent-analysis
  ✓ joule-studio-cli
  ✓ mcp-mock-config (+4 resources)
  ✓ mcp-translation-file
  ✓ n8n-workflow (+21 resources)
  ✓ product-requirements-document (+1 resource)
  ✓ setup-solution (+2 resources)
  ✓ specification (+1 resource)
✓ 13 skills initialized in myproj/.agents/skills.

Creating configuration files:
  ✓ myproj/opencode.json — created

OpenCode MCP config initialized: /tmp/myproj
# /tmp/myproj
;
```

> The specific skills retrieved here will depend on various circumstances,
> you may see a slightly different list.

## Browsing the skill details

I wanted to explore these skills and get a better understanding of what they
were. So I wrote a quick shell script (yes, I wrote it, not AI, to help
maintain my cognitive fitness[<sup>2</sup>](#footnotes)), which allows me to
browse them and get an overview, like this:

![Skill browser in action](/images/2026/10/skillbrowser.gif)

## A brief look at the script

The shell script,
[sb](https://github.com/qmacro/dotfiles/blob/main/scripts/sb), now forms part
of my personal development environment ([PDE](/tags/pde/)) and also uses other
tools that I have in there. Here's the script in its entirety:

```bash
#!/usr/bin/env bash

set -eo pipefail
declare FILEBROWSER=lf

fm() {

  awk '/^---$/ { if (n++) exit; next } n'

}

pv() {

  local skillfile=$1
  local width=$2

  fm < "$skillfile" \
    | yq -r '"\(.name|ascii_upcase) (\(.metadata.version))\n\n\(.description)"' \
    | fmt -s -w "$width"

}

export -f pv fm

main() {

  local loc="${1:-.}"
  local descwidth=$((($(tput cols) / 2) - 5))
  local selection

  selection="$(
    while read -r skill; do
      echo "$skill" \
        | awk -F/ '{print $4, $0}'
    done <<< "$(find "$loc" -name "SKILL.md")" \
      | fzf \
        --with-nth=1 \
        --preview "pv {2} $descwidth" \
      | cut -d' ' -f 2
  )"

  "$FILEBROWSER" "$(dirname "$selection")"

}

main "$@"
```

The general idea is that `SKILL.md` files are found, passed to
[fzf](https://github.com/junegunn/fzf) for selection and
preview[<sup>3</sup>](#footnotes), and then a selected skill can be drilled
into as well.

Here are some notes:

- The `fm` function extracts [YAML
  frontmatter](https://docs.github.com/en/contributing/writing-for-github-docs/using-yaml-frontmatter)
  which is expected to be found between two `---` lines.

- The `pv` function takes a skill file (fully qualified path and name) and also
  a width, uses `fm` to extract the frontmatter from it, and then uses `yq` to
  extract various values from the frontmatter, emitting them nicely, and
  line-wrapped to a certain width with the `fmt` command.

  Like this:

    ```text
    SETUP-SOLUTION (1.0.0)

    Set up the solution structure with a
    solution.yaml and assets folder, each
    containing an asset with an asset.yaml
    file. Used to create a solution, to create
    an asset and to set up a multi-asset
    solution.
    ```

- These two script-local functions are exported to be available to any
  subprocesses, useful for when `fzf` spawns a shell to run the command
  specified in the `--preview` option.

- The `main` function will default to the current directory (`.`) if no
  location is specified to search for skills in.

  It then:

  - Calculates a width that is slightly less than half the current terminal
    width, to send to the `fm` function so that the skill info fits into
    `fzf`'s default preview window shape.

  - Uses `find` to search for the full paths of any `SKILL.md` files, which
    look like this: `./.agents/skills/setup-solution/SKILL.md`.

  - Processes these full paths with `awk` to emit the significant part
    (`setup-solution` in this example) to be used in `fzf`'s selection list,
    and also the entire path, to be used for subsequent processing.

  - The resulting output is then passed to `fzf` to present a simple selection
    and preview UI, as shown in the video.

  - If a selection is made, `cut` is then used to select the second value that
    is emitted from `fzf` (the full path to the selected skill file) and then
    the configured file browser (I use [lf](https://github.com/gokcehan/lf)
    here) is invoked on the directory that contains that skill file.

That's pretty much it. The script may change a little over time, but it works
for me now, and removes the friction I had which was stopping me from exploring
the detail of these important assets.

## Footnotes

1. At the time of writing, this configuration consists of a section defining an
   MCP server and how to invoke it. More on that another time, perhaps.

1. Also, as shell scripts (particularly Bash shell scripts, my favourite) are
   what agents use to get their work done in many cases, it's always good to
   stay on top of things to really understand what they're doing.

1. I'm [a big fan](https://www.google.com/search?q=site%3Aqmacro.org+fzf) of
   `fzf`.
