---
title: Local-first dev with CAP Node.js - mocking data
date: 2026-05-11
tags:
  - cap
  - data
  - mocking
  - local
description: In this post I provider a taster of what's possible regarding mock data in CAP Node.js local-first development.
---

This post is one of [a series on local-first development with CAP
Node.js](/blog/posts/2026/05/11/local-first-dev-with-cap-node-js/).

## Initial, test and sample data - terminology

Mocking data is likely the most common and useful of the various local-first
development mechanisms that provide mock facilities.

Before we start digging in, it's worth spending a minute on terminology used in
the CAP development ecosphere in general and in Capire in particular.

There are three terms widely used in the context of mocking data: "initial", "test"
and "sample".

### Initial data

This is real data that is intended for use beyond development. In other words,
it's data that will be deployed not only in development but also in production
scenarios. Conventionally, initial data is placed in a `data/` directory within
the `db/` directory.

### Test data

This is data for development and testing only. It is data that is not intended
for production. Conventionally, test data is placed in a `data/` directory
within a `test/` directory in the project, and will not be deployed in
non-development scenarios.

### Sample data

Unlike "initial" or "test", "sample" is a looser term that is not specifically
recognised in Capire. However, it's implicitly part of the local-first
development approach in that it refers to data that is provided in the context
of a sample application or service, which itself is not intended for
production.

In other words, what we might refer to as sample data is normally found in the
same place as initial data, i.e. typically in a `db/data/` directory, but won't
make it to production because the entire project will never be deployed there.

