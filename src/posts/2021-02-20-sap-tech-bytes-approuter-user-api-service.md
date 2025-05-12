---
layout: post
title: "SAP Tech Bytes: Approuter User API Service"
date: 2021-02-20
tags:
  - sapcommunity
  - saptechbytes
---
*Use a simple example to kick the tyres of the new User API Service
available in the `@sap/approuter` NPM package.*

In the [SAP Developer News episode for calendar week
04](https://www.youtube.com/watch?t=461&v=PgCaIHp1JFY&feature=youtu.be),
there was an
[item](https://www.youtube.com/watch?v=PgCaIHp1JFY&list=PL6RpkC85SLQAVBSQXN9522_1jNvPavBgg&index=4&t=462s)
covering updates to some NPM packages, including
[\@sap/approuter](https://www.npmjs.com/package/@sap/approuter) - which
now has a [User API
Service](https://www.npmjs.com/package/@sap/approuter#user-api-service).
If you're interested in kicking the tyres of this new User API and
getting a simple example up and running, this quick post is for you
(there's a link to files in our GitHub repo at the end).

The simplest thing that could possibly work is an
`@sap/approuter`
based app with a minimal configuration as described in the [User API
Service
section](https://www.npmjs.com/package/@sap/approuter#user-api-service).
That app needs to be bound to a minimally configured instance of the
Authorization & Trust Management service (aka "xsuaa") and running in
Cloud Foundry (CF).

## App with minimal configuration

While the app is still effectively a Node.js package, there is no code,
just configuration. First, in the form of the Node.js `package.json`
file, which looks like this:

```json
{
  "name": "userapitest",
  "scripts": {
    "start": "node node_modules/@sap/approuter/approuter.js"
  },
  "dependencies": {
    "@sap/approuter": "^9.1.0"
  }
}
```

The built-in `approuter.js` script is run directly when the app is
started. It will look for configuration and find it in an
`xs-app.json` file, the contents of which should look like this:

```json
{
  "welcomeFile": "/user-api/attributes",
  "routes": [
    {
      "source": "^/user-api(.*)",
      "target": "$1",
      "service": "sap-approuter-userapi"
    }
  ]
}
```

Note that the welcomeFile property is used to automatically redirect us
to one of the two endpoints supported by the User API Service - the
"attributes" endpoint. The rest of the configuration is taken directly
from the
[documentation](https://www.npmjs.com/package/@sap/approuter#user-api-service).

The xsuaa instance needs some minimal configuration - an app name and
the tenant mode in which it is to run. Here it is, in an
`xs-security.json` file:

```json
{
  "xsappname": "userapitest",
  "tenant-mode": "dedicated"
}
```

We can use a simple manifest for the CF command `cf push`, to save on
typing. This defines what we need (although it doesn't cause the
creation of the xsuaa service instance, like an MTA based approach
would, but we're keeping things as simple as possible here). The
contents of that manifest - in the `manifest.yml` file, are as
follows:

```yaml
    applications:
    - name: userapitest
      disk_quota: 256M
      instances: 1
      memory: 256M
      random-route: true
      services:
     - xsuaa-application
      stack: cflinuxfs3
```

### **Setting things up**

So all we need to do now is to create the xsuaa service instance, with
the "application" plan & those `xs-security.json` settings, specifying
the name `xsuaa-application` (as that's what is expected via the
entry in the manifest), and then run the `cf push`.

Let's take those steps now. First, the service instance creation:

```shell
; cf create-service xsuaa application xsuaa-application -c xs-security.json 
Creating service instance xsuaa-application in org xde3af75trial / space dev as sapdeveloper@example.com...
OK
```

Now the xsuaa service instance exists, we can create & deploy the app
and have it bound to that service instance:

```shell
; cf push -f manifest.yml
Pushing from manifest to org xde3af75trial / space dev as sapdeveloper@example.com...
Using manifest file /Users/sapdeveloper/Projects/userapitest/manifest.yml
Getting app info...
Creating app with these attributes...
+ name:         userapitest
  path:         /Users/i347491/Projects/userapitest
+ disk quota:   256M
+ instances:    1
+ memory:       256M
+ stack:        cflinuxfs3
  services:
+   xsuaa-application
  routes:
+   userapitest-grouchy-chimpanzee-nx.cfapps.eu10.hana.ondemand.com
[...]
Waiting for app to start...
[...]
     state     since                  cpu    memory          disk         details
#0   running   2021-02-19T17:55:10Z   0.0%   35.6K of 256M   8K of 256M
;
```

And that's it!

## Checking the results

Accessing the route given in the output (the
"userapitest-grouchy-chimpanzee.nz" route, here) in the browser
results in this output, generated directly by the User API Service for
the `/user-api/attributes` path:

```shell
{
  firstname: "SAP",
  lastname: "Developer",
  email: "sapdeveloper@example.com",
  name: "sapdeveloper@example.com",
}
```

And the output for the `/user-api/currentUser` path looks like this:

```shell
{
  firstname: "SAP",
  lastname: "Developer",
  email: "sapdeveloper@example.com",
  name: "sapdeveloper@example.com",
  displayName: "SAP Developer (sapdeveloper@example.com)",
}
```

### **Trying it yourself**

There's a branch for this SAP Tech Bytes post in the accompanying [SAP
Tech Bytes repository](https://github.com/SAP-samples/sap-tech-bytes):
Check it out and follow the simple instructions here:

<https://github.com/SAP-samples/sap-tech-bytes/tree/2021-02-20-approuter-user-api-service>

------------------------------------------------------------------------

[![](/images/2021/02/screenshot-2021-02-22-at-11.00.25.png)](#saptechbytes)

SAP Tech Bytes is an initiative to bring you bite-sized information on
all manner of topics, in
[video](https://www.youtube.com/playlist?list=PL6RpkC85SLQC3HBShmlMaPu_nL--4f20z)
and [written](https://blogs.sap.com/tag/sap-tech-bytes/) format. Enjoy!

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/sap-tech-bytes-approuter-user-api-service/ba-p/13488396)
