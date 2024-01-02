---
layout: post
title: REST orientation - Controlling access to resources
date: 2009-09-30
tags:
  - sapcommunity
---
## Background

Using my [new REST handler / dispatcher for the ICF](/blog/posts/2009/09/21/a-new-rest-handler-dispatcher-for-the-icf/), I can adopt a Resource Orientated Architecture (ROA) approach to integration. This gives me huge advantages, in that I can avoid complexity, and expose data and functions from SAP as resources - first class citizens on the web. From here, I can, amongst other things:

* use off-the-shelf cacheing mechanisms to improve performance
* easily debug and trace integration with standard logging and proxying tools
* even make statements about the resources using RDF

Moreover, I can easily divide up the programming tasks and the logic into logical chunks, based upon resource, and HTTP method, and let the infrastructure handle what gets called, and when.

This is all because what we're dealing with in a REST-orientated approach is a set of resources - the nouns - which we manipulate with HTTP methods - the verbs.

As an example, here's a few of the channel-related resources that are relevant in my Coffeeshop project; in particular, my implementation of Coffeeshop in SAP. The resource URLs are relative, and rooted in the /qmacro/coffeeshop node of the ICF tree.

|Resource|Description|Method|Action|
|-|-|-|-|
|/qmacro/coffeeshop/|Homepage|GET|Returns the Coffeeshop 'homepage'|
|/qmacro/coffeeshop/channel/|Channel container|GET|Return list of channels|
|POST|Create new channel|
|/qmacro/coffeeshop/channel/123/|Channel|GET|Return information about the channel|
|POST|Publish a message to the channel|
|DELETE|Remove the channel|

