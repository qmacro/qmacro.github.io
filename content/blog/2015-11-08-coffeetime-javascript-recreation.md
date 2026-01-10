---
title: Coffee-time JavaScript recreation
date: 2015-11-08
tags:
  - language-ramblings
  - javascript
  - filter
  - immutability
  - join
  - map
  - sapteched
  - sort
description: In preparing for co-presenting a hands-on session at SAP TechEd EMEA this coming week in Barcelona, I came across a chunk of JavaScript. In this post I try to improve it with robustness and immutability in mind.
---
The chunk of code was in the context of a simple extension to a standard SAP Fiori app. Clearly the focus was on the extension process itself, including all the features that the extension concept affords, and how it is realised within the SAP HANA Cloud Platform – the JavaScript code itself was merely a means to an end.

The chunk was small, and was used to output a Message Toast showing either a single selected date, like this:

```text
Sun Nov 15 2015
```

or a range of dates, like this:

```text
Sun Nov 15 2015 – Wed Nov 18 2015
```

depending on whether there was just a single date passed, or a list of them.

This is what the code looked like (I’ve removed the use of the Message Toast mechanism, so this whole post is independent of any toolkit or library):

```javascript
if (arr.length === 1) {
  // output single date
  arr[0];
  } else if (arr.length > 1) {
  var index = arr.length - 1;
  var orderedArr = [];
  for (var date in arr) {
    orderedArr.push(Date.parse(arr[date]));
  }
  orderedArr.sort();
  // output range
  new Date(orderedArr[0]).toDateString()
  + ' - '
  + new Date(orderedArr[index]).toDateString();
}
```

The context of this chunk of JavaScript was a list of one or more dates, in string format, like this:

```javascript
["Sun Nov 15 2015"]
```

or this:

```javascript
["Sun Nov 15 2015", "Mon Nov 16 2015", "Tue Nov 17 2015", "Wed Nov 18 2015"]
```

If nothing else, my slow but sure explorations into functional territory have made me more aware of how mechanical some code can be – describing the “how” rather than the “what I want”. It has also made me more aware of the power and simplicity of lists (vectors, arrays, or whatever else you want to call them). Finally, mutable state is also something that I’m now more consciously aware of, and am interested to see how one might improve robustness with immutability.

So I wondered if I could improve that chunk of code, with something that took the above awarenesses into account.

Here’s what I came up with:

```javascript
arr.map(function(sDate) { return Date.parse(sDate); })
   .sort()
   .filter(function(x, i, xs) { return i === 0 || i === xs.length - 1; })
   .map(function(nDate) { return new Date(nDate).toDateString(); })
   .join(" - ");
```

We map directly over the single input array ‘arr’, producing a new array with parsed date integers which would be sortable. That array is then sorted. (Unfortunately, JavaScript’s sort is in-place, mutating the input, but it’s only the in-flight array produced by map that is changed, rather than ‘arr’, so let’s continue anyway.)

We then want only the first and last values, the start and end dates, effectively. We use filter for this, making use of all three of the arguments that filter passes to the callback function. This will also work on a single-element array, for the case where only a single date is supplied, which is nice.

With the first and last dates, or just the single date, we then turn them back into Date objects and output a string version. If there’s more than a single date, we join them together with a dash.

And that’s it.

Thinking about data in terms of lists, and functions that operate with lists, helps me.

Is it any better than the original? Well, I think so. Although it’s not ideal (even if you discount the in-place sort) as if you look at the function supplied to filter, it’s not immediately obvious what it’s doing. Perhaps we instead could extend the Array’s prototype with two new functions like this:

```javascript
Array.prototype.first = function() { return this[0]; }
Array.prototype.last = function() { return this[this.length - 1]; }
```

I like the idea of extending the language to do what you want, but it’s not without issues.

Alternatively, we could have defined a function separately for first and last, like this:

```javascript
function firstAndLast(x, i, xs) { return i === 0 || i === xs.length - 1; }
```

and then used it thus:

```javascript
arr.map(function(sDate) { return Date.parse(sDate); })
   .sort()
   .filter(firstAndLast)
   .map(function(nDate) { return new Date(nDate).toDateString(); })
   .join(" - ");
```

to be more descriptive.

Anyway, I’ll leave it there for now. Would you do it differently?
