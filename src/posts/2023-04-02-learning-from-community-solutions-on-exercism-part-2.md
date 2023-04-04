---
layout: post
title: Learning from community solutions on Exercism - part 2
date: 2023-04-02
tags:
  - jq
  - exercism
---
In response to the [first part of this series](/blog/posts/2023/03/29/learning-from-community-solutions-on-exercism-part-1/), in relation to the [rabbit hole in the Vehicle Purchase exercise](/blog/posts/2023/03/29/learning-from-community-solutions-on-exercism-part-1/#vehicle-purchase-exercise), Mattias Wadman [kindly shared some variants using generators](https://fosstodon.org/@wader/110117608773689719), which I'll reproduce here:

```jq
def needs_license: 
  any(. == ("car", "truck"); .);
```

```jq
def needs_license: 
  if . == ("car", "truck") then true else empty end // false;
```

```jq
def needs_license: 
  (. == ("car", "truck") | select(.)) // false;
```

Each variant, when fed the same input, like this:

```jq
"car", "truck", "bike" | needs_license
```

produces the same output, i.e.:

```json
true
true
false
```

(It's worth pointing out before continuing that none of these variants will fall foul of the gotcha I discovered with `contains` / `inside`, so I can move on from testing whether `true` will be returned for `"car"` when the possible vehicles listed includes `"cart"` and put that behind us.)

In this post, I'll take a brief look at [generators](#generators-and-streams-of-values), and then look at each of these solutions in turn, i.e.

- [the "any" based function](#the-any-based-function)
- [the "if ... then ... else ... end" based function](#the-if-then-else-end-based-function)
- [the "select" based function](#the-select-based-function)

<a name="generators-and-streams-of-values"></a>
## Generators and streams of values

There's a section that's common to each of these functions, and it's this:

```jq
. == ("car", "truck")
```

This struck me right between the eyes. Given the context that the value `.` would be a vehicle string e.g. `"car"`, I can't help but admit I was wondering what the heck was going on here. How can a string be sensibly compared with what looks like a list of strings? 

So I decided to dig in, and am glad I did. 

It becomes quickly clear that `("car", "truck")` isn't a list in the sense I was thinking about. First, the [parentheses](https://stedolan.github.io/jq/manual/#Parenthesis) are just for grouping, not for any literal list construction. So let's omit them for a second. In fact, let's reduce the expression to something simpler, to see what I get:

```jq
"car" | . == "car"
# => true
```

So far so good. But what happens when I add the `"truck"` value?

```jq
"car" | . == "car", "truck"
```

This gives us:

```json
true
"truck"
```

The output is not a single JSON value, there are two, one from either side of the comma. And looking at the [Generators and iterators](https://stedolan.github.io/jq/manual/#Generatorsanditerators) section of the jq manual, I discover that:

> Even the comma operator is a generator. 

What is a generator? Something that produces zero, one or more values. I've used [iterators and generators in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators), and also [in Python](https://wiki.python.org/moin/Generators), so the concept is at least familiar to me.

What's happening here is that the comma is acting as a generator, producing (in this case) a value resulting from the expression on its left (`"car" | . == "car")`, and a value resulting from the expression on its right (`"truck"`). This is also why the output is as it is, and not, say, `[true, "truck"]`; what's produced is not an array, but a stream of two discrete (and independently valid) JSON values.

And the difference between this and the version with the parentheses is becoming clearer now. What happens when I add them?

```jq
"car" | . == ("car", "truck")
```

The grouping that the `(...)` brings doesn't affect the generator nature of the comma, it just causes the `. ==` part of the expression to be applied to the group of strings (`"car"` and `"truck"`), one by one. So this results in:

```json
true
false
```

In other words, it's the equivalent of:

```jq
"car" | . == "car", . == "truck"
```

### More on comma as generator

I wanted to dwell a little more on this comma-as-generator. Here are a couple of very simple examples:

```jq
1, 2, 3, 4, 5
```

This, unsurprisingly, produces:

```json
1
2
3
4
5
```

But I know know what's actually happening, and the stream of scalar JSON values is more obvious.

(This subtlety reminds me of another subtlety in LISP, where list construction can be done via the `list` function: `(list 1 2 3 4 5)` which produces `(1 2 3 4 5)`, or more explicitly using the `cons` function: `(cons 1 (cons 2 (cons 3 (cons 4 (cons 5 nil)))))` which also produces `(1 2 3 4 5)`. We're not constructing lists here, but there's a vaguely similar feeling in how things are constructed. But anyway, I digress.)

How about using functions either side of commas, functions that produce streams of values? 

```jq
[1,2]|map(.*10)[], range(3)
```

This produces a stream of five individual JSON scalar values:

```json
10
20
0
1
2
```

Note that the important part of the expression to the left of the comma in this example is the [array iterator](https://stedolan.github.io/jq/manual/#Array/ObjectValueIterator:.[]), i.e. the `[]` part. If we were to omit that:

```jq
[1,2]|map(.*10), range(3)
```

we'd get this:

```json
[
  10,
  20
]
0
1
2
```

This is a stream of four JSON values, the array being the first one.


<a name="the-any-based-function"></a>
## The "any" based function

In part 1 of this series, in looking at [some alternatives](/blog/posts/2023/03/29/learning-from-community-solutions-on-exercism-part-1/#some-alternatives) for the Vehicle Purchase exercise, I noted that the `any` function can be used with 0, 1 or 2 parameters.

In Matthias's first function example, we see the `any/2` in use:

```jq
def needs_license: 
  any(. == ("car", "truck"); .);
```

The jq manual says [the following](https://stedolan.github.io/jq/manual/#any,any(condition),any(generator;condition)) about this form of `any`:

> The `any(generator; condition)` form applies the given condition to all the outputs of the given generator.

So the first argument passed to `any/2` is exactly the expression we've been looking at thus far, i.e. `. == ("car", "truck")`. And it's supplied to the generator parameter.

The second argument being passed is `.` which is supplied to the condition parameter. 

So how is this function body to be interpreted? Trying out a simple call to `any/2` helps me understand it a little more; the expression returns `true` here because at least one of the values (`2`) emitted from the generator expression `1,2,3` is divisible by 2:

```jq
any(1, 2, 3; . % 2 == 0)
# => true
```

Even more simply, I try this:

```jq
any(null, false, true; . == true)
# => true
```

In fact, this can be simplified to:

```jq
any(null, false, true; .)
# => true
```

The values (`null`, `false` and `true`) in the generator expression are considered in the context of the condition expression `.` and this of course then evaluates to `true` due to the third value being truthy. I deliberately used the word "truthy" here as this also works:

```jq
any(null, false, 42; .)
# => true
```

In working slowly through this, I realise what looked odd to me about Matthias's first function solution, given the `any(generator; condition)` signature - the generator expression looks more like a condition expression:

```jq
def needs_license: 
  any(. == ("car", "truck"); .);
```

But now having a better understanding of how `. == ("car", "truck")` works as a generator, things are now clear. Piping the value `"truck"` into this function, for example, gives us what we want:

```jq
"truck" | needs_license
# => true
```

And to make sure I see what's going on, I can insert a couple of [debug](https://stedolan.github.io/jq/manual/#debug) filters in-line with the generator:

```jq
def needs_license: 
  any(debug | . == ("car", "truck") | debug; .);
"truck" | needs_license
```

Look at what that gives us (I've added some blank lines to better distinguish things):

```json
["DEBUG:","truck"] From the 1st debug, value going
                   into the generator.

["DEBUG:",false]   From the 2nd debug, these two values
["DEBUG:",true]    are emitted from the generator.

true               the final result produced by the call
```

<a name="the-if-then-else-end-based-function"></a>
## The "if ... then ... else ... end" based function

Here's the next sample solution:

```jq
def needs_license: 
  if . == ("car", "truck") then true else empty end // false;
```

This looked a bit odd to me too. Knowing that `. == ("car", "truck")` is essentially a generator of multiple values, what's going on here? Multiple values in the condition part of an if-then-else construct? 

Well, the jq manual [has the following to say](https://stedolan.github.io/jq/manual/#if-then-else) in the context of `if A then B else C end`:

> If the condition A produces multiple results, then B is evaluated once for each result that is not false or null, and C is evaluated once for each false or null.

What does this look like? To get a feel for it, I try this:

```jq
if "car" == ("car", "truck") then "yes" else "no" end
```

This produces:

```json
"yes"
"no"
```

The `"yes"` is from the `"car" == "car"` returning `true` (i.e. something that "is not false or null"), and the `"no"` is from the `"car" == "truck"` returning `false`. 

So far so good - and I know that multiple values from the generator expression can and do "flow through" the if-then-else construct. This also then helps me understand what is going on in the rest of the construct:

```jq
if . == ("car", "truck") then true else empty end
```

First, the `true` and `empty` values, in their respective positions here, are so that the if-then-else construct will emit `true` (if there's a vehicle match) or nothing at all. 

Using something like `if . == ("car", "truck") then true else false end` is not going to work for us here, not least because it's redundant (it could be reduced to the actual condition, without the if-then-else at all) but mostly because it will produce multiple boolean values, whatever the input. Only one is wanted, and that's why `empty` is used to throw away any `false` values. 

But that then leaves just `true` or nothing being emitted, and this is what the `// false` is for:

```jq
if . == ("car", "truck") then true else empty end // false;
```

Using this [alternative operator](https://stedolan.github.io/jq/manual/#Alternativeoperator://) (`//`), `false` can be emitted where there's no value coming from the if-then-else; in other words, whenever there are `false` value(s) being emitted from the generator in the condition position.

To round off this section, I'll add a couple of `debug`s to the body of the function to see with my own eyes what's going on (I've also added some extra whitespace for readability):

```jq
def needs_license: 
  if debug . == ("car", "truck") | debug 
  then true 
  else empty
  end // false;
```

First, passing a vehicle that's not in the list, such as with `"boat" | needs_license`, emits this:

```json
["DEBUG:","boat"]
["DEBUG:",false]
["DEBUG:",false]
false
```

The value `"boat"` goes in, two `false` values are emitted from the generator, they both get turned into nothing (with `else empty`) and then this nothingness is converted into `false` with the `// false`. 

Now how about a vehicle that is in the list: `"car" | needs_license` emits this:

```json
["DEBUG:","car"]
["DEBUG:",true]
["DEBUG:",false]
true
```

The `true` is emitted for `"car" == "car"`, and then `false` is emitted for `"car" == "truck"`. The `false` value is thrown away, but also because we still have a `true` value coming out of the if-then-else construct, the `// false` does not kick in, and we end up withat `true` value.

While I still prefer the "any" based function solution to this one, I still think it's quite elegant, and it taught me to be aware of generators producing multiple values in the context of a condition in such a construct, and how to handle them.

<a name="the-select-based-function"></a>
## The "select" based function

The last of the function variants is this one:

```jq
def needs_license: 
  (. == ("car", "truck") | select(.)) // false;
```

Everything here except for the `select(.)` has been covered already, so I can treat myself to slightly extended test, while omitting that `select(.)` part (and the `// false`) for now:

```jq
"car", "truck", "bike" | . == ("car", "truck")
```

This produces:

```json
true
false
false
true
false
false
```

The order here is significant. That's three pairs of two booleans, from the combination of pairing `"car"`, `"truck"` and `"boat"`, one at a time, with the two values `"car"` and `"truck"`:

|Input|Compare with `"car"`|Compare with `"truck"`|
|-|-|-|
|`"car"`|`true`|`false`|
|`"truck"`|`false`|`true`|
|`"boat"`|`false`|`false`|

The [select](https://stedolan.github.io/jq/manual/#select(boolean_expression)) function is described in the jq manual as `select(boolean_expression)` thus:

> The function `select(foo)` produces its input unchanged if `foo` returns `true` for that input, and produces no output otherwise.

This description reminds me of the `if <condition> then true else empty end`; the only difference is that `select` returns the input unchanged and this if-then-else construct explicitly returns true. It just so happens of course that the input in this `select` case is going to be boolean values too, so it has the same effect. 

And because it has the same effect, it also needs to supply the alternative value `false` when there's not a match, which is done again with `// false` attached to the entire output of the combination of the generator and the `select` function, i.e. this combination: `(.==("car", "truck") | select(.))`. 

I think the beauty here is the use of `.` as the boolean expression that `select` expects, conveying the values from the generator. 

## Wrapping up

I hadn't planned to write this content in this second part of the series, but thanks to Matthias's contribution, I thought it was worthwhile. I've certainly had a good opportunity to dwell on the minutiae of these solutions and to get a better feel for streams of values in jq programs.

In the next part I'll continue to look at community solutions for some other jq exercises on Exercism, and explain what I missed, observed, and learned.
