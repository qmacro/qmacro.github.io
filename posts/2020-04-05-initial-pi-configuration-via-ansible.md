---
layout: post
category: homelab
title: Initial Pi configuration via Ansible
---

_In the previous post we identified the freshly booted Pis on the network; now it's time to perform some initial configuration, using Ansible._

This is a post in the "[Brambleweeny Cluster Experiments](/2020/03/22/brambleweeny-cluster-experiments/)" series of blog posts, which accompanies the [YouTube live stream recording playlist](https://www.youtube.com/playlist?list=PLfctWmgNyOIf9rXaZp9RSM2YVxAPGGthe) of the same name. The video linked here is the one that accompanies this blog post.

<iframe width="560" height="315" src="https://www.youtube.com/embed/vooBccHq6_4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Previous post in this series: [Finding the Pis on the network](/2020/03/22/finding-the-pis-on-the-network/)

## Ansible configuration

At the end of the previous post, we'd identified the MAC and current IP addresses of the Pis on the network. This information found its way into a couple of files used in a process that follows the general flow described in Jeff Geerling's [Raspberry Pi Networking Setup](https://github.com/geerlingguy/raspberry-pi-dramble/tree/master/setup/networking).

First, we have the `inventory` file defining the current ("as-is") IP addresses of the Pis:

```yml
[brambleweeny]
192.168.86.47
192.168.86.15
192.168.86.158
192.168.86.125

[brambleweeny:vars]
ansible_ssh_user=pi
```

Note that we've also got the definition of the default user `pi` also in there.

Then, we also have the `vars.yml` file which is used by the [`main.yml`](https://github.com/geerlingguy/raspberry-pi-dramble/blob/master/setup/networking/main.yml) Ansible script to set things up. While we saw the contents in the previous post, it's worth looking at them again here:

```yaml
---
# Mapping of what hardware MAC addresses should be configured with specific IPs.
mac_address_mapping:

  "dc:a6:32:60:60:95":
    name: brambleweeny1.lan
    ip: "192.168.86.12"
  "dc:a6:32:60:60:77":
    name: brambleweeny2.lan
    ip: "192.168.86.13"
  "dc:a6:32:60:60:44":
    name: brambleweeny3.lan
    ip: "192.168.86.14"
  "dc:a6:32:60:60:e3":
    name: brambleweeny4.lan
    ip: "192.168.86.15"

# Nameservers to use in resolv.conf.
dns_nameservers:
  - "192.168.86.5"
```

This is the "to-be" state of the Pis, via configuration of specific hostnames and IP addresses, as well as what to use for domain name resolution, for each of the Pis that are to be identified by their MAC addresses. More explicitly, I want to move from dynamically allocated IP addresses (which are currently 47, 15, 158 and 125) to statically allocated IP addresses 12, 13, 14 and 15.

## Strict host key checking

Running the Ansible `main.yml` playbook as it stands right now presents us with a problem:

```
-> ansible-playbook -i inventory main.yml
PLAY [brambleweeny] ***

TASK [Gathering Facts] ***
The authenticity of host '192.168.86.47 (192.168.86.47)' can't be established.
ECDSA key fingerprint is SHA256:AJ5628fGhewiqdu/V2+B1LkR2HKGa+nRcwjYiiTGqWg.
Are you sure you want to continue connecting (yes/no)?
The authenticity of host '192.168.86.15 (192.168.86.15)' can't be established.
ECDSA key fingerprint is SHA256:sn2otbKVAa9Jsj+i3W0poIK731+pBP+ivbUrATJGVQk.
Are you sure you want to continue connecting (yes/no)?
The authenticity of host '192.168.86.158 (192.168.86.158)' can't be established.
ECDSA key fingerprint is SHA256:jFgPSwjEQsCSUx+nJcZ6ub9EhoGC1I1vSX5uSvVc1YE.
Are you sure you want to continue connecting (yes/no)?
The authenticity of host '192.168.86.125 (192.168.86.125)' can't be established.
ECDSA key fingerprint is SHA256:Tl3t427yXmbPIXjgBNBDHtNuw+MQUS132xhX6DCgo9E.
Are you sure you want to continue connecting (yes/no)?
```

We've never connected to these Pis before now, so `ssh`, which is at the heart of Ansible's connection to them, will appropriately complain that it doesn't recognise them. This "complaint" comes about from `ssh`'s default approach to [checking the keys of remote hosts](https://www.ibm.com/support/knowledgecenter/SSLTBW_2.2.0/com.ibm.zos.v2r2.foto100/hostch.htm), which is what we normally want (i.e. be strict!).

But for this particular operation we need to relax this approach, and for that we can use the `StrictHostKeyChecking` option, which can either be set in the `ssh` config file (`~/.ssh/config` at a user level) or on the command line.

Here's the difference between trying to `ssh` to one of the Pis without and then with the option turned off:

```
-> ssh pi@192.168.86.47
The authenticity of host '192.168.86.47 (192.168.86.47)' can't be established.
ECDSA key fingerprint is SHA256:AJ5628fGhewiqdu/V2+B1LkR2HKGa+nRcwjYiiTGqWg.
Are you sure you want to continue connecting (yes/no)?
Host key verification failed.
```

```
-> ssh -o StrictHostKeyChecking=no pi@192.168.86.47
Warning: Permanently added '192.168.86.47' (ECDSA) to the list of known hosts.
pi@192.168.86.47's password:
```

Note that in this second example, even before the password has been entered, the key for this remote Pi has now already been added to `~/.ssh/known_hosts`.

Ansible makes it easy for us to add `ssh` options to the `inventory` file, via the `ansible_ssh_common_args` variable, which we do, at the end of the file, like this:

```
[brambleweeny:vars]
ansible_ssh_user=pi
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
```

Trying the playbook again, we don't get a problem with the inability of `ssh` to authenticate the Pi hosts' keys. Great! But this just reveals the next problem, which again we can learn from:

```
-> ansible-playbook -i inventory main.yml

PLAY [brambleweeny] ***

TASK [Gathering Facts] ***
fatal: [192.168.86.47]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh:
Warning: Permanently added '192.168.86.47' (ECDSA) to the list of known hosts.\r\n
pi@192.168.86.47: Permission denied (publickey,password).", "unreachable": true}
fatal: [192.168.86.15]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh:
Warning: Permanently added '192.168.86.15' (ECDSA) to the list of known hosts.\r\n
pi@192.168.86.15: Permission denied (publickey,password).", "unreachable": true}
fatal: [192.168.86.158]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh:
Warning: Permanently added '192.168.86.158' (ECDSA) to the list of known hosts.\r\n
pi@192.168.86.158: Permission denied (publickey,password).", "unreachable": true}
fatal: [192.168.86.125]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh:
Warning: Permanently added '192.168.86.125' (ECDSA) to the list of known hosts.\r\n
pi@192.168.86.125: Permission denied (publickey,password).", "unreachable": true}
          to retry, use: --limit @/home/pi/raspberry-pi-dramble/setup/networking/main.retry
PLAY RECAP ***
192.168.86.125             : ok=0    changed=0    unreachable=1    failed=0
192.168.86.15              : ok=0    changed=0    unreachable=1    failed=0
192.168.86.158             : ok=0    changed=0    unreachable=1    failed=0
192.168.86.47              : ok=0    changed=0    unreachable=1    failed=0
```

Notice that the `-o StrictHostKeyChecking=no` did what we wanted it to do, as we can see the following message for each host in the output: "Warning: Permanently added '192.168.86.n' (ECDSA) to the list of known hosts".

So we've got `ssh` to not refuse to connect because it doesn't initially recognise the hosts, but now we're getting a "permission denied" issue.

## Uploading the ssh key, and sshpass

Of course, we're getting a "permission denied" issue because the remote Pis don't have the public key of the user of my current host (i.e. `~/.ssh/id_rsa.pub`) for public key based authentication, and we haven't supplied a password either (which for each of the freshly booted Pis, is 'raspberry' for the 'pi' user).

A passwordless based remote access flow is ideal, so this is something we should address now. We need somehow to get my public key across to each of the Pis, in the right place i.e. in the remote user's `~/.ssh/authorized_keys` file. (If you've not used public key based `ssh` access before, why not?)

There's a specific Ansible module for this - the [`authorized_key` module](https://docs.ansible.com/ansible/latest/modules/authorized_key_module.html), and we can use it in a short playbook like this, which we'll call `set_ssh_key.yml`:

```yml
---
- hosts: brambleweeny

  tasks:
    - name: Set authorized key from file
      authorized_key:
        user: pi
        state: present
        key: "{% raw %}{{ lookup('file', '/home/pi/.ssh/id_rsa.pub') }}{% endraw %}"
```

But of course we can't just run this, as we're still unable to connect, for the same reason:

```
-> ansible-playbook -i inventory set_ssh_key.yml

PLAY [brambleweeny] ***

TASK [Gathering Facts] ***
fatal: [192.168.86.47]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh:
pi@192.168.86.47: Permission denied (publickey,password).", "unreachable": true}
fatal: [192.168.86.15]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh:
pi@192.168.86.15: Permission denied (publickey,password).", "unreachable": true}
fatal: [192.168.86.158]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh:
pi@192.168.86.158: Permission denied (publickey,password).", "unreachable": true}
fatal: [192.168.86.125]: UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh:
pi@192.168.86.125: Permission denied (publickey,password).", "unreachable": true}
        to retry, use: --limit @/home/pi/raspberry-pi-dramble/setup/networking/set_ssh_key.retry

PLAY RECAP ***
192.168.86.125             : ok=0    changed=0    unreachable=1    failed=0
192.168.86.15              : ok=0    changed=0    unreachable=1    failed=0
192.168.86.158             : ok=0    changed=0    unreachable=1    failed=0
192.168.86.47              : ok=0    changed=0    unreachable=1    failed=0
```

So we have to authenticate a different way - with the 'raspberry' password (remember, we're already supplying Ansible with the user via the `ansible_ssh_user` variable in the `inventory` file). The `-k` option for `ansible-playbook` tells it to ask for a connection password, which it will then use on our behalf when connecting to each host.

It's worth spending a couple of minutes understanding how this actually operates. It uses the `sshpass` command, which is therefore required (I didn't have this and had to install it with `sudo apt install sshpass`). `sshpass` is described by its [man page](https://linux.die.net/man/1/sshpass) as a "noninteractive ssh password provider". Most of the time when we run `ssh` it's in "keyboard interactive" mode, which means that it can ask the user for a password if required. The man page states that that `ssh` "uses direct TTY access to make sure that the password is indeed issued by an interactive keyboard user", and that, fascinatingly, `sshpass` runs `ssh` in a dedicated TTY to trick `ssh` into thinking it is indeed getting the password from an interactive user, when in fact it's not.

We can see this in action with a simple test:

```
-> sshpass -p 'raspberry' ssh pi@192.168.86.47
Linux raspberrypi 4.19.97-v7l+ #1294 SMP Thu Jan 30 13:21:14 GMT 2020 armv7l
[...]
pi@raspberrypi:~ $
```

Anyway, let's use the `-k` option with `ansible-playbook` to make use of this `sshpass` utility; Ansible will first ask us for the password and then use `sshpass` to pass it on to each of the `ssh` connections it makes:

```
-> ansible-playbook -k -i inventory set_ssh_key.yml
SSH password: *********

PLAY [brambleweeny] ***

TASK [Gathering Facts] ***
ok: [192.168.86.15]
ok: [192.168.86.125]
ok: [192.168.86.47]
ok: [192.168.86.158]

TASK [Set authorized key from file] ***
changed: [192.168.86.158]
changed: [192.168.86.47]
changed: [192.168.86.125]
changed: [192.168.86.15]

PLAY RECAP ***
192.168.86.125             : ok=2    changed=1    unreachable=0    failed=0
192.168.86.15              : ok=2    changed=1    unreachable=0    failed=0
192.168.86.158             : ok=2    changed=1    unreachable=0    failed=0
192.168.86.47              : ok=2    changed=1    unreachable=0    failed=0
```

Success! From this point onwards, we can use `ssh` to connect to each of the Pis, but via our public key, rather than a password:

```
-> ssh pi@192.168.86.47
Linux raspberrypi 4.19.97-v7l+ #1294 SMP Thu Jan 30 13:21:14 GMT 2020 armv7l
[...]
pi@raspberrypi:~ $
```

## Running the main playbook

At this point I can retry `main.yml` playbook, knowing that Ansible will be able to successfully connect to each of the Pis, using the public key we've transferred, and also using the default user defined in the `ansible_ssh_user` variable in the `inventory` file:

```
-> ansible-playbook -i inventory main.yml

PLAY [brambleweeny] ***

TASK [Gathering Facts] ***
ok: [192.168.86.47]
ok: [192.168.86.15]
ok: [192.168.86.158]
ok: [192.168.86.125]

TASK [Set the current MAC address for eth0.] ***
ok: [192.168.86.47]
ok: [192.168.86.15]
ok: [192.168.86.158]
ok: [192.168.86.125]

TASK [Set variables based on eth0 MAC address.] ***
ok: [192.168.86.47]
ok: [192.168.86.15]
ok: [192.168.86.158]
ok: [192.168.86.125]

TASK [Set up networking-related files.] ***
changed: [192.168.86.47] => (item={'template': 'hostname.j2', 'dest': '/etc/hostname'})
changed: [192.168.86.15] => (item={'template': 'hostname.j2', 'dest': '/etc/hostname'})
changed: [192.168.86.158] => (item={'template': 'hostname.j2', 'dest': '/etc/hostname'})
changed: [192.168.86.125] => (item={'template': 'hostname.j2', 'dest': '/etc/hostname'})
changed: [192.168.86.47] => (item={'template': 'hosts.j2', 'dest': '/etc/hosts'})
changed: [192.168.86.15] => (item={'template': 'hosts.j2', 'dest': '/etc/hosts'})
changed: [192.168.86.158] => (item={'template': 'hosts.j2', 'dest': '/etc/hosts'})
changed: [192.168.86.125] => (item={'template': 'hosts.j2', 'dest': '/etc/hosts'})
changed: [192.168.86.47] => (item={'template': 'resolv.conf.j2', 'dest': '/etc/resolv.conf'})
changed: [192.168.86.15] => (item={'template': 'resolv.conf.j2', 'dest': '/etc/resolv.conf'})
changed: [192.168.86.158] => (item={'template': 'resolv.conf.j2', 'dest': '/etc/resolv.conf'})
changed: [192.168.86.125] => (item={'template': 'resolv.conf.j2', 'dest': '/etc/resolv.conf'})
changed: [192.168.86.47] => (item={'template': 'dhcpcd.conf.j2', 'dest': '/etc/dhcpcd.conf'})
changed: [192.168.86.15] => (item={'template': 'dhcpcd.conf.j2', 'dest': '/etc/dhcpcd.conf'})
changed: [192.168.86.158] => (item={'template': 'dhcpcd.conf.j2', 'dest': '/etc/dhcpcd.conf'})
changed: [192.168.86.125] => (item={'template': 'dhcpcd.conf.j2', 'dest': '/etc/dhcpcd.conf'})

RUNNING HANDLER [update hostname] ***
changed: [192.168.86.47]
changed: [192.168.86.15]
changed: [192.168.86.158]
changed: [192.168.86.125]

RUNNING HANDLER [delete dhcp leases] ***
ok: [192.168.86.47] => (item=/var/lib/dhcp/dhclient.leases)
ok: [192.168.86.15] => (item=/var/lib/dhcp/dhclient.leases)
ok: [192.168.86.158] => (item=/var/lib/dhcp/dhclient.leases)
ok: [192.168.86.125] => (item=/var/lib/dhcp/dhclient.leases)
ok: [192.168.86.47] => (item=/var/lib/dhcpcd5/dhcpcd-eth0.lease)
ok: [192.168.86.15] => (item=/var/lib/dhcpcd5/dhcpcd-eth0.lease)
ok: [192.168.86.158] => (item=/var/lib/dhcpcd5/dhcpcd-eth0.lease)
ok: [192.168.86.125] => (item=/var/lib/dhcpcd5/dhcpcd-eth0.lease)

PLAY RECAP ***
192.168.86.47              : ok=6    changed=2    unreachable=0    failed=0
192.168.86.15              : ok=6    changed=2    unreachable=0    failed=0
192.168.86.158             : ok=6    changed=2    unreachable=0    failed=0
192.168.86.125             : ok=6    changed=2    unreachable=0    failed=0
```

Very nice indeed!


## Rebooting and updating the inventory

At this stage, as advised in Jeff's [networking setup README](https://github.com/geerlingguy/raspberry-pi-dramble/tree/master/setup/networking), we can reboot the Pis with the following direct shell module based command:

```
-> ansible all \
> -i inventory \
> -m shell \
> -a "sleep 1s; shutdown -r now" \
> -b \
> -B 60 \
> -P 0
192.168.86.47  | CHANGED | rc=-1 >>
192.168.86.15  | CHANGED | rc=-1 >>
192.168.86.158 | CHANGED | rc=-1 >>
192.168.86.125 | CHANGED | rc=-1 >>
```

Note that this is the last time we'll be using these "as-is" IP addresses; when the Pis restart they'll have the static IP addresses defined in the `vars.yml` file we saw earlier. So at this point, the addresses in the inventory need to be updated to reflect that, for future Ansible-based management of these machines.

This is now what's in the updated `inventory` file:

```yml
[brambleweeny]
192.168.86.12
192.168.86.13
192.168.86.14
192.168.86.15

[brambleweeny:vars]
ansible_ssh_user=pi
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
```

The `ansible_ssh_common_args` variable is still there, because we need it one more time. When the IP address of a remote host changes, `ssh` will complain again, because the key isn't in `known_hosts`. So a simple connection to each of the Pis with this `StrictHostKeyChecking=no` option set will cause that complaint to be suppressed, and also cause the new keys to be stored:

```
-> ansible -m ping all -i inventory
192.168.86.12 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
192.168.86.13 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
192.168.86.14 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
192.168.86.15 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

Now we have another four lines in our `~/.ssh/known_hosts` file, reflecting the four Pis with their new keys, making a total of eight lines (one for each host when we had the DHCP-allocated IP addresses, and then one for each host with the new statically allocated IP addresses). To be thorough, it's probably a good idea to delete the first four lines, but more importantly, it's paramount that we remove the `ansible_ssh_common_args` line from the inventory file now, to prevent future (and inadvertent) suppression of potentially real key warnings.

## Wrapping up

And that's it for this post. Ansible is indeed a powerful system, but taking the time to understand what's going on has taught me things about basic networking (and in particular some ins and outs of `ssh`) that I'm glad I know now.

Moreover, I now have a nice set of four Pis set up from a basic networking perspective, ready for the next steps.

