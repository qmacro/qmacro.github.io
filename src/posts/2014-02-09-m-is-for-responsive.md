---
layout: post
title: M is for 'responsive'
date: 2014-02-09
tags:
  - bluefinsolutions
---

Even if you count the well-meant but ultimately misguided initial attempt at pre-smartphone mobile interactivity, in the form of WAP and WML, the rise of mobile focused activity has been nothing short of inexorable.

What was the cause of WAP and WML's failure? For many, it was that the application protocol (WAP) and markup language (WML) were custom designed for specific target devices. Mobile phones. Mobile phones turned into smartphones, Edge turned into 3G; essentially, the device in our pocket became a pretty well-connected small computer.

Now, I've nothing against applications that are written and delivered for specific platforms such as the current iOS, Android, Blackberry and FirefoxOS (I saw the latter in evidence at [FOSDEM](https://archive.fosdem.org/2014/), the Free and Open-Source Developers' European Meetup in Brussels last weekend). But it does occur to me that this is, in a way, hedging your bets and doubling (at least) your development efforts. Of course, you may have guessed by now that what I'm thinking of is HTML5. The Web. Browsers on our smartphones, whether native or embedded within a hybrid container such as Cordova (née PhoneGap) are extremely capable and in many ways the same as what we have on our other, larger devices - tablets and desktops.

And indeed there's the thing that brings us back to the title of this post, and the word 'responsive'. What do all the platforms (smartphone, tablet, desktop) have in common? You can build an app, once, and have it run on all these platforms, where it will reform itself: User interface (UI) elements being rearranged, wide columnar displays collapsing into more appropriate structures, and touch-related navigation mechanisms appearing or disappearing. How do you do that? You build for the Web. Yes, capital 'W'. It's that important, and always has been. Build for the Web, use modern techniques so that your application looks, feels and works 'just right' regardless of the form factor of the device you users happen to be accessing it upon.

Guess what? That's exactly what SAP is doing with SAP Fiori. In large-scale efforts to renew the User Experience (UX) of the backend business suite functionality, SAP has adopted this very approach. Run a SAP Fiori app on a smartphone, on a tablet, on your desktop, and you will see what I mean. Moreover, build your own Fiori apps, and as long as you follow certain design and technical guidelines - which the SAP Fiori app developers inside SAP have been following - your apps will respond the same too.

Look under the hood of the SAP Fiori apps and you'll see the UI engine that is powering it all: [SAPUI5](/blog/posts/2012/08/07/sapui5-the-future-direction-of-sap-ui-development/). SAPUI5 is a large toolkit that contains, amongst other things, a number of control libraries, one of which is 'sap.m'. The 'm' originally stood for mobile, but it stands for a whole lot more in reality. This 'sap.m' library contains the UI controls, the building blocks, from which the SAP Fiori apps are built. And these controls are all designed and written from the ground up to be responsive. So that they 'do the right thing' on whatever platform you use them.

So consider taking a leaf out of SAP's book when thinking about your mobile strategy. Don't think 'mobile', think 'responsive'.

---


[Originally published on the Bluefin Solutions website](https://web.archive.org/web/20180227043417/http://www.bluefinsolutions.com/insights/dj-adams/february-2014/m-is-for-responsive)
