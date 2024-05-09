---
layout: post
title: Controlling automatic HTTP requests in CAP Node.js design time loops
date: 2024-05-03
tags:
  - cap
  - good-to-know
  - entr
---
CAP affords developers a great design time experience, with minimal setup and fast turnaround times when building out your model and code. Often what I like to do is run an OData query operation to check both the data returned and any custom logic that I'm implementing. And I want that to happen automatically when I modify something. The invocation of `cds watch` already provides most of the monitor-and-restart magic that I need, but I also want a separate process to (re-)send an HTTP request to the CAP server when it's restarted.

The key phrase here is "when it's restarted".

## Using entr

In my terminal sessions, I use the excellent [entr](https://github.com/eradman/entr) tool to run commands when files change. You feed it names of files to watch (you can use globs too) and tell it what to run when any of those files change. For a super simple example, if I wanted the date to be emitted each time any service implementation file in the `srv/` directory changed, I'd run this:

```shell
ls srv/*.js | entr date
```

So to get an OData query operation to be performed, I can do something like this:

```shell
ls srv/*.js \
  | entr bash -c 'curl -s localhost:4004/service/Entity | jq .'
```

## Timing

The challenge here is that while `cds watch` and `entr` are both monitoring files, what happens is that when something changes, the CAP server will be restarted (via the monitor-and-restart magic), and the HTTP request will be made via `curl`. And sometimes, the CAP server startup takes a second or two, by which time the `curl` command will have already been issued, too early, and therefore no response will have been received.

## CAP server lifecycle events

The CAP server has a number of [events that are emitted at various points in its lifecycle](https://cap.cloud.sap/docs/node.js/cds-server#lifecycle-events). One of these events is [listening](https://cap.cloud.sap/docs/node.js/cds-server#listening) which is emitted "_when the server has been started and is listening to incoming requests_".

This sounds like the perfect match to align with the `entr`-initiated `curl` command.

## Custom server.js

In the [same main section](https://cap.cloud.sap/docs/node.js/cds-server) as the list of CAP server lifecycle events is a section on creating your own [custom server.js](https://cap.cloud.sap/docs/node.js/cds-server#custom-server-js), where "_you can plug in to all parts of `@sap/cds`_".

Here's a custom `server.js` implementation that I use to match the timing of the `curl` command to the right time after the server has restarted, so it doesn't try to make the request before the server is ready.

```javascript
const fs = require('node:fs/promises')
require('@sap/cds').on('listening', async () => {
    await fs.writeFile('listening', '')
})
```

It's as simple as you can get, and just writes an empty file called `listening` in the project root directory every time the "listening" event is emitted, which is each time the CAP server is restarted and has got to the point where it's ready to receive HTTP requests.

Now, with this `server.js` file in my CAP project root directory, I can feed `entr` with the name of this file, and it will only run and re-run the `curl` command to send the HTTP request ... when the CAP server is ready for it.

## Demo

Here's a simple demo of this approach in action.

![entr invoking curl on listening change](/images/2024/05/entr-curl-listening.gif)

A bit of a nerdy hack, perhaps, but still ... good to know!

## Post script

There's another CAP server lifecycle event I can use to clean up (remove) the `listening` file; sometimes I want to do that, sometimes I don't. When I do, I just use the `shutdown` event, and chain another `on()` like this:

```javascript
const fs = require('node:fs/promises')
require('@sap/cds')
    .on('listening', async () => await fs.writeFile('listening', ''))
    .on('shutdown', async () => await fs.unlink('listening'))
```

The  side effect is that when the `shutdown` event happens and the `listening` file is removed, the running `entr` process terminates like this:

```log
entr: cannot open 'listening': No such file or directory
```

This termination is actually often what I want anyway. YMMV.
