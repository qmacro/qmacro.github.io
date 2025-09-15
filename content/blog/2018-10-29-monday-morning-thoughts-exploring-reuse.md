---
title: "Monday morning thoughts: exploring reuse"
date: 2018-10-29
tags:
  - sapcommunity
  - mondaymorningthoughts
---
*In this post, I think about reuse and extension, in the context of the
Application Programming Model for SAP Cloud Platform, and mindful of
Björn Goerke's SAP TechEd 2018 keynote message in Barcelona - "keep
the core clean".*

Last week saw the Barcelona edition of SAP TechEd 2018, where SAP CTO
Björn Goerke and a great team of role models on stage gave us a keynote
with something for everyone - technical and business alike. During the
keynote, I
[tweeted](/tweets/qmacro/status/1054640660400295936):

> *My three keywords from the #SAPTechEd keynote so far:*
> 
> *Open (standards, protocols, APIs)*
> 
> *Reuse (important superpower of @sapcp application programming
> model) *
> 
> *Clean (keep the core clean by extending outside of it)*


I want to think about the "reuse" and "clean" keywords, because in
many ways they're complementary, in that reuse (and by association,
extension) can help to achieve the goal of a clean core.

Of course, there's a lot more to it than that, but reusing & extending
definitions and services is a key part of building outside of the core,
whether for net new applications or to extend existing solutions. That
implies that the application programming model, which has reuse as a
"superpower", is a very useful model to know about.

So I thought I'd look into an example of reuse and extension that exist
for us to meditate upon and learn from.

## cloud-samples-itelo

