---
title: Selecting the related endpoints from a GitHub API response using jq's with_entries
date: 2023-06-12
tags:
  - github
  - api
  - snippet
  - jq
---
I often find myself searching for the related API endpoints for any given chunk of data returned from a call to the [GitHub REST API](https://docs.github.com/en/rest). Let's take an issue as an example, one related to SAP's [Open Documentation Initiative](https://blogs.sap.com/2021/05/20/introducing-the-open-documentation-initiative/): 

Feedback for "Data Lake API": <https://github.com/SAP-docs/sap-datasphere/issues/13>

Taking the basic information available for this issue via [one of the endpoints in the Issues API](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#get-an-issue), we get an object returned with properties that we can list like this:

```shell
gh api \
  --cache 1h \
  repos/SAP-docs/sap-datasphere/issues/13 \
  | jq keys
```

There are quite a few properties, many of them ending `_url`:

```json
[
  "active_lock_reason",
  "assignee",
  "assignees",
  "author_association",
  "body",
  "closed_at",
  "closed_by",
  "comments",
  "comments_url",
  "created_at",
  "events_url",
  "html_url",
  "id",
  "labels",
  "labels_url",
  "locked",
  "milestone",
  "node_id",
  "number",
  "performed_via_github_app",
  "reactions",
  "repository_url",
  "state",
  "state_reason",
  "timeline_url",
  "title",
  "updated_at",
  "url",
  "user"
]
```

A simple [with_entries](https://jqlang.github.io/jq/manual/#to_entries,from_entries,with_entries), which is actually just a combination of its two sibling functions: `to_entries | map(foo) | from_entries`, does the trick:

```shell
gh api \
  --cache 1h \
  repos/SAP-docs/sap-datasphere/issues/13 \
  | jq 'with_entries(select(.key | endswith("_url")))'
```

This gives:

```shell
{
  "repository_url": "https://api.github.com/repos/SAP-docs/sap-datasphere",
  "labels_url": "https://api.github.com/repos/SAP-docs/sap-datasphere/issues/13/labels{/name}",
  "comments_url": "https://api.github.com/repos/SAP-docs/sap-datasphere/issues/13/comments",
  "events_url": "https://api.github.com/repos/SAP-docs/sap-datasphere/issues/13/events",
  "html_url": "https://github.com/SAP-docs/sap-datasphere/issues/13",
  "timeline_url": "https://api.github.com/repos/SAP-docs/sap-datasphere/issues/13/timeline"
}
```

What `to_entries`, `from_entries` and `with_entries` gives us is a way to process properties the names of which are unknown to us until execution time. Each property is normalised into a static structure with well-known property names. Here's an example:

```shell
jq -n '{question: "Life", answer: "Forty Two"} | to_entries'
```

This emits a stable, predictable structure:

```json
[
  {
    "key": "question",
    "value": "Life"
  },
  {
    "key": "answer",
    "value": "Forty Two"
  }
]
```

And `from_entries` reverses the conversion that `to_entries` performs. For example:

```shell
jq -n '
  {question: "Life", answer: "Forty Two"}
  | to_entries
  | map(.value |= ascii_upcase)
  | from_entries
'
```

This emits:

```json
{
  "question": "LIFE",
  "answer": "FORTY TWO"
}
```

So this can be replaced simply with:

```shell
jq -n '
  {question: "Life", answer: "Forty Two"}
  | with_entries(.value |= ascii_upcase)
'
```

This has the same effect (because [it's just syntactic sugar for the version with `to_entries` and `from_entries`](https://github.com/jqlang/jq/blob/a9f97e9e61a910a374a5d768244e8ad63f407d3e/src/builtin.jq#L43)):

```json
{
  "question": "LIFE",
  "answer": "FORTY TWO"
}
```

---

I'm going to try and write more of these short "snippet" posts, to break the cycle of only writing longer, more detailed and therefore less frequent ones. Let's see how it goes.
