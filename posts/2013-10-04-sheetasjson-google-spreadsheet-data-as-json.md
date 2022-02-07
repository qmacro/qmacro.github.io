---
layout: post
title: SheetAsJSON - Google Spreadsheet Data as JSON
tags:
- appsscript
- contentservice
- google
- json
- jsonp
- spreadsheet
- spreadsheetservice
---


This is a short post to explain how to expose a 'typical' Google spreadsheet (rows of columnar data, with first header row) as JSON, via HTTP. It might sound somewhat esoteric but believe me it’s helped me and others out quite a bit in the past.

If you’ve got a sheet and want to consume that from a web app, for example, via JSON or JSONP, or just want a different way of getting data out of a spreadsheet for further processing in the environment of your choice (that has a JSON parser) then this could be useful for you.

The idea is that you have a base URL and append a query string, supplying values for two parameters: the id of the spreadsheet and the name of the sheet within the spreadsheet. For example, for this sheet, the value for `id` would be

0AuAssa05Fog5dGc5WVNRbFZDcWJCLVY2V2NidWFKeXc

and the value for `sheet` would be

Sheet1

![](//qmacro.org/content/images/2013/10/sheet1.png)

The exposure is via a Google Apps Script, which uses a couple of Apps Script APIs from the [Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet/) and [Content](https://developers.google.com/apps-script/reference/content/) services. The script, [SheetAsJSON](https://script.google.com/d/143u0RLuppsmYJ0B3wzo6i0jZYSfIFV2NLJMHPM-Sqczpr9bLwdffc-Wx/edit?usp=sharing), runs as a [web app](https://developers.google.com/apps-script/execution_web_apps), which puts a few requirements on the script itself.

It must implement a doGet method (for HTTP GET). It must be versioned (only versions of scripts can be deployed):

![](//qmacro.org/content/images/2013/10/version.png)

It must also be deployed as a web app and made available for others (or just yourself) to execute:

![](//qmacro.org/content/images/2013/10/deploy-268x300.png)

As you can see in the above screenshot, you also need to make sure the script is authorised to run. See the [Google Apps Script documentation](https://developers.google.com/apps-script/) for more details.

The [script source is here](https://script.google.com/d/143u0RLuppsmYJ0B3wzo6i0jZYSfIFV2NLJMHPM-Sqczpr9bLwdffc-Wx/edit?usp=sharing), and contains just a handful of functions which I’ll briefly describe here.

**doGet**: Creates a text output object, grabs the id and sheet query parameter values, opens the spreadsheet, reads the header and data records (via readData_), setting them as an array of objects in the data['records'] element, and then returns the content, pausing for a second only to work out whether JSONP or JSON was required, and returning the content and the content-type appropriately.

**readData_**: Goes and reads the header row via getHeaderRow_, and then the data rows via getDataRows_. It replaces any whitespace in the header values with underscores.

**getHeaderRow_**: Grabs the first row of the sheet, with the intention of treating the content of each cell in that row as the property names of the data objects.

**getDataRows_**: Grabs the rest of the rows of the sheet, creating JavaScript objects with properties one for each column.

Yes, it’s perhaps over-simple in places, but it works for me, and may work for you too.

So with that in mind, let’s say we use the "Typical Spreadsheet" shown in the screenshot above, and take its id and the name of the first and only sheet. When we append the query parameters appropriately onto the web app’s URL for this particular instance of the script (mine), we get:

<span style="color: #ff6600;">https://script.google.com/macros/s/AKfycbxOLElujQcy1-ZUer1KgEvK16gkTLUqYftApjNCM_IRTL3HSuDk/exec</span>?<span style="color: #339966;">id=0AuAssa05Fog5dGc5WVNRbFZDcWJCLVY2V2NidWFKeXc</span>&<span style="color: #0000ff;">sheet=Sheet1</span>

which will return this:
![](//qmacro.org/content/images/2013/10/json.png)

Note that there’s a redirect which means the final URL you see in the URL bar is not the one above. Note also that the formatting in my browser is down to the great Chrome extension "[JSONView](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc?hl=en)".

Share and enjoy!


