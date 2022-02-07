---
layout: post
title: This Week in Fiori (2015-12)
tags:
- fiori
- fix
- frontend
- israel
- masteringsap
- saplabs
- ui5
---


![](http://scn.sap.com/community/image/2599/1.png?a=390268)

Greetings! Last week saw the return of the [This Week in Fiori](/category/twif/) series, with a video from me and [Brenton](https://callaghan001.wordpress.com). More on that video shortly. Before last week, the previous episode had been in October last year. So much has happened in the Fiori world that it would be crazy to try and cover it all. Instead, over the next week or two, I’ll pick out some items that stand out.

So let’s get started with some picks for this week.

**[Filtering Fiori Apps by Release](http://gregorbrett.blogspot.co.uk/2015/03/ive-just-watched-this-interesting-video.html) by Gregor Brett**
 In last week’s video, we looked at the Fiori Apps Library app and found that it wasn’t easy to identify the latest apps. I mentioned that while the Fiori Apps Library app itself didn’t expose the information in that way, the data was actually available, and [laid down a challenge](https://youtu.be/LanZx1W2yqI#t=18m10s) for anyone to make the app do just that.

![Screen Shot 2015-03-20 at 16.03.06]( {{ "/img/2015/03/Screen-Shot-2015-03-20-at-16.03.06-248x300.png" | url }})

Just a few days later the first response appeared – [Gregor Brett came up with a nice solution](http://gregorbrett.blogspot.co.uk/2015/03/ive-just-watched-this-interesting-video.html), which was to patch the running Fiori Apps Library app, adding a new View Settings Filter Item to the filterItems aggregation of the actual View Settings Dialog used in the app. The items within that new View Settings Filter Item were bound to a data collection that was already being exposed by the backend in the OData service, namely the Releases_EV collection, which gave information on Fiori Wave numbers and dates.

Bingo! Nice work Gregor.

 

**[The Fiori Community](http://scn.sap.com/community/fiori) by the SAP Community Network**
Since the last episode of TWIF last year in October, SAP have [created a new community](http://scn.sap.com/community/fiori/blog/2015/02/25/sap-fiori--the-new-community-space-in-scn) within the SAP Community Network for Fiori. There’s already a community for SAPUI5, but now there’s a specific community for Fiori. I spoke about this in my keynote at Mastering SAP Technologies last month, and it’s an interesting and important distinction that SAP are making.

If you think about it, Fiori as an umbrella term is gigantic. It could be seen as a lot of things to a lot of people. Separating out the technical underpinnings (UI5) from other aspects (Fiori application configuration, extension and maintenance, UX design, deployment and platform subjects, and more) was only going to be a matter of time, if only to make the subjects more manageable.

But also remember that future Fiori offerings from SAP may not be powered by UI5. Of course, all of the Fiori offerings now and in the near future are, including all the S/4HANA applications such as the SFIN set, but when you consider SAP’s purchases – Ariba, Concur and SuccessFactors to name but three – a unified UX strategy is not going to happen from re-engineering the whole UI/UX layer of those (previously) third party products.

Visit the new SAP Fiori community and have a look around. It looks like it’s here to stay :-)

**[Planning the Fiori ABAP Frontend Server (FES) – Architecture Questions](http://scn.sap.com/community/fiori/blog/2015/03/11/architectural-consideration-when-planning-the-fiori-abap-frontend-server-fes) by Jochen Saterdag**
Getting your Fiori apps served to the frontend involves making the following things available: the OData services, the Fiori Launchpad, the Fiori app code (views, controller logic, and so on) and of course the UI5 runtime. SAP has been slowly but surely socialising the term “frontend server” to refer to a system that fulfils this role. I first heard the term from SAP Labs folks in Israel back in 2013 (see “[An Amazing 36 Hours at SAP Labs Israel](http://scn.sap.com/people/dj.adams/blog/2013/10/03/an-amazing-36-hours-at-sap-labs-israel)“), and it’s becoming more pervasive these days. In modern parlance, perhaps, it’s now properly “become a thing”.

Of course, there are always considerations when planning such a server, and Jochen does a good job with this overview blog post. He answers some important questions, including whether you should use an existing PI system as the base for such a frontend server … the answer, clearly, is “no”.

**[10 tips to get you started on your Fiori development journey](http://www.bluefinsolutions.com/Blogs/DJ-Adams/March-2015/10-tips-to-get-you-started-on-your-Fiori-developme/) by me**
Well, what’s the point of having your own blog post series if you can’t talk about your own content now and again? ;-) As I mentioned earlier, I[ spoke at the great Mastering SAP Technologies Conference](/2015/02/16/speaking-at-mastering-sap-technologies/) in Feb this year. I wrote up my keynote into two blog posts, the second of which was a “top ten” style list. I’m sure there are many of you looking to embark upon this journey, so I thought I’d put together tips on what worked for me. If you’re interested in the first of the two posts, it’s “[Can I build a Fiori app? Yes you can!](http://www.bluefinsolutions.com/Blogs/DJ-Adams/March-2015/Can-I-build-a-Fiori-app-Yes-you-can!/)“.

Well that’s about it for this week. See you next time!


