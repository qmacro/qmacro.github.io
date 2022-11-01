---
layout: post
title: More Untappd data explorations with jq - my top ranking beer types (part 2)
tags:
  - jq-series-top-beer-types
  - untappd
  - jq
  - beer
---
This is a continuation of [part 1](/blog/posts/2022/10/30/more-untappd-data-explorations-with-jq-my-top-ranking-beer-types-(part-1)/) which you should read first. 

[![A checkin of an incredible 2005 vintage bottle of Orval](/images/2022/10/orval-2005-checkin.png)](https://untappd.com/user/qmacro/checkin/1204944451)

Part 1 finished with a count and list of categories of beer (IPA, Bock, Belgian Tripel, etc), produced from some `jq` in `untappd.jq` that looks like this:

```jq
def category: split(" -") | first;

map(.beer_type|category) | unique | length, .
```

The output looks like this (reduced here):

```json
62
[
  "Altbier",
  "Barleywine",
  "Belgian Blonde",
  "...",
  "Winter Ale",
  "Winter Warmer"
]
```

## Picking out the data

So now it's time to pick out the data I need for the analysis, and that is, for each checkin, the beer's category, and my rating. I'll start by just mapping the array of checkin objects to an array of smaller objects just containing these two things:

```jq
def category: split(" -") | first;

map({ category: .beer_type|category, rating_score })
```

> When using the [object construction](https://stedolan.github.io/jq/manual/#ObjectConstruction:{}) mechanism, I can just specify the name of an existing property, in this case `rating_score`, which is shorthand for `"rating_score": .rating_score`.

This produces an array of pairs of values which parallel the simple chronological list of checkins (output reduced for brevity):

```json
[
  {
    "category": "Brown Ale",
    "rating_score": "5"
  },
  {
    "category": "Pale Ale",
    "rating_score": "5"
  },
  {
    "category": "Bitter",
    "rating_score": "3"
  },
  {
    "category": "Bitter",
    "rating_score": ""
  },
  {
    "category": "Belgian Tripel",
    "rating_score": "4.7"
  },
  {
    "category": "...",
    "rating_score": "..."
  }
]
```

> Notice the checkin to a Bitter where I had not specified a rating. While we're at it, notice that the ratings are all strings, even though the values are numeric. We'll deal with those two aspects, but not just yet.

## Arranging by category

In order to be able to have a chance of calculating the average rating per category, I need first to group the data by category. So that's next:

```jq
def category: split(" -") | first;

map({ category: .beer_type|category, rating_score })
| group_by(.category)
```

Here's what that produces (again, massively reduced for brevity):

```json
[
  [
    {
      "category": "Altbier",
      "rating_score": "4"
    },
    {
      "category": "Altbier",
      "rating_score": "3"
    },
    {
      "category": "Altbier",
      "rating_score": "3.75"
    }
  ],
  [
    {
      "category": "Barleywine",
      "rating_score": "4"
    },
  [
    {
      "category": "Belgian Quadrupel",
      "rating_score": "4.9"
    },
    {
      "category": "Belgian Quadrupel",
      "rating_score": "5"
    }
  ]
]
```

## Rolling up by category

This seems familiar. In the "Arranging by brewery country and count" section of [Untappd data with jq - my top brewery countries](/blog/posts/2022/10/28/untappd-data-with-jq-my-top-brewery-countries/) I had a similar requirement, and following the call to `group_by` I mapped over each subarray creating small objects consisting of a `key` property having the value of the subarray's first entry's `brewery_country` and a `value` property having the length of the subarray. This is the code I had:

```bash
< checkins.json jq '
.[-20:]
| map({beer_name, brewery_name, brewery_country})
| group_by(.brewery_country)
| map({key: first.brewery_country, value: length})
'
```

I'm at a similar position here now too. I have a number of subarrays, each one representing a beer category, and containing one object per checkin. I want to turn those subarrays into something that makes more sense from an average rating per category point of view. And to get there would need something very similar to this `group_by ... map` approach. Let's have a look:

```jq
def category: split(" -") | first;

map({ category: .beer_type|category, rating_score })
| group_by(.category)
| map({key: first.category, value: map(.rating_score)})
```

This creates the following type of output:

```jq
[
  {
    "key": "Altbier",
    "value": [
      "4",
      "3",
      "3.75",
      "3.5",
      "3.25"
    ]
  },
  {
    "key": "...",
    "value": [
      "...",
      "..."
    ]
  },
  {
    "key": "Winter Warmer",
    "value": [
      "",
      "",
      "4",
      "4",
      "4",
      "3.5",
      "4",
      "4.25",
      "3.25",
      "4.25",
      "3.75",
      "3.4"
    ]
  }
]
```

## Encapsulating the roll-up into a function

OK, getting there! But before we move on it feels right to encapsulate this pattern into a function. I'll do that now:

```jq
def category: split(" -") | first;

def arrange(k;v): 
  group_by(.[k])
  | map({key: (first|.[k]), value: v});

map({ category: .beer_type|category, rating_score })
| arrange("category"; map(.rating_score))
```

This new function `arrange` (naming things is hard) performs the `group_by ... map`. It takes two parameters (in `jq` parlance it would be written as `arrange/2`):

* `k` is what the grouping property should be 
* `v` is what the value of the `value` property should be in the resulting objects

> To use an indirect value (whatever is in `k`) like this in a property reference, we have to use this syntax: `.[k]` rather than `.k` of course). 

So in the call to `arrange`, the first parameter I'm passing is the string `"category"`, which is the name of the property by which I want the objects to be grouped, and also which is the name of the property that I use to get the value for the `key` (`first|.[k]`) in each object I'm producing in the call to `map`. 

And the second parameter I'm passing is the expression `map(.rating_score)` which when evaluated produces an array of values from the `rating_score` property in each checkin. 

## What's next

Well, that seems like a good place to end this part. In part 3 I'll deal with those pesky null rating values, and also with the fact that all the ratings are strings rather than numbers. And then calculate an average.
