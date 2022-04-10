---
layout: post
title: Changed link tags
---


Following Dan Brickley’s point about the RSS <link/> mime-type, and [Ben](http://rss.benhammersley.com/archives/000065.html#000065)‘s and [Mark](http://diveintomark.org/archives/2002/06/02.html#important_change_to_the_link_tag)‘s notes, I’ve made the required changes to the attribute contents for the pointer to this weblog’s [RSS feed](/qmacro/xml).

Furthermore, regarding the [other](http://cicero/qmacro/2002/Jun/2#blogrollfinder_link) <link/> tag I have in this document, pointing to the [RSS feed list](/~dj/rss.rss) (for which I’d specified a *rel* value of “*feeds*“), I’ve had a quick shufty at the [allowed values](http://www.w3.org/TR/html401/types.html#type-links) for the *rel* attribute of the <link/> tag. While “*feeds*” isn’t explicitly there, and “*help*” is the closest fit from the choices given, I’ve nevertheless decided to keep the link type “*feeds*“, and qualify that definition with a meta data profile. Just to see where this leads.

This is what I interpreted from the [W3C](http://www.w3c.org/) HTML specs:

1. There is a provision, following the definition of the explicitly [allowed values](http://www.w3.org/TR/html401/types.html#type-links), to define new link types for the *rel* attribute:  
> “Authors may wish to define additional link types not described in this specification. If they do so, they should use a profile to cite the conventions used to define the link types.”
2. You can do this by providing the location a meta data profile in a *profile* attribute of the HTML document’s <head/> tag.
3. According to the [explanation](http://www.w3.org/TR/html401/struct/global.html#profiles) of the meta data profiles, these locations are URIs, which can be globally unique names, or actual links to be followed.
4. Unfortunately, the specification doesn’t go so far as to actually define what the format of such a meta data profile is:  
> [“This specification does not define formats for profiles.”](http://www.w3.org/TR/html401/struct/global.html#profiles)

(If anyone can show me a pointer to where profile formats are described, that would be great!)
5. So I’ve decided to go for a simple URI, “qmacro:weblog”, for now, on the basis of this statement:  
> “User agents may be able to recognize the name (without actually retrieving the profile) and perform some activity based on known conventions for that profile.”

This is what it now looks like:

<head profile="qmacro:weblog"> ... <link rel="feeds" type="application/rss+xml" title="RSS feeds" href="http://www.pipetree.com/~dj/rss.rss" /> ...

I might be barking totally up the wrong tree, but that’s the price of fun experimentation. I think the only thing that needs to be different is the actual URI – if we can agree on a standard global name, so much the better.


