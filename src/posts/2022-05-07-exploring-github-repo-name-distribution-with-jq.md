---
layout: post
title: Exploring GitHub repo name distribution with jq
tags:
  - jq
  - github
  - gh
---
I wanted a brief rundown of the name prefixes for repositories in the [SAP-samples][sap-samples] organisation on GitHub. With the `gh` CLI it was easy to grab the names, and gave me the opportunity to practise a bit of `jq`. Here's what I did.

The [SAP-samples][sap-samples] organisation on GitHub is where we keep lots of sample code, configuration and more for various SAP services and products. We also store our workshop and CodeJam material in repositories there too.

There's a sort of loose naming convention, where the first part of the name gives a general indication of topic. For example, the first part of the [cloud-messaging-handsonsapdev](https://github.com/SAP-samples/cloud-messaging-handsonsapdev) repository, "cloud", gives an indication that the topic is the cloud in general, and the first part of the [btp-setup-automator](https://github.com/SAP-samples/btp-setup-automator) repository, "btp", indicates that the main topic is the SAP Business Technology Platform.

I wanted to find out what the names were of all the repositories in the [SAP-samples][sap-samples] organisation, and understand the distribution across the different topics. Something like this, showing here that the most popular topic is "cloud":

```text
1    abap
1    artifact
2    btp
3    cloud
2    sap
1    ui5
```

## Using the gh CLI

Requesting the names of public repositories with the GitHub CLI [gh][gh] is easy. Here's an example:

```bash
gh repo list SAP-samples --limit 10 --public
```

This produces output something like this (output somewhat redacted for display purposes):

```text
SAP-samples/cloud-sdk-js                   This re...  public  7h
SAP-samples/cloud-cap-samples-java         A sampl...  public  15h
SAP-samples/btp-setup-automator            Automat...  public  15h
SAP-samples/btp-ai-sustainability-bootcamp This gi...  public  15h
SAP-samples/cloud-cap-samples              This pr...  public  17h
SAP-samples/ui5-exercises-codejam          Materia...  public  19h
SAP-samples/cap-sflight                    Using S...  public  1d
SAP-samples/cloud-cf-feature-flags-sample  A sampl...  public  1d
SAP-samples/cloud-espm-cloud-native        Enterpr...  public  2d
SAP-samples/iot-edge-samples               Showcas...  public  2d
```

> This is a slightly contrived example, because I wanted to illustrate the distribution over a small number of repositories (10 in this case). To this end, I cut down the actual output to come up with a list of repositories that would illustrate the point. If you want to find out what I did with this list, and how I turned it into what `gh` would output, in particular what JSON structure it would produce (see the next section in this post), you may want to read the "prequel" post to this one: [Converting strings to objects with jq](/blog/posts/2022/05/06/converting-strings-to-objects-with-jq/).

With regular shell tools I could parse out the names, split off the topic prefix, and go from there. But I'm trying to improve my skills in [jq], and the `gh` CLI gives me an opportunity to do that, with the combination of two options.

### Requesting JSON output with --json

With `--json` I can specify fields I want to have returned to me. At first I was at a loss as to which fields were available to specify, but leaving off the value for `--json` gives a list.

In other words, invoking this:

```bash
gh repo list --json
```

results in a list like this (cut short for brevity):

```
Specify one or more comma-separated fields for `--json`:
  assignableUsers
  codeOfConduct
  contactLinks
  createdAt
  defaultBranchRef
  deleteBranchOnMerge
  description
  diskUsage
  forkCount
  ...
```

The field `name` is available, and applying it as the value for `--json` like this:

```bash
gh repo list SAP-samples --limit 10 --public --json name
```

gives this JSON output:

```json
[
  {
    "name": "cloud-sdk-js"
  },
  {
    "name": "cloud-cap-samples-java"
  },
  {
    "name": "btp-setup-automator"
  },
  {
    "name": "btp-ai-sustainability-bootcamp"
  },
  {
    "name": "cloud-cap-samples"
  },
  {
    "name": "ui5-exercises-codejam"
  },
  {
    "name": "cap-sflight"
  },
  {
    "name": "cloud-cf-feature-flags-sample"
  },
  {
    "name": "cloud-espm-cloud-native"
  },
  {
    "name": "iot-edge-samples"
  }
]
```

### Filtering JSON output with --jq

With the `--jq` option, a jq filter can be supplied that will be applied to the JSON output produced. Let's start with a very simple example.

As we can see, the structure returned is an array of objects, each containing the property or properties requested with the `--json` option. So to obtain the value of each of the `name` properties from the JSON output that we saw earlier, we can use `.[] | .name`, or, more succinctly, `.[].name`:

```bash
gh repo list SAP-samples --limit 10 --public \
  --json name \
  --jq .[].name
```

