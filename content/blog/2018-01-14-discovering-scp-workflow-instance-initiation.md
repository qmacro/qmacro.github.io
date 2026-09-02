---
title: "Discovering SCP Workflow - Instance Initiation"
date: 2018-01-14
description: In this post we explore the part of the SCP Workflow API that deals with workflow instances, and look at how we initiate a new workflow instance, paying particular attention to how we request, and then use, a cross site request forgery (XSRF) token.
tags:
  - btp
  - workflow
  - api
  - discovering-scp-workflow
  - sap-community
---

Previous post in this series: [Discovering SCP Workflow - The
Monitor](/blog/posts/2018/01/08/discovering-scp-workflow-the-monitor/).

This post is part of a series, a guide to which can be found here:
[Discovering SCP
Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/).

In [Discovering SCP Workflow - The
Monitor](/blog/posts/2018/01/08/discovering-scp-workflow-the-monitor/), we saw
that the Workflow API exposes these main entities:

- Workflow Definitions
- Workflow Instances
- User Task Instances
- Messages

We also understand that a workflow instance is a specific occurrence of
a given workflow definition. So one might guess, again correctly, that
as the Workflow API is informed by
[REST](https://blogs.sap.com/2010/01/07/representational-state-transfer-rest-and-sap/)
principles, we should look to the Workflow Instances entity to see how
we might start a new workflow instance using the appropriate HTTP
method.

## Workflow instance operations

In the [API
documentation](https://api.sap.com/shell/discover/contentpackage/SAPCPWorkflowAPIs/api/SAP_CP_Workflow),
the operations for Workflow Instances are shown as follows:

![](/images/2018/01/Screenshot-2018-01-13-at-12.31.05.png)

Considering that initiating a new workflow instance is certainly not
idempotent, our eyes are drawn towards:

```text
POST /v1/workflow-instances
```

While our eyes are wandering over the operations summary, they also
surely fall upon the path info given for some of the operations \...
whereupon we can surmise that workflow instances have context, error
messages, and execution logs (in fact, we looked at some execution logs
in [Discovering SCP Workflow - The
Monitor](/blog/posts/2018/01/08/discovering-scp-workflow-the-monitor/)).
Perhaps we'll cover that in another installment.

## Creating a new instance

Looking in more detail at the requirements for the POST operation call,
we can see the following:

- the resource here is protected against cross site request forgery and an XSRF
  token will need to be supplied in each request
- the payload to supply is to be in JSON format, with two properties:
  - definitionId: the ID of the actual workflow definition
  - context: the data pertaining to the particular workflow instance to be
    initiated

It's great to see that a successful response returns HTTP status code
201 CREATED, as it should, in a RESTful sense. As far as I can see, the
Location header, that should normally accompany a 201 response, is
missing (and the request URL is certainly not the location of the newly
created resource, which is the alternative when no Location header is
supplied). But let's leave that for another time.

Regardless, the process is therefore fairly straightforward. Let's have
a look at some sample code from Archana Shukla's post [Part 2: Start
Workflow from your HTML5
application](https://blogs.sap.com/2017/10/15/part-2-start-workflow-from-your-html5-application/)
to embed the process into our brains.

### Fetching the XSRF token

First, we have the \_fetchToken function defined thus:

```javascript
_fetchToken: function() {
    var token;
    $.ajax({
        url: "/bpmworkflowruntime/rest/v1/xsrf-token",
        method: "GET",
        async: false,
        headers: {
            "X-CSRF-Token": "Fetch"
        },
        success: function(result, xhr, data) {
            token = data.getResponseHeader("X-CSRF-Token");
        }
    });
    return token;
}
```

This \_fetchToken method is called before the main POST method (that's
the one that actually initiates the new instance). Let's look closely.

There's a GET request made to the following URL:

```text
/bpmworkflowruntime/rest/v1/xsrf-token
```

This URL is of course abstracted by the destination target entry in the
app's neo-app.json descriptor file, which has an entryPath defined as
"/workflow-service":

```json
{
    "path": "bpmworkflowruntime",
    "target": {
        "type": "destination",
        "name": "bpmworkflowruntime",
        "entryPath": "/workflow-service"
    },
    "description": "Workflow Service Runtime"
}
```

## Digression: Resource URLs and how to think about them

It's worth stopping briefly to consider what this means and in what way
we look at this Workflow API (and APIs for other services), particularly
around how we think about different parts of the path info.

By the way, the "path info" is that part of the url that starts after
the hostname and (optional) port, running up to any query parameters. So
for example, in the URL

```url
http://host.example.com:8080/something/something-else/this?n=42
```

the path info part is:

```url
/something/something-else/this
```

So, back to the digression.

When you enable the Workflow service in the SCP cockpit, a new
destination "bpmworkflowruntime" appears, with the URL pattern that
looks like this for production accounts:

```url
https://bpmworkflowruntimewfs-<user>.hana.ondemand.com
```

and this for trial accounts:

```url
https://bpmworkflowruntimewfs-<user>trial.hanatrial.ondemand.com
```

So, with this in mind, and looking at the pattern defined for the
Workflow API production URL, as described in the [Overview
section](https://api.sap.com/shell/discover/contentpackage/SAPCPWorkflowAPIs/api/SAP_CP_Workflow?section=OVERVIEW)
of the Workflow API documentation on the API Hub:

```url
https://bpmworkflowruntime{provideracctname}-{consumeracctname}
  .hana.ondemand.com
  /workflow-service/rest
```

(split for legibility) we can see that "wfs" is the provider account
name, and that

```url
/workflowservice/rest
```

is the "root" part of the path info for the Workflow API resources. In
other words, this "root" part is common to all resource URLs in the
Workflow API.

Taking my trial account for example, it resolves to this:

```url
https://bpmworkflowruntimewfs-p481810trial
  .hanatrial.ondemand.com
  /workflow-service/rest
```

A complete URL for a given API resource, such as for the workflow
instances, would look like this:

```url
https://bpmworkflowruntimewfs-p481810trial
  .hanatrial.ondemand.com
  /workflow-service/rest/v1/workflow-instances
```

You can see that after the "root" part of the path info, we have the
resource-specific part:

```url
/v1/workflow-instances
```

This might seem like an unnecessary diversion, but I think it's
important to understand how resource identifiers (URLs) are structured,
so you can think about them in an appropriate way, and have that
thinking permeate your code and configuration.

So I think here it might be nicer to have a destination target entry
like this:

```json
{
    "path": "workflowservice",                  <---
    "target": {
        "type": "destination",
        "name": "bpmworkflowruntime",
        "entryPath": "/workflow-service/rest"   <---
    },
    "description": "Workflow Service Runtime"
}
```

where the value for the "path" property is deliberately different (so
that we don't confuse it with an actual API resource path info
section), and the value for the "entryPath" property reflects the full
"root" value "/workflow-service/rest". This is so that when we
construct relative URLs in our code that relies on these destination
target abstractions, we focus solely on the individual and unique
resource name that we're interested in, for example:

```url
/workflowservice/v1/workflow-instances
```

which says to me *"the /v1/workflow-instances API resource provided by the
workflow service abstraction".*

I think this is preferable to having the resource name mixed in with
some portion of the API root, and something that might or might not be
(in our minds) part of a real URL that looks possibly broken and
therefore confusing, like this example:

```url
/bpmworkflowruntime/rest/v1/xsrf-token
```

This digression is somewhat academic and by no means a criticism of the
code in the other blog post, but I thought it was worth at least sharing
what's in my head on this subject.

Anyway, let's leave the digression there, and get back to looking at
the XSRF token fetching part. Taking a second look at the \_fetchToken
code above, we see that an HTTP GET request is made to the XSRF handling
endpoint:

![](/images/2018/01/Screenshot-2018-01-14-at-08.31.44.png)

The one thing I have to say here is that it irks me more than it should
that there's an inconsistency between the terms XSRF and CSRF, but
beyond that, it's pretty straightforward.

*"Please give me an XSRF token".*

Notice that the call that is made via AJAX is done in a synchronous way.
This is of course because we need the token before making the main call
(the HTTP POST). There are other ways to achieve this, avoiding setting
the synchronous mode, and also avoiding callback hell, by making use of
promises, which we'll look at in the next installment.

### Making the POST operation

The token received in the previous step can (and must) now be used in
making this call:

```text
POST /v1/workflow-instances
```

The code in Archana's post looks like this:

```javascript
_startInstance: function(token) {
    var model = this.getView().getModel();
    var inputValue = model.getProperty("/text");
    $.ajax({
        url: "/bpmworkflowruntime/rest/v1/workflow-instances",
        method: "POST",
        async: false,
        contentType: "application/json",
        headers: {
            "X-CSRF-Token": token
        },
        data: JSON.stringify({
            definitionId: <your workflow ID>,
            context: {
                text: inputValue
            }
        }),
        success: function(result, xhr, data) {
            model.setProperty("/result", JSON.stringify(result, null, 4));
        }
    });
}
```

Following the digression above, we'd actually want to make a call to
the abstracted URL as shown earlier:

```url
/workflowservice/v1/workflow-instances
```

provided that we'd made the requisite definition in neo-app.json.

The token needs to be supplied using the same header as previously, i.e.
"X-CSRF-Token", in place of the "Fetch" value.

And it's in the body of this POST request that the details required to
initiate a new workflow instance are supplied, in JSON format. The API
Hub documentation states that there are two properties, "context" and
"definitionId". The former is to supply contextual data relating to
the particular instance of the workflow definition to be initiated.
We'll look at the detail of that context in another post. The latter is
to specify the ID of the workflow definition we want to create an
instance of.

Pretty simple.

## Avoiding the "gotcha"

It's worth examining how XSRF tokens work, and how AJAX requests work
implicitly, so you don't fall foul of the idea of session context, or
rather the lack of it. Erm, like I did.

When you request an XSRF token, it's for your session. How is that
implemented and controlled? If you could fetch a token and give it to
someone else to use, the XSRF mechanism wouldn't be very effective. So
when a token is returned in response to a "Fetch" request, it's valid
only for that session - as determined by cookies returned in the
response. If you use the token outside the context of those cookies in a
subsequent request, it's not going to work.

So is there some magic going on in how the pair of requests are made in
the code we've examined?

Well, insofar as [AJAX requests get and set cookies like any other HTTP
request](https://www.bennadel.com/blog/1995-ajax-requests-get-and-set-cookies-like-any-other-http-request.htm),
there is. When making HTTP requests via the AJAX mechanism, cookie
handling is done for you automatically. So in the second request (the
HTTP POST), the token is sent, but also cookies, received in the
response to the first request, are sent as well.

I guess what I'm trying to say is that the magic happens not because
it's magic, but because there's implicit work going on for you, of
which you may not have been aware.

### Trying to use a token without a session context

Let's see this in action by using [curl](https://curl.haxx.se/), the
command line tool for HTTP and a general Swiss Army knife for exploring
APIs.

First, we'll issue a curl command as the equivalent of our \_fetchToken
procedure:

```shell
curl
  --user p481810
  --header "X-CSRF-Token: Fetch"
  --verbose
  https://bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com/workflow-service/rest/v1/xsrf-token
```

After being prompted for my password, the HTTP request is made and the
response is received. Details of both are shown in the output because of
the \--verbose option. Here are some of them (the "\>" denotes
outgoing data, i.e. the request, and the "\<" denotes incoming data,
i.e. the response):

```text
> GET /workflow-service/rest/v1/xsrf-token HTTP/1.1
> Host: bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com
> User-Agent: curl/7.52.1
> Accept: */*
> X-CSRF-Token: Fetch
>
< HTTP/1.1 200 OK
< Expires: Thu, 01 Jan 1970 00:00:00 UTC
< Set-Cookie: JSESSIONID=123DCEB713926E0833B45B08247623385CB269BB3A8454790E69372D32DE4538; Path=/workflow-service; Secure; HttpOnly
< Set-Cookie: JTENANTSESSIONID_p481810trial=SsaDu1sHjWIX0mDPAJFk0HEr03CSSGyjyWvZ4MrATas%3D; Domain=.hanatrial.ondemand.com; Path=/; Secure; HttpOnly
< X-CSRF-Token: 10D04A3B50DDE972188AA980DFDC56D9
< X-Content-Type-Options: nosniff
< Content-Length: 0
< Date: Sun, 14 Jan 2018 14:08:09 GMT
< Server: SAP
< Set-Cookie: BIGipServer~jpaas_folder~bpmworkflowruntimewfs.hanatrial.ondemand.com=!kCiZlq6atWogI9Y9I+xE
tZ891eMS7LkmQdYIxDKM2/HAS5x8xPPhIrAnkPWcRYM1eqXm10QSr+s4Cg==; path=/; httponly; secure
< Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
<
```

An XSRF token is returned in response to the Fetch request, as you can
see. Let's use this token in a subsequent HTTP request - this time a
POST request to try to initiate a new workflow instance. The body of the
POST request is in the data.json file, which contains this:

```json
{
  "definitionId" : "testworkflow",
  "context" : {
    "thing" : "banana"
  }
}
```

OK, first we set an environmental variable to make the received token
available:

```text
export CSRFTOKEN=10D04A3B50DDE972188AA980DFDC56D9
```

Now we can issue the curl command, sending the token in blissful
ignorance of the consequences:

```shell
curl
  --user p481810
  --header "Content-Type: application/json"
  --header "X-CSRF-Token: $CSRFTOKEN"
  --verbose
  --data @data.json
  https://bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com/workflow-service/rest/v1/workflow-instances
```

What do we get? Let's see:

```text
> POST /workflow-service/rest/v1/workflow-instances HTTP/1.1
> Host: bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com
> User-Agent: curl/7.52.1
> Accept: */*
> Content-Type: application/json
> X-CSRF-Token: 10D04A3B50DDE972188AA980DFDC56D9
> Content-Length: 69
>
} [69 bytes data]
< HTTP/1.1 403 Forbidden
< Set-Cookie: JSESSIONID=173976D361754979CF900BA9AF9F6197307474F0C7A9AD2619150D371E7EED50; Path=/workflow-service; Secure; HttpOnly
< Set-Cookie: JTENANTSESSIONID_p481810trial=lzs6Yz6%2B3pVlPR3kN5ueBmmq1Bm2vr7YsgVJXxrEqM0%3D; Domain=.hanatrial.ondemand.com; Path=/; Secure; HttpOnly
< X-CSRF-Token: Required
< Content-Type: text/html;charset=utf-8
< Content-Language: en
< Content-Length: 121
< Date: Sun, 14 Jan 2018 14:10:04 GMT
< Server: SAP
< Set-Cookie: BIGipServer~jpaas_folder~bpmworkflowruntimewfs.hanatrial.ondemand.com=!2Ca7XcLdsg/zzGE9I+xEtZ891eMS7FbugL2TfgJqsHWcgxEC4eqkZJXXbqbJ0xdPDieESOQ1VuZKCQ==; path=/; httponly; secure
< Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
<
```

```html
<html>
<head>
<title>Error report</title>
</head>
<body>
<h1>HTTP Status 403 - CSRF nonce validation failed</h1>
</body>
</html>
```

Oops! HTTP status code 403 with an error about CSRF nonce validation
failure! In other words, our request to create a new workflow instance
has been denied, despite sending the token that we were given.

### Using the token with the correct session context

Let's try that again, but this time we'll ask curl to capture cookies
and store them, and then reuse them in the subsequent request:

```shell
curl
  --user p481810
  --header "X-CSRF-Token: Fetch"
  --cookie-jar cookiejar.dat
  --verbose
  https://bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com/workflow-service/rest/v1/xsrf-token
  ```

Note the use of the \--cookie-jar parameter, which result in the "Added
cookie" messages in the output regarding  cookies being added:

```text
> GET /workflow-service/rest/v1/xsrf-token HTTP/1.1
> Host: bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com
> User-Agent: curl/7.52.1
> Accept: */*
> X-CSRF-Token: Fetch
>
< HTTP/1.1 200 OK
< Cache-Control: private
< Expires: Thu, 01 Jan 1970 00:00:00 UTC
* Added cookie JSESSIONID="2C505C957AD0B1E76BD0535F0AF66C10DD824F88F2FF5F3463DD56AF5020E8D0" for domain bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com, path /workflow-service, expire 0
< Set-Cookie: JSESSIONID=2C505C957AD0B1E76BD0535F0AF66C10DD824F88F2FF5F3463DD56AF5020E8D0; Path=/workflow-service; Secure; HttpOnly
* Added cookie JTENANTSESSIONID_p481810trial="iIN12zFf3bAmLNOQA3tuM4YVkPI2WgN060d0hgv%2B6W4%3D" for domain hanatrial.ondemand.com, path /, expire 0
< Set-Cookie: JTENANTSESSIONID_p481810trial=iIN12zFf3bAmLNOQA3tuM4YVkPI2WgN060d0hgv%2B6W4%3D; Domain=.hanatrial.ondemand.com; Path=/; Secure; HttpOnly
< X-CSRF-Token: 63BAF126EF5C164C1945D64192B6E2C6
< X-Content-Type-Options: nosniff
< Content-Length: 0
< Date: Sun, 14 Jan 2018 16:51:44 GMT
< Server: SAP
* Added cookie BIGipServer~jpaas_folder~bpmworkflowruntimewfs.hanatrial.ondemand.com="!kdw/bjE6WrgieXWwDhtcRsHHmTA76BykeAKzJSQCxdxLV7mHZYmet6Q6LvtTA6c9gdNjkRxfo0Gi4So=" for domain bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com, path /, expire 0
< Set-Cookie: BIGipServer~jpaas_folder~bpmworkflowruntimewfs.hanatrial.ondemand.com=!kdw/bjE6WrgieXWwDhtcRsHHmTA76BykeAKzJSQCxdxLV7mHZYmet6Q6LvtTA6c9gdNjkRxfo0Gi4So=; path=/; httponly; secure
< Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
<
```

If you're like me, you'll want to see what's inside cookiejar.dat
while reading this post. Here you go:

```texst
# Netscape HTTP Cookie File
# https://curl.haxx.se/docs/http-cookies.html
# This file was generated by libcurl! Edit at your own risk.

#HttpOnly_bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com     FALSE   /workflow-service       TRUE    0    JSESSIONID       2C505C957AD0B1E76BD0535F0AF66C10DD824F88F2FF5F3463DD56AF5020E8D0
#HttpOnly_.hanatrial.ondemand.com       TRUE    /       TRUE    0       JTENANTSESSIONID_p481810trial   iIN12zFf3bAmLNOQA3tuM4YVkPI2WgN060d0hgv%2B6W4%3D
#HttpOnly_bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com     FALSE   /       TRUE    0       BIGipServer~jpaas_folder~bpmworkflowruntimewfs.hanatrial.ondemand.com !kdw/bjE6WrgieXWwDhtcRsHHmTA76BykeAKzJSQCxdxLV7mHZYmet6Q6LvtTA6c9gdNjkRxfo0Gi4So=
```

So now we have the cookies stored, let's set anew our CSRFTOKEN
variable with the token just received:

```text
export CSRFTOKEN=63BAF126EF5C164C1945D64192B6E2C6
```

and retry the POST request, this time using those cookies captured just
now with the \--cookie-jar parameter:

```shell
curl
  --user p481810
  --header "Content-Type: application/json"
  --header "X-CSRF-Token: $CSRFTOKEN"
  --cookie cookiejar.dat
  --verbose
  --data @data.json
  https://bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com/workflow-service/rest/v1/workflow-instances
  ```

Et voila:

```text
> POST /workflow-service/rest/v1/workflow-instances HTTP/1.1
> Host: bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com
> User-Agent: curl/7.52.1
> Accept: */*
> Cookie: JSESSIONID=2C505C957AD0B1E76BD0535F0AF66C10DD824F88F2FF5F3463DD56AF5020E8D0; BIGipServer~jpaas_folder~bpmworkflowruntimewfs.hanatrial.ondemand.com=!kdw/bjE6WrgieXWwDhtcRsHHmTA76BykeAKzJSQCxdxLV7mHZYmet6Q6LvtTA6c9gdNjkRxfo0Gi4So=; JTENANTSESSIONID_p481810trial=iIN12zFf3bAmLNOQA3tuM4YVkPI2WgN060d0hgv%2B6W4%3D
> Content-Type: application/json
> Content-Length: 69
>
< HTTP/1.1 201 Created
< X-Content-Type-Options: nosniff
< Content-Type: application/json
< Transfer-Encoding: chunked
< Date: Sun, 14 Jan 2018 17:03:25 GMT
< Server: SAP
< Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
<
{
  "id":"d5bca4c9-f94c-11e7-a369-00163e4ef3ca",
  "definitionId":"testworkflow",
  "definitionVersion":"10",
  "subject":"TestWorkflow",
  "status":"RUNNING",
  "businessKey":"",
  "startedAt":"2018-01-14T17:03:25.686Z",
  "startedBy":"P481810",
  "completedAt":null
}
```

Phew - thank goodness for AJAX requests, that handle these cookie
shenanigans for you!

OK, I think that's enough for this post. We now understand how to
initiate a new workflow instance, and understand what goes on under the
hood.

In the next installment, I'll take you through how I use
[Postman](https://www.getpostman.com/) and its environment features to
provide me with a very comfortable debugging UI to explore the Workflow
API and my data contained within it.

Next post in this series: [Discovering SAP Workflow - Using
Postman](/blog/posts/2018/01/16/discovering-scp-workflow-using-postman/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-members/discovering-scp-workflow-instance-initiation/ba-p/13353657)
