---
layout: post
title: Creating the new Tech Aloud intro and outro music
date: 2024-11-16
tags:
  - techaloud
  - javascript
---
Today I revived my [Tech Aloud][1] podcast[<sup>1</sup>](#footnotes). Since the last time I published an episode, the infrastructure has changed, in that the Anchor FM platform I was using has been subsumed into Spotify. While in the longer term I want to move to my own podcast platform (perhaps [Castopod][3]), I wanted to get a new episode out, specifically a recording of my recent long-form blog post [Five reasons to use CAP][9].

Unfortunately, the simple recording tools in Anchor FM didn't exist any more. These tools included audio snippets to add as intro / outro material to episodes, which was nice. But without those, I had to find something new. So I decided to create my own, using a pentatonic step sequencer called [ToneMatrix][4], by Audiotool. The Web-based tool is a mesmerising experience and for folks like me interested in sequencers and the peace of order and structure, it's lovely to experiment with.

Here's an example sequence[<sup>2</sup>](#footnotes):

![A ToneMatrix 16x16 grid with a sequence encoded](/images/2024/11/tonematrix-glider.png)

I noticed that after creating a sequence, the sequence detail could be saved in a URL fragment with the "Copy Link" button, which was a nice touch. The [sequence above][5] is represented in the ToneMatrix player URL like this:

[https://tonematrix.audiotool.com/
#0.0.0.0.0.0.0.52i.pb4.dh7.0.0.0.0.0.0](https://tonematrix.audiotool.com/#0.0.0.0.0.0.0.52i.pb4.dh7.0.0.0.0.0.0)

Anyway, rather than create a random sequence, I decided to try to encode the podcast name "Tech Aloud" as the source to the sequence. This was based on the idea that if I could create a sequence and have that encoded in the URL, I could generate an encoding for a sequence based on some values of my own, and then combine that with the base URL to have the matrix pre-loaded with exactly that sequence.

Digging into the sources on the Web page, I found the [implementation][7] of the `Model` class, which holds a `Pattern` consisting of a 16 element `Uint32Array` to represent the pattern in the (16 x 16) matrix:

```javascript
constructor() {
  this.data = new Uint32Array(16)
}
```

There's a serialiser method that creates a URL fragment based on the pattern:

```javascript
serialize() {
  let r = [];
  for (let i = 0; i < 16; i++) {
    r.push(this.data[i].toString(32));
  }
  return r.join(".");
```

> The value in the `toString(32)` call is the radix, or base. Numeric values are converted into stringified numbers in Base 32 here.

The pattern shown in the matrix above would be serialised into the string:

```text
0.0.0.0.0.0.0.52i.pb4.dh7.0.0.0.0.0.0
```

There's also of course a deserialiser method:

```javascript
deserialize(code) {
  try {
    code.split(".")
      .map(c => parseInt(c, 32))
      .forEach((value, index) => this.data[index] = value);
  }
  catch (e) {
  }
}
```

This turns the string above back into values in the `Uint32Array`.

Putting all this together, and assuming (or hoping?) the 16 x 16 matrix was basically an array of 16 bit values, I created this function:

```javascript
const genfrag = (str, radix=32) => str
  .split('')
  .map(x => x
    .charCodeAt()
    .toString(radix)
  )
  .join('.')
```

Testing this with the string `ABC`, and the explicit radix of `10`, I confirmed that the output would be the ASCII values represented like this:

```javascript
genfrag('ABC', 10) // '65.66.67'
```

With the default radix value of `32`, as used in the serialiser, this representation is produced:

```javascript
genfrag('ABC') // '21.22.23`
```

> Yep, that's `65`, `66` and `67` in Base 32.

Now to feed that function the string `Tech Aloud ☕`. I added a coffee emoji here as I wanted a character whose numeric representation used more than 8 bits, so that I'd have at least some tones in the second half (the second set of 8 slots) of the sequence. And the [podcast's logo is a coffee cup][8], of course.

Here goes:

```javascript
genfrag('Tech Aloud ☕️') // '2k.35.33.38.10.21.3c.3f.3l.34.10.9gl.1vgf'
```

> The Unicode notation for the coffee emoji ☕ is `U+2615, U+FE0F`; alternatively, the decimal code points are `9749` and `65039` ... which are `9gl` and `1vgf` in Base 32.

Plugging this into a ToneMatrix URL gives this:

[https://tonematrix.audiotool.com/
#2k.35.33.38.10.21.3c.3f.3l.34.10.9gl.1vgf](https://tonematrix.audiotool.com/#2k.35.33.38.10.21.3c.3f.3l.34.10.9gl.1vgf)

which turns out to be a very pleasant sequence[<sup>3</sup>](#footnotes):

![Another ToneMatrix 16x16 grid with the "Tech Aloud ☕️" sequence encoded](/images/2024/11/tonematrix-tech-aloud.png)

> You can see the effect of the emoji values in the bottom lines here, where all 16 bits are used.

So that's what I'm using now as my intro and outro music for the Tech Aloud podcast episodes, starting with the first episode of series 2 - [Five reasons to use CAP][1]. Thanks Audiotool!

<a name="footnotes"></a>
## Footnotes

1. For some background to the podcast, see the post [New podcast - Tech Aloud][2].
2. Perhaps you recognised that each of the four "symbols" here are the four different generations of the classic [Glider][6] in Conway's Game Of Life.
3. The nature of the ToneMatrix sequencer is that it's difficult _not_ to produce something that sounds pleasant, to be honest.


[1]: https://creators.spotify.com/pod/show/tech-aloud/episodes/Five-reasons-to-use-CAP---DJ-Adams---07-Nov-2024-e2r2lth
[2]: /blog/posts/2019/09/17/new-podcast-tech-aloud/
[3]: https://castopod.org/
[4]: https://tonematrix.audiotool.com
[5]: https://tonematrix.audiotool.com/#0.0.0.0.0.0.0.52i.pb4.dh7.0.0.0.0.0.0
[6]: https://en.wikipedia.org/wiki/Glider_(Conway%27s_Game_of_Life)
[7]: https://tonematrix.audiotool.com/bin/tonematrix/model.js
[8]: /images/2019/09/tech-aloud.jpeg
[9]: /blog/posts/2024/11/07/five-reasons-to-use-cap/
