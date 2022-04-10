---
layout: post
title: Mass deletion of GitHub Actions workflow runs
tags:
  - autodidactics
  - github-actions
  - shell
  - gh
  - jq
  - fzf
---

_Implementing a simple cleanup script for workflow runs, using `gh`, `jq`, `fzf` and the GitHub API_

Yesterday, while [thinking aloud](https://github.com/qmacro/thinking-aloud/issues/13), I was wondering how best to mass-delete logs from GitHub Actions workflow runs. Such a feature isn't available in the Web based Actions UI and my lack of competence in the Actions area means that I have a lot of cruft from my trial and error approach to writing and executing workflows.

**The GitHub Workflow Runs API**

I knew the answer probably was in the GitHub API, and it was - in the form of the [Workflow Runs](https://docs.github.com/en/rest/reference/actions#workflow-runs) API. There are various endpoints that follow a clean and logical design. Workflow runs are repo specific, and to list them, the following API endpoint is available to access via the GET method:

```
GET /repos/{owner}/{repo}/actions/runs
```

Following this straightforward URL-space design, a deletion is possible thus:

```
DELETE /repos/{owner}/{repo}/actions/runs/{run_id}
```

Incidentally, I like the use of "owner" here - because a repo can belong to an individual GitHub account (such as [qmacro](https://github.com/qmacro)) or an organisation (such as [SAP-samples](https://github.com/SAP-samples)), and "owner" is a generic term that covers both situations and has the right semantics.

**Requesting the workflow run information with `gh`**

To make use of these API endpoints, I used the excellent `gh` [GitHub CLI](https://github.com/cli/cli), specifically the [api](https://cli.github.com/manual/gh_api) facility. Once [authenticated](https://cli.github.com/manual/gh_auth), it's super easy to make API calls; to retrieve the workflow runs for the `qmacro/thinking-aloud` repo, it's as simple as this (some pretty-printed output is also shown here):

```shell
; gh api /repos/qmacro/thinking-aloud/actions/runs
{
  "total_count": 22,
  "workflow_runs": [
    {
      "id": 686610826,
      "name": "Generate Atom Feed",
      "node_id": "MDExOldvcmtmbG93UnVuNjg2NjEwODI2",
      "head_branch": "main",
      "head_sha": "24822bfb34573c0dc2fb6b0f83c42a1752a324d9",
      "run_number": 13,
      "event": "issues",
      "status": "completed",
      "conclusion": "skipped",
      ...
```

**Making sense of the response with `jq`**

The response from the API has a JSON representation and a straightfoward but rich set of details. This is where `jq` comes in. I started with just pulling out values for a few properties like this:

```shell
; gh api /repos/qmacro/thinking-aloud/actions/runs \
> | jq -r '.workflow_runs[] | [.id, .conclusion, .name] | @tsv' \
> | head -5
686610826       skipped Generate Atom Feed
686610824       skipped Tweet new entry
686610823       skipped Render most recent entries
686471644       success Render most recent entries
686157878       success Render most recent entries
```

> There's built-in support for pagination with `gh api`, with the `--paginate` switch, which is handy.

Breaking the `jq` invocation down, we have:

|Part|Description|
|-|-|
|`-r`|Tells `jq` to output "raw" values, rather than JSON structures|
|`.workflow_runs[]`|Process each of the entries in the `workflow_runs` array|
|`[.id, .conclusion, .name]`|Show values for these three properties|
|`@tsv`|Convert everything into tab separated values|

Notice the use of the `|` symbol too - the output of `.workflow_runs[]` is piped into the selection of properties, and the output of that is piped further into the call to the builtin `@tsv` mechanism.

I ended up [using this approach](https://github.com/qmacro/dotfiles/blob/230c6df494f239e9d1762794943847816e1b7c32/scripts/dwr#L21-L38), but in a slightly expanded way, using a couple of helper functions:

* one to make the values for the `.created_at` property easier to read (for example changing "2021-03-26T09:10:11Z" into "2021-03-26 09:10:11")
* the other to convert the values for the `.conclusion` property into simpler and shorter terms

```jq
def symbol:
  sub("skipped"; "SKIP") |
  sub("success"; "GOOD") |
  sub("failure"; "FAIL");

def tz:
  gsub("[TZ]"; " ");

.workflow_runs[]
  | [
      (.conclusion | symbol),
      (.created_at | tz),
      .id,
      .event,
      .name
    ]
  | @tsv
```

**Presenting the list with `fzf`**

Now all that was required was to present the list of workflow runs in a list, for me to choose which ones to delete. The wonderful `fzf` came to the rescue here. If you've not heard of `fzf`, go and read all about [the command line fuzzy-finder](https://github.com/junegunn/fzf) right now. I've written a couple of posts on this very blog about `fzf` basics too:

- [fzf - the basics part 1 - layout](https://qmacro.org/autodidactics/2021/02/02/fzf-the-basics-1-layout/)
- [fzf - the basics part 2 - search results](https://qmacro.org/autodidactics/2021/02/07/fzf-the-basics-2-search-results/)

This is how I combined the `gh`, `jq` and `fzf` invocations, inside a [`selectruns`](https://github.com/qmacro/dotfiles/blob/230c6df494f239e9d1762794943847816e1b7c32/scripts/dwr#L43-L49) function:

```shell
gh api --paginate "/repos/$repo/actions/runs" \
  | jq -r -f <(jqscript) \
  | fzf --multi
```

With the `--multi` switch, `fzf` allows the selection of more than one item.

Then it was just a case of processing each selected item, and making use of that other API endpoint we saw earlier inside a [`deleterun`](https://github.com/qmacro/dotfiles/blob/230c6df494f239e9d1762794943847816e1b7c32/scripts/dwr#L51-L60) function, like this:

```shell
local run id result
run=$1
id="$(cut -f 3 <<< "$run")"
gh api -X DELETE "/repos/$repo/actions/runs/$id"
[[ $? = 0 ]] && result="OK!" || result="BAD"
printf "%s\t%s\n" "$result" "$run")
```

The use of `cut` was to pick out the `id` property in the list, as presented to (and selected via) `fzf`; the list is tab separated (thanks to `@tsv`) and `cut`'s default delimiter is tab too, which is nice.

**The script in action**

That's about it - here's the entire script in action:

<script id="asciicast-402683" src="https://asciinema.org/a/402683.js" async></script>

And you can check out the script, as it was at the time of writing, in my dotfiles repository here: [`dwr`](https://github.com/qmacro/dotfiles/blob/230c6df494f239e9d1762794943847816e1b7c32/scripts/dwr).
