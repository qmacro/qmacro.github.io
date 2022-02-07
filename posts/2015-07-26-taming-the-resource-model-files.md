---
layout: post
title: Taming the Resource Model Files
tags:
- i18n
- messagebundle
- openui5
- resourcemodel
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 23 by [Nathan Adams](http://twitter.com/lxinspc)**

UI5’s support for multiple-languages, out of the box (see the post “[Multi-language support out of the box – UI5’s pedigree](/2015/07/16/multi-language-support-out-of-the-box-ui5s-pedigree/)” in this series) is impressive and easy to use. Creating a message resource bundle in your Component.js file is straightforward, especially if picking up the user’s language preferences in the browser.

What can be less straightforward though is organising these files into something manageable, for plenty of projects, your i18n file might be on the small side, but it’s pretty easy to build up a large file. An application I’m currently working on, which perhaps has only 50% of its views defined, already has just 100 definitions in the i18n file. (A quick look at the Fiori My Travel Expenses App v2 shows there are around 1000 lines, and about 500 definitions in the resource file and whilst reasonably well documented with comments – you may well be hunting for usage of a text).

```
#XBUT,20: Button that distributes (shares) the total amount evenly between all attendees

DISTRIBUTE_EVENLY=Distribute Amounts Evenly

#XBUT,20: add internal attendee button  
ADD_INTERNAL_ATTENDEE=Add Internal Attendee

#XBUT,20: add external attendee button  
ADD_EXTERNAL_ATTENDEE=Add External Attendee

#XFLD,20: FirstName – LastName in the right order, e.g. EN: Smith, John  
ATTENDEE_FULLNAME_ARTIFACT={1}, {0}

#XTIT: title of Add Internal Attendees select dialog  
INTERNAL_ATTENDEES_TIT=Add Internal Attendees

#XTIT: title of Add External Attendees dialog  
EXTERNAL_ATTENDEES_TIT=Add External Attendees
```
*Example of a Fiori Resource Model file from ‘My Travel Expenses’*

Before we dive into the structure of the key value pairs of the file though, it’s worth thinking about if one file for all your texts makes sense. In the majority of cases, you really wouldn’t want to add further complexity by adding more files. in my experience though, there are some cases where creating additional resource files may be useful.

- You may have texts which are more prone to change, perhaps email / telephone contact details in messages; putting these into a separate file might make sense to de-risk the process of updating them when they need to change
- Common elements across a suite of applications
- Master data texts, if you have a lot of these, then consider separate files for them
- You may have texts, or elements of texts which don’t need translation, and you want to keep consistent across all languages (that email example above, you don’t want to update that in multiple language files every time)
- Lastly just like code – if it’s too long, break it up. Large app with 100’s if not 1000’s of terms? Split it up, maybe by view, or group of views.

As we move on into the structure of these files, it might not seem to be important (you can always search for a term in your chosen IDE after all), but like all good coding practices, structure can be immensely helpful in the following regards

- Identifying gaps in language files becomes easier – so you don’t discover in the first round of translation that you had some texts hardcoded into your XML views
- Making changes to texts, when a change is requested becomes a lot easier
- When sending out for translation, identifying which text is which becomes easier
- Because the file can be more easily understood, then it becomes an easier artefact to distribute, potentially removing the need for conversion back and forth between spreadsheets

How you choose to organise the language file is a matter of preference, however in my experience there are two key things I like to highlight and organise in the language file:

- Common terms
- Terms organised by View or Fragment / Control / Property

I’ll define all the common terms at the beginning of my language file. My preference for all my keys, is to use a dot notation to specify them (as it lines up nicely with identification of components). So here’s an example

```
#Common Terms
common.thing=Foo
common.items=Items
common.add=Add
...
```

Thing is though, common terms feel like something I should have in my application; you want to make sure that when you call a thing, `Foo` it’s always a `Foo` and when it’s requested to change to `Bar` I can change the common term, and my job is done. In practice though, this never really works. Why? Well I might be able to define those common terms, but in the majority of cases I always need to fit them into a longer text, such as `Create a Foo` or `Delete Foos`.

OK so maybe I can define some common texts, and do some clever pre-processing with Grunt to expand placeholders in my text, or do the same when I load the resource file

```
#Specifc Terms (pre-process)
master.things.addThing=Add {common.thing}
master.things.deleteThings=Delete {common.thing}s
```

```
#Specific Terms (post-process)
master.things.addThing=Add Foo
master.things.deleteThings=Delete Foos
```

Nice? Well not really, it’s not a great practice to make longer texts out of shorter texts. Consider the need to correctly handle plurals or other modifications you might require. Let’s say we can have `Foos` but it’s not `Bars` but `Baren` then my nice easy change above isn’t going to work. Then other languages might not have the same syntactic structures, and I could finish up chasing my tail trying to get it right across all languages, or finishing up like those pre-recorded train announcements made up of single recorded chunks – they work, but just sound awful.

There is one valid place for common terms, and you might therefore still want to define them in your main i18n file (or even a separate one you don’t load). That’s as a glossary to help those maintaining the file. Adding `common.thing=Foo` to the head of the file, even if never used will help those coming along after to understand how things are referred to. It’s a good UX practice, and fundamental to building a consistent experience.

So most of my definitions though, will be very specific to a view or fragment, and therefore, I like to identify these, in this manner, with the application as an implied root. If I’m developing a Split App, which has for example the following views

- Tasks (Master)
- Services (Master)
- Rounds (Detail)
- Details (Fragment used in Rounds)

then I’ll structure my language file, very specifically to reference the view, the control(s) in the view, and where appropriate the property. Which might result in something like.

```
#Master views
#Tasks
master.tasks.title=Maintenance Tasks
#Services
master.services.title=Active Services
master.services.toolbar.button.add=Add Service
master.services.toolbar.button.delete=Delete Services
#Detail Views
#Rounds
detail.rounds.title=Round Definition
detail.rounds.tabBar.tab.details=Details
detail.rounds.tabBar.tab.vehicles=Vehicles
#Rounds / Vehicles fragment
detail.rounds.fragment.vehicles.column.title.service=Service
detail.rounds.fragment.vehicles.column.title.capacity=Capacity
...
```

Admittedly this is quite a verbose approach, and it requires a little discipline to use, but the advantages are plain to see – I immediately get a sense of where a text might appear in the user interface, I also can get a sense of if anything is missing (for example I’d expect every view to have a `{view}.title` attribute.

By taking a structured approach to the language file, it also makes it easier to set up controls with bindings to the language file, as there is no need to try and think of a name. It goes without saying that you should be building your xml views with bindings for texts from the very start of development – no one wants to go back and to add them all in at a later date (if you do, that’s precious velocity you’re wasting).

Who thought such a straightforward flat structured concept could require so many considerations?


