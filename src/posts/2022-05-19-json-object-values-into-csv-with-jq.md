---
layout: post
title: JSON object values into CSV with jq
tags:
  - jq
  - json
  - odata
  - northwind
  - csv
---
I wanted to grab a CSV version of a JSON representation of an entityset in the Northwind OData service. Here's how I converted the JSON structure into CSV with jq, and along the way, I talk about arrays, objects, iterators, object indices, variables, identity, array construction and format strings.

In our current [Back to basics: OData series](https://www.youtube.com/playlist?list=PL6RpkC85SLQDYLiN1BobWXvvnhaGErkwj) on the Developer Advocates' Hands-on SAP Dev [show](https://blogs.sap.com/2020/11/09/an-overview-of-sap-developers-video-content/#shows) I'm using various aspects of the classic Northwind OData service:

[https://services.odata.org/V4/Northwind/Northwind.svc/](https://services.odata.org/V4/Northwind/Northwind.svc/)

There's an entityset that I wanted to grab the data from, but have in CSV form. It's the [Customer_and_Suppliers_by_Cities](https://services.odata.org/v4/northwind/northwind.svc/Customer_and_Suppliers_by_Cities) entityset that looks like this:

```json
{
  "@odata.context": "https://services.odata.org/V4/Northwind/Northwind.svc/$metadata#Customer_and_Suppliers_by_Cities",
  "value": [
    {
      "City": "Berlin",
      "CompanyName": "Alfreds Futterkiste",
      "ContactName": "Maria Anders",
      "Relationship": "Customers"
    },
    {
      "City": "México D.F.",
      "CompanyName": "Ana Trujillo Emparedados y helados",
      "ContactName": "Ana Trujillo",
      "Relationship": "Customers"
    },
    {
      "City": "México D.F.",
      "CompanyName": "Antonio Moreno Taquería",
      "ContactName": "Antonio Moreno",
      "Relationship": "Customers"
    }
  ]
}
```

> I've reduced the actual representation down to just three entries to save space here, and will retrieve these three entries only (with OData's `$top` system query option) to keep the display of data in this blog post under control.

I wanted to turn this JSON into something like this:

```text
"Berlin","Alfreds Futterkiste","Maria Anders","Customers"
"México D.F.","Ana Trujillo Emparedados y helados","Ana Trujillo","Customers"
"México D.F.","Antonio Moreno Taquería","Antonio Moreno","Customers"
```

As I'm trying to [learn more](/tags/jq/) about [jq](https://stedolan.github.io/jq/) I thought I'd use that.

Before doing anything else, I grab the representation into a local file called `entities.json` like this (restricting the entities to the first three):

```bash
curl \
  --url 'https://services.odata.org/v4/northwind/northwind.svc/Customer_and_Suppliers_by_Cities?$top=3' \
  > entities.json
```

## Iterating through the entities

OK, so it's the values in the objects that I want, in the `value` property. So I start out with the simple [object identifier-index][manual-object-identifier-index] like this:

```bash
jq '.value' entities.json
```

This gives me:

```bash
[
  {
    "City": "Berlin",
    "CompanyName": "Alfreds Futterkiste",
    "ContactName": "Maria Anders",
    "Relationship": "Customers"
  },
  {
    "City": "México D.F.",
    "CompanyName": "Ana Trujillo Emparedados y helados",
    "ContactName": "Ana Trujillo",
    "Relationship": "Customers"
  },
  {
    "City": "México D.F.",
    "CompanyName": "Antonio Moreno Taquería",
    "ContactName": "Antonio Moreno",
    "Relationship": "Customers"
  }
]
```

The value of the `value` property is indeed an array of objects. So far so good. But I want to do something with each of those objects, so next I add the [array value iterator][manual-array-value-iterator] (`[]`) thus:

```bash
jq '.value[]' entities.json
```

This results in something that looks almost but not quite the same:

```json
{
  "City": "Berlin",
  "CompanyName": "Alfreds Futterkiste",
  "ContactName": "Maria Anders",
  "Relationship": "Customers"
}
{
  "City": "México D.F.",
  "CompanyName": "Ana Trujillo Emparedados y helados",
  "ContactName": "Ana Trujillo",
  "Relationship": "Customers"
},
{
  "City": "México D.F.",
  "CompanyName": "Antonio Moreno Taquería",
  "ContactName": "Antonio Moreno",
  "Relationship": "Customers"
}
```

What's happening here is that the iterator causes `jq` to emit a JSON value for each item in the array. This is an important concept and also relates to the fact that `jq` can process -- as well as emit -- multiple JSON values. I discuss this in the post [Some thoughts on jq and statelessness](https://qmacro.org/blog/posts/2022/05/02/some-thoughts-on-jq-and-statelessness/) which you may be interested to read.

In other words, while the first invocation (`.value`) emitted a single JSON value (an array), the second (`.value[]`) caused three JSON values (three objects) to be emitted, effectively one at a time.

### Understanding the iterator a bit more

To understand what the iterator does, we can run a simple experiment. We'll revisit each of the two `jq` invocations we've done so far, adding a second filter into the mix via the [pipe][manual-pipe]. We'll use the simple `length` filter which, given an array will return the number of elements, and given an object will return the number of key-value pairs (and, for that matter, given a string, will return the length of that string).

Remember that the value of the `value` property is an array. So this:

```bash
jq '.value | length' entities.json
```

returns the following:

```text
3
```

Doing the same with the second invocation, in other words this:

```bash
jq '.value[] | length' entities.json
```

has a slightly different output:

```text
4
4
4
```

In this case, what's happening is that the array iterator is causing each element of the array to be passed, one at a time, through the filter(s) that follow (i.e. through `length` in this case). And when passed an object, `length` returns the number of key-value pairs. There are four key-value pairs in each of the objects, so we get 4, but we get that three times, one for each object (and remember, each of these instances of `4` are valid JSON values).

## Jumping ahead temporarily to CSV output

So that we better understand where we're heading, I want to introduce the `@csv` [format string][manual-format-string], which is described as follows:

> The input must be an array, and it is rendered as CSV with double quotes for strings, and quotes escaped by repetition.

So this:

```bash
echo '[1,2,"buckle my shoe"]' | jq --raw-output '@csv'
```

(note the use of the `--raw-output` (`-r`) option so that `jq` won't try to emit JSON values but instead output the values directly) results in CSV like this:

```text
1,2,"buckle my shoe"
```

So our aim is to produce a list of arrays, one for each JSON object in the input (one for each entity, effectively). Then each of these arrays can then be fed through the `@csv` format string, to produce CSV records.

## Producing the arrays with hardcoded key names

Each CSV record needs four values, the values for each key in the object(s):

```json
{
  "City": "México D.F.",
  "CompanyName": "Antonio Moreno Taquería",
  "ContactName": "Antonio Moreno",
  "Relationship": "Customers"
}
```

In other words, values for `City`, `CompanyName`, `ContactName` and `Relationship`.

The simplest way to do this would be to just use [object identifier-indices][manual-object-identifier-index] directly, something like this:

```bash
jq --raw-output '
  .value[]
  | [.City, .CompanyName, .ContactName, .Relationship]
  | @csv
' entities.json
```

This gives us what we want:

```text
"Berlin","Alfreds Futterkiste","Maria Anders","Customers"
"México D.F.","Ana Trujillo Emparedados y helados","Ana Trujillo","Customers"
"México D.F.","Antonio Moreno Taquería","Antonio Moreno","Customers"
```

But of course that's somewhat unsatisfactory. We'd have to examine the input data and then adjust the object identifier-indices each time we had different input data.

## Producing the arrays dynamically

According to the great [Larry Wall](https://en.wikipedia.org/wiki/Larry_Wall), the three great virtues of a programmer are [laziness, impatience and hubris](https://wiki.c2.com/?LazinessImpatienceHubris). And we can get a little nearer to laziness and also somewhat to impatience here by striving to make our solution determine the keys automatically.

There's a [keys][manual-keys] function in `jq` which will return the keys of an object. That might get us part of the way. Let's try it out:

```bash
jq '
  .value[]
  | keys
' entities.json
```

This produces what we expect, or at least hope for:

```json
[
  "City",
  "CompanyName",
  "ContactName",
  "Relationship"
]
[
  "City",
  "CompanyName",
  "ContactName",
  "Relationship"
]
[
  "City",
  "CompanyName",
  "ContactName",
  "Relationship"
]
```

In fact, we have the structure that we want and are now only really one "indirection" away from our goal. Let's put this into the CSV output context to see, by piping the result into `@csv`:

```bash
jq --raw-output '
  .value[]
  | keys
  | @csv
' entities.json
```

This gives us:

```text
"City","CompanyName","ContactName","Relationship"
"City","CompanyName","ContactName","Relationship"
"City","CompanyName","ContactName","Relationship"
```

We can make use of these key values like `City` with the [object identifier-index][manual-object-identifier-index] construct. Well, almost. We need the more [generic form][manual-generic-object-index] for which the [object identifier-index][manual-object-identifier-index] is just a shorthand version for when identifiers are simple and "string-like".

In other words, the [generic object index][manual-generic-object-index] can be used when the identifier is not "string-like" ... such as when it's a [variable][manual-variable].

Let's step back and focus for a moment on just one of the objects - the first (0th) one - using the [array index][manual-array-index] construction (`[n]`):

```bash
jq '
  .value[0]
  | keys
' entities.json
```

This gives us:

```bash
[
  "City",
  "CompanyName",
  "ContactName",
  "Relationship"
]
```

Let's assign the keys to a variable `$k`, and just emit the value of that variable:

```bash
jq '
  .value[0]
  | keys as $k | $k
' entities.json
```

Perhaps unsurprisingly, this gives us the same result:

```text
[
  "City",
  "CompanyName",
  "ContactName",
  "Relationship"
]
```

But now we have an array of key names to work with!

Note that `keys` produces an array, so we can use the [array value iterator][manual-array-value-iterator] (`[]`) to cause each of the keys to be emitted separately (looped through, effectively) and passed to subsequent filters.

Adding the iterator `[]` to the `keys` function like this:

```bash
jq '
  .value[0]
  | keys[] as $k | $k
' entities.json
```

produces this:

```text
"City"
"CompanyName"
"ContactName"
"Relationship"
```

This is a similar effect to what we've seen earlier; it causes `jq` to iterate over the output of `keys` one item at a time, so the `$k` after the pipe in this sample is called four times, one for each key, and each time producing a JSON value (the key name as a string) as output.

We may be focusing deeper and deeper on the keys here, but don't forget we always have the [identity][manual-identity] filter (`.`) to give us access to the input, to whatever came through the pipe to where we are now, as it were.

## Variable assignment with 'as' as a foreach loop

Let's understand this, by way of something perhaps unexpected. Replacing the `$k` at the end of the pipeline with simply `.`, like this:

```bash
jq '
  .value[0]
  | keys[] as $k | .
' entities.json
```

actually gives us this:

```json
{
  "City": "Berlin",
  "CompanyName": "Alfreds Futterkiste",
  "ContactName": "Maria Anders",
  "Relationship": "Customers"
}
{
  "City": "Berlin",
  "CompanyName": "Alfreds Futterkiste",
  "ContactName": "Maria Anders",
  "Relationship": "Customers"
}
{
  "City": "Berlin",
  "CompanyName": "Alfreds Futterkiste",
  "ContactName": "Maria Anders",
  "Relationship": "Customers"
}
{
  "City": "Berlin",
  "CompanyName": "Alfreds Futterkiste",
  "ContactName": "Maria Anders",
  "Relationship": "Customers"
}
```

Odd, the same object, four times. But when we stare at that for a second, we realise that it's exactly what we asked for. With `keys[]` we're iterating through the keys of the object (`City`, `CompanyName`, `ContactName` and `Relationship`). Four of them. So whatever is beyond the pipe after that, which is simply the identity filter (`.`), is being called four times. And the identity filter (which simply outputs whatever it receives as input) receives as input the original object.

What we might expect `.` to output is one key, each time. That would be the case if we didn't assign `keys[]` to the variable `$k` with `keys[] as $k`. Let's remove the `as $k` bit to see:

```bash
jq '
  .value[0]
  | keys[] | .
' entities.json
```

This produces:

```text
"City"
"CompanyName"
"ContactName"
"Relationship"
```

So in this case, `.`'s input are (each time) the keys of the object. The important thing to realise here is that the variable assignment `as $k` means that the input that came into that expression (the object) passes straight through unconsumed to the next filter. This part of the manual for the section on [variables][manual-variable] helps to explain:

> The expression `exp as $x | ...` means: for each value of expression `exp`, run the rest of the pipeline with the entire original input, and with `$x` set to that value. Thus `as` functions as something of a foreach loop.

With this in mind, we should now be able to understand why this:

```bash
jq '
  .value[0]
  | keys[] as $k | .
' entities.json
```

produced four identical copies of the object.

While that's an odd thing to produce, it helps a lot here. Having the input at this stage in the pipeline (`.`) set to the object, combined with the "foreach loop" (as the manual described it) iterating over the values in `$k`, is very useful!

Let's look at that in a basic form; how about emitting an array with two elements, the first being the value of `$k` and the second being the input, each time:

```bash
jq '
  .value[0]
  | keys[] as $k | [$k, .]
' entities.json
```

This gives us a combination of values like this:

```json
[
  "City",
  {
    "City": "Berlin",
    "CompanyName": "Alfreds Futterkiste",
    "ContactName": "Maria Anders",
    "Relationship": "Customers"
  }
]
[
  "CompanyName",
  {
    "City": "Berlin",
    "CompanyName": "Alfreds Futterkiste",
    "ContactName": "Maria Anders",
    "Relationship": "Customers"
  }
]
[
  "ContactName",
  {
    "City": "Berlin",
    "CompanyName": "Alfreds Futterkiste",
    "ContactName": "Maria Anders",
    "Relationship": "Customers"
  }
]
[
  "Relationship",
  {
    "City": "Berlin",
    "CompanyName": "Alfreds Futterkiste",
    "ContactName": "Maria Anders",
    "Relationship": "Customers"
  }
]
```

And of course, look what we can do with that combination of data in `.` and `$k`, using the [generic object index][manual-generic-object-index] like this `.[$k]` to look up the value of each of the keys:

```bash
jq '
  .value[0]
  | keys[] as $k | .[$k]
' entities.json
```

This results in:

```text
"Berlin"
"Alfreds Futterkiste"
"Maria Anders"
"Customers"
```

Great! And if we wrap this entire expression in an [array construction][manual-array-construction] (`[...]`), we then have the right shape (an array) to give to the `@csv` format string (and as we're emitting CSV again we'll use the `--raw-output` option again here):

```bash
jq --raw-output '
  .value[0]
  | [ keys[] as $k | .[$k] ]
  | @csv
' entities.json
```

This produces a perfect single CSV record:

```text
"Berlin","Alfreds Futterkiste","Maria Anders","Customers"
```

Now all we need to do is remove the array index (the `0` from `.value[0]`) to go back to an iteration over all the items in the array:

```bash
jq --raw-output '
  .value[]
  | [ keys[] as $k | .[$k] ]
  | @csv
' entities.json
```

and we get exactly what we're looking for:

```text
"Berlin","Alfreds Futterkiste","Maria Anders","Customers"
"México D.F.","Ana Trujillo Emparedados y helados","Ana Trujillo","Customers"
"México D.F.","Antonio Moreno Taquería","Antonio Moreno","Customers"
```

## Storing as a function

I'm likely to want to use this approach again some time, so I'll store the core construct here as a function in my local `~/.jq` file (see the [modules][manual-modules] section of the manual for more detail):

```jq
def onlyvalues: [ keys[] as $k | .[$k] ];
```

Now I can use that function wherever I want; here's a great place, because it also simplifies the entire invocation:

```bash
jq --raw-output '
  .value[]
  | onlyvalues
  | @csv
' entities.json
```

And yes, this produces the same output:

```text
"Berlin","Alfreds Futterkiste","Maria Anders","Customers"
"México D.F.","Ana Trujillo Emparedados y helados","Ana Trujillo","Customers"
"México D.F.","Antonio Moreno Taquería","Antonio Moreno","Customers"
```

## Wrapping up

This turned out to be a longer post than I'd intended to write. I found that I wanted to make sure I explained each part of the solution, and why it was how it was. Of course, this has the benefit of causing me to think a little harder about what `jq` is doing, which in turn helps me learn a little bit more about it.

[manual-object-identifier-index]: https://stedolan.github.io/jq/manual/#ObjectIdentifier-Index:.foo,.foo.bar
[manual-array-value-iterator]: https://stedolan.github.io/jq/manual/#Array/ObjectValueIterator:.[]
[manual-pipe]: https://stedolan.github.io/jq/manual/#Pipe:|
[manual-format-string]: https://stedolan.github.io/jq/manual/#Formatstringsandescaping
[manual-keys]: https://stedolan.github.io/jq/manual/#keys,keys_unsorted
[manual-generic-object-index]: https://stedolan.github.io/jq/manual/#GenericObjectIndex:.[%3Cstring%3E]
[manual-variable]: https://stedolan.github.io/jq/manual/#Variable/SymbolicBindingOperator:...as$identifier|...
[manual-identity]: https://stedolan.github.io/jq/manual/#Identity:.
[manual-array-construction]: https://stedolan.github.io/jq/manual/#Arrayconstruction:[]
[manual-array-index]: https://stedolan.github.io/jq/manual/#ArrayIndex:.[2]
[manual-modules]: https://stedolan.github.io/jq/manual/#Modules
