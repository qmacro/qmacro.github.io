---
title: SAP CodeJam on the btp CLI and APIs in Heilbronn
date: 2023-03-01
tags:
  - codejam
  - btp
  - heilbronn
---

The Developer Advocates are ramping up CodeJams this year. Following on from [my visit to Utrecht](/blog/posts/2023/02/11/sap-codejam-on-service-integration-with-cap-in-utrecht/) to deliver a CodeJam on service integration with CAP, I was in Heilbronn last week to deliver [another CodeJam](https://groups.community.sap.com/t5/sap-codejam/sap-codejam-btp-hands-on-with-the-btp-cli-and-apis-heilbronn-de/ev-p/130512), this time on the topic of the btp CLI and APIs. 

## The journey there

After a flight to Frankfurt and then a long and circuitous route to Heilbronn on the train, via Wiesbaden (!) and Mannheim (I think there were some engineering works going on) I set off from my hotel near Heilbronn station on the morning of the event, and crossed the Neckar river. 

![crossing the Neckar river](/images/2023/03/neckar.jpg)

I found the venue easily, mostly because there was some lovely signage showing us the way.

![poster on the door](/images/2023/03/poster-on-door.jpg)

I must start out by congratulating Marco Buescher, the host at Engineering ITS GmbH, for such great organisation. Just look at the setup that awaited us! 

![the setup at the host venue](/images/2023/03/setup.jpg)

## Getting started

The partipants arrived (some from afar, including Prague!) and we quickly got going with the CodeJam content, installing and tinkering with the btp CLI, and getting to know it by setting up the autocomplete feature and then exploring various resources on the SAP Business Technology Platform (SAP BTP). 

We then started digging into one of the btp CLI's killer features, the JSON output, and spent some time learning how to parse and manipulate that JSON properly. 

After that deep dive, I think it's fair to say that any fear of understanding the complexity of the output structures was dispelled; even a couple of participants who weren't primarily developers told me that their confidence in requesting, handling and using complex structured content like this had grown significantly. In addition, the trepidation folks felt about what SAP BTP was, and whether they would grok it, dissolved into the ether. 

That made me happy.

![the participants busy working away](/images/2023/03/working.jpg)

## Digging in

One of the cool things about the relationship between what we can do with the btp CLI, and with the platform's Core Services APIs, is that more often than not, the same mechanism is being used in the background. With that in mind, we transitioned smoothly from using the btp CLI on the command line, to gearing up to calling an API, and comparing the output.

The journey from a standing start to calling an API was done over the course of three exercises, and for that I make no apology. One of the great things about a CodeJam event is that as well as getting to know each other, the participants have the best chance of getting to know the subject at hand in a meaningful way; they have the time to move slowly over the surface area and dig in deep, building a solid understanding about the fundamental interconnectedness of all things (that's a nod to the fictional holistic detective Dirk Gently, by the way). 

There are a lot of moving parts to understand, from service instances and bindings, to authentication servers, OAuth 2.0 grant types, token requests, construction of authentication headers, and lots more. By the end of the third of these three exercises I could sense the participants flexing their newly formed muscles in this area, and it was a delight to see.

## Breaking for lunch

We broke for a wonderful Italian lunch (the host company has its world headquarters in Rome, Italy) and it was then revealed that it was Marco's birthday that day! 

![lunch](/images/2023/03/lunch.jpg)

## Continuing the learning and networking

After that we got going again on the remaining exercises, looking at automation and scripting. One of the things that everyone seemed to enjoy (as did the participants in Utrecht earlier in the month) was the flow; we all tacked an exercise, and then got together at the end of that exercise to discuss what we'd done, what we'd learned, and to talk about some of the (deliberately open-ended) questions that are at the end of each exercise. 

This way, no-one gets left behind, and the discussion and break between each exercise allows for a more permanent embedding of the knowledge in the brain.

We finished off the day with a couple of exercises where the participants created new resources in their SAP BTP subaccount, using the btp CLI, and then cleaned up using the corresponding API. On each API call we examined the verbose HTTP output carefully, learning how to interpret it, how to spot issues, and how to deal with errors. 

## Wrapping up

Overall, I think it's fair to say that we got a lot out of the day. The participants were great, coming with an open mind and a willingness to learn and be curious, which is all one can wish for.

Thanks again to [Engineering ITS GmbH](https://eng-its.de/) for hosting, to the participants for coming, to my lovely colleagues and helpers Dinah and Kevin, as well as a bonus visit from another colleague Marco H from a different team at SAP, and last but not least to Marco B for organising!

![All the attendees waving](/images/2023/03/waving.jpg)

---

For more on CodeJams, have a look at the long list of [upcoming CodeJam events](https://groups.community.sap.com/t5/sap-codejam/eb-p/codejam-events) and the [topics currently on offer](https://groups.community.sap.com/t5/sap-codejam-blog-posts/sap-codejam-topics/ba-p/221407). 
