---
title: Extracting blog post dates from URLs with jq
date: 2022-11-08
tags:
  - jq
  - json
  - regexp
---
I had a JSON array of objects from a list of GitHub repo issues. Each object contained a blog post URL and a title. The URL had the post date embedded in the path, and I wanted to sort them all based on the post date. Here's how I did it. 

I have a working list of blog posts, as [issues in a GitHub repo](https://github.com/qmacro-org/db/issues?q=is%3Aissue) (as a sort of temporary data store). Each issue has the blog post title as the issue title, and just the blog post URL in the issue body, like this:

![example blog post issue](/images/2022/11/exampleissue.png)

## The base data

I had retrieved the issue data as JSON like this:

```bash
gh issue list \
  --limit 500 \
  --label dj-adams-sap \
  --json number,title,body \
  > dj-adams-sap.json 
```

Here's what the first and last couple of items in `dj-adams-sap.json` look like (extracted with `jq '.[:2] + .[-2:]' dj-adams-sap.json`):

```json
[
  {
    "body": "https://blogs.sap.com/2018/03/26/monday-morning-thoughts-cloud-native/",
    "number": 224,
    "title": "Monday morning thoughts- cloud native"
  },
  {
    "body": "https://blogs.sap.com/2018/03/31/scripting-the-workflow-api-with-bash-and-curl/",
    "number": 223,
    "title": "Scripting the Workflow API with bash and curl"
  },
  {
    "body": "https://blogs.sap.com/2022/08/04/introducing-sap-codejam-btp-a-new-group-and-a-first-event/",
    "number": 83,
    "title": "Introducing &#8220;SAP CodeJam BTP&#8221; - a new group, and a first event"
  },
  {
    "body": "https://blogs.sap.com/2022/10/06/devtoberfest-2022-week-2/",
    "number": 82,
    "title": "Devtoberfest 2022 Week 2"
  }
]
```

## Extracting the dates

The dates of the blog posts can be determined from the first part of the path info in the blog post URLs, clearly. So I decided to map over each object and add a new property `postdate` which would be a `YYYY-MM-DD` formatted string worked out from that data.

First, I decided to define a function to extract the date:

```jq
def date: 
  sub(
    "^https.+?com/(?<yyyy>[0-9]{4})/(?<mm>[0-9]{2})/(?<dd>[0-9]{2})/.+$";
    "\(.yyyy)-\(.mm)-\(.dd)"
  );
```

This uses the [sub](https://stedolan.github.io/jq/manual/#sub(regex;tostring)sub(regex;string;flags)) function to perform a regexp based substitution, actually replacing the entire input string (the URL) with a new string made up from the capture groups defined. 

These are named capture groups, here's one of them; this one matches 4 consecutive digits into a capture group named `yyyy`:

```text
(?<yyyy>[0-9]{4})
```

Looking at the argument supplied for the second parameter of `sub/2`, the `\( ... )` syntax is [string interpolation](https://stedolan.github.io/jq/manual/#Stringinterpolation-\(foo)), to have an expression (in this example it's `.yyyy`, `.mm` and `.dd`) evaluated and expanded in a string.

## Adding the postdate property

With the `date` function ready, I could then simply iterate over the items in the array, adding a new `postdate` property to each object, with the value of whatever the `date` function extracts from the item's `.body` property:

```jq
map(. + { postdate: .body|date })
```

Based on the reduced data set above, this then produces:

```json 
[
  {
    "body": "https://blogs.sap.com/2018/03/26/monday-morning-thoughts-cloud-native/",
    "number": 224,
    "title": "Monday morning thoughts- cloud native",
    "postdate": "2018-03-26"
  },
  {
    "body": "https://blogs.sap.com/2018/03/31/scripting-the-workflow-api-with-bash-and-curl/",
    "number": 223,
    "title": "Scripting the Workflow API with bash and curl",
    "postdate": "2018-03-31"
  },
  {
    "body": "https://blogs.sap.com/2022/08/04/introducing-sap-codejam-btp-a-new-group-and-a-first-event/",
    "number": 83,
    "title": "Introducing &#8220;SAP CodeJam BTP&#8221; - a new group, and a first event",
    "postdate": "2022-08-04"
  },
  {
    "body": "https://blogs.sap.com/2019/10/06/devtoberfest-2022-week-2/",
    "number": 82,
    "title": "Devtoberfest 2022 Week 2",
    "postdate": "2019-10-06"
  }
]
```

## Sorting 

Then it's just a simple case of using `sort_by` (followed optionally by `reverse`) to get the post date order I want:

```jq
map(. + { postdate: .body|date })
| sort_by(.postdate)
```

Of course, I could combine the two parts if I didn't want the `postdate` property to be an explicit fixture in my downstream processing. Something like this:

```jq
sort_by(.body | date)
```

## Wrapping up

It did occur to me that given the pattern of blog post URLs, I could just sort by them directly. Then again, it wasn't as interesting and I didn't learn anything about named capture groups. Anyway, this post is mostly for me, for when my future self forgets how to use capture groups and the `sub` function.
