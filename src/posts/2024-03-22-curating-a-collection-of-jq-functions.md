---
layout: post
title: Curating a collection of jq functions
date: 2024-03-22
tags:
  - jq
---
I read a very interesting article [DuckDB as the New jq](https://www.pgrs.net/2024/03/21/duckdb-as-the-new-jq/) today, plus an equally engaging conversation in [the Lobsters thread about it](https://lobste.rs/s/x5immj/duckdb_as_new_jq). 

In the article the author Paul wants to summarise [Go repos](https://api.github.com/orgs/golang/repos) by licence, and uses SQL in DuckDB to do it. Very nice! He also mentions jq, and that he finds it hard to use and needs to refer to the documentation for anything more than just selecting fields. Fair enough. 

The jq example he came up with looks like this:

```jq
group_by(.license.key)
  | map({license: .[0].license.key, count: length})
  | sort_by(.count)
  | reverse
```

I recognised the "pattern" of using `group_by` then `map` to arrange the results by the value that was used to group the data (`.license.key`), with the result for each of the values being a count (`length`).

I have used this pattern a lot, and this article and example prompted me to think about how I might build up a collection of small functions that would be always available to me. In [the Modules section of the jq manual](https://jqlang.github.io/jq/manual/#modules) it says, amongst plenty of other things, that:

> If `$HOME/.jq` is a file, it is sourced into the main program.

So I took the step of creating `~/.jq`, as a symbolic link to a file of the same name in my [dotfiles](https://github.com/qmacro/dotfiles) which I have in my dev containers.

In it, I took a first stab with this:

```jq
def count_by(key):
    group_by(key)
    | map({
        key: first|key,
        value: length
      })
;
```

Assuming I have the contents of the JSON resource at <https://api.github.com/orgs/golang/repos> in a file called `data.json`, I can now use `count_by` like this:

```shell
jq 'count_by(.license.key)' data.json
```

which will produce this:

```json
[
  {
    "key": null,
    "value": 2
  },
  {
    "key": "apache-2.0",
    "value": 5
  },
  {
    "key": "bsd-3-clause",
    "value": 23
  }
]
```

(I quite like the idea of using the "generic" property names `key` and `value` as it feels more compatible, at least in my brain, with how I think about using [to_entries, from_entries and with_entries](https://jqlang.github.io/jq/manual/#to_entries-from_entries-with_entries)).

Going one step further, I added this:

```jq
def group_with(key;value):
    group_by(key)
    | map({
        key: first|key, 
        value: value
      })
;
```

This means that I can now additionally supply an expression to determine the value of the `value` property, rather than just the count as with the current version of `count_by`. Here's an example:

```shell
jq 'group_with(.license.key;map(.name))' data.json
```

This produces:


```json
[
  {
    "key": null,
    "value": [
      "blog",
      "talks"
    ]
  },
  {
    "key": "apache-2.0",
    "value": [
      "glog",
      "groupcache",
      "appengine",
      "geo",
      "mock"
    ]
  },
  {
    "key": "bsd-3-clause",
    "value": [
      "gddo",
      "lint",
      "oauth2",
      "example",
      "go",
      "winstrap",
      "review",
      "protobuf",
      "tools",
      "benchmarks",
      "...",
      "snappy"
    ]
  }
]
```

I can now also redefine the more specific `count_by` using `group_with`, like this:

```jq
def count_by(key): group_with(key;length);
```

That seems quite nice to me. 

This short post is not to try and convince folks about what's better; it's more to share my thoughts about jq as a language with [module](https://jqlang.github.io/jq/manual/#modules), collections of sibling functions (such as the [_entries family](https://jqlang.github.io/jq/manual/#to_entries-from_entries-with_entries) mentioned earlier, and the ability to [define a collection of useful functions](https://jqlang.github.io/jq/manual/#defining-functions) and use them easily in `jq` (and `ijq` for that matter) invocation contexts.
