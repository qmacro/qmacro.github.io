---
title: Accuracy and precision in language
date: 2024-01-22
tags:
  - words
  - language
  - atom
  - odata
---
If I suggest that an alternative title for this could be "Blog post, not blog!" you'll get a good idea of what this is about. Plus there's a bonus bit on how blogs, blog posts and feeds relate to OData.

## Background

I was fortunate to be able to study until I was 21, before starting my real work life. At school, the 'A' level subjects I chose were Latin, Ancient Greek and Ancient History. I was very lucky to be able to continue on that curve at university, reading Classics ... predominantly Latin and Ancient Greek, with an emphasis on language rather than literature, plus a module in Sanskrit and one in Philology.

A strong interest in all things grammar, syntax and language, combined with this opportunity to study this in depth, has left me with a passion for accuracy and precision in language, as well as a love of etymology and semantics.

## A passion for accuracy

This passion has stayed with me throughout my life, into my career, which has been in software, specifically enterprise software in the SAP world. I don't think anyone would argue that with software - whether that be programming, defining specifications, testing, or any number of other related disciplines - accuracy and precision is the order of the day.

Sloppiness or inattention to detail, a lack of precision, call it what you want - is not conducive to success in the software world. Worse still, perhaps - it hinders communication and clarity in discussion.

Those that don't care too much about attention to detail may counter with the claim that this is pedantry - being excessively concerned with formalism, accuracy and precision. To that I say that if passion for attention to detail is pedantry, I'm a pedant and proud of it.

## Blog post, not blog

So it is driven by this passion that I cast my eye with an attention to detail on everything I create, and on everything I read. One particular instance, that provokes a perhaps unreasonable level of frustration in me, is to see a lack of attention to detail when it comes to using terms related to blogging.

### Some history

When the Web was growing up, a large part of the social infrastructure that emerged was a vast and loose collection of Web sites where folks published their thoughts. Updates. Articles. Short and long form prose.

In doing this, they were logging their thoughts as time went by. For any given person doing this, you could go to read what they had to say, and it was usually presented in reverse chronological order. Moreover, you could subscribe to what they had to say via RSS (and latterly Atom) feeds, to have their updates come to you and presented in a so-called feed reader.

These Web sites where folks logged their thoughts became known as _Web logs_. Then _Web log_ soon became _Weblog_ in a sort of (but not quite) portmanteau. Shortly after, _Weblog_ was often shortened to _'blog_, with a leading apostrophe to indicate letters had been omitted.

And over time, just as it happened to _telephone_ -\> _'phone_ -\> _phone_ in the past, for example, even the leading apostrophe was dropped, resulting in just _blog_.

And articles presented and available on such a _Web log_, on a _blog_, were referred to as _blog posts_, or simply _posts_.

### Blogs and posts

To take this blog as an example, the Web log (_blog_) itself, containing all _posts_, is at <https://qmacro.org/blog/>. Individual _posts_ in the _blog_ can be found at their specific URLs, such as (relatively speaking, with a bit of whitespace for better formatting and wrapping):

* <a href="/blog/posts/2024/01/15/developing-cap-in-containers-three-ways">/blog/posts/2024/01/15/ developing-cap-in-containers-three-ways</a>
* <a href="/blog/posts/2024/01/09/battlestation-2024">/blog/posts/2024/01/09/ battlestation-2024</a>
* <a href="/blog/posts/2024/01/09/a-simple-jq-repl-with-tmux-bash-vim-and-entr">/blog/posts/2024/01/09 a-simple-jq-repl-with-tmux-bash-vim-and-entr</a>

There's a clue in the path section of each of these URLs.

In addition, the machine readable format of this blog, which can be used in feed readers to subscribe to the blog and automatically receive new posts, is in Atom format and is available at <https://qmacro.org/feed.xml>.

Perhaps a (massively simplified) diagram would help?

