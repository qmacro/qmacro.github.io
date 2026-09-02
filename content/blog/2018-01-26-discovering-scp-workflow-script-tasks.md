---
title: "Discovering SCP Workflow - Script Tasks"
date: 2018-01-26
description: Taking a look at script tasks.
tags:
  - btp
  - workflow
  - discovering-scp-workflow
  - sap-community-post
---

Previous post in this series: [Discovering SCP Workflow --
Recommendation
UI](/blog/posts/2018/01/24/discovering-scp-workflow-recommendation-ui/).

This post is part of a series, a guide to which can be found
here: [Discovering SCP
Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/).

It's time to move on from user tasks and take a look at script tasks.
By this point in the series, we've reached the stage where the user has
been presented with a list of beers, recommended because of the beer
that was originally checked in. They've made their choice in the
[recommendation
UI](/blog/posts/2018/01/24/discovering-scp-workflow-recommendation-ui/) and
hit the Continue action button to move on.

Let's remind ourselves of the flow, from a previous post in this
series: [Discovering SCP Workflow - Workflow
Definition](/blog/posts/2018/01/18/discovering-scp-workflow-workflow-definition/):

![](/images/2018/01/Screenshot-2018-01-17-at-07.17.58.png)

It's time to marshal the user's selections, and for that we can use a
script task.

## Script tasks and JavaScript

