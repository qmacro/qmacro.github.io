---
layout: post
title: How can I access the entire URL in my plugin?
tags:
- blosxom
- howto
- plugin
---


Use the CGI.pm module in the plugin:

use CGI qw/:standard/; $url = url(); $path_info = path_info()

You, unfortunately, can’t get to the #entry bit since that’s never sent to the Web server. That’s handled by the browser alone.


