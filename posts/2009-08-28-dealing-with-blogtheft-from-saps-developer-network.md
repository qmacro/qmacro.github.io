---
layout: post
title: Dealing with "#blogtheft" from SAP's Developer Network
tags:
- apache
- blogtheft
- modrewrite
- sap
- sdn
---


Recently it has [come to people’s attention](http://search.twitter.com/search?q=%23blogtheft) that there is a website www.sap-abap4.com out there with a lot of very interesting content … which seems to have been *completely* “lifted” from the [SAP Developer Network](http://www.sdn.sap.com) (SDN) and reproduced verbatim, except that in each case the original author name has been removed!

Lots of discussion is taking place how best to deal with this. One way (and I’m posting it as a blog entry as much for my memory’s sake as anything else) is to conditionally rewrite requests for images. I’m using Apache and therefore the [mod_rewrite](http://httpd.apache.org/docs/2.0/mod/mod_rewrite.html) extension is my tool of choice.

It just so happens that there are a couple of screenshots in a recent SDN blog entry of mine “[A return to the SDN community, and a touch of Javascript](https://blogs.sap.com/2009/05/27/a-return-to-the-sdn-community-and-a-touch-of-javascript/)” and these images are hosted on my own server.

So as a little test, I can control the requests for these images, rewriting those requests so that a different image is served depending on the request’s referrer — the URL of the page that the images are referenced on with an `<img />` tag.

So with some mod_rewrite voodoo in a local `.htaccess` file:

```
RewriteEngine On
RewriteCond %{HTTP_REFERER} ^http://www.sap-abap4.com
RewriteBase /qmacro/x
RewriteRule ^SdnPageTitle(Fixed|Broken)_small.jpg$ StolenContent.png [L]
```

I can send a `StolenContent.png` image, if the referrer is from the rogue site.

The result of the rewrite is that when viewed on SDN, the blog entry looks fine, and the screenshot images look as they’re supposed to:

![Images appear as they're supposed to]( {{ "/img/2009/08/screenshot-sdn3.jpg" | url }})

But when the images are used on www.sap-abap4.com, they will appears differently:

![Image appears differently]( {{ "/img/2009/08/screenshot-sap-abap41.jpg" | url }})

So there you have it. It’s not a complete solution to the problem by any means, but it at least will alert unsuspecting readers of that website to what's happening (if you’re testing yourself, you might have to refresh the pages in your browser, as it will probably have cached the first version of each image). Perhaps the SAP community network team can apply this technique for the images hosted on SDN.


