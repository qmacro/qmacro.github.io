---
title: (Mini) Installfest in the SDN clubhouse at TechEd
date: 2004-10-14
tags:
  - sapcommunity
---
Piers and I got hold of the latest WAS 6.40 demo system (NW4) from the [LinuxLab](http://www.sap.com/linux) guys’ stand here at SAP TechEd. It contains ABAP service pack 3 and Java/J2EE service pack 7.

![Biostar 200](/images/2004/10/Biostar200.jpg)

Since I had my small Linux server with me (that I used in my session this morning to demo some ICF stuff), we decided to blast away the previous NW4 install and have a mini installfest!

![Install Fest](/images/2004/10/InstallFest.jpg)

Excellent. There’s something about interesting things happening on computer screens that seem to attract the inner-geek in people … within minutes we had a small crowd of people joining Piers, Mark, Gregor and me to watch the poor little server get hammered as the RPMs were installed from the DVD.

![Installing new NW4](/images/2004/10/InstallingNewNw4.png)

I’m typing this post while the install goes on – here you can see a screenshot of the progress.

## Small hack needed

I noticed straight away that the install.sh script supplied on the DVD crashed and burned immediately. I had a little look (open source rules again 🙂) and found it was because the script was trying to execute a KDE program ‘kdialog’ to display the licence and prompt for acceptance of the terms. (KDE is a desktop manager). I don’t have KDE installed on the server, so it was almost a non-starter.

Luckily I had a flash of inspiration, and created a symbolic link from a non-existent ‘kdialog’ to the ever-present X client utility ‘xmessage’ (I avoided copy-and-editing the script from the DVD as I would have had to change loads of relative pathnames and so on to get it to work from a new location). I reinvoked the install.sh script … and everything started perfectly. Hurrah! (If you look closely at the screenshot you can see evidence of this little hack.)

Anyway, 4 RPMs have been installed by now – it’s time for me to go back and have a look.

## Update: Install complete

Ok, after less than two hours, my new NW4 system, service release one, is installed and up and running:

![New NW4 installed](/images/2004/10/small_newnw4installed_39178.png)

Nice work, LinuxLab folks!

---

[Originally published on SAP Community](https://blogs.sap.com/2004/10/14/mini-installfest-in-the-sdn-clubhouse-at-teched/)
