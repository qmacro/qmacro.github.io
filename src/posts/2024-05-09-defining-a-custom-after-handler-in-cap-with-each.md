---
layout: post
title: Defining a custom 'after' handler in CAP with 'each'
date: 2024-05-09
tags:
  - cap
  - javascript
---
Adding [custom logic](https://cap.cloud.sap/docs/get-started/in-a-nutshell#adding-custom-logic) to your CAP services is easy, and you can register event handlers with the [`before`, `on` and `after` methods](https://cap.cloud.sap/docs/node.js/core-services#srv-on-before-after).

## Handlers registered with the 'after' method

Handlers registered with the `after` method are called once the default handling of a request is done, so that you have a comfortable and convenient chance to enhance or otherwise adjust the data before the response is sent back.

By default, the data is passed to your handler function as the first argument[<sup>1</sup>](#footnotes), in the form of an array of objects, where each object represents a record.

> In the case of where the service is exposed via the OData protocol, for example, note that this is true for both OData QUERY operations, where you'd expect an entity set, and OData READ operations too, where you only expect a single entity. In other words, even when only a single record is requested, the record is supplied as the first argument to your handler as a single object ... within an array.

To illustrate, let's first create a fresh test CAP project, initiated it with the "tiny-sample" facet to give us a super simple service exposing two book records[<sup>2</sup>](#footnotes):

```shell
cds init --add tiny-sample eachtest && cd $_
```

Here's what such a handler might look like, in the context of a service implementation in `srv/cat-service.js`:

```javascript
const cds = require('@sap/cds')
const log = cds.log('eachtest')
module.exports = cds.service.impl(function() {
    this.after('READ', 'Books', books => log(books))
})
```

When an entity set is requested, like this:

```shell
curl 'localhost:4004/odata/v4/catalog/Books'
```

then we can see from the CAP server log output that an array of two objects is provided via the first parameter `books` in the handler definition:

```log
[odata] - GET /odata/v4/catalog/Books
[eachtest] - [
  { ID: 1, title: 'Wuthering Heights', stock: 100 },
  { ID: 2, title: 'Jane Eyre', stock: 500 }
]
```

Note also that even when a single record (entity) is requested:

```shell
curl 'localhost:4004/odata/v4/catalog/Books(1)'
```

it is still provided within an array:

```log
[odata] - GET /odata/v4/catalog/Books(1)
[eachtest] - [ { ID: 1, title: 'Wuthering Heights', stock: 100 } ]
```

## The special name 'each' 

Those of you who have been developing with CAP for a while may recall a variant for `after` handlers where if you used the name `each` for the first parameter in the definition, that handler would be called _once per record_ rather than a single time with all records.

Changing the parameter name from `books` to `each` like this:

```javascript
module.exports = cds.service.impl(function() {
    this.after('READ', 'Books', each => log(each))
})
```

results in a call to the handler for _each_ record. The same entity set request:

```shell
curl 'localhost:4004/odata/v4/catalog/Books'
```

now results in two `[eachtest]` log records, implying two separate calls to the handler function:

```log
[odata] - GET /odata/v4/catalog/Books
[eachtest] - { ID: 1, title: 'Wuthering Heights', stock: 100 }
[eachtest] - { ID: 2, title: 'Jane Eyre', stock: 500 }
```

Note that this time there is no enclosing array, to underline the nature of what this `each` name implies.

## A better way to achieve the 'each' behaviour

While convenient, special behaviour determined by the choice of parameter name can be confusing and - where the code is modified before execution e.g. via minification - may become unstable or unpredictable.

Instead, the CAP team have added a different convenience feature for the registration of `after` handlers, so that you can still choose to enjoy the once per record behaviour, but be more explicit about it, and avoid any risk of instability.

All you have to do is to use the value `each` for the event parameter (the first parameter) in the registration for an `after` handler. This is instead of the standard `READ` value (this in turn implies that this behaviour is still only valid for the reading of records).

To illustrate, let's modify the handler registration so it now looks like this:

```javascript
module.exports = cds.service.impl(function() {
    this.after('each', 'Books', book => log(book))
})
```

The behaviour is the same, in that the handler function is called once per record, as we can see by making the same OData QUERY operation again:

```shell
curl 'localhost:4004/odata/v4/catalog/Books'
```

and observing from the log output that the handler function is called once for each record:

```log
[odata] - GET /odata/v4/catalog/Books
[eachtest] - { ID: 1, title: 'Wuthering Heights', stock: 100 }
[eachtest] - { ID: 2, title: 'Jane Eyre', stock: 500 }
```

This approach is a lot more obvious, less prone to misunderstandings, and stable.

> The old behaviour invoked by using `each` as the name of the first parameter in the handler function is still supported for now, to avoid breaking existing code.

If you're interested to learn more, you can check out the changes to [Capire](https://cap.cloud.sap/docs/) in pull request 775 [Document .after('each', ...) handler](https://github.com/cap-js/docs/pull/775).

---
<a name="footnotes"></a>
## Footnotes

(1) Often you only need to define a parameter to receive this first argument, but actually there's a second argument passed to `after` handlers, which is the request itself, just in case you need something from it to fulfil the logic you want to implement. In this case, you'd probably want something like `(data, req)` as your function signature.

(2) For more on the "tiny-sample" facet, see this YouTube Short: [Use the "tiny sample" feature on new CAP projects to get started quickly](https://www.youtube.com/shorts/yrzcoU6Ge3k).
