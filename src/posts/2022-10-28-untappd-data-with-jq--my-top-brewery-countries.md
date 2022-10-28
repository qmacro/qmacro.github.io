---
layout: post
title: Untappd data with jq - my top brewery countries
tags:
  - jq
  - untappd
  - beer
---
In this short post I explore my Untappd checkin data with `jq`, because it's a nice data set to practise my limited filtering fu upon, and also to get my blogging flowing again. 

![My profile on Untappd](/images/2022/10/untappd-profile.png)

I'm an [Untappd supporter](https://untappd.com/user/qmacro) and an early adopter, joining in early November 12 years ago in 2010. Recently Untappd [celebrated 12 years of operation and 10 million users](https://twitter.com/untappd/status/1584908973135859717). It got me thinking back to my [very first checkin](https://untappd.com/user/qmacro/checkin/11215/) (it was a Leffe Brune, in case you're wondering) and then I remembered that as an Untappd supporter I could get access to my entire checkin history, in JSON.

## The Untappd checkin data

The JSON data is quite simple - it's a single file (I've called it `checkins.json`) containing an array of checkin objects, where each object looks like this:

```json 
{
  "beer_name": "Leffe Brune / Bruin",
  "brewery_name": "Abbaye de Leffe",
  "beer_type": "Brown Ale - Belgian",
  "beer_abv": "6.5",
  "beer_ibu": "20",
  "comment": "Christening Untappd with this, a fav of mine.",
  "venue_name": null,
  "venue_city": null,
  "venue_state": null,
  "venue_country": null,
  "venue_lat": null,
  "venue_lng": null,
  "rating_score": "5",
  "created_at": "2010-11-08 18:52:02",
  "checkin_url": "https://untappd.com/c/11215",
  "beer_url": "https://untappd.com/beer/5941",
  "brewery_url": "https://untappd.com/brewery/5",
  "brewery_country": "Belgium",
  "brewery_city": "Leuven",
  "brewery_state": "Vlaanderen",
  "flavor_profiles": "",
  "purchase_venue": "",
  "serving_type": "",
  "checkin_id": "11215",
  "bid": "5941",
  "brewery_id": "5",
  "photo_url": null,
  "global_rating_score": 3.55,
  "global_weighted_rating_score": 3.55,
  "tagged_friends": "",
  "total_toasts": "1",
  "total_comments": "0"
}
```

(OK, I put my `rating_score` of 5 down to excitement at a new beer rating app).

## My top brewery countries

Noting that my first checkin was to a beer from Belgium (see the value for the `brewery_country` property) I thought it would be a nice exercise to discover the top brewery countries for the beers I've checked in.

### Reducing the data set

