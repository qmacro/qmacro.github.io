---
title: "Scripting Cloud Foundry activities in trial"
date: 2020-01-28
tags:
  - sapcommunity
  - shell
  - cloudfoundry
  - businessrules
  - mainframes
---
*In this post I share a simple script that I use to recreate my Business
Rules environment in the Cloud Foundry environment of my SAP Cloud
Platform trial account. Scripting and the CLI in general is very
powerful in today's "new mainframe" era.*

It's no secret that I feel that
we're in the era of the new mainframe (it never really went away) and
the power of the command line and terminal based user interfaces are
more relevant and powerful than ever (yes,
[#TheFutureIsTerminal](https://twitter.com/search?q=%23TheFutureIsTerminal&src=typed_query)!).

Scripting is a much misunderstood discipline, and is a whole universe of
languages, techniques, and contexts. But it's worth putting yourself on
the learning path here, because it can be incredibly useful even for
small tasks.

While preparing and researching for content for the recent episodes of
my [#HandsOnSAPDev live stream series](https://bit.ly/handsonsapdev),
particularly in the area of exploring the Business Rules service in the
Cloud Foundry environment on the SAP Cloud Platform (see in particular
the annotated links for episodes
[44](https://blogs.sap.com/2019/11/26/annotated-links-episode-44-of-hands-on-sap-dev-with-qmacro/)
and
[48](https://blogs.sap.com/2020/01/02/annotated-links-episode-48-of-hands-on-sap-dev-with-qmacro/)),
I decided to write a short script to help me recreate the Business Rules
service and Editor facility \... I often clean out my environment, and
sometimes even recreate my Cloud Foundry organisation and spaces, to
clear cruft ready for the next live stream episode.

It was so easy to write, I thought I'd share it, and perhaps encourage
you to stare at it for a few minutes over a coffee to see how it works.
It's very specific, and does what I want it to do (there's no smarts
in there, but I have written it to be re-runnable).

Here it is, warts and all:

```shell
#!/bin/bash

# Prerequisites:
# - Cloud Foundry trial account on SAP Cloud Platform with 
#   entitlement for Business Rules service and application runtime
# - Build tool 'mbt' installed globally
# - cf CLI installed with the 'multiapps' plugin installed
# - cf CLI already authenticated against the CF endpoint

# Recommended:
# - Role collection containing RuleRepositorySuperUser and
#   RuleRuntimeSuperUser assigned tothe trial account user


# Show current CF target
echo Deploying to:
cf target

# Create an instance of the service, with the free 'lite' service plan, called businessrules
# (reason for the name is because that's how it's referred to in the mta.yaml to come). If the
# service instance 'businessrules' already exists it won't be re-created.
cf create-service business-rules lite businessrules

# Download the project containing the multi target application descriptor for the rules editor
# (see https://bit.ly/handsonsapdev#ep44 for background).
rm -rf archive.zip editor/
curl -o archive.zip -s https://raw.githubusercontent.com/SAP-samples/cloud-businessrules-samples/master/cf-apps/cf-businessruleseditor.zip
unzip -q -d editor ./archive.zip

# Kick off the build - this should produce an archive in mta_archives/ directory.
cd editor/
mbt build

# Deploy the archive
cf deploy mta_archives/businessruleseditor_0.0.1.mtar
```

Here's a brief description of each of the sections:

I use the `cf target` command to show the current Cloud Foundry target
that my cf CLI tools is pointing to.

With the `cf create-service` command I create an instance of the
'business-rules' service, using the 'lite' service plan. Note that
if an instance with this name exists already, another won't be
created.

I grab the archive containing the `mta.yaml` file that describes the
Business Rules Editor multi target application (it's [available on
GitHub](https://github.com/SAP-samples/cloud-businessrules-samples/)),
and then unzip it into a new directory `editor/`.

Before deploying this Editor it needs to be built, so that's next -
within the `editor/` directory I use the [SAP Cloud MTA Build
Tool](https://sap.github.io/cloud-mta-build-tool/) `mbt` to do this.

The result of a successful build is that an `mtar` archive file will
be created in a new directory `mta_archives/` - this archive file
contains everything that should be pushed up to the Cloud Foundry
environment, and I do this with the `cf deploy` command.

That's pretty much it - it works very well for me, doing 80% of what I
need, for 20% of the effort (I spent around 15 mins writing it).

In case you're interested, here's some sample output, so you can get a
feel for how it runs.

```shell
qmacro@penguin:~/local/projects/github.com/qmacro/handsonsapdev/episodes/ep51
-> ./rules.bash
Deploying to:
api endpoint:   https://api.cf.eu10.hana.ondemand.com
api version:    2.144.0
user:           dj.adams
org:            I347491trial_qmacrosubdomain
space:          dev
Creating service instance businessrules in org I347491trial_qmacrosubdomain / space dev as dj.adams@sap.com...
OK

Service businessrules already exists
[2020-01-28 12:09:52]  INFO Cloud MTA Build Tool version 1.0.8
[2020-01-28 12:09:52]  INFO generating the "Makefile_20200128120952.mta" file...
[2020-01-28 12:09:52]  INFO done
[2020-01-28 12:09:52]  INFO executing the "make -f Makefile_20200128120952.mta p=cf mtar= strict=true mode=" command...
[2020-01-28 12:09:52]  INFO validating the MTA project
[2020-01-28 12:09:52]  INFO validating the MTA project
[2020-01-28 12:09:52]  INFO building the "businessruleseditor_appRouter" module...
[2020-01-28 12:09:52]  INFO executing the "npm install --production" command...
.....npm WARN deprecated scmp@1.0.0: scmp v2 uses improved core crypto comparison since Node v6.6.0
.....
> @sap/node-jwt@1.6.5 install /home/qmacro/local/projects/github.com/qmacro/handsonsapdev/episodes/ep51/editor/businessruleseditor_appRouter/node_modules/@sap/node-jwt
> node ./build.js

`linux-x64-v8-6.8` exists; testing
Binary is fine; exiting
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN html5-apps-approuter@ No repository field.
npm WARN html5-apps-approuter@ No license field.

added 236 packages from 133 contributors and audited 407 packages in 10.319s
found 5 high severity vulnerabilities
  run `npm audit fix` to fix them, or `npm audit` for details
[2020-01-28 12:10:03]  INFO the build results of the "businessruleseditor_appRouter" modulewill be packed and saved in the "/home/qmacro/local/projects/github.com/qmacro/handsonsapdev/episodes/ep51/editor/.editor_mta_build_tmp/businessruleseditor_appRouter" folder
[2020-01-28 12:10:04]  INFO finished building the "businessruleseditor_appRouter" module
[2020-01-28 12:10:04]  INFO generating the metadata...
[2020-01-28 12:10:04]  INFO generating the MTA archive...
[2020-01-28 12:10:05]  INFO the MTA archive generated at: /home/qmacro/local/projects/github.com/qmacro/handsonsapdev/episodes/ep51/editor/mta_archives/businessruleseditor_0.0.1.mtar
[2020-01-28 12:10:05]  INFO cleaning temporary files...
Deploying multi-target app archive mta_archives/businessruleseditor_0.0.1.mtar in org I347491trial_qmacrosubdomain / space dev as dj.adams@sap.com...

Uploading 1 files...
  /home/qmacro/local/projects/github.com/qmacro/handsonsapdev/episodes/ep51/editor/mta_archives/businessruleseditor_0.0.1.mtar
OK
Deploying in org "I347491trial_qmacrosubdomain" and space "dev"
Detected MTA schema version: "3"
Detected deployed MTA with ID "businessruleseditor" and version "0.0.1"
Detected new MTA version: "0.0.1"
Deployed MTA version: "0.0.1"
Processing service "businessruleseditor_html5_repo_runtime"...
Processing service "businessrules_uaa"...
Updating service "businessrules_uaa"...
Updating application "businessruleseditor_appRouter"...
Application "businessruleseditor_appRouter" attributes are not modified and will not be updated
Uploading application "businessruleseditor_appRouter"...
Stopping application "businessruleseditor_appRouter"...
Staging application "businessruleseditor_appRouter"...
Application "businessruleseditor_appRouter" staged
Starting application "businessruleseditor_appRouter"...
Application "businessruleseditor_appRouter" started and available at "i347491trial-qmacrosubdomain-dev-businessruleseditor-approuter.cfapps.eu10.hana.ondemand.com"
Deleting discontinued configuration entries for application "businessruleseditor_appRouter"...
Skipping deletion of services, because the command line option "--delete-services" is not specified.
Process finished.
Use "cf dmol -i 25e31dd8-41c7-11ea-a559-eeee0a8615fb" to download the logs of the process.
```

This results in what I'm looking for, which is the Business Rules
Editor application and the service instances that support it - all
described by the `mta.yaml` file mentioned earlier.

![](/images/2020/01/Screenshot-2020-01-28-at-12.23.47.png)

![](/images/2020/01/Screenshot-2020-01-28-at-12.23.37.png)

What have you automated with simple scripts? Let us know in the comments
below. And happy scripting!

For more thoughts on mainframes today, see the following posts:

* [Monday morning thoughts: mainframes and message
documentation](/blog/posts/2018/08/06/monday-morning-thoughts:-mainframes-and-message-documentation/)
* [Monday morning thoughts: upload / download in a cloud native
world](/blog/posts/2018/04/16/monday-morning-thoughts:-upload-download-in-a-cloud-native-world/)
* [Mainframes and the cloud - everything old is new
again](/blog/posts/2009/09/09/mainframes-and-the-cloud-everything-old-is-new-again/)

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/scripting-cloud-foundry-activities-in-trial/ba-p/13438137)