```text
                                        +-- blog (HTML)
                                        |
                                        V
+------------------------------------------------------+
| DJ Adams                                             |
|                                                      |
| 15 Jan Developing CAP in containers - three ways  ---- post
| 09 Jan Battlestation 2024                         ---- post
| 09 Jan A simple jq repl with tmux, bash, ...      ---- post
|                                                      |
| ...                                                  |
|                                                      |
+------------------------------------------------------+

                                     feed (XML) --+
                                                  |
                                                  V
     +-------------------------------------------------------+
     | feed xmlns="http://www.w3.org/2005/Atom"              |
     | |                                                     |
     | +- entry                                              |
     | |  +- date 15 Jan                                     |
     | |  +- title Developing CAP in containers - three ways |
     | |                                                     |
     | +- entry                                              |
     | |  +- date 09 Jan                                     |
     | |  +- title Battlestation 2024                        |
     | |                                                     |
     | +- entry                                              |
     | |  +- date 09 Jan                                     |
     | |  +- title A simple jq repl with tmux, bash, ...     |
     | |                                                     |
     | +- ...                                                |
     |                                                       |
     +-------------------------------------------------------+
```

If [the feed XML](https://qmacro.org/feed.xml) looks familiar, it should be. Atom, specifically the XML-based Atom syndication format, which is an open standard ([RFC4287](https://datatracker.ietf.org/doc/html/rfc4287)), along with the Atom publishing protocol ([RFC5023](https://datatracker.ietf.org/doc/html/rfc5023)), formed the basis of what became OData. Take a look at this [Northwind OData V2 entityset](https://services.odata.org/V2/Northwind/Northwind.svc/Products) and you may or may not be surprised to see that it is an Atom feed, just like the feed of this blog!

```xml
<feed xml:base="https://services.odata.org/V2/Northwind/Northwind.svc/" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://www.w3.org/2005/Atom">
  <title type="text">Products</title>
  <id>https://services.odata.org/V2/Northwind/Northwind.svc/Products</id>
  <updated>2024-01-22T10:20:20Z</updated>
  <link rel="self" title="Products" href="Products" />
  <entry>
    <id>https://services.odata.org/V2/Northwind/Northwind.svc/Products(1)</id>
    <title type="text"></title>
    <updated>2024-01-22T10:20:20Z</updated>
    <author>
      <name />
    </author>
    <link rel="edit" title="Product" href="Products(1)" />
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/Category" type="application/atom+xml;type=entry" title="Category" href="Products(1)/Category" />
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/Order_Details" type="application/atom+xml;type=feed" title="Order_Details" href="Products(1)/Order_Details" />
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/Supplier" type="application/atom+xml;type=entry" title="Supplier" href="Products(1)/Supplier" />
    <category term="NorthwindModel.Product" scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme" />
    <content type="application/xml">
      <m:properties>
        <d:ProductID m:type="Edm.Int32">1</d:ProductID>
        <d:ProductName m:type="Edm.String">Chai</d:ProductName>
        <d:SupplierID m:type="Edm.Int32">1</d:SupplierID>
        <d:CategoryID m:type="Edm.Int32">1</d:CategoryID>
        <d:QuantityPerUnit m:type="Edm.String">10 boxes x 20 bags</d:QuantityPerUnit>
        <d:UnitPrice m:type="Edm.Decimal">18.0000</d:UnitPrice>
        <d:UnitsInStock m:type="Edm.Int16">39</d:UnitsInStock>
        <d:UnitsOnOrder m:type="Edm.Int16">0</d:UnitsOnOrder>
        <d:ReorderLevel m:type="Edm.Int16">10</d:ReorderLevel>
        <d:Discontinued m:type="Edm.Boolean">false</d:Discontinued>
      </m:properties>
    </content>
  </entry>
```

> If you're interested in learning more about OData and its origins, see [Monday morning thoughts - OData](https://blogs.sap.com/2018/08/20/monday-morning-thoughts-odata/).

## Using the right terminology

So with that, I hope it's plain to see that _blog_ means the entire collection of posts. It does **not** mean, and never has meant, an individual _post_. The difference is not difficult, nor is it arcane or something that requires advanced study to understand.

So I exhort you to please use the right terminology. Using _blog_ to refer to an individual _post_ is like referring to an entire magazine and all its issues to refer to an individual article, on a specific topic, with a specific title, published on a specific date.

Some folks may raise the point about language evolving. Of course language evolves. That is not the issue here. The issue is that there is a perfectly good word for an article (_post_, or _blog post_) and that means we still have a word with which we can refer to the entire _Web log_ (collection of posts), and that is _blog_.

Using the word _blog_ incorrectly, i.e. to refer to an individual article (a _post_) confuses things, pushes us into a situation where we no longer have a word to refer to the whole, and, well yes, makes you look as though your attention to detail is somewhat lacking.
