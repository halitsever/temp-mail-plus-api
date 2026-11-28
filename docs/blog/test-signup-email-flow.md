---
title: "Testing Signup Emails End to End with Playwright"
titleTemplate: false
description: "A Playwright test that signs up with a fresh disposable address, polls the inbox with expect.poll, opens the confirmation link and cleans up after itself."
headline: "Test a signup email flow end to end"
date: "2026-11-28"
keyword: "best temp mail api for automation"
faq: [{"q": "Do I need an API key to read the inbox in this test?", "a": "No. temp-mail-plus-api sends no key or token. It is unofficial and depends on tempmail.plus staying the way it is."}, {"q": "Why does the test poll instead of waiting for a webhook?", "a": "The client has no webhook or stream. Polling with expect.poll is the simplest reliable way to wait for a mail."}]
---

# Test a signup email flow end to end

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">A unit test can check that your code calls the mailer. Only an end-to-end test shows that a real person gets the mail and that the link inside it works. This page builds that test with Playwright and temp-mail-plus-api: fresh address, sign-up form, inbox polling, confirmation link, clean-up.</p>

`temp-mail-plus-api` is an unofficial client for tempmail.plus. It is not affiliated with or endorsed by Temp Mail Plus. The test depends on a third-party service, so keep the number of such tests small and keep unit tests offline, as the [email testing guide](/guide/email-testing#keep-unit-tests-offline) explains.

## What the test does

1. Generate a new address, so no mail from an earlier run can match.
2. Fill in the sign-up form in a real browser.
3. Poll the inbox until the confirmation mail arrives.
4. Open the mail, take the link out of it and visit it.
5. Check that the account is confirmed, then delete the mail.

## Setup

```bash
npm install --save-dev @playwright/test temp-mail-plus-api
npx playwright install chromium
```

## The test

```js
// tests/signup-email.spec.mjs
import { test, expect } from "@playwright/test";
import TempMail from "temp-mail-plus-api";

test("signup sends a working confirmation link", async ({ page }) => {
  const { email } = TempMail.generateEmail();
  const tempMail = new TempMail(email);

  await page.goto("/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("a-test-only-password");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Check your inbox")).toBeVisible();

  let mailId;
  await expect
    .poll(
      async () => {
        const inbox = await tempMail.fetchInbox();
        const hit = inbox.success ? (inbox.mail_list ?? []).find((m) => m.subject.includes("Confirm")) : undefined;
        mailId = hit?.mail_id;
        return Boolean(hit);
      },
      { message: "confirmation mail should arrive", timeout: 60_000, intervals: [2_000] },
    )
    .toBe(true);

  const mail = await tempMail.fetchMailById(mailId);
  expect(mail.success, mail.error).toBe(true);

  const link = mail.html?.match(/href="([^"]+\/confirm[^"]*)"/)?.[1];
  expect(link, "the mail should contain a confirmation link").toBeTruthy();

  await page.goto(link);
  await expect(page.getByText("Email confirmed")).toBeVisible();

  await tempMail.deleteMailById(mailId);
});
```

The labels, button names, texts and the `/confirm` pattern belong to an imaginary app. Replace them with your own.

## Why it is written this way

- **`expect.poll` instead of a sleep.** Playwright's `expect.poll` calls the function until the assertion passes or the timeout ends ([Playwright docs](https://playwright.dev/docs/test-assertions)). Its default timeout is 5 seconds and its default intervals start at 100 ms, both too short and too eager for mail, so the test sets a 60 second timeout and a 2 second interval.
- **A failed inbox request is not a failed test.** `fetchInbox` resolves to `{ success: false, error }` on a network error instead of throwing, so the poll simply tries again.
- **Match on the subject.** A fresh address should only ever get your mail, but matching on the subject makes the intent clear and survives a welcome mail sent next to the confirmation.
- **Read `html` for links.** Many mails carry the link only in the HTML part. Use `text` when your mail has a plain-text body with the link.
- **Delete at the end.** Inboxes on disposable services are public unless protected, so do not leave anything behind that you would not post.

## When the mail never arrives

- Your app or your email provider may refuse disposable domains. If you block them with a list, as in [detecting disposable email domains](/blog/detect-disposable-email-domains), allow them in the test environment, or test the refusal message instead.
- The service may be slow or down. That fails the test for reasons outside your code, which is the main cost of any receiving-inbox test.
- Try another entry of `TEMP_MAIL_DOMAINS` with `TempMail.generateEmail(undefined, "rover.info")`.

## Run it in CI

Mark the test so it runs on a schedule or before a release, not on every push, and give it a retry. Playwright's `retries` option in the config does that. If the test needs a contract and support, a paid testing inbox is a better fit; [Mailinator alternatives for testing](/blog/mailinator-alternatives) compares the options.

## FAQ

### Do I need an API key to read the inbox in this test?

No. temp-mail-plus-api sends no key or token. It is unofficial and depends on tempmail.plus staying the way it is.

### Why does the test poll instead of waiting for a webhook?

The client has no webhook or stream. Polling with expect.poll is the simplest reliable way to wait for a mail.

## Related posts

- [How to detect disposable email domains in Node.js](/blog/detect-disposable-email-domains)
- [Mailinator alternatives for testing signup emails](/blog/mailinator-alternatives)
- [Calling the Temp Mail Plus endpoints from Python and Node.js](/blog/temp-mail-api-python)
- [All posts](/blog/)
