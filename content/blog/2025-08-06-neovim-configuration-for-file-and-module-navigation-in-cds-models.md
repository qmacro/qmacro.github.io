---
title: Neovim configuration for file and module navigation in CDS models
description: In this post I describe how I extended my Lua-based Neovim configuration for CDS filetypes to improve navigation to referenced files and modules.
date: 2025-08-06
tags:
  - neovim
  - cds
  - lua
  - cap
---

## CDS modelling across files and modules

In the context of CDS models, one of the best practices is to embrace [aspects] and "factor out separate concerns into separate files". In addition to files the CDS compiler supports Node.js packages (modules).

An example of both can be found in the [sample] facet. Let's create a project based on this sample facet and explore.

```bash
; cd /tmp && cds init --add sample sample && cd sample && tree -L 3
creating new CAP project in ./sample

adding nodejs
adding sample

successfully created project – continue with cd sample

find samples on https://github.com/SAP-samples/cloud-cap-samples
learn about next steps at https://cap.cloud.sap
.
├── README.md
├── app
│   ├── _i18n
│   │   ├── i18n.properties
│   │   └── i18n_de.properties
│   ├── admin-books
│   │   ├── fiori-service.cds
│   │   └── webapp
│   ├── appconfig
│   │   └── fioriSandboxConfig.json
│   ├── browse
│   │   ├── fiori-service.cds
│   │   └── webapp
│   ├── common.cds
│   ├── index.html
│   └── services.cds
├── db
│   ├── data
│   │   ├── sap.capire.bookshop-Authors.csv
│   │   ├── sap.capire.bookshop-Books.csv
│   │   ├── sap.capire.bookshop-Books_texts.csv
│   │   └── sap.capire.bookshop-Genres.csv
│   └── schema.cds
├── eslint.config.mjs
├── package.json
└── srv
    ├── admin-service.cds
    ├── admin-service.js
    ├── cat-service.cds
    └── cat-service.js

11 directories, 20 files
```

### Examining the 'using' references

In `app/admin-books/fiori-service.cds` there's this:

```cds
using { AdminService } from '../../srv/admin-service.cds';
using { sap.capire.bookshop } from '../../db/schema';
...
```

So `AdminService` is being imported from `../../srv/admin-service.cds`, which looks like this:

```cds
using { sap.capire.bookshop as my } from '../db/schema';
service AdminService @(requires:'admin') {
  entity Books as projection on my.Books;
  entity Authors as projection on my.Authors;
}
```

In turn, the entities here are from the `sap.capire.bookshop` namespace which is imported from `../db/schema`, which looks like this:

```cds
using { Currency, managed, sap } from '@sap/cds/common';
namespace sap.capire.bookshop;

entity Books : managed {
   ...
}
```

