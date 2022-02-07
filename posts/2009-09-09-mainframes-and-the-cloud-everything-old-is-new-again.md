---
layout: post
title: Mainframes and the cloud - everything old is new again
tags:
- appengine
- azure
- cloudcomputing
- ec2
- ibm
- ims
- mainframe
- mvs
- sap
---


Cloud computing, virtual machines. It’s big business. Amazon has its [Elastic Compute Cloud](http://aws.amazon.com/ec2/) (EC2) which provides “*resizable compute capacity in the cloud*“, Microsoft has [Azure](http://www.microsoft.com/azure/default.mspx), providing “*on-demand compute and storage to host, scale, and manage Web applications on the Internet*” and Google’s offering is [App Engine](http://code.google.com/appengine/) which offers “*the ability to build and host web applications on *Google’s* infrastructure*“. As you might know, I’m personally very [taken with](/tag/appengine/) App Engine.

The offerings are slightly different – for example, while EC2 is bare virtual hardware, App Engine is a web application platform in the cloud. But they all have similar pricing arrangements, based generally on uptime or CPU time, I/O  and storage.

Does this seem familiar to you? It does to me, but then again, I did just turn 0x2B this month. In 1988 I was working in the Database Support Group at a major energy company in London, looking after the SAP R/2 databases, which were powered by IMS DB/DC, on MVS – yes, IBM big iron mainframes. I still look back on those days with [fond memories](http://radar.oreilly.com/2005/11/burn-in-7-dj-adams.html).

In reviewing some 3rd party software, I wrote a document entitled “**BMC Software’s Image Copy Plus: An Evaluation**“. BMC’s Image Copy Plus was a product which offered faster image copies of our IMS DB (VSAM) databases. (Image Copy Plus, as well as IMS, is [still around](http://www.bmc.com/products/product-listing/23026-2064-1201.html), over 20 years on! But that has to be the subject of another post).

One of the sections of the evaluation was to compare costs, as well as time — by how much would the backup costs be reduced using BMC’s offering?

And have a guess on what the cost comparison was based? Yes. CPU time, I/O (disk and tape [EXCP](http://www.reference.com/browse/wiki/EXCP)s) and actual tapes.

![mainframe job billing comparison]( {{ "/img/2018/08/IMG_20180806_100115.jpg" | url }})

Everything old is new again.


