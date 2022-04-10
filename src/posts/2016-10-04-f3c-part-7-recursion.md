---
layout: post
title: F3C Part 7 - Recursion
tags:
  - language-ramblings
---
FunFunFunction Video: [Recursion - Part 7 of Functional Programming in JavaScript](https://www.youtube.com/watch?v=k7-N8R0-KY4&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=7)

(This post is part of the [F3C](/f3c/) series)

"Recursion is when a function calls itself, until it doesn't" -- MPJ

While superficially flippant, this definition is rather accurate and succinct. It's what I'm going to adopt when explaining it at a high level to someone new. 

I think there are two levels to understanding recursion. The first is at the theory level. There has to be a way for the repeat calling to end, either a base case, as was shown in the countdown example, or a situation where the function runs out of data to process, as was shown in the animals hierarchy example. 

The second is at the practice level. I've sometimes found it cognitively difficult to "see" the recursive pattern and how it might apply in a solution. It helps to visualise what's happening, and so that's what we'll do here with the animals hierarchy example. 

The following is the same code that was shown in the video, but with some extra counting and logging:

```javascript

let calls = 0
let makeTree = (categories, parent, level) => {

  calls++
  level++

  let node = {}
  let children = categories
    .filter(c => c.parent === parent)

  console.log(
    level,
    parent, '->',
    children.length
    ? children.map(c => c.id).join(", ")
    : "none")

  children.forEach(c => node[c.id] = makeTree(categories, c.id, level))

  return node
}

console.log(JSON.stringify(makeTree(categories, null, 0), null, 2))
console.log(calls, 'calls')
```

The variable `calls` is used simply to count how many times the `makeTree` function is called. There's now a 3rd parameter `level` in the `makeTree` function signature which we seed with the value '0'; it's incremented each time the function calls itself, so we can count how deep the rabbit hole goes.

This is what the output looks like:

```
1 null '->' 'animals'
2 'animals' '->' 'mammals'
3 'mammals' '->' 'cats, dogs'
4 'cats' '->' 'persian, siamese'
5 'persian' '->' 'none'
5 'siamese' '->' 'none'
4 'dogs' '->' 'chihuahua, labrador'
5 'chihuahua' '->' 'none'
5 'labrador' '->' 'none'
{
  "animals": {
    "mammals": {
      "cats": {
        "persian": {},
        "siamese": {}
      },
      "dogs": {
        "chihuahua": {},
        "labrador": {}
      }
    }
  }
}
9 'calls'
```

The main structure is the same. And clearly there are 9 calls. That makes sense, because there are 9 candidate parents (including `null`, from the initial call). 

We can also see how many levels the recursion descends (5), and how it ascends too, from the last feline parent candidate 'siamese' at level 5, back up to the 'dogs' parent candidate at level 4. 

This is what it looks like visually:

```
1                   null
                     |
2                  animals
                     |
3                  mammals
                     |
            +--------+--------+
            |                 |
4         cats               dogs
            |                 |
       +---------+       +---------+
       |         |       |         |
5   persian  siamese  chihuahua labrador
       |         |       |         |
     (none)    (none)  (none)    (none)
```

(The fact that there are no children belonging to any of the candidate parent nodes at level 5 is represented by `(none)`).

And there you have it. Practice thinking about recursion, and how it applies to problems like this.

Oh yes, and there's also something I wanted to say about tail call optimisation, but there isn't space here to do any justice to it. Perhaps a subject for a later post. In the meantime, remember the immortal and recursive suggestion from [Scarfolk Council](http://scarfolk.blogspot.co.uk/): "For more information, please reread".