And `Currency`, `managed` and `sap` are imported from the module `@sap/cds/common`, a file (`common.cds`) within the `@sap/cds` module, which (at this point) is available in the globally installed `@sap/cds-dk` module location (as we haven't performed a project-local `npm install` yet), and looks like this (heavily redacted):

```cds
type Currency : Association to sap.common.Currencies;
...
aspect managed {
  createdAt  : Timestamp @cds.on.insert : $now;
  createdBy  : User      @cds.on.insert : $user;
  modifiedAt : Timestamp @cds.on.insert : $now  @cds.on.update : $now;
  modifiedBy : User      @cds.on.insert : $user @cds.on.update : $user;
}
...
```

### Visualising the navigation path

Here's what these relations (and navigations) look like in "diagram" form (thanks to [ASCIIFlow]):

```text
+-----------------------------+
|app/admin/fiori-service.cds  |
+-----------------------------+
|using ... from               |
|'../../srv/admin-service.cds'|
|             |              1|
+-------------|---------------+   +-----------------------------+
              +-------------------|srv/admin-service.cds        |
                                  +-----------------------------+
                                  |using ... from               |
                                  |'../db/schema.cds'           |
                                  |            |               2|
+-----------------------------+   +------------|----------------+
|db/schema.cds                |----------------+
+-----------------------------+
|using ... from               |
|'@sap/cds/common'            |
|             |              3|
+-------------|---------------+   +-----------------------------+
              +-------------------|@sap/cds/common              |
                                  +-----------------------------+
                                  |type Currency ...            |
                                  |aspect managed { ... }       |
                                  |                            4|
                                  +-----------------------------+
```

> As mentioned earlier, the `@sap/cds/common` resource is a file called `common.cds` within the `@sap/cds` module.

What's notable is that these relations are expressed differently each time:

- the first points to `../../srv/admin-service.cds` which has an explicit `.cds` extension
- the second points to `../db/schema` which has no extension
- the third points to a Node.js module based resource `@sap/cds/common`, again with no extension specified

Here's a quick demo of how that navigation path can be followed in VS Code, with the [SAP CDS Language Support] extension:

![navigation in VS Code](/images/2025/08/vscode-nav.gif)

## Making CDS model navigation work in Neovim

With the `@sap/cds-lsp` language server in play, plus the Tree-sitter queries for CDS, I have a good experience in Neovim already (see [A modern and clean Neovim setup for CAP Node.js - configuration and diagnostics]).

However, using the standard [gf] mechanism left me wanting, due to the types of navigation target and the vagaries of how they are expressed. With a little configuration though, (which is still experimental at this stage, as I'm still learning) I've improved the situation.

I added some [ftplugin] configuration specific to CDS files, in an `after/ftplugin/cds.lua` file within my Neovim config, and it looks like this:

```lua
-- Settings to be able to navigate to cds resources in Node.js modules

-- Given a path p, add it to the 'path' if it exists
local addpath = function(p)
  if vim.uv.fs_stat(p) then vim.opt.path:append(p) end
end

-- Auto add .cds extension to files if necessary when nav with gf
vim.opt.suffixesadd = '.cds'

-- Ensure that the literal @ symbol is treated as part of a filename
-- (required as the CAP module names are in the @sap namespace)
vim.opt.isfname:append '@-@'

-- The standard module location
local moduledir = '/node_modules'

-- If a project-local npm install has been executed then projpath
-- will reflect the project-local node_modules dir
local projpath = vim.fs.root(0, 'package.json') .. moduledir

-- We can also add the CAP global based node_modules dir,
-- based on the location of the 'cds' executable
local cdsdkpath = vim.fs.dirname(vim.fn.exepath('cds'))
    .. '/../lib/node_modules/@sap/cds-dk'
    .. moduledir

-- Add them if they exist
addpath(projpath)
addpath(cdsdkpath)
```

Here's a quick summary:

I have a simple function `addpath` which will add a (path) value to `path` option, which the help describes as "a list of directories which will be searched when using `gf` ... and other commands". The function uses [uv.fs_stat] to ensure the directory actually exists before adding it.

The `suffixesadd` option (via [vim.opt.suffixesadd]) is also related to the use of `gf` and is a "comma-separated list of suffixes, which are used when searching for a file for the `gf`, `[I`, etc. commands". So here I add `.cds` to this option for the case where an extension isn't given - like in this case:

```cds
using { sap.capire.bookshop as my } from '../db/schema';
```

> The extension is omitted here as a sort of CAP best practice, and could in fact be `.csn`, the compiled machine-readable equivalent of CDL (the human-readable language used in CDS model files). But I'll cross that bridge when I come to it.

That's it with regards to handling navigation to other CDS model files. But navigation to Node.js modules requires a bit more fettling.

The CAP modules are all in the `sap` namespace. Namespaces, or [scopes], are prefixed with the `@` symbol (as in `@sap/cds`, for example). When modules are installed, in the `node_modules/` directory, the `@`-prefixed namespace forms part of the directory structure. So in this `sample` project, after running `npm install`, here's where `@sap/cds/common` is to be found:

```text
node_modules/
├── @cap-js
│   ├── cds-types
│   │   ├── ...
│   │   └── scripts
│   ├── db-service
│   │   ├── ...
│   │   └── package.json
│   └── sqlite
│       ├── ...
│       └── package.json
└── @sap
    └── cds
        ├── CHANGELOG.md
        ├── LICENSE
        ├── README.md
        ├── _i18n
        ├── app
        ├── bin
  --->  ├── common.cds
        ├── eslint.config.mjs
        ├── lib
        ├── libx
        ├── package.json
        ├── server.js
        ├── srv
        └── tasks
```

That means I need to add the literal `@` symbol to the [isfname] option, which denotes the characters included in filenames. If we look at the default value for `isfname` (with `:set isfname?`) we see this:

```text
@,48-57,/,.,-,_,+,,,#,$,%,~,=
```

But `@` here represents "alpha characters", and to have the actual `@` symbol included, one needs to add `@-@`.

Once that is done, it's just a question of determining:

- the CAP Node.js project's root directory (with `vim.fs.root(0, 'package.json')`)
- the location of the globally installed `@sap/cds-dk` module, based on where the `cds` executable can be found

Then, `/node_modules` is appended to each, and they're both passed to the `addpath` function defined earlier.

Once either or both these paths are in the `path` option (depending on whether they exist or not), `gf` based navigation can proceed successfully!

## Wrapping up

This was a quick configuration hack in an area of Neovim (well, Vim, I guess) that I hadn't previously much experience in. So it may need some more tweaking. But for now, it works well, as shown here:

![navigation in Neovim](/images/2025/08/neovim-nav.gif)

> In VS Code each newly navigated-to resource was opened in a separate tab by default. In Neovim they're opened in the same buffer, so to return to the previous resource in the "jump list" one can use `ctrl-o`.

## See also

- [A modern and clean Neovim setup for CAP Node.js - configuration and diagnostics]
- [Excluding specific diagnostics in Neovim]

[A modern and clean Neovim setup for CAP Node.js - configuration and diagnostics]: /blog/posts/2025/06/10/a-modern-and-clean-neovim-setup-for-cap-node.js-configuration-and-diagnostics/
[Excluding specific diagnostics in Neovim]: /blog/posts/2025/08/04/excluding-specific-diagnostics-in-neovim/
[Neovim configuration for file and module navigation in CDS models]: /blog/posts/2025/08/06/neovim-configuration-for-file-and-module-navigation-in-cds-models/
[Aspects]: https://cap.cloud.sap/docs/about/best-practices#aspects
[sample]: https://cap.cloud.sap/docs/tools/cds-cli#sample
[ASCIIFlow]: https://asciiflow.com/#/
[SAP CDS Language Support]: https://marketplace.visualstudio.com/items?itemName=SAPSE.vscode-cds
[gf]: https://neovim.io/doc/user/editing.html#gf
[ftplugin]: https://neovim.io/doc/user/usr_41.html#_writing-a-filetype-plugin
[uv.fs_stat]: https://neovim.io/doc/user/lua.html#vim.fs.exists()
[vim.opt.suffixesadd]: https://neovim.io/doc/user/options.html#'suffixesadd'
[scopes]: https://docs.npmjs.com/about-scopes
[isfname]: https://neovim.io/doc/user/options.html#'isfname'
[A modern and clean Neovim setup for CAP Node.js - configuration and diagnostics]: /blog/posts/2025/06/10/a-modern-and-clean-neovim-setup-for-cap-node.js-configuration-and-diagnostics/
[Excluding specific diagnostics in Neovim]: /blog/posts/2025/08/04/excluding-specific-diagnostics-in-neovim/
[Neovim configuration for file and module navigation in CDS models]: /blog/posts/2025/08/06/neovim-configuration-for-file-and-module-navigation-in-cds-models/