Earlier this year Oliver Welzel wrote "[ITelO -- A Sample Business
Application for the new Application Programming Model for SAP Cloud
Platform](https://blogs.sap.com/2018/06/27/itelo-a-sample-business-application-for-the-new-application-programming-model-for-sap-cloud-platform/)"
in which he described an application with ra product catalog, and
reviews, for the fictitious company ITelO. The data model is in three
layers, with each building on the one beneath it.

This diagram from the post provides a nice summary of that:

![](/images/2018/10/ITelOCatalog.png)

*The component overview, showing how the data model is built up in
layers*

(Perhaps before continuing with this post, it might be worth you going
and taking a read of Oliver's post. Don't forget to come back,
though!)

## Multiple layers

The idea is that there are core artefacts in the "foundation" layer,
the "product-catalog" layer builds on top of that, and then there's
the "itelo" specific application layer at the top.

Each layer is represented by a repository in GitHub, so all the source
is available to study. If we start at the top, and look at the data
model definition at the "itelo" layer, this is what we see\*,
specifically in the
[db/model.cds](https://github.com/SAP/cloud-samples-itelo/blob/rel-1.0/db/model.cds)
source:

```cds
namespace clouds.itelo;

using clouds.products.Products from '@sap/cloud-samples-catalog';
using clouds.foundation as fnd from '@sap/cloud-samples-foundation';

extend Products with {
    reviews: Association to many Reviews on reviews.product = $self @title: '{i18n>review}';
    averageRating: Decimal(4, 2) @(
        title: '{i18n>averageRating}',
        Common.FieldControl: #ReadOnly
    );
    numberOfReviews: Integer @(
        title: '{i18n>numberOfReviews}',
        Common.FieldControl: #ReadOnly
    );
}

entity Reviews: fnd.BusinessObject {
    product: Association to Products @title: '{i18n>product}';
    reviewer: Association to Reviewers @title: '{i18n>reviewer_XTIT}';
    title: String(60) @title: '{i18n>reviewTitle}';
    message: String(1024) @title: '{i18n>reviewText}';
    rating: Decimal(4, 2) @title: '{i18n>rating}';
    helpfulCount: Integer @title: '{i18n>ratedHelpful}';
    helpfulTotal: Integer @title: '{i18n>ratedTotal}';
}

annotate Reviews with {
    ID @title: '{i18n>review}';
}

entity Reviewers: fnd.Person, fnd.BusinessObject {
}

annotate Reviewers with {
    ID @title: '{i18n>reviewer_XTIT}';
}
```

\*I'm specifically using the "rel-1.0" branch in each case, because
that's what's also used in the dependency references that we'll see
shortly, and represents a stable version that we can examine.

## Reuse through "using" statements

Looking at the first few lines, we see some "using" statements:

```cds
using clouds.products.Products from '@sap/cloud-samples-catalog';
using clouds.foundation as fnd from '@sap/cloud-samples-foundation';
```

So this is already interesting. Is this reuse in action? It is. But what
does it mean, exactly? Let's investigate. Taking the first "using"
statement, something called "clouds.products.Products" is being used
from something called "@sap/cloud-samples-catalog".

In the [Model
Reuse](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/c6f83f47d8364a06922a60aa57a699f8.html)
section of the documentation on the SAP Help Portal, we can see that
this is effectively an import of a definition from another CDS model.
OK, which one? Well, we can recognise the "cloud-samples-catalog" name
as it's one of the layers in the diagram we looked at earlier. But how
is that resolved?

For that, we have to look in the "itelo" layer project's
[package.json](https://github.com/SAP/cloud-samples-itelo/blob/rel-1.0/package.json)
file, where, amongst other things, we see some dependencies defined:

```cds
"dependencies": {
    "@sap/cloud-samples-foundation": "https://github.com/SAP/cloud-samples-foundation.git#rel-1.0",
    "@sap/cloud-samples-catalog": "https://github.com/SAP/cloud-samples-catalog.git#rel-1.0"
}
```

Ooh, well that's exciting, for a start! The package.json file is [from
the Node Package Manager (NPM)
world](https://docs.npmjs.com/files/package.json) and the dependencies
section is where one defines dependencies to other packages, typically
ones like "express", if you're building services that handle HTTP
requests, for example. But what do we have here?

Well, we can see the names referenced in the "using" statements
earlier, in other words "@sap/cloud-samples-catalog" and
"@sap/cloud-samples-foundation". But instead of simple package names,
they're mapped to GitHub URLs. And not just any GitHub URLs, but URLs
that refer to specific repositories, and indeed specific branches!
Taking the URL for the "@sap/cloud-samples-catalog" name, we have:

```cds
https://github.com/SAP/cloud-samples-catalog.git#rel-1.0
```

which refers to the [rel-1.0
branch](https://github.com/SAP/cloud-samples-catalog/tree/rel-1.0) of
the cloud-samples-catalog repository belonging to SAP.

## The "product-catalog" layer

Looking there, we see a fully formed application - the middle
"product-catalog" layer that we saw earlier, with app, srv and db
folders representing each of the three components of a typical fully
fledged solution based on the application programming model.

![](/images/2018/10/Screenshot-2018-10-29-at-10.19.20.png)

In the db folder we see the
[model.cds](https://github.com/SAP/cloud-samples-catalog/blob/rel-1.0/db/model.cds)
file, which starts like this:

```cds
namespace clouds.products;

using clouds.foundation as fnd from '@sap/cloud-samples-foundation';
using clouds.foundation.CodeList;

entity Products: fnd.BusinessObject {
    // general info
    key ID: String(36);
    name: localized String @(
        title: '{i18n>name}',
        Common.FieldControl: #Mandatory,
        Capabilities.SearchRestrictions.Searchable
    );
    description: localized String @(
        title: '{i18n>description}',
        Common.FieldControl: #Mandatory
    );

    [...]
```

## Fractals

In a wonderfully fractal way, we notice immediately that this model
definition also refers to another package with a "using" statement,
but let's resist descending deeper just at this moment. Instead, we can
concentrate on looking at what's going on with the "using" statement
we've seen in the consuming definition earlier, which looked like
this:

```cds
using clouds.products.Products from '@sap/cloud-samples-catalog';
```

We realise that "clouds.products.Products" refers to the Products
entity in the "cloud.products" namespace, which is defined here with
the "entity" definition:

```cds
entity Products: fnd.BusinessObject { ... }
```

But what is that "fnd.BusinessObject" sitting between the entity name
and the block definition in curly braces? Why, it's more reuse, this
time of the underlying "foundation" layer. Just above in the same
file, we can see that this layer is referenced in a "using" statement,
this time with a local alias "fnd" defined:

    using clouds.foundation as fnd from '@sap/cloud-samples-foundation';


So now let's briefly descend into the fractal. The reference to
"fnd.BusinessObject" is to an entity defined in the "foundation"
layer, which we can see if we follow the [dependency reference in the
"product-catalog" layer's
package.json](https://github.com/SAP/cloud-samples-catalog/blob/rel-1.0/package.json#L9):

![](/images/2018/10/Screenshot-2018-10-29-at-10.22.27.png)

(It's worth observing that in this layer we only have data definitions
\-- in the form of ".cds" files \-- rather than a full blown solution
with app, srv and db folders.)

In this repository (again, branch "rel-1.0") we can find the
definition of the BusinessObject entity [in the common.cds
file](https://github.com/SAP/cloud-samples-foundation/blob/rel-1.0/common.cds#L3-L8) looking
like this:

```cds
abstract entity BusinessObject : ManagedObject {
    key ID : UUID @(
        title: '{i18n>uuid}',
        Common.Text: {$value: name, "@UI.TextArrangement": #TextOnly}
    );
}
```

Note in passing that here the "BusinessObject" entity is defined as
"abstract" which means that it's just a type declaration rather than
something for which instances should exist. Note also that it's further
defined, using a similar pattern to where we saw the
"fnd.BusinessObject" reference, by another abstract entity definition
"ManagedObject" (you can [find this definition of
ManagedObject](https://github.com/SAP/cloud-samples-foundation/blob/rel-1.0/common.cds#L10-L34)
also in the common.cds file).

## Extension through "extend" statements

Moving back up the layers for some air, we see that directly following
the "using" statements, there is this:

```cds
extend Products with {
    reviews: Association to many Reviews on reviews.product = $self @title: '{i18n>review}';
    averageRating: Decimal(4, 2) @(
        title: '{i18n>averageRating}',
        Common.FieldControl: #ReadOnly
    );
    numberOfReviews: Integer @(
        title: '{i18n>numberOfReviews}',
        Common.FieldControl: #ReadOnly
    );
}
```

With the "extend"
[aspect](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/40582e7bbeca4311b0b165c8b9745094.html),
entity definitions can be repurposed with extra properties, for example.
In this case, the existing Products entity (from the "product-catalog"
layer's data definition) is extended with three properties:
"reviews", "averageRating" and "numberOfReviews". Note that the
"reviews" property is an association to a [Reviews
entity](https://github.com/SAP/cloud-samples-itelo/blob/1.0.0/db/model.cds#L18-L26)
at this (itelo) application layer, defined expressly for this purpose.

Moreover, some of the properties in the Reviews entity are also defined
as associations to further entities therein, such as the reviewer
property which points to the [Reviewers
entity](https://github.com/SAP/cloud-samples-itelo/blob/1.0.0/db/model.cds#L32-L33),
which has no properties of its own, but in a beautiful way inherits from
some of the definitions (Person and BussinessObject) at the
"foundation" layer:

```cds
entity Reviewers: fnd.Person, fnd.BusinessObject {
}
```

## Wrapping up

That might be a lot to take in, in one sitting. It has become quite
clear to me that the facilities afforded by the CDS language in the
application programming model are very rich when it comes to reuse and
extensions. Not only at the definition level, but also in the simplicity
of how package based references are realised.

While at first I thought it was a little odd to see the GitHub
repository & branch URLs, and indeed to realise that the package.json
mechanism was fundamental to how artefacts in the application
programming model are related, I've come to think that it's a natural
way to do it, and a celebration of adopting an approach that's already
out there in the world beyond our SAP ecosphere.

What's more, we haven't even touched on how annotations work and what
we are able to do in terms of reuse there too. But I'll leave that for
another time, instead leaving you with the suggestion that reuse is
indeed an important superpower of the application programming model, and
demonstrably so. And keeping the core clean - well, the more extension
and reuse we can achieve, the closer we can get to a cleaner core.

---

This post was brought to you by a chilly Monday morning, by [Pact
Coffee's Asomuprisma](https://www.pactcoffee.com/coffees/asomuprisma)
in my [SAP Coffee Corner Radio](https://anchor.fm/sap-community-podcast)
mug, and by a [Spotify
mix](https://open.spotify.com/station/user/qmacro/cluster/3JqLjzwr3h5mESenCGHsbr)
designed for concentration.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-exploring-reuse/ba-p/13350771)
