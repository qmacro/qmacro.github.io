---
layout: post
title: GitHub Actions workflow browser
tags:
  - github-actions
  - tools
---

_I wrote a simple workflow browser to help me refer to previous workflow definitions while I'm writing a new one, as I'm still learning the syntax and techniques._

With a programming or definition language, especially one that's new and powerful, it takes me a while to become comfortable writing scripts or definitions from scratch. I have a small amount of auto completion in my editor, but I'm not a fan - I prefer to learn by looking things up and then typing them in, rather than have words automatically completed for me.

The YAML based syntax for definining GitHub Actions workflows is powerful and there are different ways of achieving similar things. And it's new to me too (although defining jobs and steps isn't - in many ways it's just like writing Job Control Language (JCL) back in the mainframe era, but that's a story for another time).

While the latest version of the GitHub command line client `gh` sports lovely new features for workflows and actions, it doesn't quite give me the quick cross-repository overview that I'm looking for. So I decided to combine three of my favourite terminal power tools to help me:

- Bash, for my command line interface and utility scripting, my shell of choice
- [`gh`](https://github.com/cli/cli), which is already a very accomplished command line interface (CLI) to GitHub and a really comfortable way of using the API
- [`fzf`](https://github.com/junegunn/fzf), which is a powerful fuzzy finder utility and provides just enough features for me to build simple terminal user interfaces (UIs) with

I combined them to build a "workflow browser". Here it is in action:

<script id="asciicast-409638" src="https://asciinema.org/a/409638.js" async></script>

It consists of three parts:

- a new environment variable GH_CACHETIME which I can set globally to be nice to the GitHub API servers (I'm not changing workflows that often so a generous cache time of 1 hour works for me)

- the main `workflowbrowser` script which finds workflow definitions across my content on GitHub and presents them in a list to search through

- a separate `showgithubcontent` script that displays the content of a resource in one of my GitHub repositories

The `showgithubcontent` script was initially a function inside of the `workflowbrowser` script but I separated it out, first because it felt better and second because there was something more I could do once I'd browsed the workflow definitions with `workflowbrowser` and selected one - more on that later.

## The workflowbrowser script

Here's the script in its entirety, [as it stands right now](https://github.com/qmacro/dotfiles/blob/master/scripts/workflowbrowser):

```
#!/usr/bin/env bash

# Find and browse GitHub Actions workflow definitions.
# In addition to regular shell tools (such as sed), this
# script uses gh and fzf.

workflows() {

  # Takes owner type (org or user) and owner name.
  # Returns tab-separated list of owner/repo/workflowfile/path.

  local ownertype=$1
  local owner=$2

  gh api \
    --method GET \
    --paginate \
    --cache "${GH_CACHETIME:-1h}" \
    --field "q=$ownertype:$owner path:.github/workflows/" \
    --jq '.items[] | ["\(.repository.full_name)/\(.name)", .repository.owner.login, .repository.name, .path] | @tsv' \
    "/search/code"

}

main() {

  # Calls workflows for my org and user.

  cat \
    <(workflows org qmacro-org) \
    <(workflows user qmacro) \
    | fzf \
      --with-nth=1 \
      --delimiter='\t' \
      --preview='showgithubcontent {2} {3} {4} yaml always' \
      | cut -f 2,3,4

}

main "$@"
```

There's just a `main` function and a `workflows` function.

### The main function

The `main` function calls the `workflows` function a couple of times, because I have repositories under my own user [qmacro](https://github.com/qmacro) and also under a small experimental organisation [qmacro-org](https://github.com/qmacro-org) and I have workflows across both of these owner areas.

In learning more about Bash I've found it's helpful to know the terms for various aspects, so I'm going to point out one here. I'm calling the `workflows` function twice, like this:

```
  cat \
    <(workflows org qmacro-org) \
    <(workflows user qmacro)
```

This to me was the simplest way of combining output from two calls into a single stream, using `cat`. The `<(...)` is [process substitution](https://tldp.org/LDP/abs/html/process-sub.html). This is very useful when you want to supply some data to a command, which is expecting that data to be in a file, but where you don't have a file, and instead want to generate the data on the fly, and have it provided as the output of some execution. Here I'm using process substitution to call the `workflows` function a couple of times, and have the output from those calls supplied to `cat`. As if I did this: `cat firstfile secondfile`.

> I did a 10 minute video on process substitution on Hands-on SAP Dev, in case you're interested: [Ep.39 - Looking at process substitution](https://www.youtube.com/watch?v=JF4lGw4Itpk&list=PL6RpkC85SLQAIntm7MkNk78ysDm3Ua8t0&index=41).

I'll dig into the `workflows` function shortly, but for now, we need to know what it outputs, to understand better what we do with that output, i.e. what we do downstream from `cat` in the pipeline.

The output from `workflows` are records representing workflow definitions, in the form of lines with tab-separated fields, like this:

```
qmacro-org/test/dump.yml	qmacro-org	test	.github/workflows/dump.yml
qmacro/showntell/main.yml	qmacro	showntell	.github/workflows/main.yml
qmacro/qmacro/build.yml	qmacro	qmacro	.github/workflows/build.yml
```

In order, the fields represent:

1. a combination of repo owner, repo name & workflow definition file name
1. the repo owner
1. the repo name
1. the path in the repository to that workflow definition file

The lines are piped into `fzf` which is used to present the workflow definitions and also a preview of their contents. This is done by using various options supplied to `fzf`.

The first option deals with what to show in the basic list display that `fzf` first presents, and that is the contents of the first field above (the combination). This is done using the `--with-nth` option; we also tell `fzf` how the fields are delimited:

* `--with-nth=1` - use field 1 in the list display
* `--delimiter='\t'` - fields are tab-delimited

Then there's what to do from a preview perspective; when a particular entry in the list is selected, `fzf` can run a preview command to display something in a window:

* `--preview='showgithubcontent {2} {3} {4} yaml always'`

Whatever is produced (via STDOUT) by the incantation supplied with the `--preview` option is shown in the preview window. Here, we call the `showgithubcontent` script, supplying that script with 5 arguments. The first three use `fzf`'s field reference syntax to pass the values of the second, third & fourth field, i.e. the repo owner, the repo name and the workflow file path. The last two arguments control how `showgithubcontent` displays things (we'll come to that later).

With `fzf`, if an item in the list is indeed selected, then the line passed into `fzf` that represents the line selected is output to STDOUT. This makes `fzf` a very powerful tool that plays well with other tools, following the Unix philosophy (if no selection is made, e.g. by aborting `fzf` with Ctrl-C, then nothing is emitted).

The final part of the `main` function takes the line emitted from `fzf` and outputs the same three fields (repo owner, repo name and workflow file path). Basically field 1 is just used as a "display" field for `fzf`.

### The workflows function

The `workflows` function is basically a wrapper around a call to the [GitHub Search API](https://docs.github.com/en/rest/reference/search). This is an API that I haven't used before now, and it's pretty powerful. There are different endpoints representing different search approaches. What worked for me, to find workflow definitions, was to use the [Search code](https://docs.github.com/en/rest/reference/search#search-code) endpoint with `/search/code`.

This endpoint takes the search criteria in the form of a query string parameter `q`, and it was very easy to use the GUI based search to try out different search parameters to figure out what I needed to specify. Here's an example:

<https://github.com/search?q=org%3Aqmacro-org+path%3A.github%2Fworkflows%2F>

One thing that tripped me up at first was the wrong type of request was being made first of all. I supplied the search criteria value in the `q` query string parameter correctly, like this (as you can see in the function):

* `--field "q=$ownertype:$owner path:.github/workflows/"`

but the HTTP call that `gh` then made for me was a POST request, with this search query parameter in the body of the request. That wasn't right. Checking in the API documentation, the `q` parameter needs to be in the query string. Explicitly setting the method to GET made this right:

* `--method GET`

There are a couple of other "housekeeping" parameters used here too:

* `--paginate`
* `--cache "${GH_CACHETIME:-1h}"`

I don't yet have that many workflow definitions, but if it comes to that, `gh` will work through the responses to get them all for me with `--paginate`.
And the `--cache` parameter works both ways: my activities are well behaved when it comes to using the API endpoints, and also, after the first time the list of workflow definitions is retrieved, any subsequent uses of the workflow browser are that much snappier (this works also with the similar use of the `--cache` parameter in the `showgithubcontent` script we'll see shortly). Note that if there's no value specified for `GH_CACHETIME`, the default will be 1 hour (`1h`) through the use of [shell parameter expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html).

Next we come to the use of the `--field` parameter, which allows me to specify the name and value for the search parameter `q`. I looked at the [Searching code](https://docs.github.com/en/github/searching-for-information-on-github/searching-code) documentation to find out about the `ownertype:owner` specification. The first time around this value will be "org:qmacro-org" and the second time around it will be "user:qmacro". Moreover, with `path` I can search for content that appears at a specific location - see [Search by file location](https://docs.github.com/en/github/searching-for-information-on-github/searching-code#search-by-file-location).

> For those wondering, GitHub Actions workflow definition files are stored in the `.github/workflows/` directory within a repository.

Last but not least I use `--jq` parameter to supply `fzf` with some `jq` script that will parse and extract the data I need from the API's JSON output. I think it was in [release 1.7.0](https://github.com/cli/cli/releases/tag/v1.7.0) that this feature appeared, and it's a great idea - build in `jq` to `gh` so those that don't have `jq` already installed can still benefit. I guess it also helps to establish `jq` as the de facto standard for parsing and manipulating JSON.

If we add some whitespace to the `jq` script passed with the `--jq` parameter, we get this:

```jq
.items[]
  | [
      "\(.repository.full_name)/\(.name)",
      .repository.owner.login,
      .repository.name,
      .path
    ]
  | @tsv'
```

I think it's always easier to stare at a script like this when we see what it's going to be processing, so here's some sample output from the API call to the search endpoint (reduced for brevity):

```json
{
  "total_count": 7,
  "incomplete_results": false,
  "items": [
    {
      "name": "dump.yml",
      "path": ".github/workflows/dump.yml",
      "repository": {
        "id": 331995789,
        "name": "test",
        "full_name": "qmacro-org/test",
        "owner": {
          "login": "qmacro-org",
          "id": 75827316,
          "type": "Organization"
        },
      },
    },
    {
      "name": "main.yml",
      "path": ".github/workflows/main.yml",
      "repository": {
        "id": 331995789,
        "name": "showntell",
        "full_name": "qmacro/showntell",
        "owner": {
          "login": "qmacro",
          "id": 73068,
          "type": "User"
        },
      },
    },
    {
      "name": "build.yml",
      "path": ".github/workflows/build.yml",
      "repository": {
        "id": 165207450,
        "name": "qmacro",
        "full_name": "qmacro/qmacro",
        "owner": {
          "login": "qmacro",
          "id": 73068,
          "type": "User"
        },
      },
    }
  ]
}
```

Now we can understand what the `jq` script is doing. It's working through the contents of the `items` array (the search results) and piping each item into an array construction. The array construction is declaring three fields, a literal string and two properties:

* the literal string contains two JSON properties `.repository.full_name` and `.name`, which are references with the `\(...)` syntax. They're put into a literal string so I can add a slash (`/`) between them

* the two properties are the repository owner name and the repository name

Once constructed, the array is passed to `@tsv` which puts the values into a nice tab-separated list.

> I think it's fair to say that the output from the built-in `jq` works as if the `--raw-output` flag has been specified (see the [jq Manual](https://stedolan.github.io/jq/manual/)), which is what we want.

This then produces the lines that we've seen earlier, i.e. ones that look like this:

```
qmacro-org/test/dump.yml	qmacro-org	test	.github/workflows/dump.yml
qmacro/showntell/main.yml	qmacro	showntell	.github/workflows/main.yml
qmacro/qmacro/build.yml	qmacro	qmacro	.github/workflows/build.yml
```

These lines are then ready for piping to `fzf` in `main()`. Great!

Now let's move on to the second script, which is what `fzf` calls to present the previews (i.e. with `--preview='showgithubcontent {2} {3} {4} yaml always'`).

## The showgithubcontent script

As I mentioned earlier, this was originally just another function inside the `workflowbrowser` script, but I extracted it to use outside of that script too. You'll see why in a bit.

Here's the script in its entirety:

```
#!/usr/bin/env bash

# Takes owner, repo and path and shows content of that resource from GitHub.
# Also accepts optional language and colour parameter.
# Uses gh, base64 and bat.

declare owner=$1
declare repo=$2
declare path=$3
declare language="${4:-txt}"
declare color="${5:-never}"

gh api \
  --cache "${GH_CACHETIME:-1h}" \
  --jq '.content' \
  "/repos/$owner/$repo/contents/$path" \
  | base64 --decode -i - \
  | bat --color "$color" --theme gruvbox --plain --language "$language" -
```

This is so simple as to not even warrant the `main()` function based approach to organisation. At least not yet. So what does it do? It expects five parameters, that we've seen already:

* the repository owner name
* the repository name
* the path to the workflow definition file in the repository
* what language to base any syntax highlighting upon
* whether to show colours

The last two parameters are specific to the `bat` tool, which is a posh version of `cat` - [`bat`'s home page](https://github.com/sharkdp/bat) calls it "a cat clone with wings".

The reason we need the first three parameters is because they're required in the call we need to the [GitHub Contents API](https://docs.github.com/en/rest/reference/repos#get-repository-content). With this endpoint:

```
/repos/{owner}/{repo}/contents/{path}
```

we can retrieve the contents of a resource (a file) in a repository.

Let's have a look what this gives us, in a sample call, for the following values:

* owner: "qmacro"
* repo: "showntell"
* path: ".github/workflows/main.yml"

```
$ gh api /repos/qmacro/showntell/contents/.github/workflows/main.yml

{
  "name": "main.yml",
  "path": ".github/workflows/main.yml",
  "size": 387,
  "url": "https://api.github.com/repos/qmacro/showntell/contents/.github/workflows/main.yml?ref=master",
  "type": "file",
  "content": "bmFtZTogYWRkX2FjdGl2aXR5X2NhcmQKCm9uOgogIGlzc3VlczoKICAgIHR5\ncGVzOiBvcGVuZWQKCmpvYnM6CiAgbGlzdF9wcm9qZWN0czoKICAgIHJ1bnMt\nb246IHVidW50dS1sYXRlc3QKICAgIG5hbWU6IEFzc2lnbiBuZXcgaXNzdWUg\ndG8gcHJvamVjdAogICAgc3RlcHM6CiAgICAtIG5hbWU6IENyZWF0ZSBuZXcg\ncHJvamVjdCBjYXJkIHdpdGggaXNzdWUKICAgICAgaWQ6IGxpc3QKICAgICAg\ndXNlczogcW1hY3JvL2FjdGlvbi1hZGQtaXNzdWUtdG8tcHJvamVjdC1jb2x1\nbW5AcmVsZWFzZXMvdjEKICAgICAgd2l0aDoKICAgICAgICB0b2tlbjogJHt7\nIHNlY3JldHMuR0lUSFVCX1RPS0VOIH19CiAgICAgICAgcHJvamVjdDogJ3Ax\nJwogICAgICAgIGNvbHVtbjogJ3RoaW5ncycK\n",
  "encoding": "base64"
}
```

(Output is reduced for brevity again).

The content isn't what we might first expect - where's the YAML? It's Base64 encoded, so we need to grab the value of the `content` property (which we do with `--jq '.content'`) and decode it. The handy `base64` command is ideal for that.

Once decoded, the workflow definition YAML content is piped into `bat`, with the following parameters:

* `--color "$color"` - do we want colour? In preview mode, always (which is why we pass `always` in the call from the other script) but unless we're explicit about that, `bat` won't use colour. This is because of the shell parameter expansion in the declaration of the `color` variable: `"${5:-never}"`, where the literal string "never" is used as a default value if none is supplied.
* `--theme gruvbox` - who doesn't like a little [gruvbox](https://github.com/morhetz/gruvbox) theming?
* `--plain` - this turns off any of the `bat` "chrome" like line numbers and headings.
* `--language "$language"` - this tells `bat` about the content, in the form of a hint as to what language it is and therefore how to syntax highlight it.

And don't miss the final `-` passed to `bat`, that's to tell it to read from STDIN.

**Embracing the Unix philosophy**

That'a about it for the two scripts. I've found them to be useful and have had fun creating them. Really it's just glueing together different tools, that's sort of the point, part of the Unix philosophy in general.

And talking of that, here's the reason I split out the `showgithubcontent` function into a separate script. It's because I wanted to be able to browse the workflow definitions, but then if I selected one, I wanted to be taken into an editor with that definition's contents. And with a proper shell (like Bash, or most other Unix shells) this is simple:

```
$ workflowbrowser | xargs showgithubcontent | vim --not-a-term -
```

That is:

1. call `workflowbrowser` and take the selected output from `workflowbrowser` (which will be the three values that `fzf` emits when I select a workflow definition) and, by piping them through to a call to `xargs`, send them as parameters to `showgithubcontent`
1. this of course is a "second" call to `showgithubcontent` - it's been used in `fzf`'s preview window, but now we're calling it explicitly, for the selected definition, without the two extra arguments "yaml" and "always" so that the the workflow definition is output without adornment
1. that unadorned workflow definition goes to STDOUT, which is then fed through the pipe to the STDIN of `vim`, my editor, where I tell it to read from STDIN (that's the use of `-`) and, using `--not-a-term`, tell it that its startup context is not a terminal (it's a pipe) so that it won't issue any warnings along those lines

Here's an example of that pipeline flow in action:

<script id="asciicast-409639" src="https://asciinema.org/a/409639.js" async></script>

I hope you found this useful and perhaps it will encourage you to create your own utility scripts using `gh` and `fzf`.
