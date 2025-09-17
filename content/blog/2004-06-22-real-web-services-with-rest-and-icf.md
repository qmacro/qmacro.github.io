---
title: Real Web Services with REST and ICF
date: 2004-06-22
tags:
  - rest
  - sapcommunity
  - abap
  - icf
description: This piece has become somewhat famous (or infamous) in SAP tech circles, for the approach it took and the claims it made. I'm happy to say that REST won out and that those that tried to denounce me ... failed :-)
---

This was a piece I wrote in 2004 as part of a set of articles I contributed to the early SAP Developer Network. Back then the content was published behind a login wall; plus, unfortunately, during an SAP Developer Network platform migration, content was lost, including this article. Luckily I managed to piece it together over the last few months. Here it is. Some OCR based artifacts and errors may remain, if you spot any, please let me know. Thanks. DJ (Apr 2025).

It was published with a rather unfriendly disclaimer that the SAP Developer Network editors at the time added to the top of it, without my knowledge or checking with me first:

> "DJ Adams is not an SAP employee and the opinions he expresses in this article do not reflect the official position or positioning of SAP"

Here's a screenshot of the top of the article:

![article header with disclaimer: "DJ Adams is not an SAP employee and the opinions he expresses in this article do not reflect the official position or positioning of SAP"](/images/2004/06/article-header-with-disclaimer.png)

Turns out that disclaimer didn't age well, as REST turned out to be the primary, dominant style of API architecture in the SAP enterprise world ... and still is :-)

## Summary

Learn about the Internet Communication Framework, and how to harness it to write your own web services in SAP. Break free from the stranglehold of complexity that SOAP has upon you and start building real web services with HTTP.

## Web Services and SOAP

There's a lot of hype about SOAP and associated WS-* initiatives being the panacea of
data interop over the web. But while the most common transport of SOAP messages is
HTTP, can SOAP be really classed as a ‘web’ service? There's really nothing web-like
about SOAP, except that in many cases, the standard HTTP port is used ~ ‘hijacked’,
almost ~ as a tunnel through which to transfer opaque messages to and from a single non-
specific endpoint.

Ok, that was perhaps a little harsh. But as the saying goes, truth hurts. When I think of
SOAP I feel very distant from the information I'm trying to manage. There are just too many
mechanisms and far too much protocol in the way. Why employ an application protocol
(such as HTTP) and then only use it to transfer messages between meaningless
addresses? It's ike buying a car and only using it to store things in.

Let's think about what web services are about. They're about the sharing and exchange of
data over the web. What's the biggest, most scalable, most interoperable, most widely
used, most successful example of that? Yes, surprise surprise, it's the web itself. And what
powers the web? The Hypertext Transfer Protocol. HTTP. Sure, there are plenty of key
team members that go to make up the full experience ((X)HTML, MIME, CSS, and so on),
but the one essential ingredient that makes everything work, is the application protocol -
not transport protocol -- HTTP.

So if web services are about sharing and exchanging data, what are we trying to achieve?
We're trying to open up the data and functionality inside our SAP systems, in a controlled
manner of course, to share with our partners and customers.

Look at this in the context of SOAP. You have an element (or elements) of data that you
want to share with your customers. Who in their right mind would wrap a CORBA-wannabe
function call in angle brackets, send the request to an opaque endpoint, expect the receiver
to blindly accept it, and then expect to have to start an XML parser just to get at the reply?
People building job security, perhaps? Or with too much time on their hands?

And another thing. When you're reading or writing data with SOAP, you're not actually
addressing that data directly, are you? All you've got is the address of some faceless SOAP
server location with which you must interact. But surely, if an element of data is important
enough to share with your customer, isn't it also important enough to have its own address
-- its own URL?

## HTTP - The Application Protocol

I pointed out earlier that HTTP is an application protocol, not a transport protocol. That's an
important distinction to make here. HTTP is not just about transporting payloads around.
Let's look briefly at what HTTP is all about.

HTTP allows you to manage data, in that it allows you to read (retrieve), write, update and
delete it. And as any SQL guru will testify, those are the four essential fundamentals in any
data manipulation mechanism. In HTTP there are verbs and nouns. The verbs -- GET
(read), PUT (write), POST (update), DELETE (ahem, delete) - reflect the actions that can
be carried out on the nouns. The nouns are URLS.

