---
layout: post
title: Understanding jq's SQL style operators JOIN and INDEX
tags:
  - jq
---
In this post I explore a couple of new (to me) operators in jq's arsenal: `JOIN` and `INDEX`, based on an answer to a question ([JQ: How to join arrays by key?](https://stackoverflow.com/q/72723706/384366) that I came across on Stack Overflow.

The [answer](https://stackoverflow.com/a/72725480/384366) was in response to a question about how to merge two arrays of related information. I found it interesting and it also introduced me to a couple of operators in `jq` that I'd hitherto not come across. There's a section in the manual titled [SQL-Style Operators](https://stedolan.github.io/jq/manual/#SQL-StyleOperators) that describe them.

I could have sworn I'd never seen this section before, so had instead looked to see if they were defined in the [builtin.jq](https://github.com/stedolan/jq/blob/a9f97e9e61a910a374a5d768244e8ad63f407d3e/src/builtin.jq) file, where `jq` functions, filters and operators are defined ... in `jq`. I did come across them there, and their definitions helped me understand them too. I thought I'd explore them in this blog post, "out loud", as it were.

## Test data

Throughout this post I'm going to use the data described in the Stack Overflow question, which (after a bit of tidying up) looks like this (and which I've put into a file called `data.json`):

```json
{
  "weights": [
    {
      "name": "apple",
      "weight": 200
    },
    {
      "name": "tomato",
      "weight": 100
    }
  ],
  "categories": [
    {
      "name": "apple",
      "category": "fruit"
    },
    {
      "name": "tomato",
      "category": "vegetable"
    }
  ]
}
```

## Starting with the definitions in builtin.jq

I want to start by staring at the definitions of the two operators in `builtin.jq`. Here's the section of code, with a few empty lines added for readability:

```jq
def INDEX(stream; idx_expr):
  reduce stream as $row ({}; .[$row|idx_expr|tostring] = $row);

def INDEX(idx_expr): INDEX(.[]; idx_expr);

def JOIN($idx; idx_expr):
  [.[] | [., $idx[idx_expr]]];

def JOIN($idx; stream; idx_expr):
  stream | [., $idx[idx_expr]];

def JOIN($idx; stream; idx_expr; join_expr):
  stream | [., $idx[idx_expr]] | join_expr;
```

The first thing I see is that there are multiple definitions of both `INDEX` and `JOIN`, each with different numbers of parameters. In various discussions, I've seen this represented in the way folks refer to them. For example, there are three definitions of `JOIN`, one with two parameters (`JOIN($idx; idx_expr)`), one with three (`JOIN($idx; stream; idx_expr)`) and one with four (`JOIN($idx; stream; idx_expr; join_expr)`). These are referred to, respectively, like this: `JOIN/2`, `JOIN/3` and `JOIN/4`, where the number represents the [arity](https://en.wikipedia.org/wiki/Arity).

### INDEX definitions

So I set off on my exploration, looking at the two definitions of `INDEX`.

#### INDEX/2

Starting with `INDEX/2`, I see:

```jq
def INDEX(stream; idx_expr):
  reduce stream as $row ({}; .[$row|idx_expr|tostring] = $row);
```

Earlier this year I managed to get to grips with the `reduce` function in `jq`, and wrote about it in this post: [Understanding jq's reduce function](/blog/posts/2022/03/25/understanding-jq's-reduce-function/). With that understanding, the call to `reduce` here doesn't seem as impenetrable. Here's how I understand it, in pseudo-JS:

```javascript
stream.reduce((accumulator, row) => {
  accumulator[<result of determining the idx_expr>] = row
  return accumulator
}, {})
```

In other words, this `reduce` invocation iterates through the elements of `stream`, and for each one, represented by `$row` each time, adds a new entry to an object, which is empty to start with (`{}`), where the value of the entry is the element itself (`$row`) and the key is determined by applying the `idx_expr` expression to the row, and then stringifying the result (`tostring`).

What happens if I invoke such an `INDEX` operator on the test data above? How about:

```bash
jq 'INDEX(.categories[]; .name)' data.json
```

First, `.categories[]` is used as the "stream", i.e. a stream of values - in this case the values are objects each with `name` and `category` keys, like this:

```json
{
  "name": "apple",
  "category": "fruit"
},
{
  "name": "tomato",
  "category": "vegetable"
}
```

