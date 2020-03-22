---
layout: post
title: Preparing the OS image
date: '2020-03-22 13:26:00'
---

_This post describes how I prepared the base OS image for each of the Raspberry Pis in my "Brambleweeny" cluster._

This is a post in the "[Brambleweeny Cluster Experiments](/2020/03/22/brambleweeny-cluster-experiments/)" series of blog posts, which accompanies the [YouTube live stream recording playlist](https://www.youtube.com/playlist?list=PLfctWmgNyOIf9rXaZp9RSM2YVxAPGGthe) of the same name.

There are many ways to prepare base OS images for your Raspberry Pi computers. In the past I've used various devices and software to write bootable images to SD cards, but I've settled on using [balena Etcher](https://www.balena.io/etcher/) that I read about in Alex Ellis's [Walk-through — install Kubernetes to your Raspberry Pi in 15 minutes](https://medium.com/@alexellisuk/walk-through-install-kubernetes-to-your-raspberry-pi-in-15-minutes-84a8492dc95a).

The Pis in the cluster will be run headless (the only cable running to each of them will be an Ethernet cable). This has a couple of implications for us at this stage, which are (a) there's no point installing graphical tools or a full desktop, and (b) we'll be using remote access only.

**No GUI**

There's no point in installing a graphical user interface (GUI) or windowing system on the Pis. That said, of course, with the power of X Windows we can have remote GUI windows but that's another story and a path we don't want to take for now.

There are different distributions of Linux for the Raspberry Pi, and at the time of writing, [Raspbian Buster](https://www.raspberrypi.org/downloads/raspbian/), a Raspberry Pi take on Debian's Buster release, is the latest available. Here, the "Lite" image, that comes without GUI software or a windowing system, is appropriate. This is convenient as the image is a lot smaller in size, too.

![Raspbian Buster Lite](/content/images/2020/03/busterlite.png)

**Remote access**

To access the headless Pis remotely, we'll be using Secure Shell (SSH). There's a bit of a chicken-and-egg problem though, in that we need to be able to configure the Pis to allow remote access via SSH, before we can make the connection. For that we'd need a keyboard and screen, to be able to log on, install and set up the SSH service.

However, headless use of Raspberry Pi computers is so common that there's a nice way to solve this dilemma, and it's described in the official documentation, in a section on [the boot folder](https://www.raspberrypi.org/documentation/configuration/boot_folder.md). Basically, the OS image that is to be written to the SD card for installation on the Pis has a partition named `boot`. If you stick an SD card with a Linux image like Raspian Buster on it into your desktop computer or laptop, and automatic mounting is enabled, you'll see this boot partition mounted, and you can have a look inside.

If you place a file called `ssh` in this boot partition, then when the image is inserted into a Pi and the Pi is booted, SSH will be enabled automatically and set up appropriately. Nice!

**The preparation**

Most of the articles on the preparation of SD cards for Pis involve multiple steps: first, burn the OS image, then eject and re-insert the SD card to have the `boot` partition from that new image automatically mounted, then create the `ssh` file in that partition, and finally unmount the partition. This is fine for the occasional SD card preparation, but when preparing SD cards for an entire cluster, this can get tedious.

So I decided to embrace one of the [three virtues](http://threevirtues.com/) of a programmer, namely laziness.

After downloading the Raspbian Buster Lite image, I unzipped the archive to reveal the actual image file, which I then mounted. In the mounted partition, I added the `ssh` file, before unmounting it again. I then zipped the now-SSH-enabled image file up again, ready for writing to the SD cards.

On my macOS machine (which is one of the few devices I have that has an SD card slot), I unzipped the archive like this:

```shell
-> unzip 2020-02-13-raspbian-buster-lite.zip
Archive:  2020-02-13-raspbian-buster-lite.zip
  inflating: 2020-02-13-raspbian-buster-lite.img
->
```

Then I used the DiskImageMounter utility to mount the `.img` image file, which was then, according to `df`, available at `/Volumes/boot`:

```shell
-> df
Filesystem    512-blocks      Used Available Capacity iused               ifree %iused  Mounted on
/dev/disk1s1   489825072 293524872 188654632    61%  802354 9223372036853973453    0%   /
devfs                380       380         0   100%     658                   0  100%   /dev
/dev/disk1s4   489825072   6291496 188654632     4%       3 9223372036854775804    0%   /private/var/vm
map -hosts             0         0         0   100%       0                   0  100%   /net
map auto_home          0         0         0   100%       0                   0  100%   /home
/dev/disk3s1      516190    106927    409263    21%       0                   0  100%   /Volumes/boot
```

I could then add an empty `ssh` file to that partition:

```shell
-> touch /Volumes/boot/ssh
```

After that, I unmounted the partition:

```shell
-> umount /Volumes/boot
```

And then created a new zip archive:

```shell
-> zip raspbian-buster-lite-ssh.zip 2020-02-13-raspbian-buster-lite.img
  adding: 2020-02-13-raspbian-buster-lite.img (deflated 75%)
->
```

I could then use this new image archive file `raspbian-buster-lite-ssh.zip` in my use of balena Etcher, creating all four SD cards ready for the Pis in the cluster. Result!

![balena Etcher](/content/images/2020/03/etcher.png)

> You may be wondering why there's no Raspbian image available that already contains the `ssh` file. That's because it would be a security risk; in other words, you have to explicitly enable SSH through this route if you want it; otherwise, the Pis stay locked down. That's the right approach.

After inserting the SD cards into the Raspberry Pis, and connecting up the Ethernet cables to power them up and have them boot the images for the first time, we can see that this SSH action was successful:

```
-> ssh 192.168.86.53
The authenticity of host '192.168.86.53 (192.168.86.53)' can't be established.
ECDSA key fingerprint is SHA256:jFgPSwjEQsCSUx+nJcZ6ub9EhoGC1I1vSX5uSvVc1YE.
Are you sure you want to continue connecting (yes/no)?
```

In the next post, we'll find out how I discovered the IP address(es) to use to connect, but for now, this is a great start - the SSH service responded to my request to connect (the "authenticity" message is just my machine saying "hey, I don't recognise this remote host - are you sure you want to proceed?").

Share & enjoy!
