---
layout: post
title: Transferring my Amazon wishlist to AllConsuming.net
---


Now that I can [monitor comments about books I have in my AllConsuming collection](/undefined/), I thought it would be nice to add those books in my [Amazon wishlist](http://www.amazon.co.uk/exec/obidos/wishlist/3G7VX6N7NMGWM/) to that AllConsuming collection so that I could see what people were saying about the books I wanted to buy.

So I hacked up a few scripts, and here are the results.

*Getting my wishlist*

Using [Simon Wistow](http://www.twoshortplanks.com/simon/)‘s very useful [WWW::Amazon::Wishlist](http://search.cpan.org/author/SIMONW/WWW-Amazon-Wishlist-0.85/), it was a cinch to grab details of the books on my [wishlist](http://www.amazon.co.uk/exec/obidos/wishlist/3G7VX6N7NMGWM/). (I had to [patch](/~dj/2003/01/Wishlist.pm.diff.txt) the module very slightly because of a problem with the user agent string not being set).

The script I wrote, [wishlist](/~dj/2003/01/wishlist), simply outputs a list of ISBN/ASINs and title/author details, like this:

[dj@cicero scraps]$ ./wishlist 0751327824 The Forgotten Arts and Crafts by John Seymour 090498205X With Ammon Wrigley in Saddleworth by Sam Seville 0672322404 Mod_perl Developer's Cookbook by Geoffrey Young, et al 0465024750 Fluid Concepts and Creative Analogies: Computer Models of ... 0765304368 Down and Out in the Magic Kingdom by Cory Doctorow ...

*Interacting with AllConsuming*

While I’m sure the [allconsuming.net](http://allconsuming.net/) site and services are going to morph as services are added and changed, I nevertheless couldn’t reist writing a very simple Perl class, [Allconsuming::Agent](/~dj/2003/01/Agent.pm) that allows you to log in (*logIn()*) and add books to your collection (*addToFavouriteBooks()*, *addToCurrentlyReading()*). It’s very basic but does the job for now. It tries to play nice by logging you out (*logOut()*) of the site automatically when you’ve finished. It can also tell if the site knows about a certain book (*knowsBook()*) – I think AllConsuming uses [amazon.com](http://www.amazon.com/) to look books up and so the discrepancies between that and [www.amazon.co.uk](http://www.amazon.co.uk/), for example, show themselves as AllConsuming’s innocent blankness with certain ISBNs.

Anyway, I’m prepared for the eventuality that things will change at [allconsuming.net](http://allconsuming.net/) sooner or later, so this class won’t work forever…but it’s fine for now.

*Adding my wishlisted books*

So putting this all together, I wrote a driver script, [acadd](/~dj/2003/01/acadd), which grabs my current reading list data from AllConsuming, and reads in a list of ISBN/ASINs that would be typically produced from a script like [wishlist](/~dj/2003/01/wishlist).

Reading through the wishlist book data, [acadd](/~dj/2003/01/acadd) does this:

- checks to make sure the book isn’t in my AllConsuming collection already
- checks that AllConsuming knows about the book
- adds the book to my collection at AllConsuming

Here’s a snippet of what actually happened when I piped the output of the one script into the other:

[dj@cicero scraps]$ ./wishlist | ./acadd 0751327824 The Forgotten Arts and Crafts by John Se... [UNKNOWN] 090498205X With Ammon Wrigley in Saddleworth by Sam... [UNKNOWN] 0672322404 Mod_perl Developer's Cookbook by Geoffre... [HAVE] 0465024750 Fluid Concepts and Creative Analogies: C... [HAVE] 0765304368 Down and Out in the Magic Kingdom by Cor... [ADDED OK] ...

Woo! [Cory’s new book](http://allconsuming.net/item.cgi?isbn=0765304368), appearing on my [Amazon wishlist](http://www.amazon.co.uk/exec/obidos/wishlist/3G7VX6N7NMGWM/), was added to my [allconsuming.net](http://allconsuming.net/) collection. (In case you’re wondering, I am only adding books like this to ‘Currently Reading’, rather than any other collection category, temporarily, as right now only the books in this category along with the ‘Favourites’ category can be retrieved with the [SOAP API](http://allconsuming.net/news/000012.html) – and it’s upon this API that [booktalk](/~dj/2003/01/booktalk) relies.)

Anyway, it’s late, time for bed, driving to Brussels early tomorrow morning. Mmmm. Belgian beer beckons!


