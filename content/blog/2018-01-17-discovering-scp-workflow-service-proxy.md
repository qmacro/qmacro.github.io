---
title: "Discovering SCP Workflow - Service Proxy"
date: 2018-01-17
tags:
  - adl
  - googlecloudfunctions
  - scp
  - workflow
  - sapcommunity
description: In this post I present a small proxy service I wrote to handle the minutiae of initiating a new workflow instance.
---

Previous post in this series: [Discovering SCP Workflow - Using
Postman](/blog/posts/2018/01/16/discovering-scp-workflow-using-postman/).

This post is part of a series, a guide to which can be found here:
[Discovering SCP
Workflow.](/blog/posts/2018/01/16/discovering-scp-workflow/)

Why did I write it? Well, lots of reasons. Here are some sensible
sounding ones:

- In my journey of discovery, it enables me to encapsulate stuff I've
  covered, to allow me to keep the surface area for initiating new
  workflow instances to a minimum within the wider context of what
  I'm doing
- It's a way to hide authentication details, especially when wanting
  to connect to the Workflow API from outside of the context of the
  SCP Connectivity Service
- It wraps up the XSRF token process so that I don't have to deal
  with or even see what's going on

Here are some more fun ones:

- It allows me to continue my journey
  [exploring](/blog/posts/2017/04/30/google-cloud-functions-sheets-apps-script-actions-on-google-win/)
  Google Cloud Functions on the Google Cloud Platform (GCP), which I
  have used already but in a different context: writing handlers for
  Actions on Google - the framework for the Google Assistant platform
  which is the underlying layer for Google Home devices and more
- Similarly it lets me explore how I use Node.js libraries, and learn
  what's out there
- I love the idea of [the second mainframe
  era](/tweets/qmacro/status/952650820788609030) with
  cloud computing and web terminals (I'm building all this and
  writing about it purely on Chrome OS with no workstation-local
  activities), and the combination of GCP and SCP is very attractive
- The proxy lets me explore the possibilities of how to divide up work
  across different areas of the cloud

This last reason is important to me - there's so much choice across
different platforms (SCP, GCP and beyond) for design-time and runtime
for solutions that unless you try things out it's hard to make informed
decisions.

(Note: in the following post, some lines - code, URLs, etc - have been
split for readability.)

## The general requirements

The idea is that I will want to initiate workflow instances from various
processes, and want a simple way of doing that with the minimum of fuss.
As far as protection goes, I'm using a simple shared secret, in the
form of a string that the caller passes and the receiver verifies before
proceeding.

I also want to write and forget, and do it all in the cloud.

## Google Cloud Functions

