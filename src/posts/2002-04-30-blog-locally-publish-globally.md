---
layout: post
title: '"Blog Locally, Publish Globally"'
---


I’d been thinking of using [cvs](http://www.cvshome.org/) to help manage offline file-based blogging with Blosxom, but I recently read a couple of posts by [Marc Nozell](http://www.nozell.com/cgi/blosxom/2002/Mar/5#syncing-blog) and [Rael](http://saladwithsteve.com/osx/2002_02_01_archive.html#9710921) (to whom the title of this post is attributed) describing how they use rsync. It’s a nicer idea than using cvs, so I’ve gone for it. I made an alias, ‘blogsync’, which does this:

```
rsync -tazve ssh ~/blog/*.txt gnu:blog/
```

and stuck the alias definition into my .bashrc file Hey presto. My trusty Linux Vaio is always with me, and I can blog there wherever and whenever I wish. The ‘net cafe at London Gatwick airport was getting a bit too pricey for terminal access, but I passed it last week to discover that it now offers simple 10baseT connections for laptop users. Five quid for 40 minutes. Still steep, but perhaps worth it for the odd time I absolutely desperately *must* sync up.


