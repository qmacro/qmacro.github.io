---
layout: post
title: CAP, CORS and custom headers
date: 2024-03-30
tags:
  - cap
  - cors
  - javascript
  - nodejs
---
A colleague asked me if I could add CORS support to a service I was running, built with the SAP Cloud Application Programming Model (CAP). CAP already has some basic support for CORS, so I dug in, and was fascinated by what I found.

> The [@sap/approuter](https://www.npmjs.com/package/@sap/approuter) has full support for CORS but I wanted to find out about what CAP offers and how to extend it. Specifically, this exploration was made with `@sap/cds` at version 7.8.0.

## Test service

Before diving in, let's create the simplest server that could possibly work[<sup>1</sup>](#footnotes) to explore CORS support in CAP. First, a minimal project:

```shell
# /home/user/work/scratch
; cds init corstest \
    && cd $_ \
    && rm -rf .vscode/ app/ srv/ db/ README.md \
    && tree -a
Creating new CAP project in ./corstest

Adding feature 'nodejs'...

Successfully created project. Continue with 'cd corstest'.
Find samples on https://github.com/SAP-samples/cloud-cap-samples
Learn about next steps at https://cap.cloud.sap
.
|-- .cdsrc.json
|-- .eslintrc
|-- .gitignore
`-- package.json

1 directory, 4 files
```

Now, just the simplest test REST style service. In `services.cds`[<sup>2</sup>](#footnotes):

```text
@protocol: 'rest'
service corstest {
    function go() returns String;
}
```

And in the default implementation file for this service file, i.e. `services.js`:

```javascript
module.exports = (s) =>
    s.on('go', () => `Hello, World!`)
```

Let's also install the runtime locally with `npm install` (as we'll want to look into one of the files there later), and start the server up with `cds watch`. Now we can perform a basic test, asking for verbose output[<sup>3</sup>](#footnotes), to see what we get:

```shell
# /home/user/work/scratch/corstest
; curl --verbose --url localhost:4004/rest/corstest/go
> GET /rest/corstest/go HTTP/1.1
> Host: localhost:4004
> User-Agent: curl/7.88.1
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: text/plain; charset=utf-8
< Content-Length: 13
<
Hello, World!
```

> In the verbose output for this HTTP request and all subsequent ones, some of the HTTP response headers have been omitted for brevity.

OK, all set.

## Getting started

CORS, or [Cross Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), "is an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources". You come across it in the browser when wanting to consume resources from a different server to the one, the "origin", that the consuming code came from.

There's a [section on CORS](https://cap.cloud.sap/docs/node.js/best-practices#cross-origin-resource-sharing-cors) in the [Node.js Best Practices](https://cap.cloud.sap/docs/node.js/best-practices) part of [Capire](https://cap.cloud.sap/docs/). In there, it merely says:

"If not running in production, CAP's default server allows all origins. For production, you can add CORS to your server as follows ..."

That tantalisingly short paragraph got me hooked. What does that mean? How does that work? I knew that finding out the answers to these questions would help me with providing what my colleague was asking for.

There are three parts to the paragraph:

* "if not running in production"
* "CAP's default server allows all origins"
* "you can add CORS to your server as follows"

Let's take the "default server" part first.

### Default server support

What is the "default server"? Basically, it's the process that runs when you invoke something like `cds watch`, or `cds serve`, and is also known as the [built-in server.js](https://cap.cloud.sap/docs/node.js/cds-server#built-in-server-js).

So what sort of support are we looking for anyway? CORS support comes in the form of HTTP headers, and the ones that we should be expecting are returned [in the HTTP response](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#the_http_response_headers). The header names all start `Access-Control-...`, such as `Access-Control-Allow-Origin`.

But there are no CORS headers in the response to the basic service test above:

```text
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: text/plain; charset=utf-8
< Content-Length: 13
```

That's because the HTTP request didn't include any [headers in the request that make use of the CORS features](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#the_http_request_headers). The basics can be triggered by including an `Origin` HTTP header in the request (this is done automatically by the browser in such cross origin resource retrieval circumstances).

#### Regular CORS processing

Let's do that and see what we get from the CAP server. The important thing for this test is to specify a value for the `Origin` HTTP header that is different to the CAP server. Let's use `qmacro.org`:

```shell
; curl \
    --verbose \
    --header 'Origin: qmacro.org' \
    --url localhost:4004/rest/corstest/go
> GET /rest/corstest/go HTTP/1.1
> Host: localhost:4004
> User-Agent: curl/7.88.1
> Accept: */*
> Origin: qmacro.org
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< access-control-allow-origin: qmacro.org
< Content-Type: text/plain; charset=utf-8
< Content-Length: 13
<
Hello, World!
```

Check out that extra header in the response, shown in the verbose output:

```text
< access-control-allow-origin: qmacro.org
```

From a CORS perspective, this response header tells the browser to allow that origin to access the resource being returned.

So where is that header coming from? Well, the answer is in the default server. Specifically that's `@sap/cds/server.js`, which has been installed in the `node_modules/` directory during the `npm install` process earlier. The relevant part is here, in a `cors` [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get):

```javascript
get cors() {
    return process.env.NODE_ENV === 'production'
        ? null
        : (req, res, next) => {
            const { origin } = req.headers
            if (origin) {
                res.set('access-control-allow-origin', origin)
                if (req.method === 'OPTIONS')
                    return res.set(
                        'access-control-allow-methods',
                        'GET,HEAD,PUT,PATCH,POST,DELETE'
                    ).end()
            }
            next()
        }
}
```

> I took the liberty of reformatting the code for better readability and so it would fit better width-wise in this blog post.

The middle section is what came into play here. If there's an `Origin` header in the request, then an `Access-Control-Allow-Origin` header is sent in the response, with the same value that came in the request (`qmacro.org`):

```text
access-control-allow-origin: qmacro.org
```

An alternative value would be `*` but I think I like this reciprocal approach better.

> Header names during runtime in the CAP server are lower-cased for consistency and ease of processing.

But what about that bit that starts with the `req.method === 'OPTIONS'` condition, with the `Access-Control-Allow-Methods` header (as opposed to the `Access-Control-Allow-Origin` header?

That's related to another part of CORS processing - "preflight" requests.

#### Preflight CORS processing

In some cross origin resource retrieval circumstances, a browser will also send a so-called "preflight" request. Basically, if the intended HTTP request to the remote server is not considered a [simple request](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests), then a preflight request is made first.

For example, if the method of the intended request is something other than `GET`, `HEAD` or `POST`, or if there are headers that will be supplied that are not "standard", then a preflight request is made, to check that the remote server is indeed willing to handle such an intended request.

And preflight requests take the form of an HTTP request with the `OPTIONS` method. Taking one of those cases of a non-simple request, where the method of the request is going to be `PUT`, for example, then the browser will first send an HTTP request like this (displayed here using curl's verbose output convention):

```text
> OPTIONS /rest/corstest/go HTTP/1.1
> Host: localhost:4004
> User-Agent: curl/7.88.1
> Accept: */*
> Origin: qmacro.org
> Access-Control-Request-Method: PUT
```

This is the preflight request. Note the `Access-Control-Request-Method` header with the method of the intended request.

Unless the remote server responds appropriately to such a preflight request, the browser will not allow the actual request to be made. What is an appropriate response here to this preflight request? Something like this:

```text
< HTTP/1.1 200 OK
< X-Powered-By: Express
< access-control-allow-origin: qmacro.org
< access-control-allow-methods: GET,PUT
```

In other words, a response that tells the browser "yes, `PUT` requests from this origin are allowed".

And that is exactly what the default server's CORS handling mechanism is doing in the condition that checks whether the HTTP method is `OPTIONS`, i.e. if it's a preflight request. It adds the `Access-Control-Allow-Methods` header to response to preflight requests, and includes all the "usual suspect" HTTP methods (`GET,HEAD,PUT,PATCH,POST,DELETE`). Nice!

We can actually construct a preflight request, using the `--request` option to be able to specify the HTTP method to use, so that we can see a preflight request/response for real. Here goes:

```shell
; curl \
    --verbose \
    --request OPTIONS \
    --header 'Origin: qmacro.org' \
    --url localhost:4004/rest/corstest/go
> OPTIONS /rest/corstest/go HTTP/1.1
> Host: localhost:4004
> User-Agent: curl/7.88.1
> Accept: */*
> Origin: qmacro.org
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< access-control-allow-origin: qmacro.org
< access-control-allow-methods: GET,HEAD,PUT,PATCH,POST,DELETE
< Content-Length: 0
```

> Note that I didn't actually need to specify a `Access-Control-Request-Method` header in this preflight request, the CORS support in the default CAP server will just supply an equivalent `Allow` response header covering the main methods.

Great!

### The automatic CORS support context

Next, let's take the "if not running in production" part.

Running anything in production requires more thinking about security, resilience, and so on. And while this default "yes, we're open!" CORS support we've seen so far is very useful at design time, where you're exploring and iterating, it's probably not what you want in production.

The [configuration profile](https://cap.cloud.sap/docs/node.js/cds-env#profiles) facilities that CAP Node.js offers includes the standard Node.js approach of using the environment variable `NODE_ENV` to determine in what "mode" the server is running.

Unless explicitly specified, via a configuration profile (`--profile production`, or the shorthand `--production`) or simply directly, via the value `production` set for `NODE_ENV`[<sup>4</sup>](#footnotes), the CAP server is deemed NOT to be in productive mode.

The startup of the simple CAP server here was brought about simply with `cds watch`, so it is not running in "production mode" either.

And this is what's referenced in the first part of the CORS getter in `@sap/cds/server.js` that we saw earlier:

```javascript
get cors() {
    return process.env.NODE_ENV === 'production'
        ? null
        : (req, res, next) => {
            ...
        }
}
```

Here, through the use of one of my favourite constructs, the [ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator), the CORS getter will either return the anonymous function `(req, res, next) => { ... }` that adds the CORS "allow" response headers, or nothing at all (`null`), depending on the value of `NODE_ENV`.

So when the `cors` object property is referenced in the running server to potentially provide CORS processing for a request, there will either be a function ready to do that, or, in the case of a production context, nothing to do anything at all.

## Adding custom CORS headers

The last of the three parts, "you can add CORS to your server as follows", is where we move away from the standard CORS facilities of the default server.

The standard facilities will return, as appropriate, one or both of these headers:

* `Access-Control-Allow-Origin`
* `Access-Control-Allow-Methods`

My colleague's request for CORS support would have normally been fulfilled by this. The method of the remote request being made from his web app origin was GET. This falls into the "simple request" category. But the remote requests will also include a custom header `CommunityID`.

If you worked through the tasks in last August's [Developer Challenge on APIs](https://community.sap.com/t5/technology-blogs-by-sap/sap-developer-challenge-apis/ba-p/13573168), you may remember this header. The hash facility described in [Task 0 - Learn to share your task results](https://community.sap.com/t5/application-development-discussions/sap-developer-challenge-apis-task-0-learn-to-share-your-task-results/m-p/276058#M2319) requires you to supply your SAP Community ID in the form of a header in the HTTP request, like this:

```text
CommunityID: qmacro
```

This hash facility is the service that my colleague was wanting to call remotely from his web app. And the requirement for this custom header when calling the service[<sup>5</sup>](#footnotes) meant that such requests are not considered "simple".

This in turn meant that a preflight request would be made. Not only that, but the custom header would be supplied in such preflight requests in an `Access-Control-Request-Headers` header too, in a similar way to how any "unusual" HTTP methods would be supplied in an `Access-Control-Request-Method` header. And the browser will expect, in the response to that preflight request, that the custom header is included in an `Access-Control-Allow-Headers` header in the HTTP response.

But while the built-in CORS handling of the default CAP server provides preflight response support for such `Access-Control-Request-Method` headers, it doesn't provide support for `Access-Control-Request-Headers` headers.

> We can debate whether this should be standard in the default CAP server, i.e. how much CORS support we should expect out of the box, but here I saw it as an opportunity to learn how I might extend the support myself.

### Custom server.js

The [Boostrapping Servers](https://cap.cloud.sap/docs/node.js/cds-server) section of Capire includes information about being able to supply your own [custom server](https://cap.cloud.sap/docs/node.js/cds-server#custom-server-js) logic, like this:

```javascript
const cds = require('@sap/cds')
// react on bootstrapping events...
cds.on('bootstrap', ...)
```

This is particularly relevant when we revisit that [section on CORS](https://cap.cloud.sap/docs/node.js/best-practices#cross-origin-resource-sharing-cors) mentioned earlier, where it says "... For production, you can add CORS to your server as follows". And the code example given is shown in the context of a `bootstrap` event for which custom server implementations are often used - i.e. to hook into part of the CAP server startup to add custom logic:

```javascript
const ORIGINS = { 'https://example.com': 1 }
cds.on('bootstrap', async app => {
    app.use((req, res, next) => {
        ...
    })
})
```


---

<a name='footnotes'></a>
## Footnotes

1: This phrase borrows from "the simplest thing that could possibly work", from Ward Cunningham. See my recording of "The Simplest Thing that Could Possibly Work, A conversation with Ward Cunningham" in the [Tech Aloud podcast episode](https://podcasters.spotify.com/pod/show/tech-aloud/episodes/The-Simplest-Thing-that-Could-Possibly-Work--A-conversation-with-Ward-Cunningham--Part-V---Bill-Venners-e5dpts).

2: You may have noticed the removal of the standard directories `app/`, `srv/` and `db/` when we set this project up; this is just to keep things as simple as possible. The file name `services.cds` (and its corresponding default implementation file `services.js`) is part of the CAP server "roots" that are valid default locations and files that it looks at. You can see this for yourself by running `cds env roots` which will emit `[ 'db/', 'srv/', 'app/', 'schema', 'services' ]`.

3: When asked to provide verbose output, curl prefixes the outgoing HTTP request headers with `>` and the incoming HTTP response headers with `<`.

4: Ultimately, however you specify the mode, the appropriate value will end up in `NODE_ENV` for the server to be able to check.

5: The requirement to supply a custom header in calls to the hash facility was deliberate, to encourage the participants to explore a tiny bit beyond standard HTTP requests. After all, the challenge was all about APIs and making HTTP calls.
