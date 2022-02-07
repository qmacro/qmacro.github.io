---
layout: post
title: Google Cloud Functions + Sheets + Apps Script + Actions On Google = WIN
tags:
- appsscript
- conferences
- google
- actionsongoogle
- googleassistant
- apiai
- cloudnext
---

Sometimes, a perfect storm of technology comes along. I'd recently been teaching myself about [Google Cloud Functions](https://cloud.google.com/functions/), and had created a function to service our [Untappd](https://untappd.com/user/qmacro) beer searches in the #craftbeer channel for our organisation's Slack community. It replaced an ageing PHP script that I'd sellotaped together and had been hosting on my website. I now don't have to worry about hosting it, and it's a lot faster too. 

Roll on a few weeks and I start to hear about [Actions on Google](https://developers.google.com/actions/), [API.AI](https://api.ai/) and the [Google Assistant](https://assistant.google.com/) infrastructure. Cut to today, and I'm so enamoured with how the platform is panning out that I've already bought a Google Home device and I'm trying out my own test actions already[^n].

I'm a big fan of the Google Apps platform, [in particular Apps Script](/tag/appsscript/). The combination of server-side JavaScript with the rich access to the Apps platform and data makes it very easy to build and deliver very useful services. I put together the [SheetAsJSON](/2013/10/04/sheetasjson-google-spreadsheet-data-as-json/) service back in 2013 and I, along with others, still use it today. 

So it wasn't unusual for me to think of Apps and Apps Script as a natural set of tools in building out some Actions on Google functionality. I had watched the recording of the excellent session [Extending the Google Assistant with Actions on Google (Google Cloud Next '17)](https://www.youtube.com/watch?v=7e0RGIul8Kk) with Guillaume Laforge and Brad Abrams and thought that their example action - a conference helper to assist with discovering topics and sessions - was not only useful, but also ideal for taking my learning to the next level. I studied the content carefully and came up with my own version. Theirs was using an API endpoint that looked like this: `http://cloudnext.withgoogle.com/api/v1/...`, and is represented by the "Next" box in this slide (from the session):

![]( {{ "/img/2017/04/Screen-Shot-2017-04-30-at-09.09.26.png" | url }})

If I was to build my own version, I'd have to come up with a service of my own. This is where the Apps platform and Apps Script came in. First, conference session data lends itself to being marshalled into rows and columns, and at least for me, seeing data in front of me in a structured form really helps. So grabbing the data for a conference and putting it into a spreadsheet was the logical first step. But it only got better from there. 

Spreadsheets are about storing and managing data, but that data and management is dynamic. Having calculated values is a completely natural thing, and the spreadsheet model of values dependent on other values is powerful, especially when you want to manipulate the data, say, for testing and discovery purposes. Moreover, for developing the natural language that you want for your action's persona, it's a good way of setting up data circumstances that warrant a particular figure of speech or turn of phrase in the response you're building.

So I stored the conference data for my version of the helper in a Google spreadsheet, enhanced it with some calculated values, and then wrote some simple Apps Script to provide an API to that data set. So that combination became the equivalent to the "Next" box in the slide shown earlier. 

Here's a demo of my helper in action, including a look at the spreadsheet and how the data is surfaced in speech:

<iframe width="560" height="315" src="https://www.youtube.com/embed/98SNObLdZH8" frameborder="0" allowfullscreen></iframe>

If you're curious to see what the Apps Script based API produces, here's an example from the call to retrieve the topics (ie the one called to be able to fulfil the 'list-topics' intent):

![]( {{ "/img/2017/04/Screen-Shot-2017-04-30-at-16.49.44.png" | url }})

Note that the topics (Data Science, Security, Chrome OS and so on) are returned in a map, where the properties are the topics and the values are the lists of sessions for each of those topics. The data thus retrieved is stored in the relevant context, so that once the user has heard about the topics available and wants to explore the related sessions, the data is available immediately without a further call needed to the service API.

Anyway, I'll leave it there for now. The writing of this post was spurred on by [Eric Koleda](https://twitter.com/erickoleda) who [asked me to share a demo](https://twitter.com/qmacro/status/857992647763517441) - thanks for the prompting, Eric! 

If there's interest, there's a lot to talk about in future posts. Some topics that come to mind are:

- using speech adjunct functions for a more human and random approach to responses
- using other helper functions to properly enunciate lists and single / multiple values
- generating entity data in the spreadsheet and uploading to API.AI 
- using meta entities (!)
- managing contexts
- dealing with the fact that "in conversation, there are no errors"
- the structure of a typical fulfillment service
- balancing API calls and where things are computed
- the need (or not) to cause recalculations in the "unattended" spreadsheet
- testing approaches
- the development, testing and deployment workflow that I've put together, that works well for me




[^n]: One particularly irksome issue right now is that to get actions to work, I have to switch the Home device to US English, which just doesn't feel right ... and the locale-related changes that come with that switch mean that temperatures that are consequently given in Farenheit don't mean anything to me ;-)