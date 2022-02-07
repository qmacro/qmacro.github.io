---
layout: post
title: Reducing writing friction
---
_I've created a simple script for myself to reduce writing friction._

I saw [a tweet from Simon Willison](https://twitter.com/simonw/status/1304117739083059200) earlier this week pointing to Matt Webb's [15 rules for blogging, and my current streak](http://interconnected.org/home/2020/09/10/streak). I decided that I would also like to try to write more, and one of the things getting in my way was the slight friction in starting a new post. I use GitHub Pages and Jekyll behind the scenes, and my posts are in Markdown, one file per post (I like the simplicity of this, it reminds me of Rael Dornfest's [Blosxom](https://www.google.com/search?q=site%3Aqmacro.org+blosxom)).

So running the risk of being accused of a small amount of yak shaving, I wrote a very basic script (with Simon's "perfect is the enemy of shipped" in my head) that I could use to start a new post quickly and [pushed it to my dotfiles repo](https://github.com/qmacro/dotfiles/commit/e609d80ed4c768a5236e976bce9b69a18fd01b04).

The script is [newpost](https://github.com/qmacro/dotfiles/blob/master/scripts/newpost) and is very basic, having taken me less than 10 mins to write.
That's sort of the point. I may refine it as I go on, in fact I probably will; not least because the function that generates a filename from a post title is very basic indeed, but also because I would like to perhaps create a new tmux session for editing and running Jekyll locally for test rendering. But it's good enough for now, and in fact I kicked off this post using it, by typing:

```
> newpost reducing writing friction
```

whereupon I landed in Vim with this in the file, all ready:

```
---
layout: post
title: Reducing writing friction
---
```

That'll do for now!

Incidentally, I'm already on a small path to writing more, having adopted Simon's [Today I Learned](https://til.simonwillison.net/) (TIL) mini-post approach. I've written a few TIL posts on this blog recently and I feel very freed by the constraints.

**Update 2020-10-08** I've moved these posts to a new blog [autodidactics](https://qmacro.org/autodidactics/) - see [A new learning source for shell scripting](https://qmacro.org/2020/10/03/a-new-learning-source-for-shell-scripting/) for the background.