Before proceeding, it's worth spending a minute on what Google Cloud
Functions allows me to do. I can write serverless functions (similar to
AWS Lambda) and maintain the code in git repositories stored on GCP
(similar to how git repositories are available on SCP). I can write a
function in JavaScript, within a Node.js context, availing myself of the
myriad libraries available for that platform, and I can test it inside a
[functions runtime
emulator](https://cloud.google.com/functions/docs/emulator) before
deploying it to GCP using direct references to the source code master
branch in the git repository.

And yes, I edited and tested this whole project it all in the cloud too,
using a combination of vim on my [Google Cloud
Shell](https://cloud.google.com/shell/docs/) instance, and of course the
[SAP Web IDE](http://developer.sap.com/webide). After all, we're
surely [in the 2nd mainframe
era](/tweets/qmacro/status/952650820788609030) by now!

Anyway, who knows, in the future I may migrate this proxy function to
some other platform or service, but for now it will do fine.

The entry point to a Google Cloud Function is an
[Express](https://expressjs.com/)-based handler, which like many HTTP
server side frameworks, has the concept of a request object and a
response object. For what it's worth, this simple pattern also
influenced the work on the early [Alternative Dispatcher Layer
(ADL)](/blog/posts/2009/09/21/a-new-rest-handler-dispatcher-for-the-icf/)
for the ABAP and ICF platform.

The way I write my functions for this environment is to have a
relatively simple file, exporting a single 'handler' function, and
then farm out heavy lifting to another module. The Node.js
require/export concept is what this is based upon. We'll see this at a
detailed level shortly.

## Setting the scene

I've always wondered whether it's better to show source code before
demonstrating it, or demonstrating it first to give the reader some
understanding of what the code is trying to achieve. In this case the
demo is simple and worth showing first.

First, I'll highlight where I'm using this proxy for real, in a fun
experiment involving beer recommendations based on what you're
drinking, courtesy of [Untappd](https://untappd.com/user/qmacro)'s API,
and presented within the SCP Workflow context:

![](/images/2018/01/Screenshot-2018-01-16-at-10.42.17.png)

I have workflow definition called "untappdrecommendation" which I
initiate instances of when another mechanism sees that I've checked in
a beer on Untappd.

That mechanism is a Google Apps Script that polls an RSS feed associated
with my Untappd checkins and notices when I check in a new beer (I did
start by looking at using [IFTTT](https://ifttt.com) for this but my
experience with it wasn't great, so I rolled my own). Once it sees a
new checkin, it uses the [Untappd API](https://untappd.com/api/docs) to
grab relevant information and then calls the Workflow API, via the proxy
that is the subject of this post. Here's an excerpt from that Google
Apps Script:

```javascript
var WFS_PROXY = "https://us-central1-ZZZ.cloudfunctions.net/wfs-proxy";
var WFS_SECRET = "lifetheuniverseandeverything";
var WORKFLOW_DEFINITION_ID = "untappdrecommendation";

[...]

// Go and get the beer info for this beer, particularly the similar beers.
// If we get the info, add it to the data and initiate a workflow.
var beerInfo = retrieveBeerInfo(beerId);
if (beerInfo) {
  row[CHECKIN.STATUS] = initiateWorkflow(beerInfo) || "FAILED";
}

[...]

function initiateWorkflow(context) {

  return UrlFetchApp
    .fetch(WFS_PROXY + "?token=" + WFS_SECRET + "&definitionId=" + WORKFLOW_DEFINITION_ID, {
      method : "POST",
      contentType : "application/json",
      payload : JSON.stringify(context)
    })
    .getContentText();
}
```

Let's look into what that initiateWorkflow function is doing:

- it receives a map\* of information on the specific beer checked in
- then it makes a POST HTTP request to the proxy service, passing
  - a secret token (mentioned earlier)
  - the workflow definition ID "untappdrecommendation"
  - the context, containing the beer information, for the workflow
    instance

*\*some folks call them objects \... I prefer to call them maps if
they're "passive" (if they have no other methods other than the
JavaScript object built-in methods). The term map is used in other
languages for this sort of structure.*

Looking at the value of WFS_PROXY, we can see that it's the address of
my live, hosted Google Cloud Function. The "ZZZ" here replaces the
real address, by the way. And while "lifetheuniverseandeverything"
isn't the real secret token, I thought it was a nice substitute for
this post.

Note that the ability to call the initiateWorkflow function just like
that, and to only have to make a single call to UrlFetchApp.fetch (to
make a single HTTP request using a facility in the standard Google Apps
Script class UrlFetchApp), is what I was meaning with "simple" and
"minimum fuss". I'm not having to deal with XSRF tokens, nor wonder
whether I need to manage the token's context between calls either.

Stepping out of the Google Apps Script context for a moment, let's see
what it looks like when I use that proxy function by hand, with curl.

First, we've got a file, context.json, containing the beer info to be
provided to the newly minted workflow instance in the form of context:

```json
{
  "beer": {
    "bid": 1868220,
    "beer_name": "Subluminal",
    "beer_abv": 10,
    "beer_ibu": 60,
    "beer_slug": "buxton-brewery-subluminal",
    "beer_style": "Stout - Imperial / Double",
    "is_in_production": 1,
    [...]
  }
}
```

We'll send that file as the body of a POST request thus:

```shell
curl
  --verbose
  --data @context.json
  --header "Content-Type: application/json"
  "https://us-central1-ZZZ.cloudfunctions.net/wfs-proxy
  ?definitionId=untappdrecommendation
  &token=lifetheuniverseandeverthing"
  ```

Here's what we see:

```log
> POST /wfs-proxy?definitionId=untappdrecommendation&token=lifetheuniverseandeverything HTTP/1.1
> Host: us-central1-ZZZ.cloudfunctions.net
> User-Agent: curl/7.52.1
> Accept: */*
> Content-Type: application/json
> Content-Length: 131956
>
< HTTP/2 200
< content-type: text/html; charset=utf-8
< etag: W/"2-d736d92d"
< function-execution-id: pr85lvavhrvx
< x-powered-by: Express
< x-cloud-trace-context: 12ea0eb8b055ade13ff786b4c52af11e;o=1
< date: Tue, 16 Jan 2018 12:12:12 GMT
< server: Google Frontend
< content-length: 2
<
OK
```

(Woo, an HTTP/2 response, by the way!)

This results, in the creation of an instance of the
"untappdrecommendation" workflow definition which appears in My Inbox
as shown in the screenshot earlier.

## The proxy code

Now that we've seen what's supposed to happen, it's time to have a
look at the JavaScript code. It's in two files. First, there's
index.js, which contains the entry point handler which is invoked by the
Google Cloud Functions machinery.

As an aside, it's this entry point handler which is referred to in the
package.json which describes, amongst other things, the incantation to
deploy a function to the cloud. Here's package.json, in case you're
curious:

```json
{
  "name": "wfs-proxy",
  "project": "ZZZ",
  "version": "0.0.1",
  "description": "A proxy to triggering a workflow on the SCP Workflow Service",
  "main": "index.js",
  "scripts": {
    "test": "functions deploy $npm_package_name --entry-point handler --trigger-http",
    "deploy": "gcloud beta functions deploy $npm_package_name
              --entry-point handler
              --trigger-http
              --source https://source.developers.google.com
                /projects/$npm_package_project/repos/$npm_package_name"
  },
  "author": "DJ Adams",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.17.1"
  }
}
```

You can see that 'handler' (in index.js) is specified as the cloud
function's entry point in the deploy incantation.

Ok, so this is what's in index.js:

```javascript
const

    wfslib = require("./wfslib"),

    user = "p481810",
    pass = "*******",
    secret = "lifetheuniverseandeverything",

    initiateWorkflow = (definitionId, context, callback) => {

        wfslib.initiate({
            user : user,
            pass : pass,
            prod : false,
            definitionId : definitionId,
            context : context
        });

        callback("OK");

    },

    /**
     * Main entrypoint, following the Node Express
     * pattern. Expects an HTTP POST request with the
     * workflow definition ID in a query parameter
     * 'definitionId' and the payload being a JSON
     * encoded context.
     */
    handler = (req, res) => {

        switch (req.query.token) {
            case secret:
                initiateWorkflow(
                    req.query.definitionId,
                    req.body,
                    result => { res.status(200).send(result); }
                );
                break;
            default:
                res.status(403).send("Incorrect token supplied");
        }

    };

exports.handler = handler;
```

It's pretty straightfoward, with the handler function being the one
that takes the pair of HTTP request and response objects, checks the
token matches, and calls the initiateWorkflow function, accessing the
definitionId and the context via the req.query and req.body mechanisms
on the request object.

I'm not interested in what the Workflow API returns (if you remember
from the previous post, it's a map that includes the ID of the newly
minted workflow instance, details of the definition upon which it's
based, etc). So I just return a simple string.

To keep things modular, the actual "heavy lifting", if you can call it
that, is done in wfslib.js, which looks like this:

```javascript
const
    axios = require("axios"),
    wfsUrl = "https://bpmworkflowruntimewfs-USERTRIAL.hanaTRIAL.ondemand.com/workflow-service/rest",
    tokenPath = "/v1/xsrf-token",
    workflowInstancesPath = "/v1/workflow-instances",

    /**
     * opts:
     * - user: SCP user e.g. p481810
     * - pass: SCP password
     * - prod: SCP production (boolean, default false)
     * - definitionId: ID of workflow definition
     * - context: context to pass when starting the workflow instance
     */
    initiate = opts => {

        const
            client = axios.create({
                baseURL : wfsUrl
                    .replace(/USER/, opts.user)
                    .replace(/TRIAL/g, opts.prod ? "" : "trial"),
                auth : {
                    username : opts.user,
                    password : opts.pass
                }
            });

        return client
            .get(tokenPath, {
                headers : {
                    "X-CSRF-Token" : "Fetch"
                }
            })
            .then(res => {
                client
                    .post(workflowInstancesPath, {
                        definitionId : opts.definitionId,
                        context : opts.context
                    },
                    {
                        headers : {
                            "X-CSRF-Token" : res.headers["x-csrf-token"],
                            "Cookie" : res.headers["set-cookie"].join("; ")
                        }
                    })
                    .then(res => res.data)
                    .catch(err => err.status);
            });
    };

exports.initiate = initiate;
```

Here there's a single function defined and exported - initiate - which
takes a series of parameters in a map (opts), determines the Workflow
API root endpoint, based on the username and whether it's a trial
account or not.

I'm using the Promise-based HTTP library
[axios](https://github.com/axios/axios) to manage my sequential HTTP
requests, to avoid callbacks. First there's the GET request to
/v1/xsrf-token to request a token, and then there's the POST request to
/v1/workflow-instances to initiate a new instance. Inside the second
call, I'm taking the XSRF token that was returned from the first call
from the headers of the first response
(res.headers\["x-csrf-token"\]).

Note here that this being a more low level HTTP client library, there's no
automatic cookie handling as happens automatically in AJAX requests, or in
Postman (see [Discovering SCP Workflow - Instance
Initiation](/blog/posts/2018/01/14/discovering-scp-workflow-instance-initiation/) and
[Discovering SCP Workflow - Using
Postman](/blog/posts/2018/01/16/discovering-scp-workflow-using-postman/)). We
have to exert a little bit of manual effort - joining together any cookies
returned from the first response, using semi-colons, and sending them in the
second request in a Cookie header.

That's pretty much it. I have a nice simple function, running
serverless in the cloud, which I can call with minimal effort to kick
off a new workflow on the SAP Cloud Platform. Now I have that, I can go
to town on the important stuff - making sure that my workflow definition
fits the requirements and that the UI for the user task (making a choice
from the recommended beers) works well and is available to handle the
detail of the workflow item in the My Inbox app in the SAP Fiori
Launchpad.

Next post in this series: [Discovering SCP Workflow - Workflow
Definition](/blog/posts2018/01/18/discovering-scp-workflow-workflow-definition/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-members/discovering-scp-workflow-service-proxy/ba-p/13356138)
