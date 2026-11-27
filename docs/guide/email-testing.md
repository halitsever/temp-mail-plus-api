---
title: Email testing API for Node.js tests
description: Use a disposable email API to receive signup and OTP emails in automated tests. A working Node.js example with polling, code extraction and cleanup.
---

# Email testing API for Node.js tests

Some features only prove themselves once a real email lands: signup confirmation, password reset, a one-time code. This guide uses `temp-mail-plus-api` as a disposable email API inside an automated test. The test creates a fresh address, triggers the email, waits for it and reads the code out of the body.

The library is an unofficial client for tempmail.plus and is not affiliated with Temp Mail Plus. Read [the limits](#limits-to-know-before-you-rely-on-it) before you put it in a pipeline.

## The flow

1. Generate a new address for the test.
2. Give that address to the app under test, for example by filling in the signup form.
3. Poll the inbox until the expected mail arrives.
4. Fetch the full mail and pull out the link or code.
5. Delete the mail.

## Wait for a mail

The client has no built-in wait. `fetchInbox` returns what is in the inbox right now, so the test polls it. This helper checks every two seconds and gives up after a deadline.

```js
// wait-for-mail.mjs
export async function waitForMail(tempMail, matches, { timeout = 30_000, interval = 2_000 } = {}) {
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    const inbox = await tempMail.fetchInbox();

    // a failed request is retried on the next round instead of ending the test
    const hit = inbox.success ? (inbox.mail_list ?? []).find(matches) : undefined;
    if (hit) return tempMail.fetchMailById(hit.mail_id);

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`No matching mail within ${timeout} ms`);
}
```

`matches` receives a `MailItem`, so you can filter on `subject`, `from_mail` or `from_name`. Matching on the sender and the subject together keeps the test from picking up an unrelated message.

## Receive an OTP email in a test

This example uses the Node.js test runner. `requestSignup` and `confirmSignup` stand in for your own code: an HTTP call to your API, a Playwright step or anything else that makes your app send the mail.

```js
// signup.test.mjs
import { test } from "node:test";
import assert from "node:assert";
import TempMail from "temp-mail-plus-api";
import { waitForMail } from "./wait-for-mail.mjs";
import { requestSignup, confirmSignup } from "./app-under-test.mjs";

test("signup sends a working verification code", async () => {
  const { email } = TempMail.generateEmail();
  const tempMail = new TempMail(email);

  await requestSignup(email);

  const mail = await waitForMail(tempMail, (m) => m.subject.includes("verification code"));
  assert.strictEqual(mail.success, true, mail.error);

  // adjust the pattern to the format your app sends
  const code = mail.text.match(/\b\d{6}\b/)?.[0];
  assert.ok(code, "the mail should contain a 6 digit code");

  await confirmSignup(email, code);
  await tempMail.deleteMailById(mail.mail_id);
});
```

A few details matter here.

- `generateEmail()` gives every run its own inbox, so an old mail from a previous run cannot satisfy the test.
- `fetchMailById` resolves to `{ success: false, error }` when the request fails. Asserting on `success` first gives a clear failure message.
- For a confirmation link, read `mail.html` or `mail.text` and match the URL instead of digits.

## TypeScript

The same code works in TypeScript. The methods return `Partial` types, so the compiler asks you to handle missing fields:

```ts
const mail = await waitForMail(tempMail, (m) => m.subject.includes("verification code"));
const code = mail.text?.match(/\b\d{6}\b/)?.[0];
```

## Keep unit tests offline

Use the real inbox for a small number of end-to-end tests. For unit tests, stub the client so nothing leaves the machine. The library's own test suite works this way.

```js
import { test } from "node:test";
import assert from "node:assert";
import TempMail from "temp-mail-plus-api";

test("handles an empty inbox", async (t) => {
  t.mock.method(TempMail.prototype, "fetchInbox", async () => ({
    success: true,
    error: null,
    count: 0,
    mail_list: [],
  }));

  const inbox = await new TempMail("halit@rover.info").fetchInbox();
  assert.strictEqual(inbox.mail_list.length, 0);
});
```

## Limits to know before you rely on it

- **It depends on a third party.** The test passes through tempmail.plus, a service this project does not control. An outage or a change on their side fails your test for reasons that have nothing to do with your code.
- **Inboxes are public.** The client reads an inbox with nothing but the address. Anyone who knows or guesses the address can do the same. Send test data only, never real credentials or personal data.
- **Your mail provider may refuse disposable domains.** If your app or your sending service blocks them, the mail will never arrive. Try the other entries of `TEMP_MAIL_DOMAINS` or allow the domain in your test environment.
- **Poll gently.** The repository documents no rate limit. A two second interval and a 30 second deadline are a reasonable starting point.
- **Failures are logged.** A failed request prints to `console.error` from inside the client, which can add noise to test output while the helper retries.

For the full list of methods and fields, see the [API reference](/reference/api).
