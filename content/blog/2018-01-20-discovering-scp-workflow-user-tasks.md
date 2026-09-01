---
title: "Discovering SCP Workflow - User Tasks"
date: 2018-01-20
tags:
  - sapcommunity
description: Looking at the user task - present recommendations.
---

Previous post in this series: [Discovering SCP Workflow - Workflow
Definition](/blog/posts/2018/01/18/discovering-scp-workflow-workflow-definition/).

This post is part of a series, a guide to which can be found
here: [Discovering SCP
Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/).

We've now seen the workflow definition from 10,000 metres. It's time
to zoom in on the first of the three tasks therein - the user task
"Present Recommendations":

![](/images/2018/01/Screenshot-2018-01-18-at-09.27.24.png)

In my mind, user task types are special, in that they involve a human,
and as such need extra moving parts to work.

As you probably know, when you enable the Workflow service in your SCP
cockpit, various things are provisioned, including the My Inbox app in
an SCP Portal service based Fiori Launchpad (see [Discovering SCP
Workflow - The
Monitor](/blog/posts/2018/01/08/discovering-scp-workflow-the-monitor/)).
It's in this global workflow worklist app that user tasks appear, and
remain until the user takes action (such as to accept, reject, continue
or otherwise make known their decision or action related to that
specific step in the lifetime of the workflow instance). They can also
be suspended or terminated by an administrator.

## Our user task

You've already seen a glimpse of what the user task is, and should
enable, in [Discovering SCP Workflow - Service
Proxy](/blog/posts/2018/01/17/discovering-scp-workflow-service-proxy/):

![](/images/2018/01/Screenshot-2018-01-16-at-10.42.17.png)

We see that the My Inbox app is presenting 2 to-be-completed workflow
items - user tasks - for me to process. It just so happens that both
user tasks are the same (to select recommended beers), but My Inbox
collects together all user tasks from all types of different workflow
definitions.

## Configuring the task

Workflow definitions are created and maintained using the Workflow
Editor feature in the Web IDE:

![](/images/2018/01/Screenshot-2018-01-18-at-09.44.23.png)

This provides us with the facility to model entire workflow definitions,
including describing the flow with a graphical editor and specifying
task details too. Here's a screenshot of our user task definition
details:

![](/images/2018/01/Screenshot-2018-01-18-at-09.46.58.png)

