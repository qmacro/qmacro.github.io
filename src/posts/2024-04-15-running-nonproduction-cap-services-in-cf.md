---
layout: post
title: Running non-production CAP services in CF
date: 2024-04-15
tags:
  - good-to-know
  - cap
  - cf
---
Sometimes I want to run test CAP services not only locally, but in the cloud. I don't want the trappings of production (which are of course important ... in production settings) such as a production grade persistence mechanism or authorisation strategy & appropriate security layer. Additionally, I like to take "[the simplest thing that could possibly work](https://podcasters.spotify.com/pod/show/tech-aloud/episodes/The-Simplest-Thing-that-Could-Possibly-Work--A-conversation-with-Ward-Cunningham--Part-V---Bill-Venners-e5dpts)" approach.

## Production mode in Cloud Foundry for CAP services

If I use `cf push` to deploy a CAP service to CF, the environment variable `NODE_ENV` is set automatically to `production`. This in turn tells the CAP server that [production grade](https://cap.cloud.sap/docs/guides/deployment/to-cf#prepare-for-production) facilities are required. 

> In what follows, I use "service" to refer to what I'm building with CAP, because that's what it is, but "application" when I'm talking about it in terms of CF, as in CF terms, especially when it comes to the `cf` commands, it's considered an app not a service.

Here's a simple example. Initialising a new project with a simple CDS model and a couple of data records, and pushing immediately to CF:

```shell
cds init --add tiny-sample non-prod-test \
  && cd $_ \
  && cf push $_
```

From the sea of log records, we can pick out some relevant ones:

```text
Creating new CAP project in ./non-prod-test

Adding feature 'nodejs'...
Adding feature 'tiny-sample'...

Successfully created project. Continue with 'cd non-prod-test'.
...
Pushing app non-prod-test to org ...
   ...
   -----> Creating runtime environment
   ...
   NODE_ENV=production
   NODE_HOME=/tmp/contents1028257736/deps/0/node
   NODE_MODULES_CACHE=true
   NODE_VERBOSE=false
   NPM_CONFIG_LOGLEVEL=error
   NPM_CONFIG_PRODUCTION=true

   ...

Waiting for app non-prod-test to start...

Instances starting...
Instances starting...
Instances starting...

...
start command:   npm start
     state     since                  cpu    memory     disk       logging        details
#0   crashed   2024-04-15T08:18:47Z   0.0%   0B of 1G   0B of 1G   0B/s of 0B/s
Start unsuccessful
```

Crashed! 

Note that the value of `NODE_ENV` was set to `production`.

Looking at the logs like this:

```shell
cf logs non-prod-test --recent
```

we can see why:

```text
...
[APP/PROC/WEB/0] OUT Invoking start command.
[APP/PROC/WEB/0] OUT > non-prod-test@1.0.0 start
[APP/PROC/WEB/0] OUT > cds-serve
...
[APP/PROC/WEB/0] OUT srv/cat-service.cds
[APP/PROC/WEB/0] OUT db/data-model.cds
[APP/PROC/WEB/0] OUT {..., "msg":"using auth strategy {\n  kind: 'jwt',\n  ..."}
[APP/PROC/WEB/0] ERR node:internal/modules/cjs/loader:1134
[APP/PROC/WEB/0] ERR const err = new Error(message);
[APP/PROC/WEB/0] ERR ^
[APP/PROC/WEB/0] ERR Error: Cannot find module '@sap/xssec'. Make sure to install it with 'npm i @sap/xssec'
...
```

In production mode CAP will (sensibly) require [@sap/xssec](https://www.npmjs.com/package/@sap/xssec).

## Setting a different value for NODE_ENV

The value for `NODE_ENV` can be set with `cf set-env`:


```shell
cf set-env non-prod-test NODE_ENV testing
```

After such an action, a [restage](https://cli.cloudfoundry.org/en-US/v8/restage.html) is required:

```shell
cf restage non-prod-test
```

This then results in a successful start of our test CAP service:

```text
This action will cause app downtime.

Restaging app non-prod-test in org ...

   -----> Creating runtime environment
   ...
   NODE_ENV=testing
   ...

Restarting app non-prod-test in org ...

Stopping app...

Waiting for app to start...

Instances starting...
Instances starting...
Instances starting...

     state     since                  cpu    memory     disk       logging        details
#0   running   2024-04-15T08:29:22Z   0.0%   0B of 0B   0B of 0B   0B/s of 0B/s
```

It's now running. And we can check the value too of that environment variable, like this:

```shell
cf env non-prod-test
```

the output of which will include this in the "user-provided" section:

```text
System-Provided:
VCAP_SERVICES: {}

VCAP_APPLICATION: {
  "application_id": "7b99b60c-94f3-4757-9928-24a61a510942",
  "application_name": "non-prod-test",
  ...
}

User-Provided:
NODE_ENV: testing
...
```

<a name="--no-start"></a>
## Mitigating the crash from the start

Of course, having to deal with an initial crash before sorting things out is a little cumbersome.

But not to worry, the `cf push` command has a `--no-start` option which means that no attempt will be made to start things up initially.

Here's an example, doing everything in a single line:

```shell
cds init --add tiny-sample non-prod-test \
  && cd non-prod-test \
  && cf push non-prod-test --no-start \
  && cf set-env non-prod-test NODE_ENV testing \
  && cf restage non-prod-test
```

The effect is that the CAP service is deployed and running in non-production mode from the outset. There may be better ways to achieve this, but that's how I do it.

Good to know!

---

You may want to read [Using @cap-js/sqlite in CF for your CAP services](/blog/posts/2024/04/15/using-@cap-jssqlite-in-cf-for-your-cap-services/) which is closely related to this, too, as well as [Easily add an explicit cds.requires.db to your CAP project's package.json](/blog/posts/2024/04/14/easily-add-an-explicit-cds.requires.db-to-your-cap-project's-package.json/).

