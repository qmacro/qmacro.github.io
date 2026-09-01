---
title: "Discovering SCP Workflow - Service Tasks"
date: 2018-01-29
tags:
  - scp
  - workflow
  - sapcommunity
description: Wrapping up with a look at service tasks.
---

Previous post in this series: [Discovering SCP Workflow -- Script
Tasks](/blog/posts/2018/01/26/discovering-scp-workflow-script-tasks/).

This post is part of a series, a guide to which can be found
here: [Discovering SCP
Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/).

We're almost done! In the [previous
post](/blog/posts/2018/01/26/discovering-scp-workflow-script-tasks/)
we looked at how we marshalled data to post to the nominal beer
wishlist. Now it's time to send that data to the wishlist. As the focus
of this series is the Workflow service on the SAP Cloud Platform and not
on peripheral affairs, we're just going to append the wishlist entries
to a list on a remote data service. I'll leave it as an exercise for
the reader to implement a UI for that wishlist data.

Like script tasks, service tasks are very straightforward. They're
slightly more involved, given that they are designed to make HTTP
requests to remote endpoints, and there's sometimes a little bit of
fettling required, mostly relating to security and connectivity
aspects.

## The payload

So, where are we? We've got the wishlist entry data marshalled and
ready to send. Let's remind ourselves of what it looks like:

```json
{
  "checkin": {
    "bid": 4168,
    "beer_name": "Westmalle Trappist Dubbel",
    "brewery_name": "Brouwerij der Trappisten van Westmalle"
  },
  "selected": [
    {
      "bid": 6511,
      "beer_name": "Tripel Karmeliet",
      "brewery_name": "Brouwerij Bosteels"
    },
    {
      "bid": 6766,
      "beer_name": "Trappistes Rochefort 10",
      "brewery_name": "Abbaye Notre-Dame de Saint-Rémy"
    }
  ]
}
```

### The target wishlist store

