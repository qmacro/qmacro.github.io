---
layout: post
title: git diff can emit different exit codes
tags:
  - autodidactics
  - tools
---

_You can combine git diff exit codes and the POSIX `!` operator to control GitHub Actions job step execution based on git changes._

When defining a job step in GitHub Actions, you can specify a [condition](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#job-status-check-functions) that must be met for a job step to run (in a broadly similar way to how things were in Job Control Language). In my [profile repo's builder workflow](https://github.com/qmacro/qmacro/blob/03246248853b563bb6774697e7156bfb183e3f0a/.github/workflows/build.yml), I wanted only to proceed with a git commit step if there were actual changes that had been made in a previous step.

Supplying the `--exit-code` option to [git diff](https://git-scm.com/docs/git-diff) makes it emit an exit code of 1 if there are differences, and 0 if not. This option is implicit in `--quiet`, too.

As exit code 1 represents a fail in job step conditionals, the output of git diff can be reversed with the POSIX `!` operator. So in this pair of steps, the second one will only run if there are no differences detected in the first one:

```
- name: Check for changes (fail if none)
  run: |
    ! git diff --quiet

- name: Commit changes if required
  if: {%raw%}${{ success() }}{%endraw%}
  run: |
    git config --global user.email "qmacro-bot@example.com"
    git config --global user.name "qmacro bot"
    git add README.md
    git commit -m 'update README' || exit 0
    git push
```

> I had to write the `! git diff --quiet` within a YAML multiline expression (introduced with `|`) as the GitHub Actions runner didn't like it on the same line, i.e. `run: ! git diff --quiet`.
