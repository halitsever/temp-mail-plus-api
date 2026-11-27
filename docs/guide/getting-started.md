---
title: Temporary email API quick start
description: Install temp-mail-plus-api, generate a temporary email address, read its inbox, open a mail and delete it from Node.js or TypeScript in a few lines.
---

# Temporary email API quick start

`temp-mail-plus-api` is an unofficial client for the tempmail.plus disposable email service. This page takes you from install to a mail you can read in code. The project is not affiliated with Temp Mail Plus.

## Install

```bash
npm install temp-mail-plus-api
```

The package ships its own TypeScript definitions. Its only runtime dependency is `axios`.

## Import the client

The package is CommonJS and works with both module systems.

```js
// ES modules and TypeScript
import TempMail from "temp-mail-plus-api";
```

```js
// CommonJS
const TempMail = require("temp-mail-plus-api");
```

## Generate an address

`generateEmail` is a static method. It builds the address locally and sends no request.

```js
// random username, random domain
const { email, username, domain } = TempMail.generateEmail();

// your username, random domain
const a = TempMail.generateEmail("halit");

// your username and one of the supported domains
const b = TempMail.generateEmail("halit", "fexpost.com");
```

A random username is 8 characters from `a-z` and `0-9`. The domain comes from the [supported domains list](/guide/faq#which-domains-can-i-use).

You do not have to generate anything. Any address on a supported domain works, so you can also write one by hand.

## Read the inbox

Create a client for the address, then ask for the inbox.

```js
const tempMail = new TempMail(email);
const inbox = await tempMail.fetchInbox();

if (inbox.success) {
  for (const item of inbox.mail_list ?? []) {
    console.log(item.mail_id, item.from_mail, item.subject);
  }
}
```

`fetchInbox` returns a summary of each mail. To read the body you need the `mail_id` from that summary.

## Open one mail

```js
const mail = await tempMail.fetchMailById(32944585);

if (mail.success) {
  console.log(mail.subject);
  console.log(mail.text);
}
```

The full mail carries `text` and `html` bodies and a list of attachments with a name, size and type for each.

## Delete a mail

```js
const deleted = await tempMail.deleteMailById(32944585);
console.log(deleted.success);
```

## Check for failures

The three request methods do not throw. A failed request resolves to an object with `success: false` and an `error` message, so check `success` before you read anything else.

```js
const inbox = await tempMail.fetchInbox();

if (!inbox.success) {
  console.warn("Inbox request failed:", inbox.error);
}
```

The client also prints the underlying error with `console.error` when a request fails. The constructor and `setEmail` are the only calls that throw, and only when the address has no `@`.

## Set a timeout

Requests time out after 10 seconds by default. Pass your own value in milliseconds as the second constructor argument.

```js
const tempMail = new TempMail("halit@rover.info", { timeout: 5000 });
```

## Switch to another address

One client can move between inboxes.

```js
tempMail.setEmail("someone@mailto.plus");
```

## Next steps

- The [API reference](/reference/api) lists every method with its return shape.
- The [email testing guide](/guide/email-testing) shows how to wait for a signup or OTP mail in an automated test.
- The [FAQ](/guide/faq) covers the limits of an unofficial client.
