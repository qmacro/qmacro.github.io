---
layout: post
title: Automated email-to-task mechanism with Google Apps Script
tags:
- apis
- appsscript
- google
- gtug
- mangtug
- tasks
---


[Last night at the Manchester Google Technology User Group (GTUG) meetup](http://madlab.org.uk/content/manchester-google-technology-user-group-13/) we looked in detail at an [example script](https://plus.google.com/110526626182299357893/posts/CetQyVtLKy8) that used various Google Apps Script services. More on that another time.

At the end of the meetup, I suggested an example of something that would be really easy to put together using Google Apps Script, and very useful: a mechanism to convert incoming emails automatically into tasks.

You can of course convert an email into a task *manually* using the Gmail UI like this:
![Manually adding a task from an email]( {{ "/img/2017/05/AddToTasks1.jpg" | url }})

But rather than have to open Gmail, find the task email, select it and then choose More Actions -> Add to Tasks, I wanted a hands-off facility where I could, say from my work email, fire off a quick one-liner task that would be added to my list of tasks automatically, silently and without fuss.

With effective use of Gmail’s filter facility, labels and a little bit of Apps Script using the Gmail Services, I was able to create a mechanism in the time it took to enjoy my morning coffee.

 

**Building the Automated Email-to-Task Mechanism**

Here’s how I saw it working:

1. create a couple of new labels: ‘newtask’ and ‘newtaskdone’
2. specify a Gmail filter to assign the label ‘newtask’ to emails coming from my work email address, and with the recipient being ‘qmacro+task@gmail.com’
3. write a script to process messages in threads assigned to the ‘newtask’ label by parsing the subject out, creating a new task, and inserting that task into my tasklist
4. schedule this script to run hourly

Then I could fire off an email to qmacro+task@gmail.com from work, with the task 1-liner in the Subject, and have that task automatically show up on my task list. Ideal!

 

**The Filter**

Once you have the labels, create the filter. This is what the action part of my filter looks like:

![Specifying the filter actions]( {{ "/img/2017/05/CreateAFilter.jpg" | url }})

I’m specifying that the email be assigned to the label ‘newtask’, that it should marked as read immediately, and not appear in the inbox. That way, I don’t get distracted by the noise of task emails in my inbox. If you’re wondering about the ‘newtaskdone’ label, we’ll get to that in a minute.

 

**The Script Context**

Now we’re all set up – we can write the script to process the relevant emails, i.e. all those assigned the label ‘newtask’.

Start by creating a new Spreadsheet  – the script can live attached to that. Add the text ‘Processed tasks’ to cell A1. We’ll use this to show how many tasks the script has processed. Use the menu option Tools -> Script editor to get to the Google Apps Script editor.

![Mail Management sheet]( {{ "/img/2017/05/MailManagementSheet.jpg" | url }})

You can call your project ‘Mail Management’, or whatever you want:

![Mail Management script]( {{ "/img/2017/05/MailManagementScript-1.jpg" | url }})


**The Script Code**

Ok, let’s run through the script step by step.

We start with a few constants: the name of the tasklist into which we want our new tasks inserted, and the two labels.

```javascript
TASKLIST = "DJ's list";
LABEL_PENDING = "newtask";
LABEL_DONE = "newtaskdone";
```

Next we have a helper function `getTasklistId_` which uses the Tasks Services from the new [Google APIs Services](http://code.google.com/googleapps/appsscript/googleapisservices.html) in Apps Script. You’ll need to explicitly state you want to use the Google APIs Services from the File menu, which will lead you to a popup where you can switch on the Tasks API and use the [Google API Console](http://code.google.com/apis/console-help/) to create a project and generate an API key which you’ll need. All of this is described in ample detail in a great article “[Integrating with Google APIs – Creating a simple reading list](http://code.google.com/googleapps/appsscript/articles/google_apis_reading_list.html)“.

This `getTasklistId_` function returns a tasklist ID for a given tasklist name — in this case we’ll be asking for the ID of the tasklist called “DJ’s list”. It’s early days for the Tasks API and there are a few oddities: In theory we should be able to use the simple API call :

```javascript
Tasks.Tasklists.get(tasklistName)
```

but this is currently resulting in an error. So instead we’ll grab a list of all the tasklists, and iterate over them looking for our tasklist name. I’ve suffixed the name of this function, and others in this script, with an underscore; this prevents them from showing up in the dropdown list of runnable functions at the top of the editor.

```javascript
function getTasklistId_(tasklistName) {
  var tasklistsList = Tasks.Tasklists.list();
  var taskLists = tasklistsList.getItems();
  for (tl in taskLists) {
    var title = taskLists[tl].getTitle();
    if (title == tasklistName) {
      return taskLists[tl].getId();
    }
  }
}
```

Next we have another helper function `addTask_` which will create a new task, given a string, and add that new task to a tasklist, given a tasklist ID. Note the separation of concerns – a task is created independently of a tasklist, then inserted into that tasklist.

```javascript
function addTask_(title, tasklistId) {
  var newTask = Tasks.newTask().setTitle(title);
  Tasks.Tasks.insert(newTask, getTasklistId_(tasklistId));
}
```

We then come to the definition of `processPending_`, which does the bulk of the mechanism’s work. This function gets a handle on each of the two labels we mentioned earlier (labels in the [Gmail Services](http://code.google.com/googleapps/appsscript/service_gmail.html) are one of three main classes, along with threads and messages). The idea is that we will process ‘pending’ emails assigned to the ‘newtask’ label, and then switch the thread to the ‘newtaskdone’ label so it won’t get processed a second time. With a call to the getThreads() method of the pending label object, we get a list of threads. We’re assuming that there’s only one email in each thread (task emails are separate and different each time), and so we grab the subject from the first message in each thread to use as the 1-liner task title, and use the addTask_ helper function to insert a new task into the tasklist.

Once this is done we remove the ‘newtask’ label and assign the ‘newtaskdone’ label to the thread.

Finally, we increment the ‘Processed tasks’ counter in the sheet, for a quick indication of how many email-to-task conversions have taken place.

```javascript
function processPending_(sheet) {

  var label_pending = GmailApp.getUserLabelByName(LABEL_PENDING);
  var label_done = GmailApp.getUserLabelByName(LABEL_DONE);

  // The threads currently assigned to the 'pending' label
  var threads = label_pending.getThreads();

  // Process each one in turn, assuming there's only a single
  // message in each thread
  for (var t in threads) {
    var thread = threads[t];

    // Grab the task data
    var taskTitle = thread.getFirstMessageSubject();

    // Insert the task
    addTask_(taskTitle, TASKLIST);

    // Set to 'done' by exchanging labels
    thread.removeLabel(label_pending);
    thread.addLabel(label_done);
  }

  // Increment the processed tasks count
  var processedRange = sheet.getRange("B1");
  processedRange.setValue(processedRange.getValue() + threads.length)
}
```

This last function, `main_taskconverter`, is more a matter of personal style rather than necessity – it’s the main function that we will start the whole mechanism off with, and the function that we’ll specify in the trigger so this script will run on a regular basis. We get a reference to the active spreadsheet, set the first sheet to be the active one (it usually is anyway) and call the `processPending_` function.

```javascript
function main_taskconverter() {

  // Get the active spreadsheet and make sure the first
  // sheet is the active one
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.setActiveSheet(ss.getSheets()[0]);

  // Process the pending task emails
  processPending_(sh);
}
```

And that’s all there is to it!

 

**Scheduling Regular Execution**

We want this mechanism to run regularly in the background, so that it converts all incoming task emails to tasks without our intervention. So we’ll use a trigger – we can set up a [time-driven event trigger](http://code.google.com/googleapps/appsscript/guide_events.html) so that the script – via the main_taskconverter function, runs every hour.

![Current Project's Triggers]( {{ "/img/2017/05/CurrentProjectsTriggers.jpg" | url }})

With a coffee (and biscuit) down, I now have a very slick way of remembering things I have to do. Nice!

Here’s the script in its entirety, with comments.

<script src="https://gist.github.com/qmacro/821cdbd498fe772447165ad95a4cc470.js"></script>
