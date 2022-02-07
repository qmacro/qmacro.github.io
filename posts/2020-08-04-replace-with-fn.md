---
layout: post
title: String.prototype.replace() can take a function
tags:
  - autodidactics
  - javascript
---

_You can use a function to dynamically provide the replacement value in a `replace` operation_

I was pondering different approaches to solving the Codewars kata [Simple string reversal](https://www.codewars.com/kata/5a71939d373c2e634200008e), and having submitted my own, I started to browse other solutions. One that caught my eye was this, from users [Bubbler](https://www.codewars.com/users/Bubbler) and [Tellurian](https://www.codewars.com/users/Telllurian):

```javascript
function solve(str) {
  let arr = [...str].filter(x => x != ' ')
  return str.replace(/\S/g, _ => arr.pop())
}
```

If you look at the [MDN page for String.prototype.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) the syntax is given thus:

```
const newStr = str.replace(regexp|substr, newSubstr|function)
```

A function! I probably had come across this before but had forgotten. The beauty of the solution above lies in this possibility; while the `arr.pop()` mutates the `arr`, it does it in such a beguiling way I don't have any issue enjoying the entire `replace` call. Given that the regular expression `g` modifier is used, the function supplied is called N times, each time supplying a (single character) value from the `arr` array.

Absolutely lovely.
