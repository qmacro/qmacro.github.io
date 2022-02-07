---
layout: post
title: Two tools for Gateway trial host nplhost
tags:
- gateway
- multitail
- netweaver
- sap
- screen
---


The [SAP NetWeaver Gateway](http://scn.sap.com/community/netweaver-gateway) trial system is a great way to get your hands on all that OData and HTTP goodness. There are a couple of tools that I find myself re-installing when I build a new copy of the VM + trial – multitail and screen.

[Multitail](http://www.vanheusden.com/multitail/) is something I mentioned on my [Enterprise Geeks slot with Craig Cmehil](/undefined/) and allows you to tail more than one file at once. Very useful for keeping an eye on all those log files in the instance work directory!

And [screen](http://en.wikipedia.org/wiki/GNU_Screen) is one of those great utilities that I put in the same class as putty and vim: absolutely essential. It allows you to maintain multiple persistent sessions on a remote *nix host. Great for disconnecting and reconnecting (especially on dodgy ‘net connections) and being able to continue exactly where you left off.

I realised that people might benefit from these too, so I thought I’d offer them for you to download in binary form, so you can avoid going through the hassle of firing up the package manager and wrestling with repositories and dependencies, or building from source. I built them from source on an 64bit SUSE Linux VM ‘nplhost’ straight from SAP, so they should work if you’re using the same as the standard VM recommended for the trial. If you’ve decided on a Windows VM to run Gateway, then you’re out of luck, in more ways than one :-)

They’re available here: [http://www.pipetree.com/~dj/2012/04/nplhost/](http://www.pipetree.com/~dj/2012/04/nplhost/)

![image]({{ "/img/2012/04/nplhost.png" | url }})

Download them to npladm’s home directory to run them from there. Don’t forget to (a) chmod +x each of the binaries, and (b) rename the _ to .  for each of the dotfiles.

Share and enjoy!


