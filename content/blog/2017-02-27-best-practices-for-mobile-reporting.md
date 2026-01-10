---
title: Best practices for mobile reporting
date: 2017-02-27
tags:
  - bluefinsolutions
  - mobile
description: To put together a mobile reporting solution, there's a lot to consider. In this post, we show you how to start off and remain on the right track to deliver a solution that really works for your users.
---

Best practices in any technical endeavour apply to each and every stage and
building a mobile reporting solution is no exception. Here, in Bluefin's
Mobility, User Experience and Development Centre of Excellence (MUD CoE for
short!) we find it useful to align our thinking with the flow mantra that SAP
have popularised: Discover, Design, Develop, Deliver. (There's also a fifth
"D", but you can read about that in another post: [Debugging SAP Fiori apps -
the fifth
"D"](/blog/posts/2017/01/12/debugging-sap-fiori-apps-the-fifth-d/).)

Here are some best practices for you to consider when contemplating a mobile
reporting solution, organised by the stages in that flow. Whether it's adopting
a pre-built solution or rolling your own, these principles will keep you on the
right track.

## Discover

If you're going to make big decisions, make them up front, in the Discover
phase. And if you're going to change your mind, it's least costly to do it at
this stage. You haven't committed yet and therefore have the ultimate luxuries
in decision making - the most time and the least pressure.

### 1. Ask the hard questions

Back in the late 1980's I was on an SAP system migration project (from R/2 to
R/3) and a business analyst friend related to me some of the results of the
"reporting requirements analysis" he'd carried out with the users. For one of
the reports that had been designated "must have", he had interviewed the report
recipient to find out more about what they did with it. The response: "I
receive the report". When questioned what they did after that, he got: "I put
it in the bin".

The Discover phase is where you should start asking the hard questions. In the
case of building a mobile reporting solution, those hard questions should be
designed to qualify the mobile approach in or out. There's no point in doing it
further down the line. Once the personas have been established, ask them: What
do they actually need to do? ("Look at the report while mobile" is not an
adequate response). Why do they need to do it on a mobile device? What
manipulations do they expect to be able to perform?

Some data visualisations work well on small form factors, some don't. What's
possible, and what you should attempt, are often two very different things.
Understand the reasons behind the requirements before moving on to Design.

### 2. Think "online first"

Building solutions that work effectively offline is hard. Don't let anyone tell
you differently. Yes, you can cache data on the client, but ensure you have
calculated the cost-benefit ratio. How old can you allow the data to be? How
much processing power does the client need to have to be able to perform
aggregations locally? Does building data manipulation into the client restrict
the choice of target device? Will you need to deliver and maintain separate
OS-native versions of your reporting solution, or will you be able to embrace
the Web-native philosophy and use the power of your backend systems into which
you've poured a ton of enterprise budget as well as ton of enterprise data?

Finding the right balance between realtime and stale data, and juxtaposing that
with the balance of client performance and flexibility is something you need to
achieve. Make sure you do it, and do it up front.

## Design

Discovery morphs eventually into design, which is equally as important. Once
you have the outline solution, you need to refine it so that not only will it
be useful, but deliverable too.

### 3. Encourage the solution's use

Leading a horse to water and making it drink are two separate things. So are
making a reporting solution available and getting the users to engage with the
data. Once you've identified the solution approach at a high level, you need to
design it to be as engaging as possible. It's time to mention User Experience
(UX), and in particular, to consider what aspects are required to make good UX
a reality in the case of a mobile reporting solution.

Time-to-Insight is a term I've just made up, but it expresses one of the key
aspects - and that is friction. Or, rather, the lack of it. How many clicks
through a User Interface (UI) do my users need to get to the data they want to
see, to find the insight that's waiting for them to discover?

Remove friction by implementing Single Sign On (SSO) and allowing them to
personalise their reporting preferences, either explicitly or implicitly (by
observing and learning from behaviour). Consider UI aspects beyond the actual
reporting presentation software itself. In the case of the Fiori Launchpad, for
example, there's a blurring of distinction for many when it comes to analytics
and
[dashboards](/blog/posts/2016/03/29/the-sap-fiori-launchpad-as-a-dashboard-for-my-running-kpis/) -
dynamic launch tiles can be enough for a user to satisfy some of their
insight needs. Additionally, consider notifications at the device level, which
serve to alert users to changes in data circumstances and nudge them towards
the solution.

### 4. Remain open to platform options