This returns the following:

```text
artifact-of-the-month
cloud-sdk-js
sap-tech-bytes
cloud-cap-samples-java
btp-setup-automator
btp-ai-sustainability-bootcamp
sap-iot-samples
abap-platform-fundamentals-01
cloud-cap-samples
ui5-exercises-codejam
```

### The --jq option in gh is applied with --raw-output

We can make one side observation here. Normally, we'd expect to see JSON values output from `jq`; in other words, double-quoted strings like this:

```json
"artifact-of-the-month"
"cloud-sdk-js"
"sap-tech-bytes"
"cloud-cap-samples-java"
"btp-setup-automator"
"btp-ai-sustainability-bootcamp"
"sap-iot-samples"
"abap-platform-fundamentals-01"
"cloud-cap-samples"
"ui5-exercises-codejam"
```

So it seems like when a `jq` filter is applied via the `--jq` option to `gh`, it's applied with the `--raw-output` (`-r`) option implicitly. I think that makes sense, especially if the output is to be used with other Unix command line tools later on in a pipeline.

## Using the power of jq

Now we have the context in which we can invoke a jq filter on the JSON output from `gh`, let's dig in a little more. Bear in mind that this may not be the most efficient way of doing things, but I thought it might still be useful, and it certainly helps me to try to express something in jq in public, as it were.

To be kind to the API, I'll grab the JSON output from the `gh` invocation and use that while I build up the filter:

```bash
gh repo list SAP-samples --limit 10 --public \
  --json name \
  > names.json
```

As a reminder, the content of `names.json` will look like this:

```json
[
  {
    "name": "cloud-sdk-js"
  },
  {
    "name": "cloud-cap-samples-java"
  },
  {
    "name": "btp-setup-automator"
  },
  {
    "name": "btp-ai-sustainability-bootcamp"
  },
  {
    "name": "cloud-cap-samples"
  },
  {
    "name": "ui5-exercises-codejam"
  },
  {
    "name": "cap-sflight"
  },
  {
    "name": "cloud-cf-feature-flags-sample"
  },
  {
    "name": "cloud-espm-cloud-native"
  },
  {
    "name": "iot-edge-samples"
  }
]
```

### Get the first part of the name

The convention is to use dashes to separate the different parts of the repository names, so it occurs to me that I can use [split][manual-split], which produces an array, and then grab the first element.

Let's have a first go, based on the `name` property access we saw earlier:

```bash
jq '.[].name | split("-") | .[0]' names.json
```

This produces the following list:

```json
"artifact"
"cloud"
"sap"
"cloud"
"btp"
"btp"
"sap"
"abap"
"cloud"
"ui5"
```

### Stay within the context of an array

In jq, there are plenty of functions that operate on arrays, such as [sort][manual-sort], [min and max][manual-minmax] and [reverse][manual-reverse]. There's also [group-by][manual-groupby] which is what will be useful to our requirements here. The manual's description is as follows:

> `group_by(.foo)` takes as input an array, groups the elements having the same `.foo` field into separate arrays, and produces all of these arrays as elements of a larger array, sorted by the value of the `.foo` field.

We're starting from an array (note the outer enclosing `[...]` in the data we're working on) so it makes sense to try to keep that array context. So rather than use the [array / object iterator][manual-arrayobjectiterator], which "explodes" an array into separate results, we can use [map][manual-map] here:

```bash
jq 'map(.name | split("-") | .[0])' names.json
```

This produces the same values, but within an array:

```json
[
  "artifact",
  "cloud",
  "sap",
  "cloud",
  "btp",
  "btp",
  "sap",
  "abap",
  "cloud",
  "ui5"
]
```

### Using group_by

Now we can use [group-by][manual-groupby] on this (switching here to a multi-line version for better readability):

```bash
jq \
  'map(.name | split("-") | .[0])
  | group_by(.)' \
  names.json
```

This seems to "[do exactly what it says on the tin](https://en.wikipedia.org/wiki/Does_exactly_what_it_says_on_the_tin#:~:text=%22It%20does%20exactly%20what%20it,accurate%20description%20of%20its%20qualities.)":

```json
[
  [
    "abap"
  ],
  [
    "artifact"
  ],
  [
    "btp",
    "btp"
  ],
  [
    "cloud",
    "cloud",
    "cloud"
  ],
  [
    "sap",
    "sap"
  ],
  [
    "ui5"
  ]
]
```

Note that the value passed to `group_by` is `.`, i.e. the `path_expression` is the entire string value, for example `"artifact"`, `"cloud"`, `"sap"` etc.

Great. We can already start to see the distribution of topics now, but let's go a bit further.

### Creating a list of topic counts

I think ideally I'd like a flat list of topics with their counts, in a tab-separated list, as that is then conducive to further processing on the command line should I want to. In other words, I want this sort of line for each topic:

