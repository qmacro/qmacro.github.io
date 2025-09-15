---
date: 2005-02-23
title: Blosxom entries into MT
tags:
- blosxom
- mt
description: After setting up this blog, it was only natural to bring across my earlier blog posts that were previously served with Blosxom.
---


(I haven’t fallen out with Blosxom, I just wanted a change of scenery and a fresh start). Blosxom blog entries are simple .txt files where the first line is the post title and the rest of the lines are the body. The files are arranged in directories that reflect a category hierarchy.

As a MT-novice I looked around and considered how I might best bring those Blosxom based post into MT. I mused upon a script revolving around [MT::Entry](http://www.movabletype.org/docs/mtapi_mt_entry.html), then one that used XML-RPC, before discovering the *[import](http://www.sixapart.com/movabletype/docs/mtmanual_importing)* feature from reading the documentation to [mtsend.py](http://scott.yang.id.au/2002/12/mtsendpy/). A simple file format to mass-load into MT. Perfect.

So I hacked up [MakeMtImportEntries.py](https://web.archive.org/web/20050308040946/http://www.pipetree.com/~dj/2005/02/MakeMtImportEntries.py), a script that takes a filename (of a Blosxom .txt entry) and produces the blog post in the import format consumable by MT.

This is the sort of format I’m talking about:

```text
TITLE: The Blog Post Title
ALLOW COMMENTS: 0
ALLOW PINGS: 1
CONVERT BREAKS: 0
DATE: 04/27/2002 08:57:14
-----
BODY: The blog post body ...
```

You can therefore use this script in a find loop, like this:

```shell
find ./blog/ -name '*.txt' -exec ./MakeMtImportEntries.py > import.dat
```

and then move import.dat to where the MT import function expects it. Pretty straighforward.

(I’m not interested right now in re-creating the categories in MT from the hierarchical categories in Blosxom, so hacking the script to include category-specific ‘headers’ in the template is left as an exercise for the reader.)

Share and enjoy.
