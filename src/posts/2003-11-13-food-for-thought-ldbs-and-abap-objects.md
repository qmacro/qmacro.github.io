---
layout: post
title: Food for thought - LDBs and ABAP Objects
date: 2003-11-13
tags:
  - sapcommunity
  - abap
---
During part of this week I’ve been fighting with an old adversary, [output determination](https://help.sap.com/saphelp_46c/helpdata/en/30/c6853488601e33e10000009b38f83b/frameset.htm). In the fracas, I spent some time inside RSNAST00 (the selection program for issuing output) and couldn’t help noticing, in passing, that it used FIELD-GROUPS. This relatively old area of ABAP got me thinking about logical databases (LDBs) and their use in writing reports. You know the sort of thing:

```text
GET KNA1.

  SUMMARY.
  WRITE: / ...

GET KNB1.

  DETAIL.
  WRITE: / ...
  EXTRACT ...
```

When you execute a report that uses a logical database, you’re really just hitching a ride on the back of the database program that actually reads through the logical database you’ve specified; your GET statements are reactive, event handlers almost, that do something when passed a segment (ahem, node) of data by means of the proactivePUT statements in the database program (e.g. SAPDBDDF for the DD-F logical database).

Anyway, this brings me to something that’s been floating around in the back of my mind since TechEd last month in Basel. I attended a great session on ABAP Objects, given by Stefan Bresch and Horst Keller (thanks, chaps). In a section championing the explicit nature of ABAP Objects, there was a fascinating example of an implementation of a simple LDB using a class, and using ABAP Object events (RAISE EVENT … EXPORTING) and event subscriptions to achieve the PUT / GET relationship. Here’s that example.

There’s the ‘ldb’ class that implements a simple database read program for the the single-node (SPFLI) logical database:

```text
class ldb definition.
  public section.
    methods read_spfli.
    events spfli_ready exporting value(values) type spfli.
  private section.
    data spfli_wa type spfli.
endclass.

class ldb implementation.
  method read_spfli.
    select * from spfli
             into spfli_wa.
      raise event spfli_ready exporting values = spfli_wa.
    endselect.
  endmethod.
endclass.
```

Here we have a single public method READ_SPFLI that reads the table SPFLI, raising the event SPFLI_READY for each record it finds. This is like the PUT from our traditional database program.

Then we have a report that uses that logical database. It’s also written as a class:

```text
class rep definition.
  public section.
    methods start.
  private section.
    data spfli_tab type table of spfli.
    methods: get_spfli for event spfli_ready of ldb
                       importing values,
             display_spfli.
endclass.

class rep implementation.
  method start.
    data ldb type ref to ldb.
    create object ldb.
    set handler me->get_spfli for ldb.
    ldb->read_spfli( ).
    display_spfli( ).
  endmethod.
  method get_spfli.
    append values to spfli_tab.
  endmethod.
  method display_spfli.
    data alv_list type ref to cl_gui_alv_grid.
    create object alv_list
           exporting i_parent = cl_gui_container=>screen0.
    alv_list->set_table_for_first_display(
              exporting i_structure_name = 'SPFLI'
              changing  it_outtab        = spfli_tab ).
    call screen 100.
  endmethod.
endclass.
```

In the START method we effectively are declaring the use of the logical database by instantiating an ‘ldb’ object, doing the equivalent of specifying a logical database in a report program’s attributes section. Then we define the method GET_SPFLI as the handler for the events that will be raised (SPFLI_READY) when we trigger the database’s reading with the invocation of the READ_SPFLI method. This of course is the equivalent of a GET SPFLI statement. To initiate the reading of the database we invoke the READ_SPFLI method. Finally there’s a DISPLAY_SPFLI event in the ‘rep’ class using ALV to present the data on the screen.

I don’t know about you, but I was taken aback by the beauty of this. As we’re approaching the weekend, a time to unwind and reflect, I just thought I’d share it with you.


[Originally published on SAP Community](https://blogs.sap.com/2003/05/30/the-sapmysql-partnership/)

