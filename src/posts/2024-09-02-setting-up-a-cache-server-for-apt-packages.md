---
layout: post
title: Setting up a cache server for apt packages
date: 2024-09-03
tags:
  - debian
  - cacheing
  - homeops
  - proxbox
  - chromebox
  - asus
  - narrowboat
  - apt-cacher-ng
  - tailscale
---
Some notes on setting up an `apt-cacher-ng` based cache server for Debian apt packages in my home operations ("homeops") context, including a section on using SSL/TLS origin servers.

## Background

Living on and working primarily from my [narrowboat][1] means I'm generally more mindful of what I consume, and the resources available to me. Water, electricity, gas, and fuel for the stove in the colder months. And while I have an "all you can eat" data contract with Vodafone for my [Internet connection][2], I'm still conscious of how much data I download over time.

As I dig deeper into the container world, both in [Docker][3] and [LXC/LXD](3) flavours, I'm often building images that are Debian based, and installing packages in those images is part of the process. I build and rebuild, meaning I'm using `apt-get` to fetch packages all the time. (I'm pulling down Docker images a lot too, but that's a post for another day). Recently it struck me that I could benefit from some sort of cacheing proxy to reduce the package data I'm pulling over my Internet connection.

This idea came about partly, I think, because I also recently moved from a Raspberry Pi 4 based server running Debian plus Docker engine with lots of containers for services such as Home Assistant, Mosquitto, Miniflux and so on ... to a repurposed (and now headless) Asus Chromebox now running Proxmox. The freedom to think a little bigger, or wider, that this has brought about, was surprising and unexpected. Now I can think about more formalised backup routines, and also use the extra level of machine abstraction to my advantage. The fact that I've moved back from an ARM64 based architecture to an AMD64 one is also of interest.

## Proxmox on my repurposed Asus Chromebox

