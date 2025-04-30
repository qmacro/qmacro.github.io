---
layout: post
title: "Double SAP CodeJam Athens - a report"
date: 2019-06-27
tags:
  - sapcommunity
---
*Last week I travelled to Athens to give not one but two SAP CodeJams.
It was exhausting but very rewarding. Read on to find out how it went.*

As you may already know, my colleagues Max Streifeneder and Marius Obert have been
running SAP CodeJams with me on the SAP Cloud Application Programming
Model (CAP) for the last few months, starting in Frankfurt, Germany,
moving through Wroclaw (Poland) and Utrecht (The Netherlands) in May,
and then Mechelen (Belgium) earlier this month.

Of course, I'm a big fan of CAP and we've been covering some CAP
topics on the [Hands-on SAP dev with
qmacro](https://bit.ly/handsonsapdev) series recently (the series is
[restarting](/tweets/qmacro/status/1144232097747525632) next
week too, hurray!). So it wasn't a surprise when a request came in for
an SAP CodeJam event on CAP in Athens, to be hosted at the SAP Hellas
offices there. What was surprising was that the request was a double
one - could I run a second SAP CodeJam on an SAP Cloud Platform topic?

Perhaps foolishly, I said "yes", and set to work putting together
content for a Workflow service focused SAP CodeJam event, to include
also the Connectivity service & destinations, the SAP Cloud Connector,
the API Business Hub, the SAP Web IDE and all kinds of hacking around
with Workflow APIs with the API Hub itself, with Postman, and of course
with [curl](https://curl.haxx.se). A highlight of the content creation
was taking inspiration from Nabi Zamani's Dockerfile recipe for running
the SAP Cloud Connector in a Docker container - this worked really well
and helped neutralise many of the vagaries of different workstation
operating systems by embracing a key cloud philosophy -
containerisation. Thanks Nabi!

![](/images/2019/06/Screen-Shot-2019-06-27-at-14.50.02.png)

For some odd reason I couldn't get a direct flight from Manchester to
Athens, so ended up going via Zurich and the journey took all day. I
rewarded myself with a quick visit to an excellent local craft brewery
"[Strange Brew](http://strangebrew.gr/)" for a [small
DIPA](https://untappd.com/user/qmacro/checkin/765027188) before the day
was out.

![](/images/2019/06/Screen-Shot-2019-06-27-at-14.58.03.png)

The next day, after a delicious breakfast with a rather nice view out of
the window, I set off from the hotel to walk the couple of kilometres to
the SAP Hellas offices.

![](/images/2019/06/Screen-Shot-2019-06-27-at-14.47.04.jpg)

I hadn't been prepared for how warm it was even in the early morning,
so stopped off to cool down at a local cafe half way there.

![](/images/2019/06/Screen-Shot-2019-06-27-at-14.48.56.png)

When I got to the office, I was greeted warmly by all the folks there
and the room was ready and waiting for us. There was plenty of coffee
and cakes waiting for us too.

Like all the other SAP CodeJams I've been involved with before, the
attendees were wonderful - friendly, open minded, relaxed and ready to
learn & share - exactly the right state of mind to be in to get the most
from events like these.

On Day 1 we ran through the new "SAP Cloud Platform - Workflow"
CodeJam content, and completed the series of 10 exercises. I think it's
fair to say that this went generally very well (we had an issue in the
morning when someone in the basement was standing on the Internet pipe,
or something like that, and access was very slow for a time), and we
covered a lot of ground, even managing to get in a little bit of routes
action in a neo-app.json descriptor file to test the reverse proxy
provided by the Connectivity service.

My favourite part was waiting to see who would use Postman and who would
use curl to make the API calls. It turned out that nearly everyone used
Postman, which is fair enough, as it's a great tool. Only one person
used curl, but his (excellent) choice in HTTP client tools was amplified
by a comment he left in the feedback, in the "any other remarks"
field, which was simply: *"curl 4 ever!"* That made my day!

On Day 2 we ran through the now-venerable "CAP - Node.js" CodeJam
content; Marius and I had revised some of it just a few days before, to
streamline some of the activities required to build the Multi Target
Archive (MTA) artifact and deploy it to the Cloud Foundry space on SAP
Cloud Platform - this worked well as we had fewer issues with getting
the build tools to install and execute correctly on the various Windows
platforms, upon which I will not comment further \... except to say that
I might wear [that tshirt](/images/2019/06/does-not-work-on-windows.jpg) next time 😉

Overall it was a great double SAP CodeJam event, and I want to thank
Mary Margeta, Spyros Sampakoulis and Dimitris Hagigeorgiou for being
excellent hosts and shepherds for the fledgling "Southern Europe"
group of SAP technicians and developers who attended!

![](/images/2019/06/Screen-Shot-2019-06-27-at-15.51.33.png)

Find out more about SAP CodeJam events here:
<https://www.sap.com/community/events/codejam.html>.

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/double-sap-codejam-athens-a-report/ba-p/13422986)
