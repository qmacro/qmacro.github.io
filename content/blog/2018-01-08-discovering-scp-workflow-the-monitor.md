---
title: "Discovering SCP Workflow - The Monitor"
date: 2018-01-08
tags:
  - scp
  - workflow
  - sapcommunity
description: Notes on the workflow monitor app that is part of the SAP Cloud Platform Workflow service.
---

This post is part of a series, a guide to which can be found here:
[Discovering SCP
Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/).

Once you've enabled the Workflow service (follow Christian Loos' two-part
series [Getting Started with the Workflow service in the free trial
account](https://blogs.sap.com/2017/07/14/getting-started-with-the-workflow-service-in-the-free-trial-account-12/)
here if you haven't), you'll have access to the My Inbox app. There's also a
couple of tiles that actually lead to the same app - the monitor app - both
with the title "Monitor Workflows":

![](/images/2018/01/inbox_home.jpg)

The data model supporting SAP Cloud Platform Workflow service has a
concept of workflow definitions and workflow instances. If you guess at
what they are, you're probably going to be correct: It's very similar
to the relationship between classes and instances in object-oriented
programming. The workflow is described in a definition (the flow of
tasks from start to finish), and workflows are created and executed as
instances of those definitions.

## The "bpmworkflowmonitor" app

The monitor app, known more formally by its name "bpmworkflowmonitor",
allows you to look at and interact with both workflow definitions and
workflow instances. It does this in a rather lovely intertwined way,
which I aspire to emulate in future UI5 apps for the Fiori Launchpad.
Look at the Intent Navigation settings for each of the "Monitor
Workflow - Workflow Definitions" and "Monitor Workflow - Workflow
Instances" tiles; they are "bpmworkflowmonitor-DisplayDefinitions"
and "bpmworkflowmonitor-DisplayInstances" respectively.

![](/images/2018/01/Screenshot-2018-01-08-at-19.33.20.png)

Scroll a little bit further down in the App Configuration shown here and
you'll see that for both apps, the App Resource Details are the same:

```text
SAPUI5 Component: com.sap.bpm.monitorworkflow
HTML5 App Name: bpmworkflowmonitor
ComponentURL: /
```

While we're here, note that these apps are provided via subscription
(that's what the
"[download-from-cloud](https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/iconExplorer/webapp/index.html#/?tab=grid&search=cloud&icon=download-from-cloud)"
icon denotes), from an SAP-owned subaccount. It's like having a
pointer, or symbolic link, to something, instead of that thing itself.

This intertwining is evident in a few ways, notably the seamless jump
between a workflow instance and its definition, for example. When
viewing a workflow instance, the Definition ID
("untappdrecommendation") is shown as a link:

![](/images/2018/01/Screenshot-2018-01-08-at-19.39.54.png)

\... which, when clicked, leads to the workflow definition:

![](/images/2018/01/Screenshot-2018-01-08-at-19.40.09.png)

Furthermore, the "Show Instances" button at the bottom of the detail
for the workflow definition \...

![](/images/2018/01/Screenshot-2018-01-08-at-19.43.24.png)

leads back to the workflow instances for that definition, via a filter
on the master list as you can see in the earlier screenshot. Very nicely
done.

## Execution Logs

In the display of a workflow instance, there's an execution log
visible. A simple one might look like this:

![](/images/2018/01/Screenshot-2018-01-08-at-19.49.00.png)

This particular workflow definition is very simple, and this is
reflected in the log. In the definition there's a start, an end, and a
User Task, thus:

![](/images/2018/01/Screenshot-2018-01-08-at-19.51.33.png)

The "StartEvent1" is represented by the execution log item "P481810
started the workflow" and the User Task "Untappd Beer
Recommendations" is represented by the execution log item "Task \...
available". All well and good, but if you're like me, you would like
to see how the data model as presented by the [SAP Cloud Platform
Workflow
API](https://api.sap.com/shell/discover/contentpackage/SAPCPWorkflowAPIs/api/SAP_CP_Workflow) relates
to this in a little more detail.

The API exposes entities that are core to the Workflow service:

- Workflow Definitions
- Workflow Instances
- User Task Instances
- Messages

and a couple of utility endpoints:

- XSRF Handling
- Data Export

User Task instances are special, because they're involved in processing
beyond the confines of the workflow flow itself. User tasks appear in
the unified inbox (appearing as the My Inbox app in the Fiori Launchpad)
and can have custom UIs to present the workflow instance's context and
allow decisions or actions to be taken. User tasks also have recipients,
as can be seen in the screenshot above.

## Extending the Execution Log display

Seeing details from the API entities beyond the user-facing information is
helpful if you're on that journey of discovery. [Or so it seems to
me](https://www.clivebanks.co.uk/THHGTTG/THHGTTGradio12.htm#:~:text=To%20come%20all%20that%20way%20and%20leave%20all%20these%20things%20just%20for%20the%20privilege%20of%20singing%20songs%20to%20you%20would%20be%20very%20strange%20behaviour%20%2D%20or%20so%20it%20seems%20to%20me).
So I took the "bpmworkflowmonitor" app and created my own version, gently
extending that part of it that handles the display of the Execution Log to show
more information that's fetched from the API. After all, it's the Workflow API
that the monitor app uses at its core anyway!

There are no extension points available in the code base, but then
again, I don't think there was an expectation that fools like me would
want to meddle with it.

Perusing the "bpmworkflowmonitor" app codebase is educational and
worth spending a few coffee breaks doing. You'll come across the part
that handles the construction of the Execution Log display in the
InstancesDetail.view.xml view definition. There's an innocuous looking
Object Page Section that looks like this:

```xml
<uxap:ObjectPageSection id="executionLogSection" title="{i18n>INSTANCES_DETAIL_EXECUTION_LOG_HEADER}">
  <uxap:subSections>
  <uxap:ObjectPageSubSection>
  <uxap:blocks>
  <core:Fragment fragmentName="com.sap.bpm.monitorworkflow.view.fragments.ExecutionLog" type="XML"/>
  </uxap:blocks>
  </uxap:ObjectPageSubSection>
  </uxap:subSections>
</uxap:ObjectPageSection
```

This references a fragment that describes a Timeline control, where the
content aggregation (the time line items) is bound to the execution log
items for the particular workflow instance being displayed. The template
for this aggregation binding is, not unexpectedly, a Timeline Item
control, which offers the possibility of embedding a custom control for
display of whatever is appropriate for each given item.

And it's here that the "bpmworkflowmonitor" app sports a custom
control, in the form of the ExecutionLogItem.js file in the controls
directory:

![](/images/2018/01/Screenshot-2018-01-08-at-20.14.29.png)

Examining the code within this custom control, we come across the
setEventType function which determines what appears within this custom
control, and in turn, this appears in the bottom section of each of the
timeline items. It is this code that determines, for example, that the
"Recipients" and "Initiator" sections appeared at the bottom of the
User Task execution log item earlier.

The relevant code looks like this:

```javascript
...
} else if (sEventType === "USERTASK_CREATED") {
  var oContainer = new VBox();
  oContainer.addItem(this._createUserListControl());
  oContainer.addItem(this._createOptionalLabelWithText(I18n.getText("EXECUTION_LOG_INITIATOR_LABEL"), "{wfilog>initiatorId}"));
  this.setContent(oContainer);
}
...
```

What would be useful to me would be to see exactly what event type IDs
each of the execution log items had, and for User Task items, what the
task instance ID was (so I could go over to
[Postman](https://www.getpostman.com/) and dig into the details by
interacting with the Workflow API directly \... but that's a story for
another day, perhaps).

So I [extended](https://gitlab.com/qmacro/bpmworkflowmonitor) the
setEventType function to add this bit at the end:

```javascript
/**
 * Add label showing event type if we can. Following the VBox-as-container pattern here.
 * First, we'll create a VBox with a Label/Text showing the event type, optionally
 * adding anothe Label/Text combo to show the task ID if appropriate.
 * Then:
 * - if there's no content, we'll set that new VBox as the content
 * - if there's content but it's not a VBox, we'll set the new VBox as content,
 * adding the existing content to it
 * - otherwise it's a VBox so just add the new Label/Text to that
 */
var oTypeInfo = this._createOptionalLabelWithText(I18n.getText("EVENT_TYPE_LABEL"), "{wfilog>type}"),
  oTaskIdInfo = this._createOptionalLabelWithText(I18n.getText("TASK_ID_LABEL"), "{wfilog>taskId}"),
  oVBox = new VBox({ items : [ oTypeInfo ] }),
  oContentControl = this.getContent();
if (!oContentControl) {
  this.setContent(oVBox);
} else if (oContentControl.getMetadata().getName() === "sap.m.VBox") {
  oContentControl.addItem(oTypeInfo);
  oVBox = oContentControl;
} else {
  this.setContent(oVBox.addItem(oContentControl));
}
if (sEventType === "USERTASK_CREATED") {
  oVBox.addItem(oTaskIdInfo);
}
```


I also added a couple of i18n resources. You can see the changes properly here
in [this
commit](https://gitlab.com/qmacro/bpmworkflowmonitor/commit/64592ba1cf1d5cdbc44db9b77026835bd4a69c59),
specifically in the controls/ExecutionLogItem.js and i18n/i18n.properties
files.

Once I deployed my version to my SCP trial account, I registered it in
my Fiori Launchpad, making it available as a new app "Workflow
Monitor - Custom":

![](/images/2018/01/Screenshot-2018-01-08-at-20.25.56.png)

and it gives me what I was looking for - extra detail in the Execution
Log:

![](/images/2018/01/Screenshot-2018-01-08-at-20.27.58.png)

This data ties up exactly with what's available via the Workflow API
(retrieved via Postman):

![](/images/2018/01/Screenshot-2018-01-08-at-20.30.01.png)

With that, my journey of discovery related to the SAP Cloud Platform
Workflow service is a little bit clearer. Hopefully this might help you
on your journey too.

Next post in this series: [Discovering SCP Workflow -- Instance
Initiation](/blog/posts/2018/01/14/discovering-scp-workflow-instance-initiation/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-members/discovering-scp-workflow-the-monitor/ba-p/13386215)
