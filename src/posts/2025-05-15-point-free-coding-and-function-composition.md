---
layout: post
title: Point free coding and function composition
date: 2025-05-15
tags:
  - fp
  - jq
  - cap
  - odata
  - shell
  - javascript
  - handsonsapdev
---
*In this post I explore and show examples of the concepts of point free coding, of chains of functions through which data flows, and of function composition.*

While preparing for tomorrow's [fifth and final episode](https://www.youtube.com/watch?v=8eKWxP3F6xc&list=PL6RpkC85SLQB-0sK7KSRwCc2gdtlZDIkL&index=5) in our current Hands-on SAP Dev series [Let's explore functional programming](https://www.youtube.com/playlist?list=PL6RpkC85SLQB-0sK7KSRwCc2gdtlZDIkL) I was thinking about how point free coding and composition can be found in many places, not just in functional libraries and languages.

We've been learning about functional programming concepts mainly with JavaScript, sometimes making use of features from the excellent [Ramda](https://ramdajs.com) library. For data, we've mostly used [Northbreeze](https://github.com/qmacro/northbreeze), a sort of "reduced" [Northwind](https://services.odata.org/V4/Northwind/Northwind.svc/). There's an instance of the OData V4 service [available](https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze) for the time being, and I'll use that to explore in this post too, in particular the [Products](https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze/Products) entityset.

## The basic concepts

With point free coding, also known as [tacit programming](https://en.wikipedia.org/wiki/Tacit_programming), data and behaviour are separate, a fundamental philosophy of the functional programming style. Behaviour is defined in the form of functions, building blocks that are used on their own or composed together.

In writing those function declarations, the data that they will operate on is not specified. Instead, when the time is right, data is passed through to the function(s), often in a flowing approach through a series of them which are chained together.

> There are more formal definitions and interpretations of point free coding, but at this level of exploration we can be comfortable thinking of the concepts as described here.

## Exploring in jq

It's no secret that I'm a [fan](/tags/jq/) of [jq](https://jqlang.org), a fully formed programming language that exhibits a predominantly functional paradigm, as well as being a powerful way to manipulate JSON with ad hoc expressions.

There are [77](https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze/Products/$count) products in Northbreeze. Let's have a look at the first one with:

```shell
jq '.value|first' products.json
```
<a name="chai"></a>
which emits:

```json
{
  "ProductID": 1,
  "ProductName": "Chai",
  "QuantityPerUnit": "10 boxes x 20 bags",
  "UnitPrice": 18,
  "Category_CategoryID": 1,
  "Supplier_SupplierID": 1,
  "UnitsInStock": 39,
  "UnitsOnOrder": 0,
  "ReorderLevel": 10,
  "Discontinued": false
}
```

> In the `jq` filter here (and elsewhere in this post) `.value` is an artifact of the OData V4 JSON representation of the data, not anything inherently required by `jq`.

### Discontinued products

Defining a function that discards anything that's not discontinued, and using that to map over the products, like this:

```jq
def justDiscontinued: select(.Discontinued);
.value
| map(justDiscontinued)
| .[].ProductName
```

gives us:

```text
"Chef Anton's Gumbo Mix"
"Mishi Kobe Niku"
"Alice Mutton"
"Guaraná Fantástica"
"Rössle Sauerkraut"
"Thüringer Rostbratwurst"
"Singaporean Hokkien Fried Mee"
"Perth Pasties"
```

Already we can start to see how the product data is nowhere to be seen in this `jq` filter. It's implicit, and sent through the chain (by means of the [pipe operator](https://jqlang.org/manual/#pipe)) when the expression is evaluated.

Even the definition of `justDiscontinued` exhibits the idea of tacitness, in that there's no indication of what this function, or its body, is to work on.

### Stock information

Rather than that deliberately simple iterator and property expression at the end (`.[].ProductName`), let's add a further filter to the chain:

```jq
def justDiscontinued: select(.Discontinued);
def stockInfo: {(.ProductName): .UnitsInStock};
.value
| map(justDiscontinued)
| map(stockInfo)
```

This produces:

```json
[
  {
    "Chef Anton's Gumbo Mix": 0
  },
  {
    "Mishi Kobe Niku": 29
  },
  {
    "Alice Mutton": 0
  },
  {
    "Guaraná Fantástica": 20
  },
  {
    "Rössle Sauerkraut": 26
  },
  {
    "Thüringer Rostbratwurst": 0
  },
  {
    "Singaporean Hokkien Fried Mee": 26
  },
  {
    "Perth Pasties": 0
  }
]
```

There are a couple of improvements we can make here. The first is to [add](https://jqlang.org/manual/#add) the elements of the array together:

```jq
def justDiscontinued: select(.Discontinued);
def stockInfo: {(.ProductName): .UnitsInStock};
.value
| map(justDiscontinued)
| map(stockInfo)
| add
```

which reshapes the output to look like this:

```json
{
  "Chef Anton's Gumbo Mix": 0,
  "Mishi Kobe Niku": 29,
  "Alice Mutton": 0,
  "Guaraná Fantástica": 20,
  "Rössle Sauerkraut": 26,
  "Thüringer Rostbratwurst": 0,
  "Singaporean Hokkien Fried Mee": 26,
  "Perth Pasties": 0
}
```

### An alternative way to chain mappings

The second improvement is to think about how we have two chained `map` expressions; this is neat and pleasing on the eye, and helps us understand how data flows through, especially when it forces us to think about what *shape* that data is (an array of objects).

But we can just as easily (and more efficiently) write the chain like this:

```jq
def justDiscontinued: select(.Discontinued);
def stockInfo: {(.ProductName): .UnitsInStock};
.value
| map(justDiscontinued|stockInfo)
| add
```

which produces exactly the same result, and is possibly an even better visualisation of what tacit expressions look like.

### Average calculation

In fact, talking of `add`, how about this succinct way of emitting the average unit price of all products:

```jq
.value
| map(.UnitPrice)
| add / length
```

This produces the value `28.866363636363637`.

> Incidentally we can check and compare that to what Northbreeze tells us, using an OData V4 [data aggregation](https://github.com/qmacro/odata-v4-and-cap/blob/main/slides.md#data-aggregation) feature that is supported out of the box with CAP (see the [Aggregation Methods](https://cap.cloud.sap/docs/advanced/odata#aggregation-methods) section of the OData APIs topic in Capire); the resource at [this URL](https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze/Products?$apply=aggregate(UnitPrice%20with%20average%20as%20AvgPrice)):
> 
>```url
>https://developer-challenge.cfapps.eu10.hana.ondemand.com
>  /odata/v4/northbreeze/Products
>  ?
>  $apply=aggregate(UnitPrice with average as AvgPrice)
>```
>
> is returned in a JSON representation, like this:
>
>```json
>{
>  "@odata.context": "$metadata#Products(AvgPrice)",
>  "value": [
>    {
>      "AvgPrice@odata.type": "#Decimal",
>      "AvgPrice": 28.8663636363636,
>      "@odata.id": null
>    }
>  ]
>}
>```

### Examining the data flow

What's even more wonderful about this is how `jq` flows the data through the final pipe ... both into `add` _and also into `length`_.

This is not just a thing of beauty, but also a great reason for us to stop and think for a moment what's happening here. I'll use just the first three products to visualise here, and temporarily remove the last part of the chain:

```jq
.value[0:3]
| map(.UnitPrice)
```


So `.value[0:3]` emits an array of the [first three products](https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze/Products?$top=3) with all their properties, which in turn is piped into `map(.UnitPrice)` which produces:

```json
[
  18,
  19,
  10
]
```

Then with `| add / length` this array is then sent to both `add` and `length`, in parallel, and then the output of each is combined with the `/` divide operator:

```text

                 +-->  add   --> 47 --+
                 |                    |
[ 18, 19, 10 ] --+                    +--> / --> 15.6666666
                 |                    |
                 +--> length --> 3  --+
```

## The shell

Unix shells in general, and in particular [my favourite flavour](https://en.wikipedia.org/wiki/Bash_(Unix_shell)), exhibit similar point free and functional chain features.

Using the same data set, we can produce Unix shell friendly[<sup>1</sup>](#footnote-1) output like this:

```shell
jq -r '.value[] | [.UnitPrice, .ProductName] | @tsv' products.json
```

This produces:

```text
18     Chai
19     Chang
10     Aniseed Syrup
22     Chef Anton's Cajun Seasoning
21.35  Chef Anton's Gumbo Mix
25     Grandma's Boysenberry Spread
6      Konbu
23.25  Tofu
15.5   Genen Shouyu
...
```

The shell's [standard streams](https://en.wikipedia.org/wiki/Standard_streams) concept (STDIN / STDOUT etc), make it easy for us to use regular utilities in their natural environment, i.e. in a point free style, where no data is specified, but is implicit and supplied via STDIN.

How about working out the top three most expensive products?

```shell
jq -r '.value[] | [.UnitPrice, .ProductName] | @tsv' products.json \
| sort -nr \
| head -3
```

Here we are:

```text
263.5   Côte de Blaye
123.79  Thüringer Rostbratwurst
97      Mishi Kobe Niku
```

Yup, [that computes](https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze/Products?$select=ProductName,UnitPrice&$orderby=UnitPrice%20desc&$top=3).

We can even 'compose' these two 'functions' (`sort` and `head`) like this, again, with no data in sight:

```shell
topthree() { sort -nr | head -3 ; }
```

and then use that higher level building block:

```shell
jq -r '.value[] | [.UnitPrice, .ProductName] | @tsv' products.json \
| topthree
```

## To JavaScript and beyond

Well, we've already started from "beyond" JavaScript, but I guess what I was trying to say with this section heading is that these concepts are to be found in many places. Not least JavaScript, as well as of course in languages more strongly focused on the functional programming paradigm.

Hopefully I've illustrated some general features of these two concepts to show how they allow, even encourage programming that favours:

- thinking about behaviours separately from data
- building new functions from other functions
- constructing generic blocks of code
- coding at a high level

> This last point has got me thinking that the combination of these concepts lends itself well to being an alternative to the current "low code" approaches. But that's perhaps a digression for another time.

This type of approach to programming is facilitated by many of the features we've seen in the [Let's explore functional programming](https://www.youtube.com/playlist?list=PL6RpkC85SLQB-0sK7KSRwCc2gdtlZDIkL) series, such as currying, partial application and higher order functions, key items in a programming toolset for using, combining and building new discrete and data-free functions.

Turning to a more mainstream programming language like JavaScript allows me to talk about an important aspect of functions in this context.

### Data last

That important aspect is the order of arguments in function definitions. If we are to embrace all the features that we've seen in this series and expand our collection of building blocks even further, we need to be aware of where the data comes in the list of arguments (or "points").

It comes *last*.

Take a look at any of the functions in Ramda that process data, specifically lists, for example. Take [filter](https://ramdajs.com/docs/#filter), [head](https://ramdajs.com/docs/#head) or [reduce](https://ramdajs.com/docs/#reduce). Heck, take [take](https://ramdajs.com/docs/#take) (sorry, couldn't resist).

Each one of them expects the data to be supplied via the last argument. Let's examine [reduce](https://ramdajs.com/docs/#reduce) as representative of how this looks. First, the signature is:

```text
((a, b) → a) → a → [b] → a
```

So `reduce` expects, in this order:

- `((a, b) → a` the reducer function
- `a` the starting value for the accumulator
- `[b]` the data (a list of values)

and produces:

- `a` some value

> This is, by the way, brilliantly explained by Brian Lonsdorf in a now-classic talk - see the [Further material](#further-material) section for a link.

### A contrived example

This "data last" approach, combined with [closures](https://en.wikipedia.org/wiki/Closure_(computer_programming)), makes currying and partial application not only possible, but powerful.

Let's examine what this means with another slightly contrived example, focusing on the [products in the Produce (dried fruit and bean curd) category](https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze/Categories/7?$expand=Products), this time in JavaScript. I'll use some functions from [Ramda](https://ramdajs.com), mostly to illustrate the mechanisms in a "purer" form than the equivalents in standard JavaScript where the equivalent functions are "attached" to the `Array` prototype.

Assuming the entire JSON representation of the [Products entityset](https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze/Products) is available in a file called `products.json`, let's start like this:

```javascript
const { prop } = require('ramda')
const products = require('./products.json').value
```

Ramda's [prop](https://ramdajs.com/docs/#prop) is a convenient function for getting the value of a property.

> It's worth pausing here to think about how this `prop` function might look in its basic form, as it could help to further cement the concepts of currying and partial application (and closures, by the by). Given an object such as [the Chai product](https://developer-challenge.cfapps.eu10.hana.ondemand.com/odata/v4/northbreeze/Products/1) (see [earlier](#chai)), if we want a function with which to retrieve the value of a property, we need both the object and the property name, which we can express with a definition such as `myprop = p => o => o[p]`. One difference between `myprop` here and `prop` is that the latter, being a Ramda function, is curried by default.

OK. Suppose we wanted to determine the products in the Produce category (the category ID is 7) and emit a list of their names.

The "imperative", or at least direct way of approaching this might look like this:

```javascript
console.log(
  products
    .filter(x => x.Category_CategoryID == 7)
    .map(prop('ProductName'))
)
```

This produces what we want:

```json
[
  "Uncle Bob's Organic Dried Pears",
  "Tofu",
  "Rössle Sauerkraut",
  "Manjimup Dried Apples",
  "Longlife Tofu"
]
```

but is a little rigid. It's not *bad*, and JavaScript's native `filter` and `map` functions work well. But we'll switch to the Ramda equivalents to experiment a little bit more, and to explore the point free and partial application concepts further, as well as working our way towards a nice (if not a little simple) composition.

### Building blocks

Let's feel our way through constructing some high level building blocks (in the form of functions, of course).

First, how about this. I'll add [curry](https://ramdajs.com/docs/#curry) and [filter](https://ramdajs.com/docs/#filter) to the list of explicitly imported functions (`const { prop, curry, filter } = require('ramda')`), and use it when defining a function thus:

```javascript
const justCategory = curry((n, x) => prop('Category_CategoryID', x) == n)
```

Because the function is curried, we can now comfortably partially apply it and build other functions with it:

```javascript
const onlyProduce = justCategory(7)
```

Now we can use this as follows:

```javascript
console.log(
    filter(onlyProduce, products)
    .map(prop('ProductName'))
)
```

Not a huge change, but right now it feels weird because we're sort of in a hybrid state - a "pure" `filter` function from Ramda but then the `Array.prototype.map` function tacked on at the end. Moreover, consider where that `products` data reference is currently: it's sort of stuck, embedded within the entire expression.

If we add `map` to the list of imported functions, we can modify things to use Ramda's `map` so that we have a literal composition:

```javascript
console.log(
    map(prop('ProductName'), filter(onlyProduce, products))
)
```

This is also a sort of intermediate state but one that conveniently illustrates the mathematical basis of composition, i.e. `f(g(x))`, where `g` is applied to `x` and then `f` is applied to what that produces. You might have seen this [composition of functions](https://en.wikipedia.org/wiki/Function_composition_(computer_science)) `f` and `g` expressed as `f ∘ g`, i.e. "g composed with f"[<sup>2</sup>](#footnote-2).

### Compose

So let's use Ramda's [compose](https://ramdajs.com/docs/#compose) to cement this, noting that we can "unnest" the relationship, and more importantly "lose" the reference to the data:

```javascript
const produceList = compose(
  map(prop('ProductName')),
  filter(onlyProduce)
)
```

While we're at it, let's construct another small building block:

```javascript
const name = prop('ProductName')
```

and use that to move our composition to something that is arguably even more declarative:

```javascript
const produceList = compose(
  map(name),
  filter(onlyProduce)
)
```

Be aware that at this point, emitting `produceList` to the log will show this:

```text
[Function (anonymous)]
```

That's because `compose` has also only been partially applied, and is *waiting for data*. Let's give it some now:

```javascript
console.log(
  produceList(products)
)
```

Guess what - this produces the same output too:

```json
[
  "Uncle Bob's Organic Dried Pears",
  "Tofu",
  "Rössle Sauerkraut",
  "Manjimup Dried Apples",
  "Longlife Tofu"
]
```

Here's the script now in its entirety:

```javascript
const { prop, curry, filter, compose, map } = require('ramda')
const products = require('./products.json').value

const justCategory = curry((n, x) => prop('Category_CategoryID', x) == n)

const onlyProduce = justCategory(7)
const name = prop('ProductName')

const produceList = compose(
  map(name),
  filter(onlyProduce)
)

console.log(produceList(products))
```

### One extra level of abstraction

Depending on how we prefer to think about the abstractions, we might wish to go one level further up towards even higher level coding abstractions by pushing the `map` and `filter` up into the pre-`compose` definitions:

```javascript
const onlyProduce = filter(justCategory(7))
const names = map(prop('ProductName'))

const produceList = compose(
  names,
  onlyProduce
)

console.log(produceList(products))
```

### Pipe

In a way, we got here to this composition via a route that included function chains, which are most similar to the pipe based constructions in the `jq` and `bash` examples earlier. And in fact there's a sibling function to `compose` in the Ramda toolkit, which is [pipe](https://ramdajs.com/docs/#pipe).

With `compose`, we think about the `f(g(x))` pattern and express it naturally in that way, with the innermost function last in the list:

```javascript
compose(f, g)
```

Alternatively we can consider the data flowing through a series of functions, our building blocks, so it's easier to think about things the other way round, i.e. `-> | g | f`, and with `pipe` we can express it naturally in that way:

```javascript
pipe(g, f)
```

If you're coming from a more standard JavaScript background and have been used to using function chains with the `Array` prototypical functions such as `map`, `filter`, `some`, `reduce` and so on, then `pipe` might be a better mental fit.

By the way, based on the `pipe` equivalent of the even higher abstraction version, it would look like this (assuming we add `pipe` to the list of imported functions from Ramda of course):

```javascript
const produceList = pipe(
  onlyProduce,
  names
)
```

## Wrapping up

Anyway, I think it's time to bring this ramble to a close. Hopefully you can see that thinking about functional programming concepts such as partial application will naturally lead you to also think about other related concepts such as currying, closures and so on, all supported by the underpinnings that come in the form of functions as values and higher order functions. And while you can already start thinking functionally even in regular JavaScript, having a library like Ramda, or even building your own utility functions[<sup>3</sup>](#footnote-3), takes you a great deal further.

<a name="further-material"></a>
## Further material

* [FP, function chains and CAP model loading](/blog/posts/2025/05/01/fp-function-chains-and-cap-model-loading/)
* [More posts on jq](/tags/jq/)
* Brian Lonsdorf's classic talk [Hey Underscore, You're Doing It Wrong!](https://www.youtube.com/watch?v=m3svKOdZijA)

---

<a name="footnotes"></a>
## Footnotes

<a name="footnote-1"></a>
1 i.e. amenable to classic shell tools that process textual-based information.

<a name="footnote-2"></a>
2 In some languages, such as Haskell, this is expressed in pretty much the same way, i.e. `foo = f . g`

<a name="footnote-3"></a>
3 For example, a simple `compose` function [could look like](https://www.linkedin.com/posts/djadams_handsonsapdev-activity-7327252502918184961-LEo9) this: `const compose = (...fs) => (x) => fs.reverse().reduce((a, f) => f(a), x)` (yes I know there's a [reduceRight](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight) too :-))
