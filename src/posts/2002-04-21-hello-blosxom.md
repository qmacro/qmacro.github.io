---
layout: post
title: Hello Blosxom
---


Well, after having a [look](http://www.pipetree.com/testwiki/Peerkat) at [Peerkat](http://www.oreillynet.com/%7Erael/lang/python/peerkat), from the pen of that maven [Rael Dornfest](http://www.oreillynet.com/%7Erael), I turned my attention to his [Blosxom](http://www.oreillynet.com/%7Erael/lang/perl/blosxom) project, a beautifully simple weblog mechanism that celebrates the power of the \*nix shell, tools, and simple files. It’s just up my street, and I’m a definite convert. Nice one, Rael.

I grabbed the latest version, 0+3i, and hacked in a bit of support for simple lists, such as you see on the right hand side of this page. Just as you write blog entries by editing .txt files, where the first line in the file becomes the entry’s title, so you create lists by editing .list files, where the first line in the file becomes the heading for the list. You include a list in your template by including the list’s name in square brackets, like this: [listname].

Because lists are just files, you can generate them in lots of ways. The Google search list on the right was created using a slightly modified version of [Matt Webb’s](http://interconnected.org/home/) [GoogleSearch.pl](http://interconnected.org/home/more/GoogleSearch.pl.txt) script. I’ll probably cron the script to search Google every hour. See – powering Blosxom with standard tools like cron. Lovely.


