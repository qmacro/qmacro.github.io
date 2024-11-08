---
layout: post
title: Separating concerns and focusing on the important stuff
date: 2024-11-04
tags:
  - cds
  - cap
  - tasc
  - gems
---
The phrase "separation of concerns" is one that I hear relatively often, but have never until now stopped to think properly about what it is, what it means. It's a concept discrete and important enough to have [its own Wikipedia page][1], but ultimately simple enough to understand in an instant. It's all about modularity, separating code (be that imperative code in a regular language, or declarative code such as we find in our CDS models) into distinct sections, each of which addresses a separate "concern", i.e. serves a separate purpose.

CDL[<sup>1</sup>](#footnotes), CAP's definition language for modelling, is one which embraces, facilitates, even encourages the adoption of this "separation of concerns" approach. In [the inaugural episode of The Art & Science of CAP][4], Daniel explains how [aspects][5] plays a major role in this enablement, and in doing so, elevates the critical task of domain modelling to one that can proceed with the minimum of distraction.

What does that mean? Well, as expounded upon in [Keeping things simple in domain modelling with CDS][6], domain modelling at its best has a couple of key components:

- a domain expert
- a focus on what's important (i.e. the domain being modelled)

If the domain being modelled is what's important, what's *not* of primary importance here? Well, this sort of stuff:

- basic change tracking
- authorisation concepts
- managing data privacy
- annotations for providing information to UIs

and more.

<a name="using-aspects"></a>
## Using aspects

How do aspects help here? The classic bookshop domain model has a perfect example:

```cds
using { managed } from '@sap/cds/common';

entity Books : managed {
  key ID   : Integer;
  title    : String;
}
```

The use of the `managed` aspect to bring basic change tracking, in the form of [managed data][7], to an entity. Blink and you've missed it. And that's the point. 

Instead of "polluting" the definition of the `Books` entity with annotations and elements for basic change tracking, like this:

```cds
entity Books : managed {
  key ID     : Integer;
  title      : String;
  createdAt  : Timestamp @cds.on.insert: $now;
  createdBy  : User      @cds.on.insert: $user;
  modifiedAt : Timestamp @cds.on.insert: $now  @cds.on.update: $now;
  modifiedBy : User      @cds.on.insert: $user @cds.on.update: $user;
}
```

we can factor the noise out by using an aspect, and there's a standard [`managed` aspect][8], imported from `@sap/cds/common`, that we can employ with the minimum of distraction by simply using the `:` syntax when defining the entity (`entity Books : managed { ... }`). Think of `:` here as meaning "inherits from".

Using an aspect like this allows us to avoid unnecessary clutter in our domain model, and to separate the concern of basic change tracking to somewhere else (we don't really care at this point, all we do care is that it's "not here"). This helps us to stay focused on what's important - the books and other core entities that make up the domain.

## Separation all the way down

What's really fascinating is that this separation of concerns goes deeper than one might at first think. While the `managed` aspect is the single word that hides away what we need for basic change tracking (the `createdAt`, `createdBy`, `modifiedAt` and `modifiedBy` elements, along with the `@cds.on.insert` and `@cds.on.update` annotations that are declared directly with those elements) ... there is a second level of separation of concerns going on underneath too.

To illustrate - if we dive into [the source of][9] `@sap/cds/common`, we see not only the definition of `managed`:

```cds
aspect managed {
  createdAt  : Timestamp @cds.on.insert : $now;
  createdBy  : User      @cds.on.insert : $user;
  modifiedAt : Timestamp @cds.on.insert : $now  @cds.on.update : $now;
  modifiedBy : User      @cds.on.insert : $user @cds.on.update : $user;
}
```

but also that there are annotations for that `managed` aspect ... that are themselves separated out to different areas of the `@sap/cds/common` resource[<sup>2</sup>](#footnotes)!

```cds
// Annotations for Fiori UIs...

annotate managed with {
  createdAt  @UI.HiddenFilter @UI.ExcludeFromNavigationContext;
  createdBy  @UI.HiddenFilter @UI.ExcludeFromNavigationContext;
  modifiedAt @UI.HiddenFilter @UI.ExcludeFromNavigationContext;
  modifiedBy @UI.HiddenFilter @UI.ExcludeFromNavigationContext;
}

annotate managed with {
  createdAt  @Core.Immutable;
  createdBy  @Core.Immutable;
}

// ...

// Common Annotations...

annotate managed with {
  createdAt  @title : '{i18n>CreatedAt}';
  createdBy  @title : '{i18n>CreatedBy}';
  modifiedAt @title : '{i18n>ChangedAt}';
  modifiedBy @title : '{i18n>ChangedBy}';
}

// ...

// Temporary Workarounds...

annotate managed with {
  modifiedAt @readonly;
  createdAt  @readonly;
  createdBy  @readonly;
  modifiedBy @readonly;
}
```

## Service definitions

Service definitions are also a way to separate out concerns. At the `db/` layer we define our data model. In a separate layer, traditionally in `srv/` (via CAP's convention over configuration), we describe how the outside world can interact with the data model (in both directions). We define interfaces.

So in this concern, i.e. in a separate file where we declare `service` definitions, we can focus for example on who gets to access what, according to their roles. This access is predicated upon the definition of [facets][11] that are further refined by the signature and also access control list (ACL) style annotations.

And here again, around 48 mins in to the episode, Daniel shows yet another instance where aspects[<sup>3</sup>](#footnotes) are used to separate out concerns, in that the `TravelService` service is *relatively* simple, but is further annotated in separate files.

Here's what the `TravelService` definition looks like at this point, in `srv/travel-service.cds`:

```cds
using { sap.fe.cap.travel as my } from '../db/schema';

service TravelService @(path:'/processor') {

  @(restrict: [
    { grant: 'READ', to: 'authenticated-user' },
    { grant: ['rejectTravel','acceptTravel','deductDiscount'], to: 'reviewer' },
    { grant: ['*'], to: 'processor' },
    { grant: ['*'], to: 'admin' }
  ])
  entity Travel as projection on my.Travel actions {
    action createTravelByTemplate() returns Travel;
    action rejectTravel();
    action acceptTravel();
    action deductDiscount( percent: Percentage not null ) returns Travel;
  };
}

type Percentage : Integer @assert.range: [1,100];
```

This is (almost) as straightforward and focused as it can get. Why? Because annotations belonging to a separate concern, are stored separately in other files, such as `srv/labels.cds`, `srv/value-helps.cds` and even `app/travel_processor/field-controls.cds`.

The magic of CAP's convention over configuration and how the CDS compiler pulls in resources (files) for the effective CDS model means that this loosely coupled approach to telling the story of the model in different chapters, only one of which is "visible" or "in focus" at a time, works very well.

## Easy refactoring

The relaxed nature of iterating on the eventual CDS model with CDL means that it's simple and also near zero cost to refactor; it's easy to work towards separated concerns and a stronger focus on what's relevant at any given time.

We see an example of this around 43 mins in, where Daniel moved the still-remaining "noisy" access control annotation that sat alongside the definition of the `TravelService` (visible above, specifically the `@(restrict: [ ... ])` annotation) into a separate file `srv/access-control.cds`, like this:

```cds
using { TravelService } from './travel-service';

annotate TravelService.Travel with @(restrict: [
  { grant: 'READ', to: 'authenticated-user' },
  { grant: ['rejectTravel','acceptTravel','deductDiscount'], to: 'reviewer' },
  { grant: ['*'], to: 'processor' },
  { grant: ['*'], to: 'admin' }
])
```

This leaves the content of `srv/travel-service.cds` much cleaner and more focused (especially for the domain expert):

```cds
using { sap.fe.cap.travel as my } from '../db/schema';

service TravelService @(path:'/processor') {

  entity Travel as projection on my.Travel actions {
    action createTravelByTemplate() returns Travel;
    action rejectTravel();
    action acceptTravel();
    action deductDiscount( percent: Percentage not null ) returns Travel;
  };
}

type Percentage : Integer @assert.range: [1,100];
```

Moreover, it's possibly that different project team members might be responsible for different concerns, and if one of those concerns is determining the overall access strategy, having this annotation in a separate file makes things a lot easier and less prone to inadvertent cross-concern changes!

## Empty aspects

What blew my mind a little was how similar annotations and aspects are to each other, effectively. At around 45 mins in, Daniel illustrated this by changing the content of the new `srv/access-control.cds` from containing an `annotation` of the `TravelService.Travel` entity which we see above, into a new named ... and *empty* ... `aspect`:

```cds
using { TravelService } from './travel-service';

aspect ACL4Travels @(restrict: [
  { grant: 'READ', to: 'authenticated-user' },
  { grant: ['rejectTravel','acceptTravel','deductDiscount'], to: 'reviewer' },
  { grant: ['*'], to: 'processor' },
  { grant: ['*'], to: 'admin' }
]) {}
```

The subtlety of this empty `aspect` definition (`{}`) matches the sheer beauty and flexibility that this illustrates.

And the cherry on top is how this is then used to bring about the same effect with `TravelService.Travel`, i.e. the use of the `extend` keyword:

```cds
extend TravelService.Travel with ACL4Travels;
```

## Wrapping up

The take-away here for me is that CDS (and by inference CDL) is designed in such a way as to be as loose, relaxing and as flexible as possible, with features (and, in a way, a deliberate lack of features) primarily focused on the prize - the best modelling of the domain, and the best facilitation of that modelling process with the people who matter. The domain experts, the security experts, the API experts, and everyone else on the team who, separately and together work towards building what's needed. Nothing more and nothing less.

<a name="footnotes"></a>
## Footnotes

1) For many reasons, all of them understandable, most folks refer to the modelling language as "CDS". Technically speaking, the language is [CDL][2], one of a handful of domain specific languages (DSLs) in the [CDS family][3].
2) It's straightforward to discover the effective definition of elements of something like this `managed` aspect, with all the annotations here, by asking the CDS compiler to produce the canonical notation ([CSN][10]) in a JSON representation and then just pulling out one of the elements, like this:

```shell
$ cds compile db/schema.cds --to json \
  | jq '.definitions.Books.elements.createdAt'
{
  "@cds.on.insert": {
    "=": "$now"
  },
  "@UI.HiddenFilter": true,
  "@UI.ExcludeFromNavigationContext": true,
  "@Core.Immutable": true,
  "@title": "{i18n>CreatedAt}",
  "@readonly": true,
  "type": "cds.Timestamp"
}
```
3) Think of annotations as aspects too - as is illustrated in the "Empty aspects" section.

[1]: https://en.wikipedia.org/wiki/Separation_of_concerns
[2]: https://cap.cloud.sap/docs/cds/cdl
[3]: https://cap.cloud.sap/docs/cds
[4]: https://www.youtube.com/watch?v=XMchiFnDJ6E
[5]: https://cap.cloud.sap/docs/cds/cdl#aspects
[6]: /blog/posts/2024/11/02/keeping-things-simple-in-domain-modelling-with-cds/
[7]: https://cap.cloud.sap/docs/guides/domain-modeling#managed-data
[8]: https://cap.cloud.sap/docs/guides/domain-modeling#aspect-managed
[9]: https://www.npmjs.com/package/@sap/cds?activeTab=code
[10]: https://cap.cloud.sap/docs/cds/csn
[11]: /blog/posts/2024/11/03/restricting-access-via-facets-with-masked-elements/
