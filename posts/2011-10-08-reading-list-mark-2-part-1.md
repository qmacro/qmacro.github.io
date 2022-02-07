---
layout: post
title: Reading List Mark 2 - Part 1
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


Over on the Google Apps Scripts articles section of the Google Code site there’s a great article “[Integrating with Google APIs – Creating a simple reading list](http://code.google.com/googleapps/appsscript/articles/google_apis_reading_list.html)” which takes the reader through a nice example of using a couple of APIs that have recently been made available to Google Apps Script via the [Google APIs Services](http://code.google.com/googleapps/appsscript/googleapisservices.html) – the UrlShortener API and the Tasks API. Inspired by the article, I decided to take the idea a little bit further and build something I could demo and then explain at our [Manchester GTUG meetup](http://madlab.org.uk/content/manchester-google-technology-user-group-13/).

I used the same idea of a reading list, but added a Ui component to allow the user to select a task list interactively, and instead of using the UrlShortener API, I explored the relatively young [Google+ API](https://developers.google.com/+/api/), in that I pulled in articles to read automatically from URLs posted by people on Google+.

Also, in revisiting some of the original reading list features, I tried to approach the coding differently, to be mindful of the advice in the “Optimising Scripts for Better Performance” section of the “[Common Programming Tasks](http://code.google.com/googleapps/appsscript/guide_common_tasks.html)” guidelines.

Here’s a short screencast that shows the ‘Reading List Mark 2′ in action:

 <iframe allowfullscreen="" frameborder="0" height="315" src="http://www.youtube.com/embed/F08qS8ZmlZ0" width="420"></iframe>

I’ll describe how everything is put together over the next few blog posts:

1. This introduction
2. [Using the Tasks API to retrieve and insert tasklists, and the Ui Services to build the tasklist chooser component](/2011/10/10/reading-list-mark-2-part-2/)
3. [Using the UrlFetch Setvices to interact with the Google+ API and grab info on articles pointed to by users in their activity stream](/2011/10/14/reading-list-mark-2-part-3/)
4. [Synchronising the URL list in the spreadsheet with corresponding tasks in the chosen tasklist](/2011/10/15/reading-list-mark-2-part-4/)
5. [Putting it all together and using the OnOpen event to insert a new 2-item menu entry on the spreadsheet’s page](/2011/10/16/reading-list-mark-2-part-5/)

Stay tuned!


