---
layout: post
title: More Untappd data explorations with jq - my top ranking beer types (part 1)
tags:
  - jq-series-top-beer-types
  - untappd
  - jq
  - beer
---
I've been exploring my Untappd data a bit more since [analysing my top brewery countries](/blog/posts/2022/10/28/untappd-data-with-jq-my-top-brewery-countries/), this time to see if my average ratings indicated anything about my preferred beer types. Here's what I've done so far, in part 1 of this little series.

[![a 5 star rating to a checkin of Dogfishhead's 90 Minute Imperial IPA](/images/2022/10/dogfishhead-checkin.png)](https://untappd.com/user/qmacro/checkin/658678850)

Near the start of the previous post [Untappd data with jq - my top brewery countries](https://qmacro.org/blog/posts/2022/10/28/untappd-data-with-jq-my-top-brewery-countries/) there's an example of a checkin object; here are some of the properties:

```json 
{
  "beer_name": "Leffe Brune / Bruin",
  "brewery_name": "Abbaye de Leffe",
  "beer_type": "Brown Ale - Belgian",
  "rating_score": "5"
}
```

## What are the beer types?

I wanted to know how (if at all) my rating was affected by my particular preferences on beer types. I started looking at what types existed in my checkin data. First, how many are we talking about here?

```bash
< checkins.json jq '
map(.beer_type) | unique | length
'
```

Wow, there are quite a few:

```json
177
```

Let's have a look at the first 20:

```bash
< checkins.json jq '
map(.beer_type) | unique[:20]
'
```

> The [unique](https://stedolan.github.io/jq/manual/#unique,unique_by(path_exp)) function produces a sorted list as well as removing duplicates.


```json
[
  "Altbier",
  "Barleywine - American",
  "Barleywine - English",
  "Barleywine - Other",
  "Belgian Blonde",
  "Belgian Dubbel",
  "Belgian Quadrupel",
  "Belgian Strong Dark Ale",
  "Belgian Strong Golden Ale",
  "Belgian Tripel",
  "Bitter - Best",
  "Bitter - Extra Special / Strong (ESB)",
  "Bitter - Session / Ordinary",
  "Bière de Champagne / Bière Brut",
  "Black & Tan",
  "Blonde Ale",
  "Bock - Doppelbock",
  "Bock - Eisbock",
  "Bock - Hell / Maibock / Lentebock",
  "Bock - Single / Traditional"
]
```

OK so there are quite a few. 

## Reducing the number of types

I might be able to be a little less granular if I just take whatever comes before the dash, if there is one. That would, for example, group together all the Bock types, and, for another example, all the IPAs, of which there are quite a few:

```bash
< checkins.json jq '
map(.beer_type|select(startswith("IPA -"))) | unique
'
```

As you can see:

```json
[
  "IPA - American",
  "IPA - Belgian",
  "IPA - Black / Cascadian Dark Ale",
  "IPA - Brett",
  "IPA - Brut",
  "IPA - Cold",
  "IPA - English",
  "IPA - Farmhouse",
  "IPA - Imperial / Double",
  "IPA - Imperial / Double Black",
  "IPA - Imperial / Double Milkshake",
  "IPA - Imperial / Double New England / Hazy",
  "IPA - Milkshake",
  "IPA - New England / Hazy",
  "IPA - New Zealand",
  "IPA - Other",
  "IPA - Red",
  "IPA - Rye",
  "IPA - Session",
  "IPA - Sour",
  "IPA - Triple",
  "IPA - Triple New England / Hazy",
  "IPA - White / Wheat"
]
```

So if I call the part before any dash the "major" type, how many of those are there? Hopefully fewer than 177. Let's work it out:

```bash
< checkins.json jq '
map(.beer_type|split(" -")|first) | unique | length, .
'
```

> Hold on though, what if a `beer_type` value doesn't have a dash? What will calling `split(" -")` do here? Let's see:
> 
> ```bash
> jq -n '
> ["Major - minor", "Some other type"] | map(split(" -")|first)
> '
> ```
>
> (The `-n` option tells `jq` to use `null` as the single input value, effectively telling `jq` not to expect any JSON to be fed in).
>
> This gives:
>
> ```json
> [
>   "Major",
>   "Some other type"
> ]
> ```
>
> This is what we want to happen.


OK, let's run the filter, which gives:

```json
62
[
  "Altbier",
  "Barleywine",
  "Belgian Blonde",
  "Belgian Dubbel",
  "Belgian Quadrupel",
  "Belgian Strong Dark Ale",
  "Belgian Strong Golden Ale",
  "Belgian Tripel",
  "Bitter",
  "Bière de Champagne / Bière Brut",
  "Black & Tan",
  "Blonde Ale",
  "Bock",
  "Brett Beer",
  "Brown Ale",
  "California Common",
  "Chilli / Chile Beer",
  "Cider",
  "Cream Ale",
  "Dark Ale",
  "Farmhouse Ale",
  "Freeze-Distilled Beer",
  "Fruit Beer",
  "Gluten-Free",
  "Golden Ale",
  "Grape Ale",
  "Historical Beer",
  "Honey Beer",
  "IPA",
  "Kellerbier / Zwickelbier",
  "Kölsch",
  "Lager",
  "Lambic",
  "Mead",
  "Mild",
  "Märzen",
  "Old Ale",
  "Pale Ale",
  "Pilsner",
  "Porter",
  "Rauchbier",
  "Red Ale",
  "Roggenbier",
  "Rye Beer",
  "Rye Wine",
  "Schwarzbier",
  "Scotch Ale / Wee Heavy",
  "Scottish Ale",
  "Scottish Export Ale",
  "Shandy / Radler",
  "Smoked Beer",
  "Sour",
  "Specialty Grain",
  "Spiced / Herbed Beer",
  "Stout",
  "Strong Ale",
  "Table Beer",
  "Traditional Ale",
  "Wheat Beer",
  "Wild Ale",
  "Winter Ale",
  "Winter Warmer"
]
```

> Note there are two JSON values - a scalar (62) and an array. I wanted the count, as well as all the names of the major types, and that's what was produced, as you can see, from `length` and `.` respectively. The interesting thing to note is that in the last part of the filter, _both_ `length` and `.` were passed the output from the preceding expression (the output from `unique`); there was no need for any variable binding or explicit value passing. 

## Encoding a function

That "major type" thing is something I'll likely use again, so it's worth considering creating a function for it.

> From now on, I'll stop showing the entire command line invocation (passing the file contents to `jq`, and specifying the filter in single quotes, also on the command line) and show just the `jq` expressions instead. That's mostly because I can then get it formatted a little nicer in these posts (with a bit of colour that's sensitive to `jq`'s syntax). I'll create a file `untappd.jq` to hold the `jq` expressions, so you just need to imagine that the invocations now look like this:
> 
> ```bash
> < checkins.json jq -f untappd.jq 
> ```

The function is very simple and just encapsulates what we've done already, which is then replaced with a call to that function:

```jq
def category: split(" -") | first;

map(.beer_type|category) | unique | length, .
```

I wasn't fond of the name "major_type" for the function, so I've come up with the name "category" instead.

## What's next

That's the end of part 1. It looks like I have a manageable set of major beer types (categories) to use as a basis for this analysis. I've also got the feeling that the `jq` that I'll end up writing might be more than a few lines' worth, so I'm glad I've made the switch away from a "one-liner" to a file based filter.

In [part 2](/blog/posts/2022/10/31/more-untappd-data-explorations-with-jq-my-top-ranking-beer-types-(part-2)/) I look at collecting my ratings across all the checkins, ready for averaging them by category.
