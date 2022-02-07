---
layout: post
title: SAP Cloud Platform Pricing
---

I'm looking into the [pricing for SAP Cloud Platform services](https://cloudplatform.sap.com/pricing.html) and, well to be honest, not particularly liking what I see. 

Recently I've been pleasantly encouraged by new services such as Workflow and Business Rules becoming available on the (free) trial cloud platform, which is great. I get to learn about the features and try things out. Encouraged by what I find, even in these services' early days, I decide to inform myself of how much an organisation would have to pay for these services. 

So I follow the links and end up in the [SAP Cloud Platform Pricing & Packaging](https://cloudplatform.sap.com/pricing.html) area, which is a little bit too high level for what I'm looking for. Fortunately, I think, there's a link to a (PDF) [pricing document](https://cloudplatform.sap.com/content/dam/website/skywalker/en_us/PDFs/SAP_Cloud_Platform_Pricing_May2017.pdf) (the URL for this particular resource suggests a date of May 2017). 

(Update 11 Aug: SAP has removed that May 2017 PDF and replaced it with a new one with a resource name containing something that looks almost but not quite like a date, so I can't tell what it is: [SAP-Cloud-Platform-Pricing-82017](https://cloudplatform.sap.com/content/dam/website/skywalker/en_us/PDFs/SAP_Cloud_Platform_Pricing_82017.pdf))

(Update 31 Aug: Seems this new pricing PDF has disappeared, and also the link from the overview pricing page has been removed)

(Update 01 Sep: Another new pricing PDF appeared today! [SAP-CP-Pricing-September-2017](https://cloudplatform.sap.com/content/dam/website/skywalker/en_us/PDFs/SAP_CP_Pricing_September_2017.pdf))

Let's say I'm interested in putting together a small project using the Workflow service and also the Business Rules service, for a small department - about 25 users. I'm going to leave out any thoughts of storage and DB processing for now, and focus on the business services, but will want to deploy some integration scenarios to interface with my existing systems. 

Here are my observations when trying to figure out what it will cost.

The main pricing page is not much use, because it doesn't tell me whether the Workflow service and the Business Rules service are included in any of the packages. I do note, however, that the "for medium business" package versions are perhaps what I'm looking for, as they're "perfect for midsized businesses or departments". While looking at the costs for these medium business packages, I see that the "multiple application edition" is "now" €59 / user / month, not much more than the "single application edition" at €39 / user / month. Has there been a price drop? Let's see.

I start reading the pricing document PDF and see that instead of €59 / user / month, the "multiple application edition" is twice the price, at €118 / user / month. I guess (that's all I can do) that the "now" on the website does denote a price drop. Good. A 100% jump to go from one application to two is a little steep.

So what about the specifics? The high level info is OK, but I need detail. I jump to the "Table 1" which gives me some more info. The "Enterprise Package" (sic) pricing looks much more than I'd like to consider shelling out for my department (starting at €1,500/month, through to €15,000/month), so I stay with the "Medium Business Packages" and see that there's a minimum number of users (10). That's OK, I have 25. 

![]( {{ "/img/2017/08/Screen-Shot-2017-08-08-at-07.50.14.png" | url }})

In examining the first part of Table 1, I notice that it's only the "multiple application edition" that will allow me to partake of the Integration services. So I'm already forced to go down that route (even for a single application). Hmm. Even if I jump back into the Enterprise Package options, I can't take the €1,500/month route, I have to start with €4,000/month "professional edition" to get Integration.

As an aside, I had been very interested in the API Management service, but as it stands with pricing right now, the only option I have to use that service is to go for broke and shell out €15,000/month for the Enterprise Package "premium edition". No thanks. 

Time to turn my attention to the Workflow and Business Rules services, in which I'm mostly interested. I scroll down Table 1 and don't find them anywhere. All I see is "Add a-la-carte-Resources", so I jump further down the document to "A-la-carte Services" (sic) and find the Workflow service, thus: "Monthly Tiered Fee, Min. 100 users, €1.75-€3/user/month". Ouch. I have to pay monthly for 100 users, even though I have only 25? And what's the difference between €1.75 and €3? It doesn't say.

Let's look for the Business Rules service. It's pretty new on the scene, and ... yes, as I thought - pricing is lagging behind. No mention of this service at all in either the pricing overview page or in this detailed pricing document. Oh dear. 

To put the final nail in the coffin for this coffee time endeavour, I scroll back up, trying (in vain) to see if I've missed anything on the Business Rules service. No, I haven't (tho it's not GA yet). But what I do notice is that the a-la-carte options ... aren't even a possibility for customers going for per-user pricing: Neither of the Medium Business Packages offer the possibility of adding a-la-carte services. So I have to abandon my plans to go for a Medium Business Package route and consider the Enterprise Package route instead. That's crazy. 

The SAP Cloud Platform is growing, going from strength to strength. And we're growing with it, businesses and consultants alike. But SAP isn't doing themselves any favours, by not making it easy to commit to championing these platform services and including them in demos and proof of concept solutions. Without clear, transparent, simple and reasonable pricing, it seems as though SAP are leaning against the door that we're trying to lever open.


