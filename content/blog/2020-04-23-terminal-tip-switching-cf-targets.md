---
title: "Terminal Tip: switching CF targets"
date: 2020-04-23
tags:
  - sapcommunity
  - terminal
  - terminaltip
---
Working with Cloud Foundry (CF) from the command line, I use the `cf`
CLI a lot. As you perhaps may know already, due to the use of Multi
Target Applications (multiapps, or MTAs) in the SAP Cloud Platform CF
environment, there's a [plugin
system](https://plugins.cloudfoundry.org/) for `cf` - with the most
popular plugin for us being the
[multiapps](https://plugins.cloudfoundry.org/#multiapps) plugin for
managing MTAs.

Another plugin, introduced to me recently by my friend and colleague
Max Streifeneder, is the [targets](https://plugins.cloudfoundry.org/#Targets)
plugin, for managing CF targets (which API endpoints you have and which
one do you want to be connected to with `cf` at any particular point). I
use the commands provided by this plugin (`targets`, `save-target`,
`delete-target` and `set-target`) often, but I also like choosing my
target from a list, so I can see what I'm connected to currently, and
what I want to switch to.

(If you're interested to learn more about this plugin, check out Max's
excellent video: [Cloud Foundry CLI Plugin -
Targets](https://www.youtube.com/watch?v=rIhuxEYfvHo&index=1)).

Here's a typical manual flow, where I check what I'm currently
connected to with `cf targets` and then select a new target with
`cf set-target`:

![](/images/2020/04/Screenshot-2020-04-23-at-12.17.50.png)

To make life a little more pleasant, I use the excellent command line
fuzzy finder [fzf](https://github.com/junegunn/fzf). If you've not
discovered this little gem, I'd recommend you head on over, check it
out, and install it. If you're a follower of the [Hands-on SAP
Dev](https://bit.ly/handsonsapdev) live streams it's likely that
you've seen it in action in various places along the way.

In its basic form, `fzf` takes whatever it's given via STDIN, and
presents it in a selection. You can then use various methods to narrow
down your search through the selection and choose something, at which
point `fzf` will then simply output that selection to STDOUT. This is a
classic example of the Unix philosophy of tools doing one thing and
doing it well, and also conforming to the simple but powerful concepts
of pipelining and standard input & output.

Anyway, I decided to use `fzf` to enhance the flow above, so that I'm
simply presented with a list of targets for me to choose from. I wrote a
very short script, that looks like this:

```shell
#!/usr/bin/env bash

target=$(cf targets | fzf --height=25% | cut -d ' ' -f 1) 
  && [ ! -z ${target} ] 
  && cf set-target -f ${target} 
  && cf target
```

Breaking it down into its component parts, we have the following:

```shell
target=$(cf targets | fzf --height=25% | cut -d ' ' -f 1) 
```

This calls `cf targets`, which will produce that list of targets
available, including highlighting the currently selected target with
"(current)" as we saw earlier. It then pipes that into `fzf`, which
will present me with those options in a short (25% of the height of the
current terminal) list to choose from, using fuzzy searching or simply
using the up and down arrow keys.

Then, once I've selected an entry, `cut` is used to take just the first
word from the line selected (this is important in the case where
"(current)" is added to the line) and then the result is saved into
the `target` variable.

Then we have this:

```shell
&& [ ! -z ${target} ] 
```


which just makes sure that we've actually selected something (and not
aborted with \^C or something like that).

If we do have something selected, then this next part kicks in:

```shell
&& cf set-target -f ${target} 
```


which uses the actual `cf set-target` command to set the API endpoint to
the appropriately selected target.

Finally, to give me some information on the newly set target, I run the
standard `cf target` command (not to be confused with `cf targets`😞

```shell
&& cf target
```

This will show details of the target currently set.

And that's it!

I've saved this script to a location in my path, and called it `cft`
(for 'cf target') and now I can view and select CF targets in
comfort!

Here's `cft` in action, where the current target is 'workflowcodejam'
and I want to switch to 'garage':

![](/images/2020/04/Screenshot-2020-04-23-at-12.14.58.png)

![](/images/2020/04/Screenshot-2020-04-27-at-16.55.18.png)

Share & enjoy, and remember,
[#TheFutureIsTerminal](https://twitter.com/search?q=%23TheFutureIsTerminal&src=typed_query)!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/terminal-tip-switching-cf-targets/ba-p/13450867)
