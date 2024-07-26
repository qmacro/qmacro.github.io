---
layout: post
title: Automatic validation in OData and REST calls with CAP
date: 2024-07-24
tags:
  - cap
  - cds
  - rest
  - odata
---
There is automatic validation of data coming into CAP-based service endpoints. Up until recently, there was a difference on how this happened between "REST" and OData channels, but with the latest CAP major release the handling has been aligned. This blog post digs into the details, focusing on the Node.js flavour of CAP.

## Introduction

CAP services are served by default via the OData V4 protocol. If you annotate a service definition with: `@protocol: 'rest'` or simply `@rest` then it will be served via the "REST" protocol. I put REST in quotes as of course REST is not a protocol, it's an architectural style. But that's [another discussion](https://qmacro.org/tags/rest/). Think of this "REST" protocol here as a slimmed down little brother of the OData V4 protocol, without a lot of the metadata context. In fact, one can think of these [protocols](https://cap.cloud.sap/docs/node.js/cds-serve#protocol), in their use in exposing services, as "channels", or "adapters".

Last month saw a new [major release](https://cap.cloud.sap/docs/releases/jun24#new-majors-cds8-cap-java-3) of CAP Node.js, bringing it to version 8. With that major release came [new protocol adapters](https://cap.cloud.sap/docs/releases/jun24#new-protocol-adapters-ga) for OData V4 and "REST". Before version 8, i.e. up until very recently, the libraries in CAP for handling incoming OData V4 based and "REST" based requests have been separate, and had different behaviours.

## Example base

To illustrate aspects of protocol handling in this blog post, I'll use a simple CDS model in `services.cds` that looks like this:

```cds
@rest  @path: '/rest'
service rest {
    action a(x : Integer)
}

@odata  @path: '/odata'
service odata {
    action a(x : Integer)
}
```

There are two service definitions, each with the same simple unbound action `a` that expects a single integer parameter called `x`. One service is called `rest` and is exposed via the "REST" protocol at path `/rest`, and the other is called `odata` and is exposed via the OData V4 protocol at path `/odata`.

The section of the OData metadata definition (available at `/odata/$metadata`) for action `a` looks like this:

```xml
<Schema Namespace="odata" xmlns="http://docs.oasis-open.org/odata/ns/edm">
  <EntityContainer Name="EntityContainer">
    <ActionImport Name="a" Action="odata.a"/>
  </EntityContainer>
  <Action Name="a" IsBound="false">
    <Parameter Name="x" Type="Edm.Int32"/>
  </Action>
</Schema>
```

Here's what the implementation file `service.js` looks like:

```javascript
const cds = require('@sap/cds')
const log = cds.log('qmacro')

class S extends cds.ApplicationService {
    async init() {
        this.on('a', req => log(`${req.protocol}: ${JSON.stringify(req.data)}`))
        return super.init()
    }
}

['rest', 'odata'].forEach(x => module.exports[x] = S)
```

Basically the same class `S` is used for each of the two services, and all this class really contains is the registration of a handler for the `a` event (via `this.on`) that logs the protocol (either `rest` or `odata`) from the incoming request plus a stringified version of the data received. It doesn't return anything, which aligns with the fact that there's no return type defined for the action. So, nice and simple.

OK, back to the narrative.

## Pre version 8 history

The separate nature of the two protocol adapters in question meant that there could be &mdash; and indeed were &mdash; different implementations and levels of support for receiving, checking, processing and dispatching incoming requests.

Let's look at the OData V4 protocol adapter first. This was based on an existing library called `okra`, which you may well have seen in any stack trace style error messages, for example:

```text
node_modules/@sap/cds-runtime/lib/cds-services/adapter/
  odata-v4/okra/odata-commons/uri/ExpandParser.js
```

(split over two lines for readability).

### OData validation

OData in general is rather strict on what data can be passed to a function or an action. Taking the definition of action `a` in the metadata above, if we were to make the following HTTP request:

```shell
curl \
  -H 'Content-Type: application/json' \
  -d '{"x":42}' \
  cap:4004/odata/a
```

which looks like this on the wire:

```log
POST /odata/a HTTP/1.1
Host: cap:4004
Content-Type: application/json
Content-Length: 8

{"x":42}
```

then the request would be received, accepted as valid and sent to the service implementation for processing. We also see this in the log output from the server, via the anonymous function we wired up as a handler for the `a` event earlier:

```log
[qmacro] - odata-v4: {"x":42}
```

However, if we were to make the following HTTP request (note the `z` property name instead of `x` in the JSON payload):

```shell
curl \
  -H 'Content-Type: application/json' \
  -d '{"z":42}' \
  cap:4004/odata/a
```

then we'd get an HTTP 400 error response with the following in the payload:

```json
{
  "error": {
    "code": "400",
    "message": "Deserialization Error: 'z' is not a non-binding parameter of action 'a'."
  }
}
```

The fact that the status code is in the 400 range tells us that _we_ are to blame. Harsh, but fair. This type of rejection will keep happening as long as we send payloads in our requests that don't match the shape described for the action in the metadata.

### REST validation

Still pre version 8, the validation is looser for the same action in the service when served via the "REST" protocol adapter.

Sending the same valid call (i.e. with parameter `x`) but to the "REST" exposed endpoint, like this:

```shell
curl \
  -H 'Content-Type: application/json' \
  -d '{"x":42}' \
  cap:4004/rest/a
```

also results in a successful handling of the request, and a line line this output to the log:

```log
[qmacro] - rest: {"x":42}
```

However, the same "incorrect" call (i.e. with the parameter named `z` instead of `x`) is in fact _received and accepted_ by the "REST" protocol adapter.

Yet what appears in the log output is not this:

```log
[qmacro] - rest: {"z":42}
```

but this:

```log
[qmacro] - rest: {}
```

What happens is that anything not recognised according to the action's signature ... is discarded. The `z` parameter wasn't recognised, and thus discarded, leaving an empty object `{}`. We can dig in a little more by trying a call like this, with a correct main parameter `x` but with another parameter too, expressed as another property in the JSON object:

```shell
curl \
  -H 'Content-Type: application/json' \
  -d '{"x":42,"name":"qmacro"}' \
  cap:4004/rest/a
```

The request is received, accepted and handled successfully, except that the log output shows that the value for the `name` parameter, i.e. the entire property in the JSON object, was discarded before it reached the handler:

```log
[qmacro] - rest: {"x":42}
```

In case you're wondering, if we sent this same payload to the service via the OData protocol adapter, we'd get an error, of course:

```json
{
  "error": {
    "code": "400",
    "message": "Deserialization Error: 'name' is not a non-binding parameter of action 'a'."
  }
}
```

#### Taking advantage

A fascinating aspect here is that this discarding of unrecognised properties only happens ... with objects (at the JSON level). Look what happens when a different shaped JSON value is passed in the payload - an array:

```shell
curl \
  -H 'Content-Type: application/json' \
  -d '[1,2,3]' \
  cap:4004/rest/a
```

The request is received, accepted and handled successfully, but this time, nothing is discarded, and the handler receives the entire value (in `req.data`). Look what is emitted in the log:

```log
[qmacro] - rest: [1,2,3]
```

> This, incidentally, is how I was able to [send a plain array of numbers from the TESTER in Task 6 of this month's SAP Developer Challenge](https://community.sap.com/t5/application-development-discussions/task-6-api-endpoint-with-payload-required-july-developer-challenge-quot/m-p/13765529#toc-hId-430780965):
> 
> ```log
> POST /rest/plain/highestValue HTTP/1.1
> Host: localhost:8000
> Content-Type: application/json
> Content-Length: 19
> 
> [54, 203, -3, 0, 1]
> ```
> 
> and still expect participants' handlers to be able to receive and process that array :-)
> 
> This was quite subtle, and [very well spotted by member MioYasutake](https://community.sap.com/t5/application-development-discussions/task-6-api-endpoint-with-payload-required-july-developer-challenge-quot/m-p/13766999/highlight/true#M2029250)!
 
OK. So all of that was pre-major version 8 of CAP Node.js. All the examples here were taken from a test setup using [@sap/cds-dk version 7.9.6](https://www.npmjs.com/package/@sap/cds-dk/v/7.9.6).

Things have changed quite significantly, and for the better, with version 8.

## New protocol adapter behaviour in version 8

As mentioned in the [release notes](https://cap.cloud.sap/docs/releases/jun24), the team have [completely reimplemented the adapters for OData and "REST"](https://cap.cloud.sap/docs/releases/jun24#new-protocol-adapters-ga) for CAP Node.js. 

The notes mention that the "_code base of `@sap/cds` is reduced by a factor of 2_". One of the main reasons for this is that both protocol adapters share the same code for much of what they need to do. And that includes the receipt, validation and acceptance of data in incoming requests.

You can see where this is going, right? Yes, this means that requests coming in via either adapter will be subject to stricter checking, driven by the stricter OData standard. But that's OK, as they're more similar than one would think (mostly because, as I keep saying, there's no such thing as a REST protocol, there has to be something more concrete, and that more concrete thing is something _based on_ the OData V4 standard).

### Stricter validation all round

What does this mean for us? Well, trying any of the "incorrect" requests that we made to the `/rest/a` endpoint earlier now results in rejection. For example, the array of integers (`[1,2,3]`) is rejected thus:

```log
{
  "error": {
    "code": "400",
    "message": "Property \"0\" does not exist in rest.a"
  }
}
```

(The reference to property `"0"` is based on the fact that in JavaScript, "everything is an object").

<a name="opentypes"></a>
### Open types

This isn't as bad as it seems!

You may (or may not) have come across the `OpenType` attribute in OData, specifically to be able to define an [entity type as being open](https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html#sec_OpenEntityType). This "_allows clients to add properties dynamically to instances of the type by specifying uniquely named property values in the payload used to insert or update an instance of the type._".

This `OpenType` feature is supported in CAP, in the form of a CDS model annotation `@open`, described in the [Open Types](https://cap.cloud.sap/docs/advanced/odata#open-types) section of Capire. What's more, this annotation can not only be applied to entity types and complex types, but also other definitions in the model ... such as actions!

If we annotate the action definitions in the CDS model, like this:

```cds
@rest  @path: '/rest'
service rest {
    @open action a(x : Integer)
}

@odata  @path: '/odata'
service odata {
    @open action a(x : Integer)
}
```

then all the previously "incorrect" payloads sent in requests to action `a` in either the `rest` or the `odata` service will be received, accepted as valid and passed to the handler.

Here's an example. Sending an incorrectly named parameter (`z` instead of `x`) plus an extra parameter (`name`) to the `@open`-annotated action in either the `rest` service or the `odata` service (the call to the `rest` service is shown here):

```shell
curl \
  -H 'Content-Type: application/json' \
  -d '{"x":42,"name":"qmacro"}' \
  cap:4004/rest/a
```

results in success, and everything sent is available in `req.data`:

```log
[qmacro] - odata: {"z":42,"name":"qmacro"}
```

Excellent!

## Wrapping up

Well, that just about wraps it up for this topic. Oh, there's one more thing to mention - in the [release note details for the new protocol adapters](https://cap.cloud.sap/docs/releases/jun24#new-protocol-adapters-ga), there's a note saying that the former adapters are now deprecated, and there's a config option `cds.features.odata_new_adapter` that can be set to `false` if you want to do some experiments in CAP Node.js version 8 with the old adapters.

And yes, you can see the difference when you start the CAP server. Starting it like this:

```shell
cds watch
```

i.e. without this config option, we see "using new OData adapter" in the log output (reduced here for brevity):

```log
[cds] - serving rest { impl: 'services.js', path: '/rest' }
[cds] - using new OData adapter
[cds] - serving odata { impl: 'services.js', path: '/odata' }
[cds] - server listening on { url: 'http://localhost:4004' }
[cds] - launched at 7/24/2024, 5:33:10 PM, version: 8.0.3, in: 408.851ms
[cds] - [ terminate with ^C ]
```

This is the new shared, consistent, OData-style strict mode that we now have with CAP Node.js version 8.

Starting it like this:

```shell
CDS_CONFIG='{"features":{"odata_new_adapter":false}}' cds watch
```

i.e. with this config option set, we see "using legacy OData adapter" in the log output (reduced here for brevity):

```log
[cds] - serving rest { impl: 'services.js', path: '/rest' }
[cds] - using legacy OData adapter
[cds] - serving odata { impl: 'services.js', path: '/odata' }
[cds] - server listening on { url: 'http://localhost:4004' }
[cds] - launched at 7/24/2024, 5:33:10 PM, version: 8.0.3, in: 408.851ms
[cds] - [ terminate with ^C ]
```

and we're back to pre version 8 behaviour.

OK, that's it!
