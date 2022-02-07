---
layout: post
title: Controlling Chrome from the CLI
tags:
  - autodidactics
  - chrome
  - shell
---

_Here's how I used the chrome-cli tool to help me open up URLs in different tabs in a new Chrome window. From the command line._

In analysing various GitHub issues and pull requests recently, I needed to be able to open up a number of them in my browser, one in each tab. The GitHub issue and pull request URLs are determined from a script, and I wanted to be able to open up a new Chrome window on the screen with all of the URLs loaded.

I came across the excellent [chrome-cli][chrome-cli] tool a while back but didn't have a pressing need to use it at the time. You can control Chrome and its derivatives from the command line; the help output gives you an idea of what's possible - here's an excerpt from it:

```
chrome-cli list windows  (List all windows)
chrome-cli list tabs  (List all tabs)
chrome-cli list tabs -w <id>  (List tabs in specific window)
chrome-cli list links  (List all tabs' link)
chrome-cli list links -w <id>  (List tabs' link in specific window)
chrome-cli info  (Print info for active tab)
chrome-cli info -t <id>  (Print info for specific tab)
chrome-cli open <url>  (Open url in new tab)
chrome-cli open <url> -n  (Open url in new window)
chrome-cli open <url> -i  (Open url in new incognito window)
chrome-cli open <url> -t <id>  (Open url in specific tab)
chrome-cli open <url> -w <id>  (Open url in new tab in specific window)
chrome-cli close  (Close active tab)
chrome-cli close -w  (Close active window)
chrome-cli close -t <id>  (Close specific tab)
chrome-cli close -w <id>  (Close specific window)
...
```

Anyway, this GitHub issue and pull request analysis was the perfect opportunity to try it out for real. The analysis script I have spits out GitHub issue and pull request URLs based on a filter, so I wrote a script to take these URLs, one per line, and open them up in tabs in a new Chrome window.

I specifically wanted a new Chrome window, rather than have the tabs open in any existing window, and I had to do a bit of jiggery pokery to get the desired effect - you'll see this in the script (if anyone has a better suggestion please let me know).

Here's the script I wrote, quick and dirty, but it works, and sometimes, like this time, it's all that's needed.

```bash
#!/usr/bin/env bash

set -o errexit

# Create a new Chrome window, then read in a list of URLs and open each
# one in a new tab in that Chrome window. Quick and dirty, but it works.
#
# To get a new window and its ID - open an empty placeholder URL in a
# new window, this returns the ID of the new tab (not window); the
# window ID is one less than the ID of the new tab (potentially brittle,
# but meh).

declare windowid tabid url

# Open new window with placeholder tab
tabid="$(chrome-cli open about:blank -n | awk '/^Id:/ { print $2 }')"
windowid="$((tabid - 1))"

# Open URLs in new tabs of that new window
while read -r url; do
  chrome-cli open "$url" -w "$windowid"
done

# Close the tab containing the original placeholder URL
chrome-cli close -t "$tabid"
```

I open the `about:blank` page in a new Chrome window (`chrome-cli open about:blank -n`) - this is to bring about the creation of the new window itself. What's returned from this however is the ID of the new tab, which is one more than the ID of the new window. Once I've opened up the URLs, I can then close the `about:blank` tab as I don't need it.

Here it is in action (with some test URLs):

![the script in action]({{ "/img/2021/12/open-urls-in-chrome.gif" | url}})

And that's about it. Definitely worth giving [chrome-cli][chrome-cli] a whirl!



[chrome-cli]: https://github.com/prasmussen/chrome-cli
