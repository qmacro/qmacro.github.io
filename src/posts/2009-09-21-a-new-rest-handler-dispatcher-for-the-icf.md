---
layout: post
title: A new REST handler / dispatcher for the ICF
date: 2009-09-21
tags:
  - sapcommunity
---
One of the best underlying mechanisms to be introduced into the Basis / NetWeaver stack in the past few years is the Internet Communication Framework (ICF), which is a collection of configuration, interfaces, classes and a core set of processes that allow us to build HTTP applications directly inside SAP.

If you're not directly familiar with the ICF, allow me to paraphrase a part of Tim O'Reilly's [Open Source Paradigm Shift](https://www.oreilly.com/pub/a/tim/articles/paradigmshift_0504.html), where he gets audiences to realise that they all use Linux, by asking them whether they've used Google, and so on. If you've used WebDynpro, BSPs, the embedded ITS, SOAP, Web Services, or any number of other similar services, you've used the ICF, the layer that sits underneath and powers these subsystems.

One of my [passions](/tags/rest/) is [REpresentational State Transfer (REST)](http://en.wikipedia.org/wiki/Representational_State_Transfer), the architectural approach to the development of web services in the Resource Orientated Architecture (ROA) style, using HTTP for what it is – an application protocol. While the ICF lends itself very well to programming HTTP applications in general, I have found myself wanting to be able to develop web applications and services that not only follow the REST style, but also in a way that is more aligned with other web programming environments I work with.

An example of one of these environments is the one used in Google's [App Engine](http://code.google.com/appengine/). App Engine is a cloud-based service that offers the ability to build and host web applications on Google's infrastructure. In the Python flavour of Google's App Engine, the [WebOb](https://web.archive.org/web/20071012165155/http://pythonpaste.org/webob/) library, an interface for HTTP requests and responses, is used as part of App Engine's [web application framework](http://code.google.com/appengine/docs/python/tools/webapp/).

Generally (and in an oversimplified way!), in the WebOb-style programming paradigm, you define a set of patterns matching various URLs in your application's "url space" (usually the root), and for each of the patterns, specify a handler class that is to be invoked to handle a request for the URL matched. When a match is found, the handler method invoked corresponds to the HTTP method in the request, and any subpattern values captured in the match are passed in the invocation.

So for instance, if the incoming request were:

```text
GET /channel/100234/subscriber/91/
```

and there was a pattern/handler class pair defined thus:

```python
'^/channel/([^/]+)/subscriber/([^/]+)/$', ChannelSubscriber
```

then the URL would be matched, an object of class ChannelSubscriber instantiated, the method GET of that class invoked, and the values ‘100234' and '91' passed in the invocation. The GET method would read the HTTP request, prepare the HTTP response, and hand off when done.

For a real-world example, see [coffeeshop.py](http://github.com/qmacro/coffeeshop/blob/master/coffeeshop.py) (part of my [REST-orientated, HTTP-based publish/subscribe (pubsub) mechanism](https://github.com/qmacro/coffeeshop)), in particular from line 524 onward. You can see how this model follows the paradigm described above.

```python
def main():
  application = webapp.WSGIApplication([
    (r'/',                                MainPageHandler),
    (r'/channel/submissionform/?',        ChannelSubmissionformHandler),
    (r'/channel/(.+?)/subscriber/(.+?)/', ChannelSubscriberHandler),
    (r'/message/',                        MessageHandler),
    (r'/distributor/(.+?)',               DistributorWorker),
    [...]
  ], debug=True)
  wsgiref.handlers.CGIHandler().run(application)
```

This model is absolutely great in helping you think about your application in REST terms. What it does is help you focus on a couple of the core entities in any proper web application or service — the **nouns** and the **verbs**. In other words, the URLs, and the HTTP methods. The framework allows you to control and handle incoming requests in a URL-and-method orientated fashion, and leaves you to concentrate on actually fulfilling the requests and forming the responses.

So where does this bring us? Well, while I'm a huge fan of the ICF, it does have a few shortcomings from a REST point of view, so I built a new generic handler / dispatcher class that I can use at any given node in the ICF tree, in the same style as WebOb. Put simply, it allows me to write an ICF node handler as simple as [this](https://gist.github.com/qmacro/189000):

```text
method IF_HTTP_EXTENSION~HANDLE_REQUEST.
  handler( p = '^/$'                                          h = 'Y_COF_H_MAINPAGE' ).
  handler( p = '^/channel/submissionform$'                    h = 'Y_COF_H_CHANSUBMITFORM' ).
  handler( p = '^/channel/([^/]+)/subscriber/submissionform$' h = 'Y_COF_H_CHNSUBSUBMITFORM' ).
  handler( p = '^/channel/([^/]+)/subscriber/$'               h = 'Y_COF_H_CHNSUBCNT' ).
  handler( p = '^/channel/([^/]+)/subscriber/([^/]+)/$'       h = 'Y_COF_H_CHNSUB' ).
  dispatch( server ).
endmethod.
```

The handler / dispatcher consists of a generic class that implements interface IF_HTTP_EXTENSION (as all ICF handlers must), and provides a set of attributes and methods that allow you, in subclassing this generic class, to write handler code in the above style. Here's the method tab of Y_DISP_COFFEESHOP, to give you a feel for how it fits together:

![Method tab of Y_DISP_COFFEESHOP](/images/2009/09/y_disp_coffeeshop_methodtab_97688.png)

The classes that are invoked (Y_COF_H_* in this example) all inherit from a generic request handler class which provides a set of attributes and methods that allow you to get down to the business of simply providing GET, POST, PUT and other methods to handle the actual HTTP requests.

Here's an example of the method list of one of the request handler classes:

![Method list of Y_COF_H_CHNSUB](/images/2009/09/y_cof_h_chnsub_97689.png)

One interesting advantage, arguably a side-effect of this approach, is that you can use nodes in the ICF tree to ‘root' your various web applications and services more cleanly, and avoid the difficulties of having different handlers defined at different levels in the child hierarchy just to service various parts of your application's particular url space.

I'd like to end this weblog post with a diagram that hopefully shows what I've been describing:

![diagram](/images/2009/09/diagram_97690.png)

If you're interested in learning more, or sharing code, please let me know. I'm using this for real in one of my projects, but it's still early days.

For more information on the coffeeshop mechanism, checkout the videos in this playlist:

[![Screenshot from video](/images/2009/09/Ehdcd1HWkAA60Zi-1.jpeg)](https://www.youtube.com/playlist?list=PLfctWmgNyOIcbRYRdPrbjN_ZM56Kc5YTL)

*Update 01/05/2012 I've re-added images to this post that were lost when SDN went through the migration to the new platform. This project is now called ADL – Alternative Dispatcher Layer and is on the SAP Code Exchange here: https://cw.sdn.sap.com/cw/groups/adl*

*Update 09/09/2020 Added a link to the coffeeshop playlist*

[Originally published on SAP Community](https://blogs.sap.com/2009/09/21/a-new-rest-handler-dispatcher-for-the-icf/)