An example of sample data is the set of files in the
[db/data/](https://github.com/capire/bookshop/tree/main/db/data) directory in
the [@capire/bookshop](https://github.com/capire/bookshop/) sample.

## Understanding the mock data structure

Following CAP's strong [convention over
configuration](https://github.com/qmacro/capref/blob/main/axioms/AXI003.md)
approach, which is especially useful in development mode, mock data is, by
default:

- in CSV format
- organised into files, one per entity

and the contents (of all types) are automatically deployed to the database in
development mode.

The file names are normally based on the entity's scope and name. For example,
given the `db/schema.cds` content in the aforementioned `@capire/bookshop`
sample:

```cds
using { Currency, cuid, managed, sap } from '@sap/cds/common';
namespace sap.capire.bookshop;

entity Books : managed {

  ...

}
```

then the [corresponding mock data file for this
entity](https://github.com/capire/bookshop/blob/main/db/data/sap.capire.bookshop-Books.csv)
is:

```text
db/data/sap.capire.bookshop-Books.csv
```

Its location suggests that it is initial data, but the fact that it's a sample
app suggests that we can consider it sample data here.

## Working through an example

In this post, we'll work through an example of mocking data, based on content
in the
[data/](https://github.com/qmacro/cap-nodejs-local-first-development/tree/main/data)
directory of the
[repo](https://github.com/qmacro/cap-nodejs-local-first-development/) set up
for the related talk.

This directory contains a simplified "Northwind" sample with three entities
`Products`, `Suppliers` and `Categories` in a `db/schema.cds` file, exposed in
a simple service in `srv/main.cds`:

```cds
using northwind from '../db/schema';

@rest  @path: '/northbreeze'
service northbreeze {

  entity Products   as projection on northwind.Products;
  entity Suppliers  as projection on northwind.Suppliers;
  entity Categories as projection on northwind.Categories;

}
```

> To keep things even simpler, this service has been annotated with `@rest` for
> a simpler HTTP API surface[<sup>1</sup>](#footnotes).

### Starting the server

Starting a CAP server in development mode with `cds watch`, we see:

```log
[cds] - connect to db > sqlite { url: ':memory:' }
/> successfully deployed to in-memory database.
```

This tells us that the Data Definition Language (DDL) statements for the
tables and views have been deployed.

But by following the links via <http://localhost:4004>, such as <http://localhost:4004/northbreeze/Products>, we see there is no data.

### Creating initial data files

We can add the "data" facet to the project to generate initial data files, which will have the right names, be put in the right place, and have CSV header lines that reflect the entity structures.

Let's do that now, with:

```bash
cds add data
```

This emits:

```log
Adding facet: data
adding headers only, use --records to create random entries
  creating db/data/northwind-Categories.csv
  creating db/data/northwind-Products.csv
  creating db/data/northwind-Suppliers.csv

Successfully added features to your project
```

Let's check the CSV headers:

```bash
head db/data/*
```

This should show something like this:

```log
==> db/data/northwind-Categories.csv <==
CategoryID,CategoryName,Description

==> db/data/northwind-Products.csv <==
ProductID,ProductName,QuantityPerUnit,UnitPrice,Category_CategoryID,Supplier_SupplierID,UnitsInStock,UnitsOnOrder,ReorderLevel,Discontinued

==> db/data/northwind-Suppliers.csv <==
SupplierID,CompanyName,ContactName,ContactTitle,Address,City,Region,PostalCode,Country,Phone,Fax,HomePage
```

It's a great starting point if we want to add our own data records manually.

### Adding generated data

But what if we wanted to get started with mock data even quicker? With the
`--records` option, we can have "random" records generated for us. Let's try
that now, using also the `--force` option to ensure the CSV files are created
anew:

```bash
cds \
  add data \
  --records 3 \
  --force
```

While the generated data is largely random (as the output above already
mentioned), note that relationships are honoured, and foreign keys are
generated appropriately for some (not all) entities so that we can immediately
try following such relationships.

For example, we can explore the relationships with this OData style URL
construct
<http://localhost:4004/northbreeze/Suppliers?$select=CompanyName&$expand=Products($select=ProductName;$expand=Category)>
which will produce something like this:

```json
[
  {
    "CompanyName": "CompanyName-18484714",
    "Products": [
      {
        "Category": {
          "CategoryID": 13848306,
          "CategoryName": "CategoryName-13848306",
          "Description": "Description-13848306"
        },
        "ProductName": "ProductName-16110827"
      },
      {
        "Category": {
          "CategoryID": 13848306,
          "CategoryName": "CategoryName-13848306",
          "Description": "Description-13848306"
        },
        "ProductName": "ProductName-16110828"
      },
      {
        "Category": {
          "CategoryID": 13848306,
          "CategoryName": "CategoryName-13848306",
          "Description": "Description-13848306"
        },
        "ProductName": "ProductName-16110829"
      }
    ]
  },
  {
    "CompanyName": "CompanyName-20258347",
    "Products": []
  },
  {
    "CompanyName": "CompanyName-20258348",
    "Products": []
  }
]
```

### Using more realistic data

If you already have some data that you can transform into the appropriate CSV shape, then you can use that directly. In the [.csv/](https://github.com/qmacro/cap-nodejs-local-first-development/tree/main/data/.csv) directory of our example, there are CSV files for each of the entities, with some realistic data (from Northwind).

Let's copy those over into `db/data/`:

```bash
cp .csv/* db/data/
```

This enables us to move forward with our development alongside our domain expert, with more familiar business data to work with.

### Using non-CSV data

It's not just CSV data that the mock data mechanism supports. If you have JSON in the right "shape", you can use this too.

And it just so happens (not by accident) that the "shape" is exactly that of an OData V4 entityset, specifically the contents of the `value` node (i.e. not including the `@odata.context`). Here's an example from a cut down version of Northwind:

<https://odd.cfapps.eu10.hana.ondemand.com/northbreeze/Products>

We can use this directly in a JSON file where we'd normally find a CSV file. Let's retrieve that category data and use it[<sup>2</sup>](#footnotes):

```bash
rm db/data/northwind-Products.csv # we don't want duplicate data errors
curl \
  --silent \
  --url 'https://odd.cfapps.eu10.hana.ondemand.com/northbreeze/Products' \
| jq .value \
> db/data/northwind-Products.json
```

### Check the data is surfaced

Let's use the cds REPL for a change, to check that this data is also valid and surfaced. We can already tell that it is very likely OK, given the log message emitted when the CAP server restarted:

```log
[cds] - connect to db > sqlite { url: ':memory:' }
  > init from db/data/northwind-Suppliers.csv
  > init from db/data/northwind-Products.json
  > init from db/data/northwind-Categories.csv
/> successfully deployed to in-memory database.
```

Starting the cds REPL and getting it to load and run a server for the current project with `cds repl --run .`, we see:

```log
...
Following variables are made available in your repl's global context:

from cds.entities: {
  Products,
  Categories,
  Suppliers,
}

from cds.services: {
  db,
  northbreeze,
}

Simply type e.g. northbreeze in the prompt to use the respective objects.
```

We can use the relatively new [query
mode](https://cap.cloud.sap/docs/releases/2026/feb26#query-mode-in-cds-repl)
with the `.ql` command:

```javascript
> .ql
cql>
```

Now, within the `cql>` prompt, we can try out a query like this:

```sql
select from Products[UnitsInStock = 0] \
{ ProductName as name, Supplier.CompanyName as supplier }
```

which should emit something like this:

```javascript
[
  { name: "Chef Anton's Gumbo Mix", supplier: 'New Orleans Cajun Delights' },
  { name: 'Alice Mutton', supplier: 'Pavlova Ltd.' },
  { name: 'Thüringer Rostbratwurst', supplier: 'Plutzer Lebensmittelgroßmärkte AG' },
  { name: 'Gorgonzola Telino', supplier: 'Formaggi Fortini s.r.l.' },
  { name: 'Perth Pasties', supplier: "G'day Mate" }
]
```

This is the equivalent of <http://localhost:4004/northbreeze/Products?$filter=UnitsInStock%20eq%200&$select=ProductName&$expand=Supplier($select=CompanyName)> which produces:

```json
[
  {
    "ProductName": "Chef Anton's Gumbo Mix",
    "Supplier": {
      "CompanyName": "New Orleans Cajun Delights"
    }
  },
  {
    "ProductName": "Alice Mutton",
    "Supplier": {
      "CompanyName": "Pavlova Ltd."
    }
  },
  {
    "ProductName": "Thüringer Rostbratwurst",
    "Supplier": {
      "CompanyName": "Plutzer Lebensmittelgroßmärkte AG"
    }
  },
  {
    "ProductName": "Gorgonzola Telino",
    "Supplier": {
      "CompanyName": "Formaggi Fortini s.r.l."
    }
  },
  {
    "ProductName": "Perth Pasties",
    "Supplier": {
      "CompanyName": "G'day Mate"
    }
  }
]
```

## Wrapping up

Getting started on that local-first tight development loop is easy with CAP,
and made easier with the data mocking facilities. By the way, there's another
example of using JSON in this context in the [mocking remote
services](/blog/posts/2026/05/13/local-first-dev-with-cap-node-js-mocking-remote-services/)
post which is also in [this
series](/blog/posts/2026/05/11/local-first-dev-with-cap-node-js/).

## Footnotes

1. Although, surprisingly, or wonderfully, depending on your perspective, OData
   system query options like `$filter`, `$select` and `$expand` work perfectly
   fine too. The beauty of OData is the formalisation and standardisation,
   which is naturally and logically lacking in something (REST) that is mainly
   an architectural style.

1. It's the same data as in the equivalent CSV file, but that's not important,
   what's important is the different format.
