---
title: "temp-mail.org API vs Temp Mail Plus API"
titleTemplate: false
description: "How the temp-mail.org API on RapidAPI works, with keys, plans and MD5 inbox lookups, compared with reading tempmail.plus through an unofficial Node.js client."
headline: "temp-mail.org API compared with the Temp Mail Plus client"
date: "2026-11-28"
keyword: "temp-mail.org api"
faq: [{"q": "Is temp-mail.org the same as tempmail.plus?", "a": "No. They are separate services with different domains. temp-mail.org offers an API through RapidAPI; tempmail.plus publishes no API."}, {"q": "Does the temp-mail.org API need a key?", "a": "Yes. Its RapidAPI listing is called through RapidAPI, which requires a RapidAPI key on every request, even on the $0 plan."}]
---

# temp-mail.org API compared with the Temp Mail Plus client

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">temp-mail.org and tempmail.plus are different services with similar names. temp-mail.org sells an official API through RapidAPI. tempmail.plus publishes no API, and this project reads it through the same web API its site uses. Here is how the two compare for a developer.</p>

The temp-mail.org details come from its listing on RapidAPI, published by Privatix ([Temp Mail on RapidAPI](https://rapidapi.com/Privatix/api/temp-mail)), read on 28 November 2026. The tempmail.plus details come from this project's [source code](https://github.com/halitsever/temp-mail-plus-api/blob/main/src/index.ts). This project has no connection to either company. `temp-mail-plus-api` is an unofficial client for tempmail.plus. It is not affiliated with or endorsed by Temp Mail Plus.

## How the temp-mail.org API works

The listing describes the flow in six steps:

1. Generate an address using one of their domain names.
2. Sign up on the site that needs a confirmation mail.
3. The site sends mail to that address.
4. The mail reaches their SMTP server and is stored.
5. You call the API with the MD5 hash of the address.
6. You get the list of mails.

It also says you can generate any address without notifying the API first. The endpoints listed are: domains list, get emails, get one message, source message, delete message, and calls for message attachments. Responses come in JSON or XML (with JSONP, PHP and HTML also listed), chosen by a `/format/...` suffix on the request.

Access goes through RapidAPI, so every request carries your RapidAPI key. The listing showed four plans on the day we read it: BASIC at $0, PRO at $19, ULTRA at $59 and MEGA at $99, and a note that the API is free to use with a limit of 30 requests per second.

## How the Temp Mail Plus client works

tempmail.plus has no published API. The client calls `https://tempmail.plus/api` directly, as the site's own pages do, and sends no key or token ([src/http.client.ts](https://github.com/halitsever/temp-mail-plus-api/blob/main/src/http.client.ts)):

| Call | Request |
| --- | --- |
| `fetchInbox()` | `GET /mails?email=<address>` |
| `fetchMailById(id)` | `GET /mails/<id>?email=<address>` |
| `deleteMailById(id)` | `DELETE /mails/<id>` with `email` and `epin` form fields |
| `generateEmail()` | No request: the address is built locally |

The inbox is looked up by the plain address, not a hash.

```js
import TempMail from "temp-mail-plus-api";

const tempMail = new TempMail("halit@rover.info");
const inbox = await tempMail.fetchInbox();
if (inbox.success) console.log(inbox.count, inbox.mail_list);
```

## Side by side

| | temp-mail.org API | tempmail.plus via this client |
| --- | --- | --- |
| Official | Yes, published by the provider | No, unofficial |
| Key | RapidAPI key | None |
| Cost | Plans from $0 on RapidAPI | Free, MIT licensed package |
| Inbox lookup | MD5 hash of the address | The address itself |
| Formats | JSON, XML and more | JSON |
| Attachments | Listing has attachment calls | Name, size and type only |
| Support | Provider feedback form | GitHub issues on this project |
| Can break without notice | Covered by the provider's terms | Yes, when the site changes |

## Which one to pick

Choose the temp-mail.org API when you want a documented contract, a support channel and a plan you can pay for. Its MD5 lookup and RapidAPI key add a little setup.

Choose tempmail.plus through this client when you want no key and no account, for example a few end-to-end tests or a script. Accept that the API behind it is not documented for outside use, so a change on their side can break calls until the package catches up. Every request method resolves to `{ success: false, error }` instead of throwing, which makes those failures easy to spot.

The [getting started guide](/guide/getting-started) covers the client in full, and the [Python and Node.js comparison](/blog/temp-mail-api-python) shows the same requests from Python.

## FAQ

### Is temp-mail.org the same as tempmail.plus?

No. They are separate services with different domains. temp-mail.org offers an API through RapidAPI; tempmail.plus publishes no API.

### Does the temp-mail.org API need a key?

Yes. Its RapidAPI listing is called through RapidAPI, which requires a RapidAPI key on every request, even on the $0 plan.

## Related posts

- [Mailinator alternatives for testing signup emails](/blog/mailinator-alternatives)
- [Temp Mail Plus explained: the service and its web API](/blog/what-is-temp-mail-plus)
- [Calling the Temp Mail Plus endpoints from Python and Node.js](/blog/temp-mail-api-python)
- [All posts](/blog/)
