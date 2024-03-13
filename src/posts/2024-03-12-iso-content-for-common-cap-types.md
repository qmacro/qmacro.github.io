---
layout: post
title: ISO content for common CAP types
date: 2024-03-12
tags:
  - cap
  - iso
---
There's an NPM package that provides default content based on the ISO specifications for CAP common types for countries, languages, currencies and timezones. In this post I explore what that package is and how it works. The post is quite long, mostly because I fell down a rabbit hole and was stuck there for quite a while. Hopefully though it's something you might enjoy. Happy exploring!

# Background

Earlier this month in [part 7](https://www.youtube.com/watch?v=kgycosxv9aQ) of our [back to basics Hands-on SAP Dev live stream series on CAP Node.js](https://www.youtube.com/playlist?list=PL6RpkC85SLQBHPdfHQ0Ry2TMdsT-muECx), we added a new element `countryOfBirth` to the `Authors` entity definition, so that our simple `services.cds` looked like this:

```text
using { cuid, Country } from '@sap/cds/common';

service bookshop {
  entity Books : cuid {
    title: String;
  }
  entity Authors : cuid {
    name: String;
    countryOfBirth: Country;
  }
}
```

This resulted in the generation of lots of DDL for a persistence layer, based on the definition of that `Country` type, which, in `@sap/cds/common`, looks like this (and I've also included here the definitions that are used to describe that type):

```text
type Country : Association to sap.common.Countries;

context sap.common {

  entity Countries : CodeList {
    key code : String(3) @(title : '{i18n>CountryCode}');
  }

  aspect CodeList @(
    cds.autoexpose,
    cds.persistence.skip : 'if-unused'
  ) {
    name  : localized String(255)  @title : '{i18n>Name}';
    descr : localized String(1000) @title : '{i18n>Description}';
  }

}
```

As a result of referring to the `Country` type in `@sap/cds/common`, we saw this in the output of `cds watch`:

```text
[cds] - loaded model from 2 file(s):

  services.cds
  [...]/node_modules/@sap/cds/common.cds
```

> See the "Appendix - loading @sap/cds/common" section for an explanation of why `[...]` has been used as a path prefix indicator here.

## New entity sets

Additionally, we saw that as well as entity sets for the `Books` and `Authors` entities, the OData service also contained two more entity sets, as we can see from the service document (which can be obtained with `curl localhost:4004/odata/v4/bookshop | jq .`):

```json
{
  "@odata.context": "$metadata",
  "@odata.metadataEtag": "W/\"l+enQJd57takPctEB4NIbv/1U6KLaLMKeKijx7AfnOo=\"",
  "value": [
    {
      "name": "Books",
      "url": "Books"
    },
    {
      "name": "Authors",
      "url": "Authors"
    },
    {
      "name": "Countries",
      "url": "Countries"
    },
    {
      "name": "Countries_texts",
      "url": "Countries_texts"
    }
  ]
}
```

as well as in the CAP server landing page:

![The CAP server landing page showing the Books, Authors and Countries entity sets](/images/2024/03/cap-server-landing-page.png)

> For those of you wondering why `Countries_texts` is not listed in the CAP server landing page, there's an interesting reason, but that's a story for another time.

## What about the data?

The response to an OData query operation on the `Countries` entity set looked, however, like this:

```json
{
  "@odata.context": "$metadata#Countries",
  "value": []
}
```

No data.

On the one hand, that's understandable, we haven't supplied any. But on the other hand (and like the discussion which took place at the time mentioned) it would be great to have that data. Not only for the `Country` type, but also for the other CAP [common reuse types](https://cap.cloud.sap/docs/cds/common#code-types) Currency, Language and Timezone.

After all, that data is standard, predictable and pretty much static. It's also something that we all take for granted in R/3 systems, for example, in these tables (and their related `-T` suffixed language-dependent siblings):

* `T005` (countries)
* `TCUR` (currencies)
* `T002` (languages)
* `TTZZ` (timezones)

In the out-of-the-box provisions from CAP, we don't have this data. But we do have the data in the form of a standard installable NPM package!

I'd totally forgotten about this, which is why I failed to mention it while we were discussing the question. So as a penance (not sure whether to me as the writer of this post, or to you as the reader, sorry) I'm writing up the details here now.

# NPM package @sap/cds-common-content

The NPM package [@sap/cds-common-content](https://www.npmjs.com/package/@sap/cds-common-content) _"holds default content based on the ISO specification"_ for these exact types. Bingo! 

The simplest way to make use of this package is to add it to your project:

```shell
npm add @sap/cds-common-content
```

and then add a `using` directive in your CDS, such as:

```text
using from '@sap/cds-common-content';
```

> I prefer the semantics of invoking `npm add` over `npm install`, but as `add` is just an alias for `install`, it's all the same under the `npm` hood anyway.

This all seems quite straightforward. So let's now move away from the customised bookshop project from the live stream series and start with a super simple example project, where we'll see how easy it is to get the data to appear. And it will seem like magic! Then we'll dig in to how it actually works, which will help us understand that bit more about how CAP works. And that's always a bonus, right?

## Simple example

So, moving away from the authors and books in the previous `services.cds` file, we'll start with a brand new CAP project for this simple example, so you can follow along too if you want.

### Initialising a new CAP project with tiny-sample

While initialising the new project, we'll use the `--add` option to request the addition of the "tiny-sample" facet which gives us a super simple service exposing a single `Books` entity, complete with a couple of data records supplied in a CSV file.

Here's an example of doing that, with the use of the `tree` command at the end to show the contents of the new project directory (excluding the hidden files):

```shell
# /home/user/work/scratch
; cds init --add tiny-sample iso-data-test
Creating new CAP project in ./iso-data-test

Adding feature 'nodejs'...
Adding feature 'tiny-sample'...

Successfully created project. Continue with 'cd iso-data-test'.
Find samples on https://github.com/SAP-samples/cloud-cap-samples
Learn about next steps at https://cap.cloud.sap
# /home/user/work/scratch
; cd iso-data-test/
# /home/user/work/scratch/iso-data-test
; tree -F
.
|-- README.md
|-- app/
|-- db/
|   |-- data/
|   |   `-- my.bookshop-Books.csv
|   `-- data-model.cds
|-- package.json
`-- srv/
    `-- cat-service.cds

5 directories, 5 files
# /home/user/work/scratch/iso-data-test
;
```

> The `-F` option tells `tree` to use standard symbols to signify special files, as I want to highlight directories with a trailing `/`. This `-F` works in a similar way to the same-named option with the `ls` command.

The persistence layer definitions in `db/data-model.cds` look like this:

```text
namespace my.bookshop;

entity Books {
  key ID : Integer;
  title  : String;
  stock  : Integer;
}
```

and the service layer definitions in `srv/cat-service.cds` look like this:

```text
using my.bookshop as my from '../db/data-model';

service CatalogService {
    @readonly entity Books as projection on my.Books;
}
```

Nothing unexpected there, all nice and straightforward.

### Basic output from cds watch

Starting the CAP server up at this point, we see (amongst other log lines):

```text
[cds] - loaded model from 2 file(s):

  srv/cat-service.cds
  db/data-model.cds

[cds] - connect to db > sqlite { database: ':memory:' }
  > init from db/data/my.bookshop-Books.csv
/> successfully deployed to in-memory database.
```

And the service document at `http://localhost:4004/odata/v4/catalog` looks like this:

```json
{
  "@odata.context": "$metadata",
  "@odata.metadataEtag": "W/\"8PKoOs3VhYwQoFzBoQObhMsFJJa5jpD1GLFcWZG9r60=\"",
  "value": [
    {
      "name": "Books",
      "url": "Books"
    }
  ]
}
```

So far so good.

We've covered this in the [back to basics series](https://www.youtube.com/playlist?list=PL6RpkC85SLQBHPdfHQ0Ry2TMdsT-muECx) but it's worth re-iterating here too ... the reason why we see these two files specifically:

```text
srv/cat-service.cds
db/data-model.cds
```

listed in the sources for the CDS model being served (see the "loaded model from 2 file(s)" message in the log output above), is that they're in some specially named directories (`db/` and `srv/`) that form part of CAP's convention-over-configuration approach to doing the right thing by developers. On startup, the server will automatically look in certain "well-known" locations for CDS definitions. What are these "well-known" locations?

You can ask to see them like this:

```shell
cds env folders
```

which emits:

```text
{ db: 'db/', srv: 'srv/', app: 'app/' }
```

In fact, there's another environment value which it's possible to query, and that is `roots`:

```shell
cds env roots
```

and the value returned:

```text
[ 'db/', 'srv/', 'app/', 'schema', 'services' ]
```

contains these three directory names, plus two special filenames `services` and `schema`, which we can interpret as `services.cds` and `schema.cds` respectively.

💡 This is incidentally why, in the simple [capb2b](https://github.com/qmacro/capb2b) project we're using for the early episodes in the back to basics series, simply [putting all our content into a file called services.cds](https://github.com/qmacro/capb2b/blob/aac1f7304e3d0884cfe837c3b0bbd4e6bf98a848/services.cds) works!

### Adding an element with the Country type

Now to start moving towards the use of the `Country` type. 

First, let's add an element to the `Books` entity definition to show where a book was published. We'll do this (and other enhancements in this experiment) in a separate CDS file, to remind ourselves of how well thought out and capable the CDS language and compilation process is.

In a new file, let's call it `db/publicationinfo.cds`, let's add this:

```text
using from './data-model';
using { Country } from '@sap/cds/common';

extend my.bookshop.Books with {
    publishedIn: Country;
}
```

* The first `using` directive just imports the definitions from the existing `db/data-model.cds` file, i.e. the `Books` entity in the `my.bookshop` namespace. With this first `using` directive we can then refer to the `my.bookshop.Books` entity, as we do with the `extend` directive shortly.
* The second `using` directive is to bring in the definition of the [Country reuse type](https://cap.cloud.sap/docs/cds/common#type-country) from `@sap/cds/common`. This is so we can use this `Country` type to describe the new element we're adding to the `my.bookshop.Books` entity.
* Then in the `extend` directive we can simply add the new `publishedIn` element and define it as having the `Country` type. We already know about how this type is defined from the background section earlier.

As the CAP server is still running in "watch" mode, things restart and now we see something like this:

```text
[cds] - loaded model from 4 file(s):

  srv/cat-service.cds
  db/publicationinfo.cds
  [...]/node_modules/@sap/cds/common.cds
  db/data-model.cds

[cds] - connect using bindings from: { registry: '~/.cds-services.json' }
[cds] - connect to db > sqlite { database: ':memory:' }
  > init from db/data/my.bookshop-Books.csv
/> successfully deployed to in-memory database.
```

The log output here shows us that there are two new files in the list from which the model has been loaded:

```text
db/publicationinfo.cds
[...]/node_modules/@sap/cds/common.cds
```

What's happened of course is that a new file, `publicationinfo.cds`, is discovered in the well-known `db/` directory. So that is loaded and added to the overall model compilation. And within that file, the `using { Country } from '@sap/cds/common';` directive causes the corresponding file from that (built-in) NPM package `@sap/cds/common` to be loaded too. Nice!

And now the CAP server has restarted, serving the new enhanced overall model, we see with a request like this:

```shell
curl -s localhost:4004/odata/v4/catalog | jq .
```

that the OData service document now sports the `Countries` and `Countries_texts` entity sets too (because, briefly, `sap.common.Countries` is defined as an entity in `[...]/node_modules/@sap/cds/common.cds` and therefore is exposed as an entity set in the OData service):

```json
{
  "@odata.context": "$metadata",
  "@odata.metadataEtag": "W/\"2n4HnZUJly4q6xyptJ6+4ZptvIICSUNdpk6NYX73bGY=\"",
  "value": [
    {
      "name": "Books",
      "url": "Books"
    },
    {
      "name": "Countries",
      "url": "Countries"
    },
    {
      "name": "Countries_texts",
      "url": "Countries_texts"
    }
  ]
}
```

Again. So far, so good.

### Starting to look at the data

We have some books data, courtesy of the two CSV records that came as part of the "tiny-sample" facet, which we can see with:

```shell
curl -s localhost:4004/odata/v4/catalog/Books | jq .
```

which returns this entity set response:

```json
{
  "@odata.context": "$metadata#Books",
  "value": [
    {
      "ID": 1,
      "title": "Wuthering Heights",
      "stock": 100,
      "publishedIn_code": null
    },
    {
      "ID": 2,
      "title": "Jane Eyre",
      "stock": 500,
      "publishedIn_code": null
    }
  ]
}
```

> Those eagle-eyed amongst you might be wondering about the `publishedIn_code` property. That's one that's been auto-generated as a result of CAP's excellent [managed associations](https://cap.cloud.sap/docs/guides/domain-modeling#associations) constructs.
> 
> Here, specifically, it comes from the combination of the `Country` type used to describe the `publishedIn` element:
>
> ```text
> extend my.bookshop.Books with {
>     publishedIn: Country;
> }
> ```
>
> and the very definition of `Country` which is a [managed "to-one" association](https://cap.cloud.sap/docs/guides/domain-modeling#managed-1-associations) as we have already seen:
>
> ```text
> type Country : Association to sap.common.Countries;
> ```
>
> This results in, amongst other things, a foreign-key relationship being needed, and being realised via the construction of a property for this, made up of the names of the two elements in the relationship, i.e.
> * `publishedIn` (the new element in `my.bookshop.Books`)
> * `code` (the key element in `sap.common.Countries`)
> 
> joined with an `_` underscore character to become `publishedIn_code`.

However, we don't yet have any country data. Requesting the equivalent entity set like this:

```shell
curl -s localhost:4004/odata/v4/catalog/Countries | jq .
```

returns a rather sad and empty looking entity set:

```json
{
  "@odata.context": "$metadata#Countries",
  "value": []
}
```

So ... `@sap/cds-common-content` to the rescue!

### Using @sap/cds-common-content

Like we saw earlier, this can be brought into the project simply by adding it as a package. So let's do that now:

```shell
npm add @sap/cds-common-content
```

After seeing output like this:

```text
added 115 packages, and audited 116 packages in 17s

21 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

we see that `package.json` now has the package listed in the `dependencies` section:

```json
{
  "name": "iso-data-test",
  "version": "1.0.0",
  "description": "A simple CAP project.",
  "repository": "<Add your repository here>",
  "license": "UNLICENSED",
  "private": true,
  "dependencies": {
    "@sap/cds": "^7",
    "@sap/cds-common-content": "^1.4.0",
    "express": "^4"
  },
  "devDependencies": {
    "@cap-js/sqlite": "^1"
  },
  "scripts": {
    "start": "cds-serve"
  }
}
```

and the rest of the dependencies have been installed too (through a more general NPM install side-effect) - we can see this with `npm list`; here's an example invocation:

```shell
; npm list
iso-data-test@1.0.0 /home/user/work/scratch/iso-data-test
+-- @cap-js/sqlite@1.5.1
+-- @sap/cds-common-content@1.4.0
+-- @sap/cds@7.7.2
`-- express@4.18.3
```

So now, to actually make use of this package and what it brings, we have to add a `using` directive, as we saw earlier.

Let's add that to the `db/publicationinfo.cds` file, like this:

```text
using from './data-model';
using { Country } from '@sap/cds/common';
using from '@sap/cds-common-content';     // <--

extend my.bookshop.Books with {
    publishedIn: Country;
}
```

As the CAP server is still running in "watch" mode, it restarts, and 💥 what an explosion of log output!

```text
[cds] - loaded model from 6 file(s):

  srv/cat-service.cds
  db/publicationinfo.cds
  node_modules/@sap/cds-common-content/index.cds
  db/data-model.cds
  node_modules/@sap/cds-common-content/db/index.cds
  node_modules/@sap/cds/common.cds

[cds] - connect using bindings from: { registry: '~/.cds-services.json' }
[cds] - connect to db > sqlite { url: ':memory:' }
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_zh_TW.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_zh_CN.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_tr.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_th.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_sv.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_ru.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_ro.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_pt.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_pl.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_no.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_nl.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_ms.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_ko.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_ja.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_it.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_hu.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_fr.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_fi.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_es_MX.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_es.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_en.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_de.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_da.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_cs.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries_texts_ar.csv
  > init from node_modules/@sap/cds-common-content/db/data/sap-common-Countries.csv
  > init from db/data/my.bookshop-Books.csv
/> successfully deployed to in-memory database.
```

Wow! What's more, we now have country data in the `Countries` entity set:

```shell
curl -s 'localhost:4004/odata/v4/catalog/Countries?$top=5' \
  | jq .
```

```shell
{
  "@odata.context": "$metadata#Countries",
  "value": [
    {
      "name": "Andorra",
      "descr": "Andorra",
      "code": "AD"
    },
    {
      "name": "Utd Arab Emir.",
      "descr": "United Arab Emirates",
      "code": "AE"
    },
    {
      "name": "Afghanistan",
      "descr": "Afghanistan",
      "code": "AF"
    },
    {
      "name": "Antigua/Barbuda",
      "descr": "Antigua and Barbuda",
      "code": "AG"
    },
    {
      "name": "Anguilla",
      "descr": "Anguilla",
      "code": "AI"
    }
  ]
}
```

That's fab. But. What's going on? Where is this coming from? How does this work?

### Digging in to what's happening

Let's take a bit of time to figure out how this is all working, and why we now have country data.

We added a single line to the CDS model:

```text
using from '@sap/cds-common-content';
```

What did the addition of this line actually do to cause that explosion of change and the appearance of ISO country data?


Well, our first clue is the extra entries that now are appearing in the list of files from which the CDS model is constructed:

```text
[cds] - loaded model from 6 file(s):

  srv/cat-service.cds
  db/publicationinfo.cds
  node_modules/@sap/cds-common-content/index.cds
  db/data-model.cds
  node_modules/@sap/cds-common-content/db/index.cds
  node_modules/@sap/cds/common.cds
```

Working through them, we first see our base files:

```text
srv/cat-service.cds
db/data-model.cds
```

We also see the two extra files that were picked up once we added the `db/publicationinfo.cds` file which itself summoned the `@sap/cds/common` content:

```text
db/publicationinfo.cds
node_modules/@sap/cds/common.cds
```

> At this point I've stopped being deliberately vague (with `[...]`) about the specific location of the files in `node_modules/`, because it's worth highlighting here something that has changed. The `npm add` action just before caused the rest of the packages (defined in `package.json`) to be installed in the project. This means that there's now a project-local `node_modules/` directory containing everything that this project needs, including all the `@sap` prefixed NPM packages.
>
> A quick `tree -F -L 3` shows the directory structure containing those resources (I've removed some of the output for brevity):
> 
> ```text
> ./
> |-- README.md
> |-- app/
> |-- db/
> |   |-- data/
> |   |   `-- my.bookshop-Books.csv
> |   |-- data-model.cds
> |   `-- publicationinfo.cds
> |-- node_modules/
> |   |-- @cap-js/
> |   |   |-- cds-types/
> |   |   |-- db-service/
> |   |   `-- sqlite/
> |   |-- @sap/
> |   |   |-- cds/
> |   |   |-- cds-common-content/
> |   |   |-- cds-compiler/
> |   |   |-- cds-fiori/
> |   |   `-- cds-foss/
> |   |-- ...
> |   `-- yaml/
> |       |-- LICENSE
> |       |-- README.md
> |       |-- bin.mjs*
> |       |-- browser/
> |       |-- dist/
> |       |-- package.json
> |       `-- util.js
> |-- package-lock.json
> |-- package.json
> `-- srv/
>     `-- cat-service.cds
> ```
>
> So this means that the `@sap/cds/common` package is being loaded now from the project-local set of packages, i.e. in `node_modules/` relative to the project directory (i.e. `./node_modules/`) and not the global NPM package area any more.
>
> This in turn means that the full (relative) path to this file now in the list is clean and short(er):
> ```text
> node_modules/@sap/cds/common.cds
> ```

OK, so we know why these four of the six files are being loaded, and where from:

```text
srv/cat-service.cds
db/data-model.cds
db/publicationinfo.cds
node_modules/@sap/cds/common.cds
```

So what about the other two in the list:

```text
node_modules/@sap/cds-common-content/index.cds
node_modules/@sap/cds-common-content/db/index.cds
```

which are now also being brought in to construct the model?

Well, given the "cds-common-content" that appears in the path of these files, we can be pretty certain that they're related to this single line we just added:

```text
using from '@sap/cds-common-content';
```

so what is actually happening here?

Well, if we look a bit deeper inside the `@sap/cds-common-content` package, like this:

```shell
tree -F -L 2 node_modules/@sap/cds-common-content
```

there's a bit of a clue in the output, especially if we're familiar with CAP's [Reuse and Compose](https://cap.cloud.sap/docs/guides/extensibility/composition) concepts:

```text
node_modules/@sap/cds-common-content/
|-- CHANGELOG.md
|-- LICENSE
|-- README.md
|-- db/
|   |-- index.cds
|   `-- data/
|-- index.cds
`-- package.json

3 directories, 6 files

```

Look at those `index.cds` files. The [Using index.cds Entry Points](https://cap.cloud.sap/docs/guides/extensibility/composition#index-cds) section of the Reuse and Compose section of the Capire documentation says this, in the context of a `using` directive like we have here (i.e. `using from '@sap/cds-common-content';`):

_"The `using from` statements assume that the imported packages provide `index.cds` in their roots as [public entry points](https://cap.cloud.sap/docs/guides/extensibility/composition#entry-points), which they do."_

So, that means that the `using` directive will cause this file:

```text
node_modules/@sap/cds-common-content/index.cds
```

to also be loaded and its CDS contents added into the overall model construction. So what's in this file? This:

```text
using from './db';
```

🐇 [Curiouser and curiouser](https://en.wikipedia.org/wiki/Alice%27s_Adventures_in_Wonderland)!

So let's now follow _this_ `using` directive, the resource reference within which should be interpreted as local to the containing `index.cds` file, i.e. we're now going to follow this path to `./db/`, which _also_ contains an `index.cds`:

```text
node_modules/@sap/cds-common-content/
|-- CHANGELOG.md
|-- LICENSE
|-- README.md
|-- db/
|   |-- index.cds  <--------------------+
|   `-- data/                           |
|-- index.cds  -- using from './db'; ---+
`-- package.json
```

So what's in `./db/index.cds`? This:

```text
using sap.common.Languages from '@sap/cds/common';
using sap.common.Countries from '@sap/cds/common';
using sap.common.Currencies from '@sap/cds/common';
using sap.common.Timezones from '@sap/cds/common';
```

Ooh! 

What is the effect of doing this? Well it has a direct effect and a sort of side-effect too.

The direct effect is that all four entity definitions referenced in this `./db/index.cds` file, that is to say these four:

* `sap.common.Languages`
* `sap.common.Countries`
* `sap.common.Currencies`
* `sap.common.Timezones`

are added to the overall model. 

But the side-effect is that the `./db/data/` directory here also becomes a candidate location for the automatic [provision of initial data](https://cap.cloud.sap/docs/guides/databases#providing-initial-data)!

And what's in that `./db/data/` directory? Let's have a look:

```shell
ls node_modules/@sap/cds-common-content/db/data/
```

Lots and lots of CSV files (I've cut the list down to just a few here):

```text
./                                     sap-common-Languages_texts_cs.csv
../                                    sap-common-Languages_texts_da.csv
sap-common-Countries.csv               sap-common-Languages_texts_de.csv
sap-common-Countries_texts.csv         sap-common-Languages_texts_en.csv
sap-common-Countries_texts_ar.csv      sap-common-Languages_texts_es.csv
sap-common-Countries_texts_zh_CN.csv   sap-common-Timezones_texts_cs.csv
sap-common-Countries_texts_zh_TW.csv   sap-common-Timezones_texts_da.csv
sap-common-Currencies.csv              sap-common-Timezones_texts_de.csv
sap-common-Currencies_texts.csv        sap-common-Timezones_texts_el.csv
sap-common-Currencies_texts_ar.csv     sap-common-Timezones_texts_en.csv
...
```

And we know what happens with initial data, for those entities whose namespaced-names match up with CSV filenames in directories such as these - the data is automatically imported to become data for those entities!

Notice too that for each of the four entities, there is a single CSV file containing the core data, and multiple CSV files for the corresponding [localized](https://cap.cloud.sap/docs/guides/localized-data#declaring-localized-data) elements, in accompanying `_texts*` suffixed files. 

Here's one example, for the `sap.common.Countries` entity. A neat list of the intial CSV data files for this entity can be retrieved with:

```shell
cd node_modules/@sap/cds-common-content/db/data/ \
  && ls -1 sap-common-Countries*.csv
```

which produces:

```text
sap-common-Countries.csv
sap-common-Countries_texts.csv
sap-common-Countries_texts_ar.csv
sap-common-Countries_texts_cs.csv
sap-common-Countries_texts_da.csv
sap-common-Countries_texts_de.csv
sap-common-Countries_texts_en.csv
sap-common-Countries_texts_es.csv
sap-common-Countries_texts_es_MX.csv
sap-common-Countries_texts_fi.csv
sap-common-Countries_texts_fr.csv
sap-common-Countries_texts_hu.csv
sap-common-Countries_texts_it.csv
sap-common-Countries_texts_ja.csv
sap-common-Countries_texts_ko.csv
sap-common-Countries_texts_ms.csv
sap-common-Countries_texts_nl.csv
sap-common-Countries_texts_no.csv
sap-common-Countries_texts_pl.csv
sap-common-Countries_texts_pt.csv
sap-common-Countries_texts_ro.csv
sap-common-Countries_texts_ru.csv
sap-common-Countries_texts_sv.csv
sap-common-Countries_texts_th.csv
sap-common-Countries_texts_tr.csv
sap-common-Countries_texts_zh_CN.csv
sap-common-Countries_texts_zh_TW.csv
```

We can see the three groups of files for `sap.common.Countries`:

* the single core data file `sap-common-Countries.csv` containing values for the `code`, `name` and `descr` fields (in English as default).
* the single core localized data file `sap-common-Countries_texts.csv` - where the filename is not specific to an explicit locale - containing values for the `locale`, `code`, `name` and `descr` field. The language specific content is English by default.
* the multiple language-specific localized data files `sap-common-Countries_texts_<locale-identifier>.csv` containing the same data as the core localized file but with the texts translated into the language indicated by the locale-identifier in the file name.

You'll likely remember seeing a list of all these CSV files in the explosion of output from the running CAP server earlier.

And what's the outcome of this?

To find out, let's expand the core books data now to include values for the new `publishedIn_code` field at the persistence layer, so that the content of `db/data/my.bookshop-Books.csv` now looks like this:

```csv
ID;title;stock;publishedIn_code
1;Wuthering Heights;100;DE
2;Jane Eyre;500;HU
```

> Yes I know Wuthering Heights wasn't published in Germany, nor was Jane Eyre published in Hungary, but thank you for wondering about that.

Now, NOT ONLY (μέν) can we follow navigation properties to see the publication countries for our books, like this (note the country names "Germany" and "Hungary"):

```shell
curl \
    --silent \
    --url 'localhost:4004/odata/v4/catalog/Books?$expand=publishedIn' \
  | jq .
```

to get this:

```json
{
  "@odata.context": "$metadata#Books(publishedIn())",
  "value": [
    {
      "ID": 1,
      "title": "Wuthering Heights",
      "stock": 100,
      "publishedIn_code": "DE",
      "publishedIn": {
        "name": "Germany",
        "descr": "Germany",
        "code": "DE"
      }
    },
    {
      "ID": 2,
      "title": "Jane Eyre",
      "stock": 500,
      "publishedIn_code": "HU",
      "publishedIn": {
        "name": "Hungary",
        "descr": "Hungary",
        "code": "HU"
      }
    }
  ]
}
```

BUT ALSO (δέ) we can ask for this information in our own language (locale)! Here's an example, requesting the same resource but with a different locale (French), via standard HTTP headers:

> I'm fond of the [strong particle pairing](http://www.jowillmott.co.uk/simpleguide/notes/%CE%BC%CE%AD%CE%BD%E2%80%A6%CE%B4%CE%AD...) of μέν ... δέ which I first learned about as an important construct in Ancient Greek, and I find myself often using the (English) equivalent ("not only ... but also").

```shell
curl \
    --silent \
    --header 'Accept-Language: fr' \
    --url 'localhost:4004/odata/v4/catalog/Books?$expand=publishedIn' \
  | jq .
```

The representation of the resource requested is now different, in that the names of the countries are now in French ("Allemagne" and "Hungarie"):

```json
{
  "@odata.context": "$metadata#Books(publishedIn())",
  "value": [
    {
      "ID": 1,
      "title": "Wuthering Heights",
      "stock": 100,
      "publishedIn_code": "DE",
      "publishedIn": {
        "name": "Allemagne",
        "descr": "Allemagne",
        "code": "DE"
      }
    },
    {
      "ID": 2,
      "title": "Jane Eyre",
      "stock": 500,
      "publishedIn_code": "HU",
      "publishedIn": {
        "name": "Hongrie",
        "descr": "Hongrie",
        "code": "HU"
      }
    }
  ]
}
```

C'est vraiment magnifique!

Of course, one wouldn't often use an explicit `Accept-Language` header in an HTTP request, but think of what headers your browser sends by default when making requests, and think of what your French colleague's browser might send. Exactly!

# Wrapping up

OK, I think I've reached a point where I can now safely escape this rabbit hole of discovery. The bottom line is that there is a standard NPM package available that provides actual ISO data for the four CAP reuse types. You've learned how to use it, and what it provides. Moreover, you've learned how it provides what it does, and what goes on behind the scenes. That, hopefully, has given you a tiny bit more insight into the wonders of CAP.

And there's still so much more to discover. Until next time! 

---

# Appendix - loading @sap/cds/common

In the Background section earlier, the output of `cds watch` showed this line:

```text
  [...]/node_modules/@sap/cds/common.cds
```

The reason I included a `[...]` "prefix" was to signify that there will be a different path shown depending on whether an `npm install` of the project dependencies (which include `@sap/cds`) has been executed, or not.

If an `npm install` has been executed, then there will be a project-local `node_modules/` directory, and the `@sap/cds/common` resource will have been loaded from within there, i.e.

```text
./node_modules/@sap/cds/common.cds
```

If an `npm install` hasn't been executed, and we're running the CAP server from the NPM [globally installed](https://github.com/qmacro/capb2b/blob/20f9cebefd63f9d897eeb47b53634fd7416653b5/.devcontainer/Dockerfile#L11) `@sap/cds-dk` package, then it will have been loaded from that globally installed package location, and look something like this (depending on what your NPM global package management directory setup looks like):

```text
../../usr/local/share/npm-global/lib/
  node_modules/@sap/cds-dk/
  node_modules/@sap/cds/common.cds
```

> This location value would typically be shown in a single line; I've split the value up over a few lines purely for readability.

You can find out where your (normally globally installed) `@sap/cds-dk` package is, using the `cds env` command:

```shell
cds env _home_cds-dk
```

In the context of this particular dev container in which I'm working, this is the value that is emitted:

```text
'/usr/lib/node_modules/@sap/cds-dk/'
```
