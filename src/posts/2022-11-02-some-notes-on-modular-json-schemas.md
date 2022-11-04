---
layout: post
title: Some notes on modular JSON Schema definitions
tags:
  - json 
  - schemas
---
Here are a few rambling notes-to-self on understanding how a modular JSON Schema definition might be constructed. I've recently become acquainted with JSON Schema through the [BTP Setup Automator](https://github.com/SAP-samples/btp-setup-automator) project. 

> If you're not familiar with JSON Schema, there are some [great introductory tutorials](https://json-schema.org/learn/) that I would recommend. The [Slack channel](https://json-schema.org/slack) is friendly and welcoming too.

OK, so I've been experimenting with how I might construct a schema in a modular way; this is as opposed to more monolithic ones which are arguably harder to read and manage. At least for me and my small brain.

## Example schema and data

I'm going to go for a deliberately contrived and boringly simple example, where I want to have JSON data sets that contain information about two types of things - people and vehicles. 

A person has a first name and a last name (both are required). A vehicle has a make and a model (again, both are required).

A given JSON data set (represented by a single JSON file) can contain zero or more of these two types of things, where each thing is either a PERSON object or a VEHICLE object, represented by a category, contained within a "things" array, which is the single property of the outermost containing object. In other words, something like this:

```json
{
  "things": [
    {
      "category": "VEHICLE",
      "make": "Chevrolet",
      "model": "Caprice"
    },
    {
      "lastName": "Adams",
      "firstName": "DJ",
      "category": "PERSON"
    },
    {
      "make": "Tesla",
      "model": "Model 3",
      "category": "VEHICLE"
    }
  ]
}
```

Let's imagine that this is in a file called `data.json`.

## Initial schema construction

What would a schema look like for this data set, and in particular, what might a modular schema look like?

