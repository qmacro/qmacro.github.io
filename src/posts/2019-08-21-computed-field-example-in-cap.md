---
layout: post
title: "Computed field example in CAP"
date: 2019-08-21
tags:
  - sapcommunity
---
*In this post, I show one way of using computed properties in CAP, using
CDS and service events in Node.js.*

Over in the [CAP section of the Community
Q&A](https://answers.sap.com/tags/9f13aee1-834c-4105-8e43-ee442775e5ce),
Pierre Dominique asked an interesting question that I thought I'd have a
go at answering in the form of a short post. Here's the question:
[Counting association entities using
CDS](https://answers.sap.com/questions/12845830/counting-associated-entities-using-cds.html) -
go ahead and have a quick read of it, then come back here to find out
one way of doing it.

Given the bookshop sample data as a basis, how do we extend the service
to include a property which indicates, for each author, how many books
they have written?

## Step 1 - the definitions

Here's the basic schema. It's very similar to the example that Pierre
gives, but doesn't have the extra 'numberOfBooks' property at this
level - I wanted to give myself an extra challenge by not defining it at
the data model layer, but defining it only at the service definition
layer. If we're going to have a computed property, we should avoid
having it pollute the space at the persistence layer.

```cds
namespace my.bookshop;

entity Books {
    key ID : Integer;
    title  : String;
    stock  : Integer;
    author : Association to Authors;
}

entity Authors {
    key ID : Integer;
    name   : String;
    books  : Association to many Books on books.author = $self;
}
```
*db/schema.cds*

It's possible to add computed properties to an entity at the service
definition level. Here's what the service definition looks like with a
computed property for the requirement at hand:

```cds
using my.bookshop as my from '../db/schema';

service CatalogService {

    entity Books as projection on my.Books;
    entity Authors as select from my.Authors {
        *,
        null as numberOfBooks: Integer
    };

}
```

*srv/service.cds*

Notice the "as select from", as opposed to the simpler "as projection
on". It allows us to specify properties, which is what we do in the
block that follows:

-   the "\*" brings in all the existing properties from the my.Authors
    definition
-   then we define a new property "numberOfBooks" as an Integer type

Let's take a moment to have a look what that produces. Running this at
the command line:

```shell
cds compile srv/service.cds --to sql
```

\... gives us the schema definition, which includes these two views that
have been generated from the two entities defined at the service level:

```sql
CREATE VIEW CatalogService_Authors AS SELECT
  Authors_0.ID,
  Authors_0.name,
  NULL AS numberOfBooks
FROM my_bookshop_Authors AS Authors_0;

CREATE VIEW CatalogService_Books AS SELECT
  Books_0.ID,
  Books_0.title,
  Books_0.stock,
  Books_0.author_ID
FROM my_bookshop_Books AS Books_0;
```

Take note of the "numberOfBooks" property in the
"CatalogService_Authors" view.

While we're in the mood for looking at generated compilations, let's
do the same, but this time see what the service definition will look
like, in the form of Entity Data Model XML (EDMX) - which you and I know
more comfortably as OData metadata.

Running this at the command line:

```shell
cds compile srv/service.cds --to edmx
```

\... gives us this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">
  <edmx:Reference Uri="https://oasis-tcs.github.io/odata-vocabularies/vocabularies/Org.OData.Core.V1.xml">
    <edmx:Include Alias="Core" Namespace="Org.OData.Core.V1"/>
  </edmx:Reference>
  <edmx:DataServices>
    <Schema Namespace="CatalogService" xmlns="http://docs.oasis-open.org/odata/ns/edm">
      <EntityContainer Name="EntityContainer">
        <EntitySet Name="Authors" EntityType="CatalogService.Authors">
          <NavigationPropertyBinding Path="books" Target="Books"/>
        </EntitySet>
        <EntitySet Name="Books" EntityType="CatalogService.Books">
          <NavigationPropertyBinding Path="author" Target="Authors"/>
        </EntitySet>
      </EntityContainer>
      <EntityType Name="Authors">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Int32" Nullable="false"/>
        <Property Name="name" Type="Edm.String"/>
        <NavigationProperty Name="books" Type="Collection(CatalogService.Books)" Partner="author"/>
        <Property Name="numberOfBooks" Type="Edm.Int32"/>
      </EntityType>
      <EntityType Name="Books">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Int32" Nullable="false"/>
        <Property Name="title" Type="Edm.String"/>
        <Property Name="stock" Type="Edm.Int32"/>
        <NavigationProperty Name="author" Type="CatalogService.Authors" Partner="books">
          <ReferentialConstraint Property="author_ID" ReferencedProperty="ID"/>
        </NavigationProperty>
        <Property Name="author_ID" Type="Edm.Int32"/>
      </EntityType>
      <Annotations Target="CatalogService.Authors/numberOfBooks">
        <Annotation Term="Core.Computed" Bool="true"/>
      </Annotations>
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>
```

There's one thing in there that's of particular interest - the
annotation of this new property. You can either stare at this XML until
you see it, or just look at it as extracted from that sea of angle
brackets:

```xml
<Annotations Target="CatalogService.Authors/numberOfBooks">
  <Annotation Term="Core.Computed" Bool="true"/>
</Annotations>
```

This has been automatically generated from that simple service
definition earlier. Thanks, CAP!

## Step 2 - the implementation

Implementing the logic to provide values for this computed property is
next up. As you may know, we can [provide custom logic in the form of
functions attached to specific
events](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/94c7b69cc4584a1a9dfd9cb2da295d5e.html)
in the request/response lifecycle as OData operations are processed, and
in a very comfortable way, via the "[convention over
configuration](https://en.wikipedia.org/wiki/Convention_over_configuration)"
approach of simply providing a JavaScript file of the same base name as
the service definition file, in the same directory.

The Node.js CAP runtime will then discover this file and use it as extra
(or overriding) implementation logic. This is what it looks like:

```javascript
module.exports = srv => {

  const { Books } = srv.entities

  srv.after('READ', 'Authors', (authors, req) => {

    return authors.map(async author => {
      const publications = await cds.transaction(req).run(
        SELECT .from(Books) .where({ author_ID: author.ID })
      )
      author.numberOfBooks = publications.length
    })

  })

}
```

*srv/service.js*

(In case you're wondering: yes, I am trying to avoid semicolons and
double quotes, and yes, I like the ES6 fat arrow syntax for functional
style, and no, I am not writing and will not write any "class" based
code here - in my opinion the whole "object orientation comes to JS"
is the wrong direction entirely. Stick *that* in your pipe and smoke it!
:-))

Anyway, here's what's going on in the code:

-   we grab the Books entity from within the service object
-   we hook in a function to be called when READ requests are processed
    on the Authors entity, specifically after the main part of the
    request has been fulfilled (i.e. using srv.after)
-   that function expects the results of the request fulfilment (i.e.
    the author(s) retrieved), plus the original request object, from
    which we can create a context in which to run a CDS query
-   the query is within a map function over the authors retrieved, and
    goes to get the books for that author

The CDS query is made using the CDS Query Language (CQL) fluent API,
which I've tried to illustrate with some gratuitous whitespace (before
.from and .where, in particular).

Once the value for "numberOfBooks" has been computed and assigned, we
simply "let go" and the enhanced result set is returned in the
response.

## Step 3 - profit!

Here's what this results in, after deploying the definitions and
starting the service (I have a few books and authors in some sample CSV
files):

```log
=> cds deploy && cds run
 > filling my.bookshop.Authors from db/csv/my.bookshop-Authors.csv
 > filling my.bookshop.Books from db/csv/my.bookshop-Books.csv
/> successfully deployed database to ./bookshop.db

[cds] - connect to datasource - sqlite:bookshop.db
[cds] - serving CatalogService at /catalog - impl: service.js
[cds] - service definitions loaded from:

  srv/service.cds
  db/schema.cds

[cds] - server listens at http://localhost:4004 ... (terminate with ^C)
[cds] - launched in: 1126.872ms
```

And here's some sample output, retrieved with "curl" and nicely
pretty-printed with "jq" (yes, folks, this is all in a terminal, ON
THE COMMAND LINE)\*:

```log
=> curl -s http://localhost:4004/catalog/Authors | jq
{
  "@odata.context": "$metadata#Authors",
  "@odata.metadataEtag": "W/"8q5jjLD6vJ0ARrjnkajTONXIn38vpa1wxoXucua4kzU="",
  "value": [
    {
      "ID": 42,
      "name": "Douglas Adams",
      "numberOfBooks": 3
    },
    {
      "ID": 101,
      "name": "Emily Brontë",
      "numberOfBooks": 1
    },
    {
      "ID": 107,
      "name": "Charlote Brontë",
      "numberOfBooks": 1
    },
    {
      "ID": 150,
      "name": "Edgar Allen Poe",
      "numberOfBooks": 2
    },
    {
      "ID": 170,
      "name": "Richard Carpenter",
      "numberOfBooks": 1
    }
  ]
}
```

That's pretty much all there is to it, at least as far as I can see. I
hope you find this useful. I had fun writing it, thanks Pierre for a
good question.

\*i.e. the future

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/computed-field-example-in-cap/ba-p/13408603)
