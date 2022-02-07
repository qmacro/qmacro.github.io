---
layout: post
title: continue-on-error can prevent a job step failure causing an action failure
tags:
  - autodidactics
  - github-actions
---

_Use `continue-on-error: true` in a GitHub Actions job spec to prevent failures from being flagged when a job step fails._

For me, high (non-zero) return codes don't always necessarily denote failure; sometimes I want to use a high return code to control step execution (see [TIL: git diff can emit different exit codes](https://qmacro.org/2020/07/20/github-actions-step-conditional/)). But this means that the entire workflow run is marked as failed in a GitHub Action context. To prevent this, you can use [`continue-on-error`](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idcontinue-on-error) at the job level to prevent a workflow from failing when a job fails.

I [added this](https://github.com/qmacro/qmacro/commit/42217c8a53108856dfcc85108f2cca4731bfa1ba) to my build workflow and it works nicely. See for example [action execution 178511479](https://github.com/qmacro/qmacro/actions/runs/178511479) - i.e. even when there was a step that ended with a high return code (deliberately, to signify no changes), the entire execution was still marked as a success:

![action marked as success]( {{ "/img/2020/07/successfulaction.png" | url }})

(Hat tip to [Tom Jung](https://github.com/jung-thomas) for this).
