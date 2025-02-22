---
mayout: post
title: TASC Notes - Part 9
date: 2025-02-21
tags:
  - tasc
  - cap
  - cds
  - handsonsapdev
---

These are the notes summarising what was covered in [The Art and Science of CAP part 9][1], one episode in a mini series with Daniel Hutzel to explore the philosophy, the background, the technology history and layers that support and inform the SAP Cloud Application Programming Model.

For all resources related to this series, see the post [The Art and Science of CAP][2].

I take a little longer than usual to go through the [notes to the previous part 8][3] as there was so much that Daniel covered and it was worth spending time making sure we're all on the same page.

## What's in a name?

At [26:46][4] I finally give Daniel a chance to continue, picking up more or less where we left off last time, and that was with some query action.

Starting with another variation on the queries from last time, Daniel goes for this:

```javascript
await cds.ql `SELECT ID, title, author.name as author from Books`
```

which produces:

```json
[
  { ID: 201, title: 'Wuthering Heights', author: 'Emily Brontë' },
  { ID: 207, title: 'Jane Eyre', author: 'Charlotte Brontë' },
  { ID: 251, title: 'The Raven', author: 'Edgar Allen Poe' },
  { ID: 252, title: 'Eleonora', author: 'Edgar Allen Poe' },
  { ID: 271, title: 'Catweazle', author: 'Richard Carpenter' }
]
```

While Mr Big might have said "[names is for tombstones baby][6]" (a phrase which Daniel recalls, from a colleague, in [part 7][8]), names do a lot of lifting and abstracting. Let's dig in, with `author.name` in this prefix projection clause here. 

We've thought about this already in terms of one of the two main ways that CQL extends SQL, i.e. as a _path expression_. Another term to use which Daniel introduces us to now is a "flattening" which makes a lot of sense, in that we can think of and treat the items in this projection (alternatively the _attributes_ in this _tuple_ shape construction) as flat, as along the same(attribute/tuple) plane. This is of course despite whatever SQL is required to actually realise this query expression - in particular a JOIN (the `.` in the name gives us a clue to this respect).

Talking of JOINs, we must note that, being a path expression, `author.name` is a so-called "forward declared join". Here, `author` is an association, and we can see a brief mention of this concept in Capire for [associations in CDL][7]:

> "Associations capture relationships between entities. They are like forward-declared joins added to a table definition in SQL."

Like the concept of a "relvar", this is something I initially struggled to grok. But having previously asked around internally and got some great help from lovely colleagues (thanks Patrice, Sebastian and Adrian)[<sup>1</sup>](#footnote-1), I think of forward declared joins as a sort of more abstract "preamble" description of a relationship, that might likely be realised by a JOIN at the SQL level. Think of it as an expression of join opportunities with additional info on relationship qualification, i.e. ON conditions, which here are pulled from the managed associations used in the CDS model.

So here `author.name` becomes a JOIN and we are implicitly using the name `author` as a table alias, referring to the `Authors` table that has been joined; Daniel then switches to compile-to-SQL mode and "emits":

```sql
SELECT
  ID,
  title,
  author.name as author
FROM Books
JOIN Authors as author ON author.ID = Books.author_ID
```

## From to-one to to-many associations

The association from `Books` to `Authors` is a to-one association, and the bi-directional partner is the to-many association from `Authors` to `Books` (head back to [Relations, attributes and values][10] in the notes to part 8 for a reminder).

```text
+---------+                 +---------+
|  Books  | N <---------> 1 | Authors |
+---------+                 +---------+
```

---

<a name="footnotes"></a>
## Footnotes

<a name="footnote-1"></a>
1. You might also be interested to know that forward declared joins are a core part of [patent US10599650B2 "Enhancements for forward joins expressing relationships"][9], on which Daniel is named as a co-inventor.


---

[1]: https://www.youtube.com/watch?v=Tz7TTM1pOIk
[2]: /blog/posts/2024/12/06/the-art-and-science-of-cap/
[3]: /blog/posts/2025/02/14/tasc-notes-part-8/
[4]: https://www.youtube.com/live/Tz7TTM1pOIk?t=1606
[5]: /blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/#initial-recognition
[6]: https://youtu.be/7pMWa33uVVE
[7]: https://cap.cloud.sap/docs/cds/cdl#associations
[8]: /blog/posts/2025/02/07/tasc-notes-part-7/
[9]: https://patents.google.com/patent/US10599650B2/en
[10]: /blog/posts/2025/02/14/tasc-notes-part-8/#relations-attributes-and-values
