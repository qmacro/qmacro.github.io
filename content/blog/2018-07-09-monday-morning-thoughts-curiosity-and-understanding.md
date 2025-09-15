---
title: "Monday morning thoughts: curiosity and understanding"
date: 2018-07-09
tags:
  - sapcommunity
  - mondaymorningthoughts
---

*In this post, I think about how curiosity can lead to a better
understanding of things, and give a specific example concerning CDS and
the new Application Programming Model for SAP Cloud Platform.*

On Friday I 
[tweeted something](/tweets/qmacro/status/1015254046079422465/)
that seemed to capture the interest of
some:

![](/tweets/qmacro/tweets_media/1015254046079422465-Dhbn7TIXUAEYdfN.jpg)


It was a discovery that was the result of a natural curiosity which I
think is part of my DNA, and I suspect a part of many folks' DNA here
in the SAP Community. With the advent of new technologies, I've often
wondered how things work, wondered about the underlying themes or
features that have been put together to form a greater whole. It's like
when you get a new device, and the first thing you do is to turn it
around, upside down, to look at the ports, and open it up to see what's
inside.

## Digging in

This curiosity has been especially prevalent in my various roles in the
SAP technology ecosphere. It's driven me to look deeper into things,
dive below the surface, primarily to find out how things work, but
equally to understand what the creators were thinking and why they made
the design decisions that they did. As a result, I've gained clarity,
enjoyed a richer understanding, and perhaps most subtly improved my view
of the bigger picture.

Merely asking myself "why" and "how" more often than not results in
a comprehension that really helps me. Not always directly - there are
plenty of occasions where I've "felt" something was the right
direction, or the wrong direction, not because of some innate sixth
sense, but because of the layers of information I've unearthed by
digging in, trying to get to the bottom of how certain things are put
together.

And so it was on Friday. It was the end of the day, and the end of a
long week, and a good opportunity to "reward myself" with a bit of
time to look into something that had been nagging me for a few weeks.

## The Application Programming Model and CDS

I've written about these subjects in this [Monday morning thoughts
series](/tags/mondaymorningthoughts/) before. In
fact, I have two posts, one on [programming
models](/blog/posts/2018/06/25/monday-morning-thoughts:-programming-models/)
and one on
[CDS](/blog/posts/2018/06/11/monday-morning-thoughts:-core-data-services/).
I'm fascinated by the fact that now I'm wearing my CDS tinted
spectacles I can see it everywhere. And I was intrigued by the
Application Programming Model's [Getting Started
tutorial](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/5ec8c983a0bf43b4a13186fcf59015fc.html),
in particular what was going on behind the scenes - what was the SAP Web
IDE doing for us as we progressed, what was being generated, and perhaps
most relevant for this post - \*how\*.

I decided to dig in a little and let my curiosity loose. Here's a part
of the journey I took, which resulted in the tweet.

The tutorial starts off in the "Start a Project" step with generating
a project using the template wizard, specifically choosing the "SAP
Cloud Platform Business Application". Notably, there's quite an array
of artefacts that appear from the get-go in the generated project. I was
curious about these, what they were, and where they came from,
particularly the db/data-model.cds and srv/my-service.cds files and
perhaps moreso the outermost package.json file, which contained this:

```json
{
    "name": "my.app",
    "description": "A simple data model for SAP CP application",
    "version": "1.0.0",
    "dependencies": {
        "@sap/cds": "2.x"
    },
    "scripts": {
        "build": "cds build --clean"
    },
    "private": true
}
```

