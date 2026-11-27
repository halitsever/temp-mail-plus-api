---
title: API reference
description: Every public method of temp-mail-plus-api with parameters and real return shapes, including the success false and error convention for failed requests.
---

# API reference

Everything the package exports, taken from `src/index.ts` and `src/types.ts`. The client talks to tempmail.plus and is unofficial. It is not affiliated with Temp Mail Plus.

## Exports

| Export | Kind | What it is |
| --- | --- | --- |
| `TempMail` (default) | class | The client. Its class name in the source is `TempMailInstance`. |
| `TEMP_MAIL_DOMAINS` | readonly array | The supported domains. Also available as `TempMail.TEMP_MAIL_DOMAINS`. |
| `TempMailDomain` | type | Union of the strings in `TEMP_MAIL_DOMAINS`. |

The response interfaces below live in `src/types.ts`. The package entry does not re-export them by name. TypeScript still infers them from the method return types.

## The result convention

`fetchInbox`, `fetchMailById` and `deleteMailById` never reject. Each one resolves to a `Partial` of its response type, which means TypeScript treats every field as optional.

- On success you get the JSON that the service returned, with `success: true` added.
- On failure you get exactly `{ success: false, error }`. `error` is the message of the error that was caught, for example a timeout or an HTTP status message.

```ts
const inbox = await tempMail.fetchInbox();

if (!inbox.success) {
  console.warn(inbox.error);
}
```

`success` is set by this library and tells you the HTTP request completed. `result` is a separate boolean that comes from the service's own JSON and is passed through untouched.

A failed request is also logged with `console.error` by the HTTP layer before the method resolves.

## `new TempMail(email, options?)`

Creates a client bound to one address.

| Parameter | Type | Notes |
| --- | --- | --- |
| `email` | `string` | Must contain `@`. |
| `options.timeout` | `number` | Request timeout in milliseconds. Defaults to `10000`. |

Throws `Error: Invalid email address: "<value>"` when `email` has no `@`. No request is sent by the constructor.

## `TempMail.generateEmail(username?, domain?)`

Static. Builds an address without any network request.

| Parameter | Type | Default |
| --- | --- | --- |
| `username` | `string` | 8 random characters from `a-z0-9` |
| `domain` | `TempMailDomain` | A random entry of `TEMP_MAIL_DOMAINS` |

Returns a `GeneratedEmail`:

```ts
interface GeneratedEmail {
  email: string;    // `${username}@${domain}`
  username: string;
  domain: string;
}
```

## `setEmail(email)`

Points the client at another address. Returns nothing. Throws the same error as the constructor when the address has no `@`.

## `fetchInbox()`

Lists the mails in the current inbox. Returns `Promise<Partial<InboxResponse>>`.

```ts
interface InboxResponse {
  success: boolean;
  error?: string | null;
  count: number;
  first_id: number;
  last_id: number;
  limit: number;
  mail_list: MailItem[];
  more: boolean;
  result: boolean;
}

interface MailItem {
  attachment_count: number;
  first_attachment_name: string;
  from_mail: string;
  from_name: string;
  is_new: boolean;
  mail_id: number;
  subject: string;
  time: string;
}
```

A successful call sets `error: null` and `success: true`. Example output:

```json
{
  "error": null,
  "count": 1,
  "first_id": 123,
  "last_id": 123,
  "limit": 10,
  "mail_list": [
    {
      "attachment_count": 0,
      "first_attachment_name": "",
      "from_mail": "sender@example.com",
      "from_name": "Sender",
      "is_new": true,
      "mail_id": 123,
      "subject": "Hello",
      "time": "2024-01-01T00:00:00Z"
    }
  ],
  "more": false,
  "result": true,
  "success": true
}
```

The client does not page through results. `more`, `first_id`, `last_id` and `limit` are passed through as the service sends them.

## `fetchMailById(mail_id)`

Fetches one mail in full. `mail_id` is a `number` taken from a `MailItem`. Returns `Promise<Partial<MailResponse>>`.

```ts
interface MailResponse {
  success: boolean;
  error?: string | null;
  attachments: Attachment[];
  date: Date;
  from: string;
  from_is_local: boolean;
  from_mail: string;
  from_name: string;
  html: string;
  is_tls: boolean;
  mail_id: number;
  message_id: string;
  result: boolean;
  subject: string;
  text: string;
  to: string;
}

interface Attachment {
  name: string;
  size: number;
  type: string;
}
```

Attachments are described by name, size and type. The client has no method that downloads their content.

`date` is typed as `Date`, but the value arrives as parsed JSON and the client does not convert it. Pass it through `new Date(...)` before you call date methods on it.

## `deleteMailById(mail_id, epin?)`

Deletes one mail from the current inbox. Returns `Promise<Partial<DeleteResponse>>`.

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `mail_id` | `number` | | From a `MailItem` or a `MailResponse`. |
| `epin` | `string` | `''` | Sent to the service as the `epin` form field. |

```ts
interface DeleteResponse {
  success: boolean;
  result: boolean;
  error?: string | null;
}
```

Example output of a successful delete:

```json
{ "result": true, "success": true }
```

## `TEMP_MAIL_DOMAINS`

```ts
const TEMP_MAIL_DOMAINS = [
  "mailto.plus",
  "fexpost.com",
  "fexbox.org",
  "mailbox.in.ua",
  "rover.info",
  "chitthi.in",
  "fextemp.com",
  "any.pink",
  "merepost.com",
] as const;
```

With `require()`, read it from the class:

```js
const TempMail = require("temp-mail-plus-api");
console.log(TempMail.TEMP_MAIL_DOMAINS);
```

## `TempMailOptions`

```ts
interface TempMailOptions {
  timeout?: number;
}
```
