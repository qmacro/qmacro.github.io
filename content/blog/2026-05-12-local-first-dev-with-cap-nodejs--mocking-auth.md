---
title: Local-first dev with CAP Node.js - mocking auth
date: 2026-05-12
tags:
  - cap
  - auth
  - mocking
  - local
description: In this post I provider a taster of what's possible regarding mock auth in CAP Node.js local-first development.
---

This post is one of [a series on local-first development with CAP
Node.js](/blog/posts/2026/05/11/local-first-dev-with-cap-node-js/).

## The mocked authentication strategy

The [Authentication
Strategies](https://cap.cloud.sap/docs/node.js/authentication#strategies)
section of the Node.js Security topic in Capire explains the different
strategies available, and the "mocked" strategy comes with pre-defined users
that can be used, with their various levels of authorisations, to explore,
define and test security-related constructs. This mock user configuration can
be modified and extended too, but what comes out of the box is definitely
enough to get started.

## Working through an example

In this post, we'll work through an example of mocking auth, based
on content in the
[auth/](https://github.com/qmacro/cap-nodejs-local-first-development/tree/main/auth)
directory of the talk repository.

> Note that what's absent here is any form of auth implementation - all
> declarations available are automatically enforced by CAP's generic service
> providers.

### The service definition

In
[srv/main.cds](https://github.com/qmacro/cap-nodejs-local-first-development/blob/main/auth/srv/main.cds)
there's a single service defined, with a couple of entities that are simple
projections on to the entities in the data model:

```cds
using northwind from '../db/schema';

service Main {

  entity Products   as projection on northwind.Products;
  entity Categories as projection on northwind.Categories;

}
```

Starting a CAP server in local development mode with `cds watch` shows us that
the mocked authentication strategy is in play by default:

```log
[cds] - using auth strategy { kind: 'mocked' }
[cds] - serving Main {
  at: [ '/main' ],
  decl: 'srv/main.cds:4'
}
```

As we haven't yet addressed any auth requirements in our CDS model, access is
currently open to all, as we can see[<sup>1</sup>](#footnotes):

```shell
; curl \
  --include \
  --url 'localhost:4004/main/Products?$top=1'
HTTP/1.1 200 OK
OData-Version: 4.0
Content-Type: application/json; charset=utf-8
Content-Length: 105

{
  "@odata.context": "$metadata#BasicProducts",
  "value": [
    {
      "ID": 1,
      "name": "Chai",
      "supplier": "Exotic Liquids"
    }
  ]
}
```

### Examine the pre-defined users and their authorisations

We can take a look at the pre-defined user data that is defined for the mocked
authentication strategy, with:

```shell
cds env requires.auth.users
```

which will emit something like this:

```json
{
  alice: { tenant: 't1', roles: [ 'admin' ] },
  bob: { tenant: 't1', roles: [ 'cds.ExtensionDeveloper' ] },
  carol: { tenant: 't1', roles: [ 'admin', 'cds.ExtensionDeveloper' ] },
  dave: { tenant: 't1', roles: [ 'admin' ], features: [] },
  erin: { tenant: 't2', roles: [ 'admin', 'cds.ExtensionDeveloper' ] },
  fred: { tenant: 't2', features: [ 'isbn' ] },
  me: { tenant: 't1', features: [ '*' ] },
  yves: { roles: [ 'internal-user' ] },
  '*': true
}
```

### Restrict the service

Let's annotate the service with some basic role based access control (RBAC)
requirements - that of needing to authenticate, via the pseudo-role
`authenticated-user`. We can use the
[@requires](https://cap.cloud.sap/docs/guides/security/authorization#requires)
annotation:

```cds
using northwind from '../db/schema';

@requires: 'authenticated-user'
service Main {

  ...

}
```

The same `curl` request as before now fails with an appropriate HTTP 401 status
code:

```log
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic realm="Users"
Content-Type: text/plain; charset=utf-8
Content-Length: 12

Unauthorized
```

### Authenticate with a pre-defined user

We can re-try the request with one of the pre-defined
users[<sup>2</sup>](#footnotes); because the requirement is just for the
pseudo-role `authenticated-user`, we don't need any particular actual role
allocated to the user, we just need to be successfully authenticated (and so
identified) in this case:

```shell
; curl \
  --user alice: \
  --include \
  --url 'localhost:4004/main/Products?$top=1'
HTTP/1.1 200 OK
OData-Version: 4.0
Content-Type: application/json; charset=utf-8
Content-Length: 105

{
  "@odata.context": "$metadata#BasicProducts",
  "value": [
    {
      "ID": 1,
      "name": "Chai",
      "supplier": "Exotic Liquids"
    }
  ]
}
```

### Try some finer-grained access restrictions

With the
[@restrict](https://cap.cloud.sap/docs/guides/security/authorization#restrict-annotation)
we can define finer grained access requirements[<sup>3</sup>](#footnotes) in
privilege building blocks of this form:

```json
{ grant:<events>, to:<roles>, where:<filter-condition> }
```

Let's now add privilege requirements for the `Categories` entity, like this:

```cds
using northwind from '../db/schema';

@requires: 'authenticated-user'
service Main {

  entity Products   as projection on northwind.Products;

  @restrict: [
    {
      grant: 'WRITE',
      to   : 'buyer'
    },
    {
      grant: 'READ',
      to   : 'any'
    }
  ]
  entity Categories as projection on northwind.Categories;
}
```

This says that any (authenticated) user can read the categories, but only a
user with the `buyer` role can perform "write"-semantic operations.

### Confirm read operations are permitted

Let's check that "read"-semantic operations are allowed for authenticated users
(remember that the entity access is also governed by the `authenticated-user`
pseudo-role restriction on the service that contains it):

```shell
; curl \
  --user alice: \
  --include \
  --url 'localhost:4004/main/Categories?$top=1'
HTTP/1.1 200 OK
OData-Version: 4.0
Content-Type: application/json; charset=utf-8
Content-Length: 155

{
  "@odata.context": "$metadata#Categories",
  "value": [
    {
      "CategoryID": 1,
      "CategoryName": "Beverages",
      "Description": "Soft drinks, coffees, teas, beers, and ales"
    }
  ]
}
```

Looks OK.

### Try a write operation

Now for a "write"-semantic operation. Let's go big and try DELETE:

```shell
; curl \
  --user alice: \
  --include \
  --request DELETE \
  --url 'localhost:4004/main/Categories/1'
HTTP/1.1 403 Forbidden
OData-Version: 4.0
Content-Type: application/json; charset=utf-8
Content-Length: 74

{
  "error": {
    "message": "Forbidden",
    "code": "403",
    "@Common.numericSeverity": 4
  }
}
```

Alice, with the `admin` role, is denied.

### Give the user more access in the mocked strategy

We can also modify and add to the pre-defined user definitions for the mocked
authentication strategy. Let's do that, adding a couple of extra roles for
Alice in a separate `.cdsrc.json` file in the project:

```json
{
  "cds": {
    "requires": {
      "auth": {
        "users": {
          "alice": {
            "roles": [
              "admin",
              "buyer",
              "head-office"
            ]
          }
        }
      }
    }
  }
}
```

One of the roles is `buyer`, so let's now retry the previous request:

```shell
; curl \
  --user alice: \
  --include \
  --request DELETE \
  --url 'localhost:4004/main/Categories/1'
HTTP/1.1 204 No Content
OData-Version: 4.0
```

Success!

## Wrapping up

With the mocked authentication strategy, we can embrace and work on the
important aspect of securing our app or service right from the very start. CAP
makes it easy to do the right things here.

For more information, see the
[Authentication](https://cap.cloud.sap/docs/node.js/authentication) topic in
Capire.

## Footnotes

1. The JSON output in these examples has been pretty-printed for readability here.

1. The `--user` option for `curl` allows us to specify a username and password
   separated by a colon, so `alice:` here is just the username combined with an
   empty password (there are no passwords for these users). If we'd just
   specified `--user alice` without a colon, then `curl` would have prompted
   us for a password - we could have then just pressed Enter but this is one
   step we can avoid.

1. In fact, `@requires` is just a convenience shortcut for `@restrict`. The annotation

    ```cds
    @requires: 'authenticated-user'
    ```

    that we used earlier is equivalent to

    ```cds
    @restrict: [ { grant: '*', to: 'authenticated-user' } ]
    ```
