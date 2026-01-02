---
title: Why I use services.cds in simple CDS model examples
date: 2026-01-02
tags:
  - cds
  - cap
description: The services.cds filename is special, which is why I make use of it.
---
I'm writing this short post so I can refer to it when I want to explain my use
of `services.cds` when creating sample CDS models. I've found myself explaining
multiple times across various blog posts[<sup>1</sup>](#footnotes) so I thought
it was time to fix that behaviour and write it once (more) and point to it.

One of the axioms in CAP is [AXI003 Convention over
configuration](https://github.com/qmacro/capref/blob/main/axioms/AXI003.md).
And when we follow best practice [BES003 Work in harmony with the
framework](https://github.com/qmacro/capref/blob/main/bestpractices/BES003.md),
we exhert less effort, create fewer surprises for ourselves and others, and
things Just Work(tm).

The "CDS roots" is one example of convention over configuration in action.
These roots are the pre-defined default locations that the CAP server will
search for CDS model definitions. You may know of the some of the roots
indirectly from the standard CAP Node.js directory structure scaffolded for you
with `cds init` - the `app/`, `srv/` and `db/` directories:

```log
.
├── README.md
├── app/
├── db/
├── eslint.config.mjs
├── package.json
└── srv/
```

In addition to these three directories, there are a couple of files too that
are part of this pre-defined set: `schema.cds` and
`services.cds`[<sup>2</sup>](#footnotes).

We can ask to see these CDS roots like this:

```bash
cds env roots
```

and we'll get[<sup>3</sup>](#footnotes):

```log
[ 'db/', 'srv/', 'app/', 'schema', 'services' ]
```

So in a sample project, by putting my simple CDS model directly into a file
called `services.cds` in the project root, everything will just work as I
expect, and I don't have to specify anything explicitly.

This is also why my micro starter script
[cdsnano](https://github.com/qmacro/dotfiles/blob/main/scripts/cdsnano) and
[corresponding
template](https://github.com/qmacro/dotfiles/tree/main/scripts/cdsnano-template)
uses `services.cds` with the simplest of meaningful service definitions in that
single file:

```cds
service Bookshop {
  entity Books {
    key ID    : Integer;
        title : String;
        stock : Integer;
  }
}
```

This follows the [simplest thing that could possibly
work](https://creators.spotify.com/pod/profile/tech-aloud/episodes/The-Simplest-Thing-that-Could-Possibly-Work--A-conversation-with-Ward-Cunningham--Part-V---Bill-Venners-e5dpts)
philosophy.

## Footnotes

1. In [the footnotes to FP, function chains and CAP model
   loading](blog/posts/2025/05/01/fp-function-chains-and-cap-model-loading/#footnotes),
   in the [Basic output from cds watch section of ISO content for common CAP
   types](/blog/posts/2024/03/12/iso-content-for-common-cap-types/#basic-output-from-cds-watch),
   in the [footnotes to A simple exploration of status transition flows in
   CAP](/blog/posts/2025/12/08/a-simple-exploration-of-status-transition-flows-in-cap/#footnotes)
   and likely other places too.
1. Technically the names of the files are `schema` and `services` without the
   `.cds` extension, owing to another default behaviour which is to look for
   CDS model files ending in any form, i.e. `.cds`, `.csn` or `.json`.
1. Actually there's now a further default CDS root entry which is `app/*`; this
   variation was [introduced in the Dec 2025
   release](https://cap.cloud.sap/docs/releases/dec25#loading-from-app-subfolders).