I'll start with the outermost parts, and base the schema definition on draft 07. This is not the [latest version of the JSON Schema specification](https://json-schema.org/specification.html) but it's the one [currently used to qualify the schemas in the BTP Setup Automator project](https://github.com/SAP-samples/btp-setup-automator/blob/72a380268a3fca0d310dc539116a58c186a94933/libs/btpsa-usecase.json#L2) so I'll go with that. 

```json
{
  "$schema": "https://json-schema.org/draft-07/schema",
  "description": "Things which are either people or vehicles",
  "type": "object",
  "required": [ "things" ],
  "additionalProperties": false
}
```

Let's say this is in a file called `myschema.json`. 

So far so good. This says that the JSON should be an object with a single property `things`, which is required. No other properties are allowed.

### Digression - an interesting contradiction

Interestingly, as it stands right now (deliberately cut short, unfinished), this schema represents a contradiction. If I construct some JSON that is governed by this schema, I'm damned if I do include a `things` property and damned if I don't:

Just this:

```json
{}
```

gives me an error: "Missing property: things". 

But if I add this property:

```json
{
  "things": []
}
```

an error is also surfaced to me: "Property things is not allowed" (regardless of what type of value I specify for it). 

It was not my intention to include this in my notes, but I just discovered it, and thought it worth sharing. It makes sense - the schema so far says:

_"A `things` property is required, no other properties are allowed, but there's no list of actual properties defined."_

Even more interesting - if I remove the `"additionalProperties": false` constraint, then while `{}` still gives an error, `{ "things" [] }` does not, because the "no other properties are allowed" restriction is lifted.

Anyway.

## Extending the schema 

So clearly it's time to extend the schema now to allow for the actual `things` property, describing what it should be. 

```json
{
  "$schema": "https://json-schema.org/draft-07/schema",
  "description": "Things which are either people or vehicles",
  "type": "object",
  "required": [ "things" ],
  "additionalProperties": false,
  "properties": {
    "things": {
      "type": "array",
      "items": {
        "type": "object"
      }
    }
  }
}
```

I've added a minimal definition of the `things` property. It's an array of objects, that's about all this says so far. 

But I need to constrain those object to reflect either a PERSON or a VEHICLE. And this is where I want to try out some modularisation. 

The JSON Schema keyword [oneOf](https://json-schema.org/understanding-json-schema/reference/combining.html#oneof) seems ideal for this job. The description even uses phrases like "combining schemas from multiple files" and "the given data must be valid against exactly one of the given subschemas". This is exactly the sort of thing I had in mind, in that I want to think about the constraints for a PERSON, and the constraints for a VEHICLE, as separate modular subschemas.

> I say "subschema" but want to emphasise that these subschemas are perfectly valid and independent schemas, they aren't only valid within the context of a referencing schema.

### Trying out 'oneOf'

Perhaps I should try out a simple example of `oneOf` first. In the [Schema Composition section of Understanding JSON Schema](https://json-schema.org/understanding-json-schema/reference/combining.html) the example looks like this ([FizzBuzz](https://en.wikipedia.org/wiki/Fizz_buzz), anyone?):

```json
{
  "oneOf": [
    { "type": "number", "multipleOf": 5 },
    { "type": "number", "multipleOf": 3 }
  ]
}
```

I'll insert that verbatim into the schema I have so far; to do that, I'll have to temporarily remove the `"type": "object"` constraint from the `items` property definition, as the `type` (both `number`) is defined in each of the two separate subschemas in this example (I'll come back to that in a minute, though):

```json
{
  "$schema": "https://json-schema.org/draft-07/schema",
  "description": "Things which are either people or vehicles",
  "type": "object",
  "required": [
    "things"
  ],
  "additionalProperties": false,
  "properties": {
    "things": {
      "type": "array",
      "items": {
        "oneOf": [
          { "type": "number", "multipleOf": 5 },
          { "type": "number", "multipleOf": 3 }
        ]
      }
    }
  }
}
```

As expected, this will appropriately validate the following data:

```json
{
    "things": [1, 2, 3, 4, 5]
}
```

The values 1, 2 and 4 are marked in my editor as invalid (interestingly, but not completely unexpectedly, with errors relating to the first constraint in the list, namely "Value is not divisible by 5").

### Digression - floating constraints upwards

Just coming back to that `type` definition for a second; instead of removing the `"type": "object"` constraint to make way for the two `type` definitions in what I was pasting in, I could have removed the two `type` definitions in what I was pasting in, and floated the constraint one level up, changing the value for the `type` property from `"object"` to `"number"`, like this:

```json
"items": {
  "type": "number",
  "oneOf": [
    { "multipleOf": 5 },
    { "multipleOf": 3 }
  ]
}
```

This is much cleaner. But I digress (again).

## Introducing some modularisation

First, what do I actually mean by modularisation? Well I want to have the definitions for PERSON and VEHICLE in separate files, each representing a subschema, and then I want to be able to point to those two subschema files in the context of this `oneOf` section.

Why? Well, I feel as thought I'd be able to construct, think about and maintain schemas if they're smaller and self-contained, and then glue them together as I see fit.

### Subschemas

If I take the PERSON definition, I could define a self-contained schema that might look like this:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema",
  "title": "Person schema",
  "properties": {
    "category": { "enum": [ "PERSON" ] },
    "firstName": { "type": "string" },
    "lastName": { "type": "string" }
  },
  "required": [ "firstName", "lastName", "category" ],
  "additionalProperties": false
}
```

Similarly, here's a self-contained schema for VEHICLE:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema",
  "title": "Vehicle schema",
  "properties": {
    "category": { "enum": [ "VEHICLE" ] },
    "make": { "type": "string", "enum": [ "Tesla", "Chevrolet" ] },
    "model": { "type": "string" }
  },
  "required": [ "make", "model", "category" ],
  "additionalProperties": false
}
```

> I've added some vehicle manufacturer constraints for a bit of spice.

Each of these schemas is complete and self-contained, and each can be employed to validate data appropriately. But they can also be combined, as subschemas, with `oneOf`, into a larger whole.

I've put each of these into files in a subdirectory called `things/`, such that I now have this in my workspace:

```text
.
|-- myschema.json
`-- things
    |-- person.json
    `-- vehicle.json
```

### Referencing another schema

The combining can be achieved through the use of the [$ref](https://json-schema.org/understanding-json-schema/structuring.html#ref) keyword.

So to reference these two self-contained schemas to describe what the `items` can be, I can do this:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema",
  "description": "Things which are either people or vehicles",
  "type": "object",
  "required": [ "things" ],
  "additionalProperties": false,
  "properties": {
    "things": {
      "type": "array",
      "items": {
        "type": "object",
        "oneOf": [
          { "$ref": "./things/person.json" },
          { "$ref": "./things/vehicle.json" }
        ]
      }
    }
  }
}
```

### Disambiguating the possibilities

For me, there's a bit of magic that makes this sort of construction really well. Looking back at the two subschema definitions, each of them defines a `category` property, and in each case, only a single specific value for that property is valid. This constraint is achieved with the use of the [enum](https://json-schema.org/understanding-json-schema/reference/generic.html#enumerated-values) keyword, where there's just a single value in the array of possible values. 

Here's what the two definitions look like:

```json
"category": { "enum": [ "PERSON" ] }
```

and

```json
"category": { "enum": [ "VEHICLE" ] }
```

This means that for an item object to match the PERSON definition, the value of the `category` property in that object _must_ be "PERSON". Likewise, for an item object to match the VEHICLE definition, the value of the `category` property in that object _must_ be "VEHICLE". 

### Autocomplete and validation examples

This then has effects that are great for validation, and best illustrated by us imagining the creation of new `item` objects. Let's play a couple of examples out.

First, I'll add a vehicle object. 

In the `data.json` file, in the array that is the value for the `things` property, I create a new empty object `{}`:

```json
{
  "things": [
    {}
  ]
}
```

> This assumes that my editor has associated this `data.json` file with the JSON Schema in `myschema.json`. I'll talk about how this is done in another post.

On entering `{}` I immediately get a message: "Matches multiple schemas when only one must validate". Fair enough. Not enough data to go on yet.

I ask for suggestions and am presented with a combination of all the properties from the VEHICLE and PERSON schemas, i.e.:

* `category`
* `firstName`
* `lastName`
* `make`
* `model`

Also fair. I'm still at the fork in the road. 

I choose `make`, and request autocomplete, and then I'm presented with the following possible values:

* "Chevrolet"
* "Tesla"

Makes sense, these are the string values in the `enum` defined for that property, in the VEHICLE subschema. So I select "Chevrolet", and ask for suggestions for the next property. This time I'm just presented with two:

* `category`
* `make`

This also makes sense - given that the object now has a `model` property, it will only match with the VEHICLE schema. 

I choose `category` and request autocomplete. This time the value is automatically filled for me, it's "VEHICLE". It can only be that value, and there were no other values suggested.

At this stage my object looks like this:

```json
{
  "things": [
    { "make": "Chevrolet", "category": "VEHICLE" }
  ]
}
```

There's still an error showing, and this time it's "Missing property model". Of course. The validation mechanism has matched the VEHICLE subschema, and according to the `required` property in that subschema ...

```json
{
  "required": [ "make", "model", "category" ]
}
```

... the `model` property is also required. 

So I add one (autocomplete has this property as its only suggestion anyway) and specify "Caprice" as the value.

I end up with my first thing, and everything is valid:

```json
{
  "things": [
    {
      "make": "Chevrolet",
      "category": "VEHICLE",
      "model": "Caprice"
    }
  ]
}
```

For a second example, I'll add a person object.

I start out the same way as before, by adding a new `{}` empty object, and then select `category` as the property I want to create first:

```json
{
  "things": [
    {
      "make": "Chevrolet",
      "category": "VEHICLE",
      "model": "Caprice"
    },
    { "category": ... }
  ]
}
```

The autocomplete automatically suggests "PERSON" as the value. This strikes me as slightly odd, and perhaps a foible of the implementation of autocomplete in the editor I'm using. Because at this stage the choice of subschemas is still open, right? 

I guess it's sort of understandable (almost?) in that if I've asked it to suggest a value, then it needs to suggest one, and picks the first possibility, which due to the simple fact that the PERSON subschema is listed first in the `oneOf` array ...

```json
"oneOf": [
  { "$ref": "./things/person.json" },
  { "$ref": "./things/vehicle.json" }
]
```

... is "PERSON". Makes sense, sort of. 

So anyway I remove the suggested "PERSON" value and ask for suggestions again; this time, it gives me a choice of the two actual possibilities: "PERSON" and "VEHICLE". I select "PERSON" anyway, but am happy to have seen that both were presented as options.

I then proceed to ask for and then select the only two remaining possible properties which are `firstName` and `lastName` because the choice of "PERSON" for `category` has locked this object into being constrained by the corresponding subschema, add the values, and end up with:

```json
{
  "things": [
    {
      "make": "Chevrolet",
      "category": "VEHICLE",
      "model": "Caprice"
    },
    {
      "category": "PERSON",
      "firstName": "Arthur",
      "lastName": "Dent"
    }
  ]
}
```

I've put the schema / subschemas combination through its paces and am happy with the result - it's what I'd expect (modulo the questionable editor behaviour mentioned) from the overall schema.

### Improving on the category constraints

One of the reasons I write rambling notes to myself (and to you, dear reader, if - by this point in the post - you're still here) is that at the end of it, my own understanding is better. Not only that, in looking up stuff that I can reference, I learn new things.

An example of this is that in looking up the content related to [enumerated values](https://json-schema.org/understanding-json-schema/reference/generic.html#enumerated-values) I noticed, directly in the next section, that JSON Schema also has [constant values](https://json-schema.org/understanding-json-schema/reference/generic.html#constant-values)! They're new from draft 06, so are fine for me to use. 

This is a new discovery for me, and I can replace the magic earlier - `enums` with single values - with this `const` keyword. 

Taking the VEHICLE subschema as an example, here's what it looks like now:

```json
{
  "$schema": "https://json-schema.org/draft-07/schema",
  "title": "Vehicle schema",
  "properties": {
    "category": { "const": "VEHICLE" },
    "make": { "type": "string", "enum": [ "Tesla", "Chevrolet" ] },
    "model": { "type": "string" }
  },
  "required": [ "make", "model", "category" ],
  "additionalProperties": false
}
```

Using `const` makes more sense, and is more explicit. Nice!

## Wrapping up

I think the possibilities of managing schemas in a modular way are definitely there, and this brief foray into that area of JSON Schema has taught me a thing or two. I hope it has helped you become acquainted too.

![Chevrolet Caprice Classic Coupe](/images/2022/11/tdx13.jpg)

Here's a pic of my 1973 Chevrolet Caprice Classic Coupe which I had in the 1990's. Long gone, never forgotten.

## Further reading

* [Structuring a complex schema](https://json-schema.org/understanding-json-schema/structuring.html)
