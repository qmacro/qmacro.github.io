---
layout: post
title: NW4, OSS1 and logon group selection for OSS
date: 2004-05-31
tags:
  - sapcommunity
  - oss
---
While waiting for the DD ACTIVATION phase of an add-on installation to finish, my mind wandered off to something I’d noticed with my new [WAS 6.40 testdrive for Linux is here!](/blog/posts/2004/03/19/was-6.40-testdrive-for-linux-is-here!/) system, with the SID “NW4” (NetWeaver ’04). Normally, when you start transaction OSS1, and hit the button to connect to OSS, you’re presented with a popup giving you a choice of groups, like the one in the screenshot here.

![screenshot of the group selection popup in OSS1](/images/2004/05/groupselectionpopup_38869.png)

But it wasn’t happening from my NW4 system. So I rolled up my sleeves, and wielded the mighty “/h” in the ok-code (in the R/2 days we used to call this “hobble mode” :-), cleaving my way into the ABAP that lay beneath OSS1. What I found was quite interesting.

## lgtst

There’s a command-line program called `lgtst` that can be used to query the message server of an SAP system and have information on logon groups and so on returned. This `lgtst` program is not, apparently, supported on all operating systems, so there’s a condition in the ABAP that checks that.

## Direct SAPGUI call

If the server’s operating system is not supported, then a simple logon string is constructed from the technical settings held in OSS1 (menu path Parameter -> Technical settings). For example, if you specify a SAProuter at your site thus:

```text
Name: host01 IP Address: 192.168.0.66 Instance: 99
```
 
with SAProuter details thus:

```text
Name: sapserv3 IP Address: 147.204.2.5 Instance: 99
```

and the SAPnet message server details thus:

```text
Name: oss001 DB Name: O01 Instance: 01
```

then the route string constructed is just the concatenated saprouters leading to the dispatcher at O01’s ’01’ instance, like this:

```text
/H/192.168.0.66/S/sapdp99/H/147.204.2.5/S/sapdp99/H/oss001/S/sapdp01
```

This route string is then used in conjunction with a direct local call to your SAPGUI client, so that the end result is that a new SAPGUI instance is started for that connection.

So far, so good (or not, depending on your luck with SAProuter routing :-).

Logon group popup, then SAPGUI call
On the other hand, if the server’s operating system is supported, then something rather different happens. In this case, the `lgtst` program is executed on the server, to discover what logon groups are available for OSS. How does this happen? Well, the SAProuter information we’ve already seen is used to construct a route string:

```text
/H/192.168.0.66/S/sapdp99/H/147.204.2.5/S/sapdp99 ...
```
 

**but**, instead of pointing to a dispatcher at the SAP OSS end:

```text
... /H/oss001/S/sapdp01
```
 

it points to system O01’s message server:

```text
... /H/oss001/S/sapmsO01
```

Once this route string has been constructed, it’s used in a call to `lgtst` like this:

```text
lgtst -H /H/.../H/oss001/S/sapmsO01 -S x -W 30000
```

This is basically requesting that the message server for O01 send back information on available servers (instances) and logon groups. A typical reply looks like this:

```text
list of reachable application servers ------------------------------------- 
[pwdf1120_O01_01] [pwdf1120] [10.16.0.11] [sapdp01] [3201] [DIA UPD BTC SPO ICM ] 
[pwdf1302_O01_01] [pwdf1302] [147.204.100.41] [sapdp01] [3201] [DIA BTC SPO ICM ] 
[pwdf0936_O01_01] [pwdf0936] [10.16.0.19] [sapdp01] [3201] [DIA BTC SPO ICM ] 
[pwdf0810_O01_01] [pwdf0810] [10.16.0.18] [sapdp01] [3201] [DIA BTC SPO ICM ] 
[pwdf1307_O01_01] [pwdf1307] [147.204.100.46] [sapdp01] [3201] [DIA BTC SPO ICM ] 
[pwdf1300_O01_01] [pwdf1300] [147.204.100.39] [sapdp01] [3201] [DIA BTC SPO ICM ] 
[pwdf1301_O01_01] [pwdf1301] [147.204.100.40] [sapdp01] [3201] [DIA BTC SPO ICM ] 
[pwdf1177_O01_01] [pwdf1177] [10.16.1.13] [sapdp01] [3201] [DIA UPD BTC SPO ICM ] 
[pwdf0937_O01_01] [pwdf0937] [10.16.0.20] [sapdp01] [3201] [DIA BTC SPO ICM ] 
[pwdf0809_O01_01] [pwdf0809] [10.16.0.17] [sapdp01] [3201] [DIA BTC SPO ICM ] 
[pwdf0808_O01_01] [pwdf0808] [10.16.0.16] [sapdp01] [3201] [DIA UPD BTC SPO ICM ] 
[pwdf0807_O01_01] [pwdf0807] [10.16.0.15] [sapdp01] [3201] [DIA BTC SPO ICM ] 
[pwdf0392_O01_01] [pwdf0392] [10.16.0.10] [sapdp01] [3201] [DIA BTC SPO ICM ] 
[o01main_O01_01] [pwdf1070] [147.204.100.35] [sapdp01] [3201] [DIA UPD ENQ BTC SPO UP2 ICM ] 
list of selectable logpn groups with favorites ------------------------------------------------ 
[1_PUBLIC] [147.204.100.40] [3201] [620] 
[2_JAPANESE] [147.204.100.40] [3201] [620] 
[DO_NOT_USE] [147.204.100.35] [3201] [620] 
[EWA] [147.204.100.40] [3201] [620] 
[REPL] [10.16.1.13] [3201] [620] 
[SPACE] [10.16.1.13] [3201] [620]
``` 

What we’re interested in are the lines in the second half of the output – the list of selectable logon groups. The key data items here are the group names themselves (e.g. 1_PUBLIC), the IP addresses (e.g. 147.204.100.40), and the port numbers (e.g. 3201). The ABAP behind transaction OSS1 receives this `lgtst` output and parses it out into a nice list of groups, which it then presents to the user as shown in the screenshot above.

(And it goes almost without saying that if the call to `lgtst` fails, we get that friendly message “Unable to connect to message server (default connection will be used)” and revert back to the direct SAPGUI call).

So **that’s** where this popup comes from. Ok. Now I understand. It’s amazing how you use a transaction for years and never really look into how it actually works.

## Why not Linux?

So, just to get back to why I came here in the first place – why doesn’t this popup appear in NW4? NW4 is a Linux-based testdrive system. `lgtst` works fine. But look at this:

```text
*---- Folgende Betriebssysteme werden unterstützt 
IF ( SY-OPSYS = 'HP-UX' ) OR ( SY-OPSYS = 'AIX' ) 
OR ( SY-OPSYS = 'OSF1' ) OR ( SY-OPSYS = 'SINIX' ) 
OR ( SY-OPSYS = 'SunOS' ) OR ( SY-OPSYS = 'Windows NT' ) 
OR ( SY-OPSYS = 'Relia' ) OR ( SY-OPSYS = 'SP_DC' ) 
OR ( SY-OPSYS = 'OS/400' ).
```

No Linux? Hmm, I soon fixed that, by copying the transaction (OSS1 -> ZSS1) and the ABAP behind OSS1 (RSEFA910), adding a line to this IF statement to bring a bit of love the choice operating system of a “Gnu generation” 😉

Now I can call ZSS1 and delight in the group logon popup. Hurrah!

[Originally published on SAP Community](https://blogs.sap.com/2004/05/31/nw4-oss1-and-logon-group-selection-for-oss/)
