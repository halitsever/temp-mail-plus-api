---
title: Free Temp Mail API for Node.js, No API Key
titleTemplate: false
description: A free temp mail API for Node.js and TypeScript with no API key. Copy ten lines to create a disposable address, read the inbox and delete a mail.
faq:
  - q: Is this temp mail API free?
    a: The package is MIT licensed and costs nothing. It calls tempmail.plus, a service that describes itself as free of charge. There is no paid tier.
  - q: Do I need an API key or an account?
    a: No. The client sends no key or token, and there is nowhere to configure one. An address on a supported domain is all it needs.
  - q: Is it an official Temp Mail Plus API?
    a: No. It is an unofficial community project, not affiliated with or endorsed by Temp Mail Plus. It calls the web API the tempmail.plus site uses, which the service does not document.
  - q: Can it send mail or download attachments?
    a: No. It reads and deletes mail. For attachments it returns the name, size and type only.
---

# A free temp mail API for Node.js in ten lines

<p class="lead">Create a disposable email address, read its inbox and delete a mail from Node.js or TypeScript. No API key, no account, no sign-up: install one package and copy the script below.</p>

::: warning Unofficial
`temp-mail-plus-api` is an unofficial community project. It is not affiliated with or endorsed by Temp Mail Plus. It calls the web API behind [tempmail.plus](https://tempmail.plus/en/), which can change without notice.
:::

## Install

```bash
npm install temp-mail-plus-api
```

Node.js with `import` or `require()` both work, and TypeScript definitions ship with the package. The only runtime dependency is `axios`.

## The whole thing

Save this as `inbox.mjs` and run `node inbox.mjs`. It makes an address, waits for you to send a mail to it, prints the mail and deletes it.

```js
import TempMail from "temp-mail-plus-api";

const { email } = TempMail.generateEmail();
console.log("Send a mail to", email);
const tempMail = new TempMail(email);

let inbox;
do {
  await new Promise((r) => setTimeout(r, 3000));
  inbox = await tempMail.fetchInbox();
} while (!inbox.mail_list?.length);

const mail = await tempMail.fetchMailById(inbox.mail_list[0].mail_id);
console.log(mail.from_mail, mail.subject, mail.text);
await tempMail.deleteMailById(mail.mail_id);
```

The loop checks every three seconds and stops at the first mail. Add a deadline before you put it in a test; the [email testing guide](/guide/email-testing#wait-for-a-mail) has a helper with one.

## What each call does

| Call | What it does | Sends a request |
| --- | --- | --- |
| `TempMail.generateEmail(username?, domain?)` | Builds an address: a random 8-character name and a random supported domain, or yours | No |
| `new TempMail(email, { timeout })` | A client for one inbox; the timeout defaults to 10 seconds | No |
| `fetchInbox()` | The list of mails in the inbox, with `mail_id`, sender and subject | Yes |
| `fetchMailById(mail_id)` | One mail in full: `text`, `html`, attachment names and sizes | Yes |
| `deleteMailById(mail_id)` | Deletes one mail | Yes |
| `setEmail(email)` | Points the same client at another inbox | No |

The three request methods never throw. A failed request resolves to `{ success: false, error }`, so check `success` before you read the result. Every return shape is in the [API reference](/reference/api).

## What "free" means here

- **No API key.** The client sends no key or token, so there is nothing to sign up for. See [src/http.client.ts](https://github.com/halitsever/temp-mail-plus-api/blob/main/src/http.client.ts).
- **No cost.** The package is MIT licensed. tempmail.plus describes its service as free of charge.
- **No guarantee.** There is no service level and no support contract. If tempmail.plus changes its web API or blocks scripted requests, calls return `success: false` until the package is updated.
- **No privacy.** Anyone who knows an address can read its inbox. Use it for test mail and throwaway sign-ups, never for real credentials or personal data.

## TypeScript

```ts
import TempMail from "temp-mail-plus-api";

const tempMail = new TempMail(TempMail.generateEmail("ci-run", "rover.info").email);
const inbox = await tempMail.fetchInbox();
const subjects: string[] = (inbox.mail_list ?? []).map((m) => m.subject);
```

The second argument of `generateEmail` is typed as one of the domains in `TEMP_MAIL_DOMAINS`, so a typo in the domain is a compile error.

## Where to go next

- [Getting started](/guide/getting-started): each method step by step.
- [Email testing in automated tests](/guide/email-testing): wait for an OTP or signup mail in a Node.js test.
- [Test a signup email flow end to end](/blog/test-signup-email-flow): the same with Playwright in a real browser.
- [Mailinator alternatives for testing](/blog/mailinator-alternatives): when a paid testing inbox fits better.
- [FAQ and limits](/guide/faq): what can break and why.

## FAQ

### Is this temp mail API free?

The package is MIT licensed and costs nothing. It calls tempmail.plus, a service that describes itself as free of charge. There is no paid tier.

### Do I need an API key or an account?

No. The client sends no key or token, and there is nowhere to configure one. An address on a supported domain is all it needs.

### Is it an official Temp Mail Plus API?

No. It is an unofficial community project, not affiliated with or endorsed by Temp Mail Plus. It calls the web API the tempmail.plus site uses, which the service does not document.

### Can it send mail or download attachments?

No. It reads and deletes mail. For attachments it returns the name, size and type only.
