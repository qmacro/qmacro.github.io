---
layout: post
title: "Monday morning thoughts: editors and editing"
date: 2018-04-30
tags:
  - sapcommunity
  - mondaymorningthoughts
---

*In this post I look at how the editor environments that we come across in our daily work are different, and, as those differences might grow and expand as we become cloud native, how we bridge the contrast in facilities with core obsessions such as correct indentation and whitespace.*

This weekend I continued to look into [Kubeless](https://kubeless.io/),
a serverless framework that is native to Kubernetes. Kubernetes allows
you to automate deployment, scaling, and management of containerized
applications - in other words, to orchestrate units of computing across
places where containers run, on your workstation as well as in the
cloud.

## Serverless computing

At the heart of serverless computing is the concept of a function,
usually stateless and short-lived, the loading and execution of which is
taken care of for you. Functions-as-a-Service, or FaaS, is another term
for serverless. Of course, serverless is somewhat of a misnomer, as
there are definitely servers involved, but the point is that you don't
have to worry about that. I'm a fan of serverless computing, having
dabbled already with the Google Cloud Functions flavour of serverless,
in experiments to create conversational actions for the Google Assistant
framework (see "[Google Cloud Functions + Sheets + Apps Script +
Actions On Google =
WIN](/blog/posts/2017/04/30/google-cloud-functions-+-sheets-+-apps-script-+-actions-on-google-win/)")
and more recently in my
[discovery](/blog/posts/2018/01/16/discovering-scp-workflow/)
of the SAP Cloud Platform (SCP) Workflow service (see "[Discovering SCP
Workflow - Service
Proxy](https://blogs.sap.com/2018/01/17/discovering-scp-workflow-service-proxy/)").

Anyway, I digress. Mostly. But what triggered these thoughts was the
availability of a UI for Kubeless, which looks like this:

![](https://github.com/kubeless/kubeless-ui/raw/master/kubeless.png)

(The Kubeless UI, from the [Kubeless UI GitHub
page](https://github.com/kubeless/kubeless-ui))

## YAEE (Yet Another Editor Environment)\*

I found myself inside this Kubeless UI editor environment over the
weekend, on my local Kubernetes environment via
[Minikube](https://kubernetes.io/docs/getting-started-guides/minikube/).
This environment is not required to build serverless functions, but
makes the process a little more comfortable.

_\* The term and acronym "Yet Another \..." comes from the Perl community, where there's the "JAPH" acronym, (Just Another Perl Hacker), originated and popularised by Randal Schwartz, and the "YAPC" acronym (Yet Another Perl Conference)._

The editor is basic, and arguably only one of the key components of the
environment. But a basic editor here is perhaps "good enough", because
of the nature of what you're going to be writing - a fairly simple
function that does one thing, and one thing well. Rather like the Unix
philosophy where you have a pipeline of commands that also each do one
thing and do it well. But that's a story for another time, perhaps.

Editing short sections of code like this reminds me of the script task
concept within the SCP Workflow service (see "[Discovering SCP
Workflow - Script
Tasks](https://blogs.sap.com/2018/01/26/discovering-scp-workflow-script-tasks/)").
There too we have a (usually) short piece of code, which is almost
secondary to the bigger picture of the overall workflow definition
itself. Yes, the editing experience is provided by the SAP Web IDE,
which offers many facilities, but for me the mindset of writing
"helper" scripts here keeps me mindful of the overall end goal (to
create a clear and efficient workflow experience) which is in contrast
to the scripts themselves which are more a means to an end.

Moreover, the fact that at the time of writing, only ES5 JavaScript is
supported, preventing me from indulging in [fat arrow
syntax](http://exploringjs.com/es6/ch_arrow-functions.html) and other
ES6 goodies like
[generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function%2A).
This in turn holds me back slightly from "over committing", in the
sense that "support for something better (ES6) will come along soon so
I'll just tread water for now". The same situation can be found in
[Google Apps Script](https://developers.google.com/apps-script/), where
there's also only support for ES5, and where I find myself writing a
lot of "helper" code.

So already that's three editor environments we've talked about - in
Kubeless UI, SAP Web IDE, and the Google Apps Script editor. That's on
top of any "main" editor environment, which for me (beyond SAP Web IDE
for many things) can be either [vim](https://www.vim.org/) on a remote
virtual machine or the [Google Cloud Shell
editor](https://cloudplatform.googleblog.com/2016/10/introducing-Google-Cloud-Shels-new-code-editor.html).

![](https://cloud.google.com/shell/docs/images/code-editor.png)

(The Google Cloud Shell editor, from the [Google Cloud Shell code editor
feature description
page](https://cloud.google.com/shell/docs/features#code_editor))

And of course there's the ABAP editing environments SE24 (sorry, I mean
SE80) as well as the Eclipse-based ABAP Developer Tools in the form of
ABAP in Eclipse. Add to that the countless online REPLs (see "[Monday
morning thoughts: cloud
native](/blog/posts/2018/03/26/monday-morning-thoughts:-cloud-native/)").

Further, think of the wonderful Jupyter Notebook cloud literate
programming environment, which is also being used, coincidentally, in
SAP contexts - see the "[Use Jupyter Notebook with SAP HANA, express
edition](https://www.sap.com/uk/developer/tutorials/mlb-hxe-tools-jupyter.html)"
tutorial, for example.

![](/images/2018/04/1_CdLQ9beRMKVIpHbMSbjX7w.gif)

(Part of a Jupyter Notebook, from the [jupyter.org
website](https://newsletter.jupyter.org/jupyter-newsletter-5-july-22-8965016f732))

Here too, the code editor facilities themselves are secondary to the
overall (amazing) experience of the notebook concept, and the amount of
code you write in any one section is small.

And it would be remiss of me not to mention the [Chrome Developer
Tools](https://developer.chrome.com/devtools) themselves, which provide
a common editing environment, especially when you link to your local
filesystem for persistent edits.

## The key commonality is difference

That's a lot of different editor environments - and apart from Eclipse,
I haven't mentioned any traditional workstation-local tools such as
Atom, Sublime or the editor-du-jour VS-Code (which I also enjoy using).
Not only is that a wide range of editors, but also a wide range of
contexts, or programmer mindsets, when using these different
environments. I've already alluded to the mindset example when writing
a Workflow service script task. When using a Jupyter notebook one might
be thinking in a more [literate
programming](https://en.wikipedia.org/wiki/Literate_programming) style.
When writing a cloud function one might be thinking of the strict
interface and ensuring things remain quick and stateless.

What's common though across all these mindsets, at least to most
people, it would seem, is the implicit requirement to impose decent
formatting on oneself and one's code. Proper use of whitespace (whether
you're a tabs or a spaces person, that doesn't matter) and correct -
or at least meaningful - indentation. Indentation which is in some cases
(Python) a requirement, rather than something nice to have.

What's also common is the fact that because you're editing in
different environments, it's likely that some of them won't have the
creature comforts we've come to expect from "core" editing
environments such as SAP Web IDE, VS-Code or Eclipse. I'm thinking
particularly about a couple of features: the ability to customise the
editor's look and feel (and also how it fits into the wider continuous
integration story at your workplace), and tools such as reformatters.

## Formatting poll

Last night I set up a
[poll](/tweets/qmacro/status/990640820574441472/) on Twitter:
"when writing a quick-n-dirty or hacky program, do you still care about
whitespace & indentation or not?":

![](/images/2018/04/Screen-Shot-2018-04-30-at-07.12.21.png)

The overwhelming response so far is that people care. I have already had
some great responses, from the [strong
words](https://twitter.com/JelenaAtLarge/status/990795362104422402)
from Jelena Perfiljeva to versions of an editor-feature solution
from se38 , Yuval Morad and others
(format-on-save or a format hotkey).

Yes, the editor-feature solutions are great, but only when we're
working in that specific editor. When we move across different editing
environments in our daily work, which will be a scenario that only
happens more often as we move to the cloud, we'll come across editing
environment like the examples mentioned earlier, where such features are
either not present, or at least hard-coded to format in a way you don't
particularly like. So I found myself manually editing and correcting
whitespace in my hacky script yesterday not because there wasn't a
formatting feature in the editor in which I was writing the code, but
because I've become so used to the "lowest common denominator" (of no
format feature) that I naturally turned to doing it myself.

Heck, that's where I started in my programming life - before auto
formatters - so it comes naturally anyway, and for me it's a way to
pause and think about what I've written as I almost absent-mindedly
clean up the indentation.

## The future normal?

A community member mentioned (on Slack) the other day something along the
lines of "I've got my editor just how I want it now", which implied
to me a lot of care, attention and obsessive tweaking that I admire, but
am thinking is - in some scenarios - less worthwhile these days. In my
mental move to become a cloud native (see what I did there?) I'm moving
away from becoming attached one specific editor and preparing myself for
a future normal, which might be described nicely in a [Colossal Cave
style](https://en.wikiquote.org/wiki/Colossal_Cave_Adventure) thus:

YOU ARE IN A MAZE OF TWISTY LITTLE EDITORS, ALL DIFFERENT

I've seen the platforms for writing and deploying code almost explode
with possibilities and variations over the past decade, and it seems
only to be going to continue. As we mentally and physically (well,
logically) move away from our local workstations to the cloud, we cede
control of our local tools. Perhaps one day the facilities in the cloud,
naturally different because they're provided on different platforms by
different vendors, might coalesce via some sort of common standard, but
I'm not holding my breath. Instead, I'm embracing difference, and
continuing to manually obsess over whitespace in all the code I write,
wherever it is.

How about you?

---

This post was brought to you by [La Secreta
coffee](https://www.pactcoffee.com/coffees/la-secreta) and the quiet of
an early Monday morning.

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

## Update 02 May 2018:

The [final results of the
poll](/tweets/qmacro/status/990640820574441472/) came in:

-   Total number of votes: 137
-   Those caring about whitespace: 87%
-   Those not caring about whitespace: 13%

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-editors-and-editing/ba-p/13353774)