There's an SAP NPM (Node Package Manager) registry at
<https://npm.sap.com> - I remember reading about it in a post
from sven.kohlhaas last year: "[SAP NPM Registry launched: Making the
lives of Node.js developers
easier](https://blogs.sap.com/2017/05/16/sap-npm-registry-launched-making-the-lives-of-node.js-developers-easier/)".

Moreover, I had seen, when previously going through the tutorial steps,
that in the "Compile OData Models" step of the tutorial, I saw output
appear in the SAP Web IDE console like this:

```log
7:31:05 AM (CDS) Using language server v1.4.10 and compiler v1.0.30

[...]

7:32:52 AM (DIBuild) Build of /bookshop in progress
7:33:03 AM (DIBuild) [INFO] Injecting source code into builder...
[INFO] Source code injection finished
[INFO] ------------------------------------------------------------------------
npm install
added 20 packages from 8 contributors in 0.809s
npm run build
> my.app@1.0.0 build /home/vcap/app/.java-buildpack/tomcat/temp/builder/sap.cds.mta/builds/build-253077567018682723/bookshop
> cds build --clean
This is CDS 2.3.2, Compiler 1.0.30, Home: node_modules/@sap/cds
Compiled 'db/data-model.cds' to  
  db/src/gen/.hdinamespace  
  db/src/gen/CATALOGSERVICE_AUTHORS.hdbcds  
  db/src/gen/CATALOGSERVICE_BOOKS.hdbcds  
  db/src/gen/CATALOGSERVICE_ORDERS.hdbcds  
  db/src/gen/MY_BOOKSHOP_AUTHORS.hdbcds  
  db/src/gen/MY_BOOKSHOP_BOOKS.hdbcds  
  db/src/gen/MY_BOOKSHOP_ORDERS.hdbcds
Compiled 'srv/my-service.cds' to  
  srv/src/main/resources/edmx/CatalogService.xml  
  srv/src/main/resources/edmx/csn.json

CDS return code: 0
7:33:16 AM (DIBuild) ********** End of /bookshop Build Log **********
```

Indeed, that first message "(CDS) Using language server \..." had
kicked off my thoughts in the [Monday morning thoughts post on Core Data
Services](/blog/posts/2018/06/11/monday-morning-thoughts:-core-data-services/).

Staring long enough at that output, it appears that the "Build CDS"
command in the SAP Web IDE triggered some sort of npm based process.

## Challenge accepted

Could it be that I could find
the `@sap/cds`
package in the NPM registry, install it manually in a terminal session,
and get to where I was here in the SAP Web IDE, but independent of it?

The answer was yes.

In my NPM configuration file (\~/.npmrc) I have only a single setting:

```text
prefix=/Users/i347491/.npm-packages
```

This means that globally installed packages end up there, rather than
some directory controlled by root, so I can avoid all that [tedious
mucking about in
hyperspace](http://hitchhikers.wikia.com/wiki/Infinite_Improbability_Drive)
aka sudo-ing to root.

Anyway, I added the SAP NPM registry to my config, crossed my fingers,
and asked for a global install of
the `@sap/cds`
package:

```shell
i347491@C02W52RKHV2Q:~
=> npm config set @sap:registry https://npm.sap.com

i347491@C02W52RKHV2Q:~
=> npm install -g @sap:cds
/Users/i347491/.npm-packages/bin/cds -> /Users/i347491/.npm-packages/lib/node_modules/@sap/cds/bin/cds.js
+ @sap/cds@2.3.2
added 20 packages in 5.732s

i347491@C02W52RKHV2Q:~
=> 
```

Happily, this ties up with part of the output we saw from the SAP Web
IDE console, specifically the 'npm install' command, in the context of
the package.json file directing, via the 'dependencies' section, that
version 2.x of `@sap/cds` package should be installed.

Immediately this gave me the 'cds' command, the output of which I
posted in my tweet, above.

Digging in a little more, I wondered about a couple of cds command
options: init, and build. I investigated with the help documentation
built into the command ('cds help init', and 'cds help build').

It turns out that 'cds init' will create a new project folder with
various artefacts, just like what happens with the template wizard.
There's even a '\--java' option for generating files for Java
development (in the 'srv' folder, by default). If you run through the
template wizard you'll see those files in the SAP Web IDE.

More interestingly perhaps was the cds command invoked via the 'npm run
build' command we saw in the SAP Web IDE console: specifically 'cds
build \--clean'. What does the help documentation tell us? Let's have
a look:

```shell
i347491@C02W52RKHV2Q:~ 
=> cds help build

SYNOPSIS

    cds build [<project>] [<options>]

    Builds all modules in the given or current project by compiling contained
    cds sources according to the module types. The modules are folders in the
    project root. All well known modules or those configured in package.json
    are built.

OPTIONS

    -in | --project <folder>

        use the specified folder as the project root.
        default = current working directory ./

    -c  | --clean

        deletes target folders before building modules.
        default = true

    -i  | --incremental

        do not delete target folders before building modules.

    -l  | --lang <languages> | all

        localize the models with given <languages>, a comma-separated list
        of language/locale codes or all.

    -o  | --dest <folder>

        writes output to the given folder.
        default = <project root>

EXAMPLES

   cds build
   cds build project -o _out


i347491@C02W52RKHV2Q:~ 
=> 
```

Gosh! This is exactly what I was looking for (even though I didn't
realise it at the outset). CDS's wonderful role as an abstraction layer
is very relevant here. The 'cds build' command seems to wrap the
default 'cds compile' command, compiling CDS sources to their targets.
What targets? Well, looking at the help documentation for the compile
command ('cds help compile') reveals all sorts of goodness relating to
targets such as CDL, EDMX, YAML and more.

Indeed, the rest of the output we saw in the console confirms this - the
db/data-model.cds file is compiled into 'hdbcds' files, which I can
repeat locally on my command line like this:

```shell
i347491@C02W52RKHV2Q:/tmp 
=> cds init testproject
i347491@C02W52RKHV2Q:/tmp 
=> cd testproject/
i347491@C02W52RKHV2Q:/tmp/testproject 
=> cds build --clean
This is CDS 2.5.1, Compiler 1.0.30, Home: ../../../Users/i347491/.npm-packages/lib/node_modules/@sap/cds

Compiled 'db/data-model.cds' to
  db/src/gen/.hdinamespace
  db/src/gen/MY_DATA_MODEL_FOO.hdbcds
  db/src/gen/MY_SERVICE_FOOSERVICE_FOO.hdbcds
Compiled 'srv/my-service.cds' to
  srv/src/main/resources/edmx/csn.json
  srv/src/main/resources/edmx/my.service.FooService.xml
i347491@C02W52RKHV2Q:/tmp/testproject 
=> 
```

What this tells me is that our hunch about CDS was not crazy:

> CDS -- a layer that has hitherto been largely understated -- has an identity, a version, all of its own. Even the CDS compiler has its own version. Rather than thinking about CDS as an amorphous blob of language that sits implicitly somewhere between the database and UI5 (especially Fiori Elements, with the annotations that CDS offers), CDS is very much something that we should sit up and pay attention to as an explicit part of SAP's development technology stack."

*-- from the Monday Morning Thoughts post on [Core Data Services](/blog/posts/2018/06/11/monday-morning-thoughts:-core-data-services/)*

<a name="another-win-for-curiosity"></a>
## Another win for curiosity

There's a meme out there which tickles me, because for me it's so true
in many ways:

![](/images/2018/07/Screen-Shot-2018-07-09-at-08.35.02.png)

(via [quickmeme.com](http://www.quickmeme.com/))

In this case, in trying to keep up, keep ahead, with technologies that I
think are important, I've stumbled across something that I was curious
about. And that curiosity caused me to investigate, with the journey and
end result fairly enlightening. My understanding of the area has
improved and my view of the surface relating to Core Data Services, the
build process, tools & approaches has become a little bit clearer. CDS
is something I should continue to pay attention to, and the tooling
promises to be wider than a single IDE. Additionally, it's clear that
the tooling is in a shape and colour that is so very not
SAP-proprietary - the NPM world in particular, and NodeJS in general.

I don't think I could have got this from simply reading documentation.
I often only have a chance to attain this level of understanding if I
bumble my way through things, finding the right path between knowing
what I know and don't know, awareness that there are things I don't
know that I don't know, and a restless curiosity.

I suspect there are many of you with a similar approach to things. What
are your experiences, how do you learn and increase your understanding?
Let me know in the comments. And in the meantime \... stay curious.

---

This post was brought to you by a refreshingly cool run in the early
Manchester sunrise, and [Pact Coffee's
Planalto](https://www.pactcoffee.com/coffees/planalto).

---

Read more posts in this series here: [Monday morning
thoughts](/tags/mondaymorningthoughts/).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/monday-morning-thoughts-curiosity-and-understanding/ba-p/13386230)
