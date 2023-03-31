---
layout: post
title: Learning from community solutions on Exercism - part 1
date: 2023-03-29
tags:
  - jq
  - exercism
---
There's a relatively new [jq track on Exercism](https://exercism.org/tracks/jq), and I've been working through some of the exercises. There are at least a couple of features that appeal to me; one is the ability to easily write and submit solutions from the command line (see [Working Locally](https://exercism.org/docs/using/solving-exercises/working-locally)) and the other is the [community](https://exercism.org/community) solutions that are available to you after you submit your own first solution.

As well as the direct benefit of practice, I've learned and been reminded of aspects of jq while looking through the community solutions. So I thought I'd write some of them up here, because writing will also help me remember.

I'll start with some simple observations:

- in the [Shopping List exercise](#shopping-list-exercise) I contrast array and stream based thinking
- in the [Assembly Line exercise](#assembly-line-exercise) I remember how to avoid unnecessary symbolic bindings
- in the [High Score Board exercise](#high-score-board-exercise) I dwell on `map`, `map_values` and the array/object iterator
- in the [Vehicle Purchase exercise](#vehicle-purchase-exercise) I fall into a rabbit hole about array element containment checks

<a name="shopping-list-exercise"></a>
## Shopping List exercise

Even in the basic learning exercise [Shopping List](https://exercism.org/tracks/jq/exercises/shopping) there are subtle points worth talking about.

It's based on determining information from a shopping list, that looks like this (reduced for brevity):

```json
{
  "name": "Ingredients for pancakes",
  "ingredients": [
    {
      "item": "flour",
      "amount": {
        "quantity": 1,
        "unit": "cup"
      }
    },
    {
      "item": "sugar",
      "amount": {
        "quantity": 0.25,
        "unit": "cup"
      }
    },
    {
      "item": "baking powder",
      "amount": {
        "quantity": 1,
        "unit": "teaspoon"
      }
    }
  ],
  "optional ingredients": [
    {
      "item": "blueberries",
      "amount": {
        "quantity": 0.25,
        "unit": "cup"
      },
      "substitute": "chopped apple"
    }
  ]
}
```

The first observation is about the contrast between the concept of arrays, with corresponding array functions like `map`, and the concept of streaming in jq. 

The third task in this exercise was to identify the amount of sugar, which I determined like this:

```jq
(
  .ingredients 
  | map(select(.item == "sugar")) 
  | first.amount.quantity
)
```

The value of the `ingredients` property is an array, and using `map` like this produces another array, albeit with a single element (the object that represents the sugar ingredient). So I then used `first` to grab that element, and navigated to the `quantity` property). All fine. Having used `map` in various languages, and learned to think about arrays and how functions such as `map`, `filter` and `reduce` work (see [FOFP Fundamentals of functional programming](/blog/posts/2016/05/03/fofp-fundamentals-of-functional-programming/)) this felt natural to me.

That being said, jq is fundamentally stream oriented, which can be seen in [glennj's solution](https://exercism.org/tracks/jq/exercises/shopping/solutions/glennj):

```jq
(
  .ingredients[]
  | select(.item == "sugar")
  | .amount.quantity
)
```

Note the use of the [array / object value iterator](https://stedolan.github.io/jq/manual/#Array/ObjectValueIterator:.[]) on the `ingredients` property (`[]`), and the lack of `map` (and `first`). 

Expressing `.ingredients[]` (as opposed to `.ingredients`) explodes into a stream of values (one for every array element) which are each passed downstream (to `select` and beyond). The `select` then only allows the journey to continue for the element(s) that satisfy the condition, which means that the data coming through the last pipe is not an array but an object\*.

\*theoretically there could be more than one object coming through, but in this case there is just one.

Streaming in jq is an important aspect and can be a powerful mechanism to use.

<a name="assembly-line-exercise"></a>
## Assembly Line exercise

[Assembly Line](https://exercism.org/tracks/jq/exercises/assembly-line) is another learning exercise, where I decided to avoid an `if ... elif ... else ... end` structure and instead encode the computation for task 1 (calculation of the production rate per hour) using an array as a kind of lookup table:

```jq
def production_rate_per_hour:
  . as $speed
  | (221 * $speed)
    * 
    ([0, 100, 100, 100, 100, 90, 90, 90, 90, 80, 77][$speed] / 100)
;
```

I prefer the way this looks, over a multi-condition `if` structure, but there's a further improvement possible that I picked up, again from glennj [in his solution](https://exercism.org/tracks/jq/exercises/assembly-line/solutions/glennj), which was the avoidance of the [symbolic binding](https://stedolan.github.io/jq/manual/#Variable/SymbolicBindingOperator:...as$identifier|...) of the input to `$speed` (the `. as $speed` part).

I'd used a symbolic binding because I knew I would need to refer to it both in the basic speed calculation (multiplying it by 221) and using it to index into the lookup table (`[$speed]`). But glennj reminded me that I could just as easily have used `.` directly:

```jq
def production_rate_per_hour:
  . * 221 * [1,1,1,1,0.9,0.9,0.9,0.9,0.8,0.77][. - 1]
;
```

Note that tHE subtraction of 1 from `.` here is because this lookup table was constructed without a dummy value of 0 for the theoretical 0 speed.

A useful reminder which helps me strive for better avoidance of all that is unnecessary.

<a name="high-score-board-exercise"></a>
## High Score Board exercise

In reviewing my solutions for this post, I came upon what I'd written for the last task in the [High Score Board](https://exercism.org/tracks/jq/exercises/high-score-board) exercise, which was to find the total score, as illustrated thus:

```jq
{
  "Dave Thomas": 44,
  "Freyja Ćirić": 539,
  "José Valim": 265
}
| total_score
# => 848
```

I'd written the following:

```jq
def total_score:
  [.[]] | add + 0;
```

As I mentioned earlier in this post, `.[]` is the [array / object value iterator](https://stedolan.github.io/jq/manual/#Array/ObjectValueIterator:.[]). When I mentioned it back then, it was used to iterate over array values, i.e. the elements of the `ingredients` array. 

Now here it's being used to iterate over the values in an object. Not the keys, but the values, i.e. `44`, `539` and `265`. When I looked at it, I was reminded of the jq manual section on [map and map_values](https://stedolan.github.io/jq/manual/#map(x),map_values(x)) which says: 

> `map(x)` is equivalent to `[.[] | x]`. In fact, this is how it's defined. Similarly, `map_values(x)` is defined as `.[] |= x`.

Also as I mentioned earlier, this iterator will create a stream of values, rather than an array. In other words, this:

```jq
{
  "Dave Thomas": 44,
  "Freyja Ćirić": 539,
  "José Valim": 265
}
| .[]
```

produces:

```text
44
539
265
```

Note the lack of any semblance of an array - these are all single JSON values.

So in order to be able to use `add`, which takes an array as input, I therefore also had to wrap this in an [array constructor](https://stedolan.github.io/jq/manual/#Arrayconstruction:[]) i.e. inside square brackets `[ ]`:

```jq
{
  "Dave Thomas": 44,
  "Freyja Ćirić": 539,
  "José Valim": 265
}
| [.[]]
```

which gave me:

```json
[
  44,
  539,
  265
]
```

Anyway, forgetting this `.[]` was acting as an object value iterator, I then thought "hmm, this is more or less the equivalent of `map`", given what the manual stated ... so I replaced `[.[]]` with `map(.)`, like this:

```jq
{
  "Dave Thomas": 44,
  "Freyja Ćirić": 539,
  "José Valim": 265
}
| map(.)
```

This also gave me an array:

```json
[
  44,
  539,
  265
]
```

But the interesting thing was that this is `map` being applied to an object, not an array, and I'm guessing it does the right thing in a sort of [DWIM](https://en.wikipedia.org/wiki/DWIM) way (which I first came across in Perl). Even more interestingly, this use of `map` on an object, which produces an array of the values in that object, contrasts nicely with `map`'s sibling `map_values`, which, perhaps confusingly, doesn't do that.

In fact, I used `map_values` in addressing the previous task in this exercise, to apply Monday bonus points, which I did like this:

```jq
def apply_monday_bonus:
  map_values(. + 100);
```

What `map_values` does is return the object but offer you the values to manipulate as each property is iterated over. So this:

```jq
{
  "Dave Thomas": 44,
  "Freyja Ćirić": 539,
  "José Valim": 265
}
| map_values(. + 100)
```

produces this:

```json
{
  "Dave Thomas": 144,
  "Freyja Ćirić": 639,
  "José Valim": 365
}
```

and not this:

```json
[
  144,
  639,
  365
]
```

To complete the picture on this observation, I thought I'd mention the `+ 0` part in the solution:

```jq
def total_score:
  [.[]] | add + 0;
```

If you supply an empty array to `add`, it will produce `null`:

```jq
[] | add
# => null
```

According to the [addition](https://stedolan.github.io/jq/manual/#Addition:+) section of the jq manual:

> null can be added to any value, and returns the other value unchanged.

<a name="vehicle-purchase-exercise"></a>
## Vehicle Purchase exercise

The [Vehicle Purchase](https://exercism.org/tracks/jq/exercises/vehicle-purchase) exercise is another learning one and was quite straightforward. My solution for the first task ("Determine if you will need a drivers licence") looked like this:

```jq
def needs_license:
  . == "car" or . == "truck";
```

While this is fine because there are only two possible values for which we want to return true, the way I expressed this bothered me slightly. 

In JavaScript, for example, I would have used an array to contain the values, and then used [includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) like this:

```javascript
needs_license = x => ["car", "truck"].includes(x)
// needs_license("car") => true
// needs_license("train") => false
```

So after submitting my solution, I looked at what others had done. Quite a few used the same approach, as me, but there was [a solution from IsaacG](https://exercism.org/tracks/jq/exercises/vehicle-purchase/solutions/IsaacG) that looked more appealing.

### Considering the inside filter

```jq
def needs_license:
  [.] | inside(["car", "truck"]);
```

This `inside` filter looked to me like the JavaScript approach above. But my goodness, did it open up a rabbit hole of investigations!

Looking at it, one would think that this would do the job. I started looking at the definition of [inside](https://stedolan.github.io/jq/manual/#inside) in the jq manual, and found that it was "essentially an inversed version of `contains`". Before looking at the definition of `contains`, I took a quick look at some of the examples, and saw this one, which made me scratch my head:

```text
jq 'inside(["foobar", "foobaz", "blarp"])'
Input:	["baz", "bar"]
Output:	true
```

This is not an element-wise check, it's a (sub)string based comparison, even when working with arrays.

I looked at [contains](https://stedolan.github.io/jq/manual/#contains(element)) and the examples and description had me more convinced that actually the use of `inside` in the solution to this sort of task may not be ideal. 

There's a sentence in the description of `contains` which looks fairly innocuous, but in fact masks a major gotcha (emphasis mine):

> [With `A | contains(B)` ...] an array B is contained in an array A if all elements in B **are contained in** any element in A. 

### Digression: inside as inverse of contains

Before continuing, let's just understand what does "inside is an inversed version of contains" mean? Well, we can look at the [source for `inside` in `builtin.jq`](https://github.com/stedolan/jq/blob/a9f97e9e61a910a374a5d768244e8ad63f407d3e/src/builtin.jq#L211):

```jq
def inside(xs): . as $x | xs | contains($x);
```

We can see that this is effectively just switching around the two arguments - here, `xs` is the absolute list of elements, and `.` (which is bound to `$x`) is what we want to look for.

### What's the issue?

OK, digression over. Clearly, given the relationship between `inside` and `contains`, the gotcha also applies to `inside`.

To help me focus in on the significance of "if [...] elements [...] are contained in any element [...]" in the above description, I defined the two licensable vehicles as being "cart" (with a "t") and "truck" instead of "car" and "truck":

```jq
def licensable_vehicles: ["cart", "truck"];
```

I then recreated the function above to look like this\*:

```jq
def needs_license_inside: [.] | inside(licensable_vehicles);
```

I then tested it with three vehicles, which gave me an unexpected result:

```jq
["bus", "cart", "car"] | map(needs_license_inside)
# => [false, true, true]
```

The `inside` function returns `true` for "car" ... because the string **is contained in** one of the elements ("cart"). We can even unpick the inverse, to get closer to the source of the problem:

```jq
licensable_vehicles | contains(["car"])
# => true
```

Yikes! 

### Some alternatives

Rather than bemoan the slightly vague documentation combined with my misaligned expectations, I thought I'd look into how one might go about testing membership, if `inside` (or `contains`) is not the way.

#### Using any(condition)

The [any](https://stedolan.github.io/jq/manual/#any,any(condition),any(generator;condition)) filter has different forms (I guess known as `any/0`, `any/1` and `any/2`). 
We can use the `any/1` form with a condition, like this:

```jq
def needs_license_any: . as $v | licensable_vehicles | any(.==$v);
```

This will give us what we're looking for:

```jq
["bus", "cart", "car"] | map(needs_license_any)
# => [false, true, false]
```

By the way, I had first created this version of the function as follows, and passed the vehicles under tests via a parameter:

```jq
def needs_license_any($v): licensable_vehicles | any(.==$v);
["bus", "cart", "car"] | map(needs_license_any(.))
# => [false, true, false]
```

But inspired by the [builtin definition of inside](https://github.com/stedolan/jq/blob/a9f97e9e61a910a374a5d768244e8ad63f407d3e/src/builtin.jq#L211) I felt OK in using a symbolic binding (`. as $v`) after all, despite what I mentioned earlier in the section on the [Assembly Line exercise](#assembly-line-exercise).

#### Using index

In the jq manual, [index](https://stedolan.github.io/jq/manual/#index(s),rindex(s)) is described in a vague way, and the examples are quite minimal, which might give the impression it relates to strings and substrings. But I'm learning that the limited examples can be deceiving, and the functions and filters have subtle depths and for the most part just work the way you might assume they might, in different circumstances. 

Here, `index` will work for us in that it can return either an array index (for a given element, if it exists) or null (if it doesn't). A simple start with `index` might look like this:

```jq
def needs_license_index: . as $v | licensable_vehicles | index($v);
```

However, this doesn't quite give us what we want:

```jq
["bus", "cart", "car"] | map(needs_license_index)
# => [null, 0, null]
```

But [and](https://stedolan.github.io/jq/manual/#and/or/not)ing values such as these with `true` does the trick, of course:


```jq
def needs_license_index: 
  . as $v | licensable_vehicles | index($v) and true;
["bus", "cart", "car"] | map(needs_license_index)
# => [false, true, false]
```

Note that in jq:

> false and null are considered "false values", and anything else is a "true value"

which is why `0 and true` evaluates to `true`. 

I'm sure there are more options, but I'll leave it there for now. What is your goto approach for checking for elements in arrays? Let me know in the comments.
