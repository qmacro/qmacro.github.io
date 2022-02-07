---
layout: post
title: SCP Business Rules Roadmap - 5 Observations
---

I discovered the relatively new [Business Rules service](https://cloudplatform.sap.com/capabilities/integration/business-rules.html) on the SAP Cloud Platform (SCP) through recent SAP Community posts from Christian Loos, and from Murali Shanmugham. If you haven't read Murali's series "[Implementing a user self-registration scenario using Workflow and Business rules in SAP Cloud Platform](https://blogs.sap.com/2017/07/31/implementing-a-user-self-registration-scenario-using-workflow-and-business-rules-in-sap-cloud-platform-part-1/)", introducing and combining the Workflow and Business Rules services, you should do. 

**Roadmap available**

I started to dig in to the Business Rules services this month, and liked what I saw. But there were things that were missing, in my opinion, so I've been eagerly awaiting an update to the roadmap. And this week we got one - Business Rules has its own roadmap:

[SAP Product Roadmap - SAP Cloud Platform Business Rules](https://www.sap.com/documents/2017/08/2a8094b1-ce7c-0010-82c7-eda71af511fa.html) (dated 22 Aug 2017)

**Observations**

It's been updated to reflect the next few quarters. I read through it this morning, and have some observations on what I read, which I wanted to share:

1) While it may be early days (Business Rules only [went GA](https://twitter.com/qmacro/status/895623419403939840) recently), this diagram shows how important the service is in the grand scheme of things:

![]( {{ "/img/2017/08/Screen-Shot-2017-08-26-at-07.38.55.png" | url }})

SAP intends to establish a common Enterprise Rule Model, an abstraction for design time and runtime across the different platforms today (their SaaS offerings as well as classic ABAP stack based systems and S/4HANA). And the focus for this model is clearly on SCP.

2) Extracting business rules out of codebases seems like a novel idea, but it's what's been happening since even I started with SAP R/2 back in the 1980's. But then, and even over the last few decades, the rule sets - in this case table-based configuration - have still been coupled with the codebase in that the lifecycle has been governed by the IT processes that are designed (rightly so) to protect the core and are not particularly agile.

The Business Rules service is the next step in that not only are rule sets extracted, but also the execution, in the form of the runtime(s), and access to that execution, is available as a set of API-based services in the cloud. This does indeed lead to agility, business empowerment, legacy preservation and cost savings, as well as readability and reasonability.

3) SAP Leonardo needs a posse. Machine Learning and Internet of Things is all very well, but without a set of core services to *do something* with the intelligence and the data, we're not going to get very far. The Business Rules service seems an ideal candidate for mixing into the strategy here.

4) Deprecation is a fact of software life, and we see it here with the HANA based decision tables and rules framework (HRF), in favour of the (to-be) all-encompassing Business Rules service. It's a bold move, but the right one if we're to reach any sort of standardised business rule authoring, storage and processing across the wider SAP ecosystem. 

5) Still missing right now is some sort of transport mechanism. Right now, even though the product is GA, there's no way I can see to manage the design time artifacts and transport them through DEV/TST/PRD tiers. There's the ability to manage rules from an active/inactive perspective in the repository, but that's still only within one subaccount. I even looked at the network calls behind the scenes to see what would be needed to build a DIY rule set extractor. But it was pretty complex and I wanted to go out for a run, so I shelved that idea :-) 

So in Q3/2017 there are plans for a "REST API for SAP Enterprise Rule Model". I am interpreting that as what I'm looking for: to be able to manage the lifecycle and transport of artifacts across the landscape. Here's hoping! 

**Final thoughts**

When I first came across the Business Rules service, I did wonder in some respects what purpose an extracted form of logic processing would serve. But on reflection, it's clear. Along with managing workflow (lowercase "w"), managing decisions which belong in the business is a key cornerstone of any successful organisation. It's early days for the service, and along with the missing transport mechanisms the UI is still a work in progress, I think, but it's definitely good enough for now, and I'm keeping an eye on things for sure.
