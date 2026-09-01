---
title: "Discovering SCP Workflow - Component Startup"
date: 2018-01-22
tags:
  - ui5
  - webide
  - api
  - untappd
  - scp
  - workflow
  - sapcommunity
description: In this post we'll look into how a task UI starts up, where it gets the right data to display, and how it interacts with the My Inbox "host" app.
---

Previous post in this series: [Discovering SCP Workflow -- User
Tasks](/blog/posts/2018/01/20/discovering-scp-workflow-user-tasks/).

This post is part of a series, a guide to which can be found
here: [Discovering SCP
Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/).

If you've followed the series so far, you'll know we're at the point
now where we're in the My Inbox app, the user task currently selected
is from the beer recommendation workflow definition, and we understand
how the host app (My Inbox) knows how to get the user task rendered in
the detail view of the classic master-detail layout.

To refresh our memories, it's via the URI associated with the
workflow's task (via the Task Collection entityset) in the GUI_Link
property:

```url
sapui5://html5apps
  /untappdrecommendationapproval
  /qmacro.UntappdRecommendationApproval
```

In the previous post we also saw how the task UI component is
instantiated:

fnGetDetailsForSelectedTask -\> fnParseComponentParameters -\>
fnRenderComponent

Here's a snapshot at what's going on in this sequence, where the task
UI component is about to be created (you can see the sequence in reverse
order in the Call Stack on the right hand side):

![](/images/2018/01/Screenshot-2018-01-21-at-12.56.21.png)

For the reader (like me) who always wants to see the detail, the value
of oComponentParameters.ComponentName in the createComponent call on
lines 319-322 is "qmacro.UntappdRecommendationApproval". No surprises
there, but it's always nice to have assumptions confirmed. And yes,
this is happening in the host app's S3 (detail) controller.

## Task UI component data

There's a second property in the the map passed in the createComponent
call there, and that is componentData (on line 321).

The componentData property is not uncommon when instantiating UI5
components in general - it's the normal way to pass data at startup
time. And that's exactly what's happening here. The host app, My
Inbox, has all the details of the task instance to be displayed, and
needs to pass these to the component that it has worked out it needs to
instantiate for that purpose.

Let's take a look at what's contained in oCompData, which is the
variable containing the data that's passed in the componentData
property:

![](/images/2018/01/Screenshot-2018-01-21-at-13.09.33.png)

Lots of interesting stuff! Generally, it falls into a couple of
categories:

- links to the "inbox" (ie the host app)
- references to the task specific data

### The inbox API

There's the inboxAPI property in the startupParameters map - this
consists of various functions that you might guess are related to
interacting with the host app. And you'd be right. Maintaining action
buttons (for example to allow the user to accept or reject a task) is a
key facility. These buttons are to appear at the bottom of the task UI,
but are not part of it - they live within the footer of the host app's
detail view - take a look again at the My Inbox, this time with the
workflow log being displayed:

![](/images/2018/01/Screenshot-2018-01-21-at-13.22.05.png)

Effectively, the task UI is rendered within the host app, and is
represented by the red outline here. The Continue button is in the
footer, not in any part of the task UI itself.

### Task information

The other category relates to the data specific to the task. In the
startupParameters map there's the taskModel property. If you were to
invoke some introspection goodness upon this property, you'd see it was
a JSON model:

```text
> oCompData.startupParameters.taskModel.getMetadata()
< Metadata {
    _sClassName: "sap.ui.model.json.JSONModel",
    _oClass: ƒ,
    _oParent: Metadata,
    _bAbstract: false,
    _bFinal: false, …}
```

Can you resist looking to see what's in it? I can't. Let's do it:

```text
> oCompData.startupParameters.taskModel.getData()
> {
    CreatedBy: "P481810",
    CreatedOn: Sat Jan 20 2018 09:34:02 GMT+0000 (GMT) {},
    InstanceID: "0cdb90a1-fdc5-11e7-bb2a-00163e504470",
    Status: "READY",
    TaskDefinitionID: "usertask1",
    TaskDefinitionName: "Untappd Beer Recommendations",
    TaskTitle: "Recommended beers similar to Subluminal"
    [...]
  }
```

Gosh, that seems like exactly what the task UI will need!

## Bootstrapping the task UI

There are already a couple of nice posts on writing a task UI:

