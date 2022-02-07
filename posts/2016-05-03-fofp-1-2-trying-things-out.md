---
layout: post
title: FOFP 1.2 Trying things out
tags:
  - language-ramblings
---
Part of the [Fundamentals of Functional Programming](/2016/05/03/fofp) document.

Prev: [FOFP 1.1 Introduction](/2016/05/03/fofp-1-1-introduction)

To start exploring some of the fundamental concepts of functional programming, you don't need anything more than you've probably already got. Of course, there are "more" functional languages such as Haskell, Standard ML, and various dialects of Lisp, such as Scheme, Common Lisp and Clojure. But there's a language that's pretty ubiquitous and that has some very good support for core functional programming concepts.

## JavaScript in Chrome

That language is JavaScript, and it's everywhere because it's available in all the major browsers. It's likely that you have a browser on your PC or laptop, so let's see how you can get started immediately with a simple interactive environment in which we can experiment. We'll choose the Chrome browser, not because it's fast or standards compliant, or even because it's from Google, but because it has a super set of developer tools that is worth getting to know.

One of those developer tools is the console - where you can enter JavaScript and have it executed immediately. This concept of a feedback loop made out of an interactive prompt with immediate execution is commonly known as a REPL, which stands for Read, Evaluate, Print, Loop: It reads your input, evaluates it, prints the result of the evaluation and then loops around to read your next input.

## Getting ready to explore

Open up Google Chrome, and in a new tab, open up the Developer Tools using either the menu as shown, or using Ctrl-Shift-I (or Cmd-Shift-I on a Mac), or F12.

![]({{ "/img/2016/05/developertools.png" | url}})

You'll see something like this:

![]({{ "/img/2016/05/elements.png" | url}})

The developer tools have opened up next to the tab you're on. Choose the "Console" entry in the menu at the top, to switch to the console, or REPL. You may see some error messages relating to the tab that's open (even a simple "new" tab), but you can ignore them[^2]. You might also want to detach the developer tools using the "Dock side" option (press the three vertical dots to get this menu) - choose the double-pane icon "undock into separate window".

![]({{ "/img/2016/05/menu.png" | url}})

At this stage, you're ready to explore.

Next: [FOFP 1.3 Some basic list processing](/2016/05/03/fofp-1-3-some-basic-list-processing)

[^2]: You can clear the console, and therefore remove the errors, with Ctrl-L (or Cmd-L on a Mac).
