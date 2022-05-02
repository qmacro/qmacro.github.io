---
layout: post
title: Some thoughts on jq and statelessness
tags:
  - jq
  - lobsters
---
I came across a great article [via lobsters](https://lobste.rs/s/uhkwhn/introducing_zq_easier_faster) recently: [Introducing zq: an Easier (and Faster) Alternative to jq](https://www.brimdata.io/blog/introducing-zq/). I [posted](https://lobste.rs/s/uhkwhn/introducing_zq_easier_faster#c_ue6azr) some brief thoughts on it over on the lobsters thread, and in the spirit of "owning your own words", I thought I'd write them up here too.

I do like articles like this, that show and lay out the thinking behind the conclusion, and along the way, impart knowledge about the topic at hand. Especially when they're on a subject I'm eager to learn more about.

While reading the article a couple of things struck me.

## Stateless dataflow

First, I'd not really heard of the phrase "stateless dataflow" (and its opposite "stateful dataflow"). I did look it up via Google and found that there were [very few results](https://www.google.com/search?q=%22stateless+(dataflow%7Cdata-flow)), most of them being scholarly papers either in PDF or even PostScript form. So I sort of forgave myself for not really knowing what was implied, although I had taken a guess anyway.

Basically the author was explaining that the reason for finding the `jq` language difficult was down to the computational model. I don't think `jq` is the easiest language, and in my experience so far that is down to a number of things, not least the relative terseness of the official manual, but also my inability to grasp powerful constructs, as well as having to manipulate complex object and array structures in my head, not only statically, but also having to imagine how they might change when processed through filters.

It seems that the author's issue with the "stateless dataflow" was down to the fact that what's being processed by `jq` is very often a _stream_ of discrete JSON values, rather than a single value.

## JSON values

So what do I mean by "JSON value"? Well, in the article [Introducing JSON](https://www.json.org/json-en.html) there's a McKeeman form expressing the JSON grammar, and the building blocks of what we know as JSON are described as "JSON values" thus:

```
value
  object
  array
  string
  number
  "true"
  "false"
  "null"
```

These JSON values are described as fundamental building blocks in [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259#section-3).

Anything expressed in JSON will be one of these value types. This is why, for example, `"hello world"` is valid JSON, as is `42`.

## Processing JSON with jq

In the "Invoking jq" section of the [manual](https://stedolan.github.io/jq/manual/), it says:

> jq filters run on a stream of JSON data. The input to jq is parsed as a sequence of whitespace-separated JSON values which are passed through the provided filter one at a time. The output(s) of the filter are written to standard out, again as a sequence of whitespace-separated JSON data.

Key for me, in my journey towards a deeper understanding of `jq`, is that the "filter" here is the entire `jq` program, whether that's something short expressed literally on the command line, or in a file, pointed to with the `--from-file` or `-f` option.

So each and every JSON value that is passed into `jq` is processed by the entire program.

There's the "slurp" option (with `--slurp` or `-s`) which will "read the entire input stream into a large array and run the filter just once". This is maybe what one might initially assume or expect `jq` to do, but one needs to be explicit.

Perhaps a small example might help, based on a sequence of JSON values that we can produce with [seq](https://linux.die.net/man/1/seq):

```bash
seq 3
```

produces:

```
1
2
3
```

If we pass this sequence of JSON values through the simplest of `jq` filters -- the [identity](https://stedolan.github.io/jq/manual/#Identity:.) function -- like this:

```bash
seq 3 | jq .
```

then we get this:

```
1
2
3
```

One might think "well, what else would you expect?" but this illustrates the nature of running discrete JSON values through a filter quite nicely.

Before we continue, let's use the `--compact-output` (or `-c`) option here:

```bash
seq 3 | jq -c .
```

The output is the same:

```
1
2
3
```

For me, this drives home the "discrete JSON values" approach to both `jq`'s input and output processing - there are three discrete values in, and three out.

## Stateless

I guess this also helps explain what the author of the article means by "stateless". As far as the filter is concerned, it's seeing the values `1`, `2` and `3` separately and in new contexts each time. And as the article illustrates, this is where `jq`'s `--slurp` (or `-s`) option comes in. Adding the option to the above example:

```bash
seq 3 | jq -c -s .
```

produces this:

```
[1,2,3]
```

A _single JSON value_. This is because what the filter received was actually this:

```json
[
  1,
  2,
  3
]
```

Three discrete values, but wrapped in an outer enclosing array. A single JSON value, in the form of an array. And being the simple identity function, just regurgitating what it reads, produces in turn that same, single JSON value as output. On one line here, rather than pretty printed with more whitespace, because of the `-c` option.

## Stateful

The `--slurp` option brings about a sort of statefulness, in that every discrete JSON value, previously independent, now share the same single context of the single invocation of the `jq` filter.

Changing the filter from the `.` identity function to the `add` function\* demonstrates this singular context, this "statefulness":

```bash
seq 3 | jq -s add
```

This yields the single JSON value:

```
6
```

\*I'm calling them "functions", but the manual actually calls them "filters"

## Syntactic sugar

There's one more observation I'd like to make in these ramblings. The article describes the task of adding up the numbers here:

```bash
echo '[1,2,3] [4,5,6]'
```

In other words, the result should be 21.

We know by now that this:

```
[1,2,3] [4,5,6]
```

is actually two discrete JSON values. Two arrays. So, as the author demonstrates, the `--slurp` option is called for, thus:

```bash
echo '[1,2,3] [4,5,6]' | jq -s '[.[] | add] | add'
```

So in this invocation, the filter is executed once only, and actually receives:

```json
[
  [1,2,3],
  [4,5,6]
]
```

The article does a great job of describing the author's thought process here, and also showing how some of the basic filters work. And I guess the filter used here is possibly deliberately complex, or at least contrived to illustrate a point:

```
[.[] | add] | add
```

However to be fair on the language, it has some syntactic sugar in the form of [map](https://stedolan.github.io/jq/manual/#map(x),map_values(x)). In the description, we read:

> `map(x)` is equivalent to `[.[] | x]`. In fact, this is how it's defined.

And we can see this definition in `jq`'s source, specifically in the [builtin.jq](https://github.com/stedolan/jq/blob/a9f97e9e61a910a374a5d768244e8ad63f407d3e/src/builtin.jq#L3) file:

```
def map(f): [.[] | f];
```

This definition helps the mental model, and helps me a lot, not only to reduce noise, but also to relate the computation to an arguably well-known function (map). So the entire line turns into a much simpler:

```bash
echo '[1,2,3] [4,5,6]' | jq -s 'map(add) | add'
```

## Wrapping up

This has turned into a bit of a longer ramble, beyond what I'd originally [commented](https://lobste.rs/s/uhkwhn/introducing_zq_easier_faster#c_ue6azr). But writing it has helped me think about this a bit more. Perhaps it helps you too - I hope so!

And most importantly, my thoughts in this post should not detract from the article nor from their conclusions with zq - more power to them!
