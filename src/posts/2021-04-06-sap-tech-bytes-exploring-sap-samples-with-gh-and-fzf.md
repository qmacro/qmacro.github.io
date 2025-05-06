---
layout: post
title: "SAP Tech Bytes: Exploring SAP-samples with gh and fzf"
date: 2021-04-06
tags:
  - sapcommunity
  - gh
  - fzf
  - github
  - sap-tech-bytes
---
*Discover repositories that might be useful for you by exploring them
from the command line with a couple of powerful tools.*

The [SAP-samples organisation on GitHub](https://github.com/SAP-samples)
contains many repositories with sample code on various SAP technology
topics. There's also a new show [SAP Samples
Spotlight](https://www.youtube.com/playlist?list=PL6RpkC85SLQDS1XbEQIWG_h3fSj_jG_yQ)
on our SAP Developers YouTube channel highlighting some of these
repositories. We're not going to be able to cover all of them on the
show, so here's a way of exploring what's on offer, using command line
tools.

![](/images/2021/04/org-sampler.gif)


GitHub's command line tool [gh](https://github.com/cli/cli) gives us
the ability to explore the API surface area. The latest release (1.8.1
at the time of writing) offers pagination, result cacheing and a
built-in version of [jq](https://jqlang.org/), the JSON
processor.

You can install `gh` and `fzf` locally, or even install them in the
terminal of a dev space in the SAP Business Application Studio to try
things out. See how we do this in the [SAP TechEd 2020 Developer Keynote
repository](https://github.com/SAP-samples/teched2020-developer-keynote) -
take a look specifically at the [Add tools to your dev
space](https://github.com/SAP-samples/teched2020-developer-keynote/tree/main/usingappstudio#add-tools-to-your-dev-space)
section.

Before you use `gh` for the first time, you'll need to authenticate -
use `gh auth login` and follow the prompts. Then you're all set to use
the `org-sampler` script as shown above.

## The script

Let's break it down line by line (mostly [in homage to a great teacher,
Randal L Schwartz](/blog/posts/2021/01/26/columnar-layout-with-awk/#homage)).

```shell
 1 #!/usr/bin/env bash
 2
 3 readonly org="${1:?Specify org name}"
 4
 5 jqscript() {
 6
 7   cat << EOF
 8   .[]
 9   | [
10     .name,
11     "Name: \(.name)\n\nDescription: \(.description)\n\nLanguage: \(.language)\nWatchers: \(.watchers_count)\nStars: \(.stargazers_count)\nForks: \(.forks_count)"
12     ]
13   | @tsv
14 EOF
15
16 }
17
18 gh api
19   "/orgs/$org/repos"
20   --paginate
21   --cache 1h
22   --jq "$(jqscript)"
23   | fzf
24     --with-nth=1
25     --delimiter='\t'
26     --preview='echo -e {2}'
27     --preview-window=up:sharp:wrap:40%
```

1: the [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)) uses
`env` to find `bash` on my system to execute the contents of the file

3: the script expects a single argument to be specified - the name of
the organisation on GitHub. For our purposes this should be SAP-samples

5-16: a simple function to encapsulate the small `jq` script that will
be passed to the invocation of `gh` to parse the JSON output that is
returned from the API call

8: the JSON output's outermost element is an array, which means we
start with `.[]` to say "take each of the array items"; each array
item represents a repository within the organisation, and has different
properties

9: we flow the array items (via the `|`) into a list of fields that we
keep together with `[` starting on this line, and ending with `]` on
line 12

10: the first field in the list is simply the value of the `name`
property (the name of the repository)

11: the second field is a string that's made up of literal and
repository property values, combined into a multi-line string (note the
newline characters in there `\n`); this string is what's to be shown in
the preview (at the top, in the demo above)

13: finally each list of fields is flowed into `@tsv` which produces a
tab separated values set of records

18-22: the main action is in these lines - the call to `gh`'s `api`
facility

19: the API call is to the endpoint for [listing organisation
repositories](https://docs.github.com/en/rest/reference/repos#list-organization-repositories) -
specifically for the organisation (in `$org`) specified when the script
was invoked

20: there are a limited number of results returned by the API in any one
response; the `--paginate` option tells `gh` to make enough calls to
page through all of the results - very convenient!

21: the recent `--cache`option allows for cacheing of the results, to
save on hitting the API endpoints too frequently and unnecessarily; it
makes a lot of sense here given the frequency of new repository
creations

22: the `--jq` option is also recent, and given that the API output is
JSON, is very useful; we use the `jq` script defined earlier in the
`jqscript` function here to produce that set of tab separated records
(where the first field is the repository name and the second field is
the multi-line string showing the repository details)

23: the (tab separated records) output is then passed into `fzf`to give
us a chance to browse or search through the entire list and see the
repositories' details

24: using `--with-nth=1` we can tell `fzf` to only show the first field
in the actual selection list

25: we tell `fzf` how to know what the fields are with
`--delimiter='\t'`, i.e. the fields are separated by tab characters

26: with `--preview='echo -e {2}'` we tell `fzf` that we want to have
something shown in a preview window for each item; what is shown is the
result of `echo -e {2}` where `{2}` is an `fzf` placeholder representing
the second field in the list (i.e. the multi-line string) and the `-e`
switch tells `echo` to actually interpret backslash escapes, meaning
that the newline characters (`\n`) in the field will be rendered
properly and the preview will indeed be multi-line

27: the `--preview-window=up:sharp:wrap:40%` option tells `fzf` how to
display the preview window, including that it should be at the top,
above the list (`up`), that any long text lines should be wrapped (this
is good for the value of the repositories' description fields) and that
the preview window should take up just less than half of the screen
(`40%`)

And that's it.

The command line is a powerful environment and with it come powerful
tools that can help you retrieve, bend and shape the information you
need to work with.

## Trying it yourself

There's a branch for this SAP Tech Bytes post in the accompanying [SAP
Tech Bytes repository](https://github.com/SAP-samples/sap-tech-bytes),
and it contains the version of the script
[org-sampler](https://github.com/SAP-samples/sap-tech-bytes/blob/2021-04-05-exploring-sap-samples-with-gh-and-fzf/org-sampler)
described above:

<https://github.com/SAP-samples/sap-tech-bytes/tree/2021-04-05-exploring-sap-samples-with-gh-and-fzf>

*This post was inspired by [Improving shell workflows with
fzf](https://seb.jambor.dev/posts/improving-shell-workflows-with-fzf/).*

[![](/images/2021/02/screenshot-2021-02-22-at-11.00.25.png)](#saptechbytes)

---

SAP Tech Bytes is an initiative to bring you bite-sized information on
all manner of topics, in
[video](https://www.youtube.com/playlist?list=PL6RpkC85SLQC3HBShmlMaPu_nL--4f20z)
and [written](/tags/sap-tech-bytes/) format. Enjoy!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/sap-tech-bytes-exploring-sap-samples-with-gh-and-fzf/ba-p/13512644)
