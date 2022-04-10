---
layout: post
title: My journey to Clojure
tags:
  - language-ramblings
---
I'm learning Clojure. Slowly, but hopefully surely. Clojure is a Lisp, which I like saying, because it makes me sound as though I know what I'm talking about and that my language experience is as old as the hills. Perhaps the only thing that is valid there is that I'm old. But anyway.

Actually, one of the things about Clojure that appeals to me is that it is a Lisp. One of the books I remember buying when I was still in my early teens was [Artificial Intelligence](http://people.csail.mit.edu/phw/Books/AITABLE.HTML) by Patrick Henry Winston. I still have it, a second printing from 1979. While I didn't understand very much of it, I was somewhat mesmerised by the Lisp forms, written in all caps and with beautiful bracket symmetry. Lisp cropped up again for me a few years later, in the amazing book [Gödel, Escher, Bach](https://en.wikipedia.org/wiki/G%C3%B6del,_Escher,_Bach) by Douglas Hofstadter, and it was equally mesmerising.

So when I finally discovered Clojure, I decided to delve beneath the shimmering surface that had heretofore had me transfixed, and experience the beauty from within.

One of the recurring patterns emerging from what I read, even at that early stage, was that of "head and tail". This is alternatively known as "first and rest", or, going back to early Lisp origins, "[CAR and CDR](https://en.wikipedia.org/wiki/CAR_and_CDR)". Given a sequence, the idea is that you can get hold of the first item, and everything but the first item (the rest), as two separate addressable entities. You do something with the first item, and then repeat the process where the sequence becomes what you had just before identified as the rest.

There's something appealingly simple in this pattern, not just because it's something that we can all immediately understand, but also because there's an unspoken truth that is about the general approach of sequential data structures, and data structure processing in general. It can perhaps be summed up nicely in an epigram from [Alan Perlis](https://en.wikipedia.org/wiki/Alan_Perlis) thus:

"_It is better to have 100 functions operate on one data structure than 10 functions on 10 data structures._"