(For more info on these and more resources, see the [Coffeeshop](https://github.com/qmacro/coffeeshop/) repository.)

## Problem
This is all fine, but often a degree of access control is required. What if we want to allow certain groups access to a certain resources, other groups to another set of resources, but only allow that group, say, to be able to read channel information, and not create any new channels? In other words, how do we control access following a resource orientated approach - access dependent upon the noun, and the verb?

Perhaps we would like group A to have GET access to all channel resources (read-only administration), group B to have GET and POST access to a particular channel (simple publisher access) and group C to have POST access to the channel container and DELETE access to individual channels (read/write administration)?

## What does SAP standard offer?

Before looking at building something from scratch, what does standard SAP offer in the ICF area to support access control?

When you define a node in the ICF tree, you can specify access control relating to the userid in the Logon Data tab:

(image lost in early SAP community platform migration)

This is great first step. It means that we can control, on a high level, who gets access generally, and who doesn't. Let's call this 'Level 1 access'.

You can also specify, in the Service Data tab, a value for the SAP Authorisation field ('SAP Authoriz.'):

(image lost in early SAP community platform migration)

The value specified here is checked against authorisation object S_ICF, in the ICF_VALUE field, along with 'SERVICE' in the ICF_FIELD field.

```text
[O] S_ICF
 |
 +-- ICF_FIELD
 +-- ICF_VALUE
```

This is clearly a 'service orientated' approach, and is at best a very blunt mechanism with which to control access.

As well as being blunt, it is also unfortunately violent. If the user that's been authenticated does have an authorisation with appropriate values for this authorisation object, then the authorisation check passes, and nothing more is said. But if the authenticated user doesn't have authorisation, the ICF returns HTTP status code '500', which implies an Internal Server Error. Extreme, and semantically incorrect - there hasn't been an error, the user just doesn't have authorisation. So, violent, and rather brutal. Then again, service orientation was never about elegance :-).

## What's our approach, then?

Clearly, what the SAP standard offers in the ICF is not appropriate for a REST approach to integration design. (To be fair, it was never designed with resource orientation in mind).

What we would like is a three-level approach to access control:

**Level 1 - user authentication**: Can the user be authenticated, generally? If not, the HTTP response should be status [401](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.2) - Unauthorised. This level is taken care of nicely by the ICF itself. Thanks, ICF!

**Level 2 - general resource access**: Does the user have access, generally, to the specific resource? If not, the HTTP response should be status [403](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.4) - Forbidden.

**Level 3 - specific resource access**: Is the user allowed to perform the HTTP method specified on that resource? If not, the HTTP response should be status [405](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.6) - Method Not Allowed. As well as this status code, the response must contain an Allow header, telling the caller what methods are allowed.

This will give us an ability to implement a fine-grained access control, allowing us to set up, say, group access, as described earlier.

## How do we get there?

Clearly, we're not going to achieve what we want with the SAP standard. We'll have to construct our own mechanism to give us Levels 2 and 3. But, SAP standard does offer us a couple of great building blocks that we'll use.

### Building block: Authorisation Concept

Why re-invent an authorisation concept, when we have such a good one as standard? Exactly. So we'll use the standard SAP authorisation concept.

So we'll create an authorisation object, YRESTAUTH, with two fields - one for the method, and one for the (relative) resource. This is what it looks like:

```text
[O] YRESTAUTH
 |
 +-- YMETHOD HTTP method
 +-- YRESOURCE resource (relative URL)
```

We can then maintain as many combinations of verbs and nouns as we like, and manage & assign those combinations using standard SAP authorisation concept tools. Heck, we could even farm that work out to the appropriate security team! Then, when it comes to the crunch, and the ICF is handling an incoming HTTP request, our mechanism can perform authorisation checks on this new authorisation object for the authenticated user associated with the request.

### Building block: Stacked Handlers

One of the most fantastic things about the generally excellent ICF is the ability to have a whole stack of handlers, that are called in a controlled fashion by the ICF infrastructure, to respond to an incoming HTTP request. The model follows that of Apache and mod_perl, with flow control allowing any given handler to say whether, for example, it has responded completely and no further handlers should be called to satisfy the request, or that it has partially or not at all been able to respond, and that other handlers should be called.

So for any particular ICF node that we want to have this granular 3-level access control, what we need is a pluggable handler that we can insert in the first position of the handler stack, to deal with authorisation. Like this:

(image lost in early SAP community platform migration)

As you can see, we have the main coffeeshop handler, and before that in the stack, another handler, Y_AUTH, to provide the Levels 2 and 3 access control. So when an HTTP request comes in and the ICF determines that it's this node ([/default_host]/qmacro/coffeeshop) that should take care of the request, it calls Y_AUTH first.

Y_AUTH is a handler class just like any other HTTP handler class, and implements interface IF_HTTP_EXTENSION. It starts out with a few data definitions, and identifies the resource specified in the request:

```text
method IF_HTTP_EXTENSION~HANDLE_REQUEST.
  data:
      l_method     type string
    , l_is_allowed type abap_bool
    , lt_allowed   type stringtab
    , l_resource   type string
    , l_resource_c type text255
    , l_allowed    type string
    .
* What's the resource?
  l_resource = server->request->get_header_field( '~request_uri' ).
* Need char version for authority check
  l_resource_c = l_resource.
```

Then it performs the Level 2 access check - is the user authorised generally for the resource?

```text
* Level 2 check - general access to that resource?
  authority-check object 'YRESTAUTH'
    id 'YMETHOD'   dummy
    id 'YRESOURCE' field l_resource_c.
  if sy-subrc <> 0.
    server->response->set_status( code = '403' reason = 'FORBIDDEN - NO AUTH FOR RESOURCE' ).
    exit.
  endif.
```

If the authority check failed for that resource generally, we return a status 403 and that response is sent back to the client.

However, if the authority check succeeds, and we pass Level 2, it's time to check the specific combination of HTTP method and resource - the verb and the noun. We do this with a call to a simple method is_method_allowed() which takes the resource and method from the request, and returns a boolean, saying whether or not the method is allowed, plus a list of the methods that are actually allowed. Remember, in the HTTP response, we must return an Allow: header listing those methods if we're going to send a 405.

```text
* Level 3 check - method-specific access to that resource?
  l_method =  server->request->get_header_field( '~request_method' ).
  translate l_method to upper case.
  call method is_method_allowed
    exporting
      i_resource   = l_resource
      i_method     = l_method
    importing
      e_is_allowed = l_is_allowed
      e_allowed    = lt_allowed.

* If not allowed, need to send back a response
  if l_is_allowed eq abap_false.

    concatenate lines of lt_allowed into l_allowed separated by ','.
    server->response->set_status( code = '405' reason = 'METHOD NOT ALLOWED FOR RESOURCE' ).
    server->response->set_header_field( name = 'Allow' value = l_allowed ).
```

So we send a 405 with an Allow: header if the user doesn't have authorisation for that specific combination of HTTP method and resource. (The is_method_allowed() works by taking a given list of HTTP methods, and authority-checking each one in combination with the resource, noting which were allowed, and which weren't.)

Finally, if we've successfully passed the Levels 2 and 3 checks, we can let go and have the ICF invoke the main handler for this ICF node - Y_DISP_COFFEESHOP. In order to make sure this happens, we tell the ICF, through the flow control variable IF_HTTP_EXTENSION~FLOW_RC, that while our execution has been OK, we still need to have a further handler executed to satisfy the request completely:

```text
* Otherwise, we're golden, but make sure another handler executes
  else.
    if_http_extension~flow_rc = if_http_extension~co_flow_ok_others_mand.

  endif.

endmethod.
```

And that's pretty much it!

To finish off, here are some examples of the results of this mechanism.

(image lost in early SAP community platform migration)

In the first call, the wrong password is specified in authentication, so the status in the HTTP response, directly from the ICF, is 401. This is Level 1.

In the second call, the user is authenticated ok, but doesn't have access generally to the /qmacro/coffeeshop/ resource, hence the 403 status. This is Level 2.

In the third call, we're trying to make a POST request to a specific channel resource. While we might have GET access to this resource, we don't specifically have POST access, so the status in the HTTP response is 405. In addition, a header like this: "Allow: GET" would have been returned in the response. This is Level 3.

I hope this shows that when implementing a REST approach to integration, you can control access to your resources in a very granular way, and respond in a symantically appropriate way, using HTTP as designed - as an application protocol.

[Originally published on SAP Community](https://blogs.sap.com/2009/09/30/rest-orientation-controlling-access-to-resources/)
