---
layout: post
title: Unpacking Bash shell tips from a GitHub Actions workflow
tags:
  - autodidactics
  - shell
  - github-actions
---

_Someone shared a GitHub Actions workflow step which was written to find out some pull request info, but I thought even the first couple of shell lines, using IFS and awk, were worth staring at for a second or two._

I don't know about you, but I find value in staring at other people's shell activities, so I thought I'd share what occurred to me as I did so on this occasion, in case it helps newcomers become a little more acquainted.

A colleague wanted to find out something about the pull request ID when a workflow was triggered. This is a shortened version of what was shared:

{% raw %}
```yaml
- name: PR ID
  run: |
    IFS='/' read -r OWNER REPOSITORY <<< "$GITHUB_REPOSITORY"
    HEADREFNAME=$(echo ${{ github.event.ref }} | awk -F'/' '{print $NF}')
    PR_ID=$(curl -s -H "Authorization: Bearer ${{ secrets.GITHUB_TOKEN }}" \
      -X POST \
      -d "{\"query\": ... }" \
      "$GITHUB_GRAPHQL_URL" \
      | jq '.data.repository.pullRequests.nodes[].number' \
    )
  shell: bash
```
{% endraw %}

I've omitted the detail of the API call being made with `curl`, partly because it's not relevant, and partly because it's a GraphQL call and extremely ugly.

So what can we learn from this? Let's take it line by line.

## Obtaining the owner and repository values

```bash
IFS='/' read -r OWNER REPOSITORY <<< "$GITHUB_REPOSITORY"
```

This is a nice way of splitting the value in a variable into a couple of variables. What's in `$GITHUB_REPOSITORY`? The [Default environment variables](https://docs.github.com/en/actions/reference/environment-variables#default-environment-variables) documentation tells us that it's going to be the repository owner and name, joined with a `/` character, e.g. `octocat/Hello-World`.

Let's pick this line apart.

### Using the IFS environment variable

