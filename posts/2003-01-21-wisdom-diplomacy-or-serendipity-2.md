---
layout: post
title: Wisdom, diplomacy, or serendipity?
---


[allconsuming.net](http://allconsuming.net/) has a [SOAP interface](http://allconsuming.net/news/000012.html). Nice and easy to call and use.

But for those (including me) who (also) have a [REST](http://internet.conveyor.com/RESTwiki/moin.cgi/FrontPage "The REST Wiki's front page") bent, there is also a tip-o’-the-hat style flavour that has interesting possibilities. The (readonly) methods are also available as URLs like this:

[http://allconsuming.net/soap-client.cgi?hourly=1](http://allconsuming.net/soap-client.cgi?hourly=1)

or

[http://allconsuming.net/soap-client.cgi?friends=1&url=//qmacro.org/about](http://allconsuming.net/soap-client.cgi?friends=1&url=//qmacro.org/about)

where the methods are “GetHourlyList()” (hourly=1) and “GetFriends()” (friends=1) respectively.

While the actual data returned in the message body is clearly [Data::Dumper](http://www.perldoc.com/perl5.6/lib/Data/Dumper.html)ed output of the data structure that would be returned in the SOAP response, a slight change on the server side to produce the data in ‘original’ XML form would be very useful indeed for pipeline-style applications, perhaps.

[Erik](http://erikbenson.com/) is using these URLs to show readers examples of response output. But I bet the potential diplomacy wasn’t lost on him.


