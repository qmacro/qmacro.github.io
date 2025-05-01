---
layout: post
title: "Terminal Tip: a CF remote monitor script"
date: 2020-05-01
tags:
  - sapcommunity
  - terminal
  - terminaltip
---
In the previous terminal tip ([remotely monitor a CF
deployment](/blog/posts/2020/04/24/terminal-tip:-remotely-monitor-a-cf-deployment/))
we saw the building blocks of how we might go about finding and then
remotely monitoring an ongoing multi-target application (MTA)
operation.

On today's [#HandsOnSAPDev](https://bit.ly/handsonsapdev) live stream,
[Ep.66](https://bit.ly/handsonsapdev#ep66), we wrote a script
`mtaopsmon` that put these building blocks together (check out the
section of [the replay starting at around
14:55](https://youtu.be/mP1iWZgNmsE?t=895)). I thought it would be worth
sharing that script here, and explaining it bit by bit.

First, let's see the script in its entirety:

```shell
#!/usr/bin/env bash

getopsid () { cf mta-ops | sed '1,3d' | head -1 | awk '{print $1}'; }                                                                   

echo -n Searching for MTA operation

mtaopid=$(getopsid)

while [[ -z ${mtaopsid} ]]
do
  echo -n .
  sleep 1
  mtaopsid=$(getopsid)
done

echo
echo MTA operation found: ${mtaopsid}

cf deploy -i ${mtaopsid} -a monitor
```

Now let's take it a step at a time.

## Step 1 - Defining a function to get an MTA operation ID

The first line looks like this:

```shell
getopsid () { cf mta-ops | sed '1,3d' | head -1 | awk '{print $1}'; }                                                                   
```

Here we're defining a function `getopsid` that contains way to try and
grab the ID of an MTA operation. This is deliberately over simplified
but works for our purposes, and is a good start.

If you consider what the output of `cf mta-ops` gives for when there's
an operation (or more than one), it looks like this:

```log
Getting active multi-target app operations in org p200135114trial / space dev as qmacro+workflowcodejam@example.com...
OK
id                                     type     mta id                  status    started at                      started by
acb3bcda-8b7b-11ea-bb72-eeee0a890182   DEPLOY   sample.onboarding.mta   RUNNING   2020-05-01T07:16:28.294Z[UTC]   qmacro+workflowcodejam@example.com
```

There's a couple of descriptive lines ("Getting \..." and "OK"),
followed by a column header line ("id \...") and then a line with the
details of an operation, where the first column is the operation's ID
("acb3\...").

If you consider what the output looks like when there are no operations,
it looks like this:

```log
Getting active multi-target app operations in org p200135114trial / space dev as qmacro+workflowcodejam@example.com...
OK
No multi-target app operations found
```

Now we know what the two possible outputs look like, we can stare at the
first line of our script and understand what `getopsid` does. It calls
`cf mta-ops`, and pipes the output into `sed '1,3d`', which will simply
delete the first three lines. Whatever then remains is either nothing
(there are only three lines when there are no MTA operations) or a list
of operation details:

```log
acb3bcda-8b7b-11ea-bb72-eeee0a890182   DEPLOY   sample.onboarding.mta   RUNNING   2020-05-01T07:16:28.294Z[UTC]   qmacro+workflowcodejam@example.com
```

To keep things simple in this case, we're just going to take the first
operation, in case there are more, and so we pipe the remaining line(s)
into `head -1` which will just give us the first line.

Finally, we pipe that line into `awk '{print $1}'` which will return
just the first "field", i.e. the operation ID ("acb3\...").

So basically, calling this function `getopsid` will return either an
operation ID, or nothing.

## Step 2 - Looping until we get an MTA operation ID

Here's the next part:

```shell
echo -n Searching for MTA operation

mtaopid=$(getopsid)

while [[ -z ${mtaopsid} ]]
do
  echo -n .
  sleep 1
  mtaopsid=$(getopsid)
done
```

After printing out "Searching for MTA operation", without a newline
(that's what the `-n` option to `echo` means), we call `getopsid` and
assign whatever it returns to the `mtaopid` variable, which will
therefore contain an ID, or nothing.

Then we loop around, as long as the `-z ${mtaopsid}` condition is true,
i.e. for as long as there's no value in the `mtaopsid` variable. Inside
the loop, we print a "." character, sleep for a second, and then call
the `getopsid` function again.

This will run therefore until we get an MTA operation ID.

## Step 3 - Attaching to and monitoring the MTA operation

Once we have an MTA operation ID, we can use the technique we learned
about in [the previous terminal
tip](https://blogs.sap.com/2020/04/24/terminal-tip-remotely-monitor-a-cf-deployment/)
to attach to an ongoing operation, and call the 'monitor' action upon
it:

```shell
echo
echo MTA operation found: ${mtaopsid}

cf deploy -i ${mtaopsid} -a monitor
```

And that's it!

Here's an example of the script in action, showing a few lines from the
log output. To take this screenshot, I started the `mtaopsmon` script
up, then switched over to the SAP Web IDE to deploy the
"sample.onboarding.mta" MTA that I'd previously built.

![](/images/2020/05/Screenshot-2020-05-01-at-09.58.19.png)

## Next steps

Of course, the function that gets the MTA operation ID is deliberately
very simple at this stage (we wrote the script together during the live
stream). Have a think about how you could improve that - what would
happen (and what would we want to do) if there were multiple operations?
Let me know your thoughts in the comments, and until next time \...

Share & enjoy, and
remember, [#TheFutureIsTerminal](https://twitter.com/search?q=%23TheFutureIsTerminal&src=typed_query)!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/terminal-tip-a-cf-remote-monitor-script/ba-p/13429781)