We'll cover some of these now and some in the next post, but I don't
want to dwell too much on the mechanics of the User Task Properties
themselves - there's already a post by seshadri.sreenivasr "[How
Configure SAP CP Workflow User
Tasks](https://blogs.sap.com/2018/01/08/how-configure-sap-cp-workflow-user-tasks/)"
which covers this in great detail.

There's [documentation for configuring user
tasks](https://help.sap.com/viewer/f85276c5069a429fa37d1cd352785c25/Cloud/en-US/5e058cf1333b4e18bfa6431a52e991d3.html)
available, but in its present early form is a little light on detail. It
does make me smile, because it reminds me of a comedy flowchart which
looks something like this:

![](/images/2018/01/Screenshot-2018-01-18-at-09.51.53.png)

The documentation goes something along these lines:

1. enter this value into this property
2. press "OK"
3. select some other value for another property
4. specify the UI5 app you've built for presenting and handling the
   user task
5. \...

Wait, what?

## The My Inbox context

What UI5 app? How do I build it? What are the requirements? Well, we'll
cover some of this in this post, and complete the picture in the next
post. To set the scene, though - let's look at the context in which the
UI5 app appears - the My Inbox app.

There's a screenshot of the My Inbox app in action earlier. But even
before then, there's some SCP Workflow service goodness going on,
related to the dynamic tile on the Launchpad home page:

![](/images/2018/01/Screenshot-2018-01-19-at-14.25.38.png)

The value "2" is coming from a call to the Workflow API. Let's dig in
and use the Network panel of Chrome's developer tools to see:

![](/images/2018/01/Screenshot-2018-01-20-at-09.54.00.png)

Each of these three requests are the same, repeated every 15 seconds.
There are other requests too but I've filtered on the string
"bpmworkflow" here. (I can imagine this polling by the unified shell
infrastructure being eventually replaced by web sockets. But that's a
story for another time.)

That Request URL shown in the "Headers" section in the screenshot
looks pretty complex, let's break it down, decode the URL-encoded bits,
and add some nice whitespace:

```url
https://flpportal-p481810trial.dispatcher.hanatrial.ondemand.com
  /sap/fiori/bpmmyinbox/bpmworkflowruntime/odata/tcm
  /TaskCollection/$count/
  ?$filter=Status eq 'READY' or
           Status eq 'RESERVED' or
           Status eq 'IN_PROGRESS' or
           Status eq 'EXECUTED'
```

That's better! Much more friendly. What can we discern from this URL?

- it's a call to my instance of the portal service, of course
  (flpportal-p481810trial)
- there's a reference to a UI5 app (/sap/fiori/bpmmyinbox)
- and within that, a reference to a destination (/bpmworkflowruntime)
- following the destination reference there's some supplemental path
  info that suggests an OData service at that destination (/odata/tcm)
- and specifically within that OData service, there's a task
  collection entity (/TaskCollection)
- we're looking for how many entities there are (/\$count)
- specifically for entities with certain statuses (?\$filter=\...)

Gosh!

Indeed, looking at the neo-app.json file for the bpmmyinbox app, which,
with a bit of luck and a following wind, we can retrieve thus:

```url
https://flpportal-p481810trial.dispatcher.hanatrial.ondemand.com
  /sap/fiori/bpmmyinbox
  /neo-app.json
```

we see the bpmworkflowruntime destination:

```json
{
  path: "/bpmworkflowruntime",
  target: {
    type: "destination",
    name: "bpmworkflowruntime",
    entryPath: "/workflow-service",
  },
  description: "TCM Provider",
}
```

TCM stands for Task Consumption Model, by the way.

So after picking apart the URL earlier, looking at the definition of the
"bpmworkflowruntime" destination to see that the URL is our old
friend:

```url
https://bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com
```

and being mindful of the value for the "entryPath" property, we can
reconstruct the "real" unabstracted URL which we can consider as part
of the wider Workflow API:

```url
https://bpmworkflowruntimewfs-p481810trial.hanatrial.ondemand.com
  /workflow-service/odata/tcm/TaskCollection/$count/
  ?$filter=Status eq 'READY' or
           Status eq 'RESERVED' or
           Status eq 'IN_PROGRESS' or
           Status eq 'EXECUTED'
```

which, in my case, gives us, somewhat anticlimactically:

```text
2
```

This of course is the value that's shown in the dynamic tile earlier.

Anyway, at this point I find myself asking myself, as [David Byrne did
once](https://open.spotify.com/track/38Ngied9rBORlAbLYNCl4k), "well,
how did I get here?"

## UI5 app as task UI component

The answer to that question is simply that there's a lot to learn by
looking at what network calls are made. So let's continue.

When we think about it, it's obvious that the My Inbox app and
everything to do with it is going to make use of the Workflow API. Even
before it's loaded, in the case of the dynamic value on the tile as
we've just seen.

But what happens next? Well, let's click on the My Inbox tile and
observe the flow of traffic to the Workflow API using the same filter in
the Network panel. This is what we see, requests that follow on from the
repeated polling we saw already:

![](/images/2018/01/Screenshot-2018-01-20-at-11.02.45.png)

(Even though I value the performance improvements of batching requests
up with OData's \$batch, it does make me grimace somewhat when I'm
trying to see what's going on behind the curtain. Yes, I can use
setUseBatch to hack the model so things aren't batched up, but that's
not the point. Perhaps setting debug mode on in UI5 should also turn off
batch mode for OData models. What do you think? Let me know in the
comments below).

At this stage the UI looks like the screenshot earlier - the My Inbox
app showing two entries in the master list, with the first one selected
and showing the detail (for beer recommendations related to [my checkin
to Buxton Brewery's
Subluminal](https://untappd.com/user/qmacro/checkin/548688484)).

These requests to URLs containing "bpmworkflow" tell us quite a bit.
Let's dig in. The first request shown (\$metadata) is for the metadata
document that describes the tcm OData service that we saw earlier.

To a UI5 programmer, a fetch of an OData services \$metadata document is
a good indication that an OData model is being instantiated. If we take
a look at the initiator stack, we can see that the signs are strong:

![](/images/2018/01/Screenshot-2018-01-20-at-11.04.55.png)

Inside the Connection Manager module we can see the function flow:

initModels -\> each -\> (anonymous)

and at this point we have it confirmed:

```javascript
var oModel = bUseV2Model
  ? new sap.ui.model.odata.v2.ODataModel(sUrl, oConfig)
  : new sap.ui.model.odata.ODataModel(sUrl, oConfig);
```

(That's on line 219 of ConnectionManager-dbg.js that is loaded with UI5
1.50.7, for those of you who are interested.)

And the absolute URL for the OData service's metadata document is, as
we've established:

```url
https://flpportal-p481810trial.dispatcher.hanatrial.ondemand.com
  /sap/fiori/bpmmyinbox/bpmworkflowruntime
  /odata/tcm/$metadata
```

So it's likely that we're going to see some OData query operations on
this service to retrieve the tasks relevant for me in My Inbox. Sure
enough, following the metadata document retrieval, in one of the \$batch
requests to this OData service is exactly what we're looking for. It
contains a single call, an HTTP GET on the TaskCollection entityset,
representing a query. Here it is (at least, the most significant part)
in all its URL-decoded glory:

```url
TaskCollection
  ?$skip=0
  &$top=1000
  &$orderby=CreatedOn desc
  &$filter=((Status eq 'READY' or
             Status eq 'RESERVED' or
             Status eq 'IN_PROGRESS' or
             Status eq 'EXECUTED'))
  &$select=SAP__Origin,
           InstanceID,
           TaskDefinitionID,
           TaskDefinitionName,
           TaskTitle,
           [...]
           SupportsAttachments
  &$inlinecount=allpages
```

That OData query operation returns a collection of two entities. Yes,
you guessed it, those two entities are the two tasks shown in the master
list in My Inbox.

There are further \$batch requests that contain more OData operations
that are used to bring back data to populate the details of the
automatically selected first task, but we'll ignore those for now.
Instead, let's look at the detail - specifically the \<content/\> - of
the first of those two TaskCollection entities returned in response to
the query we've just examined. Here it is, representing the task
"Recommended beers similar to Subluminal":

![](/images/2018/01/Screenshot-2018-01-20-at-11.28.02.png)

Lots of goodness there.

There's one particular property that catches my eye. And it's what
I'll leave you with to take us through to the next post. First though,
a question.

*How does My Inbox know how to represent a particular user task?*

Going back to the high level steps described earlier in the official
documentation, we have step 4, which says: "specify the UI5 app you've
built for presenting and handling the user task". Well, it represents a
user task with this very UI5 app you've specified for that particular
user task in that particular workflow definition.

And look - that property which caught my eye is the GUI_Link one, which
has this value:

```url
sapui5://html5apps
  /untappdrecommendationapproval
  /qmacro.UntappdRecommendationApproval
```

That's a funky kind of internal scheme ("sapui5://") going on there!
But it makes sense. When the workflow instance was instantiated, and the
user task step initiated, the configuration specified here:

![](/images/2018/01/Screenshot-2018-01-20-at-11.36.30.png)

was bound into the instance, so that when it comes to the crunch, and My
Inbox needs to display that particular user task, it knows which UI5 app
to load. Magic!

Let's confirm that by changing the filter in the Network panel and
seeing how the requests continue as the task detail is loaded into the
UI. And yes, we see what we're hoping to see - a request for the heart
of the UI5 app we've specified for this user task, the Component of the
HTML5 app "untappdrecommendationapproval":

![](/images/2018/01/Screenshot-2018-01-20-at-11.41.19.png)

What's more, in the initiator stack, we get a clear insight into what
goes on and how the decision is made in the controller belonging to the
S3\* (detail) view as to which Component (ie which UI5 app) to load:

fnGetDetailsForSelectedTask -\> fnParseComponentParameters -\>
fnRenderComponent

and you can bet a decent craft beer that it's in there that the URI we
saw earlier:

```url
sapui5://html5apps
  /untappdrecommendationapproval
  /qmacro.UntappdRecommendationApproval
```

is parsed and used.

*\* S3 is traditionally the detail view, and specificially the detail
view in a scaffolding-based app. Did anybody notice that My Inbox was a
scaffolding-based app? Let me know in the comments what you spotted in
this post that suggested it was.*

OK, so where are we?

We have a couple of workflow instances, and we've seen how the My Inbox
app retrieves information for them, and when it has to display the
details for one of them, we know how it works out how to display those
details.

In the next post, we'll keep on digging, and look at understanding what
happens when a task UI component like this one (the Component of
qmacro.UntappdRecommendationApproval) is instantiated. How does it know
what to do, where to get the information from, and so on?

Next post in this series: [Discovering SCP Workflow - Component
Startup](/blog/posts/2018/01/22/discovering-scp-workflow-component-startup/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-members/discovering-scp-workflow-user-tasks/ba-p/13359863)
