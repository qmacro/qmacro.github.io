---
layout: post
title: "#YRS2013 Hacks on Github"
tags:
- git
- github
- hacks
- json
- opensource
- yrs2013
---


Well we’re in the midst of the [Young Rewired State Festival Of Code](https://youngrewiredstate.org/static/festival-of-code.html) weekend here at the Custard Factory in Birmingham and one of the amazing by-products of all the hacking is the power of Open Source and the awareness and use of [Github](http://github.com) — the latter is largely down to great work by [Ashley Williams](http://heyashleyashley.com) and others this week, running git and Github workshops for the kids during the week in various centres, including ours ([MadLab](http://madlab.org.uk)).

### Github Commit Data

Anyway, I was curious and so put together a spreadsheet tracking [all of the 2013 hacks](http://hacks.youngrewiredstate.org/events/YRS2013) that had declared a Github repo in their information pages. [You can see](http://www.pipetree.com/~dj/2013/08/yrs2013/commits.html) that there are a massive number of kids not only hacking code but sharing it with the world:

<div class="wp-caption alignnone" id="attachment_1533" style="width: 510px">![image]({{ "/img/2013/08/hacks.png" | url }})#YRS2013 Hacks on Github

</div>(see the interactive graph here: [http://www.pipetree.com/~dj/2013/08/yrs2013/commits.html](http://www.pipetree.com/~dj/2013/08/yrs2013/commits.html))

I wrote some [Google Apps Script](https://developers.google.com/apps-script/) to poll the [Github API](http://developer.github.com/v3/), pulling commit info, and writing it to a Google spreadsheet.

### Visualise It Yourself

I’ve also made the data available as JSON (again, using the power of a little Google Apps Script), as I know that you can do a lot better than me visually. The data is here:

[http://bit.ly/YRS2013HacksOnGithub](http://bit.ly/YRS2013HacksOnGithub)

so please be my guest and put some more visualisations together. Let’s see who can come up with the nicest representation this weekend.

### Source Code

The Google Apps Script source code that I used for this is available via a couple of gists on Github:

[https://gist.github.com/qmacro/6199968](https://gist.github.com/qmacro/6199968) – retrieve and store commit counts

[https://gist.github.com/qmacro/6199973](https://gist.github.com/qmacro/6199973) – expose a sheet as JSON

 

Share & Enjoy!

 