As well as G Suite, I'm a big fan of the Firebase ecosystem, having
dabbled with it for a while (including musing on the possibilities when
you add Firebase to UI5 - see the "[Firebase and
SAPUI5](http://pipetree.com/qmacro/blog/2012/04/15/firebase-and-sapui5/)"
post from back in 2012 if you're curious). I've created a simple
Firebase project and am using the database as my target wishlist storage
system. It's really straightforward to build a UI5 app on top of a
Firebase database; my friend Former Member and I [built a
Firebase-powered dashboard and separate UI5 companion
app](http://www.bluefinsolutions.com/insights/chris-choy/november-2017/ok-google,-meet-sap)
to control it - it was on show on the Google stand at SAP TechEd in
Barcelona in 2017.

Here's what the data looks like - each wishlist entry appears as a node
within the "wishlist" node:

![](/images/2018/01/Screenshot-2018-01-27-at-12.19.39.png)

You can see the structure of the marshalled data being reflected
directly as child nodes here. There's another collapsed node (ending
"\_4pFaZGr") within the wishlist node, containing another wishlist
entry.

## Defining the service task

The service task is the last task in the workflow definition, and the
details look like this:

![](/images/2018/01/Screenshot-2018-01-27-at-12.25.51.png)

You can see a more detailed explanation of these service task settings
in the great series by Murali Shanmugham - in particular see [Part 3
of Implementing a user self-registration scenario using Workflow and
Business rules in SAP Cloud
Platform](https://blogs.sap.com/2017/08/01/implementing-a-user-self-registration-scenario-using-workflow-and-business-rules-in-sap-cloud-platform-part-3/).
We'll just focus on the settings needed here.

The execution of a service task like this is the result of the lovely
coordination between three things:

- access to the workflow instance context
- a mechanism in the Workflow service to deal with the XSRF token
  fetching and subsequent utilisation
- the Connectivity service on the SAP Cloud Platform

Here we've specified "untappdwishliststore" as the value for the
"Destination" setting. You guessed it - this is a destination managed
within the Connectivity service, a service central to almost everything
that goes on in SCP.

Let's take a quick look at how this destination is defined:

![](/images/2018/01/Screenshot-2018-01-27-at-12.18.05.png)

The full value of the URL here is:

```url
https://untappdrecomendations.firebaseio.com
```

If you refer to the Firebase database REST API documentation, you'll
see that this is the "root" URL for the data store in the Firebase
project "untappdrecommendations", and read/write access to the nodes
within the data store is available simply by extending the URL to
include path info referring to the node required. For example, this
URL:

```url
https://untappdrecomendations.firebaseio.com/wishlist.json
```

refers to the "wishlist" node, such that a GET request works like
this:

```shell
qmacro@cloud-shell:~$ curl https://untappdrecommendations.firebaseio.com/wishlist.json | jq '.'
{
  "-L3rXLpoPKRrWkhg7E-Z": {
    "checkin": {
      "beer_name": "Straffe Hendrik Brugs Quadrupel Bier 11°",
      "bid": 41289,
      "brewery_name": "De Halve Maan"
    },
    "selected": [
      {
        "beer_name": "Brugse Zot",
        "bid": 4713,
        "brewery_name": "De Halve Maan"
      },
      [...]
qmacro@cloud-shell:~$
```

Note how the documentation describes simply appending ".json" to the
URL to make things work.

We can add children to this node by using POST, again, specifying the
path info:

```url
/wishlist.json
```

Of course, we need to supply the child data in JSON, which,
serendipitously, is exactly what the service task will do for us.

With this in mind, it makes sense that the value specified for the
script task's Path setting is indeed "/wishlist.json", which gets
appended to the URL defined in the destination.

This resource is not XSRF-protected, so we don't need to have the
script task service fetch a token for us first (and then supply it in
the actual POST request), so the "Path to XSRF Token" setting remains
empty.

Finally, we need to specify where the data is that we want sent, and
where (if anywhere) we want what comes back in the response to be
stored. In our case, we've marshalled the wishlist entry into the
"wishlistEntry" property in our context, so that's what we specify.
And we're not interested in the response payload so we don't specify
anything for the Response Variable setting.

## The service task in action

Let's see the service task in action. We select the two beers
highlighted as recommendations:

![](/images/2018/01/Screenshot-2018-01-27-at-16.02.25.png)

The script task marshals the wishlist entry based on those selections,
and the service task kicks in, sending this wishlist entry to be stored
in the Firebase database, where it appears immediately (we're looking
at the Firebase console database view / editor here):

![](/images/2018/01/Screenshot-2018-01-27-at-16.00.50.png)

By remaining in the workflow monitor app (which we looked all the way
back in [Discovering SCP Workflow - The
Monitor](https://blogs.sap.com/2018/01/08/discovering-scp-workflow-the-monitor/)),
we can see the execution logs run to completion before the item
disappears (as the instance is set to complete):

![](/images/2018/01/Screenshot-2018-01-27-at-15.59.58.png)

Clicking on the "untappdwishliststore" link there shows the method and
the URL used for the service endpoint:

```text
POST https://untappdrecommendations.firebaseio.com/wishlist.json
```

## Redirect gotcha

I thought it worth mentioning that an earlier iteration of this step in
the workflow saw me trying to send the data to a Google spreadsheet,
using Google Apps Script (exposing a [web
app](https://developers.google.com/apps-script/guides/web)). This is
something I do very often, and it's super useful.

I typically use the Content Service to return responses to requests that
I'm handling with such a script, but there's a [security design
feature](https://developers.google.com/apps-script/guides/content#redirects) that
means the response to requests to such web apps is served from a
different host, via an HTTP 302 FOUND redirect mechanism. This is all
well and good, however the [HTTP
specification](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)
states:

*"If the 302 status code is received in response to a request other
than GET or HEAD, the user agent MUST NOT automatically redirect the
request unless it can be confirmed by the user, since this might change
the conditions under which the request was issued."*

That means that when sending a POST request to an endpoint that responds
with a 302 status code, the service task mechanism cannot automatically
follow that redirect, as it's obeying RFC2616. [One does not
simply](http://knowyourmeme.com/memes/one-does-not-simply-walk-into-mordor)
ignore RFC2616!

The upshot of this was that I was unable to make a POST request to my
apps script successfully. I may look at avoiding the Content Service in
future iterations, but it's not that important right now.

## Closing thoughts

Our workflow is complete. It was a relatively simple one; nonetheless it
shows many of the major features that the Workflow service offers. The
journey of discovery I've been on in preparing for and writing this
series has taught me a lot about the service, and I've become a fan.

I hope that you get something from these posts, and look into the
Workflow service too. It's positioned to be a very powerful and capable
set of tools for connecting humans and processes across the range of
systems (SAP and non-SAP) within and beyond an enterprise.

The Workflow service is a great example of what I see as the new SAP -
as I [tweeted](https://qmacro.org/tweets/qmacro/status/956877216402505729)
earlier this week, I built the entire workflow, wrote and tested the
JavaScript, debugged and iterated upon the flow definition and worked
out what I was doing and where I was going, entirely online, using no
workstation-local tools. My workstation is running Chrome OS. (Yes, I
wrote this series all online too, of course). I suspect this trend
towards web terminals will continue.

I'll drink to that!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-members/discovering-scp-workflow-service-tasks/ba-p/13373673)
