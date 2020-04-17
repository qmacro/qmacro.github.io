---
layout: post
title: Code at Home episodes
date: '2020-04-02 08:37:00'
---

_This post summarises the episodes streamed live (and available as recordings) on YouTube. Find out more about the Code at Home initiative in the main blog post: [Let's learn to "Code at Home"](/2020/03/24/code-at-home/)._

All the episodes are live streamed [on my YouTube channel](https://youtube.com/djadams-qmacro) and are then available on that same channel after the streams finish, as recordings. In this post are links to those recordings with a short description of each. You can easily spot the upcoming live streams and recordings as they always have the "Code at Home" background in the thumbnail, like this:

![Code at Home video thumbnails](/content/images/2020/04/cahthumbnails.png)

# Episodes

Here are the recordings of the live stream episodes so far. Click on the episode title link to get to the recording on YouTube.

<table>
  <tr>
    <th width="35%">Episode</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>
      <a href="https://www.youtube.com/watch?v=X7gtbWiHTBY">Code at Home Ep.1<br>Setting up for our first challenge</a>
    </td>
    <td>
      <p>In this first episode we set up the tools that we need - the <a href="https://projecteuler.net">Project Euler</a> and the <a href="https://repl.it">repl.it</a> websites. We also solve together the very first problem described on Project Euler: <a href="https://projecteuler.net/problem=1">Multiples of 3 and 5</a>.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome1">CodeAtHome1</a></p>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.youtube.com/watch?v=cfGQ-K7dvfg">Code at Home Ep.2<br>Fizz-Buzz and Fibonacci</a>
    </td>
    <td>
      <p>We start off by looking at the little "homework" challenge from last time, with a program to generate the output of a Fizz-Buzz game. Then the main part of this episode sees us take a first look at the Fibonacci sequence, what it is and how to work out the termns in that sequence, coding together a simple program to do that.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome2">CodeAtHome2</a> and <a href="https://repl.it/@qmacro/FizzBuzz">FizzBuzz</a></p>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.youtube.com/watch?v=tYt7SsGbhu4">Code at Home Ep.3<br>Solving a Fibonacci related challenge</a>
    </td>
    <td>
      <p>Following on from the previous episode we take another look together at what we wrote already to generate the Fibonacci sequence, and rewrite it to make it better, using a generator function and even creating a function that produces other functions. With that, we go and solve Project Euler problem 2: <a href="https://projecteuler.net/problem=2">Even Fibonacci numbers</a>.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome3">CodeAtHome3</a></p>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.youtube.com/watch?v=yOfp681B_tg">Code at Home Ep.4<br>Figuring out sentence statistics!</a>
    </td>
    <td>
      <p>Taking a break from numbers, we start to look at sentences and words, and how to parse them to grab basic data. In doing this we learn about arrays, and how to create and use them, even discovering functions and properties that are available on them. We also start to introduce the 'const' and 'let' keywords, and end with a gentle introduction to the super 'map' function.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome4">CodeAtHome4</a></p>
    </td>
  </tr>

  <tr>
    <td>
      <a href="https://www.youtube.com/watch?v=7HDJOKtSNUE">Code at Home Ep.5<br>More on arrays and array functions</a>
    </td>
    <td>
      <p>Continuing on from the previous episode we start off by taking a look at character codes to understand the default sort() behaviour, digging in a little bit to the ASCII table. Then we look at a few more array functions, revisiting split() and map() and finally building a predicate function isPalindrome() that will tell us if the input is palindromic, a useful function that we'll need to solve <a href="https://projecteuler.net/problem=4">Project Euler problem 4</a> in the next episode.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome5">CodeAtHome5</a></p>
    </td>
  </tr>

  <tr>
    <td>
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
      <a href="https://youtu.be/cIX5ThSpYGI">Code at Home Ep.7<br>Looking at sort functions</a>
    </td>
    <td>
      <p>In this episode we dig more into why the default sort behaviour for our filtered palindromic products wasn't quite what we wanted, and looked into how the sort() function can use a 'compare function' to tell it how to behave. Then after creating a useful function to generate a nice list of random numbers on demand, we explore our own compare function implementation, passing it to sort() to influence the behaviour. Lots of fun!</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome7">CodeAtHome7</a></p>
    </td>
  </tr>
  <tr>
    <td>
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
      <a href="https://www.youtube.com/watch?v=3HrewK3Z114">Code at Home Ep.9<br>Looking at Project Euler problem Nr.22</a>
    </td>
    <td>
      <p>We take a first proper look at the "Names Scores" problem, which is Nr.22 in the Project Euler series. There are a lot of things for us to do to solve the problem, but all of them definitely manageable. We spent a lot of this episode learning about how to open and read file contents, which we need to do to bring in the 5000+ first names that the problem is based upon.</p>
      <p>Code resources for this episode: <a href="https://repl.it/@qmacro/CodeAtHome9">CodeAtHome9</a></p>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.youtube.com/watch?v=MCcOglgeiqE">Code at Home Ep.10<br>Continuing with Project Euler problem Nr.22</a>
    </td>
    <td>
      <p>Now we're comfortable with reading in the data from the file from the previous episode, we can turn our attention to starting to pick off each task we need to achieve to solve the problem. In this episode we look at stripping off the double-quotes from each name, and how to go about calculating individual letter scores for each name. We also take a brief look at the raw data that is provided to us from the file read process, and work out what it represents, by translating between hexadecimal and decimal and looking up values in an ASCII table.</p>
      <p>Code resources for this episode (same as the previous episode): <a href="https://repl.it/@qmacro/CodeAtHome9">CodeAtHome9</a></p>
    </td>
  </tr>
</table>
  
