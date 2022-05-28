---
layout: post
title: Multiple level filters in jq
tags:
  - jq
  - odata
---
Here's another note-to-self on using jq to shape JSON representations of OData to match what's returned using system query options. Thsi time it's all filtering at two levels.

In the [Back to basics: OData - the Open Data Protocol - Part 3 - System query options](https://www.youtube.com/watch?v=Bln2A0_OauY&list=PL6RpkC85SLQABOpzhd7WI-hMpy99PxUo0&index=3) live stream last Friday we looked at OData's system query options.

There was a question at the end about whether it was possible to use the `$filter` system query option at multiple levels, in an `$expand` context. I wrote up the question, and a detailed answer (summary: yes) with an example here: [Can $filter be applied at multiple levels in an expand?](https://github.com/SAP-samples/odata-basics-handsonsapdev/issues/8).

I thought this would be another good opportunity to practise a bit of `jq` this Saturday late morning, so wondered what a `jq` filter would look like, one that would produce the same result as in the answer's example (showing suppliers only from the UK, and only including their products that were low in stock).

The OData URL for this request looks like this:

```
http://localhost:4004/northwind-model/Suppliers
  ?$filter=Country eq 'UK'
  &$expand=Products($filter=UnitsInStock le 15)
```

It turned out to be pretty simple. First, I grabbed the basic data:

```bash
curl \
  'http://localhost:8000/northwind-model/Suppliers?$expand=Products' \
  > data.json
```

> Incidentally, here's another example of the power of OData, being able to fetch data from related resources, in the same single request (see [Nonsense! Absolute nonsense!](https://www.youtube.com/clip/Ugkxp6b9vNpSL44Xd9JevC7zmG5Tj9VOCLTq) for a deliberately provocative take on how some folks are so attracted to shiny new things they ignore what is already there).

Then I loaded it into [ijq](https://sr.ht/~gpanders/ijq/), the lovely interactive frontend to `jq`, and played around a bit.

Here's what I ended up with:

```jq
.value
| map(
    select(.Country == "UK")
    | .Products |= map(
        select(.UnitsInStock <= 15)
      )
  )
```

Breaking this down, we have:

* `.value` gives me the entire array of objects in the dataset, each one of which represents a supplier with all their products
* `map(...)` this outer `map` takes the array of supplier and product data and produces a new array, having processed each array element (each supplier with their products) with the filter expression supplied
* `select(.Country == "UK")` this is the equivalent of the `$filter=Country eq UK` in the OData URL
* `.Products |= map(...)` the result of the previous `select` (i.e. each supplier that is in the UK) is then passed to this expression which uses the [update assignment][manual-update-assignment] (`|=`) to produce a modified version of the value of the `Products` property
* `select(.UnitsInStock <= 15)` the value of the `Products` property is an array, because the [navigation property](https://github.com/SAP-samples/odata-basics-handsonsapdev/blob/8347ca89ad75df111b3ab05c245da840762398b4/db/schema.cds#L29) between the `Suppliers` and `Products` entity types is defined as a one-to-many. This means it's appropriate to use another `select` filter to pick out specific elements (those with a value of 15 or less for the `UnitsInStock`). This is the equivalent of the `Products($filter=UnitsInStock le 15)` part of the OData URL

One thing to note here is that there's a single outer `map`, the processing within which not only filters the suppliers, but subsequently filters the products of the (reduced number of) suppliers, in one pass.

Anyway, that's pretty much it for this note-to-self. I think it's time for an early afternoon beer at [Browtons](https://twitter.com/browtons). Cheers.

[manual-update-assignment]: https://stedolan.github.io/jq/manual/#Update-assignment:|=
