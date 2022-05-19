---
layout: post
title: Converting strings to objects with jq
tags:
  - jq
  - github
---
In preparing some data for another upcoming blog post (now published: [Exploring GitHub repo name distribution with jq](/blog/posts/2022/05/07/exploring-github-repo-name-distribution-with-jq/)), I needed to convert a list of fully qualified GitHub repository names into a JSON array of single-property objects (to reflect the style of JSON output from GitHub's `gh` CLI). I achieved this with a short jq filter. Here's how, recorded here, with my working thoughts, mostly for my outboard memory.

## The starting data

For [that other blog post](/blog/posts/2022/05/07/exploring-github-repo-name-distribution-with-jq/) I wanted to start with a list of repositories from GitHub. The list produced by the command I was invoking (`gh repo list SAP-samples --limit 10 --public`) was fine but to illustrate the wider point of the post I wanted to select specific repository names. So I ended up with a manually edited list like this, in a file called `names.txt`:

```text
SAP-samples/cloud-sdk-js
SAP-samples/cloud-cap-samples-java
SAP-samples/btp-setup-automator
SAP-samples/btp-ai-sustainability-bootcamp
SAP-samples/cloud-cap-samples
SAP-samples/ui5-exercises-codejam
SAP-samples/cap-sflight
SAP-samples/cloud-cf-feature-flags-sample
SAP-samples/cloud-espm-cloud-native
SAP-samples/iot-edge-samples
```

## The desired output

What I wanted was a JSON version of this, where each repository name, minus the organisation prefix (`SAP-samples/`), was represented in a `name` property in an object, with all of them wrapped in an outer array, like this:

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

## Looking at jq options

First off, the content of the text file is lines of raw text, so I'll need to use the `--raw-input` (`-R`) option to tell `jq` that.

Incidentally, if the lines of the file had been like this (where each line was enclosed in double quotes):

```text
"SAP-samples/cloud-sdk-js"
"SAP-samples/cloud-cap-samples-java"
"SAP-samples/btp-setup-automator"
...
```

then I wouldn't have needed this option, as these lines are all valid JSON values (a double-quoted string is a valid JSON value).

While thinking of command line options, I then considered the `--slurp` (`-s`) option. This is because I was thinking about gathering up the entire input to pass through the filter once, because I needed the final result to be enclosed in a single, outer array. For more on slurping and statelessness, you may like to read [Some thoughts on jq and statelessness](/blog/posts/2022/05/02/some-thoughts-on-jq-and-statelessness/).

What I noticed is that `--slurp` has a very specific effect when used with the `--raw-input` option, as described in the manual - see the second sentence here:

> `--raw-input` : Don't parse the input as JSON. Instead, each line of text is passed to the filter as a string. If combined with `--slurp`, then the entire input is passed to the filter as a single long string.

This would be a way to read all the repository names in at once, which would give me a chance to output them, transformed, in an enclosing array.

### Trying --slurp

So let's start by looking at the effect of the combination of these two options, when processing the input data with the simple identity filter (`.`). With this invocation:

```bash
jq -s -R . names.txt
```

we get this, a single string:

```
"SAP-samples/cloud-sdk-js\nSAP-samples/cloud-cap-samples-java\nSAP-samples/btp-setup-automator\nSAP-samples/btp-ai-sustainability-bootcamp\nSAP-samples/cloud-cap-samples\nSAP-samples/ui5-exercises-codejam\nSAP-samples/cap-sflight\nSAP-samples/cloud-cf-feature-flags-sample\nSAP-samples/cloud-espm-cloud-native\nSAP-samples/iot-edge-samples\n"
```

At first I thought I could simply then separate the names by using `split` to chop up on what looked to be a newline (`\n`) character separating each one; this would be ideal as `split` produces an array, which is exactly what I'm looking for:

```bash
jq -s -R 'split("\n")' names.txt
```

But this wasn't quite right, producing this:

```json
[
  "SAP-samples/cloud-sdk-js",
  "SAP-samples/cloud-cap-samples-java",
  "SAP-samples/btp-setup-automator",
  "SAP-samples/btp-ai-sustainability-bootcamp",
  "SAP-samples/cloud-cap-samples",
  "SAP-samples/ui5-exercises-codejam",
  "SAP-samples/cap-sflight",
  "SAP-samples/cloud-cf-feature-flags-sample",
  "SAP-samples/cloud-espm-cloud-native",
  "SAP-samples/iot-edge-samples",
  ""
]
```

What's that random empty string at the end?

Turns out that I wasn't staring hard enough at the single string; the newline characters weren't used to "join" each string, they were just there because each of the strings themselves included a newline.

In other words, they weren't separators, they were just part of the data, and so the last newline at the end of the last string "SAP-samples/iot-edge-samples" meant that `split` would produce a final empty value, i.e. what it found to the right of the last newline character, as we can see in the last array position above (`""`).

### Avoiding or cleaning up the extra empty value

Of course, I was tempted to munge the input data before even feeding it to `jq`, so each repository name _would_ be a valid JSON value. I would do this by enclosing each of them in double quotes. But that wasn't what I was looking to do here, I wanted to use `jq` on its own.

Another way would be just to ignore the last value in the array, like this:

```bash
jq -s -R 'split("\n") | .[:-1]' names.txt
```

This makes use of the [array slice][manual-array-slice], where the second filter `.[:-1]` says to return all the array elements up to but not including the last one, producing the basics of what we're looking for:

```json
[
  "SAP-samples/cloud-sdk-js",
  "SAP-samples/cloud-cap-samples-java",
  "SAP-samples/btp-setup-automator",
  "SAP-samples/btp-ai-sustainability-bootcamp",
  "SAP-samples/cloud-cap-samples",
  "SAP-samples/ui5-exercises-codejam",
  "SAP-samples/cap-sflight",
  "SAP-samples/cloud-cf-feature-flags-sample",
  "SAP-samples/cloud-espm-cloud-native",
  "SAP-samples/iot-edge-samples"
]
```

While this would be perfectly practical, creating and then removing unwanted data elements didn't feel entirely agreeable to me today, so I looked for another approach.

## Using inputs

On my [walk](https://www.strava.com/activities/7101292856), thinking about this, I decided to see if there were any approaches that didn't involve the use of the `--slurp` option. And there was, in the form of [inputs][manual-inputs], which, according to the manual:

> outputs all remaining inputs, one by one.

This suggested to me that if I were to call `inputs` at the start, I'd likely get all but the first string, and this was the case:

```bash
jq -R inputs names.txt
```

This produced this:

```json
"SAP-samples/cloud-cap-samples-java"
"SAP-samples/btp-setup-automator"
"SAP-samples/btp-ai-sustainability-bootcamp"
"SAP-samples/cloud-cap-samples"
"SAP-samples/ui5-exercises-codejam"
"SAP-samples/cap-sflight"
"SAP-samples/cloud-cf-feature-flags-sample"
"SAP-samples/cloud-espm-cloud-native"
"SAP-samples/iot-edge-samples"
```

The first string

```json
"SAP-samples/cloud-sdk-js"
```

was missing, as it was already "consumed" ... but happily available in `.`. So I could [construct an array][manual-array-construction] directly at the start of the filter program, like this:

```bash
jq -R '[.,inputs]' names.txt
```

> See the end of this post for an update on this.

Lo and behold, it seems that this is exactly the sort of thing I'm looking to start with:

```json
[
  "SAP-samples/cloud-sdk-js",
  "SAP-samples/cloud-cap-samples-java",
  "SAP-samples/btp-setup-automator",
  "SAP-samples/btp-ai-sustainability-bootcamp",
  "SAP-samples/cloud-cap-samples",
  "SAP-samples/ui5-exercises-codejam",
  "SAP-samples/cap-sflight",
  "SAP-samples/cloud-cf-feature-flags-sample",
  "SAP-samples/cloud-espm-cloud-native",
  "SAP-samples/iot-edge-samples"
]
```

Now that I had the basic structure, it was then just a matter of modifying each element, from a string to an object. Moreover, given that I had the elements where I wanted them, in an outer array, it would seem sensible at this point onwards to express the transformations required via [map][manual-map], which (like `map` in other languages, I guess it's as much of a paradigm as it is a function or filter), takes an array and produces an array.

So for example, I could replace each string with its length, while still keeping the structure, by passing the `[.,inputs]` into `map` like this:

```bash
jq -c -R '[.,inputs] | map(length)' names.txt
```

This would produce the following (note I've used the `--compact-output` (`-c`) option to save space here):

```json
[24,34,31,42,29,33,23,41,35,28]
```

## Transforming the repository name

In the modification requirements, I first had to remove the `SAP-samples/` organisation name prefix, and I turned to [sub][manual-sub] for that, as I'm partial to the occasional regular expression:

```bash
jq -R '[.,inputs] | map(sub("^.+/";""))' names.txt
```

Mapping the substitution of `^.+/` (anchored at the start of the line, at least one but possibly more characters, up to and including a forward slash) with nothing (`""`) gives this:

```json
[
  "cloud-sdk-js",
  "cloud-cap-samples-java",
  "btp-setup-automator",
  "btp-ai-sustainability-bootcamp",
  "cloud-cap-samples",
  "ui5-exercises-codejam",
  "cap-sflight",
  "cloud-cf-feature-flags-sample",
  "cloud-espm-cloud-native",
  "iot-edge-samples"
]
```

## Objectifying the string

The second transformation was to make the simple string value into the value for a property called `name`, within an object.

So for the first string

```json
"cloud-sdk-js"
```

I wanted this:

```json
{
  "name": "cloud-sdk-js"
}
```

Similar to the [array construction][manual-array-construction] there's also the [object construction][manual-object-construction], with which objects can be created on the fly quite easily. And as the manual says:

> If the keys are "identifier-like", then the quotes can be left off

So I can use `name` rather than `"name"` for the property, reducing the JSON noise a little:

```bash
jq -R '[.,inputs] | map(sub("^.+/";"")) | map({name: .})' names.txt
```

This produces:

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

Actually we can reduce the filter a little here, by including the object construction within the first `map`, like this:

```bash
jq -R '[.,inputs] | map(sub("^.+/";"") | {name: .})' names.txt
```

and it produces exactly the same thing. And what it produces, is what we're looking for.

## Wrapping up

So there we are, I can now produce a simulation of what `gh`'s JSON output creates, from a flat list of simple strings, using a modest filter with `jq`. Of course, there are other ways of achieving this, but I'm happy with this for now.

---

There is some brief discussion of this post on [Hacker News](https://news.ycombinator.com/item?id=31293982#31294281) and [Lobsters](https://lobste.rs/s/qi5tge/converting_strings_objects_with_jq).

---

Update: in the middle of the night last night, after publishing this post, I woke up and suddenly realised that I could make this even neater, by the use of the `--null-input` (`-n`) option, which is described as follows:

> Don't read any input at all! Instead, the filter is run once using null as the input.

That in turn means that I could avoid the two-item list of `.` and `inputs`, and simply have:

```bash
jq -R -n '[inputs]' names.txt
```

I do still have a place in my heart for `[.,inputs]` because it reminds me of the fundamental "first and rest", or "head and tail" concept from functional programming. See the "Subsequent understanding" section in [The beauty of recursion and list machinery](/blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/) for more on this, if you're interested.


[manual-object-construction]: https://stedolan.github.io/jq/manual/#ObjectConstruction:{}
[manual-array-construction]: https://stedolan.github.io/jq/manual/#Arrayconstruction:[]
[manual-array-slice]: https://stedolan.github.io/jq/manual/#Array/StringSlice:.[10:15]
[manual-inputs]: https://stedolan.github.io/jq/manual/#inputs
[manual-sub]: https://stedolan.github.io/jq/manual/#sub(regex;tostring)sub(regex;string;flags)
[manual-map]: https://stedolan.github.io/jq/manual/#map(x),map_values(x)
