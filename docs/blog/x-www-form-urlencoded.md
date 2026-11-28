---
title: "application/x-www-form-urlencoded Explained"
titleTemplate: false
description: "What application/x-www-form-urlencoded means, how keys and values are encoded, how it differs from JSON and multipart, and how to send it with fetch or axios."
headline: "How a form-urlencoded request body is built"
date: "2026-11-28"
keyword: "x-www-form-urlencoded"
faq: [{"q": "What does x-www-form-urlencoded look like?", "a": "Key and value pairs joined by &, with = between each key and value, for example field1=value1&field2=value2. Non-alphanumeric characters are percent-encoded and spaces become +."}, {"q": "When should I use multipart/form-data instead?", "a": "MDN says to use multipart/form-data when a form includes files or a lot of data, because percent-encoding makes the urlencoded format a poor fit for binary content."}, {"q": "How do I send form-urlencoded data with axios?", "a": "Pass a URLSearchParams object as the data. axios serializes plain objects to JSON by default, so an object alone is not enough."}]
---

# How a form-urlencoded request body is built

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">application/x-www-form-urlencoded is the content type an HTML form uses by default, and many older APIs still expect it. The body looks like a query string. This post shows the format, how to send it from JavaScript, and the DELETE request this project's client makes with it.</p>

## The format

[MDN's POST page](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/POST) describes it: keys and values are encoded in key-value tuples separated by `&`, with `=` between the key and the value. Non-alphanumeric characters in keys and values are percent-encoded. A space becomes `+`.

```http
POST /test HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 27

field1=value1&field2=value2
```

It is the default encoding of an HTML `<form method="post">`. The other two a form can send are `multipart/form-data` and `text/plain`.

## Compared with JSON and multipart

| | `x-www-form-urlencoded` | `application/json` | `multipart/form-data` |
| --- | --- | --- | --- |
| Body | `a=1&b=two+words` | `{"a":1,"b":"two words"}` | Parts separated by a boundary |
| Types | Strings only | Strings, numbers, booleans, null, nesting | Strings and files |
| Nested data | Only by naming convention, such as `a[b]=1` | Native | Only by naming convention |
| Files | Not suitable | Base64 at best | Designed for it |

MDN says the percent-encoding is the reason this type is not suitable for binary data, and points to `multipart/form-data` for files.

## Sending it from JavaScript

With `fetch`, pass a URLSearchParams object. The content type is set for you:

```js
await fetch("https://example.com/test", {
  method: "POST",
  body: new URLSearchParams({ field1: "value1", field2: "value 2" }),
});
// body: field1=value1&field2=value+2
```

With axios, a plain object becomes JSON. The [axios README](https://github.com/axios/axios) says to use URLSearchParams for this format:

```js
const params = new URLSearchParams({ foo: "bar" });
params.append("extraparam", "value");
axios.post("/foo", params);
```

## Reading it in Node.js

A raw body is just a string. Parse it with URLSearchParams:

```js
const body = "email=dev%2Bsignup%40mailto.plus&epin=";
Object.fromEntries(new URLSearchParams(body));
// { email: 'dev+signup@mailto.plus', epin: '' }
```

Express does the same with `express.urlencoded()`.

## A DELETE request with a form body

`temp-mail-plus-api` is an unofficial client for tempmail.plus. It is not affiliated with or endorsed by Temp Mail Plus.

tempmail.plus deletes a mail with a DELETE request whose body is form-encoded. The client builds it in [src/http.client.ts](https://github.com/halitsever/temp-mail-plus-api/blob/main/src/http.client.ts):

```ts
return this.axiosInstance.delete<T>(url, {
    data: new URLSearchParams(body).toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
})
```

Here is what reached a local test server when the client deleted mail 42 for `dev+signup@mailto.plus`:

```text
DELETE /api/mails/42
Content-Type: application/x-www-form-urlencoded; charset=UTF-8

email=dev%2Bsignup%40mailto.plus&epin=
```

Two details. A DELETE with a body is allowed, and the axios README lists DELETE among the methods where `data` is sent. And because the body goes through URLSearchParams, the plus sign is encoded as `%2B` and arrives intact, unlike in the client's inbox request, which the [encodeURIComponent post](/blog/encodeuricomponent) covers.

## Common mistakes

- Sending an object with axios and expecting a form. It arrives as JSON.
- Setting the header by hand but sending `JSON.stringify(...)` as the body.
- Encoding values with `encodeURIComponent` and then passing them to URLSearchParams, which encodes them a second time.
- Building the body with string concatenation and forgetting that `&`, `=` and `+` inside a value must be encoded.

## FAQ

### What does x-www-form-urlencoded look like?

Key and value pairs joined by &, with = between each key and value, for example field1=value1&field2=value2. Non-alphanumeric characters are percent-encoded and spaces become +.

### When should I use multipart/form-data instead?

MDN says to use multipart/form-data when a form includes files or a lot of data, because percent-encoding makes the urlencoded format a poor fit for binary content.

### How do I send form-urlencoded data with axios?

Pass a URLSearchParams object as the data. axios serializes plain objects to JSON by default, so an object alone is not enough.

## Related posts

- [Building and parsing query strings with URLSearchParams](/blog/urlsearchparams)
- [What encodeURIComponent escapes, and the bug it prevents](/blog/encodeuricomponent)
- [Setting a timeout in axios and handling the error](/blog/axios-timeout)
- [All posts](/blog/)
