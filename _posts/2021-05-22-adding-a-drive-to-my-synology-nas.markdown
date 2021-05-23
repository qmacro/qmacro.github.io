---
layout: post
title: Adding a drive to my Synology NAS
date: '2021-05-22 13:06:37'
---

_A brief summary of how things went adding a drive to my Synology DS1621+ NAS._

Earlier this month I took delivery of my first Network Attached Storage (NAS) device - a [Synology DS1621+](https://www.synology.com/en-uk/products/DS1621+). It has 6 drive bays. Note that you can sort of tell this from the model number:

* DS: Disk Station (standalone, as opposed to rack mountable, for example)
* 16: Maximum number of drives possible
* 21: Model year

Synology also offer an expansion unit, a [DX517](https://www.synology.com/en-uk/products/DX517) which has 5 drive bays, and you can attach two of them to the DS1621+ adding up to a total of 6 + (5 + 5) = 16.

## Initial setup

I bought two Seagate IronWolf 4TB drives. I knew I wanted to go for the [Synology Hybrid Raid](https://www.synology.com/en-global/knowledgebase/DSM/tutorial/Storage/What_is_Synology_Hybrid_RAID_SHR) (SHR) disk arrangement (this has many advantages that appealed to me, not least the ability to add different sized drives in the future).

SHR requires at least two drives, which is why two was the minimum purchase that made sense. But I also bought a couple more, a week later. It's amazing how cheap, relatively speaking, spinning disk storage has become.

With the initial two drives, I'd set up a storage pool, following the instructions (it was pretty straightforward). Here's what the status of that storage pool looked like:

![Status of Storage Pool 1 with 2 drives](/content/images/2021/05/storage-manager-storage-pool.png)

There are a few things that are worth noting here:

* SHR is using "1-drive fault tolerance" which basically means that the capacity of one entire drive is given over to data safety and not available for actual storage
* this is why the "Total capacity" is at 3.63TB - remember that disk sizes are a bit misleading, this is effectively what you get with a 4TB drive, minus 0.01TB for overhead
* the "Used capacity" is at 250.01GB, as I've created a single volume of 250GB so far in that storage pool

## Inserting the new drive

Now the second two drives have arrived, I decided to add one of them to the existing storage pool. I'm thinking of using the second one as a "Hot Spare" and seeing how that goes, but that's for another time.

So I added it to the caddy:

![drive in caddy](/content/images/2021/05/drive-in-caddy.jpg)

I checked the specifications of the DS1621+ and noted that it supported hot swapping, so I could insert the drive and caddy back in as the device was running, which I did:

![inserting drive into NAS](/content/images/2021/05/inserting-drive-into-nas.jpg)

A few moments later, I re-checked the storage manager and it showed me the new drive:

![storage manager overview](/content/images/2021/05/storage-manager-overview.png)

Here's the newly inserted drive in a "Not initialized" state in the HDD/SDD list:

![storage manager HDD/SDD list](/content/images/2021/05/storage-manager-hdd-sdd.png)

## Adding the new drive to the storage pool

Now the drive was known, I could add it to the storage pool. I did this with the "Action -> Add drive" menu item in the storage pool window, and the flow was fairly predictable, with the choice:

![adding the new drive - choosing the drive](/content/images/2021/05/storage-manager-storage-pool-add-drive-a.png)

After a warning about any data being erased on the new drive, I was presented with a summary before proceeding:

![adding the new drive - summary](/content/images/2021/05/storage-manager-storage-pool-add-drive-b.png)

The result was as expected. The storage pool had this new drive listed, and went into an "Expanding" status (note the capacity is not yet shown as being increased):

![the third drive shown in the storage pool, which was now being expanded](/content/images/2021/05/storage-manager-storage-pool-after-add.png)

Checking back over in the "HDD/SDD" display, the drive status has gone from "Not initialized" to "Healthy", and is showing an assignment to Storage Pool 1.

That was pretty much it - it wasn't an unexpected flow, but I was curious as to what would happen and how it would happen. Perhaps this helps someone who is also wondering. I've been writing this as I've been working through the flow, and now I've come to the end of this post, the status is still "Expanding" and shows that it's 0.70% through a check of parity consistency - so it has a long way to go yet. I think I now realise why a "Hot Spare" might be useful. Anyway, I'll bring this post to an end now, and update it when the status changes.

---

Further reading:

* [Synology NAS DS1621+ Hardware Installation Guide](https://global.download.synology.com/download/Document/Hardware/HIG/DiskStation/21-year/DS1621+/enu/Syno_HIG_DS1621_Plus_enu.pdf) (PDF)
