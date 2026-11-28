---
title: "URLSearchParams in JavaScript: Build and Read Queries"
titleTemplate: false
description: "How URLSearchParams builds and parses query strings in JavaScript and Node.js: append, get, set, toString, why + turns into a space, and form bodies."
headline: "Building and parsing query strings with URLSearchParams"
date: "2026-11-28"
keyword: "urlsearchparams"
faq: [{"q": "Does URLSearchParams encode values?", "a": "Yes, when it serializes. toString() percent-encodes everything outside ASCII letters, digits and * - . _ and writes a space as +. get() and append() work with plain, unencoded values."}, {"q": "Why does URLSearchParams turn + into a space?", "a": "It parses strings as application/x-www-form-urlencoded, where + stands for a space. MDN recommends append() for values that may contain a plus, because append() takes the value as it is."}, {"q": "Can URLSearchParams parse a full URL?", "a": "No. The constructor strips one leading question mark but does not parse a full URL. Use new URL(href).searchParams for that."}]
---

# Building and parsing query strings with URLSearchParams

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">URLSearchParams is the built-in way to read and write the part of a URL after the question mark. It works in browsers and in Node.js without an import. This post shows the methods you use most, the one behaviour that surprises people, and how this project's client uses it for request bodies.</p>

## Create one

The constructor takes a query string, an object, or nothing ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)):

```js
new URLSearchParams("q=URLUtils.searchParams&topic=api");
new URLSearchParams({ email: "dev@mailto.plus", epin: "" });
new URLSearchParams();
```

It strips one leading `?` but does not parse a whole URL. For a full address, use the `searchParams` property of a `URL` object:

```js
const url = new URL("https://tempmail.plus/api/mails?email=dev%40mailto.plus");
url.searchParams.get("email"); // 'dev@mailto.plus'
```

## The methods you use most

| Method | What it does |
| --- | --- |
| `append(name, value)` | Adds a pair, even if the name already exists |
| `set(name, value)` | Sets the value and removes other pairs with that name |
| `get(name)` | First value for the name, or `null` |
| `getAll(name)` | Every value for the name |
| `has(name)` | Whether the name is present |
| `delete(name)` | Removes the pairs with that name |
| `sort()` | Sorts pairs by name |
| `toString()` | The query string, without a leading `?` |
| `size` | Number of pairs |

It is also iterable, so `for (const [k, v] of params)` and `Object.fromEntries(params)` work.

## Encoding: only at the edges

MDN describes the rule: URLSearchParams percent-encodes anything outside ASCII letters, digits, `*`, `-`, `.` and `_`, and writes a space as `+`, but only when it serializes or parses a whole query string. Individual keys and values you pass to `append`, `set` or `get` are always the plain text.

```js
const p = new URLSearchParams({ email: "dev+signup@mailto.plus" });
p.toString();      // 'email=dev%2Bsignup%40mailto.plus'
p.get("email");    // 'dev+signup@mailto.plus'
```

So never encode a value before you hand it over. MDN warns that an already encoded value is treated as plain text and encoded a second time.

## The plus sign trap

When you construct it from a string, a `+` means a space:

```js
new URLSearchParams("email=dev+signup@mailto.plus").get("email");
// 'dev signup@mailto.plus'
```

That is correct for form data, and it is what a server does with an unencoded `+` in a query. MDN's advice is to never build URLSearchParams from interpolated strings and to use `append()` instead. The [encodeURIComponent post](/blog/encodeuricomponent) shows the same mistake in this project's own inbox request, where an address with a plus reaches the server with a space in it.

## Compared with encodeURIComponent

Both make a value safe, with two differences in output:

| Input | `encodeURIComponent` | `URLSearchParams` |
| --- | --- | --- |
| space | `%20` | `+` |
| `!'()~` | left as is | `%21%27%28%29%7E` |

Servers that parse query strings accept both forms. The difference matters only if you compare strings or sign URLs.

## As a request body

URLSearchParams is also the standard way to send a form body. `fetch` sets the `Content-Type` to `application/x-www-form-urlencoded;charset=UTF-8` by itself when the body is a URLSearchParams object. This project's client uses it in `deleteMailById`, where it turns `{ email, epin }` into `email=...&epin=` and sends it with a DELETE request. The [x-www-form-urlencoded post](/blog/x-www-form-urlencoded) walks through that request byte by byte.

`temp-mail-plus-api` is an unofficial client for tempmail.plus. It is not affiliated with or endorsed by Temp Mail Plus.

## In Node.js

`URLSearchParams` and `URL` are globals in current Node.js versions, the same classes as in the browser. Node.js also has the `querystring` module. Its documentation says it is faster but not a standardized API, and recommends URLSearchParams when performance is not critical or when the code should also run in a browser.

## FAQ

### Does URLSearchParams encode values?

Yes, when it serializes. toString() percent-encodes everything outside ASCII letters, digits and * - . _ and writes a space as +. get() and append() work with plain, unencoded values.

### Why does URLSearchParams turn + into a space?

It parses strings as application/x-www-form-urlencoded, where + stands for a space. MDN recommends append() for values that may contain a plus, because append() takes the value as it is.

### Can URLSearchParams parse a full URL?

No. The constructor strips one leading question mark but does not parse a full URL. Use new URL(href).searchParams for that.

## Related posts

- [What encodeURIComponent escapes, and the bug it prevents](/blog/encodeuricomponent)
- [How a form-urlencoded request body is built](/blog/x-www-form-urlencoded)
- [Calling the Temp Mail Plus endpoints from Python and Node.js](/blog/temp-mail-api-python)
- [All posts](/blog/)
