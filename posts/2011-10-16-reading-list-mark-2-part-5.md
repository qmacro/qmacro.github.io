---
layout: post
title: Reading List Mark 2 - Part 5
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


This is Part 5, the last part in a series about an example app that I put together to demonstrate and describe the use of various Google Apps Script features. See [Part 1](/2011/10/08/reading-list-mark-2-part-1/) for an introduction. This part is "Putting it all together and using the OnOpen event to insert a new 2-item menu entry on the spreadsheet’s page".

**Parts Overview**

1. [Introduction to the app, and a short screencast showing the features](/2011/10/08/reading-list-mark-2-part-1/)
2. [Using the Tasks API to retrieve and insert tasklists, and the Ui Services to build the tasklist chooser component](/2011/10/10/reading-list-mark-2-part-2/)
3. [Using the UrlFetch Services to interact with the Google+ API and grab info on articles pointed to by users in their activity stream](/2011/10/14/reading-list-mark-2-part-3/)
4. [Synchronising the URL list in the spreadsheet with corresponding tasks in the chosen tasklist](/2011/10/15/reading-list-mark-2-part-4/)
5. [Putting it all together and using the OnOpen event to insert a new 2-item menu entry on the spreadsheet’s page](/2011/10/16/reading-list-mark-2-part-5/) <– you are here

**Putting it all together**

So at this stage we’ve done pretty much everything required for this example app. The final task is to extend the standard Spreadsheet menu to give the user access to the custom features of selecting a tasklist, and kicking off an update (URL pull and synchronisation). It’s very easy to extend the menu; in a few lines of code we’re going to end up with something like this:

![]( {{ "/img/2017/12/menu.png" | url }})

It’s as simple as this:

```
function onOpen() { 
  var ss = SpreadsheetApp.getActiveSpreadsheet(); 
  var menuEntries = [
    {name: "Update", functionName: "update"},
    {name: "Select Task List", functionName: "taskListUi"}
  ]; 
  ss.addMenu("Articles", menuEntries); 
}
```

