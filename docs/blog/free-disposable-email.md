---
title: "Free Disposable Email: How These Services Work"
titleTemplate: false
description: "What happens behind a free disposable email address: domains and MX records, catch-all inboxes, mailbox lifetimes, public inboxes and reading one from code."
headline: "How free disposable email services work"
date: "2026-11-28"
keyword: "free disposable email"
faq: [{"q": "Is disposable email really free?", "a": "Many services are free to use in the browser, tempmail.plus and Mailinator's public inboxes among them. Paid or verified plans usually add private inboxes, your own domain, longer storage or API access."}, {"q": "Can someone else read my disposable inbox?", "a": "Usually yes. Most free inboxes are opened with only the address, so anyone who knows or guesses it can read the mail, unless the service offers a PIN or a private plan."}]
---

# How free disposable email services work

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">A free disposable email service hands out an address, shows whatever arrives for it and forgets it later. There is no account and usually no password. The mechanics behind that are simple, and knowing them explains both what these services are good for and why so many sites block them.</p>

## The service owns the domains

Every disposable address sits on a domain the service controls. The domain's MX records tell other mail servers where to deliver its mail. You can check this yourself:

```bash
dig +short MX mailto.plus
```

On 28 November 2026 that returned `1 mx.fex.plus.`, and so did eight of the nine domains that this project's client knows about (`TEMP_MAIL_DOMAINS` in [src/index.ts](https://github.com/halitsever/temp-mail-plus-api/blob/main/src/index.ts)). The ninth, `chitthi.in`, pointed at a different mail server.

## Any name works

The service's mail server accepts mail for every name on its domains. Nobody registers `anything@mailto.plus` first; the inbox exists as soon as mail arrives for it. The Temp Mail API listing on RapidAPI states the same for temp-mail.org: you can generate any address on their domains without telling the API first ([RapidAPI listing](https://rapidapi.com/Privatix/api/temp-mail)).

That is why `generateEmail()` in this client builds an address locally, with no request at all. It joins a random 8-character username from `a-z` and `0-9` with one of the domains:

```js
import TempMail from "temp-mail-plus-api";

const { email, username, domain } = TempMail.generateEmail();
// for example "k3v9q0xw@rover.info"
```

## Mail is kept for a while, then dropped

Disposable services keep mail for a limited time. tempmail.plus lets you pick a mailbox lifetime of 10 minutes, 60 minutes, 2 days or 7 days on its home page ([tempmail.plus](https://tempmail.plus/en/)). Other services set their own limits. Mailinator's pricing page lists "Temporary Storage" for its free public inboxes and permanent storage only on paid plans ([Mailinator pricing](https://www.mailinator.com/pricing/)).

Treat a disposable inbox as a mailbox you will lose. Read what you need soon after it arrives.

## Inboxes are public by default

Because there is no sign-up, the address is the only key. Anyone who types the same address into the site sees the same mail. Some services add protection on top: tempmail.plus can protect an inbox with a PIN code, and Mailinator offers private inboxes on a private domain in its plans above the free public one.

The client in this project reads an inbox with the address and nothing else, which is the same thing a stranger could do. Send test data only, never real credentials. The [FAQ](/guide/faq#are-the-inboxes-private) says the same.

## What these services are good for

- Signing up somewhere once, without giving out your real address.
- Receiving a confirmation link or a one-time code in a test.
- Keeping newsletters and trial offers out of your own inbox.

They are a bad fit for anything you need to recover later: password resets on an account you care about, receipts, or messages with personal data.

## Why sites block them

The same features make disposable addresses attractive for fake sign-ups. Many sites check the domain at registration against a public list. The [disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains) list has more than 10,000 entries, and its README quotes a PyPI admin saying PyPI uses it to block such domains from creating accounts. [Detecting disposable email domains in Node.js](/blog/detect-disposable-email-domains) shows how to run that check in your own app.

## Reading a disposable inbox from code

If you need the mail in a script rather than a browser tab, a client saves you from scraping a web page:

```js
import TempMail from "temp-mail-plus-api";

const { email } = TempMail.generateEmail();
const tempMail = new TempMail(email);

const inbox = await tempMail.fetchInbox();
for (const item of inbox.mail_list ?? []) {
  console.log(item.mail_id, item.from_mail, item.subject);
}
```

`temp-mail-plus-api` is an unofficial client for tempmail.plus. It is not affiliated with or endorsed by Temp Mail Plus. See the [getting started guide](/guide/getting-started) for reading and deleting single mails, or the [free temp mail API page](/node-temp-mail/) for a copy-paste starter.

## FAQ

### Is disposable email really free?

Many services are free to use in the browser, tempmail.plus and Mailinator's public inboxes among them. Paid or verified plans usually add private inboxes, your own domain, longer storage or API access.

### Can someone else read my disposable inbox?

Usually yes. Most free inboxes are opened with only the address, so anyone who knows or guesses it can read the mail, unless the service offers a PIN or a private plan.

## Related posts

- [How to detect disposable email domains in Node.js](/blog/detect-disposable-email-domains)
- [Mailinator alternatives for testing signup emails](/blog/mailinator-alternatives)
- [Temp Mail Plus explained: the service and its web API](/blog/what-is-temp-mail-plus)
- [All posts](/blog/)
