---
layout: post
title: Discovering SCP Workflow
tags:
- workflow
- scp
---

The SAP Cloud Platform Workflow service is a key component in the next generation of enterprise solutions - allowing us to coordinate processes and activities across cloud and on-premise systems. It's a relatively young service, and I thought it would be worth digging into it a little bit to learn more.

I've written a series of blog posts in [my space on the SAP Community](https://people.sap.com/dj.adams); here's a quick list of them for reference. While they're hopefully digestible individually, they sort of follow a logical sequence, so if you have the time and inclination, you might want to read them in order.

**Available posts**

1) [The Monitor](https://blogs.sap.com/2018/01/08/discovering-scp-workflow-the-monitor/) - notes on the workflow monitor app that is part of the SAP Cloud Platform Workflow service.

2) [Instance Initiation](https://blogs.sap.com/2018/01/14/discovering-scp-workflow-instance-initiation/) - an exploration of the part of the SCP Workflow API that deals with workflow instances, looking at how we initiate a new workflow instance, and paying particular attention to how we request, and then use, a cross site request forgery (XSRF) token.

3) [Using Postman](https://blogs.sap.com/2018/01/16/discovering-scp-workflow-using-postman/) - an explanation of how I use Postman to explore the Workflow API, making the most of some of Postman’s great features.

4) [Service Proxy](https://blogs.sap.com/2018/01/17/discovering-scp-workflow-service-proxy/) - the presentation of a small proxy service I wrote to handle the minutiae of initiating a new workflow instance.

5) [Workflow Definition](https://blogs.sap.com/2018/01/18/discovering-scp-workflow-workflow-definition/) - a look at the simple (beer recommendation) scenario I came up with to trial a workflow definition, and that workflow definition itself.

6) [User Tasks](https://blogs.sap.com/2018/01/20/discovering-scp-workflow-user-tasks/) - an examination of user tasks within the wider context of workflow definitions, along with task UIs and how they fit into the context of the My Inbox app.

7) [Component Startup](https://blogs.sap.com/2018/01/22/discovering-scp-workflow-component-startup/) - an investigation into how a task UI starts up, where it gets the right data to display, and how it interacts with the My Inbox "host" app.

8) [Recommendation UI](https://blogs.sap.com/2018/01/24/discovering-scp-workflow-recommendation-ui/) - a look at the specific task UI I wrote for the beer recommendation workflow.

9) [Script Tasks](https://blogs.sap.com/2018/01/26/discovering-scp-workflow-script-tasks/) - a look at what they are, and how you can use them to manipulate the context of a workflow from within a running instance.

10) [Service Tasks](https://blogs.sap.com/2018/01/29/discovering-scp-workflow-service-tasks/) - a brief excursion into calling other services from within a workflow, using the beer recommendation workflow scenario as an example. 