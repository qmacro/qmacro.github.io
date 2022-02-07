---
layout: post
title: ETag-enabled wget
---


Well, a little evening hack while watching [Inspector Morse](http://www.inspectormorse.co.uk/) has produced a minimalist script `wget.pl` – a tiny wrapper around the **wget** command so that you can be more polite when retrieving HTTP based information – in particular RSS feeds.

The idea was sparked by [Simon](http://www.pocketsoap.com/weblog)'s [post](http://www.pocketsoap.com/weblog/stories/2002/05/19/bdgToEtags.html) about using HTTP 1.1's ETag and If-None-Match headers. I wanted to write as small and minimal a script as possible, and rely on as little as possible (hence the cramped code style), in honour of [Blosxom](http://www.oreillynet.com/%7Erael/lang/perl/blosxom), and of course [Blagg](http://www.oreillynet.com/%7Erael/lang/perl/blagg), the RSS aggregator, for which the script was designed. You should be able to drop this script reference into Blagg by specifying the RSS retrieval program like this:

`my $get_prog = '/path/to/wget.pl';`

Don’t forget, the ETag advantage is only to be had from static files served by HTTP. Information generated on the fly, such as that from CGI scripts (such as [Blosxom](http://www.oreillynet.com/%7Erael/lang/perl/blosxom)) aren’t given ETags.

 

**Update 06/06/2012**

It’s now just over 10 years since I originally wrote this post, and in relation to a [great post on REST by Sascha Wenninger over on the SAP Community Network](http://scn.sap.com/community/technology-innovation/blog/2012/06/03/restful-apis-from-scratch-lessons-learnt-so-far), I’ve just re-found the script — thanks to a [comment on Mark Baker’s blog](http://www.markbaker.ca/blog/2003/04/etag-enabled-wget-wrapper/) that [pointed to wget.pl being part of a Ruby RDF test package](http://www.w3.org/2001/12/rubyrdf/pack/tests/scutter/wget.pl). Thanks mrG, whoever you are! 

Here’s the script in its rude entirety for your viewing pleasure.

```perl
#!/usr/bin/perl -w

# ETag-aware wget
# Uses wget to more politely retrieve HTTP based information
# DJ Adams
# Version 0+1b

# wget --header='If-None-Match: "3ea6d375;3e2eee38"' http://www.w3.org/

# Changes
# 0+1b 2003-02-03 dja added User-Agent string to wget call
# 0+1 original version

use strict;
my $cachedir = '/tmp/etagcache'; # change this if you want
my $etagfile = "$cachedir/".unpack("H*", $ARGV[0]); 
my $etag = `cat $etagfile 2>/dev/null`;
$etag =~ s/\\"/"/g;
$etag =~ s/^ETag: (.*?)\n$/$1/ and $etag = qq[--header='If-None-Match: $etag'];

my $com="wget -U 'blagg/0+4i+ (wget.pl/0+1b)' --timeout=60 -s --quiet $etag -O - $ARGV[0]";
print "Running: $com";

my ($headers, $body) = split(/\n\n/, `wget -U 'blagg/0+4i+ (wget.pl/0+1b)' --timeout=60 -s --quiet $etag -O - $ARGV[0]`, 2);
print "Got headers: $headers\n\n";
if (defined $body) {
  ($etag) = $headers =~ /^(ETag:.*?)$/m;
  print "Return value etag: $etag";
  defined $etag and $etag =~ s/\"/\\\"/g, `echo '$etag' > $etagfile`;
  print "\n==========\n";
  print $body;
}
else {
  print "Cached.";
}
```
