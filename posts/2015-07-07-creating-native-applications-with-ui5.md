---
layout: post
title: Creating Native Applications with UI5
tags:
- openui5
- phonegap
- phonegapbuild
- sapui5
- ui5
- 30ui5
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) – Day 4 by [John Murray](http://jmurray.me/)**

![PhoneGap:Build logo]( {{ "/img/2018/01/download.jpeg" | url }})

Whilst web apps are great, and suit the vast majority of situations perfectly, sometimes they just don’t quite cut the mustard. It is in these situations that we are presented with a difficult choice, do we take option A – Sacrifice the features which are specific to native applications for the sake of sticking with UI5 and the benefits that web apps bring? Or do we go with option B – Sacrifice UI5 and the web app benefits, instead going with native code, but then have access to all the features? Well, even in the not-so-distant past we would have to weigh up the pros and cons of each option and make our decision accordingly.

More recently, we were provided with an option C – Use [PhoneGap](http://phonegap.com/) to make our application like a web app, using UI5 and an assortment of plugins to achieve our ends. However, this option was not without its own challenges and problems; you had to install libraries for all platforms you wished to build for, then structure everything in a rather precise manner, and to top it all off you then had to battle with the rather clunky command line interface. This did of course improve over time and after you had your setup and work flow down to a tee, but it was never smooth sailing. Thankfully though, we now have an option D!

Option D is [PhoneGap Build](https://build.phonegap.com), a service which takes everything that is great about standard PhoneGap and then removes everything that is bad about it, providing a fast and streamlined experience. This service is freely available, and will allow you to have a native version of your UI5 app up and running within minutes.

As an overview, you create your UI5 application as you would normally, except this time you also include a *config.xml* file in the root folder. It is this file which the Build service uses to create your application, you simply specify the location of your *index.html* file and reference any plugins you wish to use. You then zip up all of your code and upload it to their website, and it will automatically build a native app for Android, iOS and Windows Phone in a matter of minutes.

For more a more thorough getting started guide on all of this, I am currently writing an in depth blog series on my own website, the first part of which can be found here – [UI5 and PhoneGap Build: First Steps](http://jmurray.me/ui5-and-phonegap-first-steps-1-of-3/).


