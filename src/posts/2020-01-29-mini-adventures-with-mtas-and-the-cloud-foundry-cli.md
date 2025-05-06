---
layout: post
title: "Mini adventures with MTAs and the Cloud Foundry CLI"
date: 2020-01-29
tags:
  - sapcommunity
  - cloudfoundry
  - cli
  - businessrules
  - cf
  - mtar
  - awk
  - onlyfoolsandhorses
---
*A few more small adventures using the cf command line client, as well
as some shell pipeline goodness and that nifty tip from Marius Obert
about radically reducing the size of your deployment archive.*

Further to my blog post yesterday on [scripting Cloud Foundry
activities](/blog/posts/2020/01/28/scripting-cloud-foundry-activities-in-trial/)
I extended my experiments into using the `cf` command line interface
(CLI) tool to quickly remove the Business Rules Editor app and
supporting services.

Along the way I tweaked a couple of existing command pipelines to
display the lists of services and apps on Cloud Foundry (CF), and tried
out Marius Obert's [great
tip](https://twitter.com/IObert_/status/1220321066029142018) on reducing
the size of your deployment archive.

<a name="tldr"></a>
## TL;DR

If you're like me, and want (in the immortal words of Boycie in the
Only Fools And Horses episode "Chain Gang") to "[let the dog see
the rabbit](https://www.youtube.com/watch?v=WcrsW8CAC5s)" to see what
this is all about, you can watch this little Asciinema recording of what
I describe in the rest of this post.

[![](https://asciinema.org/a/296532.svg)](https://asciinema.org/a/296532)

Still around and want the nitty-gritty? Read on!

## The app and supporting services

The Business Rules Editor runs in a space in my CF org connected to my
SAP Cloud Platform (SCP) trial subaccount. There's the app itself
(which is actually just an approuter fronting the actual editor app
artifacts) named `businessruleseditor_appRouter`.

This app is bound to service instances, thus:

-   an instance of the 'business-rules' service called
    `businessrules` that I created shortly after re-creating my SCP
    subaccount and CF org and space
-   an instance of the 'xsuaa' service called `businessrules_uaa`
-   an instance of the 'html5-apps-repo' service (to serve the actual
    app artifacts) called `businessruleseditor_html5_repo_runtime`


## Checking the running app and services

At the start, the app is running, along with the bound services. I check
this with the `cf` command line client, combined with a bit of shell
pipeline to massage the output. The output from `cf` is relatively
messy and [harder than it should be to
parse](https://github.com/cloudfoundry/cli/issues/604#issuecomment-562571995)
(yes, there's the `cf curl` approach but that's a sledgehammer
solution to a problem that should be addressed with better text-based
output), so I have to pass it through some classic Unix command line
tools to get what I want.

For parsing and displaying service information, I have a small shell
script `service_status`, which looks like this:

```shell
cf s
| sed '/^OK$/d'
| awk 'NR>3 { printf "%s ", $1; $1=$2=$3=$NF=""; printf "\n%s\n\n", $0 }'
| awk '{$1=$1};1'
```

This runs the 'cf s' command to retrieve the service information. The
output from 'cf s' looks like this:

```shell
Getting services in org I347491trial_qmacrosubdomain / space dev as dj.adams@sap.com...

name                                     service           plan          bound apps                      last operation     broker                                                       upgrade available
businessrules                            business-rules    lite          businessruleseditor_appRouter   create succeeded   sm-businessrules-e73ec4d2-a715-4849-a5e9-77b521e7a086
businessrules_uaa                        xsuaa             application   businessruleseditor_appRouter   create succeeded   sm-xsuaa-9ef36350-f975-4194-a399-54db361e79b5
businessruleseditor_html5_repo_runtime   html5-apps-repo   app-runtime   businessruleseditor_appRouter   create succeeded   sm-html5-apps-repo-sb-ebcb2b69-24a5-408e-be00-02066b302b78
```

You might think that looks quite neat, but don't be deceived - if there
are no bound apps, the column is empty, which makes parsing of the
output more unpredictable that it should be (why can't something like
'none' be emitted for this column so it has a consistent value?).
Moreover, the contents of the column showing the last operation is also
unpredictable, in that the value or values can contain spaces, which
makes text-based parsing harder than it should be.

Anyway, before I go on a mini-rant about this, let me explain what I do
to reduce this output down to the essentials.

The second line of the `service_status` script removes any line that
is simply 'OK'. When retrieving the app information (with `cf a`)
you get an 'OK', but when retrieving service information, you don't.
Again, unpredictable. So let's just get rid of it anyway.

The third line uses the venerable
[awk](https://en.wikipedia.org/wiki/AWK) language to print the first
column of the actual output, which is a single value on each line (in
this case 'businessrules', 'businessrules_uaa' and
'businessruleseditor_html5_repo_runtime'). With 'NR\>3' it skips
over the first three lines of output so that only the actual service
lines are processed.

Finally, the last line uses `awk` again to strip spaces from the start and
end of the lines.

So running this script produces this output:

```log
businessrules
businessruleseditor_appRouter create succeeded

businessrules_uaa
businessruleseditor_appRouter create succeeded

businessruleseditor_html5_repo_runtime
businessruleseditor_appRouter create succeeded
```

This is much nicer and what I want for a display in my terminal. Note
that I take advantage of the poor formatting from the output of `cf s`
by (inadvertently) grabbing the value of the 'bound apps' column if it
contains values. This is what the output looks like when the services
have just been created but before they've been bound to the
`businessruleseditor_appRouter` app:

```log
businessrules
create succeeded

businessrules_uaa
create succeeded

businessruleseditor_html5_repo_runtime
create succeeded
```

I have another script to display the apps information, called
`app_status`, which looks very similar:

```shell
cf a
| sed '/^OK$/d'
| a`k 'NR>3 { printf "%s\n%s\n\n", $1, $2 }'
| a`k '{$1=$1};1'
```

There's just a bit of difference in the main `awk` invocation - I simply
want to print the first and second columns, on separate lines. Here's
what the output looks like when the 'businessruleseditor_appRouter'
app is running:

```log
businessruleseditor_appRouter
started
```

I use the terminal multiplexor app
'[tmux](https://en.wikipedia.org/wiki/Tmux)' to manage individual
windows and panes (sub-windows) in my terminal, and divide up the space
to show the output of my `service_status` and `app_status` scripts
in separate areas. The output is always up-to-date as I drive the
execution of these scripts with the excellent
'[watch](https://en.wikipedia.org/wiki/Watch_(Unix))' command, which
by default will re-execute the specified script every 2 seconds.

This is what it looks like in action:

![](/images/2020/01/Screenshot-2020-01-29-at-10.22.42.png)

## Removing the app and supporting services

I wanted to remove the running app and the services it was bound
directly to, i.e. the `businessrules_uaa` and
`businessruleseditor_html5_repo_runtime` services. Of course, I
could have simply used a combination of the `cf delete` and `cf
delete-service` commands (`cf d` and `cf ds` in short form). But
there's a neater way, with '[cf
undeploy](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/fab96a603a004bd992822c83d4b01370.html)'.

The `cf undeploy` command requires the MTA ID, which can be retrieved
with the 'cf mtas' command, which shows output like this:

```log
Getting multi-target apps in org I347491trial_qmacrosubdomain / space dev as dj.adams@sap.com...
OK
mta id                version
businessruleseditor   0.0.1
```

In this case, the ID is `businessruleseditor`.

Now I can use the `cf undeploy`, along with the `-delete-services`
option, to clean out exactly the right parts, in the right order, too.
If there's any issue with deleting services, there's a number of times
the operation will be retried, too:

```shell
cf undeploy businessruleseditor -delete-services -f
```


This is what the output looks like:

```log
Undeploying multi-target app businessruleseditor in org I347491trial_qmacrosubdomain / space dev as dj.adams@sap.com...
Detected deployed MTA with ID "businessruleseditor" and version "0.0.1"
Deleting routes for application "businessruleseditor_appRouter"...
Deleting route "i347491trial-qmacrosubdomain-dev-businessruleseditor-approuter.cfapps.eu10.hana.ondemand.com"...
Stopping application "businessruleseditor_appRouter"...
Deleting application "businessruleseditor_appRouter"...
Deleting service "businessrules_uaa"...
Deleting service "businessruleseditor_html5_repo_runtime"...
Error deleting services: Error deleting service "businessruleseditor_html5_repo_runtime" from offering "html5-apps-repo" and plan "app-runtime": Service broker operation failed: 502 Bad Gateway: CF-ServiceBrokerBadResponse(10001): Service instance businessruleseditor_html5_repo_runtime: Service broker error: Service broker html5-apps-repo-sb failed with: Internal Server Error
Proceeding with automatic retry... (3 of 3 attempts left)
Services "[businessrules_uaa]" are already deleted
Deleting service "businessruleseditor_html5_repo_runtime"...
1 of 1 done
Process finished.
Use "cf dmol -i aad5f179-4286-11ea-be81-eeee0a930fbf" to download the logs of the process.
```

## Redeploying, with a reduced size MTA archive

When I'm ready to redeploy I can do so, following the flow I described
in yesterday's post "[Scripting Cloud Foundry activities in
trial](/blog/posts/2020/01/28/scripting-cloud-foundry-activities-in-trial/)".

However, there's a [lovely bit of
advice](https://twitter.com/IObert_/status/1220321066029142018) from my
friend and colleague mariusobert that can be used to reduce the size of
the MTA deployment archive. Shown in a
[Gist](https://gist.github.com/IObert/220cb211a63a4030c25b31d912243d6a),
there's a '[build-parameters'
setting](https://gist.github.com/IObert/220cb211a63a4030c25b31d912243d6a#file-mta-yaml-L18-L19)
that can be added to a module definition, so that the `node_modules/`
directory, which is often the bulk of the archive, can be omitted (it
will be created in the cloud once deployed). This is what the parameter
looks like:

```yaml
build-parameters:
  ignore: ["node_modules/"]
```

Adding this to the definition of the `businessruleseditor_appRouter`
module (effectively the definition for the app itself) like this,
greatly reduces the archive file size.

```yaml
 - name: businessruleseditor_appRouter
   type: approuter.nodejs
   path: businessruleseditor_appRouter
   parameters:
      disk-quota: 256M
      memory: 256M
   build-parameters:
       ignore: ["node_modules/"]
   requires:
    - name: businessruleseditor_html5_repo_runtime
    - name: businessrules_uaa
    - name: businessrules
```

Without this setting, the size of the `businessruleseditor_0.0.1.mtar`
archive is 12 megabytes:

```shell
-> ls -l --block-size=M mta_archives/
total 12M
-rw-r--r-- 1 qmacro qmacro 12M Jan 29 11:09 businessruleseditor_0.0.1.mtar
```

With this setting, the size is only 17 kilobytes!

```shell
-> ls -l --block-size=K mta_archives/
total 20K
-rw-r--r-- 1 qmacro qmacro 17K Jan 29 11:13 businessruleseditor_0.0.1.mtar
```

As a bonus, the build is slightly quicker, and the deploy is definitely
quicker!

Take a look at the Asciinema recording ([above](#tldr)) to see this in
action - where you can also see the appearance of the binding
information in the service output, as the app is created and bindings
are made.

## Wrapping up

When I started hacking around with the `cf` command earlier this
morning, I didn't intend to write a blog post, but I thought it was
worthwhile in the end to share some of my learnings. I hope you found it
interesting - and more importantly, I'd love to know what sort of
automation and convenience tools you have set up for yourself. Let me
know in the comments. And as always, happy hacking!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/mini-adventures-with-mtas-and-the-cloud-foundry-cli/ba-p/13439593)
