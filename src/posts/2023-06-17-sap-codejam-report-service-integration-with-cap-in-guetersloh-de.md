---
layout: post
title: SAP CodeJam report - service integration with CAP in Guetersloh, DE
date: 2023-06-17
tags:
  - codejam
  - cap
  - guetersloh
---

I'm on the train back to Duesseldorf on an early Saturday morning, after another successful outing of our SAP CodeJam content that takes participants through the ins and outs of [service integration with CAP](https://github.com/SAP-samples/cap-service-integration-codejam/) (the SAP Cloud Application Programming Model). 

This time it was in Guetersloh, hosted by [Reply](https://www.reply.com/de) and the very friendly and helpful Raphael Witte. I arrived in the warm early morning after a short bus ride from the town centre - in fact the bus dropped me off right outside the offices!

![Arriving at the Reply offices](/images/2023/06/arriving-at-reply.jpg)

The setup was excellent. We had a breakout room plus two work rooms with plenty of power and Internet connectivity. The rather advanced TV / projector display mechanism almost had us foiled ... but after a while we figured it out, although at one point we were projecting onto the large display via a Teams meeting between me and Raphael, where I shared my screen and he relayed it to the display through his software-based connection to the display share device. Give me old fashioned direct HDMI cables plugged into the back any day of the week :-)

The participants were all eager to get started, and all had a great can-do attitude that we needed to work around some initial access challenges. In the end, in fact, every participant ended up going for the VS Code + dev container based working environment which worked brilliantly for everyone. This was also a great testament to the power and flexibility of dev containers, about which I have written in the past, in a three-part series [Boosting tutorial UX with dev containers](https://blogs.sap.com/2022/01/27/boosting-tutorial-ux-with-dev-containers-part-1-challenge-and-base-solution/). 

We worked through the exercises, learning together about extending existing services and schemas, external APIs from SAP S/4HANA Cloud, the SAP Business Accelerator Hub (formerly known as the SAP API Business Hub), and how to find and dig into APIs that are detailed there.

Then we set about importing an API definition into an existing project, learning along the way about internal and external mocking, various useful features of the CAP CLI (`cds`), and created a separate profile in the environment for a direct connection to the SAP Business Accelerator Hub's sandbox systems. 

Not only that, but we learned about the different levels of integration, and got a hands-on feel for the best ways to extend existing CDS service and entity definitions, as well as wrap imported external services with a reduced surface area.

All this brain work and conversation was boosted by a midday break for lunch, which was provided by Reply and was delicious, thank you!

![Lunchtime break outside](/images/2023/06/lunchtime-break.jpg)

All in all it was a very enjoyable day. All the participants worked hard, had some great questions which provoked interesting side discussions. This is a key part of SAP CodeJams - the conversations and collaborative learning.

Thanks again to Reply and to Raphael for hosting, and to everyone for showing up and taking part!

