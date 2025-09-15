---
title: Making OData from SAP accessible with the ICM's help
date: 2012-01-31
tags:
  - sapcommunity
---
I'm totally enamoured by the power and potential of SAP's [NetWeaver Gateway](https://blogs.sap.com/2012/11/13/gateway-and-duet-enterprise-day-one-in-madrid/), and all it has to offer with its REST-informed data-centric consumption model. One of the tools I've been looking at in exploring the services is the Sesame Data Browser, a Silverlight-based application that runs inside the browser or on the desktop, and lets you explore OData resources.

One of the challenges in getting the Data Browser to consume OData resources exposed by NetWeaver Gateway (get a trial version, available from the Gateway home page on SDN) was serving a couple of XML-based domain access directive files as described in "[Making a Service Available Across Domain Boundaries](https://learn.microsoft.com/en-us/previous-versions/windows/silverlight/dotnet-windows-silverlight/cc197955(v=vs.95)?redirectedfrom=MSDN)" - namely `clientaccesspolicy.xml` and `crossdomain.xml`, both needing to be served from the root of the domain/port based URL of the Gateway system. In other words, the NetWeaver stack needed to serve requests for these two resources:

```url
http://hostname:port/clientaccesspolicy.xml
```

and

```url
http://hostname:port/crossdomain.xml
```

Without these files, the Data Browser will show you this sort of error:

```text
A SecurityException has been encountered while opening the connection. 
Please try to open the connection with Sesame installed on the desktop. 
If you are the owner of the OData feed, try to add a clientaccesspolicy.xml 
file on the server.--
```

So, how to make these two cross domain access files available, and specifically from the root? There have been some thoughts on this already, [using a default service on the ICF's default host definition](https://web.archive.org/web/20200115083108/http://www.plinky.it/blog/2009/03/09/add-crossdomainxml-on-the-root-of-sap-web-application-server/), or even dynamically loading the XML as a file into the server cache (see the ABAP program in [this thread in the RIA dev forum](https://web.archive.org/web/20130628092517/http://scn.sap.com/thread/281050)).

But a conversation on Twitter last night about BSPs, raw ICF and even the ICM reminded me that the ICM is a powerful engine that is often overlooked and underloved. The ICM - Internet Communication Manager - is the collection of core HTTP/SMTP/plugin services that sits underneath the ICF, and handle the actual HTTP traffic below the level of the ICF's ABAP layer. In the style of [Apache handlers](https://httpd.apache.org/docs/trunk/handler.html), there are a series of handlers that the ICM has to deal with plenty of HTTP serving situations - Logging, Authentication, Server Cache, Administration, Modification, File Access, Redirect, as well as the "ABAP" handler we know as the ICF layer.

Could the humble ICM help with serving these two XML resources? Of course it could!

The File Access handler is what we recognise from the level 2 trace info in the dev_icm tracefile as HttpFileAccessHandler. You all read the verbose traces from the ICM with your morning coffee, right? Just kidding. Anyway, the File Access handler makes its features available to us in the form of the [icm/HTTP/file_access_<xx>](http://help.sap.com/saphelp_nw70ehp2/helpdata/en/48/3e1b4e252f72d0e10000000a42189c/frameset.htm) profile parameters. It allows us to point the ICM at a directory on the filesystem and have it serve files directly, if a URL is matched. Note that this File Access handler is invoked, and given a chance to respond, before we even get to the ABAP handler's ICF level.

With a couple of these file_access parameters, we can serve static `clientaccesspolicy.xml` and `crossdomain.xml` files straight from the filesystem, matched at root. Here's what I have in my `/usr/sap/NPL/SYS/profile/NPL_DVEBMGS42_nplhost` parameter file:

```text
icm/HTTP/file_access_1 = PREFIX=/clientaccesspolicy.xml, 
   DOCROOT=$(DIR_INSTANCE)/qmacro, DIRINDEX=clientaccesspolicy.xml 
icm/HTTP/file_access_2 = PREFIX=/crossdomain.xml, 
   DOCROOT=$(DIR_INSTANCE)/qmacro, DIRINDEX=crossdomain.xml
```

(I already have `file_access_0` specifying something else not relevant here).

What are these parameters saying? Well the PREFIX specifies the relative URL to match, the DOCROOT specifies the directory that the ICM is to serve files from in response to requests matching the PREFIX, and DIRINDEX is a file to serve when the 'index' is requested. Usually the PREFIX is used to specify a directory, or a relative URL representing a 'container', so the DIRINDEX value is what's served when there's a request for exactly that container. The upshot is that the relevant file is served for the right relative resource. The files are in directory `/usr/sap/NPL/DVEBMGS42/qmacro/`.

While we're at it, we might as well specify a similar File Access handler parameter to serve the favicon, not least because that will prevent those pesky warnings about not being able to serve requests for that resource, if you don't have one already:

```text
icm/HTTP/file_access_3 = PREFIX=/favicon.ico, 
  DOCROOT=$(DIR_INSTANCE)/qmacro, DIRINDEX=favicon.ico
```

The upshot of all this is that the static XML resources are served directly by the ICM, without the request even having to permeate up as far as the ABAP stack:

```log
Handler 5: HttpFileAccessHandler matches url: /clientaccesspolicy.xml 
HttpSubHandlerCall: Call Handler: HttpFileAccessHandler (1089830/1088cf0), task=TASK_REQUEST(1), header_len=407 
HttpFileAccessHandler: access file/dir: /usr/sap/NPL/DVEBMGS42/qmacro 
HttpFileAccessHandler: file /usr/sap/NPL/DVEBMGS42/qmacro/clientaccesspolicy.xml modified: -1/1326386676 
HttpSubHandlerItDeactivate: handler 4: HttpFileAccessHandler 
HttpSubHandlerClose: Call Handler: HttpFileAccessHandler (1089830/1088cf0), task=TASK_CLOSE(3)
```

and also that the browser-based Sesame Data Browser can access your Gateway OData resources successfully:

(Sesame Data Browser Screenshot lost in SAP community platform migration)

Success!

If you're interested in learning more about the Internet Communication Manager (ICM) and the Internet Communication Framework (ICF), you might be interested in my Omniversity of Manchester course:

[Web Programming with SAP's Internet Communication Framework](https://docs.google.com/presentation/d/1vudzwL0K2HlLC9SX6hBv42Nqe-00QIUJde4-EW326b8/edit)

Which is currently running in March (3rd and 4th) and May (9th and 10th) in Manchester.

[Originally published on SAP Community](https://blogs.sap.com/2012/01/31/making-odata-from-sap-accessible-with-the-icms-help/)
