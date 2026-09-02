---
title: "Discovering SCP Workflow - Workflow Definition"
date: 2018-01-18
description: Now that we've covered how to kickstart a workflow instance, It's time to look at the overall picture of what we're building.
tags:
  - btp
  - workflow
  - api
  - discovering-scp-workflow
  - sap-community
---

Previous post in this series: [Discovering SCP Workflow - Service
Proxy](/blog/posts/2018/01/17/discovering-scp-workflow-service-proxy/).

This post is part of a series, a guide to which can be found
here: [Discovering SCP
Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/).

What we're building is a relatively simple process backed by a three-step
workflow definition, which contains one each of the three different task types
(user, script and service). I can't imagine this process being particularly
useful in the enterprise, but then again, I created it for fun, to help my
learning journey, and to be about stuff I'm interested in - stats and info
about craft beer. What's not to like?

## General idea

Like many of my friends and colleagues, I'm a fan of craft beer as well
as someone who likes building with data and putting new technologies
through their paces. [Untappd](https://untappd.com) is a place where
like-minded folks record (via 'checkins') what beers they're
drinking, rating and describing them, sending toasts and comments to
each other, and generally having a pleasant time enjoying socialising
with good brews.

Crucially there's an [API](https://untappd.com/api/docs) that offers
access to the rich seam of data that is being gathered, on checkins,
beer ratings, breweries, venues, users and so on.

I'm always on the lookout for new beers, and to improve my stats,
because, well, badges!

![](/images/2018/01/Screenshot-2018-01-17-at-06.48.23.png)

So the general idea is to monitor what beers I check in, and then
provide me with a selection of similar beers for me to choose from;
those I choose end up on a wishlist of sorts, for me to use as a
reference on future purchases.

## The landscape

This process is to run exlusively in the cloud. So the landscape
consists solely of platforms that are cloud based. The Untappd API
itself of course is "up there", and if you've read the previous post
in this series, [Discovering SCP Workflow - Service
Proxy](/blog/posts/2018/01/17/discovering-scp-workflow-service-proxy/),
you'll know that the solution spans the Google Cloud Platform (GCP) and
the SAP Cloud Platform (SCP).

Here's a high level schematic showing the parts of the solution.

![](/images/2018/01/Screenshot-2018-01-17-at-07.17.58.png)

### On GCP

I've long been a fan of what's now known as G Suite (Google docs,
sheets, and so on), for a number of reasons:

- the features are exactly what I need, not bloated, and don't get in
  the way of producing content
- my content is secure, and the ability to create, edit and organise
  it is available everywhere
- it is **of** the web, rather than just **on** the web (more on that
  another time, perhaps)

and last but not least, it has a fantastic JavaScript-based scripting
environment, with access to the G-Suite data and functions, and access
to the myriad GCP services too. I've used, and [written
about](/tags/appsscript/) Apps Script a
number of times.

Of course, with the SAP and Google partnership moving ever closer, it's
an ideal complementary platform to SCP.

So on GCP, I have a script that:

- checks the RSS feed of my checkins that Untappd makes available to
  me
- stores new checkins (in a spreadsheet)
- processes new checkins by looking up the checkin detail, finding the
  beer ID, and then retrieving the beer info for that beer, which
  includes a "similar beers" section

This is done on a regular basis with time-based triggers (think
[cron](https://en.wikipedia.org/wiki/Cron) for your scripts in the
cloud), using various core services such as the script service
[UrlFetchApp](https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app)
and the G Suite service
[SpreadsheetApp](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app).

This is what the spreadsheet looks like:

![](/images/2018/01/Screenshot-2018-01-17-at-07.27.35.png)

The empty cell in the last row shows that while the new checkin has been
retrieved via the "Poll and store" step, it hasn't yet been processed
by the "Process new checkins" step. (This is somewhat artificial,
though - in real life the second step happens directly after the first -
I just edited the sheet to highlight the difference in steps.)

In the [previous
post](https://blogs.sap.com/2018/01/17/discovering-scp-workflow-service-proxy/)
we looked at what then happens - the script initiates a new workflow
instance on the SCP Workflow service via the service proxy cloud
function.

### On SCP

The whole idea of this exercise was to dig deeper into the SCP Workflow
service, so obviously that's what we're putting into play here. I've
[modelled a
workflow](https://help.sap.com/viewer/f85276c5069a429fa37d1cd352785c25/Cloud/en-US/2d65f7db785d4867a49fe8eec3b040be.html)
using the [SAP Web IDE](http://developer.sap.com/webide) and it
incorporates the three steps in the process above:

- Present similar beers - this is a task that involves a human (me) to
  be presented with information and to make a decision, for the
  workflow instance to move on to the next stage. The appropriate task
  type in the workflow definition for this is a [User
  Task](https://help.sap.com/viewer/f85276c5069a429fa37d1cd352785c25/Cloud/en-US/5e058cf1333b4e18bfa6431a52e991d3.html).
- Marshal selections - selections made from the list of similar beers
  are stored back in the workflow instance's context. At this stage
  we want to organise the right data, in the right shape, to be sent
  to a service which will store the selections on a list. We can
  perform this in JavaScript inside of a [Script
  Task](https://help.sap.com/viewer/f85276c5069a429fa37d1cd352785c25/Cloud/en-US/ca9a4381628a40908ffe1f74bde9f3ce.html)
  which has full access to the instance's context.
- Add to wishlist - the marshalled data is sent to a remote service
  which stores the selections in the wishlist. This is done in a
  [Service
  Task](https://help.sap.com/viewer/f85276c5069a429fa37d1cd352785c25/Cloud/en-US/a8a6267f537841fbb22c159ba2af8835.html),
  which connects to the remote service via SCP's Connectivity
  Service. You and me would probably say "via a destination".

It isn't by accident that the three steps in this process exercise each
of the three types of task - I wanted to create something that caused me
to use each of them. Of course, future iterations of this solution
design might move some of the processing from GCP into SCP, as further
steps in the workflow definition. But for now this will do nicely.

Let's take a look at the workflow definition model.

![](/images/2018/01/Screenshot-2018-01-17-at-08.35.00.png)

Each task's type is denoted by the icons in the top left corners -
user, script and service respectively.

I must say, I found the editing of the workflow definition in the Web
IDE went very well.

In the next few posts in this series, I'll dive deeper into each of
these tasks as defined for this solution, including a little bit of how
they're defined in the editor. The next post will cover user tasks in
general, and start to look at the "Present recommendations" script
task in particular.

Next post in this series: [Discovering SCP Workflow - User
Tasks](/blog/posts/2018/01/20/discovering-scp-workflow-user-tasks/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-members/discovering-scp-workflow-workflow-definition/ba-p/13357746)
