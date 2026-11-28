---
title: "Temp Mail and Email Testing Guides for Developers"
titleTemplate: false
description: "Guides on disposable email for developers: Gmail aliases, how temp mail services work, blocking disposable domains, Mailinator alternatives and signup tests."
---

# Temp mail and email testing blog

<p class="lead">Articles about disposable email from a developer's side: what the services do, how to read an inbox from code, how to block throwaway domains in your own app and how to test signup mail. They are written by the author of temp-mail-plus-api, an unofficial Node.js client for tempmail.plus that is not affiliated with Temp Mail Plus.</p>

## [Gmail temp mail: plus aliases, dots or a separate inbox](/blog/gmail-temp-mail)

Can Gmail give you a temporary email? What plus addressing and dot aliases really do, where they fall short, and when a disposable inbox is the better choice.

## [How free disposable email services work](/blog/free-disposable-email)

What happens behind a free disposable email address: domains and MX records, catch-all inboxes, mailbox lifetimes, public inboxes and reading one from code.

## [How to detect disposable email domains in Node.js](/blog/detect-disposable-email-domains)

Derive the domain from an email address in Node.js, match it and its parent domains against a disposable domain blocklist, and test it with real domains.

## [Mailinator alternatives for testing signup emails](/blog/mailinator-alternatives)

Mailinator alternatives for developers and QA: Mailtrap, MailSlurp, Mailosaur, Ethereal, Mail.tm, Maildrop and tempmail.plus, from each vendor's own site.

## [temp-mail.org API compared with the Temp Mail Plus client](/blog/temp-mail-org-api)

How the temp-mail.org API on RapidAPI works, with keys, plans and MD5 inbox lookups, compared with reading tempmail.plus through an unofficial Node.js client.

## [Temp Mail Plus explained: the service and its web API](/blog/what-is-temp-mail-plus)

What Temp Mail Plus (tempmail.plus) offers according to its own site: domains, mailbox lifetimes, PIN protection, and how an unofficial Node.js client reads it.

## [Calling the Temp Mail Plus endpoints from Python and Node.js](/blog/temp-mail-api-python)

Read a tempmail.plus inbox from Node.js with temp-mail-plus-api, and see what the same three requests look like in Python with requests. No API key needed.

## [Test a signup email flow end to end](/blog/test-signup-email-flow)

A Playwright test that signs up with a fresh disposable address, polls the inbox with expect.poll, opens the confirmation link and cleans up after itself.
