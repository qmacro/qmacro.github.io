---
layout: post
title: OData query operations and URL encoding the system query options
date: 2023-08-08
tags:
  - odata
  - developer-challenge
---
_You can use curl to send OData query operations with system query options that contain whitespace, and have it URL encode that whitespace for you._

We're running an [SAP Developer Challenge this month, on the topic of APIs](https://blogs.sap.com/2023/08/01/sap-developer-challenge-apis/). In a discussion relating to [Task 2 - Calculate Northbreeze product stock](https://groups.community.sap.com/t5/application-development/sap-developer-challenge-apis-task-2-calculate-northbreeze/td-p/277325), Wises shared his process and thoughts in [a nice reply to the task thread](https://groups.community.sap.com/t5/application-development/sap-developer-challenge-apis-task-2-calculate-northbreeze/m-p/277635/highlight/true#M2656), in which he said, about using `curl`:

> I found that I have to manually replace blank(space) with %20 in the $filter block to be able to fetch an OData API.

I thought I'd write a few notes on this phenomenon, which may help others, and which is a good opportunity to share some cool `curl` features.

One of the many lovely aspects of OData, especially with regards to the query and read operations, is that you can try things out in the browser, because both query operations and read operations are accomplished using the HTTP GET method.

## Using spaces in URLs in your browser

Here's a simple example, related to the topic of Task 2, using [the OData V4 version of the Northwind service](https://services.odata.org/V4/Northwind/Northwind.svc/). Consider a query operation on the `Products` entity set to:

* get a list of product names
* exclude products that are discontinued
* just have the first three returned, by ID

If you copy-paste the entire query operation URL into your browser's omnibar:

`https://services.odata.org/V4/Northwind/Northwind.svc/Products?$filter=Discontinued eq false&$select=ProductName&$top=3&$orderby=ProductID`

and then send that request off, you'll get an appropriate response:

```json
{
  "@odata.context": "https://services.odata.org/V4/Northwind/Northwind.svc/$metadata#Products(ProductName)",
  "value": [
    {
      "ProductName": "Chai"
    },
    {
      "ProductName": "Chang"
    },
    {
      "ProductName": "Aniseed Syrup"
    }
  ]
}
```

Your browser most likely didn't bat an eyelid at the whitespace in the URL, i.e. the space before and after the `eq` operator in the `$filter` system query option.

But if you look at what it actually sent to the Northwind server, you'll see that it automatically URL encoded the whitespace:

![Chrome Dev Tools URL encoding](/images/2023/08/chrome-dev-tools-urlencoding.png)

Spaces, and other special characters, are generally unwelcome in URLs, which are restricted to ASCII, and on top of that, there are [reserved characters](https://en.wikipedia.org/wiki/URL_encoding#Reserved_characters) which have special meaning in the URL structure. 

These characters must be [URL encoded](https://en.wikipedia.org/wiki/URL_encoding). This is also known as "percent encoding", because the encoding replaces a character with its corresponding ASCII value, in hex, prefixed with a percent sign.

So in this example, this part of the query string:

`$filter=Discontinued eq false`

became:

`$filter=Discontinued%20eq%20false`

because space, while it has a representation in ASCII, and is not one of the reserved characters, is generally not allowed .Otherwise how would processing or even us humans tell when a URL ended?

And of course, the ASCII character code for space is 32 in decimal which of course is 20 in hex.

## Using curl

When you use `curl` or similar tools, there's no context in which to automatically and silently modify URLs. At least, I wouldn't want `curl` to do that without me asking it to. So if you tried to use `curl` to request the URL above, it would send it verbatim. Which would be erroneous, and fail.

At this point, what one would normally do is to pre-empt this failure by properly encoding the URL before giving it to `curl`. There are many libraries and utilities to do this, and you could even write your own, it's not complex. Basically, this is the right way to go, to avoid giving bad data to `curl` to process.

However, `curl` has some lovely features, including the ability to send data with the request. This is normally done using the `--data` option, but there's a `--data-urlencode` option too, which will URL encode whatever you pass with this option.

Now, typically, one might say normally, these options are used in the case of POST requests, where the data is sent in the body of the request, i.e. in the payload. Often this is in the form of `name=value` pairs which usually should be URL encoded, in the context of HTML form submissions, for example (have you ever wondered why the default `Content-Type` header value sent by `curl` is `application/x-www-form-urlencoded`?).

Anyway, OData query and get operations are performed with HTTP GET, not HTTP POST. 

But.

We can still make use of `--data-urlencode` and still have the system query options (such as our `$filter` example here) sent in the query string of the URL, rather than in the request body. And that is if we use the `--get` option (short version is `-G`). Here's what the man page says about this option:

> When used, this option will make all data specified with -d, --data, --data-binary or --data-urlencode to be used in an HTTP GET request instead of the POST request that otherwise would be used. The data will be appended to the URL with a '?' separator.

Perfect!

So the `curl` equivalent of requesting the URL above, where the whitespace remains, is as follows (I'll also add `--verbose` so we can see what happens when we send the request, and a `Content-Type: application/json` header too):

```shell
curl \
  --get \
  --verbose \
  --header 'Accept: application/json' \
  --data-urlencode '$filter=Discontinued eq false' \
  --data-urlencode '$select=ProductName' \
  --data-urlencode '$top=3' \
  --data-urlencode '$orderby=ProductID' \
  --url 'https://services.odata.org/V4/Northwind/Northwind.svc/Products'
```

Here's what this produces (some verbose output removed):


```shell
> GET /V4/Northwind/Northwind.svc/Products?$filter=Discontinued%20eq%20false&$select=ProductName&$top=3&$orderby=ProductID HTTP/1.1
> Host: services.odata.org
> User-Agent: curl/7.74.0
> Accept: application/json
> 
< HTTP/1.1 200 OK
< Content-Length: 195
< Content-Type: application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false;charset=utf-8
< Date: Tue, 08 Aug 2023 11:43:25 GMT
< Server: Microsoft-IIS/10.0
< Access-Control-Allow-Headers: Accept, Origin, Content-Type, MaxDataServiceVersion
< Access-Control-Allow-Methods: GET
< Access-Control-Allow-Origin: *
< Access-Control-Expose-Headers: DataServiceVersion
< Cache-Control: private
< Expires: Tue, 08 Aug 2023 11:44:26 GMT
< Vary: *
< X-Content-Type-Options: nosniff
< OData-Version: 4.0;
< X-AspNet-Version: 4.0.30319
< X-Powered-By: ASP.NET
< 
{"@odata.context":"https://services.odata.org/V4/Northwind/Northwind.svc/$metadata#Products(ProductName)","value":[{"ProductName":"Chai"},{"ProductName":"Chang"},{"ProductName":"Aniseed Syrup"}]}
```

So there you have it. With `curl` you can have your cake and eat it. If you're not using `curl`, give it a spin today. After all, as well as being used everywhere on earth, it's also used [on Mars](https://youtu.be/Ic37FI351G4?t=127).

