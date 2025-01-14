---
layout: post
title: CAP Node.js plugins - part 3 - writing our own
date: 2025-01-17
tags:
  - cap
  - cds
  - plugins
  - javascript
---
This blog post accompanies part 2 of a three part series where we explore the CDS Plugin mechanism in CAP Node.js to find out how it works. In part 1 we looked at the plugin mechanism itself and how it worked. In part 2 we used the cds REPL to start our CAP service running and to _introspect_ it. In this part we'll use the what we learned and discovered in the first two parts to write our own plugin.

For information on the series and links to all resources, see the [CAP Node.js Plugins][1] series post.

> The examples in this post are based on CAP Node.js at release 8.6 ([December 2024][2]).

<a name="picking-up-from-where-we-left-off-last-time"></a>
## Picking up from where we left off last time

We finished part 2 [with a function][3] `loudElements` that gave us a summary of entities in our service, and which elements (if any) were annotated with `@loud`. In fact, using the word "service" in the singular prompts me to make things a little more interesting, or at least illustrative, by defining a second service, and a further entity within. This is so we can see for ourselves how universal introspection can be.

Let's keep things simple from a mechanics perspective, and introduce a simple new entity, `Colours`, in the context of the Platonic [Theory of forms][4]. No reason for this departure to the philosophical except to have something a little more adventurous than "Foo"s and "Bar"s. In addition, we'll add a `String` element to the `Things` entity in the original service, but _not_ annotate that with `@loud`.

```cds
service Bookshop {
    entity Books {
        key ID          : Integer;
            title       : String;
            @loud genre : String;
            stock       : Integer;
    }

    entity Things {
        key ID   : Integer;
            name : String;
    }
}

service PlatonicForms {
    entity Colours {
        key ID         : Integer;
            @loud name : String;
    }
}
```

As well as the CSV data for the books, we'll add some for the things and colours:

**data/Bookshop.Things.csv**

```csv
ID,name
1,apple
2,banana
3,cherry
```
**data/PlatonicForms.Colours.csv**

```csv
ID,name
1,Red
2,Green
3,Blue
```

Now we're more ready to process any service we come across; in part 2 we explicitly picked out the `Bookshop` service:

```javascript
{ Bookshop } = cds.services
```

But in this part we'll address the entirety of `cds.services`.

## Identifying application services

In order to address the entirety of `cds.services` we'll need to ensure we pick out only "our" services, i.e. not the core framework's services such as the database service. Starting up the cds REPL with the `--run` option (from the [CAP December 2024 release][5], and [as noted][6] in the blog post for the previous part):

```shell
$ cds r -r .
Welcome to cds repl v 8.6.0 
[cds] - loaded model from 1 file(s):

  services.cds

...

Following variables are made available in your repl's global context:

...

from cds.services: {
  db,
  Bookshop,
  PlatonicForms,
}

Simply type e.g. PlatonicForms in the prompt to use the respective objects.
```

we see the list of services: `db`, `Bookshop` and `PlatonicForms`.

Moreover, examining the services as we did last time shows us what we need to know:

```log
> const basicInfo = x => [x.name, x.kind]
> [...cds.services].map(basicInfo)
[
  [ 'db', 'sqlite' ],
  [ 'Bookshop', 'app-service' ],
  [ 'PlatonicForms', 'app-service' ]
]
```

In other words, it will be useful to have a helper function so that we can pick out "our" services, something like this:

```javascript
const isAppService = x => x.kind = 'app-service'
```

With this we can gather our services into an array, thus:

```javascript
const services = [...cds.services].filter(isAppService)
```

While `basicInfo` is somewhat more useful in an interactive REPL session, this `isAppService` [predicate function][7] is going to help us in our real plugin code itself, along with `loudElements`, which, as a reminder, looks like this:

```javascript
const loudElements = en => ({
    name: en.name,
    entity: en,
    elements: [...en.elements].filter(el => el['@loud']).map(el => el.name)
})
```

## Getting the timing right

So far we've been working in the cds REPL, starting up the service on invocation, with the `--run` option, or once we are in the REPL, with e.g. `const test = cds.test()`. So by the time we start to introspect, to look at, say, `cds.services`, the server is already started up and values are available.

But what about at runtime? 

The plugin needs to be ready to inject the custom behavior at the right time, i.e. once the CAP server is started and all the services have been bootstrapped. As well as regular events such as before, on or after a request, the CAP server itself also sports [lifecycle events][8], and the [served][9] is ideal for what we need.

Let's add some simple code inside a handler for the `served` event, in our plugin (i.e. in `loud/cds-plugin.js`):

```javascript
const cds = require('@sap/cds')
const log = cds.log('LOUD')
log.debug('Starting up ...')

cds.once('served', _ => {

    const basicInfo = x => [x.name, x.kind]
    const isAppService = x => x.kind == 'app-service'
    const loudElements = en => ({
        name: en.name,
        entity: en,
        elements: [...en.elements].filter(el => el['@loud']).map(el => el.name)
    })

    log.debug([...cds.services].filter(isAppService).map(basicInfo))

})
```

> When there are no arguments expected or needed, I like the "underscore as parameter placeholder" style of arrow function expressions, i.e. (`_ => { ... }`) but you might prefer the "empty list" style i.e. (`() => { ... }`).

Starting up the server:

```shell
$ DEBUG=LOUD cds w
```

we see the debug output from our plugin:
 
```log
cds serve all --with-mocks --in-memory? 

...
 
[LOUD] - Starting up ...

...

[cds] - serving Bookshop { path: '/odata/v4/bookshop' }
[cds] - serving PlatonicForms { path: '/odata/v4/platonic-forms' }
[LOUD] - [ [ 'Bookshop', 'app-service' ], [ 'PlatonicForms', 'app-service' ] ]

...
```

Great, that's the timing sorted out. Now we just need to put everything together into that `served` lifecycle event handler.

## Fleshing out the plugin activities












[1]: /blog/posts/2024/12/30/cap-node.js-plugins/
[2]: https://cap.cloud.sap/docs/releases/dec24
[3]: /blog/posts/2025/01/10/cap-node.js-plugins-part-2-using-the-repl/#identifying-the-elements-annotated-with-loud
[4]: https://en.wikipedia.org/wiki/Theory_of_forms
[5]: https://cap.cloud.sap/docs/releases/dec24#cds-repl-enhancements
[6]: /blog/posts/2025/01/10/cap-node.js-plugins-part-2-using-the-repl/#new-repl-options
[7]: https://dcl-prog.stanford.edu/function-predicate.html
[8]: https://cap.cloud.sap/docs/node.js/cds-server#lifecycle-events
[9]: https://cap.cloud.sap/docs/node.js/cds-server#served
