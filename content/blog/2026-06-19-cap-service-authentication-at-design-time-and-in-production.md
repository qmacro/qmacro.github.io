---
title: CAP service authentication at design time and in production
date: 2026-06-19
tags:
  - cap
  - auth
description: In this short post I explain how the "failsafe" production auth mechanism is designed for resources served in a CAP context.
---

Recently I wrote about [mocking
auth](/blog/posts/2026/05/12/local-first-dev-with-cap-node-js-mocking-auth/) in
CAP for a rapid local-first development loop that allows you to embrace auth
design rather than defer it to later.

In development mode, unless otherwise stated (i.e. unless you add appropriate
annotations such as `@readonly`, `@requires` or `@restrict`), all resources are
accessible to everyone, even without authenticating. This is appropriate and
fitting, helping to facilitate the tight feedback loop that folks love
when developing with CAP.

What about production? Is it the same there, i.e. do we have to ensure we lock
down access before moving to production? Of course not. Here's how things work.

## Default auth settings for development

In development mode, the default auth strategy is "mocked", as we can see:

```javascript
; cds env requires.auth
{
  restrict_all_services: false,
  kind: 'mocked',
  users: {
    alice: { tenant: 't1', roles: [ 'admin' ] },
    bob: { tenant: 't1', roles: [ 'cds.ExtensionDeveloper' ] },
    carol: { tenant: 't1', roles: [ 'admin', 'cds.ExtensionDeveloper' ] },
    ...
    yves: { roles: [ 'internal-user' ] },
    '*': true
  },
  tenants: { t1: { features: [ 'isbn' ] }, t2: { features: '*' } }
}
```

Notice also the `restrict_all_services` property, which is set to `false`
by default in development mode too.

This property is at the core of the "failsafe" production auth mechanism that
means that even if you do nothing with regards to auth for your services, they
will be protected in production and only available to users who provide
appropriate authentication.

## Default auth settings for production

In the [Authentication in
Production](https://cap.cloud.sap/docs/node.js/authentication#authentication-in-production)
section in Capire, we read, in the "Enforced by Default" subsection:

> In a productive scenario with an authentication strategy configured, for
> example the default `jwt`, all CAP service endpoints are authenticated by
> default, regardless of the authorization model. That is, all services without
> `@restrict` or `@requires` implicitly get `@requires: 'authenticated-user'`.
>
> This can be disabled via feature flag
> `cds.requires.auth.restrict_all_services: false`, or by using `mocked`
> authentication explicitly in production

We can check that the default auth strategy is `jwt` in production, like this:

```javascript
; NODE_ENV=production cds env requires.auth
{ kind: 'jwt', vcap: { label: 'xsuaa' } }
```

Notice also here that `restrict_all_services` is not there, and will thus have
an undefined value:

```javascript
; NODE_ENV=production cds env requires.auth.restrict_all_services
undefined
```

## Understanding the mechanism

Now we understand the background, let's dig in to see how this works, to
understand things better.

In the runtime, there's `@sap/cds/lib/srv/protocols/https.js`, which contains:

```javascript
const cds = require('../../index'), { decodeURI } = cds.utils
const express = require('express')
const PROD = process.env.NODE_ENV === 'production'
const restrict_all = cds.env.requires.auth?.restrict_all_services !== false
const authenticated = PROD && restrict_all ? ['authenticated-user'] : false

class HttpAdapter {

  // ...

  /**
   * Returns a handler to check required roles, or null if no check required.
   * @returns {express.RequestHandler|null}
   */
  get requires() {
    const d = this.service.definition; if (!d) return null
    const rr = d['@requires'] || d['@restrict']?.map(r => r.to).flat().filter(r => r)
    const roles = !rr?.length ? authenticated : Array.isArray(rr) ? rr : [rr]
    return super.requires = roles && function requires (req, res, next) {
      const user = cds.context.user
      if (roles.some(role => user.has(role))) return next() //> ok
      else if (user._is_anonymous) return next(401) //> request login
      else cds.error (403, `User '${user.id}' is lacking required roles: [${roles}]`)
    }
  }

  // ...
}

module.exports = HttpAdapter
```

_This is from a `@sap/cds` runtime version 9.9.1 at the time of writing._

If we [stare
at](/blog/posts/2017/02/19/the-beauty-of-recursion-and-list-machinery/#initial-recognition)
this for a moment, we see that:

- `authenticated` is set to the value `['authenticated-user']` if we're in
  production and the `restrict_all_services` value is NOT explicitly set to
  `false`
- then, in the handler that gathers and checks for the specific roles required
  when a resource is requested, if there are no roles explicitly set as
  required for the service, then this `authenticated-user` role is used
  (remember, `authenticated-user` is a
  [pseudo-role](https://cap.cloud.sap/docs/guides/security/cap-users#pseudo-roles))

In other words, if you haven't set a value explicitly for
`restrict_all_services` then this will "fail safely" in production.

## Wrapping up

So there you have it. I mean, it's sort of obvious when you think about it, but
I think it's always nice to "understand by reading" and spend a bit of time to
dwell on the mechanism.
