---
title: A simple exploration of status transition flows in CAP
date: 2025-12-08
tags:
  - cap
  - cds
  - status
  - annotations
description: In this post I explore the new Status-Transition Flows in CAP with a simple example.
---
The [November 2025 release](https://cap.cloud.sap/docs/releases/nov25) of CAP heralded [a beta version of Status-Transition Flows](https://cap.cloud.sap/docs/releases/nov25#status-transition-flows), moving us up yet another gear in the journey towards declarative nirvana.

## Background

I wanted to try out this new significant feature, one which embodies and celebrates one of the key reasons to use CAP - [the code is in the framework, not outside of it](/blog/posts/2024/11/07/five-reasons-to-use-cap/#1-the-code-is-in-the-framework-not-outside-of-it). In the November release notes there's a brief glimpse of what this declarative approach looks like:

```cds
annotate Travels with @flow.status: Status actions {
  rejectTravel    @from: #Open  @to: #Canceled;
  acceptTravel    @from: #Open  @to: #Accepted;
  deductDiscount  @from: #Open;
};
```

Of course, this is only part of how things are set up; following the link at the end of this section of the release notes leads us to [the relevant Capire section within the Providing Services topic](https://cap.cloud.sap/docs/guides/providing-services#status-transition-flows), where we can see some of the rest of the CDS model (domain model and service definition specifically) that goes to make up the sample.

I wanted to write my own example, complete but also as simple as possible, so I could then [stare at it](/blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/#initial-recognition) for a while to let things sink in. Here's what I came up with.

![double toggle switch](/images/2025/12/double-toggle-switch.jpg)
([Image courtesy of Wikimedia Commons](https://commons.wikimedia.org/wiki/File:A_double_toggle_light_switch.jpg))

## Modelling an on/off switch

After initialising a new CAP project (with `cds init`), I just created a `services.cds` file[<sup>1</sup>](#footnotes) with the following content:

```cds
context qmacro {

  type Status : String enum {
    Up;
    Down;
  }

  entity Switches {
    key ID     : Integer;
        status : Status default #Down;
  }
}

service SwitchService {

  entity Switches as projection on qmacro.Switches

    actions {
      action flipUp();
      action flipDown();
    };


  annotate Switches with @flow.status: status actions {
    flipUp               @from       : #Down  @to: #Up;
    flipDown             @from       : #Up    @to: #Down;
  };
}
```

## Understanding the definitions

Recently I've been looking more closely at CDS modelling in general and CDL in particular, partly in the context of creating the exercise content for the [Hands-on with CAP CDS](https://github.com/SAP-samples/cap-cds-hands-on/) workshop which I gave [at UKISUG Connect](/blog/posts/2025/09/10/upcoming-talks-in-autumn-2025/#ukisug-connect) at the start of this month. And I have come to value taking my time to understand the nuances of how models are expressed. Here are a few points of interest relating to the declarations here:

- I want to have everything in a single file to keep things as simple as possible
- This includes my data model, my service definition and my annotations

With regards to the data model:

- I'm using the `context` keyword to enclose my data model, which consists of a custom named type `Status` and the entity `Switches`, with a scope name prefix (`qmacro`)
- The `status` element of `Switches` is defined with the custom `Status` type which has its possible values as a list of [enumeration values](https://cap.cloud.sap/docs/cds/cdl#enums) (`Up` and `Down`); as this is the element that's going to be used as the status element, I've given it a default value (`Down`) as it requires one (no initial state can be provided on creation as the element should be immutable)

With regards to the service definition:

- There's a pass-through projection (i.e. it defaults to an [inferred signature](https://cap.cloud.sap/docs/cds/cdl#views-with-inferred-signatures))
- The projection is for the `Switches` entity, and there's also a couple of [bound actions](https://cap.cloud.sap/docs/cds/cdl#bound-actions) declared as part of the entity definition that starts with `entity Switches ...` and finishes with the semicolon `;`
- As these are actions, which semantically signal that side-effects are likely, they'll need to be invoked with HTTP POST

Finally there's the annotation:

- it's separate to the annotation target, and arguably easier to read that way; moreover, it would likely (or at least possibly) be in a separate file if it weren't so deliberately simple (see [Separating concerns and focusing on the important stuff](/blog/posts/2024/11/04/separating-concerns-and-focusing-on-the-important-stuff/))
- it has been written in accordance with the description in the [Modelling Flows](https://cap.cloud.sap/docs/guides/providing-services#modeling-flows) section of the [Providing Services](https://cap.cloud.sap/docs/guides/providing-services) topic in Capire

### Digging in to the annotation

The annotation is quite involved:

{% raw %}
```shell
annotate <target> with <annotation> : <info> actions { ... }
{% endraw %}
```

and indeed the construction used is rather unusual:

- `annotate <target> actions { ... }` is [reasonably common](https://github.com/search?q=org%3Acapire+OR+org%3ASAP-samples+%2Fannotate+.%2B+actions%2F+path%3A*.cds&type=code)
- but _two_ effective targets in a single annotation declaration context is [extremely rare](https://github.com/search?q=org%3Acapire+OR+org%3ASAP-samples+%2Fannotate+.%2B+with+%40.%2B+actions%2F+path%3A*.cds&type=code)

What we have here is a sequence of two annotations in one. The single annotation expression above could just as readily be expressed like this[<sup>2</sup>](#footnotes):

```cds
annotate Switches with @flow.status: status;

annotate Switches actions {
  flipUp    @from: #Down  @to: #Up;
  flipDown  @from: #Up    @to: #Down;
};
```

Separating these out like this makes it a bit easier for me to grok what's going on.

First, we're blessing the `Switches` entity with the Status-Transition Flows ability; at this level, we must specify the specific element to be used for the status. It's the `status` element that's important, and we do that here by targeting the entire entity with the annotation and then specifying the element as a secondary piece of information. We could have annotated the element directly, like this:

```cds
context qmacro {

  // ...

  entity Switches {
    key ID     : Integer;

        @flow.status
        status : Status default #Down;
  }
}

service SwitchService {

  // ...

  annotate Switches actions {
    flipUp    @from: #Down  @to: #Up;
    flipDown  @from: #Up    @to: #Down;
  };

}
```

but, we'd have needed to additionally, explicitly and manually specify the `@readonly` annotation [as directed](https://cap.cloud.sap/docs/guides/providing-services#declare-flow-using-flow-status):

```cds
entity Switches {
  key ID     : Integer;

      @readonly
      @flow.status
      status : Status default #Down;
}
```

In the current state of how we make these declarations, specifying the flow status annotation at the entity level, and in the service layer, nearer to the related actions, makes more sense to me.

> In case you're wondering, the original entity level `@flow.status` annotation does indeed also cause a `@readonly` annotation to be added; here's the relevant section of the CSN that's generated:
>
> ```yaml
> definitions:
>   SwitchService.Switches:
>     kind: entity
>     "@flow.status": { "=": status }
>     projection: { from: { ref: [qmacro.Switches] } }
>     elements:
>       ID: { key: true, type: cds.Integer }
>       status:
>         type: qmacro.Status
>         default: { "#": Down, val: Down }
>         "@flow.status": true
>         "@readonly": true
> ```

And, what of the actions themselves?

### Looking at the implementation for the actions

We are used to having the CAP server provide a complete out-of-the-box CRUD handler experience for our services, on an entity by entity basis. We are also used to having to write our own handlers for custom "orthogonal" offerings such as actions and functions, as, almost by definition, they could be anything and are unguessable.

And so here we are now with a couple of actions we've declared:

```cds
// ...

service SwitchService {

  entity Switches as projection on qmacro.Switches

    actions {
      action flipUp();
      action flipDown();
    };

    // ...
```

and annotated:

```cds
  // ...

  annotate Switches actions {
    flipUp    @from: #Down  @to: #Up;
    flipDown  @from: #Up    @to: #Down;
  };
}
```

Here's what the implementation looks like, say in a corresponding `services.js` file:

```javascript
```

Yep, that's right. There is no implementation required, and no corresponding implementation file needed - that's sort of the whole point!

With the declarative Status-Transition Flows approach, we've declared everything we need with the annotations, describing what each action should do with respect to the status; what starting status requirements there are and what target statuses there can be. Here:

- `flipUp`, which will transition the status to `Up`, can only be invoked if the status is currently `Down`
- `flipDown`, which will transition the status to `Down`, can only be invoked if the status is currently `Up`

Of course, there are far more flexible and involved possibilities here, which are nicely described [in the appropriate section](https://cap.cloud.sap/docs/guides/providing-services#status-transition-flows).

## Kicking the tyres

Now I have my model and service definition, and the appropriate annotations, what does it feel like, how does one interact with and experience it?

Simply from an HTTP level, I'll give it a go. One can imagine how this then translates to calls being made from a frontend somewhere too, with buttons and other widgets in the UI enabled or disabled (or even hidden) according to the current status.

I'll start the server with `cds watch`.

### Creating my first switch

OK, are there any existing switch entities?

```bash
; curl \
  --silent \
  --url 'localhost:4004/odata/v4/switch/Switches' \
  | jq
{
  "@odata.context": "$metadata#Switches",
  "value": []
}
```

No. So I'll create one:

```bash
; curl \
  --header 'Content-Type: application/json' \
  --data '{"ID":1}' \
  --silent \
  --url 'localhost:4004/odata/v4/switch/Switches' \
  | jq
{
  "@odata.context": "$metadata#Switches/$entity",
  "ID": 1,
  "status": "Down"
}
```

It has the default status of `Down`, as expected.

### Trying to flip the switch the wrong way

The switch is down, so I want to see if I can invoke the `flipDown` action[<sup>3</sup>](#footnotes):

```bash
; curl \
  --request POST \
  --include \
  --url 'localhost:4004/odata/v4/switch/Switches/1/flipDown'
HTTP/1.1 409 Conflict
X-Powered-By: Express
OData-Version: 4.0
Content-Type: application/json; charset=utf-8
Content-Length: 151

{
  "error": {
    "message": "Action \"flipDown\" requires \"status\" to be \"[\"Up\"]\".",
    "code": "INVALID_FLOW_TRANSITION_SINGLE",
    "@Common.numericSeverity": 4
  }
}
```

Nope! Plus, the HTTP status code 409 is [nicely appropriate](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/409).

### Flipping the switch the right way

So how about flipping the switch from down to up?

```bash
; curl \
  --request POST \
  --include \
  --url 'localhost:4004/odata/v4/switch/Switches/1/flipUp'
HTTP/1.1 204 No Content
X-Powered-By: Express
OData-Version: 4.0
```

That seemed to work, but I'll check anyway:

```bash
; curl \
  --silent \
  --url 'localhost:4004/odata/v4/switch/Switches/1' \
  | jq
{
  "@odata.context": "$metadata#Switches/$entity",
  "ID": 1,
  "status": "Up"
}
```

Excellent!

## Wrapping up

Of course, there's a lot more that this new Status-Transition Flows feature offers, but for now, I'm glad I took a first look with this simple example.

For further explorations and explanations, see Simon Engel's great session [Status Transition Flows in CAP](https://www.youtube.com/watch?v=1XolXCjN5IQ) from Devtoberfest earlier this year, as well as the [coverage in Capire](https://cap.cloud.sap/docs/guides/providing-services#status-transition-flows).

And remember, this is a beta feature right now, so a great time to try it out for yourself.

## Footnotes

1. The name of this file is significant, it's one of the two file items (the rest are directory items) in the "CDS roots", as illustrated:

    ```bash
    ; cds env roots
    [
      "db/",
      "srv/",
      "app/",
      "schema",
      "services"
    ]
    ```

    This means that it's a default ("well-known") location for CDS model definitions.

1. What's really going to blow your mind is that `annotate` is really [just a shortcut variant](https://cap.cloud.sap/docs/cds/cdl#the-annotate-directive) of `extend`.

1. I use `--include` to have the response headers emitted, but have only included some of them in the output here, to keep things brief.