We use the [addMenu](http://code.google.com/googleapps/appsscript/class_spreadsheet.html#addMenu)() method of the Spreadsheet class to create a new menu entry with an array of objects representing menu items. And the function name? onOpen() is one of a number of [built-in simple event handler functions](http://code.google.com/googleapps/appsscript/guide_events.html); this one runs automatically when a spreadsheet is opened – an ideal time to extend the menu.

**The complete script**

So we’re done with the final part! Let’s celebrate with the script in its entirety. And a beer. Cheers!

```
// -------------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------------
APIKEY = 'AIzaSyANY6ebMr2bi1Fzn-53kysp0y4LsbZA488';
ACTIVITYLISTURL = 'https://www.googleapis.com/plus/v1/people/{userId}/activities/{collection}';
READINGLISTCELL = 'C1';
USERIDCELL = 'D1'
USERID = '106413090159067280619'; // Mahemoff

// -------------------------------------------------------------------------
// update()
// Pulls in article links into sheet and synchronises with task list
// -------------------------------------------------------------------------
function update() {
  // First, check that we have a tasklist id already; it's stored in
  // the comment section of the 'readinglistcell'
  var sh = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var taskListId = sh.getRange(READINGLISTCELL).getComment();
  // If we don't have an id, tell the user to choose a tasklist
  if(taskListId === '') {
    SpreadsheetApp.getActiveSpreadsheet().toast(
      "Use Articles -> Select Task List to choose a task list",
      "No Task List", 
      5
    );
  // Otherwise, we know which task list to synchronise with, so
  // go and update the reading list with URLs from the Google+ activity
  // list, and then sync that with the task list items
  } else {
    retrieveActivityUrls_();
    synchronise_(taskListId); 
  }
}

// -------------------------------------------------------------------------
// taskListUi()
// Displays a Ui to allow the user to select a tasklist to manage
// the reading tasks. Can select an existing task list or create a new one
// -------------------------------------------------------------------------
function taskListUi() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var app = UiApp.createApplication();
  app.setTitle('Task Lists');

  // We'll have a grid and a button in this
  // vertical panel
  var panel = app.createVerticalPanel();

  // Use a listbox to display a choice of existing tasklists
  var lb = app.createListBox(false);
  lb.setName('existingList');
  var tasklists = getTasklists_();
  for (var tl in tasklists) {
    lb.addItem(tasklists[tl].getTitle());
  }  

  // Use the grid to layout the listbox, a textbox for a new list,
  // and some corresponding labels
  var grid = app.createGrid(2, 2);
  grid.setWidget(0,0, app.createLabel("Existing:"));
  grid.setWidget(0,1, lb);
  grid.setWidget(1,0, app.createLabel("Or new:"));
  grid.setWidget(1,1, app.createTextBox().setName('newList'));

  // The only button; handler will be linked to this button click event
  // Remember to add the grid contents to the callback context
  var button = app.createButton("Choose");  
  var chooseHandler = app.createServerClickHandler('handleChooseButton_');
  chooseHandler.addCallbackElement(grid);
  button.addClickHandler(chooseHandler);
  
  // Put it all together and show it
  panel.add(app.createLabel("Select existing or create new list"));
  panel.add(grid);
  panel.add(button);
  app.add(panel);
  doc.show(app);
}  

// -------------------------------------------------------------------------
// handleChooseButton_(e)
// Handler for 'Choose' button on taskListUi Ui; creates a new task list
// if a new one has been specified; grabs the ID of the chosen task list
// and stores the task list name and id in the TASKLISTCELL
// -------------------------------------------------------------------------
function handleChooseButton_(e) {
  
  // Assume an existing list was chosen
  var selectedList = e.parameter.existingList;

  // But check for a new list being specified; if it as, create
  // a new task list
  if(e.parameter.newList != '') {
    selectedList = e.parameter.newList;
    var newTaskList = Tasks.newTaskList().setTitle(selectedList);
    Tasks.Tasklists.insert(newTaskList);
  }

  // Grab the list of tasklists, because we'll need the id
  var taskLists = getTasklists_();
  var taskListId = -1;
  for(tl in taskLists){
    if(taskLists[tl].getTitle() === selectedList) { 
      taskListId = taskLists[tl].getId();
      break;
    }
  }

  // Record the list name and id
  var sh = SpreadsheetApp.getActiveSheet();
  var cell = sh.getRange(READINGLISTCELL);
  cell.setValue(selectedList);
  cell.setComment(taskListId);

  // Close the Ui popup and display the name of the chosen list
  var app = UiApp.getActiveApplication();
  app.close();
  SpreadsheetApp.getActiveSpreadsheet().toast(selectedList, "Selected List", 3);
  return app;
}

// -------------------------------------------------------------------------
// onOpen()
// Event-based function called when the spreadsheet is opened; adds items
// to the menu
// -------------------------------------------------------------------------
function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [ {name: "Select Task List", functionName: "taskListUi"},
                     {name: "Update", functionName: "update"} ];
  ss.addMenu("Articles", menuEntries);
}

// -------------------------------------------------------------------------
// getTasklists()
// Retrieve a list of the user's tasklists (uses the APIs Services)
// Note that the Tasks Services docu is not accurate here; we would
// expect to be able to use the TasklistsCollection class.
// -------------------------------------------------------------------------
function getTasklists_() {
  var tasklistsList = Tasks.Tasklists.list();
  return tasklistsList.getItems();
}

// -------------------------------------------------------------------------
// retrieveActivityUrls_()
// Use UrlFetch to retrieve a Google+ API resource: activities for a person
// Use Javascript data structures; restrict the number of API calls
// -------------------------------------------------------------------------
function retrieveActivityUrls_() {

  // Grab existing list of URLs
  var sh = SpreadsheetApp.getActiveSheet();
  var lastRow = sh.getLastRow();
  var urlList = sh.getRange(2, 1, lastRow - 1) .getValues();
  var list = {'old': {}, 'new': []};
  for (var i in urlList){
    list['old'][urlList[i]] = 1;
  }

  // Use the userid in the sheet, fallback to a favourite :)
  var userid = sh.getRange(USERIDCELL).getValue() || USERID;

  // Build Google+ API resource and retrieve it; parse JSON content
  var actListUrl = buildActivityListUrl_(userid, 'public', APIKEY);
  var jsonString = UrlFetchApp.fetch(actListUrl).getContentText()
  var activities = Utilities.jsonParse(jsonString);

  // We're looking for the item object attachments, where the 
  // attachment's objectType is 'article'. We want the url and displayName
  for (var i in activities.items) {
    var attachments = activities.items[i].object.attachments;
    for (var a in attachments) {
      var attachment = attachments[a];
      // We've got a URL and title; store it as new if it doesn't 
      // already exist. Store it as list of lists, ready for 
      // a setValues([][]) insert
      if (attachment.objectType == 'article') {
        if (! (attachment.url in list['old'])) {
          list['new'].push([attachment.url, attachment.displayName]);
        }
      }
    }    
  }

  // Blammo!
  if (list['new'].length) {
    sh.getRange(lastRow + 1, 1, list['new'].length, 2).setValues(list['new']);
  }

}


// -------------------------------------------------------------------------
// synchronise(taskListId)
// Synchronise the URLs in the spreadsheet with items in the chosen tasklist
// The task list item id for a URL is stored in the comment for that URL cell
// -------------------------------------------------------------------------
function synchronise_(taskListId) {

  // Grab list of all URLs, and associated comments
  var sh = SpreadsheetApp.getActiveSheet();
  var urlRange = sh.getRange(2, 1, sh.getLastRow() - 1, 1);
  var urls = urlRange.getValues();
  var comments = urlRange.getComments();
  
  // For each URL, check the status of the associated task.
  // If there isn't an associated task, create one.
  for (var i = 0, j = urls.length; i < j; i++) {
    if (comments[i] == "") {
      Logger.log("New task");
      var task = Tasks.newTask(); 
      task.setTitle(urls[i]);
      var newTask = Tasks.Tasks.insert(task, taskListId);
      sh.getRange(i + 2, 1).setComment(newTask.getId());
    } else {
      Logger.log("Existing task");
      var existingTask = Tasks.Tasks.get(taskListId, comments[i][0]);
      if (existingTask.getStatus() === "completed") {
        sh.getRange(i + 2, 1, 1, 2).setFontLine('line-through');
      }
    }
  }
}

// -------------------------------------------------------------------------
// buildActivityListUrl_(userId, collection, apiKey)
// Creates a specific resource address (URL) for the public activities
// for a given person in Google+
// See https://developers.google.com/+/api/latest/activities/list
// This will be obsolete when there are direct Google+ Services for 
// Apps Script
// -------------------------------------------------------------------------
function buildActivityListUrl_(userId, collection, apiKey) {

  var actListUrl = ACTIVITYLISTURL;
  actListUrl = actListUrl.replace(/{userId}/, userId);
  actListUrl = actListUrl.replace(/{collection}/, collection);
  actListUrl = actListUrl + '?key=' + apiKey;

  return actListUrl;
}    
```
