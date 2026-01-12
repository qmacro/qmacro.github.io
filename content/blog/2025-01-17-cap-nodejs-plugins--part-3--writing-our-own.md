---
title: CAP Node.js plugins - part 3 - writing our own
description: This blog post accompanies part 3 of a three part series where we explore the CDS Plugin mechanism in CAP Node.js to find out how it works. In part 1 we looked at the plugin mechanism itself and how it worked. In part 2 we used the cds REPL to start our CAP service running and to introspect it. In this part we'll use what we learned and discovered in the first two parts to write our own plugin.
date: 2025-01-17
tags:
  - capnodejsplugins-series
  - cap
  - cds
  - plugins
  - javascript
---

For information on the series and links to all resources, see the [CAP Node.js Plugins][1] series post.

> The examples in this post are based on CAP Node.js at release 8.6 ([December 2024][2]).

## Continuing from where we left off last time

We finished part 2 [with a function][3] that we named `loudElements` which gave us a summary of entities in our service, and which elements (if any) were annotated with `@loud`.

In fact, using the word "service" here in the singular prompts me to want to make things a tiny bit more interesting, or at least illustrative, by defining a second service, and a further entity within. This is so we can see for ourselves how universal introspection can be.

Let's keep things simple from a mechanics perspective, introduce a simple new entity, `Colours`, in the context of the Platonic [Theory of forms][4] and annotate its string element with `@loud`. There's no reason for this departure to the philosophical except to have something a little more adventurous than "Foo"s and "Bar"s.

In addition, we'll add a `String` element to the `Things` entity in the original service, but _not_ annotate that with `@loud`.

This is what we then end up with in `services.cds`:

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

File: **data/Bookshop.Things.csv**

```csv
ID,name
1,apple
2,banana
3,cherry
```

File: **data/PlatonicForms.Colours.csv**

```csv
ID,name
1,Red
2,Green
3,Blue
```

Now, with this second service, we have to be more ready to process any service we come across; remember that in part 2 we explicitly picked out the `Bookshop` service by name:

```javascript
{ Bookshop } = cds.services
```

But in this part we'll address (almost) the entirety of `cds.services`.

## Identifying application services

In addressing the entirety of `cds.services` we'll need to ensure we pick out only "our" services, i.e. not the core framework's services such as the database service.

Starting up the cds REPL with the `--run` option (from the [CAP December 2024 release][5], and [as noted][6] in the blog post for the previous part) we see the list of services `db`, `Bookshop` and `PlatonicForms`:

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

In other words, it will be useful to have a helper so that we can pick out "our" services, something like this:

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

The plugin needs to be ready to inject the custom behavior at the right time, i.e. once the CAP server is started and all the services have been bootstrapped. As well as regular events such as before, on or after a request, the CAP server itself also sports [lifecycle events][8], and the [served][9] event is ideal for what we need.

Let's add some simple code inside a handler for `served`, in our plugin (i.e. in `loud/cds-plugin.js`), adding the definitions of `basicInfo`, `isAppService` and `loudElements`, and grabbing the service list into an array:

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

    const services = [...cds.services].filter(isAppService)

    log.debug(services.map(basicInfo))

})
```

> When there are no arguments expected or needed, I like the "underscore as parameter placeholder" style of arrow function expressions, i.e. (`_ => { ... }`) but you might prefer the "empty list" style i.e. (`() => { ... }`).

Starting up the server:

```shell
DEBUG=LOUD cds w
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

We'll replace this line, in the handler above:

```javascript
log.debug(services.map(basicInfo))
```

with something that actually works through those services and does the right thing.

As a reminder, this is to be a super simple plugin that uppercases string values for elements annotated with `@loud`. Let's use one of the best features of the set of [design time tools][10] to iterate towards what we need - the auto restart of the CAP server on changes.

### Identifying the element candidates

First, replacing that `log.debug` line with this:

```javascript
services.forEach(s => {

    [...s.entities]

        // Produce a summary of entities and any annotated elements
        .map(loudElements)

        // Only keep entities that have a non-zero list of annotated elements
        .filter(x => x.elements.length)

        // Temporarily emit what we end up with
        .forEach(x => log.debug(`${x.name} -> ${x.elements}`))

})
```

gives us the following two lines in the CAP server output (when running with `DEBUG` set on for our `LOUD` logger identifier, of course):

