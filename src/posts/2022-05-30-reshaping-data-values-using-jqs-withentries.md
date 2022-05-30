---
layout: post
title: Reshaping data values using jq's with_entries
tags:
  - jq
---
Receipt of a JSON file containing valid tags for tutorial metadata gave me the perfect opportunity to explore it and learn a bit more jq in the process.

For each of our [tutorials](https://github.com/SAP-tutorials) in SAP's [Tutorial Navigator](https://developers.sap.com/tutorial-navigator.html), we have metadata in the frontmatter. Here's [an example](https://github.com/sap-tutorials/Tutorials/blob/5c282ddec1cb15f3d8d5c6e0814ad9a8c94ee0f2/tutorials/odata-01-intro-origins/odata-01-intro-origins.md) from the [Learn About OData Fundamentals](https://developers.sap.com/tutorials/odata-01-intro-origins.html) tutorial:

```markdown
author_name: DJ Adams
author_profile: https://github.com/qmacro
title: Learn about OData Fundamentals
description: Discover OData's origins and learn about the fundamentals of OData by exploring a public OData service.
auto_validation: false
primary_tag: software-product>sap-business-technology-platform
tags: [ software-product>sap-business-technology-platform, topic>cloud, programming-tool>odata, tutorial>beginner ]
time: 15
```

I received a JSON file with updated valid tags, against which I could check the values for the `primary_tag` and `tags` properties. The tags were arranged like this (drastically reduced to save space here):

```json
{
  "level": [
    {
      "name": "Beginner",
      "value": " tutorial>beginner"
    },
    {
      "name": "Intermediate",
      "value": " tutorial>intermediate"
    },
    {
      "name": "Advanced",
      "value": " tutorial>advanced"
    }
  ],
  "common": [
    {
      "name": "ABAP Connectivity",
      "value": "topic>abap-connectivity"
    },
    {
      "name": "ABAP Development",
      "value": "programming-tool>abap-development"
    },
    {
      "name": "ABAP Extensibility",
      "value": "programming-tool>abap-extensibility"
    },
    {
      "name": "Android",
      "value": "operating-system>android"
    },
    {
      "name": "Artificial Intelligence",
      "value": "topic>artificial-intelligence"
    },
    {
      "name": "Big Data",
      "value": "topic>big-data"
    }
  ]
}
```

I wanted to explore the tags by "category", the part before the `>` symbol in the `value` properties. In the above excerpt (in the `common` object, which is where the main list of tags are), there are the following categories: `topic`, `programming-tool` and `operating-system`.

## Separating tags from categories with split

First, I used [split][manual-split] to separate out the categories and tags by splitting on the `>` symbol in each of the values.

```jq
.common
| map(.value | split(">"))
```

This produces an array of arrays. The outer array is the result of running `map` (which takes an array and produces an array) and the inner arrays are the result of running `split` on each `category>tag` pattern in the `value` properties:

```json
[
  [
    "topic",
    "abap-connectivity"
  ],
  [
    "programming-tool",
    "abap-development"
  ],
  [
    "programming-tool",
    "abap-extensibility"
  ],
  [
    "operating-system",
    "android"
  ],
  [
    "topic",
    "artificial-intelligence"
  ],
  [
    "topic",
    "big-data"
]
```

## Grouping by categories with group_by

The categories are the first values in each of the inner arrays, so next is to group the inner arrays by those categories:

```jq
.common
| map(.value | split(">"))
| group_by(.[0])
```

The `.[0]` supplied to `group_by` specifies that it's the first element of each inner array that should be the basis of grouping (i.e. the categories `topic`, `programming-tool`, `programming-tool`, etc).

This produces a differently shaped nesting of arrays, one for each of the categories:

```json
[
  [
    [
      "operating-system",
      "android"
    ]
  ],
  [
    [
      "programming-tool",
      "abap-development"
    ],
    [
      "programming-tool",
      "abap-extensibility"
    ]
  ],
  [
    [
      "topic",
      "abap-connectivity"
    ],
    [
      "topic",
      "artificial-intelligence"
    ],
    [
      "topic",
      "big-data"
    ]
  ]
]
```

## Reforming the structure with the entries functions

Now comes the task to reform that essential structure into something a little less "noisy". Using the [entries family][manual-entries-family] of functions, this turned out to be quite straightforward. That said, I'll explain the intermediate steps I went through on the way.

### Getting from an array-based to an object-based structure with to_entries

As I wanted an object, with the keys being categories, and the values being arrays of tag strings, it felt right to reach for the `to_entries` function:

```jq
.common
| map(.value | split(">"))
| group_by(.[0])
| to_entries
```

This produced the following:

```json
[
  {
    "key": 0,
    "value": [
      [
        "operating-system",
        "android"
      ]
    ]
  },
  {
    "key": 1,
    "value": [
      [
        "programming-tool",
        "abap-development"
      ],
      [
        "programming-tool",
        "abap-extensibility"
      ]
    ]
  },
  {
    "key": 2,
    "value": [
      [
        "topic",
        "abap-connectivity"
      ],
      [
        "topic",
        "artificial-intelligence"
      ],
      [
        "topic",
        "big-data"
      ]
    ]
  }
]
```

### Tidying up with object construction in a map

That is sort of the direction I want to go, but there's some tidying up to do, to get cleaner values for `key` and `value`. So I reached for `map` to do this:

```jq
.common
| map(.value | split(">"))
| group_by(.[0])
| to_entries
| map({key: .value[0][0], value: .value|map(.[1])})
```

The expression passed to `map` is the [object construction][manual-object-construction] (`{...}`), creating objects each with two properties, `key` and `value`. The reason for staying with these property names will become clear shortly.

The value for `key` is expressed as `.value[0][0]`, i.e. the first (zeroth) element of the inner array that is the first (zeroth) element of the array that is the value of the `value` property.

In other words, given the last object in the above most recent intermediate results:

```json
  {
    "key": 2,
    "value": [
      [
        "topic",
        "abap-connectivity"
      ],
      [
        "topic",
        "artificial-intelligence"
      ],
      [
        "topic",
        "big-data"
      ]
    ]
  }
```

Then `.value[0][0]` will return `"topic"` (specifically, the first instance of that string in the above JSON).

Similarly, to build the value for the new `value` property in the object being constructed, I used this expression: `.value|map(.[1])`. The current value of the `value` property is an array, so using `map` on that will produce another array. Of what? Well, of these values: `.[1]`.

In other words, the second (index 1) value in each of the sub arrays. Given this same last object example above, `.value|map(.[1])` produces `["abap-connectivity", "artificial-intelligence", "big-data"]`.

Running this latest iteration with the `map` function produces this:


```json
[
  {
    "key": "operating-system",
    "value": [
      "android"
    ]
  },
  {
    "key": "programming-tool",
    "value": [
      "abap-development",
      "abap-extensibility"
    ]
  },
  {
    "key": "topic",
    "value": [
      "abap-connectivity",
      "artificial-intelligence",
      "big-data"
    ]
  }
]
```

Almost there!

## Creating a neat structure with from_entries

[According to the manual][manual-entries-family], the `to_entries` and `from_entries` "convert between an object and array of key-value pairs". In each case, the name for the key and value properties are `key` and `value` respectively. I had an inkling I would probably want to use `from_entries` at some stage, and this is the reason why I kept the names of the properties earlier.

Let's have a look what passing the above structure into `from_entries` produces:

```jq
.common
| map(.value | split(">"))
| group_by(.[0])
| to_entries
| map({key: .value[0][0], value: .value|map(.[1])})
| from_entries
```

```json
{
  "operating-system": [
    "android"
  ],
  "programming-tool": [
    "abap-development",
    "abap-extensibility"
  ],
  "topic": [
    "abap-connectivity",
    "artificial-intelligence",
    "big-data"
  ]
}
```

That's very nice, and pretty much exactly what I want. A neat and low-noise representation of the category and tag structure.

## Refactoring with with_entries

It turns out that the pattern:

```
to_entries -> map(...) -> from_entries
```

is common enough to have a function expression all of its own, and it's `with_entries`. As detailed in the [entries section of the manual][manual-entries-family]:

> `with_entries(foo)` is shorthand for `to_entries | map(foo) | from_entries`

In fact, we can see how it's defined (which is exactly as described in the manual) [in builtin.jq](https://github.com/stedolan/jq/tree/a9f97e9e61a910a374a5d768244e8ad63f407d3e), along with `to_entries` and `from_entries`.

## Wrapping up

While I've played around a little with the [entries family][manual-entries-family], this is the first time I've used it for real. Going through the intermediate process of finding myself using `map` actually has helped me reflect on `with_entries` very well.

[manual-split]: https://stedolan.github.io/jq/manual/#split(str)
[manual-entries-family]: https://stedolan.github.io/jq/manual/#to_entries,from_entries,with_entries
[manual-object-construction]: https://stedolan.github.io/jq/manual/#ObjectConstruction:{}
