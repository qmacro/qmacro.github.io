---
layout: post
title: "SAP Cloud Application Programming Model (CAP) - start here"
date: 2018-10-10
tags:
  - sapcommunity
---
*Note: While this blog post was originally published in 2018, it's been
updated for 2020 and now also for 2021 thanks to great help and
input from the excellent Iwona Hahn. Take a few mins to have a fresh
look through, as you'll find that many items have been updated. And
don't forget to "[share &
enjoy](https://hitchhikers.fandom.com/wiki/Share_and_Enjoy)"!*

There's been a lot of activity and interest around CAP for SAP Business
Technology Platform (BTP), not least during the last couple of years of
SAP TechEd events, and also as it [coalesces into a fundamental
technology in the cloud development
stack](/blog/posts/2019/11/06/cap-is-important-because-it's-not-important/).
I thought it would be useful to provide an overview of the key
resources, for folks who are wondering how to get started.

Briefly, CAP for SAP BTP is a framework of tools, languages and
libraries, some from SAP, some open source. With these tools, languages
and libraries you can efficiently and rapidly build enterprise services
and applications in a full-stack development approach. It guides you
along a golden path of best practices, allowing you to focus on your
domain while relieving you from tedious technical tasks.

You can find core documentation for CAP in
[capire](https://cap.cloud.sap/docs/).

![](/images/2018/10/Screen-Shot-2020-07-01-at-09.27.28.png)

Begin with the [Getting
Started](https://cap.cloud.sap/docs/get-started/) section, as that will
take you through the basics as well as detailing some best practices and
reference material.

You can also find what's new in the new [Release
Notes](https://cap.cloud.sap/docs/releases/) section.

## SAP Developer Center

In the [SAP Developer Center](https://developers.sap.com/index.html),
there are missions, tutorial groups and tutorials.

In the beginner-level mission "[Take a Deep Dive into
OData](https://developers.sap.com/mission.scp-3-odata.html)" there's a
tutorial group "[Build Your First OData-based Backend
Service](https://developers.sap.com/group.scp-8-odata-service.html)"
which gives you a high level taster.

[![](/images/2018/10/Screen-Shot-2018-10-10-at-16.26.31.png)](https://developers.sap.com/mission.scp-3-odata.html)

If you're feeling more adventurous, or more hungry for knowledge and
insight, there are a couple of complete missions available too:

![](/images/2018/10/Screen-Shot-2020-07-01-at-09.29.24.png)

The mission [Build a Business Application Using CAP for
Node.js](https://developers.sap.com/mission.cp-starter-extensions-cap.html)
guides you through developing a business application using CAP. Start on
your local environment and deploy to the cloud.

If you're of the Java persuasion, there's a similar mission you may
like - [Build a Business Application Using CAP for
Java](https://developers.sap.com/mission.cap-java-app.html):

![](/images/2018/10/Screen-Shot-2020-07-01-at-09.30.29.png)

You can also find other tutorials [tagged with "SAP Cloud Application
Programming Model"](https://developers.sap.com/tutorial-navigator.html?tag=software-product-function:sap-cloud-application-programming-model) and you'll be presented with appropriately filtered content like this:

![](/images/2018/10/screenshot-2021-02-16-at-07.45.29.png)

## SAP Community

Here on the SAP Community you'll find an array of posts talking
directly or indirectly about CAP. You can find the complete set using
the tag:

[SAP Cloud Application Programming
Model](https://blogs.sap.com/tags/9f13aee1-834c-4105-8e43-ee442775e5ce/)

Daniel's post "[Introducing the new Application Programming
Model](https://blogs.sap.com/2018/06/05/introducing-the-new-application-programming-model-for-sap-cloud-platform/)"
is a great place to start.

![](/images/2018/10/overview.png)

There's also a dedicated topic page which you should definitely check
out: <https://community.sap.com/topics/cloud-application-programming> -
this has all sorts of links including a summary of the latest blog posts
and also the latest Q&A, which you can get to directly too via the [tag
specifically for CAP related questions and
answers](https://answers.sap.com/tags/9f13aee1-834c-4105-8e43-ee442775e5ce).

## SAP TechEd sessions

CAP has proved to have been a popular topic in the sessions and in the
corridors at SAP TechEd over the last couple of years.

## 2019

There was an array of sessions at SAP TechEd Barcelona - check out the
[Agenda
Builder](https://sessioncatalog.sapevents.com/go/agendabuilder.sessions/?l=221&locale=en_US) to
find out more.

Here are a couple of them:

-   CNA376 "Build Applications with the Programming Model on SAP Cloud
    Platform" - hands-on workshop (2hr)
-   CNA652 "Less Than One Hour to a SaaS Application with SAP Cloud
    Platform" -  CodeJam (mini-edition) (1hr)

The exercise material "spaceflight" for CNA376 is [on
GitHub](https://github.com/SAP/cloud-sample-spaceflight-node) for
both [Node](https://github.com/SAP/cloud-sample-spaceflight-node) and
[Java](https://github.com/SAP/cloud-sample-spaceflight-java).

If you're wanting a brief overview of CAP, you could watch this brief
(7min) interview between the wonderful Gregor Wolf and me, from SAP TechEd
2019 in Barcelona: [CAPM for Developers, Barcelona
2019](https://events.sap.com/teched/en/session/48917):

![](/images/2018/10/Screenshot-2020-03-25-at-07.05.37.png)

## 2020

There is a great session from Christian Georgi [SAP Cloud Application
Programming Model Evolution -- What's New
\[DEV103\]](https://events.sapteched.com/widget/sap/sapteched2020/Catalog/session/1602555751912001uqld)
which is a lecture session with all the news on both the Node.js and
Java runtimes.

## Tools

If you have a look at the exercises for CNA376 you'll see they're for
a Node.js (JavaScript) runtime. As well as tools and features for the
Application Programming Model being available in the SAP Web IDE
Full-Stack, there's also an extension for Visual Studio Code.

Read more about this **SAP CDS Language Support** extension in
Joerg Mann's post "[Introducing Core Data & Services (CDS) for VS
Code](https://blogs.sap.com/2018/10/09/introducing-core-data-services-cds-for-vs-code/)"
and grab it from the [Visual Studio
Marketplace](https://marketplace.visualstudio.com/items?itemName=SAPSE.vscode-cds#overview) -
find out more in the [tools
section](https://cap.cloud.sap/docs/get-started/tools#add-cds-editor) of
the CAP documentation.

There's also a short (12 minute) video which gives an overview of all
the great features of this extension: [An overview of the SAP CDS
Language Support extension for VS
Code](https://www.youtube.com/watch?v=eY7BTzch8w0)

What's more, there's CAP support in the new [SAP Business Application
Studio](https://blogs.sap.com/2020/02/27/sap-business-application-studio-is-generally-available/)
too!

![](/images/2018/10/screenshot-2021-02-16-at-07.43.30.png)

## Other media

On SAP's unofficial community podcast, [Coffee Corner
Radio](https://anchor.fm/sap-community-podcast/), there's a [16 minute
pod bite
(#5)](https://anchor.fm/sap-community-podcast/episodes/Pod-bite-5---DJ-Adams---interview-with-Rui-Nogueira-e1n1mu)
where I interview Rui Nogueira on the Application Programming Model.

On SAP CodeTalk, there's [a short interview with Ian Thain and me
talking about CAP at a high level](https://www.youtube.com/watch?v=GhEpcB7x4UA) (this video has been made private, I'm trying to rescue it).

On the SAP Mentors GitHub organisation there's a repo representing CAP
community activity - check it out at
[bit.ly/cap-com](https://bit.ly/cap-com).

If you like to learn by watching folks hack around on screen, and
perhaps also take part, then you probably want to check out the
[Hands-on SAP dev series](https://bit.ly/handsonsapdev) of live streams
which cover all sorts of SAP development topics including of course CAP.
Check out the recordings of past episodes here:
[bit.ly/handsonsapdev#replays](https://bit.ly/handsonsapdev#replays).

That's what comes to mind to me this evening - if there's anything
else (please let me know) I'll add it to this post as and when it
appears or occurs to me.

Happy hacking!

---

**Updates**

*11 Oct 2018 - added link to SAP CodeTalk interview; added link to Java
exercise materials for CNA376*

*21 Dec 2018 - replaced reference to the original user tag
[applicationprogrammingmodel](https://blogs.sap.com/tag/applicationprogrammingmodel/) with
the new tag [SAP Cloud Application Programming
Model](https://blogs.sap.com/tags/9f13aee1-834c-4105-8e43-ee442775e5ce/) (hat
tip to Mike Doyle for the
[reminder](https://blogs.sap.com/2018/10/10/application-programming-model-start-here/#comment-446336))*

*03 Jan 2019 - added info on finding tutorials by tag via a URL (hat tip
to A. Pfohlmann). Also added info on how to see what's new with the
Application Programming Model, via an answer in the Community Q&A
from another community member*

*25 Mar 2020 - major update with huge help from Iwona Hahn*

*28 Sep 2020 - new location for VS Code Extension*

*16 Feb 2021 - more great updates thanks again to Iwona Hahn*

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/sap-cloud-application-programming-model-cap-start-here/ba-p/13370128)