In this invocation of `INDEX`, `.name` is set as the `idx_expr` (the expression for determining what the index, or key, is going to be). So for the first element (the object with the "apple" details) the `idx_expr` of `.name` gives "apple".

The result of invoking `INDEX(.categories[], .name)` then, is this:

```json
{
  "apple": {
    "name": "apple",
    "category": "fruit"
  },
  "tomato": {
    "name": "tomato",
    "category": "vegetable"
  }
}
```

So this has turned a stream of objects into a single object with keys ("indices", I guess) built from values in the original objects.

#### INDEX/1

And `INDEX/1` is just a call to `INDEX/2` with the first parameter set to `.[]`:

```jq
def INDEX(idx_expr): INDEX(.[]; idx_expr);
```

This feels like a nice convenience redefinition, and I get the feeling that this version might see more use in a pipeline context. Looking at how it might be used, with the same data, I get this:

```bash
jq '.categories | INDEX(.name)' data.json
```

This produces the same thing:

```json
{
  "apple": {
    "name": "apple",
    "category": "fruit"
  },
  "tomato": {
    "name": "tomato",
    "category": "vegetable"
  }
}
```

Implicitly what's piped into `INDEX/1` has to be an array, I guess, which is why the left hand side of the pipe here is `.categories`, rather than `.categories[]` which would have caused multiple invocations of `INDEX`, one for every array element. Moreover, `.categories` is more appropriate because the first thing that `INDEX/1` does is invoke the [array iterator](https://stedolan.github.io/jq/manual/#Array/ObjectValueIterator:.[])  on it (i.e. the `.[]` in `INDEX(.[]; idx_expr)`).

So in summary, `INDEX` can be used to create a "lookup" object where the keys are determined based on what you specify to pick out of the incoming stream.

### JOIN definitions

Now I can turn my attention to each of the definitions of `JOIN`, and there are three: `JOIN/2`, `JOIN/3` and `JOIN/4`:

```jq
def JOIN($idx; idx_expr):
  [.[] | [., $idx[idx_expr]]];

def JOIN($idx; stream; idx_expr):
  stream | [., $idx[idx_expr]];

def JOIN($idx; stream; idx_expr; join_expr):
  stream | [., $idx[idx_expr]] | join_expr;
```

I'll start by examining `JOIN/4`.

#### JOIN/4

As the arity identification suggests, this version takes four parameters. Even though the definition is just above, it's worth repeating it here, to be able to stare at for a minute or two:

```jq
def JOIN($idx; stream; idx_expr; join_expr):
  stream | [., $idx[idx_expr]] | join_expr;
```

It's described in the manual thus (emphasis mine, to refer to the parameters):

> This builtin joins the values from the **given stream** to the **given index**. The index's keys are computed by applying the given **index expression** to each value from the given stream. An array of the value in the stream and the corresponding value from the index is fed to the given **join expression** to produce each result.

Here's an example call that I'll run shortly:

```jq
INDEX(.categories[]; .name) as $categories
| JOIN($categories; .weights[]; .name; add)
```

Examining each of the parameters in turn, in the context of this description, we have the following values provided for the following parameters:

**`$idx <-- $categories` ("the given index")**

An example of such an index is what's produced by the `INDEX` builtin we looked at earlier:

```json
{
  "apple": {
    "name": "apple",
    "category": "fruit"
  },
  "tomato": {
    "name": "tomato",
    "category": "vegetable"
  }
}
```

In the example call, this is referred to via `$categories` which is a symbolic binding to the result of `INDEX(.categories[]; .name)`.

**`stream <-- .weights[]` (the "given stream")**

This is a sequence, usually of objects. In the example call, I'm using `.weights[]` as the stream, i.e. the objects describing food and their respective weights:

```json
{
  "name": "apple",
  "weight": 200
},
{
  "name": "tomato",
  "weight": 100
}
```

**`idx_expr <-- .name` (the "given index expression")**

This is effectively what to use, in the stream, to look up the corresponding data in the index. In this case, `.name` is appropriate, as it has the values which are used as keys ("apple" and "tomato") in the index.

**`join_expr <-- add` (the "given join expression")**

In order to understand why this parameter exists, it's necessary to have in mind what would be produced before such a join. For every stream object, after a successful lookup of a corresponding object in the index based on the index expression that points to a value in that stream object, what's produced is an array of two objects.

