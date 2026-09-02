---
title: "SAP on the Google Cloud - exploring the possibilities"
date: 2017-03-09
description: The era of the software defined datacentre is truly upon us.
tags:
  - sap
  - cloud
  - google
  - sap-community
---

The *[*announcement from Google
yesterday*](http://www.bluefinsolutions.com/blogs/lloyd-palfrey/march-2017/sap-on-google-cloud-platform-three-magic-number)*,
with the ability to manage and run SAP systems on their Compute Engine
infrastructure, inspired us to look into what the already-established Compute
Engine API offers us, and have a bit of fun in the process.

## Devops & use cases

With the advent of developer operations, or
"[devops](/blog/posts/2017/02/13/reaching-out-to-the-new-new-kingmakers/)",
Basis and developer activities are no longer separate, but are often
carried out together. Considering this modern proximity and the
possibilities it offers, here are a couple of use cases where access to
an API at this level would really bring value with the ability to
directly control virtual machine instances:

Cost saving: A typical SAP environment will have many tiers: Sandbox,
Development, Quality Assurance, Training, Pre-Production and Production
being the most typical. Some of these tiers will be used constantly
(Production, obviously), but others less frequently. Imagine giving your
key developers or super users the ability to startup or shutdown the
Quality Assurance or Training systems without needing to seek approval
or finding the right person to do it. This has the potential to result
in significant cost savings, in Virtual Machine (VM) running costs as
well as from a process perspective.

On-demand performance boost: Consider the scenario where you have a
number of batch processes running at given times during the day and
those processes can impact your end users. Rather than have your end
users compete for processing power on the existing instances of your
Production system, spin up a few ad-hoc instances that are appropriate
for the workload, use them for the batch run, and then shut them down
again. Automatically.

## Taking the API for a spin

The [Compute Engine
API](https://cloud.google.com/compute/docs/reference/latest/) is
multi-faceted and can be invoked in different ways: a REST-based HTTP
interface is one way, and a command-line tool "gcloud" is another. We
thought we'd kick these use case tyres and flex our ABAP fingers to put
together a simple way to programatically start up and shut down SAP
systems on the Google Cloud.

You can play along too - the source code is available in this public
[ABAPGcloud](https://git.bluefinsolutions.com/mud-public/ABAPGcloud)
repository.

Just make sure that your SAP system is set to start on boot up, and that
your VM is given full access to the Google API:

![](/images/2017/03/Screen-Shot-2017-03-09-at-10.55.16.png)

Also, you'll want to deploy the ABAP mechanism to a system that will be
up the whole time. Systems in the Production or Development tiers are
good candidates.

## ABAP's not dead - it's controlling the cloud

Here's a short video of the solution in action - via the ABAP code, the
Google Cloud VM instances can be listed, and started & stopped. Simple!

The code is available via ABAPgit in a repository on our public-facing
Mobility, UX & Development Centre of Excellence (MUD COE) server:

<https://git.bluefinsolutions.com/mud-public/ABAPGcloud/tree/master>

Here's a quick rundown of how the parts work together, by the author of
this demo, Gregor Brett, our very own ABAP and Google Cloud API
extraordinaire!

It's using the "gcloud" command, which is available without further
ado as long as API access has been granted as described above. The
command is invoked via the classic "external command" facility
(defined in transaction SM69) and programmatically via the
SXPG_CALL_SYSTEM function.

There are two main building blocks. The first is a global class
[ZCL_GCLOUD](https://git.bluefinsolutions.com/mud-public/ABAPGcloud/blob/master/zcl_gcloud.clas.abap)
which wraps the external command facility in a usable package that
allows Google Cloud VM instances to be listed, started and stopped.

The second is a simple report
[ZGCLOUD](https://git.bluefinsolutions.com/mud-public/ABAPGcloud/blob/master/zgcloud.prog.abap)
that utilises the global class. It creates an instance of that class
pointing to our test Google Cloud Compute Engine project, where we have
our VMs. It then uses the global class to initially retrieve the VM
instances available, and displays them in classic ABAP List View (ALV)
style. It also presents 'start' and 'stop' options which use the
global class again to start or stop the VM instances selected.

You can imagine that instead of this simple report, use of the global
class could be embedded in an automated process that would fit well with
the use cases described above.

## Over to you

The next step is up to you. How about exploring the REST approach to
using the API? How might you improve the sample code? What other use
cases can you come up with? Having the combination of simplicity and
power at your fingertips is intoxicating. At least for people like you
and me. So get creative and start exploring!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-members/sap-on-the-google-cloud-exploring-the-possibilities/ba-p/13319576)
