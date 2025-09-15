---
title: Quick conversion of multiple values using with_entries in jq
date: 2024-02-28
tags:
  - jq
---
This blog post demonstrates how powerful the combination of jq's `to_entries` and `from_entries` can be, and show how `with_entries` is a great extension of that.

I pulled some stats from the [YouTube Data API v3](https://developers.google.com/youtube/v3/docs/?apix=true) for the episodes so far in our [Back to basics: CAP Node.js](https://www.youtube.com/playlist?list=PL6RpkC85SLQBHPdfHQ0Ry2TMdsT-muECx) Hands-on SAP Dev live stream series. Surprisingly, the values for numbers of views and likes and so on are in string representation. Here's what the dataset (in a file called `series.json`) looks like as of right now:

```json
[
  {
    "id": "gu5r1EWSDSU",
    "title": "Back to basics with CAP - part 1",
    "statistics": {
      "viewCount": "8916",
      "likeCount": "247",
      "favoriteCount": "0",
      "commentCount": "15"
    }
  },
  {
    "id": "8N2TxgZ9bjY",
    "title": "Back to basics with CAP - part 2",
    "statistics": {
      "viewCount": "4045",
      "likeCount": "91",
      "favoriteCount": "0",
      "commentCount": "5"
    }
  },
  {
    "id": "mTvjAthGjBg",
    "title": "Back to basics with CAP - part 3",
    "statistics": {
      "viewCount": "2708",
      "likeCount": "79",
      "favoriteCount": "0",
      "commentCount": "11"
    }
  },
  {
    "id": "1ywiOaGVA5w",
    "title": "Back to basics with CAP - part 4",
    "statistics": {
      "viewCount": "2082",
      "likeCount": "72",
      "favoriteCount": "0",
      "commentCount": "8"
    }
  },
  {
    "id": "fgqnptEgUW4",
    "title": "Back to basics with CAP - part 5",
    "statistics": {
      "viewCount": "1926",
      "likeCount": "47",
      "favoriteCount": "0",
      "commentCount": "8"
    }
  },
  {
    "id": "NZj7Q4LBotA",
    "title": "Back to basics with CAP - part 6",
    "statistics": {
      "viewCount": "1545",
      "likeCount": "43",
      "favoriteCount": "0",
      "commentCount": "11"
    }
  }
]
```

If you look at the [videos resource documentation](https://developers.google.com/youtube/v3/docs/videos#resource), you'll see that the intended representations for these resources are indeed strings:

![YouTube API v3 - videos resource representation](/images/2024/02/ytapi-videos-statistics.png)

Anyway, for various reasons, including a desire to surface this info in a custom Home Assistant dashboard, and to be able to perform calculations upon the values, I wanted all the figures as numbers rather than strings.

## Another job for with_entries

While using `with_entries` is not entirely natural for me yet, I find I'm only a step away, because I know that `to_entries` brings me from what I am starting with to something a lot closer to a structure that I can automatically manipulate. What I mean is that identifying the four separate properties within the `statistics` object is difficult to do automatically as they have dynamic names, but using `to_entries` makes that problem go away, especially with its sibling `from_entries` to turn things back again to how they were.

And once I have got that straight in my head, I know I can turn to the cousin of `to_entries` and `from_entries`, namely `with_entries`.

### Using to_entries

Here's an example of what `to_entries` does to the `statistics` object in the first object in the array (to keep things brief).

> In all the following examples, I'll just show the jq. For example, the `first | .statistics` jq directly below would actually be invoked like this: `jq 'first | .statistics' series.json`. Also, longer jq invocations will be wrapped with newlines for readability.

First, let's identify the focus of transformation:

```jq
first | .statistics
```

This shows us:

```json
{
  "viewCount": "8916",
  "likeCount": "247",
  "favoriteCount": "0",
  "commentCount": "15"
}
```

Then, applying `to_entries` like this:

```jq
first | .statistics | to_entries
```

we get:

```json
[
  {
    "key": "viewCount",
    "value": "8916"
  },
  {
    "key": "likeCount",
    "value": "247"
  },
  {
    "key": "favoriteCount",
    "value": "0"
  },
  {
    "key": "commentCount",
    "value": "15"
  }
]
```

Now each of the properties (e.g. `"viewCount": "8916"`) are normalised into objects, each containing static key names `key` and `value` (e.g. `{ "key": "viewCount", "value": "8916" }`), and all these objects are contained in an array.

This then means we can apply a general transformation over that array. So let's try `tonumber`, like this:

```jq
first | .statistics | to_entries 
| map(.value |= tonumber)
```

This results in:

```json
[
  {
    "key": "viewCount",
    "value": 8916
  },
  {
    "key": "likeCount",
    "value": 247
  },
  {
    "key": "favoriteCount",
    "value": 0
  },
  {
    "key": "commentCount",
    "value": 15
  }
]
```

### Using from_entries

And to get back to the structure we started with is a job for `from_entries`:

```jq
first | .statistics | to_entries
| map(.value |= tonumber)
| from_entries
```

This results in:

```json
{
  "viewCount": 8916,
  "likeCount": 247,
  "favoriteCount": 0,
  "commentCount": 15
}
```

Nice!

### Using with_entries

Using `to_entries`, mapping over the entries in the resulting array, then using `from_entries` is such a common pattern that there's also `with_entries` which is a [built-in defined itself in jq](https://github.com/jqlang/jq/blob/master/src/builtin.jq):

```jq
def with_entries(f): to_entries | map(f) | from_entries;
```

So we can reduce the previous incantation down to:

```jq
first | .statistics | with_entries(.value |= tonumber)
```

This gives us exactly the same result.

## Putting it all together

So using `with_entries` we can transform the statistics properties of all of the video entries, like this:

```jq
map(.statistics |= with_entries(.value |= tonumber))
```

```json
[
  {
    "id": "gu5r1EWSDSU",
    "title": "Back to basics with CAP - part 1",
    "statistics": {
      "viewCount": 8916,
      "likeCount": 247,
      "favoriteCount": 0,
      "commentCount": 15
    }
  },
  {
    "id": "8N2TxgZ9bjY",
    "title": "Back to basics with CAP - part 2",
    "statistics": {
      "viewCount": 4045,
      "likeCount": 91,
      "favoriteCount": 0,
      "commentCount": 5
    }
  },
  {
    "id": "mTvjAthGjBg",
    "title": "Back to basics with CAP - part 3",
    "statistics": {
      "viewCount": 2708,
      "likeCount": 79,
      "favoriteCount": 0,
      "commentCount": 11
    }
  },
  {
    "id": "1ywiOaGVA5w",
    "title": "Back to basics with CAP - part 4",
    "statistics": {
      "viewCount": 2082,
      "likeCount": 72,
      "favoriteCount": 0,
      "commentCount": 8
    }
  },
  {
    "id": "fgqnptEgUW4",
    "title": "Back to basics with CAP - part 5",
    "statistics": {
      "viewCount": 1926,
      "likeCount": 47,
      "favoriteCount": 0,
      "commentCount": 8
    }
  },
  {
    "id": "NZj7Q4LBotA",
    "title": "Back to basics with CAP - part 6",
    "statistics": {
      "viewCount": 1545,
      "likeCount": 43,
      "favoriteCount": 0,
      "commentCount": 11
    }
  }
]
```

Perfect!
