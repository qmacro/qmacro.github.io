---
layout: post
title: Lightweight notifications with the Message Strip
tags:
- messagestrip
- messaging
- notification
- openui5
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 11 by [DJ Adams](//qmacro.org/about/)**

![Message Strip control]( {{ "/img/2018/02/Screenshot-2015-06-23-at-22.26.53.png" | url }})

The [Message Strip](https://openui5beta.hana.ondemand.com/explored.html#/entity/sap.m.MessageStrip/samples) is a nice new control with 1.30. It’s in the main (sap.m) library of controls, and for me, appeals because it bridges the gap between no message at all, and a modal dialog box which is sometimes too heavyweight.

(If you’re wondering about the [Message Toast](https://openui5.hana.ondemand.com/#docs/api/symbols/sap.m.MessageToast.html) control, don’t forget that this lighter weight mechanism should only be used for “less important” messages such as informational messages on the successful completion of a step).

The nice thing about the way that this has been designed is actually its simple, perhaps restrictive nature. A nature that will give apps a better chance of having consistent messaging. The possible [message types are defined in the core](https://openui5.hana.ondemand.com/#docs/api/symbols/sap.ui.core.MessageType.html), and are displayed visually differently, via colour and icons. There’s an optional close button, and an optional link that is always displayed at the end of the message text. Pretty simple and neat.

And that’s about it, which in most cases, is all that will be needed, to display a useful short message in line within the application UI, especially in the context of desktop based UI designs. If you want to manage messages in a more complete way, you might want to take a look at the [Message Popover](https://openui5beta.hana.ondemand.com/explored.html#/entity/sap.m.MessagePopover/samples). But don’t dismiss the new Message Strip, it may just be what you’re looking for.


