---
layout: post
title: Recognising patterns and embracing the stream
date: 2023-04-09
tags:
  - jq
  - patterns
---
I've been listening to discussions on [Conor Hoekstra](https://bird.makeup/@code_report)'s [Array Cast](https://www.arraycast.com/episodes) podcast and [ADSP: The Podcast](https://t.co/uijuAszeFw) and watching some of the content on [his YouTube channel](https://www.youtube.com/@code_report), all of which I can highly recommend. While I don't understand everything that's being discussed, I do still enjoy and benefit from the content. One of the many recurring themes seems to be recognising patterns, being aware of what is being expressed, and thinking about whether there's an alternative way to do so, for simplicity, clarity, performance or other reasons.

I was happy to be able to recognise a pattern in a tiny submission I made this evening to a repo of [different language based implementations of a simple LED number display](https://github.com/atejada/led_numbers#led_numbers) from [Blag](https://twitter.com/Blag), an old friend of mine from the SAP world.

## The initial contribution

I wanted to contribute a jq version of the LED number display program for the repo, as it didn't have one. The first commit in my pull request contained a working version, which was this:

```jq
def segments: [
  [" _ ", "| |", "|_|"],
  ["   ", "  |", "  |"],
  [" _ ", " _|", "|_ "],
  [" _ ", " _|", " _|"],
  ["   ", "|_|", "  |"],
  [" _ ", "|_ ", " _|"],
  ["   ", "|_ ", "|_|"],
  [" _ ", "  |", "  |"],
  [" _ ", "|_|", "|_|"],
  [" _ ", "|_|", "  |"]
];

def digits: tostring | split("")[] | tonumber;

[segments[digits]] | transpose | map(join(""))[]
```

This was to be invoked like this:

```bash
echo 42 | jq -r -f led_numbers.jq
```

which would produce:

```text
    _
|_| _|
  ||_
```

## An explanation

By way of explanation, assuming we have the two function definitions (`segments` and `digits`) already, then:

```jq
segments[digits]
```

would produce:

```json
[
  "   ",
  "|_|",
  "  |"
]
[
  " _ ",
  " _|",
  "|_ "
]
```

One way of getting the "horizontal slices" of these LED numbers joined up onto the appropriate lines of output is to treat it as a matrix (in Conor & co's language I might use the term "rank 2") and transpose it. 

So I wrapped this stream of arrays in an outer array with the [array construction](https://stedolan.github.io/jq/manual/#Arrayconstruction:[]) syntax `[]`:

```jq
[segments[digits]]
```

which gave me:

```json
[
  [
    "   ",
    "|_|",
    "  |"
  ]
  [
    " _ ",
    " _|",
    "|_ "
  ]
]
```

which I could then transpose, which I did like this:

```jq
[segments[digits]] | transpose
```

resulting in:

```json
[
  [
    "   ",
    " _ "
  ],
  [
    "|_|",
    " _|"
  ],
  [
    "  |",
    "|_ "
  ]
]
```

These subarrays were now ready for joining together as longer strings:

```jq
[segments[digits]] | transpose | map(join(""))
```

with the following result:

```json
[
  "    _ ",
  "|_| _|",
  "  ||_ "
]
```

But I just wanted the plain strings, rather than have then enclosed in an array, so I used the [array iterator](https://stedolan.github.io/jq/manual/#Array/ObjectValueIterator:.[]) to do that:

```json
[segments[digits]] | transpose | map(join(""))[]
```

which gave me what I was looking for (remember that the `-r` raw output is still being used), so a stream of strings is output but without the enclosing double quotes):

```text
    _
|_| _|
  ||_
```

Great!

This was what I send in [the first commit](https://github.com/atejada/led_numbers/pull/1/commits/e6e3e5c3196aa436f865446a1c99ba4b87380eba) in the pull request.

## Recognising the pattern

But the solution looked a little noisy, and after staring at it for a few seconds I realised that it was the last part that was bothering me:

```jq
map(join(""))[]
```

The pattern is: `map(...)[]`. If I didn't want to keep the array shape, then why bother with the `map` in the first place? It appeared to me that I could replace this with just the expression that I'd put inside the parentheses, in this case just the `join("")`.

## An improvement

The only thing I had to do then, to allow the use of this pattern switch, was to embrace jq's natural streaming nature, and basically start streaming earlier in the pipeline, by using the array iterator directly on the output from `transpose`, like this:

```jq
[segments[digits]] | transpose[]
```

This returns something similar to what we saw `transpose` return earlier, but instead of a single value (an array of arrays of strings), it just returns a stream of the arrays of strings:

```json
[
  "   ",
  " _ "
],
[
  "|_|",
  " _|"
],
[
  "  |",
  "|_ "
]
```

Then, each of these three array values are passed downstream, where I then only need the expression that was hitherto inside the `map(...)[]` construct, i.e.:

```jq
[segments[digits]] | transpose[] | join("")
```

This indeed gave me the same result which I wanted:

```text
    _
|_| _|
  ||_
```

This version feels more idiomatic, and I updated the line to look like this in [the second commit](https://github.com/atejada/led_numbers/pull/1/commits/5f243bc76b83566a0b1a70dfa5668d49ce496a67) in the pull request.

Thanks to Conor and his cohorts for helping me remember to look for patterns!
