---
layout: post
title: Reading List Mark 2 - Part 3
tags:
- appsscript
- google
- gtug
- madlab
- mangtug
- tasks
- ui
- urlfetch
---


This is Part 3 in a series about an example app that I put together to demonstrate and describe the use of various Google Apps Script features. See [Part 1](/2011/10/08/reading-list-mark-2-part-1/) for an introduction. This part is “**Using the UrlFetch Services to interact with the Google+ API (after all, it’s REST-based!) and grab info on articles pointed to by users in their activity stream**“.

**Parts Overview**

1. [Introduction to the app, and a short screencast showing the features](/2011/10/08/reading-list-mark-2-part-1/)
2. [Using the Tasks API to retrieve and insert tasklists, and the Ui Services to build the tasklist chooser component](/2011/10/10/reading-list-mark-2-part-2/)
3. [Using the UrlFetch Services to interact with the Google+ API and grab info on articles pointed to by users in their activity stream](/2011/10/14/reading-list-mark-2-part-3/) **<– You Are Here**
4. [Synchronising the URL list in the spreadsheet with corresponding tasks in the chosen tasklist](/2011/10/15/reading-list-mark-2-part-4/)
5. [Putting it all together and using the OnOpen event to insert a new 2-item menu entry on the spreadsheet’s page](/2011/10/16/reading-list-mark-2-part-5/)

**UrlFetch Services**

