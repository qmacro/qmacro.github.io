---
layout: post
title: Successful installation of EP plugin into testdrive WAS 6.10 system
date: 2004-03-15
tags:
  - sapcommunity
---
I spent most of yesterday in the kitchen, my favourite place. Everything I need is there – ingredients, oven, [Radio 4](http://www.bbc.co.uk/radio4/), a Cat5 network port, and my laptop.

At work, we’ve recently started looking at the Enterprise Portal. Interesting stuff, to say the least. But I wanted to be able to hack on my own stuff, to learn about portal technology, connecting to R/3 as a backend for, say, the Portal Data Viewer technology. (At the moment, that also means that I must unfortunately use MS-Windows, as two of the most platform-agnostic tools out there in Open Source land ([Eclipse](https://www.eclipse.org/), on which the Developer Studio is based, and [Tomcat](https://tomcat.apache.org/index.html), on which the PDK is based) are only supported by SAP on MS-Windows … for now. Come on SAP! I’ve got high hopes for CeBIT this week! How about support for decent OSes? 🙂

So I was wondering if the Enterprise Portal R/3 plugin (WP-PI) was installable on the evaluation WAS 6.10 system, which is of course Basis-only. I couldn’t see any reason why not – as the plugin was not likely to deliver any functional area specific stuff which would in turn rely on ABAP Dictionary objects that I didn’t have … So I decided to have a go.

It worked!

Here’s a summary of what I did.

## SPAM/SAINT update

I brought the patch manager SPAM (hi Otto!) and the add-on installation tool SAINT bang up to date, to version 6.10/0015. This update came from the patches area of the market place in the form of a CAR-compressed EPS package KD61015, which was loaded into R/3 using SPAM itself. (“Physician, heal thyself!”).

## Transport tools update

I also brought the tp and R3trans tools up to date, grabbing the binary files from the patches area, specifically SAP WEB AS -> SAP WEB AS 6.10 -> Binary Patches -> SAP KERNEL 6.10 32-BIT -> LINUX_32 -> Database independent. This meant that my tp version went from 310.56.09 to 310.56.38, and that my R3trans version went from 6.06 to 6.07. The update here was necessary for the SPAM/SAINT update to run through smoothly to completion (it may otherwise abort in the IMPORT_PROPER phase – you’ve been warned!).

## Imported the WP-PI plugin

After updating the tools, it was time to turn my attention to the WP-PI plugin itself. You can grab it from the installations area of the market place – what you want to end up with is a ZIP file containing the contents of CD # 51020102.

In that CD, there’s really only one file needed, KINE40A.CAR, in directory INST/DATA/610/. I unpacked this into the EPS area of /usr/sap/trans on my WAS application server.

The installation of the plugin is done with SAINT. After loading the package, the put was started. As my WAS system runs on a trusty old P2-233 with 256Mb RAM, the phases came and went slowly 🙂

I hit a couple of errors:

**Error in db_dynpro_interface**

This was a nasty rc 0012 error that appeared in SAPIINE40A.WAS. Lots of head scratching and note searching eventually led me to believe that the cause was the version of the transport tools. I downgraded R3trans back to 6.06, and restarted the phase. It then went through to completion successfully.

**Different nametabs for table …**

Further down the line, the installation stopped on an rc 0008 error, where it complained about nametab mismatches. Eww. Further investigations pointed, ironically, to the possibility that R3trans was out of date(!). So I put it back up to 6.07 … and the problem was solved.

Apart from those two problems, everything else was pretty much plain sailing.

## OSS Notes

Of course, it almost goes without saying that I used a number of OSS notes.

```text
400280 OCS:Known problems with Support Packages in Basis Rel. 6.10
019466 Downloading SAP kernel patches
655941 WP-PI 6.00: SAP Enterprise Portal Plug-in
415555 Known problems with transaction SAINT in Basis Release 6.10
```

Nice.

Now I have my own WAS system, with the WP-PI plugin installed, that I can connect from my EP PDK, via SSO (I had to generate a certificate for the PDK and install it into the WAS system via STRUST), and, say, make PDV calls to PORTAL_ALV_TEMPLATE-based function modules. Wheee!

![SAINT on WAS](/images/2004/03/WasSaint.png)

And as a bonus, the biscuits turned out well (Joseph baked those), the pate was good, as was the bread and the roast dinner 🙂

![Liver pate](/images/2004/03/LiverPate.jpg)

![Rye bread](/images/2004/03/RyeBread.jpg)

[Originally published on SAP Community](https://blogs.sap.com/2004/03/15/successful-installation-of-ep-plugin-into-testdrive-was-610-system/)
