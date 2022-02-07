---
layout: post
title: The APC SMT750IC UPS works with the Synology NAS DS1621+
tags:
  - hardware
  - nas
  - ups
---

_I've successfully configured this setup, and the USB connection from the UPS to the NAS does indeed work to tell the NAS to shut down._

TL;DR - My Synology DS1621+ NAS recognises the USB-connected APC SMT750IC UPS and will shut itself down on signals sent from it.

Since buying my Synology NAS DS1621+ a few weeks ago, we've had one power outage in the village. I'd been musing on the idea of getting a UPS for the NAS, and this event helped me come to a decision (a little late, perhaps, but there you go). It took me longer than it should have done to work out which UPS might be applicable and compatible. I couldn't find definitive confirmation that the UPS I was looking at was going to work with the NAS; in particular, I wanted to be as sure as I could that the USB connection would indeed be recognised by the NAS, which would receive power event signals and shut itself down as appropriate when the UPS had to switch to battery power.

Synology maintain a [Compatibility List](https://www.synology.com/en-us/compatibility?search_by=products&model=DS1621%2B&category=upses&p=1&change_log_p=1) and the APC Smart-UPS SMT750IC is indeed in there, with the value "Vendor Recommended" in the "Tested by" column. Reading around, I got the impression that this indeed meant what I suspected it meant, i.e. Synology themselves hadn't tested it, but instead were relying on APC to tell them. While I had no reason to doubt APC, I am fond of the proverb _Доверяй, но проверяй_ ([Trust, but verify](https://en.wikipedia.org/wiki/Trust,_but_verify)) and needed more solid evidence, especially before splashing out the [£300+](https://www.amazon.co.uk/gp/product/B07DM6BPM2/) on the device (shipping it back might also have been a pain, due to its extreme weight).

I'd seen a few bits and pieces about the SMT750IC model's predecessor, the SMT750I, and some evidence that folks were successfully using this older SMT750I model with their Synology NAS devices, including the USB-based shutdown flows. My research told me that the "C" suffix on the newer model represented a new cloud enabled feature, described in the blurb thus: "APC SmartConnect is a proactive remote UPS cloud monitoring feature that is accessible from any internet connected device". I'd also seen some vague confirmation that alongside some minor performance improvements, this cloud feature was really the only difference.

So it would seem reasonable to assume that the SMT750IC was going to be OK. But viewing the ports on the back of each device showed me that the USB connection was different (you can also see the green-coloured ethernet port on the SMT750IC relating to its "cloud enabled" feature):

![The backs of each of the SMT750I and SMT750IC]({{ "/img/2021/06/smt-devices-rear.png" | url }})

Was this USB port difference significant? It was hard to tell. Perhaps the USB port on the SMT750I was a type B for a reason? Had the USB support on the SMT750IC changed?

Further research suggested that on the one hand, if the APC "Powerchute" software was supported by the UPS, it was likely to work with the NAS, mostly because of Synology's support for the [Network UPS Tools (NUT) standard](https://networkupstools.org/). But then I read elsewhere that this standard had multiple implementations, so it wasn't a certainty by any means.

In the end, I [asked on the Amazon product page](https://www.amazon.co.uk/ask/questions/Tx32WEPA58FDXDS/ref=ask_dp_dpmw_al_hza), and also called their UK support centre. Both avenues resulted in a positive outcome - I got a positive reply from APC Customer Care and also from the user "Pegasus", and the person on the phone also confirmed this.

So if you're in the same situation as I was, perhaps this post will help.

Here are some screenshots of when I tested the UPS and NAS, removing the power from the UPS so that it switched to battery mode.

![The UPS settings on the NAS, showing the UPS is recognised via USB]({{ "/img/2021/06/ups-recognised.png" | url }})

The UPS settings on the NAS, showing the UPS is recognised via USB.

![The UPS's normal status showing via the "cloud enabled" feature on APC's website]({{ "/img/2021/06/cloud-status-power.png" | url }})

The UPS's normal status showing via the "cloud enabled" feature on APC's website.

![The UPS's front panel display shortly after I removed the power]({{ "/img/2021/06/ups-shutdown-display.jpeg" | url }})

The UPS's front panel display shortly after I removed the power.

![The alert on the NAS when the UPS has switched to battery mode]({{ "/img/2021/06/ups-alert-on-nas.png" | url }})

The alert on the NAS when the UPS has switched to battery mode.

![The UPS's warning status showing via the "cloud enabled" feature on APC's website when the UPS is in battery mode]({{ "/img/2021/06/cloud-status-battery.png" | url }})

The UPS's warning status showing via the "cloud enabled" feature on APC's website when the UPS is in battery mode.
