---
layout: post
title: REST, Google, and idempotency
---


Sam has [asked](http://radio.weblogs.com/0101679/2002/09/02.html#a784) Mark Baker a question, or rather, presented an apparent conundrum. It was a pleasant subject to ponder as I was rolling out the pastry for some apple and blackberry pies, and on returning to the keyboard, I’ve decided to put some of my own thoughts down on Sam’s points, even though I’m still learning about all this stuff.

*Point #1: ‘GETs must not have side effects’ is perhaps REST’s most cherished axiom*

If I had to pick one as being the most cherished, I’d go for the one that says that anything that’s important is a first class URI citizen (i.e. addressable by a URI). The ‘no side effects’ axiom appears to be ‘just’ a natural follow on from the presentation of how the HTTP verbs are supposed to be understood and used.

*Point #2: The 1001st call to Google is different, and [so] the [GET] query is not idempotent*

In the SOAP context, a SOAP Fault will be returned by Google if you exceed your limit of 1000 calls in a day. Returning a SOAP Fault within the context of an HTTP 200 OK status is one thing. But percolating this response up to a REST (i.e. HTTP) context would imply returning, say, an HTTP 403 FORBIDDEN, with a body explaining why. This is a valid response to a GET.Having different results, different status codes, returned on a GET query doesn’t necessarily imply any side effects. Indeed, in our beloved canonical stock-quote example, we don’t even need to regard the HTTP status codes to see that results can be different on the same GET query (the stock market would be a very dull place if they weren’t). And what about Google itself? The same search query one day will not necessarily return the same results the next day. Different query results, no implied side-effects.

*Point #3: So, what do you do?*

Nothing different. Through REST-tinted spectacles, the 1001th GET receives a 403, and you act accordingly. No lives have been lost, no state has been changed. Potentatus idem manet. As the saying goes. Well. It does now.

Of course, these are just my thoughts. Apologies to Sam if I’ve misunderstood his points, and to Mark if I’ve potentially muddied the waters.

P.S. maybe I should have used ‘potestas’…

P.P.S. I’m a grey, not a black-and-white, person