If you’ve ever used an HTTP client library in other contexts, you’ll be completely at home with the base classes available in the [UrlFetch Services](http://code.google.com/googleapps/appsscript/service_urlfetch.html). Following the [simplest thing that could possibly work](http://c2.com/xp/DoTheSimplestThingThatCouldPossiblyWork.html) philosophy, all we need to do to fetch a resource and grab the payload is to use the UrlFetchApp class, specifically the fetch() method. It returns an [HTTPResponse](http://code.google.com/googleapps/appsscript/class_httpresponse.html) object, which has everything you need: content, headers and response code.

Here’s an example of getting the signature from the server that serves this site:

var response = UrlFetchApp.fetch('http://www.pipetree.com/'); Logger.log(response.getHeaders()['Server']);

--> Apache/2.2.14 (Ubuntu)

The Google+ API largely follows a RESTful design, which means that we can use the UrlFetch Services to interact with it.

**The Google+ API**

The [Google+ API](https://developers.google.com/+/api/) is relatively new, and at the moment, read-only. This is fine for what we want to use it for in this example. There are two aspects of the API that are relevant for us:

- The REST-based nature means that we see the Google+ objects such as People, Activities and Comments as resources that we retrieve with HTTP
- To use the API we need either an OAuth 2.0 token or an API key

The UrlFetch Services provides us with a facility in the form of the OAuthConfig class for configuring and managing OAuth in a client context. But we’ll go for the simpler approach and use an API key, which we can obtain by using the Google API Console – see the previous instalment of this series for more details about this: [Using the Tasks API to retrieve and insert tasklists, and the Ui Services to build the tasklist chooser component](/2011/10/10/reading-list-mark-2-part-2/).

The idea for this example app is to capture a list of URLs that a person on Google+ has posted, and perhaps commented on. We can get this info from the [Activities](https://developers.google.com/+/api/latest/activities) part of the API.

To get the activity stream for a given person, we need to retrieve the following resource:

https://www.googleapis.com/plus/v1/people/{userId}/activities/{collection}

The {userId} is the Google+ ID of the person, and {collection} in this case is “public”, the only collection available right now. In addition we need to specify our API key on a ‘key’ parameter in the query string. The default representation is JSON. This is what we get back as a result (heavily elided for brevity):

{ "kind": "plus#activityFeed", "title": "Plus Public Activity Feed for Martin Hawksey", "id": "tag:google.com,2010:/plus/people/1146628[...]/activities/public", "items": [ { "kind": "plus#activity", "title": "Latest post from me. Elevator pitch: [...]", "id": "z12cxlppixzwjbqzi04cdnvg1wbyflbz3r00k", "url": "https://plus.google.com/1146628[...]", "verb": "post", "object": { "objectType": "note", "content": "Latest post from me. Elevator pitch: Service [...]", "originalContent": "", "url": "https://plus.google.com/1146628[...]", "attachments": [ { "objectType": "article", "displayName": "SpreadEmbed: Turning a Google Spreadsheet [...]", "url": "http://mashe.hawksey.info/2011/10/spreadembed/" }, { "objectType": "photo", "image": { "url": "http://images0-focus-opensocial.google[...]", "type": "image/jpeg" }, "fullImage": { "url": "http://mcdn.hawksey.info/content/images/[...]", "type": "image/jpeg", "height": 204, "width": 350 } [...]

Even after heavy eliding for this blog post, that’s still an awful lot of JSON, but we’re only actually interested in the URLs that the person links to. We can spot these in the “plus#activity” items array, as attachments with objectType “article” – they have url and displayName attributes:

{ "items": [ { "kind": "plus#activity", "object": { "attachments": [ { "objectType": "article", "displayName": "SpreadEmbed: Turning a Google Spreadsheet [...]", "url": "http://mashe.hawksey.info/2011/10/spreadembed/" }, [...]

**Partial Responses**

And it just so happens that in the interests of efficiency, Google offers [partial responses](https://developers.google.com/+/api/#partial-response), in the form of a fields parameter. So we can add this parameter to the query string, with an XPath-style value like this:

fields=items/object/attachments(url,displayName)

<span style="font-family: Georgia, 'Times New Roman', 'Bitstream Charter', Times, serif; font-size: 13px; line-height: 19px; white-space: normal;">So the resulting JSON representation is a lot lighter, like this:</span>

{ "items": [ { "object": { "attachments": [ { "displayName": "SpreadEmbed: Turning a Google Spreadsheet[...]", "url": "http://mashe.hawksey.info/2011/10/spreadembed/" } ] } }, ] }

Much better!

**Retrieving the Activity Data**

So now it’s time to have a look at the code that will retrieve the activity info and insert the URLs into the spreadsheet. We’ll do this in a single function retrieveActivityUrls_(), which will

- grab any existing URLs listed in the sheet, so we can work out whether each new one retrieved with the API call is already there or not
- Determine the ID of the person on Google+ we want to follow
- Build the name of the Google+ activity resource (the Google+ API URL), fetch it and parse the content
- Look through the parsed content and note any new URLs that the person has linked to on Google+
- Insert those new URLs into the sheet

Let’s go!

First, some constants.

APIKEY = 'AIza[...]drBs'; // (get your own!) ACTIVITYLISTURL = 'https://www.googleapis.com/plus/v1/people/{userId}/activities/{collection}'; USERIDCELL = 'B1'; USERID = '106413090159067280619'; // Fallback: Mahemoff!

Now for the function. We get a handle on the active sheet, note the last row (which denotes where the list of URLs currently ends), and gets those URLs. We’re assuming that the list starts at row 2, i.e. there’s a header line in row 1. The resulting urlList array is two dimensional, although as we’ve specified we only want 1 column width of values, the data will look something like this:

[[http://cloud9ide.com], [http://jsconf.eu], [...]]

We create an object to hold the existing (‘old’) URLs, and the eventual ‘new’ URLs about to be retrieved. We’re using an object ‘old’ for the existing URLs so we can easily check whether a new one is in the list or not. We just need to use an array for the ‘new’ URLs.

function retrieveActivityUrls_() { // Grab existing list of URLs var sh = SpreadsheetApp.getActiveSheet(); var lastRow = sh.getLastRow(); var urlList = sh.getRange(2, 1, lastRow - 1 || 1) .getValues(); var list = {'old': {}, 'new': []}; for (var i in urlList){ list['old'][urlList[i]] = 1; }

We’re going to retrieve the activity for a Google+ person, and the person is identified by an ID either in a cell in the sheet identified by the range in constant USERIDCELL, (see the screencast in [Part 1](/2011/10/08/reading-list-mark-2-part-1/)) or a default specified in constant USERID.

 // Use the userid in the sheet, fallback to a favourite var userid = sh.getRange(USERIDCELL).getValue() || USERID;

Now we have enough information to build the Google+ API resource URL, so we call a helper function buildActivityListUrl_() passing it the user ID, the collection (‘public’), and our API key. (We’ll look at buildActivityListUrl_() shortly.) We use the UrlFetchApp fetch() method to grab the resource, calling getContentText() to obtain the JSON content. And with a JSON parser available in the [Utilities Services](http://code.google.com/googleapps/appsscript/service_utilities.html), we quickly have all we need to retrieve those URLs posted in the activity list in the ‘activities’ object.

 // Build Google+ API resource and retrieve it; parse JSON content var actListUrl = buildActivityListUrl_(userid, 'public', APIKEY); var jsonString = UrlFetchApp.fetch(actListUrl).getContentText(); var activities = Utilities.jsonParse(jsonString);

From examining the JSON representation of the activities earlier in this post, we know we’ll be expecting items, and within each item an object member, and within that object member a number of attachments. We’re only interested in those attachments of type ‘article’, and if we find one, we want the url and the displayName.

If we’ve got an article attachment, we then need to determine whether it’s a new URL or one we have already. That’s where the list object comes in. Unless we can find the URL in the ‘old’ object, it’s a new one so we need to add it to the ‘new’ list.

 // We're looking for the item object attachments, where the // attachment's objectType is 'article'. We want the url and displayName for (var i in activities.items) { var attachments = activities.items[i].object.attachments; for (var a in attachments) { var attachment = attachments[a]; // We've got a URL and title; store it as new if it doesn't // already exist. Store it as list of lists, ready for // a setValues([][]) insert if (attachment.objectType == 'article') { if (! (attachment.url in list['old'])) { list['new'].push([attachment.url, attachment.displayName]); } } } }

At this stage, we’re ready to add any new URLs to the list in the sheet. Note that when we pushed onto the ‘new’ list, we pushed an array of the url and displayName. This is the ideal two dimensional array ([[a, b], [c, d], [...]) to specify as the value in the [setValues()](http://code.google.com/googleapps/appsscript/class_range.html#setValues) call on a two dimensional cell Range. And useful if we want to follow the sage advice in “[Common Programming Tasks](http://code.google.com/googleapps/appsscript/guide_common_tasks.html)” on using batch operations where possible: we can add all the new URL info to the sheet in a single getRange() and setValues() call pair:

 // Blammo! if (list['new'].length) { sh.getRange(lastRow + 1, 1, list['new'].length, 2).setValues(list['new']); } }

Now that’s the retrieveActivityUrls_()  function out of the way, let’s just have a look at the helper function buildActivityListUrl_() that we called earlier. It takes three parameters: the ID of the person on Google+, the collection we want to retrieve (‘public’ in this case), and the API key. It uses a URL template in the ACTIVITYLISTURL constant and replaces the placeholders. It also adds the API key, and the XPath fields statement.

function buildActivityListUrl_(userId, collection, apiKey) { var actListUrl = ACTIVITYLISTURL; actListUrl = actListUrl.replace(/{userId}/, userId); actListUrl = actListUrl.replace(/{collection}/, collection); actListUrl += '?key=' + apiKey; actListUrl += '&fields=items/object/attachments(url,displayName)'; return actListUrl; }

That brings us to the end of this part in the series. At this stage we have covered the tasklist determination using a user interface and pulled the URLs posted on a Google+ activity stream, storing them in the sheet.

In the next part, we’ll look at synchronising the URLs in the sheet with tasks on the chosen tasklist.

Stay tuned!


