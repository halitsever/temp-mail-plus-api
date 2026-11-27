---
title: FAQ and limits
description: What temp-mail-plus-api can and cannot do. Unofficial status, what can break, supported disposable email domains, privacy of inboxes and error handling.
---

# FAQ and limits

Short answers about what this client is, what it depends on and where it stops.

## Is this an official Temp Mail Plus API?

No. `temp-mail-plus-api` is an unofficial community project. It is not affiliated with or endorsed by Temp Mail Plus. It calls the web API behind tempmail.plus at `https://tempmail.plus/api`, which the service does not document for outside use.

## Is it free? Do I need an API key?

The package is MIT licensed and free to use. It sends no API key or token. There is nowhere in the client to configure one.

## What can break?

The client depends on a service it does not control. These are the realistic failure cases:

- The service changes an endpoint or a response field. Calls start failing or the typed fields no longer match what comes back.
- The service starts rejecting scripted requests. The client sends headers that look like a desktop Chrome browser, and that may stop being enough.
- The service is down or slow. Requests time out after 10 seconds unless you set another `timeout`.
- A domain is retired. The domain list is hard-coded in the package, so it can go stale between releases.

In each case the request methods resolve to `{ success: false, error }` instead of throwing. Check `success` on every call. If something broke on the service side, open an [issue](https://github.com/halitsever/temp-mail-plus-api/issues).

## Which domains can I use?

Nine domains are built in and exported as `TEMP_MAIL_DOMAINS`:

| Domain |
| --- |
| `mailto.plus` |
| `fexpost.com` |
| `fexbox.org` |
| `mailbox.in.ua` |
| `rover.info` |
| `chitthi.in` |
| `fextemp.com` |
| `any.pink` |
| `merepost.com` |

`generateEmail()` picks one at random. Pass a domain as the second argument to choose it. The constructor itself only checks that the address contains `@`, so it will not stop you from using a domain outside this list. Whether such an address receives mail is up to the service.

```js
import TempMail from "temp-mail-plus-api";

console.log(TempMail.TEMP_MAIL_DOMAINS);
```

A named import, `import { TEMP_MAIL_DOMAINS } from "temp-mail-plus-api"`, also works with the code on `main`. `TempMail.TEMP_MAIL_DOMAINS` works in every setup.

## Are the inboxes private?

No. The client reads an inbox with only the address, and so can anyone else who knows it. Use these inboxes for throwaway and test mail. Do not send passwords, personal data or anything you would mind a stranger reading.

## Can it send email?

No. The client reads and deletes. It has no method for sending.

## Can I download attachments?

Not with this client. `fetchMailById` returns the name, size and type of each attachment. There is no method that fetches the file content.

## Can I wait for a mail to arrive?

There is no built-in wait, webhook or stream. Call `fetchInbox` in a loop. The [email testing guide](/guide/email-testing#wait-for-a-mail) has a helper you can copy.

## How long does an address or a mail live?

The repository does not say, and the client has no call that reports it. Retention is decided by tempmail.plus. Read a mail soon after it arrives and do not treat an inbox as storage.

## Is there a rate limit?

None is documented in the repository. Keep polling intervals at a second or more and stop once you have what you need.

## Why did nothing throw when my request failed?

That is by design. `fetchInbox`, `fetchMailById` and `deleteMailById` catch request errors and resolve to `{ success: false, error }`. The constructor and `setEmail` throw only for an address without `@`. Details are in the [API reference](/reference/api#the-result-convention).

You will still see the raw error in your logs, because the HTTP layer prints it with `console.error` before the method resolves.

## Does it run in the browser?

It is written and tested for Node.js. The repository makes no claim about browsers.

## Which version am I getting from npm?

The `version` in `package.json` can trail what is on the `main` branch, and releases are published by hand. If a detail on this site does not match your installed copy, compare it with the source on [GitHub](https://github.com/halitsever/temp-mail-plus-api).
