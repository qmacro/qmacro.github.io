---
date: 2005-02-24
title: Ralphm on sjabber
tags:
- fosdem
- jabber
- sjabber
- xmpp
description: Digging into sjabber's source.
---


![sjabber running on a Wyse terminal](/images/2005/02/sjabber_wyse.jpg)

I had a nice conversation with [Ralph Meijer](http://ralphm.net/) this afternoon; he had grabbed a very old program that I’d written — [sjabber](/jabber/sjabber), a console-based Jabber groupchat client — because he’d been having some issues with his current client.

As Ralph [explained in his blog](http://ralphm.net/blog/2005/02/24/sjabber) just now, it only took a single-line modification to get it up and running with the newer [mu-conference](http://mu-conference.jabberstudio.org/) protocol. And if you look at the line:

```text
> Type => 'headline', # why did I do this?
```

it was fairly questionable, even to me, from the start ;-) (The line was commented out.) Clearly it should have been ‘groupchat’ from the beginning. Early days…

BTW, Ralph’s speaking this weekend at [FOSDEM](http://www.fosdem.org/), in Brussels. Irritatingly I’m otherwise engaged on the Saturday and can’t make it then; but I’m hoping to be able to pop down in the car on the Sunday and spend the day there. It’s a great event.