The first thing we see is `IFS='/'`. `IFS` is an environment variable in Bash and stands for [Input Field Separators](https://en.wikipedia.org/wiki/Input_Field_Separators) (or Internal Field Separators). Notice that "separators" is plural. Note also that some folks like to think of them as delimiters, rather than separators, but that's a debate for another time. The default value for the `IFS` environment variable is the list of different whitespace types, i.e. space, tab and newline.

Here, we only want to split on `/` characters, rather than on any whitespace characters.

There are a number of places that `IFS` is used in the context of the shell. One of these places is with the `read` command, and in particular, it comes into play when there are multiple variable names specified. But we'll get to that shortly.

The other thing to note is that the setting of the value for `IFS` is done "in the same breath" as the `read` command, on the same line. This means that the value assigned is temporary, just for the duration of the command or builtin that follows. What actually happens is that the `IFS='/'` assignment is passed as part of the environment within which the command or builtin is executed. (I found [this explanation on StackOverflow very helpful in understanding this](https://stackoverflow.com/questions/25153582/why-cant-i-set-ifs-for-one-call-of-printf/25154499#25154499)).

This means, in turn, that when (in this case) `read` consults the value of `IFS` it gets the `/` character, and not whatever `IFS` was set or defaulted to before that incantation. But once the processing of whatever is on that line is finished, that temporary, execution-environment-specific assignment is done with, and effectively we're back with whatever `IFS` was before we started.

### Splitting with read

Next we have the actual execution of the `read` builtin: `read -r OWNER REPOSITORY`.

> In case you're wondering, "builtin" just means that `read` is part of the Bash shell itself, rather than a separate executable. One implication of this is that the execution of `read` is going to be faster (although unless you're running it many times in a loop, or on a very slow machine, the difference is going to be almost imperceptible). Another implication is that you'll want to use `read --help` to find out what `read` does, rather than `man read`.

Looking at what `read --help` tells us, we see that it reads a line from STDIN and splits it into fields. Note the phase "a line" - it only reads one line, so if you have multiple lines, you'll need to execute `read` in a loop (a common idiom is to use a `while` loop here). Next, then, is the `-r` option, which prevents any backslashes from escaping characters. Often with input you'll find control characters, such as tab or newline, written in an escaped form, i.e. `\t` and `\n` respectively. In this instance, this is not desired - any actual backslash should be interpreted directly as such.

Knowing that the value in `$GITHUB_REPOSITORY` is going to be an owner and a repository name, stuck together with a `/` character (such as "octocat/Hello-World") we can understand what the variable names `OWNER` and `REPOSITORY` are likely to receive, given the temporary assignment of `/` to `IFS`.

### I/O redirection and using a here string

But we know `read` reads lines from STDIN. So how do we get it to read the value of a variable (`$GITHUB_REPOSITORY`) instead? We get it to do that using a "here string" - and that's the last bit of the line that we should now stare at for a second, the `<<< "$GITHUB_REPOSITORY"` part.

To understand what a "here string" is, let's take a few steps back, starting at the concept of STDIN ("standard input"). In the context of the shell, this is often what is supplied to a program in a pipeline, like this:

```bash
$ producer | consumer
```

Whatever `producer` emits to STDOUT, that's what `consumer` receives on STDIN.

There are other ways to supply data to `consumer`. One way is to use "redirection", which is useful if you want to use files:


```bash
$ producer > some-file
$ consumer < some-file
```

The first line uses "output redirection", i.e. the output that `producer` emits to STDOUT is redirected to `some-file`. The second line uses "input redirection", where `some-file` is opened for reading on `consumer`'s STDIN.

There's another type of redirection, called a "here document", which allows us to specify input lines directly, i.e. "here", like this:

```bash
$ consumer <<EOF
first line of input
second line of input
last line of input
EOF
```

The three lines of input are what are supplied to `consumer`'s STDIN. The string `EOF` is declared as a delimiter, and all lines up until that delimiter is seen are taken as input.

And there's a variation on such "here document", and that's a "here string", which is what we have in our example. While regular STDIN redirection is introduced with a single `<`, and a "here document"-based redirection is introduced with a double `<<`, a "here string" is introduced with a triple `<<<`, and takes whatever is supplied, appends a single newline and passes that to STDIN.

In this case, a variable `$GITHUB_REPOSITORY` is supplied, so that is expanded to the value it contains, and passed to `read`'s STDIN.

## Getting the HEAD reference

The second line is also interesting and deserves a little attention. It's a single assignment statement, assigning a value to the variable `HEADREFNAME`. It doesn't matter too much what this is, but it doesn't hurt to make a guess. Based on the context in which this will run, i.e. in a pull request event, and the reference to the GitHub event property "ref" (in `github.event.ref`), we can see from the [Webhook events and payloads](https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads) section of the documentation that this is likely to be something that looks like this:

```
refs/head/main
```

Let's stare at this line to see what it does and how it works:

{% raw %}
```bash
HEADREFNAME=$(echo ${{ github.event.ref }} | awk -F'/' '{print $NF}')
```
{% endraw %}

### Use of command substitution with $(...)

We can see that what is assigned to the `HEADREFNAME` variable is something inside this construct: `$(...)`. This is the [command substitution](https://www.gnu.org/software/bash/manual/html_node/Command-Substitution.html) construct. This allows the output of a command to be substituted in-place. In other words, whatever the output of what's expressed within the `$(...)` construct is substituted, and (in this case) assigned as the value to `HEADREFNAME`.

> You may see an alternative command substitution construct in this form: `` `...` ``; this is the older style of the construct, but the newer `$(...)` style is preferred due to some quoting complexities with the older style.

### Using awk

So what is the command that is producing the output that will be substituted and assigned to the `HEADREFNAME` variable here? Let's have a look:

{% raw %}
```bash
echo ${{ github.event.ref }} | awk -F'/' '{print $NF}'
```
{% endraw %}

Remember that the definition context here is a GitHub Actions workflow definition. This is where the {% raw %}`${{ ... }}`{% endraw %} comes from - it's not a shell expression; rather, it's an [expression in the workflow definition format](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions). It basically means that the value of the property `github.event.ref` is substituted; this is before the line is executed by Bash.

Assuming for now that the value of `github.event.ref` is indeed `refs/head/main`, this amounts to:

```bash
echo refs/head/main | awk -F'/' '{print $NF}'
```

So the value is piped into the STDIN of `awk`, the venerable and still useful tool for [text processing, data extraction and reporting](https://en.wikipedia.org/wiki/AWK). And it is here that data extraction is taking place. Let's break down how it works.

### Awk condition-action pairs and built-in variables

The structure of an `awk` script is one or more "condition action" pairs. The basic idea is that `awk` processes lines that it receives via STDIN, and for each line, applies the condition, and if the condition is true, executes the corresponding action. Conditions are often regular expressions, and there's the special (and common) case of "no condition", in which case the action is executed regardless. (There are also the special `BEGIN` and `END` conditions which can be used for pre- and post-processing respectively).

Actions are enclosed in curly braces `{ ... }`.

For quick one-liners, `awk` scripts are often expressed "in-line" like we see here. In other more complex cases they're stored in separate script files - you can see a couple of examples of `.awk` file contents in the [graphing](https://github.com/SAP-samples/cloud-messaging-handsonsapdev/tree/main/graphing) directory within the [SAP samples](https://github.com/SAP-samples) repository [cloud-messaging-handsonsapdev](https://github.com/SAP-samples/cloud-messaging-handsonsapdev).

This particular one-liner looks like this:

```
(no condition) { print $NF }
```

In other words, the action will be executed for every line coming in on STDIN. Considering that there's only going to be one line coming in (the `refs/head/main` string), that's just a single instance of that action. But what does it do? To understand that, we have to look at `$NF` and, in turn, the value `'/'` passed to the `-F` option in the `awk` invocation.

There are a number of built-in variables in `awk`, and `NF` is one that represents the number of fields.

What does "number of fields" mean, exactly? Well, first, it's the number of fields in the input line currently being processed. And the number of fields is determined by the value of the `FS` built-in variable - the "field separator". The default value of `FS` is whitespace, but this can be changed using the `-F` option, which is what's happening here.

With that knowledge, we can guess what this might produce (note the addition of `FS` and the deliberate omission for now of the `$` prefix to `NF`):

```
echo refs/head/main | awk -F'/' '{print FS, NF}'
```

It produces this, i.e. the value of the field separator and the number of fields.

```
/ 3
```

Fields in an `awk` script can be referred to positionally with `$1`, `$2`, `$3` and so on. But usefully, with a touch of indirection, we can prefix `NF` with `$` to refer to fields relatively, such that `$NF`, which resolves to `$3`, is the last field in this input, `$NF-1` is the second to last, and so on.

So the action `{ print $NF }` just prints the last field on the line.

In other words, what this entire line does is assign whatever the last part of the value of `github.event.ref` (i.e. `main`, here) to the `HEADREFNAME` variable.

And that's it. While there's more in this workflow definition step, I'll stop here to let you take things in. Hopefully if you're taking some tentative steps towards embracing more terminal based command of your working environment, this has helped break down the barriers a little to the syntax and use of Bash shell expressions and scripts.
