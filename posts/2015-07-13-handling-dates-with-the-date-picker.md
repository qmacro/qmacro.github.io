---
layout: post
title: Handling Dates with the Date Picker
tags:
- datepicker
- openui5
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 10 by [James Hale](https://twitter.com/jameshale14)**

![Date Picker control]( {{ "/img/2018/02/30ui5-10-date-picker.jpg" | url }})

When creating applications, the experiences of the user should be one of the key considerations that drives build and development.  One aspect of this is the way that data is entered, saved and displayed to the user, which can drastically affect the usability of an application.

For this short post, we’re going to take a look at the [Date Picker](https://openui5.hana.ondemand.com/explored.html#/entity/sap.m.DatePicker/samples), which is an input control in the OpenUI5 library used for simple capture of dates from the user.  As we all know, dates can be somewhat of a nuisance to work with, especially when entering on small screens with particular formats.  This control aims to ease this with a calendar style view of dates to select from.

It’s a simple, yet effective, little control that allows users to quickly select dates with a familiar and quick to use calendar style view.  The control is also configurable to display different date formats based upon the `displayFormat` property, which can be useful when screen real estate is at a premium.

By using controls like the Date Picker with dedicated input mechanisms, we can all aim to make our applications easier to use within the day to day lives of users.

For additional controls focussed around date and time input, take a look at the [Date Range](https://openui5.hana.ondemand.com/explored.html#/entity/sap.m.DateRangeSelection/samples) [Selection](https://sapui5.hana.ondemand.com/sdk/explored.html#/entity/sap.m.DateRangeSelection/samples) control when working with time periods, as well as the [Date Time Input](https://openui5.hana.ondemand.com/explored.html#/entity/sap.m.DateTimeInput/samples) when making forms that handle dates and times together.
