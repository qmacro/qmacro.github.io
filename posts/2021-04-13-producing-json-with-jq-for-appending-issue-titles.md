---
layout: post
title: Producing JSON with jq for appending issue titles
tags:
  - autodidactics
  - jq
  - tools
  - shell
---

_I learned how to use `jq` to **produce** JSON, while writing a script to enhance my Thinking Aloud journal entry titles._

In my [Thinking Aloud](https://github.com/qmacro/thinking-aloud) journal, the entries are issues in a GitHub repository. To [reduce friction](https://github.com/qmacro/thinking-aloud/issues/1) I decided to just use the current date and time for the journal entry title.

That's worked fine, but in the overview of the issues it wasn't really practical to pick out the one I wanted to read or edit, because all I had to go on was the timestamp. Of course, I could scan the [recent entries](https://github.com/qmacro/thinking-aloud/blob/main/recent.md) but that would quickly become a little limiting as the number of journal entries grows.

In a small script [preptweet](https://github.com/qmacro/thinking-aloud/blob/main/preptweet), used when automatically tweeting about new entries, I was extracting the first 50 characters from the body and using that in the tweet. You can see an example in [this tweet](https://twitter.com/qmacro/status/1380500800879919105) - "I've been thinking about field naming conventions today …".

I thought this would be a useful string to have in the journal entry (issue) titles too, so I wrote a script [appendtitle](https://github.com/qmacro/thinking-aloud/blob/main/appendtitle) that would do that for me for the existing issues. I have yet to decide how to modify the process of creating a new journal entry (I could just have this script run as a separate job step in the [workflow](https://github.com/qmacro/thinking-aloud/blob/main/.github/workflows/process-new-entry.yaml) I already have, for example).

[appendtitle](https://github.com/qmacro/thinking-aloud/blob/main/appendtitle) contains essentially a single incantation, deliberately so, in my journey to practise my scripting. It's not the most readable but it helps me think about pipelining and how data flows through such a pipeline.

I thought it might be useful to share and explain, in case others are on a similar journey. In it, I'll show how I used `jq` to cleanly _produce_ JSON - I normally _consume_ JSON with `jq`, so this was a nice departure.

```bash
 1 #!/usr/bin/env bash
 2
 3 # Convert journal entry issues where the issue title is currently
 4 # just the date and time stamp, by adding the first <length> chars
 5 # of the issue body to the title.
 6
 7 readonly length=50
 8
 9 gh api "/repos/:owner/:repo/issues?state=open&labels=entry" \
10   --jq ".[] | [.number, .title, .body[0:$length]+\"…\"] | @tsv" \
11   | grep -E '\t\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d\t' \
12   | sed 's/\t/ /g' \
13   | while read -r number date time text; do
14     newtitle="$date $time $text"
15     jq -n --arg key title --arg value "$newtitle" '{($key):$value}' \
16       | gh api "/repos/:owner/:repo/issues/$number" --input -
17     sleep 0.25
18   done
```

Here's a breakdown, by line:

9: Invoke the GitHub API with `gh` to retrieve the open issues representing journal entries.

10: Use `gh`'s `--jq` flag to pass a script to pull out the issue number, current title & first \<length\> characters from the body (plus an ellipsis to denote an elision). Output these values in tab-separated format.

So far, here's typical output produced from lines 9 and 10:

```
19      2021-04-09 13:17:08 I've been thinking about field naming conventions …
18      2021-04-07 16:27:58 One consequence of using repo issues for journal e…
15      2021-04-07 09:04:01 Does it make sense to create a workflow to clean u…
```

Those are tab characters between the three columns number, timestamp and text.

Continuing on:

11: The output produced is passed via `grep` to check for a timestamp (nnnn-nn-nn nn:nn:nn) bounded on either side with tab characters (\\t). This ensures that only those entries with a title that is (still) only a timestamp are processed (In constructing the pattern, I found it clearer to write out each of the `\d` digits than use something like e.g. `\d{4}` for the four-digit year).

12: Rather than mess around with tabs from this point on, `sed` is used to convert each tab to a space; this will keep things simple for reading each "field" on the next line.

13: The output is now passed into a `while` loop, where `read` is used to capture each field. The default delineation is whitespace, so perhaps you're thinking "what happens to the words beyond the first one, for the text value on each line?". Well because there are no further variable names following `text` in the `read` invocation, `text` gets the rest of the line, not just the next whitespace separated token. In other words, taking the first output line as an example, we don't just get "I've" in `text`, but all of "I've been thinking about field naming conventions …".

14: The values are marshalled into a new title format, in `newtitle`.

15: Using `jq`, a properly formatted chunk of JSON is produced, to prepare a payload value to pass in the GitHub API call to [update an issue](https://docs.github.com/en/rest/reference/issues#update-an-issue).

If the value of `newtitle` was "2021-04-09 13:17:08 I've been thinking about field naming conventions …", then this `jq` invocation would produce this (including the whitespace):

```json
{
  "title": "2021-04-09 13:17:08 I've been thinking about field naming conventions …"
}
```

16: This JSON thus produced can be then supplied in the API call, again using `gh`, with the value `-` (classically denoting "take from STDIN") for the `--input` parameter.

17: A short pause between API calls keeps the GitHub API endpoint sweet, and we're done.

This is the first time I've used `jq` to produce JSON, and it feels a lot safer than messing around with quoting, and the quotes required for the JSON format itself. Thanks `jq`, and of course thanks GitHub API!
