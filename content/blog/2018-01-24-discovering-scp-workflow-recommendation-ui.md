---
title: "Discovering SCP Workflow - Recommendation UI"
date: 2018-01-24
description: Looking at how the UI is put together.
tags:
  - btp
  - workflow
  - openui5
  - discovering-scp-workflow
  - sap-community
---

Previous post in this series: [Discovering SCP Workflow - Component
Startup](/blog/posts/2018/01/22/discovering-scp-workflow-component-startup/).

This post is part of a series, a guide to which can be found here:
[Discovering SCP
Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/).

We've seen the task UI many times now in previous posts. In this post
we'll take a quick look at how that was put together. There's nothing
particularly special about the UI5 app itself, save for the component
startup that we covered in the previous post. But it's worth covering,
if not just so you have another angle on creating apps to support user
tasks in My Inbox.

## Structure

The app has a standard structure, which came about as I created it using
the "Basic SAPUI5 Application Project" template in the SAP Web IDE.
This comes with settings that cause an automatic build (minification /
preload) which is useful.

It's a simple set of artifacts, much as one might expect from a UI that
is a single view, as we saw at the end of the last post:

![](/images/2018/01/Screenshot-2018-01-21-at-19.23.33.png)

The rest of the "chrome" ([lower-case
"C"](https://www.nngroup.com/articles/browser-and-gui-chrome/)) - the
master list of user task items, the footer bar with buttons, and so on -
comes from the My Inbox host app. All we have to do for this Untappd
Recommendation workflow user task is provide enough structure to present
the app in the form of a component (who doesn't do that anyway, these
days?) which does most of the important work, and a simple view and
controller.

So here's the project folder:

![](/images/2018/01/Screenshot-2018-01-23-at-07.48.06.png)

There are a few non-core artifacts here too - I have the "Show Hidden
Files" setting turned on, and there's the (unexpanded) dist folder
containing the files built for deployment.

## The artifacts

Let's look at the key artifacts one by one, examining the important
bits.

### manifest.json

There's nothing special in this file, except I guess for the important
reference to the Workflow runtime route, which sits alongside the SAPUI5
resources routes:

```json
{
  "welcomeFile": "/webapp/index.html",
  "routes": [
    {
      "path": "/resources",
      "target": {
        "type": "service",
        "name": "sapui5",
        "entryPath": "/resources"
      },
      "description": "SAPUI5 Resources"
    },
    {
      "path": "/test-resources",
      "target": {
        "type": "service",
        "name": "sapui5",
        "entryPath": "/test-resources"
      },
      "description": "SAPUI5 Test Resources"
    },
    {
      "path": "/bpmworkflowruntime",
      "target": {
        "type": "destination",
        "name": "bpmworkflowruntime",
        "entryPath": "/workflow-service"
      },
      "description": "Workflow REST API"
    }
  ],
  "sendWelcomeFileRedirect": true
}
```

That said, there's one thing worth pointing out here.

In [Discovering SCP Workflow - Instance
Initiation](/blog/posts/2018/01/14/discovering-scp-workflow-instance-initiation/),
I suggested an improved route name of "workflowservice", with an
entryPath of "/workflow-service/rest", rather than the more low-level
"bpmworkflowruntime" with its entryPath of simply
"/workflow-service". So why are we not using that improved
"workflowservice" route name here?

Consider the context in which the task UI is instantiated. It's as a
component, within a component container, inside an already running host
app (My Inbox). So the destination routing is controlled by the routes
defined in the host app's neo-app.json, not the task UI's
neo-app.json.

In other words, because the My Inbox app, known by its real name
"bpmmyinbox", has a route "bpmworkflowruntime" defined, and not
"workflowservice", we have to use that in our task UI app too.

Theoretically we don't actually need any destination route in the task
UI app's neo-app.json to point to the BPM workflow runtime. Except we
do - if we want to test the UI before deploying it! And in that case,
for consistency, we also need to use "bpmworkflowruntime".

### index.html

We actually examined the key parts of the standalone harness for our
task UI in the previous post [Discovering SCP Workflow - Component
Startup](/blog/posts/2018/01/22/discovering-scp-workflow-component-startup/).
There's nothing special in there at all beyond what came from the
template, except for the addition of the settings property in the
instantiation of the Component Container, to allow passing of a task
instance ID in the URL:

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

### Component.js

We've already seen the heart of the Component.js file in the previous
post - the init function. Here's the entire source:

```javascript
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "qmacro/UntappdRecommendationApproval/model/models"
], function(UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("qmacro.UntappdRecommendationApproval.Component", {

        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
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

        // Taken mostly straight out of the "Book Approval" tutorial for now
        _completeTask: function(taskId, approvalStatus) {
            var token = this._fetchToken();
            $.ajax({
                url: "/bpmworkflowruntime/rest/v1/task-instances/" + taskId,
                method: "PATCH",
                contentType: "application/json",
                async: false,
                data: JSON.stringify({
                    status: "COMPLETED",
                    context: this.getModel().getData()
                }),
                headers: {
                    "X-CSRF-Token": token
                }
            });
            this._refreshTask(taskId);
        }

        ,
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
        },

        _refreshTask: function(taskId) {
            this.getComponentData().startupParameters.inboxAPI.updateTask("NA", taskId);
        }



    });
});
```

The rest of it is pretty standard, plus we have the \_completeTask,
\_fetchToken and \_refreshTask functions that I lifted straight
from Christian Loos's post [Getting started with SAP Cloud Platform
Workflow -- How to build a simple approval
UI](https://blogs.sap.com/2017/11/06/getting-started-with-sap-cloud-platform-workflow-how-to-build-a-simple-approval-ui/).

### model/models.js

This is what the model module looks like:

```javascript
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function(JSONModel, Device) {
    "use strict";

    return {

        createDeviceModel: function() {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        createAppModel: function() {
            return new JSONModel({
                taskDescription: ""
            });
        }

    };
});
```

Nothing exciting there. We can see the createAppModel function that we
call from the component's init function to create the app model, with a
single property taskDescription, having an initial value of an empty
string. This is used in the view shortly, and the actual value is taken
from the description in the user task in the specific workflow instance,
via the call to startupParameters.inboxAPI.getDescription function (see
earlier).

The interesting thing about this description value is that it is
specific to the particular workflow underway, and can be built from
static strings and variable substitutions. But not in the context of UI5
\... it's actually in the workflow definition itself.

Take a look at the screenshot we saw in a previous post [Discovering SCP
Workflow - User
Tasks](/blog/posts/2018/01/20/discovering-scp-workflow-user-tasks/):

![](/images/2018/01/Screenshot-2018-01-18-at-09.46.58.png)

The Description field here ("You recently checked in \...") is the
source of what we're retrieving and storing against the taskDescription
property in our app model.

### i18n/i18n.properties

Let's take a quick look in here, so at least we have an idea of what
the text substitutions are when we look at the view shortly.

```text
title=Beer Recommendations
appTitle=UntappdRecommendationApproval

abv=% ABV
untappdBeerLink=https://untappd.com/beer/{0}

#XFLD:
rating=Rating

#XFLD:
totalCheckins=Total Checkins

beerAndBrewery={0} by {1}
beerDescription={1}% ABV Rating {2} {0}
```

### view/Main.view.xml

Now we get to possibly the most interesting part - how the task UI
itself is constructed. But we find there's actually almost nothing
special at all. It's a regular XML view, with a reference to a
controller (which we'll look at next), and a Page where we can display
the checked-in beer and the recommended beers:

```xml
<mvc:View
    controllerName="qmacro.UntappdRecommendationApproval.controller.Main"
    displayBlock="true"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.m">
    <App id="idAppControl">
        <pages>
            <Page
                binding="{/beer}"
                showHeader="false">
                <content>
                    <ObjectHeader
                        icon="{beer_label}"
                        title="{beer_name}"
                        number="{beer_abv}"
                        numberUnit="{i18n>abv}" >
                        <statuses>
                            <ObjectStatus
                                title="{i18n>rating}"
                                text="{rating_score}" />
                            <ObjectStatus
                                title="{i18n>totalCheckins}"
                                text="{stats/total_count}" />
                        </statuses>
                        <attributes>
                            <ObjectAttribute text="{brewery/brewery_name}" />
                            <ObjectAttribute text="{beer_style}" />
                            <ObjectAttribute
                                text="{
                                    parts : [
                                        'i18n>untappdBeerLink',
                                        'bid'
                                    ],
                                    formatter : 'jQuery.sap.formatMessage'
                                }"
                                active="true"
                                press="onLinkAttributePress" />
                        </attributes>
                    </ObjectHeader>
                    <Text
                        width="100%"
                        text="{app>/taskDescription}" />
                    <List
                        mode="MultiSelect"
                        items="{similar/items}">
                        <items>
                            <StandardListItem
                                selected="{_selected}"
                                icon="{beer/beer_label}"
                                title="{
                                    parts : [
                                        'i18n>beerAndBrewery',
                                        'beer/beer_name',
                                        'brewery/brewery_name'
                                    ],
                                    formatter : 'jQuery.sap.formatMessage'
                                }"
                                description="{
                                    parts : [
                                        'i18n>beerDescription',
                                        'beer/beer_style',
                                        'beer/beer_abv',
                                        'rating_score'
                                    ],
                                    formatter : 'jQuery.sap.formatMessage'
                                }" />
                        </items>
                    </List>
                </content>
            </Page>
        </pages>
    </App>
</mvc:View>
```

The entire Page control is bound to the root property "beer" in the
domain model (the workflow context), so all the other properties are
relative to this. It's going to be easier to read this view definition
if we have an idea of what this context looks like, i.e. what's in the
domain model, so take a look at the [Untappd API documentation for the
"beerinfo" resource](https://untappd.com/api/docs#beerinfo), because
at this point in the workflow, the context contains exactly that. And
you can see that the root property in the API documentation is indeed
"beer".

Let's take a quick look at the context for one of the existing workflow
instances I have:

Request:

```text
GET {{workflowservice}}/v1/workflow-instances/{{instanceId}}/context
```

Response:

```json
{
    "beer": {
        "bid": 1868220,
        "beer_name": "Subluminal",
        "beer_abv": 10,
        "stats": {
            "total_count": 6731,
            "monthly_count": 118
        },
        "brewery": {
            "brewery_name": "Buxton Brewery"
        },
        "auth_rating": 0,
        "wish_list": false,
        "media": {
            [...]
        },
        "checkins": {
            [...]
        },
        "similar": {
            "count": 5,
            "items": [
                {
                    "rating_score": 3.77814,
                    "beer": {
                        "bid": 1387819,
                        "beer_name": "Blueberry Maple Stout",
                        "beer_abv": 6,
                        "beer_label": "https://untappd.akamaized.net/site/beer_logos/beer-1387819_a53f2_sm.jpeg"
                    },
                    "brewery": {
                        "brewery_name": "Saugatuck Brewing Company"
                    }
                },
                {
                    "rating_score": 4.3603,
                    "beer": {
                        "bid": 2224760,
                        "beer_name": "Original Maple Truffle Ice Cream Waffle",
                        "beer_abv": 11.5,
                        "beer_label": "https://untappd.akamaized.net/site/beer_logos/beer-2224760_0a5e5_sm.jpeg"
                    },
                    "brewery": {
                        "brewery_name": "Omnipollo"
                    }
                },
                [...]
            ]
        }
    }
}
```

Let's pick out the parts in this view that are worthy of at least some
attention:

- the Page control's showHeader property is set to false, because the
  My Inbox app's detail view will already be setting up a header,
  highlighted in red here. If we were to have the task UI's Page
  header showing, it would be as shown in green here. Double trouble!
  If you look closely at the control tree hierarchy, you can see the
  Page within a Page. ("[Wheels within wheels, in a spiral
  array\...](https://open.spotify.com/track/65ZVM2RDxqnQHk4Xp9ebOG)"
  etc)![](/images/2018/01/Screenshot-2018-01-23-at-11.57.19.png)
- there's a handler for the press event of the active Object
  Attribute showing the link to the Untappd page for the checked-in
  beer. This handler, the function onLinkAttributePress, is actually
  the only function in the controller.
- the very useful built-in formatter facility jQuery.sap.formatMessage
  is used in a few places to merge static text with variables, defined
  in the i18n file.
- the List control's items aggregation is bound to the array of
  recommended beers, i.e. those that appear in the "similar"
  property in the beer info data we saw earlier.

And that's pretty much it!

Probably the most interesting, and most subtle aspect of this view
definition is the binding of the selected property in the Standard List
Item control template, to the property "\_selected" in the domain
model.

Rather than build a mechanism that explicitly and actively saves
selections, we can just take advantage of the default two-way binding of
JSON models, which will cause changes to the value(s) of this selected
property to be written to corresponding "\_selected" property values
in the array of similar items in the context data, effectively adding a
new property there to signify whether the user chose it or not. Thanks
UI5!

### controller/Main.controller.js

Pretty simple:

```javascript
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("qmacro.UntappdRecommendationApproval.controller.Main", {

        onLinkAttributePress : function(oEvent) {
            var sBeerId = oEvent.getSource().getModel().getProperty("/beer/bid"),
                sUrl = "https://untappd.com/beer/" + sBeerId;
            sap.m.URLHelper.redirect(sUrl, true);
        }

    });
});
```

It's just that handler we mentioned earlier, to open a new browser page
at the canonical destination for that beer on Untappd. For example, for
Subluminal, this is, via the shortcut
link <https://untappd.com/beer/1868220>,
here: <https://untappd.com/b/buxton-brewery-subluminal/1868220>.

## Review

All in all, the task UI app is a pretty straightforward affair. Of
course, this reflects the fact that the user task in this workflow
definition is straightforward too. But then we want to keep things
simple for the busy user, right?

Let's wrap this post up by thinking about what happens when the user
has "completed" the task. There's no handler in the controller which
would be what one would expect in a normal UI5 app. Rather, it's a
combination of a couple of things. Consider this stanza from within the
component's init function:

```javascript
startupParameters.inboxAPI.addAction({
    type: "Accept",
    label: "Continue"
}, function(button) {
    this._completeTask(taskId, true);
}, this);
```

The first thing is that we've defined an anonymous function to be
executed when the "Continue" button is pressed. That anonymous
function calls \_completeTask, which we know about.

The second thing is the context to which the function is bound - that's
the third parameter passed to the addAction call, i.e. the reference to
"this". It means that within \_completeTask, we have access to what
"this" is - the component, and everything associated with it,
including the domain model we previously set on it, the model which now
will contain any selections of beers recommended. Wonderful!

In the next post, we'll move away from user tasks and look at another
workflow task type - the script task.

Next post in this series: [Discovering SCP Workflow - Script
Tasks](/blog/posts/2018/01/26/discovering-scp-workflow-script-tasks/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-members/discovering-scp-workflow-recommendation-ui/ba-p/13365480)
