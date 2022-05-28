---
layout: post
title: Products by supplier in OData and jq
tags:
  - jq
  - odata
---
This is more of a note-to-self. I'm enjoying comparing resource requests in OData with the equivalent shaping with `jq`. Here's a simple example.

With the [Northwind OData v4 service](https://services.odata.org/v4/northwind/northwind.svc/) there are [Products](https://services.odata.org/v4/northwind/northwind.svc/Products) and [Suppliers](https://services.odata.org/v4/northwind/northwind.svc/). As an easy exercise I want to create a list of products by supplier.

## With OData

With OData it's easy to follow the `Products` navigation property in the `Supplier` entity type (see the [metadata](https://services.odata.org/v4/northwind/northwind.svc/$metadata) for more info) to the `Product` entity type.

With an OData QUERY operation it's straightforward, using the `$expand` and `$select` system query options (with extra whitespace for readability):

```text
https://services.odata.org
  /v4/northwind/northwind.svc/Suppliers
  ?$expand=Products($select=ProductName)
  &$select=CompanyName
```

You can [try out this OData request directly](https://services.odata.org/v4/northwind/northwind.svc/Suppliers?$expand=Products($select=ProductName)&$select=CompanyName), and the JSON representation in the response looks something like this (shortened to the first two suppliers for brevity):

```json
{
  "@odata.context": "https://services.odata.org/V4/Northwind/Northwind.svc/$metadata#Suppliers(CompanyName,Products,Products(ProductName))",
  "value": [
    {
      "CompanyName": "Exotic Liquids",
      "Products": [
        {
          "ProductName": "Chai"
        },
        {
          "ProductName": "Chang"
        },
        {
          "ProductName": "Aniseed Syrup"
        }
      ]
    },
    {
      "CompanyName": "New Orleans Cajun Delights",
      "Products": [
        {
          "ProductName": "Chef Anton's Cajun Seasoning"
        },
        {
          "ProductName": "Chef Anton's Gumbo Mix"
        },
        {
          "ProductName": "Louisiana Fiery Hot Pepper Sauce"
        },
        {
          "ProductName": "Louisiana Hot Spiced Okra"
        }
      ]
    }
  ]
}
```

## With jq

How might we do this in `jq`? Let's see. First, let's grab some JSON data. To make it a little more interesting (i.e. without going directly to the supplier grouping) we'll start with the `Products` entityset and expand the `Supplier` navigation property like [this](https://services.odata.org/v4/northwind/northwind.svc/Products?$expand=Supplier):

```text
https://services.odata.org
  /v4/northwind/northwind.svc/Products
  ?$expand=Supplier
```

(Note for this simple example, I won't bother trying to consume all of the products by following the `@odata.nextLink`s).

This gives a nice structure that we can dig into with `jq`. It turns out to be quite simple, especially in the context of the recent process I followed in [Exploring JSON with interactive jq](https://qmacro.org/blog/posts/2022/05/21/exploring-json-with-interactive-jq/).

Being an OData v4 entityset, the data is in the top level `value` property, so we start with that, grouping by the ID of each product's supplier:

```jq
.value
| group_by(.SupplierID)
```

Then all we need to do is to reshape the resulting array, via `map`, to product an object for each supplier, with a list of products:

```jq
.value
| group_by(.SupplierID)
| map(
    {
      CompanyName: first.Supplier.CompanyName,
      Products: [.[].ProductName]
    }
  )
```

Here's a screenshot of this `jq` invocation in action, against the OData JSON representation retrieved with the URL above.

![products by supplier](/images/2022/05/ijq-products-by-supplier.png)

You can see the results of the `jq` filter, producing what we want (reduced for brevity):

```json
[
  {
    "CompanyName": "Exotic Liquids",
    "Products": [
      "Chai",
      "Chang",
      "Aniseed Syrup"
    ]
  },
  {
    "CompanyName": "New Orleans Cajun Delights",
    "Products": [
      "Chef Anton's Cajun Seasoning",
      "Chef Anton's Gumbo Mix"
    ]
  },
  {
    "CompanyName": "Grandma Kelly's Homestead",
    "Products": [
      "Grandma's Boysenberry Spread",
      "Uncle Bob's Organic Dried Pears",
      "Northwoods Cranberry Sauce"
    ]
  }
]
```

You can examine how this works yourself [courtesy of jq play](https://jqplay.org/s/ldrVNmwLbF7).

Note: If we wanted to create the same shape as the OData output, with each product name as a value for a `ProductName` property, this would just need a small change:

```jq
.value
| group_by(.SupplierID)
| map(
    {
      CompanyName: first.Supplier.CompanyName,
      Products: map({ProductName})
    }
  )
```

This works because of the shortcut syntax available for `jq`'s [object construction](https://stedolan.github.io/jq/manual/#ObjectConstruction:{}) (`{...}`) which is simply to use the name of the property (and you don't even need quotes):

```jq
{ProductName}
```

is the same as:

```jq
{"ProductName": .ProductName}
```
