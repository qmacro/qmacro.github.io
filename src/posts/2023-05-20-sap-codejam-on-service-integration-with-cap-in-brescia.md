---
layout: post
title: SAP CodeJam on Service Integration with CAP in Brescia
date: 2023-05-20
tags:
  - codejam
  - cap
  - brescia
---
The [SAP CodeJam programme](https://groups.community.sap.com/t5/sap-codejam/eb-p/codejam-events) continues apace. Yesterday I ran a CodeJam in Brescia, Italy, on the topic of service integration with CAP, the SAP Cloud Application Programming Model. Here's a quick overview, with plenty of pictures.

## Working on the content

This wasn't the first instance of a CodeJam on this topic; the inaugural outing of the content took place in Utrecht, NL in February (see [SAP CodeJam on Service Integration with CAP in Utrecht](/blog/posts/2023/02/11/sap-codejam-on-service-integration-with-cap-in-utrecht/)) so I was generally happy with how the content flowed. Nevertheless, I had been working on it recently, running up to this event:

![Commit frequency graph for the CodeJam repo](/images/2023/05/commits.png)

Looks like at least one of my Developer Advocate colleagues Antonio [has been putting work in on his CodeJam content this week](https://fedi.ajmaradiaga.com/@antonio/110395822934061159) too!

> If you want to find out more about the CodeJams that we offer, I recommend you read this post from Tom Jung: [So, You Want to Host a CodeJam! Everything you need to know](https://groups.community.sap.com/t5/sap-codejam-blog-posts/so-you-want-to-host-a-codejam-everything-you-need-to-know/ba-p/221415), which also links to the list of topics available right now. 

## Travelling to the venue

I started my journey to Brescia, specifically to the offices of [Regesta S.p.A.](https://www.regestaitalia.eu/), the kind and welcoming hosts for this particular CodeJam instance, on Thursday morning in Manchester. I started out with a bus from home to Manchester Piccadilly station, for a train [from Platform 13](https://hachyderm.io/@qmacro/110389088154110866) to the airport.

![On the platform at Manchester Piccadilly station](/images/2023/05/platform-transpennine.jpg)

After the flight, which was uneventful (even accounting for the usual experience at Manchester Airport), and a train from Malpenso airport, I reached the centre of Milan at the spectatular Milano Centrale station (you can see [more photos of the station in this toot](https://hachyderm.io/@qmacro/110391127955702939)):

![Milano Centrale station](/images/2023/05/milano-centrale.jpg)

After a quiet evening and a good coffee at breakfast, overlooking the station:

![Coffee overlooking the station](/images/2023/05/coffee-station.jpg)

I was ready to get the train from Milan to Brescia:

![Train from Milano to Trieste](/images/2023/05/train-milano-to-trieste.jpg)

There I was met at the station by Valentino, the CodeJam organiser at Regesta. We travelled through the morning rush hour to the office which was perfectly set up for a great learning experience, and we were all soon underway.

![Arrived at the offices](/images/2023/05/outside-regesta-offices.jpg)

## The learning experience

The day flew by. 

I can honestly say this was one of the most diligent groups of CodeJam attendees I've had the pleasure of working with. [Everyone got properly involved in the content](https://twitter.com/qmacro/status/1659467428093390849), asked great questions, worked with each other through each exercise, and made it easy for me to convey all the concepts and details. Thanks folks!

![the CodeJam attendees](/images/2023/05/codejam-attendees.jpg)

## Networking and getting to know each other

During lunch, provided by our kind hosts, we got a chance to chat more. 

![Some of the food on offer at the buffet lunch](/images/2023/05/buffet-lunch.jpg)

We also got another chance at the end of the day, where I learned from a Regesta developer about the awesome tools he's been working on - an NPM-like package experience for ABAP, compatible with and designed to complement [abapGit](https://abapgit.org/). Definitely worth keeping an eye out for in the near future!

## A brief overview of the CodeJam topic focus

Perhaps it's worth explaining at this point what this specific CodeJam focuses upon. 

Of course, you can get a general idea from the [About this CodeJam](https://github.com/SAP-samples/cap-service-integration-codejam#about-this-codejam) section of the repo's main README file, but perhaps you want to know more. 

In essence, we take a slow but sure, step by step approach to integrating an external service from the SAP Business Accelerator Hub (previously known as the SAP API Business Hub). In doing so, we take a route that introduces us to various CAP server features, cds commands, in-process and external mocking, initial data supply, and take a look at how to extend both services and entities. 

Moreover, on that route, we learn about the cds environment, profiles, port control, and custom vs built-in resolutions of OData operation responses. Ultimately we bind in a real remote external service and have it work in harmony with our own local service. 

Not only that, but we also dig deep into the philosophy and practicality of how, where and why we make changes and extensions in the places we do. Think of it as dipping into the essential topic of "keep the core clean" for CDS based services and mashups. 

And of course, all the way through, we work through deliberate errors that are there for us to learn from and have fun with. 

If this sounds like something you would like to experience, check out [Tom's post that I mentioned earlier](https://groups.community.sap.com/t5/sap-codejam-blog-posts/so-you-want-to-host-a-codejam-everything-you-need-to-know/ba-p/221415). 

## After the event

I headed back to Milan that same Friday evening to be closer to Malpensa airport for my flight, which is today (I'm writing this on Saturday). There I treated myself to a couple of excellent beers (a [hyper local IPA](https://untappd.com/user/qmacro/checkin/1275581325) and a [West Coast DIPA](https://untappd.com/user/qmacro/checkin/1275585970)) at a great place - [Bierfabrik Milano](https://goo.gl/maps/uJmZMWgriDsEyKAL8). 

I started writing this post at breakfast in the hotel this morning. 

![My Chrome OS tablet at the breakfast table](/images/2023/05/at-breakfast.png)

After another train journey back to the airport I'm finishing it off in the gate area while waiting for my flight back to Manchester, tired but happy at the conclusion of another successful CodeJam event!
