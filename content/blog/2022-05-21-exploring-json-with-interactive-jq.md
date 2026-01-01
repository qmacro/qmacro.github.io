---
date: 2022-05-21
title: Exploring JSON with interactive jq
tags:
  - jq
  - ijq
  - json
---
I often use ijq, or "interactive jq", to explore JSON, and also to improve my jq fu, because it gives me immediate visual feedback. Here's an example.

There's a wrapper around `jq` called [ijq](https://sr.ht/~gpanders/ijq/) (short for "interactive jq") which is a bit like a REPL in that it affords immediate feedback. It's a lovely program, and I use it a lot.

Yesterday I [shared a short video](/tweets/qmacro/status/1527678770454331392/) of an example of how it can be used to explore a JSON dataset and I thought I'd give that example a more permanent home here on the blog.

![ijq in action](/images/2022/05/ijq.gif)

(There's an [asciinema version of this](https://asciinema.org/a/496082) too).

In practising a little `jq`, I thought I'd use it to find out the most common city in the [Customers and Suppliers by Cities](https://services.odata.org/v4/northwind/northwind.svc/Customer_and_Suppliers_by_Cities) entityset in the V4 Northwind service.

This is the invocation I ended up with:

```jq
.value
| group_by(.City)
| map([length, first.City])
| sort_by(.[0])
| reverse
| first[1]
```

Here's a brief breakdown of the invocation I ended up with:

* `.value` gives me the entire array of objects in the dataset, each one of which represents a customer or supplier in a city
* `group_by(...)` collects array elements together that have the same path expression specified (in this case the `City` property), producing an array of arrays
* `map(...)` is much like `map` in other languages, in that it will apply the function or filter given to the input array, producing a new array
* `[length, first.City]` uses the array constructor (`[...]`) to produce an array of two elements, the first being the length of the input (the inner array containing the same-city grouped objects) and the value of the `City` property for the `first` element in that array\*
* `sort_by(...)` sorts the input array (which is now the one with length-and-city name elements) by the first item (`.[0]`), i.e. by the length
* `reverse` simply reverses the order of the items of the array
* `first[1]` then this picks the second item (`[1]`) of the first element, which after the reverse-sort will be the length-and-city pair with the highest length

\*during the interactive session, I'd just guessed that there would be a `first` function, and there was!

For those of you wondering, I deliberately chose to reverse the list before picking out the first element, so the element would be at the top and therefore visible in `ijq`'s output window:

```jq
| sort_by(.[0])
| reverse
| first[1]
```

But I could have just as well done this:

```jq
| sort_by(.[0])
| last[1]
```

As a kind fellow rightly pointed out in the comments to my previous post [JSON object values into CSV with jq](/blog/posts/2022/05/19/json-object-values-into-csv-with-jq/) - TIMTOWTDI, or "there is more than one way to do it", an adage from the Perl community.
