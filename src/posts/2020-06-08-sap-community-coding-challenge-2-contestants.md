---
layout: post
title: "SAP Community Coding Challenge 2 - Contestants"
date: 2020-06-08
tags:
  - sapcommunity
  - codingchallenge
---
*Here's a list of the SAP Community Coding Challenge 2 contestants who
were successful in their submissions. Congratulations to them all!*

Following the [update blog
post](/blog/posts/2020/05/26/sap-community-coding-challenge-2-update/)
and the live stream last week (recording
[here](https://youtu.be/RKQTWR4-2PE)) I thought it was time for a main
list of successful contestants.

The current SAP Community Coding Challenge has seen a wonderful array of
submissions, and for that we thank you all. Over the course of the
submission period we received 79 in total, with a success rate (i.e.
where the submission produced the correct answer) was over 90%, which is
great.

## Styles

We saw all kinds of styles, from beginner JavaScript coders to advanced,
some opting for a class based approach, others for a more functional
one. With a language as flexible as JavaScript it was clear that we were
going to see folks' personalities in places too \... from the use of
whitespace, to how variables and functions were named and capitalised,
to how commenting was used to good effect (or, in some cases, how no
comments were used at all).

## Speed

Another factor that came up was how performant the submissions were.
Although speed was not a factor explicitly stated in the [original
post](/blog/posts/2020/04/27/sap-community-coding-challenge-nr.2/),
it was clear that many of you enjoyed making your submissions run as
fast as possible, and so we saw a number of common optimisations. The
most common was a cache of the sequence lengths for a given starting
term, so that when working through a sequence, if the term arrived at
was one already seen, that sequence could be short-circuited there and
then by adding the length thus far to the length for that term.

There were also more subtle optimisations, such as the use of the
bitwise operator to check for an odd number, which did give a very
slight but ultimately perceptible speed advantage at the scale of the
problem. Commonly, checking for an odd (or even) number is done using
modulo arithmetic, like this:

```javascript
isOdd = x => x % 2 !== 0
```


(i.e. x is odd if the remainder of x / 2 is not zero)

But there's the bitwise AND operator that was used by some:

```javascript
isOdd = x => x & 1
```

(i.e. x is odd if x, when AND-ed with 1 (binary 00000001) gives a
non-zero value (i.e. 1))

## Use of libraries

For the most part, the submissions were independent of any external (3rd
party) library. JavaScript, esp. in the Node.js flavour, has a
cornucopia of libraries that can be used to good effect (although
[sometimes](https://qz.com/646467/how-one-programmer-broke-the-internet-by-deleting-a-tiny-piece-of-code/)
this is not so much the case, but that's a story for another time!)

We did see a small amount of library use, for example the
[mathjs](https://mathjs.org/) library (which offers a max function,
amongst other things), [yosay](https://www.npmjs.com/package/yosay), for
making output a little more fun, and [Ramda](https://ramdajs.com/), a
functional programming library offering a rich set of functions. Indeed,
we had one or two submissions that were "Ramda-oriented", which
delighted me no end.

## Lack of range

One thing that was clear, and common, was that many of you came across
the issue that there's no native
'[range](https://www.geeksforgeeks.org/python-range-function/)'
function in JavaScript - to generate a range of numbers in a simple way.
Of course, there's the more procedural 'for loop' approach, but for
those wanting to level up and move away from telling the machine how to
do something it should already know, you came up with a lovely, err,
array of approaches. See if you can spot them all in the submissions.

## Out of bounds

There were a couple of submission that didn't quite conform to the
submission
[requirements](/blog/posts/2020/04/27/sap-community-coding-challenge-nr.2/#requirements)
but we thought they were fun and creative nonetheless (and accompanied a
proper submission, which made things OK :-)).

There were also some submissions that sadly didn't produce the correct
result; the most common issue was a focus on the initial example in the
[problem
statement](/blog/posts/2020/04/27/sap-community-coding-challenge-nr.2/#problem),
rather than the question itself.

## The submissions

So without further ado, here is the complete list (in no particular
order) of successful submissions. Take a look at your fellow community
members' submissions and see how they coded their solutions - I for one
really enjoyed studying all of them. There are some really thoughtful
and educational pieces in this collection. Thank you all.

Contestant|Submission
-|-
alexander_frank|<https://repl.it/@AlexMFrank/ccc2> (see also <https://answers.sap.com/articles/13036691/ccc2-my-runtime-optimized-and-hopefully-readable-s.html>)
heikobernhart|<https://repl.it/repls/ScornfulMicroWebpage>
olivierh|<https://repl.it/@djgalak/SAPCommunityCodeChallenge02>
altheis|<https://jsfiddle.net/3vwt4gzu/10/>
antonio_vaz|<https://repl.it/repls/GrowlingUniqueReality>
deepakt5|<https://jsfiddle.net/Gunner708/qds20ern/>
juzerali|<https://jsfiddle.net/j9ktxmws/>
markjans|<https://jsfiddle.net/hwoy0dzk/>
rikus.vanvuuren2|<https://repl.it/@rikusv/LongestCollatzSequence>
sergei.haller.u-niq|<https://repl.it/@bistrOmath/CCC2-Compute-Manually> (see also <https://answers.sap.com/articles/13035066/ccc2-two-completely-different-approaches-for-solvi.html>)
christian.drumm|<https://repl.it/@ceedee666/SAP-Community-Code-Challange-2-1>
ffad982802c345bdb6e7377a267f27ce|<https://answers.sap.com/articles/13035919/ccc2-solving-the-longest-collatz-sequence-problem.html> (using SAP Data Intelligence)
8d8214c7f9734f45be69f95cc0d5aeee|<https://jsfiddle.net/k5uomf1e/>
graczpaw|<https://runkit.com/smentek/sap-community-coding-challenge-nr.2>
mbartsch71ch|<https://repl.it/@mbartsch71/ACC2>
moritz\_|<https://repl.it/repls/FlawedEllipticalPixels> (see also <https://github.com/MoritzLaut/SAP-Community-Coding-Challenge>)
santoskleber|<https://jsfiddle.net/cyk30nx7/1/>
christian.drumm|<https://repl.it/@ceedee666/SAP-Community-Code-Challange-2-2>
christian.drumm|<https://repl.it/@ceedee666/SAP-Community-Code-Challange-2-3>
deepakt5|<https://answers.sap.com/articles/13038623/ccc2-my-approach-for-challenge-no-2-as-a-ui5-devel.html>
siva.pabbaraju|<https://plnkr.co/plunk/soCuCWNdD8lZLRzm>
vinay.s6|<https://repl.it/@vinays66/Challenge2Collatz>
deepakt5|<https://jsfiddle.net/Gunner708/5aL8nexd/>
7a519509aed84a2c9e6f627841825b5a|<https://repl.it/repls/TemptingInstructiveForce>
alessandro.spadoni|<https://repl.it/@AlessandroSpado/SAPCommunityChallenge2>
gaurav.chaudhary4|<https://codepen.io/zgaur/pen/YzyEVqQ>
jyothiraditya.k|<https://repl.it/@kjyothiraditya/AwkwardZealousCodeview>
vinita.kasliwal|<https://jsfiddle.net/j901qpdm/>
sumit.kundu2|<https://repl.it/@SumitKundu/Collatz>
31a8856c1f6f4bcfa7f3d890a0b88fd2|<https://repl.it/@D023604/SiennaWateryProspect>
jcsnova|<https://jsfiddle.net/41toLzu9/>
carlos.lpezvzquez|<https://jsfiddle.net/Lpw614aq/18/>
raulruizgomez|<https://repl.it/@raulruiz4/Challenge-Version3>
huseyin.dereli|<https://sccc2.glitch.me/>
raulruizgomez|<https://repl.it/@raulruiz4/Challenge-Version5>
ajitkpanda|<https://jsfiddle.net/Ajit_Kumar_Panda/aetuw5L0/6/> (see also <https://answers.sap.com/articles/13043696/ccc2-project-euler14-longest-collatz-sequence-solu.html>)
jaime.rolo|<https://jsfiddle.net/rj4q2ude/>
pjl|<https://jsfiddle.net/hapejot/5etnfczs/>
mail2guptar51|<https://answers.sap.com/articles/13047125/ccc2-longest-collatz-euler-14-solution-using-recur.html>
michael.zwick1|<https://jsfiddle.net/m2rt1d4e/>
r.rodrigues|<https://answers.sap.com/articles/13045764/ccc2-longest-collatz-sequence-problem.html>
thalesvb|<https://repl.it/@thalesvb/Collatz-Functional>
thalesvb|<https://repl.it/@thalesvb/Collatz-MultiImpl>
alexander.kr|<https://repl.it/@karpovas1505/ExcitingFrenchBoastmachine>
alfonso.carlos.tello.mora|<https://jsfiddle.net/alfonsotellomora/7hz3vr1g/1/>
andreas.muenster.wienit|<https://repl.it/@andreasmuenster/SapCodingChallenge2>
bmckeany|<https://jsfiddle.net/bmckeany/0ev53jzr/2/>
carlosfortes94|<https://jsfiddle.net/59vk0Lxa/1/>
dominik.bigl2|<https://repl.it/@bigld/SAPCCC2>
flavio.ciotola3|<https://repl.it/@flaviociotola/CollatzSequence>
kevin_hu|<https://repl.it/@whocann/CollatzProblem>
lauralopezburgos|<https://repl.it/@shokimc/Js>
mateuszadamus|<https://jsfiddle.net/0a74ecf6/> (see also <http://mateuszadamus.pl/sap/sap-community-coding-challenge-nr.2.html>)
miguelfiuza|<https://repl.it/repls/KnobbyGiantToolbox> (see also <https://answers.sap.com/articles/13048142/ccc2-getting-the-longest-collatz-sequence-from-one.html>)
murbani|<https://repl.it/@marcellourbani/longestCollatzimmutable#index.js>
murbani|<https://repl.it/@marcellourbani/longestCollatzfastest#index.js>
murbani|<https://answers.sap.com/articles/13048264/ccc2-longest-collatz-euler-14.html>
olmoruiz|<https://jsfiddle.net/hqdpuo2g/7/>
rohit.singhal|<https://jsfiddle.net/rohit_rahi/ej4dv7no/33/>
94mts|<https://answers.sap.com/articles/13047029/ccc2-the-longest-collatz-sequence-solution.html>
clippersys|<https://js.do/clippersys/439087>
clippersys|[OO_SAPCommunityCodingChallengeNr2_20200514](http://clippersys.eu/SAPcc2/OO_SAPCommunityCodingChallengeNr2_20200514.js)
kadir.g|<https://repl.it/@kadirozgur/LongestCollatzSequence>
maheshkumar.palavalli|<https://repl.it/@MaheshKumarKum3/ccc2-2>
manjanbail|<https://repl.it/@NishchalManjanb/map-approach>
manjanbail|<https://repl.it/@NishchalManjanb/cached-collatz>
manjanbail|<https://repl.it/@NishchalManjanb/Basic-Collatz-Soln> (see also <https://answers.sap.com/articles/13049099/ccc2-different-approaches-and-ideas-for-solving-lo.html>)
megges|<https://jsfiddle.net/megges/bvu8choa>
monalisa.biswal|<https://jsbin.com/kogolot/edit?html,console,output>
pacheco_labs|<https://repl.it/join/rpsvffuv-jesuspacheco>
senthil.kumar37|<https://answers.sap.com/articles/13049204/ccc2-longest-collatz-sequence-challange.html>
tom.demuyt|<https://jsfiddle.net/konijn_gmail_com/jgv1xLyo/>

Congratulations to everyone!|

## Appendix - Performance testing

For those interested, I loaded all the submissions that I could into a
local project, and ran them through a little script to get a rough idea
of the throughput. For some of the submissions that presented the output
in HTML, I had to make minor modifications to allow them to be executed
directly in Node.js at the command line, but other than that, I ran the
scripts unaltered.

I used [hyperfine](https://github.com/sharkdp/hyperfine), a command line
benchmarking tool, which worked really well for me. I wrapped it in a
script for convenience. Here's a screenshot of the tool in action \--
showing an entry that was outside of the allowed submissions 😉 \-- and
the wrapper script itself. Share & enjoy!

![](/images/2020/06/Screenshot-2020-06-08-at-08.57.50.png)

```shell
#!/usr/bin/env bash

# Performance tests
# Run as either 'perftest' (and pick a submission) or 'perftestall' (via the symlink) to process all of them.
# Uses 'hyperfine' with a single run as warmup, and the average taken from 10 (the default) runs.

subdir=submissions

heading() { figlet -w $(tput cols) $@ | lolcat; }
pick() { ls -1 ${subdir} | fzf; }

if [ $(basename $0) = "perftestall" ]
then
  candidatelist=$(ls -1 ${subdir})
else
  candidatelist=${1:-$(pick)}
fi

for sub in ${candidatelist}
do
  heading ${sub} 
  && hyperfine --time-unit millisecond --warmup 1 "node ${subdir}/${sub}/index"
done
```

---

[Originally published on SAP Community](https://community.sap.com/t5/welcome-corner-blog-posts/sap-community-coding-challenge-2-contestants/ba-p/13453992)
