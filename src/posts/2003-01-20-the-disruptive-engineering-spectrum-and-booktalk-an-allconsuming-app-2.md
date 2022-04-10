---
layout: post
title: The disruptive engineering spectrum, and "booktalk", an AllConsuming app
tags:
- allconsuming
- rss-tag
- soap
- xml
---


At one end of the spectrum, along which building blocks for future cooperative web applications lie, we have the library software vendors who were unwitting participants in a great web service experiment “[LibraryLookup](http://weblog.infoworld.com/udell/stories/2002/12/11/librarylookup.html)” built and described by [Jon](http://weblog.infoworld.com/udell) in a recent [InfoWorld column](http://staging.infoworld.com/articles/ap/xml/03/01/06/030106apapps.xml?template=/storypages/printfriendly.html). While I’m sure everything is fine now, I don’t think their initial reaction to their participation was favourable. Fair enough.

At the other end of the spectrum, enter [Erik Benson](http://erikbenson.com/) and his creation [allconsuming.net](http://allconsuming.net/), a very interesting site which builds a representation of the collective literary consciousness of the weblogging community by scanning weblog RSS feeds for mentions of books (Amazon and other URLs, specifically ISBN/ASINs) and collating excerpts from those weblog posts with data from other web sources such as Amazon and Google. Add to that the ability to sign up and create your own lists of books (currently reading, favourites, and so on) and you have a fine web resource for aiding and abetting your bookworm tendencies.

A fine web resource not only for humans, but as a software service too. In constructing [allconsuming.net](http://allconsuming.net/), Erik has deliberately left software hooks and information bait dangling from the site, ready for us to connect and consume. Moreover, he [encourages ](http://www.allconsuming.net/news/000027.html#000027) us to do so, telling us to “Use [his] [XML](http://allconsuming.net/xml/)” and try out his [SOAP interface](http://allconsuming.net/news/000012.html).

So I did.

While [allconsuming.net](http://allconsuming.net/) can send you book reading recommendations (by email) based on what your friends are reading and commenting about, I thought it might be useful to be able to read any comments that were made on books that you had in your collection. *“I’ve got book X. Let me know when someone says something about book X”*.

So I whipped up a little script, [booktalk](/~dj/2003/01/booktalk), which indeed uses [allconsuming.net](http://allconsuming.net/)‘s hooks to build a new service. What [booktalk](/~dj/2003/01/booktalk) does, crontabbed on an hourly basis, is to grab a user’s [currently reading](http://allconsuming.net/soap-client.cgi?currently_reading=1&username=avalon) and [favourite books](http://allconsuming.net/soap-client.cgi?favorite_books=1&username=qmacro) lists and then look at the [hourly list](http://allconsuming.net/soap-client.cgi?hourly=1) of latest books mentioned. Any intersections are pushed onto the top of a list of items in an <acronym title="RDF Site Summary">RSS</acronym> file, which represents a sort of [‘commentary alert’ feed](../../../%7Edj/booktalk_avalon.xml) for that user and his books. It goes without saying that the point of this is so that the user can easily monitor new comments on books in his collection by subscribing to that feed, which, aggregated by [Blagg](http://www.oreillynet.com/%7Erael/lang/perl/blagg) and rendered by [Blosxom](http://www.raelity.org/apps/blosxom), would look [something like this](/cgi-bin/blosxom/booktalk).

Of course, the usual caveats apply – it’s experimental, and works for me, your mileage may vary.


