---
layout: post
title: 'An HTTP connector for Tarpipe: ''tarbridge'''
tags:
- bridge
- email
- http
- smtp
- tarbridge
- tarpipe
---


One thing that Tarpipe would really benefit from is a connector that would enable an HTTP request (I’m thinking of POST, here) to be made on an arbitrary resource (URL). This is something that [other people have already mentioned](http://getsatisfaction.com/tarpipe/topics/a_rest_connector) — and the Tarpipe folks are certainly working on it.

I couldn’t wait, however, and thought I’d have a bit of fun building an HTTP connector. I don’t have access to Tarpipe’s sources, so I had to go a roundabout route. Tarpipe has a Mailer connector, which enables emails to be sent from within a workflow. So I built a very simple email-to-HTTP-POST mechanism ‘tarbridge’. This way, you can use the Mailer connector to send an email like this:

```
Recipient: tarbridge+<token>@pipetree.com
 Subject: the URL to POST to and an optional content-type
 Body: the payload of the HTTP POST
```

and an HTTP POST will be made to the URL specified. You’ll even get an email reply with the HTTP response.

Here’s an example workflow that receives an email containing something to bookmark in Delicious. It uses the Delicious connector, and also makes an HTTP POST to a little test application (running on a local devserver version of the excellent [Google AppEngine](http://code.google.com/appengine/), fwiw) via tarbridge.

![image]({{ "/img/2009/04/tarpipebridgetest1-300x134.jpg" | url }})

The Subject of the email contains the URL to make the HTTP POST to. By default the Content-Type will be set to application/x-www-form-urlencoded, but you can override this by specifying a different content type (here I’ve specified text/plain) as a second parameter in the Subject.

The addressee of the email is ‘tarbridge+<some token>@pipetree.com’. I’ve used this approach so I can control what goes through this tarbridge mechanism. A token is associated with an email address, to which the HTTP response is sent in reply.

The body of the email is what’s send as the payload in the HTTP request.

So sending this email to the Tarpipe workflow above:

From: DJ Adams <dj@pipetree.com> To: bury69xxxx@tarpipe.net Subject: http://blog.tarpipe.com Tarpipe blog

results in this Delicious entry:

![image]({{ "/img/2009/04/tarpipeblogurlondelicious-300x196.png" | url }})

and this email sent, via the Mailer connector, to the tarbridge mechanism:

```
To: tarbridge+token@pipetree.com Subject: http://www.pipetree.com:8888/feed/ text/plain From: tarpipe mailer <mailer@tarpipe.net> http://blog.tarpipe.com http://del.icio.us/url/95948a42d8777b46278d4da333345473
```

which in turn results in an HTTP POST being made like this:

```
POST /feed/ HTTP/1.1 User-Agent: tarbridge/0.1 libwww-perl/5.812 Host: www.pipetree.com:8888 Content-Type: text/plain [...] http://blog.tarpipe.com http://del.icio.us/url/95948a42d8777b46278d4da333345473
```

The result of the HTTP POST is emailed back like this:

```
Subject: Re: http://www.pipetree.com:8888/feed/ text/plain To: DJ Adams <dj.adams@pobox.com> From: tarbridge+token@pipetree.com

HTTP/1.0 201 Created Date: Fri, 24 Apr 2009 10:06:55 GMT Location: http://www.pipetree.com:8888/feed/test-feed-1/agtmZWVkYnVpbGRlc[...] [...]
```

So if you were really crazy you could even feed that response back into the Tarpipe loop, using a second workflow (hmm, Tarpipe could do with a string parsing connector too :-)

The tarbridge mechanism is just a little Perl script that’s triggered via [Procmail](http://www.procmail.org). I’m running [Ubuntu](http://www.ubuntu.com) on pipetree.com so it was just a question of configuring [Postfix](http://www.postfix.org) to use Procmail for delivery, and writing a .procmailrc rule like this:

:0 c | ~/handler.pl 2>> ~/tarbridge.log

If you’re interested in trying this out using my (pipetree) instance of this tarbridge, please email me and I’ll set you up with a token. Usual caveats apply. And remember, this is only in lieu of a real HTTP connector which I hope is coming soon from Tarpipe!
