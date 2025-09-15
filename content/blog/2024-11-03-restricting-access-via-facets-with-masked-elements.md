---
title: Restricting access via facets with masked elements
date: 2024-11-03
tags:
  - cds
  - cap
  - tasc
  - gems
---
Watching [the inaugural episode of The Art & Science of CAP][1], in particular around 39 mins in, Daniel was showing an example of a projection where some of the details of the entity -- upon which the projection was being made -- were deliberately restricted.

Here's the example:

```cds
@readonly entity Books as projection on my.Books { *,
  author.name as author
} excluding { createdBy, modifiedBy };
```

> In terminology terms, the `Books` entity being defined here is called a facet.

There are three details that qualify the projection.

Taking the last one first i.e. the `excluding { ... }` clause, this is straightforward and explicitly excludes two elements from the facet. Perhaps the interesting thing here is the fact that these elements come from the `managed` aspect which has been mixed in to the `Books` entity definition (`entity Books : managed { ... }`).

Then there's the `*` inside the signature[<sup>1</sup>](#footnotes) which does what we expect it to do - include all the elements from the projectee `My.Books`. Perhaps the interesting thing here is that this on its own (`{ * }`) would be unnecessary (i.e. implicit in just `... as projection on my.Books;`) except for the fact that we want to modify that list of elements, using the last detail.

The last detail is `author.name as author`, requiring the `{ * }` part to ensure the rest of the elements are included alongside this one. Definitely the most interesting thing here is that this is a really neat way of restricting access to the author details via the association that the `author` element is defined as in the entity. By "clobbering", or simply "masking" that `author` association with a new definition (`author.name`) which points to the `name` element from the target of the association (the `Authors` entity), the job is done in one simple redefinition.

This is lovely, and even simpler than the example in the [Exposed Entities][2] part of the section on CDL in Capire:

```cds
service CatalogService {
  entity Product as projection on data.Products {
    *, created.at as since
  } excluding { created };
}
```

In this `Products` projection example, the `created` element is explicitly excluded, rather than being "clobbered", and a new element `since` is declared instead, referencing `created.at`.

In case you're wondering, `created` is an element from the `ManagedObject` aspect shown earlier in the CDL section:

```cds
aspect ManagedObject {
  created { at: Timestamp; _by: User };
}
```

So in contrast to the `author` example, this is the masking of details from a structured type. And even here there's something of interest - this structured type is an anonymous inline one, and is the equivalent of:

```cds
type Created {
  at  : Timestamp;
  _by : User;
}

aspect ManagedObject {
  created : Created;
}
```

So there you have it. Always something interesting to observe!

<a name="footnotes"></a>
## Footnotes

1) I think that's the right term for the `{ ... }` following a projection declaration - let me know if you think it's called something else.

[1]: https://www.youtube.com/watch?v=XMchiFnDJ6E
[2]: https://cap.cloud.sap/docs/cds/cdl#exposed-entities
