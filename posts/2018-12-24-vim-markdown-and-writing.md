---
layout: post
title: Vim, Markdown and writing
---

Having got my personal space on the Web in order with some [housekeeping](/2018/12/24/housekeeping) this weekend, I can now turn my attention to my workflow and tools, where I intend to rebuild some skills in core technologies. To that end, I'm writing more in Markdown, and have re-embraced Vim as my editor of choice for many things.

The availability of Linux on my OS of choice (Chrome OS), in the form of [Crostini](https://www.reddit.com/r/Crostini/), and the immediacy of the Linux terminal, where I feel most at home, has given me the chance I've been looking for to properly learn stuff I've only scraped by with in the past, and to mix old & new techniques. I'm blogging using [GitHub Pages](//pages.github.com) which means Markdown and Jekyll, synchronising content between my local machine(s) and the cloud using git repositories. I'm using Vim to write, and am especially enjoying some of the plugins I'm trying out, in particular this zen-like writing mode that the lovely combination of [Goyo](https://github.com/junegunn/goyo.vim) and [Limelight](https://github.com/junegunn/limelight.vim) offers.

![Goyo and Limelight in action]( {{ "/img/2018/12/goyo-limelight.png" | url }})

I've started rebuilding my Vim setup from scratch, based on the work of some great folks out there, including the author of many Vim plugins [Tim Pope](https://tpo.pe/) and someone with a great setup and approach, [Luke Smith](//lukesmith.xyz). I've started to share my Vim setup in my [dotvim](//github.com/qmacro/dotvim) repository on Github.

I'll talk about the contents of that repository in another post sometime ... for now, I wanted to mention a script I wrote to help me quickly start writing posts. It's called `newpost.js` and lives in a `scripts` folder in my `$PATH`. I can invoke it like this:

```
> newpost.js Vim, Markdown and writing
```

and it will create a new file with the right name:
```
2018-12-24-vim-markdown-and-writing.markdown
```
in the right place (the `_posts/` directory of the local version of my [blog repository](//github.com/qmacro/qmacro.github.io)), containing basic frontmatter that looks like this:

```
---
layout: post
title: Vim, Markdown and writing
---
```

It will then open up the file in Vim so that I can start writing immediately.

I can imagine further refinements to this script, but I realised I wouldn't be able to get to any refinements until I created a first version and started using it. So I did. I've shared the [script](https://github.com/qmacro/scripts/blob/master/newpost.js) in a new [scripts repository](//github.com/qmacro/scripts).

It's working well for me so far, but I want to explore further the relationship between a Node.js based script and the underlying shell environment. I'm already [spawning a Vim process](https://github.com/qmacro/scripts/blob/d72a7df54a9bfbb65984b766dac19aa12b5da11c/newpost.js#L81-L90) to edit the file, directly from the Node.js process:

```javascript
cp.spawn('vim', [
	'-c',
	'+normal G',
	fullname
], {
	stdio: 'inherit'
})
```
Perhaps next will be some interaction via environmental variables. We'll see!
