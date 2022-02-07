---
layout: post
title: Tarpipe REST connector in 5 minutes
tags:
- http
- json
- rest
- tarpipe
---


Tarpipe implemented a REST connector a short while ago. This is something that I and others have been wanting for a while now, so it’s great news. The [announcement](http://getsatisfaction.com/tarpipe/topics/a_rest_connector#reply_1059544) was quite short and didn’t have much detail. I like to see things visually, and I’m guessing others do too, so I decided to write a little handler to receive a sample request from the REST connector to dump it for inspection.

As Bruno showed in the announcement, this is what the REST connector looks like:

![Tarpipe REST connector]({{ "/img/2009/05/tarpiperestconnector.png" | url }})

It will take whatever values it receives in the **title**, **description** and **link** input fields on the left hand side of the connector, and construct a piece of [JSON](http://www.json.org/) which it then sends in an [application/x-www-form-urlencoded](http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1) format as a data=<JSON> name/value pair in the message body of an HTTP POST request to the resource specified in the **serviceUrl** field.

So if we pass the values “*DJ’s Weblog*” into the title, “*Reserving the right to be wrong*” into the description, “*/*” into the link fields, and pass “*http://example.org/bucket/*” into the serviceUrl field, the following HTTP request is made on the http://example.org/bucket/ resource like this:

```
POST /bucket/ HTTP/1.1 Content-Length: 218 Content-Type: application/x-www-form-urlencoded Host: example.org Accept: */* data=%7B%22items%22%3A%5B%7B%22title%22%3A%22DJ%27s+Weblog%22%2C%22description %22%3A%22Reserving+the+right+to+be+wrong%5Cn%22%2C%22link%22%3A%22http%3A %5C%2F%5C%2Fwww.pipetree.com%5C%2Fqmacro%5C%2Fblog%5C%2F%22%7D%5D%7D
```

(whitespace added by me for readability).

When decoded and pretty-printed, that message body looks like this

```
data=```
<code class="block" id="output">{
    "items":[
       {
           "title":"DJ's+Weblog",
           "description":"Reserving+the+right+to+be+wrong",
           "link":"/"
       }
    ]
}```
```

This is what your app gets to process.

Bruno said that the format was chosen to be compatible with the Yahoo! Pipes Web Service Module, and it sure is — look at this example from the [Web Service Module](http://pipes.yahoo.com/pipes/docs?doc=operators#WebService) documentation:

```
data={ "items":[ { "title": "First Title", "link": "http://example.com/first", "description": "First Description" }, { "title": "Last Title", "link": "http://example.com/last", "description": "Last Description" } ] }
```

And what about those three output fields on the right hand side of the REST connector? Well, if your app returns a response with JSON in the body — this time not as a name/value pair, but as pure JSON — like this:

```json
{ "items":[   {  "title": "The response!",  "description": "Long text description of the response",  "link": "http://example.org/banana/"  }   ] }
```

then the workflow can continue and you can connect those values in the corresponding **title**, **description** and **link** output fields as input to further connectors.

Happy tarpiping!
