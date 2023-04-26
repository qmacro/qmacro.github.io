---
layout: post
title: More on the comma as generator, and streaming with select in jq
date: 2023-04-25
tags:
  - jq
---
In the context of writing a short jq script to turn a JSON representation of an OData entity set into a set of CSV records, I came across something in jq that reminded me of something I'd discovered recently, and made me think a bit more about it.

In the source data, each entity was represented by an object, but I only wanted to include properties whose value types were either strings, numbers or booleans. I ended up taking the simplest route to check, in an expression supplied to a call to `select`, using [type](https://stedolan.github.io/jq/manual/#type) to check whether the type of a value was one of these.

What I found was another instance of the [comma as generator](/blog/posts/2023/04/02/learning-from-community-solutions-on-exercism-part-2/#generators-and-streams-of-values) that I wrote about a couple of weeks ago in [Learning from community solutions on Exercism - part 2](/blog/posts/2023/04/02/learning-from-community-solutions-on-exercism-part-2/). 

Moving away from the original source input, let's consider the simplest case where I want to pick out only numbers from a stream of values:

```jq
42, "hello", true | select(type == "number")
```

This produces:

```json
42
```

So far so good. But what about picking out both numbers and strings? The simplest looking and perhaps idiomatic approach looks like this:

```jq
42, "hello", true | select(type == ("number", "string"))
```

As one would expect, or at least hope, this produces:

```json
42
"hello"
```

But what exactly is going on with `type == ("number", "string")`? Visually it's not too far from representing what we want. And in fact it's the same pattern as we saw in `"car" | . == ("car", "truck")` in [that previous post](/blog/posts/2023/04/02/learning-from-community-solutions-on-exercism-part-2/#generators-and-streams-of-values). Moreover, how does this actually work with `select`?

I'd noticed that `select` is [defined as a builtin in jq itself](https://github.com/stedolan/jq/blob/a9f97e9e61a910a374a5d768244e8ad63f407d3e/src/builtin.jq#L4):

```jq
def select(f): if f then . else empty end;
```

The jq manual says:

> The function `select(foo)` produces its input unchanged if `foo` returns true for that input, and produces no output otherwise.

Before we try to use that, let's remove the `select` from the expression for a moment to see what we get:

```jq
42, "hello", true | type == ("number", "string")
```

What we get is something that looks a little odd, at least at first:

```json
true
false
false
true
false
false
```

How do we visually parse this? Well, it's two "pairs" of booleans, one pair for each of the input values `42`, `"hello"` and `true`, where the pair represent the result of comparing the type of each value twice, with `"number"` and with `"string"`, in order. Splitting these pairs up with whitespace and adding some explanation, we get:

```text
true     :-- is number \   42
false    :-- is string /

false    :-- is number \ "hello"
true     :-- is string /

false    :-- is number \  true
false    :-- is string /
```

Then, reminding ourselves that the definition of `select` is:

```jq
def select(f): if f then . else empty end;
```

then the values that stream through to `select` are either emitted (`.`) if the condition evaluates to `true`, otherwise nothing is emitted (`empty`) if the condition evaluates to `false`.

This results in the following behaviour:

```text
true     :-- is number \   42    / emitted       --:   42
false    :-- is string /         \ not emitted

false    :-- is number \ "hello" / not emitted
true     :-- is string /         \ emitted       --: "hello"

false    :-- is number \  true   / not emitted
false    :-- is string /         \ not emitted
```

and thus:

```json
42
"hello"
```

The fascinating thing is that if we were to have a duplicate entry (`"number"`) in the parentheses on the right hand side, like this:

```jq
42, "hello", true | select(type == ("number", "string", "number"))
```

then our result would be different, and probably not what we were expecting:

```json
42
42
"hello"
```

But knowing what's going on allows us to understand why. There are now three values each being tested not twice but three times:

```text
true     :-- is number \         / emitted       --:   42
false    :-- is string |   42    | not emitted
true     :-- is number /         \ emitted       --:   42

false    :-- is number \         / not emitted
true     :-- is string | "hello" | emitted       --: "hello"
false    :-- is number /         \ not emitted

false    :-- is number \         / not emitted
false    :-- is string |  true   | not emitted
false    :-- is number /         \ not emitted
```

While the superficial operation of this jq expression is sort of obvious, why it works is less so. At least to me. And in case it wasn't obvious to you either, I hope this has helped!
