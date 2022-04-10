---
layout: post
title: Reopening pull requests and GITHUB_ACTOR
tags:
  - autodidactics
  - github-actions
---

_Today I learned that the `GITHUB_ACTOR` on a re-opened pull request reflects the person re-opening it, not the original creator._

Over on the [Community Guidelines](https://github.com/SAP-docs/contribution-guidelines) content for SAP's [Open Documentation Initiative](https://blogs.sap.com/2021/05/20/introducing-the-open-documentation-initiative/) there was a [recent pull request](https://github.com/SAP-docs/contribution-guidelines/pull/64) (PR) that was opened by user `cyberpinguin`.

We have a GitHub Actions workflow [Disallowed content checker](https://github.com/SAP-docs/contribution-guidelines/blob/main/.github/workflows/disallowed-content-checks.yaml) that ensures that contributions coming in via PRs are targeting the appropriate content. The workflow [was duly triggered](https://github.com/SAP-docs/contribution-guidelines/runs/2953360170?check_suite_focus=true), as expected, and appropriately [alerted](https://github.com/SAP-docs/contribution-guidelines/pull/64#issuecomment-871460299) the user that the contribution was outside of the desired target location.

We want to allow administrators of the repo to be able to maintain content across the whole repo, rather than restrict them, and we want those who are not administrators to be restricted. We do this by checking the collaborator permissions, using the [Collaborators](https://docs.github.com/en/rest/reference/repos#get-repository-permissions-for-a-user) section of the GitHub API, like this:

```shell
gh api \
  --jq .permission \
  "/repos/$GITHUB_REPOSITORY/collaborators/$GITHUB_ACTOR/permission"
```

So far so good.

Shortly after opening the PR, the user [closed](https://github.com/SAP-docs/contribution-guidelines/pull/64#event-4983349361) it (by mistake, I think), and it was [re-opened](https://github.com/SAP-docs/contribution-guidelines/pull/64#event-4987076185) by my colleague and fellow Contribution Guidelines administrator [Jens](https://github.com/je-hal). As a result of this re-opening of the PR, the workflow was triggered again.

However, this time, no disallowed content alert was raised. Why was this?

Looking at [the execution for that workflow run](https://github.com/SAP-docs/contribution-guidelines/runs/3006185835?check_suite_focus=true), it's clear that the steps that would have caused an alert to be issued were skipped; the skip logic looks like this:

```yaml
- id: check_files_changed
  name: Checks if disallowed content has been changed
  if: env.repo_permission != 'admin'
  uses: dorny/paths-filter@v2
  with:
    list-files: 'shell'
    filters: |
      disallowed:
        - '!docs/**'
- id: comment_on_disallowed
  if: steps.check_files_changed.outputs.disallowed == 'true'
  ...
```

So it would seem that the permissions for the `GITHUB_ACTOR` in this subsequent execution were 'admin'. Why?

Because, as it turns out (and I confirmed this with a simple test just now) the value of `GITHUB_ACTOR` is set to the user who opens -- or re-opens -- a PR. In this case it was Jens, an administrator.

This is not what I'd expected, so I thought I'd write it up and share it.