```
[count][tab][topic-name]
```

### Producing the raw data

First, let's produce the raw data for this list. While we wanted to avoid exploding the array earlier, now would be the time to use the [array / object iterator][manual-arrayobjectiterator]:

```bash
jq \
  'map(.name | split("-") | .[0])
  | group_by(.)
  | .[]' \
  names.json
```


This produces a JSON value for each of the array items. Here, each item, and thus value produces, is an array containing one or more instances of a topic name:

```json
[
  "abap"
]
[
  "artifact"
]
[
  "btp",
  "btp"
]
[
  "cloud",
  "cloud",
  "cloud"
]
[
  "sap",
  "sap"
]
[
  "ui5"
]
```

In effect, this removes the outermost `[...]` array that contains all these inner arrays.

Now it's just a matter of defining what we want to see, with the [array constructor][manual-arrayconstructor], in this case, two elements representing the length of the array, and the first value of the array `[length, .[0]]`:

```bash
jq \
  'map(.name | split("-") | .[0])
  | group_by(.)
  | .[]
  | [length, .[0]]' \
  names.json
```

Remember that this construct `.[] | ...` will iterate through each array element and pass them one at a time to the filter that follows the pipe. And this produces the following:

```json
[
  1,
  "abap"
]
[
  1,
  "artifact"
]
[
  2,
  "btp"
]
[
  3,
  "cloud"
]
[
  2,
  "sap"
]
[
  1,
  "ui5"
]
```

### Output the results as a tab-separated list

We have our list of topic counts, so now let's add the final touch to have a tab-separated list. There's nothing further we need to do to the data, it's as we want it. So we just need some formatting. In the [Format strings and escaping][manual-formatstringsandescaping] section of the jq manual, we see that there's the `@tsv` which is described thus:

> The input must be an array, and it is rendered as TSV (tab-separated values). Each input array will be printed as a single line.

This is exactly what we're looking for. Note that here, the "input array" referred to is each of the individual arrays in the output above, i.e. this is the first array:

```json
[
  1,
  "abap"
]
```

Let's try it:

```bash
jq \
  'map(.name | split("-") | .[0])
  | group_by(.)
  | .[]
  | [length, .[0]]
  | @tsv' \
  names.json
```

```text
"1\tabap"
"1\tartifact"
"2\tbtp"
"3\tcloud"
"2\tsap"
"1\tui5"
```

Close! Remember that by default, an invocation of `jq` on the command line will output JSON values by default. These strings are JSON values. But here we want the raw form, via the `--raw-output` (`-r`), to benefit from (and see) the tab characters (`\t`) that the `@tsv` has put in for us:

```bash
jq -r \
  'map(.name | split("-") | .[0])
  | group_by(.)
  | .[]
  | [length, .[0]]
  | @tsv' \
  names.json
```

This gives us what we're looking for:

```text
1    abap
1    artifact
2    btp
3    cloud
2    sap
1    ui5
```

And in fact, remembering that when a jq filter is invoked from `gh` via the `--jq` option the raw output is used by default, we can now put everything together and benefit from that in the final `gh` invocation, which looks like this:

```bash
gh repo list SAP-samples --limit 10 --public \
  --json name \
  --jq \
  'map(.name | split("-") | .[0])
   | group_by(.)
   | .[]
   | [length, .[0]]
   | @tsv'
```

This gives us the same result, i.e.:

```text
1    abap
1    artifact
2    btp
3    cloud
2    sap
1    ui5
```

So I can see that the most common topic here is "cloud".

## Wrapping up

I'm happy with this approach, how I'm starting to get a better feel for how data flows through a jq filter, and also that I can use such filters with the GitHub CLI.


[sap-samples]: https://github.com/SAP-samples
[gh]: https://github.com/cli/cli
[jq]: https://stedolan.github.io/jq/
[manual-split]: https://stedolan.github.io/jq/manual/#split(str)
[manual-sort]: https://stedolan.github.io/jq/manual/#sort,sort_by(path_expression)
[manual-minmax]: https://stedolan.github.io/jq/manual/#min,max,min_by(path_exp),max_by(path_exp)
[manual-reverse]: https://stedolan.github.io/jq/manual/#reverse
[manual-groupby]: https://stedolan.github.io/jq/manual/#group_by(path_expression)
[manual-arrayobjectiterator]: https://stedolan.github.io/jq/manual/#Array/ObjectValueIterator:.[]
[manual-map]: https://stedolan.github.io/jq/manual/#map(x),map_values(x)
[manual-arrayconstructor]: https://stedolan.github.io/jq/manual/#Arrayconstruction:[]
[manual-formatstringsandescaping]: https://stedolan.github.io/jq/manual/#Formatstringsandescaping
