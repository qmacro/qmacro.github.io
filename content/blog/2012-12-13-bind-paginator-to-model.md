---
title: "Bind Paginator to model?"
date: 2012-12-13
description: Experimenting with binding a SAPUI5 Paginator control to a model for automatic page calculation.
tags:
  - openui5
  - sap
  - sap-community-post
---

I was wondering if anyone had tried binding a
[Paginator](https://sapui5.netweaver.ondemand.com/sdk/#docs/api/symbols/sap.ui.commons.Paginator.html)
to a model, to have the numberOfPages automatically set to the number of
entries in the model's row set.

As an example, I'd developed a simple Panel/HTML representation of my
weblog posts (in preparation for "[Re-presenting my site in
SAPUI5](http://www.youtube.com/watch?v=wZUXz5f1CHI)") and then added a
Paginator at the top to page through the posts. It looks like this:

![](https://community.sap.com/legacyfs/online/storage/attachments/storage/7/jiveimages/165840)

In order to work out what value to set the numberOfPages to, I ended up
using jQuery to parse the source XML that the Model had consumed, and
count the number of 'entry' elements. You can see the code here:
<https://github.com/qmacro/sapui5bin/blob/master/snippets/model_to_html.html#L31>

I noticed in the docu that the Paginator inherits a number of bind
methods from sap.ui.core.Element, and was curious to see whether binding
a Paginator could auto-set the numberOfPages according to the data.

Anyone tried this?

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-q-a/bind-paginator-to-model/qaq-p/9120330)
