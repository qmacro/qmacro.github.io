---
title: Local-first dev with CAP Node.js - mocking messaging
date: 2026-05-15
tags:
  - cap
  - messaging
  - mocking
  - local
description: In this post I provider a taster of what's possible regarding mock messaging in CAP Node.js local-first development.
---

This post is one of [a series on local-first development with CAP
Node.js](/blog/posts/2026/05/11/local-first-dev-with-cap-node-js/).

## Everything is an event

In [Five reasons to use CAP](/blog/posts/2024/11/07/five-reasons-to-use-cap/),
we see that [everything is an
event](/blog/posts/2024/11/07/five-reasons-to-use-cap/#:~:text=%22Everything%20is%20an%20event%22).
Whether synchronous, such as via HTTP requests and responses for OData
operations, or asynchronous, where messages are emitted and received for
decoupled service-to-service communications.

The [Messaging](https://cap.cloud.sap/docs/node.js/messaging) topic in Capire
has a great overview and an explanation of all the different message brokers
that can be used. And there's one that is well suited for local-first
development: [File
based](https://cap.cloud.sap/docs/node.js/messaging#file-based) messaging.

## Working through an example

In this post, we'll work through an example of mocking messaging using the
file-based facility, with content in the
[messaging/](https://github.com/qmacro/cap-nodejs-local-first-development/tree/main/messaging)
directory of the repo set up for the related
[talk](/blog/posts/2026/05/11/local-first-dev-with-cap-node-js/#talk).

The setup is a little different to the other mock examples in this series.
First, there are two CAP services that will be in play. Second, neither of them
have any entity definitions; in fact, only one has a CDS model at all, and that
only has a service definition with an action and an event defined within it.

### The containing project definition

Usually in an asynchronous event scenario there is an emitter and a receiver,
and that's what we have here. They're both found within the `messaging/`
directory, which is the containing project for this example, and has been set
up to use the Node.js
[workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces) concept, with
this as the definition in `package.json`:

```json
{
  "name": "@qmacro/messaging",
  "workspaces": [
    "*"
  ]
}
```

### Examining the emitter

Within the `emitter/` subdirectory we have a CAP project which has been put
together in the form of a package (like a
[plugin](/blog/posts/2024/12/30/cap-node-js-plugins/) would be). The name
declared in `emitter/package.json` is `@qmacro/emitter` and as well as the content in
`srv/` there's also a project root level `emitter/index.js` which acts as the package
entry point and contains:

```javascript
using from './srv/main';
```

#### The emitter service definition

This emitter is where the service definition is found, which looks like this,
in `emitter/srv/main.cds`:

```cds
namespace org.qmacro.emitter;

@rest
service EmitterService {
  action greet(greeting: String) returns String;

  event Greeting.Received {
    info : String;
  }
}
```

The service defines:

- an action endpoint `greet`
- an event `Greeting.Received`

Note that while the term "action" has loaded meaning in the context of OData,
it also serves to define a POST based "RPC" style target that is valid even
in the context of the "REST" protocol, as declared here. The design of the
event and also the signature of the action endpoint is deliberately as simple
as possible for this example.

As we'll see shortly, to have an event be emitted in this example scenario, we
need to make an HTTP POST request to the `/greet` endpoint, with a payload body
containing the greeting data.

#### The emitter service implementation

Every action definition needs an implementation, and this is what we have in
`emitter/srv/main.js`:

```javascript
const cds = require('@sap/cds')
const log = cds.log('emitter')

module.exports = cds.service.impl(async function() {
  this.on('greet', async (req) => {
    const emitter = await cds.connect.to('org.qmacro.emitter.EmitterService')
    log(`emitting Greeting.Received (${req.data.greeting})`)
    await emitter.emit('Greeting.Received', { info: req.data.greeting })
    return 'OK'
  })
})
```

And that's pretty much it!

### Messaging configuration

But upon what messaging mechanism are we relying here? Well, that's defined as
a requirement in the emitter's `emitter/package.json`:

```json
{
  "name": "@qmacro/emitter",
  ...
  "cds": {
    "requires": {
      ...
      "messaging": {
        "kind": "file-based-messaging"
      }
    }
  }
}
```

The value `file-based-messaging` is what we want here, as described in [the
corresponding Capire
section](https://cap.cloud.sap/docs/node.js/messaging#file-based) where it
tells us that a file is used as the message broker; that is, the emitter writes
messages to the file, and the receiver reads (and then removes) messages from
that file.

By default the file is `~/.cds-msg-box`. This fits with the general approach of
using hidden files in the developer's home directory (`~/.cds-services.json` is
another example), emphasising the point that this is design-time only, i.e.
only for used in a local development context.

### Examining the receiver

The receiver in this setup is even simpler. It relies upon the emitter package,
and defines it as a required service, in `receiver/package.json`:

```json
{
  "name": "@qmacro/receiver",
  ...
  "dependencies": {
    "@qmacro/emitter": "*"
  },
  ...
  "cds": {
    "requires": {
      ...
      "EmitterService": {
        "service": "org.qmacro.emitter.EmitterService",
        "model": "@qmacro/emitter"
      },
      "messaging": {
        "kind": "file-based-messaging"
      }
    }
  }
}
```

Like the emitter, it also defines a requirement on `file-based-messaging`.

#### The receiver implementation

There's no CDS model in this simple receiver setup, just an implementation that
is in the form of a [custom
server](https://cap.cloud.sap/docs/node.js/cds-server#override-cds-server) in
`receiver/server.js`:

```javascript
const cds = require('@sap/cds')
const log = cds.log('receiver')
const eventID = 'Greeting.Received'

cds.once('served', async () => {
  log(`Setting up listener for ${eventID}`)
  const EmitterService = await cds.connect.to('EmitterService')
  EmitterService.on(eventID, (msg) => {
    log('received:', msg.event, msg.data)
  })
})
```

Once the CAP server has started up, a connection to the emitter service is made
and a handler is registered for the `Greeting.Received` event.

And that's all we need!

### Trying it out

We can try the entire construct out step by step to see what's going on. All
the following invocations are based on being in the `messaging/` project root
directory.

Before we start, we'll install the dependencies from the project root with:

```bash
npm install
```

#### Starting up the emitter

Now, let's start the emitter up, and we'll specify `DEBUG` level for the
`queue` component(s) for a more detailed insight as to what happens:

```bash
DEBUG=queue cds watch emitter
```

We should see some familiar log output (some lines have been omitted for
brevity):

```log
[cds] - using bindings from: { registry: '~/.cds-services.json' }

[queue] - Using non-scheduling-based event queue processing
[cds] - connect to messaging > file-based-messaging
[cds] - serving org.qmacro.emitter.EmitterService {
  at: [ '/rest/emitter' ],
  decl: 'emitter/srv/main.cds:4',
  impl: 'emitter/srv/main.js'
}
[cds] - server listening on { url: 'http://localhost:4006' }
```

The `file-based-messaging` mechanism is brought into play, just before our
emitter service is served.

> Port 4006 is selected by means of the value in `emitter/.env`; it has no
> special significance, except that it's one of a few ports (4004-4006 and
> 9229) that I publish in my dev container in which I do all my work.

The service is registered in the local development binding registry
`~/.cds-services.json`:

```json
{
  "cds": {
    "provides": {
      "org.qmacro.emitter.EmitterService": {
        "endpoints": {
          "rest": "/rest/emitter"
        },
        "server": 35678
      }
    },
    "servers": {
      "35678": {
        ...
      }
    }
  }
}
```

As we've seen in another blog post in this series, on [mocking remote
services](/blog/posts/2026/05/13/local-first-dev-with-cap-node-js-mocking-remote-services/),
this registry serves to provide information on services provided and required.

#### Invoking the greet action

Normally at this point it would make sense to start up the receiver, to have
the fully coordinated asynchronous setup. But we want to see things happen step
by step, and if we were to start the receiver now, any message generated and
emitted would be immediately consumed and we wouldn't see it "in transit".

So at this point we'll invoke the `greet` action that the emitter exposes, to
have a message emitted.

```bash
curl \
  --url "localhost:4006/rest/emitter/greet" \
  --data '{"greeting":"Understanding is everything!"}'
```

From this, we get a simple `OK`, as we'd expect from the [emitter service
implementation](#the-emitter-service-implementation). More interesting is what
we see in the server log:

```log
[rest] - POST /rest/emitter/greet
[emitter] - emitting Greeting.Received (Understanding is everything!)
[persistent-queue] - queue: Write message to queue
[persistent-queue] - queue: Fetch messages
[persistent-queue] - queue: Process 1 message
[persistent-queue] - queue: Messages modified (-1, ~0, +0)
[persistent-queue] - queue: Done
```

While the `[rest]` log record is just recording the incoming POST request, and
the `[emitter]` log record was written by the emitter implementation (see
above), most notably we see the core messaging mechanism in action, handling the
queuing of the message. After all, queueing is a core part of everything that
is asynchronous.

#### Looking at the message queue

As we know, the [file based messaging](https://cap.cloud.sap/docs/node.js/messaging#file-based) uses `~/.cds-msg-box` by default as the queue. And if we look at that right now:

```bash
cat ~/.cds-msg-box
```

we see the message, "in transit", as it were (formatted here for easier reading):

```text
org.qmacro.emitter.EmitterService.Greeting.Received {
  "data": {
    "info": "Understanding is everything!"
  },
  "headers": {
    "x-correlation-id": "80f83122-ecb7-49aa-8cdd-c465e2588374"
  }
}
```

Half-way there!

#### Starting up the receiver

Now we've had a chance to examine the queue, we can start up the receiver:

```bash
cds watch receiver
```

```log
[cds] - bootstrapping from { file: 'receiver/server.js' }
...
[queue] - Using non-scheduling-based event queue processing
[cds] - connect to messaging > file-based-messaging
...
[receiver] - Setting up listener for Greeting.Received
[cds] - server listening on { url: 'http://localhost:4005' }
```

And directly following this, we see:

```log
[receiver] - received: Greeting.Received { info: 'Understanding is everything!' }
```

Not only that, but the queued message in `~/.cds-msg-box` is now gone. Consumed!

## Wrapping up

Asynchronous messaging is yet another fundamentally important aspect of real
life service design, delivery and orchestration, and we have no reason to put
off designing and building that in our projects, as we can incorporate local
mocking from the very start.

By the way, for automated tests, you might even want to look at [local
messaging](https://cap.cloud.sap/docs/node.js/messaging#local-messaging) which
takes place in-process, a little bit like in-process remote-service mocking,
and is very useful for automated testing.

