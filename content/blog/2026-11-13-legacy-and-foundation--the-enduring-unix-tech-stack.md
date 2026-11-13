---
title: Legacy and foundation - the enduring Unix tech stack
date: 2026-11-13
description: Musing on how the Unix technologies endure and remain the foundation for much of today's tech.
tags:
  - shell
  - tools
  - unix
  - agents
  - legacy
---

The word "legacy" is wielded by various folks, and in many cases it's in a
pejorative sense. I don't think they always appreciate the full context.

![The meme from The Princess Bride, with a picture of the character Inigo
Montoya, with the following text superimposed: "You keep using that word. I do
not think it means what you think it
means"](/images/2026/11/you-keep-using-that-word.png)

Consider aspects of the enduring Unix legacy that our tech stacks still rely on
today. Beyond such fundamental building blocks and concepts such as environment
variables, which even now make the cloud work (service keys and bindings are
made available to apps that way), we are embracing the terminal as the natural
best fit for human-agent interaction.

And while collaborating with agents, we see that the constructs they employ to
Get Things Done ... are command line tools in the context of the
shell[<sup>1</sup>](#footnotes), strung together in classic pipelines. While
we still work in a predominantly text-based world, this is a natural fit.

> As a nod to this, I snuck a one-liner into one of our tutorials for SAP
> TechEd 2026 in Berlin: [Connect a CAP-level agent to AI
> Core](https://developers.sap.com/tutorials/cap-connect-agent-to-llm). A step
> in this tutorial involved retrieving a specific ZIP file from a GitHub repo,
> unpacking it, formatting the JSON that was contained within into a single
> bite-sized chunk, and assigning it as a value for an environment variable.
>
> As well as providing the step-by-step manual instructions, I couldn't resist
> providing a one-shot shell incantation:
>
> ```shell
> d=$(mktemp -d -p /tmp/) \
>   && git clone --quiet https://github.com/SAP-samples/teched2026-sk-gen "$d" \
>   && find "$d/keys/" -name 'sk-*.zip' \
>   | sort -n -t- -k2 \
>     | tail -1 \
>     | xargs unzip -o \
>   && export AICORE_SERVICE_KEY="$(jq -c . sk.json)"
> ```

[The future is
terminal](https://www.google.com/search?q=dj+adams+%22%23thefutureisterminal%22),
indeed!

I was reminded of all this while catching up with Jon Udell's archive of posts,
one of which is [“What is the
terminal?”](https://blog.jonudell.net/2026/07/01/what-is-the-terminal/),
wherein he draws a stark contrast between (non-developer) folks who don't even
really know what a terminal is, and how we developers and our agents remain
steeped in the glory that is the command line. Heck, I know some folks who have
traditionally chosen IDEs over command lines and editors, but have recently
pivoted to the terminal to embrace TUI based agent harnesses like Claude Code and
OpenCode.

I couldn't help smile at the story that Jon used to start the post, a story
about another one of my heroes[<sup>2</sup>](#footnotes) [Larry
Wall](https://en.wikipedia.org/wiki/Larry_Wall) - who had been unable
to get the Windows-based machine on the speaker podium to behave. The story reminded
me I should dig out this t-shirt, and wear it more.

![Me wearing my "Does not work on windows"
t-shirt](/images/2026/11/does-not-work-on-windows-t-shirt.jpg)

## Footnotes

1. And I'm happy to note that Bash seems to be still the most popular.

1. I used to attend and indeed speak at The Perl Conference, and was a member
   of [London Perl Mongers](https://londonperl.org/) back in the day.
