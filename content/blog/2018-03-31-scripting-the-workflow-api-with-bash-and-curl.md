---
title: "Scripting the Workflow API with bash and curl"
date: 2018-03-31
description: There's an API for the SAP Cloud Platform Workflow service. Let's explore!
tags:
  - shell
  - workflow
  - btp
  - api
  - community
---

I've written about the SAP Cloud Platform (SCP) Workflow service
before, including a 10-part series called [Discovering SCP
Workflow](/blog/posts/2018/01/16/discovering-scp-workflow/)
that is possibly more than you wanted to read, but hey.

The fact that the Workflow service has an API shouldn't be a surprise
to anyone. The fact that it's well designed, is informed by
Representational State Transfer (REST) principles and [nicely
documented](https://help.sap.com/doc/72317aec52144df8bc04798fd232a585/Cloud/en-US/wfs-core-api-docu.html) may
come as a pleasant surprise to some. (I'm a fan of REST as an approach
to integration - see [Forget SOAP -- build real web services with the
ICF](/blog/posts/2004/06/24/forget-soap-build-real-web-services-with-the-icf/) from
2004 for some background).

In hacking around with the Workflow service to create the series of blog
posts, and in preparation for my ASUG Webinar I'm giving next week (Wed
04 Apr - see [BITI: Introduction to SAP Cloud Platform
Workflow](https://www.asug.com/events/biti-introduction-to-sap-cloud-platform-workflow)
for how to sign up), I found myself repeatedly creating multiple
instances of workflow definitions, more than I needed, and wanted a
convenient way to tidy things up. You can use the rather excellent
[Workflow
Monitor](/blog/posts/2018/01/08/discovering-scp-workflow-the-monitor/)
app to terminate instances but you can only terminate them one at a
time, and are prompted for confirmation on each one (which is a good
thing on the whole).

## Using the API to cancel instances

So I decided to learn more about the Workflow API by using it to clean
up redundant running workflow instances, specifically by setting their
status to "CANCELED" so they disappear from view. (Yes, I'm still
struggling to look at the odd spelling of that word too, but I'm trying
to embrace that foreign English version that seems to be the standard in
these parts).

The relevant section of the API documentation for what I needed is
[here](https://help.sap.com/doc/72317aec52144df8bc04798fd232a585/Cloud/en-US/wfs-core-api-docu.html#api-WorkflowInstances-v1WorkflowInstancesWorkflowInstanceIdPatch), describing
the PATCH method on /v1/workflow-instances/{workflowInstanceId}
resources, with a payload that looks like this:

```json
{ "status" : "CANCELED" }
```

I wondered if I could write a simple script that would help me clean up
instances of the workflow definition I was working with (the
"untappdrecommendation" one, relating to the subject of the
Discovering SCP Workflow series). By the way, I'm creating multiple
instances of the workflow definition through another script on the
Google Apps platform, relating to my beer checkins, which is the subject
of the Discovering SCP Workflow series.

I'd been looking into the nuances of the CSRF token in [Discovering SCP
Workflow -- Instance
Initiation](/blog/posts/2018/01/14/discovering-scp-workflow-instance-initiation/) and
had found a sweet spot on the command line with the venerable
[curl](https://curl.haxx.se/) - the Swiss Army Knife of command line
tools for HTTP and more. Of course, that command line was in the cloud,
in the form of my personal [Cloud
Shell](https://cloud.google.com/shell/docs/) courtesy of the Google
Cloud Platform (read more about my thoughts on and use of the Google
Cloud Shell in [Monday morning thoughts: Cloud
Native](/blog/posts/2018/03/26/monday-morning-thoughts-cloud-native/)).

## Writing a shell script

So I wrote a shell script, in particular a
[bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) flavoured one,
that did the trick. Before I dive into it, I wanted to relate to you a
little story.

One of my heroes is [Randal
Schwartz](https://en.wikipedia.org/wiki/Randal_L._Schwartz), who was
partially responsible for how I successfully managed to branch out from
the SAP ecosphere in the '90s and discover Open Source, first through
the wonderful\* language Perl. He [wrote columns in various
magazines](http://www.stonehenge.com/merlyn/columns.html), each one
describing and explaining a Perl script that he'd written. I used to
spend my lunchtime with a sandwich and a cup of tea, pouring over these
columns and learning how he wrote Perl, and by osmosis, learning Perl
myself. [Thanks,
Randal](/blog/posts/2003/07/12/thanks-randal/).

\*yes, you may think differently, but I'll fight you in a dark corner
over it if necessary!

With that in mind, I'll present this short script in the style of one
of Randal's columns, in his honour. There are some caveats before I
start though - the presentation of this script is in the "warts and
all" style, as though I'd just finished making a batch of slightly
uneven [Welsh
cakes](https://www.bbcgoodfood.com/recipes/5569/welsh-cakes), and you
came by the house and I invited you in to the kitchen for a cup of tea
and one of the cakes. There's still a mess on the worktops and some
flour on the floor, but they're definitely edible and taste nice with
the tea.

First, here's the script in its entirety.

```text
 1 #!/bin/bash
 2
 3 # Cancel all running instances of a given workflow definition
 4 # USE WITH CAUTION!
 5
 6 USER=p481810
 7 COOKIES=cookiejar-${USER}.dat
 8 INSTANCEDATA=instances.dat
 9 TOKENDATA=headers.dat
10 DEFINITIONID=$1
11 WFS_API_ROOT=https://bpmworkflowruntimewfs-${USER}trial.hanatrial.ondemand.com/workflow-service/rest
12 STATUSPAYLOAD={"status":"CANCELED"}
13
14 # Abort if no definition ID has been specified
15 [ -z "$DEFINITIONID" ] && echo Specify a definition ID && exit 1
16
17 echo WARNING: This will cancel ALL instances for workflow definition "${DEFINITIONID}"
18 echo Please enter password for $USER
19 read -s PASS
20
21 rm -f $INSTANCEDATA
22 rm -f $TOKENDATA
23
24
25 # Retrieve the RUNNING instances for the given workflow definition
26 curl \
27   --user $USER:$PASS \
28   --output $INSTANCEDATA \
29   --silent \
30   "$WFS_API_ROOT/v1/workflow-instances?definitionId=${DEFINITIONID}&status=RUNNING"
31
32
33 # Retrieve CSRF token
34 curl \
35   --user $USER:$PASS \
36   --header "X-CSRF-Token: Fetch" \
37   --cookie-jar $COOKIES \
38   --verbose \
39   "$WFS_API_ROOT/v1/xsrf-token" 2> $TOKENDATA
40
41 TOKEN=`grep '< X-CSRF-Token' $TOKENDATA | awk '{print $3}'`
42
43
44 # Process each instance ID - send PATCH with cancel status
45 for INSTANCEID in `jq --raw-output '.[] .id' $INSTANCEDATA`; do
46   echo Canceling $INSTANCEID
47   curl \
48     --user $USER:$PASS \
49     --request PATCH \
50     --header "X-CSRF-Token: $TOKEN" \
51     --header "Content-Type: application/json" \
52     --cookie $COOKIES \
53     --data $STATUSPAYLOAD \
54     "$WFS_API_ROOT/v1/workflow-instances/${INSTANCEID}"
55   sleep 0.5
56
57 done
```

## A tour of the script

After the [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)) on
Line 1 and some comments on Lines 3-4, we start with some general
variables in Lines 6-12 that we'll use throughout the script:

- I've hardcoded my username relating to my personal SCP trial (this
  is my pre-SAP ID as that's where I have all the related workflow
  definitions).
- the COOKIES variable points to a user-specific file where I'll be
  asking curl to store cookies returned in responses, and to use them
  in subsequent requests. This is to address [the context required
  when using CSRF tokens](/blog/posts/2018/01/14/discovering-scp-workflow-instance-initiation/).
- via the INSTANCEDATA variable, I use a file called instances.dat to
  store the output of a request to the Workflow API to retrieve a list
  of the running instances of my workflow definition.
- TOKENDATA points to a third file used to capture the header output
  of a curl request to Fetch the CSRF token.
- There's a single parameter that needs to be supplied on the command
  line when invoking this script, and that's the ID of the workflow
  definition. This ID is captured (via \$1) in the DEFINITIONID
  variable.
- The Workflow API pattern means there's a "root" URL, and each of
  the API facilities are relative to that root. This root is specific
  to my user ID, and held in the WFS_API_ROOT variable (for some
  reason I'd decided I wanted to use underscores in that name, ah
  well).
- When calling PATCH on the individual workflow instances we want to
  cancel, we send a payload. This payload is of type application/json,
  and stored in the STATUSPAYLOAD variable for later use.

Line 15 just check that a workflow definition ID has actually been
supplied, and aborts if it hasn't. It doesn't do any checking to see
if that definition actually exists, we'll find out soon enough anyway.

Then, in Lines 17-19, we're off. After giving a warning, we ask for the
password, and bash's builtin
[read](http://wiki.bash-hackers.org/commands/builtin/read) allows us to
read it from the terminal - securely (invisibly) with the '-s'
option - into the PASS variable.

Lines 21-22 clean up before we start, removing any trace of previous
instance details or CSRF tokens.

The first thing we have to do is retrieve the list of running instances
for the given workflow definition. This is done in Lines 26-30 with a
single curl command (note that the backslash at the end of the lines
here and elsewhere allow the continuation of a command on separate
lines - i.e. the entire curl command spans lines all these lines). We
supply credentials, ask for the output to be written to the INSTANCEDATA
file and ask curl to be quiet about any download progress statistics.
The actual Workflow API resource we're making a request to (relative to
the Workflow API root) is:

```url
/v1/workflow-instances
```

and we're qualifying that request by a couple of query parameters, one
to restrict the request to instances for the given workflow definition,
and the other to restrict it to instances in the "RUNNING" state.

In case you hadn't guessed, the default method used by curl is GET.

Lines 34-39 make another curl request to fetch a CSRF token. We're
going to be making non-read-only requests next, which means that we need
a token. The curl command follows the same approach as the previous one,
but this time includes the "X-CSRF-Token: Fetch" header, and specifies
the COOKIES file to store cookies in that come back in the response.
These will define the important context in which the token is valid.
Instead of asking curl to be silent like last time, this time we're
asking it to be verbose, which means that details of the request and the
response, including the crucial HTTP headers, are shown.

The request headers are shown prefixed by a "\>" sign, and the
response headers are prefixed with a "\<" sign. Those signs help us to
think about (and see) the headers and tell at a glance whether they're
outgoing ("\>") or incoming ("\<").

The relative Workflow API resource requested in this call is:

```url
/v1/xsrf-token
```

Line 41 is where we pull out the "incoming" response header
X-CSRF-Token, in which the requested CSRF token is supplied in response
to the Fetch request. First we pull the header line out with grep, then
use awk to grab the third item in the line, positionally and (by
default) separated by whitespace. The header line will look like this:

```log
< X-CSRF-Token: F1F2B62E97BB0CF95AB126AE732E3E15
```

This token (F1F2 \...) is stored in the TOKEN variable.

Then in Lines 44-57 comes the final but crucial flourish. We process the
instances, calling PATCH and cancelling them one by one.

How do we know which instances there are to process? Well, the response
to the original /v1/workflow-instances request is stored in the file
pointed to by the INSTANCEDATA variable. This is typically what the
response will look like:

```json
[
  {
    "id": "6f23fba7-34c9-11e8-b586-00163e5a9e8b",
    "definitionId": "untappdrecommendation",
    "definitionVersion": "37",
    "subject": "Untappd Recommendation",
    "status": "RUNNING",
    "businessKey": "2506750",
    "startedAt": "2018-03-31T09:53:59.251Z",
    "startedBy": "P481810",
    "completedAt": null
  },
  {
    "id": "6e9b1c8b-34c9-11e8-b586-00163e5a9e8b",
    "definitionId": "untappdrecommendation",
    "definitionVersion": "37",
    "subject": "Untappd Recommendation",
    "status": "RUNNING",
    "businessKey": "2544284",
    "startedAt": "2018-03-31T09:53:58.354Z",
    "startedBy": "P481810",
    "completedAt": null
  }
]
```

If you look closely, you'll see that this particular example contains
two instances. The response may contain more, or might even contain none
(in which case there are no instances to process and we're done!).

Assuming we're processing the INSTANCEDATA above, we want to get a list
of instance IDs so they look like this:

```text
6f23fba7-34c9-11e8-b586-00163e5a9e8b
6e9b1c8b-34c9-11e8-b586-00163e5a9e8b
```

How should we go about this? Well, we can use the powerful
'[jq](https://stedolan.github.io/jq/)', which is described as "a
lightweight and flexible command-line JSON processor". I recorded a
short video last year on this command - [Using jq to parse out SCP
destination info](https://www.youtube.com/watch?v=yI5IQooQzW4).

Line 44 is where we use jq, inside of backticks in a "for \... do \...
done" construction. If you're wondering, if you put something in
backticks, that something is executed and the result is what is actually
represented and processed. So in Line 44, read it in your mind as
follows:

*"For each of the instances that result from calling "jq \--raw-output
'.\[\] .id' \$INSTANCEDATA", put the value each time into the
INSTANCEID variable, and do the following \..."*

So that jq invocation will turn the JSON above into the two lines of IDs
(6f23\... and 6e9b\...).

And for each instance ID in the INSTANCEID variable, we make a curl
command, in Lines 46-53, to make a PATCH request to this relative
Workflow API resource:

```url
/v1/workflow-instances/<workflowInstanceId>
```

This time, as well as passing the credentials, we specify to curl that
we want the PATCH method (rather than the default GET), we send the CSRF
token that we've just fetched, specify the payload we're about to
supply is of type "application/json", send the cookies that we will
have received from the CSRF token fetch request, and supply the payload
as we saw earlier, setting the status of the instance to "CANCELED".

Of course, in Line 55, to play nicely with the Workflow API, we wait for
500ms between each of these calls, as there may be many.

And that's about it!

I recorded a quick screencast of this in action, to give you an idea of
how it works in practice. Here it is: [Scripting the Workflow API with
bash and curl](https://youtu.be/DIoyt5Q6JuI).

Happy hacking!

This blog post was brought to you by the [Ashton
canal](/tweets/qmacro/status/979974391588061184), the
Propellerheads album
[Decksandrumsandrockandroll](https://open.spotify.com/album/4r7N5CAbYNbcdEFK7OKj5V)
(a classic, by now, surely?) and Pact Coffee's [La Esperanza
Pacamara](https://www.pactcoffee.com/coffees/la-esperanza-pacamara).

---

[Originally published on SAP Community](https://community.sap.com/t5/technology-blogs-by-sap/scripting-the-workflow-api-with-bash-and-curl/ba-p/13364396)
