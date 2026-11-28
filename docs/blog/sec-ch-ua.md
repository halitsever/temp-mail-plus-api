---
title: "Sec-CH-UA Header: What Chrome Sends and Why"
titleTemplate: false
description: "What the Sec-CH-UA header contains, why it lists a fake brand, which hints Chrome sends without Accept-CH, and how to set these headers in axios from Node.js."
headline: "Reading the Sec-CH-UA client hint, with real request headers"
date: "2026-11-28"
keyword: "sec-ch-ua"
faq: [{"q": "What is the Sec-CH-UA header?", "a": "A user agent client hint. MDN describes it as the browser's branding and significant version information, sent as a comma-separated list of brands with a version for each."}, {"q": "Why does Sec-CH-UA contain Not A Brand?", "a": "MDN says the header may include fake brands in any position and with any name, so that servers cannot reject unknown browsers outright by matching an exact list."}, {"q": "Do I need Accept-CH to receive Sec-CH-UA?", "a": "No. MDN calls it a low entropy hint that is sent by default. Higher entropy hints, such as the full version list or the CPU architecture, are only sent after the server asks for them with Accept-CH."}]
---

# Reading the Sec-CH-UA client hint, with real request headers

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Sec-CH-UA is a request header Chromium browsers send next to User-Agent. It names the browser brands and their major versions in a structured list. This post shows what it contains, with headers captured from a real Chrome, and why this project's Node.js client sends a copy of it.</p>

## What it looks like

These headers were captured on 28 November 2026 from headless Google Chrome 157 on Linux, loading a page from a local server:

```http
sec-ch-ua: "Not-A.Brand";v="99", "Google Chrome";v="157", "Chromium";v="157"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Linux"
user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/157.0.0.0 Safari/537.36
```

The syntax, from [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-CH-UA), is a list of `"<brand>";v="<significant version>"` entries. Here there are three: a fake brand, Google Chrome and Chromium, each with major version 157.

One detail stands out. The User-Agent string says `HeadlessChrome`, while Sec-CH-UA says `Google Chrome`. The two headers are produced separately, so a server that reads only one of them sees a different picture.

## The fake brand

`"Not-A.Brand";v="99"` is not a browser. MDN explains that the header may include fake brands in any position and with any name, a feature meant to stop servers from rejecting unknown user agents outright. The name and position change between releases: MDN's own examples show `"(Not(A:Brand";v="8"` and `" Not A;Brand";v="99"`. Code that parses the header should look for the brands it cares about and ignore the rest.

## Low and high entropy hints

MDN calls Sec-CH-UA a low entropy hint, sent by default without the server opting in. Chrome sent `Sec-CH-UA-Mobile` and `Sec-CH-UA-Platform` the same way on the first request.

Other hints only arrive after the server asks. The local server answered the first request with:

```http
Accept-CH: Sec-CH-UA-Full-Version-List, Sec-CH-UA-Arch
```

and Chrome's next request carried two more headers:

```http
sec-ch-ua-arch: "x86"
sec-ch-ua-full-version-list: "Not-A.Brand";v="99.0.0.0", "Google Chrome";v="157.0.8103.78", "Chromium";v="157.0.8103.78"
```

MDN marks the header as experimental and limited to secure contexts in some browsers. The test above used `http://localhost`, which browsers treat as secure. MDN also notes that the feature is not Baseline because it does not work in some of the most widely used browsers, so a server must keep working without it.

## The same data in JavaScript

Pages can read the low entropy values without any header:

```js
navigator.userAgentData.brands;
// [{ brand: "Not-A.Brand", version: "99" }, { brand: "Google Chrome", version: "157" }, { brand: "Chromium", version: "157" }]
navigator.userAgentData.platform; // "Linux"
navigator.userAgentData.mobile;   // false
```

That was the output in the same headless Chrome.

## Why a Node.js client sends it

`temp-mail-plus-api` is an unofficial client for tempmail.plus. It is not affiliated with or endorsed by Temp Mail Plus.

Node.js and axios send no client hints of their own. This client sets a fixed set of headers on its axios instance that imitate desktop Chrome 138 on macOS ([src/http.client.ts](https://github.com/halitsever/temp-mail-plus-api/blob/main/src/http.client.ts)):

```ts
'sec-ch-ua-platform': '"macOS"',
'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
'sec-ch-ua-mobile': '?0',
'X-Requested-With': 'XMLHttpRequest',
'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
```

A local test server received exactly these values on every request. The site's web API is what its own pages call, so the client makes its requests look like the ones the page makes. The values are frozen: they will keep saying Chrome 138 until someone edits the file, and the project's guidelines say to change them only on purpose.

## Setting headers in axios

The client shows the usual pattern. Headers given to `axios.create` apply to every request from that instance, and a request can add or override one:

```js
const axios = require("axios");

const api = axios.create({
  baseURL: "https://example.com/api",
  headers: { "User-Agent": "my-tool/1.0", Accept: "application/json" },
});

await api.get("/items", { headers: { "X-Request-Id": "abc123" } });
api.defaults.headers.common["Authorization"] = "Bearer <token>";
```

Browsers do not let page scripts set `User-Agent` or any `Sec-` header, which are forbidden request headers. In Node.js there is no such rule, which is why a server cannot trust any of these values to identify a client.

## What to use it for

Client hints are a cleaner way to read a browser's brand and platform than parsing the User-Agent string, for example to pick a download for the visitor's operating system. They are not a security check. Anything a browser sends can be sent by a script, as the headers above show.

## FAQ

### What is the Sec-CH-UA header?

A user agent client hint. MDN describes it as the browser's branding and significant version information, sent as a comma-separated list of brands with a version for each.

### Why does Sec-CH-UA contain Not A Brand?

MDN says the header may include fake brands in any position and with any name, so that servers cannot reject unknown browsers outright by matching an exact list.

### Do I need Accept-CH to receive Sec-CH-UA?

No. MDN calls it a low entropy hint that is sent by default. Higher entropy hints, such as the full version list or the CPU architecture, are only sent after the server asks for them with Accept-CH.

## Related posts

- [Setting a timeout in axios and handling the error](/blog/axios-timeout)
- [How a form-urlencoded request body is built](/blog/x-www-form-urlencoded)
- [Temp Mail Plus explained: the service and its web API](/blog/what-is-temp-mail-plus)
- [All posts](/blog/)
