---
layout: post
title: Embracing jq and JSON
tags:
  - autodidactics
  - jq
  - btp
---

_Finding objects in a complex JSON structure isn't as scary as I thought with jq._

My friend and colleague Rui was asking today about finding directory information for a given global account on SAP's [Business Technology Platform](https://www.sap.com/uk/products/business-technology-platform.html) (BTP). Of course, being an awesome chap, he was asking in the context of the [BTP CLI tool](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/7c6df2db6332419ea7a862191525377c.html), `btp`.

For a given (fictitious) trial global account, let's say I have a structure that looks like this:

![BTP global account structure]({{ "/img/2021/10/btp-global-account-structure.png" | url}})

With the `btp` tool, I can see this information cleanly in my environment of choice, my Bash shell, with this invocation:

```bash
btp get accounts/global-account --show-hierarchy
```

which shows me something like this:

```
Showing details for global account 42bb4252-2b49-4685-bcd7-62c8d85d8b13...

├─ 7f81446xtrial (42bb4252-2b49-4685-bcd7-62c8d85d8b13 - global account)
│  ├─ trial (b3f3b2a3-d96d-4bea-8bbf-57ee84a9fc23 - subaccount)
│  ├─ mydir (e6cde265-5d78-4e7c-a8cb-8625a4daaa04 - directory)
│  │  ├─ fruit (4cc2e8f8-8cef-4828-82af-9b5adae387de - directory)
│  │  │  ├─ apple (3b4ba347-973f-4571-b4af-7862886104be - directory)
│  │  │  ├─ banana (0b58163d-5c49-4eb5-b359-17c9a0d94138 - directory)
│  │  ├─ this and that (4a050bbe-5c4d-4ac0-9a66-d7e513f8b4c8 - directory)

type:            id:                                    display name:   parent id:                             parent type:
global account   42bb4252-2b49-4685-bcd7-62c8d85d8b13   7f81446xtrial
subaccount       b3f3b2a3-d96d-4bea-8bbf-57ee84a9fc23   trial           42bb4252-2b49-4685-bcd7-62c8d85d8b13   global account
directory        e6cde265-5d78-4e7c-a8cb-8625a4daaa04   mydir           42bb4252-2b49-4685-bcd7-62c8d85d8b13   global account
directory        4cc2e8f8-8cef-4828-82af-9b5adae387de   fruit           e6cde265-5d78-4e7c-a8cb-8625a4daaa04   directory
directory        3b4ba347-973f-4571-b4af-7862886104be   apple           4cc2e8f8-8cef-4828-82af-9b5adae387de   directory
directory        0b58163d-5c49-4eb5-b359-17c9a0d94138   banana          4cc2e8f8-8cef-4828-82af-9b5adae387de   directory
directory        4a050bbe-5c4d-4ac0-9a66-d7e513f8b4c8   this and that   e6cde265-5d78-4e7c-a8cb-8625a4daaa04   directory
```

The directories are hierarchically related, as you can see from the graphical depiction. But they're presented in a nice flat list towards the end, and I'm tempted to use standard \*nix tools to parse that information out.

First, I'm only interested in the data in the second half, in the table that has headers like "type:", "id:" and so on. So I can remove all the lines up to (and including) that header line like this:

```bash
btp get accounts/global-account --show-hierarchy \
  | sed -e '1,/^type:\s/d'
```

This gives me the following:

```
global account   42bb4252-2b49-4685-bcd7-62c8d85d8b13   7f81446xtrial
subaccount       b3f3b2a3-d96d-4bea-8bbf-57ee84a9fc23   trial           42bb4252-2b49-4685-bcd7-62c8d85d8b13   global account
directory        e6cde265-5d78-4e7c-a8cb-8625a4daaa04   mydir           42bb4252-2b49-4685-bcd7-62c8d85d8b13   global account
directory        4cc2e8f8-8cef-4828-82af-9b5adae387de   fruit           e6cde265-5d78-4e7c-a8cb-8625a4daaa04   directory
directory        3b4ba347-973f-4571-b4af-7862886104be   apple           4cc2e8f8-8cef-4828-82af-9b5adae387de   directory
directory        0b58163d-5c49-4eb5-b359-17c9a0d94138   banana          4cc2e8f8-8cef-4828-82af-9b5adae387de   directory
directory        4a050bbe-5c4d-4ac0-9a66-d7e513f8b4c8   this and that   e6cde265-5d78-4e7c-a8cb-8625a4daaa04   directory
```

Now I can more reliably look for the `directory` entries, right?

```bash
btp get accounts/global-account --show-hierarchy \
  | sed '1,/^type:\s/d' \
  | grep '^directory\s'
```

This gives me:

```
directory        e6cde265-5d78-4e7c-a8cb-8625a4daaa04   mydir           42bb4252-2b49-4685-bcd7-62c8d85d8b13   global account
directory        4cc2e8f8-8cef-4828-82af-9b5adae387de   fruit           e6cde265-5d78-4e7c-a8cb-8625a4daaa04   directory
directory        3b4ba347-973f-4571-b4af-7862886104be   apple           4cc2e8f8-8cef-4828-82af-9b5adae387de   directory
directory        0b58163d-5c49-4eb5-b359-17c9a0d94138   banana          4cc2e8f8-8cef-4828-82af-9b5adae387de   directory
directory        4a050bbe-5c4d-4ac0-9a66-d7e513f8b4c8   this and that   e6cde265-5d78-4e7c-a8cb-8625a4daaa04   directory
```

Now all I need to do is grab the value of the third column ... oh, wait.

The directory named "this and that" is going to give me a bit of a headache; because it's not tabs that separate the columns, but normal spaces, I can't easily distinguish the spaces separating the columns from the spaces separating the words in the name "this and that".

While it's possible I could come up with some solution here, I think it's getting a little complex.

The BTP CLI sports a [JSON output mode](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/dcb85b7dea61432cbafaab4ce0ec9b08.html). This provides me with a more reliable and predictable data structure that I can parse. The natural tool to reach for here is of course [jq](https://stedolan.github.io/jq/), the "lightweight and flexible command-line JSON processor".

However, the structure of the JSON in this particular case is not regular; the nesting of parent and child objects reflects the structure of the actual hierarchy in the global account. That makes sense of course, but to be honest, the prospect of wielding some `jq` incantation to parse an object structure that I cannot know in advance felt a little scary; I had visions of recursive procedures and more.

Here's a short section of the [JSON output](/autodidactics/content/2021/10/hierarchy.json), to show you what I mean:

![JSON output structure]({{ "/img/2021/10/json-output-structure.png" | url}})

As it turns out, finding the objects in this hierarchy of nested parents and children turned out to be not as scary as I thought. Here's the invocation again, this time passing the option `--format json` when invoking `btp`, and parsing the output with `jq`:

```bash
btp --format json get accounts/global-account --show-hierarchy \
  | jq -r 'recurse | objects | select(.directoryType=="FOLDER") | .displayName'
```

This produces the following output to STDOUT:

```
fruit
banana
apple
this and that
```

Wonderful!

Here's a quick summary of what each of the items in the `jq` pipeline does:

* `recurse`: Recursively descends `.`, producing every value
* `objects`: Selects only inputs that are objects
* `select(boolean_expression)`: produces its input unchanged if the expression returns true

The boolean expression used with `select` ensures that only objects that have a JSON property `directoryType` with the specific value `FOLDER` are picked out. From those, just the value of the `displayName` property is then produced.

And that's it. Not as scary as I thought.

I need to improve my `jq` fu, and using it like this to process output from CLI tools such as `btp` is one way of doing it.
