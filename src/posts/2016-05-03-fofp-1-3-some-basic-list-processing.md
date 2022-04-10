---
layout: post
title: FOFP 1.3 Some basic list processing
tags:
  - language-ramblings
---
Part of the [Fundamentals of Functional Programming](/2016/05/03/fofp) document.

Prev: [FOFP 1.2 Trying things out](/2016/05/03/fofp-1-2-trying-things-out)

Let's explore the difference between imperative and functional programming approaches with the simple processing of a list of integers 1, 2, 3, 4, 5. We want to turn them into their "squared" equivalents 1, 4, 9, 16, 25.

Create a list of integers, using the array literal syntax, like this:

```javascript
var nums = [1, 2, 3, 4, 5];
```

## First attempt

A typical imperative approach to creating the squares might look like this:

```javascript
var i;
for (i = 0; i < nums.length; i++) {
  nums[i] = nums[i] * nums[i];
}
// 25
```

This pattern is very familiar. And it's very mechanical. We're giving very precise instructions on how to achieve the goal.

There's nothing wrong with that per se. It's just a little, well, *mechanical*. And even in this trivial example, there are a number of things that will tax us:

- we are iterating through the list of integers in `nums` using an array index lookup. For that we need to declare and maintain a variable `i`, initialising it to zero at the outset (`i = 0`), and incrementing it by one each time around the loop (`i++`). So we have to keep that state in our head as we read, or (worse) want to modify that code.

- we have to address the number of items in the list (`nums.length`) explicitly, so as to be able to finish the looping when we reach the end of the list.

- inside the loop, we have to use the array index explicitly (`[i]`) each time we want to refer to the value of the list item currently being processed. This just adds to the cognitive noise that we have to deal with, on top of remembering that `i` is changing each time.

- The `for` statement actually evaluates to something, which we see here is 25 - the last value computed inside the block. Sort of makes sense, but only a little.

So after executing this, we have what (we think) we wanted:

```javascript
nums
// [1, 4, 9, 16, 25]
```

But perhaps the biggest problem is that if we run this a second time, we don't get the same result:

```javascript
var i;
for (i = 0; i < nums.length; i++) {
  nums[i] = nums[i] * nums[i];
}
// 625
```

625? What's going on? Well notice that we're mutating values inside the `nums` list. So after the first time, the values inside `nums` are the squares, i.e. 1, 4, 9, 16 and 25. So when we run it again, we're squaring those values, with these results:

```javascript
nums
// [1, 16, 81, 256, 625]
```

Ouch.

Because state is being mutated, the program becomes harder to follow, harder to reason about.

## Second attempt

So let's have another crack at this. Instead of mutating the values inside `num`, we'll produce the output in another list, and keep the original list untouched. Before we start, let's put our input back to what it was:

```javascript
var nums = [1, 2, 3, 4, 5];
```

Now we'll create a new empty array `squares`, and push each square value into that inside the loop:

```javascript
var i;
var squares = [];
for (i = 0; i < nums.length; i++) {
  squares.push(nums[i] * nums[i]);
}
// 5
```

*Those eagle-eyed readers among you will perhaps be wondering about the value `5` here. It's not the same as what we had earlier. But it's consistent, in that it's the value of the last-executed statement inside the loop. Before, that was the result of a multiplication. Here, it's the result of a call to `push`, which returns the new length of the array being operated upon.*

Anyway, after execution, `nums` is still what it was, and the output values are now to be found in `squares`:

```javascript
squares
// [1, 4, 9, 16, 25]
```

That's an improvement. We have to be a bit careful if we want to re-run the code, because we need to make sure we include the initialising of the `squares` array before the loop, so as not to end up with this situation:

```javascript
squares
// [1, 4, 9, 16, 25, 1, 4, 9, 16, 25]
```

But the improvement comes at a cost - yet more stuff to hold in your head, this time about the `squares` array.

Next: [FOFP 1.4 A different approach with map](/2016/05/03/fofp-1-4-a-different-approach-with-map)
