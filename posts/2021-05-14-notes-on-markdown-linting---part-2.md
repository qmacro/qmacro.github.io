---
layout: post
title: Notes on Markdown linting - part 2
tags:
  - markdown
  - linting
---

_More on Markdown linting, this time in the context of GitHub Actions._

Yesterday I [wrote up some initial notes on my foray into Markdown linting](https://qmacro.org/2021/05/13/notes-on-markdown-linting-1/). Today I continue my journey of learning and discovery by attempting to get the Markdown linting working in a GitHub Action workflow, so I can have the checks done on pull requests.

Beyond creating the workflow definition itself, there are only a few parts to getting Markdown content linted in the context of a pull request:

* getting the content of the pull request, to be able to perform linting upon it
* setting up an association between any linting output messages with the lines of Markdown to which they relate
* installing the `markdownlint` tool and any custom rule packages
* performing the linting

## Creating the workflow definition

Since being able to quickly look at previous examples of GitHub Actions workflow definitions using my [workflow browser](https://qmacro.org/2021/04/24/github-actions-workflow-browser/), it was quite easy to create a simple workflow definition. Here's what the start looks like:

```yaml
name: Markdown checks

on:
  pull_request:
    branches: [main, master]

jobs:
  lint-markdown:
    runs-on: ubuntu-20.04

    steps:

    ...
```

> I've moved from specifying `ubuntu-latest` to `ubuntu-nn.nn` for a more stable (or perhaps "predictable") runner experience.

Nothing exciting in this workflow definition so far; I've included both `main` and `master` in the list of branches because I've been testing with an older repository that still has `master` as the default branch.

## Getting the pull request content

To run `markdownlint` on the content of the pull request, we need that in the runner workspace, and the usual use of the standard [actions/checkout](https://github.com/actions/checkout) action does the job here:

```yaml
    - uses: actions/checkout@v2
```

## Setting up an output association

While the whole process will work without this step, it provides an extra level of comfort for those involved in the pull request review.

The linting is performed in the runner, and the output (from `markdownlint`) is available in the workflow execution detail:

![workflow execution detail showing markdown lint output]({{ "/img/2021/05/execution-detail-messages.png" | url }})

However, there's a small disconnect between the place of change and discussion (the pull request) and this workflow output.

There's a special, slightly mysterious feature that can help address this disconnection. This is the "matcher" feature, and is mysterious in that it's not particularly prominent in the main [GitHub Actions documentation](https://docs.github.com/en/actions) ... although it is explained in the Actions Toolkit documentation, specifically [in the ::Commands section](https://github.com/actions/toolkit/blob/master/docs/commands.md#problem-matchers).

The general idea is that matchers can be added to a workflow execution. Matchers take the form of configuration that uses a regular expression to pick out parts of output messages and work out which bits are what. In other words, work out which file, line number and column each message applies to, as well as the message code and text.

This is what a matcher looks like, and it's the one I'm using to match the `markdownlint` output:

```json
{
  "problemMatcher": [
    {
      "owner": "markdownlint",
      "pattern": [
        {
          "regexp": "^([^:]*):(\\d+):?(\\d+)?\\s([\\w-\\/]*)\\s(.*)$",
          "file": 1,
          "line": 2,
          "column": 3,
          "code": 4,
          "message": 5
        }
      ]
    }
  ]
}
```

> The regular expression actually appears slightly more complex than it is, because the backslashes that are used to introduce the metacharacters `\d` (digit), `\s` (whitespace) and `\w` (alphanumeric) are escaped with backslashes in the JSON string value (so e.g. `\d` becomes `\\d`). This is so they don't get interpreted as escape characters themselves.

If we stare at the output earlier, we see this:

```text
docs/b.md:5 MD022/blanks-around-headings/blanks-around-headers Headings should be surrounded by blank lines [Expected: 1; Actual: 0; Below] [Context: "### Something Else"]
docs/b.md:6 MD032/blanks-around-lists Lists should be surrounded by blank lines [Context: "- one"]
docs/b.md:10:10 MD011/no-reversed-links Reversed link syntax [(reversed)[https://qmacro.org]]
```

Applying the regular expression, we can see that it will indeed pick out the values as desired. Taking the last message line as an example, we get:

|Regular expression part|Matched text|Value for|
|-|-|-|
|`^`|(start of line)||
|`([^:]*)`|`docs/b.md`|`file`|
|`:`|`:`||
|`(\d+)`|`10`|`line`|
|`:?`|`:`||
|`(\d+)?`|`10`|`column`|
|`\s`|(a space)||
|`([\w-\/]*)`|`MD011/no-reversed-links`|`code`|
|`\s`|(a space)||
|`(.*)`|`Reversed link syntax [...]`|`message`|
|`$`|(end of line)||


> In this table, the escaping backslashes have been removed, as they're only there to make the JSON string happy.

The result of having a matcher like this is that as well as having the messages available in the workflow execution detail, we get the messages in context too, which is far more comfortable. They appear in the workflow execution summary, like this (see the "Annotations" section):

![workflow execution summary showing markdown lint output]({{ "/img/2021/05/execution-summary-messages.png" | url }})

Moreover, each message appears directly below the line to which it applies, like this:

![markdown linting messages next to the relevant lines]({{ "/img/2021/05/messages-in-pr.png" | url }})

To get this to work, the matcher configuration needs to be added with the `add-matcher` directive, in a step, like this:

```yaml
    - run: "echo ::add-matcher::.qmacro/workflows/markdownlint/problem-matcher.json"
```

There is actually a GitHub Action, [xt0rted/markdownlint-problem-matcher](https://github.com/xt0rted/markdownlint-problem-matcher) that does this for you, but I'm still in two minds as to whether to use a "black box" action or something direct for things like this. Only time will tell.

## Installing the tool and custom rules packages

Next, it's time to install the actual `markdownlint` tool, along with the custom rule package I mentioned in [part 1](https://qmacro.org/2021/05/13/notes-on-markdown-linting-1/). While I installed `markdownlint` on my macOS machine with `brew`, it seems fine here to install it with `npm`, along with the rule too:

```yaml
    - run: |
        npm install \
          --no-package-lock \
          --no-save \
          markdownlint-cli markdownlint-rule-titlecase
```

Using the `--no-package-lock` and `--no-save` options makes for a slightly cleaner environment, given what we're doing here (i.e. we are only really interested in NPM metadata for this current job's execution).

## Performing the linting

Now everything is ready, we can run the linter. I am invoking the `markdownlint` tool, just installed with `npm`, using the `npx` package runner as it seems the cleanest way to do it:

```yaml
    - run: |
        npx markdownlint \
          --config .qmacro/workflows/markdownlint/config.yaml \
          --rules markdownlint-rule-titlecase \
          docs/
```

Without configuration, `markdownlint` will apply [all the rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md) by default. I don't want that to happen, so I've used the `--config` option to point to a rules file `.qmacro/workflows/markdownlint/config.yaml`. This is what's in that file:

```yaml
# All rules are inactive by default.
default: false

# These specific rules are active.
# See https://github.com/DavidAnson/markdownlint#rules--aliases for details.
heading-increment: true
no-reversed-links: true
no-missing-space-atx: true
no-multiple-space-atx: true
blanks-around-headings: true
blanks-around-lists: true
no-alt-text: true
```

In other words, with this configuration, only those rules in that second stanza will be applied. Plus of course the explicit NPM package based title-case rule I've specified with the `--rules` option.

> I've been [thinking about](https://github.community/t/best-practices-for-storing-organising-shell-scripts-for-workflow-steps/176822) where to store workflow related artifacts in a repository. I don't want to use `.github/workflows` for anything other than actual workflow definition files. So right now, I'm thinking along the lines of a hidden user/organisation based directory name -- `.qmacro` in this example -- to parallel `.github`.

The final thing to note in this invocation is that I'm passing a specific directory to be linted: `docs/`. This means only content there will be linted. I will probably want some sort of `.markdownlintignore` file at some stage, but for now this will do.

## Wrapping up

Here's the workflow definition in its entirety:

```yaml
name: Markdown checks

on:
  pull_request:
    branches: [main, master]

jobs:
  main:
    runs-on: ubuntu-20.04
    steps:

    - uses: actions/checkout@v2

    - run: "echo ::add-matcher::.qmacro/workflows/markdownlint/problem-matcher.json"

    - run: |
        npm install \
          --no-package-lock \
          --no-save \
          markdownlint-cli markdownlint-rule-titlecase

    - run: |
        npx markdownlint \
          --config .qmacro/workflows/markdownlint/config.yaml \
          --rules markdownlint-rule-titlecase \
          docs/
```

Everything works nicely, and I'm happy with the local and remote linting process.