```log
[LOUD] - Bookshop.Books -> genre
[LOUD] - PlatonicForms.Colours -> name
```

### Setting up a handler to provide the effect

At this point we have everything we need. To bring about the "loud" effect, we can hook ourselves onto the regular processing of read events for the appropriate entities; in other words, we can register [after][11] phase handlers.

Let's replace that inner `.forEach(x => log.debug(...)` part within the function chain above, with a new function that does this. The entire resulting outer `forEach` should now look like this:

```javascript
services.forEach(s => {

    [...s.entities]

        // Produce a summary of entities and any annotated elements
        .map(loudElements)

        // Only keep entities that have a non-zero list of annotated elementd
        .filter(x => x.elements.length)

        // Process each entity, setting up a READ handler
        .forEach(en => {
            log(`Setting up a READ handler for ${en.name}`)
            s.after(`READ`, en.name, records => {
                records.forEach(r =>
                    en.elements.forEach(el => r[el] = r[el].toUpperCase())
                )
            })
        })
})
```

Remember that the `@loud`-annotated elements are stored in the `elements` property of the entity in `en`, i.e. `en.elements`, so we can just iterate over them (`en.elements.forEach`) converting the values using `toUpperCase()`.

At this point when the server restarts, we see this in the debug output:

```log
[LOUD] - Setting up a READ handler for Bookshop.Books
[LOUD] - Setting up a READ handler for PlatonicForms.Colours
```

### Checking the effect

That's all we need to do. We can check the effect with some HTTP requests:

```shell
$ curl -s localhost:4004/odata/v4/bookshop/Books | jq .
{
  "@odata.context": "$metadata#Books",
  "value": [
    {
      "ID": 1,
      "title": "The Hitchhiker's Guide To The Galaxy",
      "genre": "SCIENCE FICTION",
      "stock": 42
    }
  ]
}
```

The value for the `genre` element is uppercased, and the value for `title` is not, as that element is not annotated with `@loud`.

Also, none of the strings for `Things` are uppercased:

```shell
$ curl -s localhost:4004/odata/v4/bookshop/Things | jq .
{
  "@odata.context": "$metadata#Things",
  "value": [
    {
      "ID": 1,
      "name": "apple"
    },
    {
      "ID": 2,
      "name": "banana"
    },
    {
      "ID": 3,
      "name": "cherry"
    }
  ]
}
```

Finally, the string values for the `name` element of the `Colours` entity in the `PlatonicForms` service are uppercased, as that element is annotated with `@loud`:

```shell
$ curl -s localhost:4004/odata/v4/platonic-forms/Colours | jq .
{
  "@odata.context": "$metadata#Colours",
  "value": [
    {
      "ID": 1,
      "name": "RED"
    },
    {
      "ID": 2,
      "name": "GREEN"
    },
    {
      "ID": 3,
      "name": "BLUE"
    }
  ]
}
```

That's pretty much it!

## Wrapping up

And that's it for this mini-series too. Of course, this is just scratching the surface of what's possible, but hopefully you can see how straightforward it is to create your own plugin. And perhaps the main takeaways from what we've seen are:

- the REPL is one of CAP's greatest superpowers, and can be one of your superpowers too
- introspection is straightforward and brings you and your understanding closer to the CAP mechanics and philosophy
- getting a plugin to do something doesn't require any "special" code, it's just events and handlers all the way down

[1]: /blog/posts/2024/12/30/cap-node-js-plugins/
[2]: https://cap.cloud.sap/docs/releases/dec24
[3]: /blog/posts/2025/01/10/cap-node-js-plugins-part-2-using-the-repl/#identifying-the-elements-annotated-with-loud
[4]: https://en.wikipedia.org/wiki/Theory_of_forms
[5]: https://cap.cloud.sap/docs/releases/dec24#cds-repl-enhancements
[6]: /blog/posts/2025/01/10/cap-node-js-plugins-part-2-using-the-repl/#new-repl-options
[7]: https://dcl-prog.stanford.edu/function-predicate.html
[8]: https://cap.cloud.sap/docs/node.js/cds-server#lifecycle-events
[9]: https://cap.cloud.sap/docs/node.js/cds-server#served
[10]: /blog/posts/2024/11/07/five-reasons-to-use-cap/#design-time-tools
[11]: https://cap.cloud.sap/docs/node.js/core-services#srv-after-request
