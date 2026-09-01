---
title: "Discovering SCP Workflow - Using Postman"
date: 2018-01-16
tags:
  - xsrf
  - postman
  - api
  - scp
  - workflow
  - sapcommunity
---

Previous post in this series: [Discovering SCP Workflow - Instance
Initiation](/blog/posts/2018/01/14/discovering-scp-workflow-instance-initiation/).

This post is part of a series, a guide to which can be found here:
[Discovering SCP
Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/).

In this post I'll explain how I use Postman to explore the Workflow
API, making the most of some of Postman's great features.

Folks like to explore APIs in different ways. There are various tools
that I use - the ones that come to mind immediately are
[curl](https://curl.haxx.se/) (used in the previous post, in fact) to
drive the HTTP conversation and [jq](https://stedolan.github.io/jq/) to
manipulate complex JSON data structures that often are returned in
responses.

There's a relatively new kid on the block in the form of
[Postman](https://www.getpostman.com) which describes itself as an API
development environment "to share, test, document & monitor APIs". It
started out as a Chrome extension, but there are OS-specific native
versions too.

You can register and thence sign in to Postman, whereupon it will
remember your settings (which will come in handy shortly) and
synchronise them between different instances over different
workstations, which is super useful.

## Sessions and collections

In the same way that code editors typically allow multiple files open,
Postman allows you to have multiple request/response sessions, and
switch between them via tabs. Each request/response is remembered in a
History area, but there's also the facility to save and group together
specific requests into Collections. I have an "SCP Workflow service"
collection:

![](/images/2018/01/Screenshot-2018-01-15-at-08.50.20.png)

Within a collection you can group together related requests into
folders, as you can see in the screenshot ("New Test Workflow
Instance", for example). You can even use the Collections as forms of
sequences of calls to be made to test an API, using the scripting
facilities to setup requests and validate responses automatically.

## Preparing requests

Consider that an HTTP request has three main parts:

- the combination of method and URL
- request headers
- request body (optional)

Postman presents a nice interface to allow you to prepare HTTP requests,
with separate areas for Authorization, Headers and Body (as well as the
main specification of method and URL of course).

But there are also a couple of other areas. In Pre-request Scripts you
can write JavaScript that is executed before the HTTP request is sent.
And in Tests you can write JavaScript that is executed after the HTTP
response is received. You can use the JavaScript Postman API that offer
access to the request and response itself plus some Postman specific
features such as global and environment variables.

## Environments

Postman has a concept of environments, which can be specific to you, or
shared (if you're running Postman Pro). I use the environment concept
to manage my different accesses based on who I'm logging into SCP as at
any given time. For example, I have my own private trial account
(P481810), and over time I may have access to work accounts, whether
trial or productive, and ephemeral ones that are given out in hands-on
training sessions.

![](/images/2018/01/Screenshot-2018-01-15-at-11.00.43.png)

The environments can contain variables, like this:

![](/images/2018/01/Screenshot-2018-01-15-at-11.02.43.png)

For exploring the Workflow API, I use the 'basicauthorization'
variable in my request headers, the 'workflowservice' variable in
constructing the URLs, and the 'xsrftoken' variable to store passing
XSRF tokens, allowing me to catch the response from a "Fetch" request
and insert the returned token into the next POST request. There are
others too ('instanceId', 'taskInstanceId') that I use for storing
intermediate values of various properties.

Perhaps you've noticed that the value of the 'workflowservice'
variable is set to match the API "root", as discussed in the
[digression](https://blogs.sap.com/2018/01/14/discovering-scp-workflow-instance-initiation/#digression)
in the previous post. I do like the clean separation here.

## Into action

Let's see how all of this fits together. We'll use the two requests
within the "New Test Workflow Instance" folder in the Collections
screenshot earlier. They look like this:

![](/images/2018/01/Screenshot-2018-01-15-at-11.23.18.png)

### Fetching an XSRF token

This is what the first one "Get CSRF Token" looks like:

![](/images/2018/01/Screenshot-2018-01-15-at-11.24.19.png)

You can see that I'm using the 'basicauthorization' environment
variable in an "Authorization" header. But also I'm making use of the
'workflowservice' root value to help construct the URL - a URL that is
specific to the particular environment I've selected, the one for my
P481810 trial account. In other words, the resulting URL will resolve
to:

```url
https://bpmworkflowruntimewfs-p481810trial
  .hanatrial.ondemand.com
  /workflow-service/rest/v1/xsrf-token
  ```

(split for legibility).

I've also got a little bit of JavaScript to be run after the response
is received, in the "Tests" area. It's this:

```javascript
postman.setEnvironmentVariable(
  "xsrftoken",
  postman.getResponseHeader("X-CSRF-Token")
);
```

Yes, when the response is returned, it gets the value of the
X-CSRF-Token header, which should contain the token we've requested,
and stores it in the 'xsrftoken' environment variable. (Did I mention
how much CSRF vs XSRF troubles me?)

The response from such a request is pretty simple - there's no body,
just the headers, as shown:

```test
cache-control : private
content-length : 0
date : Mon, 15 Jan 2018 11:26:28 GMT
expires : Thu, 01 Jan 1970 00:00:00 UTC
server : SAP
strict-transport-security : max-age=31536000; includeSubDomains; preload
x-content-type-options : nosniff
x-csrf-token : 2D114FA00565C0997072AD2ECCC1EF96
```

The value '2D114FA00565C0997072AD2ECCC1EF96' is what gets stored in
'xsrftoken'.

### Using the XSRF token in a POST request

Now we have the token, we can use it in the second request in this
folder to create a new workflow instance.

Let's have a look at what that request looks like, stored and ready in
Postman:

![](/images/2018/01/Screenshot-2018-01-15-at-11.35.13.png)

(you can see that Postman displays the value and scope of a variable if
you hover over it).

The workflow definition itself is deliberately very simple and not of
interest here. We'll cover workflow definitions in another post. But if
you're curious, this is what is in the Body area:

```json
{
  "definitionId": "testworkflow",
  "context": {
    "thing":"banana"
  }
}
```

Looking at the request headers, we still have the 'basicauthorization'
variable in use of course, but now we can supply the XSRF token in the
'X-CSRF-Token' header, with the value set to the token we just
received on the previous call. Nice!

As we have JavaScript at our disposal on receipt of response, we might
as well record the ID of the workflow instance created, in an
environment variable 'instanceId'. So this is the JavaScript in the
'Tests' area:

```javascript
postman.setEnvironmentVariable(
  "instanceId",
  JSON.parse(responseBody).id
);
```

Finally, note the lovely URL constructed out of the variable workflow
service "root" and the specific API resource
'/v1/workflow-instances' that we're sending the POST request to:

```url
https://bpmworkflowruntimewfs-p481810trial
  .hanatrial.ondemand.com
  /workflow-service/rest/v1/workflow-instances
```

Here's what the response looks like, by the way:

```json
{
    "id": "82817e22-f9e9-11e7-a369-00163e4ef3ca",
    "definitionId": "testworkflow",
    "definitionVersion": "10",
    "subject": "TestWorkflow",
    "status": "RUNNING",
    "businessKey": "",
    "startedAt": "2018-01-15T11:44:57.037Z",
    "startedBy": "P481810",
    "completedAt": null
}
```

## Continuing the API conversation

And yes, you guessed it, that ID value of
'82817e22-f9e9-11e7-a369-00163e4ef3ca' is now available to us in the
environment variable 'instanceId'. So we can use it directly in yet
another call from our collection, say, the "Retrieve context for a
specific workflow instance", without lifting a finger. This time,
we're using the 'instanceId' variable in the construction of the URL
itself, as that's what's required for this particular resource type in
the Workflow API:

![](/images/2018/01/Screenshot-2018-01-16-at-06.30.54.png)

Note that we didn't have to supply the XSRF token as this is just a GET
request.

As you can see, Postman is super convenient for exploring APIs such as
the Workflow API, especially when it comes to managing different
environments that reflect your SCP landscape, and handling information
that must be shared across requests.

By the way - did you notice something? We didn't have to transfer
cookies received in the response to the first (token fetch) request, to
explicitly use them in the second request. Just like the AJAX mechanism,
explained in the previous post [Discovering SCP Workflow - Instance
Initiation](/blog/posts/2018/01/14/discovering-scp-workflow-instance-initiation/),
Postman takes care of that for us automatically.

Now we're comfortable with the idea of multiple requests and how the
Workflow API feels, in the next post we'll look at a proxy service to
wrap this up for us in a convenient package, in the form of a Google
Cloud Function.

Next post in this series: [Discovering SCP Workflow - Service
Proxy](/blog/posts/2018/01/17/discovering-scp-workflow-service-proxy/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-members/discovering-scp-workflow-using-postman/ba-p/13354064)
