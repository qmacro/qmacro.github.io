---
layout: post
title: Flattening the hierarchy with mixins
date: 2024-11-08
tags:
  - cds
  - cap
  - tasc
  - gems
  - mixins
---
Another [gem][1] in the [TASC][2] ("The Art & Science of CAP") [inaugural episode][3] is from around 49 mins in, in Daniel H's example about two application teams ("invoices" and "orders"), a foundation team ("core") and a team sitting in between the foundation and application teams ("middle"):

```text
invoices     orders
   |           |
   +-----+-----+
         |
       middle
         |
        core
```

Considering what the foundation team offers as a base for application projects:

```cds
entity BusinessObject {
    createdAt : DateTime;
    createdBy : String;
}
```

here's how e.g. the "invoices" application team is to make use of that:

```cds
using { BusinessObject } from './core';

entity Invoices : BusinessObject {
    key InvoiceID : String;
}
```

Nothing untoward here, and of course we can appreciate the [use of aspects][4] with the `:` shortcut syntax.

With the arrival of the middle layer team and their requirement to have the core layer `BusinessObject` have another element relating to their `User` entity definition which looked like this, in their `middle.cds` file:

```cds
entity Users {
    key ID : UUID;
    Name   : String;
}
```

In a classic hierarchical-thinking context, this new middle layer team would have to speak to and convince either the core team, or all of the application teams, to make changes to the details of their model. Beyond being a coordination problem, this introduces:

* work for every application team (adding an element to each entity manually)
* work for all teams (changing the base inheritance from the core `BusinessObject` to one from a new layer)
* a problem for the core team (inheriting from a level above in the hierarchy)

as well as bringing about increased brittleness all round.

But why think in hierarchical terms? CAP's embrace of [aspects][5], brought to life here with [the `extend` directive][6], is a great example of adopting a mixin-based approach. A mixin [is defined as][7]:

_... a class that contains methods for use by other classes without having to be the parent class of those other classes. How those other classes gain access to the mixin's methods depends on the language. Mixins are sometimes described as being "included" rather than "inherited"._

I find that mentally substituting the word "definition" for "class" here helps to land this concept from a theoretical point of view in CDS based modelling. And how does this concept land practically here? Like this:

```cds
using { BusinessObject } from './core';

entity Users {
    key ID : UUID;
    Name   : String;
}

extend BusinessObject with {
    creator : Association to Users;
}
```

A simple three step approach, the beauty of which is masked by its simplicity:

* import the `BusinessObject`
* define the new `Users` entity
* extend the imported `BusinessObject` with an element that refers to that new entity

Not only that, but there's no work, no changes, for either the core team or the application teams.

Boom! Hierarchy? What hierarchy? The power of `extend`, as a practical personification of a mixin mechanic, combined with the CDS model (compiler)'s approach of loading all the appropriate files to build the "effective model", is a subtly powerful solution to problems like this brought about by layer-based thinking.

Lovely!

[1]: https://qmacro.org/tags/gems/
[2]: https://qmacro.org/tags/tasc/
[3]: https://www.youtube.com/watch?v=XMchiFnDJ6E
[4]: /blog/posts/2024/11/04/separating-concerns-and-focusing-on-the-important-stuff/#using-aspects
[5]: https://cap.cloud.sap/docs/cds/cdl#aspects
[6]: https://cap.cloud.sap/docs/cds/cdl#extend
[7]: https://en.wikipedia.org/wiki/Mixin
