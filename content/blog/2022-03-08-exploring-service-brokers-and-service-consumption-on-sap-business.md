---
title: "Exploring service brokers and service consumption on SAP Business Technology Platform"
date: 2022-03-08
tags:
  - sap-community-post
  - cloud-foundry
  - service-brokers
  - containers
description: In this post we look briefly at the Open Service Broker API, and how service brokers are used to facilitate access to services on runtimes on the SAP Business Technology Platform.
---

The advent of the SAP Service Manager (SM) brought about the ability to
connect multiple platforms and multiple service brokers together on the
SAP Business Technology Platform (SAP BTP). Services exposed by brokers
on different platforms can be instantiated wherever you need them.

To explore this a little bit, I thought I'd share an experiment, which
doesn't use SM directly, but at least helps us think about service
brokers, services, the Open Service Broker API (OSBAPI) and related
topics. That way we are more prepared to understand SM and what it
brings.

## The experiment

The experiment is to make a service available in a Cloud Foundry (CF)
space on my SAP BTP trial account. That service is a PostgreSQL
database, facilitated by the [ElephantSQL](https://www.elephantsql.com/)
PostgreSQL-as-a-Service offering, which has a free plan. The reason for
choosing this service was because there's a lovely repository on
GitHub,
[elephantsql-broker](https://github.com/JamesClonk/elephantsql-broker),
from [James Clonk](https://jamesclonk.io/), which makes this service
available via the OSBAPI, which is the standard API for service brokers
and SM.

The
[elephantsql-broker](https://github.com/JamesClonk/elephantsql-broker)
repository takes you through the steps of deploying the service broker
to a CF space, and then registering it to that space. What I want to
show you in this post is running the service broker in a container
locally on your machine, making the API available to the outside world,
and then registering it to a CF space.

Briefly, here's what we're going to do:

1. clone the repository locally
2. get an API key for the service
3. build the Docker image with the service broker
4. test an instance of the image (a container)
5. start a new instance of the image, supplying the API key and other
   info
6. expose the port, that the service broker is listening on, to the
   outside world
7. register that service broker in a CF space
8. view the service offering available, with the plans available
9. create a service with a specific plan
10. create a service key for that service instance
11. clean up afterwards

Of course, all the time, we'll be making observations as to what's
going on.

## A note on PostgreSQL availability

SAP BTP offers a hyperscaler option based PostgreSQL service, which you
should definitely consider for non-experimental requirements. It
provides a way to directly consume the PostgreSQL service provided by
infrastructure providers.

![](/images/2022/03/screenshot-2022-03-08-at-12.47.03.png)

The whole point of this particular exploration, however, is to
understand how services can be used across platforms and environments,
and how you can make your own services available to your apps on SAP
BTP, via the OSBAPI. And as a side effect of this, you gain a better
understanding of the context in which SM operates.

## The repository

All the detailed instructions you need are in this fork of the original
elephantsql-broker repository, in a new branch called "docker":

<https://github.com/qmacro/elephantsql-broker/tree/docker>

## The assumptions and prerequisites

This is all done on my local machine, which runs macOS natively, but on
which I've also installed [Docker
Desktop](https://docs.docker.com/desktop/). You are of course free to
use an alternative container engine (such as
[Podman](https://podman.io/)) if that works better for you. You are on
your own in terms of using Podman though - I have no experience there!

You'll also need access to a subaccount on SAP BTP - you may find this
tutorial helpful: [Get an SAP BTP Account for
Tutorials](https://developers.sap.com/tutorials/btp-cockpit-setup.html).
I'll be using my trial subaccount.

You'll need the [cf command line
client](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html). I
have recently moved from version 6 to version 7 recently; I only mention
this because my sample output in this post will be mostly from cf
version 7, where the options for 'cf marketplace' are different.

You'll also need [ngrok](https://ngrok.com/) to make a service
available to the outside world (this is an amazingly useful piece of
software for experimentation, learning and development in general).

Finally, you'll probably want to have [curl](https://curl.se/)
installed too. But who doesn't already have that? 🙂

Even if you don't want to follow along yourself, you may enjoy reading
through the steps anyway, to get a better understanding. I'll try to
explain what's going on along the way.

## The steps

OK, it's time to get down to it. A lot of the detailed instructions are
in the repository, so where appropriate, I'll point you to the right
places there. I'm going to use my `/tmp/` directory as the working
directory into which I'll clone the repository.

### Clone the repository

With the following command, clone the repository:

```shell
git clone https://github.com/qmacro/elephantsql-broker.git
```

The output should look something like this

```log
Cloning into 'elephantsql-broker'...
remote: Enumerating objects: 564, done.
remote: Counting objects: 100% (7/7), done.
remote: Compressing objects: 100% (7/7), done.
remote: Total 564 (delta 0), reused 3 (delta 0), pack-reused 557
Receiving objects: 100% (564/564), 6.31 MiB | 10.50 MiB/s, done.
Resolving deltas: 100% (221/221), done.
```

Once inside the cloned repository (with `cd elephantsql-broker/`), you
should then check out what branches are available remotely:

```shell
git branch -rv
```

This should show information similar to this:

```log
origin/HEAD -> origin/master
origin/docker c50c145 add info on how to run broker in a container
origin/master 9cfc107 refactor makefile
origin/recordings ed2e832 add animated recordings
```

It's the `docker` branch where I've added instructions for this, so
check that branch out:

```shell
git checkout docker
```

and you should see something like this:

```log
Branch 'docker' set up to track remote branch 'docker' from 'origin'.
Switched to a new branch 'docker'
```

Now you have the
[Dockerfile](https://github.com/qmacro/elephantsql-broker/blob/docker/Dockerfile)
which you'll need, shortly, as well as a local copy of the
[instructions](https://github.com/qmacro/elephantsql-broker/blob/docker/docker.md).

### Get an API key

Now it's time to register for the PostgreSQL platform service and [get
a free API key](https://customer.elephantsql.com/apikeys). The link is
provided in the main README, in the [Deploy service broker to Cloud
Foundry](https://github.com/qmacro/elephantsql-broker/blob/docker/README.md#deploy-service-broker-to-cloud-foundry)
section (but don't worry, you're not going to deploy the service
broker to CF,  you're going to run it in a container).

*As a quick reminder - be a good net citizen and don't abuse the free
tier of this service, or any service for that matter. I've just used it
briefly to instantiate then remove a database for this experiment.*

Here's what my API key looks like (it starts `e15dad`), in the API
Access area of my settings:

![](/images/2022/03/screenshot-2022-03-08-at-13.05.43.png)

### Build the Docker image

Next we can build the Docker image, which contains the service broker
for ElephantSQL, written in Go. The
[Dockerfile](https://github.com/qmacro/elephantsql-broker/blob/docker/Dockerfile)
is based on the simple example from the [Golang official image in Docker
Hub](https://hub.docker.com/_/golang), and looks like this:

```dockerfile
FROM golang:1.17

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN go build -v -o /usr/local/bin/ ./...

ENV TZ="Europe/London"
ENV BROKER_USERNAME="((username))"
ENV BROKER_PASSWORD="((password))"
ENV BROKER_API_URL="https://customer.elephantsql.com/api"
ENV BROKER_API_KEY="((api_key))"
ENV BROKER_API_DEFAULT_REGION="google-compute-engine::europe-west2"

CMD ["elephantsql-broker"]
```

The detail for this step can be found in the [Build the
image](https://github.com/qmacro/elephantsql-broker/blob/docker/docker.md#build-the-image)
section of the repository, but is essentially this:

```shell
docker build -t elephantsql-broker .
```

The image created will, when instantiated (i.e. when a container is
created from it), will execute the broker, which will begin listening
for incoming OSBAPI calls on port 8080 by default.

### Start a test container

Let's just kick the tyres at this stage. The service broker has a
simple health check API endpoint, which we can call to see if things are
generally OK. Let's start a container up, taking "[the simplest thing
that could possibly
work](http://c2.com/xp/DoTheSimplestThingThatCouldPossiblyWork.html)"
approach:

```shell
docker run --rm --detach --name broker elephantsql-broker
```

As output, we get a long GUID like this:

```log
67f36459a6a4290ad76165a6c78154ceb4df3663260f09d8c36c9b09f0ed5bcd
```

and are returned to the prompt. This is because we used the `--detach`
option to get the container to execute in the background. In case
you're wondering, the `--rm` option tells Docker to remove the
container once it is stopped, to keep things clean, and the `--name`
option lets us choose a name for the container.

There's nothing much to see, but we can do a couple of things. One is
to check the logs, like this:

```shell
docker logs broker
```

We see something like this:

```log
level=info msg="port: 8080"
level=info msg="log level: info"
level=info msg="broker username: ((username))"
level=info msg="api url: https://customer.elephantsql.com/api"
level=info msg="api default region: google-compute-engine::europe-west2"
```

So something is happening! Let's try to access the health check API
endpoint. But - what hostname do we use? Is it `localhost`? Well, where
we are right now, on my laptop's macOS operating system level, let's
try it:

```shell
curl localhost:8080/health
```

But this returns a message like this:

```log
curl: (7) Failed to connect to localhost port 8080: Connection refused
```

That's because the broker is listening to port 8080 but only inside the
container. Let's jump into the container and try it there. First, we
can jump in by starting a Bash shell in the container:

```log
docker exec -it broker bash
```

We're placed in a shell, inside the container (we can sort of tell
we're in the container because (a) we're suddenly the `root` user and
(b) the hostname is a generated ID):

```shell
root@6c53fdeb3134:/usr/src/app#
```

Now if we run that same `curl` invocation here (yes, `curl` is
everywhere!), we get a result:

```json
{
  "status": "ok"
}
```

That's good. Let's exit the shell (with `exit` or Ctrl-D) and then
stop the container (and it will be automatically cleaned up because of
the `--rm` earlier):

```shell
docker stop broker
```

### Start a new container with the requisite settings

Now that we know things look reasonable, let's start up a new
container, supplying what we need:

```shell
docker run
  --rm
  --detach
  --publish 8080:8080
  --env BROKER_USERNAME=brokerusername
  --env BROKER_PASSWORD=brokerpassword
  --env BROKER_API_KEY=your-api-key
  elephantsql-broker
  ```

This is detailed in the [Create a container from the
image](https://github.com/qmacro/elephantsql-broker/blob/docker/docker.md#create-a-container-from-the-image)
section of the repository.

The publishing of port 8080 outside the container to the host OS (with
the `--publish` option) means we can check the health from the macOS
level now; running this in my local shell:

```shell
curl localhost:8080/health
```

now returns:

```json
{
  "status": "ok"
}
```

What's more, we've supplied the authentication details that will be
needed to register and make OSBAPI calls to the broker from my CF space
on SAP BTP, and also the API key for the ElephantSQL service.

### Make the broker available to the outside world

We first could only access the broker when inside the container it was
running in. Now we can access the broker from the host where the Docker
engine is running (i.e. my laptop). But we need the broker available for
access from my CF space on SAP BTP.

Let's use the excellent `ngrok` to do this; it's covered in detail in
the [Make the service broker available beyond your local
machine](https://github.com/qmacro/elephantsql-broker/blob/docker/docker.md#make-the-service-broker-available-beyond-your-local-machine)
section of the repository, but briefly involves telling `ngrok` to
create a secure tunnel that will carry traffic to port 8080 on the local
host. Note that with great power comes with great responsibility; take
care to use `ngrok` sensibly here.

Invoking this:

```shell
ngrok http 8080
```

will result in that tunnel being created, giving both HTTP and HTTPS
forwarding URLs, as shown in this example monitor display:

```log
ngrok by @inconshreveable

Session Status online
Session Expires 1 hour, 59 minutes
Version 2.3.40
Region United States (us)
Web Interface http://127.0.0.1:4040
Forwarding http://0c01-86-150-217-67.ngrok.io -> http://localhost:8080
Forwarding https://0c01-86-150-217-67.ngrok.io -> http://localhost:8080

Connections ttl opn rt1 rt5 p50 p90
0 0 0.00 0.00 0.00 0.00
```

This means that the broker is now also available (protected with the
username and password specified earlier) at
[`https://0c01-86-150-217-67.ngrok.io`](https://0c01-86-150-217-67.ngrok.io),
which is also accessible from CF on SAP BTP.

### Register the service broker in CF

The trial and free tier accounts on SAP BTP give us access to different
runtimes, including Kyma / Kubernetes and Cloud Foundry. Both of these
platforms have a concept of a service catalogue, or marketplace, where
developers can check to see what services and plans are available for
consumption.

As guests on any given Cloud Foundry environment instance on SAP BTP, we
don't have full administrative access to the entire environment, but we
do have access at organisational and space level. In this context, it's
possible for us as individuals to manage service brokers at the space
level.

If you enter `cf help` in a shell, you get a summary of the different
commands, grouped into different areas. For example, there's the
"Space management" area with the `create-space`, `set-space-role` and
other commands, and there's the "Application lifecycle" area with
`apps`, `push`, `logs`, `restart` and so on.

But if you enter `cf help -a` you get a whole boatload more, including
this group of commands:

```text
SERVICE ADMIN:
service-auth-tokens List service auth tokens
create-service-auth-token Create a service auth token
update-service-auth-token Update a service auth token
delete-service-auth-token Delete a service auth token

service-brokers List service brokers
create-service-broker Create a service broker
update-service-broker Update a service broker
delete-service-broker Delete a service broker
rename-service-broker Rename a service broker

migrate-service-instances Migrate service instances from one service plan to another
purge-service-offering Recursively remove a service and child objects from Cloud Foundry database without making requests to a service broker
purge-service-instance Recursively remove a service instance and child objects from Cloud Foundry database without making requests to a service broker

service-access List service access settings
enable-service-access Enable access to a service or service plan for one or all orgs
disable-service-access Disable access to a service or service plan for one or all orgs
```

Gosh!

We'll now explore just a subset of those commands, relating to service
brokers.

What do we need to do to register our new broker? Let's have a look,
with `cf create-service-broker --help`, which shows us this:

```text
NAME:
create-service-broker - Create a service broker

USAGE:
cf create-service-broker SERVICE_BROKER USERNAME PASSWORD URL [--space-scoped]

ALIAS:
csb

OPTIONS:
--space-scoped Make the broker's service plans only visible within the targeted space

SEE ALSO:
enable-service-access, service-brokers, target
```

Because we don't have administrative access to the entire CF
environment instance, we'll need to use the `--space-scoped` option.
But that's OK, this is just an experiment to understand the different
pieces. Let's try:

```shell
cf create-service-broker \
  elephantsql \
  brokerusername \
  brokerpassword \
  https://0c01-86-150-217-67.ngrok.io \
  --space-scoped
```

This results in the following message:

```log
Creating service broker elephantsql in org 1cbb5e7etrial / space dev ...

OK
```

Moreover, we can now see the broker in the list, using
`cf service-brokers`:

```log
Getting service brokers ...

name        url
elephantsql https://0c01-86-150-217-67.ngrok.io
```

But wait, there's more to see! In the `ngrok` monitor, each request is
listed, and we see one (it's the first one) suddenly appear, and it
looks like this:

```text
GET /v2/catalog
```

What's that? Well, if we look at the [Open Service Broker API
reference](https://github.com/openservicebrokerapi/servicebroker), we
see in the
[specification](https://github.com/openservicebrokerapi/servicebroker/blob/master/spec.md),
specifically in the [Catalog
Management](https://github.com/openservicebrokerapi/servicebroker/blob/master/spec.md#catalog-management)
section, that:

> "The first endpoint that a Platform will interact with on the Service
Broker is the service catalog (`/v2/catalog`). This endpoint returns a list of
all services available on the Service Broker. Platforms query this endpoint
from all Service Brokers in order to present an aggregated user-facing
catalog."

So the process of registering the broker caused a request for the
catalog to be made - makes sense!

We can make our own call of course, to see what's returned, like this:

```shell
curl http://brokerusername:brokerpassword@localhost:8080/v2/catalog
```

It's a JSON object describing the service and plans available. If
you're interested in where this comes from, take a look at the
[catalog.yml](https://github.com/qmacro/elephantsql-broker/blob/docker/catalog.yml)
file in the repository.

Let's continue with the consumption, and keep an eye on the OSBAPI
calls made to the broker.

### View the service offerings available

Many of us are already famililar with the `cf marketplace` command. This
provides a list of available service offerings. Running it in my trial
subaccount CF space returns a lot of information! There are many, many
services available to me, each with their own plans, and surfaced
through various brokers. Here's a list, where I've removed the
"description" column to save space.

Let's stare at it for a minute:

![](/images/2022/03/screenshot-2022-03-08-at-17.29.25.png)

What do we see? Well, there are a myriad services each with different
plans. For example, the "hana-cloud-trial" service has three plans
available: "hana", "relational-data-lake" and
"hana-cloud-connection".

But what we also see is that each service is provided by a broker, shown
in the rightmost column. All but one of these brokers follow a similar
naming convention:

```text
sm-<broker-name>-<guid>
```

For example, the "hana-cloud-trial" service offering is made available
by this service broker:

```text
sm-hana-cloud-trial-1ce8c293-a0f4-40b1-a52e-a70f7ac4a749
```

Can you guess what the `sm-` prefix represents? These are all service
brokers managed by, effectively proxied by, the SAP Service Manager.

But take a look at the last entry in the list - it's our
"elephantsql" service, with the three service plans "turtle",
"spider" and "cat" that we have in the
[catalog.yml](https://github.com/qmacro/elephantsql-broker/blob/docker/catalog.yml)
file. And through what mechanism is it available to us? Via our very own
`elephantsql` service broker that we've registered to this CF space
just now. In fact, the detail in this output to `cf marketplace` was
gathered in the previous step, in the HTTP GET request to
`/v2/catalog`.

Note that when we called `cf marketplace`, the `ngrok` monitor showed no
further request. So this catalog information is cached.

Before we move on, let's explore the `-e` option of `cf marketplace`,
which lets us see the plan details for a particular service offering:

```shell
cf marketplace -e elephantsql
```

This produces a nicely formatted table like this:

```text
Getting service plan information for service offering elephantsql in org 1cbb5e7etrial / space dev ...

broker: elephantsql
plan    description                          free or paid  costs              available
turtle  Tiny Turtle - shared instance (free) free          USD 0.00/Monthly   yes
spider  Simple Spider - shared instance      paid          USD 5.00/Monthly   yes
cat     Crazy Cat - shared instance          paid          USD 10.00/Monthly  yes
```

### Create a service instance

Let's create an instance of our "elephantsql" service. The "turtle"
plan is free, so let's go for that. All we're going to do is create a
PostgreSQL database instance, and then destroy it, anyway.

We've surfaced our service availability to the `cf` level, so we can
use normal `cf` commands to create a service instance here. The
`create-service` command requires three parameters: the name of the
service, the name of the plan, and what to call the service instance
once created. As usual, I'll follow my basic pattern of naming the
service instance based on a combination of the service and plan name:

```shell
cf create-service elephantsql turtle elephantsql-turtle
```

And lo, an instance is created!

```log
Creating service instance elephantsql-turtle in org 1cbb5e7etrial / space dev ...

OK
```

But what's happened behind the scenes?

Well first of all, the `ngrok` monitor tells us that another call was
made to the service broker:

```text
PUT /v2/service_instances/fac57b37-f51e-499c-8aae-cf18fa105806
```

This is another OSBAPI call, this time a
[provisioning](https://github.com/openservicebrokerapi/servicebroker/blob/master/spec.md#provisioning)
call to request the creation of an instance of whatever service the
broker is making available.

Moreover, we can see the result of the instance creation request - we
can see the instance in the ElephantSQL console:

![](/images/2022/03/screenshot-2022-03-08-at-17.49.36.png)

### Create a service key

Let's go one stage further and create a service key. As we know, this
is information that can be bound to an app to supply credentials that
are required to operate or interact with the specific service instance.

With the `cf create-service-key` command, we can do this, and it gives
us what we want:

```shell
cf create-service-key elephantsql-turtle elephantsql-turtle-sk
```

This gives us a service key:

```log
Creating service key elephantsql-turtle-sk for service instance elephantsql-turtle ...

OK
```

And guess what? This meant another OSBAPI call made from CF to the
service broker; this time to [create a service
binding](https://github.com/openservicebrokerapi/servicebroker/blob/master/spec.md#request-creating-a-service-binding):

```text
PUT /v2/service_instances/fac57b37-f51e-499c-8aae-cf18fa105806/service_bindings/4b96c749-6fa2-43ae-a089-db8df149eaf9
```

We can ask for the contents of the service key with

```shell
cf service-key elephantsql-turtle elephantsql-turtle-sk
```

This gives us the content in JSON format:

```json
{
  "apikey": "ed0808bb-2cf6-4219-bfb0-9024...",
  "database": "qezrugwo",
  "database_uri": "postgres://qezrugwo:UTGenw...@rogue.db.elephantsql.com/qezrugwo",
  "host": "rogue.db.elephantsql.com",
  "hostname": "",
  "password": "UTGenw...",
  "port": 0,
  "scheme": "postgres",
  "uri": "postgres://qezrugwo:UTGenw...@rogue.db.elephantsql.com/qezrugwo",
  "url": "postgres://qezrugwo:UTGenw...@rogue.db.elephantsql.com/qezrugwo",
  "username": "qezrugwo"
}
```

This information ties up with what we see in the console too.

### Delete the service key and instance

We're almost at the end of our journey of exploration. Let's clean up,
and also observe what happens when we do.

First, we need to remove the service key:

```shell
cf delete-service-key elephantsql-turtle elephantsql-turtle-sk
```

After prompting, this does what we ask:

```log
Really delete the service key elephantsql-turtle-sk?> y
Deleting key elephantsql-turtle-sk for service instance elephantsql-turtle ...

OK
```

And as we can now guess, this operation is achieved with yet another
OSBAPI call to the service broker, as evidenced in the `ngrok` monitor:

```text
DELETE /v2/service_instances/fac57b37-f51e-499c-8aae-cf18fa105806/service_bindings/4b96c749-6fa2-43ae-a089-db8df149eaf9
```

Finally, let's delete the service instance itself:

```shell
cf delete-service elephantsql-turtle
```

Again, the prompt and then the confirmation:

```log
Really delete the service elephantsql-turtle?> y
Deleting service elephantsql-turtle in org 1cbb5e7etrial / space dev ...

OK
```

And as we can again guess, the beauty and balance of the use of the
OSBAPI is shown again in the `ngrok` monitor:

```text
DELETE /v2/service_instances/fac57b37-f51e-499c-8aae-cf18fa105806
```

(Observe the whole time here that the OSBAPI design respects HTTP as a
protocol and uses the methods appropriately; GET to request, PUT to
create, DELETE to remove, and so on).

## Wrapping up

This has been a long post, longer than I expected, but I hope it's been
a helpful story, an exploratory journey, that's helped you understand
some of the fascinating jigsaw puzzle pieces that is multi-cloud,
multi-environment and the SAP Business Technology Platform in general.

We've glimpsed how services are made available, got a feel for what
service brokers are and how they fit in, and seen first hand some of the
Open Service Broker API calls being made in response to regular `cf`
requests to manage service instances and keys.

I want to leave you with one question to ponder. With so many services
available, and running in different places, on different platforms and
environments, how do we make these services available to as many apps,
on as many platforms as possible, without creating a tangled mess of
multiple connections running between each platform and service broker?

Here's a clue to the answer: it might be SAP Service Manager 🙂

A quick note for my SAP colleagues: The page [Running the broker in a
Docker
container](https://github.com/qmacro/elephantsql-broker/blob/docker/docker.md) and
the corresponding
[Dockerfile](https://github.com/qmacro/elephantsql-broker/blob/docker/Dockerfile)
were added to a new branch
([docker](https://github.com/qmacro/elephantsql-broker/tree/docker)) of
a fork of the original upstream [elephantsql-broker
repository](https://github.com/JamesClonk/elephantsql-broker), in the
context of a spare time open source contribution. If you're interested
in open source, spare time contributions or third party contributions,
and how I went about this one, drop me a line.

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/exploring-service-brokers-and-service-consumption-on-sap-business/ba-p/13524313)
