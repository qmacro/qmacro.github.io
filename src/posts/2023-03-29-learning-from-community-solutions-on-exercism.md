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

## Shopping list exercise

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

The value of the `ingredients` property is an array, and using `map` like this produces another array, albeit with a single element (the object that represents the sugar ingredient). So I then used `first` to grab that element and navigated to the `quantity` property). All fine. Having used `map` in various languages, and learned to think about arrays and how functions such as `map`, `filter` and `reduce` (see [FOFP Fundamentals of functional programming](/blog/posts/2016/05/03/fofp-fundamentals-of-functional-programming/)) this felt natural to me.

That being said, jq is fundamentally stream oriented, which can be seen in [glennj's solution](https://exercism.org/tracks/jq/exercises/shopping/solutions/glennj):

```jq
(
  .ingredients[]
  | select(.item == "sugar")
  | .amount.quantity
)
```

Note the use of the [array value iterator](https://stedolan.github.io/jq/manual/#Array/ObjectValueIterator:.[]) on the `ingredients` property, and the lack of `map` (and `first`). 

Expressing `.ingredients[]` explodes into a stream of values (one for each of the array elements) which are each passed downstream (to `select` and beyond). The `select` then only allows the journey to continue for the element(s) that satisfy the condition, which means that the data coming through the last pipe is not an array but an object\*.

\*theoretically there could be more than one object, but in this case there is just one.

## Assembly line exercise

[Assembly line](https://exercism.org/tracks/jq/exercises/assembly-line) is another learning exercise, where I decided to eschew an `if ... elif ... else ... end` structure and instead encode the computation for task 1 (production rate per hour) using an array as a sort of lookup table:

```jq
def production_rate_per_hour:
  . as $speed
  | (221 * $speed)
    * 
    ([0, 100, 100, 100, 100, 90, 90, 90, 90, 80, 77][$speed] / 100)
;
```

I prefer the way this looks, over a multi-condition `if` structure, but there's a further improvement possible that I picked up, again from [glennj's solution](https://exercism.org/tracks/jq/exercises/assembly-line/solutions/glennj), which was the avoidance of the [symbolic binding](https://stedolan.github.io/jq/manual/#Variable/SymbolicBindingOperator:...as$identifier|...) of the input to `$speed` (the `. as $speed` part).

I'd done this because I knew I would need to refer to it both in the basic speed calculation (multiplying it by 221) and using it to index into the lookup table (`[$speed]`). But glennj reminded me that I could just as easily have used `.` directly:

```jq
def production_rate_per_hour:
  . * 221 * [1,1,1,1,0.9,0.9,0.9,0.9,0.8,0.77][. - 1]
;
```

(The subtraction of 1 from `.` is because this lookup table was constructed without a dummy value of 0 for the theoretical 0 speed, as I did in my version.)

A useful reminder which helps me strive for better avoidance of all that is unnecessary.

[TO BE CONTINUED]
