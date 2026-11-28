---
title: "encodeURIComponent: Encode Query Values in JavaScript"
titleTemplate: false
description: "What encodeURIComponent escapes and what it leaves alone, how it differs from encodeURI, and how a plus sign in an email address breaks an unencoded query."
headline: "What encodeURIComponent escapes, and the bug it prevents"
date: "2026-11-28"
keyword: "encodeuricomponent"
faq: [{"q": "What does encodeURIComponent not encode?", "a": "MDN lists the characters it leaves alone: A to Z, a to z, 0 to 9 and - _ . ! ~ * ' ( ). Everything else is percent-encoded as UTF-8."}, {"q": "What is the difference between encodeURI and encodeURIComponent?", "a": "encodeURI is for a whole URL, so it keeps characters such as ? & = / and + that give a URL its structure. encodeURIComponent is for one piece, such as a query value, and escapes those characters too."}, {"q": "Why does a plus sign turn into a space?", "a": "In a query string parsed as application/x-www-form-urlencoded, + means a space. Send a literal plus as %2B, which encodeURIComponent produces."}]
---

# What encodeURIComponent escapes, and the bug it prevents

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">encodeURIComponent turns a string into something you can drop into one part of a URL, such as a query value, without changing what the URL means. This post explains what it escapes, how it differs from encodeURI, and shows a real case from this project where leaving it out changes the email address the server sees.</p>

## What it escapes

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) says `encodeURIComponent()` escapes every character except these:

```text
A-Z a-z 0-9 - _ . ! ~ * ' ( )
```

Everything else becomes one or more `%XX` sequences of its UTF-8 bytes. That includes the characters that give a URL its structure: `?`, `&`, `=`, `/`, `#`, `+`, `@` and the space.

```js
encodeURIComponent("dev+signup@mailto.plus");
// 'dev%2Bsignup%40mailto.plus'

encodeURIComponent("a b!'()*~");
// "a%20b!'()*~"
```

Both lines are output from Node.js 22. Note that a space becomes `%20`, not `+`.

## encodeURI vs encodeURIComponent

`encodeURI()` is meant for a complete URL. It leaves `?`, `&`, `=`, `/`, `+` and `#` alone because escaping them would break the URL. MDN puts it this way: compared to `encodeURI()`, `encodeURIComponent()` escapes a larger set of characters, including those that are part of the URI syntax.

```js
encodeURI("https://x/mails?email=dev+signup@mailto.plus&x=a b");
// 'https://x/mails?email=dev+signup@mailto.plus&x=a%20b'
```

Only the space changed. The `+` and the `&` inside the value survive, and that is exactly the problem when the value comes from a user.

The rule that follows: build the URL yourself and run `encodeURIComponent` on each value you insert. Use `encodeURI` only on a full URL you did not assemble and cannot take apart.

## A real case: the inbox request in this client

`temp-mail-plus-api` is an unofficial client for tempmail.plus. It is not affiliated with or endorsed by Temp Mail Plus.

The client builds its inbox request with a template string ([src/index.ts](https://github.com/halitsever/temp-mail-plus-api/blob/main/src/index.ts)):

```ts
this.httpClient.get(`/mails?email=${this.emailAddress}`)
```

The address goes in as it is. For an address made by `TempMail.generateEmail()` that is harmless, because the random user name only uses `a-z` and `0-9`. For an address you pass in yourself, it is not. Pointed at a local test server instead of tempmail.plus, the client sent these requests:

| Address passed in | Request line | What the server parses as `email` |
| --- | --- | --- |
| `dev+signup@mailto.plus` | `/api/mails?email=dev+signup@mailto.plus` | `dev signup@mailto.plus` |
| `a&b@mailto.plus` | `/api/mails?email=a&b@mailto.plus` | `a` |

The plus sign is read as a space, and the ampersand starts a new parameter. Either way the server looks up a different inbox. `fetchMailById` in the same file does wrap the address in `encodeURIComponent`, and its request came out as `/api/mails/42?email=dev%2Bsignup%40mailto.plus`, which parses back to the right address.

Until `fetchInbox` encodes its value, stick to generated addresses or addresses made of letters, digits, dots and hyphens.

## How to encode a query value correctly

Three ways, from most manual to least:

```js
const email = "dev+signup@mailto.plus";

// 1. encodeURIComponent on the value
const a = `/mails?email=${encodeURIComponent(email)}`;

// 2. URLSearchParams builds the whole query
const b = `/mails?${new URLSearchParams({ email })}`;

// 3. Let axios serialize params
axios.get("/mails", { params: { email } });
```

All three produce `email=dev%2Bsignup%40mailto.plus`. The [URLSearchParams post](/blog/urlsearchparams) covers the second option, including one difference: it writes a space as `+` instead of `%20`.

## Characters it leaves alone

`!`, `'`, `(`, `)` and `*` pass through unchanged. They are legal in a query value, but RFC 3986 reserves them, and some servers treat them specially. MDN gives a helper for strict RFC 3986 output:

```js
function encodeRFC3986URIComponent(str) {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}
```

## When it throws

A lone surrogate, half of a UTF-16 pair, cannot be encoded as UTF-8. MDN documents a `URIError` for that case. In Node.js 22 the message reads `URIError: URI malformed`. Strings typed by people rarely contain one, but strings cut at a fixed length in the middle of an emoji can.

## FAQ

### What does encodeURIComponent not encode?

MDN lists the characters it leaves alone: A to Z, a to z, 0 to 9 and - _ . ! ~ * ' ( ). Everything else is percent-encoded as UTF-8.

### What is the difference between encodeURI and encodeURIComponent?

encodeURI is for a whole URL, so it keeps characters such as ? & = / and + that give a URL its structure. encodeURIComponent is for one piece, such as a query value, and escapes those characters too.

### Why does a plus sign turn into a space?

In a query string parsed as application/x-www-form-urlencoded, + means a space. Send a literal plus as %2B, which encodeURIComponent produces.

## Related posts

- [Building and parsing query strings with URLSearchParams](/blog/urlsearchparams)
- [How a form-urlencoded request body is built](/blog/x-www-form-urlencoded)
- [Checking an email address in JavaScript, and where to stop](/blog/email-validation-javascript)
- [All posts](/blog/)
