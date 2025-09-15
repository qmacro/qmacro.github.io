---
title: "Monday morning thoughts: debugging approach and Greasemonkey revival"
date: 2018-04-23
tags:
  - sapcommunity
---

In the [inaugural
episode](https://blogs.sap.com/2018/04/11/announcing-the-unofficial-and-unnamed-sap-community-podcast/)
of the new Community Podcast we touched on how
interesting it can be to find out about other people's programming
setups, even down to the actual screens and keyboards they use. I enjoy
learning about how others work, what tools they use, what thinking or
approaches they take in debugging, and yes - even what screens they use
and how happy they are with them.

I'm sure I'm not alone in this regard; moreover, I know there's a
wealth of untapped, innate knowledge and implicit ability inside all of
you that would be great to share. So I thought I'd contribute by giving
a little insight into some small approaches and methods I find myself
using. Nothing earth shattering, but I think that's also the point. I
personally would love to see from others the equivalent of what I've
just recorded - I know I'd be the richer for it.

The [recording](https://www.youtube.com/watch?v=Sf21TlN17Mg)
is just over 20 mins, and it's pretty much unscripted,
which is sort of the point - I didn't want to prepare anything, so you
get a real sense of the workflow (lowercase "w") rather than something
polished and less real.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Sf21TlN17Mg?si=OA6VHKtaazpsrq2W" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

During the recording, I mentioned
[Greasemonkey](https://en.wikipedia.org/wiki/Greasemonkey), which was a
wonderful tool that allowed one to write JavaScript to be automatically
executed when certain pages were loaded; that JavaScript could then
manipulate the pages to suit your needs. I note that the Greasemonkey
spirit is still alive and well in the context of, for example, Chrome
Extensions such as
[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en).

I used Greasemonkey back in 2005 to improve the OSS Note experience -
you can read about it in this post "[Hacking the SAP service portal to
make OSS notes
better](/blog/posts/2005/05/20/hacking-the-sap-service-portal-to-make-oss-notes-better/)".

So I wanted to leave you with two thoughts for this week:

-   seeing others' development and debugging workflow can be of great
    benefit - getting inside the programming heads of your friends and
    colleagues and seeing their preferences and approaches can be not
    only educational but also fun
-   the introspective and manipulative power that's baked into UI5
    gives us all sorts of possibilities; the Greasemonkey style approach
    is by definition (and design) ephemeral, but I think that is one of
    its charms - nobody is claiming that the "solutions" will work
    long term, but there are plenty of situations where a quick
    temporary fix, or a scratched itch, is exactly what's needed to get
    the job done.


Do you have some programming or debugging workflow to share? What tools
do you use? What does your desktop and working environment look like?
Let us know in the comments below.

 

p.s. For those that are interested, here's the final version of the
JavaScript I put in my bookmarklet:

```javascript
javascript: (function() {
    opl = sap.ui.getCore().byId("application-bpmworkflowmonitor-DisplayInstances-component---InstancesDetailView--ObjectPageLayout")
       || sap.ui.getCore().byId("application-bpmworkflowmonitor-DisplayDefinitions-component---InstancesDetailView--ObjectPageLayout");
    opl.insertSection(opl.removeSection(3), 1);
})();
```

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-debugging-approach-and-greasemonkey-revival/ba-p/13384813)
