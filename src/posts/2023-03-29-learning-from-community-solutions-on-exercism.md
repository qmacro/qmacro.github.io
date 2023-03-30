---
layout: post
title: Learning from community solutions on Exercism
date: 2023-03-29
tags:
  - jq
  - exercism
---
There's a relatively new [jq track on Exercism](https://exercism.org/tracks/jq), and I've been working through some of the exercises. There are at least a couple of features that appeal to me; one is the ability to easily write and submit solutions from the command line (see [Working Locally](https://exercism.org/docs/using/solving-exercises/working-locally)) and the other is the [community](https://exercism.org/community) solutions that are available to you after you submit your own first solution.

As well as the direct benefit of practice, I've learned and been reminded of aspects of jq while looking through the community solutions. So I thought I'd write some of them up here, because writing will also help me remember.

I'll start with some simple observations.

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

[TO BE CONTINUED]

