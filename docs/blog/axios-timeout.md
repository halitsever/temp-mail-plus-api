---
title: "Axios Timeout: Default, Per Request and Errors"
titleTemplate: false
description: "Axios timeout explained: the default of 0, setting it on an instance or one request, the ECONNABORTED error it throws, and AbortSignal for a total time limit."
headline: "Setting a timeout in axios and handling the error"
date: "2026-11-28"
keyword: "axios timeout"
faq: [{"q": "What is the default timeout in axios?", "a": "0, which means no timeout. The axios README shows the option as timeout: 1000 with the comment default is 0 (no timeout)."}, {"q": "What error does an axios timeout throw?", "a": "An AxiosError with code ECONNABORTED and a message such as timeout of 500ms exceeded. With transitional.clarifyTimeoutError set to true the code is ETIMEDOUT instead."}, {"q": "How do I set a timeout for one axios request?", "a": "Pass timeout in that request's config, for example axios.get(url, { timeout: 5000 }). It overrides the instance default for that call only."}]
---

# Setting a timeout in axios and handling the error

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">axios waits forever by default. A request to a server that never answers keeps your script or test hanging until something else kills it. This post covers the timeout option, the error you get when it fires, and how this project's client sets a 10 second default that you can change.</p>

## The default is no timeout

The request config in the [axios README](https://github.com/axios/axios) documents the option like this:

```js
// `timeout` specifies the number of milliseconds before the request times out.
// If the request takes longer than `timeout`, Axios aborts it.
timeout: 1000, // default is `0` (no timeout)
```

The same README adds a note to set a timeout in production, because without one a stalled request can hang indefinitely.

## Three places to set it

```js
const axios = require("axios");

// 1. Library default, for every request from the global axios
axios.defaults.timeout = 2500;

// 2. Instance default
const api = axios.create({ baseURL: "https://example.com/api", timeout: 10000 });

// 3. One request, overriding the instance
await api.get("/slow-report", { timeout: 30000 });
```

The request config wins over the instance, and the instance wins over the library default.

## The error you get

Pointed at a local server that waits two seconds before answering, a request with `timeout: 500` failed like this with axios 1.21.1:

```text
code:    ECONNABORTED
message: timeout of 500ms exceeded
```

The README's [timeout section](https://github.com/axios/axios#handling-timeouts) checks for both codes, because `transitional: { clarifyTimeoutError: true }` switches the code to `ETIMEDOUT`:

```js
try {
  const res = await api.get("/data", { timeout: 5000 });
  console.log(res.data);
} catch (error) {
  if (axios.isAxiosError(error) && (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT")) {
    console.error("Request timed out");
  } else {
    throw error;
  }
}
```

`ECONNABORTED` also appears when a request is aborted for other reasons, so the message is the more precise signal if you need to tell them apart.

## A POST with a timeout

The config object is the third argument of `post`, after the body:

```js
await axios.post(
  "https://example.com/api/items",
  { name: "test" },
  { timeout: 5000 },
);
```

Putting `timeout` in the second argument by mistake sends it as part of the JSON body and leaves the request without a limit.

## A hard limit with AbortSignal

axios supports `AbortController` through the `signal` option. With [AbortSignal.timeout()](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) you get a signal that aborts on its own after the given time:

```js
await axios.get("https://example.com/api/data", { signal: AbortSignal.timeout(5000) });
```

An aborted request rejects with `axios.CanceledError`, which `axios.isCancel(error)` recognises. Use `timeout` when you want axios's own error, and a signal when one limit should cover several steps or be cancelled from outside.

## How this project's client uses it

`temp-mail-plus-api` is an unofficial client for tempmail.plus. It is not affiliated with or endorsed by Temp Mail Plus.

The client creates one axios instance per address and sets the timeout to 10 seconds unless you pass another value ([src/http.client.ts](https://github.com/halitsever/temp-mail-plus-api/blob/main/src/http.client.ts)):

```ts
this.axiosInstance = axios.create({
    timeout: options?.timeout ?? 10_000,
    baseURL: this.baseUrl,
    headers: this.defaultHeaders
});
```

So you can shorten it for a test suite or lengthen it on a slow network:

```js
const TempMail = require("temp-mail-plus-api");
const inbox = new TempMail(TempMail.generateEmail().email, { timeout: 5000 });
const res = await inbox.fetchInbox();
if (!res.success) console.error(res.error); // 'timeout of 5000ms exceeded' when it fires
```

The client does not throw on a timeout. Like every other failure, it resolves to `{ success: false, error }` with the axios message, and logs the error with `console.error` first. The [signup test post](/blog/test-signup-email-flow) shows a polling loop where a short timeout per request keeps one slow answer from eating the whole test budget.

## FAQ

### What is the default timeout in axios?

0, which means no timeout. The axios README shows the option as timeout: 1000 with the comment default is 0 (no timeout).

### What error does an axios timeout throw?

An AxiosError with code ECONNABORTED and a message such as timeout of 500ms exceeded. With transitional.clarifyTimeoutError set to true the code is ETIMEDOUT instead.

### How do I set a timeout for one axios request?

Pass timeout in that request's config, for example axios.get(url, { timeout: 5000 }). It overrides the instance default for that call only.

## Related posts

- [How a form-urlencoded request body is built](/blog/x-www-form-urlencoded)
- [Calling the Temp Mail Plus endpoints from Python and Node.js](/blog/temp-mail-api-python)
- [Test a signup email flow end to end](/blog/test-signup-email-flow)
- [All posts](/blog/)
