---
title: "Detect Disposable Email Domains in Node.js"
titleTemplate: false
description: "Derive the domain from an email address in Node.js, match it and its parent domains against a disposable domain blocklist, and test it with real domains."
headline: "How to detect disposable email domains in Node.js"
date: "2026-11-28"
keyword: "remove disposable domains when deriving domain from email"
faq: [{"q": "Why match parent domains and not only the exact domain?", "a": "The blocklist stores registrable domains. A subdomain such as mail.example-temp.com should still be caught when example-temp.com is listed, which only a parent check does."}, {"q": "Is there an API instead of a local list?", "a": "Some vendors offer one, but a local copy of an open list has no network call and no rate limit. Update the file on a schedule."}]
---

# How to detect disposable email domains in Node.js

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Two jobs come up again and again: blocking throwaway addresses at sign-up, and deriving a company domain from a work email without counting temp mail domains as companies. Both start the same way. Take the domain out of the address correctly, then compare it with a maintained list of disposable domains.</p>

## Step 1: derive the domain from the address

Split at the last `@`, not the first. A quoted local part may contain an `@` of its own, and the domain is always what follows the last one. Then normalise the result: lower case, no surrounding spaces, no trailing dot.

```js
export function domainOf(email) {
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) return null;
  return email.slice(at + 1).trim().toLowerCase().replace(/\.$/, "");
}

domainOf("Jane.Doe@Example.COM"); // "example.com"
domainOf("no-at-sign");           // null
```

## Step 2: get a blocklist

The most widely used open list is [disposable-email-domains/disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains). It is a plain text file, `disposable_email_blocklist.conf`, with one domain per line, released under CC0. On 28 November 2026 it had more than 10,000 lines. Its README is honest about the limits: the maintainers cannot guarantee that every entry is still disposable, only that it was at some point.

There is also an npm package called `disposable-email-domains`, but its README now says the repository is no longer maintained and points elsewhere. Check the date of the last update before you depend on any list.

## Step 3: match the domain and its parents

The README asks implementers to match on the registrable domain: `@xxx.yyy.zzz` should match `yyy.zzz` in the list. So check the full domain and every parent above it, but not the top-level domain on its own. That also handles domains on a public suffix, such as `mailbox.in.ua`, which the list stores with three labels.

```js
import { readFileSync } from "node:fs";

const blocklist = new Set(
  readFileSync("disposable_email_blocklist.conf", "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean),
);

export function isDisposable(email) {
  const domain = domainOf(email);
  if (!domain) return false;
  const parts = domain.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    if (blocklist.has(parts.slice(i).join("."))) return true;
  }
  return false;
}
```

Load the file once at start-up, not per request. A `Set` lookup per label is cheap.

## Deriving a company domain without the noise

When you group sign-ups by company, a throwaway domain is not a company. Return `null` for those, and do the same for the free mail providers you choose to ignore:

```js
const FREE_MAIL = new Set(["gmail.com", "outlook.com", "yahoo.com"]);

export function companyDomain(email) {
  if (isDisposable(email)) return null;
  const domain = domainOf(email);
  return domain && !FREE_MAIL.has(domain) ? domain : null;
}
```

The free mail set above is an example. Build your own from your data.

## Test it with real disposable domains

You need addresses you know are disposable. This project's client exports nine of them as `TEMP_MAIL_DOMAINS`, and on 28 November 2026 all nine were in the blocklist above. That makes them a handy fixture:

```js
import { test } from "node:test";
import assert from "node:assert";
import TempMail from "temp-mail-plus-api";
import { isDisposable, companyDomain } from "./disposable.mjs";

test("flags every temp mail domain", () => {
  for (const domain of TempMail.TEMP_MAIL_DOMAINS) {
    const { email } = TempMail.generateEmail(undefined, domain);
    assert.ok(isDisposable(email), email);
    assert.strictEqual(companyDomain(email), null);
  }
});

test("keeps a normal company address", () => {
  assert.strictEqual(companyDomain("jane@example.com"), "example.com");
});
```

`generateEmail` builds the address locally and sends no request, so this test runs offline. If you also want to prove that your sign-up form refuses such an address in a real browser, see [testing signup emails end to end](/blog/test-signup-email-flow).

## What a blocklist cannot do

- New disposable domains appear all the time. A list is always behind.
- Some services let users bring their own domain, which no shared list can know.
- A false positive locks out a real person. Show a clear message such as "Please use a permanent email address" instead of a generic error, and give people a way to contact you.

For background on why these domains exist at all, read [how free disposable email services work](/blog/free-disposable-email). `temp-mail-plus-api` is an unofficial client for tempmail.plus. It is not affiliated with or endorsed by Temp Mail Plus.

## FAQ

### Why match parent domains and not only the exact domain?

The blocklist stores registrable domains. A subdomain such as mail.example-temp.com should still be caught when example-temp.com is listed, which only a parent check does.

### Is there an API instead of a local list?

Some vendors offer one, but a local copy of an open list has no network call and no rate limit. Update the file on a schedule.

## Related posts

- [How free disposable email services work](/blog/free-disposable-email)
- [Mailinator alternatives for testing signup emails](/blog/mailinator-alternatives)
- [Test a signup email flow end to end](/blog/test-signup-email-flow)
- [Checking an email address in JavaScript, and where to stop](/blog/email-validation-javascript)
- [All posts](/blog/)