From reading the [documentation on script
tasks](https://help.sap.com/viewer/f85276c5069a429fa37d1cd352785c25/Cloud/en-US/ca9a4381628a40908ffe1f74bde9f3ce.html),
we find that, at least in the Workflow service's current incarnation,
script tasks are relatively simple and restricted. That said, they're a
very useful mechanism for manipulating the data within a workflow
instance before moving on to further steps in the flow.

Script tasks are written in JavaScript. Beware, however, that it's
specifically ECMAScript (ES) 5.1, rather than any later version of
JavaScript. Being functionally inclined, I tend to write a lot of ES6
style JavaScript, using fat arrow syntax and so on, but that's not
supported here.

If you do write ES6, you'll be warned by the linter, like this:

![](/images/2018/01/eslint-error.png)

ES6 came into being for most people in 2015, but there are still systems
where it's not yet supported. This is one of them. Another major system
where I still have to write ES5 code is in Google Apps Scripts.
Interestingly that's another cloud based, server side execution context
service. So it's not an isolated issue at all. I mean, it's not that
it's an issue per se - I just personally prefer ES6.

The script task itself, in the workflow definition, is very simple - it
just points to a JavaScript file within the workflow project:

![](/images/2018/01/Screenshot-2018-01-26-at-08.58.06.png)

We'll see the content of that file shortly.

## What can you do?

The documentation says "Configure a script task if you want the system
to run a script to perform a task in the workflow", which is quite
generic.

Considering the sandbox within which the JavaScript is executed, and the
access that JavaScript has, there's currently really only a single main
focus for script tasks, and that's to access and manipulate the
workflow instance's context.

Why might you want to do that? Well, a number of reasons come to mind:

- to make calculations and set values that can be tested in further
  steps within the workflow
- to combine and otherwise modify existing data
- to marshal a set of properties ready for a further step within the
  workflow, specifically a service task step

There are couple of special variables available that afford access to
the context and a little bit of the workflow instance metadata:

- \$.context - this is the entire workflow instance context
- \$.info - this exposes some instance specific metadata (currently
  the workflow instance ID, the ID of the script task itself, and the
  ID of the workflow definition)

Stepping back from the keyboard for a second, one might imagine the
scope of access expanding to include other data in a workflow instance.
How about being able to see other tasks within the instance, and modify
their properties, such as a user task's priority, or the path of a
service task's endpoint?

Of course, there's a balance to be had between changing these things
dynamically, and perhaps "opaquely" in code within a script task, and
making things more "explicit" with other workflow definition
mechanisms at our disposal, such as
[gateways](https://help.sap.com/viewer/f85276c5069a429fa37d1cd352785c25/Cloud/en-US/22cda7ec05514383b914229b57b0f5cf.html).
It all depends of course. I'm sure the Workflow service team are
thinking hard about these issues and the pros and cons of each
approach.

## Marshalling recommendations

Going back to the reasons for using a script task that we considered
earlier, our simple workflow definition calls for the readying of values
in preparation for a call to a remote service in the next step - a
service task, which we'll look at next time.

Considering what we have right now, there's a [ton of
information](https://untappd.com/api/docs#beerinfo) in the context, put
there for the most part when the instance was kicked off. We also have
indications of which beers the user selected in the task UI, for
inclusion within their wishlist.

These indications are the presence of a new property "\_selected" in
the similar items array. Let's remind ourselves of what this might look
like.

This chunk of JSON shows the "similar" property in the (heavily
redacted) context of a workflow instance started following a check-in to
[Westmalle
Dubbel](https://untappd.com/b/brouwerij-der-trappisten-van-westmalle-westmalle-trappist-dubbel/4168),
and where the user selected [Tripel
Karmeliet](https://untappd.com/b/brouwerij-bosteels-tripel-karmeliet/6511)
(the queen of beers!) and [Trappistes Rochefort
10](https://untappd.com/b/abbaye-notre-dame-de-saint-remy-trappistes-rochefort-10/6766)
(a solid quadrupel):

```json
"similar": {
    "count": 5,
    "items": [
        {
            "beer": {
                "bid": 487,
                "beer_name": "Westmalle Trappist Tripel",
                [...]
            },
        },
        {
            "beer": {
                "bid": 6511,
                "beer_name": "Tripel Karmeliet",
                [...]
            },
            "_selected": true
        },
        {
            "beer": {
                "bid": 1830,
                "beer_name": "La Trappe Quadrupel",
                [...]
            },
        },
        {
            "beer": {
                "bid": 6766,
                "beer_name": "Trappistes Rochefort 10",
                [...]
            },
            "_selected": true
        },
        {
            "beer": {
                "bid": 34039,
                "beer_name": "Chimay Blue / Bleue / Blauw (Grande Réserve)",
                [...]
            },
        }
    ]
}
```

Note the two "\_selected" properties.

We want to marshal the selected recommendations, along with some small
details about the original beer that was checked in, ready to send to
the external service in the next step.

Here's the entire code in the script task, contained in the
marshalSelectedRecommendations.js script:

```javascript
$.context.wishlistEntry = {
    checkin : {
        bid : $.context.beer.bid,
        beer_name : $.context.beer.beer_name,
        brewery_name : $.context.beer.brewery.brewery_name
    },
    selected : $.context.beer.similar.items
        .filter(function(x) { return x._selected; })
        .map(function(x) {
            return {
                bid : x.beer.bid,
                beer_name : x.beer.beer_name,
                brewery_name : x.brewery.brewery_name
            };
        })
};
```

Yes, I know it would look much nicer with ES6 fat arrow syntax, thank
you very much.

The key point here, I guess, is that the code is very simple, and almost
not worth examining too much, except for these points:

- we're using the \$.context variable to access the entire context
- we're creating a new property in the context called
  "wishlistEntry" that we'll use in the next step
- obviously we're only gathering the recommendations that were
  selected (with the filter call)

And that's it. At this point, we "let go" and allow the flow to
continue on to the next step, which is an call to send this
wishlistEntry to an external service.

## A note on empty wishlists

The astute amongst you may be thinking: "Wait, the user might not have
chosen any of the recommendations, what then? Are we going to append an
empty list to the wishlist in this case?"

Well, for the purposes of this series, we are. There's a time and a
place to look at more complex workflow definitions that use decision
points and forks in the flow to deal with different situations. While
the place might be here, the time is not right now. We'll keep things
simple and maintain a single threaded flow in the definition.

## Final thoughts

Actually the hardest thing about building this script task was not
writing the JavaScript, but having the context at hand, including the
recommendation selections from the previous user task. It's always
nicer to write code, even code as simple as this, against some real
data, rather than just imagining the shape of it in your head.

![](/images/2018/01/Screenshot-2018-01-17-at-08.35.00.png)

The challenge was that as soon as the user task "Present
Recommendations" completed, when the user hit the "Continue" button
in the task UI, the flow continued on and executed whatever was in the
script task "Marshal selections" (this task) at the time. Too late for
any examination of the context that we wanted to manipulate!

If you want to find out how I dealt with this issue, let me know in the
comments, and I can write about it in an appendix to this series.

In the next post, we'll look at sending the wishlistEntry data to an
external service, to collect together the general beer wishlist I want
to build up.

*This morning's post was brought to you by [El Aguacate from Pact
Coffee](https://www.pactcoffee.com/coffees/el-aguacate-espresso), Erroll
Garner's [Ready Take
One](https://open.spotify.com/album/1cb4bE5Q1vLla4jjoNV1gS) and the
number 14.1.*

Next post in this series: [Discovering SCP Workflow - Service
Tasks](/blog/posts/2018/01/29/discovering-scp-workflow-service-tasks/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-members/discovering-scp-workflow-script-tasks/ba-p/13371812)
