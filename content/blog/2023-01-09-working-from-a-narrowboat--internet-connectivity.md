---
title: Working from a narrowboat - Internet connectivity
date: 2023-01-09
tags:
  - life
  - narrowboat
  - fullyrestful
  - connectivity
  - raspberrypi
---

Previous post in this series: [I'm moving onto a narrowboat](/blog/posts/2023/01/02/i'm-moving-onto-a-narrowboat/).

---

Since publishing the first post about my plans to live on and work from a narrowboat (see [I'm moving onto a narrowboat](/blog/posts/2023/01/02/i'm-moving-onto-a-narrowboat/)), I've had some lovely comments and some great questions, thank you. One which came up a lot both on Twitter, from folks like [Maffi](https://twitter.com/OfMaffi/status/1610428180908888065), [Joel](https://twitter.com/JBY35/status/1609984376799956994) and [Sacha](https://twitter.com/sufw/status/1609909407562993666), and elsewhere, is: How do I get Internet connectivity? I'll try to answer that question in this post. 

I work as a Developer Advocate for SAP, and am in the very fortunate position to work remotely. I've worked remotely (i.e. from home) for many, many years, for different companies; in fact, on reflection, my working life has been a balance of two extremes: the constant weekly travel of a contractor / consultant (there was a "peak" period of 7 years where I flew at least twice a week, and sometimes four times a week, every week, to different clients), and the calm and travel-free context of working from home. 

I don't miss the travel at all. Not one bit. I've seen enough airports and economy airplane seats to last more than a lifetime. 

![My desk setup at home](/images/2023/01/desk.png)

Anyway, pretty much any remote work requires an Internet connection. So when I'm on the narrowboat, I'll need one too. While cable or FTTP is appealing, I don't think there's a cable long enough to make things work as I navigate the canal networks. So the solution needs to be a little more mobile than that. 

I did a lot of research, and ended up going for a 4G/5G mobile data based solution. I've actually been using this solution for a while already, I'll explain shortly. Here's what that solution looks like. 

## Data provider

