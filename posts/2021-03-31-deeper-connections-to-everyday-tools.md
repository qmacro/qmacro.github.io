---
layout: post
title: Deeper connections to everyday tools
tags:
  - tools
  - thoughts
  - coffee
---

_With some things, ignorance is not bliss. There are entire features of the tools I use every day that I know little about, and I want to change that._

Something mildly profound emerged from the combination two recent activities:

* eBay sales of items I've not used in a while
* maintenance of my La Pavoni coffee machine

The [successful maintenance](https://qmacro.org/2021/03/27/la-pavoni-maintenance-successful/) of that beautifully designed manual lever espresso machine did take a while, but during it I guess I formed a deeper relationship with the device, built upon the existing connection I had already from the constant enjoyment & challenge of getting everything aligned to pull a decent shot.

And the items I sold (SONOS speakers, an old Macbook Pro) are items I've not really had any relationship with at all. Yes, I used the speakers, but not every day, and since SONOS's [meltdown](https://www.fastcompany.com/90454672/this-is-disgusting-angry-sonos-customers-are-calling-for-a-boycott) last year an active distancing and dislike has grown between me and the devices.

What was profound was that the lack of relationship I had with the stuff I just sold on eBay actually amplified the deep relationship I feel with the La Pavoni.

**Tools I use often in the kitchen**

I'd been thinking about tools I use often, since [noticing how worn my hand milk frother was recently](https://twitter.com/qmacro/status/1374655713331544065).

<img src="/content/images/2021/03/milkfrother.jpeg" alt="Worn milk frother" width="200" height="138"/>

I've had that milk frother for about 10 years. I've had a moka pot for about that long too - originally one from Bialetti, which I eventually replaced with one from IKEA (which is surprisingly excellent).

<img src="/content/images/2021/03/mokapot.png" alt="IKEA RÅDIG moka pot" width="147" height="155"/>

And I've had the La Pavoni Professional Lusso for almost 2 years.

<img src="/content/images/2021/03/lapavoni.jpeg" alt="La Pavoni and espresso cup" width="300" height="400"/>

Give or take, I've used each of these items **every single day** since I've had them. Often more than once per day. (In case you're wondering, I make M's latte with the moka pot and froth the milk manually, as that's how she prefers it, and I make my espresso with the La Pavoni).

These are just examples of course, but they're very visceral because I use all of them with my hands and what they produce is also consumed by me and M.

There's something special about tools like this. The bond, the attachment, the relationship that builds is more something than nothing. Anyway, before I get too philosophical, I'll get to the other half of this post, which is about tools I use at work.

**Tools I use often at work**

I like the command line. Give me a terminal over a GUI any day. The command line is a rich and powerful environment because of the expressive nature and the closeness you feel to the things you're trying to do (or manipulate).

That power comes from the combination of two things, the shell, and the commands available to you in your path (for more on the shell, see [Waiting for jobs, and the concept of the shell](https://qmacro.org/autodidactics/2020/12/28/waiting-for-jobs/)).

Without thinking too hard, here's a list of commands, of tools, that I use in the context of the shell, every single day:

* `vim` (editor)
* `tmux` (terminal multiplexer)
* `curl` (HTTP client)
* `fzf` (fuzzy finder)
* `jq` (JSON processor)

(One could say that the combination of `vim`, `tmux` and the shell is my IDE.)

Of course, I use other commands too, and many Bash shell builtins & features, but I'd say these are tools that I find essential.

**More learning required**

As well as being daily drivers, regardless of the task at hand, what else do these tools have in common?

Well, to be honest - there's still much that I don't know about them.

In many ways, one could argue that these tools represent the zenith of achievement in their area:

* there are few editors as powerful or accomplished as `vim`
* `tmux` is the de facto standard for managing terminal sessions
* `curl` is possibly the most popular HTTP client mechanism out there, in command line tool form as well as in library form
* someone [said this](https://lobste.rs/s/nsfdaw/improving_shell_workflows_with_fzf#c_2um216) about `fzf` recently, and I tend to agree: "_I don’t think any other single cli tool has ever had such a big and positive impact on my workflow than fzf has, it’s really a great piece of work_".
* while there are other great options such as `fx`, it's `jq` that everyone turns to, to handle JSON data on the command line

So while at least the La Pavoni machine has moving parts, it's still a block of stone compared to these tools, which all have such rich and varied features.

Here are a few example of what I've only recently discovered, or perhaps uncovered, with these tools.

* I managed to write some Vimscript to call [`shfmt`](https://github.com/mvdan/sh) to pretty-print my shell scripts on save
* I [worked out](https://qmacro.org/autodidactics/2021/04/01/new-tmux-panes-and-windows-in-right-dir/) how to get `tmux` to open a new window or pane in the same directory as I was when I invoked the open command
* Having read [Improving shell workflows with fzf](https://seb.jambor.dev/posts/improving-shell-workflows-with-fzf/) I learned about how to configure my own previews
* I remembered (I'd forgotten) that I can use `--data-urlencode` to have values automatically URL encoded with `curl`
* I'm only just now starting to feel comfortable enough to embrace `jq` as a complete language, with my [first script with function definitions](https://github.com/qmacro/dotfiles/blob/master/scripts/dwr#L21-L38)

As those lovely folks that join my live stream sessions\* know - I'm not afraid of admitting that "I've no idea what I'm doing".

\*I live stream usually weekly on Friday mornings UK time - look for the Hands-on SAP Dev episodes on the [SAP Developers](https://www.youtube.com/channel/UCNfmelKDrvRmjYwSi9yvrMg) YouTube channel.

At the beginning of last year, along with other folks in the [SAP Community](https://community.sap.com), I wrote up [my learning list for 2020](https://blogs.sap.com/2020/01/12/my-learning-list-for-2020/). In it, I had a section titled "Understanding core things better", and while that contained the kernel of the idea that I want to improve my understanding of fundamental things, I think I missed the mark somewhat. I failed to spot the tools that were right in front of me (or my fingers).

So I guess this is a reminder for me that I'm nowhere near done. That's fine, continuous learning is a thing, and as it is for many others, it's my thing.

Triggered by some mundane moments recently (eBay activities, gasket maintenance, the wearing thin of a simple wooden handle), I've come to realise what I need to do. And that is far from mundane. It won't be a short process -- I think mastery of these tools will only come over years -- but the journey will enjoyable and rich from the outset.
