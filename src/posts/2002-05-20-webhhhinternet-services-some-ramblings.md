---
layout: post
title: '"Web^H^H^HInternet Services"? Some Ramblings.'
---


I’ve been pondering the term “Web Services”. While I completely understand and agree with all the reasonings behind the term (the ‘original’ services were accessible via web clients, HTTP is the underlying and ubiquitous transport, blah blah blah), I’m wondering whether “Web Services” is the best term to use.

While the current rush of implementations use HTTP as the transport (witness HTTP as the most common transport for [SOAP RPC](http://www.w3.org/TR/SOAP/#_Toc478383532), or HTTP as the designated transport in the [XML-RPC specification]()), there are apparent pitfalls.

Firstly, look at the steam generated from the SOAP-through-firewalls debate. (On the one hand they have a point, on the other hand, it’s not necessarily up to a firewall to vet at the application level – look at EDI for example). Secondly, [some people](http://zdnet.com.com/2100-1105-845220.html) are of the opinion that HTTP needs to be replaced, in the light of its apparent weaknesses for the things that people want to use it for these days. If this happens, will we change the ‘Web Services’ name?

Secondly, focusing on HTTP (and therefore the ‘Web’ in ‘Web Services’) does a, err, disservice to other protocols careening around the ‘net. What about the venerable SMTP, for example? There has been valid comments made about the applicability of HTTP in ‘increasingly asynchronous’ transactions. Fire off a request for some information, say, a quotation, and the response may take days to come back. Is this legal, moral, sensible, in HTTP?. Ok, you could frame the asynchronicity in HTTP by using two request/responses (one pair in one direction and the other in the other direction: “I want a quotation, post it here when you’re ready with it” -> “Ok, will do” … “Hey, here’s the quotation” -> “Ooh, thanks”). (Hmmm, why do I think of RESTful things when mulling this over in my head?) You could of course go for one-way messages suspended in a SOAP solution to achieve the same effect, I guess. Hmmm, so many options, so little time.

Anyway, as an alternative to HTTP, how about transporting this stuff over other protocols, like the aforementioned SMTP (or a combination of SMTP and whatever endpoint protocol – POP, IMAP, and so on – you need). Or even [Jabber](../../../jabber/jrpc/)! Both lend themselves to asynchronous interaction more than HTTP does. Or so it seems to me. Both involve to a greater or lesser degree some modicum of store-n-forward, allowing the endpoints to talk at their leisure.

Of course, this is all very high level, and based, as usual, on my ignorance of detail. But I often prefer to wonder about things rather than to know straight away which is right and which is wrong. And here, just like in the REST vs SOAP RPC debate, I don’t think there *is* a definitive right and wrong way. Horses for courses.

**Postscript**

I wrote the above at 30000 feet (or however high it was) above the English channel. Now that I’m on good old terra firma, travelling in a rickety South Central train from Victoria Station, I’ve had another thought. Revisiting the [REST](http://internet.conveyor.com/RESTwiki/moin.cgi/) architectural style *in extremis* (what’s all this Latin doing here?) in the context of what I wrote above (ha, in both senses of the word) would be a good mental exercise and a focused way of finding out more about how it works. From what I understand, the URI is exalted as a holy pointer, being in many respects the blessed reference mechanism to the business objects that are exchanged in service provision and consumption.

I think I’ll stop now before this prose goes completely off the scale; suffice it to say that instead of the service returning a quotation, as a payload XML document in the body of the return email, it plonks it somewhere where it can be retrieved by HTTP, and sends a little notification with the URL instead.

Hmm, lots of things to think about…