First, I had to decide upon a provider for the 4G/5G mobile data connection. Reading the narrowboating forums and speaking to folks on the cut, the general consensus seemed to come down to a choice between a handful of providers (here in the UK): [Three](https://www.three.co.uk), [EE](https://ee.co.uk) and [Vodafone](https://www.vodafone.co.uk/). Each offer a broadband solution based on mobile data. All offer both 4G and 5G based options. 

After considering all of them, I opted for Vodafone. Specifically, I went for their [Data only SIM](https://www.vodafone.co.uk/data-only-sim) offering, specifically the unlimited data version. This offering includes the "fastest available" speed option, which basically means 5G as well as 4G. 

There are plenty of articles out there that show comparisons between 4G and 5G ([such as this one](https://www.tomsguide.com/features/5g-vs-4g)), some showing 2X speed increases, other showing a 6X speed increase, but the bottom line was that reaching the 5G speed nirvana for me is currently less of a critical matter, for these reasons:

* 4G speeds are plenty fast enough for remote work, as I'll show below
* 5G equipment is still extremely expensive, when compared to the equivalent devices only capable of supporting 4G

Moreover, the rollout of the 5G mast network in the UK is not complete, certainly not in rural areas, whereas 4G coverage is pretty good. So striving for the ultimate Mbps values would not be worth the effort and expense, at least right now.

That said, I wasn't going to shy away from the fact that Vodafone's offering includes 5G, because then as soon as the prices for 5G devices come down, I'm ready.

When doing the deal with Vodafone, they offered me a 6 months discount, and I've effectively ended up with a 2 year contract where I'm paying around GBP 25.00 per month for all the data I can eat, at the maximum speed I can consume. Compared with my previous FTTP deal with BT (which of course is fibre and extremely fast, but I was paying a *lot* more), I decided I was happy to pay that amount.

## Equipment

There are two pieces of equipment that I purchased.

### Router

I opted for a pretty straightforward 4G+/LTE router, from Huawei. There are plenty of these about, and this one was a refurbished one, from Amazon, specifically the [HUAWEI Unlocked Huawei B535-333 Soyealink, CAT7 400mbps 4G+ /LTE Home/Office Router, 1 x RJ11 Tel Port, Includes 2 x External Antennas, Supports VoIP - White (Renewed)](https://www.amazon.co.uk/gp/product/B09J94GLN3). There were a few essential aspects that this device had, which satisfied my requirements:

* price: less than GBP 100.00 (it's currently selling for less than GBP 70.00, I think I picked mine up for around that price)
* ports: four Ethernet ports on the rear for wired device connectivity
* signal: it has SMA connectors behind a panel at the rear, for connecting external antennae
* SIM slot: it takes a micro SIM card which it will use for Internet connectivity

> Yes, as a Latin scholar, I'm using "antennae" as the plural of "antenna".

This is not the highest quality router I've had, but it does the job. It works, the UI is serviceable, I can configure it how I want, mostly (trying to set a custom DNS server in the DHCP settings fails consistently, for example). It's not forever; as soon as similar devices that are 5G capable come out, at a more reasonable price, I'll get one of those, to enjoy higher speeds, but for now, this is fine.

From the perspective of receiving a signal, there are three options, in increasing effectiveness:

* use the router as-is, with no external antennae attached
* use a pair of small (approximately 10cm long) external antennae which came with it (they're colloquially referred to as bunny ears as you can see from the picture below)
* connect external (outdoor) antennae

Given that a narrowboat is a long steel tube, an external antenna solution was going to be essential to enjoy the best speeds. A lot of outdoor antenna equipment uses [SMA connectors](https://en.wikipedia.org/wiki/SMA_connector) and this is why such connectors were essential on the router I went for. While I'd likely get a 4G signal just from the router-internal antenna alone, it would be pretty weak and unreliable. Even adding the small bunny ears wouldn't make much difference (from what I've read on the forums). 

So an external outdoor antenna solution, mounted on the narrowboat roof, was what I needed. 

### External outdoor antennae

Roof-mounted antennae would not be subject to the constraints that antennae within the narrowboat would have. Choosing the right type was important, all the same. Some antennae are directional, meaning that to get the optimum signal reception, they need to be oriented and reoriented, to point to the nearest mast. If done properly and consistently, this works well, and directional antennae are often what are mounted on houses. Houses don't move, though, which means that once the orientation is done, the antennae can be left to function. 

Narrowboats move. Adjusting the antennae on a narrowboat roof for every new location would get tiresome quickly. Luckily there are omnidirectional solutions, such as the [Poynting 4G-XPOL-A0001 Cross Polarised 4G Omni LTE Antenna](https://www.amazon.co.uk/Poynting-4G-XPOL-A0001-Cross-Polarised-Antenna/dp/B00C1DGFPS/). 

![the 4G XPOL-A0001 antenna](/images/2023/01/xpol-4g.jpg)

These are a common sight, mounted atop narrowboats on short (approx 40cm) vertical poles which have round magnetised bases, and the cables are fed down through into the cabin where they can be then attached to the back of the router. The reason for the magnetised bases is that if you navigate into a super low tunnel or under a very low bridge, and forget to clear the narrowboat roof beforehand, the antennae device and pole will simply be knocked over and rest on the roof, rather than sustain more significant damaged. 

As the name of this one suggests, it is good for 4G bands; the frequency range supported is stated as being 790~960, 1710~2170, 2300~2400 and 2500~2700 MHz.

For only a few quid more, the [Poynting XPOL-1 V2 5G 3dBi Omni-Directional Cross Polarised LTE 2x2 MIMO Outdoor Antenna](https://www.amazon.co.uk/gp/product/B08F4S4DMN/) provides the same function and covers the same frequency ranges as the 4G XPOL-A0001, but also covers the 5G frequency range (3400~3800 MHz). 

So I went for this 5G version, meaning that the only component in the solution that wasn't 5G-ready or capable was the router, which I would replace when the prices drop. Here's what this XPOL-1 V2 5G antenna looks like - it's a similar size to the 4G-XPOL-A0001 and is mounted on the pole in the same way:

![the XPOL-1 V2 5G antenna](/images/2023/01/xpol-5g.jpg)

## Soak testing

I'm currently living in a rented cottage, and have been "soak testing" this very setup for the past 6 months. It's been my only connection to the Internet. It's been great, and I'm more than happy with it. 

I've been consistently getting anywhere between 10Mbps and 25Mbps (both down and up). Yes, many of my friends and colleagues are using FTTP these days and revelling in three-figure Mbps readings. But honestly, the speeds I'm getting work fine. More than fine. I've been live streaming on our [Hands-on SAP Dev](https://www.youtube.com/playlist?list=PL6RpkC85SLQABOpzhd7WI-hMpy99PxUo0) show, I've been in more Teams and Zoom based video conferences than you can shake a stick at, I watch YouTube and Amazon Prime movies in the evening on my Google TV dongle, and stream music from YouTube Music during the day too. 

When I've prepared an item for our [SAP Developer News](https://www.youtube.com/playlist?list=PL6RpkC85SLQAVBSQXN9522_1jNvPavBgg) show, where we first upload everything to a central server before editing everything together, I've had no problems either. 

In short, the solution met and kept up with my Internet connectivity requirements for work and play since day one. 

Here's a picture showing my current setup here in the cottage:

![The router and external antenna](/images/2023/01/router-antenna-setup.jpg)

In the picture you can also see the "bunny ears" antennae on the windowsill, now redundant. You can also see the three LED lights on the right of the router showing a "full" signal. The external antennae device is secured to the window pane with suckers that came with it. The external antennae device is secured to the window pane with suckers that came with it.

(Since I took that picture, in the summer of 2022, I've moved the router to a shelf below the windowsill, where I also now have a Raspberry Pi connected to one of the ethernet ports. I'll cover that in a future post). 

## Setup in the narrowboat

In designing the internal layout, working with Mark to achieve the optimum use of space, we ended up with an office area towards the centre of the cabin, which is the perfect size to fit my desk setup you saw near the start of this post. It's highlighted in red here (open the image in a new tab for better viewing):

![The office area on the narrowboat, highlighted in red](/images/2023/01/narrowboat-design-office.png)

> Each of the squares in the narrowboat design image represents 1 square foot (30 cm square). 

I've also highlighted in red where the router will be placed, which is in the electrics cupboard marked "16" near the stern, and where I'll have ethernet ports running from the back of the router: one behind the TV in the saloon (marked "22"), a couple in the office, and one in the bedroom, near the bow, on the shelves marked "56". 
Wired connections in general are better than wireless, and for the main devices in the narrowboat this makes a lot of sense. 

In case you're wondering, the ethernet port in bedroom will be for Raspberry Pi based experiments. I may run a separate switch to the router so that I can provide power-over-ethernet (PoE) along these cables; I have [PoE hats](https://thepihut.com/products/raspberry-pi-poe-plus-hat) for my Pi devices.

## Mounting of the antennae on the roof

As I don't have my narrowboat yet, my friend Sarah very kindly sent me some pictures of her similar setup on narrowboat Bright Arrow so I could show you what it actually looks like.

Here you can see her 4G-XPOL-A0001 and how it sits on the roof on the pole with that magnetised base:

![The antennae setup on Bright Arrow's roof](/images/2023/01/bright-arrow-xpol-4g-2.jpg)

In this one you can also see how the device is secured to the pole, and how the cables are fed into the cabin through sealed weatherproof connectors, the same ones that are used to feed in from the solar panels:

![The antenna setup, this time from behind, showing how the Poynting device is mounted to the pole](/images/2023/01/bright-arrow-xpol-4g-1.jpg)

---

Next post in this series: [Living on a narrowboat - embracing constraints](/blog/posts/2023/01/16/living-on-a-narrowboat-embracing-constraints/).
