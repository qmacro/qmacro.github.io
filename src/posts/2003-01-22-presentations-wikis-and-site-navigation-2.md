---
layout: post
title: Presentations, Wikis, and Site Navigation
---


A while ago, inspired by others, I was looking at [adding metadata](/2002/06/02/html-link-tag-for-blogroll/) to this weblog in the form of *link rel=’…’* tags that link to related resources. The classic use of such tags in weblogging is for a weblog to [point to its <acronym title="Rich Site Summary">RSS</acronym> feed](/2002/06/03/changed-link-tags/).

Cut to the present, and [Piers](http://www.piersharding.com/) and I are thinking about a joint conference presentation. While the presentation format is not in question (HTML), I’ve been wondering how I might investigate these *link rel=’…’* tags further, learn some more about wikis, and have a bit of fun in the process.

While HTML-based presentations are nice, something that has always jarred (for me) has been the presence of slide navigation links within the presentation display itself. Whether buttons, graphics, or hyperlinks, they invariably (a) get in the way and (b) can move around slightly with layout changes from page to page in the presentation.

I wanted to see if I could solve this problem.

The [MoinMoin Wiki](http://twistedmatrix.com/users/jh.twistd/moin/moin.cgi/FrontPage) (which I [use](../../../testwiki) for documenting various things) generates *link rel=’…’* tags for each page, to point to the “Front Page”, “Glossary”, “Index” and “Help” pages that are standard within that Wiki. The Wiki markup includes [processing instructions](http://twistedmatrix.com/users/jh.twistd/moin/moin.cgi/HelpOnProcessingInstructions) that start with hash symbols (#), to control things like whether section and subsection headings should be automatically numbered or not, and so on. The *name/value* style directives are known as ‘pragmas’.

![screenshot  of site navigation bar in Mozilla](/~dj/2003/01/sitenav.png)

What I did was to hack some of the MoinMoin (Python code) (a few lines added only) so that I could

- specify any ‘previous’ and ‘next’ slide pages in the markup of a page using #pragma directives
- have the Wiki automatically generate each page’s appropriate *link rel=’…’* tags for site navigation according to these new directives

That way, browsers aware of these tags (including my browser of choice, [Mozilla](http://www.mozilla.org/)), can display a useful and discreet navigation bar automatically. Problem solved!

I tweaked two MoinMoin files, [Page.py](/~dj/2003/01/Page.py.txt) and [wikiutil.py](/~dj/2003/01/wikiutil.py.txt). It might have broken something else, you never know. It’s just a little hack. Also, so that you can get a feel for what I mean, have a browse of these few [presentation demo wiki pages](../../../demowiki/ThePresentation) with your browser site navigation support turned on and/or visible. Use the EditPage feature to look at the markup source and see the #pragma directives. (Please don’t change anything, let others see it too – thanks).

So hurrah. We can build, present, and follow up on the presentation content in the rich hypertextual style that HTML and URIs afford, and collaborate on the content in the Wiki way.

On an incidental note, I’ve also added a *link rel=’start’* tag to point to the [homepage](/qmacro) of this weblog. This is made available in Mozilla as the “Top” button in the site navigation bar.