Your IT department's device hardware policy may very well be a constraint in
designing a mobile reporting solution, but in fact it's not as restrictive as
you might first think. Have an Apple iPad only policy, or a Galaxy Tablet only
policy? That doesn't mean the design of the solution needs to be iOS or Android
native. When it comes to mobile, there are three general platform options:
OS-native, Web-native and Hybrid. The general pros and cons of each have been
compared many times before and I won't re-hash that old chestnut here.

Let the requirements defined in the Discovery phase drive this part of Design.
If you have a choice, ask yourself first why you wouldn't start with
Web-native. The other two options only serve to restrict the target audience
for the second most valuable asset your company has (yes, I'm saying that the
most valuable assets are the people, in case you hadn't realised the extent of
how much old age has mellowed me).

Develop You've moved down from 50,000 feet in discovery, through 10,000 feet in
design, and now you're at ground level, ready to bring the solution to life.
Here are a couple of things you must consider if you want to make your mobile
reporting solution sing.

### 5. Work out where your data resides

The data that will power your reports has different aspects. Location: Where is
the source of truth? Stability: How often does it change? Size: How much of it
is there, and what are the aggregation requirements? Different parts of the
data set you're using will look different across these aspects.

This means that you can - and must - consider the best way to manage that data.
Can you preload and cache sets of values that don't change frequently? If so,
how much can you afford to store on the mobile device, and how do you make the
initial load painless? How much processing is required to present the data in a
way that's meaningful to the user? Do you push aggregation and calculations to
the server side, or rely on the device to process that locally? How does this
link with users' understanding of "works offline"?

The answers to these questions should inform how the solution is developed,
whether that's a solution based on standard tools, or a completely custom
approach.

### 6. Use adaptive techniques

As likely as not, the question of "what 'mobile' means" will have surfaced in
the Discovery or Design phase. If you've got to the Develop stage and it
hasn't, that's a big warning sign meaning you may want to consider iterating
back through those previous stages.

The mobile platform as a target for any application solution is naturally
unstable. New devices are coming out all the time, with different capabilities
and screen sizes. If you look carefully at the history of the SAP Fiori Design
documentation, you'll notice that one of the 5 key principles was quietly
changed, without so much as a browser alert message. "Responsive" became
"Adaptive", and signalled a subtle shift in the philosophy that drives how apps
should respond to being executed on different devices.

An adaptive approach should be a key consideration in how the user interface
(UI) is developed. A great example of how this can be achieved is by using the
facilities presented by SAP's UI5 toolkit. The support for mobile devices,
device detection, and dynamic view declarations go a long way towards helping
you create a solution that works not just on one device, but many, now and into
the future.

## Deliver

It's almost time to let your users loose on your solution. Before you do,
remember these two important points.

### 7. Learn from your users

This is where we can delight in the concept of "meta", so wonderfully
celebrated by that most mind-expanding of authors [Douglas
Hofstadter](https://www.explainxkcd.com/wiki/index.php/917:_Hofstadter).
Insight about insight is what this best practice is all about. Especially when
you turn that meta-insight into action. When delivering the reporting solution,
include a layer of usage analytics, so that you can learn about how your users
are actually using the solution. What are they selecting? How are they
navigating? What parts of the solution are they not using? What times of day
are more popular than others?

We've used Google Analytics, embedded in a Fiori context via a plugin
mechanism, to great effect. It doesn't have to be Google Analytics; it just
needs to tell you what you need to know to take action to improve the solution
over time.

### 8. Protect your data

If data is your second most valuable asset, you need to protect it. This means
finding the right balance between low-friction and security when it comes to
data access - not getting in the way of the right people, and totally getting
in the way of the wrong people. This is where the delivery of your solution
must coincide with the security policies that your organisation already has.

If you have an OS-native solution, or a Hybrid based solution, you can bind the
apps into the deployment and management mechanisms already in place for your
mobile devices. If you have a Fiori-based solution, you could consider adopting
the SAP Fiori Client, or a derivative thereof (with Kapsel), to participate at
this level. If you have a purely Web-native solution, then you can go the
Hybrid route or consider plugging in a timeout mechanism that will remove
cached data and navigate away from where the user was. This mechanism can be
bound into the overall reporting solution in a straightforward manner that is
pretty much independent of the actual solution implementation.

There's a lot to consider in any solution, but particularly, the combination of
UX, data that is to provide insights, mobility and devices that are somewhat
out of your control is a heady mixture that can cause headaches. As long as you
bear these best practices in mind, you know at least you're building in the
right direction.

As Buzz Lightyear might say if he were building a mobile reporting solution:
"To insight, and beyond!"

---

[Originally published on the Bluefin Solutions
website](https://web.archive.org/web/20191212103958/https://www.bluefinsolutions.com/insights/dj-adams/february-2017/best-practices-for-mobile-reporting)
