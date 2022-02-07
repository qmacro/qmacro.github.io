---
layout: post
category: homelab
title: Starting out with Raspberry Pi experiments
---

_This post provides some background to why I've started to experiment with Raspberry Pis, and to list the hardware components that I bought and set up with my son Joseph over the Christmas holidays._

This is a post in the "[Brambleweeny Cluster Experiments](/2020/03/22/brambleweeny-cluster-experiments/)" series of blog posts, which accompanies the [YouTube live stream recording playlist](https://www.youtube.com/playlist?list=PLfctWmgNyOIf9rXaZp9RSM2YVxAPGGthe) of the same name.

Next post in this series: [Preparing the OS image](/2020/03/22/preparing-the-os-image/)

I've been skirting around the edges of experimentation with Raspberry Pis, to learn about clustering and containerisation using such technologies as Docker and Kubernetes. The topic area is fascinating in and of itself, but I think it's an important collection of subjects that one should know about in the SAP tech world too, given the cloud direction we're taking and how resources, services and applications are managed there.

I haven't gone too deep yet, having paused the project over the first couple of months of 2020 - I think one of the things holding me back was that I had stumbled my way through things at the start and wanted to hold off going further before I'd understood things a little more.

Here's a photo of the cluster that we built.

![The cluster of Pis]( {{ "/img/2020/03/picluster.png" | url }})

I know that writing about my activities helps my understanding, and so I thought I'd set out to write some posts about what I'm doing. As a bonus, they might help you too.

I've been learning a lot from two folks in particular, both of whom I came across, independently, from recordings of talks I saw them give.

<img align="right" src="/content/images/2020/03/jeff.jpeg" />

[Jeff Geerling](https://jeffgeerling.com) gave a talk at DrupalCon in 2019 called [Everything I know about Kubernetes I learned from a cluster of Raspberry Pis](https://www.jeffgeerling.com/blog/2019/everything-i-know-about-kubernetes-i-learned-cluster-raspberry-pis), which inspired me to put together my own cluster of Raspberry Pis. Clusters of Raspberry Pis are called brambles, which I think is a nice touch. Jeff named his cluster a Dramble, owing to the use of Drupal on it, and has some great resources at [pidramble.com](https://www.pidramble.com/). Moreover, I've been learning about Ansible from Jeff too, generally but also specifically for setting up the Pis. I even bought his book [Ansible for Kubernetes](https://www.jeffgeerling.com/project/ansible-kubernetes) which I can definitely recommend.

Jeff documented his hardware setup over on the PiDramble site, and in particular I went for a version of his [2019 Edition](https://www.pidramble.com/wiki/hardware/pis) which was to use power-over-ethernet (PoE) rather than running individual power cables to each Pi.

<img align="right" src="/content/images/2020/03/alex.jpeg" />

[Alex Ellis](https://www.alexellis.io/) has been doing some fascinating work in this space and sharing a ton of stuff on Kubernetes, serverless and in particular on [OpenFaaS](https://www.openfaas.com/) which he set up and runs as an open project. He's also a prolific writer and sharer, and I recommend you bookmark a few of his [articles](https://blog.alexellis.io/) which are rich in content and inspiration. I saw a recording of a talk he gave with [Scott Hanselman](https://www.hanselman.com/) at NDC London in 2018: [Building a Raspberry Pi Kubernetes Cluster and running .NET Core](https://www.youtube.com/watch?v=ZyTLMnzehyU), which is definitely worth a watch.

To set my cluster up, here's what I ended up buying:

- [Raspberry Pi 4 (4GB RAM version)](https://shop.pimoroni.com/products/raspberry-pi-4?variant=29157087445075) x 4
- [Raspberry Pi PoE HAT](https://shop.pimoroni.com/products/raspberry-pi-poe-hat) x 4
- [Samsung EVO Plus 32GB microSDHC memory card with adapter](https://www.amazon.co.uk/gp/product/B06XFSZGCC/) x 4
- Short (25cm) CAT6 Ethernet cables x 4
- [Techson 4 Layers Clear Acrylic Rack Case](https://www.amazon.co.uk/gp/product/B07TLSVTQP)
- [NETGEAR 5-Port Gigabit Ethernet PoE Switch](https://www.amazon.co.uk/gp/product/B072BDGQR8/)

There are plenty of cases and mounting possibilities; just make sure, if you go for something different, that there's room for the PoE HAT mounted on top of each of the Pis.

I'm pleased with the result as there's a lot less cabling to deal with - it's just a single ethernet cable from the switch to each Pi, an ethernet cable from the switch to the main network, plus the power supply and cable to the switch, and that's it.

You can see this in the photo I took yesterday, which also shows an original Raspberry Pi Model B that I used as a console for various things.

![Pi collection]( {{ "/img/2020/03/picollection.png" | url }})

The setup is compact and I can keep it on a shelf behind my main desk. I'm somewhat averse to fan noise, which does mean that I don't run the cluster all the time, as there are fans on the PoE HATs that come on now and again. But the lights are pretty!

The next post I want to write is about how I set up the Pis ready for the cluster experiments, and what I learned. Until then, you might want to take a look at the recording of a live stream from earlier this month where I just went ahead and followed Alex's blog post [Walk-through — install Kubernetes to your Raspberry Pi in 15 minutes](https://medium.com/@alexellisuk/walk-through-install-kubernetes-to-your-raspberry-pi-in-15-minutes-84a8492dc95a). The key takeaway for me was that it was very easy.

The live stream was the first in what may turn out to be a series of cluster experiment live streams, so I've put the video into a playlist to help you find them.

The playlist is called [Brambleweeny Cluster Experiments](https://www.youtube.com/playlist?list=PLfctWmgNyOIf9rXaZp9RSM2YVxAPGGthe), where the name "Brambleweeny" is a conflation of the "Bramble" name for a Pi cluster, and the name of a computer in the Hitch Hiker's Guide To The Galaxy, the "[Bambleweeny 57 Submeson Brain](https://hitchhikers.fandom.com/wiki/Bambleweeny_57_Submeson_Brain)".

[![screenshot from live stream recording]( {{ "/img/2020/03/video.png)](https://www.youtube.com/watch?v=ZiR3QEfBivk&list=PLfctWmgNyOIf9rXaZp9RSM2YVxAPGGthe" | url }})

Until next time, happy clustering!

Next post in this series: [Preparing the OS image](/2020/03/22/preparing-the-os-image/)


