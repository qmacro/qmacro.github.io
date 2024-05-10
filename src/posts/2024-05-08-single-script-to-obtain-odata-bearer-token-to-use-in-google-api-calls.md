---
layout: post
title: Obtaining auth code grant type OAuth 2.0 tokens for Google APIs with a script
date: 2024-05-08
tags:
  - api
  - google
  - oauth
  - bash
  - shell
---
I wanted to programmatically append rows to a Google Spreadsheet recently. For this I needed to use the [spreadsheets.values.append](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append) method in the Sheets API v4. The API resources are protected, and according to the main page one can use an API Key or OAuth 2.0.

## OAuth 2.0 authorisation code grant type

I tried in vain to find a way to get an API Key for this API, so went for the OAuth 2.0 approach. After all, I've used OAuth a lot and felt fairly comfortable with the concepts. However, I struggled with Google's documentation on this, so ended up writing a reusable script that encapsulates the steps, partly to provide myself with some structure into which to slot the requirements.

This post is about that script and also about the steps - mostly for my own benefit, but you may find it useful too. The script itself doesn't make the call to the spreadsheet API, it just performs the appropriate OAuth 2.0 activities and then emits an access token[<sup>1</sup>](#footnotes) that can then be used in an HTTP header to authenticate the API call.

The OAuth 2.0 [grant type](https://github.com/SAP-archive/cloud-apis-virtual-event/tree/main/exercises/02#3-understand-oauth-20-grant-types) used here is the "authorisation code" grant type which makes sense as the resource is owned by me, a human (mostly).

## Token request modes and a quick demo

In OAuth 2.0 there are different parties or actors involved. In this particular grant type, or "flow", we have:

* Client: the script or program wanting to access a protected resource
* Resource Owner: the (usually human) owner of the protected resource
* Authorisation Server: coordinator of access requests and grants
* Resource Server: where the protected resource is

And to obtain and emit an access token, the script must navigate the flow between these parties, from a "cold start" where no communication with the Resource Owner has even been made, through a "warm start" where such communication has already taken place resulting in access being granted, but the access token previously obtained has expired.

These different starting points are handled with different token request modes, modes to which I refer in the script as "exchange" and "refresh".

### Exchange mode

This mode is relevant at the outset where no request has been made of the Resource Owner to grant access, and (thus) no token yet exists. What must happen here is that a request must be sent to the Resource Owner for them to grant (or deny) the request. If the request is granted, an authorisation code (hence the name of this grant type) is returned. 

Then, that authorisation code must be exchanged for an access token. The access token itself is usually supplied along with related data, including for how long the token is valid, and a refresh token (to be used in "refresh" mode).

### Refresh mode

This mode is relevant when an access token previously obtained has expired, and needs to be refreshed. A refresh token, which would have been supplied along with the access token, is required to authenticate such a refresh request.

### Script demo

Here's the script in action, showing the different modes, from a cold start, then a re-request of the token, and through a warm start where the token needs to be refreshed:

![Demo](/images/2024/05/2024-05-08-google-auth-script.gif)

## A breakdown of the script

The script, called `google-oauth`, is [available as a Gist on GitHub](https://gist.github.com/qmacro/db7c51acc00abf3c5391b586d91fd807) in its entirety. Here are some notes on what's there, to help you read through it and (more importantly) understand the intricacies of the OAuth 2.0 authorisation code grant type. Line numbers refer to the version of the script in the Gist.

### Setup (lines 3-13)

With OAuth 2.0, certain secure values are required. Here `CLIENT_ID` and `CLIENT_SECRET` credentialise the script as the Client in the flow's context. The values are stored in a `.env` file rather than in the script itself, and are sourced at runtime.

Here are the constants declared in this section:

* `REDIRECT_URI`: In exchange mode, once the Resource Owner has granted access (in a Web browser), they are redirected to another URL, usually one relating to and / or served by the Client. In this redirect, the authorisation code that is granted by the Authorisation Server is provided, and can be read and used by the Client. In this case - adopting [the simplest thing that could possibly work](https://podcasters.spotify.com/pod/show/tech-aloud/episodes/The-Simplest-Thing-that-Could-Possibly-Work--A-conversation-with-Ward-Cunningham--Part-V---Bill-Venners-e5dpts) approach - we just redirect to localhost (`127.0.0.1`) and grab the value of the code from the redirected URL[<sup>2</sup>](#footnotes).
* `SCOPE`: This is a constant defined by the Google API for the particular type of request that I want to make (appending to a spreadsheet).
* `OAUTH_BASE_URL`: The base URL of Authorisation Server where the OAuth 2.0 token requests are made.
* `MY_NAME` and `TOKEN_DATA_FILE`: This is the base name of the script itself, used to then form the name for a JSON file where the OAuth 2.0 token data received can be stored. This will be, by default, `google-oauth.json`.
* `GRACE_MINS`: The use case for the script is to be embedded within another script that needs an access token. But sometimes I will use it on the command line and then copy/paste the token emitted to use in a subsequent step. In this particular case, the possibility of the token expiring before I actually use it is small, but exists. The value is used to calculate a slightly shorter length of time than the actual lifetime of the token so that there's less of a risk of it expiring mere seconds after I have it in my paste buffer.
 
### get_value() (lines 16-21)

This is a helper function that returns the value of a given property from the JSON data in the token file, i.e. the data that's returned from the Authorisation Server. See the section below on the `request_token` function to get an idea of what that data looks like. 

### request_token() (lines 23-72)

This function is the one that requests a token, whether that's in a cold start or warm start situation. It expects two values:

* `mode`: the token request mode which will be either `exchange` or `refresh`
* `value`: if the `mode` is `exchange` then this value will be the authorisation code received from the cold start interaction with the Resource Owner, to be exchanged for an access token; otherwise, for the `refresh` mode, this value will be the refresh token to be used in that situation

There are three main parts to this function.

#### Making a request to the Authorisation Server

The two `curl` invocations are for the two different modes. Notice the differences and similarities between them:

* both invocations are made to the same `/token` endpoint of the Authorisation Server
* both requests are just seen as different grant types[<sup>3</sup>](#footnotes)
* the Client's credentials are sent in both cases
* depending on the mode (grant type), there is different data required, sent via different parameters `refresh_token` and `code`
* the URL to which to redirect the Resource Owner must also be supplied in the cold start exchange mode, via the `redirect_uri` parameter

#### Calculating an expiry value

When an authorisation code is successfully exchanged for an access token, the data that is sent back by the Authorisation Server includes not only the access token but also other information. This is what that data looks like (with the tokens truncated for brevity) - a JSON object:

```json
{
  "access_token": "ya29.a0AXooCgvtL3LSfIj-qtQ3W6OolJuvUNvNJ...",
  "expires_in": 3599,
  "refresh_token": "1//03aYGc3iqwp6kCgYIARAAGAMSNwF-L9IrdwQ...",
  "scope": "https://www.googleapis.com/auth/spreadsheets",
  "token_type": "Bearer"
}
```

The `expires_in` value is a number of seconds, often (and here) one less than a round number. Here that round number of `3600` seconds equals 1 hour - the lifetime of the access token granted, after which a new one must be requested via the "refresh" mode.

This is of course just a relative value and is of no use on its own. So a bit of jq is used:

```jq
. + { 
        refresh_after: 
            (now 
                + .expires_in
                - ($grace_mins | tonumber * 60)
            ) | floor
    }
```

to add a new property `refresh_after` to the JSON object, the value of which is simply the absolute time (in [Unix time](https://en.wikipedia.org/wiki/Unix_time)) after which the token needs to be refreshed (this is where the `GRACE_MINS` value mentioned earlier is used to give a bit of breathing space to the usage). This value can then be simply compared to the current time whenever required (and it is, in the `main` function).

#### Storage and emission

The data is then stored in the token data file and the value of the access token itself is emitted.

### main() (lines 71-101)

The `main` function simply works out what mode is required and calls the `request_token` function accordingly.

If there's a token data file already present, then this is a warm start, and the access token in there is emitted if it's not yet expired, otherwise the `request_token` function is called in refresh mode, where the value of the refresh token is supplied.

If there isn't a token data file present, then this is a cold start and a URL is generated for the human Resource Owner to follow, which ultimately results in a redirection to `127.0.0.1` with an authorisation code in the URL, which should be copied and pasted into the `Code received:` prompt. Then the `request_token` function is called in exchange mode, where the value of the authorisation code is supplied.

## Wrapping up

And that's pretty much it! While this script may be useful to someone other than me, I hope that this explanation has helped you understand OAuth 2.0, and in particular the authorisation code grant type, a little more.

---

<a name="footnotes"></a>
## Footnotes

(1) Some terminology. In this context there are two different token types. The "main" type, the one which can be used to authenticate a request to retrieve a protected resource, is an "access token". This is also referred to as a "bearer token" as the token is sent in an HTTP `Authorization` header with the prefix word "Bearer"[<sup>4</sup>](#footnotes), indicating that this token is being supplied in the context of HTTP's [Bearer authentication scheme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#bearer). The other token type in this context is the "refresh token". This token cannot be used to authenticate requests; it is used to request a fresh access token from the Authorisation Server for when the current access token has expired. This refresh procedure can take place without the involvement of the human Resource Owner. Generally, the use of the single word "token" usually refers to an access token here.

(2) I have actually experimented with using `netcat` as part of the script, to listen out for and handle the HTTP redirect to catch the authorisation code supplied, in a similar context for the Strava API, in [oauthflow-local](https://github.com/qmacro/dotfiles/blob/main/scripts/strava-api/oauthflow-local).

(3) This is in itself also fascinating, in that the [refreshing of an access token](https://oauth.net/2/grant-types/refresh-token/) is in fact a separately recognised OAuth 2.0 flow.

(4) The word "bearer" here implies that it is a token that the requester is "bearing", i.e. "carrying" with them. Note also that the `token_type` in the token data received from the Authorisation Server declares the token to indeed be of type `Bearer`.
