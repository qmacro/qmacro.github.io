---
title: Modelling contained-in relationships with compositions in CDS
date: 2025-10-14
tags:
  - bestpractices
  - cap
  - cds
  - compositions
  - aspects
description: A short study of the features of CDS for modelling classic contained-in relationships, with a focus on the details, and a lean towards anonymous aspects.
---
## Background

There's a classic structure often found representing business data in enterprise software, and that's the "document". Purchase requisition, sales order, goods receipt, and so on. Header and items. Most of the time the items don't make sense existing on their own, independent of their header parent. Such documents are typically modelled using contained-in relationships.

There's a great section of the [Capire](https://cap.cloud.sap/docs/) documentation, specifically on [compositions](https://cap.cloud.sap/docs/guides/domain-modeling#compositions), on which I want to expand here.

## Explicit modelling

Given a hammer, all problems look like nails. Given the "entity" concept, all business data structures look like they should be modelled using entities.

Which does work. To wit:

```cds
service S {
  entity Orders {
    key ID    : Integer;
        Items : Composition of many OrderItems
                  on Items.parent = $self;
  }

  entity OrderItems {
    key parent : Association to Orders;
    key pos    : Integer;
        qty    : Integer;
  }
}
```

When compiled (with `cds compile --to yaml service.cds`[<sup>1</sup>](#footnotes)), this results in the following schema notation (in a YAML representation as I find it cleaner and easier to read)[<sup>2</sup>](#footnotes):

```yaml
definitions:
  S:
    kind: service
  S.Orders:
    kind: entity
    elements:
      ID:
        key: true
        type: cds.Integer
      Items:
        type: cds.Composition
        cardinality:
          max: '*'
        target: S.OrderItems
        'on':
          - ref:
              - Items
              - parent
          - '='
          - ref:
              - $self
  S.OrderItems:
    kind: entity
    elements:
      parent:
        key: true
        type: cds.Association
        target: S.Orders
        keys:
          - ref:
              - ID
      pos:
        key: true
        type: cds.Integer
      qty:
        type: cds.Integer
```

The resulting CSN encompasses the modelling intent - zero or more item children, and a relationship constraint that links back to the parent.

But the definitions at the CDS model level are quite explicit and arguably a little "noisy":

- at the parent level, the constraint detail (i.e. `on Items.parent = $self`) needs to be expressed explicitly
- the child requires an explicit (key) element to point back to the parent
- that child-to-parent relationship needs to be expressed explicitly as a to-one association which is arguably also just a bit too much "machinery" on show

Remember, domain modelling is the common language for business domain experts and developers, and the CDS model is where they meet. So machinery is to be avoided where possible.

## Implicit modelling

Such a classic parent-child structure can be expressed in the CDS model a lot more succinctly, using [aspects](https://cap.cloud.sap/docs/guides/domain-modeling#aspects), specifically [anonymous aspects](https://cap.cloud.sap/docs/guides/domain-modeling#composition-of-aspects).

The exact same model can be expressed thus:

```cds
service S {
  entity Orders {
    key ID    : Integer;
        Items : Composition of many {
                  key pos : Integer;
                      qty : Integer;
                }
  }

}
```

That's it - that's the entire equivalent declaration. In using an anonymous aspect (that's the part expressed as the `{ ... }` block) to describe the composition target, we get to NOT have to come up with and define:

- a second entity definition
- a name for that second entity
- a composition constraint
- a pointer from the child back to the parent

I would go so far as to say that [staring at](https://qmacro.org/blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/#initial-recognition) this structure expression conjures up far more readily what a document (such as those examples mentioned above) "looks like" mentally.

And guess what? The equivalent schema notation is logically the same. Here's what compiling this "quieter" and more compact version to the YAML flavour of CSN gives us[<sup>2</sup>](#footnotes):

```yaml
definitions:
  S:
    kind: service
  S.Orders:
    kind: entity
    elements:
      ID:
        key: true
        type: cds.Integer
      Items:
        type: cds.Composition
        cardinality:
          max: '*'
        targetAspect:
          elements:
            pos:
              key: true
              type: cds.Integer
            qty:
              type: cds.Integer
        target: S.Orders.Items
        'on':
          - ref:
              - Items
              - up_
          - '='
          - ref:
              - $self
  S.Orders.Items:
    kind: entity
    elements:
      up_:
        key: true
        type: cds.Association
        cardinality:
          min: 1
          max: 1
        target: S.Orders
        keys:
          - ref:
              - ID
        notNull: true
      pos:
        key: true
        type: cds.Integer
      qty:
        type: cds.Integer
```

There are some technical differences, which are worth pointing out (there's always an opportunity to learn):

- there's still a composition `target` pointing to an entity definition, but here that is `S.Orders.Items`, a definition that's been created on the fly to help satisfy the composition requirements
- this `S.Orders.Items` entity has a key element `up_` that points back to the parent
- there's additional info at the `Items` element in the parent that captures the original anonymous aspect definition (in `targetAspect`)

From a naming convention perspective, the name of the generated target entity is creaed using the parent entity as a prefix (`S.Orders`) to the composition element's name (`Items`), forming a [scoped](https://cap.cloud.sap/docs/cds/cdl#scoped-names) name `S.Orders.Items`. And I would wager that it's unlikely that we as humans would use an underscore-suffixed name for an element, so `up_` is a good choice for the automatically generated pointer-to-parent element name.

## Hybrid

There is a middle ground, where named, rather than anonymous aspects can be used. You can read more about this in the [named targets](https://cap.cloud.sap/docs/cds/cdl#with-named-targets) section of the Domain Modelling topic of Capire.

## Wrapping up

The CDS modelling language (and CDL specifically) is for humans. CSN is for machines. The distinction is not always top of mind, but if we try to keep it there, we'll end up with cleaner, simpler model definitions that are easier to reason about, easier to extend and reuse, and easier to maintain.

## Footnotes

1. I piped the resulting YAML through `yq -y .` to pretty-print it, as I find the long(er) lines of the raw YAML output a little tough to digest.

1. I removed the metadata from the compiled YAML output:

    ```yaml
    meta:
      creator: CDS Compiler v6.4.2
      flavor: inferred
    $version: 2
    ```

  just to keep things a little more compact.
