---
layout: post
title: Help Us To Help You - Share Your Code
date: 2014-01-09
tags:
  - sapcommunity
  - gists
  - ui5
  - github
---
Yesterday I [tweeted](/tweets/qmacro/status/420840232008028161/): "We should encourage folk to post full Gists with their #UI5 issues, for easier debugging and analysis ([http://scn.sap.com/message/14665116](https://web.archive.org/web/20151116084802/http://scn.sap.com/message/14665116#14665116)). Agree?".

![A screenshot of the tweet](/images/2014/01/tweet.png)

So I decided to put my money where my mouth is and write this document.

## Background and Context

There are many examples in the SCN SAPUI5 Developer Center where people are posting questions asking for help with code, and where they don't supply enough information, background, context, or - crucially - **code**. If you have a problem with your code and want help from other people, help us to help you by sharing the code you're having problems with.

There are good ways and bad ways to share code. Here are a few tips:

## Share all of the code

Unless you're asking questions about, for example, specific syntax or code patterns, don't just post code snippets, and make us guess the rest. Post all of your code. Even the parts that you might not think are relevant. If you're experiencing problems, and don't post all of the code, you're second-guessing the cause, and not helping yourself or us. Remember, we haven't been working on your codebase and so don't have the mental context that you have.

If you can't share all of your code for some reason (intellectual property, security, whatever) then reduce the problem to its core essence and post that - but again, post a complete example. Often, going through the exercise of reproducing the problem in the smallest instance possible leads you to realise what the problem is, and you may not need to ask for help. But if you do, you have at least something to show the people who can help.

## Share the code in a useful way

Posting large (or even small) chunks of code inside the body of a forum question here on SCN is not that helpful. The syntax highlighting, formatting and font choice that this environment offers as default is not conducive to reading code. Further, posting your code like that makes it that much more difficult for your helpers to marshal it into something that they could run locally to see if they could diagnose the problem themselves. The one exception is where you're providing an initial bit of context. And if you do that, make sure you use the syntax highlighting provided by the SCN Jive editor. It's not brilliant, but it's better than nothing.

![syntax](/images/2014/01/syntax.png)

ZIP files of complete applications are better, but they're still very cumbersome - you have to download them in your browser, unzip the files, choose a directory, and so on. And nobody can read the code at their leisure, or get a quick understanding of what's going on.

## Use GitHub's Gists

Best of all, at least IMHO, is to create a [Gist on GitHub](https://gist.github.com/). This puts the code centre stage, treats it as a first class citizen on the Web (you can address whole applications, individual files, or even individual lines, with their own URLs) and what's more, it's one command to pull the entire codebase of an application to a local directory and start working on it immediately. If nothing else, sharing the code you want help with as a Gist on GitHub puts the onus on you, who are seeking help (rather than your potential helpers, who are offering help) to marshal the code so that it can be properly diagnosed.

[Here's a recent example](https://answers.sap.com/questions/10567169/adding-type-information-in-xml-views.html) of where someone had a problem with his application and asked for help, posting not only a formatted snippet to provide initial context: 

![formatted snippet](/images/2014/01/capture.png)

but also a Gist with a complete working runnable example that highlighted the problem he was having:

![gist](/images/2014/01/gist.png)

Uwe did exactly the right thing. The Gist he created and shared - "[Binding Problem with UI5 and XML views](https://gist.github.com/se38/8322054)" was complete, didn't omit anything, and was runnable. It took me less than a minute to grab the code and get it running and confirm what the issue was. This particular problem wasn't a big issue, but there are more complex problems that are presented in this area on SCN that are very difficult to diagnose because not only is the code not shared, nor a complete description of the issue given, but also the problem is complex in that it involves relationships between different components and files … which are often missing.

With a Gist, not only can the whole application be downloaded quickly and easily, but also you can review the code in properly formatted and syntax-highlighted fashion, and even point to certain lines (like [the last line of the bootstrap](https://gist.github.com/se38/8322054#file-index-html-L9), which was missing the data-sap-ui-xx-bindingSyntax setting)

Here's a short screencast of how that shared code, in a Gist, is very easy to pull down locally, fire up and start to diagnose.

[![screenshot of screencast on YouTube](/images/2014/01/screencast.png)](https://www.youtube.com/watch?v=Fgp_e3Uv5Xs)

<https://www.youtube.com/watch?v=Fgp_e3Uv5Xs>

Hat tip to my son Joseph, who first showed me that Gists could contain more than one file, and for pointing out that they were normal git repos.

---

[Originally published on SAP Community](https://blogs.sap.com/2014/01/09/help-us-to-help-you-share-your-code/)
