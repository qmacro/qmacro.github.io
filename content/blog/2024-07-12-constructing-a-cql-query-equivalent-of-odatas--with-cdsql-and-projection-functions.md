---
title: Turning an OData expand into a cds.ql CQL query with a projection function in CAP
date: 2024-07-12
tags:
  - cap
  - cds
  - sql
  - cql
  - nodejs
---
If, while serving a call to your provided CAP service, you want to construct some CQL to perform on your database in a similar way to how `$expand` works in OData, this post may help.

> Before I start, note that I'll be using my cut-down version of the classic Northwind service, called Northbreeze, to illustrate things in this post. There's a [repo](https://github.com/qmacro/northbreeze) available with this Northbreeze service, which you can clone and use to try out the Node.js calls to functions in the `cds.ql` module.
>
> There's also a [Northbreeze OData V4 service available](https://qmacro.cfapps.eu10.hana.ondemand.com/northbreeze) where you can try out the OData queries.

## Background

A friend asked me the other day how to make a request across the entities in his CDS model, equivalent to how he'd do it in OData, which would be like this:

```txt
/Categories?$expand=Products
```

In other words, how to retrieve Categories plus all the related Products for each one.

In the context of CAP Node.js, the [cds.ql module](https://cap.cloud.sap/docs/node.js/cds-ql) comes into play, and for selecting what should be retrieved, we have the [columns() method of SELECT](https://cap.cloud.sap/docs/node.js/cds-ql#columns).

The choices presented to the reader in the documentation here, combined with the terminology, can be a little overwhelming at first. The key is to kick the tyres by trying some of the examples out as well as read, re-read, and then re-read again. This is my strategy, at least.

Anyway, I'll use the [Products](https://github.com/qmacro/northbreeze/blob/26f071775a55c37da929e7e26a2435845337ebca/db/schema.cds#L3-L14) and [Categories](https://github.com/qmacro/northbreeze/blob/26f071775a55c37da929e7e26a2435845337ebca/db/schema.cds#L33-L39) entities in the Northbreeze CDS model. These entities are related with:

* a to-one association from `Products` to `Categories` via a `Category` element
* a to-many association from `Categories` to `Products` via a `Products` element

## Setting up

Setting up for trying things out, I've cloned the [Northbreeze repo](https://github.com/qmacro/northbreeze) and run an `npm install` there.

I've then started up the [cds REPL](https://www.youtube.com/shorts/c5flAP_b12E) and entered

```javascript
await cds.test()
```

and then

```javascript
{ Categories, Products } = cds.entities
```

to set things up. It's in this REPL that I can now try out all my `SELECT` statements below.

I've presented the statements across multiple lines for readability; that said, you can copy these statements as they are and paste them into the REPL via the [.editor facility](https://nodejs.org/en/learn/command-line/how-to-use-the-nodejs-repl#dot-commands). In addition, I'm [limiting](https://cap.cloud.sap/docs/node.js/cds-ql#limit) the amount of data returned for some of the `SELECT` calls just for brevity.

## Starting simple - column expressions within a single entity

Following the examples in use the `columns()` method documentation, I can try some individual column expressions like this:

```sql
await SELECT 
  .from(Categories) 
  .columns( 'CategoryName', 'Description' )
  .limit(3)
```

This produces:

```txt
[
  {
    CategoryName: 'Beverages',
    Description: 'Soft drinks, coffees, teas, beers, and ales'
  },
  {
    CategoryName: 'Condiments',
    Description: 'Sweet and savory sauces, relishes, spreads, and seasonings'
  },
  {
    CategoryName: 'Confections',
    Description: 'Desserts, candies, and sweet breads'
  }
]
```

So far so good. No surprises there.

## More confident - path expressions to include data from a related entity

I can now try a [path expression](https://cap.cloud.sap/docs/cds/cql#path-expressions) to bring in data from the related entity (`Products`), like this:

```sql
await SELECT 
  .from(Categories) 
  .columns( 'CategoryName', 'Products.ProductName as Product' )
  .limit(15)
```

This produces:

```txt
[
  { CategoryName: 'Beverages', Product: 'Chai' },
  { CategoryName: 'Beverages', Product: 'Chang' },
  { CategoryName: 'Beverages', Product: 'Chartreuse verte' },
  { CategoryName: 'Beverages', Product: 'Côte de Blaye' },
  { CategoryName: 'Beverages', Product: 'Guaraná Fantástica' },
  { CategoryName: 'Beverages', Product: 'Ipoh Coffee' },
  { CategoryName: 'Beverages', Product: 'Lakkalikööri' },
  { CategoryName: 'Beverages', Product: 'Laughing Lumberjack Lager' },
  { CategoryName: 'Beverages', Product: 'Outback Lager' },
  { CategoryName: 'Beverages', Product: 'Rhönbräu Klosterbier' },
  { CategoryName: 'Beverages', Product: 'Sasquatch Ale' },
  { CategoryName: 'Beverages', Product: 'Steeleye Stout' },
  { CategoryName: 'Condiments', Product: 'Aniseed Syrup' },
  { CategoryName: 'Condiments', Product: "Chef Anton's Cajun Seasoning" },
  { CategoryName: 'Condiments', Product: "Chef Anton's Gumbo Mix" }
]
```

What's interesting about this is that the data is still "flat" - there's a record for each `CategoryName` and `Products.ProductName` combination. This is moving towards, but not quite the "expand" that my friend wanted. 

## Achievement unlocked - using projection functions

I'm now ready to try out projection functions as described in the [columns() section in Capire](https://cap.cloud.sap/docs/node.js/cds-ql#columns), especially as they are recommended due to the advantages they have, which includes support for nested projections, otherwise known as "expands".

But first, I'll try a simple projection function, to get the general "feel" for them:

```sql
await SELECT 
  .from(Categories) 
  .columns( c => { c.CategoryName })
```

This produces:

```txt
[
  { CategoryName: 'Beverages' },
  { CategoryName: 'Condiments' },
  { CategoryName: 'Confections' },
  { CategoryName: 'Dairy Products' },
  { CategoryName: 'Grains/Cereals' },
  { CategoryName: 'Meat/Poultry' },
  { CategoryName: 'Produce' },
  { CategoryName: 'Seafood' }
]
```

So far, it's just a different way of expressing the column(s) that I want.

Now I'll nest another projection function in there, to achieve what my friend wants - the equivalent of the OData `$expand` system query option, as in the example from earlier (modified here to restrict the elements to just `CategoryName` and `ProductName`):

```txt
/Categories?$select=CategoryName&$expand=Products($select=ProductName)
```

Here goes:

```sql
await SELECT 
  .from(Categories) 
  .columns( c => { c.CategoryName, c.Products (p => { p.ProductName }) })
```

This produces what we want:

```txt
[
  {
    CategoryName: 'Beverages',
    Products: [
      { ProductName: 'Chai' },
      { ProductName: 'Chang' },
      { ProductName: 'Guaraná Fantástica' },
      { ProductName: 'Sasquatch Ale' },
      { ProductName: 'Steeleye Stout' },
      { ProductName: 'Côte de Blaye' },
      { ProductName: 'Chartreuse verte' },
      { ProductName: 'Ipoh Coffee' },
      { ProductName: 'Laughing Lumberjack Lager' },
      { ProductName: 'Outback Lager' },
      { ProductName: 'Rhönbräu Klosterbier' },
      { ProductName: 'Lakkalikööri' }
    ]
  },
  {
    CategoryName: 'Condiments',
    Products: [
      { ProductName: 'Aniseed Syrup' },
      { ProductName: "Chef Anton's Cajun Seasoning" },
      { ProductName: "Chef Anton's Gumbo Mix" },
      { ProductName: "Grandma's Boysenberry Spread" },
      { ProductName: 'Northwoods Cranberry Sauce' },
      { ProductName: 'Genen Shouyu' },
      { ProductName: 'Gula Malacca' },
      { ProductName: "Sirop d'érable" },
      { ProductName: 'Vegie-spread' },
      { ProductName: 'Louisiana Fiery Hot Pepper Sauce' },
      { ProductName: 'Louisiana Hot Spiced Okra' },
      { ProductName: 'Original Frankfurter grüne Soße' }
    ]
  },
  {
    CategoryName: 'Confections',
    Products: [
      { ProductName: 'Pavlova' },
      { ProductName: 'Teatime Chocolate Biscuits' },
      { ProductName: "Sir Rodney's Marmalade" },
      { ProductName: "Sir Rodney's Scones" },
      { ProductName: 'NuNuCa Nuß-Nougat-Creme' },
      { ProductName: 'Gumbär Gummibärchen' },
      { ProductName: 'Schoggi Schokolade' },
      { ProductName: 'Zaanse koeken' },
      { ProductName: 'Chocolade' },
      { ProductName: 'Maxilaku' },
      { ProductName: 'Valkoinen suklaa' },
      { ProductName: 'Tarte au sucre' },
      { ProductName: 'Scottish Longbreads' }
    ]
  },
  {
    CategoryName: 'Dairy Products',
    Products: [
      { ProductName: 'Queso Cabrales' },
      { ProductName: 'Queso Manchego La Pastora' },
      { ProductName: 'Gorgonzola Telino' },
      { ProductName: 'Mascarpone Fabioli' },
      { ProductName: 'Geitost' },
      { ProductName: 'Raclette Courdavault' },
      { ProductName: 'Camembert Pierrot' },
      { ProductName: 'Gudbrandsdalsost' },
      { ProductName: 'Flotemysost' },
      { ProductName: 'Mozzarella di Giovanni' }
    ]
  },
  {
    CategoryName: 'Grains/Cereals',
    Products: [
      { ProductName: "Gustaf's Knäckebröd" },
      { ProductName: 'Tunnbröd' },
      { ProductName: 'Singaporean Hokkien Fried Mee' },
      { ProductName: 'Filo Mix' },
      { ProductName: 'Gnocchi di nonna Alice' },
      { ProductName: 'Ravioli Angelo' },
      { ProductName: 'Wimmers gute Semmelknödel' }
    ]
  },
  {
    CategoryName: 'Meat/Poultry',
    Products: [
      { ProductName: 'Mishi Kobe Niku' },
      { ProductName: 'Alice Mutton' },
      { ProductName: 'Thüringer Rostbratwurst' },
      { ProductName: 'Perth Pasties' },
      { ProductName: 'Tourtière' },
      { ProductName: 'Pâté chinois' }
    ]
  },
  {
    CategoryName: 'Produce',
    Products: [
      { ProductName: "Uncle Bob's Organic Dried Pears" },
      { ProductName: 'Tofu' },
      { ProductName: 'Rössle Sauerkraut' },
      { ProductName: 'Manjimup Dried Apples' },
      { ProductName: 'Longlife Tofu' }
    ]
  },
  {
    CategoryName: 'Seafood',
    Products: [
      { ProductName: 'Ikura' },
      { ProductName: 'Konbu' },
      { ProductName: 'Carnarvon Tigers' },
      { ProductName: 'Nord-Ost Matjeshering' },
      { ProductName: 'Inlagd Sill' },
      { ProductName: 'Gravad lax' },
      { ProductName: 'Boston Crab Meat' },
      { ProductName: "Jack's New England Clam Chowder" },
      { ProductName: 'Rogede sild' },
      { ProductName: 'Spegesild' },
      { ProductName: 'Escargots de Bourgogne' },
      { ProductName: 'Röd Kaviar' }
    ]
  }
]
```

Excellent! Note how the path expression nesting makes sense; here is the value passed to the `columns()` method, with more whitespace:

```javascript
c => { 
    c.CategoryName,
    c.Products (p => { 
        p.ProductName
    })
})
```

To anyone familiar with JavaScript and ES6 fat arrow functions (and if you're building services with CAP Node.js you're likely to be somewhat acquainted, at least), this "shape" should feels very comfortable. Or at least not alarming.

Hope this was helpful!
