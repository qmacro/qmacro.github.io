---
layout: post
title: WAS 6.40 testdrive for Linux is here!
date: 2004-03-19
tags:
  - sapcommunity
---
Phew. What a day yesterday at the world’s biggest IT fair. I arrived by train and joined the masses along the CeBIT skywalk to enter Aladdin's cave.

![The CeBIT Skywalk](/images/2004/03/CebitSkywalk.jpg)

I made a beeline for the main SAP area in Hall 4, only to be told by someone on the Web AS stand that they’d not heard anything about 640 being available for Linux. Aaargh!

Not to fear, though – I found out that SAP had a separate stand in the Linux Park over in Hall 6. I legged it over there, to meet Fabrizio from the Linux Lab. And there they were in all their glory: DVDs containing WAS 640, MaxDB 7.5 … and SAP NetWeaver Developer Studio!

![WAS 640 DVD](/images/2004/03/640forLinux.jpg)

Fabrizio and his colleagues had been busy preparing the packages for CeBIT – and he gave me a quick demo on the laptop. Nice work, Linux Lab!! What’s even more special, though, is that this 640 will work on Suse 8.1, Redhat 9.0, and Fedora Core 1. (There may have been another distribution, but I can’t remember). This is great news for those of us who can’t afford to shell out hundreds of euros for some sort of “advanced server” edition of a Linux distribution. And Fabrizio has put together RPMs to make the install a breeze. Fantastic!

It was great to see the Developer Studio running on Linux; and it was just as surprising to see how it had been done … using Wine – the Windows API implementation for \*nix. The reason for requiring Wine is that there are a couple of controls in SAP’s Eclipse plugins that invoke an OCX in the background. This means that in certain situations (when developing a Web Dynpro, for example), the plugin on a native Eclipse installation just won’t work. The Linux Lab chaps are planning to make this port; it’s just a matter of tuits.

SOAP sucks!

All in all a very worthwhile visit. I met up with Piers soon after (on the left in this picture)

![Linux Lab stand](/images/2004/03/LinuxLabStand.jpg)

and we tramped round the halls until our feet were sore and our heads were full. During that time, we found [Benny](https://people.sap.com/benny.schaich-lebek) (we’d been looking for him). It was great to meet him, we chatted for a while on aspects of J2EE, JNI, Perl integration, and had a great REST vs SOAP ‘debate’ … I’m sure Benny has now seen the light ;-). Here's a slightly blurry picture of me and Benny. 
![Benny and DJ](/images/2004/03/BennyAndDj.jpg)

The nominal caption is “SOAP sucks!” 🙂

[Originally published on SAP Community](https://blogs.sap.com/2004/03/19/was-640-testdrive-for-linux-is-here/)
