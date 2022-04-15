---
layout: post
title: A classic example of yak shaving, and some stream editing
tags:
  - shell
  - yak-shaving
  - sed
---
It's not often that I'm relaxed enough to be aware of how my mind is (or isn't) working, and what it's doing. So it was a surprise when I realised that what I've been doing for the past 15 minutes is descending through multiple levels into some classic yak shaving territory.
<!--excerpt-->

## Level 1

I thought I'd write about another Exercism community solution that caught my eye this morning. So I went to my blog repository locally, and thought:

> Actually, what I need is an updated version of my old script that sets up a new blog post file, so I can streamline the authoring of a new post.

I've recently moved to [11ty](https://www.11ty.dev/) and it's a decent static site generator; it has introduced a slightly new structure, and I'm happy with it so far, but it means I need a slightly different workflow to create a new blog post file.

Anyway, this thought should have been an early warning sign, but I sort of ignored it.

## Level 2

Then, in thinking about what I'd want this script to do, I started to think about what input I'd give it. Initially just the blog post title, perhaps, but then:

> What about tags, and how would I specify them? Why don't I choose them from a list? But then how would I determine that list?

The tags in any given post are declared in the frontmatter; here's the frontmatter for the previous post [Bash notes 2](2022-04-10-bash-notes-2):

```
---
layout: post
title: Bash notes 2
tags:
  - shell
  - til
  - exercism
---
```

I had the idea of pulling out all the tags from all the Markdown files that represented posts. But how would I do that? I quickly descended to the next level down in my yak shaving journey.

## Level 3

I could simply look through each of the files for any line that started with a couple of spaces, had a dash, and then a word. But I couldn't be sure that this approach wouldn't be too eager, and match blog post body content that wasn't tag related. So I thought it best to match those lines where `tags:` preceded them.

I had an inkling that something like multiline matching with `grep` might help, or even `sed`. There was a related question on Stack Overflow to which [this answer](https://stackoverflow.com/a/2686369/384366) seemed as intriguing as it was concise:

```bash
sed -e '/abc/,/efg/!d' [file-with-content]
```

The first iteration of translating this into my requirements, and trying it out on the blog post files for this year so far, looks like this:

```bash
sed -e '/^tags:/,/---/!d' 2022-*
```

This gave me the following output:

```
tags:
  - sap-community
---
tags:
  - jq
  - learning
  - bats
  - shell
  - exercism
---
tags:
  - cloudfoundry
  - kubernetes
---
tags:
  - jq
  - functional
  - javascript
---
tags:
  - shell
  - til
  - exercism
---
tags:
  - shell
  - til
  - exercism
---
tags:
  - shell
---
tags:
  - shell
  - til
  - exercism
---
```

A second iteration, adding a second instruction `/^  - /!d` to search within the results for just the tag lines, looks like this:

```bash
sed -e '/^tags:/,/---/!d; /^  - /!d' 2022-*
```

And this gave me (output reduced for brevity):

```
  - sap-community
  - jq
  - learning
  - bats
  - shell
  - exercism
  - cloudfoundry
  - kubernetes
  - jq
  - functional
  - javascript
  - shell
  - til
  - exercism
  - shell
  - til
  - exercism
  - shell
  - shell
  ...
```

So there are two more tasks here - to reduce each line to just the tag name (i.e. to remove the bullet point and spaces) and to deduplicate the list.

As we're already in `sed` mode, the first of these reductions might as well be a third instruction, specifically `s/  - //`, like this:

```bash
sed -e '/^tags:/,/---/!d; /^  - /!d; s/^  - //' 2022-*
```

This results in:

```
sap-community
jq
learning
bats
shell
exercism
cloudfoundry
kubernetes
jq
functional
javascript
shell
til
exercism
shell
til
exercism
shell
shell
...
```

And while we could turn to `uniq` to deduplicate the list, we'll have to sort it first anyway, so we might as well use the `-u` option to `sort`:

```bash
sed -e '/^tags:/,/---/!d; /^  - /!d; s/^  - //' 2022-* | sort -u
```

This gives us what we want, a nice clean, unique list of tags:

```
bats
cloudfoundry
exercism
functional
javascript
jq
kubernetes
learning
sap-community
shell
til
```

I can now use this with [fzf](https://github.com/junegunn/fzf) and its multi select mode to give me the option of choosing one or more tags:

```bash
sed -e '/^tags:/,/---/!d; /^  - /!d; s/^  - //' 2022-* | sort -u | fzf -m
```

This gives me a nice interface like this:

```
> til
  shell
  sap-community
  learning
  kubernetes
  jq
  javascript
 >functional
 >exercism
  cloudfoundry
 >bats
  11/11 (3)
```

(Here, I've selected the three tags `functional`, `exercism` and `bats`, and my selection cursor is currently pointing to `til`.)

## Level 4

Great, I can now get on with putting the script together. I'll also need a way to specify a new tag if it's not in the list, but I'll deal with that when I get to it.

But I'm not done with my descent yet. I'm not really sure exactly what the `!d` part in the first `sed` instruction is, and how it works. So at this point I send the [sed manual](https://www.gnu.org/software/sed/manual/sed.html) to my trusty Nexus 9 tablet, and head off to make a cup of coffee to enjoy while reading and learning more about this venerable stream editor that's been around [for almost half a century](https://en.wikipedia.org/wiki/Sed#History).

I'm further away than ever from writing that post about the Exercism community solution I'd seen, but that's all fine. Yak shaving doesn't feel so bad when you're aware of when you're doing it.
