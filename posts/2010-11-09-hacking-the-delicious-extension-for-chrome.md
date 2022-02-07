---
layout: post
title: Hacking the Delicious extension for Chrome
tags:
- chrome
- delicious
- extension
- javascript
---


I’ve recently moved from Firefox to Chrome. I use Delicious for managing my public and private bookmarks, and have installed the [plugins](http://www.delicious.com/help/tools) for both browsers.

In moving to Chrome and installing the [Delicious Tools](https://chrome.google.com/extensions/detail/gclkcflnjahgejhappicbhcpllkpakej) extension, one thing I really missed from the Firefox-based add-on was the ability to set a [simple configuration option](http://kenyarmosh.com/delicious-firefox-add-on-always-mark-as-private/) to set the “Mark as private” checkbox on by default. There seemed to be a lot of forum-based discussion on making this work for the Chrome extension, but it seemed no solution was immediately evident. So I decided to investigate, and found out what I could do. This post is as much an aide memoire as anything else.

The Chrome extensions can be administered by entering [chrome://extensions](chrome://extensions) into the address bar. This is what you can see for the Delicious Tools extension, when you have the Developer Mode expanded:

![Chrome extension details]( {{ "/img/2010/11/screenshot-extensions-google-chrome.png" | url }})

There are a couple of interesting things that we can see:

- the ID of this extension is *gclkcflnjahgejhappicbhcpllkpakej*, which is the same as part of the URL that points to the extension’s home page:
[https://chrome.google.com/extensions/detail/gclkcflnjahgejhappicbhcpllkpakej](https://chrome.google.com/extensions/detail/gclkcflnjahgejhappicbhcpllkpakej)
- there’s a reference to the active view ‘background.html’, which, on inspection, contains a Javascript function addDelicious() which builds up the URL that will retrieve the Delicious page to save a bookmark

A find and grep later, I find this background.html component’s home:

```
~/.config/google-chrome/Default/Extensions/ gclkcflnjahgejhappicbhcpllkpakej/1.0.4_0/
```

It’s not just integration mechanisms that can be built in a loosely-coupled way. Applications built with HTTP, HTML, CSS and Javascript are also, almost by definition, beautifully loosely coupled; on inspecting the Javascript source in this file, we see:

```
 // Show delicious pop-up window addDelicious = function(conf) { var c = conf || {}, doc = c.document || document, url = c.url || doc.location, title = c.title || doc.title, notes = c.notes || '', w = c.width || 550, h = c.height || 550, deliciousUrl = c.deliciousUrl || "http://delicious.com/save?v=5&noui&jump=close&url=", fullUrl; fullUrl = deliciousUrl + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) + '&notes=' + encodeURIComponent(notes); window.open( fullUrl, [...]
```

A simple addition of

```
fullUrl = fullUrl + "&share=no";
```

before the call to window.open() will add the query parameter “share=no” to the Delicious URL that is requested, resulting in the HTML form being rendered with the “Mark as private” checkbox already ticked.

![Saving a bookmark, with private as default]( {{ "/img/2010/11/screenshot-save-a-bookmark-on-delicious-google-chrome.png" | url }})

Result!
