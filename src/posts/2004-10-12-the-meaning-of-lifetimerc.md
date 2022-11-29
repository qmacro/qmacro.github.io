---
layout: post
title: The meaning of LIFETIME_RC
date: 2004-10-12
tags:
  - sapcommunity
---
Last week, during some preparation for my talk at TechEd on Thursday this week, I’d been wondering about something in the ICF that hadn’t seemed quite right. Interface `IF_HTTP_EXTENSION`, which is what every ICF handler must implement (in the form of a single method `HANDLE_REQUEST`) has a couple of attributes, `FLOW_RC` and `LIFETIME_RC`. `FLOW_RC` is for controlling the flow of handler dispatching for a request. `LIFETIME_RC` is for controlling the lifetime of handlers for a sequence of requests. To quote the [documentation at help.sap.com](https://help.sap.com/docs/SAP_NETWEAVER_AS_ABAP_751_IP/753088fc00704d0a80e7fbd6803c8adb/48d60603553b3e49e10000000a421937.html?locale=en-US&version=7.51.6) on the latter:

> HTTP request handlers can control the lifetime of their instances if they are operating in stateful mode … If the attribute `IF_HTTP_EXTENSION~LIFETIME_RC` is set to one of the following values, the HTTP request handler can specify whether the handler should be reinitiated for every request in a session, or whether the handler should be retained and reused for subsequent HTTP requests.

The default action is for the handler instance created to handle the request to be kept, so that instance-level data is retained (think of an incrementing counter value that keeps going up every new request). This is the equivalent of setting `LIFETIME_RC` to the value of the constant `CO_LIFETIME_KEEP`. But if `LIFETIME_RC` is set to the value of constant `CO_LIFETIME_DESTROY`:

> The current instance of the HTTP request handler is terminated after the request is processed. If stateful mode is active, a new instance of the HTTP request handler is created. This means that local data belonging to the instance is lost.

(This of course only makes sense in the context of stateful sessions, which you can create using the `SET_SESSION_STATEFUL` method (of `IF_HTTP_SERVER`) – one effect of which causes a context id cookie to be constructed and set in the next HTTP response.)

Ok, so with the phrasing of the help text (such as “…can control the lifetime…“) and the implication of the “DESTROY” part of the constant name, I did a little experiment to try and control the lifetime, by setting the `LIFETIME_RC` attribute so that the handler instance would be destroyed after it exited. Did it work as expected?

No.

Hmm. What’s going on? Well, it seems that with `LIFETIME_RC`, it’s either all or nothing. If you set your session to be stateful and specify that the handler instance should be kept (or let it default to that anyway), then you can’t, later in the session, suddenly decide to have the session destroyed.

Looking under the hood, we see this is confirmed in the ICF layer’s code. The whole process of handling a request is triggered via PBO modules in `SAPMHTTP`, and via the `HTTP_DISPATCH_REQUEST` coordinator, we come to the `EXECUTE_REQUEST` (or `EXECUTE_REQUEST_FROM_MEMORY` which I’ve seen in 6.40) method of the `CL_HTTP_SERVER` class.

When a request comes in, the appropriate handler is instantiated, and the `HANDLE_REQUEST` method called. Once this method returns, a decision based on `LIFETIME_RC` is made as to whether to save the instantiated handler object in an internal table, ready for a new request. Unless `LIFETIME_RC` is set to destroy, the object is saved, providing we’re dealing with a stateful session:

```abap
if server->stateful = 1 and extension->lifetime_rc = if_http_extension=>co_lifetime_keep and ext_inst_idx = -1. * add extension to list of instantiated extensions ...
```
There’s no facility for removing existing table entries though. And this is the key to understanding why manipulating the `LIFETIME_RC` attribute won’t always do … what you think it should do.

I bet you’re glad you know that now … share and enjoy 🙂

[Originally published on SAP Community](https://blogs.sap.com/2004/10/12/the-meaning-of-lifetimerc/)
