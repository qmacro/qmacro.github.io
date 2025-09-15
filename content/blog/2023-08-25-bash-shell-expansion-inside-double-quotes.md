---
title: Bash shell expansion inside double quotes
date: 2023-08-25
tags:
  - bash
  - command-line
---
In the context of this month's [SAP Developer Challenge on APIs](https://blogs.sap.com/2023/08/01/sap-developer-challenge-apis/), some participants working through [today's task](https://groups.community.sap.com/t5/application-development/sap-developer-challenge-apis-task-10-request-an-oauth-access/m-p/282016) have tripped up on a Bash feature, a feature which is one of a family of features relating to "expansion" of information. In this short post I dig into what that feature is, and how to ensure you don't trip yourselves up with it.

## Special characters

In [SAP Developer Challenge - APIs - Task 10 - Request an OAuth access token](https://groups.community.sap.com/t5/application-development/sap-developer-challenge-apis-task-10-request-an-oauth-access/m-p/282016), my good friend and colleague Daniel stumbled into a problem while conveying OAuth client ID and secret values in a call to `curl`. It would have been something like this:

```shell
curl '<oauth-authorization-server>' \
-u "<clientid>:<clientsecret>" \ 
-d "grant_type=<grant-type>"
-d "..."
```

With many services on the SAP Business Technology Platform, client ID and secret values contain special characters, notably here they contain exclamation marks. Here's an example:

* client ID: `sb-ut-f86082c9-7fbf-4e1e-8310-f5d018dab542-clone!b254751|cis-central!b14`
* client secret: `dfad81fe-a33d-4252-b612-d49cd9fd3a42$dE1F7W2F3-TrF9kIrkdQaliGqTKR_aCVcv-oaM7ZZ9x=`

They also contain dollar signs.

## Bash expansions

Bash is a venerable and extremely capable shell, and supports a number of so-called [Shell Expansions](https://www.gnu.org/software/bash/manual/html_node/Shell-Expansions.html), where values are substituted for tokens on the command line. This is before those values are then interpreted as part of whatever command is to be executed. These expansions are initiated by special characters, two of which are the dollar sign `$` and exclamation mark `!`.

### Shell parameter expansion

The `$` character introduces [shell parameter expansion](https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html), and in the very simplest of cases will substitute the value of a variable identified with the `$` character, replacing the parameter or symbol itself. For example, if we have a variable `ans` with the value `42`, then:

```shell
echo "The answer is $ans"
```

will emit:

```text
The answer is 42
```

### History expansion

The `!` character introduces [history expansion](https://www.gnu.org/software/bash/manual/html_node/History-Interaction.html). In the Bash shell, commands are remembered in a history, and can be recalled with the `history` builtin. Here's an example of the output from `history`:

```text
1977  date
1978  git status
1979  git add .gitignore
1980  git commit -m 'do not track cache files'
```

If I wanted to rerun the `git status` command, I could invoke it like this:

```shell
!1978
```

That might not seem earth shatteringly exciting, but for longer more complex combinations of commands, it can be very useful. Remember also that some shells emit the current history number in the prompt, making it quick and easy to refer to a previous command. And in the older days of slower connections, especially serial terminal connections, the transmission of every character counted!

## Quotes

Shell parameter and history expansion happen inside double quotes. So if I try:

```shell
echo "everything!abc"
```

Then I see this:

```text
-bash: !abc: event not found
```

The word "event" here refers to a line selected from the history. And as `abc` isn't in my history as a reference, the error message makes sense. 

But if I were to try:

```shell
echo "everything!1978"
```

I would see:

```text
everythinggit status
```

## A note on working with OData

One thing to note for those of you working with OData, is that the OData system query options are all prefixed with the dollar sign. For example, there's `$top`, `$skip`, `$expand` and so on. So if you were to use `curl` to request a URL like this (elided for brevity):

```shell
curl \
  --url "https://.../Northwind.svc/Products?$top=2"
```

then you'd get rather more product entities than you expected. Instead of receiving just the first two, you'd get all of them. Why? Because through shell parameter expansion, the `$top` part was expanded into the value of the `top` parameter, which is (most likely to be) empty, making the actual URL passed to `curl` this:

```url
https://.../Northwind.svc/Products?=2"
```

Nicely, perhaps through [Postel's Law](https://en.wikipedia.org/wiki/Robustness_principle), the Northwind service quietly ignores the random `=2` which is thus sent as the query string part of the URL, and returns the entire products entity set.

## What to do

These expansions work within double quotes in Bash. They explicitly and deliberately are not active within single quotes. There is in fact a lot more to know about the [difference between single and double quotes in Bash](https://stackoverflow.com/questions/6697753/difference-between-single-and-double-quotes-in-bash), but all you need to remember for now is that you should only use double quotes when you know you want something magic to happen (such as expansions). If you can get away with using single quotes, then that is often the better way, where the data within remains "passive".

Here are those two examples from earlier, but expressed in single quotes. First, using an exclamation mark which in double quotes would invoke history expansion:

```shell
; echo 'everything!abc'
everything!abc
```

Now using a dollar sign, which in double quotes would invoke parameter expansion:

```shell
; echo 'The answer is $ans'
The answer is $ans
```

The shell is a wonderful environment, but can be arcane and odd around some edges. But how is that different to the univese in general, right?
