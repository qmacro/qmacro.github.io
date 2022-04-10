---
layout: post
title: Two-phase video uploads with YouTube API and curl
tags:
  - autodidactics
  - curl
  - youtube
  - shell
---

_TIL how to use the YouTube API to upload a video, with `curl`, using a two-phase approach._

I'm becoming more familiar with the YouTube API surface area, and a task recently required me to look into an efficient way of uploading videos to a YouTube channel. While I managed the upload technically, it was ultimately in vain due to a recent [change to the terms of service](https://developers.google.com/youtube/v3/revision_history#release_notes_07_28_2020). But it's still worth sharing the two-phase approach that I was able to take.

The YouTube Data API has a [Videos: insert](https://developers.google.com/youtube/v3/docs/videos/insert) facility. It's worth reading through this, and, if you get the chance, through other areas of the API, because they're quite similar, and what appeared initially a little overwhelming to me has become more familiar.

The approach revolves around the following flow:

1. prepare a [video resource](https://developers.google.com/youtube/v3/docs/videos#resource) - this is a JSON structure where you put your video metadata
1. POST this JSON structure to the API endpoint, and expect a Location header in the response
1. POST the binary content of the video itself to the URL that the Location header pointed to

Here's a brief example based on a throwaway script I created to use the API.

**Preparing the video resource**

I don't like writing JSON by hand, I prefer writing YAML and then having it converted to JSON on the fly. Here's a function I wrote to produce the video resource:

```bash
videoresource() {
  yq e -j -I=0 - <<EODATA
snippet:
  categoryId: 28
  title: The video title
  description: |
    A longer description that can run over
    several lines if needed. This is the text
    that appears beneath the video on YouTube.
  tags:
    - sap
    - bash
    - jq
    - scripting
    - btp
status:
  selfDeclaredMadeForKids: False
  privacyStatus: Unlisted
recordingDetails:
  recordingDate: 2018-03-31T00:00:00Z
EODATA
}
```

I'm using `yq` to evaluate (`e`) the YAML and emit JSON (`-j`). The `-I=0` tells `yq` to put all the JSON output on a single line (by default it will nicely pretty-print it with whitespace).

**Posting the JSON video resource**

In making a POST request to the [Videos: insert](https://developers.google.com/youtube/v3/docs/videos/insert) endpoint, you need to specify the `part` parameter, which, amongst other things, describes what you're sending in the video resource. I prepare my `part` parameter like this (and yes, I know I should URL encode the values, but hey, it's a throwaway script and it worked):

```bash
urlparameters() {
  paste -s -d'&' - <<EOPARM
part=snippet,status,recordingDetails
notifySubscribers=False
uploadType=resumable
EOPARM
}
```

As well as adding the optional parameter `notifySubscribers` I also added the `uploadType` parameter. While not directly documented on the [Videos: insert](https://developers.google.com/youtube/v3/docs/videos/insert) page, it appears in the [Ruby code sample](https://developers.google.com/youtube/v3/docs/videos/insert#ruby) there and seems to be quite important.

Using the two functions thus defined, it's a straightforward matter of using the Swiss Army toolchain of HTTP clients, the venerable `curl`:

```bash
curl \
  "https://www.googleapis.com/upload/youtube/v3/videos?$(urlparameters)" \
  --verbose \
  --header "Authorization: Bearer $(tget)" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --data "$(videoresource)"
```

You'll need to supply an OAuth access token as the value for the Bearer token in the `Authorization` header - I want to focus on the actual two-phase upload here so I'll leave the `tget` script that I have for another time.

Here's a slightly redacted snippet of the HTTP request and response:

```
> POST /upload/youtube/v3/videos?part=snippet... HTTP/2
> Host: www.googleapis.com
> User-Agent: curl/7.64.1
> Authorization: Bearer ya23supersekritaccesstokenhunter2
> Accept: application/json
> Content-Type: application/json
> Content-Length: 111
>
< HTTP/2 200
< content-type: text/plain; charset=utf-8
< content-type: application/json; charset=UTF-8
< x-guploader-uploadid: ABg5...
< location: https://www.googleapis.com/upload/youtube/v3/videos?part=snippet...&upload_id=ABg5someuniqueuploadidentifier
< content-length: 0
< date: Tue, 30 Mar 2021 07:14:47 GMT
< server: UploadServer
```

While there are a couple of odd aspects to that HTTP response (see below), what we're looking for here is the Location header. The URL there is the one to which we must now send the binary data of the video.

**Sending the binary data**

In the first phase we sent the JSON representation of the video resource, the video's metadata, effectively. In this second phase we now send the video content itself, to the URL in the Location header in the first phase's response.

With `curl`, sending binary data in a file is easier than you think:

```bash
curl \
  "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet...&upload_id=ABg5someuniqueuploadidentifier" \
  --header "Authorization: Bearer $(tget)" \
  --data-binary @videofile.mp4
```

**Wrapping up**

That's pretty much it. I must say, I have struggled to get my brain around some of the YouTube API surface area, but the mist is starting to clear. If you're like me and also trying to grok things, perhaps this post will help a little.

Oh yes, and those odd aspects to the first phase HTTP response earlier?

Well, for a start, why are there two different Content-Type headers?

More importantly though, sending an HTTP 200 response to the request seems a little suspect. It's HTTP status [201 CREATED](https://tools.ietf.org/html/rfc2616#section-10.2.2) that is appropriate here, not [200 OK](https://tools.ietf.org/html/rfc2616#section-10.2.1). And while a Location header in an HTTP response is appropriate (and more or less required) with a 201 CREATED status, with a 200 OK status it is not.
