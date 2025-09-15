---
title: Enabling document fragment links for headings in SAP Community blog posts
date: 2024-07-09
tags:
  - sapcommunity
  - javascript
  - document-object-model
  - bookmarklet
---
I came up with a bookmarklet to allow me to get hyperlinks for pointing to specific sections of blog posts on the SAP Community platform.

I'm running the Developer Challenge this month and for that I have a central blog post:

[July Developer Challenge - "Reverse APIs"](https://community.sap.com/t5/application-development-blog-posts/july-developer-challenge-quot-reverse-apis-quot/ba-p/13749653)

and a discussion thread for each individual task in the challenge, for example:

* [Task 0 - Server and service provisioning](https://community.sap.com/t5/application-development-discussions/task-0-server-and-service-provisioning-july-developer-challenge-quot/m-p/13749996)
* [Task 1 - Your first service and first endpoint](https://community.sap.com/t5/application-development-discussions/task-1-your-first-service-and-first-endpoint-july-developer-challenge-quot/m-p/13752205)
* [Task 2 - Capire's Hello World!](https://community.sap.com/t5/application-development-discussions/task-2-capire-s-hello-world-july-developer-challenge-quot-reverse-apis-quot/m-p/13755407)

and so on.

Within the task discussion threads, I found myself wanting to refer to specific sections of the main blog post, so I could send the reader to a particular heading.

It turns out that each HTML heading element on that platform has a unique `id`. Here's a couple of examples:

![part of the document, with the Chrome Developer Tools open on the Elements tab showing the ids for the two headings highlighted](/images/2024/07/headings-in-dev-tools.png).

That means I can refer directly to the [Making your service available to test](https://community.sap.com/t5/application-development-blog-posts/july-developer-challenge-quot-reverse-apis-quot/ba-p/13749653#toc-hId-232540630) section of the blog post, for example.

So I took a bit of JavaScript and some DOM inspection & manipulation functions to create a bookmarklet that adds fragment links to the start of each heading, in the form of hyperlinked `#` symbols.

It:

* identifies all the heading elements (from `H2` through `H6`)
* ignores any of those that don't have an `id` attribute

and, working through each of those:

* makes sure I haven't already added a fragment\*
* inserts an `a` element with a relative link to the document fragment based on the value of the `id` attribute

\* This is so I don't get multiple fragment links if I select the bookmarklet multiple times on the same page.

The copy/pasteable bookmarklet looks like this (add it in the URL part of a new entry in your Bookmarks Bar):

```javascript
javascript:(function () {Array.from(document.querySelectorAll("h2, h3, h4, h5, h6")).filter(x => x.id).forEach(x => { if (x.firstChild.id != `fragment-link-${x.id}`) x.insertAdjacentHTML('afterbegin', `<a id="fragment-link-${x.id}" style="color: lightgrey; text-decoration: none" href="#${x.id}">#</a> `)}) })()
```

Expanded to be a bit more readable, the JavaScript part inside `javascript`-prefixed [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) (i.e. this: `javascript:(function () { ... })()`) looks like this:

```javascript
Array.from(document.querySelectorAll("h2, h3, h4, h5, h6"))
    .filter(x => x.id)
    .forEach(x => {
        if (x.firstChild.id != `fragment-link-${x.id}`) {
            x.insertAdjacentHTML('afterbegin', `<a id="fragment-link-${x.id}" style="color: lightgrey; text-decoration: none" href="#${x.id}">#</a> `)
        }
    })
```

Here's a quick demo:

![document fragment bookmarklet demo](/images/2024/07/document-fragment-bookmarklet-demo.gif)

[Share & enjoy!](https://www.hhgproject.org/entries/shareandenjoy.html)
