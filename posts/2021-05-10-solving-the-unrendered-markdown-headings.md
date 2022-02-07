---
layout: post
title: Solving mysterious unrendered markdown headings
tags:
  - markdown
---

_I finally spent some time getting to the bottom of why some headings in my markdown content weren't getting rendered properly._

I've noticed over the years that occasionally the rendered version of my markdown content, in particular on GitHub (which is where most of my markdown content ends up), sometimes contains unrendered headings. Here's [an example](https://github.com/qmacro-org/test/blob/d6f348858dd5014d8b96060e4b8dd75999af431b/README.md):

![Rendered markdown showing an unrendered heading - on GitHub]({{ "/img/2021/05/unrendered-heading-github.png" | url }})

The second level 2 heading "Another heading level 2" remains unrendered, even though everything looks fine. Why? This has bugged me for a while, but not so much as to make me stop and work out why it was happening. When it happened, I'd just go into the markdown source, rewrite the heading line, and all was fine.

Today I finally stopped to spend a bit of time to look into it. Turns out it's quite simple and obvious now I know what was causing it.

The [basic syntax](https://www.markdownguide.org/basic-syntax/) for headings involves one or more hashes (depending on the heading level needed) followed by the heading text. There's a space that should separate the hashes and the heading text. Here's an example:

```markdown
## Heading level 2
```

What's causing that heading above not to be rendered properly? Well, it's the space. To you and me there is indeed a space between `##` and `Another heading level 2`.

But it's [the wrong type of space](https://en.wikipedia.org/wiki/The_wrong_type_of_snow).

Checking first that it's not something weird going on with the markdown renderer on GitHub, let's try a different rendering, in the terminal, with the excellent [glow](https://github.com/charmbracelet/glow) tool:

![Rendered markdown showing an unrendered heading - using glow]({{ "/img/2021/05/unrendered-heading-glow.png" | url }})

Same issue.

So let's dig in a little deeper, and look at the source.

First, let's look at the first level 2 heading, which has been rendered correctly:

```
# ~/Projects/gh/github.com/qmacro-org/test (main=)
; grep 'Heading level 2' README.md | od -t x1 -c
0000000    23  23  20  48  65  61  64  69  6e  67  20  6c  65  76  65  6c
           #   #       H   e   a   d   i   n   g       l   e   v   e   l
0000020    20  32  0a
               2  \n
0000023
# ~/Projects/gh/github.com/qmacro-org/test (main=)
;
```

Seems OK, and yes, there's the space, hex value `20`, following the two hashes (hex values `23`).

Now let's look at the second level 2 heading, which has not been correctly rendered;

```
# ~/Projects/gh/github.com/qmacro-org/test (main=)
; grep 'Another heading level 2' README.md | od -t x1 -c
0000000    23  23  c2  a0  41  6e  6f  74  68  65  72  20  68  65  61  64
           #   # 302 240   A   n   o   t   h   e   r       h   e   a   d
0000020    69  6e  67  20  6c  65  76  65  6c  20  32  0a
           i   n   g       l   e   v   e   l       2  \n
0000034
# ~/Projects/gh/github.com/qmacro-org/test (main=)
;
```

What the heck is that following the two hex `23` hash characters?

```
0000000    23  23  c2  a0
           #   # 302 240
```

Turns out it's a [non-breaking space](https://en.wikipedia.org/wiki/Non-breaking_space) character. And its UTF-8 [encoding](https://en.wikipedia.org/wiki/Non-breaking_space#Encodings), which is what the markdown file has, is `c2 a0`.

So this second level 2 heading cannot be rendered as such, as the markdown cannot be recognised. Makes sense!

But where are these non-breaking space coming from? How do they get there?

Well, my daily driver during the working week is a macOS device, where it's notoriously more difficult that it should be to type a `#` character. One has to use `Option-3` (or `Alt-3`) to get it. And it turns out that after holding down `Option` to hit `3` a couple of times to introduce the `##` for a level 2 heading, my thumb is sometimes still on the `Option` key when I hit `space`.

And guess what - `Option-space` is how you type a non-breaking space on macOS!

So basically it's **me** that's been causing this issue - by inadvertently inserting not a space but a non-breaking space after the `#` characters introducing markdown headings.