Looking at this in the context of, say, a page of HTML, we could have the following simple
scenarios as shown in Figure 1.

Verb: GET
<br>Path: /some/path/page.html
<br>Action: Retrieve the specified HTML page

Verb: PUT
<br>Path: /some/path/page1.html
<br>Action: Replace the specified HTML page with a new one

Verb: POST
<br>Path: /some/path/
<br>Action: Add a new HTML page - the response will indicate where the new page is stored (e.g. /path/page2.html)

Verb: DELETE
<br>/some/path/page1.html
<br>Action: Delete the specified HTML page

*Figure 1. HTTP verb/noun scenario example*

With MIME types allowing us to specific and handle content types of all kinds, HTTP is
arguably all we need as a flexible application protocol to provide all kinds of web services.

Part of the appeal of using real web services is that HTTP is unadorned. What you see is
exactly what you want. And what you want, you can get using a huge array of tools, on a
wide range of platforms. HTTP is probably one of the most widely ported application
protocols around. There are all sorts of ways you can construct and execute HTTP
requests and parse responses. There are command line tools, like GET and POST (that
come with the fantastic LWP library), which mean that you can combine HTTP requests
with your essential shell scripting and pipe-work. There are libraries for almost every
language under the sun. There are even text-mode web browsers that double up as generic
HTTP tools. And one of the most attractive side-effects of HTTP's ubiquity is that there's a
plethora of debugging tools out there.

## SOAP and Firewalls

Finally, it's worth giving a thought to our poor firewall administrators, whose job it is to
analyse traffic and control what enters the enterprise network. With SOAP, the firewall
administrator's toolset is about as much use as a chocolate teapot when it comes to helping
police SOAP requests.

