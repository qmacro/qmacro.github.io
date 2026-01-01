---
date: 2022-06-16
title: Summing and grouping values with jq
tags:
  - jq
  - odata
---
Here's yet another note-to-self on using jq, this time to transform a flat list of order totals and dates into a summary of total order values by year.

In doing some research for an [upcoming live stream](https://qmacro.org/talks/#odata-basics-4-all-things-filter) I was looking at the [Northwind OData v4 service](https://services.odata.org/v4/northwind/northwind.svc/) and in particular at the [Summary_of_Sales_by_Years](https://services.odata.org/v4/northwind/northwind.svc/Summary_of_Sales_by_Years) entity set. It is not what I initially expected; rather than be a summary of sales by year, it was a list of orders each with a shipping date, order ID and order total. There are [over 800](https://services.odata.org/v4/northwind/northwind.svc/Summary_of_Sales_by_Years/$count) entries, and I grabbed all of them and stored them in a single JSON file `Summary_of_Sales_by_Years.json` using a Bash shell script [slurp](https://github.com/SAP-samples/odata-basics-handsonsapdev/blob/ecf9f4f4c378428e936dfbd80bbcefcaebfbfb8b/bin/slurp) that auto-follows the [@odata.nextLink annotation](http://docs.oasis-open.org/odata/odata-json-format/v4.0/errata03/os/odata-json-format-v4.0-errata03-os-complete.html#_Toc453766632) trail on each chunk response.

I wanted to group the list by year and get grand totals for each year. This blog post describes how I went about it, and also describes a sort of preparation stage too where I created an initially much smaller dataset to experiment with.

I've created snippets on [jqplay](https://jqplay.org) for each of the stages here - you'll see the links at the relevant points in this post.

## Preparing the sample data

For the sake of brevity in this post, I cut the data down to just 6 entries, two for each of the years represented (1996, 1997 and 1998). I did this with `jq` too, redirecting the output into a new file `subset.json`, thus:

```bash
jq \
  '.value |= (
    group_by(.ShippedDate[:4])
    | map(.[:2])
    | flatten
  )' \
  Summary_of_Sales_by_Years.json \
  > subset.json
```

This resulted in the following content in `subset.json`, which I can now use to more easily illustrate the summing and grouping.

```json
{
  "value": [
    {
      "ShippedDate": "1996-07-16T00:00:00Z",
      "OrderID": 10248,
      "Subtotal": 440
    },
    {
      "ShippedDate": "1996-07-10T00:00:00Z",
      "OrderID": 10249,
      "Subtotal": 1863.4
    },
    {
      "ShippedDate": "1997-01-16T00:00:00Z",
      "OrderID": 10380,
      "Subtotal": 1313.82
    },
    {
      "ShippedDate": "1997-01-01T00:00:00Z",
      "OrderID": 10392,
      "Subtotal": 1440
    },
    {
      "ShippedDate": "1998-01-02T00:00:00Z",
      "OrderID": 10771,
      "Subtotal": 344
    },
    {
      "ShippedDate": "1998-01-21T00:00:00Z",
      "OrderID": 10777,
      "Subtotal": 224
    }
  ]
}
```

Before we move on, let's briefly examine the `jq` used to produce this.

### Examining the preparation phase

Here's that `jq` program again:

```jq
.value |= (
  group_by(.ShippedDate[:4])
  | map(.[:2])
  | flatten
)
```

First, there's this construct: `.value |= (...)`. The `|=` is the [update assignment][manual-update-assignment] operator and whatever the filter on the right hand side produces becomes the new value for the `value` property. The parentheses in this particular instance ensure that the output from the entire expression within is used. It's needed here because the expression contains pipes (`|`) which would otherwise short circuit.

With `group_by(.ShippedDate[:4])` the [group_by][manual-groupby] function collects objects by the `ShippedDate` property - but not the entire property value, just the first four characters, which represent the year, for example "1996" in "1996-07-16T00:00:00Z" (there's the `strptime` function too, which will parse a date into its component parts, but knowledge of the data and laziness won through here). Note that the `[:4]` construct (which is short for `[0:4]`) is the [array/string slice][manual-array-string-slice] filter operating on a string value in this case, which will return a substring.

The use of `group_by` produces an array of arrays, with one subarray for each year.

This is then piped into `map(.[:2])`. The `[:2]` (again, short for `[0:2]`) is the array/string slice filter again, but this time, it's operating on an array rather than a string. I'm using `map` to run the filter `.[:2]` against each element of the input array, which contains a subarray for each of the years. And the `.[:2]` filter, in an array context, will return the first two elements.

The result of this is still an array of arrays, but now each subarray has only two objects each. Now they can all be merged, i.e. taken out of their respective subarrays and collected together. This is done with the [flatten][manual-flatten] filter.

▶ You can see how this `jq` program reduces the input data to the subset in this jqplay snippet: [Initial input data reduction](https://jqplay.org/s/7fwbQqvjluG).

## Producing the totals by year

So, (now based on the subset of data above), what I actually want is a summary of total order value for each year, something like this:

```json
[
  [
    "1996",
    2303
  ],
  [
    "1997",
    2753
  ],
  [
    "1998",
    568
  ]
]
```

### Grouping by year

It makes sense that the approach required will also employ the [group_by][manual-groupby] function as we want total order values for each year, and we can determine the years in the same way as we've seen in the preparation stage, i.e. with the [array/string slice][manual-array-string-slice] filter (`[:4]`).

Let's start to explore:

```bash
jq \
  '.value
  | group_by(.ShippedDate[:4])' \
  subset.json
```

```json
[
  [
    {
      "ShippedDate": "1996-07-16T00:00:00Z",
      "OrderID": 10248,
      "Subtotal": 440
    },
    {
      "ShippedDate": "1996-07-10T00:00:00Z",
      "OrderID": 10249,
      "Subtotal": 1863.4
    }
  ],
  [
    {
      "ShippedDate": "1997-01-16T00:00:00Z",
      "OrderID": 10380,
      "Subtotal": 1313.82
    },
    {
      "ShippedDate": "1997-01-01T00:00:00Z",
      "OrderID": 10392,
      "Subtotal": 1440
    }
  ],
  [
    {
      "ShippedDate": "1998-01-02T00:00:00Z",
      "OrderID": 10771,
      "Subtotal": 344
    },
    {
      "ShippedDate": "1998-01-21T00:00:00Z",
      "OrderID": 10777,
      "Subtotal": 224
    }
  ]
]
```

This is a nice illustration of the array of arrays structure we talked about earlier. There's a subarray for the objects for each year.

### Totalling the values

Now the data is in the right "shape", it's time to focus on summing the `Subtotal` values within each subarray.

```bash
jq \
  '.value
  | group_by(.ShippedDate[:4])
  | map(map(.Subtotal))' \
  subset.json
```

This produces the following:

```bash
[
  [
    440,
    1863.4
  ],
  [
    1313.82,
    1440
  ],
  [
    344,
    224
  ]
]
```

Note the nested calls to `map`, i.e. `map(map(...)`. This is because the outer `map` processes the outer array, and passes each element (each of which are also arrays - the by-year subarrays) to the function specified, which is also `map`, which processes (in turn) each inner array, which contain the objects. The simple filter `.Subtotal` will just return the value of the `Subtotal` property, so we see a list of lists of subtotals, remembering that we've got two for each of the three years.

So we have an array of arrays of subtotal values. As a next step let's add these grouped subtotal values together, using [add][manual-add] (which is a filter that operates on arrays). While we're at it, we'll use [floor][manual-floor] to hard round down to the nearest whole number:

```bash
jq \
  '.value
  | group_by(.ShippedDate[:4])
  | map(map(.Subtotal) | add | floor)' \
  subset.json
```

This produces the following:

```bash
[
  2303,
  2753,
  568
]
```

### Adding the year

Almost there - but it's not that useful without the year. To get the structure we want, which is an array of arrays each containing the year and total, we'll need to add the year, and enclose that, with the total, in an array:

```bash
jq \
  '.value
  | group_by(.ShippedDate[:4])
  | map([
      first.ShippedDate[:4],
      (map(.Subtotal) | add | floor)
    ])' \
  subset.json
```

We've expanded what's passed to the outer `map` function to the following:

```jq
[
  first.ShippedDate[:4],
  (map(.Subtotal) | add | floor)
]
```

What's happening here is that we're using [array construction](https://stedolan.github.io/jq/manual/#Arrayconstruction:[]) (`[...]`) to produce an array, with two elements, starting with the value of `first.ShippedDate[:4]`.

Each of the expressions in this array construction receives an array (one of the year-specific subarrays), but for our first element we only want the value from one of the elements in the incoming array, so we can use the [first][manual-first-last-nth] function to do that. This is a lovely bit of syntactic sugar through a definition, along with definitions for its siblings `last` and `nth`, in [builtin.jq](https://github.com/stedolan/jq/blob/a9f97e9e61a910a374a5d768244e8ad63f407d3e/src/builtin.jq#L187-L189):

```jq
def first: .[0];
def last: .[-1];
def nth($n): .[$n];
```

I'm tempted to want to define another function `rest` thus:

```jq
def rest: .[1:length];
```

See [The beauty of recursion and list machinery](/blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/) for why - in particular, a slight obsession about `x:xs`, first and rest, head and tail, and so on.

But I digress.

The second element in the constructed array, i.e. `(map(.Subtotal) | add | floor)`, is the same as before, except that it's now surrounded in parentheses to ensure the whole thing is evaluated in one go (specifically, so that it's only the `map(.Subtotal)` that gets passed through those pipes to `add` and `floor`, and not anything else).

So this is where we've ended up:

```bash
jq \
  '.value
  | group_by(.ShippedDate[:4])
  | map([
      first.ShippedDate[:4],
      (map(.Subtotal) | add | floor)
    ])' \
  subset.json
```

Running this produces the desired result:

```json
[
  [
    "1996",
    2303
  ],
  [
    "1997",
    2753
  ],
  [
    "1998",
    568
  ]
]
```

Very nice!

▶ You can see how this result is achieved in this jqplay snippet: [Producing the 'array' style final result](https://jqplay.org/s/TRVd7ttVjmc).

### An alternative result structure

As alternative way of representing the totals by year, and knowing that the year values are stable enough to be property names in objects, we could instead go for something like this:

```json
{
  "1996": 2303,
  "1997": 2753,
  "1998": 568
}
```

To get this, it's not much of a departure from what we previously ended up with. First, instead of using array construction (`[...]`) we can use [object construction][manual-object-construction]. As expected, we need to specify the property name and value, in this form:

```
property: value
```

Let's make that change, noting that because the expression for the property (the key) is not "identifier-like", i.e. it's an expression to be evaluated, we need to enclose it in parentheses like this: `(first.ShippedDate[:4])`. Here we go:

```bash
jq \
  '.value
  | group_by(.ShippedDate[:4])
  | map({
      (first.ShippedDate[:4]): map(.Subtotal)|add|floor
    })' \
  subset.json
```

This produces almost but not quite what we want:

```bash
[
  {
    "1996": 2303
  },
  {
    "1997": 2753
  },
  {
    "1998": 568
  }
]
```

But that's OK, because the more you get the feel for how `jq` behaves, the more you'll likely guess that there'll be a simple way to merge these objects. And there is - the versatile [add][manual-add] filter. We've used `add` already to sum up an array of numeric values (the subtotals) but "adding" an array of objects together merges them.

So let's pipe the output of the `map({...})` into add:

```bash
jq \
  '.value
  | group_by(.ShippedDate[:4])
  | map({
      (first.ShippedDate[:4]): map(.Subtotal)|add|floor
    }) | add' \
  subset.json
```

This merges the three year:total pairs from the three objects into a single object, and thus gives us what we want:

```json
{
  "1996": 2303,
  "1997": 2753,
  "1998": 568
}
```

Lovely!

▶ You can see how this alternative result is achieved in this jqplay snippet: [Producing the 'array' style final result](https://jqplay.org/s/LJzeX3oH64M).

## Summing up

This turned out (again) to be a slightly longer post than expected, but in writing it, and in manipulating the source data, I've learned more about `jq`. So that's a result. I hope this helps you too.


[manual-groupby]: https://stedolan.github.io/jq/manual/#group_by(path_expression)
[manual-array-string-slice]: https://stedolan.github.io/jq/manual/#Array/StringSlice:.[10:15]
[manual-flatten]: https://stedolan.github.io/jq/manual/#flatten,flatten(depth)
[manual-add]: https://stedolan.github.io/jq/manual/#add
[manual-floor]: https://stedolan.github.io/jq/manual/#floor
[manual-array-construction]: https://stedolan.github.io/jq/manual/#Arrayconstruction:[]
[manual-object-construction]: https://stedolan.github.io/jq/manual/#Objectconstruction:[]
[manual-first-last-nth]: https://stedolan.github.io/jq/manual/#first,last,nth(n)
[manual-update-assignment]: https://stedolan.github.io/jq/manual/#Update-assignment:|=
