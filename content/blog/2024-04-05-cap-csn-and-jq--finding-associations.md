---
title: CAP, CDS, CDL, CSN and jq - finding associations
date: 2024-04-05
tags:
  - cap
  - jq
---
In CAP, relationships between entities can be expressed with associations. In digging into how these are represented internally, I found jq yet again to be invaluable in parsing out info from the internal representation of the definitions. Here's what I did.

In [CAP](https://cap.cloud.sap), SAP's Cloud Application Programming Model, [models are defined](https://cap.cloud.sap/docs/guides/domain-modeling) declaratively in a human readable format known as CDL, which stands for Core Definition Language[<sup>1</sup>](#footnotes).

## CDL example

Here's a simple example, in a file called `services.cds` taken from the current [Hands-on SAP Dev live stream series on back to basics with CAP Node.js](https://www.youtube.com/playlist?list=PL6RpkC85SLQBHPdfHQ0Ry2TMdsT-muECx):

```cds
aspect cuid { key ID: UUID }

service bookshop {
  entity Books : cuid {
    title: String;
    author: Association to Authors;
  }
  entity Authors : cuid {
    name: String;
    books: Association to many Books on books.author = $self;
  }
}
```

> Yes, there's a `cuid` aspect in `@sap/cds/common` but I didn't want the entire contents of that package being expressed in the output that follows, as it would make it more difficult to see the essential parts in this short example.

There's a "to-one" relationship between `Books` and `Authors`, and a "to-many" relationship in the back link beween `Authors` and `Books`. 

> For those non-CAP folks wondering where the foreign key field is in the first relationship, it's constructed automatically as the `Books:author` association is a [managed](https://cap.cloud.sap/docs/guides/domain-modeling#managed-1-associations) one.

## CSN equivalent

There's an internal JSON-based representation of such definitions, which lends itself more readily to machine processing. This representation is called [Core Schema Notation](https://cap.cloud.sap/docs/cds/csn), or CSN. We can see the CSN for the CDL source above, like this:

```shell
cds compile --to csn services.cds
```

> The default target format is in fact `csn` so `--to csn` is unnecessary, but it's nice to express it explicitly here.

What we get is this:

```json
{
  "definitions": {
    "cuid": {
      "kind": "aspect",
      "elements": {
        "ID": {
          "key": true,
          "type": "cds.UUID"
        }
      }
    },
    "bookshop": {
      "kind": "service"
    },
    "bookshop.Books": {
      "kind": "entity",
      "includes": [
        "cuid"
      ],
      "elements": {
        "ID": {
          "key": true,
          "type": "cds.UUID"
        },
        "title": {
          "type": "cds.String"
        },
        "author": {
          "type": "cds.Association",
          "target": "bookshop.Authors",
          "keys": [
            {
              "ref": [
                "ID"
              ]
            }
          ]
        }
      }
    },
    "bookshop.Authors": {
      "kind": "entity",
      "includes": [
        "cuid"
      ],
      "elements": {
        "ID": {
          "key": true,
          "type": "cds.UUID"
        },
        "name": {
          "type": "cds.String"
        },
        "books": {
          "type": "cds.Association",
          "cardinality": {
            "max": "*"
          },
          "target": "bookshop.Books",
          "on": [
            {
              "ref": [
                "books",
                "author",
                "ID"
              ]
            },
            "=",
            {
              "ref": [
                "ID"
              ]
            }
          ]
        }
      }
    }
  },
  "meta": {
    "creator": "CDS Compiler v4.6.2",
    "flavor": "inferred"
  },
  "$version": "2.0"
}
```

## Picking out detail with jq

I'm just interested to see how the associations are represented, so wanted to narrow this CSN down to just elements that are of type `cds.Association`. Being a relatively involved JSON dataset, this was a job for one of my favourite languages, jq.

Here's what I came up with, in a file called `associations`:

```jq
#!/usr/bin/env -S jq -f

# Lists entities and shows any elements that are associations

def is_entity: .value.kind == "entity";
def is_association: .value.type == "cds.Association";

.definitions
| to_entries
| map(
    select(is_entity)
    | {
        (.key):
        .value.elements
        | with_entries(select(is_association))
      }
  )
```

And here's how I use it:

```shell
cds compile --to csn services.cds | ./associations
```

The output is:

```json
[
  {
    "bookshop.Books": {
      "author": {
        "type": "cds.Association",
        "target": "bookshop.Authors",
        "keys": [
          {
            "ref": [
              "ID"
            ]
          }
        ]
      }
    }
  },
  {
    "bookshop.Authors": {
      "books": {
        "type": "cds.Association",
        "cardinality": {
          "max": "*"
        },
        "target": "bookshop.Books",
        "on": [
          {
            "ref": [
              "books",
              "author",
              "ID"
            ]
          },
          "=",
          {
            "ref": [
              "ID"
            ]
          }
        ]
      }
    }
  }
]
```

Here are some notes:

* I encapsulated the kind / type determination in helper predicate functions (`is_entity` and `is_association`), mostly to keep the main code more succinct
* I love how the [to_entries,from_entries,with_entries(f)](https://jqlang.github.io/jq/manual/#to_entries-from_entries-with_entries) family of functions[<sup>2</sup>](#footnotes) help out by normalising JSON objects that have dynamic values for property keys
* By using the `select(is_entity)` in the context of such normalisation, I can easily pick out the "enclosing" object that contains the condition I'm looking for
* In contrast to the use of `to_entries` at the outer (entity) level, I used `with_entries` to achieve the `to_entries | map(...) | from_entries` pattern that is so useful

And that's about it! Score one more for the wonderful utility of jq, in today's world of JSON.

## Alternative approach

While I like the `is_entity` and `is_association` definitions, one could make the main code even more succinct like this:

```jq
def entities: select(.value.kind == "entity");
def associations: select(.value.type == "cds.Association");

.definitions
| to_entries
| map(
    entities
    | {
       (.key):
       .value.elements | with_entries(associations)
      }
  )
```

Which do you prefer?

---

<a name="footnotes"></a>
**Footnotes**

1: The human readable language we used to define models is commonly referred to as CDS. [Capire](https://cap.cloud.sap/docs), the CAP documentation resource, is more precise, calling it CDL, classing CDL, CSN and other CAP little languages such as CQL and CQN as all being under the general CDS umbrella term. As you can see from the bottom of the CSN output, even the compiler refers to it as CDS!

2: For more on this family of functions, see [Reshaping data values using jq's with_entries](https://qmacro.org/blog/posts/2022/05/30/reshaping-data-values-using-jq's-with_entries/) and [Quick conversion of multiple values using with_entries in jq](https://qmacro.org/blog/posts/2024/02/28/quick-conversion-of-multiple-values-using-with_entries-in-jq/).
