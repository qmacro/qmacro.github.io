---
layout: post
title: Reading List Mark 2 - Part 4
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


This is Part 4 in a series about an example app that I put together to demonstrate and describe the use of various Google Apps Script features. See [Part 1](/2011/10/08/reading-list-mark-2-part-1/) for an introduction. This part is “**Synchronising the URL list in the spreadsheet with corresponding tasks in the chosen tasklist**“.

**Parts Overview**

1. [Introduction to the app, and a short screencast showing the features](/2011/10/08/reading-list-mark-2-part-1/)
2. [Using the Tasks API to retrieve and insert tasklists, and the Ui Services to build the tasklist chooser component](/2011/10/10/reading-list-mark-2-part-2/)
3. [Using the UrlFetch Services to interact with the Google+ API and grab info on articles pointed to by users in their activity stream](/2011/10/14/reading-list-mark-2-part-3/)
4. [Synchronising the URL list in the spreadsheet with corresponding tasks in the chosen tasklist](/2011/10/15/reading-list-mark-2-part-4/)**<– You Are Here**
5. [Putting it all together and using the OnOpen event to insert a new 2-item menu entry on the spreadsheet’s page](/2011/10/16/reading-list-mark-2-part-5/)

**Putting this into context: the Update request**

We’ve covered a lot of ground in the previous three parts in this series. Now we’re at the stage where we have the functions for

- creating a Ui for choosing an existing / creating a new tasklist
- handling the button event on the Ui
- getting a list of tasklists
- retrieving URLs from a Google+ activity stream

So the one main piece of work outstanding is synchronising the retrieved URLs as tasks on the chosen tasklist.

If you watch the [screencast](http://www.youtube.com/watch?v=F08qS8ZmlZ0) shown in [Part 1](/2011/10/08/reading-list-mark-2-part-1/) you’ll see that the synchronisation is part of a more general ‘update’ request, that includes the fetching of new URLs from Google+ and synchronising them with the tasklist. So let’s have a look at the function that binds those two things together.

Here’s the update() function, which we’ll allow the user to call from a menu item (we’ll cover this in the next instalment).

READINGLISTCELL = 'D1'; function update() { // First, check that we have a tasklist id already; it's stored in // the comment section of the 'readinglistcell' var sh = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); var taskListId = sh.getRange(READINGLISTCELL).getComment(); // If we don't have an id, tell the user to choose a tasklist if(taskListId === '') { SpreadsheetApp.getActiveSpreadsheet().toast( "Use Articles -> Select Task List to choose a task list", "No Task List", 5 ); // Otherwise, we know which task list to synchronise with, so // go and update the reading list with URLs from the Google+ activity // list, and then sync that with the task list items } else { retrieveActivityUrls_(); synchronise_(taskListId); } }

This function grabs a reference to the active sheet, and pulls the comment from the cell that we’ve designated as where the reading list tasklist info is stored: READINGLISTCELL. The name is stored in the cell, and the ID is stored in the cell’s comment. If there isn’t an ID, then we’ll ask the user to choose a tasklist using the Ui we built in [Part 2](/2011/10/10/reading-list-mark-2-part-2/). The [Browser](http://code.google.com/googleapps/appsscript/class_browser.html) class in Google Apps Script’s [Base Services](http://code.google.com/googleapps/appsscript/service_base.html) gives us a nice dialog box that looks like this:

<div class="wp-caption alignnone" id="attachment_1198" style="width: 316px">![image]({{ "/img/2011/10/notamessage1.png" | url }})Message Box

</div>But there’s also a nice visual message feature that’s available in the [Spreadsheet Services](http://code.google.com/googleapps/appsscript/service_spreadsheet.html), specific to a spreadsheet: [toast()](http://code.google.com/googleapps/appsscript/class_spreadsheet.html#toast). Calling this causes a popup to appear in the lower right of the screen, which stays visible for a short while. This is what it looks like:

<div class="wp-caption alignnone" id="attachment_1177" style="width: 269px">![image]({{ "/img/2011/10/notasklist.png" | url }})Toast message

</div>Because the ‘toast’ name is so evocative, we’ll use it in our function to prompt the user to choose a tasklist.

If there’s already a tasklist chosen, then we go straight into retrieving the URLs (see [Part 3](/2011/10/14/reading-list-mark-2-part-3/)) and then call the synchronise_() function, passing the ID of the tasklist.

**Synchronising URLs and Tasks**

Ok, so what do we need to do to synchronise the URLs? It’s similar to the technique described in the great article “[Integrating with Google APIs – Creating a simple reading list](http://code.google.com/googleapps/appsscript/articles/google_apis_reading_list.html)“. There are a couple of differences: I’m not going to use the [UrlShortener Services](http://code.google.com/googleapps/appsscript/service_urlshortener.html), and I’m going to try and reduce the number of API calls by bulk-grabbing the cell data.

First, we get a range reference on the active sheet, which equates to the list of URLs already there. We get all of the URLs (urlRange.getValues()) and all of the corresponding comments (urlRange.getComments()).

function synchronise_(taskListId) { // Grab list of all URLs, and associated comments var sh = SpreadsheetApp.getActiveSheet(); var urlRange = sh.getRange(2, 1, sh.getLastRow() - 1, 1); var urls = urlRange.getValues(); var comments = urlRange.getComments();

We go through each of the URLs, and create a new task in the tasklist if there isn’t already something in the comment for that URL:

- instantiate a new task object: Tasks.newTask()
- add the title: task.setTitle()
- add the task to the tasklist: Tasks.Tasks.insert()
- insert the new task’s ID into the comment for the URL: setComment()

Otherwise we’ve already created a task for the URL, so we grab the task to get the status, and if it’s marked as completed, we format the URL and corresponding description (in the next column) to set strike-through text.

 // For each URL, check the status of the associated task. // If there isn't an associated task, create one. for (var i = 0, j = urls.length; i < j; i++) { if (comments[i] == "") { Logger.log("New task"); var task = Tasks.newTask(); task.setTitle(urls[i]); var newTask = Tasks.Tasks.insert(task, taskListId); sh.getRange(i + 2, 1).setComment(newTask.getId()); } else { Logger.log("Existing task"); var existingTask = Tasks.Tasks.get(taskListId, comments[i][0]); if (existingTask.getStatus() === "completed") { sh.getRange(i + 2, 1, 1, 2).setFontLine('line-through'); } } } }

That’s it. Stop by next time for the last part in this series, where we put everything together and insert a 2-item menu entry to tie it all together. Thanks for reading!

 