- [Getting started with SAP Cloud Platform Workflow -- How to build a
  simple approval
  UI](https://blogs.sap.com/2017/11/06/getting-started-with-sap-cloud-platform-workflow-how-to-build-a-simple-approval-ui/)
  by Christian Loos
- [Part 1C: Working with Task APIs in your Custom HTML5
  application](https://blogs.sap.com/2017/10/12/part-1c-working-with-task-apis-in-your-custom-html5-application/) by Archana Shukla

While I don't want to repeat what has already been covered, I think
it's worth looking at how a task UI component starts up, within the
context of the dive into the component data that we've just taken.

I'll cover the majority of the UntappdRecommendationApproval app in the
next post. Here, we'll focus on what goes on in the Component.js,
specifically in the init function.

Let's lay that function out so we can get a good look at what's going
on:

```javascript
init: function() {
    // call the base component's init function
    UIComponent.prototype.init.apply(this, arguments);

    // enable routing
    this.getRouter().initialize();

    // set the device model
    this.setModel(models.createDeviceModel(), "device");

    // app-wide helper model
    this.setModel(models.createAppModel(), "app");

    // get task data
    var startupParameters = this.getComponentData().startupParameters;
    var taskModel = startupParameters.taskModel;
    var taskData = taskModel.getData();
    var taskId = taskData.InstanceID;

    // initialize model
    var contextModel = new sap.ui.model.json.JSONModel("/bpmworkflowruntime/rest/v1/task-instances/" + taskId + "/context");
    this.setModel(contextModel);

    // Ensure we have access to the Inbox API before continuing
    // (we don't except when running within the My Inbox context, ie
    // when running "for real", rather than in test mode).
    if (startupParameters.inboxAPI) {

        // get the task description
        var appModel = this.getModel("app");
        startupParameters.inboxAPI.getDescription("NA", taskId)
            .done(function(data){
                appModel.setProperty("/taskDescription", data.Description);
            })
            .fail(function(errorText){
                jQuery.sap.require("sap.m.MessageBox");
                sap.m.MessageBox.error(errorText, { title: "Error"});
            });

        //add actions
        startupParameters.inboxAPI.addAction({
            type: "Accept",
            label: "Continue"
        }, function(button) {
            this._completeTask(taskId, true);
        }, this);

    }
},
```

Where possible, I've followed the pattern shown by Christian and
Archana, in getting access to the taskModel and other details.

Let's take it bit by bit.

The first part is fairly standard. This is what we do:

- call the component's superclass's init function
- initialise the router mechanism
- create a device model and set it on the component

Nothing surprising there, and also nothing related specifically to the
fact that this is a task UI app.

Next:

- I decided to create an app-wide helper model which is a common
  pattern in UI5 apps; so far I'm only storing one particular
  property in it (in the next bit), but hey ho

Then, it's time to go to town on the task specific stuff:

- getComponentData is the standard way to access data associated with
  a component when it was instantiated. So here we're retrieving the
  oCompData passed via the componentData property in the call to
  createComponent that we saw earlier
- from there we can grab the taskModel and get the data
- within that data there's the InstanceID property, which, in the
  example above, has a value of
  "0cdb90a1-fdc5-11e7-bb2a-00163e504470" and which we store in a
  local variable taskId

What do we do with the ID of this instance? Well, invoke the services of
the Workflow API, of course!

What are we invoking, specifically? Let's have a look. First,
substituting the instance ID value for the taskId variable, the relative
URL in the JSON model instantiation is:

```url
/bpmworkflowruntime/rest
  /v1/task-instances/0cdb90a1-fdc5-11e7-bb2a-00163e504470
  /context
```

We already can guess that the "bpmworkflowruntime" is a reference to a
route pointing to the Workflow Runtime destination in our SCP
Connectivity Service, as we discussed in a previous post [Discovering
SCP Workflow - Instance
Initiation](/blog/posts/2018/01/14/discovering-scp-workflow-instance-initiation/):

```json
{
  "path": "/bpmworkflowruntime",
  "target": {
    "type": "destination",
    "name": "bpmworkflowruntime",
    "entryPath": "/workflow-service"
  },
  "description": "Workflow Service Runtime"
}
```

This destination represents the Workflow API, so let's have a look at
what we're requesting here:

- the specification of a URL when creating a new instance of a JSON
  model causes a GET request to be made to that URL

- Looking at the [Workflow API
  documentation](https://api.sap.com/shell/discover/contentpackage/SAPCPWorkflowAPIs/api/SAP_CP_Workflow),
  we see that a request to an endpoint like this:

    ```url
    /v1/task-instances/<instance ID>/context
    ```

  retrieves the context of a user task. Exactly what we're after!

At this point we have all the context data in our domain model ready to
bind to the controls in our task UI's view (which we'll look at next
time).

*Note: If you're wondering why we're not using the "improved"
reference "workflowservice" that we considered in [Discovering SCP
Workflow - Instance
Initiation](/blog/posts/2018/01/14/discovering-scp-workflow-instance-initiation/),
you can find out the reason in the next post.*

## Access to the inbox API

We're almost done. But there's something that follows the creation of
our context model that we need to examine, and that is the access to the
inbox API.

The thing is, the wonderful handoff from the host My Inbox app to the
recipient task UI app happens only when actually running in the My Inbox
context. When you're developing your task UI app and want to test the
UI out, you don't have that luxury.

This isn't ideal - the time it takes to save, deploy to SCP and re-test
in the context of the Portal service based Fiori Launchpad, to find that
I still had some UI tweaking to do, was too much. I wanted at least to
be able to test the UI part (the part surrounded by the red box in the
screenshot earlier) from the comfort of the testing harness available
with the SAP Web IDE.

### For real

So in the second half of the component's init function, there's a
condition that checks to see if the inboxAPI property is available
within the startupParameters retrieved from the component data.

If it is, we're going to assume that we're running for real inside the
context of My Inbox, and everything is normal:

- we grab the task description via the inbox API's getDescription
  function and save it in the app model we created just before (this
  is bound to a control in the main UI - we'll see that in the next
  post)
- we add an action button - in particular a "Continue" with the type
  "Accept", which, if pressed, calls some standard code that you've
  probably seen in the other posts mentioned earlier to complete the
  task by patching the task instance data via the Workflow API (I
  haven't yet bothered to modify this part from the sample apps in
  those posts)

If you're wondering why I set the type of the button to "Accept",
it's because I peeked into the inbox API documentation for the
addAction function, i.e. I looked at the source code, which of course as
we can now guess is in the controller for the S3 view in My Inbox:

![](/images/2018/01/Screenshot-2018-01-21-at-18.38.50.png)

Check out lines 2558 onwards - it's there you'll see how the type,
action and label properties are used. Basically here it results in the
"Continue" button being marked appropriately - in this case,
highlighted in green as you saw in earlier screenshots. It relates
directly to the [Button Type
enumeration](https://sapui5.hana.ondemand.com/#/api/sap.m.ButtonType) in
UI5, values in which are used for the type property of the classic
Button control in the sap.m library.

#### Testing only

When you're testing a task UI app directly, you're not, by definition,
within the context of the My Inbox app and therefore don't have access
to the inbox API. Hence the condition - if we don't have access to it,
we don't try to set the buttons on the host app. Simple.

But there's more. Testing directly also means there's no selected
workflow instance, or more accurately task instance, to work with.
What's a poor developer to do? Well, one thing you can do is fake the
context, by providing the task instance ID in the URL of your test
harness. Let's see that in action, taking a slight detour as a way of
revision on the Workflow API and Postman. You may want have to hand a
post from earlier on in this series for this: "[Discovering SCP
Workflow - Using
Postman](/blog/posts/2018/01/16/discovering-scp-workflow-using-postman/)".

I'm in the SAP Web IDE, and want to test my task UI. I actually have a
couple of workflow instances running (the ones you can see the tasks for
in the My Inbox screenshots). Let's pick the first one, relating to the
checkin for Subluminal.

Let's use Postman to see the workflow instances:

Request:

```text
GET {{workflowservice}}/v1/workflow-instances
```

Response:

```json
[
    {
        "id": "0cb89f49-fdc5-11e7-bb2a-00163e504470",
        "definitionId": "untappdrecommendation",
        "definitionVersion": "22",
        "subject": "Untappd Recommendation",
        "status": "RUNNING",
        "businessKey": "",
        "startedAt": "2018-01-20T09:34:02.193Z",
        "startedBy": "P481810",
        "completedAt": null
    },
    {
        "id": "08c963ad-fdc5-11e7-bb2a-00163e504470",
        "definitionId": "untappdrecommendation",
        "definitionVersion": "22",
        "subject": "Untappd Recommendation",
        "status": "RUNNING",
        "businessKey": "",
        "startedAt": "2018-01-20T09:33:55.590Z",
        "startedBy": "P481810",
        "completedAt": null
    }
]
```

There's some JavaScript in the Test panel for this request that takes
the value of the "id" property of the first instance returned, saving
it to the environment variable "instanceId":

```javascript
var data = JSON.parse(responseBody);
postman.setEnvironmentVariable("instanceId", data[0].id);
```

In this case, the value 0cb89f49-fdc5-11e7-bb2a-00163e504470 ends up in
there.

So we can now check the execution log for that first instance, all the
while assuming (hoping) that it's the one related to the Subliminal
checkin (if it's not, then it's the other one, no big deal):

Request:

```text
GET {{workflowservice}}/v1/workflow-instances/{{instanceId}}/execution-logs
```

Response:

```json
[
    {
        "id": "799",
        "type": "WORKFLOW_STARTED",
        "timestamp": "2018-01-20T09:34:02.292Z",
        "referenceInstanceId": "0cb89f49-fdc5-11e7-bb2a-00163e504470",
        "userId": "P481810"
    },
    {
        "id": "800",
        "type": "USERTASK_CREATED",
        "timestamp": "2018-01-20T09:34:02.447Z",
        "referenceInstanceId": "d6a6ef04-4519-4c89-b8d8-8306d0a37128",
        "activityId": "usertask1",
        "subject": "Recommended beers similar to Subluminal",
        "recipientUsers": [
            "P481810"
        ],
        "recipientGroups": [],
        "initiatorId": "P481810",
        "taskId": "0cdb90a1-fdc5-11e7-bb2a-00163e504470"
    }
]
```

From the value in the "subject" property, we can indeed see that it is
the one we're looking for.

But wait, we have something else in this response that's going to be
rather valuable to us too. In the "USERTASK_CREATED" execution log
item we can see the value of the task ID of the user task instance -
it's 0cdb90a1-fdc5-11e7-bb2a-00163e504470 (don't confuse this with the
workflow instance ID which starts 0cb8\...). Let's double check, with a
further call to another Workflow API endpoint to view the task instances
for a given workflow instance:

```text
GET {{workflowservice}}/v1/task-instances?workflowInstanceId={{instanceId}}
```

```json
[
    {
        "activityId": "usertask1",
        "claimedAt": null,
        "completedAt": null,
        "createdAt": "2018-01-20T09:34:02.420Z",
        "description": "You recently checked in Subluminal by Buxton Brewery. Here are some beer recommendations for your wishlist, based on this checkin.",
        "id": "0cdb90a1-fdc5-11e7-bb2a-00163e504470",
        "processor": null,
        "recipientUsers": [
            "P481810"
        ],
        "recipientGroups": [],
        "status": "READY",
        "subject": "Recommended beers similar to Subluminal",
        "workflowDefinitionId": "untappdrecommendation",
        "workflowInstanceId": "0cb89f49-fdc5-11e7-bb2a-00163e504470",
        "priority": "MEDIUM",
        "dueDate": null,
        "createdBy": "P481810"
    }
]
```

Yup, that's it, for sure. Note, as we're here, the description
property - that's the one we pick up the value for ("You recently
checked in Subliminal \...") in the init function earlier with the call
to startupParameters.inboxAPI.getDescription.

So we can be sure that the instance ID that we would normally receive
through the handoff from the My Inbox app to the task UI component
is 0cdb90a1-fdc5-11e7-bb2a-00163e504470, and that's the value (for
"taskId") that we need to complete the Workflow API endpoint URL
earlier when instantiating the context model:

