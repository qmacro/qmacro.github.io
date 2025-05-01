---
layout: post
title: "Terminal Tip: remotely monitor a CF deployment"
date: 2020-04-24
tags:
  - sapcommunity
  - terminal
  - terminaltip
---
In today's [HandsOnSAPDev](https://bit.ly/handsonsapdev) live stream,
[Ep.65](http://bit.ly/handsonsapdev#ep65), we built the SAP Cloud
Platform Workflow sample application MTA in the SAP Web IDE, and
deployed it to our Cloud Foundry (CF) space from there too. We noticed
that the console logging was buffering the deployment log, so we didn't
see much during the operation:

[![](/images/2020/04/Screenshot-2020-04-24-at-14.38.26.png)](https://www.youtube.com/watch?v=ZLtwMSq0DKo)

At the time, I wondered out loud whether it was possible to remotely
monitor an operation.

Remember that the
[multiapps](https://plugins.cloudfoundry.org/#multiapps) plugin for the
`cf` command line tool gives us lots of options in relation to multi
target application (MTA) operations. A couple of example are:

-   see a summary list of active operations with the `mta-ops` command
-   download the logs of such an operation, with the
    `download-mta-op-logs` command (which is also available in the form
    of a mercifully shorter alias `dmol`)


This latter command is in the right ballpark, but doesn't allow the
live monitoring (or "tailing") of log output.

After the live stream ended, I was pondering this and had a look at the
documentation on the SAP Help Portal, specifically the [Multitarget
Application Commands for the Cloud Foundry
Environment](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/65ddb1b51a0642148c6b468a759a8a2e.html)
section. There, it describes the `-i` option to the `cf deploy` command,
which allows us to interact with active MTA operations:

```shell
cf deploy  [-i <OPERATION_ID>] [-a <ACTION>] 
```

Digging a little further, it turns out that one of the actions is
`monitor`, and indeed that's exactly what we're looking for!

So, kicking off a deployment in the SAP Web IDE gives us something in
the console that looks like what we see above in the screenshot. But we
can switch to a more comfortable terminal environment and use this
feature to monitor that very operation that we kicked off in the SAP Web
IDE.

Here's how: In the terminal, we can first find out the ID of the MTA
operation, like this:

```shell
-> cf mta-ops                                                                                                                   
Getting active multi-target app operations in org p2001351149trial / space dev as qmacro+workflowcodejam@example.com...           
OK                                                                                                                              
id                                     type     mta id                  status    started at                      started by    
f450e444-8632-11ea-abb3-eeee0a8f6ba7   DEPLOY   sample.onboarding.mta   RUNNING   2020-04-24T13:53:19.367Z[UTC]   qmacro+workflowcodejam@example.com 
```

We can then take the ID and use it like this:

```shell
-> cf deploy -i f450e444-8632-11ea-abb3-eeee0a8f6ba7 -a monitor                                   
Updating application "uiDeployer"...
Application "uiDeployer" attributes are not modified and will not be updated                      
Uploading application "uiDeployer"...
Content of application "uiDeployer" is not changed - upload will be skipped.                      
Starting application "uiDeployer"...
Application "uiDeployer" started
Deleting discontinued configuration entries for application "uiDeployer"...
Service key "onboarding-workflow-credentials" for service "workflow" already exists
Uploading content module "onboarding" in target service "workflow"...
Deploying content module "onboarding" in target service "workflow"...
Skipping deletion of services, because the command line option "--delete-services" is not specified.
Process finished.
Use "cf dmol -i f450e444-8632-11ea-abb3-eeee0a8f6ba7" to download the logs of the process.
```

I'd say that the ability to monitor ongoing MTA operations in the
terminal, regardless of where the operation was initiated, is pretty
neat. Wouldn't you?

If this has whetted your appetite, read the next post in this
collection: [Terminal Tip: a CF remote monitor
script](https://blogs.sap.com/2020/05/01/terminal-tip-a-cf-remote-monitor-script/),
which ties these things together into a neat little script.

Share & enjoy, and remember,
[TheFutureIsTerminal](https://twitter.com/search?q=%23TheFutureIsTerminal&src=typed_query)!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/terminal-tip-remotely-monitor-a-cf-deployment/ba-p/13453433)