My use of Proxmox right now is limited to running containers (CTs), rather than full-blown virtual machines (VMs), partly as I have no need of any VMs and partly to limit the load on the [Asus Chromebox][5] which has an Intel Core i5-8250U CPU with 8GB RAM and 128GB SSD (to which I've also attached an external [SanDisk 1TB SSD][6]).

I started out with just a single Debian 12 based CT called "docker", running Docker engine, to host the containers I was previously running on the Raspberry Pi based server. Thanks to Proxmox, I now have a proper backup routine -- both to the locally attached SanDisk SSD and to a volume on a remote Synology NAS -- for this CT and everything it encompasses (Docker volumes, images, and containers, etc).

But with my thinking turning to bandwidth consumption, and the main topic of this post, I created a second CT called "cacher", which is to be a central cacheing solution, of which the cacheing of Debian apt packages forms part.

You can see the two "lxc" type CTs in the Proxmox screenshot here (along with the SanDisk and Synology based storage resources in the Server View):

![A screenshot of the main Proxmox Web UI](/images/2024/09/proxmox.png)

Each of these CTs are Debian distribution based and [run two essential services][7]: Tailscale and Docker. In the "cacher" CT I set up the `apt-cacher-ng` service, and also run a Docker pull-through cacheing registry. I'll write about the latter in a future post. The rest of this post is about setting up and using `apt-cacher-ng`.

## Show-n-tell

To describe my journey into setting up and using [apt-cacher-ng][8] I'll create and use some throwaway containers on this Chromebook that I'm using as my main device right now. Like the containers on Proxmox, containers in the Crostini context on ChromeOS devices are LXC/LXD based, which is lovely.

> There's a couple of differences:
> 
> * Privileged vs unprivileged LXC containers: I run my LXC containers on Proxmox in [unprivileged][9] mode, which means that I need to add a couple of lines to the container config to give Tailscale the access that it needs. This is all described in the Tailscale article [Tailscale in LXC containers][10] and works well.
> * Tailscale and local DNS: I use Tailscale in my homeops context and the [MagicDNS][11] feature means that each and every container that I create (and install Tailscale in) can reach every other container on my [tailnet][12], which is great. In this Crostini based throwaway demo context I won't be installing Tailscale, mostly to avoid distractions from the main topic, but also because in the Crostini context, containers can reach each other by their names too.

I'll create one throwaway container to set up the `apt-cacher-ng` cache server. It is basically the same setup process that I used to create the real cache server on the "cacher" LXC container mentioned earlier, which I then point all the other Debian based containers that I might create and use (Docker and LXC based), with a single line of config, so that they become clients of the cache server. I'll therefore also create some further throwaway containers to demonstrate that client config.

### Setting up the server container

Creating the first container for the cache server is straightforward:

```shell
(termina) chronos@localhost ~ $ lxc launch images:debian/12 cacheserver
Creating cacheserver
Starting cacheserver
```

I can jump straight into the newly created container like this:

```shell
(termina) chronos@localhost ~ $ lxc exec cacheserver bash
root@cacheserver:~#
```

> For more on the `lxc` command, within the context of `termina`, and where the Debian 12 image is retrieved from these days, you might want to read this recent post: [New source for LXD images on Crostini][13].

### Installing and checking the cache server

While I do like to see everything as a nail, and run everything as Docker containers, I'm opting in this case to not do that. I'm already in the context of an LXC container anyway at this point. But again, that's a discussion for another time. To install the cache server, it's a simple invocation of `apt-get`, thus:

```shell
root@cacheserver:~# apt-get update && apt-get install -y apt-cacher-ng
```

There's a configuration point in this process, asking if I want to "allow HTTP tunnels through Apt-Cacher NG", to which I answered "no", which is the preferred answer for security reasons. I'll revisit this decision later on in this post, as you'll see.

The server is now installed as a service, and I can now check the status like this:

```shell
root@cacheserver:~# /etc/init.d/apt-cacher-ng status
● apt-cacher-ng.service - Apt-Cacher NG software download proxy
     Loaded: loaded (/lib/systemd/system/apt-cacher-ng.service; enabled; preset: enabled)
     Active: active (running) since Mon 2024-09-02 17:15:18 UTC; 13h ago
   Main PID: 755 (apt-cacher-ng)
      Tasks: 1 (limit: 4915)
     Memory: 2.4M
     CGroup: /system.slice/apt-cacher-ng.service
             └─755 /usr/sbin/apt-cacher-ng -c /etc/apt-cacher-ng ForeGround=1

Sep 02 17:15:18 cacheserver systemd[1]: Starting apt-cacher-ng.service - Apt-Cacher NG software download proxy...
Sep 02 17:15:18 cacheserver systemd[1]: Started apt-cacher-ng.service - Apt-Cacher NG software download proxy.
```

The status output shows a reference to a directory `/etc/apt-cacher-ng` which contains various configuration files, which I don't need to touch right now, but I can look inside `/etc/apt-cacher-ng/acng.conf` to find useful information, such as:

* the cache directory is `/var/cache/apt-cacher-ng`
* the log files will be in `/var/log/apt-cacher-ng`
* the default port that the server listens on is 3142

Indeed, I can see that here:

```shell
root@cacheserver:~# netstat -atn | grep LISTEN
tcp        0      0 127.0.0.54:53           0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:5355            0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:3142            0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN     
tcp6       0      0 :::5355                 :::*                    LISTEN     
tcp6       0      0 :::3142                 :::*                    LISTEN
```

(The other two ports here are related to name resolution services).

At this point there's nothing in the log yet, and nothing stored in the cache (obviously):

```shell
root@cacheserver:~# du -hs /var/cache/apt-cacher-ng/ && wc -l /var/log/apt-cacher-ng/apt-cacher.log 
0       /var/cache/apt-cacher-ng/
0 /var/log/apt-cacher-ng/apt-cacher.log
```

### Setting up a test cache client container

To make sure things work as expected, I can create another LXC container to act as a client:

```shell
(termina) chronos@localhost ~ $ lxc launch images:debian/12 cacheclient1 && lxc exec $_ bash
Creating cacheclient1
Starting cacheclient1
root@cacheclient1:~#
```

### Configuring the cache client

A single line is all that's needed for basic configuration to point to the cache server, and that goes in the `/etc/apt/apt.conf.d/` directory. There are already a couple of config files in this directory, with numeric order prefixes as is often found:

```shell
root@cacheclient1:~# ls /etc/apt/apt.conf.d/
01autoremove  70debconf
```

I can create a new file here called `00cacher`, adding the proxy pointer:

```shell
root@cacheclient1:~# echo 'Acquire::http::Proxy "http://cacheserver:3142";' \
  > /etc/apt/apt.conf.d/00cacher
```

And that's all I need to do, for basic package cacheing.

### Trying things out

First, I'll start with an update in this cache client container to retrieve package lists:

```shell
root@cacheclient1:~# apt-get update
Hit:1 http://deb.debian.org/debian bookworm InRelease
Get:2 http://deb.debian.org/debian bookworm-updates InRelease [55.4 kB]
Get:3 http://deb.debian.org/debian-security bookworm-security InRelease [48.0 kB]
Fetched 103 kB in 4s (29.5 kB/s)
Reading package lists... Done
```

The cache server has been used here already - in `/var/log/apt-cacher-ng/apt-cache.log` on the cache server, these lines appear:

```log
1725348110|I|20254|100.115.92.205|debrep/dists/bookworm/InRelease
1725348110|O|102|100.115.92.205|debrep/dists/bookworm/InRelease
1725348110|I|56689|100.115.92.205|debrep/dists/bookworm-updates/InRelease
1725348110|O|55710|100.115.92.205|debrep/dists/bookworm-updates/InRelease
1725348113|I|49279|100.115.92.205|secdeb/dists/bookworm-security/InRelease
1725348113|O|48232|100.115.92.205|secdeb/dists/bookworm-security/InRelease
```

While the `apt-cacher-ng` [manual][14] is great, I couldn't find a description of this log format, but there's a Unix epoch style timestamp, the IP address of the client (the "cacheclient1" container in this case) and the resource in question. There's also what looks like a size and whether it's read or write (I/O). I'm guessing, but this seems about right, 104044 bytes (corresponding to the "Fetched 103kB in 4s" line in the log):

```shell
root@cacheserver:~# grep -E '\|O\|' /var/log/apt-cacher-ng/apt-cacher.log \
  | cut -d'|' -f3 | paste -sd+ | bc
104044
```

> I do like a bit of gratuitous Unix shell pipelinery.

The three pairs of I and O log records correspond to the three resources shown in the output to `apt-get update`.

There's also some data in the cache directory now, too:

```shell
root@cacheserver:~# du -hs /var/cache/apt-cacher-ng/
264K    /var/cache/apt-cacher-ng/
```

So far so good! Now for a substantial package install.

```shell
root@cacheclient1:~# apt-get install -y build-essential
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following additional packages will be installed:
...
0 upgraded, 101 newly installed, 0 to remove and 0 not upgraded.
Need to get 80.5 MB of archives.
After this operation, 304 MB of additional disk space will be used.
Get:1 http://deb.debian.org/debian bookworm/main arm64 liblocale-gettext-perl arm64 1.07-5 [15.1 kB]
Get:2 http://deb.debian.org/debian bookworm/main arm64 readline-common all 8.2-1.3 [69.0 kB]
Get:3 http://deb.debian.org/debian bookworm/main arm64 bzip2 arm64 1.0.8-5+b1 [48.9 kB]
...
Get:99 http://deb.debian.org/debian bookworm/main arm64 libldap-common all 2.5.13+dfsg-5 [29.3 kB]
Get:100 http://deb.debian.org/debian bookworm/main arm64 libsasl2-modules arm64 2.1.28+dfsg-10 [63.1 kB]
Get:101 http://deb.debian.org/debian bookworm/main arm64 manpages-dev all 6.03-2 [2030 kB]
Fetched 80.5 MB in 28s (2909 kB/s)
debconf: delaying package configuration, since apt-utils is not installed
Selecting previously unselected package liblocale-gettext-perl.
(Reading database ... 14040 files and directories currently installed.)
Preparing to unpack .../000-liblocale-gettext-perl_1.07-5_arm64.deb ...
Unpacking liblocale-gettext-perl (1.07-5) ...
```

This corresponds exactly to the log records written on the server to `/var/log/apt-cacher-ng/apt-cache.log`:

```log
1725349470|I|16482|100.115.92.205|debrep/pool/main/libl/liblocale-gettext-perl/liblocale-gettext-perl_1.07-5_arm64.deb
1725349470|O|15428|100.115.92.205|debrep/pool/main/libl/liblocale-gettext-perl/liblocale-gettext-perl_1.07-5_arm64.deb
1725349470|I|70362|100.115.92.205|debrep/pool/main/r/readline/readline-common_8.2-1.3_all.deb
1725349470|O|69279|100.115.92.205|debrep/pool/main/r/readline/readline-common_8.2-1.3_all.deb
1725349471|I|50238|100.115.92.205|debrep/pool/main/b/bzip2/bzip2_1.0.8-5+b1_arm64.deb
1725349471|O|49151|100.115.92.205|debrep/pool/main/b/bzip2/bzip2_1.0.8-5+b1_arm64.deb
...
1725349497|I|30716|100.115.92.205|debrep/pool/main/o/openldap/libldap-common_2.5.13+dfsg-5_all.deb
1725349497|O|29644|100.115.92.205|debrep/pool/main/o/openldap/libldap-common_2.5.13+dfsg-5_all.deb
1725349498|I|64504|100.115.92.205|debrep/pool/main/c/cyrus-sasl2/libsasl2-modules_2.1.28+dfsg-10_arm64.deb
1725349498|O|63440|100.115.92.205|debrep/pool/main/c/cyrus-sasl2/libsasl2-modules_2.1.28+dfsg-10_arm64.deb
1725349498|I|2031644|100.115.92.205|debrep/pool/main/m/manpages/manpages-dev_6.03-2_all.deb
1725349498|O|2030553|100.115.92.205|debrep/pool/main/m/manpages/manpages-dev_6.03-2_all.deb
```

And the cache store on the server is considerably larger now:

```shell
root@cacheserver:~# du -hs /var/cache/apt-cacher-ng/
78M     /var/cache/apt-cacher-ng/
```

Note the fetch statistic log record in the output of the `apt-get install`:

```log
Fetched 80.5 MB in 28s (2909 kB/s)
```

While I could remove the `build-essential` package and rerun the install, I can instead create a second client container and do the same thing again, which feels like a cleaner test and better comparison.


### Re-testing with a second cache client container

After establishing a second container "cacheclient2":

```shell
(termina) chronos@localhost ~ $ lxc launch images:debian/12 cacheclient2 && lxc exec $_ bash
```

and setting up the same required configuration:

```shell
root@cacheclient2:~# echo 'Acquire::http::Proxy "http://cacheserver:3142";' \
  > /etc/apt/apt.conf.d/00cacher
```

I can try the same `apt-get` invocation:

```shell
root@cacheclient2:~# apt-get update && apt-get install -y build-essential
```

Now, the fetch statistic log record here looks like this:

```log
Fetched 80.5 MB in 1s (81.1 MB/s)
```

That's quite a difference - 28 seconds the first time, and 1 second when the cache can deliver!

Of course, the speed is going to be rather impressive in this example for cache hits as both client and server containers are on the same host. But it's more the reduction in Internet traffic that I'm interested in anyway, and in reality I get pretty quick turnaround times over the LAN from my real cache server that I run on the "cacher" container on my Proxmox host.

In fact, talking of statistics, `apt-cacher-ng` also serves a nifty statistics page, which right now, for the brand new and only slightly used cache server on the "cacheserver" container, looks like this:

![transfer statistics](/images/2024/09/transferstatistics.png)

## Working with SSL/TLS remotes

You'll see that the standard Debian remotes are HTTP-based, rather than HTTPS:

```shell
root@cacheclient1:~# apt-get update
Hit:1 http://deb.debian.org/debian bookworm InRelease
Get:2 http://deb.debian.org/debian bookworm-updates InRelease [55.4 kB]
Get:3 http://deb.debian.org/debian-security bookworm-security InRelease [48.0 kB]
Fetched 103 kB in 4s (29.5 kB/s)
Reading package lists... Done
```

Using HTTPS based remotes with an in-the-middle mechanism like `apt-cacher-ng` is a little difficult, and the problem and potential solutions are explained well in the user manual, in the section titled [Access to SSL/TLS remotes (HTTPS)][15].

This problem is relevant for me, in that I nearly always want to install Docker engine in my Debian containers, and the [requirements][16] include adding details for Docker's apt package repository, the relevant line for which is this one:

```shell
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Note that in the line that's echo'd to `/etc/apt/sources.list.d/docker.list` a SSL/TLS URL is used: <https://download.docker.com/linux/debian> (you may have to scroll right to see it).

### Allowing HTTPS tunnels

Following the [requirements][16] through, in the "cacheclient1" container, 

```shell
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

the cache server is active and successful for the _first_ `apt-get update` invocation here, as well as the installation of `ca-certificates` and `curl` packages. That's because we're not yet referencing any Docker based apt package repository resources. But after the addition of the new source in `/etc/apt/sources.list.d/docker.list`, the contents of which looks like this:

```text
deb [arch=arm64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian   bookworm stable
```

the _second_ `apt-get update` in the instructions above results in this error output:

```log
Ign:1 https://download.docker.com/linux/debian bookworm InRelease
Hit:2 http://deb.debian.org/debian bookworm InRelease
Hit:3 http://deb.debian.org/debian bookworm-updates InRelease
Hit:4 http://deb.debian.org/debian-security bookworm-security InRelease
Ign:1 https://download.docker.com/linux/debian bookworm InRelease
Ign:1 https://download.docker.com/linux/debian bookworm InRelease
Err:1 https://download.docker.com/linux/debian bookworm InRelease
  Invalid response from proxy: HTTP/1.0 403 CONNECT denied (ask the admin to allow HTTPS tunnels)     [IP: 100.115.92.201 3142]
Reading package lists... Done
W: Failed to fetch https://download.docker.com/linux/debian/dists/bookworm/InRelease  Invalid response from proxy: HTTP/1.0 403 CONNECT denied (ask the admin to allow HTTPS tunnels)     [IP: 100.115.92.201 3142]
W: Some index files failed to download. They have been ignored, or old ones used instead.
```

The "ask the admin to allow HTTPS tunnels" in the message here is related to the decision I made to _not_ allow them, in the configuration point during the installation of `apt-cacher-ng` on the cache server.

Looking in the server configuration file at `/etc/apt-cacher-ng/acng.conf`, there's this section:

```systemd
# Allow data pass-through mode for certain hosts when requested by the client
# using a CONNECT request. This is particularly useful to allow access to SSL
# sites (https proxying). The string is a regular expression which should cover
# the server name with port and must be correctly formated and terminated.
# Examples:
# PassThroughPattern: private-ppa\.launchpad\.net:443$
# PassThroughPattern: .* # this would allow CONNECT to everything
#
# Default: ^(bugs\.debian\.org|changelogs\.ubuntu\.com):443$
# PassThroughPattern: ^(bugs\.debian\.org|changelogs\.ubuntu\.com):443$
```

To allow access to the Docker apt package repositories at <https://download.docker.com>, I can add this configuration line:

```systemd
PassThroughPattern: ^download\.docker\.com:443$
```

and restart `apt-cacher-ng`:

```shell
root@cacheserver:~# /etc/init.d/apt-cacher-ng restart
Restarting apt-cacher-ng (via systemctl): apt-cacher-ng.service.
```

Now, on "cacheclient1", the `apt-get update` successfully reaches `download.docker.com`:

```shell
root@cacheclient1:~# sudo apt-get update
Hit:1 http://deb.debian.org/debian bookworm InRelease
Get:2 https://download.docker.com/linux/debian bookworm InRelease [43.3 kB]  
Get:3 http://deb.debian.org/debian bookworm-updates InRelease [55.4 kB]      
Hit:4 http://deb.debian.org/debian-security bookworm-security InRelease
Get:5 https://download.docker.com/linux/debian bookworm/stable arm64 Packages [29.1 kB]
...
```

What's more, the `apt-get install` of the Docker packages works too:

```shell
root@cacheclient1:~# sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following additional packages will be installed:
...
0 upgraded, 29 newly installed, 0 to remove and 0 not upgraded.
Need to get 122 MB of archives.
After this operation, 497 MB of additional disk space will be used.
Do you want to continue? [Y/n] 
Get:1 http://deb.debian.org/debian bookworm/main arm64 pigz arm64 2.6-1 [56.2 kB]
Get:2 http://deb.debian.org/debian bookworm/main arm64 less arm64 590-2.1~deb12u2 [128 kB]
Get:3 https://download.docker.com/linux/debian bookworm/stable arm64 containerd.io arm64 1.7.21-1 [22.0 MB]
...
Get:27 https://download.docker.com/linux/debian bookworm/stable arm64 docker-ce arm64 5:27.2.0-1~debian.12~bookworm [15.5 MB]
Get:28 https://download.docker.com/linux/debian bookworm/stable arm64 docker-ce-rootless-extras arm64 5:27.2.0-1~debian.12~bookworm [8403 kB]
Get:29 https://download.docker.com/linux/debian bookworm/stable arm64 docker-compose-plugin arm64 2.29.2-1~debian.12~bookworm [10.8 MB]
Fetched 122 MB in 35s (3455 kB/s)
...
```

However. This is only allowing a tunnel through the cache server to the origin, i.e. to <https://download.docker.com>. The resources are _not_ cached. There are no logs written to `/var/log/apt-cacher-ng/apt-cache.log` that indicate that any Docker package resources have been processed by the cache mechanism. So each time I were to install Docker engine, I would be going out onto the Internet to retrieve the packages, and not benefitting from what `apt-cacher-ng` can provide.

### Specifying HTTP-only sources

To have `apt-cacher-ng` cache these Docker apt packages too, a different approach is needed. It's more of a workaround to the complexities introduced with SSL/TLS in a proxy situation. And that workaround is ... not to use HTTPS at all.

Simply modifying the scheme from `https` to `http` in the URL in `/etc/apt/sources.list.d/docker.list` so that the contents become:

```text
deb [arch=arm64 signed-by=/etc/apt/keyrings/docker.asc] http://download.docker.com/linux/debian   bookworm stable
```

avoids the SSL/TLS problem altogether.

I like to make this modification as a separate step, like this:

```shell
sed -i 's|https://download.docker.com|http://download.docker.com|' /etc/apt/sources.list.d/docker.list
```

so I can continue to copy/paste instructions verbatim, and just make my own small change. Indeed, I [do this][17] in my `lxc-container-setup` script that I use to set up new LXC container on Crostini, with Tailscale and Docker.

Having made this scheme change in the source definition for Docker packages and running an `apt-get update`, evidence in the cache server logs appears, showing the cacheing for Docker resources:

```log
1725354578|I|562|100.115.92.202|download.docker.com/linux/debian/dists/bookworm/InRelease
1725354578|O|43597|100.115.92.202|download.docker.com/linux/debian/dists/bookworm/InRelease
1725354578|I|563|100.115.92.202|download.docker.com/linux/debian/dists/bookworm/stable/binary-arm64/Packages.bz2
1725354578|O|29413|100.115.92.202|download.docker.com/linux/debian/dists/bookworm/stable/binary-arm64/Packages.bz2
```

And retrieval and cacheing of the Docker apt packages takes place too when the `apt-get install` is invoked:

```log
1725354603|O|22034315|100.115.92.202|download.docker.com/linux/debian/dists/bookworm/pool/stable/arm64/containerd.io_1.7.21-1_arm64.deb
1725354603|O|27380417|100.115.92.202|download.docker.com/linux/debian/dists/bookworm/pool/stable/arm64/docker-buildx-plugin_0.16.2-1~debian.12~bookworm_arm64.deb
1725354604|O|13425330|100.115.92.202|download.docker.com/linux/debian/dists/bookworm/pool/stable/arm64/docker-ce-cli_27.2.0-1~debian.12~bookworm_arm64.deb
1725354604|O|15462186|100.115.92.202|download.docker.com/linux/debian/dists/bookworm/pool/stable/arm64/docker-ce_27.2.0-1~debian.12~bookworm_arm64.deb
1725354604|O|8403103|100.115.92.202|download.docker.com/linux/debian/dists/bookworm/pool/stable/arm64/docker-ce-rootless-extras_27.2.0-1~debian.12~bookworm_arm64.deb
1725354604|O|10783122|100.115.92.202|download.docker.com/linux/debian/dists/bookworm/pool/stable/arm64/docker-compose-plugin_2.29.2-1~debian.12~bookworm_arm64.deb
```

Furthermore, this cacheing is very effective, as can be seen from a subsequent install of Docker engine on yet another test client container:

```shell
root@cacheclient3:~# sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
Get:1 http://deb.debian.org/debian bookworm/main arm64 pigz arm64 2.6-1 [56.2 kB]
Get:2 http://download.docker.com/linux/debian bookworm/stable arm64 containerd.io arm64 1.7.21-1 [22.0 MB]
Get:3 http://deb.debian.org/debian bookworm/main arm64 less arm64 590-2.1~deb12u2 [128 kB]
...
Get:29 http://download.docker.com/linux/debian bookworm/stable arm64 docker-ce-cli arm64 5:27.2.0-1~debian.12~bookworm [13.4 MB]
Get:30 http://download.docker.com/linux/debian bookworm/stable arm64 docker-ce arm64 5:27.2.0-1~debian.12~bookworm [15.5 MB]
Get:31 http://download.docker.com/linux/debian bookworm/stable arm64 docker-ce-rootless-extras arm64 5:27.2.0-1~debian.12~bookworm [8403 kB]
Get:32 http://download.docker.com/linux/debian bookworm/stable arm64 docker-compose-plugin arm64 2.29.2-1~debian.12~bookworm [10.8 MB]
Fetched 123 MB in 1s (84.9 MB/s) 
...
```

Pretty excellent!

## Wrapping up

So there you have it - the results of my investigations into and early use of `apt-cacher-ng` as one component in a setup to reduce my Internet bandwidth usage. Running this on the "cacher" LXC container on my Proxmox host is great, and thanks to Tailscale, I can use it from anywhere. 

[1]: /tags/narrowboat/
[2]: /blog/posts/2023/01/09/working-from-a-narrowboat-internet-connectivity/
[3]: /tags/docker/
[4]: /tags/lxd/
[5]: https://www.amazon.co.uk/gp/product/B07DHNJBXZ/
[6]: https://www.amazon.co.uk/gp/product/B08GTYFC37/
[7]: https://hachyderm.io/@qmacro/113056889585707864
[8]: https://wiki.debian.org/AptCacherNg
[9]: https://pve.proxmox.com/wiki/Unprivileged_LXC_containers
[10]: https://tailscale.com/kb/1130/lxc-unprivileged
[11]: https://tailscale.com/kb/1081/magicdns
[12]: https://tailscale.com/kb/1136/tailnet
[13]: /blog/posts/2024/08/24/new-source-for-lxd-images-on-crostini/
[14]: https://www.unix-ag.uni-kl.de/~bloch/acng/html/
[15]: https://www.unix-ag.uni-kl.de/~bloch/acng/html/howtos.html#ssluse
[16]: https://docs.docker.com/engine/install/debian/
[17]: https://gist.github.com/qmacro/6f44f73384b9fef39737bfcfd160bcf8#file-lxc-container-setup-L74-L75

