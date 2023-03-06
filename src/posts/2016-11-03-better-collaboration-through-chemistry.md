---
layout: post
title: Better collaboration through chemistry
date: 
tags:
  - bluefinsolutions
---

Well actually it's not chemistry but I couldn't resist an oblique reference to a floppy disk album cover from 1996 (I'll leave you to work out to what I'm referring). I'm working alongside a client, helping them with their Fiori transformation. Stepping back for a second, I realise that how we're collaborating is rather effortless and delivers much more value because of the tools we're using and the approaches we're taking. Read on to find out what these are.

dj-Better-collaboration-through-chemistry-content.jpgCollaboration works best when you're in the same room, working together, and there's low friction between you and the tasks that you're trying to carry out. This is often not how it works in reality, however. Demands on time and location mean that you're often working together, but remotely. 

![](/images/2016/11/landscape.jpg)

Moreover, the tools you use often hinder rather than help along the processes you're trying to follow. 
With today's cloud-based offerings, an awareness of best practices and a good dose of common sense and organisation, this reality can be improved considerably. 

## Fiori transformation

In this case, the collaboration was centred around the client's Fiori transformation activities. Moving towards a user-centric view of business processes means embracing Fiori, as a philosophy and as a platform. The best way to make that successful is to find the appropriate balance between standard and custom, bringing about the right solution for each of those business process. Here, this meant adapting standard SAP Fiori apps and extending them to fit. It also meant extending the Fiori Launchpad itself with features that were essential to the client.

In turn, this implied using the right tools to extend and test Fiori apps, employing best practices, and embracing the developer workflow that teams outside the SAP developer ecosphere, especially those in the open source world, have enjoyed for a long time. Workflow that includes automatic code checking (also known as linting), distributed source code control, feature branch based development, and peer-to-peer code reviews. 

## A bird's eye view

Before diving in, let's circle around in the cool autumn air and examine the building blocks of the solution from above.

![solution](/images/2016/11/building-blocks.jpg)

(If you haven't guessed already, Workstation 1 represents a client team member and Workstation 2 represents a Bluefin team member.)

In the client's on-premise part of the landscape, we have the usual suspects - a backend ECC system fronted by what we used to call the Gateway system but which we refer to now as the Frontend server, as it contains the UI Add-On supplying the Fiori infrastructure too. In addition to that, we have the HANA Cloud Connector (HCC) connecting outwards to the HANA Cloud Platform to create a secure tunnel.

In the cloud, there's the HANA Cloud Platform (HCP) which provides (amongst many other services) the Web IDE, my number one tool of choice for Fiori implementations. There's some reverse proxy and routing magic that is represented by destination definitions too, allowing connections from services on HCP to be made to on-premise systems via the HCC. In the context of the Web IDE, there are two functions that these connections enable: Consumption of OData services, and access to the repository of Fiori app artifacts.

There are also non-SAP services we're using. The first is GitHub, as the master repository for our Fiori artifacts and the changes that we're making to them, and perhaps just as importantly as the place where we manage development tasks, organise work into feature branches and perform code reviews. Then there's the collaboration and communication tool that's taking the world by storm: Slack. It's like IRC for the 21st century, and is - dare I say it? - a game-changer. And finally Trello, where we coordinate the overall tasks at a higher level of granularity, including those not specific to development. The biggest benefit of Trello is the immediacy - from idea to onboarding the team to ideas capture in literally seconds.

## Developer workflow and the right tools

In a working session that takes place usually face to face, we plan the overall work items and record them in Trello, great board-style team collaboration in a software-as-a-service mould. The interface is simple - boards, with lists of cards that you can drag around, assign and decorate with other metadata. Once we've done this, it's often the last time the team will be together in person for days or weeks on end.

![Trello board](/images/2016/11/trello.jpg)

A lot of these cards in Trello are then translated into tasks in GitHub, stored on the private repository that represents the software artifacts of the project. These tasks are then assigned (sometimes self-assigned) and work is started upon them. Tasks represent either features or bug fixes; they're the same thing from a workflow perspective - a piece of development that needs doing, then reviewing, then being accepted into the collection of artifacts that will make their way eventually to test and production systems.

A feature branch is created in GitHub to contain that work and this branch is pulled into the Web IDE where we spend most of our working day. The integration that the Web IDE offers with git-based source code control systems is ideal (and as of this month it's got even better, with additional access to on-premise git repository systems). Work is done and tested locally in the test harnesses that the Web IDE offers, connecting to the on-premise frontend server to access the OData services upon which the Fiori apps rely.

All this time, communication is taking place in Slack in a private channel dedicated to the members of the extended team which includes both client and Bluefin folks. This Slack-based communication is enhanced by integrations with GitHub and Trello - events in these two systems (such as the opening or closing of a merge request) are posted into the conversation flow.

![Slack](/images/2016/11/slack.jpg)

Work continues in the Web IDE, using facilities such as linting (to catch style and syntax errors at design time) and the extension wizards which make adding extensions to SAP Fiori apps pretty straightforward.

Once a piece of work is ready, it's pushed back to GitHub where a request to merge code upstream is made. This triggers a code review process between the members of the team. A feature branch may also be pulled back into the local repository of another team member's Web IDE for them to be able to test out the changes while keeping their work intact and separate. We have our business analysts do this too (they have Web IDE accounts as well) - they can try out the changes directly on the HCP before we continue.

![GitHub](/images/2016/11/github.jpg)

Based on the code review itself, further code changes may be necessary to address issues highlighted but once they've been made and the review is done, the code is merged into the so-called "master" branch which will eventually make its way back to the on-premise frontend server to be deployed through the SAP system landscape in more traditional SAP methods.

The overarching mantra for code changes, feature branches and merge requests in this new world of feature branch based development is: "Master is always deployable", meaning that anything you merge into master must be tested and reviewed because it could be deployed to production at any time!

## Remote access

One great feature of the combination of the Web IDE and destinations defined in HCP is that the secure access allowed to specific on-premise SAP systems via the HCC is all one needs to partake in this collaboration. I use my own instance of the Web IDE, as do my client colleagues. And we do that from wherever we are. No VPN is required which means that the cloud philosophy and software-as-a-service thereupon is really working well for us. The security and connectivity is managed where it should be - not on my laptop, but in a secure location on SAP's servers.

## The future is here now

I've only scratched the surface of detail here. Perhaps you'll be intrigued enough to go and find out for yourself how services such as these can massively improve collaboration and productivity, and how a developer workflow that embraces today's approaches is the right way forward for the Fiori revolution. Maybe you'll investigate what modern communication tools like Slack can do for you and your partners. Hopefully you'll see that using the zero-install HCP-based Web IDE is the right direction for you and your Fiori initiatives.

If there's one thing you take away from this post, it should perhaps be this: the future is here now, and it's there for you to embrace. Go for it. 

---

[Originally published on the Bluefin Solutions website](http://web.archive.org/web/20180227042724/http://www.bluefinsolutions.com/insights/dj-adams/november-2016/better-collaboration-through-chemistry)