Here's an example, again based on the call I'll make, which is:

```jq
INDEX(.categories[]; .name) as $categories
| JOIN($categories; .weights[]; .name; add)
```

The first object in the `.weights[]` stream is:

```json
{
  "name": "apple",
  "weight": 200
}
```

From this, the value of `.name` is "apple", and this is used to look for an entry in the `$categories` index, and one is found - this one:

```json
"apple": {
  "name": "apple",
  "category": "fruit"
}
```

Note that what's returned is not that entire structure, but just the value that "apple" points to:

```json
{
  "name": "apple",
  "category": "fruit"
}
```

What happens now is described in the last sentence from the manual description:

> An array of the value in the stream and the corresponding value from the index is fed to the given join expression to produce each result.

So looking at the first part of that sentence, this is what's produced - an array like this:

```json
[
  {
    "name": "apple",
    "weight": 200
  },
  {
    "name": "apple",
    "category": "fruit"
  }
]
```

With the knowledge of what's produced before the `join_expr` is employed, it is now clearer as to why such a join expression exists as a parameter.

In this example case it makes most sense to merge the two objects, and the multi-faceted [add](https://stedolan.github.io/jq/manual/#add) filter is perfect for this, producing - from that array of two objects - this single object:

```json
{
  "name": "apple",
  "weight": 200,
  "category": "fruit"
}
```

Joining the pairs of objects in one way or another is very likely to be what one desires.

#### JOIN/3

Following on from `JOIN/4`, it's easier to examine the other arity versions, starting with this one:

```jq
def JOIN($idx; stream; idx_expr):
  stream | [., $idx[idx_expr]];
```

From the definition, the difference to `JOIN/4` is just that the `join_expr` parameter is omitted, and there's no pipe into such an expression at the end. The equivalent of this in a `JOIN/4` context would be to specify `.` as the `join_expr`. I guess it's nicer not have to specify that if you don't want any special joining of the pairs of elements in your result.

#### JOIN/2

This is an even more cut down version, in that not only is there no `join_expr` but there's also no explicit parameter for specifying the stream. Instead, one is expected to pipe that into such a call to `JOIN/2`. This is what the definition looks like, and one can see the `.[]` at the start which unwraps an assumed array to produce a stream that is then piped into the main definition:

```jq
def JOIN($idx; idx_expr):
  [.[] | [., $idx[idx_expr]]];
```

Note also in this arity version that the results are returned within an outer array via the `[...]` array construction that wraps the entire definition.

## Walking through the entire call

Now I've examined the different definitions, it's time to finish off with putting the new knowledge to work, to better understand the [answer](https://stackoverflow.com/questions/72723706/jq-how-to-join-arrays-by-key/72725480#72725480) given, which centres around this `jq` expression and operates on the same test data I described earlier:

```jq
{weights: [JOIN(INDEX(.categories[]; .name); .weights[]; .name; add)]}
```

With some whitespace, that expression looks like this, which might help us read it more easily and see that there's nothing we don't now know about:

```jq
{
  weights: [
    JOIN(
      INDEX( .categories[]; .name );
      .weights[];
      .name;
      add
    )
  ]
}
```

The expression contains a call to `JOIN/4`, and the first parameter (the "index") is actually a call to `INDEX/2`, which, as we know, given the test data, produces this:

```json
{
  "apple": {
    "name": "apple",
    "category": "fruit"
  },
  "tomato": {
    "name": "tomato",
    "category": "vegetable"
  }
}
```

Then there's `.weights[]` specified for the "stream", from which values for the "index expression" `.name` are used to look up data in the index. Finally, `add` is specified as what to use as the "join expression". What's produced is a stream of values which are then enclosed in an array (`[...]`). This array is then returned as the value of a `weights` property inside an object that's constructed just to hold that property.

## Wrapping up

Again, I've probably used too many words in my exploration, but perhaps it will help you in your understanding as you explore this area too. 

This exploration was inspired by the great [answer](https://stackoverflow.com/a/72725480/384366) by Stack Overflow user [pmf](https://stackoverflow.com/users/2158479/pmf). 

If you're looking for another angle, and another example, there's [another great answer](https://stackoverflow.com/a/71107203/384366) from the same user, to a related question [Understanding jq JOIN()](https://stackoverflow.com/q/71106595/384366).
