---
title: Learning from exploring a question on jq
date: 2022-12-28
tags:
  - jq
  - timtowdi
  - stackoverflow
---
In this post I explore different ways of achieving a simple goal in reformulating some JSON, with jq, and explain my thinking as I go.

Occasionally I browse the [Newest 'jq' questions on Stack Overflow](https://stackoverflow.com/questions/tagged/jq?tab=Newest) and try to gently expand my jq knowledge, or at least exercise my young jq muscles. This morning I came across this one: [Jq extracting the name and the value of objects as an array](https://stackoverflow.com/questions/74937237/jq-extracting-the-name-and-the-value-of-objects-as-an-array). Sometimes the questions are hard, sometimes less so. This one didn't seem too difficult, so I thought I'd take a quick coffee break to see what I could come up with (the question had [already been answered](https://stackoverflow.com/a/74937461/384366) but I didn't look until later). 

## The requirement 

The OP had this JSON:

```json
{
  "filterFeatureGroup": {
    "Hauttyp": [
      "Normal"
    ],
    "Deckkraft": [
      "Mittlere Deckkraft"
    ],
    "Grundfarbe": [
      "Grau"
    ],
    "Produkteigenschaften": [
      "Vegan"
    ],
    "Textur / Konsistenz / Applikation": [
      "Stift"
    ]
  }
}
```

and wanted to turn it into this:

```json
[
  "Hauttyp: Normal",
  "Deckkraft: Mittlere Deckkraft",
  "Grundfarbe: Grau",
  "Produkteigenschaften: Vegan",
  "Textur / Konsistenz / Applikation: Stift"
]
```

> As a bonus, I learned that "Deckkraft" means opacity in German. I don't think I've ever seen that word before, or had occasion to use that concept in a conversation. I'm guessing that this data perhaps relates to make-up or something similar. Anyway.

In thinking about an approach for this data transformation, it struck me that the Perl adage [There's more than one way to do it](https://en.wikipedia.org/wiki/There%27s_more_than_one_way_to_do_it) (often shortened to "TIMTOWDI" and pronounced "Tim Toady") is often at play with jq, too.

## First approach 

I fired up my favourite interactive jq explorer, [ijq](https://git.sr.ht/~gpanders/ijq), and loaded the data. Clearly the first parts of the output strings were the keys within the object that was the value of the `filterFeatureGroup` property, i.e. `Hauttyp`, `Deckkraft`, `Grundfarbe` and so on. So my immediate approach was to look at them using [keys][keys]:

```jq
.filterFeatureGroup | keys
```

```json
[
  "Deckkraft",
  "Grundfarbe",
  "Hauttyp",
  "Produkteigenschaften",
  "Textur / Konsistenz / Applikation"
]
```

This already looked quite close to the target output, so I forced my way forwards, pulling the values from the input that I had to squirrel away first via a [symbolic binding][symbolicbinding] to `$x`:

```jq
.filterFeatureGroup as $x
| $x
| keys 
| map("\(.): \($x[.][0])")
```

The string expression `"..."` includes the string interpolation construct (`\(...)`) to include the value of an expression.

This produced the right output:

```json
[
  "Deckkraft: Mittlere Deckkraft",
  "Grundfarbe: Grau",
  "Hauttyp: Normal",
  "Produkteigenschaften: Vegan",
  "Textur / Konsistenz / Applikation: Stift"
]
```

but felt a little cumbersome, and perhaps not idiomatic. Here are the problems I saw:

* having to regurgitate what was just captured (`.filterFeatureGroup as $x | $x`) felt a little clunky
* mapping over the keys and constructing a string for each one was OK, but the `$x[.][0]` bothered me a bit

## Subsequent approaches

I noticed that the output required values that exist as property names in the input: `Hauttyp`, `Deckkraft` and other values. More generally, when that is the case (as now) -- when property names are "values" -- my jq "antennae" are directed towards the [to_entries, from_entries, with_entries][toentries-fromentries-withentries] family. 

These functions convert back and forth between objects and arrays of key/value pairs, and in particular, `to_entries` will reshape an object so it's more straightforward programmatically to get at those property name values. Here's an example. If we have this input:

```json
{
  "name": "DJ Adams",
  "website": "https://qmacro.org"
}
```

then passing this through `to_entries` will produce this:

```json
[                                
  {                              
    "key": "name",               
    "value": "DJ Adams"          
  },                             
  {                              
    "key": "website",            
    "value": "https://qmacro.org"
  }                              
]
```

Now each of the property name values (`name` and `website` here) are addressable via a consistent property name `key`, across the objects that represent each of the original property name and value pairs.

Applying `to_entries` to the object which is the value of the `filterFeatureGroup` property, like this:

```jq
.filterFeatureGroup 
| to_entries
```

we get this:

```json
[
  {
    "key": "Hauttyp",
    "value": [
      "Normal"
    ]
  },
  {
    "key": "Deckkraft",
    "value": [
      "Mittlere Deckkraft"
    ]
  },
  {
    "key": "Grundfarbe",
    "value": [
      "Grau"
    ]
  },
  {
    "key": "Produkteigenschaften",
    "value": [
      "Vegan"
    ]
  },
  {
    "key": "Textur / Konsistenz / Applikation",
    "value": [
      "Stift"
    ]
  }
]
```

The data itself now feels a little more "pedestrian", perhaps, but it also feels a little easier to worth with because of that. 

The subsequent approaches are all based on this initial reshaping of the data.

### Second approach 

Given the ability to more easily and more directly (explicitly) access the first part of what's required in the output, I moved forward like this:

```jq
.filterFeatureGroup 
| to_entries
| map([.key, .value[0]])
```

This produced the following, which feels a little closer:

```json
[
  [
    "Hauttyp",
    "Normal"
  ],
  [
    "Deckkraft",
    "Mittlere Deckkraft"
  ],
  [
    "Grundfarbe",
    "Grau"
  ],
  [
    "Produkteigenschaften",
    "Vegan"
  ],
  [
    "Textur / Konsistenz / Applikation",
    "Stift"
  ]
]
```

I could then just map over these inner arrays and use [join][join] to create a string from the values in them, which I did, like this:

```jq
.filterFeatureGroup 
| to_entries
| map([.key, .value[0]])
| map(join(": "))
```

This produced the desired output:

```json
[
  "Hauttyp: Normal",
  "Deckkraft: Mittlere Deckkraft",
  "Grundfarbe: Grau",
  "Produkteigenschaften: Vegan",
  "Textur / Konsistenz / Applikation: Stift"
]
```

This approach felt a little better, not only because of the cleaner use of `to_entries` but also because I wasn't constructing a string manually with string interpolation (instead, using `join` with an array).

But there were a couple of new things that didn't feel quite right:

* I was using a sequence of two `map` calls; this feels OK to some extent, expecially in the context of more literate (or explicit) chains of functions in Ramda's [pipe](https://ramdajs.com/docs/#pipe) or [compose](https://ramdajs.com/docs/#compose) context (see [ES6, reduce and pipe](https://qmacro.org/blog/posts/2019/04/08/es6-reduce-and-pipe/) for an example) but perhaps it could be neater in jq
* the explicit use of the [array index][arrayindex] `[0]` to get the first (and only) values (such as `Normal` and `Grau`) out of each of the innermost arrays was OK but made me feel as though I could perhaps transform the input into something even cleaner and simpler earlier in the process

### Third approach

To address the point about the sequence of two `map` calls, it was just a matter of rearranging the construction so that the call to `join` was in the same loop, so it looked like this:

```jq
.filterFeatureGroup 
| to_entries
| map([.key, .value[0]] | join(": "))
```

This produces the same output:

```json
[
  "Hauttyp: Normal",
  "Deckkraft: Mittlere Deckkraft",
  "Grundfarbe: Grau",
  "Produkteigenschaften: Vegan",
  "Textur / Konsistenz / Applikation: Stift"
]
```

### Fourth approach

After addressing the `map` sequence issue, I was happy enough, but I wanted to go back to see if I could address the use of the `[0]` array index, by simplifying the data earlier in the filter pipeline. 

Examining the first entry in the now-simplified `filterFeatureGroup` object, like this:

```jq
.filterFeatureGroup | to_entries | first
```

we get this:

```json
{
  "key": "Hauttyp",
  "value": [
    "Normal"
  ]
}
```

What we really want from this particular entry is just the `Hauttyp` and `Normal` strings (to become `"Hauttyp: Normal"`). 

There's a function called [flatten][flatten] which, according to the manual, operates on arrays and does what you sort of expect it to do (again, jusing Ramda's [flatten](https://ramdajs.com/docs/#flatten) as a reference). Given an array such as `[1, [2, 3]]`, then `flatten` will produce this: `[1, 2, 3]`. 

What the manual doesn't mention is that it also operates, in a sensible way, on objects.  Given the object entry above, if we add `flatten` to the filter pipeline, like this:

```jq
.filterFeatureGroup | to_entries | first | flatten
```

we get this:

```json
[
  "Hauttyp",
  "Normal"
]
```

Nice! In a way, this for me feels like another philosopical approach that I also learned about in my Perl days (although it goes back way beyond that): [Do What I Mean](https://en.wikipedia.org/wiki/DWIM) also known as "DWIM". Given the data context and what `flatten` does in general, I'm not surprised at the result, and it's what I would want, or mean, when I invoke it on an object.

Given this, I can do away with a lot of the mechanics for extracting the values, and just write this:

```jq
.filterFeatureGroup
| to_entries
| map(flatten | join(": "))
```

I'm happy to report that this also produces the desired output:
```json
[
  "Hauttyp: Normal",
  "Deckkraft: Mittlere Deckkraft",
  "Grundfarbe: Grau",
  "Produkteigenschaften: Vegan",
  "Textur / Konsistenz / Applikation: Stift"
]
```

I think I like this approach the most.

## Wrapping up

Working through simple questions like this help me think about jq more, and as I do so, I learn to think more about data structures, which I did in Perl too, but I am learning also to think about how data structures change as they are sent through pipelines of filters.

Incidentally, the accepted answer is a combination of some of what I explored in this post:

```jq
.filterFeatureGroup | to_entries | map("\(.key): \(.value[0])")
```

Hopefully this has also helped you think a bit more about processing JSON with jq.


[keys]: https://stedolan.github.io/jq/manual/#keys,keys_unsorted
[symbolicbinding]: https://stedolan.github.io/jq/manual/#Variable/SymbolicBindingOperator:...as$identifier|...
[toentries-fromentries-withentries]: https://stedolan.github.io/jq/manual/#to_entries,from_entries,with_entries
[join]: https://stedolan.github.io/jq/manual/#join(str)
[arrayindex]: https://stedolan.github.io/jq/manual/#ArrayIndex:.[2]
[flatten]: https://stedolan.github.io/jq/manual/#flatten,flatten(depth)
