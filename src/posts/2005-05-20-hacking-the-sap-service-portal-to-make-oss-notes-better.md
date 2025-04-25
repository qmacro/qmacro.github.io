---
layout: post
title: "Hacking the SAP service portal to make OSS notes better"
date: 2005-05-20
tags:
  - sapcommunity
  - greasemonkey
  - oss
---

Ahh, [OSS notes](http://service.sap.com/notes) - a topic close to my heart:

* [Improving the OSS note experience](/blog/posts/2003/07/30/improving-the-oss-note-experience/)
* [FOSDEM, and small OSS Notes Browser Hack](/blog/posts/2004/02/20/fosdem-and-small-oss-notes-browser-hack/)

## The OSS Notes Experience

The other day I decided to stop going on about how painful using OSS
notes on the web was, and do something about it. So I hacked up
a [Greasemonkey](http://greasemonkey.mozdev.org)
script, [OssNoteFix](/images/2005/05/ossnotefix.user.js),
that addresses the three main issues I have:

- Not having the OSS note number in the title of the page makes it hard to manage more than a couple of notes at once
- Not being able to click on a reference to a further OSS note to go straight to it
- Having my basic browsing experience messed up by the use of frames

## Enter Greasemonkey

Greasemonkey, to quote Mark Pilgrim in his very useful [Dive Into
Greasemonkey](http://diveintogreasemonkey.org) online book, "*is a
Firefox extension that allows you to write scripts that alter the web
pages you visit. You can use it to make a web site more readable or more
usable. You can fix rendering bugs that the site owner can't be
bothered to fix themselves.*". The extension doesn't do anything to
web pages by itself, it's the scripts that manipulate the pages once
they're loaded into the browser. (And yes, it's for
[Firefox](http://www.mozilla.org/products/firefox), a modern,
standards-compliant browser. If you're still using Internet Explorer,
shame on you.)

## Laying The Groundwork

But before we get to the script, let's lay a bit of groundwork that
will help smooth things along. Visit Dagfinn's weblog post [Easily
access SAP notes from Firefox](https://blogs.sap.com/?p=39931) and
follow his instructions to set up SSO access to service.sap.com, and to
create a bookmark with a custom keyword so you can access OSS notes very
simply. The SSO access avoids all those tiresome HTTP authentication
popups your browser throws at you each time the front-end machine
serving your request changes due to load balancing. The custom keyword
bookmark allows you to request OSS notes directly by typing something
like this into your address bar:

```text
note 19466
```

(You can see this in action in the screencast below.)

## Installing Greasemonkey and the OssNoteFix Script

Once you've got these set up, it's time to install Greasemonkey. Visit
the [Greasemonkey homepage](http://greasemonkey.mozdev.org)and follow
the link to install it (you might have to add the Greasemonkey site to
the list of sites allowed to install software). You'll have to restart
Firefox to have this extension take effect.

Now it's time to install the Greasemonkey script that I wrote,
"OssNoteFix". Go
to [ossnotefix.user.js](/images/2005/05/ossnotefix.user.js).
Because of the ending (.user.js), Greasemonkey recognises it and gives
you the option of installing it: Tools-\>Install User Script, see
this screenshot:

![screenshot of install](/images/2005/05/ossnotefix_install.png)

Once you've got it installed, visit an OSS note page:

```text
note 19466
```

and notice that, once it's loaded:

- the OSS note number is in the title
- the numbers of the further notes referenced are clickable
- there are no frames

Hurrah!

## Watch the Screencast

I put together a screencast which
demonstrates the creation of the OSS note bookmark, a visit to an OSS
note page before OssNoteFix, the installation of the OssNoteFix user
script, and the visit to an OSS note page after the installation. I'd
already set up the SSO before I started recording, as that would have
taken too long (and would be too boring to watch!)

![screencast](/images/2005/05/ossnotefix-demo-rescued.gif)

(Top tip: the
screencast is at 800x600, so hit F11 to get fullscreen mode in your
browser. Also, it's a 3 Meg file, so please be patient while it comes
down the pipe!).

> This is a rescued version of the demo, which was originally in Shockwave Flash (!). Some artifacts exist due to the conversion, sorry about that.

## Caveat Emptor

Of course, the usual caveats apply - it's a beta, SAP's service portal
pages are horribly complex and any change may break the script, and your
own mileage may vary, blah blah blah. Also, the script sometimes matches
5 or 6 digit numbers that aren't OSS notes. But it works for me. It was
especially useful this week as I was installing a CRM 4.0 system.

This script is free and open source software, use it as you see fit, and
if you're not happy, you can get your money back 🙂

---

[Originally published on SAP Community](https://community.sap.com/t5/additional-blogs-by-members/hacking-the-sap-service-portal-to-make-oss-notes-better/ba-p/12824615)