To keep the data compact for this blog post, I decided to analyse just the latest 20 checkins, rather than he entire [four thousand plus](https://untappd.com/user/qmacro). And for the purposes of experimentation and illustration, I only really need to see the beer name, brewery name and brewery country. 

So I start my analysis like this:

```bash
< /tmp/untappd.json jq '
.[-20:]
| map({beer_name, brewery_name, brewery_country})
'
```

Note the use of a negative index on the [array slice](https://stedolan.github.io/jq/manual/#Array/StringSlice:.[10:15]) here - which causes the slice to start from counting backwards from the end of the array. Note also that I'm invoking `jq` and passing in the data in a slightly different way than I have done before (such as in [Summing and grouping values with jq](/blog/posts/2022/06/16/summing-and-grouping-values-with-jq/)). Instead of specifying a filename (`jq filter filename`) I'm using redirection to pass the contents of the `filename` to `jq`'s STDIN: `< filename jq filter`.

This gives us a much smaller data set to think about, but which has enough variation to have the analysis also make sense:

```bash
< /tmp/untappd.json jq '
.[-20:]
| map({beer_name, brewery_name, brewery_country})
'
```

## Grouping by brewery country

Well the first thing I want to do is arrange the checkin objects by brewery country. Using [group_by](https://stedolan.github.io/jq/manual/#group_by(path_expression)) produces a set of subarrays, like this:

```bash
< /tmp/untappd.json jq '
.[-20:]
| map({beer_name, brewery_name, brewery_country})
| group_by(.brewery_country)
'
```

This results in a set of subarrays, one for each brewery country, as we'd expect. Note the new `[ [ ... ], [ ... ], ... ]` structure:

```json
[
  [
    {
      "beer_name": "Gueuze Tilquin – Draft Version",
      "brewery_name": "Gueuzerie Tilquin",
      "brewery_country": "Belgium"
    },
    {
      "beer_name": "Zwanze 2022 - Poivre De Gorilles",
      "brewery_name": "Brasserie Cantillon",
      "brewery_country": "Belgium"
    },
    {
      "beer_name": "Moeder Imperiale",
      "brewery_name": "La Source Beer Co.",
      "brewery_country": "Belgium"
    },
    {
      "beer_name": "Petrus Dubbel",
      "brewery_name": "Brouwerij De Brabandere",
      "brewery_country": "Belgium"
    },
    {
      "beer_name": "Abt 12",
      "brewery_name": "Brouwerij St.Bernardus",
      "brewery_country": "Belgium"
    }
  ],
  [
    {
      "beer_name": "Out of Vogue",
      "brewery_name": "Burning Sky Brewery",
      "brewery_country": "England"
    },
    {
      "beer_name": "Outlaw",
      "brewery_name": "Distant Hills",
      "brewery_country": "England"
    },
    {
      "beer_name": "North X Neon Raptor Imperial Stout + Cacao + Peanut + Banana",
      "brewery_name": "North Brewing Co.",
      "brewery_country": "England"
    },
    {
      "beer_name": "Sweet Temptation",
      "brewery_name": "Vocation Brewery",
      "brewery_country": "England"
    },
    {
      "beer_name": "Turns",
      "brewery_name": "Siren Craft Brew",
      "brewery_country": "England"
    },
    {
      "beer_name": "Interference Is Temporary",
      "brewery_name": "Cloudwater Brew Co.",
      "brewery_country": "England"
    },
    {
      "beer_name": "Have You Got Cask Or Is It All Craft?",
      "brewery_name": "DEYA Brewing Company",
      "brewery_country": "England"
    },
    {
      "beer_name": "DIVINE FAITH // DIPA (2022)",
      "brewery_name": "Northern Monk",
      "brewery_country": "England"
    },
    {
      "beer_name": "Silver King",
      "brewery_name": "Ossett Brewery",
      "brewery_country": "England"
    },
    {
      "beer_name": "HEATHEN // HAZY IPA",
      "brewery_name": "Northern Monk",
      "brewery_country": "England"
    }
  ],
  [
    {
      "beer_name": "Liquid Art",
      "brewery_name": "Prizm Brewing Co.",
      "brewery_country": "France"
    }
  ],
  [
    {
      "beer_name": "Supersonic",
      "brewery_name": "LERVIG",
      "brewery_country": "Norway"
    }
  ],
  [
    {
      "beer_name": "SDIPA Strata",
      "brewery_name": "Vault City Brewing",
      "brewery_country": "Scotland"
    }
  ],
  [
    {
      "beer_name": "Kentucky Breakfast Stout (KBS)",
      "brewery_name": "Founders Brewing Co.",
      "brewery_country": "United States"
    },
    {
      "beer_name": "Illuminati",
      "brewery_name": "Leelanau Brewing Company",
      "brewery_country": "United States"
    }
  ]
]
```

## Arranging by brewery country and count

Each of the subarrays has a length equal to the count of checkins for that country, clearly. So I can use this and gather the data into a key/value structure that I can then use further down the line with the [entries](https://stedolan.github.io/jq/manual/#to_entries,from_entries,with_entries) family of functions.

```bash
< /tmp/untappd.json jq '
.[-20:]
| map({beer_name, brewery_name, brewery_country})
| group_by(.brewery_country)
| map({key: first.brewery_country, value: length})
'
```

This has the effect of turning the subarrays into objects:


```json
[
  {
    "key": "Belgium",
    "value": 5
  },
  {
    "key": "England",
    "value": 10
  },
  {
    "key": "France",
    "value": 1
  },
  {
    "key": "Norway",
    "value": 1
  },
  {
    "key": "Scotland",
    "value": 1
  },
  {
    "key": "United States",
    "value": 2
  }
]
```

I could have mapped the subarrays slightly differently, like this:

```bash
< /tmp/untappd.json jq '
.[-20:]
| map({beer_name, brewery_name, brewery_country})
| group_by(.brewery_country)
| map({(first.brewery_country): length})
'
```

which would have produced an arguably neater result:

```json
[
  {
    "Belgium": 5
  },
  {
    "England": 10
  },
  {
    "France": 1
  },
  {
    "Norway": 1
  },
  {
    "Scotland": 1
  },
  {
    "United States": 2
  }
]
```

The problem with this result is that it's now harder to sort by the count, because there's no stable property to refer to for sorting. So we'll stick with the use of `key` and `value` properties.

## Sorting 

It's now time to sort, and I want the most popular brewery country at the top, so I'll also need to reverse the sorted output:

```bash
< /tmp/untappd.json jq '
.[-20:]
| map({beer_name, brewery_name, brewery_country})
| group_by(.brewery_country)
| map({key: first.brewery_country, value: length})
| sort_by(.value)
| reverse
'
```

This produces what we're expecting:

```json
[
  {
    "key": "England",
    "value": 10
  },
  {
    "key": "Belgium",
    "value": 5
  },
  {
    "key": "United States",
    "value": 2
  },
  {
    "key": "Scotland",
    "value": 1
  },
  {
    "key": "Norway",
    "value": 1
  },
  {
    "key": "France",
    "value": 1
  }
]
```

## Arranging into the final structure

Now I have the core data computed and organised as required, I can neaten it up using the `from_entries` function, which expects `key` and `value` property names:

```bash
< /tmp/untappd.json jq '
.[-20:]
| map({beer_name, brewery_name, brewery_country})
| group_by(.brewery_country)
| map({key: first.brewery_country, value: length})
| sort_by(.value)
| reverse
| from_entries
'
```

And I get an even better version of what I almost went for when I was first arranging by brewery country and count:

```json
{
  "England": 10,
  "Belgium": 5,
  "United States": 2,
  "Scotland": 1,
  "Norway": 1,
  "France": 1
}
```

That'll do nicely.

## Running the filter on the entire data set

Now I'm happy with the result, I can remove the first two parts of the filter (which were there just for a quick experiment) so that the results reflect my entire history checkin:

```bash
< /tmp/untappd.json jq '
group_by(.brewery_country)
| map({key: first.brewery_country, value: length})
| sort_by(.value)
| reverse
| from_entries
'
```

This gives me the following result:

```json
{
  "England": 2518,
  "United States": 590,
  "Belgium": 497,
  "Scotland": 157,
  "Netherlands": 123,
  "Denmark": 97,
  "Germany": 79,
  "Wales": 70,
  "Spain": 69,
  "Norway": 40,
  "Ireland": 29,
  "Sweden": 25,
  "Italy": 20,
  "France": 19,
  "Australia": 17,
  "Estonia": 16,
  "Poland": 13,
  "New Zealand": 13,
  "Latvia": 10,
  "Japan": 10,
  "United Kingdom": 6,
  "Northern Ireland": 5,
  "India": 5,
  "Austria": 5,
  "Iceland": 3,
  "Greece": 3,
  "Croatia": 3,
  "Canada": 3,
  "Turkey": 2,
  "Switzerland": 2,
  "South Africa": 2,
  "Portugal": 2,
  "Lithuania": 2,
  "Hungary": 2,
  "Channel Islands": 2,
  "Romania": 1,
  "Malta": 1,
  "Hong Kong": 1,
  "Finland": 1,
  "Czech Republic": 1
}
```

Given my beer tastes and my location, I don't think that's a surprising result. But nice to have it confirmed. Cheers and happy 12th birthday Untappd! 🍻


