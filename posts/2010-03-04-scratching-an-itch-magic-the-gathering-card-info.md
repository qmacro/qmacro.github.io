---
layout: post
title: Scratching an itch - Magic The Gathering card info
tags:
- appengine
- bookmarklet
- http
- joseph
- mtg
- python
- reading
---


Well over 10 years ago I bought a box set of [Magic The Gathering](http://www.magicthegathering.com) (MTG) cards. ![image]({{ "/img/2010/03/mtg-215x300.jpg" | url}}) I wasn’t really sure what they were, but they looked fascinating. Unfortunately, they gathered dust after a while, mostly because there wasn’t anyone else to play against, and I didn’t understand the rules properly anyway. Fast forward to 2009. My son [Joseph](http://www.pipetree.com/josephadams/), having discovered and dusted off the box set, taught me how to play, at at Starbucks cafe over a few hot chocolates and cappuccinos on a cold winter afternoon.

Hooked!

Since then we’ve been fans of the game of endless possibilities and ever changing scope and interest, and almost regulars at our local MTG store, [Fan Boy Three](http://www.fanboy3.co.uk) on Newton St in Manchester.

So to educate myself in all thing Magic, I turned to MTG’s official website, Wizards of the Coast’s [The Multiverse](http://www.wizards.com/Magic/Multiverse/), and in particular, to their incredibly prolific set of column authors on the [Daily MTG](http://www.wizards.com/Magic/Magazine/Default.aspx). More [articles](http://www.wizards.com/Magic/Magazine/Archive.aspx?tag=news,feature,column,event)on design, deck construction, strategy and match reports than you could shake a [Planeswalker](http://www.wizards.com/Magic/TCG/Article.aspx?x=magic/planeswalkers/week4) card at.

But while I [read a lot](http://www.sdn.sap.com/irj/scn/weblogs?blog=/pub/wlg/16597), the majority of it is on paper, in the bath, on the train, and ![image]({{ "/img/2010/03/skirkridgeexhumer-215x300.jpg" | url }}) soaking up the countless minutes lost at the start of every meeting, while you wait for people to get started, fail to get the projector working, fetch coffees or fiddle with the air conditioning. And on paper, the MTG articles are good, but for a novice like me, there’s something missing. The articles make lots of references to cards by name, and when reading online, there’s a nice popup of the card details so you can see what the author is talking about. But on paper?

So I had an itch to scratch. What I wanted was an accompanying printout of the cards mentioned in any given Daily MTG article. So when the author referred to [Hedron Crab](http://gatherer.wizards.com/Pages/Card/Details.aspx?name=Hedron%20Crab), [Baloth Woodcrasher](http://gatherer.wizards.com/Pages/Card/Details.aspx?name=Baloth%20Woodcrasher) or [Oran-Rief, the Vastwood](http://gatherer.wizards.com/Pages/Card/Details.aspx?name=Oran-Rief,%20the%20Vastwood) I would know what they were talking about.

I decided to use [Google App Engine](http://code.google.com/appengine), and have my Python HTTP responder in the cloud. I created a very simple app “mtgcardinfo”, part of my Github-hosted scratchpad area [gae-qmacro](http://github.com/qmacro/gae-qmacro). Given the URL of an MTG article, the app uses urlfetch() to go and get it, parses out the card names, and produces an HTML response with a whole load of image references. Luckily the card detail popups in the articles are powered by Javascript and are great indicators of card names for anyone who cares to wield a regex to look for them.

And of course to glue it all together, I used a [bookmarklet](http://en.wikipedia.org/wiki/Bookmarklet), so I could jump to the list of cards while directly in the article.

So if you’re interested, have a go: [http://qmacro.appspot.com/mtgcardinfo](http://qmacro.appspot.com/mtgcardinfo).

The combination of App Engine, Python, HTTP and Javascript is rapidly becoming my new Swiss Army Knife of choice in the web-based online world. And the best thing? I’m teaching Joseph this stuff, and not only is he incredibly good at it, he *loves* it!
