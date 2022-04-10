---
layout: post
title: The beauty of recursion and list machinery
tags:
  - language-ramblings
---
There are beautiful patterns inherent in the use of recursion that I've seen in my attempts to reboot my brain with a new, more functionally focused way of thinking about programming.

This post explores one particular pattern that is inherent in how recursion is often expressed in some functional languages, and finishes with the alternative based on what I'm going to call "list machinery" - mechanisms within a language that provide powerful processing abstractions over structures such as lists.

# <a name="initialrecognition"></a>Initial recognition

Erik Meijer, whom I'll mention properly in a moment, uses a phrase "if you stare long enough at it ...". This really appeals to me, because it expresses the act of focus and concentration in a wonderfully casual way. I've stared at this stuff long enough for it to become something tangible, something recognisable, and hopefully there's useful content here for you to stare at too.

## Introduction via Haskell

It was my son [Joseph](http://jcla1.com) that introduced me to the concept that has intrigued me since the first day I saw it. Proficient in many different languages, he was showing me some solutions to [Project Euler]((https://www.youtube.com/watch?v=UIUlFQH4Cvo&list=PLTA0Ta9Qyspa5Nayx0VCHj5AHQJqp1clD)) challenges that he'd written in Haskell. They involved a fascinating approach using pattern matching. Determining the resulting value of something based upon a list of possible matches on the data being processed. It involved expressions involving the symbols `x` and `xs`. This is very abstract, but it will become more concrete shortly.

## C9 Lectures

The next time I encountered this pattern matching technique was in a series of lectures by the inimitable Erik Meijer. These lectures are on functional programming techniques, and the series is called "[Programming in Haskell](https://www.youtube.com/watch?v=UIUlFQH4Cvo&list=PLTA0Ta9Qyspa5Nayx0VCHj5AHQJqp1clD)", although the concepts themselves are explained in terms of other languages (C#, LINQ) too. I thoroughly recommend you spend some time enjoying them. One thing that Erik said a lot was "x over xs", which is expressed as `x::xs`.

Being somewhat intimidated by the M-word (monad), I have avoided Haskell so far, although my interest in functional programming in other languages (such as in Clojure, and with Ramda in JavaScript) has grown considerably ... I presented at [SAP TechEd EMEA](https://sessioncatalog.sapevents.com/go/agendabuilder.sessions/?l=133&sid=37706_0&locale=en_US) and also at [UI5con](https://twitter.com/qmacro/status/802108634255806465), both in 2016, on functional programming techniques in JavaScript.

## Elm

And now, learning [elm](http://elm-lang.org/), I re-encounter these pattern-matching patterns again. I think it's because, at least to my naive mind, elm seems to reflect a lot of concepts from Haskell (and from Clojure, for that matter). The patterns are expressed nicely in an online book "[Learn You an Elm](https://learnyouanelm.github.io/)"; the book is very much a work-in-progress but definitely worth a read even at this early stage.

The examples in this post will be in elm.


# Subsequent understanding

It turns out that the wonderfully succinct expression `x::xs` represents one of the core concepts in functional programming. A list can be seen in two parts - the head, and the tail. The first element, and the rest of the elements. So `x` represents the head of a list, and `xs` represents the tail. And the `::`? That represents the concept of "cons", which has [its own page on Wikipedia](https://en.wikipedia.org/wiki/Cons) but I'm going to call "prepend" for brevity.

## No loops

One thing to bear in mind from the outset is that in functional programming, there are no loops. Not as you or I might understand them, at least. But if you think of a list of items that you want to process "in a loop", the concept of "x over xs" is what you need.

If you want to transform a list, by applying some function to [each element in] that list, here's how it goes, using that concept. Remembering that functional programming is less about describing the 'how', and more about stating the 'what', we can say that the new list is the result of the function applied to the head of the list (an individual element), combined with the result of the function applied to the tail of the list (a smaller list).

And the function applied to the tail of the list is the result of the function applied to the head of that list, combined with the function applied to the tail of that same list.

And so it goes on, until there are no more elements in the (ever decreasing) tail to which the function must be applied.

The function is called recursively in this fashion.

Here's an example. If we have a list `[1,2,3,4,5]` and want to compute the sum of all the elements in that list (15), this is what the pattern matching approach looks like.

```elm
sum : List number -> number
sum list =
  case list of
    [] -> 0
    (x::xs) -> x + sum xs
```

Calling the function on the list gives us what we're looking for:

```elm
sum [1,2,3,4,5]
--> 15
```

Let's extract the core pattern matching approach here, in the `case` expression:

- `[]` matches an empty list. To be useful (ie not go on forever), recursion needs a base case. This is the base case.

- `(x::xs)` is a pattern that matches two parts - the head and the tail of the list. If the earlier `[]` didn't match, then we're going to have at least one element, matched into `x`, and any further elements, if they exist, are matched into `xs`.

(For those of you who, like me, are not steeped in strongly typed languages, the question "what happens if we don't pass a list at all, just, say, a string?" doesn't even come up, as the elm compiler won't allow that to happen.)

The sum of an empty list of numbers - the base case - is zero, clearly. The sum of a non empty list of numbers is where we see the recursive nature of the definition: it's the first number added to the sum of the rest of the numbers. And while contemplating this beautiful simplicity, consider also that this is an example of how a functional approach to programming is declarative, rather than imperative. Rather than explaining *how* to compute the sum (which we'd traditionally do with a loop and some variable to accumulate the final value), we're just saying *what* it is.

## Further pattern examples

Let's examine a few more instances of this pattern matching. I'm going for quite a few examples, so you can stare at them all for a while.

### Factorial
First, how about calculating factorials:

```elm
factorial : Int -> Int
factorial n =
  case n of
    0 -> 1
    _ -> n * factorial (n - 1)

factorial 5
--> 120
```

We have the same approach here: matching the base case, where n is zero, and then declaring that the factorial of n is just n multiplied by the factorial of n - 1. In this particular example of pattern matching, we're not interested in capturing the matched number (as we already have it in n), hence the `_` in the pattern.

### Length

How about calculating the length of a list? That's simple:

```elm
length : List a -> Int
length list =
  case list of
    [] -> 0
    (_::xs) -> 1 + length xs

length [1,2,3,4,5]
--> 5
```

Again, we see the same pattern.

### Reverse

This time we'll use the pattern matching approach to produce the reverse of a list.

```elm
reverse : List a -> List a
reverse list =
  case list of
    [] -> []
    (x::xs) -> reverse xs ++ [x]

reverse [1,2,3,4,5]
--> [5,4,3,2,1]
```

This time, the base case - an empty list - results in an empty list. Otherwise we take the head and prepend the reverse of the tail to it, recursively.


### Take

Now let's define our own `take` function, a common facility found in functional languages that are (naturally) list-oriented. The function returns the first n elements of a list.

```elm
take : Int -> List a -> List a
take n list =
  if n <= 0 then []
  else case list of
    [] -> []
    (x::xs) -> x :: take (n - 1) xs

take 3 [1,2,3,4,5]
--> [1,2,3]
```

Here we have something extra. There are two base cases - where the list is empty, but also where the number of elements to take is zero or less. But otherwise the pattern is the same.

### Member

This time, we're going to need the `if then else` expression to declare the recursive definition for a function that returns whether an element is a member of a list.

```elm

member : a -> List a -> Bool
member a list =
  case list of
    [] -> False
    (x::xs) -> if a == x then True else member a xs

member 3 [1,2,3,4,5]
--> True

member 6 [1,2,3,4,5]
--> False
```

If the list is empty - the base case - then the answer is clearly going to be False. Otherwise we check to see if the head of the list is the same as the element to find, and if it is, then the answer is True; otherwise we recurse with the tail of the list.

### Maximum

Finally, here's a definition of a function that will return the maximum value in a list. Note here that the function's type signature uses the `comparable` type.

```elm
maximum : List comparable -> comparable
maximum list =
  case list of
    [] -> Debug.crash "Maximum of empty list?!"
    [x] -> x
    (x::xs) -> let m = maximum xs
      in if x > m then x else m

maximum [1,2,3,4,5,4,3,2,1]
--> 5
```

Here we see another construct - the 'let expression', similar to how 'let' is used in Clojure for bindings. It allows the creation of short-lived values, similar to scope-limited variables in other languages. What we're saying for this last pattern case `(x::xs)` is that we want to calculate the maximum of the tail of the list and assign that to `m`, and then in the context of that, check whether the head of the list is greater than that or not.

Elm has a builtin function `max` that will return the maximum of two comparables. The "Learn You an Elm" book points out that this can allow us to be even more succinct in our maximum function, like this:

```elm
maximum_ : List comparable -> comparable
maximum_ list =
  case list of
    [] -> Debug.crash "Maximum of empty list?!"
    [x] -> x
    (x::xs) -> max x (maximum_ xs)

maximum_ [1,2,3,4,5,4,3,2,1]
--> 5
```

Wonderful.

# List machinery

I've talked at length about recursion, and perhaps you too can see the beauty therein.

So what about list machinery? Again, following the 'what not how' philosophy, let's look at a little bit of list machinery in the form of the swiss army chainsaw function `reduce`, which in elm (and other languages) is known as `foldl` - for "fold-left".

We'll re-implement the `maximum` function with `foldl` and the `max` builtin function:

```elm
maximum_ : List comparable -> comparable
maximum_ list =
  List.foldl max 0 list

maximum_ [1,2,3,4,5,4,3,2,1]
--> 5
```

The `foldl` function reduces a list by applying a function in turn to each of the elements. The function to apply should have two parameters - the first to accept the accumulated value and the second to accept the list element being folded over. So here, the function to apply is `max`, which takes two arguments, and the initial value for any maximum comparison (of positive numbers, at least) should be zero.

Perhaps more wonderful even than the recursive version? Remember that we're processing each element of a list, without any concern as to how that processing happens - we leave that to the language's list machinery to deal with for us.

And to finish, how about using `foldl` to reverse a list, so we can contrast it with the recursive definition earlier?

```elm
List.foldl (::) [] [1,2,3,4,5]
--> [5,4,3,2,1]
```

(The cons function `::` can be used in function position by surrounding it in brackets.)

Gosh. Worthy of a long stare. Don't you think?

**Postscript:**

A day after publishing this post, I find myself at [Lambda Lounge](http://www.lambdalounge.org.uk/) in Manchester this evening, hosted at [MadLab](https://madlab.org.uk/), where we're learning about [Elixir](http://elixir-lang.org/), a dynamic functional language on the Erlang OTP platform, and a short way into the session, this sample is presented to us:

```elixir
defmodule Factorial do
  def of(0), do: 1
  def of(n), do: n * of(n-1)
end

Factorial.of(5)
//> 120
```

While the Elixir syntax may be less familiar to us right now, I'm guessing that the approach here, that we've examined in this post, jumps off the page in a rush of familiarity. Within the `Factorial` module, we have a couple of definitions of the `of` function, which are used in the same pattern matching way. And we can see the base case defined thus:

```elixir
def of(0), do: 1
```

and the recursive call:

```elixir
def of(n), do: n * of(n-1)
```

Lovely.
