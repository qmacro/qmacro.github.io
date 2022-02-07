---
layout: post
title: FOFP 1.1 Introduction
tags:
  - language-ramblings
---
Part of the [Fundamentals of Functional Programming](/2016/05/03/fofp) document.

This document introduces some fundamental building blocks in the functional programming world.

## A definition

Just so we start out on the same page, let's come up with a working definition of what functional programming is. It's a style of programming - a programming paradigm, where computation is brought about by the evaluation of functions. There's also an emphasis on immutability which means that changing state is positively discouraged. While some programming languages are imperative ("do this, do that"), functional programming can be seen as declarative, with expressions, rather than statements, being key building blocks in the programs you write.

There are languages that are designed to be entirely functional, such as Haskell, and languages that are "multi-paradigm", such as Python. Many of these multi-paradigm languages support functional programming concepts. Even languages that are traditionally and strongly object-oriented (another programming paradigm) are exploring the functional space, such as Java, with the advent of lambda expressions in Java 8.

## Functions

As you might guess, functions are a key component of a language that supports functional programming. For now, let's think of a function as simply a mechanism that takes an input value and produces an output value. If we had a function that doubled a number, we'd describe it generally like this:

```
f : a -> b
```
where you would pass a value represented by `a` to a function `f`, which would produce value `b` as a result. In other words, when `f` is applied to `a`, it produces `b`. This is known as function application [4.12.1.3].

We'll come back to functions in a second. Let's look at other key components that make up the fundamental building blocks of a language.

## Building blocks

In many languages you'll find integers, floating point numbers, characters and strings[^1], that we use to hold values in our programs. These simple, single types are sometimes known as scalar values - single units of data. But there are also structures that contain multiple values. Typical structures here are lists, also known as arrays or vectors, and maps, also known as hashes, or associative arrays, containing pairs of names and values.

All these types are known as being first-class, meaning that they can be used as input to, and be produced as output from, functions.

## Functions are first-class

In functional programming, functions are first-class too. This means that functions can also be passed as input to other functions, and that functions can produce other functions as output [4.12.1.2].

Next: [Trying things out](/2016/05/03/fofp-1-2-trying-things-out)

[^1]: Some might argue that strings are not scalar, but complex structures. But that's for another time.
