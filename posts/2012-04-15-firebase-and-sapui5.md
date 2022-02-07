---
layout: post
title: Firebase and SAPUI5
tags:
- events
- firebase
- html5
- json
- resources
- rest
- sapui5
- websockets
---


I took a look at [Firebase](http://www.firebase.com) this weekend, approaching it within the context of the relatively new concept of “backend as a service” (BaaS) as exemplified by [Parse](http://parse.com) and others. Add server-side storage to your HTML application. Parse has a focus on the mobile app platform, whereas Firebase is a more generalised service. But that’s not the only difference.

**Everything is a resource**

There’s an idea that has been a long time in gestation – the idea of a loose coupling of data storage, front end apps, and backend command line environments. Firebase, an offering still in beta, [with some features pending](http://www.firebase.com/faq.html), has come along and seems to be delivering that. With style. Style not only in the actual UX, but in the design approach. In a recent talk on [SAP NetWeaver Gateway](http://scn.sap.com/community/netweaver-gateway) at the SAP Developers Kick-Off Meeting ([DKOM](http://www.youtube.com/watch?v=6Opmj8M_tBw)) in Karlsruhe, I had a slide that simply said:

> Everything is a resource

This is a key tenet that underpins the values of REST and related directions in information architecture: that if a piece of data (or, indirectly, a business function, for that matter) is important, you should give it a name, an address – [make it a first class citizen on the web](/2009/06/29/information-vs-behaviour/). From there, everything else follows. You can manipulate it, you can describe it, and you can link to it.

With Firebase, each piece of JSON data you store in the backend gets its own URL. Each object, array, element and attribute is automatically given an address, as you create them. You can manipulate the data via the [Javascript library](http://www.firebase.com/docs/), through a [REST API](http://www.firebase.com/docs/rest-api.html) and also through a lovely graphical debugger that looks like this:

<div class="wp-caption alignnone" id="attachment_1401" style="width: 310px">![image]({{ "/img/2012/04/FirebaseGraphicalDebugger.png" | url }})Firebase Graphical Debugger

</div>**Firebase Graphical Debugger**

With the debugger you can manipulate the data directly too. What I’m guessing, through the way that the Debugger operates, is that the Debugger itself is powered by Firebase. When data in the data set that you’re viewing is changed – whether that change is initiated via the REST API or activity in a Firebase-powered application, the view in the debugger is automatically updated to show that change.

**Event system**

Which brings me on to the other part of Firebase that’s important – the event system. Reading data from Firebase in your Javascript application is done by attaching asynchronous callbacks to a data location. These callbacks are triggered on data events like ‘value’, ‘child_added’, ‘child_changed’ and so on. So a very simple setup to be able to show when a new record was added to a dataset would be as simple as:

- Instantiating a new Firebase object, pointing to the URL of the data set
- Associating a callback function to the ‘child_added’ event, to receive, unpack and use the new record

Like this:

```
var dataRef = new Firebase('http://demo.firebase.com/[...]299148/[...]QULZ4snBB/');
dataRef.on('child_added', function(snapshot) { var data = snapshot.val(); // ... }
```

**Screencast: Stupid Firebase and SAPUI5 Tricks**

On Saturday evening I had a little hack around, and found developing with Firebase fun as well as interesting. I put together a little screencast “[Stupid Firebase and SAPUI5 tricks](http://www.youtube.com/watch?v=Obh2LW7CCKY)“. I have been investigating the [SAP UI Development Toolkit for HTML5](http://www.sdn.sap.com/irj/sdn/index?rid=/webcontent/uuid/20a34ae7-762d-2f10-c994-db2e898d5f70) (aka SAPUI5) for a short while now, and thought it would be an interesting exercise to hook up some data events powered by Firebase with an SAPUI5 [DataTable](http://www.pipetree.com/~dj/sapui5/demokit/#docs/api/symbols/sap.ui.table.DataTable.html). And throw my favourite environment – the Unix command line – into the mix too.  
    
<iframe allowfullscreen="" frameborder="0" height="315" src="http://www.youtube.com/embed/Obh2LW7CCKY" width="560"></iframe>  
    
 As I didn’t speak over the screencast, I thought I’d provide an annotation here.

1. We start out with a view of the Firebase Graphical Debugger showing a data set at a given URL. The data set contains a number of nodes, each node has an identifier which is used in forming that node’s unique URL
2. On the Unix command line, I use [cURL](http://curl.haxx.se) – a great command line HTTP client – to effectively remove the data, by making an HTTP PUT to the data set’s URL, supplying an empty JSON stucture as the payload. As you can see, the data disappeared immediately in the Graphical Debugger, as the event triggered the Javascript function to remove the data from the display to reflect the snapshot stored at the backend
3. A simple SAPUI5 DataTable is revealed in another window, empty, with three columns for some data we’re going to see appear there; data based on the standard Apache access log (source IP address, relative path of URL requested, and status code)
4. We go back to the Unix command line, and use a combination of tail, perl and some core bash shell features to pull some data out of my web server’s access log, turn it into JSON, and make HTTP POST requests to the data set stored by Firebase
5. Before we actually complete and execute that command pipeline, we have a quick look at the SAPUI5 and Firebase Javascript behind the DataTable, showing the relationship between the DataTable fields and what we’re expecting in the ‘child_added’ Firebase data event
6. Finally we execute the command pipeline and see immediately that not only the Graphical Debugger is updated to show the records that were added to the data set at that URL, but also the DataTable receives the data as intended.

There really is little merit in this experiment; what was important for me was to see Firebase in action, and to learn something about the philosophy of the framework. I really liked what I’ve seen so far.

As I mentioned at the start, there are some features still missing from Firebase – most notably security. So you’re completely at liberty right now to read those URLs from the screencast and start hacking with my demo data. But why do that? Better to get yourself down to the [Firebase tutorial pages](http://www.firebase.com/tutorial/) and build some samples for yourself.

Share and enjoy!

 