```javascript
var contextModel = new sap.ui.model.json.JSONModel("/bpmworkflowruntime/rest/v1/task-instances/" + taskId + "/context");
```

How do we put this ID in the URL of our test harness? By extending the
runtime container for our task UI component (i.e. the index.html file)
and extending the SAP Web IDE run configuration to add a URL parameter.

First, the runtime container extension. In a normal, simple index.html,
you'd see the placing of a simple Component Container control inside a
Shell control. All we have to do is add some component data values for
the settings property in the Component Container instantiation thus:

```javascript
sap.ui.getCore().attachInit(function() {
    new sap.m.Shell({
        app: new sap.ui.core.ComponentContainer({
            height : "100%",
            name : "qmacro.UntappdRecommendationApproval",
            settings : {
                componentData : {
                    startupParameters : {
                        taskModel : new sap.ui.model.json.JSONModel({
                            InstanceID : jQuery.sap.getUriParameters().get("InstanceID")
                        })
                    }
                }
            }
        })
    }).placeAt("content");
});
```

Here, we're creating a simple JSON model and assigning it to the
taskModel startup parameter. In this JSON model we have a single
property, with the value being whatever is specified in the URL query
parameter "InstanceID".

Now the URL parameter - how do we specify the instance ID? By specifying
a URL Parameter in the appropriate run configuration:

![](/images/2018/01/Screenshot-2018-01-21-at-19.08.24.png)

When we run the task UI app in isolation, testing from within the Web
IDE, we get what we're looking for - the task UI, without the My Inbox
context. Definitely useful enough for building and testing the actual
UI:

![](/images/2018/01/Screenshot-2018-01-21-at-19.23.33.png)

So we've reached a good point to end this post upon. We now understand
what happens when the task UI component starts up, and where the data
and context comes from. We also know how to build and test a UI without
having to include a whole SCP deployment on every iteration.

In the next post we'll look at the actual task UI in a little more
detail.

Next post in this series: [Discovering SCP Workflow - Recommendation
UI](/blog/posts/2018/01/24/discovering-scp-workflow-recommendation-ui/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-members/discovering-scp-workflow-component-startup/ba-p/13362876)
