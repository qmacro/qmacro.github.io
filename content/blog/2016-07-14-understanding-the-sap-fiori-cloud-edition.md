---
title: Understanding the SAP Fiori Cloud Edition
date: 2016-07-14
tags:
  - bluefinsolutions
---

The SAP Fiori Cloud Edition is upon us. What is it? How does it work, and what benefits does it bring? Find out answers to these questions, and more, in this overview of SAP's offering of Fiori in the cloud.

The SAP Fiori Cloud Edition is here. Actually, perhaps I should call it "SAP Fiori, cloud edition" or even "SAP Fiori, cloud service" - the name keeps changing, but thankfully the service is the same. 

It was made generally available (GA) at the end of the first quarter of this year, and is definitely something you should be looking at for your Fiori journey.

## What is it?

So first of all, what is it? Well, it is pretty much exactly what it says it is - it's Fiori, in the cloud. But to understand what that actually means, let's step back and look at Figure 1 - a simplified diagram of a typical on-premise architecture that includes Fiori in a traditional ABAP stack context.


![](/images/2016/07/on-prem-fiori.png)

_Figure 1: Simplified architecture for on-premise Fiori_

As we know, Fiori is many things, including SAP's strategic approach to User Experience (UX) across all products, a series of detailed design guidelines, and a collection of actual apps. To be able to install and make those apps available for users in your organisation, you need a number of components. One is SAP Gateway, providing the backend enablement for OData as well as the frontend exposure as consumable OData services. The other is the SAP UI Add-On for Netweaver, providing the infrastructure for Fiori - the Launchpad and related shell services, the UI5 runtime, and more.

In addition, the Fiori apps you choose to implement must be installed... and they're installed on the same server as the UI Add-On and the frontend Gateway components (there's a backend OData component to each Fiori app also, but we'll leave that for now).

The usual recommended approach is to have a "frontend server" containing the UI Add-On and the frontend Gateway components, and acting as a container to hold the Fiori apps themselves. If you've already installed a Gateway hub from pre-Fiori days, that's great and an ideal candidate for becoming such a frontend server.

But if you haven't, and want to get started with Fiori, then you'd normally need to install, configure and maintain a standard tiering (development, test & production) of ABAP stack systems to act as that frontend server. That comes with capital and expense costs as with any new SAP server install, not to mention the long term maintenance.

With SAP Fiori Cloud Edition, this requirement goes away. The services that would normally be provided by the frontend server are made available to you and your users, in the cloud - on the SAP HANA Cloud Platform, to be precise.

## How does it work?

Figure 2 shows the same Fiori context as we saw in Figure 1, but instead of the on-premise frontend server, the SAP Fiori Cloud Edition services are employed.

![](/images/2016/07/cloud-edition.png)

_Figure 2: SAP Fiori Cloud Edition removes the need for a frontend server._

The entire Fiori infrastructure, including the Launchpad, the UI5 runtime, and the Fiori apps themselves, are provided as part of this cloud service. 

Also included is the HANA Cloud Integration OData Provisioning service, known as "HCP, OData provisioning". This is what was previously known as Gateway as a Service (GWaaS). HCP, OData provisioning provides the equivalent services that the OData components on a frontend server would normally provide (the rightmost Gateway box in Figure 1, that is): Connect to the backend server to coordinate the calls to the OData enablement ABAP classes, and expose the results in an OData shape and colour. 

Finally, with SAP Cloud Identity (represented by the "Auth" box in Figure 2) connected to an on-premise identity provider (represented by the "IdP" box), you have everything you need to get going with Fiori, without the up front capital investment, server landscape extension, and continued maintenance. 

Moreover, you don't need to install or maintain the apps themselves, that's also done for you.

## What are the catches?

Well, there are no catches per se, but there are some important points of which to be aware. Going into any new SAP software offering without prior knowledge is never a good idea, so here goes:

Backend OData components are still required: The backend enablement components of any given Fiori app are still required, of course - to provide the frontend Fiori app logic with the data and functions from your backend systems of record. This is the leftmost "Gateway" box in both Figure 1 and Figure 2. If you're running on a 7.40 or above ABAP stack, you have these components anyway.

You'll need cloud connectivity: Obviously you'll need to connect your on-premise systems to the cloud. Fear not, this is the domain of the SAP HANA Cloud Connector (HCC, as shown in Figure 2). It's a small Java application that runs within your on-premise environment and connects outwards forming a secure tunnel to the HANA Cloud. You add whitelist entries to allow access from the SAP HANA Cloud Platform to resources in your on-premise landscape - those will be the Gateway endpoints in your backend systems. 

Not all apps are available yet: Each Fiori app that is made available in the SAP Fiori Cloud Edition offering undergoes a series of tests and checks, in a provisioning process that ends up with that app available for consumption within the context of the service. This means that not all apps are available right now - but there's a new filter option within the SAP Fiori Apps Library (see Figure 3) that will show you which ones are.

![](/images/2016/07/apps-filter.png)

_Figure 3: The "SAP Fiori apps on SAP HCP (SAP Fiori, cloud edition)" filter._

You may need to consider bandwidth: Your users connect to your on-premise network will be going out to the cloud to consume the Fiori apps. You may need to consider the bandwidth requirements for this, if you only have a minimal Internet connection. Then again, if you happen to already have a Gateway hub system on-premise, some of the traffic can be kept within the on-premise network to improve latency and save round trips to the cloud.

Is SAP Fiori Cloud Edition for you?
Of course, only you can decide that, it depends on a lot of factors. But there's certainly a compelling argument based on the benefits of service-based application consumption from the cloud, benefits which include reduced landscape complexity, maintenance and capital cost. SAP Fiori Cloud Edition has an associated subscription price, but when comparing to traditional on-premise related costs, it can make a lot of sense. 

To help make the decision, SAP offers a demo version of the Cloud Edition, where you can pretty much try out all the features, including app extensibility. It's definitely worth exploring, especially as there's no direct cost associated with that! 

One of the stumbling blocks we see with Fiori is the requirement for "yet more infrastructure". This is, for me, the biggest selling point for SAP Fiori Cloud Edition. Rather than have a project weighed down by the requirements to get a frontend server up and running and at the right patch levels for Fiori, UI5 and the apps themselves - and to maintain those components at the appropriate patch levels too - you can concentrate on the real task in hand, bringing the beauty and simplicity of Fiori, powered by that awesome toolkit UI5, to your business.

See you in the cloud!



---

[Originally published on the Bluefin Solutions website](http://web.archive.org/web/20180322133257/http://www.bluefinsolutions.com/insights/dj-adams/july-2016/understanding-the-sap-fiori-cloud-edition)
