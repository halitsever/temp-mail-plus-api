---
title: "What Is Temp Mail Plus (tempmail.plus)?"
titleTemplate: false
description: "What Temp Mail Plus (tempmail.plus) offers according to its own site: domains, mailbox lifetimes, PIN protection, and how an unofficial Node.js client reads it."
headline: "Temp Mail Plus explained: the service and its web API"
date: "2026-11-28"
keyword: "temp mail plus"
faq: [{"q": "Is Temp Mail Plus free?", "a": "Its home page describes the service as free of charge. This project's client is a separate, MIT licensed package."}, {"q": "Does Temp Mail Plus have an official API?", "a": "Its site does not mention one. This project calls the web API the site uses, unofficially and without any affiliation."}, {"q": "How long does a Temp Mail Plus mailbox last?", "a": "The site lets you choose 10 minutes, 60 minutes, 2 days or 7 days. The client has no call to set or read the lifetime."}]
---

# Temp Mail Plus explained: the service and its web API

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Temp Mail Plus is a free disposable email service at tempmail.plus. This page sums up what the service says about itself and how this project's unofficial Node.js client reads it. It is written by the client's author, who has no connection to Temp Mail Plus.</p>

`temp-mail-plus-api` is an unofficial client for tempmail.plus. It is not affiliated with or endorsed by Temp Mail Plus. Everything about the service below comes from the [tempmail.plus](https://tempmail.plus/en/) home page as it read on 28 November 2026. Anything the site does not say is marked as unknown.

## What the service says it is

The site describes itself as a disposable mail service for anonymous use, provided free of charge, and says a one-time address can protect you from spam and promotional newsletters. Opening the site gives you an address straight away, with a button for a new random name.

## Domains

The domain menu on the site listed eight domains:

- `mailto.plus`
- `fexpost.com`
- `fexbox.org`
- `mailbox.in.ua`
- `rover.info`
- `fextemp.com`
- `any.pink`
- `merepost.com`

This project's client exports a list of nine as `TEMP_MAIL_DOMAINS`. The ninth is `chitthi.in`, which was not in the site's menu that day and whose MX record pointed at a different mail server. If you pick a domain yourself, prefer the eight above.

## Mailbox lifetime and protection

- **Lifetime:** the settings offer 10 minutes, 60 minutes, 2 days or 7 days. The site does not say what happens to mail when the time is up.
- **PIN code:** an inbox can be protected by a PIN code. Without one, the inbox opens with the address alone.
- **Clean-up:** you can delete single mails or destroy the whole inbox.

## Other features on the site

- A Compose tab with a form to write a message and attach files.
- Links to a privacy policy and a contact page.
- A Tor mirror address in the footer.
- The interface in 12 languages.

The site makes no claims about an API, paid plans or a service level.

## How the unofficial client reads it

The client calls the web API at `https://tempmail.plus/api` that the site itself uses ([src/http.client.ts](https://github.com/halitsever/temp-mail-plus-api/blob/main/src/http.client.ts)). It needs no key or account:

```js
import TempMail from "temp-mail-plus-api";

const { email } = TempMail.generateEmail("halit", "rover.info");
const tempMail = new TempMail(email);

const inbox = await tempMail.fetchInbox();          // GET /mails?email=...
const mail = await tempMail.fetchMailById(inbox.mail_list[0].mail_id);
await tempMail.deleteMailById(mail.mail_id);        // DELETE /mails/<id>
```

`deleteMailById` takes an optional second argument, `epin`, which is sent to the service as a form field of that name. The client does not set a PIN or a mailbox lifetime, does not send mail and does not download attachment files. Those are features of the website only. The [API reference](/reference/api) lists exactly what each method returns.

## What to keep in mind

- **It is not an official API.** Temp Mail Plus does not publish or support it. A change on their side can break the client.
- **Inboxes are public unless protected.** Treat everything sent to them as readable by others.
- **Use the real site for anything manual.** Go to [tempmail.plus](https://tempmail.plus/en/) to read mail by hand, set a PIN or choose a lifetime.

For a comparison with the official API sold by a different service, read [temp-mail.org API compared with the Temp Mail Plus client](/blog/temp-mail-org-api).

## FAQ

### Is Temp Mail Plus free?

Its home page describes the service as free of charge. This project's client is a separate, MIT licensed package.

### Does Temp Mail Plus have an official API?

Its site does not mention one. This project calls the web API the site uses, unofficially and without any affiliation.

### How long does a Temp Mail Plus mailbox last?

The site lets you choose 10 minutes, 60 minutes, 2 days or 7 days. The client has no call to set or read the lifetime.

## Related posts

- [Gmail temp mail: plus aliases, dots or a separate inbox](/blog/gmail-temp-mail)
- [How free disposable email services work](/blog/free-disposable-email)
- [temp-mail.org API compared with the Temp Mail Plus client](/blog/temp-mail-org-api)
- [All posts](/blog/)
