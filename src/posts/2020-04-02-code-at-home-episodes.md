---
layout: post
title: Code at Home episodes
---

_This post summarises the episodes streamed live (and available as recordings) on YouTube. Find out more about the Code at Home initiative in the main blog post: [Let's learn to "Code at Home"](/blog/posts/2020/03/24/code-at-home/)._

All the episodes are live streamed [on my YouTube channel](https://youtube.com/djadams-qmacro) and are then available on that same channel after the streams finish, as recordings. In this post are links to those recordings with a short description of each. You can easily spot the upcoming live streams and recordings as they always have the "Code at Home" background in the thumbnail, like this:

![Code at Home video thumbnails]( {{ "/images/2020/04/cahthumbnails.png" | url }})

# Episodes

Here are the recordings of the live stream episodes so far. Click on the episode title link to get to the recording on YouTube.

<table>
  <tr>
    <th width="35%">Episode</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      Fri 27 Mar 2020<br>
      <a href="https://www.youtube.com/watch?v=X7gtbWiHTBY">Code at Home Ep.1<br>Setting up for our first challenge</a>
    </td>
    <td>
      <p>In this first episode we set up the tools that we need - the <a href="https://projecteuler.net">Project Euler</a> and the <a href="https://repl.it">repl.it</a> websites. We also solve together the very first problem described on Project Euler: <a href="https://projecteuler.net/problem=1">Multiples of 3 and 5</a>.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome1">CodeAtHome1</a></p>
    </td>
  </tr>
  <tr>
    <td>
      Mon 30 Mar 2020<br>
      <a href="https://www.youtube.com/watch?v=cfGQ-K7dvfg">Code at Home Ep.2<br>Fizz-Buzz and Fibonacci</a>
    </td>
    <td>
      <p>We start off by looking at the little "homework" challenge from last time, with a program to generate the output of a Fizz-Buzz game. Then the main part of this episode sees us take a first look at the Fibonacci sequence, what it is and how to work out the termns in that sequence, coding together a simple program to do that.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome2">CodeAtHome2</a> and <a href="https://repl.it/@qmacro/FizzBuzz">FizzBuzz</a></p>
    </td>
  </tr>
  <tr>
    <td>
      Wed 01 Apr 2020<br>
      <a href="https://www.youtube.com/watch?v=tYt7SsGbhu4">Code at Home Ep.3<br>Solving a Fibonacci related challenge</a>
    </td>
    <td>
      <p>Following on from the previous episode we take another look together at what we wrote already to generate the Fibonacci sequence, and rewrite it to make it better, using a generator function and even creating a function that produces other functions. With that, we go and solve Project Euler problem 2: <a href="https://projecteuler.net/problem=2">Even Fibonacci numbers</a>.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome3">CodeAtHome3</a></p>
    </td>
  </tr>
  <tr>
    <td>
      Fri 03 Apr 2020<br>
      <a href="https://www.youtube.com/watch?v=yOfp681B_tg">Code at Home Ep.4<br>Figuring out sentence statistics!</a>
    </td>
    <td>
      <p>Taking a break from numbers, we start to look at sentences and words, and how to parse them to grab basic data. In doing this we learn about arrays, and how to create and use them, even discovering functions and properties that are available on them. We also start to introduce the 'const' and 'let' keywords, and end with a gentle introduction to the super 'map' function.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome4">CodeAtHome4</a></p>
    </td>
  </tr>

  <tr>
    <td>
      Mon 06 Apr 2020<br>
      <a href="https://www.youtube.com/watch?v=7HDJOKtSNUE">Code at Home Ep.5<br>More on arrays and array functions</a>
    </td>
    <td>
      <p>Continuing on from the previous episode we start off by taking a look at character codes to understand the default sort() behaviour, digging in a little bit to the ASCII table. Then we look at a few more array functions, revisiting split() and map() and finally building a predicate function isPalindrome() that will tell us if the input is palindromic, a useful function that we'll need to solve <a href="https://projecteuler.net/problem=4">Project Euler problem 4</a> in the next episode.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome5">CodeAtHome5</a></p>
    </td>
  </tr>

  <tr>
    <td>
      Wed 08 Apr 2020<br>
      <a href="https://www.youtube.com/watch?v=vQoZeQW4SbQ">Code at Home Ep.6<br>Solving the palindromic products puzzle</a>
    </td>
    <td>
      <p>We start off by making slight improvements to our isPalindrome() function so that it will work with numbers as well as strings. Then we generate pairs of numbers in nested for loops, implementing an optimisation that will leave out duplicate calculations. We then check whether our code agrees with the answer to the sample in the problem (the product of two 2-digit numbers) and confident that it's OK, we put the code to work to calculate the main part of <a href="https://projecteuler.net/problem=4">Project Euler problem 4</a>, and it works!</p>
      <p>Along the way, we define a function that we then use to influence the behaviour of the sort() function. Between now and the next episode, think about how this function works, by looking at the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort">Array.prototype.sort</a> documentation at MDN.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome6">CodeAtHome6</a></p>
    </td>
  </tr>
  
  <tr>
    <td>
      Fri 10 Apr 2020<br>
      <a href="https://youtu.be/cIX5ThSpYGI">Code at Home Ep.7<br>Looking at sort functions</a>
    </td>
    <td>
      <p>In this episode we dig more into why the default sort behaviour for our filtered palindromic products wasn't quite what we wanted, and looked into how the sort() function can use a 'compare function' to tell it how to behave. Then after creating a useful function to generate a nice list of random numbers on demand, we explore our own compare function implementation, passing it to sort() to influence the behaviour. Lots of fun!</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome7">CodeAtHome7</a></p>
    </td>
  </tr>
  <tr>
    <td>
      Mon 13 Apr 2020<br>
      <a href="https://www.youtube.com/watch?v=hizi99N8F5A">Code at Home Ep.8<br>Finishing off sort, and introducing objects</a>
    </td>
    <td>
      <p>In this episode we expand our horizons with respect to arrays, and learn how you can have arrays with different types of data, and even nest arrays inside each other. We then move on to objects, which are an even more powerful way of representing and manipulating data. As a brief aside, we take an initial look at <a href="https://projecteuler.net/problem=4">Project Euler Problem 4 - Names Scores</a>, which we'll start to solve together next. Finally, we write another compare function to call sort() with, so that we can sort by referring to values of properties inside object structures.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome8">CodeAtHome8</a></p>
      <p>Data resources for this episode: <a href="https://gist.github.com/qmacro/7dcab532e7029ac1a1042bcf9f29f3af#file-episodes-a-js">episodes-A.js</a> which we copied into our repl.it workspace.</p>
    </td>
  </tr>
  <tr>
    <td>
      Wed 15 Apr 2020<br>
      <a href="https://www.youtube.com/watch?v=3HrewK3Z114">Code at Home Ep.9<br>Looking at Project Euler problem Nr.22</a>
    </td>
    <td>
      <p>We take a first proper look at the "Names Scores" problem, which is Nr.22 in the Project Euler series. There are a lot of things for us to do to solve the problem, but all of them definitely manageable. We spent a lot of this episode learning about how to open and read file contents, which we need to do to bring in the 5000+ first names that the problem is based upon.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome9">CodeAtHome9</a></p>
    </td>
  </tr>
  <tr>
    <td>
      Fri 17 Apr 2020<br>
      <a href="https://www.youtube.com/watch?v=MCcOglgeiqE">Code at Home Ep.10<br>Continuing with Project Euler problem Nr.22</a>
    </td>
    <td>
      <p>Now we're comfortable with reading in the data from the file from the previous episode, we can turn our attention to starting to pick off each task we need to achieve to solve the problem. In this episode we look at stripping off the double-quotes from each name, and how to go about calculating individual letter scores for each name. We also take a brief look at the raw data that is provided to us from the file read process, and work out what it represents, by translating between hexadecimal and decimal and looking up values in an ASCII table.</p>
      <p>Code resources for this episode (same as the previous episode): <a href="https://repl.it/@qmacro/CodeAtHome9">CodeAtHome9</a></p>
    </td>
  </tr>

  <tr>
    <td>
      Mon 20 Apr 2020<br>
      <a href="https://www.youtube.com/watch?v=bzJ7UQoCqxI">Code at Home Ep.11<br>An introduction to reduce()</a>
    </td>
    <td>
      <p>In this episode we took our time over getting acquainted with the powerful Array.prototype.reduce() function, the 'big sister' of Array.prototype.map(), Array.prototype.filter() and other similar array functions. Unlike map() and filter(), both of which expect to be passed functions that take a single parameter, and both of which produce an array as a result, the reduce() function expects to be passed a function that takes two parameters, and can produce a result of any shape (e.g. an array, an object or a scalar). We used reduce() to add up an array of numbers.</p>
      <p>Code resources for this episode (same as the previous episode): <a href="https://repl.it/@qmacro/CodeAtHome9">CodeAtHome9</a></p>
    </td>
  </tr>

  <tr>
    <td>
      Wed 22 Apr 2020<br>
      <a href="https://youtu.be/puzpDLgWebA">Code at Home Ep.12<br>Finishing off Project Euler Nr.22</a>
    </td>
    <td>
      <p>In this episode we finish off the coding for Project Euler problem 22. In doing so, we look at a feature of the Array.prototype.map() function that we've previously ignored - the fact that not only does it pass the element to the function we provide to it, but also that element's position in the array that's being processed. We use this feature to get the position of the element, to work out the final score for each name. Great!</p>
      <p>Code resources for this episode (same as the previous episode): <a href="https://repl.it/@qmacro/CodeAtHome9">CodeAtHome9</a></p>
    </td>
  </tr>

  <tr>
    <td>
      Fri 24 Apr 2020<br>
      <a href="https://youtu.be/S_2-cMRd4N8">Code at Home Ep.13<br>Looking at Base 2 and our next challenge</a>
    </td>
    <td>
      <p>We start off by taking a peek at the next challenge which is <a href="https://projecteuler.net/problem=36">Project Euler Nr.36 - Double-base palindromes</a> where we have to check not only decimal but binary numbers for palindromic properties. So we take an excursion into binary, or Base 2, to understand how that works. Then we grab the isPalindrome() function from a previous CodeAtHome episode to reuse, and quite easily solve the problem together. Great!</p>
      <p>Code resources for this episode <a href="https://repl.it/@qmacro/CodeAtHome13">CodeAtHome13</a></p>
    </td>
  </tr>

  <tr>
    <td>
      Mon 27 Apr 2020<br>
      <a href="https://www.youtube.com/watch?v=570mDChjATM">Code at Home Ep.14<br>Refactoring to improve our code</a>
    </td>
    <td>
      <p>There are nearly always opportunities to make improvements to code; whether that is for readability, performance, or other reasons. In this episode we looked at what we wrote for the solution we coded together on the previous episode and made a few improvements, by tweaking some values to make the calculation perform better, and by adding a "helper" function that we can use in lots of places and that encapsulates complexity that we can then forget about.</p>
      <p>Code resources for this episode <a href="https://repl.it/@qmacro/CodeAtHome14">CodeAtHome14</a></p>
    </td>
  </tr>

  <tr>
    <td>
      Wed 29 Apr 2020<br>
      <a href="https://www.youtube.com/watch?v=2gf1lytLR3k">Code at Home Ep.15<br>Continuing our refactoring journey using 'range'</a>
    </td>
    <td>
      <p>We refactored some of our code in the previous episode and in this one we continued to do so, creating our own utility module and moving functions into that, and then importing what we need to the main index.js file. Then before tackling our range() function we looked at how range() works in Python, so that we could emulate that, for consistency. Then we started to write a new version of our range() function accordingly.</p>
      <p>Code resources for this episode <a href="https://repl.it/@qmacro/CodeAtHome15">CodeAtHome15</a></p>
    </td>
  </tr>

  <tr>
    <td>
      Fri 01 May 2020<br>
      <a href="https://youtu.be/78Exn27aGXg">Code at Home Ep.16<br>recursion (noun): for a definition, see 'recursion'</a>
    </td>
    <td>
      <p>After finishing off our reworked range() function so that it behaved more like Python 3's range() function, we moved on to start looking at <a href="https://en.wikipedia.org/wiki/Recursion">recursion</a> - what it is and where it came from. It's a wonderful concept but does take some time to understand, so we started slowly by looking at how we might use a recursive function definition to add some numbers together - with no explicit looping!</p>
      <p>Code resources for this episode <a href="https://repl.it/@qmacro/CodeAtHome16">CodeAtHome16</a></p>
    </td>
  </tr>

  <tr>
    <td>
      Mon 04 May 2020<br>
      <a href="https://youtu.be/1whk_QC9CPw">Code at Home Ep.17<br>A little more exploration of recursion</a>
    </td>
    <td>
      <p>In last Friday's episode we got our first taste of recursion, defining a recursive function sum() to add a list of numbers together. In this episode we had another look at that recursive definition to understand the pattern a bit more, with the base case and the main part, and then expanded our knowledge by creating a similar function mul() to multiply a list of numbers together, and making note of the (very few) things that had to change. Then we looked at what factorials were, and defined a recursive function to determine factorials for us. In fact, we defined it three different ways, ending up with a single-expression function that used the ternary operator. The definition was a little terse, but hopefully interesting!</p>
      <p>Code resources for this episode <a href="https://repl.it/@qmacro/CodeAtHome17">CodeAtHome17</a></p>
    </td>
  </tr>

  <tr>
    <td>
      Mon 11 May 2020<br>
      <a href="https://youtu.be/gFZEDy6ZAxo">Code at Home Ep.18<br>Looking at our next coding challenge together</a>
    </td>
    <td>
      <p>We embark upon our last challenge for this series, which is Project Euler problem 52 <a href="https://projecteuler.net/problem=52">Permuted Multiples</a>, and take our time exploring the problem space in the REPL together. We build up solid little functions to help us out along the way, and to codify what our thoughts are, starting with digits(), contains() and sameLength(). We get to the stage where we can check through to see if all the digits in one number are in another number ... but we're not done yet, as we saw towards the end where we came across the 'subset' issue. We'll finish this off in the next episode, by looking at solving that (using sameLength()) and improving the comparisons with the array function every().</p>
      <p>Code resources for this episode <a href="https://repl.it/@qmacro/CodeAtHome18">CodeAtHome18</a></p>
    </td>
  </tr>

  <tr>
    <td>
      Fri 15 May 2020<br>
      <a href="https://youtu.be/qw8BY5kvoI8">Code at Home Ep.19<br>Finishing off our challenge, improving the code</a>
    </td>
    <td>
      <p>We did it! We finished off and solved Project Euler problem 52 together. In finishing off, we completed the isPermutation() function, which we needed to check two things, in sequence - first, whether the length of each number was the same, and then (and only if the lengths were the same) whether the digits in the first number were in the second number. We also created the meetsRequirements() function, and indeed wrote two versions of it, which checked the actual requirements of the problem, for each number we could throw at it - which we did in a simple while loop at the end.</p>
      <p>Code resources for this episode <a href="https://repl.it/@qmacro/CodeAtHome18">CodeAtHome18</a></p>
    </td>
  </tr>
</table>
  
  
