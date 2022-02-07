---
layout: post
title: Turnkey MVS 3.8J on Hercules S/370 Screenshot
tags:
- '370'
- jcl
- mainframe
- mvs
- turnkey
---


![Screenshot of Turnkey]( {{ "/img/2005/05/16264534_127c972adf_n.jpg" | url }})

As an ex MVS chap (I managed VSAM (DL/1) based SAP R/2 systems on IMS DB/DC at the start of my career) I was amazed some months back to find [Hercules](http://www.hercules-390.org/), the open source S/370 emulator.

So imagine my delight when I revisited Hercules the other day, to find a chap called Volker Bandke had put together an [MVS 3.8J Turnkey system](http://www.bsp-gmbh.com/turnkey) that you can install and run on your emulated mainframe.

Using the ISPF-alike [RPF](http://www.bsp-gmbh.com/hercules/herc_rpf.html), and [QUEUE](http://www.prycroft6.com.au/vs2sw/index.html), a facility similar to SDSF, I am in oldtimer-heaven.

And of course, the first thing I tried (after a bit of jiggery pokery setting things up) had to be the inevitable:
```
//HWORLD JOB CLASS=A,MSGCLASS=A,MSGLEVEL=(1,1),REGION=256K
//STEP1 EXEC PGM=IEBGENER
//SYSUT1 DD * HELLO WORLD!
//SYSUT2 DD SYSOUT=A
//SYSPRINT DD SYSOUT=A
//SYSIN DD DUMMY
```

Welcome back JCL, my long lost friend.

**Update**

I found some great pictures of real vintage terminals connected up to contemporary emulators (of vintage hardware) at [Corestore Collection](http://www.corestore.org/emuterm.htm). This is what the site’s owner calls “technological hooliganism” :-) Seeing this [picture of a 3278](http://www.corestore.org/3278-3.jpg) takes me back – I spent a good part of the start of my IT career in front of one of these…