Firstly, in many cases, all SOAP requests, whether they have read-only intentions or write
intentions, go to the same endpoint (URL), so no distinction can be made based on the
action (verb) or object (noun). Secondly, even if the firewall software did take the time and
effort to open up the SOAP payload (arguably not the firewall's right), fire up an XML parse
to interpret it, and look at the method call being issued, who's to say, based on the arbitrary
name of that method call, what the intention was? (There is the SOAPAetion header which
is supposed to help here; but for one thing, it's optional, and for another, even if it was
mandatory, the value supplied is as good as arbitrary).

With HTTP, the firewall administrator's job is easier. What's the verb? POST? Ok. What's
the noun? /some/path/to/a/data/element. Ok, not allowed. Job done.

## A Simple Web Service in SAP

So, I'd like to balance out this fighting talk with a very simple example of a real web service,
implemented using the Internet Communication Framework (ICF). Before we do, let's look
at the context in which the example will sit.

## The Internet Communication Framework

The ICF is an essential part of the HTTP framework built into an SAP system. While the
Internet Communication Manager (ICM) does the actual low-level handling of HTTP.
requests (with kernel-level code), it's the ICF that exposes the ICM features to us, the lowly
ABAP programmers, giving us a fantastic platform on which to build HTTP applications. It
gives us a set of core interfaces and classes representing the fundamental objects in any
web server application development environment - the web server itself, the request object,
the response object, utilities for manipulating HTTP data, and so on.

For more information about the ICF, see the relevant section in the online SAP
documentation at <http://help.sap.com>.

With the ICF, you build web applications - web services - by writing a so-called handler. A
handler is simply a piece of code, in the form of a class, that's called by the HTTP
framework for requests made to certain URLs. The code interprets the request, and
constructs the response. Where does the BSP technology fit in all of this? Well, the BSP is
'just' another handler, class CL_HTTP_EXT_BSP, pre-written and provided by SAP, a
handler that is called in the case of requests to certain URLs (starting /sap/bc/bsp). It just
so happens that the BSP handler is hugely powerful and is a complete MVC-powered
development world within itself - kudos, chaps!

## A Simple Handler Class

So let's build a simple handler class to allow authenticated HTTP requests to retrieve (GET)
information from the Correction and Transport System (CTS). I've developed this example
in my copy of the free WAS 6.40 testdrive system 'NW4', which is Basis-only, meaning I'm
bound to use some Basis-orientated data unless I develop some custom applications
myself. To keep things simple, I'm going to use CTS data.

We're just interested in exposing basic attributes of transport requests and tasks - who the
‘owner is, what type itis, the date, and the short description. That sort of thing. The
‘exposure will be made through URLs that have this pattern:

```url
http://servemame:port/some-pathitransport/<requestname>/<attribute>
```

For simplicity (and to save lookup tables or dynamic jiggery-pokery in the example code),
we're going to use the field names from tables E070 (CTS Request / Task Header table)
and E07T (CTS Request / Task Short Text table).

So for example, to retrieve the owner of request NW4K900008, all that is needed is an
HTTP GET on the following URL:

```url
http://shrdlu local.net:8000/qmacro/transpor/Y 6BK039552/as4user
```

Note that each element of data has its own address. Each element is a noun in the context
of HTTP.

The host on which my NW4 system runs is ‘shrdlu.local.net, the ICM is listening for HTTP.
requests on port 8000, and I've defined a namespace ‘qmacro’ in SICF within which I
develop all my test services. Under that namespace I have defined a service object
‘transport’, for which the handler class Z_CL_TRANSPORT_INFO is defined. This can be
seen in Figure 2.

![The definition of the ‘transport’ service in SICF](/images/2004/06/figure2.png)

*Figure 2. The definition of the ‘transport’ service in SICF*

Within the handler class we have the code to identify what transport is being requested
('Y6BK039552’) and what attribute (‘as4user’). The handler will retrieve the relevant details,
and return them in response. Figure 3 shows how that data can be retrieved on the
‘command line, using the GET command. The owner of request Y6BK039552 in this case is
FILDEBRANDT. Figure 4 shows a similar piece of data retrieved via the web browser.

```shell
[dj@hadrian]$ GET http://shrdlu.local.net:8000/qmacro/transport/¥6BK039552/as4user
Enter username for NW4 at shrdlu.local.net:8000: developer
Password: *****

HILDEBRANDT
```

![Retrieving data from a web browser](/images/2004/06/figure4.png)

*Figure 4. Retrieving data from a web browser*

## Method HANDLE_REQUEST in IF_HTTP_EXTENSION

Classes that are to act as ICF handlers must implement interface IF_HTTP_EXTENSION.
This interface has a single method, HANDLE_REQUEST. It's in this method that you write
the ABAP code to work out what's being requested, and what to do to respond to that
request. Figure 5 shows the code in class Z_CL_TRANSPORT_INFO's method IF_HTTP_EXTENSION~HANDLE_REQUEST.

```abap
METHOD IF_HTTP EXTENSION~HANDLE_REQUEST .
    * [DATA DEFINITION]
    * e07* table data held in transinfo

    TYPES:
    begin of transinfo,
        trfunction TYPE e070-trfunction,
        trstatus TYPE e070-trstatus,
        as4user TYPE e070-as4user,
        as4date TYPE e070-as4date,
        as4text TYPE e07t-as4text,
    end of transinfo.

    DATA:
    path_info TYPE string,
    w_trkorr TYPE string,
    w_attr TYPE string,
    w_body TYPE string,
    w_fieldname TYPE string,
    transportinfo TYPE transinfo.

    FIELD-SYMBOLS \<fs> TYPE any.

    * [INTERPRET REQUEST]
    * Look at what is being requested

    path_info = server->request->get_header_field( name = '~path_info' ).
    SHIFT path_info LEFT BY 1 PLACES.
    SPLIT path_info AT '/' INTO w_trkorr w_attr.

    * [RETRIEVE DATA]
    * Try to retrieve the transport

    SELECT SINGLE 070~trfunction e070~trstatus e070~as4user e070~as4date e07t~as4text
    FROM 070
    INNER JOIN e07t ON e07t~trkorr = e070~trkorr
    INTO transportinfo
    WHERE e070~trkorr EQ w_trkorr
    AND e07t~langu EQ sy-langu.

    * [TRANSPORT NOT FOUND]
    * Abort with 404 if the transport can't be found

    IF sy-subre ne 0.
        CALL METHOD server->response->set_status ( code = "404" reason = 'Transport not found' ).
        CONCATENATE '<html>'
        '<head>'
        '<title>Transport not found</title>'
        '</head>'
        '<body>'
        '<h1>Transport&nbsp;'
        w_trkorr
        '&nbsp;not found</h1>'
        '</body>'
        '</html>'
        INTO w_body.

        CALL METHOD server->response->set_cdata( data = w_body ).
        EXIT.
    ENDIF.

    * [SELECT ATTRIBUTE]
    * Select desired attribute

    TRANSLATE w_attr TO UPPER CASE.

    CONCATENATE 'TRANSPORTINFO' w_attr INTO w_fieldname
    SEPARATED BY '-'.
    ASSIGN (w_fieldname) to <fs>.

    * [ATTRIBUTE NOT FOUND]
    * Abort with 404 if the attribute cannot be found

    IF sy-subre ne 0.
        CALL METHOD server->response->set_status (
        code = '404'
        reason = 'Attribute not found' ).
        CONCATENATE '<html>'
        '<head>'
        '<title>Attribute not found</title>'
        '</head>'
        '<body>'
        '<h1>Attribute &nbsp;'
        w_attr
        '&nbsp;not found</h1>'
        '</body>'
        '</html>'
        INTO w_body.
        CALL METHOD server->response->set_cdata( data = w_body ).
        EXIT.
    ENDIF.

    * [STORE ATTRIBUTE]

    w_body = <fs>.

    * [SET CONTENT TYPE]
    * So far so good ~ return attribute value in response body

    CALL METHOD server->response->set_header_field(
    name = 'Content-Type'
    value = 'text/plain; charset=utf-8' ).

    * [PUT DATA IN RESPONSE BODY)
    CALL METHOD server->response->set_cdata( data = w_body ).
ENDMETHOD.
```

*Figure 5. Z_CL_TRANSPORT_INFO's IF_HTTP_EXTENSION~HANDLE_REQUEST*

## Step By Step

Let's take the code in Figure 5 step by step. The code is deliberately simplistic and
sequential to make it easier to go through in stages. The subheadings that follow refer to
the sections of the same name in the code comments.

### DATA DEFINITION

Here we define a structure to hold the CTS data that we're going to retrieve, a few working
fields, and a field symbol to use when selecting the requested attribute later on.

### INTERPRET REQUEST

For every incoming HTTP request, a 'server control block' is made available to the handler
method in the form of a CL_HTTP_SERVER object. This object has two significant
attributes, one of which is the HTTP request object (REQUEST). We can retrieve all sorts
of information about the incoming HTTP request from this, such as the path information
from the URL. In this case, this is anything following what's been defined in SICF for which
this handler is specified (see Figure 2), i.e. '/default_host/qmacro/transport'.

So making this call:

```abap
path_info = server->request->get_header_field( name = '"~path_info' ).
```

retrieves the path information, which, from the example above, is '/Y6BK039552/as4text'.
Note that '~path_info' isn't really a proper HTTP header field; in the ICF context it's one of
the so-called 'pseudo' header fields, which are just bundled in with the rest of the real
header fields for convenience of access.

Once retrieved, the path information is split into transport number and attribute.

### RETRIEVE DATA

Now we've got the desired transport number, we can read tables E070 and E07T for the
information.

### TRANSPORT NOT FOUND

If the read failed, we assume the request or task cannot be found, and so must respond
accordingly. The HTTP response object (RESPONSE) is the other significant attribute of
the control block and can be used to build the HTTP response. Here we do two things. We
set the HTTP status, and supply some friendly HTML in the body in case the request has
been made from a browser.

Calling the set_status() method of the response object allows us to specify the HTTP status
code and reason. We're setting the well-known 'Not found' status code 404 in this case,
with a meaningful reason text.

Following that, some HTML is concatenated and placed in the response body with the
set_cdata() method.

Figure 6 shows the response in a web browser to a request for an unknown transport.

![Unknown transport result in a web browser](/images/2004/06/figure6.png)

Figure 6. Unknown transport result in a web browser

### SELECT ATTRIBUTE

At this stage it's time to select the attribute. Although not absolutely necessary, we're
translating the attribute name to upper case before using a dynamic assign to point to the
right place in the transportinfo structure.

### ATTRIBUTE NOT FOUND

Of course, if an invalid attribute name was specified in the URL, the assign is going to fail,
so we respond accordingly, in a similar manner to how we responded in the case of a
request or task not being found. We send back status code 404, with a short explanation of
what happened.

### STORE ATTRIBUTE

If the attribute was valid, and the assign was successful, then we can retrieve the attribute
value from the structure.

### SET CONTENT TYPE

We're on the home straight now; all that's needed is to build the response. Here, because
the data we're sending back is straightforward text, we set the content type of the response
appropriately. The set_header_field() method of the response object is the antithesis of the
get_header_field() method of the request object, in that it's used to set a header field in the
‘outgoing HTTP response.

### PUT DATA IN RESPONSE BODY

In the same way that we used the set_cdata() method to put some HTML in the 404
response, we now use it to place the attribute value in the HTTP body.

## Where to next

The ICF provides all you need to develop your own handlers for your own web applications
and services. The simple example here merely scratched the surface; the best thing for you
to do next is take this and expand on it, discovering the wealth of features available to the
ABAP programmer of the 21st century.

For a start, how about dealing with the fact that we really want to avoid people interacting
with the transport info URLs using anything other than GET. It's a fairly straightforward
matter to add a bit of code into the "INTERPRET REQUEST” section as shown in Figure 7.

```abap
* [INTERPRET REQUEST)
* Look at what is being requested

path_info = server->request->get_header_field( name = path_info' ).

* (extended code - start)
verb = server->request->get_header_field( name = '~request_method' ).

* Abort if not GET
IF verb NE 'GET'.
    CALL METHOD server->response->set_header_field(
    name = 'Allow'
    value = 'GET' ).
    CALL METHOD server->response->set_status (
    code = '405'
    reason = 'Method not allowed’ ).
    EXIT.
ENDIF.

* (extended code - end)

SHIFT path_info LEFT BY 1 PLACE.
SPLIT path_info AT '/' INTO w_trkorr w_attr.
```

*Figure 7. Extending the INTERPRET REQUEST section for 'GET only'*

Here we use the get_header_field() method to retrieve the actual HTTP verb used. It's
stored, like the path info, as a pseudo HTTP header. (The new variable 'verb' is defined in
the DATA DEFINITION section as TYPE string). We only want to allow GET, and so reject,
all others by sending a status code of 405 in the response, indicating that the method used
was not allowed. The HTTP 1.1 specification states that when you return a status of 405
you must also return a header field in the response, to list the methods that are valid and
acceptable for the resource (URL) in question. This is achieved using the
set_header_field() method as shown, before setting the status and reason with set_status().
Figure 8 shows a typical response, with header lines, to an attempt to POST some data to
a transport info URL. (In this case, we're supplying the basic authentication information via
the -C parameter.)

```shell
[dj@hadrian dj]$ echo "SOAP sucks" \
| POST -Se -C developer:password http://shrdlu.local.net:8000/qmacro/transport/Y6BK039552/trstatus
POST http://shrdlu.local.net:8000/qmacro/transport/Y6BK039552/trstatus -->
405 Method not allowed
Server: SAP Web Application Server (1.0; 640)
Allow: GET
Content-Length: 114
Content-Type: text/html; charset=iso-8859-1
Client-Date: Fri, 18 Jun 2004 10:44:18 GMT
Client-Response-Num: 1
Title: Method not allowed

<HTML>
<HEAD><TITLE>An Error Occurred</TITLE></HEAD>
<BODY>
<H1>An Error Occurred</H1>
405 Method not allowed
</BODY>
</HTML>
[dj@hadrian dj]$
```

*Figure 8. Response to an invalid POST request.*

## A Note on REST

The title of this article mentioned REST. What is REST? It stands for "REpresentational
State Transfer" and is an architectural style, not a protocol per se. The term was coined
by Roy Fielding (one of the authors of the HTTP 1.1 specification) in his Ph.D. dissertation
looking at the model of web architecture and defining a framework for understanding that
architecture (see the dissertation abstract for more details).

REST's premise is that HTTP has everything we need to implement web services. The
ideas and example in this article are driven by the REST philosophy.

Yau can read more on REST by following links from the Portland Pattern
Repository's RestArchitecturalStyle wiki page.

## Final Thoughts

Whether or not you're a fan of SOAP, I hope this has provided food for thought, and
showed that there are plenty of facilities at your disposal in SAP for building Real Web
Services.

---

First published on the SAP Developer Network.
